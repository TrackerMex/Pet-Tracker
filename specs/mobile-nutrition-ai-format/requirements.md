---
feature: "mobile-nutrition-ai-format"
status: draft        # draft | approved
tags: [harness, spec]
---

# Requisitos — [[mobile-nutrition-ai-format]]

> Notación EARS. Cada requisito tiene id único R<n>, inmutable una vez aprobado.
> Ver [[design]] para las decisiones técnicas y el inventario cerrado de candados, y
> [[../../docs/architecture|architecture]] para las reglas de arquitectura.
> Origen: `progress/plan_ui-2026-10-26.md` §1 y §2, entrada #224 (punto 8 de la
> petición de mejoras de UI: la explicación de IA de Nutrición sale como un bloque
> de texto con asteriscos y sin límite de alto) y los artboards aprobados en G1
> `canvas/NutricionIAColapsada.dc.html` y `canvas/NutricionIAExpandida.dc.html`
> (copiados de `canvas-ola0-ui`, más nuevos que el congelado v86 de
> `specs/mobile-canvas-nutrition/canvas/NutricionAvisos.dc.html`).
> Todas las rutas son relativas a `mobile-pet-tracker/src/` salvo que se diga otra cosa.

## Contexto y decisiones cerradas

- **Problema.** `loadedPlan.aiExplanation` es el texto libre del modelo (`string | null`).
  Hoy `screens/food/index.tsx` lo vuelca entero en un `Text` (`food-ai-body`). Cuando el
  modelo responde con markdown aparecen asteriscos literales (`**300 g**`), viñetas
  `- ` como guiones y párrafos pegados; y una respuesta larga empuja el resto de la
  pantalla fuera de la vista.
- **Qué se hace (solo móvil).** Un parser propio y sin dependencias (`parseAiExplanation`)
  convierte el texto en bloques (párrafo, viñeta) con tramos en negrita; un componente
  nuevo (`AiExplanation`) los pinta, recorta la altura a unas seis líneas con un
  degradado y ofrece «Ver más» / «Ver menos»; bajo el texto va siempre el aviso fijo
  «Orientativo: no sustituye la opinión de tu veterinario.».
- **Qué NO se toca.** El prompt y el mapper del backend (`nutrition-prompt.ts`,
  `anthropic-nutrition-explainer.ts`, el mapper) son de #212 / Backend; el móvil se
  adapta a lo que llegue, incluido el texto libre antiguo (R2).
- **Reutilización.** El mismo render lo usará #215 (R11).
- **Reparto con #222 (`mobile-tab-avatar-header`, en paralelo).** #222 es dueño de la
  cabecera y el avatar de Nutrición; #224 es dueño **solo** del bloque JSX de la tarjeta
  de IA (`food-ai-*`) en `screens/food/index.tsx`, de dos ficheros nuevos y de sus tests.
  El segundo PR en mergear hace `git merge origin/dev` (nunca rebase tras la trazabilidad).
  Detalle del reparto de ficheros y testIDs en [[design]] §Reparto.
- **Los textos de ejemplo son sintéticos.** No hay salidas reales de `ai_explanation`
  versionadas; todo texto de esta spec y de sus tests está inventado y así se declara en
  los tests (comentario `// sintético`). No se copian respuestas reales del modelo.

## Copy literal (R4)

| Clave | Español | Inglés |
|---|---|---|
| `food.aiShowMore` | `Ver más` | `See more` |
| `food.aiShowLess` | `Ver menos` | `See less` |
| `food.aiDisclaimer` | `Orientativo: no sustituye la opinión de tu veterinario.` | `For guidance only: it doesn't replace your vet's advice.` |

La explicación del modelo llega en el idioma en que el backend la genere; solo el
aviso y el botón se traducen (ver [[design]] §Riesgos).

## Gramática del parser (la tabla de casos es el contrato)

Los valores de salida están **calculados ejecutando una implementación de referencia en
`node` v20 y revisados a mano**; no se derivan del parser que escribirá Codex ni se
copian de él. Notación: un bloque se escribe `p[...]` (párrafo) o `v[...]` (viñeta);
dentro, los tramos van separados por `|`, y un tramo en negrita se escribe `{b:texto}`
(las llaves son notación de esta tabla, no parte de la entrada). Los tramos son
`{ text, bold }`; los espacios de los bordes de un tramo se muestran tal cual entre
comillas dobles cuando importan. `[]` es la lista vacía. Las entradas son literales de
JavaScript (`\n`, `\r` son los caracteres de control).

**`parseAiExplanation(raw: unknown): AiBlock[]`** con
`AiBlock = { kind: 'paragraph' | 'bullet'; segments: { text: string; bold: boolean }[] }`.

Reglas, en este orden:

