import { render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';

import { en, es } from '../../i18n/catalog';
import {
  LanguageProvider,
  useLanguage,
  useLocale,
  useTranslate,
} from '../language-provider';

const markerNames = (value: string) =>
  [...value.matchAll(/{{([^{}]+)}}/g)].map((match) => match[1]).sort();

function TranslationProbe() {
  const { language } = useLanguage();
  const t = useTranslate();

  return (
    <>
      <Text testID="language">{language}</Text>
      <Text testID="plain">{t('login.signIn')}</Text>
      <Text testID="interpolated">
        {t('home.lastSeen', { date: '06/09/2026' })}
      </Text>
      <Text testID="missing-param">{t('home.lastSeen')}</Text>
    </>
  );
}

function LocaleProbe() {
  return <Text testID="locale">{useLocale()}</Text>;
}

describe('#65 R12: el catálogo tiene los dos idiomas y t resuelve claves y parámetros', () => {
  // 259 en `303fc19` + 1 de `home.walks` (#67 R7b) + 16 de #68.
  it('mantiene la base más las claves de #68 y los mismos marcadores en ambos idiomas', () => {
    const englishKeys = Object.keys(en).sort();
    const spanishKeys = Object.keys(es).sort();

    expect(englishKeys).toHaveLength(260 + 16 + 1);
    expect(spanishKeys).toEqual(englishKeys);
    for (const key of englishKeys) {
      expect(markerNames(es[key as keyof typeof es])).toEqual(
        markerNames(en[key as keyof typeof en]),
      );
    }
  });

  it('usa español por defecto, traduce e interpola sin ocultar parámetros ausentes', async () => {
    await render(
      <LanguageProvider>
        <TranslationProbe />
      </LanguageProvider>,
    );

    expect(screen.getByTestId('language')).toHaveTextContent('es');
    expect(screen.getByTestId('plain')).toHaveTextContent('Iniciar sesión');
    expect(screen.getByTestId('interpolated')).toHaveTextContent(
      'Última señal 06/09/2026',
    );
    expect(screen.getByTestId('missing-param')).toHaveTextContent(
      'Última señal {{date}}',
    );
  });
});

describe('#65 R15: el locale de fechas y números sigue al idioma elegido', () => {
  it.each([
    ['es', 'es-MX'],
    ['en', 'en-US'],
  ] as const)('maps %s to %s', async (language, locale) => {
    await render(
      <LanguageProvider initial={language}>
        <LocaleProbe />
      </LanguageProvider>,
    );

    expect(screen.getByTestId('locale')).toHaveTextContent(locale);
  });
});
