import { Module } from '@nestjs/common';
import { PET_VACCINE_READER } from '@/modules/pets/domain/ports/pet-vaccine-reader';
import { PetVaccineDrizzleReader } from './infrastructure/repositories/pet-vaccine.drizzle-reader';

@Module({
  providers: [
    { provide: PET_VACCINE_READER, useClass: PetVaccineDrizzleReader },
  ],
  exports: [PET_VACCINE_READER],
})
export class PetVaccineReadModule {}
