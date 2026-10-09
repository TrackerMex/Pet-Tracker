import { fireEvent, render, screen, within } from '@testing-library/react-native';
import { HeroUINativeProvider } from 'heroui-native';
import { View } from 'react-native';

import { en, es } from '../../i18n/catalog';
import { EmptyState } from '../empty-state';

const { readFileSync, readdirSync } = jest.requireActual<typeof import('fs')>('fs');
const { join } = jest.requireActual<typeof import('path')>('path');
const enCatalog: Record<string, string> = en;
const esCatalog: Record<string, string> = es;

const copyRows = [
  ["common.noPetsBody", "Add your pet and I'll help you know where they are and how they're doing.", "Añade a tu mascota y te ayudo a saber dónde está y cómo está."],
  ["alerts.emptyBody", "All is calm. If anything happens, I'll let you know here.", "Todo está tranquilo. Si pasa algo, te aviso aquí."],
  ["reminders.emptyBody", "Once you create a reminder, I'll let you know on time.", "Cuando crees un recordatorio, te aviso a tiempo."],
  ["geofences.emptyBody", "Once there's a safe zone, I'll let you know if your pet leaves it.", "Cuando haya una zona segura, te aviso si tu mascota sale de ella."],
  ["food.noMealPlanBody", "Once there's a plan, I'll help you keep track of every meal.", "Cuando haya un plan, te ayudo a llevar la cuenta de cada comida."],
  ["docs.emptyBody", "When your pet's medical documents arrive, I'll keep them here.", "Cuando lleguen los documentos médicos de tu mascota, te los guardo aquí."],
] as const;

function languageDesign(): string {
  return readFileSync(join(process.cwd(), '..', 'specs', 'mobile-ui-language', 'design.md'), 'utf8');
}

describe('#155 R1: el copy de los vacíos existe en los dos idiomas', () => {
  it.each(copyRows)('declara %s en inglés y en español', (key, english, spanish) => {
    expect(enCatalog[key]).toBe(english);
    expect(esCatalog[key]).toBe(spanish);
  });

  it.each(copyRows.map(([key]) => key))('%s no exclama, no lleva emoji y termina en punto en los dos idiomas', (key) => {
    for (const v of [enCatalog[key], esCatalog[key]]) {
      expect(v).not.toMatch(/[!¡]/);
      expect(v).not.toMatch(/\p{Extended_Pictographic}/u);
      expect(v).toMatch(/\.$/);
    }
  });

  it('registra las claves en la tabla de mobile-ui-language', () => {
    expect(languageDesign()).toContain('### §2.21 — Añadidos por #155 — Pingo en los estados vacíos');
  });

  it.each(copyRows.map(([key]) => key))('%s tiene fila de #155 en mobile-ui-language', (key) => {
    expect(languageDesign()).toMatch(new RegExp('\\| — \\| `'+key.replace('.', '\\.')+'`[^\\n]*← (?:añadida|cambiada) por #155 \\(R1\\)'));
  });
});


describe('#155 R2: las poses de los vacíos entran como WebP', () => {
  it.each([
    'pingo-talk.webp', 'pingo-sleep.webp', 'pingo-clipboard.webp',
    'pingo-health.webp', 'pingo-collar.webp', 'pingo-food.webp',
  ])('%s es un WebP con alfa de 1024×1024 y como mucho 100 000 bytes', (name) => {
    const bytes = readFileSync(join(process.cwd(), 'assets', 'images', name));
    expect(bytes.toString('ascii', 0, 4)).toBe('RIFF');
    expect(bytes.toString('ascii', 8, 12)).toBe('WEBP');
    expect(bytes.toString('ascii', 12, 16)).toBe('VP8X');
    expect(bytes[20] & 0x10).not.toBe(0);
    expect(bytes[20] & 0x02).toBe(0);
    expect(bytes.readUIntLE(24, 3) + 1).toBe(1024);
    expect(bytes.readUIntLE(27, 3) + 1).toBe(1024);
    expect(bytes.length).toBeLessThanOrEqual(100000);
  });
});

