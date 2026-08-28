import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { inArray } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import request from 'supertest';
import { App } from 'supertest/types';
import { uuidv7 } from 'uuidv7';
import { auditLog } from '@/db/schema/audit-log.schema';
import { users } from '@/db/schema/users.schema';
import { DRIZZLE } from '@/db/drizzle.constants';
import { PASSWORD_HASHER } from '@/modules/auth/domain/ports/password-hasher';
import type { PasswordHasher } from '@/modules/auth/domain/ports/password-hasher';
import { AppModule } from '../src/app.module';

describe('Auth forgot password (e2e)', () => {
  const runId = Date.now();
  const userIds: string[] = [];
  let app: INestApplication<App>;
  let db: NodePgDatabase;
  let passwordHasher: PasswordHasher;

  const api = () => request(app.getHttpServer());

  async function seedUser(label: string, password = 'OldPassword1!') {
    const id = uuidv7();
    const email = `forgot-${label}-${runId}@example.com`;

    await db.insert(users).values({
      id,
      email,
      passwordHash: await passwordHasher.hash(password),
      firstName: 'E2e',
      lastName: label,
      phone: '+525512345678',
      country: 'MX',
      timezone: 'UTC',
      termsAcceptedAt: new Date(),
    });
    userIds.push(id);

    return { id, email, password };
  }

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = module.createNestApplication();
    app.setGlobalPrefix('v1');
    await app.init();
    db = app.get<NodePgDatabase>(DRIZZLE);
    passwordHasher = app.get<PasswordHasher>(PASSWORD_HASHER);
  });

  afterAll(async () => {
    if (userIds.length > 0) {
      await db.delete(auditLog).where(inArray(auditLog.userId, userIds));
      await db.delete(users).where(inArray(users.id, userIds));
    }
    await app.close();
  });

  describe('R2: forgot-password responde identico para cuenta existente e inexistente', () => {
    it('no permite distinguir las cuentas por status ni body', async () => {
      const existing = await seedUser('r2');

      const existingResponse = await api()
        .post('/v1/auth/forgot-password')
        .send({ email: existing.email });
      const missingResponse = await api()
        .post('/v1/auth/forgot-password')
        .send({ email: `missing-${runId}@example.com` });

      expect({
        status: missingResponse.status,
        body: missingResponse.body,
      }).toEqual({
        status: existingResponse.status,
        body: existingResponse.body,
      });
      expect(existingResponse.status).toBe(200);
      expect(existingResponse.body).toEqual({ requested: true });
    });
  });
});
