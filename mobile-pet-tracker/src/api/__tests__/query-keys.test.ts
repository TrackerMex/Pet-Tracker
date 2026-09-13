import {
  activityKeys,
  alertKeys,
  deviceKeys,
  healthKeys,
  mediaKeys,
  nutritionKeys,
  petKeys,
  positionKeys,
  reminderKeys,
  tripKeys,
  userKeys,
} from '../query-keys';

const cases: {
  name: string;
  domain: string;
  factory: () => readonly unknown[];
  expected: readonly unknown[];
}[] = [
  {
    name: 'pet list',
    domain: 'pets',
    factory: () => petKeys.list(),
    expected: ['pets', 'list'],
  },
  {
    name: 'pet detail',
    domain: 'pets',
    factory: () => petKeys.detail('p1'),
    expected: ['pets', 'detail', 'p1'],
  },
  {
    name: 'nutrition plan',
    domain: 'nutrition',
    factory: () => nutritionKeys.plan('p1'),
    expected: ['nutrition', 'plan', 'p1'],
  },
  {
    name: 'nutrition profile',
    domain: 'nutrition',
    factory: () => nutritionKeys.profile('p1'),
    expected: ['nutrition', 'profile', 'p1'],
  },
  {
    name: 'vaccines',
    domain: 'health',
    factory: () => healthKeys.vaccines('p1'),
    expected: ['health', 'vaccines', 'p1'],
  },
  {
    name: 'weights',
    domain: 'health',
    factory: () => healthKeys.weights('p1', 1),
    expected: ['health', 'weights', 'p1', { limit: 1 }],
  },
  {
    name: 'last position',
    domain: 'positions',
    factory: () => positionKeys.last('p1'),
    expected: ['positions', 'last', 'p1'],
  },
  {
    name: 'position list',
    domain: 'positions',
    factory: () => positionKeys.list('p1'),
    expected: ['positions', 'list', 'p1'],
  },
  {
    name: 'day route',
    domain: 'trips',
    factory: () => tripKeys.dayRoute('p1'),
    expected: ['trips', 'day-route', 'p1'],
  },
  {
    name: 'daily activity',
    domain: 'activity',
    factory: () => activityKeys.daily('p1'),
    expected: ['activity', 'daily', 'p1'],
  },
  {
    name: 'alert list',
    domain: 'alerts',
    factory: () => alertKeys.list(),
    expected: ['alerts', 'list'],
  },
  {
    name: 'open alerts',
    domain: 'alerts',
    factory: () => alertKeys.open(),
    expected: ['alerts', 'list', { status: 'open' }],
  },
  {
    name: 'reminder list',
    domain: 'reminders',
    factory: () => reminderKeys.list('p1'),
    expected: ['reminders', 'list', 'p1'],
  },
  {
    name: 'device tracking',
    domain: 'devices',
    factory: () => deviceKeys.tracking('p1'),
    expected: ['devices', 'tracking', 'p1'],
  },
  {
    name: 'current user',
    domain: 'users',
    factory: () => userKeys.me(),
    expected: ['users', 'me'],
  },
  {
    name: 'pet documents',
    domain: 'media',
    factory: () => mediaKeys.petDocs('p1'),
    expected: ['media', 'pet-docs', 'p1'],
  },
];

describe('#87 R7: las claves siguen la convención y no colisionan', () => {
  it.each(cases)('$name returns its exact key', ({ factory, expected }) => {
    expect(factory()).toEqual(expected);
  });

  it('includes limit when identifying weight lists', () => {
    expect(healthKeys.weights('p1', 1)).not.toEqual(
      healthKeys.weights('p1', undefined),
    );
  });

  it('keeps domain prefixes stable for granular invalidation', () => {
    for (const { domain, factory } of cases) {
      expect(factory()[0]).toBe(domain);
    }
    expect(petKeys.detail('p1').slice(0, 1)).toEqual(['pets']);
  });
});
