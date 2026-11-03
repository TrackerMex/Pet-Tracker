---
feature: "mobile-reminder-swipe-actions"
status: approved     # draft | approved
tags: [mobile, ui, spec]
---

# Tareas — [[mobile-reminder-swipe-actions]] (#228)

> Disciplina TDD. Cada tarea corresponde a un requisito de [[requirements]] y
> tiene siempre los mismos tres sub-items, en este orden. Rutas relativas a
> `mobile-pet-tracker/src/`; los comandos se lanzan desde `mobile-pet-tracker/`.
>
> - **Commits test-primero** (C4 de `CHECKPOINTS.md`): un commit rojo que solo
>   lleva tests, después el commit verde con la implementación mínima y, si
>   hace falta, uno de refactor. Mensajes en inglés, literales de este
>   documento: `test(mobile): <desc> (R<n>)` y `feat(mobile): <desc> (R<n>[, R<m>])`.
>   El móvil no tiene `prettier`.
> - **Orden.** Las tareas van en el orden de este documento, que no es el de
>   los R-ids.
> - **`./init.sh` no lo lanza Codex**; lo corre el leader.
> - **Skills.** Antes de la primera tarea de pantalla, carga las de [[design]]
>   §Skills (el leader da los nombres de Codex en el handoff).
> - **Sin dependencias nuevas.** `react-native-gesture-handler` ya está en
>   `package.json` (`~2.32.0`). No se toca `package.json`, `bun.lock` ni
>   `app.json`.

## T0 — Línea base, doble y `HIDDEN` (antes de cualquier test nuevo)

- [ ] (1) En el worktree, `cp` del `.env` y `bun install --frozen-lockfile`
  si faltan `node_modules`. **No** lanzar `./init.sh`.
- [ ] (2) Medir cada ancla de [[requirements]] §Evidencia (columna «Cuenta»)
  y de la «Tabla de enmiendas». Son **ocurrencias**:
  `grep -oF -- "<literal>" screens/reminders/index.tsx | wc -l`, o
  `grep -oE` para las dos filas con `\b`. Cada localizador de título da
  `grep -cF` → 1. Anotar en `progress/impl_mobile-reminder-swipe-actions.md`
  cualquier discrepancia **antes** de seguir. Si un ancla no da su cifra, se
  para y se reporta.
- [ ] (3) Correr la línea base, sin paréntesis en las rutas:

  ```
  bun run jest src/screens/reminders src/utils src/theme src/__tests__ src/providers src/app > ../progress/t0_mobile-reminder-swipe-actions.log 2>&1
  ```

  Si hay un SIGKILL, ese fichero cuenta 0 tests: repetir. Contar los `●` del
  log y anotarlos.
- [ ] (4) Editar `screens/reminders/index.test.tsx`, solo tests, y hacer un
  commit verde
  `test(mobile): swipeable double and hidden-query option for reminders (T0)`.
  Los cambios son tres:
  - **`HIDDEN`.** Justo después de la línea `const flat = …`, la constante
    `const HIDDEN = { includeHiddenElements: true } as const;`.
  - **El doble**, justo después del bloque
    `jest.mock('@expo/ui/community/bottom-sheet', …)`:
    - tres variables de módulo: `mockSwipeable`, un `jest.fn` que recibe las
      props; `mockSwipeableClose`, un `jest.fn()`; y
      `let mockRealSwipeable = false;`, con un `afterEach` de nivel superior
      que la devuelve a `false`;
    - `jest.mock('react-native-gesture-handler/ReanimatedSwipeable', factory)`,
      **sin** `{ virtual: true }`. El factory saca `React` y `View` con
      `jest.requireActual`, como el doble del bottom sheet, y devuelve
      `{ __esModule: true, default: <componente> }`;
    - el componente, con `mockRealSwipeable` a `true`, pinta
      `jest.requireActual(…ReanimatedSwipeable).default` con las mismas props
      y **no** llama a `mockSwipeable`. El `requireActual` se resuelve al
      pintar, no al cargar el factory;
    - si no, llama a `mockSwipeable(props)` y pinta un `View` con
      `testID={props.testID}` y dos hijos, en este orden:
      `props.renderRightActions({ value: 0 }, { value: 0 }, { close: mockSwipeableClose, openLeft: jest.fn(), openRight: jest.fn(), reset: jest.fn() })`
      y `props.children`. Es el orden del componente real: las acciones antes
      que la fila.
  - **`HIDDEN` en los helpers.** En `confirmDelete`, la pulsación de
    `` `reminder-delete-${reminderId}` `` pasa a
    `` screen.getByTestId(`reminder-delete-${reminderId}`, HIDDEN) ``. En
    `openSeriesSheet` (en el `describe` de `#213 R14`), el `findByTestId` y el
    `getByTestId` de `reminder-cancel-series-series` reciben `HIDDEN`.

  La pantalla todavía no importa el módulo, así que todo sigue verde y
  `HIDDEN` no cambia nada: el botón de hoy no está oculto. Si algo se pone
  rojo, se para y se reporta.

