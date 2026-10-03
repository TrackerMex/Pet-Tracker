import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { inArray } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import request from 'supertest';
import { App } from 'supertest/types';
import { uuidv7 } from 'uuidv7';
import { DRIZZLE } from '@/db/drizzle.constants';
import { auditLog } from '@/db/schema/audit-log.schema';
import { mealServings } from '@/db/schema/nutrition.schema';
import { pets, petUsers } from '@/db/schema/pets.schema';
import { users } from '@/db/schema/users.schema';
import {
  TOKEN_SERVICE,
  type TokenService,
} from '@/modules/auth/domain/ports/token-service';
import { localDayOf, shiftDay } from '@/pipeline/local-day';
import { AppModule } from '../src/app.module';

describe('Meals history (e2e)', () => {
  const runId = uuidv7();
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
    const email = `history-${label}-${runId}@example.com`;
    await db
      .insert(users)
      .values({
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
        name: `History-${uuidv7()}`,
        species: 'dog',
        birthDate: '2021-01-15',
        sterilized: true,
      })
      .expect(201);
    const pet = response.body as { id: string };
    petIds.push(pet.id);
    return pet;
  }
  const addMember = (petId: string, userId: string) =>
    db
      .insert(petUsers)
      .values({ petId, userId, role: 'family', status: 'active' });
  const history = (
    user: UserFixture,
    petId: string,
    query: Record<string, string> = {},
  ) => api().get(`/v1/pets/${petId}/meals`).set(auth(user.token)).query(query);
  const insert = (
    owner: UserFixture,
    petId: string,
    servedOn: string,
    mealTime: string,
  ) =>
    db
      .insert(mealServings)
      .values({ id: uuidv7(), petId, servedOn, mealTime, createdBy: owner.id });
  async function fixture(label: string) {
    const owner = await seedUser(label);
    const pet = await seedPet(owner);
    return { owner, pet };
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
    if (userIds.length)
      await db.delete(auditLog).where(inArray(auditLog.userId, userIds));
    if (petIds.length) await db.delete(pets).where(inArray(pets.id, petIds));
    if (userIds.length)
      await db.delete(users).where(inArray(users.id, userIds));
    await app.close();
  });

  describe('#105 R1: inclusive range and ordered served hours', () => {
    it('includes both endpoints and excludes outside rows and another pet', async () => {
      const { owner, pet } = await fixture('inclusive');
      const other = await fixture('other');
      await insert(owner, pet.id, '2025-12-29', '08:00');
      await insert(owner, pet.id, '2026-01-03', '18:00');
      await insert(owner, pet.id, '2025-12-28', '09:00');
      await insert(owner, pet.id, '2026-01-04', '09:00');
      await insert(other.owner, other.pet.id, '2025-12-29', '10:00');
      const response = await history(owner, pet.id, {
        from: '2025-12-29',
        to: '2026-01-03',
      }).expect(200);
      expect(response.body.days).toEqual([
        { date: '2025-12-29', mealTimes: ['08:00'] },
        { date: '2025-12-30', mealTimes: [] },
        { date: '2025-12-31', mealTimes: [] },
        { date: '2026-01-01', mealTimes: [] },
        { date: '2026-01-02', mealTimes: [] },
        { date: '2026-01-03', mealTimes: ['18:00'] },
      ]);
    });
    it('returns hours ascending although inserted in reverse', async () => {
      const { owner, pet } = await fixture('sort');
      await insert(owner, pet.id, '2025-12-30', '12:00');
      await insert(owner, pet.id, '2025-12-30', '08:00');
      const response = await history(owner, pet.id, {
        from: '2025-12-30',
        to: '2025-12-30',
      }).expect(200);
      expect(response.body.days).toEqual([
        { date: '2025-12-30', mealTimes: ['08:00', '12:00'] },
      ]);
    });
  });
  describe('#105 R2: range errors return exact HTTP codes and messages', () => {
    it.each(['2026-13-01', '2026-02-30', 'ayer'])(
      'rejects invalid from %s',
      async (from) => {
        const { owner, pet } = await fixture(`date-${from}`);
        const response = await history(owner, pet.id, { from }).expect(400);
        expect(response.body).toEqual({
          statusCode: 400,
          code: 'INVALID_DATE',
          message: 'Dates must be calendar days YYYY-MM-DD',
        });
      },
    );
    it('rejects a reversed range', async () => {
      const { owner, pet } = await fixture('reverse');
      const response = await history(owner, pet.id, {
        from: '2026-01-02',
        to: '2026-01-01',
      }).expect(400);
      expect(response.body).toEqual({
        statusCode: 400,
        code: 'INVALID_RANGE',
        message: 'from must not be after to',
      });
    });
    it('rejects 32 days and accepts 31', async () => {
      const { owner, pet } = await fixture('window');
      const to = localDayOf(Date.now(), 'UTC');
      const response = await history(owner, pet.id, {
        from: shiftDay(to, -31),
        to,
      }).expect(400);
      expect(response.body).toEqual({
        statusCode: 400,
        code: 'RANGE_TOO_LARGE',
        message: 'Requested range exceeds the maximum window',
      });
      const accepted = await history(owner, pet.id, {
        from: shiftDay(to, -30),
        to,
      }).expect(200);
      expect(accepted.body.days).toHaveLength(31);
    });
  });
  describe('#105 R4: strict GET history endpoint for pet members', () => {
    it('defaults to 31 days ending today in UTC', async () => {
      const { owner, pet } = await fixture('default');
      const response = await history(owner, pet.id).expect(200);
      const to = localDayOf(Date.now(), 'UTC');
      expect(response.body).toMatchObject({
        from: shiftDay(to, -30),
        to,
        today: to,
      });
      expect(response.body.days).toHaveLength(31);
    });
    it('fills six days crossing a year with sorted hours scoped to pet', async () => {
      const { owner, pet } = await fixture('gaps');
      const other = await fixture('gaps-other');
      await insert(owner, pet.id, '2025-12-30', '12:00');
      await insert(owner, pet.id, '2025-12-30', '08:00');
      await insert(owner, pet.id, '2026-01-02', '07:30');
      await insert(owner, pet.id, '2025-12-28', '09:00');
      await insert(other.owner, other.pet.id, '2025-12-30', '10:00');
      const response = await history(owner, pet.id, {
        from: '2025-12-29',
        to: '2026-01-03',
      }).expect(200);
      expect(response.body.days).toEqual([
        { date: '2025-12-29', mealTimes: [] },
        { date: '2025-12-30', mealTimes: ['08:00', '12:00'] },
        { date: '2025-12-31', mealTimes: [] },
        { date: '2026-01-01', mealTimes: [] },
        { date: '2026-01-02', mealTimes: ['07:30'] },
        { date: '2026-01-03', mealTimes: [] },
      ]);
    });
    it('defaults from when only to is supplied', async () => {
      const { owner, pet } = await fixture('only-to');
      const response = await history(owner, pet.id, {
        to: '2026-01-31',
      }).expect(200);
      expect(response.body.from).toBe('2026-01-01');
      expect(response.body.days).toHaveLength(31);
    });
    it('rejects unknown query keys with the validation shape', async () => {
      const { owner, pet } = await fixture('strict');
      const response = await history(owner, pet.id, {
        month: '2026-01',
      }).expect(400);
      expect(response.body).toMatchObject({
        statusCode: 400,
        message: 'Validation failed',
        errors: [{ path: '', message: expect.any(String) }],
      });
    });
    it('accepts future days as empty', async () => {
      const { owner, pet } = await fixture('future');
      const today = localDayOf(Date.now(), 'UTC');
      const response = await history(owner, pet.id, {
        from: shiftDay(today, -2),
        to: shiftDay(today, 2),
      }).expect(200);
      expect(response.body.days).toHaveLength(5);
      expect(response.body.days.slice(3)).toEqual([
        { date: shiftDay(today, 1), mealTimes: [] },
        { date: shiftDay(today, 2), mealTimes: [] },
      ]);
    });
    it('allows an active family member', async () => {
      const { owner, pet } = await fixture('member');
      const member = await seedUser('family');
      await addMember(pet.id, member.id);
      await history(member, pet.id).expect(200);
    });
    it('returns 404 for an outsider', async () => {
      const { pet } = await fixture('private');
      const outsider = await seedUser('outsider');
      await history(outsider, pet.id).expect(404);
    });
    it('returns 404 for a non UUID pet id', async () => {
      const owner = await seedUser('bad-id');
      await history(owner, 'not-a-uuid').expect(404);
    });
  });
});
