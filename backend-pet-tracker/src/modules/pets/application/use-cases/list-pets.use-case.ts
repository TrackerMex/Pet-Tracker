import { Inject, Injectable } from '@nestjs/common';
import { PET_PHOTO_URL_RESOLVER } from '@/modules/pets/domain/ports/pet-photo-url-resolver';
import type { PetPhotoUrlResolver } from '@/modules/pets/domain/ports/pet-photo-url-resolver';
import { PET_REPOSITORY } from '@/modules/pets/domain/repositories/pet.repository';
import type {
  PetRepository,
  PetWithRole,
} from '@/modules/pets/domain/repositories/pet.repository';
import { PHOTO_DOWNLOAD_URL_EXPIRES_IN_SECONDS } from './get-pet.use-case';

/** Elemento del listado (#66 R1): membresia + photoUrl resuelto o null. */
export interface PetListItem extends PetWithRole {
  photoUrl: string | null;
}

/**
 * GET /v1/pets (R7): exclusivamente las mascotas con membresia activa del
 * usuario; sin membresias el resultado es un array vacio, nunca un error.
 * #66 R1: resuelve `photoUrl` via PET_PHOTO_URL_RESOLVER solo cuando
 * `photoKey` no es nulo, con la misma condicion y constante que GetPetUseCase.
 */
@Injectable()
export class ListPetsUseCase {
  constructor(
    @Inject(PET_REPOSITORY)
    private readonly pets: PetRepository,
    @Inject(PET_PHOTO_URL_RESOLVER)
    private readonly photoUrlResolver: PetPhotoUrlResolver,
  ) {}

  async execute(userId: string): Promise<PetListItem[]> {
    const memberships = await this.pets.findAllByMember(userId);

    return Promise.all(
      memberships.map(async ({ pet, role }) => ({
        pet,
        role,
        photoUrl:
          pet.photoKey !== null
            ? await this.photoUrlResolver.resolveDownloadUrl(
                pet.photoKey,
                PHOTO_DOWNLOAD_URL_EXPIRES_IN_SECONDS,
              )
            : null,
      })),
    );
  }
}
