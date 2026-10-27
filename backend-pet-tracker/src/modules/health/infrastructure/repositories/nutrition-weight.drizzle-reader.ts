import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DRIZZLE } from '@/db/drizzle.constants';
import type {
  NutritionWeightPoint,
  NutritionWeightReader,
} from '@/modules/nutrition/domain/ports/nutrition-weight-reader';

@Injectable()
export class NutritionWeightDrizzleReader implements NutritionWeightReader {
  constructor(@Inject(DRIZZLE) private readonly db: NodePgDatabase) {}

  listRecent(petId: string, limit: number): Promise<NutritionWeightPoint[]> {
    void petId;
    void limit;
    return Promise.resolve([]);
  }
}
