# impl: mobile-canvas-map (#201)
Fecha: 2026-10-24

## Primer comando
```
/home/claude/sites/Pet-Tracker-wt-201
feature/201-mobile-canvas-map
b4924c5d chore(spec): errata #201 E1, fila 28 del inventario (cota cardElements de HM)
```
Coincide con el handoff (ruta, branch, HEAD b4924c5d).

## Skills
- Cargadas: `expo:expo-overview`, `expo:expo-native-ui`, `expo:expo-design-system`, `expo:expo-animation` (equivalente de `animate-expo` en nuestro catalogo; no se cargo aparte), `appllama-app-design-skill` (solo el patron; sin bucle de simulador ni creditos del MCP de appllama).
- No encontradas: `expo-tailwind-setup` (no existe en nuestro catalogo, segun el handoff; no se busco). `animate-expo` no se cargo por separado: `expo:expo-animation` cubre R1 y `PopIn`.
- La carta (`docs/ui-guidelines.md`) gana sobre cualquier skill.

## Base T0
Anclas del handoff (87 lineas, la linea `cd` no cuenta), ejecutadas tal cual desde `mobile-pet-tracker/`, cada una comparada por script con el valor esperado: 87 OK, 0 DIFF.

```
grep -cF '<EmptyState' src/screens/map/index.tsx => 2 (esp 2) OK
grep -cF 'text-accent-strong' src/screens/map/index.tsx => 2 (esp 2) OK
grep -cF 'style={CONTINUOUS_CORNER}' src/screens/map/index.tsx => 4 (esp 4) OK
grep -cF 'react-native-reanimated' src/screens/map/index.tsx => 0 (esp 0) OK
grep -cF 'testID="map-retry"' src/screens/map/index.tsx => 1 (esp 1) OK
grep -cF 'testID="map-last-retry"' src/screens/map/index.tsx => 1 (esp 1) OK
grep -cF 'pose="collar"' src/screens/map/index.tsx => 1 (esp 1) OK
grep -cF '<Skeleton' src/screens/map/index.tsx => 1 (esp 1) OK
grep -cF 'variant="pulse"' src/screens/map/index.tsx => 0 (esp 0) OK
grep -cF 'animation=' src/screens/map/index.tsx => 0 (esp 0) OK
grep -cF 'useChunkyLip' src/screens/map/index.tsx => 0 (esp 0) OK
grep -cF 'const chunkyLip = useChunkyLip();' src/screens/map/index.tsx => 0 (esp 0) OK
grep -cF "from 'reicon-react-native'" src/screens/map/index.tsx => 0 (esp 0) OK
grep -cF '<Card' src/screens/map/index.tsx => 2 (esp 2) OK
grep -cF 'rounded-xl' src/screens/map/index.tsx => 5 (esp 5) OK
grep -oF 'rounded-14' src/screens/map/index.tsx | wc -l => 0 (esp 0) OK
grep -oF 'rounded-16' src/screens/map/index.tsx | wc -l => 0 (esp 0) OK
grep -cF 'text-15' src/screens/map/index.tsx => 0 (esp 0) OK
grep -cF 'bg-category-' src/screens/map/index.tsx => 0 (esp 0) OK
grep -cF 'text-category-' src/screens/map/index.tsx => 0 (esp 0) OK
grep -cF "import { CATEGORY_SLOTS } from '../../utils/category-palette';" src/screens/map/index.tsx => 0 (esp 0) OK
grep -oF 'CATEGORY_SLOTS.rose.surface' src/screens/map/index.tsx | wc -l => 0 (esp 0) OK
grep -oF 'CATEGORY_SLOTS.rose.ink' src/screens/map/index.tsx | wc -l => 0 (esp 0) OK
grep -cF 'flex-1 items-center justify-center p-6 bg-background' src/screens/map/index.tsx => 2 (esp 2) OK
grep -cF 'useThemeColors' src/screens/map/index.tsx => 0 (esp 0) OK
grep -cF '<PopIn' src/screens/map/index.tsx => 0 (esp 0) OK
grep -cF 'react-native-svg' src/screens/map/index.tsx => 0 (esp 0) OK
grep -cF 'polylineWidth' src/components/pet-map.tsx => 0 (esp 0) OK
grep -cF "'accent-strong', 'tab-pill'" src/components/pet-map.tsx => 1 (esp 1) OK
grep -cF 'badge' src/components/empty-state.tsx => 3 (esp 3) OK
grep -cF 'actionIcon' src/components/empty-state.tsx => 3 (esp 3) OK
grep -cF 'body: string' src/components/empty-state.tsx => 0 (esp 0) OK
grep -cF 'body?: string' src/components/empty-state.tsx => 1 (esp 1) OK
grep -cF '<Plus size={20}' src/components/empty-state.tsx => 1 (esp 1) OK
grep -cF "jest.mock('react-native-reanimated'" src/screens/map/index.test.tsx => 0 (esp 0) OK
grep -cF "jest.mock('reicon-react-native'" src/screens/map/index.test.tsx => 0 (esp 0) OK
grep -cF "jest.mock('../../theme/use-theme-colors'" src/screens/map/index.test.tsx => 0 (esp 0) OK
grep -cF "'map-retry'" src/screens/map/index.test.tsx => 2 (esp 2) OK
grep -cF "'map-last-retry'" src/screens/map/index.test.tsx => 5 (esp 5) OK
grep -cF 'pingo-collar' src/screens/map/index.test.tsx => 1 (esp 1) OK
grep -cF '#201' src/screens/map/index.test.tsx => 0 (esp 0) OK
grep -cF "'flex-1 items-center justify-center p-6 bg-background'" src/screens/map/index.test.tsx => 2 (esp 2) OK
grep -cF "'items-center gap-3 py-8'" src/screens/map/index.test.tsx => 1 (esp 1) OK
grep -cF 'mt-1 text-2xs font-normal text-muted' src/screens/map/index.test.tsx => 1 (esp 1) OK
grep -cF "['src/screens/map/index.tsx', 2]," src/components/__tests__/empty-state.test.tsx => 1 (esp 1) OK
grep -cF "['src/screens/map/index.tsx', 'entering=']," src/components/__tests__/empty-state.test.tsx => 1 (esp 1) OK
grep -cF "[join('screens', 'map', 'index.tsx'), 2]," src/__tests__/legibility-classnames.test.ts => 1 (esp 1) OK
grep -cF "'components/empty-state.tsx', 'components/toggle-switch.tsx', 'theme/shadows.ts'" src/__tests__/legibility-classnames.test.ts => 1 (esp 1) OK
grep -cF 'los estados sin collar no traen movimiento ni dependencias' src/components/__tests__/empty-state.test.tsx => 1 (esp 1) OK
grep -cF 'el sin collar del mapa no trae LayoutAnimation' src/components/__tests__/empty-state.test.tsx => 0 (esp 0) OK
grep -cF "['src/screens/map/index.tsx', '" src/components/__tests__/empty-state.test.tsx => 7 (esp 7) OK
grep -cF '#201 R14' src/components/__tests__/empty-state.test.tsx => 0 (esp 0) OK
grep -cF '#198 R18' src/components/__tests__/empty-state-hero.test.tsx => 7 (esp 7) OK
grep -oF "'screens/map/index.tsx'" src/__tests__/chunky-cta-canvas-fidelity.test.ts | wc -l => 0 (esp 0) OK
grep -cF '(enmendado por #201 R13)' src/__tests__/chunky-cta-canvas-fidelity.test.ts => 0 (esp 0) OK
grep -cF 'diecisiete consumidores' src/__tests__/chunky-cta-canvas-fidelity.test.ts => 1 (esp 1) OK
grep -cF 'los dieciocho consumidores usan el hook' src/__tests__/chunky-cta-canvas-fidelity.test.ts => 0 (esp 0) OK
grep -cF 'los dieciocho ficheros respetan' src/__tests__/chunky-cta-canvas-fidelity.test.ts => 1 (esp 1) OK
grep -cF 'los diecinueve ficheros respetan' src/__tests__/chunky-cta-canvas-fidelity.test.ts => 0 (esp 0) OK
grep -cF "join('screens', 'map', 'index.tsx')" src/__tests__/design-drift.test.ts => 0 (esp 0) OK
grep -cF "'screens/map/index.tsx': 1, // #201 R13" src/__tests__/design-drift.test.ts => 0 (esp 0) OK
grep -cF '(enmendado por #198 R9) (enmendado por #201 R5, R13)' src/__tests__/design-drift.test.ts => 0 (esp 0) OK
grep -cF "'screens/map/index.tsx', // #201 R2" src/__tests__/alerts-canvas-fidelity.test.ts => 0 (esp 0) OK
grep -cF '(enmendado por #198 R9, R15) (enmendado por #201 R2)' src/__tests__/alerts-canvas-fidelity.test.ts => 0 (esp 0) OK
grep -cF "expect(inventory.files).toEqual([join('utils', 'category-palette.ts')]);" src/__tests__/consistency-classnames.test.ts => 1 (esp 1) OK
grep -cF '#197 R20' src/__tests__/canvas-foundations.test.ts => 0 (esp 0) OK
grep -cF '26 + 1 + 1 + 1 + 2 + 2 + 1 + 1);' src/__tests__/chunky-cta-canvas-fidelity.test.ts => 1 (esp 1) OK
grep -cF '26 + 1 + 1 + 1 + 2 + 2 + 1 + 1 + 1);' src/__tests__/chunky-cta-canvas-fidelity.test.ts => 0 (esp 0) OK
grep -cF '#199 R14 (+1); #201 R13 (+1) // #194 R6' src/__tests__/chunky-cta-canvas-fidelity.test.ts => 0 (esp 0) OK
grep -cF '(enmendado por #199 R14) (enmendado por #198 R9)' src/__tests__/chunky-cta-canvas-fidelity.test.ts => 1 (esp 1) OK
grep -cF '(enmendado por #198 R9) (enmendado por #201 R13)' src/__tests__/chunky-cta-canvas-fidelity.test.ts => 0 (esp 0) OK
grep -cF "[join('screens', 'map', 'index.tsx'), 2 - 1], // #201 R5" src/__tests__/legibility-classnames.test.ts => 0 (esp 0) OK
grep -cF '        - 1 // #201 R5' src/__tests__/legibility-classnames.test.ts => 0 (esp 0) OK
grep -cF '(enmendado por #199 R18) (enmendado por #198 R4)' src/__tests__/legibility-classnames.test.ts => 2 (esp 2) OK
grep -cF '(enmendado por #198 R4) (enmendado por #201 R5)' src/__tests__/legibility-classnames.test.ts => 0 (esp 0) OK
grep -cF '(enmendado por #199 R18) (enmendado por #198 R9)' src/__tests__/design-drift.test.ts => 1 (esp 1) OK
grep -cF "join('screens', 'health', 'index.tsx'), // #199 R18" src/__tests__/design-drift.test.ts => 1 (esp 1) OK
grep -cF '(enmendado por #199 R16) (enmendado por #198 R9, R15)' src/__tests__/alerts-canvas-fidelity.test.ts => 1 (esp 1) OK
grep -cF "'screens/weight-log/index.tsx', // #199 R10" src/__tests__/alerts-canvas-fidelity.test.ts => 1 (esp 1) OK
test ! -e src/__tests__/map-canvas-fidelity.test.ts && echo ausente => ausente (esp ausente) OK
test -e src/__tests__/canvas-foundations.test.ts && echo existe => existe (esp existe) OK
test -e src/theme/shadows.ts && echo existe => existe (esp existe) OK
grep -cF 'MOTION_RISE' src/theme/motion.ts => 2 (esp 2) OK
grep -cF 'toBeGreaterThanOrEqual(35 - 1 - 1 - 1 + 1); // #188 R18' src/__tests__/heroui-text-size-merge.test.ts => 1 (esp 1) OK
grep -cF '#199 R19: +1; #201 R4: -1' src/__tests__/heroui-text-size-merge.test.ts => 0 (esp 0) OK
grep -cF '(enmendado por #201 R' src/screens/map/index.test.tsx => 0 (esp 0) OK
test ! -e .expo/types/router.d.ts && echo sin-router-d-ts => sin-router-d-ts (esp sin-router-d-ts) OK
```

