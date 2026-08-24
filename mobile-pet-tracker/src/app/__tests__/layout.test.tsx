import { render, screen, waitFor } from '@testing-library/react-native';
import { Uniwind } from 'uniwind';

import { getStoredTheme } from '../../utils/theme-preference';
import RootLayout from '../_layout';

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
  HeroUINativeProvider: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock('react-native-gesture-handler', () => ({
  GestureHandlerRootView: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock('../../providers/auth-provider', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => children,
}));

const mockGetStoredTheme = jest.mocked(getStoredTheme);
const mockSetTheme = jest.mocked(Uniwind.setTheme);

describe('R4: RootLayout restaura el tema', () => {
  beforeEach(() => {
    jest.clearAllMocks();
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
