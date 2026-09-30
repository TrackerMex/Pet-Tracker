---
feature: "mobile-collar-pair-link-pressed-feedback"
status: approved           # draft | spec_ready | approved
tags: [spec, mobile, ui, deuda]
---

# Diseño — [[mobile-collar-pair-link-pressed-feedback]] (#138)

> Ver [[requirements]] para los requisitos que este diseño implementa y
> [[../../docs/architecture|architecture]] para las reglas de capas. Esta
> feature vive entera en la capa de presentación del móvil
> (`mobile-pet-tracker/src/screens/`) y en dos tests. No toca dominio,
> aplicación ni infraestructura, ni el backend.
>
> Rige `docs/ui-guidelines.md`, §Micro-reglas de pulido: «Feedback pressed en
> TODO elemento tappable (Pressable style function o componente heroui que ya
> lo trae); touch target ≥ 44pt». El botón «Vincular collar» es un `Pressable`
> sin estado pulsado. Esta feature cierra ese hueco con la misma receta que
> #136 aplicó a los tiles de accesos rápidos.

## Decisiones técnicas

- **D1. La receta de #136, sin reabrirla (R1, R2).** El `style` del botón pasa
  a `({ pressed }) => ({ ...CONTINUOUS_CORNER, opacity: pressed ? 0.8 : 1 })`,
  en cuatro líneas y con la sangría de sus props (22 espacios). Es la receta
  que la Home ya usa en los tiles y que la campana y «Ver todos» usan en su
  opacidad. Cambio instantáneo, sin Reanimated, sin transición, sin escala y
  sin háptica. #136 firmó el porqué (`specs/mobile-quick-actions-pressed-feedback/design.md`
  §D1): la carta la nombra, no añade dependencias ni mocks, y se canda en
  render. Reabrirla solo para un botón dejaría dos recetas de pulsado en la
  misma pantalla. No cambian los imports: `Pressable` y `CONTINUOUS_CORNER` ya
  están importados en la Home.

- **D2. `toEqual` sobre el `style` entero, con literales (R1, R2).** Un
  `Pressable` con `style` función entrega al host el valor que devuelve la
  función, sin aplanarlo. `toEqual({ borderCurve: 'continuous', opacity: … })`
  asevera la esquina y la opacidad a la vez y rechaza cualquier clave de más
  (sonda `stray`). Los esperados son **literales**, no `CONTINUOUS_CORNER`
  importado de producción: si la constante cambiase, un esperado que la
  importa cambiaría con ella y el candado pasaría en verde (sonda `constant`:
  rojo 5 con los literales). Consecuencia firmada: la forma del `style` queda
  fijada a un **objeto**; un array visualmente idéntico da rojo (sonda
  `array`). `toHaveStyle` aplanaría y aceptaría el array, pero mira un
  subconjunto de claves y dejaría pasar una clave de más. `StyleSheet.flatten`
  en el test está prohibido por `design-drift`, que escanea el test en busca
  de `StyleSheet`.

- **D3. La pulsación se simula con `responderGrant`, `responderTerminate` y
  `waitFor` (R1).** Es el camino que #136 midió sobre RN 0.86.2
  (`specs/mobile-quick-actions-pressed-feedback/design.md` §D3) y que aquí se
  re-midió con el `it` nuevo:
  - `fireEvent(link, 'responderGrant', { nativeEvent: {}, persist: () => undefined })`
    deja el `Pressable` pulsado, y el host ya lee `opacity: 0.8` al volver el
    `await`;
  - `fireEvent(link, 'responderTerminate', …)` termina la pulsación por el
    mismo `pressOut` que una suelta, sin `onPress`. `Pressability` mantiene el
    estado pulsado hasta 130 ms (la duración mínima de pulsación), así que la
    aserción de vuelta a 1 va dentro de un `waitFor`. Con timers reales,
    `waitFor` sondea hasta su límite por defecto de 1000 ms, holgado para los
    130 ms;
  - `responderRelease` no sirve: sin un objetivo nativo en el árbol de test,
    `Pressability` no lo acepta como suelta y el botón se queda pulsado.
  El `onPress` sigue cubierto por `'shows the pair action for a pet without a
  collar and opens pairing'`, que no cambia. La sonda `sticky` (un estado
  propio que se queda en 0.8 tras terminar) cae en el `waitFor` del paso 3:
  prueba que el paso 3 no es decorativo.

