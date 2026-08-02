import {
  DeleteMessageCommand,
  GetQueueUrlCommand,
  ReceiveMessageCommand,
  SQSClient,
} from '@aws-sdk/client-sqs';
import type { Message } from '@aws-sdk/client-sqs';
import { EventBridgeClient } from '@aws-sdk/client-eventbridge';
import { BatchWriteCommand } from '@aws-sdk/lib-dynamodb';
import type { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { TABLE_POSITIONS } from '@/aws/constants';
import type { IngestionStore } from './ingestion-store';
import { PositionsConsumerService } from './positions-consumer.service';

const QUEUE_URL = 'http://localhost:4566/000000000000/positions-raw';
const NOW = new Date('2026-08-01T12:00:00.000Z');
const BASE_TS = NOW.getTime() - 60_000;

interface SqsQueueStub {
  client: SQSClient;
  send: jest.Mock;
  deleted: string[];
  receiveInputs: () => Array<{
    MaxNumberOfMessages?: number;
    WaitTimeSeconds?: number;
    QueueUrl?: string;
  }>;
}

function sqsQueueStub(batches: Message[][]): SqsQueueStub {
  const deleted: string[] = [];
  let index = 0;

  const send = jest.fn((command: unknown) => {
    if (command instanceof GetQueueUrlCommand) {
      return Promise.resolve({ QueueUrl: QUEUE_URL });
    }
    if (command instanceof ReceiveMessageCommand) {
      const batch = index < batches.length ? batches[index] : [];
      index += 1;
      return Promise.resolve({ Messages: batch });
    }
    if (command instanceof DeleteMessageCommand) {
      deleted.push(command.input.ReceiptHandle as string);
      return Promise.resolve({});
    }
    return Promise.reject(new Error('unexpected command'));
  });

  return {
    client: { send } as unknown as SQSClient,
    send,
    deleted,
    receiveInputs: () =>
      send.mock.calls
        .filter(([command]) => command instanceof ReceiveMessageCommand)
        .map(([command]) => (command as ReceiveMessageCommand).input),
  };
}

function storeStub(): jest.Mocked<IngestionStore> {
  return {
    listActiveAssignments: jest.fn().mockResolvedValue([]),
    advanceWatermark: jest.fn().mockResolvedValue(undefined),
    isAssignmentActive: jest.fn().mockResolvedValue(true),
    getDeviceBattery: jest.fn().mockResolvedValue(null),
    updateDeviceTelemetry: jest.fn().mockResolvedValue(undefined),
    updatePetLastPosition: jest.fn().mockResolvedValue(undefined),
  };
}

interface DocStub {
  client: DynamoDBDocumentClient;
  send: jest.Mock;
}

function docStub(): DocStub {
  const send = jest.fn().mockResolvedValue({ UnprocessedItems: {} });
  return { client: { send } as unknown as DynamoDBDocumentClient, send };
}

interface EventBridgeStub {
  client: EventBridgeClient;
  send: jest.Mock;
}

function eventBridgeStub(): EventBridgeStub {
  const send = jest.fn().mockResolvedValue({ FailedEntryCount: 0 });
  return { client: { send } as unknown as EventBridgeClient, send };
}

function validBody(
  overrides: Record<string, unknown> = {},
): Record<string, unknown> {
  return {
    version: 1,
    deviceId: 'device-1',
    petId: 'pet-1',
    unitId: '900001',
    positions: [{ lat: 19.4326, lng: -99.1332, ts: BASE_TS }],
    ...overrides,
  };
}

function message(id: string, body: unknown): Message {
  return {
    MessageId: id,
    ReceiptHandle: `rh-${id}`,
    Body: typeof body === 'string' ? body : JSON.stringify(body),
  };
}

interface Harness {
  service: PositionsConsumerService;
  sqs: SqsQueueStub;
  store: jest.Mocked<IngestionStore>;
  documents: DocStub;
  events: EventBridgeStub;
}

function makeHarness(batches: Message[][]): Harness {
  const sqs = sqsQueueStub(batches);
  const store = storeStub();
  const documents = docStub();
  const events = eventBridgeStub();
  const service = new PositionsConsumerService(
    store,
    sqs.client,
    documents.client,
    events.client,
  );
  return { service, sqs, store, documents, events };
}

describe('R12: consumer — long-polling batch <=10, zod, delete por mensaje procesado; el fallido no envenena el lote; drainOnce()', () => {
  it('recibe con MaxNumberOfMessages 10 y WaitTimeSeconds >= 1 (long-polling) y drena hasta que la cola queda vacia', async () => {
    const { service, sqs } = makeHarness([
      [message('a', validBody()), message('b', validBody())],
      [message('c', validBody())],
      [],
    ]);

    await service.drainOnce(NOW);

    const receives = sqs.receiveInputs();
    expect(receives).toHaveLength(3);
    for (const input of receives) {
      expect(input.QueueUrl).toBe(QUEUE_URL);
      expect(input.MaxNumberOfMessages).toBe(10);
      expect(input.WaitTimeSeconds).toBeGreaterThanOrEqual(1);
    }
  });

  it('procesa y borra cada mensaje valido (delete explicito por ReceiptHandle)', async () => {
    const { service, sqs } = makeHarness([
      [message('a', validBody()), message('b', validBody())],
      [],
    ]);

    await service.drainOnce(NOW);

    expect(sqs.deleted).toEqual(['rh-a', 'rh-b']);
  });

  it('un mensaje invalido en el lote no envenena: los demas se procesan y borran, el invalido queda sin borrar', async () => {
    const { service, sqs } = makeHarness([
      [
        message('ok-1', validBody()),
        message('bad', { version: 999, nope: true }),
        message('ok-2', validBody()),
      ],
      [],
    ]);

    await service.drainOnce(NOW);

    expect(sqs.deleted).toEqual(['rh-ok-1', 'rh-ok-2']);
  });
});

/** Items PutRequest enviados a DynamoDB por todos los BatchWrite del stub. */
function writtenItems(documents: DocStub): Record<string, unknown>[] {
  return documents.send.mock.calls
    .filter(([command]) => command instanceof BatchWriteCommand)
    .flatMap(([command]) => {
      const requests = (command as BatchWriteCommand).input.RequestItems?.[
        TABLE_POSITIONS
      ] as Array<{ PutRequest: { Item: Record<string, unknown> } }>;
      return requests.map((request) => request.PutRequest.Item);
    });
}

describe('R13: escritura DynamoDB — pk PET#<petId>, sk device_ts, atributos data-model, expires_at en segundos; dedupe por sk; reproceso idempotente', () => {
  it('escribe cada aceptada con pk/sk y los atributos exactos de docs/data-model.md', async () => {
    const { service, documents } = makeHarness([
      [
        message(
          'a',
          validBody({
            positions: [
              {
                lat: 19.4326,
                lng: -99.1332,
                ts: BASE_TS,
                speedKmh: 4,
                course: 90,
                altitude: 2240,
                sats: 8,
                accuracyM: 12,
                batteryPct: 87,
              },
            ],
          }),
        ),
      ],
      [],
    ]);

    await service.drainOnce(NOW);

    const items = writtenItems(documents);
    expect(items).toHaveLength(1);
    expect(items[0]).toEqual({
      pk: 'PET#pet-1',
      sk: BASE_TS,
      lat: 19.4326,
      lng: -99.1332,
      speed_kmh: 4,
      course: 90,
      altitude: 2240,
      sats: 8,
      accuracy_m: 12,
      battery_pct: 87,
      device_ts: BASE_TS,
      received_ts: NOW.getTime(),
      processed_ts: NOW.getTime(),
      flags: [],
      expires_at: Math.floor(BASE_TS / 1000) + 90 * 86_400,
    });
  });

  it('dedupea por sk dentro del lote: dos posiciones con el mismo device_ts producen un solo item', async () => {
    const { service, documents } = makeHarness([
      [
        message(
          'a',
          validBody({
            positions: [
              { lat: 19.4326, lng: -99.1332, ts: BASE_TS },
              { lat: 19.4327, lng: -99.1331, ts: BASE_TS },
              { lat: 19.4328, lng: -99.133, ts: BASE_TS + 30_000 },
            ],
          }),
        ),
      ],
      [],
    ]);

    await service.drainOnce(NOW);

    const items = writtenItems(documents);
    expect(items).toHaveLength(2);
    expect(new Set(items.map((item) => item.sk)).size).toBe(2);
  });

  it('parte lotes de mas de 25 items en BatchWrite de <=25', async () => {
    const positions = Array.from({ length: 60 }, (_, i) => ({
      lat: 19.4326,
      lng: -99.1332,
      ts: BASE_TS + i * 30_000,
    }));
    const { service, documents } = makeHarness([
      [message('a', validBody({ positions }))],
      [],
    ]);

    await service.drainOnce(NOW);

    const batchSizes = documents.send.mock.calls
      .filter(([command]) => command instanceof BatchWriteCommand)
      .map(
        ([command]) =>
          (
            (command as BatchWriteCommand).input.RequestItems?.[
              TABLE_POSITIONS
            ] as unknown[]
          ).length,
      );
    expect(batchSizes).toEqual([25, 25, 10]);
  });

  it('reintenta UnprocessedItems del BatchWrite', async () => {
    const { service, documents } = makeHarness([
      [message('a', validBody())],
      [],
    ]);
    const leftoverItem = {
      PutRequest: { Item: { pk: 'PET#pet-1', sk: BASE_TS } },
    };
    documents.send
      .mockResolvedValueOnce({
        UnprocessedItems: { [TABLE_POSITIONS]: [leftoverItem] },
      })
      .mockResolvedValueOnce({ UnprocessedItems: {} });

    await service.drainOnce(NOW);

    const batchCalls = documents.send.mock.calls.filter(
      ([command]) => command instanceof BatchWriteCommand,
    );
    expect(batchCalls).toHaveLength(2);
    expect(
      (batchCalls[1][0] as BatchWriteCommand).input.RequestItems,
    ).toEqual({ [TABLE_POSITIONS]: [leftoverItem] });
  });

  it('R14/R15 borde: un mensaje sin aceptadas se borra sin tocar cache ni emitir eventos', async () => {
    const { service, sqs, store, events } = makeHarness([
      [
        message(
          'all-invalid',
          validBody({ positions: [{ lat: 0, lng: 0, ts: BASE_TS }] }),
        ),
      ],
      [],
    ]);

    await service.drainOnce(NOW);

    expect(sqs.deleted).toEqual(['rh-all-invalid']);
    expect(store.updateDeviceTelemetry).not.toHaveBeenCalled();
    expect(store.updatePetLastPosition).not.toHaveBeenCalled();
    expect(events.send).not.toHaveBeenCalled();
  });

  it('reprocesar el mismo mensaje (redelivery) produce exactamente los mismos items', async () => {
    const body = validBody({
      positions: [
        { lat: 19.4326, lng: -99.1332, ts: BASE_TS, batteryPct: 80 },
        { lat: 19.4327, lng: -99.1331, ts: BASE_TS + 30_000, batteryPct: 79 },
      ],
    });

    const first = makeHarness([[message('a', body)], []]);
    await first.service.drainOnce(NOW);

    const second = makeHarness([[message('a', body)], []]);
    await second.service.drainOnce(NOW);

    const firstItems = writtenItems(first.documents);
    const secondItems = writtenItems(second.documents);
    expect(firstItems).toHaveLength(2);
    expect(secondItems).toEqual(firstItems);
  });
});

describe('R14: cache devices + pets.last_position con la ultima aceptada, solo si el ts entrante es mas reciente', () => {
  it('con asignacion activa actualiza devices y pets con la ultima posicion aceptada (mas reciente por ts)', async () => {
    const lastTs = BASE_TS + 60_000;
    const { service, store } = makeHarness([
      [
        message(
          'a',
          validBody({
            positions: [
              // Desordenadas a proposito: la "ultima" es la de mayor ts.
              {
                lat: 19.44,
                lng: -99.14,
                ts: lastTs,
                accuracyM: 8,
                batteryPct: 76,
              },
              { lat: 19.43, lng: -99.13, ts: BASE_TS, batteryPct: 77 },
            ],
          }),
        ),
      ],
      [],
    ]);

    await service.drainOnce(NOW);

    expect(store.isAssignmentActive).toHaveBeenCalledWith('device-1', 'pet-1');
    expect(store.updateDeviceTelemetry).toHaveBeenCalledTimes(1);
    expect(store.updateDeviceTelemetry).toHaveBeenCalledWith('device-1', {
      batteryPct: 76,
      lastMessageAt: new Date(lastTs),
    });
    expect(store.updatePetLastPosition).toHaveBeenCalledTimes(1);
    expect(store.updatePetLastPosition).toHaveBeenCalledWith(
      'pet-1',
      { lat: 19.44, lng: -99.14, ts: lastTs, accuracy: 8, battery: 76 },
      new Date(lastTs),
    );
  });

  it('sin bateria ni accuracy en la ultima aceptada cachea null, no 0', async () => {
    const { service, store } = makeHarness([
      [
        message(
          'a',
          validBody({
            positions: [{ lat: 19.43, lng: -99.13, ts: BASE_TS }],
          }),
        ),
      ],
      [],
    ]);

    await service.drainOnce(NOW);

    expect(store.updateDeviceTelemetry).toHaveBeenCalledWith('device-1', {
      batteryPct: null,
      lastMessageAt: new Date(BASE_TS),
    });
    expect(store.updatePetLastPosition).toHaveBeenCalledWith(
      'pet-1',
      { lat: 19.43, lng: -99.13, ts: BASE_TS, accuracy: null, battery: null },
      new Date(BASE_TS),
    );
  });
});

describe('R15: asignacion liberada — escribe el historico en DynamoDB pero no toca cache ni emite eventos', () => {
  it('con la asignacion liberada escribe los items bajo PET#<petId> y borra el mensaje, sin cache ni eventos', async () => {
    const { service, sqs, store, documents, events } = makeHarness([
      [message('a', validBody({ positions: [
        { lat: 19.4326, lng: -99.1332, ts: BASE_TS, batteryPct: 15 },
      ] }))],
      [],
    ]);
    store.isAssignmentActive.mockResolvedValue(false);

    await service.drainOnce(NOW);

    // Historico legitimo del periodo de asignacion: se escribe igual (R15).
    const items = writtenItems(documents);
    expect(items).toHaveLength(1);
    expect(items[0].pk).toBe('PET#pet-1');

    // Cache y bus solo reflejan collares activos.
    expect(store.updateDeviceTelemetry).not.toHaveBeenCalled();
    expect(store.updatePetLastPosition).not.toHaveBeenCalled();
    expect(events.send).not.toHaveBeenCalled();

    // El mensaje se proceso completo: se borra (no es un fallo).
    expect(sqs.deleted).toEqual(['rh-a']);
  });
});
