import {
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { HeroUINativeProvider } from 'heroui-native';

import { resetPassword } from '../../api/auth';
import ResetPasswordRoute from '../../app/reset-password';

jest.mock('../../api/auth', () => ({
  resetPassword: jest.fn(),
}));

jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
  },
  useLocalSearchParams: jest.fn(),
}));

const mockRouter = jest.mocked(router);
const mockUseLocalSearchParams = jest.mocked(useLocalSearchParams);
const mockResetPassword = jest.mocked(resetPassword);

async function renderRoute(token?: string) {
  mockUseLocalSearchParams.mockReturnValue(token === undefined ? {} : { token });
  await render(<ResetPasswordRoute />, { wrapper: HeroUINativeProvider });
}

describe('R5: la ruta /reset-password recibe el token del deep link', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza el formulario cuando recibe un token', async () => {
    await renderRoute('reset-token-r5');

    expect(screen.getByTestId('reset-password')).toBeVisible();
    expect(screen.getByTestId('reset-password-confirm')).toBeVisible();
    expect(screen.getByTestId('reset-submit')).toBeVisible();
    expect(screen.queryByTestId('reset-missing-token')).toBeNull();
  });

  it.each([undefined, '', '   '])(
    'muestra el estado seguro para token %p y permite volver al login',
    async (token) => {
      await renderRoute(token);

      expect(screen.getByTestId('reset-missing-token')).toHaveTextContent(
        'This reset link is incomplete. Open the link from your email again.',
      );
      expect(screen.queryByTestId('reset-password')).toBeNull();

      await fireEvent.press(screen.getByTestId('link-login'));
      expect(mockRouter.push).toHaveBeenCalledWith('/login');
    },
  );
});

describe('R6: abrir la pantalla no dispara ninguna peticion', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.EXPO_PUBLIC_API_URL = 'http://example.test/v1';
  });

  it('no llama a resetPassword al montar la pantalla', async () => {
    await renderRoute('reset-token-r6');

    expect(mockResetPassword).not.toHaveBeenCalled();
  });

  it('hace exactamente una llamada despues del submit', async () => {
    mockResetPassword.mockResolvedValue({ kind: 'ok' });
    await renderRoute('reset-token-r6');

    expect(mockResetPassword).not.toHaveBeenCalled();

    await fireEvent.changeText(
      screen.getByTestId('reset-password'),
      'new-password-123',
    );
    await fireEvent.changeText(
      screen.getByTestId('reset-password-confirm'),
      'new-password-123',
    );
    await fireEvent.press(screen.getByTestId('reset-submit'));

    await waitFor(() => {
      expect(mockResetPassword).toHaveBeenCalledTimes(1);
    });
    expect(mockResetPassword).toHaveBeenCalledWith(
      'http://example.test/v1',
      {
        token: 'reset-token-r6',
        password: 'new-password-123',
        passwordConfirmation: 'new-password-123',
      },
    );
  });
});
