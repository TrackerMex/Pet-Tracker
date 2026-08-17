---
feature: "device-subscriptions"
status: approved     # draft | approved
tags: [harness, spec]
---

# Diseño — [[device-subscriptions]]

> Ver [[requirements]] para los requisitos que este diseño implementa y
> [[../../docs/architecture|architecture]] para las reglas de capas.
>
> Esta spec debe ser **autosuficiente**: la implementa Codex CLI, que no ve la
> conversación donde se decidió el modelo. Rutas, símbolos y shapes van
> literales.

## Estado del código hoy (lo que la implementación encuentra)

| Pieza | Ruta:línea | Qué hace hoy |
|---|---|---|
| Poller | `src/workers/poller.service.ts:57` | recorre `store.listActiveAssignments()` sin ninguna noción de pago |
| Consulta del poller | `src/workers/ingestion.drizzle.store.ts:34-36` | filtra solo `pet_devices.released_at IS NULL` + `devices.wialon_unit_id IS NOT NULL` |
| Claim | `src/modules/devices/application/use-cases/claim-device.use-case.ts:42-93` | membresía → rol → device → asignado → mascota-con-collar → `claim()` → `audit_log` |
| Guard por mascota | `src/modules/pets/infrastructure/guards/pet-access.guard.ts:41-79` | `404` (uuid malo / sin membresía activa) antes de `403` (rol); adjunta `request.petMembership` en `:76` |
| Alertas | `src/modules/alerts/infrastructure/repositories/alert.drizzle.repository.ts:45` | `innerJoin` a `pet_users` con `status='active'`; la autorización **es** la consulta |
| Perfil de mascota | `src/modules/pets/infrastructure/mappers/pet-profile-response.mapper.ts:18` | contrato congelado de 24 claves; las features nuevas rellenan `null`s, nunca añaden claves |
| Devices | `src/db/schema/devices.schema.ts:26-90` | `devices` (con `status` cache + `ingest_watermark`) y `pet_devices` (índices únicos parciales por `released_at IS NULL`) |
| Alta de collares | `scripts/seed-devices.ts` (simulados) y `scripts/provision-device.ts` (#24, reales) | dos caminos, distinguidos por `is_simulated` |
| Migraciones | `src/db/migrations/0000..0011` | se generan con `db:generate` y se aplican **a mano**: no existe script `db:migrate` (`STATUS.md:386-388`) |

No existe `src/modules/nutrition/`: #17 y #18 están `pending`.
`@nestjs/common` **no** exporta `PaymentRequiredException`; sí existe
`HttpStatus.PAYMENT_REQUIRED = 402`
(`node_modules/@nestjs/common/enums/http-status.enum.d.ts:28`).

## Decisiones técnicas

**D1 — La suscripción cuelga del device, con `device_id` como PK.**
Decidido en sesión el 2026-08-14 y fuera de discusión: el costo es por collar.
Consecuencia gratis: la mascota compartida se resuelve sola, porque el
entitlement se deriva de `pet_devices` y **`isPetTracked` no recibe `userId`**
(R3) — no hay firma por la que un llamador pueda hacer la pregunta "por
usuario". Sirve a R3, R11.

**D2 — La gracia es derivada (`current_period_end` + constante), no un estado.**
Un estado `past_due` necesita que **alguien** lo escriba; en esta fase no hay
webhook ni scheduler que lo haga, así que la columna se quedaría mintiendo. El
enum queda en dos valores (`active`, `canceled`) y el vencimiento se calcula en
la comparación. La constante es `DEVICE_SUBSCRIPTION_GRACE_DAYS = 3` en
`src/modules/subscriptions/domain/subscription.constants.ts`: cubre un fin de
semana de renovación manual fallida sin regalar un mes, y siendo constante de
código (no variable de entorno) no puede divergir entre entornos ni añade una
fila a la tabla de `docs/conventions.md` que #23 tiene que vigilar. Revocar en
el acto sigue siendo posible con `status='canceled'`, que la regla veta sin
mirar fechas. Sirve a R2, R14.

**D3 — Una fila por device, sin historial.** `device_id` es PK: el upsert es
trivial (`onConflictDoUpdate` sobre la PK), no hay consulta "¿cuál es la fila
vigente?" y no hay dos filas activas posibles por construcción. El historial de
cambios de plan lo tendrá el proveedor de pagos cuando exista; `audit_log` no
sirve porque exige un `user_id` de `users` y el script de R13 no corre en nombre
de ningún usuario (mismo razonamiento que cerró #24). Sirve a R1, R13.

**D4 — La regla vive en SQL, una vez, como predicado compartido.** El criterio
de aceptación 1 dice "ningún otro punto del código recalcula esa regla". Un
`isEntitled(sub, now)` puro en `domain` **más** un `WHERE` para el poller serían
dos expresiones de la misma regla, es decir exactamente lo prohibido: dos sitios
que se pueden desincronizar. Y el poller necesita un filtro **de conjunto** (una
consulta para N devices), no N llamadas a un booleano. Por eso la regla se
escribe una sola vez como fragmento Drizzle:

```ts
// src/modules/subscriptions/infrastructure/entitlement.predicate.ts
export function entitledDeviceSubscription(): SQL {
  return sql`${deviceSubscriptions.status} = 'active'
    and ${deviceSubscriptions.currentPeriodEnd}
        > now() - (${DEVICE_SUBSCRIPTION_GRACE_DAYS} * interval '1 day')`;
}
```

y la consumen los tres únicos lugares que la necesitan (R2). Vive en
`infrastructure` porque es SQL; el precio es que no hay test unitario puro de la
regla — se cubre en e2e contra Postgres real, que es la convención del proyecto
para repositorios Drizzle (`docs/conventions.md` §Tests). Sirve a R2.

`now()` desnudo, ambos lados `timestamptz`. **No** usar
`now() AT TIME ZONE 'utc'`: degrada a `timestamp` sin zona y desplaza la
comparación tantas horas como el offset del servidor — ese exacto error costó
una sesión de depuración en el smoke de GPS de #24.

**D5 — Un guard nuevo compuesto, no un `PetAccessGuard` modificado.**
`@UseGuards(PetAccessGuard, PetTrackingGuard)`: Nest los ejecuta en orden, así
que el `404` de "no eres miembro / no existe" **precede siempre** al `402`. Es
la propiedad de seguridad crítica: un `402` sobre una mascota ajena confirmaría
que existe, justo lo que el brief §4 prohíbe. Además `PetTrackingGuard` lee
`request.petMembership.petId` — el campo que el guard anterior adjunta — de modo
que la dependencia de orden es **estructural**, no una convención: sin
`PetAccessGuard` delante el campo no existe y el guard falla cerrado con `404`
(R8). `PetAccessGuard` no se toca: su contrato lo cerró la spec de #5 y lo
comparten 11 controllers. Sirve a R8, R9.

**D6 — El gate de geocercas es a nivel de controller, escrituras incluidas.**
Alternativa considerada: gatear solo los `GET` y dejar `POST`/`PATCH`/`DELETE`
abiertos. Descartada: cinco decisiones y cinco tests en vez de una línea, y una
geocerca que nadie evalúa (porque el poller no encola) es configuración muerta
que el usuario cree activa. Coste aceptado: durante el impago el owner no puede
borrar sus geocercas. No se pierde nada — sobreviven y reaparecen al pagar,
igual que el device nunca se libera (R5). Sirve a R9.

**D7 — Se gatea el productor (poller), no los consumidores.** El consumidor
SQS, el alerts-engine, el notifier y el agregador de actividad quedan intactos:
sin mensajes encolados no hacen nada, y descartar un mensaje **ya en vuelo**
cuando la suscripción acaba de vencer perdería posiciones de un periodo pagado.
El ahorro real (llamadas a Wialon + `SendMessage` + writes a DynamoDB) ya está
capturado en la única consulta de R4. Sirve a R4.

**D8 — `GET /v1/alerts` filtra, no responde 402.** Es la única ruta de tracking
multi-mascota. Un `402` global escondería las alertas de la mascota **sí**
pagada de un usuario con dos mascotas, y no diría cuál pagar. El filtro va en
el mismo `innerJoin` que ya **es** la autorización de #13, así que la propiedad
"no hay camino por el que se cuele una alerta que no toca" se conserva sin
código nuevo en el caso de uso. `POST /v1/alerts/:id/ack` hereda el filtro vía
`findForMember()`: alerta no visible ⇒ el `404` que ya existe. Sirve a R10.

**D9 — Grandfathering en la propia migración.** Tres opciones para los devices
preexistentes: (a) sin fila ⇒ sin entitlement — apaga el entorno local entero y
rompe el smoke de GPS de #24; (b) sin fila ⇒ entitlement por defecto — anula la
feature: el poller no ahorraría nada y el claim no exigiría nada; (c) backfill.
Se elige (c), con una sentencia añadida a mano al SQL generado por
`drizzle-kit generate`, más el mismo insert en `seedSimulatedDevices()` para que
una base recreada desde cero también arranque viva. `plan_code='grandfathered'`
+ `current_period_end='2099-12-31'` es un centinela greppable que no obliga a la
regla de R2 a conocer un estado "perpetuo". Sirve a R17.

**D10 — Revivir resetea el watermark, y solo en la transición.** Un collar que
estuvo meses impagado tiene `devices.ingest_watermark` de hace meses; al pagar,
el poller pediría a Wialon todo el histórico y lo trocearía en miles de mensajes
SQS. El reset a `now - CLAIM_WATERMARK_LOOKBACK_MINUTES` reutiliza la constante
del claim (`claim-device.use-case.ts:22`) — es exactamente "arranca la ingesta
como si fuera nuevo, sin re-claim". Solo en la transición no-vigente → vigente:
re-ejecutar el script sobre una suscripción sana no debe mover la ingesta. La
decisión se toma llamando `isDeviceEntitled()` antes y después del upsert, nunca
re-escribiendo la regla. Sirve a R6, R13.

**D11 — Cero rutas HTTP nuevas.** El `status` se administra con un script de
terminal, por el mismo motivo que #24 descartó su endpoint admin: `pet_users.role`
es rol **por mascota**, no global, y no existe modelo de rol de plataforma. Un
endpoint sin ese modelo sería o público o autorizado a ojo. Sirve a R9, R13.

## Archivos afectados

### Nuevos

| Archivo | Capa | Qué contiene |
|---|---|---|
| `backend-pet-tracker/src/db/schema/subscriptions.schema.ts` | infra (schema compartido) | `deviceSubscriptions = pgTable('device_subscriptions', ...)` (R1) |
| `backend-pet-tracker/src/db/migrations/00xx_*.sql` | infra | DDL generado + `INSERT ... SELECT` de grandfathering (R1, R17) |
| `backend-pet-tracker/src/modules/subscriptions/domain/subscription.constants.ts` | domain | `DEVICE_SUBSCRIPTION_GRACE_DAYS`, `DEVICE_SUBSCRIPTION_STATUSES`, `DeviceSubscriptionStatus`, `DEVICE_SUBSCRIPTION_PLAN_CODES`, `DeviceSubscriptionPlanCode` |
| `backend-pet-tracker/src/modules/subscriptions/domain/errors/subscription.errors.ts` | domain | `DEVICE_SUBSCRIPTION_REQUIRED` (string const) y `DeviceNotSubscribedError` — sin imports de `@nestjs/common` |
| `backend-pet-tracker/src/modules/subscriptions/domain/repositories/subscription.repository.ts` | domain | `SUBSCRIPTION_REPOSITORY` + interface `SubscriptionRepository` (R3) |
| `backend-pet-tracker/src/modules/subscriptions/infrastructure/entitlement.predicate.ts` | infra | `entitledDeviceSubscription(): SQL` — **la** regla (R2) |
| `backend-pet-tracker/src/modules/subscriptions/infrastructure/repositories/subscription.drizzle.repository.ts` | infra | `SubscriptionDrizzleRepository` (R3) |
| `backend-pet-tracker/src/modules/subscriptions/infrastructure/guards/pet-tracking.guard.ts` | infra | `PetTrackingGuard` + body del 402 (R8) |
| `backend-pet-tracker/src/modules/subscriptions/subscriptions.module.ts` | infra | `SubscriptionsModule`, sin controllers (R15) |
| `backend-pet-tracker/scripts/set-device-subscription.ts` | script | `setDeviceSubscription(db, input)` + `main()` con `parseArgs` (R13) |
| `backend-pet-tracker/test/device-subscriptions.e2e-spec.ts` | test e2e | toda la cobertura contra Postgres real |

### Modificados

| Archivo | Qué cambia |
|---|---|
| `src/db/schema/index.ts` | `export * from './subscriptions.schema';` (R1) |
| `src/workers/ingestion.drizzle.store.ts` | `listActiveAssignments()` gana el `innerJoin` + predicado (R4). Nada más del archivo cambia |
| `src/modules/devices/application/use-cases/claim-device.use-case.ts` | `@Inject(SUBSCRIPTION_REPOSITORY)` en el constructor + chequeo justo antes de `this.devices.claim(...)` (R7) |
| `src/modules/devices/infrastructure/mappers/device-error.mapper.ts` | rama `DeviceNotSubscribedError` → `HttpException` 402 (R7) |
| `src/modules/devices/devices.module.ts` | `imports: [..., SubscriptionsModule]` (R15) |
| `src/modules/positions/positions.module.ts`, `src/modules/activity/activity.module.ts`, `src/modules/geofences/geofences.module.ts` | `imports: [..., SubscriptionsModule]` (R15) |
| `src/modules/positions/infrastructure/positions.controller.ts`, `.../activity/infrastructure/trips.controller.ts`, `.../activity/infrastructure/activity.controller.ts`, `.../geofences/infrastructure/geofences.controller.ts` | `@UseGuards(PetAccessGuard, PetTrackingGuard)` — un token más en el decorador de clase, cero cambios en los handlers (R8, R9) |
| `src/modules/alerts/infrastructure/repositories/alert.drizzle.repository.ts` | `listForMember()` y `findForMember()` ganan los joins de entitlement (R10) |
| `scripts/seed-devices.ts` | `seedSimulatedDevices()` siembra también las suscripciones (R17) |
| `package.json` | script `subscription:set` (R13) |
| `docs/data-model.md` | ERD + fila de catálogo (R18) |

### Explícitamente intactos

`pet-access.guard.ts` · `poller.service.ts` · `positions-consumer.service.ts` ·
`ingestion-store.ts` (el puerto) · `pet-profile-response.mapper.ts` ·
`device-status.mapper.ts` · todos los mappers de respuesta de #9/#10/#11/#13 ·
`pet-device.controller.ts` · `devices.controller.ts` · `provision-device.ts` ·
`infra/` · `.env.example`.

## Contrato heredado por #18 (`nutrition-ai-explainer`)

#18 no existe todavía (R12). Cuando se implemente, su gate es **una** llamada:

```ts
// en el use case del explainer, NO en el controller
constructor(
  @Inject(SUBSCRIPTION_REPOSITORY) private readonly subscriptions: SubscriptionRepository,
) {}

const tracked = await this.subscriptions.isPetTracked(petId);
// sin entitlement: no se llama al modelo y aiExplanation queda null
```

Reglas que #18 debe respetar:
- Sin entitlement ⇒ `200` con `aiExplanation: null`. **Nunca `402`, nunca
  `5xx`**: es exactamente el comportamiento de fallo que el explainer ya tiene
  que tener cuando el proveedor de IA no responde — la IA degrada, no bloquea.
- El plan nutricional determinístico de #17 **no** se gatea nunca: es plan free.
- No recalcula la regla: llama `isPetTracked()` y nada más (R2).
- `SubscriptionsModule` se importa desde el módulo de nutrición; no se duplica
  el provider.

## Test

Sin código de aplicación en los tests y sin red. Reparto:

- **e2e nuevo `test/device-subscriptions.e2e-spec.ts`** (Postgres real, Docker
  levantado; mismo arnés que `test/devices.e2e-spec.ts`: usuarios sembrados
  directo en la base, tokens firmados con el `TOKEN_SERVICE` de la app,
  identificadores con `RUN_ID`): R1 (columnas y checks), R3 (los 7 casos de la
  tabla), R4 (con/sin suscripción vs `listActiveAssignments()` y vs
  `runOnce()`), R5, R7, R8, R9, R10, R11, R13, R16, R17.
- **Unitario `pet-tracking.guard.spec.ts`**: R8 con un
  `SubscriptionRepository` mock — el body exacto del 402, y el `404` cuando
  falta `request.petMembership`.
- **Unitario `claim-device.use-case.spec.ts`** (archivo existente, se **añade**
  un `describe`): R7 con mocks — orden de errores y que `devices.claim` no se
  llama.
- **Unitario `entitlement.predicate.spec.ts`**: solo que el SQL renderizado
  interpola `DEVICE_SUBSCRIPTION_GRACE_DAYS` y no contiene
  `AT TIME ZONE` (R2). La semántica se prueba en e2e, no aquí.
- **`grep` como test**: R2 (la regla en un solo sitio), R14 (cero proveedores de
  pago), R16 (cero claves nuevas). Se ejecutan a mano y se registran en
  [[traceability]] citando el comando y su salida.

**No hay regresión permitida**: los e2e existentes de `positions`, `activity`,
`geofences`, `alerts-engine`, `alerts-center-notifier`, `ingestion` y `devices`
deben seguir verdes **sin editarlos**, y eso solo pasa si el backfill de R17 y
el seed hacen su trabajo. Si un e2e existente hay que tocarlo, es señal de que
el backfill está mal, no de que el test esté mal.

## Inventario de riesgo

| Riesgo | Por qué duele | Mitigación en la spec |
|---|---|---|
| Apagar el entorno local con la migración | sin fila ⇒ sin entitlement ⇒ poller muerto, e2e rojos, smoke de GPS de #24 muerto | R17: backfill en la migración + seed de simulados |
| `402` antes de `404` | filtra la existencia de una mascota ajena (brief §4) | R8: composición de guards en orden y lectura de `request.petMembership` |
| La regla duplicada (TS + SQL) | se desincronizan y el poller cobra distinto que el API | R2 + D4: un solo predicado, verificado por grep |
| Revivir un collar impagado hace meses | el poller pide todo el histórico a Wialon y lo trocea en miles de mensajes SQS | R6/D10: reset del watermark en la transición |
| Liberar el device al vencer | cierra `pet_devices.released_at`, huérfano el historial, exige re-claim | R5: esta feature no hace `UPDATE` sobre `pet_devices` ni `devices.status` |
| `now() AT TIME ZONE` en el predicado | desplaza la comparación por el offset del servidor; el vencimiento se calcula mal | R2 lo prohíbe explícitamente |
| Guard sin provider | explota en la primera petición, no en el build | R15: los cuatro módulos importan `SubscriptionsModule`; los e2e lo cubren |
| Lotes de timestamps sintéticos en los tests nuevos | auditar el `BASE_TS` **no basta**: hay que mirar el offset **acumulado** — 100 posiciones con paso de 30 s acaban 48 min por delante del inicio. Con #27 (`reject-future-positions`) cerrada, una posición con `ts` futuro se **descarta como anomalía** y el test falla por una razón que no tiene nada que ver con suscripciones | cualquier fixture nuevo del poller debe terminar el lote **en el pasado**: `BASE_TS = now - (n * paso) - margen`, y el test asegura `max(ts) < now` |
| `SIM_MODE` en las corridas del poller | sin `SIM_MODE=false` el factory devuelve el fake y las posiciones simuladas parecen reales | los tests inyectan el `WialonClient` como stub; ninguno lee el token |
| LocalStack pierde recursos al reiniciar | los e2e de ingesta necesitan la cola `positions-raw` | `pnpm -C backend-pet-tracker run provision:local` antes de los e2e (nada nuevo de esta feature) |

## Migración

1. Escribir `src/db/schema/subscriptions.schema.ts` y exportarlo del barrel.
2. `pnpm -C backend-pet-tracker run db:generate` → **exactamente un** archivo
   nuevo en `src/db/migrations/` (más su entrada en `meta/`).
3. **Añadir a mano** al final de ese `.sql` el `INSERT ... SELECT` de R17.
   Drizzle no genera datos; el backfill es parte de la misma unidad reversible.
4. Aplicar: `pnpm -C backend-pet-tracker exec drizzle-kit migrate` (este repo no
   tiene script `db:migrate`, `STATUS.md:386-388`).
5. `pnpm -C backend-pet-tracker run seed:devices` para verificar la extensión
   del seed (R17) sobre una base ya sembrada: idempotente, no debe cambiar nada.

## Alternativas descartadas

- **Suscripción por usuario** (`user_subscriptions`): desalinea precio y costo
  (el costo es por collar) y rompe el caso familiar — cada miembro de
  `pet_users` tendría que pagar para ver la misma mascota. Decidido el
  2026-08-14; no se reabre.
- **Un estado `past_due` explícito**: nadie lo escribiría en esta fase (D2).
- **Regla como función pura de dominio `isEntitled(sub, now)`**: obliga a una
  segunda expresión SQL para el poller ⇒ la regla en dos sitios, que es
  literalmente lo que el criterio de aceptación 1 prohíbe (D4).
- **`isPetTracked(petId, userId)`**: invita a excepciones por usuario y rompe la
  propiedad "el collar pagado sirve a todos los miembros" (D1).
- **Modificar `PetAccessGuard` para que también mire entitlement**: contrato de
  #5 compartido por 11 controllers, y mezclaría dos motivos de rechazo con
  reglas de filtración distintas (D5).
- **Interceptor global que gatee por patrón de ruta**: una regexp sobre URLs
  como fuente de verdad de la autorización; se rompe sin ruido en cuanto alguien
  añade una ruta. La lista explícita de R9 es auditable.
- **Endpoint admin `POST /v1/admin/device-subscriptions`**: exigiría un rol de
  plataforma inexistente (D11).
- **Gatear el consumidor SQS y los workers aguas abajo**: pierde datos de un
  periodo pagado y no ahorra nada adicional (D7).
- **`402` en `GET /v1/alerts`**: esconde las alertas de la mascota pagada (D8).
- **Añadir `tracked` a `PetProfileResponse`**: rompe el contrato congelado de
  #5 R8. Es una feature aparte (R16, §Fuera de alcance).
- **Variable de entorno para los días de gracia**: divergencia silenciosa entre
  entornos, una fila más que vigilar en la tabla de `docs/conventions.md` y en
  el drift de #23, a cambio de nada — no hay razón operativa para que dev y prod
  tengan gracias distintas (D2).
