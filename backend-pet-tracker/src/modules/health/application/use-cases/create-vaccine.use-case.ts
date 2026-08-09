import { Inject, Injectable } from '@nestjs/common';
import { AUDIT_LOGGER } from '@/audit/audit-log.repository';
import type { AuditLogger } from '@/audit/audit-log.repository';
import { CreateVaccineDto } from '@/modules/health/application/dto/vaccine.dto';
import { addCalendarMonths } from '@/modules/health/application/vaccine-date';
import { PetVaccine } from '@/modules/health/domain/entities/vaccine.entity';
import {
  VaccineCatalogNotFoundError,
  VaccineSpeciesMismatchError,
} from '@/modules/health/domain/errors/vaccine.errors';
import { VACCINE_REPOSITORY } from '@/modules/health/domain/repositories/vaccine.repository';
import type { VaccineRepository } from '@/modules/health/domain/repositories/vaccine.repository';
import { PET_REPOSITORY } from '@/modules/pets/domain/repositories/pet.repository';
import type { PetRepository } from '@/modules/pets/domain/repositories/pet.repository';

@Injectable()
export class CreateVaccineUseCase {
  constructor(
    @Inject(VACCINE_REPOSITORY) private readonly vaccines: VaccineRepository,
    @Inject(PET_REPOSITORY) private readonly pets: PetRepository,
    @Inject(AUDIT_LOGGER) private readonly audit: AuditLogger,
  ) {}

  async execute(
    petId: string,
    dto: CreateVaccineDto,
    userId: string,
  ): Promise<PetVaccine> {
    const catalog = dto.catalogId
      ? await this.vaccines.findCatalogById(dto.catalogId)
      : null;

    if (dto.catalogId && !catalog) {
      throw new VaccineCatalogNotFoundError(dto.catalogId);
    }

    if (catalog) {
      const pet = await this.pets.findById(petId);
      if (pet?.species !== catalog.species) {
        throw new VaccineSpeciesMismatchError();
      }
    }

    const vaccine = await this.vaccines.create({
      petId,
      catalogId: catalog?.id ?? null,
      name: catalog?.name ?? dto.name!,
      appliedAt: dto.appliedAt,
      nextDoseAt:
        dto.nextDoseAt ??
        (catalog
          ? addCalendarMonths(dto.appliedAt, catalog.scheme.boosterMonths)
          : null),
      vetName: dto.vetName ?? null,
      clinic: dto.clinic ?? null,
      notes: dto.notes ?? null,
      documentKey: null,
      createdBy: userId,
    });

    await this.audit.record({
      userId,
      action: 'vaccine.create',
      entity: 'vaccine',
      entityId: vaccine.id,
      meta: { petId },
    });
    return vaccine;
  }
}
