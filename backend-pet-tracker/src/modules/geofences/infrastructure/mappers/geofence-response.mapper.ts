import {
  Geofence,
  GeofenceStateValue,
  GeofenceType,
} from '@/modules/geofences/domain/entities/geofence.entity';

export interface GeofenceStateResponse {
  value: GeofenceStateValue;
  updatedAt: string | null;
}

/** Contrato congelado de geocerca (R9): exactamente estas claves. */
export interface GeofenceResponse {
  id: string;
  petId: string;
  name: string;
  type: GeofenceType;
  centerLat: number;
  centerLng: number;
  radiusM: number;
  active: boolean;
  state: GeofenceStateResponse;
  createdAt: string;
  updatedAt: string;
}

/** Lista explicita de campos — nunca se serializa la entidad completa. */
export function toGeofenceResponse(geofence: Geofence): GeofenceResponse {
  return {
    id: geofence.id,
    petId: geofence.petId,
    name: geofence.name,
    type: geofence.type,
    centerLat: geofence.centerLat,
    centerLng: geofence.centerLng,
    radiusM: geofence.radiusM,
    active: geofence.active,
    state: {
      value: geofence.state.state,
      updatedAt: geofence.state.updatedAt,
    },
    createdAt: geofence.createdAt.toISOString(),
    updatedAt: geofence.updatedAt.toISOString(),
  };
}
