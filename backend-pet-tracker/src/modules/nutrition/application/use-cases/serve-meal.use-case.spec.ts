import { MealServing } from '@/modules/nutrition/domain/entities/meal-serving.entity';
import { NutritionPlan } from '@/modules/nutrition/domain/entities/nutrition-plan.entity';
import type { MealServingRepository } from '@/modules/nutrition/domain/repositories/meal-serving.repository';
import type { NutritionRepository } from '@/modules/nutrition/domain/repositories/nutrition.repository';
import type { PetRepository } from '@/modules/pets/domain/repositories/pet.repository';
import { ServeMealUseCase } from './serve-meal.use-case';

const PET_ID = '0198b2c3-4d5e-7a01-b234-56789abcdef0';
const USER_ID = '0198a1f0-3d5c-7f21-b0a1-6f1c9e2d4b77';
const SERVING_ID = '0198dead-beef-7c23-d456-789abcdef012';
const NOW = new Date('2026-08-11T02:00:00.000Z');

function plan(mealTimes: string[]): NutritionPlan {
  return new NutritionPlan({
    id: '0198feed-beef-7c23-d456-789abcdef012',
    petId: PET_ID,
    rerKcal: 662,
    merKcal: 1059,
    dailyGrams: 305,
    mealsPerDay: mealTimes.length,
    mealTimes,
    objective: 'maintenance',
    warnings: [],
    aiExplanation: null,
    inputsHash: 'f'.repeat(64),
    generatedAt: NOW,
  });
}

function serving(): MealServing {
  return new MealServing({
    id: SERVING_ID,
    petId: PET_ID,
    servedOn: '2026-08-11',
    mealTime: '07:30',
    servedAt: NOW,
    createdBy: USER_ID,
  });
}

function buildUseCase(latestPlan: NutritionPlan | null) {
  const findLatestPlan = jest.fn().mockResolvedValue(latestPlan);
  const create = jest.fn().mockResolvedValue(serving());
  const record = jest.fn().mockResolvedValue(undefined);
  const nutrition = { findLatestPlan } as unknown as NutritionRepository;
  const meals = { create } as unknown as MealServingRepository;
  const pets = {
    findOwnerTimezone: jest.fn().mockResolvedValue('UTC'),
  } as unknown as PetRepository;
  const useCase = new ServeMealUseCase(nutrition, meals, pets, { record });
  return { useCase, create, record };
}

describe('R4 (meals-served-tracking #83): sin plan o franja fuera del plan el use case lanza sin escribir ni auditar', () => {
  it('lanza NutritionPlanRequiredError antes de escribir', async () => {
    const { useCase, create, record } = buildUseCase(null);

    await expect(
      useCase.execute(PET_ID, { mealTime: '07:30' }, USER_ID, NOW),
    ).rejects.toMatchObject({ name: 'NutritionPlanRequiredError' });
    expect(create).not.toHaveBeenCalled();
    expect(record).not.toHaveBeenCalled();
  });

  it('lanza MealTimeNotInPlanError antes de escribir', async () => {
    const { useCase, create, record } = buildUseCase(
      plan(['07:30', '19:30']),
    );

    await expect(
      useCase.execute(PET_ID, { mealTime: '12:00' }, USER_ID, NOW),
    ).rejects.toMatchObject({ name: 'MealTimeNotInPlanError' });
    expect(create).not.toHaveBeenCalled();
    expect(record).not.toHaveBeenCalled();
  });
});
