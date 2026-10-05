---
feature: mobile-map-gps-pill-battery
id: 116
status: approved
tags: [harness, spec, mobile, ui]
base: 8f22c8d2 (origin/main b2a9c2aa)
---

# Requisitos — #116 mobile-map-gps-pill-battery

El mapa gana la píldora flotante del `MapScreen` del Make (avatar, nombre y
estado del GPS) y la batería del collar, con datos que ya llegan al móvil. Cero
dependencias, cero backend, cero claves de catálogo nuevas.

Todo lo medido en esta spec se midió en la base `8f22c8d2`. Las anclas son de
contenido (grep), nunca números de línea: #117 y #118 están en vuelo y mueven
algunos de los mismos candados (ver R10).

## Contexto y decisiones cerradas

| # | Decisión | Cierre | Por qué |
|---|---|---|---|
| a1 | Fuente de la píldora | Avatar y nombre salen de `selectedPet` (la lista `pets`, ya en `MapScreen`). El estado sale del detalle (`detail`) con `deviceConnectionState` + `MAP_CONNECTION_LABEL_KEY` de `src/utils/device-connectivity.ts`, que **no cambia** | La lista ya está antes que el detalle: el nombre no parpadea mientras el detalle carga. El estado conserva su única fuente (#94) |
| a2 | Tono por estado | `online → success`, `offline → warning`, `unknown → muted`, `none → muted`, detalle no `ok` → `muted`. Mismos tonos que `HOME_CONNECTION` de la Home | Un collar significa lo mismo en las dos pantallas |
| a3 | Reutilización de la Home | Se reutilizan las clases de tono (`STATUS_TONE_CLASSES` de `src/components/pet-hero-header.tsx`, que pasa a exportarse) y `PetAvatar`. **No** se reutiliza `PetHeroHeader` (es la cabecera fotográfica de 240 de alto, no una píldora) ni su pulso | Un solo sitio para el par punto/tinta de cada tono; cero copias de clases |
| a4 | Posición | Primer hijo de `map-stats`, justo encima de la tarjeta de stats, alineada a la izquierda (`self-start`). **Desviación declarada** del Make, que la pone arriba a la izquierda | Arriba choca con `map-empty-overlay` (`top: insets.top + 12`) cuando no hay posición; moverlo rompe #62 R3 y R7 de mobile-design-drift. Abajo agrupa identidad y datos (proximidad, Checklist de autocrítica) |
| b1 | Sitio de la batería | **Sustituye** al tile `stat-gps` en la rejilla 2×2. El estado de conexión **sube** a la píldora | Dirección de arte 5: no se pierde ningún dato (el estado se conserva con el mismo mapeo y gana punto y tono). La rejilla no crece y no tapa más mapa. Un quinto tile repetiría el estado dos veces o haría crecer la tarjeta (§3 de design.md) |
| b2 | Fuente de la batería | **Solo** `detail.data.pet.device.batteryPct`, igual que el tile `collar-battery` de la Home. `LastPosition.battery` y `selectedPet.device` **no** se leen | Backend: `devices.battery_pct` y `battery` de la posición cacheada salen del mismo mensaje (`positions-consumer.service.ts`). Es la misma lectura; una sola fuente evita que el mapa y la Home discrepen. El detalle se refresca con el poll de 15 s |
| b3 | Formato y umbral | `${batteryPct}%` (entero). `> 60` tono success; `≤ 60` tono warning; sin dato `'—'` tono muted | El umbral es el del Make (`pet.battery > 60`) y el de la Home |
| b4 | Tinta del valor | `text-accent-strong` (success), `text-warning-strong` (warning), `text-muted` (muted), vía `STATUS_TONE_CLASSES[tono].text`. **Nunca** `text-success` | Contraste calculado sobre `bg-default` claro (#F5F6F8): `text-success` #0F9B5A ≈ 3,31:1, **falla AA**; `text-accent-strong` #107148 ≈ 5,59:1; `text-warning-strong` #92610A ≈ 4,94:1. Oscuro (#1F242B): accent-strong #2AB87C ≈ 6,19:1. #107148 es la tinta legible del #2AB87C del Make (carta §Decisiones fijas 11) |
| c | Movimiento | **Ninguna** animación nueva. El punto es estático | Puerta de frecuencia (skill animate-expo): el mapa se abre decenas de veces al día. El pulso de la Home se queda en la Home |
| d | Copy | `map.live` cambia de literal: `Live`/`En vivo` → `GPS active`/`GPS activo`. La etiqueta del tile usa la clave existente `pairing.battery`. **Cero claves nuevas** | Dirección de arte 6: donde el Make da la palabra en español («GPS activo», «Batería»), se usa la del Make. `map.live` solo lo consume el mapa (`MAP_CONNECTION_LABEL_KEY`), así que el cambio no se filtra a otra pantalla |
| e | Enmienda a #94 | Escrita ya en `specs/mobile-map-staleness-single-source/requirements.md` §Enmienda #116, con casilla humana propia | #94 R2, R3, R4, R6 y R7 hablan del «tile de conexión» y R6 exige el rótulo «Conexión»; esta feature los mueve |

### Medidas en la base `8f22c8d2` (anclas)

Medidas con `grep -c` por contenido sobre `mobile-pet-tracker/`:

| Ancla | Fichero | Base | Tras #116 |
|---|---|---|---|
| `style={CONTINUOUS_CORNER}` | `src/screens/map/index.tsx` | 4 | 4 |
| `style={TABULAR_NUMS}` | `src/screens/map/index.tsx` | 3 | 4 |
| `text-accent-strong` | `src/screens/map/index.tsx` | 2 | 2 (la tinta nueva llega importada) |
| `text-warning-strong` | `src/screens/map/index.tsx` | 0 | 0 (ídem) |
| `react-native-reanimated` | `src/screens/map/index.tsx` | 0 | 0 |
| `Animated` | `src/screens/map/index.tsx` | 0 | 0 |
| `stat-gps` | `src/screens/map/index.tsx` | 1 | 0 |
| `stat-gps` | `src/screens/map/index.test.tsx` | 17 | 0 |
| `pairing.connection` | `src/screens/map/index.tsx` | 1 | 0 |
| `pairing.battery` | `src/screens/map/index.tsx` | 0 | 1 |
| `En vivo` | `src/screens/map/index.test.tsx` | 7 | 0 |
| `STATUS_TONE_CLASSES` | `src/components/pet-hero-header.tsx` | 2 | 2 (solo gana `export`) |
| hex / clases `[...]` / `StyleSheet.create` | `src/screens/map/index.tsx` | 0 / 0 / 0 | 0 / 0 / 0 |

## Requisitos

Convenciones de todos los R:

- Suite: `src/screens/map/index.test.tsx` (se **extiende**, no se crea otra).
  Idioma del wrapper: `es` (`MapWrapper` ya monta `LanguageProvider initial="es"`).
- Fixtures: `makePet`, `makeDevice`, `makeLastPosition` sin cambiar su firma. Un
  collar con batería se construye `{ ...makeDevice('online'), batteryPct: N }`.
- Un `describe` por R con el título exacto que da cada R; los `it` con el título
  exacto de la columna «Test».
- Toda espera es sobre el árbol renderizado (`docs/conventions.md` §Esperas),
  nunca sobre el contador de un mock.
- «Hijo» = `node.children[i]` de RNTL 14 con un helper local `elementChild`
  como el de `src/components/__tests__/pet-hero-header.test.tsx`. Medido en un
  spike fuera del árbol: `PetAvatar` monta **un** solo nodo host que lleva su
  `testID` (`RNSVGSvgView` sin foto, `ViewManagerAdapter_ExpoImage` con foto).

### R1 — El estado activo usa la palabra del Make

WHEN el catálogo resuelve `map.live`, THE SYSTEM SHALL devolver `GPS active` en
`en` y `GPS activo` en `es`, AND la fila de `map.live` de
`specs/mobile-ui-language/design.md` SHALL decir
`| 198 | \`map.live\` | \`GPS active\` | \`GPS activo\` ← literal cambiado por #116 (R1); antes \`Live\` / \`En vivo\` |`.

Literales visibles de la feature (EN / ES), todos del catálogo:

| Clave | EN | ES | Cambio |
|---|---|---|---|
| `map.live` | `GPS active` | `GPS activo` | **literal cambiado** (antes `Live` / `En vivo`) |
| `map.stale` | `Stale` | `Desactualizado` | sin cambio |
| `map.noSignal` | `No signal` | `Sin señal` | sin cambio |
| `pairing.battery` | `Battery` | `Batería` | sin cambio (uso nuevo en el mapa) |

Fuera del catálogo: el guion `'—'` (literal que el mapa ya usa) y el formato
`${batteryPct}%`.

Candados que esta R mueve: de las 7 apariciones de `En vivo` en
`src/screens/map/index.test.tsx`, las 6 aserciones `toHaveTextContent('En vivo')`
pasan a `'GPS activo'`; la séptima es un título de `it` y la renombra R9. `src/utils/device-connectivity.test.ts`
asevera nombres de clave, no literales: **no se toca**. Catálogo sin claves
nuevas: `src/providers/__tests__/language-provider.test.tsx` **no se toca**
(delta 0).

Test: `src/screens/map/index.test.tsx` › `#116 R1: el estado activo usa la palabra del Make` › `resuelve map.live a GPS active y GPS activo y lo registra en la tabla de copy`
(importa `en` y `es` de `src/i18n/catalog.ts`; lee
`../specs/mobile-ui-language/design.md` desde `process.cwd()` y casa
`/\| 198 \| `map\.live` \| `GPS active` \| `GPS activo`[^\n]*← literal cambiado por #116 \(R1\)/`).

### R2 — La píldora existe encima de la tarjeta de stats

WHILE la lista de mascotas es `ok`, `selectedPet` está definido y la última
posición es `ok`, THE SYSTEM SHALL pintar `View testID="map-pet-pill"` como hijo
0 de `map-stats`, con la tarjeta de stats (el `Card` que contiene `stat-speed`)
como hijo 1, AND su `className` SHALL ser exactamente
`flex-row items-center gap-2 self-start rounded-full border border-border bg-surface px-3 py-2 shadow-sm`
sin prop `style` (cápsula: sin `CONTINUOUS_CORNER`, escala de radios §12).

IF `selectedPet` es `undefined` (la selección no está en la lista y aún no se ha
reemplazado), THEN THE SYSTEM SHALL no pintar `map-pet-pill` y SHALL seguir
pintando `map-stats` con sus cuatro tiles.

| Test (`#116 R2: la píldora existe encima de la tarjeta de stats` › …) | Asevera |
|---|---|
| `pinta la píldora como hijo 0 de map-stats y la tarjeta como hijo 1` | `elementChild(map-stats, 0).props.testID === 'map-pet-pill'`; `within(elementChild(map-stats, 1)).getByTestId('stat-speed')` |
| `compone la cápsula con la receta exacta y sin esquina continua` | `className` exacto de arriba; `props.style` `undefined` |
| `no pinta la píldora mientras la selección no está en la lista` | con `useIsFocused` → `false` (la selección no se reemplaza) e `initialSelectedPetId = 'removed-pet'`: espera `stat-speed` visible; entonces `queryByTestId('map-pet-pill')` es `null` |

Mock: el `jest.mock('expo-router')` de la suite pasa `useIsFocused` a leer una
variable `mockIsFocused` (`true` por defecto, restaurada en el `beforeEach`
global). Ningún otro `it` cambia de conducta.

### R3 — La píldora muestra avatar y nombre de la mascota seleccionada

WHILE se pinta `map-pet-pill`, THE SYSTEM SHALL pintar como hijo 0 `PetAvatar`
con `testID="map-pet-pill-avatar"`, `size={24}`, `name`, `photoUrl` y
`cacheKey={selectedPet.id}` de `selectedPet`, AND como hijo 1
`Text testID="map-pet-pill-name"` con `className` exacto
`shrink text-xs font-bold text-foreground`, `numberOfLines={1}` y el nombre de
`selectedPet`.

| Test (`#116 R3: la píldora muestra avatar y nombre` › …) | Fixture | Asevera |
|---|---|---|
| `pinta el avatar de 24 sin foto` | lista `makePet()` (sin foto) | hijo 0 `testID` `map-pet-pill-avatar`; `props.width === 24`, `props.height === 24` |
| `pinta la foto de la lista con su cacheKey` | lista `makePet({ photoUrl: 'https://cdn.example/luna.jpg' })`, detalle `makePet({ photoUrl: null, device: makeDevice('online') })` | `props.source` igual a `[{ uri: 'https://cdn.example/luna.jpg', cacheKey: 'pet-1' }]`; `props.style` igual a `{ width: 24, height: 24, borderRadius: 12 }` |
| `rotula el nombre de la lista en una línea` | lista `makePet({ name: 'Luna' })`, detalle `makePet({ name: 'Nala', device: makeDevice('online') })` | hijo 1 `testID` `map-pet-pill-name`, texto `Luna`, `className` exacto, `numberOfLines === 1`; espera antes a que `map-pet-pill-status` diga `GPS activo` (el detalle ya llegó) |

### R4 — La píldora muestra el estado del GPS con punto y tinta

WHILE se pinta `map-pet-pill`, THE SYSTEM SHALL pintar exactamente 4 hijos en
este orden: avatar (R3), nombre (R3), `View testID="map-pet-pill-dot"` y
`Text testID="map-pet-pill-status"`, AND el punto, el estado y el nombre
accesible de la píldora SHALL seguir esta tabla:

| Caso | Detalle | Texto de `map-pet-pill-status` | `className` del punto | `className` del estado | `accessibilityLabel` de `map-pet-pill` |
|---|---|---|---|---|---|
| online | `ok`, `makeDevice('online')` | `GPS activo` | `size-2 rounded-full bg-success` | `text-2xs font-semibold text-accent-strong` | `Luna, GPS activo` |
| offline | `ok`, `makeDevice('offline')` | `Desactualizado` | `size-2 rounded-full bg-warning-strong` | `text-2xs font-semibold text-warning-strong` | `Luna, Desactualizado` |
| unknown | `ok`, `makeDevice('mystery')` | `Sin señal` | `size-2 rounded-full bg-muted` | `text-2xs font-semibold text-muted` | `Luna, Sin señal` |
| sin collar | `ok`, `device: null` | `Sin señal` | `size-2 rounded-full bg-muted` | `text-2xs font-semibold text-muted` | `Luna, Sin señal` |
| detalle pendiente | `pending<PetState>()` | `—` | `size-2 rounded-full bg-muted` | `text-2xs font-semibold text-muted` | `Luna, —` |
| detalle con error | `{ kind: 'error' }` | `—` | `size-2 rounded-full bg-muted` | `text-2xs font-semibold text-muted` | `Luna, —` |

AND `map-pet-pill` SHALL llevar `accessible` a `true`; `map-pet-pill-status`
SHALL llevar `numberOfLines={1}` y **ninguna** prop `style` (no es contador:
sin `TABULAR_NUMS`).

| Test (`#116 R4: la píldora muestra el estado del GPS` › …) | Asevera |
|---|---|
| `it.each` de las 6 filas: `%s: rotula su estado con su punto y su tinta` | texto, las dos `className` exactas y el `accessibilityLabel` de la fila. Esperas: online/offline/unknown/sin collar esperan a que `map-pet-pill-status` tenga el texto de la fila; pendiente espera `stat-speed` visible; error espera `stat-speed` visible y luego `map-pet-pill-status` con `—` (patrón de `#94 R3` › `muestra el guion cuando el detalle falla`) |
| `fija cuatro hijos en orden: avatar, nombre, punto, estado` | detalle `ok` con `makeDevice('online')`; espera a que `map-pet-pill-status` diga `GPS activo` y después: `children.length === 4`; `testID` de los hijos 0..3 = `map-pet-pill-avatar`, `map-pet-pill-name`, `map-pet-pill-dot`, `map-pet-pill-status` |
| `agrupa la píldora para el lector de pantalla y deja el estado en una línea sin cifras tabulares` | misma fixture y misma espera; después: `accessible === true`; `numberOfLines === 1`; `props.style` de `map-pet-pill-status` `undefined` |

Candados que esta R mueve: las aserciones de estado de conexión que hoy leen
`getByTestId('stat-gps')` pasan a `getByTestId('map-pet-pill-status')` con el
mismo texto (ya migrado por R1). Lista cerrada, por título:
`R8: stats calculadas de positions y trips` › `uses the latest speed, trip total, fresh age, and live GPS`,
`#94 R2: la antigüedad de la posición ya no mueve el tile de conexión`,
`#94 R2: sin collar el tile de conexión dice Sin señal`;
todo `#94 R2: el tile de conexión sigue al collar`;
todo `#94 R3: sin detalle el tile de conexión cae al guion`;
`#94 R4: la antigüedad y la conexión son datos independientes`;
`#94 R7: el poll refresca también el detalle`.

### R5 — La batería sustituye al tile de conexión en la rejilla

WHILE se pinta `map-stats`, THE SYSTEM SHALL repartir los tiles en dos filas
`flex-row gap-2`: `['stat-speed', 'stat-distance']` y
`['stat-updated', 'stat-battery']`, AND el tile de batería SHALL ser el mismo
`View className="flex-1 items-center rounded-xl bg-default p-3"
style={CONTINUOUS_CORNER}` con exactamente 2 hijos: hijo 0
`Text testID="stat-battery"` con `numberOfLines={1}` y `style={TABULAR_NUMS}`,
hijo 1 el rótulo `t('pairing.battery')` («Batería») con `className` exacto
`mt-1 text-2xs font-normal text-muted`.

AND THE SYSTEM SHALL no pintar `stat-gps` ni los textos `Conexión` o `GPS` en
el mapa.

| Test | Asevera |
|---|---|
| `#116 R5: la batería sustituye al tile de conexión` › `monta el tile de batería con valor y rótulo en ese orden` | desde `stat-battery` sube por `parent` hasta el nodo cuyo `className` es el del tile (mismo mecanismo que `statRow`); `children.length === 2`; hijo 0 `testID` `stat-battery`; hijo 1 texto `Batería` y `className` exacto |
| `#116 R5: …` › `retira stat-gps del mapa` | `queryByTestId('stat-gps')` `null` tras ver `stat-battery` |
| `#61 R11` (migrado) › `it.each` `%s se queda en una sola línea` | la lista pasa a `['stat-speed', 'stat-distance', 'stat-updated', 'stat-battery']` |
| `#61 R11` (migrado) › `reparte los tiles en dos filas de dos y no en una fila de cuatro` | segunda fila `['stat-updated', 'stat-battery']` |
| `#61 R11` (migrado) › `conserva los cuatro tiles, su orden de lectura y el overlay absoluto` | `stat-battery` visible en lugar de `stat-gps`; `getByText('Batería')` en lugar de `getByText('Conexión')` |
| `#62 R15` (migrado) › `estabiliza los valores numéricos sin tratar GPS como contador` | `stat-battery` con `fontVariant: ['tabular-nums']`; `map-pet-pill-status` sin él (sustituye a la aserción sobre `stat-gps`) |
| `#94 R6` (invertido, retitulado en R9) | espera `stat-speed` visible (la espera original, sobre `Conexión`, ya no vale); después, en este orden: `queryByText('Conexión')` `null`, `queryByText('GPS')` `null` y `getByText('Batería')` visible (con las ausencias primero, su rojo cae por aserción) |

Candados que esta R mueve (deltas, R10): `#62 R15 counters` del mapa `3 + 1`;
`R4_MAP` cambia la fila `pairing.connection` por `pairing.battery`.

### R6 — La batería se lee con formato entero y tinta por umbral

WHEN el detalle es `ok` y `device.batteryPct` es un entero `n`, THE SYSTEM SHALL
pintar en `stat-battery` el texto `${n}%` con `className` exacto
`text-base font-black text-accent-strong` si `n > 60`, y
`text-base font-black text-warning-strong` si `n ≤ 60`.

| Test (`#116 R6: la batería se lee con formato entero y tinta por umbral` › `it.each` `%i se lee %s con %s`) | `batteryPct` | Texto | `className` |
|---|---|---|---|
| fila 1 | 100 | `100%` | `text-base font-black text-accent-strong` |
| fila 2 | 82 | `82%` | `text-base font-black text-accent-strong` |
| fila 3 | 61 | `61%` | `text-base font-black text-accent-strong` |
| fila 4 | 60 | `60%` | `text-base font-black text-warning-strong` |
| fila 5 | 15 | `15%` | `text-base font-black text-warning-strong` |
| fila 6 | 0 | `0%` | `text-base font-black text-warning-strong` |

Cada fila: detalle `ok` con `makePet({ device: { ...makeDevice('online'), batteryPct: n } })`,
espera a que `stat-battery` tenga el texto de la fila. La fila 6 caza la
comprobación por falsedad (`batteryPct ? … : '—'` pinta `—` con 0).

### R7 — Sin dato de batería el tile cae al guion, y la fuente es solo el detalle

IF el detalle no es `ok`, o `device` es `null`, o `device.batteryPct` es `null`,
THEN THE SYSTEM SHALL pintar `—` en `stat-battery` con `className` exacto
`text-base font-black text-muted`. THE SYSTEM SHALL leer la batería solo de
`detail.data.pet.device.batteryPct`, AND WHEN el poll de 15 s trae un detalle
nuevo THE SYSTEM SHALL repintar `stat-battery` con el valor nuevo.

| Test (`#116 R7: la batería cae al guion y solo la lee el detalle` › …) | Fixture | Asevera |
|---|---|---|
| `muestra el guion mientras el detalle está pendiente` | `mockGetPet` → `pending<PetState>()` | espera `stat-speed` visible; `stat-battery` `—`, `className` muted |
| `muestra el guion cuando el detalle falla` | `mockGetPet` → `{ kind: 'error' }` | espera `stat-speed` visible y `stat-battery` con `—`; `className` muted |
| `muestra el guion sin collar` | detalle `makePet({ device: null })` | espera `map-pet-pill-status` `Sin señal`; `stat-battery` `—`, muted |
| `ignora la batería de la última posición cuando el collar no la trae` | detalle `makeDevice('online')` (`batteryPct: null`); posición `makeLastPosition({ battery: 82 })` | espera `map-pet-pill-status` `GPS activo`; `stat-battery` `—` (no `82%`), muted |
| `lee la batería del detalle y no de la lista` | lista `makePet({ device: { ...makeDevice('online'), batteryPct: 10 } })`; detalle `makePet({ device: { ...makeDevice('online'), batteryPct: 82 } })` | espera `stat-battery` `82%`; `className` accent-strong |
| `repinta la batería con el poll de 15 segundos` | detalle `82` la primera vez y `40` después (`mockResolvedValueOnce` + `mockResolvedValue`); mecanismo de timers de `#94 R7` › `actualiza el badge con el mismo intervalo de 15 segundos` | espera `82%`; avanza 15 000 ms; espera `40%` con `className` warning-strong |

### R8 — El mapa no estrena animación

THE SYSTEM SHALL dejar `src/screens/map/index.tsx` sin `react-native-reanimated`
y sin el identificador `Animated` (base medida: 0 y 0). El punto de la píldora
es un `View` estático.

Test: `src/screens/map/index.test.tsx` › `#116 R8: el mapa no estrena animación` › `no importa Reanimated ni anima el punto`
(lee el fuente con `readFileSync`; `not.toContain('react-native-reanimated')` y
`not.toMatch(/\bAnimated\b/)`). Nace verde: exige sonda (tasks.md).

### R9 — Las pruebas de #94 que cambian de sentido se retitulan; el resto conserva el título

THE SYSTEM SHALL retitular solo estos dos bloques, porque su aserción cambia de
sentido o su título cita un literal que ya no existe:

| Hoy | Tras #116 |
|---|---|
| `describe('#94 R6: el tile de conexión se rotula como en Pairing')` › `it('muestra Conexión y retira GPS')` | `describe('#94 R6 (enmienda #116): el mapa ya no rotula la conexión')` › `it('retira Conexión y GPS y rotula Batería')` |
| `#94 R2: el tile de conexión sigue al collar` › `it('muestra En vivo aunque después falte la posición')` | mismo `describe` › `it('muestra GPS activo aunque después falte la posición')` |

Los demás títulos que dicen «tile de conexión» **no se tocan**: sus specs y
trazabilidades históricas los citan literalmente (#94, mobile-flaky-waits). La
§Enmienda #116 de #94 fija que, desde #116, «tile de conexión» en esos títulos
designa `map-pet-pill-status`.

Verificación (reviewer):
`grep -c "muestra Conexión y retira GPS\|muestra En vivo aunque" mobile-pet-tracker/src/screens/map/index.test.tsx` = 0, y
`specs/mobile-map-staleness-single-source/requirements.md` contiene
`## Enmienda #116` con su casilla **marcada por el humano** antes del merge.

### R10 — Los candados globales se mueven como deltas

THE SYSTEM SHALL mover exactamente estos candados, escritos como delta sobre la
expresión que haya en la base del rebase, nunca como absoluto recalculado:

| Fichero | Ancla (grep) | Cambio |
|---|---|---|
| `src/__tests__/consistency-classnames.test.ts` | fila del mapa en `const counters` de `#62 R15` | `[join('screens', 'map', 'index.tsx'), 3]` → `[join('screens', 'map', 'index.tsx'), 3 + 1], // #116 R5` |
| `src/__tests__/consistency-classnames.test.ts` | `it('#69 R10: mantiene la base cerrada más los deltas medidos'` | se añade `+ 1` al final de la suma y `#116 R5` al comentario |
| `src/__tests__/ui-copy-table.ts` | `{ file: 'src/screens/map/index.tsx', key: 'pairing.connection' },` dentro de `R4_MAP` | pasa a `{ file: 'src/screens/map/index.tsx', key: 'pairing.battery' }, // #116 R5: sustituye a pairing.connection` (misma posición; `R4_MAP` sigue en 17) |

Y THE SYSTEM SHALL dejar intactos, con el valor medido en la base, estos
candados (anclas negativas):

| Fichero | Candado | Valor que no cambia |
|---|---|---|
| `src/__tests__/legibility-classnames.test.ts` | `#61 R4 inkSites`: mapa 2, `pet-hero-header.tsx` 1, suma `13 + 1 + 1` | sin cambios (las tintas nuevas llegan por import) |
| `src/__tests__/legibility-classnames.test.ts` | `#61 R5`: `text-warning` suelto | 0 ficheros |
| `src/__tests__/consistency-classnames.test.ts` | `#62 R14 directUses`: mapa 4 y suma `33 + 1 + 1 - 1 - 1 + 1` | sin cambios (la cápsula no lleva `CONTINUOUS_CORNER`) |
| `src/__tests__/ui-language.test.ts` | `expect(R4_MAP).toHaveLength(17)`, `SCREEN_FILES` | sin cambios |
| `src/providers/__tests__/language-provider.test.tsx` | longitud del catálogo | sin cambios (cero claves) |

#117 y #118 están en vuelo sobre otros worktrees. Quien mergee segundo rebasea y
**recuenta**: aplica su delta sobre la expresión que encuentre, no sobre la
citada aquí.

Test: los propios ficheros de la tabla, verdes en la corrida de R11.

### R11 — Alcance cerrado: cero dependencias, cero backend, grep-clean

THE SYSTEM SHALL cumplir, medido por el reviewer desde la raíz del repo:

- `git diff origin/main -- mobile-pet-tracker/package.json mobile-pet-tracker/bun.lock` vacío.
- `git diff --stat origin/main -- backend-pet-tracker/` vacío.
- `git diff --name-only <HEAD del handoff>` ⊆ la lista cerrada de `design.md` §1.2
  (contra el HEAD del handoff, no contra `origin/main`: la spec, la enmienda de
  #94 y `feature_list.json` los commitea el leader antes del handoff).
  Lectura aprobada por el humano el 2026-10-05, en el chat del leader («sí,
  excluye esos 3 ficheros en R11»): se excluyen los ficheros que solo tocan
  los commits del leader posteriores al handoff (`e3a47e38`, `6ccb9ca9`,
  `1bd3159d`), es decir `specs/mobile-map-gps-pill-battery/tasks.md`,
  `progress/handoff_mobile-map-gps-pill-battery.md` y `progress/current.md`.
  Con esa exclusión el diff da exactamente los 9 ficheros de §1.2 (reviewer,
  `progress/review_mobile-map-gps-pill-battery.md` §R11, obs. 1).
- `git diff origin/main -- mobile-pet-tracker/src/components/pet-hero-header.tsx`
  cambia exactamente una línea: `const STATUS_TONE_CLASSES: Record<` →
  `export const STATUS_TONE_CLASSES: Record<`.
- En `mobile-pet-tracker/src/screens/map/index.tsx`: 0 hex, 0 clases
  arbitrarias `[...]`, 0 `StyleSheet.create` (carta §Decisiones fijas 3).
- Desde `mobile-pet-tracker/`: `bun run typecheck`, `bun run lint` y
  `bunx jest` enteros con exit 0, medidos **sin pipe**
  (`> fichero 2>&1; echo "exit=$?"`).

### R12 — Gate humano: smoke en dev build de Android

WHEN la suite está verde, THE SYSTEM SHALL pasar este smoke en el **dev build
de Android** (nunca Expo Go: `expo-maps` no existe ahí). Cada casilla la marca
**solo el humano**:

- [ ] S1. Con un collar en línea, el mapa muestra la píldora encima de la
  tarjeta de stats: avatar, nombre, punto verde y «GPS activo». No tapa la
  barra de pestañas ni el botón de Modo perdido.
- [ ] S2. El tile «Batería» muestra `NN%` (anotar el valor) en verde si
  supera 60 y en ámbar si no; coincide con el tile de batería de la Home.
- [ ] S3. Tema oscuro: la píldora y el tile se leen bien sobre el mapa oscuro.
- [ ] S4. Idioma inglés: «GPS active» y «Battery».
- [ ] S5. Con una mascota sin posiciones, el aviso de arriba
  (`map-empty-overlay`) y la píldora de abajo no se solapan.
- [ ] S6. Si se puede provocar (collar apagado o mascota sin collar): la
  píldora pasa a «Desactualizado» en ámbar o «Sin señal» en gris, y la batería
  a `—` sin collar. Si no se puede provocar, anotarlo aquí.

## Fuera de alcance

Clasificado viñeta a viñeta, con la premisa verificada en la base:

| Viñeta | Clase | Premisa verificada |
|---|---|---|
| Dirección literal («Ubicación actual» del Make) | feature aparte | Necesita geocodificación inversa: `expo-location` **no** está en `package.json` y esta feature prohíbe dependencias. Que sea «de pago» no está verificado (la geocodificación del dispositivo no cobra); lo verificado es la dependencia nueva y el permiso |
| Botón Compartir del Make | feature aparte | La premisa «necesita backend» es **falsa** para compartir coordenadas (`Share` está en el core de `react-native`, sin dependencia). Sí la necesitaría un enlace de seguimiento en vivo. Fuera porque no está en los criterios de #116 |
| Botón Recorrido del Make | feature aparte | Premisa «necesita backend» **no verificada**: el día ya llega (`getDayRoute`) y el mapa ya pinta su polilínea; un histórico de días sería otra pantalla |
| Celda «Recorrido» de la rejilla del Make | delimitación | Ya cubierta por `stat-distance` (suma de los viajes del día) |
| Celda «Tiempo activo» de la rejilla del Make | delimitación | El dato existe (`DayEntry.activeMinutes`) y ya lo muestra la Home; meterlo aquí sería una quinta celda, descartada en b1 |
| Pulso del punto de la píldora | delimitación | Decisión c; el pulso de la Home (`STATUS_DOT_PULSE`) no se toca |
| `collar-battery` de la Home pinta `> 60` con `text-success` (≈ 3,31:1 sobre `bg-default` claro, falla AA) | observación para el leader | Verificado en `src/screens/home/index.tsx` (`'font-semibold text-success'`). No se arregla aquí: es otra pantalla y otro candado |
| Fondo blanco al 95 % de la píldora del Make | delimitación | Se usa `bg-surface` opaco, la receta de `Card` |

## Preguntas

Ninguna decisión queda abierta. El gate puede vetar, y entonces la spec se
enmienda antes del handoff:

1. La posición (a4): abajo, encima de la tarjeta, en vez de arriba a la izquierda.
2. El literal (d): `En vivo` → `GPS activo` también para el estado que antes
   decía «En vivo».
3. La sustitución (b1): el tile `Conexión` desaparece y su dato vive en la píldora.

## Aprobación

- [x] Spec aprobada por humano (fecha: 2026-10-04) ← gate obligatorio antes de implementar
