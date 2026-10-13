import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react-native';
import { router } from 'expo-router';
import { HeroUINativeProvider } from 'heroui-native';
import type { ReactNode } from 'react';
import { DeviceEventEmitter, Platform } from 'react-native';

import { login, type LoginState } from '../../api/auth';
import { useAuth, type AuthContextValue } from '../../providers/auth-provider';
import { LanguageProvider } from '../../providers/language-provider';
import LoginRoute from '../../app/(auth)/login';

const mockHomeEntrance = jest.fn<void, [import('react-native').ViewProps & { index: number }]>();

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

jest.mock('reicon-react-native', () => {
  const actual = jest.requireActual<typeof import('reicon-react-native')>('reicon-react-native');
  const React = jest.requireActual<typeof import('react')>('react');
  const { View } = jest.requireActual<typeof import('react-native')>('react-native');
  const mockIcon = (testID: string) =>
    function MockIcon(props: Record<string, unknown>) {
      return React.createElement(View, { testID, ...props });
    };
  return { ...actual, AlertCircle: mockIcon('icon-alert-circle') };
});

jest.mock('../../theme/use-theme-colors', () => ({
  useThemeColors: (tokens: string[]) => tokens.map((token) => `color:${token}`),
}));

jest.mock('../../api/auth', () => ({
  login: jest.fn(),
}));

jest.mock('../../providers/auth-provider', () => ({
  useAuth: jest.fn(),
}));

jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    canGoBack: jest.fn(),
  },
}));

jest.mock('react-native-safe-area-context', () => ({
  ...jest.requireActual('react-native-safe-area-context'),
  useSafeAreaInsets: () => ({ top: 40, right: 0, bottom: 24, left: 0 }),
}));

const apiUrl = 'http://example.test/v1';
const originalOS = Platform.OS;
const mockLogin = jest.mocked(login);
const mockUseAuth = jest.mocked(useAuth);
const mockSignIn = jest.fn<Promise<void>, [string]>();
const mockRouter = jest.mocked(router);

function AuthScreenWrapper({ children }: { children: ReactNode }) {
  return (
    <HeroUINativeProvider>
      <LanguageProvider initial="es">{children}</LanguageProvider>
    </HeroUINativeProvider>
  );
}

