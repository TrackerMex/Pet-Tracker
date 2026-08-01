import { User } from '@/modules/auth/domain/entities/user.entity';

export interface UserResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  country: string;
  timezone: string;
  createdAt: string;
}

/**
 * Lista explicita de campos permitidos (R14): `passwordHash` no llega a la
 * respuesta porque no esta enumerado aqui, no porque se borre despues.
 */
export function toUserResponse(user: User): UserResponse {
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    phone: user.phone,
    country: user.country,
    timezone: user.timezone,
    createdAt: user.createdAt.toISOString(),
  };
}
