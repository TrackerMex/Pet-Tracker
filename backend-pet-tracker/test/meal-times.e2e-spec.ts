import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { asc, eq, inArray } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import request from 'supertest';
import { App } from 'supertest/types';
import { uuidv7 } from 'uuidv7';
import { DRIZZLE } from '@/db/drizzle.constants';
import { auditLog } from '@/db/schema/audit-log.schema';
import { nutritionPlans } from '@/db/schema/nutrition.schema';
import { pets } from '@/db/schema/pets.schema';
import { users } from '@/db/schema/users.schema';
import { TOKEN_SERVICE } from '@/modules/auth/domain/ports/token-service';
import type { TokenService } from '@/modules/auth/domain/ports/token-service';
import { localDayOf } from '@/pipeline/local-day';
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
});
