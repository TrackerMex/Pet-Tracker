import { Logger } from '@nestjs/common';
import type {
  NutritionEngineInput,
  NutritionPlanResult,
} from '@/modules/nutrition/domain/nutrition.types';
import { NullNutritionExplainer } from './null-nutrition-explainer';

describe('R11 (nutrition-ai-explainer #18): la rama apagada devuelve null y avisa', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('returns null and logs the plan context without clinical data', async () => {
    const warn = jest.spyOn(Logger.prototype, 'warn').mockImplementation();
    const input = {
      allergies: ['SECRET_ALLERGY'],
      diseases: ['SECRET_DISEASE'],
    } as NutritionEngineInput;
    const ctx = { petId: 'pet-1', planId: 'plan-1' };

    await expect(
      new NullNutritionExplainer().explain(
        input,
        {} as NutritionPlanResult,
        ctx,
      ),
    ).resolves.toBeNull();
    expect(warn).toHaveBeenCalledWith(
      expect.objectContaining({
        scope: 'nutrition-ai',
        petId: ctx.petId,
        planId: ctx.planId,
      }),
    );
    const logged = JSON.stringify(warn.mock.calls);
    expect(logged).not.toContain('SECRET_ALLERGY');
    expect(logged).not.toContain('SECRET_DISEASE');
  });
});
