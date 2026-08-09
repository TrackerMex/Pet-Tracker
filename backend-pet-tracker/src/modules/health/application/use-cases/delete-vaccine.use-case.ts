import { Inject, Injectable } from '@nestjs/common';
import { AUDIT_LOGGER } from '@/audit/audit-log.repository';
import type { AuditLogger } from '@/audit/audit-log.repository';
import { VaccineNotFoundError } from '@/modules/health/domain/errors/vaccine.errors';
import { VACCINE_REPOSITORY } from '@/modules/health/domain/repositories/vaccine.repository';
import type { VaccineRepository } from '@/modules/health/domain/repositories/vaccine.repository';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

@Injectable()
export class DeleteVaccineUseCase {
  constructor(
    @Inject(VACCINE_REPOSITORY) private readonly vaccines: VaccineRepository,
    @Inject(AUDIT_LOGGER) private readonly audit: AuditLogger,
  ) {}

  async execute(petId: string, id: string, userId: string): Promise<void> {
    if (!UUID.test(id)) throw new VaccineNotFoundError(id);
    if (!(await this.vaccines.findByIdAndPet(id, petId))) {
      throw new VaccineNotFoundError(id);
    }
    await this.vaccines.delete(id);
    await this.audit.record({
      userId,
      action: 'vaccine.delete',
      entity: 'vaccine',
      entityId: id,
      meta: { petId },
    });
  }
}
