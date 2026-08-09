import { Inject, Injectable } from '@nestjs/common';
import { AUDIT_LOGGER } from '@/audit/audit-log.repository';
import type { AuditLogger } from '@/audit/audit-log.repository';
import { UpdateVaccineDto } from '@/modules/health/application/dto/vaccine.dto';
import { PetVaccine } from '@/modules/health/domain/entities/vaccine.entity';
import { VaccineNotFoundError } from '@/modules/health/domain/errors/vaccine.errors';
import { VACCINE_REPOSITORY } from '@/modules/health/domain/repositories/vaccine.repository';
import type { VaccineRepository } from '@/modules/health/domain/repositories/vaccine.repository';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

@Injectable()
export class UpdateVaccineUseCase {
  constructor(
    @Inject(VACCINE_REPOSITORY) private readonly vaccines: VaccineRepository,
    @Inject(AUDIT_LOGGER) private readonly audit: AuditLogger,
  ) {}

  async execute(
    petId: string,
    id: string,
    dto: UpdateVaccineDto,
    userId: string,
  ): Promise<PetVaccine> {
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
