import { DescribeTableCommand, DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  GetQueueAttributesCommand,
  GetQueueUrlCommand,
  PurgeQueueCommand,
  SQSClient,
} from '@aws-sdk/client-sqs';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { config as loadDotenv } from 'dotenv';
import { and, eq, inArray, isNull } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import request from 'supertest';
import { App } from 'supertest/types';
import { uuidv7 } from 'uuidv7';
import {
  createDynamoDbClient,
  createSqsClient,
  resolveAwsConfigFromEnv,
} from '@/aws/aws-clients';
import { DRIZZLE } from '@/db/drizzle.constants';
import { auditLog } from '@/db/schema/audit-log.schema';
import { devices, petDevices } from '@/db/schema/devices.schema';
import { pets } from '@/db/schema/pets.schema';
import { users } from '@/db/schema/users.schema';
import { TOKEN_SERVICE } from '@/modules/auth/domain/ports/token-service';
import type { TokenService } from '@/modules/auth/domain/ports/token-service';
import {
  RESOURCE_SUFFIX_TEST,
  buildResourceNames,
  resolveResourceNamesFromEnv,
} from '@/aws/resource-names';
import { PollerService } from '@/workers/poller.service';
import { PositionsConsumerService } from '@/workers/positions-consumer.service';
import { seedSimulatedDevices } from '../scripts/seed-devices';
import { AppModule } from '../src/app.module';

loadDotenv({ path: '../.env' });

describe('R9: las colas de dev y test tienen URLs distintas', () => {
  let sqs: SQSClient;

  beforeAll(() => {
    sqs = createSqsClient(resolveAwsConfigFromEnv(process.env));
  });

  afterAll(() => sqs.destroy());

  it('resuelve nombres sufijados bajo Jest', () => {
    expect(resolveResourceNamesFromEnv(process.env)).toEqual(
      buildResourceNames(RESOURCE_SUFFIX_TEST),
    );
  });

  it('LocalStack devuelve URLs distintas para positions-raw', async () => {
    const development = buildResourceNames('');
    const test = buildResourceNames(RESOURCE_SUFFIX_TEST);
    const developmentQueue = await sqs.send(
      new GetQueueUrlCommand({ QueueName: development.positionsRaw }),
    );
    const testQueue = await sqs.send(
      new GetQueueUrlCommand({ QueueName: test.positionsRaw }),
    );

    expect(developmentQueue.QueueUrl).toBeDefined();
    expect(testQueue.QueueUrl).toBeDefined();
    expect(testQueue.QueueUrl).not.toBe(developmentQueue.QueueUrl);
  });
});