## R1, R10 y R11 — copy, canvas e inventario (solo el rojo)

- [ ] (1) Escribir los tests en el fichero nuevo
  `__tests__/reminder-swipe-actions-canvas-fidelity.test.ts` y hacer un solo
  commit rojo
  `test(mobile): copy, canvas fidelity and source inventory of reminder swipe actions (R1, R10, R11)`.
  - Cabecera calcada de `__tests__/reminders-upcoming-past-canvas-fidelity.test.ts`:
    `import { en, es } from '../i18n/catalog';`,
    `import { R8_REMINDERS } from './ui-copy-table';`, los dos
    `declare function require` de `fs` y `path`, `sourceRoot` y `readSource`.
  - Además:
    - `canvas(file)`, que lee de
      `join(process.cwd(), '..', 'specs', 'mobile-reminder-swipe-actions', 'canvas', file)`;
    - `count(text, literal)`, que es `text.split(literal).length - 1`.
  - Los `it` llevan los títulos exactos de R1, R10 y R11:
    - `#228 R1: el panel reutiliza las tres claves con su literal y sus invocaciones`;
    - `#228 R10: %s sigue al artboard %s`, un `it.each` sobre las siete filas
      de la tabla de R10, como `[nombre, artboard, literal del canvas, literal de producción]`.
      Cada fila aserta `count(canvas(artboard), canvasLiteral)` 1 y
      `count(readSource('screens/reminders/index.tsx'), productionLiteral)` 1;
    - `#228 R10: los tokens rosa y danger del canvas son los de global.css`,
      que lee `theme/global.css` con `readSource`;
    - `#228 R11: inventario del fuente`, con una tabla `[literal, cifra]` de
      las cifras de R11 y `count` por fila.
  - Rojo esperado: seis filas de `#228 R10: %s sigue al artboard %s` (todas
    salvo «Etiqueta en dos líneas») y `#228 R11: inventario del fuente`.
  - **Nacen verdes**, porque son invariantes que la base ya cumple:
    `#228 R1`, la fila «Etiqueta en dos líneas» de `#228 R10: %s…` y
    `#228 R10: los tokens…`. Antes del commit, una sonda por cada uno. Cada
    sonda se planta sola, se corre
    `bun run jest src/__tests__/reminder-swipe-actions-canvas-fidelity.test.ts`,
    se anota en el reporte qué `it` sale rojo, se deshace con
    `git checkout -- <fichero>` y se comprueba `git diff --quiet -- <fichero>`:

    | Sonda | Fichero | Mutación | Rojo esperado |
    |---|---|---|---|
    | S1 | `screens/reminders/index.tsx` | una de las dos `t('reminders.delete')` pasa a `t("reminders.delete")` | `#228 R1` |
    | S2 | `screens/reminders/index.tsx` | `t('reminders.cancelSeries')` pasa a `t("reminders.cancelSeries")` | `#228 R1` y la fila «Etiqueta en dos líneas» |
    | S3 | `theme/global.css` | `--color-danger: #D92D20;` pasa a `--color-danger: #D92D21;` | `#228 R10: los tokens…` |

