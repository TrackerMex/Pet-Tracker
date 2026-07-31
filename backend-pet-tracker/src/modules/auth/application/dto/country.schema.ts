import { z } from 'zod';

/**
 * ISO 3166-1 alpha-2 en mayusculas. Compartido entre RegisterUserSchema
 * (auth-registration) y UpdateProfileSchema (auth-login-me R12) para no
 * duplicar el regex en dos DTOs (design.md `auth-login-me`).
 */
export const CountrySchema = z
  .string()
  .length(2)
  .regex(/^[A-Z]{2}$/);
