---
feature: "alerts-engine"
status: draft        # draft | approved
tags: [harness, spec]
---

# Diseño — [[alerts-engine]]

> Ver [[requirements]] para los requisitos que este diseño implementa
> (incluidas las decisiones abiertas **D1-D5**, todas pendientes de
> confirmación humana en el gate) y
> [[../../docs/architecture|architecture]] para las reglas de capas del
> proyecto.

## Decisiones técnicas

- **`alert_events` en `src/db/schema/alerts.schema.ts` propio** — sirve a
  R1, R2 (**D1**, **D4**). Convención de `docs/conventions.md`: un
  `<module>.schema.ts` por concepto, re-export en el barrel `index.ts`,
  migración `0007_*` generada con `drizzle-kit generate`. `geofence_id`
  nullable con `ON DELETE SET NULL` (**D1**-A): la fila de alerta sobrevive
  al borrado de la geocerca que la originó, con `geofence_id` puesto a
  `NULL` — el `payload` (guardado al abrir, nunca reescrito) ya conserva el
  nombre de la geocerca para mostrar. Índice único parcial anti-spam:

  ```typescript
  uniqueIndex('alert_events_open_anti_spam_idx')
    .on(
      table.petId,
      table.type,
      sql`coalesce(${table.geofenceId}, '00000000-0000-0000-0000-000000000000'::uuid)`,
    )
    .where(sql`${table.status} = 'open'`)
  ```

  (**D4**: literal en vez de `uuid_nil()` — el proyecto no tiene `uuid-ossp`
  habilitada y el literal es el valor exacto que esa función devuelve, cero
  extensión nueva por una constante). `type` CHECK reducido a
  `('geofence_exit', 'battery_low')` — mismo criterio que `geofences.type`
  de #11 (no reservar espacio para valores que la app no produce todavía).
  `status` CHECK con las tres del doc (`'open', 'acked', 'closed'`) porque
  `docs/data-model.md` ya las fija sin una taxonomía más amplia que recortar
  (a diferencia de `geofences.type`, que sí traía una lista larga futura) —
  admitir `'acked'` ya evita una migración de CHECK cuando #13 llegue, sin
  que esta feature la escriba nunca.

- **Nueva cola `geofence-events` + regla EventBridge, extendiendo
  `aws/provisioning.ts`** — sirve a R3, R4 (**D2**). El patrón de la regla:

  ```json
  {
    "source": ["pet-tracker"],
    "detail-type": ["position.updated", "battery.low"]
  }
  ```

  con un único target (la cola, sin `RawMessageDelivery`): el mensaje SQS
  conserva el sobre EventBridge completo (`{"detail-type": "...", detail:
  {...}, source, time, ...}`), así el worker despacha por `detail-type` en
  vez de inferir el tipo de evento por la forma del `detail` (más explícito
  que "si tiene `position`, es `position.updated`"). `PutRuleCommand`/
  `PutTargetsCommand` son upsert nativos — a diferencia de
  `CreateQueueCommand`/`CreateTableCommand`, no hace falta capturar una
  excepción de duplicado para la idempotencia de R4; solo la cola+DLQ
  reutiliza `ensureQueueWithDlq()` tal cual (cero código nuevo para esa
  parte). Se añade a `provisionAllResources()` — el único punto de entrada
  de `pnpm run provision:local` — para no romper el flujo de "un comando
  deja LocalStack listo para toda la app" que es la razón de ser de #2.

- **Reubicación de `EVENT_SOURCE`/`DETAIL_TYPE_POSITION_UPDATED`/
  `DETAIL_TYPE_BATTERY_LOW` de `workers/ingestion.constants.ts` a
  `aws/constants.ts`** — sirve a R4 (**D2**). `aws/provisioning.ts` (capa
  compartida, más fundacional que cualquier worker de feature) necesita
  estos tres valores para construir el `EventPattern` de R4; importarlos
  desde `workers/ingestion.constants.ts` invertiría la dirección de
  dependencia (infraestructura compartida dependiendo de una feature
  concreta). Se mueven a `aws/constants.ts`, que ya es el hogar de
  `EVENT_BUS_NAME` — mismo criterio de "constantes de recursos AWS
  compartidas en un solo lugar" que motivó ese archivo en #2.
  `ingestion.constants.ts` deja de exportarlas; `positions-consumer.
  service.ts` (su único importador hoy) cambia el import a
  `@/aws/constants` — **valor idéntico, contrato R16/R17 de #8 intacto**,
  es una relocación mecánica, no una reinterpretación.

