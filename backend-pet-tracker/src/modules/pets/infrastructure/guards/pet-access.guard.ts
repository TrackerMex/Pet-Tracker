import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthenticatedRequest } from '@/modules/auth/infrastructure/guards/auth.guard';
import { PetRole } from '@/modules/pets/domain/entities/pet-membership';
import { PET_REPOSITORY } from '@/modules/pets/domain/repositories/pet.repository';
import type { PetRepository } from '@/modules/pets/domain/repositories/pet.repository';
import { PET_ROLES_KEY } from '../decorators/require-pet-role.decorator';

/** UUID sintacticamente valido, cualquier version (R10). */
const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export interface PetAccessRequest extends AuthenticatedRequest {
  /** Adjuntado por PetAccessGuard: el handler conoce myRole sin re-consultar. */
  petMembership: { petId: string; role: PetRole };
}

/**
 * Autorizacion por mascota (R9-R12), guard de controller para rutas con
 * `:petId` — el AuthGuard global (APP_GUARD, #4) ya corrio y poblo
 * `request.user`. "Mascota inexistente" y "no eres miembro" son la misma
 * consulta vacia sobre pet_users: el mismo 404 generico sale del mismo
 * camino de codigo, imposible inferir existencia (brief §4). El chequeo de
 * rol (403) solo se alcanza con membresia activa confirmada: 404 precede a
 * 403 siempre.
 */
@Injectable()
export class PetAccessGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @Inject(PET_REPOSITORY) private readonly pets: PetRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<PetAccessRequest>();
    const petId = request.params.petId;

    // R10: un :petId malformado ni siquiera toca la base.
    if (!petId || !UUID_PATTERN.test(petId)) {
      throw new NotFoundException();
    }

    // R9: una sola consulta a pet_users; la FK garantiza que si hay
    // membresia la mascota existe.
    const membership = await this.pets.findMembership(petId, request.user.id);

    if (!membership || membership.status !== 'active') {
      throw new NotFoundException();
    }

    const requiredRoles = this.reflector.getAllAndOverride<
      PetRole[] | undefined
    >(PET_ROLES_KEY, [context.getHandler(), context.getClass()]);

    // R11: rol insuficiente es 403 — el miembro ya conoce la mascota, no
    // hay filtracion de existencia.
    if (
      requiredRoles &&
      requiredRoles.length > 0 &&
      !requiredRoles.includes(membership.role)
    ) {
      throw new ForbiddenException();
    }

    // R12: sin decorador, cualquier rol activo pasa.
    request.petMembership = { petId, role: membership.role };

    return true;
  }
}
