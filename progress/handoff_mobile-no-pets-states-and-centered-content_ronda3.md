Worktree: /home/claude/sites/Pet-Tracker-wt-181

Primera acción: confirma `pwd` (debe ser esa ruta), `git branch --show-current` (debe ser `feature/181-mobile-no-pets-states-and-centered-content`) y `git status --short` (debe salir vacío). Si algo no coincide, PARA y repórtalo.

PROHIBIDO: `./init.sh` y la suite de backend e infraestructura. Postgres y LocalStack son compartidos con otra sesión. Las corridas completas de jest de mobile se permiten solo en el punto B1, con el límite que se indica allí. El leader correrá `./init.sh` después de tu último commit. Nada que cree recursos AWS ni cueste dinero. No uses `git stash`. No abras ni edites PRs. No toques otros worktrees ni otras ramas.

Feature: #181 mobile-no-pets-states-and-centered-content. Esta es la ronda 3. La ronda 2 (`progress/handoff_mobile-no-pets-states-and-centered-content_ronda2.md`) fue RECHAZADA en 39369bf3 por B-1 (B1 sin resolver), B-2 (R8 sin commits versionados por mutación) y B-3 (fila de smoke en traceability, ya retirada en b8936eee). Esta ronda cierra B1 con la opción 5B y B-2 con tres pares de commits. Antes de empezar, lee en ese fichero las secciones «B1: diagnóstico de la caída de Perfil» (lo descartado por lectura y la instrumentación) y «Mutaciones (R8 y R10)» (las reglas de cada mutación de R10).

Spec aprobada: `specs/mobile-no-pets-states-and-centered-content/requirements.md` (status approved; firma de la enmienda R8 en d3fab6ed). No la toques. Lee §2 R8 y R10, §3, la sección «Enmienda R8 (vía de verificación)» del final del fichero, y en `tasks.md` la sección R8.

## Base y ficheros

- HANDOFF = hash del commit que añade este handoff: `git log -1 --format=%H -- progress/handoff_mobile-no-pets-states-and-centered-content_ronda3.md`. Tus cambios son los que salen de `git diff --name-only HANDOFF..HEAD` y de `git ls-files --others --exclude-standard`. Si hay algo fuera de la lista de abajo, PARA.
- Puedes tocar solo esto:
  - `mobile-pet-tracker/src/screens/profile/index.tsx`: para R8-M1 a R8-M3, en pares versionados (ver R8), y para las mutaciones temporales de R10 que pasan por Perfil (se revierten con `git checkout HEAD -- <ruta>`).
  - Producción temporal para R10: `mobile-pet-tracker/src/screens/home/index.tsx`, `mobile-pet-tracker/src/screens/reminders/index.tsx` y `mobile-pet-tracker/src/hooks/use-pet-selection.ts`.
  - Tests: `mobile-pet-tracker/src/screens/profile/index.test.tsx`, solo para B1.
  - En la raíz del repo: `specs/mobile-no-pets-states-and-centered-content/traceability.md` y `progress/impl_mobile-no-pets-states-and-centered-content.md` (reescríbelo entero).
- `mobile-pet-tracker/src/__tests__/no-pets-states.test.ts` no se toca: sus `it` de R8 ya existen y están verdes.
- No toques: `progress/history.md`, `progress/current.md`, `progress/review_*`, `STATUS.md`, `feature_list.json`, `docs/`, `specs/` (salvo traceability), `mobile-pet-tracker/src/components/empty-state.tsx`, `mobile-pet-tracker/src/i18n/catalog.ts`, `mobile-pet-tracker/src/app/(tabs)/map.tsx`, `mobile-pet-tracker/src/screens/map/` y `backend-pet-tracker/`. La casilla A20 de `docs/conventions.md` la marca el humano.
- Dependencias: `mobile-pet-tracker/node_modules` ya está instalado. No instales nada. Si crees que hace falta una dependencia, PARA.

## Reglas críticas

