import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import * as constants from './constants';

// R19: geofence-eval.ts (isInside, evaluate, sus tipos, geofence-eval.spec.ts)
// no se modifica — alerts-engine (#12) es su primer consumidor, no su
// segundo diseñador. Verificacion estatica por contenido exacto (hash),
// sin depender de `git diff` (que no es fiable en un checkout superficial
// de CI) — mismo criterio de "verificacion estatica de contenido de
// archivo" que no-hardcoded-credentials.spec.ts / relative-import-guard.
// spec.ts en src/aws/.

const PIPELINE_DIR = join(__dirname);

function sha256Of(fileName: string): string {
  const content = readFileSync(join(PIPELINE_DIR, fileName), 'utf8');
  return createHash('sha256').update(content).digest('hex');
}

// Hashes congelados al estado de #11 (geofences-crud, done), confirmados
// sin diff contra main al implementar #12.
const GEOFENCE_EVAL_TS_SHA256 =
  '1f9484c8ee99dc3a84289b7ef7191706a3fd7cd1bd64f719641c7e3319413f97';
const GEOFENCE_EVAL_SPEC_TS_SHA256 =
  'add70269b639c8b7bd0b970915463444b85d6c135de48f03441bed8d29ab2527';

describe('R19: geofence-eval.ts y su suite no se modifican', () => {
  it('geofence-eval.ts conserva exactamente su contenido de #11', () => {
    expect(sha256Of('geofence-eval.ts')).toBe(GEOFENCE_EVAL_TS_SHA256);
  });

  it('geofence-eval.spec.ts conserva exactamente su contenido de #11', () => {
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