1. Si `raw` no es `string`, el resultado es `[]` (nunca lanza).
2. Se normalizan `\r\n` y `\r` a `\n` y se parte por `\n`. **Cada línea no vacía es su
   propio bloque** (no se fusionan líneas consecutivas en un párrafo); las líneas vacías
   o solo espacios se ignoran.
3. Sobre la línea sin espacios en los bordes (`trim`): es **viñeta** si casa con
   `^[-*](?:\s+(.*))?$`, es decir, un `-` o `*` **seguido de espacio** o **solo** en la
   línea; el resto de la línea es el contenido. La sangría se ignora: **las listas
   anidadas se aplanan** a viñetas del mismo nivel. Una viñeta sin contenido se descarta.
   Cualquier otra línea es **párrafo**. (`-5 grados` es párrafo: no hay espacio tras el
   guion; `1. Mide` y `## Plan` también son párrafo y se muestran literales.)
4. Dentro del contenido, `**texto**` (regex lineal `\*\*([^*]+)\*\*`, el texto no
   contiene `*`) es un tramo en negrita. El resto es tramo normal.
5. Todo `*` que queda fuera de un par `**…**` válido (asterisco suelto, `**` sin cerrar,
   `***`) se **elimina** del texto; nunca se muestra.
6. Dentro de cada tramo, las secuencias de dos o más espacios o tabuladores se
   colapsan a un espacio. Al primer tramo del bloque se le quita el espacio inicial y al
   último el final. Los tramos que quedan vacíos se descartan; un bloque sin tramos se
   descarta.
7. No existen cabeceras, listas numeradas, cursiva, código ni enlaces: esas marcas se
   muestran como texto literal (salvo los `*` de la regla 5).

### Tabla R1 — gramática (19 filas)

| # | Entrada | Salida |
|---|---|---|
| 1 | `'Rocky necesita 1200 kcal al día.'` | `p["Rocky necesita 1200 kcal al día."]` |
| 2 | `'Línea uno\nLínea dos'` | `p["Línea uno"]`, `p["Línea dos"]` |
| 3 | `'A\n\n\nB'` | `p["A"]`, `p["B"]` |
| 4 | `'Intro:\n- uno\n- dos'` | `p["Intro:"]`, `v["uno"]`, `v["dos"]` |
| 5 | `'* uno\n* dos'` | `v["uno"]`, `v["dos"]` |
| 6 | `'- a\n* b'` | `v["a"]`, `v["b"]` |
| 7 | `'- a\n  - b\n    * c'` | `v["a"]`, `v["b"]`, `v["c"]` (anidadas aplanadas) |
| 8 | `'- Mide **300 g** al día'` | `v["Mide " \| {b:300 g} \| " al día"]` |
| 9 | `'-5 grados'` | `p["-5 grados"]` |
| 10 | `'a\n-\n- \n*\nb'` | `p["a"]`, `p["b"]` (viñetas vacías descartadas) |
| 11 | `'Toma **300 g** al día'` | `p["Toma " \| {b:300 g} \| " al día"]` |
| 12 | `'**Hola** mundo **fin**'` | `p[{b:Hola} \| " mundo " \| {b:fin}]` |
| 13 | `'**a****b**'` | `p[{b:a} \| {b:b}]` |
| 14 | `'**Plan:** 300 g'` | `p[{b:Plan:} \| " 300 g"]` |
| 15 | `'* **Mide** la porción'` | `v[{b:Mide} \| " la porción"]` |
| 16 | `'**- no es viñeta**'` | `p[{b:- no es viñeta}]` |
| 17 | `'**a**a**a'` | `p[{b:a} \| "aa"]` (el segundo `**` queda sin cerrar y se elimina) |
| 18 | `'## Plan\nTexto'` | `p["## Plan"]`, `p["Texto"]` (cabeceras no soportadas: literales) |
| 19 | `'1. Mide\n2. Sirve'` | `p["1. Mide"]`, `p["2. Sirve"]` (numeradas no soportadas: literales) |

### Tabla R2 — degradación (18 filas)

| # | Entrada | Salida |
|---|---|---|
| 1 | `'Esto es **importante'` (negrita sin cerrar) | `p["Esto es importante"]` |
| 2 | `'Dos * tres'` (asterisco suelto) | `p["Dos tres"]` |
| 3 | `'a*b'` | `p["ab"]` |
| 4 | `'***x***'` | `p[{b:x}]` |
| 5 | `'** **'` | `[]` |
| 6 | `'****'` | `[]` |
| 7 | `'Se recomienda 2 raciones al día * ver nota'` (texto libre antiguo con asterisco) | `p["Se recomienda 2 raciones al día ver nota"]` |
| 8 | `'  texto   con    espacios  '` | `p["texto con espacios"]` |
| 9 | `'A\r\n- b\r\n**c**'` (CRLF) | `p["A"]`, `v["b"]`, `p[{b:c}]` |
| 10 | `'A\r- b'` (CR solo) | `p["A"]`, `v["b"]` |
| 11 | `''` | `[]` |
| 12 | `'   \n\t  '` (solo espacios) | `[]` |
| 13 | `null` | `[]` |
| 14 | `undefined` | `[]` |
| 15 | `42` | `[]` |
| 16 | `{}` | `[]` |
| 17 | `'palabra '.repeat(5000).trim()` (39 999 caracteres) | un solo bloque `p` con un solo tramo normal cuyo texto es igual a la entrada |
| 18 | `'*'.repeat(100000)` | `[]` |

