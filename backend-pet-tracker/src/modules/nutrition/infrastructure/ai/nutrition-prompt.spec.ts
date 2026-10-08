import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { NUTRITION_AI_SYSTEM_PROMPT } from './nutrition-prompt';

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
