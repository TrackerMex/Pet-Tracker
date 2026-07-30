import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

const DEFAULT_ENV_FILE_PATH = ['../.env'];

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
