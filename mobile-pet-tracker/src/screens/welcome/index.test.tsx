import { act, fireEvent, render, screen } from '@testing-library/react-native';
import { Redirect, router } from 'expo-router';
import { HeroUINativeProvider } from 'heroui-native';
import type { ReactNode } from 'react';
import { StyleSheet } from 'react-native';
import { getAnimatedStyle, withRepeat } from 'react-native-reanimated';
import type { TestInstance } from 'test-renderer';

import { en, es } from '../../i18n/catalog';
import { useAuth, type AuthContextValue } from '../../providers/auth-provider';
import { LanguageProvider } from '../../providers/language-provider';
import { useThemeColors } from '../../theme/use-theme-colors';
import { WelcomeScreen } from './index';

declare function require(moduleName: './index'): Record<string, unknown>;

const mockWithRepeat = jest.mocked(withRepeat);

const { readFileSync, readdirSync } = jest.requireActual<typeof import('fs')>('fs');
const { join } = jest.requireActual<typeof import('path')>('path');
const sourceRoot = join(process.cwd(), 'src');
const mockUseReducedMotion = jest.fn<boolean, []>(() => false);

jest.mock('../../providers/auth-provider', () => ({ useAuth: jest.fn() }));
jest.mock('expo-router', () => ({
  router: { push: jest.fn(), replace: jest.fn() },
  Redirect: jest.fn(() => null),
}));
jest.mock('react-native-safe-area-context', () => ({
  ...jest.requireActual('react-native-safe-area-context'),
  useSafeAreaInsets: () => ({ top: 40, right: 0, bottom: 24, left: 0 }),
}));
jest.mock('../../theme/use-theme-colors', () => ({
  useThemeColors: jest.fn(() => ['accent-strong-ink']),
}));
jest.mock('react-native-reanimated', () => {
  const actual = jest.requireActual<typeof import('react-native-reanimated')>('react-native-reanimated');
  return { ...actual, __esModule: true, useReducedMotion: () => mockUseReducedMotion(), withRepeat: jest.fn((animation: unknown) => animation) };
});
jest.mock('reicon-react-native', () => {
  const actual = jest.requireActual<typeof import('reicon-react-native')>('reicon-react-native');
  const React = jest.requireActual<typeof import('react')>('react');
  const { View } = jest.requireActual<typeof import('react-native')>('react-native');
  const mockIcon = (testID: string) =>
    function MockIcon(props: Record<string, unknown>) {
      return React.createElement(View, { testID, ...props });
    };
  return {
    ...actual,
    Map: mockIcon('icon-map'),
    Stethoscope: mockIcon('icon-stethoscope'),
    ForkKnife: mockIcon('icon-fork-knife'),
  };
});
jest.mock('heroui-native', () => {
  const actual = jest.requireActual<typeof import('heroui-native')>('heroui-native');
  const React = jest.requireActual<typeof import('react')>('react');
  const { Text, View } = jest.requireActual<typeof import('react-native')>('react-native');
  // R5/R7/R8 inspect the screen's declared props, before HeroUI adds its classes.
  return {
    ...actual,
    Button: Object.assign(
      (props: Record<string, unknown> & { children?: ReactNode }) => React.createElement(View, props),
      { Label: (props: Record<string, unknown> & { children?: ReactNode }) => React.createElement(Text, props) },
    ),
  };
});

function readSource(path: string): string {
  return readFileSync(join(sourceRoot, path), 'utf8');
}

const mockUseAuth = jest.mocked(useAuth);
const mockRedirect = jest.mocked(Redirect);
const mockRouter = jest.mocked(router);

function WelcomeWrapper({ children, language = 'es' }: { children: ReactNode; language?: 'en' | 'es' }) {
  return (
    <HeroUINativeProvider>
      <LanguageProvider initial={language}>{children}</LanguageProvider>
    </HeroUINativeProvider>
  );
}

async function renderWelcome(language: 'en' | 'es' = 'es') {
  await render(<WelcomeWrapper language={language}><WelcomeScreen /></WelcomeWrapper>);
}

beforeEach(() => {
  jest.clearAllMocks();
  mockUseReducedMotion.mockReturnValue(false);
  mockUseAuth.mockReturnValue({
    status: 'unauthenticated', token: null, signIn: jest.fn(), signOut: jest.fn(),
  } satisfies AuthContextValue);
});

