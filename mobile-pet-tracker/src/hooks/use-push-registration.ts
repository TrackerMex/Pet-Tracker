import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';
import { Platform } from 'react-native';

import { registerPushToken } from '../api/push-tokens';
import { useAuth } from '../providers/auth-provider';

function getProjectId(): string | undefined {
  const projectId = Constants.expoConfig?.extra?.eas?.projectId;
  return typeof projectId === 'string' && projectId.length > 0
    ? projectId
    : undefined;
}

export function usePushRegistration(): void {
  const { setPushToken, status, token } = useAuth();

  useEffect(() => {
    if (status !== 'authenticated' || token === null || !setPushToken) return;
    if (!Device.isDevice) return;
    const platform = Platform.OS;
    if (platform !== 'android' && platform !== 'ios') return;
    const projectId = getProjectId();
    if (!projectId) return;

    void (async () => {
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
      if (!permissions.granted) return;

      const expoToken = (
        await Notifications.getExpoPushTokenAsync({ projectId })
      ).data;
      setPushToken(expoToken);
      await registerPushToken(process.env.EXPO_PUBLIC_API_URL, token, {
        expoToken,
        platform,
      });
    })();
  }, [setPushToken, status, token]);
}