async function renderLogin() {
  await render(<LoginRoute />, { wrapper: AuthScreenWrapper });
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
    [{ kind: 'invalid-credentials' }, 'Credenciales inválidas'],
    [
      { kind: 'unreachable', message: 'network down' },
      'No se pudo conectar con el servidor',
    ],
    [{ kind: 'error' }, 'Algo salió mal'],
    [{ kind: 'missing-config' }, 'Algo salió mal'],
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

describe('#61 R8: login tiene contenedor de scroll con safe areas', () => {
  it('centra el contenido dentro de un ScrollView con los insets aplicados', async () => {
    await renderLogin();

    const screenRoot = screen.getByTestId('login-form');

    expect(screenRoot.props.contentContainerStyle).toEqual({
      flexGrow: 1,
      justifyContent: 'center',
      padding: 24,
      gap: 16,
      paddingTop: 52,
      paddingBottom: 48,
    });
    expect(screenRoot.props.keyboardShouldPersistTaps).toBe('handled');
    expect(screenRoot.props.contentInsetAdjustmentBehavior).toBe('automatic');
  });

  it('no centra horizontalmente, que no lo hacía el View de hoy', async () => {
    await renderLogin();

    expect(
      screen.getByTestId('login-form').props.contentContainerStyle,
    ).not.toHaveProperty('alignItems');
  });
});

describe('#127 R1: el botón de envío de login lleva su receta en el árbol', () => {
  beforeEach(() => {
    mockUseAuth.mockReturnValue({
      status: 'unauthenticated',
      token: null,
      signIn: mockSignIn,
      signOut: jest.fn(),
    } satisfies AuthContextValue);
  });

  it('pinta login-submit con la clase exacta, rounded-xl y bg-accent incluidos, la vea o no el recorte de fuente', async () => {
    await renderLogin();

    expect(screen.getByTestId('login-submit').props.className).toBe(
      'pressable-feedback__root button__root button__root--variant-primary button__root--size-md w-full rounded-xl bg-accent border-b-4 border-black/25',
    );
  });
});

describe('#148 R1: login se aparta del teclado en Android', () => {
  afterEach(() => {
    (Platform as { OS: string }).OS = originalOS;
  });

  it('el host screen-login añade paddingBottom 200 al abrir el teclado', async () => {
    (Platform as { OS: string }).OS = 'android';
    await renderLogin();

    const host = screen.getByTestId('screen-login');
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
    await waitFor(() => expect(screen.getByTestId('screen-login')).toHaveStyle({ paddingBottom: 200 }));
  });
});

describe('#167 R6: Pingo saluda en login y la pantalla entra en dos tiempos', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.EXPO_PUBLIC_API_URL = apiUrl;
    mockUseAuth.mockReturnValue({
      status: 'unauthenticated', token: null, signIn: mockSignIn, signOut: jest.fn(),
    } satisfies AuthContextValue);
  });

  it('#167 R6: entra en dos tiempos, cabecera y cuerpo', async () => {
    await renderLogin();
    expect(Object.fromEntries(mockHomeEntrance.mock.calls.map(([p]) => [
      p.testID, { index: p.index, className: p.className },
    ]))).toEqual({
      'login-header': { index: 0, className: 'gap-4' },
      'login-body': { index: 1, className: 'gap-4' },
    });
  });

  it('#172 R3: la cabecera lleva Volver, el saludo y el título', async () => {
    await renderLogin();
    const header = screen.getByTestId('login-header');
    expect(header.children).toHaveLength(3);
    expect(header.children[0]).toHaveProperty('props.testID', 'login-back');
    expect(header.children[1]).toHaveProperty('props.testID', 'login-greeting');
    expect(header.children[2]).toBe(within(header).getByText('Iniciar sesión'));
  });

  it('#172 R3: Volver de login vuelve a la bienvenida sin historial', async () => {
    mockRouter.canGoBack.mockReturnValue(false);
    await renderLogin();
    await fireEvent.press(screen.getByTestId('login-back'));
    expect(mockRouter.replace).toHaveBeenCalledWith('/welcome');
  });

  it('#172 R7: el cuerpo lleva correo, contraseña, olvido, envío y registro', async () => {
    mockLogin.mockResolvedValue({ kind: 'invalid-credentials' });
    await renderLogin();
    const body = screen.getByTestId('login-body');
    expect(within(body).getAllByTestId(/^(login-email|login-password|login-submit|link-register|link-forgot)$/)
      .map((node) => node.props.testID)).toEqual([
      'login-email', 'login-password', 'link-forgot', 'login-submit', 'link-register',
    ]);
    await submit();
    expect(within(body).getByTestId('login-error')).toBeOnTheScreen();
  });

  it('#172 R7: con error, el error va entre el olvido y el envío', async () => {
    mockLogin.mockResolvedValue({ kind: 'invalid-credentials' });
    await renderLogin();
    await submit();
    const body = screen.getByTestId('login-body');
    expect(within(body).getAllByTestId(/^(login-email|login-password|login-error|login-submit|link-register|link-forgot)$/)
      .map((node) => node.props.testID)).toEqual([
      'login-email', 'login-password', 'link-forgot', 'login-error', 'login-submit', 'link-register',
    ]);
  });

  it('#172 R9: el error de login va con icono en su fila', async () => {
    mockLogin.mockResolvedValue({ kind: 'invalid-credentials' });
    await renderLogin();
    await submit();
    const row = await screen.findByTestId('login-error-row');
    expect(row.children).toEqual([
      screen.getByTestId('icon-alert-circle'), screen.getByTestId('login-error'),
    ]);
    expect(screen.getByTestId('login-error').props.selectable).toBe(true);
  });

  it('#172 R7: sin error, el cuerpo no lleva el error', async () => {
    await renderLogin();
    const body = screen.getByTestId('login-body');
    expect(within(body).getAllByTestId(/^(login-email|login-password|login-error|login-submit|link-register|link-forgot)$/)
      .map((node) => node.props.testID)).toEqual([
      'login-email', 'login-password', 'link-forgot', 'login-submit', 'link-register',
    ]);
  });

  it('#167 R6: la cabecera va antes que el cuerpo en el scroll', async () => {
    await renderLogin();
    const header = screen.getByTestId('login-header');
    expect(header.parent?.parent).toHaveProperty('props.testID', 'login-form');
    expect(header.parent?.children).toEqual([header, screen.getByTestId('login-body')]);
  });

  it('#172 R6: el título de la cabecera pesa 30/900 al inicio', async () => {
    await renderLogin();
    expect(within(screen.getByTestId('login-header')).getByText('Iniciar sesión').props.className)
      .toBe('text-3xl font-black text-foreground');
  });

  it('#167 R6: la cabecera y el cuerpo no se mezclan', async () => {
    await renderLogin();
    const header = screen.getByTestId('login-header');
    const body = screen.getByTestId('login-body');
    for (const id of ['login-email', 'login-password', 'login-submit', 'link-register', 'link-forgot']) {
      expect(within(header).queryByTestId(id)).toBeNull();
    }
    expect(within(body).queryByTestId('login-greeting')).toBeNull();
    expect(within(body).queryAllByText('Iniciar sesión')).not.toContain(within(header).getByText('Iniciar sesión'));
  });

  it('#167 R6: el saludo pone a Pingo junto a su burbuja', async () => {
    await renderLogin();
    const greeting = screen.getByTestId('login-greeting');
    expect(greeting.props.className).toBe('flex-row items-center gap-3');
    expect(greeting.children.map((child) => typeof child === 'string' ? child : child.props.testID))
      .toEqual(['login-pingo', 'login-bubble']);
  });

  it('#167 R6: Pingo saluda con la pose de la mano', async () => {
    await renderLogin();
    const pingo = screen.getByTestId('login-pingo');
    expect(pingo.props.source).toEqual([
      expect.objectContaining({ testUri: expect.stringMatching(/pingo-wave\.webp$/) }),
    ]);
    expect(pingo.props.style).toEqual({ width: 88, height: 88, transform: [{ rotate: '-8deg' }] });
    expect(pingo.props.accessibilityLabel).toBeUndefined();
  });

  it('#167 R6: la burbuja es una card secondary que ocupa el resto', async () => {
    await renderLogin();
    expect(screen.getByTestId('login-bubble').props.className.split(' ')).toEqual(
      expect.arrayContaining(['rounded-card', 'bg-surface-secondary', 'flex-1', 'px-4', 'py-3']),
    );
  });

  it('#167 R6: la burbuja dice el saludo en español', async () => {
    await renderLogin();
    const bubble = screen.getByTestId('login-bubble');
    const text = screen.getByTestId('login-bubble-text');
    expect(bubble.children).toEqual([text]);
    expect(text.props.className).toBe('text-15 font-semibold text-foreground');
    expect(text).toHaveTextContent('Qué bueno verte de nuevo.');
  });

  it('#167 R6: la burbuja dice el saludo en inglés', async () => {
    await render(
      <HeroUINativeProvider><LanguageProvider initial="en"><LoginRoute /></LanguageProvider></HeroUINativeProvider>,
    );
    expect(screen.getByTestId('login-bubble-text')).toHaveTextContent('Good to see you again.');
  });
});
