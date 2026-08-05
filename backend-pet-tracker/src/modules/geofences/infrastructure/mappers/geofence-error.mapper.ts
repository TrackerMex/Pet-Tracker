import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import {
  GeofenceNameTakenError,
  GeofenceNotFoundError,
  MaxGeofencesReachedError,
} from '@/modules/geofences/domain/errors/geofence.errors';

/** Tabla error de dominio -> HTTP de specs/geofences-crud/design.md. */
export function mapGeofenceError(error: unknown): unknown {
  if (error instanceof MaxGeofencesReachedError) {
    return new BadRequestException({
      statusCode: HttpStatus.BAD_REQUEST,
      code: 'MAX_GEOFENCES_REACHED',
      message: 'Pet already has the maximum number of geofences',
    });
  }

  if (error instanceof GeofenceNameTakenError) {
    return new ConflictException({
      statusCode: HttpStatus.CONFLICT,
      code: 'GEOFENCE_NAME_TAKEN',
      message: 'Geofence name already exists for this pet',
    });
  }

  if (error instanceof GeofenceNotFoundError) {
    return new NotFoundException({
      statusCode: HttpStatus.NOT_FOUND,
      code: 'GEOFENCE_NOT_FOUND',
      message: 'Geofence not found',
    });
  }

  return error;
}
