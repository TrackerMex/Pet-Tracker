---
feature: "mobile-pairing-pingo-canvas-fidelity"
status: approved     # draft | approved
tags: [harness, spec]
---

# Tareas — [[mobile-pairing-pingo-canvas-fidelity]]

> Orden: T0 y luego un bloque por requisito. Cada bloque: (1) test rojo que nombra el R-id en el `it`, (2) implementación mínima, (3) refactor. Un bloque no empieza hasta que el anterior esté en verde. Requisitos en [[requirements]]; filas en [[traceability]].
> Precondición: D1 a D7 cerradas por el humano y firma en `requirements.md`. #177 ya mergeada en `origin/main` (cbd964da): cumplida. Para R15 a R20, la firma de E2 (ED1 a ED4 cerradas) en `requirements.md` §Aprobación.
> Las rutas `src/…` son relativas a `mobile-pet-tracker/`.
> R1 a R14 ya están implementados y trazados (ver [[traceability]]). T0-E2 y los bloques R15 a R20 se añaden con E2; no se rehace nada de R1 a R14 salvo las migraciones de aserciones que lista §Migraciones autorizadas de E2.

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

## T0-E2 — Premisas de E2 (sin código)

- Antes de tocar nada: `git status --short` sin cambios en `mobile-pet-tracker/` y `H0-E2 = git rev-parse HEAD`.
- Anclas con `grep -cF` (cuenta líneas), salida esperada entre paréntesis. Si una cifra no coincide, parar y devolver al leader:
  - `--text-24` en `src/theme/global.css` (1); `--text-28` (0); `--tracking-code` (0); `--font-mono` (0); `--tracking-title` (1).
  - `freePlanPairPrompt` en `src/i18n/catalog.ts` (2: es y en); `freePlanPairLead` en `src/i18n/catalog.ts` (0).
  - `freePlanPairPrompt` en `src/__tests__/ui-copy-table.ts` (1), en `src/__tests__/pairing-canvas-fidelity.test.ts` (1) y en `src/screens/pairing/index.tsx` (1).
  - `PetSwitcher` en `src/screens/pairing/index.tsx` (2: el import y el uso); `text-24 font-black text-foreground` en el mismo fichero (1); `pairing-hero` (0); `pairing-pet-row` (0).
  - `CATEGORY_SLOTS` en `src/utils/category-palette.ts` (1).
  - `assets/images/pingo-collar.webp` existe y mide 1024 × 1024 (`R15` depende de `aspectRatio: 1`).
- Base de tests: `bun run test` una vez en `mobile-pet-tracker`, salida fuera del árbol. Anotar la línea `Tests:` como T0-E2.
- Paquetes: `reicon-react-native` exporta `InfoCircle` y `Package` (comprobado por el leader). No se añade ninguna dependencia.

## Migraciones autorizadas de E2

Los requisitos de E2 chocan con estas aserciones previas. Cada migración la autoriza esta spec con la aserción nueva exacta; hay que registrarla en `progress/impl_*.md` con el nombre del `it`, la aserción cambiada y el R-id. Cualquier otra aserción previa que falle: parar y devolver al leader. Se citan por título, no por número de línea.

En `src/screens/pairing/index.test.tsx`:

