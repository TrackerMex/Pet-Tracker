---
feature: "mobile-pairing-pingo-canvas-fidelity"
status: draft        # draft | approved
tags: [harness, spec]
---

# Tareas — [[mobile-pairing-pingo-canvas-fidelity]]

> Orden: T0 y luego un bloque por requisito. Cada bloque: (1) test rojo que nombra el R-id en el `it`, (2) implementación mínima, (3) refactor. Un bloque no empieza hasta que el anterior esté en verde. Requisitos en [[requirements]]; filas en [[traceability]].
> Precondición: D1 a D7 cerradas por el humano. #177 ya mergeada en `origin/main` (cbd964da): cumplida.

## T0 — Premisas (sin código)

- HEAD del worktree = d799d714 y árbol limpio antes de empezar.
- `pingo-collar.webp` existe en `mobile-pet-tracker/assets/images/` (verificado al redactar la spec). Si desaparece, parar y devolver al leader.
- Literales de R6 y R8 contra `src/i18n/catalog.ts`, buscados por clave y no por línea.
- `--text-24` ausente en `src/theme/global.css` antes de aplicar D4 (a).

## R1 — Pingo en pose collar

1. Test rojo `it('R1: ...')` en `src/screens/pairing/index.test.tsx`: la vista de vinculación muestra `pairing-pingo` con `pingo-collar.webp` y no con `pingo-wave.webp`.
2. Implementación mínima: `Image` de expo-image con el asset collar como primer elemento del contenido, `contentFit="contain"`.
3. Refactor: el `require` del asset va una sola vez, en una constante local con nombre.

## R2 — Dos anillos con tamaño y borde

1. Test rojo `it('R2: ...')`: existen `pairing-ring-0` y `pairing-ring-1`, no existe `pairing-ring-2`, y el className de cada uno contiene `size-37.5`, `rounded-full`, `border-3` y `border-accent`.
2. Implementación mínima: `PingRing` en `src/components/ping-ring.tsx` recibe esas clases; dos instancias detrás de Pingo. Si `border-3` no compila en uniwind, parar y devolver al leader: no inventar un valor.
3. Refactor: props sin estilos en línea.

## R3 — Animación de los anillos

1. Test rojo `it('R3: ...')`: con `toHaveAnimatedStyle` y `shouldMatchAllProps: true`, valores literales en t = 0, 600 y 2400 ms; el anillo 1 conserva los valores iniciales en 600 ms.
2. Implementación mínima: `withDelay` (1200 ms en el anillo 1, 0 en el anillo 0), `withRepeat` infinito sin reversa, `withTiming` con `MOTION_PING_TIMING`, `cancelAnimation` en la limpieza.
3. Refactor: una sola función de animación compartida; ningún `Color` en los estilos animados.

## R4 — Flotado de Pingo

1. Test rojo `it('R4: ...')`: `pairing-pingo-float` tiene `translateY` 0, -10 y 0 en 0, 1500 y 3000 ms.
2. Implementación mínima: envolver la imagen de Pingo en `PingoFloat` con testID `pairing-pingo-float`.
3. Refactor: ninguno. Si el test de `pingo-float` cambia, parar.

## R5 — Reduce motion

1. Test rojo `it('R5: ...')` con `useReducedMotion` a true: anillos con escala 1 y opacidad 0.3, sin cambio entre 0 y 2400 ms; `pairing-pingo-float` con `translateY` 0 en 1500 ms.
2. Implementación mínima: `useReducedMotion()` en `PingRing`; con reduce motion no se llama a `withRepeat` y el anillo fija sus valores de reposo. La forma exacta depende de D2 (a) o (b).
3. Refactor: un único punto de decisión de reduce motion en la vista.

## R6 — Título dentro del contenido

1. Test rojo `it('R6: ...')`: `pairing-title` dentro de `pairing-form`, con «Vincular collar» en es y «Pair collar» en en.
2. Implementación mínima: `Text` con `t('pairing.pairCollar')` como primer texto del contenido; la cabecera nativa no cambia.
3. Refactor: sin cambio de testIDs; si el título aparece en dos ramas, una sola fuente de texto.

## R7 — Token del título

1. Test rojo `it('R7: ...')`: el className de `pairing-title` contiene la clase de D4 y `font-black`, y no contiene `text-2xl` ni `[`.
2. Implementación mínima: D4 (a) añade `--text-24: 24px` a `src/theme/global.css`; el título de la vista usa la clase de D4 y se retira el `text-2xl` del título de la vinculación; el de la rama emparejada queda fuera de alcance.
3. Refactor: ninguno. Ejecutar `design-drift` y `consistency-classnames`.

## R8 — Orden de los elementos

1. Test rojo `it('R8: ...')`: orden de testIDs `pairing-pingo`, `pairing-title`, `pairing-plan-free`, etiqueta, `activation-code-input`, pista, `pairing-submit`, sin `pairing-subtitle`.
2. Implementación mínima: ordenar la rama de vinculación según ese orden; banner y pista con sus claves actuales.
3. Refactor: ninguno.

## R9 — Subtítulo (según D5)

1. Test rojo `it('R9: ...')`: si D5 = (a), `pairing-subtitle` no existe en ningún estado; si D5 = (b), existe con el literal aprobado en cada locale.
2. Implementación mínima: (a) nada; (b) clave nueva en `src/i18n/catalog.ts` (es y en) y entrada en `src/__tests__/ui-copy-table.ts`.
3. Refactor: ninguno.

## R10 — Margen horizontal

1. Test rojo `it('R10: ...')`: `contentContainerStyle` de `pairing-form` con `paddingHorizontal` 20 en la vista de vinculación y en el estado emparejado.
2. Implementación mínima: cambiar `paddingHorizontal` en `contentContainerStyle`; registrar la excepción en `docs/conventions.md` si D6 = (a).
3. Refactor: ninguno.

## R11 — Copy por catálogo

1. Test rojo `it('R11: ...')`: grep-clean de literales de copy en `index.tsx`; paridad es/en de las claves de la vista; cada clave de la vista en `ui-copy-table.ts`.
2. Implementación mínima: sustituir cualquier literal por `t()` y registrar las claves.
3. Refactor: ninguno.

## R12 — Guardas de diseño

1. Test rojo: grep de hex y corchetes sobre `index.tsx` y `ping-ring.tsx`, validado con una mutación plantada (una coincidencia temporal que el grep debe detectar).
2. Implementación mínima: retirar hex y corchetes; ejecutar las cuatro suites de guardas.
3. Refactor: ninguno.

## R13 — Welcome sin cambio de comportamiento

1. Test rojo `it('R13: ...')` en `src/components/__tests__/ping-ring.test.tsx`: `PingRing` con retardo 800 y 1600 lo aplica al anillo correspondiente.
2. Implementación mínima: mover `PingRing` desde welcome a `src/components/ping-ring.tsx`; welcome lo importa y pasa sus clases actuales y `index * (MOTION_PING_TIMING.duration / 3)`.
3. Refactor: borrar la copia local de welcome. `src/screens/welcome/index.test.tsx` debe pasar sin editar aserciones.

## R14 — Otros estados sin cambios

1. Test rojo `it('R14: ...')`: en el estado emparejado, en `ready` y sin mascotas no existen `pairing-pingo` ni `pairing-ring-0`.
2. Implementación mínima: montar el hero solo en la rama de vinculación.
3. Refactor: ninguno.

## Cierre

- Suite completa de `mobile-pet-tracker` y las cuatro guardas en verde.
- Tras tocar código: `graphify update .` (AST, sin coste).
- El reviewer comprueba que cada fila de `traceability.md` tiene test y commit.
