import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

// El backend corre en backend-pet-tracker/ pero el .env vive en la raíz del
// repo (mismo que consumen docker-compose.yml e init.sh, ver
// docs/conventions.md §Variables de entorno).
const DEFAULT_ENV_FILE_PATH = ['../.env'];

// Wrapper fino sobre ConfigModule.forRoot para que AppModule no tenga que
// repetir las opciones (isGlobal, envFilePath) y para que los tests puedan
// apuntar a un .env de fixture sin tocar el .env real (sirve a R5).
@Module({})
export class AppConfigModule {
  static forRoot(envFilePath: string[] = DEFAULT_ENV_FILE_PATH): DynamicModule {
    return {
      module: AppConfigModule,
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath,
        }),
      ],
    };
  }
}
