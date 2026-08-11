import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { uuidv7 } from 'uuidv7';
import { DRIZZLE } from '@/db/drizzle.constants';
import { weights } from '@/db/schema/health.schema';
import { PetWeight } from '@/modules/health/domain/entities/weight.entity';
import type {
  NewPetWeight,
  WeightRepository,
} from '@/modules/health/domain/repositories/weight.repository';

type WeightRow = typeof weights.$inferSelect;

@Injectable()
export class WeightDrizzleRepository implements WeightRepository {
  constructor(@Inject(DRIZZLE) private readonly db: NodePgDatabase) {}

  async create(data: NewPetWeight): Promise<PetWeight> {
    const [row] = await this.db
      .insert(weights)
      .values({
        ...data,
        id: uuidv7(),
        weightKg: String(data.weightKg),
      })
      .returning();

    return toDomain(row);
  }
}

function toDomain(row: WeightRow): PetWeight {
  return new PetWeight({
    id: row.id,
    petId: row.petId,
    weightKg: Number(row.weightKg),
    measuredAt: row.measuredAt,
    bodyCondition: row.bodyCondition,
  });
}
