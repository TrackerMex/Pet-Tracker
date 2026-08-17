import { BatchWriteCommand } from '@aws-sdk/lib-dynamodb';
import type { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { INestApplication, Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { and, count, eq, inArray } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import request from 'supertest';
import { App } from 'supertest/types';
import { uuidv7 } from 'uuidv7';
import {
  TABLE_POSITIONS,
  TABLE_POSITIONS_PARTITION_KEY,
  TABLE_POSITIONS_SORT_KEY,
} from '@/aws/constants';
import { DRIZZLE } from '@/db/drizzle.constants';
import { activityDaily } from '@/db/schema/activity.schema';
import { auditLog } from '@/db/schema/audit-log.schema';
import { devices, petDevices } from '@/db/schema/devices.schema';
import { pets } from '@/db/schema/pets.schema';
import { deviceSubscriptions } from '@/db/schema/subscriptions.schema';
import { users } from '@/db/schema/users.schema';
import { AggregateDailyActivityUseCase } from '@/modules/activity/application/use-cases/aggregate-daily-activity.use-case';
import { ACTIVITY_STORE } from '@/modules/activity/domain/repositories/activity-store';
import type { ActivityStore } from '@/modules/activity/domain/repositories/activity-store';
import { TOKEN_SERVICE } from '@/modules/auth/domain/ports/token-service';
import type { TokenService } from '@/modules/auth/domain/ports/token-service';
import {
  listDays,
  localDayOf,
  localDayRange,
  shiftDay,
} from '@/pipeline/local-day';
import { POSITIONS_DOC_CLIENT } from '@/workers/ingestion.constants';
import { AppModule } from './../src/app.module';

const DYNAMO_BATCH_WRITE_MAX = 25;
const OWNER_TZ = 'America/Mexico_City';
const BAD_TZ = 'Marte/Olympus';
const METERS_PER_DEGREE_LAT = (6_371_000 * Math.PI) / 180;

interface TripsBody {
  date: string;
  items: Array<Record<string, unknown>>;
}

interface TripBody {
  date: string;
  trip: Record<string, unknown>;
}

interface DailyBody {
  days: Array<Record<string, unknown>>;
  weekComparison: Record<string, number | null>;
}

/**
 * e2e de trips-activity contra Postgres + LocalStack reales. Los items se
 * siembran directamente en DynamoDB con el mismo shape que escribe el
 * consumidor de #8 (`toPositionItem`), sin depender del poller: esta feature
 * solo lee. Las particiones llevan petIds uuidv7 unicos por corrida, asi que
 * no hay interferencia entre ejecuciones (mismo criterio que
 * test/positions.e2e-spec.ts, que tampoco limpia DynamoDB).
 *
 * Los dias se derivan del reloj real en la tz del owner: la suite es estable
 * corra el dia que corra.
 */
describe('Trips & Activity API (e2e)', () => {
  jest.setTimeout(180_000);

  const RUN_ID = `${Date.now()}`;

  let app: INestApplication<App>;
  let db: NodePgDatabase;
  let tokenService: TokenService;
  let documents: DynamoDBDocumentClient;
  let store: ActivityStore;
  let aggregator: AggregateDailyActivityUseCase;

  interface TestUser {
    id: string;
    token: string;
  }

  let member: TestUser;
  let stranger: TestUser;
  let badTzOwner: TestUser;

  /** Mascota con collar y paseo sembrado ayer: agregador (R11, R13, R14). */
  let petAgg: string;
  /** Mascota con paseo sembrado ayer: /trips y /trips/:n (R16-R19). */
  let petTrips: string;
  /** Mascota con fila persistida: /activity/daily (R20, R21). */
  let petDaily: string;
  /** Mascota con collar y owner de timezone no-IANA (R13). */
  let petBadTz: string;
  /** Mascota sin collar activo: no entra en el barrido (R13). */
  let petNoCollar: string;
  /** Mascota sin ninguna posicion (R18). */
  let petEmpty: string;

  const createdUserIds: string[] = [];
  const createdPetIds: string[] = [];
  const createdDeviceIds: string[] = [];

  let today: string;
  let yesterday: string;
  let twoDaysAgo: string;

  function api() {
    return request(app.getHttpServer());
  }

  async function seedUser(label: string, timezone: string): Promise<TestUser> {
    const id = uuidv7();
    const email = `activity-e2e-${label}-${RUN_ID}@example.com`;

    await db.insert(users).values({
      id,
      email,
      passwordHash: '$argon2id$v=19$m=65536,t=3,p=4$e2e$dummy',
      firstName: 'E2e',
      lastName: label,
      phone: '+525512345678',
      country: 'MX',
      timezone,
      termsAcceptedAt: new Date(),
    });
    createdUserIds.push(id);

    return { id, token: tokenService.sign({ sub: id, email }) };
  }

  async function createPet(owner: TestUser, name: string): Promise<string> {
    const response = await api()
      .post('/v1/pets')
      .set('Authorization', `Bearer ${owner.token}`)
      .send({ name, species: 'dog', birthDate: '2024-01-15' })
      .expect(201);

    const { id } = response.body as { id: string };
    createdPetIds.push(id);

    return id;
  }

  /** Collar activo: fila en `devices` + fila viva en `pet_devices`. */
  async function attachCollar(petId: string, label: string): Promise<void> {
    const deviceId = uuidv7();
    await db.insert(devices).values({
      id: deviceId,
      esn: `ACT-E2E-${label}-${RUN_ID}`,
      wialonUnitId: `activity-${label}-${RUN_ID}`,
      status: 'assigned',
      isSimulated: true,
    });
    createdDeviceIds.push(deviceId);

    await db.insert(petDevices).values({ id: uuidv7(), petId, deviceId });
    await db.insert(deviceSubscriptions).values({
      deviceId,
      status: 'active',
      planCode: 'grandfathered',
      currentPeriodEnd: new Date('2099-12-31T00:00:00.000Z'),
    });
  }

  /** Item con los atributos exactos que escribe el consumidor de #8. */
  function positionItem(
    petId: string,
    ts: number,
    meters: number,
  ): Record<string, unknown> {
    return {
      [TABLE_POSITIONS_PARTITION_KEY]: `PET#${petId}`,
      [TABLE_POSITIONS_SORT_KEY]: ts,
      lat: 19.4326 + meters / METERS_PER_DEGREE_LAT,
      lng: -99.1332,
      speed_kmh: 5,
      course: 0,
      altitude: 2240,
      sats: 9,
      accuracy_m: 12,
      battery_pct: 88,
      device_ts: ts,
      received_ts: ts + 2_000,
      processed_ts: ts + 3_000,
      flags: [],
      expires_at: Math.floor(ts / 1000) + 90 * 86_400,
    };
  }

  /** Paseo de 20 puntos a 30 s y 5 km/h (9,5 min, ~792 m). */
  function walkItems(petId: string, startMs: number) {
    const metersPerStep = (5 / 3.6) * 30;

    return Array.from({ length: 20 }, (_, index) =>
      positionItem(petId, startMs + index * 30_000, index * metersPerStep),
    );
  }

  async function putItems(items: Record<string, unknown>[]): Promise<void> {
    for (
      let offset = 0;
      offset < items.length;
      offset += DYNAMO_BATCH_WRITE_MAX
    ) {
      await documents.send(
        new BatchWriteCommand({
          RequestItems: {
            [TABLE_POSITIONS]: items
              .slice(offset, offset + DYNAMO_BATCH_WRITE_MAX)
              .map((Item) => ({ PutRequest: { Item } })),
          },
        }),
      );
    }
  }

  async function countRows(petId: string): Promise<number> {
    const rows = await db
      .select({ total: count() })
      .from(activityDaily)
      .where(eq(activityDaily.petId, petId));

    return Number(rows[0].total);
  }

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('v1');
    await app.init();

    db = app.get<NodePgDatabase>(DRIZZLE);
    tokenService = app.get<TokenService>(TOKEN_SERVICE);
    // El DocumentClient de los workers sirve para sembrar: es el mismo
    // cliente low-level de AwsModule. El modulo de #10 usa el suyo (D1).
    documents = app.get<DynamoDBDocumentClient>(POSITIONS_DOC_CLIENT);
    store = app.get<ActivityStore>(ACTIVITY_STORE);
    aggregator = app.get(AggregateDailyActivityUseCase);

    member = await seedUser('member', OWNER_TZ);
    stranger = await seedUser('stranger', OWNER_TZ);
    badTzOwner = await seedUser('badtz', BAD_TZ);

    petAgg = await createPet(member, `Agg-${RUN_ID}`);
    petTrips = await createPet(member, `Trips-${RUN_ID}`);
    petDaily = await createPet(member, `Daily-${RUN_ID}`);
    petNoCollar = await createPet(member, `NoCollar-${RUN_ID}`);
    petEmpty = await createPet(member, `Empty-${RUN_ID}`);
    petBadTz = await createPet(badTzOwner, `BadTz-${RUN_ID}`);

    await attachCollar(petAgg, 'agg');
    await attachCollar(petTrips, 'trips');
    await attachCollar(petDaily, 'daily');
    await attachCollar(petEmpty, 'empty');
    await attachCollar(petBadTz, 'badtz');

    today = localDayOf(Date.now(), OWNER_TZ);
    yesterday = shiftDay(today, -1);
    twoDaysAgo = shiftDay(today, -2);

    // Paseo de ayer a las 10:00 locales del owner: siempre en el pasado.
    const yesterdayStart = localDayRange(yesterday, OWNER_TZ).startMs;
    const walkStart = yesterdayStart + 10 * 3_600_000;
    await putItems([
      ...walkItems(petAgg, walkStart),
      ...walkItems(petTrips, walkStart),
    ]);
  });

  afterAll(async () => {
    if (db) {
      if (createdPetIds.length > 0) {
        // activity_daily y pet_devices caen por CASCADE desde pets.
        await db.delete(pets).where(inArray(pets.id, createdPetIds));
      }
      if (createdDeviceIds.length > 0) {
        await db
          .delete(deviceSubscriptions)
          .where(inArray(deviceSubscriptions.deviceId, createdDeviceIds));
        await db.delete(devices).where(inArray(devices.id, createdDeviceIds));
      }
      if (createdUserIds.length > 0) {
        await db
          .delete(auditLog)
          .where(inArray(auditLog.userId, createdUserIds));
        await db.delete(users).where(inArray(users.id, createdUserIds));
      }
    }
    await app?.close();
  });

  describe('R16: las tres rutas las autoriza PetAccessGuard y nada mas', () => {
    it('un usuario sin membresia recibe el 404 generico en las tres rutas', async () => {
      for (const path of [
        `/v1/pets/${petTrips}/trips`,
        `/v1/pets/${petTrips}/trips/0`,
        `/v1/pets/${petTrips}/activity/daily`,
      ]) {
        const response = await api()
          .get(path)
          .set('Authorization', `Bearer ${stranger.token}`)
          .expect(404);

        // El 404 del guard no lleva `code`: asi se distingue del de R19.
        expect((response.body as { code?: string }).code).toBeUndefined();
      }
    });

    it('un :petId que no es UUID es 404 sin tocar la base', async () => {
      for (const path of [
        '/v1/pets/not-a-uuid/trips',
        '/v1/pets/not-a-uuid/trips/0',
        '/v1/pets/not-a-uuid/activity/daily',
      ]) {
        await api()
          .get(path)
          .set('Authorization', `Bearer ${member.token}`)
          .expect(404);
      }
    });

    it('ninguna de las tres rutas es publica', async () => {
      await api().get(`/v1/pets/${petTrips}/trips`).expect(401);
      await api().get(`/v1/pets/${petTrips}/trips/0`).expect(401);
      await api().get(`/v1/pets/${petTrips}/activity/daily`).expect(401);
    });

    it('cualquier rol con membresia activa lee: el owner entra sin @RequirePetRole', async () => {
      await api()
        .get(`/v1/pets/${petTrips}/trips`)
        .set('Authorization', `Bearer ${member.token}`)
        .expect(200);
    });
  });

  describe('R17: la query invalida es 400 con su codigo', () => {
    it('un parametro desconocido es 400 en las tres rutas', async () => {
      for (const path of [
        `/v1/pets/${petTrips}/trips?foo=bar`,
        `/v1/pets/${petTrips}/trips/0?foo=bar`,
        `/v1/pets/${petTrips}/activity/daily?foo=bar`,
      ]) {
        await api()
          .get(path)
          .set('Authorization', `Bearer ${member.token}`)
          .expect(400);
      }
    });

    it('un date que no es una fecha real es INVALID_DATE', async () => {
      for (const date of ['2026-13-01', '2026-02-30', 'ayer']) {
        const response = await api()
          .get(`/v1/pets/${petTrips}/trips?date=${date}`)
          .set('Authorization', `Bearer ${member.token}`)
          .expect(400);

        expect((response.body as { code: string }).code).toBe('INVALID_DATE');
      }
    });

    it('from posterior a to es INVALID_RANGE', async () => {
      const response = await api()
        .get(
          `/v1/pets/${petDaily}/activity/daily?from=${today}&to=${twoDaysAgo}`,
        )
        .set('Authorization', `Bearer ${member.token}`)
        .expect(400);

      expect((response.body as { code: string }).code).toBe('INVALID_RANGE');
    });

    it('32 dias es RANGE_TOO_LARGE y 31 no', async () => {
      const from32 = shiftDay(today, -31);
      const tooLarge = await api()
        .get(`/v1/pets/${petDaily}/activity/daily?from=${from32}&to=${today}`)
        .set('Authorization', `Bearer ${member.token}`)
        .expect(400);

      expect((tooLarge.body as { code: string }).code).toBe('RANGE_TOO_LARGE');

      const exact = await api()
        .get(
          `/v1/pets/${petDaily}/activity/daily?from=${shiftDay(today, -30)}&to=${today}`,
        )
        .set('Authorization', `Bearer ${member.token}`)
        .expect(200);

      expect((exact.body as DailyBody).days).toHaveLength(31);
    });

    it('un :n que no es entero >= 0 es INVALID_TRIP_INDEX', async () => {
      for (const index of ['-1', '1.5', 'abc']) {
        const response = await api()
          .get(`/v1/pets/${petTrips}/trips/${index}`)
          .set('Authorization', `Bearer ${member.token}`)
          .expect(400);

        expect((response.body as { code: string }).code).toBe(
          'INVALID_TRIP_INDEX',
        );
      }
    });
  });

  describe('R18: GET /trips devuelve {date, items} sin path', () => {
    it('el dia sembrado da al menos un paseo con distancia positiva', async () => {
      const response = await api()
        .get(`/v1/pets/${petTrips}/trips?date=${yesterday}`)
        .set('Authorization', `Bearer ${member.token}`)
        .expect(200);

      const body = response.body as TripsBody;
      expect(Object.keys(body).sort()).toEqual(['date', 'items']);
      expect(body.date).toBe(yesterday);
      expect(body.items.length).toBeGreaterThanOrEqual(1);
      expect(Object.keys(body.items[0]).sort()).toEqual([
        'distanceM',
        'durationMin',
        'endTs',
        'index',
        'pointCount',
        'startTs',
      ]);
      expect(body.items[0].distanceM as number).toBeGreaterThan(0);
      expect(JSON.stringify(body)).not.toContain('"path"');
    });

    it('un dia sin posiciones es 200 con items vacios, nunca 404', async () => {
      const response = await api()
        .get(`/v1/pets/${petEmpty}/trips?date=${yesterday}`)
        .set('Authorization', `Bearer ${member.token}`)
        .expect(200);

      expect(response.body).toEqual({ date: yesterday, items: [] });
    });

    it('sin `date` responde el dia local de hoy del owner', async () => {
      const response = await api()
        .get(`/v1/pets/${petEmpty}/trips`)
        .set('Authorization', `Bearer ${member.token}`)
        .expect(200);

      expect((response.body as TripsBody).date).toBe(today);
    });
  });

  describe('R19: GET /trips/:n devuelve el paseo con su path', () => {
    it('el paseo 0 del dia sembrado trae path con mas de un punto', async () => {
      const response = await api()
        .get(`/v1/pets/${petTrips}/trips/0?date=${yesterday}`)
        .set('Authorization', `Bearer ${member.token}`)
        .expect(200);

      const body = response.body as TripBody;
      expect(Object.keys(body.trip).sort()).toEqual([
        'distanceM',
        'durationMin',
        'endTs',
        'index',
        'path',
        'pointCount',
        'startTs',
      ]);
      const path = body.trip.path as Array<Record<string, number>>;
      expect(path.length).toBeGreaterThan(1);
      expect(Object.keys(path[0]).sort()).toEqual(['lat', 'lng', 'ts']);
    });

    it('el indice es estable entre dos peticiones consecutivas', async () => {
      const url = `/v1/pets/${petTrips}/trips/0?date=${yesterday}`;
      const first = await api()
        .get(url)
        .set('Authorization', `Bearer ${member.token}`)
        .expect(200);
      const second = await api()
        .get(url)
        .set('Authorization', `Bearer ${member.token}`)
        .expect(200);

      expect(second.body).toEqual(first.body);
    });

    it('un n fuera de rango es 404 con code TRIP_NOT_FOUND', async () => {
      const response = await api()
        .get(`/v1/pets/${petTrips}/trips/99?date=${yesterday}`)
        .set('Authorization', `Bearer ${member.token}`)
        .expect(404);

      expect((response.body as { code: string }).code).toBe('TRIP_NOT_FOUND');
    });
  });

  describe('R11: el upsert es idempotente y preserva time_away_minutes', () => {
    it('dos upserts dejan una sola fila con computed_at actualizado', async () => {
      await store.upsertDailyActivity({
        petId: petDaily,
        date: yesterday,
        distanceM: 1_000,
        activeMinutes: 40,
        restMinutes: 300,
        walkCount: 2,
        avgWalkMinutes: 12.5,
        firstWalkAt: new Date(`${yesterday}T16:00:00.000Z`),
        lastWalkAt: new Date(`${yesterday}T17:00:00.000Z`),
      });
      const [firstRow] = await store.findDailyRange(
        petDaily,
        yesterday,
        yesterday,
      );

      await store.upsertDailyActivity({
        petId: petDaily,
        date: yesterday,
        distanceM: 1_000,
        activeMinutes: 40,
        restMinutes: 300,
        walkCount: 2,
        avgWalkMinutes: 12.5,
        firstWalkAt: new Date(`${yesterday}T16:00:00.000Z`),
        lastWalkAt: new Date(`${yesterday}T17:00:00.000Z`),
      });
      const [secondRow] = await store.findDailyRange(
        petDaily,
        yesterday,
        yesterday,
      );

      expect(await countRows(petDaily)).toBe(1);
      expect(secondRow.distanceM).toBe(firstRow.distanceM);
      expect(secondRow.activeMinutes).toBe(firstRow.activeMinutes);
      expect(secondRow.walkCount).toBe(firstRow.walkCount);
      expect(secondRow.avgWalkMinutes).toBe(12.5);
      expect(secondRow.computedAt.getTime()).toBeGreaterThanOrEqual(
        firstRow.computedAt.getTime(),
      );
    });

    it('time_away_minutes escrito a mano sobrevive al re-upsert', async () => {
      await db
        .update(activityDaily)
        .set({ timeAwayMinutes: 42 })
        .where(
          and(
            eq(activityDaily.petId, petDaily),
            eq(activityDaily.date, yesterday),
          ),
        );

      await store.upsertDailyActivity({
        petId: petDaily,
        date: yesterday,
        distanceM: 2_000,
        activeMinutes: 55,
        restMinutes: 200,
        walkCount: 3,
        avgWalkMinutes: 9.33,
        firstWalkAt: null,
        lastWalkAt: null,
      });

      const [row] = await store.findDailyRange(petDaily, yesterday, yesterday);
      expect(row.timeAwayMinutes).toBe(42);
      expect(row.distanceM).toBe(2_000);
      expect(row.firstWalkAt).toBeNull();
    });
  });

  describe('R13: listPetsToAggregate cruza collar activo con la tz del owner', () => {
    it('devuelve la mascota con collar y la timezone de su owner', async () => {
      const list = await store.listPetsToAggregate();
      const found = list.find((entry) => entry.petId === petAgg);

      expect(found).toEqual({ petId: petAgg, timezone: OWNER_TZ });
    });

    it('una timezone fuera del catalogo IANA degrada a UTC con warn', async () => {
      const warn = jest
        .spyOn(Logger.prototype, 'warn')
        .mockImplementation(() => undefined);

      const list = await store.listPetsToAggregate();
      const found = list.find((entry) => entry.petId === petBadTz);

      expect(found).toEqual({ petId: petBadTz, timezone: 'UTC' });
      expect(
        warn.mock.calls.some((call) =>
          JSON.stringify(call[0]).includes(petBadTz),
        ),
      ).toBe(true);

      warn.mockRestore();
    });

    it('una mascota sin collar activo no aparece en el barrido', async () => {
      const list = await store.listPetsToAggregate();

      expect(list.map((entry) => entry.petId)).not.toContain(petNoCollar);
    });
  });

  describe('R14: runOnce upsertea el ultimo dia local cerrado', () => {
    it('el barrido escribe la fila de ayer con el paseo sembrado', async () => {
      const summary = await aggregator.runOnce(new Date());

      expect(summary.processed).toBeGreaterThanOrEqual(1);
      const [row] = await store.findDailyRange(petAgg, yesterday, yesterday);
      expect(row).toBeDefined();
      expect(row.date).toBe(yesterday);
      expect(row.walkCount).toBeGreaterThanOrEqual(1);
      expect(row.distanceM).toBeGreaterThan(0);
      // La columna nace NULL: la rellena #13, nunca esta feature.
      expect(row.timeAwayMinutes).toBeNull();
    });

    it('un segundo barrido salta la fila fresca y no duplica', async () => {
      const summary = await aggregator.runOnce(new Date());

      expect(summary.skipped).toBeGreaterThanOrEqual(1);
      expect(await countRows(petAgg)).toBe(1);
    });
  });

  describe('R20: days trae stored, computed y missing sin persistir hoy', () => {
    it('un rango de tres dias con fila solo en el del medio', async () => {
      const before = await countRows(petDaily);

      const response = await api()
        .get(
          `/v1/pets/${petDaily}/activity/daily?from=${twoDaysAgo}&to=${today}`,
        )
        .set('Authorization', `Bearer ${member.token}`)
        .expect(200);

      const body = response.body as DailyBody;
      expect(Object.keys(body).sort()).toEqual(['days', 'weekComparison']);
      expect(body.days.map((day) => [day.date, day.source])).toEqual([
        [twoDaysAgo, 'missing'],
        [yesterday, 'stored'],
        [today, 'computed'],
      ]);
      // "hoy se computa al vuelo sin persistir".
      expect(await countRows(petDaily)).toBe(before);
    });

    it('cada entrada trae exactamente las diez claves y el dia missing va a null', async () => {
      const response = await api()
        .get(
          `/v1/pets/${petDaily}/activity/daily?from=${twoDaysAgo}&to=${today}`,
        )
        .set('Authorization', `Bearer ${member.token}`)
        .expect(200);

      const body = response.body as DailyBody;
      for (const day of body.days) {
        expect(Object.keys(day).sort()).toEqual([
          'activeMinutes',
          'avgWalkMinutes',
          'date',
          'distanceM',
          'firstWalkAt',
          'lastWalkAt',
          'restMinutes',
          'source',
          'timeAwayMinutes',
          'walkCount',
        ]);
      }

      const missing = body.days[0];
      expect(missing.distanceM).toBeNull();
      expect(missing.walkCount).toBeNull();
      expect(missing.restMinutes).toBeNull();

      const stored = body.days[1];
      expect(stored.timeAwayMinutes).toBe(42);
      expect(typeof stored.distanceM).toBe('number');

      const computed = body.days[2];
      expect(computed.timeAwayMinutes).toBeNull();
      expect(typeof computed.distanceM).toBe('number');
    });

    it('sin from ni to devuelve los 7 dias que acaban hoy, sin huecos', async () => {
      const response = await api()
        .get(`/v1/pets/${petDaily}/activity/daily`)
        .set('Authorization', `Bearer ${member.token}`)
        .expect(200);

      const body = response.body as DailyBody;
      expect(body.days.map((day) => day.date)).toEqual(
        listDays(shiftDay(today, -6), today),
      );
    });
  });

  describe('R21: weekComparison viaja con la respuesta', () => {
    it('sin historial previo las tres claves son null', async () => {
      const response = await api()
        .get(
          `/v1/pets/${petDaily}/activity/daily?from=${yesterday}&to=${yesterday}`,
        )
        .set('Authorization', `Bearer ${member.token}`)
        .expect(200);

      const body = response.body as DailyBody;
      expect(Object.keys(body.weekComparison).sort()).toEqual([
        'activeMinutes',
        'distanceM',
        'walkCount',
      ]);
      expect(body.weekComparison).toEqual({
        distanceM: null,
        activeMinutes: null,
        walkCount: null,
      });
    });

    it('con base en los 7 dias previos devuelve el delta porcentual', async () => {
      const baselineDay = shiftDay(yesterday, -3);
      await store.upsertDailyActivity({
        petId: petDaily,
        date: baselineDay,
        distanceM: 1_000,
        activeMinutes: 50,
        restMinutes: 100,
        walkCount: 2,
        avgWalkMinutes: 10,
        firstWalkAt: null,
        lastWalkAt: null,
      });

      const response = await api()
        .get(
          `/v1/pets/${petDaily}/activity/daily?from=${yesterday}&to=${yesterday}`,
        )
        .set('Authorization', `Bearer ${member.token}`)
        .expect(200);

      const body = response.body as DailyBody;
      // La fila de ayer quedo en 2 000 m / 55 min / 3 paseos tras R11.
      expect(body.weekComparison.distanceM).toBe(100);
      expect(body.weekComparison.activeMinutes).toBe(10);
      expect(body.weekComparison.walkCount).toBe(50);
    });
  });
});
