---
feature: "mobile-reminder-swipe-actions"
status: approved     # draft | approved
tags: [mobile, ui, spec]
---

# Requisitos — [[mobile-reminder-swipe-actions]] (#228)

> Notación EARS. Capa: móvil (`mobile-pet-tracker/`). El backend **no
> cambia**. Diseño, archivos y alternativas en [[design]]; plan TDD en
> [[tasks]]; trazabilidad en [[traceability]].

## Contexto

En Recordatorios, cada fila del dueño lleva a la derecha un botón de texto:
«Eliminar» o, en una serie programada, «Cancelar serie» en dos líneas. Los dos
botones vienen de #204 R8 y #213 R15 y comparten el ancla
`h-11 rounded-14 px-2.5 ${CATEGORY_SLOTS.rose.surface}`. Le quitan a la columna
del título el ancho del botón.

Hallazgo del smoke G2, en palabras del humano
(`progress/plan_mejoras-smoke-2026-11-03.md` §1, texto literal):

> «Utiliza el componente SwipeableRow de HeroUI para cuando se aplica la accion
> de eliminar ya que siento que quita mucho espacio los textos Eliminar y
> Cancelar serie»

Y en §6.1 del mismo plan, respuesta literal del 2026-11-03: «en agregar
componente es el mismo que decia SwipeableRow».

HeroUI Native 1.0.8, la versión instalada, **no trae** `SwipeableRow`: en
`node_modules/heroui-native` no aparece ese nombre. El plan (§2 «228») ya lo
resuelve: se usa `ReanimatedSwipeable` de
`react-native-gesture-handler/ReanimatedSwipeable`, que viene con la
dependencia ya instalada (`~2.32.0`), y se añade una acción de accesibilidad
equivalente para quien no puede deslizar.

El plan cita «#106 R15» como requisito enmendado. Es una errata: los botones de
texto los fija `#213 R15` (`specs/mobile-reminders-recurrence/requirements.md`)
sobre la receta de `#204 R8`. Esta spec enmienda los requisitos reales, que
lista en «Specs enmendadas».

Esta feature:

- quita de la fila el botón de texto;
- mete la fila del dueño en un `ReanimatedSwipeable`: al deslizar a la
  izquierda aparece un panel rosa de 96 con el icono y la misma etiqueta de
  hoy, y al pulsarlo se abre la misma hoja de hoy (borrar o Cancelar serie);
- expone esa acción como acción de accesibilidad de la fila;
- no cambia copy, hojas, API ni reglas de dueño.

## Fuentes

- **Canvas congelado** en `specs/mobile-reminder-swipe-actions/canvas/`. Son
  artboards del canvas v167, aprobados en G1 el 2026-11-03 (plan §5, casilla
  G1: «Si apruebo G1»).
  - `RecordatoriosDeslizarEliminar.dc.html`: sha256 empieza por `bee2122f`
    (fila puntual deslizada, panel «Eliminar»).
  - `RecordatoriosDeslizarSerie.dc.html`: `544c3fe5` (serie deslizada, panel
    «Cancelar serie»).
  - `RecordatoriosProximosPasados.dc.html`: `058489eb`. Es la pantalla de #227,
    solo como referencia; ningún requisito la cita.
- `progress/plan_mejoras-smoke-2026-11-03.md` §1, §2 «228», §4 (checklist),
  §5 (gates) y §6.1.
- `progress/plan_canvas-parity-2026-10-23.md` §4 y `progress/plan_ui-2026-10-26.md`
  §4 (checklist de firma).
- `docs/ui-guidelines.md` (rige toda la UI móvil), en especial la Enmienda
  #204 R8, punto 3 («Eliminar» de fila de recordatorio), que esta feature
  sustituye con G4.
- `node_modules/react-native-gesture-handler/src/components/ReanimatedSwipeable/`
  (API de `ReanimatedSwipeable` 2.32.0: `renderRightActions(progress,
  translation, methods)`, `methods.close()`, `overshootRight`, `testID`).

## Evidencia (medida en la base `77788959`, `origin/dev`)

Cuentas de **ocurrencias** (`source.split(literal).length - 1`, o
`grep -oF literal | wc -l`), no de líneas. Solo difieren de `grep -cF` en dos
filas, marcadas: `t('` (50 líneas, 56 ocurrencias, antes y después) y
`size={20} color={danger}` (después: 1 línea con 2 ocurrencias, porque las dos
ramas del ternario van en la misma línea).

`mobile-pet-tracker/src/screens/reminders/index.tsx`:

| Literal | Cuenta | Tras el cambio |
|---|---|---|
| `react-native-gesture-handler/ReanimatedSwipeable` | 0 | 1 |
| `from 'react-native-gesture-handler'` | 0 | 0 |
| `<ReanimatedSwipeable` | 0 | 1 |
| `overshootRight={false}` | 0 | 1 |
| `renderRightActions=` | 0 | 1 |
| `renderLeftActions` | 0 | 0 |
| `swipeable.close()` | 0 | 1 |
| `accessibilityActions=` | 0 | 1 |
| `onAccessibilityAction=` | 0 | 1 |
| `accessibilityElementsHidden` | 0 | 1 |
| `importantForAccessibility="no-hide-descendants"` | 0 | 1 |
| `disabled={deleting}` | 0 | 1 |
| `if (!isOwner) return row;` | 0 | 1 |
| `reminder-swipe-` | 0 | 1 |
| `<View className="overflow-hidden rounded-22" style={CONTINUOUS_CORNER}>` | 0 | 1 |
| `w-24 items-center justify-center gap-1 ${CATEGORY_SLOTS.rose.surface}` | 0 | 1 |
| `absolute inset-y-0 -left-6 w-6 ${CATEGORY_SLOTS.rose.surface}` | 0 | 1 |
| `text-center text-13 font-extrabold text-danger` | 0 | 1 |
| `size={20} color={danger}` (ocurrencias; 1 línea) | 0 | 2 |
| `variant="danger-soft"` | 1 | 0 |
| `danger-soft` | 1 | 0 |
| `isDisabled=` | 1 | 0 |
| `h-11` | 1 | 0 |
| `h-11 rounded-14 px-2.5 ${CATEGORY_SLOTS.rose.surface}` | 1 | 0 |
| `<Text className="text-13 font-extrabold text-danger">` | 1 | 0 |
| `accessibilityLabel` | 1 | 0 |
| `<Button` | 9 | 8 |
| `import { Button, Skeleton } from 'heroui-native';` | 1 | 1 |
| `<Pressable` | 1 | 2 |
| `<View` | 27 | 29 |
| `style={CONTINUOUS_CORNER}` | 6 | 7 |
| `CATEGORY_SLOTS.rose.surface` | 3 | 4 |
| `opacity: pressed` | 1 | 2 |
| `overflow-hidden` | 0 | 1 |
| `\brounded-22\b` | 2 | 3 |
| `\brounded-14\b` | 2 | 1 |
| `\brounded-16\b` | 7 | 7 |
| `<Trash` | 1 | 2 |
| `<Repeat` | 2 | 3 |
| `color={danger}` | 2 | 4 |
| `text-center` | 8 | 9 |
| `text-danger` | 5 | 5 |
| `testID=` | 47 | 48 |
| `t('` (ocurrencias; 50 líneas antes y después) | 56 | 56 |
| `t('reminders.delete')` | 2 | 2 |
| `t('reminders.cancelSeries')` | 1 | 1 |
| `t('reminders.cancelSeriesA11y'` | 1 | 1 |
| `expo-haptics` | 0 | 0 |

