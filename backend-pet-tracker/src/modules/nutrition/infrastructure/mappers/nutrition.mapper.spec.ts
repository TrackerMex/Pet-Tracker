import { readFileSync } from 'node:fs';
import { join } from 'node:path';

describe('R17 (nutrition-ai-explainer #18): el mapper devuelve la explicacion persistida', () => {
  it('maps aiExplanation from the plan instead of hardcoding null', () => {
    const source = readFileSync(join(__dirname, 'nutrition.mapper.ts'), 'utf8');

    expect(source).toContain('aiExplanation: plan.aiExplanation');
    expect(source).not.toContain('aiExplanation: null');
  });
});
