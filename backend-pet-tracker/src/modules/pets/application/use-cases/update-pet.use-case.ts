import { Inject, Injectable } from '@nestjs/common';
import { AUDIT_LOGGER } from '@/audit/audit-log.repository';
import type { AuditLogger } from '@/audit/audit-log.repository';
import { Pet } from '@/modules/pets/domain/entities/pet.entity';
import { PetNotFoundError } from '@/modules/pets/domain/errors/pet.errors';
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
  ): Promise<Pet> {
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

/**
 * `weightKg` del DTO persiste como `currentWeightKg`; enviar un campo de
 * edad anula el otro (R14) — birth_date y approx_age_months nunca conviven.
 */
function toFieldChanges(dto: UpdatePetDto): PetFieldChanges {
  const { weightKg, ...rest } = dto;
  const changes: PetFieldChanges = { ...rest };

  if (weightKg !== undefined) {
    changes.currentWeightKg = weightKg;
  }

  if (dto.birthDate !== undefined) {
    changes.approxAgeMonths = null;
  } else if (dto.approxAgeMonths !== undefined) {
    changes.birthDate = null;
  }

  return changes;
}
