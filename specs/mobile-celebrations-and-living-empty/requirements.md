---
feature: "mobile-celebrations-and-living-empty"
status: draft        # draft | approved
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
> en **R14** y en [[design]] §9, marcados «se re-mide tras el merge de #166».
> Ninguna cuenta de #166 se congela aquí como si ya estuviera en main.

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
- **R1.2** THE SYSTEM SHALL que `assets/images/` tenga exactamente nueve
  ficheros que empiezan por `pingo-` o `mascot-`: los ocho de hoy más
  `pingo-celebrate.webp`.

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

### R7 — Pop de Pingo y de la insignia

- **R7.1** WHILE reduce motion no está activo THE SYSTEM SHALL montar
  `{id}-pingo` con el estilo
  `{ width: 200, height: 200, opacity: 0, transform: [{ scale: 0.6 }] }`.
  En el mismo efecto de montaje anima la escala a 1 con
  `withSpring(1, MOTION_POP_SPRING)` y la opacidad a 1 con
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
- **R12.3** THE SYSTEM SHALL registrar las cuatro claves en una sección
  `### §2.24 — Añadidos por #171 — Celebraciones` de
  `specs/mobile-ui-language/design.md`, después de §2.23 y antes de
  `## 3. La infraestructura`. Cada fila sigue el formato
  `| — | \`<clave>\` | \`<en>\` | \`<es>\` | ← añadida por #171 (R12) |`.
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

### R14 — Lo que depende de #166 (se re-mide tras el merge de #166)

- **R14.1** THE SYSTEM SHALL pintar el primario de `Celebration` como
  `<Button testID={primary.testID} className="min-h-11 w-full rounded-xl bg-accent border-b-4 border-black/25">`
  con `<Button.Label className="font-bold text-accent-foreground">`.
- **R14.2** THE SYSTEM SHALL pintar el secundario como
  `<Button testID={secondary.testID} className="min-h-11 w-full rounded-xl border-2 border-b-6 border-lip-gray bg-surface">`,
  sin `variant`, con `<Button.Label className="font-bold text-foreground">`.
  Las dos recetas son las de #166 R2.1 (`rounded-xl bg-accent border-b-4 border-black/25`,
  con el labio detrás de `bg-accent`) y R3.1
  (`rounded-xl border-2 border-b-6 border-lip-gray bg-surface`), como
  secuencias contiguas. Fuente: spec de #166 en
  `origin/feature/166-mobile-chunky-cta` @ e96870fa. Tras el merge, viven en
  el punto 13 de §Decisiones fijas de `docs/ui-guidelines.md`.
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
  [[design]] §9, que el leader re-mide contra `origin/main` tras el merge de
  #166.

### R15 — Enmienda a la carta: el confeti

- **R15.1** THE SYSTEM SHALL añadir al final de `docs/ui-guidelines.md` el
  texto literal de [[design]] §8 (`## Enmienda #171 — confeti de
  celebración`). Su casilla va marcada solo si el humano marcó la casilla de
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
- (D) No se construye el anillo «ping» del canvas, porque es un bucle
  continuo y §7 de la carta solo admite flotar y parpadear como bucles. Por
  la misma razón, Pingo no flota dentro de la celebración.
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

- [ ] Aprobado por humano (fecha: ____) ← gate obligatorio antes de implementar
- [ ] Enmienda a la carta de [[design]] §8 aprobada por humano (R15)
- [ ] R16: smoke en dev build de Android completado por humano (fecha: ____)