async function renderProbe(action?: { label: string; onPress: () => void }) {
  await render(
    <HeroUINativeProvider>
      <View testID="probe-frame">
        <EmptyState testID="probe" pose="talk" title="Título de prueba" body="Cuerpo de prueba." action={action} />
      </View>
    </HeroUINativeProvider>,
  );
}

describe('#155 R3: un único componente pinta los vacíos ilustrados', () => {
  it.each([
    ['talk', /assets\/images\/pingo-talk\.webp$/],
    ['sleep', /assets\/images\/pingo-sleep\.webp$/],
    ['clipboard', /assets\/images\/pingo-clipboard\.webp$/],
    ['health', /assets\/images\/pingo-health\.webp$/],
    ['collar', /assets\/images\/pingo-collar\.webp$/],
    ['food', /assets\/images\/pingo-food\.webp$/],
  ] as const)('pinta la pose %s a 160×160 y sin etiqueta', async (pose, source) => {
    await render(
      <HeroUINativeProvider>
        <EmptyState testID="probe" pose={pose} title="Título de prueba" body="Cuerpo de prueba." />
      </HeroUINativeProvider>,
    );
    const image = await screen.findByTestId('probe-pose');
    expect(image.props.source).toEqual([
      expect.objectContaining({ testUri: expect.stringMatching(source) }),
    ]);
    expect(image.props.style).toEqual({ width: 160, height: 160 });
    expect(image.props.contentFit).toBe('contain');
    expect(image.props.accessibilityLabel).toBeUndefined();
    expect(image.props.className).toBeUndefined();
  });

  it('pinta el contenedor sin tarjeta', async () => {
    await renderProbe();
    expect(await screen.findByTestId('probe')).toHaveProp('className', 'items-center gap-3 py-8');
  });

  it('pinta el título y el cuerpo con sus clases', async () => {
    await renderProbe();
    const title = await screen.findByTestId('probe-title');
    expect(title).toHaveTextContent('Título de prueba');
    expect(title.props.className).toBe('text-center text-lg font-bold text-foreground');
    expect(screen.getByTestId('probe-body')).toHaveTextContent('Cuerpo de prueba.');
    expect(screen.getByTestId('probe-body').props.className).toBe('text-center font-normal text-muted');
  });

  it('sin acción no pinta botón', async () => {
    await renderProbe();
    await screen.findByTestId('probe-title');
    expect(screen.queryByTestId('probe-action')).toBeNull();
  });

  it('con acción pinta el botón y lo pulsa una vez', async () => {
    const onPress = jest.fn();
    await renderProbe({ label: 'Acción de prueba', onPress });
    const button = await screen.findByTestId('probe-action');
    expect(within(button).getByText('Acción de prueba')).toBeVisible();
    await fireEvent.press(button);
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('declara el botón primario sin labio', () => {
    const source = readFileSync(join(process.cwd(), 'src', 'components', 'empty-state.tsx'), 'utf8');
    expect(source).toContain('className="rounded-xl bg-accent"');
    expect(source).toContain('className="font-bold text-accent-foreground"');
    expect(source).not.toMatch(/border-b-4/);
  });

  it('con acción pinta pose, título, cuerpo y botón como hijos directos, en ese orden', async () => {
    await renderProbe({ label: 'Acción de prueba', onPress: jest.fn() });
    const root = await screen.findByTestId('probe');
    expect(root.parent).toBe(screen.getByTestId('probe-frame'));
    expect(root.type).toBe('View');
    expect(root.props.style).toBeUndefined();
    expect(root.children.map((child) => (typeof child === 'string' ? child : (child.props.testID ?? child.type)))).toEqual(['probe-pose', 'probe-title', 'probe-body', 'probe-action']);
  });

  it('sin acción pinta pose, título y cuerpo como hijos directos, en ese orden', async () => {
    await renderProbe();
    const root = await screen.findByTestId('probe');
    expect(root.parent).toBe(screen.getByTestId('probe-frame'));
    expect(root.type).toBe('View');
    expect(root.props.style).toBeUndefined();
    expect(root.children.map((child) => (typeof child === 'string' ? child : (child.props.testID ?? child.type)))).toEqual(['probe-pose', 'probe-title', 'probe-body']);
  });

  it('declara el botón sin size ni variant', () => {
    const source = readFileSync(join(process.cwd(), 'src', 'components', 'empty-state.tsx'), 'utf8');
    expect(source.match(/<Button[\s>]/g)).toHaveLength(1);
    expect(source).toContain('<Button testID={`${testID}-action`} className="rounded-xl bg-accent" onPress={action.onPress}>');
  });
});

function sourceFiles(directory = join(process.cwd(), 'src')): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return entry.name === '__tests__' ? [] : sourceFiles(path);
    return /\.tsx?$/.test(entry.name) && !/\.test\.tsx?$/.test(entry.name) ? [path] : [];
  });
}

