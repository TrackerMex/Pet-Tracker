import { readdirSync } from 'fs';
import { join } from 'path';

import { router, type Href } from 'expo-router';
import { act, renderRouter, waitFor } from 'expo-router/testing-library';
import { useState } from 'react';
import { Text } from 'react-native';

import AuthLayout from '../(auth)/_layout';
import TabsLayout from '../(tabs)/_layout';
import RootLayout from '../_layout';

let mockAuthState: { status: 'authenticated' | 'unauthenticated'; token: string | null } = {
  status: 'authenticated', token: 'token-a',
};
const mockAuthListeners = new Set<() => void>();
let mockAddReminderMounts = 0;

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
        else if (key === '(tabs)/_layout') result[key] = TabsLayout;
        else if (key === '(auth)/_layout') result[key] = AuthLayout;
        else if (key.endsWith('/_layout')) throw new Error(`Unexpected layout: ${key}`);
        else if (key.endsWith('add-reminder')) {
          result[key] = function AddReminderStub() {
            useState(() => { mockAddReminderMounts += 1; return 0; });
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

describe('#95 R3: la guarda protege las seis y deja libres (auth) y reset-password', () => {
  afterEach(() => jest.useRealTimers());

  it('expulsa el detalle al cerrar sesión y no agrega rutas protegidas al historial', async () => {
    mockAuthState = { status: 'authenticated', token: 'token-a' };
    const app = renderRouter(routes(), { initialUrl: '/home' });
    await waitFor(() => expect(app.getPathname()).toBe('/home'));
    await act(async () => router.push('/pairing'));
    await waitFor(() => expect(app.getPathname()).toBe('/pairing'));
    mockAuthState = { status: 'unauthenticated', token: null };
    await act(async () => {
      for (const listener of mockAuthListeners) listener();
    });
    await waitFor(() => expect(app.getPathname()).toBe('/login'));
    expect(rootStack(app)).toEqual(['(auth)']);

    for (const href of [
      '/add-reminder',
      '/pets/add',
      '/pets/pet-1/docs',
      '/weight-log',
      '/meal-schedule',
      '/pairing',
    ]) {
      await act(async () => router.push(href as Href));
      await act(async () => {
        for (let pass = 0; pass < 3; pass += 1) jest.runOnlyPendingTimers();
      });
      expect(app.getPathname()).toBe('/login');
      expect(rootStack(app)).toEqual(['(auth)']);
    }
    expect(mockAddReminderMounts).toBe(0);

    await act(async () => router.push('/reset-password?token=abc'));
    await waitFor(() => expect(app.getPathname()).toBe('/reset-password'));
    expect(rootStack(app)).toEqual(['(auth)', 'reset-password']);
  });
});
