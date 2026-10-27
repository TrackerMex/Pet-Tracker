import type { NutritionAiOutput } from '@/modules/nutrition/domain/nutrition-ai-proposal';
import type { NutritionWeightPoint } from '@/modules/nutrition/domain/ports/nutrition-weight-reader';
import type {
  NutritionEngineInput,
  NutritionPlanResult,
} from '@/modules/nutrition/domain/nutrition-engine';

export const NUTRITION_EXPLAINER = Symbol('NutritionExplainer');
export interface NutritionExplainerContext {
  petId: string;
  planId: string;
}
export interface NutritionExplainer {
  explain(
    input: NutritionEngineInput,
    result: NutritionPlanResult,
    weightTrend: NutritionWeightPoint[],
    ctx: NutritionExplainerContext,
  ): Promise<NutritionAiOutput | null>;
}