- `limpia actionError al seleccionar otra mascota` y `submits the trimmed code exactly once for the selected pet` (R17): en la vista de vinculación ya no hay `pet-chip-*`. La mascota 2 se selecciona con una sonda de prueba dentro de `PairingWrapper` que llama `useSelectedPet().selectPet('pet-2')` dentro de `await act`, en lugar de pulsar `pet-chip-pet-2`. En el segundo, la espera sobre `pet-chip-pet-1` con `accessibilityState` `{ selected: true }` pasa a esperar que `pairing-pet-avatar` tenga `accessibilityLabel` `Luna`. El resto de aserciones de cada test (`petId: 'pet-2'`, el código `ACT-002`, el error limpio) no cambian.
- `uses the shared pet switcher and changes the selected pet` (R17): se traslada al estado emparejado (las dos mascotas con `device: makeDevice()` y `mockGetPetTracking` resuelto), donde `PetSwitcher` sigue montado. Las aserciones sobre `pet-chip-*` no cambian.
- `#188 R6: places the %s title first inside the scroll content` (R17): `texts[0]` excluye el texto `pairing-pet-avatar-fallback`; el título sigue siendo el primer texto del contenido tras el avatar.
- `#188 R7: gives the title the 24 px token and black weight` (R16): se renombra `#188 R7/R16: gives the title the 28 px token and black weight`; espera `text-28` y `font-black`, y que no contenga `text-24`, `text-2xl` ni `[`.
- `#188 R10: uses 20 px horizontal padding when %s` (R19): en la vista de vinculación (`linking`) el objeto esperado gana `flexGrow: 1` (queda `{ paddingHorizontal: 20, paddingVertical: 24, gap: 16, paddingBottom: 48, flexGrow: 1 }`); en `paired`, sin cambios.

En `src/__tests__/pairing-canvas-fidelity.test.ts`:

- `#188 R11: resolves visible copy through bilingual catalog keys registered for pairing` (R18): en la lista de claves, `pairing.freePlanPairPrompt` se sustituye por `pairing.freePlanPairLead` y `pairing.freePlanPairBody`.

En otros ficheros (guardas existentes, mismas claves de cambio que R18/R20):

- `src/__tests__/ui-language.test.ts`: `expect(R10_PAIRING).toHaveLength(42 + 2 + 1 + 4 - 1)` pasa a `42 + 2 + 1 + 4 - 1 + 1`, con el comentario `#188 R18: -1 fila Prompt, +2 filas Lead y Body`. Las entradas de `ui-copy-table.ts` cambian así: se borra la de `pairing.freePlanPairPrompt` y se añaden `{ file: 'src/screens/pairing/index.tsx', key: 'pairing.freePlanPairLead' }` y la de `pairing.freePlanPairBody`.
- `src/__tests__/design-drift.test.ts`: la guarda de `rounded-14` (`outsideReminders(/\brounded-14\b/)`) añade `join('screens', 'pairing', 'index.tsx'), // #188 R20 comparte rounded-14` a la lista de ficheros esperados, en orden alfabético (después de `meals-history`).
- `consistency-classnames`: sin cambios (el banner no lleva `CONTINUOUS_CORNER`; el input conserva el suyo y el recuento de `pairing` sigue en 1).

Quedan fuera de las migraciones y deben seguir en verde sin editarse: `limpia la vista ready y el código al seleccionar otra mascota` (tras reclamar, la fase es `ready` y `PetSwitcher` sigue montado), `#188 R1` y `#188 R8` (sus regex de testIDs no incluyen los nodos nuevos), `#188 R2`, `shows the exact free-plan note and constrained activation-code field`, `renders the real route with uniform metrics and a dimensioned skeleton (#95 R6)` (estado de carga: `flexGrow` solo se añade cuando `phase === 'idle' && selectedPet?.device === null`), y los candados de `design-drift` sobre el import de `Card` y de `PetSwitcher` (siguen en uso en los demás estados).

Las guardas de `design-drift` que acotan `pairing` exigen que sigan en el fichero los literales `paddingHorizontal: 20`, `paddingVertical: 24`, `gap: 16` e `insets.bottom + 24`, y prohíben `insets.top + 12` e `insets.bottom + 96`: no los cambies.

## R15 — Hero de 200 × 150 y grupo con el título

1. Test rojo `it('#188 R15: groups a 200 × 150 hero box and the title with a 10 px gap')` en `src/screens/pairing/index.test.tsx`, con los valores literales de R15: `pairing-hero` con `w-50` y `h-37.5`; `pairing-pingo` con `width` 120, `aspectRatio` 1 y sin `height`; `pairing-hero` y `pairing-title` hijos directos de `pairing-hero-group`, que tiene `items-center` y `gap-2.5`; los anillos y `pairing-pingo-float` hijos de `pairing-hero` en el orden de R2.
2. Implementación mínima en `src/screens/pairing/index.tsx`: `pairing-hero-group` (`View items-center gap-2.5`) con `pairing-hero` (`View h-37.5 w-50 items-center justify-center` y las props de accesibilidad que ocultan el hero) y `pairing-title`. `pairing-pingo` pasa a `{ width: 120, aspectRatio: 1 }`, con `contentFit="contain"`.
3. Refactor: ninguno. El test de R2 (anillos antes que `pairing-pingo`) y el de R4 siguen en verde sin editarse.

