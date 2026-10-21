---
feature: "mobile-home-photo-hero-canvas"
status: approved     # draft | approved
tags: [mobile, ui, spec]
---

# Tareas — [[mobile-home-photo-hero-canvas]]

> Cada requisito de [[requirements]] sigue el ciclo TDD obligatorio:
> (1) test rojo → (2) implementación mínima → (3) refactor con tests verdes.
> Un commit por paso con el R-id en el mensaje (`test(mobile): … (R3)` el rojo, `feat(mobile): … (R3)` el verde). **El historial rojo a verde es parte del entregable** (C4 de `CHECKPOINTS.md`): un solo commit con tests, código y docs incumple.
> Rutas relativas a `mobile-pet-tracker/`; abreviaturas de test (HERO, HEROMOT, HOME, SW, GC, BP, GUARD, PA, PR, MOT, CSS) en [[requirements]] §Requisitos funcionales. El detalle técnico está en [[design]].
>
> **Enmienda A1 (2026-10-21).** Solo cambian los bloques R14 y R16, las notas del handoff que hablan de `toBeVisible` y de los mocks de movimiento, y dos filas de «Cuentas a re-medir». El orden global, los demás R y sus cifras no se tocan. Motivo y mecanismo: [[design]] §Hechos medidos H1.

## Orden recomendado

Los requisitos van numerados por tema, no por dependencia. Para que el test de un R no afirme nodos que crea uno posterior («sujeto ausente»), el orden de ejecución es:

**R13 → R4 → R1 → R2 → R3 → R5 → R7 → R8 → R6 → R14 → R9 → R11 (solo `GlassCircle` y su test GC) → R10 → R11 (resto: botón «+» en Inicio) → R12 → R15 → R16 → R17 → R18 → R19 → R20 → R21.**

Notas del orden:

- **Antes de R1 hay que tener la casilla `Enmienda #195 aprobada por humano` firmada** (precondición de R20). Sin ella, el implementer no revierte ningún candado y se detiene.
- **Los commits intermedios no tienen que verse bien en pantalla**, solo ir en verde: tras R1 el frame mide 330 pero las capas viejas siguen dentro hasta que su R las cambia. Nada se mergea a medias.
- **Cada candado de [[requirements]] §Candados se enmienda en el commit del R que lo invalida**, con el comentario `(enmendado por #195 R<n>)` en el `it`. No se enmienda en bloque al final ni antes de que su comportamiento cambie. No hay que reescribir los `it` que la tabla marca como «se conservan»: si uno se pone rojo, es una regresión y se arregla el componente, nunca el `it`.
- **Comentarios con la forma `#195 R<n>`**, nunca `#195` desnudo (el exento de `HEX_LITERAL` en `design-drift` es solo `#NNN R<n>`).
- El ciclo de cada R termina con `git add <rutas>` explícito, no `git add -A`; el árbol debe quedar limpio al terminar.

## Notas para el handoff a Codex

El leader redacta el handoff; esta lista es lo que la spec exige que figure en él:

