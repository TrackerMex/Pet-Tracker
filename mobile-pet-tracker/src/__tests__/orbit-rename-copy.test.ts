const fs = jest.requireActual<typeof import('fs')>('fs');
const { join, relative } = jest.requireActual<typeof import('path')>('path');
const sourceRoot = join(process.cwd(), 'src');
const readSource = (path: string) => fs.readFileSync(join(sourceRoot, path), 'utf8');

function sourceFiles(directory = sourceRoot): string[] {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return entry.name === '__tests__' ? [] : sourceFiles(path);
    return /\.(ts|tsx|js|jsx|json|css)$/.test(entry.name) && !/\.test\./.test(entry.name) ? [path] : [];
  });
}

it('#221 R1: el catálogo dice Orbit', () => {
  const catalog = readSource('i18n/catalog.ts');
  for (const line of [
    "  'welcome.pingoGreeting': 'Hi, I\\'m Orbit.',",
    "  'welcome.pingoGreeting': 'Hola, soy Orbit.',",
  ]) {
    expect(catalog.split(line).length - 1).toBe(1);
  }
  expect(catalog).not.toContain('’');
});

it('#221 R2: ninguna cadena visible nombra a Pingo', () => {
  const files = sourceFiles();
  expect(files.map(path => relative(sourceRoot, path))).toEqual(expect.arrayContaining([
    'i18n/catalog.ts',
    'screens/welcome/index.tsx',
    'components/empty-state.tsx',
    'app/(tabs)/_layout.tsx',
  ]));
  const allFiles = [...files, ...['app.json', 'app.config.ts', 'package.json'].map(path => join(process.cwd(), path))];
  expect(allFiles.filter(path => /\bPingo\b/.test(fs.readFileSync(path, 'utf8')))
    .map(path => relative(process.cwd(), path))).toEqual([]);
});

it('#221 R2: ninguna cadena visible nombra a Pingo en los valores del catálogo', () => {
  const catalogs = readSource('i18n/catalog.ts').match(/^export const (?:en|es)\b[^=]*= \{[\s\S]*?^\}/gm) ?? [];
  expect(catalogs).toHaveLength(2);
  for (const catalog of catalogs) {
    const entries = [...catalog.matchAll(/^  '([^']+)':\s*('(?:\\.|[^'\\])*'|"(?:\\.|[^"\\])*"),/gm)];
    const keys = [...catalog.matchAll(/^  '([^']+)':/gm)].map(match => match[1]);
    expect(keys.length).toBeGreaterThan(0);
    expect(entries.map(match => match[1])).toEqual(keys);
    expect(entries.filter(match => /pingo/i.test(match[2])).map(match => match[1])).toEqual([]);
  }
});
