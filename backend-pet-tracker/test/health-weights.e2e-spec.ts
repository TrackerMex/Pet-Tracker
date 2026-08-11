import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { and, eq, inArray } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import request from 'supertest';
import { App } from 'supertest/types';
import { uuidv7 } from 'uuidv7';
import { DRIZZLE } from '@/db/drizzle.constants';
import { auditLog } from '@/db/schema/audit-log.schema';
import { weights } from '@/db/schema/health.schema';
import { pets, petUsers } from '@/db/schema/pets.schema';
import { users } from '@/db/schema/users.schema';
import { TOKEN_SERVICE } from '@/modules/auth/domain/ports/token-service';
import type { TokenService } from '@/modules/auth/domain/ports/token-service';
import { MEASURED_AT_MAX_FUTURE_DAYS } from '@/modules/health/application/dto/weight.dto';
import { AppModule } from '../src/app.module';

describe('Health weights (e2e)', () => {
  const runId = Date.now();
  let app: INestApplication<App>;
  let db: NodePgDatabase;
  let tokens: TokenService;
  const userIds: string[] = [];
  const petIds: string[] = [];

  interface UserFixture {
    id: string;
    token: string;
  }

  const api = () => request(app.getHttpServer());
  const auth = (token: string) => ({ Authorization: `Bearer ${token}` });
  const isoDateOffset = (days: number) => {
    const date = new Date();
    date.setUTCDate(date.getUTCDate() + days);
    return date.toISOString().slice(0, 10);
  };
  const today = () => isoDateOffset(0);

  async function seedUser(label: string): Promise<UserFixture> {
    const id = uuidv7();
    const email = `weights-${label}-${runId}@example.com`;
    await db.insert(users).values({
      id,
      email,
      passwordHash: 'not-used',
      firstName: 'E2e',
      lastName: label,
      phone: '+525512345678',
      country: 'MX',
      timezone: 'UTC',
      termsAcceptedAt: new Date(),
    });
    userIds.push(id);
    return { id, token: tokens.sign({ sub: id, email }) };
  }

  async function seedPet(owner: UserFixture) {
    const response = await api()
      .post('/v1/pets')
      .set(auth(owner.token))
      .send({ name: `Pet-${uuidv7()}`, species: 'dog', birthDate: '2024-01-15' })
      .expect(201);
    const pet = response.body as { id: string };
    petIds.push(pet.id);
    return pet;
  }

  const postWeight = (
    user: UserFixture,
    petId: string,
    body: Record<string, unknown>,
  ) => api().post(`/v1/pets/${petId}/weights`).set(auth(user.token)).send(body);

  async function currentWeight(user: UserFixture, petId: string) {
    const response = await api()
      .get(`/v1/pets/${petId}`)
      .set(auth(user.token))
      .expect(200);
    return (response.body as { currentWeightKg: number | null })
      .currentWeightKg;
  }

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = module.createNestApplication();
    app.setGlobalPrefix('v1');
    await app.init();
    db = app.get<NodePgDatabase>(DRIZZLE);
    tokens = app.get<TokenService>(TOKEN_SERVICE);
  });

  afterAll(async () => {
    if (userIds.length) {
      await db.delete(auditLog).where(inArray(auditLog.userId, userIds));
    }
    if (petIds.length) {
      await db.delete(pets).where(inArray(pets.id, petIds));
    }
    if (userIds.length) {
      await db.delete(users).where(inArray(users.id, userIds));
    }
    await app.close();
  });

  describe('R2 (health-weights #15): POST inserta y responde el shape congelado', () => {
    it('responde 201, convierte numeric a number y persiste created_by', async () => {
      const owner = await seedUser('r2');
      const pet = await seedPet(owner);

      const response = await postWeight(owner, pet.id, {
        weightKg: 21.35,
        measuredAt: today(),
      }).expect(201);

      expect(Object.keys(response.body as object).sort()).toEqual(
        [
          'id',
          'petId',
          'weightKg',
          'measuredAt',
          'bodyCondition',
          'variation',
        ].sort(),
      );
      expect(response.body).toMatchObject({
        petId: pet.id,
        weightKg: 21.35,
        measuredAt: today(),
        bodyCondition: null,
        variation: null,
      });
      expect(typeof (response.body as { weightKg: unknown }).weightKg).toBe(
        'number',
      );

      const [row] = await db
        .select()
        .from(weights)
        .where(eq(weights.id, (response.body as { id: string }).id));
      expect(row.createdBy).toBe(owner.id);
      expect(row.weightKg).toBe('21.35');
    });

    it('permite varias mediciones de la misma mascota en la misma fecha', async () => {
      const owner = await seedUser('r2-tie');
      const pet = await seedPet(owner);
      const body = { weightKg: 10, measuredAt: today(), bodyCondition: 5 };

      await postWeight(owner, pet.id, body).expect(201);
      await postWeight(owner, pet.id, body).expect(201);
    });
  });

  describe('R3 (health-weights #15): current_weight_kg refleja solo la medicion mas reciente', () => {
    it('la primera medicion actualiza el perfil', async () => {
      const owner = await seedUser('r3-first');
      const pet = await seedPet(owner);

      await postWeight(owner, pet.id, {
        weightKg: 18.4,
        measuredAt: '2026-01-15',
      }).expect(201);

      expect(await currentWeight(owner, pet.id)).toBe(18.4);
    });

    it('una medicion retroactiva no pisa el peso mas reciente', async () => {
      const owner = await seedUser('r3-retroactive');
      const pet = await seedPet(owner);

      await postWeight(owner, pet.id, {
        weightKg: 20,
        measuredAt: '2026-02-15',
      }).expect(201);
      await postWeight(owner, pet.id, {
        weightKg: 17,
        measuredAt: '2026-01-15',
      }).expect(201);

      expect(await currentWeight(owner, pet.id)).toBe(20);
    });

    it('un empate de measuredAt deja ganar la ultima escritura', async () => {
      const owner = await seedUser('r3-tie');
      const pet = await seedPet(owner);
      const measuredAt = '2026-03-15';

      await postWeight(owner, pet.id, {
        weightKg: 22,
        measuredAt,
      }).expect(201);
      await postWeight(owner, pet.id, {
        weightKg: 22.8,
        measuredAt,
      }).expect(201);

      expect(await currentWeight(owner, pet.id)).toBe(22.8);
    });
  });

  describe('R5 (health-weights #15): historial ordenado con variation', () => {
    it('devuelve [] para una mascota sin mediciones', async () => {
      const owner = await seedUser('r5-empty');
      const pet = await seedPet(owner);

      const response = await api()
        .get(`/v1/pets/${pet.id}/weights`)
        .set(auth(owner.token))
        .expect(200);

      expect(response.body).toEqual([]);
    });

    it('ordena measuredAt DESC, id DESC y calcula la variacion inmediata', async () => {
      const owner = await seedUser('r5-history');
      const pet = await seedPet(owner);
      const createdIds: string[] = [];

      for (const body of [
        { weightKg: 10, measuredAt: '2026-01-01' },
        { weightKg: 12.5, measuredAt: '2026-02-01' },
        { weightKg: 13.25, measuredAt: '2026-02-01' },
      ]) {
        const response = await postWeight(owner, pet.id, body).expect(201);
        createdIds.push((response.body as { id: string }).id);
      }

      const response = await api()
        .get(`/v1/pets/${pet.id}/weights`)
        .set(auth(owner.token))
        .expect(200);
      const rows = response.body as Array<{
        id: string;
        variation: number | null;
      }>;

      expect(rows.map((row) => row.id)).toEqual([
        createdIds[2],
        createdIds[1],
        createdIds[0],
      ]);
      expect(rows.map((row) => row.variation)).toEqual([0.75, 2.5, null]);
    });

    it('con limit=1 calcula variation usando una fila fuera de la pagina', async () => {
      const owner = await seedUser('r5-probe');
      const pet = await seedPet(owner);

      await postWeight(owner, pet.id, {
        weightKg: 69.8,
        measuredAt: '2026-01-01',
      }).expect(201);
      await postWeight(owner, pet.id, {
        weightKg: 70.2,
        measuredAt: '2026-02-01',
      }).expect(201);

      const response = await api()
        .get(`/v1/pets/${pet.id}/weights?limit=1`)
        .set(auth(owner.token))
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect((response.body as Array<{ variation: number }>)[0].variation).toBe(
        0.4,
      );
    });
  });

  describe('R6 (health-weights #15): limit usa default 50, maximo 100 y validacion estricta', () => {
    it('sin limit devuelve como maximo los 50 pesos mas recientes', async () => {
      const owner = await seedUser('r6-default');
      const pet = await seedPet(owner);
      await db.insert(weights).values(
        Array.from({ length: 55 }, (_, index) => ({
          id: uuidv7(),
          petId: pet.id,
          weightKg: String(10 + index / 100),
          measuredAt: '2026-01-01',
          createdBy: owner.id,
        })),
      );

      const response = await api()
        .get(`/v1/pets/${pet.id}/weights`)
        .set(auth(owner.token))
        .expect(200);

      expect(response.body).toHaveLength(50);
    });

    it('limit=1 devuelve solo la medicion mas reciente', async () => {
      const owner = await seedUser('r6-one');
      const pet = await seedPet(owner);
      await postWeight(owner, pet.id, {
        weightKg: 10,
        measuredAt: '2026-01-01',
      }).expect(201);
      const latest = await postWeight(owner, pet.id, {
        weightKg: 11,
        measuredAt: '2026-02-01',
      }).expect(201);

      const response = await api()
        .get(`/v1/pets/${pet.id}/weights?limit=1`)
        .set(auth(owner.token))
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect((response.body as Array<{ id: string }>)[0].id).toBe(
        (latest.body as { id: string }).id,
      );
    });

    it.each([
      'limit=0',
      'limit=101',
      'limit=1.5',
      'limit=abc',
      'limit=',
      'other=1',
    ])('rechaza query invalida: %s', async (query) => {
      const owner = await seedUser(`r6-invalid-${query}`);
      const pet = await seedPet(owner);

      await api()
        .get(`/v1/pets/${pet.id}/weights?${query}`)
        .set(auth(owner.token))
        .expect(400);
    });
  });

  describe('R7 (health-weights #15): body invalido responde 400 sin persistir', () => {
    it.each<[string, Record<string, unknown>]>([
      ['weight-zero', { weightKg: 0, measuredAt: today() }],
      ['weight-negative', { weightKg: -1, measuredAt: today() }],
      ['weight-overflow', { weightKg: 1000, measuredAt: today() }],
      ['weight-string', { weightKg: '10', measuredAt: today() }],
      [
        'condition-zero',
        { weightKg: 10, measuredAt: today(), bodyCondition: 0 },
      ],
      [
        'condition-ten',
        { weightKg: 10, measuredAt: today(), bodyCondition: 10 },
      ],
      [
        'condition-decimal',
        { weightKg: 10, measuredAt: today(), bodyCondition: 4.5 },
      ],
      ['invalid-date', { weightKg: 10, measuredAt: '2026-02-30' }],
      ['unknown-key', { weightKg: 10, measuredAt: today(), extra: true }],
    ])('rechaza %s y deja historial y perfil intactos', async (label, body) => {
      const owner = await seedUser(`r7-${label}`);
      const pet = await seedPet(owner);

      const response = await postWeight(owner, pet.id, body).expect(400);

      expect(response.body).toMatchObject({
        statusCode: 400,
        message: 'Validation failed',
        errors: expect.any(Array),
      });
      expect(
        await db.select().from(weights).where(eq(weights.petId, pet.id)),
      ).toEqual([]);
      expect(await currentWeight(owner, pet.id)).toBeNull();
    });

    it('acepta hoy y hoy mas un dia, pero rechaza hoy mas dos', async () => {
      const owner = await seedUser('r7-future-boundary');
      const pet = await seedPet(owner);

      await postWeight(owner, pet.id, {
        weightKg: 20,
        measuredAt: isoDateOffset(0),
      }).expect(201);
      await postWeight(owner, pet.id, {
        weightKg: 21,
        measuredAt: isoDateOffset(MEASURED_AT_MAX_FUTURE_DAYS),
      }).expect(201);
      await postWeight(owner, pet.id, {
        weightKg: 22,
        measuredAt: isoDateOffset(MEASURED_AT_MAX_FUTURE_DAYS + 1),
      }).expect(400);

      expect(
        await db.select().from(weights).where(eq(weights.petId, pet.id)),
      ).toHaveLength(2);
      expect(await currentWeight(owner, pet.id)).toBe(21);
    });
  });

  describe('R8 (health-weights #15): PetAccessGuard responde 404 antes de tocar pesos', () => {
    it('un usuario sin membresia recibe 404 en POST y GET', async () => {
      const owner = await seedUser('r8-owner');
      const outsider = await seedUser('r8-outsider');
      const pet = await seedPet(owner);

      await postWeight(outsider, pet.id, {
        weightKg: 10,
        measuredAt: today(),
      }).expect(404);
      await api()
        .get(`/v1/pets/${pet.id}/weights`)
        .set(auth(outsider.token))
        .expect(404);
    });

    it('una mascota inexistente recibe 404 en POST y GET', async () => {
      const owner = await seedUser('r8-missing');
      const missingPetId = uuidv7();

      await postWeight(owner, missingPetId, {
        weightKg: 10,
        measuredAt: today(),
      }).expect(404);
      await api()
        .get(`/v1/pets/${missingPetId}/weights`)
        .set(auth(owner.token))
        .expect(404);
    });

    it('un petId no UUID recibe 404 en POST y GET', async () => {
      const owner = await seedUser('r8-invalid');
      const invalidPetId = 'not-a-uuid';

      await postWeight(owner, invalidPetId, {
        weightKg: 10,
        measuredAt: today(),
      }).expect(404);
      await api()
        .get(`/v1/pets/${invalidPetId}/weights`)
        .set(auth(owner.token))
        .expect(404);
    });
  });

  describe('R9 (health-weights #15): solo owner crea y cualquier miembro activo lee', () => {
    it('family recibe 403 en POST y 200 en GET', async () => {
      const owner = await seedUser('r9-owner');
      const family = await seedUser('r9-family');
      const pet = await seedPet(owner);
      await db.insert(petUsers).values({
        petId: pet.id,
        userId: family.id,
        role: 'family',
        status: 'active',
      });

      await postWeight(family, pet.id, {
        weightKg: 10,
        measuredAt: today(),
      }).expect(403);
      await api()
        .get(`/v1/pets/${pet.id}/weights`)
        .set(auth(family.token))
        .expect(200);
    });

    it('un no-miembro recibe 404 antes de validar body o rol', async () => {
      const owner = await seedUser('r9-priority-owner');
      const outsider = await seedUser('r9-priority-outsider');
      const pet = await seedPet(owner);

      await postWeight(outsider, pet.id, {
        weightKg: 0,
        measuredAt: today(),
      }).expect(404);
      await api()
        .get(`/v1/pets/${pet.id}/weights`)
        .set(auth(outsider.token))
        .expect(404);
    });
  });

  describe('R10 (health-weights #15): POST registra auditoria weight.create', () => {
    it('persiste action, entity, entityId, actor y petId', async () => {
      const owner = await seedUser('r10');
      const pet = await seedPet(owner);

      const created = await postWeight(owner, pet.id, {
        weightKg: 21.35,
        measuredAt: today(),
      }).expect(201);
      const weightId = (created.body as { id: string }).id;
      const rows = await db
        .select()
        .from(auditLog)
        .where(
          and(
            eq(auditLog.entity, 'weight'),
            eq(auditLog.entityId, weightId),
          ),
        );

      expect(rows).toHaveLength(1);
      expect(rows[0]).toMatchObject({
        userId: owner.id,
        action: 'weight.create',
        entity: 'weight',
        entityId: weightId,
        meta: { petId: pet.id },
      });
    });
  });
});