- **D4. Dos `it` nuevos, sin enmendar los existentes (R1, R2).** A diferencia
  de #136, donde `#81 R3` ya fijaba el `style` de los tiles y había que
  enmendarlo, aquí **ningún** `it` lee el `style` del botón: los dos del
  `describe` del collar comprueban texto, rol, destino y condición de render.
  Por eso se añaden dos `it` al final de ese `describe`, que reutilizan su
  `beforeEach` y fijan su propio sujeto (`makePet({ device: null })`).
  - `#138 R1` fija el pulsado y la suelta, y el reposo antes de pulsar.
  - `#138 R2` fija el reposo y el radio. El paso del radio **no es
    decorativo**: hoy `#62 R14` comprueba que ningún tag de apertura con
    `style={CONTINUOUS_CORNER}` lleva `rounded-full`, y el del botón era el
    único de la Home. Con la fila de la Home en 0, ese control deja de mirar la
    Home, y la sonda `rounded_full` lo prueba: con `rounded-full` añadido al
    botón, **solo** `#138 R2` da rojo. `rounded_2xl` da rojo además en `#62 R4`
    y `#98 R10`, que miran la escala de radios de todo `src/`.

  El reposo aparece en los dos `it`. Es a propósito: `#138 R1` necesita el
  reposo como punto de partida de la pulsación, y `#138 R2` es el candado del
  botón en reposo, donde el radio y la esquina se leen juntos, igual que
  `#81 R3` con los tiles.

- **D5. La fila de la Home en `directUses` se queda con 0, no se retira
  (R3).** `#62 R14` recorre `directUses` con `it.each` y, por cada fila,
  asevera tres cosas: que el fichero importa `CONTINUOUS_CORNER` de
  `theme/native-styles`, que tiene exactamente `count` usos de
  `style={CONTINUOUS_CORNER}` (con `matchAll`, que devuelve un array también
  cuando no hay coincidencias) y que ningún tag de apertura de esos usos lleva
  `rounded-full`. Con la fila en 0:
  - el import sigue candado: la Home lo necesita para los dos spreads;
  - un `style={CONTINUOUS_CORNER}` directo que vuelva a la Home da rojo (sonda
    `norecipe`);
  - el control de `rounded-full` queda vacío para la Home, y lo sustituye
    `#138 R2` (D4).

  Retirarla perdería los dos primeros candados y bajaría el test de
  consistencia de 53 a 52 `it`. El precio es un título generado que lee
  «importa y aplica sus 0 esquinas»; el comentario de la fila lo explica.

- **D6. `?? []` para contar cero coincidencias en `#98 R10` (R3).**
  `String.prototype.match` con `/g` devuelve `null` si no hay coincidencias, y
  `expect(null).toHaveLength(0)` falla con `Matcher error: received value must
  have a length property whose value must be a number` (medido). La línea pasa
  a `expect(home.match(/style=\{CONTINUOUS_CORNER\}/g) ?? []).toHaveLength(0)`.
  Es el mismo idioma que ya usa el helper `count` del mismo `it`
  (`(readFileSync(path, 'utf8').match(pattern) ?? []).length`), así que no
  introduce un patrón nuevo, y deja la línea paralela a la de `food` justo debajo. Con la Home de
  base da rojo por `toHaveLength` (1 contra 0), no por un error de tipo.

- **D7. Tres commits rojos y un verde común (C4, vía a).** Los tres
  requisitos tienen rojo natural contra la Home de base: `#138 R1` por
  `toEqual` en reposo, `#138 R2` por `toEqual` en su `style`, y los dos `it`
  de consistencia enmendados por `toHaveLength`. El verde no se puede partir
  por requisito: el cambio de una línea de la Home pone verdes los tres a la
  vez, y sin las enmiendas de R3 dejaría rojos `#62 R14` y `#98 R10`. Orden:
  R1, R2 y R3, cada uno en su commit de solo tests, y después un único commit
  de la Home. Los blobs de cada paso están en [[tasks]].

