import { fireEvent, render, screen } from '@testing-library/react-native';
import { router } from 'expo-router';
import { HeroUINativeProvider } from 'heroui-native';

import {
  login,
  register as registerApi,
  type RegisterState,
} from '../../../api/auth';
import { useAuth, type AuthContextValue } from '../../../providers/auth-provider';
import Register from '../register';

jest.mock('../../../api/auth', () => ({
  login: jest.fn(),
  register: jest.fn(),
}));

jest.mock('../../../providers/auth-provider', () => ({
  useAuth: jest.fn(),
}));

jest.mock('expo-router', () => ({
  router: {
    replace: jest.fn(),
  },
}));

const apiUrl = 'http://example.test/v1';
const mockLogin = jest.mocked(login);
const mockRegister = jest.mocked(registerApi);
const mockUseAuth = jest.mocked(useAuth);
const mockSignIn = jest.fn<Promise<void>, [string]>();
const mockRouter = jest.mocked(router);

const user = {
  id: '0198d3d1-0000-7000-8000-000000000001',
  email: 'alex@example.com',
  firstName: 'Alex',
  lastName: 'Smith',
  phone: '+525555555555',
  country: 'MX',
  timezone: 'America/Mexico_City',
  createdAt: '2026-08-21T00:00:00.000Z',
};

async function renderRegister() {
  await render(<Register />, { wrapper: HeroUINativeProvider });
}

async function fillForm({ acceptTerms = true }: { acceptTerms?: boolean } = {}) {
  await fireEvent.changeText(screen.getByTestId('register-first-name'), 'Alex');
  await fireEvent.changeText(screen.getByTestId('register-last-name'), 'Smith');
  await fireEvent.changeText(screen.getByTestId('register-email'), 'alex@example.com');
  await fireEvent.changeText(screen.getByTestId('register-phone'), '+525555555555');
  await fireEvent.changeText(screen.getByTestId('register-password'), 'correct horse');
  await fireEvent.changeText(
    screen.getByTestId('register-password-confirmation'),
    'correct horse',
  );
  await fireEvent.changeText(screen.getByTestId('register-country'), 'mx');

  if (acceptTerms) {
    await fireEvent.press(screen.getByTestId('register-terms'));
  }
}

async function submit() {
  await fireEvent.press(screen.getByTestId('register-submit'));
}

describe('R8: register llama a la api y navega', () => {
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
    jest.spyOn(Intl.DateTimeFormat.prototype, 'resolvedOptions').mockReturnValue({
      timeZone: 'America/Mexico_City',
    } as Intl.ResolvedDateTimeFormatOptions);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('registers, logs in, persists the token and opens health', async () => {
    mockRegister.mockResolvedValue({ kind: 'ok', user });
    mockLogin.mockResolvedValue({ kind: 'ok', accessToken: 'jwt-token' });
    await renderRegister();

    await fillForm();
    await submit();

    expect(mockRegister).toHaveBeenCalledWith(apiUrl, {
      firstName: 'Alex',
      lastName: 'Smith',
      email: 'alex@example.com',
      phone: '+525555555555',
      password: 'correct horse',
      passwordConfirmation: 'correct horse',
      country: 'MX',
      timezone: 'America/Mexico_City',
      termsAccepted: true,
    });
    expect(mockLogin).toHaveBeenCalledWith(apiUrl, {
      email: 'alex@example.com',
      password: 'correct horse',
    });
    expect(mockSignIn).toHaveBeenCalledWith('jwt-token');
    expect(mockRouter.replace).toHaveBeenCalledWith('/home');
  });

  it('falls back to login when the account exists but auto-login fails', async () => {
    mockRegister.mockResolvedValue({ kind: 'ok', user });
    mockLogin.mockResolvedValue({ kind: 'invalid-credentials' });
    await renderRegister();

    await fillForm();
    await submit();

    expect(mockSignIn).not.toHaveBeenCalled();
    expect(mockRouter.replace).toHaveBeenCalledWith('/login');
  });

  it('keeps submit disabled until terms are accepted', async () => {
    await renderRegister();
    await fillForm({ acceptTerms: false });

    expect(screen.getByTestId('register-submit')).toBeDisabled();
    await fireEvent.press(screen.getByTestId('register-terms'));
    expect(screen.getByTestId('register-submit')).not.toBeDisabled();
  });

  it('shows a duplicate email error', async () => {
    mockRegister.mockResolvedValue({ kind: 'email-taken' });
    await renderRegister();

    await fillForm();
    await submit();

    expect(screen.getByTestId('register-error')).toHaveTextContent(
      'Email already registered',
    );
  });

  it('maps validation errors to fields and unknown paths to the general error', async () => {
    mockRegister.mockResolvedValue({
      kind: 'validation',
      errors: [
        { path: 'firstName', message: 'First name is required' },
        { path: 'email', message: 'Invalid email address' },
        { path: 'termsAccepted', message: 'Terms must be accepted' },
      ],
    });
    await renderRegister();

    await fillForm();
    await submit();

    expect(screen.getByTestId('register-first-name-error')).toHaveTextContent(
      'First name is required',
    );
    expect(screen.getByTestId('register-email-error')).toHaveTextContent(
      'Invalid email address',
    );
    expect(screen.getByTestId('register-error')).toHaveTextContent(
      'Terms must be accepted',
    );
  });

  it.each<[RegisterState, string]>([
    [{ kind: 'unreachable', message: 'network down' }, 'Cannot reach server'],
    [{ kind: 'error' }, 'Something went wrong'],
    [{ kind: 'missing-config' }, 'Something went wrong'],
  ])('shows the expected general message for $kind', async (state, message) => {
    mockRegister.mockResolvedValue(state);
    await renderRegister();

    await fillForm();
    await submit();

    expect(screen.getByTestId('register-error')).toHaveTextContent(message);
  });
});
