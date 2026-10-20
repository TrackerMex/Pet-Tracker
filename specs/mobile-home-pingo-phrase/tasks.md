---
feature: "mobile-home-pingo-phrase"
status: draft        # draft | approved
tags: [harness, spec]
---

# Tareas — [[mobile-home-pingo-phrase]]

> Disciplina TDD. Cada tarea corresponde a un requisito de [[requirements]] y
> tiene siempre los mismos 3 sub-items, en este orden. Rutas relativas a
> `mobile-pet-tracker/`. Commits test-primero: un commit rojo por requisito
> (`test(home): ... (R<n>)`), luego el verde (`feat(home): ... (R<n>)`).
> Los literales esperados en los tests se escriben a mano, nunca importados de
> `src/theme/` ni de `src/i18n/catalog.ts`.
>
> **Orden recomendado:** R9 y R8 (copy y función pura), R11 (token y clases),
> R1 a R4, R6, R10, R7, R13, R12; R5 y R14 solo con la Enmienda #190 firmada.
> R15 es del humano.

## R1 — Burbuja primer hijo de `home-content` con datos completos

Test en `src/screens/home/index.test.tsx`, describe nuevo `#190`. Fixture por defecto de ese fichero (mascota `Luna`, `mealsToday: null`, `makeDay()` con `distanceM: 2350`).

- [ ] (1) Test rojo R1: con mascota seleccionada, detalle `ok` y actividad resuelta, el primer hijo de `home-content` tiene `testID` `home-entrance-pingo`, el siguiente es `home-entrance-summary`, y `home-entrance-pingo` contiene exactamente un hijo `home-pingo-phrase`. Repetir con actividad `unauthorized`, `no-tracking` y `error`: la burbuja sigue presente (rama por rama, no un solo `it`).
- [ ] (2) Implementación mínima en `src/screens/home/index.tsx`: `HomeEntrance index={0} testID="home-entrance-pingo"` con `View testID="home-pingo-phrase"`, condición de R1.
- [ ] (3) Refactor con tests verdes.

## R2 — Sin burbuja cuando faltan datos

- [ ] (1) Test rojo R2 (un `it` por rama, todos en el describe `#190`): `selectedPetId` nulo; cuenta sin mascotas; mascotas cargando; mascotas en error; detalle `undefined` (cargando), `error` y `unreachable`; actividad `undefined` (cargando). En cada uno `queryByTestId('home-entrance-pingo')` es `null` y `queryByTestId('home-pingo-phrase')`, `'home-pingo-bubble'`, `'home-pingo-text'`, `'home-pingo'` también. Además, un `it` que fije que los bloques restantes no cambian (los ids que ya existían siguen apareciendo igual).
- [ ] (2) Implementación mínima: la condición de R1 ya la satisface; ajustar si algún rojo sigue en verde por accidente (ver memoria «Filas que nacen verdes por requisito previo»: cruzar con los `it` de R1).
- [ ] (3) Refactor con tests verdes.

## R3 — Estructura de la fila

- [ ] (1) Test rojo R3: `home-pingo-phrase` tiene la clase exacta `flex-row items-end gap-2.5` y sus hijos, en este orden, son `home-pingo-bubble` y `home-pingo-float`, y nada más.
- [ ] (2) Implementación mínima: fila con los dos hijos (la pose se completa en R4 y R5).
- [ ] (3) Refactor con tests verdes.

## R4 — Pose

- [ ] (1) Test rojo R4: `home-pingo` es hijo directo de `home-pingo-float`, su `source` resuelve a `pingo-talk.webp` (mismo método que el «pinta la pose» del estado vacío en el mismo fichero), `style` es `{ width: 64, height: 64 }` y no tiene `accessibilityLabel`.
- [ ] (2) Implementación mínima: `Image` de `expo-image` con `require('../../../assets/images/pingo-talk.webp')`. Sin `PingoFloat` todavía: `home-pingo-float` es una `View` simple hasta R5.
- [ ] (3) Refactor con tests verdes.

## R5 — Flotación de Pingo (precondición: Enmienda #190 firmada, R14)

Solo se empieza con la casilla «Enmienda #190» marcada en `requirements.md` §Aprobación.

- [ ] (1) Test rojo R5 (describe `#190`): con reduce motion desactivado, `home-pingo-float` es el `Animated.View` de `PingoFloat` y `withRepeat` se llamó con `(-10, -1, true)` (se distingue del pulso del punto de estado, que usa `-1, false`); con `mockUseReducedMotion` en `true`, esa llamada no ocurre y `home-pingo-float` no tiene `translateY` distinto de 0 (`toHaveAnimatedStyle` con `shouldMatchAllProps` para que ninguna clave extra pase en verde).
- [ ] (2) Implementación mínima: `PingoFloat testID="home-pingo-float"` envolviendo la `Image`; sin cambios en `pingo-float.tsx` ni en `motion.ts`.
- [ ] (3) Refactor con tests verdes.

