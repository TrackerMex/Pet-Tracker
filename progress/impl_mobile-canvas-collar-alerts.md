# impl: mobile-canvas-collar-alerts (#203)
Fecha: 2026-10-24
Implementador: Claude Sonnet 5.5 (fallback de CLAUDE.md §Excepciones; no Codex). Branch `feature/203-mobile-canvas-collar-alerts`, H0 `435059b2`, HEAD de partida `18fd4693`.

## Estado
Terminado. R1 a R12 cubiertos, `Cierre` ejecutado; HEAD de código `d580239e`, más el commit final `docs(#203)` con este informe y `traceability.md`. Pendiente solo el smoke del humano (lista abajo).

## Skills
- Cargadas: `expo:expo-overview`, `expo:expo-native-ui`, `expo:expo-ui`, `animate-expo`, `appllama-app-design-skill`.
- No encontradas: `expo-tailwind-setup` (no existe como skill en esta sesión; los tokens Tailwind v4 se tomaron de `docs/ui-guidelines.md` y del código existente). Los nombres de skills de Codex del handoff (`building-native-ui`, etc.) se ignoraron como indicó el leader.

## Comprobación del primer comando
Branch `feature/203-mobile-canvas-collar-alerts`, HEAD `18fd4693` (errata E5) sobre H0 `435059b2`, árbol limpio. Spec `status: approved` con casilla humana marcada (leída antes de empezar).

## Anclas T0
Corridas desde `mobile-pet-tracker/` en `18fd4693`. Todas coinciden con el handoff (el `diff --stat` contra 435059b2 y `grep -rn '#203' src` no dan salida; `sin-router-d-ts`; ni `rise-delays.ts` ni `collar-alerts-canvas-fidelity.test.ts` existen).
```
headerShown _layout.tsx 5 | #197 R20 describe 0 | Alert.alert 1 | '  Alert,' 1 | HeaderHeightContext 2 | useContext 2
paddingVertical: 24 1 | pairing-pet-row 1 | text-2xl font-black 1 | bg-accent-soft 1 | rounded-16 1 | rounded-22 0
chunkyLip.danger 0 | gap-4 flexGrow 1 | bottom-sheet import 0 | HomeEntrance alerts 3 / alert-detail 3 / alerts.test 4 / alert-detail.test 2
paddingTop: 24 alerts 1 / alert-detail 1 | tracking- alerts 2 | insets.top + 8 0/0/0 | ChevronLeft 0/0/0 | canGoBack pairing.test 0
not.toHaveProperty('flexGrow') 1 | 'screens/pairing/index.tsx' AC 1 | 'screens/alerts/index.tsx' AC 7 PC 2 | 'screens/alert-detail/index.tsx' AC 2 PC 4
toBe(10 + 1) 1 | toBe(10 + 1 + 1) 0 | ## Enmienda 26
```