Base de tests (T0): `pgrep -af '[i]nit.sh'` mostro un `bash ./init.sh` real (pid 2385063, ~5 min de vida, lo lanzo el leader). Segun el handoff no corro la suite completa ahora: sigo con tests dirigidos y la completa (base) queda para cuando no haya init.sh. Se anota aqui cuando se corra.

## Commits
- 08cbc116 `test(#201): R15 route stroke width 5 via polylineWidth (red)` | Tests: PM 2 its nuevos (1 rojo, 1 nace verde), MT 2 rojos (el nuevo y el 503 enmendado), CF 1 rojo; todos por aserción
- 6dcf8701 `feat(#201): R15 draw the day route with stroke width 5` | Tests: PM+CF 19/19, MT 272/272, typecheck exit 0
- 87f3198e `test(#201): R1 map-stats rises 14 on entry with gap-2.5 (red)` | Tests: MT 1 rojo por aserción (`map-stats sube 14…`: Expected `gap-2.5`, Received `gap-2`), CF R1 2 rojos por aserción, ES 100/100 (fila 20 enmendada, verde), EH 19/19 (6 `#198 R18` verdes); nacen verdes: MT `con movimiento reducido…` y fila 15 enmendada (producción aún no anima nada)
- (R1 verde: NO commiteado, ver «Parada»)

## Enmiendas mecanicas
| It | R | Antes | Despues | Motivo |
|---|---|---|---|---|
| MT `R7: ruta del día como polylines` › `R3 (android-map-never-ready): pasa una polyline mapeada por cada viaje` (era linea 503) | R15 | `toEqual` de las dos polylines sin `width` | titulo + ` (enmendado por #201 R15)` y `width: 5` en cada polilinea esperada | No esta en el inventario de 28 filas. Es BORDERLINE: R15 AÑADE la clave `width`, no quita un literal; lo trate como mecanica porque el it compara el objeto exacto que R15 cambia (`toEqual` sin `width`) y la enmienda endurece el candado, no lo debilita. Consecuencia: `grep -cF '(enmendado por #201 R' src/screens/map/index.test.tsx` terminara en 24 (23 del inventario + esta), no 23. El leader decide si la acepta. |

## Sondas de mutacion
- R15: M1 `{ width: undefined }` cuando falta la prop -> PM `sin polylineWidth` rojo (aserción `not.toHaveProperty`). M2 `width: props.polylineWidth ?? 5` siempre -> PM `sin polylineWidth` rojo y el R3 existente rojo. M3 pantalla pasa `polylineWidth={4}` -> CF R15 rojo. Todas revertidas; `git diff` de producción = solo las 3 lineas de R15.
- El it PM `sin polylineWidth` nace verde (negativo): su rojo lo prueba M1/M2.

## Mocks añadidos en MT
- Doble 1 (Reanimated, `__esModule: true`, `mockUseReducedMotion`) en 87f3198e (commit rojo de R1).

## Candados enmendados (inventario)
- Fila 15 (MT, R1, 87f3198e): `el punto del GPS no anima (enmendado por #201 R1)`; antes: no anima por ausencia de `Animated`; ahora: `findByTestId('map-pet-pill-dot')`, `type === 'View'`, `props.entering` undefined. Nace verde; sonda pendiente (no llegué).
- Fila 20 (ES, R1, 87f3198e): describe retitulado `#159 R9: el sin collar del mapa no trae LayoutAnimation y el de zonas no trae movimiento ni dependencias`; `it.each` de 10 a 6 filas (mapa `LayoutAnimation` + cinco de geofences); plantilla `'%s no contiene %s (enmendado por #201 R1)'`. Verde. Sonda pendiente.

## Filas de CF subidas
- R15 (08cbc116): fila nueva `Mapa` `stroke="#107148" stroke-width="5"` x1 / `polylineWidth={5}` x1.
- R1 (87f3198e): dos filas nuevas `Mapa`: `animation: rise 400ms ease-out both` x1 / `homeEntering(0, MOTION_RISE_OFFSET_Y)` x1; `bottom: 104px; display: flex; flex-direction: column; gap: 10px` x1 / `className="gap-2.5"` x1 (sube a 2 en R10).

## Parada: R1 verde pone en rojo dos its no inventariados
Estado: parado en R1 (commit rojo 87f3198e hecho; verde NO commiteado; el árbol de `src/screens/map/index.tsx` está revertido a HEAD, sin cambios sin commitear en `mobile-pet-tracker/`).

Cambio de producción probado (68 líneas de diff incluyendo contexto; el parche queda en `/tmp/claude-1002/-home-claude-sites-Pet-Tracker/ad9357a2-d69d-40e4-8877-cbe2e7790272/scratchpad/r1-green.patch` y se resume aquí): en `src/screens/map/index.tsx`, `import Animated, { useReducedMotion } from 'react-native-reanimated';`, `import { MOTION_RISE_OFFSET_Y } from '../../theme/motion';`, `import { homeEntering } from '../home/home-entrance';`, `const reducedMotion = useReducedMotion();` tras `useSafeAreaInsets()`, y `map-stats` pasa de `<View ... className="gap-2">` a `<Animated.View ... className="gap-2.5" entering={reducedMotion ? undefined : homeEntering(0, MOTION_RISE_OFFSET_Y)}>` con el mismo `style` objeto y su cierre `</Animated.View>`.

Resultado medido con ese cambio (MT + CF + ES + EH: 393 its; guards restantes design-drift, consistency-classnames, legibility-classnames, chunky-cta-canvas-fidelity, alerts-canvas-fidelity, canvas-foundations, ui-language, heroui-text-size-merge, pet-map: 460/460 verdes): los its nuevos de R1 en verde, CF y ES verdes, EH verde, y SOLO dos rojos, ambos en MT y ambos no inventariados:

1. `R8: stats calculadas de positions y trips › uses the latest speed, trip total, fresh age, and live GPS` (`src/screens/map/index.test.tsx:626`).
2. `#61 R11: el overlay de stats reparte los cuatro tiles en 2x2 sin envolver › conserva los cuatro tiles, su orden de lectura y el overlay absoluto` (`src/screens/map/index.test.tsx:1230`). Este está en la lista «Se comprobó que siguen verdes sin cambios» de la spec («`#61 R11`»), que la spec dice que no se toca.

Ambos hacen `expect(screen.getByTestId('map-stats').props.style).toEqual(expect.objectContaining({ position: 'absolute', left: 16, right: 16, bottom: 120 }))`. Diff medido:
```
Expected: ObjectContaining {"bottom": 120, "left": 16, "position": "absolute", "right": 16}
Received: [{"bottom": 120, "left": 16, "position": "absolute", "right": 16}]
```
Causa: `Animated.View` de Reanimated entrega `props.style` como array de un elemento; con `View` era el objeto. El estilo es el mismo objeto de hoy (R1 lo exige); cambia el envoltorio, no un literal que R1 quite o sustituya. Por eso no lo traté como «Enmienda mecánica permitida» (no compara contra un literal que R1 quite) y paré, como manda el handoff. No enmendé nada por mi cuenta.

Propuesta para el leader (decisión suya): añadir al inventario estas dos its como filas del commit rojo de R1, con `StyleSheet.flatten(screen.getByTestId('map-stats').props.style)` en lugar de `props.style` (el handoff permite `StyleSheet.flatten` en MT; ninguna lista `featureFiles` lo veta salvo `StyleSheet.create`), con el sufijo ` (enmendado por #201 R1)`; sacar `#61 R11` de la lista de «siguen verdes»; y subir el cierre del recuento de `(enmendado por #201 R` en MT de 23 a 25 (26 con la enmienda del 503 de R15). Con eso, el parche de R1 verde de arriba está listo y no tiene otros efectos medidos. Mientras no se decida: si el leader prefiere aceptar esas dos como mecánicas, basta con decírmelo y se enmiendan en el commit rojo de R1 (fixup) y se sigue.

Pendiente tras esa decisión: sondas de mutación de R1 (entering siempre puesto ignorando movimiento reducido; offset distinto de 14; quitar `gap-2.5`; `LayoutAnimation` plantado en el mapa y `entering=` plantado en geofences para la fila 20; `Animated` en el punto del GPS para la fila 15), y R2 a R16.

Baseline de suite completa: no corrida (había un `init.sh` real al arrancar; no se re-comprobó). Tampoco se corrió typecheck/lint tras R15 más allá del typecheck de 6dcf8701.


## Reanudación tras E2
Ejecutor: fallback Sonnet 5.5 del implementer (Codex sin cuota). Rama verificada antes de cada commit. Sin `init.sh` ni Monitor; jest solo dirigido (`pgrep -af '[i]nit.sh'` vacío al arrancar).

