import type { MealServing } from '@/modules/nutrition/domain/entities/meal-serving.entity';

export const MEAL_SERVING_REPOSITORY = Symbol('MealServingRepository');

export interface NewMealServing {
  petId: string;
  servedOn: string;
  mealTime: string;
  createdBy: string;
}

export interface MealServingRepository {
  create(data: NewMealServing): Promise<MealServing>;
  deleteOne(
    petId: string,
    servedOn: string,
    mealTime: string,
  ): Promise<MealServing | null>;
  listTimesServedOn(petId: string, servedOn: string): Promise<string[]>;
}
