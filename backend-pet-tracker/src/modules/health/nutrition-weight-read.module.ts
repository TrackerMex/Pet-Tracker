import { Module } from '@nestjs/common';
import { NUTRITION_WEIGHT_READER } from '@/modules/nutrition/domain/ports/nutrition-weight-reader';
import { NutritionWeightDrizzleReader } from './infrastructure/repositories/nutrition-weight.drizzle-reader';

@Module({
  providers: [
    {
      provide: NUTRITION_WEIGHT_READER,
      useClass: NutritionWeightDrizzleReader,
    },
  ],
  exports: [NUTRITION_WEIGHT_READER],
})
export class NutritionWeightReadModule {}
