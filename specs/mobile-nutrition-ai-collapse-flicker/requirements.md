---
feature: "mobile-nutrition-ai-collapse-flicker"
status: approved      # draft | spec_ready | approved
tags: [mobile, nutrition, ui, spec]
---

# Requisitos — [[mobile-nutrition-ai-collapse-flicker]] (#234)

> Notación EARS. Capa: móvil (`mobile-pet-tracker/`). Sin backend, sin copy
> nuevo, sin dependencias nuevas, sin módulo nativo (no hace falta rebuild del
> dev build), sin enmienda de la carta (no hay gate G4) y sin artboard nuevo
> (no hay gate G1: el aspecto aprobado no cambia). Diseño en [[design]]; plan
> TDD en [[tasks]]; trazabilidad en [[traceability]]. Rutas relativas a
> `mobile-pet-tracker/` salvo que se diga otra cosa.

## Contexto

Palabras literales del humano en el smoke G2 del 2026-11-03: «No marque
mobile-nutrition-ai-format porque en eñ colapso de IA queda parpadiando».

Diagnóstico, medido en el árbol `26b86621` (`origin/dev` con #232 mergeado):

1. `src/screens/food/ai-explanation.tsx` decide si la tarjeta de IA se recorta
   con `needsClamp = contentHeight > AI_CLAMP_HEIGHT` (122). `contentHeight` lo
   escribe el `onLayout` de `food-ai-content`.
2. `food-ai-content` es hijo de `food-ai-body`, y `food-ai-body` es el recorte:
   `overflow-hidden` y, cuando `needsClamp && !expanded`, `maxHeight: 122`.
3. Es un lazo cerrado: `contentHeight` decide `needsClamp`, `needsClamp` decide
   el `maxHeight` del padre, y el `maxHeight` del padre es una de las entradas
   del layout del hijo que produce `contentHeight`. Mientras el nodo que se mide
   viva dentro del recorte que él mismo activa, la medida no es independiente
   de la decisión.
4. El mecanismo exacto por el que ese lazo oscila en Android (por ejemplo, un
   hijo medido «como máximo» la altura del padre recortado, que da una medida de
   unos 122 y apaga el recorte, que da 400 y lo vuelve a encender) **no se ha
   medido en la VPS**: es la hipótesis del plan. El arreglo no depende de que
   esa hipótesis sea exacta: rompe el lazo, porque el nodo que se mide deja de
   estar bajo `maxHeight`. Quien lo confirma es el smoke G2 (ver «Paso de smoke
   nuevo»).
5. La spec de #224 (`design.md` §Riesgos) daba por hecho que el hijo no se
   encoge bajo el `maxHeight` del padre. Es la premisa que el smoke pone en
   duda; #234 no la discute, la vuelve irrelevante.

Esta spec **enmienda #224 R6**: el alto que decide el recorte pasa de medirse en
`food-ai-content` (dentro del recorte) a medirse en un nodo nuevo
`food-ai-measure` (fuera del recorte). Las constantes 122 y 36, la frontera
`>`, el degradado y el resto de #224 R6 no cambian (ver «Enmiendas a otras
features»).

## Decisiones cerradas (Codex no las reabre)

- **D1. Dónde se mide.** En un nodo gemelo `food-ai-measure`, hermano de
  `food-ai-body` bajo la raíz `gap-2`, **primer** hijo de esa raíz. Lleva los
  mismos bloques que lo visible y el **único** `onLayout` del componente.
  Descartadas `onTextLayout` (mide líneas por `Text`, no suma márgenes ni
  viñetas, y vive dentro del recorte) y contar líneas o caracteres (no es la
  medida real del layout); detalle en [[design]].
- **D2. Una sola definición de los bloques.** Una función de módulo
  `renderBlocks` (en el mismo fichero) pinta los bloques para `food-ai-content`
  y para `food-ai-measure`; la variante del medidor **no lleva `testID`**. Así
  las clases no se duplican en el fuente (los guards de la carta cuentan el
  fuente) y el medidor no puede divergir de lo visible.
