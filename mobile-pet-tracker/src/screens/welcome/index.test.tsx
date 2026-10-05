import { act, fireEvent, render, screen } from '@testing-library/react-native';
import { Redirect, router } from 'expo-router';
import { HeroUINativeProvider } from 'heroui-native';
import type { ReactNode } from 'react';
import { StyleSheet } from 'react-native';
import type { TestInstance } from 'test-renderer';

import { useAuth, type AuthContextValue } from '../../providers/auth-provider';
import { LanguageProvider } from '../../providers/language-provider';
import { useThemeColors } from '../../theme/use-theme-colors';
import { WelcomeScreen, WELCOME_ENTRANCE_MS, WELCOME_ENTRANCE_EASING } from './index';

const { readFileSync } = jest.requireActual<typeof import('fs')>('fs');
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
  return { ...actual, __esModule: true, useReducedMotion: () => mockUseReducedMotion() };
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
      'welcome-hero', 'welcome-brand', 'welcome-chips', 'welcome-tagline',
      'welcome-get-started', 'welcome-have-account', 'welcome-legal',
    ]);
  });

  it('pinta hero, marca, tagline y legal con sus clases', async () => {
    await renderWelcome();
    expect(screen.getByTestId('welcome-brand').props.className).toBe('text-3xl font-bold text-foreground');
    expect(screen.getByTestId('welcome-tagline').props.className).toBe('text-center text-base text-muted');
    expect(screen.getByTestId('welcome-legal').props.className).toBe('text-center text-xs text-muted');
    expect(StyleSheet.flatten(screen.getByTestId('welcome-content').props.style)).toMatchObject({ alignItems: 'center', gap: 16 });
    expect(screen.getByTestId('welcome-hero').props.contentFit).toBe('contain');
    expect(screen.getByTestId('welcome-hero').props.style).toEqual({ width: 160, height: 160 });
    expect(screen.getByTestId('welcome-hero').props.source).toEqual([expect.objectContaining({ testUri: expect.stringMatching(/assets\/images\/splash-icon\.png$/) })]);
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
    expect(screen.getByTestId('welcome-get-started').props.className).toBe('w-full rounded-xl bg-accent');
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


describe('R10', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('fija la duración y la curva', () => {
    expect(WELCOME_ENTRANCE_MS).toBe(240);
    const expected = jest.requireActual<typeof import('react-native-reanimated')>('react-native-reanimated').Easing.bezier(0.23, 1, 0.32, 1).factory();
    for (const point of [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9]) {
      expect(WELCOME_ENTRANCE_EASING.factory()(point)).toBeCloseTo(expected(point), 6);
    }
    const source = readSource('screens/welcome/index.tsx');
    expect(source.match(/duration: WELCOME_ENTRANCE_MS,\s*easing: WELCOME_ENTRANCE_EASING,/g) ?? []).toHaveLength(2);
    expect(source.match(/\b(duration|easing):/g) ?? []).toHaveLength(4);
    expect(source.match(/reduceMotion: ReduceMotion\.Never/g) ?? []).toHaveLength(1);
    expect(source.match(/\breduceMotion:/g) ?? []).toHaveLength(1);
    expect(source).toMatch(/opacity\.set\(withTiming\(1, \{[^}]*reduceMotion: ReduceMotion\.Never,[^}]*\}\)\)/);
  });

  it('arranca invisible y desplazado sin Reduce Motion', async () => {
    await renderWelcome();
    expect(screen.getByTestId('welcome-content')).toHaveAnimatedStyle({
      alignItems: 'center', gap: 16,
      opacity: 0, transform: [{ translateY: 16 }],
    }, { shouldMatchAllProps: true });
  });

  it('termina visible y en su sitio sin Reduce Motion', async () => {
    await renderWelcome();
    expect(screen.getByTestId('welcome-content')).toHaveAnimatedStyle({
      alignItems: 'center', gap: 16,
      opacity: 0, transform: [{ translateY: 16 }],
    }, { shouldMatchAllProps: true });
    await act(async () => {
      jest.advanceTimersByTime(WELCOME_ENTRANCE_MS * 2 + 100);
    });
    expect(screen.getByTestId('welcome-content')).toHaveAnimatedStyle({
      alignItems: 'center', gap: 16,
      opacity: 1, transform: [{ translateY: 0 }],
    }, { shouldMatchAllProps: true });
  });

  it('con Reduce Motion no se desplaza', async () => {
    mockUseReducedMotion.mockReturnValue(true);
    await renderWelcome();
    expect(screen.getByTestId('welcome-content')).toHaveAnimatedStyle({
      alignItems: 'center', gap: 16,
      opacity: 0, transform: [{ translateY: 0 }],
    }, { shouldMatchAllProps: true });
    await act(async () => {
      jest.advanceTimersByTime(WELCOME_ENTRANCE_MS * 2 + 100);
    });
    expect(screen.getByTestId('welcome-content')).toHaveAnimatedStyle({
      alignItems: 'center', gap: 16,
      opacity: 1, transform: [{ translateY: 0 }],
    }, { shouldMatchAllProps: true });
  });
});
