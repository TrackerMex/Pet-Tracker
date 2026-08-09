import { Inject, Injectable } from '@nestjs/common';
import { and, asc, eq, gt } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DRIZZLE } from '@/db/drizzle.constants';
import { petVaccines } from '@/db/schema/health.schema';
import type {
  NextPetVaccine,
  PetVaccineReader,
} from '@/modules/pets/domain/ports/pet-vaccine-reader';

@Injectable()
export class PetVaccineDrizzleReader implements PetVaccineReader {
  constructor(@Inject(DRIZZLE) private readonly db: NodePgDatabase) {}

  async findNextVaccine(
    petId: string,
    after: string,
  ): Promise<NextPetVaccine | null> {
    const [row] = await this.db
      .select({
        id: petVaccines.id,
        name: petVaccines.name,
        nextDoseAt: petVaccines.nextDoseAt,
      })
      .from(petVaccines)
      .where(
        and(eq(petVaccines.petId, petId), gt(petVaccines.nextDoseAt, after)),
      )
      .orderBy(asc(petVaccines.nextDoseAt))
      .limit(1);

    return row?.nextDoseAt ? { ...row, nextDoseAt: row.nextDoseAt } : null;
  }
}
