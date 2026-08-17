import { Module } from '@nestjs/common';
import { PetsModule } from '@/modules/pets/pets.module';
import { SubscriptionsModule } from '@/modules/subscriptions/subscriptions.module';
import { ClaimDeviceUseCase } from './application/use-cases/claim-device.use-case';
import { GetPetDeviceUseCase } from './application/use-cases/get-pet-device.use-case';
import { ReleaseDeviceUseCase } from './application/use-cases/release-device.use-case';
import { DEVICE_REPOSITORY } from './domain/repositories/device.repository';
import { DevicesController } from './infrastructure/devices.controller';
import { PetDeviceController } from './infrastructure/pet-device.controller';
import { DeviceDrizzleRepository } from './infrastructure/repositories/device.drizzle.repository';

/**
 * Asociacion de collares (devices-claim R3-R15). Importa PetsModule por el
 * mecanismo de reutilizacion que #5 diseño: PET_REPOSITORY para la
 * membresia del claim (D1) y PetAccessGuard/@RequirePetRole para las rutas
 * :petId. AUDIT_LOGGER y DRIZZLE los resuelven los modulos @Global().
 */
@Module({
  imports: [PetsModule, SubscriptionsModule],
  controllers: [DevicesController, PetDeviceController],
  providers: [
    ClaimDeviceUseCase,
    GetPetDeviceUseCase,
    ReleaseDeviceUseCase,
    {
      provide: DEVICE_REPOSITORY,
      useClass: DeviceDrizzleRepository,
    },
  ],
})
export class DevicesModule {}
