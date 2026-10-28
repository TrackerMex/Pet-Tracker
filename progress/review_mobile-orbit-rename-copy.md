# review: mobile-orbit-rename-copy (#221, R1-R3)
Fecha: 2026-10-28
Veredicto: APROBADO (alcance R1-R3; R4 es el gate G4 del humano y no está en esta rama por E1)

Rama `feature/221-mobile-orbit-rename-copy`, H0 `2b0f24fd`. Revisión sobre el código real, no solo sobre el reporte.
`./init.sh` NO lo ejecuté: por instrucción del leader lo corre él (el clasificador lo deniega al reviewer). Condición: el
veredicto vale con `init.sh` verde del leader; no hay evidencia propia de ese script.

## Checklist C2 — Estado coherente
- [x] Una sola feature in_progress: no toqué feature_list.json; esta rama no lo modifica (fuera del diff).
- [x] progress/current.md: no es de Codex (handoff: no lo toca); sin delta en el diff.

## Checklist C3 — Arquitectura
- [x] Producción: exactamente 2 líneas de `mobile-pet-tracker/src/i18n/catalog.ts` (numstat 2/2); sin imports nuevos, sin lógica.
- [x] Sin delta en backend, `package.json`, `bun.lock` (`git diff origin/dev --stat` = 0 líneas).
- [x] Sin cambios en assets, theme, components, app, `welcome/index.tsx`, `ui-copy-table.ts`, `ui-language.test.ts` (R3: delta 0, medido 0 líneas).

## Checklist C4 — TDD
- [x] Cada R tiene `it` que lo nombra: `#221 R1: el catálogo dice Orbit`; dos `#221 R2: ninguna cadena visible nombra a Pingo ...`; `#221 R3: los identificadores pingo-* no cambian aquí` (`src/__tests__/orbit-rename-copy.test.ts`).
- [x] Historial test-primero: `5391be19` test (solo 2 ficheros de test; 7 rojos medidos en `progress/c1-221.log`: 7 failed / 83 passed / 90) -> `c435c01c` feat (solo catalog.ts, 2/2) -> `8c6ab460` test R3 (+29 líneas, nace verde por diseño declarado, probado con M3a-M3c) -> `cdde9e0f` docs. Ningún commit mezcla test e implementación.
- [x] Tests de welcome: lista `describe/it` idéntica entre H0 y HEAD (diff de títulos vacío); numstat 7/7 = exactamente 7 literales en 4 `it`; los dos `// #205 R5` ganan ` // #221 R1`; `voice`/`idleLoops` intactos.
- [x] Test nuevo lee `catalog.ts` como TEXTO (`fs.readFileSync`, `jest.requireActual`), sin importar `es`/`en` de producción; literales esperados escritos a mano; no tautológico. R2 recorre `src/` real (sin `__tests__` ni `*.test.*`) + `app.json`, `app.config.ts`, `package.json`, y exige `i18n/catalog.ts`, `screens/welcome/index.tsx`, `components/empty-state.tsx`, `app/(tabs)/_layout.tsx` con `arrayContaining`. El `it` de valores además exige keys == entradas parseadas (no se salta nada).
- [x] Sin `#221` desnudo en el diff de mobile (grep del diff y del fichero nuevo: vacío). Sin StyleSheet, hex ni emoji.

## Checklist C5 — Trazabilidad
- [x] `traceability.md`: R1, R2, R3 con hashes y mensajes; única fila no resuelta es R4 `pendiente (G4, humano)`, permitido por E1b.
- [x] Commits: `test(welcome): ... (R1, R2)`, `feat(i18n): ... (R1, R2)`, `test(i18n): ... (R3)`, `docs(mobile): ...`; mensajes como los dictó el handoff.
- [x] `tasks.md`: marcadas R1-R3 y cierre entregado; sin marcar el smoke ni la sección G4.

