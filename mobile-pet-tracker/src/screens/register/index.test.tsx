import { DeviceEventEmitter, Platform } from 'react-native';
import { act, waitFor, fireEvent, render, screen, within } from '@testing-library/react-native';
import { router } from 'expo-router';
import { HeroUINativeProvider } from 'heroui-native';
import type { ReactNode } from 'react';

import {
  login,
  register as registerApi,
  type RegisterState,
} from '../../api/auth';
import { useAuth, type AuthContextValue } from '../../providers/auth-provider';
import { LanguageProvider } from '../../providers/language-provider';
import RegisterRoute from '../../app/(auth)/register';

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

jest.mock('../../components/pingo-float', () => {
  const React = jest.requireActual<typeof import('react')>('react');
  const { View } = jest.requireActual<typeof import('react-native')>('react-native');
  return {
    PingoFloat(props: { testID: string; children: import('react').ReactNode }) {
      return React.createElement(View, props);
    },
  };
});

jest.mock('../../api/auth', () => ({
  login: jest.fn(),
  register: jest.fn(),
}));

jest.mock('../../providers/auth-provider', () => ({
  useAuth: jest.fn(),
}));

jest.mock('expo-router', () => ({
  router: {
    replace: jest.fn(),
    back: jest.fn(),
    canGoBack: jest.fn(),
  },
}));

jest.mock('react-native-safe-area-context', () => ({
  ...jest.requireActual('react-native-safe-area-context'),
  useSafeAreaInsets: () => ({ top: 40, right: 0, bottom: 24, left: 0 }),
}));

const originalOS = Platform.OS;

const apiUrl = 'http://example.test/v1';
const mockLogin = jest.mocked(login);
const mockRegister = jest.mocked(registerApi);
const mockUseAuth = jest.mocked(useAuth);
const mockSignIn = jest.fn<Promise<void>, [string]>();
const mockRouter = jest.mocked(router);

const user = {
  id: '0198d3d1-0000-7000-8000-000000000001',
  email: 'alex@example.com',
  firstName: 'Alex',
  lastName: 'Smith',
  phone: '+525555555555',
  country: 'MX',
  timezone: 'America/Mexico_City',
  createdAt: '2026-08-21T00:00:00.000Z',
};

function AuthScreenWrapper({ children }: { children: ReactNode }) {
  return (
    <HeroUINativeProvider>
      <LanguageProvider initial="es">{children}</LanguageProvider>
    </HeroUINativeProvider>
  );
}

async function renderRegister() {
  await render(<RegisterRoute />, { wrapper: AuthScreenWrapper });
}

async function fillForm({ acceptTerms = true }: { acceptTerms?: boolean } = {}) {
  await fireEvent.changeText(screen.getByTestId('register-first-name'), 'Alex');
  await fireEvent.changeText(screen.getByTestId('register-last-name'), 'Smith');
  await fireEvent.changeText(screen.getByTestId('register-email'), 'alex@example.com');
  await fireEvent.changeText(screen.getByTestId('register-phone'), '+525555555555');
  await fireEvent.changeText(screen.getByTestId('register-password'), 'correct horse');
  await fireEvent.changeText(
    screen.getByTestId('register-password-confirmation'),
    'correct horse',
  );
  await fireEvent.changeText(screen.getByTestId('register-country'), 'mx');

  if (acceptTerms) {
    await fireEvent.press(screen.getByTestId('register-terms'));
  }
}

async function submit() {
  await fireEvent.press(screen.getByTestId('register-submit'));
}

