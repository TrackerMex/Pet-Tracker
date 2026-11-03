Worktree: /home/claude/sites/Pet-Tracker-wt-228

NO lances ./init.sh aunque AGENTS.md lo pida: lo corre el leader (comparte LocalStack y
Postgres con otros worktrees).

# Handoff #228 R12 (la carta, tras G4)

Implementador: Codex CLI. Un solo commit, rojo, solo test.

Primer comando, antes de nada:
`cd /home/claude/sites/Pet-Tracker-wt-228 && pwd && git branch --show-current && git log --oneline -3`.
Confirma en el reporte la ruta y la branch `feature/228-mobile-reminder-swipe-actions`. Los
commits de arriba abajo: el de este handoff (`docs(progress): #228 R12 codex handoff`), la casilla
G4 `c542a08d` (`chore(spec): #228 G4 approved by the human`) y `bfbf1c48`.

## Base

- H0 (base del diff): el commit de este handoff.
- NO hagas `git fetch`, `git merge`, `git rebase`, `git push` ni `bun install`.
- La casilla G4 de `specs/mobile-reminder-swipe-actions/requirements.md` §Aprobación está
  marcada (`c542a08d`). Compruébalo: `grep -c '^- \[x\] \*\*G4\*\*' specs/mobile-reminder-swipe-actions/requirements.md`
  da `1`. Si da otra cosa, PARA.

## Qué haces

Lee `specs/mobile-reminder-swipe-actions/tasks.md` §«R12 — la carta (solo tras G4)», paso (1), y
requirements.md R12. Solo haces el paso (1). El paso (2), copiar el bloque a
`docs/ui-guidelines.md`, es del leader y va después de tu commit.

1. Añade al final de `mobile-pet-tracker/src/__tests__/reminder-swipe-actions-canvas-fidelity.test.ts`
   un `describe('#228 R12: enmienda de la carta', …)` con un único
   `it('#228 R12: la carta lleva una vez el bloque de su enmienda', …)`, calcado del
   `describe('#204 R16: enmienda de la carta', …)` de
   `mobile-pet-tracker/src/__tests__/routine-canvas-fidelity.test.ts`. Cambia solo:
   - la ruta del design, que pasa a `specs/mobile-reminder-swipe-actions/design.md`;
   - el número, que pasa a `\x23228` en la casilla, en su `normalize`, en la regex del fence
     (``/### Bloque «Enmienda \x23228»[\s\S]*?```markdown\n([\s\S]*?)\n```/``) y en
     `/^## Enmienda \x23228\b/gm`;
   - el comentario de `\x23`, que copias del `it` de `#204 R16`.
   `readFileSync` y `join` ya están importados en el fichero: no añadas imports.
2. Comprueba el rojo, desde `mobile-pet-tracker/`:
   `bunx jest src/__tests__/reminder-swipe-actions-canvas-fidelity.test.ts > ../progress/jest_r12_red.log 2>&1; echo "jest=$?"`.
   Debe fallar **solo** el `it` de R12 y **por la aserción** del recuento del bloque
   (`toBe(1)` recibe `0`, porque la carta aún no lleva el bloque), no por un import, una ruta o
   `canonical` indefinido. El resto del fichero, verde. Si falla otra cosa, PARA.
3. Guardas: `#228` siempre seguido de ` R<n>` en el fichero (regla `HEX_LITERAL` de
   `design-drift`); en las regex, `\x23228`. Corre
   `bunx jest src/__tests__/design-drift.test.ts > ../progress/jest_r12_drift.log 2>&1; echo "jest=$?"`:
   verde.
4. Lint del fichero:
   `bunx expo lint --no-cache src/__tests__/reminder-swipe-actions-canvas-fidelity.test.ts > ../progress/lint_r12.log 2>&1 && test ! -s ../progress/lint_r12.log && echo LINT_OK`.
   Vale el log vacío; si sale con SIGKILL, repítelo.
5. Commit, desde la raíz del worktree:
   `git add mobile-pet-tracker/src/__tests__/reminder-swipe-actions-canvas-fidelity.test.ts && git commit -m "test(mobile): charter carries the swipe actions amendment (R12)"`.
   Comprueba `git show --stat HEAD`: un solo fichero.
6. Borra los logs `progress/jest_r12_*.log` y `progress/lint_r12.log`; no se commitean.

## Archivos

Lista cerrada: `mobile-pet-tracker/src/__tests__/reminder-swipe-actions-canvas-fidelity.test.ts`
y tu reporte `progress/impl_mobile-reminder-swipe-actions-r12.md` (sin commitear). No tocar
`docs/`, `specs/`, `feature_list.json`, ni ningún otro fichero. Si necesitas otro, PARA.

## Reglas

- Literales a mano: el nombre del `describe`, del `it` y las regex van escritos, no importados.
- No abras ni edites la PR, y no hagas push.
- Si el sandbox te deniega un comando, PARA y repórtalo.
- Árbol limpio al terminar: `git status --short -- mobile-pet-tracker specs docs` vacío.

## Reporte

`progress/impl_mobile-reminder-swipe-actions-r12.md`: salida del primer comando, el grep de G4,
el hash del commit, la línea del rojo (nombre del `it` y la aserción que falla con su
recibido), el resultado de design-drift y del lint, y cualquier PARA.

Última acción: crear `progress/impl_mobile-reminder-swipe-actions-r12.done` con una sola línea:
la ruta del reporte. No lo commitees. Devuelve solo esa ruta.
