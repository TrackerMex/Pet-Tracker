import {
  cleanup,
  render,
  screen,
  waitFor,
} from '@testing-library/react-native';
import type { QueryClient } from '@tanstack/react-query';
import * as Notifications from 'expo-notifications';
import { Stack, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Children, isValidElement, type ReactNode } from 'react';
import { Uniwind } from 'uniwind';

import { getStoredLanguage } from '../../utils/language-preference';
import { getStoredTheme } from '../../utils/theme-preference';
import RootLayout from '../_layout';

const { readFileSync } = jest.requireActual<typeof import('fs')>('fs');
const { join } = jest.requireActual<typeof import('path')>('path');

let mockUseQueryInStack = false;
let mockLayoutQueryClient: QueryClient | undefined;
const mockSetPushToken = jest.fn();
const mockNavigationThemeSentinel = { source: 'navigation-theme-sentinel' };

jest.mock('../../theme/navigation-theme', () => ({
  useNavigationTheme: () => mockNavigationThemeSentinel,
}));
jest.mock('expo-status-bar', () => ({ StatusBar: jest.fn(() => null) }));

jest.mock('../../utils/language-preference', () => ({
  getStoredLanguage: jest.fn(),
}));

jest.mock('../../utils/theme-preference', () => ({
  getStoredTheme: jest.fn(),
}));

jest.mock('uniwind', () => ({
  Uniwind: { setTheme: jest.fn() },
}));

jest.mock('expo-font', () => ({
  useFonts: jest.fn(() => [true]),
}));

jest.mock('expo-device', () => ({ isDevice: true }));

jest.mock('expo-constants', () => ({
  __esModule: true,
  default: {
    expoConfig: { extra: { eas: { projectId: 'project-id' } } },
  },
}));

jest.mock('expo-notifications', () => ({
  AndroidImportance: { MAX: 7 },
  setNotificationHandler: jest.fn(),
  setNotificationChannelAsync: jest.fn().mockResolvedValue(null),
  getPermissionsAsync: jest
    .fn()
    .mockResolvedValue({ granted: true, canAskAgain: true }),
  requestPermissionsAsync: jest
    .fn()
    .mockResolvedValue({ granted: true, canAskAgain: true }),
  getExpoPushTokenAsync: jest
    .fn()
    .mockResolvedValue({ type: 'expo', data: 'ExpoPushToken[layout]' }),
  addNotificationResponseReceivedListener: jest
    .fn()
    .mockReturnValue({ remove: jest.fn() }),
  getLastNotificationResponseAsync: jest.fn().mockResolvedValue(null),
}));

jest.mock('expo-router', () => {
  const React = jest.requireActual<typeof import('react')>('react');
  const { Text, View } = jest.requireActual<typeof import('react-native')>(
    'react-native',
  );
  const { useQuery, useQueryClient } = jest.requireActual<
    typeof import('@tanstack/react-query')
  >('@tanstack/react-query');

  function QueryStack() {
    mockLayoutQueryClient = useQueryClient();
    const query = useQuery({
      queryKey: ['layout-probe'],
      queryFn: async () => 'ok',
    });

    return React.createElement(Text, { testID: 'query-probe' }, query.data);
  }

  return {
    ThemeProvider: jest.fn(({ children }: { children: ReactNode }) => children),
    router: { push: jest.fn() },
    usePathname: () => '/home',
    Stack: Object.assign(
      jest.fn(() =>
        mockUseQueryInStack
          ? React.createElement(QueryStack)
          : React.createElement(View, { testID: 'root-stack' }),
      ),
      { Screen: jest.fn(() => null), Protected: jest.fn(() => null) },
    ),
  };
});

jest.mock('heroui-native', () => ({
  HeroUINativeProvider: ({ children }: { children: ReactNode }) => children,
}));

jest.mock('react-native-gesture-handler', () => ({
  GestureHandlerRootView: ({ children }: { children: ReactNode }) => children,
}));

jest.mock('../../providers/auth-provider', () => ({
  AuthProvider: ({ children }: { children: ReactNode }) => children,
  useAuth: () => ({
    status: 'authenticated',
    token: 'test-token',
    signIn: jest.fn(),
    signOut: jest.fn(),
    setPushToken: mockSetPushToken,
  }),
}));