- [ ] (2) Implementación mínima: ninguna en este commit. Se ponen verdes con
  T2.
- [ ] (3) Sin refactor aquí.

## R2, R3, R4, R5, R6, R8 y R9 — deslizable, panel y acción (solo el rojo)

- [ ] (1) Escribir los tests que fallan, un commit rojo por requisito y en
  este orden. Todos van en el `describe` nuevo de [[requirements]]
  §Requisitos funcionales, al final de `screens/reminders/index.test.tsx`,
  con su fixture de cuatro filas, su `beforeEach` y
  `afterEach(() => { jest.clearAllTimers(); jest.useRealTimers(); })`. Los
  títulos, las tablas de `it.each` y las aserciones son los de cada R-id.
  Toda consulta del panel lleva `HIDDEN`.

  | Orden | Commit rojo | Por qué falla en la base |
  |---|---|---|
  | 1 | `test(mobile): owner reminder rows sit inside a swipeable (R2)` | `mockSwipeable` no se llama y no hay `reminder-swipe-once` |
  | 2 | `test(mobile): swipe panel follows the canvas recipe and hides from screen readers (R3)` | no hay `reminder-swipe-<id>`; el botón de hoy no está oculto |
  | 3 | `test(mobile): pressing the swipe panel closes it and opens its sheet (R4)` | `mockSwipeableClose` no se llama |
  | 4 | `test(mobile): reminder rows expose their action to accessibility (R5)` | la fila no tiene `accessible` ni `accessibilityActions` |
  | 5 | `test(mobile): past reminder rows swipe too (R6)` | no hay `reminder-swipe-pastonce` |
  | 6 | `test(mobile): reminder rows drop the text button (R8)` | la fila tiene 3 hijos |
  | 7 | `test(mobile): real swipeable mounts the row and its panel (R9)` | no hay `reminder-swipe-once` |

  - En R4, la hoja de borrar se lee como
    `within(screen.getByTestId('reminders-delete-host')).getByTestId('community-bottom-sheet')`
    y se aserta `props.index` `0`.
  - En el segundo `it` de R5, `mockDeleteReminder.mockReturnValue(new Promise(() => {}))`
    va antes de pintar. En la base falla porque la fila `series` no tiene acción.
  - En R9, `mockRealSwipeable = true;` es la primera línea del `it`, antes de
    pintar.
  - Antes de cada commit, el `it` nuevo corre en rojo por la razón de la
    tabla y el resto del fichero sigue verde.
- [ ] (2) Implementación mínima: ninguna en estos commits. Se ponen verdes con
  T2.
- [ ] (3) Sin refactor aquí.

## T2 — la fila se desliza (verde)

