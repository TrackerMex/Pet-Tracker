Worktree: /home/claude/sites/Pet-Tracker-wt-223r19
NO lances ./init.sh aunque AGENTS.md lo pida: lo corre el leader (comparte LocalStack y Postgres con otros worktrees). Tampoco hagas fetch, merge, rebase ni `bun install`.
Primer comando, antes de nada: `cd /home/claude/sites/Pet-Tracker-wt-223r19 && pwd && git branch --show-current`. Confirma en el reporte que la salida es esa ruta y la branch `feature/223-r19-charter-radii`.

Feature: #223 mobile-alerts-attended-section, SOLO el requisito R19 (línea de radios en la regla 12 de la carta). Branch: feature/223-r19-charter-radii. Integra en `dev`, no en `main`.
H0 (base del diff final): el HEAD de la branch al recibir esto (`git rev-parse HEAD`, anótalo en el reporte). R1 a R18 ya están en `dev`; no los toques.
La casilla G4 de `specs/mobile-alerts-attended-section/requirements.md` §Aprobación ya está marcada por el humano (2026-11-03). Por eso R19 se ejecuta ahora. Lee R19 completo en esa spec antes de empezar: el texto exacto de la línea está ahí y no se parafrasea (copia el bloque ```text tal cual, sin la sangría del bloque).
Entorno: el worktree ya tiene `.env` en la raíz y `mobile-pet-tracker/node_modules`. Usa `bun`/`bunx` en mobile-pet-tracker; nunca npm ni npx. Sin dependencias nuevas.
Esperas y concurrencia: otro worktree puede estar corriendo init.sh. Antes de tu primera corrida de jest, espera a que no haya `jest` ni `init.sh` ajenos (`pgrep -af '[j]est|[i]nit.sh'`, ignorando tu propio shell). Sigue docs/conventions.md §Esperas sobre el árbol renderizado (aquí los candados leen ficheros de forma síncrona y no añaden esperas).

Archivos (lista cerrada; si necesitas otro, PARA y pregunta al leader):
  - docs/ui-guidelines.md (R19: una línea nueva, con sangría de 4 espacios, en la regla 12, inmediatamente después de la línea que contiene ``por fidelidad al canvas (#199): `rounded-24` `` (hoy la línea 206; `grep -cF` da 1). Ningún otro cambio, ni línea en blanco extra)
  - mobile-pet-tracker/src/__tests__/alerts-attended-canvas-fidelity.test.ts (añadir un `it`; no toques los existentes)
  - specs/mobile-alerts-attended-section/traceability.md (solo la fila R19, en el commit final) y tasks.md (solo las tres casillas de §R19)
  - progress/impl_mobile-alerts-attended-section-r19.md (tu reporte)
No tocar nada más (ni producción en `src/`, ni otras specs, ni feature_list.json, ni las casillas de §Aprobación).

Test a escribir (nombre exacto): `it('#223 R19: la carta declara los radios de la sección Atendidas', ...)` en `alerts-attended-canvas-fidelity.test.ts`. Lee la carta con `readFileSync(join(process.cwd(), '..', 'docs/ui-guidelines.md'), 'utf8')` (el fichero ya importa `readFileSync` y `join` por `require`; reutilízalos). Debe: (a) contar la línea exacta de R19 (con su sangría de 4 espacios) una sola vez; (b) comprobar que está en el índice de la línea del #199 + 1 (separa por `\n`, localiza la del #199 con `includes('por fidelidad al canvas (#199): `rounded-24`')`); (c) que quede dentro de la regla 12 (entre `12. **Escala de radios**` y `13. **Botón con cuerpo**`). Referencias a la feature en tests: `#223 R19`, nunca `#223` desnudo.

Reglas críticas:
  - Skills con nombres de Codex: `building-native-ui` y `appllama-app-design-skill` no aplican a un cambio solo de carta y test; basta decir en el reporte que no las cargaste por eso. `expo:expo-overview` no existe en Codex.
  - NO añadas bloque `## Enmienda` ni firma alguna a la carta: R19 es una sola línea (la firma humana es la casilla G4 de la spec).
  - Ningún guard existente exige esa línea; el sufijo `(enmendado por #223 R18)` no aplica a un `it` nuevo.

Cadena de commits (test primero; cada commit en su mensaje nombra R19):
  1. `test(mobile): #223 R19 charter radii line test`: solo el `it`. Corre `bunx jest --runTestsByPath src/__tests__/alerts-attended-canvas-fidelity.test.ts --silent`: debe quedar ROJO solo ese `it`. Anota la salida roja.
  2. `docs(ui): #223 R19 charter radii for the attended section`: solo la línea en `docs/ui-guidelines.md`. Misma corrida: VERDE.
  3. `docs(spec): #223 R19 traceability`: fila R19 de traceability.md con los hashes literales de 1 y 2 (ya no «pendiente»; formato de las filas R15 a R18) y las tres casillas de §R19 de tasks.md.
  Verificación final (con salida, no «pasa»): la corrida dirigida verde; la suite de guardas `bunx jest src/__tests__ src/app/__tests__ src/components/__tests__` verde (cuenta suites y tests; si «failed to run» por OOM, repite, no lo cuentes como verde; un rojo en Salud #168 R2, Inicio #152 R8 o Nutrición #200 R9/R10 es flake conocido bajo carga: repite con la máquina libre y anótalo); `bunx tsc --noEmit > ../progress/tsc_223r19.log 2>&1; echo $?` y `bunx expo lint > ../progress/lint_223r19.log 2>&1 && test ! -s ../progress/lint_223r19.log; echo $?` con salida 0 y logs vacíos (borra los logs tras medirlos). Desde la raíz del repo, `grep -cF 'Fuera de la escala, por fidelidad al canvas (#223): `rounded-16`' docs/ui-guidelines.md` debe dar 1.
  Mutación: planta una (borra la línea nueva de la carta, o mueve su índice una línea abajo), mide que el test la detecta en rojo, y revierte con `git checkout HEAD -- docs/ui-guidelines.md`; confirma cero diferencias.
  Control de lista cerrada: `git diff --name-only <H0>..HEAD` debe dar exactamente los 5 ficheros de la lista (H0 = el commit de este handoff).

Reporte: progress/impl_mobile-alerts-attended-section-r19.md. Si encuentras una contradicción de la spec, PARA y anótala; no adaptes la spec por tu cuenta.
No abras ni edites la PR (la abre el leader). Último acto: crea el marcador `progress/impl_mobile-alerts-attended-section-r19.done` con una línea (ruta absoluta del reporte), sin commitearlo. Si el sandbox te deniega un comando, PARA y repórtalo.
