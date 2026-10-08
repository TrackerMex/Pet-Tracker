import { Logger } from '@nestjs/common';
import { NUTRITION_AI_SCOPE } from './nutrition-prompt';
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
  private readonly logger = new Logger(NullNutritionExplainer.name);
  constructor(readonly reason: NullExplainerReason) {}
  explain(
    input: NutritionEngineInput,
    result: NutritionPlanResult,
    ctx: NutritionExplainerContext,
  ): Promise<null> {
    void input;
    void result;
    this.logger.warn({
      scope: NUTRITION_AI_SCOPE,
      petId: ctx.petId,
      planId: ctx.planId,
      message: 'ai explanation disabled',
      reason: this.reason,
    });
    return Promise.resolve(null);
  }
}
