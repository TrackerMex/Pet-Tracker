---
feature: "mobile-celebrations-and-living-empty"
status: approved     # draft | approved
tags: [harness, spec, mobile, ui, motion]
---

# Requisitos — [[mobile-celebrations-and-living-empty]] (#171)

> Notación EARS. Rutas relativas a `mobile-pet-tracker/` salvo que se diga
> otra cosa. Base medida: `origin/main` 89fe2009. Fila 5 del canvas aprobado
> el 2026-10-06 (`specs/mobile-welcome-pingo/design-src/celebration.dc.html`),
> planes C4 (celebración) y C2 (Pingo vivo en los vacíos) de
> `progress/explore_ui-canvas-parity.md`. Diseño en [[design]], orden TDD en
> [[tasks]], trazabilidad en [[traceability]].
>
> **Prerrequisito de handoff:** #166 (`feature/166-mobile-chunky-cta`,
> gate aprobado) mergeada en `origin/main`. Todo lo que depende de ella vive
> en **R14** y en [[design]] §9. Cumplido: #166 entró en d2b8b0ae (PR #209)
> y §9 se re-midió el 2026-10-12 contra ese merge.

## Premisas verificadas contra el árbol (89fe2009)

Corrigen o precisan `progress/explore_ui-canvas-parity.md`:

- La constante de flotación se llama `MOTION_FLOAT_TIMING`, no
  `FLOAT_TIMING`: `grep -cF "export const MOTION_FLOAT_TIMING" src/theme/motion.ts` → `1`.
- La celebración de vincular **existe a medias**:
  `src/screens/pairing/index.tsx` ya pinta un estado `pairing-ready` en línea
  (✓, título, subtítulo, Modelo, ESN, «Ver en el mapa», «Listo») con copy
  aprobada. Esta feature lo sustituye por la celebración a pantalla completa
  sin tocar su copy ni sus destinos.
  `grep -cF 'testID="pairing-ready"' src/screens/pairing/index.tsx` → `1`.
- Modelo y ESN llegan en la respuesta del claim, porque `case 'ok'` hace
  `setReadyDevice(result.device)`:
  `grep -cF "setReadyDevice(result.device);" src/screens/pairing/index.tsx` → `1`.
  No hace falta otra consulta.
- Añadir mascota no consulta hoy la lista de mascotas:
  `grep -cF "useQuery" src/screens/add-pet/index.tsx` → `0`.
- El cliente no puede borrar mascotas: `grep -rlF "deletePet" src` no da
  salida. «Borró todas sus mascotas» solo puede pasar fuera de la app.
- El origen de la pose existe y mide 1024 × 1024 RGBA:
  `/home/claude/pet-tracker-mascot/mascot-03-celebrate-v2.png`. Lo eligió el
  humano el 2026-10-11, literal «v2 brazos arriba».
- El doble de `Modal` de la preset de jest
  (`node_modules/@react-native/jest-preset/jest/mocks/Modal.js`) pinta un
  host `Modal` con todas sus props (`testID`, `onRequestClose`) cuando
  `visible !== false`.

## Requisitos funcionales

Cada requisito nombra en [[tasks]] el test que lo verifica. En los testIDs,
`{id}` es el `testID` que recibe `Celebration`: `pairing-ready` en Vincular y
`add-pet-celebration` en Añadir mascota.

### R1 — La pose `celebrate`

- **R1.1** THE SYSTEM SHALL incluir `assets/images/pingo-celebrate.webp`,
  convertido desde `mascot-03-celebrate-v2.png`. Debe ser WebP con canal alfa:
  cabecera `RIFF`/`WEBP`/`VP8X`, bit de alfa `bytes[20] & 0x10` encendido y
  bit de animación `bytes[20] & 0x02` apagado. Debe medir 1024 × 1024 y pesar
  como mucho 100000 bytes.
- **R1.2** THE SYSTEM SHALL que los ficheros de `assets/images/` que
  empiezan por `pingo-` o `mascot-` sean exactamente los de `origin/main` en
  el momento del handoff más `pingo-celebrate.webp`. En 89fe2009 son ocho, así
  que quedarían nueve. **El recuento no se congela aquí**: #167 y #170 pueden
  añadir poses antes, y el leader lo re-mide en [[design]] §9.3 (paso 5).

### R2 — Un único componente pinta la celebración

- **R2.1** THE SYSTEM SHALL exportar `Celebration` desde
  `src/components/celebration.tsx` con estas props:
  `{ testID: string; title: string; body: string; details?: { testID: string; label: string; value: string }[]; primary: { testID: string; label: string; onPress: () => void }; secondary: { testID: string; label: string; onPress: () => void } }`.
  El componente no traduce: no llama a `useTranslate` ni a `t(`.
- **R2.2** WHEN se monta `Celebration` THE SYSTEM SHALL pintar un `Modal` de
  React Native con `testID="{id}-modal"`, `visible`, `animationType="fade"`,
  `statusBarTranslucent`, `navigationBarTranslucent` y
  `onRequestClose={secondary.onPress}`.
- **R2.3** THE SYSTEM SHALL pintar dentro del `Modal` una raíz
  `testID="{id}"` cuyos hijos directos son, en este orden:
  1. `{id}-confetti`, solo sin reduce motion (R8.1);
  2. `{id}-hero`;
  3. `{id}-title`;
  4. `{id}-body`;
  5. `{id}-details`, solo si `details` trae al menos un elemento;
  6. `{id}-actions`.