Carga lineal: `Array.from({ length: 20000 }, () => '- **a** b').join('\n')` devuelve 20 000
bloques `v[{b:a} | " b"]` (se comprueba la cuenta y los dos extremos; **no se asierta
tiempo**, solo que termina). Ninguna entrada de las dos tablas hace lanzar al parser.

### Texto de ejemplo (sintético) y etiqueta continua

Texto `SAMPLE` (declarado sintético; las tildes y el `\n` son los de la cadena):

```
Rocky necesita **1200 kcal** al día: son 300 g de su alimento repartidos en tres comidas (08:00, 13:00 y 18:00).
Para acompañarlo bien:
- Mide la porción con una **taza dosificadora**, no a ojo.
- Cuenta los **premios** dentro de los 300 g del día.
- Suma un paseo corto por la tarde si hoy se movió poco.
Como registraste alergias alimentarias, revisa la etiqueta de cualquier alimento nuevo antes de dárselo. Si algo te genera dudas, tu veterinario puede orientarte.
```

`parseAiExplanation(SAMPLE)` devuelve 6 bloques en este orden de tipos: párrafo,
párrafo, viñeta, viñeta, viñeta, párrafo, con 3 tramos en negrita (`1200 kcal`,
`taza dosificadora`, `premios`). Su texto plano exacto está en R3.

## Requisitos funcionales

### Parser (`screens/food/parse-ai-explanation.ts`)

- **R1**: WHEN `parseAiExplanation` recibe un `string` THE SYSTEM SHALL devolver, para
  cada fila de la tabla «R1 — gramática», exactamente los bloques y tramos listados,
  aplicando las reglas 2 a 7 de la gramática: una línea no vacía es un bloque, `-` o
  `*` seguido de espacio abre una viñeta, la sangría se ignora, `**texto**` es negrita.
  - Test: `screens/food/parse-ai-explanation.test.ts`, `it.each` titulado
    `'#224 R1: ...'` con las 19 filas, comparando con `toEqual` contra objetos
    literales escritos a mano en el test (nunca construidos con el propio parser ni con
    una función auxiliar que reimplemente la gramática). Todas nacen rojas (el módulo
    no existe). Mutaciones obligatorias: (a) cambiar el regex de viñeta a
    `^[-*]\s*(.*)$` pone rojas las filas 9 y 16 (`-5 grados` sería viñeta); (b) no
    aplanar la sangría (`trim` solo a la derecha) pone roja la fila 7; (c) fusionar
    líneas consecutivas en un párrafo pone rojas las filas 2, 4 y 18.

- **R2**: IF la entrada no es un `string`, está vacía, es solo espacios, tiene
  asteriscos sueltos o `**` sin cerrar, usa `\r\n` o `\r`, es texto libre antiguo sin
  marcas, o es muy larga THEN THE SYSTEM SHALL no lanzar nunca y devolver, para cada
  fila de la tabla «R2 — degradación», exactamente la salida listada, de modo que el
  caso peor es el texto plano sin asteriscos. THE SYSTEM SHALL NOT mostrar nunca un `*`
  en el texto de un tramo.
  - Test: `screens/food/parse-ai-explanation.test.ts`, `it.each` titulado
    `'#224 R2: ...'` con las 18 filas, más `it('#224 R2: ninguna entrada lanza y
    ningún tramo contiene *')` que recorre las entradas de las dos tablas y de la carga
    lineal con `expect(() => parseAiExplanation(x)).not.toThrow()` y comprueba
    `segments.every((s) => !s.text.includes('*'))`, más
    `it('#224 R2: es lineal en la carga de 20000 viñetas')` (cuenta 20000 y dos
    extremos; sin cronómetro). Mutaciones: (a) quitar la normalización `\r\n?` pone
    rojas las filas 9 y 10; (b) no eliminar el `*` suelto pone rojas al menos las filas 1 a 4, 7 y 18; (c) que el parser lance con `null` pone roja la fila 13; (d) cambiar el regex de
    negrita a `\*\*(.+)\*\*` (voraz) pone roja la fila 12 de R1 y la 17.

