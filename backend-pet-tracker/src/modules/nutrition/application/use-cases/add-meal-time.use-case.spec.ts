import type { AuditLogger } from '@/audit/audit-log.repository';
import type { NutritionPlan } from '@/modules/nutrition/domain/entities/nutrition-plan.entity';
import type { NutritionRepository } from '@/modules/nutrition/domain/repositories/nutrition.repository';
import { AddMealTimeUseCase } from './add-meal-time.use-case';

const PLAN: NutritionPlan = {
  id: 'original',
  petId: 'pet',
  rerKcal: 662,
  merKcal: 1059,
  dailyGrams: 305,
  mealsPerDay: 2,
  mealTimes: ['07:30', '19:30'],
  engineMealsPerDay: 2,
  objective: 'maintenance',
  warnings: [],
  aiExplanation: null,
  inputsHash: 'f'.repeat(64),
  generatedAt: new Date('2026-10-02T00:00:00Z'),
};
const CREATED: NutritionPlan = {
  ...PLAN,
  id: 'created',
  mealTimes: ['08:15', '19:30'],
};
const INPUT = { petId: 'pet', mealTime: '12:00', userId: 'user' };

function buildUseCase(latest: NutritionPlan | null = PLAN) {
  const findLatestPlan = jest.fn().mockResolvedValue(latest);
  const insertPlan = jest.fn().mockResolvedValue(CREATED);
  const insertPlanAndMoveServing = jest.fn().mockResolvedValue(CREATED);
  const record = jest.fn().mockResolvedValue(undefined);
  const nutrition = {
    findLatestPlan,
    insertPlan,
    insertPlanAndMoveServing,
  } as unknown as NutritionRepository;
  const audit = { record } as unknown as AuditLogger;
  return {
    useCase: new AddMealTimeUseCase(nutrition, audit),
    insertPlan,
    insertPlanAndMoveServing,
    record,
  };
}

describe('R7 (meal-schedule-editing #103): meal_time.add se audita despues de escribir y nunca si falla', () => {
  it('audita el id nuevo despues de resolver la escritura', async () => {
    const { useCase, insertPlan, record } = buildUseCase();
    await useCase.execute(INPUT);
    expect(record).toHaveBeenCalledTimes(1);
    expect(record).toHaveBeenCalledWith({
      userId: 'user',
      action: 'meal_time.add',
      entity: 'nutrition_plan',
      entityId: 'created',
      meta: { petId: 'pet', mealTime: '12:00' },
    });
    expect(insertPlan.mock.invocationCallOrder[0]).toBeLessThan(
      record.mock.invocationCallOrder[0],
    );
  });

  it('no audita cuando la escritura falla', async () => {
    const { useCase, insertPlan, record } = buildUseCase();
    insertPlan.mockRejectedValue(new Error('db down'));
    await expect(useCase.execute(INPUT)).rejects.toThrow('db down');
    expect(record).not.toHaveBeenCalled();
  });
});
