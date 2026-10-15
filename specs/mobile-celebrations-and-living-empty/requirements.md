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
- [X] R16: smoke en dev build de Android completado por humano (fecha: 2026-10-14)

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
   `### §2.<n> — Añadidos por #171 — Celebraciones`, la siguiente libre en
   `origin/main` al escribir el handoff de la ronda 3: §2.26 sobre
   `ad432ca4` (después de la §2.25 de #169), o §2.27 si #170 mergea antes.
   Va antes de `## 3. La infraestructura`. Su `it` pasa a
   `it('registra las cuatro claves en §2.<n> de mobile-ui-language')`, con el
   literal `'### §2.<n> — Añadidos por #171 — Celebraciones'`; el leader
   fija `<n>` en el handoff. Las dos aserciones de posición (detrás de
   `### §2.23 `, delante de `## 3. La infraestructura`) no cambian.
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

- [x] Enmienda E3 aprobada por humano (fecha: 2026-10-13)

---

## Enmienda E4 — la celebración como su artboard

> Escrita el 2026-10-14, después de aprobar la ronda 3 (`b94c9295`). A
> diferencia de E1–E3, **cambia el comportamiento**: la celebración pasa a
> moverse y a medir como su artboard,
> `specs/mobile-welcome-pingo/design-src/celebration.dc.html`. Su casilla va
> **sin marcar**: el humano reabre el gate solo para esta enmienda, y la
> ronda 4 no arranca hasta que esté marcada. Los `it` que cambian, los nuevos
> y las sondas están en `tasks.md` §E4.

Mandato del humano (2026-10-13), literal: «si, dale aclara en las otras
sesiones que el diseño final debe de quedar como el artifac». Donde el build y
el artboard difieren, gana el artboard. E4 cubre las filas 1–14 del informe
de divergencias (`progress/explore_171-canvas-parity.md`). La fila 15
(botones) es de #177 y las filas 16–24 (vacío de Inicio), de #176.

### El hecho medido

«Hoy» es `src/components/celebration.tsx` en `b94c9295`. La altura de ventana
en jest es `H = 1334`, la misma con la que E2 cuadró su tabla.

| # | Artboard | Hoy | Lo fija hoy |
|---|---|---|---|
| 1 | Cada pieza lleva `fall … infinite`: llueve mientras la pantalla está abierta | Una sola pasada (`withDelay` + `withTiming`, sin repetir); la última termina a los 4430 ms | R6.4; `design-drift` R13.2 (prohíbe `withRepeat`) |
| 2 | 36 piezas | 24 piezas | R6.1, R6.5 (E2) y el texto de la carta |
| 3 | `var(--accent)` y #F79009, #7A5AF8, #2E90FA, #F04438, #12B76A, seis piezas de cada | `bg-accent` y `CONFETTI_FILLS` (cinco `bg-category-*-strong`, más oscuros) | E1; R6.1; `consistency-classnames` #64 R9 (quince clases) |
| 4 | 11 elipses de 8–12 × 6 px y 25 rectángulos de 8–12 × 14/18 px con radio 2 px | Tres formas (8×6 redonda, 10×14 y 12×16 rectas), ocho de cada | E1; R6.1. #62 R4 veta `rounded-2xl/lg/md/sm`, **no** `rounded-xs` |
| 5 | Duraciones de 2320 a 3593 ms y retardos de 128 a 1396 ms, pieza a pieza; curva `cubic-bezier(.2,.6,.4,1)` | Fórmulas `(i·137) % 1200` y `(i·53) % 1200`; la curva coincide | R6.3, R6.5 |
| 6 | Anillo de acento detrás de Pingo, `ping 2.2s ease-out infinite` (escala .55→1.5, opacidad .55→0) | No existe | Fuera de alcance (D); punto 7 de la carta |
| 7 | Pop de 600 ms y luego `float 3s ease-in-out 600ms infinite` (0 → −10 px → 0) | Solo el pop; Pingo queda quieto | Fuera de alcance (D); `design-drift` R13.2 |
| 8 | Hero de 220×220 con `margin-top: 40`; imagen de 170 px | Hero e imagen de 200×200, sin margen | R7.1, R7.3, R8.2 |
| 9 | Insignia de 56 px en right 18 / bottom 26; check **SVG** de 28 px, trazo 3; pop de 500 ms con 450 ms de retardo | `size-14` en right 0 / bottom 0; glifo de texto «✓»; retardo de 400 ms | R2.4, R7.2, R7.4 |
| 10 | Keyframes `pop`: escala .6 y opacidad 0; al 60 %, escala 1.08 y opacidad 1; al 100 %, escala 1. `ease-out` por tramo | `withSpring(1, MOTION_CELEBRATION_SPRING)` (400 ms, 0.5) | R7.4; `motion.test` (E3) |
| 11 | `rise 400ms ease-out` (opacidad 0→1, translateY 14→0) en título (500 ms), cuerpo (580), fichas (660) y acciones (740) | Estáticos | Fuera de alcance (D) |
| 12 | Título 30 px, 900, `letter-spacing: -0.02em`, `margin-top: 8` | `text-3xl font-black`, sin tracking ni margen | `tab-headers-canvas` #168 R1 reserva el literal con `tracking-tight` a las tres pestañas |
| 13 | Cuerpo 15 px, `line-height: 1.5`, `max-width: 300` | `text-base` (16 px), sin ancho máximo | `design-drift` R13.1 (sin corchetes) |
| 14 | `gap: 14`; padding 80 / 24 / 40 | `gap-4`; abajo `insets.bottom + 24` | Ningún `it` |

Precisiones medidas en el spike del leader (fuera del árbol, sobre
`b94c9295`, con esta enmienda aplicada):

- Tailwind v4 genera el espaciado de forma dinámica: `gap-3.5` = 14 px,
  `max-w-75` = 300 px, `mt-10` = 40 px, `h-4.5` = 18 px, `leading-5.5` =
  22 px. `rounded-xs` da 2 px con el `--radius` de heroui-native. Solo los
  15 px del cuerpo necesitan token.
- En jest no se resuelve ninguna clase: los candados aseveran `className`.
- El `opacity: .16` inline del anillo solo se ve con la animación parada; los
  keyframes lo pisan. E4 adopta .55 → 0.
- Uniwind traduce `em` multiplicando por el rem (16), no por el `font-size`
  del nodo. `tracking-tight` (−0.025em) da −0.4 px en nativo sobre el título
  de 30 px, no −0.75 px. Pasa lo mismo hoy en las tres pestañas. El
  `--tracking-title: -0.02em` de #173 tampoco lo arregla (−0.32 px). Lo
  decide la prueba de humo.
- Todos los valores de esta enmienda salen de Reanimated en jest. La deriva
  de reinicio de `withRepeat` y `withSequence` es 0. Con la enmienda
  aplicada, `celebration.test.tsx` pasa 66 de 66 y siguen verdes
  `design-drift`, `consistency-classnames`, `motion.test`, `global-css`,
  `tab-headers-canvas`, Vincular, la bienvenida, Añadir mascota,
  `legibility-classnames`, `language-provider` y `empty-state`. `tsc` sale
  con 0.

### Qué cambia

**E4.1 — R6 reescrito: 36 piezas de confeti en bucle (filas 1, 2, 4 y 5).**
`celebration.tsx` sustituye `CONFETTI_COUNT`, `COLORS`, `SHAPES` y las
fórmulas de posición, retardo y duración por esta tabla literal
`[left %, className, duración ms, retardo ms]`. Sale del artboard:
`left = round(px / 390 · 100)`; ancho 8/10/12 → `w-2`/`w-2.5`/`w-3`; alto
6/14/18 → `h-1.5`/`h-3.5`/`h-4.5`; elipse → `rounded-full`, rectángulo →
`rounded-xs`; color por `i % 6`.

```ts
const CONFETTI = [
  [42, 'h-1.5 w-3 rounded-full bg-accent', 3008, 308],
  [9, 'h-4.5 w-2.5 rounded-xs bg-confetti-amber', 2392, 1097],
  [7, 'h-1.5 w-2 rounded-full bg-confetti-violet', 2639, 1039],
  [57, 'h-1.5 w-2 rounded-full bg-confetti-blue', 2343, 856],
  [72, 'h-1.5 w-3 rounded-full bg-confetti-rose', 2321, 869],
  [29, 'h-1.5 w-3 rounded-full bg-confetti-green', 3484, 1291],
  [76, 'h-1.5 w-2 rounded-full bg-accent', 3012, 1199],
  [6, 'h-3.5 w-2.5 rounded-xs bg-confetti-amber', 2472, 1140],
  [19, 'h-3.5 w-3 rounded-xs bg-confetti-violet', 2441, 1107],
  [73, 'h-4.5 w-2 rounded-xs bg-confetti-blue', 2570, 1396],
  [75, 'h-1.5 w-2.5 rounded-full bg-confetti-rose', 2584, 1308],
  [72, 'h-4.5 w-2 rounded-xs bg-confetti-green', 3355, 128],
  [27, 'h-3.5 w-3 rounded-xs bg-accent', 3593, 1016],
  [41, 'h-3.5 w-2.5 rounded-xs bg-confetti-amber', 3399, 953],
  [39, 'h-1.5 w-3 rounded-full bg-confetti-violet', 2568, 508],
  [11, 'h-3.5 w-3 rounded-xs bg-confetti-blue', 2814, 1176],
  [45, 'h-1.5 w-3 rounded-full bg-confetti-rose', 2789, 919],
  [15, 'h-3.5 w-2 rounded-xs bg-confetti-green', 3056, 1048],
  [20, 'h-4.5 w-2 rounded-xs bg-accent', 3063, 1001],
  [10, 'h-3.5 w-2.5 rounded-xs bg-confetti-amber', 3373, 1142],
  [91, 'h-4.5 w-2.5 rounded-xs bg-confetti-violet', 3417, 717],
  [60, 'h-3.5 w-2.5 rounded-xs bg-confetti-blue', 2391, 140],
  [91, 'h-4.5 w-2 rounded-xs bg-confetti-rose', 2333, 1360],
  [92, 'h-4.5 w-3 rounded-xs bg-confetti-green', 3525, 634],
  [58, 'h-3.5 w-3 rounded-xs bg-accent', 2990, 582],
  [3, 'h-4.5 w-2 rounded-xs bg-confetti-amber', 2927, 945],
  [15, 'h-3.5 w-2 rounded-xs bg-confetti-violet', 2320, 1011],
  [17, 'h-3.5 w-2.5 rounded-xs bg-confetti-blue', 3014, 507],
  [11, 'h-4.5 w-2.5 rounded-xs bg-confetti-rose', 3119, 340],
  [36, 'h-3.5 w-3 rounded-xs bg-confetti-green', 3081, 280],
  [93, 'h-3.5 w-3 rounded-xs bg-accent', 2934, 850],
  [30, 'h-1.5 w-2 rounded-full bg-confetti-amber', 2369, 309],
  [30, 'h-3.5 w-2 rounded-xs bg-confetti-violet', 2677, 1348],
  [77, 'h-1.5 w-2.5 rounded-full bg-confetti-blue', 2738, 373],
  [19, 'h-4.5 w-2.5 rounded-xs bg-confetti-rose', 3294, 858],
  [74, 'h-4.5 w-3 rounded-xs bg-confetti-green', 2457, 652],
] as const;
```

- **R6.1** WHILE reduce motion no está activo THE SYSTEM SHALL pintar en
  `{id}-confetti` exactamente 36 hijos directos, `{id}-confetti-0` …
  `{id}-confetti-35`. El único hijo `View` de la pieza `i` lleva exactamente
  la `className` de la fila `i` de `CONFETTI`.
- **R6.2** THE SYSTEM SHALL que cada pieza, al montarse y antes de su
  retardo, tenga el estilo
  `{ position: 'absolute', top: 0, left: '<left>%', opacity: 0, transform: [{ translateY: -40 }, { rotate: '0deg' }] }`,
  con `<left>` de su fila.
- **R6.3** THE SYSTEM SHALL animar el progreso de cada pieza con
  `withDelay(retardo, withRepeat(withTiming(1, { ...MOTION_CONFETTI_FALL_TIMING, duration }), -1, false))`,
  con `retardo` y `duration` de su fila. El mapeo no cambia: opacidad
  `interpolate(progreso, [0, 0.1, 1], [0, 1, 0])`,
  `translateY = -40 + progreso * (alto de ventana + 80)` y
  `rotate = progreso * 540` grados. Antes de su retardo, la pieza sigue en
  sus valores iniciales.
- **R6.4** WHILE la celebración está abierta, WHEN una pieza termina su
  caída, THE SYSTEM SHALL volver a lanzarla desde arriba sin repetir el
  retardo. Con la pieza 21 (retardo 140, duración 2391): a los 2500 ms
  `translateY` > 1300, y a los 2600 ms `translateY` > 0 y < 400 (medido:
  1373.91 y 80.24). Si el retardo se repitiera, a los 2600 ms seguiría en −40.
- **R6.5** WHEN han pasado 1500 ms desde el montaje THE SYSTEM SHALL dejar
  cada pieza `i` en la opacidad, el `translateY` y los grados de `rotate` de
  la tabla `CONFETTI_AT_1500`, con las tolerancias de E2
  (`toBeCloseTo(…, 2)` en opacidad y `toBeCloseTo(…, 0)` en las otras dos). A
  esa hora todas las piezas arrancaron (el mayor retardo es 1396 ms) y
  ninguna terminó su primer ciclo (el primero en terminar acaba a los
  2531 ms).

  ```ts
  const CONFETTI_AT_1500 = [
    [0.25, 1055.8, 418.5], [0.627, 575.7, 235.1], [0.613, 593.9, 242.1],
    [0.416, 844.2, 337.7], [0.421, 837.8, 335.2], [0.919, 204.2, 93.2],
    [0.803, 352.5, 149.9], [0.682, 505.8, 208.5], [0.645, 553.3, 226.6],
    [0.98, 127.2, 63.9], [0.876, 258.8, 114.1], [0.236, 1073.2, 425.1],
    [0.71, 470.8, 195.1], [0.645, 553.1, 226.5], [0.261, 1041.5, 413.0],
    [0.761, 405.5, 170.1], [0.54, 686.8, 277.6], [0.677, 513.0, 211.2],
    [0.64, 559.1, 228.8], [0.785, 374.4, 158.3], [0.498, 739.7, 297.8],
    [0.107, 1237.9, 488.0], [0.919, 204.2, 93.3], [0.467, 779.3, 312.9],
    [0.366, 908.9, 362.4], [0.58, 636.3, 258.3], [0.535, 693.2, 280.0],
    [0.333, 950.1, 378.1], [0.278, 1020.0, 404.8], [0.25, 1055.4, 418.3],
    [0.513, 720.8, 290.5], [0.152, 1181.1, 466.3], [0.929, 191.7, 88.5],
    [0.234, 1076.8, 426.5], [0.568, 650.8, 263.8], [0.312, 977.1, 388.4],
  ] as const;
  ```

  La tabla depende del alto de ventana de jest (1334). Si cambia, se
  recalcula la tabla y no la tolerancia.
- **R6.6** WHEN han pasado 13830 ms desde el montaje THE SYSTEM SHALL tener
  las 36 piezas con opacidad > 0: todas en vuelo, con 204 ms de margen frente
  a la frontera de ciclo más cercana.

**E4.2 — Colores del confeti como tokens (fila 3).**

- `src/theme/global.css` declara en `@theme`, una sola vez para los dos
  temas (decisión E4-P1): `--color-confetti-amber: #F79009;`,
  `--color-confetti-violet: #7A5AF8;`, `--color-confetti-blue: #2E90FA;`,
  `--color-confetti-rose: #F04438;` y `--color-confetti-green: #12B76A;`.
- `CONFETTI_FILLS` sale de `src/utils/category-palette.ts` y de
  `celebration.tsx`. El inventario de #64 R9 vuelve a diez clases.
- Ningún fichero de producción salvo `celebration.tsx` nombra
  `confetti-amber`, `confetti-violet`, `confetti-blue`, `confetti-rose` ni
  `confetti-green`, y ninguno salvo él usa `rounded-xs`.

**E4.3 — R7 reescrito: pop por keyframes (filas 9 y 10).** La numeración se
conserva para que cada `it` siga nombrando su requisito.

- **R7.1** WHILE reduce motion no está activo THE SYSTEM SHALL montar
  `{id}-pingo` con el estilo
  `{ width: 170, height: 170, opacity: 0, transform: [{ translateY: 0 }, { scale: 0.6 }] }`
  (`MOTION_POP_SCALE`; el `translateY` es la flotación de R18, en el mismo
  nodo). En el mismo efecto de montaje anima la opacidad con
  `withTiming(1, { ...MOTION_CELEBRATION_EASE_OUT, duration: 360 })` y la
  escala con
  `withSequence(withTiming(MOTION_CELEBRATION_POP_PEAK, { ...MOTION_CELEBRATION_EASE_OUT, duration: 360 }), withTiming(1, { ...MOTION_CELEBRATION_EASE_OUT, duration: 240 }))`.
  360 y 240 son el 60 % y el 40 % de `MOTION_CELEBRATION_POP_MS` (600).
- **R7.2** WHILE reduce motion no está activo THE SYSTEM SHALL montar
  `{id}-badge` con el estilo
  `{ position: 'absolute', right: 18, bottom: 26, opacity: 0, transform: [{ scale: 0.6 }] }`.
  Anima opacidad y escala como en R7.1, con `MOTION_CELEBRATION_BADGE_POP_MS`
  (500: tramos de 300 y 200 ms), y cada una envuelta en
  `withDelay(MOTION_CELEBRATION_BADGE_DELAY_MS, …)` (450).
- **R7.3** THE SYSTEM SHALL cumplir estos tiempos:
  - WHEN han pasado 650 ms, `{id}-pingo` está en opacidad 1 y escala 1 (solo
    esas dos: su `translateY` ya vale −0.0213, porque la flotación arrancó a
    los 600 ms);
  - WHEN han pasado 300 ms, `{id}-badge` sigue en opacidad 0 y escala 0.6;
  - WHEN han pasado 1000 ms, `{id}-badge` está en opacidad 1 y escala 1.
- **R7.4** WHILE reduce motion no está activo THE SYSTEM SHALL dejar estos
  pares `[opacidad, escala]`, comparados con `toBeCloseTo(…, 3)`:
  - `{id}-pingo`: a los 0 ms `[0, 0.6]`, a los 100 `[0.4157, 0.7995]`, a los
    200 `[0.7422, 0.9563]` y a los 300 `[0.9555, 1.0586]`;
  - `{id}-badge`: a los 300 y 450 ms `[0, 0.6]`, a los 550
    `[0.4884, 0.8344]` y a los 650 `[0.8438, 1.0050]`.

  Y en el segundo tramo, sin `toBeCloseTo` (el reinicio de tramo puede
  llegar un frame tarde en jest): Pingo a los 420 y 540 ms, y la insignia a
  los 800 y 900 ms, tienen opacidad 1 y `1 < escala < 1.08`, con la escala
  de la segunda muestra menor que la de la primera. No se muestrea en la
  frontera de `withSequence` (360 ms Pingo, 750 ms insignia).

**E4.4 — R17 nuevo: anillo de ping (fila 6).**

- **R17.1** WHILE reduce motion no está activo THE SYSTEM SHALL pintar
  `{id}-ring` como primer hijo de `{id}-hero`, con
  `className="absolute inset-0 rounded-full bg-accent"`,
  `pointerEvents="none"`, `accessibilityElementsHidden` e
  `importantForAccessibility="no-hide-descendants"`.
- **R17.2** THE SYSTEM SHALL animar la escala del anillo de
  `MOTION_PING_FROM` (0.55) a `MOTION_PING_TO_SCALE` (1.5) y su opacidad de
  `MOTION_PING_FROM` (0.55) a 0, cada una con
  `withRepeat(withTiming(destino, { ...MOTION_CELEBRATION_EASE_OUT, duration: MOTION_CELEBRATION_PING_MS }), -1, false)`
  (2200 ms). Pares `[escala, opacidad]`, con `toBeCloseTo(…, 3)`: a los 0 ms
  `[0.55, 0.55]`, a los 550 `[0.9092, 0.3420]`, a los 1100
  `[1.2004, 0.1734]` y a los 2100 `[1.4965, 0.0020]`.
- **R17.3** WHILE la celebración está abierta THE SYSTEM SHALL reiniciar el
  anillo: a los 2750 ms, escala < 1 y opacidad > 0.3.

**E4.5 — R18 nuevo: Pingo flota (fila 7).**

- **R18.1** WHILE reduce motion no está activo THE SYSTEM SHALL animar el
  `translateY` de `{id}-pingo` con
  `withDelay(MOTION_CELEBRATION_POP_MS, withRepeat(withTiming(-MOTION_PINGO_FLOAT_OFFSET_Y, MOTION_PINGO_FLOAT_TIMING), -1, true))`.
  Valores: 0 a los 600 ms, −5 a los 1350 y −10 a los 2100.
- **R18.2** WHILE la celebración está abierta THE SYSTEM SHALL seguir
  flotando: 0 a los 3600 ms y −10 a los 5100 (extremos de tramo, con
  `toBeCloseTo(…, 1)`).

Las constantes son las de #172 (`MOTION_PINGO_FLOAT_OFFSET_Y = 10` y
`MOTION_PINGO_FLOAT_TIMING`, 1500 ms por tramo con `bezier(0.42, 0, 0.58, 1)`),
con su nombre y su valor (decisión E4-P5). E4 las declara si #172 no ha mergeado
al escribir el handoff, y las reutiliza si sí. E4 no usa el componente
`PingoFloat` de #172.

