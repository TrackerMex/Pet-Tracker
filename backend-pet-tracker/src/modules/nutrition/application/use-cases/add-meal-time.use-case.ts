import { Inject, Injectable } from '@nestjs/common';
import { AUDIT_LOGGER } from '@/audit/audit-log.repository';
import type { AuditLogger } from '@/audit/audit-log.repository';
import { copyWithMealTimes } from '@/modules/nutrition/domain/entities/nutrition-plan.entity';
import type { NutritionPlan } from '@/modules/nutrition/domain/entities/nutrition-plan.entity';
import { NutritionPlanRequiredError } from '@/modules/nutrition/domain/errors/nutrition.errors';
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
    const created = await this.nutrition.insertPlan(
      copyWithMealTimes(plan, [...plan.mealTimes, input.mealTime]),
    );
    return created;
  }
}
