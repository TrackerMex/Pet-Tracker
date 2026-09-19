import { render, screen } from '@testing-library/react-native';
import * as Notifications from 'expo-notifications';
import { usePathname } from 'expo-router';
import { Text } from 'react-native';

import { registerPushToken } from '../api/push-tokens';
import { useAuth, type AuthContextValue } from '../providers/auth-provider';
import { usePushRegistration } from './use-push-registration';

let mockHistory = ['/'];

function mockPush(pathname: string): void {
  mockHistory.push(pathname);
}

function mockReplace(pathname: string): void {
  mockHistory[mockHistory.length - 1] = pathname;
}

function mockBack(): void {
  if (mockHistory.length > 1) mockHistory.pop();
}

function mockCanGoBack(): boolean {
  return mockHistory.length > 1;
}

jest.mock('expo-router', () => {
  const getPathname = () => mockHistory[mockHistory.length - 1]!;

  return {
    router: {
      push: mockPush,
      replace: mockReplace,
      back: mockBack,
      canGoBack: mockCanGoBack,
    },
    usePathname: getPathname,
  };
});
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

function App() {
  usePushRegistration();
  const pathname = usePathname();

  if (pathname === '/alerts') {
    return <Text testID="alerts-route">Alerts</Text>;
  }
  if (pathname === '/home') {
    return <Text testID="home-route">Home</Text>;
  }
  return <Text testID="launch-route">Launch</Text>;
}

describe('R10: cold start conserva alertas frente al redirect autenticado', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockHistory = ['/'];
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
    mockRegisterPushToken.mockResolvedValue({ kind: 'ok' });
  });

  it('termina en alertas y vuelve una sola vez a Home', async () => {
    let resolveLastResponse!: (
      response: Notifications.NotificationResponse,
    ) => void;
    const lastResponse = new Promise<Notifications.NotificationResponse>(
      (resolve) => {
        resolveLastResponse = resolve;
      },
    );
    mockGetLastResponse.mockReturnValue(lastResponse);
    const app = await render(<App />);

    resolveLastResponse({} as Notifications.NotificationResponse);
    await lastResponse;
    await app.rerender(<App />);

    // Es el replace que deja pendiente <Redirect href="/home" /> al arrancar.
    mockReplace('/home');
    await app.rerender(<App />);
    await Promise.resolve();
    await app.rerender(<App />);

    expect(screen.getByTestId('alerts-route')).toBeOnTheScreen();

    mockBack();
    await app.rerender(<App />);
    expect(screen.getByTestId('home-route')).toBeOnTheScreen();
    expect(mockCanGoBack()).toBe(false);
  });
});
