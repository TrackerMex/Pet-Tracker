import { Module } from '@nestjs/common';
import { UpsertNutritionProfileUseCase } from '@/modules/nutrition/application/use-cases/upsert-nutrition-profile.use-case';
import { NUTRITION_REPOSITORY } from '@/modules/nutrition/domain/repositories/nutrition.repository';
import { NutritionController } from '@/modules/nutrition/infrastructure/nutrition.controller';
import { NutritionDrizzleRepository } from '@/modules/nutrition/infrastructure/repositories/nutrition.drizzle.repository';
import { PetsModule } from '@/modules/pets/pets.module';

@Module({
  imports: [PetsModule],
  controllers: [NutritionController],
  providers: [
    UpsertNutritionProfileUseCase,
    {
      provide: NUTRITION_REPOSITORY,
      useClass: NutritionDrizzleRepository,
    },
  ],
})
export class NutritionModule {}