Otros hechos medidos en la base:

- `src/app/_layout.tsx` ya envuelve la app en `GestureHandlerRootView`. No hace
  falta tocar la raíz ni un dev build nuevo (sin G3): `ReanimatedSwipeable` es
  JS sobre módulos nativos que el dev build actual ya trae.
- `danger` ya sale de `useThemeColors` en `screens/reminders/index.tsx`, igual
  que `Trash` y `Repeat` del import de `reicon-react-native`. El import de
  iconos no cambia.
- `CATEGORY_SLOTS.rose.surface` es `bg-category-rose` y `CONTINUOUS_CORNER` es
  `{ borderCurve: 'continuous' }`.
- `theme/global.css` define una vez cada uno: `--color-category-rose: #FFF0F3;`,
  `--color-category-rose: #39131A;`, `--color-danger: #D92D20;` y
  `--color-danger: #F87171;`. Los dos artboards traen una vez cada uno
  `--rose:#FFF0F3;`, `--rose:#39131A;`, `--danger:#D92D20;` y
  `--danger:#F87171;`.
- `i18n/catalog.ts`: `'reminders.delete'` vale `'Eliminar'` / `'Delete'`,
  `'reminders.cancelSeries'` vale `'Cancelar\nserie'` / `'Cancel\nseries'` y
  `'reminders.cancelSeriesA11y'` vale `'Cancelar la serie {{title}}'` /
  `'Cancel the {{title}} series'`. `R8_REMINDERS` de `__tests__/ui-copy-table.ts`
  ya lista las tres claves para `src/screens/reminders/index.tsx`.

## Convenciones de esta spec

- Rutas relativas a `mobile-pet-tracker/src/` salvo que digan otra cosa.
- Todo `it` y `describe` nuevo empieza por `#228 R<n>` o lo contiene, y en
  todo fuente nuevo `#228` va seguido de ` R<n>`. Donde un literal de test
  necesite `#228` sin ` R<n>` (los encabezados de las specs y la casilla de la
  carta), se escribe `\x23228` dentro de la cadena.
- RNTL 14: `await` en `fireEvent` y en `act`. `within(x)` busca en los
  descendientes de `x`, no en `x`.
- El panel está oculto a accesibilidad, así que toda consulta suya lleva
  `HIDDEN`, la constante `const HIDDEN = { includeHiddenElements: true } as const;`
  de `screens/reminders/index.test.tsx`. Sobre un nodo oculto se aserta
  `toBeOnTheScreen()`, nunca `toBeVisible()`.
- Relojes: `jest.useFakeTimers({ now })` en el `beforeEach` y
  `afterEach(() => { jest.clearAllTimers(); jest.useRealTimers(); })`.
- Jest se corre por prefijo de ruta sin paréntesis (memoria
  `jest-paths-con-parentesis`).
- Skills de Codex: las que fija el handoff del leader (catálogo de
  `.claude/agents/leader.md`). Para quien especifica o revisa:
  `expo-animation`, `expo-native-ui`, `expo-design-system`.

## Copy

**No hay copy nuevo.** El panel y la acción de accesibilidad reutilizan las
tres claves que hoy pinta el botón:

| Uso | Clave | es | en |
|---|---|---|---|
| Etiqueta del panel de un puntual y etiqueta de su acción | `reminders.delete` | `Eliminar` | `Delete` |
| Etiqueta del panel de una serie | `reminders.cancelSeries` | `Cancelar\nserie` | `Cancel\nseries` |
| Etiqueta de la acción de accesibilidad de una serie | `reminders.cancelSeriesA11y` | `Cancelar la serie {{title}}` | `Cancel the {{title}} series` |

El `aria-label` del artboard de borrar («Eliminar Refuerzo de rabia») pediría
una clave nueva con `{{title}}`. No se adopta (Decisión 4).

## Requisitos funcionales

Salvo que se diga otra cosa, los tests de R2 a R9 van en
`screens/reminders/index.test.tsx`, en un `describe` nuevo al final del fichero:
`describe('Acciones de deslizar en Recordatorios (#228 R2 a R9)', …)`. Su
`beforeEach` copia el del `describe('#227: próximos y pasados', …)`:
`jest.clearAllMocks()`, reloj `new Date(2026, 11, 31, 8, 0)`, `apiUrl`,
`mockUseAuth` autenticado y `mockListPets` con `[makePet()]`. Su fixture, con
fechas locales:

| id | `status` | `dueAt` | `title` | `recurrence` | Sección |
|---|---|---|---|---|---|
| `once` | `scheduled` | `new Date(2027, 0, 1, 9, 0)` | `Refuerzo de rabia` | — | Próximos |
| `series` | `scheduled` | `new Date(2027, 0, 2, 9, 0)` | `Antibiótico` | `{ unit: 'month', every: 1 }` | Próximos |
| `pastonce` | `sent` | `new Date(2026, 11, 20, 9, 0)` | `Desparasitación` | — | Pasados |
| `pastseries` | `scheduled` | `new Date(2026, 11, 30, 9, 0)` | `Pipeta antipulgas` | `{ unit: 'month', every: 1 }` | Pasados |

El helper `confirmDelete` del fichero aserta el título `Rabies booster`, así
que los tests nuevos no lo usan: pulsan el panel y `reminders-delete-confirm` a
mano.

### Copy

