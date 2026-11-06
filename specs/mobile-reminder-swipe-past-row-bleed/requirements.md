---
feature: "mobile-reminder-swipe-past-row-bleed"
status: approved      # draft | approved
tags: [mobile, ui, spec]
---

# Requisitos — [[mobile-reminder-swipe-past-row-bleed]] (#239)

> Notación EARS. Capa: móvil (`mobile-pet-tracker/`). El backend **no
> cambia**. Diseño, archivos y alternativas en [[design]]; plan TDD en
> [[tasks]]; trazabilidad en [[traceability]].

## Contexto

Hallazgo del smoke G2 del lote del 2026-11-03, en palabras del humano
(`progress/plan_arreglos-smoke-2026-11-04.md` §1, texto literal):

> «En recordatorios en la lista de PASADOS al aplicar la accion de eliminar sale
> el boton de eliminar pero el color rojo no se oculta, debe de quedar como en la
> lista de PROXIMOS si hace bien el funcionamiento»

Es el paso 3 del smoke de #228 («Expande «Pasados» y desliza una fila…»).

Causa, medida contra la base:

- La fila pasada va al 50 % (`${past ? ' opacity-50' : ''}`, #227 R7).
- El panel del deslizable (#228 R3) lleva la franja
  `absolute inset-y-0 -left-6 w-6 ${CATEGORY_SLOTS.rose.surface}`: 24 de ancho,
  pegada a la izquierda del panel y, por tanto, **debajo** de los 24 de la
  derecha de la fila abierta. La carta la describe «bajo la esquina de la fila»
  (Enmienda #228, punto 1).
- En Próximos la fila es opaca (`bg-surface`) y la franja solo se ve en el hueco
  que dejan sus esquinas redondas. En Pasados la fila deja pasar la mitad de lo
  que tiene debajo, y lo que tiene debajo es la franja rosa: el «color rojo»
  que no se oculta.
- En reposo el panel tiene opacidad 0 y no se ve nada; por eso el fallo solo
  aparece con la fila abierta.

`specs/mobile-reminder-swipe-actions/design.md` §Riesgos ya lo anticipaba («Si
molesta, la salida es acortar la franja a la esquina (otra feature)»). Esta spec
mide esa salida y elige otra ([[design]] §Decisiones técnicas): dar a la fila
pasada del dueño una **base opaca** del mismo color que el fondo de la pantalla,
dentro del deslizable. La fila sigue al 50 % encima de esa base.

Esta feature:

- mete la fila pasada del dueño en una base `rounded-22 bg-background` con
  `CONTINUOUS_CORNER`, dentro del `ReanimatedSwipeable`;
- no cambia la fila, su opacidad, el panel, la franja, el contenedor, las hojas,
  las acciones de accesibilidad, los gestos, Próximos ni la rama de quien no es
  dueño;
- no cambia copy, API ni dependencias.

## Fuentes

- **Plan**: `progress/plan_arreglos-smoke-2026-11-04.md` §1 (texto literal) y
  §2 «239».
- **Spec del deslizable**: `specs/mobile-reminder-swipe-actions/` (#228): R2,
  R3, R6, R9 y R10; su `design.md` D3, D4 y §Riesgos.
- **Canvas**: los artboards de #228, congelados en
  `specs/mobile-reminder-swipe-actions/canvas/`
  (`RecordatoriosDeslizarEliminar.dc.html` y
  `RecordatoriosDeslizarSerie.dc.html`, canvas v167, G1 del 2026-11-03).
  Dibujan una fila **opaca** deslizada: el aspecto que esta spec da a la fila
  pasada abierta. No hace falta artboard nuevo (no hay G1).
- **Carta**: `docs/ui-guidelines.md`, Enmienda #228 (punto 1), la reserva de
  `rounded-22` para la «fila de Recordatorios» (§radios, «Fuera de la escala,
  por fidelidad al canvas (#178)») y el corolario «toda esquina no-cápsula que
  el repo dibuja por su cuenta declara `style={CONTINUOUS_CORNER}`».
- **Tokens**: `mobile-pet-tracker/src/theme/global.css`.
- **Componente**: `node_modules/react-native-gesture-handler/src/components/ReanimatedSwipeable/ReanimatedSwipeable.tsx`
  (`react-native-gesture-handler` 2.32.0, ya instalado).

## Evidencia (medida en la base `0f1ab26f`, `origin/dev`)

**Estructura del deslizable.** `ReanimatedSwipeable` pinta un `Animated.View`
con `overflow: 'hidden'`; dentro, las acciones de la derecha en una capa
`absoluteFill` con `flexDirection: 'row-reverse'` (opacidad 0 en reposo, 1 al
abrir), y después, bajo el `GestureDetector`, el `Animated.View` con
`translateX` que lleva `{children}`. Los hijos se pintan **encima** de las
acciones y se mueven con el dedo. Una base metida entre el deslizable y la fila
se mueve con la fila y tapa lo que la fila tapa.

**Lo que hay detrás de una fila pasada en reposo.** De dentro afuera: `RiseIn`
(`reminders-entry-<id>`, sin `className`), `reminders-past-list` (`gap-3`),
`reminders-past` (`gap-3`), el contenedor del `ScrollView` (solo padding y gap)
y el `ScrollView` `screen-reminders`, `className="flex-1 bg-background"`.
Ninguno pinta fondo salvo el último. La fila pasada se compone hoy sobre
`bg-background`.

**Colores** (`theme/global.css`):

| Token | Claro | Oscuro |
|---|---|---|
| `--background` | `#FFFFFF` | `#0D1117` |
| `--surface` | `#FFFFFF` | `#161B22` |
| `--border` | `rgba(13,17,23,0.08)` | `rgba(255,255,255,0.08)` |
| `--color-category-rose` | `#FFF0F3` | `#39131A` |

- Hoy, en reposo: oscuro, `--surface` al 50 % sobre `--background` da
  rgb(17.5, 22, 28.5); claro, blanco sobre blanco. El borde llega al 50 % de su
  alfa en los dos temas.
- Con la base `bg-background`: la fila al 50 % se compone sobre el **mismo**
  color que hoy, en los dos temas. En reposo no cambia ni un píxel (R1).
- Abierta: la base tapa la franja debajo de la fila. Solo queda a la vista el
  rosa del hueco de las esquinas, porque la base es `rounded-22` con
  `CONTINUOUS_CORNER`, como la fila. Es lo que pasa hoy en Próximos.

**Anclas de `screens/reminders/index.tsx`.** Son **ocurrencias**
(`grep -oF -- "<literal>" | wc -l`).

| Literal | Hoy | Tras #239 |
|---|---|---|
| `<View className="rounded-22 bg-background" style={CONTINUOUS_CORNER}>` | 0 | 1 |
| `style={CONTINUOUS_CORNER}` | 7 | 8 |
| `rounded-22` (también `\brounded-22\b`) | 3 | 4 |
| `bg-background` | 3 | 4 |
| `<View` | 29 | 30 |
| `{past ? (` | 0 | 1 |
| `) : row}` | 0 | 1 |
| `{row}` | 1 | 1 |
| `${past ? ' opacity-50' : ''}` | 1 | 1 |
| ` opacity-50` | 1 | 1 |
| `testID=` | 48 | 48 |
| `bg-surface` | 6 | 6 |
| `CATEGORY_SLOTS.rose.surface` | 4 | 4 |
| `overflow-hidden` | 1 | 1 |
| `if (!isOwner) return row;` | 1 | 1 |
| `<View className="overflow-hidden rounded-22" style={CONTINUOUS_CORNER}>` | 1 | 1 |
| `absolute inset-y-0 -left-6 w-6 ${CATEGORY_SLOTS.rose.surface}` | 1 | 1 |
| `needsOffscreenAlphaCompositing` | 0 | 0 |
| `renderToHardwareTextureAndroid` | 0 | 0 |
| `childrenContainerStyle` | 0 | 0 |

`View` y `CONTINUOUS_CORNER` ya están importados en el fichero: los imports no
cambian.

## Convenciones de esta spec

- Rutas relativas a `mobile-pet-tracker/src/` salvo que digan otra cosa.
- Todo `it` y `describe` nuevo empieza por `#239 R<n>` o lo contiene, y en
  todo fuente nuevo `#239` va seguido de ` R<n>`. Donde un literal de test
  necesite `#239` sin ` R<n>` (el encabezado de la spec enmendada y su
  casilla), se escribe `\x23239` dentro de la cadena. Los identificadores no
  llevan `239`.
- RNTL 14: `await` en `fireEvent` y en `act`. `within(x)` busca en los
  descendientes de `x`, no en `x`. `.parent` devuelve el nodo host padre.
- Nada de `toBe` ni `toEqual` entre dos nodos host (tumba el worker de jest):
  se comparan `testID`, `className` o longitudes con `toHaveLength` y
  `toHaveProperty`.
- El panel está oculto a accesibilidad: toda consulta suya lleva `HIDDEN`
  (`const HIDDEN = { includeHiddenElements: true } as const;`, ya en
  `screens/reminders/index.test.tsx`) y sobre él se aserta
  `toBeOnTheScreen()`, nunca `toBeVisible()`.
- Relojes: `jest.useFakeTimers({ now })` en el `beforeEach` y
  `afterEach(() => { jest.clearAllTimers(); jest.useRealTimers(); })`.
- En los tests, ni `StyleSheet` ni hex: `design-drift` lee también
  `screens/reminders/index.test.tsx`.
- Jest se corre por prefijo de ruta sin paréntesis.
- Skills de Codex: las que fija el handoff del leader (catálogo de
  `.claude/agents/leader.md`). Para quien especifica o revisa:
  `expo-animation`, `expo-native-ui`, `expo-design-system`.

## Copy

**No hay copy nuevo.** No se añade, retira ni mueve ninguna clave.
`SCREEN_FILES` y `R8_REMINDERS` no cambian.

## Requisitos funcionales

Los tests de R1 a R5 van en `screens/reminders/index.test.tsx`, en un
`describe` nuevo al final del fichero:
`describe('Base opaca de la fila pasada (#239 R1 a R5)', …)`. Su `beforeEach` y
su `afterEach` son copia literal de los de
`describe('Acciones de deslizar en Recordatorios (#228 R2 a R9)', …)`: reloj
falso en `new Date(2026, 11, 31, 8, 0)`, sesión autenticada, una mascota dueña
(`makePet()`) y los cuatro recordatorios `once`, `series` (Próximos),
`pastonce` (enviado, puntual, «Desparasitación») y `pastseries` (serie
programada, «Pipeta antipulgas»). Cada `it` que mire Pasados hace
`await screen.findByTestId('reminders-past-toggle')`, `await expandPast()` y
`await screen.findByTestId('reminder-row-pastonce')` antes de asertar. Se usa el
doble de `ReanimatedSwipeable` que ya tiene el fichero, salvo en R5.

### Base de la fila pasada

- **R1**: WHILE el usuario es dueño de la mascota, WHEN Recordatorios pinta una
  fila de Pasados, THE SYSTEM SHALL meter esa fila, dentro de su
  `ReanimatedSwipeable`, en una base `View` con `className`
  `'rounded-22 bg-background'` y `style={CONTINUOUS_CORNER}`. La base no lleva
  `testID`, opacidad ni props de accesibilidad, y su único hijo es la fila. La
  fila conserva su `className` de hoy, con ` opacity-50` al final.
  - Test: `screens/reminders/index.test.tsx::#239 R1: la fila pasada del dueño va sobre una base opaca dentro de su deslizable`.
    - Para `pastonce` y para `pastseries`: `row` es
      `within(screen.getByTestId('reminder-swipe-<id>')).getByTestId('reminder-row-<id>')`.
    - `row.parent?.props.className` es `'rounded-22 bg-background'`.
    - `flat(row.parent?.props.style)` es `{ borderCurve: 'continuous' }`.
    - `row.parent?.props.testID` es `undefined`.
    - `row.parent?.parent?.props.testID` es `'reminder-swipe-<id>'`.
    - `row.parent?.children` tiene longitud 1 y su elemento 0 tiene
      `props.testID` `'reminder-row-<id>'`.
    - `row.props.className` casa con `/ opacity-50$/`.
    - `screen.getByTestId('screen-reminders').props.className` es
      `'flex-1 bg-background'`: el color de la base es el del fondo que la fila
      tiene hoy detrás.
  - Rojo antes de implementar: el padre de la fila es el deslizable.

- **R2**: WHILE el usuario es dueño, WHEN Recordatorios pinta una fila de
  Pasados, THE SYSTEM SHALL dejar el panel, su franja y su opacidad fuera de la
  base y como en Próximos: el panel es hijo directo del deslizable, la franja
  sigue siendo su primer hijo con
  `'absolute inset-y-0 -left-6 w-6 bg-category-rose'` y el estilo del panel en
  reposo es `{ opacity: 1 }`.
  - Test: `screens/reminders/index.test.tsx::#239 R2: la base no envuelve el panel y la franja de Pasados es la de Próximos`.
    - Para `['pastonce', 'reminder-delete-pastonce']` y
      `['pastseries', 'reminder-cancel-series-pastseries']`, con `row` como en
      R1 y `panel` = `within(swipe).getByTestId(panelId, HIDDEN)`:
    - la base (`row.parent`) existe y
      `within(base).queryByTestId(panelId, HIDDEN)` es `null`;
    - `panel.parent?.props.testID` es `'reminder-swipe-<id>'`;
    - `panel.props.className` es
      `'w-24 items-center justify-center gap-1 bg-category-rose'`;
    - `panel.children` tiene longitud 3 y `panel.children[0]` tiene
      `props.className` `'absolute inset-y-0 -left-6 w-6 bg-category-rose'`;
    - `flat(panel.props.style)` es `{ opacity: 1 }`.
  - Rojo antes de implementar: sin base, `row.parent` es el deslizable y
    contiene el panel.

### Lo que no lleva base

- **R3**: WHILE el usuario es dueño, WHEN Recordatorios pinta una fila de
  Próximos, THE SYSTEM SHALL dejarla como hijo directo de su
  `ReanimatedSwipeable`, sin base.
  - Test: `screens/reminders/index.test.tsx::#239 R3: las filas de Próximos no llevan base`.
    - Sin expandir Pasados, tras `await screen.findByTestId('reminder-row-series')`,
      para `once` y `series`:
      `screen.getByTestId('reminder-row-<id>').parent?.props.testID` es
      `'reminder-swipe-<id>'` y `….parent?.props.className` es `undefined`.
  - Nace verde. Lo prueba la sonda S1 de [[tasks]].

- **R4**: WHILE el usuario no es dueño de la mascota, WHEN Recordatorios pinta
  una fila de Pasados, THE SYSTEM SHALL pintarla sin deslizable y sin base,
  como hijo directo de su entrada `reminders-entry-<id>`.
  - Test: `screens/reminders/index.test.tsx::#239 R4: quien no es dueño no lleva base en Pasados`.
    - `mockListPets` resuelve `{ kind: 'ok', pets: [makePet({ myRole: 'family' })] }`.
    - Tras expandir Pasados, para `pastonce` y `pastseries`:
      `screen.getByTestId('reminder-row-<id>').parent?.props.testID` es
      `'reminders-entry-<id>'`.
  - Nace verde. Lo prueba la sonda S2 de [[tasks]].

### Componente real

- **R5**: WHEN Recordatorios pinta una fila de Pasados del dueño con el
  `ReanimatedSwipeable` real, THE SYSTEM SHALL montarla sobre su base dentro
  del deslizable, con el panel montado, y WHEN se pulsa el panel, THE SYSTEM
  SHALL abrir la misma hoja de borrar que en Próximos.
  - Test: `screens/reminders/index.test.tsx::#239 R5: con el ReanimatedSwipeable real la fila pasada va sobre su base y el panel abre la hoja`.
    - `mockRealSwipeable = true` al empezar el `it` (el `afterEach` de nivel
      superior lo devuelve a `false`).
    - Tras expandir Pasados:
      `within(screen.getByTestId('reminder-swipe-pastonce')).getByTestId('reminder-row-pastonce').parent?.props.className`
      es `'rounded-22 bg-background'`.
    - `within(swipe).getByTestId('reminder-delete-pastonce', HIDDEN)` está en
      pantalla (`toBeOnTheScreen()`).
    - `mockSwipeable` no se ha llamado.
    - Tras `await fireEvent.press(panel)`: `screen.getByText('¿Eliminar recordatorio?')`
      está en pantalla y `screen.getByTestId('reminders-delete-reference')`
      tiene el texto `'Desparasitación'`.
  - Rojo antes de implementar: el padre de la fila es el `Animated.View` del
    deslizable, sin `className`.

### Inventario

- **R6**: THE SYSTEM SHALL mantener en `screens/reminders/index.tsx` este
  inventario exacto de ocurrencias.
  - Test: `__tests__/reminder-swipe-actions-canvas-fidelity.test.ts::#239 R6: inventario del fuente`.
    - Al final del fichero. Lee el fuente con el `readSource` del fichero y
      cuenta con su `count`, sobre una tabla `[literal, cifra]`:

      | Literal | Cifra |
      |---|---|
      | `<View className="rounded-22 bg-background" style={CONTINUOUS_CORNER}>` | 1 |
      | `{past ? (` | 1 |
      | `) : row}` | 1 |
      | `${past ? ' opacity-50' : ''}` | 1 |
      | ` opacity-50` | 1 |
      | `bg-background` | 4 |
      | `absolute inset-y-0 -left-6 w-6 ${CATEGORY_SLOTS.rose.surface}` | 1 |
      | `<View className="overflow-hidden rounded-22" style={CONTINUOUS_CORNER}>` | 1 |
      | `testID=` | 48 |
      | `needsOffscreenAlphaCompositing` | 0 |
      | `renderToHardwareTextureAndroid` | 0 |
      | `childrenContainerStyle` | 0 |

  - Rojo antes de implementar: las tres primeras filas dan 0 y
    `bg-background` da 3.

### Enmiendas

- **R7**: THE SYSTEM SHALL mantener en verde todos los candados existentes,
  enmendando **solo** los de la «Tabla de enmiendas» y los que caigan bajo la
  «Regla de cierre». Cada uno conserva su intención y su título, con el sufijo
  ` (enmendado por #239 R7)` al final, detrás de los sufijos que ya tenga.
  Además, la spec de «Specs enmendadas» SHALL llevar una sola vez la sección
  `## Enmienda #239 — Base opaca de la fila pasada`, con su casilla.
  - Test: `__tests__/reminder-swipe-actions-canvas-fidelity.test.ts::#239 R7: los candados enmendados nombran su enmienda y la spec enmendada lleva su casilla`.
    - Recorre una constante nueva `AMENDED_PAST_ROW_BASE` del mismo fichero,
      con pares `[ruta relativa a src, localizador]`, uno por fila de la
      «Tabla de enmiendas»; la lista literal está en [[tasks]] §R7. Por cada
      par, exactamente **una** línea del fichero contiene el localizador, y esa
      línea contiene `(enmendado por #239 R7)`.
    - En `specs/mobile-reminders-upcoming-past/requirements.md`,
      `'## Enmienda \x23239 — Base opaca de la fila pasada'` sale una vez y el
      texto casa con `/- \[[ xX]\] Enmienda \x23239 aprobada/`.
  - Más la suite completa de `mobile-pet-tracker/` en verde (`./init.sh`, que
    corre el leader, no Codex).

## Tabla de enmiendas

Medida contra `0f1ab26f`. Los títulos se citan por contenido, sin número de
línea; todos los localizadores salen una sola vez en su fichero
(`grep -cF` → 1). Las cifras se **recomputan en T0**. Si una base distinta da
otra cifra, se enmienda con el mismo delta (+1) y se anota.

Ficheros de producción, relativos a `mobile-pet-tracker/src/`:

| Fichero | Cambio |
|---|---|
| `screens/reminders/index.tsx` | En `renderRow`, rama del dueño, el hijo del `ReanimatedSwipeable` pasa de `{row}` a la base en Pasados y a `row` en Próximos (R1 a R5). Código objetivo en [[design]] §Código objetivo. |

### Candados de guards y de recuento

Rutas relativas a `mobile-pet-tracker/src/`. Todos se enmiendan en el commit
verde de R1 a R6, que es el que los pone rojos.

| Fichero · título (prefijo, sin sufijos) | Cambio |
|---|---|
| `__tests__/reminders-upcoming-past-canvas-fidelity.test.ts` · `#227 R11: inventario del fuente` | `['style={CONTINUOUS_CORNER}', 6 + 1], // #228 R2` pasa a `['style={CONTINUOUS_CORNER}', 6 + 1 + 1], // #228 R2; #239 R1` |
| `__tests__/consistency-classnames.test.ts` · `%s importa y aplica sus %i esquinas` | `[join('screens', 'reminders', 'index.tsx'), 4 + 1 + 1 + 1], // #178 R6 fila sin Card; #227 R8 caja sin próximos; #228 R2 envoltorio de deslizar` pasa a `[join('screens', 'reminders', 'index.tsx'), 4 + 1 + 1 + 1 + 1], // #178 R6 fila sin Card; #227 R8 caja sin próximos; #228 R2 envoltorio de deslizar; #239 R1 base de la fila pasada` |
| `__tests__/consistency-classnames.test.ts` · `fusiona la esquina una vez y la entrega a las dos ramas de Card` | Tras su `+ 1 // #228 R2`, se añade la línea `+ 1 // #239 R1`. |
| `__tests__/consistency-classnames.test.ts` · `deja CONTINUOUS_CORNER, bg-accent-soft y el acento donde estaban` | Tras su `+ 1 // #228 R2`, se añade la línea `+ 1 // #239 R1`. El literal `+ 1 // #228 R2` sale dos veces en el fichero (`grep -cF` → 2): hay que anclar por el `it`. |
| `__tests__/design-drift.test.ts` · `reserva los radios 14, 16 y 22 a Recordatorios con su inventario exacto` | `[/\brounded-22\b/g, 1 + 1 + 1],` pasa a `[/\brounded-22\b/g, 1 + 1 + 1 + 1], // #239 R1`. `rounded-14` y `rounded-16` no cambian y `outsideReminders(/\brounded-22\b/)` sigue en `['screens/pairing/index.tsx']`. |

**Sufijo.** Las cinco filas reciben ` (enmendado por #239 R7)` al final de su
título, detrás de los sufijos que ya tengan, en el commit verde de R7. Los
localizadores de `#227 R13`, `#228 R13` y de
`__tests__/alerts-attended-canvas-fidelity.test.ts` son subcadenas de esos
títulos y siguen valiendo.

**Regla de cierre.** En T0, Codex corre `src/screens/reminders`, `src/utils`,
`src/theme`, `src/__tests__`, `src/providers` y `src/app`. Un `it` que tras el
commit verde falle **solo** por uno de los deltas de esta spec (una
`style={CONTINUOUS_CORNER}`, un `rounded-22`, un `bg-background` o un `<View`
más en `screens/reminders/index.tsx`, o la fila pasada un nivel más abajo, con
la base por padre) se enmienda igual que los de la tabla: misma intención,
mismo sufijo, una fila más en `AMENDED_PAST_ROW_BASE` y anotado en
`progress/impl_mobile-reminder-swipe-past-row-bleed.md` con su ruta y su
título. Un rojo por otra causa **se reporta y no se toca**.

Candados que **no** cambian y que la implementación debe respetar:

- `#228 R2`, `#228 R3`, `#228 R6` y `#228 R9`: el deslizable, el contenedor
  (`overflow-hidden rounded-22` con `CONTINUOUS_CORNER`), el panel, su franja y
  su opacidad, la fila pasada al 50 % y el componente real.
- `#228 R7`: quien no es dueño no tiene deslizable.
- `#228 R10`: las siete filas de canvas, también «Contenedor» y «Franja rosa»
  (cada literal de producción sigue saliendo una vez).
- `#228 R11`: su inventario (ninguna de sus filas cambia).
- `#228 R13` y `#227 R13`: sus `AMENDED` siguen valiendo.
- `#227 R7`: la opacidad 0.5 de la fila pasada. `#227 R11`, salvo la fila
  `style={CONTINUOUS_CORNER}` de la tabla.
- `#204 R17`, `#193 R11` y `#181 R8.3`: grep-limpio (sin hex, sin
  `StyleSheet.create`, sin clases `[...]`, sin sombras literales) y `#NNN`
  seguido de ` R<n>` en comentarios de producción.
- Los guards de copy (`ui-copy-table.ts`, `SCREEN_FILES`, `R8_REMINDERS`).

### Specs enmendadas

Recibe, desde el commit de esta spec, la sección
`## Enmienda #239 — Base opaca de la fila pasada` al final del fichero, con
«Spec enmendada», «Qué cambia», «Qué no cambia» y la casilla
`- [ ] Enmienda #239 aprobada (fecha: ____)`.

| Spec (ruta) | R-id | Qué cambia |
|---|---|---|
| `specs/mobile-reminders-upcoming-past/requirements.md` | `#227 R11` | El inventario de `style={CONTINUOUS_CORNER}` en `screens/reminders/index.tsx` pasa de 7 a 8, por la base de la fila pasada (R1). |

`specs/mobile-reminder-swipe-actions/requirements.md` (#228) **no** se enmienda:
sus requisitos siguen siendo ciertos tal como están escritos (R2 y R6 asertan
el contenedor y la fila, que no cambian; R11 no cuenta ninguno de los literales
que se mueven).

## Paso de smoke nuevo (G2)

El leader lo añade a `progress/smoke_arreglos-smoke.md` al mergear, bajo
`## #239 mobile-reminder-swipe-past-row-bleed`. Reproduce el paso 3 del smoke
de #228, donde salió la queja:

1. En el dev build de Android, como dueño, abre Recordatorios con al menos un
   recordatorio en Próximos, uno puntual en Pasados y una serie en Pasados.
   Expande «Pasados».
2. Desliza a la izquierda la fila puntual de Pasados: aparece el panel rosa con
   la papelera y «Eliminar», y **a través de la fila no se ve rosa**. El rosa
   solo asoma en el hueco de las esquinas redondas de la derecha, igual que al
   deslizar una fila de Próximos.
3. Suelta la fila sin pulsar: vuelve a su sitio y en reposo se ve atenuada,
   igual que antes de esta feature.
4. Vuelve a deslizarla y pulsa el panel: el deslizable se cierra y se abre la
   hoja «¿Eliminar recordatorio?» con su título. Cancela.
5. Desliza la serie de Pasados: el panel dice «Cancelar serie», no se ve rosa a
   través de la fila y al pulsar se abre la hoja de Cancelar serie.
6. Desliza una fila de Próximos: se ve igual que antes de esta feature.
7. Como familiar (rol `family`), las filas de Pasados se ven atenuadas y no se
   deslizan.
8. Repite 2 a 6 en tema claro y en tema oscuro.

## Fuera de alcance

- Acortar la franja a la esquina o cambiar el panel, su franja, su opacidad o
  el contenedor del deslizable (descartado en [[design]] §Alternativas).
- Cambiar la opacidad de la fila pasada, en reposo o abierta.
- Próximos y la rama de quien no es dueño.
- El formato de la fecha de la fila y el año (#240,
  `mobile-reminder-date-year`).
- Háptica, autocierre de otras filas y nuevas acciones del deslizable.
- Copy nuevo, artboard nuevo (no hay G1) y enmiendas de la carta (no hay G4).
- Un dev build nuevo (no hay G3): no hay dependencia nativa nueva.
- Las hojas de borrar y Cancelar serie, el API y el backend.
- El smoke en dispositivo (G2), que corre el humano.

## Decisiones

El `spec_author` cierra estos puntos; ninguno queda abierto.

1. **Base opaca dentro del deslizable, no franja más corta.** Acortar la franja
   no basta: la franja tiene que cubrir al menos el radio (22) para tapar el
   hueco de la esquina, y en ese cuadrado de 22 × 22 la fila ocupa el cuarto de
   círculo (π · 22² / 4 ≈ 380 de 484, el 78,5 %), que al 50 % deja ver el rosa
   que tiene debajo. Taparlo del todo pediría una máscara de esquina inversa
   (SVG) o un color mezclado fuera de los tokens, en código que comparte
   Próximos. Detalle y demás alternativas en [[design]].
2. **La base es `bg-background`, no `bg-surface`.** `bg-background` es el color
   que la fila pasada tiene hoy detrás (`screen-reminders`): en reposo no cambia
   nada en ningún tema. Una base `bg-surface` aclararía la fila en oscuro
   (`#161B22` en vez de la mezcla al 50 % sobre `#0D1117`).
3. **Solo filas pasadas del dueño.** Próximos ya es opaca y queda como está; sin
   deslizable (no dueño) no hay panel ni franja, y la fila queda como está.
4. **Sin G1 ni G4.** La fila abierta queda como dibujan los artboards de #228
   (fila opaca sobre el panel); la fila en reposo, como hoy. La carta sigue
   siendo cierta: la franja sigue «bajo la esquina de la fila» y `rounded-22`
   sigue siendo de la fila de Recordatorios. La base declara
   `CONTINUOUS_CORNER`, como pide el corolario de radios.
5. **Sin testID nuevo.** Los tests llegan a la base como `row.parent`; así no se
   toca ningún selector por prefijo (`reminder-*`, `reminders-*`) ni la cifra
   `testID=`.

Recuento de `SCREEN_FILES` (checklist de `plan_ui-2026-10-26.md` §4): no
cambia. No se retira ni se añade ninguna clave de copy.

## Aprobación

- [X] Aprobado por humano (fecha: 2026-11-04; firma delegada del leader, mandato del humano 2026-10-23 ampliado 2026-11-04) ← gate obligatorio antes de implementar
  (firma delegada del leader con la checklist de
  `progress/plan_canvas-parity-2026-10-23.md` §4, los tres puntos del §4 de
  `progress/plan_ui-2026-10-26.md` y los dos de
  `progress/plan_mejoras-smoke-2026-11-03.md` §4; mandato del humano
  2026-10-23, ampliado 2026-11-04)
- [x] **G2**: smoke en el dev build de Android (pasos de «Paso de smoke
  nuevo», tema claro y oscuro) (fecha: 2026-11-06) ← gate humano, por lote al final;
  lo registra `progress/smoke_arreglos-smoke.md`
- Base congelada: `0f1ab26f` (`origin/dev`).
