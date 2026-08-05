import { Module } from '@nestjs/common';
import { PetsModule } from '@/modules/pets/pets.module';
import { CreateGeofenceUseCase } from './application/use-cases/create-geofence.use-case';
import { DeleteGeofenceUseCase } from './application/use-cases/delete-geofence.use-case';
import { GetGeofenceUseCase } from './application/use-cases/get-geofence.use-case';
import { ListGeofencesUseCase } from './application/use-cases/list-geofences.use-case';
import { UpdateGeofenceUseCase } from './application/use-cases/update-geofence.use-case';
import { GEOFENCE_REPOSITORY } from './domain/repositories/geofence.repository';
import { GeofencesController } from './infrastructure/geofences.controller';
import { GeofenceDrizzleRepository } from './infrastructure/repositories/geofence.drizzle.repository';

/**
 * CRUD de geocercas (geofences-crud R2-R15). Importa PetsModule por
 * PetAccessGuard/@RequirePetRole (D4) — no necesita PET_REPOSITORY: el
 * petId ya validado llega via request.petMembership. AUDIT_LOGGER y DRIZZLE
 * los resuelven los modulos @Global().
 */
@Module({
  imports: [PetsModule],
  controllers: [GeofencesController],
  providers: [
    CreateGeofenceUseCase,
    ListGeofencesUseCase,
    GetGeofenceUseCase,
    UpdateGeofenceUseCase,
    DeleteGeofenceUseCase,
    {
      provide: GEOFENCE_REPOSITORY,
      useClass: GeofenceDrizzleRepository,
    },
  ],
})
export class GeofencesModule {}
