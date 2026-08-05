import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ZodType } from 'zod';
import { RequirePetRole } from '@/modules/pets/infrastructure/decorators/require-pet-role.decorator';
import { PetAccessGuard } from '@/modules/pets/infrastructure/guards/pet-access.guard';
import type { PetAccessRequest } from '@/modules/pets/infrastructure/guards/pet-access.guard';
import {
  CreateGeofenceDto,
  CreateGeofenceSchema,
  UpdateGeofenceDto,
  UpdateGeofenceSchema,
} from '../application/dto/create-geofence.dto';
import { CreateGeofenceUseCase } from '../application/use-cases/create-geofence.use-case';
import { DeleteGeofenceUseCase } from '../application/use-cases/delete-geofence.use-case';
import { GetGeofenceUseCase } from '../application/use-cases/get-geofence.use-case';
import { ListGeofencesUseCase } from '../application/use-cases/list-geofences.use-case';
import { UpdateGeofenceUseCase } from '../application/use-cases/update-geofence.use-case';
import { mapGeofenceError } from './mappers/geofence-error.mapper';
import { toGeofenceResponse } from './mappers/geofence-response.mapper';
import type { GeofenceResponse } from './mappers/geofence-response.mapper';

/**
 * CRUD /v1/pets/:petId/geofences (R2-R15). Guard a nivel de clase (D4):
 * las cinco rutas llevan :petId, mismo patron que PetDeviceController (#7).
 * @RequirePetRole('owner') en las mutaciones; GET (list y detail) sin
 * decorador — cualquier rol con membresia activa lee.
 */
@Controller('pets/:petId/geofences')
@UseGuards(PetAccessGuard)
export class GeofencesController {
  constructor(
    private readonly createGeofence: CreateGeofenceUseCase,
    private readonly listGeofences: ListGeofencesUseCase,
    private readonly getGeofence: GetGeofenceUseCase,
    private readonly updateGeofence: UpdateGeofenceUseCase,
    private readonly deleteGeofence: DeleteGeofenceUseCase,
  ) {}

  @Post()
  @RequirePetRole('owner')
  async create(
    @Req() request: PetAccessRequest,
    @Body() body: unknown,
  ): Promise<GeofenceResponse> {
    const dto = parseBody<CreateGeofenceDto>(CreateGeofenceSchema, body);

    try {
      const geofence = await this.createGeofence.execute(
        request.petMembership.petId,
        dto,
        request.user.id,
      );

      return toGeofenceResponse(geofence);
    } catch (error) {
      throw mapGeofenceError(error);
    }
  }

  // R8: sin @RequirePetRole — cualquier rol con membresia activa lee.
  @Get()
  async list(@Req() request: PetAccessRequest): Promise<GeofenceResponse[]> {
    const geofences = await this.listGeofences.execute(
      request.petMembership.petId,
    );

    return geofences.map(toGeofenceResponse);
  }

  // R9: sin @RequirePetRole.
  @Get(':geofenceId')
  async detail(
    @Req() request: PetAccessRequest,
    @Param('geofenceId') geofenceId: string,
  ): Promise<GeofenceResponse> {
    try {
      const geofence = await this.getGeofence.execute(
        request.petMembership.petId,
        geofenceId,
      );

      return toGeofenceResponse(geofence);
    } catch (error) {
      throw mapGeofenceError(error);
    }
  }

  @Patch(':geofenceId')
  @RequirePetRole('owner')
  async update(
    @Req() request: PetAccessRequest,
    @Param('geofenceId') geofenceId: string,
    @Body() body: unknown,
  ): Promise<GeofenceResponse> {
    const dto = parseBody<UpdateGeofenceDto>(UpdateGeofenceSchema, body);

    try {
      const geofence = await this.updateGeofence.execute(
        request.petMembership.petId,
        geofenceId,
        request.user.id,
        dto,
      );

      return toGeofenceResponse(geofence);
    } catch (error) {
      throw mapGeofenceError(error);
    }
  }

  @Delete(':geofenceId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePetRole('owner')
  async remove(
    @Req() request: PetAccessRequest,
    @Param('geofenceId') geofenceId: string,
  ): Promise<void> {
    try {
      await this.deleteGeofence.execute(
        request.petMembership.petId,
        geofenceId,
        request.user.id,
      );
    } catch (error) {
      throw mapGeofenceError(error);
    }
  }
}

/** Mismo patron que pets.controller.ts: ZodError -> 400 en el borde HTTP. */
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
