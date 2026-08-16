import { z } from 'zod';

// Contrato del sobre EventBridge que llega via SQS (R5): la regla de R4 no
// usa RawMessageDelivery, asi que el Body conserva el sobre completo, no
// solo el `detail`. Se valida en dos pasos: (1) el sobre generico (siempre
// exige 'detail-type' string + 'detail' presente); (2) el `detail` contra
// el schema especifico de ese 'detail-type' — ambos fallos cuentan como
// "no cumple el schema" (R5, sin delete). Un 'detail-type' que no es
// ninguno de los dos reconocidos es la rama defensiva de R6 (log + delete),
// resuelta por el consumer, no por este schema.

export const geofenceEventEnvelopeSchema = z.object({
  'detail-type': z.string().min(1),
  detail: z.unknown(),
});

export type GeofenceEventEnvelope = z.infer<typeof geofenceEventEnvelopeSchema>;

// Shape de position.updated: #30 añade positions[] en v2 y mantiene v1 para
// mensajes legados en vuelo. Sin altitude, que #8 nunca incluyo en el detail.
const positionDetailSchema = z.object({
  lat: z.number(),
  lng: z.number(),
  ts: z.number(),
  speedKmh: z.number().nullable(),
  course: z.number().nullable(),
  sats: z.number().nullable(),
  accuracyM: z.number().nullable(),
  batteryPct: z.number().nullable(),
  flags: z.array(z.string()),
});

export const positionUpdatedDetailSchema = z.object({
  version: z.union([z.literal(1), z.literal(2)]),
  petId: z.string().min(1),
  deviceId: z.string().min(1),
  position: positionDetailSchema,
  positions: z.array(positionDetailSchema).min(1).optional(),
  batteryPct: z.number().nullable(),
});

export type PositionUpdatedDetail = z.infer<typeof positionUpdatedDetailSchema>;

export const batteryLowDetailSchema = z.object({
  version: z.literal(1),
  petId: z.string().min(1),
  deviceId: z.string().min(1),
  batteryPct: z.number(),
});

export type BatteryLowDetail = z.infer<typeof batteryLowDetailSchema>;
