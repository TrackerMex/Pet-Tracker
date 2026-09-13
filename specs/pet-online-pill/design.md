---
feature: "pet-online-pill"
status: draft        # draft | approved
tags: [harness, spec]
---

# Diseño — [[pet-online-pill]]

> Ver [[requirements]] para los requisitos que este diseño implementa y
> [[../../docs/architecture|architecture]] para las reglas de capas del proyecto.
> Sin código de aplicación: solo decisiones, rutas y por qués. Las citas
> `ruta:línea` son del commit padre `072cff40`.

## Decisiones técnicas

### D1 — La verdad es `last_message_at` leído contra el reloj del servidor; el pestillo se borra (G1 = A2) — sirve a R1-R4

El repo ya decidió dos veces en esta dirección: #8 dejó `'offline'` fuera
"porque la frescura la deriva #9 con `staleSeconds`"
(`specs/wialon-ingestion-pipeline/requirements.md:312-313`) y #9 D5 calcula
`staleSeconds` contra el reloj del servidor con `now` inyectado
(`specs/positions-api/requirements.md:254-262`, `stale-seconds.ts:9-11`). #73
aplica el mismo principio al collar: una función pura sobre
`devices.last_message_at` (que el store ya mantiene con guard "solo si más
reciente", `ingestion.drizzle.store.ts:102-108`) y `now`.

Consecuencias que se aceptan por escrito:

- **Sin scheduler, sin env, sin migración.** A2 no añade ningún worker ni
  ninguna variable (`docs/conventions.md:205-247` exige fila por env nueva; no
  hay ninguna). La columna `connectivity` se queda como está en el schema —
  nullable, `varchar(20)`, `devices.schema.ts:38` — y siempre NULL.
- **El write de `:97` se borra, no se deja como caché.** Dejarlo (A1) mantiene
  dos fuentes de verdad que nadie lee y no cumple el criterio 1 literal ("el
  pestillo … queda arreglado y con test"). Borrarlo hace que
  `test/ingestion.e2e-spec.ts:218` cambie de `toBe('online')` a `toBeNull()`,
  que es exactamente el test que cubre el criterio 1.
- **Semántica del contrato (G12 del informe)**: `connectivity` deja de ser
  passthrough y pasa a estado derivado con el **mismo nombre y la misma forma**
  (`string | null`, 5 claves). Los candados de claves del repo
  (`devices.e2e-spec.ts:274-280`, `device-subscriptions.e2e-spec.ts:354-356`,
  `pets.e2e-spec.ts:64-89`, `pet-profile-response.mapper.spec.ts:35-82`) siguen
  verdes sin tocarlos. El único test que aseveraba un valor passthrough
  (`device-status.mapper.spec.ts:8-17`, `'lte'`) se reescribe (R2).
- **N+0**: el detalle sigue haciendo una consulta por mascota como hoy
  (`pet-device.drizzle.reader.ts:20-26`); derivar en el mapper no añade I/O.
  `ponytail:` techo asumido — si el listado necesita el estado por mascota,
  entra `findActiveDevices(petIds)` de OD-3 (#66), no esta feature.

### D2 — Dónde vive la función pura: `modules/devices/domain/connectivity.ts`; el mapper recibe `now` — sirve a R1, R2

- **Capa**: es una regla de negocio del collar ("cuándo un collar está en
  línea"), así que va a `domain` del módulo `devices`, junto a la entidad
  (`docs/architecture.md:18-22`: `domain` sin framework/ORM). Precedente exacto:
  `modules/positions/domain/stale-seconds.ts` con su spec al lado.
- **Import del umbral**: `@/pipeline/constants` es "núcleo puro: sin imports"
  (`constants.ts:3`; `docs/architecture.md:104`: "la lógica vive en funciones
  puras (`src/pipeline/`)"). Un módulo de dominio importando una constante pura
  no viola la regla de dependencia (no es framework, ORM ni infraestructura).
  Alternativa descartada: poner la constante en `devices/domain` — rompería la
  regla del repo "umbrales como constantes nombradas en `src/pipeline/constants.ts`,
  fuente única" (`constants.ts:1-3`, informe §4).
- **Quién deriva**: el mapper `toDeviceStatusResponse` (infraestructura de
  `devices`, `device-status.mapper.ts:24-36`) es el **único** punto por el que
  salen las tres rutas; recibe `now: Date` y llama a `deriveConnectivity`.
  Infraestructura importando dominio del mismo módulo: permitido. El cruce de
  módulos `pets.controller.ts:16` → mapper de `devices` **ya existe**; no se
  añade ninguno.
- **`DeviceStatusSource` pierde `connectivity`** (R2): la forma más barata de
  que el passthrough no vuelva por accidente es que el tipo de entrada no lo
  tenga (TS2339 al restaurarlo). `ActivePetDeviceStatus`, el reader y la entidad
  `Device` conservan la propiedad: siguen leyendo una columna que existe, y
  quitarla de ahí es parte de la migración futura, no de esta feature. TypeScript
  admite pasar un objeto con propiedades de más cuando no es un literal.
- **Por qué no derivar en el use case o en el reader**: habría que hacerlo en
  tres sitios (`get-pet.use-case.ts:73`, `get-pet-device.use-case.ts`,
  `claim-device.use-case.ts`) o cambiar el puerto `PetDeviceReader`; el mapper
  ya es el embudo único (#7 R12: "mismo mapper de estado de device que el claim
  y GET .../device").
- **`specs/devices-claim/requirements.md:153` (R11)** no se edita: "los tres del
  medio son `null` hasta que #8 los alimente" sigue siendo literalmente cierto
  para un collar recién reclamado (sin `lastMessageAt` ⇒ `null` derivado).

### D3 — Umbral 300 s, inclusivo, `ts > now` ⇒ online (G2) — sirve a R1

- **Restricción dura** (informe §3, §9 G2): cadencia supuesta 30 s
  (`fake-wialon.client.ts:13-14`) + poller 60 s + consumer 15 s
  (`ingestion-scheduler.service.ts:9-10`) = **105 s** de latencia peor caso en
  régimen. Cualquier umbral por debajo hace parpadear a un collar sano.
- **300 s**: ≈ 4 ciclos de poller de margen sobre el retardo de Wialon;
  coincide con `plans/007-geocercas-alertas-push.md:115` ("Scheduler cada 5 min
  sobre `last_message_at`" para `device_offline`) y es simétrico con
  `FUTURE_TS_TOLERANCE_MS = 5 * 60_000` (`constants.ts:16`): la misma
  tolerancia hacia el pasado que hacia el futuro.
- **120 s** (alternativa del humano): coherente con `map.tsx:76` y #9 R6, pero
  deja **15 s** de margen sobre los 105 s: sensible al retardo de Wialon y al
  solape de ticks del poller (`poller.service.ts:37-42` salta ticks solapados).
- **Unidad**: milisegundos, como `FUTURE_TS_TOLERANCE_MS` y como las cadencias
  (`POLLER_INTERVAL_MS`). Sufijo `_MS` en el nombre.
- **Límite inclusivo** (`≤`): el umbral es la tolerancia máxima; el instante
  igual al umbral la respeta. Es una decisión de borde sin efecto práctico
  (probabilidad de igualdad al milisegundo ≈ 0) que se fija para que el test 4
  de R1 tenga una respuesta.
- **`ts > now` ⇒ online**: el pipeline admite hasta 5 min de adelanto
  (`validate-positions.ts:43`); tratarlo como "offline" sería absurdo. Con
  `now − ts` negativo la comparación `≤` ya lo resuelve sin `Math.max`.
- **Revisión**: si la cadencia pasa a adaptativa (`plans/012:232`,
  `docs/brief.md:554`, feature futura `device-settings`), el comentario de la
  constante lo dice y el `it` 1 de R1 obliga a cambiarlo a propósito.

### D4 — El mapa no se toca (G4) — sirve a R10

`map.tsx:76` (`STALE_SECONDS = 120`) decide "En vivo"/"Desactualizado" sobre
`staleSeconds` de `positions/last`, es decir, sobre la **posición**. La píldora
decide sobre el **collar** (`device.lastMessageAt`). En régimen coinciden; con
el poller parado divergen entre los 120 s y los 300 s, y el smoke (R11 paso 5)
lo declara esperado. Alinear números o hacer que el mapa consuma el estado
derivado tocaría `map.tsx` + `map.test.tsx:582-585` y es feature aparte.

### D5 — Cuatro estados, un helper, dos claves de copy (G5) — sirve a R5-R7

- **Estados** (`DeviceConnectionState`): `none` / `unknown` / `offline` /
  `online`. Mapeo natural del modelo (informe §6): sin fila activa en
  `pet_devices` → `device: null` → `none`; fila activa con `last_message_at`
  NULL → `connectivity: null` → `unknown`; el resto lo decide el backend.
- **Un solo helper**: `deviceConnectionState(device)` en
  `src/utils/device-connectivity.ts`, el fichero que #68 R16 ya designó como
  "único sitio" de la conectividad (carta `docs/ui-guidelines.md:284-285`,
  candado `design-drift.test.ts:331-355` que **no se edita**). La Home lo
  consume para `collar-status` **y** para la píldora; Pairing sigue con
  `connectivityLabelKey` (semántica propia: `null` → '—') ampliado con `offline`.
- **Mapa de la Home con forma `labelKey:`**: `checkUses`
  (`ui-language.test.ts:49-55`) solo cuenta `t('k')` y `labelKey: 'k'`. Un
  `Record<DeviceConnectionState, { labelKey, tone }>` en `home/index.tsx`
  mantiene las tres filas existentes de `R3_HOME` (`ui-copy-table.ts:53-55`)
  contando 1 y añade una (`home.unknown`). Alternativa descartada: mover el mapa
  a `device-connectivity.ts` — obligaría a cambiar el `file` de tres filas de la
  tabla y a decidir en qué bloque (R3 o R10) viven; más deltas para lo mismo.
- **Copy**: `Esperando señal` / `Awaiting signal` para `unknown` (clave nueva
  `home.unknown`). `Desconocida` (`deviceConnectivity.unknown`) no vale suelto
  ([[requirements]] §0.2 C3). Pairing gana `deviceConnectivity.offline` =
  `Sin conexión` / `Offline` porque hoy pintaría "Desconocida" a un collar
  desconectado (`device-connectivity.ts:10-22`). Los valores duplicados entre
  claves (`home.offline` y `deviceConnectivity.offline`) ya tienen precedente
  (`home.online` / `deviceConnectivity.online`).
- **`DeviceStatus.connectivity` sigue `string | null`** (`api/types.ts:47`):
  estrecharlo rompe el typecheck de las fixtures `'LTE'` de Pairing
  (`pairing/index.test.tsx:104`, `device-connectivity.test.ts:11`) sin ganar
  conducta.

### D6 — La píldora entra por prop `status` del hero, encima del nombre, nunca en el slot (G6) — sirve a R8, R9

- **Prop formateada por el llamante**: misma regla que `highlight`
  (`pet-hero-header.tsx:34-35`, #67 R7): el hero no traduce ni decide estados;
  recibe `{ label, tone }`. D2 de #67 ("el hero no conoce a su contenido") se
  refiere al **slot** (`specs/mobile-pet-hero-header/design.md:366-373`), no a
  los datos de la banda inferior.
- **Sitio**: `pet-hero-caption`, columna izquierda (`:116-135`), primer hijo
  antes de `pet-hero-name`, como el Make (`App.tsx:356-360`: píldora con
  `mb-1.5` encima del `h1`). El `gap-1` de la columna ya separa los tres hijos.
  El slot está vetado por `index.test.tsx:152` (2 hijos) y el highlight es la
  columna derecha.
- **`self-start`**: la columna es `flex-1 gap-1` con `alignItems: stretch` por
  defecto; sin `self-start` la cápsula ocuparía todo el ancho.
- **Profile no pasa `status`**: el Make pinta ahí "Collar activo" (`App.tsx:672`),
  otro dato. `profile/index.tsx:252` no cambia; la prop es opcional.
- **Sin skeleton para la píldora** (`ponytail:` techo asumido): el hero no sabe
  si el llamante pasará `status` (Profile no lo hace); una cápsula fantasma en
  Profile es peor que ~20 px de reflow en Home al resolver el detalle, reflow
  que ya existe hoy con la columna `highlight` (aparece cuando `today` resuelve).
  Upgrade path: si el humano lo pide, `status: null` explícito como "reserva
  sitio" en Home y `undefined` en Profile.

### D7 — Anatomía y tokens de la píldora, con AA calculado (G7) — sirve a R8

Receta base ya en el repo: `reminders/index.tsx:298`
(`rounded-full bg-warning-soft px-2 py-0.5 text-2xs font-bold text-warning-strong`).
La píldora la adapta: `px-2.5` y punto+texto como el Make; `font-semibold`
(Make `:73`); `text-2xs` por la carta (`:64`, `design-drift.test.ts:94-100`).

**Tokens por tono.** La banda es `bg-background` opaco (`pet-hero-header.tsx:114`);
las superficies `*-soft` de heroui son `color-mix(in oklab, var(--X) 15%, transparent)`
(`node_modules/heroui-native/src/styles/theme.css:91,95`) compuestas sobre ella.
Valores de `src/theme/global.css:26-45` (light) y `:74-93` (dark). Contraste
WCAG calculado con el mismo método que `src/theme/__tests__/global-css.test.ts:331-420`
(mezcla en oklab; sRGB luminancia relativa):

| Tono | Superficie (compuesta light / dark) | Texto | Punto | Texto light | Texto dark | Punto light | Punto dark |
|---|---|---|---|---|---|---|---|
| success | `bg-success-soft` (`#E1F0E5` / `#162928`) | `text-accent-strong` (`#107148` / `#2AB87C`) | `bg-success` (`#0F9B5A` / `#34D399`) | **5,12** | **5,97** | **3,04** | **7,90** |
| warning | `bg-warning-soft` (`#FFF1E2` / `#2A2821`) | `text-warning-strong` (`#92610A` / `#FBBF24`) | `bg-warning-strong` | **4,81** | **8,83** | **4,81** | **8,83** |
| muted | `bg-default` (`#F5F6F8` / `#1F242B`) | `text-muted` (`#667085` / `#9CA3AF`) | `bg-muted` | **4,60** | **6,15** | **4,60** | **6,15** |

Umbrales: texto ≥ 4,5:1 (AA, 10 px), punto ≥ 3:1 (componente no textual,
WCAG 1.4.11). Descartados con número: `text-success` como tinta (**3,04** light,
falla AA); `bg-warning` como punto (**1,94** light, falla 3:1). `bg-success` como
punto pasa por 0,04: la alternativa `bg-accent-strong` (**5,12**) va en
§Aprobación G7a. El color nunca es el único portador: el texto cambia con el
estado (carta `:217-218`).

**Por qué no la paleta categórica** (`bg-category-green` + `text-category-green-strong`
tendría los mismos hex): `consistency-classnames.test.ts:388-437` fija que esas
clases solo se escriben en `utils/category-palette.ts`, y la carta las reserva
para recordatorios y documentos (`:205-218`).

**Candado que se mueve**: `text-accent-strong` en `pet-hero-header.tsx` suma
una ocurrencia a `legibility-classnames.test.ts:118-134` (`13 + 1 + 1`). Es la
tinta correcta según la carta (`:130-133`: "encima de otra cosa ⇒ `--accent-strong`").

**Sin animación**: `animate-pulse` del Make (`App.tsx:358`) queda fuera. La
carta exige Reanimated + `prefers-reduced-motion` para cualquier motion
(`:157-176`); una feature aparte puede añadir el pulso con esas dos condiciones.

**Accesibilidad**: `accessible` + `accessibilityLabel={status.label}` en el
contenedor: el lector anuncia un solo nodo con el texto del estado; sin rol
(`button`/`link` mentirían: no es tappable, así que no aplica el touch target
de 44 pt de C8).

### D8 — `View` + `Text` dentro de `pet-hero-header.tsx`; ni `Chip` de heroui ni componente nuevo (G7c) — sirve a R8

Escalera: (1) ¿existe ya algo? — `Chip` de heroui-native está instalado
(`node_modules/heroui-native/lib/module/components/chip/`, `1.0.8`) y la carta
lo lista como base (`docs/ui-guidelines.md:78-79`). Se **descarta** por tres
razones concretas:

1. **AA no garantizable**: `color="success"` pinta la tinta con `--success`
   (`#0F9B5A`), que da 3,04:1 como texto (D7). Forzar `text-accent-strong` vía
   `className` es pelear contra el componente.
2. **Semántica**: `ChipProps extends PressableProps` (`chip.types.d.ts`): un
   estado de solo lectura no debe ser un `Pressable`.
3. **Candados**: sus clases internas (`chip__root--variant-soft--color-success`)
   son opacas al grep-clean y a las aserciones de `props.className` que cierran
   cada decisión (Enmienda #70 de la carta).

(2) ¿fichero propio en `src/components/`? — no: dos `View` y un `Text` no
justifican fichero (carta `:75-77`: extracción a partir de 2 pantallas; solo
Home la usa). Vive dentro del hero, junto al `highlight`.

### D9 — Orden de implementación: backend antes que móvil, un lado por commit — sirve a [[tasks]]

El móvil no necesita reloj: consume `'online' | 'offline' | null` de la API.
Pero los tests móviles usan fixtures, así que el orden es por dependencia de
tipos y de candados, no de runtime: R5 (catálogo) → R6 (helper, necesita las
claves) → R7 (Home, necesita el helper) → R8 (hero, independiente) → R9 (Home
monta la píldora, necesita R7 y R8). Backend: R1 → R2 y R3 (test de R3 en rojo
antes del `feat` de R2) → R4. Cada commit corre la suite de su lado.

## Archivos afectados

### Backend (`backend-pet-tracker/`)

| Fichero | Capa | Qué cambia | R |
|---|---|---|---|
| `src/pipeline/constants.ts` | núcleo puro | `+ DEVICE_ONLINE_THRESHOLD_MS` tras `:16`, con el comentario literal | R1 |
| `src/modules/devices/domain/connectivity.ts` | domain (nuevo) | `deriveConnectivity`, `DerivedConnectivity` | R1 |
| `src/modules/devices/domain/connectivity.spec.ts` | test unit (nuevo) | 6 `it` | R1 |
| `src/modules/devices/infrastructure/mappers/device-status.mapper.ts` | infrastructure | firma con `now`; `DeviceStatusSource` sin `connectivity`; comentario `:1-6` | R2 |
| `src/modules/devices/infrastructure/mappers/device-status.mapper.spec.ts` | test unit | reescrito | R2 |
| `src/modules/pets/infrastructure/pets.controller.ts` | infrastructure | `:110` pasa `now` | R2 |
| `src/modules/pets/infrastructure/pets.controller.spec.ts` | test unit | `it` de `:212-234` reescrito + 2 `it` | R2 |
| `src/modules/devices/infrastructure/pet-device.controller.ts` | infrastructure | `:43` pasa `new Date()` | R2 |
| `src/modules/devices/infrastructure/devices.controller.ts` | infrastructure | `:41-43` pasa `new Date()` | R2 |
| `test/device-connectivity.e2e-spec.ts` | test e2e (nuevo) | 3 `it` | R3 |
| `src/workers/ingestion.drizzle.store.ts` | infrastructure (workers) | `:97` borrada | R4 |
| `src/workers/ingestion-store.ts` | puerto | docblock `:44-48` | R4 |
| `test/ingestion.e2e-spec.ts` | test e2e | `:218` → `toBeNull()` | R4 |
| `docs/data-model.md` | docs | fila `devices` (`:53`): nota de obsolescencia | R4 |
| `specs/wialon-ingestion-pipeline/requirements.md` | specs | bloque de enmienda al final | R4 |

### Móvil (`mobile-pet-tracker/`)

| Fichero | Qué cambia | R |
|---|---|---|
| `src/i18n/catalog.ts` | `+ home.unknown`, `+ deviceConnectivity.offline` en `en` y `es` | R5 |
| `src/providers/__tests__/language-provider.test.tsx` | `:41` `+ 2`; `it` nuevo | R5 |
| `specs/mobile-ui-language/design.md` (raíz del repo) | 2 filas registradas | R5 |
| `src/utils/device-connectivity.ts` | `+ offline` en META; `+ deviceConnectionState`, `DeviceConnectionState` | R6 |
| `src/utils/device-connectivity.test.ts` | `describe` nuevo | R6 |
| `src/screens/pairing/index.test.tsx` | `it` nuevo | R6 |
| `src/__tests__/ui-copy-table.ts` | `+ 1` fila R10 (`:374`), `+ 1` fila R3 (`:55`) | R6, R7 |
| `src/__tests__/ui-language.test.ts` | `:167` `42 + 2 + 1`; `:84` `… + 2 + 1` | R6, R7 |
| `src/screens/home/index.tsx` | `HOME_CONNECTION`; `collar-status` e icono por estado; `status` al hero | R7, R9 |
| `src/screens/home/index.test.tsx` | `it` de `:640-658` retitulado; `it` nuevo (R7); `describe` nuevo (R9) | R7, R9 |
| `src/components/pet-hero-header.tsx` | prop `status`, `PetHeroStatus`, `PetHeroStatusTone`, `STATUS_TONE_CLASSES`, píldora | R8 |
| `src/components/__tests__/pet-hero-header.test.tsx` | `describe` nuevo | R8 |
| `src/__tests__/legibility-classnames.test.ts` | `+ 1` fila `inkSites`; `:134` `13 + 1 + 1` | R8 |

**No se tocan** (y R10 lo verifica): `src/app/(tabs)/home.tsx`,
`src/app/(tabs)/map.tsx`, `src/app/(tabs)/__tests__/map.test.tsx`,
`src/screens/profile/index.tsx`, `src/screens/pairing/index.tsx`,
`src/api/types.ts`, `src/components/floating-tab-bar.tsx` (#91),
`docs/ui-guidelines.md`, `specs/mobile-pet-hero-header/design.md`,
`specs/devices-claim/requirements.md`.

## Alternativas descartadas

- **A1 — dejar el write de `:97` como caché irrelevante**: no cumple el criterio
  1 ("el pestillo … queda arreglado y con test"); mantiene dos fuentes de verdad
  y obliga a reescribir el criterio en `feature_list.json`.
- **B — job periódico que pasa el pestillo a `'offline'`**: método nuevo en
  `IngestionStore`, scheduler nuevo (o tick extra en `IngestionSchedulerService`),
  env `<X>_ENABLED` + fila en `docs/conventions.md:207` + `.env.example` +
  `docs/verification.md:231`, e2e con worker; el estado lleva hasta un tick de
  retraso y las dos fuentes (pestillo y `last_message_at`) pueden discrepar en
  ese tick; sobrevive al reclaim con el valor viejo. Todo eso para llegar al
  mismo `'online' | 'offline' | null` que A2 da sin nada de ello.
- **C — derivar en el móvil contra el reloj del teléfono**: rompe todos los `it`
  de Home con fixtures de `lastMessageAt` viejas (`index.test.tsx:628,701,869,…`)
  salvo inyectando `now` en cada uno, usa un reloj que el backend evitó a
  propósito (#9 D5) y sigue sin cumplir el criterio 1.
- **Umbral 15 min** (`TRIP_MAX_GAP_MINUTES`): ya usado como "hueco de datos" de
  paseos; demasiado laxo para una píldora que dice "en línea".
- **Derivar en `PetDeviceDrizzleReader` / use cases**: tres sitios en vez de uno
  (D2).
- **Constante del umbral en `devices/domain`**: rompe la fuente única de
  umbrales (`constants.ts:1-3`).
- **Píldora en el slot**: `index.test.tsx:152` fija 2 hijos; el Make la pone en
  la banda inferior, no arriba.
- **Píldora pintada desde Home con un `children` extra o un fichero
  `status-pill.tsx`**: un elemento de dos hijos no justifica fichero ni segundo
  slot; el patrón de dato formateado por el llamante (`highlight`) ya existe.
- **`Chip` de heroui**: D8.
- **Paleta categórica para las superficies**: D7 (candado
  `consistency-classnames.test.ts:388-437`).
- **`text-success` / `bg-warning`**: D7 (3,04:1 y 1,94:1).
- **`animate-pulse` / Reanimated**: D7; feature aparte con reduced-motion.
- **Reusar `deviceConnectivity.unknown` ("Desconocida") en la Home**:
  [[requirements]] §0.2 C3.
- **Tercer icono para `unknown` en la tarjeta del collar**: `WifiOff` sirve
  para `unknown` y `offline`; el texto ya los distingue y `reicon` no tiene un
  glifo obvio de "esperando"; no se añade decisión sin test.
- **Estrechar `DeviceStatus.connectivity`**: D5.
- **Skeleton para la píldora**: D6.
- **Editar `specs/devices-claim/requirements.md` R11**: sigue siendo literalmente
  cierto (D2); editar por editar mueve un doc aprobado sin ganar nada.
