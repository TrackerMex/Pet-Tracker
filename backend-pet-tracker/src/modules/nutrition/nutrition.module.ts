import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UpsertNutritionProfileUseCase } from '@/modules/nutrition/application/use-cases/upsert-nutrition-profile.use-case';
import { GetNutritionProfileUseCase } from '@/modules/nutrition/application/use-cases/get-nutrition-profile.use-case';
import { GenerateNutritionPlanUseCase } from '@/modules/nutrition/application/use-cases/generate-nutrition-plan.use-case';
import { GetNutritionPlanUseCase } from '@/modules/nutrition/application/use-cases/get-nutrition-plan.use-case';
import { NUTRITION_REPOSITORY } from '@/modules/nutrition/domain/repositories/nutrition.repository';
import { NutritionController } from '@/modules/nutrition/infrastructure/nutrition.controller';
import { NutritionDrizzleRepository } from '@/modules/nutrition/infrastructure/repositories/nutrition.drizzle.repository';
import { PetsModule } from '@/modules/pets/pets.module';
import { NUTRITION_EXPLAINER } from '@/modules/nutrition/domain/ports/nutrition-explainer';
import { createNutritionExplainer } from '@/modules/nutrition/infrastructure/ai/nutrition-explainer.factory';

@Module({
  imports: [ConfigModule, PetsModule],
  controllers: [NutritionController],
  providers: [
    {
      provide: NUTRITION_EXPLAINER,
      useFactory: createNutritionExplainer,
      inject: [ConfigService],
    },
    UpsertNutritionProfileUseCase,
    GetNutritionProfileUseCase,
    GenerateNutritionPlanUseCase,
    GetNutritionPlanUseCase,
    {
      provide: NUTRITION_REPOSITORY,
      useClass: NutritionDrizzleRepository,
    },
  ],
})
export class NutritionModule {}
