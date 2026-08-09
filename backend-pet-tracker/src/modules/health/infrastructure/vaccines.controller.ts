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
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ZodType } from 'zod';
import {
  CreateVaccineDto,
  CreateVaccineSchema,
  UpdateVaccineDto,
  UpdateVaccineSchema,
  VaccineSpeciesSchema,
} from '@/modules/health/application/dto/vaccine.dto';
import { CreateVaccineUseCase } from '@/modules/health/application/use-cases/create-vaccine.use-case';
import { DeleteVaccineUseCase } from '@/modules/health/application/use-cases/delete-vaccine.use-case';
import { ListVaccineCatalogUseCase } from '@/modules/health/application/use-cases/list-vaccine-catalog.use-case';
import { ListVaccinesUseCase } from '@/modules/health/application/use-cases/list-vaccines.use-case';
import { UpdateVaccineUseCase } from '@/modules/health/application/use-cases/update-vaccine.use-case';
import { RequirePetRole } from '@/modules/pets/infrastructure/decorators/require-pet-role.decorator';
import { PetAccessGuard } from '@/modules/pets/infrastructure/guards/pet-access.guard';
import type { PetAccessRequest } from '@/modules/pets/infrastructure/guards/pet-access.guard';
import { mapVaccineError } from './mappers/vaccine-error.mapper';
import { toVaccineResponse, VaccineResponse } from './mappers/vaccine.mapper';

@Controller('vaccine-catalog')
export class VaccineCatalogController {
  constructor(private readonly listCatalog: ListVaccineCatalogUseCase) {}

  @Get()
  list(@Query('species') species: unknown) {
    const parsed = VaccineSpeciesSchema.safeParse(species);
    if (!parsed.success) throw validationError(parsed.error.issues);
    return this.listCatalog.execute(parsed.data);
  }
}

@Controller('pets/:petId/vaccines')
@UseGuards(PetAccessGuard)
export class VaccinesController {
  constructor(
    private readonly createVaccine: CreateVaccineUseCase,
    private readonly listVaccines: ListVaccinesUseCase,
    private readonly updateVaccine: UpdateVaccineUseCase,
    private readonly deleteVaccine: DeleteVaccineUseCase,
  ) {}

  @Post()
  @RequirePetRole('owner')
  async create(
    @Req() request: PetAccessRequest,
    @Body() body: unknown,
  ): Promise<VaccineResponse> {
    const dto = parseBody<CreateVaccineDto>(CreateVaccineSchema, body);
    try {
      return toVaccineResponse(
        await this.createVaccine.execute(
          request.petMembership.petId,
          dto,
          request.user.id,
        ),
      );
    } catch (error) {
      throw mapVaccineError(error);
    }
  }

  @Get()
  async list(@Req() request: PetAccessRequest): Promise<VaccineResponse[]> {
    return (await this.listVaccines.execute(request.petMembership.petId)).map(
      toVaccineResponse,
    );
  }

  @Patch(':vaccineId')
  @RequirePetRole('owner')
  async update(
    @Req() request: PetAccessRequest,
    @Param('vaccineId') id: string,
    @Body() body: unknown,
  ): Promise<VaccineResponse> {
    const dto = parseBody<UpdateVaccineDto>(UpdateVaccineSchema, body);
    try {
      return toVaccineResponse(
        await this.updateVaccine.execute(
          request.petMembership.petId,
          id,
          dto,
          request.user.id,
        ),
      );
    } catch (error) {
      throw mapVaccineError(error);
    }
  }

  @Delete(':vaccineId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePetRole('owner')
  async remove(
    @Req() request: PetAccessRequest,
    @Param('vaccineId') id: string,
  ): Promise<void> {
    try {
      await this.deleteVaccine.execute(
        request.petMembership.petId,
        id,
        request.user.id,
      );
    } catch (error) {
      throw mapVaccineError(error);
    }
  }
}

function parseBody<T>(schema: ZodType<T>, body: unknown): T {
  const parsed = schema.safeParse(body);
  if (!parsed.success) throw validationError(parsed.error.issues);
  return parsed.data;
}

function validationError(
  issues: ReadonlyArray<{ path: PropertyKey[]; message: string }>,
) {
  return new BadRequestException({
    statusCode: HttpStatus.BAD_REQUEST,
    message: 'Validation failed',
    errors: issues.map((issue) => ({
      path: issue.path.join('.'),
      message: issue.message,
    })),
  });
}
