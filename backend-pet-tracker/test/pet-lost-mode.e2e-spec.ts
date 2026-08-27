import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { and, eq, inArray } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import request, { Response } from 'supertest';
import { App } from 'supertest/types';
import { uuidv7 } from 'uuidv7';
import { auditLog } from '@/db/schema/audit-log.schema';
import { pets, petUsers } from '@/db/schema/pets.schema';
import { users } from '@/db/schema/users.schema';
import { DRIZZLE } from '@/db/drizzle.constants';
import { TOKEN_SERVICE } from '@/modules/auth/domain/ports/token-service';
import type { TokenService } from '@/modules/auth/domain/ports/token-service';
import { AppModule } from '../src/app.module';

interface PetProfileBody {
  id: string;
  lostMode: boolean;
  myRole: string;
  updatedAt: string;
}

function profileBody(response: Response): PetProfileBody {
  return response.body as PetProfileBody;
}

describe('Pet lost mode (e2e)', () => {
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
    const email = `lost-mode-${label}-${runId}@example.com`;

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

  async function seedPet(owner: UserFixture): Promise<PetProfileBody> {
    const response = await api()
      .post('/v1/pets')
      .set(auth(owner.token))
      .send({
        name: `Lost-${uuidv7()}`,
        species: 'dog',
        birthDate: '2024-01-15',
      })
      .expect(201);
    const pet = profileBody(response);
    petIds.push(pet.id);
    return pet;
  }

  function seedMembership(
    petId: string,
    userId: string,
    role: 'owner' | 'family' | 'walker' | 'vet',
  ) {
    return db.insert(petUsers).values({
      petId,
      userId,
      role,
      status: 'active',
    });
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
    if (userIds.length > 0) {
      await db.delete(auditLog).where(inArray(auditLog.userId, userIds));
    }
    if (petIds.length > 0) {
      await db.delete(pets).where(inArray(pets.id, petIds));
    }
    if (userIds.length > 0) {
      await db.delete(users).where(inArray(users.id, userIds));
    }
    await app.close();
  });

  describe('R1: owner activa y desactiva lost mode', () => {
    it('persists every requested value, refreshes updatedAt, and audits retries', async () => {
      const owner = await seedUser('r1-owner');
      const pet = await seedPet(owner);
      const oldUpdatedAt = new Date('2020-01-01T00:00:00.000Z');
      await db
        .update(pets)
        .set({ updatedAt: oldUpdatedAt })
        .where(eq(pets.id, pet.id));

      const enabled = await api()
        .post(`/v1/pets/${pet.id}/lost-mode`)
        .set(auth(owner.token))
        .send({ enabled: true })
        .expect(200);
      expect(profileBody(enabled)).toEqual(
        expect.objectContaining({
          id: pet.id,
          lostMode: true,
          myRole: 'owner',
        }),
      );
      expect(new Date(profileBody(enabled).updatedAt).getTime()).toBeGreaterThan(
        oldUpdatedAt.getTime(),
      );

      await api()
        .post(`/v1/pets/${pet.id}/lost-mode`)
        .set(auth(owner.token))
        .send({ enabled: true })
        .expect(200)
        .expect(({ body }: Response) => {
          expect((body as PetProfileBody).lostMode).toBe(true);
        });

      const disabled = await api()
        .post(`/v1/pets/${pet.id}/lost-mode`)
        .set(auth(owner.token))
        .send({ enabled: false })
        .expect(200);
      expect(profileBody(disabled).lostMode).toBe(false);

      const rows = await db
        .select()
        .from(pets)
        .where(eq(pets.id, pet.id));
      expect(rows[0].lostMode).toBe(false);

      const audits = await db
        .select()
        .from(auditLog)
        .where(
          and(
            eq(auditLog.action, 'pet.lost_mode'),
            eq(auditLog.entityId, pet.id),
          ),
        );
      expect(audits).toHaveLength(3);
      expect(audits.map(({ meta }) => meta)).toEqual(
        expect.arrayContaining([
          { enabled: true },
          { enabled: true },
          { enabled: false },
        ]),
      );
    });
  });
});
