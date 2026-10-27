import { Logger } from '@nestjs/common';
import { NUTRITION_AI_DAILY_LIMIT } from '@/modules/nutrition/domain/nutrition-ai-proposal';
import type { NutritionAiOutput } from '@/modules/nutrition/domain/nutrition-ai-proposal';
import type {
  NutritionWeightPoint,
  NutritionWeightReader,
} from '@/modules/nutrition/domain/ports/nutrition-weight-reader';
import type { NutritionExplainerContext } from '@/modules/nutrition/domain/ports/nutrition-explainer';
import type {
  NutritionEngineInput,
  NutritionPlanResult,
} from '@/modules/nutrition/domain/nutrition-engine';
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
const now = new Date('2026-10-26T05:30:00Z');
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
const projected: NutritionPlanResult = {
  rerKcal: 662,
  merKcal: 1059,
  dailyGrams: 305,
  mealsPerDay: 3,
  mealTimes: ['08:00', '14:00', '22:00'],
  objective: 'maintenance',
  warnings: [],
};
const VALID_OUTPUT: NutritionAiOutput = {
  mealGrams: [
    { mealTime: '08:00', grams: 100 },
    { mealTime: '14:00', grams: 100 },
    { mealTime: '22:00', grams: 105 },
  ],
  recommendations: ['Pésala cada dos semanas.'],
  reviewInDays: 30,
  explanation: 'Tu perro necesita...',
};
function setup(
  options: {
    output?: NutritionAiOutput | null;
    tracked?: boolean;
    latest?: NutritionPlan | null;
    granted?: boolean;
    timezone?: string;
    trend?: NutritionWeightPoint[];
  } = {},
) {
  const inserted = new NutritionPlan({
    id: 'plan-insertado',
    petId,
    ...projected,
    engineMealsPerDay: 2,
    aiExplanation: null,
    aiProposal: null,
    inputsHash: nutritionInputHash(input, []),
    generatedAt: now,
  });
  const proposal = {
    mealGrams: VALID_OUTPUT.mealGrams,
    recommendations: VALID_OUTPUT.recommendations,
    reviewDate: '2026-11-25',
  };
  const updated = new NutritionPlan({
    ...inserted,
    aiExplanation: VALID_OUTPUT.explanation,
    aiProposal: proposal,
  });
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
      updatedAt: now,
    }),
  );
  const findLatestPlan = jest.fn().mockResolvedValue(options.latest ?? null);
  const insertPlan = jest.fn().mockResolvedValue(inserted);
  const consumeAiGeneration = jest
    .fn()
    .mockResolvedValue(options.granted ?? true);
  const setAiResult = jest.fn().mockResolvedValue(updated);
  const nutrition = {
    findProfile,
    findLatestPlan,
    insertPlan,
    consumeAiGeneration,
    setAiResult,
  } as unknown as NutritionRepository;
  const findById = jest.fn().mockResolvedValue({
    id: petId,
    species: 'dog',
    currentWeightKg: 20,
    sterilized: true,
    birthDate: null,
    approxAgeMonths: 36,
    createdAt: now,
  });
  const findOwnerTimezone = jest
    .fn()
    .mockResolvedValue(options.timezone ?? 'UTC');
  const pets = { findById, findOwnerTimezone } as unknown as PetRepository;
  const isPetTracked = jest.fn().mockResolvedValue(options.tracked ?? true);
  const subscriptions = { isPetTracked } as unknown as SubscriptionRepository;
  const explain = jest
    .fn<
      Promise<NutritionAiOutput | null>,
      [
        NutritionEngineInput,
        NutritionPlanResult,
        NutritionWeightPoint[],
        NutritionExplainerContext,
      ]
    >()
    .mockResolvedValue(
      options.output === undefined ? VALID_OUTPUT : options.output,
    );
  const listRecent = jest
    .fn<Promise<NutritionWeightPoint[]>, [string, number]>()
    .mockResolvedValue(options.trend ?? []);
  const weights: NutritionWeightReader = { listRecent };
  const useCase = new GenerateNutritionPlanUseCase(
    nutrition,
    pets,
    subscriptions,
    { explain },
    weights,
  );
  return {
    useCase,
    inserted,
    updated,
    proposal,
    insertPlan,
    setAiResult,
    findLatestPlan,
    consumeAiGeneration,
    isPetTracked,
    explain,
    listRecent,
    findOwnerTimezone,
  };
}

