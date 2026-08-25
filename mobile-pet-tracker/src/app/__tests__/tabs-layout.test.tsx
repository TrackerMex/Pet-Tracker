import { render } from '@testing-library/react-native';
import { type ReactNode } from 'react';

import TabsLayout from '../(tabs)/_layout';

const mockTabsProps = jest.fn();

jest.mock('expo-router', () => {
  const React = jest.requireActual<typeof import('react')>('react');
  const Tabs = Object.assign(
    ({ children, ...props }: { children: ReactNode }) => {
      mockTabsProps(props);
      return React.createElement(React.Fragment, null, children);
    },
    { Screen: () => null },
  );

  return {
    Tabs,
    Redirect: () => null,
  };
});

jest.mock('../../providers/auth-provider', () => ({
  useAuth: () => ({ status: 'authenticated' }),
}));

jest.mock('../../providers/selected-pet-provider', () => ({
  SelectedPetProvider: ({ children }: { children: ReactNode }) => children,
}));

describe('R6: Tabs declara animation fade en screenOptions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('activa el crossfade sin sobrescribir la transitionSpec', async () => {
    await render(<TabsLayout />);

    expect(mockTabsProps).toHaveBeenCalledTimes(1);
    expect(mockTabsProps.mock.calls[0]?.[0].screenOptions).toEqual({
      headerShown: false,
      animation: 'fade',
    });
    expect(
      mockTabsProps.mock.calls[0]?.[0].screenOptions.transitionSpec,
    ).toBeUndefined();
  });
});
