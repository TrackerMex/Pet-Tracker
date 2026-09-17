import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { and, count, eq, inArray } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import request from 'supertest';
import { App } from 'supertest/types';
import { uuidv7 } from 'uuidv7';
import { DRIZZLE } from '@/db/drizzle.constants';
import { auditLog } from '@/db/schema/audit-log.schema';
import { mealServings, nutritionPlans } from '@/db/schema/nutrition.schema';
import { pets, petUsers } from '@/db/schema/pets.schema';
import { users } from '@/db/schema/users.schema';
import { TOKEN_SERVICE } from '@/modules/auth/domain/ports/token-service';
import type { TokenService } from '@/modules/auth/domain/ports/token-service';
import { localDayOf, shiftDay } from '@/pipeline/local-day';
import { AppModule } from '../src/app.module';

describe('Meals served tracking (e2e)', () => {
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

  async function seedUser(
    label: string,
    timezone = 'UTC',
  ): Promise<UserFixture> {
    const id = uuidv7();
    const email = `meals-${label}-${runId}@example.com`;
    await db.insert(users).values({
      id,
      email,
      passwordHash: 'not-used',
      firstName: 'E2e',
      lastName: label,
      phone: '+525512345678',
      country: 'MX',
      timezone,
      termsAcceptedAt: new Date(),
    });
    userIds.push(id);
    return { id, token: tokens.sign({ sub: id, email }) };
  }

  async function seedPet(owner: UserFixture) {
    const response = await api()
      .post('/v1/pets')
      .set(auth(owner.token))
      .send({
        name: `Meals-${uuidv7()}`,
        species: 'dog',
        birthDate: '2021-01-15',
        sterilized: true,
      })
      .expect(201);
    const pet = response.body as { id: string };
    petIds.push(pet.id);
    return pet;
  }

  const putProfile = (user: UserFixture, petId: string) =>
    api()
      .put(`/v1/pets/${petId}/nutrition-profile`)
      .set(auth(user.token))
      .send({
        activityLevel: 'medium',
        foodType: 'dry',
        kcalPer100g: 350,
      });

  const postWeight = (user: UserFixture, petId: string, timezone = 'UTC') =>
    api()
      .post(`/v1/pets/${petId}/weights`)
      .set(auth(user.token))
      .send({
        weightKg: 20,
        measuredAt: localDayOf(Date.now(), timezone),
      });

  const generatePlan = (user: UserFixture, petId: string) =>
    api()
      .post(`/v1/pets/${petId}/nutrition-plan/generate`)
      .set(auth(user.token));

  const getPlan = (user: UserFixture, petId: string) =>
    api().get(`/v1/pets/${petId}/nutrition-plan`).set(auth(user.token));

  const getProfile = (user: UserFixture, petId: string) =>
    api().get(`/v1/pets/${petId}`).set(auth(user.token));

  const listPets = (user: UserFixture) =>
    api().get('/v1/pets').set(auth(user.token));

  async function seedPlan(owner: UserFixture, petId: string, timezone = 'UTC') {
    await putProfile(owner, petId).expect(200);
    await postWeight(owner, petId, timezone).expect(201);
    return generatePlan(owner, petId).expect(200);
  }

  const serveMeal = (
    user: UserFixture,
    petId: string,
    body: Record<string, unknown>,
  ) => api().post(`/v1/pets/${petId}/meals`).set(auth(user.token)).send(body);

  const unserveMeal = (user: UserFixture, petId: string, mealTime: string) =>
    api().delete(`/v1/pets/${petId}/meals/${mealTime}`).set(auth(user.token));

  const addMember = (
    petId: string,
    userId: string,
    role: 'family' | 'walker',
  ) => db.insert(petUsers).values({ petId, userId, role, status: 'active' });

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

  describe('R2 (meals-served-tracking #83): POST inserta con el dia civil del owner y responde el shape congelado', () => {
    it('responde 201 con seis claves y persiste el actor', async () => {
      const owner = await seedUser('r2');
      const pet = await seedPet(owner);
      await seedPlan(owner, pet.id);

      const response = await serveMeal(owner, pet.id, {
        mealTime: '07:30',
      }).expect(201);

      expect(Object.keys(response.body as object).sort()).toEqual(
        ['id', 'petId', 'servedOn', 'mealTime', 'servedAt', 'createdBy'].sort(),
      );
      expect(response.body).toMatchObject({
        petId: pet.id,
        mealTime: '07:30',
        servedOn: localDayOf(Date.now(), 'UTC'),
        createdBy: owner.id,
      });
      const serving = response.body as { id: string; servedAt: string };
      expect(new Date(serving.servedAt).toISOString()).toBe(serving.servedAt);

      const [row] = await db
        .select()
        .from(mealServings)
        .where(eq(mealServings.id, serving.id));
      expect(row.createdBy).toBe(owner.id);
    });

    it('usa el dia del owner en los dos extremos de zona horaria', async () => {
      for (const [index, timezone] of [
        'Pacific/Kiritimati',
        'Pacific/Pago_Pago',
      ].entries()) {
        const owner = await seedUser(`r2-timezone-${index}`, timezone);
        const pet = await seedPet(owner);
        await seedPlan(owner, pet.id, timezone);

        const response = await serveMeal(owner, pet.id, {
          mealTime: '07:30',
        }).expect(201);

        expect((response.body as { servedOn: string }).servedOn).toBe(
          localDayOf(Date.now(), timezone),
        );
      }
    });
  });

  describe('R6 (meals-served-tracking #83): body invalido responde 400 sin persistir', () => {
    it('rechaza cuerpos incompletos, mal formados y con claves extra antes de leer el plan', async () => {
      const owner = await seedUser('r6');
      const pet = await seedPet(owner);

      for (const body of [
        {},
        { mealTime: '7:30' },
        { mealTime: 730 },
        { mealTime: '07:30', extra: true },
        { mealTime: '07:30', servedOn: '2026-01-01' },
      ]) {
        const response = await serveMeal(owner, pet.id, body).expect(400);
        expect(response.body).toMatchObject({
          statusCode: 400,
          message: 'Validation failed',
        });
        expect(
          (response.body as { errors: unknown[] }).errors.length,
        ).toBeGreaterThanOrEqual(1);
      }

      const [row] = await db
        .select({ value: count() })
        .from(mealServings)
        .where(eq(mealServings.petId, pet.id));
      expect(row.value).toBe(0);
    });
  });

  describe('R4 (meals-served-tracking #83): 422 NUTRITION_PLAN_REQUIRED y 422 MEAL_TIME_NOT_IN_PLAN sin persistir', () => {
    it('responde NUTRITION_PLAN_REQUIRED cuando no hay plan', async () => {
      const owner = await seedUser('r4-no-plan');
      const pet = await seedPet(owner);

      const response = await serveMeal(owner, pet.id, {
        mealTime: '07:30',
      }).expect(422);
      expect(response.body).toEqual({
        statusCode: 422,
        code: 'NUTRITION_PLAN_REQUIRED',
        message: 'Generate a nutrition plan before serving meals',
      });

      const [row] = await db
        .select({ value: count() })
        .from(mealServings)
        .where(eq(mealServings.petId, pet.id));
      expect(row.value).toBe(0);
    });

    it('responde MEAL_TIME_NOT_IN_PLAN sin persistir ni auditar', async () => {
      const owner = await seedUser('r4-off-plan');
      const pet = await seedPet(owner);
      await seedPlan(owner, pet.id);

      const response = await serveMeal(owner, pet.id, {
        mealTime: '12:00',
      }).expect(422);
      expect(response.body).toEqual({
        statusCode: 422,
        code: 'MEAL_TIME_NOT_IN_PLAN',
        message: 'mealTime is not part of the current nutrition plan',
      });

      const [servings] = await db
        .select({ value: count() })
        .from(mealServings)
        .where(eq(mealServings.petId, pet.id));
      expect(servings.value).toBe(0);
      const [audits] = await db
        .select({ value: count() })
        .from(auditLog)
        .where(
          and(
            eq(auditLog.userId, owner.id),
            eq(auditLog.entity, 'meal_serving'),
          ),
        );
      expect(audits.value).toBe(0);
    });
  });

  describe('R5 (meals-served-tracking #83): la misma franja el mismo dia responde 409; otro dia no', () => {
    it('responde 409 y conserva una sola fila y auditoria', async () => {
      const owner = await seedUser('r5-duplicate');
      const pet = await seedPet(owner);
      await seedPlan(owner, pet.id);

      const first = await serveMeal(owner, pet.id, {
        mealTime: '07:30',
      }).expect(201);
      const duplicate = await serveMeal(owner, pet.id, {
        mealTime: '07:30',
      }).expect(409);
      expect(duplicate.body).toEqual({
        statusCode: 409,
        code: 'MEAL_ALREADY_SERVED',
        message: 'Meal already served today',
      });

      const rows = await db
        .select()
        .from(mealServings)
        .where(eq(mealServings.petId, pet.id));
      expect(rows).toHaveLength(1);
      expect(rows[0]).toMatchObject({ createdBy: owner.id });
      expect(rows[0].servedAt.toISOString()).toBe(
        (first.body as { servedAt: string }).servedAt,
      );

      const [audits] = await db
        .select({ value: count() })
        .from(auditLog)
        .where(
          and(eq(auditLog.userId, owner.id), eq(auditLog.action, 'meal.serve')),
        );
      expect(audits.value).toBe(1);
    });

    it('acepta la misma franja si la fila existente es de ayer', async () => {
      const owner = await seedUser('r5-yesterday');
      const pet = await seedPet(owner);
      await seedPlan(owner, pet.id);
      await db.insert(mealServings).values({
        id: uuidv7(),
        petId: pet.id,
        servedOn: shiftDay(localDayOf(Date.now(), 'UTC'), -1),
        mealTime: '07:30',
        createdBy: owner.id,
      });

      await serveMeal(owner, pet.id, { mealTime: '07:30' }).expect(201);

      const rows = await db
        .select()
        .from(mealServings)
        .where(eq(mealServings.petId, pet.id));
      expect(rows).toHaveLength(2);
    });
  });

  describe('R7 (meals-served-tracking #83): DELETE deshace la franja de hoy y responde 404 si no existe', () => {
    it('borra hoy con 204 vacio y luego responde 404 para franjas ausentes', async () => {
      const owner = await seedUser('r7-today');
      const pet = await seedPet(owner);
      await seedPlan(owner, pet.id);
      await serveMeal(owner, pet.id, { mealTime: '07:30' }).expect(201);

      const deleted = await unserveMeal(owner, pet.id, '07:30').expect(204);
      expect(deleted.text).toBe('');
      expect(
        await db
          .select()
          .from(mealServings)
          .where(eq(mealServings.petId, pet.id)),
      ).toHaveLength(0);
      const plan = await getPlan(owner, pet.id).expect(200);
      expect(plan.body).toMatchObject({ servedToday: [] });

      const missing = await unserveMeal(owner, pet.id, '07:30').expect(404);
      expect(missing.body).toEqual({
        statusCode: 404,
        code: 'MEAL_SERVING_NOT_FOUND',
        message: 'Meal serving not found for today',
      });
      await unserveMeal(owner, pet.id, '19:30').expect(404);
      await unserveMeal(owner, pet.id, '7:30').expect(404);
    });

    it('no borra una fila de ayer', async () => {
      const owner = await seedUser('r7-yesterday');
      const pet = await seedPet(owner);
      await db.insert(mealServings).values({
        id: uuidv7(),
        petId: pet.id,
        servedOn: shiftDay(localDayOf(Date.now(), 'UTC'), -1),
        mealTime: '07:30',
        createdBy: owner.id,
      });

      await unserveMeal(owner, pet.id, '07:30').expect(404);

      expect(
        await db
          .select()
          .from(mealServings)
          .where(eq(mealServings.petId, pet.id)),
      ).toHaveLength(1);
    });
  });

  describe('R3 (meals-served-tracking #83): cualquier miembro activo sirve y deshace; 404 del guard precede', () => {
    it('family sirve y walker deshace una franja servida por otro miembro', async () => {
      const owner = await seedUser('r3-owner');
      const family = await seedUser('r3-family');
      const walker = await seedUser('r3-walker');
      const pet = await seedPet(owner);
      await seedPlan(owner, pet.id);
      await addMember(pet.id, family.id, 'family');
      await addMember(pet.id, walker.id, 'walker');

      const created = await serveMeal(family, pet.id, {
        mealTime: '07:30',
      }).expect(201);
      expect((created.body as { createdBy: string }).createdBy).toBe(family.id);
      await unserveMeal(walker, pet.id, '07:30').expect(204);
      expect(
        await db
          .select()
          .from(mealServings)
          .where(eq(mealServings.petId, pet.id)),
      ).toHaveLength(0);
    });

    it('responde 404 a outsider y petId no UUID antes del body', async () => {
      const owner = await seedUser('r3-hidden-owner');
      const outsider = await seedUser('r3-outsider');
      const pet = await seedPet(owner);

      await serveMeal(outsider, pet.id, {}).expect(404);
      await unserveMeal(outsider, pet.id, '07:30').expect(404);
      await serveMeal(owner, 'not-a-uuid', {}).expect(404);
      await unserveMeal(owner, 'not-a-uuid', '07:30').expect(404);
    });
  });

  describe('R8 (meals-served-tracking #83): POST y DELETE dejan filas meal.serve y meal.unserve en audit_log', () => {
    it('audita ambas escrituras con actor, serving y metadatos', async () => {
      const owner = await seedUser('r8');
      const pet = await seedPet(owner);
      await seedPlan(owner, pet.id);

      const created = await serveMeal(owner, pet.id, {
        mealTime: '07:30',
      }).expect(201);
      const serving = created.body as {
        id: string;
        servedOn: string;
      };
      await unserveMeal(owner, pet.id, '07:30').expect(204);

      const rows = await db
        .select()
        .from(auditLog)
        .where(
          and(
            eq(auditLog.entity, 'meal_serving'),
            eq(auditLog.entityId, serving.id),
          ),
        );
      expect(rows).toHaveLength(2);
      expect(rows.map((row) => row.action).sort()).toEqual([
        'meal.serve',
        'meal.unserve',
      ]);
      for (const row of rows) {
        expect(row).toMatchObject({
          userId: owner.id,
          entity: 'meal_serving',
          entityId: serving.id,
          meta: {
            petId: pet.id,
            mealTime: '07:30',
            servedOn: serving.servedOn,
          },
        });
      }
    });
  });

  describe('R9 (meals-served-tracking #83): GET nutrition-plan devuelve servedToday en orden del plan y generate no', () => {
    it('devuelve solo las franjas servidas, ordenadas por el plan', async () => {
      const owner = await seedUser('r9');
      const pet = await seedPet(owner);
      const generated = await seedPlan(owner, pet.id);

      const empty = await getPlan(owner, pet.id).expect(200);
      expect(Object.keys(empty.body as object).sort()).toEqual(
        [
          'id',
          'petId',
          'rerKcal',
          'merKcal',
          'dailyGrams',
          'mealsPerDay',
          'mealTimes',
          'objective',
          'warnings',
          'aiExplanation',
          'generatedAt',
          'servedToday',
        ].sort(),
      );
      expect((empty.body as { servedToday: string[] }).servedToday).toEqual([]);

      await serveMeal(owner, pet.id, { mealTime: '19:30' }).expect(201);
      await serveMeal(owner, pet.id, { mealTime: '07:30' }).expect(201);

      const served = await getPlan(owner, pet.id).expect(200);
      expect((served.body as { servedToday: string[] }).servedToday).toEqual([
        '07:30',
        '19:30',
      ]);
      expect(generated.body).not.toHaveProperty('servedToday');
      const regenerated = await generatePlan(owner, pet.id).expect(200);
      expect(regenerated.body).not.toHaveProperty('servedToday');
    });
  });

  describe('R10 (meals-served-tracking #83): GET perfil devuelve mealsToday y el listado lo deja en null', () => {
    it('devuelve null cuando la mascota no tiene plan', async () => {
      const owner = await seedUser('r10-no-plan');
      const pet = await seedPet(owner);

      const response = await getProfile(owner, pet.id).expect(200);

      expect(response.body).toHaveProperty('mealsToday', null);
    });

    it('cuenta solo las franjas servidas del plan', async () => {
      const owner = await seedUser('r10-count');
      const pet = await seedPet(owner);
      await seedPlan(owner, pet.id);

      const empty = await getProfile(owner, pet.id).expect(200);
      expect((empty.body as { mealsToday: unknown }).mealsToday).toEqual({
        served: 0,
        total: 2,
      });

      await serveMeal(owner, pet.id, { mealTime: '07:30' }).expect(201);
      const served = await getProfile(owner, pet.id).expect(200);
      expect((served.body as { mealsToday: unknown }).mealsToday).toEqual({
        served: 1,
        total: 2,
      });
    });

    it('mantiene mealsToday presente y null en el listado', async () => {
      const owner = await seedUser('r10-list');
      await seedPet(owner);

      const response = await listPets(owner).expect(200);

      expect(response.body).not.toHaveLength(0);
      for (const pet of response.body as Array<Record<string, unknown>>) {
        expect(pet).toHaveProperty('mealsToday', null);
      }
    });

    it('excluye las franjas del plan anterior tras regenerar', async () => {
      const owner = await seedUser('r10-regenerated');
      const pet = await seedPet(owner);
      await seedPlan(owner, pet.id);
      await serveMeal(owner, pet.id, { mealTime: '07:30' }).expect(201);
      await db.insert(nutritionPlans).values({
        id: uuidv7(),
        petId: pet.id,
        rerKcal: 662,
        merKcal: 1059,
        dailyGrams: 305,
        mealsPerDay: 3,
        mealTimes: ['08:00', '13:00', '20:00'],
        objective: 'maintenance',
        warnings: [],
        aiExplanation: null,
        inputsHash: 'f'.repeat(64),
      });

      await serveMeal(owner, pet.id, { mealTime: '08:00' }).expect(201);

      const profile = await getProfile(owner, pet.id).expect(200);
      expect((profile.body as { mealsToday: unknown }).mealsToday).toEqual({
        served: 1,
        total: 3,
      });
      const plan = await getPlan(owner, pet.id).expect(200);
      expect((plan.body as { servedToday: string[] }).servedToday).toEqual([
        '08:00',
      ]);
      const offPlan = await serveMeal(owner, pet.id, {
        mealTime: '07:30',
      }).expect(422);
      expect((offPlan.body as { code: string }).code).toBe(
        'MEAL_TIME_NOT_IN_PLAN',
      );
      expect(
        await db
          .select()
          .from(mealServings)
          .where(eq(mealServings.petId, pet.id)),
      ).toHaveLength(2);
      await unserveMeal(owner, pet.id, '07:30').expect(204);
    });
  });
});