- **R3**: THE SYSTEM SHALL exportar `aiExplanationPlainText(blocks: AiBlock[]): string`,
  que devuelve el texto de todos los bloques sin marcas: los tramos de cada bloque
  concatenados sin separador y los bloques unidos por `\n`, sin ningún glifo de viñeta
  ni asterisco. WHEN la lista de bloques es vacía THE SYSTEM SHALL devolver `''`.
  - Tabla (entrada del parser, texto plano):

    | Entrada | `aiExplanationPlainText(parseAiExplanation(entrada))` |
    |---|---|
    | `'Intro:\n- uno\n- dos'` | `'Intro:\nuno\ndos'` |
    | `'- Mide **300 g** al día'` | `'Mide 300 g al día'` |
    | `'A\r\n- b\r\n**c**'` | `'A\nb\nc'` |
    | `'**a**a**a'` | `'aaa'` |
    | `''` | `''` |
    | `SAMPLE` | `'Rocky necesita 1200 kcal al día: son 300 g de su alimento repartidos en tres comidas (08:00, 13:00 y 18:00).\nPara acompañarlo bien:\nMide la porción con una taza dosificadora, no a ojo.\nCuenta los premios dentro de los 300 g del día.\nSuma un paseo corto por la tarde si hoy se movió poco.\nComo registraste alergias alimentarias, revisa la etiqueta de cualquier alimento nuevo antes de dárselo. Si algo te genera dudas, tu veterinario puede orientarte.'` |

  - Además, `parseAiExplanation(SAMPLE)` devuelve 6 bloques con tipos
    `paragraph, paragraph, bullet, bullet, bullet, paragraph` y exactamente 3 tramos en
    negrita, en este orden: `1200 kcal`, `taza dosificadora`, `premios`.
  - Test: `screens/food/parse-ai-explanation.test.ts`, `it.each` titulado
    `'#224 R3: ...'` (6 filas) y `it('#224 R3: SAMPLE ...')`. Las cadenas esperadas son
    literales del test, no el resultado de unir los tramos del propio parser.
    Mutación: unir los bloques con `' '` en vez de `'\n'` pone rojas las filas 1 y 3 y
    la del `SAMPLE`.

### Copy (`i18n/catalog.ts` y candados de traducción)

- **R4**: THE SYSTEM SHALL añadir al catálogo, en español e inglés, las tres claves de la
  tabla «Copy literal» con exactamente esos textos, y THE SYSTEM SHALL registrar sus tres
  usos en `__tests__/ui-copy-table.ts` (`R6_FOOD`, fichero
  `src/screens/food/ai-explanation.tsx`), de modo que cada clave aparezca como
  `t('<clave>')` **una sola vez** en ese fichero. El rótulo del botón es
  `expanded ? t('food.aiShowLess') : t('food.aiShowMore')`, nunca una clave calculada.
  THE SYSTEM SHALL NOT dejar ninguno de esos tres textos como literal en un fichero de
  pantalla (lo vigila `ui-language.test.ts`).
  - Test: (1) `providers/__tests__/language-provider.test.tsx`, el `it` de longitud de
    catálogo (`#194 R1 ...`) suma `+ 3 // #224 R4` (la última línea hoy es
    `+ 26, // #208 R19`: la coma pasa a la nueva última línea) y su título gana
    `(enmendado por #224 R4)`; la paridad ES/EN y la igualdad de marcadores ya existen.
    (2) `__tests__/ui-language.test.ts`: el `it` de `R6_FOOD` (`resuelve las 51
    ocurrencias normativas`) suma `+ 3 // #224 R4` a la fórmula y el `it` de
    `SCREEN_FILES` (`#194 R5 ...`) suma `+ 1 // #224 R4: screens/food/ai-explanation.tsx`
    tras la línea `+ 1 // #208 R20`; ambos títulos ganan `(enmendado por #224 R4)`.
    (3) `screens/food/ai-explanation.test.tsx`, `it.each` `'#224 R4: ...'` con 6 filas
    (3 claves × es/en) que montan el componente en cada idioma y comparan el texto
    renderizado del botón (con el layout simulado de R7) y el del aviso con los
    literales de la tabla. Nacen rojos al faltar el componente y las claves.

### Render (`screens/food/ai-explanation.tsx`)

