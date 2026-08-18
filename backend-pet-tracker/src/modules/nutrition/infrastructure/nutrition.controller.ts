import {
  BadRequestException,
  Body,
  Controller,
  HttpStatus,
  Param,
  Put,
} from '@nestjs/common';
import { ZodType } from 'zod';
import {
  UpsertNutritionProfileDto,
  UpsertNutritionProfileSchema,
} from '@/modules/nutrition/application/dto/nutrition-profile.dto';
import { UpsertNutritionProfileUseCase } from '@/modules/nutrition/application/use-cases/upsert-nutrition-profile.use-case';
import {
  NutritionProfileResponse,
  toNutritionProfileResponse,
} from '@/modules/nutrition/infrastructure/mappers/nutrition.mapper';

@Controller('pets/:petId')
export class NutritionController {
  constructor(private readonly upsertProfile: UpsertNutritionProfileUseCase) {}

  @Put('nutrition-profile')
  async upsert(
    @Param('petId') petId: string,
    @Body() body: unknown,
  ): Promise<NutritionProfileResponse> {
    const dto = parseBody<UpsertNutritionProfileDto>(
      UpsertNutritionProfileSchema,
      body,
    );
    return toNutritionProfileResponse(
      await this.upsertProfile.execute(petId, dto),
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
