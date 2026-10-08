import {
  buildUserPrompt,
  NUTRITION_AI_SYSTEM_PROMPT,
} from './nutrition-prompt';
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
  async explain(
    input: NutritionEngineInput,
    result: NutritionPlanResult,
    ctx: NutritionExplainerContext,
  ): Promise<string | null> {
    void ctx;
    if (this.client === null) {
      const { default: Anthropic } = await import('@anthropic-ai/sdk');
      this.client = new Anthropic({
        apiKey: this.apiKey,
        timeout: NUTRITION_AI_TIMEOUT_MS,
        maxRetries: NUTRITION_AI_MAX_RETRIES,
      }).messages;
    }
    const response = await this.client.create({
      model: this.model,
      max_tokens: NUTRITION_AI_MAX_OUTPUT_TOKENS,
      system: NUTRITION_AI_SYSTEM_PROMPT,
      messages: [{ role: 'user', content: buildUserPrompt(input, result) }],
    });
    const blocks = Array.isArray(response.content)
      ? (response.content as { type: string; text?: string }[])
      : [];
    return blocks.find((block) => block.type === 'text')?.text ?? null;
  }
}
