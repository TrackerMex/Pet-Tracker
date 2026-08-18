import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DRIZZLE } from '@/db/drizzle.constants';
import { nutritionProfiles } from '@/db/schema/nutrition.schema';
import {
  NutritionActivityLevel,
  NutritionFoodType,
  NutritionProfile,
  NutritionProfileData,
} from '@/modules/nutrition/domain/entities/nutrition-profile.entity';
import type {
  NewNutritionPlan,
  NutritionPlan,
} from '@/modules/nutrition/domain/entities/nutrition-plan.entity';
import type { NutritionRepository } from '@/modules/nutrition/domain/repositories/nutrition.repository';

type NutritionProfileRow = typeof nutritionProfiles.$inferSelect;

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

  findLatestPlan(_petId: string): Promise<NutritionPlan | null> {
    throw new Error('Nutrition plan repository is not implemented');
  }

  insertPlan(_plan: NewNutritionPlan): Promise<NutritionPlan> {
    throw new Error('Nutrition plan repository is not implemented');
  }
}

function toProfile(row: NutritionProfileRow): NutritionProfile {
  return new NutritionProfile({
    petId: row.petId,
    activityLevel: row.activityLevel as NutritionActivityLevel,
    bodyCondition: row.bodyCondition ?? null,
    targetWeightKg:
      row.targetWeightKg === null ? null : Number(row.targetWeightKg),
    foodType: row.foodType as NutritionFoodType,
    kcalPer100g: Number(row.kcalPer100g),
    allergies: row.allergies,
    diseases: row.diseases,
    updatedAt: row.updatedAt,
  });
}
