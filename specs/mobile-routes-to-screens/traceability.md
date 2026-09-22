---
feature: "mobile-routes-to-screens"
status: spec_ready       # draft | spec_ready | approved
tags: [harness, spec, mobile, refactor]
---

# Trazabilidad — [[mobile-routes-to-screens]] (#102)

> Rutas relativas a `mobile-pet-tracker/` salvo donde se diga otra cosa.
> El `reviewer` no aprueba si alguna fila queda "pendiente" (C5).
> Convención de commit: `refactor(mobile): <desc> (R2)`.

## Matriz R-id → test → fichero → commit

| Requisito | Test / comprobación que lo cierra | Fichero donde vive | Commit (hash + mensaje) |
|---|---|---|---|
| **R1** | `grep -c 'enmienda A10 de #102'` → 1 y `grep -c 'NO se migran en frío'` → 1 (sin test automático: es enmienda a doc con gate humano propio) | `docs/conventions.md:445-446` (raíz del repo) | `ca2d6f80` — `docs(conventions): excepcion A10 para migracion en frio (R1)` |
| **R2** | 58 tests intactos + los 6 sitios de candado de map repuntados | `src/screens/map/index.test.tsx` | `762c6525` — `refactor(mobile): repunta los candados de map (R2)` |
| **R3** | 28 tests intactos + los 6 sitios de candado de health repuntados | `src/screens/health/index.test.tsx` | pendiente |
| **R4** | 32 tests intactos + los 5 sitios de candado de weight-log repuntados | `src/screens/weight-log/index.test.tsx` | pendiente |
| **R5** | 23 tests intactos + los 4 sitios de candado de meal-schedule repuntados | `src/screens/meal-schedule/index.test.tsx` | pendiente |
| **R6** | `describe('R3: Card compartido elimina rounded arbitrario')`, ternario invertido sobre `food`, suite en 41 | `src/__tests__/design-drift.test.ts:84-86` | pendiente |
| **R7** | `describe('C8: la UI no usa clases arbitrarias')`, `R3` y `R4` — las tres listas en `[]` con los 4 tests ya dentro del escaneo; `sourceFiles()` sin tocar | `src/__tests__/design-drift.test.ts` (`:25-35` intacto; describes `C8` `:61`, `R3` `:67`, `R4` `:94`) | pendiente |
| **R8** | Suite móvil completa en **77 / 1386 / exit 0**, `bunx tsc --noEmit` limpio, 8 renames en `git log --stat -M`, `package.json` y `bun.lock` sin diff | suite móvil completa | pendiente |
| **R9** | Entrada #102 sin `325` ni `388`, con la deuda de `food.tsx` nombrada | `feature_list.json` (raíz del repo) | pendiente |

## Detalle por requisito: qué candado cierra cada uno

Lo usa el `reviewer` para no dar por bueno un repunte a medias.

| Requisito | `ui-copy-table.ts` | `consistency-classnames` | `legibility-classnames` | `design-drift` |
|---|---|---|---|---|
| **R2** map | 17 filas de `R4_MAP` | `:277` (4), `:341` (3) | `:126` (2) | `:433` (0), `:529` (1), ternario |
| **R3** health | 13 filas en `R5_HEALTH` | `:110`, `:275` (2), `:351` (2) | `:124` (1), `:155` | `:432` (0), ternario |
| **R4** weight-log | 19 filas en `R5_HEALTH` | `:174`, `:279` (1), `:352` (2) | — | `:435` (1), ternario |
| **R5** meal-schedule | 19 filas en `R6_FOOD` | `:278` (1) | `:92` | `:434` (1), ternario |

## Recuentos por suite — el candado de la feature

Medidos en `3a52028b`, sin pipe, `JEST_EXIT=0`. **Ninguno puede moverse.**

| Suite (ruta tras la feature) | Antes | Después | Verificado |
|---|---|---|---|
| `src/screens/map/index.test.tsx` | 58 | 58 | pendiente |
| `src/screens/health/index.test.tsx` | 28 | 28 | pendiente |
| `src/screens/weight-log/index.test.tsx` | 32 | 32 | pendiente |
| `src/screens/meal-schedule/index.test.tsx` | 23 | 23 | pendiente |
| `src/app/(tabs)/__tests__/screens.test.tsx` | 2 | 2 | pendiente |
| `src/__tests__/design-drift.test.ts` | 41 | 41 | pendiente |
| `src/__tests__/consistency-classnames.test.ts` | 57 | 57 | pendiente |
| `src/__tests__/legibility-classnames.test.ts` | 26 | 26 | pendiente |
| `src/__tests__/ui-language.test.ts` | 25 | 25 | pendiente |
| `src/__tests__/ui-copy-table.ts` | 2 | 2 | pendiente |
| **Total suite móvil** | **77 / 1386** | **77 / 1386** | pendiente |

## Evidencia de rojo (vía (b) de C4)

`CHECKPOINTS.md` C4 exige que el reporte del `reviewer` traiga la evidencia del
rojo. Aquí se registran los cuatro, uno por ruta. El rojo legítimo está definido
en [[requirements]] §0.3: **el movimiento del fichero de producción es la
mutación**, y el candado lo ve por su propia aserción.

| Requisito | Commit rojo (hash) | Qué suites quedaron rojas | Commit verde (hash) |
|---|---|---|---|
| **R2** map | `b5562651` | 4 suites rojas por `ENOENT` sobre `src/app/(tabs)/map.tsx`; body 58/58 verde | `762c6525` |
| **R3** health | `95ee54fc` | 4 suites rojas por `ENOENT` sobre `src/app/(tabs)/health.tsx`; body 28/28 verde | pendiente |
| **R4** weight-log | pendiente | pendiente | pendiente |
| **R5** meal-schedule | pendiente | pendiente | pendiente |

## Gates humanos

| Gate | Dónde se firma | Estado |
|---|---|---|
| Enmienda R1 a `docs/conventions.md` | [[requirements]] §Aprobación → *Enmienda R1* | pendiente |
| Aprobación de la spec | [[requirements]] §Aprobación → *Aprobación de la spec* | pendiente |
