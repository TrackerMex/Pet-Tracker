import {
  GetQueueAttributesCommand,
  GetQueueUrlCommand,
  PurgeQueueCommand,
  SendMessageCommand,
  SQSClient,
} from '@aws-sdk/client-sqs';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { and, eq, inArray, isNull } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import request from 'supertest';
import { App } from 'supertest/types';
import { uuidv7 } from 'uuidv7';
import { SQS_CLIENT } from '@/aws/aws.constants';
import {
  QUEUE_GEOFENCE_EVENTS,
  QUEUE_GEOFENCE_EVENTS_DLQ,
} from '@/aws/constants';
import { DRIZZLE } from '@/db/drizzle.constants';
import { alertEvents } from '@/db/schema/alerts.schema';
import { auditLog } from '@/db/schema/audit-log.schema';
import { devices, petDevices } from '@/db/schema/devices.schema';
import { geofences } from '@/db/schema/geofences.schema';
import { pets } from '@/db/schema/pets.schema';
import { users } from '@/db/schema/users.schema';
import { TOKEN_SERVICE } from '@/modules/auth/domain/ports/token-service';
import type { TokenService } from '@/modules/auth/domain/ports/token-service';
import {
  SIM_DEFAULT_HOME_LAT,
  SIM_DEFAULT_HOME_LNG,
} from '@/integrations/wialon/wialon.factory';
import { SIM_STEP_MS } from '@/integrations/wialon/fake-wialon.client';
import { AlertsEngineConsumerService } from '@/workers/alerts-engine/alerts-engine-consumer.service';
import { PollerService } from '@/workers/poller.service';
import { PositionsConsumerService } from '@/workers/positions-consumer.service';
import { seedSimulatedDevices } from '../scripts/seed-devices';
import { AppModule } from './../src/app.module';

/**
 * e2e de alerts-engine (R2, R18) contra Postgres + LocalStack reales.
 *
 * R18 corre la cadena completa (poller -> consumer de positions-raw ->
 * worker de geofence-events) con SIM_MODE=true, sin depender de un
 * temporizador real (D10): `now` se pasa explicito a cada runOnce()/
 * drainOnce() y el watermark de ingesta se fija a mano (mismo patron que
 * resetSim001() de ingestion.e2e-spec.ts) apuntando a un dia simulado
 * arbitrario — asi el resultado no depende de la hora real en que corre el
 * test, solo del PRNG determinista de FakeWialonClient (seed/unitId/slot).
 *
 * La geocerca se centra en el punto de origen del paseo simulado
 * (SIM_DEFAULT_HOME_LAT/LNG) con radio 100 m. FakeWialonClient es puro en
 * (seed, unitId, slot) — sin Math.random ni reloj propio — asi que las
 * distancias exactas para (seed=1 default, home default, DAY_START fijo)
 * se calcularon una vez con el propio simulador (no una aproximacion
 * estadistica): slot 1 del dia -> ~42.7 m del centro (dentro del radio,
 * `isInside()` compara contra el radio completo en la primera evaluacion
 * desde 'unknown', R18/geofence-eval); slot 50 del mismo dia -> ~200.8 m
 * (excede 100*1.1=110 m, `evaluate()` emite 'exit'). Ambos slots quedan
 * muy lejos de sus respectivos umbrales (42.7 vs 90 m de margen de
 * entrada; 200.8 vs 110 m de umbral de salida), asi que un cambio menor en
 * el propio simulador no rompe el test por un margen ajustado. Si
 * SIM_SEED/SIM_HOME_LAT/SIM_HOME_LNG cambiaran de su default documentado
 * en `.env.example`, estos números se recalculan (ver el script usado en
 * progress/impl_alerts-engine.md).
 */
