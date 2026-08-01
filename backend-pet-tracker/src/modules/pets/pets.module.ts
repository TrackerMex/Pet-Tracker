import { Module } from '@nestjs/common';
import { PET_REPOSITORY } from './domain/repositories/pet.repository';
import { CreatePetUseCase } from './application/use-cases/create-pet.use-case';
import { ListPetsUseCase } from './application/use-cases/list-pets.use-case';
import { PetsController } from './infrastructure/pets.controller';
import { PetDrizzleRepository } from './infrastructure/repositories/pet.drizzle.repository';

/**
 * CRUD /v1/pets (pets-crud-permissions R1-R16). AUDIT_LOGGER y DRIZZLE los
 * resuelven AuditModule y DrizzleModule (@Global()). PET_REPOSITORY se
 * exporta para que las features con rutas :petId (#6, #7, #9...) apliquen
 * PetAccessGuard importando este modulo.
 */
@Module({
  controllers: [PetsController],
  providers: [
    CreatePetUseCase,
    ListPetsUseCase,
    {
      provide: PET_REPOSITORY,
      useClass: PetDrizzleRepository,
    },
  ],
  exports: [PET_REPOSITORY],
})
export class PetsModule {}
