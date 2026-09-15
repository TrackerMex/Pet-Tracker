import { Inject, Injectable } from '@nestjs/common';
import { AUDIT_LOGGER } from '@/audit/audit-log.repository';
import type { AuditLogger } from '@/audit/audit-log.repository';
import type { ServeMealDto } from '@/modules/nutrition/application/dto/meal.dto';
import type { MealServing } from '@/modules/nutrition/domain/entities/meal-serving.entity';
import {
  MealTimeNotInPlanError,
  NutritionPlanRequiredError,
} from '@/modules/nutrition/domain/errors/nutrition.errors';
import { MEAL_SERVING_REPOSITORY } from '@/modules/nutrition/domain/repositories/meal-serving.repository';
import type { MealServingRepository } from '@/modules/nutrition/domain/repositories/meal-serving.repository';
import { NUTRITION_REPOSITORY } from '@/modules/nutrition/domain/repositories/nutrition.repository';
import type { NutritionRepository } from '@/modules/nutrition/domain/repositories/nutrition.repository';
import { ownerLocalDay } from '@/modules/pets/application/owner-local-day';
import { PET_REPOSITORY } from '@/modules/pets/domain/repositories/pet.repository';
import type { PetRepository } from '@/modules/pets/domain/repositories/pet.repository';

@Injectable()
export class ServeMealUseCase {
  constructor(
    @Inject(NUTRITION_REPOSITORY)
    private readonly nutrition: NutritionRepository,
    @Inject(MEAL_SERVING_REPOSITORY)
    private readonly meals: MealServingRepository,
    @Inject(PET_REPOSITORY) private readonly pets: PetRepository,
    @Inject(AUDIT_LOGGER) private readonly audit: AuditLogger,
  ) {}

  async execute(
    petId: string,
    dto: ServeMealDto,
    userId: string,
    now: Date,
  ): Promise<MealServing> {
    const plan = await this.nutrition.findLatestPlan(petId);
    if (!plan) throw new NutritionPlanRequiredError(petId);
    if (!plan.mealTimes.includes(dto.mealTime)) {
      throw new MealTimeNotInPlanError(petId, dto.mealTime);
    }

    const servedOn = await ownerLocalDay(this.pets, petId, now);
    const serving = await this.meals.create({
      petId,
      servedOn,
      mealTime: dto.mealTime,
      createdBy: userId,
    });
    await this.audit.record({
      userId,
      action: 'meal.create',
      entity: 'meal_serving',
      entityId: serving.id,
      meta: { petId, mealTime: serving.mealTime, servedOn: serving.servedOn },
    });
    return serving;
  }
}
