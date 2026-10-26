import { Inject, Injectable } from '@nestjs/common';
import { PET_MEMBER_REPOSITORY } from '@/modules/pet-members/domain/repositories/pet-member.repository';
import type { PetMemberRepository } from '@/modules/pet-members/domain/repositories/pet-member.repository';
import { AUDIT_LOGGER } from '@/audit/audit-log.repository';
import type { AuditLogger } from '@/audit/audit-log.repository';
import { PET_REPOSITORY } from '@/modules/pets/domain/repositories/pet.repository';
import type { PetRepository } from '@/modules/pets/domain/repositories/pet.repository';
import type { PetRole } from '@/modules/pets/domain/entities/pet-membership';

@Injectable()
export class RemovePetMemberUseCase {
  constructor(
    @Inject(PET_MEMBER_REPOSITORY) private readonly repo: PetMemberRepository,
    @Inject(PET_REPOSITORY) private readonly pets: PetRepository,
    @Inject(AUDIT_LOGGER) private readonly audit: AuditLogger,
  ) {}
  execute(
    petId: string,
    actor: { userId: string; role: PetRole },
    targetUserId: string,
  ): Promise<void> {
    void petId;
    void actor;
    void targetUserId;
    return Promise.reject(new Error('Not implemented'));
  }
}
