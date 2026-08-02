import {
  BadRequestException,
  Body,
  Controller,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ZodType } from 'zod';
import { CurrentUser } from '@/modules/auth/infrastructure/decorators/current-user.decorator';
import type { CurrentUserPayload } from '@/modules/auth/infrastructure/decorators/current-user.decorator';
import {
  ClaimDeviceDto,
  ClaimDeviceSchema,
} from '@/modules/devices/application/dto/claim-device.dto';
import { ClaimDeviceUseCase } from '@/modules/devices/application/use-cases/claim-device.use-case';
import { mapDeviceError } from './mappers/device-error.mapper';
import {
  DeviceStatusResponse,
  toDeviceStatusResponse,
} from './mappers/device-status.mapper';

/**
 * POST /v1/devices/claim (R3-R10). Sin PetAccessGuard: la ruta no lleva
 * :petId (decision D1) — la autorizacion por mascota corre dentro de
 * ClaimDeviceUseCase con la misma semantica 404 -> 403 del guard.
 */
@Controller('devices')
export class DevicesController {
  constructor(private readonly claimDevice: ClaimDeviceUseCase) {}

  @Post('claim')
  async claim(
    @CurrentUser() user: CurrentUserPayload,
    @Body() body: unknown,
  ): Promise<DeviceStatusResponse> {
    // R4: la validacion completa corre antes del use case — un body
    // invalido no toca ninguna tabla.
    const dto = parseBody<ClaimDeviceDto>(ClaimDeviceSchema, body);

    try {
      return toDeviceStatusResponse(await this.claimDevice.execute(dto, user.id));
    } catch (error) {
      throw mapDeviceError(error);
    }
  }
}

/**
 * Validacion explicita en el borde HTTP (mismo patron que
 * pets.controller.ts): el ZodError se mapea a 400 antes de invocar el use
 * case (R4).
 */
function parseBody<T>(schema: ZodType<T>, body: unknown): T {
  const result = schema.safeParse(body);

  if (!result.success) {
    throw new BadRequestException({
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'Validation failed',
      errors: result.error.issues.map((issue) => ({
        path: issue.path.join('.'),
        message: issue.message,
      })),
    });
  }

  return result.data;
}
