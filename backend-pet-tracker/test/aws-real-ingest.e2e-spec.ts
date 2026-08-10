import { randomUUID } from 'crypto';
import {
  DeleteMessageCommand,
  GetQueueUrlCommand,
  ReceiveMessageCommand,
  SendMessageCommand,
} from '@aws-sdk/client-sqs';
import type { Message, SQSClient } from '@aws-sdk/client-sqs';
import { PutEventsCommand } from '@aws-sdk/client-eventbridge';
import type { EventBridgeClient } from '@aws-sdk/client-eventbridge';
import {
  DeleteCommand,
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
} from '@aws-sdk/lib-dynamodb';
import { config as loadDotenv } from 'dotenv';
import {
  createDynamoDbClient,
  createEventBridgeClient,
  createSqsClient,
  resolveAwsConfigFromEnv,
} from '../src/aws/aws-clients';
import {
  DETAIL_TYPE_POSITION_UPDATED,
  EVENT_BUS_NAME,
  EVENT_SOURCE,
  QUEUE_GEOFENCE_EVENTS,
  QUEUE_POSITIONS_RAW,
  TABLE_POSITIONS,
  TABLE_POSITIONS_PARTITION_KEY,
  TABLE_POSITIONS_SORT_KEY,
  TABLE_POSITIONS_TTL_ATTRIBUTE,
} from '../src/aws/constants';

loadDotenv({ path: '../.env', quiet: true });

const runAwsIngest =
  (process.env.AWS_MODE ?? '').trim().toLowerCase() === 'aws';
const RECEIVE_ATTEMPTS = 3;

function assertNoStaticAccessKey(): void {
  if (process.env.AWS_ACCESS_KEY_ID) {
    throw new Error(
      'AWS_ACCESS_KEY_ID debe estar ausente para usar la sesión de aws login',
    );
  }
}

async function receiveMatchingMessage(
  client: SQSClient,
  queueUrl: string,
  matches: (message: Message) => boolean,
): Promise<Message> {
  for (let attempt = 0; attempt < RECEIVE_ATTEMPTS; attempt += 1) {
    const response = await client.send(
      new ReceiveMessageCommand({
        QueueUrl: queueUrl,
        MaxNumberOfMessages: 10,
        VisibilityTimeout: 5,
        WaitTimeSeconds: 20,
      }),
    );
    const message = response.Messages?.find(matches);

    if (message) {
      return message;
    }
  }

  throw new Error('mensaje e2e no recibido después de 60 segundos');
}

async function deleteReceivedMessage(
  client: SQSClient,
  queueUrl: string,
  message: Message,
): Promise<void> {
  if (!message.ReceiptHandle) {
    throw new Error('mensaje e2e recibido sin ReceiptHandle');
  }

  await client.send(
    new DeleteMessageCommand({
      QueueUrl: queueUrl,
      ReceiptHandle: message.ReceiptHandle,
    }),
  );
}

function eventHasRunId(message: Message, runId: string): boolean {
  try {
    const event = JSON.parse(message.Body ?? '') as {
      detail?: { runId?: string };
    };
    return event.detail?.runId === runId;
  } catch {
    return false;
  }
}

