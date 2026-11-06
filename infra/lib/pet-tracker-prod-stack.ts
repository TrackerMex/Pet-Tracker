import * as s3 from 'aws-cdk-lib/aws-s3';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as events from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import {
  QUEUE_POSITIONS_RAW, QUEUE_POSITIONS_RAW_DLQ,
  QUEUE_NOTIFICATIONS, QUEUE_NOTIFICATIONS_DLQ,
  QUEUE_GEOFENCE_EVENTS, QUEUE_GEOFENCE_EVENTS_DLQ,
  SQS_MAX_RECEIVE_COUNT, EVENT_BUS_NAME, EVENT_SOURCE,
  BUCKET_MEDIA_BASE, resourceName,
  TABLE_POSITIONS, TABLE_POSITIONS_PARTITION_KEY, TABLE_POSITIONS_SORT_KEY, TABLE_POSITIONS_TTL_ATTRIBUTE,
  DETAIL_TYPE_POSITION_UPDATED, DETAIL_TYPE_BATTERY_LOW, RULE_GEOFENCE_EVENTS,
} from '@backend/aws/constants';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Aws, Duration, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';

export interface PetTrackerProdStackProps extends StackProps {
  readonly env: { readonly region: string; readonly account?: string };
  readonly apiDomain: string;
  readonly hostedZoneId: string;
  readonly hostedZoneName: string;
  readonly alarmEmail: string;
  readonly resendFrom: string;
  readonly resetLinkHost: string;
  readonly imageDirectory: string;
}

export class PetTrackerProdStack extends Stack {
  constructor(scope: Construct, id: string, props: PetTrackerProdStackProps) {
    super(scope, id, props);
    if (props.apiDomain !== props.hostedZoneName && !props.apiDomain.endsWith(`.${props.hostedZoneName}`)) {
      throw new Error(`apiDomain "${props.apiDomain}" is not inside hosted zone "${props.hostedZoneName}"`);
    }
    new ec2.Vpc(this, 'Vpc', {
      availabilityZones: [`${this.region}a`, `${this.region}b`, `${this.region}c`],
      natGateways: 0,
      subnetConfiguration: [
        { name: 'public', subnetType: ec2.SubnetType.PUBLIC },
        { name: 'isolated', subnetType: ec2.SubnetType.PRIVATE_ISOLATED },
      ],
      gatewayEndpoints: {
        S3: { service: ec2.GatewayVpcEndpointAwsService.S3 },
        DynamoDB: { service: ec2.GatewayVpcEndpointAwsService.DYNAMODB },
      },
    });
    const positionsRawDlq = new sqs.Queue(this, 'PositionsRawDlq', {
      queueName: QUEUE_POSITIONS_RAW_DLQ, retentionPeriod: Duration.days(14),
    });
    new sqs.Queue(this, 'PositionsRaw', {
      queueName: QUEUE_POSITIONS_RAW,
      deadLetterQueue: { queue: positionsRawDlq, maxReceiveCount: SQS_MAX_RECEIVE_COUNT },
    });
    const notificationsDlq = new sqs.Queue(this, 'NotificationsDlq', {
      queueName: QUEUE_NOTIFICATIONS_DLQ, retentionPeriod: Duration.days(14),
    });
    new sqs.Queue(this, 'Notifications', {
      queueName: QUEUE_NOTIFICATIONS,
      deadLetterQueue: { queue: notificationsDlq, maxReceiveCount: SQS_MAX_RECEIVE_COUNT },
    });
    const geofenceEventsDlq = new sqs.Queue(this, 'GeofenceEventsDlq', {
      queueName: QUEUE_GEOFENCE_EVENTS_DLQ, retentionPeriod: Duration.days(14),
    });
    const geofenceEventsQueue = new sqs.Queue(this, 'GeofenceEvents', {
      queueName: QUEUE_GEOFENCE_EVENTS,
      deadLetterQueue: { queue: geofenceEventsDlq, maxReceiveCount: SQS_MAX_RECEIVE_COUNT },
    });
    const eventBus = new events.EventBus(this, 'EventBus', { eventBusName: EVENT_BUS_NAME });
    const geofenceEventsRule = new events.Rule(this, 'GeofenceEventsRule', {
      eventBus, ruleName: RULE_GEOFENCE_EVENTS,
      eventPattern: { source: [EVENT_SOURCE], detailType: [DETAIL_TYPE_POSITION_UPDATED, DETAIL_TYPE_BATTERY_LOW] },
    });
    geofenceEventsRule.addTarget(new targets.SqsQueue(geofenceEventsQueue));
    new dynamodb.TableV2(this, 'PositionsTable', {
      tableName: TABLE_POSITIONS,
      billing: dynamodb.Billing.onDemand(),
      partitionKey: { name: TABLE_POSITIONS_PARTITION_KEY, type: dynamodb.AttributeType.STRING },
      sortKey: { name: TABLE_POSITIONS_SORT_KEY, type: dynamodb.AttributeType.NUMBER },
      timeToLiveAttribute: TABLE_POSITIONS_TTL_ATTRIBUTE,
      pointInTimeRecoverySpecification: { pointInTimeRecoveryEnabled: true },
      deletionProtection: true,
      removalPolicy: RemovalPolicy.RETAIN,
    });
    new s3.Bucket(this, 'MediaBucket', {
      bucketName: resourceName(BUCKET_MEDIA_BASE, `prod-${this.region}-${Aws.ACCOUNT_ID}`),
      versioned: true,
      encryption: s3.BucketEncryption.S3_MANAGED,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      enforceSSL: true,
      removalPolicy: RemovalPolicy.RETAIN,
      lifecycleRules: [{ noncurrentVersionExpiration: Duration.days(30), expiredObjectDeleteMarker: true }],
    });
  }
}
