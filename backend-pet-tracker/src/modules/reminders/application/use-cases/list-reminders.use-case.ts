import { Inject, Injectable } from '@nestjs/common';
import { Reminder } from '@/modules/reminders/domain/entities/reminder.entity';
import { REMINDER_REPOSITORY } from '@/modules/reminders/domain/repositories/reminder.repository';
import type { ReminderRepository } from '@/modules/reminders/domain/repositories/reminder.repository';

@Injectable()
export class ListRemindersUseCase {
  constructor(
    @Inject(REMINDER_REPOSITORY)
    private readonly reminders: ReminderRepository,
  ) {}

  execute(petId: string): Promise<Reminder[]> {
    return this.reminders.listByPet(petId);
  }
}
