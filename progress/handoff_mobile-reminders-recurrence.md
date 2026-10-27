Worktree: /home/claude/sites/Pet-Tracker-wt-213
NO lances ./init.sh aunque AGENTS.md lo pida: lo corre el leader (comparte LocalStack y Postgres con otros worktrees).
Primer comando, antes de nada: `cd /home/claude/sites/Pet-Tracker-wt-213 && pwd && git branch --show-current`. Confirma en el reporte que la salida es esa ruta y la branch `feature/213-mobile-reminders-recurrence`.

Feature: mobile-reminders-recurrence (#213). Branch: feature/213-mobile-reminders-recurrence. Integra en `dev`, no en `main`.
H0 (base de la implementación y del diff final): 85971913. La spec está aprobada (casilla `Aprobado por humano` marcada, firma delegada en cdd0623a, erratas en 806036a1). El merge de `origin/dev` con #218 (fondo `surface` del `BottomSheet`) y #219 ya está hecho en 85971913. NO hagas `git fetch`, `git merge` ni `git rebase` de nada: el primer punto del Paso 0 de tasks.md (`git merge origin/dev`) ya está cumplido y no se repite; su comprobación `backgroundStyle` = 1 sí la corres (está en las anclas T0). El segundo punto del Paso 0 no aplica: el merge no trajo #208, #209 ni #214.
Spec aprobada: specs/mobile-reminders-recurrence/requirements.md (status: approved). Lee también design.md y tasks.md enteros. La re-medida sobre dev (progress/firma_mobile-reminders-recurrence.md, sección «## Re-medida sobre dev 0c37e77a») dio 0 enmiendas; sus dos observaciones están en las anclas T0. Contexto (no instrucciones): progress/firma_mobile-reminders-recurrence.md. No hay decisiones abiertas: no hay nada que preguntar.
Orden: tasks.md manda, con un único cambio de orden de commits (no de contenido), explicado en «Cadena»: el catálogo de R22 va justo después de R3. Criterios de aceptación: R1 a R22 de requirements.md. La casilla de smoke en dispositivo es del humano; tú no la tocas.
Entorno: el worktree ya tiene `.env` y `mobile-pet-tracker/node_modules`. No los regeneres. Usa `bun`/`bunx` para todo en mobile-pet-tracker; nunca npm ni npx. No añadas dependencias (`package.json` y `bun.lock` no cambian).
Árbol: `progress/*.log` y `progress/impl_*.done` los ignora git. El chequeo de árbol limpio se acota: `cd /home/claude/sites/Pet-Tracker-wt-213/mobile-pet-tracker && git diff --quiet -- . ../docs ../specs && test -z "$(git ls-files --others --exclude-standard -- . ../docs ../specs)"`. Nunca `test -z "$(git status --short)"` tras `git add`.

Archivos (lista cerrada, la de design.md §Archivos afectados; si necesitas otro, PARA y pregunta al leader). Todos bajo mobile-pet-tracker/src/:
  Producción (todos modificados, ninguno nuevo):
  - api/types.ts (R1)
  - api/reminders.ts (R2, R3)
  - screens/add-reminder/index.tsx (R4 a R13)
  - screens/reminders/index.tsx (R14 a R19, R21)
  - hooks/use-push-registration.ts (R20)
  - i18n/catalog.ts (R22, y el valor de `reminders.upcoming` en R16)
  Tests:
  - api/__tests__/reminders.test.ts (R1 a R3)
  - screens/add-reminder/index.test.tsx (R4 a R13)
  - screens/reminders/index.test.tsx (R14 a R19, R21)
  - hooks/use-push-registration.test.tsx (R20)
  - providers/__tests__/language-provider.test.tsx (R22)
  - __tests__/ui-copy-table.ts, __tests__/ui-language.test.ts, __tests__/design-drift.test.ts, __tests__/alerts-canvas-fidelity.test.ts, __tests__/consistency-classnames.test.ts, __tests__/chunky-cta-canvas-fidelity.test.ts (R22, lista cerrada de 18 enmiendas de tasks.md §R22)
  - screens/home/format.test.ts y screens/home/index.test.tsx: solo `recurrence: null, recurrenceUntil: null` en sus fixtures `Reminder` tipados (R1 (2))
  - cualquier otro fichero de test con un fixture `Reminder` tipado que `bunx tsc --noEmit` señale tras R1: solo esos dos campos, y lo listas en el reporte
  - ../../specs/mobile-reminders-recurrence/traceability.md (solo en el commit final)
  - ../../progress/impl_mobile-reminders-recurrence.md (tu reporte)
No tocar: components/date-field.tsx, utils/civil-date.ts, utils/reminder-dates.ts, components/ (ninguno), theme/, app/ (rutas y sus tests), __tests__/sheet-surface-background.test.ts, __tests__/legibility-classnames.test.ts, backend-pet-tracker/, init.sh, init.config.sh, feature_list.json, STATUS.md, progress/history.md, progress/current.md, progress/handoff_*.md, progress/firma_*.md, ni docs/.

Reglas críticas:
  - Seguir docs/architecture.md, docs/conventions.md y docs/ui-guidelines.md. La carta gana sobre cualquier skill.
  - Skills, con los nombres del catálogo de Codex (plugin expo 1.0.2, 13 skills; no los nuestros). La spec o la carta pueden nombrar `expo:expo-overview`: NO existe en Codex, no la busques.
    - `building-native-ui`: formulario, chips en `ScrollView horizontal`, stepper, hoja.
    - `native-data-fetching`: `useQuery(petKeys.list())` de R13, `invalidateQueries` de R18.
    - `expo-tailwind-setup`: uniwind y clases Tailwind v4.
    - `appllama-app-design-skill` (en `.agents/skills/`): obligatoria según la carta §Skills. Solo toma el patrón; los valores los mandan la spec y la carta. Codex no tiene el MCP de appllama: si la skill pide sus herramientas, sáltalas.
    - `expo-overview`, `expo-router`, `expo-animation` y `expo-design-system` no existen en Codex. `useLocalSearchParams` (R21) sigue el patrón de `app/pets/[petId]/docs-upload.tsx`; esta feature no anima nada nuevo (el `PopIn` del badge ya existe).
    - En el reporte, lista qué skills cargaste y cuáles no encontraste.
  - Esperas: docs/conventions.md §Esperas sobre el árbol renderizado. Espera al mismo nodo que aserta el test (el positivo final o, si la rama pinta null, la desaparición del nodo de carga), nunca a un contador de mock. requirements.md da la espera de cada `it` en R12, R13, R17, R18 y R21: úsala tal cual.
  - RNTL 14: `await fireEvent`, `await render`, `await renderRouter` y `await act`. Sin await, un it contamina al siguiente.
  - RNTL oculta a accesibilidad los nodos decorativos: si un `getByTestId` no encuentra un nodo que existe (iconos), pasa `{ includeHiddenElements: true }`; no quites la accesibilidad del componente.
  - Jest corre en UTC: `process.env.TZ` NO cambia `Date`. R11 y R14 fijan la zona como `#178 R12` del mismo fichero (`process.getBuiltinModule('process').env.TZ = …`, restaurada en `afterEach`) y los timers falsos como ese `it`.
  - Valores de la spec (cuerpos de `createReminder`, frases, fechas, cifras de inventario, clases) son literales del test, nunca importados de producción (candado tautológico).
  - El copy sale de `i18n/catalog.ts`; los literales es-MX/en-US son los de design.md §Copy (55 filas), aprobados por el humano. Úsalos tal cual, no inventes otros. Ninguna pantalla contiene como literal un texto de usuario.
  - Comentarios de código y títulos de `describe`/`it`: la referencia a la feature va solo como `#213 R<n>`, nunca `#213` desnudo (el exento de `HEX_LITERAL` de design-drift es solo `#NNN R<n>`). Todo `it` nuevo se titula `#213 R<n>: …`. Los `it` viejos que tocas conservan el nombre y llevan el sufijo ` (enmendado por #213 R<n>)`, salvo los tres `it.each` que tasks.md §R22 exime.
  - Cero `StyleSheet.create`, hex fuera de `src/theme/`, clases `[...]`, `text-accent` desnudo, `useThemeColors` con `'accent'`, sombras legacy, emoji o dependencias nuevas. design-drift lee también index.test.tsx de algunas pantallas: no pongas `StyleSheet` en tests de pantalla.
  - Hoja de R17: UN solo `<BottomSheet` en screens/reminders/index.tsx y UNA `backgroundStyle` (las de #218). La hoja «Cancelar serie» va dentro del `BottomSheetView` existente. El color `accent-strong` de R14 va al final de la llamada `useThemeColors([` que empieza por `'category-blue-strong'`, nunca en `useThemeColors(['surface'])` de #218 (design.md §Fondo de la hoja). `__tests__/sheet-surface-background.test.ts` sigue verde sin tocarlo.
  - Handler de R18: calcado de `handleDelete` (`try` + `switch` + `catch`); no fundas el `catch` con la rama `error`: cambia las cifras de R22.
  - Inventarios (R22): tasks.md §R22 es la lista cerrada de 18 enmiendas con su cifra base y la nueva. Mide cada literal base con su `grep -cF` antes de editar (todas dan 1, salvo `+ 1 - 1 - 2 // #220 R4; #220 R14; #220 R15` en consistency-classnames, que da 2). Si al correr la suite cae una guarda que no está en la lista, PARA y anótala (nombre, cifra base, cifra que da). Un candado de la lista que se queda verde cuando debía moverse es una alerta: PARA y reporta.
  - Adelanto de candados: los nodos de R4 (iconos), R6 (stepper), R14 (icono `Repeat`), R17 (botones de la hoja) y R18 (`signOut`) mueven candados de la lista de §R22. Si el `feat` de un R pone en rojo un `it` de esa lista, adelanta a ESE `feat` solo los sumandos o filas que ese nodo mueve, con la cifra acumulada de ese commit, y dilo en el reporte (commit, candado, cifra). Las filas de `ui-copy-table.ts` (punto 1 de §R22) y el `+ 57` de `#186 R5` NO se adelantan: `checkUses` las resuelve contra el código y van todas en el commit de R22 del final. Al terminar R22, las cifras son exactamente las de tasks.md §R22.
  - Sondas de mutación: cada R lleva una mutación plantada en producción, vista en rojo y revertida (no se commitea). Plántala donde el candado pueda no mirar. Como mínimo:
    - R1: quitar `recurrenceUntil` de `Reminder` (tsc con TS2339).
    - R2: enviar `recurrence: null` siempre en vez del spread condicional.
    - R3: `DELETE` en vez de `PATCH`; y quitar el `catch` (fila «fetch lanza»).
    - R4: chip por defecto `daily` en vez de «Una vez».
    - R5: dejar `flex-wrap` en la fila de Tipo.
    - R6: límite superior 23; y valor inicial 6.
    - R7: límite superior de meses 11.
    - R8: no vaciar «Hasta» al mover la fecha por detrás.
    - R9: `advanceMinutes` del chip oculto en vez de 0.
    - R10: omitir `recurrenceUntil` con «Hasta» relleno.
    - R11: día de la semana con getters UTC (rompe la fila con zona).
    - R12: aceptar N = 4 en la regla de tomas.
    - R13: usar el nombre sin variante cuando la mascota no está.
    - R14: `month: 'long'` en vez de `'short'`.
    - R15: pintar «Cancelar serie» en una serie `cancelled`.
    - R16: umbral `days <= 1` en vez de `=== 0`.
    - R17: cuerpo con la variante sin nombre siempre.
    - R18: sin `invalidateQueries`; y el `catch` fundido con `error`.
    - R19: nace verde (lista de tasks.md); demuéstralo quitando temporalmente la `backgroundStyle` de #218 (rojo en R19 y en `#218 R3`) y revirtiendo.
    - R20: devolver `'/reminders'` sin `params` con `petId` válido.
    - R21: `selectPet` con un `petId` que no está en la lista.
    - R22: retirar una clave en `en`; y una fila de `ui-copy-table.ts` con clave mal escrita.
    Sin la sonda el candado no está probado: anótalo en el reporte.
  - TDD por requisito: test rojo que nombra el R-id, después verde. Antes de cada commit de test, comprueba que los `it` nuevos fallan por la aserción, no por import roto ni excepción. Los `it` que nacen verdes son la lista cerrada de tasks.md §«`it` que nacen verdes» (5): el commit de test los lleva igual y el reporte usa la frase «nace verde: <motivo>». El rojo de R1 es de `tsc`, no de jest (tasks.md §R1).
  - UN COMMIT POR PASO como mínimo, test rojo antes que su implementación (C4 de CHECKPOINTS.md): `test(mobile): #213 <resumen> (R<n>)` y luego `feat(mobile): #213 <resumen> (R<n>)`, resumen en inglés. Nunca implementación y test en el mismo commit, ni un commit para varios R-ids. El refactor, si lo hay, va en `refactor(mobile): #213 … (R<n>)`.
  - Commits: `git add` con rutas explícitas, solo los ficheros del paso. Nunca `git add -A` ni `commit -a`. El móvil no tiene prettier: no lo ejecutes.
  - Cada cadena termina en su línea `git commit -m`. Las cabeceras de sección van como comentario de shell (`# -- R1 test --`).
  - Commit final: traceability.md con los hashes y tu reporte, en UN commit `docs(mobile): #213 traceability and implementation report` tras el último verde. No mezcles ficheros de arnés en los commits TDD. No rebasees tras rellenarlo.
  - Jest de un fichero: `cd /home/claude/sites/Pet-Tracker-wt-213/mobile-pet-tracker && bunx jest --runTestsByPath '<ruta>' --testTimeout=30000`, solo con `pgrep -f '[n]ode_modules/(.bin/jest|jest-worker)'` y `pgrep -f '[i]nit.sh'` vacíos (otros worktrees corren jest en esta máquina: si no están vacíos, espera y vuelve a mirar; nunca esperes e `init.sh` en el mismo comando). El posicional sin `--runTestsByPath` es regex y sale 0 sin correr nada. Un timeout aislado se mide sin flag antes de tocar nada.
  - Tipos: antes de cada `bunx tsc --noEmit`, ejecuta `test ! -e .expo/types/router.d.ts` desde mobile-pet-tracker/. Si existe, PARA. Nunca `rm -f`.
  - Lint, siempre con `--no-cache` y redirect al log, sin pipe: `cd /home/claude/sites/Pet-Tracker-wt-213/mobile-pet-tracker && bunx expo lint --no-cache > ../progress/lint-213.log 2>&1 && test ! -s ../progress/lint-213.log`. `expo lint` puede morir por memoria con exit 0: por eso `test ! -s`. (tasks.md dice `/tmp/lint-213.log`: usa esta ruta en su lugar.)
  - `react-hooks/purity` veta `Date.now()` y `new Date()` en render: «hoy» de R16 y las fechas de R8/R11 se calculan fuera del render, con el patrón de estado `now` que ya usan add-reminder y reminders. Anótalo.
  - No crear recursos AWS reales ni correr cdk deploy.
  - NO son tuyos: progress/history.md, progress/current.md, STATUS.md y el campo `status` de feature_list.json. Tu sitio para contarlo todo es progress/impl_mobile-reminders-recurrence.md.
  - No abras la PR ni la edites. No hagas push.
  - Si el sandbox te deniega un comando, PARA y repórtalo. No lo sustituyas por otro que haga lo mismo.
  - Un error de invocación (ENOENT sobre una ruta, `command not found` antes de que arranque jest, tsc o eslint, sin ficheros tocados) se corrige y se anota en el reporte. Solo PARA si falla el código, una cifra de esta lista o una guarda.
  - Si una cifra o ancla no coincide, PARA y reporta. La spec se reescribe; el código no se adapta.
  - Flakes de carga conocidos: si un rojo de la suite completa es una suite que no tocaste y pasa sola, es carga: córrela aislada, anota el rojo y el verde aislado y sigue. Conocidos: `#199 R18` (timeouts), Nutrición `#200 R9`/`#200 R10` (`screens/food`), Inicio `#152 R8`, Salud `#168 R2`. En tus ficheros: `#155 R6 … queda en el sitio del vacío que sustituye (enmendado por #204 R4)` de screens/reminders/index.test.tsx dio timeout de 5000 ms con jest ajeno en paralelo durante la auditoría y verde aislado: rojo en la suite completa y verde aislado se anota y se sigue; rojo aislado, PARA. Cualquier otro rojo de tu alcance o de un candado del inventario, PARA.

Anclas de la base (T0): corre cada una tal cual antes del primer test, desde /home/claude/sites/Pet-Tracker-wt-213/mobile-pet-tracker, y pega la salida en el reporte. Salidas esperadas medidas por el leader en H0 (todas coinciden); ante una diferencia, PARA:
  grep -cF -- 'backgroundStyle' src/screens/reminders/index.tsx   # Paso0: 1
  grep -cF -- 'flex-row flex-wrap gap-2' src/screens/add-reminder/index.tsx   # R5: 2
  grep -cE -- '\b(last|first|odd|even):' src/screens/add-reminder/index.tsx   # R12: 0
  grep -cF -- 'rounded-14 px-2.5' src/screens/reminders/index.tsx   # R15: 1
  grep -cF -- '(enmendado por #213 R16)' src/screens/reminders/index.test.tsx   # R16: 0
  grep -cF -- '// #213 R16' src/screens/reminders/index.test.tsx   # R16: 0
  grep -cF -- 'todayCanvasReminders' src/screens/reminders/index.test.tsx   # R16: 0
  grep -cF -- '¡Próximo!' src/screens/reminders/index.test.tsx   # R16: 2
  grep -cF -- '¡Próximo!' src/i18n/catalog.ts   # R16: 1
  grep -cF -- 'const canvasReminders' src/screens/reminders/index.test.tsx   # R16: 1
  grep -cE -- '<BottomSheet([^A-Za-z]|$)' src/screens/reminders/index.tsx   # R17: 1
  grep -cF -- '<BottomSheet' src/screens/reminders/index.tsx   # R17: 2
  grep -cF -- "t('common.cannotReachServer'" src/screens/reminders/index.tsx   # R18: 1
  grep -cF -- "t('common.somethingWentWrong'" src/screens/reminders/index.tsx   # R18: 3
  grep -cF -- 'signOut(' src/screens/reminders/index.tsx   # R18: 1
  grep -cF -- 'useThemeColors(' src/screens/reminders/index.tsx   # A11: 2
  grep -cF -- "const [surface] = useThemeColors(['surface']);" src/screens/reminders/index.tsx   # A11: 1
  grep -cF -- "'muted', 'accent-foreground', 'danger'," src/screens/reminders/index.tsx   # A11: 1
  grep -cF -- '#186 R5: resuelve las 56 ocurrencias normativas' src/__tests__/ui-language.test.ts   # R22.2: 1
  grep -cF -- '50 + 1 - 2 + 1 - 1 + 1 + 1 + 1 + 1 + 3 + 3 - 3' src/__tests__/ui-language.test.ts   # R22.2: 1
  grep -cF -- '#194 R1: mantiene la base más las claves de #68' src/providers/__tests__/language-provider.test.tsx   # R22.4: 1
  grep -cF -- '        + 5 - 2, // #220 R16' src/providers/__tests__/language-provider.test.tsx   # R22.4: 1
  grep -cF -- 'fusiona la esquina una vez y la entrega a las dos ramas de Card' src/__tests__/consistency-classnames.test.ts   # R22.11: 1
  grep -cF -- 'deja CONTINUOUS_CORNER, bg-accent-soft y el acento donde estaban' src/__tests__/consistency-classnames.test.ts   # R22.11: 1
  grep -cF -- '      + 1 - 1 - 2 // #220 R4; #220 R14; #220 R15' src/__tests__/consistency-classnames.test.ts   # R22.11: 2
  grep -cF -- '#177 R7.3: inventario de los veintisiete radios de dieciséis' src/__tests__/chunky-cta-canvas-fidelity.test.ts   # R22.17: 1
  grep -cF -- "  'screens/add-reminder/index.tsx': 1," src/__tests__/chunky-cta-canvas-fidelity.test.ts   # R22.17: 1
  grep -cF -- "  'screens/reminders/index.tsx': 5, // #204 R9" src/__tests__/chunky-cta-canvas-fidelity.test.ts   # R22.17: 1
  grep -cF -- '+ 2 + 1 + 1 + 1 + 1); // #204 R9 (+1)' src/__tests__/chunky-cta-canvas-fidelity.test.ts   # R22.17: 1
  Notas de la re-medida (observaciones, no enmiendas):
  - §R5 (2): la base es 2 (filas de Tipo y Aviso). El `= 1` de tasks.md §R5 es la cifra de llegada tras el feat de R5 (queda la fila de Repetición de R4). Entre R4 y R5 la cifra puede ser 3; anótala.
  - §R16 (3) punto 1: la expectativa `toHaveTextContent('¡Próximo!')` de `renders summaries and reminder rows in API order` está partida en tres líneas en el fichero (`toHaveTextContent(` / `'¡Próximo!',` / `);`). La sustitución prescrita no cambia; el recuento `¡Próximo!` = 2 sí cuadra.
Un `grep -c` cuenta líneas, no apariciones.

Base de tests (T0): la midió el leader en 85971913 (= H0), sin otro jest en la máquina: `Test Suites: 158 passed, 158 total`, `Tests:       5614 passed, 5614 total`, exit 0, sin SIGKILL (progress/base-213.log). No la repitas. Úsala como T0 de la cuenta encadenada: la cifra de tests de cada commit = anterior + sus `it` añadidos (cada fila de `it.each` cuenta) - los reemplazados; anótalo. Si una corrida completa da otra cifra, reconcíliala antes de seguir (una suite tumbada por SIGKILL cuenta 0 tests). El aviso final de worker force-exit es preexistente.

Cadena (tasks.md manda en el contenido de cada paso; pega la línea `Tests:` del fichero corrido tras cada commit):
  # -- R1 -- test: api/__tests__/reminders.test.ts, el `it` de R1 (rojo de tsc, jest verde; el commit cita el TS2339). feat: `Recurrence` y campos obligatorios en api/types.ts, más los fixtures tipados que señale tsc (home/format.test.ts, home/index.test.tsx y los demás que salgan); tsc en 0.
  # -- R2 -- test: it.each `#213 R2: createReminder envía el cuerpo %s`. feat: spread condicional; los tests de cuerpo exacto existentes siguen verdes sin tocarlos.
  # -- R3 -- test: los `it` de R3, incluido el de fetch que lanza. feat: `cancelReminderSeries` y `CancelReminderSeriesState` con `patchJson`.
  # -- R22a (catálogo) -- cambio de orden: el catálogo va aquí porque los textos de R4 a R18 lo necesitan para pintar. test: en providers/__tests__/language-provider.test.tsx, el it.each `#213 R22: claves de recurrencia en ambos idiomas` con las 54 filas de claves nuevas de design.md §Copy, y en `#194 R1` la línea `        + 5 - 2, // #220 R16` → `        + 5 - 2 // #220 R16` con `        + 54, // #213 R22` debajo (tasks.md §R22 punto 4) y su sufijo de título. feat: las 54 claves nuevas en es-MX y en-US de i18n/catalog.ts. La fila 55 (`reminders.upcoming` → «Hoy» / «Today») NO va aquí: va en R16. Commits `test(mobile): #213 recurrence catalog keys (R22)` y `feat(mobile): #213 recurrence catalog keys (R22)`.
  # -- R4 … R15 -- un par test/feat por R, en screens/add-reminder (R4 a R13) y screens/reminders (R14, R15), con los dobles que dice tasks.md (reicon `Repeat`/`Minus`/`Plus`; `QueryClientProvider` y `listPets` en R13; `makeReminder` y `cancelReminderSeries` en R14).
  # -- R16 -- test: el `it` nuevo de R16, las siete enmiendas de tasks.md §R16 con `todayCanvasReminders`, y la fila 55 (`reminders.upcoming`, «Hoy» / «Today») añadida al it.each de R22a. feat: `upcoming = !inactive && days === 0` y el valor de `reminders.upcoming` en es-MX y en-US. Anclas de tasks.md §R16 tras el feat.
  # -- R17, R18 -- un par test/feat cada uno, con las anclas de tasks.md (`<BottomSheet` = 1; `cannotReachServer` 2, `somethingWentWrong` 5, `signOut(` 2).
  # -- R19 -- test: el `it` de R19 (nace verde: R17 + #218). Sin feat; dilo.
  # -- R20, R21 -- un par test/feat cada uno.
  # -- R22 (guardas) -- test: las 57 filas de ui-copy-table.ts, el `+ 57 // #213 R22` y el nuevo título de `#186 R5`, y las enmiendas 5 a 18 de tasks.md §R22 que no se hayan adelantado. feat solo si una fila no cuadra o aparece deriva: se corrige el código, nunca se afloja la guarda.
  # -- docs -- traceability.md (un hash por R, de su test y de su feat) y el reporte, en un solo commit.
Antes de los `feat` de R6, R16, R17 y del test de R22 (guardas), el jest completo sin pipe (`cd /home/claude/sites/Pet-Tracker-wt-213/mobile-pet-tracker && bun run test > ../progress/full-213-<rNN>.log 2>&1; echo exit=$?`), con todos los candados del inventario en verde o con su adelanto en ese mismo commit.

Guardas que R1 a R22 cruzan:
  - `package.json`, `bun.lock`, `theme/` e `init.sh` sin cambios desde H0.
  - `components/date-field.tsx`, `utils/civil-date.ts` y `utils/reminder-dates.ts` sin cambios (se consumen, no se tocan).
  - `backend-pet-tracker/` y `app/` sin cambios.
  - `__tests__/sheet-surface-background.test.ts` y `legibility-classnames` siguen verdes sin tocarlos.

Cierre (tasks.md §Verificación final; lo que el reporte debe traer):
  - `bun run test` completo en verde, guardado en `progress/final-test-213.log`, sin pipe.
  - Además, la corrida de tasks.md: `cd /home/claude/sites/Pet-Tracker-wt-213/mobile-pet-tracker && bunx jest src/api src/app/__tests__ src/screens/add-reminder src/screens/reminders src/screens/home src/hooks src/providers src/__tests__ > ../progress/verify-213.log 2>&1; echo exit=$?`.
  - Typecheck: `test ! -e .expo/types/router.d.ts` y luego `bunx tsc --noEmit`.
  - Lint, como arriba.
  - Anclas finales de tasks.md (§R5, §R12, §R15 a §R18, §R22 punto 1), con la salida pegada.
  - `git diff 85971913 -- mobile-pet-tracker/package.json mobile-pet-tracker/bun.lock mobile-pet-tracker/src/theme mobile-pet-tracker/src/components mobile-pet-tracker/src/utils/civil-date.ts mobile-pet-tracker/src/utils/reminder-dates.ts mobile-pet-tracker/src/app mobile-pet-tracker/src/__tests__/sheet-surface-background.test.ts init.sh backend-pet-tracker` vacío.
  - `graphify update .` en el worktree (AST, sin coste).
  - Lista de ficheros tocados desde H0, desde la raíz del worktree: `git diff --name-only 85971913..HEAD -- mobile-pet-tracker/ specs/`. Debe coincidir con la lista cerrada de arriba.
  - Reporte en progress/impl_mobile-reminders-recurrence.md: comprobación del primer comando, salida de las anclas T0, commits (hash y mensaje), línea `Tests:` tras cada commit y la cuenta encadenada, resultado de las sondas y mutaciones, `it` que nacieron verdes, adelantos de candados (commit, candado, cifra), fixtures tipados tocados por R1, skills cargadas y no encontradas, lint y typecheck, cada enmienda de §R22 (candado, antes/después), flakes de carga vistos, desviaciones, tabla R1-R22 a test a commit, y la lista de casos de smoke del humano: deslizar las filas de chips de Tipo y Aviso, stepper de horas y de meses, «Hasta» con el picker y su borrado, nota de tomas con el nombre de la mascota, línea «Se repite …» en la lista, hoja «Cancelar serie» con fondo `surface` y su confirmación, badge «Hoy», push real de dos ocurrencias seguidas que abre Recordatorios con la mascota del push.
  - Última acción: crear progress/impl_mobile-reminders-recurrence.done con una sola línea, la ruta de progress/impl_mobile-reminders-recurrence.md. Está en .gitignore; no lo commitees (lo vigila scripts/harness/watch-impl.sh).
