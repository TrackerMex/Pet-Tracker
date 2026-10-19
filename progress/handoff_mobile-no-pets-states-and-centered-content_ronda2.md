Worktree: /home/claude/sites/Pet-Tracker-wt-181

Primera acción: confirma `pwd` (debe ser esa ruta), `git branch --show-current` (debe ser `feature/181-mobile-no-pets-states-and-centered-content`) y `git status --short` (debe salir vacío). Si algo no coincide, PARA y repórtalo.

PROHIBIDO: `./init.sh` y la suite de backend e infraestructura. Postgres y LocalStack son compartidos con otra sesión. Las corridas completas de jest de mobile se permiten solo en el punto B1, con el límite que se indica allí. El leader correrá `./init.sh` después de tu último commit. Nada que cree recursos AWS ni cueste dinero. No uses `git stash`. No abras ni edites PRs. No toques otros worktrees ni otras ramas.

Feature: #181 mobile-no-pets-states-and-centered-content. Esta es la ronda 2. La ronda 1 (handoff e10cd689, implementación c1 a c13, código en 6d323318) fue RECHAZADA. El veredicto está en `progress/review_mobile-no-pets-states-and-centered-content.md` (commit 73f5585b): léelo entero antes de empezar.

Spec aprobada: `specs/mobile-no-pets-states-and-centered-content/requirements.md` (status approved, firma a64859d8). No la toques. Lee §2 R8, R10 y §3, y R9 solo para ubicar el describe. Las respuestas del humano ya están en la spec; no las reabras.

## Qué hay que cerrar

- B1: en la corrida completa de mobile, 5 pruebas de `src/screens/profile/index.test.tsx` caen con `TypeError: Cannot read properties of undefined (reading 'canceled')` en `handleChangePhoto` de `src/screens/profile/index.tsx` (`picked.canceled`): el picker devuelve undefined. Son tres de «R7: cambiar foto» y dos de «#168 R4 (enmendado por #173 R6)».
- B2: no existe ninguna prueba titulada «#181 R8». C4 exige que cada R<n> tenga al menos una.
- P1: las mutaciones de R10 están incompletas. X1 se midió en la ronda 1 (7 fallos). X2 a X4 y X6 a X12 no se han medido. Todas se miden de nuevo sobre el árbol de esta ronda.

## Base y ficheros

- HANDOFF = hash del commit que añade este handoff: `git log -1 --format=%H -- progress/handoff_mobile-no-pets-states-and-centered-content_ronda2.md`. Tus cambios son los que salen de `git diff --name-only HANDOFF..HEAD` y de `git ls-files --others --exclude-standard`. Si hay algo fuera de la lista de abajo, PARA.
- Las mediciones M1 a M19 (tabla de anclas de la spec) se hicieron en la ronda 1. Están en la sección «M1–M19 antes de c1» de `git show 73f5585b:progress/impl_mobile-no-pets-states-and-centered-content.md`. No las repitas; cítalas por esa referencia.
- Puedes tocar solo esto:
  - Producción, solo para mutaciones temporales que revertirás: `mobile-pet-tracker/src/screens/home/index.tsx`, `mobile-pet-tracker/src/screens/reminders/index.tsx`, `mobile-pet-tracker/src/screens/profile/index.tsx` y `mobile-pet-tracker/src/hooks/use-pet-selection.ts`.
  - Tests: `mobile-pet-tracker/src/screens/profile/index.test.tsx` (solo para B1) y `mobile-pet-tracker/src/__tests__/no-pets-states.test.ts` (R8).
  - En la raíz del repo: `specs/mobile-no-pets-states-and-centered-content/traceability.md` y `progress/impl_mobile-no-pets-states-and-centered-content.md` (reescríbelo entero).
- No toques: `progress/history.md`, `progress/current.md`, `progress/review_*`, `STATUS.md`, `feature_list.json`, `docs/`, `specs/` (salvo traceability), `mobile-pet-tracker/src/components/empty-state.tsx`, `mobile-pet-tracker/src/i18n/catalog.ts`, `mobile-pet-tracker/src/app/(tabs)/map.tsx`, `mobile-pet-tracker/src/screens/map/` y `backend-pet-tracker/`. La casilla A20 de `docs/conventions.md` la marca el humano.
- Dependencias: `mobile-pet-tracker/node_modules` ya está instalado. No instales nada. Si crees que hace falta una dependencia, PARA.

