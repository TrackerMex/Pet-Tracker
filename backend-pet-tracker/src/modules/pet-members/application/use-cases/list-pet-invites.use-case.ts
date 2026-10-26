import { Inject, Injectable } from '@nestjs/common';
import { PET_MEMBER_REPOSITORY } from '@/modules/pet-members/domain/repositories/pet-member.repository';
import type { PetMemberRepository } from '@/modules/pet-members/domain/repositories/pet-member.repository';
import type { PetInvite } from '@/modules/pet-members/domain/entities/pet-invite.entity';

@Injectable()
export class ListPetInvitesUseCase {
  constructor(
    @Inject(PET_MEMBER_REPOSITORY) private readonly repo: PetMemberRepository,
  ) {}
  execute(petId: string, now: Date): Promise<PetInvite[]> {
    return this.repo.listPendingInvites(petId, now);
  }
}
