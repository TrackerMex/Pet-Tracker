import { Inject, Injectable } from '@nestjs/common';
import { and, asc, desc, eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { uuidv7 } from 'uuidv7';
import { DRIZZLE } from '@/db/drizzle.constants';
import { petVaccines, vaccineCatalog } from '@/db/schema/health.schema';
import {
  PetVaccine,
  VaccineCatalogEntry,
  VaccineSpecies,
} from '@/modules/health/domain/entities/vaccine.entity';
import {
  NewPetVaccine,
  VaccineChanges,
  VaccineRepository,
} from '@/modules/health/domain/repositories/vaccine.repository';

type VaccineRow = typeof petVaccines.$inferSelect;

@Injectable()
export class VaccineDrizzleRepository implements VaccineRepository {
  constructor(@Inject(DRIZZLE) private readonly db: NodePgDatabase) {}

  async listCatalog(species: VaccineSpecies): Promise<VaccineCatalogEntry[]> {
    const rows = await this.db
      .select()
      .from(vaccineCatalog)
      .where(eq(vaccineCatalog.species, species))
      .orderBy(asc(vaccineCatalog.name));
    return rows as VaccineCatalogEntry[];
  }

  async findCatalogById(id: string): Promise<VaccineCatalogEntry | null> {
    const [row] = await this.db
      .select()
      .from(vaccineCatalog)
      .where(eq(vaccineCatalog.id, id))
      .limit(1);
    return (row as VaccineCatalogEntry | undefined) ?? null;
  }

  async create(data: NewPetVaccine): Promise<PetVaccine> {
    const [row] = await this.db
      .insert(petVaccines)
      .values({ id: uuidv7(), ...data })
      .returning();
    return toDomain(row);
  }

  async listByPet(petId: string): Promise<PetVaccine[]> {
    const rows = await this.db
      .select()
      .from(petVaccines)
      .where(eq(petVaccines.petId, petId))
      .orderBy(desc(petVaccines.appliedAt), desc(petVaccines.id));
    return rows.map(toDomain);
  }

  async findByIdAndPet(id: string, petId: string): Promise<PetVaccine | null> {
    const [row] = await this.db
      .select()
      .from(petVaccines)
      .where(and(eq(petVaccines.id, id), eq(petVaccines.petId, petId)))
      .limit(1);
    return row ? toDomain(row) : null;
  }

  async update(id: string, changes: VaccineChanges): Promise<PetVaccine> {
    const [row] = await this.db
      .update(petVaccines)
      .set(changes)
      .where(eq(petVaccines.id, id))
      .returning();
    return toDomain(row);
  }

  async delete(id: string): Promise<void> {
    await this.db.delete(petVaccines).where(eq(petVaccines.id, id));
  }
}

function toDomain(row: VaccineRow): PetVaccine {
  return new PetVaccine({
    id: row.id,
    petId: row.petId,
    catalogId: row.catalogId,
    name: row.name,
    appliedAt: row.appliedAt,
    nextDoseAt: row.nextDoseAt,
    vetName: row.vetName,
    clinic: row.clinic,
    notes: row.notes,
    documentKey: row.documentKey,
  });
}
