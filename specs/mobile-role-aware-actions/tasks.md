---
feature: "mobile-role-aware-actions"
status: draft        # draft | approved
tags: [mobile, roles, spec]
---

# Tareas — [[mobile-role-aware-actions]] (#216)

> Disciplina TDD. Cada tarea corresponde a un requisito de [[requirements]] y
> tiene siempre los mismos 3 sub-items, en este orden. Cada (1) es un commit
> `test(mobile): … (R<n>)` y cada (2) un commit `feat(mobile): … (R<n>)`, en
> ese orden (C4). Las rutas de código son relativas a `mobile-pet-tracker/`.
> Ninguna tarea ejecuta `./init.sh`.

Todos los comandos de jest se lanzan desde
`cd /home/claude/sites/Pet-Tracker-wt-216/mobile-pet-tracker` y con
`--runTestsByPath`, para que el posicional no se lea como regex.

## Paso 0 — base

- [ ] `git -C /home/claude/sites/Pet-Tracker-wt-216 fetch origin` y
      `git -C /home/claude/sites/Pet-Tracker-wt-216 merge origin/dev` (merge,
      nunca rebase). Trae #217 (`ca2d0abb`), que toca
      `src/screens/home/index.tsx` y `src/screens/home/index.test.tsx` en líneas
      que #216 no usa.
- [ ] Si el merge trae dependencias nuevas:
      `cd /home/claude/sites/Pet-Tracker-wt-216/mobile-pet-tracker && bun install --frozen-lockfile`.
- [ ] Mirar si #214 ya está en `origin/dev`
      (`git -C /home/claude/sites/Pet-Tracker-wt-216 log origin/dev --oneline --grep '#214'`).
      Da igual para el código. Solo cambia si hay que volver a medir la tabla
      de copy.
- [ ] Volver a medir, tras el merge, las anclas de partida. Cada una tiene que
      dar la cifra indicada. Si alguna no la da, parar y anotarlo en
      `progress/impl_mobile-role-aware-actions.md`.
  - `grep -cF "isOwner" src/screens/weight-log/index.tsx src/screens/home/index.tsx src/screens/reminders/index.tsx src/screens/pairing/index.tsx`:
    0 en los cuatro.
  - `grep -cF "{detail.data.pet.device === null ? (" src/screens/home/index.tsx` = 1
  - `grep -cF "{QUICK_ACTIONS.map(" src/screens/home/index.tsx` = 1
  - `grep -cF "action={{ label: t('reminders.new'), onPress: () => router.push('/add-reminder' as Href) }}" src/screens/reminders/index.tsx` = 1
  - `grep -cF "t('pairing.errorForbiddenClaim')" src/screens/pairing/index.tsx` = 1
  - `grep -cF "42 + 2 + 1 + 4 - 1 + 1); //" src/__tests__/ui-language.test.ts` = 1
    - Si da 0, otra feature ya movió la expresión. Se le suma `+ 1` a la que
      haya, sin reescribirla.
  - `grep -cF "key: 'pairing.errorForbiddenClaim'" src/__tests__/ui-copy-table.ts` = 1

## R1 — Peso solo deja registrar al dueño

- [ ] (1) Escribir test que falla para R1
  - `src/screens/weight-log/index.test.tsx`:
    - `jest.mock('../../api/pets', () => ({ getPet: jest.fn() }));` junto a
      los otros `jest.mock`.
    - `import { getPet } from '../../api/pets';` y
      `const mockGetPet = jest.mocked(getPet);`.
    - `petKeys` se suma al import de `../../api/query-keys`. `PetProfile` se
      suma al `import type` de `../../api/types`.
  - `makePet(overrides: Partial<PetProfile> = {}): PetProfile`:
    - copia literal del `makePet` de `src/screens/home/index.test.tsx`
      (`id: 'pet-1'`, `name: 'Luna'`, `myRole: 'owner'`, `device: null`, …,
      `...overrides`);
    - si `tsc` pide un campo que ese literal no tiene, se toma del tipo y no se
      inventa.
  - En el `beforeEach` de nivel superior (el que ya prepara `getMe`), añadir
    `mockGetPet.mockResolvedValue({ kind: 'ok', pet: makePet() });`. Así
    todos los `it` existentes ven a un dueño.
  - `describe('#216 R1: Peso solo deja registrar al dueño')` con el `it.each`
    de cuatro filas de requirements.md R1 y el
    `it('#216 R1 mientras la mascota carga no pinta el formulario')` dentro.
    - El `beforeEach` del describe llama a `prepareWeightLogTests()` y después
      a `mockListWeights.mockResolvedValue({ kind: 'ok', weights: [makeWeight()] })`.
    - `queryClient` sale de lo que devuelve `renderWeightLog()`.
  - Enmienda mecánica, en el mismo commit:
    - `it('#199 R22 en carga pinta cabecera, formulario y tres filas esqueleto')`
      gana `await screen.findByTestId('weight-form');` justo después de
      `const loading = await renderLoading199();`.
    - Su nombre gana ` (enmendado por #216 R1)`.
    - Hoy sigue verde: el formulario ya está.
  - Rojo esperado: las cuatro filas del `it.each` (la espera de
    `getQueryData(petKeys.detail('pet-1'))` agota el tiempo, porque Peso no
    consulta la mascota) y el `it` de carga (el formulario se pinta sin
    esperar).
  - `bunx jest --runTestsByPath src/screens/weight-log/index.test.tsx -t "#216 R1"`
