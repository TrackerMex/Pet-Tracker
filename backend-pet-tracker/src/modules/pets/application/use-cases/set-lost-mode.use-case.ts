import { Inject, Injectable } from '@nestjs/common';
import { AUDIT_LOGGER } from '@/audit/audit-log.repository';
import type { AuditLogger } from '@/audit/audit-log.repository';
import { Pet } from '@/modules/pets/domain/entities/pet.entity';
import { PET_REPOSITORY } from '@/modules/pets/domain/repositories/pet.repository';
import type { PetRepository } from '@/modules/pets/domain/repositories/pet.repository';

/** Escribe el valor solicitado; repetirlo sigue persistiendo y auditando. */
@Injectable()
export class SetLostModeUseCase {
  constructor(
    @Inject(PET_REPOSITORY)
    private readonly pets: PetRepository,
    @Inject(AUDIT_LOGGER)
    private readonly auditLogger: AuditLogger,
  ) {}

  async execute(petId: string, userId: string, enabled: boolean): Promise<Pet> {
    const updated = await this.pets.update(petId, { lostMode: enabled });

    await this.auditLogger.record({
      userId,
      action: 'pet.lost_mode',
      entity: 'pet',
      entityId: petId,
      meta: { enabled },
    });

    return updated;
  }
}
