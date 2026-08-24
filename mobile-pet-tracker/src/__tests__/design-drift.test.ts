import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';

const sourceRoot = join(process.cwd(), 'src');

function sourceFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);

    if (entry.isDirectory()) {
      return entry.name === '__tests__' ? [] : sourceFiles(path);
    }

    return /\.tsx?$/.test(entry.name) ? [path] : [];
  });
}

function filesContaining(value: string): string[] {
  return sourceFiles(sourceRoot)
    .filter((path) => readFileSync(path, 'utf8').includes(value))
    .map((path) => path.slice(sourceRoot.length + 1));
}

describe('R3: Card compartido elimina rounded arbitrario', () => {
  it('no deja rounded-[20px] en código de producción', () => {
    const roundedArbitrary = ['rounded-', '[20px]'].join('');

    expect(filesContaining(roundedArbitrary)).toEqual([]);
  });

  it.each([
    'home',
    'food',
    'meal-schedule',
    'health',
    'weight-log',
    'profile',
    'map',
  ])('%s importa el Card compartido', (screen) => {
    const contents = readFileSync(
      join(sourceRoot, 'app', '(tabs)', `${screen}.tsx`),
      'utf8',
    );

    expect(contents).toContain("from '../../components/card'");
  });
});
