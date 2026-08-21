import { render, screen } from '@testing-library/react-native';
import { Redirect } from 'expo-router';

import { useAuth, type AuthContextValue } from '../../providers/auth-provider';
import Index from '../index';

jest.mock('../../providers/auth-provider', () => ({
  useAuth: jest.fn(),
}));

jest.mock('expo-router', () => ({
  Redirect: jest.fn(() => null),
}));

const mockUseAuth = jest.mocked(useAuth);
const mockRedirect = jest.mocked(Redirect);

function authValue(status: AuthContextValue['status']): AuthContextValue {
  return {
    status,
    token: status === 'authenticated' ? 'jwt-token' : null,
    signIn: jest.fn(),
    signOut: jest.fn(),
  };
}

describe('R5: splash navega según sesión', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows the centered logo while the session is loading', async () => {
    mockUseAuth.mockReturnValue(authValue('loading'));

    await render(<Index />);

    expect(screen.getByTestId('splash-logo')).toBeVisible();
    expect(mockRedirect).not.toHaveBeenCalled();
  });

  it('redirects an authenticated session to health', async () => {
    mockUseAuth.mockReturnValue(authValue('authenticated'));

    await render(<Index />);

    expect(mockRedirect.mock.calls[0]?.[0]).toEqual({ href: '/health' });
    expect(screen.queryByTestId('splash-logo')).not.toBeOnTheScreen();
  });

  it('redirects an unauthenticated session to login', async () => {
    mockUseAuth.mockReturnValue(authValue('unauthenticated'));

    await render(<Index />);

    expect(mockRedirect.mock.calls[0]?.[0]).toEqual({ href: '/login' });
    expect(screen.queryByTestId('splash-logo')).not.toBeOnTheScreen();
  });
});
