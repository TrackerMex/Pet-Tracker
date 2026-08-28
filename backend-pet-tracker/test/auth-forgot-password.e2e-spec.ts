import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { eq, inArray } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import request, { Response } from 'supertest';
import { App } from 'supertest/types';
import { uuidv7 } from 'uuidv7';
import { auditLog } from '@/db/schema/audit-log.schema';
import { passwordResetTokens } from '@/db/schema/password-reset-tokens.schema';
import { users } from '@/db/schema/users.schema';
import { DRIZZLE } from '@/db/drizzle.constants';
import { EMAIL_VERIFICATION_SENDER } from '@/modules/auth/domain/ports/email-verification-sender';
import type { EmailVerificationMessage } from '@/modules/auth/domain/ports/email-verification-sender';
import { PASSWORD_HASHER } from '@/modules/auth/domain/ports/password-hasher';
import type { PasswordHasher } from '@/modules/auth/domain/ports/password-hasher';
import { PASSWORD_RESET_SENDER } from '@/modules/auth/domain/ports/password-reset-sender';
import type { PasswordResetMessage } from '@/modules/auth/domain/ports/password-reset-sender';
import { hashVerificationToken } from '@/modules/auth/application/verification-token';
import { AppModule } from '../src/app.module';

interface ForgotPasswordBody {
  requested: true;
}

interface ResetPasswordBody {
  reset: true;
}

interface LoginBody {
  access_token: string;
}

interface RegisterBody {
  id: string;
  email: string;
}

function forgotPasswordBody(response: Response): ForgotPasswordBody {
  return response.body as ForgotPasswordBody;
}

function resetPasswordBody(response: Response): ResetPasswordBody {
  return response.body as ResetPasswordBody;
}

function loginBody(response: Response): LoginBody {
  return response.body as LoginBody;
}

function registerBody(response: Response): RegisterBody {
  return response.body as RegisterBody;
}

describe('Auth forgot password (e2e)', () => {
  const runId = Date.now();
  const userIds: string[] = [];
  const sentMessages: PasswordResetMessage[] = [];
  const verificationMessages: EmailVerificationMessage[] = [];
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

  async function requestResetToken(email: string): Promise<string> {
    await api().post('/v1/auth/forgot-password').send({ email }).expect(200);

    const message = [...sentMessages]
      .reverse()
      .find((candidate) => candidate.email === email);
    if (!message) {
      throw new Error(`No reset token captured for ${email}`);
    }

    return message.token;
  }

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
      .overrideProvider(EMAIL_VERIFICATION_SENDER)
      .useValue({
        send: (message: EmailVerificationMessage) => {
          verificationMessages.push(message);
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
        body: forgotPasswordBody(missingResponse),
      }).toEqual({
        status: existingResponse.status,
        body: forgotPasswordBody(existingResponse),
      });
      expect(existingResponse.status).toBe(200);
      expect(forgotPasswordBody(existingResponse)).toEqual({ requested: true });
    });
  });

  describe('R4: el token anterior deja de servir cuando se pide uno nuevo', () => {
    it('marca el token previo como usado y deja solo el ultimo vigente', async () => {
      const user = await seedUser('r4');
      const firstToken = await requestResetToken(user.email);
      const secondToken = await requestResetToken(user.email);

      expect(secondToken).not.toBe(firstToken);
      const rows = await db
        .select()
        .from(passwordResetTokens)
        .where(eq(passwordResetTokens.userId, user.id));
      const firstRow = rows.find(
        (row) => row.tokenHash === hashVerificationToken(firstToken),
      );
      const secondRow = rows.find(
        (row) => row.tokenHash === hashVerificationToken(secondToken),
      );

      expect(firstRow?.usedAt).toBeInstanceOf(Date);
      expect(secondRow?.usedAt).toBeNull();
    });
  });

  describe('R5: el reset persiste un password_hash nuevo y consume el token', () => {
    it('reemplaza el hash y marca usado el token presentado', async () => {
      const user = await seedUser('r5');
      const token = await requestResetToken(user.email);
      const [before] = await db
        .select({ passwordHash: users.passwordHash })
        .from(users)
        .where(eq(users.id, user.id));

      const response = await api()
        .post('/v1/auth/reset-password')
        .send({
          token,
          password: 'NewPassword1!',
          passwordConfirmation: 'NewPassword1!',
        })
        .expect(200);

      expect(resetPasswordBody(response)).toEqual({ reset: true });
      const [after] = await db
        .select({ passwordHash: users.passwordHash })
        .from(users)
        .where(eq(users.id, user.id));
      expect(after.passwordHash).not.toBe(before.passwordHash);
      await expect(
        passwordHasher.verify('NewPassword1!', after.passwordHash),
      ).resolves.toBe(true);

      const [storedToken] = await db
        .select()
        .from(passwordResetTokens)
        .where(eq(passwordResetTokens.tokenHash, hashVerificationToken(token)));
      expect(storedToken.usedAt).toBeInstanceOf(Date);
    });
  });

  describe('R9: tras el reset el login viejo falla y el nuevo funciona', () => {
    it('verifica el hash nuevo con el mismo adaptador usado por login', async () => {
      const user = await seedUser('r9');
      const token = await requestResetToken(user.email);
      const newPassword = 'RoundTripPassword1!';

      await api()
        .post('/v1/auth/reset-password')
        .send({
          token,
          password: newPassword,
          passwordConfirmation: newPassword,
        })
        .expect(200);

      await api()
        .post('/v1/auth/login')
        .send({ email: user.email, password: user.password })
        .expect(401);
      const newLogin = await api()
        .post('/v1/auth/login')
        .send({ email: user.email, password: newPassword })
        .expect(200);

      expect(typeof loginBody(newLogin).access_token).toBe('string');
      expect(loginBody(newLogin).access_token.length).toBeGreaterThan(0);
    });
  });

  describe('R13: el flujo de verify-email sigue intacto tras anadir el reset', () => {
    it('mantiene separados los tokens y permite completar ambos flujos', async () => {
      const email = `forgot-r13-${runId}@example.com`;
      const registration = await api()
        .post('/v1/auth/register')
        .send({
          firstName: 'E2e',
          lastName: 'R13',
          email,
          phone: '+525512345678',
          password: 'OldPassword1!',
          passwordConfirmation: 'OldPassword1!',
          country: 'MX',
          timezone: 'UTC',
          termsAccepted: true,
        })
        .expect(201);
      userIds.push(registerBody(registration).id);
      const verificationToken = verificationMessages.find(
        (message) => message.email === email,
      )?.token;
      if (!verificationToken) {
        throw new Error(`No verification token captured for ${email}`);
      }
      const resetToken = await requestResetToken(email);

      await api()
        .post('/v1/auth/reset-password')
        .send({
          token: verificationToken,
          password: 'WrongFlowPassword1!',
          passwordConfirmation: 'WrongFlowPassword1!',
        })
        .expect(400);
      await api()
        .post('/v1/auth/verify-email')
        .send({ token: resetToken })
        .expect(400);

      await api()
        .post('/v1/auth/verify-email')
        .send({ token: verificationToken })
        .expect(200);
      await api()
        .post('/v1/auth/reset-password')
        .send({
          token: resetToken,
          password: 'RightFlowPassword1!',
          passwordConfirmation: 'RightFlowPassword1!',
        })
        .expect(200);
    });
  });
});