describe('R8: register llama a la api y navega', () => {
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
    jest.spyOn(Intl.DateTimeFormat.prototype, 'resolvedOptions').mockReturnValue({
      timeZone: 'America/Mexico_City',
    } as Intl.ResolvedDateTimeFormatOptions);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it.each(['Nombres', 'Apellidos', 'Correo electrónico', 'Teléfono', 'País', 'Contraseña', 'Confirmar contraseña'])(
    '#187 R2: la etiqueta "%s" del registro pinta 13 px', async (label) => {
      await renderRegister();
      expect(screen.getByText(label).props.className).toBe('text-13 font-semibold text-muted');
    },
  );

  it('registers, logs in, persists the token and opens health', async () => {
    mockRegister.mockResolvedValue({ kind: 'ok', user });
    mockLogin.mockResolvedValue({ kind: 'ok', accessToken: 'jwt-token' });
    await renderRegister();

    await fillForm();
    await submit();

    expect(mockRegister).toHaveBeenCalledWith(apiUrl, {
      firstName: 'Alex',
      lastName: 'Smith',
      email: 'alex@example.com',
      phone: '+525555555555',
      password: 'correct horse',
      passwordConfirmation: 'correct horse',
      country: 'MX',
      timezone: 'America/Mexico_City',
      termsAccepted: true,
    });
    expect(mockLogin).toHaveBeenCalledWith(apiUrl, {
      email: 'alex@example.com',
      password: 'correct horse',
    });
    expect(mockSignIn).toHaveBeenCalledWith('jwt-token');
    expect(mockRouter.replace).toHaveBeenCalledWith('/home');
  });

  it('falls back to login when the account exists but auto-login fails', async () => {
    mockRegister.mockResolvedValue({ kind: 'ok', user });
    mockLogin.mockResolvedValue({ kind: 'invalid-credentials' });
    await renderRegister();

    await fillForm();
    await submit();

    expect(mockSignIn).not.toHaveBeenCalled();
    expect(mockRouter.replace).toHaveBeenCalledWith('/login');
  });

  it('keeps submit disabled until terms are accepted', async () => {
    await renderRegister();
    await fillForm({ acceptTerms: false });

    expect(screen.getByTestId('register-submit')).toBeDisabled();
    await fireEvent.press(screen.getByTestId('register-terms'));
    expect(screen.getByTestId('register-submit')).not.toBeDisabled();
  });

  it('shows a duplicate email error', async () => {
    mockRegister.mockResolvedValue({ kind: 'email-taken' });
    await renderRegister();

    await fillForm();
    await submit();

    expect(screen.getByTestId('register-error')).toHaveTextContent(
      'Ese correo ya está registrado',
    );
  });

  it('#183 R7: un 400 de validación pinta el aviso genérico y ningún campo', async () => {
    mockRegister.mockResolvedValue({
      kind: 'validation',
      errors: [
        { path: 'firstName', message: 'First name is required' },
        { path: 'email', message: 'Invalid email address' },
        { path: 'termsAccepted', message: 'Terms must be accepted' },
      ],
    });
    await renderRegister();

    await fillForm();
    await submit();

    expect(screen.getByTestId('register-error')).toHaveTextContent('Algo no cuadra en los datos. Revísalos y vuelve a intentarlo.');
    for (const message of ['First name is required', 'Invalid email address', 'Terms must be accepted']) {
      expect(screen.queryByText(message)).toBeNull();
    }
    expect(screen.queryAllByTestId(/^register-.+-message-row$/)).toHaveLength(0);
  });

  it.each<[RegisterState, string]>([
    [
      { kind: 'unreachable', message: 'network down' },
      'No se pudo conectar con el servidor',
    ],
    [{ kind: 'error' }, 'Algo salió mal'],
    [{ kind: 'missing-config' }, 'Algo salió mal'],
  ])('shows the expected general message for $kind', async (state, message) => {
    mockRegister.mockResolvedValue(state);
    await renderRegister();

    await fillForm();
    await submit();

    expect(screen.getByTestId('register-error')).toHaveTextContent(message);
  });
});

describe('#61 R7: register usa las métricas de pantalla uniformes', () => {
  it('aplica el padding del contentContainerStyle con los safe-area insets', async () => {
    await renderRegister();

    expect(
      screen.getByTestId('register-form').props.contentContainerStyle,
    ).toEqual({
      flexGrow: 1,
      padding: 24,
      gap: 16,
      paddingTop: 52,
      paddingBottom: 120,
    });
  });

  it('declara el ajuste automático de inset del contenedor de scroll', async () => {
    await renderRegister();

    expect(
      screen.getByTestId('register-form').props
        .contentInsetAdjustmentBehavior,
    ).toBe('automatic');
  });

  it('conserva los campos del formulario como hijos directos del scroll', async () => {
    await renderRegister();

    expect(screen.getByTestId('register-first-name')).toBeVisible();
    expect(screen.getByTestId('register-submit')).toBeVisible();
    expect(screen.getAllByText('Crear cuenta')).toHaveLength(2);
  });
});

