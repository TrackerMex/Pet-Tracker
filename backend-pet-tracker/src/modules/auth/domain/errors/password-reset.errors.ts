/** Token inexistente o ya consumido: ambos son indistinguibles a proposito. */
export class InvalidPasswordResetTokenError extends Error {
  constructor() {
    super('Invalid password reset token');
    this.name = 'InvalidPasswordResetTokenError';
  }
}

/** Token emitido y sin usar, pero fuera de su ventana de vigencia. */
export class PasswordResetTokenExpiredError extends Error {
  constructor() {
    super('Password reset token expired');
    this.name = 'PasswordResetTokenExpiredError';
  }
}
