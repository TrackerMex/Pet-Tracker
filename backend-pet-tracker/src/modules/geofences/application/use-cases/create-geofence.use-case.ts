import { Inject, Injectable } from '@nestjs/common';
import { AUDIT_LOGGER } from '@/audit/audit-log.repository';
import type { AuditLogger } from '@/audit/audit-log.repository';
import { Geofence } from '@/modules/geofences/domain/entities/geofence.entity';
import {
  GeofenceNameTakenError,
  MaxGeofencesReachedError,
} from '@/modules/geofences/domain/errors/geofence.errors';
import { GEOFENCE_REPOSITORY } from '@/modules/geofences/domain/repositories/geofence.repository';
import type { GeofenceRepository } from '@/modules/geofences/domain/repositories/geofence.repository';
import { GEOFENCE_MAX_PER_PET } from '@/modules/geofences/geofences.constants';
import { CreateGeofenceDto } from '../dto/create-geofence.dto';

/**
 * POST /v1/pets/:petId/geofences (R4, R6, R7). countByPet + findByNameAndPet
 * corren antes del INSERT — misma orquestacion que ClaimDeviceUseCase
 * (membresia -> rol -> disponibilidad -> escritura).
 *
 * ponytail: COUNT + INSERT sin transaccion serializable — dos creaciones
 * concurrentes podrian dejar 6 filas si compiten en el mismo instante;
 * upgrade path: trigger de base o advisory lock por pet_id si la creacion
 * concurrente deja de ser un escenario improbable (D5). El nombre duplicado
 * (R7) si tiene candado real: el indice unico (pet_id, name) de R1, que el
 * repositorio traduce a GeofenceNameTakenError en la carrera.
 */
@Injectable()
export class CreateGeofenceUseCase {
  constructor(
    @Inject(GEOFENCE_REPOSITORY)
    private readonly geofences: GeofenceRepository,
    @Inject(AUDIT_LOGGER)
    private readonly auditLogger: AuditLogger,
  ) {}

  async execute(
    petId: string,
    dto: CreateGeofenceDto,
    userId: string,
  ): Promise<Geofence> {
    const count = await this.geofences.countByPet(petId);

    if (count >= GEOFENCE_MAX_PER_PET) {
      throw new MaxGeofencesReachedError(petId);
    }

    const existing = await this.geofences.findByNameAndPet(petId, dto.name);

    if (existing) {
      throw new GeofenceNameTakenError(petId, dto.name);
    }

    const geofence = await this.geofences.create({
      petId,
      name: dto.name,
      type: dto.type,
      centerLat: dto.centerLat,
      centerLng: dto.centerLng,
      radiusM: dto.radiusM,
      active: dto.active ?? true,
    });

    // R4: solo tras el commit — si el INSERT falla, no se audita nada.
    await this.auditLogger.record({
      userId,
      action: 'geofence.create',
      entity: 'geofence',
      entityId: geofence.id,
      meta: { petId },
    });

    return geofence;
  }
}
