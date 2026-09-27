import { act, renderHook, waitFor } from '@testing-library/react-native';
import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import { AppState, Platform, type AppStateStatus } from 'react-native';

import { registerPushToken } from '../api/push-tokens';
import { useAuth, type AuthContextValue } from '../providers/auth-provider';
import { useNotificationsBlocked, usePushRegistration } from './use-push-registration';

let mockIsDevice = true;
let mockProjectId: string | undefined = 'project-id';
let mockExecutionEnvironment = 'bare';

jest.mock('expo-notifications', () => ({
  AndroidImportance: { MAX: 7 },
  setNotificationHandler: jest.fn(),
  setNotificationChannelAsync: jest.fn(),
  getPermissionsAsync: jest.fn(),
  requestPermissionsAsync: jest.fn(),
  getExpoPushTokenAsync: jest.fn(),
  addNotificationResponseReceivedListener: jest.fn(),
  getLastNotificationResponseAsync: jest.fn(),
}));
jest.mock('expo-device', () => ({
  get isDevice() {
    return mockIsDevice;
  },
}));
jest.mock('expo-constants', () => ({
  __esModule: true,
  default: {
    get executionEnvironment() {
      return mockExecutionEnvironment;
    },
    get expoConfig() {
      return {
        extra: { eas: { projectId: mockProjectId } },
      };
    },
  },
}));
jest.mock('expo-router', () => ({
  router: { push: jest.fn() },
  usePathname: jest.fn(() => '/home'),
}));
jest.mock('../api/push-tokens', () => ({
  registerPushToken: jest.fn(),
}));
jest.mock('../providers/auth-provider', () => ({
  useAuth: jest.fn(),
}));

const mockUseAuth = jest.mocked(useAuth);
const mockRegisterPushToken = jest.mocked(registerPushToken);
const mockSetNotificationHandler = jest.mocked(
  Notifications.setNotificationHandler,
);
const mockSetNotificationChannel = jest.mocked(
  Notifications.setNotificationChannelAsync,
);
const mockGetPermissions = jest.mocked(Notifications.getPermissionsAsync);
const mockRequestPermissions = jest.mocked(
  Notifications.requestPermissionsAsync,
);
const mockGetExpoPushToken = jest.mocked(
  Notifications.getExpoPushTokenAsync,
);
const mockAddResponseListener = jest.mocked(
  Notifications.addNotificationResponseReceivedListener,
);
const mockGetLastResponse = jest.mocked(
  Notifications.getLastNotificationResponseAsync,
);
const notificationMocks = [
  mockSetNotificationHandler,
  mockSetNotificationChannel,
  mockGetPermissions,
  mockRequestPermissions,
  mockGetExpoPushToken,
  mockAddResponseListener,
  mockGetLastResponse,
];
const originalPlatform = Platform.OS;
const originalApiUrl = process.env.EXPO_PUBLIC_API_URL;
const devGlobal = globalThis as typeof globalThis & { __DEV__: boolean };
const originalDev = devGlobal.__DEV__;
const mockSetPushToken = jest.fn();
const mockRouterPush = jest.mocked(router.push);
const mockRemoveResponseListener = jest.fn();
let responseListener:
  | Parameters<typeof Notifications.addNotificationResponseReceivedListener>[0]
  | undefined;
let warnSpy: jest.SpiedFunction<typeof console.warn>;

function setPlatform(os: string): void {
  Object.defineProperty(Platform, 'OS', { configurable: true, value: os });
}

function authenticatedAuth(): AuthContextValue {
  return {
    status: 'authenticated',
    token: 'jwt-token',
    signIn: jest.fn(),
    signOut: jest.fn(),
    setPushToken: mockSetPushToken,
  };
}

function permission(
  granted: boolean,
  canAskAgain: boolean,
): Notifications.NotificationPermissionsStatus {
  return { granted, canAskAgain } as Notifications.NotificationPermissionsStatus;
}

function expectNoPushSideEffects(): void {
  for (const mock of notificationMocks) {
    expect(mock).not.toHaveBeenCalled();
  }
  expect(mockRegisterPushToken).not.toHaveBeenCalled();
}

