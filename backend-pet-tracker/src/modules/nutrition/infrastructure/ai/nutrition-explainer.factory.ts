import { ConfigService } from '@nestjs/config';
import type { NutritionExplainer } from '@/modules/nutrition/domain/ports/nutrition-explainer';
import { NullNutritionExplainer } from './null-nutrition-explainer';
import { AnthropicNutritionExplainer } from './anthropic-nutrition-explainer';
export function createNutritionExplainer(
  config: ConfigService,
): NutritionExplainer {
  if (config.get<string>('NODE_ENV') === 'test')
    return new NullNutritionExplainer('node-env-test');
  const model = config.get<string>('ANTHROPIC_MODEL')!;
  const key = config.get<string>('ANTHROPIC_API_KEY')!;
  return new AnthropicNutritionExplainer(model, key, null);
}
