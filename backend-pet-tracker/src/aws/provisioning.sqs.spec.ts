import { SQSClient } from '@aws-sdk/client-sqs';
import { provisionQueues } from './provisioning';
import { buildResourceNames } from './resource-names';

const NAMES = buildResourceNames('');

interface FakeCommand {
  constructor: { name: string };
  input: Record<string, unknown>;
}

function buildFakeSqsClient(createdQueueNames: string[]): SQSClient {
  const send = jest.fn((command: FakeCommand) => {
    const commandName = command.constructor.name;

    if (commandName === 'CreateQueueCommand') {
      const queueName = command.input.QueueName as string;
      createdQueueNames.push(queueName);
      return {
        QueueUrl: `http://localhost:4566/000000000000/${queueName}`,
      };
    }

    if (commandName === 'GetQueueAttributesCommand') {
      const queueUrl = command.input.QueueUrl as string;
      const queueName = queueUrl.split('/').pop();
      return {
        Attributes: {
          QueueArn: `arn:aws:sqs:us-east-1:000000000000:${queueName}`,
        },
      };
    }

    throw new Error(`Comando SQS inesperado en el mock: ${commandName}`);
  });

  return { send } as unknown as SQSClient;
}

describe('R9: orden de creación de colas — cada DLQ se crea antes que su cola principal', () => {
  it('crea positions-raw-dlq antes que positions-raw', async () => {
    const createdQueueNames: string[] = [];
    const client = buildFakeSqsClient(createdQueueNames);

    await provisionQueues(client, NAMES);

    const dlqIndex = createdQueueNames.indexOf(NAMES.positionsRawDlq);
    const mainIndex = createdQueueNames.indexOf(NAMES.positionsRaw);

    expect(dlqIndex).toBeGreaterThanOrEqual(0);
    expect(mainIndex).toBeGreaterThan(dlqIndex);
  });

  it('crea notifications-dlq antes que notifications', async () => {
    const createdQueueNames: string[] = [];
    const client = buildFakeSqsClient(createdQueueNames);

    await provisionQueues(client, NAMES);

    const dlqIndex = createdQueueNames.indexOf(NAMES.notificationsDlq);
    const mainIndex = createdQueueNames.indexOf(NAMES.notifications);

    expect(dlqIndex).toBeGreaterThanOrEqual(0);
    expect(mainIndex).toBeGreaterThan(dlqIndex);
  });

  it('crea exactamente las 4 colas', async () => {
    const createdQueueNames: string[] = [];
    const client = buildFakeSqsClient(createdQueueNames);

    const urls = await provisionQueues(client, NAMES);

    expect(Object.keys(urls).sort()).toEqual(
      [
        NAMES.positionsRaw,
        NAMES.positionsRawDlq,
        NAMES.notifications,
        NAMES.notificationsDlq,
      ].sort(),
    );
  });
});
