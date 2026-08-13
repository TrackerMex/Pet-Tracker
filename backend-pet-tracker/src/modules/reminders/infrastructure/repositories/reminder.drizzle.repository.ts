import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { uuidv7 } from 'uuidv7';
import { DRIZZLE } from '@/db/drizzle.constants';
import { reminders } from '@/db/schema/reminders.schema';
import { Reminder } from '@/modules/reminders/domain/entities/reminder.entity';
import {
  NewReminder,
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
