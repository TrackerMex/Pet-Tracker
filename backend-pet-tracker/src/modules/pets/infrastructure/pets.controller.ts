import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ZodType } from 'zod';
import { CurrentUser } from '@/modules/auth/infrastructure/decorators/current-user.decorator';
import type { CurrentUserPayload } from '@/modules/auth/infrastructure/decorators/current-user.decorator';
import {
  CreatePetDto,
  CreatePetSchema,
} from '@/modules/pets/application/dto/create-pet.dto';
import { CreatePetUseCase } from '@/modules/pets/application/use-cases/create-pet.use-case';
import { ListPetsUseCase } from '@/modules/pets/application/use-cases/list-pets.use-case';
import {
  PetProfileResponse,
  toPetProfileResponse,
} from './mappers/pet-profile-response.mapper';

@Controller('pets')
export class PetsController {
  constructor(
    private readonly createPet: CreatePetUseCase,
    private readonly listPets: ListPetsUseCase,
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
