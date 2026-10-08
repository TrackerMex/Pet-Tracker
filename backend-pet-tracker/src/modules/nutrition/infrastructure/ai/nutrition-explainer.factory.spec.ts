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

describe('R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto', () => {
  it.each<[string, string | undefined, string]>([
    ['NODE_ENV', 'test', 'node-env-test'],
    ...[undefined, 'false', 'TRUE', '1', ' true'].map(
      (value): [string, string | undefined, string] => [
        'ANTHROPIC_ENABLED',
        value,
        'not-enabled',
      ],
    ),
    ...[undefined, '', '   ', 'PENDING', ' PENDING '].map(
      (value): [string, string | undefined, string] => [
        'ANTHROPIC_API_KEY',
        value,
        'key-missing',
      ],
    ),
    ...[undefined, '', '   '].map(
      (value): [string, string | undefined, string] => [
        'ANTHROPIC_MODEL',
        value,
        'model-missing',
      ],
    ),
  ])('%s=%s devuelve nulo por %s', (key, value, reason) => {
    const adapter = createNutritionExplainer(
      config({ ...valid, [key]: value }),
    );
    expect(adapter).toBeInstanceOf(NullNutritionExplainer);
    expect((adapter as NullNutritionExplainer).reason).toBe(reason);
  });
  it('evalua NODE_ENV antes que la clave PENDING', () => {
    const adapter = createNutritionExplainer(
      config({ ...valid, NODE_ENV: 'test', ANTHROPIC_API_KEY: 'PENDING' }),
    );
    expect(adapter).toBeInstanceOf(NullNutritionExplainer);
    expect((adapter as NullNutritionExplainer).reason).toBe('node-env-test');
  });
  it('anti-vacio: todas cumplidas seleccionan el adaptador real sin invocarlo', () => {
    expect(createNutritionExplainer(config(valid))).toBeInstanceOf(
      AnthropicNutritionExplainer,
    );
  });
});
