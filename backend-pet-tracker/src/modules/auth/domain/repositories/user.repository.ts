import { User } from '../entities/user.entity';

export const USER_REPOSITORY = Symbol('UserRepository');

/**
 * Datos de negocio de un usuario nuevo. El `id` no viaja aqui: lo genera el
 * repositorio (UUIDv7 en la app, ver docs/data-model.md), igual que
 * created_at/updated_at, que son responsabilidad de la persistencia.
 */
export interface NewUser {
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  phone: string;
  country: string;
  timezone: string;
  termsAcceptedAt: Date;
}

export interface UserRepository {
  existsByEmail(email: string): Promise<boolean>;
  create(user: NewUser): Promise<User>;
  markEmailVerified(userId: string, verifiedAt: Date): Promise<void>;
}
