import type { AuditLogger } from '@/audit/audit-log.repository';
import type { NutritionPlan } from '@/modules/nutrition/domain/entities/nutrition-plan.entity';
import type { NutritionRepository } from '@/modules/nutrition/domain/repositories/nutrition.repository';
import type { PetRepository } from '@/modules/pets/domain/repositories/pet.repository';
import { MoveMealTimeUseCase } from './move-meal-time.use-case';

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
const INPUT = {
  petId: 'pet',
  from: '07:30',
  to: '08:15',
  userId: 'user',
  now: new Date('2026-10-02T12:00:00Z'),
};

function buildUseCase(latest: NutritionPlan | null = PLAN, timezone = 'UTC') {
  const findLatestPlan = jest.fn().mockResolvedValue(latest);
  const insertPlan = jest.fn().mockResolvedValue(CREATED);
  const insertPlanAndMoveServing = jest.fn().mockResolvedValue(CREATED);
  const record = jest.fn().mockResolvedValue(undefined);
  const nutrition = {
    findLatestPlan,
    insertPlan,
    insertPlanAndMoveServing,
  } as unknown as NutritionRepository;
  const pets = {
    findOwnerTimezone: jest.fn().mockResolvedValue(timezone),
  } as unknown as PetRepository;
  const audit = { record } as unknown as AuditLogger;
  return {
    useCase: new MoveMealTimeUseCase(nutrition, pets, audit),
    insertPlan,
    insertPlanAndMoveServing,
    record,
  };
}

describe('R5 (meal-schedule-editing #103): el use case mueve la servida del dia civil del owner', () => {
  it.each([
    ['2026-12-31T10:30:00Z', 'Pacific/Kiritimati', '2027-01-01'],
    ['2026-12-31T10:30:00Z', 'America/Mexico_City', '2026-12-31'],
    ['2027-01-01T03:00:00Z', 'America/Mexico_City', '2026-12-31'],
    ['2027-01-01T03:00:00Z', 'UTC', '2027-01-01'],
    ['2026-11-30T23:30:00Z', 'Asia/Tokyo', '2026-12-01'],
  ])('%s en %s mueve el dia %s', async (now, timezone, servedOn) => {
    const { useCase, insertPlan, insertPlanAndMoveServing } = buildUseCase(
      PLAN,
      timezone,
    );
    await useCase.execute({ ...INPUT, now: new Date(now) });
    expect(insertPlanAndMoveServing).toHaveBeenCalledWith(
      expect.objectContaining({ mealTimes: ['08:15', '19:30'] }),
      { servedOn, from: '07:30', to: '08:15' },
    );
    expect(insertPlan).not.toHaveBeenCalled();
  });
});

describe('R7 (meal-schedule-editing #103): meal_time.move se audita despues de escribir y nunca si falla', () => {
  it('audita el id nuevo despues de resolver la escritura', async () => {
    const { useCase, insertPlanAndMoveServing, record } = buildUseCase();
    await useCase.execute(INPUT);
    expect(record).toHaveBeenCalledTimes(1);
    expect(record).toHaveBeenCalledWith({
      userId: 'user',
      action: 'meal_time.move',
      entity: 'nutrition_plan',
      entityId: 'created',
      meta: {
        petId: 'pet',
        from: '07:30',
        to: '08:15',
        servedOn: '2026-10-02',
      },
    });
    expect(insertPlanAndMoveServing.mock.invocationCallOrder[0]).toBeLessThan(
      record.mock.invocationCallOrder[0],
    );
  });

  it('no audita cuando la escritura falla', async () => {
    const { useCase, insertPlanAndMoveServing, record } = buildUseCase();
    insertPlanAndMoveServing.mockRejectedValue(new Error('db down'));
    await expect(useCase.execute(INPUT)).rejects.toThrow('db down');
    expect(record).not.toHaveBeenCalled();
  });
});

describe('R9 (meal-schedule-editing #103): el PATCH lanza en orden sin escribir ni auditar', () => {
  it('sin plan lanza NutritionPlanRequiredError', async () => {
    const { useCase, insertPlan, insertPlanAndMoveServing, record } =
      buildUseCase(null);
    await expect(useCase.execute(INPUT)).rejects.toMatchObject({
      name: 'NutritionPlanRequiredError',
    });
    expect(insertPlan).not.toHaveBeenCalled();
    expect(insertPlanAndMoveServing).not.toHaveBeenCalled();
    expect(record).not.toHaveBeenCalled();
  });
  it('el origen fuera gana al destino duplicado', async () => {
    const { useCase, insertPlan, insertPlanAndMoveServing, record } =
      buildUseCase();
    await expect(
      useCase.execute({ ...INPUT, from: '12:00', to: '07:30' }),
    ).rejects.toMatchObject({ name: 'MealTimeNotInPlanError' });
    expect(insertPlan).not.toHaveBeenCalled();
    expect(insertPlanAndMoveServing).not.toHaveBeenCalled();
    expect(record).not.toHaveBeenCalled();
  });
  it('origen igual al destino lanza MealTimeDuplicateError', async () => {
    const { useCase, insertPlan, insertPlanAndMoveServing, record } =
      buildUseCase();
    await expect(
      useCase.execute({ ...INPUT, to: '07:30' }),
    ).rejects.toMatchObject({ name: 'MealTimeDuplicateError' });
    expect(insertPlan).not.toHaveBeenCalled();
    expect(insertPlanAndMoveServing).not.toHaveBeenCalled();
    expect(record).not.toHaveBeenCalled();
  });
  it('destino ya en el plan lanza MealTimeDuplicateError', async () => {
    const { useCase, insertPlan, insertPlanAndMoveServing, record } =
      buildUseCase();
    await expect(
      useCase.execute({ ...INPUT, to: '19:30' }),
    ).rejects.toMatchObject({ name: 'MealTimeDuplicateError' });
    expect(insertPlan).not.toHaveBeenCalled();
    expect(insertPlanAndMoveServing).not.toHaveBeenCalled();
    expect(record).not.toHaveBeenCalled();
  });
});
