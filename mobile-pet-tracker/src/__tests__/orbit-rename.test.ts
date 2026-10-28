const fs = jest.requireActual<typeof import('fs')>('fs');
const { dirname, join, relative, resolve, sep } = jest.requireActual<typeof import('path')>('path');
const sourceRoot = join(process.cwd(), 'src');
const imagesRoot = join(process.cwd(), 'assets', 'images');

function sourceFiles(directory = sourceRoot): string[] {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? sourceFiles(path) : [path];
  });
}

const isTestPath = (path: string) =>
  relative(sourceRoot, path).split(sep).includes('__tests__') || /\.test\./.test(path.split(sep).pop() ?? '');
const productionFiles = () => sourceFiles().filter(path => /\.(ts|tsx|js|jsx|json|css)$/.test(path) && !isTestPath(path));
const testFiles = () => sourceFiles().filter(path => /\.(ts|tsx)$/.test(path) && isTestPath(path));

it('#225 R2: las nueve poses se llaman orbit-* y todo require de imagen resuelve', () => {
  const images = fs.readdirSync(imagesRoot);
  expect(images.filter(name => /pingo/i.test(name))).toEqual([]);
  expect(images).toEqual(expect.arrayContaining([
    'orbit-celebrate.webp',
    'orbit-clipboard.webp',
    'orbit-collar.webp',
    'orbit-food.webp',
    'orbit-health.webp',
    'orbit-sleep.webp',
    'orbit-talk.webp',
    'orbit-wave.webp',
    'orbit-wave-blink.webp',
  ]));

  const requires = [...productionFiles(), ...testFiles()].flatMap(path =>
    [...fs.readFileSync(path, 'utf8').matchAll(/require\('([^']*assets\/images\/[^']+\.webp)'\)/g)]
      .map(match => ({ file: relative(sourceRoot, path), target: resolve(dirname(path), match[1]) })));
  expect(requires.length).toBeGreaterThan(0);
  expect(requires.filter(({ target }) => !fs.existsSync(target))
    .map(({ file, target }) => `${file}: ${relative(process.cwd(), target)}`)).toEqual([]);
});

const renamedKeys = [
  { old: 'welcome.pingoGreeting', key: 'welcome.orbitGreeting', file: 'src/screens/welcome/index.tsx', en: "Hi, I'm Orbit.", es: 'Hola, soy Orbit.' },
  { old: 'login.pingoGreeting', key: 'login.orbitGreeting', file: 'src/screens/login/index.tsx', en: 'Good to see you again.', es: 'Qué bueno verte de nuevo.' },
  { old: 'addPet.pingoGreeting', key: 'addPet.orbitGreeting', file: 'src/screens/add-pet/index.tsx', en: 'Hi. Tell me about your new companion.', es: '¡Hola! Cuéntame de tu nuevo compañero.' },
  {
    old: 'home.pingoPhraseWalkMeals',
    key: 'home.orbitPhraseWalkMeals',
    file: 'src/screens/home/orbit-phrase.ts',
    en: '{{petName}} has walked {{km}} today and has had {{served}} of {{total}} meals.',
    es: '{{petName}} ya caminó {{km}} hoy y lleva {{served}} de {{total}} comidas.',
  },
  { old: 'home.pingoPhraseWalk', key: 'home.orbitPhraseWalk', file: 'src/screens/home/orbit-phrase.ts', en: '{{petName}} has walked {{km}} today.', es: '{{petName}} ya caminó {{km}} hoy.' },
  {
    old: 'home.pingoPhraseMeals',
    key: 'home.orbitPhraseMeals',
    file: 'src/screens/home/orbit-phrase.ts',
    en: '{{petName}} has had {{served}} of {{total}} meals today.',
    es: '{{petName}} lleva {{served}} de {{total}} comidas hoy.',
  },
  { old: 'home.pingoPhraseCalm', key: 'home.orbitPhraseCalm', file: 'src/screens/home/orbit-phrase.ts', en: "I'm keeping an eye on {{petName}}.", es: 'Estoy pendiente de {{petName}}.' },
];

it('#225 R3: el código de producción no nombra a Pingo ni en contenido ni en rutas', () => {
  expect(productionFiles()
    .map(path => relative(sourceRoot, path))
    .filter(path => /pingo/i.test(path) || /pingo/i.test(fs.readFileSync(join(sourceRoot, path), 'utf8')))).toEqual([]);
});