## R16 — Título de 28 px centrado

1. Test rojo `it('#188 R16: centers the title at 28 px with black weight and title tracking')`: el className de `pairing-title` contiene `text-center`, `text-28`, `font-black`, `tracking-title` y `text-foreground`; no contiene `text-24`, `text-2xl` ni `[`. Test de tokens `it('#188 R16/R20: declares the new theme tokens')` en `src/__tests__/pairing-canvas-fidelity.test.ts`: lee `src/theme/global.css` y comprueba que contiene `--text-28: 28px`, `--tracking-code: 0.14em` y `--font-mono: monospace`. Este segundo test puede tardar hasta R20 en ponerse en verde; hasta entonces falla por `--tracking-code` y `--font-mono`, y se anota en el reporte.
2. Implementación mínima: añadir `--text-28: 28px` a `@theme` de `src/theme/global.css`, junto a `--text-24` y `--text-26`; el título usa `text-center text-28 font-black tracking-title text-foreground`. Migra `#188 R7` como indica §Migraciones autorizadas, y en `traceability.md` la fila R7 cita el nombre nuevo del test (sin tocar sus hashes).
3. Refactor: ninguno. Ejecutar `design-drift` y `consistency-classnames`.

## R17 — Fila superior con el avatar de la mascota seleccionada

1. Tests rojos (`src/screens/pairing/index.test.tsx`, con `useSelectedPet` seleccionando cada mascota mediante la sonda de §Migraciones autorizadas):
   - `it('#188 R17: shows only the selected pet avatar above the hero')`: con dos mascotas y la primera seleccionada, existe exactamente un `pairing-pet-avatar`, aparece en el árbol antes que `pairing-pingo`, su `accessibilityLabel` es el nombre de la primera, no tiene `onPress` y no existe ningún `pet-chip-*`; el anillo lleva `rounded-full`, `border-2`, `border-accent` y `p-0.75`.
   - `it('#188 R17: renders the initial or the photo on the palette slot of the selected pet')`: sin foto, `pairing-pet-avatar-fallback` muestra la inicial en mayúscula y el disco (`pairing-pet-avatar-disc`) usa `size-9`, `rounded-full` y `bg-category-amber` con la primera y `bg-category-violet` con la segunda; con foto existe `pairing-pet-avatar-image` y no existe el de inicial.
   - `it('#188 R17: keeps the full pet switcher outside the linking view')`: en el estado emparejado y en `ready` con dos mascotas existen `pet-chip-<id>` y no existe `pairing-pet-avatar` ni `pairing-pet-row`.
2. Implementación mínima en `src/screens/pairing/index.tsx`: función local `PairingPetAvatar` (sin fichero nuevo) según `design.md` decisión 13; `PetSwitcher` solo se monta si hay mascotas y no es la vista de vinculación.
3. Refactor: el arreglo del hueco (`['amber', 'violet', 'blue', 'green', 'rose'] as const`) va en una constante local con nombre. Migra los tests que lista §Migraciones autorizadas.

## R18 — Banner del plan gratuito

