---
feature: "mobile-home-empty-canvas-fidelity"
status: draft        # draft | approved
tags: [harness, spec]
---

# Tareas — [[mobile-home-empty-canvas-fidelity]]

> Disciplina TDD. Cada tarea corresponde a un requisito de [[requirements]] y
> tiene siempre los mismos 3 sub-items, en este orden.

Precondiciones de la fase (2) (ver [[design]] §Dependencias y precondiciones):

- Fase (2) de R6 y R7: Enmienda #176 aprobada por humano en `docs/ui-guidelines.md` (P1). Sin ella no se implementan R6 y R7.
- R12 ya no tiene precondición: #177 está mergeada (PR #231) y R12 hereda su receta (design.md D5). El resto de requisitos no depende de la enmienda.

Rutas relativas a `mobile-pet-tracker/`. Tests nuevos de la variante `hero` en `src/components/__tests__/empty-state-hero.test.tsx` (archivo nuevo, con `HeroUINativeProvider`, `testID="home-empty"` y `useReducedMotion` mockeado como en `pingo-float.test.tsx`: `jest.mock('react-native-reanimated', () => ({ ...jest.requireActual('react-native-reanimated'), __esModule: true, useReducedMotion: () => mockUseReducedMotion() }))`; sin mockear `withRepeat`). Tests de Inicio en `src/screens/home/index.test.tsx`.

Convención de valores: los valores esperados van como literales en cada test, copiados de la spec o de origin/main. No se importan de `src/theme/`: un candado que compara con el mismo símbolo que usa el código es tautológico.

Esperas: con fake timers, `await act(async () => { jest.advanceTimersByTime(ms); })` y se muestrea; no se espera a contadores de mock. Todo `fireEvent`/`act` de RNTL 14 lleva `await`.

## Tests enmendados (candados de otras features)

Cada enmienda lleva el comentario `(enmendado por #176 R<n>)` y no cambia nada más del test.

