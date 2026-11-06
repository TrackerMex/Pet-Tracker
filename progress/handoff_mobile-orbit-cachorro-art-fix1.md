Worktree: /home/claude/sites/Pet-Tracker-wt-243
NO lances ./init.sh aunque AGENTS.md lo pida: lo corre el leader.
Primer comando: `cd /home/claude/sites/Pet-Tracker-wt-243 && pwd && git branch --show-current` (rama `feature/243-orbit-cachorro-art`).

Corrección 1 de #243 (mismo handoff: progress/handoff_mobile-orbit-cachorro-art.md sigue mandando en todo lo que esto no cambie; mismas reglas críticas).
Tenías razón al parar: la spec omitió el candado `#225 R4`. El leader la enmendó (commit `31b7c10a`, requirements.md R5 y fila de `orbit-rename.test.ts`, «Enmienda 1», y tasks.md §Enmienda 1). Tus commits C1 a C5 y el informe se conservan; no los rehagas.

Qué hacer, en orden:
1. `git log --oneline -3` debe mostrar `31b7c10a` encima de `20367c93`. Si no, PARA.
2. C6 de tasks.md §Enmienda 1: una sola entrada nueva al final del array `exceptions` de `mobile-pet-tracker/src/__tests__/orbit-rename.test.ts`, literal de la spec. Ningún otro cambio en ese fichero. Verde: ese fichero entero. Commit `test(mobile): R5 allow the Pingo history literal in the #243 test (#243)`. Lista de ficheros de este commit: solo ese.
3. Reanuda desde donde paraste: el segundo grupo de tasks.md §Verde de la cadena (tras C5) entero, luego el resto: componentes y assets, `home-photo-hero-canvas.test.ts`, typecheck, lint, guardas (la de `src/` ahora lista el test nuevo y `orbit-rename.test.ts`).
4. Mutaciones de design.md §5 (M1 a M13) sobre el verde final, cada una vista en rojo y revertida (no se commitea; confirma `git status` limpio tras cada una). Más las dos de la Enmienda 1 (quitar la entrada, y `lines: 2`). M2 y M8 son zona ciega: el candado es el pin sha256.
5. Actualiza traceability.md (R5 y R6 ya no bloqueados, hash de C6) y progress/impl_mobile-orbit-cachorro-art.md (quita «BLOQUEADO», anota la corrección y las salidas nuevas) en UN commit `docs(spec): …`. No rebasees.
6. Borra el marcador viejo `progress/impl_mobile-orbit-cachorro-art.done` y, como última acción, créalo de nuevo con la misma línea (ruta del reporte).

Si algo más falla en una suite existente, PARA y reporta con el diff medido. Sin push ni PR. No cargues skills de expo.
