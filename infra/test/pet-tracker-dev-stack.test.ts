import { App } from 'aws-cdk-lib';
import { Match, Template } from 'aws-cdk-lib/assertions';
import { readFileSync } from 'fs';
import { join } from 'path';
import {
  BUCKET_MEDIA_BASE,
  DETAIL_TYPE_BATTERY_LOW,
  DETAIL_TYPE_POSITION_UPDATED,
  EVENT_BUS_NAME,
  EVENT_SOURCE,
  QUEUE_GEOFENCE_EVENTS,
  QUEUE_GEOFENCE_EVENTS_DLQ,
  QUEUE_NOTIFICATIONS,
  QUEUE_NOTIFICATIONS_DLQ,
  QUEUE_POSITIONS_RAW,
  QUEUE_POSITIONS_RAW_DLQ,
  RULE_GEOFENCE_EVENTS,
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

function eventBusLogicalId(template: Template): string {
  const resources = (template.toJSON() as {
    Resources?: Record<string, SynthesizedResource>;
  }).Resources;
  const match = Object.entries(resources ?? {}).find(
    ([, resource]) =>
      resource.Type === 'AWS::Events::EventBus' &&
      resource.Properties?.Name === EVENT_BUS_NAME,
  );

  if (!match) {
    throw new Error(`event bus ${EVENT_BUS_NAME} no existe en el template`);
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

describe('R10: bus pet-tracker y regla geofence-events con su target', () => {
  it('declara el bus y el patrón exacto sobre una regla habilitada', () => {
    const template = createTemplate();

    template.resourceCountIs('AWS::Events::EventBus', 1);
    template.resourceCountIs('AWS::Events::Rule', 1);
    template.hasResourceProperties('AWS::Events::EventBus', {
      Name: EVENT_BUS_NAME,
    });
    template.hasResourceProperties('AWS::Events::Rule', {
      Name: RULE_GEOFENCE_EVENTS,
      EventBusName: { Ref: eventBusLogicalId(template) },
      State: 'ENABLED',
      EventPattern: {
        source: [EVENT_SOURCE],
        'detail-type': [
          DETAIL_TYPE_POSITION_UPDATED,
          DETAIL_TYPE_BATTERY_LOW,
        ],
      },
    });
  });

  it('apunta un único target a geofence-events sin transformar el sobre', () => {
    const template = createTemplate();

    template.hasResourceProperties('AWS::Events::Rule', {
      Targets: [
        {
          Arn: {
            'Fn::GetAtt': [
              queueLogicalId(template, QUEUE_GEOFENCE_EVENTS),
              'Arn',
            ],
          },
          Id: Match.anyValue(),
          InputTransformer: Match.absent(),
          RoleArn: Match.absent(),
        },
      ],
    });
  });
});

describe('R11: resource-policy de SQS para el target de EventBridge', () => {
  it('autoriza events.amazonaws.com a enviar a geofence-events', () => {
    const template = createTemplate();

    // LocalStack Community no aplica IAM: sin esta aserción el target casa
    // eventos localmente pero la entrega falla silenciosamente en AWS real.
    template.resourceCountIs('AWS::SQS::QueuePolicy', 1);
    template.hasResourceProperties('AWS::SQS::QueuePolicy', {
      Queues: [
        { Ref: queueLogicalId(template, QUEUE_GEOFENCE_EVENTS) },
      ],
      PolicyDocument: {
        Statement: Match.arrayWith([
          Match.objectLike({
            Effect: 'Allow',
            Principal: { Service: 'events.amazonaws.com' },
            Action: Match.arrayWith(['sqs:SendMessage']),
          }),
        ]),
      },
    });
  });
});

describe('R12: removalPolicy Retain en la tabla y Delete en el bucket', () => {
  it('retiene telemetría y elimina el bucket solo cuando está vacío', () => {
    const template = createTemplate();

    template.hasResource('AWS::DynamoDB::Table', {
      DeletionPolicy: 'Retain',
      UpdateReplacePolicy: 'Retain',
    });
    template.hasResource('AWS::S3::Bucket', {
      DeletionPolicy: 'Delete',
      UpdateReplacePolicy: 'Delete',
    });
  });
});

describe('R13: el template declara exactamente 11 recursos de 6 tipos', () => {
  it('compara el inventario completo y rechaza cualquier tipo adicional', () => {
    const resources = (createTemplate().toJSON() as {
      Resources?: Record<string, SynthesizedResource>;
    }).Resources;
    const counts = Object.values(resources ?? {}).reduce<Record<string, number>>(
      (result, resource) => ({
        ...result,
        [resource.Type]: (result[resource.Type] ?? 0) + 1,
      }),
      {},
    );

    expect(counts).toEqual({
      'AWS::SQS::Queue': 6,
      'AWS::SQS::QueuePolicy': 1,
      'AWS::DynamoDB::Table': 1,
      'AWS::S3::Bucket': 1,
      'AWS::Events::EventBus': 1,
      'AWS::Events::Rule': 1,
    });
  });

  it('desactiva el recurso de metadata en los synth del CLI', () => {
    const cdkConfig = JSON.parse(
      readFileSync(join(__dirname, '..', 'cdk.json'), 'utf-8'),
    ) as { versionReporting?: boolean };

    expect(cdkConfig.versionReporting).toBe(false);
  });
});