(runAwsIngest ? describe : describe.skip)('R21: ingest contra AWS real', () => {
  const runId = randomUUID();
  let sqs: SQSClient | undefined;
  let events: EventBridgeClient | undefined;
  let documents: DynamoDBDocumentClient | undefined;
  let positionsQueueUrl: string | undefined;
  let geofenceQueueUrl: string | undefined;
  let pendingRawBody: string | undefined;
  let pendingEventRunId: string | undefined;
  let positionKey: { pk: string; sk: number } | undefined;

  beforeAll(() => {
    assertNoStaticAccessKey();
    const config = resolveAwsConfigFromEnv(process.env);

    sqs = createSqsClient(config);
    events = createEventBridgeClient(config);
    documents = DynamoDBDocumentClient.from(createDynamoDbClient(config));
  });

  afterAll(async () => {
    const cleanup: Promise<unknown>[] = [];

    if (documents && positionKey) {
      cleanup.push(
        documents.send(
          new DeleteCommand({
            TableName: TABLE_POSITIONS,
            Key: {
              [TABLE_POSITIONS_PARTITION_KEY]: positionKey.pk,
              [TABLE_POSITIONS_SORT_KEY]: positionKey.sk,
            },
          }),
        ),
      );
    }
    if (sqs && positionsQueueUrl && pendingRawBody) {
      const cleanupClient = sqs;
      const cleanupQueueUrl = positionsQueueUrl;
      const cleanupBody = pendingRawBody;

      cleanup.push(
        receiveMatchingMessage(
          cleanupClient,
          cleanupQueueUrl,
          (message) => message.Body === cleanupBody,
        ).then((message) =>
          deleteReceivedMessage(cleanupClient, cleanupQueueUrl, message),
        ),
      );
    }
    if (sqs && geofenceQueueUrl && pendingEventRunId) {
      const cleanupClient = sqs;
      const cleanupQueueUrl = geofenceQueueUrl;
      const cleanupRunId = pendingEventRunId;

      cleanup.push(
        receiveMatchingMessage(cleanupClient, cleanupQueueUrl, (message) =>
          eventHasRunId(message, cleanupRunId),
        ).then((message) =>
          deleteReceivedMessage(cleanupClient, cleanupQueueUrl, message),
        ),
      );
    }

    try {
      await Promise.all(cleanup);
    } finally {
      documents?.destroy();
      events?.destroy();
      sqs?.destroy();
    }
  }, 75000);

  it('R6: aborta si AWS_ENDPOINT_URL sigue definida', () => {
    expect(() => resolveAwsConfigFromEnv(process.env)).not.toThrow();
  });

  it('resuelve positions-raw y completa send/receive/delete', async () => {
    if (!sqs) {
      throw new Error('SQS client no inicializado');
    }

    const queue = await sqs.send(
      new GetQueueUrlCommand({ QueueName: QUEUE_POSITIONS_RAW }),
    );
    if (!queue.QueueUrl) {
      throw new Error(`queue URL ausente para ${QUEUE_POSITIONS_RAW}`);
    }
    positionsQueueUrl = queue.QueueUrl;
    pendingRawBody = JSON.stringify({ runId });

    await sqs.send(
      new SendMessageCommand({
        QueueUrl: positionsQueueUrl,
        MessageBody: pendingRawBody,
      }),
    );
    const message = await receiveMatchingMessage(
      sqs,
      positionsQueueUrl,
      (candidate) => candidate.Body === pendingRawBody,
    );

    expect(message.Body).toBe(pendingRawBody);
    await deleteReceivedMessage(sqs, positionsQueueUrl, message);
    pendingRawBody = undefined;
  }, 75000);

  it('escribe, consulta y prepara la limpieza del item DynamoDB', async () => {
    if (!documents) {
      throw new Error('DynamoDB document client no inicializado');
    }

    positionKey = { pk: `E2E#${runId}`, sk: Date.now() };
    const item = {
      [TABLE_POSITIONS_PARTITION_KEY]: positionKey.pk,
      [TABLE_POSITIONS_SORT_KEY]: positionKey.sk,
      [TABLE_POSITIONS_TTL_ATTRIBUTE]: Math.floor(Date.now() / 1000) + 3600,
      runId,
    };

    await documents.send(
      new PutCommand({ TableName: TABLE_POSITIONS, Item: item }),
    );
    const result = await documents.send(
      new QueryCommand({
        TableName: TABLE_POSITIONS,
        KeyConditionExpression: '#pk = :pk',
        ExpressionAttributeNames: {
          '#pk': TABLE_POSITIONS_PARTITION_KEY,
        },
        ExpressionAttributeValues: { ':pk': positionKey.pk },
        ConsistentRead: true,
      }),
    );

    expect(result.Items).toContainEqual(item);
  }, 30000);

  it('entrega position.updated de EventBridge en geofence-events', async () => {
    if (!sqs || !events) {
      throw new Error('clientes EventBridge/SQS no inicializados');
    }

    const queue = await sqs.send(
      new GetQueueUrlCommand({ QueueName: QUEUE_GEOFENCE_EVENTS }),
    );
    if (!queue.QueueUrl) {
      throw new Error(`queue URL ausente para ${QUEUE_GEOFENCE_EVENTS}`);
    }
    geofenceQueueUrl = queue.QueueUrl;
    pendingEventRunId = runId;

    const result = await events.send(
      new PutEventsCommand({
        Entries: [
          {
            EventBusName: EVENT_BUS_NAME,
            Source: EVENT_SOURCE,
            DetailType: DETAIL_TYPE_POSITION_UPDATED,
            Detail: JSON.stringify({ version: 1, runId }),
          },
        ],
      }),
    );
    expect(result.FailedEntryCount ?? 0).toBe(0);

    const message = await receiveMatchingMessage(
      sqs,
      geofenceQueueUrl,
      (candidate) => eventHasRunId(candidate, runId),
    );

    expect(eventHasRunId(message, runId)).toBe(true);
    await deleteReceivedMessage(sqs, geofenceQueueUrl, message);
    pendingEventRunId = undefined;
  }, 75000);
});
