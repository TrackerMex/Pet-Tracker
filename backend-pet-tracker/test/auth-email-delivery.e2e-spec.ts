import { INestApplication, Logger } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { inArray } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import request, { Response } from 'supertest';
import { App } from 'supertest/types';
import { uuidv7 } from 'uuidv7';
import { auditLog } from '@/db/schema/audit-log.schema';
import { emailVerificationTokens } from '@/db/schema/email-verification-tokens.schema';
import { passwordResetTokens } from '@/db/schema/password-reset-tokens.schema';
import { users } from '@/db/schema/users.schema';
import { DRIZZLE } from '@/db/drizzle.constants';
import { EMAIL_VERIFICATION_SENDER } from '@/modules/auth/domain/ports/email-verification-sender';
import { PASSWORD_HASHER } from '@/modules/auth/domain/ports/password-hasher';
import type { PasswordHasher } from '@/modules/auth/domain/ports/password-hasher';
import { PASSWORD_RESET_SENDER } from '@/modules/auth/domain/ports/password-reset-sender';
import { ConsoleEmailVerificationSender } from '@/modules/auth/infrastructure/email/console-email-verification-sender';
import { ConsolePasswordResetSender } from '@/modules/auth/infrastructure/email/console-password-reset-sender';
import { ResendClient } from '@/modules/auth/infrastructure/email/resend-client';
import { ResendPasswordResetSender } from '@/modules/auth/infrastructure/email/resend-password-reset-sender';
import { RequestPasswordResetUseCase } from '@/modules/auth/application/use-cases/request-password-reset.use-case';
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

describe('R8: forgot-password devuelve 429 tras agotar el cupo del email', () => {
  const runId = Date.now();
  const execute = jest.fn(() => Promise.resolve());
  let app: INestApplication<App>;

  const api = () => request(app.getHttpServer());

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(RequestPasswordResetUseCase)
      .useValue({ execute })
      .compile();

    app = module.createNestApplication();
    app.setGlobalPrefix('v1');
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('bloquea el cuarto intento antes de ejecutar el caso de uso', async () => {
    const email = `delivery-r8-${runId}@example.com`;

    for (let attempt = 0; attempt < 3; attempt++) {
      await api().post('/v1/auth/forgot-password').send({ email }).expect(200);
    }

    await api()
      .post('/v1/auth/forgot-password')
      .send({ email: email.toUpperCase() })
      .expect(429);
    expect(execute).toHaveBeenCalledTimes(3);
  });
});

describe('R12: con EMAIL_ENABLED por defecto los flujos de #44 siguen intactos', () => {
  const runId = Date.now();
  const userIds: string[] = [];
  const logged: unknown[][] = [];
  let app: INestApplication<App>;
  let db: NodePgDatabase;

  const api = () => request(app.getHttpServer());

  function consoleToken(event: string, email: string): string {
    for (const [entry] of [...logged].reverse()) {
      if (typeof entry !== 'string') {
        continue;
      }

      let payload: unknown;
      try {
        payload = JSON.parse(entry);
      } catch {
        continue;
      }

      if (
        typeof payload === 'object' &&
        payload !== null &&
        'event' in payload &&
        payload.event === event &&
        'email' in payload &&
        payload.email === email &&
        'token' in payload &&
        typeof payload.token === 'string'
      ) {
        return payload.token;
      }
    }

    throw new Error(`No console token captured for ${event} and ${email}`);
  }

  beforeAll(async () => {
    jest
      .spyOn(Logger.prototype, 'log')
      .mockImplementation((message: unknown, ...optionalParams: unknown[]) => {
        logged.push([message, ...optionalParams]);
      });
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    app.setGlobalPrefix('v1');
    await app.init();
    db = app.get<NodePgDatabase>(DRIZZLE);
  });

  afterAll(async () => {
    if (userIds.length > 0) {
      await db
        .delete(passwordResetTokens)
        .where(inArray(passwordResetTokens.userId, userIds));
      await db
        .delete(emailVerificationTokens)
        .where(inArray(emailVerificationTokens.userId, userIds));
      await db.delete(auditLog).where(inArray(auditLog.userId, userIds));
      await db.delete(users).where(inArray(users.id, userIds));
    }
    await app.close();
    jest.restoreAllMocks();
  });

  it('registra, verifica, solicita reset y completa el reset por consola', async () => {
    expect(app.get(EMAIL_VERIFICATION_SENDER)).toBeInstanceOf(
      ConsoleEmailVerificationSender,
    );
    expect(app.get(PASSWORD_RESET_SENDER)).toBeInstanceOf(
      ConsolePasswordResetSender,
    );

    const email = `delivery-r12-${runId}@example.com`;
    const registration = await api()
      .post('/v1/auth/register')
      .send({
        firstName: 'E2e',
        lastName: 'R12',
        email,
        phone: '+525512345678',
        password: 'OldPassword1!',
        passwordConfirmation: 'OldPassword1!',
        country: 'MX',
        timezone: 'UTC',
        termsAccepted: true,
      })
      .expect(201);
    const userId = (registration.body as { id: string }).id;
    userIds.push(userId);

    const verificationToken = consoleToken(
      'auth.email_verification.issued',
      email,
    );
    const verification = await api()
      .post('/v1/auth/verify-email')
      .send({ token: verificationToken })
      .expect(200);
    expect(verification.body).toEqual({ verified: true });

    const forgot = await api()
      .post('/v1/auth/forgot-password')
      .send({ email })
      .expect(200);
    expect(forgot.body).toEqual({ requested: true });
    const resetToken = consoleToken('auth.password_reset.issued', email);

    const reset = await api()
      .post('/v1/auth/reset-password')
      .send({
        token: resetToken,
        password: 'NewPassword1!',
        passwordConfirmation: 'NewPassword1!',
      })
      .expect(200);
    expect(reset.body).toEqual({ reset: true });
  });
});
