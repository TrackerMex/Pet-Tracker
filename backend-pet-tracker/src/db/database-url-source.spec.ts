import { readdirSync, readFileSync, statSync } from 'fs';
import { join } from 'path';

const SRC_DIR = join(__dirname, '..', '..', 'src');
const FORBIDDEN = 'process.env.' + 'DATABASE_URL';

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

describe('R6: DATABASE_URL nunca via process.env directo dentro de src/**', () => {
  it('ningún archivo de src/** lee process.env.DATABASE_URL directamente (única vía: ConfigService.get)', () => {
    const offenders = collectTsFiles(SRC_DIR).filter((file) =>
      readFileSync(file, 'utf-8').includes(FORBIDDEN),
    );

    expect(offenders).toEqual([]);
  });
});
