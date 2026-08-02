---
feature: "trips-activity"
status: approved   # draft | spec_ready (pendiente gate humano) | approved
tags: [harness, spec]
---

# Diseño — [[trips-activity]]

> Ver [[requirements]] para los requisitos que este diseño implementa y
> [[../../docs/architecture|architecture]] para las reglas de capas del proyecto.
>
> §Decisiones propuestas resuelve las **15 decisiones abiertas (a)-(o)** de
> `progress/explore_trips-activity.md` como **D1-D15**. El explorer no decidió:
> aquí cada una lleva opciones reales con su coste y **una propuesta explícita
> del `spec_author`**. **Ninguna está confirmada** — el humano dispone en el
> gate de [[requirements]] §Aprobación.

## Decisiones propuestas (validar en el gate)

### D1 (a) — Puerto de lectura de posiciones para el agregador y los endpoints

La decisión de mayor impacto: condiciona el módulo, el diff sobre código `done`
y la duplicación.

| Opción | Coste | Beneficio |
|---|---|---|
| **A** — reutilizar `PositionHistoryReader` de #9 | añadir `exports: [POSITION_HISTORY_READER, POSITIONS_READ_DOC_CLIENT]` a `positions.module.ts` (feature `done`); el módulo de #10 pasa a depender de un módulo HTTP; bucle de paginación en el consumidor | cero duplicación de la Query y del `DocumentClient` |
| **B** — puerto propio `DailyPositionsReader` de #10 | un segundo adaptador Dynamo (~40 líneas) y un tercer `DocumentClient` en el proceso | precedente literal doble del repo; `PositionsModule` intacto; contrato honesto ("un día entero ya paginado") |
| **C** — extraer reader + mapper + client a `src/positions-read/` | refactor que mueve archivos de una feature `done`; hay que re-verificar los e2e de #9; ninguna feature lo pidió | sin duplicación y sin acoplamiento invertido |

**Propuesta: B.** Tres razones. (1) Precedente literal y doble: `IngestionStore`
de #8 (D14: *"NO se extienden DeviceRepository/PetRepository — sus contratos
estan cerrados por specs aprobadas y las consultas del worker son de otro
consumidor"*) y `LastPositionReader` de #9, que repite el criterio. (2) La
objeción del "mapper duplicado" **no aplica**: el mapper de #9
(`position-response.mapper.ts`) produce el **contrato HTTP público**
(`StoredPosition`, camelCase, `speedKmh: number | null`), mientras el adaptador
de #10 produce el **tipo del núcleo puro** (`ProcessedPosition`,
`speedKmh?: number`). Son dos destinos distintos, no dos copias del mismo. (3) La
alternativa A dejaría a un `@Injectable` con tick horario dependiendo de un
módulo HTTP — exactamente lo que D6 de #9 evitó en sentido inverso.

En **las tres** opciones, `ListPositionsUseCase` **no** se reutiliza:
`MAX_RANGE_HOURS = 24` lanza `RangeTooLargeError` ante un día local de 25 h por
DST, filtra `low_accuracy` por defecto y emite cursores atados a una huella de
consulta. **Confirmar B, o elegir A/C.**

### D2 (b) — Desfase del cron nocturno y política de "hoy/ayer al vuelo"

El `cron(15 2 * * ? *)` (02:15 UTC) que hereda el plan 006 es un **bug latente
real**: para un owner en `America/Mexico_City` (UTC−6) las 02:15 UTC del día D
son las 20:15 del día D−1 **local**, así que el agregador computaría "ayer" de
un día local que **aún no ha cerrado** (cierra a las 06:00 UTC del día D) y
persistiría una fila truncada, que además nunca se recomputaría.

| Opción | Coste |
|---|---|
| Cron único a hora fija tardía (p. ej. 14:00 UTC) + fallback al vuelo | simple, pero las filas llegan hasta 14 h tarde para zonas al este y sigue habiendo aritmética de offsets que revisar cuando cambien las reglas IANA |
| **Tick horario que procesa, por owner, el último día local cerrado** | 24 barridos/día en vez de 1; se mitiga saltando las mascotas que ya tienen fila fresca (una consulta a Postgres por mascota) |
| N crons, uno por timezone | rechazable: multiplica jobs y hay que reconfigurar cuando entra un owner en una zona nueva |

**Propuesta: tick horario** (R14/R15), más **cómputo al vuelo de "hoy"** en el
endpoint (R20). Con él, cada mascota recibe su fila dentro de la hora siguiente
al cierre de su día local, en **cualquier** zona, sin aritmética de offsets ni
esquinas de DST, y `runOnce()` sigue siendo invocable desde los tests. Se
documenta como **desviación explícita del plan 006 §Paso 3**.

Consecuencias que la spec fija:
1. **"Hoy" es el día local del *owner*** de la mascota, no el del usuario que
   consulta ni UTC (un `family` en otra zona vería otro día y las filas
   persistidas dejarían de casar con el cálculo al vuelo).
