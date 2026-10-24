# impl: mobile-canvas-routine
Fecha: 2026-10-24

Implementador: subagente `implementer` (Claude Sonnet 5.5) como fallback de CLAUDE.md §Excepciones (anotado por el leader en `progress/current.md`).

## Comprobación del primer comando
- pwd: `/home/claude/sites/Pet-Tracker-wt-204`
- rama: `feature/204-mobile-canvas-routine`
- HEAD de arranque: `88f1d50c` (firma de la E3 sobre H0 `9ba176f1`)

## Skills
- Cargadas: `expo:expo-overview`, `appllama-app-design-skill`, `expo:expo-native-ui`, `animate-expo`.
- No encontradas / no cargadas: `expo-tailwind-setup`; los nombres solo-Codex del handoff (`building-native-ui`, etc.) se ignoran. La carta (`docs/ui-guidelines.md`) manda sobre cualquier skill.

## Anclas T0 (desde `mobile-pet-tracker/`, salida en H0)
Todas coinciden con la salida esperada del handoff:
- `_layout.tsx`: las tres líneas `title: ''` 1, 1, 1; las tres `headerShown: false` 0, 0, 0.
- `screen-header.tsx` `titlePlaceholder` 0; `motion.ts` `MOTION_REMINDERS_STAGGER_MS = 70` 0, `MOTION_STAGGER_MS = 60` 1.
- `reminders/index.tsx`: `reminders-actions` 1; `contentInsetAdjustmentBehavior` 1; `paddingTop: 24,` 1; `paddingTop: insets.top + 12,` 0; `home-entrance` 1; `MOTION_REMINDERS_STAGGER_MS` 0; `border-2 border-warning-soft` 1; `border-2 border-category-amber` 0; `bg-warning-soft` 1; `text-warning-strong` 1; `rounded-xl bg-danger-soft` 1; `size="sm"` 1; Label `font-semibold text-danger` 1; `Text text-13 ... text-danger` 0; `w-full rounded-xl bg-danger` 1; `h-14 w-full rounded-16 bg-danger` 0; Label `font-bold text-danger-foreground` 1; `Text text-17 ... text-danger-foreground` 0; `chunkyLip.danger` 0; `<Button.Label` 4; `rounded-14` 1; `rounded-16` 4; `CATEGORY_SLOTS.rose` 1.
- `add-reminder/index.tsx`: `HeaderHeightContext` 2; `keyboardVerticalOffset={headerHeight}` 1; `contentInsetAdjustmentBehavior` 1; `paddingTop: 24,` 1; `add-reminder-title` 1; CTA sin `mt-auto` 1, con `mt-auto` 0; `flexGrow: 1` 0.
- `docs/index.tsx`: `HeaderHeightContext` 2; `keyboardVerticalOffset` 1; `contentInsetAdjustmentBehavior` 1; `paddingTop: 24,` 1; `home-entrance` 1; `docs-header-skeleton` 1.
- `global.css`: amber 1, amber-strong 1, rose 1, lip-danger 2. `chunky-lip.ts` `danger:` 1. `chunky-cta` `add-reminder-submit` 1.
- `ui-guidelines.md`: `## Enmienda #204` 0; `Título en contenido (D-H)` 1; `^## Enmienda` 26.
- Inventario: profile-canvas-fidelity 1/1 (I32); alerts-canvas-fidelity 1/1/1 (I33); docs test `header.children` 3, `header.props.className` 1, `'View'` 10, `una sola cabecera nativa` 1, `docs-back` 1, `mockHomeEntrance` 3; docs-upload-form `'View'` 2, `mockHomeEntrance` 2; add-reminder `add-reminder-back` 1; reminders `mockHomeEntrance` 3; `#197 R20` 0 (I1 ausente, nada que borrar); legibility I23 1; design-drift `home-entrance` 1; chunky-cta `reminders-delete-confirm` 1 y `'screens/reminders/index.tsx': 4` 1; layout.test las cuatro filas 1; `grep -rcE '#204' src` suma 0.
- Canvas congelado: todas 1 salvo la receta «Eliminar» de fila en Recordatorios.dc.html (3).
- `test ! -e .expo/types/router.d.ts`: `sin-router-d-ts`.

