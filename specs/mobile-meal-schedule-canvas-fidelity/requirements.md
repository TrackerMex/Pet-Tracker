---
feature: "mobile-meal-schedule-canvas-fidelity"
status: approved
tags: [mobile, ui, spec]
---

# #179 mobile-meal-schedule-canvas-fidelity — Requisitos

> Lleva Horario (`src/screens/meal-schedule/index.tsx`, ruta delgada
> `src/app/meal-schedule.tsx`) e Historial (`src/screens/meals-history/index.tsx`,
> ruta delgada `src/app/meals-history.tsx`) a sus artboards del canvas aprobado
> (https://claude.ai/artifact/VqaQQsRTtis9Dbttqy3z7j, fila 3, ficheros
> `project/HorarioComidas.dc.html` y `project/HistorialComidas.dc.html`,
> versión `1791926163-9993`), **píxel exacto**. Rutas relativas a
> `mobile-pet-tracker/` salvo las que empiezan por `docs/`, `specs/` o
> `progress/`, que son relativas a la raíz del repo.
>
> **Base congelada**: worktree `feature/179-mobile-meal-schedule-canvas-fidelity`
> en `fb5b209f` (= `origin/main` `788d1f89` + commits de harness; el código
> móvil es idéntico a `788d1f89`).
>
> **Dependencia dura: #173** (`mobile-tab-screens-canvas-fidelity`, rama en
> `f3b0a4a8`, firmada y sin implementar). La implementación arranca **solo tras
> mergear #173**, que trae `--font-extrabold`, `--text-13`, `--text-26`,
> `--radius-tile`, la decisión de sombra de `Card` (D5) y la línea
> «Tamaños de letra fuera de la escala de Tailwind» de la carta (D8). #179 no
> los vuelve a declarar. El paso H0 de `tasks.md` comprueba cada uno con su
> `grep -cF` (§Dependencias) y vuelve a medir toda la tabla de base.
>
> **Hermanas**: #175 (Documentos, firmada, `0e2b91cf`) y #178 (Recordatorios,
> en revisión, `5e790ab3`) comparten tokens y la enmienda de la carta. Las
> piezas que cualquiera de las tres puede dejar en `main` antes que #179 van
> en la tabla «0 o 1» (S1–S11): mismo nombre para el mismo valor, nunca
> duplicadas. #174 (Alertas, `954de067`) comparte `--tracking-title` y trae
> `--tracking-caps: 0.06em`.
>
> Rige `docs/ui-guidelines.md` (C8 de `CHECKPOINTS.md`). La brecha y las
> decisiones abiertas de origen están en
> `progress/explore_mobile-routine-canvas-fidelity.md` §2.3, §2.4, §4 y §6
> (base `68da75ab`); cada hecho que esta spec usa se volvió a medir en
> `fb5b209f` (§Base medida).

## Decisiones del humano (no se reabren)

Literales del 2026-10-13, relatadas por el leader (chat de sites-99):

| Decisión | Respuesta literal | Qué fija en esta spec |
|---|---|---|
| Reparto | «Tres features (Recomendado)» | #175 = Documentos; #178 = Recordatorios + Nuevo recordatorio; **#179 = Horario + Historial** |
| D-H cabecera | «Título en contenido (Recomendado)» | título 24/900 dentro de la pantalla y cabecera nativa con `title: ''` en `meal-schedule` y `meals-history` (R4, R9); la micro-regla de títulos de la carta la enmienda la primera feature que mergee (R2, S9) |
| D-I iconos | «Iconos reicon (Recomendado)» | `reicon-react-native` en el mosaico de la fila (`Clock`) y en «Generar plan» (`Sparkles`, R7); las dos pantallas no tienen emoji a la base (B43) |
| Fidelidad | «Píxel exacto, igual que #174 (Recomendado)» y, relatada por Backend, «el diseño final debe de quedar como el artifac» | margen lateral 20, gap 14, radios, alturas y tamaños de letra del artboard; tokens nuevos donde la escala no llega (R1); cada candado revertido se nombra en §Deltas de candados |

Regla de mezcla (encargo del leader, 2026-10-13): un token que #173, #174,
#175 o #178 ya hayan dejado en `main` **con el mismo valor** se reutiliza y no
se redeclara; si existe **con otro valor**, H0 para (§Dependencias, P12).

## Convenciones de esta spec

- **`\|` en las tablas** es el escape de Markdown de `|`: al ejecutar un
  grep de una tabla se escribe `|` (con `grep -E`, `\|` casa un `|`
  literal y el recuento sale 0).
- **Comentarios de trazabilidad** en tests y código: siempre `#179 Rn`, nunca
  `#179` suelto (el `HEX_LITERAL` de `src/__tests__/design-drift.test.ts` lo
  casa sin R-id). Los `describe` nuevos empiezan por `#179 Rn:`.
- **Literales, no símbolos**: los tests nuevos aseveran texto y clases
  literales (`'656'`, `'/ día'`, `'text-22 font-black text-accent-foreground'`,
  `'bg-category-violet'`). Nunca aseveran contra un símbolo importado de
  producción (`CATEGORY_SLOTS`, `TOUCH_SLOP`, `CONTINUOUS_CORNER`, ni `es[...]`
  para las claves nuevas). Las aserciones heredadas que ya leen `es[...]` se
  quedan salvo las que §Deltas cambia.
- **RNTL 14**: siempre `await fireEvent.press(...)` y `await act(...)`. Un
  `fireEvent` sin `await` deja el `act` abierto y contamina el `it` siguiente.
- **Nodos ocultos a accesibilidad**: ningún nodo que esta spec crea lleva
  `accessibilityElementsHidden` ni `importantForAccessibility` (B55: 0 en MS
  y MH a la base). Si la implementación necesitara ocultar uno (el punto, el
  espaciador, un icono), toda consulta `getBy`/`queryBy` de ese nodo lleva
  `{ includeHiddenElements: true }`, porque si no un `queryBy… null` sale
  verde sin mirar. Además, cada `queryBy… null` de esta spec va en el mismo
  render que un `getBy` de un hermano o del padre que sí existe.
- **Dobles de icono con tamaño**: los dobles de `reicon-react-native` de MST
  y MHT pasan a pintar `size` además de `color`, como el doble de
  `src/screens/profile/index.test.tsx` (`<View {...{ size }} testID=… style={{ color }} />`,
  tipado `{ color?: string; size?: number }`). Lo hace T0, con todos los
  `it` vivos en verde; R6, R7 y R10 aseveran `size` con `toHaveProp('size', n)`.
