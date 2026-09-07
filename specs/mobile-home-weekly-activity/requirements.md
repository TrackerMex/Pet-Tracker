---
feature: "mobile-home-weekly-activity"
status: spec_ready     # draft | spec_ready | approved
tags: [harness, spec]
---

# Requisitos — [[mobile-home-weekly-activity]]

> Notación EARS. Cada requisito tiene id único R\<n\>, inmutable una vez aprobado.
> Ver [[design]] para las decisiones técnicas, las premisas verificadas y las
> alternativas descartadas; [[../../docs/ui-guidelines|ui-guidelines]] para la
> carta de UI que gobierna todo trabajo móvil (gana sobre cualquier skill) y
> [[../../docs/architecture|architecture]] para las reglas de capas.
>
> **Fuente de diseño** (versionada, no de memoria):
> `specs/mobile-figma-polish/design-src/App.tsx:411-424` — la gráfica de
> actividad semanal de la Home del Figma Make. Informe de origen:
> `progress/explore_design-gap-vs-make.md` §7 (Bloque 1).
>
> **Base de medición**: todo delta de esta spec se mide contra `main` en el
> commit **`4a5f6dd`** (merge del PR #112, #67). Ningún requisito congela un
> recuento absoluto: se fijan deltas y consistencias internas, porque un número
> absoluto caduca entre que se escribe la spec y se implementa. Es la cuarta vez
> que se dice; las tres anteriores costaron una sesión cada una.
>
> **Skills obligatorias antes de tocar código** (carta §Skills):
> `expo:expo-overview` → `expo:expo-native-ui` y `expo:expo-design-system`, más
> `appllama-app-design-skill`. En Codex CLI, las equivalentes del plugin `expo`.
> La carta gana sobre la skill en todo conflicto de estilo.

---

## 0. Premisas del enunciado, verificadas una por una

Las siete afirmaciones del enunciado de #68 en `feature_list.json` se han
comprobado contra el árbol en `4a5f6dd`. **Las siete sobreviven en el fondo;
cuatro llevan corrección** de línea, de forma o de alcance. El detalle con
`fichero:línea` actual está en [[design]] §1; las correcciones que salen de esta
spec, en [[design]] §2. Resumen ejecutable:

| # | Premisa | Veredicto |
|---|---|---|
| 1 | Una entrada por día sin huecos; 7 días por defecto terminando hoy en la tz del dueño | **Cierta** |
| 2 | El cliente llama sin parámetros en `src/api/activity.ts:26-31` | **Cierta**, línea vigente |
| 3 | Home descarta seis de siete y se queda con la última, en `home.tsx:86-89` | **Cierta en el hecho, línea caducada**: hoy `home.tsx:100-103` |
| 4 | Un día pasado sin datos vuelve `source:'missing'` con todo `null`, no cero | **Cierta**, y comprobada en el mapper del backend; falta un matiz decisivo (§0.1) |
| 5 | El array es cronológico terminando hoy, no lunes a domingo | **Cierta** |
| 6 | `weekComparison` trae la variación contra los 7 días previos | **Cierta con forma más estrecha** que la que dice el enunciado (§0.2) |
| 7 | `weight-chart.tsx` existe y su patrón sirve para barras sin librería nueva | **Cierta con matiz**: el patrón reutilizable no es el SVG (§0.3) |

### 0.1 El discriminante es `source`, nunca `activeMinutes === null`

El enunciado acierta: `missingEntry()`
(`backend-pet-tracker/src/modules/activity/application/use-cases/get-daily-activity.use-case.ts:194-207`)
pone las nueve métricas a `null` y el comentario de `:95-96` declara el motivo
—"un cero significaría reposo confirmado y mentiría"—. Lo que el enunciado **no**
dice, y esta spec fija, es la otra mitad: **ningún día medido vuelve con `null`
en `activeMinutes`**. Un día `stored` lo trae de una columna no nula
(`daily-activity.entity.ts:8-12`) y un día `computed` lo calcula
`computeDailyActivity`, que devuelve **ceros** cuando no hay posiciones
(`backend-pet-tracker/src/pipeline/activity.ts:84-87`).

Consecuencia normativa: `null` y `missing` coinciden **hoy**, y por eso una
implementación que ramifique por `activeMinutes === null` pasaría los tests sin
ser correcta. La rama de "sin dato" se decide por **`day.source === 'missing'`**
y por nada más (R3), y una mutación planta exactamente ese cambio para
demostrar que el candado lo ve (R10).

### 0.2 `weekComparison` es un **delta porcentual de la media diaria**

No es una diferencia absoluta ni un valor por día.
`backend-pet-tracker/src/modules/activity/domain/week-comparison.ts:24-51`
devuelve, por métrica, `round(((media del rango − media de la base) / media de
la base) × 1000) / 10` — es decir, **porcentaje a un decimal** —, y `null`
cuando alguna de las dos ventanas no tiene muestras o la media base vale 0
(`:39-46`). La base son los **7 días naturales anteriores a `from`**
(`get-daily-activity.use-case.ts:144-157`, `ACTIVITY_BASELINE_DAYS = 7`).

Y solo cubre **tres** métricas: `distanceM`, `activeMinutes` y `walkCount`
(`week-comparison.ts:12-16`). **`restMinutes` no tiene comparación.** Eso no es
un detalle de presentación: condiciona qué métrica puede pintar la barra si se
quiere la tendencia gratis (D1 de [[design]]).

El cliente ya lo tipa (`mobile-pet-tracker/src/api/types.ts:92-96`) y
`getDailyActivity` ya lo devuelve (`src/api/activity.ts:5,56`); la Home lo
ignora por completo hoy.

### 0.3 De `weight-chart.tsx` se reutiliza el criterio, no el SVG

`mobile-pet-tracker/src/components/weight-chart.tsx:1-68` dibuja con
`react-native-svg` (`Polyline`, `Polygon`, `Circle`) porque una polilínea no se
puede componer con `View`. Una barra sí: es un rectángulo. Lo que se copia de
ese fichero es (a) no añadir librería de gráficas, (b) resolver el color del
trazo con `useThemeColors(['accent-strong'])` (`:16`), (c) resolver el vacío con
un `Text` con `testID` propio (`:19-25`), y (d) resolver la copy dentro del
componente con `useTranslate()` (`:12,17,22`), registrándola en
`src/__tests__/ui-copy-table.ts` (`:124`). Lo que **no** se copia es el SVG:
razones medidas en [[design]] §3 D7.

---

## Requisitos

### R1 — El componente existe, con su API exacta, y no habla con la red

- **R1**: WHEN la app monta `WeeklyActivityChart` THE SYSTEM SHALL exponerlo
  desde `mobile-pet-tracker/src/components/weekly-activity-chart.tsx` con la
  firma exacta

  ```ts
  export interface WeeklyActivityChartProps {
    days: DayEntry[];
    weekComparison: WeekComparison;
  }
  export function WeeklyActivityChart(props: WeeklyActivityChartProps): JSX.Element
  ```

  AND SHALL exportar además `WEEKLY_CHART_HEIGHT = 80`,
  `WEEKLY_BAR_MIN_HEIGHT = 6` y
  `weekdayLabel(date: string, locale: string, style: 'short' | 'long'): string`
  —los tres para los tests, no para otros componentes—; AND el fuente del
  componente SHALL **no** importar nada de `src/api/` que no sea un tipo
  (`import type`), ni `src/hooks/use-api`, ni `fetch`, ni ninguna dependencia
  que no esté ya en `mobile-pet-tracker/package.json`.
  - Test: `src/components/__tests__/weekly-activity-chart.test.tsx` ::
    `describe('R1: WeeklyActivityChart recibe los días y no habla con la red')`

### R2 — Una columna por día, en el orden recibido, con altura proporcional

- **R2**: WHEN `WeeklyActivityChart` recibe `days` THE SYSTEM SHALL renderizar
  **una columna por entrada, en el mismo orden del array** (cronológico
  ascendente, §0 premisa 5), sin reordenar, sin rellenar y sin recortar; AND
  cada columna SHALL llevar `testID={`weekly-activity-day-${day.date}`}`, de
  modo que el `testID` sea **la fecha y no el índice**; AND la barra de un día
  medido (`day.source !== 'missing'`) SHALL tener altura
  `max(WEEKLY_BAR_MIN_HEIGHT, round((activeMinutes / máximo) × WEEKLY_CHART_HEIGHT))`,
  donde `máximo` es el mayor `activeMinutes` de los días medidos; AND WHEN ese
  máximo vale 0 THE SYSTEM SHALL dar a todas las barras medidas exactamente
  `WEEKLY_BAR_MIN_HEIGHT`, sin dividir entre cero.
  - Test: `src/components/__tests__/weekly-activity-chart.test.tsx` ::
    `describe('R2: cada día del array es una columna y su altura es proporcional')`

### R3 — "Sin dato" y "cero confirmado" son visualmente distintos

- **R3**: WHEN una entrada tiene `source === 'missing'` THE SYSTEM SHALL
  renderizar en su columna **ninguna barra** y en su lugar el glifo `'—'` con
  `testID={`weekly-activity-missing-${day.date}`}` y clase
  `text-2xs font-normal text-muted`; AND WHEN una entrada tiene
  `source !== 'missing'` THE SYSTEM SHALL renderizar siempre una barra con
  `testID={`weekly-activity-bar-${day.date}`}`, **incluida la de
  `activeMinutes === 0`**, que mide `WEEKLY_BAR_MIN_HEIGHT` y por tanto se ve;
  AND THE SYSTEM SHALL decidir esa rama **por `day.source`**, nunca por
  `day.activeMinutes === null` (§0.1); AND en una misma gráfica con un día
  `missing` y un día de cero minutos THE SYSTEM SHALL dejar que los dos
  `testID` coexistan y sean distintos, de forma que ningún assert pueda
  confundirlos.
  - Test: `src/components/__tests__/weekly-activity-chart.test.tsx` ::
    `describe('R3: un día sin dato no es una barra de altura cero')`

### R4 — La letra del eje sale de la fecha, y sobrevive a la zona horaria

- **R4**: WHEN se pinta la etiqueta del eje de una columna THE SYSTEM SHALL
  derivarla de `day.date` mediante `weekdayLabel`, que SHALL construir la fecha
  **descomponiendo la cadena `'YYYY-MM-DD'` en año, mes y día**
  (`new Date(year, month - 1, day)`) y SHALL formatearla con
  `toLocaleDateString(locale, { weekday: style })` sobre el `locale` que
  devuelve `useLocale()` de `src/providers/language-provider.tsx`
  (`'es-MX'` o `'en-US'`), con `style` **`'short'`**; AND THE SYSTEM SHALL
  **no** pasar nunca la cadena cruda a `new Date(...)`, ni derivar la etiqueta
  del índice del array, ni de una tabla fija de siete letras.
  - Motivo medido, no estimado: bajo `TZ=America/Mexico_City`,
    `new Date('2026-09-06').toLocaleDateString('es-MX', {weekday:'short'})`
    devuelve `'sáb'` y lo correcto es `'dom'` — un día entero de desfase que en
    un runner en UTC no se ve.
  - Test: `src/components/__tests__/weekly-activity-chart.test.tsx` ::
    `describe('R4: la letra del eje sale de la fecha, no del índice')` →
    `it('usa el día real de cada fecha en los dos idiomas')`, que monta el rango
    `2026-09-02 … 2026-09-08` —que **no** empieza en lunes y **cruza el fin de
    semana**— y espera exactamente `['mié','jue','vie','sáb','dom','lun','mar']`
    en `es` y `['Wed','Thu','Fri','Sat','Sun','Mon','Tue']` en `en`. Una
    implementación por índice devuelve siempre la misma secuencia empezando en
    lunes y muere aquí.

- **R4b**: WHEN el proceso corre en una zona horaria de offset negativo THE
  SYSTEM SHALL devolver la misma etiqueta que en UTC para la misma fecha de
  calendario, de modo que la gráfica no se desplace un día según dónde esté el
  teléfono.
  - Test: mismo `describe` que R4 →
    `it('no se desplaza un día en una zona horaria negativa')`: guarda
    `process.env.TZ`, lo fija a `'America/Mexico_City'`, llama a
    `weekdayLabel('2026-09-06', 'es-MX', 'short')`, espera `'dom'`, y lo
    restaura en un `finally`. Es el **único** candado que mata la mutación 2 de
    R10c; si con esa mutación plantada la suite sigue verde, este `it` está mal
    escrito y hay que arreglarlo antes de seguir.

### R5 — Cada barra tiene etiqueta accesible; la gráfica no es un blob mudo

- **R5**: WHEN se renderiza una columna THE SYSTEM SHALL declarar en ella
  `accessible` y un `accessibilityLabel` resuelto por catálogo: para un día
  medido, `t('weeklyActivity.barLabel', { day, minutes })` donde `day` es
  `weekdayLabel(date, locale, 'long')` y `minutes` es el entero
  `activeMinutes ?? 0`; para un día `missing`,
  `t('weeklyActivity.barLabelMissing', { day })`; AND THE SYSTEM SHALL declarar
  esa etiqueta en la **columna**, no en la barra ni en el glifo, de modo que el
  lector de pantalla anuncie siete elementos y no uno; AND THE SYSTEM SHALL
  **no** declarar `accessibilityLabel` en el contenedor de las siete columnas.
  - Test: `src/components/__tests__/weekly-activity-chart.test.tsx` ::
    `describe('R5: cada columna se anuncia por separado')`

### R6 — La tendencia entra, con `activeMinutes`, y desaparece si no hay base

- **R6**: WHEN `weekComparison.activeMinutes` es un número THE SYSTEM SHALL
  renderizar una fila con `testID="weekly-activity-trend"` bajo las barras, con
  el icono `TrendUp` de `reicon-react-native` si el valor es `> 0` y `TrendDown`
  si es `< 0` —icono real, nunca un glifo tipográfico (#62 R7)—, el color del
  icono resuelto con `useThemeColors(['muted'])`, y el texto
  `t('weeklyActivity.trend', { percent })` donde `percent` es el valor
  formateado con
  `new Intl.NumberFormat(locale, { signDisplay: 'exceptZero', maximumFractionDigits: 1 })`;
  AND ese `Text` SHALL declarar `style={TABULAR_NUMS}` de
  `src/theme/native-styles.ts` (#62 R15); AND WHEN el valor es exactamente `0`
  THE SYSTEM SHALL pintar la fila **sin icono** y con el texto formateado a
  `'0'`; AND WHEN `weekComparison.activeMinutes` es `null` THE SYSTEM SHALL
  **no** renderizar la fila en absoluto, sin dejar hueco ni texto de relleno;
  AND THE SYSTEM SHALL **no** colorear la tendencia con `success` ni con
  `danger` (D4 de [[design]]).
  - Test: `src/components/__tests__/weekly-activity-chart.test.tsx` ::
    `describe('R6: la tendencia sale de weekComparison y se calla sin base')`

### R7 — La semana entera sin datos es un mensaje, no siete guiones

- **R7**: WHEN **todas** las entradas de `days` tienen `source === 'missing'`,
  o `days` está vacío, THE SYSTEM SHALL renderizar en lugar de las columnas un
  único `Text` con `testID="weekly-activity-empty"` y el texto
  `t('weeklyActivity.noDataYet')`, conservando la cabecera de la tarjeta; AND
  WHEN al menos una entrada está medida THE SYSTEM SHALL renderizar las
  columnas completas —las medidas y las `missing`— y **no** el mensaje.
  - Test: `src/components/__tests__/weekly-activity-chart.test.tsx` ::
    `describe('R7: la semana entera sin dato se resuelve con un mensaje')`

### R8 — La Home la monta en su sitio y **sin una sola petición nueva**

- **R8**: WHEN la Home resuelve `activity.data?.kind === 'ok'` THE SYSTEM SHALL
  renderizar `<WeeklyActivityChart days={activity.data.days}
  weekComparison={activity.data.weekComparison} />` dentro de una `Card`
  compartida con `testID="weekly-activity-card"`, colocada dentro del
  envoltorio `testID="home-content"` **inmediatamente después de
  `summary-card` y antes de `last-position-card`**; AND THE SYSTEM SHALL
  alimentarla con el mismo `useApi(activityFn)` que ya existe en
  `src/app/(tabs)/home.tsx:89-97`, sin añadir ninguna llamada a la API, sin
  parámetros nuevos en `getDailyActivity` y sin tocar `activityFn`; AND THE
  SYSTEM SHALL **no** modificar `summary-card`, ni `collar-card`, ni
  `last-position-card`, ni el hero, ni la derivación de `today`
  (`home.tsx:100-103`), que sigue alimentando al hero y a las tres celdas del
  resumen.
  - Test: `src/app/(tabs)/__tests__/home.test.tsx` ::
    `describe('R8: la Home monta la actividad semanal sin pedir nada nuevo')`,
    con tres `it`: que la tarjeta aparece con los siete días que devuelve el
    mock; que `mockGetDailyActivity` se llama el mismo número de veces que en el
    escenario equivalente sin gráfica; y que el orden de los hijos de
    `home-content` es `summary-card` → `weekly-activity-card` →
    `last-position-card`.

- **R8b**: WHILE `activity.data === undefined` THE SYSTEM SHALL renderizar en
  ese mismo hueco un `Skeleton` de heroui con
  `testID="weekly-activity-skeleton"` y clase `w-full rounded-card`, con la
  altura del contenido final declarada por `style` (carta §Decisiones fijas 7 y
  §12: el skeleton lleva el radio del contenido que sustituye); AND WHEN
  `activity.data` resuelve a `no-tracking`, `error`, `unreachable` o
  `missing-config` THE SYSTEM SHALL **no** renderizar ni la tarjeta ni el
  skeleton, porque `summary-card` ya muestra esos mensajes
  (`home.tsx:288-299`) y duplicarlos es ruido.
  - Test: mismo `describe` que R8 →
    `it('carga con skeleton y se calla cuando la actividad falla')`

### R9 — Copy en los dos idiomas, resuelta por clave y registrada

- **R9**: WHEN esta feature introduce copy THE SYSTEM SHALL añadir a
  `mobile-pet-tracker/src/i18n/catalog.ts` las **seis** claves nuevas del
  ámbito `weeklyActivity`, en **`en` y en `es`**, con estos valores exactos:

  | Clave | `es` | `en` |
  |---|---|---|
  | `weeklyActivity.title` | `Actividad semanal` | `Weekly activity` |
  | `weeklyActivity.lastSevenDays` | `últimos 7 días` | `last 7 days` |
  | `weeklyActivity.noDataYet` | `Aún no hay actividad registrada` | `No activity recorded yet` |
  | `weeklyActivity.barLabel` | `{{day}}: {{minutes}} minutos activos` | `{{day}}: {{minutes}} active minutes` |
  | `weeklyActivity.barLabelMissing` | `{{day}}: sin datos` | `{{day}}: no data` |
  | `weeklyActivity.trend` | `{{percent}} % frente a la semana previa` | `{{percent}}% vs. previous week` |

  AND THE SYSTEM SHALL resolver las seis **dentro del componente** con
  `useTranslate()`, como hace `weight-chart.tsx`, sin dejar ningún literal de
  copy en el fuente; AND THE SYSTEM SHALL añadir las **seis filas
  correspondientes al bloque `R3_HOME`** de `src/__tests__/ui-copy-table.ts`,
  con `file: 'src/components/weekly-activity-chart.tsx'`, siguiendo el
  precedente literal de `weight-chart.tsx` en `R5_HEALTH` (`:124`); AND THE
  SYSTEM SHALL registrar las seis en la tabla de
  `specs/mobile-ui-language/design.md` §2, como exige la carta §Dirección de
  arte 6.
  - Nota: `'—'` **no** es copy. Es el mismo símbolo que ya usan
    `home.tsx:39,44,48` y `pet-hero-header.tsx:126` para "sin dato", y no entra
    al catálogo.
  - Test: `src/__tests__/ui-language.test.ts` (candado preexistente: una clave
    presente en un idioma y ausente en el otro no compila, y
    `checkUses(ALL_USES)` exige una fila por llamada) + los deltas de R10.

### R10 — Verificación: grep-clean, deltas y mutación

- **R10**: WHEN el reviewer valida la feature THE SYSTEM SHALL presentar la
  suite móvil completa en verde —`bun run test` desde `mobile-pet-tracker/`—
  sin debilitar ni eliminar ningún assert de conducta y sin renombrar ningún
  `testID` existente; AND SHALL mantener el grep-clean de la carta §Decisiones
  fijas 3 intacto: **cero** hex fuera de `src/theme/`, **cero** clases
  arbitrarias `[...]`, **cero** `StyleSheet.create`, **cero** shadow/elevation
  legacy, y **cero** clases de radio fuera de la escala de #62 R4
  (`rounded-2xl`, `rounded-lg`, `rounded-md`, `rounded-sm`).

- **R10b**: WHEN los candados de recuento se actualicen THE SYSTEM SHALL
  registrar **deltas contra `4a5f6dd`**, nunca números nuevos escritos a mano en
  esta spec. Los deltas exactos y su motivo:

  | Candado | Fichero del candado | Delta contra `4a5f6dd` | Motivo |
  |---|---|---|---|
  | filas de `R3_HOME` y su `toHaveLength` | `ui-language.test.ts` / `ui-copy-table.ts` | **+6** | las seis claves de R9, todas en el fichero nuevo |
  | `SCREEN_FILES` y su `toHaveLength` | `ui-language.test.ts:356` | **+1** | `weekly-activity-chart.tsx` entra en `ALL_USES` |
  | `ALL_USES` vs. suma de los once bloques | `ui-copy-table.ts:385-394` | **cuadra solo** | el candado ya es consistencia interna, no cifra a mano |
  | fila de `weekly-activity-chart.tsx` en `#62 R15` | `consistency-classnames.test.ts:333-355` | **+1 fila con valor 1**, e inventario cerrado **+1** | el porcentaje de tendencia es un número que se compara (R6) |
  | `style={CONTINUOUS_CORNER}` por fichero y total | `consistency-classnames.test.ts:269-331` | **sin cambio** | las barras son cápsulas (`rounded-full`) y la tarjeta hereda la esquina del `Card` compartido |
  | `text-accent-strong` por fichero y total | `legibility-classnames.test.ts:117-138` | **sin cambio** | el acento entra como color imperativo de la barra, no como clase de tinta |
  | `bg-accent-soft` global | `consistency-classnames.test.ts:356-419` | **sin cambio** | la gráfica no usa el acento suave |

  El implementer sustituye cada número por el que devuelva el propio grep; el
  reviewer comprueba el **delta**, no el valor.

- **R10c**: WHEN el implementer cierre la feature THE SYSTEM SHALL demostrar,
  con las cuatro mutaciones de [[tasks]] §R10 plantadas de una en una y la
  evidencia en `progress/impl_mobile-home-weekly-activity.md` §prueba de
  mutación, que la suite se pone **roja** con cada una:
  1. la etiqueta del eje pasa a salir del índice en vez de la fecha (mata R4);
  2. `new Date(year, month - 1, day)` pasa a `new Date(date)` — **la mutación de
     zona ciega**: verde en un runner en UTC, roja solo por el `it` de TZ de R4;
  3. la rama `missing` pasa a pintar una barra de altura 0 (mata R3);
  4. desaparece el `accessibilityLabel` de la columna `missing` (mata R5).
  - Test: requisito de verificación (C4 vía (b)); la evidencia es el informe.

---

## Fuera de alcance

Todo lo de esta lista queda **explícitamente fuera** y ninguna decisión de aquí
lo habilita de paso.

- **Cualquier llamada nueva a la API.** Es el criterio de aceptación 1 del
  enunciado y R8 lo fija. Si durante la implementación aparece un dato que
  obliga a una petición nueva, **la feature se para** y se reporta: no se añade.
- **Backend.** Cero. Ni un fichero de `backend-pet-tracker/`. El endpoint ya
  devuelve todo lo que la gráfica necesita (§0).
- **Librería de gráficas.** Ninguna, ni `victory-native`, ni `react-native-gifted-charts`,
  ni `react-native-svg-charts`. Tampoco se estrena `react-native-svg` en este
  componente ([[design]] §3 D7).
- **La tira de 4 celdas sobre el hero** (`design-src/App.tsx:369-376`,
  Peso/Activo/Paseos/Distancia). Es la feature **#69**. #68 no toca
  `summary-card` y deja su hueco abierto: la gráfica se ancla *después* de
  `summary-card`, así que cuando #69 lo sustituya o lo suba bajo el hero, la
  gráfica conserva su posición relativa sin reescribirse.
- **Los accesos rápidos** (`design-src/App.tsx:395-410`). Feature **#71**.
- **Selector de métrica en la gráfica** (tocar para cambiar entre minutos
  activos, distancia y paseos). No hay diseño para esa interacción, ninguna de
  las siete preguntas de la Home la pide, y añade estado a un componente que hoy
  es una función pura de sus props. Los cinco datos por día que la barra no
  pinta **no se pierden de ningún sitio**: siguen llegando en el payload y
  siguen mostrándose donde ya se mostraban ([[design]] §3 D1).
- **Animación de entrada de las barras.** La carta la permitiría (§Animación),
  pero no está pedida, y una barra que crece al montar compite con el hero que
  #67 acaba de estrenar. Si se quiere, va a la lista de
  `progress/audit_animations_mobile.md`.
- **Detalle por día al tocar una barra**, navegación a `/trips`, tooltip,
  eje Y, rejilla, línea de media.
- **Migrar la Home a `src/screens/home/`.** #68 añade seis líneas a
  `home.tsx`; eso no es "tocarla de fondo" en el sentido de
  `docs/conventions.md` §Estructura, y #67 la reescribió mucho más a fondo sin
  migrarla. Se queda como está.
- **La píldora "En línea"**, el pestillo de conectividad roto
  (`ingestion.drizzle.store.ts:97`) y el umbral de silencio: decisión **G**,
  fuera desde #67.
- **Traducir los enum crudos de la API** (`device.connectivity` y compañía):
  carta §Dirección de arte 6, tercer corolario. Feature propia.
- **Enmiendas a specs aprobadas.** #68 **no necesita ninguna**: los candados que
  toca se mueven por delta declarado (R10b), que es exactamente como #67 movió
  los suyos sin enmendar #62 ni #65. Si el reviewer encuentra una, para y lo
  reporta.

---

## Aprobación

- [ ] Aprobado por humano (fecha: ____) ← gate obligatorio antes de implementar

Al aprobar, el humano ratifica además:

1. Las **cuatro correcciones** de [[design]] §2 al enunciado de #68 en
   `feature_list.json`: la línea caducada de la premisa 3, la forma exacta de
   `weekComparison` (porcentaje de la media diaria, sin `restMinutes`), el
   matiz de que el discriminante es `source` y no `null`, y que "el patrón de
   `weight-chart.tsx`" significa "sin librería de gráficas", no "con SVG".
2. Que la barra pinta **`activeMinutes`** y solo eso, y que las otras cinco
   métricas diarias siguen donde están sin perderse ([[design]] §3 D1).
3. Que las **flechas de tendencia entran** aunque el Make no las dibuje, en una
   sola fila, sin color semántico, y que desaparecen cuando no hay base
   ([[design]] §3 D4).
4. La **desviación declarada respecto al Make** en dos puntos, ambos por
   decisión ya cerrada del repo y no re-litigable aquí:
   - la letra del eje es `mié` (formato `short` del locale) y no la `X` del
     Make, porque `narrow` es ambiguo en los dos idiomas (`M J V S D L M` en
     español, `S M T W T F S` en inglés) y la `X` solo existe en español;
   - las barras son cápsulas (`rounded-full`) y no el radio `[5,5,0,0]` del
     Make, porque #62 fijó tres radios y un cuarto es drift.
5. Que la gráfica responde **una** de las siete preguntas de la Home
   (carta §Dirección de arte 3): *¿cómo fue su actividad?*, ensanchándola de hoy
   a la semana. Las otras seis siguen exactamente como las dejó #67.

**Gate humano de verificación, no delegable a IA**: smoke en **dev build de
Android** (nunca Expo Go), en tema **claro** y **oscuro**, con una mascota que
tenga **al menos un día sin dato** y **al menos un día de cero minutos**. Se
comprueba: que el día sin dato y el día de cero se distinguen a simple vista;
que las letras del eje corresponden a los días reales y el último es hoy; que
el número de la tendencia no baila al refrescar; que la gráfica no desborda
horizontalmente en pantalla estrecha; y que TalkBack anuncia las siete columnas
por separado, cada una con su día y su valor.