beforeEach(() => {
  jest.clearAllMocks();
  devGlobal.__DEV__ = true;
  warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
  mockIsDevice = true;
  mockProjectId = 'project-id';
  mockExecutionEnvironment = 'bare';
  setPlatform('android');
  process.env.EXPO_PUBLIC_API_URL = 'http://example.test/v1';
  mockUseAuth.mockReturnValue(authenticatedAuth());
  mockSetNotificationChannel.mockResolvedValue(null);
  mockGetPermissions.mockResolvedValue(permission(true, true));
  mockRequestPermissions.mockResolvedValue(permission(true, true));
  mockGetExpoPushToken.mockResolvedValue({
    type: 'expo',
    data: 'ExpoPushToken[xxx]',
  });
  responseListener = undefined;
  mockAddResponseListener.mockImplementation((listener) => {
    responseListener = listener;
    return { remove: mockRemoveResponseListener };
  });
  mockGetLastResponse.mockResolvedValue(null);
  mockRegisterPushToken.mockResolvedValue({ kind: 'ok' });
});

afterEach(() => {
  warnSpy.mockRestore();
});

afterAll(() => {
  devGlobal.__DEV__ = originalDev;
  setPlatform(originalPlatform);
  if (originalApiUrl === undefined) {
    delete process.env.EXPO_PUBLIC_API_URL;
  } else {
    process.env.EXPO_PUBLIC_API_URL = originalApiUrl;
  }
});

describe('R6: el hook no toca expo-notifications ni la API sin las precondiciones', () => {
  it('no hace nada sin sesión autenticada', async () => {
    mockUseAuth.mockReturnValue({
      ...authenticatedAuth(),
      status: 'unauthenticated',
      token: null,
    });

    await renderHook(() => usePushRegistration());

    expectNoPushSideEffects();
    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(warnSpy).toHaveBeenCalledWith(
      '[push] skipped: unauthenticated or missing auth token',
    );
  });

  it('no hace nada sin publicador de push token', async () => {
    mockUseAuth.mockReturnValue({
      ...authenticatedAuth(),
      setPushToken: undefined,
    });

    await renderHook(() => usePushRegistration());

    expectNoPushSideEffects();
    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(warnSpy).toHaveBeenCalledWith(
      '[push] skipped: setPushToken unavailable',
    );
  });

  it('no hace nada fuera de un dispositivo físico', async () => {
    mockIsDevice = false;

    await renderHook(() => usePushRegistration());

    expectNoPushSideEffects();
    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(warnSpy).toHaveBeenCalledWith(
      '[push] skipped: physical device required',
    );
  });

  it('no hace nada en una plataforma no soportada', async () => {
    setPlatform('web');

    await renderHook(() => usePushRegistration());

    expectNoPushSideEffects();
    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(warnSpy).toHaveBeenCalledWith(
      '[push] skipped: unsupported platform (web)',
    );
  });

  it.each([undefined, ''])('no hace nada con projectId %p', async (projectId) => {
    mockProjectId = projectId;

    await renderHook(() => usePushRegistration());

    expectNoPushSideEffects();
    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(warnSpy).toHaveBeenCalledWith(
      '[push] skipped: EAS projectId missing',
    );
  });
});

