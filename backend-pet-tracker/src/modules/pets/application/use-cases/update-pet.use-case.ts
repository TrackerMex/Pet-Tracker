import { Inject, Injectable } from '@nestjs/common';
import { AUDIT_LOGGER } from '@/audit/audit-log.repository';
import type { AuditLogger } from '@/audit/audit-log.repository';
import { ownerLocalDay } from '@/modules/pets/application/owner-local-day';
import { Pet } from '@/modules/pets/domain/entities/pet.entity';
import {
  PetBirthDateInFutureError,
  PetNotFoundError,
} from '@/modules/pets/domain/errors/pet.errors';
import { PET_REPOSITORY } from '@/modules/pets/domain/repositories/pet.repository';
import type {
  PetFieldChanges,
  PetRepository,
} from '@/modules/pets/domain/repositories/pet.repository';
import { UpdatePetDto } from '../dto/update-pet.dto';

/**
 * PATCH /v1/pets/:petId (R13, R14, R15). La validacion completa ya corrio
 * en el borde HTTP (UpdatePetSchema): aqui nunca llega un campo invalido a
 * medio persistir. Mismo patron de no-op y auditoria que PATCH /v1/me (#4).
 * #89: birthDate se compara con el dia civil del owner cuando viene.
 */
@Injectable()
export class UpdatePetUseCase {
  constructor(
    @Inject(PET_REPOSITORY)
    private readonly pets: PetRepository,
    @Inject(AUDIT_LOGGER)
    private readonly auditLogger: AuditLogger,
  ) {}

  async execute(
    petId: string,
    userId: string,
    dto: UpdatePetDto,
    now: Date,
  ): Promise<Pet> {
    if (
      dto.birthDate !== undefined &&
      dto.birthDate > (await ownerLocalDay(this.pets, petId, now))
    ) {
      throw new PetBirthDateInFutureError();
    }

    const fieldsPresent = Object.keys(dto) as (keyof UpdatePetDto)[];

    if (fieldsPresent.length === 0) {
      // R15: body vacio (o sin campos reconocidos) es un no-op explicito:
      // ni se escribe en pets, ni se audita.
      const pet = await this.pets.findById(petId);

      if (!pet) {
        throw new PetNotFoundError(petId);
      }

      return pet;
    }

    const updated = await this.pets.update(petId, toFieldChanges(dto));

    await this.auditLogger.record({
      userId,
      action: 'pet.update',
      entity: 'pet',
      entityId: petId,
      // Solo nombres de campo (R15): nunca los valores.
      meta: { fields: fieldsPresent },
    });

    return updated;
  }
}

/** Enviar un campo de edad anula el otro (R14). */
function toFieldChanges(dto: UpdatePetDto): PetFieldChanges {
  const changes: PetFieldChanges = { ...dto };

  if (dto.birthDate !== undefined) {
    changes.approxAgeMonths = null;
  } else if (dto.approxAgeMonths !== undefined) {
    changes.birthDate = null;
  }

  return changes;
}
