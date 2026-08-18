import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ZodType } from 'zod';
import {
  UpsertNutritionProfileDto,
  UpsertNutritionProfileSchema,
} from '@/modules/nutrition/application/dto/nutrition-profile.dto';
import { UpsertNutritionProfileUseCase } from '@/modules/nutrition/application/use-cases/upsert-nutrition-profile.use-case';
import { GetNutritionProfileUseCase } from '@/modules/nutrition/application/use-cases/get-nutrition-profile.use-case';
import { GenerateNutritionPlanUseCase } from '@/modules/nutrition/application/use-cases/generate-nutrition-plan.use-case';
import { GetNutritionPlanUseCase } from '@/modules/nutrition/application/use-cases/get-nutrition-plan.use-case';
import { mapNutritionError } from '@/modules/nutrition/infrastructure/mappers/nutrition-error.mapper';
import {
  NutritionProfileResponse,
  NutritionPlanResponse,
  toNutritionProfileResponse,
  toNutritionPlanResponse,
} from '@/modules/nutrition/infrastructure/mappers/nutrition.mapper';

@Controller('pets/:petId')
export class NutritionController {
  constructor(
    private readonly upsertProfile: UpsertNutritionProfileUseCase,
    private readonly getProfile: GetNutritionProfileUseCase,
    private readonly generatePlan: GenerateNutritionPlanUseCase,
    private readonly getPlan: GetNutritionPlanUseCase,
  ) {}

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

  @Get('nutrition-profile')
  async get(@Param('petId') petId: string): Promise<NutritionProfileResponse> {
    try {
      return toNutritionProfileResponse(await this.getProfile.execute(petId));
    } catch (error) {
      throw mapNutritionError(error);
    }
  }

  @Post('nutrition-plan/generate')
  @HttpCode(HttpStatus.OK)
  async generate(@Param('petId') petId: string): Promise<NutritionPlanResponse> {
    try {
      return toNutritionPlanResponse(await this.generatePlan.execute(petId));
    } catch (error) {
      throw mapNutritionError(error);
    }
  }

  @Get('nutrition-plan')
  async latestPlan(
    @Param('petId') petId: string,
  ): Promise<NutritionPlanResponse> {
    try {
      return toNutritionPlanResponse(await this.getPlan.execute(petId));
    } catch (error) {
      throw mapNutritionError(error);
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