it('#225 R3: los módulos renombrados exportan los nombres nuevos y no los viejos', () => {
  expect(fs.existsSync(join(sourceRoot, 'components/orbit-float.tsx'))).toBe(true);
  const float = jest.requireActual<Record<string, unknown>>('../components/orbit-float');
  expect(typeof float.OrbitFloat).toBe('function');
  expect(Object.keys(float).filter(key => /pingo/i.test(key))).toEqual([]);

  expect(fs.existsSync(join(sourceRoot, 'theme/orbit-stage.ts'))).toBe(true);
  const stage = jest.requireActual<Record<string, unknown>>('../theme/orbit-stage');
  expect(stage.ORBIT_STAGE_SHADOW_COLOR).toBe('rgba(13,17,23,0.10)');
  expect(stage.ORBIT_STAGE_PAW_OPACITY).toBe(0.18);
  expect(Object.keys(stage).filter(key => /pingo/i.test(key))).toEqual([]);

  const motion = jest.requireActual<Record<string, unknown>>('../theme/motion');
  expect(motion.MOTION_ORBIT_FLOAT_OFFSET_Y).toBe(10);
  expect(motion.MOTION_ORBIT_FLOAT_TIMING).toMatchObject({ duration: 1500 });
  expect(Object.keys(motion).filter(key => /PINGO/.test(key))).toEqual([]);

  expect(fs.existsSync(join(sourceRoot, 'screens/home/orbit-phrase.ts'))).toBe(true);
  const phrase = jest.requireActual<Record<string, unknown>>('../screens/home/orbit-phrase');
  expect(typeof phrase.homeOrbitPhrase).toBe('function');

  expect(['components/pingo-float.tsx', 'theme/pingo-stage.ts', 'screens/home/pingo-phrase.ts']
    .filter(path => fs.existsSync(join(sourceRoot, path)))).toEqual([]);
});

it('#225 R3: el catálogo renombra las siete claves con los mismos valores', () => {
  const { en, es } = jest.requireActual<{ en: Record<string, string>; es: Record<string, string> }>('../i18n/catalog');
  expect(renamedKeys.map(({ old, key }) => ({ key, en: en[key], es: es[key], old: old in en || old in es })))
    .toEqual(renamedKeys.map(({ key, en: enValue, es: esValue }) => ({ key, en: enValue, es: esValue, old: false })));
});

