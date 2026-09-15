import { Module } from '@nestjs/common';
import { PetMealsDrizzleReader } from '@/modules/nutrition/infrastructure/repositories/pet-meals.drizzle-reader';
import { PET_MEALS_READER } from '@/modules/pets/domain/ports/pet-meals-reader';

@Module({
  providers: [{ provide: PET_MEALS_READER, useClass: PetMealsDrizzleReader }],
  exports: [PET_MEALS_READER],
})
export class PetMealsReadModule {}
