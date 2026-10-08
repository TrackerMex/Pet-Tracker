import type {
  NutritionEngineInput,
  NutritionPlanResult,
} from '@/modules/nutrition/domain/nutrition-engine';
import type {
  NutritionExplainer,
  NutritionExplainerContext,
} from '@/modules/nutrition/domain/ports/nutrition-explainer';

export const NUTRITION_AI_TIMEOUT_MS = 15_000;
export const NUTRITION_AI_MAX_RETRIES = 0;
export const NUTRITION_AI_MAX_OUTPUT_TOKENS = 1_200;
export interface AnthropicMessageParams {
  model: string;
  max_tokens: number;
  system: string;
  messages: { role: 'user'; content: string }[];
}
export interface AnthropicMessageResponse {
  content: unknown;
  stop_reason?: string | null;
  usage?: { input_tokens: number; output_tokens: number };
}
export interface AnthropicMessagesClient {
  create(params: AnthropicMessageParams): Promise<AnthropicMessageResponse>;
}
export class AnthropicNutritionExplainer implements NutritionExplainer {
  constructor(
    private readonly model: string,
    private readonly apiKey: string,
    private client: AnthropicMessagesClient | null,
  ) {}
  explain(
    input: NutritionEngineInput,
    result: NutritionPlanResult,
    ctx: NutritionExplainerContext,
  ): Promise<string | null> {
    void input;
    void result;
    void ctx;
    return Promise.reject(new Error('not implemented (R9)'));
  }
}
