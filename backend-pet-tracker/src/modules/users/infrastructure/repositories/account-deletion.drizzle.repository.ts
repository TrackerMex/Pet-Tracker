import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DRIZZLE } from '@/db/drizzle.constants';
import type { AccountDeletionRepository } from '@/modules/users/domain/repositories/account-deletion.repository';

@Injectable()
export class AccountDeletionDrizzleRepository implements AccountDeletionRepository {
  constructor(@Inject(DRIZZLE) private readonly db: NodePgDatabase) {}
  deleteAccount(userId: string): Promise<string[]> {
    void userId;
    return Promise.reject(new Error('Not implemented'));
  }
}
