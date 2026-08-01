import { Inject, Injectable } from '@nestjs/common';
import { AUDIT_LOGGER } from '@/audit/audit-log.repository';
import type { AuditLogger } from '@/audit/audit-log.repository';
import { Pet } from '@/modules/pets/domain/entities/pet.entity';
import { PET_REPOSITORY } from '@/modules/pets/domain/repositories/pet.repository';
import type {
  NewPet,
  PetRepository,
} from '@/modules/pets/domain/repositories/pet.repository';
import { CreatePetDto } from '../dto/create-pet.dto';

/**
 * POST /v1/pets (R2, R3). La atomicidad pets + pet_users vive en el
 * repositorio (createWithOwner); la auditoria corre despues del commit via
 * el puerto AuditLogger — mismo precedente que user.register (#3): si la
 * transaccion falla, no se audita nada.
 */
@Injectable()
export class CreatePetUseCase {
  constructor(
    @Inject(PET_REPOSITORY)
    private readonly pets: PetRepository,
    @Inject(AUDIT_LOGGER)
    private readonly auditLogger: AuditLogger,
  ) {}

  async execute(dto: CreatePetDto, userId: string): Promise<Pet> {
    const pet = await this.pets.createWithOwner(toNewPet(dto), userId);

    await this.auditLogger.record({
      userId,
      action: 'pet.create',
      entity: 'pet',
      entityId: pet.id,
    });

    return pet;
  }
}

/** El DTO expone `weightKg`; la ficha persiste `currentWeightKg` (R4). */
function toNewPet(dto: CreatePetDto): NewPet {
  const { weightKg, ...rest } = dto;

  return weightKg === undefined ? rest : { ...rest, currentWeightKg: weightKg };
}