jest.mock('../../providers/language-provider', () => {
  const React = jest.requireActual<typeof import('react')>('react');
  const { View } = jest.requireActual<typeof import('react-native')>(
    'react-native',
  );

  return {
    useTranslate: () => (key: string) => `t:${key}`,
    LanguageProvider: ({
      children,
      initial,
    }: {
      children: ReactNode;
      initial: string;
    }) =>
      React.createElement(
        View,
        { accessibilityLabel: initial, testID: 'language-provider' },
        children,
      ),
  };
});

jest.mock('../../theme/use-theme-colors', () => ({
  useThemeColors: (tokens: string[]) => tokens.map((token) => `token:${token}`),
}));

const mockGetStoredLanguage = jest.mocked(getStoredLanguage);
const mockGetStoredTheme = jest.mocked(getStoredTheme);
const mockSetTheme = jest.mocked(Uniwind.setTheme);
const mockGetPermissions = jest.mocked(Notifications.getPermissionsAsync);

describe('#217 R2: proveedor raíz del tema de navegación', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseQueryInStack = false;
    mockGetStoredTheme.mockResolvedValue(undefined);
    mockGetStoredLanguage.mockResolvedValue(undefined);
  });

  it('#217 R2: el ThemeProvider raíz recibe el tema de navegación', async () => {
    await render(<RootLayout />);
    await screen.findByTestId('root-stack');

    expect(jest.mocked(ThemeProvider).mock.calls.at(-1)?.[0].value)
      .toBe(mockNavigationThemeSentinel);
  });

  it('#217 R2: el orden de la fuente es hook, proveedor, HeroUINativeProvider', () => {
    const source = readFileSync(join(process.cwd(), 'src/app/_layout.tsx'), 'utf8');
    const hook = source.indexOf('useNavigationTheme()');
    const ready = source.indexOf('if (!themeReady)');
    const provider = source.indexOf('<ThemeProvider value={navigationTheme}>');

    expect(hook).toBeGreaterThan(-1);
    expect(hook).toBeLessThan(ready);
    expect(ready).toBeLessThan(provider);
    expect(provider).toBeLessThan(source.indexOf('<HeroUINativeProvider>'));
  });

  it('#217 R4: monta una sola StatusBar auto antes del proveedor de HeroUI', async () => {
    await render(<RootLayout />);
    await screen.findByTestId('root-stack');

    expect(jest.mocked(StatusBar).mock.calls.map(([props]) => props)).toEqual([{ style: 'auto' }]);
    const source = readFileSync(join(process.cwd(), 'src/app/_layout.tsx'), 'utf8');
    const statusBar = source.indexOf('<StatusBar style="auto" />');
    expect(source.indexOf('<ThemeProvider value={navigationTheme}>')).toBeLessThan(statusBar);
    expect(statusBar).toBeLessThan(source.indexOf('<HeroUINativeProvider>'));
    expect(source.split('<StatusBar')).toHaveLength(2);
  });
});

describe('R4: RootLayout restaura el tema', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetStoredLanguage.mockResolvedValue(undefined);
  });

  it('restores a saved theme before rendering the stable tree', async () => {
    let resolveTheme: (theme: 'dark') => void = () => undefined;
    mockGetStoredTheme.mockReturnValue(
      new Promise((resolve) => {
        resolveTheme = resolve;
      }),
    );

    await render(<RootLayout />);
    expect(screen.queryByTestId('root-stack')).toBeNull();
    resolveTheme('dark');

    await waitFor(() => expect(screen.getByTestId('root-stack')).toBeVisible());
    expect(mockSetTheme).toHaveBeenCalledWith('dark');
  });

  it('uses the current default when storage has no preference', async () => {
    mockGetStoredTheme.mockResolvedValue(undefined);

    await render(<RootLayout />);

    await waitFor(() => expect(screen.getByTestId('root-stack')).toBeVisible());
    expect(mockSetTheme).not.toHaveBeenCalled();
  });
});

describe('#65 R16: sin preferencia guardada la app arranca en español', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetStoredTheme.mockResolvedValue(undefined);
    mockGetStoredLanguage.mockResolvedValue(undefined);
  });

  it('mounts the language provider with Spanish when storage is empty', async () => {
    await render(<RootLayout />);

    await waitFor(() =>
      expect(screen.getByTestId('language-provider')).toHaveProp(
        'accessibilityLabel',
        'es',
      ),
    );
    expect(mockGetStoredLanguage).toHaveBeenCalledTimes(1);
  });

  it('uses the existing startup gate until both preferences resolve', async () => {
    let resolveLanguage: (language: undefined) => void = () => undefined;
    mockGetStoredLanguage.mockReturnValue(
      new Promise((resolve) => {
        resolveLanguage = resolve;
      }),
    );

    await render(<RootLayout />);
    expect(screen.queryByTestId('root-stack')).toBeNull();
    resolveLanguage(undefined);

    await waitFor(() => expect(screen.getByTestId('root-stack')).toBeVisible());
  });
});

