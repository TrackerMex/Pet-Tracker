import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { router } from 'expo-router';
import { HeroUINativeProvider } from 'heroui-native';

import { login, type LoginState } from '../../../api/auth';
import { useAuth, type AuthContextValue } from '../../../providers/auth-provider';
import Login from '../login';

jest.mock('../../../api/auth', () => ({
  login: jest.fn(),
}));

jest.mock('../../../providers/auth-provider', () => ({
  useAuth: jest.fn(),
}));

jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
    replace: jest.fn(),
  },
}));

const apiUrl = 'http://example.test/v1';
const mockLogin = jest.mocked(login);
const mockUseAuth = jest.mocked(useAuth);
const mockSignIn = jest.fn<Promise<void>, [string]>();
const mockRouter = jest.mocked(router);

async function renderLogin() {
  await render(<Login />, { wrapper: HeroUINativeProvider });
}

async function submit(email = 'alex@example.com', password = 'correct horse') {
  await fireEvent.changeText(screen.getByTestId('login-email'), email);
  await fireEvent.changeText(screen.getByTestId('login-password'), password);
  await fireEvent.press(screen.getByTestId('login-submit'));
}

describe('R7: login llama a la api y navega', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.EXPO_PUBLIC_API_URL = apiUrl;
    mockSignIn.mockResolvedValue();
    mockUseAuth.mockReturnValue({
      status: 'unauthenticated',
      token: null,
      signIn: mockSignIn,
      signOut: jest.fn(),
    } satisfies AuthContextValue);
  });

  it('signs in and replaces the route after a successful login', async () => {
    mockLogin.mockResolvedValue({ kind: 'ok', accessToken: 'jwt-token' });
    await renderLogin();

    await submit();

    expect(mockLogin).toHaveBeenCalledWith(apiUrl, {
      email: 'alex@example.com',
      password: 'correct horse',
    });
    expect(mockSignIn).toHaveBeenCalledWith('jwt-token');
    expect(mockRouter.replace).toHaveBeenCalledWith('/home');
  });

  it.each<[LoginState, string]>([
    [{ kind: 'invalid-credentials' }, 'Invalid credentials'],
    [{ kind: 'unreachable', message: 'network down' }, 'Cannot reach server'],
    [{ kind: 'error' }, 'Something went wrong'],
    [{ kind: 'missing-config' }, 'Something went wrong'],
  ])('shows the expected message for $kind', async (state, message) => {
    mockLogin.mockResolvedValue(state);
    await renderLogin();

    await submit();

    expect(screen.getByTestId('login-error')).toHaveTextContent(message);
    expect(mockSignIn).not.toHaveBeenCalled();
    expect(mockRouter.replace).not.toHaveBeenCalled();
  });

  it('shows every backend validation message', async () => {
    mockLogin.mockResolvedValue({
      kind: 'validation',
      errors: [
        { path: 'email', message: 'Invalid email address' },
        { path: 'password', message: 'Password is too short' },
      ],
    });
    await renderLogin();

    await submit();

    const error = screen.getByTestId('login-error');
    expect(error).toHaveTextContent(/Invalid email address/);
    expect(error).toHaveTextContent(/Password is too short/);
  });

  it('links to register and forgot password', async () => {
    await renderLogin();

    await fireEvent.press(screen.getByTestId('link-register'));
    await fireEvent.press(screen.getByTestId('link-forgot'));

    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenNthCalledWith(1, '/register');
      expect(mockRouter.push).toHaveBeenNthCalledWith(2, '/forgot');
    });
  });
});
