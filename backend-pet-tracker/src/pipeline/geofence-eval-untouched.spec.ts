import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import * as constants from './constants';

// R2 (#30): geofence-eval.ts y su suite quedan congelados tras el rediseño
// autorizado de geofence-eval-full-batch. Verificacion estatica por contenido
// exacto (hash), sin depender de `git diff` (que no es fiable en un checkout
// superficial de CI) — mismo criterio de "verificacion estatica de contenido
// de archivo" que no-hardcoded-credentials.spec.ts / relative-import-guard.
// spec.ts en src/aws/.
//
// El contenido se normaliza (BOM fuera, CRLF -> LF) antes de hashear: sin
// esto, el hash depende de core.autocrlf del checkout (CRLF en Windows,
// LF en el runner de CI Linux) y no del contenido real del archivo.

const PIPELINE_DIR = join(__dirname);

function normalizeLineEndings(content: string): string {
  const withoutBom =
    content.charCodeAt(0) === 0xfeff ? content.slice(1) : content;
  return withoutBom.replace(/\r\n/g, '\n');
}

function sha256Of(fileName: string): string {
  const content = readFileSync(join(PIPELINE_DIR, fileName), 'utf8');
  return createHash('sha256')
    .update(normalizeLineEndings(content))
    .digest('hex');
}

// Hashes congelados al estado autorizado de #30 (geofence-eval-full-batch).
// Calculados sobre el contenido normalizado a LF (ver normalizeLineEndings)
// — inmunes al core.autocrlf del checkout.
const GEOFENCE_EVAL_TS_SHA256 =
  'd430f100cb41ad2f8ea8c2fc661939404d9a45f072a15e874a8f510c7b924914';
const GEOFENCE_EVAL_SPEC_TS_SHA256 =
  'e250da1b467aedfe2082a88b7847486eda10c400edbac31d159d25fc76a9a6b9';

describe('R2 (geofence-eval-full-batch #30): geofence-eval.ts queda congelado en el estado de #30', () => {
  it('geofence-eval.ts conserva exactamente su contenido de #30', () => {
    expect(sha256Of('geofence-eval.ts')).toBe(GEOFENCE_EVAL_TS_SHA256);
  });

  it('geofence-eval.spec.ts conserva exactamente su contenido de #30', () => {
    expect(sha256Of('geofence-eval.spec.ts')).toBe(
      GEOFENCE_EVAL_SPEC_TS_SHA256,
    );
  });
});

describe('R19: pipeline/constants.ts solo añade BATTERY_RECOVERY_THRESHOLD_PCT — los exports existentes conservan nombre y valor', () => {
  it('los umbrales preexistentes (#8, #10, #11) mantienen su valor exacto', () => {
    expect(constants.SUSPECT_JUMP_SPEED_KMH).toBe(60);
    expect(constants.LOW_ACCURACY_MAX_ACCURACY_M).toBe(100);
    expect(constants.LOW_ACCURACY_MIN_SATS).toBe(4);
    expect(constants.BATTERY_LOW_THRESHOLD_PCT).toBe(20);
    expect(constants.FLAG_SUSPECT_JUMP).toBe('suspect_jump');
    expect(constants.FLAG_LOW_ACCURACY).toBe('low_accuracy');
    expect(constants.TRIP_MOVING_SPEED_KMH).toBe(1.8);
    expect(constants.TRIP_MOVING_IMPLIED_MPS).toBe(0.5);
    expect(constants.TRIP_MIN_MOVING_POINTS).toBe(3);
    expect(constants.TRIP_IDLE_CLOSE_MINUTES).toBe(10);
    expect(constants.TRIP_MAX_GAP_MINUTES).toBe(15);
    expect(constants.TRIP_MIN_DURATION_MINUTES).toBe(5);
    expect(constants.TRIP_MIN_DISTANCE_M).toBe(100);
    expect(constants.GEOFENCE_EXIT_RADIUS_MULTIPLIER).toBe(1.1);
    expect(constants.GEOFENCE_ENTER_RADIUS_MULTIPLIER).toBe(0.9);
    expect(constants.GEOFENCE_EXIT_MAX_ACCURACY_M).toBe(50);
  });

  it('añade unicamente BATTERY_RECOVERY_THRESHOLD_PCT = 30 (R11)', () => {
    expect(constants.BATTERY_RECOVERY_THRESHOLD_PCT).toBe(30);
  });
});
