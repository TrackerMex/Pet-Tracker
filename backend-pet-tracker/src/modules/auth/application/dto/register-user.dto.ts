import { z } from 'zod';
import { CountrySchema } from './country.schema';

const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 128;

// Politica de password: solo longitud minima (specs/auth-registration/design.md
// — el brief no define reglas de complejidad y no se inventan requisitos).
const passwordSchema = z
  .string()
  .min(MIN_PASSWORD_LENGTH)
  .max(MAX_PASSWORD_LENGTH);

export const RegisterUserSchema = z
  .object({
    firstName: z.string().trim().min(1).max(120),
    lastName: z.string().trim().min(1).max(120),
    email: z.email().max(320),
    phone: z.string().trim().min(7).max(20),
    password: passwordSchema,
    passwordConfirmation: passwordSchema,
    country: CountrySchema,
    // Opcional: el caso de uso persiste 'UTC' si no llega.
    timezone: z.string().trim().min(1).max(64).optional(),
    termsAccepted: z.literal(true),
  })
  .refine((payload) => payload.password === payload.passwordConfirmation, {
    message: 'passwordConfirmation must match password',
    path: ['passwordConfirmation'],
  });

export type RegisterUserDto = z.infer<typeof RegisterUserSchema>;
