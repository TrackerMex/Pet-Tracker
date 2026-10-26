import { normalizeInviteCode, hashInviteCode } from '../invite-code';
import {
  InviteNotAcceptableError,
  AlreadyPetMemberError,
} from '@/modules/pet-members/domain/errors/pet-member.errors';
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
  async execute(
    rawCode: string,
    userId: string,
    now: Date,
  ): Promise<{ petId: string; role: 'family' }> {
    await this.audit.record({
      userId,
      action: 'pet_invite.accept',
      entity: 'pet_invite',
      entityId: userId,
      meta: {},
    });
    const code = normalizeInviteCode(rawCode);
    if (code === null) throw new InviteNotAcceptableError();
    const result = await this.repo.acceptInvite(
      hashInviteCode(code),
      userId,
      now,
    );
    if (result.status === 'not_acceptable')
      throw new InviteNotAcceptableError();
    if (result.status === 'already_member') throw new AlreadyPetMemberError();
    await this.audit.record({
      userId,
      action: 'pet_invite.accept',
      entity: 'pet_invite',
      entityId: result.invite.id,
      meta: { petId: result.invite.petId },
    });
    return { petId: result.invite.petId, role: 'family' };
  }
}
