---
feature: "mobile-docs-canvas-fidelity"
status: approved
tags: [mobile, ui, spec]
---

# #175 mobile-docs-canvas-fidelity — Requisitos

> Lleva la pantalla Documentos (`src/screens/docs/index.tsx`, ruta delgada
> `src/app/pets/[petId]/docs.tsx`) al artboard «Documentos» del canvas aprobado
> (https://claude.ai/artifact/VqaQQsRTtis9Dbttqy3z7j, fichero
> `project/Documentos.dc.html`), **píxel exacto**. Rutas relativas a
> `mobile-pet-tracker/` salvo las que empiezan por `docs/`, `specs/` o
> `progress/`, que son relativas a la raíz del repo.
>
> **Base**: worktree `feature/175-mobile-docs-canvas-fidelity` en `fb5b209f`
> (commit de harness del leader; el código móvil es idéntico a `origin/main`
> `788d1f89`).
>
> **Dependencia dura: #173** (`mobile-tab-screens-canvas-fidelity`, rama en
> `182cf8e8`). La implementación arranca **solo tras mergear #173**, que trae:
> `--font-extrabold`, `--text-13`, `--text-26`, la línea «Tamaños de letra
> fuera de la escala de Tailwind» de la carta y los dos textos de la
> excepción de margen 20. #175 no los vuelve a declarar. El paso H0 de
> `tasks.md` comprueba cada uno con su `grep -cF` (tabla §Dependencias de #173)
> y vuelve a medir toda la tabla de base.
>
> Rige `docs/ui-guidelines.md` (C8 de `CHECKPOINTS.md`). La brecha y las
> decisiones abiertas de origen están en
> `progress/explore_mobile-routine-canvas-fidelity.md` §2.5, §3.2 y §6 (base
> `68da75ab`). El spike de uniwind que fija cómo compilan los tokens numéricos
> está en `specs/mobile-tab-screens-canvas-fidelity/design.md` §5 «Spike
> uniwind: tamaños numéricos» (rama de #173, commit `164909de`).

## Decisiones del humano (no se reabren)

Literales del 2026-10-13, relatadas por el leader:

| Decisión | Respuesta literal | Qué fija en esta spec |
|---|---|---|
| Reparto | «Tres features (Recomendado)» | #175 = solo Documentos; #178 Recordatorios + Nuevo recordatorio; #179 Horario + Historial |
| D-H cabecera | «Título en contenido (Recomendado)» | título dentro de la pantalla y cabecera nativa con `title: ''` (Documentos ya la tiene); enmienda de carta en R2 |
| D-I iconos | «Iconos reicon (Recomendado)» | `reicon-react-native` en lugar de emoji; enmienda de carta en R2 |
| Fidelidad | «Píxel exacto, igual que #174 (Recomendado)» y «el diseño final debe de quedar como el artifac» | margen lateral 20, gap, radios y tamaños del artboard; tokens nuevos donde la escala no llega (R1); cada candado revertido se nombra en §Deltas de candados |
| C11 chips | opción A del explore §3.2 con los defaults D-C11a a D-C11d | los chips filtran por `documentCategory`; los tipos fuera de catálogo caen en «Otros» |

Defaults de C11 heredados del explore §6 (no se reabren):

- **D-C11a**: el campo «Tipo» del formulario sigue siendo libre, y sus tipos
  fuera de catálogo caen en «Otros».
- **D-C11b**: el badge de la fila pinta `document.type` crudo.
- **D-C11c**: un chip de categoría seleccionado se pinta igual que «Todos»
  seleccionado (`bg-foreground` / `text-background`).
- **D-C11d**: Desparasitación sigue en ámbar en documentos. Que sea violeta
  en recordatorios es preexistente y queda fuera de alcance.

## Convenciones de esta spec

- **Comentarios de trazabilidad** en tests y código: siempre `#175 Rn`, nunca
  `#175` suelto. El `HEX_LITERAL` de `src/__tests__/design-drift.test.ts`
  casa `#175` cuando no lleva R-id. Los títulos de `describe` empiezan por
  `#175 Rn:`.
- **Literales, no símbolos**: los tests nuevos aseveran el texto literal
  (`'Todos'`, `'12 jul 2026'`) y las clases literales. Nunca aseveran contra un
  símbolo importado de producción (`CATEGORY_SLOTS`, `fmtDate`, `TOUCH_SLOP`,
  ni `es[...]` para las claves nuevas). Las aserciones heredadas que ya leen
  `es['docs.documentsOf']` se quedan como están.
- **RNTL 14**: siempre `await fireEvent.press(...)` y `await fireEvent(...)`.
- **Contar por hijos, no por testID** (Enmienda #70 de la carta): cada
  candado de composición asevera `node.children.length` y el orden de hijos.
- **Selector por prefijo**: `src/screens/docs/index.test.tsx` usa
  `getAllByTestId(/^doc-/)` y asevera la lista exacta de filas. **Ningún
  testID nuevo empieza por `doc-`**: todos empiezan por `docs-`, y `/^doc-/`
  no casa `docs-…`. Es el único selector por regex sobre `docs?-` en `src/`
  (B24).
- **Textos duplicados**: la etiqueta de un chip («Vacunación», «Consulta»,
  «Desparasitación», «Análisis») coincide con el badge de las filas de esa
  categoría. Toda consulta por texto de un tipo va dentro de
  `within(<fila>)` o `within(<chip>)`; `screen.getByText('Vacunación')` lanza
  «Found multiple elements».
- **Clases**: sin corchetes (regla 3, y C8 de design-drift, que también
  escanea tests colocados). Sin `text-accent` suelto (`legibility-classnames`,
  #61 R4). Sin `rounded-(2xl|lg|md|sm)` (#62 R4). Cada clase prescrita aquí se
  cruzó con esos guards a la base. `p-4.5`, `gap-3.5`, `gap-0.75`, `h-8.5` y
  `size-12` son espaciado fraccionario de la escala: el spike de #173
  confirma que uniwind los compila (`p-4.5` → `padding: 18`).
- **Altura de línea**: un token `--text-<px>` sin `--text-<px>--line-height`
  emite solo `fontSize` (spike de #173). El artboard de Documentos no fija
  ninguna `line-height` (`grep -c 'line-height' project/Documentos.dc.html`
  da 0), así que esta spec no prescribe `leading-*` ni tokens de altura de
  línea.
- **Tracking en `em`**: uniwind multiplica `--tracking-<x>` en `em` por el
  `fontSize` del mismo elemento (spike de #173). Toda clase `tracking-*` va
  con una clase `text-*` en el mismo `Text`.
- **Agregados compartidos**: ningún recuento se congela. Cada uno se da como
  comando + valor a la base + delta. H0 mide la base real y la cifra que se
  escribe es **base H0 + delta**.
- **Fechas de fixture**: cruzan mes **y** año (2025-12 y 2026-01).

## Base medida (`fb5b209f`)

Comandos desde `mobile-pet-tracker/`, salvo B17 a B19 y B26, que van desde la raíz.

| Id | Comando | Valor |
|---|---|---|
| B1 | `grep -cF -- '--text-2xs: 10px;' src/theme/global.css` | 1 |
| B3 | `grep -cE -- '--(text-(11\|15)\|radius-24\|tracking-(title\|eyebrow)):' src/theme/global.css` | 0 |
| B4 | `grep -cF '📄' src/screens/docs/index.tsx` | 1 |
| B5 | `grep -cF "from 'reicon-react-native'" src/screens/docs/index.tsx` | 0 |
| B6 | `grep -cF -- 'padding: 24,' src/screens/docs/index.tsx` / `grep -cF -- 'gap: 16,' …` / `grep -cF -- 'paddingBottom: insets.bottom + 24,' …` | 1 / 1 / 1 |
| B7 | `grep -cF 'rounded-xl bg-accent border-b-4 border-black/25' src/screens/docs/index.tsx` | 2 |
| B8 | `grep -cF "[join('screens', 'docs', 'index.tsx')]: 2," src/__tests__/consistency-classnames.test.ts` | 1 |
| B9 | `grep -cF 'border-b-4\b/g)).toBe(19);' src/__tests__/consistency-classnames.test.ts` / `grep -cF 'border-black\/25/g)).toBe(19);' …` | 1 / 1 (#173 los baja a 18) |
| B10 | `grep -cF 'border-lip-gray/g)).toBe(4 + 1); // #170 R16' src/__tests__/consistency-classnames.test.ts` | 1 |
| B11 | `grep -cF "file: 'src/screens/docs/index.tsx'" src/__tests__/ui-copy-table.ts` | 22 |
| B12 | `grep -cF 'expect(R7_PROFILE).toHaveLength(35 - 1 + 2 + 1 + 16);' src/__tests__/ui-language.test.ts` / `grep -cF "it('resuelve las 53 ocurrencias normativas'" …` | 1 / 1 |
| B13 | `grep -cF '+ 7, // #170 R1' src/providers/__tests__/language-provider.test.tsx` | 1 |
| B14 | `grep -cE "^\s*it(\.each\(\|\()" src/screens/docs/index.test.tsx` | 40 |
| B15 | `grep -cF "'docs." src/i18n/catalog.ts` | 34 (17 por idioma) |
| B16 | `grep -E '^### §2\.[0-9]+' ../specs/mobile-ui-language/design.md \| tail -1` | `### §2.26 — Añadidos por #170 — Alertas agrupadas y mini-mapa` |
| B18 | `grep -cF 'la superficie siempre acompaña a un emoji y a un texto.' docs/ui-guidelines.md` | 1 |
| B19 | `grep -cF -- '- Títulos de pantalla: header del stack cuando exista, no Text suelto.' docs/ui-guidelines.md` | 1 |
| B20 | `grep -cF "name=\"pets/[petId]/docs\" options={{ ...headerOptions, title: '' }}" src/app/_layout.tsx` | 1 |
| B21 | `grep -cF '13 + 1 + 1 + 1 + 1 + 1 + 1); // #146 R8' src/__tests__/consistency-classnames.test.ts` | 2 |
| B22 | `grep -cF "[join('screens', 'docs', 'index.tsx'), 1]" src/__tests__/consistency-classnames.test.ts` / `grep -cF 'style={CONTINUOUS_CORNER}' src/screens/docs/index.tsx` | 1 / 1 |
| B23 | `grep -cF 'inventaría los diecinueve primarios con labio, fichero a fichero' src/__tests__/consistency-classnames.test.ts` | 1 (#173 lo pasa a «dieciocho») |
| B24 | `grep -rnE "ByTestId\(/\^docs?-" src` | 1 línea (`src/screens/docs/index.test.tsx`, `getAllByTestId(/^doc-/)`) |
| B25 | `grep -cF 'tracking-widest' src/screens/docs/index.tsx` / `grep -cF 'text-2xs' src/screens/docs/index.tsx` | 1 / 9 |
| B26 | `grep -cF '## Enmienda de fidelidad al canvas' docs/ui-guidelines.md` | 0 |
| B27 | `grep -cF "'docs-upload-cancel'," src/__tests__/consistency-classnames.test.ts` | 2 (una en la tabla de variantes `outline` y otra en el inventario de secundarios neutros; la zona de R7 es `Pressable`, no `<Button`, y no entra en ninguno) |
| B28 | `grep -cE "ByText\('(Vacunación\|Consulta\|Desparasitación\|Análisis\|Otros\|Todos)'" src/screens/docs/index.test.tsx` | 3 (líneas de `#158`-previos: R8, #62 R10, #64 R8) |
| B29 | `grep -cE "ByText\('20[0-9]{2}-" src/screens/docs/index.test.tsx` | 1 (`'2026-07-12'` en R8) |

(B2 y B17 de borradores previos pasan a §Dependencias de #173.)

Recuento de `it` por fichero tocado: H0 lo vuelve a medir con el mismo
`grep -cE "^\s*it(\.each\(|\()"`. A la base, `src/screens/docs/index.test.tsx`
tiene 40. Los demás ficheros (global-css, consistency-classnames,
design-drift, ui-language, language-provider) se miden en H0, y `tasks.md`
da solo el delta.

## Dependencias de #173 (H0, sobre `main` con #173 mergeada)

Comandos desde `mobile-pet-tracker/`, salvo D6 a D8, que van desde la raíz. Si alguno no da el valor
esperado, **H0 para** y el leader enmienda esta spec antes de seguir.

| Id | Comando | Esperado | Lo usa |
|---|---|---|---|
| D1 | `grep -cF -- "--font-extrabold: 'Inter-ExtraBold';" src/theme/global.css` | 1 | R5, R6, R7, R8 (peso 800) |
| D2 | `grep -cF -- '--text-13: 13px;' src/theme/global.css` | 1 | R8 (chips) |
| D3 | `grep -cF -- '--text-26: 26px;' src/theme/global.css` | 1 | R5 (título) |
| D4 | `grep -cF -- '--radius-tile: 18px;' src/theme/global.css` | 1 | R1 (punto de inserción de `--radius-24`) |
| D5 | `grep -cF "surface: 'rounded-card border border-border bg-surface p-4 shadow-sm'," src/components/card.tsx` | 1 | R6 (clases del `Card` de la fila) |
| D6 | `grep -cF '**Excepción nombrada (fidelidad al canvas, 2026-10-13)**' docs/conventions.md` | 1 | R4 (margen 20) |
| D7 | `grep -cF '**Excepción nombrada (fidelidad al canvas, 2026-10-13)**' docs/ui-guidelines.md` | 1 | R4 (margen 20) |
| D8 | `grep -cF 'Tamaños de letra fuera de la escala de Tailwind' docs/ui-guidelines.md` | 1 | R2 (lista que se extiende) |

**#175 no lleva los textos de la excepción de margen 20**: los trae #173
(R14.5). Si D6 o D7 dan 0, el leader enmienda.

---

## Requisitos

### R1 — Tokens del artboard en `@theme`

**WHEN** se compila el tema, **THE SYSTEM SHALL** declarar en el bloque
`@theme {` de `src/theme/global.css`, una sola vez cada uno, estos cinco
tokens nuevos:

| Token | Valor | Dónde va | Uso en Documentos (artboard) |
|---|---|---|---|
| `--text-11` | `11px` | tras la última línea `--text-<n>: <n>px;` del bloque (con #173: tras `--text-26: 26px;`) | eyebrow «Documentos de» y badge de tipo (11/800) |
| `--text-15` | `15px` | justo después de `--text-11: 11px;` | nombre del documento y título de la zona de subida (15/800) |
| `--radius-24` | `24px` | justo después de `--radius-tile: 18px;` (D4) | zona de subida |
| `--tracking-title` | `-0.02em` | justo después de `--radius-24: 24px;` | título (`letter-spacing: -0.02em`) |
| `--tracking-eyebrow` | `0.08em` | justo después de `--tracking-title: -0.02em;` | eyebrow (`letter-spacing: .08em`) |

Sin `--text-11--line-height` ni `--text-15--line-height`: el artboard no fija
altura de línea.

**Reutiliza** sin redeclarar: `--text-13` y `--text-26` (D2, D3),
`--font-extrabold` para el peso 800 (D1), `font-black` para el 900,
`text-xs` para 12 px, y `rounded-xl` (12), `rounded-card` (20) y
`rounded-full`.

Si en H0 un token de la tabla ya existe con el mismo valor (porque #174 o
#178 mergeó antes), se reutiliza y no se duplica. Si existe con otro valor, H0
para (P10).

**Test** (`src/theme/__tests__/global-css.test.ts`,
`describe('#175 R1: tokens de Documentos')`):

- `parseVariables(extractTheme())` hace `toMatchObject` con
  `{ 'text-11': '11px', 'text-15': '15px', 'text-13': '13px', 'text-26': '26px', 'radius-24': '24px', 'tracking-title': '-0.02em', 'tracking-eyebrow': '0.08em' }`;
- cada una de las cinco declaraciones nuevas aparece una sola vez en el
  bloque: `match(/--text-11:/g)` tiene longitud 1, y lo mismo para las otras
  cuatro.

### R2 — Enmienda de la carta: fidelidad al canvas

**WHEN** se lee `docs/ui-guidelines.md`, **THE SYSTEM SHALL** contener:

1. **Sección nueva**: al final del fichero, una sola vez, la sección literal
   de §Texto de la enmienda R2 (detrás de la última `## Enmienda` que exista
   al arrancar; con #173, `## Enmienda #173 — Perfil fiel al canvas`). No
   nombra pantallas: rige para toda spec que lleve una pantalla al canvas.
2. **Micro-regla de títulos**: la línea
   `- Títulos de pantalla: header del stack cuando exista, no Text suelto.` (B19)
   se sustituye por
   `` - Títulos de pantalla: título en contenido y cabecera nativa con `title: ''` (Enmienda de fidelidad al canvas). ``.
3. **Frase de la paleta**: la frase
   `la superficie siempre acompaña a un emoji y a un texto.` (B18)
   se sustituye por
   `la superficie siempre acompaña a un icono de reicon-react-native y a un texto.`.
4. **Regla 2, tamaños** (la lista que crea #173 R14.2, D8): en la línea que
   empieza por `Tamaños de letra fuera de la escala de Tailwind`, se añaden
   `` `--text-11: 11px` `` y `` `--text-15: 15px` `` al final de la lista de
   tokens (antes del `;` que la cierra), separados por `, `, sin duplicar los
   que ya estén. No se crea otra línea.
5. **Regla 2, tracking**: inmediatamente después de esa línea, una línea
   propia con el texto
   «Tracking fuera de la escala de Tailwind (fidelidad al canvas, #175): `--tracking-title: -0.02em`, `--tracking-eyebrow: 0.08em`; la clase `tracking-*` va con una clase `text-*` en el mismo elemento, porque uniwind multiplica el `em` por su tamaño.».
   Si ya existe una línea que empieza por
   «Tracking fuera de la escala de Tailwind», se añaden a su lista los que
   falten, en vez de crear otra.
6. **§12, radio fuera de escala**: como última línea de la regla
   `12. **Escala de radios**`, antes de `13. **Botón con cuerpo**`, la frase
   «Fuera de la escala, por fidelidad al canvas (#175): `rounded-24` (24 px), zona de subida de Documentos.».
   Es un cambio solo aditivo: las frases que aseveran los `it` de
   `#62 R4` y `#166 R4` en `consistency-classnames` se conservan literales.

**Test** (`src/__tests__/design-drift.test.ts`,
`describe('#175 R2: enmienda de fidelidad al canvas')`; lee
`../docs/ui-guidelines.md` con `readFileSync` desde `process.cwd()`):

1. el encabezado `## Enmienda de fidelidad al canvas (2026-10-13)` aparece
   exactamente una vez;
2. el texto que sigue al encabezado casa
   `/- \[[ xX]\] Enmienda de fidelidad al canvas aprobada por humano/`. La
   casilla es tolerante: firmarla no pone el test en rojo;
3. el texto contiene las tres viñetas literales de §Texto de la enmienda R2,
   un `toContain` por viñeta completa;
4. no contiene ninguna de las dos frases sustituidas (B18, B19), y contiene
   cada frase nueva una sola vez;
5. la línea que empieza por `Tamaños de letra fuera de la escala de Tailwind`
   contiene `` `--text-11: 11px` `` y `` `--text-15: 15px` ``;
6. la línea que empieza por `Tracking fuera de la escala de Tailwind`
   contiene `` `--tracking-title: -0.02em` `` y
   `` `--tracking-eyebrow: 0.08em` ``;
7. el tramo entre `12. **Escala de radios**` y `13. **Botón con cuerpo**`
   (por `indexOf`) contiene `` `rounded-24` (24 px) ``.

Las líneas se buscan con `split('\n').find(l => l.trimStart().startsWith(…))`.

Si en H0 `main` ya trae la sección (B26 = 1, porque #174 o #178 mergeó
antes), el punto 1 no se edita. El test se escribe igual contra el texto que
ya está. Si ese texto difiere del de esta spec, el leader enmienda la spec
antes de seguir.

### R3 — Copy nuevo de Documentos

**WHEN** se carga el catálogo, **THE SYSTEM SHALL** declarar en `en` y `es`
de `src/i18n/catalog.ts` exactamente estas siete claves con estos valores.
Cada valor por defecto es el literal del canvas, y cada uno es una pregunta
abierta (P1 a P7):

| Clave | `en` | `es` | P |
|---|---|---|---|
| `docs.filterAll` | `All` | `Todos` | P1 |
| `docs.categoryVaccination` | `Vaccination` | `Vacunación` | P2 |
| `docs.categoryCheckup` | `Checkup` | `Consulta` | P3 |
| `docs.categoryDeworming` | `Deworming` | `Desparasitación` | P4 |
| `docs.categoryAnalysis` | `Analysis` | `Análisis` | P5 |
| `docs.categoryOther` | `Other` | `Otros` | P6 |
| `docs.uploadHint` | `PDF or photo of prescriptions, lab results, and vaccine cards` | `PDF o foto de recetas, análisis y cartillas` | P7 |

**AND** registrarlas en `specs/mobile-ui-language/design.md`:

- en una sección nueva `### §2.<N> — Añadidos por #175 — Documentos del canvas`,
  donde N es la última §2.x que mida H0 más uno (a la base, 27);
- una fila por clave, con el formato
  `| — | \`<clave>\` | \`<en>\` | \`<es>\` | ← añadida por #175 (R3) |`.

**AND** sumar `+ 7, // #175 R3` a la fórmula de `englishKeys` de
`src/providers/__tests__/language-provider.test.tsx`, en una línea nueva
justo después de `+ 7, // #170 R1`.

**Test** (`src/providers/__tests__/language-provider.test.tsx`,
`describe('#175 R3: claves de Documentos del canvas')`, calcado de
`#170 R1`):

- los siete triples `[clave, en, es]` escritos literales;
- por cada triple, `english[key]` y `spanish[key]` con `toBe`;
- el registro casa
  `new RegExp('\\| — \\| \`' + escapeRegExp(key) + '\`[^\\n]*← añadida por #175 \\(R3\\)')`.

### R4 — Marco de la pantalla y esqueleto de la lista

**WHILE** la pantalla Documentos está montada, **THE SYSTEM SHALL** dar al
`ScrollView` `screen-docs` exactamente:

```ts
contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 24, gap: 14, paddingBottom: insets.bottom + 24 }}
```

- El artboard pinta `padding: 56px 20px 32px` con la cabecera nativa encima,
  y `gap: 14px`.
- La excepción de margen 20 (D6, D7) cambia el lateral y el gap. El resto de
  la regla 6 se mantiene.
- La suma de teclado de `#158 R11` sigue sumándose sobre `paddingBottom`.

**AND WHILE** la lista carga, **THE SYSTEM SHALL** pintar
`docs-list-skeleton` así (regla 7):

- es un `View` con `className="gap-3.5"`;
- tiene exactamente 3 hijos `Skeleton`, cada uno con
  `className="h-20 w-full rounded-card"`;
- `h-20` es el alto de la fila: 12 + 56 + 12 = 80.

**Test** (`src/screens/docs/index.test.tsx`):

- el `it` `'usa solo el inset inferior del dispositivo'` (`#95 R6`) pasa a
  `{ paddingHorizontal: 20, paddingTop: 24, gap: 14, paddingBottom: 48 }`.
  El inset inferior del mock es 24;
- `describe('#175 R4: esqueleto del tamaño de la fila')` asevera sobre
  `docs-list-skeleton`:
  - `props.className` es `'gap-3.5'`;
  - `children.length` es 3;
  - las clases de cada hijo incluyen `h-20`, `w-full` y `rounded-card`, y no
    incluyen `h-24`;
  - se compara por `className.split(/\s+/)`, porque el `Skeleton` de HeroUI
    antepone `skeleton__root`.

### R5 — Cabecera en contenido

**WHEN** la mascota ha cargado, **THE SYSTEM SHALL** pintar como primer hijo
del contenido un `View` **sin `className`**: una columna sin gap, como el
artboard. Tiene exactamente 2 hijos `Text`:

1. eyebrow: `t('docs.documentsOf')`, con
   `className="text-11 font-extrabold uppercase tracking-eyebrow text-muted"`;
2. título: `{petName ?? t('docs.pet')}`, con
   `className="text-26 font-black tracking-title text-foreground"`
   (P8: 26 frente a 24).

**WHILE** la mascota carga, el segundo hijo sigue siendo
`docs-header-skeleton`, con `h-8 w-36 rounded-xl` y sin cambios. La ruta
mantiene `options={{ ...headerOptions, title: '' }}` (B20 = 1).

**Test** (`describe('#175 R5: cabecera del artboard')`):

- sobre `screen-docs` `.children[0].children[0]`: `props.className` es
  `undefined` y `children.length` es 2;
- las dos `className` con `toBe` exacto;
- los textos `'Documentos de'` y `'Luna'`;
- un `it` lee `src/app/_layout.tsx` y comprueba que el literal de B20
  aparece una sola vez.

### R6 — Fila de documento

**WHEN** la lista llega con documentos, **THE SYSTEM SHALL** pintar cada
documento, en el orden del backend, como un `HomeEntrance`
(`src/screens/home/home-entrance.tsx`):

- con `index` igual a su posición en la lista visible;
- con `` testID={`docs-entry-${document.id}`} ``;
- con un único hijo: el `Card` `` `doc-${document.id}` ``, pulsable, que abre
  el documento como hoy.

**El `Card`**:

- su `className` incluye `flex-row`, `items-center`, `gap-3`, `px-3.5`,
  `py-3` y `shadow-none`, y no incluye `shadow-sm`. Es lo que pinta el
  artboard: padding 12×14, gap 12 y sin sombra. El borde de 1 px, el radio
  20 y `bg-surface` los pone la variante `surface` (D5);
- `twMerge` deja `p-4` de la variante, y en RN `paddingHorizontal` y
  `paddingVertical` mandan sobre `padding`;
- tiene exactamente 3 hijos, en este orden:
  1. **mosaico**: un `View`
     - con `` testID={`docs-mosaic-${document.id}`} ``,
       `` className={`h-14 w-12 items-center justify-center rounded-xl ${slot.surface}`} ``
       y `style={CONTINUOUS_CORNER}`;
     - con un único hijo: `FileText` de `reicon-react-native`, con
       `size={24}` y `color` igual al token de tinta del hueco
       (§Tinta por hueco).
  2. **columna**: un `View` con `className="min-w-0 flex-1 gap-0.75"` y
     exactamente 3 hijos `Text`:
     - badge: `{document.type}` crudo (D-C11b), con
       `` className={`self-start rounded-full px-2 py-0.5 text-11 font-extrabold ${slot.surface} ${slot.ink}`} ``;
     - nombre: con `className="text-15 font-extrabold text-foreground"` y
       `numberOfLines={1}`;
     - fecha: con `className="text-xs font-normal text-muted"` y el texto
       `fmtDate(document.date, useLocale())`. `fmtDate` está en
       `src/screens/home/format.ts` y `useLocale` en
       `src/providers/language-provider.tsx`.
  3. **chevron**: `ChevronRight` de `reicon-react-native`, con `size={18}` y
     `color` igual a `muted`.

`slot` es `CATEGORY_SLOTS[documentCategory(document.type)]`, sin cambios en
`src/utils/category-palette.ts`. Ningún emoji queda en el fichero (B4 → 0).

§Tinta por hueco: es el argumento que se pasa a `useThemeColors`, en el mismo
orden que el `ink` de `CATEGORY_SLOTS`:

| Hueco | Token |
|---|---|
| `blue` | `category-blue-strong` |
| `green` | `category-green-strong` |
| `amber` | `category-amber-strong` |
| `violet` | `category-violet-strong` |
| `rose` | `category-rose-strong` (inalcanzable: ningún tipo de documento cae en rose) |
| `neutral` | `muted` |

**Test** (`describe('#175 R6: fila del artboard')`), con los dobles de
`HomeEntrance`, `reicon-react-native` y `useThemeColors` que describe
design.md:

- un `it.each` por hueco alcanzable, con su fixture: `blue` Vacunación,
  `green` Consulta, `amber` Desparasitación, `violet` Análisis y `neutral`
  Radiografía. Cada caso comprueba:
  - mosaico: `className` con `toBe` exacto; `style` con las claves de
    `CONTINUOUS_CORNER` escritas literales; un único hijo,
    `docs-icon-file-text`, con `size` 24 y `style.color` igual al token
    literal;
  - columna: `className` con `toBe`; 3 hijos; el badge con `toBe` exacto,
    con las clases del hueco escritas literales;
  - chevron: `docs-icon-chevron-right`, con `size` 18 y `style.color` igual
    a `'muted'`;
  - el `Card` tiene `children.length === 3`;
- nombre: `props.numberOfLines === 1` y `className` con `toBe`;
- fechas que cruzan mes y año:
  - en `es`: `2026-01-10` → `'10 ene 2026'` y `2025-12-02` → `'2 dic 2025'`;
  - en `en` (con `renderDocs('en')`): `2026-01-10` → `'Jan 10, 2026'` y
    `2025-12-02` → `'Dec 2, 2025'`;
  - ninguna cadena ISO queda visible: `queryByText('2026-01-10')` es `null`;
- entrada: el doble de `HomeEntrance` recibe `index` 0, 1 y 2 y `testID`
  `docs-entry-<id>`, en el orden del backend; cada entrada tiene un único
  hijo, `doc-<id>`;
- `getAllByTestId(/^doc-/)` sigue devolviendo exactamente las filas.

### R7 — Zona de subida al final y orden de bloques

**WHILE** el usuario es owner, no hay documento seleccionado y la lista llegó
con al menos un documento (la condición del botón actual), **THE SYSTEM
SHALL** pintar `docs-upload` como un `Pressable` (no un `Button`) con:

- `accessibilityRole="button"` y `onPress={pickDocument}`;
- `className="mt-1.5 items-center gap-1.5 rounded-24 border-2 border-dashed border-lip-gray p-4.5"`;
- `style={({ pressed }) => ({ ...CONTINUOUS_CORNER, opacity: pressed ? 0.8 : 1 })}`.

Tiene exactamente 3 hijos:

1. círculo: un `View` con
   `className="size-12 items-center justify-center rounded-full bg-surface-secondary"`,
   cuyo único hijo es `Upload` de `reicon-react-native`, con `size={22}` y
   `color` igual a `accent-strong`;
2. título: un `Text` con `className="text-15 font-extrabold text-foreground"`
   y `t('docs.upload')`;
3. pista: un `Text` con
   `className="text-center text-xs font-normal text-muted"` y
   `t('docs.uploadHint')`.

**AND THE SYSTEM SHALL** ordenar los hijos del contenido así:

1. la cabecera;
2. `docs-list-skeleton`, `docs-error`, `docs-empty` o (`docs-filters` +
   entradas);
3. el bloque de subida: `docs-upload` o `docs-upload-form`;
4. al final, `docs-action-error`.

La zona queda en el sitio que le da el artboard, bajo la lista, y el
formulario aparece donde se tocó la zona.

**AND** añadir a `src/__tests__/ui-copy-table.ts` (R7_PROFILE) la fila
`{ file: 'src/screens/docs/index.tsx', key: 'docs.uploadHint' }`, y sumar
`+ 1 // #175 R7` a `expect(R7_PROFILE).toHaveLength(…)`. El título del `it`
«resuelve las N ocurrencias normativas» lleva N igual al valor evaluado.

**Test** (`describe('#175 R7: zona de subida del artboard')`):

- el host tiene `accessibilityRole` `button`, y su `className` con `toBe`
  exacto;
- 3 hijos, cada uno con su `className` con `toBe`;
- el icono `docs-icon-upload` tiene `size` 22 y `style.color` igual a
  `'accent-strong'`;
- los textos `'Subir documento'` y
  `'PDF o foto de recetas, análisis y cartillas'`, cada uno con
  `within(zone).getByText`;
- en reposo, `toHaveStyle({ opacity: 1 })`. Tras
  `await fireEvent(zone, 'responderGrant', { nativeEvent: {}, persist: () => undefined })`,
  `toHaveStyle({ opacity: 0.8 })`;
- pulsar la zona abre el selector: el `it.each` heredado
  `'abre el selector desde %s'` sigue verde sin cambios.

Los órdenes heredados se reescriben como dice §Deltas de candados.

### R8 — Chips de filtro: composición

**WHEN** la lista llega con al menos un documento (también con el formulario
abierto), **THE SYSTEM SHALL** pintar, justo antes de la primera entrada, un
`View testID="docs-filters" className="flex-row flex-wrap gap-1.5"` con:

- primero, un chip «Todos» (`docs-filter-all`, con `t('docs.filterAll')`);
- después, un chip por cada categoría **presente** en la lista, en el orden
  fijo `blue` → `green` → `amber` → `violet` → `neutral`, con testID
  `docs-filter-<hueco>` y etiqueta `t(labelKey)`:

  | Hueco | testID | `labelKey` |
  |---|---|---|
  | `blue` | `docs-filter-blue` | `docs.categoryVaccination` |
  | `green` | `docs-filter-green` | `docs.categoryCheckup` |
  | `amber` | `docs-filter-amber` | `docs.categoryDeworming` |
  | `violet` | `docs-filter-violet` | `docs.categoryAnalysis` |
  | `neutral` | `docs-filter-neutral` | `docs.categoryOther` |

Cada chip es un `Pressable` con:

- `accessibilityRole="button"` y `accessibilityState={{ selected }}`;
- `hitSlop={TOUCH_SLOP}` (`src/theme/touch-target.ts`): 34 + 6 + 6 = 46,
  que es al menos 44;
- `style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}`;
- `` className={`h-8.5 items-center justify-center rounded-full px-3 ${fondo}`} ``;
- un único hijo `Text`, con `` className={`text-13 font-extrabold ${tinta}`} ``.

| Estado | `fondo` | `tinta` |
|---|---|---|
| seleccionado (cualquier chip, D-C11c) | `bg-foreground` | `text-background` |
| «Todos» sin seleccionar (P9) | `bg-default` | `text-foreground` |
| categoría sin seleccionar | `slot.surface` | `slot.ink` |

Con la lista vacía, en error o mientras carga, `docs-filters` no existe.

**AND** añadir a `src/__tests__/ui-copy-table.ts` (R7_PROFILE) seis filas, y
sumar `+ 6 // #175 R8` al `toHaveLength` de R7_PROFILE (el título lleva el
nuevo total). Las filas son de `docs.filterAll`,
`docs.categoryVaccination`, `docs.categoryCheckup`,
`docs.categoryDeworming`, `docs.categoryAnalysis` y `docs.categoryOther`.
Las cinco etiquetas de categoría se declaran como `labelKey: '<clave>'` en un
array constante del fichero: `checkUses` cuenta las llamadas directas
`t('<clave>')` y también los `labelKey:`.

**Test** (`describe('#175 R8: chips de filtro')`):

- con una lista que trae las cinco categorías desordenadas desde el
  backend:
  - los hijos de `docs-filters` son exactamente
    `['docs-filter-all', 'docs-filter-blue', 'docs-filter-green', 'docs-filter-amber', 'docs-filter-violet', 'docs-filter-neutral']`;
  - sus textos son `'Todos'`, `'Vacunación'`, `'Consulta'`,
    `'Desparasitación'`, `'Análisis'` y `'Otros'`;
- con la lista del artboard, sin ámbar (Vacunación, Consulta y Análisis), los
  hijos son
  `['docs-filter-all', 'docs-filter-blue', 'docs-filter-green', 'docs-filter-violet']`;
- por cada uno de los seis chips:
  - `className` del chip y de su texto con `toBe` exacto en reposo (Todos
    seleccionado; las categorías con su pastel escrito literal);
  - `children.length === 1`;
  - `accessibilityState` `{ selected }`;
  - `hitSlop` `{ top: 6, bottom: 6, left: 6, right: 6 }`, escrito literal;
  - `opacity` 1 en reposo y 0.8 tras `responderGrant`;
- posición: `docs-filters` es el hijo inmediatamente anterior a la primera
  entrada en `docsChildren()` (ver §Deltas);
- ausencia: `queryByTestId('docs-filters')` es `null` con la lista vacía, con
  `docs-error` y mientras carga.

### R9 — Chips de filtro: comportamiento

**WHEN** el usuario pulsa un chip de categoría, **THE SYSTEM SHALL**:

- mostrar solo las entradas cuyo `documentCategory(document.type)` es ese
  hueco, conservando el orden del backend;
- renumerar el `index` de `HomeEntrance` desde 0;
- pintar ese chip seleccionado y «Todos» sin seleccionar.

**WHEN** el usuario pulsa «Todos», **THE SYSTEM SHALL** mostrar todas las
entradas.

**WHEN** una subida termina bien (el `refetch` tras crear y confirmar),
**THE SYSTEM SHALL** volver a «Todos» (P11).

El filtro vive en un `useState<'all' | CategorySlot>('all')` local de la
pantalla.

**Test** (`describe('#175 R9: filtrar por categoría')`): una rama por
categoría y por cláusula, con fixtures que distinguen las alternativas.

- un `it.each` de los cinco huecos, sobre una lista con un documento de cada
  hueco más otro del mismo hueco. Tras pulsar el chip:
  - solo quedan las dos entradas de ese hueco, en el orden del backend, con
    `index` 0 y 1;
  - los `accessibilityState` de los seis chips cuadran: solo el pulsado
    tiene `selected: true`;
- sinónimos y variantes de escritura, cada uno visible al filtrar por su
  chip:
  - `'vacuna'`, `'Vaccination'`, `'  VACUNACIÓN  '` y `'vacunacion'` caen en
    `blue`;
  - `'checkup'` cae en `green`;
  - `'Deworming'` cae en `amber`;
  - `'lab'` cae en `violet`;
- tipo desconocido: `'Radiografía'` y `'Receta'` caen en «Otros» y en ningún
  otro chip;
- volver a «Todos» restaura todas las entradas en el orden del backend;
- reinicio: con «Análisis» seleccionado, una subida correcta (con los
  fixtures del flujo de `#158 R7`) deja `docs-filter-all` con
  `selected: true` y todas las entradas visibles.

La lista filtrada no puede quedar vacía: solo hay chips de categorías
presentes, y la subida reinicia el filtro (ver Fuera de alcance [D3]).

### R10 — Candados de deriva e imports de Documentos

**THE SYSTEM SHALL** mantener `src/screens/docs/index.tsx`:

- sin emoji: `/\p{Extended_Pictographic}/u` no tiene coincidencias;
- sin `expo-linear-gradient`, `expo-symbols`, `lottie-react-native`,
  `@rive-app` ni `useThemeColor` en singular;
- sin hex, sin clases con corchetes, sin `StyleSheet.create` y sin
  `shadowColor` ni `elevation`;
- con radios solo de `rounded-(card|xl|full|24)`;
- sin `text-accent` suelto;
- importando de `reicon-react-native` exactamente
  `{ ChevronRight, FileText, Upload }`, en un único `import` de ese módulo.

**Test** (`src/__tests__/design-drift.test.ts`,
`describe('#175 R10: Documentos sin deriva')`, calcado de `#167 R14` con
`featureFiles = ['screens/docs/index.tsx']`):

- un `it` por guarda;
- el de iconos extrae el `import { … } from 'reicon-react-native'` y compara
  la lista ordenada con `['ChevronRight', 'FileText', 'Upload']`;
- ese mismo `it` comprueba que el `from` aparece una sola vez.

### R11 — Prueba de humo humana (dev build de Android)

**WHEN** el humano abre Documentos en el **dev build de Android** (no Expo
Go), con una mascota propia que tenga documentos de al menos tres
categorías, **THE SYSTEM SHALL** verse como el artboard, en claro y en
oscuro:

- margen 20 y gap 14;
- eyebrow 11/800 con tracking;
- título 26/900 con tracking negativo;
- chips de 34 px con su pastel y «Todos» invertido;
- filas con mosaico de 48×56 e icono de documento, nombre en una línea con
  elipsis, fecha como «3 mar 2026» y chevron;
- zona de subida con borde discontinuo y radio 24, al final.

Además:

- filtrar por un chip deja solo sus filas;
- tocar la zona abre el selector, y el formulario aparece bajo la lista;
- con «Reducir movimiento» del sistema, las filas entran sin desplazamiento.

Se firma en su casilla propia: `traceability.md` §Prueba de humo R11.

`border-dashed` es la única clase nueva que el spike de #173 no compiló. Si el
humo la pinta continua, el leader enmienda R7 antes de cerrar.

---

## Texto de la enmienda R2

Se añade literal al final de `docs/ui-guidelines.md`, con una línea en blanco
antes del encabezado:

```markdown
## Enmienda de fidelidad al canvas (2026-10-13)

Directiva del humano del 2026-10-13: «el diseño final debe de quedar como el artifact» (canvas aprobado, https://claude.ai/artifact/VqaQQsRTtis9Dbttqy3z7j). Rige para toda pantalla que una spec lleve al canvas; la spec de cada pantalla nombra sus valores y los candados que revierte.

- **Título en contenido (D-H).** El título de pantalla va dentro del contenido (eyebrow opcional y título); la cabecera nativa del stack queda con `title: ''` y solo aporta el botón de volver.
- **Iconos reicon (D-I).** Los iconos de la interfaz son componentes de `reicon-react-native` coloreados con un token vía `useThemeColors`; ningún emoji hace de icono. La superficie de categoría acompaña a un icono y a un texto.
- **Medidas del artboard.** Donde la escala no llega al valor del artboard se usa un token del `@theme` nombrado por su valor y listado en la regla 2 (tamaños y tracking) o en la regla 12 (radios); las clases con corchetes (regla 3) y los radios `2xl`, `lg`, `md` y `sm` (regla 12) siguen prohibidos, y las esquinas que no son cápsula siguen llevando `CONTINUOUS_CORNER`.

- [ ] Enmienda de fidelidad al canvas aprobada por humano (fecha: ____)
```

---

## Deltas de candados (valor viejo → nuevo)

Todo candado heredado que esta spec cambia, con su `it`. «Base H0» es el valor
que mide H0 sobre `main` con #173 mergeada.

### `src/screens/docs/index.test.tsx`

| Δ | `describe` / `it` | Antes | Después | Por |
|---|---|---|---|---|
| Δ1 | `R8` / `'shows the pet name and ordered type, name, and date rows'` | `screen.getByText('Vacunación')` y `screen.getByText('2026-07-12')` | `within(screen.getByTestId('doc-doc-1')).getByText('Vacunación')` y `screen.getByText('12 jul 2026')` | R6, R8 |
| Δ2 | `#62 R10` / `'aplica la receta monocroma al tipo sin cambiar su texto'` | `(await screen.findByText('Vacunación')).props.className` con `toBe('self-start rounded-full px-2 py-0.5 text-2xs font-bold bg-category-blue text-category-blue-strong')` | `within(await screen.findByTestId('doc-doc-1')).getByText('Vacunación').props.className` con `toBe('self-start rounded-full px-2 py-0.5 text-11 font-extrabold bg-category-blue text-category-blue-strong')` | R6, R8 |
| Δ3 | `#64 R8` / `'aplica el hueco conocido y conserva neutral para texto libre'` | mosaico por `getByText('📄').parent`; `getByText('📄')` visible; badges con `text-2xs font-bold` (2 `toBe`) | mosaico por `getByTestId('docs-mosaic-<id>')`; `within(row).getByTestId('docs-icon-file-text')` visible; badges con `text-11 font-extrabold` | R6 |
| Δ4 | `#95 R6` / `'usa solo el inset inferior del dispositivo'` | `{ padding: 24, gap: 16, paddingBottom: 48 }` | `{ paddingHorizontal: 20, paddingTop: 24, gap: 14, paddingBottom: 48 }` | R4 |
| Δ5 | `#158 R3` / `'con documentos pinta el botón, sus clases y el orden exacto'` | orden `['View', 'docs-upload', 'doc-doc-1']`; `toHaveTextContent('Subir documento')`; `rounded-xl` y `bg-accent` contenidos; etiqueta `font-bold` y `text-accent-foreground` | orden `['View', 'docs-filters', 'docs-entry-doc-1', 'docs-upload']`; `within(zone).getByText('Subir documento')`; `className` sin `bg-accent` (las clases exactas las asevera R7); etiqueta con `toBe('text-15 font-extrabold text-foreground')` | R7 |
| Δ6 | `#158 R5` / `'ordena el error del selector con lista %j'` | `[docOne]`: `['View', 'docs-upload', 'docs-action-error', 'doc-doc-1']` · `[]`: `['View', 'docs-action-error', 'docs-empty']` | `[docOne]`: `['View', 'docs-filters', 'docs-entry-doc-1', 'docs-upload', 'docs-action-error']` · `[]`: `['View', 'docs-empty', 'docs-action-error']` | R7 |
| Δ7 | `#158 R5` / `'sitúa el formulario y oculta las entradas con lista %j'` | `[docOne]`: `['View', 'docs-upload-form', 'doc-doc-1']` · `[]`: `['View', 'docs-upload-form', 'docs-empty']` | `[docOne]`: `['View', 'docs-filters', 'docs-entry-doc-1', 'docs-upload-form']` · `[]`: `['View', 'docs-empty', 'docs-upload-form']` | R7, R8 |
| Δ8 | `#158 R6` / `'ordena y limpia el error con lista %j'` | `[docOne]`: `['View', 'docs-upload-form', 'docs-action-error', 'doc-doc-1']` · `[]`: `['View', 'docs-upload-form', 'docs-action-error', 'docs-empty']` | `[docOne]`: `['View', 'docs-filters', 'docs-entry-doc-1', 'docs-upload-form', 'docs-action-error']` · `[]`: `['View', 'docs-empty', 'docs-upload-form', 'docs-action-error']` | R7 |
| Δ9 | `#158 R10` / `'mantiene la lista y sitúa el error del navegador para %s'` | owner: `['View', 'docs-upload', 'docs-action-error', 'doc-doc-1']` · resto: `['View', 'docs-action-error', 'doc-doc-1']` | owner: `['View', 'docs-filters', 'docs-entry-doc-1', 'docs-upload', 'docs-action-error']` · resto: `['View', 'docs-filters', 'docs-entry-doc-1', 'docs-action-error']` | R7, R8 |
| Δ10 | `renderDocs()` (helper) | sin parámetro, `<LanguageProvider initial="es">` | `renderDocs(language: 'es' \| 'en' = 'es')` → `initial={language}` | R6 |

Sin cambios, verificado a la base: el `['View', 'docs-empty']` de
`#155 R7`, `'uses content-sized skeletons while pet and docs load'` (solo
visibilidad), el `toHaveTextContent('Subir documento')` de `docs-empty-action`
y de `docs-upload-submit`, `'retira el botón y conserva Documentos de'`
(`#95 R5`) y `'añade paddingBottom 291 …'` (`#158 R11`).

Ancla de cierre:

- `grep -cE "screen\.(get|find)ByText\('(Vacunación|Consulta|Desparasitación|Análisis|Otros|Todos)'" src/screens/docs/index.test.tsx`
  da 0;
- `grep -cE "ByText\('20[0-9]{2}-" src/screens/docs/index.test.tsx` da 0
  (B29: 1 → 0);
- `grep -cF '📄' src/screens/docs/index.test.tsx` da 0.

### `src/__tests__/consistency-classnames.test.ts`

| Δ | `it` | Antes (base H0) | Después | Por |
|---|---|---|---|---|
| Δ11 | primarios `rounded-xl bg-accent` (2 sitios: `toHaveLength(…)` y `count(…)).toBe(…)`, B21) | expresión base H0 | misma expresión + ` - 1`, y el comentario suma `; #175 R7: docs-upload pasa a zona de subida` | R7 |
| Δ12 | `'inventaría los <N> primarios con labio, fichero a fichero'` (#166 R2) | `[join('screens', 'docs', 'index.tsx')]: 2,`; título N (base H0); `border-b-4\b/g)).toBe(N)` y `border-black\/25/g)).toBe(N)` | `…: 1, // #175 R7`; título N − 1 en palabra; los dos `toBe(N - 1)` con el número evaluado | R7 |
| Δ13 | `'inventaría los cuatro secundarios neutros de toda la app'` (#170 R16) | `count(/border-lip-gray/g)).toBe(4 + 1)` | `toBe(4 + 1 + 1); // #170 R16; #175 R7: borde de la zona de subida`. La lista de testIDs y `border-b-6` no cambian (la zona no es `<Button` ni lleva labio) | R7 |

Sin cambios: el recuento `style={CONTINUOUS_CORNER}` de docs (B22 = 1, el
mosaico). La zona extiende `...CONTINUOUS_CORNER` dentro de una función de
estilo, que el regex `/style=\{CONTINUOUS_CORNER\}/g` no cuenta. Tampoco el
total global `count(/style=\{CONTINUOUS_CORNER\}/g)`.

Anclas de cierre:

- `grep -cF '#175 R7: docs-upload pasa a zona de subida' src/__tests__/consistency-classnames.test.ts` da 2;
- `grep -cF "[join('screens', 'docs', 'index.tsx')]: 1," src/__tests__/consistency-classnames.test.ts` da 1;
- `grep -cF 'border-lip-gray/g)).toBe(4 + 1 + 1);' src/__tests__/consistency-classnames.test.ts` da 1;
- `grep -cF 'rounded-xl bg-accent border-b-4 border-black/25' src/screens/docs/index.tsx` da 1 (B7: 2 → 1).

### Copy (`ui-copy-table.ts`, `ui-language.test.ts`, `language-provider.test.tsx`, `catalog.ts`)

| Δ | Sitio | Antes (base H0) | Después | Por |
|---|---|---|---|---|
| Δ14 | filas de docs en `src/__tests__/ui-copy-table.ts` (B11) | 22 | 22 + 7 = 29 | R7, R8 |
| Δ15 | `expect(R7_PROFILE).toHaveLength(…)` y título `'resuelve las N ocurrencias normativas'` (B12) | base H0 (53 a la base) | `… + 1 + 6` con comentarios `#175 R7` y `#175 R8`; título N + 7 (60 a la base) | R7, R8 |
| Δ16 | fórmula de `englishKeys` en `language-provider.test.tsx` (B13) | termina en `+ 7, // #170 R1` (o lo que añada #173) | línea nueva `+ 7, // #175 R3` | R3 |
| Δ17 | `grep -cF "'docs." src/i18n/catalog.ts` (B15) | 34 | 48 | R3 |

### `src/screens/docs/index.tsx` (anclas de cierre)

| Ancla | Antes | Después |
|---|---|---|
| `grep -cF '📄' src/screens/docs/index.tsx` | 1 | 0 |
| `grep -cF "import { ChevronRight, FileText, Upload } from 'reicon-react-native';" src/screens/docs/index.tsx` | 0 | 1 |
| `grep -cF -- 'paddingHorizontal: 20,' src/screens/docs/index.tsx` / `grep -cF -- 'gap: 14,' …` / `grep -cF -- 'padding: 24,' …` / `grep -cF -- 'gap: 16,' …` | 0 / 0 / 1 / 1 | 1 / 1 / 0 / 0 |
| `grep -cF -- 'paddingBottom: insets.bottom + 24,' src/screens/docs/index.tsx` | 1 | 1 |
| `grep -cF 'tracking-widest' src/screens/docs/index.tsx` | 1 | 0 |
| `grep -cF 'text-2xs' src/screens/docs/index.tsx` | 9 | 8 (sale el badge; las etiquetas del formulario se quedan) |
| `grep -cF 'style={CONTINUOUS_CORNER}' src/screens/docs/index.tsx` | 1 | 1 |
| `grep -cF 'testID="docs-filters"' src/screens/docs/index.tsx` | 0 | 1 |

---

## Fuera de alcance

Clasificado por viñeta. [F] marca una posible feature futura; [D] es una
delimitación de esta spec, no trabajo pendiente.

- [D1] **Formulario de subida, vacío con Pingo, error de lista y error de
  acción**: el artboard no los dibuja. Se quedan como están (clases, copy y
  candados `#155`, `#158`), salvo su posición en el orden de R7.
- [D2] **Campo «Tipo» libre** (D-C11a): no pasa a selector. [F] Si se quiere
  un selector de categoría en el formulario, es una feature aparte.
- [D3] **Lista filtrada vacía**: es imposible con esta spec. Solo hay chips
  de categorías presentes, la app no borra documentos (`src/api/media.ts` no
  tiene borrado) y una subida reinicia el filtro (R9). No se añade un estado
  vacío del filtro ni una vuelta automática a «Todos».
- [D4] **Desparasitación en ámbar** (D-C11d): no se toca el violeta de
  recordatorios.
- [D5] **Hueco `rose`**: ningún tipo de documento cae en él. Su tinta queda
  en la tabla por completitud, sin test propio.
- [D6] **Receta de CTA de #177**: si #177 cambia `docs-upload-submit` o
  `docs-upload-cancel`, quien se especifique en segundo lugar hereda el
  cambio. Esta spec no los toca.
- [D7] **Componente de chip compartido**: no se extrae. Los chips viven en
  `src/screens/docs/index.tsx`. Si #178 o #179 necesitan los mismos, se
  extrae entonces.
- [D8] **Bloques «Enmienda» en las specs aprobadas** cuyos candados revierte
  esta spec (`#62 R10`, `#64 R8`, `#95 R6`, `#158 R3`–`R10`, `#166 R2`,
  `#170 R16`): §Deltas de candados es el registro (P12).
- [D9] **Textos de la excepción de margen 20**: los trae #173 (D6, D7).

## Preguntas abiertas

Cada pregunta tiene un valor por defecto. Si el humano firma sin
responderla, rige ese valor.

| P | Pregunta | Por defecto |
|---|---|---|
| P1 | `docs.filterAll` | `All` / `Todos` |
| P2 | `docs.categoryVaccination` | `Vaccination` / `Vacunación` |
| P3 | `docs.categoryCheckup` | `Checkup` / `Consulta` |
| P4 | `docs.categoryDeworming` | `Deworming` / `Desparasitación` |
| P5 | `docs.categoryAnalysis` | `Analysis` / `Análisis` |
| P6 | `docs.categoryOther` | `Other` / `Otros` |
| P7 | `docs.uploadHint` | `PDF or photo of prescriptions, lab results, and vaccine cards` / `PDF o foto de recetas, análisis y cartillas` |
| P8 | Título: la respuesta D-H decía «título de 24px y peso 900»; la de fidelidad pide píxel exacto y el artboard dibuja 26 | 26 (`text-26`). Con 24, R5 usa `text-2xl` y R2 no cambia |
| P9 | Aspecto de «Todos» sin seleccionar: el artboard solo lo dibuja seleccionado | `bg-default` / `text-foreground`, el neutro de la paleta |
| P10 | Nombres de los tokens de tracking, compartidos con #174 | `--tracking-title: -0.02em` y `--tracking-eyebrow: 0.08em`. Si #174 mergea antes con otro nombre para el mismo valor, se reutiliza el suyo y se enmiendan R1, R2 y R5. Si usa el mismo nombre con otro valor, H0 para |
| P11 | ¿Una subida correcta reinicia el filtro a «Todos»? | Sí: el documento nuevo siempre queda a la vista |
| P12 | ¿Bloques «Enmienda» en las specs aprobadas cuyos candados revierte #175 (como hizo #173 R14.1)? | No: §Deltas de candados de esta spec es el registro |

## Aprobación

- [x] Aprobado por humano (fecha: 2026-10-13)

---

## Enmienda E1 — anclas que caducaron al mergear #171, #172 y #173

> Escrita el 2026-10-15 en H0, sobre la spec firmada (`0e2b91cf`), con la
> rama al día con `origin/main` `dea11875` (merge `460263cd`; #173 `done`).
> **No cambia ninguna decisión ni ningún requisito de comportamiento**: corrige
> los literales que la base nueva dejó falsos o ambiguos. Su casilla va **sin
> marcar**: el humano reabre el gate solo para esta enmienda.

### Qué se midió en H0

Las ocho dependencias D1 a D8 dan 1. De la tabla de base, estas son las que ya
no dan su valor de `fb5b209f` (el resto, B1, B4 a B8, B11, B14, B15, B18 a B20,
B22, B24 a B29, coincide):

| Id | A `fb5b209f` | Medido en H0 | Qué lo movió |
|---|---|---|---|
| B3 | 0 | **1**: `--text-15: 15px;` ya está en `@theme` | #172 R1 (`text-13`, `text-15`, `text-17`) |
| B9 | `toBe(19)` | `toBe(19 + 1 + 1 - 1 - 1)`, evalúa a 19 | #171 R3 y R14, #172 R14, #173 R5 |
| B10 | `toBe(4 + 1)` | `toBe(4 + 1 + 1); // #170 R16; #171 R14` | #171 R14 |
| B12 | `35 - 1 + 2 + 1 + 16`, título 53 | `35 - 1 + 2 + 1 + 16 - 4 + 8`, título **57** | #173 R13 |
| B13 | termina en `+ 7, // #170 R1` | termina en `- 4 + 3, // #173 R13` (las líneas de #170 R1 ya no llevan coma) | #172 R16, #173 R13 |
| B16 | `§2.26` | `§2.29` (siguiente: **§2.30**) | #171, #172, #173 |
| B21 | `13 + 1 + 1 + 1 + 1 + 1 + 1` | `13 + 1 + 1 + 1 + 1 + 1 + 1 + 1 - 1 - 1` | #171 R3 y R14, #173 R5 |
| B23 | «diecinueve» | «dieciocho» (18 entradas en `expected`) | #173 R5 |

### E1.1 — R1: cuatro tokens nuevos, no cinco

`--text-15: 15px;` ya existe (B3 = 1, con el mismo valor). R1 ya lo prevé
(«si un token de la tabla ya existe con el mismo valor, se reutiliza y no se
duplica»). Consecuencias, sin tocar el texto de R1:

- T1 declara **cuatro** líneas: `--text-11` (tras `--text-26: 26px;`, que es la
  última `--text-<n>`), `--radius-24`, `--tracking-title` y `--tracking-eyebrow`
  en las posiciones de su tabla. La fila `--text-15` no se edita.
- El `toMatchObject` de R1 se escribe entero (con `text-15` y `text-13`, que ya
  están) y la unicidad de las cinco declaraciones también. El rojo de T1 falla
  por las **cuatro** claves que faltan.
- La carta (R2.4) añade `` `--text-11: 11px` `` y `` `--text-15: 15px` `` a su
  línea de tamaños: esa línea hoy solo lista `--text-13` y `--text-26`.

### E1.2 — R3 y Δ16: dónde va la línea de `englishKeys`

La línea nueva `+ 7, // #175 R3` va **al final** de la fórmula de `englishKeys`
en `language-provider.test.tsx`, después de `- 4 + 3, // #173 R13`. Esa línea
pierde su coma (`- 4 + 3 // #173 R13`) y la coma pasa a la nueva. Sustituye a
«justo después de `+ 7, // #170 R1`», que ya no existe con ese texto.
La sección de `specs/mobile-ui-language/design.md` es **§2.30**.

### E1.3 — Δ12: el título y el número ya no coinciden

En la base de la spec el título «diecinueve» y el `toBe(19)` eran el mismo
número. Hoy no: el título dice **dieciocho** (las 18 entradas de `expected`) y
los dos `toBe` son `19 + 1 + 1 - 1 - 1`, que evalúa a 19 (18 primarios más el
candado de Recuperar). Δ12 se aplica así:

- `[join('screens', 'docs', 'index.tsx')]: 2,` pasa a `…: 1, // #175 R7`;
- el título pasa de «dieciocho» a **«diecisiete»**;
- cada uno de los dos `toBe` conserva su expresión y suma ` - 1` y
  `; #175 R7: docs-upload`, igual que Δ11. Evalúan a 18.

### E1.4 — Δ13 y su ancla de cierre

La base ya es `toBe(4 + 1 + 1); // #170 R16; #171 R14` (B10). Tras R7:
`toBe(4 + 1 + 1 + 1); // #170 R16; #171 R14; #175 R7: borde de la zona de subida`.
La ancla de cierre de §Deltas
(`grep -cF 'border-lip-gray/g)).toBe(4 + 1 + 1);' …` da 1) se lee ahora
`grep -cF 'border-lip-gray/g)).toBe(4 + 1 + 1 + 1);' src/__tests__/consistency-classnames.test.ts`
da **1**. La anterior daba 1 antes del cambio y 0 después.

### E1.5 — Δ15: cifras de `ui-language.test.ts`

Base H0: `toHaveLength(35 - 1 + 2 + 1 + 16 - 4 + 8)` y título **57**. Tras R7 y R8:
`… + 8 + 1 + 6`, con los comentarios `#175 R7` y `#175 R8`, y título
**64** (el «60» de Δ15 era la cifra a `fb5b209f`).

### Aprobación de la Enmienda E1

- [x] Enmienda E1 aprobada por humano (fecha: 2026-10-15, vía repo) ← gate obligatorio antes del handoff a Codex