describe('R3', () => {
  it('registra welcome bajo su propio guard de no autenticado', () => {
    const source = readSource('app/_layout.tsx');
    expect(source).toMatch(/<Stack\.Protected guard=\{status !== 'authenticated'\}>\s*<Stack\.Screen name="welcome" \/>\s*<\/Stack\.Protected>/);
    expect(source.match(/name="welcome"/g)).toHaveLength(1);
  });

  it('deja el route de welcome delgado', () => {
    const source = readSource('app/welcome.tsx');
    expect(source.split('\n').filter((line) => line.trim()).length).toBeLessThanOrEqual(5);
    expect(source).toContain("from '../screens/welcome'");
  });
});

describe('R4', () => {
  it('con sesión redirige a home y no pinta la pantalla', async () => {
    mockUseAuth.mockReturnValue({
      status: 'authenticated', token: 'jwt-token', signIn: jest.fn(), signOut: jest.fn(),
    } satisfies AuthContextValue);
    await renderWelcome();
    expect(mockRedirect).toHaveBeenCalledTimes(1);
    expect(mockRedirect.mock.calls[0]?.[0]).toEqual({ href: '/home' });
    expect(screen.queryByTestId('screen-welcome')).toBeNull();
    expect(screen.queryByTestId('welcome-get-started')).toBeNull();
  });
});

describe('R5', () => {
  it('aplica las dimensiones del grupo sin tab bar', async () => {
    await renderWelcome();
    expect(screen.getByTestId('screen-welcome').props.contentContainerStyle).toEqual({
      flexGrow: 1, justifyContent: 'center', padding: 24, gap: 16, paddingTop: 52, paddingBottom: 48,
    });
    expect(screen.getByTestId('screen-welcome').props.className).toBe('flex-1 bg-background');
    expect(screen.getByTestId('screen-welcome').props.contentInsetAdjustmentBehavior).toBe('automatic');
  });

  it('apila los siete bloques en orden', async () => {
    await renderWelcome();
    const children = screen.getByTestId('welcome-content').children as TestInstance[];
    expect(children).toHaveLength(7);
    expect(children.map((child) => child.props.testID)).toEqual([
      'welcome-scene', 'welcome-chips', 'welcome-brand', 'welcome-tagline',
      'welcome-get-started', 'welcome-have-account', 'welcome-legal',
    ]);
  });

  it('pinta marca, tagline y legal con sus clases', async () => {
    await renderWelcome();
    expect(screen.getByTestId('welcome-brand').props.className).toBe('text-3xl font-bold text-foreground');
    expect(screen.getByTestId('welcome-tagline').props.className).toBe('text-center text-base text-muted');
    expect(screen.getByTestId('welcome-legal').props.className).toBe('text-center text-xs text-muted');
    expect(StyleSheet.flatten(screen.getByTestId('welcome-content').props.style)).toMatchObject({ alignItems: 'center', gap: 16 });
  });
});

describe('R9', () => {
  it('muestra el copy en español', async () => {
    await renderWelcome('es');
    expect(screen.getByText('Pet Tracker')).toBeOnTheScreen();
    expect(screen.getByText('GPS')).toBeOnTheScreen();
    expect(screen.getByText('Salud')).toBeOnTheScreen();
    expect(screen.getByText('Nutrición')).toBeOnTheScreen();
    expect(screen.getByText('Tu centro inteligente de bienestar, rastreo y nutrición canina profesional')).toBeOnTheScreen();
    expect(screen.getByText('Comenzar ahora')).toBeOnTheScreen();
    expect(screen.getByText('Ya tengo una cuenta')).toBeOnTheScreen();
    expect(screen.getByText('Al continuar aceptas nuestros Términos y Política de privacidad')).toBeOnTheScreen();
  });

  it('muestra el copy en inglés', async () => {
    await renderWelcome('en');
    expect(screen.getByText('Pet Tracker')).toBeOnTheScreen();
    expect(screen.getByText('GPS')).toBeOnTheScreen();
    expect(screen.getByText('Health')).toBeOnTheScreen();
    expect(screen.getByText('Nutrition')).toBeOnTheScreen();
    expect(screen.getByText('Your smart hub for canine wellness, tracking and nutrition')).toBeOnTheScreen();
    expect(screen.getByText('Get started')).toBeOnTheScreen();
    expect(screen.getByText('I already have an account')).toBeOnTheScreen();
    expect(screen.getByText('By continuing you accept our Terms and Privacy Policy')).toBeOnTheScreen();
  });
});


