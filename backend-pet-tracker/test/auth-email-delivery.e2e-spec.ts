import { INestApplication, Logger } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { inArray } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import request, { Response } from 'supertest';
import { App } from 'supertest/types';
import { uuidv7 } from 'uuidv7';
import { auditLog } from '@/db/schema/audit-log.schema';
import { passwordResetTokens } from '@/db/schema/password-reset-tokens.schema';
import { users } from '@/db/schema/users.schema';
import { DRIZZLE } from '@/db/drizzle.constants';
import { PASSWORD_HASHER } from '@/modules/auth/domain/ports/password-hasher';
import type { PasswordHasher } from '@/modules/auth/domain/ports/password-hasher';
import { PASSWORD_RESET_SENDER } from '@/modules/auth/domain/ports/password-reset-sender';
import { ResendClient } from '@/modules/auth/infrastructure/email/resend-client';
import { ResendPasswordResetSender } from '@/modules/auth/infrastructure/email/resend-password-reset-sender';
import { AppModule } from '../src/app.module';

interface ForgotPasswordBody {
  requested: true;
}

function forgotPasswordBody(response: Response): ForgotPasswordBody {
  return response.body as ForgotPasswordBody;
}

describe('Auth email delivery (e2e)', () => {
  describe('R6: con el emisor lanzando, forgot-password sigue devolviendo 200 requested true', () => {
    const runId = Date.now();
    const userIds: string[] = [];
    const fetchDouble = jest.fn(() =>
      Promise.reject(new Error('provider unavailable')),
    );
    const client = new ResendClient(
      'api-key-for-r6',
      'sender@example.com',
      fetchDouble as unknown as typeof fetch,
    );
    let app: INestApplication<App>;
    let db: NodePgDatabase;
    let passwordHasher: PasswordHasher;

    const api = () => request(app.getHttpServer());

    beforeAll(async () => {
      jest.spyOn(Logger.prototype, 'error').mockImplementation();
      const module = await Test.createTestingModule({
        imports: [AppModule],
      })
        .overrideProvider(PASSWORD_RESET_SENDER)
        .useValue(new ResendPasswordResetSender(client))
        .compile();

      app = module.createNestApplication();
      app.setGlobalPrefix('v1');
      await app.init();
      db = app.get<NodePgDatabase>(DRIZZLE);
      passwordHasher = app.get<PasswordHasher>(PASSWORD_HASHER);
    });

    afterAll(async () => {
      await client.whenIdle();
      if (userIds.length > 0) {
        await db
          .delete(passwordResetTokens)
          .where(inArray(passwordResetTokens.userId, userIds));
        await db.delete(auditLog).where(inArray(auditLog.userId, userIds));
        await db.delete(users).where(inArray(users.id, userIds));
      }
      await app.close();
      jest.restoreAllMocks();
    });

    it('iguala status y body entre cuenta existente y cuenta inexistente', async () => {
      const userId = uuidv7();
      const email = `delivery-r6-${runId}@example.com`;
      userIds.push(userId);
      await db.insert(users).values({
        id: userId,
        email,
        passwordHash: await passwordHasher.hash('OldPassword1!'),
        firstName: 'E2e',
        lastName: 'R6',
        phone: '+525512345678',
        country: 'MX',
        timezone: 'UTC',
        termsAcceptedAt: new Date(),
      });

      const existingResponse = await api()
        .post('/v1/auth/forgot-password')
        .send({ email });
      const missingResponse = await api()
        .post('/v1/auth/forgot-password')
        .send({ email: `missing-r6-${runId}@example.com` });
      await client.whenIdle();

      expect({
        status: missingResponse.status,
        body: forgotPasswordBody(missingResponse),
      }).toEqual({
        status: existingResponse.status,
        body: forgotPasswordBody(existingResponse),
      });
      expect(existingResponse.status).toBe(200);
      expect(existingResponse.body).toEqual({ requested: true });
      expect(fetchDouble).toHaveBeenCalledTimes(1);
    });
  });
});
