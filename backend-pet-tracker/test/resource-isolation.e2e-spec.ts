import { GetQueueUrlCommand, SQSClient } from '@aws-sdk/client-sqs';
import { config as loadDotenv } from 'dotenv';
import {
  createSqsClient,
  resolveAwsConfigFromEnv,
} from '@/aws/aws-clients';
import {
  RESOURCE_SUFFIX_TEST,
  buildResourceNames,
  resolveResourceNamesFromEnv,
} from '@/aws/resource-names';

loadDotenv({ path: '../.env' });

describe('R9: las colas de dev y test tienen URLs distintas', () => {
  let sqs: SQSClient;

  beforeAll(() => {
    sqs = createSqsClient(resolveAwsConfigFromEnv(process.env));
  });

  afterAll(() => sqs.destroy());

  it('resuelve nombres sufijados bajo Jest', () => {
    expect(resolveResourceNamesFromEnv(process.env)).toEqual(
      buildResourceNames(RESOURCE_SUFFIX_TEST),
    );
  });

  it('LocalStack devuelve URLs distintas para positions-raw', async () => {
    const development = buildResourceNames('');
    const test = buildResourceNames(RESOURCE_SUFFIX_TEST);
    const developmentQueue = await sqs.send(
      new GetQueueUrlCommand({ QueueName: development.positionsRaw }),
    );
    const testQueue = await sqs.send(
      new GetQueueUrlCommand({ QueueName: test.positionsRaw }),
    );

    expect(developmentQueue.QueueUrl).toBeDefined();
    expect(testQueue.QueueUrl).toBeDefined();
    expect(testQueue.QueueUrl).not.toBe(developmentQueue.QueueUrl);
  });
});
