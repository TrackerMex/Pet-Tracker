import { HttpStatus, NotFoundException } from '@nestjs/common';
import { NutritionProfileNotFoundError } from '@/modules/nutrition/domain/errors/nutrition.errors';

export function mapNutritionError(error: unknown): unknown {
  if (error instanceof NutritionProfileNotFoundError) {
    return new NotFoundException({
      statusCode: HttpStatus.NOT_FOUND,
      code: 'NUTRITION_PROFILE_NOT_FOUND',
      message: 'Nutrition profile not found',
    });
  }

  return error;
}