- **R2.4** THE SYSTEM SHALL pintar en `{id}-hero` la imagen `{id}-pose`
  dentro de `{id}-pingo`, con `source` igual a
  `require('../../assets/images/pingo-celebrate.webp')`. Al lado pinta la
  insignia `{id}-badge` con el glifo `✓`.
- **R2.5** WHEN `details` trae elementos THE SYSTEM SHALL pintar en
  `{id}-details` una ficha por elemento, en el orden recibido. Cada ficha
  lleva la etiqueta y, en un `Text` con `testID={detail.testID}`, solo el
  valor.
- **R2.6** WHEN se pulsa `primary.testID` o `secondary.testID` THE SYSTEM
  SHALL llamar a su `onPress` exactamente una vez. WHEN el `Modal` emite
  `requestClose` (botón atrás de Android) THE SYSTEM SHALL llamar a
  `secondary.onPress` exactamente una vez y no llamar a `primary.onPress`.
- **R2.7** THE SYSTEM SHALL que `{id}-confetti` lleve `pointerEvents="none"`.
  Tanto `{id}-confetti` como `{id}-badge` quedan ocultos a la accesibilidad
  con `importantForAccessibility="no-hide-descendants"` y
  `accessibilityElementsHidden`.

### R3 — Disparador 1: vincular un collar

- **R3.1** WHEN el claim de Vincular devuelve `ok` THE SYSTEM SHALL pintar
  `Celebration` con:
  - `testID="pairing-ready"`;
  - título `t('pairing.trackerIsReady')`;
  - cuerpo `t('pairing.readySubtitle', { petName })`, con el nombre de la
    mascota seleccionada;
  - `details` con Modelo (`ready-model`, valor `readyDevice.model ?? '—'`) y
    ESN (`ready-esn`, valor `readyDevice.esn ?? '—'`);
  - primario `ready-map` («Ver en el mapa»);
  - secundario `ready-done` («Listo»).
- **R3.2** WHEN se pulsa `ready-map` THE SYSTEM SHALL conservar el destino
  actual: `router.dismissTo('/map')` una vez, y el formulario vuelve.
  WHEN se pulsa `ready-done` o el `Modal` emite `requestClose` THE SYSTEM
  SHALL conservar el destino actual: `router.back()` una vez.
- **R3.3** THE SYSTEM SHALL dejar de pintar el bloque en línea anterior. Ya
  no existen el círculo `bg-accent-soft` con `✓`, la `Card` con los
  `DeviceRow` de `ready-model` y `ready-esn`, ni el `Pressable` `ready-done`.
- **R3.4** IF el claim no devuelve `ok` THEN THE SYSTEM SHALL no pintar
  `pairing-ready-modal` ni disparar el háptico de R9.

### R4 — Disparador 2: guardar la PRIMERA mascota

- **R4.1** THE SYSTEM SHALL que Añadir mascota consulte la lista con la misma
  clave y la misma función que Vincular:
  `useQuery({ queryKey: petKeys.list(), queryFn: () => listPets(baseUrl, token ?? '') })`.
- **R4.2** WHEN se pulsa guardar THE SYSTEM SHALL fijar, antes de llamar a
  `createPet`,
  `wasFirst = pets.data?.kind === 'ok' && pets.data.pets.length === 0`.
- **R4.3** WHEN `createPet` devuelve `ok`, la subida de foto (si la hay) va
  bien y `wasFirst` es verdadero THE SYSTEM SHALL pintar `Celebration` con
  `testID="add-pet-celebration"` (la variante de R5) y no llamar a
  `router.back()`.
- **R4.4** WHEN `createPet` devuelve `ok`, la subida va bien y `wasFirst` es
  falso porque la lista ya tenía mascotas THE SYSTEM SHALL llamar a
  `router.back()` una vez, como hoy, sin celebración ni háptico.
- **R4.5** IF la lista no estaba resuelta en `ok` al pulsar guardar (cargando,
  `error`, `unreachable` o `unauthorized`) THEN THE SYSTEM SHALL tratarlo como
  «no es la primera»: `router.back()` una vez, sin celebración ni háptico.
- **R4.6** IF `wasFirst` es verdadero pero la subida de foto falla THEN THE
  SYSTEM SHALL conservar el comportamiento actual y no pintar la celebración.
  El comportamiento actual pinta `addPet.errorPhotoAfterCreate` y no navega.

### R5 — Variante sin collar (primera mascota)

- **R5.1** THE SYSTEM SHALL pintar la celebración de primera mascota con:
  - título `t('addPet.celebrateTitle', { petName })`;
  - cuerpo `t('addPet.celebrateBody', { petName })`;
  - **ningún** `details`: no existe `add-pet-celebration-details`.

  `petName` es `result.pet.name`, de la respuesta de `createPet`.
- **R5.2** WHEN se pulsa el primario `add-pet-celebration-pair`
  (`t('addPet.celebratePair')`) THE SYSTEM SHALL llamar a
  `router.replace('/pairing')` una vez y no llamar a `router.back()`.
