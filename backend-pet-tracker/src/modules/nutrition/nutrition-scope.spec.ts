import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

describe('R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo', () => {
  const backendRoot = join(__dirname, '..', '..', '..');
  const repositoryRoot = join(backendRoot, '..');

  it('R1: conserva aserciones 1-5 contra el proveedor descartado y modelos', () => {
    const packageJson = readFileSync(join(backendRoot, 'package.json'), 'utf8');
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

    expect(packageJson).not.toMatch(/"openai"\s*:/i);
    expect(envExample).not.toContain('OPENAI_');
    expect(conventions).not.toContain('OPENAI_');
    expect(productionSource).not.toContain('OPENAI_');
    expect(productionSource).not.toContain('gpt-');
  });
  it('R1: asercion 6 dependencia exacta', () => {
    expect(readFileSync(join(backendRoot, 'package.json'), 'utf8')).toContain(
      '"@anthropic-ai/sdk": "0.128.0"',
    );
  });
  it('R4: asercion 7 variables y centinela', () => {
    const envExample = readFileSync(
      join(repositoryRoot, '.env.example'),
      'utf8',
    );
    expect(envExample).toMatch(/^ANTHROPIC_ENABLED=false$/m);
    expect(envExample).toMatch(/^ANTHROPIC_API_KEY=PENDING$/m);
    expect(envExample).toMatch(/^ANTHROPIC_MODEL=\S+$/m);
  });
  it('R4: asercion 8 nunca publica una clave real', () => {
    expect(
      readFileSync(join(repositoryRoot, '.env.example'), 'utf8'),
    ).not.toMatch(/^ANTHROPIC_API_KEY=sk-/m);
  });
  it('R4: asercion 9 documenta las tres variables', () => {
    const conventions = readFileSync(
      join(repositoryRoot, 'docs/conventions.md'),
      'utf8',
    );
    expect(conventions).toContain('`ANTHROPIC_ENABLED`');
    expect(conventions).toContain('`ANTHROPIC_API_KEY`');
    expect(conventions).toContain('`ANTHROPIC_MODEL`');
  });
  it('R5: asercion 10 solo el factory lee la configuracion', () => {
    const root = join(backendRoot, 'src');
    expect(
      sourceFiles(root)
        .filter((path) => readFileSync(path, 'utf8').includes('ANTHROPIC_'))
        .map((path) => path.slice(root.length + 1))
        .sort(),
    ).toEqual([
      'modules/nutrition/infrastructure/ai/nutrition-explainer.factory.ts',
    ]);
  });
  it('R2: asercion 11 ningun fichero contiene un literal del modelo', () => {
    const needle = ['claude', '-'].join('');
    expect(
      sourceFiles(join(backendRoot, 'src'), true).filter((path) =>
        readFileSync(path, 'utf8').includes(needle),
      ),
    ).toEqual([]);
  });
  it('R3: asercion 12 ningun test importa el SDK', () => {
    const tests = [
      ...sourceFiles(join(backendRoot, 'src'), true).filter((path) =>
        path.endsWith('.spec.ts'),
      ),
      ...sourceFiles(join(backendRoot, 'test'), true).filter((path) =>
        path.endsWith('.e2e-spec.ts'),
      ),
    ];
    const forbidden = [
      "from '@anthropic-ai/" + "sdk'",
      "import('@anthropic-ai/" + "sdk')",
    ];
    expect(
      tests.filter((path) =>
        forbidden.some((needle) => readFileSync(path, 'utf8').includes(needle)),
      ),
    ).toEqual([]);
  });
  it('R3: asercion 13 ningun test construye un cliente real', () => {
    const tests = [
      ...sourceFiles(join(backendRoot, 'src'), true).filter((path) =>
        path.endsWith('.spec.ts'),
      ),
      ...sourceFiles(join(backendRoot, 'test'), true).filter((path) =>
        path.endsWith('.e2e-spec.ts'),
      ),
    ];
    expect(
      tests.filter((path) =>
        /new AnthropicNutritionExplainer\([^)]*\bnull\s*\)/.test(
          readFileSync(path, 'utf8'),
        ),
      ),
    ).toEqual([]);
  });
});

function sourceFiles(directory: string, includeSpecs = false): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return sourceFiles(path, includeSpecs);
    return entry.name.endsWith('.ts') &&
      (includeSpecs || !entry.name.endsWith('.spec.ts'))
      ? [path]
      : [];
  });
}
