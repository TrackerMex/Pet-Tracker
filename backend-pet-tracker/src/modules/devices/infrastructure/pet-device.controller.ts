import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import type { Response } from 'express';
import { GetPetDeviceUseCase } from '@/modules/devices/application/use-cases/get-pet-device.use-case';
import { PetAccessGuard } from '@/modules/pets/infrastructure/guards/pet-access.guard';
import type { PetAccessRequest } from '@/modules/pets/infrastructure/guards/pet-access.guard';
import { toDeviceStatusResponse } from './mappers/device-status.mapper';

/**
 * GET/DELETE /v1/pets/:petId/device (R11, R13, R14). Ruta con :petId — el
 * PetAccessGuard existente de #5 aplica tal cual: mascota inexistente,
 * malformada o sin membresia activa es el 404 generico del guard.
 */
@Controller('pets/:petId/device')
@UseGuards(PetAccessGuard)
export class PetDeviceController {
  constructor(private readonly getPetDevice: GetPetDeviceUseCase) {}

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
}
