import {
  BadRequestException,
  Controller,
  Get,
  HttpStatus,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ListTripsQueryDto,
  ListTripsQuerySchema,
} from '@/modules/activity/application/dto/list-trips.dto';
import { ListTripsUseCase } from '@/modules/activity/application/use-cases/list-trips.use-case';
import type {
  GetTripResult,
  ListTripsResult,
} from '@/modules/activity/application/use-cases/list-trips.use-case';
import { PetAccessGuard } from '@/modules/pets/infrastructure/guards/pet-access.guard';
import type { PetAccessRequest } from '@/modules/pets/infrastructure/guards/pet-access.guard';
import { PetTrackingGuard } from '@/modules/subscriptions/infrastructure/guards/pet-tracking.guard';
import { mapActivityError } from './mappers/activity-error.mapper';

/**
 * GET /v1/pets/:petId/trips y GET /v1/pets/:petId/trips/:n (R16, R18, R19).
 * Rutas de solo lectura, ninguna @Public(). El PetAccessGuard existente de
 * #5 aplica tal cual y sin @RequirePetRole: cualquier rol con membresia
 * activa lee. Mascota inexistente, malformada o ajena es el 404 generico del
 * guard, antes de tocar Postgres o DynamoDB.
 */
@Controller('pets/:petId/trips')
@UseGuards(PetAccessGuard, PetTrackingGuard)
export class TripsController {
  constructor(private readonly listTrips: ListTripsUseCase) {}

  @Get()
  async list(@Req() request: PetAccessRequest): Promise<ListTripsResult> {
    const query = parseTripsQuery(request.query);

    try {
      return await this.listTrips.execute({
        // La mascota es la que valido el guard, nunca el :petId crudo.
        petId: request.petMembership.petId,
        ...query,
      });
    } catch (error) {
      throw mapActivityError(error);
    }
  }

  @Get(':n')
  async one(
    @Req() request: PetAccessRequest,
    @Param('n') n: string,
  ): Promise<GetTripResult> {
    const query = parseTripsQuery(request.query);

    try {
      return await this.listTrips.executeOne(
        { petId: request.petMembership.petId, ...query },
        n,
      );
    } catch (error) {
      throw mapActivityError(error);
    }
  }
}

/**
 * Validacion explicita en el borde HTTP (mismo patron que #9): el ZodError
 * se mapea a 400 antes de que nada invalido llegue a application.
 */
export function parseTripsQuery(query: unknown): ListTripsQueryDto {
  const result = ListTripsQuerySchema.safeParse(query);

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
