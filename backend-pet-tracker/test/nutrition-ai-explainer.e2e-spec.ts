import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { eq, inArray } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import request from 'supertest';
import { App } from 'supertest/types';
import { uuidv7 } from 'uuidv7';
import { DRIZZLE } from '@/db/drizzle.constants';
import { nutritionPlans } from '@/db/schema/nutrition.schema';
import { pets } from '@/db/schema/pets.schema';
import { users } from '@/db/schema/users.schema';
import { TOKEN_SERVICE } from '@/modules/auth/domain/ports/token-service';
import type { TokenService } from '@/modules/auth/domain/ports/token-service';
import type { NutritionExplainerContext } from '@/modules/nutrition/domain/ports/nutrition-explainer';
import type {
  NutritionEngineInput,
  NutritionPlanResult,
} from '@/modules/nutrition/domain/nutrition-engine';
import { NUTRITION_EXPLAINER } from '@/modules/nutrition/domain/ports/nutrition-explainer';
import { SUBSCRIPTION_REPOSITORY } from '@/modules/subscriptions/domain/repositories/subscription.repository';
import { AppModule } from '../src/app.module';

process.env.ANTHROPIC_ENABLED = 'false';

const text = 'Tu perro de 20 kg necesita unas 1059 kcal al día...';
interface PlanResponse {
  id: string;
  aiExplanation: string | null;
  generatedAt: string;
}
describe('Nutrition AI explainer (e2e HTTP y Postgres)', () => {
  let app: INestApplication<App>;
  let db: NodePgDatabase;
  let tokens: TokenService;
  const userIds: string[] = [];
  const petIds: string[] = [];
  const explain = jest
    .fn<
      Promise<string | null>,
      [NutritionEngineInput, NutritionPlanResult, NutritionExplainerContext]
    >()
    .mockResolvedValue(text);
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
    explain.mockReset().mockResolvedValue(text);
    isPetTracked.mockClear();
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
    return { petId, putProfile, generate, get };
  }
  describe('R18 (nutrition-ai-explainer #18): explicacion de punta a punta', () => {
    it('generate, Postgres y GET devuelven el texto y ctx contiene el id persistido', async () => {
      const f = await fixture();
      const generated = await f.generate().expect(200);
      const body = generated.body as PlanResponse;
      expect(body.aiExplanation).toBe(text);
      const rows = await db
        .select()
        .from(nutritionPlans)
        .where(eq(nutritionPlans.id, body.id));
      expect(rows).toHaveLength(1);
      expect(rows[0].aiExplanation).toBe(text);
      const latest = await f.get().expect(200);
      expect(latest.body).toHaveProperty('aiExplanation', text);
      expect(explain).toHaveBeenCalledTimes(1);
      expect(explain.mock.calls[0][2]).toEqual({
        petId: f.petId,
        planId: body.id,
      });
    });
  });
  describe('R13 (nutrition-ai-explainer #18): UPDATE solo de la segunda fila por id', () => {
    it('conserva P1 null y todos los campos insertados de P2 excepto la explicacion', async () => {
      const f = await fixture();
      let inserted: typeof nutritionPlans.$inferSelect | undefined;
      explain
        .mockResolvedValueOnce(null)
        .mockImplementationOnce(
          async (
            _input: NutritionEngineInput,
            _result: NutritionPlanResult,
            ctx: NutritionExplainerContext,
          ) => {
            [inserted] = await db
              .select()
              .from(nutritionPlans)
              .where(eq(nutritionPlans.id, ctx.planId));
            return 'texto B';
          },
        );
      const first = (await f.generate().expect(200)).body as PlanResponse;
      expect(first.aiExplanation).toBeNull();
      await f.putProfile(351).expect(200);
      const second = (await f.generate().expect(200)).body as PlanResponse;
      const rows = await db
        .select()
        .from(nutritionPlans)
        .where(eq(nutritionPlans.petId, f.petId));
      expect(rows).toHaveLength(2);
      const p1 = rows.find((row) => row.id === first.id);
      expect(p1).toBeDefined();
      expect(p1?.aiExplanation).toBeNull();
      expect(second.id).not.toBe(first.id);
      const p2 = rows.find((row) => row.id === second.id);
      expect(p2).toBeDefined();
      expect(p2?.aiExplanation).toBe('texto B');
      expect(p2?.generatedAt.toISOString()).toBe(second.generatedAt);
      expect(inserted).toBeDefined();
      expect(inserted?.aiExplanation).toBeNull();
      expect(p2?.inputsHash).toBe(inserted?.inputsHash);
      expect(p2).toEqual({ ...inserted, aiExplanation: 'texto B' });
    });
  });
  describe('R16 (nutrition-ai-explainer #18): hash hit no vuelve a pagar por HTTP', () => {
    it('dos generate devuelven mismo id y texto con una fila y una llamada', async () => {
      const f = await fixture();
      const first = (await f.generate().expect(200)).body as PlanResponse;
      const second = (await f.generate().expect(200)).body as PlanResponse;
      expect(second.id).toBe(first.id);
      expect(first.aiExplanation).toBe(text);
      expect(second.aiExplanation).toBe(text);
      const rows = await db
        .select()
        .from(nutritionPlans)
        .where(eq(nutritionPlans.petId, f.petId));
      expect(rows).toHaveLength(1);
      expect(explain).toHaveBeenCalledTimes(1);
      expect(isPetTracked).toHaveBeenCalledTimes(1);
    });
  });
});