describe('#87 R4: QueryProvider envuelve la app dentro de AuthProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetStoredTheme.mockResolvedValue(undefined);
    mockGetStoredLanguage.mockResolvedValue(undefined);
    mockUseQueryInStack = true;
  });

  afterEach(async () => {
    await cleanup();
    mockLayoutQueryClient?.clear();
    mockLayoutQueryClient = undefined;
    mockUseQueryInStack = false;
  });

  it('keeps AuthProvider outside QueryProvider and QueryProvider outside Stack', () => {
    const source = readFileSync(
      join(process.cwd(), 'src', 'app', '_layout.tsx'),
      'utf8',
    );
    const authIndex = source.indexOf('<AuthProvider>');
    const queryIndex = source.indexOf('<QueryProvider>');
    const stackIndex = source.indexOf('<Stack ');

    expect(authIndex).toBeGreaterThan(-1);
    expect(queryIndex).toBeGreaterThan(authIndex);
    expect(stackIndex).toBeGreaterThan(queryIndex);
    expect(source).toContain('</QueryProvider>');
  });

  it('provides a QueryClient to the routed tree', async () => {
    await render(<RootLayout />);

    await waitFor(() =>
      expect(screen.getByTestId('query-probe')).toHaveTextContent('ok'),
    );
  });
});

describe('#79 R11: el registro de push se monta dentro de AuthProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetStoredTheme.mockResolvedValue(undefined);
    mockGetStoredLanguage.mockResolvedValue(undefined);
  });

  it('conserva el Stack y consulta permisos con la sesión disponible', async () => {
    await render(<RootLayout />);

    await waitFor(() => {
      expect(screen.getByTestId('root-stack')).toBeVisible();
      expect(mockGetPermissions).toHaveBeenCalledTimes(1);
    });
  });
});

describe('#95 R2: el layout raíz monta el provider y el Stack de detalle', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetStoredTheme.mockResolvedValue(undefined);
    mockGetStoredLanguage.mockResolvedValue(undefined);
  });

  it('sitúa SelectedPetProvider dentro de QueryProvider y declara RootStack después del layout', () => {
    const source = readFileSync(join(process.cwd(), 'src/app/_layout.tsx'), 'utf8');
    const markers = [
      '<QueryProvider>',
      '<SelectedPetProvider>',
      '<PushRegistration />',
      '<RootStack />',
      '</SelectedPetProvider>',
      '</QueryProvider>',
    ];
    let previous = -1;
    for (const marker of markers) {
      const position = source.indexOf(marker);
      expect(position).toBeGreaterThan(previous);
      previous = position;
    }
    expect(source.indexOf('function RootStack')).toBeGreaterThan(
      source.indexOf('export default function RootLayout'),
    );
  });

  it('declara cuatro rutas abiertas y las seis de detalle bajo una guarda', async () => {
    await render(<RootLayout />);
    await waitFor(() => expect(jest.mocked(Stack)).toHaveBeenCalled());
    const props = jest.mocked(Stack).mock.calls.at(-1)?.[0];
    expect(props?.screenOptions).toEqual({ headerShown: false });
    const children = Children.toArray(props?.children);
    expect(children).toHaveLength(5 + 1); // #118 R3
    expect(children.slice(0, 4).map((child) =>
      isValidElement<{ name: string; options?: unknown }>(child)
        ? [child.type, child.props.name, child.props.options]
        : null,
    )).toEqual([
      [Stack.Screen, 'index', undefined],
      [Stack.Screen, '(tabs)', undefined],
      [Stack.Screen, '(auth)', undefined],
      [Stack.Screen, 'reset-password', undefined],
    ]);
    const protectedGroup = children[4];
    expect(isValidElement<{ guard: boolean; children: ReactNode }>(protectedGroup)).toBe(true);
    if (!isValidElement<{ guard: boolean; children: ReactNode }>(protectedGroup)) return;
    expect(protectedGroup.type).toBe(Stack.Protected);
    expect(protectedGroup.props.guard).toBe(true);
    expect(Children.toArray(protectedGroup.props.children).slice(0, 7).map((child) =>
      // #114 R1: reminders y alerts van detrás
      isValidElement<{ name: string }>(child) ? [child.type, child.props.name] : null,
    )).toEqual([
      [Stack.Screen, 'add-reminder'],
      [Stack.Screen, 'pets/add'],
      [Stack.Screen, 'pets/[petId]/docs'],
      [Stack.Screen, 'pets/[petId]/docs-upload'], // #185 R10
      [Stack.Screen, 'weight-log'],
      [Stack.Screen, 'meal-schedule'],
      [Stack.Screen, 'pairing'],
    ]);
  });
});

