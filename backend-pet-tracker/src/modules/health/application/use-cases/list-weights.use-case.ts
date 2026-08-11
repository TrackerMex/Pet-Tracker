import { Inject, Injectable } from '@nestjs/common';
import {
  toWeightHistory,
  WeightEntry,
} from '@/modules/health/application/weight-variation';
import { WEIGHT_REPOSITORY } from '@/modules/health/domain/repositories/weight.repository';
import type { WeightRepository } from '@/modules/health/domain/repositories/weight.repository';

@Injectable()
export class ListWeightsUseCase {
  constructor(
    @Inject(WEIGHT_REPOSITORY) private readonly weights: WeightRepository,
  ) {}

  async execute(petId: string, limit: number): Promise<WeightEntry[]> {
    const rows = await this.weights.listByPet(petId, limit + 1);
    return toWeightHistory(rows, limit);
  }
}
