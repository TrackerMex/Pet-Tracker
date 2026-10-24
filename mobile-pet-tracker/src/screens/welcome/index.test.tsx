import { act, fireEvent, render, renderHook, screen } from '@testing-library/react-native';
import { Redirect, router } from 'expo-router';
import { HeroUINativeProvider } from 'heroui-native';
import type { ReactNode } from 'react';
import { StyleSheet } from 'react-native';
import { getAnimatedStyle, withRepeat } from 'react-native-reanimated';
import type { TestInstance } from 'test-renderer';

import { en, es } from '../../i18n/catalog';
import { useAuth, type AuthContextValue } from '../../providers/auth-provider';
import { LanguageProvider } from '../../providers/language-provider';
import { useShadows } from '../../theme/shadows';
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
  it('aplica las dimensiones del grupo sin tab bar (enmendado por #205 R2)', async () => {
    await renderWelcome();
    expect(screen.getByTestId('screen-welcome').props.contentContainerStyle).toEqual({
      flexGrow: 1, paddingHorizontal: 16, paddingTop: 52, paddingBottom: 48, // #205 R2
    });
    expect(screen.getByTestId('screen-welcome').props.className).toBe('flex-1 bg-background');
    expect(screen.getByTestId('screen-welcome').props.contentInsetAdjustmentBehavior).toBe('automatic');
  });

  it('apila los siete bloques en orden (enmendado por #205 R2)', async () => {
    await renderWelcome();
    const children = screen.getByTestId('welcome-content').children as TestInstance[];
    expect(children).toHaveLength(6); // #205 R2
    expect(children.map((child) => child.props.testID)).toEqual([
      'welcome-rise-scene', 'welcome-rise-chips', 'welcome-rise-heading', 'welcome-spacer',
      'welcome-rise-actions', 'welcome-legal', // #205 R2
    ]);
  });

  it('pinta marca, tagline y legal con sus clases (enmendado por #205 R2, R6)', async () => {
    await renderWelcome();
    expect(screen.getByTestId('welcome-brand').props.className).toBe('text-3xl font-bold text-foreground');
    expect(screen.getByTestId('welcome-tagline').props.className).toBe('text-center text-base text-muted');
    expect(screen.getByTestId('welcome-legal').props.className).toBe('text-center text-xs text-muted');
    expect(screen.getByTestId('welcome-rise-heading').props.className).toBe('mt-4.5 items-center gap-2'); // #205 R2
  });
});

describe('#205 R2: Main apila sus bloques con RiseIn', () => {
  it('#205 R2: el contenido apila escena, chips, marca, espaciador, CTAs y legal', async () => {
    await renderWelcome();
    const content = screen.getByTestId('welcome-content');
    expect(content.props.className).toBe('flex-1');
    expect(StyleSheet.flatten(content.props.style) ?? {}).not.toHaveProperty('opacity');
    expect(StyleSheet.flatten(content.props.style) ?? {}).not.toHaveProperty('transform');
    expect(readSource('screens/welcome/index.tsx')).not.toContain('style={entranceStyle}');

    const ids = (testID: string) => (screen.getByTestId(testID).children as TestInstance[]).map((child) => child.props.testID);
    expect(ids('welcome-content')).toEqual([
      'welcome-rise-scene', 'welcome-rise-chips', 'welcome-rise-heading', 'welcome-spacer',
      'welcome-rise-actions', 'welcome-legal',
    ]);
    expect(ids('welcome-rise-scene')).toEqual(['welcome-scene']);
    expect(ids('welcome-rise-chips')).toEqual(['welcome-chips']);
    expect(ids('welcome-rise-heading')).toEqual(['welcome-brand', 'welcome-tagline']);
    expect(ids('welcome-rise-actions')).toEqual(['welcome-get-started', 'welcome-have-account']);

    for (const testID of ['welcome-rise-scene', 'welcome-rise-chips', 'welcome-rise-heading', 'welcome-rise-actions']) {
      expect(typeof screen.getByTestId(testID).props.entering).toBe('function');
    }
    expect(screen.getByTestId('welcome-rise-scene').props.className).toBeUndefined();
    expect(screen.getByTestId('welcome-rise-chips').props.className).toBe('mt-6');
    expect(screen.getByTestId('welcome-rise-heading').props.className).toBe('mt-4.5 items-center gap-2');
    expect(screen.getByTestId('welcome-rise-actions').props.className).toBe('gap-3.5');
    expect(screen.getByTestId('welcome-spacer').props.className).toBe('flex-1');
    expect((screen.getByTestId('welcome-spacer').children as TestInstance[])).toHaveLength(0);
  });

  it('#205 R2: el scroll usa márgenes 16 y los insets sin centrar', async () => {
    await renderWelcome();
    const style = screen.getByTestId('screen-welcome').props.contentContainerStyle;
    expect(style).toEqual({ flexGrow: 1, paddingHorizontal: 16, paddingTop: 52, paddingBottom: 48 });
    expect(style).not.toHaveProperty('justifyContent');
    expect(style).not.toHaveProperty('padding');
    expect(style).not.toHaveProperty('gap');
  });
});

