---
feature: "mobile-routine-canvas-fidelity"
status: draft
tags: [mobile, ui, spec]
---

# #178 mobile-routine-canvas-fidelity — Requisitos

> Lleva Recordatorios (`src/screens/reminders/index.tsx`) y Nuevo recordatorio
> (`src/screens/add-reminder/index.tsx`) a sus artboards del canvas aprobado
> (https://claude.ai/artifact/VqaQQsRTtis9Dbttqy3z7j, fila 3), **píxel exacto**.
>
> **Base congelada**: worktree `feature/178-mobile-routine-canvas-fidelity` en
> `fb5b209f` (= `origin/main` `788d1f89` + commits de harness).

## Decisiones del humano (no se reabren)

Literales del 2026-10-13, relatadas por el leader (chat de sites-99):

| Decisión | Respuesta literal | Qué fija en esta spec |
|---|---|---|
| Reparto | «Tres features (Recomendado)» | #175 = Documentos; **#178 = Recordatorios + Nuevo recordatorio**; #179 = Horario + Historial |
| D-H cabecera | «Título en contenido (Recomendado)» | título dentro de la pantalla y cabecera nativa con `title: ''` en `reminders` y `add-reminder` (R4, R10); la micro-regla de títulos de la carta la enmienda la primera feature que mergee (R2) |
| D-I iconos | «Iconos reicon (Recomendado)» | `reicon-react-native` en lugar de emoji en la fila de recordatorio, la hoja, el botón «Nuevo», los campos de fecha y hora y la vista previa (R4, R6, R8, R11, R12); los chips de tipo pierden el emoji y no ganan icono, como el artboard (R10) |
| Fidelidad | «Píxel exacto, igual que #174 (Recomendado)» y «el diseño final debe de quedar como el artifac» | margen lateral 20, gap, radios, alturas y tamaños de letra del artboard; tokens nuevos donde la escala no llega (R1); cada candado revertido se nombra en §Deltas de candados |
| Agrupación por día | sin respuesta (default D-G del explore) | fuera: ningún artboard la dibuja (§Fuera de alcance, P12) |

Regla de mezcla (encargo del leader, 2026-10-13): un token que #173, #174 o
#175 ya hayan dejado en `main` **con el mismo valor** se reutiliza y no se
redeclara; si existe **con otro valor**, H0 para (§Dependencias).

## Convenciones de esta spec

- **Comentarios de trazabilidad** en tests y código: siempre `#178 Rn`, nunca
  `#178` suelto. El `HEX_LITERAL` de `src/__tests__/design-drift.test.ts`
  casa `#178` cuando no lleva R-id. Los títulos de `describe` nuevos empiezan
  por `#178 Rn:`.
- **Literales, no símbolos**: los tests nuevos aseveran texto literal
  (`'2 ene, 09:00'`, `'Te aviso el 25 dic a las 09:00.'`) y clases literales.
  Nunca aseveran contra un símbolo importado de producción
  (`CATEGORY_SLOTS`, `REMINDER_TYPE_META`, `TOUCH_SLOP`, ni `es[...]` para las
  claves nuevas). Las aserciones heredadas que ya leen `es[...]` se quedan
  como están salvo las que §Deltas cambia. Excepción única: el `toEqual` de
  `REMINDER_TYPE_META` (R6) compara `Icon` con el componente importado de
  `reicon-react-native`, que es una librería y no producción.
- **RNTL 14**: siempre `await fireEvent.press(...)`, `await fireEvent(...)` y
  `await fireEvent.changeText(...)`.
- **Contar por hijos, no por testID** (Enmienda #70 de la carta): cada
  candado de composición asevera `node.children.length` y el orden de hijos
  de los nodos que esta spec crea (`View` y `Text` de RN). Los `Button` de
  heroui no se cuentan por hijos (envuelven en nodos internos): se consultan
  con `within(...)` y su `Button.Label` se ancla en el fuente (R13).
- **Selectores por prefijo vivos** (B14): `getAllByTestId(/^reminder-row-/)`
  y `/^reminder-row-skeleton-/` en `reminders/index.test.tsx`,
  `/^type-chip-/` y `/^advance-chip-/` en `add-reminder/index.test.tsx`, y
  `/^reminders-item-/` en `home/index.test.tsx`. **Ningún testID nuevo
  empieza por `reminder-row-`, `type-chip-`, `advance-chip-` ni
  `reminders-item-`**. Los nuevos son `reminders-title`,
  `reminders-entry-<id>`, `reminder-tile-<id>`, `reminder-upcoming-pop-<id>`,
  `reminders-delete-icon`, `add-reminder-title`, `add-reminder-preview`,
  `add-reminder-preview-text`, y los de los dobles de icono
  (`reminders-icon-<nombre>`, `add-reminder-icon-<nombre>`).
- **Textos duplicados**: con la lista vacía, «Nuevo» sale dos veces (botón de
  cabecera y acción del estado vacío, R9). Toda consulta de «Nuevo» va dentro
  de `within(screen.getByTestId('reminders-add-link'))` o
  `within(screen.getByTestId('reminders-empty'))`. A la base,
  `ByText('Nuevo')` no aparece en `reminders/index.test.tsx` (B15).
- **Clases**: sin corchetes (regla 3; C8 de design-drift escanea también los
  tests). Sin `text-accent` suelto (#61 R4). Sin `rounded-(2xl|lg|md|sm)`
  (#62 R4). Sin `text-warning` suelto (#61 R5). Ninguna clase
  `bg-category-*`/`text-category-*` escrita en las pantallas: salen de
  `CATEGORY_SLOTS` (#64 R9); los tests sí las escriben literales, como ya
  hace `#64 R7`. Cada clase prescrita aquí se cruzó con esos guards a la
  base. `p-3.5`, `px-3.5`, `py-2.5`, `py-0.75`, `gap-0.75`, `gap-1.5`,
  `gap-2.5`, `h-9.5`, `h-10`, `h-13` y `size-11.5` son espaciado de la escala
  (spike de #173: uniwind compila el fraccionario). `border-b-3` es ancho
  suelto de Tailwind v4 (spike de #173).
- **Altura de línea**: ninguno de los dos artboards fija `line-height`
  (`grep -c 'line-height'` da 0 en `Recordatorios.dc.html` y en
  `NuevoRecordatorio.dc.html`). Esta spec no prescribe `leading-*`.
- **Tracking en `em`**: toda clase `tracking-title` va con una clase `text-*`
  en el mismo `Text` (spike de #173).
- **Agregados compartidos**: ningún recuento se congela. Cada uno se da como
  comando + valor a la base + delta. H0 mide la base real y la cifra que se
  escribe es **base H0 + delta**. Anclas como `grep -cF` con salida esperada,
  nunca números de línea.
- **Fechas de fixture**: cruzan mes **y** año (diciembre de 2026 → enero de
  2027). Las filas de la lista llevan `dueAt` en ISO con `Z`; los `it` que
  aseveran fecha u hora literales de la lista fijan la zona con
  `hostProcess.env.TZ = 'America/Mexico_City'` en `beforeAll` y la
  restauran en `afterAll`, con
  `const hostProcess = process.getBuiltinModule('process');` (patrón de
  `src/screens/meal-schedule/index.test.tsx`). `process.env.TZ` a secas no
  cambia `Date` en jest. Los `it` de Nuevo recordatorio usan fechas locales
  (`wallClock`, `pickTime`) y no necesitan zona.
- **Formatos** (ICU de Node medido a la base; Hermes se comprueba en el humo,
  R14):

  | Llamada | es-MX | en-US |
  |---|---|---|
  | `toLocaleDateString(l, { day: 'numeric', month: 'short' })` | `2 ene`, `25 dic` | `Jan 2`, `Dec 25` |
  | `toLocaleDateString(l, { day: 'numeric', month: 'short', year: 'numeric' })` | `1 ene 2027`, `24 sep 2026` | `Jan 1, 2027` |
  | `toLocaleTimeString(l, { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })` | `09:00`, `20:05` | `09:00`, `20:05` |

  Sin `hourCycle: 'h23'`, es-MX da `09:00 a.m.`; el artboard pinta `09:00` y
  `20:00`, por eso se fija `h23` (P18).

## Base medida (`fb5b209f`)

Comandos desde `mobile-pet-tracker/`, salvo B20 a B23 y B30, que van desde la
raíz.

| Id | Comando | Valor |
|---|---|---|
| B1 | `grep -cE -- '--(text-(11\|13\|26)\|radius-(14\|16\|22\|tile)\|tracking-(title\|caps)\|font-extrabold):' src/theme/global.css` | 0 |
| B2 | `grep -cF "from 'reicon-react-native'" src/screens/reminders/index.tsx` / `… src/screens/add-reminder/index.tsx` / `… src/utils/reminder-meta.ts` | 0 / 0 / 0 |
| B3 | `grep -cF 'meta.emoji' src/screens/reminders/index.tsx` / `… src/screens/add-reminder/index.tsx` / `grep -cF 'emoji' src/utils/reminder-meta.ts` | 1 / 1 / 8 |
| B4 | `grep -cF 'padding: 24,' src/screens/reminders/index.tsx` / `grep -cF 'paddingBottom: insets.bottom + 24,' …` | 1 / 1 |
| B5 | `grep -cF 'rounded-xl bg-accent border-b-4 border-black/25' src/screens/reminders/index.tsx` / `… src/screens/add-reminder/index.tsx` | 1 / 1 |
| B6 | `grep -cF 'style={CONTINUOUS_CORNER}' src/screens/reminders/index.tsx` / `… src/screens/add-reminder/index.tsx` | 4 (tres píldoras y el tile del emoji) / 3 (título, fecha, hora) |
| B7 | `grep -cF 'bg-accent-soft' src/screens/reminders/index.tsx` / `… src/screens/add-reminder/index.tsx` | 1 / 2 |
| B8 | `grep -cF 'uppercase tracking-widest' src/screens/add-reminder/index.tsx` | 5 |
| B9 | `grep -cF '<Card' src/screens/reminders/index.tsx` | 1 (la fila) |
| B10 | `grep -cF 'expect(count(/style=\{CONTINUOUS_CORNER\}/g)).toBe(31 + 1 + 4 + 1);' src/__tests__/consistency-classnames.test.ts` / `grep -cF '16 + 2 + 1 - 1); // #147 R4' …` | 1 / 2 (el `count(/bg-accent-soft/g)` de #98 R10 y el `accentSoftCount` de #64 R9) |
| B11 | `grep -cF "[join('screens', 'reminders', 'index.tsx'), 4]," src/__tests__/consistency-classnames.test.ts` / `grep -cF "[join('screens', 'add-reminder', 'index.tsx'), 3]," …` | 1 / 1 |
| B12 | `grep -cF 'border-b-4\b/g)).toBe(19);' src/__tests__/consistency-classnames.test.ts` / `grep -cF 'border-black\/25/g)).toBe(19);' …` | 1 / 1 (#173 los baja a 18) |
| B13 | `grep -cF "expect(reminders.match(/bg-accent-soft/g)).toHaveLength(1);" src/__tests__/consistency-classnames.test.ts` | 1 |
| B14 | `grep -rnoE "ByTestId\(/\^(reminder\|reminders\|type\|advance)[a-z-]*" src \| wc -l` | 6: `/^type-chip-` y `/^advance-chip-` (add-reminder), `/^reminders-item-` ×2 (home), `/^reminder-row-skeleton-` y `/^reminder-row-` (reminders) |
| B15 | `grep -cF "ByText('Nuevo')" src/screens/reminders/index.test.tsx` | 0 |
| B16 | `grep -cF "expect(R8_REMINDERS).toHaveLength(50 + 1 - 2 + 1 - 1 + 1);" src/__tests__/ui-language.test.ts` / `grep -cF "{ file: 'src/app/_layout.tsx', key: 'reminders.reminders' }, // #114 R4" src/__tests__/ui-copy-table.ts` / `grep -cF "{ file: 'src/app/_layout.tsx', key: 'addReminder.addReminder' }, // #95 R4" …` | 1 / 1 / 1 |
| B17 | `grep -cF '+ 7, // #170 R1' src/providers/__tests__/language-provider.test.tsx` | 1 |
| B18 | `grep -cF "title: t('reminders.reminders')" src/app/_layout.tsx` / `grep -cF "title: t('addReminder.addReminder')" …` | 1 / 1 |
| B19 | `grep -cF "['reminders', 't:reminders.reminders']," src/app/__tests__/layout.test.tsx` / `grep -cF "['add-reminder', 't:addReminder.addReminder']," …` | 1 / 1 |
| B20 | `grep -cF 'la superficie siempre acompaña a un emoji y a un texto.' docs/ui-guidelines.md` | 1 |
| B21 | `grep -cF -- '- Títulos de pantalla: header del stack cuando exista, no Text suelto.' docs/ui-guidelines.md` | 1 |
| B22 | `grep -cF '## Enmienda de fidelidad al canvas' docs/ui-guidelines.md` | 0 |
| B23 | `grep -E '^### §2\.[0-9]+' specs/mobile-ui-language/design.md \| tail -1` | `### §2.26 — Añadidos por #170 — Alertas agrupadas y mini-mapa` |
| B24 | `grep -cE "^\s*it(\.each\(\|\()" src/screens/reminders/index.test.tsx` / `… src/screens/add-reminder/index.test.tsx` | 27 / 28 |
| B25 | `grep -cF "emoji: '" src/utils/__tests__/category-palette.test.ts` | 7 |
| B26 | `grep -cF "expect(formatDate).toHaveBeenCalledWith('es-MX');" src/screens/reminders/index.test.tsx` | 1 |
| B27 | `grep -cF "it('no duplica la acción de crear'" src/screens/reminders/index.test.tsx` | 1 |
| B28 | `grep -cF "const CHIP_SELECTED = 'rounded-full border border-accent bg-accent-soft px-3 py-2';" src/screens/add-reminder/index.test.tsx` / `grep -cF "const CHIP_IDLE = 'rounded-full border border-border bg-default px-3 py-2';" …` | 1 / 1 |
| B29 | `grep -cF "expect(actions.props.className).toBe('flex-row justify-end');" src/screens/reminders/index.test.tsx` / `grep -cF "expect(screen.queryByText(es['reminders.reminders'])).toBeNull();" …` | 1 / 2 |
| B30 | `git log origin/main --oneline -E --grep='cierra #177 \|#177 R[0-9]' \| wc -l` | 0 |

Recuento de `it` de los demás ficheros tocados (consistency-classnames,
design-drift, global-css, category-palette, layout, ui-language,
language-provider): H0 lo mide con el mismo `grep -cE` y `tasks.md` da solo
el delta.

## Dependencias (H0, sobre `main` con #173 mergeada)

Comandos desde `mobile-pet-tracker/`, salvo D6 a D9, que van desde la raíz.
Si alguno no da el valor esperado, **H0 para** y el leader enmienda esta spec
antes de seguir.

| Id | Comando | Esperado | Lo usa |
|---|---|---|---|
| D1 | `grep -cF -- "--font-extrabold: 'Inter-ExtraBold';" src/theme/global.css` | 1 | R4, R6, R7, R10, R12 (peso 800) |
| D2 | `grep -cF -- '--text-13: 13px;' src/theme/global.css` | 1 | R6 (meta), R12 (vista previa) |
| D3 | `grep -cF -- '--text-26: 26px;' src/theme/global.css` | 1 | R4 (título) |
| D4 | `grep -cF -- '--radius-tile: 18px;' src/theme/global.css` | 1 | R12 (vista previa, 18 px) y punto de inserción de R1 |
| D5 | `grep -cE -- '--radius-(14\|16\|22):' src/theme/global.css` | 0 | R1 (con el mismo valor se reutiliza; con otro, para) |
| D6 | `grep -cF '**Excepción nombrada (fidelidad al canvas, 2026-10-13)**' docs/conventions.md` | 1 | R4, R10 (margen 20) |
| D7 | `grep -cF '**Excepción nombrada (fidelidad al canvas, 2026-10-13)**' docs/ui-guidelines.md` | 1 | R4, R10 (margen 20) |
| D8 | `grep -cF 'Tamaños de letra fuera de la escala de Tailwind' docs/ui-guidelines.md` | 1 | R2 (lista que se extiende) |
| D9 | `git log origin/main --oneline -E --grep='cierra #177 \|#177 R[0-9]' \| wc -l` | 0 | §#177 |

**Piezas compartidas «0 o 1»** (las declara la primera de #174, #175 o #178
que mergee; las demás las reutilizan). H0 las mide y anota el valor; ninguno
de los dos resultados para:

| Id | Comando (desde `mobile-pet-tracker/`) | Si da 0 | Si da 1 |
|---|---|---|---|
| S1 | `grep -cF -- '--text-11: 11px;' src/theme/global.css` | R1 la declara | R1 la reutiliza |
| S2 | `grep -cF -- '--tracking-title: -0.02em;' src/theme/global.css` | R1 la declara | R1 la reutiliza |
| S3 | `grep -cF '## Enmienda de fidelidad al canvas (2026-10-13)' ../docs/ui-guidelines.md` | R2.1 la escribe | R2.1 no la toca; el test se escribe contra el texto que hay |
| S4 | `grep -cF 'Tracking fuera de la escala de Tailwind' ../docs/ui-guidelines.md` | R2.5 crea la línea | R2.5 añade a su lista lo que falte |
| S5 | `grep -cF -- '- Títulos de pantalla: header del stack cuando exista, no Text suelto.' ../docs/ui-guidelines.md` | R2.2 ya está hecha (otra feature la sustituyó) | R2.2 la sustituye |
| S6 | `grep -cF 'la superficie siempre acompaña a un emoji y a un texto.' ../docs/ui-guidelines.md` | R2.3 ya está hecha | R2.3 la sustituye |

Si el token de S1 o S2 existe con **otro** valor
(`grep -cE -- '--(text-11|tracking-title):' src/theme/global.css` mayor que
S1 + S2), H0 para (P10). Si S3 da 1 y su texto difiere del de §Texto de la
enmienda, H0 para y el leader enmienda.

### #177 (CTA con cuerpo 56/16)

#177 cambia el cuerpo de los botones de acción (alto, radio, grosor del labio
y etiqueta). **#178 no toca el cuerpo de ningún botón de acción**
(`add-reminder-submit`, `reminders-delete-confirm`, `reminders-delete-cancel`,
`reminders-retry`, la acción de `EmptyState` y `reminder-delete-<id>`) en
ninguno de los dos casos (P11). La única excepción es el botón «Nuevo» de la
cabecera (R4), que el artboard dibuja compacto (40 px) y no como CTA.

- **Caso B (D9 = 0, #177 no está en `main`)**: se implementa esta spec tal
  cual. El radio 16, el alto 56 y la etiqueta 17/800 del CTA del artboard de
  Nuevo recordatorio quedan como desviación nombrada (P11).
- **Caso A (D9 ≥ 1)**: H0 para. El leader cruza los literales de R4 («Nuevo»)
  y de §Deltas de `consistency-classnames` con lo que #177 dejó en `main` y
  enmienda la spec antes de seguir.

---

## Requisitos

Fixtures comunes de Recordatorios (R5 a R9). Se escriben en un `const` del
fichero de test, con `makeReminder` existente:

| id | type | title | dueAt | status |
|---|---|---|---|---|
| `a` | `vaccine` | `Refuerzo de rabia` | `'2027-01-02T15:00:00.000Z'` | `scheduled` |
| `b` | `medication` | `Pastilla trimestral` | `'2027-01-21T02:05:00.000Z'` | `scheduled` |
| `c` | `custom` | `Baño` | `'2026-12-03T17:30:00.000Z'` | `sent` |

Con `jest.useFakeTimers({ now: new Date('2026-12-30T15:00:00.000Z') })` (o
`setSystemTime` con ese instante) y `TZ = 'America/Mexico_City'`: `a` vence en
3 días (badge «¡Próximo!»), `b` en 21 (sin badge), `c` está inactiva. Píldoras
esperadas: activos 2, esta semana 1, inactivos 1.

### R1 — Tokens del artboard en `@theme`

**WHEN** se compila el tema, **THE SYSTEM SHALL** declarar en el bloque
`@theme {` de `src/theme/global.css`, una sola vez cada uno, estos tokens:

| Token | Valor | Dónde va | Uso (artboard) |
|---|---|---|---|
| `--radius-14` | `14px` | tras la última línea `--radius-<x>: <v>;` del bloque (con #173 sola: tras `--radius-tile: 18px;`) | mosaico del icono de la fila |
| `--radius-16` | `16px` | justo después de `--radius-14: 14px;` | píldoras de resumen |
| `--radius-22` | `22px` | justo después de `--radius-16: 16px;` | fila de recordatorio |
| `--text-11` | `11px` | **S1**: si da 0, tras la última línea `--text-<n>: <n>px;`; si da 1, no se toca | badge «¡Próximo!» (11/800) |
| `--tracking-title` | `-0.02em` | **S2**: si da 0, justo después de `--radius-22: 22px;`; si da 1, no se toca | títulos de las dos pantallas |

Sin `--text-11--line-height`: el artboard no fija altura de línea.

**Reutiliza** sin redeclarar: `--text-13` y `--text-26` (D2, D3),
`--font-extrabold` (D1), `--radius-tile` (D4, vista previa de 18 px),
`font-black` (900), `text-xs` (12), `text-sm` (14), `text-base` (16),
`text-xl` (20), `text-2xl` (24), `rounded-xl` (12) y `rounded-full`.

**Test** (`src/theme/__tests__/global-css.test.ts`,
`describe('#178 R1: tokens de Recordatorios')`):

- `parseVariables(extractTheme())` hace `toMatchObject` con
  `{ 'text-11': '11px', 'text-13': '13px', 'text-26': '26px', 'radius-14': '14px', 'radius-16': '16px', 'radius-22': '22px', 'radius-tile': '18px', 'tracking-title': '-0.02em' }`;
- `extractTheme().match(/--radius-14:/g)` tiene longitud 1, y lo mismo para
  `--radius-16:`, `--radius-22:`, `--text-11:` y `--tracking-title:`.

### R2 — Enmienda de la carta

**WHEN** se lee `docs/ui-guidelines.md`, **THE SYSTEM SHALL** contener:

1. **Sección** (S3): si S3 da 0, al final del fichero, una sola vez, la
   sección literal de §Texto de la enmienda de la carta. Si da 1, no se toca.
2. **Micro-regla de títulos** (S5): la línea
   `- Títulos de pantalla: header del stack cuando exista, no Text suelto.`
   se sustituye por
   `` - Títulos de pantalla: título en contenido y cabecera nativa con `title: ''` (Enmienda de fidelidad al canvas). ``.
3. **Frase de la paleta** (S6): la frase
   `la superficie siempre acompaña a un emoji y a un texto.` se sustituye por
   `la superficie siempre acompaña a un icono de reicon-react-native y a un texto.`.
4. **Regla 2, tamaños** (D8): en la línea que empieza por
   `Tamaños de letra fuera de la escala de Tailwind`, se añade
   `` `--text-11: 11px` `` al final de la lista (antes del `;` que la cierra),
   separado por `, `, si no está ya. No se crea otra línea.
5. **Regla 2, tracking** (S4): si S4 da 0, inmediatamente después de esa
   línea, una línea propia con el texto
   «Tracking fuera de la escala de Tailwind (fidelidad al canvas, #178): `--tracking-title: -0.02em`; la clase `tracking-*` va con una clase `text-*` en el mismo elemento, porque uniwind multiplica el `em` por su tamaño.».
   Si da 1, se añade a su lista `` `--tracking-title: -0.02em` `` solo si
   falta.
6. **§12, radios fuera de escala**: como última línea de la regla
   `12. **Escala de radios**` (antes de `13. **Botón con cuerpo**`), la frase
   «Fuera de la escala, por fidelidad al canvas (#178): `rounded-14` (14 px), mosaico del icono de la fila de Recordatorios; `rounded-16` (16 px), píldoras de resumen de Recordatorios; `rounded-22` (22 px), fila de Recordatorios, que es un `View` y no un `Card` porque `twMerge` no sustituye `rounded-card` por un radio con nombre de valor.».
   Si otra feature dejó ya una línea «Fuera de la escala, por fidelidad al
   canvas (#…)», la de #178 va justo después de la última de ellas. Cambio
   solo aditivo: las frases que aseveran `#62 R4` y `#166 R4` no se tocan.
7. **§13, chip seleccionado**: inmediatamente antes de la viñeta que empieza
   por `    - **Sin labio**:`, una viñeta con la misma sangría:
   «    - **Chip seleccionado** (fidelidad al canvas, #178): cápsula `rounded-full bg-accent border-b-3 border-black/25`; el chip sin seleccionar no lleva labio.».

**Test** (`src/__tests__/design-drift.test.ts`,
`describe('#178 R2: enmienda de fidelidad al canvas en Recordatorios')`; lee
`../docs/ui-guidelines.md` con `readFileSync` desde `process.cwd()`):

1. `## Enmienda de fidelidad al canvas (2026-10-13)` aparece exactamente una
   vez;
2. el texto que sigue al encabezado casa
   `/- \[[ xX]\] Enmienda de fidelidad al canvas aprobada por humano/`
   (casilla tolerante: firmarla no pone el test en rojo);
3. contiene las tres viñetas de §Texto de la enmienda, un `toContain` por
   viñeta completa;
4. no contiene ninguna de las dos frases sustituidas (B20, B21) y contiene
   cada frase nueva de los puntos 2 y 3 una sola vez;
5. la línea que empieza por `Tamaños de letra fuera de la escala de Tailwind`
   contiene `` `--text-11: 11px` ``;
6. la línea que empieza por `Tracking fuera de la escala de Tailwind`
   contiene `` `--tracking-title: -0.02em` ``;
7. el tramo entre `12. **Escala de radios**` y `13. **Botón con cuerpo**`
   (por `indexOf`) contiene `` `rounded-14` (14 px) ``, `` `rounded-16` (16 px) ``
   y `` `rounded-22` (22 px) ``;
8. el tramo desde `13. **Botón con cuerpo**` contiene la viñeta del punto 7
   una sola vez, y su `indexOf` es menor que el de `- **Sin labio**:`.

Las líneas se buscan con `split('\n').find((l) => l.trimStart().startsWith(…))`.

### R3 — Copy nuevo

**WHEN** se carga el catálogo, **THE SYSTEM SHALL** declarar en `en` y `es`
de `src/i18n/catalog.ts` exactamente estas dos claves nuevas:

| Clave | `en` | `es` | Dónde va (en cada idioma) |
|---|---|---|---|
| `reminders.dueAt` | `{{date}}, {{time}}` | `{{date}}, {{time}}` | justo después de `'reminders.dueInDays'` |
| `addReminder.notifyPreview` | `I'll remind you on {{date}} at {{time}}.` | `Te aviso el {{date}} a las {{time}}.` | justo después de `'addReminder.saveReminder'` |

El valor `en` de `addReminder.notifyPreview` lleva apóstrofo: se escribe con
comillas dobles (`"I'll remind you on {{date}} at {{time}}."`), como hace
prettier.

El título de Nuevo recordatorio sigue siendo `addReminder.addReminder`
(«Agregar recordatorio», igual que el h1 del artboard). Sin cambio de copy.

**AND** registrarlas en `specs/mobile-ui-language/design.md`:

- en una sección nueva `### §2.<N> — Añadidos por #178 — Recordatorios del canvas`,
  donde N es la última §2.x que mida H0 más uno (a la base, 27; B23);
- una fila por clave, con el formato
  `| — | \`<clave>\` | \`<en>\` | \`<es>\` | ← añadida por #178 (R3) |`.

**AND** en `src/providers/__tests__/language-provider.test.tsx`, sumar
`+ 2, // #178 R3` a la fórmula de `englishKeys` como última línea; el término
que era el último (a la base `+ 7, // #170 R1`, B17) pierde su coma final.

**AND** el inventario de usos (`src/__tests__/ui-copy-table.ts`, bloque
`R8_REMINDERS`, y su longitud en `src/__tests__/ui-language.test.ts`, B16)
cambia **en el R-id que crea o quita la llamada**, no en R3, para que
`checkUses(R8_REMINDERS)` no se ponga rojo antes de que exista el nodo:

| R-id | Fila | Longitud |
|---|---|---|
| R4 | `{ file: 'src/app/_layout.tsx', key: 'reminders.reminders' }, // #114 R4` → `{ file: 'src/screens/reminders/index.tsx', key: 'reminders.reminders' }, // #178 R4` | sin cambio |
| R6 | nueva `{ file: 'src/screens/reminders/index.tsx', key: 'reminders.dueAt' }, // #178 R6` | `+ 1` |
| R9 | nueva `{ file: 'src/screens/reminders/index.tsx', key: 'reminders.new' }, // #178 R9` (segunda llamada; `checkUses` cuenta llamadas por fila) | `+ 1` |
| R10 | `{ file: 'src/app/_layout.tsx', key: 'addReminder.addReminder' }, // #95 R4` → `{ file: 'src/screens/add-reminder/index.tsx', key: 'addReminder.addReminder' }, // #178 R10` | sin cambio |
| R12 | nueva `{ file: 'src/screens/add-reminder/index.tsx', key: 'addReminder.notifyPreview' }, // #178 R12` | `+ 1` |

Cada `+ 1` se añade a la fórmula medida en H0 (a la base B16) y a su
comentario (`, +1 #178 R6`, …). Al cerrar, la fórmula es la de H0 `+ 1 + 1 + 1`.
El título del `it` no se toca.

**Test** (`src/providers/__tests__/language-provider.test.tsx`,
`describe('#178 R3: claves de Recordatorios del canvas')`, calcado de
`#170 R1`):

- los dos triples `[clave, en, es]` escritos literales;
- por cada triple, `english[key]` y `spanish[key]` con `toBe`;
- el registro casa
  `new RegExp('\\| — \\| \`' + escapeRegExp(key) + '\`[^\\n]*← añadida por #178 \\(R3\\)')`.


### R4 — Recordatorios: marco y título en contenido

**WHILE** Recordatorios está montada, **THE SYSTEM SHALL**:

1. dar al `ScrollView` `screen-reminders`
   `contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 24, gap: 14, paddingBottom: insets.bottom + 24 }}`
   (margen 20: excepción nombrada, D6/D7);
2. dar a `reminders-actions` `className="flex-row items-center gap-2"`, con
   el título y el botón «Nuevo», en ese orden;
3. pintar el título como
   `<Text testID="reminders-title" accessibilityRole="header" className="flex-1 text-26 font-black tracking-title text-foreground">`
   con `t('reminders.reminders')`;
4. dar a `reminders-add-link`
   `className="rounded-xl bg-accent border-b-4 border-black/25 h-10 gap-1.5 px-3.5"`,
   con dos hijos en este orden: `<Plus size={16} color={accentForeground} />`
   de `reicon-react-native` y
   `<Button.Label className="text-sm font-extrabold text-accent-foreground">`
   con `t('reminders.new')`. El `onPress` no cambia;
5. dejar la opción del `Stack.Screen` `reminders` de `src/app/_layout.tsx` en
   `title: ''` (era `title: t('reminders.reminders')`, B18).

**Test** (`src/screens/reminders/index.test.tsx`,
`describe('#178 R4: marco y título en contenido')`; doble de reicon a nivel de
fichero con `Plus: mockIcon('reminders-icon-plus')`; espía de
`useThemeColors` con `` `color:${token}` ``):

- `contentContainerStyle` hace `toEqual`
  `{ paddingHorizontal: 20, paddingTop: 24, gap: 14, paddingBottom: 48 }`;
- `reminders-actions` tiene `className` `'flex-row items-center gap-2'` y
  `within(actions).getAllByTestId(/^reminders-(title|add-link)$/)` da
  `['reminders-title', 'reminders-add-link']`;
- `reminders-title` tiene texto `'Recordatorios'`, `accessibilityRole`
  `'header'` y `className`
  `'flex-1 text-26 font-black tracking-title text-foreground'`;
- `reminders-add-link` tiene el `className` del punto 4;
  `within(addLink).getByTestId('reminders-icon-plus')` tiene `size` 16 y
  `color` `'color:accent-foreground'`; `within(addLink).getByText('Nuevo')`
  existe;
- en `src/app/__tests__/layout.test.tsx`, la fila
  `['reminders', 't:reminders.reminders'],` pasa a `['reminders', ''],`.

La etiqueta del `Button.Label` se ancla en el fuente (R13).

### R5 — Recordatorios: píldoras de resumen

**WHILE** la lista tiene recordatorios, **THE SYSTEM SHALL** pintar:

- el contenedor con `testID="reminders-pills"` y `className="flex-row gap-2"`,
  con los tres `pill-*` en el orden activo, semana, inactivo;
- cada píldora con `style={CONTINUOUS_CORNER}` y exactamente dos `Text`
  hijos, número (con `style={TABULAR_NUMS}`) y etiqueta, en ese orden:

| testID | `className` de la píldora | número | etiqueta |
|---|---|---|---|
| `pill-active` | `flex-1 rounded-16 px-3 py-2.5 bg-surface-secondary` | `text-2xl font-black text-accent-strong` | `text-xs font-bold text-muted` |
| `pill-week` | `` `flex-1 rounded-16 px-3 py-2.5 ${CATEGORY_SLOTS.amber.surface}` `` | `` `text-2xl font-black ${CATEGORY_SLOTS.amber.ink}` `` | `` `text-xs font-bold ${CATEGORY_SLOTS.amber.ink}` `` |
| `pill-inactive` | `flex-1 rounded-16 px-3 py-2.5 bg-default` | `text-2xl font-black text-muted` | `text-xs font-bold text-muted` |

Las cifras y la lógica de recuento no cambian.

**Test** (`describe('#178 R5: píldoras de resumen del canvas')`, fixtures
comunes):

- `reminders-pills` tiene `className` `'flex-row gap-2'` y
  `children.length` 3; sus hijos llevan los `testID` `pill-active`,
  `pill-week` y `pill-inactive` en ese orden;
- por píldora, `className` exacta con las clases resueltas literales
  (`bg-category-amber`, `text-category-amber-strong`), `children.length` 2,
  y los textos `'2'`/`'Activos'`, `'1'`/`'Esta semana'`, `'1'`/`'Inactivos'`
  (literales de `es` a la base).

### R6 — Recordatorios: fila

**WHILE** la lista tiene recordatorios, **THE SYSTEM SHALL** pintar cada
recordatorio, sin `Card`, como un `View` con:

- `testID={`reminder-row-${id}`}`, `style={CONTINUOUS_CORNER}` y
  `` className={`flex-row items-center gap-3 rounded-22 bg-surface p-3.5 ${upcoming ? 'border-2 border-warning-soft' : 'border border-border'}${inactive ? ' opacity-50' : ''}`} ``,
  donde `upcoming = !inactive && days >= 0 && days <= 10` (la condición del
  badge, sin cambio);
- tres hijos en este orden:
  1. el mosaico `testID={`reminder-tile-${id}`}`,
     `` className={`size-11.5 items-center justify-center rounded-14 ${slot.surface}`} ``,
     `style={CONTINUOUS_CORNER}`, con un único hijo
     `<meta.Icon size={22} color={inkColor} />`;
  2. la columna `className="min-w-0 flex-1 gap-0.75"` con tres hijos:
     - fila superior `className="flex-row items-center justify-between"`:
       tipo `` `text-xs font-extrabold ${slot.ink}` `` con `t(meta.labelKey)`,
       y el badge (R7) si aplica;
     - título `text-base font-extrabold text-foreground`;
     - fila de meta `className="flex-row items-center gap-1"`: fecha y hora
       `text-13 font-normal text-muted` con
       `t('reminders.dueAt', { date, time })`, y después
       `t('reminders.dueInDays', { days })` en `text-13 font-normal text-muted`
       o, si está inactiva, el estado `reminder-status-<id>` en
       `text-13 font-semibold text-muted`;
  3. `reminder-delete-<id>`, sin cambios.
- `date = due.toLocaleDateString(locale, { day: 'numeric', month: 'short' })`
  y `time = due.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })`.
- El color del icono sale de **una sola** llamada a `useThemeColors` al
  principio de `RemindersScreen`, con
  `['category-blue-strong', 'category-amber-strong', 'category-green-strong', 'category-violet-strong', 'category-rose-strong', 'muted', 'accent-foreground', 'danger']`;
  el slot `neutral` usa `muted` y los demás `category-<slot>-strong`.

**AND** `src/utils/reminder-meta.ts` pasa a
`{ labelKey: TranslationKey; Icon: <tipo de icono de reicon>; category: CategorySlot }`
sin `emoji`, con:

| tipo | `Icon` | slot (sin cambio) |
|---|---|---|
| `vaccine` | `Syringe` | `blue` |
| `deworming` | `Drop` | `violet` |
| `medication` | `Pill` | `amber` |
| `appointment` | `Stethoscope` | `green` |
| `weight` | `Weight` | `neutral` |
| `food` | `ForkKnife` | `rose` |
| `custom` | `PinTack` | `neutral` |

Se borra `import { Card }` de la pantalla.

**Test** (`describe('#178 R6: fila del canvas')`, fixtures comunes, zona
fijada; doble de reicon con `Syringe: mockIcon('reminders-icon-syringe')`,
`Pill: mockIcon('reminders-icon-pill')`,
`PinTack: mockIcon('reminders-icon-pin-tack')` y los demás de la tabla con
su nombre en kebab-case):

- `className` exacta de `reminder-row-a`
  (`'flex-row items-center gap-3 rounded-22 bg-surface p-3.5 border-2 border-warning-soft'`),
  `reminder-row-b` (`'… border border-border'`) y `reminder-row-c`
  (`'… border border-border opacity-50'`);
- por fila, `children.length` 3; `children[0].props.testID` es
  `reminder-tile-<id>` y `children[2].props.testID` es `reminder-delete-<id>`;
- `reminder-tile-a` con `className`
  `'size-11.5 items-center justify-center rounded-14 bg-category-blue'`,
  `children.length` 1 y el doble `reminders-icon-syringe` con `size` 22 y
  `color` `'color:category-blue-strong'`; `b`: `bg-category-amber`,
  `reminders-icon-pill`, `'color:category-amber-strong'`; `c`: `bg-default`,
  `reminders-icon-pin-tack`, `'color:muted'`;
- en `a`: texto `'Vacuna'` con `className`
  `'text-xs font-extrabold text-category-blue-strong'`; título
  `'Refuerzo de rabia'` con `'text-base font-extrabold text-foreground'`;
  `'2 ene, 09:00'` y `'· en 3 días'` con `'text-13 font-normal text-muted'`;
- en `b`: `'20 ene, 20:05'`; en `c`: `'3 dic, 11:30'` y `reminder-status-c`
  con texto `'Enviado'` y `className` `'text-13 font-semibold text-muted'`;
- ninguna fila contiene un `Text` cuyo contenido case
  `/\p{Extended_Pictographic}/u`.

**Test** (`src/utils/__tests__/category-palette.test.ts`): el `it`
`'conserva label y emoji mientras asigna los siete huecos exactos'` pasa a
`'conserva label e icono mientras asigna los siete huecos exactos'`, y su
`toEqual` sustituye cada `emoji: '…'` (B25: 7) por `Icon: <Componente>`,
importado de `reicon-react-native` en ese test.

### R7 — Recordatorios: entrada escalonada y badge

**WHILE** la lista tiene recordatorios, **THE SYSTEM SHALL**:

- envolver cada fila en
  `<HomeEntrance key={id} testID={`reminders-entry-${id}`} index={i}>`
  (de `src/screens/home/home-entrance.tsx`), con `i` la posición en la lista;
- envolver el badge en `<PopIn testID={`reminder-upcoming-pop-${id}`}>` (de
  `src/components/pop-in.tsx`), con el `Text` `reminder-upcoming-<id>` dentro
  y `className="rounded-full bg-warning-soft px-2 py-0.75 text-11 font-extrabold text-warning-strong"`.

Reducir movimiento lo resuelven `HomeEntrance` y `PopIn`; esta spec no fija
tiempos (P16).

**Test** (`describe('#178 R7: entrada escalonada y badge')`; doble de
`../home/home-entrance` calcado del de `src/screens/login/index.test.tsx`,
con `mockHomeEntrance`):

- `mockHomeEntrance` recibió `objectContaining({ testID: 'reminders-entry-a', index: 0 })`,
  `b` con 1 y `c` con 2 (el orden del fixture);
- `within(getByTestId('reminders-entry-a')).getByTestId('reminder-row-a')`
  existe, y lo mismo para `b` y `c`;
- `within(getByTestId('reminder-upcoming-pop-a')).getByTestId('reminder-upcoming-a')`
  existe, con texto `'¡Próximo!'` y el `className` exacto de arriba;
- `queryByTestId('reminder-upcoming-pop-b')` es `null`.

### R8 — Recordatorios: sheet de borrado

**WHEN** el usuario pulsa `reminder-delete-<id>`, **THE SYSTEM SHALL** pintar
`reminders-delete-sheet` con `className="items-center gap-3 bg-surface px-5 pb-9 pt-3"`
y cinco hijos en este orden:

1. `<View testID="reminders-delete-icon" className={`size-14 items-center justify-center rounded-full ${CATEGORY_SLOTS.rose.surface}`}>`
   con `<Trash size={26} color={danger} />`;
2. título `text-center text-xl font-black text-foreground`
   (`t('reminders.deleteReminder')`);
3. `reminders-delete-reference` con `text-center text-base font-semibold text-foreground`
   (contenido sin cambio, P13);
4. cuerpo `text-center text-sm font-normal text-muted`;
5. un `View` `className="w-full gap-3"` con `reminders-delete-confirm` y
   `reminders-delete-cancel` sin cambios (§#177).

**Test** (`describe('#178 R8: sheet de borrado del canvas')`; doble
`Trash: mockIcon('reminders-icon-trash')`):

- tras `await fireEvent.press(getByTestId('reminder-delete-a'))`, el sheet
  tiene el `className` de arriba y `children.length` 5;
- `children[0].props.testID` es `reminders-delete-icon`, con `className`
  `'size-14 items-center justify-center rounded-full bg-category-rose'` y el
  doble `reminders-icon-trash` con `size` 26 y `color` `'color:danger'`;
- `'¿Eliminar recordatorio?'` con `'text-center text-xl font-black text-foreground'`;
  `reminders-delete-reference` con su `className`; `'Esta acción no se puede deshacer.'`
  con `'text-center text-sm font-normal text-muted'`;
- `children[4]` tiene `className` `'w-full gap-3'` y contiene
  `reminders-delete-confirm` y `reminders-delete-cancel`.

### R9 — Recordatorios: acción del estado vacío

**WHEN** la lista llega vacía, **THE SYSTEM SHALL** pasar a `EmptyState`
`action={{ label: t('reminders.new'), onPress: () => router.push('/add-reminder' as Href) }}`.
Revierte `#155 R6` `'no duplica la acción de crear'` (B27, P7).

**Test** (`describe('#178 R9: el vacío ofrece crear')`):

- `within(getByTestId('reminders-empty')).getByText('Nuevo')` existe;
- pulsarlo con `await fireEvent.press(...)` llama a `router.push` con
  `'/add-reminder'` una vez;
- `within(getByTestId('reminders-add-link')).getByText('Nuevo')` sigue
  existiendo.

### R10 — Nuevo recordatorio: marco, título, etiquetas y chips de tipo

**WHILE** Nuevo recordatorio está montada, **THE SYSTEM SHALL**:

1. dar a `add-reminder-form`
   `contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 24, gap: 16, paddingBottom: insets.bottom + 24 }}`;
2. pintar como primer hijo del formulario
   `<Text testID="add-reminder-title" accessibilityRole="header" className="text-2xl font-black tracking-title text-foreground">`
   con `t('addReminder.addReminder')`;
3. pintar las cinco etiquetas (Tipo, Título, Fecha, Hora, Aviso) con
   `className="text-sm font-extrabold text-foreground"`, sin `uppercase` ni
   `tracking-widest`;
4. dar a las secciones Tipo y Aviso `gap-2`, y a Título, Fecha y Hora
   `gap-1.5`;
5. pintar cada `type-chip-<tipo>` con `t(meta.labelKey)` solo (sin emoji) y:
   - seleccionado: la constante de módulo
     `const SELECTED_CHIP = 'h-9.5 items-center justify-center rounded-full px-3.5 bg-accent border-b-3 border-black/25';`
     (escrita una sola vez; la usan también los chips de aviso, R12), texto
     `text-sm font-extrabold text-accent-foreground`;
   - sin seleccionar: `` `h-9.5 items-center justify-center rounded-full px-3.5 ${slot.surface}` ``,
     texto `` `text-sm font-extrabold ${meta.category === 'neutral' ? 'text-foreground' : slot.ink}` ``;
   - `hitSlop={TOUCH_SLOP}` y `accessibilityState` sin cambio;
6. dejar la opción del `Stack.Screen` `add-reminder` en `title: ''`.

**Test** (`src/screens/add-reminder/index.test.tsx`,
`describe('#178 R10: marco, título y chips de tipo del canvas')`):

- `contentContainerStyle` hace `toEqual`
  `{ paddingHorizontal: 20, paddingTop: 24, gap: 16, paddingBottom: 48 }`;
- `add-reminder-title` con texto `'Agregar recordatorio'`, rol `'header'` y
  `className` `'text-2xl font-black tracking-title text-foreground'`;
- `getByText('Tipo')`, `'Título'`, `'Fecha'`, `'Hora'` y `'Aviso'` tienen
  `className` `'text-sm font-extrabold text-foreground'`;
- `type-chip-vaccine` (seleccionado por defecto) con el `className`
  seleccionado y su texto `'Vacuna'` con
  `'text-sm font-extrabold text-accent-foreground'`;
- `type-chip-deworming` con
  `'h-9.5 items-center justify-center rounded-full px-3.5 bg-category-violet'`
  y texto `'text-sm font-extrabold text-category-violet-strong'`;
  `type-chip-custom` con `'… px-3.5 bg-default'` y texto
  `'text-sm font-extrabold text-foreground'`;
- tras `await fireEvent.press(getByTestId('type-chip-custom'))`, se invierten
  los dos;
- en `layout.test.tsx`, `['add-reminder', 't:addReminder.addReminder'],` pasa
  a `['add-reminder', ''],`.

### R11 — Nuevo recordatorio: título, fecha y hora

**WHILE** Nuevo recordatorio está montada, **THE SYSTEM SHALL**:

1. dar a `title-input`
   `` className={`h-13 rounded-xl bg-default px-3.5 text-base font-semibold text-foreground border-2 ${titleFocused ? 'border-accent' : 'border-transparent'}`} ``,
   con `style={CONTINUOUS_CORNER}` y `onFocus`/`onBlur` que alternan
   `titleFocused`;
2. dar a la fila de fecha y hora `className="flex-row gap-2.5"`, a la columna
   de fecha `flex-3 gap-1.5` y a la de hora `flex-2 gap-1.5` (P19);
3. dar a `date-field` y `time-field`
   `className="h-13 flex-row items-center gap-2 rounded-xl bg-default px-3.5"`
   con `style={CONTINUOUS_CORNER}` y dos hijos: el icono
   (`<Calendar size={18} color={muted} />` o `<Clock size={18} color={muted} />`)
   y el `Text` `text-base font-semibold text-foreground` (fecha vacía:
   `text-base font-semibold text-muted`);
4. formatear la fecha con
   `toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' })`
   y la hora con `{ hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }`;
5. leer los colores con una sola llamada `useThemeColors(['muted', 'accent-strong'])`.

**Test** (`describe('#178 R11: título, fecha y hora del canvas')`; doble de
reicon con `Calendar: mockIcon('add-reminder-icon-calendar')` y
`Clock: mockIcon('add-reminder-icon-clock')`; espía con
`` `color:${token}` ``):

- `title-input` con `className` terminado en `border-transparent`; tras
  `await fireEvent(input, 'focus')`, en `border-accent`; tras
  `await fireEvent(input, 'blur')`, otra vez `border-transparent` (literales
  completos);
- `date-field` y `time-field` con `className` exacta, `children.length` 2, el
  doble de icono como primer hijo con `size` 18 y `color` `'color:muted'`;
- sin fecha, el texto `'Elige una fecha'` (`addReminder.selectDate` en `es`)
  lleva
  `'text-base font-semibold text-muted'`;
- `pickTime(20, 5)` deja `'20:05'` en `time-field`.

### R12 — Nuevo recordatorio: chips de aviso y vista previa

**WHILE** Nuevo recordatorio está montada, **THE SYSTEM SHALL**:

1. pintar cada `advance-chip-<min>` seleccionado con `SELECTED_CHIP` (R10) y
   texto `text-sm font-extrabold text-accent-foreground`;
   sin seleccionar, `h-9.5 items-center justify-center rounded-full px-3.5 bg-default`
   y texto `text-sm font-extrabold text-foreground`; si está deshabilitado,
   ` opacity-50` al final (sin cambio de lógica);
2. **WHEN** `pickedDueAt !== null`, pintar entre la sección Aviso y
   `add-reminder-submit`
   `<View testID="add-reminder-preview" className="flex-row items-center gap-2.5 rounded-tile bg-surface-secondary px-3.5 py-3" style={CONTINUOUS_CORNER}>`
   con dos hijos: `<Bell size={20} color={accentStrong} />` y
   `<Text testID="add-reminder-preview-text" className="flex-1 text-13 font-semibold text-foreground">`
   con `t('addReminder.notifyPreview', { date, time })`;
   - `notifyAt = new Date(pickedDueAt.getTime() - selectedAdvance * 60000)`
     (`selectedAdvance` es el aviso efectivo que ya calcula la pantalla);
   - `date` con `{ day: 'numeric', month: 'short' }` y `time` con el formato
     h23 de R11, los dos sobre `notifyAt`;
3. **IF** `pickedDueAt === null`, no pintar `add-reminder-preview`.

**Test** (`describe('#178 R12: chips de aviso y vista previa')`; doble
`Bell: mockIcon('add-reminder-icon-bell')`):

- sin fecha, `queryByTestId('add-reminder-preview')` es `null`;
- con `jest.useFakeTimers()` y `jest.setSystemTime(new Date(2026, 11, 20, 10, 0))`,
  `await pickDate(wallClock([2027, 0, 1, 12, 0], [2027, 0, 1]))` y
  `await pickTime(9, 0)`:

| Aviso pulsado | Texto esperado de `add-reminder-preview-text` |
|---|---|
| ninguno (por defecto, 10080) | `'Te aviso el 25 dic a las 09:00.'` |
| `advance-chip-1440` | `'Te aviso el 31 dic a las 09:00.'` |
| `advance-chip-0` | `'Te aviso el 1 ene a las 09:00.'` |
| `advance-chip-4320` | `'Te aviso el 29 dic a las 09:00.'` |
| `advance-chip-0` y `pickTime(20, 5)` | `'Te aviso el 1 ene a las 20:05.'` |

- el seleccionado tiene el `className` de chip seleccionado y los demás el
  de chip sin seleccionar, literales (constantes `CHIP_SELECTED` y
  `CHIP_IDLE` del fichero, §Deltas);
- `add-reminder-preview` tiene `className` exacta, `children.length` 2 y el
  doble `add-reminder-icon-bell` con `size` 20 y `color`
  `'color:accent-strong'`;
- rama del aviso efectivo: con `setSystemTime(new Date(2026, 11, 31, 10, 0))`
  y la misma fecha y hora, sin pulsar aviso, el texto es
  `'Te aviso el 1 ene a las 09:00.'` (10080, 4320 y 1440 ya pasaron; queda 0).

`ADVANCE_OPTIONS` a la base: 0, 1440, 4320 y 10080
(`grep -cF '{ minutes: ' src/screens/add-reminder/index.tsx` da 4). Si H0 mide
otra cosa, para.

### R13 — Candados de deriva e inventarios

**THE SYSTEM SHALL** mantener `src/screens/reminders/index.tsx`,
`src/screens/add-reminder/index.tsx` y `src/utils/reminder-meta.ts`:

- sin emoji: `/\p{Extended_Pictographic}/u` sin coincidencias en los tres;
- con un único `import { … } from 'reicon-react-native'` en cada uno, con
  exactamente: reminders `['Plus', 'Trash']`; add-reminder
  `['Bell', 'Calendar', 'Clock']`; reminder-meta
  `['Drop', 'ForkKnife', 'Pill', 'PinTack', 'Stethoscope', 'Syringe', 'Weight']`
  (más el tipo si hace falta, importado con `type`, que no cuenta);
- sin hex, sin corchetes, sin `StyleSheet.create`, sin `shadowColor` ni
  `elevation`, sin `rounded-(2xl|lg|md|sm)` y sin `text-accent` suelto;
- reminders importa `HomeEntrance` de `'../home/home-entrance'` y `PopIn` de
  `'../../components/pop-in'`, y no contiene `<Card` ni `components/card`;
- el fuente de reminders contiene
  `<Button.Label className="text-sm font-extrabold text-accent-foreground">`
  una vez (ancla del «Nuevo»);
- en add-reminder, `indexOf('testID="add-reminder-preview"')` es mayor que
  `indexOf("t('addReminder.alert')")` y menor que
  `indexOf('testID="add-reminder-submit"')`;
- add-reminder no contiene `uppercase` ni `tracking-widest`.

**AND** los radios nuevos solo en reminders: `rounded-14` 1 vez, `rounded-16`
3, `rounded-22` 1, y ninguno en otro fichero de `src/` fuera de los tests.

**AND** si H0 encuentra un `it` de #173, #174 o #175 que inventaríe qué
ficheros usan `text-11`, `text-13`, `text-26`, `rounded-tile`,
`tracking-title` o `font-extrabold`, se añaden a esa lista los ficheros de
#178 que ahora los usan (delta en §Deltas).

**Test** (`src/__tests__/design-drift.test.ts`,
`describe('#178 R13: Recordatorios sin deriva')`, calcado de `#167 R14`):
un `it` por viñeta; el de iconos extrae el `import { … } from 'reicon-react-native'`
de cada fichero, compara la lista ordenada y comprueba que el `from` aparece
una vez; el de radios recorre `src/` con el mismo listado de ficheros que
usa `#62 R4`.

### R14 — Prueba de humo humana (dev build de Android)

**WHEN** el humano abre Recordatorios y Nuevo recordatorio en el **dev build
de Android** (no Expo Go), con una mascota que tenga al menos un
recordatorio próximo (≤ 10 días), uno lejano y uno enviado o cancelado,
**THE SYSTEM SHALL** verse como los artboards, en claro y en oscuro:

- Recordatorios: margen 20, título 26/900 con tracking negativo a la
  izquierda y «Nuevo» compacto con `+` a la derecha; cabecera nativa sin
  título; píldoras de radio 16 (la de semana en ámbar); filas de radio 22
  con mosaico de 46 px e icono de línea del color del tipo, «2 ene, 09:00 ·
  en 3 días», badge «¡Próximo!» que aparece con un pop y borde ámbar en la
  próxima; las filas entran escalonadas;
- sheet de borrado con círculo rosa y papelera, texto centrado;
- vacío con «Nuevo» que abre el formulario;
- Nuevo recordatorio: título 24/900, etiquetas en frase (no mayúsculas),
  chips de 38 px con su pastel y el seleccionado en acento con labio; campos
  de 52 px con icono; hora como «09:00» en Hermes; vista previa
  «Te aviso el … a las …» que cambia al cambiar el aviso;
- con «Reducir movimiento» del sistema, filas y badge sin animación.

Se firma en su casilla propia:

- [ ] Prueba de humo #178 R14 firmada por: ____ — fecha: ____

Si Hermes no formatea `hourCycle: 'h23'` como en Node, el leader enmienda R6,
R11 y R12 antes de cerrar.

## Texto de la enmienda de la carta

Idéntico al de #175 (`specs/mobile-docs-canvas-fidelity/requirements.md`
§Texto de la enmienda R2): la primera de #174, #175 o #178 que mergee lo
escribe (S3). Si S3 da 0, se añade literal al final de
`docs/ui-guidelines.md`, con una línea en blanco antes del encabezado:

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

Toda cifra agregada se escribe como **base H0 + delta**, con `#178 Rn` en el
comentario. Si un `it` que no está en esta lista se pone rojo por un cambio
de R4 a R13, **Codex para** y el leader enmienda la spec.

### `src/screens/reminders/index.test.tsx`

- **Dobles nuevos a nivel de fichero**: reicon (patrón de
  `src/screens/register/index.test.tsx`, `...actual` + `mockIcon(testID)`)
  para `Plus`, `Trash`, `Syringe`, `Drop`, `Pill`, `Stethoscope`, `Weight`,
  `ForkKnife` y `PinTack`, con testID `reminders-icon-<kebab-case>`
  (`pin-tack`, `fork-knife`); y `../home/home-entrance` (R7).
- `R5` (marco, `contentContainerStyle`):
  `{ padding: 24, gap: 16, paddingBottom: 48 }` →
  `{ paddingHorizontal: 20, paddingTop: 24, gap: 14, paddingBottom: 48 }`.
- `#114 R5` (B29): `expect(actions.props.className).toBe('flex-row justify-end');`
  → `toBe('flex-row items-center gap-2')`; las dos
  `expect(screen.queryByText(es['reminders.reminders'])).toBeNull();` →
  `expect(screen.getByTestId('reminders-title')).toHaveTextContent(es['reminders.reminders']);`.
  El `describe` pasa a `'#114 R5 (revertido por #178 R4): el título vive en el contenido'`.
- `R6` (lista): `upcoming.getByText('💉')` →
  `upcoming.getByTestId('reminders-icon-syringe')`; la fecha
  `new Date(reminders[2].dueAt).toLocaleDateString('es-MX')` → la cadena
  `` `${due.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })}, ${due.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })}` ``
  con `const due = new Date(reminders[2].dueAt)` (ese `it` no fija zona; los
  literales viven en `#178 R6`).
- `#65 R15` (B26): `expect(formatDate).toHaveBeenCalledWith('es-MX');` →
  `expect(formatDate).toHaveBeenCalledWith('es-MX', { day: 'numeric', month: 'short' });`.
- `#64 R7`: `vaccineRow.getByText('💉').parent` →
  `vaccineRow.getByTestId('reminder-tile-vaccine')`;
  `medicationRow.getByText('💊').parent` →
  `medicationRow.getByTestId('reminder-tile-medication')`; los
  `getByText('💉')`/`getByText('💊')` visibles → `getByTestId('reminders-icon-syringe')`
  y `getByTestId('reminders-icon-pill')`. Las aserciones de clase se quedan.
- `#127 R3`: las tres `className` de píldora
  (`'flex-1 items-center gap-1 rounded-xl bg-accent-soft p-3'` 1 vez,
  `'flex-1 items-center gap-1 rounded-xl bg-default p-3'` 2 veces) → las de
  R5 (`bg-category-amber` literal en la de semana). Si ese `it` asevera
  número o etiqueta, pasan a las de R5.
- `#155 R6` (B27): el `it('no duplica la acción de crear'` se borra (lo
  sustituye `#178 R9`). Recuento de `it`: base H0 (B24: 27) − 1 + los de
  #178 que `tasks.md` añade.
- Listas de hijos de `screen-reminders` (`#155 R6`, `'queda en el sitio del
  vacío que sustituye'`): sin cambio previsto (el título vive dentro de
  `reminders-actions`). Si alguna recibe `'reminders-pills'` donde esperaba
  `'View'`, ese literal cambia con comentario `#178 R5`.

### `src/screens/add-reminder/index.test.tsx`

- **Dobles nuevos a nivel de fichero**: reicon para `Calendar`, `Clock` y
  `Bell`, con testID `add-reminder-icon-<kebab-case>`.
- `#95 R6`: `{ padding: 24, gap: 16, paddingBottom: 48 }` →
  `{ paddingHorizontal: 20, paddingTop: 24, gap: 16, paddingBottom: 48 }`.
- `getByText('💉 Vacuna')` → `getByText('Vacuna')`; `getByText('📌 Otro')` →
  `getByText('Otro')`.
- `screen.getByText(selectedDate.toLocaleDateString('es-MX'))` →
  `screen.getByText('15 sep 2026')`; el `toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })`
  → `screen.getByText('14:45')`. Si H0 encuentra otra fecha u hora en esos
  fixtures, el literal es el que dé el formato de R11 sobre ella.
- `#95 R5`: `expect(screen.queryByText(es['addReminder.addReminder'])).toBeNull();`
  → `expect(screen.getByTestId('add-reminder-title')).toHaveTextContent(es['addReminder.addReminder']);`;
  el `it` pasa a `'retira el botón; el título vive en el cuerpo (#178 R10)'`.
- `#123 R4`: las etiquetas `'24/9/2026'`, `'1/10/2026'` y `'1/1/2027'` →
  `'24 sep 2026'`, `'1 oct 2026'` y `'1 ene 2027'`.
- B28: `CHIP_SELECTED` →
  `'h-9.5 items-center justify-center rounded-full px-3.5 bg-accent border-b-3 border-black/25'`;
  `CHIP_IDLE` → `'h-9.5 items-center justify-center rounded-full px-3.5 bg-default'`.

### `src/__tests__/consistency-classnames.test.ts`

- `#120 R1` (radios de las píldoras de Recordatorios): `rounded-xl` →
  `rounded-16` en las aserciones de `pill-*`.
- B11: `[join('screens', 'reminders', 'index.tsx'), 4],` →
  `[join('screens', 'reminders', 'index.tsx'), 4 + 1], // #178 R6 fila sin Card`;
  `[join('screens', 'add-reminder', 'index.tsx'), 3],` →
  `[join('screens', 'add-reminder', 'index.tsx'), 3 + 1], // #178 R12 vista previa`.
- B10 (`CONTINUOUS_CORNER` global): base H0 `+ 2` (`// #178 R6, R12`).
- B10 (`bg-accent-soft`, las dos líneas `16 + 2 + 1 - 1); // #147 R4`): base
  H0 `- 3` (`// #178 R5, R10, R12`).
- B13: `expect(reminders.match(/bg-accent-soft/g)).toHaveLength(1);` →
  `expect(reminders.match(/bg-accent-soft/g)).toBeNull(); // #178 R5`.
- B12, `'no deja la receta del labio fuera de un primario'`:
  `count(/\bborder-b-4\b/g)` sin cambio (el «Nuevo» ya lo llevaba);
  `count(/border-black\/25/g)` base H0 `+ 1`, con
  `// #178 R10: el chip seleccionado lleva labio (carta §13)`. La pantalla
  escribe la clase del chip seleccionado **una sola vez**, en una constante
  de módulo que usan los chips de tipo y de aviso.

### Otros

- `src/utils/__tests__/category-palette.test.ts`: R6 (`toEqual` con `Icon`,
  `it` renombrado; B25: 7 `emoji: '` → 0).
- `src/app/__tests__/layout.test.tsx` (B19): las dos filas → `''` (R4, R10).
- `src/app/_layout.tsx` (B18): las dos opciones → `title: ''`.
- `catalog.ts`, `language-provider.test.tsx`, `specs/mobile-ui-language/design.md`:
  R3. `ui-copy-table.ts` y `ui-language.test.ts`: tabla de R3, fila a fila
  en R4, R6, R9, R10 y R12.
- `global-css.test.ts`, `design-drift.test.ts`: `describe` nuevos (R1, R2,
  R13), sin cambiar los existentes salvo la regla de inventarios de R13.

---

## Fuera de alcance

Delimitaciones (no son features pendientes):

- **Cuerpo de los botones de acción** (`add-reminder-submit`,
  `reminders-delete-confirm`, `reminders-delete-cancel`, `reminders-retry`,
  acción de `EmptyState`, `reminder-delete-<id>`): lo decide #177 (§#177).
- **Chevron de volver del artboard**: lo pinta la cabecera nativa.
- **Esqueleto de carga** (`reminder-row-skeleton-*`, `rounded-card`): sigue
  con `#62 R2`; ningún artboard lo dibuja.
- **`PetSwitcher`**: lo rediseña #168; aquí no se toca ni se mueve.
- **Agrupación por día** (D-G): ningún artboard la dibuja (P12).
- **Cromo del sheet** (radio 28 de las esquinas, asa): lo pinta
  `@expo/ui` (P17).
- **CTA fijo al pie** en Nuevo recordatorio: el submit sigue en el flujo del
  formulario (P14).
- **Estados de error** de las dos pantallas: sin artboard; conservan su
  maquetación.
- **Lista de recordatorios de Inicio** (`reminders-item-*`): fuera; solo
  comparte `REMINDER_TYPE_META.category`, que no cambia.
- **Modo oscuro**: sale de los tokens; no hay artboard oscuro.
- **Copy de Pingo** en estas pantallas: el vacío conserva el suyo.
- **Tiempos de animación**: los de `HomeEntrance` y `PopIn` (P16).

---

## Preguntas abiertas

Cada una lleva el valor por defecto que esta spec implementa. El humano puede
cambiarlo al firmar; si lo hace, el leader enmienda antes del handoff.

| P | Pregunta | Por defecto en esta spec |
|---|---|---|
| P1 | D-RAD: ¿radios 14/16/22 del artboard como tokens, o los de la escala (12/20)? | tokens `rounded-14/16/22` (directiva «píxel exacto»), enmendando §12 (R1, R2) |
| P2 | D-L: ¿labio en el chip seleccionado? | sí, `border-b-3 border-black/25` como el artboard, con viñeta propia en §13 (R2.7) |
| P3 | D-C: el artboard pinta badge y borde de la fila próxima en ámbar crudo, el labio del «Nuevo» de 3 px y el círculo del sheet en rojo crudo | tokens `warning-soft`/`warning-strong` (#61 R5), labio 4 de la receta primaria (§13), `bg-category-rose` + `danger` |
| P4 | D-SH: ¿sombra en la fila? | sin sombra: la fila es un `View`, no un `Card` (R6) |
| P5 | D-F: ¿borde de foco solo en el título de Nuevo recordatorio o en los seis `TextInput`? | solo en `title-input` (R11); los otros cinco quedan como están |
| P6 | D-R1: el artboard no dibuja el botón de borrar por fila | se queda, sin cambio (carta §Dirección de arte 5) |
| P7 | D-R2: ¿CTA «Nuevo» en el vacío? | sí; revierte `#155 R6` `'no duplica la acción de crear'` (R9) |
| P8 | D-K1: texto de la vista previa (canvas «Te avisaremos el 5 oct a las 09:00») | voz B: «Te aviso el {{date}} a las {{time}}.» (R3) |
| P9 | D-K: `reminders.dueAt` = «{{date}}, {{time}}» en los dos idiomas | así (R3) |
| P10 | Choque de token: S1/S2 con otro valor | H0 para y el leader enmienda |
| P11 | #177 sin mergear: CTA de 56/16 y etiqueta 17/800 del artboard | desviación nombrada; #178 no toca cuerpos de botón |
| P12 | D-G: agrupación por día | fuera |
| P13 | El artboard del sheet no muestra la línea de referencia (título del recordatorio) | se conserva `reminders-delete-reference` (información útil) |
| P14 | ¿CTA de Nuevo recordatorio fijo al pie como el artboard? | no; sigue en el flujo |
| P15 | Glifo y trazo de reicon frente al dibujo del artboard | glifo de la tabla de R6 con el trazo por defecto de reicon; el humo (R14) lo valida |
| P16 | Tiempos de entrada y del pop | los tokens de movimiento de `HomeEntrance` y `PopIn` |
| P17 | Radio 28 y asa del sheet | los de `@expo/ui` |
| P18 | Hora en 24 h («09:00») en es y en | `hourCycle: 'h23'` en los dos idiomas |
| P19 | Proporción fecha/hora del artboard | `flex-3`/`flex-2`; si uniwind no compila `flex-3`, el humo lo ve y el leader enmienda |
| P20 | Tests de pantalla en inglés | ninguno nuevo; el formato `en` queda en la tabla de §Convenciones |

## Aprobación

- [ ] Aprobado por humano (fecha: ____)
