import {
  ConflictException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import {
  DeviceAlreadyAssignedError,
  DeviceNotAssignedError,
  DeviceNotFoundError,
  InsufficientPetRoleError,
  PetAlreadyHasDeviceError,
  PetNotAccessibleError,
} from '@/modules/devices/domain/errors/device.errors';
import {
  DEVICE_SUBSCRIPTION_REQUIRED,
  DeviceNotSubscribedError,
} from '@/modules/subscriptions/domain/errors/subscription.errors';

/**
 * Tabla error de dominio -> HTTP de specs/devices-claim/design.md. El 404
 * de PetNotAccessibleError es el NotFoundException() generico — mismo body
 * que PetAccessGuard, sin codigo (R5); los demas llevan `code` para que el
 * cliente distinga el motivo (R7-R9, R14).
 */
export function mapDeviceError(error: unknown): unknown {
  if (error instanceof PetNotAccessibleError) {
    return new NotFoundException();
  }

  if (error instanceof InsufficientPetRoleError) {
    return new ForbiddenException();
  }

  if (error instanceof DeviceNotFoundError) {
    return new NotFoundException({
      statusCode: HttpStatus.NOT_FOUND,
      code: 'DEVICE_NOT_FOUND',
      message: 'Device not found',
    });
  }

  if (error instanceof DeviceAlreadyAssignedError) {
    return new ConflictException({
      statusCode: HttpStatus.CONFLICT,
      code: 'DEVICE_ALREADY_ASSIGNED',
      message: 'Device is not claimable',
    });
  }

  if (error instanceof PetAlreadyHasDeviceError) {
    return new ConflictException({
      statusCode: HttpStatus.CONFLICT,
      code: 'PET_ALREADY_HAS_DEVICE',
      message: 'Pet already has an active device',
    });
  }

  if (error instanceof DeviceNotSubscribedError) {
    return new HttpException(
      {
        statusCode: HttpStatus.PAYMENT_REQUIRED,
        code: DEVICE_SUBSCRIPTION_REQUIRED,
        message: 'Pet tracking requires an active device subscription',
      },
      HttpStatus.PAYMENT_REQUIRED,
    );
  }

  if (error instanceof DeviceNotAssignedError) {
    return new NotFoundException({
      statusCode: HttpStatus.NOT_FOUND,
      code: 'DEVICE_NOT_ASSIGNED',
      message: 'Pet has no active device',
    });
  }

  return error;
}