describe('#95 R4: cada pantalla de detalle declara su cabecera nativa', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetStoredTheme.mockResolvedValue(undefined);
    mockGetStoredLanguage.mockResolvedValue(undefined);
  });

  it.each([
    ['pets/[petId]/docs-upload', ''], // #185 R10
    ['edit-profile', ''], // #194 R4
  ])('#194 R4: %s usa exactamente las opciones de cabecera acordadas (enmendado por #200 R12) (enmendado por #199 R1) (enmendado por #203 R1) (enmendado por #204 R1) (enmendado por #205 R15)', async (name, title) => {
    await render(<RootLayout />);
    await waitFor(() => expect(screen.getByTestId('root-stack')).toBeVisible());
    const stack = jest.mocked(Stack).mock.calls.at(-1)?.[0];
    const group = Children.toArray(stack?.children)[4];
    if (!isValidElement<{ children: ReactNode }>(group)) throw new Error('Expected protected group');
    const detail = Children.toArray(group.props.children).find((child) =>
      isValidElement<{ name: string }>(child) && child.props.name === name,
    );
    expect(isValidElement<{ options?: unknown }>(detail) ? detail.props.options : undefined).toEqual({
      headerShown: true,
      title,
      headerStyle: { backgroundColor: 'token:background' },
      headerTintColor: 'token:foreground',
      headerTitleStyle: { fontFamily: 'Inter-Bold' },
      headerShadowVisible: false,
    });
  });
});

describe('#114 R1: la guarda de RootStack declara reminders y alerts tras las seis', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetStoredTheme.mockResolvedValue(undefined);
    mockGetStoredLanguage.mockResolvedValue(undefined);
  });

  it('#194 R4: declara ocho rutas protegidas y alerts singular (enmendado por #208 R4) (enmendado por #214 R3)', async () => {
    await render(<RootLayout />);
    await waitFor(() => expect(jest.mocked(Stack)).toHaveBeenCalled());
    const stack = jest.mocked(Stack).mock.calls.at(-1)?.[0];
    const group = Children.toArray(stack?.children)[4];
    if (!isValidElement<{ children: ReactNode }>(group)) throw new Error('Expected protected group');
    const children = Children.toArray(group.props.children);
    expect(children).toHaveLength(8 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 3); // #194 R4 // #185 R10 // #100 R2, #41 R4, #146 R5, #105 R8 // #208 R4 // #214 R3
    expect(children.slice(7, 9).map((child) =>
      isValidElement<{ name: string; dangerouslySingular?: boolean }>(child)
        ? [child.type, child.props.name, child.props.dangerouslySingular]
        : null,
    )).toEqual([
      [Stack.Screen, 'reminders', undefined],
      [Stack.Screen, 'alerts', true],
    ]);
  });
});

