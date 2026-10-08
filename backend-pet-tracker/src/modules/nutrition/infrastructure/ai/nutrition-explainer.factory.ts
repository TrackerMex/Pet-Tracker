import { ConfigService } from '@nestjs/config';
import type { NutritionExplainer } from '@/modules/nutrition/domain/ports/nutrition-explainer';
import { NullNutritionExplainer } from './null-nutrition-explainer';
import { AnthropicNutritionExplainer } from './anthropic-nutrition-explainer';
export const ANTHROPIC_API_KEY_PENDING = 'PENDING';
export function createNutritionExplainer(
  config: ConfigService,
): NutritionExplainer {
  if (config.get<string>('NODE_ENV') === 'test')
    return new NullNutritionExplainer('node-env-test');
  if (config.get<string>('ANTHROPIC_ENABLED') !== 'true')
    return new NullNutritionExplainer('not-enabled');
  const key = config.get<string>('ANTHROPIC_API_KEY');
  if (
    typeof key !== 'string' ||
    key.trim() === '' ||
    key.trim() === ANTHROPIC_API_KEY_PENDING
  )
    return new NullNutritionExplainer('key-missing');
  const model = config.get<string>('ANTHROPIC_MODEL');
  if (typeof model !== 'string' || model.trim() === '')
    return new NullNutritionExplainer('model-missing');
  return new AnthropicNutritionExplainer(model, key, null);
}