describe('R6', () => {
  const chipIds = ['welcome-chip-gps', 'welcome-chip-health', 'welcome-chip-nutrition'];
  const iconIds = ['icon-map', 'icon-stethoscope', 'icon-fork-knife'];
  const labels = ['GPS', 'Salud', 'Nutrición'];

  it('asigna el testID de cada chip', async () => {
    await renderWelcome();
    const chips = screen.getByTestId('welcome-chips').children as TestInstance[];
    chips.forEach((chip, index) => expect(chip.props.testID).toBe(chipIds[index]));
  });

  it('aplica la misma clase a cada chip', async () => {
    await renderWelcome();
    const chips = screen.getByTestId('welcome-chips').children as TestInstance[];
    expect(screen.getByTestId('welcome-chips').props.className).toBe('flex-row justify-center gap-2');
    chips.forEach((chip) => expect(chip.props.className).toBe('flex-row items-center gap-1.5 rounded-full bg-surface-secondary px-3 py-1.5'));
  });

  it('pinta el icono de cada chip', async () => {
    await renderWelcome();
    const chips = screen.getByTestId('welcome-chips').children as TestInstance[];
    chips.forEach((chip, index) => expect((chip.children[0] as TestInstance).props.testID).toBe(iconIds[index]));
  });

  it('usa iconos de 14 puntos', async () => {
    await renderWelcome();
    const chips = screen.getByTestId('welcome-chips').children as TestInstance[];
    chips.forEach((chip) => expect((chip.children[0] as TestInstance).props.size).toBe(14));
  });

  it('resuelve la tinta accent-strong de cada icono', async () => {
    await renderWelcome();
    const chips = screen.getByTestId('welcome-chips').children as TestInstance[];
    expect(jest.mocked(useThemeColors)).toHaveBeenCalledWith(['accent-strong']);
    chips.forEach((chip) => expect((chip.children[0] as TestInstance).props.color).toBe('accent-strong-ink'));
  });

  it('resuelve la etiqueta de cada chip por su clave', async () => {
    await renderWelcome();
    const chips = screen.getByTestId('welcome-chips').children as TestInstance[];
    chips.forEach((chip, index) => expect((chip.children[1] as TestInstance).children).toEqual([labels[index]]));
  });

  it('aplica la clase de tinta a cada etiqueta', async () => {
    await renderWelcome();
    const chips = screen.getByTestId('welcome-chips').children as TestInstance[];
    chips.forEach((chip) => expect((chip.children[1] as TestInstance).props.className).toBe('text-xs font-semibold text-accent-strong'));
  });

  it('ordena GPS, Salud y Nutrición', async () => {
    await renderWelcome();
    const chips = screen.getByTestId('welcome-chips').children as TestInstance[];
    chips.forEach((chip, index) => expect(screen.getByTestId(chipIds[index])).toBe(chip));
  });

  it('deja dos hijos por chip, icono y etiqueta', async () => {
    await renderWelcome();
    const chips = screen.getByTestId('welcome-chips').children as TestInstance[];
    chips.forEach((chip, index) => {
      expect(chip.children).toHaveLength(2);
      expect((chip.children[0] as TestInstance).props.testID).toBe(iconIds[index]);
      expect((chip.children[1] as TestInstance).children).toEqual([labels[index]]);
    });
  });

  it('deja cada chip sin pulsación ni rol de botón', async () => {
    await renderWelcome();
    const chips = screen.getByTestId('welcome-chips').children as TestInstance[];
    chips.forEach((chip) => {
      expect(chip.props.onPress).toBeUndefined();
      expect(chip.props.onClick).toBeUndefined();
      expect(chip.props.accessible).toBeUndefined();
      expect(chip.props.accessibilityRole).not.toBe('button');
      expect(chip.props.role).toBeUndefined();
    });
  });

  it('recorre WELCOME_CHIPS con map y comparte la clase de etiqueta', () => {
    const source = readSource('screens/welcome/index.tsx');
    expect(source).toContain('const WELCOME_CHIPS =');
    expect(source).toContain('WELCOME_CHIPS.map');
    expect(source.match(/text-accent-strong\b/g)).toHaveLength(2);
  });

  it('contiene exactamente tres chips', async () => {
    await renderWelcome();
    expect(screen.getByTestId('welcome-chips').children).toHaveLength(3);
  });
});


