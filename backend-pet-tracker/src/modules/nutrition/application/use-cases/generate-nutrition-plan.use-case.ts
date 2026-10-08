import { SUBSCRIPTION_REPOSITORY } from '@/modules/subscriptions/domain/repositories/subscription.repository';
import type { SubscriptionRepository } from '@/modules/subscriptions/domain/repositories/subscription.repository';
import { NUTRITION_EXPLAINER } from '@/modules/nutrition/domain/ports/nutrition-explainer';
import type { NutritionExplainer } from '@/modules/nutrition/domain/ports/nutrition-explainer';
import { Inject, Injectable } from '@nestjs/common';
import { nutritionInputHash } from '@/modules/nutrition/application/nutrition-input-hash';
import { carriedSchedule } from '@/modules/nutrition/domain/entities/nutrition-plan.entity';
import type { NutritionPlan } from '@/modules/nutrition/domain/entities/nutrition-plan.entity';
import {
  NutritionProfileRequiredError,
  PetWeightRequiredError,
} from '@/modules/nutrition/domain/errors/nutrition.errors';
import {
  computePlan,
  NutritionEngineInput,
} from '@/modules/nutrition/domain/nutrition-engine';
import { NUTRITION_REPOSITORY } from '@/modules/nutrition/domain/repositories/nutrition.repository';
import type { NutritionRepository } from '@/modules/nutrition/domain/repositories/nutrition.repository';
import { calculateAgeMonths } from '@/modules/pets/domain/entities/pet.entity';
import { PET_REPOSITORY } from '@/modules/pets/domain/repositories/pet.repository';
import type { PetRepository } from '@/modules/pets/domain/repositories/pet.repository';

@Injectable()
export class GenerateNutritionPlanUseCase {
  constructor(
    @Inject(NUTRITION_REPOSITORY)
    private readonly nutrition: NutritionRepository,
    @Inject(PET_REPOSITORY) private readonly pets: PetRepository,
    @Inject(SUBSCRIPTION_REPOSITORY)
    private readonly subscriptions: SubscriptionRepository,
    @Inject(NUTRITION_EXPLAINER) private readonly explainer: NutritionExplainer,
  ) {}

  async execute(petId: string): Promise<NutritionPlan> {
    const profile = await this.nutrition.findProfile(petId);
    if (!profile) throw new NutritionProfileRequiredError(petId);

    const pet = await this.pets.findById(petId);
    if (!pet || pet.currentWeightKg === null) {
      throw new PetWeightRequiredError(petId);
    }

    const input: NutritionEngineInput = {
      species: pet.species,
      weightKg: pet.currentWeightKg,
      targetWeightKg: profile.targetWeightKg,
      ageMonths: calculateAgeMonths(pet, new Date()),
      sterilized: pet.sterilized === true,
      activityLevel: profile.activityLevel,
      bodyCondition: profile.bodyCondition,
      kcalPer100g: profile.kcalPer100g,
      allergies: profile.allergies,
      diseases: profile.diseases,
    };
    const inputsHash = nutritionInputHash(input);
    const latestPlan = await this.nutrition.findLatestPlan(petId);
    if (latestPlan?.inputsHash === inputsHash) return latestPlan;

    const result = computePlan(input);

    return this.nutrition.insertPlan({
      petId,
      ...result,
      ...carriedSchedule(latestPlan, result),
      engineMealsPerDay: result.mealsPerDay,
      aiExplanation: null,
      inputsHash,
    });
  }
}
