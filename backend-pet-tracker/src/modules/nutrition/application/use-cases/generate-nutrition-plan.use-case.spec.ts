import { GenerateNutritionPlanUseCase } from './generate-nutrition-plan.use-case';

const now = new Date('2026-08-18T12:00:00.000Z');

function createHarness() {
  const calls: string[] = [];
  let latestPlan: Record<string, unknown> | null = null;
  const profile = {
    petId: 'pet-1',
    foodType: 'dry',
    kcalPer100g: 350,
    activityLevel: 'medium',
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
    birthDate: '2024-08-18',
    sterilized: true,
  };
  const nutritionRepository = {
    findProfile: jest.fn().mockResolvedValue(profile),
    findLatestPlan: jest.fn(() => Promise.resolve(latestPlan)),
    insertPlan: jest.fn((plan: Record<string, unknown>) => {
      calls.push('insert');
      latestPlan = plan;
      return Promise.resolve(plan);
    }),
    setAiExplanation: jest.fn((planId: string, explanation: string) => {
      calls.push('update');
      latestPlan = { ...latestPlan, id: planId, aiExplanation: explanation };
      return Promise.resolve(latestPlan);
    }),
  };
  const petRepository = {
    findById: jest.fn().mockResolvedValue(pet),
  };
  const explainer = {
    explain: jest.fn(() => {
      calls.push('explain');
      return Promise.resolve('Generated explanation');
    }),
  };
  const subscriptionRepository = {
    isPetTracked: jest.fn(() => {
      calls.push('gate');
      return Promise.resolve(true);
    }),
  };
  const useCase = new GenerateNutritionPlanUseCase(
    nutritionRepository as never,
    petRepository as never,
    explainer,
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

    const plan = await harness.useCase.execute('pet-1');

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

describe('R14 (nutrition-ai-explainer #18): sin entitlement no se llama a la IA', () => {
  it('keeps the inserted plan null when the pet is not tracked', async () => {
    const harness = createHarness();
    harness.subscriptionRepository.isPetTracked.mockImplementation(() => {
      harness.calls.push('gate');
      return Promise.resolve(false);
    });

    const plan = await harness.useCase.execute('pet-1');

    expect(harness.subscriptionRepository.isPetTracked).toHaveBeenCalledWith(
      'pet-1',
    );
    expect(harness.explainer.explain).not.toHaveBeenCalled();
    expect(harness.nutritionRepository.setAiExplanation).not.toHaveBeenCalled();
    expect(plan.aiExplanation).toBeNull();
  });

  it('calls the explainer and returns non-empty text when the pet is tracked', async () => {
    const harness = createHarness();

    const plan = await harness.useCase.execute('pet-1');

    expect(harness.explainer.explain).toHaveBeenCalledTimes(1);
    expect(plan.aiExplanation).toBe('Generated explanation');
  });
});

describe('R15 (nutrition-ai-explainer #18): hash hit con null reintenta sobre la misma fila', () => {
  it('enriches the existing null plan without inserting another row', async () => {
    const harness = createHarness();
    let gateCall = 0;
    harness.subscriptionRepository.isPetTracked.mockImplementation(() => {
      harness.calls.push('gate');
      gateCall += 1;
      return Promise.resolve(gateCall > 1);
    });

    const first = await harness.useCase.execute('pet-1');
    const second = await harness.useCase.execute('pet-1');

    expect(first.aiExplanation).toBeNull();
    expect(second.id).toBe(first.id);
    expect(second.aiExplanation).toBe('Generated explanation');
    expect(harness.nutritionRepository.insertPlan).toHaveBeenCalledTimes(1);
    expect(harness.explainer.explain).toHaveBeenCalledTimes(1);
    expect(harness.nutritionRepository.setAiExplanation).toHaveBeenCalledWith(
      first.id,
      'Generated explanation',
    );
  });
});

describe('R16 (nutrition-ai-explainer #18): hash hit con explicacion no re-llama', () => {
  it('returns the enriched row without another entitlement or provider call', async () => {
    const harness = createHarness();

    const first = await harness.useCase.execute('pet-1');
    const second = await harness.useCase.execute('pet-1');

    expect(first.aiExplanation).toBe('Generated explanation');
    expect(second.id).toBe(first.id);
    expect(second.aiExplanation).toBe('Generated explanation');
    expect(harness.nutritionRepository.insertPlan).toHaveBeenCalledTimes(1);
    expect(harness.subscriptionRepository.isPetTracked).toHaveBeenCalledTimes(
      1,
    );
    expect(harness.explainer.explain).toHaveBeenCalledTimes(1);
    expect(harness.nutritionRepository.setAiExplanation).toHaveBeenCalledTimes(
      1,
    );
  });
});
