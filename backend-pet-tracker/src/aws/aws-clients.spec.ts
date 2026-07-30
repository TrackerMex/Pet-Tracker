import { ConfigService } from '@nestjs/config';
import {
  createDynamoDbClient,
  createEventBridgeClient,
  createS3Client,
  createSqsClient,
  resolveAwsConfigFromConfigService,
} from './aws-clients';

const ENV_VALUES: Record<string, string> = {
  AWS_ENDPOINT_URL: 'http://localhost:4566',
  AWS_REGION: 'us-east-1',
  AWS_ACCESS_KEY_ID: 'test',
  AWS_SECRET_ACCESS_KEY: 'test',
};

function buildConfigServiceMock(): ConfigService {
  return {
    get: (key: string) => ENV_VALUES[key],
  } as unknown as ConfigService;
}

describe('R1: clientes AWS SDK v3 construidos con endpoint desde ConfigService', () => {
  const config = resolveAwsConfigFromConfigService(buildConfigServiceMock());

  it.each([
    ['SQS', createSqsClient],
    ['DynamoDB', createDynamoDbClient],
    ['S3', createS3Client],
    ['EventBridge', createEventBridgeClient],
  ] as const)(
    'el cliente %s resuelve su endpoint al valor de AWS_ENDPOINT_URL',
    async (_name, factory) => {
      const client = factory(config);
      if (!client.config.endpoint) {
        throw new Error('El cliente no resolvió un endpoint custom');
      }
      const resolvedEndpoint = await client.config.endpoint();

      expect(resolvedEndpoint.hostname).toBe('localhost');
      expect(resolvedEndpoint.port).toBe(4566);
      expect(resolvedEndpoint.protocol).toBe('http:');

      client.destroy();
    },
  );
});