describe('#100 R2: la guarda de RootStack declara el detalle de alerta tras alerts', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetStoredTheme.mockResolvedValue(undefined);
    mockGetStoredLanguage.mockResolvedValue(undefined);
  });

  it('#194 R4: declara alerts/[alertId] como décimo hijo y singular (enmendado por #208 R4) (enmendado por #214 R3)', async () => {
    await render(<RootLayout />);
    await waitFor(() => expect(jest.mocked(Stack)).toHaveBeenCalled());
    const stack = jest.mocked(Stack).mock.calls.at(-1)?.[0];
    const group = Children.toArray(stack?.children)[4];
    if (!isValidElement<{ children: ReactNode }>(group)) throw new Error('Expected protected group');
    const children = Children.toArray(group.props.children);
    expect(children).toHaveLength(9 + 1 + 1 + 1 + 1 + 1 + 1 + 3); // #194 R4 // #185 R10 // #41 R4, #146 R5, #105 R8 // #208 R4 // #214 R3
    const detail = children[9];
    expect(isValidElement<{ name: string; dangerouslySingular?: boolean }>(detail)
      ? [detail.type, detail.props.name, detail.props.dangerouslySingular]
      : null).toEqual([Stack.Screen, 'alerts/[alertId]', true]);
  });

  it('le da la cabecera nativa de #95 R4 con título vacío (enmendado por #180 R1) (enmendado por #203 R1)', async () => {
    await render(<RootLayout />);
    await waitFor(() => expect(jest.mocked(Stack)).toHaveBeenCalled());
    const stack = jest.mocked(Stack).mock.calls.at(-1)?.[0];
    const group = Children.toArray(stack?.children)[4];
    if (!isValidElement<{ children: ReactNode }>(group)) throw new Error('Expected protected group');
    const detail = Children.toArray(group.props.children)[9];
    expect(isValidElement<{ options?: unknown }>(detail) ? detail.props.options : undefined).toEqual({
      headerShown: false,
      contentStyle: { backgroundColor: 'token:background' },
    });
  });
  it('#170 R9: pinta el fondo del tema bajo el detalle de alerta', async () => {
    await render(<RootLayout />);
    await screen.findByTestId('root-stack');
    const stack = jest.mocked(Stack).mock.calls.at(-1)?.[0];
    const group = Children.toArray(stack?.children)[4];
    if (!isValidElement<{ children: ReactNode }>(group)) throw new Error('Expected protected group');
    const detail = Children.toArray(group.props.children)[9];
    expect(isValidElement<{ options?: { contentStyle?: unknown } }>(detail) ? detail.props.options?.contentStyle : undefined).toEqual({ backgroundColor: 'token:background' });
  });

});

describe('#41 R4: la guarda de RootStack declara las zonas seguras tras el detalle de alerta', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetStoredTheme.mockResolvedValue(undefined);
    mockGetStoredLanguage.mockResolvedValue(undefined);
  });

  it('#194 R4: declara pets/[petId]/geofences como undécimo hijo y no singular (enmendado por #189 R1.1) (enmendado por #208 R4) (enmendado por #214 R3)', async () => {
    await render(<RootLayout />);
    await waitFor(() => expect(jest.mocked(Stack)).toHaveBeenCalled());
    const stack = jest.mocked(Stack).mock.calls.at(-1)?.[0];
    const group = Children.toArray(stack?.children)[4];
    if (!isValidElement<{ children: ReactNode }>(group)) throw new Error('Expected protected group');
    const children = Children.toArray(group.props.children);
    expect(children).toHaveLength(10 + 1 + 1 + 1 + 1 + 1 + 3); // #194 R4 // #185 R10 // #146 R5, #105 R8 // #208 R4 // #214 R3
    const detail = children[10];
    expect(isValidElement<{ name: string; dangerouslySingular?: boolean }>(detail)
      ? [detail.type, detail.props.name, detail.props.dangerouslySingular]
      : null).toEqual([Stack.Screen, 'pets/[petId]/geofences', undefined]);
  });

  it('le da la cabecera nativa de #95 R4 con el título de zonas seguras (enmendado por E4 R21) (enmendado por #202 R2)', async () => {
    await render(<RootLayout />);
    await waitFor(() => expect(jest.mocked(Stack)).toHaveBeenCalled());
    const stack = jest.mocked(Stack).mock.calls.at(-1)?.[0];
    const group = Children.toArray(stack?.children)[4];
    if (!isValidElement<{ children: ReactNode }>(group)) throw new Error('Expected protected group');
    const detail = Children.toArray(group.props.children)[10];
    expect(isValidElement<{ options?: unknown }>(detail) ? detail.props.options : undefined).toEqual({ headerShown: false });
  });
});