- **R1**: THE SYSTEM SHALL pintar el panel y la acción de accesibilidad con las
  tres claves de «Copy», sin clave nueva ni literal nuevo, y con el mismo
  número de invocaciones que hoy.
  - Test: `__tests__/reminder-swipe-actions-canvas-fidelity.test.ts::#228 R1: el panel reutiliza las tres claves con su literal y sus invocaciones`.
  - Aserta:
    - `es['reminders.delete']` es `'Eliminar'` y `en['reminders.delete']` es
      `'Delete'`;
    - `es['reminders.cancelSeries']` es `'Cancelar\nserie'` y en `en`,
      `'Cancel\nseries'`;
    - `es['reminders.cancelSeriesA11y']` es `'Cancelar la serie {{title}}'` y
      en `en`, `'Cancel the {{title}} series'`;
    - en `screens/reminders/index.tsx`, `t('reminders.delete')` sale 2 veces,
      `t('reminders.cancelSeries')` 1 y `t('reminders.cancelSeriesA11y'` 1;
    - `R8_REMINDERS` contiene
      `{ file: 'src/screens/reminders/index.tsx', key: k }` para las tres
      claves.
  - Nace verde: es un invariante. Sonda en [[tasks]].

### Deslizable y panel

- **R2**: WHILE el usuario es dueño de la mascota seleccionada, THE SYSTEM
  SHALL envolver cada fila de recordatorio en un `ReanimatedSwipeable` con
  `testID` `reminder-swipe-<id>`, acciones solo a la derecha y sin rebote,
  dentro de un contenedor `overflow-hidden rounded-22` con esquina continua.
  - Test: `screens/reminders/index.test.tsx::#228 R2: la fila del dueño va dentro de su deslizable con el panel a la derecha y sin rebote`.
  - Con el doble de [[tasks]] §T0, para `once`:
    - la última llamada a `mockSwipeable` con `testID: 'reminder-swipe-once'`
      tiene `overshootRight` `false`, `renderRightActions` una función y
      `renderLeftActions` `undefined`;
    - `within(screen.getByTestId('reminder-swipe-once')).getByTestId('reminder-row-once')`
      existe;
    - el padre del deslizable (`swipe.parent`) tiene `className`
      `'overflow-hidden rounded-22'` y `flat(style)` igual a
      `{ borderCurve: 'continuous' }`;
    - el abuelo (`swipe.parent?.parent`) tiene `testID`
      `'reminders-entry-once'`.

- **R3**: WHILE el deslizable de una fila está montado, THE SYSTEM SHALL
  pintar a su derecha un panel de 96 de ancho con la receta del canvas, oculto
  a los lectores de pantalla:
  - `testID` `reminder-delete-<id>` en un puntual o en una serie no
    programada, y `reminder-cancel-series-<id>` en una serie `scheduled`;
  - `className` `w-24 items-center justify-center gap-1 bg-category-rose`;
  - `accessibilityElementsHidden` y
    `importantForAccessibility="no-hide-descendants"`;
  - opacidad 1 en reposo (0,8 al pulsar) y no deshabilitado;
  - tres hijos, en este orden:
    1. la franja `absolute inset-y-0 -left-6 w-6 bg-category-rose`, que tapa
       el hueco de la esquina redonda de la fila;
    2. el icono `Trash` (o `Repeat` en la serie) de 20 en `danger`;
    3. la etiqueta `text-center text-13 font-extrabold text-danger` con el
       texto de la clave de R1.
  - Test: `screens/reminders/index.test.tsx::#228 R3: el panel de %s pinta la receta del canvas y se oculta a los lectores de pantalla`
    (`it.each` sobre `['once', 'reminder-delete-once', 'reminders-icon-trash', 'Eliminar']`
    y `['series', 'reminder-cancel-series-series', 'reminders-icon-repeat', 'Cancelar\nserie']`).
  - Por cada caso:
    - `screen.queryByTestId(panelId)` es `null` (oculto a accesibilidad) y
      `within(screen.getByTestId(`reminder-swipe-${id}`)).getByTestId(panelId, HIDDEN)`
      `toBeOnTheScreen()`;
    - `props.className` es exactamente la de arriba;
    - `props.accessibilityElementsHidden` es `true` y
      `props.importantForAccessibility` es `'no-hide-descendants'`;
    - `flat(props.style)` es `{ opacity: 1 }` y
      `props.accessibilityState?.disabled` es `false`;
    - `children` tiene longitud 3: `children[0]` tiene `className`
      `'absolute inset-y-0 -left-6 w-6 bg-category-rose'`, `children[1]` tiene
      `testID` del icono, `size` `20` y `color` `'color:danger'`, y
      `children[2]` tiene `className`
      `'text-center text-13 font-extrabold text-danger'` y `props.children`
      igual a la etiqueta.

- **R4**: WHEN el dueño pulsa el panel, THE SYSTEM SHALL cerrar el deslizable
  (`close()` del tercer argumento de `renderRightActions`) y abrir la misma
  hoja que hoy abre el botón: la de borrar en `reminder-delete-<id>` y la de
  Cancelar serie en `reminder-cancel-series-<id>`. Sin llamar al API.
  - Tests:
    - `screens/reminders/index.test.tsx::#228 R4: pulsar el panel de un puntual cierra el deslizable y abre la hoja de borrar`.
      Pulsa `reminder-delete-once` con `HIDDEN`. `mockSwipeableClose` se
      llamó una vez. `community-bottom-sheet` dentro de
      `reminders-delete-host` tiene `index` `0`. Salen
      `¿Eliminar recordatorio?` y `reminders-delete-reference` con
      `Refuerzo de rabia`. `reminders-cancel-series-sheet` es nulo y
      `mockDeleteReminder` no se llamó.
    - `screens/reminders/index.test.tsx::#228 R4: pulsar el panel de una serie cierra el deslizable y abre la hoja de Cancelar serie`.
      Pulsa `reminder-cancel-series-series` con `HIDDEN`.
      `mockSwipeableClose` se llamó una vez. Sale `reminders-cancel-series-sheet`
      con `¿Cancelar la serie?` y `reminders-cancel-series-reference` con
      `Antibiótico · cada mes`. `reminders-delete-sheet` es nulo y
      `mockDeleteReminder` no se llamó.

### Accesibilidad