describe('#205 R3: la escena de Main', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('#205 R3: la escena es una vista de 380 con radio 32 y esquina continua', async () => {
    await renderWelcome();
    const scene = screen.getByTestId('welcome-scene');
    expect(scene.props.className).toBe('h-95 w-full items-center justify-center overflow-hidden rounded-32 bg-surface-secondary');
    expect(StyleSheet.flatten(scene.props.style)).toEqual({ borderCurve: 'continuous' });
    const source = readSource('screens/welcome/index.tsx');
    expect(source).not.toMatch(/<Card\s+testID="welcome-scene"/);
    expect(source).toMatch(/<View\s+testID="welcome-scene"/);
  });

  it('#205 R3: Pingo mide 220, flota y pisa la sombra del suelo', async () => {
    await renderWelcome();
    const ids = (testID: string) => (screen.getByTestId(testID).children as TestInstance[]).map((child) => child.props.testID);
    const sceneIds = ids('welcome-scene');
    expect(sceneIds).toContain('welcome-ground');
    expect(sceneIds.indexOf('welcome-ground')).toBeLessThan(sceneIds.indexOf('welcome-stage'));
    expect(screen.getByTestId('welcome-ground').props.className).toBe('absolute bottom-7.5 h-3.5 w-30 rounded-full bg-border');
    expect(ids('welcome-stage')).toEqual(['welcome-ring-0', 'welcome-ring-1', 'welcome-ring-2', 'welcome-pingo-float']);
    expect(ids('welcome-pingo-float')).toEqual(['welcome-pingo']);
    expect(ids('welcome-pingo')).toEqual(['welcome-pingo-wave', 'welcome-pingo-blink']);

    expect(getAnimatedStyle(screen.getByTestId('welcome-pingo-float'))).toEqual({ transform: [{ translateY: 0 }] });
    await act(async () => { jest.advanceTimersByTime(2000); });
    expect(getAnimatedStyle(screen.getByTestId('welcome-pingo-float'))).toEqual({ transform: [{ translateY: -10 }] });

    const pingo = getAnimatedStyle(screen.getByTestId('welcome-pingo'));
    expect(pingo).toMatchObject({ width: 220, height: 220 });
    expect(JSON.stringify(pingo)).not.toContain('translateY');
    expect(readSource('screens/welcome/index.tsx')).not.toContain('pingoFloatY');
  });
});

