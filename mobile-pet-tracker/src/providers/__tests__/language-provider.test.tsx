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
  // 259 en `303fc19` + 1 de `home.walks` (#67 R7b) + 16 de #68 + 14 de #78 + 2 de #73 + 1 de #90 + 4 de #98 - 6 de #95 R5 (las seis claves de volver) + 1 de #113 R3 (food.kcalConsumedOfTarget) + 2 de #99 R3 (profile.notificationsBlocked, profile.openSettings) + 3 de #100 R1 (alerts.detailTitle, alerts.statusOpen, alerts.openedAt) + 11 de #41 R1 (geofences.*) + 12 de #146 R1 (geofenceEditor.*) + 2 de #146 R1 (geofenceEditor.limitNotice, geofenceEditor.ownerOnly) + 9 de #147 R1 (mealSchedule.* del horario editable).
  it('mantiene la base más las claves de #68 y los mismos marcadores en ambos idiomas', () => {
    const englishKeys = Object.keys(en).sort();
    const spanishKeys = Object.keys(es).sort();

    expect(englishKeys).toHaveLength(
      260 + 16 + 1 + 4 + 7 + 14 + 2 + 1 + 4 - 6 + 1 + 2 + 3 + 11 + 12 + 2 + 9 + 9 // #105 R5
        + 6 - 1 // #117 R1
        + 8 // #118 R1
        + 1 // #153 R1
        + 5 // #155 R1
        + 4, // #159 R1
    );
    expect(spanishKeys).toEqual(englishKeys);
    for (const key of englishKeys) {
      expect(markerNames(es[key as keyof typeof es])).toEqual(
        markerNames(en[key as keyof typeof en]),
      );
    }
  });

  it('#95 R5: el catálogo ya no trae las seis claves de volver', () => {
    const removed = [
      ['addReminder', 'ToReminders'],
      ['addPet', 'ToProfile'],
      ['docs', 'ToProfile'],
      ['weightLog', 'ToHealth'],
      ['mealSchedule', 'ToFood'],
      ['pairing', ''],
    ].map(([namespace, suffix]) => `${namespace}.back${suffix}`);
    for (const language of [en, es]) {
      for (const key of removed) expect(Object.keys(language)).not.toContain(key);
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

describe('#98 R3: el catálogo trae las cuatro claves de comidas servidas', () => {
  it('registra las cuatro claves en los dos idiomas y en la tabla de la spec de idioma', () => {
    const english = en as Record<string, string>;
    const spanish = es as Record<string, string>;
    const languageDesign = readFileSync(
      join(process.cwd(), '../specs/mobile-ui-language/design.md'),
      'utf8',
    );
    const translations = [
      [
        'food.markServed',
        'Mark {{time}} as served',
        'Marcar {{time}} como servida',
      ],
      ['food.undoServed', 'Undo {{time}}', 'Deshacer {{time}}'],
      [
        'food.couldNotUpdateMeal',
        'Could not update the meal',
        'No se pudo actualizar la comida',
      ],
      [
        'food.mealsServedOfTotal',
        '{{served}} of {{total}} meals served',
        '{{served}} de {{total}} comidas servidas',
      ],
    ] as const;

    for (const [key, englishValue, spanishValue] of translations) {
      expect(english[key]).toBe(englishValue);
      expect(spanish[key]).toBe(spanishValue);
      expect(languageDesign).toMatch(
        new RegExp(
          '\\| — \\| `' +
            escapeRegExp(key) +
            '`[^\\n]*← añadida por #98 \\(R3\\)',
        ),
      );
    }
  });
});

describe('#41 R1: el catálogo trae las once claves de zonas seguras', () => {
  it('registra las once claves en los dos idiomas y en la tabla de la spec de idioma', () => {
    const english = en as Record<string, string>;
    const spanish = es as Record<string, string>;
    const languageDesign = readFileSync(
      join(process.cwd(), '../specs/mobile-ui-language/design.md'),
      'utf8',
    );
    const translations = [
      ['geofences.title', 'Safe zones', 'Zonas seguras'],
      ['geofences.empty', 'No safe zones yet', 'Aún no hay zonas seguras'],
      ['geofences.needsCollar', 'Safe zones require a collar', 'Las zonas seguras requieren un collar'],
      ['geofences.radius', '{{meters}} m radius', 'Radio de {{meters}} m'],
      ['geofences.activeLabel', '{{name}} zone active', 'Zona {{name}} activa'],
      ['geofences.statusActive', 'Active', 'Activa'],
      ['geofences.statusInactive', 'Inactive', 'Inactiva'],
      ['geofences.delete', 'Delete', 'Eliminar'],
      ['geofences.cancel', 'Cancel', 'Cancelar'],
      ['geofences.deleteTitle', 'Delete {{name}}?', '¿Eliminar {{name}}?'],
      ['geofences.deleteBody', "You'll stop getting alerts for this zone. This can't be undone.", 'Dejarás de recibir alertas de esta zona. Esta acción no se puede deshacer.'],
    ] as const;

    for (const [key, englishValue, spanishValue] of translations) {
      expect(english[key]).toBe(englishValue);
      expect(spanish[key]).toBe(spanishValue);
      expect(languageDesign).toMatch(
        new RegExp(
          '\\| — \\| `' +
            escapeRegExp(key) +
            '`[^\\n]*← añadida por #41 \\(R1\\)',
        ),
      );
    }
  });
});

describe('#146 R1: el catálogo trae las claves del editor de zonas', () => {
  it('registra las claves del editor en los dos idiomas y en la tabla de la spec de idioma', () => {
    const english = en as Record<string, string>;
    const spanish = es as Record<string, string>;
    const languageDesign = readFileSync(
      join(process.cwd(), '../specs/mobile-ui-language/design.md'),
      'utf8',
    );
    const translations = [
      ["geofenceEditor.title", "Safe zone", "Zona segura"],
      ["geofenceEditor.nameLabel", "Name", "Nombre"],
      ["geofenceEditor.mapHint", "Tap the map to move the zone's center.", "Toca el mapa para mover el centro de la zona."],
      ["geofenceEditor.radiusLabel", "Zone radius", "Radio de la zona"],
      ["geofenceEditor.resetNote", "Saving a new center or radius re-evaluates the zone and closes its open alerts.", "Al guardar un centro o radio nuevos, la zona se vuelve a evaluar y se cierran sus alertas abiertas."],
      ["geofenceEditor.save", "Save", "Guardar"],
      ["geofenceEditor.nameTaken", "You already have a zone with that name.", "Ya tienes una zona con ese nombre."],
      ["geofenceEditor.limitReached", "This pet already has the maximum number of zones.", "Esta mascota ya tiene el máximo de zonas."],
      ["geofenceEditor.invalid", "Check the zone name and radius.", "Revisa el nombre y el radio de la zona."],
      ["geofenceEditor.notFound", "This pet or zone is no longer available.", "La mascota o la zona ya no están disponibles."],
      ["geofenceEditor.add", "Add zone", "Añadir zona"],
      ["geofenceEditor.editLabel", "Edit {{name}} zone", "Editar zona {{name}}"],
      ["geofenceEditor.limitNotice", "This pet already has {{max}} zones, the maximum. Delete one to add another.", "Esta mascota ya tiene {{max}} zonas, el máximo. Elimina una para añadir otra."],
      ["geofenceEditor.ownerOnly", "Only the pet's owner can create or edit zones.", "Solo el dueño de la mascota puede crear o editar zonas."],
    ] as const;

    for (const [key, englishValue, spanishValue] of translations) {
      expect(english[key]).toBe(englishValue);
      expect(spanish[key]).toBe(spanishValue);
      expect(languageDesign).toMatch(
        new RegExp(
          '\\| — \\| `' +
            escapeRegExp(key) +
            '`[^\\n]*← añadida por #' + '146 \\(R1\\)',
        ),
      );
    }
  });
});

describe('#100 R1: el catálogo trae las tres claves del detalle de alerta', () => {
  it('registra las tres claves en los dos idiomas y en la tabla de la spec de idioma', () => {
    const english = en as Record<string, string>;
    const spanish = es as Record<string, string>;
    const languageDesign = readFileSync(
      join(process.cwd(), '../specs/mobile-ui-language/design.md'),
      'utf8',
    );
    const translations = [
      ['alerts.detailTitle', 'Alert', 'Alerta'],
      ['alerts.statusOpen', 'Unread', 'Sin leer'],
      ['alerts.openedAt', 'Detected {{date}}', 'Detectada el {{date}}'],
    ] as const;

    for (const [key, englishValue, spanishValue] of translations) {
      expect(english[key]).toBe(englishValue);
      expect(spanish[key]).toBe(spanishValue);
      expect(languageDesign).toMatch(
        new RegExp(
          '\\| — \\| `' +
            escapeRegExp(key) +
            '`[^\\n]*← añadida por #100 \\(R1\\)',
        ),
      );
    }
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


describe('#147 R1: el catálogo trae las nueve claves del horario editable', () => {
  it('registra las nueve claves en los dos idiomas y en la tabla de la spec de idioma', () => {
    const english = en as Record<string, string>;
    const spanish = es as Record<string, string>;
    const languageDesign = readFileSync(
      join(process.cwd(), '../specs/mobile-ui-language/design.md'),
      'utf8',
    );
    const translations = [
      ["mealSchedule.addMeal", "Add meal", "Añadir comida"],
      ["mealSchedule.editTime", "Edit", "Editar"],
      ["mealSchedule.editTimeLabel", "Edit {{time}} meal time", "Editar horario de las {{time}}"],
      ["mealSchedule.errorInvalidTime", "That time is not valid", "La hora no es válida"],
      ["mealSchedule.errorEditForbidden", "Only the owner can change meal times", "Solo el dueño puede cambiar los horarios"],
      ["mealSchedule.errorPlanRequired", "Generate a meal plan first", "Primero genera un plan de alimentación"],
      ["mealSchedule.errorTimeNotInPlan", "That meal time is no longer in the plan", "Ese horario ya no está en el plan"],
      ["mealSchedule.errorDuplicateTime", "There is already a meal at that time", "Ya hay una comida a esa hora"],
      ["mealSchedule.errorMealLimit", "The plan already has the maximum of 6 meals", "El plan ya tiene el máximo de 6 comidas"],
    ] as const;

    for (const [key, englishValue, spanishValue] of translations) {
      expect(english[key]).toBe(englishValue);
      expect(spanish[key]).toBe(spanishValue);
      expect(languageDesign).toMatch(
        new RegExp(
          '\\| — \\| `' + escapeRegExp(key) + '`[^\\n]*← añadida por #147 \\(R1\\)',
        ),
      );
    }
  });
});

describe('#105 R5: meals history copy matches the approved bilingual table', () => {
  const translations = [
  [
    "food.mealsHistory",
    "Meals history",
    "Historial de comidas"
  ],
  [
    "food.mealsHistoryLinkSubtitle",
    "See which days meals were served",
    "Ver qué días se sirvieron comidas"
  ],
  [
    "mealsHistory.mealsHistory",
    "Meals history",
    "Historial de comidas"
  ],
  [
    "mealsHistory.previousMonth",
    "Previous month",
    "Mes anterior"
  ],
  [
    "mealsHistory.nextMonth",
    "Next month",
    "Mes siguiente"
  ],
  [
    "mealsHistory.emptyMonth",
    "No meals were served this month",
    "Este mes no se sirvió ninguna comida"
  ],
  [
    "mealsHistory.noMealsOnDay",
    "No meals were served this day",
    "Ese día no se sirvió ninguna comida"
  ],
  [
    "mealsHistory.servedOne",
    "1 meal served",
    "1 comida servida"
  ],
  [
    "mealsHistory.servedMany",
    "{{count}} meals served",
    "{{count}} comidas servidas"
  ]
] as const;
  it.each(translations)('registers %s in both languages and the design table', (key, englishValue, spanishValue) => {
    const english = en as Record<string, string>;
    const spanish = es as Record<string, string>;
    const languageDesign = readFileSync(join(process.cwd(), '../specs/mobile-ui-language/design.md'), 'utf8');
    expect(english[key]).toBe(englishValue);
    expect(spanish[key]).toBe(spanishValue);
    expect(languageDesign).toMatch(new RegExp('\\| — \\| `' + escapeRegExp(key) + '`[^\\n]*← añadida por #105 \\(R5\\)'));
  });
});


describe('#117 R1: el catálogo trae las claves de recuperar contraseña', () => {
  it('registra las seis claves en los dos idiomas, con {{email}} en forgot.sentTo, y en la tabla de la spec de idioma', () => {
    const english = en as Record<string, string>;
    const spanish = es as Record<string, string>;
    const languageDesign = readFileSync(
      join(process.cwd(), '../specs/mobile-ui-language/design.md'),
      'utf8',
    );
    const translations = [
      ["forgot.instructions", "Enter the email linked to your account and we'll send you a link to reset your password.", "Ingresa el correo electrónico asociado a tu cuenta y te enviaremos un enlace para restablecer tu contraseña."],
      ["forgot.checkYourEmail", "Check your email", "Revisa tu correo"],
      ["forgot.sentTo", "If an account exists for {{email}}, we sent a link to reset your password. Check your inbox and spam folder.", "Si existe una cuenta para {{email}}, te enviamos un enlace para restablecer tu contraseña. Revisa tu bandeja de entrada y la carpeta de spam."],
      ["forgot.resend", "Resend", "Reenviar"],
      ["forgot.invalidEmail", "Enter a valid email address", "Ingresa un correo electrónico válido"],
      ["forgot.tooManyAttempts", "Too many attempts. Try again later.", "Demasiados intentos. Inténtalo más tarde."],
    ] as const;

    for (const [key, englishValue, spanishValue] of translations) {
      expect(english[key]).toBe(englishValue);
      expect(spanish[key]).toBe(spanishValue);
      expect(languageDesign).toContain(key);
    }
    expect(markerNames(english['forgot.sentTo'])).toEqual(['email']);
    expect(markerNames(spanish['forgot.sentTo'])).toEqual(['email']);
  });

  it('retira forgot.comingSoon de los dos idiomas', () => {
    const english = en as Record<string, string>;
    const spanish = es as Record<string, string>;
    expect(english['forgot.comingSoon']).toBeUndefined();
    expect(spanish['forgot.comingSoon']).toBeUndefined();
  });
});
