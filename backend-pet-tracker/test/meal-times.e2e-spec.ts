import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { and, asc, eq, inArray } from 'drizzle-orm';
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

describe('Meal schedule editing (e2e)', () => {
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
    const email = `meal-times-${label}-${runId}@example.com`;
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

  async function seedPet(
    owner: UserFixture,
    { species = 'dog' }: { species?: 'dog' | 'cat' } = {},
  ) {
    const response = await api()
      .post('/v1/pets')
      .set(auth(owner.token))
      .send({
        name: `Meals-${uuidv7()}`,
        species,
        birthDate: '2021-01-15',
        sterilized: true,
      })
      .expect(201);
    const pet = response.body as { id: string };
    petIds.push(pet.id);
    return pet;
  }

  const putProfile = (
    user: UserFixture,
    petId: string,
    overrides: Record<string, unknown> = {},
  ) =>
    api()
      .put(`/v1/pets/${petId}/nutrition-profile`)
      .set(auth(user.token))
      .send({
        activityLevel: 'medium',
        foodType: 'dry',
        kcalPer100g: 350,
        ...overrides,
      });

  const postWeight = (
    user: UserFixture,
    petId: string,
    timezone = 'UTC',
    weightKg = 20,
  ) =>
    api()
      .post(`/v1/pets/${petId}/weights`)
      .set(auth(user.token))
      .send({
        weightKg,
        measuredAt: localDayOf(Date.now(), timezone),
      });

  const generatePlan = (user: UserFixture, petId: string) =>
    api()
      .post(`/v1/pets/${petId}/nutrition-plan/generate`)
      .set(auth(user.token));

  async function seedPlan(owner: UserFixture, petId: string, timezone = 'UTC') {
    await putProfile(owner, petId).expect(200);
    await postWeight(owner, petId, timezone).expect(201);
    return generatePlan(owner, petId).expect(200);
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

  const plansOf = (petId: string) =>
    db
      .select()
      .from(nutritionPlans)
      .where(eq(nutritionPlans.petId, petId))
      .orderBy(asc(nutritionPlans.generatedAt), asc(nutritionPlans.id));

  const insertPlanRow = (
    petId: string,
    overrides: Partial<typeof nutritionPlans.$inferInsert> = {},
  ) =>
    db
      .insert(nutritionPlans)
      .values({
        id: uuidv7(),
        petId,
        rerKcal: 662,
        merKcal: 1059,
        dailyGrams: 305,
        mealsPerDay: 2,
        mealTimes: ['07:30', '19:30'],
        objective: 'maintenance',
        warnings: [],
        aiExplanation: null,
        inputsHash: 'f'.repeat(64),
        ...overrides,
      })
      .returning();

  describe('R2 (meal-schedule-editing #103): generate conserva el horario editado mientras el motor no cambie el numero de comidas', () => {
    it('perro: cambian las kcal, el motor sigue en 2 y el horario editado se conserva', async () => {
      const owner = await seedUser('r2-dog');
      const pet = await seedPet(owner);
      await seedPlan(owner, pet.id);
      const [p0] = await plansOf(pet.id);
      const [edited] = await insertPlanRow(pet.id, {
        ...p0,
        id: uuidv7(),
        generatedAt: new Date(),
        mealsPerDay: 3,
        mealTimes: ['07:30', '12:00', '19:30'],
        engineMealsPerDay: 2,
      });
      await putProfile(owner, pet.id, { kcalPer100g: 360 }).expect(200);
      const response = await generatePlan(owner, pet.id).expect(200);
      const result = response.body as {
        id: string;
        mealTimes: string[];
        mealsPerDay: number;
        dailyGrams: number;
      };
      expect(result.id).not.toBe(p0.id);
      expect(result.id).not.toBe(edited.id);
      expect(result.mealTimes).toEqual(['07:30', '12:00', '19:30']);
      expect(result.mealsPerDay).toBe(3);
      expect(result.dailyGrams).toBe(295);
      expect((await plansOf(pet.id)).at(-1)?.engineMealsPerDay).toBe(2);
    });

    it('gato: pasa a actividad alta, el motor sube a 3 y vuelve el horario del motor', async () => {
      const owner = await seedUser('r2-cat');
      const pet = await seedPet(owner, { species: 'cat' });
      await putProfile(owner, pet.id).expect(200);
      await postWeight(owner, pet.id, 'UTC', 4).expect(201);
      const original = await generatePlan(owner, pet.id).expect(200);
      expect(original.body).toMatchObject({ mealTimes: ['07:30', '19:30'] });
      const [p0] = await plansOf(pet.id);
      await insertPlanRow(pet.id, {
        ...p0,
        id: uuidv7(),
        generatedAt: new Date(),
        mealsPerDay: 3,
        mealTimes: ['07:30', '12:00', '19:30'],
        engineMealsPerDay: 2,
      });
      await putProfile(owner, pet.id, { activityLevel: 'high' }).expect(200);
      const response = await generatePlan(owner, pet.id).expect(200);
      expect(response.body).toMatchObject({
        mealsPerDay: 3,
        mealTimes: ['07:30', '14:00', '19:30'],
      });
      expect((await plansOf(pet.id)).at(-1)?.engineMealsPerDay).toBe(3);
    });
  });

  const addMealTime = (
    user: UserFixture,
    petId: string,
    body: Record<string, unknown>,
  ) =>
    api().post(`/v1/pets/${petId}/meal-times`).set(auth(user.token)).send(body);

  describe('R3 (meal-schedule-editing #103): POST meal-times anade una franja como copia nueva del plan', () => {
    it('anade 12:00 a P0, ordena y deja P0 intacto', async () => {
      const owner = await seedUser('r3-copy');
      const pet = await seedPet(owner);
      const original = await seedPlan(owner, pet.id);
      const [p0] = await plansOf(pet.id);
      const response = await addMealTime(owner, pet.id, {
        mealTime: '12:00',
      }).expect(201);
      const result = response.body as { id: string };
      expect(Object.keys(response.body as object).sort()).toEqual(
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
        ].sort(),
      );
      expect(result.id).not.toBe(p0.id);
      expect(response.body).toMatchObject({
        mealTimes: ['07:30', '12:00', '19:30'],
        mealsPerDay: 3,
        rerKcal: p0.rerKcal,
        merKcal: p0.merKcal,
        dailyGrams: p0.dailyGrams,
      });
      expect(original.body).toMatchObject({ mealTimes: ['07:30', '19:30'] });
      const rows = await plansOf(pet.id);
      expect(rows).toHaveLength(2);
      expect(rows[0]).toEqual(p0);
      expect(rows[1].engineMealsPerDay).toBe(2);
      const latest = await api()
        .get(`/v1/pets/${pet.id}/nutrition-plan`)
        .set(auth(owner.token))
        .expect(200);
      expect(latest.body).toHaveProperty('id', result.id);
    });

    it('un plan anterior a 0018 resuelve el numero del motor con meals_per_day', async () => {
      const owner = await seedUser('r3-legacy');
      const pet = await seedPet(owner);
      await insertPlanRow(pet.id, {
        mealsPerDay: 2,
        engineMealsPerDay: null,
        mealTimes: ['08:00', '20:00'],
      });
      const response = await addMealTime(owner, pet.id, {
        mealTime: '13:00',
      }).expect(201);
      expect(response.body).toMatchObject({
        mealTimes: ['08:00', '13:00', '20:00'],
      });
      expect((await plansOf(pet.id)).at(-1)?.engineMealsPerDay).toBe(2);
    });
  });

  const moveMealTime = (
    user: UserFixture,
    petId: string,
    from: string,
    body: Record<string, unknown>,
  ) =>
    api()
      .patch(`/v1/pets/${petId}/meal-times/${from}`)
      .set(auth(user.token))
      .send(body);

  describe('R4 (meal-schedule-editing #103): PATCH meal-times mueve una franja como copia nueva del plan', () => {
    it('mueve dos franjas seguidas y reordena', async () => {
      const owner = await seedUser('r4');
      const pet = await seedPet(owner);
      await seedPlan(owner, pet.id);
      const response = await moveMealTime(owner, pet.id, '07:30', {
        mealTime: '08:15',
      }).expect(200);
      expect(Object.keys(response.body as object).sort()).toEqual(
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
        ].sort(),
      );
      expect(response.body).toMatchObject({
        mealTimes: ['08:15', '19:30'],
        mealsPerDay: 2,
      });
      const next = await moveMealTime(owner, pet.id, '19:30', {
        mealTime: '06:00',
      }).expect(200);
      expect(next.body).toMatchObject({ mealTimes: ['06:00', '08:15'] });
      expect(await plansOf(pet.id)).toHaveLength(3);
    });
  });

  const serveMeal = (
    user: UserFixture,
    petId: string,
    body: Record<string, unknown>,
  ) => api().post(`/v1/pets/${petId}/meals`).set(auth(user.token)).send(body);
  const getPlan = (user: UserFixture, petId: string) =>
    api().get(`/v1/pets/${petId}/nutrition-plan`).set(auth(user.token));
  const addMember = (
    petId: string,
    userId: string,
    role: 'family' | 'walker',
  ) => db.insert(petUsers).values({ petId, userId, role, status: 'active' });
  const insertServing = (
    petId: string,
    createdBy: string,
    servedOn: string,
    mealTime: string,
  ) =>
    db
      .insert(mealServings)
      .values({ id: uuidv7(), petId, createdBy, servedOn, mealTime })
      .returning();
  const servingsOf = (petId: string) =>
    db
      .select()
      .from(mealServings)
      .where(eq(mealServings.petId, petId))
      .orderBy(asc(mealServings.servedOn), asc(mealServings.mealTime));

  describe('R5 (meal-schedule-editing #103): la servida de hoy se mueve con su franja y los dias pasados no', () => {
    it('mueve la de hoy en los dos extremos de zona y deja la de ayer', async () => {
      for (const [index, timezone] of [
        'Pacific/Kiritimati',
        'Pacific/Pago_Pago',
      ].entries()) {
        const owner = await seedUser(`r5-owner-${index}`, timezone);
        const family = await seedUser(`r5-family-${index}`);
        const pet = await seedPet(owner);
        await seedPlan(owner, pet.id, timezone);
        await addMember(pet.id, family.id, 'family');
        await serveMeal(family, pet.id, { mealTime: '07:30' }).expect(201);
        const [today] = await servingsOf(pet.id);
        expect(today.createdBy).toBe(family.id);
        const [yesterday] = await insertServing(
          pet.id,
          owner.id,
          shiftDay(localDayOf(Date.now(), timezone), -1),
          '07:30',
        );
        await moveMealTime(owner, pet.id, '07:30', {
          mealTime: '08:15',
        }).expect(200);
        expect(await servingsOf(pet.id)).toEqual([
          yesterday,
          { ...today, mealTime: '08:15' },
        ]);
        expect((await getPlan(owner, pet.id).expect(200)).body).toMatchObject({
          servedToday: ['08:15'],
        });
        expect(
          (
            await api()
              .get(`/v1/pets/${pet.id}`)
              .set(auth(owner.token))
              .expect(200)
          ).body,
        ).toHaveProperty('mealsToday', { served: 1, total: 2 });
      }
    });

    it('sin servida de hoy en el origen no cambia ninguna fila', async () => {
      const owner = await seedUser('r5-absent');
      const pet = await seedPet(owner);
      await seedPlan(owner, pet.id);
      await serveMeal(owner, pet.id, { mealTime: '07:30' }).expect(201);
      const before = await servingsOf(pet.id);
      await moveMealTime(owner, pet.id, '19:30', { mealTime: '21:00' }).expect(
        200,
      );
      expect(await servingsOf(pet.id)).toEqual(before);
    });
  });

  describe('R6 (meal-schedule-editing #103): si el destino ya tiene servida hoy, gana la del destino', () => {
    it('fusiona: queda la fila del destino y se borra la del origen', async () => {
      const owner = await seedUser('r6-merge');
      const family = await seedUser('r6-destination');
      const pet = await seedPet(owner);
      await seedPlan(owner, pet.id);
      await addMember(pet.id, family.id, 'family');
      const [destination] = await insertServing(
        pet.id,
        family.id,
        localDayOf(Date.now(), 'UTC'),
        '08:15',
      );
      await serveMeal(owner, pet.id, { mealTime: '07:30' }).expect(201);
      await moveMealTime(owner, pet.id, '07:30', { mealTime: '08:15' }).expect(
        200,
      );
      expect(await servingsOf(pet.id)).toEqual([destination]);
      expect((await getPlan(owner, pet.id).expect(200)).body).toMatchObject({
        servedToday: ['08:15'],
      });
      expect(
        (
          await api()
            .get(`/v1/pets/${pet.id}`)
            .set(auth(owner.token))
            .expect(200)
        ).body,
      ).toHaveProperty('mealsToday', { served: 1, total: 2 });
    });

    it('mover a una hora con huerfana la revive', async () => {
      const owner = await seedUser('r6-move-orphan');
      const pet = await seedPet(owner);
      await seedPlan(owner, pet.id);
      const [destination] = await insertServing(
        pet.id,
        owner.id,
        localDayOf(Date.now(), 'UTC'),
        '08:15',
      );
      await moveMealTime(owner, pet.id, '07:30', { mealTime: '08:15' }).expect(
        200,
      );
      expect(await servingsOf(pet.id)).toEqual([destination]);
      expect((await getPlan(owner, pet.id).expect(200)).body).toMatchObject({
        servedToday: ['08:15'],
      });
      expect(
        (
          await api()
            .get(`/v1/pets/${pet.id}`)
            .set(auth(owner.token))
            .expect(200)
        ).body,
      ).toHaveProperty('mealsToday', { served: 1, total: 2 });
    });

    it('anadir una hora con huerfana la revive', async () => {
      const owner = await seedUser('r6-add-orphan');
      const pet = await seedPet(owner);
      await seedPlan(owner, pet.id);
      const [destination] = await insertServing(
        pet.id,
        owner.id,
        localDayOf(Date.now(), 'UTC'),
        '12:00',
      );
      await addMealTime(owner, pet.id, { mealTime: '12:00' }).expect(201);
      expect(await servingsOf(pet.id)).toEqual([destination]);
      expect((await getPlan(owner, pet.id).expect(200)).body).toMatchObject({
        servedToday: ['12:00'],
      });
      expect(
        (
          await api()
            .get(`/v1/pets/${pet.id}`)
            .set(auth(owner.token))
            .expect(200)
        ).body,
      ).toHaveProperty('mealsToday', { served: 1, total: 3 });
    });
  });

  describe('R7 (meal-schedule-editing #103): POST y PATCH dejan filas meal_time.add y meal_time.move en audit_log', () => {
    it('POST audita actor, plan nuevo y hora anadida', async () => {
      const owner = await seedUser('r7-add');
      const pet = await seedPet(owner);
      await seedPlan(owner, pet.id);
      const response = await addMealTime(owner, pet.id, {
        mealTime: '12:00',
      }).expect(201);
      const result = response.body as { id: string };
      const rows = await db
        .select({
          userId: auditLog.userId,
          entity: auditLog.entity,
          entityId: auditLog.entityId,
          meta: auditLog.meta,
        })
        .from(auditLog)
        .where(
          and(
            eq(auditLog.userId, owner.id),
            eq(auditLog.action, 'meal_time.add'),
          ),
        );
      expect(rows).toEqual([
        {
          userId: owner.id,
          entity: 'nutrition_plan',
          entityId: result.id,
          meta: { petId: pet.id, mealTime: '12:00' },
        },
      ]);
    });

    it('PATCH audita actor, plan nuevo, origen, destino y dia', async () => {
      const owner = await seedUser('r7-move');
      const pet = await seedPet(owner);
      await seedPlan(owner, pet.id);
      await serveMeal(owner, pet.id, { mealTime: '07:30' }).expect(201);
      const response = await moveMealTime(owner, pet.id, '07:30', {
        mealTime: '08:15',
      }).expect(200);
      const result = response.body as { id: string };
      const rows = await db
        .select({
          userId: auditLog.userId,
          entity: auditLog.entity,
          entityId: auditLog.entityId,
          meta: auditLog.meta,
        })
        .from(auditLog)
        .where(
          and(
            eq(auditLog.userId, owner.id),
            eq(auditLog.action, 'meal_time.move'),
          ),
        );
      expect(rows).toEqual([
        {
          userId: owner.id,
          entity: 'nutrition_plan',
          entityId: result.id,
          meta: {
            petId: pet.id,
            from: '07:30',
            to: '08:15',
            servedOn: localDayOf(Date.now(), 'UTC'),
          },
        },
      ]);
    });
  });

  describe('R8 (meal-schedule-editing #103): body invalido responde 400 antes de leer el plan', () => {
    const invalidBodies: Record<string, unknown>[] = [
      {},
      { mealTime: 730 },
      ...['7:30', '24:00', '12:60', '99:99', '07:30:00', ' 07:30'].map(
        (mealTime) => ({ mealTime }),
      ),
      { mealTime: '08:00', extra: true },
    ];

    it('POST rechaza cada body de la lista', async () => {
      const owner = await seedUser('r8-add');
      const pet = await seedPet(owner);
      await seedPlan(owner, pet.id);
      for (const body of invalidBodies) {
        const response = await addMealTime(owner, pet.id, body).expect(400);
        expect(response.body).toMatchObject({
          statusCode: 400,
          message: 'Validation failed',
        });
      }
      expect(await plansOf(pet.id)).toHaveLength(1);
      expect(
        await db
          .select()
          .from(auditLog)
          .where(
            and(
              eq(auditLog.userId, owner.id),
              eq(auditLog.action, 'meal_time.add'),
            ),
          ),
      ).toEqual([]);
    });

    it('PATCH rechaza cada body de la lista', async () => {
      const owner = await seedUser('r8-move');
      const pet = await seedPet(owner);
      await seedPlan(owner, pet.id);
      for (const body of invalidBodies) {
        const response = await moveMealTime(
          owner,
          pet.id,
          '07:30',
          body,
        ).expect(400);
        expect(response.body).toMatchObject({
          statusCode: 400,
          message: 'Validation failed',
        });
      }
      expect(await plansOf(pet.id)).toHaveLength(1);
      expect(
        await db
          .select()
          .from(auditLog)
          .where(
            and(
              eq(auditLog.userId, owner.id),
              eq(auditLog.action, 'meal_time.move'),
            ),
          ),
      ).toEqual([]);
    });

    it('sin plan tambien es 400 y meals conserva su patron', async () => {
      const owner = await seedUser('r8-no-plan');
      const pet = await seedPet(owner);
      await addMealTime(owner, pet.id, { mealTime: '7:30' }).expect(400);
      await moveMealTime(owner, pet.id, '07:30', { mealTime: '24:00' }).expect(
        400,
      );
      const planned = await seedPet(owner);
      await seedPlan(owner, planned.id);
      const response = await serveMeal(owner, planned.id, {
        mealTime: '99:99',
      }).expect(422);
      expect(response.body).toHaveProperty('code', 'MEAL_TIME_NOT_IN_PLAN');
    });
  });

  describe('R9 (meal-schedule-editing #103): 422 con code propio y sin persistir', () => {
    it('sin plan en POST y PATCH', async () => {
      const owner = await seedUser('r9-no-plan');
      const pet = await seedPet(owner);
      const add = await addMealTime(owner, pet.id, {
        mealTime: '12:00',
      }).expect(422);
      const move = await moveMealTime(owner, pet.id, '07:30', {
        mealTime: '08:15',
      }).expect(422);
      for (const response of [add, move])
        expect(response.body).toEqual({
          statusCode: 422,
          code: 'NUTRITION_PLAN_REQUIRED',
          message: 'Generate a nutrition plan before serving meals',
        });
      expect(await plansOf(pet.id)).toHaveLength(0);
      expect(await servingsOf(pet.id)).toEqual([]);
      expect(
        await db
          .select()
          .from(auditLog)
          .where(
            and(
              eq(auditLog.userId, owner.id),
              eq(auditLog.entity, 'nutrition_plan'),
            ),
          ),
      ).toEqual([]);
    });
    it('PATCH: origen fuera del plan, destino repetido o igual', async () => {
      const owner = await seedUser('r9-move');
      const pet = await seedPet(owner);
      await seedPlan(owner, pet.id);
      const outside = await moveMealTime(owner, pet.id, '12:00', {
        mealTime: '07:30',
      }).expect(422);
      expect(outside.body).toEqual({
        statusCode: 422,
        code: 'MEAL_TIME_NOT_IN_PLAN',
        message: 'mealTime is not part of the current nutrition plan',
      });
      for (const to of ['19:30', '07:30']) {
        const duplicate = await moveMealTime(owner, pet.id, '07:30', {
          mealTime: to,
        }).expect(422);
        expect(duplicate.body).toEqual({
          statusCode: 422,
          code: 'MEAL_TIME_DUPLICATE',
          message: 'mealTime is already part of the current nutrition plan',
        });
      }
      expect(await plansOf(pet.id)).toHaveLength(1);
      expect(await servingsOf(pet.id)).toEqual([]);
      expect(
        await db
          .select()
          .from(auditLog)
          .where(
            and(
              eq(auditLog.userId, owner.id),
              eq(auditLog.action, 'meal_time.move'),
            ),
          ),
      ).toEqual([]);
    });
    it('POST: duplicado y limite de seis', async () => {
      const owner = await seedUser('r9-add');
      const pet = await seedPet(owner);
      await seedPlan(owner, pet.id);
      const duplicate = await addMealTime(owner, pet.id, {
        mealTime: '07:30',
      }).expect(422);
      expect(duplicate.body).toEqual({
        statusCode: 422,
        code: 'MEAL_TIME_DUPLICATE',
        message: 'mealTime is already part of the current nutrition plan',
      });
      for (const mealTime of ['09:00', '11:00', '13:00', '15:00'])
        await addMealTime(owner, pet.id, { mealTime }).expect(201);
      const limit = await addMealTime(owner, pet.id, {
        mealTime: '17:00',
      }).expect(422);
      expect(limit.body).toEqual({
        statusCode: 422,
        code: 'MEAL_TIMES_LIMIT_REACHED',
        message: 'The nutrition plan already has the maximum of 6 meal times',
      });
      const fullDuplicate = await addMealTime(owner, pet.id, {
        mealTime: '09:00',
      }).expect(422);
      expect(fullDuplicate.body).toEqual({
        statusCode: 422,
        code: 'MEAL_TIME_DUPLICATE',
        message: 'mealTime is already part of the current nutrition plan',
      });
      expect(await plansOf(pet.id)).toHaveLength(5);
      expect(await servingsOf(pet.id)).toEqual([]);
      expect(
        await db
          .select()
          .from(auditLog)
          .where(
            and(
              eq(auditLog.userId, owner.id),
              eq(auditLog.action, 'meal_time.add'),
            ),
          ),
      ).toHaveLength(4);
    });
  });
});
