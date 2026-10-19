---
feature: "mobile-pairing-pingo-canvas-fidelity"
status: draft        # draft | approved
tags: [harness, spec]
---

# Tareas — [[mobile-pairing-pingo-canvas-fidelity]]

> Orden: T0 y luego un bloque por requisito. Cada bloque: (1) test rojo que nombra el R-id en el `it`, (2) implementación mínima, (3) refactor. Un bloque no empieza hasta que el anterior esté en verde. Requisitos en [[requirements]]; filas en [[traceability]].
> Precondición: D1 a D7 cerradas por el humano y firma en `requirements.md`. #177 ya mergeada en `origin/main` (cbd964da): cumplida.
> Las rutas `src/…` son relativas a `mobile-pet-tracker/`.

## T0 — Premisas (sin código)

- HEAD contiene `origin/main` (`git merge-base --is-ancestor cbd964da HEAD`) y el árbol está limpio. Registrar H0 = `git rev-parse HEAD`.
- Anclas con `grep -cF`; la salida esperada va entre paréntesis (cuenta por líneas):
  - `padding: 24` en `src/screens/pairing/index.tsx` (1).
  - `text-2xl` en `src/screens/pairing/index.tsx` (2).
  - `--text-24` en `src/theme/global.css` (0).
  - `assets/images/pingo-collar.webp` existe.
  Si una cifra no coincide, parar y devolver al leader: la spec se reescribe, el código no se adapta.
- Literales de R6 y R8 contra `src/i18n/catalog.ts`, buscados por clave (`pairing.pairCollar`, `pairing.freePlanPairPrompt`, `pairing.activationCode`, `pairing.printedOnCollarBox`), no por número de línea. Si un literal no coincide con `requirements.md`, parar.
- Base de tests: `bun run test` una vez en `mobile-pet-tracker`, con la salida fuera del árbol. Anotar la línea `Tests:` como T0.

## R13 — `PingRing` compartido con welcome

Este bloque va primero: R2 y R3 usan el componente.

1. Test rojo `it('R13: ...')` en `src/components/__tests__/ping-ring.test.tsx` (nuevo): `PingRing` recibe el retardo por prop y lo aplica; con retardo 800 y con retardo 1600 (literales en el test), el anillo aplica ese retardo. Antes de crear `src/components/ping-ring.tsx` falla con `Cannot find module '../ping-ring'`.
2. Implementación mínima: mover la función local `PingRing` de `src/screens/welcome/index.tsx` a `src/components/ping-ring.tsx`, con props `testID`, `delay` (ms) y `className`. Welcome la importa y pasa sus clases actuales (`size-65 rounded-full border-2 border-accent`) y el retardo `index * (MOTION_PING_TIMING.duration / 3)`.
3. Refactor: borrar la copia local de welcome. `src/screens/welcome/index.test.tsx` pasa sin editar aserciones.

## R1 — Pingo en pose collar

1. Test rojo `it('R1: ...')` en `src/screens/pairing/index.test.tsx`: la vista de vinculación muestra `pairing-pingo` con `pingo-collar.webp` y no con `pingo-wave.webp`. Comprobar la fuente como lo hacen los tests de imagen que ya existen en el proyecto.
2. Implementación mínima: `Image` de expo-image con el asset collar como primer elemento visual del contenido, `contentFit="contain"`.
3. Refactor: el `require` del asset va una sola vez, en una constante local con nombre.

## R2 — Dos anillos con tamaño y borde

1. Test rojo `it('R2: ...')` en `src/screens/pairing/index.test.tsx`: existen `pairing-ring-0` y `pairing-ring-1`; no existe `pairing-ring-2`; el className de cada uno contiene `size-37.5`, `rounded-full`, `border-3` y `border-accent`.
2. Implementación mínima: dos instancias de `PingRing` detrás de Pingo, con testIDs `pairing-ring-0` y `pairing-ring-1` y className `size-37.5 rounded-full border-3 border-accent`. Si `border-3` no compila en uniwind, parar y devolver al leader: no inventar un valor.
3. Refactor: el className va en una constante local con nombre.