- **Contar por hijos, no por testID** (Enmienda #70 de la carta): cada
  candado de composición asevera `node.children.length` y el orden de hijos de
  los `View`/`Text` de RN que esta spec crea. Los `Button` de heroui no se
  cuentan por hijos (envuelven en nodos internos): se consultan con
  `within(...)` y su `className`/`Button.Label` se ancla en el fuente (R13).
- **Selectores por prefijo vivos**: `/^meal-row-/`, `/^meal-pending-/` y
  `/^meal-served-/` en `src/app/(tabs)/__tests__/food.test.tsx`. Ningún testID
  nuevo empieza por `meal-row-`, `meal-pending-` ni `meal-served-`. Los
  `/meals-history/` y `/meal-schedule/` de
  `src/components/__tests__/empty-state.test.tsx` son rutas de fichero, no
  testIDs, y sus filas (`meals-history-empty`, `meals-history-detail-empty`,
  `nutrition-profile-empty`, `meal-schedule-empty`, todas `Text`) siguen
  verdes sin tocar: esta spec no cambia el tipo de esos cuatro nodos.
- **testIDs nuevos** (B42 = 0 a la base): `meal-schedule-heading`,
  `meal-schedule-summary-entry`, `meal-time-entry-<i>`, `meal-schedule-actions`,
  `nutrition-profile-pills`, `nutrition-profile-activity`,
  `nutrition-profile-condition`, `nutrition-profile-food`,
  `meals-history-heading`, `meals-history-calendar-entry`,
  `meals-history-calendar`, `meals-history-detail-entry`,
  `meals-history-detail-times`, `meals-history-spacer`. `meals-history-title`
  ya es el título del mes y no se reutiliza para el título de pantalla.
- **Clases**: sin corchetes (regla 3; design-drift escanea también los
  tests). Sin `text-accent` ni `text-warning` sueltos (#61 R4, #61 R5). Sin
  `rounded-(2xl|lg|md|sm)` (#62 R4). Ninguna clase
  `bg-category-*`/`text-category-*` escrita en las pantallas: salen de
  `CATEGORY_SLOTS` (#64 R9); los tests sí las escriben literales. Cada clase
  prescrita se cruzó con legibility-classnames, design-drift y
  consistency-classnames a la base. `size-10.5`, `size-1.25`, `h-12.5`,
  `h-9`, `px-3.5`, `py-1.5`, `px-2.5`, `p-2.5`, `p-3.5`, `gap-1.5`, `gap-2.5`,
  `gap-3.5`, `gap-0.5` y `min-w-20` son espaciado de la escala (spike de #173:
  uniwind compila el fraccionario). `border-b-5` y `border-b-6` son anchos
  sueltos de Tailwind v4 (spike de #173; `border-b-6` ya vive en `main`, B24).
- **Altura de línea**: ningún artboard fija `line-height` (B48). Esta spec no
  prescribe `leading-*`.
- **Tracking en `em`**: toda clase `tracking-title` o `tracking-caps` va con
  una clase `text-*` en el mismo `Text` (uniwind multiplica el `em` por el
  tamaño de ese elemento).
- **Agregados compartidos**: ningún recuento se congela. Cada uno se da como
  comando + valor a la base + delta; H0 mide la base real y la cifra que se
  escribe es **base H0 + delta** (§Deltas). Anclas como `grep -cF` con salida
  esperada, nunca números de línea.
- **Fechas de fixture**: las de Historial cruzan mes **y** año (diciembre de
  2025 → enero de 2026, ya en el fichero de test). En Historial, «hoy» lo
  da la respuesta de la API (`today: '2026-01-15'` del fixture de MHT) con el
  reloj falso del fichero (`jest.useFakeTimers({ now: Date.UTC(2026, 0, 15, 12) })`),
  y las celdas se comparan como cadenas `YYYY-MM-DD`: no dependen de la zona.
  Si un `it` nuevo formatea una hora con `Date`, fija la zona con
  `const hostProcess = process.getBuiltinModule('process');` y
  `hostProcess.env.TZ = 'America/Mexico_City'` en `beforeAll`, restaurándola
  en `afterAll`, como ya hace `src/screens/meal-schedule/index.test.tsx`.
  `process.env.TZ` a secas no cambia `Date` en jest.
- **Entrada escalonada**: `HomeEntrance` (`src/screens/home/home-entrance.tsx`)
  se dobla en los dos ficheros de test con el doble de
  `src/screens/login/index.test.tsx` (un `jest.fn` que registra props y pinta
  un `View` con esas props), y se asevera por `index` y `testID`, nunca por
  estilo animado. Reduce motion lo resuelve `HomeEntrance` con
  `useReducedMotion` (candado en `src/screens/home/home-entrance.test.tsx`);
  esta spec no lo reimplementa ni lo vuelve a probar.

## Base medida (`fb5b209f`)

Comandos desde `mobile-pet-tracker/`. Abreviaturas: **MS** =
`src/screens/meal-schedule/index.tsx`, **MST** = su `index.test.tsx`,
**MH** = `src/screens/meals-history/index.tsx`, **MHT** = su `index.test.tsx`,
**CC** = `src/__tests__/consistency-classnames.test.ts`, **DD** =
`src/__tests__/design-drift.test.ts`, **LG** =
`src/__tests__/legibility-classnames.test.ts`, **UC** =
`src/__tests__/ui-copy-table.ts`, **LY** = `src/app/_layout.tsx`, **LYT** =
`src/app/__tests__/layout.test.tsx`, **MG** = `src/utils/month-grid.ts`,
**MGT** = `src/utils/__tests__/month-grid.test.ts`. Sin otra indicación, el
comando es `grep -cF '<ancla>' <fichero>`. «Declarado» es lo que esta spec
afirma; «medido» es la salida en `fb5b209f`. Las dos columnas coinciden en
todas las filas.

| Id | Ancla | Fichero | Declarado | Medido |
|---|---|---|---|---|
| B1 | `title: t('mealSchedule.mealSchedule')` | LY | 1 | 1 |
| B2 | `title: t('mealsHistory.mealsHistory')` | LY | 1 | 1 |
| B3 | `['meal-schedule', 't:mealSchedule.mealSchedule'],` | LYT | 1 | 1 |
| B4 | `title: 't:mealsHistory.mealsHistory'` | LYT | 1 | 1 |
| B5 | `{ file: 'src/app/_layout.tsx', key: 'mealSchedule.mealSchedule' }, // #95 R4` | UC | 1 | 1 |
| B6 | `{ file: 'src/app/_layout.tsx', key: 'mealsHistory.mealsHistory' }, // #105 R5` | UC | 1 | 1 |
| B7 | `grep -cE "key: 'mealSchedule\.(dailyGrams\|mealsPerDay)' \}"` | UC | 2 | 2 |
| B8 | `expect(R6_FOOD).toHaveLength(35 + 3 + 1 - 2 + 1 + 3 + 9 + 11 + 2 + 1);` | `src/__tests__/ui-language.test.ts` | 1 | 1 |
| B9 | `+ 7, // #170 R1` (último término de `englishKeys`) | `src/providers/__tests__/language-provider.test.tsx` | 1 | 1 |
| B10 | `grep -cE "'mealSchedule\.(dailyGrams\|mealsPerDay)'"` | `src/i18n/catalog.ts` | 4 | 4 |
| B11 | `grep -cE "'mealSchedule\.(perDay\|mealsPerDayUnit\|activity\|condition\|food)'"` | `src/i18n/catalog.ts` | 0 | 0 |
| B12 | `[join('screens', 'meal-schedule', 'index.tsx'), 1],` (`directUses` de `CONTINUOUS_CORNER`) | CC | 1 | 1 |
| B13 | `[join('screens', 'meals-history', 'index.tsx'),` (solo la fila de `TABULAR_NUMS`, `, 2], // #105 R11`) | CC | 1 | 1 |
| B14 | `toBe(31 + 1 + 4 + 1); // #41 R9` (recuento global de `CONTINUOUS_CORNER`) | CC | 1 | 1 |
| B15 | `toBe(33 + 1 + 1 - 1 - 1 + 1 + 1 - 1 + 4 + 1); // #41 R9` (suma de `directUses`) | CC | 1 | 1 |
| B16 | `toBe(13 + 1 + 1 + 1 + 1 + 1 + 1); // #146 R8` (`rounded-xl bg-accent`) | CC | 1 | 1 |
| B17 | `16 + 2 + 1 - 1); // #147 R4` (`bg-accent-soft`, dos sitios) | CC | 2 | 2 |
| B18 | `[join('screens', 'meal-schedule', 'index.tsx')]: 1,` (#166 R2) | CC | 1 | 1 |
| B19 | `'inventaría los diecinueve primarios con labio, fichero a fichero'` | CC | 1 | 1 |
| B20 | `expect(count(/\bborder-b-4\b/g)).toBe(19);` | CC | 1 | 1 |
| B21 | `expect(count(/border-black\/25/g)).toBe(19);` | CC | 1 | 1 |
| B22 | `return neutral ? [tag.match(/testID="([^"]+)"/)?.[1]] : [];` (#166 R3) | CC | 1 | 1 |
| B23 | `expect(count(/border-lip-gray/g)).toBe(4 + 1); // #170 R16` | CC | 1 | 1 |
| B24 | `expect(count(/\bborder-b-6\b/g)).toBe(4 + 1); // #170 R16` | CC | 1 | 1 |
| B25 | `'meals-history', // #105 R15` (lista «importa el Card compartido») | DD | 1 | 1 |
| B26 | `className="text-xs font-semibold uppercase tracking-widest text-accent-foreground"` | LG | 1 | 1 |
| B27 | `join('screens', 'meal-schedule', 'index.tsx'),` (#61 R3) | LG | 1 | 1 |
| B28 | `weekday: 'short'` | MG | 1 | 1 |
| B29 | `weekday: 'short'` | MGT | 1 | 1 |
| B30 | `weekday: 'short'` | MHT | 1 | 1 |
| B31 | `{ padding: 24, gap: 16, paddingBottom: 48 }` | MST | 1 | 1 |
| B32 | `{ padding: 24, gap: 16, paddingBottom: 48 }` | MHT | 1 | 1 |
| B33 | `expect(screen.queryByText(es['mealSchedule.mealSchedule'])).toBeNull();` (#95 R5) | MST | 1 | 1 |
| B34 | `'text-base font-bold text-foreground'` | MST | 1 | 1 |
| B35 | `source.match(/bg-accent-soft/g)` | MHT | 1 | 1 |
| B36 | `grep -cE '^\s*it[.(]'` | MST | 39 | 39 |
| B37 | `grep -cE '^\s*it[.(]'` | MHT | 26 | 26 |
| B38 | `grep -cE '^\s*it[.(]'` | MGT | 8 | 8 |
| B39 | `ForkKnife` | MS | 2 | 2 |
| B40 | `grep -cE 'Sparkles\|CATEGORY_SLOTS\|HomeEntrance\|TOUCH_SLOP'` | MS | 0 | 0 |
| B41 | `grep -cE 'CONTINUOUS_CORNER\|HomeEntrance\|TOUCH_SLOP\|<Card'` | MH | 1 (`<Card`) | 1 |
| B42 | `grep -rlE '<cada testID nuevo de §Convenciones>' src \| wc -l` | `src` | 0 | 0 |
| B43 | `grep -cP '\p{Extended_Pictographic}'` | MS y MH | 0 y 0 | 0 y 0 |
| B44 | `<Text key={day} className="flex-1 text-center text-xs font-normal text-muted">{day}</Text>` | MH | 1 | 1 |
| B45 | `variant="accent"` | MS | 1 | 1 |
| B46 | `'350 kcal / 100 g'` | MST | 1 | 1 |
| B47 | `grep -cE "getByText\('(656 kcal\|2 comidas / día\|187 g / día)'\)"` | MST | 3 | 3 |
| B48 | `grep -c 'line-height'` en `HorarioComidas.dc.html` y `HistorialComidas.dc.html` del canvas | canvas | 0 y 0 | 0 y 0 |
| B49 | `- Títulos de pantalla: header del stack cuando exista, no Text suelto.` | `../docs/ui-guidelines.md` | 1 | 1 |
| B50 | `la superficie siempre acompaña a un emoji y a un texto.` | `../docs/ui-guidelines.md` | 1 | 1 |
| B51 | `touch target ≥ 44pt` | `../docs/ui-guidelines.md` | 1 | 1 |
| B52 | `export const TOUCH_SLOP` | `src/theme/touch-target.ts` | 1 | 1 |
| B53 | `Sparkles` | `'src/app/(tabs)/food.tsx'` | 2 | 2 |
| B54 | `grep -cE -- '--(text-(15\|17\|22)\|radius-(10\|14\|24)\|tracking-[a-z]+):'` | `src/theme/global.css` | 0 | 0 |
| B55 | `grep -cE 'accessibilityElementsHidden\|importantForAccessibility'` | MS y MH | 0 y 0 | 0 y 0 |

Hechos de fuente que la spec usa (verificados en `fb5b209f`):

- Horario importa `{ Clock, ForkKnife }` de `reicon-react-native` y `Card` de
  `@/components/card`; `useThemeColors(['accent-strong', 'accent-foreground'])`.
  El selector de hora (`<Host matchContents>` con `meal-time-picker`) está
  **fuera** de `meal-times-section`, entre la sección y `meal-schedule-empty`.
- El botón «Generar plan» es
  `Button testID="generate-plan-button" className="rounded-xl bg-accent border-b-4 border-black/25"`
  dentro de un `View className="gap-2"` que lleva antes `generate-plan-error`.
- `NutritionProfile.bodyCondition` es `number | null`. Los fixtures de
  `MST` son `activityLevel: 'medium', bodyCondition: 5, foodType: 'dry',
  kcalPer100g: 350` (perfil) y `merKcal 656, dailyGrams 187, mealsPerDay 2`
  (plan).
- `DayCell` de Historial es un `Pressable` con
  ``testID={`meals-history-day-${date}`}``, `accessibilityLabel` largo y
  `style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}`; el número de
  hoy lleva `meals-history-today` y el punto `meals-history-dot`.
- `heroui-native` `Button` tipa sus props como
  `Omit<PressableFeedbackProps, 'animation'> & …`
  (`node_modules/heroui-native/lib/typescript/src/components/button/button.types.d.ts`),
  así que acepta `hitSlop` en tipos; que lo reenvíe al `Pressable` nativo lo
  comprueba el humo (R14, P9).
- El último bloque del registro de copy es
  `### §2.26 — Añadidos por #170 — Alertas agrupadas y mini-mapa` en
  `specs/mobile-ui-language/design.md`.

## Dependencias (H0, sobre `main` con #173 mergeada)

Comandos desde `mobile-pet-tracker/`, salvo D6 a D9, que van desde la raíz.
Si alguno no da el valor esperado, **H0 para** y el leader enmienda esta spec
antes de seguir.

| Id | Comando | Esperado | Lo usa |
|---|---|---|---|
| D1 | `grep -cF -- "--font-extrabold: 'Inter-ExtraBold';" src/theme/global.css` | 1 | R5, R6, R7, R8, R10, R12 (peso 800) |
| D2 | `grep -cF -- '--text-13: 13px;' src/theme/global.css` | 1 | R6 (gramos y «Editar») |
| D3 | `grep -cF -- '--radius-card: 20px;' src/theme/global.css` | 1 | R6 (fila = `Card`, radio 20) |
| D4 | `grep -cF -- '--radius-tile: 18px;' src/theme/global.css` | 1 | punto de inserción de R1 si faltan radios |
| D5 | `grep -cE -- '--text-(17\|22):' src/theme/global.css` | 0 | R1 (tokens propios de #179) |
| D6 | `grep -cF '**Excepción nombrada (fidelidad al canvas, 2026-10-13)**' docs/conventions.md` | 1 | R4, R9 (margen 20) |
| D7 | `grep -cF '**Excepción nombrada (fidelidad al canvas, 2026-10-13)**' docs/ui-guidelines.md` | 1 | R4, R9 (margen 20) |
| D8 | `grep -cF 'Tamaños de letra fuera de la escala de Tailwind' docs/ui-guidelines.md` | 1 | R2.4 (lista que se extiende) |
| D9 | `git log origin/main --oneline -E --grep='cierra #177 \|#177 R[0-9]' \| wc -l` | 0 | §#177 |
| D10 | `grep -cF 'variant="flat"' src/screens/profile/index.tsx` | 2 | R6 (variante plana de `Card`, D5 de #173) |
| D11 | `grep -cF "'flat'" src/components/card.tsx` | ≥ 1 | R6 (la variante existe) |

**Piezas compartidas «0 o 1»** (las declara la primera de #174, #175, #178 o
#179 que mergee; las demás las reutilizan). H0 las mide y anota el valor;
ninguno de los dos resultados para:

| Id | Comando (desde `mobile-pet-tracker/`) | Si da 0 | Si da 1 |
|---|---|---|---|
| S1 | `grep -cF -- '--text-15: 15px;' src/theme/global.css` | R1 la declara | R1 la reutiliza |
| S2 | `grep -cF -- '--radius-10: 10px;' src/theme/global.css` | R1 la declara | R1 la reutiliza |
| S3 | `grep -cF -- '--radius-14: 14px;' src/theme/global.css` | R1 la declara | R1 la reutiliza |
| S4 | `grep -cF -- '--radius-24: 24px;' src/theme/global.css` | R1 la declara | R1 la reutiliza |
| S5 | `grep -cF -- '--tracking-title: -0.02em;' src/theme/global.css` | R1 la declara | R1 la reutiliza |
| S6 | `grep -cF -- '--tracking-caps: 0.06em;' src/theme/global.css` | R1 la declara | R1 la reutiliza |
| S7 | `grep -cF '## Enmienda de fidelidad al canvas (2026-10-13)' ../docs/ui-guidelines.md` | R2.1 la escribe con el texto de §Texto de la enmienda | R2.1 no la toca; el test se escribe contra el texto que hay |
| S8 | `grep -cF 'Tracking fuera de la escala de Tailwind' ../docs/ui-guidelines.md` | R2.5 crea la línea | R2.5 añade a su lista lo que falte |
| S9 | `grep -cF -- '- Títulos de pantalla: header del stack cuando exista, no Text suelto.' ../docs/ui-guidelines.md` | R2.2 ya está hecha (otra feature la sustituyó) | R2.2 la sustituye |
| S10 | `grep -cF 'la superficie siempre acompaña a un emoji y a un texto.' ../docs/ui-guidelines.md` | R2.3 ya está hecha | R2.3 la sustituye |
| S11 | `grep -cF 'Fuera de la escala, por fidelidad al canvas (#' ../docs/ui-guidelines.md` | R2.6 escribe su línea como última de la regla 12 | R2.6 escribe su línea justo después de la última línea que casa |

Si un token de S1 a S6 existe con **otro** valor
(`grep -cE -- '--(text-15|radius-(10|14|24)|tracking-(title|caps)):' src/theme/global.css`
mayor que S1 + S2 + S3 + S4 + S5 + S6), H0 para (P12). Si S7 da 1 y su texto
difiere del de §Texto de la enmienda, H0 para y el leader enmienda.

### #177 (CTA con cuerpo 56/16)

#177 lleva la receta global del CTA chunky (alto 56, radio 16, labio
`--lip`) y no tiene rama en remoto a la base. #179 sí toca cuerpos de botón:
«Editar» (R6), «Añadir comida» y «Generar plan» (R7). Ninguno de los tres es
CTA primario: «Editar» y «Añadir» son secundarios neutros con labio gris
(`border-lip-gray`, receta que ya vive en `main` por #170 R16, B23/B24) y
«Generar plan» pasa de primario con labio a tonal violeta sin labio
(D-C, P3).

- **Caso B (D9 = 0, #177 no está en `main`)**: se implementa esta spec tal
  cual. Caras de 36 y 50 del artboard más su labio (`h-9.75` y `h-13.5`, P2) y radios 10 y 14.
- **Caso A (D9 ≥ 1)**: H0 para. El leader cruza los literales de R6 y R7
  (clases de «Editar», «Añadir comida» y «Generar plan»), el inventario de
  primarios con labio de #166 R2 (B18 a B21) y el de secundarios neutros de
  #166 R3 (B22) con lo que #177 dejó en `main`, y enmienda la spec antes de
  seguir. Si #177 convierte en receta compartida el secundario neutro, R6 y R7
  la heredan en lugar de sus clases sueltas.

## Requisitos

Catorce R-id (límite del encargo: 14; sin partición). Orden de tareas en
`tasks.md`: R1 → R2 → R3 → R4 → … → R13, y R14 (humo) al final.

### R1 — Tokens del artboard en `@theme`

**WHEN** se compila el tema, **THE SYSTEM SHALL** declarar en el bloque
`@theme {` de `src/theme/global.css`, una sola vez cada uno, estos tokens:

| Token | Valor | Dónde va | Uso (artboard) |
|---|---|---|---|
| `--text-15` | `15px` | **S1**: si da 0, tras la última línea `--text-<n>: <n>px;` del bloque; si da 1, no se toca | etiquetas de acción, números del calendario, horas del panel |
| `--text-17` | `17px` | justo después de `--text-15: 15px;` | h2 «Horarios y porciones» y título del perfil |
| `--text-22` | `22px` | justo después de `--text-17: 17px;` | valores del resumen |
| `--radius-10` | `10px` | **S2**: si da 0, tras la última línea `--radius-<x>: <v>;` del bloque; si da 1, no se toca | «Editar» |
| `--radius-14` | `14px` | **S3**: ídem, tras la última `--radius-*` (después de `--radius-10` si R1 la acaba de escribir) | mosaico de la fila, botones de acción, horas del panel |
| `--radius-24` | `24px` | **S4**: ídem, tras la última `--radius-*` | resumen, calendario y panel del día |
| `--tracking-title` | `-0.02em` | **S5**: si da 0, tras la última línea `--tracking-*` del bloque o, si no hay ninguna, tras la última `--radius-*`; si da 1, no se toca | títulos de las dos pantallas |
| `--tracking-caps` | `0.06em` | **S6**: si da 0, justo después de `--tracking-title: -0.02em;`; si da 1, no se toca | eyebrow «Objetivo diario» |

Sin `--text-*--line-height`: los artboards no fijan altura de línea (B48).

**Reutiliza** sin redeclarar: `--font-extrabold` (D1), `--text-13` (D2),
`--radius-card` (D3), `font-black` (900), `font-bold` (700),
`font-semibold` (600), `font-medium` (500), `text-xs` (12), `text-base` (16),
`text-lg` (18), `text-2xl` (24), `rounded-xl` (12) y `rounded-full`.

**Test** (`src/theme/__tests__/global-css.test.ts`,
`describe('#179 R1: tokens de Horario e Historial')`):

- `parseVariables(extractTheme())` hace `toMatchObject` con
  `{ 'text-13': '13px', 'text-15': '15px', 'text-17': '17px', 'text-22': '22px', 'radius-card': '20px', 'radius-10': '10px', 'radius-14': '14px', 'radius-24': '24px', 'tracking-title': '-0.02em', 'tracking-caps': '0.06em' }`;
- `extractTheme().match(/--text-15:/g)` tiene longitud 1, y lo mismo para
  `--text-17:`, `--text-22:`, `--radius-10:`, `--radius-14:`, `--radius-24:`,
  `--tracking-title:` y `--tracking-caps:`.

Rojo garantizado aunque S1 a S6 den 1: D5 = 0 (`--text-17` y `--text-22` no
existen en ningún caso).

### R2 — Enmienda de la carta

**WHEN** se lee `docs/ui-guidelines.md`, **THE SYSTEM SHALL** contener:

1. **Sección** (S7): si S7 da 0, al final del fichero, una sola vez, la
   sección literal de §Texto de la enmienda de la carta. Si da 1, no se toca.
2. **Micro-regla de títulos** (S9): si S9 da 1, la línea
   `- Títulos de pantalla: header del stack cuando exista, no Text suelto.`
   se sustituye por
   `` - Títulos de pantalla: título en contenido y cabecera nativa con `title: ''` (Enmienda de fidelidad al canvas). ``.
   Si da 0, no se toca.
3. **Frase de la paleta** (S10): si S10 da 1, la frase
   `la superficie siempre acompaña a un emoji y a un texto.` se sustituye por
   `la superficie siempre acompaña a un icono de reicon-react-native y a un texto.`.
   Si da 0, no se toca.
4. **Regla 2, tamaños** (D8): en la línea que empieza por
   `Tamaños de letra fuera de la escala de Tailwind`, se añaden al final de la
   lista (antes del `;` que la cierra), separados por `, `, los que falten de
   `` `--text-15: 15px` ``, `` `--text-17: 17px` `` y `` `--text-22: 22px` ``.
   No se crea otra línea.
5. **Regla 2, tracking** (S8): si S8 da 0, inmediatamente después de esa
   línea, una línea propia con el texto
   «Tracking fuera de la escala de Tailwind (fidelidad al canvas, #179): `--tracking-title: -0.02em`, `--tracking-caps: 0.06em`; la clase `tracking-*` va con una clase `text-*` en el mismo elemento, porque uniwind multiplica el `em` por su tamaño.».
   Si da 1, se añaden a su lista los que falten de
   `` `--tracking-title: -0.02em` `` y `` `--tracking-caps: 0.06em` ``.
6. **§12, radios fuera de escala** (S11): la frase
   «Fuera de la escala, por fidelidad al canvas (#179): `rounded-10` (10 px), «Editar» de la fila de Horario; `rounded-14` (14 px), mosaico de la fila y botones de acción de Horario y horas del panel del día de Historial; `rounded-24` (24 px), resumen de Horario y calendario y panel del día de Historial, que son `View` y no `Card` porque `twMerge` no sustituye `rounded-card` por un radio con nombre de valor.».
   Si S11 da 0, va como última línea de la regla `12. **Escala de radios**`
   (antes de `13. **Botón con cuerpo**`); si da 1, justo después de la última
   línea que casa. Cambio solo aditivo: las frases que aseveran `#62 R4` y
   `#166 R4` no se tocan.
7. **§13, secundarios de Horario**: inmediatamente antes de la viñeta que
   empieza por `    - **Sin labio**:`, una viñeta con la misma sangría:
   «    - **Secundarios de Horario** (fidelidad al canvas, #179): «Editar» `h-9.75 rounded-10 border-2 border-b-5 border-lip-gray bg-surface` y «Añadir comida» `h-13.5 rounded-14 border-2 border-b-6 border-lip-gray bg-surface`, con el labio dentro del alto; «Generar plan» es tonal de la categoría violeta y sin labio, porque el labio del artboard (`rgba(91,63,163,0.35)`) no tiene token.».

**Test** (`src/__tests__/design-drift.test.ts`,
`describe('#179 R2: enmienda de fidelidad al canvas en Horario e Historial')`;
lee `../docs/ui-guidelines.md` con `readFileSync` desde `process.cwd()`):

1. `## Enmienda de fidelidad al canvas (2026-10-13)` aparece exactamente una
   vez;
2. el texto que sigue al encabezado casa
   `/- \[[ xX]\] Enmienda de fidelidad al canvas aprobada por humano/`
   (casilla tolerante: firmarla no pone el test en rojo);
3. contiene las tres viñetas de §Texto de la enmienda, un `toContain` por
   viñeta completa;
4. no contiene ninguna de las dos frases sustituidas (B49, B50) y contiene
   cada frase nueva de los puntos 2 y 3 una sola vez;
5. la línea que empieza por `Tamaños de letra fuera de la escala de Tailwind`
   contiene `` `--text-15: 15px` ``, `` `--text-17: 17px` `` y
   `` `--text-22: 22px` ``;
6. la línea que empieza por `Tracking fuera de la escala de Tailwind`
   contiene `` `--tracking-title: -0.02em` `` y `` `--tracking-caps: 0.06em` ``;
7. el tramo entre `12. **Escala de radios**` y `13. **Botón con cuerpo**`
   (por `indexOf`) contiene `` `rounded-10` (10 px) ``,
   `` `rounded-14` (14 px) `` y `` `rounded-24` (24 px) ``, y la frase del
   punto 6 una sola vez;
8. el tramo desde `13. **Botón con cuerpo**` contiene la viñeta del punto 7
   una sola vez, y su `indexOf` es menor que el de `- **Sin labio**:`.

Las líneas se buscan con `split('\n').find((l) => l.trimStart().startsWith(…))`.
Rojo garantizado: las aserciones 5 (`--text-17`), 7 y 8 son de #179 en
cualquier caso de S.

### R3 — Copy nuevo

**WHEN** se carga el catálogo, **THE SYSTEM SHALL** declarar en `en` y `es`
de `src/i18n/catalog.ts` exactamente estas cinco claves nuevas, cada una
justo después de `'mealSchedule.mealsPerDay'` en el orden de la tabla:

| Clave | `en` | `es` | Uso |
|---|---|---|---|
| `mealSchedule.perDay` | `/ day` | `/ día` | etiqueta bajo los gramos del resumen (R5) |
| `mealSchedule.mealsPerDayUnit` | `meals / day` | `comidas / día` | etiqueta bajo el número de comidas (R5) |
| `mealSchedule.activity` | `Activity` | `Actividad` | prefijo de píldora (R8) |
| `mealSchedule.condition` | `Condition` | `Condición` | prefijo de píldora (R8) |
| `mealSchedule.food` | `Food` | `Alimento` | prefijo de píldora (R8) |

«kcal» (resumen) y «g» (sufijo de gramos) se pintan como literales técnicos
sin clave, igual que hoy `{kcalPer100g} kcal / 100 g` (B46). Los títulos
siguen siendo `mealSchedule.mealSchedule` y `mealsHistory.mealsHistory`
(«Horario de comidas» y «Historial de comidas»): sin cambio de copy.

**AND** registrarlas en `specs/mobile-ui-language/design.md`:

- en una sección nueva `### §2.<N> — Añadidos por #179 — Horario e Historial del canvas`,
  donde N es la última §2.x que mida H0 más uno (a la base, 27);
- una fila por clave, con el formato
  `| — | \`<clave>\` | \`<en>\` | \`<es>\` | ← añadida por #179 (R3) |`.

**AND** en `src/providers/__tests__/language-provider.test.tsx`, sumar
`+ 5, // #179 R3` a la fórmula de `englishKeys` como última línea; el término
que era el último (a la base `+ 7, // #170 R1`, B9) pierde su coma final.

**AND** el inventario de usos (`src/__tests__/ui-copy-table.ts`, bloque
`R6_FOOD`, y su longitud en `src/__tests__/ui-language.test.ts`, B8) cambia
**en el R-id que crea o quita la llamada**, no en R3, para que
`checkUses(R6_FOOD)` no se ponga rojo antes de que exista el nodo:

| R-id | Fila | Longitud |
|---|---|---|
| R4 | `{ file: 'src/app/_layout.tsx', key: 'mealSchedule.mealSchedule' }, // #95 R4` → `{ file: 'src/screens/meal-schedule/index.tsx', key: 'mealSchedule.mealSchedule' }, // #179 R4` | sin cambio |
| R5 | las dos filas de B7 (`dailyGrams`, `mealsPerDay`) → `{ file: 'src/screens/meal-schedule/index.tsx', key: 'mealSchedule.perDay' }, // #179 R5` y `{ file: 'src/screens/meal-schedule/index.tsx', key: 'mealSchedule.mealsPerDayUnit' }, // #179 R5` | sin cambio |
| R8 | nuevas, una por clave: `activity`, `condition`, `food`, cada una `{ file: 'src/screens/meal-schedule/index.tsx', key: 'mealSchedule.<clave>' }, // #179 R8` | `+ 3` |
| R9 | `{ file: 'src/app/_layout.tsx', key: 'mealsHistory.mealsHistory' }, // #105 R5` → `{ file: 'src/screens/meals-history/index.tsx', key: 'mealsHistory.mealsHistory' }, // #179 R9` | sin cambio |

El `+ 3` se añade a la fórmula medida en H0 (a la base B8) como `+ 3` final.
Si la fila de B6 no está en `R6_FOOD` sino en otro bloque, se mueve dentro de
su bloque, sin cambio de longitud.

**AND** en R5, al quitar las dos únicas llamadas de `mealSchedule.dailyGrams`
y `mealSchedule.mealsPerDay` (las de MS; B10 = 4 son sus dos idiomas), borrar
esas dos claves de `en` y `es` del catálogo, sumar `- 2, // #179 R5` como
última línea de `englishKeys` (el `+ 5, // #179 R3` pierde su coma final) y
marcar sus dos filas del registro con `← retirada por #179 (R5)`.

**Test** (`src/providers/__tests__/language-provider.test.tsx`,
`describe('#179 R3: claves de Horario e Historial del canvas')`, calcado de
`#170 R1`):

- los cinco triples `[clave, en, es]` escritos literales;
- por cada triple, `english[key]` y `spanish[key]` con `toBe`;
- el registro casa con esta regex:

  ```ts
  new RegExp('\\| — \\| `' + escapeRegExp(key) + '`[^\\n]*← añadida por #179 \\(R3\\)')
  ```

### R4 — Horario: marco y título en contenido

1. **WHEN** la pantalla de Horario renderiza, **THE SYSTEM SHALL** dar al
   `ScrollView` `contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 24, gap: 14, paddingBottom: insets.bottom + 24 }}`
   (margen 20 de D6/D7, gap 14 del artboard) y al `View` interno
   (el que lleva `meal-schedule-loading` mientras carga) `className="gap-3.5"`.
2. **WHEN** la pantalla renderiza en cualquier estado (cargando, error, plan
   cargado, sin plan), **THE SYSTEM SHALL** pintar como primer hijo del
   contenedor del `ScrollView`, antes del `View` interno,
   `<Text testID="meal-schedule-heading" accessibilityRole="header" className="text-2xl font-black tracking-title text-foreground">`
   con `t('mealSchedule.mealSchedule')`.
3. **WHEN** el stack monta la ruta `meal-schedule`, **THE SYSTEM SHALL**
   declarar en `src/app/_layout.tsx` `title: ''` (B1 pasa de 1 a 0).

**Tests** (`MST`, `describe('#179 R4: marco y título en contenido')`; y LYT):

- un `it` por estado (cargando, error, plan cargado, `not-found`): 
  `getByTestId('meal-schedule-heading')` tiene texto `'Horario de comidas'`,
  `accessibilityRole` `'header'` y `className` literal del punto 2;
- en el estado cargado, `getAllByText('Horario de comidas')` tiene longitud 1;
- el `it` del contenedor (B31) asevera
  `{ paddingHorizontal: 20, paddingTop: 24, gap: 14, paddingBottom: 48 }`;
- en LYT, la fila `['meal-schedule', 't:mealSchedule.mealSchedule'],` pasa a
  `['meal-schedule', ''],`.

Sonda: devolver el título a la cabecera (`title: t(...)` y sin `Text`) pone
rojo el `getByTestId` (lanza) del primer `it`; dejar `padding: 24` pone rojo
el `toEqual` del contenedor.

### R5 — Horario: resumen (hero)

**WHEN** hay plan cargado, **THE SYSTEM SHALL** sustituir el
`Card variant="accent"` de `meal-schedule-summary` por:

```
<HomeEntrance testID="meal-schedule-summary-entry" index={0}>
  <View testID="meal-schedule-summary"
        className="gap-2 rounded-24 bg-accent border-b-5 border-black/25 p-4"
        style={CONTINUOUS_CORNER}>
    eyebrow · fila de tres columnas
  </View>
</HomeEntrance>
```

- **Hijos de `meal-schedule-summary`** (exactamente 2, en este orden):
  1. eyebrow `<Text className="text-xs font-extrabold uppercase tracking-caps text-accent-foreground">`
     con `t('mealSchedule.dailyTarget')` (clave existente, sin cambio);
  2. `<View className="flex-row gap-2">` con exactamente 3 hijos
     `<View className="flex-1">`, cada uno con exactamente 2 `Text`:
     valor `className="text-22 font-black text-accent-foreground"` y
     etiqueta `className="text-xs font-normal text-accent-foreground"`.
- **Columnas** (valor · etiqueta), en este orden:
  1. `{merKcal}` · `kcal`;
  2. `` {`${dailyGrams} g`} `` · `t('mealSchedule.perDay')`;
  3. `{mealsPerDay}` · `t('mealSchedule.mealsPerDayUnit')`.
- Sin `ForkKnife` (B39 pasa de 2 a 0) ni import de `Card` para el resumen.
  Sin opacidad: el artboard pinta eyebrow y etiquetas a `.85`, que #61 R3
  prohíbe sobre `bg-accent` (P3).
- Se quitan las llamadas a `mealSchedule.dailyGrams` y
  `mealSchedule.mealsPerDay` y sus claves (R3, último AND).

**Tests** (`MST`, `describe('#179 R5: resumen del artboard')`; fixture del
plan: `merKcal 656, dailyGrams 187, mealsPerDay 2`):

- `summary.children` tiene longitud 2; `summary.children[1].children` tiene
  longitud 3; cada columna tiene 2 hijos;
- textos por columna, con `within(columna).getByText`: `'656'` y `'kcal'`;
  `'187 g'` y `'/ día'`; `'2'` y `'comidas / día'`;
- `className` literal del `View` y de los dos tipos de `Text`;
  `summary` tiene `style` con `borderCurve: 'continuous'`;
- `mockHomeEntrance` recibió una llamada con `testID: 'meal-schedule-summary-entry'`
  e `index: 0`;
- un `it` con un segundo plan (`merKcal 1200, dailyGrams 300, mealsPerDay 3`)
  pinta `'1200'`, `'300 g'` y `'3'` (dos fixtures: los valores no están
  escritos en el fuente);
- `queryByText('656 kcal')`, `queryByText('187 g / día')` y
  `queryByText('2 comidas / día')` son `null` **en el mismo render en que
  `'656'` es visible** (no tautológico).

Sonda: devolver `Card variant="accent"` pone rojo el `toHaveProp('className', …)`
del resumen; dejar el texto antiguo pone rojo el `getByText('/ día')` (lanza).

### R6 — Horario: filas de horario

**WHEN** hay plan cargado con N horas, **THE SYSTEM SHALL** pintar
`meal-times-section` con `className="gap-3.5"` y como hijos, en este orden:

1. el h2 `<Text className="mt-1 text-17 font-extrabold text-foreground">` con
   `t('mealSchedule.timesAndPortions')` (sin testID; sustituye a la etiqueta
   `text-xs font-semibold uppercase tracking-widest text-muted`);
2. por cada hora, en orden,
   `<HomeEntrance key={mealTime} testID={`meal-time-entry-${index}`} index={index + 1}>`
   que envuelve
   `<Card testID={`meal-time-row-${index}`} variant="flat" className="flex-row items-center gap-3 py-3">`;
3. `meal-time-error` cuando lo haya (sin cambio).

Cada fila tiene exactamente estos hijos, en orden:

| # | Nodo | Clases | Contenido |
|---|---|---|---|
| 1 | `View` mosaico | ``className={`size-10.5 items-center justify-center rounded-14 ${CATEGORY_SLOTS.amber.surface}`}`` y `style={CONTINUOUS_CORNER}` | `<Clock size={20} color={amberStrong} />` |
| 2 | `View className="flex-1"` | — | hora `Text className="text-lg font-black text-foreground"` y gramos `Text className="text-13 font-semibold text-muted"` (textos sin cambio) |
| 3 | «Editar», solo si `isOwner` | `Button variant="secondary" size="sm" isDisabled={editing} hitSlop={TOUCH_SLOP} className="h-9.75 rounded-10 border-2 border-b-5 border-lip-gray bg-surface px-3.5"` con `testID={`meal-time-edit-${index}`}` y el mismo `onPress` | `<Button.Label className="text-13 font-extrabold text-foreground">` con `t('mealSchedule.editTime')` (clave sin cambio) |

- `useThemeColors(['accent-strong', 'accent-foreground'])` pasa a
  `useThemeColors(['category-amber-strong', 'category-violet-strong'])`,
  desestructurado como `[amberStrong, violetStrong]`.
- `CATEGORY_SLOTS` se importa de `../../utils/category-palette`, `TOUCH_SLOP`
  de `../../theme/touch-target` y `HomeEntrance` de `../home/home-entrance`.
- La fila es `Card variant="flat"` (D5 de #173): `twMerge` sustituye su
  `py-1` por `py-3` (padding 12/14 del artboard) y conserva
  `rounded-card border border-border bg-surface px-3.5`, sin sombra (P4).

**Tests** (`MST`, `describe('#179 R6: filas del artboard')`; fixture con dos
horas, dueño y familiar):

- `section.children`: h2, `meal-time-entry-0`, `meal-time-entry-1`
  (y `add-meal-time-button` hasta R7; §Deltas); el h2 tiene texto
  `'Horarios y porciones'` y `className` literal;
- por fila, `row.children` tiene longitud 3 (dueño) o 2 (familiar), con el
  orden de la tabla; `className` de la fila contiene, separados por espacio,
  `rounded-card`, `border`, `border-border`, `bg-surface`, `px-3.5`,
  `flex-row`, `items-center`, `gap-3` y `py-3`, y no contiene `py-1`;
- mosaico: `className` literal `'size-10.5 items-center justify-center rounded-14 bg-category-amber'`
  y `style` con `borderCurve: 'continuous'`; el doble de `Clock` recibió
  `size: 20`;
- hora y gramos con `className` literal;
- «Editar»: `getByTestId('meal-time-edit-0')` tiene `className` literal y
  `hitSlop` `{ top: 6, bottom: 6, left: 6, right: 6 }`; su etiqueta
  `getByText('Editar')` tiene `className` literal;
- familiar: `queryByTestId('meal-time-edit-0')` es `null` y en el mismo
  render `getByTestId('meal-time-row-0')` existe;
- `mockHomeEntrance` recibió `{ testID: 'meal-time-entry-0', index: 1 }` y
  `{ testID: 'meal-time-entry-1', index: 2 }`.

Sonda: `rounded-xl` en el mosaico pone rojo su `toHaveProp('className', …)`;
quitar `hitSlop` pone rojo el `toHaveProp('hitSlop', …)` de «Editar».

### R7 — Horario: acciones «Añadir comida» y «Generar plan»

**WHEN** hay plan cargado o no encontrado, **THE SYSTEM SHALL** pintar,
dentro del `View className="gap-2"` que hoy contiene `generate-plan-error` y
el botón, tras `generate-plan-error`,
`<View testID="meal-schedule-actions" className="flex-row gap-2.5">` con:

1. **«Añadir comida»**, solo si `isOwner && loadedPlan !== null` (se mueve
   fuera de `meal-times-section`; misma condición y mismo `onPress`):
   `Button testID="add-meal-time-button" variant="secondary" isDisabled={editing} className="h-13.5 flex-1 rounded-14 border-2 border-b-6 border-lip-gray bg-surface"`
   con `<Button.Label className="text-15 font-extrabold text-foreground">` y
   `t('mealSchedule.addMeal')` (clave sin cambio);
2. **«Generar plan»**, cuando `canGenerate` (sin cambio de condición ni de
   `onPress`):
   `Button testID="generate-plan-button" variant="tertiary" isDisabled={submitting}`
   con ``className={`h-12.5 flex-1 gap-1.5 rounded-14 ${CATEGORY_SLOTS.violet.surface}`}``,
   hijos `<Sparkles size={16} color={violetStrong} />` y
   ``<Button.Label className={`text-15 font-extrabold ${CATEGORY_SLOTS.violet.ink}`}>``
   con el texto actual. Sin `border-b-4` ni `border-black/25` (P3).

Con un solo botón (familiar, o dueño sin plan), ese botón ocupa todo el ancho
(`flex-1`; P8). «Añadir» lleva el labio dentro de su alto (54 = 50 + 4) y
«Generar» mide 50 sin labio: las dos caras miden 50 y arrancan arriba.

**Tests** (`MST`, `describe('#179 R7: acciones del artboard')`), un `it` por
combinación:

| Combinación | `actions` contiene |
|---|---|
| dueño, plan cargado | `add-meal-time-button` y `generate-plan-button`, en ese orden |
| familiar, plan cargado | solo `generate-plan-button` |
| dueño, plan `not-found` | solo `generate-plan-button` |

- `within(actions).getByTestId(...)` para cada presente y
  `queryByTestId` `null` para el ausente **en el mismo render** en que el
  presente existe; `add-meal-time-button` ya no está dentro de
  `meal-times-section` (`within(section).queryByTestId(...)` `null` con la
  sección presente);
- `className` literal de los dos botones y de sus etiquetas (las de
  «Generar» con `bg-category-violet` y `text-category-violet-strong`
  escritos literales);
- el doble de `Sparkles` recibió `size: 16`;
- `generate-plan-error`, cuando se fuerza el error, es hermano anterior de
  `meal-schedule-actions`.

El doble de `reicon-react-native` de `MST` añade `Sparkles` y quita
`ForkKnife` en esta tarea.

Sonda: devolver «Añadir» a la sección pone rojo el `within(actions).getByTestId`
(lanza) del primer `it`.

### R8 — Horario: perfil nutricional

**WHEN** hay perfil, **THE SYSTEM SHALL** sustituir el `Card` de
`nutrition-profile-section` por
`<View testID="nutrition-profile-section" className="gap-2.5">` con, en orden:

1. `nutrition-profile-title`, con
   `className="mt-1 text-17 font-extrabold text-foreground"` (mismo texto);
2. `<View testID="nutrition-profile-pills" className="flex-row flex-wrap gap-1.5">`
   con estas píldoras `Text`, todas con
   `className="rounded-full bg-default px-2.5 py-1.5 text-xs font-bold text-foreground"`
   y un primer hijo `<Text className="text-muted">` con el prefijo y un
   espacio:

   | testID | Prefijo | Valor | Cuándo |
   |---|---|---|---|
   | `nutrition-profile-activity` | `` {`${t('mealSchedule.activity')} `} `` | `{activityLevel}` (crudo) | siempre |
   | `nutrition-profile-condition` | `` {`${t('mealSchedule.condition')} `} `` | `` {`${bodyCondition}/9`} `` | solo si `bodyCondition !== null` |
   | `nutrition-profile-food` | `` {`${t('mealSchedule.food')} `} `` | `` {`${foodType} ${kcalPer100g} kcal/100 g`} `` (crudo) | siempre |

3. `profile-allergies` y `profile-diseases` sin cambio (P11).

Sin píldora «Edad» (D-S1, P5).

**Tests** (`MST`, `describe('#179 R8: perfil en píldoras')`):

- con `bodyCondition: 5`: `pills.children` tiene longitud 3 en el orden de
  la tabla; cada píldora tiene `toHaveTextContent` exacto
  `'Actividad medium'`, `'Condición 5/9'` y `'Alimento dry 350 kcal/100 g'`,
  y su prefijo `className` `'text-muted'`;
- con `bodyCondition: null`: `pills.children` tiene longitud 2 y
  `queryByTestId('nutrition-profile-condition')` es `null` con `pills`
  presente;
- en inglés (`<LanguageProvider initial="en">` en lugar del `initial="es"` del helper de render): `'Activity medium'`,
  `'Condition 5/9'`, `'Food dry 350 kcal/100 g'`;
- `className` literal de sección, título y píldoras;
  `queryByText('350 kcal / 100 g')` es `null` con la píldora de alimento
  presente.

Sonda: pintar la píldora de condición siempre pone rojo el `toHaveLength(2)`
del fixture `null`.

### R9 — Historial: marco y título en contenido

1. **WHEN** la pantalla de Historial renderiza, **THE SYSTEM SHALL** dar al
   `ScrollView` `contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 24, gap: 14, paddingBottom: insets.bottom + 24 }}`.
2. **WHEN** renderiza en cualquier estado (cargando, error, mes cargado),
   **THE SYSTEM SHALL** pintar como primer hijo del contenedor, antes de
   `{content}`,
   `<Text testID="meals-history-heading" accessibilityRole="header" className="text-2xl font-black tracking-title text-foreground">`
   con `t('mealsHistory.mealsHistory')`.
3. **WHEN** el stack monta `meals-history`, **THE SYSTEM SHALL** declarar
   `title: ''` en `src/app/_layout.tsx` (B2 pasa de 1 a 0).

**Tests** (`MHT`, `describe('#179 R9: marco y título en contenido')`; y LYT):

- un `it` por estado (cargando, error, cargado): `meals-history-heading`
  con texto `'Historial de comidas'`, `accessibilityRole` `'header'` y
  `className` literal;
- el `it` del contenedor (B32) asevera
  `{ paddingHorizontal: 20, paddingTop: 24, gap: 14, paddingBottom: 48 }`;
- en LYT, `title: 't:mealsHistory.mealsHistory'` pasa a `title: ''`.

Sonda: igual que R4.

### R10 — Historial: calendario

**WHEN** el mes está cargado, **THE SYSTEM SHALL** sustituir el `Card` de
`{content}` por
`<HomeEntrance testID="meals-history-calendar-entry" index={0}>` que envuelve
`<View testID="meals-history-calendar" className="gap-2 rounded-24 border border-border bg-surface p-3.5" style={CONTINUOUS_CORNER}>`,
con hijos, en orden: cabecera, `meals-history-weekdays`, `meals-history-grid`
y, si el mes no tiene comidas, `meals-history-empty` (sin cambio). El detalle
del día **sale** del calendario (R12).

- **Flechas** `meals-history-prev` y `meals-history-next`: mismas props de
  accesibilidad, `onPress` y `disabled`, con
  `className="size-10 items-center justify-center rounded-xl bg-default"`,
  `hitSlop={TOUCH_SLOP}` y
  `style={({ pressed }) => ({ ...CONTINUOUS_CORNER, opacity: pressed ? 0.7 : 1 })}`;
  chevrones `size={18}`.
- **Título del mes** `meals-history-title`:
  `className="text-base font-extrabold text-foreground"` (texto sin cambio).
- **Días de la semana**: `weekdayHeaders` de `src/utils/month-grid.ts` pasa
  de `weekday: 'short'` a `weekday: 'narrow'` (B28); cada `Text` lleva
  `key={index}` (con `narrow`, «M» se repite en `es-MX` y «T» y «S» en `en-US`) y
  `className="flex-1 text-center text-xs font-bold text-muted"`.
- Sin import de `Card` en MH.

**Tests** (`MHT`, `describe('#179 R10: calendario del artboard')`; y MGT):

- sin día seleccionado (el estado inicial de MH es `null`): `calendar.children`
  tiene longitud 3 (con comidas en el mes) o 4 (mes vacío, último
  `meals-history-empty`): dos fixtures;
- `className` literal y `borderCurve: 'continuous'` del calendario;
  `mockHomeEntrance` recibió `{ testID: 'meals-history-calendar-entry', index: 0 }`;
- flechas: `className` literal, `hitSlop` `{ top: 6, bottom: 6, left: 6, right: 6 }`
  y el doble de chevrón recibió `size: 18`;
- `weekdays.children` tiene longitud 7 y sus textos son
  `['L', 'M', 'M', 'J', 'V', 'S', 'D']` en `es-MX` (ICU de Node medido a
  la base; igual que el artboard) y
  `['M', 'T', 'W', 'T', 'F', 'S', 'S']` en `en-US`, escritos literales;
- MGT: el `it` de B29 compara con
  `Array.from(...).toLocaleDateString(locale, { weekday: 'narrow', timeZone: 'UTC' })`
  y un `it` nuevo asevera los dos arrays literales de arriba.

Sonda: dejar `weekday: 'short'` pone rojo el `toEqual` literal de MGT.

### R11 — Historial: celdas del día

**WHEN** se pinta una celda, **THE SYSTEM SHALL** darle al `Pressable`
``className={`h-11 flex-1 items-center justify-center gap-0.5 rounded-full${selected ? ' bg-tab-pill' : ''}`}``
y **exactamente 2 hijos**: el número y, debajo,
`<View testID="meals-history-dot" className="size-1.25 rounded-full bg-accent" />`
si `mealTimes.length >= 1`, o
`<View testID="meals-history-spacer" className="size-1.25" />` si no.

Clase del número, por rama (la primera que aplique):

| Rama | Clase | testID |
|---|---|---|
| hoy (`date === today`) | `text-15 font-black text-accent-strong` | `meals-history-today` |
| seleccionado | `text-15 font-black text-accent-strong` | — |
| futuro (`date > today`) | `text-15 font-medium text-muted` | — |
| pasado | `text-15 font-semibold text-foreground` | — |

**Tests** (`MHT`, `describe('#179 R11: celdas del artboard')`; «hoy» es el
`today: '2026-01-15'` del fixture con el reloj falso del fichero; el fixture
de cada `it` fija qué días tienen comidas, de modo que «hoy con comidas» y
«hoy sin comidas» son dos fixtures; la fila de diciembre de 2025 se alcanza
con `await fireEvent.press(prev)`). Un `it` por rama y por combinación:

| Celda | Número | Segundo hijo | Fondo |
|---|---|---|---|
| hoy, con comidas | hoy | punto | sin `bg-tab-pill` |
| hoy, sin comidas | hoy | espaciador | sin `bg-tab-pill` |
| pasado con comidas, seleccionado | seleccionado | punto | `bg-tab-pill` |
| pasado sin comidas, seleccionado | seleccionado | espaciador | `bg-tab-pill` |
| pasado con comidas, no seleccionado | pasado | punto | sin `bg-tab-pill` |
| pasado sin comidas | pasado | espaciador | sin `bg-tab-pill` |
| futuro | futuro | espaciador | sin `bg-tab-pill` |
| día de diciembre de 2025 con comidas | pasado | punto | sin `bg-tab-pill` |

- cada celda: `children` longitud 2, `className` literal del `Pressable` y
  del número; el segundo hijo por `toHaveProp('testID', …)`;
- la selección se hace con `await fireEvent.press(...)`.

Sonda: quitar el espaciador pone rojo el `toHaveLength(2)` de la fila
«pasado sin comidas»; usar `bg-accent-soft` pone rojo el `className` literal
de la fila seleccionada.

### R12 — Historial: panel del día

**WHEN** hay día seleccionado, **THE SYSTEM SHALL** pintar, después del
calendario y fuera de él,
`<HomeEntrance testID="meals-history-detail-entry" index={1}>` que envuelve
`<View testID="meals-history-detail" className="gap-2.5 rounded-24 bg-surface-secondary p-4" style={CONTINUOUS_CORNER}>`
con, en orden:

1. cabecera `<View className="flex-row items-center justify-between gap-2">`
   con `meals-history-detail-title`
   (`className="flex-1 text-base font-extrabold text-foreground"`, texto sin
   cambio) y, si el día tiene comidas, el badge `meals-history-detail-count`
   (`className="rounded-full bg-accent px-2.5 py-1 text-xs font-extrabold text-accent-foreground"`,
   texto sin cambio: `'2 comidas servidas'`, `'1 comida servida'`);
2. si el día tiene comidas,
   `<View testID="meals-history-detail-times" className="flex-row flex-wrap gap-2">`
   con una caja por hora,
   `<View className="min-w-20 flex-1 items-center rounded-14 bg-surface p-2.5" style={CONTINUOUS_CORNER}>`,
   que contiene `meals-history-detail-time`
   (`className="text-15 font-extrabold text-foreground"`, `style={TABULAR_NUMS}`);
   si no, `meals-history-detail-empty` (sin cambio).

**Tests** (`MHT`, `describe('#179 R12: panel del día')`):

- `detail` no está dentro de `meals-history-calendar`
  (`within(calendar).queryByTestId('meals-history-detail')` `null` con
  `detail` presente);
- con 2 comidas: `detail.children` longitud 2; cabecera con 2 hijos;
  `times.children` longitud 2 y cada caja con 1 hijo; `className` literales;
  `borderCurve: 'continuous'` en el panel y en cada caja;
- con 0 comidas: cabecera con 1 hijo, segundo hijo `meals-history-detail-empty`;
- con 5 comidas: `times.children` longitud 5 (`flex-wrap` con mínimo 80);
- `mockHomeEntrance` recibió `{ testID: 'meals-history-detail-entry', index: 1 }`.

Sonda: dejar el detalle dentro del calendario pone rojo el `within(...)` `null`.

### R13 — Candados de deriva

**WHEN** se leen los fuentes, **THE SYSTEM SHALL** cumplir
(`src/__tests__/design-drift.test.ts`,
`describe('#179 R13: Horario e Historial fieles al canvas')`, con
`readSource` de MS y MH):

1. ningún emoji (`/\p{Extended_Pictographic}/u` sin coincidencias en los dos);
2. el import de `reicon-react-native` es exactamente `{ Clock, Sparkles }` en
   MS y `{ ChevronLeft, ChevronRight }` en MH;
3. ni hex, ni corchetes, ni `StyleSheet`, ni `shadow`/`elevation`, ni
   `rounded-(2xl|lg|md|sm)`, ni `text-accent` suelto en los dos;
4. MS importa `HomeEntrance`, `CATEGORY_SLOTS` y `TOUCH_SLOP`; MH importa
   `HomeEntrance`, `TOUCH_SLOP` y `CONTINUOUS_CORNER`;
5. `hitSlop={TOUCH_SLOP}` aparece 1 vez en MS y 2 en MH;
6. MH no contiene `<Card` ni `components/card`; MS contiene `variant="flat"`
   una vez y no contiene `variant="accent"`;
7. MS contiene `uppercase` una vez y `tracking-widest` cero;
8. en MS, `indexOf('testID="generate-plan-error"')` <
   `indexOf('testID="meal-schedule-actions"')`, y
   `indexOf('testID="meal-schedule-heading"')` <
   `indexOf('testID="meal-schedule-summary"')`;
9. `filesMatching(/\btext-(17|22)\b/)` es exactamente
   `[join('screens', 'meal-schedule', 'index.tsx')]`;
10. recuentos por fichero: en MS, `rounded-24` 1, `rounded-14` 3 (mosaico, «Añadir», «Generar»),
    `rounded-10` 1; en MH, `rounded-24` 2, `rounded-14` 1;
11. el `Button.Label` de «Editar», «Añadir comida» y «Generar plan» se ancla
    en el fuente por su `className` (cada literal de R6 y R7, una vez).

Sonda: añadir `shadow-sm` a la fila pone rojo el punto 3.

### R14 — Prueba de humo humana (dev build de Android)

**WHEN** el humano abre las dos pantallas en un **dev build de Android** (no
Expo Go), en claro y en oscuro, **THE SYSTEM SHALL** mostrar, comparado con
los artboards:

1. Horario: título 24/900 en contenido y cabecera nativa sin título; resumen
   verde con labio y tres columnas; filas planas con mosaico ámbar y reloj;
   «Editar» gris con labio; «Añadir comida» y «Generar plan» lado a lado
   (dueño); píldoras de perfil sin «Edad».
2. Historial: título en contenido; calendario de radio 24 con flechas
   cuadradas; días con punto o hueco; día seleccionado en cápsula verde
   tenue; panel del día aparte con badge y horas en cajas.
3. Con «Quitar animaciones» activado en Android, las tarjetas aparecen sin
   desvanecido.
4. «Editar» y las flechas responden al toque en su borde (`hitSlop`, P9).

**Casilla propia**: `- [ ] Prueba de humo #179 R14 firmada por: ____ — fecha: ____`
en §Aprobación. El cierre de la feature la exige marcada.

## Texto de la enmienda de la carta

Idéntico al de #175 (`specs/mobile-docs-canvas-fidelity/requirements.md`) y
al de #178 (`specs/mobile-routine-canvas-fidelity/requirements.md`): la
primera de #174, #175, #178 o #179 que mergee lo escribe (S7). Si S7 da 0,
#179 lo añade literal al final de `docs/ui-guidelines.md`, con una línea en
blanco antes del encabezado. Si S7 da 1 y el texto que hay difiere de este,
H0 para (§Dependencias).

```markdown
## Enmienda de fidelidad al canvas (2026-10-13)

Directiva del humano del 2026-10-13: «el diseño final debe de quedar como el artifact» (canvas aprobado, https://claude.ai/artifact/VqaQQsRTtis9Dbttqy3z7j). Rige para toda pantalla que una spec lleve al canvas; la spec de cada pantalla nombra sus valores y los candados que revierte.

- **Título en contenido (D-H).** El título de pantalla va dentro del contenido (eyebrow opcional y título); la cabecera nativa del stack queda con `title: ''` y solo aporta el botón de volver.
- **Iconos reicon (D-I).** Los iconos de la interfaz son componentes de `reicon-react-native` coloreados con un token vía `useThemeColors`; ningún emoji hace de icono. La superficie de categoría acompaña a un icono y a un texto.
- **Medidas del artboard.** Donde la escala no llega al valor del artboard se usa un token del `@theme` nombrado por su valor y listado en la regla 2 (tamaños y tracking) o en la regla 12 (radios); las clases con corchetes (regla 3) y los radios `2xl`, `lg`, `md` y `sm` (regla 12) siguen prohibidos, y las esquinas que no son cápsula siguen llevando `CONTINUOUS_CORNER`.

- [ ] Enmienda de fidelidad al canvas aprobada por humano (fecha: ____)
```

## Deltas de candados (valor viejo → nuevo)

Cada Δ cambia **en la tarea del R-id que lo indica**, no antes. Los
recuentos se escriben como **valor medido en H0 + delta**, con comentario
`// #179 Rn`; la tabla da el valor a la base entre paréntesis.

### `src/screens/meal-schedule/index.test.tsx` (MST)

| Δ | R | Candado | Viejo → nuevo |
|---|---|---|---|
| Δ1 | R4 | contenedor (B31) | `{ padding: 24, gap: 16, paddingBottom: 48 }` → `{ paddingHorizontal: 20, paddingTop: 24, gap: 14, paddingBottom: 48 }` |
| Δ2 | R4 | `#95 R5` (B33) | `expect(screen.queryByText(es['mealSchedule.mealSchedule'])).toBeNull();` → `expect(screen.getAllByText(es['mealSchedule.mealSchedule'])).toHaveLength(1);` (el `it` conserva `queryByTestId('meal-schedule-back')` `null`) |
| Δ3 | R5 | resumen (B47) | `getByText('656 kcal')`, `getByText('187 g / día')` y `getByText('2 comidas / día')` → `within(summary).getByText('656')`, `'187 g'` y `'comidas / día'` |
| Δ4 | R6 | `#147 R4` hijos de fila | dueño `[undefined, undefined, undefined, 'meal-time-edit-N']` → `[undefined, undefined, 'meal-time-edit-N']`; resto de roles y «sin detalle» `[undefined, undefined, undefined]` → `[undefined, undefined]` |
| Δ5 | R6 | todo `childTestIds(meal-times-section)` de MST (`#147 R4`, `#147 R8`) | `'meal-time-row-N'` → `'meal-time-entry-N'` |
| Δ6 | R6 | `#147 R4` clases de «Editar» | `['min-h-11', 'rounded-xl', 'bg-accent-soft']` → `['h-9.75', 'rounded-10', 'border-2', 'border-b-5', 'border-lip-gray', 'bg-surface']`; etiqueta `['font-semibold', 'text-accent-strong']` → `['text-13', 'font-extrabold', 'text-foreground']` |
| Δ7 | R7 | `#147 R4` y `#147 R8` | `'add-meal-time-button'` sale de las listas de `meal-times-section`; clases de «Añadir» `['rounded-xl', 'bg-accent-soft']` → `['h-13.5', 'rounded-14', 'border-2', 'border-b-6', 'border-lip-gray', 'bg-surface']`; etiqueta `['font-bold', 'text-accent-strong']` → `['text-15', 'font-extrabold', 'text-foreground']` |
| Δ8 | R7 | doble de `reicon-react-native` | quita `ForkKnife: icon('meal-schedule-icon-fork-knife')`; añade `Sparkles: icon('meal-schedule-icon-sparkles')` |
| Δ9 | R8 | `#62 R5` (B34) | `'text-base font-bold text-foreground'` → `'mt-1 text-17 font-extrabold text-foreground'` (P15) |
| Δ10 | R8 | píldoras (B46) | `'350 kcal / 100 g'` → `'Alimento dry 350 kcal/100 g'` por `toHaveTextContent` de `nutrition-profile-food`; las aserciones de `medium` y `dry` sueltos pasan a sus píldoras |

### `src/screens/meals-history/index.test.tsx` (MHT)

| Δ | R | Candado | Viejo → nuevo |
|---|---|---|---|
| Δ11 | R9 | contenedor (B32) | `{ padding: 24, gap: 16, paddingBottom: 48 }` → `{ paddingHorizontal: 20, paddingTop: 24, gap: 14, paddingBottom: 48 }` |
| Δ12 | R10 | días de la semana (B30) | `weekday: 'short'` → `weekday: 'narrow'` |
| Δ13 | R11 | `#105 R11` cápsula | `'h-11 flex-1 items-center justify-center rounded-full'` (+ `' bg-accent-soft'`) → `'h-11 flex-1 items-center justify-center gap-0.5 rounded-full'` (+ `' bg-tab-pill'`); `source.match(/bg-accent-soft/g)` (B35) → `source.match(/bg-tab-pill/g)` con longitud 1; número de hoy `'text-sm font-bold text-accent-strong'` → `'text-15 font-black text-accent-strong'`; los demás `text-sm font-semibold …` → la tabla de R11 |
| Δ14 | R11 | celdas sin comidas; `it` `keeps the agreed capsule colors and tabular source anchors` | `children` longitud 1 → 2 (espaciador); `opening('meals-history-dot')` `'h-1.5 w-1.5 rounded-full bg-accent'` → `'size-1.25 rounded-full bg-accent'` |

### Otros ficheros de test

| Δ | R | Fichero | Viejo → nuevo |
|---|---|---|---|
| Δ15 | R4 | LYT (B3) | `['meal-schedule', 't:mealSchedule.mealSchedule'],` → `['meal-schedule', ''],` |
| Δ16 | R9 | LYT (B4) | `title: 't:mealsHistory.mealsHistory'` → `title: ''` |
| Δ17 | R3, R4, R5, R8, R9 | UC y `ui-language.test.ts` (B5 a B8) | filas según la tabla de R3; longitud de `R6_FOOD` H0 `+ 3` en R8 |
| Δ18 | R3, R5 | `language-provider.test.tsx` (B9) | `+ 5, // #179 R3` en R3; `- 2, // #179 R5` en R5 |
| Δ19 | R10 | MGT (B29) | `weekday: 'short'` → `weekday: 'narrow'` |
| Δ20 | R5 | LG `#61 R3` (B26, B27) | el segundo `it.each(accentCards)` queda solo con `food.tsx`; un `it` nuevo `'#179 R5: Horario conserva sus etiquetas del resumen a opacidad plena'` exige en MS `className="text-xs font-extrabold uppercase tracking-caps text-accent-foreground"`, `className="text-22 font-black text-accent-foreground"` y `className="text-xs font-normal text-accent-foreground"`. El primer `it.each` (sin `opacity-70` ni `opacity-80`) no cambia |
| Δ21 | R10 | DD (B25) | `'meals-history', // #105 R15` sale de la lista «importa el Card compartido» |
| Δ22 | R6 | `src/__tests__/profile-canvas-fidelity.test.ts` (#173 R3.3) | recuento de `variant="flat"` en `src/` de producción: H0 `+ 1, // #179 R6` (a la base de #173, 2), y la lista de ficheros suma `screens/meal-schedule/index.tsx` |

### `src/__tests__/consistency-classnames.test.ts` (CC)

| Δ | R | Candado (ancla) | Viejo → nuevo |
|---|---|---|---|
| Δ23 | R5 | `directUses` MS (B12) | `1],` → `1 + 1], // #179 R5` |
| Δ24 | R5, R10, R12 | recuento global `style={CONTINUOUS_CORNER}` (B14) | H0 `+ 1` (R5) `+ 1` (R10) `+ 2` (R12) |
| Δ25 | R5, R10, R12 | suma de `directUses` (B15) | igual que Δ24 |
| Δ26 | R10, R12 | `directUses` MH | nueva fila `[join('screens', 'meals-history', 'index.tsx'), 1], // #179 R10` → `1 + 2], // #179 R12` |
| Δ27 | R5, R7 | `border-black/25` (B21) | `19` → `19 + 1` (R5, labio del resumen) → `19 + 1 - 1` (R7, «Generar» sin labio) |
| Δ28 | R7 | `border-b-4` (B20) | `19` → `19 - 1` |
| Δ29 | R7 | `#166 R2` inventario (B18, B19) | la fila `[join('screens', 'meal-schedule', 'index.tsx')]: 1,` sale; el título pasa del número de H0 al número de H0 menos uno, en letras (a la base, «diecinueve» → «dieciocho») |
| Δ30 | R7 | `rounded-xl bg-accent` (B16) | H0 `- 1, // #179 R7` |
| Δ31 | R6, R7 | `bg-accent-soft` (B17, dos sitios) | los dos sitios suman `sourceFiles()` entero (MH incluido, por eso el `#105 R11` del comentario): H0 `- 1, // #179 R6` (Editar) `- 1, // #179 R7` (Añadir) `- 1, // #179 R11` (celda seleccionada → `bg-tab-pill`). A la base, `16 + 2 + 1 - 1` → `16 + 2 + 1 - 1 - 1 - 1 - 1` (15). `reminders` 1 y `docs` `null` no cambian |
| Δ32 | R6 | `#166 R3` extracción (B22) | `tag.match(/testID="([^"]+)"/)?.[1]` → ``tag.match(/testID="([^"]+)"/)?.[1] ?? tag.match(/testID=\{`([^`$]+)\$\{/)?.[1]?.concat('*')``; la lista suma `'meal-time-edit-*'` |
| Δ33 | R7 | `#166 R3` lista | suma `'add-meal-time-button'`. Lista final a la base (ordenada, verificado con `node`): `['add-meal-time-button', 'alert-detail-view-map', 'docs-upload-cancel', 'forgot-resend', 'meal-time-edit-*', 'reminders-delete-cancel', 'welcome-have-account']` |
| Δ34 | R6, R7 | `border-lip-gray` (B23) | `4 + 1` → `4 + 1 + 1 + 1, // #179 R6, R7` |
| Δ35 | R7 | `border-b-6` (B24) | `4 + 1` → `4 + 1 + 1, // #179 R7` |

El `#166 R3` extrae el testID de la etiqueta de apertura del `Button`
(`part.split('<')[0]`). «Editar» lleva ``testID={`meal-time-edit-${index}`}``,
que la regex `testID="..."` no casa (devolvería `undefined` y la lista
saldría con un `undefined`): por eso Δ32 añade la segunda regex, que da el
prefijo estático más `*`.

## Fuera de alcance

Cada viñeta es una **delimitación** (no una feature pendiente) salvo que se
diga lo contrario:

- Traducir los enums crudos (`medium`, `dry`): carta §6, otra feature.
- Píldora «Edad»: sin dato en el perfil (P5). Si el humano elige (b) o (c),
  es una feature nueva.
- La receta global del CTA chunky de #177 (§#177).
- Esqueletos de carga de las dos pantallas: no cambian.
- El selector de hora (`@expo/ui`) y el flujo de edición: no cambian.
- Copy de errores, estados vacíos y etiquetas de accesibilidad: no cambian.
- Backend: ningún campo nuevo.

## Preguntas abiertas

Cada una lleva el valor por defecto que esta spec implementa. El humano puede
cambiarlo al firmar; si lo hace, el leader enmienda antes del handoff.

| P | Pregunta | Por defecto en esta spec |
|---|---|---|
| P1 | D-RAD: ¿radios 10/14/24 del artboard como tokens, o los de la escala? | tokens `rounded-10/14/24` (directiva «píxel exacto»), enmendando §12 (R1, R2.6) |
| P2 | D-L: ¿labio donde el artboard lo pinta? | sí: resumen `border-b-5 border-black/25`, «Editar» `border-2 border-b-5 border-lip-gray`, «Añadir» `border-2 border-b-6 border-lip-gray`; el alto incluye el labio (39 = 36 + 3 y 54 = 50 + 4), así la cara mide lo del artboard |
| P3 | D-C: colores sin token del artboard | labio `--lip` del resumen → `border-black/25` (labio primario de la carta); «Generar plan» tonal `bg-category-violet` con `text-category-violet-strong` vía `CATEGORY_SLOTS`, **sin** su labio `rgba(91,63,163,0.35)` (sin token); opacidad `.85` de eyebrow y etiquetas → plena (#61 R3) |
| P4 | D-SH: ¿sombra en la fila? | la de `Card variant="flat"` de #173: ninguna; revierte «flat solo en Perfil» de #173 R3.3 (Δ22) |
| P5 | D-S1: píldora «Edad» sin dato | (a) omitirla, desvío nombrado del canvas. Alternativas: (b) etapa desde `ageMonths` de la mascota ya cargada, con umbrales por especie y copy nuevo; (c) campo nuevo en backend |
| P6 | D-S2: horas del panel con muchas comidas | (a) `flex-wrap` con `min-w-20` (80) por caja |
| P7 | Enums crudos | se pintan crudos («medium», «dry»), carta §6; el artboard pinta «Media» y «Seco» |
| P8 | Un solo botón de acción (familiar, o sin plan) | ocupa todo el ancho (`flex-1`) |
| P9 | «Editar» mide 39 y las flechas 40, bajo 44 | `hitSlop={TOUCH_SLOP}` (+6 por lado: 51 y 52). `Button` de heroui acepta `hitSlop` en tipos; que lo reenvíe al nativo lo valida el humo (R14.4); si no, el leader enmienda |
| P10 | D-K: rótulos del canvas | tal cual: «kcal», «/ día», «comidas / día», «Actividad», «Condición», «Alimento»; el «g» va pegado al valor («300 g», como el artboard) |
| P11 | Alergias y enfermedades no salen en el artboard | se conservan (`profile-allergies`, `profile-diseases`) |
| P12 | Choque de token: S1 a S6 con otro valor | H0 para y el leader enmienda |
| P13 | #177 en `main` al llegar H0 | caso B tal cual; caso A H0 para (§#177) |
| P14 | Retardos de entrada (artboard 0/80/140/200 y 0/100) | los de `HomeEntrance` (`index` × 60: 0/60/120/180 y 0/60); desvío nombrado |
| P15 | `#62 R5` fija el título de card a 16/700 | se revierte: «Perfil nutricional» es un h2 del artboard (17/800) y ya no está en una card (Δ9) |
| P16 | `--pill` del día seleccionado | `bg-tab-pill` (verde tenue del tema, claro y oscuro) |
| P17 | Espaciador | el artboard lo pinta en días futuros; #179 lo pone en toda celda sin comidas para que todas tengan 2 hijos y el número no salte |
| P18 | Iniciales de la semana en Hermes | `narrow` da «L M M J V S D» en Node (igual que el artboard); si Hermes da otra cosa, el humo lo ve y el leader enmienda |
| P19 | Texto del badge del panel | el copy existente (`'2 comidas servidas'`, `'1 comida servida'`) |
| P20 | `kcal/100 g` sin espacios alrededor de la barra | como el artboard (`380 kcal/100 g`) |

## Aprobación

- [x] Aprobado por humano (fecha: 2026-10-15)
- [ ] Prueba de humo #179 R14 firmada por: ____ — fecha: ____

## Enmienda E1 — premisas de la spec que el árbol desmiente y candados que no inventarió

> Escrita el 2026-10-15, al contrastar la spec firmada (`334fcebc`) contra el
> árbol en `3a613925` para escribir el handoff a Codex
> (`progress/handoff_mobile-meal-schedule-canvas-fidelity.md`). **No cambia
> ninguna decisión de comportamiento ni de diseño de Horario ni de Historial.**
> Corrige dos premisas falsas (R1/D5 y R13 punto 9) y registra candados que
> §Deltas no nombra. Cambia alcance de ficheros: `profile-canvas-fidelity.test.ts`
> y `alerts-canvas-fidelity.test.ts` entran en la lista cerrada. Ningún `it` se
> añade, se quita ni se renombra. Su casilla va **sin marcar**: el humano
> reabre el gate solo para esta enmienda. Cada punto manda sobre el cuerpo de
> la spec.

### Qué se midió

- `src/theme/global.css` ya declara `--text-15: 15px` y `--text-17: 17px` (una
  vez cada una). En `3a613925` faltaban `--text-22`, `--radius-10`,
  `--radius-14`, `--radius-24`, `--tracking-title` y `--tracking-caps`. Tras
  fusionar `main` con #174 (`deaf4e6d`, 2026-10-15) `--radius-10`,
  `--tracking-title` y `--tracking-caps` ya existen, con los mismos valores
  que pide R1 (S2, S5 y S6 dan 1): faltan `--text-22`, `--radius-14` y
  `--radius-24`.
- `text-17` ya lo usan `forgot`, `login`, `register` y `reset-password`
  (`screens/<x>/index.tsx`); `text-22` no lo usa ningún fichero de `src/`.
- `src/__tests__/profile-canvas-fidelity.test.ts` lista los ficheros con
  `text-13` (sin `screens/meal-schedule/index.tsx`) y con `variant="flat"`
  (solo `screens/profile/index.tsx`, con su recuento en 2).
- `src/__tests__/consistency-classnames.test.ts` tiene un segundo sitio que
  cuenta `rounded-xl bg-accent` (`#62 R1`, `primaryRadius`) además del de
  `#98 R10`, y los dos bajan en 1.

### E1.1 — R1 (D5): tres líneas, no ocho

`global.css` ya trae `--text-15` y `--text-17`; la spec (D5) supuso
`--text-17` ausente. Con #174 fusionada, además, ya trae `--radius-10`,
`--tracking-title` y `--tracking-caps`. R1 añade **tres** líneas:
`--text-22: 22px` justo tras `--text-17: 17px;`, y `--radius-14: 14px` y
`--radius-24: 24px` tras la última línea `--radius-*` del bloque (hoy
`--radius-10: 10px;`), en ese orden. Si otra feature declara alguno de los
tres antes de H0, S3, S4 o el equivalente de `--text-22` dan 1 y esa línea no
se toca. El test pide los diez tokens con `toMatchObject` y la unicidad de
los ocho declarados por esta feature o por #174 (`match(/--x:/g)` de longitud
1). El rojo de R1 sigue garantizado por los tres ausentes.

### E1.2 — R13, punto 9

El punto 9 pedía `filesMatching(/\btext-(17|22)\b/)` igual a
`['screens/meal-schedule/index.tsx']`, falso en H0 por los cuatro ficheros de
cuenta. Se sustituye por dos aserciones:

- `filesMatching(/\btext-22\b/)` es exactamente `['screens/meal-schedule/index.tsx']`;
- `filesMatching(/\btext-17\b/)` es exactamente, ordenada: `screens/forgot/index.tsx`,
  `screens/login/index.tsx`, `screens/meal-schedule/index.tsx`,
  `screens/register/index.tsx`, `screens/reset-password/index.tsx`.

Los otros once puntos del `describe` no cambian.

### E1.3 — R6 y R8: `text-13` en el inventario de #173

En `src/__tests__/profile-canvas-fidelity.test.ts`, el `it`
`'limita text-13 a Perfil y a las pantallas de cuenta de #172 (E8)'` gana
`'screens/meal-schedule/index.tsx', // #179 R6` entre `login` y `profile`
(orden `LC_ALL=C`). Viaja en el rojo de R6. El título no cambia.

### E1.4 — R6: `variant="flat"` en el inventario de #173

En ese mismo fichero, el `it` que lista los ficheros con `variant="flat"` pasa
a `['screens/meal-schedule/index.tsx', 'screens/profile/index.tsx']`. El
recuento de Perfil **sigue en 2**: lo que dice §Deltas (Δ22, «H0 + 1») es
falso. El título no cambia.

### E1.5 — R5 a R12: deltas de `consistency-classnames.test.ts`

Δ27 a Δ35 de §Deltas están caducos: Δ32 y Δ33 son falsos (no cambia ninguna
regex de extracción; la lista de neutrales gana `` `meal-time-edit-${index` `` y
`add-meal-time-button`) y falta el segundo sitio de `rounded-xl bg-accent`
(`#62 R1`, `primaryRadius`), que también baja en 1. El id neutral que extrae
la regex de #174 es `` `meal-time-edit-${index}` `` (con la llave de cierre).
Los sustituyen los deltas literales de la sección «DELTAS DE CANDADOS» de
`progress/handoff_mobile-meal-schedule-canvas-fidelity.md` (el que esté en el
árbol al lanzar a Codex; no se cita por commit), cifras escritas como base H0 + delta con `#179 Rn` en el comentario. Si otra
feature mergea antes, el leader re-mide esa sección; el criterio no cambia.

### E1.6 — R7: Δ8 entra entero en un solo commit

Δ8 va completo en el rojo de R7 (c14), sin partirse: el rojo de R5 (c11) ya
retira `ForkKnife` de Horario. La cadena de c14 comprueba que el fichero lo
cuenta 0 veces antes de lanzar jest.

### E1.7 — R4 a R11: inventarios de `alerts-canvas-fidelity.test.ts` (#174 R12)

#174 mergeó con `src/__tests__/alerts-canvas-fidelity.test.ts`, cuyo
`describe('#174 R12: inventarios')` lista los ficheros que consumen
`rounded-10`, `border-b-5`, `tracking-caps`, `text-15` y `tracking-title`, y
`declara border-b-5 una sola vez`. El estado final de #179 desborda esos
inventarios. El fichero entra en la lista cerrada. Cada delta es una línea
de `files:` (o el recuento de `border-b-5`), con `#179 Rn; #174 R12` en el
comentario, y los fija la sección «DELTAS DE CANDADOS» del handoff en los
rojos de R4, R5, R6, R7, R9 y R11. No añade, quita ni renombra ningún `it`.

### Dónde viaja cada delta

| Enmienda | Commit | Fichero |
|---|---|---|
| E1.1 | c2 (rojo R1) y su verde | `global-css.test.ts`, `global.css` |
| E1.2 | c26 (R13, nace verde, sondas S1 a S7) | `design-drift.test.ts` |
| E1.3 | c12 (rojo R6) | `profile-canvas-fidelity.test.ts` |
| E1.4 | c12 (rojo R6) | `profile-canvas-fidelity.test.ts` |
| E1.5 | c10, c12, c14 y los rojos siguientes de R8 a R12 | `consistency-classnames.test.ts` |
| E1.6 | c14 (rojo R7) | `meal-schedule/index.test.tsx` |
| E1.7 | c8, c10, c12, c14, c18 y c22 (rojos de R4, R5, R6, R7, R9 y R11) | `alerts-canvas-fidelity.test.ts` |

- `src/__tests__/profile-canvas-fidelity.test.ts` entra en la lista cerrada de
  ficheros, solo en c12 y solo en las aserciones de E1.3 y E1.4.
- `src/__tests__/alerts-canvas-fidelity.test.ts` entra en la lista cerrada,
  solo en los commits de E1.7 y solo en sus inventarios.
- Los comentarios de trazabilidad son `// #179 Rn`; nunca `// #179 E1`
  (HEX_LITERAL de design-drift).
- Los deltas de E1.3, E1.4 y E1.5 se suman a §Deltas de candados (registro de
  cambios de candados, P12).

### Aprobación de la Enmienda E1

- [X] Enmienda E1 aprobada por humano ← gate obligatorio antes de lanzar a Codex

## Enmienda E2 — `Button.Label` pierde `text-13` y `text-15`; el `className` del botón lleva prefijos de HeroUI

> Escrita el 2026-10-16, tras la segunda parada de Codex en c13
> (`progress/impl_mobile-meal-schedule-canvas-fidelity.md`, «Segunda ejecución»).
> **No cambia ningún valor visual del artboard**: las tres etiquetas
> conservan sus literales de clase. Cambia el nodo que los lleva (`Text` en
> lugar de `Button.Label`) y la forma de aserción del `className` de los
> botones. Su casilla va **sin marcar**: el humano reabre el gate solo para
> esta enmienda. Cada punto manda sobre el cuerpo de la spec.

### Qué se midió

- `tailwind-merge` 3.6.0 (el de `Button.Label` y de `Card` vía `tv`/`twMerge`)
  no conoce `text-13` ni `text-15` como tamaño de fuente: los trata como
  color, y un color posterior los expulsa. Ejecutado en `mobile-pet-tracker/`:
  `twMerge('text-13 font-extrabold text-foreground')` da
  `font-extrabold text-foreground`, y lo mismo para `text-15` y `text-17`;
  `twMerge('text-13 font-extrabold')` conserva `text-13`.
- Lo que Codex observó en c13 con `Button.Label className="text-13 font-extrabold text-foreground"`:
  etiqueta `['button__label', 'button__label--variant-secondary', 'button__label--size-sm', 'font-extrabold', 'text-foreground']`
  (sin `text-13`) y botón
  `'pressable-feedback__root button__root button__root--variant-secondary button__root--size-sm h-9.75 rounded-10 border-2 border-b-5 border-lip-gray bg-surface px-3.5'`
  (los prefijos de HeroUI delante, las clases de la spec intactas y en orden).
- El CSS de HeroUI Native (`button.css`): `button__label--size-sm` fija
  `text-sm` (14) y `--size-md` `text-base` (16), y `--variant-secondary` pinta
  `accent-soft-foreground`. Quitar el color de la etiqueta o dejar caer el
  tamaño no da 13 ni 15 ni `text-foreground`.
- `docs`, `profile` y `alerts` ya pintan `text-13`/`text-15 font-extrabold text-foreground`
  en `Text` sueltos, sin pasar por `twMerge`.
- #172 (`forgot`, `login`, `register`, `reset-password`) pasa
  `Button.Label className="text-17 font-extrabold text-accent-foreground"`: ese
  `text-17` es inerte en ejecución (cae al tamaño del botón). Es deuda de
  #172, fuera del alcance de #179.
- #178 no se ve afectada: sus `Button.Label` llevan `text-sm`, que `twMerge`
  sí conoce como tamaño.

### E2.1 — R6 y R7: la etiqueta de los tres botones es un `Text`

Sustituye `Button.Label` por `Text`, con los mismos literales, el mismo texto
y la misma clave de copy (sin cambio):

| Botón | Etiqueta |
|---|---|
| «Editar» (R6) | `<Text className="text-13 font-extrabold text-foreground">` |
| «Añadir comida» (R7) | `<Text className="text-15 font-extrabold text-foreground">` |
| «Generar plan» (R7) | ``<Text className={`text-15 font-extrabold ${CATEGORY_SLOTS.violet.ink}`}>`` |

`Text` ya se importa de `react-native` en `screens/meal-schedule/index.tsx`.
Los demás `Button.Label` de Horario (`font-bold text-accent-strong`,
`font-bold text-accent-foreground`) no llevan tamaño y no cambian.

### E2.2 — R6 y R7 (tests): el `className` del botón

Donde R6 y R7 piden «`className` literal» del `Button`
(`meal-time-edit-<n>`, `add-meal-time-button`, `generate-plan-button`), el test
aserta dos cosas, ambas sobre `button.props.className`:

1. `startsWith('pressable-feedback__root button__root ')`;
2. `endsWith(' ' + literal)`, con el literal de R6 o R7 (el de «Generar» con
   `bg-category-violet` escrito literal).

No se aserta la cadena entera: lleva `button__root--variant-<v>` y
`button__root--size-<s>` de HeroUI, que no son de #179. La etiqueta sí conserva
`toHaveProp('className', <literal>)`: ahora es un `Text` y no se fusiona.
`#147 R4` (Δ6) no cambia: su `arrayContaining` ya pasa con ambos nodos.

### E2.3 — R13, punto 11

El punto 11 ancla en el fuente de `screens/meal-schedule/index.tsx` las tres
etiquetas de E2.1 (`<Text className="text-13 font-extrabold text-foreground">`,
`<Text className="text-15 font-extrabold text-foreground">` y
``<Text className={`text-15 font-extrabold ${CATEGORY_SLOTS.violet.ink}`}>``),
una vez cada una, en lugar de `<Button.Label …>`. El resto del punto no cambia.

### Dónde viaja cada punto

| Enmienda | Commit | Fichero |
|---|---|---|
| E2.1 | c13 y c15 (verdes de R6 y R7) | `screens/meal-schedule/index.tsx` |
| E2.2 | c12b (R6: c12 ya estaba cometido con el literal entero; la corrección va en un commit propio entre c12 y c13) y c14 (rojo de R7) | `screens/meal-schedule/index.test.tsx` |
| E2.3 | c26 (R13) | `__tests__/design-drift.test.ts` |

- El total pasa de 26 a 27 commits (c1–c26 y c12b). Ningún `it` se añade, se
  quita ni se renombra; ningún fichero entra en la
  lista cerrada; los recuentos de clases no cambian (la clase es la misma, solo
  cambia el elemento que la lleva).

### Aprobación de la Enmienda E2

- [ ] Enmienda E2 aprobada por humano ← gate obligatorio antes de que Codex reanude en c12b
