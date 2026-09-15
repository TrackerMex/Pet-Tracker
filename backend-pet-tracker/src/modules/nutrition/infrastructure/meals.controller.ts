import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ZodType } from 'zod';
import {
  ServeMealDto,
  ServeMealSchema,
} from '@/modules/nutrition/application/dto/meal.dto';
import { ServeMealUseCase } from '@/modules/nutrition/application/use-cases/serve-meal.use-case';
import { UnserveMealUseCase } from '@/modules/nutrition/application/use-cases/unserve-meal.use-case';
import { mapNutritionError } from '@/modules/nutrition/infrastructure/mappers/nutrition-error.mapper';
import {
  MealServingResponse,
  toMealServingResponse,
} from '@/modules/nutrition/infrastructure/mappers/nutrition.mapper';
import { PetAccessGuard } from '@/modules/pets/infrastructure/guards/pet-access.guard';
import type { PetAccessRequest } from '@/modules/pets/infrastructure/guards/pet-access.guard';

@Controller('pets/:petId/meals')
@UseGuards(PetAccessGuard)
export class MealsController {
  constructor(
    private readonly serveMeal: ServeMealUseCase,
    private readonly unserveMeal: UnserveMealUseCase,
  ) {}

  @Post()
  async serve(
    @Req() request: PetAccessRequest,
    @Body() body: unknown,
  ): Promise<MealServingResponse> {
    const dto = parseBody<ServeMealDto>(ServeMealSchema, body);
    const now = new Date();
    try {
      return toMealServingResponse(
        await this.serveMeal.execute(
          request.petMembership.petId,
          dto,
          request.user.id,
          now,
        ),
      );
    } catch (error) {
      throw mapNutritionError(error);
    }
  }

  @Delete(':mealTime')
  @HttpCode(HttpStatus.NO_CONTENT)
  async unserve(
    @Req() request: PetAccessRequest,
    @Param('mealTime') mealTime: string,
  ): Promise<void> {
    const now = new Date();
    try {
      await this.unserveMeal.execute(
        request.petMembership.petId,
        mealTime,
        request.user.id,
        now,
      );
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
