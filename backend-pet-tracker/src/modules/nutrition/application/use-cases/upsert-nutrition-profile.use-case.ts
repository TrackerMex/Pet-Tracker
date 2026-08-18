import { Inject, Injectable } from '@nestjs/common';
import type { UpsertNutritionProfileDto } from '@/modules/nutrition/application/dto/nutrition-profile.dto';
import type { NutritionProfile } from '@/modules/nutrition/domain/entities/nutrition-profile.entity';
import { NUTRITION_REPOSITORY } from '@/modules/nutrition/domain/repositories/nutrition.repository';
import type { NutritionRepository } from '@/modules/nutrition/domain/repositories/nutrition.repository';

@Injectable()
export class UpsertNutritionProfileUseCase {
  constructor(
    @Inject(NUTRITION_REPOSITORY)
    private readonly nutrition: NutritionRepository,
  ) {}

  execute(
    petId: string,
    dto: UpsertNutritionProfileDto,
  ): Promise<NutritionProfile> {
    return this.nutrition.upsertProfile(petId, {
      activityLevel: dto.activityLevel,
      bodyCondition: dto.bodyCondition ?? null,
      targetWeightKg: dto.targetWeightKg ?? null,
      foodType: dto.foodType,
      kcalPer100g: dto.kcalPer100g,
      allergies: dto.allergies,
      diseases: dto.diseases,
    });
  }
}
