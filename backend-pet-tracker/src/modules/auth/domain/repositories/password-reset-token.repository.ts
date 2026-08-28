export const PASSWORD_RESET_TOKEN_REPOSITORY = Symbol(
  'PasswordResetTokenRepository',
);

export interface NewPasswordResetToken {
  userId: string;
  /** SHA-256 hex del token; el valor en claro no entra a persistencia. */
  tokenHash: string;
  expiresAt: Date;
}

export interface PasswordResetTokenRepository {
  create(token: NewPasswordResetToken): Promise<void>;
}
