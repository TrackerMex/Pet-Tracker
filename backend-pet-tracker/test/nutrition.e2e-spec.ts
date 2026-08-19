process.env.OPENAI_ENABLED = 'false';

import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { count, eq, inArray } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import request from 'supertest';
import { App } from 'supertest/types';
import { uuidv7 } from 'uuidv7';
import { DRIZZLE } from '@/db/drizzle.constants';
import {
  nutritionPlans,
  nutritionProfiles,
} from '@/db/schema/nutrition.schema';
import { pets, petUsers } from '@/db/schema/pets.schema';
import { users } from '@/db/schema/users.schema';
import { TOKEN_SERVICE } from '@/modules/auth/domain/ports/token-service';
import type { TokenService } from '@/modules/auth/domain/ports/token-service';
import { NUTRITION_EXPLAINER } from '@/modules/nutrition/domain/ports/nutrition-explainer';
import { SUBSCRIPTION_REPOSITORY } from '@/modules/subscriptions/domain/repositories/subscription.repository';
import { AppModule } from '../src/app.module';

describe('Nutrition profile and plans (e2e)', () => {
  const runId = Date.now();
  let app: INestApplication<App>;
  let db: NodePgDatabase;
  let tokens: TokenService;
  const userIds: string[] = [];
  const petIds: string[] = [];
  const explain = jest.fn();
  const isPetTracked = jest.fn();

  interface UserFixture {
    id: string;
    token: string;
  }

  const api = () => request(app.getHttpServer());
  const auth = (token: string) => ({ Authorization: `Bearer ${token}` });

  async function seedUser(label: string): Promise<UserFixture> {
    const id = uuidv7();
    const email = `nutrition-${label}-${runId}@example.com`;
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
      .send({
        name: `Nutrition-${uuidv7()}`,
        species: 'dog',
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
    body: Record<string, unknown>,
  ) =>
    api()
      .put(`/v1/pets/${petId}/nutrition-profile`)
      .set(auth(user.token))
      .send(body);

  const postWeight = (user: UserFixture, petId: string, weightKg: number) =>
    api()
      .post(`/v1/pets/${petId}/weights`)
      .set(auth(user.token))
      .send({ weightKg, measuredAt: new Date().toISOString().slice(0, 10) });

  const generatePlan = (user: UserFixture, petId: string) =>
    api()
      .post(`/v1/pets/${petId}/nutrition-plan/generate`)
      .set(auth(user.token));

  async function planCount(petId: string): Promise<number> {
    const [row] = await db
      .select({ value: count() })
      .from(nutritionPlans)
      .where(eq(nutritionPlans.petId, petId));
    return row.value;
  }

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    })
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
    isPetTracked.mockReset().mockResolvedValue(false);
  });

  afterAll(async () => {
    if (petIds.length) {
      await db.delete(pets).where(inArray(pets.id, petIds));
    }
    if (userIds.length) {
      await db.delete(users).where(inArray(users.id, userIds));
    }
    await app.close();
  });

  describe('R16 (nutrition-profile-engine #17): PUT del perfil es upsert de reemplazo total', () => {
    it('responde 200 al crear y reemplaza todos los opcionales al actualizar', async () => {
      const owner = await seedUser('r16');
      const pet = await seedPet(owner);

      const created = await putProfile(owner, pet.id, {
        activityLevel: 'medium',
        bodyCondition: 8,
        targetWeightKg: 18.5,
        foodType: 'dry',
        kcalPer100g: 350,
        allergies: ['pollo'],
        diseases: ['diabetes'],
      }).expect(200);

      expect(Object.keys(created.body as object).sort()).toEqual(
        [
          'petId',
          'activityLevel',
          'bodyCondition',
          'targetWeightKg',
          'foodType',
          'kcalPer100g',
          'allergies',
          'diseases',
          'updatedAt',
        ].sort(),
      );
      expect(created.body).toMatchObject({
        petId: pet.id,
        activityLevel: 'medium',
        bodyCondition: 8,
        targetWeightKg: 18.5,
        foodType: 'dry',
        kcalPer100g: 350,
        allergies: ['pollo'],
        diseases: ['diabetes'],
      });
      expect(
        new Date(
          (created.body as { updatedAt: string }).updatedAt,
        ).toISOString(),
      ).toBe((created.body as { updatedAt: string }).updatedAt);

      const replaced = await putProfile(owner, pet.id, {
        activityLevel: 'low',
        foodType: 'wet',
        kcalPer100g: 100,
      }).expect(200);

      expect(replaced.body).toMatchObject({
        petId: pet.id,
        activityLevel: 'low',
        bodyCondition: null,
        targetWeightKg: null,
        foodType: 'wet',
        kcalPer100g: 100,
        allergies: [],
        diseases: [],
      });
      const rows = await db
        .select()
        .from(nutritionProfiles)
        .where(eq(nutritionProfiles.petId, pet.id));
      expect(rows).toHaveLength(1);
      expect(rows[0]).toMatchObject({
        bodyCondition: null,
        targetWeightKg: null,
        allergies: [],
        diseases: [],
      });
    });
  });

  describe('R17 (nutrition-profile-engine #17): GET del perfil devuelve 200 o 404', () => {
    it('devuelve el perfil existente con el mismo shape del PUT', async () => {
      const owner = await seedUser('r17-existing');
      const pet = await seedPet(owner);
      const body = {
        activityLevel: 'medium',
        bodyCondition: 6,
        targetWeightKg: 19,
        foodType: 'mixed',
        kcalPer100g: 240,
        allergies: ['res'],
        diseases: [],
      };
      await putProfile(owner, pet.id, body).expect(200);

      const response = await api()
        .get(`/v1/pets/${pet.id}/nutrition-profile`)
        .set(auth(owner.token))
        .expect(200);

      expect(Object.keys(response.body as object).sort()).toEqual(
        [
          'petId',
          'activityLevel',
          'bodyCondition',
          'targetWeightKg',
          'foodType',
          'kcalPer100g',
          'allergies',
          'diseases',
          'updatedAt',
        ].sort(),
      );
      expect(response.body).toMatchObject({ petId: pet.id, ...body });
    });

    it('devuelve 404 NUTRITION_PROFILE_NOT_FOUND sin perfil', async () => {
      const owner = await seedUser('r17-missing');
      const pet = await seedPet(owner);

      const response = await api()
        .get(`/v1/pets/${pet.id}/nutrition-profile`)
        .set(auth(owner.token))
        .expect(404);

      expect(response.body).toMatchObject({
        statusCode: 404,
        code: 'NUTRITION_PROFILE_NOT_FOUND',
      });
    });
  });

  describe('R18 (nutrition-profile-engine #17): validacion del DTO sin defaults de kcalPer100g', () => {
    const validBody = {
      activityLevel: 'medium',
      foodType: 'dry',
      kcalPer100g: 350,
    };

    it.each<[string, Record<string, unknown>]>([
      ['kcal 900', { ...validBody, kcalPer100g: 900 }],
      ['kcal 79', { ...validBody, kcalPer100g: 79 }],
      ['dry sin kcal', { activityLevel: 'medium', foodType: 'dry' }],
      ['actividad invalida', { ...validBody, activityLevel: 'extreme' }],
      ['clave desconocida', { ...validBody, extra: true }],
    ])('rechaza %s con 400 y no escribe fila', async (label, body) => {
      const owner = await seedUser(`r18-${label}`);
      const pet = await seedPet(owner);

      const response = await putProfile(owner, pet.id, body).expect(400);
      expect(response.body).toMatchObject({
        statusCode: 400,
        message: 'Validation failed',
      });
      expect(
        Array.isArray((response.body as { errors: unknown[] }).errors),
      ).toBe(true);
      expect(
        await db
          .select()
          .from(nutritionProfiles)
          .where(eq(nutritionProfiles.petId, pet.id)),
      ).toEqual([]);
    });
  });

  describe('R19 (nutrition-profile-engine #17): generate compone el input y responde el plan', () => {
    it('recorre el ancla del perro de 20 kg y no expone inputsHash', async () => {
      const owner = await seedUser('r19');
      const pet = await seedPet(owner);
      await postWeight(owner, pet.id, 20).expect(201);
      await putProfile(owner, pet.id, {
        activityLevel: 'medium',
        foodType: 'dry',
        kcalPer100g: 350,
      }).expect(200);

      const response = await api()
        .post(`/v1/pets/${pet.id}/nutrition-plan/generate`)
        .set(auth(owner.token))
        .expect(200);

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
        petId: pet.id,
        rerKcal: 662,
        merKcal: 1059,
        dailyGrams: 305,
        mealsPerDay: 2,
        mealTimes: ['07:30', '19:30'],
        objective: 'maintenance',
        warnings: [],
        aiExplanation: null,
      });
      expect(response.body).not.toHaveProperty('inputsHash');
      expect(
        new Date(
          (response.body as { generatedAt: string }).generatedAt,
        ).toISOString(),
      ).toBe((response.body as { generatedAt: string }).generatedAt);
    });
  });

  describe('R21 (nutrition-profile-engine #17): mismo input devuelve el mismo plan sin fila nueva', () => {
    it('compara con el ultimo hash y solo inserta cuando cambia', async () => {
      const owner = await seedUser('r21');
      const pet = await seedPet(owner);
      await postWeight(owner, pet.id, 20).expect(201);
      await putProfile(owner, pet.id, {
        activityLevel: 'medium',
        foodType: 'dry',
        kcalPer100g: 350,
      }).expect(200);

      const first = await generatePlan(owner, pet.id).expect(200);
      const second = await generatePlan(owner, pet.id).expect(200);
      expect((second.body as { id: string }).id).toBe(
        (first.body as { id: string }).id,
      );
      expect(await planCount(pet.id)).toBe(1);

      await putProfile(owner, pet.id, {
        activityLevel: 'medium',
        foodType: 'dry',
        kcalPer100g: 360,
      }).expect(200);
      const third = await generatePlan(owner, pet.id).expect(200);
      expect((third.body as { id: string }).id).not.toBe(
        (first.body as { id: string }).id,
      );
      expect(await planCount(pet.id)).toBe(2);
    });
  });

  describe('R22 (nutrition-profile-engine #17): generate sin perfil responde 422 NUTRITION_PROFILE_REQUIRED', () => {
    it('responde 422 sin insertar plan cuando falta el perfil', async () => {
      const owner = await seedUser('r22-missing');
      const pet = await seedPet(owner);
      await postWeight(owner, pet.id, 20).expect(201);

      const response = await generatePlan(owner, pet.id).expect(422);
      expect(response.body).toMatchObject({
        statusCode: 422,
        code: 'NUTRITION_PROFILE_REQUIRED',
      });
      expect(await planCount(pet.id)).toBe(0);
    });

    it('anti-vacio: con perfil y peso nunca emite ese codigo', async () => {
      const owner = await seedUser('r22-present');
      const pet = await seedPet(owner);
      await postWeight(owner, pet.id, 20).expect(201);
      await putProfile(owner, pet.id, {
        activityLevel: 'medium',
        foodType: 'dry',
        kcalPer100g: 350,
      }).expect(200);

      const response = await generatePlan(owner, pet.id).expect(200);
      expect(JSON.stringify(response.body)).not.toContain(
        'NUTRITION_PROFILE_REQUIRED',
      );
    });
  });

  describe('R23 (nutrition-profile-engine #17): generate sin peso responde 422 PET_WEIGHT_REQUIRED', () => {
    it('responde 422 sin insertar cuando existe perfil pero no peso', async () => {
      const owner = await seedUser('r23-missing-weight');
      const pet = await seedPet(owner);
      await putProfile(owner, pet.id, {
        activityLevel: 'medium',
        foodType: 'dry',
        kcalPer100g: 350,
      }).expect(200);

      const response = await generatePlan(owner, pet.id).expect(422);
      expect(response.body).toMatchObject({
        statusCode: 422,
        code: 'PET_WEIGHT_REQUIRED',
      });
      expect(await planCount(pet.id)).toBe(0);
    });

    it('evalua perfil antes que peso cuando faltan ambos', async () => {
      const owner = await seedUser('r23-precedence');
      const pet = await seedPet(owner);

      const response = await generatePlan(owner, pet.id).expect(422);
      expect(response.body).toMatchObject({
        code: 'NUTRITION_PROFILE_REQUIRED',
      });
    });

    it('anti-vacio: con peso el codigo no aparece', async () => {
      const owner = await seedUser('r23-present');
      const pet = await seedPet(owner);
      await putProfile(owner, pet.id, {
        activityLevel: 'medium',
        foodType: 'dry',
        kcalPer100g: 350,
      }).expect(200);
      await postWeight(owner, pet.id, 20).expect(201);

      const response = await generatePlan(owner, pet.id).expect(200);
      expect(JSON.stringify(response.body)).not.toContain(
        'PET_WEIGHT_REQUIRED',
      );
    });
  });

  describe('R24 (nutrition-profile-engine #17): GET del plan devuelve el ultimo o 404', () => {
    it('responde 404 NUTRITION_PLAN_NOT_FOUND cuando no hay planes', async () => {
      const owner = await seedUser('r24-missing');
      const pet = await seedPet(owner);

      const response = await api()
        .get(`/v1/pets/${pet.id}/nutrition-plan`)
        .set(auth(owner.token))
        .expect(404);

      expect(response.body).toMatchObject({
        statusCode: 404,
        code: 'NUTRITION_PLAN_NOT_FOUND',
      });
    });

    it('devuelve el ultimo plan generado', async () => {
      const owner = await seedUser('r24-latest');
      const pet = await seedPet(owner);
      await putProfile(owner, pet.id, {
        activityLevel: 'medium',
        foodType: 'dry',
        kcalPer100g: 350,
      }).expect(200);
      await postWeight(owner, pet.id, 20).expect(201);

      const first = await generatePlan(owner, pet.id).expect(200);
      await putProfile(owner, pet.id, {
        activityLevel: 'medium',
        foodType: 'dry',
        kcalPer100g: 400,
      }).expect(200);
      const second = await generatePlan(owner, pet.id).expect(200);
      const firstBody = first.body as { id: string };
      const secondBody = second.body as { id: string };
      expect(secondBody.id).not.toBe(firstBody.id);

      const latest = await api()
        .get(`/v1/pets/${pet.id}/nutrition-plan`)
        .set(auth(owner.token))
        .expect(200);
      expect(latest.body).toEqual(second.body);
    });
  });

  describe('R25 (nutrition-profile-engine #17): PetAccessGuard y ausencia de muro de pago', () => {
    it('oculta las cuatro rutas a un usuario sin membresia', async () => {
      const owner = await seedUser('r25-owner');
      const outsider = await seedUser('r25-outsider');
      const pet = await seedPet(owner);
      await putProfile(owner, pet.id, {
        activityLevel: 'medium',
        foodType: 'dry',
        kcalPer100g: 350,
      }).expect(200);
      await postWeight(owner, pet.id, 20).expect(201);
      await generatePlan(owner, pet.id).expect(200);

      await putProfile(outsider, pet.id, {
        activityLevel: 'low',
        foodType: 'wet',
        kcalPer100g: 100,
      }).expect(404);
      await api()
        .get(`/v1/pets/${pet.id}/nutrition-profile`)
        .set(auth(outsider.token))
        .expect(404);
      await generatePlan(outsider, pet.id).expect(404);
      await api()
        .get(`/v1/pets/${pet.id}/nutrition-plan`)
        .set(auth(outsider.token))
        .expect(404);
    });

    it('responde 404 antes que 403 para una mascota inexistente', async () => {
      const user = await seedUser('r25-missing');
      await api()
        .get(`/v1/pets/${uuidv7()}/nutrition-profile`)
        .set(auth(user.token))
        .expect(404);
    });

    it('permite lectura al miembro y rechaza sus escrituras con 403', async () => {
      const owner = await seedUser('r25-viewer-owner');
      const viewer = await seedUser('r25-viewer');
      const pet = await seedPet(owner);
      await putProfile(owner, pet.id, {
        activityLevel: 'medium',
        foodType: 'dry',
        kcalPer100g: 350,
      }).expect(200);
      await postWeight(owner, pet.id, 20).expect(201);
      await generatePlan(owner, pet.id).expect(200);
      await db.insert(petUsers).values({
        petId: pet.id,
        userId: viewer.id,
        role: 'family',
      });

      await api()
        .get(`/v1/pets/${pet.id}/nutrition-profile`)
        .set(auth(viewer.token))
        .expect(200);
      await api()
        .get(`/v1/pets/${pet.id}/nutrition-plan`)
        .set(auth(viewer.token))
        .expect(200);
      await putProfile(viewer, pet.id, {
        activityLevel: 'low',
        foodType: 'wet',
        kcalPer100g: 100,
      }).expect(403);
      await generatePlan(viewer, pet.id).expect(403);
    });

    it('anti-vacio: el owner genera sin suscripcion y sin errores de acceso', async () => {
      const owner = await seedUser('r25-free-health');
      const pet = await seedPet(owner);
      await putProfile(owner, pet.id, {
        activityLevel: 'medium',
        foodType: 'dry',
        kcalPer100g: 350,
      }).expect(200);
      await postWeight(owner, pet.id, 20).expect(201);

      const response = await generatePlan(owner, pet.id).expect(200);
      const body = JSON.stringify(response.body);
      expect(body).not.toContain('DEVICE_SUBSCRIPTION_REQUIRED');
      expect(body).not.toContain('Forbidden');
      expect(body).not.toContain('Not Found');
    });
  });

  describe('R5 (nutrition-ai-explainer #18): IA apagada persiste aiExplanation null', () => {
    it('devuelve null en generate y lo persiste', async () => {
      const owner = await seedUser('r26');
      const pet = await seedPet(owner);
      await putProfile(owner, pet.id, {
        activityLevel: 'medium',
        foodType: 'dry',
        kcalPer100g: 350,
      }).expect(200);
      await postWeight(owner, pet.id, 20).expect(201);

      const generated = await generatePlan(owner, pet.id).expect(200);
      const generatedBody = generated.body as {
        id: string;
        aiExplanation: null;
      };
      expect(generatedBody.aiExplanation).toBeNull();
      const persisted = await db
        .select({ aiExplanation: nutritionPlans.aiExplanation })
        .from(nutritionPlans)
        .where(eq(nutritionPlans.id, generatedBody.id));
      expect(persisted).toEqual([{ aiExplanation: null }]);
    });
  });

  describe('R27 (nutrition-profile-engine #17): numeric llega al cliente como number', () => {
    it('convierte kcalPer100g y targetWeightKg al leer el perfil', async () => {
      const owner = await seedUser('r27');
      const pet = await seedPet(owner);
      await putProfile(owner, pet.id, {
        activityLevel: 'medium',
        targetWeightKg: 18.5,
        foodType: 'dry',
        kcalPer100g: 350,
      }).expect(200);

      const response = await api()
        .get(`/v1/pets/${pet.id}/nutrition-profile`)
        .set(auth(owner.token))
        .expect(200);
      const body = response.body as {
        kcalPer100g: unknown;
        targetWeightKg: unknown;
      };
      expect(typeof body.kcalPer100g).toBe('number');
      expect(typeof body.targetWeightKg).toBe('number');
      expect(body).toMatchObject({
        kcalPer100g: 350,
        targetWeightKg: 18.5,
      });
    });
  });

  describe('R13 (nutrition-ai-explainer #18): setAiExplanation actualiza la fila existente', () => {
    it('persists the text without inserting a row or changing generatedAt', async () => {
      explain.mockResolvedValue('Generated explanation');
      isPetTracked.mockResolvedValue(true);
      const owner = await seedUser('r13-ai');
      const pet = await seedPet(owner);
      await putProfile(owner, pet.id, {
        activityLevel: 'medium',
        foodType: 'dry',
        kcalPer100g: 350,
      }).expect(200);
      await postWeight(owner, pet.id, 20).expect(201);

      const generated = await generatePlan(owner, pet.id).expect(200);
      const body = generated.body as {
        id: string;
        aiExplanation: string;
        generatedAt: string;
      };
      const [persisted] = await db
        .select({
          aiExplanation: nutritionPlans.aiExplanation,
          generatedAt: nutritionPlans.generatedAt,
        })
        .from(nutritionPlans)
        .where(eq(nutritionPlans.id, body.id));

      expect(await planCount(pet.id)).toBe(1);
      expect(body.aiExplanation).toBe('Generated explanation');
      expect(persisted.aiExplanation).toBe('Generated explanation');
      expect(persisted.generatedAt.toISOString()).toBe(body.generatedAt);
    });
  });

  describe('R16 (nutrition-ai-explainer #18): hash hit con explicacion no re-llama', () => {
    it('returns the same row and pays for one explanation only', async () => {
      explain.mockResolvedValue('Generated explanation');
      isPetTracked.mockResolvedValue(true);
      const owner = await seedUser('r16-ai');
      const pet = await seedPet(owner);
      await putProfile(owner, pet.id, {
        activityLevel: 'medium',
        foodType: 'dry',
        kcalPer100g: 350,
      }).expect(200);
      await postWeight(owner, pet.id, 20).expect(201);

      const first = await generatePlan(owner, pet.id).expect(200);
      const second = await generatePlan(owner, pet.id).expect(200);

      expect((second.body as { id: string }).id).toBe(
        (first.body as { id: string }).id,
      );
      expect(await planCount(pet.id)).toBe(1);
      expect(explain).toHaveBeenCalledTimes(1);
    });
  });
});
