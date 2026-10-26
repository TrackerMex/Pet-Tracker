---
feature: "mobile-weekly-average-format"
status: approved
tags: [harness, spec]
---

# Diseño — [[mobile-weekly-average-format]]

> Ver [[requirements]] para los requisitos que este diseño implementa y
> [[../../docs/architecture|architecture]] para las reglas de capas del proyecto.
> Rutas relativas a `mobile-pet-tracker/src/`. Todo vive en la capa de presentación del
> móvil; no hay backend, dominio, catálogo ni dependencias nuevas.

## Premisas verificadas contra el árbol (origin/dev, HEAD `81ca7529`)

Ancladas por contenido, no por línea.

- **Dónde nace el decimal.** En `screens/home/weekly-activity-chart.tsx`, la media es
  `hasPositiveValue ? measuredValues.reduce(...) / measuredValues.length : null`. Se
  pinta en `testID="weekly-activity-average-label"` con
  `t('weeklyActivity.average', { value: formatMetricValue(selectedMetric, average) })`.
  `formatMetricValue` delega en `fmtKm`, `fmtCount` y `fmtMinutes` de `screens/home/format.ts`.
- **La línea de media** (`testID="weekly-activity-average"`) se coloca con
  `averageY = bar.baselineY - average * (bar.height / bar.value)`, con el mismo `average`
  sin redondear. Eso es correcto y no se toca (R5).
- **Consumidores de los formateadores.** `screens/home/index.tsx` (tira de hoy y resumen),
  `screens/home/pingo-phrase.ts` y el propio gráfico (valor de columna, tooltip, panel).
  Todos reciben enteros del backend; su texto no cambia (R8). `screens/map/index.tsx` tiene
  un `fmtKm` privado duplicado: fuera de alcance.
- **La tendencia** es `formatTrendPercent(value, locale)`:
  `new Intl.NumberFormat(locale, { signDisplay: 'exceptZero', maximumFractionDigits: 1 }).format(value)`
  y, si el locale empieza por `es`, `.replace('.', ',')`. Se llama como
  `formatTrendPercent(trend, locale)` al pintar `weekly-activity-trend-label`. `locale`
  es `LOCALES[language]` (`es-MX` / `en-US`, `i18n/catalog.ts`).
- **Dos errores latentes de la tendencia actual**, ambos resueltos por R6/R7: el
  `.replace` solo cambia el primer `.`, así que un valor agrupado `+1,234.6` pasa a
  `+1,234,6`; y que `es-MX` use punto depende del ICU del dispositivo (Hermes/Android),
  no de código nuestro.
- **El plan §2 ya no coincide con el árbol** en dos puntos, corregidos aquí: (a) los
  literales de coma de la tendencia son **tres** en `weekly-activity-chart.test.tsx`,
  no dos; (b) el plan pide `fmtKm` «a un decimal cuando el valor no es entero», pero
  los tests existentes fijan `22.0 km`, `1.0 km`, `0.0 km`; `fmtKm` ya da un decimal
  siempre y no cambia.

## Decisiones técnicas

- **Redondear primero, partir después (`fmtMinutes`).** `Math.round` sobre el total de
  minutos y luego `Math.floor(m / 60)` y `m % 60`. Resuelve el acarreo (`59.6` pasa a
  `1h 0m`, nunca `0h 60m` ni `60m`) sin ramas extra. Sirve a R1.
- **`toFixed(1)` dentro de `Number(...)` (`fmtCount`).** `String(Number(count.toFixed(1)))`
  da un decimal si hace falta y quita el `.0` sin lógica adicional: `2` es `2`, `2.96` es `3`.
  Se usa `toFixed` y no `Math.round(x * 10) / 10` por coherencia con `fmtKm` (mismo
  redondeo en la app) y porque difieren en empates binarios (`3.05`: `'3'` vs `'3.1'`);
  la fila `3.05` ancla la elección. Sirve a R2.
- **`fmtKm` sin cambio.** Ya cumple «un decimal»; la fila de regresión R3 evita que se
  lea el plan como «quitar el `.0`».
- **La media se redondea solo en el texto.** `average` no se toca; el formateo ocurre en
  `formatMetricValue` al pintar la etiqueta. La línea discontinua sigue en el valor real
  (R5). Alternativa descartada: redondear `average` antes de ambos usos; falsea la
  posición de la línea (59.6 dibujada en 60).
- **Tendencia con locale fijo.** `formatTrendPercent(value)` usa
  `new Intl.NumberFormat(LOCALES.en, { signDisplay: 'exceptZero', maximumFractionDigits: 1, useGrouping: false })`
  y se elimina el `.replace` y el parámetro `locale` (el llamador pasa solo `trend`).
  `LOCALES` se importa de `i18n/catalog.ts`, donde ya vive. El texto ya no depende del
  ICU del dispositivo (R7). `useGrouping: false` evita `+1,234.6`; una tendencia de cuatro
  cifras es rara pero posible con una semana previa casi vacía. Alternativa descartada:
  `value.toFixed(1)` con signo a mano; hay que reimplementar `exceptZero` y el `-0`.
- **Candado de independencia de locale con un doble de `Intl.NumberFormat`.** En jest el
  `es-MX` real ya devuelve punto (ICU completo), así que sin el doble el test no
  distinguiría R7 de «`Intl` con `locale` sin `.replace`». El doble reencamina cualquier
  locale que no sea `en-US` a `es-ES` (coma) y se restaura en `finally`. `process.env.TZ`
  no interviene: no hay `Date` en este cálculo.