describe('R7', () => {
  it('empuja a registro sin reemplazar', async () => {
    await renderWelcome();
    await fireEvent.press(screen.getByTestId('welcome-get-started'));
    expect(mockRouter.push).toHaveBeenCalledTimes(1);
    expect(mockRouter.push).toHaveBeenCalledWith('/register');
    expect(mockRouter.replace).not.toHaveBeenCalled();
  });

  it('es el botón primario del repo', async () => {
    await renderWelcome();
    expect(screen.getByTestId('welcome-get-started').props.className).toBe('w-full rounded-xl bg-accent border-b-4 border-black/25');
    expect(screen.getByText('Comenzar ahora')).toBeOnTheScreen();
    expect(screen.getByText('Comenzar ahora').props.className).toBe('font-bold text-accent-foreground');
  });
});


describe('R8', () => {
  it('empuja a login sin reemplazar', async () => {
    await renderWelcome();
    await fireEvent.press(screen.getByTestId('welcome-have-account'));
    expect(mockRouter.push).toHaveBeenCalledTimes(1);
    expect(mockRouter.push).toHaveBeenCalledWith('/login');
    expect(mockRouter.replace).not.toHaveBeenCalled();
  });

  it('es un botón hueco con tinta accent-strong', async () => {
    await renderWelcome();
    expect(screen.getByTestId('welcome-have-account').props.className).toBe('w-full rounded-xl border border-accent bg-transparent');
    expect(screen.getByText('Ya tengo una cuenta').props.className).toBe('font-semibold text-accent-strong');
  });
});


describe('#153 R2: la carta escribe la voz de Pingo', () => {
  const charter = readFileSync(join(process.cwd(), '..', 'docs', 'ui-guidelines.md'), 'utf8');

  it('declara el punto 7 tras el punto 6 y antes del checklist', () => {
    const voice = '**7. Voz de Pingo: guardián sereno.**';
    const language = '**6. Idioma:';
    const checklist = '## Checklist de autocrítica';
    expect(charter.indexOf(voice)).toBeGreaterThan(charter.indexOf(language));
    expect(charter.indexOf(voice)).toBeLessThan(charter.indexOf(checklist));
    for (const text of [voice, language, checklist]) {
      expect(charter.split(text).length).toBe(2);
    }
  });

  it('fija las reglas de la voz', () => {
    for (const text of [
      '- **Sin emoji**, en ningún idioma.',
      '- **Exclamaciones solo para celebrar.**',
      '- **Sin bromas en las alertas.**',
      '- **En inglés, registro neutro.**',
      'con el marcador `{{petName}}`',
    ]) {
      expect(charter).toContain(text);
    }
  });

  it('declara la excepción de los bucles de reposo', () => {
    expect(charter).toContain('- **Bucles de reposo.**');
    expect(charter).toContain('`src/theme/motion.ts` y no arrancan con reduce motion.');
  });
});


describe('#153 R3: las poses entran como WebP', () => {
  it.each(['pingo-wave.webp', 'pingo-wave-blink.webp'])('%s es un WebP con alfa de 1024×1024 y como mucho 100 000 bytes', (name) => {
    const bytes = readFileSync(join(process.cwd(), 'assets', 'images', name));
    expect(bytes.toString('ascii', 0, 4)).toBe('RIFF');
    expect(bytes.toString('ascii', 8, 12)).toBe('WEBP');
    expect(bytes.toString('ascii', 12, 16)).toBe('VP8X');
    expect((bytes[20] & 0x10) !== 0).toBe(true);
    expect(bytes.readUIntLE(24, 3) + 1).toBe(1024);
    expect(bytes.readUIntLE(27, 3) + 1).toBe(1024);
    expect(bytes.length).toBeLessThanOrEqual(100000);
  });

  it('no mete otras poses de Pingo', () => {
    expect(readdirSync(join(process.cwd(), 'assets', 'images')).filter((name) => /^(pingo|mascot)-/.test(name)).sort())
      .toEqual(['pingo-wave-blink.webp', 'pingo-wave.webp']);
  });
});


