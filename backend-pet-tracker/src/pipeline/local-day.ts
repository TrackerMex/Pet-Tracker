// Aritmetica de dia local del nucleo puro (#10 R7, D3): solo `Intl`, cero
// imports y cero dependencias nuevas — `Temporal` es undefined en el Node
// v24.16.0 del proyecto y package.json no tiene libreria de fechas.
//
// Dos reglas de diseño eliminan las esquinas de DST en vez de parchearlas:
//   1. `endMs` de un dia es el `startMs` del dia SIGUIENTE, nunca
//      `startMs + 86_400_000` — un dia de 23 h o 25 h sale correcto por
//      construccion.
//   2. `startMs` se resuelve iterando sobre el offset que `Intl` reporta en
//      el instante candidato y VERIFICANDO con `localDayOf`: si la
//      medianoche local no existe (salto de primavera), el candidato
//      corregido cae en el dia anterior y se descarta.
//
// El offset se deriva de `formatToParts` (hora de pared en la zona menos el
// instante UTC) en vez de parsear la cadena `timeZoneName: 'longOffset'`:
// misma fuente `Intl.DateTimeFormat`, sin parseo de texto.

/** Zona horaria fuera del catalogo IANA que `Intl` reconoce (R7). */
export class InvalidTimeZoneError extends Error {
  constructor(timeZone: string) {
    super(`unknown IANA time zone: ${timeZone}`);
    this.name = 'InvalidTimeZoneError';
  }
}

/** Intervalo semiabierto [startMs, endMs) de un dia local (R7). */
export interface LocalDayRange {
  startMs: number;
  endMs: number;
}

// `Intl.supportedValuesOf('timeZone')` devuelve 418 nombres canonicos en
// este Node y NO incluye 'UTC' (comprobado, no supuesto). 'UTC' es el
// fallback obligatorio de R13 y el default de `users.timezone`, asi que se
// añade explicitamente: sin el, toda mascota sin owner valido reventaria.
const SUPPORTED_TIME_ZONES = new Set<string>([
  ...Intl.supportedValuesOf('timeZone'),
  'UTC',
]);

const DAY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const HOUR_MS = 3_600_000;

const dayFormatters = new Map<string, Intl.DateTimeFormat>();
const partsFormatters = new Map<string, Intl.DateTimeFormat>();

/**
 * ¿Es `timeZone` una zona que `Intl` reconoce? Unica fuente del catalogo:
 * el store de #10 la usa para degradar a 'UTC' con warn (R13) en vez de
 * repetir el `Set` (el registro de #3 no valida contra IANA, asi que un
 * `users.timezone` puede ser cualquier cosa de hasta 64 caracteres).
 */
export function isSupportedTimeZone(timeZone: string): boolean {
  return SUPPORTED_TIME_ZONES.has(timeZone);
}

/** Dia de calendario 'YYYY-MM-DD' al que pertenece un instante en `timeZone`. */
export function localDayOf(tsMs: number, timeZone: string): string {
  assertTimeZone(timeZone);

  return dayFormatterFor(timeZone).format(new Date(tsMs));
}

/**
 * Intervalo semiabierto [startMs, endMs) del dia local `day` en `timeZone`,
 * con `endMs` = `startMs` del dia siguiente (R7).
 */
export function localDayRange(day: string, timeZone: string): LocalDayRange {
  assertTimeZone(timeZone);

  if (!DAY_PATTERN.test(day)) {
    throw new RangeError(`day must be YYYY-MM-DD, received: ${day}`);
  }

  const [year, month, date] = day.split('-').map(Number);

  return {
    startMs: startOfLocalDay(year, month, date, timeZone),
    endMs: startOfLocalDay(year, month, date + 1, timeZone),
  };
}

/**
 * ¿Es `value` una fecha de calendario real 'YYYY-MM-DD'? '2026-02-30' pasa
 * el patron pero no existe: lo consume la validacion de query de R17.
 */
