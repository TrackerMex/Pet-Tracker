import { Logger } from '@nestjs/common';
import type {
  NutritionExplainer,
  NutritionExplainerContext,
} from '@/modules/nutrition/domain/ports/nutrition-explainer';
import type {
  NutritionEngineInput,
  NutritionPlanResult,
} from '@/modules/nutrition/domain/nutrition-engine';
import {
  NUTRITION_AI_SCOPE,
  NUTRITION_AI_SYSTEM_PROMPT,
  buildUserPrompt,
} from './nutrition-prompt';

export const NUTRITION_AI_TIMEOUT_MS = 15_000;
export const NUTRITION_AI_MAX_RETRIES = 0;
export const NUTRITION_AI_MAX_OUTPUT_TOKENS = 1_200;

interface OpenAiChatResponse {
  choices: Array<{
    message: { content: string | null };
    finish_reason: string | null;
  }>;
  usage?: unknown;
}

export interface OpenAiChatClient {
  create(params: unknown): Promise<OpenAiChatResponse>;
}

export class OpenAiNutritionExplainer implements NutritionExplainer {
  private readonly logger = new Logger(OpenAiNutritionExplainer.name);

  constructor(
    private readonly model: string,
    private readonly apiKey: string,
    private client?: OpenAiChatClient,
  ) {}

  async explain(
    input: NutritionEngineInput,
    result: NutritionPlanResult,
    ctx: NutritionExplainerContext,
  ): Promise<string | null> {
    try {
      const client = await this.getClient();
      const response = await client.create({
        model: this.model,
        messages: [
          { role: 'system', content: NUTRITION_AI_SYSTEM_PROMPT },
          { role: 'user', content: buildUserPrompt(input, result) },
        ],
        max_completion_tokens: NUTRITION_AI_MAX_OUTPUT_TOKENS,
      });

      const choice = response.choices[0];
      const content = choice?.message.content?.trim();

      if (!content || choice.finish_reason === 'length') {
        this.logger.warn({
          scope: NUTRITION_AI_SCOPE,
          petId: ctx.petId,
          planId: ctx.planId,
          message:
            choice?.finish_reason === 'length'
              ? 'ai explanation truncated'
              : 'ai explanation empty',
          finishReason: choice?.finish_reason ?? null,
          usage: response.usage ?? null,
        });
        return null;
      }

      return content;
    } catch (error) {
      this.logger.warn({
        scope: NUTRITION_AI_SCOPE,
        petId: ctx.petId,
        planId: ctx.planId,
        finishReason: null,
        usage: null,
        errorName: error instanceof Error ? error.name : 'UnknownError',
      });
      return null;
    }
  }

  private async getClient(): Promise<OpenAiChatClient> {
    if (this.client) {
      return this.client;
    }

    const { default: OpenAI } = await import('openai');
    const sdk = new OpenAI({
      apiKey: this.apiKey,
      timeout: NUTRITION_AI_TIMEOUT_MS,
      maxRetries: NUTRITION_AI_MAX_RETRIES,
    });
    this.client = {
      create: (params) => sdk.chat.completions.create(params as never),
    };
    return this.client;
  }
}
