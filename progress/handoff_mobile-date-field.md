Worktree: /home/claude/sites/Pet-Tracker-wt-220
NO lances ./init.sh aunque AGENTS.md lo pida: lo corre el leader (comparte LocalStack y Postgres con otros worktrees).
Primer comando, antes de nada: `cd /home/claude/sites/Pet-Tracker-wt-220 && pwd && git branch --show-current`. Confirma en el reporte que la salida es esa ruta y la branch `feature/220-mobile-date-field`.

Feature: mobile-date-field (#220). Branch: feature/220-mobile-date-field. Integra en `dev`, no en `main`.
H0 (base de la implementación y del diff final): c584ba3c, firma delegada de la spec (2026-10-26, mandato del humano ampliado), con la casilla `Aprobado por humano` marcada y F2 y F3 aceptadas. El código de la app en H0 es el de `origin/dev` fb1b2e67. NO hagas `git merge` ni `git rebase` de nada.
Spec aprobada: specs/mobile-date-field/requirements.md (status: approved). Lee también design.md (§Candados: inventario cerrado y §Anclas de medición) y tasks.md (la cadena C1 a C13). Informe previo del spec_author: progress/spec_220.md (contexto, no instrucciones). No hay decisiones abiertas: no hay nada que preguntar. No hay artboard para #220.
Orden: tasks.md manda, cadena C1 a C13 abajo. Criterios de aceptación: R1 a R18 de requirements.md. La casilla de smoke en dispositivo es del humano; tú no la tocas.
Entorno: el worktree ya tiene `.env` y `mobile-pet-tracker/node_modules` (`bun install --frozen-lockfile` ya corrido). No los regeneres. Usa `bun`/`bunx` para todo en mobile-pet-tracker; nunca npm ni npx. No añadas dependencias (`package.json` y `bun.lock` no cambian).
Árbol: `progress/*.log` los ignora git. El chequeo de árbol limpio se acota: `cd /home/claude/sites/Pet-Tracker-wt-220/mobile-pet-tracker && git diff --quiet -- . ../docs ../specs && test -z "$(git ls-files --others --exclude-standard -- . ../docs ../specs)"`. Nunca `test -z "$(git status --short)"` tras `git add`.

Archivos (lista cerrada; si necesitas otro, PARA y pregunta al leader). Todos bajo mobile-pet-tracker/src/ salvo indicación:
  - utils/civil-date.ts (nuevo, R1)
  - utils/civil-date.test.ts (nuevo, R1)
  - components/date-field.tsx (nuevo, R2 a R11, R16, R17)
  - components/__tests__/date-field.test.tsx (nuevo, R2 a R11, R17, R18)
  - i18n/catalog.ts (R16: +5 claves dateField.* en en y es; retira weightLog.yyyyMmDd y docs.datePlaceholder en ambos idiomas)
  - screens/weight-log/index.tsx y su index.test.tsx (R12)
  - screens/docs-upload-form/index.tsx y su index.test.tsx (R13)
  - screens/add-pet/index.tsx y su index.test.tsx (R14)
  - screens/add-reminder/index.tsx y su index.test.tsx (R15)
  - __tests__/add-pet-two-steps.test.ts, __tests__/consistency-classnames.test.ts, __tests__/design-drift.test.ts (solo #178 R13), __tests__/ui-copy-table.ts, __tests__/ui-language.test.ts, providers/__tests__/language-provider.test.tsx (solo las enmiendas de design.md §Candados)
  - ../../specs/mobile-date-field/traceability.md (solo en el commit final)
  - ../../progress/impl_mobile-date-field.md (tu reporte)
No tocar: screens/meal-schedule/, theme/global.css, utils/form-rules.ts, utils/date-picker-value.ts, utils/reminder-dates.ts, utils/civil-today-iso.ts, __tests__/forms-validation-global.test.ts, __tests__/heroui-text-size-merge.test.ts, app/(tabs)/__tests__/layout.test.tsx, feature_list.json, STATUS.md, progress/history.md, progress/current.md, progress/handoff_*.md, docs/ ni backend-pet-tracker/.

Reglas críticas:
  - Seguir docs/architecture.md, docs/conventions.md y docs/ui-guidelines.md. La carta gana sobre cualquier skill.
  - Skills, con los nombres del catálogo de Codex (plugin expo 1.0.2, 13 skills; no los nuestros). La spec puede nombrar `expo:expo-overview`: NO existe en Codex, no la busques.
    - `building-native-ui`: UI nativa y el componente.
    - `expo-tailwind-setup`: uniwind y clases Tailwind v4.
    - `appllama-app-design-skill` (en `.agents/skills/`): obligatoria según la carta §Skills. Solo toma el patrón; los valores los mandan la spec y la carta. Codex no tiene el MCP de appllama: si la skill pide sus herramientas, sáltalas.
    - `expo-overview`, `expo-animation`, `expo-router` y `expo-design-system` no existen en Codex.
    - En el reporte, lista qué skills cargaste y cuáles no encontraste.
  - Esperas: docs/conventions.md §Esperas sobre el árbol renderizado. Espera al mismo nodo que aserta el test (el positivo final o, si la rama pinta null, la desaparición del nodo de carga), nunca a un contador de mock.
  - RNTL 14: `await fireEvent`, `await render`, `await renderRouter` y `await act`. Sin await, un it contamina al siguiente.
  - RNTL oculta a accesibilidad los nodos decorativos: si un `getByTestId` no encuentra un nodo que existe, pasa `{ includeHiddenElements: true }`; no quites la accesibilidad del componente.
  - Jest corre en UTC: `process.env.TZ` NO cambia `Date`. La conversión de Android (R7) se prueba con espías que envuelven la función real, valores centinela y el helper `wallClock`, como pide requirements.md. Nunca con TZ.
  - Valores de la spec (formatos, ms, px, clases) son literales del test, nunca importados de producción (candado tautológico).
  - El copy sale del catálogo `i18n/catalog.ts`; los literales de copy que fija R2/R3/R6/R11/R16 están en requirements.md: úsalos tal cual, no inventes otros. `date-field.tsx` no puede contener como literal entero ningún valor fijo del catálogo (`'OK'`, `'Cancel'`).
  - Comentarios de código y títulos de `describe`/`it`: la referencia a la feature va solo como `#220 R<n>`, nunca `#220` desnudo (el exento de `HEX_LITERAL` de design-drift es solo `#NNN R<n>`). Todo `describe` nuevo se titula `#220 R<n>: …`. Los `it` viejos que reescribes conservan el nombre y llevan el sufijo ` (enmendado por #220 R<n>)`.
  - Cero `StyleSheet.create`, hex fuera de `src/theme/`, clases `[...]`, emoji o dependencias nuevas. design-drift lee también index.test.tsx de algunas pantallas: no pongas `StyleSheet` en tests de pantalla.
  - Candados agregados: design.md §Candados es el inventario cerrado. Si al correr la suite aparece en rojo un `it` que no está allí, PARA y anótalo con el diff medido; no lo enmiendes por tu cuenta. Un candado agregado que se queda verde sin tocarlo cuando debía moverse es una alerta: PARA y reporta.
  - Cifras de los candados: las de design.md son de `origin/dev` fb1b2e67. Mide cada una con su ancla antes de editar y escribe la cifra de ESE commit (acumulada, no la final), según la tabla de tasks.md.
  - Sondas de mutación: cada R de C3/C4 y cada candado enmendado lleva su mutación plantada en producción, vista en rojo y revertida (no se commitea). Plántala donde el candado pueda no mirar. Mutaciones que pide la spec: quitar el `style={CONTINUOUS_CORNER}` del raíz de date-field.tsx (rompe directUses), pasar los límites por `toPickerValue` (R8), conversión UTC en modo hora (R9). Sin la sonda el candado no está probado: anótalo en el reporte. Los `it` que nazcan verdes se dicen en el reporte y se demuestran con la mutación.
  - TDD por requisito: test rojo que nombra el R-id, después verde. Antes de cada commit de test, comprueba que los `it` nuevos fallan por la aserción, no por import roto ni excepción (excepción esperada: C1 y C3, donde el módulo no existe; ahí el rojo es por import y lo dices).
  - UN COMMIT POR PASO como mínimo, test rojo antes que su implementación (C4 de CHECKPOINTS.md): `test(#220): …` y luego `feat(#220): …`, mensajes en inglés tras el prefijo. Nunca implementación y test en el mismo commit. Los C5/C7/C9/C11 son `test`; los candados que se rompen al migrar una pantalla se enmiendan en el `feat` de esa pantalla (C6/C8/C10/C12), como dice tasks.md.
  - Commits: `git add` con rutas explícitas, solo los ficheros del paso. Nunca `git add -A` ni `commit -a`. El móvil no tiene prettier: no lo ejecutes.
  - Cada cadena termina en su línea `git commit -m`. Las cabeceras de sección van como comentario de shell (`# -- C1 --`).
  - Commit final: traceability.md con los hashes y tu reporte, en UN commit `docs(#220): …` tras el último verde. No mezcles ficheros de arnés en los commits TDD. No rebasees tras rellenarlo.
  - Jest de un fichero: `cd /home/claude/sites/Pet-Tracker-wt-220/mobile-pet-tracker && bunx jest --runTestsByPath <ruta> --testTimeout=30000`, solo con `pgrep -f '[n]ode_modules/(.bin/jest|jest-worker)'` y `pgrep -f '[i]nit.sh'` vacíos (otros worktrees corren jest en esta máquina: si no están vacíos, espera y vuelve a mirar; nunca esperes e `init.sh` en el mismo comando). Con `--runTestsByPath` las rutas con `(tabs)` no son regex. Un timeout aislado se mide sin flag antes de tocar nada.
  - Tipos: antes de cada `bun run typecheck` o `bunx tsc --noEmit`, ejecuta `test ! -e .expo/types/router.d.ts`. Si existe, PARA. Nunca `rm -f`.
  - Lint, siempre con `--no-cache` y redirect al log, sin pipe: `cd /home/claude/sites/Pet-Tracker-wt-220/mobile-pet-tracker && bunx expo lint --no-cache > ../progress/lint-220.log 2>&1 && test ! -s ../progress/lint-220.log`. `expo lint` puede morir por memoria con exit 0: por eso `test ! -s`.
  - `react-hooks/purity` veta `Date.now()` en render: el «hoy» del selector se calcula en el manejador del toque (design.md §«Hoy» fuera del render). Si `localDateToIso(new Date())` en una pantalla dispara el lint, usa el patrón de estado `now` ya presente en add-reminder y anótalo.
  - No crear recursos AWS reales ni correr cdk deploy.
  - NO son tuyos: progress/history.md, progress/current.md, STATUS.md y el campo `status` de feature_list.json. Tu sitio para contarlo todo es progress/impl_mobile-date-field.md.
  - No abras la PR ni la edites. No hagas push.
  - Si el sandbox te deniega un comando, PARA y repórtalo. No lo sustituyas por otro que haga lo mismo.
  - Un error de invocación (ENOENT sobre una ruta, `command not found` antes de que arranque jest, tsc o eslint, sin ficheros tocados) se corrige y se anota en el reporte. Solo PARA si falla el código, una cifra de esta lista o una guarda.
  - Si una cifra o ancla no coincide, PARA y reporta. La spec se reescribe; el código no se adapta.

Anclas de la base (T0): corre cada una tal cual antes del primer test, desde /home/claude/sites/Pet-Tracker-wt-220/mobile-pet-tracker/src, y pega la salida en el reporte. Salidas esperadas medidas por el leader en H0 (todas coinciden); ante una diferencia, PARA:
  grep -cF "style={CONTINUOUS_CORNER}" screens/add-pet/index.tsx          # 6
  grep -cF "style={CONTINUOUS_CORNER}" screens/add-reminder/index.tsx     # 4
  grep -cF "ExpoDateTimePicker" screens/add-pet/index.tsx                 # 2
  grep -cF "ExpoDateTimePicker" screens/add-reminder/index.tsx            # 3
  grep -cF "ExpoDateTimePicker" screens/meal-schedule/index.tsx           # 2
  grep -rF "weightLog.yyyyMmDd" . | wc -l                                 # 4
  grep -rF "docs.datePlaceholder" . | wc -l                               # 5
  ls utils/civil-date.ts components/date-field.tsx 2>&1 | grep -c 'No such file'   # 2
  git ls-files theme/global.css | wc -l                                   # 1 (la ruta real es src/theme/global.css; ../global.css de design.md no existe y mediría 0 siempre)
  git diff --stat c584ba3c -- theme/global.css | wc -l                    # 0
  (desde mobile-pet-tracker/) test ! -e .expo/types/router.d.ts && echo sin-router-d-ts   # sin-router-d-ts
Un `grep -c` cuenta líneas, no apariciones.

Base de tests (T0): mídela tú antes del primer commit, con `pgrep` vacíos: `cd /home/claude/sites/Pet-Tracker-wt-220/mobile-pet-tracker && bun run test > ../progress/t0-220.log 2>&1; echo exit=$?` y pega las líneas `Test Suites:` y `Tests:` en el reporte. Debe ser exit 0 y cero `FAIL`; si no, PARA (es base ajena, no se arregla). El aviso final de worker force-exit es preexistente. La cifra de tests de cada commit = anterior + sus `it` añadidos - los que se reemplacen (anótalo).

Cadena (tasks.md manda; pega la línea `Tests:` tras cada commit):
  # -- C1 -- test(#220): R1 civil-date utilities. utils/civil-date.test.ts rojo por import (el módulo no existe). Cuatro funciones: localDateToIso, isoToLocalDate, timeToHhmm, hhmmToLocalDate (requirements.md R1).
  # -- C2 -- feat(#220): R1 add civil-date utilities. utils/civil-date.ts. Verde.
  # -- C3 -- test(#220): R2-R11, R17, R18 lock DateField. components/__tests__/date-field.test.tsx rojo por import. Un `it` por cláusula de R2 a R11, más el grep-limpio de R17 sobre date-field.tsx y R18 (meal-schedule y theme/global.css sin cambio).
  # -- C4 -- feat(#220): R2-R11, R16, R17 add DateField. components/date-field.tsx; +5 claves dateField.* (en y es) en i18n/catalog.ts; R18_DATE_FIELD y su alta en ui-copy-table.ts y ui-language.test.ts; language-provider.test.tsx `+ 5`; fila `[join('components', 'date-field.tsx'), 1]` en directUses y totales `+ 1` en consistency-classnames; `SCREEN_FILES` `+ 1`. Estado tras C4: consistency-classnames `+ 1`, language-provider `+ 5`.
  # -- C5 -- test(#220): R12 weight log on DateField. weight-log/index.test.tsx reescrito y rojo (design.md §7 explica qué `it` desaparecen y por qué).
  # -- C6 -- feat(#220): R12, R16 migrate weight log. Pantalla; retira weightLog.yyyyMmDd (catálogo x2, fila de R5_HEALTH, R5_HEALTH `- 1`, aritmética `+ 5 - 1`). Ancla tras C6: `grep -rF "weightLog.yyyyMmDd" . | wc -l` da 0.
  # -- C7 -- test(#220): R13 docs upload on DateField. docs-upload-form/index.test.tsx reescrito y rojo.
  # -- C8 -- feat(#220): R13, R16 migrate docs upload. Pantalla; retira docs.datePlaceholder (catálogo x2, fila de R7_PROFILE, R7_PROFILE `- 1`, aritmética `+ 5 - 2`, fila del `it` #158 R1 y su título a 12 pares). Ancla tras C8: `grep -rF "docs.datePlaceholder" . | wc -l` da 0.
  # -- C9 -- test(#220): R14 add pet on DateField. add-pet/index.test.tsx reescrito y rojo.
  # -- C10 -- feat(#220): R14, R17 migrate add pet. Pantalla; directUses add-pet `6 -> 5`; add-pet-two-steps `6 -> 5`; totales de consistency-classnames pasan a `+ 0`. Ancla: `grep -cF "style={CONTINUOUS_CORNER}" screens/add-pet/index.tsx` da 5 y `grep -cF "ExpoDateTimePicker" screens/add-pet/index.tsx` da 0.
  # -- C11 -- test(#220): R15 add reminder on DateField. add-reminder/index.test.tsx reescrito y rojo (campos fecha y hora a `h-12 rounded-xl bg-default`).
  # -- C12 -- feat(#220): R15, R17 migrate add reminder. Pantalla; directUses add-reminder `3 + 1 - 2`; icono `['Bell']` en #178 R13 de design-drift; totales de consistency-classnames pasan a `- 2`. Ancla: `grep -cF "style={CONTINUOUS_CORNER}" screens/add-reminder/index.tsx` da 2 y `grep -cF "ExpoDateTimePicker" screens/add-reminder/index.tsx` da 0.
  # -- C13 -- docs(#220): traceability y reporte. specs/mobile-date-field/traceability.md con los hashes (un hash por R, de su test y de su feat) y progress/impl_mobile-date-field.md. Un solo commit.
Antes del `feat` de cada pantalla (C6, C8, C10, C12), el jest completo sin pipe (`bun run test > ../progress/full-220-<cNN>.log 2>&1; echo exit=$?`), con todos los candados agregados en verde.
Si un `it` de pantalla reescrito no puede expresar el caso (design.md §7: los `it.each` de texto inválido en Peso y Documentos), se elimina SOLO esos casos, y cada uno va a una fila de traceability.md con el `it` de `utils/form-rules.test.ts` que lo cubre. No borres ninguna otra aserción sin sustituto.

Guardas que R1 a R18 cruzan:
  - `package.json`, `bun.lock` y theme/global.css sin cambios desde H0.
  - `meal-schedule/index.tsx` sin cambios (ExpoDateTimePicker 2).
  - `utils/form-rules.ts`, `utils/date-picker-value.ts`, `utils/reminder-dates.ts` sin cambios.
  - Nadie fuera de `date-field.tsx` y `meal-schedule` importa `toPickerValue`/`fromPickerValue` tras la cadena.
  - `forms-validation-global` (#186 R9) sigue verde sin tocarlo: las pantallas conservan su `FieldErrorMessage`.

Cierre (tasks.md; lo que el reporte debe traer):
  - `bun run test` completo en verde, guardado en `progress/final-test-220.log`, sin pipe.
  - Guardas en verde: design-drift, consistency-classnames, add-pet-two-steps, ui-language, language-provider, forms-validation-global, heroui-text-size-merge y los cuatro tests de pantalla.
  - Typecheck: `test ! -e .expo/types/router.d.ts` y luego `bun run typecheck`.
  - Lint, como arriba.
  - `git diff c584ba3c -- mobile-pet-tracker/package.json mobile-pet-tracker/bun.lock mobile-pet-tracker/src/theme/global.css mobile-pet-tracker/src/screens/meal-schedule mobile-pet-tracker/src/utils/form-rules.ts mobile-pet-tracker/src/utils/date-picker-value.ts mobile-pet-tracker/src/utils/reminder-dates.ts` vacío.
  - `graphify update .` en el worktree (AST, sin coste).
  - Lista de ficheros tocados desde H0, desde la raíz del worktree: `git diff --name-only c584ba3c..HEAD -- mobile-pet-tracker/`. Debe coincidir con la lista cerrada de arriba.
  - Reporte en progress/impl_mobile-date-field.md: comprobación del primer comando, salida de las anclas T0 y la base de tests, commits (hash y mensaje), línea `Tests:` tras cada commit, resultado de las sondas y mutaciones, `it` que nacieron verdes, skills cargadas y no encontradas, lint y typecheck, qué candados enmendaste (candado, antes/después, R), desviaciones, tabla R1-R18 a test a commit, y la lista de casos de smoke del humano (requirements.md §Fuera de alcance, última viñeta: toque sobre el campo, diálogo nativo, tema oscuro, Peso, Documentos, Alta de mascota, Recordatorio fecha y hora).
  - Última acción: crear progress/impl_mobile-date-field.done con una sola línea, la ruta de progress/impl_mobile-date-field.md. Está en .gitignore; no lo commitees (lo vigila scripts/harness/watch-impl.sh).