describe('#155 R10: los vacíos que no se ilustran siguen en texto', () => {
  it.each([
    ['src/screens/health/index.tsx', 'Text', 'vaccines-empty'],
    ['src/screens/health/index.tsx', 'Text', 'weight-card-empty'],
    ['src/components/weight-chart.tsx', 'Text', 'weight-chart-empty'],
    ['src/screens/home/weekly-activity-chart.tsx', 'Text', 'weekly-activity-empty'],
    ['src/screens/meals-history/index.tsx', 'Text', 'meals-history-empty'],
    ['src/screens/meals-history/index.tsx', 'Text', 'meals-history-detail-empty'],
    ['src/screens/meal-schedule/index.tsx', 'Text', 'nutrition-profile-empty'],
    ['src/screens/meal-schedule/index.tsx', 'Text', 'meal-schedule-empty'],
    ['src/screens/profile/index.tsx', 'Text', 'profile-pets-empty'],
    ['src/screens/weight-log/index.tsx', 'Text', 'weight-log-empty'],
    ['src/screens/map/index.tsx', 'Text', 'map-empty'],
    ['src/screens/map/index.tsx', 'Card', 'map-empty-overlay'],
  ])('%s abre <%s testID="%s"> una sola vez', (path, tag, testID) => {
    const source = readFileSync(join(process.cwd(), path), 'utf8');
    expect(source.match(new RegExp('<' + tag + '\\s+testID="' + testID + '"', 'g')) ?? []).toHaveLength(1);
  });

  it.each([
    ['src/screens/home/index.tsx', 1],
    ['src/screens/health/index.tsx', 1],
    ['src/app/(tabs)/food.tsx', 2],
    ['src/screens/map/index.tsx', 2],
    ['src/screens/alerts/index.tsx', 1],
    ['src/screens/reminders/index.tsx', 1],
    ['src/screens/docs/index.tsx', 1],
    ['src/screens/geofences/index.tsx', 2],
  ] as const)('%s pinta %i EmptyState', (path, n) => {
    const source = readFileSync(join(process.cwd(), path), 'utf8');
    expect(source.match(/<EmptyState\b/g) ?? []).toHaveLength(n);
  });

  it('ningún otro fichero usa EmptyState', () => {
    const files = sourceFiles()
      .filter((path) => /<EmptyState\b/.test(readFileSync(path, 'utf8')))
      .map((path) => path.slice(process.cwd().length + 1))
      .sort();
    expect(files).toEqual([
      'src/app/(tabs)/food.tsx',
      'src/screens/alerts/index.tsx',
      'src/screens/docs/index.tsx',
      'src/screens/geofences/index.tsx',
      'src/screens/health/index.tsx',
      'src/screens/home/index.tsx',
      'src/screens/map/index.tsx',
      'src/screens/reminders/index.tsx',
    ]);
  });
});


