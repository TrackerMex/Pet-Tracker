import type { NutritionAiOutput } from '@/modules/nutrition/domain/nutrition-ai-proposal';
import type { NutritionWeightPoint } from '@/modules/nutrition/domain/ports/nutrition-weight-reader';
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
    weightTrend: NutritionWeightPoint[],
    ctx: NutritionExplainerContext,
  ): Promise<NutritionAiOutput | null> {
    void input;
    void result;
    void weightTrend;
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
