import {
  NUTRITION_TOXIC_FOODS,
  mentionsToxicFood,
} from './nutrition-toxic-foods';

describe('R10 (nutrition-ai-structured-plan #212): lista y detector de toxicos', () => {
  const terms = [
    'chocolate',
    'cacao',
    'cafe',
    'cafeina',
    'xilitol',
    'edulcorante',
    'chicle',
    'uva',
    'uvas',
    'pasas',
    'sultanas',
    'cebolla',
    'cebollas',
    'ajo',
    'ajos',
    'puerro',
    'puerros',
    'cebollino',
    'cebollin',
    'aguacate',
    'aguacates',
    'palta',
    'macadamia',
    'nuez moscada',
    'alcohol',
    'cerveza',
    'vino',
    'levadura',
    'masa cruda',
    'hueso cocido',
    'huesos cocidos',
    'cocoa',
    'coffee',
    'caffeine',
    'xylitol',
    'grape',
    'grapes',
    'raisin',
    'raisins',
    'onion',
    'onions',
    'garlic',
    'leek',
    'leeks',
    'chives',
    'avocado',
    'nutmeg',
    'beer',
    'wine',
    'yeast',
    'raw dough',
  ];

  it('R10: la lista es exactamente la aprobada en G2', () => {
    expect(NUTRITION_TOXIC_FOODS).toEqual(terms);
    expect(NUTRITION_TOXIC_FOODS).toHaveLength(51);
  });

  it.each([
    'Evita darle chocolate.',
    'Nada de Café ni té.',
    'No le ofrezcas UVAS como premio.',
    'Evita la nuez de macadamia.',
    'Avoid grapes and raisins.',
    'Nunca le des masa  cruda.',
  ])('R10: detecta %s', (text) => {
    expect(mentionsToxicFood(text)).toBe(true);
  });

  it.each([
    'Pésala cada semana, también en días de trabajo.',
    'Observa su condición corporal cada mes.',
    'Consulta al veterinario si deja de comer.',
  ])('R10: no detecta %s', (text) => {
    expect(mentionsToxicFood(text)).toBe(false);
  });

  it('R10: detecta cada termino de la lista dentro de una frase', () => {
    for (const term of terms) {
      expect(mentionsToxicFood(`Evita ${term} hoy.`)).toBe(true);
    }
  });
});
