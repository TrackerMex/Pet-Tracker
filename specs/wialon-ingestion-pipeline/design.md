---
feature: "wialon-ingestion-pipeline"
status: approved   # draft | spec_ready (pendiente gate humano) | approved
tags: [harness, spec]
---

# Diseño — [[wialon-ingestion-pipeline]]

> Ver [[requirements]] para los requisitos que este diseño implementa y
> [[../../docs/architecture|architecture]] para las reglas de capas del proyecto.
> Las decisiones D1-D14 de [[requirements]] §Decisiones propuestas se detallan
> aquí donde hace falta bajarlas a estructura.

## Decisiones técnicas

- **Tres carpetas nuevas fuera de `src/modules/`, mapeadas a capas** — sirve
  a todo. `src/pipeline/` = núcleo puro (≈ domain: tipos
  `RawPosition`/`ProcessedPosition`, `normalize`, `geo.ts`,
  `constants.ts` — cero imports de framework/SDK); `src/integrations/wialon/`
  e `src/workers/` = infraestructura (SDKs, HTTP, cron, colas). La dirección
  de dependencia es siempre hacia `pipeline/`, nunca al revés. Portar a
  Lambdas después es empaquetar `workers/` — la lógica no se toca
  (architecture.md §Adaptación local).

- **Puerto `WialonClient` con molde TokenService/AwsModule** — sirve a R1-R4
  (D2). `src/integrations/wialon/wialon-client.interface.ts` define
  `WialonClient` (`listUnits(): Promise<{unitId, name}[]>`,
  `getMessages(unitId, fromTs, toTs): Promise<RawPosition[]>`) + Symbol
  `WIALON_CLIENT` junto a la interface (regla de conventions.md §Tokens).
  Provider `useFactory(ConfigService)` en `IngestionModule` elige fake o
  real (R1) — mismo estilo que los providers de `AwsModule`.

- **Fake stateless indexado por slot** — sirve a R2, R3 (D2). La posición
  del slot `k` (bloques de 30 s desde epoch) se computa con un PRNG propio
  mulberry32 sembrado con `hash(SIM_SEED, unitId, k)`: sin estado entre
  llamadas, reinicio-safe, intervalos solapados coherentes. El "paseo" se
  deriva acumulando desplazamientos deterministas de los slots previos del
  mismo día simulado (ventana acotada para no recomputar historia infinita);
  anomalías (salto, duplicado) se inyectan en slots `k % 50 == constante` —
  deterministas también. Constante `SIM_STEP_SECONDS = 30` en el fake.

- **Tipos de telemetría en `src/pipeline/types.ts`** — sirve a R4, R5. El
  plan los ponía en `packages/shared/` (no hay monorepo): viven con el
  pipeline porque `normalize` es su primer consumidor y `integrations/` ya
  puede importarlos (infra → núcleo, dirección correcta). `RawPosition =
  {lat, lng, ts, speedKmh?, course?, altitude?, sats?, accuracyM?,
  batteryPct?}`; `ProcessedPosition` añade `flags: string[]`.

- **`IngestionModule` en `src/workers/` con puerto propio `IngestionStore`**
  — sirve a R8-R17 (D14). Estructura:
  - `ingestion-store.ts` — interface + Symbol `INGESTION_STORE`:
    `listActiveAssignments(): Promise<{deviceId, petId, unitId,
    ingestWatermark}[]>`, `advanceWatermark(deviceId, ts)`,
    `isAssignmentActive(deviceId, petId)`, `getDeviceBattery(deviceId)`,
    `updateDeviceTelemetry(deviceId, {batteryPct, lastMessageAt})`,
    `updatePetLastPosition(petId, lastPosition, lastCommunicationAt)`
    (los updates condicionados a ts-más-reciente de R14 se resuelven con
    `WHERE` en la implementación, no en el use case).
  - `ingestion.drizzle.store.ts` — implementación con token `DRIZZLE`.
  - No se extienden `DeviceRepository`/`PetRepository`: contratos cerrados
    por specs aprobadas; el worker es otro consumidor con otras consultas.

