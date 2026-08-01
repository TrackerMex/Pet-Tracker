import { Inject, Injectable } from '@nestjs/common';
import { AUDIT_LOGGER } from '@/audit/audit-log.repository';
import type { AuditLogger } from '@/audit/audit-log.repository';
import { PET_REPOSITORY } from '@/modules/pets/domain/repositories/pet.repository';
import type { PetRepository } from '@/modules/pets/domain/repositories/pet.repository';

/**
 * DELETE /v1/pets/:petId (R16). El ON DELETE CASCADE de pet_users (R1)
 * elimina todas las membresias junto con la fila de pets. Se audita
 * pet.delete sin meta — el entityId basta, mismo criterio que pet.create.
 */
@Injectable()
export class DeletePetUseCase {
  constructor(
    @Inject(PET_REPOSITORY)
    private readonly pets: PetRepository,
    @Inject(AUDIT_LOGGER)
    private readonly auditLogger: AuditLogger,
  ) {}

  async execute(petId: string, userId: string): Promise<void> {
    await this.pets.delete(petId);

    await this.auditLogger.record({
      userId,
      action: 'pet.delete',
      entity: 'pet',
      entityId: petId,
    });
  }
}
