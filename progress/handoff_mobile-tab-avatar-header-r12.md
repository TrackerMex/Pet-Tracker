Worktree: /home/claude/sites/Pet-Tracker-wt-222r12
NO lances ./init.sh aunque AGENTS.md lo pida: lo corre el leader (comparte LocalStack y Postgres con otros worktrees). Tampoco hagas fetch, merge, rebase ni `bun install`.
Primer comando, antes de nada: `cd /home/claude/sites/Pet-Tracker-wt-222r12 && pwd && git branch --show-current`. Confirma en el reporte que la salida es esa ruta y la branch `feature/222-r12-charter-n1`.

Feature: #222 mobile-tab-avatar-header, SOLO el requisito R12 (enmienda N1 de la carta). Branch: feature/222-r12-charter-n1. Integra en `dev`, no en `main`.
H0 (base del diff final): el HEAD de la branch al recibir esto (`git rev-parse HEAD`, anótalo en el reporte). R1 a R11, R13 y R14 ya están en `dev`; no los toques.
La casilla G4 de `specs/mobile-tab-avatar-header/requirements.md` §Aprobación ya está marcada por el humano (2026-11-03). Por eso R12 se ejecuta ahora (R12.4 no aplica). Spec: specs/mobile-tab-avatar-header/requirements.md §R12 y design.md §2 (bloque canónico). Lee R12.1, R12.2 y R12.3 completos antes de empezar: el texto exacto de la regla N1 está en R12.1 y no se parafrasea.
Entorno: el worktree ya tiene `.env` en la raíz y `mobile-pet-tracker/node_modules`. Usa `bun`/`bunx` en mobile-pet-tracker; nunca npm ni npx. Sin dependencias nuevas.
Esperas y concurrencia: otro worktree puede estar corriendo init.sh. Antes de tu primera corrida de jest, espera a que no haya `jest` ni `init.sh` ajenos (`pgrep -af '[j]est|[i]nit.sh'`; sé consciente de que pgrep se encuentra a sí mismo, por eso el prefijo `[x]`). Sigue docs/conventions.md §Esperas sobre el árbol renderizado.

Archivos (lista cerrada; si necesitas otro, PARA y pregunta al leader):
  - docs/ui-guidelines.md (R12.1: reescribir la línea de la regla N1; R12.2: bloque `## Enmienda docs/ui-guidelines.md` al final, tras `## Enmienda #209`)
  - mobile-pet-tracker/src/__tests__/tab-headers-canvas.test.ts (R12.3 punto 1)
  - mobile-pet-tracker/src/__tests__/hero-header-amendments.test.ts (R12.2 y R12.3 puntos 2 y 3, incluida la constante `CHARTER_N1_222`)
  - specs/mobile-tab-avatar-header/traceability.md y tasks.md (solo en el commit final: fila R12 con hashes y casillas de R12/R12.x)
  - progress/impl_mobile-tab-avatar-header-r12.md (tu reporte)
No tocar nada más (ni producción en `src/`, ni otras specs, ni feature_list.json).

Reglas críticas:
  - Skills con nombres de Codex: `building-native-ui` y `appllama-app-design-skill` no aplican a un cambio solo de carta y tests; basta decir en el reporte que no las cargaste por eso. `expo:expo-overview` no existe en Codex.
  - Referencias a la feature en tests: `#222 R12`, nunca `#222` desnudo (exento de HEX_LITERAL solo `#NNN R<n>`).
  - La firma del bloque R12.2 sigue el precedente de #209 (último bloque de `docs/ui-guidelines.md`): línea `- [X] Enmienda docs/ui-guidelines.md aprobada por humano` seguida de la nota `  Aprobada por el humano en la sesión del leader el 2026-11-03 («si apruebo los cambios»); el leader teclea el commit.` mira el bloque de #209 y copia su forma exacta, citando además la casilla G4 de #222. No uses «Firma delegada».
  - Las líneas de firma `- [ ] Enmienda #222 aprobada por humano` de las otras seis specs NO se marcan (las firma el humano en otro paso).

Cadena de commits (test primero; cada commit en su mensaje nombra R12):
  1. `test(mobile): #222 R12 charter N1 amendment tests`: reescribe las tres aserciones de R12.3 y añade lo que pida R12.2 en los tests de hero-header-amendments. Corre los dos ficheros: deben quedar ROJOS contra la carta vieja. Anota la salida roja (nombres de los it que fallan) en el reporte. Solo tests en este commit.
  2. `docs(ui): #222 R12 charter rule N1`: edita `docs/ui-guidelines.md` (R12.1 + R12.2). Corre los dos ficheros: VERDES. Solo docs en este commit.
  3. `docs(spec): #222 R12 traceability`: traceability.md (fila R12 con los hashes literales de 1 y 2, ya no «pendiente») y tasks.md.
  Verificación final (con salida, no «pasa»): `bunx jest --runTestsByPath src/__tests__/tab-headers-canvas.test.ts src/__tests__/hero-header-amendments.test.ts --silent` verde; la suite de guardas `bunx jest src/__tests__ src/app/__tests__ src/components/__tests__` verde (cuenta suites y tests; si «failed to run» por OOM, repite, no lo cuentes como verde); `bunx tsc --noEmit > ../progress/tsc_222r12.log 2>&1; echo $?` y lint `bunx expo lint > ../progress/lint_222r12.log 2>&1 && test ! -s ../progress/lint_222r12.log` con salida 0 y logs vacíos (borra los logs tras medirlos). `grep -cF '**Regla N1 (enmienda #196)**' docs/ui-guidelines.md` debe dar 0 y `grep -cF '**Regla N1 (enmienda #222)**' docs/ui-guidelines.md` 1 (medidos desde la raíz del repo).
  Mutación: planta una (vuelve la línea de la carta a `**Regla N1 (enmienda #196)**`), mide que los tests la detectan en rojo, y revierte con `git checkout HEAD -- docs/ui-guidelines.md`; confirma cero diferencias.

Reporte: progress/impl_mobile-tab-avatar-header-r12.md. Si encuentras una contradicción de la spec, PARA y anótala; no adaptes la spec por tu cuenta.
No abras ni edites la PR (la abre el leader). Último acto: crea el marcador `progress/impl_mobile-tab-avatar-header-r12.done` con una línea (ruta absoluta del reporte), sin commitearlo. Si el sandbox te deniega un comando, PARA y repórtalo.
