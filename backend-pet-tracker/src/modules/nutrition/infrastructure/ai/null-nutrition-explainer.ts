import type { NutritionExplainer } from '@/modules/nutrition/domain/ports/nutrition-explainer';

export class NullNutritionExplainer implements NutritionExplainer {
  async explain(): Promise<null> {
    return null;
  }
}
