import type {
  NutritionExplainer,
  NutritionExplainerContext,
} from '@/modules/nutrition/domain/ports/nutrition-explainer';
import type {
  NutritionEngineInput,
  NutritionPlanResult,
} from '@/modules/nutrition/domain/nutrition.types';
import {
  NUTRITION_AI_MAX_OUTPUT_TOKENS,
  NUTRITION_AI_SYSTEM_PROMPT,
  NUTRITION_AI_TIMEOUT_MS,
  buildUserPrompt,
} from './nutrition-prompt';

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
  constructor(
    private readonly model: string,
    private readonly apiKey: string,
    private client?: OpenAiChatClient,
  ) {}

  async explain(
    input: NutritionEngineInput,
    result: NutritionPlanResult,
    _ctx: NutritionExplainerContext,
  ): Promise<string | null> {
    const client = await this.getClient();
    const response = await client.create({
      model: this.model,
      messages: [
        { role: 'system', content: NUTRITION_AI_SYSTEM_PROMPT },
        { role: 'user', content: buildUserPrompt(input, result) },
      ],
      max_completion_tokens: NUTRITION_AI_MAX_OUTPUT_TOKENS,
    });

    return response.choices[0]?.message.content ?? null;
  }

  private async getClient(): Promise<OpenAiChatClient> {
    if (this.client) {
      return this.client;
    }

    const { default: OpenAI } = await import('openai');
    const sdk = new OpenAI({
      apiKey: this.apiKey,
      timeout: NUTRITION_AI_TIMEOUT_MS,
      maxRetries: 0,
    });
    this.client = {
      create: (params) =>
        sdk.chat.completions.create(params as never) as Promise<OpenAiChatResponse>,
    };
    return this.client;
  }
}
