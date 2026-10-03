import { readdirSync } from 'fs';
import { join } from 'path';

import { router, type Href } from 'expo-router';
import { act, renderRouter, waitFor } from 'expo-router/testing-library';
import { useState } from 'react';
import { Text } from 'react-native';

import AuthLayout from '../(auth)/_layout';
import TabsLayout from '../(tabs)/_layout';
import RootLayout from '../_layout';

let mockAuthState: { status: 'authenticated' | 'unauthenticated'; token: string | null } = { status: 'authenticated', token: 'token-a' };
const mockAuthListeners = new Set<() => void>();
let mockRemindersMounts = 0;
let mockAlertsMounts = 0;

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
        else if (key.endsWith('reminders') || key.endsWith('alerts')) {
          result[key] = function ListStub() {
            useState(() => {
              if (key.endsWith('reminders')) mockRemindersMounts += 1;
              else mockAlertsMounts += 1;
              return 0;
            });
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


describe('#114 R2: reminders y alerts se apilan y desapilan sobre (tabs)', () => {
  afterEach(() => jest.useRealTimers());

  it('mantiene una sola tabs, remonta listas al reentrar y protege ambas sin sesión', async () => {
    mockAuthState = { status: 'authenticated', token: 'token-a' };
    mockRemindersMounts = 0;
    mockAlertsMounts = 0;
    const app = renderRouter(routes(), { initialUrl: '/home' });
    await waitFor(() => expect(app.getPathname()).toBe('/home'));
    expect(rootStack(app)).toEqual(['(tabs)']);

    for (const [href, name] of [
      ['/reminders', 'reminders'],
      ['/alerts', 'alerts'],
    ]) {
      await act(async () => router.push(href as Href));
      await waitFor(() => expect(app.getPathname()).toBe(href));
      expect(rootStack(app)).toEqual(['(tabs)', name]);
      await act(async () => router.back());
      await waitFor(() => expect(app.getPathname()).toBe('/home'));
      expect(rootStack(app)).toEqual(['(tabs)']);
    }
    expect(mockRemindersMounts).toBe(1);
    expect(mockAlertsMounts).toBe(1);

    await act(async () => router.push('/reminders'));
    await waitFor(() => expect(app.getPathname()).toBe('/reminders'));
    expect(mockRemindersMounts).toBe(2);
    await act(async () => router.push('/add-reminder'));
    await waitFor(() => expect(app.getPathname()).toBe('/add-reminder'));
    expect(rootStack(app)).toEqual(['(tabs)', 'reminders', 'add-reminder']);
    await act(async () => router.back());
    await waitFor(() => expect(app.getPathname()).toBe('/reminders'));
    expect(rootStack(app)).toEqual(['(tabs)', 'reminders']);
    expect(mockRemindersMounts).toBe(2);

    await act(async () => router.push('/add-reminder'));
    await waitFor(() => expect(app.getPathname()).toBe('/add-reminder'));
    await act(async () => router.dismissTo('/reminders'));
    await waitFor(() => expect(app.getPathname()).toBe('/reminders'));
    expect(rootStack(app)).toEqual(['(tabs)', 'reminders']);
    expect(mockRemindersMounts).toBe(2);
    await act(async () => router.back());
    await waitFor(() => expect(app.getPathname()).toBe('/home'));

    await act(async () => router.push('/add-reminder'));
    await waitFor(() => expect(app.getPathname()).toBe('/add-reminder'));
    await act(async () => router.dismissTo('/reminders'));
    await waitFor(() => expect(app.getPathname()).toBe('/reminders'));
    expect(rootStack(app)).toEqual(['(tabs)', 'reminders']);
    await act(async () => router.push('/alerts'));
    await waitFor(() => expect(app.getPathname()).toBe('/alerts'));
    expect(rootStack(app)).toEqual(['(tabs)', 'reminders', 'alerts']);

    await act(async () => {
      mockAuthState = { status: 'unauthenticated', token: null };
      mockAuthListeners.forEach((listener) => listener());
    });
    await waitFor(() => expect(app.getPathname()).toBe('/login'));
    expect(rootStack(app)).toEqual(['(auth)']);
    for (const href of ['/reminders', '/alerts']) {
      await act(async () => {
        router.push(href as Href);
        for (let i = 0; i < 3; i += 1) jest.runOnlyPendingTimers();
      });
      expect(app.getPathname()).toBe('/login');
      expect(rootStack(app)).toEqual(['(auth)']);
    }
  });
});