- **R5.3** WHEN se pulsa el secundario `add-pet-celebration-later`
  (`t('addPet.celebrateLater')`) o el `Modal` emite `requestClose` THE SYSTEM
  SHALL llamar a `router.back()` una vez y no llamar a `router.replace`.
  `router.back()` es el destino que guardar tiene hoy.
- **R5.4** *(Enmienda E2)* WHEN `createPet` responde `ok` con un `pet.name`
  distinto del nombre escrito THE SYSTEM SHALL pintar ese `pet.name` en el
  título y el cuerpo. Con el formulario del test (escribe `' Nala '`) y la
  respuesta `{ id: 'pet-new', name: 'Kira' }`, el título es
  `¡Kira ya está en casa!` y el cuerpo,
  `Te ayudo a cuidar de Kira. Vincula un collar y estaré pendiente de dónde está.`

### R6 — Confeti

- **R6.1** WHILE reduce motion no está activo THE SYSTEM SHALL pintar en
  `{id}-confetti` exactamente 24 hijos directos, `{id}-confetti-0` …
  `{id}-confetti-23`. Cada uno tiene un único hijo `View` cuyo `className` es
  `<forma> <color>` según la tabla de [[design]] §4.1: la forma es
  `SHAPES[Math.floor(i / 8)]` y el color, `COLORS[i % 6]`.
- **R6.2** THE SYSTEM SHALL que cada pieza, al montarse y antes de su
  retardo, tenga el estilo
  `{ position: 'absolute', top: 0, left: '<L_i>%', opacity: 0, transform: [{ translateY: -40 }, { rotate: '0deg' }] }`,
  con `L_i = (i * 41 + 7) % 100`.
- **R6.3** THE SYSTEM SHALL animar cada pieza una sola vez, sin bucle, sobre
  un progreso de 0 a 1:
  `withDelay(D_i, withTiming(1, { ...MOTION_CONFETTI_FALL_TIMING, duration: T_i }))`.
  - `D_i = (i * 53) % MOTION_CONFETTI_SPREAD_MS`;
  - `T_i = MOTION_CONFETTI_MIN_MS + (i * 137) % MOTION_CONFETTI_SPREAD_MS`;
  - `translateY = -40 + progreso * (alto de ventana + 80)`;
  - `rotate = progreso * 540` grados;
  - opacidad `interpolate(progreso, [0, 0.1, 1], [0, 1, 0])`.
- **R6.4** WHEN han pasado 5000 ms desde el montaje THE SYSTEM SHALL dejar
  cada pieza con `opacity: 0`, `translateY` igual al alto de ventana + 40 y
  `rotate: '540deg'`. La última pieza en terminar es la 17, a los
  `D_17 + T_17 = 901 + 3529 = 4430` ms.
- **R6.5** *(Enmienda E2)* WHEN han pasado 1200 ms desde el montaje THE
  SYSTEM SHALL dejar cada pieza `i` en la opacidad, el `translateY` y los
  grados de `rotate` de la tabla `CONFETTI_AT_1200` de la Enmienda E2. La
  tolerancia es ±0,005 en la opacidad y ±0,5 en las otras dos
  (`toBeCloseTo(…, 2)` y `toBeCloseTo(…, 0)`).

### R7 — Pop de Pingo y de la insignia

- **R7.1** WHILE reduce motion no está activo THE SYSTEM SHALL montar
  `{id}-pingo` con el estilo
  `{ width: 200, height: 200, opacity: 0, transform: [{ scale: 0.6 }] }`.
  En el mismo efecto de montaje anima la escala a 1 con
  `withSpring(1, MOTION_CELEBRATION_SPRING)` *(Enmienda E3; antes
  `MOTION_POP_SPRING`)* y la opacidad a 1 con
  `withTiming(1, MOTION_FADE_TIMING)`.
- **R7.2** WHILE reduce motion no está activo THE SYSTEM SHALL montar
  `{id}-badge` con el estilo
  `{ position: 'absolute', right: 0, bottom: 0, opacity: 0, transform: [{ scale: 0.6 }] }`.
  Anima escala y opacidad a 1 igual que en R7.1, cada una envuelta en
  `withDelay(MOTION_SURFACE_MS, …)`.
- **R7.3** THE SYSTEM SHALL cumplir estos tiempos:
  - WHEN han pasado 2000 ms, `{id}-pingo` está en
    `{ width: 200, height: 200, opacity: 1, transform: [{ scale: 1 }] }`;
  - WHEN han pasado 300 ms, `{id}-badge` sigue en opacidad 0 y escala 0.6;
  - WHEN han pasado 2400 ms, `{id}-badge` está en opacidad 1 y escala 1.
- **R7.4** *(Enmienda E2)* WHILE reduce motion no está activo THE SYSTEM
  SHALL dejar `{id}-pingo` a los 50, 100, 150 y 200 ms, y `{id}-badge` a los
  450, 500, 550 y 600 ms, en estos pares `[opacidad, escala]`, con
  tolerancia ±0,005: `[0.682, 0.944]`, `[0.925, 1.06]`, `[0.986, 1]` y
  `[0.999, 0.992]`. El 1,06 de la segunda muestra es el rebote de
  `dampingRatio: 0.5` (P5).

### R8 — Reduce motion en la celebración

- **R8.1** WHILE reduce motion está activo THE SYSTEM SHALL no pintar
  `{id}-confetti` ni ninguna pieza.