describe('#127 R1: el botón de envío de register lleva su receta en el árbol', () => {
  beforeEach(() => {
    mockUseAuth.mockReturnValue({
      status: 'unauthenticated',
      token: null,
      signIn: mockSignIn,
      signOut: jest.fn(),
    } satisfies AuthContextValue);
  });

  it('pinta register-submit, deshabilitado al montar, con la clase exacta, rounded-xl y bg-accent incluidos, la vea o no el recorte de fuente', async () => {
    await renderRegister();

    expect(screen.getByTestId('register-submit').props.className).toBe(
      'pressable-feedback__root button__root button__root--variant-primary button__root--size-md disabled:element-disabled w-full h-14 rounded-xl bg-accent border-b-4 border-black/25',
    );
  });
});

describe('#148 R2: register se aparta del teclado en Android', () => {
  afterEach(() => {
    (Platform as { OS: string }).OS = originalOS;
  });

  it('el host screen-register añade paddingBottom 200 al abrir el teclado', async () => {
    (Platform as { OS: string }).OS = 'android';
    await renderRegister();

    const host = screen.getByTestId('screen-register');
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
    await waitFor(() => expect(screen.getByTestId('screen-register')).toHaveStyle({ paddingBottom: 200 }));
  });
});


describe('#167 R7: Pingo en la cabecera del registro', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuth.mockReturnValue({
      status: 'unauthenticated', token: null, signIn: mockSignIn, signOut: jest.fn(),
    } satisfies AuthContextValue);
  });

  it('#167 R7: la cabecera entra con rise', async () => {
    await renderRegister();
    expect(Object.fromEntries(mockHomeEntrance.mock.calls.map(([p]) => [
      p.testID, { index: p.index, className: p.className },
    ]))).toEqual({
      'register-header': { index: 0, className: 'gap-2' },
    });
  });

  it('#172 R3: la cabecera lleva la fila Volver-Pingo y después el título', async () => {
    await renderRegister();
    const header = screen.getByTestId('register-header');
    expect(header.children[0]).toHaveProperty('props.testID', 'register-top');
    expect(header.children).toHaveLength(2);
    expect(header.children[1]).toBe(within(header).getByText('Crear cuenta'));
    const top = screen.getByTestId('register-top');
    expect(top.children).toEqual([
      screen.getByTestId('register-back'), screen.getByTestId('register-pingo-float'),
    ]);
    expect(top.props.className).toBe('flex-row items-center justify-between');
    expect(header.props.className).toBe('gap-2');
  });

  it('#172 R3: Volver del registro vuelve a la bienvenida sin historial', async () => {
    mockRouter.canGoBack.mockReturnValue(false);
    await renderRegister();
    await fireEvent.press(screen.getByTestId('register-back'));
    expect(mockRouter.replace).toHaveBeenCalledWith('/welcome');
  });

  it.each(['register-password', 'register-password-confirmation'])('#172 R8: %s lleva su propio ojo', async (field) => {
    await renderRegister();
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
    const other = field === 'register-password' ? 'register-password-confirmation' : 'register-password';
    expect(screen.getByTestId(other).props.secureTextEntry).toBe(true);
  });

  it('#172 R5: Pingo del registro flota', async () => {
    await renderRegister();
    const pingo = screen.getByTestId('register-pingo');
    expect(pingo.parent).toHaveProperty('props.testID', 'register-pingo-float');
    expect(pingo.parent?.children).toEqual([pingo]);
  });

  it('#167 R7: Pingo del registro usa la pose de la tablilla', async () => {
    await renderRegister();
    const pingo = screen.getByTestId('register-pingo');
    expect(pingo.props.source).toEqual([
      expect.objectContaining({ testUri: expect.stringMatching(/pingo-clipboard\.webp$/) }),
    ]);
    expect(pingo.props.style).toEqual({ width: 56, height: 56 });
    expect(pingo.props.accessibilityLabel).toBeUndefined();
  });

  it('#172 R6: el título de la cabecera pesa 30/900 al inicio', async () => {
    await renderRegister();
    expect(within(screen.getByTestId('register-header')).getByText('Crear cuenta').props.className)
      .toBe('text-3xl font-black text-foreground');
  });

  it('#172 R10: cada campo con error lleva icono y texto seleccionable', async () => {
    const fields = [
      ['first-name', 'Escribe tu nombre'], ['last-name', 'Escribe tus apellidos'],
      ['email', 'Ingresa un correo electrónico válido'], ['phone', 'Usa al menos 7 caracteres'],
      ['country', 'Escribe las 2 letras de tu país, como MX'], ['password', 'Usa al menos 8 caracteres'],
      ['password-confirmation', 'Las contraseñas no coinciden'],
    ] as const;
    mockRegister.mockResolvedValue({ kind: 'email-taken' });
    await renderRegister();
    await fireEvent.press(screen.getByTestId('register-terms'));
    await fireEvent.changeText(screen.getByTestId('register-password-confirmation'), 'x');
    await submit();
    for (const [field, message] of fields) {
      const error = screen.getByTestId(`register-${field}-error`);
      const row = within(error).getByTestId(`register-${field}-message-row`);
      const text = within(row).getByTestId(`register-${field}-message`);
      expect(row.children).toEqual([within(row).getByTestId('icon-alert-circle'), text]);
      expect(text).toHaveTextContent(message);
      expect(text.props.selectable).toBe(true);
    }
    expect(screen.getAllByTestId(/^register-.+-message-row$/)).toHaveLength(7);
  });

  it('#172 R10: sin errores ningún campo pinta mensaje', async () => {
    await renderRegister();
    expect(screen.queryAllByTestId(/^register-.+-message(-row)?$/)).toHaveLength(0);
  });

  it('#172 R12: un correo sin arroba no llama a la API y marca el campo', async () => {
    mockRegister.mockResolvedValue({ kind: 'email-taken' });
    await renderRegister();
    await fillForm();
    await fireEvent.changeText(screen.getByTestId('register-email'), 'alex.example.com');
    await submit();
    await waitFor(() => expect(screen.getByTestId('register-email-message'))
      .toHaveTextContent('Ingresa un correo electrónico válido'));
    expect(mockRegister).not.toHaveBeenCalled();
  });

  it('#172 R12: en inglés el correo inválido dice «Enter a valid email address»', async () => {
    mockRegister.mockResolvedValue({ kind: 'email-taken' });
    await render(
      <HeroUINativeProvider><LanguageProvider initial="en"><RegisterRoute /></LanguageProvider></HeroUINativeProvider>,
    );
    await fillForm();
    await fireEvent.changeText(screen.getByTestId('register-email'), 'alex.example.com');
    await submit();
    await waitFor(() => expect(screen.getByTestId('register-email-message'))
      .toHaveTextContent('Enter a valid email address'));
    expect(mockRegister).not.toHaveBeenCalled();
  });

  it('#172 R12: tras un correo inválido el envío sigue activo y el corregido sí llama a la API', async () => {
    mockRegister.mockResolvedValue({ kind: 'email-taken' });
    await renderRegister();
    await fillForm();
    await fireEvent.changeText(screen.getByTestId('register-email'), 'alex.example.com');
    await submit();
    await waitFor(() => expect(screen.getByTestId('register-email-message'))
      .toHaveTextContent('Ingresa un correo electrónico válido'));
    expect(screen.getByTestId('register-submit')).not.toBeDisabled();
    await fireEvent.changeText(screen.getByTestId('register-email'), '  alex@example.com  ');
    await submit();
    await waitFor(() => expect(screen.getByTestId('register-error'))
      .toHaveTextContent('Ese correo ya está registrado'));
    expect(screen.queryByTestId('register-email-message')).toBeNull();
    expect(mockRegister).toHaveBeenCalledTimes(1);
  });

  it.each(['alex@example', 'alex @example.com'])('#172 R12: «%s» tampoco es un correo y no llama a la API', async (email) => {
    mockRegister.mockResolvedValue({ kind: 'email-taken' });
    await renderRegister();
    await fillForm();
    await fireEvent.changeText(screen.getByTestId('register-email'), email);
    await submit();
    await waitFor(() => expect(screen.getByTestId('register-email-message'))
      .toHaveTextContent('Ingresa un correo electrónico válido'));
    expect(mockRegister).not.toHaveBeenCalled();
  });

  it('#172 R11: cabecera, rejilla, términos, error y envío cuelgan del scroll', async () => {
    mockRegister.mockResolvedValue({
      kind: 'validation',
      errors: [
        'firstName', 'lastName', 'email', 'phone', 'password', 'passwordConfirmation', 'country', 'termsAccepted',
      ].map((path) => ({ path, message: `${path} no vale` })),
    });
    await renderRegister();
    await fillForm();
    await submit();
    const names = screen.getByTestId('register-names-row');
    const content = screen.getByTestId('register-header').parent;
    expect(content?.parent).toHaveProperty('props.testID', 'register-form');
    expect(content?.children).toHaveLength(10);
    expect(content?.children).toEqual([
      screen.getByTestId('register-header'), names,
      screen.getByTestId('register-email').parent,
      screen.getByTestId('register-contact-row'),
      screen.getByTestId('register-password-group').parent,
      screen.getByTestId('register-password-confirmation-group').parent,
      screen.getByTestId('register-terms').parent,
      screen.getByTestId('register-error-row'), screen.getByTestId('register-spacer'),
      screen.getByTestId('register-submit'),
    ]);
  });

  it('#172 R19: el espaciador empuja el envío al pie', async () => {
    mockRegister.mockResolvedValue({ kind: 'email-taken' });
    await renderRegister();
    function expectSpacer(withError = false) {
      const spacer = screen.getByTestId('register-spacer');
      const cta = screen.getByTestId('register-submit');
      expect(spacer.parent).toBe(cta.parent);
      expect(spacer.parent).toBe(screen.getByTestId('register-header').parent);
      const children = spacer.parent?.children ?? [];
      const index = children.indexOf(spacer);
      expect(index).toBe(children.indexOf(cta) - 1);
      expect(spacer.props.className).toBe('flex-1');
      expect(spacer.children).toHaveLength(0);
      if (withError) {
        expect(children.indexOf(screen.getByTestId('register-error-row'))).toBe(index - 1);
      }
    }
    expectSpacer();
    await fillForm();
    await submit();
    expectSpacer(true);
  });

  it('#172 R11: nombres a 1fr 1fr y teléfono-país a 2fr 1fr', async () => {
    await renderRegister();
    const names = screen.getByTestId('register-names-row');
    const contact = screen.getByTestId('register-contact-row');
    const first = screen.getByTestId('register-first-name').parent;
    const last = screen.getByTestId('register-last-name').parent;
    const phone = screen.getByTestId('register-phone').parent;
    const country = screen.getByTestId('register-country').parent;
    expect(names.children).toEqual([first, last]);
    expect(contact.children).toEqual([phone, country]);
    expect(names.props.className).toBe('flex-row gap-3');
    expect(contact.props.className).toBe('flex-row gap-3');
    for (const root of [first, last, country]) {
      expect(root?.props.className.split(' ')).toContain('flex-1');
      expect(root?.props.className.split(' ')).not.toContain('flex-2');
    }
    expect(phone?.props.className.split(' ')).toContain('flex-2');
    expect(phone?.props.className.split(' ')).not.toContain('flex-1');
  });

  it('#167 R7: ningún campo ni el envío quedan dentro de la cabecera', async () => {
    await renderRegister();
    const header = screen.getByTestId('register-header');
    for (const id of [
      'register-first-name', 'register-last-name', 'register-email', 'register-phone',
      'register-password', 'register-password-confirmation', 'register-country',
      'register-terms', 'register-submit',
    ]) {
      expect(within(header).queryByTestId(id)).toBeNull();
    }
  });
});


