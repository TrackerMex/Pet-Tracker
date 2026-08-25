import { Inject, Injectable } from '@nestjs/common';
import { desc, eq } from 'drizzle-orm';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DRIZZLE } from '@/db/drizzle.constants';
import { petDocuments } from '@/db/schema/media.schema';
import type { PetDocument } from '@/modules/media/domain/entities/pet-document.entity';
import type { PetDocumentRepository } from '@/modules/media/domain/repositories/pet-document.repository';

type PetDocumentRow = typeof petDocuments.$inferSelect;

@Injectable()
export class PetDocumentDrizzleRepository implements PetDocumentRepository {
  constructor(@Inject(DRIZZLE) private readonly db: NodePgDatabase) {}

  async listByPet(petId: string): Promise<PetDocument[]> {
    const rows = await this.db
      .select()
      .from(petDocuments)
      .where(eq(petDocuments.petId, petId))
      .orderBy(desc(petDocuments.date), desc(petDocuments.id));

    return rows.map(toDomain);
  }
}

function toDomain(row: PetDocumentRow): PetDocument {
  return {
    id: row.id,
    petId: row.petId,
    type: row.type,
    name: row.name,
    date: row.date,
    vet: row.vet,
    key: row.key,
    createdBy: row.createdBy,
  };
}