- **Sin claves nuevas.** `weeklyActivity.average` y `weeklyActivity.trend` conservan su
  plantilla; el cambio es solo en el `{{value}}` / `{{percent}}` que reciben. Por eso
  `catalog.ts`, `ui-copy-table.ts`, `ui-language.test.ts` y
  `language-provider.test.tsx` no cambian.

## Archivos afectados

Producción (capa de presentación):

- `screens/home/format.ts` — `fmtMinutes` (redondeo previo) y `fmtCount` (un decimal sin `.0`). R1, R2.
- `screens/home/weekly-activity-chart.tsx` — `formatTrendPercent` con locale fijo y sin
  `.replace`; el llamador deja de pasar `locale` a esa función (el `locale` sigue
  usándose en el resto del componente si ya lo usa; si deja de tener otros usos se retira
  de la desestructuración, sin dejar variable sin uso para `bun run lint`). R6, R7.

Tests:

- `screens/home/format.test.ts` — añade R1, R2, R3 (`it.each`).
- `screens/home/weekly-activity-chart.test.tsx` — añade R4, R5, R6, R7 y enmienda los
  tres literales de coma.

Ningún otro fichero de `src/` cambia. `git diff origin/dev --stat` debe listar solo
estos cuatro, más `specs/mobile-weekly-average-format/`, el reporte de implementación y,
si el reviewer lo pide, `feature_list.json`.

## Candados que fijan el formato actual (inventario cerrado)

Búsqueda hecha con `grep` sobre todo `src/` y `test/` del móvil.

| Fijan el formato de hoy | Tipo | Acción |
|---|---|---|
| `weekly-activity-chart.test.tsx` › `R12: la tendencia sigue a la métrica y se calla sin base` › `muestra el alza localizada con TrendUp` (`'+12,5 % frente a la semana previa'`) | literal de coma | enmendar a `'+12.5 % ...'` (R6) |
| idem › `muestra la bajada localizada con TrendDown` (`'-8,3 % ...'`) | literal de coma | enmendar a `'-8.3 % ...'` (R6) |
| idem › `cambia la tendencia al delta de la métrica seleccionada` (`'-8,3 % ...'`) | literal de coma | enmendar a `'-8.3 % ...'` (R6) |
| `home/index.test.tsx` › `R9: summary degrada con gracia` › `formats metrics from the last day in the response`; `#69 R1` › `asigna cada valor, icono y etiqueta a su celda y a ninguna otra` | enteros (`1h 35m`, `2.4 km`) | no se tocan; siguen verdes (R8) |
| `weekly-activity-chart.test.tsx` › R5, R6, R7, R8, `#141 R1` (ver R8) | enteros (`Media 20m`, `12h 0m`) | no se tocan |
| `pingo-phrase.test.ts` › `#190 R8`, `#190 R9` | enteros y km | no se tocan |
| `__tests__/ui-copy-table.ts`, `ui-language.test.ts`, `providers/__tests__/language-provider.test.tsx` | traducción y aritmética de claves | no se tocan: no hay claves nuevas ni movidas |
| `__tests__/design-drift.test.ts` `#68 R18`, `#69 R13`, `#70 R17`, `#85 R12` | `FEATURE_STYLE_ESCAPES` sobre `format.ts`, `format.test.ts`, el gráfico y su test | no se tocan: sin fichero nuevo; los comentarios nuevos usan `#219 R<n>` |
| `design-drift.test.ts` «leaves only the weekly activity guard mentioning the legacy hook» | prohibe la cadena del hook legado fuera del test del gráfico | los tests nuevos no usan ese identificador |
| `consistency-classnames.test.ts`, `home-canvas-fidelity.test.ts`, `design-drift.test.ts` (inventarios `rounded-16`) | conteos de clases del gráfico | no cambian: no se tocan `className` |

Cuentas encadenadas: ninguna cifra de inventario cambia en ningún commit de la cadena
(ver [[tasks]]). Lo único que crece es el número de tests: `format.test.ts` `+40`
(19 + 13 + 8) y `weekly-activity-chart.test.tsx` `+21` (9 + 1 + 10 + 1), total `+61`;
los tres `it` enmendados no cambian de número.

## Alternativas descartadas

- **Media de minutos en horas con decimal («Media 3,5 h»):** el humano eligió «Media 3h 30m».
- **Coma decimal en español:** el humano eligió punto en todo.
- **Redondear en el backend:** el backend ya entrega enteros; el decimal nace solo en el móvil.
- **Un helper nuevo `utils/number-format.ts` compartido con `map/`:** nada más lo
  necesita; YAGNI. El `fmtKm` duplicado de `map/` queda como deuda, no como alcance.
- **Quitar `.0` de `fmtKm`:** rompe `22.0 km`, `1.0 km`, `0.0 km` fijados por tests
  existentes y por el canvas aprobado.

## Riesgos y verificación en dispositivo

- El ancho de la etiqueta «Media 3h 30m» junto al título de la tarjeta no es medible en
  jest. Es la casilla de smoke de § Aprobación (G2, del humano), no de Codex.
- Orden de resolución de empates binarios: el rojo/verde de `3.05`, `2.25` y `59.5` está
  medido con node; si una versión futura de Hermes cambiase `toFixed`, la fila `3.05` lo
  detectaría.
