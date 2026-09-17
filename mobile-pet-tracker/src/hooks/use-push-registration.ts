import Constants from 'expo-constants';
import * as Device from 'expo-device';
import { useEffect } from 'react';
import { Platform } from 'react-native';

import { useAuth } from '../providers/auth-provider';

function getProjectId(): string | undefined {
  const projectId = Constants.expoConfig?.extra?.eas?.projectId;
  return typeof projectId === 'string' && projectId.length > 0
    ? projectId
    : undefined;
}

export function usePushRegistration(): void {
  const { status, token } = useAuth();

  useEffect(() => {
    if (status !== 'authenticated' || token === null) return;
    if (!Device.isDevice) return;
    if (Platform.OS !== 'android' && Platform.OS !== 'ios') return;
    if (!getProjectId()) return;
  }, [status, token]);
}
