import {
  ConflictException,
  HttpStatus,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import {
  MealAlreadyServedError,
  MealServingNotFoundError,
  MealTimeNotInPlanError,
  NutritionPlanNotFoundError,
  NutritionPlanRequiredError,
  NutritionProfileNotFoundError,
  NutritionProfileRequiredError,
  PetWeightRequiredError,
} from '@/modules/nutrition/domain/errors/nutrition.errors';

export function mapNutritionError(error: unknown): unknown {
  if (error instanceof NutritionPlanRequiredError) {
    return new UnprocessableEntityException({
      statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      code: 'NUTRITION_PLAN_REQUIRED',
      message: 'Generate a nutrition plan before serving meals',
    });
  }

  if (error instanceof MealTimeNotInPlanError) {
    return new UnprocessableEntityException({
      statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      code: 'MEAL_TIME_NOT_IN_PLAN',
      message: 'mealTime is not part of the current nutrition plan',
    });
  }

  if (error instanceof MealAlreadyServedError) {
    return new ConflictException({
      statusCode: HttpStatus.CONFLICT,
      code: 'MEAL_ALREADY_SERVED',
      message: 'Meal already served today',
    });
  }

  if (error instanceof MealServingNotFoundError) {
    return new NotFoundException({
      statusCode: HttpStatus.NOT_FOUND,
      code: 'MEAL_SERVING_NOT_FOUND',
      message: 'Meal serving not found for today',
    });
  }

  if (error instanceof NutritionPlanNotFoundError) {
    return new NotFoundException({
      statusCode: HttpStatus.NOT_FOUND,
      code: 'NUTRITION_PLAN_NOT_FOUND',
      message: 'Nutrition plan not found',
    });
  }

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

  if (error instanceof PetWeightRequiredError) {
    return new UnprocessableEntityException({
      statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      code: 'PET_WEIGHT_REQUIRED',
      message: 'Register a current weight before generating a plan',
    });
  }

  return error;
}
