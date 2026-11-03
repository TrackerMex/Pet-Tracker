---
feature: "mobile-food-links-without-profile"
status: approved      # draft | approved
tags: [mobile, nutrition, food, spec]
---

# Tareas — [[mobile-food-links-without-profile]] (#233)

> Disciplina TDD. Cada tarea corresponde a un requisito de [[requirements]].
> Cada (1) es un commit `test(mobile): … (R<n>)` y cada (2) un commit
> `feat(mobile): … (R<n>)`, en ese orden (C4). Las rutas de código son
> relativas a `mobile-pet-tracker/`. Ninguna tarea ejecuta `./init.sh`.

Todos los comandos de jest se lanzan desde
`cd /home/claude/sites/Pet-Tracker-wt-233/mobile-pet-tracker` y con
`--runTestsByPath`, para que el posicional no se lea como regex.

Orden de commits (seis, más los de cierre):

1. `test(mobile): #233 nutrition links hidden without profile (R1)`: rojo.
2. `test(mobile): #233 nutrition links hidden while the profile is unconfirmed (R2)`: rojo.
3. `test(mobile): #233 nutrition links hidden on plan or profile errors (R3)`: rojo.
4. `test(mobile): #233 nutrition links stay with a profile (R4, R5)`: nace
   verde (ver «`it` que nacen verdes»).
5. `feat(mobile): #233 nutrition links only with a confirmed profile (R1, R2, R3)`:
   verde. Es un único commit porque el cambio de producción son dos líneas que
   sirven a R1, R2 y R3 a la vez; partirlo obligaría a una implementación
   artificial.
6. Cierre: `traceability.md` y `progress/impl_mobile-food-links-without-profile.md`.

R6 y R7 no tienen commit propio: son anclas de grep y guardas existentes.

## Paso 0 — base

- [ ] `git -C /home/claude/sites/Pet-Tracker-wt-233 fetch origin` y
      `git -C /home/claude/sites/Pet-Tracker-wt-233 merge origin/dev` (merge,
      nunca rebase). Si #234 ya está en `dev` y tocó `food/index.test.tsx`,
      las cifras de abajo que dependan del fichero de test se re-miden por
      contenido y no se cambia la spec.
- [ ] Si el merge trae dependencias nuevas:
      `cd /home/claude/sites/Pet-Tracker-wt-233/mobile-pet-tracker && bun install --frozen-lockfile`.
- [ ] Comprobar que `.env` y `node_modules` existen en el worktree. Si no,
      copiar `.env` y correr `bun install --frozen-lockfile`.
- [ ] Volver a medir, tras el merge, las anclas de partida. Cada una tiene que
      dar la cifra indicada. Si alguna no la da, parar y anotarlo en
      `progress/impl_mobile-food-links-without-profile.md`.
  - `grep -cF "hasProfile" src/screens/food/index.tsx` = 0
  - `grep -cF "{loadedPlan !== null ? <RiseIn delayMs={200}>{links}</RiseIn> : links}" src/screens/food/index.tsx` = 1
  - `grep -cF "profile.data" src/screens/food/index.tsx` = 2
  - `grep -cF "enabled: planNotFound," src/screens/food/index.tsx` = 1
  - `grep -cF "RiseIn delayMs={200}" src/screens/food/index.tsx` = 1
  - `grep -cF 'testID="food-links"' src/screens/food/index.tsx` = 1
  - `grep -cF "const links = (" src/screens/food/index.tsx` = 1
  - `grep -cF "rounded-16" src/screens/food/index.tsx` = 3
  - `grep -cF "signOut(" src/screens/food/index.tsx` = 0
  - `grep -cF "#233" src/screens/food/index.tsx src/screens/food/index.test.tsx`:
    0 en los dos.
  - `grep -cF "describe('#200 R10: entrada escalonada de Nutrición'" src/screens/food/index.test.tsx` = 1
  - `grep -cF "describe('#222 R7: Encabezado solo para lectores de pantalla'" src/screens/food/index.test.tsx` = 1
  - `grep -cF "it('shows a skeleton and schedule link while the plan is pending'" src/screens/food/index.test.tsx` = 1
  - `grep -cF "expect(screen.getByTestId('meal-schedule-link')).toBeVisible();" src/screens/food/index.test.tsx` = 3
    (el del `it` que se enmienda, el de `shows a graceful empty plan…` y el
    de `omits the AI card…`; solo el primero se toca)
