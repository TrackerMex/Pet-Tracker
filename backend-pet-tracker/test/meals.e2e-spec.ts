import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { eq, inArray } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import request from 'supertest';
import { App } from 'supertest/types';
import { uuidv7 } from 'uuidv7';
import { DRIZZLE } from '@/db/drizzle.constants';
import { auditLog } from '@/db/schema/audit-log.schema';
import { mealServings } from '@/db/schema/nutrition.schema';
import { pets } from '@/db/schema/pets.schema';
import { users } from '@/db/schema/users.schema';
import { TOKEN_SERVICE } from '@/modules/auth/domain/ports/token-service';
import type { TokenService } from '@/modules/auth/domain/ports/token-service';
import { localDayOf } from '@/pipeline/local-day';
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
});
