import * as SecureStore from 'expo-secure-store';

const THEME_PREFERENCE_KEY = 'theme_preference';

export type ThemePreference = 'light' | 'dark';

export async function getStoredTheme(): Promise<ThemePreference | undefined> {
  try {
    const value = await SecureStore.getItemAsync(THEME_PREFERENCE_KEY);
    return value === 'light' || value === 'dark' ? value : undefined;
  } catch {
    return undefined;
  }
}

export async function setStoredTheme(theme: ThemePreference): Promise<void> {
  try {
    await SecureStore.setItemAsync(THEME_PREFERENCE_KEY, theme);
  } catch {
    // Theme persistence is best-effort and must never break the active UI.
  }
}