**E4.6 — R19 nuevo: entrada escalonada (fila 11).**

- **R19.1** WHILE reduce motion no está activo THE SYSTEM SHALL pintar
  `{id}-title`, `{id}-body`, `{id}-details` y `{id}-actions` como nodos
  animados (`Animated.Text` o `Animated.View`, con su `className`) que
  empiezan con opacidad 0 y `translateY` `MOTION_CELEBRATION_RISE_OFFSET_Y`
  (14). Animan a 1 y 0 con
  `withDelay(MOTION_CELEBRATION_RISE_DELAY_MS + k * MOTION_CELEBRATION_RISE_STAGGER_MS, withTiming(…, { ...MOTION_CELEBRATION_EASE_OUT, duration: MOTION_SURFACE_MS }))`,
  con `k` fijo por nodo: título 0, cuerpo 1, fichas 2 y acciones 3. A los
  700 ms, `[opacidad, translateY]` vale `[0.685, 4.41]` en el título,
  `[0.445, 7.77]` en el cuerpo, `[0.161, 11.75]` en las fichas y `[0, 14]` en
  las acciones. A los 1200 ms, los cuatro valen `[1, 0]`.
- **R19.2** IF la celebración no trae fichas THEN THE SYSTEM SHALL conservar
  `k = 3` en las acciones (740 ms): el escalonado no se compacta. A los
  700 ms las acciones siguen en `[0, 14]`.
