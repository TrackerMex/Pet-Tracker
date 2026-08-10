import { readFileSync } from 'fs';
import { join } from 'path';

const REPOSITORY_ROOT = join(__dirname, '..', '..', '..');

function readRepositoryFile(...segments: string[]): string {
  return readFileSync(join(REPOSITORY_ROOT, ...segments), 'utf-8');
}

describe('R3: media e2e usa BUCKET_MEDIA sin literal local', () => {
  it('delega el nombre del bucket a constants.ts', () => {
    const mediaE2e = readRepositoryFile(
      'backend-pet-tracker',
      'test',
      'media.e2e-spec.ts',
    );

    expect(mediaE2e).not.toContain("'pet-tracker-media-local'");
    expect(mediaE2e).toContain('expect.stringContaining(BUCKET_MEDIA)');
  });
});

describe('R5: .gitignore ignora cdk.out', () => {
  it('incluye el directorio generado por CDK', () => {
    const lines = readRepositoryFile('.gitignore').split(/\r?\n/);

    expect(lines).toContain('cdk.out/');
  });
});

describe('R6: init.config.sh ejecuta el paquete infra', () => {
  it.each([
    'INSTALL_CMD',
    'BUILD_CMD',
    'TEST_CMD',
    'LINT_CMD',
    'TYPECHECK_CMD',
  ])('%s encadena pnpm -C infra', (variableName) => {
    const config = readRepositoryFile('init.config.sh');
    const assignment = config.match(
      new RegExp(`^${variableName}="([^"]*)"$`, 'm'),
    );

    if (!assignment) {
      throw new Error(`${variableName} no está definida`);
    }
    if (!assignment[1].includes('pnpm -C infra')) {
      throw new Error(`${variableName} no ejecuta pnpm -C infra`);
    }

    expect(assignment[1]).toContain('pnpm -C infra');
  });
});
