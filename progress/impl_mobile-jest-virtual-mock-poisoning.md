# impl: mobile-jest-virtual-mock-poisoning (#207)
Fecha: 2026-10-24
Implementador: subagente `implementer` (Claude Sonnet 5.5) por mandato del leader. H0 = `9abc466e`.

## Estado
Completo A-F + trazabilidad. Rama `feature/207-mobile-jest-virtual-mock-poisoning`, HEAD `b1b8ec8e`. Sin push, sin PR, sin `./init.sh`.

## Precondiciones
- `pwd` = /home/claude/sites/Pet-Tracker-wt-207, branch `feature/207-mobile-jest-virtual-mock-poisoning`, HEAD `9abc466e`.
- `requirements.md`: `status: approved`, casilla marcada (firma delegada 2026-10-24) + errata E1.

## Anclas de Base (antes de A, desde mobile-pet-tracker/)
- fila 1 `for f in food health meal-schedule profile; do grep -cF 'virtual: true' ...` -> `1 1 1 1` (esperado `1 1 1 1`) OK
- fila 2 `grep -rlE "virtual['\"]?[[:space:]]*:" src | wc -l` -> `4` (meal-schedule, food, profile, health) OK
- fila 3 candado: no existe (`ls` -> No such file) OK
- fila 4 `grep -cF "jest.mock('expo-image-picker'" profile` -> `1` OK
- fila 5 `'../../theme/use-theme-colors'` en food/health/meal-schedule -> `1 1 1` OK
- `pgrep -af '[i]nit.sh'` -> vacío (exit 1) OK

## Commits y mediciones
### A `4500e89b` test(mobile): candado de la opción virtual de jest.mock (R1,R2)
- Anclas A (desde mobile-pet-tracker/): fila1 `1 1 1 1`; fila2 `4`; fila3 `0`; fila4 `1`; fila5 `1 1 1`; fila6 `2`; fila7 `3`; fila8 `1`; fila9 `0`. Todas = esperado.
- Candado (`--runInBand --runTestsByPath`): `Test Suites: 1 failed, 1 total` / `Tests:       2 failed, 1 passed, 3 total`. Rojo por aserción: R1 `toEqual([])` recibe las cuatro entradas `screens/{food,health,meal-schedule,profile}/index.test.tsx: contiene la opción virtual`; R2 primer it recibe las cuatro rutas; R2 segundo it verde.
- `bunx expo lint src/__tests__/jest-virtual-mock-lock.test.ts` exit 0 y log vacío; `bunx tsc --noEmit` exit 0.
- CC1 en A (caché vacía, --runInBand, sin init.sh): `exit=1`; `Test Suites: 1 failed, 4 passed, 5 total`; `Tests:       1 failed, 476 passed, 477 total`; único rojo `#172 R2: BackButton › #172 R2: pinta ChevronLeft de 24 en foreground`.

### B `c56e7bc7` test(mobile): quita la opción virtual de los cuatro tests (R1,R2)
- Anclas B: fila1 `0 0 0 0`; fila2 `0`; fila3 `0`; fila4 `1`; fila5 `1 1 1`; fila6 `2`; fila7 `3`; fila8 `1`; fila9 `0`. Todas = esperado.
- Candado: `Test Suites: 1 passed, 1 total` / `Tests:       3 passed, 3 total`.
- CC1 en B: `exit=0`; `Test Suites: 5 passed, 5 total`; `Tests:       477 passed, 477 total`.
- CC2 `git diff --numstat A..B`: `0 1 food`, `0 1 health`, `0 1 meal-schedule`, `1 1 profile` (ver más abajo la salida literal en la sección CC2).

### Mutaciones individuales (cada M-R<n> sola sobre el estado de B, `bunx jest --runInBand --runTestsByPath src/__tests__/jest-virtual-mock-lock.test.ts`, revertida con `git checkout HEAD --`)
Todas `exit=1`, `Test Suites: 1 failed, 1 total`, `Tests:       1 failed, 2 passed, 3 total`. Evidencia = la aserción que falla:
- M-R1a (profile `jest.mock('expo-image-picker'` -> `jest.doMock(...)`): falla `#207 R1`; `expect(problems).toEqual([])` recibe `["screens/profile/index.test.tsx: no registra jest.mock de expo-image-picker"]`.
- M-R2a (`app/(tabs)/__tests__/screens.test.tsx` + `{ virtual: true }`): falla `#207 R2` primer it; `expect(violations).toEqual([])` recibe `["app/(tabs)/__tests__/screens.test.tsx"]`.
- M-R2b (`utils/form-rules.test.ts` + `doMock ... { virtual:true }`): idem, recibe `["utils/form-rules.test.ts"]`.
- M-R2c (`screens/add-pet/index.test.tsx` + `{ "virtual" : false }`): idem, recibe `["screens/add-pet/index.test.tsx"]`.
- M-R2d (comentario en el candado): idem, recibe `["__tests__/jest-virtual-mock-lock.test.ts"]`.
- M-R2e (`entry.name === '__tests__' ? [] : allTestFiles(path)`): falla `#207 R2` segundo it; `expect(mobileTests).toContain('__tests__/jest-virtual-mock-lock.test.ts')`, Received array = lista que empieza en `"hooks/use-pet-selection.test.tsx", ...` (sin ningún `__tests__/`).
- M-R2f (filtro `/\.tests\.tsx?$/`): falla `#207 R2` segundo it; `toContain(...)`, `Received array: []`.

