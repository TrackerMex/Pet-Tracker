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

describe('R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn', () => {
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
  const unusable: [string, AnthropicMessageResponse][] = [
    ...[
      'max_tokens',
      'refusal',
      'stop_sequence',
      'tool_use',
      'pause_turn',
      null,
      'valor_futuro',
    ].map((stop): [string, AnthropicMessageResponse] => [
      String(stop),
      {
        stop_reason: stop,
        content: [{ type: 'text', text: 'Tu perro necesita...' }],
        usage,
      },
    ]),
    ['vacio', { stop_reason: 'end_turn', content: [], usage }],
    [
      'thinking',
      {
        stop_reason: 'end_turn',
        content: [{ type: 'thinking', thinking: 'razono' }],
        usage,
      },
    ],
    [
      'texto vacio',
      { stop_reason: 'end_turn', content: [{ type: 'text', text: '' }], usage },
    ],
    [
      'espacios',
      {
        stop_reason: 'end_turn',
        content: [{ type: 'text', text: '   ' }],
        usage,
      },
    ],
    ['content null sin usage', { stop_reason: 'end_turn', content: null }],
    [
      'content string',
      { stop_reason: 'end_turn', content: 'Tu perro necesita...', usage },
    ],
    [
      'content objeto',
      {
        stop_reason: 'end_turn',
        content: { type: 'text', text: 'Tu perro necesita...' },
        usage,
      },
    ],
    ['content numero', { stop_reason: 'end_turn', content: 42, usage }],
    [
      'content undefined',
      { stop_reason: 'end_turn', content: undefined, usage },
    ],
    [
      'content array-like',
      {
        stop_reason: 'end_turn',
        content: {
          0: { type: 'text', text: 'Tu perro necesita...' },
          length: 1,
        },
        usage,
      },
    ],
    [
      'solo bloque no-text con text',
      {
        stop_reason: 'end_turn',
        content: [{ type: 'texto-futuro', text: 'no es explicacion' }],
        usage,
      },
    ],
    [
      'sin stop_reason',
      { content: [{ type: 'text', text: 'Tu perro necesita...' }], usage },
    ],
  ];
  it.each(unusable)(
    'degrada %s con exactamente un warn completo',
    async (_label, response) => {
      const create = jest
        .fn<Promise<AnthropicMessageResponse>, [AnthropicMessageParams]>()
        .mockResolvedValue(response);
      const adapter = new AnthropicNutritionExplainer(
        'modelo-de-prueba',
        'clave-de-prueba',
        { create },
      );
      await expect(adapter.explain(input, result, [], ctx)).resolves.toBeNull();
      expect(warn).toHaveBeenCalledTimes(1);
      expect(warn.mock.calls[0][0]).toEqual({
        scope: 'nutrition-ai',
        petId: ctx.petId,
        planId: ctx.planId,
        message: 'ai explanation unusable',
        stopReason: response.stop_reason ?? null,
        usage: response.usage ?? null,
      });
    },
  );
  it.each([
    [
      'thinking y texto',
      [
        { type: 'thinking', thinking: 'razono' },
        { type: 'text', text: 'Tu perro necesita...' },
      ],
    ],
    [
      'dos bloques',
      [
        { type: 'text', text: 'Tu perro ' },
        { type: 'text', text: 'necesita...' },
      ],
    ],
    ['trim', [{ type: 'text', text: '  Tu perro necesita...  ' }]],
    [
      'bloque no-text con text',
      [
        { type: 'thinking', thinking: 'razono', text: 'texto oculto ' },
        { type: 'text', text: 'Tu perro necesita...' },
      ],
    ],
  ])('anti-vacio: %s devuelve texto sin warn', async (_label, content) => {
    const adapter = new AnthropicNutritionExplainer(
      'modelo-de-prueba',
      'clave-de-prueba',
      {
        create: jest
          .fn<Promise<AnthropicMessageResponse>, [AnthropicMessageParams]>()
          .mockResolvedValue({ stop_reason: 'end_turn', content }),
      },
    );
    await expect(adapter.explain(input, result, [], ctx)).resolves.toBe(
      'Tu perro necesita...',
    );
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
        content: [{ type: 'text', text: 'Tu perro necesita...' }],
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
    await expect(adapter.explain(input, result, [], ctx)).resolves.toBe(
      'Tu perro necesita...',
    );
    expect(options).toEqual([
      { apiKey: 'clave-de-prueba', timeout: 15000, maxRetries: 0 },
    ]);
    expect(create).toHaveBeenCalledTimes(1);
    expect(warn).not.toHaveBeenCalled();
  });
});
