import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ConfigService } from '@nestjs/config';
import { NullNutritionExplainer } from './null-nutrition-explainer';
import { OpenAiNutritionExplainer } from './openai-nutrition-explainer';
import { createNutritionExplainer } from './nutrition-explainer.factory';

describe('R3 (nutrition-ai-explainer #18): con NODE_ENV=test nunca se construye el cliente real', () => {
  const realLookingConfig = {
    OPENAI_ENABLED: 'true',
    OPENAI_API_KEY: 'sk-real-looking-key',
    OPENAI_MODEL: 'modelo-de-prueba',
  };

  it('prioriza test y conserva una rama real positiva fuera de test', () => {
    const testExplainer = createNutritionExplainer(
      new ConfigService({ ...realLookingConfig, NODE_ENV: 'test' }),
    );
    const developmentExplainer = createNutritionExplainer(
      new ConfigService({ ...realLookingConfig, NODE_ENV: 'development' }),
    );

    expect(testExplainer).toBeInstanceOf(NullNutritionExplainer);
    expect(developmentExplainer).toBeInstanceOf(OpenAiNutritionExplainer);
  });

  it('ningun test importa estaticamente el SDK', () => {
    const backendRoot = join(__dirname, '..', '..', '..', '..', '..');
    const forbiddenImport = ['from ', "'openai'"].join('');
    const testSource = [join(backendRoot, 'src'), join(backendRoot, 'test')]
      .flatMap(sourceFiles)
      .filter((path) => path.endsWith('.spec.ts'))
      .map((path) => readFileSync(path, 'utf8'))
      .join('\n');

    expect(testSource).not.toContain(forbiddenImport);
  });
});

function sourceFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? sourceFiles(path) : [path];
  });
}


describe('R5 (nutrition-ai-explainer #18): las cuatro condiciones del gate', () => {
  const validConfig = {
    OPENAI_ENABLED: 'true',
    OPENAI_API_KEY: 'test-key',
    OPENAI_MODEL: 'model-from-env',
  };

  function config(values: Record<string, string | undefined>): ConfigService {
    return {
      get: (key: string) => values[key],
    } as ConfigService;
  }

  it.each([
    ['test environment', 'test', validConfig],
    ['missing enabled flag', 'development', { ...validConfig, OPENAI_ENABLED: undefined }],
    ['disabled flag', 'development', { ...validConfig, OPENAI_ENABLED: 'false' }],
    ['case-sensitive enabled flag', 'development', { ...validConfig, OPENAI_ENABLED: 'TRUE' }],
    ['missing API key', 'development', { ...validConfig, OPENAI_API_KEY: undefined }],
    ['empty API key', 'development', { ...validConfig, OPENAI_API_KEY: '' }],
    ['blank API key', 'development', { ...validConfig, OPENAI_API_KEY: '   ' }],
    ['pending API key', 'development', { ...validConfig, OPENAI_API_KEY: 'PENDING' }],
    ['missing model', 'development', { ...validConfig, OPENAI_MODEL: undefined }],
    ['empty model', 'development', { ...validConfig, OPENAI_MODEL: '' }],
  ])('uses the null explainer for %s', (_case, nodeEnv, values) => {
    expect(
      createNutritionExplainer(config({ ...values, NODE_ENV: nodeEnv })),
    ).toBeInstanceOf(
      NullNutritionExplainer,
    );
  });

  it('uses the real explainer only when every gate is valid', () => {
    expect(
      createNutritionExplainer(
        config({ ...validConfig, NODE_ENV: 'development' }),
      ),
    ).toBeInstanceOf(OpenAiNutritionExplainer);
  });
});

