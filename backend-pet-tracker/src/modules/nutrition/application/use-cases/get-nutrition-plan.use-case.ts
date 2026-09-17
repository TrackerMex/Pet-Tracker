import { Inject, Injectable } from '@nestjs/common';
import { servedInPlan } from '@/modules/nutrition/domain/entities/meal-serving.entity';
import type { NutritionPlan } from '@/modules/nutrition/domain/entities/nutrition-plan.entity';
import { NutritionPlanNotFoundError } from '@/modules/nutrition/domain/errors/nutrition.errors';
import { MEAL_SERVING_REPOSITORY } from '@/modules/nutrition/domain/repositories/meal-serving.repository';
import type { MealServingRepository } from '@/modules/nutrition/domain/repositories/meal-serving.repository';
import { NUTRITION_REPOSITORY } from '@/modules/nutrition/domain/repositories/nutrition.repository';
import type { NutritionRepository } from '@/modules/nutrition/domain/repositories/nutrition.repository';
import { ownerLocalDay } from '@/modules/pets/application/owner-local-day';
import { PET_REPOSITORY } from '@/modules/pets/domain/repositories/pet.repository';
import type { PetRepository } from '@/modules/pets/domain/repositories/pet.repository';

export interface NutritionPlanToday {
  plan: NutritionPlan;
  servedToday: string[];
}

@Injectable()
export class GetNutritionPlanUseCase {
  constructor(
    @Inject(NUTRITION_REPOSITORY)
    private readonly nutrition: NutritionRepository,
    @Inject(MEAL_SERVING_REPOSITORY)
    private readonly meals: MealServingRepository,
    @Inject(PET_REPOSITORY) private readonly pets: PetRepository,
  ) {}

  async execute(petId: string, now: Date): Promise<NutritionPlanToday> {
    const plan = await this.nutrition.findLatestPlan(petId);
    if (!plan) throw new NutritionPlanNotFoundError(petId);
    const day = await ownerLocalDay(this.pets, petId, now);
    const served = await this.meals.listTimesServedOn(petId, day);
    return { plan, servedToday: servedInPlan(plan.mealTimes, served) };
  }
}