- dea9ba0c `test(#201): R1 filas 29 y 30 del inventario a toHaveStyle (errata E2)` | Tests: MT 273/274 (1 rojo por aserción: `#201 R1: map-stats sube 14 desde transparente`; las filas 29 y 30 enmendadas pasan sobre `View`)
- 185cd67e `feat(#201): R1 map-stats rises on entry with gap-2.5` | Tests: MT+CF+ES+EH 393/393
  - Sondas R1 (plantadas en `index.tsx`/`geofences/index.tsx`, vistas rojas, revertidas; `git diff --stat` solo muestra el parche de R1):
    - P1 `entering` siempre puesto ignorando movimiento reducido: rojo `#201 R1: con movimiento reducido map-stats no anima la entrada` (MT 1 rojo).
    - P2 offset 10 en vez de `MOTION_RISE_OFFSET_Y`: rojo MT `map-stats sube 14 desde transparente` y CF `animation: rise 400ms ease-out both` (2 rojos).
    - P3 `gap-2` en vez de `gap-2.5`: rojo MT `map-stats sube 14...` (className) y CF `bottom: 104px; ... gap: 10px` (2 rojos).
    - P4a `// LayoutAnimation` en el mapa: rojo ES `src/screens/map/index.tsx no contiene LayoutAnimation (enmendado por #201 R1)` (fila 20).
    - P4b `// entering=` en geofences: rojo ES `src/screens/geofences/index.tsx no contiene entering= (enmendado por #201 R1)` (fila 20).
    - P5 `Animated.View entering` en `map-pet-pill-dot`: rojo MT `el punto del GPS no anima (enmendado por #201 R1)` (fila 15).
  - Filas 29 y 30 (E2): verdes sobre `View` (dea9ba0c) y sobre `Animated.View` (este commit).
- c5791111 `test(#201 R2): glass pill with 28 avatar, text-15 name and GPS group (red)` | Tests: MT+CF+AF+ES+EH 21 rojos / 315 (todos por aserción, sin errores de import ni excepción). Filas nuevas CF R2 (9, de las cuales 2 nacen verdes: `text-xs font-bold` sobre el canvas del estado y el `--color-glass-surface-strong` de `global.css`, ambas demostradas por mutación abajo). Enmendadas en MT: filas 6-11 (plantilla y títulos con sufijo ` (enmendado por #201 R2)`) y fila 27 (AF: `'screens/map/index.tsx', // #201 R2` en la lista de `text-15` y sufijo en el título).
- 28345d2d `feat(#201): R2 glass pill with 28 avatar, text-15 name and GPS group` | Tests: MT+CF+AF+ES+EH 431/431; LG+DD+CC+HM+PM 262/262.
  - Producción: `useShadows()` una vez en `MapScreen`; cápsula `bg-glass-surface-strong py-1.5 pl-1.5 pr-3.5` con `style={shadows.card}`; `PetAvatar size={28}`; nombre `text-15 font-extrabold`; grupo nuevo `map-pet-pill-gps` (`flex-row items-center gap-1.25`) con punto `size-1.75 rounded-full` (en línea `bg-accent` si `connection === 'online'`, si no el `dot` de `STATUS_TONE_CLASSES`) y estado `text-xs font-bold`. `accessibilityLabel` sin cambio. `STATUS_TONE_CLASSES` no se toca (lo usa PetHeroHeader).
  - Aviso: `useShadows()` llama al `useThemeColors` real en MT (aún sin el doble de R7), lo que emite `console.warn` de Uniwind (`--color-foreground`) en la corrida; no falla. El doble 3 de R7 lo quita.
  - Sondas R2 (plantadas, vistas rojas, revertidas; `git status` solo mostró el parche de R2):
    - P1 estado sin `font-bold`: rojo MT (6 filas de la plantilla) y CF `text-xs font-bold` (7 rojos). Demuestra la fila nacida verde.
    - P2 `--color-glass-surface-strong` a 0.8 en `global.css`: rojo CF `--color-glass-surface-strong: rgba(255,255,255,0.86)` (1). Demuestra la otra fila nacida verde.
    - P3 punto online con `bg-success` (sin la rama en línea): rojo MT `online: rotula su estado...` (1).
    - P4 `shadows.floating` en lugar de `shadows.card`: rojo MT `compone la cápsula...`, MT `la píldora lleva la sombra de tarjeta de dos capas` y CF `shadows.card` (3).
    - P5 `gap-1` en lugar de `gap-1.25`: rojo CF `gap-1.25` y MT `el punto y el estado van juntos...` (2).
    - P6 `size={24}`: rojo MT avatar 28 sin foto, MT foto con cacheKey y CF `size={28}` (3).
    - P7 clases viejas `bg-surface px-3 py-2`: rojo MT `compone la cápsula...`, CF `bg-glass-surface-strong` y CF `py-1.5 pl-1.5 pr-3.5` (3).
    - P8 grupo con otro `testID`: rojo MT `fija tres hijos...` y MT `van juntos en map-pet-pill-gps` (2).
    - P9 `screens/map/index.tsx` fuera de la lista `text-15` de AF: rojo AF `limita text-15 a su inventario de producción` (1).
- 3eefc27b `test(#201 R3): pill names and paints the pet from the list (born green, #151)` | Tests: MT+CF 291/291. R3 nace verde (cero cambio de producción; sin commit verde). Importa `PetAvatar` en MT.
  - Sondas R3 (plantadas, vistas rojas, revertidas):
    - Q1 `accessibilityLabel` con otro nombre: rojo `la píldora sigue el nombre de la lista...` (1).
    - Q2 nombre rotulado `Rocky`: rojo `la píldora sigue el nombre de la lista...` (1).
    - Q3 `PetAvatar name="Rocky"` en la píldora: rojo `la cara de la píldora es la de la lista` (1).
    - Q4 `PetAvatar` ignora el nombre (`blobatar("x")`): rojo `la cara de la píldora es la de la lista` y `la sonda distingue las dos caras` (2). Demuestra que la sonda cubre el caso de cara constante.
- f84fb5ff `test(#201 R4): floating stats card without border (red)` | Tests: MT+CF+HM 4 rojos / 321 (por aserción: MT ×2 con `Unable to find ... map-stats-card` y `Expected length: 2 / Received length: 3`; CF ×2 `gap-2.5 rounded-24 bg-surface p-3` y `shadows.floating`). Fila nueva CF `className="gap-2"` (rejilla) nace verde (×1 en H0 y tras R4; R10 la sube a ×2): demostrada por la sonda S6. Fila 28 (HM, errata E1): cota `35 - 1 - 1 - 1 + 1 - 1`, comentario `; #201 R4: -1` y título con ` (enmendado por #201 R4)`; no se pone roja en el rojo, evita el rojo del verde (sonda S7).
- c322db7b `feat(#201): R4 stats card is a borderless View with floating shadow` | Tests: MT+CF+HM+AF+ES+EH+LG+DD+CC+PM 701/701. El botón de modo perdido pasa dentro de `map-stats-card` (el error sigue fuera hasta R8). `Card` sigue importado (lo usa el aviso `map-empty-overlay`).
  - Sondas R4 (plantadas, vistas rojas, revertidas):
    - S1 tarjeta con `border`: rojo MT `la tarjeta de stats es un View sin borde...` y CF `gap-2.5 rounded-24 bg-surface p-3` (2).
    - S2 `shadows.card` en lugar de `shadows.floating`: rojo MT (tarjeta), CF `shadows.floating` y CF R2 `shadows.card` (cuenta ×2) (3).
    - S3 otro `testID`: rojo los 2 MT de R4 (2).
    - S4 `Card` en lugar de `View`: rojo MT `la tarjeta de stats es un View sin borde...` (1).
    - S5 botón fuera de la tarjeta: rojo MT `map-stats tiene dos hijos y la tarjeta agrupa rejilla y botón` (1).
    - S6 rejilla `gap-3`: rojo CF `className="gap-2"` y MT `...agrupa rejilla y botón` (2). Demuestra la fila nacida verde.
    - S7 HM con la cota original `35 - 1 - 1 - 1 + 1`: rojo HM `#187 R1: el escáner cubre al menos el universo medido` (1). Demuestra que la fila 28 hacía falta (E1).
- f3b9b4ba `test(#201 R5): tiles put the label on top with the canvas ink` | Tests: MT 12 rojos / 284; CF+LG+DD 7 rojos / 160 (todos por aserción: MT `Expected ... Received` de className y orden de hijos; CF cuenta de producción `Expected: 4 / Received: 0` con la cuenta del canvas ya verde; LG `Expected length: 1 / Received length: 2` y total `Expected: 21 / Received: 22`; DD lista de `rounded-14`). Enmiendas mecánicas de este commit: fila 12 (`#116 R5`, título nuevo con sufijo), fila 13 (`#116 R6` plantilla, `#116 R7` ×2), fila 25 (LG), fila 26 (DD, solo mitad R5). Sufijo `(enmendado por #201 R` en MT: 14 tras este commit (10 antes).
- 75ac3bc7 `feat(#201): R5 stat tiles show the label on top with rounded-14 and canvas ink` | Tests: 13 guardas 879/879 (log `progress/jest-201-r5-green.log`). Batería con dato y sin dato usa `${batteryPct === null ? 'text-base' : 'text-xl'} font-black ${batteryTone.text}` de forma interina: los cuatro `#116 R7` de guion siguen esperando `text-base font-black text-muted` hasta que R6 los enmiende y reemplace la rama por el literal único.
  - Sondas R5 (plantadas, vistas rojas, revertidas):
    - T1 un tile con `rounded-xl`: rojo MT `#201 R5 ... stat-speed` y CF `rounded-14 bg-default px-3 py-2.5` ×4 (2).
    - T2 velocidad con `text-base`: rojo MT `stat-speed` y CF `text-xl font-black text-accent-strong` (2).
    - T3 distancia con `text-accent-strong`: rojo MT `stat-distance`, LG fila del mapa y LG total (3).
    - T4 un rótulo con `text-xs`: rojo MT `stat-speed` y CF `text-11 font-semibold text-muted` (2).
    - T5 actualizado con `font-black`: rojo MT `stat-updated` y CF `text-base font-bold text-muted` (2).
    - T6 batería alta/baja con `text-base`: rojo las seis filas de `#116 R6` y los dos `#116 R7` (8).
    - T7 DD sin el mapa en la lista de `rounded-14`: rojo DD fila 26 (1).
  - Aviso de entorno: `scratchpad/probe.sh` fue reemplazado por otro agente con la misma ruta de scratchpad; desde R6 uso `probe201.sh` y `guards201.sh`.
