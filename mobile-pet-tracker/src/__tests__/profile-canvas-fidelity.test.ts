interface DirectoryEntry {
  name: string;
  isDirectory: () => boolean;
}

declare function require(moduleName: 'fs'): {
  readdirSync: (path: string, options: { withFileTypes: true }) => DirectoryEntry[];
  readFileSync: (path: string, encoding: 'utf8') => string;
};

declare function require(moduleName: 'path'): {
  join: (...paths: string[]) => string;
};

const { readdirSync, readFileSync } = require('fs');
const { join } = require('path');
const sourceRoot = join(process.cwd(), 'src');
const repositoryRoot = join(process.cwd(), '..');

function sourceFiles(directory: string = sourceRoot): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      return entry.name === '__tests__' ? [] : sourceFiles(path);
    }
    return /\.tsx?$/.test(entry.name) && !/\.test\.tsx?$/.test(entry.name) ? [path] : [];
  });
}

function filesMatching(pattern: RegExp): string[] {
  return sourceFiles()
    .filter((path) => pattern.test(readFileSync(path, 'utf8')))
    .map((path) => path.slice(sourceRoot.length + 1))
    .sort();
}

describe('#173 R4: avatars solo en Perfil', () => {
  it('limita la variante nueva al consumidor Perfil (enmendado por #200 R2) (enmendado por #199 R13)', () => {
    expect(filesMatching(/variant="avatars"/)).toEqual(['screens/food/index.tsx', 'screens/health/index.tsx', 'screens/profile/index.tsx']); // #200 R2; #199 R13
  });
});

describe('#173 R2: inventario de radios nuevos', () => {
  it('reserva rounded-hero al Card compartido y el skeleton de Perfil (enmendado por #200 R3) (enmendado por #202 R7)', () => {
    expect(filesMatching(/\brounded-hero\b/)).toEqual(['components/card.tsx', 'components/confirm-dialog.tsx', 'screens/alert-detail/index.tsx', 'screens/food/index.tsx', 'screens/profile/index.tsx']); // #180 R10
  });
  it('reserva rounded-tile a sus consumidores aprobados (enmendado por #190 R13)', () => {
    expect(filesMatching(/\brounded-tile\b/)).toEqual([
      'screens/add-pet/index.tsx', // #191 R11
      'screens/add-reminder/index.tsx',
      'screens/geofences/index.tsx', // #189 R6 // #178 R12
      'screens/home/index.tsx', // (enmendado por #190 R13)
      'screens/pairing/index.tsx', // #188 R18
      'screens/profile/index.tsx',
    ]);
  });
});

describe('#173 R2.4: inventario de tamaños nuevos', () => {
  it('reserva text-26 al nombre de la mascota en Perfil (enmendado por #176 R8) (enmendado por #189 R1) (enmendado por #189 R8) (enmendado por #197 R19) (enmendado por #198 R15) (enmendado por #202 R1) (enmendado por #202 R17)', () => {
    expect(filesMatching(/\btext-26\b/)).toEqual([
      'components/empty-state.tsx', // (enmendado por #176 R8)
      'components/screen-header.tsx',
      'screens/alert-detail/index.tsx', // #180 R1
      'screens/alerts/index.tsx', // #174 R3
      'screens/docs/index.tsx', // #175 R5
      'screens/home/index.tsx', // #198 R15
      'screens/profile/index.tsx',
      'screens/reminders/index.tsx', // #178 R4
    ]);
  });
  it('limita text-13 a Perfil y a las pantallas de cuenta de #172 (E8) (enmendado por #189 R6) (enmendado por #200 R8) (enmendado por #199 R7) (enmendado por #199 R14) (enmendado por #198 R5)', () => {
    expect(filesMatching(/\btext-13\b/)).toEqual([
      'components/form-error.tsx',
      'screens/add-pet/index.tsx', // #191 R11
      'screens/add-reminder/index.tsx', // #178 R12
      'screens/alert-detail/index.tsx', // #180 R3
      'screens/alerts/index.tsx', // #174 R4, R6
      'screens/docs/index.tsx', // #175 R8
      'screens/edit-profile/index.tsx', // #194 R5
      'screens/food/index.tsx',
      'screens/forgot/index.tsx',
      'screens/geofences/index.tsx', // #189 R6
      'screens/health/index.tsx', // #199 R14
      'screens/home/index.tsx', // #198 R5
      'screens/login/index.tsx',
      'screens/meal-schedule/index.tsx', // #179 R6
      'screens/pairing/index.tsx', // #188 R18
      'screens/profile/index.tsx',
      'screens/register/index.tsx',
      'screens/reminders/index.tsx', // #178 R6
      'screens/reset-password/index.tsx',
      'screens/weight-log/index.tsx', // #199 R7
    ]);
  });
});