- [ ] (2) Implementación mínima que lo pasa
  - `src/screens/weight-log/index.tsx`, con la forma literal de design.md
    (Peso): la consulta, `isOwner` y `{isOwner ? ( <RiseIn delayMs={80}>…</RiseIn> ) : null}`.
  - `bunx jest --runTestsByPath src/screens/weight-log/index.test.tsx`
    (el fichero entero).
  - Enmienda condicional:
    - Si el helper `form()` de `describe('#199 R7: formulario de Peso')` se
      pone rojo, gana `await screen.findByTestId('weight-form');` tras
      `await screen.findByTestId('weight-log-empty');`.
    - Los `it` que lo usan no se renombran: el cambio es del helper.
    - Se anota en `progress/impl_mobile-role-aware-actions.md`.
    - Va en este mismo commit verde.
  - Cualquier otro `it` que se ponga rojo no se enmienda: parar y anotarlo en
    `progress/impl_mobile-role-aware-actions.md`.
- [ ] (3) Refactor con tests verdes
  - Las anclas de requirements.md R1, incluida `grep -cF "signOut("` = 1.

## R2 — el tile Recordatorio de Inicio es solo del dueño

- [ ] (1) Escribir test que falla para R2
  - `src/screens/home/index.test.tsx`:
    `describe('#216 R2: el tile Recordatorio es solo del dueño')` con el
    `it.each` de cuatro filas y la tabla de bindings de requirements.md R2.
  - Copia el `beforeEach` y el `afterEach` del
    `describe('#71 R1: la Home dibuja la rejilla de accesos rápidos')`. La
    mascota de `listPets` y de `getPet` pasa a ser `makePet({ myRole: role })`
    dentro de cada fila.
  - Rojo esperado: `family`, `walker` y `vet` (hoy hay tres tiles). La fila
    `owner` nace verde.
  - `bunx jest --runTestsByPath src/screens/home/index.test.tsx -t "#216 R2"`
- [ ] (2) Implementación mínima que lo pasa
  - `src/screens/home/index.tsx`:
    - `isOwner` bajo `petList`;
    - `testID === 'quick-action-reminder' && !isOwner ? null : (` dentro del
      `map`.
  - Ver design.md (Inicio).
  - `bunx jest --runTestsByPath src/screens/home/index.test.tsx`
- [ ] (3) Refactor con tests verdes
  - Las anclas de requirements.md R2. `QUICK_ACTIONS` no se toca.

## R3 — Vincular collar en Inicio es solo del dueño

- [ ] (1) Escribir test que falla para R3
  - `src/screens/home/index.test.tsx`:
    `describe('#216 R3: Vincular collar en Inicio es solo del dueño')` con el
    `it.each` de cuatro filas de requirements.md R3.
  - Copia el `beforeEach` del
    `describe('R10 (mobile-device-pairing): la collar card sin collar enlaza a /pairing')`,
    salvo `mockListPets`, que pasa a cada fila.
  - Rojo esperado: `family`, `walker` y `vet`. La fila `owner` nace verde.
  - `bunx jest --runTestsByPath src/screens/home/index.test.tsx -t "#216 R3"`
- [ ] (2) Implementación mínima que lo pasa
  - `src/screens/home/index.tsx`:
    `{detail.data.pet.device === null && isOwner ? (`.
  - `bunx jest --runTestsByPath src/screens/home/index.test.tsx`
