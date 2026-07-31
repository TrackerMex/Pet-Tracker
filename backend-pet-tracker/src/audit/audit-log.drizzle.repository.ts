import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DRIZZLE } from '@/db/drizzle.constants';
import { auditLog } from '@/db/schema/audit-log.schema';
import { AuditLogEntry, AuditLogger } from './audit-log.repository';

@Injectable()
export class AuditLogDrizzleRepository implements AuditLogger {
  constructor(@Inject(DRIZZLE) private readonly db: NodePgDatabase) {}

  async record(entry: AuditLogEntry): Promise<void> {
    await this.db.insert(auditLog).values({
      userId: entry.userId,
      action: entry.action,
      entity: entry.entity,
      entityId: entry.entityId,
      meta: entry.meta ?? null,
    });
  }
}