- **Commits test-primero**, con el R-id, y un commit por paso.
- **Citar `.claude/agents/leader.md` §Esperas**: los tests de movimiento usan Reanimated real con temporizadores falsos (BP, PR y, desde la Enmienda A1, HEROMOT) o los mocks de `withTiming`/`withDelay` (HERO, HOME); no se espera a un contador de mock.
- **Comandos de móvil con `bun`/`bunx`**, nunca `npx` ni `npm i`. No se añaden dependencias.
- **Jest en paralelo con otras worktrees**: un timeout aislado se mide sin flag antes de tocar nada. `jest` posicional es un regex.
- **RNTL 14**: `await fireEvent.press(…)` y `await act(…)`; sin `await`, el `it` siguiente se contamina.
- **`toHaveAnimatedStyle` con `shouldMatchAllProps`** cuando se afirma que no hay claves de más (opacidad colada).
- **Mocks de Reanimated**: HERO añade `withDelay: jest.fn((_ms, animation) => animation)` a su mock (R14); HOME ya lo tiene; el mock de `reicon-react-native` de HOME añade `Plus: mockIcon('icon-plus')` (R11). Las cuentas de llamadas a `withTiming` se miden **después** de `mockClear()` del montaje.
- **Constantes de modelo literales en los tests** (R13, R17): nunca importadas de producción (candado tautológico).
- **Cada ancla «= 0» o «= N» lleva su mutación plantada** (lista abajo): la guarda no vale si no se ha visto rojo con el defecto presente.
- **Verificación de lint**: `expo lint` puede morir por memoria con exit 0; la cadena es `… > log 2>&1 && test ! -s log`. Si falla con «Cannot find module», repetir con `--no-cache`.
- **Prettier**: el backend lo usa; el móvil no. No se formatea el móvil con una herramienta que no tiene.
- **Tras mergear `origin/main` con dependencias nuevas**: `bun install --frozen-lockfile`. No se rebasea después de rellenar [[traceability]]; si hace falta, se reapuntan los hashes.
- **Regla de visibilidad (Enmienda A1, [[requirements]] R14 y R16, [[design]] H1).** Sobre `pet-hero-slot`, `pet-hero-caption`, `pet-hero-photo` (si el hero monta ya con mascota), `home-pingo-bubble` y **todos sus descendientes**, con reduce motion apagado, `toBeVisible` falla por construcción en Jest con Reanimated 4.5.1 (el `style` del host guarda el primer render, `opacity: 0`; el valor vivo solo está en `getAnimatedStyle`): ahí se afirma **`toBeOnTheScreen()`**, y la visibilidad real se prueba con la prueba (i) de movimiento (Reanimated real, temporizadores falsos, `getAnimatedStyle`) y la (ii) con reduce motion encendido (`toBeVisible()` síncrono). **Fuera** de esos nodos `toBeVisible` no se relaja: si falla allí, el arreglo es del componente. Esto sustituye a la regla anterior «si un `toBeVisible` falla por opacidad inicial 0, el arreglo es del componente», que era falsa para estos nodos. No se endurece ni se relaja una aserción para que pase una carrera de reloj: si un valor final no llega en la ventana, se amplía la ventana (16 → 32 ms) y se anota en `progress/`.
- **`StyleSheet` no aparece en `screens/home/index.test.tsx`** (ni en código, ni en títulos, ni en comentarios): `design-drift` lo escanea (`#68 R18`, `#69 R13`, `#71 R13`, `#70 R17`, `#85 R12`). HOME aplana con `[node.props.style].flat(Infinity)` y `toContainEqual`; `StyleSheet.flatten` solo en HERO, HEROMOT y BP. Medir: `grep -c StyleSheet src/screens/home/index.test.tsx` devuelve 0 en la base y debe seguir en 0.
- Si Codex puede o no correr `init.sh` lo decide el handoff del leader, no esta spec.

## Cuentas a re-medir al terminar (base + delta)

Cada cifra es la base medida en [[requirements]] §Base medida más el delta que dejan los R; se re-miden con el mismo comando, desde `mobile-pet-tracker/`:

| Comando | Base | Esperado |
|---|---|---|
| `grep -c 'style={CONTINUOUS_CORNER}' src/components/pet-hero-header.tsx` | 1 | 1 |
| `grep -c 'style={CONTINUOUS_CORNER}' src/screens/home/index.tsx` | 1 | 1 |
| `grep -c 'TABULAR_NUMS' src/components/pet-hero-header.tsx` | 2 | 2 |
| `grep -c 'TABULAR_NUMS' src/screens/home/index.tsx` | 9 | 9 |
| `grep -c 'text-accent-strong' src/components/pet-hero-header.tsx` | 1 | 1 |
| `grep -c 'text-accent-strong' src/screens/home/index.tsx` | 2 | 2 |
| `grep -c 'bg-accent-soft' src/screens/home/index.tsx` | 3 | 3 |
| `grep -c 'bg-accent-soft' src/components/pet-switcher.tsx` | 1 | 1 |
| `grep -c "t('profile.addPet'" src/screens/home/index.tsx` | 1 | 1 |
| `grep -c 'shadow-' src/components/pet-switcher.tsx` | 0 | 0 |
| `grep -cE '^export const MOTION_HERO_' src/theme/motion.ts` | 0 | 4 |
| `grep -cE -e '--(color-)?(scrim\|photo-dim):' src/theme/global.css` | 0 | 8 (2 tokens, 2 formas, 2 temas) |
| `grep -c 'Enmienda #195' ../docs/ui-guidelines.md` | 0 | lo fija el texto de [[design]] (se mide tras la firma y se anota en la trazabilidad) |
| `test -e src/components/glass-circle.tsx && test -e src/screens/home/bubble-pop.tsx && test -e src/__tests__/home-photo-hero-canvas.test.ts` | ausentes | existen |
| `test -e src/components/__tests__/pet-hero-header-motion.test.tsx && test -e src/screens/home/bubble-pop.test.tsx` | ausentes | existen (HEROMOT tras R14, BP tras R16) |
| `grep -c "(enmendado por #195 R14)" src/components/__tests__/pet-hero-header.test.tsx` | 0 | 5 (una por título; un comentario con la misma cadena la inflaría) |
| `grep -c "(enmendado por #195 R14)" src/screens/home/index.test.tsx` | 0 | 6 (idem) |
| `grep -c "StyleSheet" src/screens/home/index.test.tsx` | 0 | 0 |

