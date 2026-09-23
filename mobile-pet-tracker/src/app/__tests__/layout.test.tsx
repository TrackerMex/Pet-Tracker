import {
  cleanup,
  render,
  screen,
  waitFor,
} from '@testing-library/react-native';
import type { QueryClient } from '@tanstack/react-query';
import * as Notifications from 'expo-notifications';
import { Stack } from 'expo-router';
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
    expect(children).toHaveLength(5);
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
    expect(Children.toArray(protectedGroup.props.children).map((child) =>
      isValidElement<{ name: string }>(child) ? [child.type, child.props.name] : null,
    )).toEqual([
      [Stack.Screen, 'add-reminder'],
      [Stack.Screen, 'pets/add'],
      [Stack.Screen, 'pets/[petId]/docs'],
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
    ['add-reminder', 't:addReminder.addReminder'],
    ['pets/add', 't:addPet.addPet'],
    ['pets/[petId]/docs', ''],
    ['weight-log', 't:weightLog.weightLog'],
    ['meal-schedule', 't:mealSchedule.mealSchedule'],
    ['pairing', ''],
  ])('%s usa exactamente las opciones de cabecera acordadas', async (name, title) => {
    await render(<RootLayout />);
    await waitFor(() => expect(jest.mocked(Stack)).toHaveBeenCalled());
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

  it('declara ocho rutas protegidas y alerts singular', async () => {
    await render(<RootLayout />);
    await waitFor(() => expect(jest.mocked(Stack)).toHaveBeenCalled());
    const stack = jest.mocked(Stack).mock.calls.at(-1)?.[0];
    const group = Children.toArray(stack?.children)[4];
    if (!isValidElement<{ children: ReactNode }>(group)) throw new Error('Expected protected group');
    const children = Children.toArray(group.props.children);
    expect(children).toHaveLength(8);
    expect(children.slice(6).map((child) =>
      isValidElement<{ name: string; dangerouslySingular?: boolean }>(child)
        ? [child.type, child.props.name, child.props.dangerouslySingular]
        : null,
    )).toEqual([
      [Stack.Screen, 'reminders', undefined],
      [Stack.Screen, 'alerts', true],
    ]);
  });
});