describe('R7: el permiso se pide solo con granted false y canAskAgain true', () => {
  it('no vuelve a pedir un permiso ya concedido', async () => {
    await renderHook(() => usePushRegistration());

    await waitFor(() => {
      expect(mockGetPermissions).toHaveBeenCalledTimes(1);
      expect(mockRequestPermissions).not.toHaveBeenCalled();
      expect(mockGetExpoPushToken).toHaveBeenCalledTimes(1);
    });
  });

  it('pide una vez el permiso consultable y termina si sigue denegado', async () => {
    mockGetPermissions.mockResolvedValue(permission(false, true));
    mockRequestPermissions.mockResolvedValue(permission(false, true));

    await renderHook(() => usePushRegistration());

    await waitFor(() => {
      expect(mockRequestPermissions).toHaveBeenCalledTimes(1);
      expect(mockGetExpoPushToken).not.toHaveBeenCalled();
      expect(mockRegisterPushToken).not.toHaveBeenCalled();
      expect(warnSpy).toHaveBeenCalledTimes(1);
      expect(warnSpy).toHaveBeenCalledWith(
        '[push] skipped: notification permission denied',
      );
    });
  });

  it('no insiste cuando el permiso ya no se puede pedir', async () => {
    mockGetPermissions.mockResolvedValue(permission(false, false));

    await renderHook(() => usePushRegistration());

    await waitFor(() => {
      expect(mockGetPermissions).toHaveBeenCalledTimes(1);
      expect(mockRequestPermissions).not.toHaveBeenCalled();
      expect(mockGetExpoPushToken).not.toHaveBeenCalled();
      expect(mockRegisterPushToken).not.toHaveBeenCalled();
      expect(warnSpy).toHaveBeenCalledTimes(1);
      expect(warnSpy).toHaveBeenCalledWith(
        '[push] skipped: notification permission denied',
      );
    });
  });

  it('crea el canal Android antes de pedir el token', async () => {
    await renderHook(() => usePushRegistration());

    await waitFor(() => {
      expect(mockSetNotificationChannel).toHaveBeenCalledWith('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
      });
      expect(mockGetExpoPushToken).toHaveBeenCalledTimes(1);
      expect(mockSetNotificationChannel.mock.invocationCallOrder[0]).toBeLessThan(
        mockGetExpoPushToken.mock.invocationCallOrder[0]!,
      );
    });
  });
});

describe('R8: obtiene el token con el projectId, lo publica y hace POST', () => {
  it('publica el token antes de registrarlo para Android', async () => {
    await renderHook(() => usePushRegistration());

    await waitFor(() => {
      expect(mockGetExpoPushToken).toHaveBeenCalledWith({
        projectId: 'project-id',
      });
      expect(mockSetPushToken).toHaveBeenCalledWith('ExpoPushToken[xxx]');
      expect(mockRegisterPushToken).toHaveBeenCalledWith(
        'http://example.test/v1',
        'jwt-token',
        {
          expoToken: 'ExpoPushToken[xxx]',
          platform: 'android',
        },
      );
      expect(mockSetPushToken.mock.invocationCallOrder[0]).toBeLessThan(
        mockRegisterPushToken.mock.invocationCallOrder[0]!,
      );
    });
  });

  it('registra ios como plataforma en un dispositivo Apple', async () => {
    setPlatform('ios');

    await renderHook(() => usePushRegistration());

    await waitFor(() => {
      expect(mockSetNotificationChannel).not.toHaveBeenCalled();
      expect(mockRegisterPushToken).toHaveBeenCalledWith(
        'http://example.test/v1',
        'jwt-token',
        {
          expoToken: 'ExpoPushToken[xxx]',
          platform: 'ios',
        },
      );
    });
  });

  it('repite la secuencia completa en un segundo montaje', async () => {
    const first = await renderHook(() => usePushRegistration());
    await waitFor(() => {
      expect(mockRegisterPushToken).toHaveBeenCalledTimes(1);
    });
    await first.unmount();

    await renderHook(() => usePushRegistration());

    await waitFor(() => {
      expect(mockSetNotificationChannel).toHaveBeenCalledTimes(2);
      expect(mockGetPermissions).toHaveBeenCalledTimes(2);
      expect(mockGetExpoPushToken).toHaveBeenCalledTimes(2);
      expect(mockSetPushToken).toHaveBeenCalledTimes(2);
      expect(mockRegisterPushToken).toHaveBeenCalledTimes(2);
    });
  });
});

