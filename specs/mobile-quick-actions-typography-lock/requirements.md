---
feature: "mobile-quick-actions-typography-lock"
status: spec_ready       # draft | spec_ready | approved
tags: [spec, mobile, ui, deuda]
---

# Requisitos — [[mobile-quick-actions-typography-lock]] (#81)

> Notación EARS. Cada requisito lleva su id `R<n>`, que no cambia una vez
> aprobado. Ver [[design]] para las decisiones y las alternativas descartadas,
> [[tasks]] para el orden TDD, los literales, los blobs y las sondas, y
> [[traceability]] para el cierre.
>
> Origen: deuda que declaró Codex y verificó el `reviewer` al cerrar #71
> (2026-09-09), ampliada ese mismo día con el hallazgo O6 del tercer pase de #70
> (`feature_list.json` #81).
>
> **Base medida: `4efb6c81`**, que es `origin/main` (merge de la PR #172 de
> #100) más `progress/current.md`, que es del `leader`. **Los números de línea
> no son anclas**, ni los de esta spec ni los de la entrada de
> `feature_list.json`. Todo se localiza con los `grep` que se citan, y las
> cuentas se vuelven a medir al arrancar ([[tasks]] §Antes de tocar nada).

## Contexto mínimo para implementar sin más contexto

La feature toca **un fichero**,
`mobile-pet-tracker/src/screens/home/index.test.tsx` («el test», 159 tests
hoy). El fichero de producción `mobile-pet-tracker/src/screens/home/index.tsx`
(«la Home») **solo se toca en los seis commits rojos**, para versionar una
mutación que el commit verde siguiente revierte. El diff acumulado de la Home
contra `origin/main` es **vacío**.

La rejilla de accesos rápidos es hija directa de `home-content`, entre el
collar y la actividad semanal. Solo se pinta con una mascota seleccionada
(`{selectedPetId ? (`). Así la ven las consultas de RNTL v14, en nodos host:

```
View testID="quick-actions"               className="gap-3", sin style
├─ Text testID="quick-actions-title"      className="text-xs font-semibold uppercase tracking-widest text-muted"
└─ View testID="quick-actions-row"        className="flex-row gap-3", sin style
   ├─ View testID="quick-action-weight"   (Pressable, accessibilityRole="button",
   │  │                                    className="min-h-11 flex-1 items-center gap-1.5 rounded-xl py-3 bg-category-violet",
   │  │                                    style={ borderCurve: 'continuous' })
   │  ├─ View testID="icon-weight"         (el mock de reicon del test: size 24, color = tinta del hueco)
   │  └─ Text "Peso"                        className="text-2xs font-semibold text-foreground", sin style
   ├─ View testID="quick-action-reminder" (icon-calendar-plus, "Recordatorio", bg-category-amber)
   └─ View testID="quick-action-documents" (icon-file-text, "Documentos", bg-category-blue)
```

En producción, los tres tiles salen de un solo `{QUICK_ACTIONS.map(`: el
fuente escribe **una vez** la receta, el icono y el orden de los hijos, y el
render los reparte por índice. Por eso un candado que lee el fuente como texto
no ve una mutación en un solo tile (§Premisas).

En el test, `renderHome()` pinta la Home real con sus proveedores. Los dobles
son `mockListPets`, `mockGetPet`, `mockGetDailyActivity` y `mockUseAuth`, y
los fixtures, `makePet()` y `makeDay()`. El mock de `reicon-react-native` pinta
cada icono como un `View` con `testID="icon-<nombre>"` y las props que recibe.

## Premisas de la entrada, verificadas contra el árbol

Todas las medidas son de la suite móvil **completa**, `bunx jest` desde
`mobile-pet-tracker/`, sin pipe, una sonda cada vez y con el árbol restaurado
por `git checkout HEAD --` tras cada una. La base da **86 suites / 1597 tests /
1 snapshot, `exit=0`**. «Verde» quiere decir 86/1597 con `exit=0`. Las
mutaciones, con su blob, están en [[tasks]] §Sondas.

| Premisa (`feature_list.json` #81) | Veredicto | Evidencia |
|---|---|---|
| La receta de la etiqueta (`text-2xs font-semibold`, D12) no está vigilada: con `text-xs font-medium` la suite queda verde | **cierta, re-medida**; caducan las cifras | verde con la receta cambiada en los tres tiles (`a1`) y en uno solo (`a2`, `a2_0`, `a2_1`). También con `font-bold` añadido (`m1_bold`) y con `style={{ fontWeight: '500' }}` (`m1_style`). El «68/68 suites y 1054/1054 tests» de la entrada es de la base de #71: hoy son 86 y 1597 |
| «Es la séptima dimensión del tile; las otras seis quedaron bajo candado en #71» | **cierta para las seis, falsa como inventario** | las seis son icono, etiqueta, fondo, destino, tinta y color de la etiqueta, en `#71 R1 › liga icono, etiqueta, fondo, destino, tinta y color de etiqueta de cada tile y de ninguno más`. Pero hay **más dimensiones abiertas hoy**, todas verdes con la mutación: el orden de los hijos (`b`, `m2_swap*`), la anatomía (`c`, `e9`), la dirección (`e1`, `e2`), el radio (`e6`, `m3_round*`, `e12*`), el nombre accesible (`e7`, `m5_aria`, `m5_one*`), la condición de render (`e8`, `e8b`, `m6_both`, `m6_tile`, `m6_tile0`) y los dos contenedores (`e3`, `e4`, `m4_style`, `m4_title_style`, `e5`, `e5b`, `e13`). `m6_tile1` y `m6_tile2` ya dan rojo hoy, pero **por la espera, no por un candado**: los `it` de #71 esperan a `quick-action-weight` y aseveran mientras la actividad sigue cargando (`#71 R1 › dibuja el rótulo y los tres tiles en orden`, por `toEqual`, con `m6_tile1`; `#71 R1 › usa iconos de reicon y ningún emoji`, por consulta de `quick-action-documents`, con `m6_tile2`). El inventario completo está en §Inventario |
| `items-center gap-1.5 py-3` no tienen candado | **cierta** | verde sin las tres clases (`e10`) |
| Un `Pressable` anidado dentro de un tile no se cuenta en el recuento de hijos (W4) | **cierta** | verde con `<Pressable onPress={() => router.push('/pairing')} />` como tercer hijo del tile (`c`). El único recuento es `tileRow.children` de la fila, que no mira dentro del tile |
| Intercambiar dos hijos del tile deja la suite verde (criterio 5) | **cierta** | verde con icono y etiqueta intercambiados en los tres tiles (`b`) y en uno solo (`m2_swap0`, `m2_swap1`, `m2_swap2`) |
| O6: intercambiar los `Text` de nombre y fecha «en `index.tsx:544-555`» deja la suite verde | **ancla caduca; hallazgo ya cerrado** | hoy esas líneas son la batería del collar. La fila de nombre y fecha es la del recordatorio (`grep -n 'reminders-item-${reminder.id}-title' src/screens/home/index.tsx`). Con título y fecha intercambiados (blob `705984ec933b75f1d53d583f7fcbbe13a433ea0e`), rojo 1: `#85 R7: ninguna fila lleva el dato ni el sitio de otra › fija la posición de los hijos de cada fila`, **por aserción** (`toHaveProperty`). No se reabre: **(N)** |
| «La regla general quedó escrita en `docs/ui-guidelines.md` §Enmienda #70» | **cierta** | punto 12 de las decisiones de conducta, con el ejemplo `expect(row.children[1]).toHaveProperty(...)`. Por eso `docs/ui-guidelines.md`, que figura en `files_affected`, **no se toca** |
| El tamaño del icono (24) no tiene candado | **falsa** | rojo 1 con `size={28}` (`d`): `#71 R1 › usa iconos de reicon y ningún emoji`, por aserción (`toHaveLength`). No se vuelve a candar |
| La esquina continua tiene candado | **cierta en el fuente, falsa en el render** | sin `style={CONTINUOUS_CORNER}` (`e11`), rojo 2 por aserción: `#62 R14: toda esquina no-cápsula que dibuja el repo es continua › screens/home/index.tsx importa y aplica sus 2 esquinas` y `#98 R10: los candados que esta feature no mueve › deja CONTINUOUS_CORNER, bg-accent-soft y el acento donde estaban`. Con el `style` anulado en un solo tile (`e12`, `e12_0`, `e12_1`) el fuente conserva el literal y la suite queda verde |
| `files_affected` | **en parte** | el test sí. `docs/ui-guidelines.md` no (fila de la regla). La Home solo entra y sale en los rojos |
| El feedback de pulsado de los tiles está registrado | **falsa** | no hay entrada en `feature_list.json` que nombre los tiles. #107 cerró el del botón de comidas, no este. `progress/history.md` lo apunta como «Deuda transversal detectada en #71, sin id» (`grep -n "Deuda transversal detectada en #71" progress/history.md`). Queda como **(F)** |
| Suite de base | **medida sin pipe** | 86 suites / 1597 tests / 1 snapshot, `exit=0`, con 33 bloques `● Console` de ruido. `bunx tsc --noEmit` da `exit=0`, y `bunx eslint` de los dos ficheros, también |
| Blobs de base | **medidos** | la Home `ff591a1f567e00c0aee57db29ca1706b3a925cad` y el test `234bd11772b8c1c8dce1782c620ae1a5e0c53368`. Iguales en `HEAD` y en `origin/main` |
| Entorno | **verificado** | `test ! -e .expo/types/router.d.ts` da `exit=0` |

## Inventario de decisiones del tile y de sus contenedores

Por `docs/ui-guidelines.md` §Enmienda #70: cada decisión, con el `it` que la
cierra hoy o el requisito de #81 que la cierra. «#71 › liga…» abrevia
`#71 R1: la Home dibuja la rejilla de accesos rápidos › liga icono, etiqueta, fondo, destino, tinta y color de etiqueta de cada tile y de ninguno más`.
Todos los demás `it` de #71 citados son de ese mismo `describe`.

**Decisiones de conducta, por tile:**

| # | Decisión | Candado |
|---|---|---|
| 1 | dato que muestra | no aplica: el tile no muestra datos, solo su etiqueta (decisión 3) |
| 2 | componente de icono | #71 › liga… (`getByTestId(iconTestID)` dentro del tile) y `usa iconos de reicon y ningún emoji` |
| 3 | etiqueta visible | #71 › liga… (`getByText(label)` dentro del tile) |
| 4 | nombre accesible | **#81 R5** |
| 5 | fondo | #71 › liga… (`toContain(surface)`) y `resuelve el fondo y la tinta desde el mismo hueco` |
| 6 | tinta del icono | #71 › liga… (`icon.props.color` `toBe(ink)`) |
| 7 | color y receta tipográfica | color: #71 › liga… (`toContain('text-foreground')`). Receta: **#81 R1**. La receta del rótulo de la sección ya tiene su `toBe` en `dibuja el rótulo y los tres tiles en orden`, y **#81 R4** le añade el `style` |
| 8 | destino | #71 › liga… y `lleva cada tile a su ruta existente` |
| 9 | condición de render | escenario cargado: `dibuja el rótulo y los tres tiles en orden`. Sin mascota: `no dibuja la rejilla sin mascota seleccionada`. Con el detalle en error y con la actividad en error: **#81 R6** |
| 10 | forma del contenedor | dirección vertical y radio: **#81 R2** y **#81 R3**. `items-center gap-1.5 py-3`: **libres**, por decisión escrita ([[design]]) |
| 11 | envoltorios que reparten el espacio | `flex-1` y `min-h-11`: `da a cada tile 44 pt de objetivo táctil`. Ningún envoltorio dentro del tile: **#81 R2**. Ninguno alrededor de cada tile: **#81 R4** |
| 12 | orden de los hijos | **#81 R2** (icono en `children[0]`, etiqueta en `children[1]`) |

**Estructurales, de la fila y de la sección:**

| Qué | Candado |
|---|---|
| identidad, orden y cardinalidad de los tiles, por `children` | **#81 R4** (`testID` de `tileRow.children`, con `toEqual`). Hoy solo `toHaveLength(3)` más un `getAllByTestId`, que no ve un envoltorio por tile (`e13`) |
| orden y cardinalidad de la sección (rótulo y fila) | **#81 R4** |
| forma de la sección (`gap-3`) y de la fila (`flex-row gap-3`) | **#81 R4** |

**Invariantes compartidos:**

| Invariante | Candado |
|---|---|
| tamaño del icono | `usa iconos de reicon y ningún emoji` (`props.size` `toBe(24)` por tile y un solo `<Icon size={24}` en el fuente). Sonda `d`, roja hoy |
| objetivo táctil y reparto | `da a cada tile 44 pt de objetivo táctil` |
| radio | **#81 R3** (el fuente ya lo cuidan `#62 R14` y `#98 R10`, sonda `e11`) |
| rol y agrupación accesible | `anuncia los tres tiles como botones independientes` |
| sitio de render | `coloca la rejilla entre el collar y la actividad semanal` |
| feedback de pulsado | **no existe**. Es **(F)**, fuera de alcance |

## Requisitos funcionales

Los siete `it` nuevos viven en
`describe('#81 R1-R6: la rejilla de accesos rápidos no deja decisiones sin candado'`
(«el `describe` de #81»). Recorren los tres tiles con tablas literales del
test: `quick-action-weight` / `icon-weight` / `Peso`,
`quick-action-reminder` / `icon-calendar-plus` / `Recordatorio` y
`quick-action-documents` / `icon-file-text` / `Documentos`. El código exacto
está en [[tasks]].

- **R1**: WHILE la Home pinte la rejilla de accesos rápidos, THE SYSTEM SHALL
  dar a la etiqueta de **cada uno de los tres tiles** exactamente la receta de
  `specs/mobile-home-quick-actions/design.md` §D12,
  `className="text-2xs font-semibold text-foreground"`, y **ningún `style`**.

  `#81 R1: cada etiqueta lleva la receta entera y ningún estilo en línea`
  asevera, por tile, que el nodo `within(tile).getByText(label)` tiene
  `props.className` `toBe('text-2xs font-semibold text-foreground')` y
  `props.style` `toBeUndefined()`.

  IF la receta cambia en uno, en dos o en los tres tiles, o gana un token más
  (`font-bold`), THEN el `it` SHALL fallar **por aserción** (`toBe`). IF la
  etiqueta recibe un `style`, THEN SHALL fallar por `toBeUndefined`. El rojo es
  la mutación versionada `a1`, `text-xs font-medium` en los tres tiles, y con
  ella este `it` SHALL ser el **único** rojo de la suite.

- **R2**: WHILE la Home pinte la rejilla, THE SYSTEM SHALL pintar **cada tile
  con exactamente dos hijos host, el icono en la posición 0 y la etiqueta en la
  1**, y sin dirección horizontal ni invertida. Es la anatomía de D1, «icono
  arriba y etiqueta debajo».

  `#81 R2: cada tile tiene dos hijos, el icono arriba y la etiqueta debajo`
  asevera, por tile:

  1. `tile.children` `toHaveLength(2)`;
  2. `tile.children[0]` `toHaveProperty('props.testID', iconTestID)`;
  3. `tile.children[1]` `toBe(within(tile).getByText(label))`;
  4. `tile.props.className`
     `not.toMatch(/(?:^|\s)flex-(?:row|row-reverse|col-reverse)(?:\s|$)/)`.

  IF se intercambian icono y etiqueta en uno o en los tres tiles, o se mete un
  tercer hijo (un `Pressable` anidado, W4), o un envoltorio alrededor de los
  dos, o `flex-row` / `flex-col-reverse` en el tile, THEN el `it` SHALL fallar
  **por aserción**. El rojo es la mutación versionada `b`, icono y etiqueta
  intercambiados en los tres tiles, y con ella este `it` SHALL ser el
  **único** rojo de la suite.

- **R3**: WHILE la Home pinte la rejilla, THE SYSTEM SHALL dar a **cada tile**
  `rounded-xl` como **único** token de radio y `style` igual a
  `{ borderCurve: 'continuous' }`. Lo fijan #71 R8 y la Decisión fija 12 de la
  carta.

  `#81 R3: cada tile lleva rounded-xl como único radio y la esquina continua`
  asevera, por tile, que los tokens de `props.className` que casan con
  `/^rounded(?:-|$)/` son `toEqual(['rounded-xl'])`, y que `props.style` es
  `toEqual({ borderCurve: 'continuous' })`.

  IF un tile pierde `rounded-xl` o gana otro radio (`rounded-card`), o pierde o
  cambia su `style` en uno solo o en los tres, THEN el `it` SHALL fallar **por
  aserción**. El rojo es la mutación versionada `e6`, `rounded-card` en los
  tres tiles, y con ella este `it` SHALL ser el **único** rojo de la suite.

- **R4**: WHILE la Home pinte la rejilla, THE SYSTEM SHALL mantener la
  **sección** con exactamente dos hijos, `quick-actions-title` y
  `quick-actions-row` en ese orden, con `className="gap-3"` y sin `style`, y el
  rótulo sin `style`. Y SHALL mantener la **fila** con exactamente los tres
  tiles como hijos directos, en orden, con `className="flex-row gap-3"` y sin
  `style`. Lo fijan #71 R1, D5 y D6.

  `#81 R4: la sección pone el rótulo encima de la fila, y la fila, los tres tiles sin envoltorio`
  asevera:

  1. `quickActions.children` `toHaveLength(2)`, con `children[0]` y
     `children[1]` por `toHaveProperty('props.testID', …)`;
  2. `quickActions.props.className` `toBe('gap-3')` y `props.style`
     `toBeUndefined()`;
  3. `title.props.style` `toBeUndefined()`;
  4. los `testID` de `tileRow.children`, `toEqual` a los tres tiles en orden;
  5. `tileRow.props.className` `toBe('flex-row gap-3')` y `props.style`
     `toBeUndefined()`.

  IF se intercambian rótulo y fila, cambia la separación o la dirección de
  cualquiera de los dos contenedores, alguno recibe `style`, o se envuelve cada
  tile en otro nodo, THEN el `it` SHALL fallar **por aserción**. El rojo es la
  mutación versionada `e4`, `gap-2` en la sección, y con ella este `it` SHALL
  ser el **único** rojo de la suite.

- **R5**: WHILE la Home pinte la rejilla, THE SYSTEM SHALL anunciar **cada
  tile con su propia etiqueta visible como nombre accesible**, exacta. Lo fija
  #71 R9.

  `#81 R5: cada tile se anuncia con su propia etiqueta visible` asevera, por
  tile, `expect(tile).toHaveAccessibleName(label)`.

  IF un tile recibe un `accessibilityLabel` o un `aria-label` con otro texto,
  en uno o en los tres, THEN el `it` SHALL fallar **por aserción**. El rojo es
  la mutación versionada `e7`, que da a cada tile la etiqueta del siguiente, y
  con ella este `it` SHALL ser el **único** rojo de la suite.

- **R6**: WHILE haya una mascota seleccionada, THE SYSTEM SHALL pintar la
  rejilla con sus tres tiles **aunque falle el detalle de la mascota o la
  actividad semanal**. Lo fijan #71 R10 y D11: la rejilla no depende de
  `detail` ni de `activity`.

  - `#81 R6: dibuja los tres tiles aunque el detalle de la mascota falle`:
    `mockGetPet` resuelve `{ kind: 'unreachable', message: 'network down' }`,
    y el `it` espera a `pet-hero-error`.
  - `#81 R6: dibuja los tres tiles aunque la actividad semanal falle`:
    `mockGetDailyActivity` resuelve `{ kind: 'error' }`, y el `it` espera a
    que `summary-note` diga `No se pudo cargar la actividad`.

  Los dos asevera `screen.getByTestId('quick-actions-row').children`
  `toHaveLength(3)`.

  IF la sección se condiciona al detalle o a la actividad, THEN el `it` del
  escenario afectado SHALL fallar **por consulta** (`Unable to find an element
  with testID: quick-actions-row`). IF solo se condiciona un tile, THEN SHALL
  fallar **por aserción** (`toHaveLength`). El rojo es la mutación versionada
  `m6_both`, la sección condicionada a los dos, y con ella los dos `it` de R6
  SHALL ser los **únicos** rojos de la suite, los dos por consulta.

- **R7**: THE SYSTEM SHALL cerrar con:

  1. **El delta declarado**: +0 suites y +7 tests. El test pasa de 159 a 166,
     y la suite, de 86 / 1597 / 1 a 86 / **1597 + 7 = 1604** / 1, medida sin
     pipe. Si la base medida al arrancar es otra, por ejemplo porque #132
     mergeó antes, el delta exigido sigue siendo +7 tests y +0 suites sobre lo
     medido.
  2. **Diff de producción vacío**: `git diff --exit-code origin/main...HEAD --
     mobile-pet-tracker/src/screens/home/index.tsx` da 0, y la Home acaba en
     su blob de base.
  3. **Los `describe` de #71 intactos** y verdes, igual que el resto de
     `describe` del test.
  4. **Ninguna cifra de candado se mueve**, con los `grep` de [[tasks]] §R7.
  5. `bunx tsc --noEmit` con `exit=0` tras `test ! -e .expo/types/router.d.ts`,
     y `bunx eslint` de los dos ficheros con `exit=0`.
  6. **Ninguna dependencia ni copy nuevas**: no cambian `package.json`,
     `bun.lock`, `src/i18n/catalog.ts` ni
     `src/providers/__tests__/language-provider.test.tsx`, que cierra la
     longitud del catálogo.
  7. **La tabla de sondas** de [[tasks]] §Sondas, re-medida sobre el árbol
     final, en `progress/impl_mobile-quick-actions-typography-lock.md`.

  No tiene test propio, porque es una propiedad del diff y de la suite. Lo
  cierra el `reviewer` por inspección.

## Tabla de sondas, resumen

Cada sonda, con su mutación literal, su blob y el `it` que falla, está en
[[tasks]] §Sondas. «Hoy» es la mutación sobre la base (1597 tests) y
«tras #81», sobre el árbol final (1604). Todas son de la suite completa.

| Clase | Sondas | Hoy | Tras #81 |
|---|---|---|---|
| Receta de la etiqueta, en los tres tiles o en uno | `a1`, `a2_0`, `a2_1`, `a2`, `m1_bold`, `m1_style` | verde | rojo 1: R1, por aserción |
| Orden de los hijos del tile, en los tres o en uno | `b`, `m2_swap0`, `m2_swap1`, `m2_swap2` | verde | rojo 1: R2, por aserción |
| Anatomía del tile: tercer hijo (W4) o envoltorio | `c`, `e9` | verde | rojo 1: R2, por aserción |
| Dirección del tile, por clase o por `style` | `e1`, `e2`; `e1_style` | verde | rojo 1: R2 con `e1` y `e2`; R3 con `e1_style`. Todos por aserción |
| Radio del tile, en los tres o en uno | `e6`, `m3_round0`, `m3_round1`, `m3_round2` | verde | rojo 1: R3, por aserción |
| `style` del tile anulado en uno | `e12_0`, `e12_1`, `e12` | verde | rojo 1: R3, por aserción |
| `style` del tile borrado del fuente | `e11` | rojo 2: `#62 R14` y `#98 R10` | rojo 3: esos dos y R3 |
| Sección: orden, separación, `style` | `e3`, `e4`, `m4_style`, `m4_title_style` | verde | rojo 1: R4, por aserción |
| Fila: separación, dirección, envoltorio por tile | `e5`, `e5b`, `e13` | verde | rojo 1: R4, por aserción |
| Nombre accesible cruzado, en los tres o en uno | `e7`, `m5_aria`, `m5_one`, `m5_one_1`, `m5_one_2` | verde | rojo 1: R5, por aserción |
| Sección condicionada al detalle, a la actividad o a los dos | `e8`, `e8b`, `m6_both` | verde | rojo 1 (el `it` de R6 de ese escenario) o 2 (`m6_both`), **por consulta** |
| Un tile condicionado | `m6_tile` (al detalle); `m6_tile0`, `m6_tile1`, `m6_tile2` (a los dos) | verde con `m6_tile` y `m6_tile0`; rojo 1 en #71 con `m6_tile1` y `m6_tile2`, **por la espera, no por un candado** | rojo, con el `it` de R6 de cada escenario condicionado entre los rojos, **por aserción** (`toHaveLength`) |
| Tamaño del icono | `d` | rojo 1: `#71 R1 › usa iconos…` | igual |
| Composición interior | `e10` | verde | **verde**, a propósito: queda libre |

«Tras #81» está medido con la suite completa contra el test prototipo, salvo
tres casos. `m6_both` y `e10` se midieron solo con `index.test.tsx`: 2 rojos
por consulta y 166 de 166. `m5_one_1`, `m5_one_2`, `e8`, `e8b`, `m6_tile`,
`m6_tile0`, `m6_tile1` y `m6_tile2` **no se validaron en la spec**: su
columna es el mínimo que exige [[tasks]] §Sondas, y el implementer la mide.

## Qué firma el humano al aprobar esta spec

1. **El candado va más allá de la tipografía.** La entrada pide la receta (R1)
   y el orden de los hijos (criterio 5, R2). Al inventariar el tile con
   §Enmienda #70 salieron **otras cuatro dimensiones abiertas**: el radio
   (R3), la sección y la fila (R4), el nombre accesible (R5) y la condición de
   render (R6). Todas dan verde hoy con su mutación. `m6_tile1` y `m6_tile2`
   dan rojo en #71, pero solo por la espera de sus `it`, no por un candado. Se cierran aquí porque cada
   una es una decisión que #71 ya prescribió por escrito (R8, R1 con D5 y D6,
   R9, y R10 con D11). No se inventa ninguna. El coste: cambiar
   cualquiera a propósito obliga a tocar su candado.
2. **La receta se fija entera, con `toBe`.** D12 prescribe las tres clases de
   la etiqueta y no hay más. `toContain` dejaría pasar `font-bold` junto a
   `font-semibold`.
3. **W4 y la composición interior.** El tile queda con **exactamente dos
   hijos**, icono y etiqueta, porque lo prescribe D1. El `Pressable` anidado
   (W4) queda cerrado como consecuencia, sin fijar nada más.
   `items-center gap-1.5 py-3` quedan **libres**: ninguna decisión D los
   prescribe, solo la cita del Make. El suelo táctil que sí se prescribió
   (`min-h-11`, `flex-1`) ya tiene candado. Esto responde al criterio 2 de la
   entrada.
4. **La carta no se enmienda**, aunque `files_affected` la liste. La regla
   del orden por posición ya está en §Enmienda #70, punto 12. Y **O6 no se
   reabre**: `#85 R7` ya lo cierra, medido en rojo.
5. **Seis mutaciones versionadas**, una por requisito con test: `a1`, `b`,
   `e6`, `e4`, `e7` y `m6_both`. Cada una toca solo la Home, y el verde la
   revierte con `git checkout HEAD~1 --`. La historia toca la Home en doce
   commits, pero el diff acumulado es vacío (R7.2).
6. **El delta es +0 suites y +7 tests**: 86 / 1597 / 1 antes y 86 / 1604 / 1
   después, sobre esta base. Ninguna cifra de candado se mueve (R7.4).
7. **Sin gate de dispositivo ni de TalkBack.** El árbol de producción acaba
   idéntico al de `origin/main`, así que no hay nada nuevo que ver ni que oír.
   El único gate humano es la casilla de §Aprobación.
8. **Requisitos sin test propio**: R7, una propiedad del diff y de la suite.
   Lo cierra el `reviewer` por inspección, y queda declarado aquí antes del
   handoff, como pide C4.
9. **El feedback de pulsado de los tiles queda fuera**, como **(F)** sin id
   (§Fuera de alcance).

## Cobertura de los criterios de aceptación de `feature_list.json` #81

| Criterio | Cubierto por |
|---|---|
| 1. Cambiar la receta tipográfica de la etiqueta pone la suite roja | R1. Sondas `a1`, `a2*`, `m1_bold` y `m1_style` |
| 2. La spec decide por escrito si la composición interior se congela o queda libre, y por qué | §Qué firma el humano, punto 3, y [[design]]. Dos hijos fijos por D1 (R2); `items-center gap-1.5 py-3` libres (sonda `e10`, verde a propósito) |
| 3. El candado no congela más de lo que prescribe design.md | cada requisito cita la decisión que fija (D1, D5, D6, D11, D12, #71 R1, R8, R9, R10). Lo que ninguna fija, que es la composición interior, la prop de nombre accesible mientras no cambie lo que se oye y las props del icono que #71 no nombra, queda libre (§Fuera de alcance) |
| 4. Suite móvil completa verde; ninguna cifra de candado se mueve | R7.1 a R7.4 |
| 5. Intercambiar dos hijos del tile pone la suite roja; el orden se fija por posición | R2 (`children[0]` y `children[1]`, sondas `b` y `m2_swap*`). También en la sección, con R4 (`e3`) |

## Fuera de alcance

Cada viñeta lleva su clase: **(D)** es un límite de esta feature, **(F)** es un
hallazgo que podría registrarse como otra feature (sin id: lo asigna el
`leader` contra `origin/main`) y **(N)** es una premisa verificada y
descartada.

- **(D)** `items-center gap-1.5 py-3` del tile quedan libres ([[design]]).
  Con la sonda `e10` la suite tiene que seguir verde tras #81.
- **(D)** Una etiqueta accesible **redundante**, igual al texto visible, no se
  cierra con candado. #71 R9 pide no añadirla, pero no cambia lo que se oye. R5 fija el
  nombre, no la prop. Cerrar la prop sería una lista abierta, descartada en
  [[design]] §Alternativas descartadas.
- **(D)** No se vuelve a candar lo que ya tiene candado: el tamaño del icono
  (sonda `d`), el componente, la tinta, el fondo, el destino y el color de la
  etiqueta (#71 › liga…), el objetivo táctil, el rol, el sitio de render y el
  caso sin mascota. Tampoco las props del icono que #71 no nombra, porque el
  diseño no las fija.
- **(D)** No se toca ningún `describe` existente del test, ni
  `src/screens/home/weekly-activity-chart.test.tsx`, que es de #132.
- **(D)** No hay copy nueva. No se tocan `src/i18n/catalog.ts`,
  `src/providers/__tests__/language-provider.test.tsx` ni
  `src/__tests__/ui-copy-table.ts`, y no se instala nada.
- **(D)** `docs/ui-guidelines.md` no se enmienda (§Premisas).
- **(F)** *Los tiles no tienen feedback de pulsado.* Son `Pressable` sin
  estado `pressed`, y C8 lo pide. No hay id: `progress/history.md` lo apunta
  como «Deuda transversal detectada en #71, sin id», y ninguna entrada de
  `feature_list.json` nombra los tiles. #107 cerró solo el botón de comidas.
  Añadirlo cambia lo que se pinta y necesita diseño y gate de dispositivo, así
  que no cabe en una feature de solo tests.
- **(N)** *O6, el orden de nombre y fecha en la fila del recordatorio.* Ya lo
  cierra `#85 R7: ninguna fila lleva el dato ni el sitio de otra › fija la posición de los hijos de cada fila`
  (medido en rojo por aserción, §Premisas). El ancla `index.tsx:544-555` de la
  entrada está caduca.
- **(N)** *Que cerrar W4 obligue a congelar la composición interior.* El
  recuento de dos hijos sale de D1 y no fija ni la alineación ni el
  espaciado (sonda `e10`, verde tras #81).

---

## Aprobación

- [ ] **Aprobado por humano** (fecha: ____) ← gate obligatorio antes de
      implementar. Al marcar esta casilla, el humano firma también los nueve
      puntos de §Qué firma el humano al aprobar esta spec.

> **Esta feature tiene una sola casilla**: esta. No hay gate de dispositivo
> ni de TalkBack (§Qué firma el humano, punto 7).
