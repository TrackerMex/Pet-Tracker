import { Inject, Injectable } from '@nestjs/common';
import { Pet } from '@/modules/pets/domain/entities/pet.entity';
import { PetNotFoundError } from '@/modules/pets/domain/errors/pet.errors';
import { PET_REPOSITORY } from '@/modules/pets/domain/repositories/pet.repository';
import type { PetRepository } from '@/modules/pets/domain/repositories/pet.repository';

/**
 * GET /v1/pets/:petId (R8). La autorizacion ya corrio en PetAccessGuard
 * (R9-R12): aqui solo queda el caso borde de la fila borrada entre el guard
 * y esta consulta.
 */
@Injectable()
export class GetPetUseCase {
  constructor(
    @Inject(PET_REPOSITORY)
    private readonly pets: PetRepository,
  ) {}

  async execute(petId: string): Promise<Pet> {
    const pet = await this.pets.findById(petId);

    if (!pet) {
      throw new PetNotFoundError(petId);
    }

    return pet;
  }
}
