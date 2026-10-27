import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import {
  InvalidRecurrenceError,
  NotReminderOwnerError,
  ReminderNotEditableError,
  ReminderNotFoundError,
} from '@/modules/reminders/domain/errors/reminder.errors';

export function mapReminderError(error: unknown): unknown {
  if (error instanceof ReminderNotFoundError) return new NotFoundException();
  if (error instanceof NotReminderOwnerError) return new ForbiddenException();
  if (error instanceof ReminderNotEditableError) {
    return new ConflictException({
      statusCode: HttpStatus.CONFLICT,
      message: 'Reminder is not editable',
    });
  }
  if (error instanceof InvalidRecurrenceError) {
    return new BadRequestException({
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'Invalid recurrence',
    });
  }
  return error;
}
