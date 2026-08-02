import type { StoredPosition } from '@/modules/positions/domain/entities/position.entity';

export const POSITION_HISTORY_READER = Symbol('PositionHistoryReader');

/** Una pagina de historico: rango cerrado en epoch ms y punto de arranque. */
export interface PositionHistoryQuery {
  /** Mascota autorizada por el guard; la particion se deriva de aqui (R2). */
  petId: string;
  /** Limite inferior inclusive, epoch ms. */
  fromMs: number;
  /** Limite superior inclusive, epoch ms. */
  toMs: number;
  /** `sk` tras el que continuar, o `null` para empezar por el principio. */
  startAfterSk: number | null;
}

export interface PositionHistoryPage {
  items: StoredPosition[];
  /** `sk` del `LastEvaluatedKey`, o `null` si la pagina agoto el rango. */
  lastKey: number | null;
}

/**
 * Puerto de lectura del historico en DynamoDB (R10). Separado de
 * `LastPositionReader` porque son dos tecnologias y dos ciclos de vida: la
 * cache vive en Postgres y la serie en DynamoDB.
 */
export interface PositionHistoryReader {
  queryPage(query: PositionHistoryQuery): Promise<PositionHistoryPage>;
}
