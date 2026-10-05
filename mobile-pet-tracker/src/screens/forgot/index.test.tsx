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

const apiUrl = 'http://api.test/v1';
const originalApiUrl = process.env.EXPO_PUBLIC_API_URL;
const mockForgotPassword = jest.mocked(forgotPassword);
const mockRouter = jest.mocked(router);

beforeEach(() => {
  jest.resetAllMocks();
  process.env.EXPO_PUBLIC_API_URL = apiUrl;
});

afterEach(() => {
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
});