export function isCalendarDate(value: string): boolean {
  if (!DAY_PATTERN.test(value)) {
    return false;
  }

  const [year, month, date] = value.split('-').map(Number);
  const normalized = new Date(Date.UTC(year, month - 1, date));

  return normalized.toISOString().slice(0, 10) === value;
}

/** Dia de calendario desplazado `days` dias (negativo hacia atras). */
export function shiftDay(day: string, days: number): string {
  const [year, month, date] = day.split('-').map(Number);

  return new Date(Date.UTC(year, month - 1, date + days))
    .toISOString()
    .slice(0, 10);
}

/** Dias de calendario de `fromDay` a `toDay`, ambos incluidos y sin huecos. */
export function listDays(fromDay: string, toDay: string): string[] {
  const days: string[] = [];

  for (let day = fromDay; day <= toDay; day = shiftDay(day, 1)) {
    days.push(day);
  }

  return days;
}

/** Primer instante del dia local; `date` admite desbordes (day + 1). */
function startOfLocalDay(
  year: number,
  month: number,
  date: number,
  timeZone: string,
): number {
  // `Date.UTC` normaliza el desborde de `date` (day + 1 del ultimo del mes);
  // el dia buscado es su fecha de calendario UTC, no su dia local.
  const utcMidnight = Date.UTC(year, month - 1, date);
  const day = new Date(utcMidnight).toISOString().slice(0, 10);

  // Una sola correccion basta salvo en el borde del cambio de horario, donde
  // la segunda iteracion propone un instante alternativo; se queda el menor
  // de los candidatos que realmente pertenece al dia local.
  const first = utcMidnight - offsetMsAt(utcMidnight, timeZone);
  const second = utcMidnight - offsetMsAt(first, timeZone);

  const candidates = [first, second]
    .filter((candidate) => localDayOf(candidate, timeZone) === day)
    .sort((a, b) => a - b);

  if (candidates.length === 0) {
    // Nunca observado con datos IANA reales; se resuelve por barrido de una
    // hora antes que rendirse en silencio.
    return scanForDayStart(Math.min(first, second), day, timeZone);
  }

  return candidates[0];
}

/** Barrido defensivo de +-2 h en pasos de 1 min alrededor del candidato. */
function scanForDayStart(
  around: number,
  day: string,
  timeZone: string,
): number {
  for (let offset = -2 * HOUR_MS; offset <= 2 * HOUR_MS; offset += 60_000) {
    const candidate = around + offset;
    if (localDayOf(candidate, timeZone) === day) {
      return candidate;
    }
  }

  throw new RangeError(`cannot resolve start of ${day} in ${timeZone}`);
}

/** Offset (ms al este de UTC) que la zona aplica en ese instante. */
function offsetMsAt(tsMs: number, timeZone: string): number {
  const parts = partsFormatterFor(timeZone).formatToParts(new Date(tsMs));
  const read = (type: Intl.DateTimeFormatPartTypes): number =>
    Number(parts.find((part) => part.type === type)?.value);

  // `hourCycle: 'h23'` evita el 24 de la medianoche de `hour12: false`.
  const wallClock = Date.UTC(
    read('year'),
    read('month') - 1,
    read('day'),
    read('hour'),
    read('minute'),
    read('second'),
  );

  return wallClock - tsMs;
}

function assertTimeZone(timeZone: string): void {
  if (!SUPPORTED_TIME_ZONES.has(timeZone)) {
    throw new InvalidTimeZoneError(timeZone);
  }
}

function dayFormatterFor(timeZone: string): Intl.DateTimeFormat {
  const cached = dayFormatters.get(timeZone);
  if (cached) {
    return cached;
  }

  // 'en-CA' formatea como YYYY-MM-DD, que es exactamente el shape de R7.
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  dayFormatters.set(timeZone, formatter);

  return formatter;
}

function partsFormatterFor(timeZone: string): Intl.DateTimeFormat {
  const cached = partsFormatters.get(timeZone);
  if (cached) {
    return cached;
  }

  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  });
  partsFormatters.set(timeZone, formatter);

  return formatter;
}
