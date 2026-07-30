import { readdirSync, readFileSync, statSync } from 'fs';
import { join, relative } from 'path';

const SRC_DIR = join(__dirname, '..');
const SCRIPTS_DIR = join(__dirname, '..', '..', 'scripts');
const AWS_DIR = join(__dirname);

// R18: cualquier import fuera de src/aws/ hacia src/aws/ debe usar el alias
// @/aws/..., nunca una ruta relativa con ../ (docs/conventions.md
// §Imports). Dentro de src/aws/ (archivos hermanos) sí se usa relativo.
const RELATIVE_AWS_IMPORT_PATTERN = /from\s+['"]\.\.\/.*aws/;

function collectTsFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const fullPath = join(dir, entry);
    const stats = statSync(fullPath);
    if (stats.isDirectory()) {
      return collectTsFiles(fullPath);
    }
    if (fullPath.endsWith('.ts')) {
      return [fullPath];
    }
    return [];
  });
}

describe('R18: imports a src/aws/ desde fuera usan el alias @/aws/..., nunca ../', () => {
  it('ningún archivo de src/** (fuera de src/aws/) ni scripts/** importa src/aws/ con ruta relativa', () => {
    const candidateFiles = [
      ...collectTsFiles(SRC_DIR),
      ...collectTsFiles(SCRIPTS_DIR),
    ].filter((file) => !file.startsWith(AWS_DIR + '/'));

    const offenders = candidateFiles.filter((file) =>
      RELATIVE_AWS_IMPORT_PATTERN.test(readFileSync(file, 'utf-8')),
    );

    expect(offenders.map((file) => relative(SRC_DIR, file))).toEqual([]);
  });
});