- **R8.2** WHILE reduce motion está activo THE SYSTEM SHALL montar
  `{id}-pingo` ya en escala 1, con el estilo inicial
  `{ width: 200, height: 200, opacity: 0, transform: [{ scale: 1 }] }` y sin
  muelle. Conserva el fundido de opacidad hasta 1.
- **R8.3** WHILE reduce motion está activo THE SYSTEM SHALL montar
  `{id}-badge` ya en escala 1 y sin muelle. Conserva su fundido retardado de
  opacidad hasta 1.

### R9 — Háptico

- **R9.1** WHEN se monta `Celebration` THE SYSTEM SHALL llamar a
  `Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)`
  exactamente una vez, sin esperar a ningún temporizador. La llamada vive en
  un efecto de montaje del mismo commit que arranca el pop.
- **R9.2** WHEN `Celebration` se vuelve a pintar con props nuevas sin
  desmontarse THE SYSTEM SHALL no volver a llamar al háptico.
- **R9.3** WHILE reduce motion está activo THE SYSTEM SHALL disparar igual el
  háptico una vez, porque no es movimiento.

### R10 — Pingo flota en los vacíos

- **R10.1** THE SYSTEM SHALL conservar la API de `EmptyState`: la línea
  `export type EmptyStatePose = 'talk' | 'sleep' | 'clipboard' | 'health' | 'collar' | 'food';`
  y las props `{ testID, pose, title, body, action? }` no cambian.
- **R10.2** THE SYSTEM SHALL envolver la imagen `{testID}-pose` en un
  `Animated.View` con testID `{testID}-float`. Al montarse, su estilo es
  `{ width: 160, height: 160, transform: [{ translateY: 0 }] }`, y la imagen
  conserva `style={{ width: 160, height: 160 }}`. Los hijos directos de la
  raíz pasan a ser, en este orden, `{testID}-float`, título, cuerpo y, si hay
  acción, el botón.
- **R10.3** WHILE reduce motion no está activo THE SYSTEM SHALL arrancar al
  montarse
  `withRepeat(withTiming(-MOTION_FLOAT_OFFSET_Y, MOTION_FLOAT_TIMING), -1, true)`
  sobre `translateY`, igual que la bienvenida.
- **R10.4** *(Enmienda E2)* WHILE reduce motion no está activo THE SYSTEM
  SHALL dejar `{testID}-float` con `translateY` igual a `-0.579`, `-2` y
  `-3.421`, con tolerancia ±0,005, a los 300, 600 y 900 ms del montaje.

### R11 — Reduce motion en los vacíos

- **R11.1** WHILE reduce motion está activo THE SYSTEM SHALL no llamar a
  `withRepeat` desde `EmptyState` y mantener `{testID}-float` en
  `translateY: 0` pase el tiempo que pase.

### R12 — Copy de la variante sin collar

- **R12.1** THE SYSTEM SHALL declarar en el catálogo, en los dos idiomas, las
  cuatro claves de [[design]] §6 con su literal exacto. La propuesta está en
  Preguntas abiertas, P1.
- **R12.2** THE SYSTEM SHALL cumplir estas reglas de voz:
  - `addPet.celebrateTitle` exclama en los dos idiomas: `¡…!` en español y
    `…!` en inglés;
  - `addPet.celebrateBody`, `addPet.celebratePair` y
    `addPet.celebrateLater` no exclaman;
  - ninguna de las cuatro lleva emoji;
  - `addPet.celebrateBody` termina en punto.
- **R12.3** *(Enmienda E3)* THE SYSTEM SHALL registrar las cuatro claves en
  una sección `### §2.<n> — Añadidos por #171 — Celebraciones` de
  `specs/mobile-ui-language/design.md`, donde `<n>` es la siguiente libre en
  `origin/main` al escribir el handoff de la ronda 3: §2.26 sobre
  `ad432ca4`, §2.27 si #170 ha mergeado antes. Va después de §2.23 y de las
  secciones `§2.*` que la sigan, y antes de `## 3. La infraestructura`. Cada
  fila sigue el formato
  `| — | \`<clave>\` | \`<en>\` | \`<es>\` | ← añadida por #171 (R12) |`.
  El leader fija `<n>` en el handoff tras medirlo ([[design]] §9.3, paso 6).
  Además suma sus cuatro usos a `R9_ADD_PET` en
  `src/__tests__/ui-copy-table.ts`.

### R13 — Sin drift de estilo

- **R13.1** THE SYSTEM SHALL que `src/components/celebration.tsx`,
  `src/components/__tests__/celebration.test.tsx` y `src/theme/motion.ts` no
  contengan literales hex, clases con corchetes, `StyleSheet` ni
  `shadow*`/`elevation`. Es el patrón `MEALS_BAR_STYLE_ESCAPES` de
  `src/__tests__/design-drift.test.ts`.
- **R13.2** THE SYSTEM SHALL que `Celebration` solo anime `transform` y
  `opacity`, y que no use `LayoutAnimation`, `entering=`, `exiting=` ni
  `withRepeat`.

### R14 — Lo que depende de #166 (re-medido tras el merge de #166)

- **R14.1** THE SYSTEM SHALL pintar el primario de `Celebration` como
  `<Button testID={primary.testID} className="min-h-11 w-full rounded-xl bg-accent border-b-4 border-black/25">`
  con `<Button.Label className="font-bold text-accent-foreground">`.
