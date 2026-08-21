import { Redirect, Stack } from 'expo-router';

import { useAuth } from '../../providers/auth-provider';

export default function AuthLayout() {
  const { status } = useAuth();

  if (status === 'authenticated') {
    return <Redirect href="/home" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
