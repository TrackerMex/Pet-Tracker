import { Inject, Injectable } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { uuidv7 } from 'uuidv7';
import { DRIZZLE } from '@/db/drizzle.constants';
import { pets, petUsers } from '@/db/schema/pets.schema';
import {
  Pet,
  PetSex,
  PetSize,
  PetSpecies,
} from '@/modules/pets/domain/entities/pet.entity';
import { PetRole } from '@/modules/pets/domain/entities/pet-membership';
import {
  NewPet,
  PetRepository,
  PetWithRole,
} from '@/modules/pets/domain/repositories/pet.repository';

type PetRow = typeof pets.$inferSelect;

@Injectable()
export class PetDrizzleRepository implements PetRepository {
  constructor(@Inject(DRIZZLE) private readonly db: NodePgDatabase) {}

  async createWithOwner(data: NewPet, ownerId: string): Promise<Pet> {
    const id = uuidv7();

    // R2: pets + pet_users(owner) atomicos — si el segundo insert falla
    // (p.ej. FK de user_id), Postgres revierte tambien el primero.
    const row = await this.db.transaction(async (tx) => {
      const [petRow] = await tx
        .insert(pets)
        .values({
          id,
          name: data.name,
          species: data.species,
          breed: data.breed,
          birthDate: data.birthDate,
          approxAgeMonths: data.approxAgeMonths,
          sex: data.sex,
          currentWeightKg: toWeightColumn(data.currentWeightKg),
          size: data.size,
          color: data.color,
          sterilized: data.sterilized,
          microchip: data.microchip,
        })
        .returning();

      await tx.insert(petUsers).values({
        petId: id,
        userId: ownerId,
        role: 'owner',
        status: 'active',
      });

      return petRow;
    });

    return toDomain(row);
  }

  async findAllByMember(userId: string): Promise<PetWithRole[]> {
    const rows = await this.db
      .select({ pet: pets, role: petUsers.role })
      .from(petUsers)
      .innerJoin(pets, eq(petUsers.petId, pets.id))
      .where(and(eq(petUsers.userId, userId), eq(petUsers.status, 'active')));

    return rows.map((row) => ({
      pet: toDomain(row.pet),
      role: row.role as PetRole,
    }));
  }
}

/** numeric(5,2) viaja como string en el driver pg. */
function toWeightColumn(weightKg: number | undefined): string | undefined {
  return weightKg === undefined ? undefined : String(weightKg);
}

function toDomain(row: PetRow): Pet {
  return new Pet({
    id: row.id,
    name: row.name,
    species: row.species as PetSpecies,
    breed: row.breed ?? null,
    birthDate: row.birthDate ?? null,
    approxAgeMonths: row.approxAgeMonths ?? null,
    sex: (row.sex as PetSex | null) ?? null,
    currentWeightKg:
      row.currentWeightKg == null ? null : Number(row.currentWeightKg),
    size: (row.size as PetSize | null) ?? null,
    color: row.color ?? null,
    sterilized: row.sterilized ?? null,
    microchip: row.microchip ?? null,
    photoKey: row.photoKey ?? null,
    lostMode: row.lostMode,
    lastPosition: row.lastPosition ?? null,
    lastCommunicationAt: row.lastCommunicationAt ?? null,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  });
}
