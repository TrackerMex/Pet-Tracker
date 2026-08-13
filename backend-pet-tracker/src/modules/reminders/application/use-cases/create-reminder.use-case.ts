import { Inject, Injectable } from '@nestjs/common';
import { uuidv7 } from 'uuidv7';
import { CreateReminderDto } from '@/modules/reminders/application/dto/reminder.dto';
import { Reminder } from '@/modules/reminders/domain/entities/reminder.entity';
import { REMINDER_REPOSITORY } from '@/modules/reminders/domain/repositories/reminder.repository';
import type { ReminderRepository } from '@/modules/reminders/domain/repositories/reminder.repository';

@Injectable()
export class CreateReminderUseCase {
  constructor(
    @Inject(REMINDER_REPOSITORY)
    private readonly reminders: ReminderRepository,
  ) {}

  execute(
    petId: string,
    dto: CreateReminderDto,
    userId: string,
  ): Promise<Reminder> {
    return this.reminders.create({
      petId,
      type: dto.type,
      title: dto.title,
      dueAt: new Date(dto.dueAt),
      advanceMinutes: dto.advanceMinutes ?? 60,
      channel: 'push',
      status: 'scheduled',
      scheduleName: `reminder-${uuidv7()}`,
      enqueuedAt: null,
      createdBy: userId,
    });
  }
}
