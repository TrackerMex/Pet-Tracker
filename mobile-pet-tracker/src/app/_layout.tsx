import '../theme/global.css';

import { Stack } from 'expo-router';
import { HeroUINativeProvider } from 'heroui-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { AuthProvider } from '../providers/auth-provider';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <HeroUINativeProvider>
        <AuthProvider>
          <Stack screenOptions={{ headerShown: false }} />
        </AuthProvider>
      </HeroUINativeProvider>
    </GestureHandlerRootView>
  );
}
