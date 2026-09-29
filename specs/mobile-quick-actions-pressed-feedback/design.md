---
feature: "mobile-quick-actions-pressed-feedback"
status: spec_ready         # draft | spec_ready | approved
tags: [spec, mobile, ui, deuda]
---

# Diseño — [[mobile-quick-actions-pressed-feedback]] (#136)

> Ver [[requirements]] para los requisitos y [[../../docs/architecture|architecture]]
> para las capas. Esta feature solo toca la capa de presentación móvil: una
> prop de `src/screens/home/index.tsx` y dos tests. No toca dominio,
> aplicación ni infraestructura.

## Decisiones técnicas

- **D1. La receta de la Home, con la esquina dentro (R1, R2).** El `style`
  del `Pressable` de cada tile pasa a ser una función de estado pulsado que
  devuelve un **objeto**:

  ```tsx
  style={({ pressed }) => ({
    ...CONTINUOUS_CORNER,
    opacity: pressed ? 0.8 : 1,
  })}
  ```

  - `opacity: pressed ? 0.8 : 1` es el literal de la campana y de «Ver
    todos» de la misma Home, que ya lo usan dos veces. El 0.8 no se inventa
    aquí.
  - `...CONTINUOUS_CORNER` conserva la esquina continua de la Decisión fija
    12 de la carta y de `#81 R3`. La receta literal de la entrada de
    `feature_list.json`, `({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })`,
    la perdería.
  - `CONTINUOUS_CORNER` ya se importa en la Home, así que no hay import
    nuevo, ni `StyleSheet`, ni estado propio. El estado pulsado es por tile,
    porque cada `Pressable` lleva el suyo y el `map` crea tres.
  - El cambio es **instantáneo**, como en los cinco sitios del repo que ya
    tienen feedback de pulsado (campana, «Ver todos», filas de alertas,
    `meal-toggle` y selector de métrica). Los 150 ms de §Animación de la carta
    rigen animaciones, y esta receta no anima. Lo firma el humano
    ([[requirements]] §Qué firma el humano, punto 1).
  - **Sin háptica.** La tabla de expo-haptics de la carta no incluye un toque
    de navegación.

- **D2. El candado compara el `style` entero con `toEqual`, sin aplanar (R1,
  R2).** En RN 0.86, un `Pressable` con `style` función pasa al `View` host el
  **resultado** de la función, sin aplanarlo. Con la receta de D1 es un objeto
  plano, y `tile.props.style` se compara tal cual:
  `{ borderCurve: 'continuous', opacity: 1 }` en reposo y
  `{ borderCurve: 'continuous', opacity: 0.8 }` pulsado.
  - `toEqual` cierra lo que `toHaveStyle` deja abierto. `toHaveStyle`
    compara un subconjunto: una clave de más (sonda `stray`) o la esquina
    perdida con la opacidad bien (sonda `nocorner`) pasarían.
  - El precio es que la **forma** queda fijada: un array visualmente idéntico
    (`[CONTINUOUS_CORNER, { opacity }]`, sonda `array`) da rojo. Aplanar con
    `StyleSheet.flatten` lo evitaría, pero la guarda `FEATURE_STYLE_ESCAPES`
    de `src/__tests__/design-drift.test.ts` prohíbe `StyleSheet` en
    `index.test.tsx`, también en comentarios. Se acepta la forma fija: es la
    de D1, y la firma el humano (punto 2).
  - Los esperados son **literales del test**. El test no importa
    `CONTINUOUS_CORNER` ni nada de la Home: un candado que asevera contra el
    símbolo de producción pasa aunque el símbolo cambie.

- **D3. La pulsación se simula con `responderGrant` y termina con
  `responderTerminate` (R1).** Medido sobre la `Pressability` de RN 0.86.2:
  - `responderGrant` es el primer evento de una pulsación real y deja el
    `Pressable` pulsado. Es el mismo patrón que
    `#122 R2: la campana baja a opacidad 0.8 mientras se pulsa`.
  - `responderRelease` **no sirve**. Sin un objetivo nativo, `Pressability`
    ignora la suelta y el tile se queda pulsado. Con
    `currentTarget: {}`, revienta con
    `this._responderID.measure is not a function`.
  - `responderTerminate` termina la pulsación por `_deactivate`, que llama a
    `onPressOut` y limpia el estado pulsado **130 ms después** (la duración
    mínima de pulsación). No llama a `onPress`. Por eso el paso 3 de R1 espera
    con `waitFor`, que sondea cada 50 ms hasta 1000 ms. No se usan timers
    falsos: el `describe` de #81 no los activa, y meterlos obligaría a
    sincronizar además las consultas de la Home.
  - El camino `onPress` (la navegación) no se vuelve a probar aquí: lo cierra
    `#71 R1: la Home dibuja la rejilla de accesos rápidos › lleva cada tile a su ruta existente`,
    que no cambia.

