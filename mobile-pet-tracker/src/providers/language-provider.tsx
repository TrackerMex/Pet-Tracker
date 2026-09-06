import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

import {
  catalog,
  DEFAULT_LANGUAGE,
  type Language,
  LOCALES,
  type TranslationKey,
} from '../i18n/catalog';

interface LanguageContextValue {
  language: Language;
  setLanguage: (language: Language) => void;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(
  undefined,
);

export function LanguageProvider({
  initial = DEFAULT_LANGUAGE,
  children,
}: {
  initial?: Language;
  children: ReactNode;
}) {
  const [language, setLanguageState] = useState<Language>(initial);
  const setLanguage = useCallback(
    (nextLanguage: Language) => setLanguageState(nextLanguage),
    [],
  );
  const value = useMemo(
    () => ({ language, setLanguage }),
    [language, setLanguage],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const value = useContext(LanguageContext);

  if (!value) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }

  return value;
}

export function useTranslate(): (
  key: TranslationKey,
  params?: Record<string, string | number>,
) => string {
  const { language } = useLanguage();

  return useCallback(
    (key, params) =>
      catalog[language][key].replace(
        /{{([^{}]+)}}/g,
        (marker, name: string) =>
          params?.[name] === undefined ? marker : String(params[name]),
      ),
    [language],
  );
}

export function useLocale(): string {
  const { language } = useLanguage();
  return LOCALES[language];
}
