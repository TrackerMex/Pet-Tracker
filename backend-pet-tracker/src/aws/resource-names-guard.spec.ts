import { readdirSync, readFileSync, statSync } from 'fs';
import { join, relative } from 'path';

const ROOT_DIR = join(__dirname, '..', '..');
const SRC_DIR = join(ROOT_DIR, 'src');
const TEST_DIR = join(ROOT_DIR, 'test');
const THIS_FILE = join(__dirname, 'resource-names-guard.spec.ts');
const ALLOWED_FILES = new Set([
  join(__dirname, 'resource-names.ts'),
  join(__dirname, 'constants.spec.ts'),
  join(__dirname, 'resource-names.spec.ts'),
]);
const RESOURCE_NAME_SYMBOLS = [
  'QUEUE_POSITIONS_RAW',
  'QUEUE_POSITIONS_RAW_DLQ',
  'QUEUE_NOTIFICATIONS',
  'QUEUE_NOTIFICATIONS_DLQ',
  'QUEUE_GEOFENCE_EVENTS',
  'QUEUE_GEOFENCE_EVENTS_DLQ',
  'RULE_GEOFENCE_EVENTS',
  'TABLE_POSITIONS',
  'BUCKET_MEDIA',
  'EVENT_BUS_NAME',
];
const CONSTANT_IMPORT_PATTERN =
  /import\s+(?:type\s+)?\{([\s\S]*?)\}\s+from\s+['"](?:@\/aws\/constants|\.\/constants|\.\.\/src\/aws\/constants)['"]/g;

function collectTsFiles(directory: string): string[] {
  return readdirSync(directory).flatMap((entry) => {
    const file = join(directory, entry);
    if (statSync(file).isDirectory()) return collectTsFiles(file);
    return file.endsWith('.ts') ? [file] : [];
  });
}

function importsResourceName(source: string): boolean {
  return [...source.matchAll(CONSTANT_IMPORT_PATTERN)].some((match) =>
    RESOURCE_NAME_SYMBOLS.some((symbol) =>
      new RegExp(`\\b${symbol}\\b`).test(match[1]),
    ),
  );
}

describe('R11: nadie importa los diez literales de nombre', () => {
  it('limita sus imports a la lista blanca exacta', () => {
    const candidateFiles = [
      ...collectTsFiles(SRC_DIR),
      ...collectTsFiles(TEST_DIR),
    ];
    expect(candidateFiles.length).toBeGreaterThan(100);

    const offenders = candidateFiles
      .filter((file) => file !== THIS_FILE && !ALLOWED_FILES.has(file))
      .filter((file) => importsResourceName(readFileSync(file, 'utf-8')))
      .map((file) => relative(ROOT_DIR, file).replaceAll('\\', '/'));

    expect(offenders).toEqual([]);
  });
});
