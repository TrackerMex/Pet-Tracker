import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DRIZZLE } from '@/db/drizzle.constants';
import type { PetInvite } from '@/modules/pet-members/domain/entities/pet-invite.entity';
import type { PetMember } from '@/modules/pet-members/domain/entities/pet-member.entity';
import type {
  AcceptInviteResult,
  PetMemberRepository,
} from '@/modules/pet-members/domain/repositories/pet-member.repository';

@Injectable()
export class PetMemberDrizzleRepository implements PetMemberRepository {
  constructor(@Inject(DRIZZLE) private readonly db: NodePgDatabase) {}
  countSlots(
    petId: string,
    now: Date,
  ): Promise<{ pendingInvites: number; activeMembers: number }> {
    void petId;
    void now;
    return Promise.reject(new Error('Not implemented'));
  }
  createInvite(input: {
    petId: string;
    codeHash: string;
    createdBy: string;
    createdAt: Date;
    expiresAt: Date;
  }): Promise<PetInvite> {
    void input;
    return Promise.reject(new Error('Not implemented'));
  }
  listPendingInvites(petId: string, now: Date): Promise<PetInvite[]> {
    void petId;
    void now;
    return Promise.reject(new Error('Not implemented'));
  }
  revokeInvite(petId: string, inviteId: string, now: Date): Promise<boolean> {
    void petId;
    void inviteId;
    void now;
    return Promise.reject(new Error('Not implemented'));
  }
  acceptInvite(
    codeHash: string,
    userId: string,
    now: Date,
  ): Promise<AcceptInviteResult> {
    void codeHash;
    void userId;
    void now;
    return Promise.reject(new Error('Not implemented'));
  }
  listMembers(petId: string): Promise<PetMember[]> {
    void petId;
    return Promise.reject(new Error('Not implemented'));
  }
  deleteMembership(petId: string, userId: string): Promise<void> {
    void petId;
    void userId;
    return Promise.reject(new Error('Not implemented'));
  }
}
