import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { nutritionPlans } from '@/db/schema/nutrition.schema';
import { NutritionPlan } from '@/modules/nutrition/domain/entities/nutrition-plan.entity';
import { NutritionDrizzleRepository } from './nutrition.drizzle.repository';
describe('R13 (nutrition-ai-explainer #18): UPDATE exclusivo por id y returning mapeado', () => {
  it('actualiza una sola columna en el plan indicado sin insertar ni releer', async () => {
    const row: typeof nutritionPlans.$inferSelect = {
      id: 'plan',
      petId: 'pet',
      rerKcal: 662,
      merKcal: 1059,
      dailyGrams: 305,
      mealsPerDay: 2,
      mealTimes: ['07:30', '19:30'],
      engineMealsPerDay: 2,
      objective: 'maintenance',
      warnings: [],
      aiExplanation: 'texto',
      inputsHash: 'h'.repeat(64),
      generatedAt: new Date('2026-10-08T00:00:00Z'),
    };
    const returning = jest.fn().mockResolvedValue([row]);
    const where = jest
      .fn<{ returning: typeof returning }, [ReturnType<typeof eq>]>()
      .mockReturnValue({ returning });
    const set = jest
      .fn<{ where: typeof where }, [{ aiExplanation: string }]>()
      .mockReturnValue({ where });
    const update = jest.fn().mockReturnValue({ set });
    const insert = jest.fn();
    const select = jest.fn();
    const repository = new NutritionDrizzleRepository({
      update,
      insert,
      select,
    } as unknown as NodePgDatabase);
    const plan = await repository.setAiExplanation('plan', 'texto');
    expect(update).toHaveBeenCalledTimes(1);
    expect(update).toHaveBeenCalledWith(nutritionPlans);
    expect(set).toHaveBeenCalledTimes(1);
    expect(set.mock.calls[0][0]).toEqual({ aiExplanation: 'texto' });
    expect(where).toHaveBeenCalledTimes(1);
    expect(where.mock.calls[0][0]).toEqual(eq(nutritionPlans.id, 'plan'));
    expect(returning).toHaveBeenCalledTimes(1);
    expect(plan).toBeInstanceOf(NutritionPlan);
    expect(plan).toEqual(new NutritionPlan(row));
    expect(insert).not.toHaveBeenCalled();
    expect(select).not.toHaveBeenCalled();
  });
});
