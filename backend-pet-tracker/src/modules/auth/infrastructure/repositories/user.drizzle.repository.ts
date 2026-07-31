import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { uuidv7 } from 'uuidv7';
import { DRIZZLE } from '@/db/drizzle.constants';
import { users } from '@/db/schema/users.schema';
import { User } from '@/modules/auth/domain/entities/user.entity';
import {
  NewUser,
  ProfileFieldChanges,
  UserRepository,
} from '@/modules/auth/domain/repositories/user.repository';

type UserRow = typeof users.$inferSelect;

@Injectable()
export class UserDrizzleRepository implements UserRepository {
  constructor(@Inject(DRIZZLE) private readonly db: NodePgDatabase) {}

  async existsByEmail(email: string): Promise<boolean> {
    const rows = await this.db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    return rows.length > 0;
  }

  async create(user: NewUser): Promise<User> {
    const [row] = await this.db
      .insert(users)
      .values({ id: uuidv7(), ...user })
      .returning();

    return toDomain(row);
  }

  async markEmailVerified(userId: string, verifiedAt: Date): Promise<void> {
    await this.db
      .update(users)
      .set({ emailVerifiedAt: verifiedAt, updatedAt: verifiedAt })
      .where(eq(users.id, userId));
  }

  async findByEmail(email: string): Promise<User | null> {
    const rows = await this.db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    return rows[0] ? toDomain(rows[0]) : null;
  }

  async findById(id: string): Promise<User | null> {
    const rows = await this.db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    return rows[0] ? toDomain(rows[0]) : null;
  }

  async updateProfile(
    userId: string,
    changes: ProfileFieldChanges,
  ): Promise<User> {
    const [row] = await this.db
      .update(users)
      .set({ ...changes, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();

    return toDomain(row);
  }
}

function toDomain(row: UserRow): User {
  return new User({
    id: row.id,
    email: row.email,
    passwordHash: row.passwordHash,
    firstName: row.firstName,
    lastName: row.lastName,
    phone: row.phone,
    country: row.country,
    timezone: row.timezone,
    termsAcceptedAt: row.termsAcceptedAt,
    emailVerifiedAt: row.emailVerifiedAt,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  });
}
