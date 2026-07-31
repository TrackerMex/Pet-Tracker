/** Error de dominio: el email ya pertenece a otro usuario (R2). */
export class EmailAlreadyRegisteredError extends Error {
  constructor(readonly email: string) {
    super(`Email already registered: ${email}`);
    this.name = 'EmailAlreadyRegisteredError';
  }
}

/**
 * Error de dominio generico para login (auth-login-me R2): cubre tanto
 * "email inexistente" como "password incorrecto" bajo el mismo tipo para que
 * el controller no pueda distinguirlos al mapear a HTTP.
 */
export class InvalidCredentialsError extends Error {
  constructor() {
    super('Invalid credentials');
    this.name = 'InvalidCredentialsError';
  }
}

/** Error de dominio: no existe un usuario con el id dado (auth-login-me R9). */
export class UserNotFoundError extends Error {
  constructor(readonly userId: string) {
    super(`User not found: ${userId}`);
    this.name = 'UserNotFoundError';
  }
}
