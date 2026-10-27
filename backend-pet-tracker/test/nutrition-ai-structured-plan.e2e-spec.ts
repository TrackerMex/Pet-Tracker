import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { eq, inArray } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import request from 'supertest';
import { App } from 'supertest/types';
import { uuidv7 } from 'uuidv7';
import { DRIZZLE } from '@/db/drizzle.constants';
import { weights } from '@/db/schema/health.schema';
import { pets } from '@/db/schema/pets.schema';
import { users } from '@/db/schema/users.schema';
import { TOKEN_SERVICE } from '@/modules/auth/domain/ports/token-service';
import type { TokenService } from '@/modules/auth/domain/ports/token-service';
import {
  NUTRITION_EXPLAINER,
  type NutritionExplainer,
} from '@/modules/nutrition/domain/ports/nutrition-explainer';
import { SUBSCRIPTION_REPOSITORY } from '@/modules/subscriptions/domain/repositories/subscription.repository';
import {
  NUTRITION_WEIGHT_READER,
  type NutritionWeightReader,
} from '@/modules/nutrition/domain/ports/nutrition-weight-reader';
import { AppModule } from '../src/app.module';

process.env.ANTHROPIC_ENABLED = 'false';

describe('Nutrition AI structured plan (e2e HTTP y Postgres)', () => {
  let app: INestApplication<App>;
  let db: NodePgDatabase;
  let tokens: TokenService;
  const userIds: string[] = [];
  const petIds: string[] = [];
  const explain = jest
    .fn<
      ReturnType<NutritionExplainer['explain']>,
      Parameters<NutritionExplainer['explain']>
    >()
    .mockResolvedValue(null);
  const isPetTracked = jest.fn().mockResolvedValue(true);
  const api = () => request(app.getHttpServer());

  beforeAll(async () => {
    const module = await Test.createTestingModule({ imports: [AppModule] })
      .overrideProvider(NUTRITION_EXPLAINER)
      .useValue({ explain })
      .overrideProvider(SUBSCRIPTION_REPOSITORY)
      .useValue({ isPetTracked })
      .compile();
    app = module.createNestApplication();
    app.setGlobalPrefix('v1');
    await app.init();
    db = app.get<NodePgDatabase>(DRIZZLE);
    tokens = app.get<TokenService>(TOKEN_SERVICE);
  });

  beforeEach(() => {
    explain.mockReset().mockResolvedValue(null);
    isPetTracked.mockReset().mockResolvedValue(true);
  });

  afterAll(async () => {
    if (petIds.length) await db.delete(pets).where(inArray(pets.id, petIds));
    if (userIds.length)
      await db.delete(users).where(inArray(users.id, userIds));
    await app.close();
  });

  async function fixture() {
    const id = uuidv7();
    const email = `nutrition-ai-${id}@example.com`;
    await db.insert(users).values({
      id,
      email,
      passwordHash: 'not-used',
      firstName: 'E2e',
      lastName: 'AI',
      phone: '+525512345678',
      country: 'MX',
      timezone: 'UTC',
      termsAcceptedAt: new Date(),
    });
    userIds.push(id);
    const auth = { Authorization: `Bearer ${tokens.sign({ sub: id, email })}` };
    const pet = await api()
      .post('/v1/pets')
      .set(auth)
      .send({
        name: 'NutritionAI',
        species: 'dog',
        birthDate: '2021-01-15',
        sterilized: true,
      })
      .expect(201);
    const petId = (pet.body as { id: string }).id;
    petIds.push(petId);
    await db
      .update(pets)
      .set({ currentWeightKg: '20' })
      .where(eq(pets.id, petId));
    const putProfile = (kcalPer100g: number) =>
      api()
        .put(`/v1/pets/${petId}/nutrition-profile`)
        .set(auth)
        .send({ activityLevel: 'medium', foodType: 'dry', kcalPer100g });
    await putProfile(350).expect(200);
    const generate = () =>
      api().post(`/v1/pets/${petId}/nutrition-plan/generate`).set(auth);
    const get = () => api().get(`/v1/pets/${petId}/nutrition-plan`).set(auth);
    return { userId: id, petId, auth, putProfile, generate, get };
  }

  describe('R1 (nutrition-ai-structured-plan #212): cotas del perfil por HTTP', () => {
    it('R1: PUT con 21 alergias responde 400 y no cambia el perfil', async () => {
      const f = await fixture();
      const response = await api()
        .put(`/v1/pets/${f.petId}/nutrition-profile`)
        .set(f.auth)
        .send({
          activityLevel: 'medium',
          foodType: 'dry',
          kcalPer100g: 350,
          allergies: Array<string>(21).fill('pollo'),
        });
      expect(response.status).toBe(400);
      const profile = await api()
        .get(`/v1/pets/${f.petId}/nutrition-profile`)
        .set(f.auth)
        .expect(200);
      expect(profile.body).toHaveProperty('allergies', []);
    });
  });

  describe('R2 (nutrition-ai-structured-plan #212): tendencia de peso real', () => {
    it('R2: devuelve los cinco pesos mas recientes de la mascota del mas antiguo al mas reciente', async () => {
      const a = await fixture();
      const b = await fixture();
      const readings = [
        ['2026-05-01', '18.00'],
        ['2026-06-01', '18.50'],
        ['2026-07-01', '19.00'],
        ['2026-08-01', '19.25'],
        ['2026-09-01', '19.50'],
        ['2026-10-01', '20.00'],
      ];
      await db.insert(weights).values([
        ...readings.map(([measuredAt, weightKg]) => ({
          id: uuidv7(),
          petId: a.petId,
          createdBy: a.userId,
          measuredAt,
          weightKg,
        })),
        {
          id: uuidv7(),
          petId: b.petId,
          createdBy: b.userId,
          measuredAt: '2026-10-15',
          weightKg: '30.00',
        },
      ]);
      const reader = app.get<NutritionWeightReader>(NUTRITION_WEIGHT_READER);
      expect(await reader.listRecent(a.petId, 5)).toStrictEqual([
        { measuredAt: '2026-06-01', weightKg: 18.5 },
        { measuredAt: '2026-07-01', weightKg: 19 },
        { measuredAt: '2026-08-01', weightKg: 19.25 },
        { measuredAt: '2026-09-01', weightKg: 19.5 },
        { measuredAt: '2026-10-01', weightKg: 20 },
      ]);
    });

    it('R2: sin pesos devuelve una lista vacia', async () => {
      const f = await fixture();
      const reader = app.get<NutritionWeightReader>(NUTRITION_WEIGHT_READER);
      expect(await reader.listRecent(f.petId, 5)).toStrictEqual([]);
    });
  });
});
