import * as SecureStore from 'expo-secure-store';

import type { Language } from '../i18n/catalog';

const LANGUAGE_PREFERENCE_KEY = 'language_preference';

export async function getStoredLanguage(): Promise<Language | undefined> {
  try {
    const value = await SecureStore.getItemAsync(LANGUAGE_PREFERENCE_KEY);
    return value === 'es' || value === 'en' ? value : undefined;
  } catch {
    return undefined;
  }
}

export async function setStoredLanguage(language: Language): Promise<void> {
  try {
    await SecureStore.setItemAsync(LANGUAGE_PREFERENCE_KEY, language);
  } catch {
    // Language persistence is best-effort and must never break the active UI.
  }
}
