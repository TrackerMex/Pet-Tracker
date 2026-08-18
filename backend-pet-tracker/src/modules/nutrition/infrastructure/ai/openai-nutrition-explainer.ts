import type {
  NutritionEngineInput,
  NutritionPlanResult,
} from '@/modules/nutrition/domain/nutrition-engine';
import type {
  NutritionExplainer,
  NutritionExplainerContext,
} from '@/modules/nutrition/domain/ports/nutrition-explainer';

export interface OpenAiChatClient {
  create(params: unknown): Promise<unknown>;
}

export class OpenAiNutritionExplainer implements NutritionExplainer {
  constructor(
    private readonly model: string,
    private readonly apiKey: string,
    private client: OpenAiChatClient | null = null,
  ) {}

  async explain(
    _input: NutritionEngineInput,
    _result: NutritionPlanResult,
    _ctx: NutritionExplainerContext,
  ): Promise<null> {
    return null;
  }
}
