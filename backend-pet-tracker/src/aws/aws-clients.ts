import { ConfigService } from '@nestjs/config';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { EventBridgeClient } from '@aws-sdk/client-eventbridge';
import { S3Client } from '@aws-sdk/client-s3';
import { SQSClient } from '@aws-sdk/client-sqs';

export type AwsMode = 'local' | 'aws';

export interface AwsRuntimeConfig {
  mode: AwsMode;
  endpoint: string;
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
}

/**
 * Se lanza cuando falta AWS_ENDPOINT_URL al arrancar el script de
 * provisioning (R2) — evita que el SDK v3 caiga a su endpoint público de
 * AWS real por defecto cuando `endpoint` queda `undefined`.
 */
export class MissingAwsEndpointError extends Error {
  constructor() {
    super(
      'AWS_ENDPOINT_URL no está definida (o está vacía). El script de ' +
        'provisioning se detiene antes de crear ningún recurso: define ' +
        'AWS_ENDPOINT_URL (ej. http://localhost:4566) en el .env raíz — ' +
        'nunca se usa un endpoint de AWS real por defecto.',
    );
    this.name = 'MissingAwsEndpointError';
  }
}

export class UnexpectedAwsEndpointError extends Error {
  constructor() {
    super(
      'AWS_ENDPOINT_URL está definida (valor no vacío) y AWS_MODE=aws. El ' +
        'AWS SDK v3 lee AWS_ENDPOINT_URL de process.env por su cuenta, así ' +
        'que los clientes hablarían con LocalStack creyendo hablar con AWS ' +
        'real: se aborta antes de construir ningún cliente. Comenta ' +
        'AWS_ENDPOINT_URL en el .env raíz para el modo aws, o vuelve a ' +
        'AWS_MODE=local (ver docs/verification.md, feature 21).',
    );
    this.name = 'UnexpectedAwsEndpointError';
  }
}

function assertEndpoint(endpoint: string | undefined): string {
  if (!endpoint || endpoint.trim() === '') {
    throw new MissingAwsEndpointError();
  }
  return endpoint;
}

function assertNoEndpoint(endpoint: string | undefined): string {
  if (endpoint && endpoint.trim() !== '') {
    throw new UnexpectedAwsEndpointError();
  }
  return '';
}

function resolveAwsMode(raw: string | undefined): AwsMode {
  return (raw ?? '').trim().toLowerCase() === 'aws' ? 'aws' : 'local';
}

/**
 * Lee la configuración de los clientes AWS SDK v3 desde `process.env` — la
 * excepción documentada para el script standalone de provisioning
 * (`scripts/provision-local.ts`), que corre fuera del bootstrap de Nest y
 * por lo tanto no tiene ConfigService disponible (mismo patrón que
 * `drizzle.config.ts`, ver design.md). Aborta con MissingAwsEndpointError
 * En modo local aborta si AWS_ENDPOINT_URL falta. En modo aws aborta si la
 * variable está definida, antes de construir cualquier cliente.
 */
export function resolveAwsConfigFromEnv(
  env: NodeJS.ProcessEnv,
): AwsRuntimeConfig {
  const mode = resolveAwsMode(env.AWS_MODE);

  return {
    mode,
    endpoint:
      mode === 'local'
        ? assertEndpoint(env.AWS_ENDPOINT_URL)
        : assertNoEndpoint(env.AWS_ENDPOINT_URL),
    region: env.AWS_REGION ?? '',
    accessKeyId: env.AWS_ACCESS_KEY_ID ?? '',
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY ?? '',
  };
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
    mode: resolveAwsMode(config.get<string>('AWS_MODE')),
    endpoint: config.get<string>('AWS_ENDPOINT_URL') ?? '',
    region: config.get<string>('AWS_REGION') ?? '',
    accessKeyId: config.get<string>('AWS_ACCESS_KEY_ID') ?? '',
    secretAccessKey: config.get<string>('AWS_SECRET_ACCESS_KEY') ?? '',
  };
}

export interface AwsClientOptions {
  endpoint?: string;
  region?: string;
  credentials?: {
    accessKeyId: string;
    secretAccessKey: string;
  };
}

export function resolveAwsClientOptions(
  config: AwsRuntimeConfig,
): AwsClientOptions {
  if (config.mode === 'aws') {
    return config.region === '' ? {} : { region: config.region };
  }

  return {
    endpoint: config.endpoint,
    region: config.region,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
  };
}

export function createSqsClient(config: AwsRuntimeConfig): SQSClient {
  return new SQSClient(resolveAwsClientOptions(config));
}

export function createDynamoDbClient(config: AwsRuntimeConfig): DynamoDBClient {
  return new DynamoDBClient(resolveAwsClientOptions(config));
}

export function createS3Client(config: AwsRuntimeConfig): S3Client {
  return new S3Client({
    ...resolveAwsClientOptions(config),
    // LocalStack no resuelve bien el estilo virtual-hosted (bucket.localhost);
    // path-style (localhost/bucket) es lo que LocalStack community espera.
    ...(config.mode === 'local' ? { forcePathStyle: true } : {}),
  });
}

export function createEventBridgeClient(
  config: AwsRuntimeConfig,
): EventBridgeClient {
  return new EventBridgeClient(resolveAwsClientOptions(config));
}
