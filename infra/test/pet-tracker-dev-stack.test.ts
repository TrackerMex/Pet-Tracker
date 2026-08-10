import { App } from 'aws-cdk-lib';
import { Match, Template } from 'aws-cdk-lib/assertions';
import {
  QUEUE_GEOFENCE_EVENTS,
  QUEUE_GEOFENCE_EVENTS_DLQ,
  QUEUE_NOTIFICATIONS,
  QUEUE_NOTIFICATIONS_DLQ,
  QUEUE_POSITIONS_RAW,
  QUEUE_POSITIONS_RAW_DLQ,
  SQS_MAX_RECEIVE_COUNT,
} from '@backend/aws/constants';
import {
  DEV_REGION,
  PetTrackerDevStack,
} from '../lib/pet-tracker-dev-stack';

interface SynthesizedResource {
  readonly Type: string;
  readonly Properties?: Record<string, unknown>;
}

function createStack(): PetTrackerDevStack {
  return new PetTrackerDevStack(new App(), 'PetTrackerDev', {
    env: { region: DEV_REGION },
  });
}

function createTemplate(): Template {
  return Template.fromStack(createStack());
}

function queueLogicalId(template: Template, queueName: string): string {
  const resources = (template.toJSON() as {
    Resources?: Record<string, SynthesizedResource>;
  }).Resources;
  const match = Object.entries(resources ?? {}).find(
    ([, resource]) =>
      resource.Type === 'AWS::SQS::Queue' &&
      resource.Properties?.QueueName === queueName,
  );

  if (!match) {
    throw new Error(`queue ${queueName} no existe en el template`);
  }

  return match[0];
}

describe('R1: el stack sintetiza sin credenciales AWS', () => {
  it('construye el template en memoria sin consultar la cuenta', () => {
    const stack = createStack();

    expect(() => Template.fromStack(stack)).not.toThrow();
  });
});

describe('R7: seis colas SQS con RedrivePolicy hacia su DLQ', () => {
  it('declara los seis nombres exactos', () => {
    const template = createTemplate();
    const queueNames = [
      QUEUE_POSITIONS_RAW,
      QUEUE_POSITIONS_RAW_DLQ,
      QUEUE_NOTIFICATIONS,
      QUEUE_NOTIFICATIONS_DLQ,
      QUEUE_GEOFENCE_EVENTS,
      QUEUE_GEOFENCE_EVENTS_DLQ,
    ];

    template.resourceCountIs('AWS::SQS::Queue', 6);
    for (const queueName of queueNames) {
      template.hasResourceProperties('AWS::SQS::Queue', { QueueName: queueName });
    }
  });

  it('enlaza cada cola principal con su propia DLQ', () => {
    const template = createTemplate();
    const pairs = [
      [QUEUE_POSITIONS_RAW, QUEUE_POSITIONS_RAW_DLQ],
      [QUEUE_NOTIFICATIONS, QUEUE_NOTIFICATIONS_DLQ],
      [QUEUE_GEOFENCE_EVENTS, QUEUE_GEOFENCE_EVENTS_DLQ],
    ] as const;

    for (const [queueName, deadLetterQueueName] of pairs) {
      template.hasResourceProperties('AWS::SQS::Queue', {
        QueueName: queueName,
        RedrivePolicy: {
          deadLetterTargetArn: {
            'Fn::GetAtt': [queueLogicalId(template, deadLetterQueueName), 'Arn'],
          },
          maxReceiveCount: SQS_MAX_RECEIVE_COUNT,
        },
      });
      template.hasResourceProperties('AWS::SQS::Queue', {
        QueueName: deadLetterQueueName,
        RedrivePolicy: Match.absent(),
      });
    }
  });
});