Un `grep -c` cuenta líneas, no apariciones. Si una cuenta de la base ya no coincide con el árbol al empezar (otra feature mergeó entre medias), se anota la deriva y se avisa al leader antes de seguir.

## Tests enmendados

La lista completa de candados que cambian, con lo que afirman hoy y lo que pasarán a afirmar, vive en [[requirements]] §Candados que esta feature revierte. **No se duplica aquí**: una sola fuente. Cada bloque de abajo nombra los que le tocan.

## R1 — Frame de 330 y raíz

- [ ] (1) Escribir test que falla para R1 (HERO `#195 R1`: `pet-hero` con un solo hijo `pet-hero-frame` con `style` igual a `{ height: 330 }`; constantes 330/160/130; clases de la raíz en `bleed` y `card`). Enmienda en el mismo commit: `R1 › exporta las dos constantes…` y `#127 R2`.
- [ ] (2) Implementación mínima que lo pasa (envolver el contenido en `pet-hero-frame`; constantes; el resto, incluido el pulso de opacidad del punto, sigue dentro del frame sin reordenar hasta que su R lo cambie).
- [ ] (3) Refactor con tests verdes.

Sonda: sube el alto a 331 en el componente y comprueba que HERO se pone rojo; revierte.

## R2 — Foto alineada arriba y fundido

- [ ] (1) Escribir test que falla para R2 (los `it` de HERO se montan **sin `children`**, para no depender del slot que crea R5; PA `#195 R2`: `contentPosition` reenviado solo si se pasa, ausente en blobatar, el snapshot actual intacto; HERO `#195 R2`: primer hijo del frame `pet-hero-photo` con clase `absolute inset-0`, props de `pet-hero-media` con `contentPosition="top"`, `withTiming` con `1`, 500 y la curva, también al cambiar `pet.id`; cero llamadas con `pet=null`). Enmienda: `R2 › pinta la foto … clave de caché estable` añade `contentPosition`.
- [ ] (2) Implementación mínima que lo pasa (`contentPosition` en `pet-avatar.tsx`; capa `pet-hero-photo` con el fundido; el skeleton dentro de la misma capa).
- [ ] (3) Refactor con tests verdes.

Sonda: cambia 500 por 400 en `MOTION_HERO_FADE_MS`; MOT (R13) y HERO deben ponerse rojos.

## R3 — Degradados

- [ ] (1) Escribir test que falla para R3 (HERO `#195 R3`: cadenas exactas de los dos degradados con los hex que devuelve el hook mockeado, `pointerEvents="none"`, clases `absolute inset-x-0 top-0|bottom-0`, alturas 130 y 160, `pet-hero-scrim-top` ausente sin `children`, `pet-hero-fade-top` ausente, sin la palabra `\btransparent\b` en el fuente sin comentarios). Enmienda: `R3 › funde la imagen hacia el fondo opaco por arriba y por abajo`; el `it.each` de hex6 añade `scrim`.
- [ ] (2) Implementación mínima que lo pasa (`useThemeColors(['background', 'scrim'])`; dos capas con `experimental_backgroundImage`).
- [ ] (3) Refactor con tests verdes.

Sondas: (a) cambia `D9` por `99` en la cadena inferior, HERO rojo; (b) escribe `transparent` en la cadena superior, HERO rojo; (c) escribe `transparent` solo en un comentario, HERO sigue verde (el comentario está exento).

## R4 — Tokens `scrim` y `photo-dim` y capa

- [ ] (1) Escribir test que falla para R4 (CSS `#195 R4`: los cuatro valores exactos, cada forma una vez por tema; HERO `#195 R4`: `pet-hero-dim` con clase `absolute inset-0 bg-photo-dim` y `pointerEvents="none"`, segundo hijo del frame).
- [ ] (2) Implementación mínima que lo pasa (`global.css`, en las dos formas y los dos temas, sin espacios tras las comas; la capa en el hero).
- [ ] (3) Refactor con tests verdes.

