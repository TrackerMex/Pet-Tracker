import { NutritionPlan } from '@/modules/nutrition/domain/entities/nutrition-plan.entity';
import {
  toNutritionPlanResponse,
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
    inputsHash: 'h'.repeat(64),
    generatedAt: new Date('2026-10-08T00:00:00Z'),
  });
}
describe('R17 (nutrition-ai-explainer #18): el mapper devuelve la explicacion persistida', () => {
  it('devuelve texto y exactamente once claves sin inputsHash', () => {
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
        'generatedAt',
      ].sort(),
    );
    expect(response).not.toHaveProperty('inputsHash');
  });
  it('conserva null', () => {
    expect(toNutritionPlanResponse(plan(null)).aiExplanation).toBeNull();
  });
  it('today devuelve texto y exactamente trece claves', () => {
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
        'generatedAt',
        'servedToday',
        'kcalConsumedToday',
      ].sort(),
    );
  });
});
