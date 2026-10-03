import { Inject, Injectable } from '@nestjs/common';
import { AUDIT_LOGGER } from '@/audit/audit-log.repository';
import type { AuditLogger } from '@/audit/audit-log.repository';
import { MealServingNotFoundError } from '@/modules/nutrition/domain/errors/nutrition.errors';
import { MEAL_SERVING_REPOSITORY } from '@/modules/nutrition/domain/repositories/meal-serving.repository';
import type { MealServingRepository } from '@/modules/nutrition/domain/repositories/meal-serving.repository';
import { ownerLocalDay } from '@/modules/pets/application/owner-local-day';
import { PET_REPOSITORY } from '@/modules/pets/domain/repositories/pet.repository';
import type { PetRepository } from '@/modules/pets/domain/repositories/pet.repository';

@Injectable()
export class UnserveMealUseCase {
  constructor(
    @Inject(MEAL_SERVING_REPOSITORY)
    private readonly meals: MealServingRepository,
    @Inject(PET_REPOSITORY) private readonly pets: PetRepository,
    @Inject(AUDIT_LOGGER) private readonly audit: AuditLogger,
  ) {}

  async execute(
    petId: string,
    mealTime: string,
    userId: string,
    now: Date,
  ): Promise<void> {
    const servedOn = await ownerLocalDay(this.pets, petId, now);
    const deleted = await this.meals.deleteOne(petId, servedOn, mealTime);
    if (!deleted) {
      throw new MealServingNotFoundError(petId, servedOn, mealTime);
    }
    await this.audit.record({
      userId,
      action: 'meal.unserve',
      entity: 'meal_serving',
      entityId: deleted.id,
      meta: { petId, mealTime, servedOn },
    });
  }
}
