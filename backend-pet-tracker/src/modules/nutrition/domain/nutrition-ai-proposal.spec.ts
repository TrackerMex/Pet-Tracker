import {
  acceptAiOutput,
  type NutritionAiOutput,
} from './nutrition-ai-proposal';

const PLAN_300 = { dailyGrams: 300, mealTimes: ['07:30', '12:00', '19:30'] };
const VALID_OUTPUT: NutritionAiOutput = {
  mealGrams: [
    { mealTime: '07:30', grams: 90 },
    { mealTime: '12:00', grams: 100 },
    { mealTime: '19:30', grams: 110 },
  ],
  recommendations: ['Pésala cada dos semanas.'],
  reviewInDays: 30,
  explanation: 'Explicación de prueba.',
};
const localDay = '2026-10-26';

describe('R8 (nutrition-ai-structured-plan #212): franjas del plan', () => {
  it('R8: rechaza una franja de menos', () => {
    expect(
      acceptAiOutput(
        {
          ...VALID_OUTPUT,
          mealGrams: [
            { mealTime: '07:30', grams: 150 },
            { mealTime: '19:30', grams: 150 },
          ],
        },
        PLAN_300,
        localDay,
      ),
    ).toBeNull();
  });

  it('R8: rechaza una franja de mas', () => {
    expect(
      acceptAiOutput(
        {
          ...VALID_OUTPUT,
          mealGrams: [
            { mealTime: '07:30', grams: 75 },
            { mealTime: '12:00', grams: 75 },
            { mealTime: '19:30', grams: 75 },
            { mealTime: '22:00', grams: 75 },
          ],
        },
        PLAN_300,
        localDay,
      ),
    ).toBeNull();
  });

  it('R8: rechaza una hora que no esta en el plan', () => {
    expect(
      acceptAiOutput(
        {
          ...VALID_OUTPUT,
          mealGrams: [
            { mealTime: '07:30', grams: 100 },
            { mealTime: '12:00', grams: 100 },
            { mealTime: '20:00', grams: 100 },
          ],
        },
        PLAN_300,
        localDay,
      ),
    ).toBeNull();
  });

  it('R8: rechaza una hora duplicada', () => {
    expect(
      acceptAiOutput(
        {
          ...VALID_OUTPUT,
          mealGrams: [
            { mealTime: '07:30', grams: 100 },
            { mealTime: '07:30', grams: 100 },
            { mealTime: '19:30', grams: 100 },
          ],
        },
        PLAN_300,
        localDay,
      ),
    ).toBeNull();
  });

  it('R8: acepta las mismas horas en otro orden y devuelve mealGrams en el orden del plan', () => {
    const accepted = acceptAiOutput(
      {
        ...VALID_OUTPUT,
        mealGrams: [
          { mealTime: '19:30', grams: 110 },
          { mealTime: '07:30', grams: 90 },
          { mealTime: '12:00', grams: 100 },
        ],
      },
      PLAN_300,
      localDay,
    );
    expect(accepted?.proposal.mealGrams).toStrictEqual([
      { mealTime: '07:30', grams: 90 },
      { mealTime: '12:00', grams: 100 },
      { mealTime: '19:30', grams: 110 },
    ]);
  });
});