- **D3. Cómo se oculta.** `className="absolute inset-x-0 top-0 opacity-0"`,
  `pointerEvents="none"`, `accessibilityElementsHidden` e
  `importantForAccessibility="no-hide-descendants"` (la misma pareja que
  `src/components/celebration.tsx` y `src/screens/pet-members/index.tsx`).
  Descartado `display: none`: un nodo sin layout no emite `onLayout` y el
  medidor no mediría nada.
- **D4. Mismo ancho.** El medidor es absoluto con `inset-x-0` dentro de la
  raíz, que no lleva relleno; su ancho es el de `food-ai-body`, y por tanto el
  texto envuelve igual. Que el alto medido coincida con el alto natural real
  solo lo confirma el smoke (jest no mide layout).
- **D5. Umbrales intactos.** 122, 36 y la frontera `>` no cambian
  (`AI_CLAMP_HEIGHT`, `AI_FADE_HEIGHT`). Solo cambia **de dónde** viene el alto.
- **D6. Los eventos del nodo recortado se ignoran por construcción**, no por
  filtro: `food-ai-body` y `food-ai-content` no tienen `onLayout`. Descartado
  «ignorar el evento mientras está recortado» (una bandera más de estado, y
  falla al expandir) y «congelar el primer valor» (no se rehace al cambiar el
  texto).
- **D7. El primer cuadro sin medida sigue sin recorte.** #224 R6 ya fija «aún no
  hay medida → no limita»; se conserva. Habrá, como hoy, un único salto al
  primer pintado de una explicación larga; no es un lazo. Si el smoke dice que
  ese único salto también molesta, es otra enmienda (no se decide aquí).
- **D8. Sin plan B dentro de esta spec.** Si el smoke G2 reprueba, no se
  improvisa un parche en la implementación: se reabre la feature con la
  evidencia del dispositivo. [[design]] describe qué se probaría y por qué no
  entra ahora.
- **D9. Alcance del fichero.** Producción: solo
  `src/screens/food/ai-explanation.tsx`. Tests: solo
  `src/screens/food/ai-explanation.test.tsx`. `src/screens/food/index.tsx` y su
  test **no se tocan** (consumidor; mismo aspecto, mismas consultas por
  defecto).

## Convenciones de esta spec

- Cada test nuevo o enmendado nombra `#234 R<n>` (siempre seguido de ` R<n>`);
  lo mismo en comentarios del fuente (la regla `HEX_LITERAL` de los guards
  solo exime `#NNN R<n>`).
- Los `fireEvent`, `act`, `render` y `rerender` van con `await` (RNTL 14).
- Corre jest con rutas por prefijo sin paréntesis
  (`src/screens/food`, `src/__tests__`).
- Los tests nuevos van en `describe('#234 R<n>: …')` **nuevos al final de**
  `src/screens/food/ai-explanation.test.tsx`, con los helpers del propio fichero
  (`mount`, `SAMPLE`, `SAMPLE_PLAIN`, `OTHER_TEXT`, `LINE_BULLET`,
  `BULLET_ONLY`). No se añade ni se cambia ningún doble de módulo.
- **Helpers de layout.** El helper existente `layout(height)` se reapunta a
  `food-ai-measure`: busca el nodo con
  `screen.getByTestId('food-ai-measure', { includeHiddenElements: true })`
  (el medidor está oculto a accesibilidad, así que sin esa opción RNTL no lo
  encuentra) y dispara `'layout'` con
  `{ nativeEvent: { layout: { x: 0, y: 0, width: 300, height } } }`. Un helper
  nuevo `clippedLayout(height)` dispara el mismo evento en
  `screen.getByTestId('food-ai-content')`, que representa lo que el nodo
  recortado reportaría en el dispositivo.
- No se comparan nodos con `toBe(instance)` (riesgo de JSON circular en el
  worker de jest): se comparan `testID`, `className`, `type` y `children`.
- `StyleSheet` no aparece en el fichero de test.
- Rojo y verde se cuentan con la salida de jest, no con `grep` (los `it.each`
  se expanden por fila).

## Evidencia (medida en `26b86621`)

Cuentas con `grep -cF -- "<literal>" <fichero>` desde `mobile-pet-tracker/`.
Fichero `src/screens/food/ai-explanation.tsx`:

