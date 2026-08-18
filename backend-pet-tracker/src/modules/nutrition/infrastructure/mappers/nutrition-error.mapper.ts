import {
  HttpStatus,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import {
  NutritionProfileNotFoundError,
  NutritionProfileRequiredError,
} from '@/modules/nutrition/domain/errors/nutrition.errors';

export function mapNutritionError(error: unknown): unknown {
  if (error instanceof NutritionProfileNotFoundError) {
    return new NotFoundException({
      statusCode: HttpStatus.NOT_FOUND,
      code: 'NUTRITION_PROFILE_NOT_FOUND',
      message: 'Nutrition profile not found',
    });
  }

  if (error instanceof NutritionProfileRequiredError) {
    return new UnprocessableEntityException({
      statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      code: 'NUTRITION_PROFILE_REQUIRED',
      message: 'Create a nutrition profile before generating a plan',
    });
  }

  return error;
}
