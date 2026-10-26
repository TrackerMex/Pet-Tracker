import type { AuditLogger } from '@/audit/audit-log.repository';
import { InviteNotAcceptableError } from '@/modules/pet-members/domain/errors/pet-member.errors';
import type { PetMemberRepository } from '@/modules/pet-members/domain/repositories/pet-member.repository';
import { AcceptPetInviteUseCase } from './accept-pet-invite.use-case';

describe('#211 R8: aceptar invitación', () => {
  it('#211 R8: un código que no normaliza no consulta el repositorio', async () => {
    const acceptInvite = jest.fn();
    const repo = { acceptInvite } as unknown as PetMemberRepository;
    const audit = {
      record: jest.fn().mockResolvedValue(undefined),
    } as unknown as AuditLogger;
    await expect(
      new AcceptPetInviteUseCase(repo, audit).execute(
        'abc',
        'user',
        new Date(),
      ),
    ).rejects.toBeInstanceOf(InviteNotAcceptableError);
    expect(acceptInvite).not.toHaveBeenCalled();
  });
});
