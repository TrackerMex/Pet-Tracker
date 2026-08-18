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
    ctx: NutritionExplainerContext,
  ): Promise<string | null>;
}