- **R5**: WHEN `AiExplanation` recibe un texto THE SYSTEM SHALL pintar un nodo por
  bloque dentro de `food-ai-content`, con testID `food-ai-block-<i>` (`i` desde 0, en el
  orden del parser), con estas clases exactas (se comparan con `toBe`):

  | Bloque | Elemento | `className` |
  |---|---|---|
  | párrafo, índice 0 | `Text` | `text-13 font-medium leading-body text-foreground` |
  | párrafo, índice > 0 | `Text` | `mt-2 text-13 font-medium leading-body text-foreground` |
  | viñeta (contenedor) | `View` | `flex-row gap-2` y, según lo anterior, `mt-1` si el bloque previo es viñeta o `mt-1.5` si es párrafo o `''` si el índice es 0 (el contenedor lleva el margen; la cadena final es `mt-1 flex-row gap-2` / `mt-1.5 flex-row gap-2` / `flex-row gap-2`) |
  | viñeta, punto | `View` (`testID` `food-ai-dot-<i>`) | `mt-1.75 size-1.25 shrink-0 rounded-full`, con `style={{ backgroundColor: <category-violet-strong> }}` |
  | viñeta, texto | `Text` | `flex-1 text-13 font-medium leading-body text-foreground` |

  Los tramos en negrita se pintan como `Text` anidado con `className` exacto
  `font-extrabold`; los tramos normales, como texto directo del `Text` de su bloque.
  THE SYSTEM SHALL NOT escribir glifos de viñeta (`•`, `-`) en el texto: el punto es un
  `View`. THE SYSTEM SHALL NOT usar `StyleSheet`, clases arbitrarias `x-[…]`, literales
  hex ni importar de `heroui-native`.
  - Test: `screens/food/ai-explanation.test.tsx`, `it('#224 R5: ...')`: monta `SAMPLE`
    y comprueba, **por cada hijo** de `food-ai-content` (6 bloques, 3 viñetas, 3
    negritas: una decisión por hijo, no por testID), el tipo de nodo, el `className` de
    la tabla (bloque 0 sin margen; bloque 1 con `mt-2`; bloque 2, primera viñeta tras
    un párrafo, `mt-1.5 flex-row gap-2`; bloque 3 y 4, viñeta tras viñeta, `mt-1
    flex-row gap-2`; bloque 5, párrafo, `mt-2 …`), el `backgroundColor` del punto
    (`'category-violet-strong'`, con el `useThemeColors` identidad) y que cada tramo en
    negrita tiene `font-extrabold` y los normales no. Un segundo `it` monta
    `'Línea\n- uno'` y comprueba que el texto de la viñeta es `uno` y que no existe
    ningún nodo con texto `-` ni `•`. Mutaciones: poner `mt-2` también en el bloque 0 o
    quitar `shrink-0` del punto los pone rojos.

- **R6**: WHEN el alto medido de `food-ai-content` (evento `onLayout`,
  `nativeEvent.layout.height`) es **mayor que 122** y el componente está colapsado THE
  SYSTEM SHALL limitar el alto de `food-ai-body` con `style={{ maxHeight: 122 }}` y
  `className="overflow-hidden"` y mostrar encima de su borde inferior el degradado
  `food-ai-fade`; WHEN el alto medido es **122 o menos**, o aún no hay medida, THE SYSTEM
  SHALL NOT limitar el alto ni mostrar el degradado ni el botón. El degradado es un
  `View` con `pointerEvents="none"`, `className="absolute inset-x-0 bottom-0"` y
  `style={{ height: 36, experimental_backgroundImage: 'linear-gradient(to bottom, <s>00 0%, <s> 100%)' }}`
  con `<s>` el color `category-violet` resuelto por `useThemeColors`; con el doble
  identidad del test el valor es exactamente
  `'linear-gradient(to bottom, category-violet00 0%, category-violet 100%)'`.
  Los números 122 y 36 son constantes del módulo (`AI_CLAMP_HEIGHT`, `AI_FADE_HEIGHT`)
  tomadas de los artboards (`max-height:122px`, máscara del 70 % al 100 %); solo el smoke
  de dispositivo puede cambiarlas.
  - Test: `screens/food/ai-explanation.test.tsx`, `it.each('#224 R6: ...')` sobre el
    alto medido (se simula con `await fireEvent(screen.getByTestId('food-ai-content'),
    'layout', { nativeEvent: { layout: { x: 0, y: 0, width: 300, height: H } } })`):

    | Alto medido H | `maxHeight` en `food-ai-body` | `food-ai-fade` | `food-ai-more` |
    |---|---|---|---|
    | sin evento | sin `maxHeight` | ausente | ausente |
    | 0 | sin `maxHeight` | ausente | ausente |
    | 122 | sin `maxHeight` | ausente | ausente |
    | 123 | `122` | presente | presente |
    | 400 | `122` | presente | presente |

    Más un `it` que fija el `style` del degradado con el literal de arriba, su
    `pointerEvents` y su `className`. Las filas 122 y 123 son el candado de la frontera:
    cambiar `>` por `>=` o `122` por `123` en la constante las pone rojas.

