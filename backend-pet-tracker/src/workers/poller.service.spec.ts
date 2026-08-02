import {
  GetQueueUrlCommand,
  SendMessageCommand,
  SQSClient,
} from '@aws-sdk/client-sqs';
import { QUEUE_POSITIONS_RAW } from '@/aws/constants';
import type { WialonClient } from '@/integrations/wialon/wialon-client.interface';
import { CLAIM_WATERMARK_LOOKBACK_MINUTES } from '@/modules/devices/application/use-cases/claim-device.use-case';
import type { RawPosition } from '@/pipeline/types';
import type { ActiveAssignment, IngestionStore } from './ingestion-store';
import { PollerService, POSITIONS_PER_MESSAGE_MAX } from './poller.service';

const QUEUE_URL = 'http://localhost:4566/000000000000/positions-raw';
const NOW = new Date('2026-08-01T12:00:00.000Z');

function assignment(overrides: Partial<ActiveAssignment> = {}): ActiveAssignment {
  return {
    deviceId: 'device-1',
    petId: 'pet-1',
    unitId: '900001',
    ingestWatermark: new Date('2026-08-01T11:55:00.000Z'),
    ...overrides,
  };
}

function positionAt(ts: number): RawPosition {
  return { lat: 19.4326, lng: -99.1332, ts };
}

interface SqsStub {
  client: SQSClient;
  send: jest.Mock;
  sentBodies: () => unknown[];
  getQueueUrlCalls: () => number;
}

function sqsStub(): SqsStub {
  const send = jest.fn((command: unknown) => {
    if (command instanceof GetQueueUrlCommand) {
      return Promise.resolve({ QueueUrl: QUEUE_URL });
    }
    if (command instanceof SendMessageCommand) {
      return Promise.resolve({ MessageId: 'msg' });
    }
    return Promise.reject(new Error('unexpected command'));
  });

  return {
    client: { send } as unknown as SQSClient,
    send,
    sentBodies: () =>
      send.mock.calls
        .filter(([command]) => command instanceof SendMessageCommand)
        .map(([command]) =>
          JSON.parse(
            (command as SendMessageCommand).input.MessageBody as string,
          ),
        ),
    getQueueUrlCalls: () =>
      send.mock.calls.filter(
        ([command]) => command instanceof GetQueueUrlCommand,
      ).length,
  };
}

function storeStub(assignments: ActiveAssignment[]): jest.Mocked<IngestionStore> {
  return {
    listActiveAssignments: jest.fn().mockResolvedValue(assignments),
    advanceWatermark: jest.fn().mockResolvedValue(undefined),
    isAssignmentActive: jest.fn().mockResolvedValue(true),
    getDeviceBattery: jest.fn().mockResolvedValue(null),
    updateDeviceTelemetry: jest.fn().mockResolvedValue(undefined),
    updatePetLastPosition: jest.fn().mockResolvedValue(undefined),
  };
}

function wialonStub(positions: RawPosition[]): jest.Mocked<WialonClient> {
  return {
    listUnits: jest.fn().mockResolvedValue([]),
    getMessages: jest.fn().mockResolvedValue(positions),
  };
}

function makeService(
  store: IngestionStore,
  wialon: WialonClient,
  sqs: SQSClient,
): PollerService {
  return new PollerService(store, wialon, sqs);
}

