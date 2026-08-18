import { Logger } from '@nestjs/common';
import type {
  NutritionExplainer,
  NutritionExplainerContext,
} from '@/modules/nutrition/domain/ports/nutrition-explainer';
import type {
  NutritionEngineInput,
  NutritionPlanResult,
} from '@/modules/nutrition/domain/nutrition-engine';
import { NUTRITION_AI_SCOPE } from './nutrition-prompt';

export class NullNutritionExplainer implements NutritionExplainer {
  private readonly logger = new Logger(NullNutritionExplainer.name);

  async explain(
    _input: NutritionEngineInput,
    _result: NutritionPlanResult,
    ctx: NutritionExplainerContext,
  ): Promise<null> {
    this.logger.warn({
      scope: NUTRITION_AI_SCOPE,
      petId: ctx.petId,
      planId: ctx.planId,
      reason: 'disabled',
    });
    return null;
  }
}
