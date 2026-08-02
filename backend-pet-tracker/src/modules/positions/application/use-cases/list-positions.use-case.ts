import { Inject, Injectable } from '@nestjs/common';
import {
  decodeCursor,
  encodeCursor,
  queryFingerprint,
} from '@/modules/positions/domain/cursor';
import type { StoredPosition } from '@/modules/positions/domain/entities/position.entity';
import {
  InvalidCursorError,
  InvalidRangeError,
  RangeTooLargeError,
} from '@/modules/positions/domain/errors/position.errors';
import { POSITION_HISTORY_READER } from '@/modules/positions/domain/repositories/position-history.reader';
import type { PositionHistoryReader } from '@/modules/positions/domain/repositories/position-history.reader';
import {
  DEFAULT_RANGE_MINUTES,
  MAX_RANGE_HOURS,
} from '@/modules/positions/positions.constants';
import { FLAG_LOW_ACCURACY } from '@/pipeline/constants';

const MS_PER_MINUTE = 60_000;
const MS_PER_HOUR = 3_600_000;

export interface ListPositionsInput {
  /** Mascota ya autorizada por PetAccessGuard (R2): nunca del cliente. */
  petId: string;
  from?: string;
  to?: string;
  cursor?: string;
  includeSuspect?: 'true' | 'false';
}

export interface ListPositionsResult {
  items: StoredPosition[];
  nextCursor: string | null;
}

/**
 * GET /v1/pets/:petId/positions (R8-R15). Resuelve el rango, valida sus
 * limites y pagina sobre la Query de DynamoDB.
 */
@Injectable()
export class ListPositionsUseCase {
  constructor(
    @Inject(POSITION_HISTORY_READER)
    private readonly history: PositionHistoryReader,
  ) {}

  async execute(
    input: ListPositionsInput,
    now: Date = new Date(),
  ): Promise<ListPositionsResult> {
    // R8: to = now, from = to - 60 min. El reloj entra por parametro para
    // que el test lo fije sin fake timers.
    const toMs = input.to === undefined ? now.getTime() : Date.parse(input.to);
    const fromMs =
      input.from === undefined
        ? toMs - DEFAULT_RANGE_MINUTES * MS_PER_MINUTE
        : Date.parse(input.from);

    // R9: ambas validaciones anteceden a cualquier I/O.
    if (fromMs >= toMs) {
      throw new InvalidRangeError();
    }
    if (toMs - fromMs > MAX_RANGE_HOURS * MS_PER_HOUR) {
      throw new RangeTooLargeError();
    }

    const includeSuspect = input.includeSuspect === 'true';
    const fingerprint = queryFingerprint(fromMs, toMs, includeSuspect);

    // R14: el cursor se valida ANTES de cualquier Query. Solo puede mover el
    // arranque dentro de la particion ya autorizada — la mascota sale de
    // input.petId (que viene de request.petMembership, R2), nunca del sobre.
    const startAfterSk =
      input.cursor === undefined
        ? null
        : this.resolveStartKey(input.cursor, input.petId, fingerprint);

    const page = await this.history.queryPage({
      petId: input.petId,
      fromMs,
      toMs,
      startAfterSk,
    });

    return {
      // R12/D1: el modo por defecto oculta solo low_accuracy — los
      // suspect_jump son movimiento real marcado, y el plan 006 los necesita
      // para segmentar recorridos. Se filtra en memoria y no con
      // FilterExpression: DynamoDB filtra despues de leer (misma capacidad,
      // mismo resultado) y convertiria una regla de negocio en un string.
      items: includeSuspect
        ? page.items
        : page.items.filter((item) => !item.flags.includes(FLAG_LOW_ACCURACY)),
      // R13: la paginacion es de la Query, no del resultado filtrado (R15).
      nextCursor:
        page.lastKey === null
          ? null
          : encodeCursor({
              petId: input.petId,
              fingerprint,
              lastSk: page.lastKey,
            }),
    };
  }

  private resolveStartKey(
    cursor: string,
    petId: string,
    fingerprint: string,
  ): number {
    const decoded = decodeCursor(cursor);

    if (decoded.petId !== petId || decoded.fingerprint !== fingerprint) {
      throw new InvalidCursorError();
    }

    return decoded.lastSk;
  }
}
