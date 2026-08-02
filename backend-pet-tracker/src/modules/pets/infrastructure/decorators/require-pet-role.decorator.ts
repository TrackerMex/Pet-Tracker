import { SetMetadata } from '@nestjs/common';
import { PetRole } from '@/modules/pets/domain/entities/pet-membership';

export const PET_ROLES_KEY = 'petRoles';

/**
 * Roles de membresia exigidos por un handler protegido con PetAccessGuard
 * (R11). Mismo patron que @Public(): SetMetadata leida con
 * Reflector.getAllAndOverride. Varargs para las features de salud futuras
 * (ej. @RequirePetRole('owner', 'vet')). Sin decorador, cualquier rol
 * activo pasa (R12).
 */
export const RequirePetRole = (...roles: PetRole[]) =>
  SetMetadata(PET_ROLES_KEY, roles);
