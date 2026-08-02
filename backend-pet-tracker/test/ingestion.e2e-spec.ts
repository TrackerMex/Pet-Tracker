import {
  GetQueueAttributesCommand,
  GetQueueUrlCommand,
  PurgeQueueCommand,
  SQSClient,
} from '@aws-sdk/client-sqs';
import { QueryCommand } from '@aws-sdk/lib-dynamodb';
import type { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { and, eq, inArray, isNull } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import request from 'supertest';
import { App } from 'supertest/types';
import { uuidv7 } from 'uuidv7';
import { SQS_CLIENT } from '@/aws/aws.constants';
import {
  QUEUE_POSITIONS_RAW,
  QUEUE_POSITIONS_RAW_DLQ,
  TABLE_POSITIONS,
} from '@/aws/constants';
import { DRIZZLE } from '@/db/drizzle.constants';
import { auditLog } from '@/db/schema/audit-log.schema';
import { devices, petDevices } from '@/db/schema/devices.schema';
import { pets } from '@/db/schema/pets.schema';
import { users } from '@/db/schema/users.schema';
import { TOKEN_SERVICE } from '@/modules/auth/domain/ports/token-service';
import type { TokenService } from '@/modules/auth/domain/ports/token-service';
import { INGESTION_STORE } from '@/workers/ingestion-store';
import type { IngestionStore } from '@/workers/ingestion-store';
import { POSITIONS_DOC_CLIENT } from '@/workers/ingestion.constants';
import { PollerService } from '@/workers/poller.service';
import { PositionsConsumerService } from '@/workers/positions-consumer.service';
import { seedSimulatedDevices } from '../scripts/seed-devices';
import { AppModule } from './../src/app.module';

/**
 * e2e de la cadena de ingesta (R19) contra Postgres + LocalStack reales:
 * claim ACT-001 con SIM_MODE=true, PollerService.runOnce() y
 * PositionsConsumerService.drainOnce() invocados directamente (D10 — sin
 * esperas de reloj; la corrida con cron real es evidencia manual en
 * progress/impl_wialon-ingestion-pipeline.md). NODE_ENV=test garantiza que
 * ningun worker se agenda solo (R8).
 */
describe('Wialon ingestion pipeline (e2e)', () => {
  const RUN_ID = `${Date.now()}`;

  let app: INestApplication<App>;
  let db: NodePgDatabase;
  let tokenService: TokenService;
  let sqs: SQSClient;
  let documents: DynamoDBDocumentClient;
  let poller: PollerService;
  let consumer: PositionsConsumerService;
  let rawQueueUrl: string;
  let dlqUrl: string;

  let ownerId: string;
  let ownerToken: string;
  let petId: string;

  async function queueUrl(name: string): Promise<string> {
    const response = await sqs.send(
      new GetQueueUrlCommand({ QueueName: name }),
    );
    return response.QueueUrl as string;
  }

  /** Deja SIM-001 reclamable aunque una corrida anterior lo dejara asignado. */
  async function resetSim001(): Promise<void> {
    const [sim1] = await db
      .select()
      .from(devices)
      .where(eq(devices.esn, 'SIM-001'));
    if (!sim1) {
      return;
    }

    await db
      .update(petDevices)
      .set({ releasedAt: new Date() })
      .where(
        and(eq(petDevices.deviceId, sim1.id), isNull(petDevices.releasedAt)),
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
      .where(eq(devices.id, sim1.id));
  }

  beforeAll(async () => {
    // Criterio literal de R19: la cadena corre con el simulador.
    process.env.SIM_MODE = 'true';

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('v1');
    await app.init();

    db = app.get<NodePgDatabase>(DRIZZLE);
    tokenService = app.get<TokenService>(TOKEN_SERVICE);
    sqs = app.get<SQSClient>(SQS_CLIENT);
    documents = app.get<DynamoDBDocumentClient>(POSITIONS_DOC_CLIENT);
    poller = app.get(PollerService);
    consumer = app.get(PositionsConsumerService);

    rawQueueUrl = await queueUrl(QUEUE_POSITIONS_RAW);
    dlqUrl = await queueUrl(QUEUE_POSITIONS_RAW_DLQ);

    // Cola y DLQ limpias: el criterio (c) mide ESTA corrida, no residuos.
    await sqs.send(new PurgeQueueCommand({ QueueUrl: rawQueueUrl }));
    await sqs.send(new PurgeQueueCommand({ QueueUrl: dlqUrl }));

    await seedSimulatedDevices(db);
    await resetSim001();

    // Owner + mascota via API — mismo arnes que devices.e2e-spec.ts (#7).
    ownerId = uuidv7();
    const email = `ingestion-e2e-${RUN_ID}@example.com`;
    await db.insert(users).values({
      id: ownerId,
      email,
      passwordHash: '$argon2id$v=19$m=65536,t=3,p=4$e2e$dummy',
      firstName: 'E2e',
      lastName: 'Ingestion',
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
        name: `Ingest-${RUN_ID}`,
        species: 'dog',
        birthDate: '2024-01-15',
      })
      .expect(201);
    petId = (petResponse.body as { id: string }).id;
  });

  afterAll(async () => {
    if (db) {
      await db.delete(auditLog).where(eq(auditLog.userId, ownerId));
      if (petId) {
        // Cascadea pet_users y pet_devices.
        await db.delete(pets).where(eq(pets.id, petId));
      }
      await resetSim001();
      await db.delete(users).where(inArray(users.id, [ownerId]));
    }
    await app?.close();
  });

  describe('R19: claim ACT-001 + SIM_MODE=true + runOnce() + drainOnce() => items en PET#<petId>, last_position actualizado, DLQ 0', () => {
    it('recorre la cadena completa y deja el estado esperado', async () => {
      // Claim del collar simulado por activation code (criterio literal).
      await request(app.getHttpServer())
        .post('/v1/devices/claim')
        .set('Authorization', `Bearer ${ownerToken}`)
        .send({ petId, activationCode: 'ACT-001' })
        .expect(201);

      const pollStarted = Date.now();
      await poller.runOnce();
      await consumer.drainOnce();
      const pollFinished = Date.now();

      // (a) >= 1 item consultable con Query pk = PET#<petId>.
      const query = await documents.send(
        new QueryCommand({
          TableName: TABLE_POSITIONS,
          KeyConditionExpression: 'pk = :pk',
          ExpressionAttributeValues: { ':pk': `PET#${petId}` },
        }),
      );
      const items = (query.Items ?? []) as Array<Record<string, unknown>>;
      expect(items.length).toBeGreaterThanOrEqual(1);

      // Shape del item segun docs/data-model.md: sk en ms, TTL en segundos.
      const first = items[0];
      expect(first.device_ts).toBe(first.sk);
      expect(first.expires_at).toBe(
        Math.floor((first.device_ts as number) / 1000) + 90 * 86_400,
      );
      expect(Array.isArray(first.flags)).toBe(true);

      // (b) pets.last_position no nulo con ts dentro del intervalo poleado
      // (claim inicializa watermark = claim - 10 min).
      const [petRow] = await db.select().from(pets).where(eq(pets.id, petId));
      expect(petRow.lastPosition).not.toBeNull();
      const lastPosition = petRow.lastPosition as {
        lat: number;
        lng: number;
        ts: number;
        accuracy: number | null;
        battery: number | null;
      };
      expect(lastPosition.ts).toBeGreaterThanOrEqual(pollStarted - 10 * 60_000);
      expect(lastPosition.ts).toBeLessThanOrEqual(pollFinished);
      expect(petRow.lastCommunicationAt).not.toBeNull();

      // La cache del device tambien quedo alimentada (R14).
      const [deviceRow] = await db
        .select()
        .from(devices)
        .where(eq(devices.esn, 'SIM-001'));
      expect(deviceRow.connectivity).toBe('online');
      expect(deviceRow.batteryPct).not.toBeNull();
      expect(deviceRow.lastMessageAt?.getTime()).toBe(lastPosition.ts);
      // R10 en vivo: watermark avanzo al ts del ultimo mensaje.
      expect(deviceRow.ingestWatermark?.getTime()).toBe(lastPosition.ts);

      // (c) DLQ en 0 — ningun mensaje malformado en operacion normal (R18).
      const attributes = await sqs.send(
        new GetQueueAttributesCommand({
          QueueUrl: dlqUrl,
          AttributeNames: ['ApproximateNumberOfMessages'],
        }),
      );
      expect(attributes.Attributes?.ApproximateNumberOfMessages).toBe('0');
    });

    it('un segundo ciclo es incremental: el watermark evita re-publicar todo el lookback', async () => {
      const [before] = await db
        .select()
        .from(devices)
        .where(eq(devices.esn, 'SIM-001'));
      const watermarkBefore = before.ingestWatermark?.getTime() ?? 0;

      await poller.runOnce();
      await consumer.drainOnce();

      const [after] = await db
        .select()
        .from(devices)
        .where(eq(devices.esn, 'SIM-001'));
      // El watermark nunca retrocede; avanza solo si hubo slots nuevos.
      expect(after.ingestWatermark?.getTime() ?? 0).toBeGreaterThanOrEqual(
        watermarkBefore,
      );
    });
  });

  describe('R14: el guard "solo si mas reciente" del store no deja retroceder la cache (WHERE en Postgres real)', () => {
    it('updates con ts mas viejo no tocan devices ni pets', async () => {
      const store = app.get<IngestionStore>(INGESTION_STORE);

      const [deviceBefore] = await db
        .select()
        .from(devices)
        .where(eq(devices.esn, 'SIM-001'));
      const [petBefore] = await db
        .select()
        .from(pets)
        .where(eq(pets.id, petId));
      expect(deviceBefore.lastMessageAt).not.toBeNull();

      const staleMoment = new Date(
        (deviceBefore.lastMessageAt as Date).getTime() - 60_000,
      );
      await store.updateDeviceTelemetry(deviceBefore.id, {
        batteryPct: 1,
        lastMessageAt: staleMoment,
      });
      await store.updatePetLastPosition(
        petId,
        {
          lat: 0.1,
          lng: 0.1,
          ts: staleMoment.getTime(),
          accuracy: null,
          battery: 1,
        },
        staleMoment,
      );

      const [deviceAfter] = await db
        .select()
        .from(devices)
        .where(eq(devices.id, deviceBefore.id));
      expect(deviceAfter.lastMessageAt?.getTime()).toBe(
        deviceBefore.lastMessageAt?.getTime(),
      );
      expect(deviceAfter.batteryPct).toBe(deviceBefore.batteryPct);

      const [petAfter] = await db.select().from(pets).where(eq(pets.id, petId));
      expect(petAfter.lastPosition).toEqual(petBefore.lastPosition);
      expect(petAfter.lastCommunicationAt?.getTime()).toBe(
        petBefore.lastCommunicationAt?.getTime(),
      );
    });
  });
});
