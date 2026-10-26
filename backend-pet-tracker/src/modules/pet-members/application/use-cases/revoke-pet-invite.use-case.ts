import { Inject, Injectable } from '@nestjs/common';
import { PET_MEMBER_REPOSITORY } from '@/modules/pet-members/domain/repositories/pet-member.repository';
import type { PetMemberRepository } from '@/modules/pet-members/domain/repositories/pet-member.repository';
import { AUDIT_LOGGER } from '@/audit/audit-log.repository';
import type { AuditLogger } from '@/audit/audit-log.repository';

@Injectable()
export class RevokePetInviteUseCase {
  constructor(
    @Inject(PET_MEMBER_REPOSITORY) private readonly repo: PetMemberRepository,
    @Inject(AUDIT_LOGGER) private readonly audit: AuditLogger,
  ) {}
  execute(
    petId: string,
    inviteId: string,
    userId: string,
    now: Date,
  ): Promise<void> {
    void petId;
    void inviteId;
    void userId;
    void now;
    return Promise.reject(new Error('Not implemented'));
  }
}
