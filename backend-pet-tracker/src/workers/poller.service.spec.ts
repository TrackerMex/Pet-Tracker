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

// Mocks como propiedades jest.Mock (no metodos de interface): evita el
// falso positivo de @typescript-eslint/unbound-method en los expect().
type MockOf<T> = { [K in keyof T]: jest.Mock };

function assignment(
  overrides: Partial<ActiveAssignment> = {},
): ActiveAssignment {
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
        .map(
          ([command]) =>
            JSON.parse(
              (command as SendMessageCommand).input.MessageBody as string,
            ) as unknown,
        ),
    getQueueUrlCalls: () =>
      send.mock.calls.filter(
        ([command]) => command instanceof GetQueueUrlCommand,
      ).length,
  };
}

function storeStub(assignments: ActiveAssignment[]): MockOf<IngestionStore> {
  return {
    listActiveAssignments: jest.fn().mockResolvedValue(assignments),
    advanceWatermark: jest.fn().mockResolvedValue(undefined),
    isAssignmentActive: jest.fn().mockResolvedValue(true),
    getDeviceBattery: jest.fn().mockResolvedValue(null),
    updateDeviceTelemetry: jest.fn().mockResolvedValue(undefined),
    updatePetLastPosition: jest.fn().mockResolvedValue(undefined),
  };
}

function wialonStub(positions: RawPosition[]): MockOf<WialonClient> {
  return {
    listUnits: jest.fn().mockResolvedValue([]),
    getMessages: jest.fn().mockResolvedValue(positions),
  };
}

function makeService(
  store: MockOf<IngestionStore>,
  wialon: MockOf<WialonClient>,
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
    const commands = (sqs.send.mock.calls as [unknown][]).map(
      ([command]) => command,
    );
    const getQueueUrl = commands.find(
      (command) => command instanceof GetQueueUrlCommand,
    ) as GetQueueUrlCommand;
    expect(getQueueUrl.input.QueueName).toBe(QUEUE_POSITIONS_RAW);
    const sendMessage = commands.find(
      (command) => command instanceof SendMessageCommand,
    ) as SendMessageCommand;
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
    const sendCalls = sqs.send.mock.calls as [unknown][];
    const lastSendOrder = Math.max(
      ...sqs.send.mock.invocationCallOrder.filter(
        (_, i) => sendCalls[i][0] instanceof SendMessageCommand,
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

describe('R11: aislamiento — error por device no aborta el ciclo; LocalStack caido no tumba el proceso; sin solape', () => {
  it('un getMessages que falla no impide polear y publicar los demas devices', async () => {
    const failing = assignment();
    const healthy = assignment({
      deviceId: 'device-2',
      petId: 'pet-2',
      unitId: '900002',
    });
    const store = storeStub([failing, healthy]);
    const sqs = sqsStub();
    const wialon: MockOf<WialonClient> = {
      listUnits: jest.fn().mockResolvedValue([]),
      getMessages: jest
        .fn()
        .mockRejectedValueOnce(new Error('wialon down for device-1'))
        .mockResolvedValueOnce([positionAt(NOW.getTime() - 30_000)]),
    };
    const service = makeService(store, wialon, sqs.client);

    await expect(service.runOnce(NOW)).resolves.toBeUndefined();

    expect(wialon.getMessages).toHaveBeenCalledTimes(2);
    expect(sqs.sentBodies()).toHaveLength(1);
    expect(store.advanceWatermark).toHaveBeenCalledTimes(1);
    expect(store.advanceWatermark).toHaveBeenCalledWith(
      'device-2',
      expect.any(Date),
    );
  });

  it('con SQS caido (GetQueueUrl falla) el ciclo se salta sin tumbar el proceso y reintenta al siguiente tick', async () => {
    const store = storeStub([assignment()]);
    const send = jest
      .fn()
      .mockRejectedValue(new Error('connect ECONNREFUSED 127.0.0.1:4566'));
    const service = makeService(
      store,
      wialonStub([positionAt(NOW.getTime() - 30_000)]),
      { send } as unknown as SQSClient,
    );

    await expect(service.runOnce(NOW)).resolves.toBeUndefined();
    expect(store.listActiveAssignments).not.toHaveBeenCalled();

    // Siguiente tick: la URL no quedo cacheada y se reintenta.
    await expect(service.runOnce(NOW)).resolves.toBeUndefined();
    expect(send.mock.calls.length).toBe(2);
  });

  it('mientras un ciclo sigue en curso no se inicia el siguiente (guard de solape en memoria)', async () => {
    const store = storeStub([assignment()]);
    let releaseGetMessages: (positions: RawPosition[]) => void = () =>
      undefined;
    const wialon: MockOf<WialonClient> = {
      listUnits: jest.fn().mockResolvedValue([]),
      getMessages: jest.fn().mockImplementation(
        () =>
          new Promise<RawPosition[]>((resolve) => {
            releaseGetMessages = resolve;
          }),
      ),
    };
    const service = makeService(store, wialon, sqsStub().client);

    const firstCycle = service.runOnce(NOW);
    // Deja avanzar el primer ciclo hasta el getMessages pendiente.
    await new Promise((resolve) => setImmediate(resolve));
    expect(store.listActiveAssignments).toHaveBeenCalledTimes(1);

    await service.runOnce(NOW);
    expect(store.listActiveAssignments).toHaveBeenCalledTimes(1);

    releaseGetMessages([]);
    await firstCycle;

    // Terminado el primero, el siguiente ciclo si corre.
    releaseGetMessages([]);
    const thirdCycle = service.runOnce(NOW);
    await new Promise((resolve) => setImmediate(resolve));
    expect(store.listActiveAssignments).toHaveBeenCalledTimes(2);
    releaseGetMessages([]);
    await thirdCycle;
  });
});

describe('R6 (reject-future-positions #27): el watermark nunca avanza por delante de now', () => {
  it('topa en now cuando el lote contiene una posicion futura', async () => {
    const store = storeStub([assignment()]);
    const service = makeService(
      store,
      wialonStub([
        positionAt(NOW.getTime() - 30_000),
        positionAt(NOW.getTime() + 86_400_000),
      ]),
      sqsStub().client,
    );

    await service.runOnce(NOW);

    expect(store.advanceWatermark.mock.calls[0][1].getTime()).toBe(
      NOW.getTime(),
    );
  });

  it('con posiciones pasadas conserva el ultimo ts', async () => {
    const lastTs = NOW.getTime() - 30_000;
    const store = storeStub([assignment()]);
    const service = makeService(
      store,
      wialonStub([positionAt(lastTs - 30_000), positionAt(lastTs)]),
      sqsStub().client,
    );

    await service.runOnce(NOW);

    expect(store.advanceWatermark).toHaveBeenCalledWith(
      'device-1',
      new Date(lastTs),
    );
  });
});
