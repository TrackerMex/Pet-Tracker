import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

describe('R26 (nutrition-profile-engine #17): sin dependencia openai ni env OPENAI_', () => {
  const backendRoot = join(__dirname, '..', '..', '..');
  const repositoryRoot = join(backendRoot, '..');

  it('mantiene fuera del backend toda configuracion y codigo de IA', () => {
    const packageJson = readFileSync(
      join(backendRoot, 'package.json'),
      'utf8',
    );
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
