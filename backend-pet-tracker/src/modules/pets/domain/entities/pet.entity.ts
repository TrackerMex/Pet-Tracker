export type PetSpecies = 'dog' | 'cat';
export type PetSex = 'male' | 'female';
export type PetSize = 'small' | 'medium' | 'large';

interface PetProps {
  id: string;
  name: string;
  species: PetSpecies;
  breed: string | null;
  /** Fecha de calendario ISO `YYYY-MM-DD` — sin componente horario. */
  birthDate: string | null;
  approxAgeMonths: number | null;
  sex: PetSex | null;
  currentWeightKg: number | null;
  size: PetSize | null;
  color: string | null;
  sterilized: boolean | null;
  microchip: string | null;
  photoKey: string | null;
  lostMode: boolean;
  lastPosition: unknown;
  lastCommunicationAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export class Pet {
  readonly id: string;
  readonly name: string;
  readonly species: PetSpecies;
  readonly breed: string | null;
  readonly birthDate: string | null;
  readonly approxAgeMonths: number | null;
  readonly sex: PetSex | null;
  readonly currentWeightKg: number | null;
  readonly size: PetSize | null;
  readonly color: string | null;
  readonly sterilized: boolean | null;
  readonly microchip: string | null;
  readonly photoKey: string | null;
  readonly lostMode: boolean;
  readonly lastPosition: unknown;
  readonly lastCommunicationAt: Date | null;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor(props: PetProps) {
    this.id = props.id;
    this.name = props.name;
    this.species = props.species;
    this.breed = props.breed;
    this.birthDate = props.birthDate;
    this.approxAgeMonths = props.approxAgeMonths;
    this.sex = props.sex;
    this.currentWeightKg = props.currentWeightKg;
    this.size = props.size;
    this.color = props.color;
    this.sterilized = props.sterilized;
    this.microchip = props.microchip;
    this.photoKey = props.photoKey;
    this.lostMode = props.lostMode;
    this.lastPosition = props.lastPosition;
    this.lastCommunicationAt = props.lastCommunicationAt;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}

export interface AgeSource {
  birthDate: string | null;
  approxAgeMonths: number | null;
  createdAt: Date;
}

/**
 * Edad en meses completos (pets-crud-permissions R6). Con `birthDate`,
 * meses de calendario transcurridos hasta `now`; sin ella,
 * `approxAgeMonths` + meses completos desde `createdAt` — la edad
 * aproximada queda anclada al alta y avanza sola con el tiempo.
 * Funcion pura: sin I/O ni reloj propio, `now` siempre lo pasa el caller.
 */
export function calculateAgeMonths(source: AgeSource, now: Date): number {
  if (source.birthDate !== null) {
    const [year, month, day] = source.birthDate.split('-').map(Number);
    return Math.max(0, completeMonthsSince(year, month, day, now));
  }

  const anchoredMonths = completeMonthsSince(
    source.createdAt.getUTCFullYear(),
    source.createdAt.getUTCMonth() + 1,
    source.createdAt.getUTCDate(),
    now,
  );

  return (source.approxAgeMonths ?? 0) + Math.max(0, anchoredMonths);
}

/** Meses de calendario completos entre (year, month, day) y `now` en UTC. */
function completeMonthsSince(
  year: number,
  month: number,
  day: number,
  now: Date,
): number {
  const months =
    (now.getUTCFullYear() - year) * 12 + (now.getUTCMonth() + 1 - month);

  return now.getUTCDate() < day ? months - 1 : months;
}
