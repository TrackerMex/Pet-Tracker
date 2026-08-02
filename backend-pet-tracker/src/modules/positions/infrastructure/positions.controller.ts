import {
  BadRequestException,
  Controller,
  Get,
  HttpStatus,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import { PetAccessGuard } from '@/modules/pets/infrastructure/guards/pet-access.guard';
import type { PetAccessRequest } from '@/modules/pets/infrastructure/guards/pet-access.guard';
import {
  ListPositionsQueryDto,
  ListPositionsQuerySchema,
} from '@/modules/positions/application/dto/list-positions.dto';
import { GetLastPositionUseCase } from '@/modules/positions/application/use-cases/get-last-position.use-case';
import { ListPositionsUseCase } from '@/modules/positions/application/use-cases/list-positions.use-case';
import type { ListPositionsResult } from '@/modules/positions/application/use-cases/list-positions.use-case';
import { mapPositionError } from './mappers/position-error.mapper';

/**
 * GET /v1/pets/:petId/positions/last y GET /v1/pets/:petId/positions (R1-R15).
 * Rutas de solo lectura, ninguna @Public(). El PetAccessGuard existente de
 * #5 aplica tal cual y sin @RequirePetRole: cualquier rol con membresia
 * activa lee posiciones (R12 de #5). Mascota inexistente, malformada o ajena
 * es el 404 generico del guard, antes de tocar Postgres o DynamoDB.
 *
 * `last` se declara antes que la ruta raiz para que el segmento literal no
 * compita con nada.
 */
@Controller('pets/:petId/positions')
@UseGuards(PetAccessGuard)
export class PositionsController {
  constructor(
    private readonly getLastPosition: GetLastPositionUseCase,
    private readonly listPositions: ListPositionsUseCase,
  ) {}

  @Get('last')
  async last(
    @Req() request: PetAccessRequest,
    @Res() response: Response,
  ): Promise<void> {
    // R2: la mascota es la que valido el guard, nunca el :petId crudo.
    const view = await this.getLastPosition.execute(
      request.petMembership.petId,
    );

    // @Res explicito: Nest deja el body vacio cuando el handler devuelve
    // null, y R5 exige el body JSON `null` literal (mismo patron que
    // GET /v1/pets/:petId/device en #7).
    response.json(view);
  }

  @Get()
  async list(@Req() request: PetAccessRequest): Promise<ListPositionsResult> {
    // R7: la query string se valida entera antes de invocar el caso de uso.
    const query = parseQuery(request.query);

    try {
      return await this.listPositions.execute({
        petId: request.petMembership.petId,
        ...query,
      });
    } catch (error) {
      throw mapPositionError(error);
    }
  }
}

/**
 * Validacion explicita en el borde HTTP (mismo patron que pets.controller.ts):
 * el ZodError se mapea a 400 antes de que nada invalido llegue a application.
 */
function parseQuery(query: unknown): ListPositionsQueryDto {
  const result = ListPositionsQuerySchema.safeParse(query);

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
