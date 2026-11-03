---
feature: "mobile-profile-photo-owner-only"
status: draft        # draft | approved
tags: [mobile, roles, profile, spec]
---

# Tareas — [[mobile-profile-photo-owner-only]] (#235)

> Disciplina TDD. Cada tarea corresponde a un requisito de [[requirements]].
> Cada (1) es un commit `test(mobile): … (R<n>)` y cada (2) un commit
> `feat(mobile): … (R<n>)`, en ese orden (C4). Las rutas de código son
> relativas a `mobile-pet-tracker/`. Ninguna tarea ejecuta `./init.sh`.

Todos los comandos de jest se lanzan desde
`cd /home/claude/sites/Pet-Tracker-wt-235/mobile-pet-tracker` y con
`--runTestsByPath`, para que el posicional no se lea como regex.

Orden de commits (cinco, más los de cierre):

1. `test(mobile): #235 profile camera only for the owner (R1)`: rojo.
2. `test(mobile): #235 profile camera follows the selected pet (R3)`: rojo.
3. `feat(mobile): #235 profile camera only for the owner (R1, R3)`: verde. Es
   un único commit porque el cambio de producción son dos líneas que sirven a
   R1 y a R3 a la vez; partirlo obligaría a una implementación artificial.
4. Cierre: `traceability.md` y `progress/impl_mobile-profile-photo-owner-only.md`.

R2 y R4 no tienen commit propio: nacen verdes (ver «`it` que nacen verdes»).

## Paso 0 — base

- [ ] `git -C /home/claude/sites/Pet-Tracker-wt-235 fetch origin` y
      `git -C /home/claude/sites/Pet-Tracker-wt-235 merge origin/dev` (merge,
      nunca rebase).
- [ ] Si el merge trae dependencias nuevas:
      `cd /home/claude/sites/Pet-Tracker-wt-235/mobile-pet-tracker && bun install --frozen-lockfile`.
- [ ] Comprobar que `.env` y `node_modules` existen en el worktree. Si no,
      copiar `.env` y correr `bun install --frozen-lockfile`.