- El orden de hijos directos de R2.3 no cambia: no hay envoltorios nuevos.

**E4.7 — R20 nuevo: maquetación (filas 8, 9, 12, 13 y 14).**

- **R20.1** THE SYSTEM SHALL pintar `{id}-hero` con
  `className="mt-10 items-center justify-center"` y
  `style={{ width: 220, height: 220 }}`. `{id}-pingo` y su imagen
  `{id}-pose` miden 170 × 170.
- **R20.2** THE SYSTEM SHALL colocar `{id}-badge` en `right: 18` y
  `bottom: 26` (R7.2). El `View` interior no cambia.
- **R20.3** THE SYSTEM SHALL sustituir el glifo de texto «✓» de la insignia
  por este SVG, con un único `Path`, donde
  `const [check] = useThemeColors(['accent-foreground'])`:

  ```tsx
  <Svg testID={`${testID}-check`} width={28} height={28} viewBox="0 0 24 24" fill="none">
    <Path d="M20 6 9 17l-5-5" stroke={check} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
  ```

  `react-native-svg` ya está instalado. Se descarta el `Check` de reicons:
  es un trazado relleno y más fino que el del artboard. R2.4 pasa a decir
  «la insignia `{id}-badge` con el check `{id}-check`».
- **R20.4** THE SYSTEM SHALL pintar `{id}-title` con
  `className="mt-2 text-center text-3xl font-black tracking-tight text-foreground"`
  (`tracking-tight` es la clase de escala más cercana a −0.02em; ver la
  precisión de uniwind arriba).