## R3 — Animación de los anillos

1. Test rojo `it('R3: ...')` en `src/screens/pairing/index.test.tsx`, con `toHaveAnimatedStyle` y `shouldMatchAllProps: true`. Valores literales, no importados de `src/theme/motion.ts`: en t = 0 ms, ambos anillos escala 0.55 y opacidad 0.55; en t = 600 ms, el anillo 0 con valores intermedios y el anillo 1 con 0.55 y 0.55; en t = 2400 ms, el anillo 0 vale escala 1.5 y opacidad 0 (valor final del ciclo). En t = 2401 ms (E1 de `requirements.md`), el anillo 0 ha reiniciado: escala entre 0.55 y 0.6 y opacidad entre 0.5 y 0.55, comprobado por desigualdades sobre el estilo leído, con claves exactas `opacity` y `transform`.
2. Implementación mínima en `PingRing`: `withDelay` (1200 ms en el anillo 1, 0 en el anillo 0), `withRepeat` infinito sin reversa, `withTiming` con `MOTION_PING_TIMING`, escala de `MOTION_PING_FROM` a `MOTION_PING_TO_SCALE`, opacidad de `MOTION_PING_FROM` a 0, y `cancelAnimation` en la limpieza.
3. Refactor: una sola función de animación compartida; ningún `Color` en los estilos animados.

## R4 — Flotado de Pingo

1. Test rojo `it('R4: ...')` en `src/screens/pairing/index.test.tsx`: `pairing-pingo-float` tiene `translateY` 0, -10 y 0 en 0, 1500 y 3000 ms.
2. Implementación mínima: envolver la imagen de Pingo en `PingoFloat` con `testID="pairing-pingo-float"`. `src/components/pingo-float.tsx` no cambia.
3. Refactor: ninguno. Si el test de `pingo-float` necesita cambios, parar.

## R5 — Reduce motion

1. Test rojo `it('R5: ...')` con `useReducedMotion` simulado a true: los dos anillos existen con escala 1 y opacidad 0.3; sus valores no cambian entre 0 y 2400 ms; `pairing-pingo-float` vale translateY 0 en 1500 ms.
2. Implementación mínima: `PingRing` lee `useReducedMotion()`; con reduce motion no llama a `withRepeat` y fija escala 1 y opacidad 0.3. `PingRing` es el único punto donde se decide reduce motion para los anillos.
3. Refactor: ninguno.

## R6 — Título dentro del contenido

1. Test rojo `it('R6: ...')` en `src/screens/pairing/index.test.tsx`: `pairing-title` está dentro de `pairing-form`; su texto es «Vincular collar» con locale es y «Pair collar» con locale en.
2. Implementación mínima: `Text` con `t('pairing.pairCollar')` como primer texto del contenido desplazable, testID `pairing-title`. La cabecera nativa no cambia (`title: ''`).
3. Refactor: si el título aparece en dos ramas, una sola fuente de texto. Sin cambio de testIDs.

## R7 — Token del título

1. Test rojo `it('R7: ...')` en `src/screens/pairing/index.test.tsx`: el className de `pairing-title` contiene `text-24` y `font-black`, y no contiene `text-2xl` ni `[`.
2. Implementación mínima: añadir `--text-24: 24px` a `src/theme/global.css` (D4 a). El título de la rama sin dispositivo usa `text-24 font-black` y pierde `text-2xl`. El título de la rama emparejada queda fuera de alcance.
3. Refactor: ninguno. Ejecutar `design-drift` y `consistency-classnames`.

## R8 — Orden de los elementos