describe('#173 R3: Card hero y flat solo en Perfil', () => {
  it('Perfil y el detalle de alerta son los consumidores de Card hero (enmendado por #180 R3) (enmendado por #176 R2)', () => {
    expect(filesMatching(/<Card\b[^>]*\bvariant="hero"/s)).toEqual(['screens/alert-detail/index.tsx', 'screens/profile/index.tsx']); // (enmendado por #176 R2)
    const profile = readFileSync(join(sourceRoot, 'screens/profile/index.tsx'), 'utf8');
    expect(profile.match(/variant="hero"/g)).toHaveLength(1);
  });
  it('Perfil es el único consumidor de Card flat y lo usa dos veces (enmendado por #199 R7) (enmendado por #199 R16)', () => {
    expect(filesMatching(/variant="flat"/)).toEqual(['screens/health/index.tsx', 'screens/meal-schedule/index.tsx', 'screens/profile/index.tsx', 'screens/weight-log/index.tsx']); // #179 R6; #199 R7; #199 R16
    const profile = readFileSync(join(sourceRoot, 'screens/profile/index.tsx'), 'utf8');
    expect(profile.match(/variant="flat"/g)).toHaveLength(2);
  });
});

const amendedDocs173 = [
  ['docs/ui-guidelines.md', 'ui-guidelines', 'ver «Cambios en la carta»'],
  ['specs/mobile-pets-profile/requirements.md', 'mobile-pets-profile', 'R2: estructura de Perfil (hero, rejilla, Card flat) y métricas del artboard (padding 20, gap 14); R4: el tema se alterna con un Switch de etiqueta fija'],
  ['specs/mobile-ui-legibility-polish/requirements.md', 'mobile-ui-legibility-polish', '#61 R9: pet-info-card y me-card dejan de llevar etiqueta de sección'],
  ['specs/mobile-ui-consistency-polish/requirements.md', 'mobile-ui-consistency-polish', '#62 R4: la escala suma rounded-hero y rounded-tile; #62 R7: Perfil deja ChevronRight; #62 R14: Perfil aplica CONTINUOUS_CORNER una vez (ProfileTile)'],
  ['specs/mobile-ui-language/requirements.md', 'mobile-ui-language', '#65 R14: la fila de idioma muestra el idioma actual como valor'],
  ['specs/mobile-tab-headers-canvas/requirements.md', 'mobile-tab-headers-canvas', '#168 R4: profile-pet-card pasa a Card hero con anillo y cámara; #168 R5: chips con sexo localizado y font-extrabold; #168 R6: las filas pasan a tiles en rejilla 2×2; #168 R7: la identidad de la cuenta toma las medidas del artboard'],
  ['specs/mobile-device-pairing/requirements.md', 'mobile-device-pairing', 'R10: la fila de configuración GPS pasa al tile «Collar GPS»'],
  ['specs/mobile-geofences/requirements.md', 'mobile-geofences', '#41 R9: la fila de zonas seguras pasa a tile de la rejilla'],
  ['specs/mobile-chunky-cta/requirements.md', 'mobile-chunky-cta', '#166 R2: el primario de Perfil pasa a cápsula tonal sin labio (19 → 18 primarios)'],
  ['specs/mobile-home-weekly-activity/requirements.md', 'mobile-home-weekly-activity', '#68 E1: pet.sex deja de pintarse crudo'],
];

function canonicalAmendment173(feature: string, change: string): string {
  const design = readFileSync(join(repositoryRoot, 'specs/mobile-tab-screens-canvas-fidelity/design.md'), 'utf8');
  const fence = '```markdown\n## Enmienda #173 — Perfil fiel al canvas';
  const start = design.indexOf(fence);
  expect(start).toBeGreaterThan(-1);
  const body = design.slice(start + '```markdown\n'.length);
  const block = body.slice(0, body.indexOf('\n```')).replace('<FEATURE>', feature).replace('<QUÉ CAMBIA>', change);
  return block.slice(0, block.indexOf('- [ ] Enmienda #173 aprobada por humano')).trimEnd();
}

