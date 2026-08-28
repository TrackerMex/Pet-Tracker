/** Token inexistente o ya consumido: ambos son indistinguibles a proposito. */
export class InvalidPasswordResetTokenError extends Error {
  constructor() {
    super('Invalid password reset token');
    this.name = 'InvalidPasswordResetTokenError';
  }
}