- **Poller y consumer como servicios con `runOnce()`/`drainOnce()`; el
  scheduling es una cáscara** — sirve a R8, R12, R19 (D10). `PollerService`
  y `PositionsConsumerService` contienen toda la lógica en métodos
  invocables; `IngestionSchedulerService` (o el propio módulo) registra
  `@Cron`/`@Interval` **solo si** `POLLER_ENABLED === 'true' && NODE_ENV !==
  'test'` (registro dinámico vía `SchedulerRegistry` para que el gating sea
  código, no decorador incondicional). Jest define `NODE_ENV=test` solo — los
  e2e de #5/#7 no se tocan. `ScheduleModule.forRoot()` entra en
  `app.module.ts` (primer cron del repo; #10/#16 lo heredan).

- **QueueUrl resuelta al arrancar por nombre** — sirve a R9, R12. El
  provisioning (#2) no persiste URLs: `GetQueueUrlCommand` con
  `QUEUE_POSITIONS_RAW`/`QUEUE_POSITIONS_RAW_DLQ` (constantes importadas de
  `src/aws/constants.ts`) una vez y se cachea en el servicio. Sin env
  `QUEUE_URL` nueva.

- **Escritura DynamoDB con `@aws-sdk/lib-dynamodb`** — sirve a R13 (D13).
  `DynamoDBDocumentClient.from(client)` sobre el `DYNAMODB_CLIENT` ya
  inyectable; `BatchWriteCommand` en lotes de ≤ 25 con dedupe previo por
  `sk` (R13) y reintento simple de `UnprocessedItems`. Atributos en
  snake_case exactamente como `docs/data-model.md` §DynamoDB;
  `expires_at` en **segundos** (`floor(device_ts/1000) + 90*86400`) — el
  TTL de DynamoDB exige epoch segundos aunque `sk` sea ms.

- **Contrato de eventos congelado (D9)** — sirve a R16, R17. EventBridge
  `PutEvents` al bus `EVENT_BUS_NAME`:

  ```
  position.updated  (uno por mensaje SQS procesado con ≥1 aceptada)
  source: 'pet-tracker'
  detail: {
    version: 1,
    petId: string,
    deviceId: string,
    position: { lat, lng, ts, speedKmh, course, sats, accuracyM,
                batteryPct, flags },   // última aceptada
    batteryPct: number | null
  }

  battery.low  (solo en cruce descendente del umbral 20 — D8)
  source: 'pet-tracker'
  detail: { version: 1, petId: string, deviceId: string, batteryPct: number }
  ```

  Consumidores futuros: 006 (#10), 007 (#12), 010. Cambios de shape ⇒
  `version: 2`, nunca mutación silenciosa. Histéresis batería: dispara < 20
  aquí, #12 cierra con ≥ 30 — documentado también en `docs/wialon-module.md`
  (D1).

- **Flujo del consumidor por mensaje** — sirve a R12-R18. Orden estricto:
  (1) parse zod → inválido: log + no-delete (redrive → DLQ, D3); (2)
  `normalize()`; (3) `BatchWrite` DynamoDB (siempre, R15); (4) si asignación
  activa: leer `battery_pct` previo (para el flanco de R17), actualizar
  `devices` y `pets.last_position` condicionado a ts (R14), emitir
  `position.updated` (+ `battery.low` si cruce) (R16/R17); (5) delete del
  mensaje. Un throw en (2)-(4) deja el mensaje sin borrar (retry por
  redelivery; idempotencia de R13/R14 lo hace seguro) sin bloquear el resto
  del lote (R12).

- **`docs/wialon-module.md` como entregable (D1)** — doc nuevo, corto, con:
  interfaz `WialonClient`, mapeo de la API real (login por token, flags
  65281, `pos.y/x/s/c/sc`), diseño del simulador (semilla, slots, anomalías),
  watermark y umbrales (referenciando `pipeline/constants.ts` como fuente en
  código). Cierra el drift con los chequeos de deriva de planes 005/006/007.

- **Logs estructurados, errores amables (D12)** — sirve a R11, R18.
  `Logger` de Nest con objetos `{scope: 'poller'|'consumer', deviceId?,
  err.code}`; LocalStack caído ⇒ un error por tick estilo
  `describeProvisioningError`, sin stack-spam ni crash.

## Archivos afectados

- `backend-pet-tracker/src/pipeline/types.ts` — nuevo (núcleo): `RawPosition`, `ProcessedPosition`, `DiscardedStat` (R4, R5)
- `backend-pet-tracker/src/pipeline/constants.ts` — nuevo (núcleo): umbrales 60/100/4/20 (R6, R17; los importan #10-#12)
- `backend-pet-tracker/src/pipeline/geo.ts` — nuevo (núcleo): haversine (R6; lo reutiliza #10)
- `backend-pet-tracker/src/pipeline/validate-positions.ts` — nuevo (núcleo): `normalize()` (R5-R7)
- `backend-pet-tracker/src/pipeline/__fixtures__/walk.json` — nuevo: ~200 puntos generados con el fake (R7)
- `backend-pet-tracker/src/integrations/wialon/wialon-client.interface.ts` — nuevo (infra/puerto): interface + `WIALON_CLIENT` (R1)
- `backend-pet-tracker/src/integrations/wialon/fake-wialon.client.ts` — nuevo (infra): simulador determinista (R2, R3)
- `backend-pet-tracker/src/integrations/wialon/wialon-http.client.ts` — nuevo (infra): cliente real + `WialonApiError` en `wialon.errors.ts` (R4)
- `backend-pet-tracker/src/integrations/wialon/wialon.factory.ts` — nuevo (infra): factory por config (R1)
- `backend-pet-tracker/src/workers/ingestion-store.ts` — nuevo (puerto): interface + `INGESTION_STORE` (R9, R10, R14, R15)
- `backend-pet-tracker/src/workers/ingestion.drizzle.store.ts` — nuevo (infra): implementación Drizzle (R9, R10, R14, R15)
- `backend-pet-tracker/src/workers/poller.service.ts` — nuevo (infra): `runOnce()` (R9-R11)
- `backend-pet-tracker/src/workers/positions-consumer.service.ts` — nuevo (infra): `drainOnce()` (R12-R18)
- `backend-pet-tracker/src/workers/ingestion.module.ts` — nuevo: providers + gating del scheduling (R1, R8)
- `backend-pet-tracker/src/app.module.ts` — editado: `ScheduleModule.forRoot()` + `IngestionModule` (R8)
- `backend-pet-tracker/package.json` — editado: `@nestjs/schedule`, `@aws-sdk/lib-dynamodb` (D13)
- `backend-pet-tracker/test/ingestion.e2e-spec.ts` — nuevo: cadena claim → runOnce → drainOnce → DynamoDB + last_position + DLQ 0 (R19)
- `.env.example` — editado: 7 vars nuevas de D11 (mismo commit que las introduce)
- `docs/conventions.md` — editado: tabla de env vars con las 7 de D11 (mismo commit)
- `docs/wialon-module.md` — **nuevo** (D1): fuente canónica del diseño Wialon
- `progress/impl_wialon-ingestion-pipeline.md` — evidencia manual de la corrida real ~2 min y DLQ en 0 (R19)

Sin migraciones. Sin cambios en `src/modules/**` ni en `src/aws/**`.

## Alternativas descartadas

- **`@ssut/nestjs-sqs` para consumir la cola**: descartado (D5) — dependencia
  extra para un loop de ~40 líneas; el patrón propio queda como precedente
  controlado para #12/#13.
- **`battery.low` en cada mensaje con batería < 20**: descartado (D8) — hoy
  nadie dedupea en el bus; el fake bajaría de 20 y emitiría un evento por
  mensaje durante horas. El flanco usa dato ya disponible
  (`devices.battery_pct` previo).
- **Reenviar malformados a la DLQ a mano y borrarlos**: descartado (D3) — el
  worker escribiría en una cola que "pertenece" a la RedrivePolicy; el
  redrive automático ya está provisionado y probado (#2).
- **Extender `DeviceRepository`/`PetRepository` para el worker**: descartado
  (D14) — reabriría contratos cerrados por specs aprobadas y acoplaría los
  módulos HTTP al worker; el puerto propio mantiene los cambios aditivos.
- **Lock en DB contra solape del poller**: descartado (D4) — proceso único
  local; un flag en memoria da la misma garantía sin schema ni limpieza de
  locks huérfanos.
- **Esperar al cron real en el e2e (sleeps de ~2 min)**: descartado (D10) —
  frágil y lento en CI; `runOnce()`/`drainOnce()` prueban la misma cadena
  determinista y la corrida real queda como evidencia manual.
- **Cron siempre activo (sin `POLLER_ENABLED`/gate de test)**: descartado
  (D10) — contaminaría los e2e de #5/#7 (instancian `AppModule` completo) y
  cualquier corrida de CI sin DynamoDB activo.
- **`Math.random`/PRNG con estado para el fake**: descartado (D2) — no
  seedable / divergiría tras reinicios; rompería R2.
- **Tipos de telemetría en `src/integrations/wialon/`**: descartado — el
  pipeline puro los necesita y no puede importar de infraestructura
  (dirección de dependencia de architecture.md).
- **Env `QUEUE_URL` obligatoria**: descartado — la URL se deriva del nombre
  con `GetQueueUrlCommand`; una env más sería un punto de drift con las
  constantes de #2.
- **Absorber `docs/wialon-module.md` solo en esta spec**: descartado (D1) —
  planes 006/007 citan el doc en sus chequeos de deriva; sin archivo, cada
  feature futura re-tropieza con el mismo drift.
- **Auditar posiciones en `audit_log`**: descartado — volumen/ruido
  (~2 880/día/mascota); el audit es para acciones, no telemetría.
