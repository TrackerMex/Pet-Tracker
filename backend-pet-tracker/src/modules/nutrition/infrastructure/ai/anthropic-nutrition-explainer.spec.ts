import { Logger } from '@nestjs/common';
import type {
  NutritionEngineInput,
  NutritionPlanResult,
} from '@/modules/nutrition/domain/nutrition-engine';
import {
  buildUserPrompt,
  NUTRITION_AI_SYSTEM_PROMPT,
  NUTRITION_AI_OUTPUT_JSON_SCHEMA,
} from './nutrition-prompt';
import {
  AnthropicNutritionExplainer,
  NUTRITION_AI_TIMEOUT_MS,
  NUTRITION_AI_MAX_RETRIES,
  NUTRITION_AI_MAX_OUTPUT_TOKENS,
} from './anthropic-nutrition-explainer';
import type {
  AnthropicClientOptions,
  AnthropicSdkLoader,
  AnthropicMessageParams,
  AnthropicMessageResponse,
} from './anthropic-nutrition-explainer';

const input: NutritionEngineInput = {
  species: 'dog',
  weightKg: 20,
  targetWeightKg: null,
  ageMonths: 36,
  sterilized: true,
  activityLevel: 'medium',
  bodyCondition: null,
  kcalPer100g: 350,
  allergies: ['pollo'],
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
const ctx = {
  petId: '11111111-1111-1111-1111-111111111111',
  planId: '22222222-2222-2222-2222-222222222222',
};

const VALID_OUTPUT = {
  mealGrams: [
    { mealTime: '08:00', grams: 100 },
    { mealTime: '14:00', grams: 100 },
    { mealTime: '22:00', grams: 105 },
  ],
  recommendations: ['Pésala cada dos semanas.'],
  reviewInDays: 30,
  explanation: 'Tu perro necesita...',
};

describe('R6 (nutrition-ai-structured-plan #212): parametros estructurados', () => {
  it('R6: fija timeout, reintentos y tope de tokens', () => {
    expect(NUTRITION_AI_TIMEOUT_MS).toBe(15000);
    expect(NUTRITION_AI_MAX_RETRIES).toBe(0);
    expect(NUTRITION_AI_MAX_OUTPUT_TOKENS).toBe(2000);
  });
  it('R6: llama una vez con exactamente model, max_tokens, system, messages, thinking y output_config', async () => {
    const create = jest
      .fn<Promise<AnthropicMessageResponse>, [AnthropicMessageParams]>()
      .mockResolvedValue({
        content: [{ type: 'text', text: JSON.stringify(VALID_OUTPUT) }],
        stop_reason: 'end_turn',
      });
    const adapter = new AnthropicNutritionExplainer(
      'modelo-de-prueba',
      'clave-de-prueba',
      { create },
    );
    await adapter.explain(input, result, [], ctx);
    expect(create).toHaveBeenCalledTimes(1);
    expect(create.mock.calls[0][0]).toStrictEqual({
      model: 'modelo-de-prueba',
      max_tokens: 2000,
      system: NUTRITION_AI_SYSTEM_PROMPT,
      messages: [{ role: 'user', content: buildUserPrompt(input, result, []) }],
      thinking: { type: 'disabled' },
      output_config: {
        format: {
          type: 'json_schema',
          schema: NUTRITION_AI_OUTPUT_JSON_SCHEMA,
        },
      },
    });
  });
  it('R6: el esquema JSON es el literal de la spec', () => {
    expect(NUTRITION_AI_OUTPUT_JSON_SCHEMA).toEqual({
      type: 'object',
      properties: {
        mealGrams: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              mealTime: { type: 'string' },
              grams: { type: 'integer' },
            },
            required: ['mealTime', 'grams'],
            additionalProperties: false,
          },
        },
        recommendations: { type: 'array', items: { type: 'string' } },
        reviewInDays: { type: 'integer' },
        explanation: { type: 'string' },
      },
      required: ['mealGrams', 'recommendations', 'reviewInDays', 'explanation'],
      additionalProperties: false,
    });
  });
  it('R6: construye el cliente perezoso con clave explicita y constantes', async () => {
    const options: AnthropicClientOptions[] = [];
    const create = jest
      .fn<Promise<AnthropicMessageResponse>, [AnthropicMessageParams]>()
      .mockResolvedValue({
        stop_reason: 'end_turn',
        content: [{ type: 'text', text: JSON.stringify(VALID_OUTPUT) }],
      });
    class WorkingSdk {
      readonly messages = { create };
      constructor(value: AnthropicClientOptions) {
        options.push(value);
      }
    }
    const loadSdk: AnthropicSdkLoader = jest
      .fn<ReturnType<AnthropicSdkLoader>, []>()
      .mockResolvedValue({ default: WorkingSdk });
    const adapter = new AnthropicNutritionExplainer(
      'modelo-de-prueba',
      'clave-de-prueba',
      null,
      loadSdk,
    );
    expect(options).toEqual([]);
    expect(loadSdk).not.toHaveBeenCalled();
    await adapter.explain(input, result, [], ctx);
    expect(loadSdk).toHaveBeenCalledTimes(1);
    expect(options).toStrictEqual([
      { apiKey: 'clave-de-prueba', timeout: 15000, maxRetries: 0 },
    ]);
    expect(create).toHaveBeenCalledTimes(1);
  });
});