- [ ] Anotar H0 (`git rev-parse HEAD` tras el merge) en
      `progress/impl_mobile-food-links-without-profile.md`: los candados de
      diff de R6 y R7 usan `git merge-base HEAD origin/dev`.

## R1 — sin perfil no hay enlaces, sea cual sea el rol

- [ ] (1) Escribir test que falla para R1
  - `src/screens/food/index.test.tsx`: crear el `describe` nuevo
    `describe('#233 R1 a R5: los enlaces de comidas dependen del perfil nutricional', …)`
    **entre** el cierre del `describe('#200 R10: entrada escalonada de Nutrición')`
    y la línea `describe('#222 R7: Encabezado solo para lectores de pantalla'`.
    No se toca nada más.
  - Su `beforeEach`: `mockListPets.mockReset();`
    `mockGetNutritionPlan.mockReset();`
    `mockListPets.mockResolvedValue({ kind: 'ok', pets: [makePet()] });`.
    No toca `mockGetNutritionProfile`.
  - Dentro, el `it.each` de cuatro filas de requirements.md R1 (`'owner'`,
    `'family'`, `'walker'`, `'vet'`), título
    `'#233 R1 con el rol %s y sin perfil no hay enlaces de comidas'`.
  - Usa los helpers del propio fichero: `makePet`, `renderFood`, `screen`,
    `mockListPets`, `mockGetNutritionPlan`, `mockGetNutritionProfile`. No se
    añade ni se cambia ningún helper, `import` ni `jest.mock`.
  - Los cinco `queryBy…` de ausencia llevan `{ includeHiddenElements: true }`.
  - Cada `#233` del fichero va seguido de ` R<n>` (regla `HEX_LITERAL`).
  - Rojo esperado: las cuatro filas.
  - `bunx jest --runTestsByPath src/screens/food/index.test.tsx -t "#233 R1"`
- [ ] (2) Implementación mínima: la hace el commit verde común (más abajo).
- [ ] (3) Refactor con tests verdes: las anclas de requirements.md R1.

## R2 — sin confirmar (plan pendiente o perfil pendiente) no hay enlaces

- [ ] (1) Escribir test que falla para R2
  - Enmienda del `it` existente (requirements.md R2, Test A), en
    `describe('R5: plan del día con horarios y warnings')`:
    - título: añadir al final ` (enmendado por #233 R2)` dentro de las comillas;
    - en el `waitFor`, quitar la línea
      `expect(screen.getByTestId('meal-schedule-link')).toBeVisible();` y
      poner en su lugar las dos aserciones `queryByTestId(…, { includeHiddenElements: true })`
      con `.toBeNull()` para `meal-schedule-link` y `meals-history-link`;
    - las otras cuatro aserciones y el resto del `it` no se tocan. Es la
      única línea ajena que se edita en todo el fichero.
  - Test B: el `it` `'#233 R2 con el plan resuelto y el perfil pendiente no hay enlaces de comidas'`
    dentro del `describe` de R1, tras el `it.each` de R1, con la promesa
    manual y la transición final de requirements.md R2.
  - La espera `waitFor(() => expect(mockGetNutritionProfile).toHaveBeenCalledTimes(1))`
    es la excepción nombrada a `docs/conventions.md` §Esperas, y va con un
    comentario de una línea que lo dice (sin `#233` suelto en el comentario).
    Es la única espera por contador de mock de la feature.
  - Rojo esperado: el `it` enmendado y el Test B.
  - `bunx jest --runTestsByPath src/screens/food/index.test.tsx -t "while the plan is pending"`
  - `bunx jest --runTestsByPath src/screens/food/index.test.tsx -t "#233 R2"`
- [ ] (2) Implementación mínima: la hace el commit verde común (más abajo).
- [ ] (3) Refactor con tests verdes: las anclas de requirements.md R2.

## R3 — errores de plan o de perfil: sin enlaces

- [ ] (1) Escribir test que falla para R3
  - En el `describe` de R1, tras el `it` de R2: el `it.each` de tres filas de
    requirements.md R3, título `'#233 R3 con $name no hay enlaces de comidas'`,
    filas `{ name, plan, profile, anchor }`.
  - Cada fila espera `await screen.findByTestId(anchor)` antes de medir.
  - Las filas de plan comprueban además `food-plan-retry`.
  - Rojo esperado: las tres filas.
  - `bunx jest --runTestsByPath src/screens/food/index.test.tsx -t "#233 R3"`
