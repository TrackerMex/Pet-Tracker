import { Inject, Injectable } from '@nestjs/common';
import { uuidv7 } from 'uuidv7';
import type { UpdateReminderDto } from '@/modules/reminders/application/dto/reminder.dto';
import { Reminder } from '@/modules/reminders/domain/entities/reminder.entity';
import {
  NotReminderOwnerError,
  ReminderNotEditableError,
  ReminderNotFoundError,
} from '@/modules/reminders/domain/errors/reminder.errors';
import { REMINDER_REPOSITORY } from '@/modules/reminders/domain/repositories/reminder.repository';
import type {
  ReminderChanges,
  ReminderRepository,
} from '@/modules/reminders/domain/repositories/reminder.repository';
import {
  PET_REPOSITORY,
  type PetRepository,
} from '@/modules/pets/domain/repositories/pet.repository';

@Injectable()
export class UpdateReminderUseCase {
  constructor(
    @Inject(REMINDER_REPOSITORY)
    private readonly reminders: ReminderRepository,
    @Inject(PET_REPOSITORY)
    private readonly pets: PetRepository,
  ) {}

  async execute(
    id: string,
    dto: UpdateReminderDto,
    userId: string,
  ): Promise<Reminder> {
    const reminder = await this.reminders.findById(id);
    if (!reminder) throw new ReminderNotFoundError(id);

    const membership = await this.pets.findMembership(reminder.petId, userId);
    if (!membership || membership.status !== 'active') {
      throw new ReminderNotFoundError(id);
    }
    if (membership.role !== 'owner') throw new NotReminderOwnerError();
    if (reminder.status !== 'scheduled') {
      throw new ReminderNotEditableError();
    }

    if ('status' in dto) {
      return this.reminders.cancel(id);
    }

    const changes: ReminderChanges = {};
    if (dto.dueAt !== undefined) changes.dueAt = new Date(dto.dueAt);
    if (dto.advanceMinutes !== undefined) {
      changes.advanceMinutes = dto.advanceMinutes;
    }
    if (dto.title !== undefined) changes.title = dto.title;

    return this.reminders.reschedule(id, changes, `reminder-${uuidv7()}`);
  }
}