- [ ] Volver a medir, tras el merge, las anclas de partida. Cada una tiene que
      dar la cifra indicada. Si alguna no la da, parar y anotarlo en
      `progress/impl_mobile-profile-photo-owner-only.md`. Si otra feature (por
      ejemplo #229) ya tocó `src/screens/profile/index.tsx`, la cifra de
      `{pet ? (` puede variar: en ese caso se re-mide por contenido y no se
      cambia la spec.
  - `grep -cF "isOwner" src/screens/profile/index.tsx` = 0
  - `grep -cF "myRole" src/screens/profile/index.tsx` = 0
  - `grep -cF 'BubblePop testID="profile-change-photo-pop"' src/screens/profile/index.tsx` = 1
  - `grep -cF 'testID="change-photo"' src/screens/profile/index.tsx` = 1
  - `grep -cF "signOut(" src/screens/profile/index.tsx` = 2
  - `grep -B1 -F 'BubblePop testID="profile-change-photo-pop"' src/screens/profile/index.tsx | grep -cF "{pet ? ("` = 1
    (la condición vieja envuelve justo al `BubblePop`)
  - `grep -cF "myRole" src/screens/profile/index.test.tsx` = 1 (la línea del
    `makePet`)
  - `grep -cF "#235" src/screens/profile/index.tsx src/screens/profile/index.test.tsx`:
    0 en los dos.

## R1 — la cámara de Perfil es solo del dueño

- [ ] (1) Escribir test que falla para R1
  - `src/screens/profile/index.test.tsx`, al final del fichero y sin tocar
    ningún `describe` ni `it` existente:
    `describe('#235 R1: la cámara de Perfil es solo del dueño')` con
    `beforeEach(setupProfile168)` y el `it.each` de cuatro filas de
    requirements.md R1 (`['owner', true]`, `['family', false]`,
    `['walker', false]`, `['vet', false]`).
  - Usa los helpers del propio fichero: `makePet`, `setupProfile168`,
    `renderProfile`, `profileChild`, `mockListPets`, `mockGetPet`. No se
    añade ni se cambia ningún helper ni ningún `jest.mock`.
  - Los tres `queryByTestId` de las filas sin cámara llevan
    `{ includeHiddenElements: true }`.
  - Cada `#235` del fichero va seguido de ` R<n>` (regla `HEX_LITERAL`).
  - Rojo esperado: las filas `family`, `walker` y `vet`. La fila `owner`
    nace verde.
  - `bunx jest --runTestsByPath src/screens/profile/index.test.tsx -t "#235 R1"`
- [ ] (2) Implementación mínima: la hace el commit verde común (más abajo).
- [ ] (3) Refactor con tests verdes: las anclas de requirements.md R1.

## R3 — la cámara sigue a la mascota seleccionada

- [ ] (1) Escribir test que falla para R3
  - `src/screens/profile/index.test.tsx`, a continuación del `describe` de
    R1, también al final:
    `describe('#235 R3: la cámara sigue a la mascota seleccionada')` con
    `beforeEach(setupProfile168)`, el Test A (`it`) y el Test B (`it.each`)
    de requirements.md R3.
  - Test A: `mockGetPet.mockImplementation(async (_baseUrl, _token, petId) => …)`
    exactamente como lo dice requirements.md. Usa el mock `PetSwitcher` del
    fichero, que pinta `pet-chip-<id>`; no se redefine. La espera de
    `profile-pet-name` = `Milo` antes del `null` es obligatoria.
  - Los `queryByTestId` que esperan `null` llevan
    `{ includeHiddenElements: true }`.
  - Rojo esperado: el Test A (la cámara se pinta para Milo) y la fila
    `['owner', 'family', false]` del Test B. La fila `['family', 'owner', true]`
    nace verde.
  - `bunx jest --runTestsByPath src/screens/profile/index.test.tsx -t "#235 R3"`
- [ ] (2) Implementación mínima: la hace el commit verde común (más abajo).
- [ ] (3) Refactor con tests verdes: las anclas de requirements.md R3.

## Commit verde común (R1, R3)

- [ ] `src/screens/profile/index.tsx`, `ProfileScreen`, con la forma literal de
      [[design]]:
  - justo debajo de
    `const pet = detail.data?.kind === 'ok' ? detail.data.pet : null;`,
    la línea `const isOwner = pet?.myRole === 'owner';`;
  - la línea `{pet ? (` que va justo antes de
    `<BubblePop testID="profile-change-photo-pop" …>` pasa a `{isOwner ? (`.
    Las otras apariciones de `{pet ? (` (por ejemplo `caption={pet ? (`) no se
    tocan. No se toca nada más del fichero.
  - Si prettier lo pide, `bunx prettier --check src/screens/profile/index.tsx`
    se corre solo para comprobar. Móvil puede no tener prettier: en ese caso se
    omite.
- [ ] `bunx jest --runTestsByPath src/screens/profile/index.test.tsx` (el
      fichero entero). Verde, con los `it` ajenos sin editar. Si uno se pone
      rojo, no se enmienda: parar y anotarlo en
      `progress/impl_mobile-profile-photo-owner-only.md`.
- [ ] Mensaje de commit:
      `feat(mobile): #235 profile camera only for the owner (R1, R3)`.

## R2 — mientras el detalle no resuelve, no hay cámara

- [ ] (1) Sin test nuevo: nace verde. Lo prueba el `it.each`
      `'#196 R4: sin detalle cargado ($name) no monta la cámara'` ya existente
      (filas `detalle pendiente` y `error de detalle`), que sigue verde sin
      edición. Ver requirements.md R2.
- [ ] (2) Sin implementación propia: `pet?.myRole === 'owner'` es `false` con
      `pet` nulo.
- [ ] (3) Comprobar con la batería de mutaciones (M2, M4, M5, M8) que esas dos
      filas se ponen rojas.
  - `bunx jest --runTestsByPath src/screens/profile/index.test.tsx -t "#196 R4"`

## R4 — el flujo del dueño no cambia

- [ ] (1) Sin test nuevo: nace verde. Lo prueban los `describe` ya existentes
      `R7: cambiar foto`, `#184 R1`, `#184 R2` y `#196 R4: cámara flotante`.
- [ ] (2) Sin implementación propia: el botón se envuelve, no se reescribe.
- [ ] (3) Las anclas de requirements.md R4, y el candado de no-edición
      (`git diff --numstat $(git merge-base HEAD origin/dev) -- mobile-pet-tracker/src/screens/profile/index.test.tsx`
      desde la raíz del repo: segunda columna `0`).
  - `bunx jest --runTestsByPath src/screens/profile/index.test.tsx -t "R7: cambiar foto"`
  - `bunx jest --runTestsByPath src/screens/profile/index.test.tsx -t "#184"`

## `it` que nacen verdes

Lista cerrada. Nace verde a propósito, porque el dueño ya ve la cámara hoy o
porque la guarda ya existe.

| Requisito | `it` |
|---|---|
| R1 | fila `owner` del `it.each` de `#235 R1` |
| R2 | filas `detalle pendiente` y `error de detalle` de `#196 R4` (existentes) |
| R3 | fila `['family', 'owner', true]` del Test B de `#235 R3` |
| R4 | `R7: cambiar foto`, `#184 R1`, `#184 R2`, `#196 R4: cámara flotante` (existentes) |

## Batería de mutaciones

Corre tras el commit verde, sobre `src/screens/profile/index.tsx`, una
mutación cada vez (tabla M1–M9 de [[design]]). Para cada una:

1. Plantar la mutación en el fichero de producción.
2. Medir la ancla de la columna «Ancla que la detecta» de design.md (debe dar
   el valor con la mutación).
3. `bunx jest --runTestsByPath src/screens/profile/index.test.tsx` y
   comprobar que se ponen rojos los `it` de la columna «Debe ponerse rojo».
   Si la mutación no pone rojo ninguno, el candado es ciego: parar y
   anotarlo.
4. Revertir con `git checkout HEAD -- mobile-pet-tracker/src/screens/profile/index.tsx`
   y comprobar que `git diff --cached --stat` y `git diff --stat -- mobile-pet-tracker/src/screens/profile/index.tsx`
   dan cero líneas.

M1 a M9 se anotan en `progress/impl_mobile-profile-photo-owner-only.md` con el
resultado de cada una. Ninguna se commitea.

## Verificación final (Codex, sin `./init.sh`)

Desde `cd /home/claude/sites/Pet-Tracker-wt-235/mobile-pet-tracker`:

- [ ] `bunx tsc --noEmit`
- [ ] `bunx jest --runTestsByPath src/screens/profile/index.test.tsx`
- [ ] `bunx jest src/__tests__ src/app/__tests__ src/components/__tests__`
      (las guardas de copy, design-drift, profile-photo-hero-canvas,
      profile-canvas-fidelity, consistency-classnames).
- [ ] `bunx expo lint --no-cache > /tmp/lint-235.log 2>&1 && test ! -s /tmp/lint-235.log && echo LINT_OK`
  - Imprime `LINT_OK`. `expo lint` puede salir con 0 aunque un OOM mate a
    eslint: lo que vale es el log vacío, no el código de salida.
- [ ] `grep -noE '#235.{0,3}' src/screens/profile/index.tsx src/screens/profile/index.test.tsx | grep -vE '#235 R[13]'`
      no da ninguna línea (regla `HEX_LITERAL`: cada `#235` va seguido de
      ` R<n>`).
- [ ] Anclas de partida y finales de requirements.md R1–R4 dan su cifra, entre
      ellas la posicional de R1 = 1 y `{pet ? (` = 3 (control, no ancla).
- [ ] Desde la raíz del repo, tras `git fetch origin`:
      `git diff --numstat $(git merge-base HEAD origin/dev) -- mobile-pet-tracker/src/screens/profile/index.tsx`
      da exactamente `2<TAB>1<TAB>mobile-pet-tracker/src/screens/profile/index.tsx`.
- [ ] Rellenar `traceability.md` con el `it` y los dos hashes (rojo y verde)
      de R1 y R3, y con la referencia a los `it` existentes en R2 y R4.
      Después no se rebasea.
- [ ] Escribir `progress/impl_mobile-profile-photo-owner-only.md` con los
      comandos, sus salidas resumidas y el resultado de M1 a M9.

## Tareas del leader (no de Codex)

- [ ] Al mergear, añadir el paso de #235 a `progress/smoke_mejoras-smoke.md`
      (texto en requirements.md § Aprobación, segunda casilla).
- [ ] Si #229 va detrás en el mismo fichero, mergear `dev` en su rama antes del
      handoff.