describe('Alerts engine (e2e)', () => {
  jest.setTimeout(180_000);

  const RUN_ID = `${Date.now()}`;
  // Dia UTC arbitrario y fijo (no depende de la fecha real de la corrida) —
  // multiplo exacto de SIM_STEP_MS, como cualquier medianoche UTC.
  const DAY_START = Date.UTC(2030, 0, 1);
  const GEOFENCE_RADIUS_M = 100;
  const CYCLE_1_SLOTS = 1;
  const CYCLE_2_SLOTS = 50;

  let app: INestApplication<App>;
  let db: NodePgDatabase;
  let tokenService: TokenService;
  let sqs: SQSClient;
  let poller: PollerService;
  let ingestionConsumer: PositionsConsumerService;
  let alertsConsumer: AlertsEngineConsumerService;

  let geofenceEventsQueueUrl: string;
  let geofenceEventsDlqUrl: string;

  let ownerId: string;
  let ownerToken: string;
  let petId: string;
  let deviceRowId: string;

  /** Drizzle anida el error real de pg en `cause` — mismo patron de
   * desenvolvimiento que findPgError() en los repositorios/store. */
  function pgErrorCode(error: unknown): string | undefined {
    let current: unknown = error;
    while (current instanceof Error) {
      const candidate = current as Error & { code?: unknown };
      if (typeof candidate.code === 'string') {
        return candidate.code;
      }
      current = candidate.cause;
    }
    return undefined;
  }

  async function queueUrl(name: string): Promise<string> {
    const response = await sqs.send(
      new GetQueueUrlCommand({ QueueName: name }),
    );
    return response.QueueUrl as string;
  }

  /** Deja SIM-002 reclamable aunque una corrida anterior lo dejara asignado. */
  async function resetDevice002(): Promise<void> {
    const [sim2] = await db
      .select()
      .from(devices)
      .where(eq(devices.esn, 'SIM-002'));
    if (!sim2) {
      return;
    }

    await db
      .update(petDevices)
      .set({ releasedAt: new Date() })
      .where(
        and(eq(petDevices.deviceId, sim2.id), isNull(petDevices.releasedAt)),
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
      .where(eq(devices.id, sim2.id));
  }

  beforeAll(async () => {
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
    poller = app.get(PollerService);
    ingestionConsumer = app.get(PositionsConsumerService);
    alertsConsumer = app.get(AlertsEngineConsumerService);

    geofenceEventsQueueUrl = await queueUrl(QUEUE_GEOFENCE_EVENTS);
    geofenceEventsDlqUrl = await queueUrl(QUEUE_GEOFENCE_EVENTS_DLQ);
    await sqs.send(new PurgeQueueCommand({ QueueUrl: geofenceEventsQueueUrl }));
    await sqs.send(new PurgeQueueCommand({ QueueUrl: geofenceEventsDlqUrl }));

    await seedSimulatedDevices(db);
    await resetDevice002();

    ownerId = uuidv7();
    const email = `alerts-engine-e2e-${RUN_ID}@example.com`;
    await db.insert(users).values({
      id: ownerId,
      email,
      passwordHash: '$argon2id$v=19$m=65536,t=3,p=4$e2e$dummy',
      firstName: 'E2e',
      lastName: 'AlertsEngine',
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
        name: `Alertas-${RUN_ID}`,
        species: 'dog',
        birthDate: '2024-01-15',
      })
      .expect(201);
    petId = (petResponse.body as { id: string }).id;

    await request(app.getHttpServer())
      .post('/v1/devices/claim')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({ petId, activationCode: 'ACT-002' })
      .expect(201);

    const [deviceRow] = await db
      .select()
      .from(devices)
      .where(eq(devices.esn, 'SIM-002'));
    deviceRowId = deviceRow.id;

    // Watermark fijado al dia simulado de control (D10): el paseo del
    // simulador es puro en (seed, unitId, slot) — nada depende del reloj
    // real de la maquina que corre el test.
    await db
      .update(devices)
      .set({ ingestWatermark: new Date(DAY_START - SIM_STEP_MS) })
      .where(eq(devices.id, deviceRowId));
  });

  afterAll(async () => {
    if (db) {
      await db.delete(auditLog).where(eq(auditLog.userId, ownerId));
      if (petId) {
        // Cascadea pet_users, pet_devices, geofences y alert_events.
        await db.delete(pets).where(eq(pets.id, petId));
      }
      await resetDevice002();
      await db.delete(users).where(inArray(users.id, [ownerId]));
    }
    await app?.close();
  });

  describe('R2: indice unico parcial anti-spam contra Postgres real', () => {
    it('segundo INSERT open con el mismo (pet_id, type, geofence_id) falla 23505; un tercero, tras cerrar los previos, tiene exito', async () => {
      const [geofenceRow] = await db
        .insert(geofences)
        .values({
          id: uuidv7(),
          petId,
          name: `R2-${RUN_ID}`,
          type: 'safe_circle',
          geometry: {
            shape: 'circle',
            centerLat: 0,
            centerLng: 0,
            radiusM: 20,
          },
          active: true,
        })
        .returning();

      const insertOpen = () =>
        db.insert(alertEvents).values({
          id: uuidv7(),
          petId,
          geofenceId: geofenceRow.id,
          type: 'geofence_exit',
          payload: {},
          openedAt: new Date(),
        });

      await expect(insertOpen()).resolves.toBeDefined();
      let secondInsertError: unknown;
      await insertOpen().catch((error: unknown) => {
        secondInsertError = error;
      });
      expect(pgErrorCode(secondInsertError)).toBe('23505');

      await db
        .update(alertEvents)
        .set({ status: 'closed', closedAt: new Date() })
        .where(
          and(
            eq(alertEvents.petId, petId),
            eq(alertEvents.geofenceId, geofenceRow.id),
            eq(alertEvents.status, 'open'),
          ),
        );

      await expect(insertOpen()).resolves.toBeDefined();

      // Limpieza: cierra la fila que este test deja abierta a proposito —
      // R18 (mismo pet) consulta por geofence_id propio, pero se cierra
      // igual por higiene de datos entre tests.
      await db
        .update(alertEvents)
        .set({ status: 'closed', closedAt: new Date() })
        .where(
          and(
            eq(alertEvents.petId, petId),
            eq(alertEvents.geofenceId, geofenceRow.id),
            eq(alertEvents.status, 'open'),
          ),
        );
    });
  });

  describe('R18: salida simulada -> fila open + mensaje en notifications en <=2 ciclos, sin reloj real', () => {
    let geofenceId: string;

    it('ciclo 1 establece inside; ciclo 2 (2800 slots despues, mismo dia simulado) produce el exit', async () => {
      const createResponse = await request(app.getHttpServer())
        .post(`/v1/pets/${petId}/geofences`)
        .set('Authorization', `Bearer ${ownerToken}`)
        .send({
          name: `Casa-${RUN_ID}`,
          type: 'safe_circle',
          centerLat: SIM_DEFAULT_HOME_LAT,
          centerLng: SIM_DEFAULT_HOME_LNG,
          radiusM: GEOFENCE_RADIUS_M,
        })
        .expect(201);
      geofenceId = (createResponse.body as { id: string }).id;

      const cycle1Now = new Date(DAY_START + CYCLE_1_SLOTS * SIM_STEP_MS);
      await poller.runOnce(cycle1Now);
      await ingestionConsumer.drainOnce(cycle1Now);
      await alertsConsumer.drainOnce(cycle1Now);

      // R10 en vivo: primera evaluacion (unknown) es silenciosa — cero
      // filas abiertas para ESTA geocerca (filtrado por geofence_id: R2 ya
      // dejo su propia fila cerrada, pero un filtro exacto no depende del
      // orden de ejecucion de los tests del archivo).
      const openAfterCycle1 = await db
        .select()
        .from(alertEvents)
        .where(
          and(
            eq(alertEvents.petId, petId),
            eq(alertEvents.geofenceId, geofenceId),
            eq(alertEvents.status, 'open'),
          ),
        );
      expect(openAfterCycle1).toHaveLength(0);

      const [geofenceAfterCycle1] = await db
        .select()
        .from(geofences)
        .where(eq(geofences.id, geofenceId));
      expect(geofenceAfterCycle1.geofenceState.state).toBe('inside');

      const cycle2Now = new Date(DAY_START + CYCLE_2_SLOTS * SIM_STEP_MS);
      await poller.runOnce(cycle2Now);
      await ingestionConsumer.drainOnce(cycle2Now);
      await alertsConsumer.drainOnce(cycle2Now);

      const openAfterCycle2 = await db
        .select()
        .from(alertEvents)
        .where(
          and(
            eq(alertEvents.petId, petId),
            eq(alertEvents.geofenceId, geofenceId),
            eq(alertEvents.type, 'geofence_exit'),
            eq(alertEvents.status, 'open'),
          ),
        );
      expect(openAfterCycle2).toHaveLength(1);

      const [geofenceAfterCycle2] = await db
        .select()
        .from(geofences)
        .where(eq(geofences.id, geofenceId));
      expect(geofenceAfterCycle2.geofenceState.state).toBe('outside');

      // Mensaje en notifications (criterio de aceptacion literal): la DLQ
      // de geofence-events en 0 confirma que el mensaje se proceso y borro,
      // no que cayo por malformado.
      const attributes = await sqs.send(
        new GetQueueAttributesCommand({
          QueueUrl: geofenceEventsDlqUrl,
          AttributeNames: ['ApproximateNumberOfMessages'],
        }),
      );
      expect(attributes.Attributes?.ApproximateNumberOfMessages).toBe('0');
    });

    it('R14: redeliverar el mismo position.updated no duplica la fila ni reenvia la notificacion', async () => {
      const [petRow] = await db.select().from(pets).where(eq(pets.id, petId));
      const lastPosition = petRow.lastPosition as {
        lat: number;
        lng: number;
        ts: number;
        accuracy: number | null;
        battery: number | null;
      };

      const openBefore = await db
        .select()
        .from(alertEvents)
        .where(
          and(
            eq(alertEvents.petId, petId),
            eq(alertEvents.geofenceId, geofenceId),
            eq(alertEvents.type, 'geofence_exit'),
            eq(alertEvents.status, 'open'),
          ),
        );
      expect(openBefore).toHaveLength(1);

      // Mismo detail que el consumer de ingesta ya emitio para ese ultimo
      // mensaje (mismo ts) — simula la redelivery de SQS (D3: el worker se
      // cae despues de escribir alert_events pero antes de borrar el
      // mensaje de geofence-events).
      await sqs.send(
        new SendMessageCommand({
          QueueUrl: geofenceEventsQueueUrl,
          MessageBody: JSON.stringify({
            'detail-type': 'position.updated',
            detail: {
              version: 1,
              petId,
              deviceId: deviceRowId,
              position: {
                lat: lastPosition.lat,
                lng: lastPosition.lng,
                ts: lastPosition.ts,
                speedKmh: null,
                course: null,
                sats: null,
                accuracyM: lastPosition.accuracy,
                batteryPct: lastPosition.battery,
                flags: [],
              },
              batteryPct: lastPosition.battery,
            },
          }),
        }),
      );

      await alertsConsumer.drainOnce(
        new Date(DAY_START + CYCLE_2_SLOTS * SIM_STEP_MS),
      );

      const openAfterRedelivery = await db
        .select()
        .from(alertEvents)
        .where(
          and(
            eq(alertEvents.petId, petId),
            eq(alertEvents.geofenceId, geofenceId),
            eq(alertEvents.type, 'geofence_exit'),
            eq(alertEvents.status, 'open'),
          ),
        );
      // R7: el guard de "ts mas reciente que geofence_state.updatedAt"
      // omite la geocerca por completo — cero fila nueva.
      expect(openAfterRedelivery).toHaveLength(1);
      expect(openAfterRedelivery[0].id).toBe(openBefore[0].id);
    });
  });
});
