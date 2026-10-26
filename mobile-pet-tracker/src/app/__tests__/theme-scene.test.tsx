import { readdirSync } from 'fs';
import { join } from 'path';

import { DefaultTheme, useTheme } from 'expo-router';
import { renderRouter } from 'expo-router/testing-library';
import { screen } from '@testing-library/react-native';
import { Text } from 'react-native';

import AuthLayout from '../(auth)/_layout';
import TabsLayout from '../(tabs)/_layout';
import RootLayout from '../_layout';

let mockTheme: 'light' | 'dark' = 'light';
let sceneTheme: ReturnType<typeof useTheme> | undefined;

jest.mock('standard-navigation', () => ({}));
jest.mock('expo-font', () => ({ useFonts: () => [true] }));
jest.mock('../../utils/theme-preference', () => ({
  getStoredTheme: jest.fn().mockResolvedValue(undefined),
}));
jest.mock('../../utils/language-preference', () => ({
  getStoredLanguage: jest.fn().mockResolvedValue(undefined),
  setStoredLanguage: jest.fn(),
}));
jest.mock('heroui-native', () => ({
  HeroUINativeProvider: ({ children }: { children: React.ReactNode }) => children,
}));
jest.mock('react-native-gesture-handler', () => ({
  GestureHandlerRootView: ({ children }: { children: React.ReactNode }) => children,
}));
jest.mock('../../hooks/use-push-registration', () => ({ usePushRegistration: jest.fn() }));
jest.mock('../../components/floating-tab-bar', () => ({ FloatingTabBar: () => null }));
jest.mock('../../providers/auth-provider', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => children,
  useAuth: () => ({ status: 'authenticated', token: 'token-a', signOut: jest.fn() }),
}));
jest.mock('../../theme/use-theme-colors', () => ({
  useThemeColors: (tokens: readonly string[]) => tokens.map((token) => `token:${token}`),
}));
jest.mock('uniwind', () => ({
  ...jest.requireActual('uniwind'),
  useUniwind: () => ({ theme: mockTheme, hasAdaptiveThemes: false }),
}));

function ThemeProbe() {
  const theme = useTheme();
  sceneTheme = theme;
  return <Text testID="theme-scene-background">{String(theme.colors.background)}</Text>;
}

function routes() {
  const result: Record<string, React.ComponentType> = {};
  const walk = (directory: string, prefix = '') => {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      if (entry.name === '__tests__') continue;
      const name = prefix ? `${prefix}/${entry.name}` : entry.name;
      if (entry.isDirectory()) walk(join(directory, entry.name), name);
      else if (entry.name.endsWith('.tsx')) {
        const key = name.replace(/\.tsx$/, '');
        if (key === '_layout') result[key] = RootLayout;
        else if (key === '(tabs)/_layout') result[key] = TabsLayout;
        else if (key === '(auth)/_layout') result[key] = AuthLayout;
        else if (key === '(tabs)/home') result[key] = ThemeProbe;
        else if (key.endsWith('/_layout')) throw new Error(`Unexpected layout: ${key}`);
        else result[key] = () => <Text>{key}</Text>;
      }
    }
  };
  walk(join(process.cwd(), 'src/app'));
  return result;
}

describe('#217 R3: las pestañas reciben el tema raíz', () => {
  beforeEach(() => {
    mockTheme = 'light';
    sceneTheme = undefined;
  });
  afterEach(() => jest.useRealTimers());

  it('#217 R3: la pestaña lee el fondo de los tokens, no el de DefaultTheme', async () => {
    const app = renderRouter(routes(), { initialUrl: '/home' });
    jest.useRealTimers();
    await app;
    const probe = await screen.findByTestId('theme-scene-background');

    expect(probe).toHaveTextContent('token:background');
    expect(sceneTheme?.colors.background).not.toBe(DefaultTheme.colors.background);
    expect(sceneTheme?.colors.text).toBe('token:foreground');
    expect(sceneTheme?.dark).toBe(false);
  });

  it('#217 R3: con tema oscuro la pestaña lee dark verdadero', async () => {
    mockTheme = 'dark';
    const app = renderRouter(routes(), { initialUrl: '/home' });
    jest.useRealTimers();
    await app;
    const probe = await screen.findByTestId('theme-scene-background');

    expect(sceneTheme?.dark).toBe(true);
    expect(probe).toHaveTextContent('token:background');
    expect(sceneTheme?.colors.text).toBe('token:foreground');
  });
});