describe('#155 R11: los vacíos no traen movimiento ni dependencias', () => {
  it('EmptyState solo importa de react, react-native, expo-image y heroui-native', () => {
    const source = readFileSync(join(process.cwd(), 'src', 'components', 'empty-state.tsx'), 'utf8');
    for (const [, specifier] of source.matchAll(/from '([^']+)'/g)) {
      expect(['react', 'react-native', 'expo-image', 'heroui-native']).toContain(specifier);
    }
  });

  it('EmptyState no anima', () => {
    const source = readFileSync(join(process.cwd(), 'src', 'components', 'empty-state.tsx'), 'utf8');
    expect(source).not.toMatch(/react-native-reanimated|entering=|MOTION_/);
  });

  it('EmptyState importa exactamente Image, Button, Text y View', () => {
    const source = readFileSync(join(process.cwd(), 'src', 'components', 'empty-state.tsx'), 'utf8');
    expect(source.match(/^import\b.*$/gm)).toEqual([
      "import { Image } from 'expo-image';",
      "import { Button } from 'heroui-native';",
      "import { Text, View } from 'react-native';",
    ]);
    expect(source.match(/\brequire\(/g)).toHaveLength(6);
  });

  it('EmptyState no anima con Animated, LayoutAnimation ni transiciones', () => {
    const source = readFileSync(join(process.cwd(), 'src', 'components', 'empty-state.tsx'), 'utf8');
    expect(source).not.toMatch(/\bAnimated\b|LayoutAnimation|transition|animate-/);
  });
});


const noCollarRows = [
  ['map.noTrackingTitle', 'No live location', 'Sin ubicación en vivo'],
  ['map.noTrackingBody', "Once your pet has a collar with an active plan, I'll show you where they are.", 'Cuando tu mascota tenga un collar con plan activo, te muestro dónde está.'],
  ['geofences.noTrackingTitle', 'Safe zones unavailable', 'Zonas seguras no disponibles'],
  ['geofences.noTrackingBody', "Once your pet has a collar with an active plan, I'll let you know if they leave a safe zone.", 'Cuando tu mascota tenga un collar con plan activo, te aviso si sale de una zona segura.'],
] as const;

function section159(): string {
  const source = languageDesign();
  const start = source.indexOf('### §2.23 — Añadidos por #159 — Pingo sin collar');
  return start === -1 ? '' : source.slice(start, source.indexOf('\n## 3. La infraestructura', start));
}

describe('#159 R1: el copy sin collar existe en los dos idiomas', () => {
  it.each(noCollarRows)('declara %s en inglés y en español', (key, english, spanish) => {
    expect(enCatalog[key]).toBe(english);
    expect(esCatalog[key]).toBe(spanish);
  });

  it.each(['map.noTrackingBody', 'geofences.noTrackingBody'])('%s no exclama, no lleva emoji y termina en punto en los dos idiomas', (key) => {
    for (const v of [enCatalog[key], esCatalog[key]]) {
      expect(typeof v).toBe('string');
      expect(v).not.toMatch(/[!¡]/);
      expect(v).not.toMatch(/\p{Extended_Pictographic}/u);
      expect(v).toMatch(/\.$/);
    }
  });

  it.each(['map.noTrackingTitle', 'geofences.noTrackingTitle'])('%s no exclama, no lleva emoji y no termina en punto en los dos idiomas', (key) => {
    for (const v of [enCatalog[key], esCatalog[key]]) {
      expect(typeof v).toBe('string');
      expect(v).not.toMatch(/[!¡]/);
      expect(v).not.toMatch(/\p{Extended_Pictographic}/u);
      expect(v).not.toMatch(/\.$/);
    }
  });

  it('abre la sección §2.23 en mobile-ui-language tras §2.21 y antes de la infraestructura', () => {
    const source = languageDesign();
    const header = '### §2.23 — Añadidos por #159 — Pingo sin collar';
    expect(source).toContain(header);
    expect(source.indexOf('### §2.21 — Añadidos por #155')).toBeLessThan(source.indexOf(header));
    expect(source.indexOf(header)).toBeLessThan(source.indexOf('## 3. La infraestructura'));
  });

  it.each(noCollarRows)('%s tiene fila de #159 en mobile-ui-language', (key, english, spanish) => {
    expect(section159()).toContain(`| — | \`${key}\` | \`${english}\` | \`${spanish}\` | ← añadida por #159 (R1) |`);
  });
});


