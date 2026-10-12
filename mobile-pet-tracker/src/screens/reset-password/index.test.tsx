import { DeviceEventEmitter, Platform } from 'react-native';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { HeroUINativeProvider } from 'heroui-native';

import { resetPassword, type ResetPasswordState } from '../../api/auth';
import ResetPasswordRoute from '../../app/reset-password';
import { LanguageProvider } from '../../providers/language-provider';

const mockHomeEntrance = jest.fn<void, [import('react-native').ViewProps & { index: number }]>();
const mockPopIn = jest.fn<void, [import('react-native').ViewProps]>();

jest.mock('../home/home-entrance', () => {
  const React = jest.requireActual<typeof import('react')>('react');
  const { View } = jest.requireActual<typeof import('react-native')>('react-native');
  return {
    HomeEntrance(props: import('react-native').ViewProps & { index: number }) {
      mockHomeEntrance(props);
      return React.createElement(View, props);
    },
  };
});

jest.mock('../../components/pop-in', () => {
  const React = jest.requireActual<typeof import('react')>('react');
  const { View } = jest.requireActual<typeof import('react-native')>('react-native');
  return {
    PopIn(props: import('react-native').ViewProps) {
      mockPopIn(props);
      return React.createElement(View, props);
    },
  };
});

jest.mock('reicon-react-native', () => {
  const actual = jest.requireActual<typeof import('reicon-react-native')>('reicon-react-native');
  const React = jest.requireActual<typeof import('react')>('react');
  const { View } = jest.requireActual<typeof import('react-native')>('react-native');
  const mockIcon = (testID: string) =>
    function MockIcon(props: Record<string, unknown>) {
      return React.createElement(View, { testID, ...props });
    };
  return { ...actual, Check: mockIcon('icon-check') };
});

jest.mock('../../theme/use-theme-colors', () => ({
  useThemeColors: (tokens: string[]) => tokens.map((token) => `color:${token}`),
}));

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

const originalOS = Platform.OS;

const mockRouter = jest.mocked(router);
const mockUseLocalSearchParams = jest.mocked(useLocalSearchParams);
const mockResetPassword = jest.mocked(resetPassword);

async function renderRoute(token?: string) {
  mockUseLocalSearchParams.mockReturnValue(token === undefined ? {} : { token });
  await render(
    <LanguageProvider initial="es">
      <ResetPasswordRoute />
    </LanguageProvider>,
    { wrapper: HeroUINativeProvider },
  );
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
        'Este enlace está incompleto. Ábrelo de nuevo desde tu correo.',
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
      'Contraseña actualizada',
    );
    expect(screen.queryByTestId('reset-password')).toBeNull();

    await fireEvent.press(screen.getByTestId('link-login'));
    expect(mockRouter.push).toHaveBeenCalledWith('/login');
  });

  it.each<[ResetPasswordState, string]>([
    [
      { kind: 'invalid-token' },
      'El enlace no es válido o ya se usó. Solicita uno nuevo.',
    ],
    [{ kind: 'expired' }, 'El enlace caducó. Solicita uno nuevo.'],
    [
      { kind: 'unreachable', message: 'network down' },
      'No se pudo conectar con el servidor',
    ],
    [{ kind: 'error' }, 'Algo salió mal'],
    [{ kind: 'missing-config' }, 'Algo salió mal'],
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

    const screenRoot = screen.getByTestId('reset-password-form');

    expect(screenRoot.props.contentContainerStyle).toEqual(metrics);
    expect(screenRoot.props.keyboardShouldPersistTaps).toBe('handled');
  });
});

describe('#127 R1: el botón de envío de reset-password lleva su receta en el árbol', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('pinta reset-submit con la clase exacta, rounded-xl y bg-accent incluidos, la vea o no el recorte de fuente', async () => {
    await renderRoute('reset-token-127');

    expect(screen.getByTestId('reset-submit').props.className).toBe(
      'pressable-feedback__root button__root button__root--variant-primary button__root--size-md w-full rounded-xl bg-accent border-b-4 border-black/25',
    );
  });
});

describe('#148 R3: reset-password se aparta del teclado en Android', () => {
  afterEach(() => {
    (Platform as { OS: string }).OS = originalOS;
  });

  it('el host screen-reset-password añade paddingBottom 200 al abrir el teclado', async () => {
    (Platform as { OS: string }).OS = 'android';
    await renderRoute('token-148');

    const host = screen.getByTestId('screen-reset-password');
    expect(host).toHaveStyle({ paddingBottom: 0 });
    await fireEvent(host, 'layout', {
      persist() {},
      nativeEvent: { layout: { x: 0, y: 0, width: 400, height: 700 } },
    });
    await act(async () => {
      DeviceEventEmitter.emit('keyboardDidShow', {
        startCoordinates: { screenX: 0, screenY: 800, width: 400, height: 0 },
        endCoordinates: { screenX: 0, screenY: 500, width: 400, height: 300 },
        duration: 0, easing: 'keyboard', isEventFromThisApp: true,
      });
    });
    await waitFor(() => expect(screen.getByTestId('screen-reset-password')).toHaveStyle({ paddingBottom: 200 }));
  });
});


