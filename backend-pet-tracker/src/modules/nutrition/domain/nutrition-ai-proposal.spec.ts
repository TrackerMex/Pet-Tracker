import {
  acceptAiOutput,
  NUTRITION_AI_GRAMS_TOLERANCE_PERCENT,
  type NutritionAiOutput,
} from './nutrition-ai-proposal';

const PLAN_300 = { dailyGrams: 300, mealTimes: ['07:30', '12:00', '19:30'] };
const PLAN_305 = { dailyGrams: 305, mealTimes: ['07:30', '19:30'] };
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

describe('R9 (nutrition-ai-structured-plan #212): tolerancia de gramos', () => {
  it.each<[number, number, boolean]>([
    [300, 269, false],
    [300, 270, true],
    [300, 330, true],
    [300, 331, false],
    [305, 274, false],
    [305, 275, true],
    [305, 335, true],
    [305, 336, false],
  ])(
    'R9: con dailyGrams %i y suma %i acepta %s',
    (dailyGrams, sum, accepts) => {
      const plan = dailyGrams === 300 ? PLAN_300 : PLAN_305;
      const portion = Math.ceil(sum / plan.mealTimes.length);
      const mealGrams = plan.mealTimes.map((mealTime, index) => ({
        mealTime,
        grams:
          index === plan.mealTimes.length - 1 ? sum - portion * index : portion,
      }));
      const result = acceptAiOutput(
        { ...VALID_OUTPUT, mealGrams },
        plan,
        localDay,
      );
      expect(result !== null).toBe(accepts);
    },
  );

  it('R9: la tolerancia es del 10 por ciento', () => {
    expect(NUTRITION_AI_GRAMS_TOLERANCE_PERCENT).toBe(10);
  });
});

describe('R11 (nutrition-ai-structured-plan #212): recomendaciones y revision', () => {
  it('R11: descarta solo la recomendacion toxica, conserva el orden y la explicacion', () => {
    const result = acceptAiOutput(
      {
        ...VALID_OUTPUT,
        recommendations: [
          'Pésala cada dos semanas.',
          'Evita darle chocolate.',
          'Observa su condición corporal.',
        ],
      },
      PLAN_300,
      localDay,
    );
    expect(result).toStrictEqual({
      explanation: 'Explicación de prueba.',
      proposal: {
        mealGrams: [
          { mealTime: '07:30', grams: 90 },
          { mealTime: '12:00', grams: 100 },
          { mealTime: '19:30', grams: 110 },
        ],
        recommendations: [
          'Pésala cada dos semanas.',
          'Observa su condición corporal.',
        ],
        reviewDate: '2026-11-25',
      },
    });
  });

  it('R11: todas toxicas deja recomendaciones vacias y acepta la propuesta', () => {
    const result = acceptAiOutput(
      { ...VALID_OUTPUT, recommendations: ['Evita las uvas.', 'Nada de ajo.'] },
      PLAN_300,
      localDay,
    );
    expect(result).not.toBeNull();
    expect(result?.proposal.recommendations).toStrictEqual([]);
  });

  it.each<[string, number, string]>([
    ['2026-12-28', 7, '2027-01-04'],
    ['2026-10-26', 90, '2027-01-24'],
    ['2026-02-25', 7, '2026-03-04'],
    ['2026-10-25', 30, '2026-11-24'],
  ])(
    'R11: desde %s con %i dias revisa el %s',
    (day, reviewInDays, reviewDate) => {
      expect(
        acceptAiOutput({ ...VALID_OUTPUT, reviewInDays }, PLAN_300, day)
          ?.proposal.reviewDate,
      ).toBe(reviewDate);
    },
  );
});
