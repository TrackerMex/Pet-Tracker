import {
  NutritionPlan,
  NutritionPlanProps,
  engineMealCount,
  carriedSchedule,
} from './nutrition-plan.entity';

function plan(overrides: Partial<NutritionPlanProps> = {}): NutritionPlan {
  return new NutritionPlan({
    id: 'original',
    petId: 'pet',
    rerKcal: 662,
    merKcal: 1059,
    dailyGrams: 305,
    mealsPerDay: 2,
    mealTimes: ['07:30', '19:30'],
    engineMealsPerDay: null,
    objective: 'maintenance',
    warnings: [],
    aiExplanation: 'texto',
    inputsHash: 'a'.repeat(64),
    generatedAt: new Date('2026-10-02T00:00:00Z'),
    ...overrides,
  });
}

describe('R2 (meal-schedule-editing #103): engineMealCount y carriedSchedule deciden el horario del plan nuevo', () => {
  it.each([
    [
      'editado',
      plan({
        mealsPerDay: 3,
        engineMealsPerDay: 2,
        mealTimes: ['07:30', '12:00', '19:30'],
      }),
      2,
    ],
    ['legado', plan({ mealTimes: ['08:00', '20:00'] }), 2],
  ] as const)('%s', (_label, latest, expected) => {
    expect(engineMealCount(latest)).toEqual(expected);
  });

  it.each([
    {
      label: 'sin plan',
      latest: null,
      engine: { mealsPerDay: 2, mealTimes: ['07:30', '19:30'] },
      expected: { mealsPerDay: 2, mealTimes: ['07:30', '19:30'] },
    },
    {
      label: 'anadida, motor igual',
      latest: plan({
        mealsPerDay: 3,
        engineMealsPerDay: 2,
        mealTimes: ['07:30', '12:00', '19:30'],
      }),
      engine: { mealsPerDay: 2, mealTimes: ['07:30', '19:30'] },
      expected: { mealsPerDay: 3, mealTimes: ['07:30', '12:00', '19:30'] },
    },
    {
      label: 'anadida, motor cambia',
      latest: plan({
        mealsPerDay: 3,
        engineMealsPerDay: 2,
        mealTimes: ['07:30', '12:00', '19:30'],
      }),
      engine: { mealsPerDay: 3, mealTimes: ['07:30', '14:00', '19:30'] },
      expected: { mealsPerDay: 3, mealTimes: ['07:30', '14:00', '19:30'] },
    },
    {
      label: 'movida, motor igual',
      latest: plan({ engineMealsPerDay: 2, mealTimes: ['08:15', '19:30'] }),
      engine: { mealsPerDay: 2, mealTimes: ['07:30', '19:30'] },
      expected: { mealsPerDay: 2, mealTimes: ['08:15', '19:30'] },
    },
    {
      label: 'legado, motor igual',
      latest: plan({ mealTimes: ['08:00', '20:00'] }),
      engine: { mealsPerDay: 2, mealTimes: ['07:30', '19:30'] },
      expected: { mealsPerDay: 2, mealTimes: ['08:00', '20:00'] },
    },
    {
      label: 'legado, motor cambia',
      latest: plan({ mealTimes: ['08:00', '20:00'] }),
      engine: {
        mealsPerDay: 4,
        mealTimes: ['07:00', '11:00', '15:00', '19:00'],
      },
      expected: {
        mealsPerDay: 4,
        mealTimes: ['07:00', '11:00', '15:00', '19:00'],
      },
    },
  ])('$label', ({ latest, engine, expected }) => {
    expect(carriedSchedule(latest, engine)).toEqual(expected);
  });
});
