import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
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
import type { AuthenticatedRequest } from '@/modules/auth/infrastructure/guards/auth.guard';
import {
  toWeightResponse,
  WeightResponse,
} from './mappers/weight.mapper';

@Controller('pets/:petId/weights')
export class WeightsController {
  constructor(
    private readonly createWeight: CreateWeightUseCase,
    private readonly listWeights: ListWeightsUseCase,
  ) {}

  @Post()
  async create(
    @Param('petId') petId: string,
    @Req() request: AuthenticatedRequest,
    @Body() body: unknown,
  ): Promise<WeightResponse> {
    const dto = parseBody<CreateWeightDto>(CreateWeightSchema, body);
    return toWeightResponse(
      await this.createWeight.execute(petId, dto, request.user.id),
    );
  }

  @Get()
  async list(
    @Param('petId') petId: string,
    @Query() query: unknown,
  ): Promise<WeightResponse[]> {
    const dto = parseQuery<ListWeightsQueryDto>(ListWeightsQuerySchema, query);
    return (await this.listWeights.execute(petId, dto.limit)).map(
      toWeightResponse,
    );
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
