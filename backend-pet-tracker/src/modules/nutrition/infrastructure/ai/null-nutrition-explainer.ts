import type { NutritionExplainer } from '@/modules/nutrition/domain/ports/nutrition-explainer';
export type NullExplainerReason =
  'node-env-test' | 'not-enabled' | 'key-missing' | 'model-missing';
export class NullNutritionExplainer implements NutritionExplainer {
  constructor(readonly reason: NullExplainerReason) {}
  explain(): Promise<null> {
    return Promise.resolve(null);
  }
}