- Cada comando empieza con `cd` a su ruta absoluta. Jest se corre desde `/home/claude/sites/Pet-Tracker-wt-181/mobile-pet-tracker`. Usa `bun`, nunca `npx` ni `npm`. Mobile no tiene prettier.
- Ficheros concretos: `bunx jest --runTestsByPath 'src/…'`, con comillas simples y la ruta literal. Con `--runTestsByPath` **no** se escapan los paréntesis de `(tabs)`. Solo los patrones posicionales (regex) necesitan escapar.
- Cuenta de suites: en cada corrida con `--runTestsByPath`, la línea `Test Suites:` debe igualar el número de ficheros pasados. Si no, algún fichero no se ejecutó: PARA y repórtalo.
- RNTL 14: `await` en `render`, `fireEvent` y `act`. Las esperas van con `waitFor` o `findBy…`, nunca con `advanceTimersByTime` suelto.
- Commits: `git add <ruta>` explícito. Nunca `git add -A` ni `commit -a`. Mensajes: `test(mobile): <desc> (R<n>)` para pruebas y mutaciones, `docs(mobile-no-pets-states-and-centered-content): <desc>` para documentación. Sin trailers. Si un hook de pre-commit bloquea un commit, PARA y repórtalo; no uses `--no-verify`.
- Antes de plantar cada mutación y antes de cada commit, `git diff --quiet && git diff --cached --quiet` debe pasar (salvo lo que acabas de añadir con `git add`).
- Corridas completas de mobile: antes de cada una, `pgrep -fl '[j]est'` debe salir vacío. Si sale algo ajeno, espera 60 s y repite, como mucho tres veces; luego PARA. Usa la misma orden de jest que `init.sh` para mobile (léela en `init.sh`; no ejecutes `init.sh`), con un `--cacheDirectory` nuevo por corrida (`/tmp/181-jc-<n>`, con n = 1 a 4), y guarda la salida con `> /tmp/181-full-<n>.log 2>&1; echo EXIT=$?` (sin pipes).
- Una prueba que cae por timeout y no por aserción es ruido de carga: anótalo, repite la orden y no lo cuentes como B1.
- Si una mutación no hace caer el `it` esperado, PARA con esa mutación. No ajustes ni la mutación ni el test para que caiga.
- Si el sandbox te deniega un comando, PARA y repórtalo. No lo sustituyas por otro que haga lo mismo.
- Typecheck: `cd /home/claude/sites/Pet-Tracker-wt-181/mobile-pet-tracker && test ! -e .expo/types/router.d.ts && bun run typecheck`. Si el fichero existe, PARA. Nunca `rm -f`.
- Lint: `cd /home/claude/sites/Pet-Tracker-wt-181/mobile-pet-tracker && bunx expo lint --no-cache > /tmp/181-lint-r3.txt 2>&1; ! grep -qF 'Failed to run' /tmp/181-lint-r3.txt && test ! -s /tmp/181-lint-r3.txt`. Salida vacía significa verde. Si sale `Failed to run` (SIGKILL por memoria), espera 60 s y repite, como mucho tres veces; a la tercera, PARA.

## Skills

Esta ronda cambia solo tests, mutaciones temporales y documentación: no crea ni rediseña ninguna pantalla. **No cargues ninguna skill de expo: no hay ninguna para esto.** Dilo en el informe. La carta `docs/ui-guidelines.md` sigue siendo el gate de C8 para el reviewer.

## B1: caída de Perfil en la corrida completa (opción 5B)

Estado: la ronda 2 no lo resolvió. Aislado, `src/screens/profile/index.test.tsx` pasa 138/138. En la corrida completa cae a veces con `TypeError: Cannot read properties of undefined (reading 'canceled')` en `handleChangePhoto` (`picked.canceled`).

Hipótesis de trabajo: las seis llamadas `fireEvent.press` sin `await` de ese fichero dejan el render o el manejador sin esperar, y el efecto llega dentro de la prueba siguiente. Ya pasó en #95 R3 (enmienda E1 de `specs/mobile-sign-out-lands-on-welcome/requirements.md`). Las seis llamadas, por contenido: `fireEvent.press(screen.getByTestId('reminders-link'))`, `fireEvent.press(screen.getByTestId('profile-sign-out'))`, `fireEvent.press(screen.getByTestId('pet-chip-pet-2'))`, `fireEvent.press(screen.getByTestId('documents-link'))`, `fireEvent.press(action);` y `fireEvent.press(toggle);`.

