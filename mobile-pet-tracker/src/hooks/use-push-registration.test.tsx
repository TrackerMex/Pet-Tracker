import { renderHook } from '@testing-library/react-native';
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
const notificationMocks = [
  jest.mocked(Notifications.setNotificationHandler),
  jest.mocked(Notifications.setNotificationChannelAsync),
  jest.mocked(Notifications.getPermissionsAsync),
  jest.mocked(Notifications.requestPermissionsAsync),
  jest.mocked(Notifications.getExpoPushTokenAsync),
  jest.mocked(Notifications.addNotificationResponseReceivedListener),
  jest.mocked(Notifications.getLastNotificationResponseAsync),
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
