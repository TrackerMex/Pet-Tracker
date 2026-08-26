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
export const PROVISIONED_SUFFIXES: readonly string[] = [
  '',
  RESOURCE_SUFFIX_TEST,
];

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

export class MissingMediaBucketNameError extends Error {
  constructor() {
    super(
      'AWS_MODE=aws requiere MEDIA_BUCKET_NAME con el nombre real del ' +
        'bucket del stack PetTrackerDev (pet-tracker-media-dev-<accountId>). ' +
        'Obtenlo con `aws s3 ls | grep pet-tracker-media`. Se aborta antes ' +
        'de firmar URLs de media porque, sin esta configuración, apuntarían ' +
        'a pet-tracker-media-local, que no existe en AWS real (ver ' +
        'docs/verification.md, feature 51).',
    );
    this.name = 'MissingMediaBucketNameError';
  }
}

function resolveAwsMediaBucketName(rawName: string | undefined): string {
  const name = (rawName ?? '').trim();
  if (name === '') throw new MissingMediaBucketNameError();
  return name;
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
  const rawMode = env.AWS_MODE;

  if (resolveAwsMode(rawMode) === 'aws') {
    const mediaBucket = resolveAwsMediaBucketName(env.MEDIA_BUCKET_NAME);

    return {
      ...buildResourceNames(resolveResourceSuffix(rawMode, env.NODE_ENV)),
      mediaBucket,
    };
  }

  return buildResourceNames(resolveResourceSuffix(rawMode, env.NODE_ENV));
}

export function resolveResourceNamesFromConfigService(
  config: ConfigService,
): AwsResourceNames {
  const rawMode = config.get<string>('AWS_MODE');

  if (resolveAwsMode(rawMode) === 'aws') {
    const mediaBucket = resolveAwsMediaBucketName(
      config.get<string>('MEDIA_BUCKET_NAME'),
    );

    return {
      ...buildResourceNames(
        resolveResourceSuffix(rawMode, config.get<string>('NODE_ENV')),
      ),
      mediaBucket,
    };
  }

  return buildResourceNames(
    resolveResourceSuffix(rawMode, config.get<string>('NODE_ENV')),
  );
}
