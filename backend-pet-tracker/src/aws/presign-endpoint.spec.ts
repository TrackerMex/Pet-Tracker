import type { ConfigService } from '@nestjs/config';
import {
  UnexpectedAwsEndpointError,
  createDynamoDbClient,
  createEventBridgeClient,
  createS3Client,
  createSqsClient,
  resolveAwsConfigFromConfigService,
  resolveAwsConfigFromEnv,
} from './aws-clients';

const LOCAL_ENDPOINT = 'http://localhost:4566';
const PRESIGN_ENDPOINT = 'http://192.168.7.42:4566';
const REGION = 'us-east-1';
const ACCESS_KEY_ID = 'test-access-key';
const SECRET_ACCESS_KEY = 'test-secret-key';

function buildConfigServiceMock(
  values: Record<string, string | undefined>,
): ConfigService {
  return {
    get: (key: string) => values[key],
  } as unknown as ConfigService;
}

function buildLocalConfigService(
  presignEndpoint: string | undefined,
): ConfigService {
  return buildConfigServiceMock({
    AWS_MODE: 'local',
    AWS_ENDPOINT_URL: LOCAL_ENDPOINT,
    AWS_PRESIGN_ENDPOINT_URL: presignEndpoint,
    AWS_REGION: REGION,
    AWS_ACCESS_KEY_ID: ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: SECRET_ACCESS_KEY,
  });
}

describe('R1: modo local firma S3 con AWS_PRESIGN_ENDPOINT_URL', () => {
  it('construye S3 con el endpoint LAN recortado y conserva su configuración local', async () => {
    const config = resolveAwsConfigFromConfigService(
      buildLocalConfigService(`  ${PRESIGN_ENDPOINT}  `),
    );
    const s3 = createS3Client(config);

    expect(config.presignEndpoint).toBe(PRESIGN_ENDPOINT);
    expect(s3.config.endpoint).toBeDefined();
    const endpoint = await s3.config.endpoint!();
    expect(endpoint.hostname).toBe('192.168.7.42');
    expect(endpoint.port).toBe(4566);
    expect(endpoint.protocol).toBe('http:');
    expect(s3.config.forcePathStyle).toBe(true);
    await expect(s3.config.region()).resolves.toBe(REGION);
    await expect(s3.config.credentials()).resolves.toMatchObject({
      accessKeyId: ACCESS_KEY_ID,
      secretAccessKey: SECRET_ACCESS_KEY,
    });

    s3.destroy();
  });

  it.each([
    ['SQS', createSqsClient],
    ['DynamoDB', createDynamoDbClient],
    ['EventBridge', createEventBridgeClient],
  ] as const)(
    'mantiene %s en AWS_ENDPOINT_URL',
    async (_name, createClient) => {
      const config = resolveAwsConfigFromConfigService(
        buildLocalConfigService(PRESIGN_ENDPOINT),
      );
      const client = createClient(config);

      expect(client.config.endpoint).toBeDefined();
      const endpoint = await client.config.endpoint!();
      expect(endpoint.hostname).toBe('localhost');
      expect(endpoint.port).toBe(4566);
      expect(endpoint.protocol).toBe('http:');

      client.destroy();
    },
  );
});

describe('R2: sin AWS_PRESIGN_ENDPOINT_URL el comportamiento actual no cambia', () => {
  it.each([undefined, '', '   '])(
    'usa AWS_ENDPOINT_URL cuando el valor es %p',
    async (presignEndpoint) => {
      const config = resolveAwsConfigFromConfigService(
        buildLocalConfigService(presignEndpoint),
      );
      const s3 = createS3Client(config);

      expect(config.presignEndpoint).toBeUndefined();
      expect(s3.config.endpoint).toBeDefined();
      const endpoint = await s3.config.endpoint!();
      expect(endpoint.hostname).toBe('localhost');
      expect(endpoint.port).toBe(4566);
      expect(endpoint.protocol).toBe('http:');
      expect(s3.config.forcePathStyle).toBe(true);

      s3.destroy();
    },
  );

  it('resolveAwsConfigFromEnv ignora la variable aunque esté presente', async () => {
    const config = resolveAwsConfigFromEnv({
      AWS_MODE: 'local',
      AWS_ENDPOINT_URL: LOCAL_ENDPOINT,
      AWS_PRESIGN_ENDPOINT_URL: PRESIGN_ENDPOINT,
      AWS_REGION: REGION,
      AWS_ACCESS_KEY_ID: ACCESS_KEY_ID,
      AWS_SECRET_ACCESS_KEY: SECRET_ACCESS_KEY,
    });
    const s3 = createS3Client(config);

    expect(config.presignEndpoint).toBeUndefined();
    expect(s3.config.endpoint).toBeDefined();
    const endpoint = await s3.config.endpoint!();
    expect(endpoint.hostname).toBe('localhost');
    expect(endpoint.port).toBe(4566);

    s3.destroy();
  });
});

describe('R3: modo aws sigue intacto e ignora AWS_PRESIGN_ENDPOINT_URL', () => {
  it('mantiene la guarda de AWS_ENDPOINT_URL', () => {
    expect(() =>
      resolveAwsConfigFromConfigService(
        buildConfigServiceMock({
          AWS_MODE: 'aws',
          AWS_ENDPOINT_URL: LOCAL_ENDPOINT,
          AWS_PRESIGN_ENDPOINT_URL: PRESIGN_ENDPOINT,
        }),
      ),
    ).toThrow(UnexpectedAwsEndpointError);
  });

  it('ignora el endpoint de firma y construye S3 sin endpoint custom', () => {
    const config = resolveAwsConfigFromConfigService(
      buildConfigServiceMock({
        AWS_MODE: 'aws',
        AWS_PRESIGN_ENDPOINT_URL: PRESIGN_ENDPOINT,
        AWS_REGION: REGION,
      }),
    );
    const s3 = createS3Client(config);

    expect(config.presignEndpoint).toBeUndefined();
    expect(s3.config.endpoint).toBeUndefined();
    expect(s3.config.forcePathStyle).toBe(false);

    s3.destroy();
  });
});
