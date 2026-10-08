import type {
  NutritionEngineInput,
  NutritionPlanResult,
} from '@/modules/nutrition/domain/nutrition-engine';
import type {
  NutritionExplainerContext,
  NutritionExplainer,
} from '@/modules/nutrition/domain/ports/nutrition-explainer';
export type NullExplainerReason =
  'node-env-test' | 'not-enabled' | 'key-missing' | 'model-missing';
export class NullNutritionExplainer implements NutritionExplainer {
  constructor(readonly reason: NullExplainerReason) {}
  explain(
    input: NutritionEngineInput,
    result: NutritionPlanResult,
    ctx: NutritionExplainerContext,
  ): Promise<null> {
    void input;
    void result;
    void ctx;
    return Promise.resolve(null);
  }
}
