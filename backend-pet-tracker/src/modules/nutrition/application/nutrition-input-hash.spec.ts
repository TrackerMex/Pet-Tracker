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

    expect(nutritionInputHash(reordered, [])).toBe(
      nutritionInputHash(input, []),
    );
  });

  it('normaliza opcionales ausentes a null y numericos con Number', () => {
    expect(
      nutritionInputHash(
        {
          ...input,
          weightKg: '20' as unknown as number,
          targetWeightKg: undefined as unknown as null,
          bodyCondition: undefined as unknown as null,
          kcalPer100g: '350.0' as unknown as number,
        },
        [],
      ),
    ).toBe(nutritionInputHash(input, []));
  });

  it.each<[keyof NutritionEngineInput, unknown]>([
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
    expect(nutritionInputHash({ ...input, [key]: value }, [])).not.toBe(
      nutritionInputHash(input, []),
    );
  });
});

describe('R3 (nutrition-ai-structured-plan #212): tendencia en el hash', () => {
  const input: NutritionEngineInput = {
    species: 'dog',
    weightKg: 20,
    targetWeightKg: null,
    ageMonths: 60,
    sterilized: true,
    activityLevel: 'medium',
    bodyCondition: null,
    kcalPer100g: 350,
    allergies: [],
    diseases: [],
  };
  const trend = [
    { measuredAt: '2026-09-01', weightKg: 19.5 },
    { measuredAt: '2026-10-01', weightKg: 20 },
  ];

  it('R3: fija el hash literal con weightTrend vacio', () => {
    expect(nutritionInputHash(input, [])).toBe(
      '9ed1bbad1a21d53672c86756adde7048c2fa6e590005fd5fbd1483ee0eb1bc07',
    );
  });

  it('R3: fija el hash literal con dos pesos', () => {
    expect(nutritionInputHash(input, trend)).toBe(
      '3f2aeae30ab9b9722a9a54ed423654eb5f7d8c6651867b42f89c8be7eb2fb7f6',
    );
  });

  it('R3: cambia si cambia un peso de la tendencia', () => {
    expect(
      nutritionInputHash(input, [{ ...trend[0], weightKg: 19.6 }, trend[1]]),
    ).not.toBe(nutritionInputHash(input, trend));
  });

  it('R3: cambia si cambia una fecha de la tendencia', () => {
    expect(
      nutritionInputHash(input, [
        { ...trend[0], measuredAt: '2026-09-02' },
        trend[1],
      ]),
    ).not.toBe(nutritionInputHash(input, trend));
  });

  it('R3: cambia si cambia el orden de la tendencia', () => {
    expect(nutritionInputHash(input, [...trend].reverse())).not.toBe(
      nutritionInputHash(input, trend),
    );
  });

  it('R3: difiere del hash de #17 sin tendencia', () => {
    expect(nutritionInputHash(input, [])).not.toBe(
      'd04f38300d0fc38c7fd585e1cb683dde53518f8aa40df6e38c9048326e22a843',
    );
  });
});
