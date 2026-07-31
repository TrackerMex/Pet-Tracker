import { EmailVerificationToken } from '../entities/email-verification-token.entity';

export const EMAIL_VERIFICATION_TOKEN_REPOSITORY = Symbol(
  'EmailVerificationTokenRepository',
);

export interface NewEmailVerificationToken {
  userId: string;
  /** SHA-256 hex del token; el valor en claro no entra a la persistencia. */
  tokenHash: string;
  expiresAt: Date;
}

export interface EmailVerificationTokenRepository {
  create(token: NewEmailVerificationToken): Promise<void>;
  findByTokenHash(tokenHash: string): Promise<EmailVerificationToken | null>;
  markUsed(id: string, usedAt: Date): Promise<void>;
}