Sonda: cambia `0.14` por `0.41` en dark; CSS rojo.

## R5 — Fila superior flotante

- [ ] (1) Escribir test que falla para R5 (HERO `#195 R5`: con `insets.top` 40, `top` 52 y clase exacta `absolute inset-x-4` sin fondo ni padding; sin `children`, `pet-hero-slot` y `pet-hero-scrim-top` ausentes). Enmiendas: `R3 › la banda del slot…`, `R4 › baja el slot con insets.top + 12…`, `R4 › no gasta alto de foto cuando no hay slot` (+ `scrim-top` ausente).
- [ ] (2) Implementación mínima que lo pasa.
- [ ] (3) Refactor con tests verdes.

## R6 — Pie sobre el degradado

- [ ] (1) Escribir test que falla para R6 (HERO `#195 R6`: clases exactas de pie, nombre, raza, valor y etiqueta; `TABULAR_NUMS` en el valor; `—` sin raza; skeletons con `pet=null`; orden de los hijos del frame con y sin `children`, a esta altura del orden ya existen todos; ALERTS `tracking-title` con el hero en el inventario). Enmiendas: `R3 › la banda inferior…` y los `it` que fijan `text-3xl font-black text-foreground`, `font-normal text-muted`, `text-xs font-medium text-muted` (ubicar con `grep -n`).
- [ ] (2) Implementación mínima que lo pasa.
- [ ] (3) Refactor con tests verdes.

Sonda: quita `tracking-title` del nombre; HERO rojo. Quita `'components/pet-hero-header.tsx'` del inventario de ALERTS; ALERTS rojo (el orden alfabético se comprueba con `node`, no a ojo).

## R7 — Píldora y tonos

- [ ] (1) Escribir test que falla para R7 (HERO `#195 R7`: clase exacta de la píldora y de sus dos hijos, los tres tonos, `children.length` 2, `STATUS_TONE_CLASSES` igual al valor de hoy; HOME `#73 R9`). Enmiendas: fila `success` de `#73 R8`, `es una capsula rounded-full…`.
- [ ] (2) Implementación mínima que lo pasa (tabla derivada).
- [ ] (3) Refactor con tests verdes.

Sonda: cambia `bg-accent` por `bg-success` en el punto de `success`; HERO y HOME rojos.

## R8 — Anillo del punto

- [ ] (1) Escribir test que falla para R8 (PR `#195 R8`: `timing` por defecto y propio; HERO `#195 R8`: anillo solo con `success`, `pet` y sin reduce motion, punto sin hijos en los demás casos, `timing.duration` 1600; `STATUS_DOT_PULSE` ausente de las claves exportadas). Sustituye el bloque `#73 E2`, que importa esa constante.
- [ ] (2) Implementación mínima que lo pasa (prop `timing` en `PingRing`; anillo dentro del punto; quitar `STATUS_DOT_PULSE`, `dotOpacity` y su `useEffect`).
- [ ] (3) Refactor con tests verdes.

Sonda: deja el anillo bajo reduce motion; HERO rojo. Quita `timing` del hero; la duración de 2400 aparece y HERO rojo.

## R9 — Avatar seleccionado y punto en línea

- [ ] (1) Escribir test que falla para R9 (SW `#195 R9`: clase exacta del chip seleccionado, envoltorio `size-9`, `PetAvatar` 36 con los dos `testID`, punto con y sin `selectedOnline`, ausente en no seleccionados, `accessibilityState`). Enmienda #70: una expectativa `within()` por decisión y `children.length` por cardinalidad.
- [ ] (2) Implementación mínima que lo pasa (rama `glass` del selector, solo el chip seleccionado).
- [ ] (3) Refactor con tests verdes.

Sonda: pinta el punto también en los no seleccionados; SW rojo.

## R10 — Fila de vidrio del selector

- [ ] (1) Escribir test que falla para R10 (SW `#195 R10`: `-m-1`, contenido `flex-row items-center gap-2 p-1`, orden de chips, `trailing` al final, `children.length` mascotas + 1, letra en mayúscula con su clase, `onSelect` desde ambos tipos). Solo SW: Inicio sigue en la variante `default` hasta R11, así que `#152 R5` aún no se enmienda.
- [ ] (2) Implementación mínima que lo pasa (el chip no seleccionado usa `GlassCircle`, que ya existe porque su parte GC de R11 se hizo antes, ver el orden).
- [ ] (3) Refactor con tests verdes.

