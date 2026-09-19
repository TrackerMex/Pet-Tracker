import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { router, usePathname } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Platform } from 'react-native';

import { registerPushToken } from '../api/push-tokens';
import { useAuth } from '../providers/auth-provider';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

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

export function usePushRegistration(): void {
  const { setPushToken, status, token } = useAuth();
  const handledInitialResponse = useRef(false);
  const pushReady = useRef(false);
  const pathname = usePathname();

  useEffect(() => {
    pushReady.current = false;
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

    pushReady.current = true;
    const responseSubscription =
      Notifications.addNotificationResponseReceivedListener(() => {
        router.push('/alerts');
      });

    void (async () => {
      try {
        if (platform === 'android') {
          await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
          });
        }

        let permissions = await Notifications.getPermissionsAsync();
        if (!permissions.granted && permissions.canAskAgain) {
          permissions = await Notifications.requestPermissionsAsync();
        }
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
    })();

    return () => responseSubscription.remove();
  }, [setPushToken, status, token]);

  useEffect(() => {
    if (
      !pushReady.current ||
      pathname === '/' ||
      handledInitialResponse.current
    ) {
      return;
    }

    handledInitialResponse.current = true;
    void Notifications.getLastNotificationResponseAsync()
      .then((response) => {
        if (response) router.push('/alerts');
      })
      .catch(() => undefined);
  }, [pathname, setPushToken, status, token]);
}
