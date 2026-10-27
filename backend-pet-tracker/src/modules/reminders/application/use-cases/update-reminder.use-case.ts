import { Inject, Injectable } from '@nestjs/common';
import { uuidv7 } from 'uuidv7';
import { assertValidRecurrence } from '../recurrence';
import { ownerTimeZone } from '@/modules/pets/application/owner-local-day';
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

    const recurrenceEdited =
      dto.dueAt !== undefined ||
      dto.recurrence !== undefined ||
      dto.recurrenceUntil !== undefined;
    if (recurrenceEdited) {
      const dueAt = changes.dueAt ?? reminder.dueAt;
      let recurrence = reminder.recurrence;
      let until =
        dto.recurrenceUntil !== undefined
          ? dto.recurrenceUntil
          : (recurrence?.until ?? null);
      if (dto.recurrence === null) {
        recurrence = null;
        if (dto.recurrenceUntil === undefined) until = null;
      } else if (dto.recurrence) {
        recurrence = { ...dto.recurrence, anchorAt: dueAt, until };
      } else if (recurrence) {
        recurrence = {
          ...recurrence,
          anchorAt: changes.dueAt ?? recurrence.anchorAt,
          until,
        };
      }
      const timeZone =
        recurrence && until !== null
          ? ownerTimeZone(await this.pets.findOwnerTimezone(reminder.petId), {
              scope: 'reminders-recurrence',
              petId: reminder.petId,
            })
          : 'UTC';
      assertValidRecurrence(dueAt, recurrence, until, timeZone);
      changes.recurrence = recurrence;
    }

    return this.reminders.reschedule(id, changes, `reminder-${uuidv7()}`);
  }
}