Sonda: en la variante `glass`, vuelve a usar el HeroUI `Avatar` para un chip; SW rojo (y, ya con R11 hecho, HOME `#152 R5`).

## R11 — `GlassCircle` y botón «+»

Se hace en dos tandas (ver el orden): primero `GlassCircle` y su test GC; después, ya con R10, la parte de Inicio.

- [ ] (1) Escribir test que falla para R11 (GC `#195 R11`: clase exacta, rol, `onPress`, opacidad .8 pulsado y 1 sin pulsar, sin `BlurView`; HOME `#195 R11`: Inicio usa `variant="glass"` con `selectedOnline` según la conexión, `home-add-pet` último hijo de la fila del selector, etiqueta, `icon-plus` 20 con trazo 2.4, navegación a `/pets/add`; GUARD `t('profile.addPet'` 1 vez). Enmiendas en el commit de la parte de Inicio: los dos `it` de `#152 R5` (sin `pet-avatar-fallback-pet-1`), `Plus` en el mock de HOME; `#122 R2` se conserva.
- [ ] (2) Implementación mínima que lo pasa (`glass-circle.tsx`; en Inicio: `variant="glass"`, `selectedOnline`, `trailing`, `Plus` en el `import` de `reicon-react-native` entre `Pill` y `Stethoscope`, `addPetLabel` sobre el `return` temprano).
- [ ] (3) Refactor con tests verdes.

Sonda: deja una segunda `t('profile.addPet'` en Inicio; GUARD rojo.

## R12 — Campana

- [ ] (1) Escribir test que falla para R12 (HOME `#195 R12`: icono 22, trazo 2, `--color-foreground`; clase y tamaño del punto; dos hijos de `home-hero-actions`; `testID="home-alerts-bell"` una sola vez). Enmiendas: `#78 R10` (ambos), `#124 R1`, `#78 R11`, `#73 R9`.
- [ ] (2) Implementación mínima que lo pasa (`'foreground'` al primer `useThemeColors`).
- [ ] (3) Refactor con tests verdes.

Sonda: duplica el `testID` de la campana; GUARD rojo.

## R13 — Constantes de movimiento

- [ ] (1) Escribir test que falla para R13 (MOT `#195 R13`: los cuatro valores como literales; `no exporta nada más` con las cuatro claves entre `MOTION_FLOAT_TIMING` y `MOTION_PINGO_FLOAT_OFFSET_Y`, en este orden: `MOTION_HERO_BUBBLE_POP_DELAY_MS`, `MOTION_HERO_CAPTION_DELAY_MS`, `MOTION_HERO_FADE_MS`, `MOTION_HERO_PING_MS`; 35 claves).
- [ ] (2) Implementación mínima que lo pasa.
- [ ] (3) Refactor con tests verdes.

## R14 — Entradas del hero y reduce motion

Reescrito por la Enmienda A1: rojo / verde / mutación. Fuente de verdad de lo que se afirma: [[requirements]] R14 (regla de visibilidad y tiempos) y §Candados de visibilidad y de forma de style; mecanismo en [[design]] H1. Aquí solo se ordena el trabajo.

