import { z } from 'zod';

// Contrato del mensaje SQS positions-raw (R9/R12, D3): body versionado que
// publica el poller y valida el consumidor. Un body que no cumple este
// schema se considera malformado y termina en la DLQ via RedrivePolicy
// (R18) — jamas se escribe a la DLQ a mano.

export const rawPositionSchema = z.object({
  lat: z.number(),
  lng: z.number(),
  ts: z.number(),
  speedKmh: z.number().optional(),
  course: z.number().optional(),
  altitude: z.number().optional(),
  sats: z.number().optional(),
  accuracyM: z.number().optional(),
  batteryPct: z.number().optional(),
});

export const positionsMessageSchema = z.object({
  version: z.literal(1),
  deviceId: z.string().min(1),
  petId: z.string().min(1),
  unitId: z.string().min(1),
  positions: z.array(rawPositionSchema).max(100),
});

export type PositionsMessage = z.infer<typeof positionsMessageSchema>;
