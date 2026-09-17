import { render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';

import { en, es } from '../../i18n/catalog';
import {
  LanguageProvider,
  useLanguage,
  useLocale,
  useTranslate,
} from '../language-provider';

declare function require(moduleName: 'fs'): {
  readFileSync: (path: string, encoding: 'utf8') => string;
};

declare function require(moduleName: 'path'): {
  join: (...paths: string[]) => string;
};

const { readFileSync } = require('fs');
const { join } = require('path');

const markerNames = (value: string) =>
  [...value.matchAll(/{{([^{}]+)}}/g)].map((match) => match[1]).sort();

const escapeRegExp = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

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
  // 259 en `303fc19` + 1 de `home.walks` (#67 R7b) + 16 de #68 + 14 de #78 + 2 de #73 + 1 de #90.
  it('mantiene la base más las claves de #68 y los mismos marcadores en ambos idiomas', () => {
    const englishKeys = Object.keys(en).sort();
    const spanishKeys = Object.keys(es).sort();

    expect(englishKeys).toHaveLength(260 + 16 + 1 + 4 + 7 + 14 + 2 + 1);
    expect(spanishKeys).toEqual(englishKeys);
    for (const key of englishKeys) {
      expect(markerNames(es[key as keyof typeof es])).toEqual(
        markerNames(en[key as keyof typeof en]),
      );
    }
  });

  it('#73 R5: el catalogo trae home.unknown y deviceConnectivity.offline en los dos idiomas y registrados en la tabla', () => {
    const english = en as Record<string, string>;
    const spanish = es as Record<string, string>;
    const languageDesign = readFileSync(
      join(process.cwd(), '../specs/mobile-ui-language/design.md'),
      'utf8',
    );
    const translations = [
      ['home.unknown', 'Awaiting signal', 'Esperando señal'],
      ['deviceConnectivity.offline', 'Offline', 'Sin conexión'],
    ] as const;

    for (const [key, englishValue, spanishValue] of translations) {
      expect(english[key]).toBe(englishValue);
      expect(spanish[key]).toBe(spanishValue);
      expect(languageDesign).toMatch(
        new RegExp(
          '\\| — \\| `' +
            escapeRegExp(key) +
            '`[^\\n]*← añadida por #73 \\(R5\\)',
        ),
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

describe('#90 R2: el catálogo trae weightLog.dateCannotBeAfterToday en los dos idiomas y registrada en la tabla', () => {
  it('incluye la traducción y su fila normativa', () => {
    const english = en as Record<string, string>;
    const spanish = es as Record<string, string>;
    const languageDesign = readFileSync(
      join(process.cwd(), '../specs/mobile-ui-language/design.md'),
      'utf8',
    );
    const translations = [
      [
        'weightLog.dateCannotBeAfterToday',
        'Date cannot be after today',
        'La fecha no puede ser posterior a hoy',
      ],
    ] as const;

    for (const [key, englishValue, spanishValue] of translations) {
      expect(english[key]).toBe(englishValue);
      expect(spanish[key]).toBe(spanishValue);
      expect(languageDesign).toMatch(
        new RegExp(
          '\\| — \\| `' +
            escapeRegExp(key) +
            '`[^\\n]*← añadida por #90 \\(R2\\)',
        ),
      );
    }
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

describe('#78 R3: el catálogo trae las claves del centro de alertas', () => {
  it('incluye las catorce traducciones en inglés y español', () => {
    const translations = [
      ['alerts.title', 'Alerts', 'Alertas'],
      ['alerts.empty', 'No alerts', 'No hay alertas'],
      ['alerts.ack', 'Mark as read', 'Marcar leída'],
      ['alerts.typeGeofenceExit', 'Left the safe zone', 'Salió de la zona'],
      ['alerts.typeBatteryLow', 'Low battery', 'Batería baja'],
      ['alerts.typeUnknown', 'Notice', 'Aviso'],
      ['alerts.statusAcked', 'Read', 'Leída'],
      ['alerts.statusClosed', 'Resolved', 'Resuelta'],
      ['alerts.justNow', 'Just now', 'Ahora mismo'],
      ['alerts.minutesAgo', '{{minutes}} min ago', 'Hace {{minutes}} min'],
      ['alerts.hoursAgo', '{{hours}} h ago', 'Hace {{hours}} h'],
      ['alerts.daysAgo', '{{days}} d ago', 'Hace {{days}} d'],
      ['home.alertsBell', 'Alerts', 'Alertas'],
      ['home.alertsBellUnread', 'Unread alerts', 'Alertas sin leer'],
    ] as const;
    const english = en as Record<string, string>;
    const spanish = es as Record<string, string>;

    for (const [key, englishValue, spanishValue] of translations) {
      expect(english[key]).toBe(englishValue);
      expect(spanish[key]).toBe(spanishValue);
    }
  });
});