- **Puerto propio del worker (`AlertsEngineStore`), no una extensión de
  `GeofenceRepository`** — sirve a R7-R12 (**D2**, mismo criterio D14 de
  `wialon-ingestion-pipeline`: "no se extienden repositorios cuyo contrato
  está cerrado por specs aprobadas"). El propio design.md de #11 (cerrado)
  ya descartó explícitamente añadirle un método `updateState` a
  `GeofenceRepository` para este consumidor — y de hecho no podría: ese
  repositorio no expone ninguna forma de tocar `geofence_state`
  (`GeofenceFieldChanges` no incluye ese campo). Interfaz nueva en
  `src/workers/alerts-engine/alerts-engine-store.ts`:

  ```typescript
  export interface ActiveGeofenceForEval {
    id: string;
    name: string;
    centerLat: number;
    centerLng: number;
    radiusM: number;
    state: GeofenceState; // de src/pipeline/geofence-eval.ts
  }

  export interface AlertsEngineStore {
    listActiveGeofencesForPet(petId: string): Promise<ActiveGeofenceForEval[]>;
    updateGeofenceState(geofenceId: string, state: GeofenceState): Promise<void>;

    /** INSERT; null si el índice único de R2 rechazó (anti-spam). */
    openAlert(input: {
      petId: string;
      type: 'geofence_exit' | 'battery_low';
      geofenceId: string | null;
      payload: Record<string, unknown>;
      openedAt: Date;
    }): Promise<{ id: string } | null>;

    /** UPDATE condicional WHERE status='open'; null si cero filas afectadas. */
    closeOpenAlert(input: {
      petId: string;
      type: 'geofence_exit' | 'battery_low';
      geofenceId: string | null;
      closedAt: Date;
    }): Promise<{ id: string } | null>;
  }
  ```

  `openAlert()` traduce `23505` del mismo modo que
  `translateUniqueViolation()`/`findPgError()` de `device.drizzle.
  repository.ts` (#7) — reutiliza el patrón, no la función (vive en otro
  módulo, sin exportar). El nombre de la mascota para R15 se lee vía
  `PET_REPOSITORY`/`PetRepository.findById()` existente (#5), inyectado
  directamente en el consumer — lectura pura de un contrato ya cerrado, sin
  añadirle métodos.

- **Orden de escritura a prueba de caídas: `alert_events` antes que
  `geofence_state`** — sirve a R8, R9, R11 (**D3**). Ver el razonamiento
  completo en `requirements.md` D3: escribir la fila de alerta primero hace
  que una caída a mitad de camino sea recuperable por redelivery (el estado
  no avanzado hace que `evaluate()` vuelva a emitir el mismo evento, y el
  índice único de R2 absorbe el reintento sin duplicar). El orden inverso
  perdería la apertura para siempre en ese escenario.

- **Guarda "solo si `position.ts` es más reciente que `geofence_state.
  updatedAt`" antes de evaluar cada geocerca** — sirve a R7, R14 (**D3**).
  Mismo criterio que el `WHERE` de "solo si el ts entrante es más reciente"
  que `IngestionDrizzleStore` ya aplica a `devices`/`pets.last_position`
  (#8, R14). Se resuelve en memoria en el consumer (ya tiene ambos valores
  tras `listActiveGeofencesForPet()`), no en el `WHERE` de una consulta —
  `geofence_state` es jsonb, comparar `->>'updatedAt'` en SQL sería más
  frágil que comparar en TypeScript tras el `SELECT`.

- **`nowMs`/`opened_at`/`closed_at` derivados de `position.ts` cuando el
  evento lo trae, del reloj inyectado del worker cuando no (`battery.low`)**
  — sirve a R8, R9, R11, R12 (**D3**). Mismo criterio D10 de
  `wialon-ingestion-pipeline`: el consumer expone `drainOnce(now: Date = new
  Date())`, nunca lee `Date.now()` en medio de la lógica — permite que
  tests y el e2e (R18) inyecten un reloj fijo y disparen el ciclo completo
  sin esperar 2 minutos reales.

- **Mensaje `notifications` con `version: 1`** — sirve a R15 (**D5**). Mismo
  criterio que todo contrato de mensaje versionado del proyecto
  (`positionsMessageSchema`, `position.updated`/`battery.low`): un cambio de
  shape futuro se declara incrementando `version`, nunca una mutación
  silenciosa que `alerts-center-notifier` (#13) tendría que descubrir por
  tanteo.

- **`BATTERY_RECOVERY_THRESHOLD_PCT = 30` en `pipeline/constants.ts`,
  junto a `BATTERY_LOW_THRESHOLD_PCT`** — sirve a R11. El propio comentario
  de esa constante (#8) ya anuncia esta feature: "Histéresis: #12 cierra la
  alerta con batería >= 30 (design.md D8)" — se cumple esa promesa
  literalmente, un solo archivo de umbrales, cero número mágico `30` suelto
  en el consumer.

## Estructura de capas

```
backend-pet-tracker/src/
├── pipeline/
│   └── constants.ts                              [EDITADO: +1 umbral batería]
│
├── aws/
│   ├── constants.ts                               [EDITADO: +3 nuevas, +3 reubicadas de workers/]
│   └── provisioning.ts                            [EDITADO: +1 función, +1 línea en provisionAllResources]
│
├── db/
│   ├── schema/alerts.schema.ts                    [nuevo: tabla alert_events]
│   ├── schema/index.ts                            [editado: +1 línea de re-export]
│   └── migrations/0007_*.sql                      [generado por drizzle-kit]
│
└── workers/
    ├── ingestion.constants.ts                     [EDITADO: -3 constantes reubicadas]
    ├── positions-consumer.service.ts               [EDITADO: import de esas 3 constantes desde @/aws/constants]
    └── alerts-engine/                              [worker nuevo completo]
        ├── alerts-engine.constants.ts              ← ALERT_TYPE_GEOFENCE_EXIT/BATTERY_LOW, receive/wait params
        ├── alerts-engine-store.ts                  ← interface + token ALERTS_ENGINE_STORE
        ├── alerts-engine.drizzle.store.ts           ← implementación (geofences + alert_events)
        ├── geofence-event-message.schema.ts        ← zod: sobre EventBridge + union por detail-type
        ├── alerts-engine-consumer.service.ts        ← drainOnce()/consumeMessage(), lógica de R7-R15
        ├── alerts-engine-scheduler.service.ts       ← cron 1 min, gateado por ALERTS_ENGINE_ENABLED (R17)
        └── alerts-engine.module.ts                  ← providers + import en AppModule
```

## Archivos afectados

- `backend-pet-tracker/src/pipeline/constants.ts` — editado: solo se añade
  `BATTERY_RECOVERY_THRESHOLD_PCT` (R11); los exports existentes no se
  tocan.
- `backend-pet-tracker/src/aws/constants.ts` — editado: `+QUEUE_
  GEOFENCE_EVENTS`, `+QUEUE_GEOFENCE_EVENTS_DLQ`, `+RULE_GEOFENCE_EVENTS`
  (R3, R4); `+EVENT_SOURCE`, `+DETAIL_TYPE_POSITION_UPDATED`, `+DETAIL_
  TYPE_BATTERY_LOW` reubicadas desde `workers/ingestion.constants.ts`
  (mismo valor, **D2**).
- `backend-pet-tracker/src/aws/provisioning.ts` — editado: nueva función
  (nombre libre para el implementer, ej. `provisionGeofenceEventsRoute`)
  que crea cola+DLQ (reutilizando `ensureQueueWithDlq`) y la regla+target
  (R3, R4); una línea nueva en `provisionAllResources()` que la invoca.
  Las 4 funciones de provisioning existentes no cambian.
- `backend-pet-tracker/src/workers/ingestion.constants.ts` — editado: se
  quitan las 3 constantes reubicadas (**D2**); `POSITIONS_DOC_CLIENT` queda
  intacto.
- `backend-pet-tracker/src/workers/positions-consumer.service.ts` —
  editado: solo el import de esas 3 constantes pasa a `@/aws/constants`; el
  resto del archivo (lógica de R12-R18 de #8) no cambia.
- `backend-pet-tracker/src/db/schema/alerts.schema.ts` — nuevo (R1, R2);
  `src/db/schema/index.ts` — **una línea** de re-export.
- `backend-pet-tracker/src/db/migrations/0007_*.sql` + `meta/` — generados
  por `pnpm run db:generate`.
- `backend-pet-tracker/src/workers/alerts-engine/**` — worker nuevo
  completo (R3-R18), fuera de las 3 capas domain/application/infrastructure
  porque no modela un caso de uso HTTP — mismo criterio que `src/workers/`
  existente (`positions-consumer.service.ts`, `ingestion-store.ts`): es
  infraestructura de fondo, análoga en estatus a `IngestionModule`. Todo
  import que cruza de carpeta usa el alias `@/` (`docs/conventions.md`
  §Imports); relativo solo intra-carpeta.
- `backend-pet-tracker/src/app.module.ts` — **una línea**: importa el
  módulo nuevo.
- `backend-pet-tracker/test/alerts-engine.e2e-spec.ts` — nuevo: anti-spam
  exit/exit/enter (R13), idempotencia por redelivery (R14), cierre por
  batería (R11), ciclo completo sin espera de reloj (R18).
- `docs/data-model.md` — fila `alert_events` afinada con el shape real de
  R1/R2, nota de que `geofence_state` ya lo escribe esta feature.
- `docs/conventions.md` — tabla de variables de entorno: `ALERTS_ENGINE_
  ENABLED`. `.env.example` — misma variable.
- `progress/impl_alerts-engine.md` — reporte del implementer;
  `specs/alerts-engine/traceability.md` — completado por el implementer.

Sin dependencias nuevas (`@aws-sdk/client-sqs`, `@aws-sdk/client-
eventbridge`, `zod`, `uuidv7`, `drizzle-orm` ya están instalados).

## Alternativas descartadas

- **Extender `GeofenceRepository` con `updateState()`**: descartada
  (**D2**) — el propio design.md de #11 ya lo descartó explícitamente para
  este mismo consumidor; reabrir un contrato cerrado de una spec aprobada
  para ahorrarse una interfaz nueva de 4 métodos no compensa.
- **Consumir el bus EventBridge sin una cola SQS intermedia**: descartada
  (**D2**) — EventBridge no tiene una API de polling; la única forma de que
  un worker en el mismo proceso NestJS "consuma" eventos del bus en
  LocalStack es una regla con target SQS (o Lambda real, que no existe en
  este entorno) — mismo mapeo de `docs/architecture.md` ("Lambda...
  engine... → consumidores SQS").
- **`RawMessageDelivery: true` en el target de la regla**: descartada
  (**D2**) — sin el sobre, el mensaje SQS sería solo el `detail`, y
  `position.updated`/`battery.low` tendrían que distinguirse por la forma
  del payload (¿tiene `position`?) en vez de un campo explícito — más
  frágil ante un futuro tercer tipo de evento en el mismo bus.
- **Cola/regla de esta feature fuera de `provisionAllResources()`**:
  descartada (**D2**) — rompería el flujo de un solo comando
  (`pnpm run provision:local`) que deja LocalStack listo para toda la app.
- **Habilitar `uuid-ossp` y usar `uuid_nil()` literal del doc**: descartada
  por ahora (**D4**) — una extensión de Postgres completa por una única
  función cuyo valor de retorno es una constante conocida y estable; el
  literal `'00000000-...'::uuid` es funcionalmente idéntico.
- **Transacción única envolviendo `alert_events` + `geofence_state`**:
  descartada (**D3**) — ver el razonamiento de orden: envolver ambas
  escrituras en una sola transacción y hacer `ROLLBACK`/`SAVEPOINT` al
  capturar `23505` añade complejidad (savepoints explícitos) para lograr
  exactamente el mismo resultado que dos escrituras secuenciales en el
  orden correcto ya dan gratis, aprovechando que ambas escrituras son
  independientemente idempotentes.
- **Encolar a `notifications` antes de escribir en `alert_events`**:
  descartada (**D3**) — invierte la garantía de anti-spam: una redelivery
  después de una escritura ya exitosa volvería a notificar antes de
  descubrir que el `INSERT`/`UPDATE` no tenía nada que hacer.
- **Outbox transaccional para el encolado a `notifications`**: descartado
  por ahora — la ventana de pérdida (caída justo entre la escritura en base
  y el `SendMessage`) es rara en un entorno de desarrollo local; documentada
  como `ponytail` en `requirements.md` §Fuera de alcance con su upgrade
  path, no bloquea el MVP.
- **Colas FIFO para `geofence-events`/`notifications`**: descartadas — el
  guard de "ts más reciente" (R7) ya mitiga el caso más dañino (desorden
  regresando un estado ya avanzado); FIFO añade límites de throughput y
  configuración que nadie pidió para este volumen.
