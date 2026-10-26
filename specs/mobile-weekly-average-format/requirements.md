---
feature: "mobile-weekly-average-format"
status: approved
tags: [harness, spec]
---

# Requisitos — [[mobile-weekly-average-format]]

> Notación EARS. Cada requisito tiene id único R<n>, inmutable una vez aprobado.
> Ver [[design]] para las decisiones técnicas y el inventario cerrado de candados, y
> [[../../docs/architecture|architecture]] para las reglas de arquitectura.
> Origen: `progress/plan_ui-2026-10-26.md` §1 y §2, entrada #219 (punto 4 de la
> petición de mejoras de UI) y `progress/explore_ui-alertas-actividad-ia-2026-10-26.md` §(4).
> Todas las rutas son relativas a `mobile-pet-tracker/src/` salvo que se diga otra cosa.

## Contexto y decisiones del humano (cerradas, plan §1)

- Media semanal de minutos: **«Media 3h 30m»**, con los minutos redondeados al entero.
- **Punto decimal en todo.** Se quita el `.replace` de la tendencia: `+12,5 %` pasa a
  `+12.5 %`.
- Media de paseos y de km a **un decimal**; minutos **enteros**.

Causa: el backend entrega enteros (`activeMinutes`, `walkCount`, `distanceM` por día),
pero `WeeklyActivityChart` calcula la media aritmética en el móvil y la pasa sin
redondear a `fmtMinutes` y `fmtCount`, que asumen enteros. Con una media de 210.333…
minutos la etiqueta sale hoy «Media 3h 30.333333333333343m»; con una media de paseos
2.3333333333333335 saldría «Media 2.3333333333333335».

## Formato exacto (la tabla de casos es el contrato)

Valores calculados con `node` v20.20.2 (ICU 78.2) sobre el algoritmo de [[design]]; no se
derivaron a mano. «Rojo» = el comportamiento actual difiere; «verde al nacer» = el
test pasa contra el código de hoy y funciona como candado de regresión.

**`fmtMinutes(minutes: number | null): string`**: `null` es `'—'`; si no, se redondea
**primero** al entero con `Math.round` y **después** se separa en horas y minutos
(así el acarreo a la hora es automático y nunca sale «60m»).

| Entrada | Salida | Nota |
|---|---|---|
| `null` | `'—'` | verde al nacer |
| `0` | `'0m'` | verde al nacer |
| `0.4` | `'0m'` | |
| `0.5` | `'1m'` | |
| `45` | `'45m'` | verde al nacer |
| `59` | `'59m'` | verde al nacer |
| `59.4` | `'59m'` | |
| `59.5` | `'1h 0m'` | el redondeo cruza la hora |
| `59.6` | `'1h 0m'` | idem |
| `60` | `'1h 0m'` | verde al nacer; la hora exacta conserva `0m` |
| `89.5` | `'1h 30m'` | |
| `119.4` | `'1h 59m'` | |
| `119.5` | `'2h 0m'` | |
| `119.6` | `'2h 0m'` | |
| `210` | `'3h 30m'` | verde al nacer |
| `210.33333333333334` | `'3h 30m'` | el caso de la captura del humano |
| `1439.6` | `'24h 0m'` | sin tope de 24 h |
| `6000` | `'100h 0m'` | verde al nacer |
| `99999.5` | `'1666h 40m'` | |

**`fmtCount(count: number | null): string`**: `null` es `'—'`; si no,
`String(Number(count.toFixed(1)))`: un decimal si hace falta y **sin `.0`** (un entero
sale como entero). El redondeo es el de `toFixed` (lee el valor binario exacto), el
mismo que ya usa `fmtKm`.

| Entrada | Salida | Nota |
|---|---|---|
| `null` | `'—'` | verde al nacer |
| `0` | `'0'` | verde al nacer |
| `0.04` | `'0'` | |
| `2` | `'2'` | verde al nacer |
| `2.25` | `'2.3'` | empate exacto en binario, sube |
| `2.33333333333333` | `'2.3'` | |
| `2.4` | `'2.4'` | verde al nacer |
| `2.75` | `'2.8'` | |
| `2.95` | `'3'` | redondea a entero: sin `.0` |
| `2.96` | `'3'` | |
| `3.05` | `'3'` | `3.05` es 3.04999… en binario; `Math.round(x*10)/10` daría `'3.1'` y queda **descartado** |
| `14.28571428571` | `'14.3'` | |
| `100` | `'100'` | verde al nacer |

