import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { and, eq, inArray } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import request from 'supertest';
import { App } from 'supertest/types';
import { uuidv7 } from 'uuidv7';
import { DRIZZLE } from '@/db/drizzle.constants';
import { auditLog } from '@/db/schema/audit-log.schema';
import { geofences } from '@/db/schema/geofences.schema';
import { pets, petUsers } from '@/db/schema/pets.schema';
import { users } from '@/db/schema/users.schema';
import { TOKEN_SERVICE } from '@/modules/auth/domain/ports/token-service';
import type { TokenService } from '@/modules/auth/domain/ports/token-service';
import { AppModule } from './../src/app.module';

/**
 * e2e de geofences-crud contra Postgres real (R1-R15, R26). Mismo arnes que
 * devices.e2e-spec.ts: usuarios sembrados directo en base, tokens firmados
 * con el TokenService de la app, IDs unicos por RUN_ID para no chocar entre
 * corridas.
 */
describe('Geofences CRUD (e2e)', () => {
  const RUN_ID = `${Date.now()}`;

  let app: INestApplication<App>;
  let db: NodePgDatabase;
  let tokenService: TokenService;

  const createdUserIds: string[] = [];
  const createdPetIds: string[] = [];

  interface TestUser {
    id: string;
    email: string;
    token: string;
  }

  async function seedUser(label: string): Promise<TestUser> {
    const id = uuidv7();
    const email = `geofences-e2e-${label}-${RUN_ID}@example.com`;

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

    return { id, email, token: tokenService.sign({ sub: id, email }) };
  }

  async function createPetViaApi(owner: TestUser, name: string) {
    const response = await api()
      .post('/v1/pets')
      .set('Authorization', `Bearer ${owner.token}`)
      .send({ name, species: 'dog', birthDate: '2024-01-15' })
      .expect(201);

    const body = response.body as { id: string };
    createdPetIds.push(body.id);

    return body;
  }

  function seedMembership(
    petId: string,
    userId: string,
    role: string,
    status = 'active',
  ) {
    return db.insert(petUsers).values({ petId, userId, role, status });
  }

  function api() {
    return request(app.getHttpServer());
  }

  function validBody(overrides: Record<string, unknown> = {}) {
    return {
      name: `Casa-${RUN_ID}-${Math.random().toString(36).slice(2)}`,
      type: 'safe_circle',
      centerLat: 19.4326,
      centerLng: -99.1332,
      radiusM: 100,
      ...overrides,
    };
  }

  function create(
    user: TestUser,
    petId: string,
    body: Record<string, unknown>,
  ) {
    return api()
      .post(`/v1/pets/${petId}/geofences`)
      .set('Authorization', `Bearer ${user.token}`)
      .send(body);
  }

  async function createGeofenceViaApi(
    user: TestUser,
    petId: string,
    overrides: Record<string, unknown> = {},
  ) {
    const response = await create(user, petId, validBody(overrides)).expect(
      201,
    );
    return response.body as Record<string, unknown>;
  }

  /** 404 generico del guard: el baseline contra el que se compara R2. */
  async function guardBaseline404(user: TestUser) {
    const response = await api()
      .get(`/v1/pets/${uuidv7()}`)
      .set('Authorization', `Bearer ${user.token}`)
      .expect(404);

    return response.body as Record<string, unknown>;
  }

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    // Mismo prefijo global que main.ts — sin esto /v1/* daria 404 aqui.
    app.setGlobalPrefix('v1');
    await app.init();

    db = app.get<NodePgDatabase>(DRIZZLE);
    tokenService = app.get<TokenService>(TOKEN_SERVICE);
  });

  afterAll(async () => {
    if (createdUserIds.length > 0) {
      await db.delete(auditLog).where(inArray(auditLog.userId, createdUserIds));
    }
    if (createdPetIds.length > 0) {
      // Cascadea pet_users y geofences (ON DELETE CASCADE de R1).
      await db.delete(pets).where(inArray(pets.id, createdPetIds));
    }
    if (createdUserIds.length > 0) {
      await db.delete(users).where(inArray(users.id, createdUserIds));
    }
    await app.close();
  });

  const GEOFENCE_KEYS = [
    'id',
    'petId',
    'name',
    'type',
    'centerLat',
    'centerLng',
    'radiusM',
    'active',
    'state',
    'createdAt',
    'updatedAt',
  ].sort();

  describe('R1: la tabla geofences persiste el shape de docs/data-model.md', () => {
    it('el INSERT feliz deja geofence_state en el default {unknown, null} y active en true', async () => {
      const owner = await seedUser('r1-owner');
      const pet = await createPetViaApi(owner, `R1-${RUN_ID}`);

      const body = await createGeofenceViaApi(owner, pet.id);

      const [row] = await db
        .select()
        .from(geofences)
        .where(eq(geofences.id, body.id as string));
      expect(row.geofenceState).toEqual({ state: 'unknown', updatedAt: null });
      expect(row.active).toBe(true);
      expect(row.type).toBe('safe_circle');
    });
  });

  describe('R2: mascota ajena/inexistente/malformada responde 404 generico en las cinco rutas', () => {
    it('usuario B sobre mascota de A recibe el mismo 404 que el guard en POST/GET-list/GET/PATCH/DELETE', async () => {
      const owner = await seedUser('r2-owner');
      const outsider = await seedUser('r2-outsider');
      const pet = await createPetViaApi(owner, `R2-${RUN_ID}`);
      const geofence = await createGeofenceViaApi(owner, pet.id);
      const geofenceId = geofence.id as string;

      const baseline = await guardBaseline404(outsider);

      const routesFor = (petId: string) => [
        () => create(outsider, petId, validBody()),
        () =>
          api()
            .get(`/v1/pets/${petId}/geofences`)
            .set('Authorization', `Bearer ${outsider.token}`),
        () =>
          api()
            .get(`/v1/pets/${petId}/geofences/${geofenceId}`)
            .set('Authorization', `Bearer ${outsider.token}`),
        () =>
          api()
            .patch(`/v1/pets/${petId}/geofences/${geofenceId}`)
            .set('Authorization', `Bearer ${outsider.token}`)
            .send({ name: `Hack-${RUN_ID}` }),
        () =>
          api()
            .delete(`/v1/pets/${petId}/geofences/${geofenceId}`)
            .set('Authorization', `Bearer ${outsider.token}`),
      ];

      // Mascota ajena, mascota inexistente (UUID valido) y :petId malformado
      // — las tres caen en el mismo 404 generico del guard, sin tocar geofences.
      for (const petId of [pet.id, uuidv7(), 'not-a-uuid']) {
        for (const call of routesFor(petId)) {
          const response = await call().expect(404);
          expect(response.body).toEqual(baseline);
        }
      }
    });
  });

  describe('R3: rol distinto de owner en POST/PATCH/DELETE recibe 403; GET sin restriccion de rol', () => {
    it('family recibe 403 en mutaciones y 200 en list/detail', async () => {
      const owner = await seedUser('r3-owner');
      const family = await seedUser('r3-family');
      const pet = await createPetViaApi(owner, `R3-${RUN_ID}`);
      await seedMembership(pet.id, family.id, 'family');
      const geofence = await createGeofenceViaApi(owner, pet.id);
      const geofenceId = geofence.id as string;

      await create(family, pet.id, validBody()).expect(403);
      await api()
        .patch(`/v1/pets/${pet.id}/geofences/${geofenceId}`)
        .set('Authorization', `Bearer ${family.token}`)
        .send({ name: `Renombrada-${RUN_ID}` })
        .expect(403);
      await api()
        .delete(`/v1/pets/${pet.id}/geofences/${geofenceId}`)
        .set('Authorization', `Bearer ${family.token}`)
        .expect(403);

      await api()
        .get(`/v1/pets/${pet.id}/geofences`)
        .set('Authorization', `Bearer ${family.token}`)
        .expect(200);
      await api()
        .get(`/v1/pets/${pet.id}/geofences/${geofenceId}`)
        .set('Authorization', `Bearer ${family.token}`)
        .expect(200);

      // Ninguno de los 403 escribio: sigue existiendo una sola geocerca.
      const rows = await db
        .select()
        .from(geofences)
        .where(eq(geofences.petId, pet.id));
      expect(rows).toHaveLength(1);
    });
  });

  describe('R4: POST feliz inserta, audita geofence.create y responde 201', () => {
    it('responde 201 con el shape completo y una entrada de auditoria con meta {petId}', async () => {
      const owner = await seedUser('r4-owner');
      const pet = await createPetViaApi(owner, `R4-${RUN_ID}`);

      const response = await create(
        owner,
        pet.id,
        validBody({ active: false }),
      ).expect(201);
      const body = response.body as Record<string, unknown>;

      expect(Object.keys(body).sort()).toEqual(GEOFENCE_KEYS);
      expect(body.petId).toBe(pet.id);
      expect(body.active).toBe(false);
      expect(body.state).toEqual({ value: 'unknown', updatedAt: null });

      const entries = await db
        .select()
        .from(auditLog)
        .where(
          and(
            eq(auditLog.action, 'geofence.create'),
            eq(auditLog.entityId, body.id as string),
          ),
        );
      expect(entries).toHaveLength(1);
      expect(entries[0].entity).toBe('geofence');
      expect(entries[0].userId).toBe(owner.id);
      expect(entries[0].meta).toEqual({ petId: pet.id });
    });
  });

  describe('R5: POST invalido responde 400 sin escribir en geofences', () => {
    it('rechaza radius fuera de rango, type incorrecto, lat/lng fuera de rango y clave desconocida', async () => {
      const owner = await seedUser('r5-owner');
      const pet = await createPetViaApi(owner, `R5-${RUN_ID}`);

      await create(owner, pet.id, validBody({ radiusM: 10 })).expect(400);
      await create(owner, pet.id, validBody({ radiusM: 2001 })).expect(400);
      await create(owner, pet.id, validBody({ type: 'safe_polygon' })).expect(
        400,
      );
      await create(owner, pet.id, validBody({ centerLat: 91 })).expect(400);
      await create(owner, pet.id, validBody({ centerLng: -181 })).expect(400);
      await create(owner, pet.id, validBody({ name: '' })).expect(400);
      await create(owner, pet.id, validBody({ extra: 'nope' })).expect(400);

      const rows = await db
        .select()
        .from(geofences)
        .where(eq(geofences.petId, pet.id));
      expect(rows).toHaveLength(0);
    });
  });

  describe('R6: sexta geocerca responde 400 MAX_GEOFENCES_REACHED sin persistir', () => {
    it('activas e inactivas cuentan igual para el tope de 5', async () => {
      const owner = await seedUser('r6-owner');
      const pet = await createPetViaApi(owner, `R6-${RUN_ID}`);

      for (let index = 0; index < 4; index++) {
        await createGeofenceViaApi(owner, pet.id, {
          name: `G${index}-${RUN_ID}`,
        });
      }
      await createGeofenceViaApi(owner, pet.id, {
        name: `G4-${RUN_ID}`,
        active: false,
      });

      const response = await create(
        owner,
        pet.id,
        validBody({ name: `G5-${RUN_ID}` }),
      ).expect(400);
      expect((response.body as { code: string }).code).toBe(
        'MAX_GEOFENCES_REACHED',
      );

      const rows = await db
        .select()
        .from(geofences)
        .where(eq(geofences.petId, pet.id));
      expect(rows).toHaveLength(5);
    });
  });

  describe('R7: nombre duplicado responde 409 GEOFENCE_NAME_TAKEN; carrera concurrente deja a lo sumo un 201', () => {
    it('el segundo POST con el mismo nombre para la misma mascota es 409', async () => {
      const owner = await seedUser('r7-owner');
      const pet = await createPetViaApi(owner, `R7-${RUN_ID}`);
      const name = `Jardin-${RUN_ID}`;

      await create(owner, pet.id, validBody({ name })).expect(201);
      const response = await create(owner, pet.id, validBody({ name })).expect(
        409,
      );
      expect((response.body as { code: string }).code).toBe(
        'GEOFENCE_NAME_TAKEN',
      );
    });

    it('dos POST concurrentes con el mismo nombre: a lo sumo un 201, jamas un 500', async () => {
      const owner = await seedUser('r7b-owner');
      const pet = await createPetViaApi(owner, `R7b-${RUN_ID}`);
      const name = `Patio-${RUN_ID}`;

      const [first, second] = await Promise.all([
        create(owner, pet.id, validBody({ name })),
        create(owner, pet.id, validBody({ name })),
      ]);

      expect([first.status, second.status].sort()).toEqual([201, 409]);

      const rows = await db
        .select()
        .from(geofences)
        .where(and(eq(geofences.petId, pet.id), eq(geofences.name, name)));
      expect(rows).toHaveLength(1);
    });
  });

  describe('R8: GET list responde 200 con array ordenado por created_at, [] si no hay geocercas', () => {
    it('mascota sin geocercas responde [] (nunca 404)', async () => {
      const owner = await seedUser('r8-owner');
      const pet = await createPetViaApi(owner, `R8-${RUN_ID}`);

      const response = await api()
        .get(`/v1/pets/${pet.id}/geofences`)
        .set('Authorization', `Bearer ${owner.token}`)
        .expect(200);
      expect(response.body).toEqual([]);
    });

    it('geocercas existentes salen ordenadas por created_at ascendente', async () => {
      const owner = await seedUser('r8b-owner');
      const pet = await createPetViaApi(owner, `R8b-${RUN_ID}`);

      const first = await createGeofenceViaApi(owner, pet.id, {
        name: `Primera-${RUN_ID}`,
      });
      const second = await createGeofenceViaApi(owner, pet.id, {
        name: `Segunda-${RUN_ID}`,
      });

      const response = await api()
        .get(`/v1/pets/${pet.id}/geofences`)
        .set('Authorization', `Bearer ${owner.token}`)
        .expect(200);

      const body = response.body as Array<{ id: string }>;
      expect(body.map((g) => g.id)).toEqual([first.id, second.id]);
    });
  });

  describe('R9: GET detail responde 200 con shape completo; id invalido/ajeno es 404 GEOFENCE_NOT_FOUND', () => {
    it('responde el shape completo de R9 para una geocerca propia', async () => {
      const owner = await seedUser('r9-owner');
      const pet = await createPetViaApi(owner, `R9-${RUN_ID}`);
      const created = await createGeofenceViaApi(owner, pet.id);
      const geofenceId = created.id as string;

      const response = await api()
        .get(`/v1/pets/${pet.id}/geofences/${geofenceId}`)
        .set('Authorization', `Bearer ${owner.token}`)
        .expect(200);

      expect(Object.keys(response.body as object).sort()).toEqual(
        GEOFENCE_KEYS,
      );
      expect(response.body).toEqual(created);
    });

    it(':geofenceId inexistente o malformado es 404 GEOFENCE_NOT_FOUND', async () => {
      const owner = await seedUser('r9b-owner');
      const pet = await createPetViaApi(owner, `R9b-${RUN_ID}`);

      const missing = await api()
        .get(`/v1/pets/${pet.id}/geofences/${uuidv7()}`)
        .set('Authorization', `Bearer ${owner.token}`)
        .expect(404);
      expect((missing.body as { code: string }).code).toBe(
        'GEOFENCE_NOT_FOUND',
      );

      const malformed = await api()
        .get(`/v1/pets/${pet.id}/geofences/not-a-uuid`)
        .set('Authorization', `Bearer ${owner.token}`)
        .expect(404);
      expect((malformed.body as { code: string }).code).toBe(
        'GEOFENCE_NOT_FOUND',
      );
    });

    it('geocerca de otra mascota del MISMO owner es 404 (aislamiento entre mascotas, IDOR)', async () => {
      const owner = await seedUser('r9c-owner');
      const petA = await createPetViaApi(owner, `R9cA-${RUN_ID}`);
      const petB = await createPetViaApi(owner, `R9cB-${RUN_ID}`);
      const geofenceOfB = await createGeofenceViaApi(owner, petB.id);
      const geofenceOfBId = geofenceOfB.id as string;

      const response = await api()
        .get(`/v1/pets/${petA.id}/geofences/${geofenceOfBId}`)
        .set('Authorization', `Bearer ${owner.token}`)
        .expect(404);
      expect((response.body as { code: string }).code).toBe(
        'GEOFENCE_NOT_FOUND',
      );
    });
  });

  describe('R10: PATCH parcial valido actualiza solo las claves presentes, audita geofence.update y responde 200', () => {
    it('cambia name y radiusM, deja el resto intacto, y audita solo los nombres de campo', async () => {
      const owner = await seedUser('r10-owner');
      const pet = await createPetViaApi(owner, `R10-${RUN_ID}`);
      const created = await createGeofenceViaApi(owner, pet.id);
      const geofenceId = created.id as string;

      const response = await api()
        .patch(`/v1/pets/${pet.id}/geofences/${geofenceId}`)
        .set('Authorization', `Bearer ${owner.token}`)
        .send({ name: `Renombrada-${RUN_ID}`, radiusM: 250 })
        .expect(200);

      const body = response.body as Record<string, unknown>;
      expect(body.name).toBe(`Renombrada-${RUN_ID}`);
      expect(body.radiusM).toBe(250);
      expect(body.centerLat).toBe(created.centerLat);
      expect(body.centerLng).toBe(created.centerLng);
      expect(body.updatedAt).not.toBe(created.updatedAt);

      const entries = await db
        .select()
        .from(auditLog)
        .where(
          and(
            eq(auditLog.action, 'geofence.update'),
            eq(auditLog.entityId, created.id as string),
          ),
        );
      expect(entries).toHaveLength(1);
      expect(entries[0].meta).toEqual({
        petId: pet.id,
        fields: ['name', 'radiusM'],
      });
    });
  });

  describe('R11: PATCH invalido responde 400 sin escribir en geofences', () => {
    it('rechaza radius fuera de rango, lat/lng fuera de rango y la clave type', async () => {
      const owner = await seedUser('r11-owner');
      const pet = await createPetViaApi(owner, `R11-${RUN_ID}`);
      const created = await createGeofenceViaApi(owner, pet.id);
      const geofenceId = created.id as string;

      const patch = (body: Record<string, unknown>) =>
        api()
          .patch(`/v1/pets/${pet.id}/geofences/${geofenceId}`)
          .set('Authorization', `Bearer ${owner.token}`)
          .send(body);

      await patch({ radiusM: 10 }).expect(400);
      await patch({ centerLat: 91 }).expect(400);
      await patch({ type: 'safe_circle' }).expect(400);

      const [row] = await db
        .select()
        .from(geofences)
        .where(eq(geofences.id, created.id as string));
      expect(row.updatedAt.toISOString()).toBe(created.updatedAt);
    });
  });

  describe('R12: PATCH sobre id inexistente/malformado/ajeno responde 404 GEOFENCE_NOT_FOUND', () => {
    it('cubre los tres casos', async () => {
      const owner = await seedUser('r12-owner');
      const petA = await createPetViaApi(owner, `R12a-${RUN_ID}`);
      const petB = await createPetViaApi(owner, `R12b-${RUN_ID}`);
      const geofenceOfB = await createGeofenceViaApi(owner, petB.id);

      const patch = (petId: string, geofenceId: string) =>
        api()
          .patch(`/v1/pets/${petId}/geofences/${geofenceId}`)
          .set('Authorization', `Bearer ${owner.token}`)
          .send({ name: `X-${RUN_ID}` });

      await patch(petA.id, uuidv7()).expect(404);
      await patch(petA.id, 'not-a-uuid').expect(404);
      await patch(petA.id, geofenceOfB.id as string).expect(404);
    });
  });

  describe('R13: PATCH sin campos reconocidos es no-op (200, sin escribir ni auditar); 404 de R12 precede', () => {
    it('{} responde 200 sin cambios y sin auditoria nueva', async () => {
      const owner = await seedUser('r13-owner');
      const pet = await createPetViaApi(owner, `R13-${RUN_ID}`);
      const created = await createGeofenceViaApi(owner, pet.id);
      const geofenceId = created.id as string;

      const before = await db
        .select()
        .from(auditLog)
        .where(eq(auditLog.action, 'geofence.update'));

      const response = await api()
        .patch(`/v1/pets/${pet.id}/geofences/${geofenceId}`)
        .set('Authorization', `Bearer ${owner.token}`)
        .send({})
        .expect(200);
      expect(response.body).toEqual(created);

      const after = await db
        .select()
        .from(auditLog)
        .where(eq(auditLog.action, 'geofence.update'));
      expect(after).toHaveLength(before.length);
    });

    it('geocerca inexistente con body vacio sigue siendo 404 (R12 precede al no-op)', async () => {
      const owner = await seedUser('r13b-owner');
      const pet = await createPetViaApi(owner, `R13b-${RUN_ID}`);

      const response = await api()
        .patch(`/v1/pets/${pet.id}/geofences/${uuidv7()}`)
        .set('Authorization', `Bearer ${owner.token}`)
        .send({})
        .expect(404);
      expect((response.body as { code: string }).code).toBe(
        'GEOFENCE_NOT_FOUND',
      );
    });
  });

  describe('R14: DELETE borra la fila (hard delete), audita geofence.delete y responde 204', () => {
    it('204 sin body; la fila desaparece; queda una entrada de auditoria', async () => {
      const owner = await seedUser('r14-owner');
      const pet = await createPetViaApi(owner, `R14-${RUN_ID}`);
      const created = await createGeofenceViaApi(owner, pet.id);
      const geofenceId = created.id as string;

      const response = await api()
        .delete(`/v1/pets/${pet.id}/geofences/${geofenceId}`)
        .set('Authorization', `Bearer ${owner.token}`)
        .expect(204);
      expect(response.body).toEqual({});

      const rows = await db
        .select()
        .from(geofences)
        .where(eq(geofences.id, created.id as string));
      expect(rows).toHaveLength(0);

      const entries = await db
        .select()
        .from(auditLog)
        .where(
          and(
            eq(auditLog.action, 'geofence.delete'),
            eq(auditLog.entityId, created.id as string),
          ),
        );
      expect(entries).toHaveLength(1);
      expect(entries[0].meta).toEqual({ petId: pet.id });
    });
  });

  describe('R15: DELETE sobre id inexistente/malformado/ajeno responde 404 sin auditar', () => {
    it('cubre los tres casos y no deja auditoria', async () => {
      const owner = await seedUser('r15-owner');
      const petA = await createPetViaApi(owner, `R15a-${RUN_ID}`);
      const petB = await createPetViaApi(owner, `R15b-${RUN_ID}`);
      const geofenceOfB = await createGeofenceViaApi(owner, petB.id);

      const del = (petId: string, geofenceId: string) =>
        api()
          .delete(`/v1/pets/${petId}/geofences/${geofenceId}`)
          .set('Authorization', `Bearer ${owner.token}`);

      await del(petA.id, uuidv7()).expect(404);
      await del(petA.id, 'not-a-uuid').expect(404);
      await del(petA.id, geofenceOfB.id as string).expect(404);

      // geofenceOfB sigue viva: ninguno de los tres 404 la borro.
      const rows = await db
        .select()
        .from(geofences)
        .where(eq(geofences.id, geofenceOfB.id as string));
      expect(rows).toHaveLength(1);

      const entries = await db
        .select()
        .from(auditLog)
        .where(
          and(
            eq(auditLog.action, 'geofence.delete'),
            eq(auditLog.entityId, geofenceOfB.id as string),
          ),
        );
      expect(entries).toHaveLength(0);
    });
  });
});
