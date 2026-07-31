/**
 * Token que no corresponde a ninguno emitido, o que ya fue consumido (R9, R11):
 * ambos casos son indistinguibles para el cliente a proposito.
 */
export class InvalidVerificationTokenError extends Error {
  constructor() {
    super('Invalid email verification token');
    this.name = 'InvalidVerificationTokenError';
  }
}

/** Token emitido y no usado, pero fuera de su ventana de vigencia (R10). */
export class VerificationTokenExpiredError extends Error {
  constructor() {
    super('Email verification token expired');
    this.name = 'VerificationTokenExpiredError';
  }
}