- [ ] (1) Un solo commit verde
  `feat(mobile): reveal reminder row actions by swiping (R2, R3, R4, R5, R6, R8, R9, R10, R11)`
  con tres partes:
  - **Producción.** `screens/reminders/index.tsx` según [[design]] §D2, con
    sus literales tal cual (los cuentan R10 y R11): el import por defecto
    `import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';`
    justo después del import de `react-native`, las variables de `renderRow`,
    la fila en `const row`, la acción de accesibilidad, el borrado del bloque
    `{isOwner ? (<Button …>…</Button>) : null}`, `if (!isOwner) return row;`
    y el contenedor con el deslizable y su panel. Ningún otro cambio en el
    fichero.
  - **Candados de `screens/reminders/index.test.tsx`**, según la tabla
    «Candados en `screens/reminders/index.test.tsx`» de [[requirements]],
    todavía **sin sufijo**:
    - `HIDDEN` en las filas que lo dicen: la consulta del panel recibe
      `HIDDEN` como último argumento y su `toBeVisible()` pasa a
      `toBeOnTheScreen()`;
    - `#178 R6` (`ordena mosaico…`): `expect(row.children).toHaveLength(3);`
      pasa a `toHaveLength(2)` y se borra la línea
      ``expect(row.children[2]).toHaveProperty('props.testID', `reminder-delete-${id}`);``;
    - `#204 R8: Eliminar de fila usa la receta rosa del canvas`: tras
      `findByTestId('reminder-row-a')`, el cuerpo queda en
      `const panel = screen.getByTestId('reminder-delete-a', HIDDEN);`,
      `expect(panel.props.className).toBe('w-24 items-center justify-center gap-1 bg-category-rose');`
      y
      `expect(within(panel).getByText('Eliminar', HIDDEN).props.className).toBe('text-center text-13 font-extrabold text-danger');`.
      Se borran las tres líneas `toContain` (`button__root--variant-danger-soft`,
      `button__root--size-md`, `h-11 rounded-14 px-2.5 bg-category-rose`) y la
      del `getByText` de antes;
    - `#213 R15: la serie programada ofrece Cancelar serie y el puntual Eliminar`:
      el `mockListReminders` y la línea
      `const row = await screen.findByTestId('reminder-row-series');` no
      cambian. El resto del cuerpo pasa a, en este orden:
      1. `expect(row.props.accessibilityActions).toEqual([{ name: 'cancelSeries', label: 'Cancelar la serie Pipeta antipulgas' }]);`
      2. `const panel = within(screen.getByTestId('reminder-swipe-series')).getByTestId('reminder-cancel-series-series', HIDDEN);`
      3. `expect(panel.props.className).toBe('w-24 items-center justify-center gap-1 bg-category-rose');`
      4. `const label = within(panel).getByText('Cancelar serie', HIDDEN);`,
         `expect(label.props.children).toBe('Cancelar\nserie');` y
         `expect(label.props.className).toBe('text-center text-13 font-extrabold text-danger');`
      5. `expect(screen.queryByTestId('reminder-delete-series', HIDDEN)).toBeNull();`
      6. `expect(within(row).queryAllByRole('button', HIDDEN)).toEqual([]);`
      7. `expect(screen.getByTestId('reminder-delete-once', HIDDEN)).toHaveTextContent('Eliminar');`
      8. `expect(screen.queryByTestId('reminder-cancel-series-once', HIDDEN)).toBeNull();`

      Se borran las aserciones de `accessibilityLabel`,
      `button__root--variant-danger-soft`, `h-11 rounded-14 px-2.5 bg-category-rose`
      y `getAllByRole('button')).toHaveLength(1)`;
    - `#216 R5 con el rol %s cada fila tiene %i hijos`: la tabla pasa a
      `[['owner', 2], ['family', 2], ['walker', 2], ['vet', 2]]`. En la rama
      `owner`, las dos lecturas de `children[2]` pasan a
      `within(screen.getByTestId('reminder-swipe-reminder-1')).getByTestId('reminder-delete-reminder-1', HIDDEN)`
      y
      `within(screen.getByTestId('reminder-swipe-reminder-2')).getByTestId('reminder-cancel-series-reminder-2', HIDDEN)`,
      con `toBeOnTheScreen()`. En la otra rama se añade
      `expect(screen.queryAllByTestId(/^reminder-swipe-/)).toEqual([]);` y las
      dos consultas nulas reciben `HIDDEN`;
    - `#227 R12: Eliminar y Cancelar serie siguen en su fila…`: el helper
      `row(id)` pasa a leer `` `reminder-swipe-${id}` `` (se puede renombrar a
      `swipe`). Las consultas del panel (la del bucle de cuatro ids y la de
      `reminder-cancel-series-yesterday`) reciben `HIDDEN` y su `toBeVisible()`
      pasa a `toBeOnTheScreen()`. La consulta nula de
      `reminder-delete-yesterday` también recibe `HIDDEN`. En la rama de no dueño, la última línea pasa a
      `expect(screen.queryAllByTestId(/^reminder-(delete|cancel-series)-/, HIDDEN)).toEqual([]);`.
  - **Guards**, con los literales de la tabla «Candados de guards y de
    recuento» de [[requirements]]:
    - `__tests__/reminders-upcoming-past-canvas-fidelity.test.ts`:
      `['style={CONTINUOUS_CORNER}', 6],` pasa a
      `['style={CONTINUOUS_CORNER}', 6 + 1], // #228 R2`;
    - `__tests__/consistency-classnames.test.ts`: la fila de
      `screens/reminders/index.tsx` pasa a `4 + 1 + 1 + 1` con su comentario
      nuevo, y en los `it` `fusiona la esquina una vez…` y
      `deja CONTINUOUS_CORNER, bg-accent-soft y el acento donde estaban` se
      añade `+ 1 // #228 R2` en la línea siguiente a su `+ 1 // #227 R8`. Ese
      literal sale dos veces: se ancla por el `it`;
    - `__tests__/design-drift.test.ts`: `[/\brounded-14\b/g, 2]` pasa a
      `[/\brounded-14\b/g, 2 - 1]` y `[/\brounded-22\b/g, 1 + 1]` a
      `[/\brounded-22\b/g, 1 + 1 + 1]`;
    - `__tests__/routine-canvas-fidelity.test.ts`: se retira de `rows` la
      tupla entera `'«Eliminar» de fila'` de `#204 R15: %s sigue al canvas`.

  Antes del commit:

  ```
  bun run jest src/screens/reminders src/utils src/theme src/__tests__ src/providers src/app > ../progress/t2_mobile-reminder-swipe-actions.log 2>&1
  ```

  Debe salir verde entera:
  los siete `it` rojos de la tarea anterior, R1, R10 y R11. Un rojo que caiga
  bajo la Regla de cierre se enmienda en este commit y se anota en el
  reporte. Cualquier otro rojo se para y se reporta.

  Si R9 no puede montar el `ReanimatedSwipeable` real en jest, se para y se
  reporta con el error. **No** se sustituye por el doble ni se borra el `it`.
