import { config as loadDotenv } from 'dotenv';
import { and, eq, isNotNull, isNull } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { uuidv7 } from 'uuidv7';
import { weights } from '@/db/schema/health.schema';
import { pets, petUsers } from '@/db/schema/pets.schema';

/** Copia a weights las proyecciones historicas que no tienen mediciones. */
export async function backfillWeights(db: NodePgDatabase): Promise<number> {
  const candidates = await db
    .select({
      petId: pets.id,
      weightKg: pets.currentWeightKg,
      createdAt: pets.createdAt,
      ownerId: petUsers.userId,
    })
    .from(pets)
    .innerJoin(
      petUsers,
      and(
        eq(petUsers.petId, pets.id),
        eq(petUsers.role, 'owner'),
        eq(petUsers.status, 'active'),
      ),
    )
    .leftJoin(weights, eq(weights.petId, pets.id))
    .where(and(isNotNull(pets.currentWeightKg), isNull(weights.id)));

  if (!candidates.length) {
    return 0;
  }

  // ponytail: SELECT+INSERT assumes one manual run without concurrent writes.
  await db.insert(weights).values(
    candidates.map((row) => ({
      id: uuidv7(),
      petId: row.petId,
      weightKg: row.weightKg as string,
      bodyCondition: null,
      measuredAt: row.createdAt.toISOString().slice(0, 10),
      createdBy: row.ownerId,
    })),
  );

  return candidates.length;
}

async function main(): Promise<void> {
  loadDotenv({ path: '../.env' });
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  try {
    const count = await backfillWeights(drizzle(pool));
    // eslint-disable-next-line no-console
    console.log(`backfill-weights: ${count} filas insertadas`);
  } finally {
    await pool.end();
  }
}

if (require.main === module) {
  main().catch((error: unknown) => {
    // eslint-disable-next-line no-console
    console.error('backfill-weights failed:', error);
    process.exitCode = 1;
  });
}
