import { renderHook, waitFor } from '@testing-library/react-native';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import { registerPushToken } from '../api/push-tokens';
import { useAuth, type AuthContextValue } from '../providers/auth-provider';
import { usePushRegistration } from './use-push-registration';

let mockIsDevice = true;
let mockProjectId: string | undefined = 'project-id';

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
    get expoConfig() {
      return {
        extra: { eas: { projectId: mockProjectId } },
      };
    },
  },
}));
jest.mock('expo-router', () => ({
  router: { push: jest.fn() },
}));
jest.mock('../api/push-tokens', () => ({
  registerPushToken: jest.fn(),
}));
jest.mock('../providers/auth-provider', () => ({
  useAuth: jest.fn(),
}));

const mockUseAuth = jest.mocked(useAuth);
const mockRegisterPushToken = jest.mocked(registerPushToken);
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
  jest.mocked(Notifications.setNotificationHandler),
  mockSetNotificationChannel,
  mockGetPermissions,
  mockRequestPermissions,
  mockGetExpoPushToken,
  mockAddResponseListener,
  mockGetLastResponse,
];
const originalPlatform = Platform.OS;
const originalApiUrl = process.env.EXPO_PUBLIC_API_URL;
const mockSetPushToken = jest.fn();

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
  mockIsDevice = true;
  mockProjectId = 'project-id';
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
  mockAddResponseListener.mockReturnValue({ remove: jest.fn() });
  mockGetLastResponse.mockResolvedValue(null);
  mockRegisterPushToken.mockResolvedValue({ kind: 'ok' });
});

afterAll(() => {
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
  });

  it('no hace nada fuera de un dispositivo físico', async () => {
    mockIsDevice = false;

    await renderHook(() => usePushRegistration());

    expectNoPushSideEffects();
  });

  it('no hace nada en una plataforma no soportada', async () => {
    setPlatform('web');

    await renderHook(() => usePushRegistration());

    expectNoPushSideEffects();
  });

  it.each([undefined, ''])('no hace nada con projectId %p', async (projectId) => {
    mockProjectId = projectId;

    await renderHook(() => usePushRegistration());

    expectNoPushSideEffects();
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
    mockGetExpoPushToken.mockRejectedValue(new Error('offline'));

    const probe = await renderHook(() => {
      usePushRegistration();
      return 'mounted';
    });

    await waitFor(() => {
      expect(mockGetExpoPushToken).toHaveBeenCalledTimes(1);
      expect(mockRegisterPushToken).not.toHaveBeenCalled();
      expect(probe.result.current).toBe('mounted');
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
