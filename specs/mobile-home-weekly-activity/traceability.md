---
feature: "mobile-home-weekly-activity"
status: spec_ready     # draft | spec_ready | approved
tags: [harness, spec]
---

# Trazabilidad — [[mobile-home-weekly-activity]]

Rutas relativas a `mobile-pet-tracker/`. La columna **Test** la **prescribe la
spec** (no la improvisa el implementer): es el contrato de qué prueba cada
R-id. La columna **Commit** la rellena el implementer en cuanto ese requisito
queda verde, nunca al final.

| Requisito | Test (archivo::nombre) — prescrito por la spec | Commit (hash + mensaje) |
|---|---|---|
| R1 | `src/components/__tests__/weekly-activity-chart.test.tsx`::`R1: WeeklyActivityChart recibe los días y no habla con la red` | pendiente |
| R2 | `src/components/__tests__/weekly-activity-chart.test.tsx`::`R2: cada día del array es una columna y su altura es proporcional` | pendiente |
| R3 | `src/components/__tests__/weekly-activity-chart.test.tsx`::`R3: un día sin dato no es una barra de altura cero` (3 `it`: `missing` sin barra, cero con barra de `WEEKLY_BAR_MIN_HEIGHT`, y `source:'stored'` con `activeMinutes: null` pintando barra — el que fija `source` como discriminante) | pendiente |
| R4 | `src/components/__tests__/weekly-activity-chart.test.tsx`::`R4: la letra del eje sale de la fecha, no del índice` → `it('usa el día real de cada fecha en los dos idiomas')`, rango `2026-09-02 … 2026-09-08` | pendiente |
| R4b | mismo `describe` que R4 → `it('no se desplaza un día en una zona horaria negativa')`, con `process.env.TZ = 'America/Mexico_City'` y restauración en `finally` | pendiente |
| R5 | `src/components/__tests__/weekly-activity-chart.test.tsx`::`R5: cada columna se anuncia por separado` | pendiente |
| R6 | `src/components/__tests__/weekly-activity-chart.test.tsx`::`R6: la tendencia sale de weekComparison y se calla sin base` (5 `it`: `+12,5` con `TrendUp`, `-8,3` con `TrendDown`, `0` sin icono, `null` sin fila, y `TABULAR_NUMS` sin color semántico) | pendiente |
| R7 | `src/components/__tests__/weekly-activity-chart.test.tsx`::`R7: la semana entera sin dato se resuelve con un mensaje` | pendiente |
| R8 | `src/app/(tabs)/__tests__/home.test.tsx`::`R8: la Home monta la actividad semanal sin pedir nada nuevo` (3 `it`: la tarjeta con los siete días, el orden `summary-card` → `weekly-activity-card` → `last-position-card`, y el recuento de llamadas a `getDailyActivity` sin cambio) | pendiente |
| R8b | mismo `describe` que R8 → `it('carga con skeleton y se calla cuando la actividad falla')` | pendiente |
| R9 | `src/__tests__/ui-language.test.ts` (candado de catálogo preexistente: una clave sin traducción en algún idioma no compila, y `checkUses(ALL_USES)` exige una fila por llamada) + las seis filas nuevas de `R3_HOME` en `src/__tests__/ui-copy-table.ts` | pendiente |
| R10 | Requisito de **verificación** (C4 vía (b)): suite móvil completa verde con `bun run test` desde `mobile-pet-tracker/`, grep-clean de la carta §Decisiones fijas 3 intacto y escala de radios de #62 R4 sin clase fuera de escala | pendiente |
| R10b | Los deltas contra `4a5f6dd` de la tabla de [[requirements]] R10b, verificados por el reviewer **rehaciendo cada grep**, no leyendo el informe del implementer | pendiente |
| R10c | Las cuatro mutaciones de [[tasks]] §R10 (3), plantadas de una en una, con la evidencia en `progress/impl_mobile-home-weekly-activity.md` §prueba de mutación. La mutación 2 (`new Date(cadena)`) solo la mata el `it` de R4b: si la suite sigue verde con ella plantada, el candado está mal escrito | pendiente |

Regla: el reviewer no aprueba si alguna fila queda "pendiente" en la columna
Commit.
Convención de commit: `feat(mobile-home-weekly-activity): <desc> (R2,R3)`.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida al
aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).

**Fuera de esta tabla y no delegable a IA**: el gate humano de smoke en dev
build de Android (nunca Expo Go), en tema claro y oscuro, con una mascota que
tenga al menos un día sin dato y al menos un día de cero minutos. Sin él la
feature no pasa a `done`, tenga la tabla las filas que tenga.
