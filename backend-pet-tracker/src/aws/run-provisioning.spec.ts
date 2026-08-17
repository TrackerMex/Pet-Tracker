import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { EventBridgeClient } from '@aws-sdk/client-eventbridge';
import { S3Client } from '@aws-sdk/client-s3';
import { SQSClient } from '@aws-sdk/client-sqs';
import * as awsClients from './aws-clients';
import { RESOURCE_SUFFIX_TEST, buildResourceNames } from './resource-names';
import { runProvisioning } from './run-provisioning';

function silentLogger(): { error: jest.Mock } {
  return { error: jest.fn() };
}

describe('R6: runProvisioning crea los dos juegos de recursos', () => {
  it('envia comandos de creacion para los veinte nombres', async () => {
    const createdNames: string[] = [];
    const sqs = fakeClient((command) => {
      if (command.constructor.name === 'CreateQueueCommand') {
        const name = command.input.QueueName as string;
        createdNames.push(name);
        return { QueueUrl: `http://localhost:4566/000000000000/${name}` };
      }
      if (command.constructor.name === 'GetQueueAttributesCommand') {
        const name = (command.input.QueueUrl as string).split('/').pop();
        return { Attributes: { QueueArn: `arn:aws:sqs:::${name}` } };
      }
      throw new Error(`unexpected SQS command: ${command.constructor.name}`);
    });
    const dynamoDb = fakeClient((command) => {
      if (command.constructor.name === 'CreateTableCommand') {
        createdNames.push(command.input.TableName as string);
      }
      if (command.constructor.name === 'DescribeTableCommand') {
        return { Table: { TableStatus: 'ACTIVE' } };
      }
      return {};
    });
    const s3 = fakeClient((command) => {
      if (command.constructor.name === 'CreateBucketCommand') {
        createdNames.push(command.input.Bucket as string);
      }
      return {};
    });
    const eventBridge = fakeClient((command) => {
      if (command.constructor.name === 'CreateEventBusCommand') {
        createdNames.push(command.input.Name as string);
      }
      if (command.constructor.name === 'PutRuleCommand') {
        createdNames.push(command.input.Name as string);
      }
      return {};
    });
    const spies = [
      jest
        .spyOn(awsClients, 'createSqsClient')
        .mockReturnValue(sqs as unknown as SQSClient),
      jest
        .spyOn(awsClients, 'createDynamoDbClient')
        .mockReturnValue(dynamoDb as unknown as DynamoDBClient),
      jest
        .spyOn(awsClients, 'createS3Client')
        .mockReturnValue(s3 as unknown as S3Client),
      jest
        .spyOn(awsClients, 'createEventBridgeClient')
        .mockReturnValue(eventBridge as unknown as EventBridgeClient),
    ];

    try {
      await expect(
        runProvisioning({ AWS_ENDPOINT_URL: 'http://localhost:4566' }),
      ).resolves.toBe(0);

      expect(createdNames.sort()).toEqual(
        [
          ...Object.values(buildResourceNames('')),
          ...Object.values(buildResourceNames(RESOURCE_SUFFIX_TEST)),
        ].sort(),
      );
    } finally {
      for (const spy of spies) spy.mockRestore();
    }
  });
});

interface FakeCommand {
  constructor: { name: string };
  input: Record<string, unknown>;
}

function fakeClient(handle: (command: FakeCommand) => object): {
  send: jest.Mock;
  destroy: jest.Mock;
} {
  return { send: jest.fn(handle), destroy: jest.fn() };
}

describe('R2: runProvisioning aborta antes de construir clientes si falta AWS_ENDPOINT_URL', () => {
  it('devuelve código de salida 1 y reporta el error sin construir ningún cliente', async () => {
    const logger = silentLogger();

    const exitCode = await runProvisioning({}, logger);

    expect(exitCode).toBe(1);
    expect(logger.error).toHaveBeenCalledWith(
      expect.stringMatching(/AWS_ENDPOINT_URL/),
    );
  });
});

describe('R8: runProvisioning aborta en modo aws', () => {
  it('devuelve 1 y registra AWS_MODE antes de construir clientes', async () => {
    const logger = silentLogger();
    const createSqsClient = jest
      .spyOn(awsClients, 'createSqsClient')
      .mockImplementation(() => {
        throw new Error('client constructed');
      });

    try {
      const exitCode = await runProvisioning(
        { AWS_MODE: 'aws', AWS_REGION: 'us-east-1' },
        logger,
      );

      expect(exitCode).toBe(1);
      expect(logger.error).toHaveBeenCalledWith(
        expect.stringMatching(/AWS_MODE/),
      );
      expect(createSqsClient).not.toHaveBeenCalled();
    } finally {
      createSqsClient.mockRestore();
    }
  });
});

describe('R16: runProvisioning devuelve código de salida != 0 con un mensaje claro si LocalStack no está levantado', () => {
  it('reporta el problema de conexión y termina con exit code 1 (endpoint real, puerto cerrado)', async () => {
    const logger = silentLogger();

    const exitCode = await runProvisioning(
      {
        AWS_ENDPOINT_URL: 'http://localhost:1',
        AWS_REGION: 'us-east-1',
        AWS_ACCESS_KEY_ID: 'test',
        AWS_SECRET_ACCESS_KEY: 'test',
      },
      logger,
    );

    expect(exitCode).toBe(1);
    expect(logger.error).toHaveBeenCalledWith(
      expect.stringMatching(/LocalStack/),
    );
  }, 15000);
});
