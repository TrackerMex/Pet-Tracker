import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { inArray } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import request from 'supertest';
import { App } from 'supertest/types';
import { uuidv7 } from 'uuidv7';
import { auditLog } from '@/db/schema/audit-log.schema';
import { passwordResetTokens } from '@/db/schema/password-reset-tokens.schema';
import { users } from '@/db/schema/users.schema';
import { DRIZZLE } from '@/db/drizzle.constants';
import { PASSWORD_HASHER } from '@/modules/auth/domain/ports/password-hasher';
import type { PasswordHasher } from '@/modules/auth/domain/ports/password-hasher';
import { PASSWORD_RESET_SENDER } from '@/modules/auth/domain/ports/password-reset-sender';
import type { PasswordResetMessage } from '@/modules/auth/domain/ports/password-reset-sender';
import { AppModule } from '../src/app.module';

describe('R11: ningun GET consume el token; solo POST reset-password lo canjea una vez', () => {
  const runId = Date.now();
  const userIds: string[] = [];
  const sentMessages: PasswordResetMessage[] = [];
  let app: INestApplication<App>;
  let db: NodePgDatabase;
  let passwordHasher: PasswordHasher;

  const api = () => request(app.getHttpServer());

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PASSWORD_RESET_SENDER)
      .useValue({
        send: (message: PasswordResetMessage) => {
          sentMessages.push(message);
          return Promise.resolve();
        },
      })
      .compile();

    app = module.createNestApplication();
    app.setGlobalPrefix('v1');
    await app.init();
    db = app.get<NodePgDatabase>(DRIZZLE);
    passwordHasher = app.get<PasswordHasher>(PASSWORD_HASHER);
  });

  afterAll(async () => {
    if (userIds.length > 0) {
      await db
        .delete(passwordResetTokens)
        .where(inArray(passwordResetTokens.userId, userIds));
      await db.delete(auditLog).where(inArray(auditLog.userId, userIds));
      await db.delete(users).where(inArray(users.id, userIds));
    }
    await app.close();
  });

  it('mantiene vigente el token tras varios GET y solo acepta el primer POST', async () => {
    const id = uuidv7();
    const email = `reset-deep-link-r11-${runId}@example.com`;
    userIds.push(id);
    await db.insert(users).values({
      id,
      email,
      passwordHash: await passwordHasher.hash('OldPassword1!'),
      firstName: 'E2e',
      lastName: 'R11',
      phone: '+525512345678',
      country: 'MX',
      timezone: 'UTC',
      termsAcceptedAt: new Date(),
    });

    await api().post('/v1/auth/forgot-password').send({ email }).expect(200);
    const token = sentMessages.find(
      (message) => message.email === email,
    )?.token;
    if (!token) {
      throw new Error(`No reset token captured for ${email}`);
    }

    for (let opening = 0; opening < 3; opening += 1) {
      await api().get('/v1/auth/reset-password').query({ token }).expect(404);
    }

    const resetBody = {
      token,
      password: 'NewPassword1!',
      passwordConfirmation: 'NewPassword1!',
    };
    await api().post('/v1/auth/reset-password').send(resetBody).expect(200);
    await api().post('/v1/auth/reset-password').send(resetBody).expect(400);
  });
});