| Literal | Hoy | Tras #234 |
|---|---|---|
| `onLayout` | 1 | 1 (el del medidor) |
| `testID="food-ai-content"` | 1 | 1 |
| `testID="food-ai-measure"` | 0 | 1 |
| `setContentHeight(` | 1 | 1 |
| `const AI_CLAMP_HEIGHT = 122;` / `const AI_FADE_HEIGHT = 36;` | 1 / 1 | 1 / 1 |
| `blocks.map(` | 1 | 1 (dentro de `renderBlocks`) |
| `renderBlocks(` | 0 | 3 (definición + 2 usos, cada uno en su línea) |
| `mt-1.75 size-1.25 shrink-0 rounded-full` | 1 | 1 |
| `flex-1 text-13 font-medium leading-body text-foreground` | 1 | 1 |
| `absolute inset-x-0 top-0 opacity-0` | 0 | 1 |
| `absolute inset-x-0 bottom-0` | 1 | 1 |
| `pointerEvents="none"` | 1 | 2 |
| `accessibilityElementsHidden` | 0 | 1 |
| `importantForAccessibility="no-hide-descendants"` | 0 | 1 |
| `overflow-hidden` | 1 | 1 |
| `#224 R6` | 2 | 2 |

Fichero `src/screens/food/ai-explanation.test.tsx`: `grep -cF "await layout("`
→ 10 hoy (esos 10 sitios expanden a 21 casos de jest); `grep -cF "#234"` → 0
hoy; `grep -cF "(enmendado por #234 R4)"` → 0 hoy y 1 tras #234.

Línea base de jest (T0, antes de editar): `ai-explanation.test.tsx` = 28 tests
(6 de R4, 2 de R5, 6 de R6, 3 de R7, 6 de R8, 3 de R9, 2 de R11), todos en
verde.

Guards de la carta, contados contra el cambio (ver [[design]] §Guards):
`nutrition-canvas-fidelity.test.ts` (`#224 R13`: sin `StyleSheet`, sin corchetes,
sin hex salvo `#NNN R<n>`; presencia de `leading-body`),
`profile-canvas-fidelity.test.ts` (lista de ficheros con `text-13`, que sigue
incluyendo `ai-explanation.tsx`), `ui-language.test.ts` y `ui-copy-table.ts`
(tres filas `food.ai*`, sin llamadas `t(` nuevas), `design-drift.test.ts`,
`consistency-classnames.test.ts`, `legibility-classnames.test.ts`. El cambio
añade **una** cadena de clases (`absolute inset-x-0 top-0 opacity-0`), ninguna
arbitraria, ningún color, radio ni copy, y ninguna `StyleSheet`. Ninguno de esos
guards se mueve; el handoff pone T0 (suites de `src/screens/food` y
`src/__tests__` en verde **antes** de editar) y la misma tras cada commit de
producción.

## Requisitos funcionales

