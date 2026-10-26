# review: mobile-sheet-surface-background (#218)
Fecha: 2026-10-26
Veredicto: APROBADO (condicionado a que el leader corra `./init.sh` verde; el reviewer no lo ejecuta por instruccion expresa del leader)

Base: H0 = `68a1f217`, HEAD = `7e6a8bf3`, rama `feature/218-mobile-sheet-surface-background`, arbol limpio.

## Checklist C2 — Estado coherente
- [x] Solo 1 feature in_progress: el diff contra H0 no toca `feature_list.json` ni `progress/current.md` (los gestiona el leader).
- [x] `progress/current.md` no modificado por Codex (correcto; es del leader).

## Checklist C3 — Arquitectura
- [x] Cambio solo en capa de pantalla movil; sin imports nuevos de infraestructura.
- [x] Sin dependencias nuevas: `git diff 68a1f217` sobre `package.json`, `bun.lock`, `src/theme`, `src/i18n` vacio.
- [x] Color imperativo via `const [surface] = useThemeColors(['surface']);` (carta regla 9), sin hex, sin StyleSheet.
- [x] Sin logica de negocio nueva.

## Checklist C4 — TDD
- [x] R1, R2, R3 tienen test que los nombra (`#218 R1`, `#218 R2`, `#218 R3`).
- [x] Historial test-primero: C1 `45557e98`, C2 `0f491fbd`, C3 `f44ecb23` tocan solo ficheros de test (`--stat` lo confirma); C4 `e3def8e3` y C5 `a9b0ad93` tocan solo produccion (+2 cada uno). Los logs `c01/c02/c03-red-218.log` y `c0N-218.log` muestran el rojo por asercion (R1 `{}` vs `color:surface`; R2 igual; 2 filas R3 rojas, inventario verde de nacimiento, declarado).
- [x] Candados no tautologicos: los valores son literales en el test (`'color:surface'`, `['50%','100%']`, `backgroundStyle={{ backgroundColor: surface }}`, `const [surface] = useThemeColors(['surface']);`, rutas de los dos importadores); ningun import de produccion. R2 usa el mismo `Object.assign/flat` que prescribe la spec.
- [x] Inventario R3: recorre todo `src/` recursivamente (excluye `__tests__/` y `*.test.*`), filtra por `@expo/ui/community/bottom-sheet`, compara con la lista cerrada de 2 ficheros; `it.each(importers)` comprueba un unico `<BottomSheet(?![A-Za-z])`, la linea literal una sola vez (split == 2) y la declaracion del token. Un tercer importador rompe el inventario y su propia fila (sonda 4: `probe-4-inventory-218.log`, 2 failed: inventario y fila del probe). Verifique con grep que hoy solo hay esos dos importadores del paquete.
- [x] Sondas (1a, 1b, 2, 3, 4) con logs reales y rojos concretos: 1a/1b/2 -> 2 failed cada una (R1/R2 + fila R3); 3 (hex) -> 6 failed (R1, R2 + los 4 guards R5 de design-drift: #193 R11, R11 pairing, #68 R18, #178 R13); 4 -> inventario rojo. Todas revertidas (arbol limpio, `git status` vacio).

## Checklist C5 — Trazabilidad
- [x] `traceability.md` sin filas "pendiente"; R1-R6 con test y hash. Un hash de test + hash(es) de implementacion por R (R3 cubierto por C4+C5, correcto porque cada fila depende de una pantalla).
- [x] Commits `test(#218): R<n> ...` / `feat(#218): R<ids> ...` coherentes con la convencion del repo.
- [x] Lista cerrada de ficheros: `git diff --name-only 68a1f217..HEAD -- mobile-pet-tracker/` son exactamente los 5 esperados.
- [x] `git diff --numstat 68a1f217`: produccion `2 0` en `reminders/index.tsx` y `pairing/index.tsx`; tests existentes solo adiciones (`24 0`, `7 0`), 0 lineas borradas; test nuevo `53 0`.
- [x] El diff de produccion coincide con la spec: `const [surface] = ...` (tras la declaracion de colores en reminders; tras `[muted, danger]` en pairing) y `backgroundStyle={{ backgroundColor: surface }}` como ultima prop tras `snapPoints`.

## Checklist C6 — Spec aprobada
- [x] `requirements.md` status approved, casilla de firma delegada marcada. La casilla de smoke G2 (humano) correctamente sin marcar.

## Checklist C7 — Sin codigo huerfano
- [x] N/A — la feature no reemplaza nada existente.

## Verificacion independiente
- Jest de alcance corrido por mi (`sheet-surface-background.test.ts`, `reminders/index.test.tsx`, `pairing/index.test.tsx`): exit 0, `Test Suites: 3 passed`, `Tests: 223 passed` (= 82 + 138 + 3). Nota: justo antes de lanzar, el pgrep de jest estaba vacio tras esperar a un jest de #208; entre el chequeo y el arranque aparecieron otros procesos jest de worktrees vecinos, pero la corrida salio verde.
- Evidencia de Codex (logs en `progress/`): suite completa 158/158 suites, 5553/5553 tests; typecheck y lint (log de 0 bytes) limpios. No los re-ejecute (init.sh / suite completa son del leader).
- Drift contra `origin/dev` (`8b4cb1bd`, merge-base `81ca7529`): `git diff --name-only HEAD...origin/dev` no toca ningun fichero de `mobile-pet-tracker/`; sin conflicto ni deriva de las anclas. (#213 no ha mergeado aun; su solape en `reminders/index.tsx` se resuelve con merge, no rebase, segun R6.)

## Hallazgos
- Critico: ninguno.
- Alto: ninguno.
- Medio: ninguno.
- Bajo 1: `specs/mobile-sheet-surface-background/tasks.md` conserva todas las casillas sin marcar (no se actualizo). No es regla de CHECKPOINTS; el leader puede marcarlas al cerrar.
- Bajo 2: el inventario R3 detecta por la ruta `@expo/ui/community/bottom-sheet`, tal como fija la spec; un BottomSheet de otro paquete (p. ej. `@gorhom/bottom-sheet`, que figura como dependencia en design-drift:309, o HeroUI) no lo veria. Fuera de alcance de #218; no bloquea.
- Bajo 3: el reporte documenta una desviacion de orden en el primer comando y lecturas anticipadas de logs (sin impacto en el codigo).

## Pendiente fuera del veredicto
- `./init.sh` verde lo corre el leader (condicion de este aprobado).
- Smoke G2 en dev build Android (claro/oscuro/Material You) sigue reservado al humano; el cierre `done` espera esa casilla.

## Output de ./init.sh
No ejecutado por el reviewer (instruccion del leader; ver memoria `init-sh-reviewer-denegado`). Pendiente del leader.
