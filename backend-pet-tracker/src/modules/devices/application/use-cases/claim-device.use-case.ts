import { Inject, Injectable } from '@nestjs/common';
import { AUDIT_LOGGER } from '@/audit/audit-log.repository';
import type { AuditLogger } from '@/audit/audit-log.repository';
import { Device } from '@/modules/devices/domain/entities/device.entity';
import {
  DeviceAlreadyAssignedError,
  DeviceNotFoundError,
  InsufficientPetRoleError,
  PetAlreadyHasDeviceError,
  PetNotAccessibleError,
} from '@/modules/devices/domain/errors/device.errors';
import { DEVICE_REPOSITORY } from '@/modules/devices/domain/repositories/device.repository';
import type { DeviceRepository } from '@/modules/devices/domain/repositories/device.repository';
import { PET_REPOSITORY } from '@/modules/pets/domain/repositories/pet.repository';
import type { PetRepository } from '@/modules/pets/domain/repositories/pet.repository';
import { DeviceNotSubscribedError } from '@/modules/subscriptions/domain/errors/subscription.errors';
import { SUBSCRIPTION_REPOSITORY } from '@/modules/subscriptions/domain/repositories/subscription.repository';
import type { SubscriptionRepository } from '@/modules/subscriptions/domain/repositories/subscription.repository';
import { ClaimDeviceDto, toDeviceIdentifier } from '../dto/claim-device.dto';

/**
 * Arranque de ingesta del poller #8 (plan 005 §Paso 2): el claim fija
 * ingest_watermark en now() menos este lookback (R3).
 */
export const CLAIM_WATERMARK_LOOKBACK_MINUTES = 10;

/**
 * POST /v1/devices/claim (R3, R5-R10). La ruta no lleva :petId, asi que
 * PetAccessGuard no aplica (decision D1): la semantica de membresia se
 * replica aqui via PET_REPOSITORY.findMembership() con el orden estricto
 * membresia (404) -> rol (403) -> device (404/409) — un actor sin membresia
 * no aprende nada del estado del device (R5).
 */
@Injectable()
export class ClaimDeviceUseCase {
  constructor(
    @Inject(PET_REPOSITORY)
    private readonly pets: PetRepository,
    @Inject(DEVICE_REPOSITORY)
    private readonly devices: DeviceRepository,
    @Inject(AUDIT_LOGGER)
    private readonly auditLogger: AuditLogger,
    @Inject(SUBSCRIPTION_REPOSITORY)
    private readonly subscriptions: SubscriptionRepository,
  ) {}

  async execute(dto: ClaimDeviceDto, userId: string): Promise<Device> {
    // R5: membresia primero — antes de cualquier consulta sobre devices.
    const membership = await this.pets.findMembership(dto.petId, userId);

    if (!membership || membership.status !== 'active') {
      throw new PetNotAccessibleError(dto.petId);
    }

    // R6: 404 de membresia precede siempre a este 403.
    if (membership.role !== 'owner') {
      throw new InsufficientPetRoleError(dto.petId);
    }

    // R7: la columna del identificador es UNIQUE (D4) — a lo sumo un match.
    const device = await this.devices.findByIdentifier(toDeviceIdentifier(dto));

    if (!device) {
      throw new DeviceNotFoundError();
    }

    // R8: la disponibilidad se deriva de la fila activa (D3); 'inactive'
    // veta por si mismo. El chequeo es cortesia — el candado real es el
    // indice unico parcial dentro de claim().
    if (
      device.status === 'inactive' ||
      (await this.devices.hasActiveAssignment(device.id))
    ) {
      throw new DeviceAlreadyAssignedError(device.id);
    }

    // R9: una mascota lleva a lo sumo un collar activo (D2).
    if (await this.devices.findActiveByPetId(dto.petId)) {
      throw new PetAlreadyHasDeviceError(dto.petId);
    }

    if (!(await this.subscriptions.isDeviceEntitled(device.id))) {
      throw new DeviceNotSubscribedError(device.id);
    }

    const ingestWatermark = new Date(
      Date.now() - CLAIM_WATERMARK_LOOKBACK_MINUTES * 60_000,
    );

    // R3: INSERT pet_devices + UPDATE devices en una transaccion del repo.
    await this.devices.claim(device.id, dto.petId, ingestWatermark);

    // R10: solo tras el commit; meta lleva petId, nunca el identificador.
    await this.auditLogger.record({
      userId,
      action: 'device.claim',
      entity: 'device',
      entityId: device.id,
      meta: { petId: dto.petId },
    });

    return device;
  }
}
