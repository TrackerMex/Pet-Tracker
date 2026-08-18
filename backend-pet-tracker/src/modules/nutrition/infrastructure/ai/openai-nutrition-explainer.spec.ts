import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { Logger } from '@nestjs/common';
import type {
  NutritionEngineInput,
  NutritionPlanResult,
} from '@/modules/nutrition/domain/nutrition-engine';
import {
  NUTRITION_AI_MAX_OUTPUT_TOKENS,
  NUTRITION_AI_SYSTEM_PROMPT,
  NUTRITION_AI_TIMEOUT_MS,
  buildUserPrompt,
} from './nutrition-prompt';
import { OpenAiNutritionExplainer } from './openai-nutrition-explainer';

const input = {
  species: 'dog',
  weightKg: 20,
  targetWeightKg: null,
  ageMonths: 24,
  sterilized: true,
  activityLevel: 'moderate',
  bodyCondition: 5,
  hasChronicDisease: false,
  allergies: [],
  diseases: [],
} as NutritionEngineInput;

const result = {
  rerKcal: 662,
  merKcal: 1059,
  dailyGrams: 305,
  mealsPerDay: 2,
  gramsPerMeal: 152.5,
  schedule: ['07:30', '19:30'],
  objective: 'maintenance',
  warnings: [],
} as NutritionPlanResult;

const ctx = { petId: 'pet-1', planId: 'plan-1' };

describe('R9 (nutrition-ai-explainer #18): modelo por env, timeout 15 s y maxRetries 0', () => {
  it('uses the approved client and completion parameters without temperature', async () => {
    const create = jest.fn().mockResolvedValue({
      choices: [{ message: { content: 'Explanation' }, finish_reason: 'stop' }],
      usage: { total_tokens: 10 },
    });
    const explainer = new OpenAiNutritionExplainer('model-from-env', 'key', {
      create,
    });

    await explainer.explain(input, result, ctx);

    expect(create).toHaveBeenCalledWith({
      model: 'model-from-env',
      messages: [
        { role: 'system', content: NUTRITION_AI_SYSTEM_PROMPT },
        { role: 'user', content: buildUserPrompt(input, result) },
      ],
      max_completion_tokens: NUTRITION_AI_MAX_OUTPUT_TOKENS,
    });
    const source = readFileSync(
      join(__dirname, 'openai-nutrition-explainer.ts'),
      'utf8',
    );
    expect(NUTRITION_AI_TIMEOUT_MS).toBe(15_000);
    expect(NUTRITION_AI_MAX_OUTPUT_TOKENS).toBe(1_200);
    expect(source).toContain('timeout: NUTRITION_AI_TIMEOUT_MS');
    expect(source).toContain('maxRetries: 0');
    expect(source).not.toContain('max_tokens');
  });
});

describe('R10 (nutrition-ai-explainer #18): respuesta vacia o truncada se normaliza a null', () => {
  const degradedResponses = [
    ['null content', null, 'stop'],
    ['empty content', '', 'stop'],
    ['blank content', '   ', 'stop'],
    ['truncated content', 'Partial explanation', 'length'],
  ] as const;

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it.each(degradedResponses)(
    'returns null and warns for %s',
    async (_case, content, finishReason) => {
      const usage = { total_tokens: 20 };
      const warn = jest.spyOn(Logger.prototype, 'warn').mockImplementation();
      const explainer = new OpenAiNutritionExplainer('model', 'key', {
        create: jest.fn().mockResolvedValue({
          choices: [{ message: { content }, finish_reason: finishReason }],
          usage,
        }),
      });

      await expect(explainer.explain(input, result, ctx)).resolves.toBeNull();
      expect(warn).toHaveBeenCalledWith(
        expect.objectContaining({
          scope: 'nutrition-ai',
          petId: ctx.petId,
          planId: ctx.planId,
          finishReason,
          usage,
        }),
      );
    },
  );

  it('returns trimmed content without warning on a complete response', async () => {
    const warn = jest.spyOn(Logger.prototype, 'warn').mockImplementation();
    const explainer = new OpenAiNutritionExplainer('model', 'key', {
      create: jest.fn().mockResolvedValue({
        choices: [
          {
            message: { content: '  Complete explanation  ' },
            finish_reason: 'stop',
          },
        ],
        usage: { total_tokens: 20 },
      }),
    });

    await expect(explainer.explain(input, result, ctx)).resolves.toBe(
      'Complete explanation',
    );
    expect(warn).not.toHaveBeenCalled();
  });
});

describe('R11 (nutrition-ai-explainer #18): todo fallo degrada a null con warn', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('contains provider failures and logs only safe context', async () => {
    const warn = jest.spyOn(Logger.prototype, 'warn').mockImplementation();
    const explainer = new OpenAiNutritionExplainer('model', 'SECRET_API_KEY', {
      create: jest.fn().mockRejectedValue(new Error('provider failed')),
    });
    const sensitiveInput = {
      ...input,
      allergies: ['SECRET_ALLERGY'],
      diseases: ['SECRET_DISEASE'],
    };

    await expect(
      explainer.explain(sensitiveInput, result, ctx),
    ).resolves.toBeNull();
    expect(warn).toHaveBeenCalledWith(
      expect.objectContaining({
        scope: 'nutrition-ai',
        petId: ctx.petId,
        planId: ctx.planId,
      }),
    );
    const logged = JSON.stringify(warn.mock.calls);
    expect(logged).not.toContain('SECRET_API_KEY');
    expect(logged).not.toContain('SECRET_ALLERGY');
    expect(logged).not.toContain('SECRET_DISEASE');
  });

  it('still returns a non-empty successful explanation', async () => {
    const warn = jest.spyOn(Logger.prototype, 'warn').mockImplementation();
    const explainer = new OpenAiNutritionExplainer('model', 'key', {
      create: jest.fn().mockResolvedValue({
        choices: [
          {
            message: { content: 'Available explanation' },
            finish_reason: 'stop',
          },
        ],
      }),
    });

    await expect(explainer.explain(input, result, ctx)).resolves.toBe(
      'Available explanation',
    );
    expect(warn).not.toHaveBeenCalled();
  });
});
