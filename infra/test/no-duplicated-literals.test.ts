import { Dirent, readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import {
  BUCKET_MEDIA,
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
  TABLE_POSITIONS,
  TABLE_POSITIONS_PARTITION_KEY,
  TABLE_POSITIONS_SORT_KEY,
  TABLE_POSITIONS_TTL_ATTRIBUTE,
} from '@backend/aws/constants';

const SOURCE_DIRECTORIES = [
  join(__dirname, '..', 'bin'),
  join(__dirname, '..', 'lib'),
];

const RESOURCE_NAMES = [
  QUEUE_POSITIONS_RAW,
  QUEUE_POSITIONS_RAW_DLQ,
  QUEUE_NOTIFICATIONS,
  QUEUE_NOTIFICATIONS_DLQ,
  QUEUE_GEOFENCE_EVENTS,
  QUEUE_GEOFENCE_EVENTS_DLQ,
  RULE_GEOFENCE_EVENTS,
  TABLE_POSITIONS,
  TABLE_POSITIONS_PARTITION_KEY,
  TABLE_POSITIONS_SORT_KEY,
  TABLE_POSITIONS_TTL_ATTRIBUTE,
  BUCKET_MEDIA,
  BUCKET_MEDIA_BASE,
  EVENT_BUS_NAME,
  EVENT_SOURCE,
  DETAIL_TYPE_POSITION_UPDATED,
  DETAIL_TYPE_BATTERY_LOW,
] as const;

function typescriptFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap(
    (entry: Dirent) => {
      const entryPath = join(directory, entry.name);

      if (entry.isDirectory()) {
        return typescriptFiles(entryPath);
      }

      return entry.isFile() && entry.name.endsWith('.ts') ? [entryPath] : [];
    },
  );
}

describe('R4: el stack no duplica literales de constants.ts', () => {
  it('importa cada nombre de recurso en vez de reescribir su valor', () => {
    const files = SOURCE_DIRECTORIES.flatMap(typescriptFiles);

    for (const resourceName of RESOURCE_NAMES) {
      const quotedForms = [
        `'${resourceName}'`,
        `"${resourceName}"`,
        `\`${resourceName}\``,
      ];
      const offenders = files.filter((file) => {
        const source = readFileSync(file, 'utf-8');
        return quotedForms.some((literal) => source.includes(literal));
      });

      if (offenders.length > 0) {
        throw new Error(
          `literal "${resourceName}" duplicado en ${offenders.join(', ')}`,
        );
      }

      expect(offenders).toEqual([]);
    }
  });
});