- [ ] (1) **Rojo**, en un solo commit `test(mobile): … (R14)` (hay que verlo en rojo por el motivo correcto antes del verde):
  - **HERO** (`components/__tests__/pet-hero-header.test.tsx`): el mock de Reanimated añade `withDelay: jest.fn((_ms, animation) => animation)` (candado «HERO › mock de `react-native-reanimated`»). `describe('#195 R14: …')` con, al menos: (a) con reduce motion apagado, `withTiming` recibe `(1, { ...MOTION_CELEBRATION_EASE_OUT, duration: 400 })` (el 400 como literal del test; el mismo objeto de opciones que ya usa la foto en R2 cambiando solo `duration`) y `withDelay` se llama **una sola vez**, con `80` como primer argumento y una animación `withTiming` de `duration: 400` como segundo (el pie); el slot no usa `withDelay`. No se prescribe si opacidad y desplazamiento comparten un valor compartido; las cuentas se miden **después** de `mockClear()` del montaje; (b) con reduce motion encendido, **cero** llamadas a `withTiming` y a `withDelay` y `StyleSheet.flatten(slot.props.style)` con `opacity: 1` y `transform: [{ translateY: 0 }]` desde el primer render, igual para el pie; (c) los estilos animados solo llevan las claves `opacity` y `transform`, y no hay ningún `entering` en el árbol; (d) **prueba (ii)**: con reduce motion encendido, `toBeVisible()` síncrono (sin `act`, sin `waitFor`) sobre `pet-hero-slot`, `pet-hero-caption`, `pet-hero-media`, un hijo del slot y `pet-hero-name`.
  - **HEROMOT** (**fichero nuevo** `components/__tests__/pet-hero-header-motion.test.tsx`, prueba (i)): copia de HERO los mocks de `heroui-native` (`Skeleton`), `../ping-ring` y `react-native-safe-area-context` (insets `top` 40), `makePet`, `HeroWrapper` y `renderHero`; el mock de `react-native-reanimated` es el de `pop-in.test.tsx` (`...jest.requireActual('react-native-reanimated')`, `__esModule: true` y **solo** `useReducedMotion` sustituido): **no** se mockean `withTiming`, `withDelay` ni `withRepeat`. `jest.useFakeTimers()` en `beforeEach`, `jest.useRealTimers()` en `afterEach`, el avance con `await act(async () => { jest.advanceTimersByTime(n); })` y la lectura con `getAnimatedStyle` importado de `react-native-reanimated`. El tiempo es **acumulado** y todas las constantes son **literales del test**. `describe('#195 R14: movimiento real del hero')`, con reduce motion apagado, una mascota (para que la foto anime) y un hijo en el slot: (a) `pet-hero-slot`: `getAnimatedStyle` contiene `opacity: 0` y `transform: [{ translateY: 14 }]` antes de avanzar; a los 64 ms `opacity` es mayor que 0 y menor que 1 y `translateY` está entre 0 y 14; a los 416 ms (400 + 16) contiene `opacity: 1` y `transform: [{ translateY: 0 }]`; (b) `pet-hero-caption`: a los 64 ms sigue en `opacity: 0` y `translateY: 14` (el retraso de 80 ms no ha vencido); a los 496 ms (80 + 400 + 16) está en `opacity: 1` y `translateY: 0`; (c) `pet-hero-photo`: arranca en `opacity: 0` y a los 516 ms (500 + 16) está en `opacity: 1`; (d) presencia: el hijo del slot, `pet-hero-name` y `pet-hero-media` son `toBeOnTheScreen()` **antes y después** de avanzar el reloj (y en ningún `it` de este fichero se afirma `toBeVisible` con reduce motion apagado sobre ellos).
  - **Enmiendas** (las 11 de [[requirements]] §Candados de visibilidad: 5 en HERO y 6 en HOME), con el sufijo `(enmendado por #195 R14)` **a continuación** del que ya lleve el título, cambiando solo las líneas que la tabla cita. Verifica con los comandos de §Cuentas a re-medir (5 y 6 títulos con el sufijo; `toBeVisible` de HOME en 73 tras este commit).
  - Orden de los rojos esperados antes del verde: HERO (a) a (d) y HEROMOT (a) a (d) rojos (todavía no hay animación), la enmienda del `style` del slot de `#195 R5` rojo, y las enmiendas que solo cambian `toBeVisible` por `toBeOnTheScreen()` **verdes** (nacen verdes: lo anota el implementer en `progress/`, su valor lo demuestra la mutación (e) de abajo).
- [ ] (2) **Verde**: implementación mínima. Slot y pie con valores compartidos y `useAnimatedStyle` (sin `entering`), foto con el valor inicial `reduceMotion || !pet ? 1 : 0` que ya tiene; con reduce motion encendido los tres nacen en su estado final y no se arranca ningún temporizador. Si el reloj simulado de Reanimated no entrega valores intermedios (los 64 ms de (a) y (b)), se conserva el par inicial y el final, se anota en `progress/` y se avisa al leader; si la animación arranca un fotograma después, el margen de 16 ms sube a 32 y se anota. **Nunca** se cambia un valor final ni se vuelve a `toBeVisible` para que pase.
- [ ] (3) **Refactor** con todos los tests (HERO, HEROMOT, HOME) en verde.

**Mutaciones plantadas, cada una vista en rojo y revertida** (se anotan en `progress/impl_…` con el nombre del `it` que se puso rojo):

