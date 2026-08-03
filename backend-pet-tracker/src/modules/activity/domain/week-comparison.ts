// Comparativa semanal (R21): aritmetica pura del dominio, sin I/O, sin
// reloj y sin imports — se testea sin base de datos.

/** Muestras diarias de cada metrica comparable. */
export interface ComparableMetrics {
  distanceM: number[];
  activeMinutes: number[];
  walkCount: number[];
}

/** Delta porcentual por metrica; `null` cuando no hay base con la que medir. */
export interface WeekComparison {
  distanceM: number | null;
  activeMinutes: number | null;
  walkCount: number | null;
}

/**
 * Delta porcentual a un decimal de la media diaria del rango contra la de la
 * ventana base. `null` si alguna de las dos medias no existe o la base vale
 * 0: el plan dice "null si no hay historial" y la division entre cero se
 * declara aqui como el mismo caso.
 */
export function compareWeek(
  range: ComparableMetrics,
  baseline: ComparableMetrics,
): WeekComparison {
  return {
    distanceM: deltaPercent(range.distanceM, baseline.distanceM),
    activeMinutes: deltaPercent(range.activeMinutes, baseline.activeMinutes),
    walkCount: deltaPercent(range.walkCount, baseline.walkCount),
  };
}

function deltaPercent(
  rangeSamples: number[],
  baselineSamples: number[],
): number | null {
  if (rangeSamples.length === 0 || baselineSamples.length === 0) {
    return null;
  }

  const baselineMean = mean(baselineSamples);
  if (baselineMean === 0) {
    return null;
  }

  const ratio = (mean(rangeSamples) - baselineMean) / baselineMean;

  return Math.round(ratio * 1000) / 10;
}

function mean(samples: number[]): number {
  return samples.reduce((total, sample) => total + sample, 0) / samples.length;
}
