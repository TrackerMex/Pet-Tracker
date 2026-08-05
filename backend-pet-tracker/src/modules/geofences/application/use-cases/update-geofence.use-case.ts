import { Inject, Injectable } from '@nestjs/common';
import { AUDIT_LOGGER } from '@/audit/audit-log.repository';
import type { AuditLogger } from '@/audit/audit-log.repository';
import { Geofence } from '@/modules/geofences/domain/entities/geofence.entity';
import { GeofenceNotFoundError } from '@/modules/geofences/domain/errors/geofence.errors';
import { GEOFENCE_REPOSITORY } from '@/modules/geofences/domain/repositories/geofence.repository';
import type { GeofenceRepository } from '@/modules/geofences/domain/repositories/geofence.repository';
import { UpdateGeofenceDto } from '../dto/create-geofence.dto';

/** UUID sintacticamente valido, cualquier version — mismo patron que PetAccessGuard. */
const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * PATCH /v1/pets/:petId/geofences/:geofenceId (R10, R12, R13). La existencia
 * se verifica una sola vez antes de ramificar: asi el 404 de R12 precede
 * siempre al no-op de R13, sin duplicar la consulta. Body sin claves
 * reconocidas es no-op explicito: ni se escribe, ni se audita (mismo patron
 * que UpdatePetUseCase).
 */
@Injectable()
export class UpdateGeofenceUseCase {
  constructor(
    @Inject(GEOFENCE_REPOSITORY)
    private readonly geofences: GeofenceRepository,
    @Inject(AUDIT_LOGGER)
    private readonly auditLogger: AuditLogger,
  ) {}

  async execute(
    petId: string,
    geofenceId: string,
    userId: string,
    dto: UpdateGeofenceDto,
  ): Promise<Geofence> {
    if (!UUID_PATTERN.test(geofenceId)) {
      throw new GeofenceNotFoundError(geofenceId);
    }

    const existing = await this.geofences.findByIdAndPet(geofenceId, petId);

    if (!existing) {
      throw new GeofenceNotFoundError(geofenceId);
    }

    const fieldsPresent = Object.keys(dto) as (keyof UpdateGeofenceDto)[];

    if (fieldsPresent.length === 0) {
      // R13: no-op explicito — ni se escribe en geofences, ni se audita.
      return existing;
    }

    const updated = await this.geofences.update(geofenceId, dto);

    await this.auditLogger.record({
      userId,
      action: 'geofence.update',
      entity: 'geofence',
      entityId: geofenceId,
      // R10: solo nombres de campo, nunca los valores.
      meta: { petId, fields: fieldsPresent },
    });

    return updated;
  }
}