**`fmtKm(meters: number | null): string`**: **sin cambio**. Ya da siempre un decimal
(`(meters / 1000).toFixed(1)` más ` km`); los enteros llevan `.0`.

| Entrada | Salida | Nota |
|---|---|---|
| `null` | `'—'` | verde al nacer |
| `0` | `'0.0 km'` | verde al nacer |
| `49` | `'0.0 km'` | verde al nacer |
| `50` | `'0.1 km'` | verde al nacer |
| `1033.3333` | `'1.0 km'` | verde al nacer |
| `2433.33` | `'2.4 km'` | verde al nacer |
| `22000` | `'22.0 km'` | verde al nacer |
| `22050` | `'22.1 km'` | verde al nacer |

Entradas fuera de dominio (negativas, `NaN`, `Infinity`): **no aplican**. El contrato
del backend es entero ≥ 0 y la media de valores ≥ 0 es ≥ 0; no hay rama ni test para
ellas. (La **tendencia** sí admite negativos: ver R6.)

**Tendencia** (`formatTrendPercent`): `Intl.NumberFormat` con el locale fijo `en-US`,
`signDisplay: 'exceptZero'`, `maximumFractionDigits: 1` y `useGrouping: false`.

| `weekComparison.<métrica>` | Texto de `{{percent}}` |
|---|---|
| `12.5` | `+12.5` |
| `-8.3` | `-8.3` |
| `0` | `0` |
| `231.2` | `+231.2` |
| `1234.56` | `+1234.6` |
| `0.96` | `+1` |
| `-12.5` | `-12.5` |
| `100` | `+100` |
| `12` | `+12` |

## Requisitos funcionales

### Formateadores (`screens/home/format.ts`)

- **R1**: THE SYSTEM SHALL hacer que `fmtMinutes` devuelva, para cada fila de la
  tabla «`fmtMinutes`», exactamente la salida listada: `'—'` para `null`; en otro
  caso redondea con `Math.round` y devuelve `` `${m}m` `` si el entero es menor que 60
  y `` `${Math.floor(m / 60)}h ${m % 60}m` `` si no (con `m` ya redondeado).
  WHEN el redondeo de un valor menor que 60 alcanza 60 THE SYSTEM SHALL devolver
  `'1h 0m'` y nunca `'60m'` ni `'0h 60m'`.
  - Test: `screens/home/format.test.ts`, `it.each` titulado `'#219 R1: ...'` con las
    19 filas de la tabla. Las 12 filas sin «verde al nacer» nacen rojas
    (`0.4`, `0.5`, `59.4`, `59.5`, `59.6`, `89.5`, `119.4`, `119.5`, `119.6`,
    `210.33333333333334`, `1439.6`, `99999.5`); la prueba de mutación es quitar el
    `Math.round` y ver rojas las filas con decimales.

- **R2**: THE SYSTEM SHALL hacer que `fmtCount` devuelva, para cada fila de la tabla
  «`fmtCount`», exactamente la salida listada: `'—'` para `null`; en otro caso
  `String(Number(count.toFixed(1)))`. WHEN el valor redondeado a un decimal es un
  entero THE SYSTEM SHALL NOT escribir `.0`.
  - Test: `screens/home/format.test.ts`, `it.each` titulado `'#219 R2: ...'` con las
    13 filas. Nacen rojas `0.04`, `2.25`, `2.33333333333333`, `2.75`, `2.95`, `2.96`,
    `3.05` y `14.28571428571`. La fila `3.05` ancla el algoritmo: sustituir `toFixed`
    por `Math.round(count * 10) / 10` la pone roja.

