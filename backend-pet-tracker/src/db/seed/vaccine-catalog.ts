import { and, eq, not, or, sql } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { uuidv7 } from 'uuidv7';
import { vaccineCatalog } from '@/db/schema/health.schema';
import type { VaccineScheme } from '@/modules/health/domain/entities/vaccine.entity';

export type VaccineSpecies = 'dog' | 'cat';

export interface VaccineCatalogSeedEntry {
  species: VaccineSpecies;
  name: string;
  scheme: VaccineScheme;
}

export const VACCINE_CATALOG_SEED: VaccineCatalogSeedEntry[] = [
  {
    species: 'dog',
    name: 'Rabia',
    scheme: { firstDoseMonths: 3, boosterMonths: 12 },
  },
  {
    species: 'dog',
    name: 'Polivalente (DHPPi)',
    scheme: { firstDoseMonths: 2, series: [2, 3, 4], boosterMonths: 12 },
  },
  {
    species: 'dog',
    name: 'Leptospirosis',
    scheme: { firstDoseMonths: 3, boosterMonths: 12 },
  },
  {
    species: 'dog',
    name: 'Tos de las perreras',
    scheme: { firstDoseMonths: 3, boosterMonths: 12 },
  },
  {
    species: 'cat',
    name: 'Triple felina (FVRCP)',
    scheme: { firstDoseMonths: 2, series: [2, 3], boosterMonths: 12 },
  },
  {
    species: 'cat',
    name: 'Leucemia felina (FeLV)',
    scheme: { firstDoseMonths: 2, boosterMonths: 12 },
  },
  {
    species: 'cat',
    name: 'Rabia',
    scheme: { firstDoseMonths: 3, boosterMonths: 12 },
  },
];

export async function seedVaccineCatalog(db: NodePgDatabase): Promise<void> {
  await db.transaction(async (tx) => {
    const canonicalEntry = or(
      ...VACCINE_CATALOG_SEED.map((entry) =>
        and(
          eq(vaccineCatalog.species, entry.species),
          eq(vaccineCatalog.name, entry.name),
        ),
      ),
    );

    await tx.delete(vaccineCatalog).where(not(canonicalEntry!));
    await tx
      .insert(vaccineCatalog)
      .values(VACCINE_CATALOG_SEED.map((entry) => ({ id: uuidv7(), ...entry })))
      .onConflictDoUpdate({
        target: [vaccineCatalog.species, vaccineCatalog.name],
        set: { scheme: sql`excluded.scheme` },
      });
  });
}
