import { MAX_MEALS_PER_DAY } from '@/modules/nutrition/domain/nutrition.constants';
import { Inject, Injectable } from '@nestjs/common';
import { AUDIT_LOGGER } from '@/audit/audit-log.repository';
import type { AuditLogger } from '@/audit/audit-log.repository';
import { copyWithMealTimes } from '@/modules/nutrition/domain/entities/nutrition-plan.entity';
import type { NutritionPlan } from '@/modules/nutrition/domain/entities/nutrition-plan.entity';
import {
  MealTimeDuplicateError,
  MealTimesLimitReachedError,
  NutritionPlanRequiredError,
} from '@/modules/nutrition/domain/errors/nutrition.errors';
import { NUTRITION_REPOSITORY } from '@/modules/nutrition/domain/repositories/nutrition.repository';
import type { NutritionRepository } from '@/modules/nutrition/domain/repositories/nutrition.repository';

export interface AddMealTimeInput {
  petId: string;
  mealTime: string;
  userId: string;
}

@Injectable()
export class AddMealTimeUseCase {
  constructor(
    @Inject(NUTRITION_REPOSITORY)
    private readonly nutrition: NutritionRepository,
    @Inject(AUDIT_LOGGER) private readonly audit: AuditLogger,
  ) {}

  async execute(input: AddMealTimeInput): Promise<NutritionPlan> {
    const plan = await this.nutrition.findLatestPlan(input.petId);
    if (!plan) throw new NutritionPlanRequiredError(input.petId);
    if (plan.mealTimes.includes(input.mealTime))
      throw new MealTimeDuplicateError(input.petId, input.mealTime);
    if (plan.mealTimes.length >= MAX_MEALS_PER_DAY)
      throw new MealTimesLimitReachedError(input.petId);
    const created = await this.nutrition.insertPlan(
      copyWithMealTimes(plan, [...plan.mealTimes, input.mealTime]),
    );
    await this.audit.record({
      userId: input.userId,
      action: 'meal_time.add',
      entity: 'nutrition_plan',
      entityId: created.id,
      meta: { petId: input.petId, mealTime: input.mealTime },
    });
    return created;
  }
}