- [ ] (2) Implementación mínima: la hace el commit verde común (más abajo).
- [ ] (3) Refactor con tests verdes: las anclas de requirements.md R3.

## R4 y R5 — con perfil los enlaces siguen donde estaban

- [ ] (1) Escribir los dos tests (nacen verdes: no hay rojo previo, ver «`it`
      que nacen verdes»)
  - En el `describe` de R1, tras el `it.each` de R3: el `it` de R4
    (`'#233 R4 con perfil y sin plan los enlaces se pintan sin RiseIn'`) y el
    `it` de R5 (`'#233 R5 con plan cargado los enlaces entran con RiseIn aunque el perfil no responda'`),
    tal como los define requirements.md.
  - R4 pone el perfil `ok` de forma explícita (copia del literal del
    `beforeEach` raíz del fichero).
  - R5 espera `food-plan-card` antes de medir.
  - `bunx jest --runTestsByPath src/screens/food/index.test.tsx -t "#233 R4"`
  - `bunx jest --runTestsByPath src/screens/food/index.test.tsx -t "#233 R5"`
- [ ] (2) Sin implementación propia: la rama del plan cargado y la rama con
      perfil `ok` ya están en la línea nueva.
- [ ] (3) Las anclas de requirements.md R4 y R5.

## Commit verde común (R1, R2, R3)

- [ ] `src/screens/food/index.tsx`, `FoodScreen`, con la forma literal de
      [[design]]:
  - justo debajo de la línea
    `const showProfileEmpty = planNotFound && profile.data?.kind === 'not-found' && activePet?.myRole === 'owner';`
    añadir
    `const hasProfile = loadedPlan !== null || (planNotFound && profile.data?.kind === 'ok');`;
  - la última línea del bloque `selectedPetId ? (…)`,
    `{loadedPlan !== null ? <RiseIn delayMs={200}>{links}</RiseIn> : links}`,
    pasa a
    `{hasProfile ? (loadedPlan !== null ? <RiseIn delayMs={200}>{links}</RiseIn> : links) : null}`,
    en una sola línea.
  - No se toca nada más del fichero: ni `links`, ni sus clases, ni la consulta
    del perfil, ni `ai-explanation.tsx`.
- [ ] `bunx jest --runTestsByPath src/screens/food/index.test.tsx` (el
      fichero entero). Verde, con los `it` ajenos sin editar. Si uno se pone
      rojo, no se enmienda: parar y anotarlo en
      `progress/impl_mobile-food-links-without-profile.md`.
- [ ] Mensaje de commit:
      `feat(mobile): #233 nutrition links only with a confirmed profile (R1, R2, R3)`.

## R6 — el cambio de producción mide dos líneas

- [ ] (1) Sin test nuevo. Lo cubren las anclas de requirements.md R6 y las
      guardas existentes.
- [ ] (2) Sin implementación propia.
- [ ] (3) Comprobar las anclas de R6, incluido el `numstat` `2<TAB>1` de
      `src/screens/food/index.tsx` y la ausencia de diff en `ai-explanation.tsx`.

## R7 — el fichero de test queda acotado

- [ ] (1) Sin test nuevo. Candado de anclas.
- [ ] (2) Sin implementación propia.
- [ ] (3) Comprobar las anclas de requirements.md R7, incluido el `numstat`
      del fichero de test con exactamente 2 líneas quitadas.

## `it` que nacen verdes

Lista cerrada. Nace verde a propósito, porque la rama con perfil ya funciona
hoy o porque la guarda ya existe.