describe('#205 R4: bocadillo de Main', () => {
  it('#205 R4: el bocadillo flota arriba a la derecha con el pico abajo a la derecha', async () => {
    const { result } = await renderHook(() => useShadows());
    await renderWelcome();
    const scene = screen.getByTestId('welcome-scene');
    const sceneIds = (scene.children as TestInstance[]).map((child) => child.props.testID);
    expect(sceneIds[sceneIds.length - 1]).toBe('welcome-bubble-pop');
    const pop = screen.getByTestId('welcome-bubble-pop');
    expect(pop.props.className).toBe('absolute top-7 right-5.5');
    expect((pop.children as TestInstance[]).map((child) => child.props.testID)).toEqual(['welcome-bubble']);
    const bubble = screen.getByTestId('welcome-bubble');
    expect(bubble.props.className).toBe('rounded-tl-16 rounded-tr-16 rounded-bl-16 rounded-br-4 bg-surface px-3.5 py-2.5');
    const style = StyleSheet.flatten(bubble.props.style);
    expect(style.borderCurve).toBe('continuous');
    expect(style.boxShadow).toHaveLength(2);
    expect(style.boxShadow).toEqual(result.current.card.boxShadow);
    expect(screen.getByTestId('welcome-bubble-text').props.className).toBe('text-sm font-bold text-foreground');
    const source = readSource('screens/welcome/index.tsx');
    expect(source).toContain('<PopIn testID="welcome-bubble-pop" className="absolute top-7 right-5.5">');
    expect(source).toMatch(/<View\s+testID="welcome-bubble"/);
    expect(source).not.toMatch(/<Card\b/);
    expect(source).toContain('const shadows = useShadows();');
    expect(source).toContain('style={[CONTINUOUS_CORNER, shadows.card]}');
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
    expect(screen.getByTestId('welcome-get-started').props.className).toBe('w-full h-14 rounded-16 bg-accent');
    expect(screen.getByText('Comenzar ahora')).toBeOnTheScreen();
    expect(screen.getByText('Comenzar ahora').props.className).toBe('text-17 font-extrabold text-accent-foreground');
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

  it('es un botón de superficie con labio gris y tinta accent-strong', async () => {
    await renderWelcome();
    expect(screen.getByTestId('welcome-have-account').props.className).toBe('w-full h-14 rounded-16 border-2 border-lip-gray bg-surface');
    expect(screen.getByText('Ya tengo una cuenta').props.className).toBe('text-17 font-bold text-accent-strong');
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
      .toEqual(['pingo-celebrate.webp', 'pingo-clipboard.webp', 'pingo-collar.webp', 'pingo-food.webp', 'pingo-health.webp', 'pingo-sleep.webp', 'pingo-talk.webp', 'pingo-wave-blink.webp', 'pingo-wave.webp']);
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
  it('apila la escena y los seis bloques de #118 en orden (enmendado por #205 R2)', async () => {
    await renderWelcome();
    const children = screen.getByTestId('welcome-content').children as TestInstance[];
    expect(children).toHaveLength(6); // #205 R2
    expect(children.map((child) => child.props.testID)).toEqual([
      'welcome-rise-scene', 'welcome-rise-chips', 'welcome-rise-heading', 'welcome-spacer',
      'welcome-rise-actions', 'welcome-legal', // #205 R2
    ]);
  });

  it('ya no pinta el logo', async () => {
    await renderWelcome();
    expect(screen.getByTestId('welcome-content')).toBeOnTheScreen();
    expect(screen.queryByTestId('welcome-hero')).toBeNull();
    expect(readSource('screens/welcome/index.tsx')).not.toContain('splash-icon');
  });

  it('pinta la escena como card secundaria con el bocadillo y Pingo (enmendado por #205 R3, R4)', async () => {
    await renderWelcome();
    const scene = screen.getByTestId('welcome-scene');
    expect(scene.props.className.split(' ')).toEqual(expect.arrayContaining([
      'rounded-32', 'bg-surface-secondary', 'w-full', 'items-center', 'justify-center', 'overflow-hidden', 'h-95', // #205 R3
    ]));
    expect(scene.props.className.split(' ')).not.toContain('rounded-card'); // #205 R3
    expect((scene.children as TestInstance[]).map((child) => child.props.testID)).toEqual(['welcome-ground', 'welcome-stage', 'welcome-bubble-pop']); // #205 R3, R4
  });

  it('pinta el bocadillo como card de superficie con el saludo (enmendado por #205 R4)', async () => {
    await renderWelcome();
    const bubble = screen.getByTestId('welcome-bubble');
    expect(bubble.props.className.split(' ')).toEqual(expect.arrayContaining([
      'rounded-tl-16', 'rounded-tr-16', 'rounded-bl-16', 'rounded-br-4', 'bg-surface', 'px-3.5', 'py-2.5', // #205 R4
    ]));
    expect(bubble.props.className.split(' ')).not.toContain('rounded-card'); // #205 R4
    expect(bubble.props.className.split(' ')).not.toContain('shadow-sm'); // #205 R4
    expect(bubble.children).toHaveLength(1);
    expect((bubble.children[0] as TestInstance).props.testID).toBe('welcome-bubble-text');
    expect(screen.getByTestId('welcome-bubble-text').props.className).toBe('text-sm font-bold text-foreground'); // #205 R4
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
  ] as const)('%s pinta su pose a 220×220, sin etiqueta de accesibilidad (enmendado por #205 R3)', async (testID, pattern) => {
    await renderWelcome();
    const image = screen.getByTestId(testID);
    expect(image.props.style).toEqual({ width: 220, height: 220 }); // #205 R3
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
    expect(screen.getByTestId('welcome-get-started').props.className).toBe('w-full h-14 rounded-16 bg-accent');
    expect(screen.getByText('Comenzar ahora').props.className).toBe('text-17 font-extrabold text-accent-foreground');
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

  it('arranca al 90 % sin reduce motion (enmendado por #205 R3)', async () => {
    await renderWelcome();
    expect(getAnimatedStyle(screen.getByTestId('welcome-pingo'))).toEqual({
      width: 220, height: 220, transform: [{ scale: 0.9 }], // #205 R3
    });
  });

  it('termina a tamaño completo sin reduce motion (enmendado por #205 R3)', async () => {
    await renderWelcome();
    expect(screen.getByTestId('welcome-pingo')).toBeOnTheScreen();
    // Unas 1,5 × 250 ms de asentamiento; 1000 ms deja más del doble.
    await act(async () => { jest.advanceTimersByTime(1000); });
    expect(getAnimatedStyle(screen.getByTestId('welcome-pingo'))).toEqual({
      width: 220, height: 220, transform: [{ scale: 1 }], // #205 R3
    });
  });

  it('con reduce motion nace a tamaño completo y no escala (enmendado por #205 R3)', async () => {
    mockUseReducedMotion.mockReturnValue(true);
    await renderWelcome();
    expect(getAnimatedStyle(screen.getByTestId('welcome-pingo'))).toEqual({
      width: 220, height: 220, transform: [{ scale: 1 }], // #205 R3
    });
    // 5000 ms supera el asentamiento y el primer parpadeo de 4000 ms.
    await act(async () => { jest.advanceTimersByTime(5000); });
    expect(getAnimatedStyle(screen.getByTestId('welcome-pingo'))).toEqual({
      width: 220, height: 220, transform: [{ scale: 1 }], // #205 R3
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

  it('repite la flotación sin fin y en vaivén', async () => {
    await renderWelcome();
    expect(screen.getByTestId('welcome-pingo')).toBeOnTheScreen();
    const args = mockWithRepeat.mock.calls.map((call) => call.slice(1));
    expect(args.filter((values) => values.length === 2 && values[0] === -1 && values[1] === true)).toEqual([[-1, true]]);
  });

  it('con reduce motion no flota (enmendado por #205 R3)', async () => {
    mockUseReducedMotion.mockReturnValue(true);
    await renderWelcome();
    expect(screen.getByTestId('welcome-pingo')).toBeOnTheScreen();
    // 5000 ms supera el ciclo de 2400 ms y el primer parpadeo de 4000 ms.
    await act(async () => { jest.advanceTimersByTime(5000); });
    expect(getAnimatedStyle(screen.getByTestId('welcome-pingo'))).toEqual({
      width: 220, height: 220, transform: [{ scale: 1 }], // #205 R3
    });
    expect(mockWithRepeat).not.toHaveBeenCalled();
    mockUseReducedMotion.mockReturnValue(false);
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

describe('#166 R3: el CTA secundario lleva el labio gris', () => {
  it('lleva el labio gris en el CTA secundario', async () => {
    await renderWelcome();
    const secondary = screen.getByTestId('welcome-have-account');
    expect(secondary.props.className).toContain('h-14 rounded-16');
    expect(secondary.props.className).not.toContain('border-b-6');
    expect(secondary.props.className).toContain('border-lip-gray');
    expect(secondary.props.className).toContain('bg-surface');
    expect(secondary.props.className).not.toContain('border-black');
    expect(secondary.props.className).not.toContain('border-accent');
    expect(secondary.props.className).not.toContain('bg-transparent');
  });
});


describe('#167 R11: la carta declara los anillos de ping', () => {
  const charter = readFileSync(join(process.cwd(), '..', 'docs', 'ui-guidelines.md'), 'utf8');
  const idleLoops = `- **Bucles de reposo.** Flotar, parpadear y los tres anillos de ping que
  rodean a Pingo en la bienvenida son las únicas animaciones continuas de
  Pingo, y una excepción declarada a §Animación: animan \`translateY\`,
  \`scale\` y \`opacity\` con timing y duraciones fuera de 150/250/400,
  porque no entran, ni salen, ni responden a un gesto. Sus constantes viven en
  \`src/theme/motion.ts\` y no arrancan con reduce motion.`;
  const heading = '## Enmienda #167 — anillos de ping de la bienvenida';
  const amendmentBody = `Los tres anillos de ping de la bienvenida amplían los bucles de reposo de
§Animación punto 7. Cada anillo es un círculo de borde \`border-accent\` que
crece de \`MOTION_PING_FROM\` a \`MOTION_PING_TO_SCALE\` mientras su opacidad cae
de \`MOTION_PING_FROM\` a 0, con \`MOTION_PING_TIMING\`, en bucle infinito y sin
invertir. Los anillos arrancan escalonados un tercio de la duración. Con
reduce motion no se pintan.

Ninguna otra pantalla usa anillos de ping sin una enmienda propia.`.trimEnd();

  it('#167 R11: la viñeta de bucles de reposo nombra los anillos', () => {
    expect(charter.split(idleLoops).length - 1).toBe(1);
  });

  it('#167 R11: no queda la redacción vieja de la viñeta', () => {
    expect(charter).not.toContain('Flotar y parpadear son las únicas');
  });

  it('#167 R11: la carta trae la enmienda de los anillos', () => {
    expect(charter.split(`${heading}\n\n${amendmentBody}`).length - 1).toBe(1);
    expect(charter.slice(charter.indexOf(heading))).toMatch(/- \[[ xX]\] Enmienda aprobada por humano/);
  });

  it('#167 R11: el checklist de autocrítica sigue apareciendo una vez', () => {
    expect(charter.split('## Checklist de autocrítica').length - 1).toBe(1);
  });
});


describe('#167 R12: anillos de ping', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockUseReducedMotion.mockReturnValue(false);
  });
  afterEach(() => jest.useRealTimers());

  it('#167 R12: el escenario apila tres anillos bajo Pingo (enmendado por #205 R3)', async () => {
    await renderWelcome();
    expect(screen.getByTestId('welcome-stage').children
      .map((child) => typeof child === 'string' ? child : child.props.testID)).toEqual([
      'welcome-ring-0', 'welcome-ring-1', 'welcome-ring-2', 'welcome-pingo-float', // #205 R3
    ]);
  });

  it('#167 R12: el escenario centra su contenido', async () => {
    await renderWelcome();
    expect(screen.getByTestId('welcome-stage').props.className).toBe('items-center justify-center');
  });

  it.each([0, 1, 2])('#167 R12: el anillo %i es un círculo de borde acento', async (index) => {
    await renderWelcome();
    expect(screen.getByTestId(`welcome-ring-${index}`).props.className)
      .toBe('absolute size-65 rounded-full border-2 border-accent');
  });

  it('#167 R12: los anillos se repiten sin invertir', async () => {
    await renderWelcome();
    const args = mockWithRepeat.mock.calls.map((call) => call.slice(1));
    expect(args.filter((values) => values.length === 2 && values[0] === -1 && values[1] === false))
      .toHaveLength(6);
  });

  it('#167 R12: a los 0 ms los tres anillos están en su inicio', async () => {
    await renderWelcome();
    await act(async () => { jest.advanceTimersByTime(0); });
    for (const index of [0, 1, 2]) {
      expect(getAnimatedStyle(screen.getByTestId(`welcome-ring-${index}`)))
        .toEqual({ opacity: 0.55, transform: [{ scale: 0.55 }] });
    }
  });

  it('#167 R12: a los 700 ms solo ha arrancado el anillo 0', async () => {
    await renderWelcome();
    await act(async () => { jest.advanceTimersByTime(700); });
    expect(getAnimatedStyle(screen.getByTestId('welcome-ring-0')))
      .not.toEqual({ opacity: 0.55, transform: [{ scale: 0.55 }] });
    for (const index of [1, 2]) {
      expect(getAnimatedStyle(screen.getByTestId(`welcome-ring-${index}`)))
        .toEqual({ opacity: 0.55, transform: [{ scale: 0.55 }] });
    }
  });

  it('#167 R12: a los 1500 ms han arrancado los anillos 0 y 1', async () => {
    await renderWelcome();
    await act(async () => { jest.advanceTimersByTime(1500); });
    for (const index of [0, 1]) {
      expect(getAnimatedStyle(screen.getByTestId(`welcome-ring-${index}`)))
        .not.toEqual({ opacity: 0.55, transform: [{ scale: 0.55 }] });
    }
    expect(getAnimatedStyle(screen.getByTestId('welcome-ring-2')))
      .toEqual({ opacity: 0.55, transform: [{ scale: 0.55 }] });
  });

  it('#167 R12: a los 2500 ms el anillo 0 ha terminado y los otros siguen', async () => {
    await renderWelcome();
    await act(async () => { jest.advanceTimersByTime(2500); });
    expect(getAnimatedStyle(screen.getByTestId('welcome-ring-0')))
      .toEqual({ opacity: 0, transform: [{ scale: 1.5 }] });
    for (const index of [1, 2]) {
      expect(getAnimatedStyle(screen.getByTestId(`welcome-ring-${index}`)))
        .not.toEqual({ opacity: 0, transform: [{ scale: 1.5 }] });
    }
  });

  it('#167 R12: a los 3300 ms los anillos 0 y 1 han terminado y el 2 sigue', async () => {
    await renderWelcome();
    await act(async () => { jest.advanceTimersByTime(3300); });
    for (const index of [0, 1]) {
      expect(getAnimatedStyle(screen.getByTestId(`welcome-ring-${index}`)))
        .toEqual({ opacity: 0, transform: [{ scale: 1.5 }] });
    }
    expect(getAnimatedStyle(screen.getByTestId('welcome-ring-2')))
      .not.toEqual({ opacity: 0, transform: [{ scale: 1.5 }] });
  });

  it('#167 R12: a los 4100 ms los tres anillos han terminado', async () => {
    await renderWelcome();
    await act(async () => { jest.advanceTimersByTime(4100); });
    for (const index of [0, 1, 2]) {
      expect(getAnimatedStyle(screen.getByTestId(`welcome-ring-${index}`)))
        .toEqual({ opacity: 0, transform: [{ scale: 1.5 }] });
    }
  });
});


describe('#167 R13: sin anillos con reduce motion', () => {
  beforeEach(() => mockUseReducedMotion.mockReturnValue(true));

  it('#167 R13: con reduce motion el escenario solo lleva a Pingo (enmendado por #205 R3)', async () => {
    await renderWelcome();
    expect(screen.getByTestId('welcome-stage').children
      .map((child) => typeof child === 'string' ? child : child.props.testID)).toEqual(['welcome-pingo-float']); // #205 R3
  });

  it.each([0, 1, 2])('#167 R13: con reduce motion no hay anillo %i', async (index) => {
    await renderWelcome();
    expect(screen.queryByTestId(`welcome-ring-${index}`)).toBeNull();
  });
});