describe('#167 R8: el error del registro lleva icono', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.EXPO_PUBLIC_API_URL = apiUrl;
    mockRegister.mockResolvedValue({ kind: 'email-taken' });
    mockUseAuth.mockReturnValue({
      status: 'unauthenticated', token: null, signIn: mockSignIn, signOut: jest.fn(),
    } satisfies AuthContextValue);
  });

  it('#167 R8: el error general va en una fila con icono', async () => {
    await renderRegister();
    await fillForm();
    await submit();
    const row = screen.getByTestId('register-error-row');
    expect(row.props.className).toBe('w-full flex-row items-center gap-1.5');
    expect(row.children.map((child) => typeof child === 'string' ? child : child.props.testID))
      .toEqual(['icon-alert-circle', 'register-error']);
  });

  it('#167 R8: el icono del error mide 14 y usa danger', async () => {
    await renderRegister();
    await fillForm();
    await submit();
    const icon = screen.getByTestId('icon-alert-circle');
    expect(icon.props.size).toBe(14);
    expect(icon.props.color).toBe('color:danger');
  });

  it('#167 R8: el texto del error pesa como el icono', async () => {
    await renderRegister();
    await fillForm();
    await submit();
    expect(screen.getByTestId('register-error').props.className)
      .toBe('flex-1 text-13 font-semibold text-danger');
  });

  it('#167 R8: sin error no hay fila; con error, sí', async () => {
    await renderRegister();
    expect(screen.queryByTestId('register-error-row')).toBeNull();
    await fillForm();
    await submit();
    expect(screen.getByTestId('register-error-row')).toBeOnTheScreen();
  });
});