Procedimiento, en este orden:
1. Reproducción determinista, sin cambiar nada. Busca una orden que caiga siempre: el fichero solo, `--runInBand` con combinaciones de ficheros, o la corrida completa con cache nuevo. Una orden que cae a veces no es reproducción. Si no la encuentras con el límite de corridas, no apliques el arreglo: B1 pasa al punto 4 y el resto de la ronda sigue.
2. Con la orden determinista en rojo, aplica `await` a las seis llamadas. Sin debilitar aserciones, sin `it.skip`, sin reintentos y sin un `mockResolvedValue` que oculte el origen. Corre la misma orden: debe pasar.
3. Commit solo si cae antes y pasa después con la misma orden. Mensaje: `test(mobile): espera con await las pulsaciones de Perfil (R7)`, con solo ese fichero.
4. Si no hay reproducción determinista, no commitees nada de B1. Deja en el informe la hipótesis, la instrumentación, la orden probada y cada corrida con EXIT, `Test Suites`, `Tests` y fallos. B1 queda no resuelto.
5. Si la causa resulta estar en `src/screens/profile/index.tsx`, no la cambies: PARA con B1 y reporta fichero, línea (por contenido) y causa.

Antes de aplicar cualquier arreglo, revierte tu instrumentación: `git checkout HEAD -- mobile-pet-tracker/src/screens/profile/index.test.tsx` y comprueba `git diff --quiet`. Instrumenta el test, no el componente.

Límite: como máximo tres corridas completas de mobile para diagnóstico, y una más tras el arreglo de B1 (solo si hay commit de B1). Si cae `#114 R5` o `#173 R5` en tus corridas, di en el informe si tienen la misma causa o si no se comprobó.

## R8: tres pares de mutación (vía (b) de C4)

La vía está declarada en la enmienda R8 de `requirements.md`. Los tres `it` de R8 ya existen en el describe `#181 R8: candados agregados y de catálogo` de `src/__tests__/no-pets-states.test.ts` (R8.1, R8.2 y R8.3) y están verdes en HEAD. No los cambies.

Cada par son dos commits: uno rojo, con la mutación versionada en `mobile-pet-tracker/src/screens/profile/index.tsx` y su `it` en rojo por aserción; y uno verde, con la mutación revertida. Mismo patrón que el precedente de otra feature, 1586d071 (rojo) y 6c170da8 (verde).

Mutaciones, con anclas por contenido en Perfil:
- R8-M1: en el `EmptyState` con `testID="profile-pets-empty"`, `body={t('common.noPetsBody')}` pasa a `body={t('common.noPetsYet')}`. Debe caer R8.1.
- R8-M2: el `<EmptyState … />` con `testID="profile-pets-empty"` se sustituye por `null` (expresión JS dentro del paréntesis de su rama; `{null}` no es válido ahí). Deben caer R8.1 y R8.2.
- R8-M3: se añade el comentario `// #181 E4` en una línea de Perfil (por ejemplo, encima del `EmptyState`). Debe caer R8.3; design-drift también puede caer: anótalo.

Pasos por par (k = 1, 2, 3):
1. Precondición: `git diff --quiet && git diff --cached --quiet`, y `bunx jest --runTestsByPath 'src/__tests__/no-pets-states.test.ts'` en verde. Anota `B_k = git rev-parse HEAD`.
2. Planta R8-Mk a mano.
3. Corre `bunx jest --runTestsByPath 'src/__tests__/no-pets-states.test.ts'`; en R8-M3 añade `'src/__tests__/design-drift.test.ts'` a la misma orden. Confirma que el `it` esperado cae por aserción y anota el nombre completo y el fichero de cada `it` que cae.
4. Commit rojo: `git add mobile-pet-tracker/src/screens/profile/index.tsx` y `git commit -m "test(mobile): candado R8-Mk en Perfil, mutación versionada en rojo (R8)"`. Solo esa mutación en el commit.
5. Revierte a la versión de B_k: `git checkout B_k -- mobile-pet-tracker/src/screens/profile/index.tsx`. Comprueba que `git diff --quiet` pasa y que `git diff --cached --quiet` falla (la vuelta está en el índice).
6. Corre la misma orden: los `it` de R8 deben pasar.
7. Commit verde: `git commit -m "test(mobile): candado R8-Mk en Perfil, mutación revertida en verde (R8)"`. Comprueba que `git diff --quiet B_k HEAD -- mobile-pet-tracker/src/screens/profile/index.tsx` sale 0.

