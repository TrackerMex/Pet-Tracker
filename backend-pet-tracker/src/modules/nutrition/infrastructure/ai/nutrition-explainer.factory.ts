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

  return new OpenAiNutritionExplainer(
    config.get<string>('OPENAI_MODEL') ?? '',
    config.get<string>('OPENAI_API_KEY') ?? '',
  );
}
