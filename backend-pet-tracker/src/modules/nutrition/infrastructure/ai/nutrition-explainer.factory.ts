import { ConfigService } from '@nestjs/config';
import type { NutritionExplainer } from '@/modules/nutrition/domain/ports/nutrition-explainer';
import { NullNutritionExplainer } from './null-nutrition-explainer';
export function createNutritionExplainer(
  config: ConfigService,
): NutritionExplainer {
  void config;
  return new NullNutritionExplainer('not-enabled');
}