describe('toPlanResult: proyeccion conservada de nutrition-ai-explainer #18', () => {
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

describe('R13 (nutrition-ai-structured-plan #212): estados de la fase de IA', () => {
  let warn: jest.SpyInstance<
    ReturnType<Logger['warn']>,
    Parameters<Logger['warn']>
  >;
  let error: jest.SpyInstance<
    ReturnType<Logger['error']>,
    Parameters<Logger['error']>
  >;
  beforeEach(() => {
    warn = jest
      .spyOn(Logger.prototype, 'warn')
      .mockImplementation(() => undefined);
    error = jest
      .spyOn(Logger.prototype, 'error')
      .mockImplementation(() => undefined);
  });
  afterEach(() => jest.restoreAllMocks());
  it('R13: sin collar devuelve not_tracked sin consumir, llamar a la IA, actualizar, avisar ni fallar', async () => {
    const f = setup({ tracked: false });
    expect(await f.useCase.execute(petId, now)).toStrictEqual({
      plan: f.inserted,
      aiStatus: 'not_tracked',
    });
    expect(f.consumeAiGeneration).not.toHaveBeenCalled();
    expect(f.explain).not.toHaveBeenCalled();
    expect(f.setAiResult).not.toHaveBeenCalled();
    expect(warn).not.toHaveBeenCalled();
    expect(error).not.toHaveBeenCalled();
  });
  it('R13: limite agotado devuelve limit_reached sin llamar a la IA', async () => {
    const f = setup({ granted: false });
    expect(await f.useCase.execute(petId, now)).toStrictEqual({
      plan: f.inserted,
      aiStatus: 'limit_reached',
    });
    expect(f.consumeAiGeneration).toHaveBeenCalledTimes(1);
    expect(f.explain).not.toHaveBeenCalled();
    expect(f.setAiResult).not.toHaveBeenCalled();
  });
  it('R13: IA null devuelve unavailable sin UPDATE', async () => {
    const f = setup({ output: null });
    expect(await f.useCase.execute(petId, now)).toStrictEqual({
      plan: f.inserted,
      aiStatus: 'unavailable',
    });
    expect(f.explain).toHaveBeenCalledTimes(1);
    expect(f.setAiResult).not.toHaveBeenCalled();
  });
  it('R13: propuesta fuera de cota devuelve rejected con un warn y sin UPDATE', async () => {
    const f = setup({
      output: {
        ...VALID_OUTPUT,
        mealGrams: [
          { mealTime: '08:00', grams: 50 },
          { mealTime: '14:00', grams: 50 },
          { mealTime: '22:00', grams: 50 },
        ],
      },
    });
    expect(await f.useCase.execute(petId, now)).toStrictEqual({
      plan: f.inserted,
      aiStatus: 'rejected',
    });
    expect(f.setAiResult).not.toHaveBeenCalled();
    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn.mock.calls[0][0]).toStrictEqual({
      scope: 'nutrition-ai',
      petId,
      planId: f.inserted.id,
      message: 'ai proposal out of bounds',
    });
  });
  it('R13: propuesta valida devuelve proposed y la fila actualizada', async () => {
    const f = setup();
    expect(await f.useCase.execute(petId, now)).toStrictEqual({
      plan: f.updated,
      aiStatus: 'proposed',
    });
    expect(f.setAiResult).toHaveBeenCalledTimes(1);
    expect(f.setAiResult).toHaveBeenCalledWith(
      f.inserted.id,
      'Tu perro necesita...',
      {
        mealGrams: [
          { mealTime: '08:00', grams: 100 },
          { mealTime: '14:00', grams: 100 },
          { mealTime: '22:00', grams: 105 },
        ],
        recommendations: ['Pésala cada dos semanas.'],
        reviewDate: '2026-11-25',
      },
    );
  });
  it('R13: orden INSERT, collar, consumo, IA y UPDATE', async () => {
    const f = setup();
    await f.useCase.execute(petId, now);
    const calls = [
      f.insertPlan,
      f.isPetTracked,
      f.consumeAiGeneration,
      f.explain,
      f.setAiResult,
    ];
    for (const mock of calls) expect(mock).toHaveBeenCalledTimes(1);
    for (let index = 1; index < calls.length; index++) {
      expect(calls[index - 1].mock.invocationCallOrder[0]).toBeLessThan(
        calls[index].mock.invocationCallOrder[0],
      );
    }
  });
});

describe('R14 (nutrition-ai-structured-plan #212): entradas de la fase de IA', () => {
  const trend: NutritionWeightPoint[] = [
    { measuredAt: '2026-06-01', weightKg: 18.5 },
    { measuredAt: '2026-07-01', weightKg: 19 },
    { measuredAt: '2026-08-01', weightKg: 19.25 },
    { measuredAt: '2026-09-01', weightKg: 19.5 },
    { measuredAt: '2026-10-01', weightKg: 20 },
  ];
  it('R14: consume con la mascota, el dia local del dueno y el limite 3', async () => {
    const f = setup({ timezone: 'America/Mexico_City' });
    await f.useCase.execute(petId, new Date('2026-10-26T05:30:00Z'));
    expect(f.consumeAiGeneration).toHaveBeenCalledWith(
      'pet-prueba',
      '2026-10-25',
      3,
    );
    expect(NUTRITION_AI_DAILY_LIMIT).toBe(3);
  });
  it('R14: lee cinco pesos y los pasa a la IA y al hash', async () => {
    const f = setup({ trend });
    await f.useCase.execute(petId, now);
    expect(f.listRecent).toHaveBeenCalledWith('pet-prueba', 5);
    expect(f.explain).toHaveBeenCalledTimes(1);
    expect(f.explain.mock.calls[0][2]).toStrictEqual([
      { measuredAt: '2026-06-01', weightKg: 18.5 },
      { measuredAt: '2026-07-01', weightKg: 19 },
      { measuredAt: '2026-08-01', weightKg: 19.25 },
      { measuredAt: '2026-09-01', weightKg: 19.5 },
      { measuredAt: '2026-10-01', weightKg: 20 },
    ]);
    const [inserted] = f.insertPlan.mock.calls[0] as [{ inputsHash: string }];
    expect(inserted.inputsHash).toBe(
      '236528deeb4b704b65e87114a81d4f8ebb26d8e0d92ef038ff34bb049fd3ad90',
    );
  });
  it('R14: la fecha de revision parte del dia local del dueno', async () => {
    const f = setup({
      timezone: 'America/Mexico_City',
      output: { ...VALID_OUTPUT, reviewInDays: 7 },
    });
    await f.useCase.execute(petId, new Date('2026-10-26T05:30:00Z'));
    expect(f.setAiResult).toHaveBeenCalledTimes(1);
    const [, , proposal] = f.setAiResult.mock.calls[0] as [
      string,
      string,
      { reviewDate: string },
    ];
    expect(proposal.reviewDate).toBe('2026-11-01');
  });
});

describe('R15 (nutrition-ai-structured-plan #212): acierto de cache', () => {
  it('R15: hash igual con propuesta devuelve proposed sin collar, consumo, IA, INSERT ni UPDATE', async () => {
    const latest = setup().updated;
    const f = setup({ latest });
    const result = await f.useCase.execute(petId, now);
    expect(f.isPetTracked).not.toHaveBeenCalled();
    expect(f.consumeAiGeneration).not.toHaveBeenCalled();
    expect(f.explain).not.toHaveBeenCalled();
    expect(f.insertPlan).not.toHaveBeenCalled();
    expect(f.setAiResult).not.toHaveBeenCalled();
    expect(result.aiStatus).toBe('proposed');
    expect(result.plan).toBe(latest);
  });
  it('R15: hash igual sin propuesta reintenta sobre la misma fila con su horario editado y sin INSERT', async () => {
    const latest = new NutritionPlan({
      ...setup().inserted,
      id: 'plan-editado',
      mealsPerDay: 2,
      mealTimes: ['08:15', '19:30'],
    });
    const f = setup({
      latest,
      output: {
        ...VALID_OUTPUT,
        mealGrams: [
          { mealTime: '08:15', grams: 150 },
          { mealTime: '19:30', grams: 155 },
        ],
      },
    });
    const result = await f.useCase.execute(petId, now);
    expect(f.insertPlan).not.toHaveBeenCalled();
    expect(f.explain).toHaveBeenCalledTimes(1);
    expect(f.explain.mock.calls[0][1].mealTimes).toStrictEqual([
      '08:15',
      '19:30',
    ]);
    expect(f.setAiResult).toHaveBeenCalledTimes(1);
    const [planId] = f.setAiResult.mock.calls[0] as [string];
    expect(planId).toBe('plan-editado');
    expect(result.aiStatus).toBe('proposed');
  });
  it('R15: hash igual sin propuesta y sin collar devuelve not_tracked sin INSERT', async () => {
    const latest = setup().inserted;
    const f = setup({ latest, tracked: false });
    const result = await f.useCase.execute(petId, now);
    expect(result.aiStatus).toBe('not_tracked');
    expect(result.plan).toBe(latest);
    expect(f.insertPlan).not.toHaveBeenCalled();
    expect(f.consumeAiGeneration).not.toHaveBeenCalled();
    expect(f.explain).not.toHaveBeenCalled();
    expect(f.setAiResult).not.toHaveBeenCalled();
  });
});