describe('#146 R5: la guarda de RootStack declara el editor de zonas tras la lista', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetStoredTheme.mockResolvedValue(undefined);
    mockGetStoredLanguage.mockResolvedValue(undefined);
  });

  it('#194 R4: declara pets/[petId]/geofence-editor como duodécimo hijo y no singular (enmendado por #189 R1.1) (enmendado por #208 R4) (enmendado por #214 R3)', async () => {
    await render(<RootLayout />);
    await waitFor(() => expect(jest.mocked(Stack)).toHaveBeenCalled());
    const stack = jest.mocked(Stack).mock.calls.at(-1)?.[0];
    const group = Children.toArray(stack?.children)[4];
    if (!isValidElement<{ children: ReactNode }>(group)) throw new Error('Expected protected group');
    const children = Children.toArray(group.props.children);
    expect(children).toHaveLength(11 + 1 + 1 + 1 + 1 + 3); // #194 R4 // #185 R10 // #105 R8 // #208 R4 // #214 R3
    const detail = children[11];
    expect(isValidElement<{ name: string; dangerouslySingular?: boolean }>(detail)
      ? [detail.type, detail.props.name, detail.props.dangerouslySingular]
      : null).toEqual([Stack.Screen, 'pets/[petId]/geofence-editor', undefined]);
  });

  it('le da la cabecera nativa de #95 R4 con el título del editor de zonas (enmendado por #202 R2)', async () => {
    await render(<RootLayout />);
    await waitFor(() => expect(jest.mocked(Stack)).toHaveBeenCalled());
    const stack = jest.mocked(Stack).mock.calls.at(-1)?.[0];
    const group = Children.toArray(stack?.children)[4];
    if (!isValidElement<{ children: ReactNode }>(group)) throw new Error('Expected protected group');
    const detail = Children.toArray(group.props.children)[11];
    expect(isValidElement<{ options?: unknown }>(detail) ? detail.props.options : undefined).toEqual({ headerShown: false });
  });
});

describe('#105 R8: meals history is the last protected detail', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetStoredTheme.mockResolvedValue(undefined);
    mockGetStoredLanguage.mockResolvedValue(undefined);
  });

  it('declara meals-history como decimotercer hijo sin cabecera nativa (enmendado por #200 R13)', async () => {
    await render(<RootLayout />);
    await waitFor(() => expect(screen.getByTestId('root-stack')).toBeTruthy());
    const stack = jest.mocked(Stack).mock.calls.at(-1)?.[0];
    const group = Children.toArray(stack?.children)[4];
    if (!isValidElement<{ children: ReactNode }>(group)) throw new Error('Expected protected group');
    const detail = Children.toArray(group.props.children)[12];
    expect(isValidElement<{ name: string }>(detail)
      ? [detail.type, detail.props.name]
      : undefined).toEqual([Stack.Screen, 'meals-history']);
    expect(isValidElement<{ options?: unknown }>(detail)
      ? detail.props.options
      : undefined).toEqual({ headerShown: false });
  });
});

describe('#118 R3: RootStack declara welcome bajo su propia guarda', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetStoredTheme.mockResolvedValue(undefined);
    mockGetStoredLanguage.mockResolvedValue(undefined);
  });

  it('declara welcome como sexto hijo bajo Stack.Protected', async () => {
    await render(<RootLayout />);
    await waitFor(() => expect(screen.getByTestId('root-stack')).toBeVisible());
    const stack = jest.mocked(Stack).mock.calls.at(-1)?.[0];
    const group = Children.toArray(stack?.children)[5];
    expect(isValidElement<{ guard: boolean; children: ReactNode }>(group)).toBe(true);
    if (!isValidElement<{ guard: boolean; children: ReactNode }>(group)) return;
    expect(group.type).toBe(Stack.Protected);
    expect(group.props.guard).toBe(false);
    expect(Children.toArray(group.props.children).map((child) =>
      isValidElement<{ name: string }>(child) ? [child.type, child.props.name] : null,
    )).toEqual([[Stack.Screen, 'welcome']]);
  });
});


describe('#194 R4: the profile editor is protected', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetStoredTheme.mockResolvedValue(undefined);
    mockGetStoredLanguage.mockResolvedValue(undefined);
  });

  it('#194 R4: edit-profile es la última pantalla protegida', async () => {
    await render(<RootLayout />);
    await waitFor(() => expect(screen.getByTestId('root-stack')).toBeVisible());
    const stack = jest.mocked(Stack).mock.calls.at(-1)?.[0];
    const group = Children.toArray(stack?.children)[4];
    if (!isValidElement<{ guard: boolean; children: ReactNode }>(group)) throw new Error('Expected protected group');
    expect(group.type).toBe(Stack.Protected);
    expect(group.props.guard).toBe(true);
    const detail = Children.toArray(group.props.children).at(-1);
    expect(isValidElement<{ name: string }>(detail) ? [detail.type, detail.props.name] : undefined)
      .toEqual([Stack.Screen, 'edit-profile']);
  });
});


