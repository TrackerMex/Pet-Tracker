import { Inject, Injectable } from '@nestjs/common';
import { AUDIT_LOGGER } from '@/audit/audit-log.repository';
import type { AuditLogger } from '@/audit/audit-log.repository';
import { DeviceNotAssignedError } from '@/modules/devices/domain/errors/device.errors';
import { DEVICE_REPOSITORY } from '@/modules/devices/domain/repositories/device.repository';
import type { DeviceRepository } from '@/modules/devices/domain/repositories/device.repository';

/**
 * DELETE /v1/pets/:petId/device (R13, R14). La autorizacion ya corrio en
 * PetAccessGuard + @RequirePetRole('owner'): aqui solo queda el estado del
 * collar. Liberar lo que no existe si es error del cliente (404
 * DEVICE_NOT_ASSIGNED) — a diferencia del GET, que responde null.
 */
@Injectable()
export class ReleaseDeviceUseCase {
  constructor(
    @Inject(DEVICE_REPOSITORY)
    private readonly devices: DeviceRepository,
    @Inject(AUDIT_LOGGER)
    private readonly auditLogger: AuditLogger,
  ) {}

  async execute(petId: string, userId: string): Promise<void> {
    const active = await this.devices.findActiveByPetId(petId);

    if (!active) {
      throw new DeviceNotAssignedError(petId);
    }

    // R13: released_at + status 'available' en una transaccion del repo.
    await this.devices.release(active.assignmentId, active.device.id);

    // R13: auditoria tras el commit; meta lleva petId, como en el claim.
    await this.auditLogger.record({
      userId,
      action: 'device.release',
      entity: 'device',
      entityId: active.device.id,
      meta: { petId },
    });
  }
}