- **R20.5** THE SYSTEM SHALL pintar `{id}-body` con
  `className="max-w-75 text-center text-15 leading-5.5 text-muted"`: 15 px,
  ancho máximo de 300 e interlineado de 22 px (el artboard da 22.5).
  `text-15` es el `--text-15: 15px` de #173 (decisión E4-P2): E4 lo declara en
  `@theme` si #173 no ha mergeado al escribir el handoff, y lo reutiliza si
  sí.
- **R20.6** THE SYSTEM SHALL pintar la raíz `{id}` con
  `className="flex-1 items-center gap-3.5 bg-surface-secondary px-6"` y
  `style={{ paddingTop: insets.top + 80, paddingBottom: insets.bottom + 40 }}`.

**E4.8 — R21 nuevo: desmontar cancela los bucles.**

- **R21.1** WHEN `Celebration` se desmonta tras montarse sin reduce motion
  THE SYSTEM SHALL llamar a `cancelAnimation` sobre los 36 progresos del
  confeti, la escala y la opacidad del anillo y el `translateY` de Pingo:
  39 llamadas, ni una más. Los pops y la entrada terminan solos y no se
  cancelan. Con reduce motion no hay bucles, y el spike midió 0 llamadas.

**E4.9 — R8 ampliado: reduce motion.**