it('#202 R2: Zonas seguras y el editor de zonas ocultan la cabecera nativa', async () => {
  await render(<RootLayout />);
  await waitFor(() => expect(jest.mocked(Stack)).toHaveBeenCalled());
  const stack = jest.mocked(Stack).mock.calls.at(-1)?.[0];
  const group = Children.toArray(stack?.children)[4];
  expect(isValidElement(group)).toBe(true);
  if (!isValidElement<{ children: ReactNode }>(group)) return;
  for (const child of Children.toArray(group.props.children).slice(10, 12)) {
    expect(isValidElement(child)).toBe(true);
    if (isValidElement<{ options: unknown }>(child)) expect(child.props.options).toEqual({ headerShown: false });
  }
});


describe('#200 R12: cabecera nativa de Horario', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetStoredTheme.mockResolvedValue(undefined);
    mockGetStoredLanguage.mockResolvedValue(undefined);
  });
  it('#200 R12: meal-schedule oculta la cabecera nativa', async () => {
    await render(<RootLayout />);
    await screen.findByTestId('root-stack');
    const stack = jest.mocked(Stack).mock.calls.at(-1)?.[0];
    const group = Children.toArray(stack?.children)[4];
    if (!isValidElement<{ children: ReactNode }>(group)) throw new Error('Expected protected group');
    const detail = Children.toArray(group.props.children).find(child =>
      isValidElement<{ name: string }>(child) && child.props.name === 'meal-schedule');
    expect(isValidElement<{ options?: unknown }>(detail) ? detail.props.options : undefined)
      .toEqual({ headerShown: false });
  });
});


describe('#200 R13: cabecera nativa de Historial', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetStoredTheme.mockResolvedValue(undefined);
    mockGetStoredLanguage.mockResolvedValue(undefined);
  });
  it('#200 R13: meals-history oculta la cabecera nativa', async () => {
    await render(<RootLayout />);
    await screen.findByTestId('root-stack');
    const stack = jest.mocked(Stack).mock.calls.at(-1)?.[0];
    const group = Children.toArray(stack?.children)[4];
    if (!isValidElement<{ children: ReactNode }>(group)) throw new Error('Expected protected group');
    const detail = Children.toArray(group.props.children).find(child =>
      isValidElement<{ name: string }>(child) && child.props.name === 'meals-history');
    expect(isValidElement<{ options?: unknown }>(detail) ? detail.props.options : undefined)
      .toEqual({ headerShown: false });
  });
});

describe('#199 R1: Peso apaga la cabecera nativa', () => {
  it('#199 R1 weight-log declara solo headerShown false', async () => {
    mockGetStoredTheme.mockResolvedValue(undefined);
    mockGetStoredLanguage.mockResolvedValue(undefined);
    await render(<RootLayout />);
    await waitFor(() => expect(screen.getByTestId('root-stack')).toBeVisible());
    const stack = jest.mocked(Stack).mock.calls.at(-1)?.[0];
    const group = Children.toArray(stack?.children)[4];
    expect(isValidElement(group)).toBe(true);
    const children = isValidElement<{ children: ReactNode }>(group) ? Children.toArray(group.props.children) : [];
    const detail = children.find(child => isValidElement<{ name: string }>(child) && child.props.name === 'weight-log');
    expect(isValidElement<{ options?: unknown }>(detail) ? detail.props.options : undefined).toEqual({ headerShown: false });
  });
});

describe('#203 R1: cabeceras nativas fuera', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetStoredTheme.mockResolvedValue(undefined);
    mockGetStoredLanguage.mockResolvedValue(undefined);
  });

  it.each([
    ['pairing', { headerShown: false }],
    ['alerts', { headerShown: false }],
    [
      'alerts/[alertId]',
      { headerShown: false, contentStyle: { backgroundColor: 'token:background' } },
    ],
  ])('#203 R1: %s oculta la cabecera nativa', async (name, options) => {
    await render(<RootLayout />);
    await waitFor(() => expect(screen.getByTestId('root-stack')).toBeVisible());
    const stack = jest.mocked(Stack).mock.calls.at(-1)?.[0];
    const group = Children.toArray(stack?.children)[4];
    if (!isValidElement<{ children: ReactNode }>(group)) throw new Error('Expected protected group');
    const detail = Children.toArray(group.props.children).find((child) =>
      isValidElement<{ name: string }>(child) && child.props.name === name,
    );
    expect(isValidElement<{ options?: unknown }>(detail) ? detail.props.options : undefined).toEqual(options);
  });
});

