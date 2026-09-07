---
feature: "mobile-home-weekly-activity"
status: spec_ready     # draft | spec_ready | approved
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
| R1 | `CHART`::`R1: la gráfica entra por el subpath v2 y por ningún otro` (2 `it`: `package.json` con la versión exacta y las dos entradas nuevas de `transformIgnorePatterns`; el fuente con `from 'react-native-chart-kit/v2'` y sin el import de raíz ni `dist/`) | pendiente |
| R1b | mismo `describe` que R1 → `it('pinea 7.0.4 porque la geometría del eje depende de sus constantes')` | pendiente |
| R2 | `CHART`::`R2: WeeklyActivityChart recibe los días y no habla con la red` | pendiente |
| R3 | `CHART`::`R3: la letra del eje sale de la fecha, no del índice` → `it('usa el día real de cada fecha en los dos idiomas')`, rango `2026-09-02 … 2026-09-08` | pendiente |
| R4 | mismo `describe` que R3 → `it('no se desplaza un día en una zona horaria negativa')`, con `process.env.TZ = 'America/Mexico_City'` y restauración en `finally`. **Único candado que mata la mutación 2** | pendiente |
| R5 | `CHART`::`R5: un día sin dato no es una barra de altura cero` (3 `it`: `missing` sin valor y con `'—'`; `null` —no `0`— hacia el `BarChart`; y `source:'stored'` con la métrica en `null` pintando valor, que es **el único que mata la mutación 3**) | pendiente |
| R6 | `CHART`::`R6: el selector cambia de métrica sin volver a pedir nada` + `HOME`::`it('no vuelve a pedir la actividad al cambiar de métrica')` | pendiente |
| R7 | `CHART`::`R7: la gráfica dibuja eje Y, rejilla y línea de media` (3 `it`: `formatYLabel` de longitud 4 exacta; `weekly-activity-average` con `TABULAR_NUMS`; media que ignora los `missing`) | pendiente |
| R8 | `CHART`::`R8: tocar un día abre su detalle` (tooltip, panel, día `missing`, `onSelectDay`) + `HOME`::`it('ofrece el mapa solo para el día de hoy')` | pendiente |
| R9 | `CHART`::`R9: cada columna se anuncia por separado` (7 etiquetas en los dos idiomas, contenedor sin etiqueta, `accessibilityLabel` traducido en el gráfico y ausencia de `getBarChartAccessibilitySummary`) | pendiente |
| R10 | `CHART`::`R10: las barras entran animadas y respetan reduced motion` (2 `it`, con `useReducedMotion` mockeado como en `src/theme/__tests__/theme-transition.test.tsx`) | pendiente |
| R11 | `CHART`::`R11: la gráfica se dimensiona por onLayout, no por porcentaje` (2 `it`: sin `onLayout` no monta; con 295 px pasa `width`/`height` numéricos) | pendiente |
| R12 | `CHART`::`R12: la tendencia sigue a la métrica y se calla sin base` (6 `it`: `+12,5`/`TrendUp`, `-8,3`/`TrendDown`, `0` sin icono, `null` sin fila, cambio de métrica, y `TABULAR_NUMS` sin color semántico) | pendiente |
| R13 | `CHART`::`R13: la semana entera sin dato se resuelve con un mensaje` (3 `it`) | pendiente |
| R14 | `HOME`::`R14: la Home monta la actividad semanal sin pedir nada nuevo` (3 `it`: la tarjeta con los siete días; el orden `summary-card` → `weekly-activity-card` → `last-position-card`; el recuento de llamadas a `getDailyActivity` sin cambio) | pendiente |
| R14b | mismo `describe` que R14 → `it('carga con skeleton y se calla cuando la actividad falla')` | pendiente |
| R15 | `src/__tests__/design-drift.test.ts`::`it('keeps the four Expo Router entrypoints thin')` con `app/(tabs)/home.tsx` dentro, **más** `HOME` entero en verde tras el movimiento, sin un solo assert debilitado | pendiente |
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
