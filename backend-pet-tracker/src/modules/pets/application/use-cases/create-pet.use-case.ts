import { Inject, Injectable } from '@nestjs/common';
import { AUDIT_LOGGER } from '@/audit/audit-log.repository';
import type { AuditLogger } from '@/audit/audit-log.repository';
import { USER_REPOSITORY } from '@/modules/auth/domain/repositories/user.repository';
import type { UserRepository } from '@/modules/auth/domain/repositories/user.repository';
import { requesterLocalDay } from '@/modules/pets/application/requester-local-day';
import { Pet } from '@/modules/pets/domain/entities/pet.entity';
import { PetBirthDateInFutureError } from '@/modules/pets/domain/errors/pet.errors';
import { PET_REPOSITORY } from '@/modules/pets/domain/repositories/pet.repository';
import type { PetRepository } from '@/modules/pets/domain/repositories/pet.repository';
import { CreatePetDto } from '../dto/create-pet.dto';

/**
 * POST /v1/pets (R2, R3). La atomicidad pets + pet_users vive en el
 * repositorio (createWithOwner); la auditoria corre despues del commit via
 * el puerto AuditLogger — mismo precedente que user.register (#3): si la
 * transaccion falla, no se audita nada.
 * #89: birthDate se compara con el dia civil del requester.
 */
@Injectable()
export class CreatePetUseCase {
  constructor(
    @Inject(PET_REPOSITORY)
    private readonly pets: PetRepository,
    @Inject(USER_REPOSITORY)
    private readonly users: UserRepository,
    @Inject(AUDIT_LOGGER)
    private readonly auditLogger: AuditLogger,
  ) {}

  async execute(dto: CreatePetDto, userId: string, now: Date): Promise<Pet> {
    if (
      dto.birthDate !== undefined &&
      dto.birthDate > (await requesterLocalDay(this.users, userId, now))
    ) {
      throw new PetBirthDateInFutureError();
    }

    const pet = await this.pets.createWithOwner(dto, userId);

    await this.auditLogger.record({
      userId,
      action: 'pet.create',
      entity: 'pet',
      entityId: pet.id,
    });

    return pet;
  }
}
