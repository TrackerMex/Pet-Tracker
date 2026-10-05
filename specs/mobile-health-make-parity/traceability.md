---
feature: mobile-health-make-parity
id: 115
status: spec_ready
tags: [harness, spec, mobile, ui]
---

# Trazabilidad — #115 mobile-health-make-parity

| R | Requisito | Test (fichero › describe › it) | Commit rojo | Commit verde | Estado |
|---|---|---|---|---|---|
| R1 | Copy: 0 claves nuevas, 3 claves de Home reusadas | `src/__tests__/ui-language.test.ts` › `#65 R5: Health resuelve su copy por clave` › `resuelve las 32 ocurrencias normativas` y `#65 R18` › `resuelve cada ocurrencia de la tabla contra la clave exacta`; literales en las filas de R6 | — | — | pendiente |
| R2 | Hero a sangre con el patrón A9 | `src/screens/health/index.test.tsx` › `#115 R2: Salud abre con el hero a sangre (A9)` (4 `it`) + 2 `it` adaptados de `R4: health resuelve la mascota seleccionada` | — | — | pendiente |
| R3 | El hero muestra la mascota seleccionada | `src/screens/health/index.test.tsx` › `#115 R3: el hero muestra la mascota seleccionada de la lista` (3 `it`) | — | — | pendiente |
| R4 | Historial de peso con la clave de weight-log | `src/screens/health/index.test.tsx` › 2 `it` adaptados de `R4: …` + `#87 R13: HealthScreen lee por TanStack Query` › `deja mascotas, vacunas y el historial de peso en sus claves canónicas` | — | — | pendiente |
| R5 | WeightChart en la weight card | `src/screens/health/index.test.tsx` › `#115 R5: la weight card dibuja la evolución con WeightChart` (5 `it`) | — | — | pendiente |
| R6 | Fecha y días de la próxima vacuna | `src/screens/health/index.test.tsx` › `#115 R6: la próxima vacuna dice fecha y días restantes` (`it.each` a..g + 2 `it`) + `R5: vacunas con la próxima destacada` › `highlights the nearest future dose and keeps row order` | — | — | pendiente |
| R7 | Candados globales: deltas y anclas negativas | `src/__tests__/consistency-classnames.test.ts` › `#62 R15: todo contador usa cifras tabulares`; `src/__tests__/ui-language.test.ts` › `#65 R5`; anclas negativas por grep | — | — | pendiente |
| R8 | Alcance cerrado | comandos de requirements R8 (diff, grep-clean, typecheck, lint, jest) | — | — | pendiente |
| R9 | Smoke humano en dev build de Android | gate humano (S1..S9) | — | — | pendiente |