| # | Defecto plantado | Rojo esperado | Debe seguir verde |
|---|---|---|---|
| a | El valor inicial de `opacity` del slot pasa a 1 con reduce motion apagado (nada animaría) | HEROMOT (a) (el inicio en 0), y la enmienda del `style` del slot de `#195 R5` | HERO (d) |
| b | Con reduce motion encendido, el valor inicial del slot pasa a 0 (un usuario con reduce motion vería el hero invisible) | HERO (b) y (d) | HEROMOT |
| c | El retraso del pie pasa de 80 a 140 | HERO (a) (argumentos) y HEROMOT (b) (a los 496 ms aún no llega) | HEROMOT (a) |
| d | El valor inicial de `pet-hero-photo` con mascota pasa a 1 | HEROMOT (c) | HERO (d) |
| e | En `R3 › el slot flota sin fondo ni padding…` se vuelve a escribir `toBeVisible()` sobre `slot-child` | ese `it` (con el hero ya animado): demuestra que el fallo es real y que la enmienda hacía falta | el resto |

La mutación (e) se hace **con el verde ya hecho** y es la sonda de la causa: si no se pone roja, la premisa de [[design]] H1 no se cumple en el árbol y hay que parar y avisar al leader.

## R15 — Hueco de 14 y scroll

- [ ] (1) Escribir test que falla para R15 (HOME `#195 R15`: `home-content` en 24 y 16; el hero precede a `home-content`). Enmienda: `R5: Home usa el hero compartido › conserva gap y paddingBottom` (14 y 120).
- [ ] (2) Implementación mínima que lo pasa.
- [ ] (3) Refactor con tests verdes.

## R16 — Burbuja de Pingo y `pop`

Reescrito por la Enmienda A1: rojo / verde / mutación. Fuente de verdad: [[requirements]] R16 (regla de visibilidad) y la fila `#190 R7` de §Candados; mecanismo en [[design]] H1.

- [ ] (1) **Rojo**, un solo commit `test(mobile): … (R16)`:
  - **BP** (**fichero nuevo** `screens/home/bubble-pop.test.tsx`, Reanimated real): mismo preámbulo de movimiento que HEROMOT (el mock de `pop-in.test.tsx` con solo `useReducedMotion` sustituido, temporizadores falsos, `act`, `getAnimatedStyle`; constantes como literales del test). `describe('#195 R16: …')` con reduce motion apagado: (i) `getAnimatedStyle(bubble)` contiene `opacity: 0` y `transform: [{ scale: 0.6 }]` antes de avanzar y todavía a los 434 ms (450 − 16); a los 470 ms (450 + 20) `opacity` está entre 0 y 1 y `scale` entre .6 y 1.08; al pico (450 + 240 + 16 ms) `opacity` 1 y `scale` cercana a 1.08 y a los 866 ms (450 + 240 + 160 + 16) `scale` cercana a 1, todo con `toBeCloseTo`; `bubble` y `home-pingo-text` son `toBeOnTheScreen()` antes y después de avanzar (nunca `toBeVisible` con reduce motion apagado); y con reduce motion encendido (ii): `getAnimatedStyle` ya es `opacity: 1` y `transform: [{ scale: 1 }]` en el primer render, sin avanzar el reloj, y `toBeVisible()` síncrono sobre `home-pingo-bubble` y `home-pingo-text`. Además: pasa `testID`, `className`, `style` y `children`, y no hay `entering`.
  - **HOME**: `#190 R11`, `#190 R4` y `#190 R7` enmendados con el sufijo `(enmendado por #195 R16)`. `#190 R7` se reescribe como dice su fila de §Candados: `entering` indefinido; `const styles = [bubble.props.style].flat(Infinity)` y `expect(styles).toContainEqual({ borderCurve: 'continuous' })`; con reduce motion encendido, `expect(styles).toContainEqual({ opacity: 1, transform: [{ scale: 1 }] })`. **Sin la cadena `StyleSheet`** en ningún sitio de `screens/home/index.test.tsx`. `#190 R3`, `#190 R5` y `#190 R6` se conservan. HOME no tiene ningún `toBeVisible` sobre la burbuja (medido): no se añade ninguno con reduce motion apagado.
- [ ] (2) **Verde**: implementación mínima (`bubble-pop.tsx` con el patrón de `PopIn`; la clase de la burbuja sin `shadow-sm`; la pose de 56). La burbuja arranca en `opacity: 0` y `scale: .6` salvo con reduce motion, que la pinta en 1 y 1 desde el primer render sin temporizadores.
- [ ] (3) **Refactor** con BP, HOME y los guardas agregados en verde.

**Mutaciones plantadas, cada una vista en rojo y revertida** (anotadas en `progress/impl_…`):

