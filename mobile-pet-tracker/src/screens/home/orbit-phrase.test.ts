import { render, screen } from '@testing-library/react-native';
import { createElement } from 'react';
import { Text } from 'react-native';

import { en, es, type Language, type TranslationKey } from '../../i18n/catalog';
import { LanguageProvider, useTranslate } from '../../providers/language-provider';

const phrases = [
  [
    'home.orbitPhraseWalkMeals',
    '{{petName}} has walked {{km}} today and has had {{served}} of {{total}} meals.',
    '{{petName}} ya caminó {{km}} hoy y lleva {{served}} de {{total}} comidas.',
    'Luna has walked 2.4 km today and has had 1 of 2 meals.',
    'Luna ya caminó 2.4 km hoy y lleva 1 de 2 comidas.',
  ],
  [
    'home.orbitPhraseWalk',
    '{{petName}} has walked {{km}} today.',
    '{{petName}} ya caminó {{km}} hoy.',
    'Luna has walked 2.4 km today.',
    'Luna ya caminó 2.4 km hoy.',
  ],
  [
    'home.orbitPhraseMeals',
    '{{petName}} has had {{served}} of {{total}} meals today.',
    '{{petName}} lleva {{served}} de {{total}} comidas hoy.',
    'Luna has had 1 of 2 meals today.',
    'Luna lleva 1 de 2 comidas hoy.',
  ],
  [
    'home.orbitPhraseCalm',
    "I'm keeping an eye on {{petName}}.",
    'Estoy pendiente de {{petName}}.',
    "I'm keeping an eye on Luna.",
    'Estoy pendiente de Luna.',
  ],
] as const;

function PhraseProbe({ labelKey }: { labelKey: TranslationKey }) {
  const t = useTranslate();
  return createElement(Text, { testID: 'phrase' }, t(labelKey, {
    petName: 'Luna', km: '2.4 km', served: 1, total: 2,
  }));
}

describe('#190 R9: las cuatro frases tienen el copy aprobado', () => {
  it.each(phrases)('%s conserva los literales y marcadores exactos', (key, english, spanish) => {
    expect((en as Record<string, string>)[key]).toBe(english);
    expect((es as Record<string, string>)[key]).toBe(spanish);
  });

  it.each(phrases)('%s se interpola en ambos idiomas con useTranslate', async (key, _english, _spanish, englishText, spanishText) => {
    for (const [language, expected] of [['en', englishText], ['es', spanishText]] as [Language, string][]) {
      const view = await render(createElement(LanguageProvider,
        // React's overload requires children in props even when passed below.
        { initial: language } as Parameters<typeof LanguageProvider>[0],
        createElement(PhraseProbe, { labelKey: key as TranslationKey }),
      ));
      expect(screen.getByTestId('phrase')).toHaveTextContent(expected);
      await view.unmount();
    }
  });
});

describe('#190 R8: homePingoPhrase elige por distancia y plan', () => {
  const cases = [
    [2350, { served: 1, total: 2 }, 'home.orbitPhraseWalkMeals', { petName: 'Luna', km: '2.4 km', served: 1, total: 2 }],
    [2350, null, 'home.orbitPhraseWalk', { petName: 'Luna', km: '2.4 km' }],
    [2350, { served: 0, total: 0 }, 'home.orbitPhraseWalk', { petName: 'Luna', km: '2.4 km' }],
    [null, { served: 1, total: 2 }, 'home.orbitPhraseMeals', { petName: 'Luna', served: 1, total: 2 }],
    [0, { served: 1, total: 2 }, 'home.orbitPhraseMeals', { petName: 'Luna', served: 1, total: 2 }],
    [99, { served: 1, total: 2 }, 'home.orbitPhraseMeals', { petName: 'Luna', served: 1, total: 2 }],
    [null, null, 'home.orbitPhraseCalm', { petName: 'Luna' }],
    [0, { served: 0, total: 0 }, 'home.orbitPhraseCalm', { petName: 'Luna' }],
    [99, null, 'home.orbitPhraseCalm', { petName: 'Luna' }],
    [-1, null, 'home.orbitPhraseCalm', { petName: 'Luna' }],
    [100, null, 'home.orbitPhraseWalk', { petName: 'Luna', km: '0.1 km' }],
    [100, { served: 3, total: 2 }, 'home.orbitPhraseWalkMeals', { petName: 'Luna', km: '0.1 km', served: 3, total: 2 }],
    [null, { served: 3, total: 2 }, 'home.orbitPhraseMeals', { petName: 'Luna', served: 3, total: 2 }],
    [2350, { served: 0, total: -1 }, 'home.orbitPhraseWalk', { petName: 'Luna', km: '2.4 km' }],
  ] as const;

  it.each(cases)('distancia %s, comidas %s → %s', (distanceM, meals, labelKey, params) => {
    const { homeOrbitPhrase } = jest.requireActual<{
      homeOrbitPhrase: (input: {
        petName: string;
        distanceM: number | null;
        meals: { served: number; total: number } | null;
      }) => { labelKey: TranslationKey; params: Record<string, string | number> };
    }>('./orbit-phrase');
    expect(homeOrbitPhrase({ petName: 'Luna', distanceM, meals })).toEqual({ labelKey, params });
  });
});
