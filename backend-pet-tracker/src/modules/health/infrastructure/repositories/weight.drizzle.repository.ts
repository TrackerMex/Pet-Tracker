import { Inject, Injectable } from '@nestjs/common';
import { and, eq, gt, notExists } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { uuidv7 } from 'uuidv7';
import { DRIZZLE } from '@/db/drizzle.constants';
import { weights } from '@/db/schema/health.schema';
import { pets } from '@/db/schema/pets.schema';
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
    return this.db.transaction(async (tx) => {
      const [row] = await tx
        .insert(weights)
        .values({
          ...data,
          id: uuidv7(),
          weightKg: String(data.weightKg),
        })
        .returning();

      await tx
        .update(pets)
        .set({
          currentWeightKg: String(data.weightKg),
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(pets.id, data.petId),
            notExists(
              tx
                .select({ id: weights.id })
                .from(weights)
                .where(
                  and(
                    eq(weights.petId, data.petId),
                    gt(weights.measuredAt, data.measuredAt),
                  ),
                ),
            ),
          ),
        );

      return toDomain(row);
    });
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
