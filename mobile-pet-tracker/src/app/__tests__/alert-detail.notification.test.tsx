import { readdirSync } from 'fs';
import { join } from 'path';

import { router } from 'expo-router';
import * as Notifications from 'expo-notifications';
import { act, renderRouter, waitFor } from 'expo-router/testing-library';
import { useState } from 'react';
import { Text } from 'react-native';

import { registerPushToken } from '../../api/push-tokens';
import AuthLayout from '../(auth)/_layout';
import TabsLayout from '../(tabs)/_layout';
import RootLayout from '../_layout';
import IndexRoute from '../index';

const mockSetPushToken = jest.fn();
let mockAuthState = { status: 'loading', token: null as string | null, setPushToken: mockSetPushToken };
const mockAuthListeners = new Set<() => void>();
let mockDetailMounts = 0;

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
jest.mock('expo-notifications', () => ({
  AndroidImportance: { MAX: 7 },
  setNotificationHandler: jest.fn(),
  setNotificationChannelAsync: jest.fn(),
  getPermissionsAsync: jest.fn(),
  requestPermissionsAsync: jest.fn(),
  getExpoPushTokenAsync: jest.fn(),
  addNotificationResponseReceivedListener: jest.fn(),
  getLastNotificationResponseAsync: jest.fn(),
}));
jest.mock('expo-device', () => ({ isDevice: true }));
jest.mock('expo-constants', () => ({
  __esModule: true,
  default: { expoConfig: { extra: { eas: { projectId: 'project-id' } } } },
}));
jest.mock('../../api/push-tokens', () => ({ registerPushToken: jest.fn() }));
jest.mock('../../components/floating-tab-bar', () => ({ FloatingTabBar: () => null }));
jest.mock('../../providers/auth-provider', () => {
  const React = jest.requireActual<typeof import('react')>('react');
  return {
    AuthProvider: ({ children }: { children: React.ReactNode }) => children,
    useAuth: () => React.useSyncExternalStore(
      (listener: () => void) => {
        mockAuthListeners.add(listener);
        return () => mockAuthListeners.delete(listener);
      },
      () => mockAuthState,
    ),
  };
});

function routes() {
  const result: Record<string, React.ComponentType> = {};
  const walk = (directory: string, prefix = '') => {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      if (entry.name === '__tests__') continue;
      const name = prefix ? `${prefix}/${entry.name}` : entry.name;
      if (entry.isDirectory()) {
        walk(join(directory, entry.name), name);
      } else if (entry.name.endsWith('.tsx')) {
        const key = name.replace(/\.tsx$/, '');
        if (key === '_layout') result[key] = RootLayout;
        else if (key === 'index') result[key] = IndexRoute;
        else if (key === '(tabs)/_layout') result[key] = TabsLayout;
        else if (key === '(auth)/_layout') result[key] = AuthLayout;
        else if (key.endsWith('/_layout')) throw new Error(`Unexpected layout: ${key}`);
        else if (key.endsWith('alerts/[alertId]')) {
          result[key] = function DetailStub() {
            useState(() => { mockDetailMounts += 1; return 0; });
            return <Text>{key}</Text>;
          };
        } else result[key] = () => <Text>{key}</Text>;
      }
    }
  };
  walk(join(process.cwd(), 'src/app'));
  return result;
}

function rootStack(app: ReturnType<typeof renderRouter>) {
  return app.getRouterState()?.routes[0]?.state?.routes.map((route) => route.name) ?? [];
}

const mockGetLastResponse = jest.mocked(Notifications.getLastNotificationResponseAsync);
const mockAddResponseListener = jest.mocked(Notifications.addNotificationResponseReceivedListener);

describe('#100 R7: el toque apila el detalle de su alerta una sola vez', () => {
  afterEach(() => jest.useRealTimers());

  it('abre el detalle en frío y en caliente, sin duplicarlo, y cae al centro sin id', async () => {
    jest.clearAllMocks();
    mockAuthState = { status: 'loading', token: null, setPushToken: mockSetPushToken };
    mockDetailMounts = 0;
    jest.mocked(Notifications.getPermissionsAsync).mockResolvedValue({ granted: true, canAskAgain: true } as Notifications.NotificationPermissionsStatus);
    jest.mocked(Notifications.getExpoPushTokenAsync).mockResolvedValue({ type: 'expo', data: 'ExpoPushToken[xxx]' });
    jest.mocked(Notifications.setNotificationChannelAsync).mockResolvedValue(null);
    jest.mocked(registerPushToken).mockResolvedValue({ kind: 'ok' });
    mockAddResponseListener.mockReturnValue({ remove: jest.fn() });
    let resolveLastResponse!: (response: Notifications.NotificationResponse) => void;
    mockGetLastResponse.mockReturnValue(new Promise((resolve) => { resolveLastResponse = resolve; }));
    const response = (data: Record<string, unknown>) => ({
      notification: { request: { content: { data } } },
    }) as unknown as Notifications.NotificationResponse;

    const app = renderRouter(routes(), { initialUrl: '/' });
    await act(async () => {
      mockAuthState = { status: 'authenticated', token: 'token-a', setPushToken: mockSetPushToken };
      mockAuthListeners.forEach((listener) => listener());
    });
    await waitFor(() => expect(mockGetLastResponse).toHaveBeenCalledTimes(1));
    await act(async () => resolveLastResponse(response({ alertId: 'alert-1' })));
    await act(async () => { jest.runOnlyPendingTimers(); });
    await waitFor(() => expect(app.getPathname()).toBe('/alerts/alert-1'));
    expect(rootStack(app)).toEqual(['(tabs)', 'alerts/[alertId]']);

    await act(async () => router.back());
    await waitFor(() => expect(app.getPathname()).toBe('/home'));
    expect(router.canGoBack()).toBe(false);

    await act(async () => router.push('/add-reminder'));
    await waitFor(() => expect(app.getPathname()).toBe('/add-reminder'));
    const tap = mockAddResponseListener.mock.calls.at(-1)?.[0];
    if (!tap) throw new Error('Expected notification listener');
    await act(async () => tap(response({ alertId: 'alert-2' })));
    await act(async () => { jest.runOnlyPendingTimers(); });
    await waitFor(() => expect(app.getPathname()).toBe('/alerts/alert-2'));
    expect(rootStack(app)).toEqual(['(tabs)', 'add-reminder', 'alerts/[alertId]']);
    const mounts = mockDetailMounts;

    await act(async () => tap(response({ alertId: 'alert-2' })));
    await act(async () => { jest.runOnlyPendingTimers(); });
    expect(rootStack(app)).toEqual(['(tabs)', 'add-reminder', 'alerts/[alertId]']);
    expect(mockDetailMounts).toBe(mounts);

    await act(async () => tap(response({ alertId: 'alert-3' })));
    await act(async () => { jest.runOnlyPendingTimers(); });
    await waitFor(() => expect(app.getPathname()).toBe('/alerts/alert-3'));
    expect(mockDetailMounts).toBe(mounts + 1);

    await act(async () => tap(response({})));
    await act(async () => { jest.runOnlyPendingTimers(); });
    await waitFor(() => expect(app.getPathname()).toBe('/alerts'));
  });
});
