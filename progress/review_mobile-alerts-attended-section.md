# review: mobile-alerts-attended-section (#223)
Fecha: 2026-10-27
Hash revisado (HEAD del worktree, branch feature/223-mobile-alerts-attended-section): `1468fd6ac206e5f22e01b4f0d6d15aeced0f24a1`
Base del diff (H0): `418e15986f14a98d38cb411d888d1b99879bacae`
Veredicto: APROBADO (R1-R18; R19 pendiente de la casilla humana G4, no marcado ni simulado). `./init.sh` NO lo corrió el reviewer (lo corre el leader), ver "Condiciones previas al cierre".

## Verificación independiente (corrida por el reviewer en el HEAD anterior)

- Jest acotado: `bun run test -- src/screens/alerts src/screens/alert-detail src/hooks src/__tests__ src/providers src/components src/app/__tests__` -> 85 suites verdes, 1 roja: `components/__tests__/celebration.test.tsx` `#171 R17.3` por timeout de 60 s con la máquina cargada (la corrida duró 165 s). Fichero NO tocado por el diff (`git diff --stat` sobre `src/components` vacío). Rerun aislado con `--runTestsByPath`: 66/66 verde. No es regresión de #223.
- Typecheck (`test ! -e .expo/types/router.d.ts && bun run typecheck`): exit 0.
- Lint (`bunx expo lint --no-cache > log 2>&1`): exit 0, log de 0 bytes.
- Logs de Codex coherentes con la tabla del reporte (c1: 1 failed; c5: 9 failed/83; c9: 14/226; c14: 15/398; c16: 15/513; c18: 10/247; c21: 1/94; c24: 1/96; final: 169 suites, 6121 tests, N+44 con N=6077).
- Sondas propias (mutación plantada en `screens/alerts/index.tsx`, revertida con `git checkout HEAD --`, `git status` limpio y HEAD sin cambio): (a) `attended[0].petName` -> último, (b) quitar `settled &&` de la insignia, (c) `slice(0, visible + 1)`. Resultado: 5 failed, 91 passed: rojos en `#223 R5`, `#223 R8`, `#223 R10` (x2) y `#223 R11`. Los candados muerden en las zonas que la spec pide.
- Drift: el árbol de trabajo está limpio salvo `progress/draft_handoff-223.md` (preexistente, sin seguimiento). El HEAD revisado es `1468fd6a`; anotarlo y comparar contra el HEAD que se empuje.

## Checklist C2 — Estado coherente
- [x] Solo 1 feature in_progress: el diff no toca `feature_list.json` ni `progress/current.md` (escritor único: leader).
- [x] `progress/current.md` actualizado: no aplica a Codex; lo hace el leader al cerrar.

## Checklist C3 — Arquitectura
- [x] domain sin imports de infrastructure: el diff solo toca `mobile-pet-tracker/`.
- [x] contratos en domain: sin cambios.
- [x] application depende de interfaces: sin cambios; hook (`use-alerts-list.ts`) sigue usando `listAlerts`.
- [x] infrastructure sin lógica de negocio: backend, API y `app/` de producción intactos.

## Checklist C4 — TDD
- [x] Cada R1..R18 tiene al menos un test que lo nombra (títulos `#223 R<n>`, ver lista abajo). R19: sin test, ver más abajo.
- [x] Historial test-primero: rojo medido por paso (c1, c4, c5, c7, c9, c12, c14, c16, c18, c21, c24) con commit `test(...)` antes del `feat(...)`. Los tests que nacen verdes (R2, R3, R6, R12, R14, R17, R18) traen sonda de mutación documentada; verifiqué con tres sondas propias que los candados de R5, R8, R10 y R11 muerden. R4/R16 quedan rojos por diseño hasta su verde (C6 / C19).

Tests por requisito:
- R1/R2/R3: `hooks/use-alerts-list.test.tsx` (`#223 R1`, `#223 R2`, `it.each` `#223 R3: %s ...`).
- R4..R15: `screens/alerts/index.test.tsx` (`#223 R4` .. `#223 R15`, uno por requisito; R10 es `it.each([10, 11, 23])`).
- R16/R17/R18: `__tests__/alerts-attended-canvas-fidelity.test.ts` (R16 uno, R17 diecinueve `it`, R18 uno).

## Checklist C5 — Trazabilidad
- [x] `traceability.md` sin filas "pendiente" salvo R19, que queda `pendiente: G4` por instrucción del leader (no es motivo de rechazo). Los 26 hashes citados existen en el repo.
- [x] Commits con formato `feat|test(mobile): <desc> (R-ids)`.
- Observación F1 (no bloqueante, ver abajo): la fila R8 cita los commits de R10, no los suyos.

## Checklist C6 — Spec aprobada
- [x] `requirements.md`: casilla «Aprobado por humano» marcada (firma delegada). El campo `status: draft` del frontmatter lo gestiona el leader por instrucción expresa del handoff (línea 7), no es defecto de Codex. Ver "Condiciones previas al cierre".
- [x] G4 y G2 sin marcar (verificado con grep `^- \[[xX]\] \*\*G[24]` -> 0).

