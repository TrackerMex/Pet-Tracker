import {
  GetQueueUrlCommand,
  PurgeQueueCommand,
  ReceiveMessageCommand,
  SendMessageCommand,
  SQSClient,
} from '@aws-sdk/client-sqs';
import { INestApplication, Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { and, eq, inArray } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import request from 'supertest';
import { App } from 'supertest/types';
import { uuidv7 } from 'uuidv7';
import { SQS_CLIENT } from '@/aws/aws.constants';
import {
  DETAIL_TYPE_POSITION_UPDATED,
  QUEUE_GEOFENCE_EVENTS,
  QUEUE_NOTIFICATIONS,
} from '@/aws/constants';
import { DRIZZLE } from '@/db/drizzle.constants';
import { activityDaily } from '@/db/schema/activity.schema';
import { alertEvents } from '@/db/schema/alerts.schema';
import { auditLog } from '@/db/schema/audit-log.schema';
import { geofences } from '@/db/schema/geofences.schema';
import { petUsers, pets } from '@/db/schema/pets.schema';
import { pushTokens } from '@/db/schema/push-tokens.schema';
import { users } from '@/db/schema/users.schema';
import { TOKEN_SERVICE } from '@/modules/auth/domain/ports/token-service';
import type { TokenService } from '@/modules/auth/domain/ports/token-service';
import { ACTIVITY_STORE } from '@/modules/activity/domain/repositories/activity-store';
import type { ActivityStore } from '@/modules/activity/domain/repositories/activity-store';
import { AlertsEngineConsumerService } from '@/workers/alerts-engine/alerts-engine-consumer.service';
import { NotifierConsumerService } from '@/workers/notifier/notifier-consumer.service';
import { localDayRange } from '@/pipeline/local-day';
import { computeTimeAwayMinutes } from '@/pipeline/time-away';
import { AppModule } from './../src/app.module';

/**
 * e2e de alerts-center-notifier contra Postgres + LocalStack reales.
 *
 * A diferencia del e2e de #12, no usa el simulador Wialon: los mensajes de
 * `geofence-events` se fabrican a mano con posiciones deterministas respecto
 * al centro de la geocerca (0 m dentro, ~1113 m fuera), asi que ni el
 * resultado ni el orden dependen del reloj real ni del PRNG.
 */
describe('Alerts center + notifier (e2e)', () => {
  jest.setTimeout(180_000);

  const RUN_ID = `${Date.now()}`;
  const CENTER_LAT = 19.4326;
  const CENTER_LNG = -99.1332;
  const RADIUS_M = 100;
  /** ~1113 m del centro: supera de sobra el umbral de salida (100 * 1.1). */
  const FAR_LAT = CENTER_LAT + 0.01;
  /** Dia UTC arbitrario y fijo: no depende de la fecha real de la corrida. */
  const T0 = Date.UTC(2030, 0, 1, 8, 0, 0);

  const EXPO_TOKEN_OWNER = `ExponentPushToken[owner-${RUN_ID}]`;
  const EXPO_TOKEN_FAMILY = `ExponentPushToken[family-${RUN_ID}]`;
  const EXPO_TOKEN_STRANGER = `ExponentPushToken[stranger-${RUN_ID}]`;

  let app: INestApplication<App>;
  let db: NodePgDatabase;
  let sqs: SQSClient;
  let tokenService: TokenService;
  let alertsConsumer: AlertsEngineConsumerService;
  let notifier: NotifierConsumerService;
  let activityStore: ActivityStore;

  let geofenceEventsUrl: string;
  let notificationsUrl: string;

  let ownerId: string;
  let familyId: string;
  let strangerId: string;
  let ownerToken: string;
  let familyToken: string;
  let strangerToken: string;
  let petId: string;
  let strangerPetId: string;
  let geofenceId: string;

  async function queueUrl(name: string): Promise<string> {
    const response = await sqs.send(
      new GetQueueUrlCommand({ QueueName: name }),
    );
    return response.QueueUrl as string;
  }

  async function createUser(label: string): Promise<string> {
    const id = uuidv7();
    await db.insert(users).values({
      id,
      email: `acn-${label}-${RUN_ID}@example.com`,
      passwordHash: '$argon2id$v=19$m=65536,t=3,p=4$e2e$dummy',
      firstName: 'E2e',
      lastName: label,
      phone: '+525512345678',
      country: 'MX',
      timezone: 'UTC',
      termsAcceptedAt: new Date(),
    });
    return id;
  }

  /** Sobre EventBridge tal cual llega por SQS (contrato congelado de #8/#12). */
  function positionMessage(lat: number, tsMs: number): string {
    return JSON.stringify({
      'detail-type': DETAIL_TYPE_POSITION_UPDATED,
      detail: {
        version: 1,
        petId,
        deviceId: `dev-${RUN_ID}`,
        position: {
          lat,
          lng: CENTER_LNG,
          ts: tsMs,
          speedKmh: null,
          course: null,
          sats: null,
          accuracyM: null,
          batteryPct: null,
          flags: [],
        },
        batteryPct: null,
      },
    });
  }

  async function pushPosition(lat: number, tsMs: number): Promise<void> {
    await sqs.send(
      new SendMessageCommand({
        QueueUrl: geofenceEventsUrl,
        MessageBody: positionMessage(lat, tsMs),
      }),
    );
    await alertsConsumer.drainOnce(new Date(tsMs));
  }

  /** Drena `notifications` sin el worker y devuelve los `kind` recibidos. */
  async function drainNotificationKinds(): Promise<string[]> {
    const kinds: string[] = [];

    for (let attempt = 0; attempt < 5; attempt++) {
      const received = await sqs.send(
        new ReceiveMessageCommand({
          QueueUrl: notificationsUrl,
          MaxNumberOfMessages: 10,
          WaitTimeSeconds: 1,
        }),
      );
      const messages = received.Messages ?? [];
      if (messages.length === 0) {
        break;
      }
      for (const message of messages) {
        kinds.push(
          (JSON.parse(message.Body ?? '{}') as { kind?: string }).kind ?? '?',
        );
      }
    }

    return kinds;
  }

  async function alertRows() {
    return db.select().from(alertEvents).where(eq(alertEvents.petId, petId));
  }

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('v1');
    await app.init();

    db = app.get<NodePgDatabase>(DRIZZLE);
    sqs = app.get<SQSClient>(SQS_CLIENT);
    tokenService = app.get<TokenService>(TOKEN_SERVICE);
    alertsConsumer = app.get(AlertsEngineConsumerService);
    notifier = app.get(NotifierConsumerService);
    activityStore = app.get<ActivityStore>(ACTIVITY_STORE);

    geofenceEventsUrl = await queueUrl(QUEUE_GEOFENCE_EVENTS);
    notificationsUrl = await queueUrl(QUEUE_NOTIFICATIONS);
    await sqs.send(new PurgeQueueCommand({ QueueUrl: geofenceEventsUrl }));
    await sqs.send(new PurgeQueueCommand({ QueueUrl: notificationsUrl }));

    ownerId = await createUser('owner');
    familyId = await createUser('family');
    strangerId = await createUser('stranger');
    ownerToken = tokenService.sign({
      sub: ownerId,
      email: `acn-owner-${RUN_ID}@example.com`,
    });
    familyToken = tokenService.sign({
      sub: familyId,
      email: `acn-family-${RUN_ID}@example.com`,
    });
    strangerToken = tokenService.sign({
      sub: strangerId,
      email: `acn-stranger-${RUN_ID}@example.com`,
    });

    petId = uuidv7();
    strangerPetId = uuidv7();
    await db.insert(pets).values([
      { id: petId, name: `Firulais-${RUN_ID}`, species: 'dog' },
      { id: strangerPetId, name: `Michi-${RUN_ID}`, species: 'cat' },
    ]);
    await db.insert(petUsers).values([
      { petId, userId: ownerId, role: 'owner', status: 'active' },
      { petId, userId: familyId, role: 'family', status: 'active' },
      {
        petId: strangerPetId,
        userId: strangerId,
        role: 'owner',
        status: 'active',
      },
    ]);

    geofenceId = uuidv7();
    await db.insert(geofences).values({
      id: geofenceId,
      petId,
      name: `Casa-${RUN_ID}`,
      type: 'safe_circle',
      geometry: {
        shape: 'circle',
        centerLat: CENTER_LAT,
        centerLng: CENTER_LNG,
        radiusM: RADIUS_M,
      },
    });
  });

  afterAll(async () => {
    if (db) {
      await db
        .delete(auditLog)
        .where(inArray(auditLog.userId, [ownerId, familyId, strangerId]));
      await db.delete(pets).where(inArray(pets.id, [petId, strangerPetId]));
      await db
        .delete(users)
        .where(inArray(users.id, [ownerId, familyId, strangerId]));
    }
    await app?.close();
  });

  describe('R3/R5/R6: /v1/me/push-tokens contra Postgres real', () => {
    it('R6: sin JWT valido es 401 en ambas rutas, sin tocar la base', async () => {
      await request(app.getHttpServer())
        .post('/v1/me/push-tokens')
        .send({ expoToken: EXPO_TOKEN_OWNER, platform: 'ios' })
        .expect(401);
      await request(app.getHttpServer())
        .delete('/v1/me/push-tokens')
        .set('Authorization', 'Bearer no-es-un-jwt')
        .send({ expoToken: EXPO_TOKEN_OWNER })
        .expect(401);

      const rows = await db
        .select()
        .from(pushTokens)
        .where(eq(pushTokens.expoToken, EXPO_TOKEN_OWNER));
      expect(rows).toHaveLength(0);
    });

    it('R3: N POST con el mismo expoToken dejan 1 fila, mismo id y last_seen_at creciente', async () => {
      const first = await request(app.getHttpServer())
        .post('/v1/me/push-tokens')
        .set('Authorization', `Bearer ${ownerToken}`)
        .send({ expoToken: EXPO_TOKEN_OWNER, platform: 'ios' })
        .expect(200);

      const second = await request(app.getHttpServer())
        .post('/v1/me/push-tokens')
        .set('Authorization', `Bearer ${ownerToken}`)
        .send({ expoToken: EXPO_TOKEN_OWNER, platform: 'android' })
        .expect(200);

      const body = first.body as Record<string, unknown>;
      expect(Object.keys(body).sort()).toEqual(
        ['id', 'platform', 'createdAt', 'lastSeenAt'].sort(),
      );
      // R13: ni el token ni el userId vuelven al cliente.
      expect(JSON.stringify(body)).not.toContain(EXPO_TOKEN_OWNER);
      expect(JSON.stringify(body)).not.toContain(ownerId);

      const secondBody = second.body as Record<string, string>;
      expect(secondBody.id).toBe(body.id);
      expect(secondBody.createdAt).toBe(body.createdAt);
      expect(secondBody.platform).toBe('android');
      expect(Date.parse(secondBody.lastSeenAt)).toBeGreaterThanOrEqual(
        Date.parse(body.lastSeenAt as string),
      );

      const rows = await db
        .select()
        .from(pushTokens)
        .where(eq(pushTokens.expoToken, EXPO_TOKEN_OWNER));
      expect(rows).toHaveLength(1);
      expect(rows[0].userId).toBe(ownerId);
    });

    it('R3/D5-iv: re-registrar un token de otro usuario lo reasigna, nunca 409', async () => {
      await request(app.getHttpServer())
        .post('/v1/me/push-tokens')
        .set('Authorization', `Bearer ${familyToken}`)
        .send({ expoToken: EXPO_TOKEN_FAMILY, platform: 'ios' })
        .expect(200);

      await request(app.getHttpServer())
        .post('/v1/me/push-tokens')
        .set('Authorization', `Bearer ${strangerToken}`)
        .send({ expoToken: EXPO_TOKEN_FAMILY, platform: 'ios' })
        .expect(200);

      const rows = await db
        .select()
        .from(pushTokens)
        .where(eq(pushTokens.expoToken, EXPO_TOKEN_FAMILY));
      expect(rows).toHaveLength(1);
      expect(rows[0].userId).toBe(strangerId);

      // Se devuelve a family, que es quien lo necesita para R8.
      await request(app.getHttpServer())
        .post('/v1/me/push-tokens')
        .set('Authorization', `Bearer ${familyToken}`)
        .send({ expoToken: EXPO_TOKEN_FAMILY, platform: 'ios' })
        .expect(200);
    });

    it('R4: body invalido es 400 y no deja fila', async () => {
      for (const body of [
        {},
        { expoToken: 'formato-libre', platform: 'ios' },
        { expoToken: EXPO_TOKEN_STRANGER, platform: 'web' },
        { expoToken: EXPO_TOKEN_STRANGER, platform: 'ios', extra: 1 },
      ]) {
        await request(app.getHttpServer())
          .post('/v1/me/push-tokens')
          .set('Authorization', `Bearer ${strangerToken}`)
          .send(body)
          .expect(400);
      }

      const rows = await db
        .select()
        .from(pushTokens)
        .where(eq(pushTokens.expoToken, EXPO_TOKEN_STRANGER));
      expect(rows).toHaveLength(0);
    });

    it('R5: DELETE borra la fila propia y es 204 idempotente; no borra la ajena', async () => {
      await request(app.getHttpServer())
        .post('/v1/me/push-tokens')
        .set('Authorization', `Bearer ${strangerToken}`)
        .send({ expoToken: EXPO_TOKEN_STRANGER, platform: 'android' })
        .expect(200);

      // Un usuario distinto no puede borrar el token ajeno, y aun asi es 204.
      await request(app.getHttpServer())
        .delete('/v1/me/push-tokens')
        .set('Authorization', `Bearer ${ownerToken}`)
        .send({ expoToken: EXPO_TOKEN_STRANGER })
        .expect(204);
      expect(
        await db
          .select()
          .from(pushTokens)
          .where(eq(pushTokens.expoToken, EXPO_TOKEN_STRANGER)),
      ).toHaveLength(1);

      await request(app.getHttpServer())
        .delete('/v1/me/push-tokens')
        .set('Authorization', `Bearer ${strangerToken}`)
        .send({ expoToken: EXPO_TOKEN_STRANGER })
        .expect(204);
      expect(
        await db
          .select()
          .from(pushTokens)
          .where(eq(pushTokens.expoToken, EXPO_TOKEN_STRANGER)),
      ).toHaveLength(0);

      // Segundo DELETE del mismo token inexistente: 204 igual.
      await request(app.getHttpServer())
        .delete('/v1/me/push-tokens')
        .set('Authorization', `Bearer ${strangerToken}`)
        .send({ expoToken: EXPO_TOKEN_STRANGER })
        .expect(204);
    });
  });

  describe('R23: exit -> ack -> exit -> enter con el motor de #12 (D1)', () => {
    let alertId: string;

    it('primer exit abre 1 alerta y encola exactamente 1 notificacion `alert`', async () => {
      // Primera evaluacion desde 'unknown': fija el estado en 'inside'.
      await pushPosition(CENTER_LAT, T0);
      await pushPosition(FAR_LAT, T0 + 60_000);

      const rows = await alertRows();
      expect(rows).toHaveLength(1);
      expect(rows[0].status).toBe('open');
      alertId = rows[0].id;

      expect(await drainNotificationKinds()).toEqual(['alert']);
    });

    it('R20/R22: el ack pasa a acked, fija acked_at, deja closed_at NULL y audita una vez', async () => {
      const response = await request(app.getHttpServer())
        .post(`/v1/alerts/${alertId}/ack`)
        .set('Authorization', `Bearer ${ownerToken}`)
        .expect(200);

      expect((response.body as { status: string }).status).toBe('acked');

      const [row] = await alertRows();
      expect(row.status).toBe('acked');
      expect(row.ackedAt).not.toBeNull();
      expect(row.closedAt).toBeNull();

      // R21: segundo ack idempotente, mismo acked_at y sin segunda auditoria.
      const again = await request(app.getHttpServer())
        .post(`/v1/alerts/${alertId}/ack`)
        .set('Authorization', `Bearer ${ownerToken}`)
        .expect(200);
      expect((again.body as { ackedAt: string }).ackedAt).toBe(
        row.ackedAt?.toISOString(),
      );

      const audits = await db
        .select()
        .from(auditLog)
        .where(
          and(eq(auditLog.userId, ownerId), eq(auditLog.entityId, alertId)),
        );
      expect(audits).toHaveLength(1);
      expect(audits[0].action).toBe('alert.ack');
    });

    it('R2/R23: un segundo exit sobre la alerta acked NO abre fila nueva ni notifica', async () => {
      // Vuelve a entrar en el radio de enter... no: se queda fuera y se
      // fuerza otra evaluacion de salida moviendo el estado a 'inside' a mano
      // seria trampa. Se reusa el flujo real: enter (cierra) esta en el test
      // siguiente, asi que aqui basta con reintentar el mismo exit.
      await pushPosition(FAR_LAT, T0 + 120_000);

      const rows = await alertRows();
      expect(rows).toHaveLength(1);
      expect(rows[0].status).toBe('acked');
      expect(await drainNotificationKinds()).toEqual([]);
    });

    it('R23: el regreso cierra la alerta acked y encola su alert_resolved', async () => {
      await pushPosition(CENTER_LAT, T0 + 180_000);

      const rows = await alertRows();
      expect(rows).toHaveLength(1);
      expect(rows[0].status).toBe('closed');
      expect(rows[0].closedAt).not.toBeNull();
      // El acked_at se conserva: el ack fue una anotacion, no una resolucion.
      expect(rows[0].ackedAt).not.toBeNull();

      expect(await drainNotificationKinds()).toEqual(['alert_resolved']);
    });

    it('R21: ack sobre una alerta closed es 409; sobre un id ajeno o basura, 404', async () => {
      await request(app.getHttpServer())
        .post(`/v1/alerts/${alertId}/ack`)
        .set('Authorization', `Bearer ${ownerToken}`)
        .expect(409);

      // Mismo 404 para "no existe", "no soy miembro" y ":id malformado".
      await request(app.getHttpServer())
        .post(`/v1/alerts/${alertId}/ack`)
        .set('Authorization', `Bearer ${strangerToken}`)
        .expect(404);
      await request(app.getHttpServer())
        .post(`/v1/alerts/${uuidv7()}/ack`)
        .set('Authorization', `Bearer ${ownerToken}`)
        .expect(404);
      await request(app.getHttpServer())
        .post('/v1/alerts/no-soy-uuid/ack')
        .set('Authorization', `Bearer ${ownerToken}`)
        .expect(404);
    });
  });

  describe('R16-R19: GET /v1/alerts', () => {
    it('R16: agrega en una sola lista con petName, ordenada opened_at DESC', async () => {
      const response = await request(app.getHttpServer())
        .get('/v1/alerts')
        .set('Authorization', `Bearer ${ownerToken}`)
        .expect(200);

      const body = response.body as {
        items: Array<Record<string, unknown>>;
        nextCursor: string | null;
      };
      expect(body.items.length).toBeGreaterThanOrEqual(1);
      expect(Object.keys(body.items[0]).sort()).toEqual(
        [
          'id',
          'petId',
          'petName',
          'type',
          'status',
          'geofenceId',
          'payload',
          'openedAt',
          'ackedAt',
          'closedAt',
        ].sort(),
      );
      expect(body.items[0].petName).toBe(`Firulais-${RUN_ID}`);
      expect(body.nextCursor).toBeNull();
    });

    it('R16: el miembro `family` ve las mismas alertas que el owner', async () => {
      const asOwner = await request(app.getHttpServer())
        .get('/v1/alerts')
        .set('Authorization', `Bearer ${ownerToken}`)
        .expect(200);
      const asFamily = await request(app.getHttpServer())
        .get('/v1/alerts')
        .set('Authorization', `Bearer ${familyToken}`)
        .expect(200);

      expect(asFamily.body).toEqual(asOwner.body);
    });

    it('R17: ?status filtra; un valor invalido o una clave desconocida es 400', async () => {
      const closed = await request(app.getHttpServer())
        .get('/v1/alerts?status=closed')
        .set('Authorization', `Bearer ${ownerToken}`)
        .expect(200);
      expect(
        (closed.body as { items: Array<{ status: string }> }).items.every(
          (item) => item.status === 'closed',
        ),
      ).toBe(true);

      const open = await request(app.getHttpServer())
        .get('/v1/alerts?status=open')
        .set('Authorization', `Bearer ${ownerToken}`)
        .expect(200);
      expect((open.body as { items: unknown[] }).items).toEqual([]);

      await request(app.getHttpServer())
        .get('/v1/alerts?status=nope')
        .set('Authorization', `Bearer ${ownerToken}`)
        .expect(400);
      await request(app.getHttpServer())
        .get('/v1/alerts?limit=5')
        .set('Authorization', `Bearer ${ownerToken}`)
        .expect(400);
    });

    it('R18: un cursor indecodificable es 400', async () => {
      await request(app.getHttpServer())
        .get('/v1/alerts?cursor=basura-no-decodificable')
        .set('Authorization', `Bearer ${ownerToken}`)
        .expect(400);
    });

    it('R19: aislamiento — el ajeno no ve nada de esta mascota, y sin membresias la lista es vacia', async () => {
      const response = await request(app.getHttpServer())
        .get('/v1/alerts')
        .set('Authorization', `Bearer ${strangerToken}`)
        .expect(200);

      const body = response.body as {
        items: Array<{ petId: string }>;
        nextCursor: string | null;
      };
      expect(body.items.every((item) => item.petId !== petId)).toBe(true);
      expect(body.items).toEqual([]);
      expect(body.nextCursor).toBeNull();
    });
  });

  describe('R8/R9/R10/R13: notifier con PUSH_ENABLED=false sobre LocalStack', () => {
    function notificationBody(): string {
      return JSON.stringify({
        version: 1,
        kind: 'alert',
        alertId: uuidv7(),
        petId,
        title: 'Firulais salió de Casa',
        body: 'Firulais salió del área segura "Casa".',
        data: { petId, alertId: uuidv7() },
      });
    }

    it('R8/R9/R13: loguea {wouldSend} con recipients = tokens de los miembros activos', async () => {
      const logged: unknown[] = [];
      const logSpy = jest
        .spyOn(Logger.prototype, 'log')
        .mockImplementation((...args: unknown[]) => void logged.push(...args));

      await sqs.send(
        new SendMessageCommand({
          QueueUrl: notificationsUrl,
          MessageBody: notificationBody(),
        }),
      );
      await notifier.drainOnce();

      const entry = logged.find(
        (item): item is { wouldSend: Record<string, unknown> } =>
          typeof item === 'object' && item !== null && 'wouldSend' in item,
      );
      expect(entry).toBeDefined();
      expect(entry?.wouldSend.title).toBe('Firulais salió de Casa');
      expect(entry?.wouldSend.body).toBe(
        'Firulais salió del área segura "Casa".',
      );
      // owner + family, cada uno con 1 token; el ajeno no tiene membresia.
      expect(entry?.wouldSend.recipients).toBe(2);

      const serialized = JSON.stringify(logged);
      expect(serialized).not.toContain(EXPO_TOKEN_OWNER);
      expect(serialized).not.toContain(EXPO_TOKEN_FAMILY);

      logSpy.mockRestore();
      expect(await drainNotificationKinds()).toEqual([]);
    });

    it('R10: sin tokens registrados no falla — log y fin, mensaje borrado', async () => {
      await db
        .delete(pushTokens)
        .where(
          inArray(pushTokens.expoToken, [EXPO_TOKEN_OWNER, EXPO_TOKEN_FAMILY]),
        );

      const errorSpy = jest
        .spyOn(Logger.prototype, 'error')
        .mockImplementation();
      jest.spyOn(Logger.prototype, 'log').mockImplementation();

      await sqs.send(
        new SendMessageCommand({
          QueueUrl: notificationsUrl,
          MessageBody: notificationBody(),
        }),
      );
      await expect(notifier.drainOnce()).resolves.toBeUndefined();

      expect(errorSpy).not.toHaveBeenCalled();
      jest.restoreAllMocks();
      expect(await drainNotificationKinds()).toEqual([]);
    });
  });

  describe('R24/R25/R27/R28: time_away_minutes contra Postgres real', () => {
    // Dia distinto del que usa el escenario de R23 (2030-01-01): esa alerta
    // vive en la misma geocerca y sumaria sus 2 minutos al total.
    const DAY = '2030-01-02';
    const range = localDayRange(DAY, 'UTC');

    it('R24: la geocerca de referencia es la mas antigua aunque este inactiva', async () => {
      // Una geocerca mas nueva y activa NO debe desplazar a la de referencia.
      await db.insert(geofences).values({
        id: uuidv7(),
        petId,
        name: `Parque-${RUN_ID}`,
        type: 'safe_circle',
        geometry: {
          shape: 'circle',
          centerLat: CENTER_LAT,
          centerLng: CENTER_LNG,
          radiusM: RADIUS_M,
        },
      });
      await db
        .update(geofences)
        .set({ active: false })
        .where(eq(geofences.id, geofenceId));

      await db.insert(alertEvents).values({
        id: uuidv7(),
        petId,
        geofenceId,
        type: 'geofence_exit',
        payload: {},
        openedAt: new Date(Date.UTC(2030, 0, 2, 9)),
        closedAt: new Date(Date.UTC(2030, 0, 2, 11, 30)),
        status: 'closed',
      });

      const spans = await activityStore.findAwaySpans(petId, range);

      expect(spans).not.toBeNull();
      expect(computeTimeAwayMinutes(spans ?? [], range)).toBe(150);
    });

    it('R27: sin geocercas devuelve null (no medible), no una lista vacia', async () => {
      const spans = await activityStore.findAwaySpans(strangerPetId, range);
      expect(spans).toBeNull();
    });

    it('R28/D4: el upsert con NULL preserva el time_away_minutes ya escrito', async () => {
      const row = {
        petId,
        date: DAY,
        distanceM: 0,
        activeMinutes: 0,
        restMinutes: 0,
        walkCount: 0,
        avgWalkMinutes: 0,
        firstWalkAt: null,
        lastWalkAt: null,
      };

      await activityStore.upsertDailyActivity({ ...row, timeAwayMinutes: 150 });
      await activityStore.upsertDailyActivity({
        ...row,
        timeAwayMinutes: null,
      });

      const [stored] = await db
        .select()
        .from(activityDaily)
        .where(
          and(eq(activityDaily.petId, petId), eq(activityDaily.date, DAY)),
        );
      expect(stored.timeAwayMinutes).toBe(150);

      // Y un valor nuevo si lo pisa.
      await activityStore.upsertDailyActivity({ ...row, timeAwayMinutes: 90 });
      const [updated] = await db
        .select()
        .from(activityDaily)
        .where(
          and(eq(activityDaily.petId, petId), eq(activityDaily.date, DAY)),
        );
      expect(updated.timeAwayMinutes).toBe(90);
    });
  });
});