## Archivos afectados

Todos en `mobile-pet-tracker/`, capa de presentación y sus tests:

- `src/screens/home/index.tsx`: una línea (`style={CONTINUOUS_CORNER}` del
  botón, 22 espacios) pasa a cuatro. Diff `4	1`. Nada más: ni imports, ni
  `className`, ni `onPress`, ni la sangría irregular del bloque.
- `src/screens/home/index.test.tsx`: dos `it` nuevos al final del `describe`
  del collar (+69 líneas, de 4616 a 4685). Ningún import nuevo: `renderHome`,
  `screen`, `fireEvent`, `waitFor`, `mockGetPet` y `makePet` ya están.
- `src/__tests__/consistency-classnames.test.ts`: la fila de la Home y la suma
  de `#62 R14`, y dos cifras de `#98 R10`, con sus comentarios (+10 / −6).

No se tocan `package.json`, `bun.lock`, `src/i18n/catalog.ts`,
`src/providers/__tests__/language-provider.test.tsx`,
`src/__tests__/ui-copy-table.ts`, `src/theme/native-styles.ts` ni
`docs/ui-guidelines.md`.

## Coordinación con la otra sesión

La sesión Backend (#137 y #139) comparte Postgres y LocalStack y tiene un Codex
que en el móvil solo toca `src/hooks/use-push-registration.test.tsx`. Ningún
fichero de esta feature se solapa. Si al arrancar alguno de los tres blobs de
base no coincide, la base se movió: **parar** y avisar, porque los blobs, los
rojos y las sondas de [[tasks]] dejarían de valer. Codex no corre `./init.sh`
ni los e2e (la base de la suite la midió el `leader`); corre solo jest, `tsc`
y `eslint` del móvil.

## Alternativas descartadas

- **Array en vez de objeto** (`[CONTINUOUS_CORNER, { opacity: … }]`):
  visualmente idéntico, pero obligaría a candar con `toHaveStyle` o a aplanar
  en el test. Se fija el objeto (D2, sonda `array`).
- **`toHaveStyle` en vez de `toEqual`**: mira un subconjunto; dejaría pasar
  `overflow: 'hidden'` o cualquier clave colada (sonda `stray`).
- **`active:opacity-80` de uniwind**: jest no resuelve `className`, así que el
  pulsado no se podría candar en render; y rompería la simetría con los tiles,
  la campana y «Ver todos».
- **Feedback animado, escala, sombra o háptica**: descartados y firmados en
  #136. Esta feature no los reabre.
- **Retirar la fila de la Home de `directUses`**: perdería el candado del
  import y el de «ningún uso directo» (D5).
- **Contar `...CONTINUOUS_CORNER` en el fuente** en lugar de mirar el render:
  un candado de texto no prueba que la esquina llegue al host ni que la
  opacidad cambie al pulsar. El render sí (D2).
- **`toBeNull()` o `not.toMatch()` en `#98 R10`**: correctos, pero rompen el
  paralelismo con la línea de `food` y con la cifra del repo; `?? []` con
  `toHaveLength(0)` deja las tres líneas iguales en forma (D6).
- **`responderRelease` o `userEvent.press`**: el primero no suelta sin
  objetivo nativo (D3); el segundo recorre la pulsación entera sin dejar
  observar el estado intermedio.
- **Timers falsos para los 130 ms**: el `describe` del collar va con timers
  reales, como `#136 R1`; activarlos en un solo `it` obligaría a derivar la
  ventana de `advanceTimersByTime` y a restaurarlos. `waitFor` basta.
- **Extraer la receta a un helper compartido** con los tiles, la campana y
  «Ver todos»: cada uno tiene candados propios, en render o por regex de
  fuente, que se moverían sin necesidad.