describe('R9: un fallo de token o de red no rompe ni reintenta en la sesión', () => {
  it('absorbe un fallo al obtener el token y conserva el probe', async () => {
    const error = new Error('offline');
    mockGetExpoPushToken.mockRejectedValue(error);

    const probe = await renderHook(() => {
      usePushRegistration();
      return 'mounted';
    });

    await waitFor(() => {
      expect(mockGetExpoPushToken).toHaveBeenCalledTimes(1);
      expect(mockRegisterPushToken).not.toHaveBeenCalled();
      expect(probe.result.current).toBe('mounted');
      expect(warnSpy).toHaveBeenCalledTimes(1);
      expect(warnSpy).toHaveBeenCalledWith(
        '[push] registration failed',
        error,
      );
    });
  });

  it.each([
    ['unreachable', { kind: 'unreachable' as const, message: 'offline' }],
    ['error', { kind: 'error' as const }],
    ['unauthorized', { kind: 'unauthorized' as const }],
  ])('no reintenta un resultado %s dentro del mismo montaje', async (_case, result) => {
    mockRegisterPushToken.mockResolvedValue(result);
    const probe = await renderHook(
      (_props: { tick: number }) => usePushRegistration(),
      { initialProps: { tick: 0 } },
    );
    await waitFor(() => {
      expect(mockRegisterPushToken).toHaveBeenCalledTimes(1);
    });

    await probe.rerender({ tick: 1 });

    expect(mockRegisterPushToken).toHaveBeenCalledTimes(1);
  });
});

describe('R13: cada salida silenciosa se nombra en desarrollo', () => {
  it('no avisa en producción', async () => {
    devGlobal.__DEV__ = false;
    mockProjectId = undefined;

    await renderHook(() => usePushRegistration());

    expectNoPushSideEffects();
    expect(warnSpy).not.toHaveBeenCalled();
  });

  it('no avisa en el camino feliz', async () => {
    await renderHook(() => usePushRegistration());

    await waitFor(() => {
      expect(mockRegisterPushToken).toHaveBeenCalledTimes(1);
      expect(warnSpy).not.toHaveBeenCalled();
    });
  });
});

describe('R10: banner en primer plano y tap que navega a /alerts', () => {
  const notificationResponse = {} as Notifications.NotificationResponse;

  it('configura tras los guards el comportamiento de primer plano de SDK 57', async () => {
    await renderHook(() => usePushRegistration());
    await waitFor(() => {
      expect(mockSetNotificationHandler).toHaveBeenCalledTimes(1);
    });
    const foregroundNotificationHandler =
      mockSetNotificationHandler.mock.calls[0]?.[0];
    const behavior = await foregroundNotificationHandler?.handleNotification(
      {} as Notifications.Notification,
    );

    expect(behavior).toEqual({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    });
    expect(behavior).not.toHaveProperty('shouldShowAlert');
  });

  it('navega una vez al recibir un tap con sesión', async () => {
    await renderHook(() => usePushRegistration());
    await waitFor(() => {
      expect(mockAddResponseListener).toHaveBeenCalledTimes(1);
      expect(responseListener).toEqual(expect.any(Function));
    });

    responseListener?.(notificationResponse);

    expect(mockRouterPush).toHaveBeenCalledTimes(1);
    expect(mockRouterPush).toHaveBeenCalledWith('/alerts');
  });

  it('navega una sola vez desde una respuesta de cold start', async () => {
    mockGetLastResponse.mockResolvedValue(notificationResponse);
    const probe = await renderHook(
      (_props: { tick: number }) => usePushRegistration(),
      { initialProps: { tick: 0 } },
    );

    await waitFor(() => {
      expect(mockGetLastResponse).toHaveBeenCalledTimes(1);
      expect(mockRouterPush).toHaveBeenCalledTimes(1);
      expect(mockRouterPush).toHaveBeenCalledWith('/alerts');
    });

    await probe.rerender({ tick: 1 });

    expect(mockGetLastResponse).toHaveBeenCalledTimes(1);
    expect(mockRouterPush).toHaveBeenCalledTimes(1);
  });

  it('no se suscribe ni consulta la respuesta sin sesión', async () => {
    mockUseAuth.mockReturnValue({
      ...authenticatedAuth(),
      status: 'unauthenticated',
      token: null,
    });

    await renderHook(() => usePushRegistration());

    expect(mockAddResponseListener).not.toHaveBeenCalled();
    expect(mockGetLastResponse).not.toHaveBeenCalled();
  });

  it('retira el listener al desmontar', async () => {
    const probe = await renderHook(() => usePushRegistration());
    await waitFor(() => {
      expect(mockAddResponseListener).toHaveBeenCalledTimes(1);
    });

    await probe.unmount();

    expect(mockRemoveResponseListener).toHaveBeenCalledTimes(1);
  });
});

