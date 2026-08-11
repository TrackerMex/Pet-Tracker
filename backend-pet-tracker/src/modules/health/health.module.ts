import { Module } from '@nestjs/common';
import { HealthController } from './infrastructure/health.controller';
import { CheckHealthUseCase } from './application/use-cases/check-health.use-case';
import { DATABASE_HEALTH_CHECKER } from './domain/repositories/database-health-checker.repository';
import { DatabaseHealthDrizzleRepository } from './infrastructure/repositories/database-health.drizzle.repository';
import { PetsModule } from '@/modules/pets/pets.module';
import { CreateVaccineUseCase } from './application/use-cases/create-vaccine.use-case';
import { DeleteVaccineUseCase } from './application/use-cases/delete-vaccine.use-case';
import { ListVaccineCatalogUseCase } from './application/use-cases/list-vaccine-catalog.use-case';
import { ListVaccinesUseCase } from './application/use-cases/list-vaccines.use-case';
import { UpdateVaccineUseCase } from './application/use-cases/update-vaccine.use-case';
import { VACCINE_REPOSITORY } from './domain/repositories/vaccine.repository';
import {
  VaccineCatalogController,
  VaccinesController,
} from './infrastructure/vaccines.controller';
import { VaccineDrizzleRepository } from './infrastructure/repositories/vaccine.drizzle.repository';
import { CreateWeightUseCase } from '@/modules/health/application/use-cases/create-weight.use-case';
import { WEIGHT_REPOSITORY } from '@/modules/health/domain/repositories/weight.repository';
import { WeightDrizzleRepository } from '@/modules/health/infrastructure/repositories/weight.drizzle.repository';
import { WeightsController } from '@/modules/health/infrastructure/weights.controller';

@Module({
  imports: [PetsModule],
  controllers: [
    HealthController,
    VaccineCatalogController,
    VaccinesController,
    WeightsController,
  ],
  providers: [
    CheckHealthUseCase,
    ListVaccineCatalogUseCase,
    CreateVaccineUseCase,
    ListVaccinesUseCase,
    UpdateVaccineUseCase,
    DeleteVaccineUseCase,
    CreateWeightUseCase,
    {
      provide: DATABASE_HEALTH_CHECKER,
      useClass: DatabaseHealthDrizzleRepository,
    },
    { provide: VACCINE_REPOSITORY, useClass: VaccineDrizzleRepository },
    { provide: WEIGHT_REPOSITORY, useClass: WeightDrizzleRepository },
  ],
})
export class HealthModule {}
