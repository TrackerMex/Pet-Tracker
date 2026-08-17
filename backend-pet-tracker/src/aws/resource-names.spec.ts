import { ConfigService } from '@nestjs/config';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
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
} from './constants';
import {
  RESOURCE_SUFFIX_TEST,
  buildResourceNames,
  resolveResourceNamesFromConfigService,
  resolveResourceNamesFromEnv,
  resolveResourceSuffix,
} from './resource-names';

describe('R1: los diez nombres con sufijo test', () => {
  it('devuelve los nombres aislados de test', () => {
    expect(buildResourceNames('test')).toEqual({
      positionsRaw: 'positions-raw-test',
      positionsRawDlq: 'positions-raw-dlq-test',
      notifications: 'notifications-test',
      notificationsDlq: 'notifications-dlq-test',
      geofenceEvents: 'geofence-events-test',
      geofenceEventsDlq: 'geofence-events-dlq-test',
      geofenceEventsRule: 'geofence-events-test',
      positionsTable: 'positions-test',
      mediaBucket: 'pet-tracker-media-local-test',
      eventBus: 'pet-tracker-test',
    });
  });

  it('conserva los nombres de desarrollo sin sufijo', () => {
    expect(buildResourceNames('')).toEqual({
      positionsRaw: 'positions-raw',
      positionsRawDlq: 'positions-raw-dlq',
      notifications: 'notifications',
      notificationsDlq: 'notifications-dlq',
      geofenceEvents: 'geofence-events',
      geofenceEventsDlq: 'geofence-events-dlq',
      geofenceEventsRule: 'geofence-events',
      positionsTable: 'positions',
      mediaBucket: 'pet-tracker-media-local',
      eventBus: 'pet-tracker',
    });
  });
});

describe('R2: el sufijo se deriva de NODE_ENV en modo local', () => {
  it.each([
    ['test', 'test'],
    [' test ', 'test'],
    [undefined, ''],
    ['', ''],
    ['  ', ''],
    ['development', ''],
    ['production', ''],
    ['testing', ''],
  ])('con NODE_ENV=%p devuelve %p', (rawNodeEnv, expected) => {
    expect(resolveResourceSuffix('local', rawNodeEnv)).toBe(expected);
  });

  it('expone el sufijo de test', () => {
    expect(RESOURCE_SUFFIX_TEST).toBe('test');
  });
});

describe('R3: AWS_MODE=aws fuerza sufijo vacio', () => {
  const developmentNames = {
    positionsRaw: 'positions-raw',
    positionsRawDlq: 'positions-raw-dlq',
    notifications: 'notifications',
    notificationsDlq: 'notifications-dlq',
    geofenceEvents: 'geofence-events',
    geofenceEventsDlq: 'geofence-events-dlq',
    geofenceEventsRule: 'geofence-events',
    positionsTable: 'positions',
    mediaBucket: 'pet-tracker-media-local',
    eventBus: 'pet-tracker',
  };

  it.each(['aws', 'AWS', ' aws '])(
    'ignora NODE_ENV=test con AWS_MODE=%p sin lanzar',
    (rawMode) => {
      expect(() => resolveResourceSuffix(rawMode, 'test')).not.toThrow();
      expect(resolveResourceSuffix(rawMode, 'test')).toBe('');
      expect(
        buildResourceNames(resolveResourceSuffix(rawMode, 'test')),
      ).toEqual(developmentNames);
    },
  );

  it('resuelve nombres desnudos desde process.env', () => {
    expect(
      resolveResourceNamesFromEnv({ AWS_MODE: 'aws', NODE_ENV: 'test' }),
    ).toEqual(developmentNames);
  });

  it('resuelve nombres desnudos desde ConfigService', () => {
    const values: Record<string, string> = {
      AWS_MODE: 'aws',
      NODE_ENV: 'test',
    };
    const config = {
      get: (key: string) => values[key],
    } as ConfigService;

    expect(resolveResourceNamesFromConfigService(config)).toEqual(
      developmentNames,
    );
  });
});

describe('R5: constants.ts sigue siendo literales const', () => {
  it('mantiene los diez nombres como strings', () => {
    const names = [
      QUEUE_POSITIONS_RAW,
      QUEUE_POSITIONS_RAW_DLQ,
      QUEUE_NOTIFICATIONS,
      QUEUE_NOTIFICATIONS_DLQ,
      QUEUE_GEOFENCE_EVENTS,
      QUEUE_GEOFENCE_EVENTS_DLQ,
      RULE_GEOFENCE_EVENTS,
      TABLE_POSITIONS,
      BUCKET_MEDIA,
      EVENT_BUS_NAME,
    ];

    for (const name of names) expect(typeof name).toBe('string');
  });

  it('no acopla constants.ts al entorno ni a NestJS', () => {
    const source = readFileSync(join(__dirname, 'constants.ts'), 'utf8');

    expect(source).not.toContain('process.env');
    expect(source).not.toContain('@nestjs/config');
  });
});
