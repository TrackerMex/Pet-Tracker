// Nucleo puro del pipeline (R5): sin imports de NestJS/SDK/ORM, sin reloj,
// sin red — solo funcion de datos a datos. La pureza se verifica por
// inspeccion de imports en el spec.
import type { DiscardedStat, ProcessedPosition, RawPosition } from './types';

export interface NormalizeResult {
  accepted: ProcessedPosition[];
  discarded: DiscardedStat[];
}

/**
 * Valida y ordena posiciones crudas (R5): descarta lat/lng fuera de rango o
 * exactamente (0,0), posiciones sin ts y duplicados exactos por device_ts
 * (queda la primera aparicion); cada descarte registra su razon. `accepted`
 * sale en orden cronologico ascendente.
 */
export function normalize(raw: RawPosition[]): NormalizeResult {
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
    if (seenTs.has(position.ts)) {
      discarded.push({ reason: 'duplicate_ts', position });
      continue;
    }

    seenTs.add(position.ts);
    accepted.push({ ...position, flags: [] });
  }

  accepted.sort((a, b) => a.ts - b.ts);

  return { accepted, discarded };
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