### C `d223bc70` test(mobile): mutaciones de datos del candado (R1,R2)
- Aplica a la vez M-R1a, M-R2a, M-R2b, M-R2c, M-R2d (5 ficheros).
- Anclas C: fila1 `0 0 0 0`; fila2 `4`; fila3 `1`; fila4 `0`; fila5 `1 1 1`; fila6 `2`; fila7 `3`; fila8 `1`; fila9 `0`. Todas = esperado.
- Candado: `Test Suites: 1 failed, 1 total` / `Tests:       2 failed, 1 passed, 3 total`. R1 recibe `["screens/profile/index.test.tsx: no registra jest.mock de expo-image-picker"]`; R2 primer it recibe `["__tests__/jest-virtual-mock-lock.test.ts", "app/(tabs)/__tests__/screens.test.tsx", "screens/add-pet/index.test.tsx", "utils/form-rules.test.ts"]` (= la lista ordenada de tasks.md).

### D `01d8d2e0` test(mobile): revierte mutaciones de datos del candado (R1,R2)
- Restaura los cinco ficheros desde B (`git checkout c56e7bc7 -- <5 rutas>`). `git diff --numstat c56e7bc7 01d8d2e0 -- mobile-pet-tracker` no imprime nada.
- Anclas D: fila1 `0 0 0 0`; fila2 `0`; fila3 `0`; fila4 `1`; fila5 `1 1 1`; fila6 `2`; fila7 `3`; fila8 `1`; fila9 `0`. Todas = esperado.
- Candado: `exit=0`, `Test Suites: 1 passed, 1 total` / `Tests:       3 passed, 3 total`.

### E `bffd1e88` test(mobile): mutaciones del recorrido del candado (R2)
- Aplica M-R2e y M-R2f a la vez sobre el recorrido del candado (un solo fichero).
- Anclas E: fila1 `0 0 0 0`; fila2 `0`; fila3 `0`; fila4 `1`; fila5 `1 1 1`; fila6 `2`; fila7 `3`; fila8 `0`; fila9 `1`. Todas = esperado.
- Candado: `Test Suites: 1 failed, 1 total` / `Tests:       1 failed, 2 passed, 3 total`. Falla solo el segundo it de `#207 R2` (`el recorrido incluye al propio candado`): `Expected value: "__tests__/jest-virtual-mock-lock.test.ts"` / `Received array: []`.

### F `f96d4f95` test(mobile): revierte mutaciones del recorrido del candado (R2)
- Restaura el candado desde D (`git checkout 01d8d2e0 -- <candado>`). `git diff --numstat c56e7bc7 f96d4f95 -- mobile-pet-tracker` vacío (B..F), `D..F` vacío.
- Anclas F: fila1 `0 0 0 0`; fila2 `0`; fila3 `0`; fila4 `1`; fila5 `1 1 1`; fila6 `2`; fila7 `3`; fila8 `1`; fila9 `0`. Todas = esperado.
- Candado: `exit=0`, `Test Suites: 1 passed, 1 total` / `Tests:       3 passed, 3 total`.

### Trazabilidad `b1b8ec8e` docs(#207): trazabilidad
- Solo toca `specs/mobile-jest-virtual-mock-poisoning/traceability.md`: hashes completos de A-F, sin «pendiente» (`grep -n pendiente` vacío). No cuenta entre los seis.

## Criterios de cierre medidos
- CC1: ver A (`exit=1`, `1 failed, 4 passed, 5 total` suites; `1 failed, 476 passed, 477 total` tests; único rojo `#172 R2`) y B (`exit=0`; `Test Suites: 5 passed, 5 total`; `Tests:       477 passed, 477 total`). Una corrida por commit; `pgrep -af '[i]nit.sh'` vacío antes de cada una; caché de jest nueva (`mktemp -d`).
- CC2 `git diff --numstat 4500e89b..c56e7bc7 -- mobile-pet-tracker`: `0\t1\t.../food/index.test.tsx`, `0\t1\t.../health/index.test.tsx`, `0\t1\t.../meal-schedule/index.test.tsx`, `1\t1\t.../profile/index.test.tsx` (exactamente cuatro líneas; `git diff --name-only A..B` lista solo esos cuatro ficheros).
- Ceros de mutaciones: `git diff --numstat c56e7bc7 01d8d2e0 -- mobile-pet-tracker` (B..D) vacío; `01d8d2e0 f96d4f95` (D..F) vacío; B..F vacío.
- CC3 (en F): `bunx jest --runInBand --runTestsByPath <7 rutas>` -> `exit=0`, `Test Suites: 7 passed, 7 total`, `Tests:       594 passed, 594 total`. Ver nota de flake abajo. `bunx tsc --noEmit` exit 0, salida vacía. `bunx expo lint > log 2>&1 && test ! -s log` exit 0, log vacío (0 bytes).
- CC5 `git diff --name-only 9abc466e..HEAD -- mobile-pet-tracker | sort`: exactamente cinco rutas, todas `.test.ts(x)`:
  `src/__tests__/jest-virtual-mock-lock.test.ts`, `src/screens/food/index.test.tsx`, `src/screens/health/index.test.tsx`, `src/screens/meal-schedule/index.test.tsx`, `src/screens/profile/index.test.tsx` (prefijo `mobile-pet-tracker/`).
