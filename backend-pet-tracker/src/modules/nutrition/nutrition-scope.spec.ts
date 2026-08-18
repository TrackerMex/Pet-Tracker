import { readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';

describe('R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo', () => {
  const backendRoot = join(__dirname, '..', '..', '..');
  const repositoryRoot = join(backendRoot, '..');

  it('mantiene fuera del backend toda configuracion y codigo de IA', () => {
    const envExample = readFileSync(
      join(repositoryRoot, '.env.example'),
      'utf8',
    );
    const conventions = readFileSync(
      join(repositoryRoot, 'docs', 'conventions.md'),
      'utf8',
    );
    const productionSource = sourceFiles(join(backendRoot, 'src'))
      .map((path) => readFileSync(path, 'utf8'))
      .join('\n');
    const openAiConfigFiles = sourceFiles(join(backendRoot, 'src'))
      .filter((path) => readFileSync(path, 'utf8').includes('OPENAI_'))
      .map((path) => relative(join(backendRoot, 'src'), path).replaceAll('\\', '/'));

    expect(envExample).toMatch(/^OPENAI_ENABLED=false$/m);
    expect(envExample).toMatch(/^OPENAI_API_KEY=PENDING$/m);
    expect(envExample).toMatch(/^OPENAI_MODEL=/m);
    expect(envExample).not.toMatch(/^OPENAI_API_KEY=sk-/m);
    expect(conventions).toContain('`OPENAI_ENABLED`');
    expect(conventions).toContain('`OPENAI_API_KEY`');
    expect(conventions).toContain('`OPENAI_MODEL`');
    expect(openAiConfigFiles).toEqual([
      'modules/nutrition/infrastructure/ai/nutrition-explainer.factory.ts',
    ]);
    expect(productionSource).not.toContain('gpt-');
  });
});

function sourceFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return sourceFiles(path);
    return entry.name.endsWith('.ts') && !entry.name.endsWith('.spec.ts')
      ? [path]
      : [];
  });
}
