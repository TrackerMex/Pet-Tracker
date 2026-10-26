import {
  generateInviteCode,
  hashInviteCode,
  INVITE_TTL_MS,
} from '../invite-code';
import { Inject, Injectable } from '@nestjs/common';
import { PET_MEMBER_REPOSITORY } from '@/modules/pet-members/domain/repositories/pet-member.repository';
import type { PetMemberRepository } from '@/modules/pet-members/domain/repositories/pet-member.repository';
import { AUDIT_LOGGER } from '@/audit/audit-log.repository';
import type { AuditLogger } from '@/audit/audit-log.repository';
import type { PetInvite } from '@/modules/pet-members/domain/entities/pet-invite.entity';
export const MAX_PENDING_INVITES_PER_PET = 5;
export const MAX_MEMBERS_PER_PET = 10;

@Injectable()
export class CreatePetInviteUseCase {
  constructor(
    @Inject(PET_MEMBER_REPOSITORY) private readonly repo: PetMemberRepository,
    @Inject(AUDIT_LOGGER) private readonly audit: AuditLogger,
  ) {}
  async execute(
    petId: string,
    userId: string,
    now: Date,
  ): Promise<{ invite: PetInvite; code: string }> {
    const code = generateInviteCode();
    const invite = await this.repo.createInvite({
      petId,
      codeHash: hashInviteCode(code),
      createdBy: userId,
      createdAt: now,
      expiresAt: new Date(now.getTime() + INVITE_TTL_MS),
    });
    return { invite, code };
  }
}
