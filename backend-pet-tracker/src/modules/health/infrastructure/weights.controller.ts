import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ZodType } from 'zod';
import {
  CreateWeightDto,
  CreateWeightSchema,
  ListWeightsQueryDto,
  ListWeightsQuerySchema,
} from '@/modules/health/application/dto/weight.dto';
import { CreateWeightUseCase } from '@/modules/health/application/use-cases/create-weight.use-case';
import { ListWeightsUseCase } from '@/modules/health/application/use-cases/list-weights.use-case';
import { PetAccessGuard } from '@/modules/pets/infrastructure/guards/pet-access.guard';
import type { PetAccessRequest } from '@/modules/pets/infrastructure/guards/pet-access.guard';
import {
  toWeightResponse,
  WeightResponse,
} from './mappers/weight.mapper';

@Controller('pets/:petId/weights')
@UseGuards(PetAccessGuard)
export class WeightsController {
  constructor(
    private readonly createWeight: CreateWeightUseCase,
    private readonly listWeights: ListWeightsUseCase,
  ) {}

  @Post()
  async create(
    @Req() request: PetAccessRequest,
    @Body() body: unknown,
  ): Promise<WeightResponse> {
    const dto = parseBody<CreateWeightDto>(CreateWeightSchema, body);
    return toWeightResponse(
      await this.createWeight.execute(
        request.petMembership.petId,
        dto,
        request.user.id,
      ),
    );
  }

  @Get()
  async list(
    @Req() request: PetAccessRequest,
    @Query() query: unknown,
  ): Promise<WeightResponse[]> {
    const dto = parseQuery<ListWeightsQueryDto>(ListWeightsQuerySchema, query);
    return (
      await this.listWeights.execute(request.petMembership.petId, dto.limit)
    ).map(toWeightResponse);
  }
}

function parseBody<T>(schema: ZodType<T>, body: unknown): T {
  const parsed = schema.safeParse(body);
  if (!parsed.success) throw validationError(parsed.error.issues);
  return parsed.data;
}

function parseQuery<T>(schema: ZodType<T>, query: unknown): T {
  const parsed = schema.safeParse(query);
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
