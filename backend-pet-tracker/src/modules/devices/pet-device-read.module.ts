import { Module } from '@nestjs/common';
import { PET_DEVICE_READER } from '@/modules/pets/domain/ports/pet-device-reader';
import { PetDeviceDrizzleReader } from './infrastructure/repositories/pet-device.drizzle.reader';

/**
 * Sub-modulo de solo lectura para la clave `device` del perfil (R12).
 * Depende unicamente de DRIZZLE (@Global) — NO importa PetsModule, asi el
 * grafo queda aciclico: DevicesModule -> PetsModule -> PetDeviceReadModule.
 */
@Module({
  providers: [
    {
      provide: PET_DEVICE_READER,
      useClass: PetDeviceDrizzleReader,
    },
  ],
  exports: [PET_DEVICE_READER],
})
export class PetDeviceReadModule {}