describe('#183 R4: registro valida en cliente', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.EXPO_PUBLIC_API_URL = apiUrl;
    mockSignIn.mockResolvedValue();
    mockUseAuth.mockReturnValue({
      status: 'unauthenticated', token: null, signIn: mockSignIn, signOut: jest.fn(),
    } satisfies AuthContextValue);
    mockRegister.mockResolvedValue({ kind: 'email-taken' });
    jest.spyOn(Intl.DateTimeFormat.prototype, 'resolvedOptions').mockReturnValue({
      timeZone: 'America/Mexico_City',
    } as Intl.ResolvedDateTimeFormatOptions);
  });
  afterEach(() => jest.restoreAllMocks());

  async function changeFields(changes: Record<string, string>) {
    for (const [id, value] of Object.entries(changes)) {
      await fireEvent.changeText(screen.getByTestId(id), value);
    }
  }

  it.each<[string, Record<string, string>, string]>([
    ['first-name', { 'register-first-name': '' }, 'Escribe tu nombre'],
    ['first-name', { 'register-first-name': '   ' }, 'Escribe tu nombre'],
    ['first-name', { 'register-first-name': 'a'.repeat(121) }, 'Usa 120 caracteres o menos'],
    ['last-name', { 'register-last-name': '' }, 'Escribe tus apellidos'],
    ['last-name', { 'register-last-name': 'a'.repeat(121) }, 'Usa 120 caracteres o menos'],
    ['email', { 'register-email': 'alex@example.c' }, 'Ingresa un correo electrónico válido'],
    ['email', { 'register-email': 'ñu@example.com' }, 'Ingresa un correo electrónico válido'],
    ['email', { 'register-email': 'a'.repeat(309) + '@example.com' }, 'Usa 320 caracteres o menos'],
    ['phone', { 'register-phone': '123456' }, 'Usa al menos 7 caracteres'],
    ['phone', { 'register-phone': '1'.repeat(21) }, 'Usa 20 caracteres o menos'],
    ['country', { 'register-country': 'M' }, 'Escribe las 2 letras de tu país, como MX'],
    ['country', { 'register-country': '' }, 'Escribe las 2 letras de tu país, como MX'],
    ['country', { 'register-country': 'M1' }, 'Usa solo letras de la A a la Z'],
    ['country', { 'register-country': 'ña' }, 'Usa solo letras de la A a la Z'],
    ['password', { 'register-password': '1234567', 'register-password-confirmation': '1234567' }, 'Usa al menos 8 caracteres'],
    ['password', { 'register-password': 'a'.repeat(129), 'register-password-confirmation': 'a'.repeat(129) }, 'Usa 128 caracteres o menos'],
    ['password-confirmation', { 'register-password-confirmation': 'correct horsE' }, 'Las contraseñas no coinciden'],
  ])('#183 R4: %s con %p pinta «%s» solo en ese campo y no llama a la API', async (field, changes, message) => {
    await renderRegister();
    await fillForm();
    await changeFields(changes);
    await submit();
    await waitFor(() => expect(screen.getByTestId(`register-${field}-message`)).toHaveTextContent(message));
    const text = screen.getByTestId(`register-${field}-message`);
    const row = screen.getByTestId(`register-${field}-message-row`);
    expect(screen.getAllByTestId(/^register-.+-message-row$/)).toHaveLength(1);
    expect(row.children).toEqual([within(row).getByTestId('icon-alert-circle'), text]);
    expect(text.props.selectable).toBe(true);
    expect(screen.queryByTestId('register-error')).toBeNull();
    expect(mockRegister).not.toHaveBeenCalled();
  });

  it.each<[string, Record<string, string>]>([
    ['nombre de 120 recortado', { 'register-first-name': ' ' + 'a'.repeat(120) + ' ' }],
    ['apellidos de 120', { 'register-last-name': 'a'.repeat(120) }],
    ['correo de 320', { 'register-email': 'a'.repeat(308) + '@example.com' }],
    ['teléfono de 7', { 'register-phone': '1234567' }],
    ['teléfono con espacio', { 'register-phone': '55 1234' }],
    ['teléfono de 20 recortado', { 'register-phone': ' ' + '1'.repeat(20) + ' ' }],
    ['contraseña de espacios', { 'register-password': ' '.repeat(8), 'register-password-confirmation': ' '.repeat(8) }],
    ['contraseña de 128', { 'register-password': 'a'.repeat(128), 'register-password-confirmation': 'a'.repeat(128) }],
  ])('#183 R4: %s con %p pasa como en el DTO y llama a la API', async (_label, changes) => {
    await renderRegister();
    await fillForm();
    await changeFields(changes);
    await submit();
    await waitFor(() => expect(screen.getByTestId('register-error')).toHaveTextContent('Ese correo ya está registrado'));
    expect(screen.queryAllByTestId(/^register-.+-message-row$/)).toHaveLength(0);
    expect(mockRegister).toHaveBeenCalledTimes(1);
  });

  async function expectAllMessages(messages: Record<string, string>) {
    await fireEvent.press(screen.getByTestId('register-terms'));
    await fireEvent.changeText(screen.getByTestId('register-password-confirmation'), 'x');
    await submit();
    await waitFor(() => {
      for (const [field, message] of Object.entries(messages)) {
        expect(screen.getByTestId(`register-${field}-message`)).toHaveTextContent(message);
      }
    });
    expect(screen.getAllByTestId(/^register-.+-message-row$/)).toHaveLength(7);
    expect(screen.queryByTestId('register-error')).toBeNull();
    expect(mockRegister).not.toHaveBeenCalled();
  }

  it('#183 R4: con el formulario vacío pinta los siete mensajes a la vez y no llama a la API', async () => {
    await renderRegister();
    await expectAllMessages({
      'first-name': 'Escribe tu nombre', 'last-name': 'Escribe tus apellidos',
      email: 'Ingresa un correo electrónico válido', phone: 'Usa al menos 7 caracteres',
      country: 'Escribe las 2 letras de tu país, como MX', password: 'Usa al menos 8 caracteres',
      'password-confirmation': 'Las contraseñas no coinciden',
    });
  });

  it('#183 R4: en inglés los siete mensajes salen en inglés', async () => {
    await render(
      <HeroUINativeProvider><LanguageProvider initial="en"><RegisterRoute /></LanguageProvider></HeroUINativeProvider>,
    );
    await expectAllMessages({
      'first-name': 'Enter your first name', 'last-name': 'Enter your last name',
      email: 'Enter a valid email address', phone: 'Use at least 7 characters',
      country: "Enter your country's 2-letter code, like MX", password: 'Use at least 8 characters',
      'password-confirmation': "Passwords don't match",
    });
  });

  it('#183 R4: envía el correo sin espacios a register y al login que le sigue', async () => {
    mockRegister.mockResolvedValue({ kind: 'ok', user });
    mockLogin.mockResolvedValue({ kind: 'ok', accessToken: 'jwt-token' });
    await renderRegister();
    await fillForm();
    await fireEvent.changeText(screen.getByTestId('register-email'), '  Alex@Example.com  ');
    await submit();
    expect(mockRegister).toHaveBeenCalledWith(apiUrl, {
      firstName: 'Alex', lastName: 'Smith', email: 'Alex@Example.com', phone: '+525555555555',
      password: 'correct horse', passwordConfirmation: 'correct horse', country: 'MX',
      timezone: 'America/Mexico_City', termsAccepted: true,
    });
    expect(mockLogin).toHaveBeenCalledWith(apiUrl, { email: 'Alex@Example.com', password: 'correct horse' });
  });

  it('#183 R4: un envío inválido tras un aviso general lo retira y no vuelve a llamar a la API', async () => {
    await renderRegister();
    await fillForm();
    await submit();
    await waitFor(() => expect(screen.getByTestId('register-error')).toHaveTextContent('Ese correo ya está registrado'));
    await waitFor(() => expect(screen.getByTestId('register-submit')).not.toBeDisabled());
    await fireEvent.changeText(screen.getByTestId('register-email'), 'alex.example.com');
    await submit();
    await waitFor(() => expect(screen.getByTestId('register-email-message')).toHaveTextContent('Ingresa un correo electrónico válido'));
    expect(screen.queryByTestId('register-error')).toBeNull();
    expect(mockRegister).toHaveBeenCalledTimes(1);
  });
});