- R8.1–R8.3 conservan su sustancia: sin confeti, y Pingo y la insignia con su
  fundido a escala 1. Cambian las medidas (170 × 170 y 18 / 26), y el
  `transform` de Pingo pasa a `[{ translateY: 0 }, { scale: 1 }]`.
- **R8.4** WHILE reduce motion está activo THE SYSTEM SHALL no montar
  `{id}-ring` y mantener `{id}-pingo` en `translateY: 0` (a los 2000 ms
  sigue en 0).
- **R8.5** WHILE reduce motion está activo THE SYSTEM SHALL pintar título,
  cuerpo, fichas y acciones con opacidad 1 y `translateY: 0` desde el primer
  render. El valor inicial de cada `useSharedValue` depende de
  `useReducedMotion()`: no basta con el `ReduceMotion.System` del config,
  que salta al final un frame tarde.

**E4.10 — R13.2 reescrito.** THE SYSTEM SHALL que `Celebration` solo anime
`transform` y `opacity`, y que no use `LayoutAnimation`, `entering=` ni
`exiting=`. `withRepeat` y `withSequence` dejan de estar prohibidos.

**E4.11 — `src/theme/motion.ts`.** Salen `MOTION_CONFETTI_MIN_MS`,
`MOTION_CONFETTI_SPREAD_MS` y `MOTION_CELEBRATION_SPRING` (el muelle de E3).
Se quedan `MOTION_CONFETTI_FALL_TIMING`, `MOTION_POP_SCALE`,
`MOTION_SURFACE_MS`, `MOTION_FADE_TIMING`, `MOTION_PING_FROM` y
`MOTION_PING_TO_SCALE`; los dos últimos son de #167 y tienen el valor del
artboard. Entran, bajo un comentario `// #171 R7` (la regex de hex de `design-drift` R13.1
exime `#NNN R<dígito>`, pero un `// #171 E4` la pone en rojo):

