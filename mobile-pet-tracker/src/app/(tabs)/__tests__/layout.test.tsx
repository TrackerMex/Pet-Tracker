import { render } from '@testing-library/react-native';
import { Redirect, Tabs } from 'expo-router';
import { isValidElement, type ReactNode } from 'react';

import { FloatingTabBar } from '../../../components/floating-tab-bar';
import { useAuth, type AuthContextValue } from '../../../providers/auth-provider';
import { SelectedPetProvider } from '../../../providers/selected-pet-provider';
import TabsLayout from '../_layout';
import AddPetRoute from '../pets/add';
import DocsRoute from '../pets/[petId]/docs';

jest.mock(
  '../../../components/floating-tab-bar',
  () => ({ FloatingTabBar: jest.fn(() => null) }),
);

jest.mock('../../../providers/auth-provider', () => ({
  useAuth: jest.fn(),
}));

jest.mock('../../../providers/selected-pet-provider', () => ({
  SelectedPetProvider: jest.fn(({ children }: { children: ReactNode }) => children),
}));

jest.mock('expo-router', () => ({
  Redirect: jest.fn(() => null),
  Tabs: Object.assign(
    jest.fn(({ children }: { children: ReactNode }) => children),
    { Screen: jest.fn(() => null) },
  ),
}));

const mockUseAuth = jest.mocked(useAuth);
const mockRedirect = jest.mocked(Redirect);
const mockTabs = jest.mocked(Tabs);
const mockTabsScreen = jest.mocked(Tabs.Screen);
const mockSelectedPetProvider = jest.mocked(SelectedPetProvider);

function authValue(status: AuthContextValue['status']): AuthContextValue {
  return {
    status,
    token: status === 'authenticated' ? 'jwt-token' : null,
    signIn: jest.fn(),
    signOut: jest.fn(),
  };
}

describe('R1: (tabs) exige sesión', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders nothing while the session is loading', async () => {
    mockUseAuth.mockReturnValue(authValue('loading'));

    const view = await render(<TabsLayout />);

    expect(view.toJSON()).toBeNull();
    expect(mockRedirect).not.toHaveBeenCalled();
    expect(mockTabs).not.toHaveBeenCalled();
  });

  it('redirects an unauthenticated session to login', async () => {
    mockUseAuth.mockReturnValue(authValue('unauthenticated'));

    await render(<TabsLayout />);

    expect(mockRedirect.mock.calls[0]?.[0]).toEqual({ href: '/login' });
    expect(mockTabs).not.toHaveBeenCalled();
  });

  it('renders the five tabs in order with the floating tab bar', async () => {
    mockUseAuth.mockReturnValue(authValue('authenticated'));

    await render(<TabsLayout />);

    expect(mockTabs).toHaveBeenCalledTimes(1);
    expect(mockTabs.mock.calls[0]?.[0].screenOptions).toEqual({
      headerShown: false,
      animation: 'fade',
    });
    expect(mockTabsScreen.mock.calls.map(([props]) => props.name)).toEqual([
      'home',
      'map',
      'health',
      'food',
      'profile',
    ]);

    const tabBar = mockTabs.mock.calls[0]?.[0].tabBar;
    expect(tabBar).toEqual(expect.any(Function));

    const state = { index: 0, routes: [] };
    const navigation = {};
    const element = tabBar?.({ state, navigation } as never);

    if (!isValidElement<{ state: typeof state; navigation: typeof navigation }>(element)) {
      throw new Error('Expected tabBar to return a React element');
    }

    expect(element?.type).toBe(FloatingTabBar);
    expect(element?.props).toEqual({ state, navigation });
  });

  it('wraps authenticated tabs in the shared selected pet provider', async () => {
    mockUseAuth.mockReturnValue(authValue('authenticated'));

    await render(<TabsLayout />);

    expect(mockSelectedPetProvider).toHaveBeenCalledTimes(1);
    expect(mockTabs).toHaveBeenCalledTimes(1);
  });
});

describe('R10: las rutas de mascotas heredan SelectedPetProvider', () => {
  it('mantiene AddPet y Docs dentro del grupo (tabs)', () => {
    expect(AddPetRoute).toEqual(expect.any(Function));
    expect(DocsRoute).toEqual(expect.any(Function));
  });
});
