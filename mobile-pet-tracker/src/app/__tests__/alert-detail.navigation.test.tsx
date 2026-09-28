import { readdirSync } from 'fs';
import { join } from 'path';

import { router } from 'expo-router';
import { act, renderRouter, waitFor } from 'expo-router/testing-library';
import { fireEvent, screen } from '@testing-library/react-native';
import { Text } from 'react-native';

import { ackAlert, listAlerts } from '../../api/alerts';
import type { Alert } from '../../api/types';
import AuthLayout from '../(auth)/_layout';
import TabsLayout from '../(tabs)/_layout';
import RootLayout from '../_layout';
import AlertDetailRoute from '../alerts/[alertId]';
import AlertsRoute from '../alerts';
import IndexRoute from '../index';

const mockSignOut = jest.fn();

jest.mock('standard-navigation', () => ({}));
jest.mock('expo-font', () => ({ useFonts: () => [true] }));
jest.mock('../../utils/theme-preference', () => ({
  getStoredTheme: jest.fn().mockResolvedValue(undefined),
}));
jest.mock('../../utils/language-preference', () => ({
  getStoredLanguage: jest.fn().mockResolvedValue(undefined),
  setStoredLanguage: jest.fn(),
}));
jest.mock('heroui-native', () => {
  const React = jest.requireActual<typeof import('react')>('react');
  const { Pressable, Text, View } = jest.requireActual<typeof import('react-native')>('react-native');
  const Button = Object.assign(
    ({ children, isDisabled, ...props }: { children: React.ReactNode; isDisabled?: boolean; testID?: string; className?: string; accessibilityRole?: 'button'; onPress?: () => void }) =>
      React.createElement(Pressable, { ...props, disabled: isDisabled }, children),
    { Label: ({ children }: { children: React.ReactNode }) => React.createElement(Text, null, children) },
  );
  return {
    HeroUINativeProvider: ({ children }: { children: React.ReactNode }) => children,
    Button,
    Skeleton: (props: Record<string, unknown>) => React.createElement(View, props),
  };
});
jest.mock('react-native-gesture-handler', () => ({
  GestureHandlerRootView: ({ children }: { children: React.ReactNode }) => children,
}));
jest.mock('../../hooks/use-push-registration', () => ({ usePushRegistration: jest.fn() }));
jest.mock('../../components/floating-tab-bar', () => ({ FloatingTabBar: () => null }));
jest.mock('../../api/alerts', () => ({ ackAlert: jest.fn(), listAlerts: jest.fn() }));
jest.mock('../../providers/auth-provider', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => children,
  useAuth: () => ({ status: 'authenticated', token: 'token-a', signOut: mockSignOut }),
}));
jest.mock('react-native-safe-area-context', () => ({
  ...jest.requireActual('react-native-safe-area-context'),
  useSafeAreaInsets: () => ({ top: 40, right: 0, bottom: 24, left: 0 }),
}));
jest.mock('reicon-react-native', () => {
  const React = jest.requireActual<typeof import('react')>('react');
  const { View } = jest.requireActual<typeof import('react-native')>('react-native');
  const icon = () => (props: Record<string, unknown>) => React.createElement(View, props);
  return { BatteryLow: icon(), Bell: icon(), LocationSlash: icon() };
});
jest.mock('../../theme/use-theme-colors', () => ({
  useThemeColors: (tokens: readonly string[]) => tokens.map((token) => `--color-${token}`),
}));

function makeAlert(id: string, status = 'open'): Alert {
  return {
    id, petId: 'pet-1', petName: 'Luna', type: 'geofence_exit', status,
    geofenceId: null, openedAt: '2026-09-11T10:00:00.000Z',
    ackedAt: null, closedAt: null, payload: {},
  };
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
        else if (key === 'index') result[key] = IndexRoute;
        else if (key === '(tabs)/_layout') result[key] = TabsLayout;
        else if (key === '(auth)/_layout') result[key] = AuthLayout;
        else if (key === 'alerts') result[key] = AlertsRoute;
        else if (key === 'alerts/[alertId]') result[key] = AlertDetailRoute;
        else if (key.endsWith('/_layout')) throw new Error(`Unexpected layout: ${key}`);
        else result[key] = () => <Text>{key}</Text>;
      }
    }
  };
  walk(join(process.cwd(), 'src/app'));
  return result;
}

function rootStack(app: ReturnType<typeof renderRouter>) {
  return app.getRouterState()?.routes[0]?.state?.routes.map((route) => route.name) ?? [];
}

describe('#100 R8: fila, detalle y vuelta al centro con la alerta leída', () => {
  afterEach(() => jest.useRealTimers());

  it('abre la fila de la segunda página, la marca leída y la ve leída al volver', async () => {
    jest.clearAllMocks();
    process.env.EXPO_PUBLIC_API_URL = 'http://example.test/v1';
    let serverAcked = false;
    jest.mocked(listAlerts).mockImplementation(async (_baseUrl, _token, _status, cursor) =>
      cursor === 'c1'
        ? { kind: 'ok', items: [makeAlert('alert-2', serverAcked ? 'acked' : 'open')], nextCursor: null }
        : { kind: 'ok', items: [makeAlert('alert-1')], nextCursor: 'c1' },
    );
    jest.mocked(ackAlert).mockImplementation(async () => {
      serverAcked = true;
      return { kind: 'ok', alert: makeAlert('alert-2', 'acked') };
    });

    const app = renderRouter(routes(), { initialUrl: '/home' });
    await waitFor(() => expect(app.getPathname()).toBe('/home'));
    await act(async () => router.push('/alerts'));
    await waitFor(() => expect(app.getPathname()).toBe('/alerts'));
    await waitFor(() => expect(screen.getByTestId('alerts-list').props.data).toHaveLength(1));
    await fireEvent(screen.getByTestId('alerts-list'), 'onEndReached');
    await waitFor(() => expect(screen.getByTestId('alerts-list').props.data).toHaveLength(2));
    await fireEvent.press(screen.getByTestId('alert-row-alert-2-link'));
    await waitFor(() => expect(app.getPathname()).toBe('/alerts/alert-2'));
    await fireEvent.press(await screen.findByTestId('alert-detail-ack'));
    await waitFor(() => expect(screen.getByTestId('alert-detail-status')).toHaveTextContent('Leída'));

    await act(async () => router.back());
    await waitFor(() => expect(app.getPathname()).toBe('/alerts'));
    await waitFor(() => {
      expect(screen.getByTestId('alert-row-alert-2-status')).toHaveTextContent('Leída');
      expect(screen.queryByTestId('alert-row-alert-2-ack')).toBeNull();
    });

    await act(async () => router.push({ pathname: '/alerts/[alertId]', params: { alertId: 'alert-404' } }));
    await waitFor(() => expect(app.getPathname()).toBe('/alerts'));
    expect(rootStack(app)).toEqual(['(tabs)', 'alerts']);
  });
});
