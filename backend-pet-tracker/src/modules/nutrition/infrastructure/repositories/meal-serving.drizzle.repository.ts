import { Inject, Injectable } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { uuidv7 } from 'uuidv7';
import { DRIZZLE } from '@/db/drizzle.constants';
import { mealServings } from '@/db/schema/nutrition.schema';
import { MealServing } from '@/modules/nutrition/domain/entities/meal-serving.entity';
import { MealAlreadyServedError } from '@/modules/nutrition/domain/errors/nutrition.errors';
import type {
  MealServingRepository,
  NewMealServing,
} from '@/modules/nutrition/domain/repositories/meal-serving.repository';

type MealServingRow = typeof mealServings.$inferSelect;

@Injectable()
export class MealServingDrizzleRepository implements MealServingRepository {
  constructor(@Inject(DRIZZLE) private readonly db: NodePgDatabase) {}

  async create(data: NewMealServing): Promise<MealServing> {
    const [row] = await this.db
      .insert(mealServings)
      .values({ id: uuidv7(), ...data })
      .onConflictDoNothing({
        target: [
          mealServings.petId,
          mealServings.servedOn,
          mealServings.mealTime,
        ],
      })
      .returning();

    if (!row) {
      throw new MealAlreadyServedError(
        data.petId,
        data.servedOn,
        data.mealTime,
      );
    }
    return toDomain(row);
  }

  async deleteOne(
    petId: string,
    servedOn: string,
    mealTime: string,
  ): Promise<MealServing | null> {
    const [row] = await this.db
      .delete(mealServings)
      .where(
        and(
          eq(mealServings.petId, petId),
          eq(mealServings.servedOn, servedOn),
          eq(mealServings.mealTime, mealTime),
        ),
      )
      .returning();

    return row ? toDomain(row) : null;
  }

  async listTimesServedOn(petId: string, servedOn: string): Promise<string[]> {
    const rows = await this.db
      .select({ mealTime: mealServings.mealTime })
      .from(mealServings)
      .where(
        and(eq(mealServings.petId, petId), eq(mealServings.servedOn, servedOn)),
      );
    return rows.map((row) => row.mealTime);
  }
}

function toDomain(row: MealServingRow): MealServing {
  return new MealServing({
    id: row.id,
    petId: row.petId,
    servedOn: row.servedOn,
    mealTime: row.mealTime,
    servedAt: row.servedAt,
    createdBy: row.createdBy,
  });
}