- **R5**: WHILE el usuario es dueño, THE SYSTEM SHALL exponer en la fila
  (`reminder-row-<id>`, `accessible`) una sola acción de accesibilidad
  equivalente al panel:
  - `{ name: 'delete', label: 'Eliminar' }` donde el panel es
    `reminder-delete-<id>`;
  - `{ name: 'cancelSeries', label: 'Cancelar la serie <title>' }` donde es
    `reminder-cancel-series-<id>`.

  WHEN se dispara esa acción, THE SYSTEM SHALL abrir la misma hoja que R4.
  WHEN se dispara otra acción, THE SYSTEM SHALL no abrir nada. WHILE el borrado
  de esa fila sigue pendiente, THE SYSTEM SHALL retirar la acción
  (`accessibilityActions` `undefined`) e ignorar su disparo.
  - Tests:
    - `screens/reminders/index.test.tsx::#228 R5: la fila de %s expone su acción de accesibilidad y abre la misma hoja`
      (`it.each` sobre `['once', 'delete', 'Eliminar', 'reminders-delete-sheet']`
      y `['series', 'cancelSeries', 'Cancelar la serie Antibiótico', 'reminders-cancel-series-sheet']`).
      La fila tiene `accessible` `true` y `accessibilityActions` igual a
      `[{ name, label }]`. Tras
      `await fireEvent(row, 'accessibilityAction', { nativeEvent: { actionName: 'activate' } })`
      no hay `community-bottom-sheet`. Tras dispararla con `name`, sale la
      hoja del caso, y la otra hoja es nula.
    - `screens/reminders/index.test.tsx::#228 R5: la fila retira su acción de accesibilidad mientras su borrado sigue pendiente`.
      `mockDeleteReminder` devuelve una promesa que no se resuelve. Pulsa
      `reminder-delete-once` con `HIDDEN` y luego `reminders-delete-confirm`.
      Entonces `reminder-row-once` tiene `accessibilityActions` `undefined`,
      el panel tiene `accessibilityState?.disabled` `true` y, tras disparar
      `delete` sobre la fila, `mockDeleteReminder` sigue con una sola llamada y
      no hay `community-bottom-sheet`. La fila `series` conserva su acción.

### Secciones y dueño

- **R6**: WHILE la sección «Pasados» está expandida, THE SYSTEM SHALL dar a
  sus filas el mismo deslizable, panel y acción que a las de Próximos, con la
  regla de R3. Solo la fila va atenuada; el deslizable, su contenedor y el
  panel no.
  - Test: `screens/reminders/index.test.tsx::#228 R6: las filas pasadas también se deslizan y solo la fila va atenuada`.
  - Tras `expandPast()`:
    - `reminder-swipe-pastonce` contiene `reminder-row-pastonce` y, con
      `HIDDEN`, `reminder-delete-pastonce`;
    - `reminder-swipe-pastseries` contiene `reminder-row-pastseries` y, con
      `HIDDEN`, `reminder-cancel-series-pastseries`;
    - las dos filas tienen un `className` que termina en `' opacity-50'`;
    - el contenedor de cada deslizable (`swipe.parent`) tiene `className`
      exactamente `'overflow-hidden rounded-22'`, y los dos paneles tienen
      `flat(style)` igual a `{ opacity: 1 }`.

- **R7**: WHILE el usuario no es dueño de la mascota seleccionada, THE SYSTEM
  SHALL pintar la fila sin deslizable, sin panel y sin acción de accesibilidad,
  e ignorar cualquier disparo de acción.
  - Test: `screens/reminders/index.test.tsx::#228 R7: quien no es dueño no tiene deslizable, panel ni acción de accesibilidad`.
  - Con `mockListPets` devolviendo `[makePet({ myRole: 'family' })]` y tras
    `expandPast()`:
    - `screen.queryAllByTestId(/^reminder-swipe-/)` es `[]`;
    - `screen.queryAllByTestId(/^reminder-(delete|cancel-series)-/, HIDDEN)`
      es `[]`;
    - las cuatro filas están montadas, con `accessibilityActions` `undefined`;
    - tras disparar `delete` sobre `reminder-row-once` y `cancelSeries` sobre
      `reminder-row-series`, no hay `community-bottom-sheet`.

- **R8**: THE SYSTEM SHALL pintar la fila con dos hijos, el mosaico y la
  columna, sin ningún botón.
  - Test: `screens/reminders/index.test.tsx::#228 R8: la fila ya no lleva botón de texto`.
  - Para `once` y `series`: `row.children` tiene longitud 2, con `testID`
    `reminder-tile-<id>` y `className` `'min-w-0 flex-1 gap-0.75'`, y
    `within(row).queryAllByRole('button', HIDDEN)` es `[]`.

### Componente real

- **R9**: WHERE el deslizable es el `ReanimatedSwipeable` real (no el doble),
  THE SYSTEM SHALL montar la fila y su panel dentro de `reminder-swipe-<id>`, y
  el panel pulsado SHALL abrir su hoja sin error.
  - Test: `screens/reminders/index.test.tsx::#228 R9: con el ReanimatedSwipeable real la fila y su panel se montan y el panel abre la hoja`.
  - Con `mockRealSwipeable = true` (el doble delega en
    `jest.requireActual`): `reminder-swipe-once` contiene `reminder-row-once`
    y, con `HIDDEN`, `reminder-delete-once`. `mockSwipeable` no se llamó. Al
    pulsar el panel con `HIDDEN` sale `¿Eliminar recordatorio?`.

### Fidelidad al canvas e inventario

- **R10**: THE SYSTEM SHALL seguir los dos artboards con estas
  correspondencias de literal, una vez en cada lado:

  | Nombre | Artboard | Literal del canvas | Literal de producción (`screens/reminders/index.tsx`) |
  |---|---|---|---|
  | Panel | `RecordatoriosDeslizarEliminar.dc.html` | `.swa{position: absolute; top: 0; right: 0; bottom: 0; width: 96px; border: 0; background: none; color: var(--danger); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; font: 800 13px Inter, system-ui, sans-serif; text-align: center; line-height: 1.15}` | `w-24 items-center justify-center gap-1 ${CATEGORY_SLOTS.rose.surface}` |
  | Etiqueta | `RecordatoriosDeslizarEliminar.dc.html` | el mismo `.swa{…}` | `text-center text-13 font-extrabold text-danger` |
  | Etiqueta en dos líneas | `RecordatoriosDeslizarSerie.dc.html` | `Cancelar<br>serie</a>` | `t('reminders.cancelSeries')` |
  | Contenedor | `RecordatoriosDeslizarEliminar.dc.html` | `.sw{position: relative; flex: none; border-radius: 22px; overflow: hidden; background: var(--rose); animation: rise 400ms ease-out 70ms both}` | `<View className="overflow-hidden rounded-22" style={CONTINUOUS_CORNER}>` |
  | Franja rosa | `RecordatoriosDeslizarSerie.dc.html` | `.sw{position: relative; flex: none; border-radius: 22px; overflow: hidden; background: var(--rose); animation: rise 400ms ease-out both}` | `absolute inset-y-0 -left-6 w-6 ${CATEGORY_SLOTS.rose.surface}` |
  | Icono de borrar | `RecordatoriosDeslizarEliminar.dc.html` | `aria-label="Eliminar Refuerzo de rabia"><svg aria-hidden="true" width="20" height="20"` | `<Trash size={20} color={danger} />` |
  | Icono de serie | `RecordatoriosDeslizarSerie.dc.html` | `aria-label="Cancelar la serie Antibiótico"><svg aria-hidden="true" width="20" height="20"` | `<Repeat size={20} color={danger} />` |

  y SHALL usar los tokens del canvas tal como los define `theme/global.css`.
  - Tests:
    - `__tests__/reminder-swipe-actions-canvas-fidelity.test.ts::#228 R10: %s sigue al artboard %s`
      (`it.each` sobre las siete filas): el literal del canvas sale una vez en
      su artboard y el de producción una vez en el fuente.
    - `__tests__/reminder-swipe-actions-canvas-fidelity.test.ts::#228 R10: los tokens rosa y danger del canvas son los de global.css`:
      cada artboard trae una vez `--rose:#FFF0F3;`, `--rose:#39131A;`,
      `--danger:#D92D20;` y `--danger:#F87171;`, y `theme/global.css` trae una
      vez `--color-category-rose: #FFF0F3;`, `--color-category-rose: #39131A;`,
      `--color-danger: #D92D20;` y `--color-danger: #F87171;`.
  - Sustituye a la fila `«Eliminar» de fila` de `#204 R15`
    (`__tests__/routine-canvas-fidelity.test.ts`), que se retira (Tabla de
    enmiendas).
  - Desvíos del canvas, a sabiendas (ver Decisiones y [[design]] §D6): sin la
    animación `peek`, sin `line-height: 1.15`, el icono `Repeat` sin la raya
    del artboard y la franja rosa en el panel en vez del fondo rosa en el
    contenedor.

