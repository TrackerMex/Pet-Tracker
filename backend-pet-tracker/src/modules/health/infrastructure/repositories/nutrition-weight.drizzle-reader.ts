import { Inject, Injectable } from '@nestjs/common';
import { desc, eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DRIZZLE } from '@/db/drizzle.constants';
import { weights } from '@/db/schema/health.schema';
import type {
  NutritionWeightPoint,
  NutritionWeightReader,
} from '@/modules/nutrition/domain/ports/nutrition-weight-reader';

@Injectable()
export class NutritionWeightDrizzleReader implements NutritionWeightReader {
  constructor(@Inject(DRIZZLE) private readonly db: NodePgDatabase) {}

  async listRecent(
    petId: string,
    limit: number,
  ): Promise<NutritionWeightPoint[]> {
    const rows = await this.db
      .select({ measuredAt: weights.measuredAt, weightKg: weights.weightKg })
      .from(weights)
      .where(eq(weights.petId, petId))
      .orderBy(desc(weights.measuredAt), desc(weights.id))
      .limit(limit);
    return rows.reverse().map((row) => ({
      measuredAt: row.measuredAt,
      weightKg: Number(row.weightKg),
    }));
  }
}
