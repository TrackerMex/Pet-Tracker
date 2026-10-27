import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { nutritionPlans } from '@/db/schema/nutrition.schema';
import { NutritionPlan } from '@/modules/nutrition/domain/entities/nutrition-plan.entity';
import { NutritionDrizzleRepository } from './nutrition.drizzle.repository';
describe('R16 (nutrition-ai-structured-plan #212): resultado persistido', () => {
  it('R16: setAiResult actualiza explicacion y propuesta solo en el plan indicado', async () => {
    const proposal = {
      mealGrams: [
        { mealTime: '07:30', grams: 150 },
        { mealTime: '19:30', grams: 155 },
      ],
      recommendations: ['Pésala cada dos semanas.'],
      reviewDate: '2026-11-25',
    };
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
      aiProposal: proposal,
      inputsHash: 'h'.repeat(64),
      generatedAt: new Date('2026-10-08T00:00:00Z'),
    };
    const returning = jest.fn().mockResolvedValue([row]);
    const where = jest
      .fn<{ returning: typeof returning }, [ReturnType<typeof eq>]>()
      .mockReturnValue({ returning });
    const set = jest
      .fn<
        { where: typeof where },
        [{ aiExplanation: string; aiProposal: typeof proposal }]
      >()
      .mockReturnValue({ where });
    const update = jest.fn().mockReturnValue({ set });
    const insert = jest.fn();
    const select = jest.fn();
    const repository = new NutritionDrizzleRepository({
      update,
      insert,
      select,
    } as unknown as NodePgDatabase);
    const plan = await repository.setAiResult('plan', 'texto', proposal);
    expect(update).toHaveBeenCalledTimes(1);
    expect(update).toHaveBeenCalledWith(nutritionPlans);
    expect(set).toHaveBeenCalledTimes(1);
    expect(set.mock.calls[0][0]).toEqual({
      aiExplanation: 'texto',
      aiProposal: proposal,
    });
    expect(where).toHaveBeenCalledTimes(1);
    expect(where.mock.calls[0][0]).toEqual(eq(nutritionPlans.id, 'plan'));
    expect(returning).toHaveBeenCalledTimes(1);
    expect(plan).toBeInstanceOf(NutritionPlan);
    expect(plan).toEqual(new NutritionPlan(row));
    expect(insert).not.toHaveBeenCalled();
    expect(select).not.toHaveBeenCalled();
  });
});
