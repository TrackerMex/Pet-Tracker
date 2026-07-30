import { ConfigService } from '@nestjs/config';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { EventBridgeClient } from '@aws-sdk/client-eventbridge';
import { S3Client } from '@aws-sdk/client-s3';
import { SQSClient } from '@aws-sdk/client-sqs';

export interface AwsRuntimeConfig {
  endpoint: string;
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
}

/**
 * Lee la configuración de los clientes AWS SDK v3 desde ConfigService — la
 * única vía dentro del runtime NestJS (nunca process.env directo, ver
 * docs/conventions.md). El script standalone de provisioning usa
 * resolveAwsConfigFromEnv en su lugar (excepción documentada, igual que
 * drizzle.config.ts).
 */
export function resolveAwsConfigFromConfigService(
  config: ConfigService,
): AwsRuntimeConfig {
  return {
    endpoint: config.get<string>('AWS_ENDPOINT_URL') ?? '',
    region: config.get<string>('AWS_REGION') ?? '',
    accessKeyId: config.get<string>('AWS_ACCESS_KEY_ID') ?? '',
    secretAccessKey: config.get<string>('AWS_SECRET_ACCESS_KEY') ?? '',
  };
}

function credentials(config: AwsRuntimeConfig): {
  accessKeyId: string;
  secretAccessKey: string;
} {
  return {
    accessKeyId: config.accessKeyId,
    secretAccessKey: config.secretAccessKey,
  };
}

export function createSqsClient(config: AwsRuntimeConfig): SQSClient {
  return new SQSClient({
    endpoint: config.endpoint,
    region: config.region,
    credentials: credentials(config),
  });
}

export function createDynamoDbClient(config: AwsRuntimeConfig): DynamoDBClient {
  return new DynamoDBClient({
    endpoint: config.endpoint,
    region: config.region,
    credentials: credentials(config),
  });
}

export function createS3Client(config: AwsRuntimeConfig): S3Client {
  return new S3Client({
    endpoint: config.endpoint,
    region: config.region,
    credentials: credentials(config),
    // LocalStack no resuelve bien el estilo virtual-hosted (bucket.localhost);
    // path-style (localhost/bucket) es lo que LocalStack community espera.
    forcePathStyle: true,
  });
}

export function createEventBridgeClient(
  config: AwsRuntimeConfig,
): EventBridgeClient {
  return new EventBridgeClient({
    endpoint: config.endpoint,
    region: config.region,
    credentials: credentials(config),
  });
}