- **R1**: WHEN `AiExplanation` se pinta con cualquier texto, THE SYSTEM SHALL
  pintar un único nodo `food-ai-measure`, hijo directo de la raíz `gap-2` y
  hermano anterior de `food-ai-body` (ni descendiente de `food-ai-body` ni de
  `food-ai-content`), y SHALL dar el `onLayout` del componente solo a ese nodo:
  ni `food-ai-body` ni `food-ai-content` ni ningún otro nodo del componente
  llevan `onLayout`.
  - Test: `src/screens/food/ai-explanation.test.tsx`,
    `describe('#234 R1: el medidor vive fuera del recorte')` con tres `it`
    (una decisión por `it`):
    1. `#234 R1: food-ai-measure es hermano anterior de food-ai-body bajo la raíz gap-2`:
       monta `SAMPLE`; la raíz es el `parent` de `food-ai-body` y su `className`
       es exactamente `gap-2`; los `testID` de sus hijos, en orden, son
       `['food-ai-measure', 'food-ai-body', 'food-ai-disclaimer']` sin evento, y
       `['food-ai-measure', 'food-ai-body', 'food-ai-more', 'food-ai-disclaimer']`
       tras `await layout(400)`.
    2. `#234 R1: ningún ancestro del medidor es el recorte ni su contenido`:
       sube con `.parent` desde el medidor (encontrado con
       `includeHiddenElements: true`), junta los `testID` de todos los
       ancestros y aserta que no contienen `food-ai-body` ni `food-ai-content`,
       que el primer ancestro tiene `className` `gap-2` (la cadena no es
       vacía), y que
       `within(screen.getByTestId('food-ai-body')).queryByTestId('food-ai-measure', { includeHiddenElements: true })`
       es `null`.
    3. `#234 R1: solo el medidor lleva onLayout`: recorre **todos** los nodos
       host bajo la raíz (también los ocultos), junta el `testID` de los que
       tienen `typeof props.onLayout === 'function'` y aserta `toEqual(['food-ai-measure'])` **y** `toHaveLength(1)` (`toEqual` ignora un `undefined` final del array, así que sin la longitud un portador anónimo no rompe la igualdad)
       (un nodo anónimo con `onLayout` aparece como `undefined` y rompe la
       igualdad); además `food-ai-content` y `food-ai-body` tienen
       `props.onLayout` `undefined`.
  - Mutaciones plantadas (cada una se revierte): (a) devolver `onLayout` a
    `food-ai-content` conservando el del medidor → rojo el `it` 3 (dos
    portadores) y rojo R5 filas 1, 2, 4 y 5; (b) mover `food-ai-measure` dentro de
    `food-ai-body`, como hermano de `food-ai-content` → rojo los `it` 1 y 2, y
    **ningún** test de comportamiento (R4, R5, R6) lo ve: es la zona ciega que
    cubre la estructura; (c) mover `food-ai-measure` dentro de `food-ai-content`
    → rojo `it` 2 y el `#224 R5` existente (`content.children` ya no es 6);
    (d) envolver el `onLayout` del medidor en un `View` sin `testID` dentro del
    recorte → rojo el `it` 3.

- **R2**: WHEN `AiExplanation` se pinta, THE SYSTEM SHALL pintar dentro de
  `food-ai-measure` los mismos bloques que dentro de `food-ai-content`, con el
  mismo tipo de nodo, la misma `className`, el mismo texto, los mismos tramos en
  negrita y el mismo `backgroundColor` de cada punto, y SHALL NOT dar `testID` a
  ningún nodo dentro del medidor, de modo que `food-ai-block-<i>` y
  `food-ai-dot-<i>` existen una sola vez en todo el árbol.
  - Test: `describe('#234 R2: el medidor repite lo que se ve')` con
    `it.each` de tres filas, una por rama del parser:
    `['SAMPLE', SAMPLE, 6, 9]`, `['una viñeta tras una línea', LINE_BULLET, 2, 3]`,
    `['solo una viñeta', BULLET_ONLY, 1, 2]` (texto, número de bloques, número
    total de nodos `food-ai-block-*` + `food-ai-dot-*`; los tres números a mano:
    9 = 6 bloques + 3 puntos, 3 = 2 + 1, 2 = 1 + 1). Cada `it` aserta:
    `food-ai-measure.children` y `food-ai-content.children` tienen la misma
    longitud (el número de bloques); para cada índice, la forma
    `{ type, className, backgroundColor del style si existe, hijos }` del hijo
    del medidor es igual (`toEqual`) a la del hijo de `food-ai-content`, con
    la forma calculada de manera recursiva e **ignorando `testID`**; ningún nodo
    del subárbol del medidor tiene `testID`; y
    `screen.queryAllByTestId(/^food-ai-(block|dot)-\d+$/, { includeHiddenElements: true })`
    tiene exactamente la longitud de la tercera columna.
  - Mutaciones plantadas (una por rama; cada una se revierte): (a) la variante
    del medidor omite el margen `mt-2` de los párrafos con índice > 0 → rojo
    solo SAMPLE; (b) omite el margen de las viñetas (`mt-1` / `mt-1.5`) → rojo
    SAMPLE y LINE_BULLET; (c) añade `mt-1.5` a una viñeta de índice 0 → rojo
    solo BULLET_ONLY; (d) el medidor sin los puntos de viñeta → rojo las tres
    filas; (e) el medidor reparte `testID` de bloque → rojo las tres filas
    (subárbol con `testID` y cuenta duplicada); (f) el medidor sin los tramos
    `font-extrabold` → rojo solo SAMPLE.