describe('R7 (nutrition-ai-structured-plan #212): validacion de salida', () => {
  let warn: jest.SpyInstance<
    ReturnType<Logger['warn']>,
    Parameters<Logger['warn']>
  >;
  beforeEach(() => {
    warn = jest
      .spyOn(Logger.prototype, 'warn')
      .mockImplementation(() => undefined);
  });
  afterEach(() => jest.restoreAllMocks());
  const usage = { input_tokens: 10, output_tokens: 20 };
  const responseFor = (output: unknown): AnthropicMessageResponse => ({
    stop_reason: 'end_turn',
    content: [{ type: 'text', text: JSON.stringify(output) }],
    usage,
  });
  function adapterFor(response: AnthropicMessageResponse) {
    return new AnthropicNutritionExplainer(
      'modelo-de-prueba',
      'clave-de-prueba',
      {
        create: jest
          .fn<Promise<AnthropicMessageResponse>, [AnthropicMessageParams]>()
          .mockResolvedValue(response),
      },
    );
  }
  async function expectDiscard(response: AnthropicMessageResponse) {
    await expect(
      adapterFor(response).explain(input, result, [], ctx),
    ).resolves.toBeNull();
    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn.mock.calls[0][0]).toStrictEqual({
      scope: 'nutrition-ai',
      petId: ctx.petId,
      planId: ctx.planId,
      message: 'ai proposal unusable',
      stopReason: response.stop_reason ?? null,
      usage: response.usage ?? null,
    });
  }
  const invalid: [string, unknown][] = [
    [
      'falta explanation',
      {
        mealGrams: VALID_OUTPUT.mealGrams,
        recommendations: VALID_OUTPUT.recommendations,
        reviewInDays: 30,
      },
    ],
    ['clave extra en objeto', { ...VALID_OUTPUT, mealTimes: [] }],
    ['mealGrams vacio', { ...VALID_OUTPUT, mealGrams: [] }],
    [
      'siete franjas',
      {
        ...VALID_OUTPUT,
        mealGrams: Array.from({ length: 7 }, () => ({
          mealTime: '08:00',
          grams: 100,
        })),
      },
    ],
    [
      'hora 7:30',
      {
        ...VALID_OUTPUT,
        mealGrams: [
          { mealTime: '7:30', grams: 100 },
          ...VALID_OUTPUT.mealGrams.slice(1),
        ],
      },
    ],
    [
      'hora 24:00',
      {
        ...VALID_OUTPUT,
        mealGrams: [
          { mealTime: '24:00', grams: 100 },
          ...VALID_OUTPUT.mealGrams.slice(1),
        ],
      },
    ],
    [
      'grams cero',
      {
        ...VALID_OUTPUT,
        mealGrams: [
          { mealTime: '08:00', grams: 0 },
          ...VALID_OUTPUT.mealGrams.slice(1),
        ],
      },
    ],
    [
      'grams decimal',
      {
        ...VALID_OUTPUT,
        mealGrams: [
          { mealTime: '08:00', grams: 150.5 },
          ...VALID_OUTPUT.mealGrams.slice(1),
        ],
      },
    ],
    [
      'clave extra en franja',
      {
        ...VALID_OUTPUT,
        mealGrams: [
          { ...VALID_OUTPUT.mealGrams[0], kcal: 10 },
          ...VALID_OUTPUT.mealGrams.slice(1),
        ],
      },
    ],
    ['recommendations vacio', { ...VALID_OUTPUT, recommendations: [] }],
    [
      'cuatro recomendaciones',
      { ...VALID_OUTPUT, recommendations: ['a', 'b', 'c', 'd'] },
    ],
    [
      'recomendacion de 201 caracteres',
      { ...VALID_OUTPUT, recommendations: ['x'.repeat(201)] },
    ],
    [
      'recomendacion vacia tras trim',
      { ...VALID_OUTPUT, recommendations: ['   '] },
    ],
    ['reviewInDays 6', { ...VALID_OUTPUT, reviewInDays: 6 }],
    ['reviewInDays 91', { ...VALID_OUTPUT, reviewInDays: 91 }],
    ['reviewInDays decimal', { ...VALID_OUTPUT, reviewInDays: 30.5 }],
    ['explanation vacia tras trim', { ...VALID_OUTPUT, explanation: '  ' }],
    [
      'explanation de 1501 caracteres',
      { ...VALID_OUTPUT, explanation: 'x'.repeat(1501) },
    ],
  ];
  it.each(invalid)('R7: descarta %s', async (_label, output) => {
    await expectDiscard(responseFor(output));
  });
  it('R7: devuelve la salida valida con strings recortados', async () => {
    const response = responseFor({
      ...VALID_OUTPUT,
      recommendations: ['  Pésala cada dos semanas.  '],
      explanation: '  Tu perro necesita...  ',
    });
    await expect(
      adapterFor(response).explain(input, result, [], ctx),
    ).resolves.toStrictEqual(VALID_OUTPUT);
    expect(warn).not.toHaveBeenCalled();
  });
  it('R7: acepta los bordes de la tabla', async () => {
    for (const reviewInDays of [7, 90]) {
      const output = {
        ...VALID_OUTPUT,
        mealGrams: ['00:00', '04:00', '08:00', '12:00', '16:00', '23:59'].map(
          (mealTime) => ({ mealTime, grams: 1 }),
        ),
        recommendations: ['x'.repeat(200), 'y'.repeat(200), 'z'.repeat(200)],
        reviewInDays,
        explanation: 'x'.repeat(1500),
      };
      await expect(
        adapterFor(responseFor(output)).explain(input, result, [], ctx),
      ).resolves.toStrictEqual(output);
    }
    expect(warn).not.toHaveBeenCalled();
  });
  it('R7: descarta stop_reason refusal', async () => {
    await expectDiscard({
      ...responseFor(VALID_OUTPUT),
      stop_reason: 'refusal',
    });
  });
  it('R7: descarta stop_reason max_tokens', async () => {
    await expectDiscard({
      ...responseFor(VALID_OUTPUT),
      stop_reason: 'max_tokens',
    });
  });
  it('R7: descarta sin stop_reason con stopReason null en el warn', async () => {
    await expectDiscard({
      content: [{ type: 'text', text: JSON.stringify(VALID_OUTPUT) }],
    });
  });
  it('R7: descarta texto vacio', async () => {
    await expectDiscard({
      stop_reason: 'end_turn',
      content: [{ type: 'text', text: '   ' }],
      usage,
    });
  });
  it('R7: descarta texto que no es JSON', async () => {
    await expectDiscard({
      stop_reason: 'end_turn',
      content: [{ type: 'text', text: 'esto no es JSON' }],
      usage,
    });
  });
  it('R7: descarta content que no es un array', async () => {
    await expectDiscard({
      stop_reason: 'end_turn',
      content: { type: 'text', text: JSON.stringify(VALID_OUTPUT) },
      usage,
    });
  });
  it('R7: ignora bloques que no son text', async () => {
    const json = JSON.stringify(VALID_OUTPUT);
    const response = {
      stop_reason: 'end_turn',
      usage,
      content: [
        { type: 'thinking', text: 'contenido oculto' },
        { type: 'text', text: json.slice(0, 30) },
        { type: 'future', text: 'ignorar' },
        { type: 'text', text: json.slice(30) },
      ],
    };
    await expect(
      adapterFor(response).explain(input, result, [], ctx),
    ).resolves.toStrictEqual(VALID_OUTPUT);
    expect(warn).not.toHaveBeenCalled();
  });
});

