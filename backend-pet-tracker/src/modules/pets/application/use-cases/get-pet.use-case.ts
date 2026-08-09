import { Inject, Injectable } from '@nestjs/common';
import { Pet } from '@/modules/pets/domain/entities/pet.entity';
import { PetNotFoundError } from '@/modules/pets/domain/errors/pet.errors';
import { PET_DEVICE_READER } from '@/modules/pets/domain/ports/pet-device-reader';
import type {
  ActivePetDeviceStatus,
  PetDeviceReader,
} from '@/modules/pets/domain/ports/pet-device-reader';
import { PET_PHOTO_URL_RESOLVER } from '@/modules/pets/domain/ports/pet-photo-url-resolver';
import type { PetPhotoUrlResolver } from '@/modules/pets/domain/ports/pet-photo-url-resolver';
import { PET_VACCINE_READER } from '@/modules/pets/domain/ports/pet-vaccine-reader';
import type {
  NextPetVaccine,
  PetVaccineReader,
} from '@/modules/pets/domain/ports/pet-vaccine-reader';
import { PET_REPOSITORY } from '@/modules/pets/domain/repositories/pet.repository';
import type { PetRepository } from '@/modules/pets/domain/repositories/pet.repository';

/** Vigencia del GET prefirmado del perfil (R6): exactamente 1 hora. */
export const PHOTO_DOWNLOAD_URL_EXPIRES_IN_SECONDS = 3600;

/** Perfil de detalle: la ficha + el collar activo o null (R8 + R12 de #7). */
export interface PetProfile {
  pet: Pet;
  device: ActivePetDeviceStatus | null;
  /** URL GET prefirmada (R6) o null si la mascota no tiene foto (R7). */
  photoUrl: string | null;
  nextVaccine: NextPetVaccine | null;
}

/**
 * GET /v1/pets/:petId (R8). La autorizacion ya corrio en PetAccessGuard
 * (R9-R12): aqui solo queda el caso borde de la fila borrada entre el guard
 * y esta consulta. Desde devices-claim (#7 R12) el perfil incluye el collar
 * activo via el puerto PET_DEVICE_READER. Desde pet-photos-s3 (#6 R6/R7)
 * resuelve `photoUrl` via PET_PHOTO_URL_RESOLVER solo cuando `photoKey` no
 * es nulo — evita una firma S3 innecesaria cuando no hay foto.
 */
@Injectable()
export class GetPetUseCase {
  constructor(
    @Inject(PET_REPOSITORY)
    private readonly pets: PetRepository,
    @Inject(PET_DEVICE_READER)
    private readonly deviceReader: PetDeviceReader,
    @Inject(PET_PHOTO_URL_RESOLVER)
    private readonly photoUrlResolver: PetPhotoUrlResolver,
    @Inject(PET_VACCINE_READER)
    private readonly vaccineReader: PetVaccineReader,
  ) {}

  async execute(petId: string): Promise<PetProfile> {
    const pet = await this.pets.findById(petId);

    if (!pet) {
      throw new PetNotFoundError(petId);
    }

    const photoUrl =
      pet.photoKey !== null
        ? await this.photoUrlResolver.resolveDownloadUrl(
            pet.photoKey,
            PHOTO_DOWNLOAD_URL_EXPIRES_IN_SECONDS,
          )
        : null;

    return {
      pet,
      device: await this.deviceReader.findActiveDevice(petId),
      photoUrl,
      nextVaccine: await this.vaccineReader.findNextVaccine(
        petId,
        new Date().toISOString().slice(0, 10),
      ),
    };
  }
}
