import { render, screen, waitFor } from '@testing-library/react-native';
import type { ReactNode } from 'react';
import { Uniwind } from 'uniwind';

import { getStoredLanguage } from '../../utils/language-preference';
import { getStoredTheme } from '../../utils/theme-preference';
import RootLayout from '../_layout';

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

jest.mock('expo-router', () => {
  const React = jest.requireActual<typeof import('react')>('react');
  const { View } = jest.requireActual<typeof import('react-native')>(
    'react-native',
  );

  return { Stack: () => React.createElement(View, { testID: 'root-stack' }) };
});

jest.mock('heroui-native', () => ({
  HeroUINativeProvider: ({ children }: { children: ReactNode }) => children,
}));

jest.mock('react-native-gesture-handler', () => ({
  GestureHandlerRootView: ({ children }: { children: ReactNode }) => children,
}));

jest.mock('../../providers/auth-provider', () => ({
  AuthProvider: ({ children }: { children: ReactNode }) => children,
}));

jest.mock('../../providers/language-provider', () => {
  const React = jest.requireActual<typeof import('react')>('react');
  const { View } = jest.requireActual<typeof import('react-native')>(
    'react-native',
  );

  return {
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

const mockGetStoredLanguage = jest.mocked(getStoredLanguage);
const mockGetStoredTheme = jest.mocked(getStoredTheme);
const mockSetTheme = jest.mocked(Uniwind.setTheme);

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
