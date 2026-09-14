# explore: pet-online-pill (#73)
Fecha: 2026-09-13
Árbol: worktree `/home/claude/sites/Pet-Tracker-wt-backend`, branch `feature/73-pet-online-pill` = `origin/main` `072cff40`. Solo lectura. Toda línea citada se verificó contra este árbol; los `progress/explore_*.md` y la descripción de `feature_list.json` se trataron como hipótesis.

## Premisas verificadas / falsas

| # | Premisa (origen) | Veredicto | Evidencia |
|---|---|---|---|
| P1 | El store escribe `connectivity: 'online'` en cada telemetría y nada lo devuelve a otro valor (`feature_list.json` #73) | **Cierta** | Único escritor: `backend-pet-tracker/src/workers/ingestion.drizzle.store.ts:97`. `grep offline` en `src/`+`test/`: tres hits y ninguno escribe la columna (`src/db/schema/alerts.schema.ts:18` comentario; `src/workers/alerts-engine/alerts-engine-consumer.service.spec.ts:383` sobre `kind: 'unknown'`; `test/provision-device.e2e-spec.ts:222` mensaje de `WialonTransportError`). Ni claim (`src/modules/devices/infrastructure/repositories/device.drizzle.repository.ts:91`) ni release (`:107-112`) tocan `connectivity` |
| P2 | "El umbral de silencio nunca se definió" (#73, explore §8 fila G) | **Falsa a medias** | En backend no hay umbral de "en línea". Pero el **móvil ya tiene uno**: `const STALE_SECONDS = 120;` en `mobile-pet-tracker/src/app/(tabs)/map.tsx:76`, que decide `map.live` / `map.stale` (`:192-197`), copy `src/i18n/catalog.ts:94-95,401-402`, tests `src/app/(tabs)/__tests__/map.test.tsx:548-571` (15 s → "En vivo") y `:582-585` (121 s → "Desactualizado"). Y la spec de #9 fija `staleSeconds < 120` como criterio literal (`specs/positions-api/requirements.md:96-99`). Además `plans/007-geocercas-alertas-push.md:115` ya propuso "Scheduler cada 5 min sobre `last_message_at`" para `device_offline` (post-MVP) |
| P3 | `files_affected` incluye `mobile-pet-tracker/src/app/(tabs)/home.tsx` (#73) | **Obsoleta** | Es un route delgado de 5 líneas (`mobile-pet-tracker/src/app/(tabs)/home.tsx:1-5`). La Home vive en `mobile-pet-tracker/src/screens/home/index.tsx` (735 líneas) desde #68 |
| P4 | El diseño está en `design-src/App.tsx:334-365` (#73, #67) | **Cierta con ruta completa** | No existe `mobile-pet-tracker/design-src/`. El fichero es `specs/mobile-figma-polish/design-src/App.tsx`; hero `:334-365`, píldora `:358`, componente `Pill` `:71-77` |
| P5 | "La píldora no se puede pintar hoy … ninguna razón es de UI" (#73) | **Matizar** | La Home **ya pinta** "En línea" / "Sin conexión" / "Sin collar" en `collar-status` a partir de `connectivity === 'online'` (`src/screens/home/index.tsx:454-461`, icono `:445-451`), con test R8 (`src/screens/home/index.test.tsx:594-660`). Ese texto **ya miente hoy** por el pestillo: un collar que reportó una vez y calló muestra "En línea" para siempre. La #68 lo dejó fuera a propósito como "territorio de #73" (`specs/mobile-home-weekly-activity/requirements.md:559-562`). Lo que no existe es la píldora **en el hero** (`src/components/pet-hero-header.tsx:26-38` no tiene prop de estado) |
| P6 | Explore §2.3.2: "la señal real es `LastPosition.staleSeconds` o `lastCommunicationAt` contra el reloj" | **Cierta** | `src/modules/positions/domain/stale-seconds.ts:9-11`; #9 D5 eligió `last_position.ts` y no `last_communication_at` (`specs/positions-api/requirements.md:254-262`) |
| P7 | #66 OD-3: `device` no viaja en el listado (`specs/pets-list-response-enrichment/requirements.md:257-269`) | **Cierta** | `src/modules/pets/infrastructure/pets.controller.ts:85-87` pasa `null` como device en `list()` |
| P8 | Hero spec: el store vive en `backend-pet-tracker/src/modules/ingestion/…/ingestion.drizzle.store.ts` (`specs/mobile-pet-hero-header/requirements.md:491`) | **Ruta falsa** | El fichero está en `src/workers/ingestion.drizzle.store.ts`. No hay `src/modules/ingestion/`. Solo afecta a la cita, no a la decisión |
| P9 | "El collar reporta cada 30 s" (`docs/aws-scalability-review.md:39,152,239`; `plans/012-validacion-escalabilidad-costos.md:42`; `plans/presupuesto-produccion.md:22`) | **Supuesto, no dato de hardware** | Sale del simulador: `SIM_STEP_SECONDS = 30` (`src/integrations/wialon/fake-wialon.client.ts:13-14`, `docs/wialon-module.md:57-60`). `plans/012:232` lo llama "peor caso; adaptativo cambia TODOS los números"; `docs/brief.md:554` pide "aumentar la frecuencia cuando el collar lo permita". Ningún doc fija la cadencia real |
| P10 | `progress/current.md` dice que #91 trabaja `floating-tab-bar.tsx` y su test | **Cierta** | `feature_list.json` #91 `files_affected` = `src/components/floating-tab-bar.tsx` + `src/components/__tests__/floating-tab-bar.test.tsx`. Ver §8 |

---

## 1. El pestillo hoy

**Escritor único.** `src/workers/ingestion.drizzle.store.ts:89-110`:
```ts
.set({ batteryPct: update.batteryPct, connectivity: 'online', lastMessageAt: update.lastMessageAt, updatedAt: new Date() })
.where(and(eq(devices.id, deviceId), or(isNull(devices.lastMessageAt), lt(devices.lastMessageAt, update.lastMessageAt))))
```
Lo invoca `src/workers/positions-consumer.service.ts:221-224` solo si la asignación sigue activa (`:203-209`). El puerto lo documenta como contrato: `src/workers/ingestion-store.ts:44-52` ("connectivity 'online'"), y la spec de #8 lo congeló en R14 (`specs/wialon-ingestion-pipeline/requirements.md:168-175`) dejando `'offline'` fuera de alcance explícitamente: "nadie la marca en esta feature; la frescura la deriva #9 con `staleSeconds`" (`:312-313`).

**Nadie lo apaga.** Ver P1. Solo el arnés e2e lo pone a `null` (`test/ingestion.e2e-spec.ts:83-92`, `resetSim001`). Consecuencia adicional: tras `release` + nuevo `claim` por otra mascota, la fila `devices` conserva `connectivity`, `lastMessageAt` y `batteryPct` del dueño anterior hasta el primer mensaje nuevo (release `device.drizzle.repository.ts:107-112` solo escribe `releasedAt`/`status`; claim `:91` solo `status`+`ingestWatermark`).

**Lectores.**
- Detalle de mascota: `src/modules/devices/infrastructure/repositories/pet-device.drizzle.reader.ts:20-41` (puerto `PET_DEVICE_READER`, `src/modules/pets/domain/ports/pet-device-reader.ts:7-13,23-25`) → `src/modules/pets/application/use-cases/get-pet.use-case.ts:73` → `src/modules/pets/infrastructure/pets.controller.ts:110` `toDeviceStatusResponse(device)`.
- Claim 201 y `GET /v1/pets/:petId/device`: entidad `src/modules/devices/domain/entities/device.entity.ts:20,41,58` vía `device.drizzle.repository.ts:129`; controllers `src/modules/devices/infrastructure/devices.controller.ts:41` y `pet-device.controller.ts:34-43`.
- Mapper único del contrato: `src/modules/devices/infrastructure/mappers/device-status.mapper.ts:24-36` (5 claves `model, batteryPct, connectivity, lastMessageAt, esn`; `connectivity` es passthrough `:30`).
- Listado: `device: null` siempre (`pets.controller.ts:85-87`).

**Contrato de valores.** `string | null` en todas partes, sin enum ni CHECK: columna `varchar(20)` nullable (`src/db/schema/devices.schema.ts:38`; el único CHECK es de `status`, `:50-53`; `devices.schema.spec.ts:86` fija `notNull === false`), puerto `pet-device-reader.ts:10`, mapper `device-status.mapper.ts:10,18`, móvil `mobile-pet-tracker/src/api/types.ts:47`. Valores que aparecen en el árbol: `null` (todas las fixtures de claim/e2e), `'online'` (store y `test/ingestion.e2e-spec.ts:218`), `'lte'` como passthrough en `device-status.mapper.spec.ts:8-17`, `'LTE'` en la fixture móvil `src/screens/pairing/index.test.tsx:104`.

**Catálogo móvil (#68 R16).** `mobile-pet-tracker/src/utils/device-connectivity.ts:3-8` mapea **solo** `online → 'deviceConnectivity.online'`; cualquier otro string → `'deviceConnectivity.unknown'` (`:10-22`); `null → null` y la pantalla pinta `'—'` (`src/screens/pairing/index.tsx:90-92,424-428`). Tests `src/utils/device-connectivity.test.ts:3-19`. `'online'` **sí** está en el catálogo (`src/i18n/catalog.ts:88,395`). La Home **no** usa este util: usa claves propias `home.free` / `home.online` / `home.offline` (`catalog.ts:35-37,342-344`; `home/index.tsx:456-461`).

**Tests que asertan el pestillo.** Backend: `test/ingestion.e2e-spec.ts:218` `expect(deviceRow.connectivity).toBe('online')` (R14/R19). Unit del consumer: `src/workers/positions-consumer.service.spec.ts:402-406,431-434` fija los args de `updateDeviceTelemetry` (`{batteryPct, lastMessageAt}` — no incluye connectivity, es el store quien lo pone). No existe `ingestion.drizzle.store.spec.ts`: la única cobertura del store es el e2e. Móvil: `src/screens/home/index.test.tsx:621-638` (`'online'` → "En línea"), `:640-658` (`null` → "Sin conexión", título literal "treats an unknown connection as offline": es la confusión que el criterio 3 obliga a deshacer), `:1198-1225` (testIDs `collar-status`/`collar-battery` intactos), `src/screens/pairing/index.test.tsx:512,546`.

---

## 2. Señales de "último visto"

| Campo | Escritor | Reloj | Guarda | Expuesto |
|---|---|---|---|---|
| `devices.last_message_at` | `ingestion.drizzle.store.ts:98` con `update.lastMessageAt` | **del dispositivo**: `latestMoment = new Date(latest.ts)` de la última posición aceptada (`positions-consumer.service.ts:211-213,223`; `normalize()` ordena ascendente `:182`) | `WHERE last_message_at IS NULL OR last_message_at < entrante` (`:104-107`); e2e R14 `test/ingestion.e2e-spec.ts:255-303` | Detalle `device.lastMessageAt` ISO UTC (`device-status.mapper.ts:31-33`); `GET …/device` igual; listado no |
| `pets.last_communication_at` | `ingestion.drizzle.store.ts:121` | el **mismo** `latestMoment` (`positions-consumer.service.ts:234`) | `:127-130` | Detalle y **listado** como `lastCommunicationAt` ISO UTC (`pet-profile-response.mapper.ts:78-80`; `pets.controller.ts:85-87`) |
| `pets.last_position.ts` | `:120` | epoch ms del dispositivo | mismo WHERE | `GET /v1/pets/:petId/positions/last` → `staleSeconds` contra reloj del servidor (`get-last-position.use-case.ts:62`; `stale-seconds.ts:9-11`, satura en 0 si `ts > now`); ruta tras `PetAccessGuard` + `PetTrackingGuard` (`positions.controller.ts:34-35`) ⇒ 402 sin suscripción |

Solo `updatedAt` usa el reloj del servidor (`:99,:122`). Guarda de futuro: `normalize()` descarta posiciones con `ts > now + FUTURE_TS_TOLERANCE_MS` (5 min) (`src/pipeline/validate-positions.ts:43`, `src/pipeline/constants.ts:16`), así que `last_message_at ≤ now + 5 min`.

**Formato al móvil:** ISO 8601 UTC (`toISOString()`), nunca zona del dueño. #89 solo movió fechas civiles de body (`birthDate`, `measuredAt`); los timestamps siguen en Z. El móvil los pinta con `new Date(iso).toLocaleString(locale)` (Home `src/screens/home/index.tsx:110-115,728`, Profile `src/screens/profile/index.tsx:283-287`, Pairing `src/screens/pairing/index.tsx:430-438`). Tipos `mobile-pet-tracker/src/api/types.ts:48,75` `string | null`. **La Home no llama a `positions/last`** (queries `:159-182`: pets, detail, activity, reminders, alerts); el Mapa sí (`map.tsx:191-197`).

`lastMessageAt` (collar) y `lastCommunicationAt` (mascota) valen lo mismo en régimen; difieren tras un reclaim (§1). Para "¿el collar está en línea?" el campo del collar es `device.lastMessageAt`.

---

## 3. Cadencia real del dispositivo

- **Simulador:** un punto cada 30 s (`fake-wialon.client.ts:13-14`; `docs/wialon-module.md:57-60`; fixture `walk.json` 200 slots, `:71-73`).
- **Pipeline:** poller cada 60 s, consumer cada 15 s, constantes nombradas y no env (`src/workers/ingestion-scheduler.service.ts:7-10`), gate `POLLER_ENABLED` + `NODE_ENV !== 'test'` (`:53-58`); el poller salta ticks solapados (`poller.service.ts:37-42`). Latencia peor caso fix→caché en régimen: 60 s + 15 s ≈ **75 s**, más el retardo de Wialon. Con reporte de 30 s, el siguiente fix llega ≤ 105 s después del anterior en caché.
- **Claim:** watermark `now − 10 min` (`claim-device.use-case.ts:25`), así que tras vincular pueden entrar posiciones de hasta 10 min atrás.
- **Docs:** `docs/aws-scalability-review.md:39,151-153` y `plans/012:42,166,232` asumen 30 s como **peor caso** de coste; `plans/presupuesto-produccion.md:87` "reporte adaptativo bajaría…"; `docs/brief.md:554` (modo perdido) "aumentar la frecuencia cuando el collar lo permita"; la feature futura `device-settings` del explore §7 Bloque 3 (`progress/explore_design-gap-vs-make.md:791`) contempla intervalo configurable. **No hay doc de hardware que fije la cadencia.** El repo tampoco fija una cadencia mínima garantizada en modo ahorro.
- **Nociones de "hueco" ya existentes:** `TRIP_MAX_GAP_MINUTES = 15` cierra un paseo si dos puntos distan más (`src/pipeline/constants.ts:46-48`); `TRIP_IDLE_CLOSE_MINUTES = 10` (`:44`).

Conclusión: la spec solo puede justificar el umbral como **múltiplo de la cadencia supuesta (30 s) más la latencia del pipeline (≈75 s)**, y dejar escrito que si la cadencia pasa a adaptativa el umbral se revisa. La cadencia real es decisión/dato del humano.

---

## 4. Umbrales y trabajos periódicos que ya existen

| Umbral | Valor | Unidad | Dónde | Cómo se configura |
|---|---|---|---|---|
| Frescura del mapa ("En vivo" / "Desactualizado") | 120 | s | `mobile-pet-tracker/src/app/(tabs)/map.tsx:76` (`STALE_SECONDS`), uso `:192-197`; copy `catalog.ts:93-95,400-402` (`map.noSignal`, `map.live`, `map.stale`) | constante del fichero |
| Criterio de aceptación de #9 | `< 120` | s | `specs/positions-api/requirements.md:96-99` (R6) | spec |
| Sugerencia `device_offline` | cada 5 | min | `plans/007-geocercas-alertas-push.md:115` ("regla Scheduler cada 5 min sobre `last_message_at`", post-MVP); tipos reservados en `src/db/schema/alerts.schema.ts:16-19` y `docs/data-model.md:57`; brief §12 `:536,540` "Dispositivo desconectado" / "Posición desactualizada", §17 `:722` | plan, no código |
| Tolerancia de ts futuro | 5 | min | `src/pipeline/constants.ts:16` | constante |
| Batería baja / recuperación | 20 / 30 | % | `src/pipeline/constants.ts:20,24`; uso `positions-consumer.service.ts:271-273`, `alerts-engine-consumer.service.ts:359` | constantes |
| Hueco que cierra paseo | 15 | min | `src/pipeline/constants.ts:48` | constante |

Regla del repo: umbrales como **constantes nombradas** en `src/pipeline/constants.ts` ("fuente única… cero números mágicos", `:1-3`), y cadencias como constantes y **no env** (D11, `ingestion-scheduler.service.ts:7-8`). Las env solo abren/cierran workers (`docs/conventions.md:239-244`; `.env.example:70-98`) y toda env nueva exige fila en la tabla de `docs/conventions.md:207` y `.env.example`.

**Trabajos periódicos (por si la opción B necesitara uno).** Todos con `SchedulerRegistry.addInterval` + `setInterval`, gate `<X>_ENABLED === 'true' && NODE_ENV !== 'test'`, lógica en `runOnce(now)`/`drainOnce(now)` con `now` inyectable para testear sin reloj; `ScheduleModule.forRoot()` una vez en `src/app.module.ts:29`; **ningún `@Cron`** en el repo:
- `src/workers/ingestion-scheduler.service.ts:33-58` (60 s / 15 s)
- `src/workers/alerts-engine/alerts-engine-scheduler.service.ts:28-52` (60 s)
- `src/workers/notifier/notifier-scheduler.service.ts:37-42` (60 s)
- `src/modules/activity/infrastructure/activity-scheduler.service.ts:33-60` (1 h, `runOnce(new Date())`)
- reminders (1 min, `docs/conventions.md:243`)

**Reloj inyectable (patrón ya existente):** `now: Date` como parámetro, default `new Date()` en el borde: `pets.controller.ts:97-104` → `get-pet.use-case.ts:55`; `pet-profile-response.mapper.ts:56`; `get-last-position.use-case.ts:30`; `staleSeconds(ts, now)`; workers `drainOnce(now = new Date())`. No hay `Clock` como servicio inyectado; no hace falta.

---

## 5. Opciones de derivación (coste, sin decidir)

Notación: **[rojo]** = test que se pone rojo y hay que declarar como delta.

### (A) El backend deriva `connectivity` en lectura a partir de `last_message_at` contra `now` y un umbral

- **Qué toca:** función pura `deriveConnectivity(lastMessageAt: Date | null, now: Date): 'online' | 'offline' | null` (candidatos: `src/modules/devices/domain/` o `src/pipeline/`, con el umbral en `src/pipeline/constants.ts`); `device-status.mapper.ts:24-36` recibe `now` y escribe el valor derivado **en la misma clave `connectivity`** (el contrato de 5 claves no cambia de forma); llamadores: `pets.controller.ts:110` (ya tiene `now`, `:97`), `pet-device.controller.ts:43` (añadir `new Date()`), `devices.controller.ts:41` (claim: `lastMessageAt` es null ⇒ null).
- **[rojo]:** `device-status.mapper.spec.ts:8-17` (`'lte'` passthrough → deja de ser passthrough), `pets.controller.spec.ts:216-235` (espera `connectivity: null` con `lastMessageAt` de 2026-08-01 → derivado `'offline'`). Verdes: todos los candados de claves (`test/devices.e2e-spec.ts:274-280,317`, `test/device-subscriptions.e2e-spec.ts:354-356`, `test/pets.e2e-spec.ts:64-89`, `pet-profile-response.mapper.spec.ts:38-64`), `test/ingestion.e2e-spec.ts:218` (la DB sigue diciendo `'online'`).
- **Reloj:** patrón existente (§4); el test fija `now` y `lastMessageAt = now − (umbral ± 1 s)`; e2e sembrando `last_message_at` en Postgres y pidiendo el detalle, sin dormir (mismo truco que `test/positions.e2e-spec.ts:289-323`).
- **Migración:** ninguna.
- **El pestillo:** A no toca el store. Dos sub-opciones: **A1** dejar `:97` como caché irrelevante (el lector la ignora); **A2** borrar la línea `connectivity: 'online'` de `:97` y `ingestion-store.ts:45` → columna siempre `NULL` → [rojo] `test/ingestion.e2e-spec.ts:218` pasa a `toBeNull()`, nota en `docs/data-model.md:53`. A2 es el "arreglo con test" más pequeño que satisface literalmente el criterio 1; A1 exige reescribir el criterio (§9 G3).
- **Móvil:** con `connectivity ∈ {'online','offline',null}` servido por la API, la Home no necesita reloj: `collar-status` (`home/index.tsx:454-461`) ya bifurca por `=== 'online'`; falta el tercer estado para `null` (§6, §7). La píldora del hero lee el mismo campo. Las fixtures de tests móviles con fechas viejas (`index.test.tsx:628,701,869,1048,1206,1411,1655,2016,3287`) siguen valiendo porque el estado viaja explícito.
- **Coste aproximado:** 1 función pura + 1 constante + 3 llamadores + 2 specs reescritos + 1 e2e nuevo; móvil: 1 estado nuevo + píldora.

### (B) Un job periódico pasa el pestillo a `'offline'`

- **Qué toca:** método nuevo en `IngestionStore` (`ingestion-store.ts:31-63`) tipo `markSilentOffline(now, threshold)` → `UPDATE devices SET connectivity='offline' WHERE connectivity='online' AND last_message_at < now − threshold` (`ingestion.drizzle.store.ts`); un scheduler nuevo calcando `activity-scheduler.service.ts:23-60` **o** un tick extra dentro de `IngestionSchedulerService:33-50`; el flanco de vuelta a `'online'` ya existe (`:97`, con guarda `:104-107`).
- **Env:** si se sigue el patrón "una env por worker" (`docs/conventions.md:239-244`, D7 en `activity-scheduler.service.ts:51-54`) hay que añadir `<X>_ENABLED` a `.env.example`, a la tabla de `docs/conventions.md:207-247` y a la lista de gates de `docs/verification.md:231`. Si se cuelga de `POLLER_ENABLED`, hay que justificarlo por escrito.
- **[rojo]:** ninguno de claves. Nuevos: unit del scheduler (calco de `ingestion-scheduler.service.spec.ts`), e2e contra Postgres real con `now` inyectado (sin dormir), test de flanco de vuelta.
- **Migración:** ninguna (`varchar(20)`, sin CHECK).
- **Latencia y verdad:** el estado tiene hasta un tick de retraso (60 s si se usa el intervalo del poller) sobre el umbral; dos fuentes de verdad (pestillo + `last_message_at`) que pueden discrepar en ese tick. Sobrevive al reclaim con el valor viejo (§1).
- **Móvil:** igual que A (la API sirve `'online'|'offline'|null`).
- **Coste:** ≥ A (scheduler + env + docs + e2e con worker), y es la opción "decisión G = pestillo".

### (C) El móvil deriva de `lastMessageAt` contra el reloj del teléfono

- **Qué toca:** helper puro en `src/utils/device-connectivity.ts` (o `src/screens/home/format.ts`) con `now` inyectado; Home `:445-461` y píldora; opcionalmente unificar con `STALE_SECONDS` del mapa (`map.tsx:76`, route file no migrado a `src/screens/`, ver #87).
- **[rojo]:** todos los `it` de Home con fixtures de `lastMessageAt` en el pasado (`index.test.tsx:621-638,864-935,1198-1225,…`) salvo que inyecten `now` o usen fake timers; `map.test.tsx:585` si se mueve la constante.
- **Riesgos propios:** reloj del teléfono vs reloj del collar (el backend evita esto: #9 D5 calcula contra el reloj del servidor); y **no cumple el criterio 1** (el store sigue igual) salvo emparejar con A2/B.
- **Coste:** pequeño en código, alto en candados y semántica.

### Recomendación (etiquetada, no decisión)

**A2** parece la opción más pequeña que cumple los cinco criterios a la vez: el estado deja de ser un pestillo (criterio 1 con test: `ingestion.e2e-spec.ts:218` → `toBeNull()` + e2e del derivado), el umbral vive en una constante nombrada con justificación (criterio 2), la API sirve los tres estados y el móvil no necesita reloj (criterio 3), sin migración, sin env nueva, sin scheduler. `ponytail:` techo asumido — el detalle sigue siendo N+0 (una consulta por mascota como hoy); si un día el listado necesita el estado por mascota (selector con puntos de color), entra `findActiveDevices(petIds)` de OD-3 de #66 (`specs/pets-list-response-enrichment/requirements.md:266-269`), no esta feature.

---

## 6. Estado "desconocido": casos reales del modelo

| Caso | Cómo se ve en DB | Cómo lo distingue el detalle hoy | Cómo lo pinta la Home hoy |
|---|---|---|---|
| Mascota sin collar | `pet_devices` sin fila con `released_at IS NULL` | `findActiveDevice` → `null` (`pet-device.drizzle.reader.ts:25-32`) → `device: null` (`pets.controller.ts:110`) | "Sin collar" (`home/index.tsx:456-457`, `home.free`), sin batería ni `last-position-card` (`:709`); test `index.test.tsx:609-617,921-934` |
| Collar vinculado que **nunca** reportó | `last_message_at NULL`, `connectivity NULL`, `battery_pct NULL` (claim no las toca; `test/devices.e2e-spec.ts:315-320`) | `device` con los tres `null` | **"Sin conexión"** (`:461`, `home.offline`) — test `:640-658` lo llama "unknown … as offline". Pairing: `'—'` y "noMessagesYet" (`pairing/index.tsx:427,433-437`) |
| Collar que reportó y lleva > umbral en silencio | `last_message_at` viejo, `connectivity 'online'` | **indistinguible** del vivo | "En línea" (miente) |
| Collar vivo | `last_message_at` reciente, `'online'` | ok | "En línea" |
| Collar liberado y reclamado por otra mascota | fila `devices` con telemetría del dueño anterior (§1) | `device` con `lastMessageAt`/`connectivity` heredados | "En línea" si el anterior reportó hace poco |
| Suscripción vencida (gracia agotada) | el poller deja de consultarlo (`ingestion.drizzle.store.ts:36-45`, `entitledDeviceSubscription()`) ⇒ silencio | igual que "silencio" | "En línea" hasta que se derive |

Mapeo natural de tres estados con derivación: `device === null` → **sin collar**; `lastMessageAt === null` → **desconocido**; `now − lastMessageAt > umbral` → **desconectado**; si no → **en línea**. El caso "reclaim" queda como riesgo (§9 G8).

---

## 7. Lado móvil

- **SDK:** `expo ~57.0.14`, RN `0.86.2`, React `19.2.3`, `@tanstack/react-query 5.102.8` (`mobile-pet-tracker/package.json:8,10,29,31`). Skills cargadas: `expo:expo-overview`; para la implementación la carta pide además `expo-native-ui` (píldora, tokens) y `expo-animation` si el punto pulsa (`docs/ui-guidelines.md:157-176`).
- **Dónde vive la Home:** `src/screens/home/index.tsx` (735 l.); route `src/app/(tabs)/home.tsx:1-5`. Datos: `detail = useQuery(petKeys.detail(id), getPet)` (`:164-168`), refetch en foco (`:222-230`).
- **Hero:** `src/components/pet-hero-header.tsx`. Props `:26-38`: `pet: PetProfile | null`, `variant?: 'bleed'|'card'`, `highlight?: {value,label}`, `children?` (slot superior). **No hay prop ni hueco de estado.** Anatomía: slot `pet-hero-slot` (`:59-67`) → medios `PET_HERO_MEDIA_HEIGHT = 260` (`:16,69-110`) → caption `pet-hero-caption` (`:112-154`) con columna izquierda nombre 3xl + raza (`:116-135`) y columna derecha highlight (`:137-153`). Home lo monta en `home/index.tsx:245-289` con `variant="bleed"`, `highlight` = paseos de hoy y slot = `home-hero-actions` (switcher + campana). El design.md de #67 dejó constancia: "el hero no lo usa: la píldora de conectividad está fuera de alcance" (`specs/mobile-pet-hero-header/design.md:407-409`); D2 "el hero no conoce a su contenido del slot" (`:366-373`).
- **Qué pinta el Make** (`specs/mobile-figma-polish/design-src/App.tsx`): dentro del bloque inferior del hero (`:356-365`), columna izquierda, **encima del nombre** con `mb-1.5`: `<Pill green><span className="w-1.5 h-1.5 rounded-full bg-[#2AB87C] animate-pulse"/>En línea</Pill>` (`:358`); nombre `:359`, raza `:360`; derecha pasos `:362-365`. `Pill` (`:71-77`): `inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold`, verde `background #E3F9EE / color #0F9B5A`, neutro `rgba(0,0,0,0.06) / #6B7280`. Solo dibuja el estado "En línea"; no hay variante "desconectado" ni "desconocido" en el mock.
- **Carta (`docs/ui-guidelines.md`):** radios `:134-142`: "píldora de dato" → `rounded-xl`; "cápsula (chip, píldora de pestaña…)" → `rounded-full`; `rounded-2xl/lg/md/sm` prohibidos (`:144-147`, test `src/__tests__/consistency-classnames.test.ts`). Colores: cero hex fuera de `src/theme/` (`design-drift.test.ts:217-220`); tokens semánticos disponibles en `useThemeColors`: `success`, `warning`, `muted`, `accent-strong` (`home/index.tsx:149-155`), `bg-danger` (`:281`), `bg-accent-soft` (`:445`), `bg-tab-pill` (`weekly-activity-chart.tsx:328`). "El color nunca es el único portador" (`:217-218`) ⇒ punto + texto. Animación: Reanimated + `prefers-reduced-motion` (`:157-176`; #68 criterio "respetan reduced-motion"). Texto sobre el hero debe pasar AA en los dos temas (`:222-225`, enmienda #67). `text-[11px]` arbitrario está vetado (`design-drift.test.ts:220` veta `text-[10px]`; la escala del tema tiene `text-2xs`, `home/index.tsx:403`).
- **Componente compartido de píldora/badge:** **no existe** (`src/components/`: card, floating-tab-bar, pet-avatar, pet-hero-header, pet-map, pet-switcher, weight-chart). Nadie importa `Chip` de heroui-native (importes reales: Avatar, Button, Card, Skeleton, Spinner, Input, Label, LinkButton, TextField, HeroUINativeProvider); `node_modules` no está en este worktree, así que no pude verificar si heroui-native 'Chip' existe: la spec debe comprobarlo antes de decidir (la carta `:79` lo menciona como opción).
- **Copy y candados a declarar** (expresiones literales actuales):
  - `src/providers/__tests__/language-provider.test.tsx:41`: `expect(englishKeys).toHaveLength(260 + 16 + 1 + 4 + 7 + 14);` y `:42` `expect(spanishKeys).toEqual(englishKeys);` + marcadores `:43-47`.
  - `src/__tests__/ui-language.test.ts:84`: `expect(R3_HOME).toHaveLength(21 + 15 + 1 + 4 + 7 + 2);`; `:167`: `expect(R10_PAIRING).toHaveLength(42 + 2);`; `:428` `expect(Object.keys(es)).toHaveLength(Object.keys(en).length);`; `:437` `expect(SCREEN_FILES).toHaveLength(19 + 2 + 1);` (suma +1 si el `t()` nuevo vive en un fichero nuevo).
  - Tabla de usos `src/__tests__/ui-copy-table.ts`: `R3_HOME` `:45-96` (filas `home.free/online/offline` `:53-55`), `R10_PAIRING` `:330-375` (filas `deviceConnectivity.*` `:373-374`).
  - Catálogo `src/i18n/catalog.ts`: `home.free/online/offline` `:35-37` / `:342-344`; `deviceConnectivity.online/unknown` `:88-89` / `:395-396`; `map.noSignal/live/stale` `:93-95` / `:400-402`. Claves que faltan para tres estados: un "desconectado" en `deviceConnectivity.*` y/o un "desconocido" en `home.*` (o reusar `deviceConnectivity.unknown`). Ladder: reusar `home.online/offline` para la píldora si el copy coincide.
  - `src/__tests__/design-drift.test.ts:203-215` lista fija de ficheros de #68 (hex/StyleSheet); `:331-355` fija el texto de la carta sobre `device.connectivity`.
- **Tests de Home/hero que congelan hijos u orden:** `src/screens/home/index.test.tsx:149-152` `expect(actions.children).toHaveLength(2)` sobre `home-hero-actions` (#78 R10) — **veta meter la píldora en el slot** sin delta; `pet-hero-header.test.tsx:269-283` (nada de texto sobre `pet-hero-media`; `pet-hero-name` dentro de `pet-hero-caption`), `:342-349` (con `pet === null` el caption no tiene texto ⇒ la píldora también debe ser skeleton/ausente); `pet-hero-caption` **no** tiene `children.length` candado (buen sitio). Otros `children` locks de la Home son de recordatorios/tiles (`:1792,2253-2319,2537`), ajenos. Tests de `collar-status`: `:594-660`, `:921-934`, `:1198-1225`. `src/__tests__/hero-header-amendments.test.ts:85-87` solo cuenta docs enmendados (5).
- **Cliente de API:** `src/api/types.ts:44-50` (`DeviceStatus`), `:57-80` (`PetProfile`). Si la API sirve `'online'|'offline'|null`, se puede estrechar el tipo o dejar `string | null` (el util ya degrada lo desconocido).

---

## 8. Solape con #91

#91 toca `mobile-pet-tracker/src/components/floating-tab-bar.tsx` y `src/components/__tests__/floating-tab-bar.test.tsx` (feature_list #91). Ningún candidato de #73 (§10) coincide. Ficheros compartidos por ambas sesiones que **no** son de código: `feature_list.json`, `progress/current.md`, `docs/ui-guidelines.md` (si #73 enmienda la carta), y el árbol principal `/home/claude/sites/Pet-Tracker` (no tocar). Los candados de copy (`language-provider.test.tsx:41`, `ui-language.test.ts`) no entran en #91 ("cero dependencias nuevas; ninguna cifra de candado se mueve sin declararla").

---

## 9. Riesgos y decisiones abiertas para el humano

- **G1 — Decisión G: fuente de "en línea"** (obligatoria). (A) derivar en lectura de `last_message_at` (backend) — recomendada §5; (B) pestillo apagado por job; (C) derivar en el móvil. El repo ya decidió una vez en esta dirección: #8 dejó `'offline'` fuera "porque la frescura la deriva #9 con `staleSeconds`" (`specs/wialon-ingestion-pipeline/requirements.md:312-313`) y #9 lo calcula contra el reloj del servidor (D5).
- **G2 — Umbral: valor, unidad, justificación** (obligatoria). Restricción dura: ≥ cadencia supuesta (30 s) + poller (60 s) + consumer (15 s) = 105 s en régimen, o un collar sano parpadea. Candidatos que el árbol permite: **120 s** (coherente con `map.tsx:76` y `positions-api` R6; margen de solo 15 s sobre la latencia peor caso ⇒ sensible al retardo de Wialon); **300 s** (`plans/007:115`, simétrico con `FUTURE_TS_TOLERANCE_MS`, ≈4 ciclos de poller, robusto); **15 min** (`TRIP_MAX_GAP_MINUTES`, ya usado como "hueco de datos", probablemente laxo para una píldora). Debe quedar como constante nombrada (`src/pipeline/constants.ts`) con comentario que cite la cadencia y la latencia, y nota de revisión si la cadencia pasa a adaptativa (`plans/012:232`, `brief.md:554`).
- **G3 — Literalidad del criterio 1** ("el pestillo de `ingestion.drizzle.store.ts` queda arreglado y con test"). Con A1 el store no cambia ⇒ hay que reescribir el criterio; con A2 se borra el write y el e2e `:218` cambia; con B se cumple literal. El humano elige o reescribe.
- **G4 — Coherencia con el mapa.** Home "En línea" y Mapa "Desactualizado" con umbrales distintos se contradicen en pantalla. Opciones: mismo número en `map.tsx:76` (toca `map.tsx` + `map.test.tsx:585` caso 121 s), o divergencia declarada por escrito, o que el mapa consuma el mismo estado derivado.
- **G5 — Tres estados en `collar-status`.** Hoy `null` ⇒ "Sin conexión" (`home/index.tsx:461`, test `:640-658`). El criterio 3 exige "desconocido" ≠ "desconectado": hay que cambiar ese `it` (delta) y decidir clave de copy (nueva `home.unknown`/`deviceConnectivity.offline` o reuso de `deviceConnectivity.unknown`), con los deltas de §7.
- **G6 — Dónde va la píldora.** Make: columna izquierda del caption, encima del nombre (`App.tsx:358-360`). El slot está vetado por `index.test.tsx:149-152` salvo delta. Prop nueva en `PetHeroHeader` (p. ej. `status?`) vs pintarla desde Home: el hero "no conoce a su contenido" solo aplica al slot (D2); un dato formateado por el llamante es el patrón de `highlight` (`pet-hero-header.tsx:34-35`). Profile usa el hero sin slot y también tiene `device` en su `PetProfile`: decidir si Profile la muestra.
- **G7 — Anatomía.** Cápsula `rounded-full` (Make) vs "píldora de dato" `rounded-xl` (carta `:138-142`): ambiguo, la spec elige y lo escribe. Tokens: `success` para en línea; `muted`/`bg-default` para desconocido; `warning` o `danger` para desconectado (la carta no lo fija). Punto + texto (color nunca único portador). `animate-pulse` del Make ⇒ Reanimated + reduced-motion, o sin animación (decisión). Tamaño `text-2xs`, no `text-[11px]`. AA sobre banda opaca (`pet-hero-caption` es `bg-background`, `:114`), así que no hay conflicto con la foto.
- **G8 — Telemetría heredada tras reclaim** (§1). Con derivación, una mascota que reclama un collar que otra usó hace 1 min se vería "en línea" con posición ajena hasta el primer mensaje. Fuera de alcance probable (feature aparte: resetear `battery_pct/connectivity/last_message_at` en release o claim), pero la spec debe nombrarlo.
- **G9 — Estado por mascota en el selector.** El listado sigue con `device: null` (OD-3); la píldora solo puede ser de la mascota seleccionada (detalle). Si se quiere punto por chip en `PetSwitcher`, es `findActiveDevices(petIds)` (OD-3), feature aparte.
- **G10 — Silencio por suscripción vencida** se verá como "desconectado" sin explicar el motivo (`ingestion.drizzle.store.ts:36-45`). Aceptable o no: decisión de producto; la Home ya trata el 402 de actividad aparte.
- **G11 — Reloj del collar vs servidor.** Un collar adelantado hasta 5 min (`FUTURE_TS_TOLERANCE_MS`) parece "en línea" 5 min más de lo real; uno atrasado parece "desconectado" antes. Con A/B el reloj es el del servidor (consistente con #9 D5); con C es el del teléfono (peor).
- **G12 — Semántica del contrato `connectivity`.** Hoy es passthrough (`device-status.mapper.spec.ts:8-17` acepta `'lte'`). Convertirlo en estado derivado cambia el significado del campo sin cambiar la forma; `specs/devices-claim/requirements.md:153` solo congela claves, no valores, pero la spec de #73 debe declararlo como enmienda semántica (y actualizar el comentario de `device-status.mapper.ts:1-6`).
- **Smoke humano** (criterio 5): necesita un collar "en silencio". Con el simulador (`SIM_MODE`, tres unidades `900001..900003`, `docs/wialon-module.md:69-70`) todo collar vinculado reporta siempre; para provocar silencio hay que liberar/dejar de polear o sembrar `last_message_at` viejo a mano en Postgres. La spec debe describir el procedimiento.

---

## 10. Ficheros que la spec debería declarar

**`files_affected` (según opción; A2 marcado con ★, B con ◆, comunes sin marca):**
- `backend-pet-tracker/src/workers/ingestion.drizzle.store.ts` ★◆
- `backend-pet-tracker/src/workers/ingestion-store.ts` ★◆ (comentario `:44-52` / método nuevo)
- `backend-pet-tracker/src/pipeline/constants.ts` (umbral nombrado)
- `backend-pet-tracker/src/modules/devices/infrastructure/mappers/device-status.mapper.ts` (A)
- `backend-pet-tracker/src/modules/devices/domain/` (función pura nueva, A) — o `src/pipeline/`
- `backend-pet-tracker/src/modules/pets/infrastructure/pets.controller.ts` (A, `:110`)
- `backend-pet-tracker/src/modules/devices/infrastructure/pet-device.controller.ts` (A, `:43`)
- `backend-pet-tracker/src/modules/devices/infrastructure/devices.controller.ts` (A, `:41`)
- `backend-pet-tracker/src/workers/<nuevo>-scheduler.service.ts`, `.env.example`, `docs/conventions.md`, `docs/verification.md` ◆
- `docs/data-model.md` (`:53`, nota sobre `connectivity`) ★
- `mobile-pet-tracker/src/screens/home/index.tsx` (`:445-461` tres estados; píldora)
- `mobile-pet-tracker/src/components/pet-hero-header.tsx` (si la píldora entra por prop)
- `mobile-pet-tracker/src/utils/device-connectivity.ts` (+ estado `offline`)
- `mobile-pet-tracker/src/i18n/catalog.ts`
- `mobile-pet-tracker/src/api/types.ts` (opcional: estrechar `connectivity`)
- `mobile-pet-tracker/src/app/(tabs)/map.tsx` (solo si G4 alinea el umbral)
- `docs/ui-guidelines.md` (si se enmienda: componente de píldora / radio)
- **No** `mobile-pet-tracker/src/app/(tabs)/home.tsx` (P3).

**Tests candado a declarar (con su delta):**
- Backend: `test/ingestion.e2e-spec.ts:218` (★ `toBe('online')` → `toBeNull()`); `src/modules/devices/infrastructure/mappers/device-status.mapper.spec.ts:8-17,21` (A); `src/modules/pets/infrastructure/pets.controller.spec.ts:216-235` (A); candados de claves que deben seguir verdes: `test/devices.e2e-spec.ts:274-280,315-320`, `test/device-subscriptions.e2e-spec.ts:354-356`, `test/pets.e2e-spec.ts:64-89,425-433`, `src/modules/pets/infrastructure/mappers/pet-profile-response.mapper.spec.ts:38-82`, `src/modules/pets/application/use-cases/get-pet.use-case.spec.ts:98-126`, `src/db/schema/devices.schema.spec.ts:35-90`; `src/workers/positions-consumer.service.spec.ts:402-406,431-434` (verde: no incluye connectivity); `src/workers/ingestion-scheduler.service.spec.ts` (calco para ◆).
- Móvil: `src/providers/__tests__/language-provider.test.tsx:41-42`; `src/__tests__/ui-language.test.ts:84,167,428,437`; `src/__tests__/ui-copy-table.ts:45-96,330-375`; `src/screens/home/index.test.tsx:130-152` (slot = 2 hijos), `:594-660` (R8 collar-status, el `it` de `:640-658` cambia de semántica), `:864-935`, `:1146-1170`, `:1198-1225`; `src/components/__tests__/pet-hero-header.test.tsx:269-283,342-349`; `src/utils/device-connectivity.test.ts:3-19`; `src/screens/pairing/index.test.tsx:512,546`; `src/__tests__/design-drift.test.ts:203-220,331-355`; `src/__tests__/consistency-classnames.test.ts` (radios); `src/app/(tabs)/__tests__/map.test.tsx:548-571,582-585` (solo si G4).

## Recomendación
- Derivar en backend (A2): función pura + constante en `src/pipeline/constants.ts` + mapper con `now`; borrar el write de `:97`; tres estados en la API; móvil sin reloj.
- Umbral: que el humano elija entre 120 s (coherencia con el mapa, margen fino) y 300 s (robusto, plan 007) con la fórmula "cadencia + 60 s poller + 15 s consumer" escrita en la constante.
- Píldora en `pet-hero-caption` encima del nombre vía prop formateada por Home (patrón `highlight`), nunca en el slot; skeleton/ausente cuando `pet === null`.
