import { GenerateNutritionPlanUseCase } from './generate-nutrition-plan.use-case';

const now = new Date('2026-08-18T12:00:00.000Z');

function createHarness() {
  const calls: string[] = [];
  let latestPlan: Record<string, unknown> | null = null;
  const profile = {
    petId: 'pet-1',
    foodType: 'dry',
    kcalPer100g: 350,
    activityLevel: 'moderate',
    bodyCondition: 5,
    targetWeightKg: null,
    allergies: [],
    diseases: [],
    createdAt: now,
    updatedAt: now,
  };
  const pet = {
    id: 'pet-1',
    species: 'dog',
    currentWeightKg: 20,
    birthDate: new Date('2024-08-18T12:00:00.000Z'),
    sterilized: true,
  };
  const nutritionRepository = {
    findProfile: jest.fn().mockResolvedValue(profile),
    findLatestPlan: jest.fn(async () => latestPlan),
    insertPlan: jest.fn(async (plan: Record<string, unknown>) => {
      calls.push('insert');
      latestPlan = plan;
      return plan;
    }),
    setAiExplanation: jest.fn(async (planId: string, explanation: string) => {
      calls.push('update');
      latestPlan = { ...latestPlan, id: planId, aiExplanation: explanation };
      return latestPlan;
    }),
  };
  const petRepository = {
    findById: jest.fn().mockResolvedValue(pet),
  };
  const explainer = {
    explain: jest.fn(async () => {
      calls.push('explain');
      return 'Generated explanation';
    }),
  };
  const subscriptionRepository = {
    isPetTracked: jest.fn(async () => {
      calls.push('gate');
      return true;
    }),
  };
  const useCase = new GenerateNutritionPlanUseCase(
    nutritionRepository as never,
    petRepository as never,
    explainer as never,
    subscriptionRepository as never,
  );

  return {
    calls,
    explainer,
    nutritionRepository,
    subscriptionRepository,
    useCase,
    getLatestPlan: () => latestPlan,
  };
}

describe('R12 (nutrition-ai-explainer #18): insert antes de la IA y update despues', () => {
  it('persists first and passes the persisted identifiers only as log context', async () => {
    const harness = createHarness();

    const plan = await harness.useCase.execute('pet-1', now);

    expect(harness.calls).toEqual(['insert', 'gate', 'explain', 'update']);
    expect(harness.explainer.explain).toHaveBeenCalledWith(
      expect.any(Object),
      expect.any(Object),
      { petId: 'pet-1', planId: plan.id },
    );
    expect(harness.nutritionRepository.setAiExplanation).toHaveBeenCalledWith(
      plan.id,
      'Generated explanation',
    );
    expect(plan.aiExplanation).toBe('Generated explanation');
  });
});