- **R11**: THE SYSTEM SHALL dejar `screens/reminders/index.tsx` con este
  inventario exacto (ocurrencias):
  - 1: `react-native-gesture-handler/ReanimatedSwipeable`,
    `<ReanimatedSwipeable`, `overshootRight={false}`, `renderRightActions=`,
    `swipeable.close()`, `accessibilityActions=`, `onAccessibilityAction=`,
    `accessibilityElementsHidden`,
    `importantForAccessibility="no-hide-descendants"`, `disabled={deleting}` y
    `if (!isOwner) return row;`;
  - 0: `renderLeftActions`, `variant="danger-soft"`,
    `h-11 rounded-14 px-2.5`, `isDisabled=`, `expo-haptics` y
    `from 'react-native-gesture-handler'`;
  - `CATEGORY_SLOTS.rose.surface` 4, `<Button` 8, `opacity: pressed` 2 y
    `size={20} color={danger}` 2.
  - Test: `__tests__/reminder-swipe-actions-canvas-fidelity.test.ts::#228 R11: inventario del fuente`.

### Carta

- **R12**: WHEN el humano aprueba G4, THE SYSTEM SHALL tener al final de
  `docs/ui-guidelines.md`, una sola vez, el bloque de [[design]] §«Bloque
  «Enmienda #228»», tolerante a la firma de su casilla.
  - Test: `__tests__/reminder-swipe-actions-canvas-fidelity.test.ts::#228 R12: la carta lleva una vez el bloque de su enmienda`.
  - Mismo patrón que `#204 R16`: extrae el bloque canónico del fence
    ` ```markdown ` de `specs/mobile-reminder-swipe-actions/design.md`,
    normaliza la casilla (`- [ ]`, `- [x]` o `- [X]`) en los dos lados y
    aserta que el bloque sale exactamente una vez en la carta, que
    `^## Enmienda \x23228\b` sale una vez (flag `m`) y que la carta casa con
    `/- \[[ xX]\] Enmienda \x23228 aprobada por humano/`.
  - Bloqueado por G4: se escribe y se pone verde **solo** cuando el humano
    marque la casilla G4 de «Aprobación». Hasta entonces, ni el test ni el
    bloque entran en la rama. Ver [[tasks]] §R12.

### Enmiendas

- **R13**: THE SYSTEM SHALL mantener en verde todos los candados existentes,
  enmendando **solo** los de la «Tabla de enmiendas» y los que caigan bajo la
  «Regla de cierre». Cada uno conserva su intención y su título, con el sufijo
  ` (enmendado por #228 R13)` al final, detrás de los sufijos que ya tenga.
  Además, las seis specs de «Specs enmendadas» SHALL llevar una sola vez la
  sección `## Enmienda #228 — Acciones de deslizar en Recordatorios`, con su
  casilla.
  - Test: `__tests__/reminder-swipe-actions-canvas-fidelity.test.ts::#228 R13: los candados enmendados nombran su enmienda y las specs enmendadas llevan su casilla`.
    - Recorre la constante `AMENDED` del test: pares `[ruta, localizador]`,
      uno por fila de las tablas de enmiendas. La lista literal está en
      [[tasks]] §R13. Por cada par, exactamente **una** línea del fichero
      contiene el localizador, y esa línea contiene
      `(enmendado por #228 R13)`.
    - Para cada spec enmendada, `'## Enmienda \x23228 — Acciones de deslizar en Recordatorios'`
      sale una vez y el texto casa con
      `/- \[[ xX]\] Enmienda \x23228 aprobada/`.
  - Más la suite completa de `mobile-pet-tracker/` en verde (`./init.sh`, que
    corre el leader, no Codex).

## Tabla de enmiendas

Medida contra `77788959`. Los títulos se citan por contenido, sin número de
línea; todos los localizadores salen una sola vez en su fichero
(`grep -cF` → 1). Las cifras de los guards se **recomputan en T0** y se
enmiendan con el delta exacto. La columna «Cambio» es la intención; los
literales de cada cambio están en [[tasks]].

Ficheros de producción, relativos a `mobile-pet-tracker/src/`:

| Fichero | Cambio |
|---|---|
| `screens/reminders/index.tsx` | import de `ReanimatedSwipeable`; `renderRow` pinta la fila sin botón, con su acción de accesibilidad, y, si el usuario es dueño, la envuelve en el contenedor y el deslizable con su panel (R2 a R9). Código objetivo en [[design]] §D2. |
| `../docs/ui-guidelines.md` | Bloque «Enmienda #228» al final (R12, **G4**). |

### Candados en `screens/reminders/index.test.tsx`

Antes de cualquier test, en T0:

- la constante `HIDDEN` junto a `flat`;
- el doble de `react-native-gesture-handler/ReanimatedSwipeable` con
  `mockSwipeable`, `mockSwipeableClose` y `mockRealSwipeable` ([[tasks]] §T0);
