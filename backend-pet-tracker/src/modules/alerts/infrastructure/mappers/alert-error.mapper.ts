import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import {
  AlertAlreadyClosedError,
  AlertNotFoundError,
  InvalidAlertCursorError,
} from '@/modules/alerts/domain/errors/alert.errors';

/** Tabla error de dominio -> HTTP de specs/alerts-center-notifier/design.md. */
export function mapAlertError(error: unknown): unknown {
  if (error instanceof AlertNotFoundError) {
    return new NotFoundException({
      statusCode: HttpStatus.NOT_FOUND,
      code: 'ALERT_NOT_FOUND',
      message: 'Alert not found',
    });
  }

  if (error instanceof AlertAlreadyClosedError) {
    return new ConflictException({
      statusCode: HttpStatus.CONFLICT,
      code: 'ALERT_ALREADY_CLOSED',
      message: 'Alert is already closed',
    });
  }

  if (error instanceof InvalidAlertCursorError) {
    return new BadRequestException({
      statusCode: HttpStatus.BAD_REQUEST,
      code: 'INVALID_CURSOR',
      message: 'Cursor is not valid for this request',
    });
  }

  return error;
}
