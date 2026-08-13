import { ForbiddenException, NotFoundException } from '@nestjs/common';
import {
  NotReminderOwnerError,
  ReminderNotFoundError,
} from '@/modules/reminders/domain/errors/reminder.errors';

export function mapReminderError(error: unknown): unknown {
  if (error instanceof ReminderNotFoundError) return new NotFoundException();
  if (error instanceof NotReminderOwnerError) return new ForbiddenException();
  return error;
}
