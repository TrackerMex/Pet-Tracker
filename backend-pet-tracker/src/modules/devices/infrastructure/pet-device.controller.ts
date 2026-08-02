import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import { GetPetDeviceUseCase } from '@/modules/devices/application/use-cases/get-pet-device.use-case';
import { ReleaseDeviceUseCase } from '@/modules/devices/application/use-cases/release-device.use-case';
import { RequirePetRole } from '@/modules/pets/infrastructure/decorators/require-pet-role.decorator';
import { PetAccessGuard } from '@/modules/pets/infrastructure/guards/pet-access.guard';
import type { PetAccessRequest } from '@/modules/pets/infrastructure/guards/pet-access.guard';
import { mapDeviceError } from './mappers/device-error.mapper';
import { toDeviceStatusResponse } from './mappers/device-status.mapper';

/**
 * GET/DELETE /v1/pets/:petId/device (R11, R13, R14). Ruta con :petId — el
 * PetAccessGuard existente de #5 aplica tal cual: mascota inexistente,
 * malformada o sin membresia activa es el 404 generico del guard.
 */
@Controller('pets/:petId/device')
@UseGuards(PetAccessGuard)
export class PetDeviceController {
  constructor(
    private readonly getPetDevice: GetPetDeviceUseCase,
    private readonly releaseDevice: ReleaseDeviceUseCase,
  ) {}

  // R11: sin @RequirePetRole — cualquier rol con membresia activa accede.
  @Get()
  async detail(
    @Req() request: PetAccessRequest,
    @Res() response: Response,
  ): Promise<void> {
    const device = await this.getPetDevice.execute(request.petMembership.petId);

    // @Res explicito: Nest deja el body vacio cuando el handler devuelve
    // null, y el contrato de R11 exige body JSON `null` literal.
    response.json(device ? toDeviceStatusResponse(device) : null);
  }

  // R13/R14: solo el owner libera; el 404 de membresia del guard precede
  // siempre a este 403 (semantica heredada de #5).
  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePetRole('owner')
  async release(@Req() request: PetAccessRequest): Promise<void> {
    try {
      await this.releaseDevice.execute(
        request.petMembership.petId,
        request.user.id,
      );
    } catch (error) {
      throw mapDeviceError(error);
    }
  }
}
