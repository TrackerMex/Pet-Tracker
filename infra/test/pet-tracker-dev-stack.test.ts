import { App } from 'aws-cdk-lib';
import { Match, Template } from 'aws-cdk-lib/assertions';
import {
  BUCKET_MEDIA_BASE,
  QUEUE_GEOFENCE_EVENTS,
  QUEUE_GEOFENCE_EVENTS_DLQ,
  QUEUE_NOTIFICATIONS,
  QUEUE_NOTIFICATIONS_DLQ,
  QUEUE_POSITIONS_RAW,
  QUEUE_POSITIONS_RAW_DLQ,
  SQS_MAX_RECEIVE_COUNT,
  TABLE_POSITIONS,
  TABLE_POSITIONS_PARTITION_KEY,
  TABLE_POSITIONS_SORT_KEY,
  TABLE_POSITIONS_TTL_ATTRIBUTE,
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

describe('R8: tabla positions PROVISIONED 25/25 STANDARD con TTL', () => {
  it('declara capacidad, clase, claves y expiración exactas', () => {
    const template = createTemplate();

    template.resourceCountIs('AWS::DynamoDB::Table', 1);
    template.resourceCountIs('AWS::DynamoDB::GlobalTable', 0);
    template.hasResourceProperties('AWS::DynamoDB::Table', {
      TableName: TABLE_POSITIONS,
      BillingMode: 'PROVISIONED',
      ProvisionedThroughput: {
        ReadCapacityUnits: 25,
        WriteCapacityUnits: 25,
      },
      TableClass: 'STANDARD',
      KeySchema: [
        { AttributeName: TABLE_POSITIONS_PARTITION_KEY, KeyType: 'HASH' },
        { AttributeName: TABLE_POSITIONS_SORT_KEY, KeyType: 'RANGE' },
      ],
      AttributeDefinitions: [
        {
          AttributeName: TABLE_POSITIONS_PARTITION_KEY,
          AttributeType: 'S',
        },
        { AttributeName: TABLE_POSITIONS_SORT_KEY, AttributeType: 'N' },
      ],
      TimeToLiveSpecification: {
        AttributeName: TABLE_POSITIONS_TTL_ATTRIBUTE,
        Enabled: true,
      },
    });
  });

  it('no activa backups, KMS ni índices secundarios', () => {
    const template = createTemplate();

    template.hasResourceProperties('AWS::DynamoDB::Table', {
      PointInTimeRecoverySpecification: Match.absent(),
      SSESpecification: Match.absent(),
      GlobalSecondaryIndexes: Match.absent(),
      LocalSecondaryIndexes: Match.absent(),
    });
  });
});

describe('R9: bucket de media con nombre por account-id y PublicAccessBlock', () => {
  it('compone el nombre sin resolver la cuenta y bloquea acceso público', () => {
    const template = createTemplate();

    template.resourceCountIs('AWS::S3::Bucket', 1);
    template.hasResourceProperties('AWS::S3::Bucket', {
      BucketName: {
        'Fn::Join': [
          '',
          [`${BUCKET_MEDIA_BASE}-dev-`, { Ref: 'AWS::AccountId' }],
        ],
      },
      PublicAccessBlockConfiguration: {
        BlockPublicAcls: true,
        BlockPublicPolicy: true,
        IgnorePublicAcls: true,
        RestrictPublicBuckets: true,
      },
    });
    template.resourceCountIs('AWS::S3::BucketPolicy', 0);
  });
});