function useRegistrationProbe(): boolean {
  usePushRegistration();
  return useNotificationsBlocked();
}

async function flushEvaluation(): Promise<void> {
  await act(async () => undefined);
}

describe('#99 R1: el hook publica el bloqueo solo con el permiso denegado y sin poder pedirse', () => {
  it.each([
    ['denegado y canAskAgain false de entrada: aviso, sin diálogo', permission(false, false), undefined, true, 0],
    ['segunda negativa en este arranque: aviso tras el diálogo', permission(false, true), permission(false, false), true, 1],
    ['primera negativa: sin aviso, el diálogo vuelve en el siguiente arranque', permission(false, true), permission(false, true), false, 1],
    ['concedido de entrada: sin aviso', permission(true, true), undefined, false, 0],
    ['concedido en el diálogo: sin aviso', permission(false, true), permission(true, true), false, 1],
  ] as const)('%s', async (_title, inicial, pedido, bloqueado, peticiones) => {
    mockGetPermissions.mockResolvedValue(inicial);
    if (pedido !== undefined) mockRequestPermissions.mockResolvedValue(pedido);

    const probe = await renderHook(() => useRegistrationProbe());
    await waitFor(() => {
      if (inicial.granted || pedido?.granted) {
        expect(mockRegisterPushToken).toHaveBeenCalledTimes(1);
      } else {
        expect(warnSpy).toHaveBeenCalledWith('[push] skipped: notification permission denied');
      }
    });
    await flushEvaluation();

    expect(probe.result.current).toBe(bloqueado);
    expect(mockGetPermissions).toHaveBeenCalledTimes(1);
    expect(mockRequestPermissions).toHaveBeenCalledTimes(peticiones);
  });

  it('al desmontar el aviso se apaga', async () => {
    mockGetPermissions.mockResolvedValue(permission(false, false));
    const probe = await renderHook(() => useRegistrationProbe());
    const observer = await renderHook(() => useNotificationsBlocked());

    await waitFor(() => expect(observer.result.current).toBe(true));
    await probe.unmount();

    expect(observer.result.current).toBe(false);
  });

  it('una evaluación que termina después de desmontar no enciende el aviso', async () => {
    let resolvePermission!: (value: Notifications.NotificationPermissionsStatus) => void;
    mockGetPermissions.mockReturnValue(new Promise((resolve) => {
      resolvePermission = resolve;
    }));
    const probe = await renderHook(() => useRegistrationProbe());
    const observer = await renderHook(() => useNotificationsBlocked());
    await waitFor(() => expect(mockGetPermissions).toHaveBeenCalledTimes(1));

    await probe.unmount();
    await act(async () => { resolvePermission(permission(false, false)); });

    expect(warnSpy).toHaveBeenCalledWith('[push] skipped: notification permission denied');
    expect(observer.result.current).toBe(false);
  });
});

const mockAddAppStateListener = jest.mocked(AppState.addEventListener);
const mockRemoveAppStateListener = jest.fn();
let appStateListener: ((state: AppStateStatus) => void) | undefined;

function captureAppStateListener(): void {
  appStateListener = undefined;
  mockAddAppStateListener.mockImplementation((_type, listener) => {
    appStateListener = listener;
    return { remove: mockRemoveAppStateListener };
  });
}