- b205a365 `test(#201 R6): dash values read muted at text-xl` | Tests: MT+CF 9 rojos / 308 (por aserción: `Expected "text-xl font-black text-muted"` contra `text-base font-black text-muted` en los cuatro `#116 R7`, contra `text-xl font-black text-accent-strong` / `text-foreground` / `text-base font-bold text-muted` en los cuatro `#201 R6`; CF `Expected: 1 / Received: 0`). Fila 14 enmendada (cuatro títulos con sufijo). Sufijo `(enmendado por #201 R` en MT: 18.
  - Los dos `it` de `#116 R7` de `lee la batería del detalle...` y `repinta...` no se tocan en R6 (su tinta tiene dato).
- Commit verde R6 (ver `git log`) `feat(#201): R6 dash values read muted at text-xl` | Tests: 13 guardas 884/884 (log `progress/jest-201-r6-green2.log`). Producción: constante de módulo `const STAT_DASH = 'text-xl font-black text-muted';` (una sola vez, comentario `// #201 R6`) usada por velocidad, distancia y actualizado; la batería no necesita rama porque `batteryTone.text` ya es `text-muted` cuando `batteryPct === null`, así que su className es `text-xl font-black ${batteryTone.text}` (el literal `'text-xl font-black text-muted'` sigue escrito una vez).
  - Sondas R6 (plantadas, vistas rojas, revertidas):
    - U1 velocidad sin rama de guion: rojo MT `velocidad sin posición` y `velocidad sin dato` (2).
    - U2 `STAT_DASH` con `text-base`: rojo los cuatro `#116 R7`, los cuatro `#201 R6` y CF `'text-xl font-black text-muted'` (9).
    - U3 distancia sin rama: rojo MT `distancia sin ruta se apaga` (1).
    - U4 actualizado sin rama: rojo MT `actualizado sin posición se apaga` (1).
    - U5 (primera forma, con rama `batteryPct === null ? STAT_DASH`): quitar la rama dejó todo en verde (mutación equivalente: el tono `muted` ya pinta `text-muted`); por eso la rama se retiró del código. U5b batería sin dato con `text-base` en la plantilla: rojo 12 (los cuatro `#116 R7` de guion, las seis filas de `#116 R6` y los dos `#116 R7` con dato).
    - U6 literal escrito dos veces (en la rama de batería): rojo CF `'text-xl font-black text-muted'` (cuenta 2).
