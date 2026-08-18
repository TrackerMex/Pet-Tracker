import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type {
  NutritionEngineInput,
  NutritionPlanResult,
} from '@/modules/nutrition/domain/nutrition-engine';
import {
  buildUserPrompt,
  NUTRITION_AI_SYSTEM_PROMPT,
} from './nutrition-prompt';

const input = {
  species: 'dog',
  weightKg: 20,
  targetWeightKg: null,
  ageMonths: 60,
  sterilized: true,
  activityLevel: 'medium',
  bodyCondition: 5,
  kcalPer100g: 350,
  allergies: ['pollo'],
  diseases: [],
  foodType: 'dry',
  petName: 'Firulais',
  petId: '018f5a3e-0000-7000-8000-000000000001',
} as NutritionEngineInput;

const result: NutritionPlanResult = {
  rerKcal: 662,
  merKcal: 1059,
  dailyGrams: 305,
  mealsPerDay: 2,
  mealTimes: ['07:30', '19:30'],
  objective: 'maintenance',
  warnings: [],
};

describe('R6 (nutrition-ai-explainer #18): system prompt literal y fechado', () => {
  it('conserva exactamente el texto aprobado y su fecha', () => {
    expect(NUTRITION_AI_SYSTEM_PROMPT).toBe(
      'Eres el asistente de nutrición de Pet Tracker. Explica planes de alimentación de mascotas en español sencillo y cálido. Nunca des diagnósticos, nunca contradigas al veterinario, incluye siempre que es orientativo. Máximo 180 palabras.',
    );
    expect(
      readFileSync(join(__dirname, 'nutrition-prompt.ts'), 'utf8'),
    ).toContain('2026-08-18');
  });
});

describe('R7 (nutrition-ai-explainer #18): el user prompt solo lleva input y resultado', () => {
  it('serializa exclusivamente las claves aprobadas y no filtra identificadores', () => {
    const prompt = buildUserPrompt(input, result);
    const parsed = JSON.parse(prompt) as {
      input: Record<string, unknown>;
      result: Record<string, unknown>;
    };

    expect(Object.keys(parsed).sort()).toEqual(['input', 'result']);
    expect(Object.keys(parsed.input).sort()).toEqual(
      [
        'species',
        'weightKg',
        'targetWeightKg',
        'ageMonths',
        'sterilized',
        'activityLevel',
        'bodyCondition',
        'kcalPer100g',
        'allergies',
        'diseases',
      ].sort(),
    );
    expect(Object.keys(parsed.result).sort()).toEqual(
      [
        'rerKcal',
        'merKcal',
        'dailyGrams',
        'mealsPerDay',
        'mealTimes',
        'objective',
        'warnings',
      ].sort(),
    );
    expect(prompt).not.toContain('foodType');
    expect(prompt).not.toContain('Firulais');
    expect(prompt).not.toMatch(/[0-9a-f]{8}-[0-9a-f-]{27}/i);
  });
});
