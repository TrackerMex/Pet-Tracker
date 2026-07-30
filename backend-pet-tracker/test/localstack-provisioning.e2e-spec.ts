import { config as loadDotenv } from 'dotenv';
import {
  DescribeTableCommand,
  DescribeTimeToLiveCommand,
  DynamoDBClient,
} from '@aws-sdk/client-dynamodb';
import {
  EventBridgeClient,
  ListEventBusesCommand,
} from '@aws-sdk/client-eventbridge';
import {
  GetPublicAccessBlockCommand,
  ListBucketsCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import {
  GetQueueAttributesCommand,
  ListQueuesCommand,
  SQSClient,
} from '@aws-sdk/client-sqs';
import {
  createDynamoDbClient,
  createEventBridgeClient,
  createS3Client,
  createSqsClient,
  resolveAwsConfigFromEnv,
} from '../src/aws/aws-clients';
import { runProvisioning } from '../src/aws/run-provisioning';
import {
  BUCKET_MEDIA,
  EVENT_BUS_NAME,
  QUEUE_NOTIFICATIONS,
  QUEUE_NOTIFICATIONS_DLQ,
  QUEUE_POSITIONS_RAW,
  QUEUE_POSITIONS_RAW_DLQ,
  TABLE_POSITIONS,
  TABLE_POSITIONS_TTL_ATTRIBUTE,
} from '../src/aws/constants';

// NOTA PARA EL REVIEWER: este archivo requiere LocalStack real levantado
// (`docker compose up -d`, ver docker-compose.yml) para pasar — es la
// verificación end-to-end que pide requirements.md con comandos `aws
// --endpoint-url=... sqs list-queues` etc. El sandbox donde se implementó
// esta feature NO tiene acceso al socket de Docker (permission denied, sin
// sudo, confirmado antes de empezar), y a diferencia de Postgres
// (feature #1, que tuvo un Postgres nativo como alternativa viable),
// LocalStack no tiene equivalente nativo: `localstack start` y
// docker-compose.yml requieren Docker incluso en community edition. Este
// archivo se escribió y se commiteó completo, pero NO se corrió con éxito
// contra un LocalStack real en esta sesión — ver progress/current.md y
// progress/impl_localstack-provisioning.md. Correrlo en una máquina con
// Docker disponible (`docker compose up -d && pnpm run test:e2e`) es el
// siguiente paso pendiente para cerrar la verificación real de R4-R14.
loadDotenv({ path: '../.env' });

interface RedrivePolicy {
  deadLetterTargetArn: string;
  maxReceiveCount: number;
}

function parseRedrivePolicy(raw: string | undefined): RedrivePolicy {
  return JSON.parse(raw ?? '{}') as RedrivePolicy;
}

function buildClients() {
  const config = resolveAwsConfigFromEnv(process.env);
  return {
    endpoint: config.endpoint,
    sqs: createSqsClient(config),
    dynamoDb: createDynamoDbClient(config),
    s3: createS3Client(config),
    eventBridge: createEventBridgeClient(config),
  };
}

describe('localstack-provisioning e2e (requiere LocalStack real — docker compose up -d)', () => {
  let sqs: SQSClient;
  let dynamoDb: DynamoDBClient;
  let s3: S3Client;
  let eventBridge: EventBridgeClient;

  beforeAll(async () => {
    const clients = buildClients();
    sqs = clients.sqs;
    dynamoDb = clients.dynamoDb;
    s3 = clients.s3;
    eventBridge = clients.eventBridge;

    // R4: primera corrida (o corrida ya idempotente si el LocalStack de CI
    // ya tenía los recursos) — debe terminar en 0 antes de verificar nada.
    const exitCode = await runProvisioning(process.env);
    expect(exitCode).toBe(0);
  }, 30000);

  afterAll(() => {
    sqs.destroy();
    dynamoDb.destroy();
    s3.destroy();
    eventBridge.destroy();
  });

  describe('R5: segunda corrida es idempotente', () => {
    it('exit code 0 en una segunda corrida inmediata, sin duplicar recursos', async () => {
      const exitCode = await runProvisioning(process.env);
      expect(exitCode).toBe(0);

      const { QueueUrls } = await sqs.send(new ListQueuesCommand({}));
      const positionsRawUrls = (QueueUrls ?? []).filter((url) =>
        url.endsWith(`/${QUEUE_POSITIONS_RAW}`),
      );
      expect(positionsRawUrls).toHaveLength(1);
    }, 30000);
  });

  describe('R6: las 4 colas SQS existen con los nombres correctos', () => {
    it('list-queues incluye las 4 URLs', async () => {
      const { QueueUrls } = await sqs.send(new ListQueuesCommand({}));
      const names = [
        QUEUE_POSITIONS_RAW,
        QUEUE_POSITIONS_RAW_DLQ,
        QUEUE_NOTIFICATIONS,
        QUEUE_NOTIFICATIONS_DLQ,
      ];

      for (const name of names) {
        expect((QueueUrls ?? []).some((url) => url.endsWith(`/${name}`))).toBe(
          true,
        );
      }
    });
  });

  describe('R7: positions-raw tiene RedrivePolicy hacia positions-raw-dlq', () => {
    it('GetQueueAttributes muestra RedrivePolicy con el ARN de la DLQ y maxReceiveCount', async () => {
      const { QueueUrls } = await sqs.send(new ListQueuesCommand({}));
      const queueUrl = (QueueUrls ?? []).find((url) =>
        url.endsWith(`/${QUEUE_POSITIONS_RAW}`),
      );
      expect(queueUrl).toBeDefined();

      const { Attributes } = await sqs.send(
        new GetQueueAttributesCommand({
          QueueUrl: queueUrl,
          AttributeNames: ['RedrivePolicy'],
        }),
      );
      const redrivePolicy = parseRedrivePolicy(Attributes?.RedrivePolicy);

      expect(redrivePolicy.deadLetterTargetArn).toEqual(
        expect.stringContaining(QUEUE_POSITIONS_RAW_DLQ),
      );
      expect(typeof redrivePolicy.maxReceiveCount).toBe('number');
    });
  });

  describe('R8: notifications tiene RedrivePolicy hacia notifications-dlq', () => {
    it('GetQueueAttributes muestra RedrivePolicy con el ARN de la DLQ y maxReceiveCount', async () => {
      const { QueueUrls } = await sqs.send(new ListQueuesCommand({}));
      const queueUrl = (QueueUrls ?? []).find((url) =>
        url.endsWith(`/${QUEUE_NOTIFICATIONS}`),
      );
      expect(queueUrl).toBeDefined();

      const { Attributes } = await sqs.send(
        new GetQueueAttributesCommand({
          QueueUrl: queueUrl,
          AttributeNames: ['RedrivePolicy'],
        }),
      );
      const redrivePolicy = parseRedrivePolicy(Attributes?.RedrivePolicy);

      expect(redrivePolicy.deadLetterTargetArn).toEqual(
        expect.stringContaining(QUEUE_NOTIFICATIONS_DLQ),
      );
      expect(typeof redrivePolicy.maxReceiveCount).toBe('number');
    });
  });

  describe('R10: tabla DynamoDB positions con pk/sk correctos', () => {
    it('DescribeTable muestra KeySchema con pk (HASH) y sk (RANGE)', async () => {
      const { Table } = await dynamoDb.send(
        new DescribeTableCommand({ TableName: TABLE_POSITIONS }),
      );

      const pk = Table?.KeySchema?.find((k) => k.AttributeName === 'pk');
      const sk = Table?.KeySchema?.find((k) => k.AttributeName === 'sk');

      expect(pk?.KeyType).toBe('HASH');
      expect(sk?.KeyType).toBe('RANGE');
      expect(
        Table?.AttributeDefinitions?.find((a) => a.AttributeName === 'pk')
          ?.AttributeType,
      ).toBe('S');
      expect(
        Table?.AttributeDefinitions?.find((a) => a.AttributeName === 'sk')
          ?.AttributeType,
      ).toBe('N');
    });
  });

  describe('R11: TTL habilitado sobre expires_at', () => {
    it('DescribeTimeToLive muestra AttributeName expires_at y TimeToLiveStatus ENABLED', async () => {
      const { TimeToLiveDescription } = await dynamoDb.send(
        new DescribeTimeToLiveCommand({ TableName: TABLE_POSITIONS }),
      );

      expect(TimeToLiveDescription?.AttributeName).toBe(
        TABLE_POSITIONS_TTL_ATTRIBUTE,
      );
      expect(TimeToLiveDescription?.TimeToLiveStatus).toBe('ENABLED');
    });
  });

  describe('R12: bucket S3 de media existe', () => {
    it('ListBuckets incluye el bucket de media', async () => {
      const { Buckets } = await s3.send(new ListBucketsCommand({}));
      expect(Buckets?.some((bucket) => bucket.Name === BUCKET_MEDIA)).toBe(
        true,
      );
    });
  });

  describe('R13: bucket S3 sin acceso público', () => {
    it('GetPublicAccessBlock muestra los 4 flags de bloqueo en true', async () => {
      const { PublicAccessBlockConfiguration } = await s3.send(
        new GetPublicAccessBlockCommand({ Bucket: BUCKET_MEDIA }),
      );

      expect(PublicAccessBlockConfiguration?.BlockPublicAcls).toBe(true);
      expect(PublicAccessBlockConfiguration?.IgnorePublicAcls).toBe(true);
      expect(PublicAccessBlockConfiguration?.BlockPublicPolicy).toBe(true);
      expect(PublicAccessBlockConfiguration?.RestrictPublicBuckets).toBe(true);
    });
  });

  describe('R14: bus EventBridge pet-tracker existe', () => {
    it('ListEventBuses incluye un bus Name: pet-tracker', async () => {
      const { EventBuses } = await eventBridge.send(
        new ListEventBusesCommand({}),
      );
      expect(EventBuses?.some((bus) => bus.Name === EVENT_BUS_NAME)).toBe(true);
    });
  });
});
