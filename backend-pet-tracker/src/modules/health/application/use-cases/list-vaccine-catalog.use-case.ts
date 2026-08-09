import { Inject, Injectable } from '@nestjs/common';
import {
  VaccineCatalogEntry,
  VaccineSpecies,
} from '@/modules/health/domain/entities/vaccine.entity';
import { VACCINE_REPOSITORY } from '@/modules/health/domain/repositories/vaccine.repository';
import type { VaccineRepository } from '@/modules/health/domain/repositories/vaccine.repository';

@Injectable()
export class ListVaccineCatalogUseCase {
  constructor(
    @Inject(VACCINE_REPOSITORY) private readonly vaccines: VaccineRepository,
  ) {}

  execute(species: VaccineSpecies): Promise<VaccineCatalogEntry[]> {
    return this.vaccines.listCatalog(species);
  }
}