it('#225 R3: el inventario de copy y la tabla de idioma registran las claves nuevas', () => {
  const table = fs.readFileSync(join(sourceRoot, '__tests__/ui-copy-table.ts'), 'utf8');
  expect(renamedKeys.map(({ key }) => [key, table.split(`key: '${key}'`).length - 1]))
    .toEqual(renamedKeys.map(({ key }) => [key, 1]));
  expect(renamedKeys.filter(({ key, file }) => !table.includes(`{ file: '${file}', key: '${key}' }`)).map(({ key }) => key))
    .toEqual([]);
  expect([...table.matchAll(/\{ file: '[^']*', key: '[^']*' \}/g)].map(([row]) => row).filter(row => /pingo/i.test(row)))
    .toEqual([]);

  const designPath = join(process.cwd(), '..', 'specs', 'mobile-ui-language', 'design.md');
  expect(fs.existsSync(designPath)).toBe(true);
  const design = fs.readFileSync(designPath, 'utf8');
  expect([...design.matchAll(/^### §2\.\d+ — Añadidos por #225 — Orbit renombrado y su pose de actividad$/gm)]).toHaveLength(1);
  expect(renamedKeys
    .map(({ old, key, en, es }) => `| — | \`${key}\` | \`${en}\` | \`${es}\` | ← renombrada desde \`${old}\` por #225 (R3) |`)
    .filter(row => !design.includes(row))).toEqual([]);
});

const exceptions = [
  { file: '__tests__/account-screens-polish.test.ts', snippet: "'PingoFloat', 'MOTION_PINGO_FLOAT_OFFSET_Y', 'forgot-lock-tile',", lines: 1 },
  { file: '__tests__/account-flow-canvas-fidelity.test.ts', snippet: "'PingoFloat',", lines: 1 },
  { file: '__tests__/add-pet-two-steps.test.ts', snippet: "const radiusRule = 'Fuera de la escala, por fidelidad al canvas (#191)", lines: 1 },
  { file: '__tests__/home-pingo-phrase.test.ts', snippet: '## Enmienda #190 — Burbuja de Pingo en Inicio', lines: 1 },
  { file: '__tests__/home-pingo-phrase.test.ts', snippet: 'por `mobile-home-pingo-phrase` (#190)', lines: 1 },
  { file: '__tests__/home-pingo-phrase.test.ts', snippet: '**Pingo flota en la burbuja de Inicio.**', lines: 1 },
  { file: '__tests__/home-pingo-phrase.test.ts', snippet: '**La burbuja de Pingo.**', lines: 1 },
  { file: 'components/__tests__/celebration.test.tsx', snippet: '— confeti, ping y flotación de la celebración', lines: 1 },
  { file: 'components/__tests__/empty-state.test.tsx', snippet: '§2.21 — Añadidos por #155 — Pingo en los estados vacíos', lines: 1 },
  { file: 'components/__tests__/empty-state.test.tsx', snippet: '§2.23 — Añadidos por #159 — Pingo sin collar', lines: 2 },
  { file: 'components/__tests__/empty-state.test.tsx', snippet: 'el tab Map muestra a Pingo con', lines: 1 },
  { file: 'providers/__tests__/language-provider.test.tsx', snippet: '§2.24 — Añadidos por #167 — Pingo en las pantallas de cuenta', lines: 1 },
  { file: 'providers/__tests__/language-provider.test.tsx', snippet: "= 'login.pingoGreeting';", lines: 1 },
  { file: 'screens/welcome/index.test.tsx', snippet: '§2.20 — Añadidos por #153 — Pingo en la bienvenida', lines: 1 },
  { file: 'screens/welcome/index.test.tsx', snippet: '.pingoGreeting`[^', lines: 1 },
  { file: '__tests__/orbit-rename-copy.test.ts', snippet: String.raw`/\bPingo\b/`, lines: 1 },
  { file: '__tests__/orbit-rename-copy.test.ts', snippet: '/pingo/i.test(match[2])', lines: 1 },
  { file: '__tests__/orbit-charter-voice.test.ts', snippet: "block.split('**7. Voz de Pingo')", lines: 1 },
  { file: '__tests__/orbit-charter-voice.test.ts', snippet: '**Orbit** (antes Pingo).', lines: 1 },
  { file: '__tests__/orbit-charter-voice.test.ts', snippet: 'conservan «Pingo»', lines: 1 },
  { file: '__tests__/orbit-charter-voice.test.ts', snippet: String.raw`/\bPingo\b/`, lines: 1 },
];

const scannedTestFiles = () => testFiles()
  .map(path => relative(sourceRoot, path).split(sep).join('/'))
  .filter(path => path !== '__tests__/orbit-rename.test.ts' && path !== '__tests__/orbit-activity-pose.test.ts');
const titleLiteral = /^(\s*(?:describe|it|test)(?:\.(?:each|only|skip))?(?:\([\s\S]*?\))?\()(['"`])(?:\\.|(?!\2).)*\2/;

it('#225 R4: el código de test solo nombra a Pingo en títulos, comentarios y pins de documento', () => {
  expect(scannedTestFiles().flatMap(file => {
    const snippets = exceptions.filter(entry => entry.file === file).map(entry => entry.snippet);
    return fs.readFileSync(join(sourceRoot, file), 'utf8').split('\n').flatMap((line, index) => {
      const trimmed = line.trim();
      if (trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*')) return [];
      const code = line.split(' // ')[0].replace(titleLiteral, '$1');
      if (!/pingo/i.test(code) || snippets.some(snippet => line.includes(snippet))) return [];
      return [`${file}:${index + 1}: ${trimmed}`];
    });
  })).toEqual([]);
});

it('#225 R4: cada excepción casa exactamente las líneas declaradas (enmendado por #225 R9)', () => {
  const files = scannedTestFiles();
  expect(exceptions.flatMap(({ file, snippet, lines }) => {
    const matched = files.includes(file)
      ? fs.readFileSync(join(sourceRoot, file), 'utf8').split('\n').filter(line => line.includes(snippet) && /pingo/i.test(line)).length
      : 0;
    return matched === lines ? [] : [`${file}: ${snippet} declara ${lines}, casa ${matched}`];
  })).toEqual([]);
});
