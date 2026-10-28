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
import type { TestInstance } from 'test-renderer';

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
  return { ...actual, Eye: mockIcon('icon-eye'), EyeOff: mockIcon('icon-eye-off'), AlertCircle: mockIcon('icon-alert-circle'), Check: mockIcon('icon-check') };
});

jest.mock('../../theme/use-theme-colors', () => ({
  useThemeColors: (tokens: string[]) => tokens.map((token) => `color:${token}`),
}));

jest.mock('../../components/orbit-float', () => {
  const React = jest.requireActual<typeof import('react')>('react');
  const { View } = jest.requireActual<typeof import('react-native')>('react-native');
  return {
    OrbitFloat(props: { testID: string; children: import('react').ReactNode }) {
      return React.createElement(View, props);
    },
  };
});

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

  it('#187 R3: el botón reset-submit pinta su etiqueta a 17 px', async () => {
      await renderRoute('reset-token-187');
      expect(within(screen.getByTestId('reset-submit')).getByText('Actualizar contraseña').props.className)
        .toBe('text-17 font-extrabold text-accent-foreground');
  });

  it.each(['Nueva contraseña', 'Confirmar nueva contraseña'])(
    '#187 R2: la etiqueta "%s" de reset-password pinta 13 px', async (label) => {
      await renderRoute('reset-token-187');
      expect(screen.getByText(label).props.className).toBe('text-13 font-semibold text-muted');
    },
  );

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

  it('#183 R7: un 400 de validación pinta el aviso genérico y no el texto del servidor', async () => {
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

    await submitReset();

    const error = await screen.findByTestId('reset-error');
    expect(error.props.children).toBe(
      'Algo no cuadra en los datos. Revísalos y vuelve a intentarlo.',
    );
    expect(screen.getByTestId('reset-submit')).toBeVisible();
  });

  it('#183 R7: un 400 de validación en nueva contraseña no marca ningún campo', async () => {
    mockResetPassword.mockResolvedValue({
      kind: 'validation',
      errors: [{ path: 'passwordConfirmation', message: 'Passwords must match' }],
    });
    await renderRoute('reset-token-r8');
    await submitReset();
    expect(await screen.findByTestId('reset-error')).toHaveTextContent('Algo no cuadra en los datos. Revísalos y vuelve a intentarlo.');
    expect(screen.queryAllByTestId(/^reset-password(-confirm)?-message-row$/)).toHaveLength(0);
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
    padding: 24,
    gap: 16,
    paddingTop: 52,
    paddingBottom: 48,
  };
  const formMetrics = {
    flexGrow: 1,
    paddingHorizontal: 20, // #205 R12
    paddingTop: 96, // #205 R12
    paddingBottom: 48,
  };

  it('la rama sin token centra también en horizontal', async () => {
    await renderRoute();

    const screenRoot = screen.getByTestId('screen-reset-password');

    expect(screenRoot.props.contentContainerStyle).toEqual({
      ...metrics,
      justifyContent: 'center',
      alignItems: 'center',
    });
    expect(screenRoot.props.contentInsetAdjustmentBehavior).toBe('automatic');
  });

  it('#172 R19: la rama de éxito ancla el enlace al pie y no centra (enmendado por #205 R13)', async () => {
    mockResetPassword.mockResolvedValue({ kind: 'ok' });
    await renderRoute('token-123');
    await submitReset();

    await waitFor(() => expect(screen.getByTestId('reset-success')).toBeVisible());

    expect(
      screen.getByTestId('screen-reset-password').props.contentContainerStyle,
    ).toEqual(formMetrics); // #205 R13
  });

  it('#172 R19: la rama del formulario ancla el envío al pie y no centra (enmendado por #205 R12)', async () => {
    await renderRoute('token-123');

    const screenRoot = screen.getByTestId('reset-password-form');

    expect(screenRoot.props.contentContainerStyle).toEqual(formMetrics); // #205 R12
    expect(screenRoot.props.keyboardShouldPersistTaps).toBe('handled');
  });
});

