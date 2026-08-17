import {
  RESOURCE_SUFFIX_TEST,
  buildResourceNames,
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