- **R3**: THE SYSTEM SHALL dejar `fmtKm` con su salida actual (un decimal siempre,
  `.0` incluido) para cada fila de la tabla «`fmtKm`».
  - Test: `screens/home/format.test.ts`, `it.each` titulado `'#219 R3: ...'` con las
    8 filas. **Nace verde entera**: es un candado de regresión contra leer el plan
    §2 («`fmtKm` a un decimal cuando el valor no es entero») como «quitar el `.0`».
    Prueba de mutación: cambiar `fmtKm` para devolver `'22 km'` con `22000` y ver
    rojas las filas `0` y `22000`.

### Media del gráfico (`screens/home/weekly-activity-chart.tsx`)

- **R4**: WHEN la tarjeta pinta la etiqueta `weekly-activity-average-label` THE
  SYSTEM SHALL mostrar `t('weeklyActivity.average', { value })` con `value` igual a
  `formatMetricValue(selectedMetric, average)` (sin cambiar la plantilla ni la clave)
  y por tanto el formato de R1, R2 y R3 aplicado a la media aritmética **sin
  redondear** de los días medidos. Literales (la etiqueta completa, comparada con
  regex anclada `^...$` porque `toHaveTextContent` con cadena es subcadena):

  | Idioma | Métrica | Días medidos (valor del día) | Media real | Etiqueta |
  |---|---|---|---|---|
  | es | minutos | 200, 210, 221 | 210.33333333333334 | `Media 3h 30m` |
  | es | minutos | 59, 60, 60, 60, 59 | 59.6 | `Media 1h 0m` |
  | es | minutos | 119, 120, 120 | 119.66666666666667 | `Media 2h 0m` |
  | es | minutos | 44, 45, 45 | 44.666666666666664 | `Media 45m` |
  | en | minutos | 200, 210, 221 | 210.33333333333334 | `Average 3h 30m` |
  | es | paseos | 2, 2, 3 | 2.3333333333333335 | `Media 2.3` |
  | es | paseos | 2, 3, 3, 3 | 2.75 | `Media 2.8` |
  | es | paseos | 2, 2, 2 | 2 | `Media 2` |
  | es | distancia (m) | 1000, 1000, 1100 | 1033.3333333333333 | `Media 1.0 km` |

  - Test: `screens/home/weekly-activity-chart.test.tsx`, bloque nuevo
    `describe('#219 R4: la etiqueta de media aplica el formato de los formateadores')`
    con `it.each` sobre esas nueve filas. Minutos: `makeWeek('2026-09-02', [..., null, ...])`
    (siete entradas, el resto `null`). Paseos y distancia: `makeDay({ date, walkCount })`
    / `makeDay({ date, distanceM })` en días consecutivos desde `2026-09-02`, con
    `activeMinutes` por defecto, y pulsar `weekly-activity-metric-walkCount` /
    `weekly-activity-metric-distanceM` con `await fireEvent.press` antes de leer
    (patrón del `it` de R12 «cambia la tendencia al delta de la métrica seleccionada»).
    Nacen rojas las cuatro filas de minutos en `es`, la de minutos en `en` y las dos
    de paseos con decimales (`Media 2.3`, `Media 2.8`). Nacen verdes `Media 2`
    (media entera) y `Media 1.0 km` (`fmtKm` no cambia): se declaran como candados de
    regresión.

- **R5**: THE SYSTEM SHALL NOT redondear el valor `average` que alimenta la línea
  discontinua `weekly-activity-average`: el redondeo vive solo en el texto de la
  etiqueta. WHEN la media real es 59.6 (días 59, 60, 60, 60, 59) THE SYSTEM SHALL
  dibujar la línea con `y1 === y2 === 100 - 59.6` (con el doble de `BarChart` del
  fichero, `bar.height / bar.value` es 1 y `baselineY` 100), no en `100 - 60`.
  - Test: `screens/home/weekly-activity-chart.test.tsx`,
    `it('#219 R5: la línea de media usa el valor real, no el redondeado')`:
    `expect(props.y1).toBeCloseTo(40.4, 6)` y `y2` igual (precedente: el `it` de R7
    «promedia solo los días medidos…», que fija `y1: 80, y2: 80`). **Nace verde**
    (la línea ya usa el valor real); prueba de mutación: aplicar `Math.round` al
    cálculo de `average` en el componente y ver rojo este `it`.

