// Nucleo puro del pipeline (R5, R6): sin imports de NestJS/SDK/ORM, sin
// reloj, sin red — solo funcion de datos a datos. La pureza se verifica por
// inspeccion de imports en el spec.
import {
  FLAG_LOW_ACCURACY,
  FLAG_SUSPECT_JUMP,
  FUTURE_TS_TOLERANCE_MS,
  LOW_ACCURACY_MAX_ACCURACY_M,
  LOW_ACCURACY_MIN_SATS,
  SUSPECT_JUMP_SPEED_KMH,
} from './constants';
import { haversineMeters } from './geo';
import type { DiscardedStat, ProcessedPosition, RawPosition } from './types';

export interface NormalizeResult {
  accepted: ProcessedPosition[];
  discarded: DiscardedStat[];
}

/**
 * Valida, ordena y marca posiciones crudas (R5, R6): descarta lat/lng fuera
 * de rango o exactamente (0,0), posiciones sin ts, posteriores a `nowMs` mas
 * la tolerancia y duplicados exactos por device_ts (queda la primera
 * aparicion); cada descarte registra su razon. Sin `nowMs`, no filtra futuro.
 * `accepted` sale en orden cronologico ascendente con flags de calidad:
 * suspect_jump (velocidad implicita > umbral, NO se descarta) y low_accuracy
 * (accuracy o sats fuera de umbral, tampoco se descarta).
 */
export function normalize(
  raw: RawPosition[],
  nowMs?: number,
): NormalizeResult {
  const accepted: ProcessedPosition[] = [];
  const discarded: DiscardedStat[] = [];
  const seenTs = new Set<number>();

  for (const position of raw) {
    if (!hasValidCoordinates(position)) {
      discarded.push({ reason: 'invalid_coordinates', position });
      continue;
    }
    if (!hasValidTs(position)) {
      discarded.push({ reason: 'missing_ts', position });
      continue;
    }
    if (
      nowMs !== undefined &&
      position.ts > nowMs + FUTURE_TS_TOLERANCE_MS
    ) {
      discarded.push({ reason: 'future_ts', position });
      continue;
    }
    if (seenTs.has(position.ts)) {
      discarded.push({ reason: 'duplicate_ts', position });
      continue;
    }

    seenTs.add(position.ts);
    accepted.push({ ...position, flags: [] });
  }

  accepted.sort((a, b) => a.ts - b.ts);
  assignQualityFlags(accepted);

  return { accepted, discarded };
}

function assignQualityFlags(accepted: ProcessedPosition[]): void {
  for (let i = 0; i < accepted.length; i++) {
    const position = accepted[i];

    if (hasLowAccuracy(position)) {
      position.flags.push(FLAG_LOW_ACCURACY);
    }

    if (i === 0) {
      continue;
    }
    const previous = accepted[i - 1];
    const dtSeconds = (position.ts - previous.ts) / 1000;
    if (dtSeconds <= 0) {
      continue;
    }
    const impliedKmh =
      (haversineMeters(previous.lat, previous.lng, position.lat, position.lng) /
        dtSeconds) *
      3.6;
    if (impliedKmh > SUSPECT_JUMP_SPEED_KMH) {
      position.flags.push(FLAG_SUSPECT_JUMP);
    }
  }
}

function hasLowAccuracy(position: ProcessedPosition): boolean {
  if (
    typeof position.accuracyM === 'number' &&
    position.accuracyM > LOW_ACCURACY_MAX_ACCURACY_M
  ) {
    return true;
  }
  return (
    typeof position.sats === 'number' && position.sats < LOW_ACCURACY_MIN_SATS
  );
}

function hasValidCoordinates(position: RawPosition): boolean {
  const { lat, lng } = position;
  if (typeof lat !== 'number' || typeof lng !== 'number') {
    return false;
  }
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return false;
  }
  if (lat === 0 && lng === 0) {
    return false;
  }
  return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
}

function hasValidTs(position: RawPosition): boolean {
  return typeof position.ts === 'number' && Number.isFinite(position.ts);
}