| # | Defecto plantado | Rojo esperado |
|---|---|---|
| a | `BubblePop` arranca en `opacity: 1` con reduce motion apagado | BP (i) (el inicio en 0) |
| b | Con reduce motion encendido, `BubblePop` arranca en `opacity: 0` | BP (ii) y HOME `#190 R7` (`toContainEqual` con `opacity: 1`) |
| c | Devuelve `shadow-sm` a la clase de la burbuja | HOME `#190 R11` |
| d | `BubblePop` deja de aplicar la prop `style` (`CONTINUOUS_CORNER`) | HOME `#190 R7` (`toContainEqual({ borderCurve: 'continuous' })`); la cuenta de `home/index.tsx` sigue en 1, así que ningún otro guarda lo ve |
| e | Se escribe `StyleSheet` en un comentario de `screens/home/index.test.tsx` | `design-drift` (`#68 R18`): demuestra la prohibición |

## R17 — Contraste

- [ ] (1) Escribir test que falla para R17 (GUARD `#195 R17`: modelo WCAG con las constantes literales y los tokens leídos de `global.css`, los dos temas, tolerancia ±0,05 sobre las referencias, suelos de la tabla). Nace verde si R3, R4, R6 y R7 ya están hechos: se demuestra su valor con la mutación de abajo.
- [ ] (2) Implementación mínima que lo pasa (el test es el entregable; no hay código de producción nuevo).
- [ ] (3) Refactor con tests verdes.

Mutaciones: (a) cambia el token `muted` de light en `global.css` a un gris más claro, GUARD rojo; (b) cambia un alfa del modelo en el test, la tolerancia sobre la referencia lo pone rojo.

## R18 — Estados conservados

- [ ] (1) Escribir test que falla para R18 (HERO `#195 R18`: skeleton con 330 y sin `rounded-`, blobatar sin foto, `card` con `rounded-card`; HOME `#195 R18`: los cuatro estados). Es probable que nazca verde: anotarlo en la trazabilidad y demostrar su valor con una mutación (añade `rounded-xl` al skeleton del hero: rojo).
- [ ] (2) Implementación mínima que lo pasa (si ya lo cumple, no hay código).
- [ ] (3) Refactor con tests verdes.

## R19 — Grep-clean y guardas

- [ ] (1) Escribir test que falla para R19 (GUARD `#195 R19`: sobre la lista cerrada de siete ficheros, cero hex, cero `[...]`, cero `StyleSheet.create`, cero sombras legacy, cero emoji, cero `\btransparent\b` en el hero sin comentarios; las cuentas de la tabla de arriba; ausencia de `BlurView`). Existe el fichero GUARD desde R17: este ciclo añade el `describe` de R19.
- [ ] (2) Implementación mínima que lo pasa.
- [ ] (3) Refactor con tests verdes.

Mutaciones plantadas, cada una vista en rojo y revertida: (a) un hex `#FF0000` en `glass-circle.tsx`; (b) una clase `h-[330px]` en el hero; (c) un `shadow-md` en `pet-switcher.tsx`; (d) un `BlurView` importado en `glass-circle.tsx`; (e) un segundo `t('profile.addPet'`; (f) un `#195` desnudo en un comentario (debe fallar `design-drift`).

## R20 — Carta (docs)

- [ ] (1) Escribir test que falla para R20 (GUARD `#195 R20`: la sección es la última `## ` y su texto contiene el bloque de [[design]] con la casilla normalizada; el párrafo de A8 entero y el nuevo aparte posterior; casilla tolerante `/- \[[ xX]\] Enmienda #195 aprobada por humano/`). **Solo se ejecuta tras la firma de la casilla de §Aprobación** (precondición de procedimiento).
- [ ] (2) Implementación mínima que lo pasa (copiar los dos bloques de [[design]] a `docs/ui-guidelines.md`: el primero al final del fichero, el segundo justo después del párrafo A8).
- [ ] (3) Refactor con tests verdes.

Comprobar además que `hero-header-amendments.test.ts` y los tests que fijan `Enmienda #190` siguen en verde sin tocarse.

## R21 — Smoke del humano

- [ ] (1) No hay test automatizado. Preparar la lista de comprobación del dev build (modo claro, oscuro y reduce motion; mascota con foto oscura, con foto clara y sin foto; nombre de 25 caracteres).
- [ ] (2) El humano lo ejecuta en el dev build Android de su PC y firma la casilla de [[requirements]] §Aprobación.
- [ ] (3) Si algo falla, se abre la corrección como enmienda de esta spec o como feature nueva; un fallo de R21 no invalida R1 a R20.