## Checklist C7 — Sin código huérfano
- [x] La feature no reemplaza ningún componente: `onEndReached` se elimina de la pantalla (0 ocurrencias en producción) y sus tests se reescribieron en lugar de dejarse huérfanos.
- [x] N/A para módulos eliminados: no se borró ningún fichero.

## Enmiendas de candados (R18)
Todas llevan el sufijo `(enmendado por #223 R18)` (o `#223 R16` en `language-provider`, según E1/E1b) y están listadas en la spec (tabla de enmiendas, E1, E1b, E2a-d, E3, E4):
- `chunky-cta`: R7.5, R7.1, R7.3, R4.3, R6.2, R8.3 (con la fila nueva `h-11 rounded-14 ...`). `design-drift`: `rounded16` y `outsideReminders(rounded-14)`. `alerts-canvas-fidelity`: `toHaveLength(3)`. `consistency-classnames`: E2a (#98 R10), E2b (#62 R14, fila `directUses` +1 `it`), E2c y E2d (#166 R3). `language-provider`: `+ 6, // #223 R16` tras `+ 51 // #214 R22`. E3 (#203 R8) y E4 (#100 R8 en `app/__tests__/alert-detail.navigation.test.tsx`).
- Las eliminaciones de `screens/alerts/index.test.tsx` (revisadas línea a línea) son las de la tabla: `onEndReached`, expectativas con atendidas en `data` y el viejo `corta el segundo onEndReached`, sustituido por `no pide otra página mientras la anterior está en vuelo`. Ninguna intención se debilita: se mantienen las aserciones de orden, ack, cabeceras y overlay, movidas a la sección Atendidas expandida.
- `ui-copy-table.ts`: seis filas `R12_ALERTS` (sin `SCREEN_FILES` nuevo).

## Lecciones del repo (docs/ui-guidelines.md y memoria)
- [x] Sin hex, `StyleSheet.create` ni `#223` desnudo en producción (grep sobre `screens/alerts/index.tsx`, `use-alerts-list.ts`, `catalog.ts`: 0).
- [x] Claves i18n: las seis en `es` y `en` con los literales de la spec; una sola invocación cada una; `StatusPill` compartido mantiene `statusAcked`/`statusClosed` en una invocación.
- [x] Clases de R17 aplicadas literalmente; `style={CONTINUOUS_CORNER}` en la fila; `chunkyLip.neutralCompact` en «Ver más»; `hitSlop={TOUCH_SLOP}` y `min-h-11`/`h-11` para 44 pt. No hay `expo-image` en el diff (tamaño en style no aplica).
- [x] RNTL 14: los `fireEvent`/`act`/`render` nuevos llevan `await`.
- [x] R19: no hay test, no hay `it.skip`, `docs/ui-guidelines.md` sin tocar (diff de `docs/` vacío), G4 sin marcar.
- [x] Alcance: ningún fichero fuera de la lista cerrada + E4 (app test) + mock de iconos de E4. `package.json`/`bun.lock`/backend/componentes compartidos intactos.

## Hallazgos (todos no bloqueantes)
- F1: `traceability.md` fila R8 apunta a los commits de R10 (`faf1da24` / `d1019fe5`) en lugar de a los propios (`fda15bf1` test rojo, `db84de64` feat). Es defendible (el test de R8 se amplió en `faf1da24`), pero conviene que el leader añada los dos hashes propios en un commit de docs (no rebasear).
- F2: E4, `alert-detail.navigation.test.tsx`: la línea `await waitFor(() => expect(...data).toHaveLength(2));` aparece duplicada (la primera sustituye a la de `toHaveLength(1)` y la segunda ya existía). Inocuo; limpiable en la misma pasada.
- F3: el `describe` «#223 R5: ...» contiene también los `it` de R6-R15; los títulos llevan su R-id, pero el reporte de jest los muestra anidados bajo R5 (mismo texto). Además hay un doble salto de línea añadido en `screens/alerts/index.tsx` antes del `return` y dos en `index.test.tsx`. Cosmético.
- F4: la ampliación del mock de iconos de `alert-detail.navigation.test.tsx` (`Check`, `ChevronDown`, `ChevronUp`) no está en el texto de la fe de erratas E4; el reporte dice que el humano la autorizó por conversación. Conviene que el leader la anote en la errata para que la trazabilidad no dependa del chat.
- F5: `celebration.test.tsx` `#171 R17.3` agota 60 s con carga (flake de recursos, ajeno al diff).

## Condiciones previas al cierre (leader)
1. Correr `./init.sh` y comprobar exit 0 sin pipe (la corrida final de Codex fue 169 suites / 6121 tests verde, pero el gate lo mide el leader).
2. Pasar `status: approved` en el frontmatter de `requirements.md`, `design.md`, `tasks.md` y `traceability.md` (el handoff reserva este cambio al leader).
3. R19 sigue pendiente de G4 (casilla humana) y el smoke G2 sigue reservado al humano; el leader decide el cierre según `traceability.md`.
4. Verificar drift: el HEAD que se mergea debe ser `1468fd6a` (o diff vacío de código contra él).

## Output de ./init.sh
No ejecutado por el reviewer (el clasificador lo deniega; lo corre el leader). Evidencia sustitutiva: jest acotado, typecheck y lint arriba, más los logs de Codex en `progress/final-test-223.log`, `progress/final-types-223.log` y `progress/lint-223.log`.
