import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { isProduction } from './environment';
const src = join(__dirname, '..');
function collectTsFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) return collectTsFiles(path);
    return path.endsWith('.ts') && !path.endsWith('.spec.ts') ? [path] : [];
  });
}
describe('R1: isProduction es la única señal de producción', () => {
  it('R1: devuelve true solo para "production" exacto', () => {
    expect(isProduction('production')).toBe(true);
    for (const value of [
      'Production',
      'prod',
      ' production',
      'test',
      'development',
      '',
      undefined,
    ])
      expect(isProduction(value)).toBe(false);
  });
  it('R1: el literal production entre comillas solo aparece en config/environment.ts', () => {
    const matches = collectTsFiles(src)
      .filter((file) => /['"`]production['"`]/.test(readFileSync(file, 'utf8')))
      .map((file) => relative(src, file).split('\\').join('/'));
    expect(matches).toEqual(['config/environment.ts']);
  });
});
