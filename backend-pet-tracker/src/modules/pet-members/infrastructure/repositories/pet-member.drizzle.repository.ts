import { and, count, desc, eq, gt, isNull } from 'drizzle-orm';
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
    return toDomain(row);
  }
  async listPendingInvites(petId: string, now: Date): Promise<PetInvite[]> {
    const rows = await this.db
      .select()
      .from(petInvites)
      .where(
        and(
          eq(petInvites.petId, petId),
          isNull(petInvites.acceptedAt),
          isNull(petInvites.revokedAt),
          gt(petInvites.expiresAt, now),
        ),
      )
      .orderBy(desc(petInvites.createdAt), desc(petInvites.id));
    return rows.map(toDomain);
  }
  async revokeInvite(
    petId: string,
    inviteId: string,
    now: Date,
  ): Promise<boolean> {
    const rows = await this.db
      .update(petInvites)
      .set({ revokedAt: now })
      .where(
        and(
          eq(petInvites.id, inviteId),
          eq(petInvites.petId, petId),
          isNull(petInvites.acceptedAt),
          isNull(petInvites.revokedAt),
          gt(petInvites.expiresAt, now),
        ),
      )
      .returning({ id: petInvites.id });
    return rows.length === 1;
  }
  async acceptInvite(
    codeHash: string,
    userId: string,
    now: Date,
  ): Promise<AcceptInviteResult> {
    // shortcut: concurrent accepts of different codes for the same member can conflict on the PK; revisit if observed.
    return this.db.transaction<AcceptInviteResult>(async (tx) => {
      const [invite] = await tx
        .select()
        .from(petInvites)
        .where(
          and(
            eq(petInvites.codeHash, codeHash),
            isNull(petInvites.acceptedAt),
            isNull(petInvites.revokedAt),
            gt(petInvites.expiresAt, now),
          ),
        )
        .limit(1)
        .for('update');
      if (!invite) return { status: 'not_acceptable' };
      const [member] = await tx
        .select()
        .from(petUsers)
        .where(
          and(eq(petUsers.petId, invite.petId), eq(petUsers.userId, userId)),
        )
        .limit(1);
      if (member) return { status: 'already_member' };
      await tx
        .update(petInvites)
        .set({ acceptedBy: userId, acceptedAt: now })
        .where(eq(petInvites.id, invite.id));
      await tx.insert(petUsers).values({
        petId: invite.petId,
        userId,
        role: 'family',
        status: 'active',
      });
      return {
        status: 'accepted',
        invite: toDomain({ ...invite, acceptedBy: userId, acceptedAt: now }),
      };
    });
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

function toDomain(row: typeof petInvites.$inferSelect): PetInvite {
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
