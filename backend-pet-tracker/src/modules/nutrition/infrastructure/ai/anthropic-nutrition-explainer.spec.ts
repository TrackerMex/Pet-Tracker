import { Logger } from '@nestjs/common';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type {
  NutritionEngineInput,
  NutritionPlanResult,
} from '@/modules/nutrition/domain/nutrition-engine';
import { buildUserPrompt } from './nutrition-prompt';
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

describe('R9 (nutrition-ai-explainer #18): parametros exactos de la llamada', () => {
  it('fija timeout, reintentos y tope de tokens', () => {
    expect(NUTRITION_AI_TIMEOUT_MS).toBe(15000);
    expect(NUTRITION_AI_MAX_RETRIES).toBe(0);
    expect(NUTRITION_AI_MAX_OUTPUT_TOKENS).toBe(1200);
  });
  it('llama una vez con exactamente model, max_tokens, system y messages', async () => {
    const create = jest
      .fn<Promise<AnthropicMessageResponse>, [AnthropicMessageParams]>()
      .mockResolvedValue({
        content: [{ type: 'text', text: 'texto' }],
        stop_reason: 'end_turn',
      });
    const adapter = new AnthropicNutritionExplainer(
      'modelo-de-prueba',
      'clave-de-prueba',
      { create },
    );
    await adapter.explain(input, result, ctx);
    expect(create).toHaveBeenCalledTimes(1);
    const params = create.mock.calls[0][0] as {
      model: string;
      max_tokens: number;
      system: string;
      messages: { role: string; content: string }[];
    };
    expect(Object.keys(params).sort()).toEqual([
      'max_tokens',
      'messages',
      'model',
      'system',
    ]);
    expect(params.model).toBe('modelo-de-prueba');
    expect(params.max_tokens).toBe(1200);
    expect(params.system).toBe(
      'Eres el asistente de nutrición de Pet Tracker. Explica planes de alimentación de mascotas en español sencillo y cálido. Nunca des diagnósticos, nunca contradigas al veterinario, incluye siempre que es orientativo. Máximo 180 palabras.',
    );
    expect(params.messages).toHaveLength(1);
    expect(params.messages[0].role).toBe('user');
    expect(params.messages[0].content).toBe(buildUserPrompt(input, result));
  });
  it('construye el cliente perezoso con clave explicita y constantes', () => {
    const source = readFileSync(
      join(__dirname, 'anthropic-nutrition-explainer.ts'),
      'utf8',
    );
    expect(source).toContain('apiKey: this.apiKey');
    expect(source).toContain('timeout: NUTRITION_AI_TIMEOUT_MS');
    expect(source).toContain('maxRetries: NUTRITION_AI_MAX_RETRIES');
    expect(source).not.toContain('maxRetries: 0');
    expect(source.split("await import('@anthropic-ai/" + "sdk')")).toHaveLength(
      2,
    );
    expect(source).not.toContain("from '@anthropic-ai/" + "sdk'");
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
      await expect(adapter.explain(input, result, ctx)).resolves.toBeNull();
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
    await expect(adapter.explain(input, result, ctx)).resolves.toBe(
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
  ])('degrada %s: %s', async (status, message) => {
    const error =
      status === 'string'
        ? 'boom'
        : Object.assign(new Error(message), { status });
    const create = jest
      .fn<Promise<AnthropicMessageResponse>, [AnthropicMessageParams]>()
      .mockRejectedValue(error);
    const adapter = new AnthropicNutritionExplainer(
      'modelo-de-prueba',
      'clave-de-prueba',
      { create },
    );
    await expect(adapter.explain(input, result, ctx)).resolves.toBeNull();
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
    await expect(adapter.explain(input, result, ctx)).resolves.toBeNull();
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
    await expect(adapter.explain(input, result, ctx)).resolves.toBeNull();
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
    await expect(adapter.explain(input, result, ctx)).resolves.toBe(
      'Tu perro necesita...',
    );
    expect(options).toEqual([
      { apiKey: 'clave-de-prueba', timeout: 15000, maxRetries: 0 },
    ]);
    expect(create).toHaveBeenCalledTimes(1);
    expect(warn).not.toHaveBeenCalled();
  });
});
