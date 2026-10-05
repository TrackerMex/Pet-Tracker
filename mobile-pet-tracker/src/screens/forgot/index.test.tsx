import { fireEvent, render, screen } from '@testing-library/react-native';
import { router } from 'expo-router';
import { HeroUINativeProvider } from 'heroui-native';

import { forgotPassword } from '../../api/auth';
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
