import { Stack, StackProps } from 'aws-cdk-lib';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import { Construct } from 'constructs';
import {
  QUEUE_GEOFENCE_EVENTS,
  QUEUE_GEOFENCE_EVENTS_DLQ,
  QUEUE_NOTIFICATIONS,
  QUEUE_NOTIFICATIONS_DLQ,
  QUEUE_POSITIONS_RAW,
  QUEUE_POSITIONS_RAW_DLQ,
  resourceName,
  SQS_MAX_RECEIVE_COUNT,
} from '@backend/aws/constants';

export const DEV_REGION = 'us-west-2';
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
    new sqs.Queue(this, 'GeofenceEvents', {
      queueName: resourceName(QUEUE_GEOFENCE_EVENTS, ENV_SUFFIX),
      deadLetterQueue: {
        queue: geofenceEventsDlq,
        maxReceiveCount: SQS_MAX_RECEIVE_COUNT,
      },
    });
  }
}