- **D4. Tres tiles, cada uno por separado, y el estado pulsado aislado (R1).**
  El `it` recorre una tabla literal de los tres `testID`. En cada vuelta mira
  el tile pulsado y los **otros dos**. Así cierra tres huecos que una sola
  pulsación no ve:
  - un tile sin receta (sondas `t0`, `t1`, `t2`, `nopress_t0`,
    `nopress_t1`, `nopress_t2`, `pressed07_t1`);
  - un estado compartido por la fila (sonda `shared`), que atenúa los tres a
    la vez;
  - un estado que no se limpia (sonda `sticky`).

- **D5. `#81 R3` se enmienda, no se duplica (R2).** El reposo ya tiene su
  candado en `#81 R3`, que compara `{ borderCurve: 'continuous' }` y además
  fija `rounded-xl` como único radio. Se cambia solo su literal de `style` y
  se le añade un comentario que cita `#136 R2`. Su título sigue siendo
  verdad: «la esquina continua» sigue ahí. `#136 R1` también mira el reposo,
  pero dentro de un `it` que ya tiene otro trabajo. Si solo lo mirase
  `#136 R1`, `#81 R3` quedaría rojo con el árbol final.

- **D6. Las cifras de fuente se enmiendan, con la vigilancia movida al render
  (R3).** `#62 R14` y `#98 R10` cuentan `style={CONTINUOUS_CORNER}`
  literalmente. Tras D1, la Home lo escribe una vez (en `collar-pair-link`) y
  el repo, 32 veces. Se enmiendan las tres cifras que lo ven (fila de la Home,
  suma y `#98 R10`). No se añade un conteo de `...CONTINUOUS_CORNER`: la
  esquina del tile ya la vigila el render (D2), que ve por tile, y un conteo de
  fuente no distingue un tile de otro.

- **D7. El orden de commits sigue el rojo natural (C4, vía a).** La base no
  cumple R1, R2 ni R3, así que cada test enmendado o nuevo da rojo con la Home
  de base, sin mutaciones versionadas. Tres commits rojos (R1, R2, R3) y un
  verde que cambia la Home ([[tasks]]).

## Archivos afectados

Todos en la capa de presentación de `mobile-pet-tracker/`:

- `src/screens/home/index.tsx`: la línea `style={CONTINUOUS_CORNER}` del tile
  pasa a las cuatro líneas de D1. Nada más.
- `src/screens/home/index.test.tsx`: un `it` nuevo, `#136 R1`, en el
  `describe` de #81, y el literal de `#81 R3`. Pasa de 166 a 167 tests.
- `src/__tests__/consistency-classnames.test.ts`: tres literales y tres
  comentarios. Sigue en 53 tests.
- `progress/impl_mobile-quick-actions-pressed-feedback.md` y
  `specs/mobile-quick-actions-pressed-feedback/traceability.md`: la evidencia.

`docs/ui-guidelines.md` **no se toca**: la regla («Feedback pressed en TODO
elemento tappable») ya está escrita.

## Coordinación

- **#133** (Backend, otra sesión) comparte Postgres y LocalStack, no ficheros.
  Esta feature no corre `./init.sh` ni los e2e: solo `bunx jest`, `tsc` y
  `eslint` desde `mobile-pet-tracker/`.
- Si otra feature mergea antes y cambia cualquiera de los tres blobs de base,
  [[tasks]] §Antes de tocar nada manda **parar**. Los blobs y las sondas de
  esta spec dejarían de valer.

## Alternativas descartadas

- **Forma de array**, `({ pressed }) => [CONTINUOUS_CORNER, { opacity }]`, como
  el selector de métrica. Pinta igual, pero el test no puede aplanarla sin
  `StyleSheet.flatten`, que está prohibido en el test (D2).
- **`toHaveStyle({ opacity: 0.8 })` a secas**, como `#122 R2`. Compara un
  subconjunto: deja pasar la esquina perdida y una clave de más.
- **La receta literal de la entrada**, sin la esquina. Rompe la Decisión fija
  12 y `#81 R3`.
- **`active:opacity-80` de uniwind.** Jest no resuelve `className`, así que no
  habría candado en render. Además, rompería el patrón de los cinco sitios que
  ya usan la función de `style`.
- **Animación con Reanimated a 150 ms, o escala.** Ningún sitio del repo
  anima el pulsado. Añade un `useSharedValue` por tile, y el candado tendría
  que avanzar timers. Queda fuera de alcance.
- **Háptica.** No es un caso de la tabla de la carta, y nunca puede ser el
  único feedback.
- **Un conteo de fuente de `...CONTINUOUS_CORNER`.** No ve por tile, y el
  render ya lo cubre (D6).
- **`responderRelease` o `userEvent.press`.** La suelta necesita un objetivo
  nativo que el árbol de test no tiene (D3), y `userEvent.press` suelta sin
  dejar ver el estado pulsado.
- **Timers falsos para los 130 ms.** `waitFor` basta, y los timers falsos
  obligarían a sincronizar también las consultas de la Home.
- **Llevar la receta también a `collar-pair-link`.** Es otro elemento, fuera de
  la entrada, y movería otra vez `#62 R14` y `#98 R10`. Queda como hallazgo
  **(F)** en [[requirements]] §Fuera de alcance.