- `src/components/__tests__/empty-state.test.tsx`, «EmptyState solo importa de react, react-native, expo-image, heroui-native, Reanimated y el tema de movimiento (enmendado por #177 R10)»: la lista de especificadores admitidos añade `'reicon-react-native'`, `'react-native-svg'`, `'../theme/pingo-stage'`, `'../theme/use-theme-colors'` y `'./pingo-float'` (R5, R6, R12).
- Mismo fichero, «EmptyState importa exactamente lo de la flotación (enmendado por #177 R10)»: el listado exacto de `^import` pasa a ser, en este orden (si ESLint exige otro orden se ajusta el orden del test, no las líneas): `import { useEffect } from 'react';`, `import { Image } from 'expo-image';`, `import { Button } from 'heroui-native';`, `import { Text, View } from 'react-native';`, `import Animated, { useAnimatedStyle, useReducedMotion, useSharedValue, withDelay, withRepeat, withSpring, withTiming } from 'react-native-reanimated';`, `import { Plus } from 'reicon-react-native';`, `import Svg, { Circle, Ellipse, G } from 'react-native-svg';`, `import { useChunkyLip } from '../theme/chunky-lip';`, `import { MOTION_ENTRANCE_OFFSET_Y, MOTION_FADE_TIMING, MOTION_FLOAT_OFFSET_Y, MOTION_FLOAT_TIMING, MOTION_SETTLE_SPRING, MOTION_STAGGER_MS } from '../theme/motion';`, `import { PINGO_STAGE_PAW_OPACITY, PINGO_STAGE_SHADOW_COLOR } from '../theme/pingo-stage';`, `import { useThemeColors } from '../theme/use-theme-colors';`, `import { PingoFloat } from './pingo-float';`. El recuento de `require(` sigue en 6.
- `src/screens/home/index.test.tsx`, «#181 R3.2» (clase exacta de `home-no-pets-screen`): `'flex-1 items-center justify-center p-6 bg-background'` pasa a `'flex-1 items-center justify-center px-5 py-6 bg-background'` (R3). Los hijos `['home-empty']` y la ausencia de `screen-home` no cambian.
- `src/__tests__/profile-canvas-fidelity.test.ts`, «reserva text-26 al nombre de la mascota en Perfil»: el inventario de `text-26` añade `'components/empty-state.tsx', // #176 R8` como primer elemento (R8).
- `src/__tests__/alerts-canvas-fidelity.test.ts`, inventarios por token: `text-15` añade `'components/empty-state.tsx', // #176 R9` tras `'components/celebration.tsx'`; `tracking-title` añade `'components/empty-state.tsx', // #176 R8` como primer elemento (R8, R9).
- `src/screens/home/index.test.tsx`, «#155 R4: Inicio sin mascotas presenta a Pingo › pinta la pose, el título y la frase de Pingo» (enmendado por #176 R13): desde R13 el CTA nace con opacidad 0 y `toBeVisible()` sobre la etiqueta «Añadir mascota» falla en el primer render. La última aserción pasa a `await waitFor(() => expect(within(screen.getByTestId('home-empty-action')).getByText('Añadir mascota')).toBeVisible())` (timers reales; entrada de 180 ms de retraso, dentro del timeout de 1000 ms de `waitFor`). No cambia ninguna otra aserción. Omitida en la spec aprobada: detectada al conectar R2 (progress/impl_mobile-home-empty-canvas-fidelity.md).
- Si al implementar aparece rojo cualquier otro candado de inventario (por ejemplo en `design-drift.test.ts` o `heroui-text-size-merge.test.ts`), el implementer lo registra en `progress/impl_mobile-home-empty-canvas-fidelity.md` y lo enmienda con el mismo criterio; no relaja los candados de `chunky-cta-canvas-fidelity.test.ts` ni de `motion.test.ts`, que la implementación debe respetar tal cual.

## R1 - Variante default sin cambios (no regresión)

- [ ] (1) Escribir test que falla para R1: el test de caracterización nace verde (fija el estado actual antes de tocar el componente). Son los `it` ya existentes de `src/components/__tests__/empty-state.test.tsx` (#155 R3 y #171 R10/R11: pose 160×160, contenedor `items-center gap-3 py-8`, título `text-center text-lg font-bold text-foreground`, hijos directos `[-float, -title, -body, -action]`, flotación de 4 px en 1200 ms, botón sin icono). No se escribe un test paralelo: deben seguir verdes tras (2) y (3), salvo las dos enmiendas de imports listadas arriba. En `empty-state-hero.test.tsx` se añade un `it` que renderiza sin `variant` y con `variant="default"` y comprueba que no existen `*-stage`, `*-action-wrap` ni `*-action-icon`.
- [ ] (2) Implementación mínima que lo pasa: prop `variant?: 'default' | 'hero'` con `default` por defecto, sin cambios en el render de `default`.
- [ ] (3) Refactor con tests verdes: separar las ramas por variante sin cambiar valores.

## R2 - Inicio usa la variante hero

- [ ] (1) Escribir test que falla para R2 en `src/screens/home/index.test.tsx` (con la cuenta sin mascotas, como los «#155 R4» existentes): `home-empty` se renderiza en variante hero; se comprueba por efecto observable, `home-empty-stage` existe dentro de `home-empty`. Candado de alcance: `grep -rn 'variant="hero"' src/screens` devuelve solo `src/screens/home/index.tsx`.
- [ ] (2) Implementación mínima que lo pasa: `variant="hero"` en el `EmptyState` de `src/screens/home/index.tsx`.
- [ ] (3) Refactor con tests verdes.

## R3 - Composición y padding lateral

- [ ] (1) Escribir test que falla para R3: el «#181 R3.2» enmendado (ver arriba) exige la clase exacta `flex-1 items-center justify-center px-5 py-6 bg-background` y los hijos `['home-empty']`. Nace rojo porque el código aún tiene `p-6`.
- [ ] (2) Implementación mínima que lo pasa: `p-6` por `px-5 py-6` en el contenedor de la rama sin mascotas de `src/screens/home/index.tsx`.
- [ ] (3) Refactor con tests verdes.

## R4 - Pose de 190 px

- [ ] (1) Escribir test que falla para R4 en `empty-state-hero.test.tsx`: `home-empty-pose` tiene `style` `{ width: 190, height: 190 }`, `contentFit: 'contain'` y el `source` de `pingo-talk.webp`; y `getAnimatedStyle(home-empty-float)` no lleva ancho ni alto (PingoFloat solo anima `transform`, el `-float` de `default` lleva 160×160). La variante `default` sigue en 160 (test existente).
- [ ] (2) Implementación mínima que lo pasa: la variante `hero` aplica 190×190 a la imagen.
- [ ] (3) Refactor con tests verdes: una sola constante de tamaño por variante, sin literales de color.

## R5 - Escenario: sombra de suelo y huella

- [ ] (1) Escribir test que falla para R5 en `empty-state-hero.test.tsx`: `home-empty-stage` tiene la clase exacta `h-65 w-70 items-center justify-center` y como hijos directos, en este orden, `home-empty-stage-disc`, `home-empty-stage-paw`, `home-empty-float` y `home-empty-stage-shadow`; el disco tiene la clase exacta `absolute size-60 rounded-full bg-surface-secondary`; la sombra tiene la clase exacta `absolute bottom-4.5 h-3.5 w-30 rounded-full` y `backgroundColor: 'rgba(13,17,23,0.10)'` en su estilo; `home-empty-stage-paw` tiene `opacity: 0.18` en su estilo. Los valores van escritos en el test. Si el doble de `react-native-svg` de jest no propaga `testID` o `style` del `Svg`, el implementer lo registra en `progress/impl_...` y envuelve el `Svg` en un `View` con ese `testID` y esa opacidad, sin tocar el valor.
- [ ] (2) Implementación mínima que lo pasa: crear `src/theme/pingo-stage.ts` con `PINGO_STAGE_SHADOW_COLOR` y `PINGO_STAGE_PAW_OPACITY`; la variante `hero` los usa y dibuja las tres huellas con `react-native-svg` (geometría de design.md D3).
- [ ] (3) Refactor con tests verdes.

## R6 - Flotación con PingoFloat

- [ ] (1) Escribir test que falla para R6 en `empty-state-hero.test.tsx` (fake timers, reduce motion falso): `home-empty-pose` está dentro de `home-empty-float`; `getAnimatedStyle(home-empty-float)` solo lleva `transform: [{ translateY }]`; a 750 ms el `translateY` es cercano a -5, a 1500 ms cercano a -10 y a 3000 ms de vuelta a 0 (`toBeCloseTo(.., 0)`, como `pingo-float.test.tsx`). Con la variante `default` no hay `PingoFloat`: su `-float` sigue subiendo 4 px (test existente de #171 R10.3). La ausencia de `width`/`height` en el estilo animado distingue a PingoFloat del `-float` de `default`.
- [ ] (2) Implementación mínima que lo pasa: envolver la pose en `PingoFloat` en la variante `hero` y condicionar el efecto de flotación de `default` a `variant === 'default'`. Precondición: Enmienda #176 aprobada.
- [ ] (3) Refactor con tests verdes.

## R7 - Reduce motion

- [ ] (1) Escribir test que falla para R7 en `empty-state-hero.test.tsx` (`mockUseReducedMotion.mockReturnValue(true)`): a 0, 1500 y 10000 ms el `translateY` de `home-empty-float` es 0, y `home-empty-stage`, `home-empty-title-enter`, `home-empty-body-enter` y `home-empty-action-wrap` tienen en el primer render opacidad 1 y `translateY` 0 (`getAnimatedStyle`).
- [ ] (2) Implementación mínima que lo pasa: condicionar la entrada (R13) al flag de reduce motion (valores compartidos que nacen en el estado final); la flotación ya la apaga `PingoFloat`. Precondición: Enmienda #176 aprobada.
- [ ] (3) Refactor con tests verdes.

## R8 - Título 26/900 con tracking

- [ ] (1) Escribir test que falla para R8 en `empty-state-hero.test.tsx`: `home-empty-title` tiene la clase exacta `text-center text-26 font-black tracking-title text-foreground` y su texto es el recibido por prop. Además las enmiendas de inventario de `profile-canvas-fidelity` (`text-26`) y `alerts-canvas-fidelity` (`tracking-title`) quedan en verde.
- [ ] (2) Implementación mínima que lo pasa: esas clases en la rama `hero`, en el `Text` del título.
- [ ] (3) Refactor con tests verdes.

## R9 - Cuerpo 15 px con ancho máximo 290

- [ ] (1) Escribir test que falla para R9 en `empty-state-hero.test.tsx`: `home-empty-body` tiene la clase exacta `text-center text-15 text-muted` y `style` con `maxWidth: 290`. La enmienda de `text-15` de `alerts-canvas-fidelity` queda en verde.
- [ ] (2) Implementación mínima que lo pasa: clases y `style={{ maxWidth: 290 }}` en el `Text` del cuerpo de la rama `hero`.
- [ ] (3) Refactor con tests verdes.

## R10 - Copy sin cambios

- [ ] (1) Escribir test de caracterización (nace verde) en `src/screens/home/index.test.tsx`: título, cuerpo y etiqueta del CTA del Inicio sin mascota son los literales de origin/main en español e inglés, copiados en el test: `common.noPetsYet`, `common.noPetsBody` («Añade a tu mascota y te ayudo a saber dónde está y cómo está.» / «Add your pet and I'll help you know where they are and how they're doing.») y `profile.addPet`. Los «#155 R4» existentes ya cubren parte; se amplía con el literal de título y de CTA.
- [ ] (2) Ninguna implementación. Si el test se pone rojo, el cambio tocó el copy y hay que revertirlo.
- [ ] (3) Refactor: ninguno sobre texto.

## R11 - Grep-clean (ui-guidelines §3)

- [ ] (1) Escribir la comprobación antes del cambio: plantar `shadowColor: '#0D1117'` en el objeto `style` de `src/components/empty-state.tsx` (zona fuera de `className`, la que un candado de clases no mira). El comando de abajo debe fallar; después se revierte y debe quedar vacío.
- [ ] (2) Implementación mínima que lo pasa: sin literales en los ficheros tocados; color de la sombra y opacidad desde `src/theme/pingo-stage.ts`, colores de iconos desde `useThemeColors`.
- [ ] (3) Refactor con el comando en verde.

Comando (desde la raíz de la worktree):

`grep -nE 'rgba?\(|#[0-9A-Fa-f]{3,8}\b|className="[^"]*\[|StyleSheet\.create|shadowColor|shadowOffset|shadowOpacity|shadowRadius|elevation' mobile-pet-tracker/src/components/empty-state.tsx mobile-pet-tracker/src/screens/home/index.tsx`

Salida esperada: vacía. No escribir `#NNN` en comentarios de esos ficheros: el patrón hex también los cuenta (`#NNN R<n>` solo lo eximen otros candados, no este comando).

## R12 - CTA a todo el ancho con icono

- [ ] (1) Escribir test que falla para R12 en `empty-state-hero.test.tsx`, con acción: `home-empty-action-wrap` tiene la clase exacta `w-full mt-2.5` y su único hijo es `home-empty-action`; dentro de `home-empty-action`, `home-empty-action-icon` es el primer hijo, antes del texto de la etiqueta, y pulsar el botón llama a `onPress` una vez. Candados que deben seguir verdes sin tocarlos: el `it` de `empty-state.test.tsx` «declara el botón sin size ni variant» (un solo `<Button` y la etiqueta de apertura literal), «declara el botón primario con labio» y el inventario de `chunky-cta-canvas-fidelity.test.ts`. Añadir además: `expect(source).not.toMatch(/<Button[^>]*(w-full|mt-2\.5)/)` sobre `src/components/empty-state.tsx`.
- [ ] (2) Implementación mínima que lo pasa: envoltorio `w-full mt-2.5`, icono `Plus` (20 px, `accent-foreground` por `useThemeColors`, `marginRight: 8`) como primer hijo del `Button` solo en `hero`. El `Button` y su `Text` no cambian.
- [ ] (3) Refactor con tests verdes.

## R13 - Entrada escalonada

- [ ] (1) Escribir test que falla para R13 en `empty-state-hero.test.tsx`, con fake timers y reduce motion falso: en el primer render `home-empty-stage`, `home-empty-title-enter`, `home-empty-body-enter` y `home-empty-action-wrap` tienen opacidad 0 y `translateY` 12; a 100 ms (`getAnimatedStyle`) `home-empty-action-wrap` (retraso de 180 ms) sigue en opacidad 0; a 200 ms `opacidad(stage) > opacidad(title) > opacidad(body)` y `opacidad(body) >= opacidad(action) >= 0`; a 1000 ms los cuatro están en opacidad 1 y `translateY` 0 (el resorte de 250 ms ya asentó). Además: `empty-state.tsx` no contiene `entering=` ni `exiting=` (test existente de #155 R11) y `motion.ts` conserva sus exports (`motion.test.ts`).
- [ ] (2) Implementación mínima que lo pasa: `withDelay(índice × MOTION_STAGGER_MS, withTiming(1, MOTION_FADE_TIMING))` para la opacidad y `withDelay(..., withSpring(0, MOTION_SETTLE_SPRING))` para el desplazamiento desde `MOTION_ENTRANCE_OFFSET_Y`, con valores compartidos.
- [ ] (3) Refactor con tests verdes.

## R14 - Raíz y gap de la variante hero

- [ ] (1) Escribir test que falla para R14 en `empty-state-hero.test.tsx`, con acción: `home-empty` tiene la clase exacta `w-full items-center gap-3.5` y sus hijos directos, en este orden, son `home-empty-stage`, `home-empty-title-enter`, `home-empty-body-enter` y `home-empty-action-wrap`; `home-empty-title` está dentro de `home-empty-title-enter` y `home-empty-body` dentro de `home-empty-body-enter`; sin acción no hay `home-empty-action-wrap`. La variante `default` conserva `items-center gap-3 py-8` (test existente).
- [ ] (2) Implementación mínima que lo pasa: clase de raíz y envoltorios `-enter` en la rama `hero`.
- [ ] (3) Refactor con tests verdes.

## Cierre

- [ ] Trazabilidad: las 14 filas de `traceability.md` con test y commit reales.
- [ ] Smoke en dispositivo (dev build Android, no Expo Go): lo corre el humano, fuera del ciclo automatizado.
