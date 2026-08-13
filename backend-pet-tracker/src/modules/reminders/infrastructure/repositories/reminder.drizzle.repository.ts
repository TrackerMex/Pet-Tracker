import { Inject, Injectable } from '@nestjs/common';
import { and, asc, eq, isNull, sql } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { uuidv7 } from 'uuidv7';
import { DRIZZLE } from '@/db/drizzle.constants';
import { reminders } from '@/db/schema/reminders.schema';
import { Reminder } from '@/modules/reminders/domain/entities/reminder.entity';
import {
  NewReminder,
  ReminderChanges,
  ReminderRepository,
} from '@/modules/reminders/domain/repositories/reminder.repository';

type ReminderRow = typeof reminders.$inferSelect;

@Injectable()
export class ReminderDrizzleRepository implements ReminderRepository {
  constructor(@Inject(DRIZZLE) private readonly db: NodePgDatabase) {}

  async create(data: NewReminder): Promise<Reminder> {
    const [row] = await this.db
      .insert(reminders)
      .values({ id: uuidv7(), ...data })
      .returning();
    return toDomain(row);
  }

  async findById(id: string): Promise<Reminder | null> {
    const [row] = await this.db
      .select()
      .from(reminders)
      .where(eq(reminders.id, id))
      .limit(1);
    return row ? toDomain(row) : null;
  }

  async reschedule(
    id: string,
    changes: ReminderChanges,
    newScheduleName: string,
  ): Promise<Reminder> {
    const [row] = await this.db
      .update(reminders)
      .set({ ...changes, scheduleName: newScheduleName, enqueuedAt: null })
      .where(and(eq(reminders.id, id), eq(reminders.status, 'scheduled')))
      .returning();
    return toDomain(row);
  }

  async findDue(now: Date): Promise<Reminder[]> {
    const rows = await this.db
      .select()
      .from(reminders)
      .where(
        and(
          eq(reminders.status, 'scheduled'),
          isNull(reminders.enqueuedAt),
          sql`${reminders.dueAt} - (${reminders.advanceMinutes} * interval '1 minute') <= ${now}`,
        ),
      )
      .orderBy(asc(reminders.dueAt));
    return rows.map(toDomain);
  }

  async markEnqueued(id: string, at: Date): Promise<void> {
    await this.db
      .update(reminders)
      .set({ enqueuedAt: at })
      .where(eq(reminders.id, id));
  }

  async markSent(id: string): Promise<boolean> {
    const rows = await this.db
      .update(reminders)
      .set({ status: 'sent' })
      .where(and(eq(reminders.id, id), eq(reminders.status, 'scheduled')))
      .returning({ id: reminders.id });
    return rows.length === 1;
  }
}

function toDomain(row: ReminderRow): Reminder {
  return new Reminder({
    id: row.id,
    petId: row.petId,
    type: row.type as Reminder['type'],
    title: row.title,
    dueAt: row.dueAt,
    advanceMinutes: row.advanceMinutes,
    channel: row.channel as Reminder['channel'],
    status: row.status as Reminder['status'],
    scheduleName: row.scheduleName,
    enqueuedAt: row.enqueuedAt,
    createdBy: row.createdBy,
  });
}
