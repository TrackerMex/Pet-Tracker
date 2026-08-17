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
    expect(mediaE2e).toContain('expect.stringContaining(names.mediaBucket)');
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

describe('R15: architecture.md documenta el bucket dev y una cuenta por entorno', () => {
  it('actualiza la equivalencia S3 y registra la estrategia de nombres', () => {
    const architecture = readRepositoryFile('docs', 'architecture.md');
    const s3Row = architecture
      .split(/\r?\n/)
      .find((line) => line.startsWith('| S3 `pet-tracker-media-local`'));

    expect(s3Row).toContain('pet-tracker-media-dev-<accountId>');
    expect(s3Row).not.toContain(
      'Pendiente de verificar en un despliegue AWS real',
    );
    expect(architecture).toContain('una cuenta AWS por entorno');
  });
});

describe('R16: verification.md documenta el procedimiento manual de #20', () => {
  it('incluye los cinco pasos, las credenciales y las políticas de borrado', () => {
    const verification = readRepositoryFile('docs', 'verification.md');

    expect(verification).toContain('### Feature 20 — aws-cdk-dev-stack');
    expect(verification).toContain('cdk bootstrap');
    expect(verification).toContain('cdk deploy');
    expect(verification).toContain('AWS_MODE=aws');
    expect(verification).toContain('aws-real-ingest.e2e-spec.ts');
    expect(verification).toContain('AWS_ACCESS_KEY_ID');
    expect(verification).toContain('AWS_SECRET_ACCESS_KEY');
    expect(verification).toContain('bucket tiene objetos');
    expect(verification).toContain('tabla retenida');
  });
});
