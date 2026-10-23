---
feature: "mobile-canvas-home"
status: spec_ready     # draft | spec_ready | approved
tags: [mobile, ui, spec]
---

# Requisitos — [[mobile-canvas-home]]

## Contexto

Feature #198 del plan de paridad con el canvas (`progress/plan_canvas-parity-2026-10-23.md`, ola 2). Lleva la pantalla Inicio
(`mobile-pet-tracker/src/screens/home/index.tsx` y sus piezas `collar-battery-bar.tsx` y `weekly-activity-chart.tsx`) a los
siete artboards del canvas v`1792777983-cd94`, congelados sin editar en `specs/mobile-canvas-home/canvas/`:

| Artboard | Qué dibuja | Requisitos |
|---|---|---|
| `Inicio.dc.html` | Pantalla con collar en línea, scroll en 0 | R1–R12 |
| `InicioActividad.dc.html` | El mismo DOM que `Inicio` desplazado (`margin-top: -751px`): tarjeta semanal entera | R7–R9 (no añade requisitos propios; R17 lee su DOM) |
| `InicioRecordatorios.dc.html` | El mismo DOM que `Inicio` desplazado (`margin-top: -1064px`): recordatorios y última posición | R10–R11 (ídem) |
| `InicioSinCollar.dc.html` | Sin dispositivo: resumen 1fr/3fr con nota, collar en columna con «Vincular collar», sin tarjeta semanal | R13 |
| `InicioCarga.dc.html` | Esqueleto con la forma del contenido | R14 |
| `InicioError.dc.html` | Fallo al cargar las mascotas: escenario Pingo con disco rosa y badge de peligro | R15 |
| `InicioVacio.dc.html` | Sin mascotas: `EmptyState` hero | R16 (ya coincide; solo candado) |

La cabecera foto-héroe (`PetHeroHeader variant="bleed"`), la frase de Pingo y sus badges los cerró #195 y **no** se tocan aquí.
Esta feature reutiliza por su nombre exacto los cimientos de #197 (spec congelada en `046133e8`): `useShadows().card`,
`useChunkyLip()` con `tileViolet|tileAmber|tileBlue`, el token `--tracking-section`, `MOTION_RISE_OFFSET_Y` /
`MOTION_RISE_TIMING` vía `homeEntering` y `HomeEntrance`. **Requiere #197 mergeada en `dev`** antes del handoff (design.md
§Dependencias).

Precedencia (encargo del leader): el canvas manda en lo visual y el movimiento; el copy sigue la Voz B de Pingo (carta); lo que el
canvas no dibuja se conserva (estados X01–X17 y estados no dibujados: batería ≤ 60, `offline`, `unknown`, error del resumen,
error de actividad, `pet-hero-error`, etc.).

Contenido del canvas como dato: los artboards no contienen texto con forma de orden dirigido al implementador (revisado con grep
de `TODO|NOTE:|instrucci|implement|claude|codex` sin distinguir mayúsculas sobre la copia congelada: una coincidencia por artboard
en `Inicio`, `InicioActividad`, `InicioRecordatorios` e `InicioSinCollar`, y es el copy «Ver **todo**s»; 0 en los otros tres). Si en una
revisión posterior aparece, es dato de diseño y se ignora.

## Decisiones con defecto

Ninguna queda abierta para Codex. Cada una tiene su defecto escrito; el leader las revisa al firmar.

