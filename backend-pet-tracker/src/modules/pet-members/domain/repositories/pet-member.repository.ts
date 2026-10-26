import type { PetInvite } from '../entities/pet-invite.entity';
import type { PetMember } from '../entities/pet-member.entity';
export const PET_MEMBER_REPOSITORY = Symbol('PetMemberRepository');
export type AcceptInviteResult =
  | { status: 'accepted'; invite: PetInvite }
  | { status: 'not_acceptable' }
  | { status: 'already_member' };
export interface PetMemberRepository {
  countSlots(
    petId: string,
    now: Date,
  ): Promise<{ pendingInvites: number; activeMembers: number }>;
  createInvite(input: {
    petId: string;
    codeHash: string;
    createdBy: string;
    createdAt: Date;
    expiresAt: Date;
  }): Promise<PetInvite>;
  listPendingInvites(petId: string, now: Date): Promise<PetInvite[]>;
  revokeInvite(petId: string, inviteId: string, now: Date): Promise<boolean>;
  acceptInvite(
    codeHash: string,
    userId: string,
    now: Date,
  ): Promise<AcceptInviteResult>;
  listMembers(petId: string): Promise<PetMember[]>;
  deleteMembership(petId: string, userId: string): Promise<void>;
}