- **R3**: WHEN `AiExplanation` se pinta, THE SYSTEM SHALL dar a
  `food-ai-measure` `className` exactamente `absolute inset-x-0 top-0 opacity-0`,
  `pointerEvents` `none`, `accessibilityElementsHidden` `true` e
  `importantForAccessibility` `no-hide-descendants`, SHALL NOT marcarlo
  `accessible` ni darle `accessibilityLabel`, y SHALL dejar la unidad de lectura
  como está (`food-ai-body` con `accessibilityLabel` igual al texto plano), de
  modo que una consulta por defecto encuentra una sola copia del texto y el
  lector de pantalla no lo lee dos veces.
  - Test: `describe('#234 R3: el medidor está oculto e inerte')` con dos `it`:
    1. `#234 R3: el medidor no se ve, no se toca y no se lee`: aserta las cuatro
       propiedades de arriba con `toBe`, que `props.accessible` no es `true` y
       que `props.accessibilityLabel` es `undefined`.
    2. `#234 R3: las consultas por defecto ven una sola copia del texto`:
       monta `SAMPLE`; `screen.getAllByText('Para acompañarlo bien:')` tiene
       longitud 1 y la misma consulta con `{ includeHiddenElements: true }` tiene
       longitud 2 (la segunda cifra impide que el `it` pase en vacío si el
       medidor no existe o no está oculto); `food-ai-body` tiene
       `accessibilityLabel` igual a `SAMPLE_PLAIN`.
  - Mutaciones plantadas, **una por propiedad** (cada una sola): (a) quitar
    `accessibilityElementsHidden` → rojo `it` 1 (el `it` 2 queda verde porque
    RNTL también oculta por la otra propiedad); (b) quitar
    `importantForAccessibility` → rojo `it` 1, `it` 2 verde; (c) quitar las dos
    → rojo `it` 1 y `it` 2 (longitud 2 por defecto); (d) quitar
    `pointerEvents="none"` → rojo `it` 1; (e) quitar `opacity-0` de la clase →
    rojo `it` 1 (la comparación exacta de `className` es lo único que lo ve;
    el aspecto real lo confirma el smoke); (f) `accessible` en el
    medidor → rojo `it` 1.