```ts
export const MOTION_CELEBRATION_EASE_OUT = { easing: Easing.bezier(0, 0, 0.58, 1), reduceMotion: ReduceMotion.System };
export const MOTION_CELEBRATION_POP_MS = 600;
export const MOTION_CELEBRATION_POP_PEAK = 1.08;
export const MOTION_CELEBRATION_BADGE_POP_MS = 500;
export const MOTION_CELEBRATION_BADGE_DELAY_MS = 450;
export const MOTION_CELEBRATION_PING_MS = 2200;
export const MOTION_CELEBRATION_RISE_DELAY_MS = 500;
export const MOTION_CELEBRATION_RISE_STAGGER_MS = 80;
export const MOTION_CELEBRATION_RISE_OFFSET_Y = 14;
// Solo si #172 no ha mergeado al escribir el handoff, con el texto de su spec:
export const MOTION_PINGO_FLOAT_OFFSET_Y = 10;
export const MOTION_PINGO_FLOAT_TIMING = { duration: 1500, easing: Easing.bezier(0.42, 0, 0.58, 1), reduceMotion: ReduceMotion.System };
```

La curva es la `ease-out` literal de CSS, `bezier(0, 0, 0.58, 1)` (decisión
E4-P6). La lista de `no exporta nada más` queda en la base medida al escribir
el handoff, menos 3 y más 9 (más 2 si #172 no ha mergeado).

**E4.12 — R12.3: candado de posición de §2.27.** Lo pide la observación 1
del review de la ronda 3: una sonda movió el bloque entre §2.23 y §2.24 y
salió verde. El `it` de R12 suma
`expect(doc.indexOf(SECTION)).toBeGreaterThan(doc.indexOf('### §2.26 '))`.
Antes de las aserciones de posición suma
`expect(doc.split('### §2.23 ')).toHaveLength(2)` y
`expect(doc.split('### §2.26 ')).toHaveLength(2)`: sin ellas, si un
encabezado desaparece o se renombra, `indexOf` da −1 y la comparación pasa
en verde. El spike lo midió: con `### §2.26 ` renombrado, 0 rojos sin los
`split` y R12 en rojo con ellos.

**E4.13 — R15 reescrito: la carta.** THE SYSTEM SHALL, en
`docs/ui-guidelines.md`:

1. Añadir al punto 7, justo después de «…no arrancan con reduce motion.» y
   con la sangría de dos espacios de sus líneas de continuación:

   ```md
     La enmienda #171 suma a esta lista la flotación y el anillo de ping de
     Pingo en la celebración, y la lluvia de confeti que la acompaña: los tres
     se repiten mientras la celebración está abierta.
   ```

2. Sustituir la sección `## Enmienda #171 — confeti de celebración`, en la
   misma posición y hasta su casilla incluida, por:

   ```md
   ## Enmienda #171 — confeti, ping y flotación de la celebración

   `Celebration` (`src/components/celebration.tsx`) se mueve como su artboard,
   `specs/mobile-welcome-pingo/design-src/celebration.dc.html`:

   - **Confeti.** 36 piezas que caen en bucle con `withRepeat` mientras la
     celebración está abierta. La tabla de posición, forma, color, duración y
     retardo vive en `celebration.tsx`; la curva, en
     `MOTION_CONFETTI_FALL_TIMING` de `motion.ts`. Los colores son `bg-accent` y
     los cinco tokens `confetti-*` de `global.css`, que ninguna otra pantalla
     usa. `rounded-xs` (2 px) es una excepción a la escala de radios del
     punto 12 que solo vale para las piezas del confeti. Esas piezas tampoco
     declaran `CONTINUOUS_CORNER`: con 2 px el squircle no se distingue.
   - **Ping.** Un anillo `bg-accent` detrás de Pingo crece de 0.55 a 1.5 y se
     apaga de 0.55 a 0 en 2200 ms ease-out, en bucle.
   - **Pop y flotación.** Pingo entra con un pop de 600 ms que pasa por 1.08 y
     después flota 10 px arriba y abajo, 1500 ms por tramo, en bucle. La
     insignia hace un pop de 500 ms con 450 ms de retardo.
   - **Entrada.** Título, cuerpo, fichas y acciones suben 14 px y aparecen en
     400 ms ease-out, desde los 500 ms y cada 80 ms.
   - Solo se animan `transform` y `opacity`, sin `entering`, `exiting` ni
     `LayoutAnimation`. Al desmontar sin reduce motion, `cancelAnimation`
     para los bucles.
   - Con reduce motion no se montan el confeti ni el anillo, Pingo no flota y el
     texto aparece sin subir; Pingo y la insignia conservan su fundido.
   - El confeti es de tier «raro»: solo lo monta `Celebration`, y
     `Celebration` solo cierra el alta de una mascota o la vinculación de un
     collar.

   - [ ] Aprobada por humano (fecha: ____)
   ```

El handoff de la ronda 4 se escribe después de la firma de E4, así que la
casilla de la sección va marcada con la fecha en que el humano marque la
casilla de carta de esta enmienda, abajo. El `it` de R15 asevera los dos
textos y acepta la casilla marcada o sin marcar (`- \[[ xX]\]`).

**E4.14 — Lo que queda sin efecto en esta spec.**

- R6.4 y R6.5 de antes (una pasada que termina a los 4430 ms, tabla
  `CONFETTI_AT_1200` de E2), R7.3 y R7.4 de antes (2000 / 2400 ms y los pares
  del muelle) y el `MOTION_CELEBRATION_SPRING` de E3.
- En «Fuera de alcance», las viñetas (D) del anillo «ping» con la flotación
  en la celebración, y del texto que entra sin la subida escalonada.
- En «Preguntas abiertas», P4 (confeti de una sola pasada): el humano eligió
  los bucles del canvas el 2026-10-13. Y P5 (pop con muelle y rebote): lo
  sustituye el pop por keyframes de E4.3.
- Lo que la ronda 3 cerró con valores (E2 y E3) se re-mide con los de E4.

**Candados compartidos con #172 y #173.** El handoff los mide en su base
(«base medida + delta», nunca una cifra de esta enmienda):

| Candado | Fichero | Quién más lo mueve |
|---|---|---|
| `no exporta nada más` | `src/theme/__tests__/motion.test.ts` | #172 (los dos `MOTION_PINGO_FLOAT_*`) |
| Tokens de `@theme` | `src/theme/global.css`, `global-css.test.ts` | #172 R1, #173 R2 (`--text-15`, radios) |
| #62 R1 / R4 y punto 12 de la carta | `consistency-classnames.test.ts`, `docs/ui-guidelines.md` | #173 (radios nuevos) |
| #168 R1 (literal del título grande) | `tab-headers-canvas.test.ts` | #172, si toca títulos |
| Secciones de enmienda al final de la carta y punto 7 | `docs/ui-guidelines.md` | #172 (enmienda de `PingoFloat`), #173 (punto 12) |

### Qué no cambia

- **Copy.** Voz B y la P1 aprobada; R12.1 y R12.2 intactos.
- **Fila 15 (botones)**, de #177: R14 y las clases de `{id}-actions` no
  cambian, salvo que el nodo pasa a ser animado (R19).
- **Filas 16–24 (vacío de Inicio)**, de #176. R10 y R11 no cambian.
- **Recorrido del confeti:** sigue de −40 a alto de ventana + 40. Los 760 px
  fijos del artboard no entran.
- `paddingTop: insets.top + 80` y `px-6`, que ya coinciden con el artboard.
- R1, R2.1–R2.3, R2.5–R2.7, R3, R4, R5, R9 y R14.
- Los fundidos con reduce motion de R8.2 y R8.3.
- `MOTION_CONFETTI_FALL_TIMING`, `MOTION_POP_SCALE` y los tokens de ping de
  #167 conservan su valor.
- El texto actual del punto 7 de la carta: E4 solo añade un párrafo detrás.

### Decisiones del humano (2026-10-13)

Respondidas en la sesión del leader, con AskUserQuestion. E4-P1 … E4-P7 son
las preguntas del borrador de esta enmienda, distintas de las P1–P5 de
«Preguntas abiertas»:

- **Separar por dueño:** filas 1–14 en #171 como E4, el vacío de Inicio en
  #176 y la receta de botones en #177.
- **Bucles** como en el canvas, apagados con reduce motion.
- **Copy:** se queda la voz B de Pingo.
- **E4-P1:** el mismo hex del confeti en los dos temas.
- **E4-P2:** `text-15`, con el nombre por píxel de #173 (`--text-15: 15px`).
  #172 declara el mismo valor como `--text-body`; Frontend queda avisado del
  duplicado.
- **E4-P3:** `rounded-xs`, con la excepción acotada de la carta.
- **E4-P4 … E4-P7:** las recomendaciones del borrador. E4-P4, `max-w-75`, que
  confirma la prueba de humo. E4-P5, los nombres y valores de las constantes
  de flotación de #172 sin su componente `PingoFloat`, que arranca al montar
  y no comparte nodo con el pop. E4-P6, la curva `ease-out` literal de CSS
  (la de #167, `bezier(0.23, 1, 0.32, 1)`, cambiaría las tablas). E4-P7,
  ampliar el inventario de #168 R1 con `components/celebration.tsx` en vez
  de reordenar las clases para esquivarlo.

### Qué firma el humano

1. Que las filas 1–14 se adoptan tal como las fija «Qué cambia», con tres
   desviaciones conocidas del artboard: el recorrido del confeti relativo al
   alto de ventana (no 760 px), `tracking-tight` (−0.025em frente a −0.02em,
   −0.4 px en nativo) y el interlineado de 22 px (frente a 22.5).
2. Los bucles infinitos y el texto de la carta de E4.13: el párrafo del
   punto 7 y la sección «Enmienda #171» reescrita.
3. Que cambian `it` de otras features: #64 R9 (`consistency-classnames`),
   #168 R1 (`tab-headers-canvas`), `design-drift` R13.2 y un `toBeVisible()`
   de Vincular que pasa a `toBeOnTheScreen()` (`tasks.md` §E4).
4. El orden frente a #172 y #173: E4 no espera a ninguna, y la segunda en
   mergear re-mide los candados compartidos de la tabla de arriba.
5. Que la prueba de humo R16 suma los pasos de E4 (`tasks.md` T16, pasos 9
   a 12).

- [x] Enmienda E4 aprobada por humano (fecha: 2026-10-14)
- [x] Texto de la carta de E4.13 aprobado por humano (R15) (fecha: 2026-10-14)
