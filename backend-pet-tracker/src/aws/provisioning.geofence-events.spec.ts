import { EventBridgeClient } from '@aws-sdk/client-eventbridge';
import { SQSClient } from '@aws-sdk/client-sqs';
import { provisionGeofenceEventsRoute } from './provisioning';
import {
  DETAIL_TYPE_BATTERY_LOW,
  DETAIL_TYPE_POSITION_UPDATED,
  EVENT_BUS_NAME,
  EVENT_SOURCE,
  QUEUE_GEOFENCE_EVENTS,
  QUEUE_GEOFENCE_EVENTS_DLQ,
  RULE_GEOFENCE_EVENTS,
  SQS_MAX_RECEIVE_COUNT,
} from './constants';

interface FakeCommand {
  constructor: { name: string };
  input: Record<string, unknown>;
}

function buildFakeSqsClient(createdQueueNames: string[]): {
  client: SQSClient;
  send: jest.Mock;
} {
  const send = jest.fn((command: FakeCommand) => {
    const commandName = command.constructor.name;

    if (commandName === 'CreateQueueCommand') {
      const queueName = command.input.QueueName as string;
      createdQueueNames.push(queueName);
      return Promise.resolve({
        QueueUrl: `http://localhost:4566/000000000000/${queueName}`,
      });
    }

    if (commandName === 'GetQueueAttributesCommand') {
      const queueUrl = command.input.QueueUrl as string;
      const queueName = queueUrl.split('/').pop();
      return Promise.resolve({
        Attributes: {
          QueueArn: `arn:aws:sqs:us-east-1:000000000000:${queueName}`,
        },
      });
    }

    return Promise.reject(new Error(`Comando SQS inesperado: ${commandName}`));
  });

  return { client: { send } as unknown as SQSClient, send };
}

function buildFakeEventBridgeClient(): {
  client: EventBridgeClient;
  send: jest.Mock;
} {
  const send = jest.fn((command: FakeCommand) => {
    const commandName = command.constructor.name;
    if (commandName === 'PutRuleCommand') {
      return Promise.resolve({
        RuleArn: 'arn:aws:events:us-east-1:000000000000:rule/geofence-events',
      });
    }
    if (commandName === 'PutTargetsCommand') {
      return Promise.resolve({ FailedEntryCount: 0 });
    }
    return Promise.reject(
      new Error(`Comando EventBridge inesperado: ${commandName}`),
    );
  });

  return { client: { send } as unknown as EventBridgeClient, send };
}

describe('R3: cola geofence-events + DLQ, aprovisionamiento idempotente', () => {
  it('crea geofence-events-dlq antes que geofence-events', async () => {
    const createdQueueNames: string[] = [];
    const sqs = buildFakeSqsClient(createdQueueNames);
    const eventBridge = buildFakeEventBridgeClient();

    await provisionGeofenceEventsRoute({
      sqs: sqs.client,
      eventBridge: eventBridge.client,
    });

    const dlqIndex = createdQueueNames.indexOf(QUEUE_GEOFENCE_EVENTS_DLQ);
    const mainIndex = createdQueueNames.indexOf(QUEUE_GEOFENCE_EVENTS);
    expect(dlqIndex).toBeGreaterThanOrEqual(0);
    expect(mainIndex).toBeGreaterThan(dlqIndex);
  });

  it('la cola principal lleva RedrivePolicy con SQS_MAX_RECEIVE_COUNT hacia la DLQ', async () => {
    const createdQueueNames: string[] = [];
    const sqs = buildFakeSqsClient(createdQueueNames);
    const eventBridge = buildFakeEventBridgeClient();

    await provisionGeofenceEventsRoute({
      sqs: sqs.client,
      eventBridge: eventBridge.client,
    });

    const createMainCall = sqs.send.mock.calls.find(
      ([command]: [FakeCommand]) =>
        command.constructor.name === 'CreateQueueCommand' &&
        command.input.QueueName === QUEUE_GEOFENCE_EVENTS,
    ) as [FakeCommand] | undefined;
    expect(createMainCall).toBeDefined();
    const redrivePolicy = JSON.parse(
      (createMainCall![0].input.Attributes as Record<string, string>)
        .RedrivePolicy,
    ) as { deadLetterTargetArn: string; maxReceiveCount: number };
    expect(redrivePolicy.maxReceiveCount).toBe(SQS_MAX_RECEIVE_COUNT);
    expect(redrivePolicy.deadLetterTargetArn).toContain(
      QUEUE_GEOFENCE_EVENTS_DLQ,
    );
  });

  it('correr el aprovisionamiento dos veces seguidas no lanza (idempotente)', async () => {
    const sqs = buildFakeSqsClient([]);
    const eventBridge = buildFakeEventBridgeClient();

    await provisionGeofenceEventsRoute({
      sqs: sqs.client,
      eventBridge: eventBridge.client,
    });
    await expect(
      provisionGeofenceEventsRoute({
        sqs: sqs.client,
        eventBridge: eventBridge.client,
      }),
    ).resolves.toBeUndefined();
  });
});