## Commits
- `01167214` test(#203): R1 cabeceras nativas fuera de pairing, alerts y detalle. Tests: layout.test.tsx 4 failed (3 nuevos + F4), 28 passed. F1 ya no existía (borrado por #200 en 6bbd0485): canvas-foundations.test.ts no se toca.
- `b41a5118` feat(#203): R1 oculta la cabecera nativa de pairing, alerts y el detalle. Tests: layout.test.tsx 32 passed; 8 suites relacionadas con `_layout` 86 passed. `headerShown` 5 -> 8.

- `f61299ab` test(#203 R2): cabecera de pairing con ScreenHeader y metricas sin cabecera nativa. Tests: pairing/index.test.tsx + design-drift.test.ts 19 failed (R2.1 x6, R2.2, R2.3, R2.4 x5, F5, F8, F9 x2, F38, F22), 204 passed; todos por aserción o `getByTestId` del nodo nuevo. F6 borrado editorial (-1 test). F39 `canGoBack`. (El hash anterior b18e06d1 se enmendó con `commit --amend` antes del verde, para arreglar un error de tipo `TestNode` detectado por `tsc`; sin push.)
- `4ac62813` feat(#203 R2): pairing pinta ScreenHeader propio y metricas sin cabecera nativa. Tests: pairing 109 passed; 8 suites (pairing, design-drift, pairing/consistency/chunky/alerts/profile-canvas-fidelity, ui-language) 464 passed. B4 `HeaderHeightContext` 2 -> 0, B23 `useContext` 2 -> 0, B5 `paddingVertical: 24` 1 -> 0, B6 `pairing-pet-row` 1 -> 0, `insets.top + 8` 0 -> 1. typecheck y lint de pairing limpios.
- `d09c24c5` test(#203 R3): la vista de vincular entra con RiseIn 0, 80 y 140. Tests: pairing/index.test.tsx 3 failed (los 3 nuevos, `Unable to find an element with testID: pairing-*-rise`), 109 passed. Doble de `RiseIn` (View que expone `delayMs`) en el test de pairing. typecheck limpio.
- `c04fb181` feat(#203 R3): pairing envuelve hero, aviso de plan y codigo en RiseIn 0, 80 y 140. Tests: pairing 112 passed; 8 suites 467 passed (464 + 3). typecheck y lint de pairing limpios.
- `4f8eec63` test(#203 R4): titulo 28/900, tarjeta radio 22 con sombra card y filas de dispositivo del canvas. Tests: pairing + design-drift + alerts-canvas-fidelity 17 failed (15 nuevos de R4 + F23 + F35), 251 passed; todos por aserción o `getByTestId` del nodo nuevo. typecheck limpio. (Un primer intento usaba `StyleSheet.flatten` en el test de pairing y tumbó la guarda `#68 R18`; se quitó antes del commit: `Card` ya entrega `style` aplanado.)
- `8e18bfe8` feat(#203 R4): pairing pinta titulo 28/900, tarjeta radio 22 con sombra card y filas con tono. Tests: pairing 127 passed; 10 suites de guardas 534 passed. `text-2xl font-black` 1 -> 0, `rounded-22` 0 -> 1. typecheck y lint limpios.
- `581ef0bb` test(#203 R5): pildora de rastreo de 36 con punto y plan envuelto en RiseIn 140. Tests: pairing + consistency-classnames 7 failed (5 nuevos de R5 + F24 y F25, `bg-accent-soft` 4 -> 3), 200 passed; todos por aserción o `getByTestId` del nodo nuevo. typecheck limpio.
- `2fba8162` feat(#203 R5): pairing pinta la pildora de rastreo de 36 con punto y envuelve el plan en RiseIn 140. Tests: pairing 132 passed; 10 suites de guardas 539 passed. `bg-accent-soft` 1 -> 0 en pairing. typecheck y lint limpios.
- `fddd70af` test(#203 R6): desvincular de 54, radio 16, labio rojo y espaciador al fondo. Tests: pairing + design-drift + chunky-cta 3 failed (el nuevo `#203 R6`, F23 y F27), 322 passed; todos por aserción (className del botón; `rounded-16` de pairing 1 -> 2). F28 saca `device-unpair` de `excluded`. typecheck limpio. (El hash anterior b258bf89 se enmendó con `commit --amend --only` sobre el test antes del verde: la aserción de la etiqueta pedía el className exacto y `Button.Label` de HeroUI antepone `button__label …`; el test pasó a comparar la cola de clases. Sin push.)
- `88d75d24` feat(#203 R6): pairing pinta desvincular de 54 con radio 16, labio rojo y espaciador al fondo. Tests: pairing + 9 suites de guardas 540 passed (539 + R6). `rounded-16` 1 -> 2, `chunkyLip.danger` 0 -> 1, `className="gap-4" style={{ flexGrow: 1 }}` 1 -> 2, `## Enmienda` 26 -> 27. typecheck y lint limpios.
- `17917920` test(#203 R7): hoja de desvincular con anatomia, cierre y errores. Tests: pairing + design-drift + consistency-classnames + chunky-cta 22 failed (13 nuevos `#203 R7.x` + 9 de inventario: F23, F26, F27, F29 R4.1/R4.2/R4.3, F37, inventario neutro R7.5 y R8.1), todos por `getByTestId` del nodo nuevo o por la cuenta. F10 (describe R9 con `Alert.alert`) borrado entero (-7 tests). typecheck y eslint de los 4 ficheros limpios.
- `c4555d2c` feat(#203 R7): hoja de desvincular con BottomSheet en lugar de Alert.alert. Tests: pairing + 9 suites de guardas 546 passed (540 - 7 de F10 + 13 de R7). `rounded-16` 2 -> 4, `chunkyLip.danger` 1 -> 2, import de `@expo/ui/community/bottom-sheet` 0 -> 1, `Alert.alert` 1 -> 0, `  Alert,` 1 -> 0, `signOut(` sigue en 2. typecheck y lint limpios.
- `214e17fc` test(#203 R8): cabecera de Alertas con ScreenHeader, insignia como accesorio y paddingTop del inset. Tests: alerts/index.test.tsx + alert-detail.navigation + alerts-canvas-fidelity + profile-canvas-fidelity 20 failed (7 nuevos `#203 R8` + F11 x4, F12 x4, F13, F14, F16, F34, F36), todos por aserción o por `Unable to find an element with testID: alerts`; F31 y F33 (dobles de `ChevronLeft`) no ponen nada en rojo. typecheck y eslint limpios.
- `177aed0f` feat(#203 R8): Alertas pinta ScreenHeader con la insignia de nuevas como accesorio. Tests: 13 suites (alerts, alert-detail.navigation, alert-detail, guardas, canvas-foundations) 684 passed + 3 suites de rutas (alerts de tabs, detail-stack, empty-state) 125 passed. `paddingTop: 24` 1 -> 0, `tracking-` 2 -> 1, `insets.top + 8` 0 -> 1. typecheck y lint limpios.
- `6ca3aba1` test(#203 R9): entrada escalonada de Alertas con RiseIn. Tests: alerts/index.test.tsx 1 failed (`#203 R9`, `Expected: 0 / Received: undefined` en `delayMs`), 81 passed; `HomeEntrance` en el test 4 -> 0. typecheck y eslint limpios.
- `bd6e49bb` feat(#203 R9): las cinco primeras filas de Alertas entran con RiseIn. Tests: 17 suites (alerts, alert-detail, pairing, guardas, canvas-foundations, rutas) 946 passed. `HomeEntrance` en alerts 3 -> 0. typecheck y lint limpios. Decisión: el corte `index < ALERT_ROW_RISE_DELAYS.length` sustituye a la constante `ALERT_ROW_ENTRANCE_LIMIT = 5` (un solo 5, el de la tabla de retardos).
- `9060bebc` test(#203 R10): cabecera del detalle con ScreenHeader y paddingTop del inset. Tests: alert-detail/index.test.tsx + alerts-canvas-fidelity + profile-canvas-fidelity 19 failed, 165 passed (4 `#203 R10`, F17, F18 x3, F19 x2, F20 x6, F21 por el literal, F34, F36), por aserción (`Expected: "alert-detail" / Received: "alert-detail-title"`, `paddingTop`) o por `Unable to find an element with testID: alert-detail`; F32 (doble de `ChevronLeft`) no pone nada en rojo. typecheck y eslint limpios.
- `c4ceb49b` feat(#203 R10): el detalle de alerta pinta ScreenHeader y respeta el inset superior. Tests: 18 suites (alert-detail, alerts, pairing, guardas incl. alert-detail-canvas-fidelity, canvas-foundations, rutas) 970 passed. `paddingTop: 24` 1 -> 0, `insets.top + 8` 0 -> 1; `'screens/alert-detail/index.tsx'` AC 2 -> 1, PC 4 -> 3. typecheck y lint limpios.
- `7df7f6bf` test(#203 R11): la tarjeta y el mapa del detalle entran con RiseIn en 0 y 80. Tests: alert-detail/index.test.tsx 1 failed (`#203 R11`, `Expected: 0 / Received: undefined`), 130 passed; `HomeEntrance` en el test 0. typecheck y eslint limpios.
- `662a4077` feat(#203 R11): la tarjeta y el mapa del detalle entran con RiseIn en 0 y 80. Tests: 18 suites 970 passed. `HomeEntrance` en alert-detail 3 -> 0. typecheck y lint limpios.
- `d580239e` test(#203 R12): fidelidad de Vincular, Alertas, Detalle y Celebracion contra los artboards congelados. Tests: collar-alerts-canvas-fidelity.test.ts 12 passed (nace verde por diseño); guardas design-drift, consistency-classnames, legibility-classnames, canvas-foundations, ui-language, heroui-text-size-merge 349 passed. typecheck y eslint limpios. `git diff` de producción vacío.

## Enmiendas mecánicas
| Candado | Antes | Después | R |
|---|---|---|---|
| F21 (`alert-detail/index.test.tsx`): el literal `alert-detail-title` del primer hijo del scroll, que R10 sustituye por la cabecera | `alert-detail-title` | `alert-detail` (el `ScreenHeader`) | R10 |

Resto de enmiendas de candados: las prescritas por el inventario de la spec (F10 a F14, F16 a F20, F23, F26, F27, F29, F31 a F34, F36, F37, cada una en el commit rojo de su R), no mecánicas. Ninguna por la regla de recuentos agregados.

## Sondas de mutación
Cada mutación plantada en `src/screens/pairing/index.tsx` tras el verde de R2, vista en rojo y revertida (no commiteada):
- R2: `{phase !== 'ready' ? (` -> `{true ? (` => rojo `#203 R2.1: la celebración no pinta la cabecera`.
- R2: avatar sin la condición `isLinking` => rojo `#203 R2.3` y `#188 R17: keeps the full pet switcher outside the linking view`.
- R2 (nació verde F7 y el it del teclado de R2.4): `keyboardVerticalOffset={0}` -> `{91}` => rojo F7 (`#148 R6 … 200 … (enmendado por #203 R2)`) y `#203 R2.4: con teclado de 200`.
- R2: `paddingTop: insets.top + 8` -> `+ 12` => rojo `#203 R2.4` x5, F5, F9 x2 y, en design-drift, F22 (`keeps the uniform screen metric insets.top + 8`) y `#95 R6: pairing no reserva el inset superior`.
- R2: `flexGrow: 1` -> `...(isLinking ? { flexGrow: 1 } : {})` => rojo F38 (`#188 R19`), `#203 R2.4` x4, F5, F9 (paired).
- R2: `<View />` antes de la cabecera => rojo `#203 R2.1: pinta la cabecera en …` x5 (hijo 0).
- R2: avatar envuelto en `<View>` => rojo F8 (`#188 R17: shows only the selected pet avatar …`).
- R3: `delayMs={80}` -> `{81}` => rojo `#203 R3: pairing-plan-icon entra con RiseIn 80`.
- R3: `<View className="gap-1.5">` -> `gap-2` => rojo `#203 R3: pairing-activation-code-label entra con RiseIn 140` y `#188 R20`.
- R3: testID `pairing-hero-rise` -> `pairing-hero-rises` => rojo `#203 R3: pairing-hero-group entra con RiseIn 0`.
- R3: hijo extra `<View />` dentro de `pairing-code-rise` => rojo `#203 R3: pairing-activation-code-label entra con RiseIn 140` (children != 1).
- R4: `text-28` -> `text-26` en el título => rojo `#203 R4.1`; `delayMs={0}` -> `{10}` => rojo `#203 R4.1`.
- R4: `rounded-22` -> `rounded-20` => rojo `#203 R4.2`; `style={shadows.card}` -> `shadows.dialog` => rojo `#203 R4.2`; `delayMs={80}` -> `{90}` en `device-status-rise` => rojo `#203 R4.2`.
- R4: conexión `=== 'online'` -> `!== 'online'` => rojo `#203 R4.3` x3 (online, offline, desconocida); tono batería invertido (`=== null` -> `!== null`) => rojo `#203 R4.3` x2; ESN sin `font-mono tracking-mono` => rojo `#203 R4.3` esn; raíz `items-baseline` -> `items-start` y etiqueta `text-sm` -> `text-base` => rojo `#203 R4.3` raíz/etiqueta x5.
- R5: `h-9` -> `h-10`, `bg-tab-pill` -> `bg-accent-soft`, punto `size-2` -> `size-3`, `text-accent-strong` -> `text-success`, testID del punto renombrado => rojo `#203 R5: la píldora de rastreo es 36 …` en cada una.
- R5: `delayMs={140}` -> `{150}` => rojo `#203 R5: %s entra con RiseIn 140` x4 (las cuatro filas); testID `plan-unknown` renombrado => rojo la fila `plan-unknown`.
- R6 (todas sobre `#203 R6: desvincular es 54, …`): `h-13.5` -> `h-14`, `rounded-16` -> `rounded-xl`, `chunkyLip.danger` -> `chunkyLip.neutral`, etiqueta `font-extrabold` -> `font-bold`, spacer `flex-1` -> `flex-2`, `<View />` extra entre spacer y botón, contenedor sin `style={{ flexGrow: 1 }}` y con `gap-4 pb-2` => rojo en cada una.
- R7 (sobre `src/screens/pairing/index.tsx` tras el verde, vistas en rojo y revertidas): quitar `style={chunkyLip.neutral}` del cancelar => rojo `#203 R7.2`; `<LinkBroken size={26}` -> `24` => rojo `#203 R7.2`; quitar `isDisabled={releasing}` del confirmar => rojo `#203 R7.7`; quitar `setUnpairOpen(false)` del `finally` => rojo `#203 R7.4` x2, `R7.5` x4 y `R7.6`; `onClose={closeUnpair}` -> `() => undefined` => rojo `#203 R7.3: cerrar con el gesto no libera`.
- R8 (sobre `src/screens/alerts/index.tsx` tras el verde): `insets.top + 8` -> `+ 9` => rojo `#203 R8: paddingTop` y F14; testID `alerts` -> `alerts-hdr` => rojo los 15 `it` de R8/F11 a F13; accesorio `undefined` -> `<Text />` con 0 nuevas => rojo F12 x4 y `#203 R8: sin nuevas la cabecera no lleva accesorio`; `<View />` antes de la cabecera => rojo `#203 R8: pinta la cabecera en %s` x4 (hijo 0).
- R9 (sobre `rise-delays.ts` e `index.tsx` tras el verde): `200` -> `201` en la tabla => rojo `#203 R9`; corte `index < ...length` -> `index < 6` => rojo (e5 envuelta); testID `-entrance` -> `-entr` => rojo; `<View />` dentro del `RiseIn` => rojo (`children` 2).
- R10 (sobre `alert-detail/index.tsx` tras el verde): `insets.top + 8` -> `+ 9` => rojo `#203 R10: paddingTop`, F17 y F19; testID `alert-detail` -> `alert-det` => rojo los tres `#203 R10: pinta la cabecera` (y F18/F20); `<View />` antes de la cabecera => rojo (hijo 0); `alerts.detailTitle` -> `alerts.title` => rojo (texto del titulo).
- R11 (sobre `alert-detail/index.tsx` tras el verde): `delayMs={80}` -> `81` => rojo `#203 R11`; `delayMs={0}` -> `1` => rojo; `<View />` dentro del `RiseIn` de la tarjeta => rojo (`children` 2); testID del mapa `-entrance` -> `-entr` => rojo `#203 R11` y `#180 R2.3` x2.- R12 (una por fila de `collar-alerts-canvas-fidelity.test.ts`, plantada en producción, vista en rojo y revertida; `git diff` de `src/screens` y `src/components` vacío al final):
  - título 28: `device-title` `text-28` -> `text-2xl` => rojo `#203 R12: título 28` (el hero `pairing-title` conserva `text-28 font-black tracking-title`, así que la fila lee el tag, no el fichero: sin `tagOf` no habría puesto nada en rojo).
  - radio 22: `rounded-22` -> `rounded-20` => rojo `#203 R12: radio 22`.
  - píldora: `h-9` -> `h-10` => rojo `#203 R12: píldora`.
  - labio rojo: en `device-unpair`, `chunkyLip.danger` -> `chunkyLip.neutral` => rojo `#203 R12: labio rojo`.
  - copy de la hoja: sin mutación (el catálogo no cambia).
  - retardos de Alertas: en `rise-delays.ts`, `70` -> `75` => rojo `#203 R12: retardos de Alertas`.
  - retardo del detalle: `alert-detail-map-entrance` `80` -> `90` => rojo `#203 R12: retardo del detalle`.
  - retardos de Vincular: `pairing-plan-rise` `80` -> `90` => rojo `#203 R12: retardos de Vincular`.
  - retardos de la vista con collar: `device-plan-rise` `140` -> `150` => rojo `#203 R12: retardos de la vista con collar`.
  - margen superior: en `alerts/index.tsx`, `insets.top + 8` -> `+ 12` => rojo `#203 R12: margen superior`.
  - Celebración título: `text-3xl` -> `text-2xl` => rojo `#203 R12: Celebración título`.
  - Celebración cuerpo: `max-w-75` -> `max-w-70` => rojo `#203 R12: Celebración cuerpo`.

## `it` que nacieron verdes
- R2: F7 (`#148 R6 … paddingBottom 200 … (enmendado por #203 R2)`) y `#203 R2.4: con teclado de 200 el host añade paddingBottom 200`: sin `HeaderHeightContext.Provider` el KAV recibe `undefined` (offset 0 por defecto) y ya da 200 antes del verde. Probados con la mutación `keyboardVerticalOffset={91}` (rojo ambos).
- R12: las 12 filas de `collar-alerts-canvas-fidelity.test.ts` nacen verdes por diseño (corren después de R1 a R11); su rojo está demostrado con las mutaciones de arriba. Las dos de Celebración, además, no tienen ninguna R de producción detrás (D7).
- R6: F28 (`#177 R8.4 … (enmendado por #203 R6)`) nace verde: sin `device-unpair` en `excluded` pasa antes y después del verde. Es la enmienda de inventario prescrita (F28), no un `it` nuevo; con la lista antigua ROJO tras el verde (el labio entra en el botón).

## Desviaciones / paradas
Ninguna parada ni desviación de cifra o ancla. Ningún `it` inesperado en rojo.
- F1 (`describe('#197 R20: cimientos sin cablear')`) ya no existía en H0 (#200 lo borró en 6bbd0485): `canvas-foundations.test.ts` no se tocó.
- Dos commits rojos se enmendaron antes del verde y sin push (`--amend --only <test>`): R2 (error de tipo `TestNode`) y R6 (className exacto del `Button.Label` de HeroUI).
- Nota R7: en el rojo, un `mockResolvedValueOnce` de un test rojo vecino que no se consumía contaminaba al siguiente (dos `it` fallaban en `device-status-card`); el `beforeEach` de R7 hace `mockListPets.mockReset()` tras `clearAllMocks()`.
- Decisión R7: la hoja se cierra en el `finally` de `handleRelease` (junto a `setReleasing(false)`), no al pulsar confirmar; así `pairing-unpair-confirm` queda observablemente deshabilitado en vuelo (R7.7) y el cierre llega cuando la liberación devuelve (R7.4 a R7.6).

## Observaciones para reviewer / smoke
- R4.2: `Card` fusiona `rounded-card border border-border bg-surface p-4 shadow-sm` con `rounded-22 px-4 py-4.5 shadow-none` vía `twMerge`; `tailwind-merge` expulsa `shadow-sm` y `p-4` pero conserva `rounded-card` junto a `rounded-22` (el resultado calculado es `rounded-card border border-border bg-surface p-4 rounded-22 px-4 py-4.5 shadow-none`). Si ambas clases de radio llegan al nodo, el radio efectivo depende del orden en la CSS generada (20 vs 22). El spec se siguió al pie de la letra (no es un desajuste de cifra ni de ancla); el test acota `className` por `arrayContaining` + `not.toContain('shadow-sm')` porque la cadena fusionada incluye las clases base del Card. Verificar el radio 22 en el smoke Android.

## Cierre
Medido en `d580239e` desde `mobile-pet-tracker/`, sin pipe.
- `bun run test --runInBand --testTimeout=30000` completo, en primer plano, exit 0: `Test Suites: 147 passed, 147 total`, `Tests: 5082 passed, 5082 total`, `Snapshots: 1 passed, 1 total` (T0: 146 / 5015 / 1; +1 suite por CF203, +67 tests netos). Tiempo 361 s. Log en `progress/full-suite-203.log` (sin commitear). Las trece guardas pedidas están dentro (design-drift, consistency-classnames, legibility-classnames, chunky-cta, alerts, alert-detail, pairing, profile canvas-fidelity, heroui-text-size-merge, ui-language, canvas-foundations, home-photo-hero-canvas, collar-alerts-canvas-fidelity), todas PASS.
- `test ! -e .expo/types/router.d.ts` ok y `bun run typecheck`: exit 0.
- `bunx expo lint --no-cache > ../progress/lint-203.log 2>&1 && test ! -s ../progress/lint-203.log`: exit 0, log de 0 bytes.
- `git diff 435059b2 -- mobile-pet-tracker/package.json mobile-pet-tracker/bun.lock`: vacío.
- `git diff --stat 435059b2 -- src/components/celebration.tsx src/theme/motion.ts src/i18n/catalog.ts src/__tests__/ui-copy-table.ts`: vacío.
- `graphify update .` en el worktree: ok (AST).
- Anclas al cerrar (esperado de tasks.md): `headerShown` 8, `## Enmienda` 27, `rounded-16` pairing 4, `rounded-22` 1, `chunkyLip.danger` 2, `className="gap-4" style={{ flexGrow: 1 }}` 2, import del bottom-sheet 1, `insets.top + 8` 1/1/1, `ChevronLeft` 1/1/1, `'screens/alerts/index.tsx'` AC 6 / PC 1, `'screens/alert-detail/index.tsx'` AC 1 / PC 3, `'screens/pairing/index.tsx'` AC 2, `toBe(10 + 1 + 1)` 1, `toBe(10 + 1)` 0, total de radios 16 de F27 = 26+1+1+1+2+2+1+1+1+2 = 38, suma `bg-accent-soft` de F24/F25 = 3, `HomeEntrance` 0 en alerts y alert-detail (fuente y tests), `Alert.alert` 0, `HeaderHeightContext` 0, `useContext` 0, `paddingVertical: 24` 0, `pairing-pet-row` 0, `text-2xl font-black` 0, `bg-accent-soft` pairing 0, `paddingTop: 24` 0/0, `tracking-` alerts 1, `canGoBack` pairing.test 1, `not.toHaveProperty('flexGrow')` 0, suelo `cardElements` `35 - 1 - 1 - 1 + 1` 1 (HeroUI floors sin moverse, ninguno rojo). Todos coinciden.
- Ficheros tocados desde H0 (`git diff --name-only 435059b2..HEAD -- mobile-pet-tracker/ docs/`): 16, igual que la lista cerrada menos `canvas-foundations.test.ts` (F1 ya no existe): `docs/ui-guidelines.md`, `_layout.tsx`, `layout.test.tsx`, `alert-detail.navigation.test.tsx`, `alert-detail/index.{tsx,test.tsx}`, `alerts/index.{tsx,test.tsx}`, `alerts/rise-delays.ts`, `pairing/index.{tsx,test.tsx}`, `design-drift`, `consistency-classnames`, `chunky-cta-canvas-fidelity`, `alerts-canvas-fidelity`, `profile-canvas-fidelity`, `collar-alerts-canvas-fidelity` (nuevo). Ningún fichero de la lista de no tocar.
- Skills: ver arriba (cinco cargadas, `expo-tailwind-setup` no encontrada).

## Tabla R1 a R12 -> test -> commit
| R | Test (fichero › it) | Commit rojo | Commit verde |
|---|---|---|---|
| R1 | `src/app/__tests__/layout.test.tsx` › `#203 R1: %s oculta la cabecera nativa` | `01167214` | `b41a5118` |
| R2 | `src/screens/pairing/index.test.tsx` › `#203 R2.1` a `#203 R2.4` | `f61299ab` | `4ac62813` |
| R3 | pairing › `#203 R3: %s entra con RiseIn %i` | `d09c24c5` | `c04fb181` |
| R4 | pairing › `#203 R4.1` a `#203 R4.3` | `4f8eec63` | `8e18bfe8` |
| R5 | pairing › `#203 R5` (dos `it`) | `581ef0bb` | `2fba8162` |
| R6 | pairing › `#203 R6: desvincular es 54, radio 16, labio rojo y va al fondo` | `fddd70af` | `88d75d24` |
| R7 | pairing › `#203 R7.1` a `#203 R7.8` | `17917920` | `c4555d2c` |
| R8 | `src/screens/alerts/index.test.tsx` › `#203 R8` | `214e17fc` | `177aed0f` |
| R9 | alerts › `#203 R9: envuelve e0 a e4 con RiseIn …` | `6ca3aba1` | `bd6e49bb` |
| R10 | `src/screens/alert-detail/index.test.tsx` › `#203 R10` | `9060bebc` | `c4ceb49b` |
| R11 | alert-detail › `#203 R11: la tarjeta entra en 0 y el mapa en 80 con RiseIn` | `7df7f6bf` | `662a4077` |
| R12 | `src/__tests__/collar-alerts-canvas-fidelity.test.ts` › `#203 R12: %s` | `d580239e` (nace verde) | n/a |

## Lista de comprobación del smoke (humano, dev build Android, no Expo Go; tema claro y oscuro, y con «reducir movimiento»)
- [ ] 1. Pairing, Alertas y Detalle: la cabecera queda a la altura del artboard bajo la barra de estado; el volver (y el gesto atrás) regresan a la pantalla previa o a Perfil / Inicio / Alertas sin historial (R2, R8, R10).
- [ ] 2. Vincular: hero, aviso de plan y código suben escalonados (R3).
- [ ] 3. Vista con collar: título 28, tarjeta con radio 22 y sombra suave (ver observación R4.2 sobre `rounded-card` junto a `rounded-22`), valores verdes en batería y conexión en línea, píldora con punto, botón rojo con labio pegado al fondo sin recortar (R4 a R6).
- [ ] 4. Hoja: abre a media pantalla con todo visible; Cancelar y deslizar cierran sin desvincular; Desvincular libera y vuelve al formulario (R7).
- [ ] 5. Alertas: las cinco primeras filas suben escalonadas; la insignia de nuevas sale junto al título (R8, R9).
- [ ] 6. Detalle: tarjeta y mapa suben con 80 ms de diferencia (R11).
- [ ] 7. Celebración: igual que antes (D7).
- [ ] 8. Con «reducir movimiento» activado, nada sube (R3, R9, R11).