describe('R9: poller — asignaciones activas -> getMessages(unitId, watermark, now) -> SQS {version:1,...} en lotes <=100', () => {
  it('pide getMessages con (unitId, watermark, now) por cada asignacion activa', async () => {
    const first = assignment();
    const second = assignment({
      deviceId: 'device-2',
      petId: 'pet-2',
      unitId: '900002',
      ingestWatermark: new Date('2026-08-01T11:50:00.000Z'),
    });
    const wialon = wialonStub([positionAt(NOW.getTime() - 30_000)]);
    const service = makeService(
      storeStub([first, second]),
      wialon,
      sqsStub().client,
    );

    await service.runOnce(NOW);

    expect(wialon.getMessages).toHaveBeenCalledTimes(2);
    expect(wialon.getMessages).toHaveBeenNthCalledWith(
      1,
      '900001',
      first.ingestWatermark!.getTime(),
      NOW.getTime(),
    );
    expect(wialon.getMessages).toHaveBeenNthCalledWith(
      2,
      '900002',
      second.ingestWatermark!.getTime(),
      NOW.getTime(),
    );
  });

  it('con ingest_watermark NULL usa now - CLAIM_WATERMARK_LOOKBACK_MINUTES como inicio', async () => {
    const wialon = wialonStub([]);
    const service = makeService(
      storeStub([assignment({ ingestWatermark: null })]),
      wialon,
      sqsStub().client,
    );

    await service.runOnce(NOW);

    expect(wialon.getMessages).toHaveBeenCalledWith(
      '900001',
      NOW.getTime() - CLAIM_WATERMARK_LOOKBACK_MINUTES * 60_000,
      NOW.getTime(),
    );
  });

  it('publica body {version: 1, deviceId, petId, unitId, positions} con a lo sumo 100 posiciones por mensaje', async () => {
    const positions = Array.from({ length: 250 }, (_, i) =>
      positionAt(NOW.getTime() - (250 - i) * 30_000),
    );
    const sqs = sqsStub();
    const service = makeService(
      storeStub([assignment()]),
      wialonStub(positions),
      sqs.client,
    );

    await service.runOnce(NOW);

    const bodies = sqs.sentBodies() as Array<{
      version: number;
      deviceId: string;
      petId: string;
      unitId: string;
      positions: RawPosition[];
    }>;
    expect(bodies).toHaveLength(3);
    expect(bodies.map((b) => b.positions.length)).toEqual([100, 100, 50]);
    expect(POSITIONS_PER_MESSAGE_MAX).toBe(100);
    for (const body of bodies) {
      expect(body.version).toBe(1);
      expect(body.deviceId).toBe('device-1');
      expect(body.petId).toBe('pet-1');
      expect(body.unitId).toBe('900001');
    }
    // Todas las posiciones viajan, en orden.
    expect(bodies.flatMap((b) => b.positions)).toEqual(positions);
  });

  it('resuelve la QueueUrl por nombre (QUEUE_POSITIONS_RAW) una sola vez y la cachea entre ciclos', async () => {
    const sqs = sqsStub();
    const service = makeService(
      storeStub([assignment()]),
      wialonStub([positionAt(NOW.getTime() - 30_000)]),
      sqs.client,
    );

    await service.runOnce(NOW);
    await service.runOnce(NOW);

    expect(sqs.getQueueUrlCalls()).toBe(1);
    const getQueueUrl = sqs.send.mock.calls.find(
      ([command]) => command instanceof GetQueueUrlCommand,
    )![0] as GetQueueUrlCommand;
    expect(getQueueUrl.input.QueueName).toBe(QUEUE_POSITIONS_RAW);
    const sendMessage = sqs.send.mock.calls.find(
      ([command]) => command instanceof SendMessageCommand,
    )![0] as SendMessageCommand;
    expect(sendMessage.input.QueueUrl).toBe(QUEUE_URL);
  });
});

describe('R10: watermark avanza tras publicar y solo si hubo mensajes; fallo de publicacion no avanza', () => {
  it('avanza el watermark al ts del ultimo mensaje, solo despues de publicar', async () => {
    const lastTs = NOW.getTime() - 30_000;
    const positions = [
      positionAt(lastTs - 60_000),
      positionAt(lastTs),
      positionAt(lastTs - 30_000),
    ];
    const store = storeStub([assignment()]);
    const sqs = sqsStub();
    const service = makeService(store, wialonStub(positions), sqs.client);

    await service.runOnce(NOW);

    expect(store.advanceWatermark).toHaveBeenCalledTimes(1);
    expect(store.advanceWatermark).toHaveBeenCalledWith(
      'device-1',
      new Date(lastTs),
    );

    // Despues de publicar, nunca antes (orden de invocacion).
    const lastSendOrder = Math.max(
      ...sqs.send.mock.invocationCallOrder.filter((_, i) =>
        Boolean(sqs.send.mock.calls[i][0] instanceof SendMessageCommand),
      ),
    );
    const advanceOrder = store.advanceWatermark.mock.invocationCallOrder[0];
    expect(advanceOrder).toBeGreaterThan(lastSendOrder);
  });

  it('sin posiciones en el intervalo el watermark no cambia', async () => {
    const store = storeStub([assignment()]);
    const service = makeService(store, wialonStub([]), sqsStub().client);

    await service.runOnce(NOW);

    expect(store.advanceWatermark).not.toHaveBeenCalled();
  });

  it('si la publicacion a SQS falla el watermark no avanza (at-least-once)', async () => {
    const store = storeStub([assignment()]);
    const send = jest.fn((command: unknown) => {
      if (command instanceof GetQueueUrlCommand) {
        return Promise.resolve({ QueueUrl: QUEUE_URL });
      }
      return Promise.reject(new Error('sqs unavailable'));
    });
    const service = makeService(
      store,
      wialonStub([positionAt(NOW.getTime() - 30_000)]),
      { send } as unknown as SQSClient,
    );

    // R11 exige ademas que el ciclo no explote; aqui solo importa el watermark.
    await service.runOnce(NOW).catch(() => undefined);

    expect(store.advanceWatermark).not.toHaveBeenCalled();
  });
});