describe('#153 R1: el saludo de Pingo existe en los dos idiomas', () => {
  it('declara el saludo en inglés y en español', () => {
    expect(en['welcome.pingoGreeting']).toBe('Hi, I\'m Pingo. I\'ll help you know where your pet is and how they\'re doing.');
    expect(es['welcome.pingoGreeting']).toBe('Hola, soy Pingo. Te ayudo a saber dónde está y cómo está tu mascota.');
  });

  it('no exclama ni lleva emoji en ningún idioma', () => {
    for (const value of [en['welcome.pingoGreeting'], es['welcome.pingoGreeting']]) {
      expect(value).not.toMatch(/[!¡]/);
      expect(value).not.toMatch(/\p{Extended_Pictographic}/u);
    }
  });

  it('pinta el saludo en el bocadillo en español', async () => {
    await renderWelcome('es');
    expect(screen.getByText('Hola, soy Pingo. Te ayudo a saber dónde está y cómo está tu mascota.').props.testID).toBe('welcome-bubble-text');
  });

  it('pinta el saludo en el bocadillo en inglés', async () => {
    await renderWelcome('en');
    expect(screen.getByText('Hi, I\'m Pingo. I\'ll help you know where your pet is and how they\'re doing.').props.testID).toBe('welcome-bubble-text');
  });

  it('registra la clave en la tabla de mobile-ui-language', () => {
    const design = readFileSync(join(process.cwd(), '..', 'specs', 'mobile-ui-language', 'design.md'), 'utf8');
    expect(design).toContain('### §2.20 — Añadidos por #153 — Pingo en la bienvenida');
    expect(design).toMatch(new RegExp('\\| — \\| `welcome\\.pingoGreeting`[^\\n]*← añadida por #153 \\(R1\\)'));
  });
});


describe('#153 R5: la escena de Pingo sustituye al logo', () => {
  it('apila la escena y los seis bloques de #118 en orden', async () => {
    await renderWelcome();
    const children = screen.getByTestId('welcome-content').children as TestInstance[];
    expect(children).toHaveLength(7);
    expect(children.map((child) => child.props.testID)).toEqual([
      'welcome-scene', 'welcome-chips', 'welcome-brand', 'welcome-tagline',
      'welcome-get-started', 'welcome-have-account', 'welcome-legal',
    ]);
  });

  it('ya no pinta el logo', async () => {
    await renderWelcome();
    expect(screen.getByTestId('welcome-content')).toBeOnTheScreen();
    expect(screen.queryByTestId('welcome-hero')).toBeNull();
    expect(readSource('screens/welcome/index.tsx')).not.toContain('splash-icon');
  });

  it('pinta la escena como card secundaria con el bocadillo y Pingo', async () => {
    await renderWelcome();
    const scene = screen.getByTestId('welcome-scene');
    expect(scene.props.className.split(' ')).toEqual(expect.arrayContaining([
      'rounded-card', 'bg-surface-secondary', 'w-full', 'items-center', 'gap-3', 'py-6',
    ]));
    expect((scene.children as TestInstance[]).map((child) => child.props.testID)).toEqual(['welcome-bubble', 'welcome-pingo']);
  });

  it('pinta el bocadillo como card de superficie con el saludo', async () => {
    await renderWelcome();
    const bubble = screen.getByTestId('welcome-bubble');
    expect(bubble.props.className.split(' ')).toEqual(expect.arrayContaining([
      'rounded-card', 'bg-surface', 'shadow-sm', 'px-4', 'py-3',
    ]));
    expect(bubble.children).toHaveLength(1);
    expect((bubble.children[0] as TestInstance).props.testID).toBe('welcome-bubble-text');
    expect(screen.getByTestId('welcome-bubble-text').props.className).toBe('text-center text-sm font-semibold text-foreground');
  });
});


describe('#153 R6: Pingo se pinta con su pose y su capa de parpadeo', () => {
  it('deja en Pingo la pose y la capa de parpadeo, en ese orden', async () => {
    await renderWelcome();
    expect((screen.getByTestId('welcome-pingo').children as TestInstance[]).map((child) => child.props.testID))
      .toEqual(['welcome-pingo-wave', 'welcome-pingo-blink']);
    expect((screen.getByTestId('welcome-pingo-blink').children as TestInstance[]).map((child) => child.props.testID))
      .toEqual(['welcome-pingo-blink-image']);
  });

  it.each([
    ['welcome-pingo-wave', /assets\/images\/pingo-wave\.webp$/],
    ['welcome-pingo-blink-image', /assets\/images\/pingo-wave-blink\.webp$/],
  ] as const)('%s pinta su pose a 200×200, sin etiqueta de accesibilidad', async (testID, pattern) => {
    await renderWelcome();
    const image = screen.getByTestId(testID);
    expect(image.props.style).toEqual({ width: 200, height: 200 });
    expect(image.props.contentFit).toBe('contain');
    expect(image.props.source).toEqual([expect.objectContaining({ testUri: expect.stringMatching(pattern) })]);
    expect(image.props.accessibilityLabel).toBeUndefined();
  });

  it('coloca la capa de parpadeo encima de Pingo, cerrada', async () => {
    await renderWelcome();
    expect(getAnimatedStyle(screen.getByTestId('welcome-pingo-blink'))).toEqual({ position: 'absolute', top: 0, left: 0, opacity: 0 });
  });
});


