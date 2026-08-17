---
feature: "device-subscriptions"
status: approved     # draft | approved
tags: [harness, spec]
---

# Tareas — [[device-subscriptions]]

> Disciplina TDD (`docs/verification.md`). Cada tarea corresponde a un requisito
> de [[requirements]] y tiene siempre los mismos 3 sub-items, en este orden.
>
> **Cada test nombra su requisito**:
> `describe('R<n> (device-subscriptions #25): ...')`.
>
> **Commits test-primero, UNO POR REQUISITO.** `CHECKPOINTS.md` C4 exige que el
> historial muestre el patrón rojo → verde; meter tests + implementación + docs
> en un solo commit es motivo de rechazo del reviewer (pasó en #19). Formato:
> `feat(device-subscriptions): <desc> (R<n>)`. Tras cada commit, actualizar la
> fila correspondiente de [[traceability]].
>
> Los e2e necesitan Docker levantado (`docker compose up -d`) y, para los
> bloques del poller, la cola de LocalStack
> (`pnpm -C backend-pet-tracker run provision:local` — LocalStack pierde los
> recursos al reiniciar). **Ningún test toca la red ni el token de Wialon**: el
> `WialonClient` se inyecta como stub.
>
> **Fixtures de posiciones**: cualquier lote sintético debe terminar **en el
> pasado**. Auditar el `BASE_TS` no basta — hay que mirar el offset
> **acumulado**: 100 posiciones con paso de 30 s acaban 48 min por delante.
> Con #27 cerrada, una posición con `ts` futuro se descarta como anomalía y el
> test falla por un motivo que no tiene nada que ver con suscripciones. Usar
> `BASE_TS = Date.now() - (n * paso) - margen` y afirmar `max(ts) < now`.

## Orden obligatorio del arranque (leer antes de tocar nada)

R1 genera el archivo de migración y **R17 le añade a mano el backfill**. La
migración **no se aplica hasta que R17 esté dentro del archivo**: si se aplica
después de R1, `drizzle-kit` registra su hash en `meta/` y editarla más tarde
rompe el journal (habría que revertir la base a mano). Secuencia:

```
R1  → schema + `db:generate`  (commit, migración NO aplicada)
R17 → append del INSERT ... SELECT al .sql + seed:devices  (commit)
      → recién aquí: `pnpm -C backend-pet-tracker exec drizzle-kit migrate`
R2  → R3 → R4 → R5 → R13 → R6 → R7 → R8 → R15 → R9 → R10 → R11
      → R16 → R14 → R12 → R18
```

## R1 — Tabla `device_subscriptions` + migración

- [x] (1) Escribir test que falla para R1 — `test/device-subscriptions.e2e-spec.ts`:
      consulta `information_schema.columns` y `pg_constraint` y afirma las 6
      columnas con sus tipos/NOT NULL, la PK sobre `device_id`, la FK a
      `devices(id)` y los dos checks
      (`device_subscriptions_status_check`, `device_subscriptions_plan_code_check`)
- [x] (2) Implementación mínima que lo pasa — `src/db/schema/subscriptions.schema.ts`,
      `export * from './subscriptions.schema'` en `src/db/schema/index.ts`,
      `pnpm -C backend-pet-tracker run db:generate` (verificar: **exactamente
      un** `.sql` nuevo). **No aplicar todavía** (ver §Orden obligatorio)
- [x] (3) Refactor con tests verdes — comentario de cabecera del schema en la
      línea de `devices.schema.ts` (por qué `device_id` es PK, por qué sin
      índices extra)

## R17 — Backfill de devices preexistentes + seed de simulados

- [x] (1) Escribir test que falla para R17 — e2e: (a) tras la migración,
      `SELECT count(*) FROM devices d LEFT JOIN device_subscriptions s ON
      s.device_id = d.id WHERE s.device_id IS NULL` es `0`; (b)
      `seedSimulatedDevices(db)` sobre una base con los `SIM-001..003` ya
      sembrados deja una suscripción `active`/`grandfathered` por cada uno y es
      idempotente al ejecutarse dos veces
- [x] (2) Implementación mínima que lo pasa — `INSERT ... SELECT ... ON CONFLICT
      (device_id) DO NOTHING` añadido a mano al `.sql` de R1 + extensión de
      `seedSimulatedDevices()` en `scripts/seed-devices.ts`. **Ahora sí**:
      `pnpm -C backend-pet-tracker exec drizzle-kit migrate`
- [x] (3) Refactor con tests verdes — `pnpm -C backend-pet-tracker run test:e2e`
      completo: **todos** los e2e previos (positions, activity, geofences,
      alerts-engine, alerts-center-notifier, ingestion, devices) verdes **sin
      editarlos**. Si alguno pide edición, el backfill está mal

## R2 — La regla de entitlement, en un solo sitio

- [x] (1) Escribir test que falla para R2 —
      `src/modules/subscriptions/infrastructure/entitlement.predicate.spec.ts`:
      el SQL renderizado contiene el valor de `DEVICE_SUBSCRIPTION_GRACE_DAYS`
      como parámetro/valor interpolado y **no** contiene `AT TIME ZONE`
- [x] (2) Implementación mínima que lo pasa —
      `src/modules/subscriptions/domain/subscription.constants.ts` +
      `src/modules/subscriptions/infrastructure/entitlement.predicate.ts`
      ([[design]] D4)
- [x] (3) Refactor con tests verdes — ejecutar y **pegar en [[traceability]]** la
      salida de
      `grep -rn "current_period_end\|currentPeriodEnd\|GRACE_DAYS" backend-pet-tracker/src/`:
      solo schema, constants, predicate y sus `.spec.ts`

## R3 — `isPetTracked(petId)` / `isDeviceEntitled(deviceId)`

- [x] (1) Escribir test que falla para R3 — e2e con **los 7 casos** de la tabla
      de [[requirements]] R3 (sin collar, sin fila, `canceled`, vigente,
      dentro de gracia, fuera de gracia, mascota inexistente), fijando
      `current_period_end` con offsets relativos a `now()`
- [x] (2) Implementación mínima que lo pasa —
      `subscription.repository.ts` (puerto + token) y
      `subscription.drizzle.repository.ts`, ambos consumiendo el predicado de R2
- [x] (3) Refactor con tests verdes — afirmar en el test que
      `SubscriptionRepository.prototype.isPetTracked.length === 1` (un solo
      parámetro: **no** hay `userId`, prueba estructural de D1)

## R4 — El poller no encola devices sin suscripción vigente

- [x] (1) Escribir test que falla para R4 — e2e: tres devices asignados
      (vigente / sin fila / vencido fuera de gracia) →
      `listActiveAssignments()` devuelve **solo** el primero; y
      `PollerService.runOnce()` con `WialonClient` stub y `SQSClient` espía
      manda mensajes solo del primero, y `ingest_watermark` de los otros dos no
      se mueve
- [x] (2) Implementación mínima que lo pasa — `innerJoin` +
      `entitledDeviceSubscription()` en
      `src/workers/ingestion.drizzle.store.ts:24`. `poller.service.ts` y el
      puerto `ingestion-store.ts` **no se tocan**
- [x] (3) Refactor con tests verdes — el mismo e2e afirma que, con suscripción
      vigente, el body del mensaje SQS es idéntico al de hoy
      (`{version:1, deviceId, petId, unitId, positions}`) y el troceado por
      `POSITIONS_PER_MESSAGE_MAX` no cambia

## R5 — Vencer no libera el device; reactivar no exige re-claim

- [x] (1) Escribir test que falla para R5 — e2e: device con suscripción vencida
      fuera de gracia → `pet_devices.released_at IS NULL` y `devices.status`
      sigue `'assigned'`; luego se renueva `current_period_end` y
      `listActiveAssignments()` vuelve a incluirlo **con el mismo
      `pet_devices.id`**, sin ninguna llamada a `POST /v1/devices/claim` y sin
      filas nuevas en `pet_devices`
- [x] (2) Implementación mínima que lo pasa — no debería hacer falta código: el
      requisito es una **propiedad de ausencia**. Si el test falla, algo escribió
      en `pet_devices`/`devices.status` y hay que quitarlo
- [x] (3) Refactor con tests verdes — grep de confirmación: ningún archivo nuevo
      o modificado de esta feature contiene `releasedAt`, `petDevices` en un
      `.update(` ni `devices.status` en un `.set(`

## R13 — Script `subscription:set` idempotente

- [x] (1) Escribir test que falla para R13 — e2e sobre `setDeviceSubscription()`:
      alta por `--unit-id` y por `--device-id`; segunda ejecución idéntica ⇒
      mismo estado y **una** fila; `devices.status`/`pet_devices` intactos; y
      los casos de error (sin selector, con los dos, `status`/`plan` fuera del
      enum, `--period-end` no parseable, device inexistente) ⇒ error explícito
      y **cero** filas escritas
- [x] (2) Implementación mínima que lo pasa —
      `scripts/set-device-subscription.ts` (`parseArgs`, `loadDotenv({ path:
      '../.env' })`, `onConflictDoUpdate` sobre la PK) + entrada
      `subscription:set` en `package.json`, siguiendo el patrón de
      `scripts/provision-device.ts`
- [x] (3) Refactor con tests verdes — línea de stdout con `deviceId`, `status`,
      `planCode`, `currentPeriodEnd`, `entitled`, `watermarkReset`

## R6 — Reset del watermark solo en la transición no-vigente → vigente

- [x] (1) Escribir test que falla para R6 — e2e: device con
      `ingest_watermark` de hace 90 días y suscripción vencida →
      `setDeviceSubscription()` a `active` ⇒ `ingest_watermark` queda a
      `now - CLAIM_WATERMARK_LOOKBACK_MINUTES` (tolerancia de segundos) y el
      resultado reporta `watermarkReset: true`; ejecutarlo **otra vez** sobre la
      suscripción ya vigente ⇒ `ingest_watermark` **no cambia** y
      `watermarkReset: false`
- [x] (2) Implementación mínima que lo pasa — en
      `scripts/set-device-subscription.ts`: `isDeviceEntitled()` antes y después
      del upsert (vía `new SubscriptionDrizzleRepository(db)`, **nunca**
      re-escribiendo el predicado), y `UPDATE devices SET ingest_watermark`
      solo en la transición
- [x] (3) Refactor con tests verdes — importar
      `CLAIM_WATERMARK_LOOKBACK_MINUTES` de
      `claim-device.use-case.ts:22`, no re-teclear el `10`

## R7 — El claim exige suscripción activa, en el último lugar del orden

- [x] (1) Escribir test que falla para R7 — (a) unitario: nuevo `describe` en
      `src/modules/devices/application/use-cases/claim-device.use-case.spec.ts`
      con `SubscriptionRepository` mock ⇒ `DeviceNotSubscribedError` y
      `devices.claim` **no** llamado, `auditLogger.record` **no** llamado; y el
      orden completo membresía(404) → rol(403) → device(404) → asignado(409) →
      mascota-con-collar(409) → suscripción(402); (b) e2e:
      `POST /v1/devices/claim` sobre un device sin suscripción ⇒ `402` con el
      body exacto y `pet_devices` sin fila nueva
- [x] (2) Implementación mínima que lo pasa —
      `subscription.errors.ts` (`DEVICE_SUBSCRIPTION_REQUIRED`,
      `DeviceNotSubscribedError`), inyección en `ClaimDeviceUseCase`, chequeo
      justo antes de `this.devices.claim(...)`, rama en
      `device-error.mapper.ts`
- [x] (3) Refactor con tests verdes — los tests previos de #7/#26
      (`devices.e2e-spec.ts`, `claim-device.use-case.spec.ts`) siguen verdes sin
      editarlos, gracias al backfill de R17

## R8 — `PetTrackingGuard` y el body del 402

- [x] (1) Escribir test que falla para R8 —
      `src/modules/subscriptions/infrastructure/guards/pet-tracking.guard.spec.ts`
      con repo mock: `isPetTracked` `false` ⇒ `HttpException` con
      `getStatus() === 402` y `getResponse()` **exactamente**
      `{statusCode:402, code:'DEVICE_SUBSCRIPTION_REQUIRED', message:'Pet tracking requires an active device subscription'}`;
      `true` ⇒ `canActivate` devuelve `true`; `request.petMembership`
      `undefined` ⇒ `NotFoundException` y `isPetTracked` **no** llamado
- [x] (2) Implementación mínima que lo pasa —
      `pet-tracking.guard.ts` con `HttpException` +
      `HttpStatus.PAYMENT_REQUIRED` (`@nestjs/common` **no** exporta
      `PaymentRequiredException`)
- [x] (3) Refactor con tests verdes — el literal del `code` sale de la constante
      `DEVICE_SUBSCRIPTION_REQUIRED` que R7 ya creó, no re-tecleado

## R15 — `SubscriptionsModule` y su cableado

- [x] (1) Escribir test que falla para R15 — e2e mínimo que arranca `AppModule`
      y golpea una ruta gateada: sin el módulo cableado, Nest falla al resolver
      `SUBSCRIPTION_REPOSITORY` del guard
- [x] (2) Implementación mínima que lo pasa — `subscriptions.module.ts`
      (providers + exports, sin controllers) e `imports: [..., SubscriptionsModule]`
      en `positions.module.ts`, `activity.module.ts`, `geofences.module.ts`,
      `devices.module.ts`
- [x] (3) Refactor con tests verdes — comprobar que `AlertsModule` e
      `IngestionModule` **no** lo importan (solo usan el predicado como función)
      y que `SubscriptionsModule` no importa ningún módulo de dominio (sin
      ciclos)

## R9 — La tabla exacta de rutas gateadas, y ninguna más

- [x] (1) Escribir test que falla para R9 — e2e que recorre **las 10 rutas** de
      la tabla de [[requirements]] R9 sobre una mascota sin entitlement ⇒ `402`
      en todas; y sobre la lista de rutas **no** gateadas (incluidas
      `GET /v1/pets/:petId/device`, `DELETE /v1/pets/:petId/device`,
      `/v1/pets/:petId/weights`, `/v1/pets/:petId/vaccines`,
      `/v1/pets/:petId/reminders`, `GET /v1/pets/:petId`) ⇒ el mismo código que
      hoy, nunca `402`. Más el caso de seguridad: usuario **sin** membresía
      sobre una mascota **con** entitlement ⇒ `404`, y `:petId` malformado ⇒
      `404`
- [x] (2) Implementación mínima que lo pasa — `@UseGuards(PetAccessGuard,
      PetTrackingGuard)` en `PositionsController`, `TripsController`,
      `ActivityController`, `GeofencesController` (decorador de clase; handlers
      intactos)
- [x] (3) Refactor con tests verdes — confirmar que no se creó ningún
      `*.controller.ts` nuevo ni ninguna ruta nueva

## R10 — `/v1/alerts` filtra, nunca responde 402

- [x] (1) Escribir test que falla para R10 — e2e: usuario con mascota A
      (vigente) y B (sin suscripción), una alerta en cada una ⇒
      `GET /v1/alerts` responde `200` con la de A y **cero** de B; `POST
      /v1/alerts/:id/ack` sobre la de B ⇒ `404`; ninguna respuesta de `/v1/alerts`
      es `402`; el `nextCursor` sigue teniendo el mismo shape
- [x] (2) Implementación mínima que lo pasa — joins de entitlement en
      `listForMember()` y `findForMember()` de
      `alert.drizzle.repository.ts`. `ListAlertsUseCase`, `AckAlertUseCase`,
      `AlertsController` y los mappers **no se tocan**
- [x] (3) Refactor con tests verdes — `test/alerts-center-notifier.e2e-spec.ts`
      sigue verde sin editarlo

## R11 — Mascota compartida: el no-owner ve el mapa sin suscripción propia

- [x] (1) Escribir test que falla para R11 — e2e: owner + miembro `family`
      activo sobre la misma mascota con collar suscrito ⇒ el `family` recibe
      `200` en `GET /v1/pets/:petId/positions/last`,
      `GET /v1/pets/:petId/trips` y `GET /v1/pets/:petId/geofences`, sin ninguna
      fila de suscripción ligada a su `user_id`
- [x] (2) Implementación mínima que lo pasa — ninguna: debe pasar solo, porque
      `isPetTracked` no recibe `userId` (R3). Si falla, alguien introdujo una
      dimensión de usuario y hay que quitarla
- [x] (3) Refactor con tests verdes — grep: no existe ninguna columna, tipo ni
      parámetro que ligue `device_subscriptions` a `users`

## R16 — El contrato HTTP no cambia de forma

- [x] (1) Escribir test que falla para R16 — e2e/unitario:
      `Object.keys(response.body).sort()` de `GET /v1/pets/:petId` es
      exactamente la lista de 24 claves de [[requirements]] R16, y las 5 de
      `device`; con entitlement, las respuestas de positions, trips,
      activity/daily, geofences y alerts tienen las mismas claves que antes
- [x] (2) Implementación mínima que lo pasa — ninguna: propiedad de ausencia.
      Si falla, se añadió una clave y hay que quitarla
- [x] (3) Refactor con tests verdes — pegar en [[traceability]] la salida de
      `grep -rn "tracked\|entitled\|planCode\|subscription" backend-pet-tracker/src/modules/*/infrastructure/mappers/`
      (debe ser vacía)

## R14 — Cero acoplamiento a proveedores de pago

- [x] (1) Escribir test que falla para R14 — el "test" es el grep, registrado en
      [[traceability]]:
      `grep -rni "stripe\|paypal\|mercadopago\|checkout.session\|webhook" backend-pet-tracker/src/`
      ⇒ cero coincidencias; `git diff` de `backend-pet-tracker/package.json`
      sin dependencias nuevas; `git diff` de `.env.example` vacío
- [x] (2) Implementación mínima que lo pasa — ninguna, es una restricción
- [x] (3) Refactor con tests verdes — confirmar que `docs/conventions.md`
      §Variables de entorno no gana ninguna fila

## R12 — Contrato heredado por #18 (ai-explainer), sin código de nutrición

- [x] (1) Escribir test que falla para R12 — grep registrado en
      [[traceability]]: `ls backend-pet-tracker/src/modules/nutrition` ⇒ no
      existe, y `grep -rn "aiExplanation" backend-pet-tracker/src/` ⇒ cero
- [x] (2) Implementación mínima que lo pasa — ninguna en `src/`: la sección
      [[design]] §Contrato heredado por #18 ya está escrita en esta spec y es el
      entregable
- [x] (3) Refactor con tests verdes — verificar que `SubscriptionsModule`
      **exporta** `SUBSCRIPTION_REPOSITORY` (sin eso, #18 no puede consumirlo)

## R18 — `docs/data-model.md`

- [x] (1) Escribir test que falla para R18 — verificación documental: el ERD no
      contiene `device_subscriptions` y el catálogo no tiene su fila
- [x] (2) Implementación mínima que lo pasa — añadir
      `devices ||--o| device_subscriptions : "subscribed"` al ERD y la fila de
      catálogo con columnas, enum de `status`, la gracia **derivada**
      (`current_period_end` + `DEVICE_SUBSCRIPTION_GRACE_DAYS`, no un estado) y
      los tres caminos de alta (backfill de la migración, `seed:devices`,
      `subscription:set`)
- [x] (3) Refactor con tests verdes — `./init.sh` completo en verde y
      [[traceability]] sin ninguna fila "pendiente"
