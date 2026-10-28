import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react-native';
import { router } from 'expo-router';
import { HeroUINativeProvider } from 'heroui-native';
import type { ReactNode } from 'react';
import { DeviceEventEmitter, Platform, StyleSheet } from 'react-native';
import type { TestInstance } from 'test-renderer';

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
  return { ...actual, Eye: mockIcon('icon-eye'), EyeOff: mockIcon('icon-eye-off'), AlertCircle: mockIcon('icon-alert-circle') };
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

  it('#187 R3: el botón login-submit pinta su etiqueta a 17 px', async () => {
      await renderLogin();
      expect(within(screen.getByTestId('login-submit')).getByText('Iniciar sesión').props.className)
        .toBe('text-17 font-extrabold text-accent-foreground');
  });

  it.each(['Correo electrónico', 'Contraseña'])(
    '#187 R2: la etiqueta "%s" de login pinta 13 px', async (label) => {
      await renderLogin();
      expect(screen.getByText(label).props.className).toBe('text-13 font-semibold text-muted');
    },
  );

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

  it('#183 R7: un 400 de validación pinta el aviso genérico y nunca el texto del servidor', async () => {
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
    expect(error).toHaveTextContent('Algo no cuadra en los datos. Revísalos y vuelve a intentarlo.');
    expect(error).not.toHaveTextContent('Invalid email address');
    expect(error).not.toHaveTextContent('Password is too short');
    expect(screen.queryAllByTestId(/^login-.+-message-row$/)).toHaveLength(0);
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
  it('#172 R19: ancla el contenido al pie dentro de un ScrollView con los insets aplicados (enmendado por #205 R8)', async () => {
    await renderLogin();

    const screenRoot = screen.getByTestId('login-form');

    expect(screenRoot.props.contentContainerStyle).toEqual({
      flexGrow: 1,
      paddingHorizontal: 20, // #205 R8
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

    expect(screen.getByTestId('login-submit').props.className).toContain(
      'w-full h-14 rounded-16 bg-accent',
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

  it('#167 R6: entra en dos tiempos, cabecera y cuerpo (enmendado por #205 R8)', async () => {
    await renderLogin();
    expect(mockHomeEntrance).not.toHaveBeenCalled(); // #205 R8
    for (const testID of ['login-header', 'login-body', 'login-actions']) { // #205 R8
      expect(typeof screen.getByTestId(testID).props.entering).toBe('function');
    }
    expect(screen.getByTestId('login-header').props.className).toBeUndefined();
    expect(screen.getByTestId('login-body').props.className).toBe('mt-6 gap-4');
    expect(screen.getByTestId('login-actions').props.className).toBe('gap-3.5');
  });

  it('#172 R3: la cabecera lleva Volver, el saludo y el título (enmendado por #205 R8)', async () => {
    await renderLogin();
    const header = screen.getByTestId('login-header');
    expect(header.children).toHaveLength(2); // #205 R8
    expect(header.children[0]).toHaveProperty('props.testID', 'login-top'); // #205 R8
    expect(header.children[1]).toHaveProperty('props.testID', 'login-greeting');
    expect((header.children[0] as TestInstance).children).toEqual([screen.getByTestId('login-back')]); // #205 R8
    const title = screen.getByTestId('login-title'); // #205 R8
    expect(title.parent).toBe(header.parent); // #205 R8
    expect(title).toHaveTextContent('Iniciar sesión'); // #205 R8
  });

  it('#172 R3: Volver de login vuelve a la bienvenida sin historial', async () => {
    mockRouter.canGoBack.mockReturnValue(false);
    await renderLogin();
    await fireEvent.press(screen.getByTestId('login-back'));
    expect(mockRouter.replace).toHaveBeenCalledWith('/welcome');
  });

  it('#172 R7: el cuerpo lleva correo, contraseña, olvido, envío y registro (enmendado por #205 R8)', async () => {
    mockLogin.mockResolvedValue({ kind: 'invalid-credentials' });
    await renderLogin();
    const body = screen.getByTestId('login-body');
    const actions = screen.getByTestId('login-actions'); // #205 R8
    expect(within(body).getAllByTestId(/^(login-email|login-password|login-submit|link-register|link-forgot)$/)
      .map((node) => node.props.testID)).toEqual([
      'login-email', 'login-password', 'link-forgot', // #205 R8
    ]);
    expect(within(actions).getAllByTestId(/^(login-email|login-password|login-submit|link-register|link-forgot)$/)
      .map((node) => node.props.testID)).toEqual(['login-submit', 'link-register']); // #205 R8
    await submit();
    expect(within(body).getByTestId('login-error')).toBeOnTheScreen();
  });

  it('#172 R7: con error, el error va entre el olvido y el envío (enmendado por #205 R8)', async () => {
    mockLogin.mockResolvedValue({ kind: 'invalid-credentials' });
    await renderLogin();
    await submit();
    const ids = /^(login-email|login-password|login-error|login-submit|link-register|link-forgot)$/;
    expect(within(screen.getByTestId('login-body')).getAllByTestId(ids)
      .map((node) => node.props.testID)).toEqual([
      'login-email', 'login-password', 'link-forgot', 'login-error', // #205 R8
    ]);
    expect(within(screen.getByTestId('login-actions')).getAllByTestId(ids)
      .map((node) => node.props.testID)).toEqual(['login-submit', 'link-register']); // #205 R8
  });

  it('#172 R19: el espaciador empuja el envío al pie (enmendado por #205 R8)', async () => {
    mockLogin.mockResolvedValue({ kind: 'invalid-credentials' });
    await renderLogin();
    function expectSpacer(withError = false) {
      const spacer = screen.getByTestId('login-spacer');
      const cta = screen.getByTestId('login-submit');
      const actions = screen.getByTestId('login-actions'); // #205 R8
      expect(cta.parent).toBe(actions); // #205 R8
      expect(spacer.parent).toBe(actions.parent); // #205 R8
      expect(spacer.parent).toBe(screen.getByTestId('login-body').parent); // #205 R8
      const children = spacer.parent?.children ?? [];
      const index = children.indexOf(spacer);
      expect(index).toBe(children.indexOf(actions) - 1); // #205 R8
      expect(children.indexOf(screen.getByTestId('login-body'))).toBe(index - 1); // #205 R8
      expect(spacer.props.className).toBe('flex-1');
      expect(spacer.children).toHaveLength(0);
      if (withError) {
        expect(within(screen.getByTestId('login-body')).getByTestId('login-error-row')).toBeOnTheScreen(); // #205 R8
      }
    }
    expectSpacer();
    await submit();
    expectSpacer(true);
  });

  it('#172 R15: el error cuelga del scroll y no del contenedor del teclado', async () => {
    mockLogin.mockResolvedValue({ kind: 'invalid-credentials' });
    await renderLogin();
    await submit();
    const form = screen.getByTestId('login-form');
    expect(within(form).getByTestId('login-error')).toBeOnTheScreen();
    expect(screen.getByTestId('screen-login').children).toEqual([form]);
  });

  it('#172 R8: la contraseña de login lleva su ojo', async () => {
    await renderLogin();
    const input = screen.getByTestId('login-password');
    expect(input.props.secureTextEntry).toBe(true);
    const toggle = screen.getByTestId('login-password-toggle');
    expect(toggle.props.accessibilityLabel).toBe('Mostrar contraseña');
    const group = screen.getByTestId('login-password-group');
    expect(group).toContainElement(input);
    expect(group).toContainElement(toggle);
    await fireEvent.press(toggle);
    expect(screen.getByTestId('login-password').props.secureTextEntry).toBe(false);
    expect(screen.getByTestId('login-password-toggle').props.accessibilityLabel).toBe('Ocultar contraseña');
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

  it('#172 R7: sin error, el cuerpo no lleva el error (enmendado por #205 R8)', async () => {
    await renderLogin();
    const body = screen.getByTestId('login-body');
    expect(within(body).getAllByTestId(/^(login-email|login-password|login-error|login-submit|link-register|link-forgot)$/)
      .map((node) => node.props.testID)).toEqual([
      'login-email', 'login-password', 'link-forgot', // #205 R8
    ]);
  });

  it('#167 R6: la cabecera va antes que el cuerpo en el scroll (enmendado por #205 R8)', async () => {
    await renderLogin();
    const header = screen.getByTestId('login-header');
    expect(header.parent?.parent).toHaveProperty('props.testID', 'login-form');
    expect(header.parent?.children).toEqual([ // #205 R8
      header, screen.getByTestId('login-title'), screen.getByTestId('login-body'),
      screen.getByTestId('login-spacer'), screen.getByTestId('login-actions'),
    ]);
  });

  it('#172 R6: el título de la cabecera pesa 30/900 al inicio (enmendado por #205 R8)', async () => {
    await renderLogin();
    expect(screen.getByTestId('login-title').props.className) // #205 R8
      .toBe('mt-5 text-3xl font-black tracking-display text-foreground'); // #205 R8
  });

  it('#167 R6: la cabecera y el cuerpo no se mezclan (enmendado por #205 R8)', async () => {
    await renderLogin();
    const header = screen.getByTestId('login-header');
    const body = screen.getByTestId('login-body');
    for (const id of ['login-email', 'login-password', 'login-submit', 'link-register', 'link-forgot']) {
      expect(within(header).queryByTestId(id)).toBeNull();
    }
    expect(within(body).queryByTestId('login-greeting')).toBeNull();
    const title = screen.getByTestId('login-title'); // #205 R8
    expect(within(header).queryByTestId('login-title')).toBeNull(); // #205 R8
    expect(within(body).queryByTestId('login-title')).toBeNull(); // #205 R8
    expect(within(body).queryAllByText('Iniciar sesión')).not.toContain(title); // #205 R8
  });

  it('#167 R6: el saludo pone a Pingo junto a su burbuja (enmendado por #205 R8)', async () => {
    await renderLogin();
    const greeting = screen.getByTestId('login-greeting');
    expect(greeting.props.className).toBe('mt-2 flex-row items-end gap-3'); // #205 R8
    expect(greeting.children.map((child) => typeof child === 'string' ? child : child.props.testID))
      .toEqual(['login-pingo', 'login-bubble']);
  });

  it('#167 R6: Pingo saluda con la pose de la mano', async () => {
    await renderLogin();
    const pingo = screen.getByTestId('login-pingo');
    expect(pingo.props.source).toEqual([
      expect.objectContaining({ testUri: expect.stringMatching(/orbit-wave\.webp$/) }),
    ]);
    expect(pingo.props.style).toEqual({ width: 88, height: 88, transform: [{ rotate: '-8deg' }] });
    expect(pingo.props.accessibilityLabel).toBeUndefined();
  });

  it('#167 R6: la burbuja es una card secondary que ocupa el resto (enmendado por #205 R8)', async () => {
    await renderLogin();
    expect(screen.getByTestId('login-bubble').props.className.split(' ')).toEqual( // #205 R8
      expect.arrayContaining(['bg-surface-secondary', 'flex-1', 'px-3.5', 'py-2.5']),
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

describe('#205 R8: Login como el artboard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.EXPO_PUBLIC_API_URL = apiUrl;
    mockUseAuth.mockReturnValue({
      status: 'unauthenticated', token: null, signIn: mockSignIn, signOut: jest.fn(),
    } satisfies AuthContextValue);
  });

  it('#205 R8: el scroll apila cabecera, título, cuerpo, espaciador y acciones', async () => {
    await renderLogin();
    const form = screen.getByTestId('login-form');
    expect(form.props.contentContainerStyle).toEqual({
      flexGrow: 1, paddingHorizontal: 20, paddingTop: 52, paddingBottom: 48,
    });
    const content = screen.getByTestId('login-header').parent as TestInstance;
    expect(content.parent).toBe(form);
    expect((content.children as TestInstance[]).map((child) => child.props.testID)).toEqual([
      'login-header', 'login-title', 'login-body', 'login-spacer', 'login-actions',
    ]);
    expect(mockHomeEntrance).not.toHaveBeenCalled();
    for (const testID of ['login-header', 'login-body', 'login-actions']) {
      expect(typeof screen.getByTestId(testID).props.entering).toBe('function');
    }
    expect(screen.getByTestId('login-header').props.className).toBeUndefined();
    expect(screen.getByTestId('login-body').props.className).toBe('mt-6 gap-4');
    expect(screen.getByTestId('login-actions').props.className).toBe('gap-3.5');
    expect(screen.getByTestId('login-top').props.className).toBe('-ml-2.5 flex-row');
    expect((screen.getByTestId('login-top').children as TestInstance[]).map((child) => child.props.testID))
      .toEqual(['login-back']);
    expect((screen.getByTestId('login-actions').children as TestInstance[]).map((child) => child.props.testID))
      .toEqual(['login-submit', 'link-register']);
    expect(screen.getByTestId('login-title').props.className)
      .toBe('mt-5 text-3xl font-black tracking-display text-foreground');
    expect(screen.getByTestId('login-title')).toHaveTextContent('Iniciar sesión');
  });

  it('#205 R8: la burbuja es una vista con el pico abajo a la izquierda', async () => {
    await renderLogin();
    const bubble = screen.getByTestId('login-bubble');
    expect(bubble.props.className).toBe(
      'mb-4.5 flex-1 rounded-tl-16 rounded-tr-16 rounded-br-16 rounded-bl-4 bg-surface-secondary px-3.5 py-2.5',
    );
    expect(StyleSheet.flatten(bubble.props.style)).toEqual({ borderCurve: 'continuous' });
    expect(bubble.children).toEqual([screen.getByTestId('login-bubble-text')]);
    expect(screen.getByTestId('login-bubble-text').props.className).toBe('text-15 font-semibold text-foreground');
  });

  it('#205 R8: Pingo mide 88 y gira -8 grados', async () => {
    await renderLogin();
    const greeting = screen.getByTestId('login-greeting');
    const pingo = screen.getByTestId('login-pingo');
    expect(pingo.props.style).toEqual({ width: 88, height: 88, transform: [{ rotate: '-8deg' }] });
    expect(greeting.props.className).toBe('mt-2 flex-row items-end gap-3');
    expect(greeting.children[0]).toBe(pingo);
  });
});

describe('#183 R3: login valida en cliente', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.EXPO_PUBLIC_API_URL = apiUrl;
    mockSignIn.mockResolvedValue();
    mockUseAuth.mockReturnValue({
      status: 'unauthenticated', token: null, signIn: mockSignIn, signOut: jest.fn(),
    } satisfies AuthContextValue);
    mockLogin.mockResolvedValue({ kind: 'error' });
  });

  async function expectField(field: 'email' | 'password', message: string) {
    await waitFor(() => expect(screen.getByTestId(`login-${field}-message`)).toHaveTextContent(message));
    const text = screen.getByTestId(`login-${field}-message`);
    const row = screen.getByTestId(`login-${field}-message-row`);
    expect(row.children).toEqual([within(row).getByTestId('icon-alert-circle'), text]);
    expect(text.props.selectable).toBe(true);
  }

  it.each(['', 'alex.example.com', 'alex@example.c', 'ñu@example.com'])('#183 R3: «%s» en login-email no llama a la API y marca el campo', async (email) => {
    await renderLogin();
    await submit(email, 'correct horse');
    await expectField('email', 'Ingresa un correo electrónico válido');
    expect(screen.queryByTestId('login-password-message')).toBeNull();
    expect(screen.queryByTestId('login-error')).toBeNull();
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it('#183 R3: sin contraseña no llama a la API y marca login-password', async () => {
    await renderLogin();
    await submit('alex@example.com', '');
    await expectField('password', 'Escribe tu contraseña');
    expect(screen.queryByTestId('login-email-message')).toBeNull();
    expect(screen.queryByTestId('login-error')).toBeNull();
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it('#183 R3: con los dos campos mal pinta los dos mensajes a la vez', async () => {
    await renderLogin();
    await submit('alex.example.com', '');
    await expectField('email', 'Ingresa un correo electrónico válido');
    await expectField('password', 'Escribe tu contraseña');
    expect(screen.getAllByTestId(/^login-.+-message-row$/)).toHaveLength(2);
    expect(screen.queryByTestId('login-error')).toBeNull();
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it('#183 R3: una contraseña de un espacio pasa como en el DTO', async () => {
    mockLogin.mockResolvedValue({ kind: 'ok', accessToken: 'jwt-token' });
    await renderLogin();
    await submit('alex@example.com', ' ');
    expect(mockLogin).toHaveBeenCalledWith(apiUrl, { email: 'alex@example.com', password: ' ' });
  });

  it('#183 R3: envía a la API el correo sin espacios alrededor', async () => {
    mockLogin.mockResolvedValue({ kind: 'ok', accessToken: 'jwt-token' });
    await renderLogin();
    await submit('  Alex@Example.com  ', 'correct horse');
    expect(mockLogin).toHaveBeenCalledWith(apiUrl, { email: 'Alex@Example.com', password: 'correct horse' });
  });

  it('#183 R3: en inglés los dos mensajes dicen «Enter a valid email address» y «Enter your password»', async () => {
    await render(
      <HeroUINativeProvider><LanguageProvider initial="en"><LoginRoute /></LanguageProvider></HeroUINativeProvider>,
    );
    await submit('alex.example.com', '');
    await expectField('email', 'Enter a valid email address');
    await expectField('password', 'Enter your password');
    expect(screen.queryByTestId('login-error')).toBeNull();
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it('#183 R3: corregir y reenviar quita los mensajes y llama una vez a la API', async () => {
    await renderLogin();
    await submit('alex.example.com', '');
    await expectField('email', 'Ingresa un correo electrónico válido');
    await expectField('password', 'Escribe tu contraseña');
    mockLogin.mockResolvedValue({ kind: 'ok', accessToken: 'jwt-token' });
    await submit('alex@example.com', 'correct horse');
    expect(screen.queryByTestId('login-email-message')).toBeNull();
    expect(screen.queryByTestId('login-password-message')).toBeNull();
    expect(mockLogin).toHaveBeenCalledTimes(1);
  });

  it('#183 R3: un envío inválido tras un aviso general lo retira y no vuelve a llamar a la API', async () => {
    mockLogin.mockResolvedValue({ kind: 'invalid-credentials' });
    await renderLogin();
    await submit();
    expect(await screen.findByTestId('login-error')).toHaveTextContent('Credenciales inválidas');
    await waitFor(() => expect(screen.getByTestId('login-submit')).not.toBeDisabled());
    await submit('', 'correct horse');
    await expectField('email', 'Ingresa un correo electrónico válido');
    expect(screen.queryByTestId('login-error')).toBeNull();
    expect(mockLogin).toHaveBeenCalledTimes(1);
  });
});