## R6 — Índices desplazados

- [ ] (1) Test rojo R6: enmendar «#152 R5 pinta los seis envoltorios...» (pasa a siete, `home-entrance-pingo` primero, igualdad exacta de ids) y «escalona las entradas cada 60 ms...» (siete filas, retrasos 0, 60, 120, 180, 240, 300, 360 por id). Añadir un `it` que fije que los índices son fijos: con un bloque que no se pinta, los demás conservan su retraso.
- [ ] (2) Implementación mínima: `index={0}` para la burbuja y 1 a 6 para el resto.
- [ ] (3) Refactor con tests verdes.

## R7 — Reduce motion en la entrada

- [ ] (1) Test rojo R7: con `mockUseReducedMotion` en `true`, la entrada de `home-entrance-pingo` se construye con desplazamiento 0 y conserva el fundido (misma aserción que ya hace «#152 R4» en `home-entrance.test.tsx`, aplicada al bloque nuevo de Inicio); la burbuja no registra animación de escala (`withSpring` no se llama para ella). Sin `home-entrance.tsx` ni `motion.ts` en el diff.
- [ ] (2) Implementación mínima: nada nuevo si `HomeEntrance` ya lo cubre; el test fija que no se rompa.
- [ ] (3) Refactor con tests verdes.

## R8 — Función pura `homePingoPhrase`

Test en el fichero nuevo `src/screens/home/pingo-phrase.test.ts`.

- [ ] (1) Test rojo R8, una fila por rama y borde: distancia 2350 con comidas `{served:1,total:2}` da `home.pingoPhraseWalkMeals` con `{ petName, km: '2.4 km', served: 1, total: 2 }`; distancia sola (`meals: null`, y `meals: {served:0,total:0}`) da `home.pingoPhraseWalk`; comidas solas (`distanceM: null`, `0`, `99`) dan `home.pingoPhraseMeals`; ninguno da `home.pingoPhraseCalm` con `{ petName }`; borde `distanceM: 100` válido y `99` no; `served > total` no se corrige. Las expectativas de `km` van escritas a mano.
- [ ] (2) Implementación mínima: `src/screens/home/pingo-phrase.ts`, `homePingoPhrase`, con `labelKey: '...'` literal por rama (para `checkUses`, R13).
- [ ] (3) Refactor con tests verdes.

## R9 — Cuatro claves del catálogo

- [ ] (1) Test rojo R9 en `pingo-phrase.test.ts`: para cada una de las cuatro claves, el literal EN y el ES exactos de [[requirements]] R9 renderizados con parámetros de ejemplo (por el mismo mecanismo que usan los demás tests de catálogo del repo); `language-provider.test.tsx` suma `+ 4, // #190 R9` a la fórmula (el rojo es el recuento sin las claves).
- [ ] (2) Implementación mínima: cuatro claves en `en` y en `es` de `src/i18n/catalog.ts`.
- [ ] (3) Refactor con tests verdes.

## R10 — Texto y cambio de idioma

- [ ] (1) Test rojo R10: con la fixture por defecto en español, `home-pingo-text` contiene `Luna ya caminó 2.4 km hoy.`; tras cambiar el idioma a inglés (`await act`), contiene `Luna has walked 2.4 km today.` sin nueva llamada a las queries. Otro `it` con `mealsToday: { served: 1, total: 2 }`: ES `Luna ya caminó 2.4 km hoy y lleva 1 de 2 comidas.`; otro con actividad `no-tracking` y sin comidas: `Estoy pendiente de Luna.`
- [ ] (2) Implementación mínima: `Text testID="home-pingo-text"` con `t(phrase.labelKey, phrase.params)` desde `homePingoPhrase(...)`.
- [ ] (3) Refactor con tests verdes.

## R11 — Clases y token

- [ ] (1) Test rojo R11: en `index.test.tsx`, `home-pingo-bubble` tiene la clase exacta `flex-1 rounded-tile rounded-br-4 bg-surface px-3.5 py-3 shadow-sm` y su único hijo es `home-pingo-text` con `text-15 font-semibold leading-5.25 text-foreground`; en `src/__tests__/home-pingo-phrase.test.ts` (nuevo), `src/theme/global.css` contiene `--radius-4: 4px;` exactamente una vez. Verificar el supuesto de uniwind de [[design]] §Supuestos no verificados antes de dar el rojo por bien formado.
- [ ] (2) Implementación mínima: `View` y `Text` con esas clases; token en `global.css` junto a los demás `--radius-*`.
- [ ] (3) Refactor con tests verdes.

## R12 — Grep-clean

- [ ] (1) Test rojo R12 en `src/__tests__/home-pingo-phrase.test.ts`: sobre `src/screens/home/index.tsx` y `src/screens/home/pingo-phrase.ts`, cero literales hex, cero clases arbitrarias `[...]`, cero `StyleSheet.create`, cero `elevation`/`shadowColor` y cero emoji. Plantar a mano una violación (por ejemplo `bg-[#fff]`) para ver el test fallar antes de retirarla (memoria «Anclas negativas»).
- [ ] (2) Implementación mínima: nada nuevo si R1 a R11 respetan la receta; corregir lo que el test marque.
- [ ] (3) Refactor con tests verdes.

## R13 — Candados que se mueven

- [ ] (1) Test rojo R13: aplicar las enmiendas de §Tests enmendados (el recuento sin ellas queda rojo al añadir los ficheros y claves).
- [ ] (2) Implementación mínima: sincronizar las listas con el código ya escrito.
- [ ] (3) Refactor con tests verdes.

## R14 — Enmienda #190 en `docs/ui-guidelines.md`

Solo tras la casilla firmada.

- [ ] (1) Test rojo R14 en `src/__tests__/home-pingo-phrase.test.ts`: `../docs/ui-guidelines.md` contiene el encabezado `## Enmienda #190` y el texto de [[design]] §Texto de la Enmienda #190 (anclas por contenido: `Burbuja de Pingo en Inicio`, `--radius-4`, `home-pingo`). Sin la firma el test no se escribe y R5 no se implementa.
- [ ] (2) Implementación mínima: copiar el texto de la Enmienda a `docs/ui-guidelines.md`.
- [ ] (3) Refactor con tests verdes.

## R15 — Smoke humano (no lo cierra ninguna IA)

- [ ] (1) El implementer deja listos `bun run init` verde y las instrucciones del smoke en `progress/impl_mobile-home-pingo-phrase.md`: dev build Android, claro, oscuro, reduce motion activado.
- [ ] (2) El humano prueba y marca su casilla en [[requirements]] §Aprobación.
- [ ] (3) Si algo difiere del artboard, se abre feature de seguimiento; no se retoca aquí.

## Tests enmendados

Cambios mecánicos a tests existentes que la burbuja obliga a mover. Todos van en el commit rojo del requisito indicado y se listan en `progress/impl_mobile-home-pingo-phrase.md`.

1. `src/screens/home/index.test.tsx` (R6): «#152 R5 pinta los seis envoltorios...» pasa a siete con `home-entrance-pingo` el primero; «escalona las entradas cada 60 ms en el orden de los bloques» pasa a siete filas 0 a 360 (pingo 0, summary 60, collar 120, quick-actions 180, weekly 240, reminders 300, last-position 360). Las demás listas `relevantChildren` del fichero filtran por ids cerrados y no cambian.
2. `src/screens/home/index.test.tsx` (R10): cualquier aserción existente que se vuelva ambigua por la frase de la burbuja (por ejemplo un regex sobre el nombre `Luna` con `getByText`) se acota con `within()` al bloque que ya probaba. Se lista cada una en el informe de implementación. Verificarlo con la suite del fichero antes del commit verde.
3. `src/__tests__/alerts-canvas-fidelity.test.ts` (R13): el inventario de `text-15` suma `'screens/home/index.tsx', // #190 R13` entre `'screens/forgot/index.tsx'` y `'screens/login/index.tsx'`.
4. `src/__tests__/ui-copy-table.ts` (R13): cuatro filas `{ file: 'src/screens/home/pingo-phrase.ts', key: 'home.pingoPhraseWalkMeals' }` y las de `Walk`, `Meals`, `Calm`, dentro de `R3_HOME`.
5. `src/__tests__/ui-language.test.ts` (R13): `expect(R3_HOME).toHaveLength(... + 4) // #190 R9/R13` y `expect(SCREEN_FILES).toHaveLength(... + 1) // #190 R13: screens/home/pingo-phrase.ts`. Medir la cifra base en el árbol antes de sumar (no copiar números de esta spec).
6. `src/providers/__tests__/language-provider.test.tsx` (R9): `+ 4, // #190 R9` al final de la fórmula de la longitud del catálogo.

Ninguna otra suite debería cambiar. Si `bun run test` (o el comando de `init.sh`) muestra otro rojo atribuible a la burbuja, se enmienda aquí y se anota, no se silencia.