describe('#173 R14: enmiendas', () => {
  it.each(amendedDocs173)('lleva el bloque canónico y firma tolerante en %s', (file, feature, change) => {
    const source = readFileSync(join(repositoryRoot, file), 'utf8');
    expect(source).toContain(canonicalAmendment173(feature, change));
    const amendment = source.slice(source.lastIndexOf('## Enmienda #173 — Perfil fiel al canvas'));
    expect(amendment).toMatch(/- \[[ xX]\] Enmienda #173 aprobada por humano/);
  });
});

describe('#173 R14: la carta declara los cambios', () => {
  const charter = readFileSync(join(repositoryRoot, 'docs/ui-guidelines.md'), 'utf8');
  const normalize = (text: string) => text.replace(/\s+/g, ' ');

  it('declara los radios hero y tile en la regla 12', () => {
    const section = charter.slice(charter.indexOf('12. **Escala de radios**'), charter.indexOf('13. **Botón con cuerpo**'));
    expect(section).toContain('rounded-hero');
    expect(section).toContain('rounded-tile');
  });
  it('declara la cápsula tonal sin labio en la regla 13', () => {
    const section = charter.slice(charter.indexOf('13. **Botón con cuerpo**'), charter.indexOf('## Animación (decisiones por defecto)'));
    expect(section).toContain('bg-tab-pill');
  });
  it('declara las variantes nuevas de Card', () => {
    expect(charter).toContain('hero | flat');
  });
  it('declara los tokens de letra fuera de escala', () => {
    expect(charter).toContain('--text-13: 13px');
    expect(charter).toContain('--text-26: 26px');
  });
  it('declara la excepción de dimensiones en conventions', () => {
    const conventions = readFileSync(join(repositoryRoot, 'docs/conventions.md'), 'utf8');
    expect(normalize(conventions)).toContain(normalize('**Excepción nombrada (fidelidad al canvas, 2026-10-13)**: una pantalla llevada al canvas aprobado (directiva del humano «el diseño final debe de quedar como el artifact») usa las métricas de su artboard: padding lateral 20 en vez de 24 y el `gap` que el artboard dibuja. El resto de reglas de esta viñeta se mantiene; la spec de cada pantalla nombra sus valores.'));
  });
  it('declara la excepción de dimensiones en la regla 6 de la carta', () => {
    expect(normalize(charter)).toContain(normalize('**Excepción nombrada (fidelidad al canvas, 2026-10-13)**: una pantalla llevada al canvas aprobado usa padding lateral 20 y el `gap` de su artboard; ver conventions.md §Dimensiones, misma excepción.'));
  });
});

describe('#173 R15: grep-limpio', () => {
  it.each(['screens/profile/index.tsx', 'components/card.tsx', 'components/pet-switcher.tsx'])('%s no tiene escapes de estilo', (file) => {
    const source = readFileSync(join(sourceRoot, file), 'utf8');
    const classSections: string[] = source.match(/className=(?:"[^"]*"|\{[\s\S]*?\}(?=[\s>]))/g) ?? [];
    const cardRecipes = source.match(/const variantClassNames = \{([\s\S]*?)\} as const;/)?.[1];
    if (cardRecipes) classSections.push(cardRecipes);
    for (const section of classSections) {
      const quotedClasses = section.match(/'[^']*'|"[^"]*"/g) ?? [];
      const templateClasses = section.replace(/\$\{[^}]*\}/g, '').match(/`[^`]*`/g) ?? [];
      for (const classes of [...quotedClasses, ...templateClasses]) {
        expect(classes).not.toMatch(/\[[^\]]*\]/);
      }
    }
    expect(source).not.toMatch(/#[0-9a-fA-F]{3,8}\b/);
    expect(source).not.toMatch(/StyleSheet\.create/);
    // #173 R3.2: surface y accent conservan su shadow-sm; ningún otro shadow-.
    expect(source.match(/\bshadow-/g) ?? []).toHaveLength(file === 'components/card.tsx' ? 2 : 0);
  });
});
