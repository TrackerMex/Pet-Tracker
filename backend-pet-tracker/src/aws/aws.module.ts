import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  AwsRuntimeConfig,
  createDynamoDbClient,
  createEventBridgeClient,
  createS3Client,
  createSqsClient,
  resolveAwsConfigFromConfigService,
} from './aws-clients';
import {
  DYNAMODB_CLIENT,
  EVENTBRIDGE_CLIENT,
  S3_CLIENT,
  SQS_CLIENT,
} from './aws.constants';

/**
 * Infraestructura compartida (análoga a src/db/drizzle.module.ts): expone
 * los 4 clientes AWS SDK v3 construidos desde ConfigService bajo tokens de
 * inyección, para que módulos futuros (media, positions, workers,
 * reminders) los consuman sin repetir la lógica de configuración de
 * endpoint/credenciales (R1, R3).
 */
@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: SQS_CLIENT,
      useFactory: (config: ConfigService) =>
        createSqsClient(resolveConfig(config)),
      inject: [ConfigService],
    },
    {
      provide: DYNAMODB_CLIENT,
      useFactory: (config: ConfigService) =>
        createDynamoDbClient(resolveConfig(config)),
      inject: [ConfigService],
    },
    {
      provide: S3_CLIENT,
      useFactory: (config: ConfigService) =>
        createS3Client(resolveConfig(config)),
      inject: [ConfigService],
    },
    {
      provide: EVENTBRIDGE_CLIENT,
      useFactory: (config: ConfigService) =>
        createEventBridgeClient(resolveConfig(config)),
      inject: [ConfigService],
    },
  ],
  exports: [SQS_CLIENT, DYNAMODB_CLIENT, S3_CLIENT, EVENTBRIDGE_CLIENT],
})
export class AwsModule {}

function resolveConfig(config: ConfigService): AwsRuntimeConfig {
  return resolveAwsConfigFromConfigService(config);
}
