import { render, screen } from '@testing-library/react-native';
import { Redirect } from 'expo-router';
import { HeroUINativeProvider } from 'heroui-native';
import type { ReactNode } from 'react';
import { StyleSheet } from 'react-native';
import type { TestInstance } from 'test-renderer';

import { useAuth, type AuthContextValue } from '../../providers/auth-provider';
import { LanguageProvider } from '../../providers/language-provider';
import { WelcomeScreen } from './index';

const { readFileSync } = jest.requireActual<typeof import('fs')>('fs');
const { join } = jest.requireActual<typeof import('path')>('path');
const sourceRoot = join(process.cwd(), 'src');

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
