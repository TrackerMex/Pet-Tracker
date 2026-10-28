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

it('#221 R3: los identificadores pingo-* no cambian aquí', () => {
  const catalog = readSource('i18n/catalog.ts');
  expect(catalog.split("'welcome.pingoGreeting':").length - 1).toBe(2);
  expect([...catalog.matchAll(/^  '([^']+)':/gm)].map(match => match[1])
    .filter(key => /orbit/i.test(key))).toEqual([]);

  const welcome = readSource('screens/welcome/index.tsx');
  for (const anchor of [
    "t('welcome.pingoGreeting')",
    'testID="welcome-bubble-text"',
    'testID="welcome-pingo-float"',
  ]) {
    expect(welcome.split(anchor).length - 1).toBe(1);
  }
  const copyTable = readSource('__tests__/ui-copy-table.ts');
  expect(copyTable.split("{ file: 'src/screens/welcome/index.tsx', key: 'welcome.pingoGreeting' }").length - 1).toBe(1);

  const images = fs.readdirSync(join(process.cwd(), 'assets', 'images'));
  expect(images.filter(name => /orbit/i.test(name))).toEqual([]);
  expect(images.filter(name => /^pingo-.*\.webp$/.test(name))).toHaveLength(9);

  for (const path of sourceFiles()) {
    const name = relative(sourceRoot, path);
    expect(name).not.toMatch(/orbit/i);
    const matches = fs.readFileSync(path, 'utf8').match(/orbit/gi) ?? [];
    expect(matches).toHaveLength(name === 'i18n/catalog.ts' ? 2 : 0);
  }
});