describe('#153 R7: el CTA primario tiene cuerpo', () => {
  it('declara el labio en el CTA primario', async () => {
    await renderWelcome('es');
    expect(screen.getByTestId('welcome-get-started').props.className).toBe('w-full rounded-xl bg-accent border-b-4 border-black/25');
    expect(screen.getByText('Comenzar ahora').props.className).toBe('font-bold text-accent-foreground');
  });

  it('deja el CTA secundario sin labio', async () => {
    await renderWelcome();
    const secondary = screen.getByTestId('welcome-have-account');
    expect(secondary.props.className).not.toContain('border-b-4');
    expect(secondary.props.className).not.toContain('border-black');
  });
});


describe('#153 R8: el contenido entra con las constantes de motion.ts', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('exporta solo la pantalla', async () => {
    await renderWelcome();
    expect(screen.getByTestId('welcome-content')).toBeOnTheScreen();
    expect(Object.keys(require('./index'))).toEqual(['WelcomeScreen']);
  });

  it('usa el fundido y el muelle de motion.ts', async () => {
    await renderWelcome();
    expect(screen.getByTestId('welcome-content')).toBeOnTheScreen();
    const source = readSource('screens/welcome/index.tsx');
    for (const re of [
      /opacity\.set\(\s*withTiming\(\s*1,\s*MOTION_FADE_TIMING,?\s*\),?\s*\)/g,
      /translateY\.set\(\s*withSpring\(\s*0,\s*MOTION_SETTLE_SPRING,?\s*\),?\s*\)/g,
      /useSharedValue\(\s*reduceMotion \? 0 : MOTION_ENTRANCE_OFFSET_Y,?\s*\)/g,
      /from '\.\.\/\.\.\/theme\/motion'/g,
    ]) {
      expect((source.match(re) ?? []).length).toBe(1);
    }
    for (const re of [/\b(?:duration|easing|reduceMotion):/g, /WELCOME_ENTRANCE_/g]) {
      expect((source.match(re) ?? []).length).toBe(0);
    }
  });

  it('arranca invisible y desplazado 12 puntos sin reduce motion', async () => {
    await renderWelcome();
    expect(screen.getByTestId('welcome-content')).toHaveAnimatedStyle({
      alignItems: 'center', gap: 16, opacity: 0, transform: [{ translateY: 12 }],
    }, { shouldMatchAllProps: true });
  });

  it('termina visible y en su sitio sin reduce motion', async () => {
    await renderWelcome();
    expect(screen.getByTestId('welcome-content')).toBeOnTheScreen();
    // El muelle se asienta en unas 1,5 × 250 ms; 1000 ms deja más del doble.
    await act(async () => { jest.advanceTimersByTime(1000); });
    expect(screen.getByTestId('welcome-content')).toHaveAnimatedStyle({
      alignItems: 'center', gap: 16, opacity: 1, transform: [{ translateY: 0 }],
    }, { shouldMatchAllProps: true });
  });

  it('con reduce motion aparece sin desplazarse', async () => {
    mockUseReducedMotion.mockReturnValue(true);
    await renderWelcome();
    expect(screen.getByTestId('welcome-content')).toHaveAnimatedStyle({
      alignItems: 'center', gap: 16, opacity: 0, transform: [{ translateY: 0 }],
    }, { shouldMatchAllProps: true });
    // Misma ventana de 1000 ms que el asentamiento sin reduce motion.
    await act(async () => { jest.advanceTimersByTime(1000); });
    expect(screen.getByTestId('welcome-content')).toHaveAnimatedStyle({
      alignItems: 'center', gap: 16, opacity: 1, transform: [{ translateY: 0 }],
    }, { shouldMatchAllProps: true });
    mockUseReducedMotion.mockReturnValue(false);
  });
});

describe('#153 E1: la carta retira WELCOME_ENTRANCE_MS de la migración pendiente', () => {
  it('deja en la lista solo las cinco constantes pendientes', () => {
    const charter = readFileSync(join(process.cwd(), '..', 'docs', 'ui-guidelines.md'), 'utf8');
    const heading = '## Enmienda #152 — el movimiento vive en src/theme/motion.ts';
    const start = charter.indexOf(heading);
    const next = charter.indexOf('\n## ', start + heading.length);
    const amendment = charter.slice(start, next === -1 ? undefined : next);
    expect(start).toBeGreaterThan(-1);
    expect(amendment).toContain([
      'Las constantes anteriores a #152 (`MEALS_BAR_TIMING`, `KCAL_BAR_TIMING`,',
      '`BAR_ENTRY_*`, `METRIC_TAB_SPRING` y `TAB_INDICATOR_SPRING`) migran a',
      '`motion.ts` en una feature posterior, fuera del alcance de esta.',
      '`WELCOME_ENTRANCE_MS` no está en la lista: la retiró #153, cuya bienvenida',
      'usa `MOTION_FADE_TIMING` y `MOTION_SETTLE_SPRING` (enmienda E1 de #153).',
    ].join('\n'));
    expect(amendment.split('`WELCOME_ENTRANCE_MS`').length).toBe(2);
  });
});