- CC4 (`./init.sh`) y CC6 (trazabilidad commiteada) quedan para el leader / reviewer. No se corrió `./init.sh`.

## Requisitos cubiertos
- R1: `src/__tests__/jest-virtual-mock-lock.test.ts::#207 R1: ...::cada uno conserva su jest.mock y no pasa la opción virtual`; rojo `4500e89b`, verde `c56e7bc7`, M-R1a rojo `d223bc70`, verde `01d8d2e0`.
- R2: mismo fichero, `#207 R2: ...::ningún test móvil pasa la opción virtual` (rojo A, verde B; M-R2a..d rojo C / verde D) y `::el recorrido incluye al propio candado` (nace verde en A; M-R2e,f rojo E `bffd1e88` / verde F `f96d4f95`).

## Archivos creados / modificados
- Creado: `mobile-pet-tracker/src/__tests__/jest-virtual-mock-lock.test.ts` (80 líneas; cabecera de `forms-validation-global` con el trío `DirectoryEntry` + `declare function require`, recorrido sin exclusiones, tabla de cuatro filas para R1).
- Modificados (solo B): `src/screens/{food,health,meal-schedule}/index.test.tsx` (se borra `  { virtual: true },`) y `src/screens/profile/index.test.tsx` (`}), { virtual: true });` -> `}));`). Nada de producción, jest.config, package.json, test/ ni docs/.
- `specs/mobile-jest-virtual-mock-poisoning/traceability.md` (commit de trazabilidad).
- Los commits C y E tocan temporalmente `src/app/(tabs)/__tests__/screens.test.tsx`, `src/utils/form-rules.test.ts`, `src/screens/add-pet/index.test.tsx` (mutaciones), revertidas en D; el neto de la rama no los incluye.

## Decisiones de diseño
- Redacción del candado: comentarios y títulos sin la palabra «virtual» seguida de dos puntos (D6): la anclas fila 3 da 0 en A, B, D, E, F y 1 solo en C (M-R2d).
- El recorrido es una función `allTestFiles` con una línea de recursión (`if (entry.isDirectory()) return allTestFiles(path);`) y una línea de filtro (`/\.test\.tsx?$/`), para que M-R2e y M-R2f sean un `sed` de una línea cada una (D4). Rutas normalizadas con `.replace(/\\/g, '/')` y `.sort()` (D8).
- Los tests de las mutaciones se aplicaron con un script en el scratchpad (`mut.sh`, fuera del repo); C y D/F se revierten con `git checkout <hash> -- <rutas>` desde el commit previo (no `HEAD`), porque HEAD ya tiene la mutación.
- `graphify update .` no se corrió: el cambio es solo de tests y `graphify-out/` no está versionado en este worktree.

## Output de build / tests
Ver las líneas literales de cada commit más arriba (`Tests:`/`Test Suites:`). Logs crudos en el scratchpad de la sesión (`cc1_B.log`, `cc3b.log`, `m_*.log`, `c.log`, `e.log`).

## Notas para el reviewer
- Flake de carga (errata E1): la primera corrida de CC3 (7 rutas) dio `Test Suites: 1 failed, 6 passed, 7 total` / `Tests: 1 failed, 593 passed, 594 total` con `#173 R5: cápsula de añadir mascota › pinta la cápsula tras el título con icono oculto y texto en español` (`Unable to find an element with testID: pet-info-card`), profile tardó 110 s con `jest` de #196 y #201 corriendo en paralelo (load average ~6.5). `profile` a solas dio `155 passed` (exit 0) y la repetición completa de CC3 dio `7 passed, 7 total / 594 passed, 594 total`, exit 0. Es exactamente el rojo de tiempo que describe E1 (`#173 R5`); no está relacionado con el cambio.
- CC1 se midió con `pgrep -af '[i]nit.sh'` vacío, pero con jest de otros worktrees corriendo (carga). A y B dieron a la primera exactamente lo esperado.
- El reviewer debe reproducir C y E y copiar la aserción por cada M-R<n> (las de este informe están en «Mutaciones individuales»).
- Árbol: `progress/current.md` figuraba modificado (no es mío), y `progress/handoff_*.md`, `progress/leader_note_207.md` y este informe quedan sin commitear. `git status --short -- mobile-pet-tracker/ specs/` limpio.
