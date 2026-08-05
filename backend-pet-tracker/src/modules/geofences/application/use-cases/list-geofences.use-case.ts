import { Inject, Injectable } from '@nestjs/common';
import { Geofence } from '@/modules/geofences/domain/entities/geofence.entity';
import { GEOFENCE_REPOSITORY } from '@/modules/geofences/domain/repositories/geofence.repository';
import type { GeofenceRepository } from '@/modules/geofences/domain/repositories/geofence.repository';

/**
 * GET /v1/pets/:petId/geofences (R8): todas las geocercas de la mascota,
 * activas e inactivas, ordenadas por created_at asc. `[]` si no hay
 * ninguna — nunca 404 (ausencia de dato es 200).
 */
@Injectable()
export class ListGeofencesUseCase {
  constructor(
    @Inject(GEOFENCE_REPOSITORY)
    private readonly geofences: GeofenceRepository,
  ) {}

  execute(petId: string): Promise<Geofence[]> {
    return this.geofences.findAllByPet(petId);
  }
}
