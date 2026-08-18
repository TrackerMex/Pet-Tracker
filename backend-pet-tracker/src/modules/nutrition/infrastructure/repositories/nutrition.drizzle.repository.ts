import { Inject, Injectable } from '@nestjs/common';
import { desc, eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { uuidv7 } from 'uuidv7';
import { DRIZZLE } from '@/db/drizzle.constants';
import {
  nutritionPlans,
  nutritionProfiles,
} from '@/db/schema/nutrition.schema';
import {
  NutritionProfile,
  NutritionProfileData,
} from '@/modules/nutrition/domain/entities/nutrition-profile.entity';
import type { NewNutritionPlan } from '@/modules/nutrition/domain/entities/nutrition-plan.entity';
import { NutritionPlan } from '@/modules/nutrition/domain/entities/nutrition-plan.entity';
import type { NutritionRepository } from '@/modules/nutrition/domain/repositories/nutrition.repository';

type NutritionProfileRow = typeof nutritionProfiles.$inferSelect;
type NutritionPlanRow = typeof nutritionPlans.$inferSelect;

@Injectable()
export class NutritionDrizzleRepository implements NutritionRepository {
  constructor(@Inject(DRIZZLE) private readonly db: NodePgDatabase) {}

  async findProfile(petId: string): Promise<NutritionProfile | null> {
    const [row] = await this.db
      .select()
      .from(nutritionProfiles)
      .where(eq(nutritionProfiles.petId, petId))
      .limit(1);
    return row ? toProfile(row) : null;
  }

  async upsertProfile(
    petId: string,
    data: NutritionProfileData,
  ): Promise<NutritionProfile> {
    const updatedAt = new Date();
    const values = {
      petId,
      activityLevel: data.activityLevel,
      bodyCondition: data.bodyCondition,
      targetWeightKg:
        data.targetWeightKg === null ? null : String(data.targetWeightKg),
      foodType: data.foodType,
      kcalPer100g: String(data.kcalPer100g),
      allergies: data.allergies,
      diseases: data.diseases,
      updatedAt,
    };
    const [row] = await this.db
      .insert(nutritionProfiles)
      .values(values)
      .onConflictDoUpdate({
        target: nutritionProfiles.petId,
        set: {
          activityLevel: values.activityLevel,
          bodyCondition: values.bodyCondition,
          targetWeightKg: values.targetWeightKg,
          foodType: values.foodType,
          kcalPer100g: values.kcalPer100g,
          allergies: values.allergies,
          diseases: values.diseases,
          updatedAt,
        },
      })
      .returning();
    return toProfile(row);
  }

  async findLatestPlan(petId: string): Promise<NutritionPlan | null> {
    const [row] = await this.db
      .select()
      .from(nutritionPlans)
      .where(eq(nutritionPlans.petId, petId))
      .orderBy(desc(nutritionPlans.generatedAt), desc(nutritionPlans.id))
      .limit(1);
    return row ? toPlan(row) : null;
  }

  async insertPlan(plan: NewNutritionPlan): Promise<NutritionPlan> {
    const [row] = await this.db
      .insert(nutritionPlans)
      .values({ id: uuidv7(), ...plan })
      .returning();
    return toPlan(row);
  }
}

function toPlan(row: NutritionPlanRow): NutritionPlan {
  return new NutritionPlan({
    id: row.id,
    petId: row.petId,
    rerKcal: row.rerKcal,
    merKcal: row.merKcal,
    dailyGrams: row.dailyGrams,
    mealsPerDay: row.mealsPerDay,
    mealTimes: row.mealTimes,
    objective: row.objective,
    warnings: row.warnings,
    aiExplanation: row.aiExplanation ?? null,
    inputsHash: row.inputsHash,
    generatedAt: row.generatedAt,
  });
}

function toProfile(row: NutritionProfileRow): NutritionProfile {
  return new NutritionProfile({
    petId: row.petId,
    activityLevel: row.activityLevel,
    bodyCondition: row.bodyCondition ?? null,
    targetWeightKg:
      row.targetWeightKg === null ? null : Number(row.targetWeightKg),
    foodType: row.foodType,
    kcalPer100g: Number(row.kcalPer100g),
    allergies: row.allergies,
    diseases: row.diseases,
    updatedAt: row.updatedAt,
  });
}