- `HIDDEN` en la consulta con la que el helper `confirmDelete` pulsa
  `reminder-delete-<id>`, y en la búsqueda y la pulsación del panel del helper
  local `openSeriesSheet` del `describe` de `#213 R14`. Los helpers no tienen
  título y no llevan sufijo.

«`HIDDEN`» en la tabla: la consulta del panel (`reminder-delete-<id>` o
`reminder-cancel-series-<id>`) recibe `HIDDEN` como último argumento, y si el
test aserta `toBeVisible()` sobre él pasa a `toBeOnTheScreen()`. Nada más
cambia. Hasta el commit verde (T2), `HIDDEN` no cambia el resultado: el botón
de hoy no está oculto.

| `describe` · título (prefijo, sin sufijos) | Cambio |
|---|---|
| `#178 R6: fila del canvas` · `ordena mosaico, columna y borrar con la anatomía exacta de cada fila` | `expect(row.children).toHaveLength(3)` pasa a `toHaveLength(2)` y se borra la aserción de `row.children[2]` (`reminder-delete-${id}`). |
| `R7: borrar recordatorio con confirmación` · `shows a delete action for reminders in every status` | `HIDDEN` |
| ídem · `closes the confirmation sheet on cancel and native dismiss` | `HIDDEN` |
| ídem · `refetches and removes the row after $kind` | `HIDDEN` |
| ídem · `shows the action error for $state.kind` (título en su propia línea) | `HIDDEN`; el sufijo va en esa línea |
| ídem · `disables only the row being deleted while the request is pending` | `HIDDEN` en todas sus consultas del panel; `isDisabled` del botón se lee ya como `accessibilityState.disabled`, que el `Pressable` del panel también expone. |
| `cierra el sheet y elimina su contenido accesible al perder foco` | `HIDDEN` |
| `borra el error visible al perder foco` | `HIDDEN` |
| `mantiene deshabilitada solo la fila cuyo delete sigue pendiente` | `HIDDEN` |
| `pinta reminders-delete-confirm con la variante danger y bg-danger` | `HIDDEN` |
| `describe('#178 R8: sheet de borrado del canvas` | `HIDDEN` en la pulsación de su `beforeEach`; el sufijo va en el `describe`. |
| `#218 R1: backgroundStyle del BottomSheet de borrar es exactamente el token surface` | `HIDDEN` |
| `queda en el sitio del vacío que sustituye` | `HIDDEN` |
| `limpia %s tras cambiar la selección a null` | `HIDDEN` |
| `#204 R5: la cabecera encabeza el estado %s` | `HIDDEN` en la rama del error de acción (`findByTestId('reminder-delete-reminder-1')`). |
| `describe('#204 R8: Eliminar de la fila` · `#204 R8: Eliminar de fila usa la receta rosa del canvas` | Se reescribe: el panel `getByTestId('reminder-delete-a', HIDDEN)` tiene `className` `'w-24 items-center justify-center gap-1 bg-category-rose'` y `within(panel).getByText('Eliminar', HIDDEN).props.className` es `'text-center text-13 font-extrabold text-danger'`. Se borran las aserciones de `button__root--variant-danger-soft`, `button__root--size-md` y `h-11 rounded-14 px-2.5 bg-category-rose`. |
| `#204 R9: Eliminar de la hoja lleva cuerpo de 56 y labio danger` | `HIDDEN` |
| `#213 R14: series en Recordatorios` · `#213 R15: la serie programada ofrece Cancelar serie y el puntual Eliminar` | Se reescribe (detalle en [[tasks]] §T2): busca `reminder-swipe-series`; la fila tiene `accessibilityActions` `[{ name: 'cancelSeries', label: 'Cancelar la serie Pipeta antipulgas' }]`; el panel `reminder-cancel-series-series` (con `HIDDEN`) tiene la `className` de R3 y la etiqueta `'Cancelar\nserie'` con `'text-center text-13 font-extrabold text-danger'`; `reminder-delete-series` es nulo; la fila no tiene botones; `reminder-delete-once` (con `HIDDEN`) dice `Eliminar` y `reminder-cancel-series-once` es nulo. |
| ídem · `#213 R15: una serie cancelada o enviada conserva Eliminar (%s)` | `HIDDEN` |
| ídem · `#213 R17: Cancelar serie abre la hoja con su copy` | `HIDDEN` |
| ídem · `#213 R17: sin nombre de mascota el cuerpo omite la mascota` | `HIDDEN` |
| ídem · `#213 R17: las dos hojas comparten un solo BottomSheet` | `HIDDEN`, también en `reminder-delete-once` |
| ídem · `#213 R18: Mantener la serie cierra sin llamar a la API` | `HIDDEN` |
| `#216 R5 con el rol %s cada fila tiene %i hijos` | La tabla pasa a `[['owner', 2], ['family', 2], ['walker', 2], ['vet', 2]]`. Rama dueño: `within(screen.getByTestId('reminder-swipe-reminder-1')).getByTestId('reminder-delete-reminder-1', HIDDEN)` y `within(screen.getByTestId('reminder-swipe-reminder-2')).getByTestId('reminder-cancel-series-reminder-2', HIDDEN)` en lugar de leer `children[2]`. Otras ramas: `screen.queryAllByTestId(/^reminder-swipe-/)` es `[]` y las consultas nulas llevan `HIDDEN`. |
| `#227: próximos y pasados` · `#227 R12: Eliminar y Cancelar serie siguen en su fila en las dos secciones y solo para el dueño` | Se reescribe: cada `within(row(id))` pasa a `within(screen.getByTestId(`reminder-swipe-${id}`))`, las consultas del panel llevan `HIDDEN` y `toBeOnTheScreen()`. Rama no dueño: `screen.queryAllByTestId(/^reminder-(delete|cancel-series)-/, HIDDEN)` es `[]`. |

### Candados de guards y de recuento

Rutas relativas a `mobile-pet-tracker/src/`.

