import { ConfigService } from '@nestjs/config';
import {
  AwsRuntimeConfig,
  MissingAwsEndpointError,
  createDynamoDbClient,
  createEventBridgeClient,
  createS3Client,
  createSqsClient,
  resolveAwsClientOptions,
  resolveAwsConfigFromConfigService,
  resolveAwsConfigFromEnv,
} from './aws-clients';

const ENDPOINT = 'http://localhost:4566';

function buildConfigServiceMock(env: NodeJS.ProcessEnv): ConfigService {
  return {
    get: (key: string) => env[key],
  } as unknown as ConfigService;
}

function buildAwsConfig(
  overrides: Partial<AwsRuntimeConfig> = {},
): AwsRuntimeConfig {
  return {
    mode: 'aws',
    endpoint: ENDPOINT,
    region: 'test-region',
    accessKeyId: 'test-access-key',
    secretAccessKey: 'test-secret-key',
    ...overrides,
  };
}

describe('R1: AWS_MODE resuelve el modo con default local', () => {
  it.each([
    [undefined, 'local'],
    ['', 'local'],
    ['  ', 'local'],
    ['local', 'local'],
    ['LOCAL', 'local'],
    ['production', 'local'],
    ['aws', 'aws'],
    ['AWS', 'aws'],
    [' aws ', 'aws'],
  ] as const)('resuelve %p como %s', (rawMode, expectedMode) => {
    const env = {
      AWS_MODE: rawMode,
      AWS_ENDPOINT_URL: expectedMode === 'local' ? ENDPOINT : undefined,
    };

    expect(resolveAwsConfigFromEnv(env).mode).toBe(expectedMode);
    expect(
      resolveAwsConfigFromConfigService(buildConfigServiceMock(env)).mode,
    ).toBe(expectedMode);
  });
});

describe('R2: modo local construye las opciones actuales', () => {
  it('conserva endpoint, region y credenciales con exactamente esas claves', () => {
    const config = resolveAwsConfigFromEnv({
      AWS_MODE: 'local',
      AWS_ENDPOINT_URL: ENDPOINT,
      AWS_REGION: 'test-region',
      AWS_ACCESS_KEY_ID: 'test-access-key',
      AWS_SECRET_ACCESS_KEY: 'test-secret-key',
    });

    const options = resolveAwsClientOptions(config);

    expect(Object.keys(options).sort()).toEqual([
      'credentials',
      'endpoint',
      'region',
    ]);
    expect(options).toEqual({
      endpoint: ENDPOINT,
      region: 'test-region',
      credentials: {
        accessKeyId: 'test-access-key',
        secretAccessKey: 'test-secret-key',
      },
    });
  });
});

describe('R3: modo aws construye los 4 clientes sin endpoint', () => {
  it.each([
    ['SQS', createSqsClient],
    ['DynamoDB', createDynamoDbClient],
    ['S3', createS3Client],
    ['EventBridge', createEventBridgeClient],
  ] as const)('omite el endpoint custom en %s', (_name, factory) => {
    const client = factory(buildAwsConfig());

    expect(client.config.endpoint).toBeUndefined();

    client.destroy();
  });
});

describe('R4: modo aws no pasa credentials explicitas', () => {
  it('omite por completo la clave credentials', () => {
    const options = resolveAwsClientOptions(buildAwsConfig());

    expect('credentials' in options).toBe(false);
  });
});

describe('R5: modo aws pasa region solo si tiene valor', () => {
  it('incluye la region configurada', () => {
    const options = resolveAwsClientOptions(
      buildAwsConfig({ region: 'selected-region' }),
    );

    expect(options.region).toBe('selected-region');
  });

  it.each([undefined, ''])('omite region cuando AWS_REGION es %p', (region) => {
    const config = resolveAwsConfigFromEnv({
      AWS_MODE: 'aws',
      AWS_REGION: region,
    });
    const options = resolveAwsClientOptions(config);

    expect('region' in options).toBe(false);
  });
});

describe('R6: forcePathStyle solo en modo local', () => {
  it('lo activa para LocalStack y conserva el default del SDK en aws', () => {
    const localClient = createS3Client(
      resolveAwsConfigFromEnv({
        AWS_ENDPOINT_URL: ENDPOINT,
        AWS_REGION: 'test-region',
      }),
    );
    const awsClient = createS3Client(buildAwsConfig());

    expect(localClient.config.forcePathStyle).toBe(true);
    expect(awsClient.config.forcePathStyle).toBe(false);

    localClient.destroy();
    awsClient.destroy();
  });
});

describe('R7: MissingAwsEndpointError solo en modo local', () => {
  it('permite modo aws sin AWS_ENDPOINT_URL', () => {
    expect(resolveAwsConfigFromEnv({ AWS_MODE: 'aws' })).toMatchObject({
      mode: 'aws',
      endpoint: '',
    });
  });

  it.each([undefined, 'local'])('mantiene el error con AWS_MODE=%p', (mode) => {
    expect(() => resolveAwsConfigFromEnv({ AWS_MODE: mode })).toThrow(
      MissingAwsEndpointError,
    );
  });
});
