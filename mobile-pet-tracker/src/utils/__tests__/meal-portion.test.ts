import type { NutritionPlan } from '../../api/types';
import { engineMealGrams, mealPortionGrams } from '../meal-portion';

const PROPOSAL = {
  mealGrams: [
    { mealTime: '08:00', grams: 112 },
    { mealTime: '13:00', grams: 98 },
    { mealTime: '18:00', grams: 110 },
  ],
  recommendations: ['Pasea 10 minutos más por la mañana.', 'Mide la ración con una báscula.'],
  reviewDate: '2027-01-01',
};

function makePlan(overrides: Partial<NutritionPlan> = {}): NutritionPlan {
  return {
    id: 'plan-1',
    petId: 'pet-1',
    rerKcal: 410,
    merKcal: 656,
    dailyGrams: 350,
    mealsPerDay: 3,
    mealTimes: ['08:00', '13:00', '18:00'],
    objective: 'maintenance',
    warnings: [],
    aiExplanation: null,
    aiProposal: null,
    generatedAt: '2026-08-23T12:00:00.000Z',
    servedToday: [],
    kcalConsumedToday: 0,
    ...overrides,
  };
}

function withoutProposalKey(): NutritionPlan {
  const plan = makePlan();
  delete plan.aiProposal;
  return plan;
}

it.each<[string, NutritionPlan, string, number]>([
  ['propuesta con la hora', makePlan({ aiProposal: PROPOSAL }), '08:00', 112],
  ['propuesta sin la hora', makePlan({ aiProposal: PROPOSAL }), '09:00', 117],
  ['aiProposal: null', makePlan(), '08:00', 117],
  ['sin la clave aiProposal', withoutProposalKey(), '08:00', 117],
  ['redondeo hacia arriba', makePlan({ dailyGrams: 187, mealsPerDay: 2 }), '08:00', 94],
])('#215 R2: mealPortionGrams %s', (_label, plan, mealTime, expected) => {
  expect(mealPortionGrams(plan, mealTime)).toBe(expected);
});

it('#215 R2: engineMealGrams redondea', () => {
  expect(engineMealGrams(makePlan())).toBe(117);
  expect(engineMealGrams(makePlan({ dailyGrams: 187, mealsPerDay: 2 }))).toBe(94);
});