### Tendencia

- **R6**: THE SYSTEM SHALL pintar `{{percent}}` de `weeklyActivity.trend` con punto
  decimal en los dos idiomas, un decimal como máximo, signo `+` solo para valores
  positivos y sin separador de miles, según la tabla «Tendencia»: la etiqueta
  completa en español es `` `${percent} % frente a la semana previa` `` y en inglés
  `` `${percent}% vs. previous week` ``. THE SYSTEM SHALL NOT sustituir `.` por `,`
  en ningún idioma.
  - Test: `screens/home/weekly-activity-chart.test.tsx`:
    1. Se enmiendan los tres literales de coma del bloque `R12` (ver [[design]]
       §Candados): `'+12,5 % frente a la semana previa'` pasa a
       `'+12.5 % frente a la semana previa'` y los dos
       `'-8,3 % frente a la semana previa'` pasan a
       `'-8.3 % frente a la semana previa'`.
    2. `it.each('#219 R6: ...')` con las nueve filas de la tabla, leyendo
       `weekly-activity-trend-label` con regex anclada
       (`/^\+12\.5 % frente a la semana previa$/` ...; el escape de `+` y `.` es
       obligatorio, y el anclaje evita que `0 % frente…` case dentro de `+10 % frente…`),
       pasando `weekComparison = { ...NO_COMPARISON, activeMinutes: <valor> }`.
    3. Un `it('#219 R6: en inglés usa punto y sin espacio antes del %')` con
       `renderChart([makeDay()], { ...NO_COMPARISON, activeMinutes: 12.5 }, 'en')`
       y `/^\+12\.5% vs\. previous week$/`.
    Contra el código de hoy nacen rojas las filas del español `+12.5`, `-8.3`,
    `+231.2`, `+1234.6` y `-12.5` (el `.replace` las vuelve coma; `1234.56` además
    sale con separador de miles) y las tres enmiendas. Nacen verdes `0`, `+1`, `+100`
    y `+12`, y el `it` en inglés (el inglés nunca pasó por el `.replace`): se declaran
    como candados de regresión.

- **R7**: THE SYSTEM SHALL formatear la tendencia sin depender del locale ni de los
  datos ICU del dispositivo: el texto no cambia aunque el formateador de números del
  entorno use coma decimal para el idioma de la app.
  - Test: `screens/home/weekly-activity-chart.test.tsx`,
    `it('#219 R7: la tendencia no depende del locale del entorno')`. Guarda
    `const RealNumberFormat = Intl.NumberFormat` y espía `Intl.NumberFormat` con una
    implementación que construye `new RealNumberFormat(locale === 'en-US' ? 'en-US' : 'es-ES', options)`
    (simula un dispositivo cuyo `es-MX` usa coma); renderiza en español con
    `activeMinutes: 12.5` y espera `/^\+12\.5 % frente a la semana previa$/`; restaura
    el espía en un `finally`. Es la única forma de probar la independencia de locale:
    jest corre con ICU completo y `process.env.TZ` no interviene (no hay `Date`), así
    que el `es-MX` real ya da punto y un test sin el espía no distinguiría R7 de un
    `Intl.NumberFormat(locale, …)` sin `.replace`. Prueba de mutación: volver a pasar
    `locale` al constructor y ver este `it` en rojo.

### No regresión y alcance