- **R7**: WHEN el recorte está activo (R6, H > 122) THE SYSTEM SHALL mostrar el botón
  `food-ai-more`, un `Pressable` con `accessibilityRole="button"`,
  `accessibilityState={{ expanded }}`, `hitSlop={TOUCH_SLOP}` (importado de
  `theme/touch-target.ts`), `className="h-8 flex-row items-center gap-1 self-start"`
  (32 px visibles más 12 de `hitSlop` = zona táctil de 44), con un rótulo `Text` de
  `className` exacto `text-13 font-extrabold text-category-violet-strong` (obtenido de
  `CATEGORY_SLOTS.violet.ink`, nunca escrito como literal de clase) y un icono de
  `reicon-react-native`: `ChevronDown` colapsado y `ChevronUp` expandido, con
  `size={16}`, `strokeWidth={2.6}` y `color` igual al `category-violet-strong` resuelto.
  WHEN el usuario pulsa el botón THE SYSTEM SHALL alternar entre colapsado (rótulo
  `Ver más`, `expanded: false`, `maxHeight: 122`, degradado visible, `ChevronDown`) y
  expandido (rótulo `Ver menos`, `expanded: true`, sin `maxHeight`, sin degradado,
  `ChevronUp`). El texto completo es el mismo en ambos estados. WHEN el texto recibido
  cambia THE SYSTEM SHALL volver al estado colapsado. THE SYSTEM SHALL NOT animar la
  transición.
  - Test: `screens/food/ai-explanation.test.tsx`:
    `it('#224 R7: el botón alterna Ver más / Ver menos y el chevron')` (colapsado:
    rótulo `Ver más`, `accessibilityState.expanded === false`, `food-icon-chevron-down`
    con props `{ size: 16, strokeWidth: 2.6, color: 'category-violet-strong' }`;
    `await fireEvent.press`; expandido: `Ver menos`, `expanded === true`,
    `food-icon-chevron-up`, sin `maxHeight`, sin `food-ai-fade`; segunda pulsación
    vuelve), `it('#224 R7: la zona táctil es de 44')` (`hitSlop` `toEqual(TOUCH_SLOP)`
    importado del módulo real, y `className` exacto con `h-8`),
    `it('#224 R7: un texto nuevo colapsa')` (`await screen.rerender(...)` con otro texto
    estando expandido: vuelve a `Ver más`). Mutaciones: quitar `hitSlop`, cambiar
    `h-8` por `h-6`, derivar el rótulo de `expanded` al revés, o no colapsar al cambiar el
    texto los pone rojos.

- **R8**: THE SYSTEM SHALL pintar siempre, bajo el texto y el botón, el aviso
  `food-ai-disclaimer`: un `Text` con `className` exacto `text-11 leading-body text-muted`
  y el texto de `t('food.aiDisclaimer')`, tanto colapsado como expandido, tanto si hay
  botón como si no, y en los dos idiomas.
  - Test: `screens/food/ai-explanation.test.tsx`,
    `it.each('#224 R8: ...')` con las filas colapsado sin botón, colapsado con botón,
    expandido, en `es` y `en` (6 filas): el aviso existe una vez, con la clase exacta y
    el literal de la tabla «Copy literal». Mutación: ocultar el aviso cuando
    `expanded` es `true` pone roja la fila expandida.

- **R9**: THE SYSTEM SHALL exponer el texto a un lector de pantalla como una sola unidad
  continua: `food-ai-body` es `accessible` y su `accessibilityLabel` es exactamente
  `aiExplanationPlainText(bloques)` (sin glifos de viñeta ni asteriscos, y el texto
  **completo** aunque el recorte lo oculte a la vista), de modo que las viñetas (puntos
  decorativos) no rompen la etiqueta. El botón queda **fuera** de esa unidad y es
  alcanzable por separado. THE SYSTEM SHALL mantener el texto de los bloques accesible a
  `getByText` (los `Text` de bloque son los de R5).
  - Test: `screens/food/ai-explanation.test.tsx`:
    `it('#224 R9: la etiqueta es el texto plano completo')` monta `SAMPLE`, con
    layout 400 (recortado), y compara `food-ai-body.props.accessibilityLabel` con el
    literal de R3 (el del `SAMPLE`) con `toBe`, y `props.accessible === true`;
    `it('#224 R9: el botón no está dentro de la unidad de lectura')`
    (`within(screen.getByTestId('food-ai-body')).queryByTestId('food-ai-more')` es
    `null`); `it('#224 R9: el recorte no cambia la etiqueta')` (misma etiqueta con layout
    400 colapsado y expandido). Mutación: componer la etiqueta con `'• '` por viñeta
    la pone roja.

### Integración (`screens/food/index.tsx`)

