import { DeviceEventEmitter, Platform } from 'react-native';
import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react-native';
import { router } from 'expo-router';
import { HeroUINativeProvider } from 'heroui-native';

import { forgotPassword, type ForgotPasswordState } from '../../api/auth';
import ForgotRoute from '../../app/(auth)/forgot';
import { LanguageProvider } from '../../providers/language-provider';

const mockPopIn = jest.fn<void, [import('react-native').ViewProps]>();

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

jest.mock('../../components/pingo-float', () => {
  const React = jest.requireActual<typeof import('react')>('react');
  const { View } = jest.requireActual<typeof import('react-native')>('react-native');
  return {
    PingoFloat(props: { testID: string; children: import('react').ReactNode }) {
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
  return { ...actual, AlertCircle: mockIcon('icon-alert-circle'), Lock: mockIcon('icon-lock') };
});

jest.mock('../../theme/use-theme-colors', () => ({
  useThemeColors: (tokens: string[]) => tokens.map((token) => `color:${token}`),
}));

jest.mock('../../api/auth', () => ({
  forgotPassword: jest.fn(),
}));

jest.mock('expo-router', () => ({
  router: { push: jest.fn(), back: jest.fn(), canGoBack: jest.fn(), replace: jest.fn() },
}));

jest.mock('react-native-safe-area-context', () => ({
  ...jest.requireActual('react-native-safe-area-context'),
  useSafeAreaInsets: () => ({ top: 40, right: 0, bottom: 24, left: 0 }),
}));

const originalOS = Platform.OS;
const apiUrl = 'http://api.test/v1';
const originalApiUrl = process.env.EXPO_PUBLIC_API_URL;
const mockForgotPassword = jest.mocked(forgotPassword);
const mockRouter = jest.mocked(router);

beforeEach(() => {
  jest.resetAllMocks();
  process.env.EXPO_PUBLIC_API_URL = apiUrl;
});

afterEach(() => {
  (Platform as { OS: string }).OS = originalOS;
  if (originalApiUrl === undefined) delete process.env.EXPO_PUBLIC_API_URL;
  else process.env.EXPO_PUBLIC_API_URL = originalApiUrl;
});

async function renderRoute() {
  await render(
    <LanguageProvider initial="es"><ForgotRoute /></LanguageProvider>,
    { wrapper: HeroUINativeProvider },
  );
}

describe('#117 R3: la ruta forgot delega en ForgotScreen', () => {
  it('renderiza screen-forgot y forgot-form con el título desde la ruta y sin el aviso del stub', async () => {
    mockForgotPassword.mockResolvedValue({ kind: 'ok' });
    await renderRoute();

    expect(screen.getByTestId('screen-forgot')).toBeVisible();
    expect(screen.getByTestId('forgot-form')).toBeVisible();
    expect(screen.getByText('Recuperar contraseña')).toBeVisible();
    expect(screen.queryByText('La recuperación de contraseña estará disponible pronto')).toBeNull();
  });

  it('link-login navega a /login sin petición de red', async () => {
    mockForgotPassword.mockResolvedValue({ kind: 'ok' });
    await renderRoute();
    await fireEvent.press(screen.getByTestId('link-login'));

    expect(mockRouter.push).toHaveBeenCalledWith('/login');
    expect(mockForgotPassword).not.toHaveBeenCalled();
  });

  it('link-login navega a /login también desde «Revisa tu correo», sin petición nueva', async () => {
    mockForgotPassword.mockResolvedValue({ kind: 'ok' });
    await renderRoute();
    await submitForgot();
    expect(await screen.findByText('Revisa tu correo')).toBeVisible();
    await fireEvent.press(screen.getByTestId('link-login'));

    expect(mockRouter.push).toHaveBeenCalledWith('/login');
    expect(mockForgotPassword).toHaveBeenCalledTimes(1);
  });
});

describe('#61 R8: forgot tiene contenedor de scroll con safe areas', () => {
  it('#172 R19: centra en horizontal pero no en vertical dentro de un ScrollView con insets', async () => {
    mockForgotPassword.mockResolvedValue({ kind: 'ok' });
    await renderRoute();
    const screenRoot = screen.getByTestId('forgot-form');

    expect(screenRoot.props.contentContainerStyle).toEqual({
      flexGrow: 1,
      alignItems: 'center',
      padding: 24,
      gap: 16,
      paddingTop: 52,
      paddingBottom: 48,
    });
    expect(screenRoot.props.keyboardShouldPersistTaps).toBe('handled');
    expect(screenRoot.props.contentInsetAdjustmentBehavior).toBe('automatic');
  });
});

describe('#127 R1: el botón de envío de forgot lleva su receta en el árbol', () => {
  it('pinta forgot-submit, deshabilitado, con la clase exacta, rounded-xl y bg-accent incluidos, la vea o no el recorte de fuente', async () => {
    mockForgotPassword.mockResolvedValue({ kind: 'ok' });
    await renderRoute();

    expect(screen.getByTestId('forgot-submit').props.className).toBe(
      'pressable-feedback__root button__root button__root--variant-primary button__root--size-md disabled:element-disabled w-full h-14 rounded-xl bg-accent border-b-4 border-black/25',
    );
  });
});


describe('#117 R4: el formulario pide el correo', () => {
  it('pinta título, instrucciones y forgot-email editable con sus props de teclado', async () => {
    mockForgotPassword.mockResolvedValue({ kind: 'ok' });
    await renderRoute();

    expect(screen.getByTestId('forgot-title')).toHaveTextContent('Recuperar contraseña');
    expect(screen.getByTestId('forgot-body')).toHaveTextContent('Ingresa el correo electrónico asociado a tu cuenta y te enviaremos un enlace para restablecer tu contraseña.');
    expect(screen.getByText('Correo electrónico')).toBeVisible();
    const { props } = screen.getByTestId('forgot-email');
    expect(props.editable).not.toBe(false);
    expect(props.autoCapitalize).toBe('none');
    expect(props.keyboardType).toBe('email-address');
    expect(props.autoComplete).toBe('email');
    expect(props.textContentType).toBe('emailAddress');
    expect(props.placeholder).toBeUndefined();
    await expectFormState('', null);
  });

  it('deshabilita forgot-submit con el correo vacío o solo espacios y lo habilita al escribir', async () => {
    mockForgotPassword.mockResolvedValue({ kind: 'ok' });
    await renderRoute();

    expect(screen.getByTestId('forgot-submit')).toBeDisabled();
    await fireEvent.changeText(screen.getByTestId('forgot-email'), '   ');
    expect(screen.getByTestId('forgot-submit')).toBeDisabled();
    await fireEvent.changeText(screen.getByTestId('forgot-email'), 'ana@example.com');
    expect(screen.getByTestId('forgot-submit')).not.toBeDisabled();
    await fireEvent.changeText(screen.getByTestId('forgot-email'), '');
    expect(screen.getByTestId('forgot-submit')).toBeDisabled();
  });

  it('sin enviar no existen forgot-resend ni forgot-error', async () => {
    mockForgotPassword.mockResolvedValue({ kind: 'ok' });
    await renderRoute();

    expect(screen.queryByTestId('forgot-resend')).toBeNull();
    expect(screen.queryByTestId('forgot-error')).toBeNull();
  });
});


async function submitForgot(email = 'ana@example.com') {
  await fireEvent.changeText(screen.getByTestId('forgot-email'), email);
  await fireEvent.press(screen.getByTestId('forgot-submit'));
}

function lockTile() {
  const siblings = (screen.getByTestId('forgot-title').parent?.children ?? []) as unknown[];
  return siblings.filter((c) => typeof c !== 'string').find(
    (c) => (c as { props: { testID?: string } }).props.testID === 'forgot-lock-tile',
  );
}

function expectForgotError(error: string | null) {
  if (error === null) {
    expect(screen.queryByTestId('forgot-error')).toBeNull();
    return;
  }
  const node = screen.getByTestId('forgot-error');
  expect(node).toHaveTextContent(error);
  expect(node.props.selectable).toBe(true);
}

async function expectLinkLoginNavigates() {
  const requests = mockForgotPassword.mock.calls.length;
  mockRouter.push.mockClear();
  await fireEvent.press(screen.getByTestId('link-login'));
  expect(mockRouter.push).toHaveBeenCalledTimes(1);
  expect(mockRouter.push).toHaveBeenCalledWith('/login');
  expect(mockForgotPassword).toHaveBeenCalledTimes(requests);
}

async function expectFormState(value: string, error: string | null) {
  expect(screen.getByTestId('forgot-title')).toHaveTextContent('Recuperar contraseña');
  expect(screen.getByTestId('forgot-body')).toHaveTextContent('Ingresa el correo electrónico asociado a tu cuenta y te enviaremos un enlace para restablecer tu contraseña.');
  expect(screen.getByText('Correo electrónico')).toBeOnTheScreen();
  expect(screen.getByTestId('forgot-email').props.value).toBe(value);
  expect(screen.getByTestId('forgot-submit')).toBeOnTheScreen();
  expect(screen.queryByTestId('forgot-resend')).toBeNull();
  expect(screen.getByTestId('link-login')).toHaveTextContent('Volver al inicio de sesión');
  expect(lockTile()).toBeDefined();
  expectForgotError(error);
  await expectLinkLoginNavigates();
}

async function expectSentState(email: string, error: string | null) {
  expect(screen.getByTestId('forgot-title')).toHaveTextContent('Revisa tu correo');
  expect(screen.getByTestId('forgot-body')).toHaveTextContent(`Si existe una cuenta para ${email}, te enviamos un enlace para restablecer tu contraseña. Revisa tu bandeja de entrada y la carpeta de spam.`);
  expect(screen.queryByText('Correo electrónico')).toBeNull();
  expect(screen.queryByTestId('forgot-email')).toBeNull();
  expect(screen.queryByTestId('forgot-submit')).toBeNull();
  expect(screen.getByTestId('forgot-resend')).toBeOnTheScreen();
  expect(screen.getByTestId('link-login')).toHaveTextContent('Volver al inicio de sesión');
  expect(lockTile()).toBeDefined();
  expectForgotError(error);
  await expectLinkLoginNavigates();
}

describe('#117 R5: enviar pasa la pantalla a «Revisa tu correo»', () => {
  it('envía el correo recortado una sola vez y deshabilita forgot-submit mientras vuela la petición', async () => {
    let resolveRequest!: (state: ForgotPasswordState) => void;
    mockForgotPassword.mockReturnValue(new Promise((resolve) => { resolveRequest = resolve; }));
    await renderRoute();
    await submitForgot('  Ana@Example.com ');

    await waitFor(() => expect(screen.getByTestId('forgot-submit')).toBeDisabled());
    expect(mockForgotPassword).toHaveBeenCalledTimes(1);
    expect(mockForgotPassword).toHaveBeenCalledWith(apiUrl, { email: 'Ana@Example.com' });
    expect(screen.getByTestId('forgot-email')).toBeVisible();
    await expectFormState('  Ana@Example.com ', null);
    await act(async () => { resolveRequest({ kind: 'ok' }); });
    expect(await screen.findByText('Revisa tu correo')).toBeVisible();
  });

  it('tras ok muestra cabecera y cuerpo con el correo, forgot-resend y link-login, y retira forgot-email y forgot-submit', async () => {
    mockForgotPassword.mockResolvedValue({ kind: 'ok' });
    await renderRoute();
    await submitForgot('  Ana@Example.com ');
    expect(await screen.findByText('Revisa tu correo')).toBeVisible();

    expect(screen.getByTestId('forgot-body')).toHaveTextContent('Si existe una cuenta para Ana@Example.com, te enviamos un enlace para restablecer tu contraseña. Revisa tu bandeja de entrada y la carpeta de spam.');
    expect(screen.queryByTestId('forgot-email')).toBeNull();
    expect(screen.queryByTestId('forgot-submit')).toBeNull();
    expect(screen.getByTestId('forgot-resend')).not.toBeDisabled();
    expect(screen.getByTestId('link-login')).toBeVisible();
    expect(screen.queryByTestId('forgot-error')).toBeNull();
    await expectSentState('Ana@Example.com', null);
  });

  it('el tile Lock sigue en pie en los dos estados', async () => {
    mockForgotPassword.mockResolvedValue({ kind: 'ok' });
    await renderRoute();
    const before = (screen.getByTestId('forgot-title').parent?.children ?? []) as unknown[];

    expect(before.filter((c) => typeof c !== 'string').find(
      (c) => (c as { props: { className?: string } }).props.className === 'size-13 items-center justify-center rounded-xl border-b-4 border-black/25 bg-accent',
    )).toBeDefined();
    await submitForgot();
    expect(await screen.findByText('Revisa tu correo')).toBeVisible();
    const after = (screen.getByTestId('forgot-title').parent?.children ?? []) as unknown[];
    expect(after.filter((c) => typeof c !== 'string').find(
      (c) => (c as { props: { className?: string } }).props.className === 'size-13 items-center justify-center rounded-xl border-b-4 border-black/25 bg-accent',
    )).toBeDefined();
  });
});


describe('#117 R7: cada kind distinto de ok pinta su copy en forgot-error', () => {
  it.each<[ForgotPasswordState, string]>([
    [{ kind: 'validation', errors: [{ path: 'email', message: 'Invalid email' }] }, 'Algo no cuadra en los datos. Revísalos y vuelve a intentarlo.'],
    [{ kind: 'rate-limited' }, 'Demasiados intentos. Inténtalo más tarde.'],
    [{ kind: 'error' }, 'Algo salió mal'],
    [{ kind: 'unreachable', message: 'network down' }, 'No se pudo conectar con el servidor'],
    [{ kind: 'missing-config' }, 'Algo salió mal'],
  ])('mapea %p a «%s» en forgot-error, seleccionable, y deja el formulario en pie', async (state, copy) => {
    mockForgotPassword.mockResolvedValue(state);
    await renderRoute();
    await submitForgot('  Ana@Example.com ');
    const error = await screen.findByTestId('forgot-error');

    expect(error).toHaveTextContent(copy);
    expect(error.props.selectable).toBe(true);
    expect(screen.getByTestId('forgot-title')).toHaveTextContent('Recuperar contraseña');
    expect(screen.getByTestId('forgot-email').props.value).toBe('  Ana@Example.com ');
    await waitFor(() => expect(screen.getByTestId('forgot-submit')).not.toBeDisabled());
    expect(screen.queryByTestId('forgot-resend')).toBeNull();
    await expectFormState('  Ana@Example.com ', copy);
    await fireEvent.changeText(screen.getByTestId('forgot-email'), '   ');
    expect(screen.getByTestId('forgot-submit')).toBeDisabled();
  });

  it('un reintento desde el formulario que vuelve a fallar pinta el copy del nuevo kind', async () => {
    mockForgotPassword
      .mockResolvedValueOnce({ kind: 'error' })
      .mockResolvedValueOnce({ kind: 'rate-limited' })
      .mockResolvedValueOnce({ kind: 'validation', errors: [{ path: 'email', message: 'Invalid email' }] });
    await renderRoute();
    await submitForgot();
    expect(await screen.findByTestId('forgot-error')).toHaveTextContent('Algo salió mal');
    await waitFor(() => expect(screen.getByTestId('forgot-submit')).not.toBeDisabled());
    await fireEvent.press(screen.getByTestId('forgot-submit'));
    await waitFor(() => expect(screen.getByTestId('forgot-error')).toHaveTextContent('Demasiados intentos. Inténtalo más tarde.'));
    await waitFor(() => expect(screen.getByTestId('forgot-submit')).not.toBeDisabled());
    await expectFormState('ana@example.com', 'Demasiados intentos. Inténtalo más tarde.');
    await fireEvent.press(screen.getByTestId('forgot-submit'));
    await waitFor(() => expect(screen.getByTestId('forgot-error')).toHaveTextContent('Algo no cuadra en los datos. Revísalos y vuelve a intentarlo.'));
    await waitFor(() => expect(screen.getByTestId('forgot-submit')).not.toBeDisabled());
    await expectFormState('ana@example.com', 'Algo no cuadra en los datos. Revísalos y vuelve a intentarlo.');
  });

  it('un envío posterior que resuelve ok limpia forgot-error y pasa a «Revisa tu correo»', async () => {
    mockForgotPassword.mockResolvedValueOnce({ kind: 'error' }).mockResolvedValueOnce({ kind: 'ok' });
    await renderRoute();
    await submitForgot();
    expect(await screen.findByTestId('forgot-error')).toHaveTextContent('Algo salió mal');
    await fireEvent.press(screen.getByTestId('forgot-submit'));
    expect(await screen.findByText('Revisa tu correo')).toBeVisible();
    expect(screen.queryByTestId('forgot-error')).toBeNull();
  });

  it('un nuevo envío desde el formulario retira forgot-error en cuanto arranca, antes de resolver', async () => {
    let resolveRequest!: (state: ForgotPasswordState) => void;
    const pending = new Promise<ForgotPasswordState>((resolve) => { resolveRequest = resolve; });
    mockForgotPassword.mockResolvedValueOnce({ kind: 'error' }).mockReturnValueOnce(pending);
    await renderRoute();
    await submitForgot('  Ana@Example.com ');
    expect(await screen.findByTestId('forgot-error')).toHaveTextContent('Algo salió mal');
    await waitFor(() => expect(screen.getByTestId('forgot-submit')).not.toBeDisabled());
    await expectFormState('  Ana@Example.com ', 'Algo salió mal');
    await fireEvent.press(screen.getByTestId('forgot-submit'));

    await waitFor(() => expect(screen.getByTestId('forgot-submit')).toBeDisabled());
    expect(screen.queryByTestId('forgot-error')).toBeNull();
    expect(screen.queryByTestId('forgot-resend')).toBeNull();
    await expectFormState('  Ana@Example.com ', null);
    await act(async () => { resolveRequest({ kind: 'ok' }); });
    expect(await screen.findByText('Revisa tu correo')).toBeVisible();
    expect(screen.queryByTestId('forgot-error')).toBeNull();
    await waitFor(() => expect(screen.getByTestId('forgot-resend')).not.toBeDisabled());
    await expectSentState('Ana@Example.com', null);
  });

  it('un nuevo reenvío retira forgot-error en cuanto arranca y no lo repinta al resolver ok', async () => {
    let resolveRequest!: (state: ForgotPasswordState) => void;
    const pending = new Promise<ForgotPasswordState>((resolve) => { resolveRequest = resolve; });
    mockForgotPassword.mockResolvedValueOnce({ kind: 'ok' }).mockResolvedValueOnce({ kind: 'rate-limited' }).mockReturnValueOnce(pending);
    await renderRoute();
    await submitForgot('  Ana@Example.com ');
    expect(await screen.findByText('Revisa tu correo')).toBeVisible();
    await fireEvent.press(screen.getByTestId('forgot-resend'));
    expect(await screen.findByTestId('forgot-error')).toHaveTextContent('Demasiados intentos. Inténtalo más tarde.');
    await waitFor(() => expect(screen.getByTestId('forgot-resend')).not.toBeDisabled());
    await fireEvent.press(screen.getByTestId('forgot-resend'));

    await waitFor(() => expect(screen.getByTestId('forgot-resend')).toBeDisabled());
    expect(mockForgotPassword.mock.calls[2][1]).toEqual(mockForgotPassword.mock.calls[0][1]);
    expect(screen.queryByTestId('forgot-error')).toBeNull();
    await expectSentState('Ana@Example.com', null);
    await act(async () => { resolveRequest({ kind: 'ok' }); });
    await waitFor(() => expect(screen.getByTestId('forgot-resend')).not.toBeDisabled());
    expect(screen.queryByTestId('forgot-error')).toBeNull();
    expect(screen.getByText('Revisa tu correo')).toBeVisible();
    expect(screen.getByTestId('forgot-body')).toHaveTextContent('Si existe una cuenta para Ana@Example.com, te enviamos un enlace para restablecer tu contraseña. Revisa tu bandeja de entrada y la carpeta de spam.');
    await expectSentState('Ana@Example.com', null);
  });
});


describe('#117 R6: reenviar repite la misma petición', () => {
  it('forgot-resend repite el POST con el mismo correo y se deshabilita mientras vuela', async () => {
    let resolveRequest!: (state: ForgotPasswordState) => void;
    const pending = new Promise<ForgotPasswordState>((resolve) => { resolveRequest = resolve; });
    mockForgotPassword.mockResolvedValueOnce({ kind: 'ok' }).mockReturnValueOnce(pending);
    await renderRoute();
    await submitForgot('  Ana@Example.com ');
    expect(await screen.findByText('Revisa tu correo')).toBeVisible();
    await fireEvent.press(screen.getByTestId('forgot-resend'));

    await waitFor(() => expect(screen.getByTestId('forgot-resend')).toBeDisabled());
    expect(mockForgotPassword).toHaveBeenCalledTimes(2);
    expect(mockForgotPassword.mock.calls[1][1]).toEqual(mockForgotPassword.mock.calls[0][1]);
    await expectSentState('Ana@Example.com', null);
    await act(async () => { resolveRequest({ kind: 'ok' }); });
    await waitFor(() => expect(screen.getByTestId('forgot-resend')).not.toBeDisabled());
    expect(screen.getByText('Revisa tu correo')).toBeVisible();
    await expectSentState('Ana@Example.com', null);
  });

  it('un 429 al reenviar pinta forgot-error sin salir de «Revisa tu correo»', async () => {
    mockForgotPassword.mockResolvedValueOnce({ kind: 'ok' }).mockResolvedValueOnce({ kind: 'rate-limited' });
    await renderRoute();
    await submitForgot();
    expect(await screen.findByText('Revisa tu correo')).toBeVisible();
    await fireEvent.press(screen.getByTestId('forgot-resend'));

    expect(await screen.findByTestId('forgot-error')).toHaveTextContent('Demasiados intentos. Inténtalo más tarde.');
    expect(screen.getByText('Revisa tu correo')).toBeVisible();
    expect(screen.queryByTestId('forgot-email')).toBeNull();
    await waitFor(() => expect(screen.getByTestId('forgot-resend')).not.toBeDisabled());
    await expectSentState('ana@example.com', 'Demasiados intentos. Inténtalo más tarde.');
  });

  it.each<[ForgotPasswordState, string]>([
    [{ kind: 'validation', errors: [{ path: 'email', message: 'Invalid email' }] }, 'Algo no cuadra en los datos. Revísalos y vuelve a intentarlo.'],
    [{ kind: 'error' }, 'Algo salió mal'],
    [{ kind: 'unreachable', message: 'network down' }, 'No se pudo conectar con el servidor'],
    [{ kind: 'missing-config' }, 'Algo salió mal'],
  ])('un %p al reenviar pinta «%s» en forgot-error sin salir de «Revisa tu correo»', async (state, copy) => {
    mockForgotPassword.mockResolvedValueOnce({ kind: 'ok' }).mockResolvedValueOnce(state);
    await renderRoute();
    await submitForgot();
    expect(await screen.findByText('Revisa tu correo')).toBeVisible();
    await fireEvent.press(screen.getByTestId('forgot-resend'));

    expect(await screen.findByTestId('forgot-error')).toHaveTextContent(copy);
    expect(screen.getByText('Revisa tu correo')).toBeVisible();
    expect(screen.queryByTestId('forgot-email')).toBeNull();
    await waitFor(() => expect(screen.getByTestId('forgot-resend')).not.toBeDisabled());
    await expectSentState('ana@example.com', copy);
  });

  it('un segundo reenvío que vuelve a fallar pinta el copy del nuevo kind', async () => {
    mockForgotPassword
      .mockResolvedValueOnce({ kind: 'ok' })
      .mockResolvedValueOnce({ kind: 'rate-limited' })
      .mockResolvedValueOnce({ kind: 'error' })
      .mockResolvedValueOnce({ kind: 'unreachable', message: 'network down' });
    await renderRoute();
    await submitForgot();
    expect(await screen.findByText('Revisa tu correo')).toBeVisible();
    await fireEvent.press(screen.getByTestId('forgot-resend'));
    expect(await screen.findByTestId('forgot-error')).toHaveTextContent('Demasiados intentos. Inténtalo más tarde.');
    await waitFor(() => expect(screen.getByTestId('forgot-resend')).not.toBeDisabled());
    await fireEvent.press(screen.getByTestId('forgot-resend'));
    await waitFor(() => expect(screen.getByTestId('forgot-error')).toHaveTextContent('Algo salió mal'));
    await waitFor(() => expect(screen.getByTestId('forgot-resend')).not.toBeDisabled());
    await expectSentState('ana@example.com', 'Algo salió mal');
    await fireEvent.press(screen.getByTestId('forgot-resend'));
    await waitFor(() => expect(screen.getByTestId('forgot-error')).toHaveTextContent('No se pudo conectar con el servidor'));
    await waitFor(() => expect(screen.getByTestId('forgot-resend')).not.toBeDisabled());
    await expectSentState('ana@example.com', 'No se pudo conectar con el servidor');
  });
});


describe('#117 R8: forgot se aparta del teclado en Android', () => {
  it('el host screen-forgot añade paddingBottom 200 al abrir el teclado', async () => {
    (Platform as { OS: string }).OS = 'android';
    mockForgotPassword.mockResolvedValue({ kind: 'ok' });
    await renderRoute();
    const host = screen.getByTestId('screen-forgot');
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
    await waitFor(() => expect(screen.getByTestId('screen-forgot')).toHaveStyle({ paddingBottom: 200 }));
  });
});


describe('#117 R9: las métricas del stub sobreviven al cambio de estado', () => {
  it('«Revisa tu correo» conserva el mismo contentContainerStyle y keyboardShouldPersistTaps', async () => {
    mockForgotPassword.mockResolvedValue({ kind: 'ok' });
    await renderRoute();
    const before = screen.getByTestId('forgot-form').props.contentContainerStyle;
    await submitForgot();
    expect(await screen.findByText('Revisa tu correo')).toBeVisible();

    expect(screen.getByTestId('forgot-form').props.contentContainerStyle).toEqual(before);
    expect(screen.getByTestId('forgot-form').props.keyboardShouldPersistTaps).toBe('handled');
  });

  it('forgot-form lleva className y contentInsetAdjustmentBehavior de la spec en los dos estados', async () => {
    mockForgotPassword.mockResolvedValue({ kind: 'ok' });
    await renderRoute();

    expect(screen.getByTestId('forgot-form').props.className).toBe('flex-1 bg-background');
    expect(screen.getByTestId('forgot-form').props.contentInsetAdjustmentBehavior).toBe('automatic');
    await submitForgot();
    expect(await screen.findByText('Revisa tu correo')).toBeVisible();
    expect(screen.getByTestId('forgot-form').props.className).toBe('flex-1 bg-background');
    expect(screen.getByTestId('forgot-form').props.contentInsetAdjustmentBehavior).toBe('automatic');
  });
});


describe('#117 R11: la pantalla de éxito es la misma para cualquier correo', () => {
  it('dos correos distintos reciben «Revisa tu correo» con el mismo cuerpo salvo el correo citado', async () => {
    mockForgotPassword.mockResolvedValue({ kind: 'ok' });
    const titles: string[] = [];
    const bodies: string[] = [];
    for (const email of ['existe@example.com', 'nadie-117@example.com']) {
      await renderRoute();
      await submitForgot(email);
      expect(await screen.findByText('Revisa tu correo')).toBeVisible();
      const title = screen.getByTestId('forgot-title').props.children;
      const body = screen.getByTestId('forgot-body').props.children;
      expect(body).toBe(`Si existe una cuenta para ${email}, te enviamos un enlace para restablecer tu contraseña. Revisa tu bandeja de entrada y la carpeta de spam.`);
      titles.push(title);
      bodies.push(body.replace(email, '{{email}}'));
      await screen.unmount();
    }
    expect(titles[0]).toBe('Revisa tu correo');
    expect(titles[1]).toBe(titles[0]);
    expect(bodies[1]).toBe(bodies[0]);
  });
});


function expectPingoBeforeLock() {
  const pingo = screen.getByTestId('forgot-pingo');
  const title = screen.getByTestId('forgot-title');
  expect(pingo.props.source).toEqual([
    expect.objectContaining({ testUri: expect.stringMatching(/pingo-talk\.webp$/) }),
  ]);
  expect(pingo.props.style).toEqual({ width: 120, height: 120, transform: [{ rotate: '6deg' }] });
  expect(pingo.props.accessibilityLabel).toBeUndefined();
  const float = screen.getByTestId('forgot-pingo-float');
  expect(float.parent).toBe(title.parent);
  const siblings = title.parent?.children ?? [];
  expect(siblings.indexOf(float)).toBe(siblings.findIndex((child) => child === lockTile()) - 1);
}

describe('#167 R9: Pingo y pop del candado en recuperar', () => {
  it('#167 R9: Pingo precede al tile del candado en el formulario', async () => {
    await renderRoute();
    expectPingoBeforeLock();
  });

  it('#167 R9: Pingo precede al tile del candado tras enviar', async () => {
    mockForgotPassword.mockResolvedValue({ kind: 'ok' });
    await renderRoute();
    await submitForgot();
    expectPingoBeforeLock();
  });

  it('#167 R9: el tile entra con pop en el formulario', async () => {
    await renderRoute();
    expect(Object.fromEntries(mockPopIn.mock.calls.map(([p]) => [
      p.testID, { className: p.className, style: p.style },
    ]))).toEqual({
      'forgot-lock-tile': {
        className: 'size-13 items-center justify-center rounded-xl border-b-4 border-black/25 bg-accent',
        style: { borderCurve: 'continuous' },
      },
    });
  });

  it('#167 R9: el tile entra con pop tras enviar', async () => {
    mockForgotPassword.mockResolvedValue({ kind: 'ok' });
    await renderRoute();
    mockPopIn.mockClear();
    await submitForgot();
    expect(Object.fromEntries(mockPopIn.mock.calls.map(([p]) => [
      p.testID, { className: p.className, style: p.style },
    ]))).toEqual({
      'forgot-lock-tile': {
        className: 'size-13 items-center justify-center rounded-xl border-b-4 border-black/25 bg-accent',
        style: { borderCurve: 'continuous' },
      },
    });
  });
});


describe('#172 R5: flotación de recuperar', () => {
  it('#172 R5: Pingo de recuperar flota', async () => {
    await renderRoute();
    expect(screen.getByTestId('forgot-pingo').parent)
      .toHaveProperty('props.testID', 'forgot-pingo-float');
  });
});


describe('#172 R3: Volver en recuperar', () => {
  it('#172 R3: la fila Volver encabeza el scroll en los dos estados', async () => {
    mockForgotPassword.mockResolvedValue({ kind: 'ok' });
    await renderRoute();
    const expectTop = () => {
      const top = screen.getByTestId('forgot-top');
      expect(top.parent?.parent).toHaveProperty('props.testID', 'forgot-form');
      expect(top.parent?.children[0]).toBe(top);
      expect(top.children).toEqual([screen.getByTestId('forgot-back')]);
      expect(top.props.className).toBe('w-full');
    };
    expectTop();
    await submitForgot();
    expect(await screen.findByText('Revisa tu correo')).toBeOnTheScreen();
    expectTop();
  });

  it('#172 R3: Volver de recuperar va al login sin historial', async () => {
    mockRouter.canGoBack.mockReturnValue(false);
    await renderRoute();
    await fireEvent.press(screen.getByTestId('forgot-back'));
    expect(mockRouter.replace).toHaveBeenCalledWith('/login');
  });
});


describe('#172 R9: error de recuperar', () => {
  it('#172 R9: el error de recuperar va con icono en su fila', async () => {
    mockForgotPassword.mockResolvedValue({ kind: 'rate-limited' });
    await renderRoute();
    await submitForgot();
    const row = await screen.findByTestId('forgot-error-row');
    expect(row.children).toEqual([
      screen.getByTestId('icon-alert-circle'), screen.getByTestId('forgot-error'),
    ]);
    expect(screen.getByTestId('forgot-error').props.selectable).toBe(true);
  });
});


it('#172 R14: el candado es un tile acento con labio y Lock de 26', async () => {
  mockForgotPassword.mockResolvedValue({ kind: 'ok' });
  await renderRoute();
  function expectTile() {
    const tile = screen.getByTestId('forgot-lock-tile');
    expect(tile.props.className).toBe('size-13 items-center justify-center rounded-xl border-b-4 border-black/25 bg-accent');
    const icon = screen.getByTestId('icon-lock');
    expect(tile.children).toEqual([icon]);
    expect(icon.props.size).toBe(26);
    expect(icon.props.color).toBe('color:accent-foreground');
  }
  expectTile();
  await submitForgot();
  await waitFor(() => expect(screen.getByTestId('forgot-title')).toHaveTextContent('Revisa tu correo'));
  expectTile();
});


it('#172 R19: el espaciador empuja la CTA al pie en los dos estados', async () => {
  mockForgotPassword.mockResolvedValue({ kind: 'ok' });
  await renderRoute();
  function expectSpacer(ctaId: string) {
    const spacer = screen.getByTestId('forgot-spacer');
    const cta = screen.getByTestId(ctaId);
    expect(spacer.parent).toBe(cta.parent);
    expect(spacer.parent).toBe(screen.getByTestId('forgot-top').parent);
    const children = spacer.parent?.children ?? [];
    expect(children.indexOf(spacer)).toBe(children.indexOf(cta) - 1);
    expect(spacer.props.className).toBe('flex-1');
    expect(spacer.children).toHaveLength(0);
  }
  expectSpacer('forgot-submit');
  await submitForgot();
  await waitFor(() => expect(screen.getByTestId('forgot-title')).toHaveTextContent('Revisa tu correo'));
  expectSpacer('forgot-resend');
});

describe('#183 R5: recuperar valida en cliente', () => {
  it.each<[string, string]>([
    ['alex.example.com', 'Ingresa un correo electrónico válido'],
    ['alex@example.c', 'Ingresa un correo electrónico válido'],
    ['ñu@example.com', 'Ingresa un correo electrónico válido'],
    ['a'.repeat(309) + '@example.com', 'Usa 320 caracteres o menos'],
  ])('#183 R5: «%s» no llama a la API y marca forgot-email con «%s»', async (email, message) => {
    mockForgotPassword.mockResolvedValue({ kind: 'error' });
    await renderRoute();
    await submitForgot(email);
    await waitFor(() => expect(screen.getByTestId('forgot-email-message')).toHaveTextContent(message));
    const text = screen.getByTestId('forgot-email-message');
    const row = screen.getByTestId('forgot-email-message-row');
    expect(row.children).toEqual([within(row).getByTestId('icon-alert-circle'), text]);
    expect(text.props.selectable).toBe(true);
    expect(screen.queryByTestId('forgot-error')).toBeNull();
    expect(screen.getByTestId('forgot-title')).toHaveTextContent('Recuperar contraseña');
    expect(screen.getByTestId('forgot-submit')).not.toBeDisabled();
    expect(mockForgotPassword).not.toHaveBeenCalled();
  });

  it('#183 R5: un correo de 320 caracteres pasa como en el DTO y llama a la API', async () => {
    mockForgotPassword.mockResolvedValue({ kind: 'ok' });
    await renderRoute();
    const email = 'a'.repeat(308) + '@example.com';
    await submitForgot(email);
    expect(await screen.findByText('Revisa tu correo')).toBeVisible();
    expect(mockForgotPassword).toHaveBeenCalledWith(apiUrl, { email });
  });

  it('#183 R5: corregir el correo quita el mensaje y envía el recortado', async () => {
    mockForgotPassword.mockResolvedValue({ kind: 'error' });
    await renderRoute();
    await submitForgot('alex.example.com');
    await waitFor(() => expect(screen.getByTestId('forgot-email-message')).toHaveTextContent('Ingresa un correo electrónico válido'));
    mockForgotPassword.mockResolvedValue({ kind: 'ok' });
    await submitForgot('  Ana@Example.com ');
    expect(await screen.findByText('Revisa tu correo')).toBeVisible();
    expect(screen.queryByTestId('forgot-email-message')).toBeNull();
    expect(mockForgotPassword).toHaveBeenCalledTimes(1);
    expect(mockForgotPassword).toHaveBeenCalledWith(apiUrl, { email: 'Ana@Example.com' });
  });
});
