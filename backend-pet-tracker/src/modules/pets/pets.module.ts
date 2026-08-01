import { Module } from '@nestjs/common';
import { PET_REPOSITORY } from './domain/repositories/pet.repository';
import { CreatePetUseCase } from './application/use-cases/create-pet.use-case';
import { GetPetUseCase } from './application/use-cases/get-pet.use-case';
import { ListPetsUseCase } from './application/use-cases/list-pets.use-case';
import { PetAccessGuard } from './infrastructure/guards/pet-access.guard';
import { PetsController } from './infrastructure/pets.controller';
import { PetDrizzleRepository } from './infrastructure/repositories/pet.drizzle.repository';

/**
 * CRUD /v1/pets (pets-crud-permissions R1-R16). AUDIT_LOGGER y DRIZZLE los
 * resuelven AuditModule y DrizzleModule (@Global()). PET_REPOSITORY y
 * PetAccessGuard se exportan para que las features con rutas :petId
 * (#6, #7, #9...) los reutilicen importando este modulo — mismo principio
 * de reutilizacion que llevo AuditLogger a src/audit/.
 */
@Module({
  controllers: [PetsController],
  providers: [
    CreatePetUseCase,
    ListPetsUseCase,
    GetPetUseCase,
    PetAccessGuard,
    {
      provide: PET_REPOSITORY,
      useClass: PetDrizzleRepository,
    },
  ],
  exports: [PET_REPOSITORY, PetAccessGuard],
})
export class PetsModule {}