describe('#127 R1: el botón de envío de reset-password lleva su receta en el árbol', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('pinta reset-submit con la clase exacta, rounded-xl y bg-accent incluidos, la vea o no el recorte de fuente', async () => {
    await renderRoute('reset-token-127');

    expect(screen.getByTestId('reset-submit').props.className).toContain(
      'w-full h-14 rounded-16 bg-accent',
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

  it.each(['reset-password', 'reset-password-confirm'])('#172 R8: %s lleva su propio ojo', async (field) => {
    await renderRoute('reset-token-172');
    const input = screen.getByTestId(field);
    expect(input.props.secureTextEntry).toBe(true);
    const toggle = screen.getByTestId(`${field}-toggle`);
    expect(toggle.props.accessibilityLabel).toBe('Mostrar contraseña');
    const group = screen.getByTestId(`${field}-group`);
    expect(group).toContainElement(input);
    expect(group).toContainElement(toggle);
    await fireEvent.press(toggle);
    expect(screen.getByTestId(field).props.secureTextEntry).toBe(false);
    expect(screen.getByTestId(`${field}-toggle`).props.accessibilityLabel).toBe('Ocultar contraseña');
    const other = field === 'reset-password' ? 'reset-password-confirm' : 'reset-password';
    expect(screen.getByTestId(other).props.secureTextEntry).toBe(true);
  });

  it('#172 R5: Pingo de nueva contraseña flota en el formulario y en el éxito (enmendado por #205 R12, R13)', async () => {
    await renderRoute('reset-token-172');
    expect(screen.queryByTestId('reset-orbit-float')).toBeNull(); // #205 R12
    expect(screen.getByTestId('reset-orbit').parent)
      .toHaveProperty('props.testID', 'reset-header'); // #205 R12
    await submitReset();
    expect(await screen.findByTestId('reset-success')).toBeOnTheScreen();
    expect(screen.queryByTestId('reset-orbit-float')).toBeNull(); // #205 R13
    expect(screen.getByTestId('reset-orbit').parent)
      .toHaveProperty('props.testID', 'reset-header'); // #205 R13
  });

  it('#167 R10: el formulario entra en dos tiempos (enmendado por #205 R12)', async () => {
    await renderRoute('reset-token-167');
    expect(mockHomeEntrance).not.toHaveBeenCalled(); // #205 R12
    for (const testID of ['reset-header', 'reset-body']) { // #205 R12
      expect(typeof screen.getByTestId(testID).props.entering).toBe('function');
    }
    expect(screen.getByTestId('reset-header').props.className).toBe('flex-row items-center gap-3.5'); // #205 R12
    expect(screen.getByTestId('reset-body').props.className).toBe('mt-8 flex-1 gap-4'); // #205 R12
  });

  it('#167 R10: la cabecera lleva a Pingo y después el título (enmendado por #205 R12)', async () => {
    await renderRoute('reset-token-167');
    const header = screen.getByTestId('reset-header');
    expect(header.children).toHaveLength(2);
    expect(header.children[0]).toHaveProperty('props.testID', 'reset-orbit'); // #205 R12
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
    const orbit = screen.getByTestId('reset-orbit');
    expect(orbit.props.source).toEqual([
      expect.objectContaining({ testUri: expect.stringMatching(/orbit-clipboard\.webp$/) }),
    ]);
    expect(orbit.props.style).toEqual({ width: 72, height: 72 });
    expect(orbit.props.accessibilityLabel).toBeUndefined();
  });

  it('#167 R10: Pingo en el éxito usa la tablilla', async () => {
    await renderRoute('reset-token-167');
    await submitReset();
    expect(await screen.findByTestId('reset-success')).toBeOnTheScreen();
    const orbit = screen.getByTestId('reset-orbit');
    expect(orbit.props.source).toEqual([
      expect.objectContaining({ testUri: expect.stringMatching(/orbit-clipboard\.webp$/) }),
    ]);
    expect(orbit.props.style).toEqual({ width: 72, height: 72 });
    expect(orbit.props.accessibilityLabel).toBeUndefined();
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

  it('#172 R19: el espaciador empuja el envío al pie del formulario', async () => {
    mockResetPassword.mockResolvedValue({ kind: 'invalid-token' });
    await renderRoute('reset-token-172');
    function expectSpacer(withError = false) {
      const spacer = screen.getByTestId('reset-spacer');
      const cta = screen.getByTestId('reset-submit');
      expect(spacer.parent).toBe(cta.parent);
      expect(spacer.parent).toBe(screen.getByTestId('reset-body'));
      const children = spacer.parent?.children ?? [];
      const index = children.indexOf(spacer);
      expect(index).toBe(children.indexOf(cta) - 1);
      expect(spacer.props.className).toBe('flex-1');
      expect(spacer.children).toHaveLength(0);
      if (withError) {
        expect(children.indexOf(screen.getByTestId('reset-error-row'))).toBe(index - 1);
      }
    }
    expectSpacer();
    await submitReset();
    expectSpacer(true);
  });

  it('#172 R19: el espaciador empuja el enlace al pie del éxito', async () => {
    await renderRoute('reset-token-172');
    await submitReset();
    expect(await screen.findByTestId('reset-success')).toBeOnTheScreen();
    const spacer = screen.getByTestId('reset-spacer');
    const cta = screen.getByTestId('link-login');
    expect(spacer.parent).toBe(cta.parent);
    expect(spacer.parent).toBe(screen.getByTestId('reset-header').parent);
    const children = spacer.parent?.children ?? [];
    const index = children.indexOf(spacer);
    expect(index).toBe(children.indexOf(cta) - 1);
    expect(spacer.props.className).toBe('flex-1');
    expect(spacer.children).toHaveLength(0);
    expect(children.indexOf(screen.getByTestId('reset-success-pop'))).toBe(index - 1);
  });

  it('#172 R19: el formulario lleva el enlace de vuelta al login bajo el envío', async () => {
    await renderRoute('reset-token-172');
    const body = screen.getByTestId('reset-body');
    const link = within(body).getByTestId('link-login');
    expect(link).toHaveTextContent('Volver al inicio de sesión');
    expect(body.children.indexOf(link)).toBe(body.children.indexOf(screen.getByTestId('reset-submit')) + 1);
    await fireEvent.press(link);
    expect(mockRouter.push).toHaveBeenCalledWith('/login');
    expect(mockResetPassword).not.toHaveBeenCalled();
  });

  it('#172 R13: la tarjeta de estado avisa con liveRegion polite', async () => {
    await renderRoute('reset-token-172');
    await submitReset();
    expect(await screen.findByTestId('reset-success')).toBeOnTheScreen();
    expect(screen.getByTestId('reset-success-card').props.accessibilityLiveRegion).toBe('polite');
  });

  it('#167 R10: el éxito conserva la cabecera del formulario (enmendado por #205 R13)', async () => {
    await renderRoute('reset-token-167');
    await submitReset();
    expect(await screen.findByTestId('reset-success')).toBeOnTheScreen();
    const header = screen.getByTestId('reset-header');
    expect(typeof header.props.entering).toBe('function'); // #205 R13
    expect(header.props.className).toBe('flex-row items-center gap-3.5'); // #205 R13
    expect(header.children).toHaveLength(2);
    expect(header.children[0]).toHaveProperty('props.testID', 'reset-orbit'); // #205 R13
    expect(header.children[1]).toBe(within(header).getByText('Restablecer contraseña'));
  });

  it('#167 R10: con error, el error va entre la confirmación y el envío', async () => {
    mockResetPassword.mockResolvedValue({ kind: 'invalid-token' });
    await renderRoute('reset-token-167');
    await submitReset();
    const body = screen.getByTestId('reset-body');
    expect(within(body).getAllByTestId(/^(reset-password|reset-password-confirm|reset-error|reset-submit)$/)
      .map((node) => node.props.testID)).toEqual([
      'reset-password', 'reset-password-confirm', 'reset-error', 'reset-submit',
    ]);
  });

  it('#172 R9: el error de nueva contraseña va con icono en su fila', async () => {
    mockResetPassword.mockResolvedValue({ kind: 'invalid-token' });
    await renderRoute('reset-token-167');
    await submitReset();
    const row = await screen.findByTestId('reset-error-row');
    expect(row.children).toEqual([
      screen.getByTestId('icon-alert-circle'), screen.getByTestId('reset-error'),
    ]);
    expect(screen.getByTestId('reset-error').props.selectable).toBe(true);
  });

  it('#167 R10: sin error, el cuerpo no lleva el error', async () => {
    await renderRoute('reset-token-167');
    expect(within(screen.getByTestId('reset-body')).queryByTestId('reset-error')).toBeNull();
  });

  it('#167 R10: la cabecera va antes que el cuerpo en el scroll', async () => {
    await renderRoute('reset-token-167');
    const header = screen.getByTestId('reset-header');
    expect(header.parent?.parent).toHaveProperty('props.testID', 'reset-password-form');
    expect(header.parent?.children).toEqual([header, screen.getByTestId('reset-body')]);
  });

  it('#167 R10: la tarjeta de estado es secondary con check y texto (enmendado por #205 R13)', async () => {
    await renderRoute('reset-token-167');
    await submitReset();
    expect(await screen.findByTestId('reset-success')).toBeOnTheScreen();
    const pop = screen.getByTestId('reset-success-pop');
    const card = within(pop).getByTestId('reset-success-card');
    expect(card.props.className.split(' ')).toEqual(expect.arrayContaining([
      'rounded-16', 'bg-surface-secondary', 'flex-row', 'items-center', 'gap-3', 'px-4', 'py-3.5', // #205 R13
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
    expect(text.props.className).toBe('flex-1 text-15 font-bold text-accent-strong');
    expect(text.props.selectable).toBe(true);
    expect(text).toHaveTextContent('Contraseña actualizada');
  });

  it('#167 R10: la tarjeta de estado entra con pop (enmendado por #205 R13)', async () => {
    await renderRoute('reset-token-167');
    mockPopIn.mockClear();
    await submitReset();
    expect(await screen.findByTestId('reset-success')).toBeOnTheScreen();
    expect(Object.fromEntries(mockPopIn.mock.calls.map(([p]) => [
      p.testID, { className: p.className, style: p.style },
    ]))).toEqual({ 'reset-success-pop': { className: 'mt-6 w-full', style: undefined } }); // #205 R13
  });
});

describe('#205 R12: NuevaContrasena, formulario', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.EXPO_PUBLIC_API_URL = 'http://example.test/v1';
    mockResetPassword.mockResolvedValue({ kind: 'invalid-token' });
  });

  it('#205 R12: el formulario apila cabecera sin flotación y cuerpo con RiseIn', async () => {
    await renderRoute('reset-token-205');
    await submitReset();
    expect(await screen.findByTestId('reset-error')).toBeOnTheScreen();

    expect(screen.queryByTestId('reset-orbit-float')).toBeNull();
    const header = screen.getByTestId('reset-header');
    expect(typeof header.props.entering).toBe('function');
    expect(header.props.className).toBe('flex-row items-center gap-3.5');
    expect((header.children as TestInstance[]).map((child) => child.props.testID))
      .toEqual(['reset-orbit', undefined]);
    expect(screen.getByTestId('reset-orbit').props.style).toEqual({ width: 72, height: 72 });
    expect(within(header).getByText('Restablecer contraseña').props.className)
      .toBe('flex-1 text-28 leading-8 font-black tracking-display text-foreground');

    const body = screen.getByTestId('reset-body');
    expect(typeof body.props.entering).toBe('function');
    expect(body.props.className).toBe('mt-8 flex-1 gap-4');
    expect(header.parent?.children).toEqual([header, body]);
    expect(within(body).getAllByTestId(/^(reset-password|reset-password-confirm|reset-error|reset-spacer|reset-submit|link-login)$/)
      .map((node) => node.props.testID)).toEqual([
      'reset-password', 'reset-password-confirm', 'reset-error', 'reset-spacer', 'reset-submit', 'link-login',
    ]);
  });

  it('#205 R12: el scroll arranca 56 por debajo del inset y usa márgenes 20', async () => {
    await renderRoute('reset-token-205');
    const style = screen.getByTestId('reset-password-form').props.contentContainerStyle;
    expect(style.paddingTop).toBe(40 + 56);
    expect(style.paddingBottom).toBe(24 + 24);
    expect(style.paddingHorizontal).toBe(20);
    expect(style.padding).toBeUndefined();
    expect(style.gap).toBeUndefined();
  });
});

describe('#205 R13: NuevaContrasena, éxito', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.EXPO_PUBLIC_API_URL = 'http://example.test/v1';
    mockResetPassword.mockResolvedValue({ kind: 'ok' });
  });

  it('#205 R13: la tarjeta de estado es una vista de radio 16 bajo la cabecera', async () => {
    await renderRoute('reset-token-205');
    await submitReset();
    expect(await screen.findByTestId('reset-success')).toBeOnTheScreen();

    const pop = screen.getByTestId('reset-success-pop');
    expect(pop.props.className).toBe('mt-6 w-full');
    const card = within(pop).getByTestId('reset-success-card');
    expect(card.parent?.props.testID).toBe('reset-success-pop');
    expect(card.props.className).toBe('flex-row items-center gap-3 rounded-16 bg-surface-secondary px-4 py-3.5');
    expect(card.props.style).toEqual({ borderCurve: 'continuous' });
    expect(card.props.accessibilityLiveRegion).toBe('polite');
    expect(card.children.map((child) => typeof child === 'string' ? child : child.props.testID))
      .toEqual(['reset-success-check', 'reset-success']);

    const header = screen.getByTestId('reset-header');
    expect((header.parent?.children as TestInstance[]).map((child) => child.props.testID))
      .toEqual(['reset-header', 'reset-success-pop', 'reset-spacer', 'link-login']);
  });

  it('#205 R13: el éxito conserva la cabecera sin flotación', async () => {
    await renderRoute('reset-token-205');
    await submitReset();
    expect(await screen.findByTestId('reset-success')).toBeOnTheScreen();

    expect(mockHomeEntrance).not.toHaveBeenCalled();
    expect(screen.queryByTestId('reset-orbit-float')).toBeNull();
    const header = screen.getByTestId('reset-header');
    expect(typeof header.props.entering).toBe('function');
    expect(header.props.className).toBe('flex-row items-center gap-3.5');
    expect((header.children as TestInstance[]).map((child) => child.props.testID))
      .toEqual(['reset-orbit', undefined]);
    expect(screen.getByTestId('reset-orbit').props.style).toEqual({ width: 72, height: 72 });
    expect(within(header).getByText('Restablecer contraseña').props.className)
      .toBe('flex-1 text-28 leading-8 font-black tracking-display text-foreground');
    expect(screen.getByTestId('screen-reset-password').props.contentContainerStyle)
      .toEqual({ flexGrow: 1, paddingHorizontal: 20, paddingTop: 96, paddingBottom: 48 });
  });
});

describe('#205 R14: NuevaContrasena sin token', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.EXPO_PUBLIC_API_URL = 'http://example.test/v1';
  });

  it('#205 R14: la rama sin token conserva su contenedor y su título', async () => {
    await renderRoute();

    const root = screen.getByTestId('screen-reset-password');
    expect(root.props.contentContainerStyle).toEqual({
      flexGrow: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 24,
      gap: 16,
      paddingTop: 52,
      paddingBottom: 48,
    });
    expect(root.props.contentInsetAdjustmentBehavior).toBe('automatic');
    expect(screen.getByText('Restablecer contraseña').props.className)
      .toBe('text-center text-2xl font-black text-foreground');
    const missing = screen.getByTestId('reset-missing-token');
    expect(missing.props.className).toBe('text-center text-danger');
    expect(missing).toHaveTextContent('Este enlace está incompleto. Ábrelo de nuevo desde tu correo.');
    expect(screen.queryByTestId('reset-header')).toBeNull();
    expect(screen.queryByTestId('reset-orbit')).toBeNull();

    const link = screen.getByTestId('link-login');
    expect(link).toHaveTextContent('Volver al inicio de sesión');
    await fireEvent.press(link);
    expect(mockRouter.push).toHaveBeenCalledWith('/login');
  });
});

