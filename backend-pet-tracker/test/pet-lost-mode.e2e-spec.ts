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

  describe('R2: solo el owner puede togglear lost mode', () => {
    it('returns 403 to every active non-owner without persisting or auditing', async () => {
      const owner = await seedUser('r2-owner');
      const family = await seedUser('r2-family');
      const walker = await seedUser('r2-walker');
      const vet = await seedUser('r2-vet');
      const pet = await seedPet(owner);
      await seedMembership(pet.id, family.id, 'family');
      await seedMembership(pet.id, walker.id, 'walker');
      await seedMembership(pet.id, vet.id, 'vet');

      for (const member of [family, walker, vet]) {
        await api()
          .post(`/v1/pets/${pet.id}/lost-mode`)
          .set(auth(member.token))
          .send({ enabled: true })
          .expect(403);
      }

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
      expect(audits).toHaveLength(0);
    });

    it('returns 404 to outsiders, missing pets, and malformed pet ids', async () => {
      const owner = await seedUser('r2-hidden-owner');
      const outsider = await seedUser('r2-outsider');
      const pet = await seedPet(owner);

      await api()
        .post(`/v1/pets/${pet.id}/lost-mode`)
        .set(auth(outsider.token))
        .send({ enabled: true })
        .expect(404);
      await api()
        .post(`/v1/pets/${uuidv7()}/lost-mode`)
        .set(auth(owner.token))
        .send({ enabled: true })
        .expect(404);
      await api()
        .post('/v1/pets/not-a-uuid/lost-mode')
        .set(auth(owner.token))
        .send({ enabled: true })
        .expect(404);
    });

    it('returns 401 without a bearer token', async () => {
      const owner = await seedUser('r2-unauthenticated-owner');
      const pet = await seedPet(owner);

      await api()
        .post(`/v1/pets/${pet.id}/lost-mode`)
        .send({ enabled: true })
        .expect(401);
    });
  });

  describe('R3: body invalido es 400 y PATCH no toca lostMode', () => {
    it('rejects every non-boolean enabled without persistence or audit', async () => {
      const owner = await seedUser('r3-invalid-owner');
      const pet = await seedPet(owner);

      for (const body of [
        {},
        { enabled: 'true' },
        { enabled: null },
        { enabled: 1 },
      ]) {
        const response = await api()
          .post(`/v1/pets/${pet.id}/lost-mode`)
          .set(auth(owner.token))
          .send(body)
          .expect(400);
        expect(response.body).toEqual(
          expect.objectContaining({
            statusCode: 400,
            message: 'Validation failed',
          }),
        );
      }

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
      expect(audits).toHaveLength(0);
    });

    it('strips extra POST keys and leaves PATCH lostMode read-only', async () => {
      const owner = await seedUser('r3-strip-owner');
      const postPet = await seedPet(owner);

      const toggled = await api()
        .post(`/v1/pets/${postPet.id}/lost-mode`)
        .set(auth(owner.token))
        .send({ enabled: true, ignored: 'value' })
        .expect(200);
      expect(profileBody(toggled).lostMode).toBe(true);

      const patchPet = await seedPet(owner);
      const patched = await api()
        .patch(`/v1/pets/${patchPet.id}`)
        .set(auth(owner.token))
        .send({ lostMode: true })
        .expect(200);
      expect(profileBody(patched).lostMode).toBe(false);

      const rows = await db
        .select()
        .from(pets)
        .where(eq(pets.id, patchPet.id));
      expect(rows[0].lostMode).toBe(false);
    });
  });
});