describe('#204 R1: Rutina sin cabecera nativa', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetStoredTheme.mockResolvedValue(undefined);
    mockGetStoredLanguage.mockResolvedValue(undefined);
  });

  it.each([
    ['reminders'],
    ['add-reminder'],
    ['pets/[petId]/docs'],
  ])('#204 R1: %s oculta la cabecera nativa', async (name) => {
    await render(<RootLayout />);
    await screen.findByTestId('root-stack');
    const stack = jest.mocked(Stack).mock.calls.at(-1)?.[0];
    const group = Children.toArray(stack?.children)[4];
    if (!isValidElement<{ children: ReactNode }>(group)) throw new Error('Expected protected group');
    const detail = Children.toArray(group.props.children).find(child =>
      isValidElement<{ name: string }>(child) && child.props.name === name);
    expect(isValidElement<{ options?: unknown }>(detail) ? detail.props.options : undefined)
      .toEqual({ headerShown: false });
  });
});

describe('#205 R15: nueva mascota sin cabecera nativa', () => {
  it('#205 R15: pets/add declara solo headerShown false', async () => {
    mockGetStoredTheme.mockResolvedValue(undefined);
    mockGetStoredLanguage.mockResolvedValue(undefined);
    await render(<RootLayout />);
    await waitFor(() => expect(screen.getByTestId('root-stack')).toBeVisible());
    const stack = jest.mocked(Stack).mock.calls.at(-1)?.[0];
    const group = Children.toArray(stack?.children)[4];
    expect(isValidElement(group)).toBe(true);
    const children = isValidElement<{ children: ReactNode }>(group) ? Children.toArray(group.props.children) : [];
    const detail = children.find(child => isValidElement<{ name: string }>(child) && child.props.name === 'pets/add');
    expect(isValidElement<{ options?: unknown }>(detail) ? detail.props.options : undefined).toEqual({ headerShown: false });
  });
});

describe('#208 R4: alta de vacuna protegida', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetStoredTheme.mockResolvedValue(undefined);
    mockGetStoredLanguage.mockResolvedValue(undefined);
  });
  it('#208 R4: la pantalla de alta de vacuna va justo tras meals-history y no pinta cabecera nativa', async () => {
    await render(<RootLayout />);
    await screen.findByTestId('root-stack');
    const stack = jest.mocked(Stack).mock.calls.at(-1)?.[0];
    const group = Children.toArray(stack?.children)[4];
    if (!isValidElement<{ children: ReactNode }>(group)) throw new Error('Expected protected group');
    const children = Children.toArray(group.props.children);
    const names = children.map(child => isValidElement<{ name: string }>(child) ? child.props.name : undefined);
    expect(names.indexOf('pets/[petId]/vaccines/new')).toBe(names.indexOf('meals-history') + 1);
    const detail = children[names.indexOf('pets/[petId]/vaccines/new')];
    expect(isValidElement<{ options: unknown }>(detail) ? detail.props.options : undefined).toEqual({ headerShown: false });
  });
});


describe('#214 R3: rutas de Familia', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetStoredTheme.mockResolvedValue(undefined);
    mockGetStoredLanguage.mockResolvedValue(undefined);
  });

  it('R3: registra members, invite y join-pet justo antes de edit-profile sin cabecera nativa', async () => {
    await render(<RootLayout />);
    await waitFor(() => expect(screen.getByTestId('root-stack')).toBeVisible());
    const stack = jest.mocked(Stack).mock.calls.at(-1)?.[0];
    const group = Children.toArray(stack?.children)[4];
    if (!isValidElement<{ children: ReactNode }>(group)) throw new Error('Expected protected group');
    const children = Children.toArray(group.props.children);
    const names = children.map((child) => isValidElement<{ name: string }>(child) ? child.props.name : null);
    const editor = names.indexOf('edit-profile');
    expect(names.slice(editor - 3, editor)).toEqual(['pets/[petId]/members', 'pets/[petId]/invite', 'join-pet']);
    for (const name of ['pets/[petId]/members', 'pets/[petId]/invite', 'join-pet']) {
      const child = children[names.indexOf(name)];
      expect(isValidElement<{ options: unknown }>(child) ? child.props.options : null).toEqual({ headerShown: false });
    }
  });
});