describe('#159 R2: el texto de rastreo en vivo se retira', () => {
  it('map.trackingNeedsCollar ya no existe en ningún idioma y queda retirada en mobile-ui-language', () => {
    expect(Object.keys(enCatalog)).not.toContain('map.trackingNeedsCollar');
    expect(Object.keys(esCatalog)).not.toContain('map.trackingNeedsCollar');
    expect(section159()).toContain('| — | `map.trackingNeedsCollar` ← retirada por #159 (R2) | `Live tracking requires a collar` | `El rastreo en vivo requiere un collar` |');
  });

  it('docs/verification.md describe a Pingo en el paso 5 del plan Free', () => {
    const source = readFileSync(join(process.cwd(), '..', 'docs', 'verification.md'), 'utf8');
    expect(source).toContain('el tab Map muestra a Pingo con `No live location`, sin el botón `Pair a collar` (la mascota ya tiene collar)');
    expect(source).not.toContain('Live tracking requires a collar');
  });
});

describe('#159 R7: la guarda del editor sigue en texto y dice la verdad', () => {
  it('geofences.needsCollar tiene fila de #159 en mobile-ui-language', () => {
    expect(section159()).toContain('| — | `geofences.needsCollar` | `Safe zones need a collar with an active plan.` | `Las zonas seguras necesitan un collar con plan activo.` | ← cambiada por #159 (R7) |');
  });

  it('el editor abre <Card testID="geofence-editor-no-tracking"> una sola vez y no usa EmptyState', () => {
    const source = readFileSync(join(process.cwd(), 'src', 'screens', 'geofence-editor', 'index.tsx'), 'utf8');
    expect(source.match(/<Card\s+testID="geofence-editor-no-tracking"/g) ?? []).toHaveLength(1);
    expect(source).not.toMatch(/<EmptyState\b/);
  });
});

describe('#159 R8: la nota de Inicio sigue en texto y dice la verdad', () => {
  it('home.activityNeedsCollar declara el literal nuevo en inglés y en español', () => {
    expect(enCatalog['home.activityNeedsCollar']).toBe('Activity needs a collar with an active plan');
    expect(esCatalog['home.activityNeedsCollar']).toBe('La actividad necesita un collar con plan activo');
  });

  it('home.activityNeedsCollar no exclama, no lleva emoji y no termina en punto en los dos idiomas', () => {
    for (const v of [enCatalog['home.activityNeedsCollar'], esCatalog['home.activityNeedsCollar']]) {
      expect(typeof v).toBe('string');
      expect(v).not.toMatch(/[!¡]/);
      expect(v).not.toMatch(/\p{Extended_Pictographic}/u);
      expect(v).not.toMatch(/\.$/);
    }
  });

  it('home.activityNeedsCollar tiene fila de #159 en mobile-ui-language', () => {
    expect(section159()).toContain('| — | `home.activityNeedsCollar` | `Activity needs a collar with an active plan` | `La actividad necesita un collar con plan activo` | ← cambiada por #159 (R8) |');
  });

  it('Inicio abre <Text testID="summary-note"> una sola vez', () => {
    const source = readFileSync(join(process.cwd(), 'src', 'screens', 'home', 'index.tsx'), 'utf8');
    expect(source.match(/<Text\s+testID="summary-note"/g) ?? []).toHaveLength(1);
  });
});

describe('#159 R9: los estados sin collar no traen movimiento ni dependencias', () => {
  it.each([
    ['src/screens/map/index.tsx', 'react-native-reanimated'],
    ['src/screens/map/index.tsx', '\\bAnimated\\b'],
    ['src/screens/map/index.tsx', 'LayoutAnimation'],
    ['src/screens/map/index.tsx', 'entering='],
    ['src/screens/map/index.tsx', 'MOTION_'],
    ['src/screens/geofences/index.tsx', 'react-native-reanimated'],
    ['src/screens/geofences/index.tsx', '\\bAnimated\\b'],
    ['src/screens/geofences/index.tsx', 'LayoutAnimation'],
    ['src/screens/geofences/index.tsx', 'entering='],
    ['src/screens/geofences/index.tsx', 'MOTION_'],
  ])('%s no contiene %s', (path, pattern) => {
    const source = readFileSync(join(process.cwd(), path), 'utf8');
    expect(source).not.toMatch(new RegExp(pattern));
  });
});
