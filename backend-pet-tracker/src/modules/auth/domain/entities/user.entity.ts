export const DEFAULT_TIMEZONE = 'UTC';

export interface UserProps {
  id: string;
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  phone: string;
  country: string;
  timezone: string;
  termsAcceptedAt: Date;
  emailVerifiedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

/** Entidad de dominio pura: sin decoradores ni tipos de ORM/framework. */
export class User {
  readonly id: string;
  readonly email: string;
  readonly passwordHash: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly phone: string;
  readonly country: string;
  readonly timezone: string;
  readonly termsAcceptedAt: Date;
  readonly emailVerifiedAt: Date | null;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor(props: UserProps) {
    this.id = props.id;
    this.email = props.email;
    this.passwordHash = props.passwordHash;
    this.firstName = props.firstName;
    this.lastName = props.lastName;
    this.phone = props.phone;
    this.country = props.country;
    this.timezone = props.timezone;
    this.termsAcceptedAt = props.termsAcceptedAt;
    this.emailVerifiedAt = props.emailVerifiedAt;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  isEmailVerified(): boolean {
    return this.emailVerifiedAt !== null;
  }
}

/**
 * El email es el identificador de login: se compara y se persiste normalizado
 * para que el duplicado sea detectable sin depender del case (R2).
 */
export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}