- Hash explícito del commit verde R6: `74dd6786`.
- 95b6e7aa `test(#201 R7): lost-mode button is rose with a leading triangle` | Tests: MT+CF 7 rojos / 317, todos por aserción (MT: `Expected pattern: / h-12\.5 gap-2 rounded-14 bg-category-rose$/` contra la clase vieja `rounded-xl border border-danger/20 bg-danger-soft`, y la tinta del rótulo; CF: `Expected: 1 / Received: 0` en las cinco filas de producción). Las 13 guardas con los dobles nuevos: solo esos 7 rojos, 886 verdes (log `progress/jest-201-r7-red-guards.log`). Los dobles 2 (`reicon-react-native`) y 3 (`use-theme-colors`) entran en MT en este commit, sin `{ virtual: true }`. Filas CF R7 (7, de las cuales 2 nacen verdes: `--color-category-rose: #FFF0F3` y `--color-category-rose-strong: #D80B34` en `theme/global.css`, porque #197/#198 ya los fijaron).
- b13ac6bd `feat(#201): R7 rose lost-mode button with a leading triangle` | Tests: 13 guardas 893/893 (log `progress/jest-201-r7-green-guards.log`). Producción: `AlertTriangle` (único import de `reicon-react-native` por ahora), `CATEGORY_SLOTS`, un único `useThemeColors(['category-rose-strong'])` en `MapScreen` (nunca `'accent'`); botón `h-12.5 gap-2 rounded-14 ${CATEGORY_SLOTS.rose.surface}` sin `style`, icono `lost-mode-icon` (18, trazo 2.2, `categoryRoseStrong`) antes del rótulo `text-base font-extrabold ${CATEGORY_SLOTS.rose.ink}`. Rol, `isDisabled`, `accessibilityState` y `onPress` intactos. El `console.warn` de Uniwind de R2 desaparece con el doble 3.
  - Sondas R7 (plantadas, vistas rojas, revertidas):
    - V1 sin `CATEGORY_SLOTS.rose.surface` en la clase: rojo MT botón rosa y CF `` `h-12.5 gap-2 rounded-14 ${CATEGORY_SLOTS.rose.surface}` `` (2).
    - V2 `strokeWidth={2}`: rojo MT botón rosa y CF `strokeWidth={2.2}` (2).
    - V3 `style={shadows.floating}` en el botón: rojo MT botón rosa (sin `boxShadow`) y CF R4 `shadows.floating` ×2 (2).
    - V4 rótulo `font-bold`: rojo los dos its de MT R7 (2).
    - V5 `gap-3`: rojo MT botón rosa y CF (2).
    - V6 icono tras el rótulo: rojo MT botón rosa (orden de nodos) (1).
    - V7 `useThemeColors(['muted'])`: rojo MT botón rosa (color del icono) (1).
  - Filas CF subidas por R7: ninguna (R7 abre `h-12.5` ×1 y `strokeWidth={2.2}` ×1; R10 y R9/R11 las suben después).
- 1bd49c3c `test(#201 R8): lost-mode error is the last child of the stats card` | Tests: MT+CF 2 rojos / 320, por aserción (MT `Expected length: 3 / Received length: 2` en los hijos de `map-stats-card`; CF `role="alert"` producción `Expected: 1 / Received: 0`). Las 13 guardas: solo esos 2 rojos, 894 verdes (log `progress/jest-201-r8-red-guards.log`). Fila CF `text-center text-xs font-normal text-danger` ×1 nace verde (el texto del error ya la llevaba).
- 40600ea1 `feat(#201): R8 lost-mode error inside the stats card announced as an alert` | Tests: 13 guardas 896/896 (log `progress/jest-201-r8-green-guards.log`). Producción: el bloque `lostModeFailed ? <Text ... /> : null` pasa dentro de `map-stats-card`, detrás del botón, con `accessibilityRole="alert"`; `className` y `selectable` sin cambio.
  - Sondas R8 (plantadas, vistas rojas, revertidas):
    - W1 sin `accessibilityRole`: rojo MT R8 y CF `accessibilityRole="alert"` (2).
    - W2 `text-sm` en lugar de `text-xs`: rojo MT R8 y CF `text-center text-xs font-normal text-danger` (2). Demuestra la fila nacida verde.
    - W3 error antes del botón dentro de la tarjeta: rojo MT R8 (1).
    - W4 error fuera de la tarjeta (forma de R7): rojo MT R8 (1).
  - Filas CF subidas por R8: ninguna.
- 6993dd71 `test(#201 R9): no-location notice carries the location icon` | Tests: MT+CF 4 rojos / 323, por aserción (MT `Expected pattern: / flex-row items-center justify-center gap-2 px-4 py-3\.5$/` contra `rounded-card border border-border bg-surface shadow-sm items-center p-3`; CF `Expected: 1 / Received: 0` en las dos filas nuevas; CF fila R7 `strokeWidth={2.2}` subida de 1 a 2 en producción, `Expected: 2 / Received: 1`). Las 13 guardas: solo esos 4 rojos, 895 verdes (log `progress/jest-201-r9-red-guards.log`). Como `Card` mezcla su receta con `twMerge`, el MT afirma el final de la clase (el aviso conserva `rounded-card border border-border bg-surface p-4 shadow-sm` delante) y que `p-3` ya no está.
- 3b187687 `feat(#201): R9 no-location notice with a leading location icon` | Tests: 13 guardas 899/899 (log `progress/jest-201-r9-green-guards.log`). Producción: import `Location` junto a `AlertTriangle`, `useThemeColors(['category-rose-strong', 'muted'])` (una sola llamada), `Card` con `flex-row items-center justify-center gap-2 px-4 py-3.5`, icono `map-empty-icon` (18, 2.2, `muted`) y `Text map-empty` con `text-sm font-semibold text-muted`; `testID` sigue siendo el primer atributo de `<Card` y `<Text` (la fila de ES no se enmienda).
  - Sondas R9 (plantadas, vistas rojas, revertidas):
    - X1 trazo 2 en el icono: rojo MT R9 y CF fila R7 `strokeWidth={2.2}` ×2 (2).
    - X2 icono con `categoryRoseStrong`: rojo MT R9 (1).
    - X3 texto `text-base`: rojo MT R9 y CF `text-sm font-semibold text-muted` (2).
    - X4 icono tras el texto: rojo MT R9 (1).
    - X5 `gap-3`: rojo MT R9 y CF `gap-2 px-4 py-3.5` (2).
    - X6 `p-3` colado en la clase: rojo MT R9 (1).
  - Filas CF subidas por R9: `strokeWidth={2.2}` producción 1 -> 2 (fila del describe R7, en el commit rojo 6993dd71).
- b6b8dbd5 `test(#201 R10): loading skeleton is a pulse stack with pill and card` | Tests: MT+CF 18 rojos / 334, todos por aserción (MT: `Expected: "flex-1 bg-default"` contra `flex-1 bg-background`, `Unable to find an element with testID: map-loading-stats`, `Expected length: 11 / Received length: 1`; CF: filas nuevas de MapaCarga `Expected: 11|10|4|1 / Received: 0` y el `it` pulse `Expected length: 11 / Received length: 1`; más siete filas subidas). Las 13 guardas: solo esos 18 rojos, 892 verdes (log `progress/jest-201-r10-red-guards.log`).
- 78954267 `test(#201 R10): read the last skeleton through its pulse wrapper` | Tests: MT R10 3/3 con la producción en el árbol (log `progress/jest-201-r10-green2.log`). Corrección de mi propio test del commit rojo: al correr contra la producción, `elementChild(card, 1).props.className` era `undefined` porque con `variant="pulse"` el host del `Skeleton` cuelga de un `Animated.View` sin clase (lo mismo que afirma el `it` de los once bloques); el test baja un nivel (`elementChild(elementChild(card, 1), 0)`). Va en commit propio de solo test (la producción no se commitea con él); la producción nace después.
- 143bc01c `feat(#201): R10 loading skeleton as an eleven-block pulse stack` | Tests: 13 guardas 910/910 (log `progress/jest-201-r10-green-guards.log`). Producción: `map-loading` pasa de `Skeleton` a `View` `flex-1 bg-default` con `accessibilityState={{ busy: true }}`; hijo único `map-loading-stats` (mismo `style` objeto que `map-stats`, `gap-2.5`) con `map-loading-pill` (`shadows.card`, dos `Skeleton`) y `map-loading-card` (`shadows.floating`, rejilla `gap-2` de dos filas de dos tiles de dos `Skeleton`, y `Skeleton h-12.5 rounded-14 bg-default`). Once `Skeleton` en línea, todos `variant="pulse"`, ninguno con `animation=`.
  - Sondas R10 (plantadas, vistas rojas, revertidas):
    - Y1 `variant="shimmer"` solo en el último `Skeleton` (la acción): rojo MT píldora y tarjeta (el último bloque deja de colgar de la envoltura de pulse), MT once bloques, CF `variant="pulse"` ×11 y CF pulse (4).
    - Y2 quitar solo el `gap-2.5` del esqueleto (cambia a `gap-2`): rojo MT píldora y tarjeta, CF R1 `bottom: 104px...` (cuenta 2) y CF R4 `className="gap-2"` (cuenta 3) (3).
    - Y3 prop `animation="none"` en un `Skeleton`: rojo CF pulse (1).
    - Y4 `bg-background` en `map-loading`: rojo MT ocupada (1).
    - Y5 sin `accessibilityState`: rojo MT ocupada y CF `accessibilityState={{ busy: true }}` (2).
    - Y6 `shadows.floating` en la píldora: rojo MT píldora/tarjeta, CF R2 `shadows.card` (cuenta 1) y CF R4 `shadows.floating` (cuenta 3) (3).
    - Y7 `bottom` con 90: rojo MT píldora/tarjeta (1).
    - Y8 último tile con `gap-2`: rojo MT píldora/tarjeta (1).
    - Y9 `shimmer` solo en el último valor del último tile: rojo CF `variant="pulse"`, CF pulse y MT once bloques (3). Demuestra que el MT de once bloques cubre un `Skeleton` suelto en el fondo del árbol.
    - Y10 `Skeleton` de acción fuera de la tarjeta: rojo MT píldora/tarjeta (1).
  - Filas CF subidas por R10 (en el commit rojo b6b8dbd5, de 1 a 2 en producción): `className="gap-2.5"` (describe R1), `py-1.5 pl-1.5 pr-3.5` y `shadows.card` (R2), `gap-2.5 rounded-24 bg-surface p-3`, `shadows.floating` y `className="gap-2"` (R4), `h-12.5` (R7). Las siete nacen rojas por la cuenta de producción `Expected: 2 / Received: 1` y pasan en el verde.
- 5b5e3724 `test(#201 R11): Pingo on both map error branches (MapaError)` | Tests: MT+CF+ES 24 rojos / 921 en las 13 guardas (log `progress/jest-201-r11-red.log`). Rojos por aserción: MT R11 x4 (`Unable to find an element with testID: map-error-pose`; `Expected: "flex-1 items-center justify-center bg-background px-6 pt-15 pb-30"` contra `flex-1 items-center justify-center gap-3 p-6 bg-background`), los cinco `it` inventariados 1-5 (7 filas con los `it.each`), CF MapaError x7 (`Expected: 2 / Received: 0`), CF fila R7 `strokeWidth={2.2}` subida de 2 a 4 (`Expected: 4 / Received: 2`) y ES fila del mapa (`Expected length: 4 / Received length: 2`). Enmiendas: filas 1-5 y 19 (MT suffix ` (enmendado por #201 R11)` en cinco lineas, total en MT 23).
  - Tres rojos más que no son del R11 ni de la tabla: `R5: mascota free degrada sin mapa › shows the collar requirement...`, `R6 › R8 (android-map-never-ready): el contenedor del mapa no declara fondo opaco` y `R6 › R3 (android-map-never-ready): centra el mapa...`. Son efecto arrastrado del `it.each` de la fila 1 en rojo: el `it` hace `mockResolvedValueOnce(firstState).mockResolvedValueOnce({ ok, [] })` y, al fallar en `map-error-action`, deja encolado el segundo `Once` que consume el siguiente `it`. Demostrado: `jest -t "R5: mascota free|R6: mapa y marker"` (sin la fila 1) da 5/5 en verde sobre el mismo árbol, y desaparecen con el verde. No se enmiendan.
- 3a39f70a `test(#201 R11): reduce motion where the hero action must be visible` | Tests: MT 299/299 con la producción en el árbol. Corrección de mis tests del commit rojo y de las filas 3, 4 y 5 del inventario: el `EmptyState` hero envuelve la acción en `Animated.View` (`map-error-action-wrap`) cuya entrada arranca en `opacity: 0`, y el doble de Reanimated de MT no la hace avanzar, así que `toBeVisible()` (que el inventario pide en filas 4 y 5 y que mis tests de R11 afirman) falla en verde. Los cuatro tests afectados (`Reintentar llama al refetch de last...`, el `it.each` de `reintenta con $kind`, `renderiza la rama de error de pets...` y el `describe` R11 entero) fijan `mockUseReducedMotion.mockReturnValue(true)` al empezar (con comentario `// #201 R11`), la misma técnica que usa EH; las aserciones no cambian. Commit propio de solo test, producción sin añadir. A revisar por el reviewer: es un detalle de las enmiendas 3-5 que el inventario no recoge (pide «visible» sin decir cómo se consigue).
- 9687c788 `feat(#201): R11 Pingo on both map error branches` | Tests: 13 guardas 921/921 (log `progress/jest-201-r11-green.log`), typecheck exit 0. Producción: imports `AlertCircle, AlertTriangle, Location, Refresh` y `PopIn`; `useThemeColors(['accent-foreground', 'category-rose-strong', 'danger', 'muted'])` en una sola llamada (locales `accentForeground`, `categoryRoseStrong`, `danger`, `muted`); `map-error` y `map-last-error` pasan a `EmptyState variant="hero" pose="talk"` sin `body`, `action` con `t('common.retry')` y el refetch de su consulta (`pets.refetch()` / `refetchLast()`), `actionIcon` `Refresh` 20/2.6 y `badge` `PopIn` rosa con `AlertCircle` 26/2.2 `danger`, dentro del envoltorio `flex-1 items-center justify-center bg-background px-6 pt-15 pb-30` (el de `map-last-error` conserva `testID="map-last-error-state"`). Desaparecen `map-retry` y `map-last-retry`.
  - Sondas R11 (plantadas, vistas rojas, revertidas):
    - Z1 badge con `bottom-8` solo en `map-last-error`: rojo MT `map-last-error pinta...` y CF `absolute bottom-8.5 right-9` (cuenta 1) (2).
    - Z2 `color={accentForeground}` en el `AlertCircle` solo de `map-last-error`: rojo MT `map-last-error pinta...` (1).
    - Z3 receta vieja `gap-3 p-6` solo en `map-last-error-state`: rojo MT `map-last-error centra...` y CF `bg-background px-6 pt-15 pb-30` (2).
    - Z4 trazo 2.4 del `Refresh` solo en `map-last-error`: rojo MT `map-last-error pinta...` y CF `strokeWidth={2.6}` (2).
    - Z5 retry de `map-last-error` cableado a `pets.refetch()`: rojo las tres filas de refetch de last (filas 3 y 4 x2) (3).
    - Z6 retry de `map-error` cableado a `refetchLast()`: rojo el `it.each` de la fila 1 x3 y tres rojos arrastrados por el `Once` encolado (6).
    - Z7 `pose="collar"` solo en `map-last-error`: rojo MT `map-last-error pinta...` (1).
    - Z8 `body` añadido solo a `map-error`: rojo MT `map-error pinta...` (1).
    - Z9 sin `variant="hero"` solo en `map-last-error`: rojo MT `map-last-error pinta...` (falta el `action-icon`) (1).
  - Filas CF subidas por R11: `strokeWidth={2.2}` producción 2 -> 4 (fila del describe R7, en el commit rojo 5b5e3724). Filas nuevas que abre R11 y completan R12/R13: `bg-background px-6 pt-15 pb-30` (2), `<PopIn` (2).

### PARADA R12 (rojo fuera del inventario, sin commits de R12)

Estado: HEAD `9687c788` (R11 verde). R12 no tiene commits: la parada ocurre antes del commit rojo, tras un experimento en el árbol de trabajo que revertí (`git checkout HEAD -- mobile-pet-tracker/src/screens/map/index.tsx`; árbol limpio, sin nada por añadir). R15 y R1-R11 están cerrados con sus commits rojo y verde; falta R12, R13, R16 y el cierre (suite completa, T0 final, traceability, S1-S10).

Qué medí. Apliqué en el árbol la producción de R12 (`variant="hero"`, envoltorio `flex-1 items-center justify-center bg-background px-6 pt-15 pb-30`, `actionIcon` `Plus` 20/2.8, import `Plus`) y corrí `src/screens/map/index.test.tsx` (299 tests) sin enmendar nada de R12:

- Rojo esperado, fila 16 del inventario: `#155 R4: Mapa sin mascotas presenta a Pingo › queda en el sitio del vacío que sustituye` (clase del padre).
- Rojo NO inventariado: `#155 R4: Mapa sin mascotas presenta a Pingo › pinta la pose, el título y la frase de Pingo`. Falla en su última aserción, `expect(within(screen.getByTestId('map-no-pets-action')).getByText('Añadir mascota')).toBeVisible()`, con `Received instance is not visible: <Text>Añadir mascota</Text>`.

Causa. Con `variant="hero"`, `EmptyState` envuelve la acción en `<id>-action-wrap` (un `Animated.View` con `useHeroEntrance(3, animateHero)`), cuya entrada arranca en `opacity: 0`; el doble de Reanimated de MT no la hace avanzar, y `toBeVisible()` mira la opacidad de los ancestros. No es un literal que el R-id quite o sustituya, así que no cae en la «Enmienda mecánica permitida» y el handoff manda parar.

Misma causa, vista por adelantado en R13 (apliqué solo `variant="hero"` a `map-no-tracking` en el mismo experimento): ocho rojos más fuera del inventario, todos `expect(within(action).getByText('Vincular collar')).toBeVisible()` de `#159 R3: el dueño sin collar puede ir a emparejar`: `pinta Vincular collar al dueño de una mascota sin collar`, los seis del `it.each` `pinta Vincular collar aunque el listado diga $role $collar: manda el rol y el collar del detalle` y `pinta Vincular collar aunque el listado traiga collar: manda el collar del detalle`. Los demás `#159` (R2 pose y R2 sitio, que sí están en el inventario como filas 17 y 18; R3 `lleva a emparejar una sola vez`, que solo pulsa; R4, que solo mira nulos) no dependen de la opacidad.

Cómo lo resolví en R11, donde sí estaba permitido: las filas 3, 4 y 5 estaban inventariadas con «visible» y no daban el cómo. Les añadí `mockUseReducedMotion.mockReturnValue(true)` al inicio (técnica de EH, `// #201 R11`), commit propio `3a39f70a`; con movimiento reducido `animateHero` es falso y la acción nace con opacidad 1.

Propuesta (decide el leader; no la apliqué):
- Ampliar por escrito la enmienda mecánica a estos 9 `it` (1 en R12, 8 en R13): sufijo ` (enmendado por #201 R12)` / ` (enmendado por #201 R13)` y la misma línea `mockUseReducedMotion.mockReturnValue(true); // #201 R<n>: el héroe entra con opacidad 0` al principio; las aserciones no cambian. Efecto en la cuenta de `(enmendado por #201 R` en MT: 26 + 9 = 35 (o, si se prefiere no tocar títulos, añadir la línea en un `beforeEach` de los dos `describe` `#155 R4` y `#159 R3`, que deja la cuenta en 26; ese `beforeEach` también cubriría el `describe` `#159 R2`, que no la necesita).
- Alternativa más barata si se prefiere no tocar nueve `it`: un `beforeEach` con reduced motion en `describe('#155 R4…')` y `describe('#159 R3…')`, sin sufijos (la cuenta se queda en 26 y no hay títulos nuevos). Es mi recomendación.

Plan de R12 ya medido, para que la reanudación sea corta:
- Commit rojo: MT fila 16 (título `queda en el sitio del vacío que sustituye (enmendado por #201 R12)`, padre `'flex-1 items-center justify-center bg-background px-6 pt-15 pb-30'`), MT `#201 R12: sin mascotas usa el escenario hero con el «+» de trazo 2.8` (`map-no-pets-stage` existe; `map-no-pets-action-icon` `size` 20, `strokeWidth` 2.8), CF `MapaSinMascotas` `stroke-width="2.8"` ×1 / `strokeWidth={2.8}` ×1 y la fila `bg-background px-6 pt-15 pb-30` del describe R11 sube de 2 a 3, más la decisión del leader sobre `pinta la pose, el título y la frase de Pingo`.
- Commit verde: lo ya probado arriba.

Devuelto al leader: `parada R12`.

## Reanudación tras E3

El leader firmó la errata E3 en `98d00838`. Apliqué la alternativa del `beforeEach` (sin títulos ni aserciones nuevas; la cuenta de `(enmendado por #201 R` en MT se queda en 26).

### R12 (cerrado)

- Commit rojo `f83f3a72`: MT fila 16 (título `queda en el sitio del vacío que sustituye (enmendado por #201 R12)`, padre `'flex-1 items-center justify-center bg-background px-6 pt-15 pb-30'`), `beforeEach` de E3 dentro de `describe('#155 R4…')` (`mockUseReducedMotion.mockReturnValue(true); // #201 R12/R13: el héroe entra con opacidad 0`), nuevo `describe('#201 R12: Pingo sin mascotas')` con un `it` (escenario hero y `+` de 20 / trazo 2.8), CF: fila del envoltorio `bg-background px-6 pt-15 pb-30` sube a 3 y `describe('#201 R12…')` con la fila `stroke-width="2.8"` / `strokeWidth={2.8}`. Rojos observados: los cuatro esperados (fila 16, `it` de R12, y las dos filas de CF).
- Commit verde `a0a539aa`: la rama sin mascotas pasa a `EmptyState variant="hero"` (pose `talk`, `body` de `common.noPetsBody`, `actionIcon` `Plus`). MT + CF verdes; las 13 guardas verdes (923 tests = 921 + 2); `bun run typecheck` limpio.
- Sondas de R12 (todas revertidas): trazo del `+` 2.6 en lugar de 2.8 (rojos: CF `strokeWidth={2.6}` de R11, CF R12, MT R12); tamaño 24 (rojo MT R12); envoltorio antiguo (rojos fila 16 y CF del envoltorio); sin `variant="hero"` (rojo MT R12); quitar el `beforeEach` de E3 de `#155 R4` pone rojo `pinta la pose, el título y la frase de Pingo`, así que el `beforeEach` sostiene carga.

### R13 (rojo commiteado; verde no commiteado por la parada de abajo)

- Commit rojo `a86bcd4d` (`test(#201 R13): no-tracking branch shows Pingo with the collar badge`), cuatro ficheros: MT, CF, CC, DD.
  - MT: filas 17 y 18 enmendadas (`pinta la pose de Pingo, el título y la frase (enmendado por #201 R13)` y `queda en el sitio del texto que sustituye y sin mapa debajo (enmendado por #201 R13)`; `pingo-talk.webp`, hueco `'w-full items-center gap-3.5'`, padre `'flex-1 items-center justify-center bg-background px-6 pt-15 pb-30'`); `beforeEach` de E3 en `describe('#159 R3…')`; `import { StyleSheet } from 'react-native'` (para el `boxShadow` aplanado que prescribe R13); `describe('#201 R13: Pingo sin rastreo')` con tres `it`. Forma del árbol de `Svg` medida con la producción puesta: `map-no-tracking-collar` lleva `strokeWidth` 2 y su único hijo es un `RNSVGGroup` cuyos hijos son `RNSVGEllipse`, `RNSVGPath`, `RNSVGCircle`; el `it` lo aserta con `elementChild(collar, 0).children` sin cuarto doble de módulo. El `it` «sin botón» sigue el orden de `#159 R4` (detalle resuelto antes que `no-tracking`).
  - CC: filas 21 a 24 (`consumers` gana el mapa, `radii` gana `'screens/map/index.tsx': 1, // #201 R13`, suma `26 + 1 + 1 + 1 + 2 + 2 + 1 + 1 + 1`, R7.2 y R7.5 primera y cuarta con `{ ...Object.fromEntries(…), 'screens/map/index.tsx': 1 }`, títulos de R7.3, R7.4 «dieciocho consumidores», R7.5, R12.1/R12.2 «diecinueve ficheros» y R12.3 con sufijo).
  - DD: fila 26, sufijo `(enmendado por #198 R9) (enmendado por #201 R5, R13)` y `'screens/map/index.tsx': 1, // #201 R13` en `rounded16`.
  - CF: filas del envoltorio a 4 y de `<PopIn` a 3 (describe de R11) y `describe('#201 R13: Pingo sin rastreo')` con seis filas de `MapaSinRastreo`.
- Rojos observados en el commit rojo: 17, todos esperados. MT 4 (filas 17 y 18, y los `it` de R13 de la pose/badge y del icono de enlace; el `it` «sin botón no hay icono de enlace» nace verde porque la rama sin acción no pinta icono ni hoy ni mañana), CC 4 (R7.2, R7.3, R7.4, R7.5), DD 1 (fila 26), CF 8 (las dos filas subidas, envoltorio a 4 y `<PopIn` a 3, y las seis filas nuevas de R13). Log: `progress/jest-201-r13-red.log`.
- Verde aplicado en el árbol (no commiteado): `progress/r13-green-map-index.patch` (57 líneas, `git apply` sobre `a86bcd4d`). Con él, MT + CF + CC + DD dan 548/548 (`progress/jest-201-r13-green.log`) y `bun run typecheck` limpio.

### PARADA R13 (rojo fuera del inventario en CO, sin commit verde)

Con el verde de R13 puesto, las 13 guardas dan 930 verdes y 2 rojos, los dos en `src/__tests__/consistency-classnames.test.ts` (CO), que el spec declara «no cambia» y el handoff prohíbe tocar. Log: `progress/jest-201-guards-r13.log`; corrida de los otros ficheros que miran el código fuente (`account-screens-polish`, `add-pet-two-steps`, `alert-detail-canvas-fidelity`, `geofences-canvas-fidelity`, `health-weight-canvas-fidelity`, `home-canvas-fidelity`, `nutrition-canvas-fidelity`, `theme/__tests__/chunky-lip`) y CO: solo esos dos rojos (`progress/jest-201-r13-extra.log`).

1. `#62 R1: la escala de radios está declarada y el botón primario tiene un solo radio › deja todos los botones primarios sólidos en un único radio (enmendado por #177 R10)`. Línea 103: `expect(sourceFiles().flatMap(path => readFileSync(path, 'utf8').match(/rounded-16 bg-accent(?=[\s'"`])/g) ?? [])).toHaveLength(16 + 1 + 1); // #194 R6 // #191 R11`. Esperaba 18 y recibe 19.
2. `#166 R2: todo primario sólido lleva el labio detrás de bg-accent › inventaría los diecisiete primarios con labio, fichero a fichero (enmendado por #177 R10)`. El `expected` (líneas ~565-583) no trae `'screens/map/index.tsx': 1`; recibe una clave de más entre `screens/login/index.tsx` y `screens/pairing/index.tsx`.

