import { NutritionPlan } from '@/modules/nutrition/domain/entities/nutrition-plan.entity';
import {
  toNutritionPlanResponse,
  toNutritionPlanGenerateResponse,
  toNutritionPlanTodayResponse,
} from './nutrition.mapper';
function plan(aiExplanation: string | null): NutritionPlan {
  return new NutritionPlan({
    id: 'plan',
    petId: 'pet',
    rerKcal: 662,
    merKcal: 1059,
    dailyGrams: 305,
    mealsPerDay: 2,
    mealTimes: ['07:30', '19:30'],
    engineMealsPerDay: 2,
    objective: 'maintenance',
    warnings: [],
    aiExplanation,
    aiProposal: null,
    inputsHash: 'h'.repeat(64),
    generatedAt: new Date('2026-10-08T00:00:00Z'),
  });
}
describe('R17 (nutrition-ai-explainer #18): el mapper devuelve la explicacion persistida', () => {
  it('devuelve texto y exactamente doce claves sin inputsHash', () => {
    const response = toNutritionPlanResponse(plan('texto'));
    expect(response.aiExplanation).toBe('texto');
    expect(Object.keys(response).sort()).toEqual(
      [
        'id',
        'petId',
        'rerKcal',
        'merKcal',
        'dailyGrams',
        'mealsPerDay',
        'mealTimes',
        'objective',
        'warnings',
        'aiExplanation',
        'aiProposal',
        'generatedAt',
      ].sort(),
    );
    expect(response).not.toHaveProperty('inputsHash');
  });
  it('conserva null', () => {
    expect(toNutritionPlanResponse(plan(null)).aiExplanation).toBeNull();
  });
  it('today devuelve texto y exactamente catorce claves', () => {
    const response = toNutritionPlanTodayResponse({
      plan: plan('texto'),
      servedToday: [],
      kcalConsumedToday: 0,
    });
    expect(response.aiExplanation).toBe('texto');
    expect(Object.keys(response).sort()).toEqual(
      [
        'id',
        'petId',
        'rerKcal',
        'merKcal',
        'dailyGrams',
        'mealsPerDay',
        'mealTimes',
        'objective',
        'warnings',
        'aiExplanation',
        'aiProposal',
        'generatedAt',
        'servedToday',
        'kcalConsumedToday',
      ].sort(),
    );
  });
});

describe('R16 (nutrition-ai-structured-plan #212): contrato de respuestas', () => {
  const proposal = {
    mealGrams: [
      { mealTime: '07:30', grams: 150 },
      { mealTime: '19:30', grams: 155 },
    ],
    recommendations: ['Pésala cada dos semanas.'],
    reviewDate: '2026-11-25',
  };
  it('R16: la respuesta incluye aiProposal y doce claves', () => {
    const response = toNutritionPlanResponse(
      new NutritionPlan({ ...plan('texto'), aiProposal: proposal }),
    );
    expect(response).toHaveProperty('aiProposal', proposal);
    expect(Object.keys(response)).toHaveLength(12);
    expect(toNutritionPlanResponse(plan(null))).toHaveProperty(
      'aiProposal',
      null,
    );
  });
  it('R16: la respuesta de generate incluye aiStatus y trece claves', () => {
    const response = toNutritionPlanGenerateResponse({
      plan: new NutritionPlan({ ...plan('texto'), aiProposal: proposal }),
      aiStatus: 'proposed',
    });
    expect(response).toHaveProperty('aiStatus', 'proposed');
    expect(response).toHaveProperty('aiProposal', proposal);
    expect(Object.keys(response)).toHaveLength(13);
  });
});