- [ ] (3) Refactor con tests verdes
  - Las anclas de requirements.md R3.

## R4 — Nuevo en Recordatorios es solo del dueño

- [ ] (1) Escribir test que falla para R4
  - `src/screens/reminders/index.test.tsx`:
    `describe('#216 R4: Nuevo es solo del dueño')` con los dos `it.each` y el
    `it` del cambio de mascota de requirements.md R4.
  - Copia el `beforeEach` del `describe('#204 R4: cabecera en contenido')`,
    salvo `mockListPets` y `mockListReminders`, que pasan a cada `it`.
  - Enmienda mecánica, en el mismo commit:
    - en `it('opens the add-reminder route')`,
      `await fireEvent.press(screen.getByTestId('reminders-add-link'));` pasa
      a `await fireEvent.press(await screen.findByTestId('reminders-add-link'));`;
    - su nombre gana ` (enmendado por #216 R4)`;
    - hoy sigue verde.
  - Rojo esperado:
    - las filas `family`, `walker` y `vet` de los dos `it.each`;
    - el `it` del cambio de mascota.
  - Las dos filas `owner` nacen verdes.
  - `bunx jest --runTestsByPath src/screens/reminders/index.test.tsx -t "#216 R4"`
- [ ] (2) Implementación mínima que lo pasa
  - `src/screens/reminders/index.tsx`:
    - `isOwner`;
    - `accessory={isOwner ? (` … `) : undefined}`;
    - la acción del `EmptyState` con la forma literal de requirements.md R4.
  - `bunx jest --runTestsByPath src/screens/reminders/index.test.tsx`
- [ ] (3) Refactor con tests verdes
  - Las anclas de requirements.md R4.

## R5 — borrar y cancelar serie son solo del dueño

- [ ] (1) Escribir test que falla para R5
  - `src/screens/reminders/index.test.tsx`:
    `describe('#216 R5: borrar y cancelar serie son solo del dueño')` con el
    `it.each` de cuatro filas de requirements.md R5 y el mismo `beforeEach`
    que R4.
  - Rojo esperado: `family`, `walker` y `vet`. La fila `owner` nace verde.
  - `bunx jest --runTestsByPath src/screens/reminders/index.test.tsx -t "#216 R5"`
- [ ] (2) Implementación mínima que lo pasa
  - `src/screens/reminders/index.tsx`: el `Button` de la fila dentro de
    `{isOwner ? (` … `) : null}`.
  - `bunx jest --runTestsByPath src/screens/reminders/index.test.tsx`
- [ ] (3) Refactor con tests verdes
  - Las anclas de requirements.md R5 (`isOwner` = 4).

## R6 — el formulario de Vincular collar es solo del dueño

- [ ] (1) Escribir test que falla para R6
  - `src/screens/pairing/index.test.tsx`:
    `describe('#216 R6: el formulario de vincular es solo del dueño')` con el
    `it.each` de cuatro filas de requirements.md R6.
  - Copia el `beforeEach` del `describe('#203 R6: botón de desvincular')`,
    salvo `mockListPets`, que pasa a cada fila.
  - En el mismo commit, las dos enmiendas de guarda de requirements.md R6:
    - la fila `// #216 R6` en `R10_PAIRING` de `src/__tests__/ui-copy-table.ts`;
    - el `+ 1`, el comentario y el nombre del `it` de `#65 R10` en
      `src/__tests__/ui-language.test.ts`.
  - Rojo esperado:
    - las filas `family`, `walker` y `vet`;
    - en `src/__tests__/ui-language.test.ts`, el `it` de `#65 R10` y
      `it('resuelve cada ocurrencia de la tabla contra la clave exacta')`:
      `checkUses` espera 2 usos de `pairing.errorForbiddenClaim` y hay 1.
  - La fila `owner` nace verde.
  - `bunx jest --runTestsByPath src/screens/pairing/index.test.tsx -t "#216 R6"`
  - `bunx jest --runTestsByPath src/__tests__/ui-language.test.ts src/__tests__/ui-copy-table.ts`
- [ ] (2) Implementación mínima que lo pasa
  - `src/screens/pairing/index.tsx`:
    - `isOwner` bajo `selectedPet`;
    - dentro del segundo `phase === 'idle' && selectedPet?.device === null`,
      `isOwner ? (<View className="gap-4" …>…</View>) : (<Text testID="pairing-owner-only" …>{t('pairing.errorForbiddenClaim')}</Text>)`.
  - Ver design.md (Vincular collar).
  - `bunx jest --runTestsByPath src/screens/pairing/index.test.tsx src/__tests__/ui-language.test.ts src/__tests__/ui-copy-table.ts`
