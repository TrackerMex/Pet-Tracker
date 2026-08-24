import { Inject, Injectable } from '@nestjs/common';
import { ReminderNotFoundError } from '@/modules/reminders/domain/errors/reminder.errors';
import { REMINDER_REPOSITORY } from '@/modules/reminders/domain/repositories/reminder.repository';
import type { ReminderRepository } from '@/modules/reminders/domain/repositories/reminder.repository';

@Injectable()
export class DeleteReminderUseCase {
  constructor(
    @Inject(REMINDER_REPOSITORY)
    private readonly reminders: ReminderRepository,
  ) {}

  async execute(petId: string, reminderId: string): Promise<void> {
    const deleted = await this.reminders.deleteByPetAndId(petId, reminderId);
    if (!deleted) throw new ReminderNotFoundError(reminderId);
  }
}
