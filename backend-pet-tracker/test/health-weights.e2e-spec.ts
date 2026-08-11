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
  const today = () => new Date().toISOString().slice(0, 10);

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
    async function currentWeight(user: UserFixture, petId: string) {
      const response = await api()
        .get(`/v1/pets/${petId}`)
        .set(auth(user.token))
        .expect(200);
      return (response.body as { currentWeightKg: number | null })
        .currentWeightKg;
    }

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
});