describe('#183 R6: nueva contraseña valida en cliente', () => {
  const apiUrl = 'http://example.test/v1';
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.EXPO_PUBLIC_API_URL = apiUrl;
    mockResetPassword.mockResolvedValue({ kind: 'error' });
  });

  it.each<[[string, string], string, string]>([
    [['1234567', '1234567'], 'Usa al menos 8 caracteres', 'reset-password-message'],
    [['a'.repeat(129), 'a'.repeat(129)], 'Usa 128 caracteres o menos', 'reset-password-message'],
    [['new-password-123', 'new-password-124'], 'Las contraseñas no coinciden', 'reset-password-confirm-message'],
  ])('#183 R6: %p pinta «%s» en %s y no llama a la API', async ([password, confirmation], message, id) => {
    await renderRoute('reset-token-r8');
    await submitReset(password, confirmation);
    await waitFor(() => expect(screen.getByTestId(id)).toHaveTextContent(message));
    const text = screen.getByTestId(id);
    const row = screen.getByTestId(`${id}-row`);
    expect(screen.getAllByTestId(/^reset-password(-confirm)?-message-row$/)).toHaveLength(1);
    expect(row.children).toEqual([within(row).getByTestId('icon-alert-circle'), text]);
    expect(text.props.selectable).toBe(true);
    expect(screen.queryByTestId('reset-error')).toBeNull();
    expect(mockResetPassword).not.toHaveBeenCalled();
  });

  it('#183 R6: las dos reglas a la vez pintan los dos mensajes', async () => {
    await renderRoute('reset-token-r8');
    await submitReset('1234567', 'x');
    await waitFor(() => {
      expect(screen.getByTestId('reset-password-message')).toHaveTextContent('Usa al menos 8 caracteres');
      expect(screen.getByTestId('reset-password-confirm-message')).toHaveTextContent('Las contraseñas no coinciden');
    });
    expect(screen.getAllByTestId(/^reset-password(-confirm)?-message-row$/)).toHaveLength(2);
    expect(screen.queryByTestId('reset-error')).toBeNull();
    expect(mockResetPassword).not.toHaveBeenCalled();
  });

  it.each([' '.repeat(8), 'a'.repeat(128)])('#183 R6: %p pasa como en el DTO y llama a la API', async (value) => {
    mockResetPassword.mockResolvedValue({ kind: 'ok' });
    await renderRoute('reset-token-r8');
    await submitReset(value, value);
    await waitFor(() => expect(screen.queryByTestId('reset-success')).not.toBeNull());
    expect(screen.getByTestId('reset-success')).toHaveTextContent('Contraseña actualizada');
    expect(mockResetPassword).toHaveBeenCalledWith(apiUrl, {
      token: 'reset-token-r8', password: value, passwordConfirmation: value,
    });
  });

  it('#183 R6: un envío inválido tras un aviso general lo retira, y el corregido quita el mensaje y vuelve a llamar', async () => {
    await renderRoute('reset-token-r8');
    await submitReset();
    expect(await screen.findByTestId('reset-error')).toHaveTextContent('Algo salió mal');
    await waitFor(() => expect(screen.getByTestId('reset-submit')).not.toBeDisabled());
    await submitReset('1234567');
    await waitFor(() => expect(screen.getByTestId('reset-password-message')).toHaveTextContent('Usa al menos 8 caracteres'));
    expect(screen.queryByTestId('reset-error')).toBeNull();
    expect(mockResetPassword).toHaveBeenCalledTimes(1);
    await submitReset();
    await waitFor(() => expect(screen.getByTestId('reset-error')).toHaveTextContent('Algo salió mal'));
    expect(screen.queryByTestId('reset-password-message')).toBeNull();
    expect(mockResetPassword).toHaveBeenCalledTimes(2);
  });
});