| Fichero · título (prefijo, sin sufijos) | Cambio |
|---|---|
| `__tests__/reminders-upcoming-past-canvas-fidelity.test.ts` · `#227 R11: inventario del fuente` | `['style={CONTINUOUS_CORNER}', 6],` pasa a `['style={CONTINUOUS_CORNER}', 6 + 1], // #228 R2` |
| `__tests__/consistency-classnames.test.ts` · `%s importa y aplica sus %i esquinas` | `[join('screens', 'reminders', 'index.tsx'), 4 + 1 + 1], // #178 R6 fila sin Card; #227 R8 caja sin próximos` pasa a `[join('screens', 'reminders', 'index.tsx'), 4 + 1 + 1 + 1], // #178 R6 fila sin Card; #227 R8 caja sin próximos; #228 R2 envoltorio de deslizar` |
| `__tests__/consistency-classnames.test.ts` · `fusiona la esquina una vez y la entrega a las dos ramas de Card` | Tras su `+ 1 // #227 R8`, se añade la línea `+ 1 // #228 R2`. |
| `__tests__/consistency-classnames.test.ts` · `#98 R10: los candados que esta feature no mueve` › `deja CONTINUOUS_CORNER, bg-accent-soft y el acento donde estaban` | Tras su `+ 1 // #227 R8`, se añade la línea `+ 1 // #228 R2`. El literal `+ 1 // #227 R8` sale dos veces (`grep -cF` → 2): hay que anclar por el `it`. |
| `__tests__/design-drift.test.ts` · `reserva los radios 14, 16 y 22 a Recordatorios con su inventario exacto` | `[/\brounded-14\b/g, 2]` pasa a `[/\brounded-14\b/g, 2 - 1]` y `[/\brounded-22\b/g, 1 + 1]` a `[/\brounded-22\b/g, 1 + 1 + 1]`. `rounded-16` no cambia y `outsideReminders(/\brounded-22\b/)` sigue en `['screens/pairing/index.tsx']`. |
| `__tests__/routine-canvas-fidelity.test.ts` · `#204 R15: %s sigue al canvas` | Se retira de `rows` la tupla entera `'«Eliminar» de fila'` (canvas `height: 44px; padding: 0 10px; …`, producción `h-11 rounded-14 px-2.5 ${CATEGORY_SLOTS.rose.surface}` y `<Text className="text-13 font-extrabold text-danger">`). La sustituye R10. |

**Sufijo.** Todas las filas de las dos tablas reciben
` (enmendado por #228 R13)` al final de su título, detrás de los sufijos que ya
tengan. En `#178 R8` el sufijo va en el título del `describe`. Los
localizadores de `#227 R13` son subcadenas de esos títulos y siguen valiendo.

**Regla de cierre.** En T0, Codex corre `src/screens/reminders`, `src/utils`,
`src/theme`, `src/__tests__`, `src/providers` y `src/app`. Un `it` que falle
**solo** por una de estas causas se enmienda igual que los de la tabla: misma
intención, mismo sufijo, una fila más en `AMENDED` y anotado en
`progress/impl_mobile-reminder-swipe-actions.md` con su ruta y su título.

- (a) Consulta el panel sin `HIDDEN` o le aserta `toBeVisible()`.
- (b) Cuenta los hijos o los botones de la fila, o lee el botón como su tercer
  hijo.
- (c) Lee el botón como `Button` de HeroUI (`button__root…`, `isDisabled`,
  `accessibilityLabel` del botón).
- (d) Uno de los deltas de inventario de esta spec: una esquina, un
  `rounded-22`, un `rounded-14` menos, un `CATEGORY_SLOTS.rose.surface` más,
  un `<Button` menos, un `<Pressable` más o un `opacity: pressed` más.

Un rojo **fuera** de esas rutas, o por otra causa, **se reporta y no se toca**.

Candados que **no** cambian y que la implementación debe respetar:

- `#204 R4`, `#204 R5`, `#204 R7` y `#204 R9`: el marco, las píldoras, el
  ámbar de hoy y la hoja de borrar.
- `#204 R16`: el bloque de la Enmienda #204 R16 en la carta sigue igual. La
  Enmienda #228 se **añade** al final; no edita líneas existentes.
- `#204 R17`, `#193 R11` y `#181 R8.3`: grep-limpio (sin hex, sin
  `StyleSheet.create`, sin clases `[...]`, sin sombras literales) y `#NNN`
  seguido de ` R<n>` en comentarios de producción.
- `#213 R17` a `#213 R21`: la hoja de Cancelar serie, su copy y `petId`.
- `#216 R4`: dueño.
- `#218 R3`: la superficie de la hoja.
- `#155 R6` y `#178 R9`: el vacío con `EmptyState`.
- El resto de `#227` (`R1` a `R10`, `R11` salvo el inventario y `R13`).
- Los guards de copy (`ui-copy-table.ts`, `SCREEN_FILES`, `R8_REMINDERS`), el
  import de iconos de `design-drift` y `zones-canvas-fidelity`
  (`expect(charter).not.toContain("bg-danger-soft`)")`: el bloque de la carta no
  lleva ese literal).

### Specs enmendadas

Cada una recibe, desde el commit de esta spec, la sección
`## Enmienda #228 — Acciones de deslizar en Recordatorios` al final del
fichero, salvo `specs/mobile-reminders/requirements.md`, donde va justo antes de
`## Aprobación`. La sección lleva «Spec enmendada», «Qué cambia», «Qué no
cambia» y la casilla `- [ ] Enmienda #228 aprobada (fecha: ____)`.

| Spec (ruta) | R-id | Qué cambia |
|---|---|---|
| `specs/mobile-reminders-recurrence/requirements.md` | `#213 R15` | El botón «Cancelar serie» / «Eliminar» de la fila pasa al panel del deslizable (R3, R4). Su `accessibilityLabel` pasa a ser la etiqueta de la acción `cancelSeries` de la fila (R5). Es el requisito que el plan cita como «#106 R15». |
| `specs/mobile-reminders-upcoming-past/requirements.md` | `#227 R12`, `#227 R11` | En R12, «dentro de la fila» pasa a «en el panel del deslizable de la fila» (R6, R7). En R11, el inventario de `style={CONTINUOUS_CORNER}` pasa de 6 a 7. |
| `specs/mobile-canvas-routine/requirements.md` | `#204 R8`, `#204 R15` | En R8, la receta del botón (`danger-soft`, `h-11 rounded-14 px-2.5`, rosa) pasa a la del panel (R3). En R15 se retira la fila «Eliminar» de fila (R10). El punto 3 de su bloque de la carta lo sustituye la Enmienda #228 (G4). |
| `specs/mobile-reminders/requirements.md` | `#39 R7` | La acción de borrar por fila pasa de botón visible a panel al deslizar más acción de accesibilidad (R2 a R5). La hoja de confirmación y el borrado no cambian. |
| `specs/mobile-role-aware-actions/requirements.md` | `#216 R5` | La fila del dueño tiene dos hijos, no tres. La acción de dueño vive en el deslizable, que el no dueño no tiene (R7, R8). |
| `specs/mobile-routine-canvas-fidelity/requirements.md` | `#178 R6` | La anatomía de la fila pasa de mosaico, columna y borrar (3 hijos) a mosaico y columna (2 hijos) (R8). |

## Paso de smoke nuevo (G2)

