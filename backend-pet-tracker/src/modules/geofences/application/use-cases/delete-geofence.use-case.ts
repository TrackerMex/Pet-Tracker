import { Inject, Injectable } from '@nestjs/common';
import { AUDIT_LOGGER } from '@/audit/audit-log.repository';
import type { AuditLogger } from '@/audit/audit-log.repository';
import { GeofenceNotFoundError } from '@/modules/geofences/domain/errors/geofence.errors';
import { GEOFENCE_REPOSITORY } from '@/modules/geofences/domain/repositories/geofence.repository';
import type { GeofenceRepository } from '@/modules/geofences/domain/repositories/geofence.repository';

/** UUID sintacticamente valido, cualquier version — mismo patron que PetAccessGuard. */
const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * DELETE /v1/pets/:petId/geofences/:geofenceId (R14, R15). Hard delete: nada
 * referencia todavia a `geofences`, no hay cascada que disparar.
 */
@Injectable()
export class DeleteGeofenceUseCase {
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
  ): Promise<void> {
    if (!UUID_PATTERN.test(geofenceId)) {
      throw new GeofenceNotFoundError(geofenceId);
    }

    const existing = await this.geofences.findByIdAndPet(geofenceId, petId);

    if (!existing) {
      throw new GeofenceNotFoundError(geofenceId);
    }

    await this.geofences.delete(geofenceId);

    await this.auditLogger.record({
      userId,
      action: 'geofence.delete',
      entity: 'geofence',
      entityId: geofenceId,
      meta: { petId },
    });
  }
}
