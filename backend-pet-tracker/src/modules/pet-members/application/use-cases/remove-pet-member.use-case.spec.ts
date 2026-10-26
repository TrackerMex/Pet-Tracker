import type { AuditLogger } from '@/audit/audit-log.repository';
import { MemberRemovalForbiddenError } from '@/modules/pet-members/domain/errors/pet-member.errors';
import type { PetMemberRepository } from '@/modules/pet-members/domain/repositories/pet-member.repository';
import type { PetRepository } from '@/modules/pets/domain/repositories/pet.repository';
import { RemovePetMemberUseCase } from './remove-pet-member.use-case';
describe('#211 R13: baja de miembros', () => {
  it('#211 R13: un no owner sobre otro usuario no llama a findMembership', async () => {
    const findMembership = jest.fn();
    const pets = { findMembership } as unknown as PetRepository;
    const repo = {} as unknown as PetMemberRepository;
    const audit = {
      record: jest.fn().mockResolvedValue(undefined),
    } as unknown as AuditLogger;
    await expect(
      new RemovePetMemberUseCase(repo, pets, audit).execute(
        'pet',
        { userId: 'actor', role: 'family' },
        'other',
      ),
    ).rejects.toBeInstanceOf(MemberRemovalForbiddenError);
    expect(findMembership).not.toHaveBeenCalled();
  });
});
