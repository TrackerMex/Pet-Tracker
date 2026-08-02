import { Inject, Injectable } from '@nestjs/common';
import { PET_REPOSITORY } from '@/modules/pets/domain/repositories/pet.repository';
import type {
  PetRepository,
  PetWithRole,
} from '@/modules/pets/domain/repositories/pet.repository';

/**
 * GET /v1/pets (R7): exclusivamente las mascotas con membresia activa del
 * usuario; sin membresias el resultado es un array vacio, nunca un error.
 */
@Injectable()
export class ListPetsUseCase {
  constructor(
    @Inject(PET_REPOSITORY)
    private readonly pets: PetRepository,
  ) {}

  async execute(userId: string): Promise<PetWithRole[]> {
    return this.pets.findAllByMember(userId);
  }
}