describe('#99 R2: al volver a primer plano con el aviso encendido se reevalúa el permiso sin pedirlo', () => {
  beforeEach(() => {
    mockGetPermissions.mockReset();
    mockGetPermissions.mockResolvedValue(permission(true, true));
    captureAppStateListener();
  });

  it.each([
    ['concedido en los ajustes: registra el token y apaga el aviso sin reiniciar', permission(true, true), 1, false],
    ['sigue denegado: no registra y el aviso sigue', permission(false, false), 2, true],
    ['denegado pero canAskAgain vuelve a true: tampoco lanza el diálogo aquí', permission(false, true), 2, false],
  ] as const)('al volver a active, %s', async (_title, relectura, avisos, bloqueado) => {
    mockGetPermissions.mockResolvedValueOnce(permission(false, false)).mockResolvedValueOnce(relectura);
    const probe = await renderHook(() => useRegistrationProbe());
    await waitFor(() => expect(probe.result.current).toBe(true));
    expect(mockAddAppStateListener).toHaveBeenCalledTimes(1);
    expect(mockAddAppStateListener).toHaveBeenCalledWith('change', expect.any(Function));

    await act(async () => { appStateListener?.('active'); });
    await waitFor(() => {
      expect(warnSpy).toHaveBeenCalledTimes(avisos);
      expect(mockRegisterPushToken).toHaveBeenCalledTimes(relectura.granted ? 1 : 0);
    });
    await flushEvaluation();

    expect(probe.result.current).toBe(bloqueado);
    expect(mockGetPermissions).toHaveBeenCalledTimes(2);
    expect(mockRequestPermissions).not.toHaveBeenCalled();
    expect(mockSetPushToken.mock.calls).toEqual(relectura.granted ? [['ExpoPushToken[xxx]']] : []);
    expect(mockRegisterPushToken.mock.calls).toEqual(relectura.granted ? [
      ['http://example.test/v1', 'jwt-token', { expoToken: 'ExpoPushToken[xxx]', platform: 'android' }],
    ] : []);
  });

  it.each([
    ['concedido de entrada, vuelve a active', permission(true, true), undefined, 'active'],
    ['primera negativa, vuelve a active', permission(false, true), permission(false, true), 'active'],
    ['aviso encendido, pasa a background', permission(false, false), undefined, 'background'],
  ] as const)('no reevalúa: %s', async (_title, inicial, pedido, estado) => {
    mockGetPermissions.mockResolvedValue(inicial);
    if (pedido !== undefined) mockRequestPermissions.mockResolvedValue(pedido);
    await renderHook(() => useRegistrationProbe());
    await waitFor(() => {
      if (inicial.granted) {
        expect(mockRegisterPushToken).toHaveBeenCalledTimes(1);
      } else {
        expect(warnSpy).toHaveBeenCalledTimes(1);
      }
    });

    await act(async () => { appStateListener?.(estado); });
    await flushEvaluation();

    expect(mockAddAppStateListener).toHaveBeenCalledTimes(1);
    expect(mockGetPermissions).toHaveBeenCalledTimes(1);
    expect(mockRegisterPushToken).toHaveBeenCalledTimes(inicial.granted ? 1 : 0);
  });

  it('retira el listener de AppState al desmontar', async () => {
    const probe = await renderHook(() => useRegistrationProbe());
    await waitFor(() => expect(mockAddAppStateListener).toHaveBeenCalledTimes(1));
    await probe.unmount();
    expect(mockRemoveAppStateListener).toHaveBeenCalledTimes(1);
  });

  it('sin precondiciones no se suscribe a AppState', async () => {
    mockUseAuth.mockReturnValue({
      ...authenticatedAuth(), status: 'unauthenticated', token: null,
    });
    await renderHook(() => useRegistrationProbe());
    expect(mockAddAppStateListener).not.toHaveBeenCalled();
  });
});

describe('R15: importar el modulo no toca expo-notifications', () => {
  it('omite push en Expo Go y nombra la salida', async () => {
    mockExecutionEnvironment = 'storeClient';

    await renderHook(() => usePushRegistration());

    expectNoPushSideEffects();
    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(warnSpy).toHaveBeenCalledWith(
      '[push] skipped: Expo Go does not support remote notifications',
    );
  });

  it('no accede a expo-notifications al importar el modulo', () => {
    const expoGoImportError = new Error(
      'expo-notifications unavailable in Expo Go',
    );

    jest.resetModules();

    expect(() =>
      jest.isolateModules(() => {
        jest.doMock(
          'expo-notifications',
          () =>
            new Proxy(
              {},
              {
                get() {
                  throw expoGoImportError;
                },
              },
            ),
        );

        jest.requireActual('./use-push-registration');
      }),
    ).not.toThrow();
  });
});
