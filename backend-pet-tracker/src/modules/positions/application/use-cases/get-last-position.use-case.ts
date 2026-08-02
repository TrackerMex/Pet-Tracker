import { Inject, Injectable, Logger } from '@nestjs/common';
import {
  CachedPositionSchema,
  LastPositionView,
} from '@/modules/positions/application/dto/cached-position.dto';
import { LAST_POSITION_READER } from '@/modules/positions/domain/repositories/last-position.reader';
import type { LastPositionReader } from '@/modules/positions/domain/repositories/last-position.reader';
import { staleSeconds } from '@/modules/positions/domain/stale-seconds';

/**
 * GET /v1/pets/:petId/positions/last (R3-R5). Lee **solo** la cache
 * `pets.last_position` — cero consultas a DynamoDB (plan 005 §Paso 5:
 * "rapido, sin DynamoDB"), verificable en la firma del constructor: la unica
 * dependencia es el puerto de la cache.
 *
 * "Sin posicion" es estado, no error: cache vacia o jsonb que no valida
 * devuelven `null` y el controller responde 200 con body `null` (D2).
 */
@Injectable()
export class GetLastPositionUseCase {
  private readonly logger = new Logger(GetLastPositionUseCase.name);

  constructor(
    @Inject(LAST_POSITION_READER)
    private readonly cache: LastPositionReader,
  ) {}

  async execute(
    petId: string,
    now: Date = new Date(),
  ): Promise<LastPositionView | null> {
    const raw = await this.cache.findLastPosition(petId);

    // R5: ausencia de cache es estado normal — ni warn ni error.
    if (raw === null || raw === undefined) {
      return null;
    }

    const parsed = CachedPositionSchema.safeParse(raw);

    if (!parsed.success) {
      // R5: un item corrupto degrada a "sin posicion" en vez de matar el
      // mapa con un 500; queda el rastro para diagnosticarlo.
      this.logger.warn({
        scope: 'positions',
        petId,
        message: `last_position cache does not match the expected shape: ${parsed.error.message}`,
      });

      return null;
    }

    const position = parsed.data;

    return {
      lat: position.lat,
      lng: position.lng,
      ts: position.ts,
      accuracy: position.accuracy,
      battery: position.battery,
      // R4/D5: reloj del servidor contra el device_ts cacheado.
      staleSeconds: staleSeconds(position.ts, now),
    };
  }
}
