import {
  DeleteMessageCommand,
  GetQueueUrlCommand,
  ReceiveMessageCommand,
  SQSClient,
} from '@aws-sdk/client-sqs';
import type { Message } from '@aws-sdk/client-sqs';
import { EventBridgeClient } from '@aws-sdk/client-eventbridge';
import type { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
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
