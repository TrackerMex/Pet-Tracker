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

describe('R6 (nutrition-ai-explainer #18): system prompt literal y versionado', () => {
  it('envia el texto de producto sin cambios', () => {
    expect(NUTRITION_AI_SYSTEM_PROMPT).toBe(
      'Eres el asistente de nutrición de Pet Tracker. Explica planes de alimentación de mascotas en español sencillo y cálido. Nunca des diagnósticos, nunca contradigas al veterinario, incluye siempre que es orientativo. Máximo 180 palabras.',
    );
  });
  it('versiona la fecha en la fuente', () => {
    expect(
      readFileSync(join(__dirname, 'nutrition-prompt.ts'), 'utf8'),
    ).toContain('2026-08-18');
  });
});

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

describe('R7 (nutrition-ai-explainer #18): solo input y resultado sin identificadores', () => {
  const profile = {
    ...input,
    foodType: 'dry',
    name: 'Firulais',
    petId: '11111111-1111-1111-1111-111111111111',
    planId: '22222222-2222-2222-2222-222222222222',
    email: 'owner@example.com',
  };
  const plan = {
    ...result,
    id: profile.planId,
    petId: profile.petId,
    aiExplanation: 'privado',
  };
  it('serializa exactamente dos objetos con diez y siete claves', () => {
    const prompt = buildUserPrompt(profile, plan);
    const parsed = JSON.parse(prompt) as { input: object; result: object };
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
    expect(parsed).toEqual({ input, result });
  });
  it('no filtra foodType, nombre, email ni UUID del perfil o plan', () => {
    const prompt = buildUserPrompt(profile, plan);
    expect(prompt).not.toContain('foodType');
    expect(prompt).not.toContain('Firulais');
    expect(prompt).not.toContain('owner@example.com');
    expect(prompt).not.toMatch(
      /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i,
    );
  });
  it('tiene dos parametros y no recibe ctx', () => {
    expect(buildUserPrompt.length).toBe(2);
  });
});