describe('#153 R9: Pingo entra con un muelle de escala', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('arranca al 90 % sin reduce motion', async () => {
    await renderWelcome();
    expect(getAnimatedStyle(screen.getByTestId('welcome-pingo'))).toEqual({
      width: 200, height: 200, transform: [{ translateY: 0 }, { scale: 0.9 }],
    });
  });

  it('termina a tamaño completo sin reduce motion', async () => {
    await renderWelcome();
    expect(screen.getByTestId('welcome-pingo')).toBeOnTheScreen();
    // Unas 1,5 × 250 ms de asentamiento; 1000 ms deja más del doble.
    await act(async () => { jest.advanceTimersByTime(1000); });
    expect(getAnimatedStyle(screen.getByTestId('welcome-pingo'))).toEqual({
      width: 200, height: 200, transform: [{ translateY: expect.any(Number) }, { scale: 1 }],
    });
  });

  it('con reduce motion nace a tamaño completo y no escala', async () => {
    mockUseReducedMotion.mockReturnValue(true);
    await renderWelcome();
    expect(getAnimatedStyle(screen.getByTestId('welcome-pingo'))).toEqual({
      width: 200, height: 200, transform: [{ translateY: 0 }, { scale: 1 }],
    });
    // 5000 ms supera el asentamiento y el primer parpadeo de 4000 ms.
    await act(async () => { jest.advanceTimersByTime(5000); });
    expect(getAnimatedStyle(screen.getByTestId('welcome-pingo'))).toEqual({
      width: 200, height: 200, transform: [{ translateY: 0 }, { scale: 1 }],
    });
    mockUseReducedMotion.mockReturnValue(false);
  });

  it('usa el muelle de motion.ts', async () => {
    await renderWelcome();
    expect(screen.getByTestId('welcome-pingo')).toBeOnTheScreen();
    const source = readSource('screens/welcome/index.tsx');
    for (const re of [
      /pingoScale\.set\(\s*withSpring\(\s*1,\s*MOTION_SETTLE_SPRING,?\s*\),?\s*\)/g,
      /useSharedValue\(\s*reduceMotion \? 1 : MOTION_ENTRANCE_SCALE,?\s*\)/g,
    ]) {
      expect((source.match(re) ?? []).length).toBe(1);
    }
  });
});

describe('#153 R10: Pingo flota en bucle', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('sube 4 puntos en medio ciclo sin reduce motion', async () => {
    await renderWelcome();
    expect(screen.getByTestId('welcome-pingo')).toBeOnTheScreen();
    // Medio ciclo dura 1200 ms; 2000 ms deja 800 ms de margen.
    await act(async () => { jest.advanceTimersByTime(2000); });
    expect(getAnimatedStyle(screen.getByTestId('welcome-pingo'))).toEqual({
      width: 200, height: 200, transform: [{ translateY: -4 }, { scale: 1 }],
    });
  });

  it('repite la flotación sin fin y en vaivén', async () => {
    await renderWelcome();
    expect(screen.getByTestId('welcome-pingo')).toBeOnTheScreen();
    const args = mockWithRepeat.mock.calls.map((call) => call.slice(1));
    expect(args.filter((values) => values.length === 2 && values[0] === -1 && values[1] === true)).toEqual([[-1, true]]);
  });

  it('con reduce motion no flota', async () => {
    mockUseReducedMotion.mockReturnValue(true);
    await renderWelcome();
    expect(screen.getByTestId('welcome-pingo')).toBeOnTheScreen();
    // 5000 ms supera el ciclo de 2400 ms y el primer parpadeo de 4000 ms.
    await act(async () => { jest.advanceTimersByTime(5000); });
    expect(getAnimatedStyle(screen.getByTestId('welcome-pingo'))).toEqual({
      width: 200, height: 200, transform: [{ translateY: 0 }, { scale: 1 }],
    });
    expect(mockWithRepeat).not.toHaveBeenCalled();
    mockUseReducedMotion.mockReturnValue(false);
  });

  it('usa la flotación de motion.ts', async () => {
    await renderWelcome();
    expect(screen.getByTestId('welcome-pingo')).toBeOnTheScreen();
    const source = readSource('screens/welcome/index.tsx');
    const re = /pingoFloatY\.set\(\s*withRepeat\(\s*withTiming\(\s*-MOTION_FLOAT_OFFSET_Y,\s*MOTION_FLOAT_TIMING,?\s*\),\s*-1,\s*true,?\s*\),?\s*\)/g;
    expect((source.match(re) ?? []).length).toBe(1);
  });
});