- [ ] (2) Sondas, sin commit. Prueban que R1, R10 y R11, que nacieron verdes
  o se pusieron verdes en bloque, muerden ya sobre el código nuevo. Mismo
  protocolo que S1 a S3, con
  `bun run jest src/screens/reminders src/__tests__/reminder-swipe-actions-canvas-fidelity.test.ts`:

  | Sonda | Mutación en `screens/reminders/index.tsx` | Rojo esperado |
  |---|---|---|
  | S4 | `{actionText}` de la etiqueta del panel pasa a `{isSeries ? t('reminders.cancelSeries') : t('reminders.delete')}` | `#228 R1` |
  | S5 | se borra `overshootRight={false}` | `#228 R2` y `#228 R11` |
  | S6 | `w-24 items-center justify-center gap-1` pasa a `w-24 items-center justify-center gap-2` | `#228 R3` y la fila «Panel» de `#228 R10` |

- [ ] (3) Refactor con tests verdes.

## R7 — quien no es dueño no se desliza (nace verde)

- [ ] (1) Escribir el test de R7 en el `describe` nuevo y hacer el commit
  `test(mobile): non-owner rows have no swipe actions (R7)`. Nace verde: la
  rama de no dueño ya no tenía botón y T2 ya la deja sin deslizable. Antes del
  commit, tres sondas con el protocolo de S1 y
  `bun run jest src/screens/reminders`:

  | Sonda | Mutación en `screens/reminders/index.tsx` | Rojo esperado |
  |---|---|---|
  | S7 | se borra `if (!isOwner) return row;` | `#228 R7` (sale `reminder-swipe-once`) |
  | S8 | en `accessibilityActions={isOwner && !deleting ? …`, se quita `isOwner && ` | `#228 R7` (la fila trae acción) |
  | S9 | en `onAccessibilityAction`, se quita `isOwner && ` | `#228 R7` (se abre la hoja) |

- [ ] (2) Implementación mínima: ninguna, ya está en T2.
- [ ] (3) Refactor con tests verdes.

## R12 — la carta (solo tras G4)

