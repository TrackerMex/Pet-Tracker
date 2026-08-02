import { SIMULATED_DEVICES } from '@/db/seed/simulated-devices';
import type { RawPosition } from '@/pipeline/types';
import type { WialonClient, WialonUnit } from './wialon-client.interface';

/** Config del simulador — la resuelve el factory desde ConfigService (R1). */
export interface FakeWialonClientOptions {
  seed: number;
  homeLat: number;
  homeLng: number;
}

// Un punto por cada slot de 30 s (R2). Constante del fake, no env (D11).
export const SIM_STEP_SECONDS = 30;
export const SIM_STEP_MS = SIM_STEP_SECONDS * 1000;

const SLOTS_PER_DAY = 86_400 / SIM_STEP_SECONDS;

// Caminata suave: velocidad base <= 4 km/h y ruido de +-10 m por eje mantienen
// la velocidad implicita entre consecutivos por debajo de 8 km/h (R3).
const MAX_WALK_SPEED_KMH = 4;
const PAUSE_PROBABILITY = 0.3;
const NOISE_AMPLITUDE_M = 10;

// Anomalias deterministas cada ~50 slots (D2): un salto absurdo (1000 m en
// 30 s => 120 km/h implicitos, supera el umbral suspect_jump de 60) y un
// duplicado exacto (el punto se emite dos veces). Offsets distintos mod 50.
const ANOMALY_PERIOD_SLOTS = 50;
const JUMP_SLOT_OFFSET = 17;
const DUPLICATE_SLOT_OFFSET = 42;
const JUMP_DISTANCE_M = 1000;

// Bateria: -1 % por cada 30 min simulados (60 slots), reinicia en 100 al
// empezar cada dia simulado — "collar cargado cada noche".
const BATTERY_DRAIN_SLOTS = 60;

const METERS_PER_DEGREE_LAT = 111_320;

/** PRNG stateless mulberry32 (~10 lineas, sin dependencia nueva — D2). */
function mulberry32(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4_294_967_296;
  };
}

/** FNV-1a de `${seed}:${unitId}:${slot}` — siembra el PRNG del slot (D2). */
function hashSlot(seed: number, unitId: string, slot: number): number {
  const key = `${seed}:${unitId}:${slot}`;
  let hash = 0x811c9dc5;
  for (let i = 0; i < key.length; i++) {
    hash ^= key.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

/** Sorteos deterministas de un slot — el orden de draws es parte del contrato. */
interface SlotDraw {
  directionRad: number;
  speedKmh: number;
  noiseEastM: number;
  noiseNorthM: number;
  sats: number;
  accuracyM: number;
}

/**
 * Simulador determinista de Wialon (R2, R3): cada posicion es funcion pura
 * de (seed, unitId, slot de 30 s) — sin estado mutable entre llamadas ni
 * Math.random. El paseo arranca en "casa" al inicio de cada dia simulado y
 * acumula desplazamientos deterministas de los slots previos del mismo dia
 * (ventana acotada — D2).
 */
export class FakeWialonClient implements WialonClient {
  constructor(private readonly options: FakeWialonClientOptions) {}

  listUnits(): Promise<WialonUnit[]> {
    return Promise.resolve(
      SIMULATED_DEVICES.map((device) => ({
        unitId: device.wialonUnitId,
        name: device.esn,
      })),
    );
  }

  getMessages(
    unitId: string,
    fromTs: number,
    toTs: number,
  ): Promise<RawPosition[]> {
    // Slots con ts en (fromTs, toTs]: el poller avanza el watermark al ts del
    // ultimo mensaje, asi el siguiente ciclo no repite el slot del borde.
    const firstSlot = Math.floor(fromTs / SIM_STEP_MS) + 1;
    const lastSlot = Math.floor(toTs / SIM_STEP_MS);

    if (lastSlot < firstSlot) {
      return Promise.resolve([]);
    }

    const dayStartSlot = Math.floor(firstSlot / SLOTS_PER_DAY) * SLOTS_PER_DAY;
    const positions: RawPosition[] = [];
    let eastM = 0;
    let northM = 0;

    for (let slot = dayStartSlot; slot <= lastSlot; slot++) {
      if (slot % SLOTS_PER_DAY === 0) {
        // Nuevo dia simulado: el paseo rearranca en casa.
        eastM = 0;
        northM = 0;
      }

      const draw = this.drawFor(unitId, slot);
      const stepM = (draw.speedKmh / 3.6) * SIM_STEP_SECONDS;
      eastM += Math.cos(draw.directionRad) * stepM;
      northM += Math.sin(draw.directionRad) * stepM;

      if (slot < firstSlot) {
        continue;
      }

      const position = this.toPosition(slot, draw, eastM, northM);
      positions.push(position);

      if (slot % ANOMALY_PERIOD_SLOTS === DUPLICATE_SLOT_OFFSET) {
        // Duplicado exacto: mismo ts y coordenadas (R3) — normalize() lo
        // descarta por device_ts (R5).
        positions.push({ ...position });
      }
    }

    return Promise.resolve(positions);
  }

  private drawFor(unitId: string, slot: number): SlotDraw {
    const rand = mulberry32(hashSlot(this.options.seed, unitId, slot));

    const directionRad = rand() * 2 * Math.PI;
    const speedDraw = rand();
    const speedKmh =
      speedDraw < PAUSE_PROBABILITY
        ? 0
        : ((speedDraw - PAUSE_PROBABILITY) / (1 - PAUSE_PROBABILITY)) *
          MAX_WALK_SPEED_KMH;
    const noiseEastM = (rand() * 2 - 1) * NOISE_AMPLITUDE_M;
    const noiseNorthM = (rand() * 2 - 1) * NOISE_AMPLITUDE_M;
    const sats = 5 + Math.floor(rand() * 7);
    const accuracyM = 5 + rand() * 10;

    return { directionRad, speedKmh, noiseEastM, noiseNorthM, sats, accuracyM };
  }

  private toPosition(
    slot: number,
    draw: SlotDraw,
    eastM: number,
    northM: number,
  ): RawPosition {
    const latRad = (this.options.homeLat * Math.PI) / 180;
    const metersPerDegreeLng = METERS_PER_DEGREE_LAT * Math.cos(latRad);

    // Salto absurdo (outlier posicional transitorio): solo desplaza el punto
    // reportado de este slot, no la trayectoria acumulada (R3).
    const jumpNorthM =
      slot % ANOMALY_PERIOD_SLOTS === JUMP_SLOT_OFFSET ? JUMP_DISTANCE_M : 0;

    const slotOfDay = slot % SLOTS_PER_DAY;
    const batteryPct = Math.max(
      0,
      100 - Math.floor(slotOfDay / BATTERY_DRAIN_SLOTS),
    );

    return {
      lat:
        this.options.homeLat +
        (northM + draw.noiseNorthM + jumpNorthM) / METERS_PER_DEGREE_LAT,
      lng:
        this.options.homeLng + (eastM + draw.noiseEastM) / metersPerDegreeLng,
      ts: slot * SIM_STEP_MS,
      speedKmh: draw.speedKmh,
      course: (draw.directionRad * 180) / Math.PI,
      sats: draw.sats,
      accuracyM: draw.accuracyM,
      batteryPct,
    };
  }
}