2. El día parcial se computa sobre `[startOfToday, min(now, endMs))` y
   `restMinutes` sale de la **ventana observada**, no de 24 h (R8).
3. Un día pasado **sin fila** sale como `source: 'missing'` con métricas `null`
   — no se computa al vuelo (acota el coste, D13) y no se falsea con ceros.
4. Solo se computa al vuelo **un** día por petición.

**Confirmar el tick horario, o elegir el cron a hora fija.**

### D3 (c) — Aritmética de timezone sin librería

Herramienta disponible verificada por el explorer: solo `Intl`. `Temporal` es
`undefined` en Node v24.16.0 y no hay `date-fns`/`luxon`/`dayjs` en
`package.json`.

- **Opción 1 — helper puro propio** `src/pipeline/local-day.ts` (~40 líneas)
  con `Intl.DateTimeFormat('en-CA')` + `formatToParts`. Sin dependencia nueva.
- **Opción 2 — añadir `@date-fns/tz` o `luxon`**: menos esquinas, pero es una
  dependencia nueva en una feature que no tiene ninguna otra, y R23 la prohíbe.

**Propuesta: opción 1**, con dos reglas de diseño que eliminan las esquinas de
DST en vez de parchearlas:
- `endMs` de un día es el `startMs` **del día siguiente**, nunca
  `startMs + 86_400_000`. Así un día de 23 h o 25 h sale correcto *por
  construcción* (R7 lo verifica con `Europe/Madrid` 2026-03-29 y 2026-10-25).
- `startMs` se resuelve iterando: instante candidato desde `Date.UTC(y, m−1, d)`,
  corrección por el offset que `timeZoneName: 'longOffset'` reporta en ese
  instante, y **verificación** re-aplicando `localDayOf`. Una segunda iteración
  basta porque el offset cambia como mucho una vez al día.
- Hora local inexistente (salto de primavera a medianoche, p. ej.
  `America/Santiago`): `startMs` es el primer instante que ya pertenece al día
  local, es decir el propio salto. Hora local repetida (otoño): `startMs` es la
  **primera** ocurrencia. Ambas quedan cubiertas por la definición
  "`endMs` = `startMs` del día siguiente".

Consecuencia: la firma del plan `computeDailyActivity(positions, tzUserOffset)`
**se sustituye** por `computeDailyActivity(positions, {startMs, endMs})` (R8) —
un offset fijo no sobrevive a un día con cambio de horario.
**Confirmar el helper propio, o autorizar una dependencia de fechas.**

### D4 (d) — Idempotencia del upsert y su interacción con #13

`INSERT ... ON CONFLICT (pet_id, date) DO UPDATE SET` (`onConflictDoUpdate` de
Drizzle). Puntos que la spec cierra (R11, R14):

- **¿Sobrescribe siempre o solo si `computed_at` es más viejo?** Propuesta:
  **sobrescribe siempre** cuando llega a ejecutarse. El cómputo es determinista
  sobre lo que hay en DynamoDB, así que re-correr solo puede *mejorar* el
  resultado (posiciones ingeridas con retraso). La condición de "no re-hacer
  trabajo" vive un nivel más arriba, en el **skip** de R14 (si ya hay fila con
  `computed_at` posterior al cierre del día, no se lee ni se computa).
- **`time_away_minutes`**: el `DO UPDATE SET` lleva lista **explícita** de
  columnas y **excluye** esa. Sin esa exclusión, el primer re-run de #10 tras
  un cierre de #13 borraría su trabajo. Se deja escrito ahora, no cuando #13
  lo descubra en producción.
- **Solape**: guard en memoria (`this.running`), precedente `PollerService`.
  Un lock en base sería over-engineering en proceso único.
