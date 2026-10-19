import { render, screen } from '@testing-library/react-native';
import { createElement } from 'react';
import { Text } from 'react-native';

import { en, es, type Language, type TranslationKey } from '../../i18n/catalog';
import { LanguageProvider, useTranslate } from '../../providers/language-provider';

const phrases = [
  [
    'home.pingoPhraseWalkMeals',
    '{{petName}} has walked {{km}} today and has had {{served}} of {{total}} meals.',
    '{{petName}} ya caminó {{km}} hoy y lleva {{served}} de {{total}} comidas.',
    'Luna has walked 2.4 km today and has had 1 of 2 meals.',
    'Luna ya caminó 2.4 km hoy y lleva 1 de 2 comidas.',
  ],
  [
    'home.pingoPhraseWalk',
    '{{petName}} has walked {{km}} today.',
    '{{petName}} ya caminó {{km}} hoy.',
    'Luna has walked 2.4 km today.',
    'Luna ya caminó 2.4 km hoy.',
  ],
  [
    'home.pingoPhraseMeals',
    '{{petName}} has had {{served}} of {{total}} meals today.',
    '{{petName}} lleva {{served}} de {{total}} comidas hoy.',
    'Luna has had 1 of 2 meals today.',
    'Luna lleva 1 de 2 comidas hoy.',
  ],
  [
    'home.pingoPhraseCalm',
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
      const view = await render(createElement(LanguageProvider, {
        initial: language,
        children: createElement(PhraseProbe, { labelKey: key as TranslationKey }),
      }));
      expect(screen.getByTestId('phrase')).toHaveTextContent(expected);
      await view.unmount();
    }
  });
});
