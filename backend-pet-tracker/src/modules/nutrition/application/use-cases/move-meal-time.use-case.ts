import { ownerLocalDay } from '@/modules/pets/application/owner-local-day';
import { PET_REPOSITORY } from '@/modules/pets/domain/repositories/pet.repository';
import type { PetRepository } from '@/modules/pets/domain/repositories/pet.repository';
import { Inject, Injectable } from '@nestjs/common';
import { AUDIT_LOGGER } from '@/audit/audit-log.repository';
import type { AuditLogger } from '@/audit/audit-log.repository';
import { copyWithMealTimes } from '@/modules/nutrition/domain/entities/nutrition-plan.entity';
import type { NutritionPlan } from '@/modules/nutrition/domain/entities/nutrition-plan.entity';
import { NutritionPlanRequiredError } from '@/modules/nutrition/domain/errors/nutrition.errors';
import { NUTRITION_REPOSITORY } from '@/modules/nutrition/domain/repositories/nutrition.repository';
import type { NutritionRepository } from '@/modules/nutrition/domain/repositories/nutrition.repository';

export interface MoveMealTimeInput {
  petId: string;
  from: string;
  to: string;
  userId: string;
  now: Date;
}

@Injectable()
export class MoveMealTimeUseCase {
  constructor(
    @Inject(NUTRITION_REPOSITORY)
    private readonly nutrition: NutritionRepository,
    @Inject(PET_REPOSITORY) private readonly pets: PetRepository,
    @Inject(AUDIT_LOGGER) private readonly audit: AuditLogger,
  ) {}

  async execute(input: MoveMealTimeInput): Promise<NutritionPlan> {
    const plan = await this.nutrition.findLatestPlan(input.petId);
    if (!plan) throw new NutritionPlanRequiredError(input.petId);
    const servedOn = await ownerLocalDay(this.pets, input.petId, input.now);
    const created = await this.nutrition.insertPlanAndMoveServing(
      copyWithMealTimes(
        plan,
        plan.mealTimes.map((t) => (t === input.from ? input.to : t)),
      ),
      { servedOn, from: input.from, to: input.to },
    );
    return created;
  }
}
