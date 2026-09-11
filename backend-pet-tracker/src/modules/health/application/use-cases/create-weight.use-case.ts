import { Inject, Injectable } from '@nestjs/common';
import { AUDIT_LOGGER } from '@/audit/audit-log.repository';
import type { AuditLogger } from '@/audit/audit-log.repository';
import { CreateWeightDto } from '@/modules/health/application/dto/weight.dto';
import {
  WeightEntry,
  weightDelta,
} from '@/modules/health/application/weight-variation';
import { WeightMeasuredInFutureError } from '@/modules/health/domain/errors/weight.errors';
import { WEIGHT_REPOSITORY } from '@/modules/health/domain/repositories/weight.repository';
import type { WeightRepository } from '@/modules/health/domain/repositories/weight.repository';
import { ownerLocalDay } from '@/modules/pets/application/owner-local-day';
import { PET_REPOSITORY } from '@/modules/pets/domain/repositories/pet.repository';
import type { PetRepository } from '@/modules/pets/domain/repositories/pet.repository';

@Injectable()
export class CreateWeightUseCase {
  constructor(
    @Inject(WEIGHT_REPOSITORY) private readonly weights: WeightRepository,
    @Inject(PET_REPOSITORY) private readonly pets: PetRepository,
    @Inject(AUDIT_LOGGER) private readonly audit: AuditLogger,
  ) {}

  /** #89: measuredAt se compara con el dia civil del owner, sin margen. */
  async execute(
    petId: string,
    dto: CreateWeightDto,
    userId: string,
    now: Date,
  ): Promise<WeightEntry> {
    if (dto.measuredAt > (await ownerLocalDay(this.pets, petId, now))) {
      throw new WeightMeasuredInFutureError();
    }

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

    await this.audit.record({
      userId,
      action: 'weight.create',
      entity: 'weight',
      entityId: weight.id,
      meta: { petId },
    });

    return {
      ...weight,
      variation: weightDelta(weight.weightKg, previous?.weightKg ?? null),
    };
  }
}