## Checklist C6 — Spec aprobada
- [x] `requirements.md` `status: approved` y casilla «Aprobado por humano» marcada (firma delegada). Casillas de enmienda de carta y smoke sin marcar (humano). E1(d) añadida por el leader en `989143c8` (única modificación de requirements.md).

## Checklist C7 — Sin código huérfano
- [x] N/A — la feature no reemplaza ni elimina ningún componente (renombra dos cadenas; `pingo-*`/claves se quedan para #225).

## Alcance de ficheros desde H0
`git diff --name-only 2b0f24fd..HEAD` = 8: catalog.ts, welcome/index.test.tsx, orbit-rename-copy.test.ts, traceability.md, tasks.md, impl_*.md (los 6 del handoff) + `progress/handoff_...md` (74209d62, leader) + `requirements.md` (989143c8, leader). Coincide con el handoff. Los 3 ficheros `progress/*orbit-r4-prep*` siguen sin trackear y no entran en ningún commit.

## Tests y T0
- `progress/final-test-221.log`: Test Suites 173/173, Tests 6350/6350, 0 `FAIL` (N = 6346 + 4). Cuentas encadenadas coherentes: C1 7 rojos de 90; C2 6349; C3 6350; final 6350.
- T0 de Codex (exit=1, 4 tests fallidos en 3 suites): los 4 son `Exceeded timeout of 5000 ms` (docs #158 R10 family + el 2.º por arrastre, home #195 R11, register #172 R3), suites no tocadas por la rama; reruns aislados en verde (`t0-docs/home/register-221.log`: 110/331/75 passed, exit 0). Es flake de carga documentado en el handoff, no regresión. El log final completo es verde.

## Mutaciones plantadas por mí (jest solo sobre `orbit-rename-copy.test.ts`, `pgrep` vacío; base 4/4 verde)
| Sonda | Mutación | Resultado observado | Reversión |
|---|---|---|---|
| M1a | `'Hola, soy Orbit.'` -> `'...Orbit!'` en catalog.ts | rojo `#221 R1` (1 failed, 3 passed) | `git checkout HEAD --` |
| M2a | `// Pingo habla` en `components/empty-state.tsx` | rojo `#221 R2` código fuente | `git checkout HEAD --` |
| M2b | `'zz.probe': 'Pingo te avisa.'` en `es` | rojos `#221 R2` (código) y `#221 R2 ... valores del catálogo` (2 failed) | `git checkout HEAD --` |
| M2c | fichero nuevo `src/hooks/zz.ts` con `// Pingo` | rojo `#221 R2` código fuente | `rm` |
| M3b | `welcome-pingo-float` -> `welcome-orbit-float` | rojo `#221 R3` | `git checkout HEAD --` |
| M3c | `cp pingo-wave.webp orbit-wave.webp` | rojo `#221 R3` | `rm` |
Siete ejecuciones (M2b incluida) con rojo concreto en el `it` esperado y nada más. Árbol tras todas: `git diff --quiet` (mobile, docs, specs, backend) y `--cached` limpios, 0 ficheros nuevos en mobile; `.expo/types/router.d.ts` ausente. Los nuevos sin trackear son solo los 3 del leader. M1b, M3a no los repetí (el reporte de Codex los trae con logs `probe-221-*.log`; M4a-M4d son de R4).

## Observaciones
Ninguna que bloquee. Notas menores, sin acción requerida:
- `tasks.md` R1 (1)/(2) cita mensajes de commit `(R1)`; los reales son `(R1, R2)` por mandato del handoff. Traceability tiene los reales.
- La fila R2 de traceability lista solo el `it` de código fuente, no el segundo `it` de valores del catálogo (comparte prefijo; el reporte de Codex sí lo lista). Sin impacto en el gate.
- Pendiente humano/leader: R4 (G4), smoke Android («Hola, soy Orbit.» / «Hi, I'm Orbit.»), `init.sh` del leader, no marcar `done` hasta cerrar R4.
