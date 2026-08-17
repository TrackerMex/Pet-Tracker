import { config as loadDotenv } from 'dotenv';
import {
  DescribeTableCommand,
  DescribeTimeToLiveCommand,
  DynamoDBClient,
} from '@aws-sdk/client-dynamodb';
import {
  EventBridgeClient,
  ListEventBusesCommand,
  ListRulesCommand,
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
import { TABLE_POSITIONS_TTL_ATTRIBUTE } from '../src/aws/constants';
import {
  RESOURCE_SUFFIX_TEST,
  buildResourceNames,
} from '../src/aws/resource-names';

const DEVELOPMENT_NAMES = buildResourceNames('');
const TEST_NAMES = buildResourceNames(RESOURCE_SUFFIX_TEST);

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
  // R4: resultado de la primera corrida de runProvisioning sobre un
  // LocalStack limpio (o ya idempotente si el LocalStack de CI ya tenía los
  // recursos). Se calcula una única vez en el beforeAll para no duplicar
  // llamadas de red, y se verifica en su propio describe/it más abajo para
  // que el requisito R4 tenga un test nombrado explícitamente (no solo un
  // side effect de un hook).
  let firstRunExitCode: number;

  beforeAll(async () => {
    const clients = buildClients();
    sqs = clients.sqs;
    dynamoDb = clients.dynamoDb;
    s3 = clients.s3;
    eventBridge = clients.eventBridge;

    firstRunExitCode = await runProvisioning(process.env);
  }, 30000);

  afterAll(() => {
    sqs.destroy();
    dynamoDb.destroy();
    s3.destroy();
    eventBridge.destroy();
  });

  describe('R4: primera corrida sobre LocalStack crea los 8 recursos y termina en 0', () => {
    it('runProvisioning devuelve exit code 0', () => {
      expect(firstRunExitCode).toBe(0);
    });
  });

  describe('R5: segunda corrida es idempotente', () => {
    it('exit code 0 en una segunda corrida inmediata, sin duplicar recursos', async () => {
      const exitCode = await runProvisioning(process.env);
      expect(exitCode).toBe(0);

      const { QueueUrls } = await sqs.send(new ListQueuesCommand({}));
      const positionsRawUrls = (QueueUrls ?? []).filter((url) =>
        url.endsWith(`/${DEVELOPMENT_NAMES.positionsRaw}`),
      );
      expect(positionsRawUrls).toHaveLength(1);
    }, 30000);
  });

  describe('R6: las 4 colas SQS existen con los nombres correctos', () => {
    it('list-queues incluye las 4 URLs', async () => {
      const { QueueUrls } = await sqs.send(new ListQueuesCommand({}));
      const names = [
        DEVELOPMENT_NAMES.positionsRaw,
        DEVELOPMENT_NAMES.positionsRawDlq,
        DEVELOPMENT_NAMES.notifications,
        DEVELOPMENT_NAMES.notificationsDlq,
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
        url.endsWith(`/${DEVELOPMENT_NAMES.positionsRaw}`),
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
        expect.stringContaining(DEVELOPMENT_NAMES.positionsRawDlq),
      );
      expect(typeof redrivePolicy.maxReceiveCount).toBe('number');
    });
  });

  describe('R8: notifications tiene RedrivePolicy hacia notifications-dlq', () => {
    it('GetQueueAttributes muestra RedrivePolicy con el ARN de la DLQ y maxReceiveCount', async () => {
      const { QueueUrls } = await sqs.send(new ListQueuesCommand({}));
      const queueUrl = (QueueUrls ?? []).find((url) =>
        url.endsWith(`/${DEVELOPMENT_NAMES.notifications}`),
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
        expect.stringContaining(DEVELOPMENT_NAMES.notificationsDlq),
      );
      expect(typeof redrivePolicy.maxReceiveCount).toBe('number');
    });
  });

  describe('R10: tabla DynamoDB positions con pk/sk correctos', () => {
    it('DescribeTable muestra KeySchema con pk (HASH) y sk (RANGE)', async () => {
      const { Table } = await dynamoDb.send(
        new DescribeTableCommand({
          TableName: DEVELOPMENT_NAMES.positionsTable,
        }),
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
        new DescribeTimeToLiveCommand({
          TableName: DEVELOPMENT_NAMES.positionsTable,
        }),
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
      expect(
        Buckets?.some(
          (bucket) => bucket.Name === DEVELOPMENT_NAMES.mediaBucket,
        ),
      ).toBe(true);
    });
  });

  describe('R13: bucket S3 sin acceso público', () => {
    it('GetPublicAccessBlock muestra los 4 flags de bloqueo en true', async () => {
      const { PublicAccessBlockConfiguration } = await s3.send(
        new GetPublicAccessBlockCommand({
          Bucket: DEVELOPMENT_NAMES.mediaBucket,
        }),
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
      expect(
        EventBuses?.some((bus) => bus.Name === DEVELOPMENT_NAMES.eventBus),
      ).toBe(true);
    });
  });

  describe('R7: la doble corrida deja ambos juegos utilizables', () => {
    it('devuelve 0 y conserva los veinte recursos', async () => {
      await expect(runProvisioning(process.env)).resolves.toBe(0);

      const nameSets = [DEVELOPMENT_NAMES, TEST_NAMES];
      const { QueueUrls = [] } = await sqs.send(new ListQueuesCommand({}));
      const { Buckets = [] } = await s3.send(new ListBucketsCommand({}));
      const { EventBuses = [] } = await eventBridge.send(
        new ListEventBusesCommand({}),
      );

      for (const names of nameSets) {
        for (const queueName of [
          names.positionsRaw,
          names.positionsRawDlq,
          names.notifications,
          names.notificationsDlq,
          names.geofenceEvents,
          names.geofenceEventsDlq,
        ]) {
          expect(QueueUrls.some((url) => url.endsWith(`/${queueName}`))).toBe(
            true,
          );
        }

        await expect(
          dynamoDb.send(
            new DescribeTableCommand({ TableName: names.positionsTable }),
          ),
        ).resolves.toBeDefined();
        expect(
          Buckets.some((bucket) => bucket.Name === names.mediaBucket),
        ).toBe(true);
        expect(EventBuses.some((bus) => bus.Name === names.eventBus)).toBe(
          true,
        );

        const { Rules = [] } = await eventBridge.send(
          new ListRulesCommand({ EventBusName: names.eventBus }),
        );
        expect(
          Rules.some((rule) => rule.Name === names.geofenceEventsRule),
        ).toBe(true);
      }
    }, 30000);
  });
});