- **R8**: THE SYSTEM SHALL conservar sin modificar el texto de todos los demás
  consumidores de `fmtMinutes`, `fmtCount` y `fmtKm` (que reciben enteros del
  backend o, en `fmtKm`, un formato que no cambia): la tira de Inicio, el resumen
  del día, el valor de cada columna, el tooltip, el panel de detalle, la frase de la
  mascota, y la etiqueta de media para valores enteros (`Media 30m`, `Media 20m`).
  - Test: ninguno nuevo. Los `it` existentes siguen verdes **sin editar una sola
    línea de ellos**: `screens/home/index.test.tsx`
    (`R9: summary degrada con gracia` › `formats metrics from the last day in the response`,
    que fija `1h 35m` y `2.4 km`; `#69 R1: la tira de hoy tiene cuatro celdas con tres divisores` ›
    `asigna cada valor, icono y etiqueta a su celda y a ninguna otra`),
    `screens/home/weekly-activity-chart.test.tsx` (`R5` › `separa el guion del día ausente y el valor cero medido`;
    `R6` › `repinta distancia desde la opción pulsada con los mismos datos`; `R7` ›
    `dibuja la media discontinua y rotula cifras tabulares` (`Media 20m`); `R8` ›
    `abre tooltip y panel con las cuatro métricas y propaga la DayEntry completa` (`12h 0m`);
    `#141 R1` › `el texto de los dos hijos de cada columna…`) y
    `screens/home/pingo-phrase.test.ts` (`#190 R9`, `#190 R8`: `2.4 km`, `0.1 km`).
    El reporte de implementación lista `git diff origin/dev -- <esos ficheros>` y la
    única edición permitida en ellos son los tres literales de R6.

- **R9**: THE SYSTEM SHALL NOT añadir ni cambiar claves de catálogo, plantillas, ficheros
  ni dependencias, y THE SYSTEM SHALL mantener grep-limpios (cero literales hex
  `#abc`, cero `StyleSheet`, cero `text-[10px]`) los cuatro ficheros que toca
  y que los candados de drift ya inventarían: `screens/home/format.ts`,
  `screens/home/format.test.ts`, `screens/home/weekly-activity-chart.tsx` y
  `screens/home/weekly-activity-chart.test.tsx`. Los comentarios citan el id con la
  forma `#219 R<n>` (la única que exime `HEX_LITERAL`); un `#219` suelto lo rompe.
  - Test: sin test nuevo; lo cubren `__tests__/design-drift.test.ts`
    (`#68 R18`, `#69 R13`, `#70 R17`, `#85 R12`, que leen esos ficheros),
    `providers/__tests__/language-provider.test.tsx`, `__tests__/ui-copy-table.ts`
    y `__tests__/ui-language.test.ts` **sin editar**, y la verificación del reporte:
    `git diff origin/dev --stat` lista solo los cuatro ficheros de arriba (más
    `specs/mobile-weekly-average-format/`, `progress/impl_mobile-weekly-average-format.md`
    y, solo si el reviewer lo pide, `feature_list.json`) y `bun run test` completo sin
    pipe termina con código 0.

## Fuera de alcance

- Redondear la media en el backend (el backend ya entrega enteros; el decimal nace
  solo en el móvil).
- `screens/map/index.tsx` y su `fmtKm` duplicado, `fmtSpeed`, `utils/alert-location.ts`,
  `fmtKg` y el delta mensual de peso: ya usan punto y no son la media semanal.
- `dayAccessibilityLabel` (`value ?? '—'` crudo para minutos) y `formatAxisLabel`
  (etiquetas del eje Y): reciben enteros o ticks del gráfico y no son la media.
- Mostrar la media de minutos en horas con decimal («Media 3,5 h», opción R-B del
  informe): el humano eligió «Media 3h 30m».
- Coma decimal en español (opción S-B): el humano eligió punto en todo (es-MX).
- Cambiar la plantilla `weeklyActivity.average` («Media {{value}}») o su traducción.
- Un candado de ancho de la etiqueta: no hay forma de medir el desborde en jest; ver
  la casilla de smoke en § Aprobación.
- Valores negativos, `NaN` e `Infinity` en `fmtMinutes`, `fmtCount` y `fmtKm`.
- Una enmienda a `docs/ui-guidelines.md` (la carta no fija el formato de números;
  cualquier enmienda es el gate G4 del plan).

## Aprobación

- [x] Aprobado por humano (firma delegada del leader, mandato 2026-10-23 ampliado 2026-10-26; fecha: 2026-10-26)
- [ ] Smoke del formato en dev build Android hecho y aprobado por el humano (cierre, no gate de implementación)
  Va en `progress/smoke_ui.md` (plan §5, G2): con datos reales, la etiqueta «Media …» de las tres métricas cabe en la card sin salirse junto al título, y la tendencia muestra punto decimal.
