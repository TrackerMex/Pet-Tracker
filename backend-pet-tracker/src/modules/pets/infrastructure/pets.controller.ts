import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
  NotFoundException,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ZodType } from 'zod';
import { CurrentUser } from '@/modules/auth/infrastructure/decorators/current-user.decorator';
import type { CurrentUserPayload } from '@/modules/auth/infrastructure/decorators/current-user.decorator';
import { PetNotFoundError } from '@/modules/pets/domain/errors/pet.errors';
import {
  CreatePetDto,
  CreatePetSchema,
} from '@/modules/pets/application/dto/create-pet.dto';
import { CreatePetUseCase } from '@/modules/pets/application/use-cases/create-pet.use-case';
import { GetPetUseCase } from '@/modules/pets/application/use-cases/get-pet.use-case';
import { ListPetsUseCase } from '@/modules/pets/application/use-cases/list-pets.use-case';
import { PetAccessGuard } from './guards/pet-access.guard';
import type { PetAccessRequest } from './guards/pet-access.guard';
import {
  PetProfileResponse,
  toPetProfileResponse,
} from './mappers/pet-profile-response.mapper';

@Controller('pets')
export class PetsController {
  constructor(
    private readonly createPet: CreatePetUseCase,
    private readonly listPets: ListPetsUseCase,
    private readonly getPet: GetPetUseCase,
  ) {}

  @Post()
  async create(
    @CurrentUser() user: CurrentUserPayload,
    @Body() body: unknown,
  ): Promise<PetProfileResponse> {
    const dto = parseBody<CreatePetDto>(CreatePetSchema, body);
    const pet = await this.createPet.execute(dto, user.id);

    // R2: el creador siempre queda como owner de su mascota recien creada.
    return toPetProfileResponse(pet, 'owner');
  }

  @Get()
  async list(
    @CurrentUser() user: CurrentUserPayload,
  ): Promise<PetProfileResponse[]> {
    const memberships = await this.listPets.execute(user.id);
    const now = new Date();

    return memberships.map(({ pet, role }) =>
      toPetProfileResponse(pet, role, now),
    );
  }

  // R12: sin @RequirePetRole — cualquier rol con membresia activa accede.
  @Get(':petId')
  @UseGuards(PetAccessGuard)
  async detail(@Req() request: PetAccessRequest): Promise<PetProfileResponse> {
    const { petId, role } = request.petMembership;

    try {
      return toPetProfileResponse(await this.getPet.execute(petId), role);
    } catch (error) {
      throw mapPetError(error);
    }
  }
}

/**
 * R9 (caso borde): la fila desaparecio entre el guard y el use case — el
 * error de dominio se traduce al mismo 404 generico que emite el guard.
 */
function mapPetError(error: unknown): unknown {
  return error instanceof PetNotFoundError ? new NotFoundException() : error;
}

/**
 * Validacion explicita en el borde HTTP (mismo patron que
 * users.controller.ts): el ZodError se mapea a 400 antes de invocar el use
 * case — nada invalido llega a la capa application (R4).
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
