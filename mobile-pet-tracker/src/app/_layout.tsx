import '../theme/global.css';

import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { HeroUINativeProvider } from 'heroui-native';
import { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Uniwind } from 'uniwind';

import { AuthProvider } from '../providers/auth-provider';
import { getStoredTheme } from '../utils/theme-preference';

export default function RootLayout() {
  const [themeReady, setThemeReady] = useState(false);
  useFonts({
    'Inter-Regular': require('../../assets/fonts/Inter-Regular.ttf'),
    'Inter-Medium': require('../../assets/fonts/Inter-Medium.ttf'),
    'Inter-SemiBold': require('../../assets/fonts/Inter-SemiBold.ttf'),
    'Inter-Bold': require('../../assets/fonts/Inter-Bold.ttf'),
    'Inter-Black': require('../../assets/fonts/Inter-Black.ttf'),
  });

  useEffect(() => {
    let mounted = true;

    void getStoredTheme().then((theme) => {
      if (!mounted) return;
      if (theme) Uniwind.setTheme(theme);
      setThemeReady(true);
    });

    return () => {
      mounted = false;
    };
  }, []);

  if (!themeReady) return <></>;

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
