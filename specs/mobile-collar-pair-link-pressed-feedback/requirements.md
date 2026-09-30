---
feature: "mobile-collar-pair-link-pressed-feedback"
status: spec_ready         # draft | spec_ready | approved
tags: [spec, mobile, ui, deuda]
---

# Requisitos — [[mobile-collar-pair-link-pressed-feedback]] (#138)

> Notación EARS. Cada requisito lleva su id `R<n>`, que no cambia una vez
> aprobado. Ver [[design]] para las decisiones y las alternativas descartadas,
> [[tasks]] para el orden TDD, los literales, los blobs y las sondas, y
> [[traceability]] para el cierre.
>
> Origen: hallazgo **(F)** de la spec de #136
> (`specs/mobile-quick-actions-pressed-feedback/requirements.md`, §Fuera de
> alcance), registrado como #138 por decisión del humano el 2026-09-29.
>
> **Base medida: `76849396`**, que es `origin/main` (merge de la PR #176 de
> #136). La branch `feature/138-mobile-collar-pair-link-pressed-feedback`
> arranca en ese commit. **Los números de línea no son anclas**, ni los de
> esta spec ni los de la entrada de `feature_list.json`. Todo se localiza con
> los `grep` que se citan, y las cuentas se vuelven a medir al arrancar
> ([[tasks]] §Antes de tocar nada).

## Contexto mínimo para implementar sin más contexto

La feature toca **tres ficheros**, todos bajo `mobile-pet-tracker/`:

| Fichero | Qué cambia |
|---|---|
| `src/screens/home/index.tsx` («la Home») | **una prop**: el `style` del `Pressable` `collar-pair-link` pasa de `style={CONTINUOUS_CORNER}` a la función de estado pulsado que #136 ya puso en los tiles de accesos rápidos |
| `src/screens/home/index.test.tsx` («el test») | **dos `it` nuevos** (`#138 R1` y `#138 R2`). Ningún `it` existente cambia |
| `src/__tests__/consistency-classnames.test.ts` («el test de consistencia») | **tres literales enmendados**: la fila de la Home en `#62 R14`, la suma de `#62 R14` y dos cifras de `#98 R10` |

El botón «Vincular collar» vive en la tarjeta del collar de la Home y **solo
se pinta cuando la mascota no tiene dispositivo**
(`{detail.data.pet.device === null ? (`, una sola vez en la Home). Así se ve
hoy en el árbol de RNTL v14, en nodos host:

```
View testID="collar-card"               (Card compartido)
├─ …                                    («Sin collar — solo salud»)
└─ View testID="collar-pair-link"       (Pressable, accessibilityRole="button",
   │                                     className="min-h-11 items-center justify-center rounded-xl bg-accent-soft px-4",
   │                                     style={ borderCurve: 'continuous' })
   └─ Text                              «Vincular collar»
```

Tras #138, el `style` del host es `{ borderCurve: 'continuous', opacity: 1 }`
en reposo y `{ borderCurve: 'continuous', opacity: 0.8 }` mientras se pulsa.
Es **la misma receta** que #136 fijó para los tiles
(`style={({ pressed }) => ({ ...CONTINUOUS_CORNER, opacity: pressed ? 0.8 : 1 })}`),
escrita en cuatro líneas. Tras el cambio, la Home **no tiene ningún**
`style={CONTINUOUS_CORNER}` directo.

**Cómo se pulsa en jest** (medido en #136 sobre RN 0.86.2 y re-medido aquí,
[[design]] §D3): `fireEvent(link, 'responderGrant', …)` deja el `Pressable`
pulsado. `fireEvent(link, 'responderTerminate', …)` termina la pulsación por el
mismo camino `pressOut` que una suelta, sin llamar a `onPress`, y el estado
pulsado se limpia **130 ms después**, así que el último paso espera con
`waitFor`. `responderRelease` no sirve: sin un objetivo nativo, `Pressability`
lo ignora y el botón se queda pulsado.

## Premisas de la entrada, verificadas contra el árbol

Medidas con `bunx jest` desde `mobile-pet-tracker/`, sin pipe, en un
`git worktree` desacoplado en `76849396` fuera del repo (ya borrado). El
working tree principal no se tocó. Los rojos, el verde y las sondas se
midieron aplicando los literales exactos de [[tasks]] y comprobando cada blob.

| Premisa (`feature_list.json` #138) | Veredicto | Evidencia |
|---|---|---|
| El botón es un `Pressable` con `style={CONTINUOUS_CORNER}` y sin estado pulsado | **cierta** | `grep -cxF '                      style={CONTINUOUS_CORNER}' src/screens/home/index.tsx` da 1 (22 espacios). Es el único `style={CONTINUOUS_CORNER}` de la Home (`grep -cF` sin `-x` también da 1). Con la Home de base, `#138 R1` falla en reposo por `toEqual`: el host da `{ borderCurve: 'continuous' }`, sin opacidad |
| Solo se pinta sin collar | **cierta** | `grep -cF '{detail.data.pet.device === null ? (' src/screens/home/index.tsx` da 1. `'does not show the pair action when the pet has a collar'` lo cierra hoy |
| La receta de #136 ya está en `main` | **cierta** | dentro de `{QUICK_ACTIONS.map(`: `grep -cF '...CONTINUOUS_CORNER,' src/screens/home/index.tsx` da 1 y `grep -cF 'opacity: pressed ? 0.8 : 1' src/screens/home/index.tsx` da 3 (campana, «Ver todos» y los tiles) |
| Con #136 mergeada, la Home tiene 1 `style={CONTINUOUS_CORNER}` y `src/` sin tests, 32; esta feature los lleva a 0 y 31 | **cierta, medida** | antes 1 y 32; con la Home final, 0 y 31 (comando en [[tasks]] §R4) |
| Se mueven la fila de la Home en `directUses` de `#62 R14` (y su título de `it.each`), su suma y las cifras de `#98 R10` | **cierta** | con las enmiendas de R3 y la Home de base, el test de consistencia da rojo 2 de 53, los dos por `toHaveLength`. La suma queda verde en los dos estados: es aritmética sobre la tabla |
| La spec decide si la fila de la Home se queda con 0 o se retira | **decidido: se queda con 0** | [[design]] §D5 y §Qué firma el humano, punto 4 |
| Los dos tests actuales del botón no miran su `style` | **cierta** | `grep -c 'collar-pair-link' src/screens/home/index.test.tsx` da 2, uno en cada `it` del `describe('R10 (mobile-device-pairing): la collar card sin collar enlaza a /pairing'`. Uno comprueba texto, rol y `router.push('/pairing')`, y el otro, que no se pinta con collar. Ninguno lee `props.style` |
| El candado va en render, con el patrón de `#136 R1` | **cierta** | `responderGrant`, `responderTerminate` con `waitFor` y `toEqual` sobre el `style` entero, con literales ([[design]] §D2 y §D3) |
| `files_affected`: la Home, el test y el test de consistencia | **cierta** | son exactamente los tres ficheros que cambian |
| `toHaveLength` sobre la Home sin coincidencias | **medido: rompe** | `home.match(/…/g)` devuelve `null` cuando no hay coincidencias. Con `expect(home.match(/style=\{CONTINUOUS_CORNER\}/g)).toHaveLength(0)` y la Home final, `#98 R10` da rojo: `Matcher error: received value must have a length property whose value must be a number`. R3 usa `?? []` ([[design]] §D6) |
| Suite de base | **medida** | el `leader` la midió con `./init.sh` sobre `76849396`: 86 suites / 1610 tests / 1 snapshot, `exit=0`. El test da 167 de 167 y el de consistencia, 53 de 53 |
| Blobs de base | **medidos** | la Home `cb61d0c64deb0c911031a8468a8c397255b53979`, el test `04135c8e262f601ad61670f34c4d959192d150c9` y el de consistencia `e62f88ad4d60178a18323551f5eb6d19641dbd72`. Iguales en `HEAD` y en `origin/main` |
| Árbol final | **medido** | el test, 169 de 169; el de consistencia, 53 de 53; la suite, 86 suites / **1612** tests / 1 snapshot, `exit=0`. `bunx tsc --noEmit` y `bunx eslint` de los tres ficheros, `exit=0` |
| Entorno | **verificado** | `test ! -e .expo/types/router.d.ts` da `exit=0` en `mobile-pet-tracker/` |

## Qué decisiones del botón toca esta feature

| Decisión | Antes | Tras #138 | Candado |
|---|---|---|---|
| estado pulsado | ninguno | opacidad 0.8 mientras se pulsa, 1 en reposo, cambio instantáneo | **#138 R1** |
| forma del `style` | objeto `CONTINUOUS_CORNER` | función de `pressed` que devuelve un **objeto** con la esquina y la opacidad | **#138 R1** (pulsado y suelto) y **#138 R2** (reposo) |
| esquina continua | en el `style` fijo, vigilada en el fuente por `#62 R14` y `#98 R10` | dentro de la función; el fuente ya no la ve | en render, **#138 R1** y **#138 R2** |
| radio: `rounded-xl` único, sin `rounded-full` | el bucle de `#62 R14` miraba que su tag no llevase `rounded-full` | el bucle ya no mira la Home (su fila queda en 0) | en render, **#138 R2** |
| texto «Vincular collar», rol `button`, destino `/pairing` | — | sin cambio | `'shows the pair action for a pet without a collar and opens pairing'`, intacto |
| condición de render (solo sin collar) | — | sin cambio | `'does not show the pair action when the pet has a collar'`, intacto |
| fondo `bg-accent-soft`, objetivo táctil `min-h-11`, `px-4`, centrado, tinta `font-bold text-foreground` | — | sin cambio | la línea del `className` no cambia (R4.3). `#98 R10` sigue contando 16 `bg-accent-soft` |

## Requisitos funcionales

Los dos `it` nuevos viven en
`describe('R10 (mobile-device-pairing): la collar card sin collar enlaza a /pairing'`
(«el `describe` del collar»), después de sus dos `it` actuales, y reutilizan su
`beforeEach` (auth, una mascota, actividad en espera). Cada uno fija su sujeto:
`mockGetPet` resuelve `makePet({ device: null })`, así que el botón se pinta.
El código exacto está en [[tasks]].

- **R1**: WHEN el usuario pulse `collar-pair-link`, THE SYSTEM SHALL pintar su
  host con `style` igual a `{ borderCurve: 'continuous', opacity: 0.8 }`
  mientras dure la pulsación. WHEN la pulsación termine, THE SYSTEM SHALL
  devolverlo a `{ borderCurve: 'continuous', opacity: 1 }`.

  `#138 R1: el botón baja a opacidad 0.8 mientras se pulsa y vuelve a 1 al soltarlo, con la esquina continua`
  asevera, en este orden:

  1. en reposo, `link.props.style` `toEqual({ borderCurve: 'continuous', opacity: 1 })`;
  2. tras `fireEvent(link, 'responderGrant', …)`, `link.props.style`
     `toEqual({ borderCurve: 'continuous', opacity: 0.8 })`;
  3. tras `fireEvent(link, 'responderTerminate', …)`, dentro de un `waitFor`,
     `link.props.style` `toEqual({ borderCurve: 'continuous', opacity: 1 })`.

  Los esperados son **literales**: el test no importa `CONTINUOUS_CORNER` ni
  nada de la Home. El rojo es **natural**: con la Home de base el `it` falla en
  el paso 1, por `toEqual`.

  IF el botón pierde la receta (su `style` vuelve a `CONTINUOUS_CORNER`, o lo
  pierde entero), o el valor pulsado o el de reposo cambian, o el `style` gana
  una clave, pierde la esquina en reposo o al pulsar, o pasa a ser un array,
  THEN el `it` SHALL fallar **por aserción** (`toEqual`). IF el botón se queda
  pulsado al terminar, THEN SHALL fallar por aserción en el `waitFor` del paso
  3. IF el botón deja de pintarse sin collar, THEN SHALL fallar **por
  consulta** (`Unable to find an element with testID: collar-pair-link`).

- **R2**: WHILE el botón no esté pulsado, THE SYSTEM SHALL darle `rounded-xl`
  como **único** token de radio de su `className` y `style` igual a
  `{ borderCurve: 'continuous', opacity: 1 }`.

  `#138 R2: en reposo, el botón lleva rounded-xl como único radio y la esquina continua con opacidad 1`
  asevera:

  1. los tokens de `link.props.className` que casan con `/^rounded(?:-|$)/`
     `toEqual(['rounded-xl'])`;
  2. `link.props.style` `toEqual({ borderCurve: 'continuous', opacity: 1 })`.

  El rojo es **natural** por el paso 2. El paso 1 ya es verde en la base: lo
  prueban las sondas `rounded_full` y `rounded_2xl`, medidas en rojo. Hace
  falta porque el control de `rounded-full` de `#62 R14` deja de mirar este
  tag al quedar su fila en 0: con `rounded-full` añadido al botón, **solo**
  `#138 R2` da rojo (sonda `rounded_full`).

  IF el botón gana otro token de radio o cambia `rounded-xl`, THEN `#138 R2`
  SHALL fallar **por aserción** en el paso 1. IF pierde la opacidad de
  reposo o la esquina, o gana una clave, THEN SHALL fallar por aserción en el
  paso 2.

- **R3**: THE SYSTEM SHALL dejar en la Home **cero**
  `style={CONTINUOUS_CORNER}`, conservando el import de `CONTINUOUS_CORNER`
  (lo usan por spread los tiles y el botón), y **31** en todo `src/` sin tests.

  Lo prueban tres `it` del test de consistencia, **enmendados**:

  1. `#62 R14: toda esquina no-cápsula que dibuja el repo es continua › screens/home/index.tsx importa y aplica sus 0 esquinas`
     (la fila de la Home en `directUses` pasa de 1 a 0, y con ella el título
     que genera `it.each`; la fila **no se retira**);
  2. `#62 R14: … › fusiona la esquina una vez y la entrega a las dos ramas de Card`
     (la suma pasa de `33 + 1 + 1 - 1` a `33 + 1 + 1 - 1 - 1`);
  3. `#98 R10: los candados que esta feature no mueve › deja CONTINUOUS_CORNER, bg-accent-soft y el acento donde estaban`
     (la Home pasa de `toHaveLength(1)` a `?? []).toHaveLength(0)`, y el
     repo, de 32 a 31).

  Cada enmienda lleva un comentario que cita `#138 R3`. El rojo es
  **natural** para el 1 y el 3: con la Home de base fallan por `toHaveLength`.
  El 2 queda verde antes y después, porque suma la tabla y no lee el fuente;
  se enmienda para que la tabla y la suma sigan cuadrando.

  IF el botón vuelve a `style={CONTINUOUS_CORNER}` (la Home de base, sonda
  `norecipe`), THEN el 1 y el 3 SHALL fallar **por aserción** (`toHaveLength`),
  además de `#138 R1` y `#138 R2`.

- **R4**: THE SYSTEM SHALL cerrar con:

  1. **El delta declarado**: +0 suites y +2 tests. El test pasa de 167 a 169,
     el de consistencia se queda en 53, y la suite, de 86 / 1610 a
     86 / **1612**, medida sin pipe. Si la base medida al arrancar es otra, el
     delta exigido sigue siendo +2 tests y +0 suites sobre lo medido.
  2. **Los candados enmendados son exactamente los tres `it` de R3.** Ningún
     `it` existente del test cambia, y ninguna otra cifra de candado se mueve,
     con los `grep` de [[tasks]] §R4.
  3. **Diff de producción mínimo**: `git diff origin/main...HEAD --
     mobile-pet-tracker/` toca solo la Home y los dos tests, y el de la Home
     cambia **una** línea por cuatro: la del `style` de `collar-pair-link`.
  4. `bunx tsc --noEmit` con `exit=0` tras `test ! -e .expo/types/router.d.ts`,
     y `bunx eslint` de los tres ficheros con `exit=0`.
  5. **Ninguna dependencia ni copy nuevas**: no cambian `package.json`,
     `bun.lock`, `src/i18n/catalog.ts` ni
     `src/providers/__tests__/language-provider.test.tsx`, que cierra la
     longitud del catálogo y se mide **sin moverse**.
  6. **C8 de `CHECKPOINTS.md`**: ningún hex, ninguna clase arbitraria, ningún
     `StyleSheet` ni sombra nuevos (`src/__tests__/design-drift.test.ts` verde
     y los `grep` de [[tasks]] §R4); el objetivo táctil `min-h-11` sigue en su
     `className`, que no cambia; el feedback de pulsado es la función de
     `style` que nombra la carta.
  7. **La tabla de sondas** de [[tasks]] §Sondas, re-medida sobre el árbol
     final, en `progress/impl_mobile-collar-pair-link-pressed-feedback.md`.

  No tiene test propio, porque es una propiedad del diff y de la suite. Lo
  cierra el `reviewer` por inspección.

- **R5**: WHEN el humano pulse «Vincular collar» en un **dev build de
  Android**, THE SYSTEM SHALL atenuarlo de forma visible mientras el dedo esté
  encima, devolverlo a su opacidad al soltar, seguir abriendo la pantalla de
  emparejamiento y conservar la esquina redondeada. Lo cierra el humano en
  §Prueba de humo del humano, con su propia casilla.

## Tabla de sondas, resumen

Cada sonda, con su mutación literal y su blob, está en [[tasks]] §Sondas.
«Medido» es la Home mutada contra el test y el test de consistencia finales,
corridos juntos (222 tests). Todas se midieron al escribir esta spec.

| Sonda | Mutación | Medido | Tipo de rojo |
|---|---|---|---|
| `norecipe` | el `style` vuelve a `CONTINUOUS_CORNER` (la Home de base) | rojo 4: `#138 R1`, `#138 R2`, `#62 R14 › … sus 0 esquinas` y `#98 R10` | aserción: `toEqual` en los dos primeros y `toHaveLength` en los dos de consistencia |
| `pressed07` | valor pulsado 0.7 | rojo 1: `#138 R1`, paso 2 | aserción (`toEqual`) |
| `rest09` | opacidad de reposo 0.9 | rojo 2: `#138 R1` (paso 1) y `#138 R2` | aserción (`toEqual`) |
| `nocorner` | la función pierde `...CONTINUOUS_CORNER` | rojo 2: `#138 R1` y `#138 R2` | aserción (`toEqual`) |
| `pressnocorner` | la esquina solo en reposo | rojo 1: `#138 R1`, paso 2 | aserción (`toEqual`) |
| `restnocorner` | la esquina solo al pulsar | rojo 2: `#138 R1` y `#138 R2` | aserción (`toEqual`) |
| `stray` | una clave de más (`overflow: 'hidden'`) | rojo 2: `#138 R1` y `#138 R2` | aserción (`toEqual`) |
| `nostyle` | el botón pierde el `style` entero | rojo 2: `#138 R1` y `#138 R2` | aserción (`toEqual`) |
| `array` | `[CONTINUOUS_CORNER, { opacity: … }]` | rojo 2: `#138 R1` y `#138 R2` | aserción (`toEqual`). Candado de forma, a propósito ([[design]] §D2) |
| `sticky` | un estado propio que se queda pulsado al terminar | rojo 1: `#138 R1`, en el `waitFor` del paso 3 | aserción (`toEqual`) |
| `hidden` | el botón se pinta **con** collar y no sin él | rojo 4: `#138 R1`, `#138 R2` y `'shows the pair action …'` por consulta; `'does not show the pair action …'` por aserción (`toBeNull`) | consulta en tres, aserción en uno |
| `rounded_full` | `rounded-full` añadido tras `rounded-xl` | rojo 1: **solo** `#138 R2`, paso 1 | aserción (`toEqual`) |
| `rounded_2xl` | `rounded-xl` pasa a `rounded-2xl` | rojo 3: `#138 R2`, `#62 R4 › no deja la clase fuera de escala rounded-2xl en producción` y `#98 R10` | aserción (`toEqual` en los tres) |
| `constant` | `CONTINUOUS_CORNER` pasa a `{ borderCurve: 'circular' }` en `src/theme/native-styles.ts` | rojo 5: `#138 R1`, `#138 R2`, `#81 R3`, `#136 R1` y `#62 R14 › declara las dos constantes nativas compartidas` | aserción (`toEqual` y `toContain`). Prueba que los esperados son literales y no el símbolo de producción |
| `ios_only` | el pulsado solo en iOS (`Platform.OS === 'ios'`) | **verde** 222 de 222: jest corre como iOS | ninguno. **Punto ciego declarado**: lo cubre R5 |

## Qué firma el humano al aprobar esta spec

1. **La receta es la de #136, sin reabrirla.** Cambio de opacidad
   instantáneo con la función de `style` que nombra la carta (§Micro-reglas de
   pulido), 0.8 pulsado y 1 en reposo, sin animación, sin Reanimated, sin
   escala y sin háptica. La versión animada y la receta de `animate-expo`
   quedaron descartadas y firmadas en #136
   (`specs/mobile-quick-actions-pressed-feedback/requirements.md` §Qué firma
   el humano, puntos 1 y 8).
2. **La forma del `style` queda fijada**: una función que devuelve un
   **objeto** con la esquina y la opacidad. `#138 R1` y `#138 R2` comparan el
   objeto entero con `toEqual`, así que un array visualmente idéntico da rojo
   (sonda `array`). Es a propósito, igual que en #136: el test no puede usar
   `StyleSheet.flatten`, que la guarda de `design-drift` prohíbe en el test, y
   `toHaveStyle` dejaría pasar claves de más.
3. **Candados enmendados a propósito**: solo los tres `it` de R3, en el test
   de consistencia (la fila de la Home y la suma de `#62 R14`, y dos cifras de
   `#98 R10`). **Ningún `it` existente del test de la Home cambia**: se añaden
   dos. **Medidos sin moverse**: todos los demás, entre ellos las regex del
   pulsado de la campana y de «Ver todos», `#81 R3` y `#136 R1` de los tiles,
   el candado de `food.test.tsx`, `bg-accent-soft` (16), `rounded-xl bg-accent`
   (13), `text-accent-strong`, `design-drift`, `legibility-classnames`,
   `ui-language`, el catálogo y `language-provider.test.tsx`. La suite final
   verde lo mide, y los `grep` de [[tasks]] §R4 lo fijan.
4. **La fila de la Home en `directUses` se queda con 0, no se retira.** Con 0
   sigue aseverando que la Home importa `CONTINUOUS_CORNER` de
   `theme/native-styles` y que no escribe **ningún** `style={CONTINUOUS_CORNER}`
   directo: si uno vuelve, la fila da rojo. Retirarla perdería las dos cosas y
   bajaría el test de consistencia a 52. El precio es un título que lee «aplica
   sus 0 esquinas», que el comentario de la fila explica.
5. **El fuente deja de vigilar la esquina y el radio del botón; los vigila el
   render.** `#62 R14` y `#98 R10` cuentan `style={CONTINUOUS_CORNER}` y el
   botón ya no lo escribe así. El control de `rounded-full` de `#62 R14` deja
   de mirar la Home entera. La vigilancia pasa a `#138 R1` y `#138 R2`. La
   Home deja de cumplir la **letra** del corolario de la Decisión fija 12
   («declara `style={CONTINUOUS_CORNER}`») y cumple su intención, como ya hacen
   el `Card`, el tooltip del gráfico semanal y los tiles de #136. La carta no
   se enmienda aquí (§Fuera de alcance, hallazgo **(F)**).
6. **La suelta se prueba con `responderTerminate`**, no con
   `responderRelease` ([[design]] §D3). El camino de `onPress` ya lo cierra
   `'shows the pair action for a pet without a collar and opens pairing'`
   (`fireEvent.press` y `router.push('/pairing')`), que no cambia.
7. **El delta es +0 suites y +2 tests**: 86 / 1610 antes y 86 / 1612 después,
   sobre la base del `leader`.
8. **Punto ciego de plataforma**: jest corre como iOS, así que una receta que
   solo funcione en iOS da verde (sonda `ios_only`, medida). La prueba de humo
   de R5 lo cubre.
9. **Las siete preguntas de la Home** (Dirección de arte 3): la tarjeta del
   collar responde «¿el collar está conectado?», y sin collar lo responde con
   «Sin collar — solo salud» y el botón para vincularlo. Esta feature no
   cambia qué preguntas responde la Home ni cómo: solo el feedback del botón
   de acción. Ninguna pregunta se gana ni se pierde.
10. **Requisitos sin test propio**: R4, una propiedad del diff y de la suite,
    que cierra el `reviewer` por inspección, y R5, que cierra el humano.
    Queda declarado antes del handoff, como pide C4.

## Prueba de humo del humano (no delegable a IA) — R5

**Entorno:**

- **Dev build de Android**, nunca Expo Go. No hace falta regenerarlo, porque la
  feature no tiene cambios nativos: basta el JS de esta branch desde Metro
  (`bunx expo start --dev-client`, desde `mobile-pet-tracker/`).
- Una sesión con una **mascota sin collar** seleccionada: su tarjeta del
  collar dice «Sin collar — solo salud» y enseña el botón «Vincular collar».
  Si ninguna mascota de la cuenta está sin collar, **parar y avisar**: no
  desvincules un collar real para esta prueba, porque corta el seguimiento en
  vivo.
- `adb` conectado. Con dos transportes Wi-Fi, usar siempre
  `adb -s <ip:puerto>` (en Windows, `adb devices -l` y filtrar con `findstr`).

**Pasos:**

1. Abrir la app en la **Home** con la mascota sin collar y localizar la
   tarjeta del collar con el botón **«Vincular collar»**.
2. **Mantener pulsado «Vincular collar»** un segundo, sin mover el dedo. El
   botón (fondo y texto) se ve **claramente más tenue** mientras el dedo sigue
   encima. Sin levantar el dedo, **arrastrarlo fuera del botón** y soltar: el
   botón vuelve a su opacidad y **no navega**.
3. **Tocar «Vincular collar»** de forma normal: se atenúa un instante y abre
   la pantalla de **emparejamiento**, con el campo «Código de activación».
   Volver atrás: el botón está en reposo, con su opacidad plena.
4. En reposo y pulsado, las **esquinas** del botón se ven igual que antes:
   redondeadas y suaves, sin picos ni recortes.

   Captura con el botón pulsado (paso 2), si se puede:
   `adb -s <ip:puerto> shell screencap -p /sdcard/s138.png` y
   `adb -s <ip:puerto> pull /sdcard/s138.png`.

**Criterio de paso**: los pasos 2 a 4 se cumplen tal como están escritos.

- [ ] Prueba de humo de R5 superada por el humano (fecha: ____, dispositivo: ____, Android: ____)

---

## Cobertura de los criterios de aceptación de `feature_list.json` #138

| Criterio | Cubierto por |
|---|---|
| 1. Pulsar `collar-pair-link` pone su opacidad en 0.8 y soltarlo la devuelve a 1, medido en el árbol renderizado | R1: pasos 1 a 3, en render. La suelta es `responderTerminate` más `waitFor` ([[design]] §D3) |
| 2. El botón conserva `borderCurve` continuous en reposo y pulsado, y `rounded-xl` como único radio | R1 (pulsado y suelto, `toEqual` con la esquina) y R2 (reposo y radio). Sondas `nocorner`, `pressnocorner`, `restnocorner`, `rounded_full` y `rounded_2xl`, medidas en rojo |
| 3. Quitar la receta de pulsado del botón pone la suite roja | R1, R2 y R3. Sondas `norecipe` y `nostyle`, medidas en rojo |
| 4. La spec declara qué candados enmienda (`#62 R14` y `#98 R10` como mínimo, medidos sobre la base con #136 mergeada); ninguna otra cifra se mueve | §Premisas, R3 y R4.2. §Qué firma el humano, puntos 3 y 4 |
| 5. Suite móvil completa verde, sin pipe; tsc y lint `exit=0` | R4.1 y R4.4 |
| 6. Smoke en dev build de Android: feedback visible y sigue abriendo el emparejamiento | R5 y su casilla |

## Fuera de alcance

Cada viñeta lleva su clase: **(D)** es un límite de esta feature, **(F)** es un
hallazgo que podría registrarse como otra feature (sin id: solo si el humano
lo decide, y lo asigna el `leader` contra `origin/main`) y **(N)** es una
premisa verificada y descartada.

- **(D)** Feedback animado (Reanimated, 150 ms), escala o sombra al pulsar, y
  háptica: descartados y firmados en #136 (§Qué firma el humano, punto 1).
- **(D)** Ningún otro `Pressable` de la app. La entrada se limita a este botón
  y no audita los demás.
- **(D)** La variante `active:opacity-80` de uniwind: jest no resuelve
  `className`, así que no se podría candar en render ([[design]]
  §Alternativas).
- **(D)** No se vuelve a candar lo que ya tiene candado y no cambia: texto,
  rol y destino (`'shows the pair action …'`) y condición de render
  (`'does not show the pair action …'`). El fondo, el objetivo táctil
  `min-h-11`, el padding y la tinta del botón no ganan candado de render: la
  feature no los toca, y R4.3 fija que su línea de `className` no cambia.
- **(D)** La sangría irregular del bloque del botón (el `<Pressable` y su `>`
  de cierre no están alineados con sus props) no se reformatea: el diff de la
  Home es una línea por cuatro.
- **(D)** No se extrae la receta a una constante ni a un helper compartido con
  los tiles, la campana o «Ver todos»: cada uno tiene su candado propio.
- **(D)** No hay copy nueva ni dependencias. No se tocan `src/i18n/catalog.ts`,
  `src/providers/__tests__/language-provider.test.tsx`,
  `src/__tests__/ui-copy-table.ts`, `package.json` ni `bun.lock`.
- **(D)** `docs/ui-guidelines.md` no se enmienda en esta feature: la regla
  («Feedback pressed en TODO elemento tappable») ya está escrita.
- **(F)** *La letra del corolario de la Decisión fija 12 ya no describe el
  repo.* Dice que toda esquina no-cápsula «declara
  `style={CONTINUOUS_CORNER}`»
  (`grep -n 'que el repo dibuja por su cuenta' docs/ui-guidelines.md`), pero
  con #138 son cuatro los sitios que la componen de otra forma (el `Card`, el
  tooltip del gráfico semanal, los tiles y este botón) y la Home no tiene
  ningún uso directo. Enmendar la letra para admitir el spread dentro de una
  función de `style` sería un cambio de la carta, no de código. Sin id.
- **(N)** *Que el cambio mueva otros candados de la Home* (`#81 R3` y
  `#136 R1` de los tiles, las regex del pulsado de la campana y de «Ver
  todos», `bg-accent-soft`, `text-accent-strong`). Verificado: la suite final
  da 86 / 1612 en verde sin tocarlos.

---

## Aprobación

- [ ] **Aprobado por humano** (fecha: ____) ← gate obligatorio antes de
      implementar. Al marcar esta casilla, el humano firma también los diez
      puntos de §Qué firma el humano al aprobar esta spec.

> **Esta feature tiene dos casillas.** Esta, antes del handoff, y la de R5 en
> §Prueba de humo del humano, después del veredicto del `reviewer`. La feature
> no se marca `done` sin las dos.
