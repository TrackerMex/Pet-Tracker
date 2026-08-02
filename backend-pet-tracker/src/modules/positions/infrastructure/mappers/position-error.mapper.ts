import { BadRequestException, HttpStatus } from '@nestjs/common';
import {
  InvalidCursorError,
  InvalidRangeError,
  RangeTooLargeError,
} from '@/modules/positions/domain/errors/position.errors';

/**
 * Tabla error de dominio -> HTTP de specs/positions-api/design.md. Los tres
 * son 400 con `code` para que el cliente distinga el motivo. El 404 de
 * mascota inexistente o ajena no aparece aqui: lo produce PetAccessGuard
 * antes de entrar al handler (R1).
 */
export function mapPositionError(error: unknown): unknown {
  if (error instanceof InvalidRangeError) {
    return badRequest('INVALID_RANGE', 'from must be strictly before to');
  }

  if (error instanceof RangeTooLargeError) {
    return badRequest(
      'RANGE_TOO_LARGE',
      'Requested range exceeds the maximum window',
    );
  }

  if (error instanceof InvalidCursorError) {
    return badRequest('INVALID_CURSOR', 'Cursor is not valid for this request');
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
