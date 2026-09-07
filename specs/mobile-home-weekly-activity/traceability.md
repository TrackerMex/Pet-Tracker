---
feature: "mobile-home-weekly-activity"
status: approved       # draft | spec_ready | approved
tags: [harness, spec]
---

# Trazabilidad — [[mobile-home-weekly-activity]]

Rutas relativas a `mobile-pet-tracker/`. La columna **Test** la **prescribe la
spec** (no la improvisa el implementer): es el contrato de qué prueba cada R-id.
La columna **Commit** la rellena el implementer en cuanto ese requisito queda
verde, nunca al final.

Dos abreviaturas para no repetir rutas largas:
`CHART` = `src/screens/home/weekly-activity-chart.test.tsx`;
`HOME` = `src/screens/home/index.test.tsx`.

| Requisito | Test (archivo::nombre) — prescrito por la spec | Commit (hash + mensaje) |
|---|---|---|
| R1 | `CHART`::`R1: la gráfica entra por el subpath v2 y por ningún otro` (2 `it`: `package.json` con la versión exacta y las dos entradas nuevas de `transformIgnorePatterns`; el fuente con `from 'react-native-chart-kit/v2'` y sin el import de raíz ni `dist/`) | rojo `90cde79` `feat(mobile-home-weekly-activity): test chart dependency contract (R1)`; verde `d96b664` `feat(mobile-home-weekly-activity): add pinned chart dependency (R1)` |
| R1b | mismo `describe` que R1 → `it('pinea 7.0.4 porque la geometría del eje depende de sus constantes')` | rojo `287bdf3` `feat(mobile-home-weekly-activity): test pinned chart geometry contract (R1b)`; verde `a471331` `feat(mobile-home-weekly-activity): document pinned chart geometry (R1b)` |
| R2 | `CHART`::`R2: WeeklyActivityChart recibe los días y no habla con la red` | rojo `9ea68fb` `feat(mobile-home-weekly-activity): test weekly chart component boundary (R2)`; verde `40e4c2e` `feat(mobile-home-weekly-activity): add weekly chart component boundary (R2)` |
| R3 | `CHART`::`R3: la letra del eje sale de la fecha, no del índice` → `it('usa el día real de cada fecha en los dos idiomas')`, rango `2026-09-02 … 2026-09-08` | rojo `14721b9` `feat(mobile-home-weekly-activity): test chronological weekday columns (R3)`; verde `f036d3e` `feat(mobile-home-weekly-activity): render chronological weekday columns (R3)` |
| R4 | mismo `describe` que R3 → `it('no se desplaza un día en una zona horaria negativa')`, con `process.env.TZ = 'America/Mexico_City'` y restauración en `finally`. **Único candado que mata la mutación 2** | rojo `9154c41` `feat(mobile-home-weekly-activity): test timezone-safe weekday labels (R4)`; verde `b77fdca` `feat(mobile-home-weekly-activity): parse weekday labels locally (R4)` |
| R5 | `CHART`::`R5: un día sin dato no es una barra de altura cero` (3 `it`: `missing` sin valor y con `'—'`; `null` —no `0`— hacia el `BarChart`; y `source:'stored'` con la métrica en `null` pintando valor, que es **el único que mata la mutación 3**) | rojo `521414b` `feat(mobile-home-weekly-activity): test missing and zero activity days (R5)`; verde `d2f98ec` `feat(mobile-home-weekly-activity): distinguish missing and zero activity days (R5)` |
| R6 | `CHART`::`R6: el selector cambia de métrica sin volver a pedir nada` + `HOME`::`it('no vuelve a pedir la actividad al cambiar de métrica')` | rojo `a398211` `feat(mobile-home-weekly-activity): test weekly metric selector (R6)`; verde `a563829` `feat(mobile-home-weekly-activity): add weekly metric selector (R6)` |
| R7 | `CHART`::`R7: la gráfica dibuja eje Y, rejilla y línea de media` (3 `it`: `formatYLabel` de longitud 4 exacta; `weekly-activity-average` con `TABULAR_NUMS`; media que ignora los `missing`) | rojo `e52f6e4` `feat(mobile-home-weekly-activity): test chart axis grid and average (R7)`; verde `2f0d626` `feat(mobile-home-weekly-activity): draw chart axis grid and average (R7)` |
| R8 | `CHART`::`R8: tocar un día abre su detalle` (tooltip, panel, día `missing`, `onSelectDay`) + `HOME`::`it('ofrece el mapa solo para el día de hoy')` | rojo `b6c98d1` `feat(mobile-home-weekly-activity): test daily activity detail (R8)`; verde por completar |
| R9 | `CHART`::`R9: cada columna se anuncia por separado` (7 etiquetas en los dos idiomas, contenedor sin etiqueta, `accessibilityLabel` traducido en el gráfico y ausencia de `getBarChartAccessibilitySummary`) | rojo `8f7c50a` `feat(mobile-home-weekly-activity): test per-day chart accessibility (R9)`; verde `b655e79` `feat(mobile-home-weekly-activity): announce each chart day accessibly (R9)` |
| R10 | `CHART`::`R10: las barras entran animadas y respetan reduced motion` (2 `it`, con `useReducedMotion` mockeado como en `src/theme/__tests__/theme-transition.test.tsx`) | rojo `709e71f` `feat(mobile-home-weekly-activity): test chart entry animation (R10)`; verde `9e16364` `feat(mobile-home-weekly-activity): animate chart bars on entry (R10)` |
| R11 | `CHART`::`R11: la gráfica se dimensiona por onLayout, no por porcentaje` (2 `it`: sin `onLayout` no monta; con 295 px pasa `width`/`height` numéricos) | rojo `9417c87` `feat(mobile-home-weekly-activity): test measured chart dimensions (R11)`; verde `6d514e2` `feat(mobile-home-weekly-activity): measure chart dimensions on layout (R11)` |
| R12 | `CHART`::`R12: la tendencia sigue a la métrica y se calla sin base` (6 `it`: `+12,5`/`TrendUp`, `-8,3`/`TrendDown`, `0` sin icono, `null` sin fila, cambio de métrica, y `TABULAR_NUMS` sin color semántico) | rojo `c4250ff` `feat(mobile-home-weekly-activity): test metric trend row (R12)`; verde `15caa13` `feat(mobile-home-weekly-activity): show selected metric trend (R12)` |
| R13 | `CHART`::`R13: la semana entera sin dato se resuelve con un mensaje` (3 `it`) | rojo `22ba924` `feat(mobile-home-weekly-activity): test empty weekly activity state (R13)`; verde `8b6ed14` `feat(mobile-home-weekly-activity): show weekly activity empty state (R13)` |
| R14 | `HOME`::`R14: la Home monta la actividad semanal sin pedir nada nuevo` (3 `it`: la tarjeta con los siete días; el orden `summary-card` → `weekly-activity-card` → `last-position-card`; el recuento de llamadas a `getDailyActivity` sin cambio) | pendiente |
| R14b | mismo `describe` que R14 → `it('carga con skeleton y se calla cuando la actividad falla')` | pendiente |
| R15 | `src/__tests__/design-drift.test.ts`::`it('keeps the four Expo Router entrypoints thin')` con `app/(tabs)/home.tsx` dentro, **más** `HOME` entero en verde tras el movimiento, sin un solo assert debilitado | rojo `572d732` `feat(mobile-home-weekly-activity): test thin home route (R15)`; verde `97136ad` `feat(mobile-home-weekly-activity): migrate home screen module (R15)` |
| R16 | `src/utils/device-connectivity.test.ts`::`R16: la conectividad se traduce por catálogo` (3 `it`: conocido, desconocido, `null`) + el `it` actualizado de `src/screens/pairing/index.test.tsx:511`, con los de `:531,:543` intactos | pendiente |
| R17 | `src/__tests__/ui-language.test.ts` (candados de #65: una clave sin traducción en algún idioma no compila, y `checkUses(ALL_USES)` exige una fila por llamada) + las filas nuevas de `R3_HOME` y `R10_PAIRING` en `src/__tests__/ui-copy-table.ts` | pendiente |
| R18 | `src/__tests__/design-drift.test.ts`::`#68 R18: la actividad semanal no mete drift de estilo`, sobre la lista nominal de ficheros de esta feature | pendiente |
| R19 | Los deltas y las reubicaciones de la tabla de [[requirements]] R19, verificados por el reviewer **rehaciendo cada grep**, no leyendo el informe del implementer. Ojo a la distinción: (a) ruta que cambia con la cifra intacta, (b) delta real | pendiente |
| R20 | Requisito de **verificación** (C4 vía (b)): suite móvil completa verde con `bun run test`, `typecheck` en verde, grep-clean de la carta §Decisiones fijas 3 intacto y escala de radios de #62 R4 sin clase fuera de escala | pendiente |
| R20b | Las cinco mutaciones de [[tasks]] §R20 (3), plantadas de una en una, con la evidencia en `progress/impl_mobile-home-weekly-activity.md` §prueba de mutación. Las mutaciones **2 y 3** son de zona ciega: si la suite sigue verde con cualquiera de las dos plantada, el candado está mal escrito y se arregla antes de seguir | pendiente |
| E1 | Enmienda a `docs/ui-guidelines.md` §Dirección de arte 6, tercer corolario: `device.connectivity` sale de la lista de enum crudos. La firma del humano en [[requirements]] §Enmiendas es el gate; el reviewer comprueba que el texto de la carta quedó cambiado y que los otros cuatro enum siguen crudos | pendiente |

Regla: el reviewer no aprueba si alguna fila queda "pendiente" en la columna
Commit.
Convención de commit: `feat(mobile-home-weekly-activity): <desc> (R5,R7)`.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida al
aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).

**Fuera de esta tabla y no delegable a IA**: el gate humano de smoke en dev build
de Android (nunca Expo Go), en tema claro y oscuro, con una mascota que tenga al
menos un día sin dato y al menos un día de cero minutos, más las comprobaciones
de alineación de columnas, selector, tooltip, enlace al mapa solo en hoy,
animación con y sin "reducir movimiento", y TalkBack anunciando las siete
columnas por separado. Guion completo en [[requirements]] §Aprobación. Sin él la
feature no pasa a `done`, tenga la tabla las filas que tenga.
