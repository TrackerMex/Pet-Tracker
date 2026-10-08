import { ConfigService } from '@nestjs/config';
import { createNutritionExplainer } from './nutrition-explainer.factory';
import { AnthropicNutritionExplainer } from './anthropic-nutrition-explainer';
import { NullNutritionExplainer } from './null-nutrition-explainer';

const valid: Record<string, string | undefined> = {
  NODE_ENV: 'development',
  ANTHROPIC_ENABLED: 'true',
  ANTHROPIC_API_KEY: 'clave-de-prueba',
  ANTHROPIC_MODEL: 'modelo-de-prueba',
};
function config(values: Record<string, string | undefined>): ConfigService {
  return { get: (key: string) => values[key] } as ConfigService;
}
describe('R3 (nutrition-ai-explainer #18): NODE_ENV test apaga antes que nada', () => {
  it('devuelve el nulo con reason node-env-test aunque la IA este habilitada', () => {
    const adapter = createNutritionExplainer(
      config({ ...valid, NODE_ENV: 'test' }),
    );
    expect(adapter).toBeInstanceOf(NullNutritionExplainer);
    expect((adapter as NullNutritionExplainer).reason).toBe('node-env-test');
  });
  it('anti-vacio: development selecciona Anthropic sin invocarlo', () => {
    expect(createNutritionExplainer(config(valid))).toBeInstanceOf(
      AnthropicNutritionExplainer,
    );
  });
});