describe('R11 (nutrition-ai-explainer #18): cualquier fallo degrada con un warn', () => {
  let warn: jest.SpyInstance<
    ReturnType<Logger['warn']>,
    Parameters<Logger['warn']>
  >;
  beforeEach(() => {
    warn = jest
      .spyOn(Logger.prototype, 'warn')
      .mockImplementation(() => undefined);
  });
  afterEach(() => jest.restoreAllMocks());
  it.each<[number | string | undefined, string]>([
    [401, 'invalid x-api-key'],
    [429, 'rate_limit_error'],
    [529, 'overloaded_error'],
    [500, 'api_error'],
    [undefined, 'Connection error.'],
    [undefined, 'Request timed out.'],
    ['string', 'boom'],
    ['objeto', '[object Object]'],
  ])('degrada %s: %s', async (status, message) => {
    const error =
      status === 'string'
        ? 'boom'
        : status === 'objeto'
          ? { message: 'no soy Error' }
          : Object.assign(new Error(message), { status });
    const create = jest
      .fn<Promise<AnthropicMessageResponse>, [AnthropicMessageParams]>()
      .mockRejectedValue(error);
    const adapter = new AnthropicNutritionExplainer(
      'modelo-de-prueba',
      'clave-de-prueba',
      { create },
    );
    await expect(adapter.explain(input, result, [], ctx)).resolves.toBeNull();
    expect(create).toHaveBeenCalledTimes(1);
    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn.mock.calls[0][0]).toEqual({
      scope: 'nutrition-ai',
      petId: ctx.petId,
      planId: ctx.planId,
      message,
    });
    expect(JSON.stringify(warn.mock.calls)).not.toContain('clave-de-prueba');
    expect(JSON.stringify(warn.mock.calls)).not.toContain('pollo');
  });
});

