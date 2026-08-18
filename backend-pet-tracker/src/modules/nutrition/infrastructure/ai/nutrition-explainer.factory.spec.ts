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
