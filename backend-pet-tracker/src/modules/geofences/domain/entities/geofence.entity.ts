export type GeofenceType = 'safe_circle';

export type GeofenceStateValue = 'unknown' | 'inside' | 'outside';

/** Reflejo directo de la columna `geofence_state` (D2). */
export interface GeofenceState {
  state: GeofenceStateValue;
  updatedAt: string | null;
}

interface GeofenceProps {
  id: string;
  petId: string;
  name: string;
  type: GeofenceType;
  centerLat: number;
  centerLng: number;
  radiusM: number;
  active: boolean;
  state: GeofenceState;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Geocerca (docs/data-model.md fila `geofences`). Clase pura, sin ORM.
 * `centerLat`/`centerLng`/`radiusM` aplanan el jsonb `geometry` de la fila
 * (D1: el CRUD MVP solo produce circulos, asi que domain/application no
 * necesitan la union `CircleGeometry | PolygonGeometry` de
 * `src/pipeline/geofence-eval.ts` — esa union es del nucleo puro, no de
 * este modulo, que nunca la importa).
 */
export class Geofence {
  readonly id: string;
  readonly petId: string;
  readonly name: string;
  readonly type: GeofenceType;
  readonly centerLat: number;
  readonly centerLng: number;
  readonly radiusM: number;
  readonly active: boolean;
  readonly state: GeofenceState;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor(props: GeofenceProps) {
    this.id = props.id;
    this.petId = props.petId;
    this.name = props.name;
    this.type = props.type;
    this.centerLat = props.centerLat;
    this.centerLng = props.centerLng;
    this.radiusM = props.radiusM;
    this.active = props.active;
    this.state = props.state;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}
