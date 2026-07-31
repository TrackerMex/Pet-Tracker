/** Error de dominio: el email ya pertenece a otro usuario (R2). */
export class EmailAlreadyRegisteredError extends Error {
  constructor(readonly email: string) {
    super(`Email already registered: ${email}`);
    this.name = 'EmailAlreadyRegisteredError';
  }
}
