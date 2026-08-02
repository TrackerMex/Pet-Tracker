import type {
  DailyActivityRow,
  DailyActivityUpsert,
} from '@/modules/activity/domain/entities/daily-activity.entity';

/**
 * Puerto propio del modulo sobre Postgres (D8). No se extiende
 * `PetRepository` — su contrato lo cerro la spec aprobada de #5 y el
 * consumidor es otro — ni se exporta `IngestionStore` de `src/workers/`.
 */
export const ACTIVITY_STORE = Symbol('ActivityStore');

/** Mascota con collar activo y la timezone ya resuelta y validada (R13). */
export interface PetToAggregate {
  petId: string;
  /** Siempre una zona IANA valida: 'UTC' si el owner no aporta una (R13). */
  timezone: string;
}

export interface ActivityStore {
  /** Mascotas con `pet_devices.released_at IS NULL` y su tz de owner (R13). */
  listPetsToAggregate(): Promise<PetToAggregate[]>;

  /** ¿Hay fila de ese dia computada despues de `notBeforeMs`? (skip de R14). */
  hasFreshRow(
    petId: string,
    date: string,
    notBeforeMs: number,
  ): Promise<boolean>;

  /** INSERT ... ON CONFLICT que preserva `time_away_minutes` (R11). */
  upsertDailyActivity(row: DailyActivityUpsert): Promise<void>;

  /** Filas del rango de dias, ambos extremos incluidos (R20). */
  findDailyRange(
    petId: string,
    fromDay: string,
    toDay: string,
  ): Promise<DailyActivityRow[]>;

  /** Timezone del owner activo de la mascota; 'UTC' si no hay o no es IANA. */
  findOwnerTimezone(petId: string): Promise<string>;
}