El leader lo añade a `progress/smoke_mejoras-smoke.md` al mergear, bajo
`## #228 mobile-reminder-swipe-actions`. Reproduce la queja original:

1. En el dev build de Android, como dueño, abre Recordatorios con un
   recordatorio puntual, una serie programada y uno pasado. Ninguna fila lleva
   botón «Eliminar» ni «Cancelar serie»; el título de cada fila ocupa el ancho
   que antes ocupaba el botón.
2. Desliza a la izquierda una fila de Próximos: aparece el panel rosa con la
   papelera y «Eliminar», con esquinas redondas y sin hueco blanco entre la
   fila y el panel. Pulsa el panel: el deslizable se cierra y se abre la hoja
   «¿Eliminar recordatorio?». Cancela.
3. Expande «Pasados» y desliza una fila: el panel sale igual, sin atenuar,
   aunque la fila sí lo esté. Pulsa: se abre la misma hoja.
4. Desliza la serie: el panel dice «Cancelar serie» en dos líneas y abre la
   hoja de Cancelar serie de #213.
5. Con TalkBack activo, en una fila puntual y en la serie, abre las acciones
   del lector: salen «Eliminar» y «Cancelar la serie <título>», y cada una abre
   su hoja. El panel no se anuncia aparte.
6. Desplaza la lista en vertical con un gesto algo diagonal: la lista se
   desplaza y ninguna fila se abre sin querer. Suelta un deslizamiento corto:
   la fila vuelve a su sitio sin rebote.
7. Como familiar (rol `family`), la fila no se desliza.
8. Repite 2 a 4 en tema claro y oscuro.

## Fuera de alcance

- Háptica al abrir el panel (sin `expo-haptics`).
- Cerrar automáticamente la fila abierta al abrir otra.
- Acciones a la izquierda y borrar con un deslizamiento completo.
- Deshacer tras borrar.
- La animación `peek` del canvas (la fila se asoma sola al entrar), el
  `line-height: 1.15` de la etiqueta y la raya del icono de serie del canvas.
- Copy nuevo, incluido el `aria-label` con título del artboard de borrar.
- Las hojas de borrar y Cancelar serie, el API y el backend.
- Un dev build nuevo (sin G3): no hay dependencia nativa nueva.
- El smoke en dispositivo (G2), que corre el humano.

## Decisiones

El `spec_author` cierra cinco puntos que el leader pidió dejar decididos.
Ninguno cambia copy ni artboards aprobados en G1.

1. **Componente: `ReanimatedSwipeable` de
   `react-native-gesture-handler/ReanimatedSwipeable`.** El humano pidió el
   `SwipeableRow` de HeroUI, que no existe en HeroUI Native 1.0.8; el plan
   (§2 «228», §6.1) ya fijó este sustituto. Va con `testID`,
   `overshootRight={false}` y solo `renderRightActions`. No hay dependencia
   nueva ni dev build nuevo. Se descartan el `Swipeable` heredado de RNGH, un
   `Gesture.Pan` propio y esperar a HeroUI ([[design]] §Alternativas).
2. **Accesibilidad: el panel se oculta y la fila expone la acción.** El panel
   lleva `accessibilityElementsHidden` e
   `importantForAccessibility="no-hide-descendants"`, porque sin deslizar no
   se ve. La fila es `accessible` y lleva una acción `delete` («Eliminar») o
   `cancelSeries` («Cancelar la serie <título>»), que hace lo mismo que el
   panel. De aquí salen las enmiendas a `#213 R15`, `#204 R8`, `#39 R7`,
   `#178 R6`, `#216 R5` y `#227 R12`, y la Enmienda #228 de la carta, que
   sustituye el punto 3 de la Enmienda #204 (G4).
3. **Qué filas se deslizan: todas las del dueño, en las dos secciones.** La
   regla del panel es la del botón de hoy: `reminder-cancel-series-<id>` en una
   serie `scheduled` y `reminder-delete-<id>` en el resto, sea cual sea su
   estado. Quien no es dueño no tiene deslizable (`if (!isOwner) return row;`).
4. **Copy: sin claves nuevas.** El panel y la acción reutilizan
   `reminders.delete`, `reminders.cancelSeries` y `reminders.cancelSeriesA11y`.
   La etiqueta de la acción de borrar es «Eliminar», sin el título que lleva el
   `aria-label` del artboard: la fila ya anuncia su título y el título en la
   etiqueta pediría una clave nueva con G1.
5. **Jest: doble del módulo más el componente real en un test.** En
   `screens/reminders/index.test.tsx`, `jest.mock` no virtual de
   `react-native-gesture-handler/ReanimatedSwipeable` con un doble que pinta
   siempre el panel (`renderRightActions` con un `close` espía) delante de la
   fila y registra sus props. Una bandera hace que delegue en
   `jest.requireActual` para R9, que prueba el contrato real. Las consultas del
   panel llevan `HIDDEN`.

Además:

- **G4 no se delega.** El bloque de la carta y R12 esperan a la casilla G4.
- **Sin háptica** ni autocierre de otras filas (Fuera de alcance).
- **Desvíos del canvas** listados en R10: no se pinta el fondo rosa en el
  contenedor porque la fila pasada va al 50 % y dejaría ver el rosa a través;
  la franja rosa del panel tapa el hueco de la esquina.

Recuento de `SCREEN_FILES` (checklist de `plan_ui-2026-10-26.md` §4): no
cambia. `src/screens/reminders/index.tsx` ya figura en `R8_REMINDERS` con las
tres claves. No se retira ni se añade ninguna clave de copy.

## Aprobación

- [x] Aprobado por humano (fecha: 2026-11-03) ← gate obligatorio antes de implementar
  (firma delegada del leader con la checklist de
  `progress/plan_canvas-parity-2026-10-23.md` §4, los tres puntos del §4 de
  `progress/plan_ui-2026-10-26.md` y los dos de
  `progress/plan_mejoras-smoke-2026-11-03.md` §4; G1 aprobado por el humano en
  el canvas v167; mandato del humano 2026-10-23, ampliado 2026-11-03)
- [ ] **G4**: enmienda de `docs/ui-guidelines.md` (bloque «Enmienda #228» de
  [[design]], que sustituye el punto 3 de la Enmienda #204) (fecha: ____) ←
  gate humano, no delegado; desbloquea R12
- [ ] **G2**: smoke en el dev build de Android (pasos de «Paso de smoke
  nuevo», tema claro y oscuro) (fecha: ____) ← gate humano, por lote al final;
  lo registra `progress/smoke_mejoras-smoke.md`
- Base congelada: `77788959` (`origin/dev`).
