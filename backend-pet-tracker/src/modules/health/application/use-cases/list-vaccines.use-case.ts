import { Inject, Injectable } from '@nestjs/common';
import { PetVaccine } from '@/modules/health/domain/entities/vaccine.entity';
import { VACCINE_REPOSITORY } from '@/modules/health/domain/repositories/vaccine.repository';
import type { VaccineRepository } from '@/modules/health/domain/repositories/vaccine.repository';

@Injectable()
export class ListVaccinesUseCase {
  constructor(
    @Inject(VACCINE_REPOSITORY) private readonly vaccines: VaccineRepository,
  ) {}

  execute(petId: string): Promise<PetVaccine[]> {
    return this.vaccines.listByPet(petId);
  }
}
