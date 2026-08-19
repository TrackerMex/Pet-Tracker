import { eq } from 'drizzle-orm';
import { nutritionPlans } from '@/db/schema/nutrition.schema';
import { NutritionDrizzleRepository } from './nutrition.drizzle.repository';

describe('R13 (nutrition-ai-explainer #18): setAiExplanation actualiza solo esa columna y no inserta fila', () => {
  it('updates the existing plan and returns it without an insert', async () => {
    const generatedAt = new Date('2026-08-18T12:00:00.000Z');
    const row = {
      id: 'plan-1',
      petId: 'pet-1',
      rerKcal: 662,
      merKcal: 1059,
      dailyGrams: 305,
      mealsPerDay: 2,
      mealTimes: ['07:30', '19:30'],
      objective: 'maintenance',
      warnings: [],
      aiExplanation: 'Generated explanation',
      inputsHash: 'hash',
      generatedAt,
    };
    const returning = jest.fn().mockResolvedValue([row]);
    const where = jest.fn(() => ({ returning }));
    const set = jest.fn(() => ({ where }));
    const db = {
      update: jest.fn(() => ({ set })),
      insert: jest.fn(),
    };
    const repository = new NutritionDrizzleRepository(db as never);

    const plan = await repository.setAiExplanation(
      'plan-1',
      'Generated explanation',
    );

    expect(set).toHaveBeenCalledWith({
      aiExplanation: 'Generated explanation',
    });
    expect(where).toHaveBeenCalledWith(eq(nutritionPlans.id, 'plan-1'));
    expect(db.insert).not.toHaveBeenCalled();
    expect(plan.id).toBe('plan-1');
    expect(plan.aiExplanation).toBe('Generated explanation');
    expect(plan.generatedAt).toBe(generatedAt);
  });
});