describe('R10: la ingesta no mueve las colas de desarrollo', () => {
  const development = buildResourceNames('');
  const test = buildResourceNames(RESOURCE_SUFFIX_TEST);
  const runId = `${Date.now()}`;

  let app: INestApplication<App>;
  let db: NodePgDatabase;
  let tokenService: TokenService;
  let sqs: SQSClient;
  let dynamodb: DynamoDBClient;
  let poller: PollerService;
  let consumer: PositionsConsumerService;
  let ownerId: string;
  let ownerToken: string;
  let petId: string;

  async function queueUrl(queueName: string): Promise<string> {
    const response = await sqs.send(
      new GetQueueUrlCommand({ QueueName: queueName }),
    );
    return response.QueueUrl as string;
  }

  async function queueCount(queueName: string): Promise<number> {
    const response = await sqs.send(
      new GetQueueAttributesCommand({
        QueueUrl: await queueUrl(queueName),
        AttributeNames: [
          'ApproximateNumberOfMessages',
          'ApproximateNumberOfMessagesNotVisible',
          'ApproximateNumberOfMessagesDelayed',
        ],
      }),
    );

    return Object.values(response.Attributes ?? {}).reduce(
      (total, value) => total + Number(value),
      0,
    );
  }

  async function resetSim001(): Promise<void> {
    const [device] = await db
      .select()
      .from(devices)
      .where(eq(devices.esn, 'SIM-001'));
    if (!device) return;

    await db
      .update(petDevices)
      .set({ releasedAt: new Date() })
      .where(
        and(eq(petDevices.deviceId, device.id), isNull(petDevices.releasedAt)),
      );
    await db
      .update(devices)
      .set({
        status: 'available',
        ingestWatermark: null,
        batteryPct: null,
        connectivity: null,
        lastMessageAt: null,
      })
      .where(eq(devices.id, device.id));
  }

  beforeAll(async () => {
    process.env.SIM_MODE = 'true';
    const awsConfig = resolveAwsConfigFromEnv(process.env);
    sqs = createSqsClient(awsConfig);
    dynamodb = createDynamoDbClient(awsConfig);

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('v1');
    await app.init();

    db = app.get<NodePgDatabase>(DRIZZLE);
    tokenService = app.get<TokenService>(TOKEN_SERVICE);
    poller = app.get(PollerService);
    consumer = app.get(PositionsConsumerService);

    await seedSimulatedDevices(db);
    await resetSim001();

    ownerId = uuidv7();
    const email = `resource-isolation-${runId}@example.com`;
    await db.insert(users).values({
      id: ownerId,
      email,
      passwordHash: '$argon2id$v=19$m=65536,t=3,p=4$e2e$dummy',
      firstName: 'E2e',
      lastName: 'Isolation',
      phone: '+525512345678',
      country: 'MX',
      timezone: 'UTC',
      termsAcceptedAt: new Date(),
    });
    ownerToken = tokenService.sign({ sub: ownerId, email });

    const petResponse = await request(app.getHttpServer())
      .post('/v1/pets')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({
        name: `Isolation-${runId}`,
        species: 'dog',
        birthDate: '2024-01-15',
      })
      .expect(201);
    petId = (petResponse.body as { id: string }).id;

    await request(app.getHttpServer())
      .post('/v1/devices/claim')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({ petId, activationCode: 'ACT-001' })
      .expect(201);
  });

  afterAll(async () => {
    if (db) {
      await db.delete(auditLog).where(eq(auditLog.userId, ownerId));
      if (petId) await db.delete(pets).where(eq(pets.id, petId));
      await resetSim001();
      await db.delete(users).where(inArray(users.id, [ownerId]));
    }
    await app?.close();
    sqs?.destroy();
    dynamodb?.destroy();
  });

  it('conserva las tres colas y la tabla de desarrollo', async () => {
    const developmentQueues = [
      development.positionsRaw,
      development.notifications,
      development.geofenceEvents,
    ];
    const developmentCountsBefore = await Promise.all(
      developmentQueues.map(queueCount),
    );
    const developmentTableBefore = await dynamodb.send(
      new DescribeTableCommand({ TableName: development.positionsTable }),
    );
    const testTable = await dynamodb.send(
      new DescribeTableCommand({ TableName: test.positionsTable }),
    );

    const testQueueUrl = await queueUrl(test.positionsRaw);
    await sqs.send(new PurgeQueueCommand({ QueueUrl: testQueueUrl }));
    const testCountBefore = await queueCount(test.positionsRaw);

    await poller.runOnce();
    const testCountAfterPoll = await queueCount(test.positionsRaw);
    expect(testCountAfterPoll).toBeGreaterThan(testCountBefore);
    await consumer.drainOnce();

    const developmentCountsAfter = await Promise.all(
      developmentQueues.map(queueCount),
    );
    const developmentTableAfter = await dynamodb.send(
      new DescribeTableCommand({ TableName: development.positionsTable }),
    );

    expect(developmentCountsAfter).toEqual(developmentCountsBefore);
    expect(developmentTableBefore.Table?.TableName).toBe(
      development.positionsTable,
    );
    expect(testTable.Table?.TableName).toBe(test.positionsTable);
    expect(testTable.Table?.TableName).not.toBe(
      developmentTableBefore.Table?.TableName,
    );
    expect(developmentTableAfter.Table?.ItemCount).toBe(
      developmentTableBefore.Table?.ItemCount,
    );
  });
});