describe('#153 R11: Pingo parpadea cada cuatro segundos', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('cierra los ojos a los 4 s y los abre 150 ms después', async () => {
    await renderWelcome();
    expect(screen.getByTestId('welcome-pingo-blink')).toBeOnTheScreen();
    // Los controles quedan al menos 50 ms a cada lado de los cambios.
    await act(async () => { jest.advanceTimersByTime(3900); });
    expect(getAnimatedStyle(screen.getByTestId('welcome-pingo-blink'))).toEqual({ position: 'absolute', top: 0, left: 0, opacity: 0 });
    await act(async () => { jest.advanceTimersByTime(200); });
    expect(getAnimatedStyle(screen.getByTestId('welcome-pingo-blink'))).toEqual({ position: 'absolute', top: 0, left: 0, opacity: 1 });
    await act(async () => { jest.advanceTimersByTime(200); });
    expect(getAnimatedStyle(screen.getByTestId('welcome-pingo-blink'))).toEqual({ position: 'absolute', top: 0, left: 0, opacity: 0 });
  });

  it('repite el parpadeo sin fin', async () => {
    await renderWelcome();
    expect(screen.getByTestId('welcome-pingo-blink')).toBeOnTheScreen();
    const args = mockWithRepeat.mock.calls.map((call) => call.slice(1));
    expect(args.filter((values) => values.length === 1 && values[0] === -1)).toEqual([[-1]]);
  });

  it('con reduce motion no parpadea', async () => {
    mockUseReducedMotion.mockReturnValue(true);
    await renderWelcome();
    expect(screen.getByTestId('welcome-pingo-blink')).toBeOnTheScreen();
    // 4100 ms queda 100 ms después del cierre de ojos esperado sin reduce motion.
    await act(async () => { jest.advanceTimersByTime(4100); });
    expect(getAnimatedStyle(screen.getByTestId('welcome-pingo-blink'))).toEqual({ position: 'absolute', top: 0, left: 0, opacity: 0 });
    expect(mockWithRepeat).not.toHaveBeenCalled();
    mockUseReducedMotion.mockReturnValue(false);
  });

  it('usa el intervalo y el cambio de motion.ts', async () => {
    await renderWelcome();
    expect(screen.getByTestId('welcome-pingo-blink')).toBeOnTheScreen();
    const source = readSource('screens/welcome/index.tsx');
    for (const re of [
      /withDelay\(\s*MOTION_BLINK_INTERVAL_MS,\s*withTiming\(\s*1,\s*MOTION_BLINK_TIMING,?\s*\),?\s*\)/g,
      /withDelay\(\s*MOTION_FEEDBACK_MS,\s*withTiming\(\s*0,\s*MOTION_BLINK_TIMING,?\s*\),?\s*\)/g,
    ]) {
      expect((source.match(re) ?? []).length).toBe(1);
    }
  });
});

describe('#153 R12: la parada de los bucles la hace Reanimated', () => {
  it('no cancela a mano ni devuelve limpieza', async () => {
    await renderWelcome();
    expect(screen.getByTestId('welcome-pingo')).toBeOnTheScreen();
    const source = readSource('screens/welcome/index.tsx');
    for (const re of [/\bcancelAnimation\b/g, /return \(\) =>/g]) {
      expect((source.match(re) ?? []).length).toBe(0);
    }
  });
});

describe('#153 R13: Pingo no trae dependencias nuevas', () => {
  it('no declara Lottie, Rive ni expo-linear-gradient', () => {
    const manifest = JSON.parse(readFileSync(join(process.cwd(), 'package.json'), 'utf8'));
    const dependencies = [...Object.keys(manifest.dependencies), ...Object.keys(manifest.devDependencies)];
    expect(dependencies.filter((name) => /^(?:lottie-react-native|rive-react-native|@rive-app\/.+|expo-linear-gradient)$/.test(name))).toEqual([]);
  });
});
