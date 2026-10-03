import { act, renderRouter, screen, waitFor } from 'expo-router/testing-library';
import { router, Stack } from 'expo-router';
import * as Notifications from 'expo-notifications';
import { Text } from 'react-native';

import { registerPushToken } from '../api/push-tokens';
import { useAuth, type AuthContextValue } from '../providers/auth-provider';
import { usePushRegistration } from './use-push-registration';

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
jest.mock('standard-navigation', () => ({}));
jest.mock('expo-device', () => ({ isDevice: true }));
jest.mock('expo-constants', () => ({
  __esModule: true,
  default: { expoConfig: { extra: { eas: { projectId: 'project-id' } } } },
}));
jest.mock('../api/push-tokens', () => ({ registerPushToken: jest.fn() }));
jest.mock('../providers/auth-provider', () => ({ useAuth: jest.fn() }));

const mockUseAuth = jest.mocked(useAuth);
const mockRegisterPushToken = jest.mocked(registerPushToken);
const mockGetPermissions = jest.mocked(Notifications.getPermissionsAsync);
const mockGetExpoPushToken = jest.mocked(
  Notifications.getExpoPushTokenAsync,
);
const mockAddResponseListener = jest.mocked(
  Notifications.addNotificationResponseReceivedListener,
);
const mockGetLastResponse = jest.mocked(
  Notifications.getLastNotificationResponseAsync,
);

function authenticatedAuth(): AuthContextValue {
  return {
    status: 'authenticated',
    token: 'jwt-token',
    signIn: jest.fn(),
    signOut: jest.fn(),
    setPushToken: jest.fn(),
  };
}

function PushRegistration() {
  usePushRegistration();
  return null;
}

function TestLayout() {
  return (
    <>
      <PushRegistration />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}

function Home() {
  return <Text testID="home-route">Home</Text>;
}

function Launch() {
  return <Text>Launch</Text>;
}

function Alerts() {
  return <Text testID="alerts-route">Alerts</Text>;
}

describe('R10: cold start conserva alertas frente al redirect autenticado', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuth.mockReturnValue(authenticatedAuth());
    mockGetPermissions.mockResolvedValue({
      granted: true,
      canAskAgain: true,
    } as Notifications.NotificationPermissionsStatus);
    mockGetExpoPushToken.mockResolvedValue({
      type: 'expo',
      data: 'ExpoPushToken[xxx]',
    });
    mockAddResponseListener.mockReturnValue({ remove: jest.fn() });
    mockGetLastResponse.mockResolvedValue(
      {} as Notifications.NotificationResponse,
    );
    mockRegisterPushToken.mockResolvedValue({ kind: 'ok' });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('termina en alertas y vuelve una sola vez a Home', async () => {
    let resolveLastResponse!: (
      response: Notifications.NotificationResponse,
    ) => void;
    mockGetLastResponse.mockReturnValue(
      new Promise((resolve) => {
        resolveLastResponse = resolve;
      }),
    );
    const app = renderRouter(
      {
        _layout: TestLayout,
        index: Launch,
        home: Home,
        alerts: Alerts,
      },
      { initialUrl: '/' },
    );

    await act(async () => {
      resolveLastResponse({} as Notifications.NotificationResponse);
    });
    act(() => router.replace('/home'));

    await waitFor(() => {
      expect(app.getPathname()).toBe('/alerts');
      expect(screen.getByTestId('alerts-route')).toBeOnTheScreen();
    });

    act(() => router.back());
    await waitFor(() => {
      expect(app.getPathname()).toBe('/home');
      expect(screen.getByTestId('home-route')).toBeOnTheScreen();
    });
    expect(router.canGoBack()).toBe(false);
  });
});