Al cerrar los tres pares, `git status --short` debe salir vacío.

## R10: mutaciones temporales (P1)

La ronda 2 midió X1 a X12 (X5 equivalente, no plantada) en la sección «Mutaciones (R8 y R10)» de su handoff, con las notas de X1 (S3 debe seguir verde), X2 (dónde está la guarda), X4 a X8 (cada una por su escenario) y X5 (no se planta). Aplica esa misma sección y esas notas.

- Si hay commit de B1, re-mide R10 completa sobre el árbol de ese commit: el fichero de test de Perfil cambia y las mutaciones que lo usan pueden cambiar de resultado.
- Si no hay commit de B1, la tabla de la ronda 2 vale: cítala en el informe por el hash del commit que la midió (`39369bf3` o el anterior que midió el mismo árbol de producción y tests) y no la repitas.
- Las mediciones usan los ficheros de referencia de esa sección, no la corrida completa; no cuentan para el límite de corridas.

## Commits de esta ronda, en este orden

1. (Solo si B1 tiene arreglo) `test(mobile): espera con await las pulsaciones de Perfil (R7)`.
2. R8-M1: rojo y verde. R8-M2: rojo y verde. R8-M3: rojo y verde.
3. `docs(mobile-no-pets-states-and-centered-content): registra la ronda 3 (B1, R8, R10)`, con el informe y `specs/mobile-no-pets-states-and-centered-content/traceability.md`. En traceability:
   - R8.1 a R8.3: hash del rojo y del verde de cada par.
   - B1: hash de su commit, o «sin arreglo: diagnóstico en el informe».
   - R10: la tabla medida, con el hash del árbol medido.
   - Ninguna fila «pendiente» ni «este commit» (C5). No hay fila de smoke: se retiró en b8936eee y no se vuelve a añadir.

## Criterios de aceptación

- B1: resuelto con reproducción determinista roja antes y verde después (con commit), o no resuelto con diagnóstico completo. En ambos casos, reportado.
- R8: tres pares en el orden indicado; cada rojo cae por aserción en el `it` esperado; cada verde deja `git diff --quiet B_k HEAD -- mobile-pet-tracker/src/screens/profile/index.tsx` en 0.
- R10: X1 a X4 y X6 a X12 medidos sobre el árbol indicado en traceability, con el `it` que cae; X1 con S3 verde en las tres pantallas.
- Typecheck y lint verdes sobre el HEAD final. Jest verde en `src/__tests__/no-pets-states.test.ts` y `src/__tests__/design-drift.test.ts`, y en `src/screens/profile/index.test.tsx` si hay commit de B1. Antes del commit del informe, `bunx jest src/__tests__` y registra `Test Suites` y `Tests` (no cuenta como corrida completa).

## Informe

Escribe `progress/impl_mobile-no-pets-states-and-centered-content.md` entero, con:
1. Commits de esta ronda: hash y mensaje de cada uno, y el `B_k` de cada par.
2. B1: hipótesis, instrumentación añadida y revertida, orden determinista (si la hay), resultado de cada corrida completa (EXIT, `Test Suites`, `Tests`, fallos) y causa o «no resuelto».
3. R8: cada par, con el nombre completo de cada `it` que cae y su fichero.
4. R10: tabla por mutación con el `it` que cae (nombre completo y fichero) y el hash del árbol medido. X5 consta como equivalente. Nota de la ubicación de la guarda de X2.
5. Recuento de `it` añadidos en cada commit (líneas `+` con `it(` en `git show`) y total de `src/__tests__/no-pets-states.test.ts`. Los pares no añaden `it`.
6. Skills: di cuáles cargaste. Lo esperado es ninguna.
7. Typecheck, lint y jest por ficheros (`bunx jest --runTestsByPath` con los ficheros tocados, con su línea `Test Suites:`).
8. Desviaciones y lo no verificado.

## Al terminar

Escribe el informe, haz el commit de la documentación y devuelve al leader solo la ruta del informe y el hash de ese último commit. Si PARASTE en algún punto, el informe dice en cuál y por qué. Un B1 no resuelto no bloquea los pares de R8: si B1 se para, el resto de la ronda sigue.
