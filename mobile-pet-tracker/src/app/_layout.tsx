import '../theme/global.css';

import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { HeroUINativeProvider } from 'heroui-native';
import { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Uniwind } from 'uniwind';

import { usePushRegistration } from '../hooks/use-push-registration';
import { DEFAULT_LANGUAGE, type Language } from '../i18n/catalog';
import { AuthProvider, useAuth } from '../providers/auth-provider';
import { LanguageProvider } from '../providers/language-provider';
import { QueryProvider } from '../providers/query-provider';
import { SelectedPetProvider } from '../providers/selected-pet-provider';
import { useThemeColors } from '../theme/use-theme-colors';
import { getStoredLanguage } from '../utils/language-preference';
import { getStoredTheme } from '../utils/theme-preference';

function PushRegistration() {
  usePushRegistration();
  const empty = null;
  return empty;
}

export default function RootLayout() {
  const [themeReady, setThemeReady] = useState(false);
  const [initialLanguage, setInitialLanguage] =
    useState<Language>(DEFAULT_LANGUAGE);
  useFonts({
    'Inter-Regular': require('../../assets/fonts/Inter-Regular.ttf'),
    'Inter-Medium': require('../../assets/fonts/Inter-Medium.ttf'),
    'Inter-SemiBold': require('../../assets/fonts/Inter-SemiBold.ttf'),
    'Inter-Bold': require('../../assets/fonts/Inter-Bold.ttf'),
    'Inter-ExtraBold': require('../../assets/fonts/Inter-ExtraBold.ttf'),
    'Inter-Black': require('../../assets/fonts/Inter-Black.ttf'),
  });

  useEffect(() => {
    let mounted = true;

    void Promise.all([getStoredTheme(), getStoredLanguage()]).then(
      ([theme, language]) => {
        if (!mounted) return;
        if (theme) Uniwind.setTheme(theme);
        if (language) setInitialLanguage(language);
        setThemeReady(true);
      },
    );

    return () => {
      mounted = false;
    };
  }, []);

  if (!themeReady) return <></>;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <HeroUINativeProvider>
        <LanguageProvider initial={initialLanguage}>
          <AuthProvider>
            <QueryProvider>
              <SelectedPetProvider>
                <PushRegistration />
                <RootStack />
              </SelectedPetProvider>
            </QueryProvider>
          </AuthProvider>
        </LanguageProvider>
      </HeroUINativeProvider>
    </GestureHandlerRootView>
  );
}

function RootStack() {
  const { status } = useAuth();
  const [background, foreground] = useThemeColors(['background', 'foreground']);
  const headerOptions = {
    headerShown: true,
    headerStyle: { backgroundColor: background },
    headerTintColor: foreground,
    headerTitleStyle: { fontFamily: 'Inter-Bold' },
    headerShadowVisible: false,
  };

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="reset-password" />
      <Stack.Protected guard={status === 'authenticated'}>
        <Stack.Screen name="add-reminder" options={{ headerShown: false }} />
        <Stack.Screen name="pets/add" options={{ headerShown: false }} />
        <Stack.Screen name="pets/[petId]/docs" options={{ headerShown: false }} />
        <Stack.Screen name="pets/[petId]/docs-upload" options={{ ...headerOptions, title: '' }} />
        <Stack.Screen name="weight-log" options={{ headerShown: false }} />
            <Stack.Screen name="meal-schedule" options={{ headerShown: false }} />
        <Stack.Screen name="pairing" options={{ headerShown: false }} />
        <Stack.Screen name="reminders" options={{ headerShown: false }} />
        <Stack.Screen name="alerts" dangerouslySingular options={{ headerShown: false }} />
        <Stack.Screen name="alerts/[alertId]" dangerouslySingular options={{ headerShown: false, contentStyle: { backgroundColor: background } }} />
        <Stack.Screen name="pets/[petId]/geofences" options={{ headerShown: false }} />
        <Stack.Screen name="pets/[petId]/geofence-editor" options={{ headerShown: false }} />
        <Stack.Screen name="meals-history" options={{ headerShown: false }} />
        <Stack.Screen name="pets/[petId]/vaccines/new" options={{ headerShown: false }} />
        <Stack.Screen name="edit-profile" options={{ ...headerOptions, title: '' }} />
      </Stack.Protected>
      <Stack.Protected guard={status !== 'authenticated'}>
        <Stack.Screen name="welcome" />
      </Stack.Protected>
    </Stack>
  );
}
