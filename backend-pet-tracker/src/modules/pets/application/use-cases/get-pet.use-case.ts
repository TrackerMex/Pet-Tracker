import { Inject, Injectable } from '@nestjs/common';
import { Pet } from '@/modules/pets/domain/entities/pet.entity';
import { PetNotFoundError } from '@/modules/pets/domain/errors/pet.errors';
import { PET_DEVICE_READER } from '@/modules/pets/domain/ports/pet-device-reader';
import type {
  ActivePetDeviceStatus,
  PetDeviceReader,
} from '@/modules/pets/domain/ports/pet-device-reader';
import { PET_REPOSITORY } from '@/modules/pets/domain/repositories/pet.repository';
import type { PetRepository } from '@/modules/pets/domain/repositories/pet.repository';

/** Perfil de detalle: la ficha + el collar activo o null (R8 + R12 de #7). */
export interface PetProfile {
  pet: Pet;
  device: ActivePetDeviceStatus | null;
}

/**
 * GET /v1/pets/:petId (R8). La autorizacion ya corrio en PetAccessGuard
 * (R9-R12): aqui solo queda el caso borde de la fila borrada entre el guard
 * y esta consulta. Desde devices-claim (#7 R12) el perfil incluye el collar
 * activo via el puerto PET_DEVICE_READER.
 */
@Injectable()
export class GetPetUseCase {
  constructor(
    @Inject(PET_REPOSITORY)
    private readonly pets: PetRepository,
    @Inject(PET_DEVICE_READER)
    private readonly deviceReader: PetDeviceReader,
  ) {}

  async execute(petId: string): Promise<PetProfile> {
    const pet = await this.pets.findById(petId);

    if (!pet) {
      throw new PetNotFoundError(petId);
    }

    return { pet, device: await this.deviceReader.findActiveDevice(petId) };
  }
}