- [ ] (1) **Solo si la casilla G4 de [[requirements]] §Aprobación está
  marcada.** Si no lo está, R12 no entra en la rama: ni el test ni el bloque.
  Con G4 marcada, Codex escribe en
  `__tests__/reminder-swipe-actions-canvas-fidelity.test.ts` un
  `describe('#228 R12: enmienda de la carta', …)` con el `it` de R12, calcado
  de `describe('#204 R16: enmienda de la carta', …)` de
  `__tests__/routine-canvas-fidelity.test.ts`:
  - la ruta es `specs/mobile-reminder-swipe-actions/design.md`;
  - la regex del fence es
    ``/### Bloque «Enmienda \x23228»[\s\S]*?```markdown\n([\s\S]*?)\n```/``;
  - en la casilla, en su `normalize` y en `/^## Enmienda \x23228\b/gm`, el
    número se escribe `\x23228`, con el comentario de `\x23` que lleva el
    `it` de `#204 R16`.

  Commit rojo `test(mobile): charter carries the swipe actions amendment (R12)`.
- [ ] (2) Implementación mínima: el leader copia el bloque del fence de
  [[design]] §«Bloque «Enmienda #228»» al final de `docs/ui-guidelines.md`,
  tras una línea en blanco y sin editar líneas existentes. Commit
  `docs(ui): add the swipe actions amendment to the charter (R12)`. Medido el
  2026-11-03 sobre la base: con el bloque añadido, las 29 suites que leen la
  carta (1094 tests) siguen verdes.
- [ ] (3) Refactor con tests verdes.

Si G4 llega después del merge de la PR, R12 va en una PR aparte con estos dos
commits y su fila de [[traceability]].

## R13 — los candados enmendados nombran su enmienda

- [ ] (1) Escribir el test que falla para R13
  (`__tests__/reminder-swipe-actions-canvas-fidelity.test.ts` ·
  `#228 R13: los candados enmendados nombran su enmienda y las specs enmendadas llevan su casilla`).
  - Constante `AMENDED` con estos pares `[ruta relativa a src, localizador]`.
    Cada localizador sale exactamente en una línea de su fichero (medido en la
    base: `grep -cF` → 1 en los 31).
  - `screens/reminders/index.test.tsx`:
    - `ordena mosaico, columna y borrar con la anatomía exacta de cada fila`
    - `shows a delete action for reminders in every status`
    - `closes the confirmation sheet on cancel and native dismiss`
    - `refetches and removes the row after $kind`
    - `shows the action error for $state.kind`
    - `disables only the row being deleted while the request is pending`
    - `cierra el sheet y elimina su contenido accesible al perder foco`
    - `borra el error visible al perder foco`
    - `mantiene deshabilitada solo la fila cuyo delete sigue pendiente`
    - `pinta reminders-delete-confirm con la variante danger y bg-danger`
    - `describe('#178 R8: sheet de borrado del canvas`
    - `#218 R1: backgroundStyle del BottomSheet de borrar es exactamente el token surface`
    - `queda en el sitio del vacío que sustituye`
    - `limpia %s tras cambiar la selección a null`
    - `#204 R5: la cabecera encabeza el estado %s`
    - `#204 R8: Eliminar de fila usa la receta rosa del canvas`
    - `#204 R9: Eliminar de la hoja lleva cuerpo de 56 y labio danger`
    - `#213 R15: la serie programada ofrece Cancelar serie y el puntual Eliminar`
    - `#213 R15: una serie cancelada o enviada conserva Eliminar (%s)`
    - `#213 R17: Cancelar serie abre la hoja con su copy`
    - `#213 R17: sin nombre de mascota el cuerpo omite la mascota`
    - `#213 R17: las dos hojas comparten un solo BottomSheet`
    - `#213 R18: Mantener la serie cierra sin llamar a la API`
    - `#216 R5 con el rol %s cada fila tiene %i hijos`
    - `#227 R12: Eliminar y Cancelar serie siguen en su fila en las dos secciones y solo para el dueño`
  - `__tests__/reminders-upcoming-past-canvas-fidelity.test.ts`:
    - `#227 R11: inventario del fuente`
  - `__tests__/consistency-classnames.test.ts`:
    - `%s importa y aplica sus %i esquinas`
    - `fusiona la esquina una vez y la entrega a las dos ramas de Card`
    - `deja CONTINUOUS_CORNER, bg-accent-soft y el acento donde estaban`
  - `__tests__/design-drift.test.ts`:
    - `reserva los radios 14, 16 y 22 a Recordatorios con su inventario exacto`
  - `__tests__/routine-canvas-fidelity.test.ts`:
    - `#204 R15: %s sigue al canvas`
  - Se suma cada `it` que la Regla de cierre haya enmendado, anotado en el
    reporte.
  - Specs: las seis de [[requirements]] §Specs enmendadas
    (`mobile-reminders-recurrence`, `mobile-reminders-upcoming-past`,
    `mobile-canvas-routine`, `mobile-reminders`, `mobile-role-aware-actions`
    y `mobile-routine-canvas-fidelity`), leídas con
    `join(process.cwd(), '..', 'specs', <carpeta>, 'requirements.md')`. Esa
    parte ya está verde desde el commit de la spec.
  - Commit rojo `test(mobile): amended locks name their amendment (R13)`.
