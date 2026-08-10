import { readFileSync } from 'fs';
import { join } from 'path';

const REPOSITORY_ROOT = join(__dirname, '..', '..', '..');

function readRepositoryFile(...segments: string[]): string {
  return readFileSync(join(REPOSITORY_ROOT, ...segments), 'utf-8');
}

describe('R5: .gitignore ignora cdk.out', () => {
  it('incluye el directorio generado por CDK', () => {
    const lines = readRepositoryFile('.gitignore').split(/\r?\n/);

    expect(lines).toContain('cdk.out/');
  });
});
