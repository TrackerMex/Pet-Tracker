import { z } from 'zod';
import { CountrySchema } from '@/modules/auth/application/dto/country.schema';

/**
 * Catalogo IANA completo via API nativa de Node (>=18), sin dependencia
 * nueva (design.md `auth-login-me` R11).
 */
const IANA_TIMEZONES = new Set(Intl.supportedValuesOf('timeZone'));

const TimezoneSchema = z.string().refine((value) => IANA_TIMEZONES.has(value), {
  message: 'Invalid IANA timezone',
});

/**
 * PATCH /v1/me (R10, R13): todos los campos opcionales, un body vacio
 * valida (no-op). La validacion completa corre de una sola vez en el borde
 * HTTP antes de invocar el use case (R11, R12: atomico, sin escritura
 * parcial posible ante un campo invalido).
 */
export const UpdateProfileSchema = z
  .object({
    firstName: z.string().trim().min(1).max(120),
    lastName: z.string().trim().min(1).max(120),
    phone: z.string().trim().min(7).max(20),
    country: CountrySchema,
    timezone: TimezoneSchema,
  })
  .partial();

export type UpdateProfileDto = z.infer<typeof UpdateProfileSchema>;
