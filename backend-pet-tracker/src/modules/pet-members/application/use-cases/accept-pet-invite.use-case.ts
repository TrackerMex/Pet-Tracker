import { Inject, Injectable } from '@nestjs/common';
import { PET_MEMBER_REPOSITORY } from '@/modules/pet-members/domain/repositories/pet-member.repository';
import type { PetMemberRepository } from '@/modules/pet-members/domain/repositories/pet-member.repository';
import { AUDIT_LOGGER } from '@/audit/audit-log.repository';
import type { AuditLogger } from '@/audit/audit-log.repository';

@Injectable()
export class AcceptPetInviteUseCase {
  constructor(
    @Inject(PET_MEMBER_REPOSITORY) private readonly repo: PetMemberRepository,
    @Inject(AUDIT_LOGGER) private readonly audit: AuditLogger,
  ) {}
  execute(
    rawCode: string,
    userId: string,
    now: Date,
  ): Promise<{ petId: string; role: 'family' }> {
    void rawCode;
    void userId;
    void now;
    return Promise.reject(new Error('Not implemented'));
  }
}
