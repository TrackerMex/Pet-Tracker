Worktree: /home/claude/sites/Pet-Tracker-wt-244b
NO lances ./init.sh aunque AGENTS.md lo pida: lo corre el leader (comparte LocalStack y Postgres con otros worktrees).
Primer comando, antes de nada: `cd /home/claude/sites/Pet-Tracker-wt-244b && pwd && git branch --show-current`. Confirma en el reporte que la salida es esa ruta y la branch `feature/244-r10-enmienda-carta`.

Feature: mobile-orbit-splash-icono (#244), tramo R10 (C4 y C5). Integra en `dev`, no en `main`. C1 a C3 (R1 a R9 y R11) ya están mergeados en `dev` (PR #315). G4 ya está firmada por el humano (requirements.md §Aprobación, marcada en el commit H0).
H0 (base de las guardas): f201b9dfbf99c13c757f39bc28a95da875902927. NO hagas git merge ni git rebase de nada.
Spec: specs/mobile-orbit-splash-icono/ (requirements R10, design §3.1 el `it` de R10 y §5 el literal de la enmienda, tasks.md §R10 C4 y C5). No hay nada que preguntar.

ALCANCE: SOLO C4 y C5, más el cierre. Nada de C1 a C3: ya existen. Dos commits mínimo, el test rojo antes que la documentación (C4 de CHECKPOINTS.md):
  C4: añadir a mobile-pet-tracker/src/__tests__/orbit-brand-assets.test.ts el `it` de R10 de design.md §3.1. Debe fallar por aserción (la cuenta de `## Enmienda #244 — ` es 0, no 1), no por import roto. Commit: `test(mobile): R10 red, charter amendment for the brand assets (#244)`.
  C5: añadir AL FINAL de docs/ui-guidelines.md, tras una línea en blanco, el literal de design.md §5 con `Fecha: 2026-11-06` y la casilla `- [ ] Enmienda #244 aprobada por humano` DESMARCADA tal cual (el test la exige así; la firma real de G4 está en requirements.md). No reescribas el punto 7 ni la Enmienda #243. Commit: `docs(ui): R10 charter amendment, the icon and splash are Orbit (#244)`.
  Refactor: nada, solo correr suites.

Archivos (lista cerrada; si necesitas otro, PARA y pregunta al leader):
  - mobile-pet-tracker/src/__tests__/orbit-brand-assets.test.ts (C4, solo el `it` de R10)
  - docs/ui-guidelines.md (C5, solo añadir al final)
  - specs/mobile-orbit-splash-icono/traceability.md (solo en el commit de cierre, fila R10)
  - progress/impl_mobile-orbit-splash-icono-r10.md (tu reporte, NUEVO; no edites progress/impl_mobile-orbit-splash-icono.md)
No tocar: nada más de mobile-pet-tracker, assets, requirements.md (casillas), feature_list.json, progress/history.md, progress/current.md, STATUS.md.

Reglas críticas:
  - Seguir docs/architecture.md, docs/conventions.md y docs/ui-guidelines.md.
  - Skills: ninguna. No toca UI ni pantallas; di en el reporte que no cargaste ninguna y por qué.
  - Valores del test: literales de design.md, nunca importados de producción. NO escribas la palabra «Pingo» en ninguna línea de código del test ni en el texto de la enmienda (orbit-rename.test.ts #225 R4 y la guarda de C5). Referencia a la feature como `#244 R10`, nunca `#244` desnudo en comentarios/títulos.
  - Commits: git add con rutas explícitas, una a una. Nunca git add -A, git add . ni commit -a. El móvil no tiene prettier: no lo ejecutes.
  - Jest de un fichero: cd /home/claude/sites/Pet-Tracker-wt-244b/mobile-pet-tracker && bunx jest <ruta> --testTimeout=30000, solo con `pgrep -af '[n]ode_modules/(.bin/jest|jest-worker)'` y `pgrep -af '[i]nit.sh'` vacíos. El pgrep de un shell que contenga el texto de este prompt se encuentra a sí mismo: ignóralo si es solo tu comando.
  - Tipos: antes de typecheck, `test ! -e .expo/types/router.d.ts`. Si existe, PARA. Nunca rm -f. Códigos de salida sin pipe: `bun run typecheck > /tmp/typecheck-244b.log 2>&1; echo "exit=$?"`.
  - LINT (corregido; la forma `bun run lint` está rota): desde mobile-pet-tracker, `bunx expo lint --no-cache > ../progress/lint-244b.log 2>&1 && test ! -s ../progress/lint-244b.log; echo "exit=$?"` → exit=0 y log vacío.
  - No crear recursos AWS reales ni cdk deploy.
  - No abras la PR ni la edites. No hagas push.
  - Si el sandbox te deniega un comando, PARA y repórtalo. Un error de invocación (ENOENT, command not found) se corrige y se anota; solo PARA si falla el código, una cifra o una guarda.

Anclas de la base (T0), medidas por el leader. Córrelas antes del primer test, pega la salida y PARA ante cualquier diferencia:
  cd /home/claude/sites/Pet-Tracker-wt-244b && git rev-parse HEAD                                  # f201b9dfbf99c13c757f39bc28a95da875902927 (o un commit posterior del handoff)
  grep -c '^## Enmienda #244 — ' docs/ui-guidelines.md                                            # 0 (el grep sale con 1, es normal)
  grep -c '^## Enmienda #243 — ' docs/ui-guidelines.md                                            # 1
  test -d mobile-pet-tracker/node_modules && echo con-node-modules                                 # con-node-modules
  test ! -e mobile-pet-tracker/.expo/types/router.d.ts && echo sin-router-d-ts                     # sin-router-d-ts

Verde esperado tras C5 (desde mobile-pet-tracker): src/__tests__/orbit-brand-assets.test.ts entero, orbit-cachorro-art.test.ts, orbit-charter-voice.test.ts, home-photo-hero-canvas.test.ts, orbit-rename.test.ts y design-drift.test.ts, más typecheck y lint con el comando corregido.

Guardas tras C5 (con H0 de arriba), pega la salida literal:
  grep -c '^## Enmienda #244 — ' docs/ui-guidelines.md                                            # 1
  awk '/^## Enmienda #244 — /{f=1} f' docs/ui-guidelines.md | grep -c 'Pingo'                     # 0 (sale con código 1, es normal)
  git diff --name-only f201b9dfbf99c13c757f39bc28a95da875902927..HEAD -- . ':!specs' ':!progress'                                    # exactamente docs/ui-guidelines.md y mobile-pet-tracker/src/__tests__/orbit-brand-assets.test.ts

Mutación (el `it` de R10 nace rojo, así que el rojo ya es la prueba de C4). Planta además una mutación sobre el verde: duplica temporalmente el encabezado `## Enmienda #244 — ` en docs/ui-guidelines.md → el test debe ponerse rojo; revierte con git checkout HEAD -- docs/ui-guidelines.md y comprueba diff vacío. Anótala en el reporte.

Cierre: traceability.md con la fila R10 (hash de C4 y C5) en UN commit `docs(spec): ...`; tu reporte en progress/impl_mobile-orbit-splash-icono-r10.md con anclas, rojo de C4, verde, guardas, mutación, skills (ninguna) y desviaciones. No rebasees tras rellenar traceability.
Última acción: crear progress/impl_mobile-orbit-splash-icono-r10.done con una sola línea: la ruta de tu reporte (está ignorado por git; no lo commitees).
