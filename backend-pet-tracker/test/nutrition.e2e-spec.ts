import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { eq, inArray } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import request from 'supertest';
import { App } from 'supertest/types';
import { uuidv7 } from 'uuidv7';
import { DRIZZLE } from '@/db/drizzle.constants';
import { nutritionProfiles } from '@/db/schema/nutrition.schema';
import { pets } from '@/db/schema/pets.schema';
import { users } from '@/db/schema/users.schema';
import { TOKEN_SERVICE } from '@/modules/auth/domain/ports/token-service';
import type { TokenService } from '@/modules/auth/domain/ports/token-service';
import { AppModule } from '../src/app.module';

describe('Nutrition profile and plans (e2e)', () => {
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
      expect(new Date((created.body as { updatedAt: string }).updatedAt).toISOString()).toBe(
        (created.body as { updatedAt: string }).updatedAt,
      );

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

    it.each<Array<[string, Record<string, unknown>]>>([
      ['kcal 900', { ...validBody, kcalPer100g: 900 }],
      ['kcal 79', { ...validBody, kcalPer100g: 79 }],
      [
        'dry sin kcal',
        { activityLevel: 'medium', foodType: 'dry' },
      ],
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
      expect(Array.isArray((response.body as { errors: unknown[] }).errors)).toBe(
        true,
      );
      expect(
        await db
          .select()
          .from(nutritionProfiles)
          .where(eq(nutritionProfiles.petId, pet.id)),
      ).toEqual([]);
    });
  });
});
