import { readdirSync, readFileSync, statSync } from 'fs';
import { join } from 'path';

// R3/R15 comparten el mismo mecanismo de verificación estática: recorrer
// src/aws/ y scripts/provision-local.ts buscando literales prohibidos.
const AWS_DIR = join(__dirname);
const SCRIPTS_DIR = join(__dirname, '..', '..', 'scripts');

function collectTsFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const fullPath = join(dir, entry);
    const stats = statSync(fullPath);
    if (stats.isDirectory()) {
      return collectTsFiles(fullPath);
    }
    if (fullPath.endsWith('.ts') && !fullPath.endsWith('.spec.ts')) {
      return [fullPath];
    }
    return [];
  });
}

// Literales de región AWS real conocidos — si alguno aparece hardcodeado en
// vez de leerse de AWS_REGION, algo está mal.
const HARDCODED_REGION_PATTERN = /['"`](us|eu|ap|sa|ca|me|af)-[a-z]+-\d['"`]/;
// Credenciales dummy de LocalStack ('test') están permitidas como fallback
// documental, pero un access key con forma real (AKIA...) nunca debe
// aparecer.
const HARDCODED_ACCESS_KEY_PATTERN = /AKIA[0-9A-Z]{16}/;

describe('R3: sin literales de región/credenciales hardcodeados en src/aws/ ni en el script de provisioning', () => {
  it('ningún archivo fuente contiene una región AWS literal', () => {
    const offenders = [
      ...collectTsFiles(AWS_DIR),
      ...collectTsFiles(SCRIPTS_DIR),
    ].filter((file) =>
      HARDCODED_REGION_PATTERN.test(readFileSync(file, 'utf-8')),
    );

    expect(offenders).toEqual([]);
  });

  it('ningún archivo fuente contiene un access key id con forma real', () => {
    const offenders = [
      ...collectTsFiles(AWS_DIR),
      ...collectTsFiles(SCRIPTS_DIR),
    ].filter((file) =>
      HARDCODED_ACCESS_KEY_PATTERN.test(readFileSync(file, 'utf-8')),
    );

    expect(offenders).toEqual([]);
  });
});
