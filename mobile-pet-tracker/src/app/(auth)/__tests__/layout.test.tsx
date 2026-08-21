import { render } from '@testing-library/react-native';
import { Redirect, Stack } from 'expo-router';

import { useAuth, type AuthContextValue } from '../../../providers/auth-provider';
import AuthLayout from '../_layout';

jest.mock('../../../providers/auth-provider', () => ({
  useAuth: jest.fn(),
}));

jest.mock('expo-router', () => ({
  Redirect: jest.fn(() => null),
  Stack: jest.fn(() => null),
}));

const mockUseAuth = jest.mocked(useAuth);
const mockRedirect = jest.mocked(Redirect);
const mockStack = jest.mocked(Stack);

function authValue(status: AuthContextValue['status']): AuthContextValue {
  return {
    status,
    token: status === 'authenticated' ? 'jwt-token' : null,
    signIn: jest.fn(),
    signOut: jest.fn(),
  };
}

describe('R2: (auth) expulsa sesiones activas', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('redirects an authenticated session to home', async () => {
    mockUseAuth.mockReturnValue(authValue('authenticated'));

    await render(<AuthLayout />);

    expect(mockRedirect.mock.calls[0]?.[0]).toEqual({ href: '/home' });
    expect(mockStack).not.toHaveBeenCalled();
  });

  it.each<AuthContextValue['status']>(['unauthenticated', 'loading'])(
    'renders the auth stack while the session is %s',
    async (status) => {
      mockUseAuth.mockReturnValue(authValue(status));

      await render(<AuthLayout />);

      expect(mockStack.mock.calls[0]?.[0].screenOptions).toEqual({
        headerShown: false,
      });
      expect(mockRedirect).not.toHaveBeenCalled();
    },
  );
});