- **R14.2** THE SYSTEM SHALL pintar el secundario como
  `<Button testID={secondary.testID} className="min-h-11 w-full rounded-xl border-2 border-b-6 border-lip-gray bg-surface">`,
  sin `variant`, con `<Button.Label className="font-bold text-foreground">`.
  Las dos recetas son las de #166 R2.1 (`rounded-xl bg-accent border-b-4 border-black/25`,
  con el labio detrás de `bg-accent`) y R3.1
  (`rounded-xl border-2 border-b-6 border-lip-gray bg-surface`), como
  secuencias contiguas. Viven en el punto 13 de §Decisiones fijas de
  `docs/ui-guidelines.md`; verificado tras el merge de #166 (d2b8b0ae) en
  [[design]] §9.3.
- **R14.3** THE SYSTEM SHALL que, al terminar la feature, los inventarios de
  botones cuenten lo siguiente:
  - **Primarios sólidos** (#166 R2.2): siguen siendo 19, ahora en 18
    ficheros. El mapa fichero → recuento gana la fila
    `components/celebration.tsx` = 1, y `screens/pairing/index.tsx` pasa de
    2 a 1 porque `ready-map` se muda al componente.
  - **Receta del labio** (#166 R2.3): `border-b-4` y `border-black/25`
    siguen en 19 cada uno.
  - **Radio único de primarios** (#62 R1, `toHaveLength(13 + 1 + 1 + 1 + 1 + 1 + 1)`)
    y **#98 R10** (`count(/rounded-xl bg-accent(?=[\s'"\`])/g)`): siguen en
    19.
  - **Secundarios neutros** (#166 R3.2): pasan de 4 a 5. La lista suma el
    secundario de `celebration.tsx`, cuyo testID en la fuente es la
    expresión `secondary.testID`.
  - **`border-lip-gray` y `border-b-6`** (#166 R3.3): pasan de 4 a 5 cada
    uno.

  Por el camino, cada commit verde deja la suite en verde. Los deltas
  intermedios (+1 en T14 y −1 en T8) y las anclas exactas están en
  [[design]] §9, re-medido contra `origin/main` d2b8b0ae tras el merge de
  #166.

### R15 — Enmienda a la carta: el confeti

- **R15.1** THE SYSTEM SHALL añadir al final de `docs/ui-guidelines.md` el
  texto literal de [[design]] §8 (`## Enmienda #171 — confeti de
  celebración`). El candado no exige que sea la última sección: otras
  enmiendas (#167 añade la suya) pueden ir detrás. Su casilla va marcada solo si el humano marcó la casilla de
  enmienda de §Aprobación de esta spec.

### R16 — Smoke humano en dev build de Android

- **R16.1** WHEN el humano corre el plan de smoke de [[tasks]] T16 en un dev
  build de Android THE SYSTEM SHALL mostrar las dos celebraciones, el
  háptico, el reduce motion y el flotar como se describe allí. El humano
  firma la casilla propia de R16 en §Aprobación.

## Fuera de alcance

Clasificado viñeta a viñeta: (F) es feature futura y (D), delimitación.

- (D) El labio del botón de `EmptyState` (`{testID}-action`) es de #166.
- (D) La copy de la celebración de Vincular no se reescribe a la voz B. Se
  reutiliza la aprobada: `pairing.trackerIsReady`, `pairing.readySubtitle`,
  `pairing.viewOnMap`, `pairing.done`, `pairing.model` y `pairing.esn`.
- (D) No se construye el anillo «ping» del canvas en la celebración, porque
  es un bucle continuo y el punto 7 de la carta solo admite como bucles los
  «Bucles de reposo» de Pingo. #167 los amplía a los anillos de la
  bienvenida, pero exige una enmienda propia para cualquier otra pantalla.
  Por la misma razón, Pingo no flota dentro de la celebración.
- (D) El texto de la celebración entra con el fundido nativo del `Modal`,
  sin la subida escalonada del canvas. Los tests de Vincular aseveran
  `toBeVisible()` sobre el título y el subtítulo, y una opacidad inicial 0
  los rompería.
- (D) Ninguna otra pantalla celebra (alta de recordatorio, primera comida…).
- (F) Celebrar solo una vez por cuenta, con una bandera persistente o del
  backend.
- (D) No se añade ninguna dependencia. `react-native-reanimated` y
  `expo-haptics` ya están instalados, y Lottie no entra.

## Preguntas abiertas

Cada una trae el valor por defecto con el que se implementa si el humano no
dice otra cosa en el gate.

- **P1 — Copy de la variante sin collar (voz B, §7).** Por defecto:

  | Clave | en | es |
  |---|---|---|
  | `addPet.celebrateTitle` | `{{petName}} is home!` | `¡{{petName}} ya está en casa!` |
  | `addPet.celebrateBody` | `I'll help you look after {{petName}}. Pair a collar and I'll keep track of where they are.` | `Te ayudo a cuidar de {{petName}}. Vincula un collar y estaré pendiente de dónde está.` |
  | `addPet.celebratePair` | `Pair a collar` | `Vincular un collar` |
  | `addPet.celebrateLater` | `Not now` | `Ahora no` |

  El título evita el género en español, que obligaría a elegir entre
  «Bienvenido» y «Bienvenida».
- **P2 — Quien no tiene mascotas porque las borró fuera de la app** vuelve a
  ver la celebración al añadir una. Por defecto se acepta: el cliente no
  puede borrar mascotas, y una bandera persistente es (F).
- **P3 — CTAs de la variante sin collar.** Por defecto, el primario
  «Vincular un collar» llama a `router.replace('/pairing')`, porque
  `selectPet` ya dejó seleccionada la mascota nueva. El secundario «Ahora no»
  llama a `router.back()`.
- **P4 — Confeti de una sola pasada** (unos 4,4 s) en lugar del bucle
  infinito del canvas. Por defecto, una pasada: la carta pide «menos y más
  suave», y el bucle del canvas es de maqueta.
- **P5 — Pop con rebote** (`dampingRatio: 0.5`): desde 0,6 llega a un pico
  de unos 1,065, cerca del 1,08 del canvas. Por defecto sí, porque es el tier
  «raro» de la skill expo-animation.

## Aprobación

- [x] Aprobado por humano (fecha: 2026-10-12) ← gate obligatorio antes de implementar
- [x] Enmienda a la carta de [[design]] §8 aprobada por humano (R15)
- [ ] R16: smoke en dev build de Android completado por humano (fecha: ____)

---

## Enmienda E1 — el confeti respeta la escala de radios y la paleta categórica

> Escrita el 2026-10-12 sobre la spec aprobada (firma `1b20491c`), antes del
> handoff a Codex. No toca ningún requisito: R6.1 sigue diciendo
> «`<forma> <color>` según la tabla de [[design]] §4.1», y lo que cambia es
> esa tabla. Su casilla va **sin marcar**: el humano reabre el gate solo para
> esta enmienda, y Codex no arranca hasta que esté marcada.

### El hecho medido

Un spike del leader fuera del árbol (la `celebration.tsx` de [[design]] §3 y
§4.1 sobre `origin/main` d2b8b0ae) puso rojos tres candados vivos de
`src/__tests__/consistency-classnames.test.ts`:

| Candado | Por qué |
|---|---|
| `#62 R4 › no deja la clase fuera de escala rounded-sm en producción` | `SHAPES` usaba `rounded-sm` en dos formas |
| `#98 R10 › deja CONTINUOUS_CORNER, bg-accent-soft y el acento donde estaban` | su última línea repite el veto a `rounded-sm` |
| `#64 R9 › centraliza las diez clases completas y prohíbe interpolarlas` | solo `src/utils/category-palette.ts` puede nombrar clases `bg-category-*`, y `COLORS` nombraba cinco |

Con la forma enmendada, el mismo spike deja los tres en verde. Solo quedan
los rojos que T14 ya prevé: #62 R1 y #98 R10 por el recuento del acento,
#166 R2 ×2 y #166 R3. `tsc` no da errores en los dos ficheros.

### Qué cambia

1. **Formas.** Los dos rectángulos pierden el radio:
   `SHAPES = ['h-1.5 w-2 rounded-full', 'h-3.5 w-2.5', 'h-4 w-3']`. El
   siguiente radio de la escala, `rounded-xl`, es más ancho que la pieza y la
   convertiría en píldora.
2. **Colores.** Las cinco tintas de categoría se declaran en
   `src/utils/category-palette.ts` como `CONFETTI_FILLS`, y `celebration.tsx`
   hace `COLORS = ['bg-accent', ...CONFETTI_FILLS]`. El color en pantalla y el
   orden no cambian.
3. **Un candado más se mueve.** El `toEqual` de #64 R9 gana esas cinco
   clases y su título pasa de «diez» a «quince» ([[design]] §7). Entra en el
   rojo de T3.
4. **Un fichero más.** `src/utils/category-palette.ts` entra en [[design]] §5.

### Qué firma el humano

Que los rectángulos del confeti pasen de `rounded-sm` a esquina viva, y que
el módulo de paleta gane `CONFETTI_FILLS`.

- [x] Enmienda E1 aprobada por humano (fecha: 2026-10-12)

---

## Enmienda E2 — los candados muestrean la curva, no solo sus extremos

> Escrita el 2026-10-13 tras el rechazo de la ronda 1
> (`progress/review_mobile-celebrations-and-living-empty.md`, sobre
> `9b825948`). No cambia ningún comportamiento: la implementación revisada ya
> cumple R5.1, R6.3, R7.1, R7.2 y R10.3. Añade R5.4, R6.5, R7.4 y R10.4, que
> fijan con valores medidos lo que esas cláusulas ya exigen, para que una
> mutación de la fórmula no pase en verde. Su casilla va **sin marcar**: el
> humano reabre el gate solo para esta enmienda, y Codex no arranca la ronda
> 2 hasta que esté marcada.

### El hecho medido

El reviewer plantó en producción estas mutaciones, y la suite siguió verde:

| Sonda | Mutación | Cláusula que viola |
|---|---|---|
| S1 | `duration: MOTION_CONFETTI_MIN_MS`, sin `+ (index * 137) % MOTION_CONFETTI_SPREAD_MS` | R6.3 `T_i` |
| S2 | quitar `...MOTION_CONFETTI_FALL_TIMING` del `withTiming` | R6.3 curva |
| S3 | opacidad `interpolate(p, [0, 0.5, 1], …)` | R6.3 opacidad |
| S4 | retardo `index * 53`, sin `% MOTION_CONFETTI_SPREAD_MS` | R6.3 `D_i` (solo cambia la pieza 23: 1219 ms en vez de 19) |
| S5 | escala de Pingo con `withTiming(1, MOTION_FADE_TIMING)` | R7.1 muelle |
| S5b | `MOTION_POP_SPRING` con `dampingRatio: 1` (tras E3, `MOTION_CELEBRATION_SPRING`) | R7.1 y R7.2, P5 |
| S10 | flote con `{ ...MOTION_FLOAT_TIMING, duration: 600 }` | R10.3 |
| S12 | `setCelebratePetName(input.name)` | R5.1 |

Los candados de la ronda 1 solo miraban el estado inicial y el final, la
pieza 0 (cuya `T_0` es justo 2400) o una opacidad «entre 0 y 1». Y el doble
de `createPet` devolvía el mismo nombre que el test escribe.

El leader añadió tres sondas más, una por cada pieza que las del reviewer no
tocan:

| Sonda | Mutación | Cláusula que viola |
|---|---|---|
| S5i | escala de la insignia con `withDelay(MOTION_SURFACE_MS, withTiming(1, MOTION_FADE_TIMING))` | R7.2 muelle |
| Sfade | opacidad de Pingo con `MOTION_FILL_TIMING` | R7.1 fundido |
| S10c | flote con `{ duration: 1200 }`, sin la curva | R10.3 curva |

La spike de la enmienda se hizo el 2026-10-13, en una copia fuera del árbol
sobre `9b825948`, con los bloques de [[tasks]] §E2 aplicados tal cual.

- **Base verde:** `celebration.test.tsx` pasa 49 de 49 y `empty-state.test.tsx`
  101 de 101. `add-pet/index.test.tsx` pasa 15 de 15 con `-t '#171'`. `tsc` y
  `eslint` sobre los tres ficheros salen con 0.
- **Cada sonda, plantada sola, pone en rojo el `it` nuevo de su cláusula y
  ningún otro.** Todas por aserción (`toBeCloseTo`, o `toBe` en S12) y ninguna
  por excepción:

| Sonda | `it` en rojo |
|---|---|
| S1, S2, S3, S4 | R6.5 a los 1200 ms cada pieza sigue su retardo, su duración y su curva |
| S5, Sfade | R7.4 Pingo rebota por encima de 1 y se asienta a los 50, 100, 150 y 200 ms |
| S5i | R7.4 la insignia repite el rebote a los 450, 500, 550 y 600 ms |
| S5b | los dos R7.4 |
| S10, S10c | R10.4 sigue la curva de 1200 ms a los 300, 600 y 900 ms |
| S12 | R5.4 toma el nombre de la respuesta y no el del formulario |

### Qué cambia

1. **Cuatro criterios nuevos**, cada uno en su requisito: R5.4, R6.5, R7.4 y
   R10.4. Sus valores salen de la spike, no de las fórmulas.
2. **Tabla `CONFETTI_AT_1200`** de R6.5, `[opacidad, translateY, grados]`
   por pieza a los 1200 ms. El alto de ventana del entorno de jest es 1334.
   A esa hora ya arrancaron todas las piezas (el mayor `D_i` es el de la 22,
   1166 ms) y no terminó ninguna. La 21 y la 22 van por la rama de subida de
   la opacidad (progreso < 0,1) y el resto, por la de bajada.

   | i | opacidad | translateY | grados |
   |---|---|---|---|
   | 0 | 0.154 | 1178.4 | 465.3 |
   | 1 | 0.194 | 1127.3 | 445.8 |
   | 2 | 0.236 | 1073.5 | 425.2 |
   | 3 | 0.28 | 1017.6 | 403.9 |
   | 4 | 0.325 | 960 | 381.9 |
   | 5 | 0.371 | 901.3 | 359.5 |
   | 6 | 0.418 | 841.8 | 336.8 |
   | 7 | 0.465 | 781.9 | 313.9 |
   | 8 | 0.512 | 721.8 | 290.9 |
   | 9 | 0.381 | 889.8 | 355.1 |
   | 10 | 0.44 | 813.4 | 325.9 |
   | 11 | 0.501 | 736.7 | 296.6 |
   | 12 | 0.561 | 660.1 | 267.4 |
   | 13 | 0.621 | 584.3 | 238.4 |
   | 14 | 0.679 | 509.8 | 210 |
   | 15 | 0.736 | 436.9 | 182.1 |
   | 16 | 0.792 | 366.1 | 155.1 |
   | 17 | 0.846 | 297.6 | 128.9 |
   | 18 | 0.803 | 351.9 | 149.7 |
   | 19 | 0.877 | 258.2 | 113.9 |
   | 20 | 0.947 | 169.4 | 80 |
   | 21 | 0.89 | 85.9 | 48.1 |
   | 22 | 0.336 | 7.5 | 18.2 |
   | 23 | 0.275 | 1024.4 | 406.5 |

3. **Cinco `it`** en tres ficheros de test, con el código literal de
   [[tasks]] §E2. Nacen verdes; producción no cambia.
4. **[[traceability]]**: el leader rellenó la columna de tests de R1–R15,
   que la ronda 1 dejó en «pendiente» (C5 del rechazo). No forma parte de la
   firma.

### Qué firma el humano

Que la ronda 2 añada los cinco `it` de R5.4, R6.5, R7.4 (dos) y R10.4 con
los valores medidos de arriba, sin tocar producción.

- [x] Enmienda E2 aprobada por humano (fecha: 2026-10-12)

---

## Enmienda E3 — la celebración tiene su propio muelle y su copy cambia de sección

> Escrita el 2026-10-13, al preparar el merge de `origin/main` (`ad432ca4`,
> que ya trae #167, #168 y #169) en la branch, después de la ronda 2. No
> cambia ningún comportamiento ni ningún valor medido. Su casilla va **sin
> marcar**: el humano reabre el gate solo para esta enmienda, y la ronda 3
> no arranca hasta que esté marcada.

### El hecho medido

1. **Choque de nombre.** #167 (PR #210) declara en `src/theme/motion.ts` su
   propio `MOTION_POP_SPRING`, con `dampingRatio: 0.6` y
   `duration: MOTION_SURFACE_MS`. Lo usa `src/components/pop-in.tsx` y lo
   fija `#167 R2` en `src/theme/__tests__/motion.test.ts`. #171 declara un
   `MOTION_POP_SPRING` con `dampingRatio: 0.5`. Los dos no caben en el mismo
   módulo: `git merge origin/main` deja en conflicto `motion.ts` y
   `motion.test.ts`. Quedarse con cualquiera de los dos valores rompe al
   otro. Con 0.6 caen los dos `it` de R7.4 (medido en el spike); con 0.5 cae
   `#167 R2`.
2. **Numeración.** En `origin/main` (`ad432ca4`),
   `specs/mobile-ui-language/design.md` ya tiene `### §2.24` (#167) y
   `### §2.25` (#169). La siguiente libre, la que pide R12.3, es §2.26, no la
   §2.25 que R12.3 anticipaba entre paréntesis. Además #170 (PR #213, cerrada
   y sin mergear) abre otra §2.26; si mergea antes, la libre será §2.27.
3. **Spike del leader**: el merge de `ad432ca4` resuelto fuera del árbol,
   con este cambio aplicado. `tsc` y `expo lint` salen limpios, y los ocho
   suites que tocan los conflictos (353 `it`) pasan en verde. El jest completo de
   `mobile-pet-tracker` sobre el spike da 102 suites y 3063 `it`, todos
   verdes. En la primera corrida, los 4 `it` de `hosting-artifacts.test.ts`
   fallaron con ENOENT porque el spike no copiaba `hosting/`, `.env.example`
   ni `AGENTS.md` de la raíz. Con esos ficheros copiados, esa suite pasa
   7 de 7.

### Qué cambia

1. **Nombre del muelle.** `motion.ts` declara, bajo `// #171 R7`:
   `export const MOTION_CELEBRATION_SPRING = { duration: 400, dampingRatio: 0.5, reduceMotion: ReduceMotion.System };`.
   R7.1 pasa a decir `withSpring(1, MOTION_CELEBRATION_SPRING)`, y R7.2 lo
   hereda («igual que en R7.1»). `MOTION_POP_SPRING` queda como lo dejó #167
   (0.6): #171 no lo declara ni lo importa.
2. **Su test.** En `motion.test.ts`, `it('declara MOTION_POP_SPRING'` pasa a
   `it('declara MOTION_CELEBRATION_SPRING'`, con el mismo valor
   `{ duration: 400, dampingRatio: 0.5, reduceMotion: 'system' }`. La lista
   de `no exporta nada más` gana `MOTION_CELEBRATION_SPRING`, además de los
   tokens que trae #167.
3. **Sección de copy.** R12.3 registra las cuatro claves en
   `### §2.26 — Añadidos por #171 — Celebraciones`, después de la §2.25 de
   #169 y antes de `## 3. La infraestructura`. Su `it` pasa a
   `it('registra las cuatro claves en §2.26 de mobile-ui-language')`, con el
   literal `'### §2.26 — Añadidos por #171 — Celebraciones'`. Las dos
   aserciones de posición (detrás de `### §2.23 `, delante de
   `## 3. La infraestructura`) no cambian.
4. **Sonda S5b** de la tabla de E2: muta `dampingRatio: 0.5` en
   `MOTION_CELEBRATION_SPRING`. Sigue siendo un literal único en
   `motion.ts`, porque el muelle de #167 usa 0.6.

### Qué no cambia

- Ningún valor: los pares de R7.4, P5 (`dampingRatio: 0.5`), R7.3 y el
  resto de requisitos siguen igual.
- Ningún comportamiento: en producción, el merge solo cambia en #171 el
  nombre del símbolo en `celebration.tsx` (import y dos usos).
- Los recuentos agregados que mueve el merge (catálogo, clases, labios) son
  mecánica de la resolución, no requisitos. Van en el handoff de la ronda 3.

### Qué firma el humano

Que el pop de la celebración use su propio muelle `MOTION_CELEBRATION_SPRING`
(0.5) en vez de compartir nombre con el pop de #167 (0.6), y que su sección
de copy sea la siguiente libre al hacer el merge (§2.26, o §2.27 si #170
mergea antes).

- [ ] Enmienda E3 aprobada por humano (fecha: ____)