## `#197 R20` al llegar
No existía (I1 ya borrada por #200 R1). Nada que borrar.

## Commits
- `da27f678` test(#204): R1 hide the native header on Rutina routes. Tests: 3 failed, 128 passed, 131 total (layout + docs; los 3 rojos son los `#204 R1`, por aserción `toEqual`).
- `ac1a1bfc` feat(#204): R1 turn off the native header on Rutina routes. Tests: 131 passed (layout + docs); además 18 suites que mencionan `_layout`: 614 passed. `git diff --numstat` de `_layout.tsx` = `3 3`.
- `7ab3ef45` test(#204): R2 ScreenHeader paints a title placeholder. Tests: 1 failed, 7 passed, 8 total (screen-header). Primer mensaje salió como `test(#204 R2)` y lo corregí con `--amend` (commit local, sin push) al formato `test(#204): R2 …` del handoff.
- `779e59b9` feat(#204): R2 ScreenHeader accepts a titlePlaceholder. Tests: 8 passed, 8 total.
- `c3cddf4f` test(#204): R3 declare the 70 ms step of Recordatorios rows. Tests: 2 failed, 27 passed, 29 total (motion: el `it` nuevo y I12).
- `f83964d1` feat(#204): R3 export MOTION_REMINDERS_STAGGER_MS. Tests: 29 passed, 29 total.
- `c7ad05ad` test(#204): R4 header and frame of Recordatorios in the content. Tests: 11 failed, 114 passed, 125 total (reminders + profile/alerts-canvas-fidelity: los 3 `it` `#204 R4` nuevos, I3, I6, I7, I8, I9, I10, I32, I33; todos por aserción o `Unable to find an element with testID`, ninguno por import roto).
- `fdaf7403` feat(#204): R4 Recordatorios paints its header and frame in the content. Tests: 125 passed (3 suites); aggregate locks (design-drift, consistency-classnames, legibility-classnames, chunky-cta, canvas-foundations, heroui-text-size-merge, no-pets-states, ui-language, tab-headers-canvas) 429 passed; empty-state + detail-stack + reminders-alerts-stack 123 passed.
- `7108b4d3` test(#204): R5 states sit under the header and no-pets keeps back. Tests: 1 failed, 76 passed, 77 total (reminders: solo el `it` de sin mascotas, `Unable to find an element with testID: reminders-no-pets-frame`; las 4 filas del it.each nacen verdes).
- `c276dec6` feat(#204): R5 no-pets Recordatorios keeps back above the empty state. Tests: 521 passed, 10 suites (reminders + design-drift, consistency-classnames, legibility-classnames, chunky-cta, canvas-foundations, heroui-text-size-merge, no-pets-states, profile/alerts-canvas-fidelity).
- `9441ba24` test(#204): R6 Recordatorios rows enter through RiseIn at 70 ms steps. Tests: 2 failed, 76 passed, 78 total (reminders: el `it` `#204 R6` y I13) + design-drift I30 (1 rojo): 3 rojos en total, todos por aserción (`Number of calls: 0`, `Expected substring`). El doble de `home-entrance` se borró del fichero en este commit sin romper ningún otro `it`.
- `0bd782ef` feat(#204): R6 wrap Recordatorios rows in RiseIn. Tests: 78 passed (reminders); 551 passed en 11 suites (reminders + design-drift, consistency-classnames, legibility-classnames, chunky-cta, canvas-foundations, heroui-text-size-merge, no-pets-states, profile/alerts-canvas-fidelity, motion).
- `ab6f505f` test(#204): R7 upcoming Recordatorios row and badge use the canvas amber. Tests: 3 failed, 102 passed, 105 total (reminders + legibility-classnames): el `it` `#204 R7`, I5 e I14, los tres por aserción (`Expected … border-category-amber / Received … border-warning-soft`). I24 e I25 salen verdes en el commit rojo (ver «nacen verdes»).
- `e1faf85b` feat(#204): R7 paint the upcoming Recordatorios row and badge in the canvas amber. Tests: 515 passed en 9 suites (reminders, legibility-classnames, design-drift, consistency-classnames, chunky-cta, canvas-foundations, heroui-text-size-merge, profile/alerts-canvas-fidelity).
- `115caabb` test(#204): R8 row Eliminar uses the canvas rose recipe. Tests: 3 failed, 269 passed, 272 total (reminders + chunky-cta + design-drift): el `it` `#204 R8`, I27 (parte R8) e I31 (parte R8), todos por aserción (`Expected substring "h-11 rounded-14 px-2.5 bg-category-rose"`; recuentos).
- `ef244818` feat(#204): R8 paint row Eliminar with the canvas rose recipe. Tests: 516 passed en 9 suites + no-pets-states 7 passed.
- `3093916b` test(#204): R8 reject an explicit size on the row delete button. Commit de test extra (ver Desviaciones): la sonda m15 (`size="sm"` replantado) salió verde contra el `it` `#204 R8` del commit rojo; se añadió la aserción `button__root--size-md` y la sonda pasó a rojo. Tests: reminders 80 passed.
- `6f91bc20` test(#204): R9 sheet Eliminar gets a 56 px body and the danger lip. Tests: 6 failed, 293 passed, 299 total (reminders + legibility-classnames + chunky-cta + design-drift): el `it` `#204 R9`, I15, I23, I27 (parte R9), I28 e I31 (parte R9), todos por aserción (`Expected substring "h-14 w-full rounded-16 bg-danger"`; recuentos). I29 nace verde.
- `9673974f` feat(#204): R9 give sheet Eliminar a 56 px body and the danger lip. Tests: 524 passed en 10 suites (reminders, legibility-classnames, chunky-cta, design-drift, consistency-classnames, canvas-foundations, heroui-text-size-merge, profile-canvas-fidelity, alerts-canvas-fidelity, no-pets-states).
- `bb320535` test(#204): R10 add-reminder pins the in-content header and drops the native header offset. Tests: 9 failed, 87 passed, 96 total (add-reminder + alerts-canvas-fidelity): los cuatro `it` `#204 R10`, I16, I17, I18, I19 e I33 (parte R10), todos por aserción (`Unable to find an element with testID: add-reminder-back`, `Expected … text-24 …`, `paddingBottom 291`). I38 nace verde.
- `b8ecc101` feat(#204): R10 give add-reminder the in-content header, the canvas frame and no native header offset. Tests: 593 passed en 11 suites (reminders, legibility-classnames, chunky-cta, design-drift, consistency-classnames, canvas-foundations, heroui-text-size-merge, profile/alerts-canvas-fidelity, no-pets-states, add-reminder).
- `8dfe420a` test(#204): R11 add-reminder Guardar leans on the bottom of the form. Tests: 2 failed, 146 passed, 148 total (add-reminder + chunky-cta): el `it` `#204 R11` e I26, por aserción (`Expected substring "mt-auto h-14 rounded-16 bg-accent"`).
- `76ccaeb6` feat(#204): R11 lean add-reminder Guardar on the bottom of the form. Tests: 594 passed en 11 suites (las mismas del verde de R10).
- `79c4855a` test(#204): R12 docs header lives in the content with the canvas frame and no native header offset. Tests: 30 failed, 154 passed, 184 total (docs + docs-upload-form) y 2 failed, 51 passed, 53 total (profile/alerts-canvas-fidelity): los cinco `it` `#204 R12`, I20, I21, I34, I35 (siete títulos, 20 casos) e I21 (1), I36 (2), I32 e I33 (parte R12); todos por aserción (`Unable to find an element with testID: docs-header-back`, `toEqual` del marco, listas de hijos). I39 nace verde.
- `fc9291bd` feat(#204): R12 docs header lives in the content with the canvas frame and no native header offset. Tests: 237 passed en 4 suites (docs, docs-upload-form, profile/alerts-canvas-fidelity); candados agregados (design-drift, consistency-classnames, legibility-classnames, chunky-cta, canvas-foundations, no-pets-states, ui-language, tab-headers-canvas) 403 passed y heroui-text-size-merge 25 passed.
- `b6260c80` test(#204): R13 docs states sit under the in-content header. Tests: 109 passed, 109 total (docs; las 4 filas del `it.each` nacen verdes). Sin commit verde (R13 nace verde por R12).
- `a22d6cba` test(#204): R14 docs rows rise in with RiseIn and a 60 ms stagger. Tests: 7 failed, 103 passed, 110 total (docs): el `it` `#204 R14`, I22 y las cinco filas de `filtra %s, conserva el orden y renumera las entradas` (enmienda mecánica), todos por aserción (`Expected: 0 / Received: undefined` sobre `delayMs`).
- `a972a5e9` feat(#204): R14 wrap docs rows in RiseIn with delayMs = index * MOTION_STAGGER_MS. Tests: 189 passed en 2 suites (docs, docs-upload-form); 534 passed en 13 suites en los candados agregados (design-drift, consistency-classnames, legibility-classnames, chunky-cta, alerts/profile-canvas-fidelity, canvas-foundations, heroui-text-size-merge, no-pets-states, ui-language, tab-headers-canvas, hero-header-amendments, home-canvas-fidelity).
- `fa67fb4e` test(#204): R14 drop the dead home-entrance double in docs-upload-form. Tests: 79 passed, 79 total (docs-upload-form). Quedó verde con el doble fuera: no hubo parada por forma del árbol.
- `42b1f7e0` test(#204): R15 routine-canvas-fidelity locks the eleven canvas rows. Tests: 11 passed, 11 total (routine-canvas-fidelity) y 125 passed con design-drift (el fichero nuevo no lo toca). Sin commit verde (R15 nace verde).
- `0361a6e7` test(#204): R16 charter carries the Enmienda #204 once with its checkbox. Tests: 1 failed, 11 passed, 12 total (routine-canvas-fidelity: el `it` `#204 R16`, por aserción `expect(received).toBe(1)` sobre el recuento del bloque en la carta; las 11 filas de R15 siguen verdes).
- `bea9afd8` feat(#204): R16 add the Enmienda #204 block to the UI charter. Tests: 708 passed en 23 suites (candados agregados: design-drift, consistency-classnames, legibility-classnames, chunky-cta, alerts/profile-canvas-fidelity, canvas-foundations, heroui-text-size-merge, no-pets-states, routine-canvas-fidelity, ui-language, tab-headers-canvas y las demás que leen la carta). La carta gana 14 líneas y 0 borradas respecto a H0.
- `f79d5eef` test(#204): R17 reminders, add-reminder, docs and screen-header stay grep-clean. Tests: 16 passed, 16 total (routine-canvas-fidelity; 11 R15 + 1 R16 + 4 R17). Sin commit verde (R17 nace verde).
- `efb79a86` test(#204): R12 type the nameless pet state of the docs header test. Commit de test extra (ver Desviaciones): el `typecheck` final falló en `docs/index.test.tsx(1025,36)` porque el estado de mascota `{ kind: 'not-found' }` del `it` `#204 R12: sin nombre…` no existe en `PetState`; pasa a `{ kind: 'error' }`. Tests: docs 110 passed; typecheck 0.
- `bcd3af55` test(#204): R16 keep the bare feature id out of the fidelity test source. Commit de test extra (ver Desviaciones): la guarda `grep -rnP '#204(?! R\d)' src` daba 7 líneas, todas del `it` de R16 (títulos y regex de la carta). Los títulos pierden el número desnudo y las regex lo escriben como `\x23204`. Tests: routine-canvas-fidelity 16 passed; eslint 0.
<!--COMMITS-->

## Mutaciones plantadas
| Candado | Mutación | Resultado |
|---|---|---|
| R2 `#204 R2: con título ignora el marcador` | `screen-header.tsx`: pintar `{titlePlaceholder}` siempre (fuera del ternario del título) | rojo en ese `it`; revertida |
| R3 `#204 R3: declara el paso de 70 ms…` e I12 (`no exporta nada más`) | `motion.ts`: `MOTION_REMINDERS_STAGGER_MS = 60` y un `export const MOTION_ZZZ = 1;` | rojos ambos `it`; revertida |
| R4 `volver sin historial lleva a Perfil` | `reminders/index.tsx`: `backFallback="/"` | rojo solo ese `it`; revertida |
| R4 frame + I7 + I8 | `paddingTop: insets.top + 13` | rojos R4 marco, I7, I8; revertida |
| R4 frame (sin `contentInsetAdjustmentBehavior`) | re-añadir `contentInsetAdjustmentBehavior="automatic"` | rojo R4 marco; revertida |
| R4 primer `it`, I3, I6, I9, I32, I33 | quitar `title` del `ScreenHeader` y añadir un comentario `// text-26 tracking-title` | rojos los seis; revertida |
| I10 (orden: cabecera primera) | un `<View testID="reminders-zzz" />` antes del `ScreenHeader` | rojo I10; revertida |
| R5 `sin mascotas conserva volver encima del vacío` (sin título) | `ScreenHeader` de sin mascotas con `title="x"` | rojo ese `it`; revertida |
| R5 mismo `it` (marco) | `paddingTop: insets.top + 13` en `reminders-no-pets-frame` | rojo ese `it`; revertida |
| R5 it.each 4 estados (nacen verdes) + I10 | mover el `ScreenHeader` `reminders` al final del `ScrollView` | rojos las 4 filas y I10; revertida |
| R6 `escalona las filas 0, 70 y 140 ms…`, I13, I30 | `delayMs={i * 60}`, comentario `// home-entrance` y el import de la constante renombrado | rojos los tres; revertida |
| R7 `la fila próxima y su badge…`, I14 | badge `${CATEGORY_SLOTS.amber.ink} ${CATEGORY_SLOTS.amber.surface}` (orden invertido) | rojos R7 e I14; revertida |
| R7, I5 (rama lejana, zona ciega) | `'border border-border'` → `'border border-category-amber'` | rojo I5 solo (el `it` R7 no mira la lejana, I5 sí); revertida |
| R7, I5 | borde próximo `'border border-category-amber'` (sin `-2`) | rojos R7 e I5; revertida |
| I25 | los dos `CATEGORY_SLOTS.amber.surface` de reminders sustituidos por el literal `'bg-category-amber'` | rojo I25; revertida |
| I24 | `text-warning-strong` de `screens/home/index.tsx` sustituido por `text-category-amber-strong` | rojo de la fila `home` de I24; revertida |
| R8 `Eliminar de fila usa la receta rosa…` | `size="sm"` replantado en el botón | **verde** con el `it` del commit rojo (la aserción no miraba `size`); tras `3093916b` (`button__root--size-md`) rojo; revertida |
| R8 `Eliminar de fila usa la receta rosa…` | etiqueta `text-13 font-semibold text-danger` | rojo; revertida |
| I31 (zona ciega del `it` R8) | comentario `// rounded-14 stray` antes de `RemindersScreen` (cuenta 3) | rojo I31 solo; revertida |
| I27 (zona ciega del `it` R8) | comentario `// <Button.Label stray` (cuenta +1) | rojo I27 solo; revertida |
| R9 `Eliminar de la hoja lleva cuerpo de 56…`, I15, I23, I27 | la etiqueta vuelve a `<Button.Label className="font-bold text-danger-foreground">` | rojos cuatro: el `it` R9, I15, I23 e I27; revertida |
| I28, I31 (zona ciega del `it` R9) | comentario `// rounded-16 stray` antes de `RemindersScreen` | rojos I28 e I31 solos; revertida |
| R9, I15, I28, I31 | `className="h-14 w-full rounded-xl bg-danger"` | rojos cuatro (R9, I15, I28, I31); revertida |
| R9, I15, I23 | `variant="danger-soft"` | rojos tres (R9, I15, I23 `conserva variant…`); revertida |
| I29 (nace verde, zona ciega: otro fichero) | `style={chunkyLip.danger}` añadido a `profile-sign-out` en `screens/profile/index.tsx` | rojo I29; revertida |
| R9 (labio, `style={chunkyLip.danger}`) | NO plantada aquí: la spec manda candar el labio por fuente en R15 (`#204 R15`); su sonda se hace entonces | hecha en R15: quitar `style={chunkyLip.danger}` del botón `reminders-delete-confirm` deja verdes reminders, chunky-cta y el `it` de R9 y solo se pone roja la fila `labio del destructivo` de R15 (1 failed, 169 passed); revertida |
| R10 `pinta volver y Agregar recordatorio…` (primer hijo) | un `<View testID="add-reminder-zzz" />` antes del `ScreenHeader` | rojo ese `it`; revertida |
| R10 `volver sin historial lleva a Recordatorios` | `backFallback="/"` | rojo solo ese `it`; revertida |
| R10 marco (`contentInsetAdjustmentBehavior`) | re-añadir `contentInsetAdjustmentBehavior="automatic"` | rojo solo el `it` del marco; revertida |
| R10 marco, I16, I17 | `paddingTop: insets.top + 13` | rojos los tres; revertida |
| R10 marco, I16, I17 (zona ciega: solo `flexGrow`) | quitar `flexGrow: 1` | rojos los tres; revertida |
| R10 teclado, I19 | `keyboardVerticalOffset={50}` en el `KeyboardAvoidingView` | rojos el `it` del teclado e I19; revertida |
| R10 primer `it`, I18 | `size={26}` | rojos ambos; revertida |
| I38 (nace verde), R10 primer `it`, I18 | `title={t('addReminder.type')}` | rojos cuatro, I38 entre ellos; revertida |
| I33 (parte R10) | comentario `// tracking-title stray` en `add-reminder/index.tsx` | rojo I33 solo; revertida |
| R11 `Guardar se apoya al pie…`, I26 | `className="h-14 mt-auto rounded-16 bg-accent"` (orden) | rojos ambos; revertida |
| R11, I26 | `className="mt-4 h-14 rounded-16 bg-accent"` | rojos ambos; revertida |
| R12 marco/teclado (`usa el marco del canvas…`) | `keyboardVerticalOffset={91}` en `docs-keyboard-avoider` | rojo ese `it` (paddingBottom 291 en lugar de 200); revertida |
| R12 marco, I20 | `paddingTop: 24,` | rojos ambos; revertida |
| R12 marco (zona ciega: solo `contentInsetAdjustmentBehavior`) | re-añadir `contentInsetAdjustmentBehavior="automatic"` | rojo ese `it`; revertida |
| R12 volver | `backFallback="/"` | rojo `volver sin historial lleva a Perfil`; revertida |
| R12 sin nombre | `petName ?? t('docs.documentsOf')` | rojo `sin nombre la cabecera dice Mascota`; revertida |
| R12 esqueleto | `titlePlaceholder={undefined}` | rojos el `it` de R12 y el de `uses content-sized skeletons…`; revertida |
| R12 primer `it`, I34 | `size={24}` | rojos ambos; revertida |
| I39 (nace verde), R12 primer `it`, I34 | quitar `eyebrow` | rojos cuatro, I39 entre ellos; revertida |
| I21, I35 (20 casos) y I36 (zona ciega: nodo anónimo tras la cabecera) | `<View />` entre la cabecera y el esqueleto de la lista | rojos I21 y las listas de I35 (21 con I21) en docs y los dos casos de I36 en docs-upload-form; revertida |
| I32 e I33 (parte R12) | comentario `// text-26 tracking-title` en `docs/index.tsx` | rojos I32 e I33 solos; revertida |
| R13 `la cabecera encabeza el estado %s` (4 filas) | mover el bloque `ScreenHeader` al final del `ScrollView` | rojas las 4 filas (cargando, vacío, en error, con filas); revertida |
| R14 `#204 R14: escalona…` e I22 | `delayMs={(index + 1) * MOTION_STAGGER_MS}` en `screens/docs/index.tsx` | rojos el `it` R14, I22 y las cinco filas de `filtra %s…` (7); revertida |
| R14 `#204 R14: escalona…` e I22 | `delayMs={index * 70}` (literal del escalón de Recordatorios en Documentos) | rojos los mismos 7; revertida |
| R14 `testID` de la entrada | `testID={`doc-entry-${document.id}`}` (renombrado) | 24 rojos: R14, I22, I35, filas de R3/R8/R9/R10; revertida |
| R15 fila `marco de Recordatorios` | `paddingTop: insets.top + 12,` a `+ 8,` en `screens/reminders/index.tsx` (las dos apariciones) | roja solo esa fila (1 failed, 10 passed); revertida |
| R15 fila `marco de Agregar` | `paddingTop: insets.top + 12,` a `+ 8,` en `screens/add-reminder/index.tsx` | roja solo esa fila (1 failed, 10 passed); revertida |
| R15 fila `marco de Documentos` | `paddingTop: insets.top + 12,` a `+ 8,` en `screens/docs/index.tsx` | roja solo esa fila (1 failed, 10 passed); revertida |
| R15 fila `título de 24` | `size={24}` a `size={26}` en `screens/add-reminder/index.tsx` | roja solo esa fila (1 failed, 10 passed); revertida |
| R15 fila `borde próximo` | `border-2 border-category-amber` a `border border-category-amber` en reminders; y `--color-category-amber: #FFF7EE` en `theme/global.css` | roja solo esa fila (1 failed, 10 passed); revertida |
| R15 fila `badge próximo` | quitar `${CATEGORY_SLOTS.amber.surface}` solo de la `className` de `reminder-upcoming-` (zona ciega: `CATEGORY_SLOTS.amber.surface` sigue 1 vez más en el fichero, fuera de ese tag) | roja solo esa fila (1 failed, 10 passed); revertida |
| R15 fila `«Eliminar» de fila` | `rounded-14` a `rounded-16` en el botón de fila; y `text-danger` a `text-foreground` en su `Text` | roja solo esa fila (1 failed, 10 passed); revertida |
| R15 fila `labio del destructivo` | mover `style={chunkyLip.danger}` del botón `reminders-delete-confirm` al de cancelar (la fuente sigue conteniendo el literal una vez: solo el corte por tag lo ve); y `offsetY: 4` a `3` en `theme/chunky-lip.ts` | roja solo esa fila (1 failed, 10 passed); revertida |
| R15 fila `escalón de Recordatorios` | `MOTION_REMINDERS_STAGGER_MS = 60;` en `theme/motion.ts` (mutación de tasks.md); y `delayMs={i * 60}` en reminders | roja solo esa fila (1 failed, 10 passed); revertida |
| R15 fila `escalón de Documentos` | `delayMs={index * 70}` en docs; y `MOTION_STAGGER_MS = 50;` en `theme/motion.ts` | roja solo esa fila (1 failed, 10 passed); revertida |
| R15 fila `«Guardar» al pie` | quitar `mt-auto` de la `className` de Guardar; y `flexGrow: 1` a `flexGrow: 0` | roja solo esa fila (1 failed, 10 passed); revertida |
| R16 `#204 R16: la carta lleva su enmienda…` | `docs/ui-guidelines.md`: el bloque `## Enmienda #204` duplicado al final | rojo ese `it`; revertida |
| R16 mismo `it` | `docs/ui-guidelines.md`: la casilla `- [X] Enmienda #204 aprobada por humano` sin casilla | rojo ese `it`; revertida |
| R16 mismo `it` | `docs/ui-guidelines.md`: `escalonadas por índice: Recordatorios con` a `…por indice…` dentro del bloque (cualquier deriva respecto al bloque canónico) | rojo ese `it`; revertida |
| R16 (repetidas tras `bcd3af55`) | las tres anteriores | las tres siguen rojas (1 failed, 15 passed cada una); carta restaurada (`git status` limpio) |
| R12 `sin nombre la cabecera dice Mascota` (repetida tras `efb79a86`, estado `error`) | `docs/index.tsx`: `petName ?? t('docs.documentsOf')` | rojo ese `it` (1 failed, 109 passed); revertida |
| R17 fila `screens/docs/index.tsx` | un comentario `// #FFFFFF` al final del fichero | roja solo esa fila (1 failed, 15 passed); revertida |
| R17 fila `screens/reminders/index.tsx` | `// StyleSheet.create({})` al final | roja solo esa fila; revertida |
| R17 fila `screens/add-reminder/index.tsx` | `// w-[10px]` al final | roja solo esa fila; revertida |
| R17 fila `components/screen-header.tsx` | un emoji (patas, U+1F43E) en un comentario al final | roja solo esa fila; revertida |
| R17 fila `screens/reminders/index.tsx` | `// elevation: 2` al final | roja solo esa fila; revertida |
| R17 fila `screens/add-reminder/index.tsx` | `// #abc` al final (hex corto) | roja solo esa fila; revertida |
<!--MUT-->

## Filas que nacen verdes por requisito previo
- R2 `#204 R2: con título ignora el marcador` pasó en verde ya en el commit rojo (el componente ignoraba la prop desconocida): nace verde por el código previo; se demostró con la mutación de arriba.
- R5 `#204 R5: la cabecera encabeza el estado %s` (4 filas): nacen verdes porque R4 ya pinta `reminders` como primer hijo; demostradas con la mutación «mover el `ScreenHeader` al final» (rojas las 4).
- R7 I25 `conserva el ámbar puro como relleno de badge (enmendado por #204 R7)`: nace verde porque la tarjeta resumen de reminders ya lee `CATEGORY_SLOTS.amber.surface` (líneas 281 y 285 en H0). Demostrada con la mutación que sustituye todas las apariciones por el literal; el candado no distingue la tarjeta del badge, y el badge lo cubren el `it` `#204 R7` e I14.
- R7 I24 (`warningSites` sin `reminders`): nace verde porque solo quita una fila; demostrada con la mutación en `home`.
- R9 I29 `#177 R8.4: destructivos, tonales y reintentos no reciben labio (enmendado por #189 R13) (enmendado por #204 R9)`: nace verde porque quitar `'reminders-delete-confirm'` de la lista `excluded` solo debilita el candado (el botón ahora lleva labio). Demostrado con la mutación que añade `chunkyLip.danger` a `profile-sign-out`.
- R10 I38 `el título vive en el cuerpo (#178 R10) (enmendado por #204 R10)`: nace verde porque quitar la aserción de nulo solo debilita el candado. Demostrada con la mutación que cambia el título del `ScreenHeader` a `t('addReminder.type')`.
- R12 I39 `conserva Documentos de (enmendado por #204 R12)`: nace verde porque quitar la aserción `docs-back` a nulo solo debilita el candado. Demostrada con la mutación que quita el `eyebrow` del `ScreenHeader` (rojo I39, entre otros).
- R13 `#204 R13: la cabecera encabeza el estado %s` (4 filas): nacen verdes porque R12 ya pinta `docs-header` como primer hijo; demostradas con la mutación «mover el `ScreenHeader` al final» (rojas las 4).
- R15 `#204 R15: %s sigue al canvas` (11 filas): nacen verdes porque R1 a R14 ya dejaron la producción como el canvas; demostradas con una mutación por fila (tabla de mutaciones).
- R13 y R17 no llevan commit verde: R13 `b6260c80`, R17 `f79d5eef`.
- R17 `#204 R17: %s es grep-limpio` (4 filas): nacen verdes porque R4, R10 y R12 ya dejaron las tres pantallas y R2 el `ScreenHeader` limpios; demostradas con seis mutaciones (hex de seis y de tres dígitos, `StyleSheet.create`, clase arbitraria, emoji y `elevation:`), cada una roja solo en la fila de su fichero.
<!--BORN-->

## Enmiendas mecánicas
| Candado | Antes | Después | R |
|---|---|---|---|
| `docs/index.test.tsx` › `#175 R9: filtrar por categoría` › `filtra %s, conserva el orden y renumera las entradas` (5 filas) | `expect(...('docs-entry-extra').props.index).toBe(0)` y `expect(...(`docs-entry-${id}`).props.index).toBe(1)` (comparaba el `index` del doble de `home-entrance`) | `props.delayMs` `toBe(0)` y `toBe(60)` (doble de `rise-in`); sufijo ` (enmendado por #204 R14)` tras el de #204 R12 | R14 |
<!--MECH-->

## Filas del inventario I1-I39 enmendadas
- I1: ausente al llegar (nada que hacer).
- I2 (`#194 R4` it.each de layout.test): filas `add-reminder` y `pets/[petId]/docs` quitadas, sufijo ` (enmendado por #204 R1)`, en `da27f678`.
- I4 (`#114 R4` it.each de layout.test): fila `reminders` quitada (queda `alerts`), sufijo ` (enmendado por #204 R1)`, en `da27f678`.
- I37 (docs/index.test `conserva una sola cabecera nativa…`): borrado sin sufijo en `da27f678`.
- I12 (motion.test `no exporta nada más`): `'MOTION_REMINDERS_STAGGER_MS'` entre `MOTION_POP_SPRING` y `MOTION_RING_DELAY_MS` (47 entradas, orden `.sort()` verificado con node), sufijo ` (enmendado por #204 R3)`, en `c3cddf4f`.
- I3 (`#178 R4 › coloca título y Nuevo…`): `reminders-actions` pasa a la cabecera `reminders` con tres hijos (envoltorio `-ml-2.5` con `reminders-back`, columna `flex-1` con el título, `reminders-add-link` último), sufijo ` (enmendado por #204 R4)`, en `c7ad05ad`.
- I6 (`#114 R5 (revertido por #178 R4) › deja Nuevo junto al título…`): `reminders-actions` pasa a `reminders`, sufijo `(enmendado por #204 R4)`, en `c7ad05ad`.
- I7 (`…(#114 R6)`): `paddingTop: 24` pasa a 52, sufijo, en `c7ad05ad`.
- I8 (`usa el marco 20/24/14…`): `paddingTop: 24` pasa a 52, sufijo, en `c7ad05ad`.
- I9 (`pinta Recordatorios como título accesible…`): className sin `flex-1`, sufijo, en `c7ad05ad`.
- I10 (`#155 R6 › queda en el sitio del vacío que sustituye`): las dos listas empiezan por `'reminders'`, sufijo, en `c7ad05ad`.
- I11: NO hecha (enmienda opcional de higiene; sin sufijo ni parada).
- I32 (`profile-canvas-fidelity › reserva text-26…`): quitada la línea `'screens/reminders/index.tsx', // #178 R4` (ancla 1 a 0), sufijo `(enmendado por #204 R4)`, en `c7ad05ad`.
- I33 (`alerts-canvas-fidelity › limita $token…`, fila `tracking-title`): quitada la misma línea (ancla 1 a 0), sufijo `(enmendado por #204 R4)`, en `c7ad05ad`.
- I13 (`#178 R7 › asigna a cada entrada su índice…`): ahora lee el doble de `rise-in` (`delayMs` = índice por 70, literal en el test) con sufijo ` (enmendado por #204 R6)`; el doble de `home-entrance` y `mockHomeEntrance` borrados del fichero, en `9441ba24`.
- I30 (`design-drift › #178 R13 › reutiliza HomeEntrance y PopIn sin Card en Recordatorios`): ahora espera `from '../../components/rise-in'` y no `home-entrance`, sufijo ` (enmendado por #204 R6)`, en `9441ba24`.
- I5 (`#178 R6 › distingue las recetas de fila próxima, lejana e inactiva`): fila próxima con `border-2 border-category-amber`, sufijo ` (enmendado por #204 R7)`, en `ab6f505f`.
- I14 (`#178 R7 › envuelve el badge próximo con PopIn y la receta del canvas`): badge `rounded-full px-2 py-0.75 text-11 font-extrabold bg-category-amber text-category-amber-strong`, sufijo ` (enmendado por #204 R7)`, en `ab6f505f`.
- I24 (`legibility-classnames › #61 R5 › %s pinta su texto con text-warning-strong`): `warningSites` pierde `reminders` y queda `home`; el sufijo ` (enmendado por #204 R7)` va tras el de #199 R14, en `ab6f505f`.
- I25 (`legibility-classnames › conserva el ámbar puro como relleno de badge`): ahora espera `CATEGORY_SLOTS.amber.surface`, sufijo ` (enmendado por #204 R7)`, en `ab6f505f`.
- I27 (parte R8) (`chunky-cta › #177 R6.2: recuentos de etiquetas`): `<Button\.Label` `35 - 15 - 1 - 1 - 1 - 1` y `Button\.Label` `82 - 30 - 2 - 2 - 2 - 2`, comentario `// #204 R8`, sufijo ` (enmendado por #204 R8)`, en `115caabb`. `text-17` no se mueve hasta R9.
- I31 (parte R8) (`design-drift › #178 R13 › reserva los radios 14, 16 y 22…`): `rounded-14` 1 a 2, sufijo ` (enmendado por #204 R8)`, en `115caabb`.
- I15 (`#128 R4 › pinta reminders-delete-confirm con la variante danger y bg-danger…`): `className` resuelto `… h-14 w-full rounded-16 bg-danger` y `Text` `text-17 font-extrabold text-danger-foreground`, sufijo ` (enmendado por #204 R9)`, en `6f91bc20`.
- I23 (`legibility-classnames › #61 R1 › resuelve el Button.Label con text-danger-foreground`): la fuente contiene `<Text className="text-17 font-extrabold text-danger-foreground">`, sufijo ` (enmendado por #204 R9)`, en `6f91bc20`.
- I27 (parte R9) (`chunky-cta › #177 R6.2`): `<Button\.Label` `… - 1 - 1`, `Button\.Label` `… - 2 - 2`, `text-17` `+ 1` (30), comentarios `// #204 R9`, sufijo ` (enmendado por #204 R9)`, en `6f91bc20`.
- I28 (`chunky-cta › #177 R7.3`): `'screens/reminders/index.tsx': 5` y total `+ 1` (36), sufijo ` (enmendado por #204 R9)`, en `6f91bc20`.
- I29 (`chunky-cta › #177 R8.4`): `'reminders-delete-confirm'` fuera de `excluded`, sufijo ` (enmendado por #204 R9)`, en `6f91bc20` (nace verde).
- I31 (parte R9) (`design-drift › #178 R13`): `rounded-16` 4 a 5, sufijo ` (enmendado por #204 R9)`, en `6f91bc20`.
- I16 (`#114 R7 › uses the metrics under the native header (#95 R6)`): `paddingTop` 52 y `flexGrow: 1`, sufijo ` (enmendado por #204 R10)`, en `bb320535`.
- I17 (`#178 R10 › usa el marco 20/24/16 bajo la cabecera nativa`): `{ paddingHorizontal: 20, paddingTop: 52, gap: 16, paddingBottom: 48, flexGrow: 1 }`, sufijo, en `bb320535`.
- I18 (`#178 R10 › abre el formulario con Agregar recordatorio como título accesible`): `text-24 font-black tracking-title text-foreground`, sufijo, en `bb320535`; `title.parent?.children[0]` sigue siendo el título.
- I19 (`#148 R5 › el host screen-add-reminder añade paddingBottom 200…`): título nuevo, `paddingBottom` 200, sufijo, en `bb320535`.
- I38 (`#95 R5 › el título vive en el cuerpo (#178 R10)`): quitada la aserción `queryByTestId('add-reminder-back')` a nulo (ancla 1 a 0), renombrado con ` (enmendado por #204 R10)`, en `bb320535` (nace verde).
- I33 (parte R10) (`alerts-canvas-fidelity › limita $token…`, fila `tracking-title`): quitada la línea `'screens/add-reminder/index.tsx', // #178 R10` (ancla 1 a 0), sufijo `(enmendado por #204 R10)`, en `bb320535`.
- I26 (`chunky-cta › #177 R3.1`): fila `CTA_ROWS` de `add-reminder-submit` con `'mt-auto h-14 rounded-16 bg-accent'`, sufijo ` (enmendado por #204 R11)`, en `8dfe420a`.
- I20 (`#95 R6 › usa solo el inset inferior del dispositivo`): `paddingTop` 24 a 52, sufijo ` (enmendado por #204 R12)`, en `79c4855a`.
- I21 + I35 (`'View'` a `'docs-header'` en diez listas de `docs/index.test.tsx`; ancla `grep -cF "'View'"` 10 a 0) con sufijo ` (enmendado por #204 R12)` en los siete títulos de I35 y en el de I21, en `79c4855a`.
- I34 (`#175 R5 › pinta una columna sin gap con eyebrow y título exactos`): reescrito para leer `docs-header-eyebrow` y `docs-header-title` con sus clases; borradas `header.props.className` y `header.children` (anclas 1 a 0 y 3 a 0); sufijo, en `79c4855a`.
- I36 (`docs-upload-form › ordena el error del selector con lista %j`): `'View'` a `'docs-header'` en las dos listas (ancla 2 a 0), sufijo, en `79c4855a`.
- I39 (`#95 R5 › conserva Documentos de`): quitada la aserción `queryByTestId('docs-back')` a nulo (ancla 1 a 0), título nuevo `conserva Documentos de (enmendado por #204 R12)`, en `79c4855a` (nace verde).
- I32 (parte R12) (`profile-canvas-fidelity › reserva text-26…`): quitada `'screens/docs/index.tsx', // #175 R5` (ancla 1 a 0), sufijo ` (enmendado por #204 R12)`, en `79c4855a`; la lista queda en ocho ficheros.
- I33 (parte R12) (`alerts-canvas-fidelity › limita $token…`, fila `tracking-title`): quitada la misma línea (ancla 1 a 0), sufijo ` (enmendado por #204 R12)`, en `79c4855a`; la fila `text-15` no cambia.
- I22 (`docs/index.test.tsx › #175 R6: fila del artboard › envuelve cada fila con su índice y conserva el orden del backend`): el doble `mockHomeEntrance` y su `jest.mock('../home/home-entrance', …)` sustituidos por `mockRiseIn` y `jest.mock('../../components/rise-in', …)`; `entry.props.index` pasa a `entry.props.delayMs` `toBe(index * 60)` y `toHaveBeenCalledWith` lleva `delayMs: index * 60`; sufijo ` (enmendado por #204 R14)`, en `a22d6cba`. Ancla: `grep -c mockHomeEntrance` del fichero 3 a 0 (el doble sale del fichero).
- docs-upload-form: doble muerto de `home-entrance` borrado en `fa67fb4e` (ancla `grep -c mockHomeEntrance` 2 a 0); el fichero quedó verde (79/79).
- R16 (carta): el bloque `## Enmienda #204` va al final de `docs/ui-guidelines.md`, idéntico al canónico de design.md salvo la casilla; sin tocar ninguna línea anterior. Anclas: `grep -cF '## Enmienda #204'` 0 a 1; `grep -c '^## Enmienda'` 26 a 27; `grep -cF 'Título en contenido (D-H)'` 1 a 1; `git diff --numstat 9ba176f1 -- docs/ui-guidelines.md` = `14 0`.
- I24 reduce la cuenta de tests en una fila que la cuenta de la spec no descontó (ver Desviaciones).
<!--INV-->

## Tabla R1-R17 a test a commit
Rutas relativas a `mobile-pet-tracker/src/`. «Verde» es el commit de producción; los extras son commits de test posteriores.

| R | Test | Rojo | Verde | Extras |
|---|---|---|---|---|
| R1 | `app/__tests__/layout.test.tsx` › `#204 R1: %s oculta la cabecera nativa` (3) | `da27f678` | `ac1a1bfc` | |
| R2 | `components/__tests__/screen-header.test.tsx` › `#204 R2: sin título pinta el marcador en el hueco del título`, `#204 R2: con título ignora el marcador` | `7ab3ef45` | `779e59b9` | |
| R3 | `theme/__tests__/motion.test.ts` › `#204 R3: declara el paso de 70 ms de las filas de Recordatorios` | `c3cddf4f` | `f83964d1` | |
| R4 | `screens/reminders/index.test.tsx` › `#204 R4: …` (3) | `c7ad05ad` | `fdaf7403` | |
| R5 | `screens/reminders/index.test.tsx` › `#204 R5: la cabecera encabeza el estado %s` (4), `#204 R5: sin mascotas conserva volver encima del vacío` | `7108b4d3` | `c276dec6` | |
| R6 | `screens/reminders/index.test.tsx` › `#204 R6: escalona las filas 0, 70 y 140 ms con RiseIn` | `9441ba24` | `0bd782ef` | |
| R7 | `screens/reminders/index.test.tsx` › `#204 R7: la fila próxima y su badge usan el ámbar del canvas` | `ab6f505f` | `e1faf85b` | |
| R8 | `screens/reminders/index.test.tsx` › `#204 R8: Eliminar de fila usa la receta rosa del canvas` | `115caabb` | `ef244818` | `3093916b` (test) |
| R9 | `screens/reminders/index.test.tsx` › `#204 R9: Eliminar de la hoja lleva cuerpo de 56 y labio danger` | `6f91bc20` | `9673974f` | |
| R10 | `screens/add-reminder/index.test.tsx` › `#204 R10: …` (4) | `bb320535` | `b8ecc101` | |
| R11 | `screens/add-reminder/index.test.tsx` › `#204 R11: Guardar se apoya al pie del formulario` | `8dfe420a` | `76ccaeb6` | |
| R12 | `screens/docs/index.test.tsx` › `#204 R12: …` (5) | `79c4855a` | `fc9291bd` | `efb79a86` (test, tipo) |
| R13 | `screens/docs/index.test.tsx` › `#204 R13: la cabecera encabeza el estado %s` (4) | — (nace verde) | `b6260c80` (solo test) | |
| R14 | `screens/docs/index.test.tsx` › `#204 R14: escalona las filas 0, 60 y 120 ms con RiseIn` | `a22d6cba` | `a972a5e9` | `fa67fb4e` (test, doble muerto) |
| R15 | `__tests__/routine-canvas-fidelity.test.ts` › `#204 R15: %s sigue al canvas` (11) | — (nace verde) | `42b1f7e0` (solo test) | |
| R16 | `__tests__/routine-canvas-fidelity.test.ts` › `#204 R16: la carta lleva su enmienda una sola vez y con su casilla` | `0361a6e7` | `bea9afd8` | `bcd3af55` (test, número desnudo) |
| R17 | `__tests__/routine-canvas-fidelity.test.ts` › `#204 R17: %s es grep-limpio` (4) | — (nace verde) | `f79d5eef` (solo test) | |
| R18 | smoke humano (ver abajo) | n/a | n/a | n/a |

Cuenta de `it` nuevos medida con `--json` sobre los 13 ficheros de test tocados: R1 3, R2 2, R3 1, R4 3, R5 5, R6 1, R7 1, R8 1, R9 1, R10 4, R11 1, R12 5, R13 4, R14 1, R15 11, R16 1, R17 4 = 49, igual que la spec.

## Cierre medido
- `bun run test --runInBand --testTimeout=30000` en primer plano: exit 0, `Test Suites: 147 passed, 147 total`, `Tests: 5059 passed, 5059 total`, `Snapshots: 1 passed`, 380 s. Base T0 5015 / 146: +44 tests (no +45) y +1 suite. Ver la desviación de la cuenta.
- Candados agregados (design-drift `rounded-14` 2 y `rounded-16` 5; chunky-cta `<Button\.Label` `35 - 15 - 1 - 1 - 1 - 1 - 1`, `Button\.Label` `82 - 30 - 2 - 2 - 2 - 2 - 2`, `'screens/reminders/index.tsx': 5`; motion 47 entradas `^      'MOTION_`; carta 27 `^## Enmienda`; heroui-text-size-merge 25 passed): todos dentro de la suite completa en verde.
- Guardas contra H0 `9ba176f1`: `package.json`/`bun.lock` sin diff; `_layout.tsx` `3	3`; `global.css`, `chunky-lip.ts`, `rise-in.tsx`, `back-button.tsx`, `home-entrance.tsx`, `catalog.ts`, `ui-copy-table.ts` sin diff; `grep -rnP '#204(?! R\d)' src` 0 líneas (tras `bcd3af55`); `grep -cF 'name="pets/[petId]/docs-upload" options={{ ...headerOptions' src/app/_layout.tsx` 1; `<EmptyState` 2 en Recordatorios y 1 en Documentos; `grep -cF 'Título en contenido (D-H)' docs/ui-guidelines.md` 1 y la carta con 14 líneas añadidas y 0 borradas.
- `git diff --name-only 9ba176f1..HEAD -- mobile-pet-tracker/ docs/` = los 18 ficheros de la lista cerrada (6 de producción más `docs/ui-guidelines.md` y los de test: alerts/chunky-cta/design-drift/legibility/profile/routine fidelity, layout, screen-header, add-reminder, docs-upload-form, docs, reminders, motion). Fuera de esas rutas solo cambió `specs/mobile-canvas-routine/` por la errata E3 `88f1d50c` del leader (previa a mi primer commit) y, en el commit final, `traceability.md`.
- `graphify update .` en el worktree: hecho.

## Lint y typecheck
- `test ! -e .expo/types/router.d.ts`: ausente antes de cada typecheck.
- `bun run typecheck` (`tsc --noEmit`): exit 0 tras `efb79a86`. La primera pasada dio un error propio, `src/screens/docs/index.test.tsx(1025,36): TS2322 '"not-found"'`, corregido en ese commit.
- `bunx expo lint --no-cache > ../progress/lint-204.log 2>&1 && test ! -s ../progress/lint-204.log`: exit 0 y log vacío (medido tras `efb79a86`; el único cambio posterior es `bcd3af55`, que además pasó `eslint` sobre su fichero con exit 0).

## Desviaciones
- R10 `it` `#204 R10: el teclado no descuenta una cabecera que ya no existe`: la aserción literal de la spec (`props.keyboardVerticalOffset` `undefined` en el host `screen-add-reminder`) es tautológica: `KeyboardAvoidingView` no reenvía esa prop al `View` host y RNTL 14 solo expone nodos host, así que nacía verde aun con la prop declarada. Se conserva esa aserción y se añade el efecto observable: con la plataforma Android, `HeaderHeightContext.Provider value={91}` y el teclado abierto (mismo método que I19), el host ocupa `paddingBottom` 200 (con el offset sería 291). Con eso el `it` nace rojo y la mutación `keyboardVerticalOffset={50}` lo pone rojo.
- R12 `it` `#204 R12: usa el marco del canvas sin cabecera nativa`: la spec pone en él la aserción literal `docs-keyboard-avoider` `props.keyboardVerticalOffset` `undefined`, tautológica por la misma razón que en R10 (`KeyboardAvoidingView` no reenvía la prop al `View` host). Se conserva la aserción y se añade, dentro del mismo `it` (el recuento de `it` de R12 sigue siendo cinco), la comprobación conductual en Android: `layout` de 700, teclado en 500 y `paddingBottom` 200 (con la cabecera nativa de 91 del fixture serían 291). La sonda `keyboardVerticalOffset={91}` la pone en rojo.
- Commit extra `3093916b` `test(#204): R8 reject an explicit size on the row delete button` (después del verde de R8): la sonda de mutación m15 mostró que el `it` `#204 R8` no candaba la ausencia de `size`. No tocó producción.
- **La cuenta de tests no coincide con la de la spec: 5059 en lugar de 5060 (N + 44 en lugar de N + 45).** Los 49 `it` nuevos coinciden con la spec (medidos con `--json`: R1 3 … R17 4). Las bajas son cinco, no cuatro: I2 (2 filas de `#194 R4` en layout), I4 (1 fila de `#114 R4`), I37 (1 `it` de docs) **y la fila `screens/reminders/index.tsx` de `warningSites` que quita I24 (R7)** en `legibility-classnames.test.ts`. La fórmula de `tasks.md` § Cuentas y del handoff (`− 3 filas (I2 2, I4 1) − 1 it (I37)`) no descuenta I24, que la propia spec manda aplicar. Comprobado enumerando los títulos de los 12 ficheros tocados en un `git archive` de H0 (651 tests) contra HEAD (679 sin el fichero nuevo): +33 nuevos − 5 = +28. No es un fallo de implementación; la spec no se ha tocado. Cifra correcta al cierre: **5059 / 147**.
- Commit extra `efb79a86` `test(#204): R12 type the nameless pet state of the docs header test` (después del verde de R12): `{ kind: 'not-found' }` no pertenece a `PetState` (`ok`, `unauthorized`, `error`, `unreachable`, `missing-config`) y el `typecheck` final lo señaló; el `it` pasa a `{ kind: 'error' }`, con el mismo comportamiento (cualquier estado no `ok` deja la mascota sin nombre) y la sonda `docs.documentsOf` sigue poniéndolo rojo.
- Commit extra `bcd3af55` `test(#204): R16 keep the bare feature id out of the fidelity test source`: el `it` de R16 llevaba `#204` desnudo en títulos y regex (7 líneas), contra la regla del handoff. Los títulos se renombran (`#204 R16: enmienda de la carta` y `#204 R16: la carta lleva su enmienda una sola vez y con su casilla`) y las regex escriben el signo como `\x23`. Los hashes de R16 en `traceability.md` no cambian. Las tres sondas de R16 se repitieron y siguen en rojo.
- I11 no hecha (enmienda opcional de higiene): `reminders-actions` sigue en el bucle de `R4.2`, donde la aserción de nulo pasa en vacío. Sin sufijo ni parada, como manda la spec.
- `#197 R20` no existía al llegar (lo borró #200 R1): nada que borrar en `canvas-foundations.test.ts`, que no aparece en el diff.

## Checklist R18 (humano)
Smoke en dev build Android (PC del humano, no Expo Go), con al menos una mascota, tres recordatorios (uno a menos de 10 días) y dos documentos, en claro y en oscuro. No es gate de implementación: lo cierra la casilla «Smoke de R18» de requirements.md § Aprobación.

1. Recordatorios desde Perfil: no hay cabecera nativa; volver, «Recordatorios» y «Nuevo» quedan en una fila bajo la barra de estado, sin solaparse con ella (safe area real).
2. Volver regresa a Perfil. Abriendo Recordatorios sin historial (enlace profundo o recarga en la ruta), volver lleva a Perfil.
3. Las filas entran subiendo, escalonadas a ojo unos 70 ms; con «Reducir movimiento» del sistema activado entran sin animación.
4. La fila próxima lleva borde ámbar claro y badge «¡Próximo!» en ámbar con texto legible.
5. «Eliminar» de fila: rosa, 44 px de alto, texto rojo 13/800. Al pulsarlo se abre la hoja; su «Eliminar» rojo lleva labio oscuro de 4 px y mide como «Cancelar».
6. Agregar recordatorio desde «Nuevo»: volver y título de 24 en contenido; «Guardar recordatorio» queda pegado al pie con la pantalla vacía. Al abrir el teclado en Título, el campo y el botón siguen visibles y no queda hueco extra encima del teclado.
7. Volver de Agregar regresa a Recordatorios; sin historial, también.
8. Documentos desde Perfil: volver, «DOCUMENTOS DE» y el nombre; mientras carga, un esqueleto ocupa el nombre. Las filas entran escalonadas unos 60 ms. Con el formulario de subida abierto, el teclado no tapa el campo enfocado.
9. Cuenta sin mascotas: Recordatorios muestra a Pingo centrado y un volver arriba a la izquierda que funciona.

## Notas para el reviewer
- Verificar la desviación de la cuenta (5059 frente a 5060): I24 quita una fila que la fórmula de la spec no descontó.
- Los `it` de teclado de R10 y R12 llevan una comprobación conductual añadida (ver Desviaciones) porque la aserción literal de la spec es tautológica.
- El `it` de R16 lee `specs/mobile-canvas-routine/design.md` en tiempo de test: si se mueve o renombra el bloque canónico, R16 se pone rojo.
- La suite completa corrió con `--runInBand` y sin tiempos de espera: 380 s.