describe('R11 (nutrition-ai-explainer #18) E1.3: la carga perezosa del SDK tambien degrada a null', () => {
  let warn: jest.SpyInstance<
    ReturnType<Logger['warn']>,
    Parameters<Logger['warn']>
  >;
  beforeEach(() => {
    warn = jest
      .spyOn(Logger.prototype, 'warn')
      .mockImplementation(() => undefined);
  });
  afterEach(() => jest.restoreAllMocks());
  it('fallo del import del SDK: null y un warn sin relanzar', async () => {
    const loadSdk: AnthropicSdkLoader = jest
      .fn<ReturnType<AnthropicSdkLoader>, []>()
      .mockRejectedValue(new Error('sdk ausente'));
    const adapter = new AnthropicNutritionExplainer(
      'modelo-de-prueba',
      'clave-de-prueba',
      null,
      loadSdk,
    );
    await expect(adapter.explain(input, result, [], ctx)).resolves.toBeNull();
    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn.mock.calls[0][0]).toEqual({
      scope: 'nutrition-ai',
      petId: ctx.petId,
      planId: ctx.planId,
      message: 'sdk ausente',
    });
  });
  it('el constructor del SDK lanza: null y un warn sin relanzar', async () => {
    const options: AnthropicClientOptions[] = [];
    class FailingSdk {
      readonly messages = {
        create: jest.fn<
          Promise<AnthropicMessageResponse>,
          [AnthropicMessageParams]
        >(),
      };
      constructor(value: AnthropicClientOptions) {
        options.push(value);
        throw new Error('opciones invalidas');
      }
    }
    const loadSdk: AnthropicSdkLoader = jest
      .fn<ReturnType<AnthropicSdkLoader>, []>()
      .mockResolvedValue({ default: FailingSdk });
    const adapter = new AnthropicNutritionExplainer(
      'modelo-de-prueba',
      'clave-de-prueba',
      null,
      loadSdk,
    );
    await expect(adapter.explain(input, result, [], ctx)).resolves.toBeNull();
    expect(options).toHaveLength(1);
    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn.mock.calls[0][0]).toEqual({
      scope: 'nutrition-ai',
      petId: ctx.petId,
      planId: ctx.planId,
      message: 'opciones invalidas',
    });
    expect(JSON.stringify(warn.mock.calls)).not.toContain('clave-de-prueba');
  });
  it('anti-vacio: el SDK cargado construye el cliente con clave y constantes', async () => {
    const options: AnthropicClientOptions[] = [];
    const create = jest
      .fn<Promise<AnthropicMessageResponse>, [AnthropicMessageParams]>()
      .mockResolvedValue({
        stop_reason: 'end_turn',
        content: [{ type: 'text', text: JSON.stringify(VALID_OUTPUT) }],
      });
    class WorkingSdk {
      readonly messages = { create };
      constructor(value: AnthropicClientOptions) {
        options.push(value);
      }
    }
    const loadSdk: AnthropicSdkLoader = jest
      .fn<ReturnType<AnthropicSdkLoader>, []>()
      .mockResolvedValue({ default: WorkingSdk });
    const adapter = new AnthropicNutritionExplainer(
      'modelo-de-prueba',
      'clave-de-prueba',
      null,
      loadSdk,
    );
    await expect(adapter.explain(input, result, [], ctx)).resolves.toEqual(
      VALID_OUTPUT,
    );
    expect(options).toEqual([
      { apiKey: 'clave-de-prueba', timeout: 15000, maxRetries: 0 },
    ]);
    expect(create).toHaveBeenCalledTimes(1);
    expect(warn).not.toHaveBeenCalled();
  });
});
