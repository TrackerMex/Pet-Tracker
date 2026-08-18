import { Inject, Injectable } from '@nestjs/common';
import type { NutritionProfile } from '@/modules/nutrition/domain/entities/nutrition-profile.entity';
import { NutritionProfileNotFoundError } from '@/modules/nutrition/domain/errors/nutrition.errors';
import { NUTRITION_REPOSITORY } from '@/modules/nutrition/domain/repositories/nutrition.repository';
import type { NutritionRepository } from '@/modules/nutrition/domain/repositories/nutrition.repository';

@Injectable()
export class GetNutritionProfileUseCase {
  constructor(
    @Inject(NUTRITION_REPOSITORY)
    private readonly nutrition: NutritionRepository,
  ) {}

  async execute(petId: string): Promise<NutritionProfile> {
    const profile = await this.nutrition.findProfile(petId);
    if (!profile) throw new NutritionProfileNotFoundError(petId);
    return profile;
  }
}