- [ ] (3) Refactor con tests verdes
  - Las anclas de requirements.md R6.

## R7 — desvincular es solo del dueño

- [ ] (1) Escribir test que falla para R7
  - `src/screens/pairing/index.test.tsx`:
    `describe('#216 R7: desvincular es solo del dueño')` con el `it.each` de
    cuatro filas de requirements.md R7.
  - Copia el `beforeEach` del `describe('#203 R6: botón de desvincular')`,
    salvo `mockListPets`, que pasa a cada fila.
  - Rojo esperado: `family`, `walker` y `vet`. La fila `owner` nace verde.
  - `bunx jest --runTestsByPath src/screens/pairing/index.test.tsx -t "#216 R7"`
- [ ] (2) Implementación mínima que lo pasa
  - `src/screens/pairing/index.tsx`: `device-unpair-spacer` y `device-unpair`
    dentro de `{isOwner ? (<>…</>) : null}`.
  - `bunx jest --runTestsByPath src/screens/pairing/index.test.tsx`
- [ ] (3) Refactor con tests verdes
  - Las anclas de requirements.md R7 (`isOwner` = 3 en pairing).

## `it` que nacen verdes

Lista cerrada. Cada una es la fila `owner` que prueba que el dueño conserva la
acción. Nace verde a propósito, porque el dueño ya la ve hoy.

| Requisito | `it` |
|---|---|
| R2 | fila `owner` del `it.each` de `#216 R2` |
| R3 | fila `owner` del `it.each` de `#216 R3` |
| R4 | fila `owner` del `it.each` A de `#216 R4` (con recordatorios) |
| R4 | fila `owner` del `it.each` B de `#216 R4` (vacío) |
| R5 | fila `owner` del `it.each` de `#216 R5` |
| R6 | fila `owner` del `it.each` de `#216 R6` |
| R7 | fila `owner` del `it.each` de `#216 R7` |

En R1 no nace verde ninguna fila: la del dueño también espera a `getPet`.

Las enmiendas mecánicas (`#199 R22`, `opens the add-reminder route` y, si
hace falta, el helper `form()` de `#199 R7`) siguen verdes antes y después.
No son candados de #216.

## Verificación final (Codex, sin `./init.sh`)

Desde `cd /home/claude/sites/Pet-Tracker-wt-216/mobile-pet-tracker`:

- [ ] `bunx tsc --noEmit`
- [ ] `bunx jest --runTestsByPath src/screens/weight-log/index.test.tsx src/screens/home/index.test.tsx src/screens/reminders/index.test.tsx src/screens/pairing/index.test.tsx`
- [ ] `bunx jest src/__tests__ src/app/__tests__ src/components/__tests__`
      (las guardas de copy, design-drift, chunky-cta, collar-alerts,
      consistency-classnames, no-pets-states y routine).
- [ ] `bunx expo lint --no-cache > /tmp/lint-216.log 2>&1 && test ! -s /tmp/lint-216.log && echo LINT_OK`
  - Imprime `LINT_OK`. `expo lint` puede salir con 0 aunque un OOM mate a
    eslint: lo que vale es el log vacío, no el código de salida.
- [ ] `grep -noE '#216.{0,3}' src/screens/weight-log/index.tsx src/screens/home/index.tsx src/screens/reminders/index.tsx src/screens/pairing/index.tsx src/screens/weight-log/index.test.tsx src/screens/home/index.test.tsx src/screens/reminders/index.test.tsx src/screens/pairing/index.test.tsx src/__tests__/ui-copy-table.ts src/__tests__/ui-language.test.ts | grep -vE '#216 R[1-7]'`
      no da ninguna línea (regla `HEX_LITERAL`: cada `#216` va seguido de
      ` R<n>`).
- [ ] Todas las anclas de requirements.md R1–R7 dan su cifra.
- [ ] Rellenar `traceability.md` con el `it` y los dos hashes (rojo y verde)
      de cada requisito. Después no se rebasea.
- [ ] Escribir `progress/impl_mobile-role-aware-actions.md` con los comandos,
      sus salidas resumidas y las enmiendas aplicadas (incluida la condicional
      de `#199 R7`, si se aplicó).