describe('#167 R10: Pingo y tarjeta de estado en nueva contraseña', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.EXPO_PUBLIC_API_URL = 'http://example.test/v1';
    mockResetPassword.mockResolvedValue({ kind: 'ok' });
  });

  it('#167 R10: el formulario entra en dos tiempos', async () => {
    await renderRoute('reset-token-167');
    expect(Object.fromEntries(mockHomeEntrance.mock.calls.map(([p]) => [
      p.testID, { index: p.index, className: p.className },
    ]))).toEqual({
      'reset-header': { index: 0, className: 'flex-row items-center justify-center gap-3' },
      'reset-body': { index: 1, className: 'gap-4' },
    });
  });

  it('#167 R10: la cabecera lleva a Pingo y después el título', async () => {
    await renderRoute('reset-token-167');
    const header = screen.getByTestId('reset-header');
    expect(header.children).toHaveLength(2);
    expect(header.children[0]).toHaveProperty('props.testID', 'reset-pingo');
    expect(header.children[1]).toBe(within(header).getByText('Restablecer contraseña'));
  });

  it('#167 R10: el cuerpo lleva campos, error y envío', async () => {
    mockResetPassword.mockResolvedValue({ kind: 'invalid-token' });
    await renderRoute('reset-token-167');
    const body = screen.getByTestId('reset-body');
    const header = screen.getByTestId('reset-header');
    for (const id of ['reset-password', 'reset-password-confirm', 'reset-submit']) {
      expect(within(body).getByTestId(id)).toBeOnTheScreen();
      expect(within(header).queryByTestId(id)).toBeNull();
    }
    await submitReset();
    expect(within(body).getByTestId('reset-error')).toBeOnTheScreen();
  });

  it('#167 R10: Pingo en el formulario usa la tablilla', async () => {
    await renderRoute('reset-token-167');
    const pingo = screen.getByTestId('reset-pingo');
    expect(pingo.props.source).toEqual([
      expect.objectContaining({ testUri: expect.stringMatching(/pingo-clipboard\.webp$/) }),
    ]);
    expect(pingo.props.style).toEqual({ width: 72, height: 72 });
    expect(pingo.props.accessibilityLabel).toBeUndefined();
  });

  it('#167 R10: Pingo en el éxito usa la tablilla', async () => {
    await renderRoute('reset-token-167');
    await submitReset();
    expect(await screen.findByTestId('reset-success')).toBeOnTheScreen();
    const pingo = screen.getByTestId('reset-pingo');
    expect(pingo.props.source).toEqual([
      expect.objectContaining({ testUri: expect.stringMatching(/pingo-clipboard\.webp$/) }),
    ]);
    expect(pingo.props.style).toEqual({ width: 72, height: 72 });
    expect(pingo.props.accessibilityLabel).toBeUndefined();
  });

  it('#167 R10: el éxito pinta cabecera, tarjeta y enlace, sin cuerpo', async () => {
    await renderRoute('reset-token-167');
    await submitReset();
    expect(await screen.findByTestId('reset-success')).toBeOnTheScreen();
    const nodes = screen.getAllByTestId(/^(reset-header|reset-success-pop|link-login)$/);
    expect(nodes.map((node) => node.props.testID)).toEqual(['reset-header', 'reset-success-pop', 'link-login']);
    expect(nodes[0].parent).toBe(nodes[1].parent);
    expect(nodes[1].parent).toBe(nodes[2].parent);
    expect(screen.queryByTestId('reset-body')).toBeNull();
  });

  it('#167 R10: la tarjeta de estado es secondary con check y texto', async () => {
    await renderRoute('reset-token-167');
    await submitReset();
    expect(await screen.findByTestId('reset-success')).toBeOnTheScreen();
    const pop = screen.getByTestId('reset-success-pop');
    const card = within(pop).getByTestId('reset-success-card');
    expect(card.props.className.split(' ')).toEqual(expect.arrayContaining([
      'rounded-card', 'bg-surface-secondary', 'flex-row', 'items-center', 'gap-3', 'px-4', 'py-3.5',
    ]));
    expect(card.children.map((child) => typeof child === 'string' ? child : child.props.testID))
      .toEqual(['reset-success-check', 'reset-success']);
  });

  it('#167 R10: el disco del check es acento con Check de 18', async () => {
    await renderRoute('reset-token-167');
    await submitReset();
    expect(await screen.findByTestId('reset-success')).toBeOnTheScreen();
    const disk = screen.getByTestId('reset-success-check');
    expect(disk.props.className).toBe('size-8 items-center justify-center rounded-full bg-accent');
    const icon = within(disk).getByTestId('icon-check');
    expect(disk.children).toEqual([icon]);
    expect(icon.props.size).toBe(18);
    expect(icon.props.color).toBe('color:accent-foreground');
  });

  it('#167 R10: el texto de éxito es tinta accent-strong y seleccionable', async () => {
    await renderRoute('reset-token-167');
    await submitReset();
    const text = await screen.findByTestId('reset-success');
    expect(text.props.className).toBe('flex-1 font-bold text-accent-strong');
    expect(text.props.selectable).toBe(true);
    expect(text).toHaveTextContent('Contraseña actualizada');
  });

  it('#167 R10: la tarjeta de estado entra con pop', async () => {
    await renderRoute('reset-token-167');
    mockPopIn.mockClear();
    await submitReset();
    expect(await screen.findByTestId('reset-success')).toBeOnTheScreen();
    expect(Object.fromEntries(mockPopIn.mock.calls.map(([p]) => [
      p.testID, { className: p.className, style: p.style },
    ]))).toEqual({ 'reset-success-pop': { className: 'w-full', style: undefined } });
  });
});