- **R4** (enmienda de #224 R6): WHEN `food-ai-measure` emite un evento
  `layout` con `nativeEvent.layout.height` mayor que **122** y el componente
  está colapsado, THE SYSTEM SHALL limitar `food-ai-body` con
  `style={{ maxHeight: 122 }}` y `className="overflow-hidden"` y mostrar
  `food-ai-fade` y `food-ai-more`; WHEN ese alto es 122 o menos, o todavía no
  hay evento, THE SYSTEM SHALL NOT limitar el alto ni mostrar el degradado ni el
  botón. El degradado conserva sus 36, su `pointerEvents`, su `className` y su
  `style` exactos de #224 R6.
  - Test: los `it` existentes de #224 R6 **sin tocar sus aserciones**; solo cambia
    qué nodo dispara el evento (el helper `layout` de «Convenciones») y el
    título del `it.each` de la frontera gana el sufijo
    ` (enmendado por #234 R4)` al final:
    `#224 R6: alto %s limita según la frontera de 122 (enmendado por #234 R4)`
    (filas: sin evento, 0, 122, 123, 400) y
    `#224 R6: el degradado ocupa 36 y usa el fondo violeta del tema` (título
    intacto). Los otros `it` que llaman a `layout()` (#224 R4, R7, R8, R9)
    cambian solo por el helper y se listan en R7.
  - Mutaciones plantadas: (a) `>` por `>=` → rojo la fila 122; (b) `122` por
    `123` en `AI_CLAMP_HEIGHT` → rojo la fila 123; (c) el `onLayout` del medidor
    lee `layout.width` en lugar de `layout.height` (el evento del test lleva
    `width: 300`) → rojo las filas 0 y 122 (300 > 122 las recortaría) ;
    (d) quitar el `onLayout` del medidor, dejando el nodo, y ponerlo en el
    contenido (el código de hoy) → rojo las filas 123 y 400 (los eventos del medidor ya no
    llegan a ningún manejador). Ancla de handoff,
    no un `it`: `grep -cF "(enmendado por #234 R4)" src/screens/food/ai-explanation.test.tsx`
    imprime `1`.

- **R5**: WHEN `food-ai-content` (el nodo recortado) emite un evento `layout`
  con cualquier alto, THE SYSTEM SHALL NOT cambiar si la tarjeta está recortada:
  ni el `style` de `food-ai-body`, ni la presencia de `food-ai-fade` y
  `food-ai-more`.
  - Test: `describe('#234 R5: el nodo recortado no decide')` con `it.each` de
    cinco filas, una por rama `[medida del medidor, evento del recortado,
    ¿recortado?]`: `['recortado reporta 122 tras medir 400', 400, 122, true]`,
    `['recortado reporta 0 tras medir 400', 400, 0, true]`,
    `['recortado reporta 400 tras medir 400', 400, 400, true]`,
    `['recortado reporta 400 con medida 100', 100, 400, false]`,
    `['recortado reporta 400 sin medida', undefined, 400, false]`. Cada `it`
    monta `SAMPLE`, emite `layout(medida)` si la medida no es `undefined`,
    emite `clippedLayout(evento)` y aserta, según la última columna, el estado
    recortado completo (`food-ai-body` con `style` `{ maxHeight: 122 }`,
    `food-ai-fade` y `food-ai-more` presentes) o el estado sin recortar (sin
    `style`, sin degradado, sin botón). Las filas 1 y 2 reproducen la oscilación
    del dispositivo (el recorte reporta unos 122 o menos y apagaba el recorte).
  - Mutaciones plantadas: (a) devolver `onLayout` a `food-ai-content` conservando el del medidor →
    rojo las filas 1, 2, 4 y 5 (la fila 3 coincide con la medida y queda verde:
    por eso las otras cuatro son el candado); (b) `onLayout` en `food-ai-body`
    en lugar de en el contenido → rojo las mismas filas (un evento disparado en
    el contenido burbujea al manejador del padre); (c) un `onLayout` anónimo en
    un `View` que envuelve al contenido dentro del recorte → rojo las mismas
    filas más R1 `it` 3.

- **R6**: WHEN se repite la secuencia que el dispositivo emitía (medidor 400,
  recortado 122, medidor 400, recortado 0), o el usuario expande y contrae, o
  el texto cambia, THE SYSTEM SHALL mantener el recorte, la expansión y la
  re-medición gobernados solo por el medidor.
  - Test: `describe('#234 R6: el recorte no oscila')` con tres `it`:
    1. `#234 R6: la secuencia que producía el parpadeo se queda quieta`: monta
       `SAMPLE`; `layout(400)`; luego tres vueltas de
       `clippedLayout(122)`, `layout(400)`, `clippedLayout(0)`; **tras cada
       evento** aserta `food-ai-body` con `style` `{ maxHeight: 122 }`,
       `food-ai-fade` presente y el texto `Ver más` visible.
    2. `#234 R6: expandir y contraer no dependen del nodo recortado`:
       `layout(400)`; pulsar `food-ai-more` → expandido (`style` `undefined`,
       sin degradado, `Ver menos`); `clippedLayout(100)` → sigue expandido;
       `layout(400)` → sigue expandido; pulsar → contraído (`{ maxHeight: 122 }`);
       `clippedLayout(400)` → sigue contraído.
    3. `#234 R6: un texto nuevo se mide otra vez en el medidor`: `SAMPLE` con
       `layout(400)` recortado; `rerender` con `OTHER_TEXT`; `layout(100)` → sin
       `style`, sin degradado, sin botón; `clippedLayout(400)` → sigue sin
       recorte; `rerender` con `SAMPLE`; `layout(400)` → recortado otra vez.
  - Mutaciones plantadas: (a) devolver `onLayout` a `food-ai-content` → rojo
    `it` 1 (`clippedLayout(122)` apaga el recorte), `it` 2 (`clippedLayout(100)`
    contrae el estado) y `it` 3 (`clippedLayout(400)` tras la medida 100); (b)
    que `expanded` se reinicie al llegar un `layout` del medidor → rojo `it` 2;
    (c) quedarse con la primera medida y no actualizarla (cerrojo) → rojo `it` 3
    (tras `OTHER_TEXT`, `layout(100)` no desrecorta). Es el parche que D6/D8
    descartan; el candado impide que se cuele.

- **R7**: WHEN R1 a R6 cambian de dónde se mide, THE SYSTEM SHALL conservar
  sin cambio el aspecto y la lectura de la tarjeta de IA y dejar el resto del
  repo sin tocar: los `it` de #224 R4, R5, R7, R8, R9 y R11 y el degradado de R6
  siguen verdes con las mismas aserciones; solo cambia el helper `layout` que
  usan; `src/screens/food/index.tsx` y `src/screens/food/index.test.tsx` no
  cambian y su suite sigue verde; los guards de la carta no se mueven.
  - Test A: los `it` existentes de `ai-explanation.test.tsx` listados arriba,
    **sin tocar sus aserciones**. Ancla de handoff, no un `it`:
    `git diff <H0>..HEAD -- src/screens/food/ai-explanation.test.tsx | grep '^-' | grep -v '^---'`
    solo puede listar las líneas del cuerpo del helper `layout`, la firma del
    helper si cambia y el título de `#224 R6` de R4.
  - Test B (no regresión del consumidor, por jest): `src/screens/food` y
    `src/__tests__` en verde con las mismas cifras de suites que T0 más los
    tests nuevos (16).
  - Test C (alcance, por diff, no por jest): el handoff comprueba
    `git diff --name-only <H0>..HEAD` y solo permite bajo `mobile-pet-tracker/`
    `src/screens/food/ai-explanation.tsx` y
    `src/screens/food/ai-explanation.test.tsx`, más ficheros bajo `progress/`.
    Ni `src/i18n/`, ni `src/__tests__/ui-copy-table.ts`, ni `src/theme/`, ni
    `docs/`, ni `src/screens/food/index.tsx` cambian.
  - Mutaciones plantadas: (a) quitar `shrink-0` del punto en `renderBlocks` →
    rojo el `#224 R5` existente (R2 no lo ve: los dos nodos salen de la misma
    función y coinciden entre sí; por eso R7 conserva el candado de #224 R5);
    (b) añadir una
    `StyleSheet` o un hex sin `#NNN R<n>` en el fuente → rojo `#224 R13` en
    `nutrition-canvas-fidelity.test.ts`; (c) ancla de handoff:
    `grep -cF "absolute inset-x-0 top-0 opacity-0" src/screens/food/ai-explanation.tsx`
    imprime `1` (la clase del medidor no se duplica).

## Enmiendas a otras features

| Enmendado | Ruta | Qué cambia | Dónde se anota |
|---|---|---|---|
| #224 R6 | `specs/mobile-nutrition-ai-format/requirements.md` (R6) y su `it.each` `#224 R6: alto %s limita según la frontera de 122` en `src/screens/food/ai-explanation.test.tsx` | El alto que decide el recorte se mide en `food-ai-measure` (fuera del recorte) y deja de medirse en `food-ai-content` (dentro). Cambia el nodo que emite el evento `layout`; no cambian 122, 36, la frontera `>`, el `style` ni el `className` del recorte, el degradado ni la tabla de frontera (sin evento, 0, 122, 123, 400) | Sufijo `(enmendado por #234 R4)` en el título del `it.each` (R4). El texto de R6 en la spec #224 no se edita: la enmienda se explica aquí y su casilla vive en `specs/mobile-nutrition-ai-format/requirements.md` § Aprobación (la añade esta spec, sin marcar). La premisa de `design.md` de #224 (el hijo no se encoge bajo el `maxHeight`) queda como histórica |

## Paso de smoke nuevo (G2, humano, en lote al final)

Anotar en `progress/smoke_mejoras-smoke.md` (lo registra el leader). Reproduce
el fallo original, en el dev build de Android, en tema **claro** y en **oscuro**,
con una mascota que tenga plan de nutrición con «Recomendación IA»
(explicación larga). Palabras del humano: «No marque mobile-nutrition-ai-format
porque en eñ colapso de IA queda parpadiando».
1. Abrir Nutrición. La tarjeta «Recomendación IA» aparece **colapsada**, con el
   degradado sobre el borde inferior y «Ver más». Mirarla 10 segundos sin tocar
   nada: antes parpadeaba (cambiaba de alto una y otra vez); ahora queda
   quieta. Se admite un único salto al primer pintado.
2. Salir de Nutrición y volver a entrar tres veces: cada vez termina colapsada
   y quieta.
3. Pulsar «Ver más»: el texto se muestra completo y queda quieto; pulsar «Ver
   menos»: vuelve a unas seis líneas con degradado y queda quieto. Repetir
   tres veces.
4. Cambiar entre dos mascotas con planes distintos: el texto nuevo aparece
   colapsado y quieto (si la nueva explicación es corta, sin botón ni
   degradado).
5. Tema oscuro y tema claro: el degradado se funde con el fondo violeta sin
   banda visible, igual que en el artboard aprobado; no hay espacio vacío
   extra bajo la tarjeta.
6. TalkBack: la explicación se lee **una sola vez** (un párrafo continuo) y
   «Ver más» por separado.
Marcar la casilla G2 de esta spec cierra también el smoke de #224
(`progress/smoke_mejoras-smoke.md`, «Smoke de #224 pasado tras #234»).

## Qué cubre jest y qué solo el smoke

| Cubre jest (eventos de layout simulados) | Solo lo cubre el smoke G2 |
|---|---|
| Que el único `onLayout` está en el medidor, fuera del recorte (R1) | Que en Yoga/Fabric real el parpadeo desaparece (el mecanismo exacto no está medido) |
| Que el medidor repite los bloques y está oculto, inerte y sin testIDs (R2, R3) | Que el medidor mide el mismo ancho y el mismo alto natural que lo visible |
| La frontera 122 sobre la medida del medidor (R4) | Que el medidor absoluto no deja espacio vacío ni altera el desplazamiento |
| Que ningún evento del nodo recortado cambia el recorte, ni con 122 ni con 0 (R5) | Que TalkBack no lee el medidor |
| Que la secuencia del lazo, expandir y contraer y el texto nuevo son estables (R6) | Que no hay salto visible al expandir/contraer |
| Que lo visible y los guards no cambian (R7) | Claro y oscuro: aspecto idéntico al aprobado de #224 |

Un test de RNTL no mide layout real: dispara el evento que el dispositivo
emitiría. Por eso R5 y R6 simulan lo que el nodo recortado reportaba (122 o 0) y
la mutación que devuelve el `onLayout` al recorte los pone en rojo; que el
dispositivo deje de oscilar es lo que confirma el smoke.

## Fuera de alcance

- Cambiar 122, 36, el degradado, los colores, el copy o la receta de bloques.
- Ocultar el primer cuadro hasta tener medida o aplicar un recorte inicial
  (D7); animar el expandir/contraer.
- La tarjeta de plan de Nutrición, el parser (`parse-ai-explanation.ts`),
  `src/screens/food/index.tsx`, `src/screens/nutrition-plan/index.tsx`.
- Un guard repo-wide «ningún `onLayout` dentro de un `overflow-hidden`»: hoy es
  el único caso; sería otra feature.
- Dependencias, módulos nativos, backend, rebuild del dev build.
- El smoke en dispositivo (G2).

## Aprobación

- [x] Aprobado por humano (fecha: 2026-11-03, firma delegada del leader: mandato 2026-10-23 ampliado 2026-11-03) ← gate obligatorio antes de implementar
  (R1 a R7; la firma delegada la pone el leader con la checklist de
  `progress/plan_canvas-parity-2026-10-23.md` §4, los tres puntos de
  `progress/plan_ui-2026-10-26.md` §4 y los dos de
  `progress/plan_mejoras-smoke-2026-11-03.md` §4)
- Enmienda de #224 R6: la casilla vive en
  `specs/mobile-nutrition-ai-format/requirements.md` § Aprobación («Enmienda de
  R6 por #234 aprobada», sin marcar). La firma de esta spec no la marca.
- [x] **G2**: smoke en el dev build de Android (claro y oscuro, seis pasos de
  «Paso de smoke nuevo») (fecha: 2026-11-04) ← gate humano, por lote al final
  (`progress/smoke_mejoras-smoke.md`); cierra también el smoke de #224
- Base congelada: `26b86621` (`origin/dev` en `feature/234-mobile-nutrition-ai-collapse-flicker`).