Causa: la receta del badge que prescribe R13 (`… rounded-16 bg-accent`) coincide con el patrón `rounded-16 bg-accent(?=[\s'"`])` con el que CO inventaría los primarios sólidos. Es el mismo patrón que la fila 21 de CC ya espera con el mapa a 1; CO se quedó fuera del inventario («no cambia: D22», que hablaba solo de `category-palette`). No cabe en la «Enmienda mecánica permitida»: el rojo no nace de un literal que R13 quita o sustituya, sino de uno que añade. Tampoco es E1 a E3.

Propuesta de errata E4 (decide el leader; no la apliqué porque CO no está en la lista cerrada):
- CO `#62 R1` línea 103: `toHaveLength(16 + 1 + 1 + 1); // #194 R6 // #191 R11 // #201 R13`, y sufijo ` (enmendado por #201 R13)` al título.
- CO `#166 R2`: `expected` gana `'screens/map/index.tsx': 1, // #201 R13` entre `'screens/login/index.tsx': 1,` y `'screens/pairing/index.tsx': 1,`, y sufijo ` (enmendado por #201 R13)` al título (el «diecisiete» del título ya no era la cuenta antes de #201; el sufijo no lo cambia).
- Añadir CO a la lista cerrada de ficheros (12 + informe), y decidir si las dos enmiendas van en un commit de test propio previo al verde (`test(#201 R13): …`) o se rehace el commit rojo; el recuento de `(enmendado por #201 R` en MT no cambia. La edición de CO es de dos líneas más dos sufijos.
- Si E4 prefiere no tocar CO, la alternativa es cambiar la receta del badge para que no coincida con el patrón, pero R13, CF (fila de la receta exacta) y la fila 21 de CC fijan esa cadena, así que no es viable sin enmendar más.

Estado al devolver: HEAD `a86bcd4d` (R13 rojo), árbol de `mobile-pet-tracker/`, `specs/` y `docs/` limpio. Quedan pendientes R13 verde (aplicar el parche + E4), R14 (sin commits), R16, las sondas de R13 y las de R1 que quedaron pendientes, y el cierre (suite completa, T0 final, traceability, S1 a S10).

Devuelto al leader: `parada R13`.

## Reanudación tras E4

El leader firmó la errata E4 en `80cc73e9`: CO (`src/__tests__/consistency-classnames.test.ts`) entra en la lista cerrada de ficheros (ahora doce de producción y test más este informe y `traceability.md`), y la receta del badge `rounded-16 bg-accent` con `style={chunkyLip.primary}` cuenta como primario con labio en CO `#62 R1` y `#166 R2`. Ejecutor: fallback Sonnet 5.5 del implementer (Codex sin cuota). Rama verificada antes de cada commit. Sin `init.sh`, sin Monitor, sin push.

### R13 (cerrado)

- Commit de test de CO `af59bbf1` (`test(#201 R13): count the map badge as a lip-backed primary in CO`): títulos de `#62 R1` y `#166 R2` con ` (enmendado por #201 R13)`; línea 103 a `16 + 1 + 1 + 1` con el comentario `// #194 R6 // #191 R11 // #201 R13`; `expected` de `#166 R2` con `'screens/map/index.tsx': 1, // #201 R13` entre `login` y `pairing`. Rojos observados con la producción de R13 puesta: exactamente los dos esperados.
- Commit verde `d16f343e` (`feat(#201): R13 Pingo on the map without tracking`), aplicando `progress/r13-green-map-index.patch` (borrado antes de cerrar): la rama sin rastreo pasa a `EmptyState variant="hero" pose="talk"`, con `action` y `actionIcon` (`Link` 20/2.4) solo si `canPairCollar`, y `badge` `PopIn` `map-no-tracking-badge` (`absolute bottom-10 right-7.5 size-13 items-center justify-center rounded-16 bg-accent`, `style={chunkyLip.primary}`) con el `Svg` `map-no-tracking-collar` (26, trazo 2, `Ellipse`, `Path`, `Circle`). Las 13 guardas dieron 932 verdes (930 + los 2 de CO ya en verde), typecheck limpio.
- Sondas de R13 (plantadas en `src/screens/map/index.tsx` o en MT, vistas rojas, revertidas; `git status` limpio tras cada una):
  - P1 badge `rounded-xl` en lugar de `rounded-16`: rojos MT R13, CF fila de la receta del badge, CO `#62 R1`, CO `#166 R2` y `#98 R10` (siete rojos en cuatro ficheros).
  - P2 `Link` con trazo 2.2 en lugar de 2.4: rojos MT `el dueño sin collar ve el icono de enlace`, CF `strokeWidth={2.4}` y CF R7 `strokeWidth={2.2}` (cuenta).
  - P3 `action` siempre puesto (sin `canPairCollar`): rojos los `#159 R4` (catorce, el botón no debe verse) y, aislado con `-t`, `#201 R13: sin botón no hay icono de enlace`. Demuestra que ese `it`, que nace verde en el commit rojo, sí protege.
  - P4 `pose="collar"`: rojos MT `#159 R2 ... pinta la pose de Pingo` y `#201 R13: sin rastreo pinta a Pingo con el badge del collar`.
  - P5 `Ellipse` movida tras `Path`: rojo MT `sin rastreo pinta a Pingo con el badge del collar` (orden de formas).
  - P6 sin `style={chunkyLip.primary}`: rojos MT badge, CF `style={chunkyLip.primary}` y CC (aserción de `chunkyLip.primary`).
  - P7 collar con `strokeWidth={3}`: rojo MT badge.
  - P8 quitar el `beforeEach` de E3 de `#159 R3`: ocho rojos (`toBeVisible()` bajo opacidad 0). Confirma que el `beforeEach` sostiene carga; lo mismo ya se demostró para `#155 R4` en R12.
- Nace verde, demostrado por P3: MT `#201 R13: sin botón no hay icono de enlace`.

### Sondas de R1 que quedaban pendientes (todas rojas, revertidas)

- Fila 15 (`#116 R8 ... el punto del GPS no anima (enmendado por #201 R1)`): `Animated.View entering={homeEntering(0, MOTION_RISE_OFFSET_Y)}` en `map-pet-pill-dot`: rojo ese `it`.
- Fila 20 (ES `#159 R9 ... src/screens/map/index.tsx no contiene LayoutAnimation (enmendado por #201 R1)`): `// LayoutAnimation` añadido a `index.tsx`: rojo ese `it`.
- Movimiento reducido (`#201 R1: con movimiento reducido map-stats no anima la entrada`): quitar el `reducedMotion ? undefined :`: rojo ese `it`.

### R14 (sin commits)

No cambia producción ni añade tests. Los seis `it` EH `#198 R18` siguen verdes en cada corrida de las 13 guardas y `grep -cF '#201 R14' src/components/__tests__/empty-state.test.tsx` da `0`.

### R16 (nace verde)

- Commit `d19288c7` (`test(#201 R16): drift guards over the three map files (born green)`), solo `src/__tests__/map-canvas-fidelity.test.ts`: `describe('#201 R16: guardas de deriva de los tres ficheros')` con las dos constantes `HEX_LITERAL` y `ARBITRARY_CLASS` copiadas literalmente de `design-drift.test.ts`; 18 filas `#201 R16: %s respeta la guarda %s` (tres ficheros por seis guardas, la primera con las dos regex de hex y de clase arbitraria); `#201 R16: el mapa importa solo sus seis iconos` (un solo `from 'reicon-react-native'` y nombres ordenados `['AlertCircle', 'AlertTriangle', 'Link', 'Location', 'Plus', 'Refresh']`); 8 filas `#201 R16: las guardas cazan su mutación %s`; y `#201 R16: la guarda de hex exime las citas de requisito`. Son 28 `it` (18 + 1 + 8 + 1).
- Las filas de mutación usan los mismos objetos `RegExp` que las guardas (`hexGuard`, `arbitraryGuard`, `styleSheetGuard`, `emojiGuard`, `gradientGuard`, `blurGuard`, `radiusGuard`, `accentGuard`), de modo que cambiar una regex en el test pone roja su fila de mutación. La mutación del emoji se escribe como `'\u{1F43E}'` (mismo texto que `'🐾'`) para no meter un emoji en el fichero de test.
- Demostración por mutación (nace verde, así que cada fila se prueba plantando): 
  - producción: `// #107148`, `// #D80B34`, `// rounded-xl` y `// w-[10px]` solo en `pet-map.tsx` (rojo la fila de `pet-map.tsx`: la que el `it.each` podría saltarse); `// StyleSheet.create(` y un emoji solo en `empty-state.tsx`; `from 'expo-linear-gradient'`, `from 'expo-blur'`, `text-accent ` solo en `index.tsx`; un séptimo icono (`Star`) en el import y un segundo import de `reicon-react-native` (rojo `el mapa importa solo sus seis iconos`, las dos veces). 
  - guarda de la guarda (plantadas en CF): hex sin bandera `i` (rojo la fila `#D80B34`), radios sin `xl` (rojo la fila `rounded-xl`), emoji sin bandera `u` (rojo la fila del emoji), hex sin la exención `(?!\d{2,3} R\d)` (rojo la exención y la fila de hex del mapa por sus propios comentarios `#201 R<n>`).
  - Todas revertidas; `git status` limpio tras cada bloque.
- Las 13 guardas con R16: 960 verdes (932 + 28), log `progress/jest-201-guards-r16.log`; typecheck limpio.

### Enmienda detectada en el cierre: título de CC R7.2

Al correr de nuevo las anclas de T0 con sus valores finales, `grep -cF '(enmendado por #201 R13)' src/__tests__/chunky-cta-canvas-fidelity.test.ts` daba `5` y el handoff espera `6` (filas 21 a 24: R7.2, R7.3, R7.4, R7.5, R12.1/R12.2 y R12.3). El título de `#177 R7.2: inventarios de las dos recetas de primario` no llevaba el sufijo, aunque R13 enmendó su primera aserción. Commit `48caa133` (`test(#201 R13): suffix the CC R7.2 title with the R13 amendment`): solo el título, sin cambios de comportamiento, CC 78/78. El leader puede no querer este commit; no cambia ninguna cifra salvo esa ancla. Para la traceability lo cuento como tercer commit de test de R13.

### Enmiendas fuera de la tabla del inventario (resumen)

| Qué | Dónde | Commit | Motivo |
|---|---|---|---|
| `mockUseReducedMotion.mockReturnValue(true)` al inicio de cuatro `it`/`describe` (`// #201 R11`) | MT: `Reintentar llama al refetch de last...`, `it.each` de `reintenta con $kind`, `renderiza la rama de error de pets...`, `describe` R11 | `3a39f70a` | `toBeVisible()` falla bajo la opacidad 0 de la entrada del héroe; el doble de Reanimated de MT no la hace avanzar. Las aserciones no cambian |
| `beforeEach` con reduced motion en `describe('#155 R4…')` | MT | `f83f3a72` | Errata E3 |
| `beforeEach` con reduced motion en `describe('#159 R3…')` | MT | `a86bcd4d` | Errata E3 |
| `width: 5` en las dos polilíneas de `R3 (android-map-never-ready): pasa una polyline mapeada por cada viaje` | MT | `08cbc116` | R15; incluida en E2 como enmienda de R15 |
| Filas 29 y 30 (`toHaveStyle` en lugar de `props.style` sobre `map-stats`) | MT | `dea9ba0c` | Errata E2 |
| Fila 28 (HM, cota y título) | HM | `f84fb5ff` | Errata E1 |
| `#62 R1` y `#166 R2` | CO | `af59bbf1` | Errata E4 |
| Sufijo en el título de `#177 R7.2` | CC | `48caa133` | Ancla de T0 (arriba) |

Cuenta final de `(enmendado por #201 R` en MT: 26 (el handoff pedía 23 en la base; los 3 de más son las filas 29, 30 y la enmienda de R15 de E2).

### Nacen verdes (y cómo se demostró cada una)

- R3: sus tres `it` de MT, sin commit verde (sondas Q1 a Q4 de R3, arriba).
- R2: CF `text-xs font-bold` del estado (sonda P1 de R2) y CF `--color-glass-surface-strong` de `global.css` (sonda P2 de R2).
- R4: CF `className="gap-2"` de la rejilla (sonda S6 de R4).
- R7: CF `--color-category-rose: #FFF0F3` y `--color-category-rose-strong: #D80B34` de `global.css` (los fijaron #197 y #198).
- R8: CF `text-center text-xs font-normal text-danger` (sonda W2 de R8).
- R13: MT `sin botón no hay icono de enlace` (sonda P3 de R13).
- R16: todo el bloque de CF (sondas de arriba).
- R14: los seis `it` de EH, que entregó #198.

## Estado final (vigente)

Las secciones anteriores son el diario de la sesión (algunas frases como «sonda pendiente» o «R1 verde: NO commiteado» quedaron superadas por «Reanudación tras E2/E3/E4»). Lo que vale es esto.

### Archivos creados
- `mobile-pet-tracker/src/__tests__/map-canvas-fidelity.test.ts` (CF): 609 líneas; fidelidad de los tres ficheros del mapa con el canvas, bloques R1 a R16 (R16 con 28 `it`).
- `specs/mobile-canvas-map/traceability.md`: rellenada (era el esqueleto del spec_author).
- `progress/impl_mobile-canvas-map.md`: este informe.

### Archivos modificados (diff `b4924c5d..HEAD`, `mobile-pet-tracker/`: 12 ficheros, +1582 / -204)
- `src/screens/map/index.tsx` (+291): R1 a R13 en producción (entrada con `homeEntering`, píldora de cristal, tarjeta sin borde, rótulo arriba, guiones apagados, botón rosa de modo perdido, error dentro de la tarjeta, aviso con icono, esqueleto `pulse` de once bloques, Pingo en las cuatro ramas).
- `src/components/pet-map.tsx` (+2): `polylineWidth` (R15).
- `src/screens/map/index.test.tsx` (MT): tests R1 a R13 y R15 y las enmiendas de inventario (26 títulos `(enmendado por #201 R…)`).
- `src/components/__tests__/pet-map.test.tsx` (PM, +40): R15.
- `src/components/__tests__/empty-state.test.tsx` (ES): fila 20.
- `src/__tests__/{chunky-cta,consistency-classnames,design-drift,heroui-text-size-merge,legibility-classnames,alerts}-…test.ts` (CC, CO, DD, HM, LG, AF): enmiendas mecánicas de la tabla del inventario y de E1/E4.
- Sin cambios (diff vacío contra `b4924c5d`): `package.json`, `bun.lock`, `src/components/empty-state.tsx`. Sin dependencias nuevas.

### Commits (de más antiguo a más nuevo, solo los míos y los de errata que intercalé)
Rojo y verde por requisito según `specs/mobile-canvas-map/traceability.md`. R13 tiene tres commits de test (`a86bcd4d` rojo, `af59bbf1` CO por E4, `48caa133` título de CC R7.2) y un verde (`d16f343e`). R3 y R16 nacen verdes. R14 no tiene commits. Los commits `13c4712c`, `98d00838` y `80cc73e9` son de errata del leader, no míos.

### Requisitos cubiertos
- R1: MT `#201 R1` (2), filas 15 y 20, CF R1; rojo `87f3198e` y `dea9ba0c`, verde `185cd67e`
- R2: MT `#201 R2` (2), filas 6 a 11 y 27, CF R2; rojo `c5791111`, verde `28345d2d`
- R3: MT `#201 R3` (3); `3eefc27b` (nace verde)
- R4: MT `#201 R4` (2), CF R4; rojo `f84fb5ff`, verde `c322db7b`
- R5: MT `#201 R5`, filas 12, 13, 25, 26, CF R5; rojo `f3b9b4ba`, verde `75ac3bc7`
- R6: MT `#201 R6` (4), fila 14, CF R6; rojo `b205a365`, verde `74dd6786`
- R7: MT `#201 R7` (2), CF R7; rojo `95b6e7aa`, verde `b13ac6bd`
- R8: MT `#201 R8`, CF R8; rojo `1bd49c3c`, verde `40600ea1`
- R9: MT `#201 R9`, CF R9; rojo `6993dd71`, verde `3b187687`
- R10: MT `#201 R10` (3), CF R10; rojo `b6b8dbd5` y `78954267`, verde `143bc01c`
- R11: MT `#201 R11` (2), filas 1 a 5 y 19, CF R11; rojo `5b5e3724` y `3a39f70a`, verde `9687c788`
- R12: MT `#201 R12`, fila 16, CF R12; rojo `f83f3a72`, verde `a0a539aa`
- R13: MT `#201 R13` (3), filas 17, 18, 21 a 24 y 26, CF R13; rojo `a86bcd4d`, `af59bbf1`, `48caa133`, verde `d16f343e`
- R14: EH `#198 R18` (6, entregados por #198); sin commits
- R15: PM `#201 R15` (2), MT `#201 R15`, CF R15; rojo `08cbc116`, verde `6dcf8701`
- R16: CF `#201 R16` (28); `d19288c7` (nace verde)

### T0 final
Las 85 anclas del handoff se re-midieron en el árbol final y coinciden con su valor final. Una no coincidía: `grep -cF '(enmendado por #201 R13)'` en CC daba 5 y el handoff espera 6; era el título de `#177 R7.2`, corregido en `48caa133` (ver arriba). Las anclas de «nuevo» (`map-canvas-fidelity.test.ts` ausente en la base) y `grep -cF '#201'` en MT (0 en la base) ya no valen su valor de base, como se espera.

### Comprobaciones de cierre
- Typecheck: `bun run typecheck` salida 0 (`progress/tsc-201-final.log`), tras `test ! -e .expo/types/router.d.ts`.
- Lint: `bun run lint` salida 0 y log sin avisos (`progress/lint-201-final.log`).
- 13 guardas (MT, CF, ES, EH, PM, CC, LG, DD, AF, HM, CO, canvas-foundations, ui-language): 13 suites y 960 tests verdes tras R16 (`progress/jest-201-guards-r16.log`); el título-only de `48caa133` se comprobó con CC 78/78.
- Diffs vacíos contra `b4924c5d`: `package.json`, `bun.lock`, `empty-state.tsx`.
- Lista cerrada: el diff contra `b4924c5d` toca solo los 12 ficheros de `mobile-pet-tracker/`, más `specs/mobile-canvas-map/{requirements,tasks,traceability}.md` y `progress/current.md` (los dos primeros y `current.md` son commits de errata del leader, no míos; `progress/current.md` sin commitear en el árbol tampoco es mío).
- `graphify update .` ejecutado.
- `progress/r13-green-map-index.patch` borrado.

### Suite completa (`bun run test`, primera vez en esta base)
Corrió cuando `pgrep -af '[i]nit\.sh' | grep -v snapshot` quedó vacío (un `init.sh` de otro worktree la retrasó), con otros jest ajenos corriendo a la vez. Resultado (`progress/jest-201-full.log`):

```
Test Suites: 5 failed, 142 passed, 147 total
Tests:       20 failed, 5106 passed, 5126 total
Snapshots:   1 passed, 1 total
```

Los 20 rojos son una sola familia: el flake de tinte `#0D1117` (el color de respaldo de `useThemeColors` y de `chunkyLip` sustituye al esperado `#0E5E3C`, `lip-gray`, etc.), el de la memoria `flake-tinte-0d1117-bajo-carga`. Suites: `src/components/__tests__/celebration.test.tsx` (`#171 R14`), `src/screens/alert-detail/index.test.tsx` (`#100 R5`, `#170 R15`), `src/screens/alerts/index.test.tsx` (`#78 R6`), `src/screens/geofence-editor/index.test.tsx` (`#189 R13`) y `src/screens/map/index.test.tsx` (`#201 R13: sin rastreo pinta a Pingo con el badge del collar`, el único rojo mío). Regla de flake: las cinco suites se re-corrieron solas con `--runInBand --testTimeout=30000` (`progress/jest-201-full-rerun.log`) y dieron 5 de 5 verdes, 691 tests. No hay base medida de la suite completa antes de #201, así que no puedo decir cuántos de esos rojos aparecerían en `main` con la misma carga. Ningún `jest.mock` mío usa `{ virtual: true }`.

### Lista de comprobación S1 a S10 (del humano, dev build Android, tema claro y repetir en oscuro)
Solo la dejo escrita; no la ejecuté. Con #197 y #201 instalados, no Expo Go, no la VPS.
- S1 (R1): al entrar en Mapa la píldora y la tarjeta suben juntas desde 14 px con fundido; con «Quitar animaciones» aparecen quietas.
- S2 (R2): la píldora se lee sobre el mapa de Google, con sombra, sin rectángulo negro ni transparente. Si no se lee, D1 se reabre.
- S3 (R4, R5, R6): tarjeta sin borde con sombra flotante; rótulo arriba y valor abajo; los guiones se ven grises.
- S4 (R7): botón de modo perdido rosa (`#FFF0F3` / oscuro `#39131A`), triángulo y texto rosa fuerte, esquinas de 14, sin labio y alto 50; `danger-soft` no lo repinta.
- S5 (R8): sin red, cambiar el modo perdido: el error sale dentro de la tarjeta y TalkBack lo anuncia.
- S6 (R9): mascota con collar y sin posiciones: aviso arriba con icono de ubicación.
- S7 (R10): con red lenta el esqueleto late con el mapa en gris claro; el bloque de valor tiene esquinas de 4.
- S8 (R11): con el backend parado, Pingo con el badge rosa que aparece con pop y «Reintentar» con icono de recarga; con el backend arriba, al pulsar vuelve el mapa.
- S9 (R12, R13): cuenta sin mascotas y mascota sin collar: Pingo centrado por encima de la barra; badge verde del collar con labio.
- S10 (R15): la ruta del día se ve más gruesa (5 px).

### Notas para el reviewer
- Ejecutor: Sonnet 5.5 como fallback del implementer (Codex sin cuota, anotado en `progress/current.md`).
- E3 `beforeEach` (`mockUseReducedMotion.mockReturnValue(true)` en `#155 R4` y `#159 R3`) y los cuatro `it` de `3a39f70a` sostienen carga: quitar el de `#159 R3` da ocho rojos por `toBeVisible()` bajo opacidad 0 (sonda P8 de R13). No se tocó ninguna aserción.
- R13 tiene un tercer commit de test (`48caa133`) que ni el handoff ni la errata E4 nombraban: es solo el sufijo del título de CC `#177 R7.2`, para que el ancla `(enmendado por #201 R13)` valga 6. Si el leader no lo quiere, la ancla se queda en 5 y nada más cambia.
- R16 conserva la forma `test(#201 R16): ...` de los demás commits de test; el handoff menciona `test(#201): R16`.
- R13: la sombra del badge se afirma con `StyleSheet.flatten(badge.props.style).boxShadow`; MT importa `StyleSheet` de `react-native` solo para eso (sin `StyleSheet.create`).
- Los `it` que nacen verdes no tienen rojo medido en su commit; la sección «Nacen verdes» lista cada uno con la sonda de mutación que demostró que protege.
- El aviso de Uniwind (`console.warn`) desapareció con el doble 3 de R7; el `console.info` de HeroUI es el único ruido de consola.
