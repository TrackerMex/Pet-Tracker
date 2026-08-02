import { Inject, Injectable } from '@nestjs/common';
import { Device } from '@/modules/devices/domain/entities/device.entity';
import { DEVICE_REPOSITORY } from '@/modules/devices/domain/repositories/device.repository';
import type { DeviceRepository } from '@/modules/devices/domain/repositories/device.repository';

/**
 * GET /v1/pets/:petId/device (R11). La autorizacion ya corrio en
 * PetAccessGuard (cualquier rol activo — sin @RequirePetRole). "Sin collar"
 * es un estado normal del recurso singular, no un error: null, nunca 404.
 */
@Injectable()
export class GetPetDeviceUseCase {
  constructor(
    @Inject(DEVICE_REPOSITORY)
    private readonly devices: DeviceRepository,
  ) {}

  async execute(petId: string): Promise<Device | null> {
    const active = await this.devices.findActiveByPetId(petId);

    return active ? active.device : null;
  }
}
