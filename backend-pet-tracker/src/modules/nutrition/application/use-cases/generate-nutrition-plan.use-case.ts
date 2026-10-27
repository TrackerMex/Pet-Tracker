import {
  acceptAiOutput,
  NUTRITION_AI_DAILY_LIMIT,
  NUTRITION_AI_WEIGHT_TREND_POINTS,
} from '@/modules/nutrition/domain/nutrition-ai-proposal';
import type { NutritionAiStatus } from '@/modules/nutrition/domain/nutrition-ai-proposal';
import { NUTRITION_WEIGHT_READER } from '@/modules/nutrition/domain/ports/nutrition-weight-reader';
import type {
  NutritionWeightPoint,
  NutritionWeightReader,
} from '@/modules/nutrition/domain/ports/nutrition-weight-reader';
import { SUBSCRIPTION_REPOSITORY } from '@/modules/subscriptions/domain/repositories/subscription.repository';
import type { SubscriptionRepository } from '@/modules/subscriptions/domain/repositories/subscription.repository';
import { NUTRITION_EXPLAINER } from '@/modules/nutrition/domain/ports/nutrition-explainer';
import type { NutritionExplainer } from '@/modules/nutrition/domain/ports/nutrition-explainer';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { nutritionInputHash } from '@/modules/nutrition/application/nutrition-input-hash';
import {
  carriedSchedule,
  toPlanResult,
} from '@/modules/nutrition/domain/entities/nutrition-plan.entity';
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
import { ownerLocalDay } from '@/modules/pets/application/owner-local-day';
import { calculateAgeMonths } from '@/modules/pets/domain/entities/pet.entity';
import { PET_REPOSITORY } from '@/modules/pets/domain/repositories/pet.repository';
import type { PetRepository } from '@/modules/pets/domain/repositories/pet.repository';

export interface GenerateNutritionPlanResult {
  plan: NutritionPlan;
  aiStatus: NutritionAiStatus;
}

@Injectable()
export class GenerateNutritionPlanUseCase {
  private readonly logger = new Logger(GenerateNutritionPlanUseCase.name);

  constructor(
    @Inject(NUTRITION_REPOSITORY)
    private readonly nutrition: NutritionRepository,
    @Inject(PET_REPOSITORY) private readonly pets: PetRepository,
    @Inject(SUBSCRIPTION_REPOSITORY)
    private readonly subscriptions: SubscriptionRepository,
    @Inject(NUTRITION_EXPLAINER) private readonly explainer: NutritionExplainer,
    @Inject(NUTRITION_WEIGHT_READER)
    private readonly weights: NutritionWeightReader,
  ) {}

  async execute(
    petId: string,
    now: Date = new Date(),
  ): Promise<GenerateNutritionPlanResult> {
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
      ageMonths: calculateAgeMonths(pet, now),
      sterilized: pet.sterilized === true,
      activityLevel: profile.activityLevel,
      bodyCondition: profile.bodyCondition,
      kcalPer100g: profile.kcalPer100g,
      allergies: profile.allergies,
      diseases: profile.diseases,
    };
    const trend = await this.weights.listRecent(
      petId,
      NUTRITION_AI_WEIGHT_TREND_POINTS,
    );
    const inputsHash = nutritionInputHash(input, trend);
    const latestPlan = await this.nutrition.findLatestPlan(petId);
    if (latestPlan?.inputsHash === inputsHash) {
      return this.aiPhase(petId, input, trend, latestPlan, now);
    }

    const result = computePlan(input);

    const plan = await this.nutrition.insertPlan({
      petId,
      ...result,
      ...carriedSchedule(latestPlan, result),
      engineMealsPerDay: result.mealsPerDay,
      aiExplanation: null,
      aiProposal: null,
      inputsHash,
    });
    return this.aiPhase(petId, input, trend, plan, now);
  }

  private async aiPhase(
    petId: string,
    input: NutritionEngineInput,
    trend: NutritionWeightPoint[],
    plan: NutritionPlan,
    now: Date,
  ): Promise<GenerateNutritionPlanResult> {
    if (!(await this.subscriptions.isPetTracked(petId))) {
      return { plan, aiStatus: 'not_tracked' };
    }
    const day = await ownerLocalDay(this.pets, petId, now);
    if (
      !(await this.nutrition.consumeAiGeneration(
        petId,
        day,
        NUTRITION_AI_DAILY_LIMIT,
      ))
    ) {
      return { plan, aiStatus: 'limit_reached' };
    }
    const output = await this.explainer.explain(
      input,
      toPlanResult(plan),
      trend,
      {
        petId,
        planId: plan.id,
      },
    );
    if (output === null) return { plan, aiStatus: 'unavailable' };
    const accepted = acceptAiOutput(output, plan, day);
    if (accepted === null) {
      this.logger.warn({
        scope: 'nutrition-ai',
        petId,
        planId: plan.id,
        message: 'ai proposal out of bounds',
      });
      return { plan, aiStatus: 'rejected' };
    }
    const updated = await this.nutrition.setAiResult(
      plan.id,
      accepted.explanation,
      accepted.proposal,
    );
    return { plan: updated, aiStatus: 'proposed' };
  }
}
