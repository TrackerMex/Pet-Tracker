import { Inject, Injectable } from '@nestjs/common';
import { nutritionInputHash } from '@/modules/nutrition/application/nutrition-input-hash';
import type { NutritionPlan } from '@/modules/nutrition/domain/entities/nutrition-plan.entity';
import {
  NutritionProfileRequiredError,
  PetWeightRequiredError,
} from '@/modules/nutrition/domain/errors/nutrition.errors';
import {
  computePlan,
  NutritionEngineInput,
  NutritionPlanResult,
} from '@/modules/nutrition/domain/nutrition-engine';
import {
  NUTRITION_EXPLAINER,
  type NutritionExplainer,
} from '@/modules/nutrition/domain/ports/nutrition-explainer';
import { NUTRITION_REPOSITORY } from '@/modules/nutrition/domain/repositories/nutrition.repository';
import type { NutritionRepository } from '@/modules/nutrition/domain/repositories/nutrition.repository';
import { calculateAgeMonths } from '@/modules/pets/domain/entities/pet.entity';
import { PET_REPOSITORY } from '@/modules/pets/domain/repositories/pet.repository';
import type { PetRepository } from '@/modules/pets/domain/repositories/pet.repository';
import {
  SUBSCRIPTION_REPOSITORY,
  type SubscriptionRepository,
} from '@/modules/subscriptions/domain/repositories/subscription.repository';

@Injectable()
export class GenerateNutritionPlanUseCase {
  constructor(
    @Inject(NUTRITION_REPOSITORY)
    private readonly nutrition: NutritionRepository,
    @Inject(PET_REPOSITORY) private readonly pets: PetRepository,
    @Inject(NUTRITION_EXPLAINER)
    private readonly explainer: NutritionExplainer,
    @Inject(SUBSCRIPTION_REPOSITORY)
    private readonly subscriptions: SubscriptionRepository,
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
    if (latestPlan?.inputsHash === inputsHash) {
      if (latestPlan.aiExplanation !== null) return latestPlan;

      return this.enrich(latestPlan, input, computePlan(input));
    }

    const result = computePlan(input);

    const inserted = await this.nutrition.insertPlan({
      petId,
      ...result,
      aiExplanation: null,
      inputsHash,
    });
    return this.enrich(inserted, input, result);
  }

  private async enrich(
    plan: NutritionPlan,
    input: NutritionEngineInput,
    result: NutritionPlanResult,
  ): Promise<NutritionPlan> {
    if (!(await this.subscriptions.isPetTracked(plan.petId))) return plan;

    const explanation = await this.explainer.explain(input, result, {
      petId: plan.petId,
      planId: plan.id,
    });
    if (explanation === null) return plan;

    return this.nutrition.setAiExplanation(plan.id, explanation);
  }
}
