import { Module } from '@nestjs/common';
import { UpsertNutritionProfileUseCase } from '@/modules/nutrition/application/use-cases/upsert-nutrition-profile.use-case';
import { GetNutritionProfileUseCase } from '@/modules/nutrition/application/use-cases/get-nutrition-profile.use-case';
import { GenerateNutritionPlanUseCase } from '@/modules/nutrition/application/use-cases/generate-nutrition-plan.use-case';
import { GetNutritionPlanUseCase } from '@/modules/nutrition/application/use-cases/get-nutrition-plan.use-case';
import { ServeMealUseCase } from '@/modules/nutrition/application/use-cases/serve-meal.use-case';
import { MEAL_SERVING_REPOSITORY } from '@/modules/nutrition/domain/repositories/meal-serving.repository';
import { NUTRITION_REPOSITORY } from '@/modules/nutrition/domain/repositories/nutrition.repository';
import { NutritionController } from '@/modules/nutrition/infrastructure/nutrition.controller';
import { MealsController } from '@/modules/nutrition/infrastructure/meals.controller';
import { MealServingDrizzleRepository } from '@/modules/nutrition/infrastructure/repositories/meal-serving.drizzle.repository';
import { NutritionDrizzleRepository } from '@/modules/nutrition/infrastructure/repositories/nutrition.drizzle.repository';
import { PetsModule } from '@/modules/pets/pets.module';

@Module({
  imports: [PetsModule],
  controllers: [NutritionController, MealsController],
  providers: [
    UpsertNutritionProfileUseCase,
    GetNutritionProfileUseCase,
    GenerateNutritionPlanUseCase,
    GetNutritionPlanUseCase,
    ServeMealUseCase,
    {
      provide: NUTRITION_REPOSITORY,
      useClass: NutritionDrizzleRepository,
    },
    {
      provide: MEAL_SERVING_REPOSITORY,
      useClass: MealServingDrizzleRepository,
    },
  ],
})
export class NutritionModule {}