1. Test rojo `it('R8: ...')` en `src/screens/pairing/index.test.tsx`: el orden de aparición en el árbol es `pairing-pingo`, `pairing-title`, `pairing-plan-free`, la etiqueta de `pairing.activationCode`, `activation-code-input`, la pista de `pairing.printedOnCollarBox` y `pairing-submit`; `pairing-subtitle` no existe.
2. Implementación mínima: ordenar la rama de vinculación según esa lista; banner y pista con sus claves actuales.
3. Refactor: ninguno.

## R9 — Subtítulo (D5 a)

1. Test rojo `it('R9: ...')` en `src/screens/pairing/index.test.tsx`: `pairing-subtitle` no existe en ningún estado de `pairing`. Es un test negativo y puede nacer verde: si nace verde, anotarlo como NV en el reporte y seguir. No forzar un rojo.
2. Implementación mínima: nada (D5 a).
3. Refactor: ninguno.

## R10 — Margen horizontal

1. Test rojo `it('R10: ...')` en `src/screens/pairing/index.test.tsx`: `contentContainerStyle` de `pairing-form` con `paddingHorizontal` 20 en la vista de vinculación y en el estado emparejado.
2. Implementación mínima: en `contentContainerStyle`, `padding: 24` pasa a `paddingHorizontal: 20` y `paddingVertical: 24`; `gap` y `paddingBottom` no cambian. No tocar `docs/conventions.md`: la excepción de fidelidad al canvas (2026-10-13) ya la cubre.
3. Refactor: ninguno.

## R11 — Copy por catálogo

1. Test rojo `it('R11: ...')` en `src/__tests__/pairing-canvas-fidelity.test.ts` (nuevo): grep-clean de literales de copy en `src/screens/pairing/index.tsx` (sin texto entre etiquetas JSX ni en props de texto); paridad es/en de las claves de la vista; cada clave de la vista aparece en `src/__tests__/ui-copy-table.ts`.
2. Implementación mínima: sustituir cualquier literal por `t()`. Las cuatro claves de `pairing` ya están en `catalog.ts` y en `ui-copy-table.ts`; no añadir claves.
3. Refactor: ninguno. Puede nacer verde: anotarlo como NV.

## R12 — Guardas de diseño

1. Test rojo `it('R12: ...')` en `src/__tests__/pairing-canvas-fidelity.test.ts`: cero coincidencias de hexadecimales y de clases con corchetes en `src/screens/pairing/index.tsx` y `src/components/ping-ring.tsx`. Hex: el patrón `HEX_LITERAL` de `src/__tests__/design-drift.test.ts`. Corchetes: `className="[^"]*\[`. Validación obligatoria: plantar una mutación temporal (`className="w-[3px]"` en `index.tsx`), comprobar que el grep la detecta y revertirla antes de cualquier commit.
2. Implementación mínima: retirar los hex y corchetes que aparezcan. Ejecutar las cuatro suites de guardas (`design-drift`, `consistency-classnames`, `legibility-classnames`, `heroui-text-size-merge`) y dejarlas en verde.
3. Refactor: ninguno.

## R14 — Otros estados sin cambios

1. Test rojo `it('R14: ...')` en `src/screens/pairing/index.test.tsx`: en el estado emparejado, en `ready` y sin mascotas no existen `pairing-pingo` ni `pairing-ring-0`. Puede nacer verde: anotarlo como NV.
2. Implementación mínima: montar el hero solo en la rama de vinculación.
3. Refactor: ninguno.

## Cierre

- `bun run test` en `mobile-pet-tracker`: en verde, con el total = T0 + los `it` nuevos. Los tests previos de `pairing` pasan; si una aserción previa choca con la spec, parar y devolver al leader.
- Guardas de R12 en verde.
- Typecheck: `test ! -e .expo/types/router.d.ts` antes de `bun run typecheck`.
- Lint: `bunx expo lint --no-cache > <log> 2>&1 && test ! -s <log>`, con el log fuera del árbol.
- Tras tocar código: `graphify update .` en el worktree (AST, sin coste).
- El reviewer comprueba que cada fila de `traceability.md` tiene test y commit.
