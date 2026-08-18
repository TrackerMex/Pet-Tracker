import { Inject, Injectable } from '@nestjs/common';
import type { NutritionPlan } from '@/modules/nutrition/domain/entities/nutrition-plan.entity';
import { NutritionPlanNotFoundError } from '@/modules/nutrition/domain/errors/nutrition.errors';
import { NUTRITION_REPOSITORY } from '@/modules/nutrition/domain/repositories/nutrition.repository';
import type { NutritionRepository } from '@/modules/nutrition/domain/repositories/nutrition.repository';

@Injectable()
export class GetNutritionPlanUseCase {
  constructor(
    @Inject(NUTRITION_REPOSITORY)
    private readonly nutrition: NutritionRepository,
  ) {}

  async execute(petId: string): Promise<NutritionPlan> {
    const plan = await this.nutrition.findLatestPlan(petId);
    if (!plan) throw new NutritionPlanNotFoundError(petId);
    return plan;
  }
}
