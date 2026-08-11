import { Inject, Injectable } from '@nestjs/common';
import { CreateWeightDto } from '@/modules/health/application/dto/weight.dto';
import {
  WeightEntry,
  weightDelta,
} from '@/modules/health/application/weight-variation';
import { WEIGHT_REPOSITORY } from '@/modules/health/domain/repositories/weight.repository';
import type { WeightRepository } from '@/modules/health/domain/repositories/weight.repository';

@Injectable()
export class CreateWeightUseCase {
  constructor(
    @Inject(WEIGHT_REPOSITORY) private readonly weights: WeightRepository,
  ) {}

  async execute(
    petId: string,
    dto: CreateWeightDto,
    userId: string,
  ): Promise<WeightEntry> {
    const weight = await this.weights.create({
      petId,
      weightKg: dto.weightKg,
      measuredAt: dto.measuredAt,
      bodyCondition: dto.bodyCondition ?? null,
      createdBy: userId,
    });
    const previous = await this.weights.findPrevious(
      petId,
      weight.measuredAt,
      weight.id,
    );

    return {
      ...weight,
      variation: weightDelta(weight.weightKg, previous?.weightKg ?? null),
    };
  }
}
