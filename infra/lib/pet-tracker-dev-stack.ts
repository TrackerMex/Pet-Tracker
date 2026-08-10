import { Aws, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as events from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import { Construct } from 'constructs';
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
  resourceName,
  RULE_GEOFENCE_EVENTS,
  SQS_MAX_RECEIVE_COUNT,
  TABLE_POSITIONS,
  TABLE_POSITIONS_PARTITION_KEY,
  TABLE_POSITIONS_SORT_KEY,
  TABLE_POSITIONS_TTL_ATTRIBUTE,
} from '@backend/aws/constants';

export const DEV_REGION = 'us-east-1';
const ENV_NAME = 'dev';
const ENV_SUFFIX = '';

export class PetTrackerDevStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const positionsRawDlq = new sqs.Queue(this, 'PositionsRawDlq', {
      queueName: resourceName(QUEUE_POSITIONS_RAW_DLQ, ENV_SUFFIX),
    });
    new sqs.Queue(this, 'PositionsRaw', {
      queueName: resourceName(QUEUE_POSITIONS_RAW, ENV_SUFFIX),
      deadLetterQueue: {
        queue: positionsRawDlq,
        maxReceiveCount: SQS_MAX_RECEIVE_COUNT,
      },
    });

    const notificationsDlq = new sqs.Queue(this, 'NotificationsDlq', {
      queueName: resourceName(QUEUE_NOTIFICATIONS_DLQ, ENV_SUFFIX),
    });
    new sqs.Queue(this, 'Notifications', {
      queueName: resourceName(QUEUE_NOTIFICATIONS, ENV_SUFFIX),
      deadLetterQueue: {
        queue: notificationsDlq,
        maxReceiveCount: SQS_MAX_RECEIVE_COUNT,
      },
    });

    const geofenceEventsDlq = new sqs.Queue(this, 'GeofenceEventsDlq', {
      queueName: resourceName(QUEUE_GEOFENCE_EVENTS_DLQ, ENV_SUFFIX),
    });
    const geofenceEventsQueue = new sqs.Queue(this, 'GeofenceEvents', {
      queueName: resourceName(QUEUE_GEOFENCE_EVENTS, ENV_SUFFIX),
      deadLetterQueue: {
        queue: geofenceEventsDlq,
        maxReceiveCount: SQS_MAX_RECEIVE_COUNT,
      },
    });

    const positionsTable = new dynamodb.Table(this, 'PositionsTable', {
      tableName: resourceName(TABLE_POSITIONS, ENV_SUFFIX),
      billingMode: dynamodb.BillingMode.PROVISIONED,
      readCapacity: 25,
      writeCapacity: 25,
      tableClass: dynamodb.TableClass.STANDARD,
      partitionKey: {
        name: TABLE_POSITIONS_PARTITION_KEY,
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: TABLE_POSITIONS_SORT_KEY,
        type: dynamodb.AttributeType.NUMBER,
      },
      timeToLiveAttribute: TABLE_POSITIONS_TTL_ATTRIBUTE,
      removalPolicy: RemovalPolicy.RETAIN,
    });
    const cfnPositionsTable = positionsTable.node.defaultChild as dynamodb.CfnTable;
    // Table omite PROVISIONED por ser el default de CloudFormation; R8 lo
    // exige explícito para que el template documente el límite de costo.
    cfnPositionsTable.addPropertyOverride('BillingMode', 'PROVISIONED');

    const bucketSuffix = `${ENV_NAME}-${Aws.ACCOUNT_ID}`;
    new s3.Bucket(this, 'MediaBucket', {
      bucketName: resourceName(BUCKET_MEDIA_BASE, bucketSuffix),
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    const eventBus = new events.EventBus(this, 'EventBus', {
      eventBusName: resourceName(EVENT_BUS_NAME, ENV_SUFFIX),
    });
    const geofenceEventsRule = new events.Rule(this, 'GeofenceEventsRule', {
      eventBus,
      ruleName: resourceName(RULE_GEOFENCE_EVENTS, ENV_SUFFIX),
      eventPattern: {
        source: [EVENT_SOURCE],
        detailType: [
          DETAIL_TYPE_POSITION_UPDATED,
          DETAIL_TYPE_BATTERY_LOW,
        ],
      },
    });
    geofenceEventsRule.addTarget(new targets.SqsQueue(geofenceEventsQueue));
  }
}
