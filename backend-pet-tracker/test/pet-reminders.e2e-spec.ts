import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { eq, inArray } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import request from 'supertest';
import { App } from 'supertest/types';
import { uuidv7 } from 'uuidv7';
import { auditLog } from '@/db/schema/audit-log.schema';
import { pets } from '@/db/schema/pets.schema';
import { reminders } from '@/db/schema/reminders.schema';
import { users } from '@/db/schema/users.schema';
import { DRIZZLE } from '@/db/drizzle.constants';
import { TOKEN_SERVICE } from '@/modules/auth/domain/ports/token-service';
import type { TokenService } from '@/modules/auth/domain/ports/token-service';
import { AppModule } from '../src/app.module';

describe('Pet reminders (e2e)', () => {
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
    const email = `reminders-${label}-${runId}@example.com`;
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
        name: `Pet-${uuidv7()}`,
        species: 'dog',
        birthDate: '2024-01-15',
      })
      .expect(201);
    const pet = response.body as { id: string };
    petIds.push(pet.id);
    return pet;
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

  describe('R2: POST crea reminder programado con shape exacto', () => {
    it('persiste defaults, actor y token vigente', async () => {
      const owner = await seedUser('r2');
      const pet = await seedPet(owner);
      const dueAt = new Date(Date.now() + 5 * 60_000).toISOString();

      const response = await api()
        .post(`/v1/pets/${pet.id}/reminders`)
        .set(auth(owner.token))
        .send({ type: 'appointment', title: 'Consulta anual', dueAt })
        .expect(201);

      expect(Object.keys(response.body as object).sort()).toEqual(
        [
          'id',
          'petId',
          'type',
          'title',
          'dueAt',
          'advanceMinutes',
          'status',
        ].sort(),
      );
      expect(response.body).toMatchObject({
        petId: pet.id,
        type: 'appointment',
        title: 'Consulta anual',
        dueAt,
        advanceMinutes: 60,
        status: 'scheduled',
      });

      const [row] = await db
        .select()
        .from(reminders)
        .where(eq(reminders.id, (response.body as { id: string }).id));
      expect(row).toMatchObject({
        petId: pet.id,
        createdBy: owner.id,
        status: 'scheduled',
        advanceMinutes: 60,
        enqueuedAt: null,
      });
      expect(row.scheduleName).toMatch(/^reminder-[0-9a-f-]{36}$/);
    });
  });

  describe('R3: POST invalido responde 400 sin insertar', () => {
    it.each<[string, Record<string, unknown>]>([
      ['type', { type: 'other' }],
      ['title-empty', { title: '   ' }],
      ['title-long', { title: 'x'.repeat(121) }],
      ['due-no-offset', { dueAt: '2099-01-01T00:00:00' }],
      ['due-past', { dueAt: new Date(Date.now() - 60_000).toISOString() }],
      ['advance-decimal', { advanceMinutes: 1.5 }],
      ['advance-negative', { advanceMinutes: -1 }],
      ['advance-too-large', { advanceMinutes: 10_081 }],
      ['unknown-key', { extra: true }],
    ])(
      'rechaza %s con el error de validacion estable',
      async (label, changes) => {
        const owner = await seedUser(`r3-${label}`);
        const pet = await seedPet(owner);
        const response = await api()
          .post(`/v1/pets/${pet.id}/reminders`)
          .set(auth(owner.token))
          .send({
            type: 'custom',
            title: 'Valido',
            dueAt: new Date(Date.now() + 60_000).toISOString(),
            ...changes,
          })
          .expect(400);

        expect(response.body).toMatchObject({
          statusCode: 400,
          message: 'Validation failed',
          errors: expect.any(Array),
        });
        expect(
          await db.select().from(reminders).where(eq(reminders.petId, pet.id)),
        ).toEqual([]);
      },
    );
  });
});
