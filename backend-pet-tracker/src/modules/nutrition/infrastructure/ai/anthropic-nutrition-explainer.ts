import type { NutritionWeightPoint } from '@/modules/nutrition/domain/ports/nutrition-weight-reader';
import { Logger } from '@nestjs/common';
import {
  NUTRITION_AI_SCOPE,
  buildUserPrompt,
  NUTRITION_AI_SYSTEM_PROMPT,
  NUTRITION_AI_OUTPUT_JSON_SCHEMA,
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
export const NUTRITION_AI_MAX_OUTPUT_TOKENS = 2_000;
export interface AnthropicMessageParams {
  model: string;
  max_tokens: number;
  system: string;
  messages: { role: 'user'; content: string }[];
  thinking: { type: 'disabled' };
  output_config: {
    format: { type: 'json_schema'; schema: Record<string, unknown> };
  };
}
export interface AnthropicMessageResponse {
  content: unknown;
  stop_reason?: string | null;
  usage?: { input_tokens: number; output_tokens: number };
}
export interface AnthropicMessagesClient {
  create(params: AnthropicMessageParams): Promise<AnthropicMessageResponse>;
}
export interface AnthropicClientOptions {
  apiKey: string;
  timeout: number;
  maxRetries: number;
}
export type AnthropicSdkLoader = () => Promise<{
  default: new (options: AnthropicClientOptions) => {
    messages: AnthropicMessagesClient;
  };
}>;
export class AnthropicNutritionExplainer implements NutritionExplainer {
  private readonly logger = new Logger(AnthropicNutritionExplainer.name);
  constructor(
    private readonly model: string,
    private readonly apiKey: string,
    private client: AnthropicMessagesClient | null,
    private readonly loadSdk: AnthropicSdkLoader = async () =>
      await import('@anthropic-ai/sdk'),
  ) {}
  async explain(
    input: NutritionEngineInput,
    result: NutritionPlanResult,
    weightTrend: NutritionWeightPoint[],
    ctx: NutritionExplainerContext,
  ): Promise<string | null> {
    try {
      if (this.client === null) {
        const { default: Anthropic } = await this.loadSdk();
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
        thinking: { type: 'disabled' },
        output_config: {
          format: {
            type: 'json_schema',
            schema: NUTRITION_AI_OUTPUT_JSON_SCHEMA,
          },
        },
        messages: [
          {
            role: 'user',
            content: buildUserPrompt(input, result, weightTrend),
          },
        ],
      });
      const blocks = Array.isArray(response.content)
        ? (response.content as { type: string; text?: string }[])
        : [];
      const text = blocks
        .filter((block) => block.type === 'text')
        .map((block) => block.text ?? '')
        .join('')
        .trim();
      if (response.stop_reason === 'end_turn' && text.length > 0) return text;
      this.logger.warn({
        scope: NUTRITION_AI_SCOPE,
        petId: ctx.petId,
        planId: ctx.planId,
        message: 'ai explanation unusable',
        stopReason: response.stop_reason ?? null,
        usage: response.usage ?? null,
      });
      return null;
    } catch (error) {
      this.logger.warn({
        scope: NUTRITION_AI_SCOPE,
        petId: ctx.petId,
        planId: ctx.planId,
        message: error instanceof Error ? error.message : String(error),
      });
      return null;
    }
  }
}
