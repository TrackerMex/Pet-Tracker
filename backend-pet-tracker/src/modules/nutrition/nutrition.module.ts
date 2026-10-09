import { ConfigModule, ConfigService } from '@nestjs/config';
import { SubscriptionsModule } from '@/modules/subscriptions/subscriptions.module';
import { NUTRITION_EXPLAINER } from '@/modules/nutrition/domain/ports/nutrition-explainer';
import { createNutritionExplainer } from '@/modules/nutrition/infrastructure/ai/nutrition-explainer.factory';
import { GetMealsHistoryUseCase } from '@/modules/nutrition/application/use-cases/get-meals-history.use-case';
import { MoveMealTimeUseCase } from '@/modules/nutrition/application/use-cases/move-meal-time.use-case';
import { AddMealTimeUseCase } from '@/modules/nutrition/application/use-cases/add-meal-time.use-case';
import { Module } from '@nestjs/common';
import { UpsertNutritionProfileUseCase } from '@/modules/nutrition/application/use-cases/upsert-nutrition-profile.use-case';
import { GetNutritionProfileUseCase } from '@/modules/nutrition/application/use-cases/get-nutrition-profile.use-case';
import { GenerateNutritionPlanUseCase } from '@/modules/nutrition/application/use-cases/generate-nutrition-plan.use-case';
import { GetNutritionPlanUseCase } from '@/modules/nutrition/application/use-cases/get-nutrition-plan.use-case';
import { ServeMealUseCase } from '@/modules/nutrition/application/use-cases/serve-meal.use-case';
import { UnserveMealUseCase } from '@/modules/nutrition/application/use-cases/unserve-meal.use-case';
import { MEAL_SERVING_REPOSITORY } from '@/modules/nutrition/domain/repositories/meal-serving.repository';
import { NUTRITION_REPOSITORY } from '@/modules/nutrition/domain/repositories/nutrition.repository';
import { NutritionController } from '@/modules/nutrition/infrastructure/nutrition.controller';
import { MealsController } from '@/modules/nutrition/infrastructure/meals.controller';
import { MealServingDrizzleRepository } from '@/modules/nutrition/infrastructure/repositories/meal-serving.drizzle.repository';
import { NutritionDrizzleRepository } from '@/modules/nutrition/infrastructure/repositories/nutrition.drizzle.repository';
import { PetsModule } from '@/modules/pets/pets.module';

@Module({
  imports: [PetsModule, SubscriptionsModule, ConfigModule],
  controllers: [NutritionController, MealsController],
  providers: [
    {
      provide: NUTRITION_EXPLAINER,
      useFactory: createNutritionExplainer,
      inject: [ConfigService],
    },
    GetMealsHistoryUseCase,
    MoveMealTimeUseCase,
    AddMealTimeUseCase,
    UpsertNutritionProfileUseCase,
    GetNutritionProfileUseCase,
    GenerateNutritionPlanUseCase,
    GetNutritionPlanUseCase,
    ServeMealUseCase,
    UnserveMealUseCase,
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
