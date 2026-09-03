import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { HeroUINativeProvider } from 'heroui-native';

import { resetPassword, type ResetPasswordState } from '../../api/auth';
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

jest.mock('react-native-safe-area-context', () => ({
  ...jest.requireActual('react-native-safe-area-context'),
  useSafeAreaInsets: () => ({ top: 40, right: 0, bottom: 24, left: 0 }),
}));

const mockRouter = jest.mocked(router);
const mockUseLocalSearchParams = jest.mocked(useLocalSearchParams);
const mockResetPassword = jest.mocked(resetPassword);

async function renderRoute(token?: string) {
  mockUseLocalSearchParams.mockReturnValue(token === undefined ? {} : { token });
  await render(<ResetPasswordRoute />, { wrapper: HeroUINativeProvider });
}

async function submitReset(
  password = 'new-password-123',
  passwordConfirmation = password,
) {
  await fireEvent.changeText(screen.getByTestId('reset-password'), password);
  await fireEvent.changeText(
    screen.getByTestId('reset-password-confirm'),
    passwordConfirmation,
  );
  await fireEvent.press(screen.getByTestId('reset-submit'));
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

describe('R8: el submit completa el reset y mapea los errores', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.EXPO_PUBLIC_API_URL = 'http://example.test/v1';
  });

  it('retira el formulario y permite volver al login tras el exito', async () => {
    mockResetPassword.mockResolvedValue({ kind: 'ok' });
    await renderRoute('reset-token-r8');

    await submitReset();

    expect(await screen.findByTestId('reset-success')).toHaveTextContent(
      'Password updated',
    );
    expect(screen.queryByTestId('reset-password')).toBeNull();

    await fireEvent.press(screen.getByTestId('link-login'));
    expect(mockRouter.push).toHaveBeenCalledWith('/login');
  });

  it.each<[ResetPasswordState, string]>([
    [
      { kind: 'invalid-token' },
      'Reset link is invalid or already used. Request a new one.',
    ],
    [{ kind: 'expired' }, 'Reset link expired. Request a new one.'],
    [{ kind: 'unreachable', message: 'network down' }, 'Cannot reach server'],
    [{ kind: 'error' }, 'Something went wrong'],
    [{ kind: 'missing-config' }, 'Something went wrong'],
  ])(
    'muestra el mensaje esperado para $kind y permite reintentar',
    async (state, message) => {
      mockResetPassword.mockResolvedValue(state);
      await renderRoute('reset-token-r8');

      await submitReset();

      const error = await screen.findByTestId('reset-error');
      expect(error).toHaveTextContent(message);
      expect(error.props.selectable).toBe(true);
      expect(screen.getByTestId('reset-submit')).toBeVisible();
    },
  );

  it('une por salto de linea todos los mensajes de validacion', async () => {
    mockResetPassword.mockResolvedValue({
      kind: 'validation',
      errors: [
        { path: 'password', message: 'Password is too short' },
        {
          path: 'passwordConfirmation',
          message: 'Passwords must match',
        },
      ],
    });
    await renderRoute('reset-token-r8');

    await submitReset('short', 'different');

    const error = await screen.findByTestId('reset-error');
    expect(error.props.children).toBe(
      'Password is too short\nPasswords must match',
    );
    expect(screen.getByTestId('reset-submit')).toBeVisible();
  });

  it('deshabilita el boton mientras la peticion esta en vuelo', async () => {
    let resolveRequest!: (state: ResetPasswordState) => void;
    mockResetPassword.mockReturnValue(
      new Promise((resolve) => {
        resolveRequest = resolve;
      }),
    );
    await renderRoute('reset-token-r8');

    await submitReset();

    await waitFor(() => {
      expect(screen.getByTestId('reset-submit')).toBeDisabled();
    });

    await act(async () => {
      resolveRequest({ kind: 'error' });
    });

    await waitFor(() => {
      expect(screen.getByTestId('reset-submit')).not.toBeDisabled();
    });
  });
});

describe('#61 R8: las tres ramas de reset tienen contenedor de scroll', () => {
  const metrics = {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
    gap: 16,
    paddingTop: 52,
    paddingBottom: 48,
  };

  it('la rama sin token centra también en horizontal', async () => {
    await renderRoute();

    const screenRoot = screen.getByTestId('screen-reset-password');

    expect(screenRoot.props.contentContainerStyle).toEqual({
      ...metrics,
      alignItems: 'center',
    });
    expect(screenRoot.props.contentInsetAdjustmentBehavior).toBe('automatic');
  });

  it('la rama de éxito centra también en horizontal', async () => {
    mockResetPassword.mockResolvedValue({ kind: 'ok' });
    await renderRoute('token-123');
    await submitReset();

    await waitFor(() => expect(screen.getByTestId('reset-success')).toBeVisible());

    expect(
      screen.getByTestId('screen-reset-password').props.contentContainerStyle,
    ).toEqual({ ...metrics, alignItems: 'center' });
  });

  it('la rama del formulario no centra en horizontal', async () => {
    await renderRoute('token-123');

    const screenRoot = screen.getByTestId('screen-reset-password');

    expect(screenRoot.props.contentContainerStyle).toEqual(metrics);
    expect(screenRoot.props.keyboardShouldPersistTaps).toBe('handled');
  });
});
