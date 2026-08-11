import {
  BadRequestException,
  Body,
  Controller,
  HttpStatus,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { ZodType } from 'zod';
import {
  CreateWeightDto,
  CreateWeightSchema,
} from '@/modules/health/application/dto/weight.dto';
import { CreateWeightUseCase } from '@/modules/health/application/use-cases/create-weight.use-case';
import type { AuthenticatedRequest } from '@/modules/auth/infrastructure/guards/auth.guard';
import {
  toWeightResponse,
  WeightResponse,
} from './mappers/weight.mapper';

@Controller('pets/:petId/weights')
export class WeightsController {
  constructor(private readonly createWeight: CreateWeightUseCase) {}

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