| Requisito | `it` |
|---|---|
| R1 | ninguna fila: las cuatro son rojas |
| R2 | ninguno: el `it` enmendado y el Test B son rojos |
| R3 | ninguna fila: las tres son rojas |
| R4 | el `it` nuevo `#233 R4`, más los existentes `shows a graceful empty plan and keeps the schedule link`, `queda en el sitio del vacío…` (#155 R9), `#200 R10: sin plan los enlaces no entran con RiseIn` y `#209 R19: owner con perfil y sin plan ve el vacío actual` |
| R5 | el `it` nuevo `#233 R5`, más los existentes `#200 R9`, `#200 R10` (fila `food-links`), `#200 R11`, `#105 R14`, `#65 R17` y `omits the AI card without leaving a gap…` |

Que R4 y R5 nazcan verdes no los hace ciegos: la batería de mutaciones M2, M7 y
M9 los pone rojos (ver «Batería de mutaciones»).

## Batería de mutaciones

Corre tras el commit verde, sobre `src/screens/food/index.tsx`, una mutación
cada vez (tabla M1–M9 de [[design]]). Para cada una:

1. Plantar la mutación en el fichero de producción.
2. Medir la ancla de la columna «Ancla que la detecta» de design.md (debe dar
   el valor con la mutación).
3. `bunx jest --runTestsByPath src/screens/food/index.test.tsx` y comprobar
   que se ponen rojos los `it` de la columna «Debe ponerse rojo». Si la
   mutación no pone rojo ninguno, el candado es ciego: parar y anotarlo.
4. Revertir con `git checkout HEAD -- mobile-pet-tracker/src/screens/food/index.tsx`
   y comprobar que `git diff --cached --stat` y
   `git diff --stat -- mobile-pet-tracker/src/screens/food/index.tsx` dan cero
   líneas.

M1 a M9 se anotan en `progress/impl_mobile-food-links-without-profile.md` con
el resultado de cada una. Ninguna se commitea.

## Verificación final (Codex, sin `./init.sh`)

Desde `cd /home/claude/sites/Pet-Tracker-wt-233/mobile-pet-tracker`:

- [ ] `bunx tsc --noEmit`
- [ ] `bunx jest --runTestsByPath src/screens/food/index.test.tsx`
- [ ] `bunx jest src/__tests__ src/app/__tests__ src/components/__tests__`
      (las guardas de copy, design-drift, consistency-classnames,
      tab-headers-canvas y canvas-fidelity).
- [ ] `bunx expo lint --no-cache > /tmp/lint-233.log 2>&1 && test ! -s /tmp/lint-233.log && echo LINT_OK`
  - Imprime `LINT_OK`. `expo lint` puede salir con 0 aunque un OOM mate a
    eslint: lo que vale es el log vacío, no el código de salida.
- [ ] `grep -noE '#233.{0,3}' src/screens/food/index.tsx src/screens/food/index.test.tsx | grep -vE '#233 R[1-5]'`
      no da ninguna línea (regla `HEX_LITERAL`: cada `#233` va seguido de
      ` R<n>`).
- [ ] `grep -cF "'#233 R" src/screens/food/index.test.tsx` = 6 y
      `grep -cF "(enmendado por #233 R2)" src/screens/food/index.test.tsx` = 1.
- [ ] Anclas de partida y finales de requirements.md R1–R7 dan su cifra, entre
      ellas la declaración exacta = 1, el render nuevo = 1, el render viejo = 0
      y `profile.data` = 3.
- [ ] Desde la raíz del repo, tras `git fetch origin`:
      `git diff --numstat $(git merge-base HEAD origin/dev) -- mobile-pet-tracker/src/screens/food/index.tsx`
      da exactamente `2<TAB>1<TAB>mobile-pet-tracker/src/screens/food/index.tsx`
      y
      `git diff --numstat $(git merge-base HEAD origin/dev) -- mobile-pet-tracker/src/screens/food/index.test.tsx`
      da `<N><TAB>2<TAB>mobile-pet-tracker/src/screens/food/index.test.tsx`.
- [ ] Rellenar `traceability.md` con el `it` y los hashes (rojo y verde) de
      cada requisito, y con la referencia a los `it` existentes. Después no
      se rebasea.
- [ ] Escribir `progress/impl_mobile-food-links-without-profile.md` con los
      comandos, sus salidas resumidas y el resultado de M1 a M9.

## Tareas del leader (no de Codex)

- [ ] Al mergear, añadir el paso de #233 a `progress/smoke_mejoras-smoke.md`
      (texto en requirements.md § Aprobación, última casilla).
- [ ] Si #234 va detrás en `food/index.test.tsx`, mergear `dev` en su rama
      antes del handoff.
- [ ] La casilla «Enmienda #233» de `specs/mobile-canvas-nutrition/requirements.md`
      y la casilla opcional G4 de `docs/ui-guidelines.md` son del humano; el
      leader no las marca sin su mensaje.
