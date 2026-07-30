import { readdirSync, readFileSync, statSync } from 'fs';
import { join } from 'path';

const AWS_DIR = join(__dirname);
const SCRIPT_FILE = join(
  __dirname,
  '..',
  '..',
  'scripts',
  'provision-local.ts',
);
const FORBIDDEN = 'amazonaws' + '.com';

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

describe('R15: sin literales de endpoint AWS real en src/aws/ ni en scripts/provision-local.ts', () => {
  it('ningún archivo contiene "amazonaws.com" hardcodeado', () => {
    const files = [...collectTsFiles(AWS_DIR), SCRIPT_FILE];

    const offenders = files.filter((file) =>
      readFileSync(file, 'utf-8').includes(FORBIDDEN),
    );

    expect(offenders).toEqual([]);
  });
});
