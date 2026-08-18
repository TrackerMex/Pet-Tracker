import { ConfigService } from '@nestjs/config';
import type { NutritionExplainer } from '@/modules/nutrition/domain/ports/nutrition-explainer';
import { NullNutritionExplainer } from './null-nutrition-explainer';
import { OpenAiNutritionExplainer } from './openai-nutrition-explainer';

export const OPENAI_API_KEY_PENDING = 'PENDING';

export function createNutritionExplainer(
  config: ConfigService,
): NutritionExplainer {
  if (config.get<string>('NODE_ENV') === 'test') {
    return new NullNutritionExplainer();
  }

  const enabled = config.get<string>('OPENAI_ENABLED');
  const apiKey = config.get<string>('OPENAI_API_KEY')?.trim();
  const model = config.get<string>('OPENAI_MODEL')?.trim();

  if (enabled !== 'true' || !apiKey || apiKey === 'PENDING' || !model) {
    return new NullNutritionExplainer();
  }

  return new OpenAiNutritionExplainer(model, apiKey);
}
