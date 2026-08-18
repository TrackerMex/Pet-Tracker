import { nutritionInputHash } from './nutrition-input-hash';
import type { NutritionEngineInput } from '@/modules/nutrition/domain/nutrition-engine';

describe('R20 (nutrition-profile-engine #17): hash canonico estable e independiente del orden', () => {
  const input: NutritionEngineInput = {
    species: 'dog',
    weightKg: 20,
    targetWeightKg: null,
    ageMonths: 60,
    sterilized: true,
    activityLevel: 'medium',
    bodyCondition: null,
    kcalPer100g: 350,
    allergies: ['pollo', 'res'],
    diseases: ['diabetes', 'renal'],
  };

  it('ignora el orden de escritura y de los conjuntos de strings', () => {
    const reordered: NutritionEngineInput = {
      diseases: ['renal', 'diabetes'],
      allergies: ['res', 'pollo'],
      kcalPer100g: 350,
      bodyCondition: null,
      activityLevel: 'medium',
      sterilized: true,
      ageMonths: 60,
      targetWeightKg: null,
      weightKg: 20,
      species: 'dog',
    };

    expect(nutritionInputHash(reordered)).toBe(nutritionInputHash(input));
  });

  it('normaliza opcionales ausentes a null y numericos con Number', () => {
    expect(
      nutritionInputHash({
        ...input,
        weightKg: '20' as unknown as number,
        targetWeightKg: undefined as unknown as null,
        bodyCondition: undefined as unknown as null,
        kcalPer100g: '350.0' as unknown as number,
      }),
    ).toBe(nutritionInputHash(input));
  });

  it.each<Array<[keyof NutritionEngineInput, unknown]>>([
    ['species', 'cat'],
    ['weightKg', 21],
    ['targetWeightKg', 18],
    ['ageMonths', 61],
    ['sterilized', false],
    ['activityLevel', 'high'],
    ['bodyCondition', 6],
    ['kcalPer100g', 360],
    ['allergies', ['pescado']],
    ['diseases', ['cardiaca']],
  ])('cambia al modificar %s', (key, value) => {
    expect(nutritionInputHash({ ...input, [key]: value })).not.toBe(
      nutritionInputHash(input),
    );
  });
});
