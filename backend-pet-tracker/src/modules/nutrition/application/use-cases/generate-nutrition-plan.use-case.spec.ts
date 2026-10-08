import { Logger } from '@nestjs/common';
import type {
  NutritionEngineInput,
  NutritionPlanResult,
} from '@/modules/nutrition/domain/nutrition-engine';
import type { NutritionExplainerContext } from '@/modules/nutrition/domain/ports/nutrition-explainer';
import {
  NutritionPlan,
  toPlanResult,
} from '@/modules/nutrition/domain/entities/nutrition-plan.entity';
import { NutritionProfile } from '@/modules/nutrition/domain/entities/nutrition-profile.entity';
import type { NutritionRepository } from '@/modules/nutrition/domain/repositories/nutrition.repository';
import type { PetRepository } from '@/modules/pets/domain/repositories/pet.repository';
import type { SubscriptionRepository } from '@/modules/subscriptions/domain/repositories/subscription.repository';
import { nutritionInputHash } from '../nutrition-input-hash';
import { GenerateNutritionPlanUseCase } from './generate-nutrition-plan.use-case';

const petId = 'pet-prueba';
const input = {
  species: 'dog' as const,
  weightKg: 20,
  targetWeightKg: null,
  ageMonths: 36,
  sterilized: true,
  activityLevel: 'medium' as const,
  bodyCondition: null,
  kcalPer100g: 350,
  allergies: [],
  diseases: [],
};
const projected = {
  rerKcal: 662,
  merKcal: 1059,
  dailyGrams: 305,
  mealsPerDay: 3,
  mealTimes: ['08:00', '14:00', '22:00'],
  objective: 'maintenance' as const,
  warnings: [],
};
function setup(
  text: string | null = 'texto',
  tracked = true,
  latest: NutritionPlan | null = null,
) {
  const inserted = new NutritionPlan({
    id: 'plan-insertado',
    petId,
    ...projected,
    engineMealsPerDay: 2,
    aiExplanation: null,
    inputsHash: nutritionInputHash(input),
    generatedAt: new Date(),
  });
  const updated = new NutritionPlan({ ...inserted, aiExplanation: text });
  const findProfile = jest.fn().mockResolvedValue(
    new NutritionProfile({
      petId,
      activityLevel: 'medium',
      bodyCondition: null,
      targetWeightKg: null,
      foodType: 'dry',
      kcalPer100g: 350,
      allergies: [],
      diseases: [],
      updatedAt: new Date(),
    }),
  );
  const insertPlan = jest.fn().mockResolvedValue(inserted);
  const setAiExplanation = jest.fn().mockResolvedValue(updated);
  const findLatestPlan = jest.fn().mockResolvedValue(latest);
  const nutrition = {
    findProfile,
    findLatestPlan,
    insertPlan,
    setAiExplanation,
  } as unknown as NutritionRepository;
  const findById = jest.fn().mockResolvedValue({
    id: petId,
    species: 'dog',
    currentWeightKg: 20,
    sterilized: true,
    birthDate: null,
    approxAgeMonths: 36,
    createdAt: new Date(),
  });
  const pets = { findById } as unknown as PetRepository;
  const isPetTracked = jest.fn().mockResolvedValue(tracked);
  const subscriptions = { isPetTracked } as unknown as SubscriptionRepository;
  const explain = jest
    .fn<
      Promise<string | null>,
      [NutritionEngineInput, NutritionPlanResult, NutritionExplainerContext]
    >()
    .mockResolvedValue(text);
  const useCase = new GenerateNutritionPlanUseCase(
    nutrition,
    pets,
    subscriptions,
    { explain },
  );
  return {
    useCase,
    inserted,
    updated,
    insertPlan,
    setAiExplanation,
    findLatestPlan,
    isPetTracked,
    explain,
  };
}
describe('R12 (nutrition-ai-explainer #18): inserta antes de explicar y devuelve el UPDATE', () => {
  it('INSERT < entitlement < IA < UPDATE con aiExplanation inicial null', async () => {
    const f = setup();
    const plan = await f.useCase.execute(petId);
    expect(f.insertPlan).toHaveBeenCalledWith(
      expect.objectContaining({ petId, aiExplanation: null }),
    );
    expect(f.isPetTracked).toHaveBeenCalledTimes(1);
    expect(f.explain).toHaveBeenCalledTimes(1);
    expect(f.setAiExplanation).toHaveBeenCalledWith(f.inserted.id, 'texto');
    expect(f.insertPlan.mock.invocationCallOrder[0]).toBeLessThan(
      f.isPetTracked.mock.invocationCallOrder[0],
    );
    expect(f.isPetTracked.mock.invocationCallOrder[0]).toBeLessThan(
      f.explain.mock.invocationCallOrder[0],
    );
    expect(f.explain.mock.invocationCallOrder[0]).toBeLessThan(
      f.setAiExplanation.mock.invocationCallOrder[0],
    );
    expect(plan).toBe(f.updated);
  });
  it('IA null devuelve el plan insertado sin UPDATE', async () => {
    const f = setup(null);
    expect(await f.useCase.execute(petId)).toBe(f.inserted);
    expect(f.explain).toHaveBeenCalledTimes(1);
    expect(f.setAiExplanation).not.toHaveBeenCalled();
  });
  it('explica las siete claves del plan persistido con horario distinto del motor y ctx de trazas', async () => {
    const f = setup();
    await f.useCase.execute(petId);
    expect(f.explain).toHaveBeenCalledTimes(1);
    expect(f.explain.mock.calls[0][0]).toEqual(input);
    expect(f.explain.mock.calls[0][1]).toEqual({
      rerKcal: 662,
      merKcal: 1059,
      dailyGrams: 305,
      mealsPerDay: 3,
      mealTimes: ['08:00', '14:00', '22:00'],
      objective: 'maintenance',
      warnings: [],
    });
    expect(f.explain.mock.calls[0][2]).toEqual({
      petId,
      planId: 'plan-insertado',
    });
  });
  it('toPlanResult proyecta exactamente las siete claves sin identificadores', () => {
    expect(toPlanResult(setup().inserted)).toEqual({
      rerKcal: 662,
      merKcal: 1059,
      dailyGrams: 305,
      mealsPerDay: 3,
      mealTimes: ['08:00', '14:00', '22:00'],
      objective: 'maintenance',
      warnings: [],
    });
  });
});

describe('R14 (nutrition-ai-explainer #18): entitlement decide la explicacion sin muro de pago ni log', () => {
  afterEach(() => jest.restoreAllMocks());
  it('sin entitlement devuelve el plan completo sin IA, UPDATE, warn ni error', async () => {
    const warn = jest
      .spyOn(Logger.prototype, 'warn')
      .mockImplementation(() => undefined);
    const error = jest
      .spyOn(Logger.prototype, 'error')
      .mockImplementation(() => undefined);
    const f = setup('texto', false);
    const plan = await f.useCase.execute(petId);
    expect(f.isPetTracked).toHaveBeenCalledWith(petId);
    expect(f.explain).not.toHaveBeenCalled();
    expect(f.setAiExplanation).not.toHaveBeenCalled();
    expect(plan).toBe(f.inserted);
    expect(plan.aiExplanation).toBeNull();
    expect(warn).not.toHaveBeenCalled();
    expect(error).not.toHaveBeenCalled();
  });
  it('anti-vacio: con entitlement llama una vez y devuelve texto', async () => {
    const f = setup('texto', true);
    expect((await f.useCase.execute(petId)).aiExplanation).toBe('texto');
    expect(f.explain).toHaveBeenCalledTimes(1);
  });
});
