import { Inject, Injectable } from '@nestjs/common';
import { PET_MEMBER_REPOSITORY } from '@/modules/pet-members/domain/repositories/pet-member.repository';
import type { PetMemberRepository } from '@/modules/pet-members/domain/repositories/pet-member.repository';
import type { PetMember } from '@/modules/pet-members/domain/entities/pet-member.entity';

@Injectable()
export class ListPetMembersUseCase {
  constructor(
    @Inject(PET_MEMBER_REPOSITORY) private readonly repo: PetMemberRepository,
  ) {}
  execute(petId: string): Promise<PetMember[]> {
    void petId;
    return Promise.reject(new Error('Not implemented'));
  }
}
