import { BatchWriteCommand } from '@aws-sdk/lib-dynamodb';
import type { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { eq, inArray } from 'drizzle-orm';
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
import { auditLog } from '@/db/schema/audit-log.schema';
import { devices, petDevices } from '@/db/schema/devices.schema';
import { pets } from '@/db/schema/pets.schema';
import { deviceSubscriptions } from '@/db/schema/subscriptions.schema';
import { users } from '@/db/schema/users.schema';
import { TOKEN_SERVICE } from '@/modules/auth/domain/ports/token-service';
import type { TokenService } from '@/modules/auth/domain/ports/token-service';
import { POSITIONS_PAGE_LIMIT } from '@/modules/positions/positions.constants';
import { POSITIONS_DOC_CLIENT } from '@/workers/ingestion.constants';
import { FLAG_LOW_ACCURACY, FLAG_SUSPECT_JUMP } from '@/pipeline/constants';
import { AppModule } from './../src/app.module';

const DYNAMO_BATCH_WRITE_MAX = 25;

interface PositionItemBody {
  items: Array<Record<string, unknown>>;
  nextCursor: string | null;
}

/**
 * e2e de positions-api contra Postgres + LocalStack reales. Los items se
 * siembran directamente en DynamoDB con el mismo shape que escribe el
 * consumidor de #8 (`toPositionItem`), para no depender del poller: esta
 * feature solo lee. La cadena real simulador -> poller -> SQS -> consumidor
 * es evidencia manual de R6 (progress/impl_positions-api.md).
 *
 * Las particiones sembradas llevan petIds uuidv7 unicos por corrida, asi que
 * no hay interferencia entre ejecuciones (mismo criterio que
 * ingestion.e2e-spec.ts, que tampoco limpia DynamoDB).
 */
describe('Positions API (e2e)', () => {
  jest.setTimeout(180_000);

  const RUN_ID = `${Date.now()}`;

  let app: INestApplication<App>;
  let db: NodePgDatabase;
  let tokenService: TokenService;
  let documents: DynamoDBDocumentClient;

  interface TestUser {
    id: string;
    token: string;
  }

  let member: TestUser;
  let stranger: TestUser;

  /** Mascota con 3 puntos: limpio, low_accuracy y suspect_jump (R12). */
  let petFlags: string;
  /** Mascota con POSITIONS_PAGE_LIMIT + 1 puntos: pagina (R13, R15). */
  let petPaged: string;
  /** Mascota sin ninguna posicion ni cache (R5, R15). */
  let petEmpty: string;
  /** Mascota del mismo usuario, destino del cursor cruzado (R14). */
  let petOther: string;

  const flagsBaseTs = Date.UTC(2026, 6, 1, 10, 0, 0);
  const pagedBaseTs = Date.UTC(2026, 6, 2, 10, 0, 0);
  const pagedCount = POSITIONS_PAGE_LIMIT + 1;

  const createdUserIds: string[] = [];
  const createdPetIds: string[] = [];
  const createdDeviceIds: string[] = [];

  function api() {
    return request(app.getHttpServer());
  }

  async function seedUser(label: string): Promise<TestUser> {
    const id = uuidv7();
    const email = `positions-e2e-${label}-${RUN_ID}@example.com`;

    await db.insert(users).values({
      id,
      email,
      passwordHash: '$argon2id$v=19$m=65536,t=3,p=4$e2e$dummy',
      firstName: 'E2e',
      lastName: label,
      phone: '+525512345678',
      country: 'MX',
      timezone: 'UTC',
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

    const deviceId = uuidv7();
    await db.insert(devices).values({
      id: deviceId,
      esn: `POSITIONS-${deviceId}`,
      status: 'assigned',
      isSimulated: true,
    });
    await db.insert(petDevices).values({ id: uuidv7(), petId: id, deviceId });
    await db.insert(deviceSubscriptions).values({
      deviceId,
      status: 'active',
      planCode: 'grandfathered',
      currentPeriodEnd: new Date('2099-12-31T00:00:00.000Z'),
    });
    createdDeviceIds.push(deviceId);

    return id;
  }

  /** Item con los atributos exactos que escribe el consumidor de #8. */
  function positionItem(
    petId: string,
    ts: number,
    flags: string[],
  ): Record<string, unknown> {
    return {
      [TABLE_POSITIONS_PARTITION_KEY]: `PET#${petId}`,
      [TABLE_POSITIONS_SORT_KEY]: ts,
      lat: 19.4326,
      lng: -99.1332,
      speed_kmh: 4.5,
      course: 180,
      altitude: 2240,
      sats: 9,
      accuracy_m: 12,
      battery_pct: 88,
      device_ts: ts,
      received_ts: ts + 2_000,
      processed_ts: ts + 3_000,
      flags,
      expires_at: Math.floor(ts / 1000) + 90 * 86_400,
    };
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

  function isoOf(ts: number): string {
    return new Date(ts).toISOString();
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
    // cliente low-level de AwsModule. El modulo de lectura usa el suyo (D6).
    documents = app.get<DynamoDBDocumentClient>(POSITIONS_DOC_CLIENT);

    member = await seedUser('member');
    stranger = await seedUser('stranger');

    petFlags = await createPet(member, `Flags-${RUN_ID}`);
    petPaged = await createPet(member, `Paged-${RUN_ID}`);
    petEmpty = await createPet(member, `Empty-${RUN_ID}`);
    petOther = await createPet(member, `Other-${RUN_ID}`);

    await putItems([
      positionItem(petFlags, flagsBaseTs, []),
      positionItem(petFlags, flagsBaseTs + 60_000, [FLAG_LOW_ACCURACY]),
      positionItem(petFlags, flagsBaseTs + 120_000, [FLAG_SUSPECT_JUMP]),
    ]);

    // POSITIONS_PAGE_LIMIT puntos low_accuracy + 1 limpio al final: la
    // primera pagina queda vacia tras el filtro pero con cursor (R15), y la
    // paginacion completa se comprueba con includeSuspect=true (R13).
    await putItems(
      Array.from({ length: pagedCount }, (_, index) =>
        positionItem(
          petPaged,
          pagedBaseTs + index * 1_000,
          index < POSITIONS_PAGE_LIMIT ? [FLAG_LOW_ACCURACY] : [],
        ),
      ),
    );
  });

  afterAll(async () => {
    if (db) {
      if (createdUserIds.length > 0) {
        await db
          .delete(auditLog)
          .where(inArray(auditLog.userId, createdUserIds));
      }
      if (createdPetIds.length > 0) {
        await db.delete(pets).where(inArray(pets.id, createdPetIds));
      }
      if (createdDeviceIds.length > 0) {
        await db
          .delete(deviceSubscriptions)
          .where(inArray(deviceSubscriptions.deviceId, createdDeviceIds));
        await db.delete(devices).where(inArray(devices.id, createdDeviceIds));
      }
      if (createdUserIds.length > 0) {
        await db.delete(users).where(inArray(users.id, createdUserIds));
      }
    }
    await app?.close();
  });

  describe('R1: ambas rutas las autoriza PetAccessGuard, sin mecanismo propio', () => {
    it('un usuario sin membresia recibe el 404 generico en last', async () => {
      await api()
        .get(`/v1/pets/${petFlags}/positions/last`)
        .set('Authorization', `Bearer ${stranger.token}`)
        .expect(404);
    });

    it('un usuario sin membresia recibe el 404 generico en el historico', async () => {
      await api()
        .get(`/v1/pets/${petFlags}/positions`)
        .set('Authorization', `Bearer ${stranger.token}`)
        .expect(404);
    });

    it('un :petId que no es UUID es 404 en las dos rutas, sin tocar la base', async () => {
      await api()
        .get('/v1/pets/not-a-uuid/positions/last')
        .set('Authorization', `Bearer ${member.token}`)
        .expect(404);
      await api()
        .get('/v1/pets/not-a-uuid/positions')
        .set('Authorization', `Bearer ${member.token}`)
        .expect(404);
    });

    it('ninguna de las dos rutas es publica', async () => {
      await api().get(`/v1/pets/${petFlags}/positions/last`).expect(401);
      await api().get(`/v1/pets/${petFlags}/positions`).expect(401);
    });

    it('cualquier rol con membresia activa lee: el owner entra sin @RequirePetRole', async () => {
      await api()
        .get(`/v1/pets/${petFlags}/positions`)
        .set('Authorization', `Bearer ${member.token}`)
        .expect(200);
    });
  });

  describe('R3: last devuelve las 6 claves de la cache con staleSeconds calculado', () => {
    it('200 con lat/lng/ts/accuracy/battery de la cache mas staleSeconds', async () => {
      const ts = Date.now() - 90_000;
      await db
        .update(pets)
        .set({
          lastPosition: {
            lat: 19.4326,
            lng: -99.1332,
            ts,
            accuracy: 12,
            battery: 88,
          },
        })
        .where(eq(pets.id, petFlags));

      const response = await api()
        .get(`/v1/pets/${petFlags}/positions/last`)
        .set('Authorization', `Bearer ${member.token}`)
        .expect(200);

      const body = response.body as Record<string, unknown>;
      expect(Object.keys(body).sort()).toEqual([
        'accuracy',
        'battery',
        'lat',
        'lng',
        'staleSeconds',
        'ts',
      ]);
      expect(body.lat).toBe(19.4326);
      expect(body.lng).toBe(-99.1332);
      expect(body.ts).toBe(ts);
      expect(body.accuracy).toBe(12);
      expect(body.battery).toBe(88);
      expect(body.staleSeconds as number).toBeGreaterThanOrEqual(90);
      expect(body.staleSeconds as number).toBeLessThan(120);
    });
  });

  describe('R5: sin cache, last es 200 con body JSON null (no 404, no 204)', () => {
    it('una mascota recien creada sin collar responde null', async () => {
      const response = await api()
        .get(`/v1/pets/${petEmpty}/positions/last`)
        .set('Authorization', `Bearer ${member.token}`)
        .expect(200);

      expect(response.body).toBeNull();
    });

    it('una cache jsonb corrupta tambien responde null en vez de 500', async () => {
      await db
        .update(pets)
        .set({ lastPosition: { lat: 'corrupto' } })
        .where(eq(pets.id, petOther));

      const response = await api()
        .get(`/v1/pets/${petOther}/positions/last`)
        .set('Authorization', `Bearer ${member.token}`)
        .expect(200);

      expect(response.body).toBeNull();
    });
  });

  describe('R7: la query string invalida es 400', () => {
    it('from que no parsea a un instante', async () => {
      await api()
        .get(`/v1/pets/${petFlags}/positions?from=ayer`)
        .set('Authorization', `Bearer ${member.token}`)
        .expect(400);
    });

    it('includeSuspect con un valor fuera de true/false', async () => {
      await api()
        .get(`/v1/pets/${petFlags}/positions?includeSuspect=1`)
        .set('Authorization', `Bearer ${member.token}`)
        .expect(400);
    });

    it('un parametro desconocido', async () => {
      await api()
        .get(`/v1/pets/${petFlags}/positions?foo=bar`)
        .set('Authorization', `Bearer ${member.token}`)
        .expect(400);
    });
  });

  describe('R9: rangos invalidos son 400 con su codigo', () => {
    it('from >= to es INVALID_RANGE', async () => {
      const response = await api()
        .get(
          `/v1/pets/${petFlags}/positions?from=${isoOf(flagsBaseTs + 60_000)}&to=${isoOf(flagsBaseTs)}`,
        )
        .set('Authorization', `Bearer ${member.token}`)
        .expect(400);

      expect((response.body as { code: string }).code).toBe('INVALID_RANGE');
    });

    it('un rango de 25 h es RANGE_TOO_LARGE', async () => {
      const to = flagsBaseTs + 25 * 3_600_000;
      const response = await api()
        .get(
          `/v1/pets/${petFlags}/positions?from=${isoOf(flagsBaseTs)}&to=${isoOf(to)}`,
        )
        .set('Authorization', `Bearer ${member.token}`)
        .expect(400);

      expect((response.body as { code: string }).code).toBe('RANGE_TOO_LARGE');
    });

    it('un rango de exactamente 24 h no es 400', async () => {
      const to = flagsBaseTs + 24 * 3_600_000;
      await api()
        .get(
          `/v1/pets/${petFlags}/positions?from=${isoOf(flagsBaseTs)}&to=${isoOf(to)}`,
        )
        .set('Authorization', `Bearer ${member.token}`)
        .expect(200);
    });
  });

  describe('R10: la Query respeta el rango inclusive y el orden ascendente', () => {
    it('los limites from y to incluyen los puntos que caen justo encima', async () => {
      const response = await api()
        .get(
          `/v1/pets/${petFlags}/positions?from=${isoOf(flagsBaseTs)}&to=${isoOf(flagsBaseTs + 120_000)}&includeSuspect=true`,
        )
        .set('Authorization', `Bearer ${member.token}`)
        .expect(200);

      const body = response.body as PositionItemBody;
      expect(body.items.map((item) => item.ts)).toEqual([
        flagsBaseTs,
        flagsBaseTs + 60_000,
        flagsBaseTs + 120_000,
      ]);
    });

    it('un rango que deja fuera el primer punto no lo devuelve', async () => {
      const response = await api()
        .get(
          `/v1/pets/${petFlags}/positions?from=${isoOf(flagsBaseTs + 1)}&to=${isoOf(flagsBaseTs + 120_000)}&includeSuspect=true`,
        )
        .set('Authorization', `Bearer ${member.token}`)
        .expect(200);

      const body = response.body as PositionItemBody;
      expect(body.items.map((item) => item.ts)).toEqual([
        flagsBaseTs + 60_000,
        flagsBaseTs + 120_000,
      ]);
    });
  });

  describe('R11: envelope {items, nextCursor} y items sin atributos internos', () => {
    it('cada item trae exactamente las 10 claves publicas en camelCase', async () => {
      const response = await api()
        .get(
          `/v1/pets/${petFlags}/positions?from=${isoOf(flagsBaseTs)}&to=${isoOf(flagsBaseTs + 120_000)}`,
        )
        .set('Authorization', `Bearer ${member.token}`)
        .expect(200);

      const body = response.body as PositionItemBody;
      expect(Object.keys(body).sort()).toEqual(['items', 'nextCursor']);
      expect(Object.keys(body.items[0]).sort()).toEqual([
        'accuracyM',
        'altitude',
        'batteryPct',
        'course',
        'flags',
        'lat',
        'lng',
        'sats',
        'speedKmh',
        'ts',
      ]);
    });

    it('received_ts, processed_ts y expires_at no salen al cliente', async () => {
      const response = await api()
        .get(
          `/v1/pets/${petFlags}/positions?from=${isoOf(flagsBaseTs)}&to=${isoOf(flagsBaseTs + 120_000)}`,
        )
        .set('Authorization', `Bearer ${member.token}`)
        .expect(200);

      expect(JSON.stringify(response.body)).not.toMatch(
        /received_ts|processed_ts|expires_at|"pk"|"sk"/,
      );
    });
  });

  describe('R12: por defecto se ocultan solo los low_accuracy', () => {
    it('sin includeSuspect devuelve 2 de 3: se queda el suspect_jump', async () => {
      const response = await api()
        .get(
          `/v1/pets/${petFlags}/positions?from=${isoOf(flagsBaseTs)}&to=${isoOf(flagsBaseTs + 120_000)}`,
        )
        .set('Authorization', `Bearer ${member.token}`)
        .expect(200);

      const body = response.body as PositionItemBody;
      expect(body.items.map((item) => item.ts)).toEqual([
        flagsBaseTs,
        flagsBaseTs + 120_000,
      ]);
    });

    it('con includeSuspect=true devuelve los 3 sin filtrar', async () => {
      const response = await api()
        .get(
          `/v1/pets/${petFlags}/positions?from=${isoOf(flagsBaseTs)}&to=${isoOf(flagsBaseTs + 120_000)}&includeSuspect=true`,
        )
        .set('Authorization', `Bearer ${member.token}`)
        .expect(200);

      expect((response.body as PositionItemBody).items).toHaveLength(3);
    });
  });

  describe('R13: paginar siguiendo nextCursor recorre la serie completa sin huecos ni duplicados', () => {
    it(`recorre los ${POSITIONS_PAGE_LIMIT + 1} puntos en 2 paginas`, async () => {
      const from = isoOf(pagedBaseTs);
      const to = isoOf(pagedBaseTs + (pagedCount - 1) * 1_000);
      const collected: number[] = [];
      let cursor: string | null = null;
      let pages = 0;

      do {
        const url =
          `/v1/pets/${petPaged}/positions?from=${from}&to=${to}&includeSuspect=true` +
          (cursor === null ? '' : `&cursor=${encodeURIComponent(cursor)}`);
        const response = await api()
          .get(url)
          .set('Authorization', `Bearer ${member.token}`)
          .expect(200);

        const body = response.body as PositionItemBody;
        collected.push(...body.items.map((item) => item.ts as number));
        cursor = body.nextCursor;
        pages += 1;
      } while (cursor !== null && pages < 10);

      expect(pages).toBe(2);
      expect(collected).toHaveLength(pagedCount);
      expect(new Set(collected).size).toBe(pagedCount);
      expect(collected).toEqual([...collected].sort((a, b) => a - b));
      expect(collected[0]).toBe(pagedBaseTs);
      expect(collected[collected.length - 1]).toBe(
        pagedBaseTs + (pagedCount - 1) * 1_000,
      );
    });
  });

  describe('R15: la paginacion es de la Query, no del resultado filtrado', () => {
    it('la primera pagina queda vacia tras el filtro pero conserva nextCursor', async () => {
      const from = isoOf(pagedBaseTs);
      const to = isoOf(pagedBaseTs + (pagedCount - 1) * 1_000);

      const first = await api()
        .get(`/v1/pets/${petPaged}/positions?from=${from}&to=${to}`)
        .set('Authorization', `Bearer ${member.token}`)
        .expect(200);

      const firstBody = first.body as PositionItemBody;
      expect(firstBody.items).toEqual([]);
      expect(firstBody.nextCursor).not.toBeNull();

      const second = await api()
        .get(
          `/v1/pets/${petPaged}/positions?from=${from}&to=${to}&cursor=${encodeURIComponent(firstBody.nextCursor as string)}`,
        )
        .set('Authorization', `Bearer ${member.token}`)
        .expect(200);

      const secondBody = second.body as PositionItemBody;
      expect(secondBody.items).toHaveLength(1);
      expect(secondBody.nextCursor).toBeNull();
    });

    it('un rango sin posiciones es 200 con items vacios y nextCursor null, nunca 404', async () => {
      const response = await api()
        .get(
          `/v1/pets/${petEmpty}/positions?from=${isoOf(flagsBaseTs)}&to=${isoOf(flagsBaseTs + 3_600_000)}`,
        )
        .set('Authorization', `Bearer ${member.token}`)
        .expect(200);

      expect(response.body).toEqual({ items: [], nextCursor: null });
    });
  });

  describe('R14: un cursor manipulado o de otra mascota es 400 INVALID_CURSOR y no filtra nada', () => {
    it('un cursor que no decodifica es 400 con codigo INVALID_CURSOR', async () => {
      const response = await api()
        .get(`/v1/pets/${petFlags}/positions?cursor=%3F%3F%3F`)
        .set('Authorization', `Bearer ${member.token}`)
        .expect(400);

      expect((response.body as { code: string }).code).toBe('INVALID_CURSOR');
    });

    it('un cursor legitimo de una mascota reenviado en la ruta de otra es 400 y cero items de la primera', async () => {
      const from = isoOf(pagedBaseTs);
      const to = isoOf(pagedBaseTs + (pagedCount - 1) * 1_000);

      // Cursor legitimo emitido para petPaged, con el mismo usuario miembro
      // de ambas mascotas.
      const issued = await api()
        .get(
          `/v1/pets/${petPaged}/positions?from=${from}&to=${to}&includeSuspect=true`,
        )
        .set('Authorization', `Bearer ${member.token}`)
        .expect(200);

      const cursor = (issued.body as PositionItemBody).nextCursor;
      expect(cursor).not.toBeNull();

      const replayed = await api()
        .get(
          `/v1/pets/${petOther}/positions?from=${from}&to=${to}&includeSuspect=true&cursor=${encodeURIComponent(cursor as string)}`,
        )
        .set('Authorization', `Bearer ${member.token}`)
        .expect(400);

      const body = replayed.body as { code: string; items?: unknown };
      expect(body.code).toBe('INVALID_CURSOR');
      expect(body.items).toBeUndefined();
      // Ni un solo dato de la mascota del cursor se filtro en la respuesta.
      expect(JSON.stringify(replayed.body)).not.toContain(`${pagedBaseTs}`);
    });

    it('un cursor emitido para otro rango es 400', async () => {
      const from = isoOf(pagedBaseTs);
      const to = isoOf(pagedBaseTs + (pagedCount - 1) * 1_000);

      const issued = await api()
        .get(
          `/v1/pets/${petPaged}/positions?from=${from}&to=${to}&includeSuspect=true`,
        )
        .set('Authorization', `Bearer ${member.token}`)
        .expect(200);

      const cursor = (issued.body as PositionItemBody).nextCursor as string;

      const response = await api()
        .get(
          `/v1/pets/${petPaged}/positions?from=${from}&to=${isoOf(pagedBaseTs + 5_000)}&includeSuspect=true&cursor=${encodeURIComponent(cursor)}`,
        )
        .set('Authorization', `Bearer ${member.token}`)
        .expect(400);

      expect((response.body as { code: string }).code).toBe('INVALID_CURSOR');
    });
  });
});
