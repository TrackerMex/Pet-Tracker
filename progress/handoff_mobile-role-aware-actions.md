Worktree: /home/claude/sites/Pet-Tracker-wt-216
NO lances ./init.sh aunque AGENTS.md lo pida: lo corre el leader (comparte LocalStack y Postgres con otros worktrees).
Primer comando, antes de nada: `cd /home/claude/sites/Pet-Tracker-wt-216 && pwd && git branch --show-current && git log --oneline -2`. Confirma en el reporte que la salida es esa ruta y la branch `feature/216-mobile-role-aware-actions`. Los dos commits deben ser, de arriba abajo, el del handoff (`docs(progress): #216 Codex handoff`) y `da0cfbdd` (H0).

Feature: mobile-role-aware-actions (#216). Branch: feature/216-mobile-role-aware-actions. Integra en `dev`, no en `main`.
H0 (base de la implementación y del diff final): da0cfbdd, el merge de `origin/dev` (`ca2d0abb`, con #217) sobre la firma delegada 6ca2ff21. La spec está aprobada: la casilla `Aprobado por humano` está marcada y la firma es 6ca2ff21. NO hagas `git fetch`, `git merge`, `git rebase` ni `bun install --frozen-lockfile`: los tres primeros puntos del Paso 0 de tasks.md ya están cumplidos (el merge no trajo dependencias nuevas; #214 no está en `origin/dev` y no cambia nada) y no se repiten. El cuarto punto (re-medir las anclas de partida) sí lo corres: son las anclas T0 de abajo.
Spec aprobada: specs/mobile-role-aware-actions/requirements.md (status: approved). Lee también design.md, tasks.md y traceability.md enteros. No hay decisiones abiertas: no hay nada que preguntar.
Orden: tasks.md manda, sin cambios de orden: R1 a R7, cada uno con (1) test rojo y (2) verde. Criterios de aceptación: R1 a R7 de requirements.md. La casilla de smoke en dispositivo es del humano; tú no la tocas.
Entorno: el worktree ya tiene `.env` y `mobile-pet-tracker/node_modules`. No los regeneres. Usa `bun`/`bunx` para todo en mobile-pet-tracker; nunca npm ni npx. Sin dependencias nuevas.
Árbol: `progress/*.log` y `progress/impl_*.done` los ignora git. El chequeo de árbol limpio se acota: `cd /home/claude/sites/Pet-Tracker-wt-216/mobile-pet-tracker && git diff --quiet -- . ../docs ../specs && test -z "$(git ls-files --others --exclude-standard -- . ../docs ../specs)"`. Nunca `test -z "$(git status --short)"` tras `git add`.

Archivos (lista cerrada, la de design.md §Archivos afectados; si necesitas otro, PARA y pregunta al leader). Todos bajo mobile-pet-tracker/ salvo los que empiezan por `../`:
  Producción modificada:
  - src/screens/weight-log/index.tsx (R1)
  - src/screens/home/index.tsx (R2, R3)
  - src/screens/reminders/index.tsx (R4, R5)
  - src/screens/pairing/index.tsx (R6, R7)
  Tests modificados:
  - src/screens/weight-log/index.test.tsx (R1 y las enmiendas de `#199 R22` y, si hace falta, del helper `form()` de `#199 R7`)
  - src/screens/home/index.test.tsx (R2, R3)
  - src/screens/reminders/index.test.tsx (R4, R5 y la enmienda de `opens the add-reminder route`)
  - src/screens/pairing/index.test.tsx (R6, R7)
  - src/__tests__/ui-copy-table.ts (la fila `// #216 R6` de `R10_PAIRING`)
  - src/__tests__/ui-language.test.ts (el `it` de `#65 R10`)
  Arnés:
  - ../specs/mobile-role-aware-actions/traceability.md (solo en el commit final)
  - ../progress/impl_mobile-role-aware-actions.md (tu reporte)
No tocar: src/api/ (ninguno: `getPet`, `listPets` y `petKeys` se consumen), src/i18n/catalog.ts (no hay copy nuevo: `pairing.errorForbiddenClaim` ya existe), src/components/, src/theme/, src/hooks/, src/providers/, src/app/, cualquier otro test fuera de la lista (en particular src/__tests__/design-drift.test.ts, home-pingo-phrase.test.ts, routine-canvas-fidelity.test.ts, chunky-cta-canvas-fidelity.test.ts, collar-alerts-canvas-fidelity.test.ts, consistency-classnames.test.ts, no-pets-states.test.ts y jest-virtual-mock-lock.test.ts: design.md §Guardas que se mueven dice que no cambian), package.json, bun.lock, test/jest-setup.js, backend-pet-tracker/, init.sh, init.config.sh, feature_list.json, STATUS.md, progress/history.md, progress/current.md, progress/handoff_*.md, progress/firma_*.md, ni docs/.

Reglas críticas:
  - Seguir docs/architecture.md, docs/conventions.md y docs/ui-guidelines.md. La carta gana sobre cualquier skill.
  - Skills, con los nombres del catálogo de Codex (plugin expo 1.0.2, 13 skills; no los nuestros). La spec o la carta pueden nombrar `expo:expo-overview`: NO existe en Codex, no la busques.
    - `native-data-fetching`: la `useQuery` de `getPet` de R1 (misma clave `petKeys.detail(petId)` que Inicio, para compartir cache).
    - `building-native-ui`: los envoltorios condicionales de R1 a R7 y el `Text` de `pairing-owner-only`.
    - `expo-tailwind-setup`: uniwind y clases Tailwind v4.
    - `appllama-app-design-skill` (en `.agents/skills/`): obligatoria según la carta §Skills. Solo toma el patrón; los valores los mandan la spec y la carta. Codex no tiene el MCP de appllama: si la skill pide sus herramientas, sáltalas.
    - `expo-overview`, `expo-router`, `expo-animation` y `expo-design-system` no existen en Codex. Esta feature no navega ni anima nada nuevo: `RiseIn` de R1 ya existe y solo se envuelve.
    - En el reporte, lista qué skills cargaste y cuáles no encontraste.
  - Formas literales: design.md da, por pantalla, la forma exacta de `isOwner` y de cada condición, y requirements.md la ancla con `grep -cF`. Escríbelas tal cual (mismo orden de términos, mismas comillas). No factorices `isOwner` en un hook ni en un util: el ancla cuenta su declaración en cada pantalla.
  - Esperas: docs/conventions.md §Esperas sobre el árbol renderizado. Espera al mismo nodo que aserta el test (el positivo final o, si la rama pinta null, un nodo hermano que existe en las dos ramas), nunca a un contador de mock. requirements.md da la espera de cada fila (`findByTestId('pairing-title')`, `findByTestId('activation-code-input')`, `findByTestId('pairing-owner-only')`, `getQueryData(petKeys.detail('pet-1'))`, …): úsala tal cual.
  - RNTL 14: `await fireEvent`, `await render`, `await renderRouter` y `await act`. Sin await, un it contamina al siguiente.
  - RNTL 14: `toHaveTextContent('<cadena>')` compara el texto **entero** del nodo (`exact: true` por defecto). Para «contiene», regex (`/…/`). Los textos exactos de la spec («Solo el dueño puede vincular un collar.») se asertan sobre el nodo que los lleva, no sobre un contenedor.
  - `className` de un `Button` de HeroUI: HeroUI antepone sus clases internas (`pressable-feedback__root button__root …`), así que nunca `toBe` con la receta sobre un `Button`. Las `className` exactas de esta spec (`pairing-owner-only`) son de `Text` de react-native: ahí `toBe` sí vale.
  - RNTL oculta a accesibilidad los nodos decorativos: si un `getByTestId` no encuentra un nodo que existe, pasa `{ includeHiddenElements: true }`; no quites la accesibilidad del componente.
  - Valores de la spec (testIDs, roles, textos, clases, claves de query, cifras) son literales del test, nunca importados de producción (candado tautológico). `makePet` de R1 es copia literal del de src/screens/home/index.test.tsx, no un import.
  - Copy: no hay claves nuevas. La nota de R6 es `t('pairing.errorForbiddenClaim')`, llamada directa (`checkUses` solo ve `t('<clave>'` literales).
  - Títulos: los `describe` nuevos son los de requirements.md (`describe('#216 R<n>: …')`) y los `it` dentro, con el título que da requirements.md para cada uno. Los `it` viejos que enmiendas ganan exactamente el sufijo de tasks.md (` (enmendado por #216 R1)`, ` (enmendado por #216 R4)`, ` (enmendado por #216 R6)`). El reporte da el nombre completo `describe › it`.
  - Comentarios que citan la feature (cierra un hueco de la spec): en los cuatro ficheros de **producción**, ningún comentario `#216`, ni siquiera `#216 R<n>`. `#190 R12` (src/__tests__/home-pingo-phrase.test.ts) busca `/#[\da-f]{3,8}\b/i` en src/screens/home/index.tsx sin quitar comentarios, así que `// #216 R2` lo tumba; en las otras tres pantallas se sigue la misma regla para no depender de qué guarda exime qué. En tests y en ui-copy-table.ts, solo `#216 R<n>`, nunca `#216` desnudo (el exento de `HEX_LITERAL` de design-drift es solo `#NNN R<n>`).
  - Cero `StyleSheet.create`, hex fuera de `src/theme/`, clases `[...]`, `text-accent` desnudo, sombras legacy o emoji. design-drift lee también index.test.tsx de algunas pantallas: no pongas `StyleSheet` en tests de pantalla.
  - `signOut(`: la consulta nueva de Peso no cierra sesión (ancla de R1: 1 → 1; lo vigila `screenSignOutCalls` de design-drift). La rama de error de `getPet` simplemente deja `isOwner` en `false`.
  - Inicio: `QUICK_ACTIONS` no se toca; el tile se omite dentro del `map` con la forma literal. No reordenes los tiles ni cambies `quickActionInks`.
  - Selectores por prefijo: design.md §Guardas lista los de Vincular collar (`/^pairing-content-skeleton-/`, `/^pet-chip-/`, …) y comprueba que `pairing-owner-only` no cae en ninguno. Si al correr la suite un selector por prefijo cuenta un nodo de más, PARA.
  - Sondas de mutación: ver «Sondas». Cada R lleva una mutación plantada en producción, vista en rojo y revertida con `git checkout HEAD --` del fichero (no se commitea; después `git diff --quiet` y `git diff --cached --quiet` del fichero). Sin la sonda el candado no está probado: anótalo en el reporte.
  - TDD por requisito: test rojo que nombra el R-id, después verde. Antes de cada commit de test, comprueba que los `it` nuevos fallan por la aserción o por el tiempo de la espera (lo que diga «Rojo esperado» de tasks.md), no por import roto ni excepción. Los `it` que nacen verdes son la lista cerrada de tasks.md §«`it` que nacen verdes» (las siete filas `owner` de R2 a R7; ninguna de R1): el commit de test los lleva igual y el reporte usa la frase «nace verde: el dueño ya ve la acción hoy». Cualquier otro `it` nuevo que pase en su commit (1), PARA y avisa.
  - Enmiendas mecánicas (`#199 R22`, `opens the add-reminder route`, y la condicional del helper `form()` de `#199 R7`): siguen verdes antes y después. Van en el commit que dice tasks.md. Cualquier otro `it` viejo que se ponga rojo no se enmienda: PARA y anótalo.
  - UN COMMIT POR PASO como mínimo, test rojo antes que su implementación (C4 de CHECKPOINTS.md): `test(mobile): #216 <resumen> (R<n>)` y luego `feat(mobile): #216 <resumen> (R<n>)`, resumen en inglés. Nunca implementación y test en el mismo commit, ni un commit para varios R-ids. El refactor, si lo hay, va en `refactor(mobile): #216 … (R<n>)`.
  - Commits: `git add` con rutas explícitas, solo los ficheros del paso. Nunca `git add -A` ni `commit -a`. El móvil no tiene prettier: no lo ejecutes.
  - Cada cadena termina en su línea `git commit -m`. Las cabeceras de sección van como comentario de shell (`# -- R1 test --`).
  - Commit final: traceability.md con los hashes y tu reporte, en UN commit `docs(mobile): #216 traceability and implementation report` tras el último verde. No mezcles ficheros de arnés en los commits TDD. No rebasees tras rellenarlo.
  - Cuenta de commits al cierre: `git log --oneline da0cfbdd..HEAD` da, de abajo arriba, el del handoff, los 14 de la cadena (7 `test` + 7 `feat`, más los `refactor` que haya) y el final. Cualquier otro, PARA.
  - Jest de un fichero: `cd /home/claude/sites/Pet-Tracker-wt-216/mobile-pet-tracker && bunx jest --runTestsByPath '<ruta>' --testTimeout=30000`, solo con `pgrep -f '[n]ode_modules/(.bin/jest|jest-worker)'` y `pgrep -f '[i]nit.sh'` vacíos, cada uno por separado (otros worktrees corren jest en esta máquina: si no están vacíos, espera y vuelve a mirar; nunca esperes e `init.sh` en el mismo comando). El posicional sin `--runTestsByPath` es regex y sale 0 sin correr nada. Los comandos con `-t "#216 R<n>"` de tasks.md se corren igual, con `--runTestsByPath`. Un timeout aislado se mide sin flag antes de tocar nada.
  - Tipos: antes de cada `bunx tsc --noEmit`, ejecuta `test ! -e .expo/types/router.d.ts` desde mobile-pet-tracker/. Si existe, PARA. Nunca `rm -f`.
  - Lint, siempre con `--no-cache` y redirect al log, sin pipe: `cd /home/claude/sites/Pet-Tracker-wt-216/mobile-pet-tracker && bunx expo lint --no-cache > ../progress/lint-216.log 2>&1 && test ! -s ../progress/lint-216.log && echo LINT_OK`. `expo lint` puede morir por memoria con exit 0: por eso `test ! -s`. (tasks.md dice `/tmp/lint-216.log`: usa esta ruta en su lugar.)
  - `react-hooks/purity` veta `Date.now()` y `new Date()` sin argumento en render: esta feature no los necesita.
  - No crear recursos AWS reales ni correr cdk deploy.
  - NO son tuyos: progress/history.md, progress/current.md, STATUS.md y el campo `status` de feature_list.json. Tu sitio para contarlo todo es progress/impl_mobile-role-aware-actions.md.
  - No abras la PR ni la edites. No hagas push.
  - Si el sandbox te deniega un comando, PARA y repórtalo. No lo sustituyas por otro que haga lo mismo.
  - Un error de invocación (ENOENT sobre una ruta, `command not found` antes de que arranque jest, tsc o eslint, sin ficheros tocados) se corrige y se anota en el reporte. Solo PARA si falla el código, una cifra de esta lista o una guarda.
  - Si una cifra o ancla no coincide, PARA y reporta. La spec se reescribe; el código no se adapta.
  - Flakes de carga conocidos: si un rojo de la suite completa es una suite que no tocaste y pasa sola, es carga: córrela aislada, anota el rojo y el verde aislado y sigue. Conocidos: `#199 R18` (timeouts, Peso), Nutrición `#200 R9`/`#200 R10` (`screens/food`), Salud `#168 R2`, Perfil `#173 R5`. En tus ficheros: Inicio `#152 R8` (batería 0 % vs 12 %) y `#190 R5` (PingoFloat, translateY -10 → 0) de src/screens/home/index.test.tsx: rojo en la corrida del fichero entero y verde aislado (`-t`) se anota y se sigue; rojo aislado, PARA. Cualquier otro rojo de tu alcance o de una guarda, PARA.

Anclas de la base (T0) y de llegada. Corre cada una tal cual antes del primer test, desde /home/claude/sites/Pet-Tracker-wt-216/mobile-pet-tracker, y pega la salida en el reporte. La base la midió el leader en da0cfbdd: todas coinciden con la cifra «base», sin ninguna discrepancia. Ante cualquier diferencia con la base, PARA. Al cierre, las mismas dan la cifra «después» (la de requirements.md R1–R7).
  # -- Peso (R1) --
  grep -cF -- "isOwner" src/screens/weight-log/index.tsx   # 0 → 2
  grep -cF -- "const isOwner = pet.data?.kind === 'ok' && pet.data.pet.myRole === 'owner';" src/screens/weight-log/index.tsx   # 0 → 1
  grep -cF -- "queryKey: petKeys.detail(petId)," src/screens/weight-log/index.tsx   # 0 → 1
  grep -cF -- "{isOwner ? (" src/screens/weight-log/index.tsx   # 0 → 1
  grep -cF -- "signOut(" src/screens/weight-log/index.tsx   # 1 → 1
  grep -cF -- "<RiseIn delayMs={80}>" src/screens/weight-log/index.tsx   # 1 → 1
  # -- Inicio (R2, R3) --
  grep -cF -- "isOwner" src/screens/home/index.tsx   # 0 → 3
  grep -cF -- "const isOwner = petList.find(({ id }) => id === selectedPetId)?.myRole === 'owner';" src/screens/home/index.tsx   # 0 → 1
  grep -cF -- "testID === 'quick-action-reminder' && !isOwner" src/screens/home/index.tsx   # 0 → 1
  grep -cF -- "testID: 'quick-action-" src/screens/home/index.tsx   # 3 → 3
  grep -cF -- "{QUICK_ACTIONS.map(" src/screens/home/index.tsx   # 1 → 1
  grep -cF -- "<Icon size={26} color={quickActionInks[index]} />" src/screens/home/index.tsx   # 1 → 1
  grep -cF -- "{detail.data.pet.device === null && isOwner ? (" src/screens/home/index.tsx   # 0 → 1
  grep -cF -- "{detail.data.pet.device === null ? (" src/screens/home/index.tsx   # 1 → 0
  grep -cF -- 'testID="collar-pair-link"' src/screens/home/index.tsx   # 1 → 1
  # -- Recordatorios (R4, R5) --
  grep -cF -- "isOwner" src/screens/reminders/index.tsx   # 0 → 4
  grep -cF -- "const isOwner = pets.data?.kind === 'ok' && pets.data.pets.find(({ id }) => id === selectedPetId)?.myRole === 'owner';" src/screens/reminders/index.tsx   # 0 → 1
  grep -cF -- "accessory={isOwner ? (" src/screens/reminders/index.tsx   # 0 → 1
  grep -cF -- "action={isOwner ? { label: t('reminders.new'), onPress: () => router.push('/add-reminder' as Href) } : undefined}" src/screens/reminders/index.tsx   # 0 → 1
  grep -cF -- "action={{ label: t('reminders.new'), onPress: () => router.push('/add-reminder' as Href) }}" src/screens/reminders/index.tsx   # 1 → 0
  grep -cF -- 'reminder-cancel-series-${reminder.id}' src/screens/reminders/index.tsx   # 1 → 1
  grep -cF -- 'reminder-delete-${reminder.id}' src/screens/reminders/index.tsx   # 1 → 1
  # -- Vincular collar (R6, R7) --
  grep -cF -- "isOwner" src/screens/pairing/index.tsx   # 0 → 3
  grep -cF -- "const isOwner = selectedPet?.myRole === 'owner';" src/screens/pairing/index.tsx   # 0 → 1
  grep -cF -- 'testID="pairing-owner-only"' src/screens/pairing/index.tsx   # 0 → 1
  grep -cF -- 'testID="pairing-submit"' src/screens/pairing/index.tsx   # 1 → 1
  grep -cF -- "t('pairing.errorForbiddenClaim')" src/screens/pairing/index.tsx   # 1 → 2
  grep -cF -- "{phase === 'idle' && selectedPet?.device === null ? (" src/screens/pairing/index.tsx   # 2 → 2
  grep -cF -- 'testID="device-unpair"' src/screens/pairing/index.tsx   # 1 → 1
  grep -cF -- 'testID="device-unpair-spacer"' src/screens/pairing/index.tsx   # 1 → 1
  # -- Copy (R6) --
  grep -cF -- "key: 'pairing.errorForbiddenClaim'" src/__tests__/ui-copy-table.ts   # 1 → 2
  grep -cF -- "key: 'pairing.errorForbiddenClaim' }, // #216 R6" src/__tests__/ui-copy-table.ts   # 0 → 1
  grep -cF -- "42 + 2 + 1 + 4 - 1 + 1); //" src/__tests__/ui-language.test.ts   # 1 → 0
  grep -cF -- "42 + 2 + 1 + 4 - 1 + 1 + 1); //" src/__tests__/ui-language.test.ts   # 0 → 1
  grep -cF -- "+2 filas Lead y Body; +1 #216 R6: la nota de solo lectura" src/__tests__/ui-language.test.ts   # 0 → 1
  grep -cF -- "it('resuelve las ocurrencias normativas y el delta de conectividad (enmendado por #216 R6)'" src/__tests__/ui-language.test.ts   # 0 → 1
  # -- Comentarios de la feature --
  grep -cF -- "#216" src/screens/weight-log/index.tsx src/screens/home/index.tsx src/screens/reminders/index.tsx src/screens/pairing/index.tsx   # 0 → 0 en los cuatro
  grep -cF -- "#216" src/screens/weight-log/index.test.tsx src/screens/home/index.test.tsx src/screens/reminders/index.test.tsx src/screens/pairing/index.test.tsx src/__tests__/ui-copy-table.ts src/__tests__/ui-language.test.ts   # 0 → >0 en los seis (solo `#216 R<n>`, lo comprueba el grep -noE de la verificación final)

Sondas (una por R, en producción, vista en rojo y revertida; anota en el reporte la mutación, el `it` que cae y la salida):
  - R1: cambia `myRole === 'owner'` por `myRole !== 'vet'` en la declaración de `isOwner` de Peso. Rojo: las filas `family` y `walker` del `it.each` de `#216 R1`.
  - R2: quita `&& !isOwner` de la condición del tile. Rojo: las filas `family`, `walker` y `vet` de `#216 R2`.
  - R3: quita `&& isOwner` de la condición de `collar-pair-link`. Rojo: las filas `family`, `walker` y `vet` de `#216 R3`.
  - R4: deja `accessory` sin condición y la acción del vacío como antes. Rojo: las filas `family`, `walker` y `vet` de los dos `it.each` y el `it` del cambio de mascota de `#216 R4`.
  - R5: saca el `Button` de la fila de `{isOwner ? (`. Rojo: las filas `family`, `walker` y `vet` de `#216 R5`.
  - R6: invierte las dos ramas del ternario (`isOwner ? (<Text …/>) : (<View …>)`). Rojo: las cuatro filas de `#216 R6`.
  - R7: saca `device-unpair-spacer` y `device-unpair` del fragmento condicional. Rojo: las filas `family`, `walker` y `vet` de `#216 R7`.

Verificación final: la de tasks.md §«Verificación final», tal cual, salvo el lint (la ruta de arriba). Después, todas las anclas de arriba con su cifra «después», traceability.md con el `it` y los dos hashes (rojo y verde) de cada R, y el reporte.

Reporte: progress/impl_mobile-role-aware-actions.md. Primera línea `Estado: COMPLETO` o `Estado: DETENIDO en R<n> (<paso>)`, con la causa. Incluye: salida del primer comando, anclas T0 y de llegada, cada commit con su corrida (`Tests:` y exit), las filas que nacen verdes con su frase, las sondas, las enmiendas aplicadas (y si se aplicó la condicional de `#199 R7`), los flakes vistos, las skills, el lint, el tsc, la suite de guardas, el grep -noE y la cuenta de commits. Al terminar (completo o detenido), escribe una línea con la fecha UTC y el estado en progress/impl_mobile-role-aware-actions.done (git lo ignora) como última acción.

## Smoke del humano

Va en el reporte, tal cual; el humano lo corre en dispositivo (lote G4 de `progress/smoke_mejoras-producto.md`). Tú no lo corres:
  - Con una cuenta familiar (no dueña) de una mascota:
    - Peso: se ven la gráfica y el historial, no el formulario;
    - Inicio: no hay tile «Recordatorio» y, sin collar, la tarjeta del collar no tiene el enlace para vincularlo (la tarjeta y su estado sí);
    - Recordatorios: no hay «Nuevo» ni en la cabecera ni en el vacío, y ninguna fila tiene borrar ni cancelar serie;
    - Vincular collar: sin collar, sale la nota «Solo el dueño puede vincular un collar.» en lugar del formulario; con collar, no hay «Desvincular».
  - Con la cuenta dueña: todo lo anterior sigue igual que hoy.
  - Cambiar de una mascota propia a una ajena y volver: las acciones desaparecen y vuelven.

## Adenda 1 (leader, 2026-10-27, tras el merge de `dev` con #212 y #214)

Esta adenda manda sobre el texto de arriba donde lo contradiga.

- Implementador: el subagente `implementer`, no Codex. La cuota semanal de Codex está al 3 % (se renueva el
  2 de noviembre a las 14:37); el fallback está declarado en `progress/current.md`. Las reglas de arriba valen
  igual. Las skills son las de Claude Code (`expo:expo-overview` y las que nombra la carta), no el catálogo de
  Codex. La regla «NO lances ./init.sh» sigue en pie, y no uses Monitor: espera a jest con `pgrep` como dice la
  regla de «Jest de un fichero».
- H0 nuevo: `abdd87c8`, el merge de `origin/dev` (`fe624698`, con #212 y #214) sobre el commit del handoff. El
  leader ya corrió `bun install --frozen-lockfile` (entró `expo-clipboard`). No hagas `git fetch`, `git merge`,
  `git rebase` ni `bun install`.
- Primer comando (línea 3): el mismo. Los dos commits de `git log --oneline -2` son ahora, de arriba abajo, el de
  esta adenda (`docs(progress): #216 handoff addendum 1 after the dev merge`) y `abdd87c8`.
- Cuenta de commits al cierre (sustituye a la de arriba): `git log --oneline abdd87c8..HEAD` da, de abajo arriba,
  el de esta adenda, los 14 de la cadena (7 `test` + 7 `feat`, más los `refactor` que haya) y el final. Cualquier
  otro, PARA.
- El diff final se mide desde `abdd87c8`: `git diff --name-only abdd87c8..HEAD` es la lista cerrada de ficheros
  de arriba más `progress/impl_mobile-role-aware-actions.md` y `specs/mobile-role-aware-actions/traceability.md`,
  ni uno más.
- Anclas T0: el leader las midió de nuevo en `abdd87c8` y todas coinciden con la cifra «base», sin ninguna
  discrepancia. Tú las corres igual antes del primer test.
- Lo que trajo el merge en tus ficheros, y por qué no cambia nada:
  - `src/screens/home/index.tsx` y su test: #214 R7 añade `home-join-pet` («Unirme con código») a la rama sin
    mascotas. R2 y R3 tocan la rama con mascota (el `map` de `QUICK_ACTIONS` y `collar-pair-link`): no se cruzan.
  - `src/__tests__/ui-copy-table.ts`: filas nuevas en `R5_HEALTH`, `R6_FOOD` y la tabla nueva `R21_PET_MEMBERS`.
    `R10_PAIRING` no cambia; tu fila `// #216 R6` va en `R10_PAIRING` como dice la spec.
  - `src/__tests__/ui-language.test.ts`: enmiendas de #222 R8 y #214 R22 en otros `it`. El de `#65 R10` sigue
    con `42 + 2 + 1 + 4 - 1 + 1); //` (ancla 1): la cifra de llegada de R6 no cambia.
- Flakes de carga: a los conocidos de arriba se suma Perfil `#173 R5`. Mismo trato: rojo en la suite completa y
  verde aislado se anota y se sigue.
- Devuélvele al leader solo la ruta del reporte y la línea `Estado:`. El contenido vive en el reporte.
