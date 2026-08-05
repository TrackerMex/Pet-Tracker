import { Inject, Injectable } from '@nestjs/common';
import { Geofence } from '@/modules/geofences/domain/entities/geofence.entity';
import { GeofenceNotFoundError } from '@/modules/geofences/domain/errors/geofence.errors';
import { GEOFENCE_REPOSITORY } from '@/modules/geofences/domain/repositories/geofence.repository';
import type { GeofenceRepository } from '@/modules/geofences/domain/repositories/geofence.repository';

/** UUID sintacticamente valido, cualquier version — mismo patron que PetAccessGuard. */
const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * GET /v1/pets/:petId/geofences/:geofenceId (R9). `:geofenceId` malformado
 * nunca toca la base — Postgres lanzaria un error de sintaxis crudo sobre
 * la columna uuid (docs/conventions.md: nunca un error de pg crudo al
 * cliente). El patron de regex se repite aqui en vez de importarse de
 * `pets/`: R26 prohibe tocar `src/modules/pets/**`.
 */
@Injectable()
export class GetGeofenceUseCase {
  constructor(
    @Inject(GEOFENCE_REPOSITORY)
    private readonly geofences: GeofenceRepository,
  ) {}

  async execute(petId: string, geofenceId: string): Promise<Geofence> {
    if (!UUID_PATTERN.test(geofenceId)) {
      throw new GeofenceNotFoundError(geofenceId);
    }

    const geofence = await this.geofences.findByIdAndPet(geofenceId, petId);

    if (!geofence) {
      throw new GeofenceNotFoundError(geofenceId);
    }

    return geofence;
  }
}
