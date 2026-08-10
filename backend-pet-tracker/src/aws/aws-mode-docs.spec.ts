import { readFileSync } from 'fs';
import { join } from 'path';

const REPOSITORY_ROOT = join(__dirname, '..', '..', '..');

describe('R10: AWS_MODE documentada en .env.example y conventions', () => {
  it('define el default local en .env.example', () => {
    const envExample = readFileSync(
      join(REPOSITORY_ROOT, '.env.example'),
      'utf-8',
    );

    expect(envExample).toMatch(/^AWS_MODE=local$/m);
  });

  it('incluye AWS_MODE en la tabla de variables de entorno', () => {
    const conventions = readFileSync(
      join(REPOSITORY_ROOT, 'docs', 'conventions.md'),
      'utf-8',
    );

    expect(conventions).toMatch(/^\| `AWS_MODE` \|/m);
  });
});

describe('R12: verification.md documenta la prueba de humo', () => {
  it('incluye la sección de la feature y el modo aws', () => {
    const verification = readFileSync(
      join(REPOSITORY_ROOT, 'docs', 'verification.md'),
      'utf-8',
    );

    expect(verification).toContain('Feature 19 — aws-real-credentials');
    expect(verification).toContain('AWS_MODE=aws');
  });
});