- **Fallo a mitad del barrido**: try/catch **por mascota** y seguir (precedente
  literal del poller de #8), con `warn` y contador `failed` en el resumen. Una
  transacción global convertiría un `pet` borrado en una noche entera perdida.

**Confirmar, o pedir "solo sobrescribir si es más reciente".**

### D5 (e) — Tipo de entrada de `groupTrips` y filtrado de flags

Tres opciones para el tipo: (1) `ProcessedPosition[]` (fiel al plan; el
adaptador de D1 ya lo produce, cero adaptación en el borde); (2)
`StoredPosition[]` (el tipo público de #9 — haría que el núcleo puro dependa
del contrato HTTP de un módulo: viola la dirección de dependencias);
(3) un tipo estructural mínimo propio de `trips.ts` (más desacoplado, un tipo
más que mantener).

**Propuesta: (1) `ProcessedPosition[]`.** Y el fixture `walk.json` (que es
`RawPosition[]` **crudo**) pasa por `normalize()` antes de `groupTrips` en el
test: así la cadena del test es exactamente la del pipeline real y el fixture
ejercita además el descarte del `(0,0)` y del duplicado.

**Filtrado de flags — la inconsistencia que hay que resolver a propósito:**

- `suspect_jump`: **excluido del cálculo de distancia** (regla literal del
  plan), pero el punto **sí** cuenta para la continuidad temporal del paseo y
  **sí** aparece en `path`. Además no se usa para el criterio de "movimiento por
  distancia implícita", que sería circular (R2).
- `low_accuracy`: **NO se filtra antes de segmentar** (R5). #9 lo oculta por
  defecto en su endpoint, pero eso es una decisión de **presentación** (mapa
  limpio, D1 de #9), no de cómputo: un punto impreciso sigue siendo evidencia
  de que la mascota se movió, y descartarlo abriría gaps artificiales que
  partirían paseos reales por la regla de cierre de 15 min (R3). El plan 006
  solo manda excluir `suspect_jump`, y solo de la distancia.

Alternativa: filtrar `low_accuracy` también en el cómputo, por coherencia
superficial con #9 — a cambio de paseos fragmentados en zonas de mala cobertura,
que es justo donde la mascota está paseando. **Confirmar la asimetría, o pedir
el filtro.**

### D6 (f) — Mascotas sin device, sin posiciones o sin owner

| Caso | Propuesta |
|---|---|
| Sin `pet_devices` activo | **no** se escribe fila; el endpoint la reporta `source: 'missing'` (no hay fuente de datos, escribir ceros sería inventar) |
| Con collar y **cero** posiciones ese día | **sí** se escribe fila de ceros (`observedMinutes = 0` ⇒ `restMinutes = 0`). Distingue "reposo confirmado" de "no computado" y hace continuo el gráfico de 7 días |
| Sin owner activo, >1 owner activo, o `timezone` no-IANA | se agrega con `'UTC'` + `warn` (precedente R5 de #9: degradar con `warn`, nunca propagar). Desempate: `pet_users.created_at` ascendente |
| Borrada entre el barrido y el upsert | la FK falla ⇒ try/catch por mascota (D4), `warn`, el barrido sigue |

La consulta "mascotas con collar activo + timezone del owner" **no existe hoy**
en ningún repositorio: `IngestionStore.listActiveAssignments()` devuelve
`(deviceId, petId, unitId, ingestWatermark)` sin owner, y `IngestionModule` no
la exporta. **Confirmar la tabla, en especial la fila de ceros.**

### D7 (g) — Mecanismo y variable de entorno del cron

- **Mecanismo**: cáscara propia `ActivitySchedulerService`
  (`OnApplicationBootstrap` + `SchedulerRegistry.addInterval`), calco de
  `IngestionSchedulerService`. **`addInterval` de 1 h, no `addCronJob`**: con
  el tick horario de D2 no hace falta una hora fija, así que no se introduce el
  primer `CronJob` del repo ni una expresión cron que revisar. `@Cron`
  decorador queda descartado: arrancaría en los e2e que instancian `AppModule`,
  que es exactamente lo que #8 evitó.
- **Env var**: `ACTIVITY_AGGREGATOR_ENABLED` **propia**, no reutilizar
  `POLLER_ENABLED` (acopla dos workers con ciclos de vida distintos: se querrá
  apagar la ingesta sin apagar la agregación y viceversa). Coste: una entrada
  más en `docs/conventions.md` y `.env.example`, obligatoria en el **mismo
  commit** (R22, regla dura de `AGENTS.md` §4).
- **Cadencia**: constante nombrada `ACTIVITY_TICK_INTERVAL_MS = 3_600_000`, no
  env — los tests invocan `runOnce()` y no necesitan acelerar el reloj
  (precedente literal D11 de #8).

**Confirmar, o pedir `addCronJob` con hora fija / reutilizar `POLLER_ENABLED`.**

### D8 (h) — Resolución del owner y su timezone

**Propuesta: puerto propio `ActivityStore`** (token `ACTIVITY_STORE`) en el
dominio del módulo, con implementación Drizzle en su infraestructura:

```
listPetsToAggregate(): Promise<{petId, timezone}[]>   // R13, una sola query
findFreshRow(petId, date, notBeforeMs): Promise<boolean>  // skip de R14
upsertDailyActivity(row): Promise<void>               // R11
findDailyRange(petId, fromDay, toDay): Promise<DailyActivityRow[]>  // R20
findOwnerTimezone(petId): Promise<string>             // "hoy" del owner, R18/R20
```

`listPetsToAggregate` hace **un** join:
`pet_devices (released_at IS NULL) → pets → LEFT JOIN pet_users (role='owner'
AND status='active') → users`, ordenando por `pet_users.created_at` para el
desempate. `LEFT JOIN` a propósito: una mascota sin owner activo debe salir en
la lista con `timezone` nulo (→ `'UTC'` + `warn`), no desaparecer del barrido.

Descartadas: extender `PetRepository` (contrato cerrado por la spec aprobada de
#5 — criterio ya aplicado dos veces, en #8 y #9) y reutilizar `IngestionStore`
exportándolo (mezcla el store de ingesta con el de actividad y obliga a editar
`src/workers/`, que R23 prohíbe). **Confirmar el puerto propio.**

### D9 (i) — Tipos y unidades de las columnas de `activity_daily`

El plan lista nombres pero no tipos completos. Propuesta en la tabla de R10.
Los puntos que merecen decisión, no solo transcripción:

- **`distance_m integer`** en metros enteros (`Math.round`). Un `numeric` para
  centímetros de GPS sería precisión falsa.
- **`avg_walk_minutes numeric(6,2)`** — **desviación del plan**, que dice `int`.
  Con dos paseos de 5 y 6 min la media es 5,5 y redondearla a 6 infla el KPI un
  9 %. Alternativa: `integer` literal del plan, más simple, error acotado a
  ±0,5 min. **Es la desviación más discutible de esta spec.**
- **`first_walk_at` / `last_walk_at` `timestamptz`** (son instantes, no horas
  locales; `docs/data-model.md`: *"`timestamptz` para instantes, `date` para
  fechas de calendario"*). Alternativa descartada: `time`, que perdería el día
  y obligaría a reconstruirlo.
- **`date date`** en la **timezone del owner**. Consecuencia aceptada y
  documentada: si el owner cambia de timezone, las filas históricas conservan
  la zona con la que se computaron; no se recomputan (está en §Fuera de alcance).
- **FK `ON DELETE CASCADE`** (precedente `pet_users`), `CHECK` de no
  negatividad, sin índice manual extra (la PK cubre `pet_id` como prefijo).

**Confirmar los tipos, en particular `avg_walk_minutes`.**

### D10 (j) — Dónde viven las funciones puras

**Propuesta: `src/pipeline/`** — `trips.ts`, `activity.ts`, `local-day.ts`, más
los siete umbrales en `constants.ts`. Razones: lo dice el plan; es el sitio de
las funciones puras portables a Lambda (`docs/architecture.md` §Adaptación
local); la cabecera de `constants.ts` ya declara ser *"fuente unica: #10
(trips), #11 (geocercas) y #12 (alertas) los importan de aqui"* y la de `geo.ts`
dice literalmente que *"#10 reutiliza esta haversine"*; y hay **dos**
consumidores (el agregador y los controllers), así que meterlas dentro del
módulo obligaría a cruzar dependencias.

Sub-decisión: las **políticas de API y de worker** (31 días, tope de páginas,
cadencia del tick, tamaño de página) **no** son umbrales de pipeline puro y van
a `src/modules/activity/activity.constants.ts` — precedente literal
`positions.constants.ts` de #9 con `MAX_RANGE_HOURS`. El objetivo de 60 min del
anillo de progreso es UI y no entra en ningún sitio del backend.
**Confirmar.**

### D11 (k) — Contrato de los tres endpoints

`feature_list.json` §files_affected apunta a `src/modules/positions/`, pero el
`@Controller('pets/:petId/positions')` de #9 tiene prefijo fijo: `trips` y
`activity/daily` necesitan otros controllers de todas formas, y R23 prohíbe
tocar el módulo de #9. **Propuesta: módulo nuevo `src/modules/activity/`** con
dos controllers (`pets/:petId/trips` y `pets/:petId/activity`). Desviación de
`files_affected` declarada aquí.

Detalles que el plan no fija y esta spec cierra:

| Punto | Propuesta | Alternativa |
|---|---|---|
| `n` de `/trips/:n` | entero **0-based**, índice dentro del día | 1-based (más "humano", pero rompe la correspondencia directa con el array de `/trips`) |
| `n` fuera de rango | **404** con `code: 'TRIP_NOT_FOUND'` | 400 (`n` es sintácticamente válido: el recurso simplemente no existe) |
| `date` ausente en `/trips` | **hoy** del owner (DX; precedente `to = now` de #9) | 400 exigiéndolo |
| Formato de tiempo en la respuesta | **epoch ms** cuando el dato viene de DynamoDB (`startTs`, `endTs`, `path[].ts` — coherente con `ts` de #9); **ISO-8601** cuando viene de una columna `timestamptz` (`firstWalkAt`, `lastWalkAt` — coherente con `lastCommunicationAt`) | todo ISO-8601 (rompería la simetría con `/positions`) |
| Día sin fila ni "hoy" | entrada con métricas `null` y `source: 'missing'` | ceros (miente: confunde reposo con no-computado) u omitir el día (obliga al cliente a rellenar huecos) |
| `weekComparison` | 3 claves (`distanceM`, `activeMinutes`, `walkCount`) con delta % a 1 decimal, `null` si no hay base o la base es 0 | incluir `restMinutes`; o forma anidada `{metric: {current, baseline, deltaPct}}` (más informativa, más superficie de contrato) |
| Código de rango excedido | **reusar `RANGE_TOO_LARGE`** de #9 (mismo significado, otro umbral) | `ACTIVITY_RANGE_TOO_LARGE` (explícito, un código más para el cliente) |
| Índice estable | requisito explícito (R19), derivado del determinismo de `groupTrips` | — |

**Confirmar la tabla completa, o corregir filas sueltas.**

### D12 (l) — `activitySummary` del perfil de mascota (#5 R8)

`pet-profile-response.mapper.ts` declara el campo tipado como `null` literal, y
la spec aprobada de #5 R8 dice que *"features posteriores solo sustituyen `null`
por valores"*, nombrando a #10. Rellenarlo obliga a tocar `src/modules/pets/**`
y a actualizar **tres** tests que hoy afirman `toBeNull()`
(`pet-profile-response.mapper.spec.ts`, `test/pets.e2e-spec.ts:360`,
`test/devices.e2e-spec.ts:630`).

**Propuesta: FUERA de alcance de #10.** Cuatro razones:
1. Es el **paso 5 del plan 006**, que es móvil — el mismo recorte que ya
   aplicaron #8 y #9 sin objeción.
2. Rellenarlo haría que `GET /v1/pets/:petId` — la pantalla más cargada de la
   app — dispare una `Query` a DynamoDB del día en curso **en cada carga de
   perfil**. Es un coste de latencia que ninguna feature ha pedido y que el
   plan no dimensionó.
3. El cliente obtiene exactamente el mismo dato con
   `GET /v1/pets/:petId/activity/daily?from=hoy&to=hoy`, que ya devuelve
   `source: 'computed'` (R20).
4. Esta feature ya trae una migración, tres módulos puros, un worker y tres
   endpoints. Añadir un diff sobre una feature `done` y tres tests ajenos
   aumenta la superficie de regresión sin ganancia funcional.

**Si el gate lo quiere dentro**, el camino está trazado por el precedente de
cómo #7 rellenó `device`: parámetro opcional en `toPetProfileResponse`
(`activitySummary: ActivitySummary | null = null`), shape
`{distanceM, activeMinutes}` de **hoy**, ni una clave nueva, y actualizar los
tres tests — y R23 debe reescribirse antes de implementar.
**Confirmar "fuera", o reabrir el alcance.**

### D13 (m) — Topes defensivos de lectura

- `ACTIVITY_PAGE_LIMIT = 1000` (mismo valor que #9; un día a 30 s son ~2 880
  puntos ⇒ 3 páginas).
- `ACTIVITY_MAX_PAGES_PER_DAY = 10` — margen 3x sobre el caso nominal; al
  alcanzarlo se computa con lo leído + `warn`, **no** se lanza (precedente
  `MAX_DRAIN_ITERATIONS = 50` de #8). Cubre la condición de STOP del plan sobre
  el límite de 1 MB por página sin convertir un día raro en un 500.
- **Como máximo un día computado al vuelo por petición** (el de hoy). Sin este
  tope, un rango de 31 días sin filas dispararía hasta 93 `Query` en una sola
  petición HTTP. Con él, el coste de `/activity/daily` es "≤ 31 filas de
  Postgres + ≤ 10 Query de DynamoDB", acotado y predecible.
- `/trips?date=` de un día pasado **siempre** relee DynamoDB (el plan excluye
  cachear en MVP): coste ≤ 10 Query por petición, acotado por el mismo tope.

**Confirmar los tres números.**

### D14 (n) — Fixtures de test

**Propuesta**: `walk.json` (204 puntos del simulador de #8, con glitch `(0,0)`,
salto de ~1 000 m y duplicado) se reutiliza tal cual, pasado por `normalize()`;
los tres sintéticos del plan (**reposo total**, **salto absurdo aislado**,
**gap de 20 min**) se construyen **en el propio `.spec.ts`** con un helper local
`makeTrack({...})`, no se versionan como `.json`. Razón: son series de 5-15
puntos cuya gracia es el umbral que ejercitan; un `.json` de 8 puntos es menos
legible que el generador que lo produce, y el valor queda a la vista junto al
assert. Alternativa: versionarlos en `__fixtures__/` por simetría con
`walk.json` — a cambio de tres archivos que hay que abrir para entender un test.
**Confirmar.**

### D15 (o) — Documentación de cierre

En el mismo branch (R22):
- `docs/conventions.md` §Variables de entorno **+** `.env.example`:
  `ACTIVITY_AGGREGATOR_ENABLED`, en el **mismo commit** que la introduce.
- `docs/data-model.md`: **afinar** la fila `activity_daily` con los tipos reales
  de R10 — la fila y el arco del ERD ya existen, no se añade tabla.
- `docs/wialon-module.md` §"Pipeline puro y umbrales": añadir los siete
  umbrales de R1 a su tabla de constantes, que si no queda incompleta.
- **No hay OpenAPI en el repo** (`find -iname '*openapi*'` vacío): el paso 6 del
  plan no aplica; el contrato lo fija esta spec, como en #9.

**Confirmar la lista de docs.**

## Decisiones técnicas

- **Módulo nuevo `src/modules/activity/` con las tres capas, y el agregador
  dentro de él** — sirve a R11-R21 (D8, D11). El scheduler es un *driving
  adapter* más, exactamente igual que un controller: ambos invocan casos de uso
  de la capa `application`. Meterlo en `src/workers/` (donde vive
  `IngestionModule`) obligaría a exportar el puerto `ActivityStore` de un lado
  a otro, o a que un worker importara un módulo HTTP. `IngestionModule` vive en
  `src/workers/` porque la ingesta **no tiene** módulo HTTP propio; #10 sí lo
  tiene. Lo que se reutiliza de #8 es el **patrón** (cáscara gated +
  `runOnce()`), no el código.

- **Cuatro archivos puros en `src/pipeline/`, cero imports de framework** —
  sirve a R1-R9 (D10). `trips.ts` (`groupTrips`), `activity.ts`
  (`computeDailyActivity`), `local-day.ts` (`localDayOf`, `localDayRange`,
  `InvalidTimeZoneError`) y la ampliación de `constants.ts`. Reutilizan
  `haversineMeters` de `geo.ts` y los nombres de flag ya existentes. El
  reviewer puede comprobar la pureza con un `grep` de imports: solo `./geo`,
  `./constants` y `./types`.

- **Dos puertos en el dominio del módulo** — sirve a R12, R13 (D1, D8).
  `DailyPositionsReader` (DynamoDB, un día ya paginado) y `ActivityStore`
  (Postgres: barrido, upsert, lectura de rango, timezone del owner). Los casos
  de uso dependen de las interfaces; `application/` no importa `@aws-sdk/*` ni
  `drizzle-orm` (verificable por el reviewer).

- **`DynamoDBDocumentClient` propio del módulo** — sirve a R12. Provider
  `ACTIVITY_DAILY_DOC_CLIENT` (Symbol en `activity.constants.ts`) construido
  con `DynamoDBDocumentClient.from(client)` sobre el `DYNAMODB_CLIENT` que
  `AwsModule` (`@Global()`) ya exporta — misma técnica que #8 y #9, sin
  importar ninguno de sus módulos. Nombres de tabla y claves desde
  `@/aws/constants`, nunca literales nuevos.

- **Errores de dominio → HTTP en un mapper de infraestructura** — sirve a R17,
  R19. En `domain/errors/activity.errors.ts`, sin imports de `@nestjs/common`:

  | Error de dominio | HTTP | Código en body |
  |---|---|---|
  | `InvalidDateError` | 400 | `INVALID_DATE` |
  | `InvalidRangeError` (`from > to`) | 400 | `INVALID_RANGE` |
  | `RangeTooLargeError` (> 31 días) | 400 | `RANGE_TOO_LARGE` |
  | `InvalidTripIndexError` (`n` no entero ≥ 0) | 400 | `INVALID_TRIP_INDEX` |
  | `TripNotFoundError` (`n` ≥ nº de paseos) | 404 | `TRIP_NOT_FOUND` |

  El `404` de mascota inexistente o ajena no aparece aquí: lo produce el guard
  antes de entrar al handler, y **no** lleva `code` — así el cliente distingue
  los dos 404 por el body.

- **`weekComparison` como función pura del dominio** — sirve a R21.
  `domain/week-comparison.ts`: recibe dos arrays de números y devuelve
  `{distanceM, activeMinutes, walkCount}` con los deltas o `null`. Es
  aritmética: se testea sin I/O, sin base y sin reloj.

- **Constantes de política en un solo archivo del módulo** — sirve a R12, R15,
  R17, R20 (D10, D13). `activity.constants.ts` en la raíz del módulo (no en
  `infrastructure/`, porque `application` y `domain` también las consumen y la
  regla de dependencia les prohíbe mirar hacia afuera — precedente literal de
  `positions.constants.ts` de #9): `ACTIVITY_MAX_RANGE_DAYS = 31`,
  `ACTIVITY_DEFAULT_RANGE_DAYS = 7`, `ACTIVITY_BASELINE_DAYS = 7`,
  `ACTIVITY_PAGE_LIMIT = 1000`, `ACTIVITY_MAX_PAGES_PER_DAY = 10`,
  `ACTIVITY_TICK_INTERVAL_MS = 3_600_000`, `ACTIVITY_TICK_NAME`,
  `ACTIVITY_DAILY_DOC_CLIENT`.

- **DTOs zod con `z.strictObject` y fechas de calendario** — sirve a R17.
  `ListTripsQuerySchema` (`date?`) y `GetDailyActivityQuerySchema`
  (`from?`, `to?`), ambos con el patrón `YYYY-MM-DD` **más** validación de que
  la fecha existe (`2026-02-30` es 400). Parseo explícito en el borde HTTP con
  `safeParse` + `BadRequestException`, como `parseQuery()` de #9 — no hay
  `ZodValidationPipe` global en el repo.

- **Un mapper explícito por respuesta, sin spread** — sirve a R18, R19, R20.
  Lista de campos escrita a mano, como el mapper de #9: una columna nueva en
  `activity_daily` (p. ej. cuando #13 escriba `time_away_minutes`) no se filtra
  al contrato público por accidente, y `computed_at` nunca sale.

## Estructura de capas

```
backend-pet-tracker/src/
├── pipeline/
│   ├── constants.ts                       ← EDITADO: +7 umbrales (R1)
│   ├── trips.ts (+ .spec.ts)              ← groupTrips, tipo Trip (R2-R6)
│   ├── activity.ts (+ .spec.ts)           ← computeDailyActivity (R8, R9)
│   └── local-day.ts (+ .spec.ts)          ← localDayOf/localDayRange (R7)
│
├── db/
│   ├── schema/activity.schema.ts          ← activityDaily (R10)
│   ├── schema/index.ts                    ← +1 linea de re-export
│   └── migrations/0005_activity_daily.sql ← unica migracion (R10)
│
└── modules/activity/
    ├── domain/
    │   ├── entities/daily-activity.entity.ts   ← DailyActivityRow, DayEntry (tipos puros)
    │   ├── errors/activity.errors.ts           ← 5 errores tipados (R17, R19)
    │   ├── week-comparison.ts                  ← funcion pura de deltas (R21)
    │   └── repositories/
    │       ├── activity-store.ts               ← interface + ACTIVITY_STORE (R11, R13, R20)
    │       └── daily-positions.reader.ts       ← interface + DAILY_POSITIONS_READER (R12)
    ├── application/
    │   ├── dto/list-trips.dto.ts               ← zod strictObject (R17)
    │   ├── dto/get-daily-activity.dto.ts       ← zod strictObject (R17)
    │   └── use-cases/
    │       ├── list-trips.use-case.ts          ← R18, R19
    │       ├── get-daily-activity.use-case.ts  ← R20, R21
    │       └── aggregate-daily-activity.use-case.ts  ← R14
    ├── infrastructure/
    │   ├── mappers/activity-error.mapper.ts    ← R17, R19
    │   ├── mappers/activity-response.mapper.ts ← R18-R20 (listas explicitas)
    │   ├── repositories/activity.drizzle.store.ts       ← R11, R13, R20
    │   ├── repositories/daily-positions.dynamo.reader.ts ← R12
    │   ├── activity-scheduler.service.ts       ← cascara gated (R15)
    │   ├── trips.controller.ts                 ← pets/:petId/trips (R16, R18, R19)
    │   └── activity.controller.ts              ← pets/:petId/activity (R16, R20, R21)
    ├── activity.constants.ts                   ← politica de API/worker (D10, D13)
    └── activity.module.ts                      ← importa PetsModule; providers
```

## Archivos afectados

- `backend-pet-tracker/src/pipeline/constants.ts` — **editado**: solo se añaden
  las siete constantes de R1; los cinco exports existentes no se tocan.
- `backend-pet-tracker/src/pipeline/{trips,activity,local-day}.ts` (+ `.spec.ts`)
  — nuevos, núcleo puro (R1-R9).
- `backend-pet-tracker/src/modules/activity/**` — módulo nuevo completo, tres
  capas (R11-R21). Todo import que cruza de capa o de módulo usa el alias `@/`
  (`docs/conventions.md` §Imports); relativo solo intra-capa.
- `backend-pet-tracker/src/db/schema/activity.schema.ts` — nuevo (R10);
  `src/db/schema/index.ts` — **una línea** de re-export.
- `backend-pet-tracker/src/db/migrations/0005_*.sql` + `meta/` — generados por
  `pnpm run db:generate`; aplicados con `pnpm exec drizzle-kit migrate` (no hay
  script `db:migrate` en este repo).
- `backend-pet-tracker/src/app.module.ts` — **una línea**: importa
  `ActivityModule`. `ScheduleModule.forRoot()` ya está desde #8.
- `backend-pet-tracker/test/activity.e2e-spec.ts` — nuevo: 404 de guard e IDOR
  en las tres rutas (R16), `/trips` con y sin paseos (R18), `/trips/:n` con
  `path` y 404 (R19), rango > 31 días (R17), `days` con las tres `source` y
  "hoy no persiste" (R20), agregador `runOnce()` sobre Postgres + LocalStack con
  upsert idempotente y `time_away_minutes` preservada (R11, R14). Siembra items
  directamente en DynamoDB con el mismo shape que escribe #8, sin depender del
  poller (precedente `test/positions.e2e-spec.ts`).
- `.env.example`, `docs/conventions.md`, `docs/data-model.md`,
  `docs/wialon-module.md` — R22/D15.
- `progress/impl_trips-activity.md` — reporte del implementer;
  `specs/trips-activity/traceability.md` — completado por el implementer.

Sin dependencias nuevas (`@aws-sdk/lib-dynamodb`, `zod`, `drizzle-orm`,
`@nestjs/schedule` ya están instalados). Una sola variable de entorno nueva
(`ACTIVITY_AGGREGATOR_ENABLED`). Una sola migración.

## Alternativas descartadas

- **Reutilizar `ListPositionsUseCase` de #9 para leer el día**: descartado en
  las tres opciones de D1 — `MAX_RANGE_HOURS = 24` rechaza un día local de 25 h
  por DST, filtra `low_accuracy` (que el cómputo necesita, D5) y emite cursores
  atados a una huella de consulta que aquí no significa nada.
- **`cron(15 2 * * ? *)` literal del plan 006**: descartado (D2) — corre antes
  de que cierre el día local de cualquier owner al oeste de UTC, y persistiría
  filas truncadas que nunca se recomputan.
- **`computeDailyActivity(positions, tzUserOffset)` (firma del plan)**:
  descartada (D3) — un offset fijo no describe un día con cambio de horario. Se
  pasa el rango `{startMs, endMs}` ya resuelto.
- **`endMs = startMs + 86_400_000`**: descartado (D3) — rompe en los días de 23
  y 25 h, que es exactamente el caso que R7 verifica.
- **Añadir `luxon` / `@date-fns/tz`**: descartado (D3) — `Intl` resuelve el
  criterio de aceptación con ~40 líneas puras y R23 prohíbe dependencias nuevas.
  Reabrir solo si aparecen requisitos de calendario más ricos.
- **Escribir ceros para los días sin fila** en `/activity/daily`: descartado
  (D2, D11) — un cero significa "reposo confirmado"; usarlo para "no computado"
  haría que el gráfico de 7 días mienta sin que nadie pueda detectarlo.
- **Computar al vuelo cualquier día pasado sin fila**: descartado (D13) — un
  rango de 31 días vacío dispararía hasta 93 `Query` en una petición HTTP.
- **Filtrar `low_accuracy` antes de segmentar**, por simetría con #9:
  descartado (D5) — abriría gaps artificiales que partirían paseos reales justo
  en las zonas de mala cobertura, que es donde la mascota pasea.
- **Usar la velocidad implícita de un punto `suspect_jump` como prueba de
  movimiento**: descartado (R2) — el punto fue marcado precisamente por superar
  60 km/h implícitos; el argumento sería circular.
- **`ON CONFLICT DO UPDATE SET` con todas las columnas** (o con `excluded.*`):
  descartado (D4) — borraría el `time_away_minutes` que #13 escribirá.
- **Extender `PetRepository` con "dame el owner y su timezone"**: descartado
  (D8) — su contrato lo cerró la spec aprobada de #5 y el consumidor es otro;
  precedente literal en D14 de #8 y en `LastPositionReader` de #9.
- **Exportar `INGESTION_STORE` desde `IngestionModule`** para reaprovechar
  `listActiveAssignments()`: descartado (D8) — no devuelve owner ni timezone,
  mezcla dos dominios y obliga a editar `src/workers/`, que R23 prohíbe.
- **Poner el agregador en `src/workers/`**: descartado (D8, decisiones
  técnicas) — obligaría a que un worker importe el módulo HTTP de #10 o a
  duplicar el puerto `ActivityStore`.
- **`@Cron('15 2 * * *')` como decorador**: descartado (D7) — arrancaría en
  todos los e2e que instancian `AppModule`, que es exactamente lo que la
  cáscara dinámica de #8 evita.
- **Reutilizar `POLLER_ENABLED` para gatear el agregador**: descartado (D7) —
  acopla el ciclo de vida de dos workers independientes.
- **Rellenar `activitySummary` del perfil en esta feature**: descartado (D12) —
  añadiría una `Query` a DynamoDB a la pantalla más cargada de la app y un diff
  sobre una feature `done`; el cliente obtiene el dato de `/activity/daily`.
- **Reutilizar `LOW_ACCURACY_MAX_ACCURACY_M` como umbral de distancia mínima**:
  descartado (R1) — mismo número (100), significados opuestos (precisión GPS vs
  metros recorridos); calibrar uno movería el otro sin que nadie lo note.
- **Exponer `?limit=` o hacer configurable el tope de páginas**: descartado
  (D13) — más superficie de validación sin caso de uso; el tope es defensa
  interna, no una palanca del cliente.
