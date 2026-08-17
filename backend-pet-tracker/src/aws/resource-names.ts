import { ConfigService } from '@nestjs/config';
import {
  BUCKET_MEDIA,
  EVENT_BUS_NAME,
  QUEUE_GEOFENCE_EVENTS,
  QUEUE_GEOFENCE_EVENTS_DLQ,
  QUEUE_NOTIFICATIONS,
  QUEUE_NOTIFICATIONS_DLQ,
  QUEUE_POSITIONS_RAW,
  QUEUE_POSITIONS_RAW_DLQ,
  RULE_GEOFENCE_EVENTS,
  TABLE_POSITIONS,
  resourceName,
} from './constants';
import { resolveAwsMode } from './aws-clients';

export const RESOURCE_SUFFIX_TEST = 'test';

export interface AwsResourceNames {
  positionsRaw: string;
  positionsRawDlq: string;
  notifications: string;
  notificationsDlq: string;
  geofenceEvents: string;
  geofenceEventsDlq: string;
  geofenceEventsRule: string;
  positionsTable: string;
  mediaBucket: string;
  eventBus: string;
}

export function buildResourceNames(suffix: string): AwsResourceNames {
  return {
    positionsRaw: resourceName(QUEUE_POSITIONS_RAW, suffix),
    positionsRawDlq: resourceName(QUEUE_POSITIONS_RAW_DLQ, suffix),
    notifications: resourceName(QUEUE_NOTIFICATIONS, suffix),
    notificationsDlq: resourceName(QUEUE_NOTIFICATIONS_DLQ, suffix),
    geofenceEvents: resourceName(QUEUE_GEOFENCE_EVENTS, suffix),
    geofenceEventsDlq: resourceName(QUEUE_GEOFENCE_EVENTS_DLQ, suffix),
    geofenceEventsRule: resourceName(RULE_GEOFENCE_EVENTS, suffix),
    positionsTable: resourceName(TABLE_POSITIONS, suffix),
    mediaBucket: resourceName(BUCKET_MEDIA, suffix),
    eventBus: resourceName(EVENT_BUS_NAME, suffix),
  };
}

export function resolveResourceSuffix(
  rawMode: string | undefined,
  rawNodeEnv: string | undefined,
): string {
  if (resolveAwsMode(rawMode) === 'aws') return '';
  return (rawNodeEnv ?? '').trim() === 'test' ? RESOURCE_SUFFIX_TEST : '';
}

export function resolveResourceNamesFromEnv(
  env: NodeJS.ProcessEnv,
): AwsResourceNames {
  return buildResourceNames(
    resolveResourceSuffix(env.AWS_MODE, env.NODE_ENV),
  );
}

export function resolveResourceNamesFromConfigService(
  config: ConfigService,
): AwsResourceNames {
  return buildResourceNames(
    resolveResourceSuffix(
      config.get<string>('AWS_MODE'),
      config.get<string>('NODE_ENV'),
    ),
  );
}
