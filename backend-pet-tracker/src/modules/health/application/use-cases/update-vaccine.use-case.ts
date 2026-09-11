import { Inject, Injectable } from '@nestjs/common';
import { AUDIT_LOGGER } from '@/audit/audit-log.repository';
import type { AuditLogger } from '@/audit/audit-log.repository';
import { UpdateVaccineDto } from '@/modules/health/application/dto/vaccine.dto';
import { PetVaccine } from '@/modules/health/domain/entities/vaccine.entity';
import {
  VaccineAppliedInFutureError,
  VaccineNotFoundError,
} from '@/modules/health/domain/errors/vaccine.errors';
import { VACCINE_REPOSITORY } from '@/modules/health/domain/repositories/vaccine.repository';
import type { VaccineRepository } from '@/modules/health/domain/repositories/vaccine.repository';
import { ownerLocalDay } from '@/modules/pets/application/owner-local-day';
import { PET_REPOSITORY } from '@/modules/pets/domain/repositories/pet.repository';
import type { PetRepository } from '@/modules/pets/domain/repositories/pet.repository';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

@Injectable()
export class UpdateVaccineUseCase {
  constructor(
    @Inject(VACCINE_REPOSITORY) private readonly vaccines: VaccineRepository,
    @Inject(PET_REPOSITORY) private readonly pets: PetRepository,
    @Inject(AUDIT_LOGGER) private readonly audit: AuditLogger,
  ) {}

  /** #88: appliedAt se compara con el dia civil del owner. */
  async execute(
    petId: string,
    id: string,
    dto: UpdateVaccineDto,
    userId: string,
    now: Date,
  ): Promise<PetVaccine> {
    if (
      dto.appliedAt !== undefined &&
      dto.appliedAt > (await ownerLocalDay(this.pets, petId, now))
    ) {
      throw new VaccineAppliedInFutureError();
    }

    if (!UUID.test(id)) throw new VaccineNotFoundError(id);
    const existing = await this.vaccines.findByIdAndPet(id, petId);
    if (!existing) throw new VaccineNotFoundError(id);

    const fields = Object.keys(dto) as (keyof UpdateVaccineDto)[];
    if (!fields.length) return existing;

    const vaccine = await this.vaccines.update(id, dto);
    await this.audit.record({
      userId,
      action: 'vaccine.update',
      entity: 'vaccine',
      entityId: id,
      meta: { petId, fields },
    });
    return vaccine;
  }
}
