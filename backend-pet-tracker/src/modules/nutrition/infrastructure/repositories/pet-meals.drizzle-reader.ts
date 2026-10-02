import { Inject, Injectable } from '@nestjs/common';
import { and, desc, eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DRIZZLE } from '@/db/drizzle.constants';
import { mealServings, nutritionPlans } from '@/db/schema/nutrition.schema';
import { servedInPlan } from '@/modules/nutrition/domain/entities/meal-serving.entity';
import type {
  PetMealsReader,
  PetMealsToday,
} from '@/modules/pets/domain/ports/pet-meals-reader';

@Injectable()
export class PetMealsDrizzleReader implements PetMealsReader {
  constructor(@Inject(DRIZZLE) private readonly db: NodePgDatabase) {}

  async findMealsToday(
    petId: string,
    day: string,
  ): Promise<PetMealsToday | null> {
    const [plan] = await this.db
      .select({
        mealsPerDay: nutritionPlans.mealsPerDay,
        mealTimes: nutritionPlans.mealTimes,
      })
      .from(nutritionPlans)
      .where(eq(nutritionPlans.petId, petId))
      .orderBy(desc(nutritionPlans.generatedAt), desc(nutritionPlans.id))
      .limit(1);
    if (!plan) return null;

    const rows = await this.db
      .select({ mealTime: mealServings.mealTime })
      .from(mealServings)
      .where(
        and(eq(mealServings.petId, petId), eq(mealServings.servedOn, day)),
      );
    return {
      served: servedInPlan(
        plan.mealTimes,
        rows.map((row) => row.mealTime),
      ).length,
      total: plan.mealsPerDay,
    };
  }
}