- **R10**: WHEN el plan cargado tiene una `aiExplanation` que `parseAiExplanation`
  convierte en al menos un bloque THE SYSTEM SHALL pintar la tarjeta `food-ai-card`
  con esta anatomía (artboards G1): la tarjeta es una columna
  `className={`gap-2 rounded-card ${CATEGORY_SLOTS.violet.surface} p-3.5`}` con
  `CONTINUOUS_CORNER` (sin `flex-row`); su primer hijo es `food-ai-header`, una fila
  `flex-row items-center gap-2` con el icono `Sparkles` (`size={20}`,
  `strokeWidth={2.2}`, `color` igual a `category-violet-strong`) y `food-ai-title`
  (clase sin cambios: `text-sm font-extrabold ${CATEGORY_SLOTS.violet.ink}`, texto
  `t('food.aiRecommendation')`); su segundo hijo es `<AiExplanation text={...} />`
  (R11). IF `aiExplanation` es `null`, `''`, o solo espacios o asteriscos THEN THE
  SYSTEM SHALL NOT pintar la tarjeta. La tarjeta conserva su `RiseIn` de 140 ms y su
  lugar en el orden (`food-plan-card`, `food-meals-section`, `food-warnings`,
  `food-ai-card`, `food-links`). THE SYSTEM SHALL NOT dejar en `index.tsx` el
  `food-ai-body` antiguo (un `Text` con `text-13 leading-body`).
  - Test: `screens/food/index.test.tsx`: se **enmienda** el `it` `'#200 R8: la
    recomendación es la tarjeta violeta del canvas'` (el título gana
    `(enmendado por #224 R10)`): la clase de la tarjeta pasa de
    `'flex-row gap-3 rounded-card bg-category-violet p-3.5'` a
    `'gap-2 rounded-card bg-category-violet p-3.5'`; el icono pasa de `size 22` a
    `size 20`; el padre del título deja de ser el `View` `'flex-1 gap-0.5'` y pasa a ser
    `food-ai-header` con `className` `'flex-row items-center gap-2'`; el cuerpo deja de
    ser un `Text` con `'text-13 leading-body text-foreground'` y pasa a ser el
    `food-ai-body` de R9 con el texto `Plan explicado.` visible por `getByText`; el
    orden `food-icon-sparkles`, `food-ai-title`, `food-ai-body` se mantiene. Nuevo
    `it.each('#224 R10: ...')` con la explicación `null`, `''`, `'   '` y `'**'`:
    `queryByTestId('food-ai-card')` es `null`. Los `it` existentes que leen el cuerpo
    (`R6` con `Split the daily amount into two balanced meals.`, `#62 R5`, `#200 R10`,
    `#200 R11`) siguen verdes **sin editar**. El mock de `reicon-react-native` del test
    gana `ChevronDown` y `ChevronUp` (lista cerrada).

- **R11**: THE SYSTEM SHALL exportar desde `screens/food/ai-explanation.tsx` el
  componente `AiExplanation` con la API mínima `({ text }: { text: string })` (una sola
  prop obligatoria, sin ninguna otra), que pinta el cuerpo, el botón y el aviso (no la
  tarjeta, ni el título, ni el icono), obtiene su copy con `useTranslate()` y su
  color con `useThemeColors`, y no depende de `api/`, de los tipos del plan ni de
  `screens/food/index.tsx`, de modo que #215 lo reutilice con solo importarlo. THE
  SYSTEM SHALL exportar además desde `screens/food/parse-ai-explanation.ts`
  `parseAiExplanation`, `aiExplanationPlainText` y el tipo `AiBlock`.
  - Test: `screens/food/ai-explanation.test.tsx`,
    `it('#224 R11: se monta solo con la prop text, sin tarjeta ni título')`: monta
    `<AiExplanation text={SAMPLE} />` dentro de `LanguageProvider` y comprueba que
    existen `food-ai-body` y `food-ai-disclaimer` y que **no** existen `food-ai-card`,
    `food-ai-header` ni `food-ai-title`. La ausencia de imports prohibidos
    (`api/`, `heroui-native`, `./index`) se verifica con un `it` que lee el fuente del
    módulo y cuenta `0` coincidencias con `/from '(\.\/index|\.\.\/\.\.\/api|heroui-native)/`
    (ver la ancla negativa en [[tasks]]).

### Alcance cerrado

- **R12**: THE SYSTEM SHALL NOT modificar `backend-pet-tracker/` en ningún fichero (en
  particular `nutrition-prompt.ts`, `anthropic-nutrition-explainer.ts` y el mapper de la
  explicación), ni `mobile-pet-tracker/package.json`, ni el lockfile, ni añadir
  dependencias.
  - Test: sin test de jest; la verificación del reporte es
    `git diff origin/dev --stat -- backend-pet-tracker mobile-pet-tracker/package.json mobile-pet-tracker/bun.lock`
    con salida **vacía**, y el reviewer la repite.

