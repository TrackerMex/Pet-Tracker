import { and, count, eq, gt, isNull } from 'drizzle-orm';
import { uuidv7 } from 'uuidv7';
import { petInvites, petUsers } from '@/db/schema';
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
  async countSlots(
    petId: string,
    now: Date,
  ): Promise<{ pendingInvites: number; activeMembers: number }> {
    const [pending] = await this.db
      .select({ count: count() })
      .from(petInvites)
      .where(
        and(
          eq(petInvites.petId, petId),
          isNull(petInvites.acceptedAt),
          isNull(petInvites.revokedAt),
          gt(petInvites.expiresAt, now),
        ),
      );
    const [members] = await this.db
      .select({ count: count() })
      .from(petUsers)
      .where(and(eq(petUsers.petId, petId), eq(petUsers.status, 'active')));
    return { pendingInvites: pending.count, activeMembers: members.count };
  }
  async createInvite(input: {
    petId: string;
    codeHash: string;
    createdBy: string;
    createdAt: Date;
    expiresAt: Date;
  }): Promise<PetInvite> {
    const [row] = await this.db
      .insert(petInvites)
      .values({ ...input, id: uuidv7(), role: 'family' })
      .returning();
    return {
      id: row.id,
      petId: row.petId,
      role: 'family',
      createdBy: row.createdBy,
      createdAt: row.createdAt,
      expiresAt: row.expiresAt,
      acceptedBy: row.acceptedBy,
      acceptedAt: row.acceptedAt,
      revokedAt: row.revokedAt,
    };
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