Ficheros de referencia para las mutaciones (rutas desde `mobile-pet-tracker/`):
- `src/hooks/use-pet-selection.test.tsx`
- `src/screens/home/index.test.tsx`
- `src/screens/profile/index.test.tsx`
- `src/screens/reminders/index.test.tsx`
- `src/screens/health/index.test.tsx`
- `src/app/(tabs)/__tests__/food.test.tsx`
- `src/providers/__tests__/selected-pet-provider.test.tsx`
- `src/__tests__/no-pets-states.test.ts`

Además, para R8-M2 `src/components/__tests__/empty-state.test.tsx`, y para R8-M3 `src/__tests__/design-drift.test.ts`. Si una mutación cae en un fichero que no está en esta lista, amplíala y anótalo.

## Reglas críticas

- Cada comando empieza con `cd` a su ruta absoluta. Jest se corre desde `/home/claude/sites/Pet-Tracker-wt-181/mobile-pet-tracker`. Usa `bun`, nunca `npx` ni `npm`. Mobile no tiene prettier.
- Ficheros concretos: `bunx jest --runTestsByPath 'src/…'`, con comillas simples y la ruta literal. Con `--runTestsByPath` **no** se escapan los paréntesis de `(tabs)`. Medido por el leader: `src/app/(tabs)/__tests__/food.test.tsx` sin escapar da PASS con 85 tests; escapado da FAIL con exit 1. Solo los patrones posicionales (regex) necesitan escapar. `--listTests` no comprueba que el fichero exista: no lo uses como verificación.
- Cuenta de suites: en cada corrida con `--runTestsByPath`, la línea `Test Suites:` debe igualar el número de ficheros pasados. Si no, algún fichero no se ejecutó: PARA y repórtalo.
- RNTL 14: `await` en `render`, `fireEvent` y `act`. Las esperas van con `waitFor` o `findBy…`, nunca con `advanceTimersByTime` suelto.
- Commits: `git add <ruta>` explícito. Nunca `git add -A` ni `commit -a`. Mensajes: `test(mobile): <desc> (R<n>)` para pruebas y `docs(mobile-no-pets-states-and-centered-content): <desc>` para documentación. Sin trailers.
- Mutaciones: antes de plantar cada una, `git diff --quiet && git diff --cached --quiet` debe pasar, y la base de cada fichero de referencia debe estar verde sin mutar. Para revertir: `git checkout HEAD -- <ruta>` y después las mismas dos comprobaciones.
- Corridas completas de mobile: antes de cada una, `pgrep -fl '[j]est'` debe salir vacío. Si sale algo ajeno, espera 60 s y repite, como mucho tres veces; luego PARA. Usa la misma orden de jest que `init.sh` para mobile (léela en `init.sh`; no ejecutes `init.sh`), con un `--cacheDirectory` nuevo por corrida (`/tmp/181-jc-<n>`, con n = 1 a 4: tres de diagnóstico y una tras el arreglo), y guarda la salida con `> /tmp/181-full-<n>.log 2>&1; echo EXIT=$?` (sin pipes).
- Las mediciones de mutaciones usan los ficheros de referencia, no la corrida completa; no cuentan para el límite de corridas.
- Si el sandbox te deniega un comando, PARA y repórtalo. No lo sustituyas por otro que haga lo mismo.

## Skills

Esta ronda cambia solo tests y mutaciones temporales: no crea ni rediseña ninguna pantalla. Ninguna de las 13 skills del plugin de Codex encaja con pruebas de jest de pantallas, y `appllama-app-design-skill` solo es obligatoria al diseñar o cambiar una pantalla o un flujo. **No cargues ninguna skill de expo: no hay ninguna para esto.** Dilo en el informe. La carta `docs/ui-guidelines.md` sigue siendo el gate de C8 para el reviewer.

