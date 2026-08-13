import { Inject, Injectable } from '@nestjs/common';
import { uuidv7 } from 'uuidv7';
import type { UpdateReminderDto } from '@/modules/reminders/application/dto/reminder.dto';
import { Reminder } from '@/modules/reminders/domain/entities/reminder.entity';
import { REMINDER_REPOSITORY } from '@/modules/reminders/domain/repositories/reminder.repository';
import type {
  ReminderChanges,
  ReminderRepository,
} from '@/modules/reminders/domain/repositories/reminder.repository';

@Injectable()
export class UpdateReminderUseCase {
  constructor(
    @Inject(REMINDER_REPOSITORY)
    private readonly reminders: ReminderRepository,
  ) {}

  execute(id: string, dto: UpdateReminderDto): Promise<Reminder> {
    const changes: ReminderChanges = {};
    if (dto.dueAt !== undefined) changes.dueAt = new Date(dto.dueAt);
    if (dto.advanceMinutes !== undefined) {
      changes.advanceMinutes = dto.advanceMinutes;
    }
    if (dto.title !== undefined) changes.title = dto.title;

    return this.reminders.reschedule(id, changes, `reminder-${uuidv7()}`);
  }
}
