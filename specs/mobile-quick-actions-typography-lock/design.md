---
feature: "mobile-quick-actions-typography-lock"
status: spec_ready       # draft | spec_ready | approved
tags: [spec, mobile, ui, deuda]
---

# Diseño — [[mobile-quick-actions-typography-lock]] (#81)

> Ver [[requirements]] para los requisitos y [[../../docs/architecture|architecture]]
> para las capas. Esta feature solo añade tests a la capa de presentación móvil
> (`src/screens/home/`). No toca dominio, aplicación ni infraestructura.

## Decisiones técnicas

- **Un `describe` nuevo con siete `it`, no uno por requisito.** Los siete
  necesitan el mismo escenario: mascota seleccionada, detalle `ok` y actividad
  `ok`. R6 lo pisa con un solo `mockResolvedValue`. El `describe` copia el
  `beforeEach` y el `afterEach` de
  `describe('#71 R1: la Home dibuja la rejilla de accesos rápidos'` y va justo
  después de él, antes de
  `describe('#85 R1: la sección recupera su rótulo en los dos idiomas'`. Cada
  `it` lleva su prefijo `#81 R<n>:`. El `describe` de #71 no se toca.
- **Se busca por el nodo, no por el fuente.** Varios candados de #71 leen
  `index.tsx` como texto (`source.match(...)`), y eso no ve un valor que el
  fuente escribe una vez y el render reparte por variable. La sonda `m2_swap1`
  invierte el orden de los hijos solo en el tile 1 y deja un único
  `<Icon size={24}` en el fuente. Hoy la suite queda verde. Es el caso que
  describe la carta en «Inventariar no es candar». Todo lo nuevo se asevera
  sobre los nodos host que pinta el render, tile a tile.
- **Tres tiles, cada uno con sus literales.** R1, R2, R3 y R5 recorren una
  tabla literal del test con los tres tiles: `testID`, `testID` del icono y
  etiqueta en español. Una mutación en un solo tile (`index === N ? … : …`)
  pone la suite roja igual que en los tres. Las sondas lo prueban en cada
  índice ([[tasks]] §Sondas).
- **R1 usa `toBe` sobre la lista entera de clases de la etiqueta.**
  `specs/mobile-home-quick-actions/design.md` §D12 fija tamaño (`text-2xs`),
  peso (`font-semibold`) y color (`text-foreground`). P1 cita el Make, que
  pone `text-[10px] font-semibold text-foreground` en la etiqueta, y
  `text-2xs` es el token de esos 10 px. Esas tres clases son toda la receta.
  `toContain` dejaría pasar un token que la contradice: con `font-bold`
  añadido, la suite queda verde hoy (sonda `m1_bold`). `style`
  `toBeUndefined()` cierra el segundo sitio desde donde se cambia la receta
  (sonda `m1_style`). Es el mismo patrón que ya usan #70 y #85 en los
  rótulos: `props.className` con `toBe` y `props.style` con
  `toBeUndefined()`.
- **R2 fija la anatomía que prescribe D1, no el espaciado.** D1 dice «icono
  arriba y etiqueta debajo». Por eso cada tile tiene exactamente dos hijos
  host, el icono en la posición 0 y la etiqueta en la 1. Lo que la carta pide
  para el orden es `children[i]`, no `within(tile)`, que ignora el orden
  (§Enmienda #70, punto 12). Tres casos que ni #71 ni la entrada de #81 veían
  salen como consecuencia, sin congelar nada que el diseño no fije:
  - un `Pressable` anidado (W4, sonda `c`), que es un tercer hijo;
  - un envoltorio alrededor de icono y etiqueta (`e9`), que deja un solo hijo;
  - la dirección horizontal o invertida (`e1`, `e2`).

  La dirección se mira con `not.toMatch` sobre el `className` del tile, para
  no fijar sus otras clases.
- **`items-center gap-1.5 py-3` quedan libres.** Ninguna decisión D de #71
  los prescribe. Solo aparecen en la cita del Make (P1) y en el `className`
  que escribió el implementer de #71. El suelo táctil que sí prescribe #71
  (`min-h-11` y `flex-1`) ya lo cierra
  `#71 R1 › da a cada tile 44 pt de objetivo táctil`. Congelar esas tres clases
  iría contra el criterio 3 de la entrada. La sonda `e10`, que las quita,
  sigue verde tras #81, y así debe quedar.
- **R3: el radio es un filtro, no el `className` entero.** Los tokens
  `rounded*` del tile deben ser exactamente `['rounded-xl']`, por #71 R8 y la
  Decisión fija 12 de la carta, que da `rounded-xl` a tile y control. El
  `style` del host debe ser `{ borderCurve: 'continuous' }` con `toEqual`. Hoy
  el fuente tiene candado: quitar `style={CONTINUOUS_CORNER}` da dos rojos
  (sonda `e11`). El render no lo tiene: anular el `style` en un solo tile
  (`e12`) o poner `rounded-card` (`e6`) deja la suite verde. `toEqual` sobre el
  `style` también cierra la dirección desde el segundo sitio: un
  `flexDirection: 'row'` en línea (sonda `e1_style`) no pasa. No hace falta un
  literal de radio en píxeles.
- **R4 cierra los dos contenedores del elemento repetido.** La sección va con
  `className="gap-3"` por #71 R1. La fila va con `flex-row gap-3` y tiles
  `flex-1` por D5. La sección tiene sus dos hijos en orden, el rótulo y la
  fila. La fila tiene los tres tiles como hijos directos, contados por
  `children` y no por `testID` (carta, «Estructurales, del contenedor»). Hoy
  `dibuja el rótulo y los tres tiles en orden` cuenta `tileRow.children`, pero
  la identidad la saca con `getAllByTestId`, que no ve un envoltorio alrededor
  de cada tile (sonda `e13`, verde hoy). La receta del rótulo ya tiene su
  `toBe` en #71, y R4 solo añade su `style` `toBeUndefined()` (sonda
  `m4_title_style`).