- [ ] (2) Implementación mínima que lo pasa
  (`test(mobile): suffix amended locks with #228 R13 (R13)`).
  - Añadir ` (enmendado por #228 R13)` al final del título de cada `it` (o
    del `describe`, en `#178 R8`) de `AMENDED`, detrás de los sufijos que ya
    tenga. En `shows the action error for $state.kind`, el título va en su
    propia línea y el sufijo también.
  - No cambia nada más.
- [ ] (3) Refactor con tests verdes. Corridas finales:

  ```
  bun run jest src/screens/reminders src/utils src/theme src/__tests__ src/providers src/app > ../progress/final_mobile-reminder-swipe-actions.log 2>&1
  bunx tsc --noEmit > ../progress/tsc_mobile-reminder-swipe-actions.log 2>&1 && test ! -s ../progress/tsc_mobile-reminder-swipe-actions.log
  bunx expo lint > ../progress/lint_mobile-reminder-swipe-actions.log 2>&1 && test ! -s ../progress/lint_mobile-reminder-swipe-actions.log
  ```

  Si `expo lint` falla con «Cannot find module», se repite con `--no-cache`.
  La suite completa la corre el leader con `./init.sh`.

## Notas por tarea

- **Rojos y verdes.**

  | Commit | Qué se pone verde |
  |---|---|
  | T0 | nada nuevo; todo sigue verde |
  | `R1, R10, R11` (rojo) | nace verde `#228 R1`, la fila «Etiqueta en dos líneas» y `#228 R10: los tokens…` |
  | T2 | R2 a R6, R8, R9, el resto de R10 y R11 |
  | R7 | nace verde |
  | R13 (verde) | R13 |
  | R12 (tras G4) | R12 |

  Ningún commit deja rojo un candado **ajeno**.
- **Guards en el commit que los provoca**, nunca en uno aparte posterior: un
  guard rojo entre commits rompe la cadena. El sufijo
  `(enmendado por #228 R13)` se añade solo en R13.
- **Regla de cierre** ([[requirements]] §Tabla de enmiendas). Un `it` que
  falle solo por las causas (a) a (d) se enmienda en el commit que lo provoca
  y se suma a `AMENDED`. Cualquier otro rojo se reporta y no se toca.
- **Ruido de entorno.** Un rojo en Salud `#168 R2`, Inicio `#152 R8` o
  Nutrición `#200 R9`/`R10` es un flake conocido: repetir una vez y, si pasa,
  anotarlo; no enmendar. Un `jest` con timeout bajo carga se mide de nuevo sin
  el flag.
- **Lo que no se toca:**
  - `docs/ui-guidelines.md`, salvo el commit de R12 del leader tras G4;
  - `docs/conventions.md`;
  - las seis specs enmendadas, que ya llevan su sección;
  - `i18n/catalog.ts`, `__tests__/ui-copy-table.ts` y `theme/global.css`
    (salvo la sonda S3, que se deshace);
  - `package.json`, `bun.lock`, `app.json` y `src/app/_layout.tsx`;
  - el backend.
