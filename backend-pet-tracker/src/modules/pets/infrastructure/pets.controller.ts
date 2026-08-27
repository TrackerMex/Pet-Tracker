import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ZodType } from 'zod';
import { toDeviceStatusResponse } from '@/modules/devices/infrastructure/mappers/device-status.mapper';
import { CurrentUser } from '@/modules/auth/infrastructure/decorators/current-user.decorator';
import type { CurrentUserPayload } from '@/modules/auth/infrastructure/decorators/current-user.decorator';
import { PetNotFoundError } from '@/modules/pets/domain/errors/pet.errors';
import {
  CreatePetDto,
  CreatePetSchema,
} from '@/modules/pets/application/dto/create-pet.dto';
import {
  UpdatePetDto,
  UpdatePetSchema,
} from '@/modules/pets/application/dto/update-pet.dto';
import { CreatePetUseCase } from '@/modules/pets/application/use-cases/create-pet.use-case';
import { DeletePetUseCase } from '@/modules/pets/application/use-cases/delete-pet.use-case';
import { GetPetUseCase } from '@/modules/pets/application/use-cases/get-pet.use-case';
import { ListPetsUseCase } from '@/modules/pets/application/use-cases/list-pets.use-case';
import { SetLostModeUseCase } from '@/modules/pets/application/use-cases/set-lost-mode.use-case';
import { UpdatePetUseCase } from '@/modules/pets/application/use-cases/update-pet.use-case';
import { RequirePetRole } from './decorators/require-pet-role.decorator';
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
    private readonly updatePet: UpdatePetUseCase,
    private readonly deletePet: DeletePetUseCase,
    private readonly setLostMode: SetLostModeUseCase,
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
      // devices-claim (#7) R12: mismo mapper de estado de device que el
      // claim y GET .../device — la forma del contrato no cambia.
      // pet-photos-s3 (#6) R6/R7: photoUrl ya viene resuelto (o null).
      const { pet, device, photoUrl, nextVaccine } =
        await this.getPet.execute(petId);

      return toPetProfileResponse(
        pet,
        role,
        new Date(),
        device ? toDeviceStatusResponse(device) : null,
        photoUrl,
        nextVaccine,
      );
    } catch (error) {
      throw mapPetError(error);
    }
  }

  @Patch(':petId')
  @UseGuards(PetAccessGuard)
  @RequirePetRole('owner')
  async update(
    @Req() request: PetAccessRequest,
    @Body() body: unknown,
  ): Promise<PetProfileResponse> {
    // R13: la validacion completa corre antes del use case — un campo
    // invalido rechaza el body entero sin persistir nada.
    const dto = parseBody<UpdatePetDto>(UpdatePetSchema, body);
    const { petId, role } = request.petMembership;

    try {
      return toPetProfileResponse(
        await this.updatePet.execute(petId, request.user.id, dto),
        role,
      );
    } catch (error) {
      throw mapPetError(error);
    }
  }

  @Post(':petId/lost-mode')
  @HttpCode(HttpStatus.OK)
  @UseGuards(PetAccessGuard)
  @RequirePetRole('owner')
  async updateLostMode(
    @Req() request: PetAccessRequest,
    @Body() body: { enabled: boolean },
  ): Promise<PetProfileResponse> {
    const { petId, role } = request.petMembership;

    try {
      return toPetProfileResponse(
        await this.setLostMode.execute(petId, request.user.id, body.enabled),
        role,
      );
    } catch (error) {
      throw mapPetError(error);
    }
  }

  // R16: 204 sin body; el cascade de pet_users borra las membresias.
  @Delete(':petId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(PetAccessGuard)
  @RequirePetRole('owner')
  async remove(@Req() request: PetAccessRequest): Promise<void> {
    await this.deletePet.execute(request.petMembership.petId, request.user.id);
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
