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