- **R5 asevera el nombre accesible, no la ausencia de una prop.**
  `toHaveAccessibleName(label)` de RNTL v14 calcula el nombre como TalkBack:
  `aria-labelledby`, luego `aria-label ?? accessibilityLabel` y luego el texto
  de los hijos. Compara exacto por defecto. Así cierra
  `accessibilityLabel` y `aria-label` cruzados (sondas `e7`, `m5_aria` y
  `m5_one*`) sin prohibir una etiqueta redundante igual al texto, que no cambia
  lo que se oye ([[requirements]] §Fuera de alcance).
- **R6 se verifica en dos escenarios de error, uno por dependencia que D11
  excluye.** El detalle `unreachable` se sincroniza con
  `await screen.findByTestId('pet-hero-error')`, como hace ya
  `pinta un guion y la nota cuando el perfil tampoco resuelve`. La actividad
  `error` se sincroniza con el `waitFor` de
  `degrades an activity error without breaking the dashboard`. Los dos cuentan
  `quick-actions-row` por `children`. Con la sección condicionada, el rojo es
  **por consulta** (`Unable to find an element with testID: quick-actions-row`).
  Con un solo tile condicionado, es **por aserción** (`toHaveLength`).
- **Los rojos son mutaciones de producción versionadas** (C4, vía **b**),
  porque la base ya cumple los seis requisitos. Cada commit rojo lleva el `it`
  nuevo y una mutación de `index.tsx`, y el verde la revierte con
  `git checkout HEAD~1 --`. `index.tsx` acaba en su blob de base.
- **Los esperados son literales del test.** Clases, `testID`, etiquetas y el
  objeto de `style` van escritos a mano. Nada se importa de `index.tsx` ni de
  `native-styles.ts`, y no se añade ningún import al test.

## Archivos afectados

- `mobile-pet-tracker/src/screens/home/index.test.tsx` (presentación, tests):
  un `describe` nuevo con siete `it`. Pasa de 159 a 166 tests.
- `mobile-pet-tracker/src/screens/home/index.tsx` (presentación): **solo** en
  los seis commits rojos, con la mutación que el verde siguiente revierte. El
  diff acumulado es vacío.
- `progress/impl_mobile-quick-actions-typography-lock.md` y
  `specs/mobile-quick-actions-typography-lock/traceability.md`: la evidencia.

`docs/ui-guidelines.md`, que la entrada lista en `files_affected`, **no se
toca**. La regla del orden de los hijos ya está escrita en §Enmienda #70,
punto 12, con el ejemplo `row.children[1]` ([[requirements]] §Premisas).

## Coordinación

- **#132 `mobile-weekly-chart-root-accessible-lock`** (otra sesión, en el
  worktree principal) solo toca
  `mobile-pet-tracker/src/screens/home/weekly-activity-chart.test.tsx`.
  Verificado con
  `git diff --stat origin/main...origin/feature/132-mobile-weekly-chart-root-accessible-lock -- mobile-pet-tracker`.
  Si mergea antes, la suite de base tendrá más tests, pero los dos blobs de
  esta feature no cambian. El delta exigido sigue siendo +7 sobre lo medido.
- **#129 `mobile-selected-pet-query-wait-race`** (`pending`, sin spec) lista
  `index.test.tsx` en sus `files_affected`. Si mergea antes, cambia el blob
  del test y [[tasks]] §Antes de tocar nada manda parar. El `leader` ordena
  las dos.

## Alternativas descartadas

- **`toContain` en la receta.** Deja pasar `font-bold` junto a
  `font-semibold` (sonda `m1_bold`, verde hoy).
- **`toBe` sobre el `className` entero del tile.** Congelaría
  `items-center gap-1.5 py-3` y el orden de las clases, que el diseño no fija
  (criterio 3).
- **Un snapshot de la rejilla.** Congela todo, también lo libre, y el fallo no
  dice qué decisión se cruzó.
- **Más regex sobre `index.tsx`.** Ven texto y no render: un valor repartido
  por variable (`m2_swap1`, `m3_round1`, `m5_one`) pasa.
- **`accessibilityLabel` y `aria-label` con `toBeUndefined()`.** Congela una
  implementación en vez de lo que se oye, y es una lista abierta: la prop de
  nombre que no se liste pasa.
- **Cerrar W4 recorriendo los descendientes del tile en busca de otro
  `Pressable`.** Es otra lista abierta, y el recuento de D1 ya lo cierra.
- **Añadir los `it` al `describe` de #71.** R7 exige que los `describe` de #71
  queden intactos, y un fallo de #81 tiene que leerse como de #81.
- **Enmendar la carta.** La regla ya está escrita. Lo que faltaba era el
  candado del tile.
- **Un gate de TalkBack o de dispositivo.** El árbol de producción acaba
  idéntico al de `origin/main`, así que no hay nada nuevo que ver ni que oír.
