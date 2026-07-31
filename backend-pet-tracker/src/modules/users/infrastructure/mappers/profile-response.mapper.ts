import { User } from '@/modules/auth/domain/entities/user.entity';

export interface ProfileResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  country: string;
  timezone: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Lista explicita de campos permitidos (R15): distinta de
 * modules/auth/infrastructure/mappers/user-response.mapper.ts porque el
 * perfil editable expone `updatedAt`, irrelevante en la respuesta de
 * registro.
 */
export function toProfileResponse(user: User): ProfileResponse {
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    phone: user.phone,
    country: user.country,
    timezone: user.timezone,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };
}
