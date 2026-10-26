import { createHash } from 'node:crypto';
import type { AuditLogger } from '@/audit/audit-log.repository';
import type { PetMemberRepository } from '@/modules/pet-members/domain/repositories/pet-member.repository';
import { CreatePetInviteUseCase } from './create-pet-invite.use-case';

describe('#211 R3: crear invitación', () => {
  it('#211 R3: expiresAt es now + 72 h', async () => {
    const now = new Date('2026-10-26T12:00:00.000Z');
    const invite = {
      id: 'invite',
      petId: 'pet',
      role: 'family',
      createdBy: 'owner',
      createdAt: now,
      expiresAt: new Date('2026-10-29T12:00:00.000Z'),
      acceptedBy: null,
      acceptedAt: null,
      revokedAt: null,
    };
    const createInvite = jest.fn().mockResolvedValue(invite);
    const repo = {
      createInvite,
      countSlots: jest
        .fn()
        .mockResolvedValue({ pendingInvites: 0, activeMembers: 1 }),
    } as unknown as PetMemberRepository;
    const audit = {
      record: jest.fn().mockResolvedValue(undefined),
    } as unknown as AuditLogger;
    const result = new CreatePetInviteUseCase(repo, audit).execute(
      'pet',
      'owner',
      now,
    );
    await expect(result).resolves.toEqual({
      invite,
      code: expect.any(String) as unknown,
    });
    const { code } = await result;
    expect(createInvite).toHaveBeenCalledWith(
      expect.objectContaining({
        createdAt: new Date('2026-10-26T12:00:00.000Z'),
        expiresAt: new Date('2026-10-29T12:00:00.000Z'),
        codeHash: createHash('sha256').update(code).digest('hex'),
      }),
    );
  });
});