1. Test rojo `it('#188 R18: renders the free-plan banner with an info icon and a bold lead')`, con `reicon-react-native` simulado en el fichero de test (el mock expone `size` y `color` de `InfoCircle` y `Package`, como `form-error.test.tsx` con `AlertCircle`): `pairing-plan-free` tiene `text-13`, `font-normal`, `leading-4.75` y `text-muted`, y su texto completo es el de R8 en es y en; el `Text` anidado del lead tiene `font-bold` y `text-foreground`; el padre directo del icono y del texto tiene `bg-default`, `rounded-tile` y `gap-2.5` y no es un `Card`; el icono se renderiza con `size` 20 y el color de `muted`. Para la ausencia de la clave vieja, `it('#188 R11/R18: resolves visible copy …')` (migrado) comprueba que `pairing.freePlanPairPrompt` ya no está.
2. Implementación mínima: en `catalog.ts` (es y en) se borra `pairing.freePlanPairPrompt` y se añaden `pairing.freePlanPairLead` («Plan gratuito — solo salud.» / «Free plan — health only.») y `pairing.freePlanPairBody` («Vincula un collar con plan activo para ver el mapa.» / «Pair a collar with an active plan to see the map.»); en `ui-copy-table.ts` se sustituye la entrada. El banner es el `View` de `design.md` decisión 14, con `InfoCircle` de `reicon-react-native` (20 px, color de `useThemeColors(['muted'])`) dentro de un `View mt-px` con testID `pairing-plan-icon`.
3. Refactor: ninguno. El candado de copy suelto de R11 solo admite `{' '}` por quedar vacío al recortarlo; si el candado falla por otra cosa, parar.

## R19 — Botón anclado al fondo

1. Test rojo `it('#188 R19: anchors the submit button to the bottom edge')`: el `contentContainerStyle` de `pairing-form` tiene `flexGrow: 1` en la vista de vinculación y no lo tiene en el estado emparejado; el elemento inmediatamente anterior a `pairing-submit` es `pairing-submit-spacer`, con `flexGrow: 1`; `pairing-submit` es el último elemento del formulario.
2. Implementación mínima: `contentContainerStyle` gana `flexGrow: 1` solo en la vista de vinculación; el envoltorio del formulario lleva `style={{ flexGrow: 1 }}`; `View testID="pairing-submit-spacer" style={{ flexGrow: 1 }}` justo antes de `pairing-submit`. La receta del botón (#177) no se toca.
3. Refactor: ninguno. Migra `#188 R10` como indica §Migraciones autorizadas.

## R20 — Etiqueta, input y pista del código

1. Test rojo `it('#188 R20: styles label, code input and hint like the artboard')`: los className de etiqueta, input y pista contienen las clases de R20 y ninguna de las que pierden (`uppercase`, `tracking-widest`, `text-xs` y `font-semibold` en la etiqueta; `min-h-12`, `rounded-xl` y `py-3` en el input); el contenedor de los tres tiene `gap-1.5`; el input conserva `autoCapitalize="characters"`, `autoCorrect={false}`, `maxLength={64}`, `value` y `onChangeText`; el icono `Package` se renderiza con `size` 14 y el color de `muted`; al escribir `  ACT-002  ` el valor del input sigue siendo el escrito y `claimDevice` recibe `ACT-002`. El test de tokens de R16 (`#188 R16/R20: declares the new theme tokens`) pasa a verde en este bloque.
2. Implementación mínima: añadir `--tracking-code: 0.14em` y `--font-mono: monospace` a `@theme` de `src/theme/global.css`; aplicar las recetas de R20 en `src/screens/pairing/index.tsx`. Si uniwind no compila `font-mono` con ese token, parar y devolver al leader: no se inventa otra familia.
3. Refactor: ninguno. Ejecutar `design-drift` (migración de `rounded-14` de §Migraciones autorizadas) y `consistency-classnames`.

## Cierre

- `bun run test` en `mobile-pet-tracker`: en verde, con el total = T0 + los `it` nuevos. Los tests previos de `pairing` pasan; si una aserción previa choca con la spec, parar y devolver al leader. Para E2, total = T0-E2 + los `it` nuevos de R15 a R20 (R15: 1; R16: 2, el de clases y el de tokens; R17: 3; R18: 1; R19: 1; R20: 1; en total 9) + los `it` que se renombran no suman ni restan.
- Guardas de R12 en verde.
- Typecheck: `test ! -e .expo/types/router.d.ts` antes de `bun run typecheck`.
- Lint: `bunx expo lint --no-cache > <log> 2>&1 && test ! -s <log>`, con el log fuera del árbol.
- Tras tocar código: `graphify update .` en el worktree (AST, sin coste).
- El reviewer comprueba que cada fila de `traceability.md` tiene test y commit.
