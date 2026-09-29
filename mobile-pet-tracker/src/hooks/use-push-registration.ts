import Constants from 'expo-constants';
import * as Device from 'expo-device';
import { type NotificationResponse, setNotificationHandler } from 'expo-notifications';
import { router, usePathname, type Href } from 'expo-router';
import { useEffect, useRef, useSyncExternalStore } from 'react';
import { AppState, Platform } from 'react-native';

import { registerPushToken } from '../api/push-tokens';
import { useAuth } from '../providers/auth-provider';

type NotificationsModule = typeof import('expo-notifications');

function notificationHref(response: NotificationResponse): Href {
  const alertId = response.notification?.request.content.data?.alertId;
  return typeof alertId === 'string' && alertId.length > 0
    ? { pathname: '/alerts/[alertId]', params: { alertId } }
    : '/alerts';
}

function getProjectId(): string | undefined {
  const projectId = Constants.expoConfig?.extra?.eas?.projectId;
  return typeof projectId === 'string' && projectId.length > 0
    ? projectId
    : undefined;
}

function warnPush(reason: string, error?: unknown): void {
  if (__DEV__) {
    console.warn(
      `[push] ${reason}`,
      ...(error === undefined ? [] : [error]),
    );
  }
}

let notificationsBlocked = false;
const blockedListeners = new Set<() => void>();

function subscribeNotificationsBlocked(listener: () => void): () => void {
  blockedListeners.add(listener);
  return () => { blockedListeners.delete(listener); };
}

function setNotificationsBlocked(blocked: boolean): void {
  if (notificationsBlocked === blocked) return;
  notificationsBlocked = blocked;
  for (const listener of blockedListeners) listener();
}

export function useNotificationsBlocked(): boolean {
  return useSyncExternalStore(subscribeNotificationsBlocked, () => notificationsBlocked);
}

export function usePushRegistration(): void {
  const { setPushToken, status, token } = useAuth();
  const handledInitialResponse = useRef(false);
  const notifications = useRef<NotificationsModule | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    notifications.current = null;
    if (status !== 'authenticated' || token === null) {
      warnPush('skipped: unauthenticated or missing auth token');
      return;
    }
    if (!setPushToken) {
      warnPush('skipped: setPushToken unavailable');
      return;
    }
    if (!Device.isDevice) {
      warnPush('skipped: physical device required');
      return;
    }
    if (Constants.executionEnvironment === 'storeClient') {
      warnPush('skipped: Expo Go does not support remote notifications');
      return;
    }
    const platform = Platform.OS;
    if (platform !== 'android' && platform !== 'ios') {
      warnPush(`skipped: unsupported platform (${platform})`);
      return;
    }
    const projectId = getProjectId();
    if (!projectId) {
      warnPush('skipped: EAS projectId missing');
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const Notifications = require('expo-notifications') as NotificationsModule;
    setNotificationHandler({
      handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });
    const responseSubscription =
      Notifications.addNotificationResponseReceivedListener((response) => {
        router.push(notificationHref(response));
    });
    notifications.current = Notifications;

    let active = true;
    const evaluate = async (ask: boolean): Promise<void> => {
      try {
        if (platform === 'android') {
          await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
          });
        }

        let permissions = await Notifications.getPermissionsAsync();
        if (ask && !permissions.granted && permissions.canAskAgain) {
          permissions = await Notifications.requestPermissionsAsync();
        }
        if (active) setNotificationsBlocked(!permissions.granted && !permissions.canAskAgain);
        if (!permissions.granted) {
          warnPush('skipped: notification permission denied');
          return;
        }

        const expoToken = (
          await Notifications.getExpoPushTokenAsync({ projectId })
        ).data;
        setPushToken(expoToken);
        await registerPushToken(process.env.EXPO_PUBLIC_API_URL, token, {
          expoToken,
          platform,
        });
      } catch (error) {
        warnPush('registration failed', error);
        // Registration is best-effort and runs again on the next app start.
      }
    };
    void evaluate(true);
    const appStateSubscription = AppState.addEventListener('change', (state) => {
      if (state === 'active' && notificationsBlocked) void evaluate(false);
    });

    return () => {
      active = false;
      setNotificationsBlocked(false);
      appStateSubscription.remove();
      responseSubscription.remove();
    };
  }, [setPushToken, status, token]);

  useEffect(() => {
    const Notifications = notifications.current;
    if (
      !Notifications ||
      pathname === '/' ||
      handledInitialResponse.current
    ) {
      return;
    }

    handledInitialResponse.current = true;
    void Notifications.getLastNotificationResponseAsync()
      .then((response) => {
        if (response) router.push(notificationHref(response));
      })
      .catch(() => undefined);
  }, [pathname, setPushToken, status, token]);
}