## B1: diagnóstico de la caída de Perfil (antes de cualquier commit)

Hechos medidos:
- Aislado, `src/screens/profile/index.test.tsx` pasa 138/138 en todas las corridas.
- Corridas completas del leader sobre el código de 6d323318 (el mismo de la ronda 1): 1 de 4 con la caída (init.sh EXIT=1), 3 verdes. Sobre H0 44acd74b: 0 de 2 con caída. Resultado no concluyente. No sabemos si la caída es de #181 o preexistente; se trata como de #181 hasta demostrar lo contrario.
- En la primera corrida de c1 (f08797a6) también cayeron, solo en la corrida conjunta, `#114 R5` (en `src/screens/reminders/index.test.tsx`, describe «#114 R5 (revertido por #178 R4)») y `#173 R5` (en `src/screens/profile/index.test.tsx`, describe «#173 R5: cápsula de añadir mascota»). Compruébalas en tu diagnóstico y di en el informe si tienen la misma causa.

Descartado por lectura del leader en la ronda 1. Si la instrumentación lo contradice, repórtalo:
- `mobile-pet-tracker/package.json` no tiene `restoreMocks`, `resetMocks`, `clearMocks` ni `randomize`. No hay `jest.config.*`. El preset `jest-expo` y el de `react-native` tampoco los fijan.
- Jest 29.7 usa `jest-mock` 29.7.0 anidado en `node_modules/jest-runtime/node_modules/jest-mock`, no el de nivel superior (30.4.1). En ese 29.7.0, `restoreAllMocks()` solo restaura espías y `resetAllMocks()` vacía las implementaciones; ninguno de los dos se llama fuera de los `afterEach` y `beforeEach` del fichero. El `afterEach(() => jest.restoreAllMocks())` del describe «#181 R1» va después de las pruebas que caen.
- El fichero no usa `doMock`, `resetModules` ni `isolateModules`.
- El mock del picker es el mismo objeto para el componente y para el test.
- La única llamada que pone a cero el mock del picker es el `mockReset()` del `beforeEach` de nivel superior; es síncrona y va seguida de `mockResolvedValue`.

Hipótesis abiertas. La instrumentación debe confirmar o descartar cada una:
1. Una llamada al picker llega en otro momento del que supone el test, por una promesa o efecto de una prueba anterior que sigue viva (por ejemplo, un `handleChangePhoto` no esperado).
2. Una cola `Once` o un espía de otra prueba deja en el momento de la llamada una implementación distinta de la esperada.
3. Algo que solo cambia con la carga (timers, orden de ejecución dentro del worker) modifica el estado del mock.

Procedimiento:
1. Instrumenta el test, no el componente. En cada llamada al picker registra: el nombre de la prueba (`expect.getState().currentTestName`), si `getMockImplementation()` existe, si el valor que devuelve es `undefined`, y si `ImagePicker.launchImageLibraryAsync === mockLaunchImageLibrary` (la identidad confirma o descarta que otra prueba reasigne la propiedad del namespace). Escribe a un fichero en /tmp.
2. Busca una orden determinista que reproduzca la caída: primero el fichero solo; después combinaciones de ficheros con `--runInBand`; después la corrida completa. Una orden que cae siempre sirve; una que cae a veces no es una reproducción.
3. Antes de aplicar cualquier arreglo, revierte la instrumentación: `git checkout HEAD -- src/screens/profile/index.test.tsx` y comprueba `git diff --quiet`.
4. Si la causa está en código de producción, no lo cambies: PARA y reporta fichero, línea (por contenido) y causa. Hace falta enmienda de la spec.
5. Si la causa está en el test, arréglala sin debilitar aserciones: nada de `it.skip`, de reintentos ni de un `mockResolvedValue` que oculte el origen. Demuéstralo: la orden determinista cae antes del arreglo y pasa después.
6. Si no reproduces la caída de forma determinista, no commitees ningún arreglo. Deja en el informe lo que descartaste, lo que instrumentaste y el resultado de cada corrida, y devuelve B1 como no resuelto.

Límite: como máximo tres corridas completas de mobile para diagnóstico, y una más tras un arreglo.

Commit de B1, solo si hay arreglo de test: `test(mobile): aísla el mock del picker en las pruebas de Perfil (R7)`, con solo ese fichero. Si el arreglo es otro, ajusta la descripción a lo que haga.

## R8: candados agregados (B2)

Ruta A, decidida por el humano (2026-10-18): R8 se prueba con un test titulado «#181 R8» sin tocar la spec. R8 es de verificación (asevera propiedades que dejaron R3 a R5 y R7) y la spec no declara su vía; esa vía queda declarada aquí. Su cierre es la vía (b) de C4: mutación de producción, plantada a mano sobre el árbol verde, registrada en el informe y revertida.

Antes de escribir nada, verifica contra el árbol que R8.1 y R8.2 ya se cumplen. Si algo no cumple, PARA y repórtalo:
- `src/__tests__/ui-language.test.ts`: la expresión `toHaveLength` de la línea con `// #181 R5` (sobre `R7_PROFILE`) termina en `+ 2`, y la de la línea con `// #181 R4` (sobre `R8_REMINDERS`) termina en `+ 3`.
- `src/__tests__/ui-copy-table.ts`: `R7_PROFILE` contiene las filas `common.noPetsBody` y `profile.addPet` de `src/screens/profile/index.tsx`; `R8_REMINDERS` contiene las tres de `src/screens/reminders/index.tsx` (`common.noPetsYet`, `common.noPetsBody`, `profile.addPet`).
- `src/components/__tests__/empty-state.test.tsx`: sin fila `profile-pets-empty`; tabla de recuentos con 9 ficheros, `reminders` 2 y `profile` 1.

Describe nuevo en `src/__tests__/no-pets-states.test.ts`, después del describe de «#181 R9»: `describe('#181 R8: candados agregados y de catálogo', …)`, con tres `it`:

- `it('#181 R8.1: …')`. Importa `R7_PROFILE` y `R8_REMINDERS` de `./ui-copy-table`, como hace `ui-language.test.ts`.
  (a) `toContainEqual` con las filas `{ file, key }` que la spec pide: en `R7_PROFILE`, `common.noPetsBody` y `profile.addPet` de `src/screens/profile/index.tsx`; en `R8_REMINDERS`, `common.noPetsYet`, `common.noPetsBody` y `profile.addPet` de `src/screens/reminders/index.tsx`. Las filas solo tienen `file` y `key`; los comentarios no cuentan.
  (b) Lee los fuentes de Perfil y de Recordatorios con `readFileSync(join(process.cwd(), 'src', 'screens', …), 'utf8')`, como hace el test de R9, y comprueba por regex en cada uno: `/title=\{t\('common\.noPetsYet'\)\}/`, `/body=\{t\('common\.noPetsBody'\)\}/` y `/label: t\('profile\.addPet'\)/`. Cada una debe casar en los dos ficheros.
- `it('#181 R8.2: …')`. Cuenta `/<EmptyState\b/g` en los fuentes: Perfil debe dar 1 y Recordatorios 2.
- `it('#181 R8.3: …')`. En los fuentes de Inicio, Recordatorios y Perfil no debe casar ninguna de estas: `/#\d+\b(?!\s+R\d)/` (el `\b` evita que `#15` case dentro de `#155`), `/text-accent(?![-\w])/` (el mismo criterio que `design-drift.test.ts` y `legibility-classnames.test.ts`: `text-accent-strong` y `text-accent-foreground` no cuentan), `/\bStyleSheet\b/` y `/\w-\[[^\]]*\]/`. El leader midió cero positivos sobre el árbol. Si aparece alguno, PARA y repórtalo con la línea por contenido; no aflojes la regex.

Cada `it` debe estar en verde sobre el árbol antes de mutar. Corre `bunx jest --runTestsByPath 'src/__tests__/no-pets-states.test.ts'`.

Commit de R8: `test(mobile): exige los candados agregados de R8 (R8)`, con solo `src/__tests__/no-pets-states.test.ts`.

## Mutaciones (R8 y R10)

Se miden sobre el árbol de HEAD después de los commits de esta ronda. Para cada mutación: plántala a mano, corre los ficheros de referencia, anota cada `it` que cae (nombre completo y fichero) y revierte con las dos comprobaciones. Las anclas son el contenido, no el número de línea.

Mutaciones de R8 (definidas en este handoff; no están en la tabla de R10):
- R8-M1: en Perfil, cambia `common.noPetsBody` por `common.noPetsYet` en el `body` del `EmptyState` (`body={t('common.noPetsBody')}`). Debe caer R8.1.
- R8-M2: en Perfil, sustituye el `<EmptyState … />` de la rama `petsEmpty ? ( … ) : null` por `null` (expresión JS dentro del paréntesis de la rama; `{null}` no es válido ahí). Debe caer R8.2.
- R8-M3: en Perfil, añade un comentario `// #181 E4`. Debe caer R8.3; design-drift también puede caer: anótalo.

Mutaciones de R10 (tabla de §2 R10 de la spec, con las anclas de contenido del código de la ronda 1):

| id | Mutación | Debe ponerse rojo |
|---|---|---|
| X1 | hook: quitar la línea `if (selectedPetId !== null) clearPet();` de la rama `pets.data.pets.length === 0` | R2.2 (hook), R1 S1 de las tres pantallas, R6 |
| X2 | hook: quitar la guarda `if (pets.isRefreshing) return;` | R2.3 con revalidación |
| X3 | hook: en `if (pets.data?.kind !== 'ok') return;`, limpiar antes del retorno: `if (selectedPetId !== null) clearPet();` | R2.3 por cada `kind` |
| X4 | Inicio: quitar `selectedPetId !== null && ` de la condición de `pet-hero-error` | R1 S4 de Inicio (lista `unreachable`) |
| X5 | Recordatorios: quitar `!petsEmpty && ` de la condición de `reminders-error` | ninguno: mutante equivalente, no se planta |
| X6 | Recordatorios: quitar `selectedPetId !== null && ` de la condición de `reminders-error` | R1 S4 de Recordatorios (lista `unreachable`) |
| X7 | Perfil: quitar `&& !petsEmpty` de `petLoading` | R1 S5 de Perfil (esqueletos con detalle pendiente) |
| X8 | Perfil: quitar `selectedPetId !== null && ` de la condición de `profile-pet-error` | R1 S4 de Perfil (lista `unreachable`) |
| X9 | Inicio, y por separado Recordatorios: sacar el `return` anticipado del vacío (el `if (…petsEmpty…) { return (…); }`) y dejar su `EmptyState` dentro del scroll | R3.2 / R4.2 (contenedor y único hijo) |
| X10 | Inicio, y por separado Recordatorios: `justify-center` por `justify-start` en el contenedor `*-no-pets-screen` | R3.2 / R4.2 |
| X11 | Perfil: devolver el `<Text testID="profile-pets-empty">` en lugar del `EmptyState` | R5.1 |
| X12 | Añadir `clearPet()` a una pantalla. Usa la mutación mínima que haga caer R2.4 y anótala | R2.4 (escaneo) |

Notas sobre R10:
- X2: la spec dice «de la rama de limpieza», pero en el código la guarda `isRefreshing` está antes de las ramas y cubre ambas. Planta esa línea tal cual está y anota la diferencia en el informe.
- X1: se planta además donde el candado podría no mirar: en S3 el `clearPet` es inerte y S3 debe seguir verde sin la raíz. Si X1 pone rojo S3, S3 no aísla la red de seguridad: repórtalo, deja X1 sin cerrar y no rehagas S3 en esta ronda.
- X4 a X8 caen cada una por su propio escenario. S2 no aísla `selectedPetId !== null` (lo aísla S4 con la lista `unreachable`), y S3 no aísla `!petsEmpty` (lo aísla S5 con el detalle pendiente). Si una cae por otro escenario, el candado no aísla su caso: anótalo como hallazgo.
- X5 no se planta: el retorno anticipado de R4.2 quita el `ScrollView` cuando `petsEmpty` es verdadero, así que el término quitado nunca se evalúa en falso. Solo consta en el informe.

## Informe

Escribe `progress/impl_mobile-no-pets-states-and-centered-content.md` entero, con:
1. Retracción: la ronda 1 alegó una «excepción explícita del handoff» para no indexar el informe. Esa excepción no existe en el handoff. Este informe se escribe y se commitea.
2. Commits de esta ronda: hash y mensaje de cada uno.
3. B1: hipótesis, instrumentación añadida y revertida, orden determinista (si la hay), resultado de cada corrida completa (EXIT, suites, tests, fallos) y causa o «no resuelto». Incluye si `#114 R5` y `#173 R5` tienen la misma causa o no se comprobó.
4. R8: los tres `it` por nombre completo y su resultado sobre el árbol.
5. Tabla de mutaciones: R8-M1 a R8-M3 y X1 a X12, con el `it` que cae (nombre completo y fichero) y el commit de referencia. X5 consta como equivalente. La nota de X2 sobre la ubicación de la guarda.
6. Recuento de `it` añadidos por cada commit de esta ronda (líneas `+` con `it(` en `git show`) y total de `src/__tests__/no-pets-states.test.ts`.
7. Skills: di cuáles cargaste. Lo esperado es ninguna.
8. Resultados de typecheck, lint y jest por ficheros (`bunx jest --runTestsByPath` con los ficheros tocados, con su línea `Test Suites:`).
9. Las M1 a M19 se citan por su referencia de Base y ficheros, sin repetirlas.
10. Desviaciones y lo no verificado.

Typecheck: `cd /home/claude/sites/Pet-Tracker-wt-181/mobile-pet-tracker && test ! -e .expo/types/router.d.ts && bun run typecheck`. Si el fichero existe, PARA. Nunca `rm -f`.

Lint: `cd /home/claude/sites/Pet-Tracker-wt-181/mobile-pet-tracker && bunx expo lint --no-cache > /tmp/181-lint-r2.txt 2>&1; ! grep -qF 'Failed to run' /tmp/181-lint-r2.txt && test ! -s /tmp/181-lint-r2.txt`. Salida vacía significa verde. Si sale `Failed to run` (SIGKILL por memoria), espera 60 s y repite, como mucho tres veces; a la tercera, PARA.

Guardas: antes del commit del informe, `cd /home/claude/sites/Pet-Tracker-wt-181/mobile-pet-tracker && bunx jest src/__tests__` y registra `Test Suites` y `Tests`. No cuenta como corrida completa.

## Commits de esta ronda, en este orden

1. (Solo si B1 tiene arreglo de test) el commit de B1 descrito arriba.
2. `test(mobile): exige los candados agregados de R8 (R8)`.
3. Mutaciones: sin commits. Cada una se revierte antes de la siguiente.
4. `docs(mobile-no-pets-states-and-centered-content): registra la ronda 2 (R8, R10)`, con el informe y `specs/mobile-no-pets-states-and-centered-content/traceability.md`. En traceability: la fila de R8 (R8.1 a R8.3) con el hash del commit 2; la fila de B1 con el hash del commit 1 o «sin arreglo: diagnóstico en el informe»; la tabla R10 medida sobre el árbol del commit 2; y la fila de c13 con su hash, 6d323318, en lugar de «este commit». La fila de smoke queda «pendiente del humano», como dice la spec.

## Criterios de aceptación

- B1: resuelto con prueba determinista, o no resuelto con diagnóstico completo. En ambos casos, reportado.
- B2: el describe «#181 R8» con sus tres `it`, y cada uno cae por su mutación.
- P1: X1 a X4 y X6 a X12 medidos sobre el árbol de esta ronda, con el `it` que cae; X1 con S3 verde en las tres pantallas.
- Typecheck y lint verdes. Jest verde en los ficheros tocados.

## Al terminar

Escribe el informe y haz el commit de la documentación. Devuelve al leader solo la ruta del informe y el hash de ese último commit. Si PARASTE en algún punto, el informe dice en cuál y por qué.
