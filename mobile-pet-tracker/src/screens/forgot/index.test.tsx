import { DeviceEventEmitter, Platform } from 'react-native';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { router } from 'expo-router';
import { HeroUINativeProvider } from 'heroui-native';

import { forgotPassword, type ForgotPasswordState } from '../../api/auth';
import ForgotRoute from '../../app/(auth)/forgot';
import { LanguageProvider } from '../../providers/language-provider';

jest.mock('../../api/auth', () => ({
  forgotPassword: jest.fn(),
}));

jest.mock('expo-router', () => ({
  router: { push: jest.fn() },
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
  it('conserva el centrado de hoy dentro de un ScrollView con insets', async () => {
    mockForgotPassword.mockResolvedValue({ kind: 'ok' });
    await renderRoute();
    const screenRoot = screen.getByTestId('forgot-form');

    expect(screenRoot.props.contentContainerStyle).toEqual({
      flexGrow: 1,
      justifyContent: 'center',
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
      'pressable-feedback__root button__root button__root--variant-primary button__root--size-md disabled:element-disabled w-full rounded-xl bg-accent',
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
  });

  it('el tile Lock sigue en pie en los dos estados', async () => {
    mockForgotPassword.mockResolvedValue({ kind: 'ok' });
    await renderRoute();
    const before = (screen.getByTestId('forgot-title').parent?.children ?? []) as unknown[];

    expect(before.filter((c) => typeof c !== 'string').find(
      (c) => (c as { props: { className?: string } }).props.className === 'size-16 items-center justify-center rounded-xl bg-accent-soft',
    )).toBeDefined();
    await submitForgot();
    expect(await screen.findByText('Revisa tu correo')).toBeVisible();
    const after = (screen.getByTestId('forgot-title').parent?.children ?? []) as unknown[];
    expect(after.filter((c) => typeof c !== 'string').find(
      (c) => (c as { props: { className?: string } }).props.className === 'size-16 items-center justify-center rounded-xl bg-accent-soft',
    )).toBeDefined();
  });
});


describe('#117 R7: cada kind distinto de ok pinta su copy en forgot-error', () => {
  it.each<[ForgotPasswordState, string]>([
    [{ kind: 'validation', errors: [{ path: 'email', message: 'Invalid email' }] }, 'Ingresa un correo electrónico válido'],
    [{ kind: 'rate-limited' }, 'Demasiados intentos. Inténtalo más tarde.'],
    [{ kind: 'error' }, 'Algo salió mal'],
    [{ kind: 'unreachable', message: 'network down' }, 'No se pudo conectar con el servidor'],
    [{ kind: 'missing-config' }, 'Algo salió mal'],
  ])('mapea %p a «%s» en forgot-error, seleccionable, y deja el formulario en pie', async (state, copy) => {
    mockForgotPassword.mockResolvedValue(state);
    await renderRoute();
    await submitForgot();
    const error = await screen.findByTestId('forgot-error');

    expect(error).toHaveTextContent(copy);
    expect(error.props.selectable).toBe(true);
    expect(screen.getByTestId('forgot-title')).toHaveTextContent('Recuperar contraseña');
    expect(screen.getByTestId('forgot-email').props.value).toBe('ana@example.com');
    await waitFor(() => expect(screen.getByTestId('forgot-submit')).not.toBeDisabled());
    expect(screen.queryByTestId('forgot-resend')).toBeNull();
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
    await submitForgot();
    expect(await screen.findByTestId('forgot-error')).toHaveTextContent('Algo salió mal');
    await waitFor(() => expect(screen.getByTestId('forgot-submit')).not.toBeDisabled());
    await fireEvent.press(screen.getByTestId('forgot-submit'));

    await waitFor(() => expect(screen.getByTestId('forgot-submit')).toBeDisabled());
    expect(screen.queryByTestId('forgot-error')).toBeNull();
    expect(screen.queryByTestId('forgot-resend')).toBeNull();
    await act(async () => { resolveRequest({ kind: 'ok' }); });
    expect(await screen.findByText('Revisa tu correo')).toBeVisible();
    expect(screen.queryByTestId('forgot-error')).toBeNull();
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
    await act(async () => { resolveRequest({ kind: 'ok' }); });
    await waitFor(() => expect(screen.getByTestId('forgot-resend')).not.toBeDisabled());
    expect(screen.queryByTestId('forgot-error')).toBeNull();
    expect(screen.getByText('Revisa tu correo')).toBeVisible();
    expect(screen.getByTestId('forgot-body')).toHaveTextContent('Si existe una cuenta para Ana@Example.com, te enviamos un enlace para restablecer tu contraseña. Revisa tu bandeja de entrada y la carpeta de spam.');
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
    await act(async () => { resolveRequest({ kind: 'ok' }); });
    await waitFor(() => expect(screen.getByTestId('forgot-resend')).not.toBeDisabled());
    expect(screen.getByText('Revisa tu correo')).toBeVisible();
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
  });

  it.each<[ForgotPasswordState, string]>([
    [{ kind: 'validation', errors: [{ path: 'email', message: 'Invalid email' }] }, 'Ingresa un correo electrónico válido'],
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
