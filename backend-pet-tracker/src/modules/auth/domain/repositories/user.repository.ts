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

/** Subconjunto editable de un perfil vía PATCH /v1/me (auth-login-me R10). */
export interface ProfileFieldChanges {
  firstName?: string;
  lastName?: string;
  phone?: string;
  country?: string;
  timezone?: string;
}

export interface UserRepository {
  existsByEmail(email: string): Promise<boolean>;
  create(user: NewUser): Promise<User>;
  markEmailVerified(userId: string, verifiedAt: Date): Promise<void>;
  /** auth-login-me R1: necesita el password_hash real para verificar. */
  findByEmail(email: string): Promise<User | null>;
  /** auth-login-me R9. */
  findById(id: string): Promise<User | null>;
  /**
   * auth-login-me R10: solo actualiza las columnas presentes en `changes`.
   */
  updateProfile(userId: string, changes: ProfileFieldChanges): Promise<User>;
}