describe('R4: regla EventBridge sobre pet-tracker con target unico SQS geofence-events, sin RawMessageDelivery', () => {
  it('PutRuleCommand usa el EventPattern {source:[pet-tracker], detail-type:[position.updated, battery.low]} sobre el bus pet-tracker', async () => {
    const sqs = buildFakeSqsClient([]);
    const eventBridge = buildFakeEventBridgeClient();

    await provisionGeofenceEventsRoute({
      sqs: sqs.client,
      eventBridge: eventBridge.client,
    });

    const putRuleCall = eventBridge.send.mock.calls.find(
      ([command]: [FakeCommand]) =>
        command.constructor.name === 'PutRuleCommand',
    ) as [FakeCommand] | undefined;
    expect(putRuleCall).toBeDefined();
    expect(putRuleCall![0].input.Name).toBe(RULE_GEOFENCE_EVENTS);
    expect(putRuleCall![0].input.EventBusName).toBe(EVENT_BUS_NAME);
    expect(
      JSON.parse(putRuleCall![0].input.EventPattern as string) as unknown,
    ).toEqual({
      source: [EVENT_SOURCE],
      'detail-type': [DETAIL_TYPE_POSITION_UPDATED, DETAIL_TYPE_BATTERY_LOW],
    });
  });

  it('PutTargetsCommand define un unico target apuntando al ARN de geofence-events, sin InputTransformer (envelope completo, D2)', async () => {
    const sqs = buildFakeSqsClient([]);
    const eventBridge = buildFakeEventBridgeClient();

    await provisionGeofenceEventsRoute({
      sqs: sqs.client,
      eventBridge: eventBridge.client,
    });

    const putTargetsCall = eventBridge.send.mock.calls.find(
      ([command]: [FakeCommand]) =>
        command.constructor.name === 'PutTargetsCommand',
    ) as [FakeCommand] | undefined;
    expect(putTargetsCall).toBeDefined();
    expect(putTargetsCall![0].input.Rule).toBe(RULE_GEOFENCE_EVENTS);
    expect(putTargetsCall![0].input.EventBusName).toBe(EVENT_BUS_NAME);

    const targets = putTargetsCall![0].input.Targets as Array<{
      Arn: string;
      InputTransformer?: unknown;
    }>;
    expect(targets).toHaveLength(1);
    expect(targets[0].Arn).toContain(QUEUE_GEOFENCE_EVENTS);
    expect(targets[0].InputTransformer).toBeUndefined();
  });

  it('la regla se aprovisiona despues de que la cola exista (PutTargets usa el ARN ya resuelto)', async () => {
    const sqs = buildFakeSqsClient([]);
    const eventBridge = buildFakeEventBridgeClient();

    await provisionGeofenceEventsRoute({
      sqs: sqs.client,
      eventBridge: eventBridge.client,
    });

    const createQueueOrder = sqs.send.mock.invocationCallOrder[0];
    const putTargetsOrder = eventBridge.send.mock.calls.findIndex(
      ([command]: [FakeCommand]) =>
        command.constructor.name === 'PutTargetsCommand',
    );
    const putTargetsCallOrder =
      eventBridge.send.mock.invocationCallOrder[putTargetsOrder];
    expect(createQueueOrder).toBeLessThan(putTargetsCallOrder);
  });

  it('correr el aprovisionamiento dos veces no falla y sigue dejando una unica regla con un target (PutRule/PutTargets son upsert nativos)', async () => {
    const sqs = buildFakeSqsClient([]);
    const eventBridge = buildFakeEventBridgeClient();

    await provisionGeofenceEventsRoute({
      sqs: sqs.client,
      eventBridge: eventBridge.client,
    });
    await provisionGeofenceEventsRoute({
      sqs: sqs.client,
      eventBridge: eventBridge.client,
    });

    const putRuleCalls = eventBridge.send.mock.calls.filter(
      ([command]: [FakeCommand]) =>
        command.constructor.name === 'PutRuleCommand',
    );
    expect(putRuleCalls).toHaveLength(2);
    for (const [command] of putRuleCalls as [FakeCommand][]) {
      expect(command.input.Name).toBe(RULE_GEOFENCE_EVENTS);
    }
  });
});
