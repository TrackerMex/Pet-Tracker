import {
  BadRequestException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import {
  InvalidDateError,
  InvalidRangeError,
  InvalidTripIndexError,
  RangeTooLargeError,
  TripNotFoundError,
} from '@/modules/activity/domain/errors/activity.errors';

/**
 * Tabla error de dominio -> HTTP de specs/trips-activity/design.md (R17, R19).
 * El 404 de mascota inexistente o ajena no aparece aqui: lo produce
 * PetAccessGuard antes de entrar al handler y NO lleva `code`, que es como
 * el cliente lo distingue del 404 de TRIP_NOT_FOUND.
 */
export function mapActivityError(error: unknown): unknown {
  if (error instanceof InvalidDateError) {
    return badRequest('INVALID_DATE', 'Dates must be calendar days YYYY-MM-DD');
  }

  if (error instanceof InvalidRangeError) {
    return badRequest('INVALID_RANGE', 'from must not be after to');
  }

  if (error instanceof RangeTooLargeError) {
    return badRequest(
      'RANGE_TOO_LARGE',
      'Requested range exceeds the maximum window',
    );
  }

  if (error instanceof InvalidTripIndexError) {
    return badRequest(
      'INVALID_TRIP_INDEX',
      'Trip index must be an integer greater than or equal to 0',
    );
  }

  if (error instanceof TripNotFoundError) {
    return new NotFoundException({
      statusCode: HttpStatus.NOT_FOUND,
      code: 'TRIP_NOT_FOUND',
      message: 'No trip with that index on the requested day',
    });
  }

  return error;
}

function badRequest(code: string, message: string): BadRequestException {
  return new BadRequestException({
    statusCode: HttpStatus.BAD_REQUEST,
    code,
    message,
  });
}
