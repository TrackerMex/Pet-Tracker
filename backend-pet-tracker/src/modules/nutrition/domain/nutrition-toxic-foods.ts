export const NUTRITION_TOXIC_FOODS: readonly string[] = [
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

export function mentionsToxicFood(text: string): boolean {
  const tokens = text
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(Boolean);
  const normalized = ` ${tokens.join(' ')} `;
  return NUTRITION_TOXIC_FOODS.some((term) => normalized.includes(` ${term} `));
}
