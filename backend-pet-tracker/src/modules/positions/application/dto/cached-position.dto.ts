import { z } from 'zod';
import type { CachedPosition } from '@/modules/positions/domain/entities/position.entity';

/**
 * Shape de `pets.last_position` escrito por #8 (R3). La columna es `jsonb` y
 * el dominio la tipa `unknown`: nada garantiza su forma en runtime, asi que
 * se valida al leerla y un `safeParse` fallido se trata como ausente (R5).
 */
export const CachedPositionSchema = z.object({
  lat: z.number(),
  lng: z.number(),
  ts: z.number(),
  accuracy: z.number().nullable(),
  battery: z.number().nullable(),
});

/** Cuerpo de `GET /v1/pets/:petId/positions/last` (R3): exactamente 6 claves. */
export interface LastPositionView extends CachedPosition {
  staleSeconds: number;
}
