import { Logger } from '@nestjs/common';
import type {
  NutritionEngineInput,
  NutritionPlanResult,
} from '@/modules/nutrition/domain/nutrition-engine';
import { NullNutritionExplainer } from './null-nutrition-explainer';
import type { NullExplainerReason } from './null-nutrition-explainer';

const input: NutritionEngineInput = {
  species: 'dog',
  weightKg: 20,
  targetWeightKg: null,
  ageMonths: 36,
  sterilized: true,
  activityLevel: 'medium',
  bodyCondition: null,
  kcalPer100g: 350,
  allergies: [],
  diseases: [],
};
const result: NutritionPlanResult = {
  rerKcal: 662,
  merKcal: 1059,
  dailyGrams: 305,
  mealsPerDay: 2,
  mealTimes: ['07:30', '19:30'],
  objective: 'maintenance',
  warnings: [],
};
const ctx = { petId: 'pet-prueba', planId: 'plan-prueba' };
describe('R5 (nutrition-ai-explainer #18): el nulo explica por que esta apagado', () => {
  afterEach(() => jest.restoreAllMocks());
  it.each<NullExplainerReason>([
    'node-env-test',
    'not-enabled',
    'key-missing',
    'model-missing',
  ])('%s resuelve null con un warn completo', async (reason) => {
    const warn = jest
      .spyOn(Logger.prototype, 'warn')
      .mockImplementation(() => undefined);
    await expect(
      new NullNutritionExplainer(reason).explain(input, result, ctx),
    ).resolves.toBeNull();
    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn.mock.calls[0][0]).toEqual({
      scope: 'nutrition-ai',
      petId: 'pet-prueba',
      planId: 'plan-prueba',
      message: 'ai explanation disabled',
      reason,
    });
  });
});
