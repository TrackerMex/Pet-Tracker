import { Inject, Injectable } from '@nestjs/common';
import { and, desc, eq, isNull, sql } from 'drizzle-orm';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DRIZZLE } from '@/db/drizzle.constants';
import { petDocuments } from '@/db/schema/media.schema';
import type { PetDocument } from '@/modules/media/domain/entities/pet-document.entity';
import type { PetDocumentRepository } from '@/modules/media/domain/repositories/pet-document.repository';

type PetDocumentRow = typeof petDocuments.$inferSelect;

@Injectable()
export class PetDocumentDrizzleRepository implements PetDocumentRepository {
  constructor(@Inject(DRIZZLE) private readonly db: NodePgDatabase) {}

  async create(document: PetDocument): Promise<void> {
    await this.db.insert(petDocuments).values(document);
  }

  async listByPet(petId: string): Promise<PetDocument[]> {
    const rows = await this.db
      .select()
      .from(petDocuments)
      .where(eq(petDocuments.petId, petId))
      .orderBy(desc(petDocuments.date), desc(petDocuments.id));

    return rows.map(toDomain);
  }

  async findByIdAndPet(id: string, petId: string): Promise<PetDocument | null> {
    const [row] = await this.db
      .select()
      .from(petDocuments)
      .where(and(eq(petDocuments.id, id), eq(petDocuments.petId, petId)))
      .limit(1);
    return row ? toDomain(row) : null;
  }

  async markUploaded(id: string): Promise<void> {
    await this.db
      .update(petDocuments)
      .set({ uploadedAt: sql`now()` })
      .where(and(eq(petDocuments.id, id), isNull(petDocuments.uploadedAt)));
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
    uploadedAt: row.uploadedAt,
    createdBy: row.createdBy,
  };
}
