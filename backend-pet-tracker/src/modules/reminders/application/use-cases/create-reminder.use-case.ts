import { Inject, Injectable } from '@nestjs/common';
import { uuidv7 } from 'uuidv7';
import { assertValidRecurrence } from '../recurrence';
import { ownerTimeZone } from '@/modules/pets/application/owner-local-day';
import {
  PET_REPOSITORY,
  type PetRepository,
} from '@/modules/pets/domain/repositories/pet.repository';
import { CreateReminderDto } from '@/modules/reminders/application/dto/reminder.dto';
import { Reminder } from '@/modules/reminders/domain/entities/reminder.entity';
import { REMINDER_REPOSITORY } from '@/modules/reminders/domain/repositories/reminder.repository';
import type { ReminderRepository } from '@/modules/reminders/domain/repositories/reminder.repository';

@Injectable()
export class CreateReminderUseCase {
  constructor(
    @Inject(REMINDER_REPOSITORY)
    private readonly reminders: ReminderRepository,
    @Inject(PET_REPOSITORY) private readonly pets: PetRepository,
  ) {}

  async execute(
    petId: string,
    dto: CreateReminderDto,
    userId: string,
  ): Promise<Reminder> {
    const dueAt = new Date(dto.dueAt);
    const timeZone =
      dto.recurrence && dto.recurrenceUntil != null
        ? ownerTimeZone(await this.pets.findOwnerTimezone(petId), {
            scope: 'reminders-recurrence',
            petId,
          })
        : 'UTC';
    assertValidRecurrence(
      dueAt,
      dto.recurrence ?? null,
      dto.recurrenceUntil ?? null,
      timeZone,
    );
    return this.reminders.create({
      petId,
      type: dto.type,
      title: dto.title,
      dueAt,
      advanceMinutes: dto.advanceMinutes ?? 60,
      channel: 'push',
      status: 'scheduled',
      scheduleName: `reminder-${uuidv7()}`,
      enqueuedAt: null,
      createdBy: userId,
      recurrence: dto.recurrence
        ? {
            ...dto.recurrence,
            anchorAt: dueAt,
            until: dto.recurrenceUntil ?? null,
          }
        : null,
    });
  }
}