- **R13**: THE SYSTEM SHALL mantener consistentes los candados que inventarían los
  ficheros de Nutrición, con estas enmiendas exactas y ninguna otra: (a) en
  `__tests__/profile-canvas-fidelity.test.ts`, el `it` `'limita text-13 a Perfil y a las
  pantallas de cuenta …'` quita `'screens/food/index.tsx'` de la lista (tras R10 ese
  fichero ya no tiene `text-13`) y añade `'screens/food/ai-explanation.tsx', // #224 R13`
  en orden alfabético (después de `'screens/edit-profile/index.tsx'` y antes de
  `'screens/forgot/index.tsx'`), y su título gana `(enmendado por #224 R13)`; (b) en
  `__tests__/nutrition-canvas-fidelity.test.ts`, la fila
  `['Nutricion', 'line-height: 1.4', FOOD, ['leading-body']]` (el `leading-body` del
  cuerpo ya no está en `index.tsx`) se apunta a una constante nueva `AI_EXPLANATION`
  con `src/screens/food/ai-explanation.tsx`, y un `it.each` nuevo `'#224 R13: %s ...'` del mismo
  fichero aplica a `AI_EXPLANATION` y a `AI_PARSER` (`src/screens/food/parse-ai-explanation.ts`)
  las dos comprobaciones de `#200 R17` (sin `StyleSheet` ni `\b[\w-]+-\[`, y sin hex salvo
  la forma `#NNN R<n>`); no se reutiliza `productionFiles` porque `screenFiles` deriva el
  test con `replace('index.tsx', 'index.test.tsx')`, que en el fichero nuevo no cambia nada; (c) los ficheros nuevos y editados
  quedan grep-limpios (cero hex, cero `StyleSheet`, cero `text-[`, cero `\b[\w-]+-\[`,
  cero `#224` suelto: los comentarios usan `#224 R<n>`); (d) las clases del
  componente nuevo (`text-11`, `text-13`, `leading-body`, `text-muted`, `font-medium`,
  `font-extrabold`, `size-1.25`, `mt-1.75`, `rounded-full`, `h-8`) usan tokens y
  utilidades que ya existen, y los inventarios de `design-drift`,
  `consistency-classnames`, `legibility` y `home-canvas-fidelity` no cambian de cuenta
  (inventario cerrado en [[design]] §Candados).
  - Test: los `it` enmendados de (a) y (b), el `it.each` nuevo `'#224 R13: ...'` de
    `__tests__/nutrition-canvas-fidelity.test.ts` (2 filas: `AI_EXPLANATION` y
    `AI_PARSER`; leen el fuente con `source(file)`, como los demás de ese fichero) y la
    suite completa de `__tests__/` **verde**. Ancla negativa probada con una mutación
    plantada (un `StyleSheet` y un hex bare en el fichero nuevo ponen rojas sus filas:
    ver [[tasks]]).

## Fuera de alcance

- Cambiar el prompt, el mapper o el servicio de IA del backend (#212 / Backend), y con
  ello que el modelo emita siempre un formato estable. Una vez #212 fije el formato, el
  parser seguirá tolerando texto libre (R2).
- Soporte de cabeceras (`##`), listas numeradas, cursiva, código, enlaces o tablas: se
  muestran literales (R1 filas 18 y 19). Se decidirá con salidas reales del modelo.
- Traducir la explicación del modelo: solo el aviso y el botón se traducen.
- Animación de despliegue (`LayoutAnimation`, `Reanimated`); el cambio de estado es
  instantáneo.
- La cabecera, el avatar y la tarjeta de plan de Nutrición (#222 y lo ya existente), y
  la reutilización efectiva del componente en #215 (aquí solo se deja la API).
- Persistir si el usuario expandió o no la explicación entre sesiones.
- Una enmienda a `docs/ui-guidelines.md`: la carta no describe la tarjeta de IA; una
  enmienda sería el gate G4 del plan.
- Medir el recorte real en dispositivo en jest: 122 y 36 son los valores de los artboards
  y el smoke del humano los confirma (casilla de § Aprobación).
- Fixtures de respuestas reales de `ai_explanation`.

## Aprobación

- [x] Aprobado por humano (fecha: 2026-10-27, firma delegada del leader: mandato 2026-10-23 ampliado 2026-10-26; G1 aprobado por el humano sobre canvas v153)
- [ ] Smoke de la tarjeta de IA en dev build Android hecho y aprobado por el humano (cierre, no gate de implementación)
  Va en `progress/smoke_ui.md` (plan §5, G2): con un plan real y una explicación larga, el texto se recorta en unas seis líneas con el degradado sobre el borde, «Ver más» expande y «Ver menos» vuelve, la zona táctil del botón es de 44 de alto, TalkBack lee el texto como un párrafo continuo con el botón por separado, y el tema oscuro mantiene el degradado sin banda visible. Si el recorte de 122 o el degradado de 36 no calzan, se ajustan las constantes `AI_CLAMP_HEIGHT` / `AI_FADE_HEIGHT` en una enmienda.