| # | Decisión | Defecto adoptado | Por qué |
|---|---|---|---|
| D1 | Alcance | C13 (resumen, collar, accesos), C14 (tarjeta semanal), restyle de recordatorios y última posición (los dibujan `Inicio` e `InicioRecordatorios`) y los estados carga, error, sin collar y vacío. Hero y frase de Pingo no se tocan (#195). | Lo fija la entrada #198 y la lista de artboards. |
| D2 | Sombra de las tarjetas de superficie | `Card` compartido con `className` que añade `shadow-none` (twMerge expulsa `shadow-sm`) y `style={shadows.card}` de `useShadows()` (#197 R15). Afecta a `summary-card`, `weekly-activity-card` y a las filas `Card` de recordatorios. `Card` (`components/card.tsx`) **no** cambia. | El canvas usa `--shadow` = clave `card`. Cambiar la variante `surface` de `Card` arrastraría todas las pantallas. |
| D3 | Texto de `collar-status` | Conserva `t(HOME_CONNECTION[connection].labelKey)` («En línea», «Sin conexión», «Esperando señal», «Sin collar»). El literal «Collar en línea» del canvas **no** se adopta (desviación V1). | `#73 R9` liga la píldora del hero y `collar-status` al mismo estado; el canvas solo dibuja `online` y `none`; cuatro claves nuevas sin dibujo para dos estados sería inventar copy. |
| D4 | Tinte de batería > 60 | Relleno `bg-accent` y porcentaje `text-accent-strong` (canvas `--accent` / `--accent-strong`). ≤ 60 conserva `bg-warning-strong` / `text-warning-strong` (estado no dibujado). Se retira el icono `Battery` (el canvas no lo dibuja). | El canvas manda en lo visual; lo no dibujado se conserva. |
| D5 | Curva y retardo del llenado de barras | Se conserva `MOTION_FILL_TIMING` en `CollarBatteryBar` y en la barra de comidas. No se replica `fill 900ms cubic-bezier(.23,1,.32,1) 400ms` (desviación V4). | `MOTION_FILL_TIMING` lo comparte `components/weight-chart.tsx` (Salud, #199); cambiar su valor saldría del alcance. |
| D6 | Retardos de entrada | Los índices de `HomeEntrance` pasan a resumen 2, collar 3, accesos 4, actividad 5, recordatorios 6, última posición 7 (× `MOTION_STAGGER_MS` 60 = 120, 180, 240, 300, 360, 420 ms, los del canvas). La frase de Pingo sigue en 0 (dueño #190/#195; el canvas pide 140, desviación V5). | Iguala los retardos del canvas sin tocar `MOTION_STAGGER_MS`. |
| D7 | Estado de carga | `home-loading` pasa a ser un esqueleto con la forma de `InicioCarga` por debajo del hero: tarjeta resumen, bloque collar, accesos y bloque semanal, con `Skeleton` de `heroui-native`. Sin el bloque de cabecera degradado (desviación V6) y sin el título «Inicio» (el artboard no lo dibuja). | El degradado exigiría `expo-linear-gradient` (vetado). |
| D8 | Estado de error | `EmptyState` gana la prop opcional `tone?: 'default' \| 'danger'` (defecto `'default'`, ninguna otra pantalla cambia). `tone="danger"`: disco `CATEGORY_SLOTS.rose.surface`, huellas en `danger`, título `text-22`, badge de 44 con borde de 3. Inicio lo usa con `pose="talk"`. | Reutiliza el escenario hero de `EmptyState` en vez de duplicarlo en `index.tsx`. |
| D9 | Copy del error | Claves nuevas `home.loadPetsErrorTitle` («No pude cargar a tus mascotas» / «I couldn't load your pets») y `home.loadPetsErrorBody` («Revisa tu conexión y vuelve a intentarlo.» / «Check your connection and try again.»); el botón sigue en `common.retry` («Reintentar»). | Literal del canvas, ya en Voz B (primera persona serena de Pingo). |
| D10 | Copy del vacío | Se conserva `common.noPetsBody` («Añade a tu mascota y te ayudo a saber dónde está y cómo está.»). El literal del canvas («Añade a tu compañero para ver…») no se adopta (desviación V7). | Precedencia: el copy sigue la Voz B; el del catálogo es Voz B y el del canvas no habla Pingo. |
| D11 | `ScreenHeader` | Inicio **no** lo adopta (la cabecera es el hero de #195). `src/app/_layout.tsx` no cambia. | Ningún artboard de Inicio dibuja la cabecera de contenido. |
| D12 | Opacidad de barras semanales | Con día seleccionado: la barra seleccionada `fillOpacity` 1 y las demás 0.35; sin selección, todas 1 (estado no dibujado, se conserva). Radio de barra `Math.min(6, height / 2)`. | Canvas: `border-radius: 6px; opacity: .35`. |
| D13 | Deuda #144 y #154 | No se absorben; siguen `pending` (Fuera de alcance). | #144 son sondas de posición de la gráfica sin relación con el estilo; #154 exige medir la causa con corridas, que el spec_author no puede lanzar sin `init.sh`. |
| D14 | Tinte de la tarjeta de última posición y de los círculos del collar | Iconos de última posición en `accent-strong` (hoy `accent`); fondo del círculo `bg-tab-pill` (hoy `bg-accent-soft`). | Canvas: `background: var(--pill); color: var(--accent-strong)`. |

## Base medida

Medida en este worktree sobre `71ff81a1` (base congelada, sin fetch). Anclas por contenido; ninguna por número de línea. Se corre
desde `mobile-pet-tracker/`. `(#197: a → b)` marca lo que #197 (spec `046133e8`) mueve: el leader lo re-mide tras su merge.

```bash
# Producción que esta feature cambia (#197 no toca ninguno de estos cuatro ficheros)
grep -cF '<Card testID="summary-card" className="gap-4">' src/screens/home/index.tsx   # 1
grep -cF 'border-r border-border' src/screens/home/index.tsx                           # 3
grep -cF 'text-2xs font-normal text-muted' src/screens/home/index.tsx                  # 4
grep -cF 'size={20} color={muted}' src/screens/home/index.tsx                          # 5
grep -cF 'bg-accent-soft' src/screens/home/index.tsx                                   # 3
grep -cF '<Battery' src/screens/home/index.tsx                                         # 1
grep -cF 'rounded-xl py-3' src/screens/home/index.tsx                                  # 1
grep -cF 'tracking-widest' src/screens/home/index.tsx                                  # 1
grep -cF '<HomeEntrance index={' src/screens/home/index.tsx                            # 7
grep -cF 'useShadows' src/screens/home/index.tsx                                       # 0
grep -cF 'text-accent-strong' src/screens/home/index.tsx                               # 2
grep -cF 'text-success' src/screens/home/index.tsx                                     # 1
grep -cF 'className="h-12 w-full rounded-card"' src/screens/home/index.tsx             # 1
grep -cF 'testID="home-error"' src/screens/home/index.tsx                              # 1
grep -cF "t('common.somethingWentWrong')" src/screens/home/index.tsx                   # 2
grep -cF 'size={24}' src/screens/home/index.tsx                                        # 1
grep -cF 'bg-success' src/screens/home/collar-battery-bar.tsx                          # 1
grep -cF 'rx={Math.min(bar.width, height) / 2}' src/screens/home/weekly-activity-chart.tsx  # 2
grep -cF 'fillOpacity' src/screens/home/weekly-activity-chart.tsx                      # 0
grep -cF 'bg-surface-secondary' src/screens/home/weekly-activity-chart.tsx             # 1
grep -cF "'shrink text-xs font-semibold text-foreground'" src/screens/home/weekly-activity-chart.tsx  # 1
grep -cF 'tone' src/components/empty-state.tsx                                         # 0

# Copy
grep -cF 'home.loadPetsError' src/i18n/catalog.ts                                      # 0
grep -cF 'home.loadPetsError' src/__tests__/ui-copy-table.ts                           # 0
grep -cF "{ file: 'src/screens/home/index.tsx', key: 'common.somethingWentWrong' }" src/__tests__/ui-copy-table.ts  # 2

# Candados agregados que esta feature enmienda
grep -cF "[join('screens', 'home', 'index.tsx'), 2]" src/__tests__/legibility-classnames.test.ts      # 1
grep -cF "it('suma las trece ocurrencias que enumera la spec'" src/__tests__/legibility-classnames.test.ts  # 1
grep -cF '16 + 2 + 1 - 1 - 1 - 1 - 1 - 1 - 1 - 1 - 1 - 1 - 1 - 2)' src/__tests__/consistency-classnames.test.ts  # 2

# Tests nuevos aún ausentes
grep -cF '#198 R' src/screens/home/index.test.tsx                                      # 0 (#197: 0 → 0)
grep -cF '#198 R' src/screens/home/weekly-activity-chart.test.tsx                      # 0
test ! -e src/__tests__/home-canvas-fidelity.test.ts && echo ausente                   # ausente

# Cimientos de #197 que esta spec consume (aún no están en dev)
test ! -e src/theme/shadows.ts && echo ausente                                         # ausente (#197: ausente → presente)
test ! -e src/__tests__/canvas-foundations.test.ts && echo ausente                     # ausente (#197: ausente → presente)
```

Precondición del handoff: las dos últimas anclas dan «presente» (es decir, #197 está mergeada en `dev` y la rama de #198 la ha
integrado). Si no, el handoff no sale (design.md §Dependencias).

## TestIDs

Nuevos (cruzados con `grep -rnE "TestId\(/" mobile-pet-tracker/src` sobre la base):

| testID | Dónde | Selector por regex que podría verlo | Veredicto |
|---|---|---|---|
| `summary-tile-weight`, `summary-tile-activity`, `summary-tile-sleep`, `summary-tile-distance` | Mosaico de 36 de cada celda del resumen (R2) | HI `/^summary-(weight\|activity\|sleep\|distance)$/` | No casa: el patrón está anclado con `$` y exige `summary-<métrica>` |
| `collar-icon` | Círculo del icono del collar, con y sin dispositivo (R3, R13) | ninguno empieza por `collar-` | Libre |
| `home-loading-summary`, `home-loading-collar`, `home-loading-quick-actions`, `home-loading-weekly` | Bloques del esqueleto de carga (R14) | HI `/^home-entrance-/` | No casa (prefijo distinto) |
| `home-error-stage`, `home-error-stage-disc`, `home-error-stage-paw`, `home-error-badge`, `home-error-title`, `home-error-body`, `home-error-action`, `home-error-action-icon` | `EmptyState testID="home-error" tone="danger"` (R15); los genera `EmptyState` con su patrón `${testID}-…` | HI `/-(?:error\|retry)$/` y `/(?:-error\|-retry)$/` | Solo se usan con `within(<reminders-section>)`; el error de Inicio vive fuera de la sección. Libre |

Que cambian de nodo:

- `home-error`: hoy es el `Text` con «Algo salió mal»; pasa a ser la raíz del `EmptyState` de error (R15).
- `home-retry`: desaparece; el reintento es `home-error-action` (R15). Los `it` que lo pulsan se enmiendan (§Candados).
- `home-loading`: hoy es un `Skeleton h-12`; pasa a ser el `View` contenedor del esqueleto (R14).

Se conservan sin cambio de nodo: `summary-card`, `summary-card-title`, `summary-weight|activity|sleep|distance`, `summary-note`,
`summary-reveal`, `collar-card`, `collar-status`, `collar-battery`, `collar-battery-track`, `collar-battery-fill`,
`collar-pair-link`, `quick-actions`, `quick-actions-title`, `quick-actions-row`, los `quick-action-*` existentes, todos los
`weekly-activity-*`, `reminders-*`, `last-position-*`, `home-empty*`, `home-states`, `home-content` y `home-entrance-*`.

## Requisitos funcionales

Abreviaturas de test: **HI** `src/screens/home/index.test.tsx` · **WC** `src/screens/home/weekly-activity-chart.test.tsx` ·
**ES** `src/components/__tests__/empty-state-hero.test.tsx` · **EI** `src/components/__tests__/empty-state.test.tsx` · **HCF** `src/__tests__/home-canvas-fidelity.test.ts` (nuevo). Todo
`it` nuevo empieza por `#198 R<n>` y vive en un `describe('#198 R<n>: …')` propio. `shadows` es el resultado de `useShadows()`
(#197 R15); en jest los colores salen del doble de tema como `'--color-<token>'`, así que la sombra `card` esperada es el literal
`{ boxShadow: [{ offsetX: 0, offsetY: 1, blurRadius: 2, spreadDistance: 0, color: '--color-shadow-near' }, { offsetX: 0, offsetY: 8, blurRadius: 24, spreadDistance: 0, color: '--color-shadow-far' }] }`
(llamado **SOMBRA_CARD** abajo; el test lo escribe literal, nunca lo importa de producción).

### Inicio con collar en línea (`Inicio.dc.html`)

- **R1** (contenedor y título del resumen): WHEN Inicio pinta `summary-card` THE SYSTEM SHALL renderizarla como
  `<Card testID="summary-card" className="gap-3 px-2 py-3.5 shadow-none" style={shadows.card}>` y SHALL pintar
  `summary-card-title` con `className` exactamente `px-2 text-base font-extrabold text-foreground` y el copy
  `t('home.summaryTitle')` («Resumen de hoy» / «Today's Summary»). Canvas: radio 20, `padding: 14px 8px`, `gap: 12px`,
  `box-shadow: var(--shadow)`; título 16/800 con `padding: 0 8px`.
  - Test: HI › `#198 R1 viste summary-card con padding 14/8, hueco 12 y la sombra card` (la `className` contiene `gap-3`, `px-2`,
    `py-3.5` y `shadow-none`, no contiene `shadow-sm` ni `gap-4`; `StyleSheet.flatten(style).boxShadow` es igual a SOMBRA_CARD) y
    `#198 R1 pinta el título con 16/800 y su sangría de 8`.
- **R2** (celdas del resumen con actividad): WHEN el resumen tiene actividad (rama con collar) THE SYSTEM SHALL pintar dentro de
  `summary-reveal` una fila `flex-row gap-1` con cuatro celdas en el orden peso, actividad, descanso y distancia, cada una
  `flex-1 items-center gap-1.5`, **sin** `border-r` en ninguna; cada celda SHALL empezar por un mosaico
  `summary-tile-<métrica>` con `className` exactamente `` `size-9 items-center justify-center rounded-xl ${CATEGORY_SLOTS[slot].surface}` ``
  con huecos `weight → violet`, `activity → green`, `sleep → blue`, `distance → amber` (constante nueva `SUMMARY_TILES` en
  `index.tsx`, mismo mecanismo que `QUICK_ACTIONS`), y su icono (`Weight`, `Walk`, `Moon`, `Map`) con `size={18}` y la tinta
  `category-<slot>-strong` pedida con `useThemeColors(SUMMARY_TILES.map(({ slot }) => \`category-${slot}-strong\`))`; el valor
  `summary-<métrica>` SHALL llevar `text-base font-extrabold text-foreground` más `TABULAR_NUMS` y la etiqueta
  `text-11 font-semibold text-muted` con `t('home.weight')` «Peso», `t('home.activity')` «Actividad», `t('home.sleep')`
  «Descanso», `t('home.distance')` «Distancia».
  - Test: HI › `#198 R2 pinta cuatro celdas sin divisores en el orden del canvas`, `#198 R2 da a cada mosaico su hueco y su tinta`
    (`it.each` de las cuatro filas `[métrica, 'bg-category-<slot>', '--color-category-<slot>-strong']`, con un candado por fila) y
    `#198 R2 viste valor y etiqueta con 16/800 y 11/600`.
- **R3** (collar con dispositivo): WHEN la mascota tiene dispositivo THE SYSTEM SHALL renderizar
  `<Card testID="collar-card" className="flex-row items-center gap-3 border-0 bg-default px-3.5 py-3 shadow-none">` con tres
  hijos en este orden: (1) `collar-icon`, `View` con `className` exactamente
  `size-10 items-center justify-center rounded-full bg-tab-pill` y el icono de hoy por estado (`Wifi` en `online`, `WifiOff` en
  `offline`, `Moon` en `unknown`) con `size={20}` y la tinta `accent-strong`; (2) una columna `flex-1 gap-1.5` con
  `collar-status` (`text-15 font-bold text-foreground`, copy sin cambios: `t(HOME_CONNECTION[connection].labelKey)`, D3) y,
  cuando hay porcentaje, `CollarBatteryBar`; (3) `collar-battery` con `TABULAR_NUMS`, `text-15 font-extrabold` y la tinta de R4.
  El icono `Battery` se retira (D4).
  - Test: HI › `#198 R3 pinta el collar en una fila sin borde ni sombra` (clases de la `Card`: contiene `border-0`, `bg-default`,
    `px-3.5`, `py-3`, `shadow-none`), `#198 R3 ordena círculo, columna de estado y barra, y porcentaje`,
    `#198 R3 pinta el círculo de 40 con la píldora y el icono en accent-strong ($connection)` (`it.each` de `online`, `offline`,
    `unknown`: un candado por rama) y `#198 R3 no pinta el icono Battery`.
- **R4** (barra y porcentaje de batería): WHEN `CollarBatteryBar` recibe `pct` THE SYSTEM SHALL pintar
  `collar-battery-track` con `className` exactamente `h-2 w-full overflow-hidden rounded-full bg-background` y
  `collar-battery-fill` con `h-full rounded-full bg-accent` IF `pct > 60`, o `h-full rounded-full bg-warning-strong` IF
  `pct <= 60`; y `collar-battery` SHALL llevar `text-accent-strong` IF `pct > 60`, `text-warning-strong` IF `pct <= 60`, y
  `font-normal text-muted` con «—» cuando el porcentaje es `null`. Animación sin cambios (`MOTION_FILL_TIMING`, D5).
  - Test: HI › `#198 R4 pinta la barra de 8 sobre el fondo de la app` y `#198 R4 tiñe barra y cifra por umbral ($pct)`
    (`it.each` `[[72, 'bg-accent', 'text-accent-strong'], [61, 'bg-accent', 'text-accent-strong'], [60, 'bg-warning-strong', 'text-warning-strong'], [12, 'bg-warning-strong', 'text-warning-strong']]`:
    los dos lados del umbral).
- **R5** (accesos rápidos): WHEN Inicio pinta `quick-actions` THE SYSTEM SHALL darle `gap-2.5`, pintar `quick-actions-title`
  con `className` exactamente `text-xs font-bold uppercase tracking-section text-muted` (`--tracking-section: 1.5px`, #197) y copy
  `t('home.quickActions')` («Accesos rápidos» / «Quick actions»), y `quick-actions-row` con `flex-row gap-2.5`; cada tile de
  `QUICK_ACTIONS` SHALL ser un `Pressable` con `className`
  `` `h-23 flex-1 items-center justify-center gap-2 rounded-card ${CATEGORY_SLOTS[slot].surface}` ``, `style` que añade
  `chunkyLip[lip]` a lo que lleva hoy (`CONTINUOUS_CORNER` y la opacidad al pulsar), con `lip` nuevo en cada entrada
  (`weight → 'tileViolet'`, `reminder → 'tileAmber'`, `documents → 'tileBlue'`), icono `size={26}` en su tinta y etiqueta con
  `` `text-13 font-bold ${CATEGORY_SLOTS[slot].ink}` `` y copy `t('home.quickActionWeight')` «Peso»,
  `t('home.quickActionReminder')` «Recordatorio», `t('home.quickActionDocuments')` «Documentos». Orden y destinos sin cambios.
  - Test: HI › `#198 R5 pinta el rótulo con 12/700, tracking de sección y mayúsculas`,
    `#198 R5 viste cada tile con 92 de alto, radio 20 y su labio interior ($id)` (`it.each` de los tres tiles: `className`
    exacta y `style` aplanado con `boxShadow` igual al literal `[{ offsetX: 0, offsetY: -4, blurRadius: 0, spreadDistance: 0, color: '--color-lip-tile-<slot>', inset: true }]`
    de la clave #197 correspondiente) y `#198 R5 pinta icono de 26 y etiqueta 13/700 en la tinta del hueco ($id)`.
- **R6** (retardos de entrada): WHILE reduce motion está desactivado THE SYSTEM SHALL montar los envoltorios con
  `HomeEntrance index` resumen 2, collar 3, accesos 4, actividad 5, recordatorios 6, última posición 7 (la frase sigue en 0), de
  modo que `withDelay` recibe 120, 180, 240, 300, 360 y 420 ms (los `rise … 120ms…420ms` del canvas). WHILE reduce motion está
  activado THE SYSTEM SHALL no animar ninguno (comportamiento de #197 R12, sin cambio).
  - Test: HI › `#198 R6 escalona los bloques con los retardos del canvas` (tabla literal `[['home-entrance-summary', 120], ['home-entrance-collar', 180], ['home-entrance-quick-actions', 240], ['home-entrance-weekly-activity', 300], ['home-entrance-reminders', 360], ['home-entrance-last-position', 420]]`;
    los testID exactos de los envoltorios se copian de `homeMotionNodeIds` del propio test) y
    `#198 R6 conserva el hueco de cada índice aunque falte un bloque`.
- **R7** (tarjeta semanal: contenedor y cabecera): WHEN la gráfica semanal se pinta THE SYSTEM SHALL renderizar
  `<Card testID="weekly-activity-card" className="gap-2 px-4 py-3.5 shadow-none" style={shadows.card}>`, el título con
  `text-base font-extrabold text-foreground` y `t('weeklyActivity.title')` («Actividad semanal» / «Weekly activity») y el
  subtítulo con `text-11 text-muted` y `t('weeklyActivity.lastSevenDays')` («últimos 7 días» / «last 7 days»). Media y tendencia
  sin cambios (`text-xs text-muted`).
  - Test: WC › `#198 R7 viste la tarjeta con padding 14/16 y la sombra card` y `#198 R7 pinta título 16/800 y subtítulo de 11`.
- **R8** (selector de métrica y tooltip): WHEN una métrica está seleccionada THE SYSTEM SHALL pintar su
  `weekly-activity-metric-label-<métrica>` con `shrink text-xs font-extrabold text-accent-strong` y el check de selección con
  `size={13}`; WHEN no lo está, `shrink text-xs font-semibold text-muted`. El valor del tooltip SHALL llevar `font-extrabold` en
  lugar de `font-bold`.
  - Test: WC › `#198 R8 pinta la métrica elegida con 12/800 en accent-strong`, `#198 R8 pinta las otras dos con 12/600 en muted`
    (un candado por cada una de las dos no elegidas) y `#198 R8 pinta el valor del tooltip con 800`.
- **R9** (barras y detalle del día): WHEN se pinta una barra THE SYSTEM SHALL darle `rx={Math.min(6, height / 2)}` en `Rect` y en
  `AnimatedRect`; WHILE hay un día seleccionado THE SYSTEM SHALL darle `fillOpacity={1}` a su barra y `fillOpacity={0.35}` a las
  demás; WHILE no hay día seleccionado, `fillOpacity={1}` a todas. WHEN se pinta `weekly-activity-detail` THE SYSTEM SHALL darle
  `gap-3 rounded-16 border border-border bg-default p-3`, título `text-15 font-extrabold text-foreground`, etiquetas
  `text-11 text-muted` y valores `text-sm font-bold text-foreground`.
  - Test: WC › `#198 R9 redondea las barras a 6 sin pasar de la mitad del alto` (una barra alta: `rx` 6; la de `BAR_MIN_HEIGHT` 3:
    `rx` 1.5), `#198 R9 atenúa a 0.35 las barras no seleccionadas` (seleccionando la **primera** y la **última** columna, un
    candado por posición), `#198 R9 deja todas a opacidad plena sin selección` y `#198 R9 viste el detalle con radio 16 y fondo default`.

### Inicio desplazado: recordatorios y última posición (`Inicio.dc.html`, `InicioRecordatorios.dc.html`)

- **R10** (recordatorios): WHEN Inicio pinta `reminders-section` THE SYSTEM SHALL darle `gap-1`; `reminders-section-title` con
  `text-base font-extrabold text-foreground` y `t('home.reminders')` («Recordatorios»); `reminders-see-all` con
  `min-h-11 justify-center pl-3` y su texto `text-xs font-bold text-accent-strong` con `t('home.remindersSeeAll')` («Ver todos»);
  y cada `Card` de fila (`reminders-next-vaccine`, `reminders-meals`, `reminders-none-upcoming`, `reminders-item-<id>`) con
  `className` que contiene `flex-row items-center gap-3 px-3.5 py-3 shadow-none` y `style={shadows.card}`; los títulos de fila
  `text-sm font-bold text-foreground` (`-name`, `-title`, `reminders-meals-title`) y las píldoras de días
  `` `rounded-full px-2.5 py-1 text-xs font-extrabold ${CATEGORY_SLOTS.amber.surface} ${CATEGORY_SLOTS.amber.ink}` ``.
  - Test: HI › `#198 R10 pinta la cabecera con 16/800 y «Ver todos» con 12/700`,
    `#198 R10 viste cada fila como tarjeta con la sombra card ($testID)` (`it.each` de las cuatro clases de fila: un candado por
    rama) y `#198 R10 pinta títulos 14/700 y píldoras 12/800`.
- **R11** (última posición): WHEN Inicio pinta `last-position-card` THE SYSTEM SHALL renderizarla con
  `className="gap-2 border-0 bg-default px-4 py-3.5 shadow-none"`, su círculo `size-9 items-center justify-center rounded-full bg-tab-pill`,
  la etiqueta `text-15 font-bold text-accent-strong` con `t('home.viewOnMap')` («Ver en el mapa») y `last-position-time` con
  `text-13 font-normal text-muted` («Última señal …», `t('home.lastSeen')`). Iconos `Map` y `ChevronRight` sin cambio (ya en
  `accent-strong`).
  - Test: HI › `#198 R11 viste la última posición sin borde ni sombra` y `#198 R11 pinta etiqueta 15/700 y hora de 13`.
- **R12** (candados agregados que la feature mueve): THE SYSTEM SHALL dejar `screens/home/index.tsx` y
  `screens/home/weekly-activity-chart.tsx` como los dos únicos ficheros de producción de esta feature que importan
  `theme/shadows`, y SHALL mantener los recuentos agregados que esta feature mueve con su delta escrito: `text-accent-strong` en
  `index.tsx` 2 → 3 (suma de `#61 R4` 13 → 14) y `bg-accent-soft` en toda la app −3 (los tres de `index.tsx` pasan a
  `bg-tab-pill`).
  - Test: enmiendas listadas en §Candados (CF `#197 R20`, `legibility-classnames`, `consistency-classnames`), más HCF ›
    `#198 R12 solo Inicio y su gráfica importan las sombras en esta feature` (lee las dos fuentes y comprueba
    `from '../../theme/shadows'` en cada una).

### Estados

- **R13** (sin collar, `InicioSinCollar.dc.html`): WHILE la mascota no tiene dispositivo THE SYSTEM SHALL pintar en el resumen la
  celda de peso con las clases de R2 más `border-r border-border`, seguida de `summary-note` con `className` exactamente
  `flex-3 self-center pl-3 text-sm leading-5 font-normal text-muted` y `t('home.activityNeedsCollar')` («La actividad necesita un
  collar con plan activo»); SHALL renderizar `collar-card` como
  `<Card className="gap-3 border-0 bg-default px-4 py-3.5 shadow-none">` en columna con: fila `flex-row items-center gap-3` con
  `collar-icon` (`size-9 items-center justify-center rounded-full bg-tab-pill`, `Moon` 20 en `accent-strong`) y `collar-status`
  `text-base font-extrabold text-foreground` («Sin collar», `t('home.free')`); el texto `text-sm font-normal text-muted` con
  `t('home.noCollar')` («Sin collar — solo salud»); y `collar-pair-link` con `className` exactamente
  `h-11 items-center justify-center rounded-xl bg-tab-pill` y texto `text-15 font-bold text-foreground` con `t('home.pairCollar')`
  («Vincular collar») que navega a `/pairing`. SHALL no pintar `weekly-activity-card`.
  - Test: HI › `#198 R13 pinta peso con divisor y la nota de 14/20`, `#198 R13 pinta el collar sin dispositivo en columna`,
    `#198 R13 viste el enlace de vincular con 44 de alto, radio 12 y la píldora` y `#198 R13 no pinta la actividad semanal`.
- **R14** (carga, `InicioCarga.dc.html`): WHILE la lista de mascotas carga THE SYSTEM SHALL pintar en `home-states`, sin título,
  `home-loading` como `View` `gap-3.5` con, en este orden: `home-loading-summary` (`View`
  `gap-4 rounded-card border border-border bg-surface px-4 py-3.5` con `style={shadows.card}`, un `Skeleton h-4 w-30 rounded-full`
  y una fila `flex-row gap-2` de cuatro celdas `flex-1 items-center gap-2` con `Skeleton size-9 rounded-xl`,
  `Skeleton h-3.5 w-13 rounded-full` y `Skeleton h-2.5 w-9 rounded-full`); `home-loading-collar` (`Skeleton h-16 w-full rounded-card`);
  `home-loading-quick-actions` (`View gap-2.5` con `Skeleton h-3 w-27.5 rounded-full` y una fila `flex-row gap-2.5` de tres
  `Skeleton h-23 flex-1 rounded-card`); y `home-loading-weekly` (`Skeleton h-102 w-full rounded-card`).
  - Test: HI › `#198 R14 pinta el esqueleto con la forma del canvas y sin título`,
    `#198 R14 dibuja cuatro celdas y tres tiles en el esqueleto` y `#198 R14 usa el Skeleton de HeroUI en cada bloque`.
- **R15** (error, `InicioError.dc.html`): WHEN la lista de mascotas falla THE SYSTEM SHALL pintar en `home-states` el título
  `text-26 font-black tracking-title text-foreground` con `t('home.home')` («Inicio») y debajo
  `<EmptyState testID="home-error" variant="hero" tone="danger" pose="talk" title={t('home.loadPetsErrorTitle')} body={t('home.loadPetsErrorBody')} action={{ label: t('common.retry'), onPress: <reintento de hoy> }} />`.
  Copy literal nuevo en `src/i18n/catalog.ts`: `'home.loadPetsErrorTitle'` = «I couldn't load your pets» (en) /
  «No pude cargar a tus mascotas» (es); `'home.loadPetsErrorBody'` = «Check your connection and try again.» (en) /
  «Revisa tu conexión y vuelve a intentarlo.» (es); botón `common.retry` «Reintentar» / «Retry». En
  `src/__tests__/ui-copy-table.ts`, `R3_HOME`: la **primera** de las dos filas
  `{ file: 'src/screens/home/index.tsx', key: 'common.somethingWentWrong' }` pasa a `key: 'home.loadPetsErrorTitle'` y se añade
  justo detrás `{ file: 'src/screens/home/index.tsx', key: 'home.loadPetsErrorBody' }` (la segunda fila se queda: `pet-hero-error`
  sigue usando la clave). `SCREEN_FILES` no cambia (`empty-state.tsx` no llama a `t`).
  WHEN `EmptyState` recibe `tone="danger"` (prop nueva `tone?: 'default' | 'danger'`, defecto `'default'`) THE SYSTEM SHALL pintar
  `${testID}-stage-disc` con `` `absolute size-60 rounded-full ${CATEGORY_SLOTS.rose.surface}` ``, las huellas con `fill` del
  color `danger` (pedido en el mismo `useThemeColors` que ya pide `accent`), un badge `${testID}-badge` con `className`
  exactamente `absolute right-10.5 top-6.5 size-11 items-center justify-center rounded-full border-3 border-background bg-danger`
  y el icono `Alert` de `reicon-react-native` `size={24}` en `danger-foreground`, el título con
  `text-center text-22 font-black tracking-title text-foreground` y el icono del botón `Refresh` (en lugar de `Plus`) en
  `${testID}-action-icon`. WHEN `tone` es `'default'` o falta THE SYSTEM SHALL pintar exactamente lo de hoy (disco
  `bg-surface-secondary`, huellas `accent`, sin badge, título `text-26`, icono `Plus`).
  - Test: HI › `#198 R15 pinta el título de Inicio y el escenario de error`, `#198 R15 reintenta desde home-error-action` y
    `#198 R15 pinta el copy del error en los dos idiomas` (es y en, literales). ES ›
    `#198 R15 tone danger pinta disco rosa, huellas danger, badge y título de 22`,
    `#198 R15 tone danger cambia Plus por Refresh` y `#198 R15 sin tone conserva el escenario de hoy` (rama `default` explícita
    y rama sin prop: un candado por rama).
- **R16** (vacío, `InicioVacio.dc.html`): WHILE el usuario no tiene mascotas THE SYSTEM SHALL seguir pintando
  `EmptyState testID="home-empty" variant="hero" pose="talk"` sin `tone`, con `t('common.noPetsYet')` («Aún no tienes mascotas»),
  `t('common.noPetsBody')` (Voz B, D10) y la acción `t('profile.addPet')` («Añadir mascota»), sin `home-empty-badge`.
  - Test: HI › `#198 R16 conserva el vacío hero sin badge ni tono de error`.
- **R17** (fidelidad al canvas): THE SYSTEM SHALL tener en HCF un `it.each` que, para cada fila de la tabla de design.md
  §Contraste, lea el artboard con
  `readFileSync(join(process.cwd(), '..', 'specs/mobile-canvas-home/canvas/<Artboard>.dc.html'), 'utf8')` y el fichero de
  producción con `readFileSync(join(process.cwd(), '<ruta>'), 'utf8')`, y compruebe que el artboard contiene el literal del canvas
  **y** que la fuente contiene el literal de producción (patrón CF de #197). Las filas de `InicioActividad` e
  `InicioRecordatorios` comprueban además `margin-top: -751px` y `margin-top: -1064px` (son `Inicio` desplazado).
  - Test: HCF › `#198 R17 $artboard dibuja «$canvas» y $file lo aplica` (`it.each` de las filas de design.md §Contraste).

## Candados que esta feature revierte

Inventario cerrado, buscado con grep sobre los `*.test.ts(x)` de `src/screens/home/`, `src/components/__tests__/` y los
candados agregados (`design-drift`, `consistency-classnames`, `legibility-classnames`, `canvas-foundations`, `ui-copy-table.ts`)
en 71ff81a1. Cada `it` enmendado conserva su nombre y añade ` (enmendado por #198 R<n>)` al final; los `it` que solo cambian
una tabla interna llevan además `// (enmendado por #198 R<n>)` en la línea tocada. **Si al implementar se pone rojo un `it`
que no está en esta tabla, se para y se reporta en `progress/impl_mobile-canvas-home.md`; no se enmienda en silencio.**
Abreviaturas: HI, WC, ES y EI como en §Requisitos; **CN** `src/__tests__/consistency-classnames.test.ts`, **LG**
`src/__tests__/legibility-classnames.test.ts`, **CF** `src/__tests__/canvas-foundations.test.ts` (llega con #197).

| # | Fichero › describe › it | Hoy afirma | Pasa a afirmar | R |
|---|---|---|---|---|
| K1 | HI › `#62 R5: el título de card usa un único tratamiento` › `aplica la receta canónica a Today's Summary` | título `text-base font-bold text-foreground` | `px-2 text-base font-extrabold text-foreground` | R1 |
| K2 | HI › `#69 R1: la tira de hoy tiene cuatro celdas con tres divisores` › `renders exactly three dividers between the four cells` | tres celdas con `border-r border-border` | ninguna celda con `border-r` en la rama con actividad (cambia solo el nombre del `it`, no el del describe) | R2 |
| K3 | HI › mismo describe › `keeps the row flush without spacing utilities` | la fila no lleva `gap-*` | la fila es `flex-row gap-1` | R2 |
| K4 | HI › mismo describe › `#69 R9: usa iconos de reicon y ningún emoji` | regex `<(?:Weight|Walk|Moon|Map) size=\{20\} color=\{muted\} \/>` | iconos de reicon con `size={18}` y tinta del hueco; sigue sin emoji | R2 |
| K5 | HI › mismo describe › `#126 R1: cada celda de la tira pinta su propio icono en muted` › `con las métricas de hoy` y `sin métricas ni peso` | `color` `'--color-muted'` en los cuatro | `'--color-category-<slot>-strong'` de R2 en cada uno (sin collar queda solo la celda de peso: violet) | R2, R13 |
| K6 | HI › `#77 R2: sin actividad, la fila es la celda de peso seguida de la nota` (cuerpo del describe) | celda con `border-r`, nota `flex-3 self-center pl-3 font-normal text-muted`, etiqueta `text-2xs font-normal`, valor `text-sm font-bold` | celda de R2 + `border-r border-border`, nota `flex-3 self-center pl-3 text-sm leading-5 font-normal text-muted`, etiqueta `text-11 font-semibold text-muted`, valor `text-base font-extrabold text-foreground` | R13 |
| K7 | HI › `R8: collar card refleja el device` › `shows the health-only free state without a battery row`, `shows an online collar and its battery percentage`, `#73 R7: shows an offline collar as Sin conexión with its battery` | `text-success` / `text-warning-strong`, icono `Battery` presente, `collar-status` `text-base font-bold` | tinta de R4, sin `Battery`, `collar-status` `text-15 font-bold` (con collar) o `text-base font-extrabold` (sin collar) | R3, R4, R13 |
| K8 | HI › `#62 R3: collar-card y last-position-card usan el Card compartido` › `it.each(['collar-card','last-position-card'])` | `className` contiene `border`, `shadow-sm` y `bg-default` | sigue siendo el `Card` compartido con `bg-default`; contiene `border-0` y `shadow-none`, no `shadow-sm` | R3, R11 |
| K9 | HI › `#71 R1: la Home dibuja la rejilla de accesos rápidos` › `dibuja el rótulo y los tres tiles en orden` y `usa iconos de reicon y ningún emoji` | rótulo `text-xs font-semibold … tracking-widest`; tile `min-h-11 … rounded-xl py-3`; icono `size={24}` | receta de R5 (`tracking-section`, `h-23 … rounded-card`, `size={26}`) | R5 |
| K10 | HI › `#81 R1-R6` › `#81 R1: cada etiqueta lleva la receta entera y ningún estilo en línea` | `text-2xs font-semibold text-foreground` | `` `text-13 font-bold ${CATEGORY_SLOTS[slot].ink}` `` (sigue sin estilo en línea en el `Text`) | R5 |
| K11 | HI › `#152 R5: la Home envuelve cada bloque en su entrada escalonada` › `escalona las entradas cada 60 ms en el orden de los bloques (enmendado por #190 R6)` | índices 1..6 (60..360 ms) | índices 2..7 (120..420 ms) | R6 |
| K12 | HI › `#190 R6: los índices son fijos aunque falte un bloque` › `conserva los huecos del collar sin última posición y de la actividad ausente` | retardos con índices de hoy | mismos huecos con índices +1 | R6 |
| K13 | HI › `#85 R10: viste las filas con el Card compartido y los tokens` › `aplica la receta de cada nodo y ninguna otra` | `shadow-sm`, píldora `px-2.5 py-1 … text-xs font-bold`, nombre `text-sm font-semibold` | receta de R10 (`shadow-none` + `style` SOMBRA_CARD, píldora `font-extrabold`, nombre `text-sm font-bold`) | R10 |
| K14 | HI › `#70 R1: la Home dibuja la sección de recordatorios` › `dibuja la cabecera y el cuerpo de la sección`, `liga nombre, fecha y contador a su nodo y a ninguno más`, `viste la sección con el Card compartido y los tokens` | sección `gap-3`, título `text-base font-bold`, «Ver todos» `text-xs font-semibold`, filas `shadow-sm`, nombre `text-sm font-semibold`, píldora `font-bold` | receta de R10 | R10 |
| K15 | HI › `#98 R7: la barra de comidas y todas sus decisiones` › `pinta dato, icono, copy, nombre accesible, huecos, tintas y tipografía` | `Card` con `shadow-sm`, título `text-sm font-semibold` | `shadow-none` + SOMBRA_CARD, título `text-sm font-bold` (la barra de comidas no cambia) | R10 |
| K16 | HI › `#152 R8: la batería del collar se dibuja como barra` › `it.each` `pinta %i% con %s` (el `it` de #154) | pista `h-1.5 flex-1 overflow-hidden rounded-full bg-surface`, relleno `bg-success` por encima de 60 | pista `h-2 w-full overflow-hidden rounded-full bg-background`, relleno `bg-accent` por encima de 60 | R4 |
| K17 | HI › mismo describe › `pone la barra detrás del porcentaje en su fila` | barra hermana posterior del porcentaje en la fila de batería | la barra va en la columna de estado, bajo `collar-status`, y el porcentaje es el tercer hijo de la tarjeta | R3 |
| K18 | HI › `R6: home carga pets y selecciona` › `shows a loading state while pets are pending` | `home-loading` es un `Skeleton` | `home-loading` es el `View` de R14 y contiene `home-loading-summary` | R14 |
| K19 | HI › `#62 R8: home carga con Skeleton dimensionado, no con Spinner suelto` › `reserva el espacio de carga con la forma de una Card` | `h-12 w-full rounded-card` | la forma de R14 (cuatro bloques); sigue sin `Spinner` | R14 |
| K20 | HI › `R1 (mobile-reanimated-double-dead-weight)` › `conserva la clase base del Skeleton de HeroUI` | sobre `home-loading` | sobre `home-loading-collar` (un `Skeleton` real) | R14 |
| K21 | HI › `#195 R15` › `aplica también el hueco de 14 a las ramas de estado sin hero` | la rama de carga lleva título y `Skeleton` | la rama de carga no lleva título; el hueco de 14 se mide en `home-loading` (`gap-3.5`) | R14 |
| K22 | HI › `#195 R18: estados conservados de Inicio` › `conserva la carga de mascotas` y `conserva el error de mascotas y su reintento` | título + `Skeleton`; `home-error` `Text` `text-danger` «Algo salió mal» + `home-retry` | carga de R14; error de R15 (`home-error-title`, `home-error-action`) | R14, R15 |
| K23 | HI › `R6: home carga pets y selecciona` › `shows an error and retries the pet list` | `home-error` con «Algo salió mal» y pulsa `home-retry` | `home-error-title` «No pude cargar a tus mascotas» y pulsa `home-error-action` | R15 |
| K24 | HI › `#181 R1` › `S4: lista unreachable y selección nula ocultan la tarjeta`; `#190 R2` › `omite la frase con mascotas en %s…`; `#152 R5` › `no da entrada al hero con alertas abiertas (enmendado por #195 R11)` | `getByTestId('home-error')` / `home-loading` como `Text` / `Skeleton` | mismos testID; si el `it` lee texto o clase del nodo, pasa a `home-error-title` o a `home-loading-summary` | R14, R15 |
| K25 | EI › `#155 R11: los vacíos no traen movimiento ni dependencias` › `EmptyState importa exactamente lo de la flotación (enmendado por #177 R10) (enmendado por #176 R5)` | `"import { Plus } from 'reicon-react-native';"` y sin `category-palette` | `"import { Alert, Plus, Refresh } from 'reicon-react-native';"` y `"import { CATEGORY_SLOTS } from '../utils/category-palette';"` como última importación de la fuente | R15 |
| K26 | LG › `#61 R4` › `it.each` `%s pinta con text-accent-strong (%i)` y `suma las trece ocurrencias que enumera la spec` | `[join('screens', 'home', 'index.tsx'), 2]`, total 13 | `[join('screens', 'home', 'index.tsx'), 3]`, total 14 (nombre del segundo `it` intacto + sufijo de enmienda) | R3, R12 |
| K27 | CN › `#98 R10` › `deja CONTINUOUS_CORNER, bg-accent-soft y el acento donde estaban (enmendado por #177 R10) (enmendado por #190 R13)` y CN › `#64 R9` › `conserva los usos de bg-accent-soft que sí son acento` | expresión `16 + 2 + 1 - 1 - 1 - 1 - 1 - 1 - 1 - 1 - 1 - 1 - 1 - 2` (7) | la misma expresión con ` - 3` al final (4); si el `it` enumera ficheros, `index.tsx` sale de la lista | R12 |
| K28 | CF › `#197 R20: nadie monta todavía los cimientos` (fila `shadows`) | importadores de producción `[]` | `['screens/home/index.tsx', 'screens/home/weekly-activity-chart.tsx']` (las filas `toggle-switch` y `screen-header` siguen en `[]`) | R12 |

Enmiendas de #197 que esta feature vuelve a tocar: **K11**/**K12** (#197 cambia ahí `translateY` a 14 en `#190 R1`, `#190 R7` y
`#152 R7`; #198 no toca esas aserciones, solo los retardos) y **K28** (#197 crea el `it`). `#197 R20: el layout raíz no cambia`
**no** se toca (D11). Ningún `it` de WC cambia de aserción: `#140 R2` y `#143 R3` fijan las clases de las columnas del día, que
esta feature no toca; si al aplicar R8 alguno se pone rojo por compartir `font-semibold text-foreground`, se para (regla de arriba).

## Desviaciones conscientes del canvas

Lo que el canvas dibuja y esta feature **no** replica, con su motivo. Cada una es decisión con defecto (el leader la mira al firmar).

| # | El canvas dibuja | La app hace | Motivo |
|---|---|---|---|
| V1 | Estado del collar «Collar en línea» (`font-size: 15px; font-weight: 700">Collar en línea`) | `t(HOME_CONNECTION[connection].labelKey)`: «En línea» / «Sin conexión» / «Esperando señal» | El canvas solo dibuja `online`; cambiar una de tres etiquetas rompe la serie y el copy de los otros dos estados no está dibujado (D3). |
| V2 | Cada cifra del resumen sube con su propio `rise` de 300 a 420 ms | Las cifras siguen entrando juntas con `summary-reveal` (#152) | El escalonado por cifra es movimiento nuevo sin candado propio; el bloque ya entra a 120 ms (R6). |
| V3 | El botón del mapa entra con 340 ms y el tooltip hace `pop` de 600 ms | Sin retardo propio; tooltip con su animación de hoy | Igual que V2: movimiento secundario sin requisito. |
| V4 | Relleno de la batería y de las barras con 900 ms | `MOTION_FILL_TIMING` (`MOTION_TRANSITION_MS`) | La constante es compartida con `components/weight-chart.tsx`; cambiarla mueve otra pantalla (D5). |
| V5 | La frase de Pingo entra a 140 ms | Índice 0 (0 ms), como hoy | La frase es de #195; esta feature no la toca (D6). |
| V6 | Carga con la cabecera en degradado y el esqueleto de la fila de Pingo | Solo los cuatro bloques de R14, sin cabecera ni título | Degradado = `expo-linear-gradient`, vetado; la cabecera de Inicio es de #195 (D7). |
| V7 | Vacío: el cuerpo del artboard | `common.noPetsBody` de hoy (Voz B de Pingo) | Precedencia: el copy sigue la Voz B de la carta (D10). |
| V8 | Margen lateral de 16 | Margen de 24 de la Home, como hoy | El margen es patrón de `docs/conventions.md` y de #195 R15; cambiarlo mueve todas las pantallas. |
| V9 | Badge de error con `pop 500ms ease-out 300ms` y un «!» dibujado a mano (`M12 8v5M12 16.5v.01`, trazo 3) | Badge estático con el icono `Alert` de reicon | Sin dependencia ni SVG a mano; el glifo puede diferir un poco. |
| V10 | Pulso propio del esqueleto | Animación del `Skeleton` de HeroUI | Componente compartido de la carta. |
| V11 | Grosores de trazo de iconos del artboard (2 en los mosaicos) | Trazo por defecto de reicon | reicon no expone el grosor por icono en estas pantallas. |

## Fuera de alcance

- **#144** sigue `pending`: no la absorbe esta feature; sus `it` no se reescriben aquí más allá de las filas de K1–K28.
- **#154** sigue `pending`: R4 enmienda las filas de su `it.each` (K16), pero no cubre su objetivo; #154 tendrá que re-anclar
  por contenido (`bg-accent`, `h-2 w-full … bg-background`) cuando se especifique.
- La cabecera con foto y la frase de Pingo (#195), su retardo (V5) y el margen lateral (V8).
- `ScreenHeader` y `src/app/_layout.tsx`: Inicio no lo adopta (D11).
- `MOTION_FILL_TIMING` y cualquier constante de `theme/motion.ts` (V4).
- `components/card.tsx`, `CATEGORY_SLOTS`, `theme/shadows.ts`, `theme/chunky-lip.ts`: se usan tal como los deja #197; no se editan.
- El copy de los estados del collar (V1) y del vacío (V7).
- Cualquier recurso AWS, coste o dependencia nueva.

## Cierre del humano

Lo que jest no ve (design.md §Supuestos). Smoke en **dev build Android** (no Expo Go), modo claro y oscuro:

1. `summary-card`, `weekly-activity-card` y las filas de recordatorios muestran la sombra doble suave (`useShadows().card`) y no un
   borde duro; `collar-card` y `last-position-card` no tienen sombra ni borde (R1, R7, R10, R11, R3).
2. Los tres tiles de accesos rápidos muestran el labio interior de 4 px abajo, en su tono (R5).
3. La barra del collar se ve sobre el fondo de la app, en el color de acento por encima de 60 y ámbar en 60 o menos (R3, R4).
4. Las entradas escalonadas llegan en el orden resumen, collar, accesos, actividad, recordatorios, última posición, sin saltos (R6);
   con «Quitar animaciones» del sistema activado no hay movimiento.
5. Carga: el esqueleto tiene la forma del canvas y no hay salto de altura al llegar los datos (R14).
6. Error (modo avión): disco rosa, huellas en rojo, badge con «!» y botón «Reintentar» con icono de recarga que recupera la lista (R15).
7. Vacío y sin collar se ven como sus artboards (R13, R16).

## Aprobación

- [ ] Aprobado por humano (fecha: ____)
- [ ] Smoke de R1, R3, R4, R5, R6, R7, R10, R11, R13, R14, R15 y R16 hecho y aprobado por el humano en dev build Android (cierre, no gate de implementación)

La spec no enmienda `docs/ui-guidelines.md`: no hay casilla de enmienda de la carta.

