import { SQSClient } from '@aws-sdk/client-sqs';
import { provisionQueues } from './provisioning';
import {
  QUEUE_NOTIFICATIONS,
  QUEUE_NOTIFICATIONS_DLQ,
  QUEUE_POSITIONS_RAW,
  QUEUE_POSITIONS_RAW_DLQ,
} from './constants';

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

    await provisionQueues(client);

    const dlqIndex = createdQueueNames.indexOf(QUEUE_POSITIONS_RAW_DLQ);
    const mainIndex = createdQueueNames.indexOf(QUEUE_POSITIONS_RAW);

    expect(dlqIndex).toBeGreaterThanOrEqual(0);
    expect(mainIndex).toBeGreaterThan(dlqIndex);
  });

  it('crea notifications-dlq antes que notifications', async () => {
    const createdQueueNames: string[] = [];
    const client = buildFakeSqsClient(createdQueueNames);

    await provisionQueues(client);

    const dlqIndex = createdQueueNames.indexOf(QUEUE_NOTIFICATIONS_DLQ);
    const mainIndex = createdQueueNames.indexOf(QUEUE_NOTIFICATIONS);

    expect(dlqIndex).toBeGreaterThanOrEqual(0);
    expect(mainIndex).toBeGreaterThan(dlqIndex);
  });

  it('crea exactamente las 4 colas', async () => {
    const createdQueueNames: string[] = [];
    const client = buildFakeSqsClient(createdQueueNames);

    const urls = await provisionQueues(client);

    expect(Object.keys(urls).sort()).toEqual(
      [
        QUEUE_POSITIONS_RAW,
        QUEUE_POSITIONS_RAW_DLQ,
        QUEUE_NOTIFICATIONS,
        QUEUE_NOTIFICATIONS_DLQ,
      ].sort(),
    );
  });
});
