# Plan 005: Collar GPS — asociación de dispositivo, ingesta desde Wialon y última posición en mapa

> **Instrucciones para el ejecutor**: paso a paso, verificando cada paso; ante STOP, detente y reporta. Al terminar actualiza `plans/README.md` y `STATUS.md`.
>
> **Chequeo de deriva**: deben existir `PetAccessGuard` (plan 004), las colas SQS `positions-raw`/`notifications` con DLQ y el bus EventBridge `pet-tracker-dev` (plan 002), y `docs/wialon-module.md` (plan 001). Si falta algo, STOP.

## Estado

- **Prioridad**: P1 · **Esfuerzo**: L · **Riesgo**: MED (pipeline asíncrono nuevo; dependencia externa Wialon)
- **Depende de**: `plans/004-mascotas-crud-permisos.md`
- **Categoría**: direction (MVP items 6–9 del brief §20)

## Por qué importa

Es el corazón del producto: collar → Wialon → backend → app (brief §1, §10). Implementa el patrón serverless completo del proyecto (Scheduler → Lambda poller → SQS → Lambda procesadora → DynamoDB/Postgres → EventBridge), la asociación collar-mascota con validaciones (§7), el estado del dispositivo y la última posición en mapa. **Regla de oro: todo funciona sin hardware real** gracias a `FakeWialonClient` (SIM_MODE) — el token de Wialon real solo conmuta la implementación.

## Estado actual

- `docs/wialon-module.md` define: interfaz `WialonClient`, API real (`token/login` → `sid`, `messages/load_interval`), simulador, watermark `devices.ingest_watermark`, y el pipeline de validación con umbrales (accuracy > 100 m o sats < 4 ⇒ `low_accuracy`; salto implícito > 60 km/h ⇒ `suspect_jump`, se marca no se descarta; (0,0)/fuera de rango/sin ts ⇒ descartar; duplicados ⇒ descartar).
- Tablas `devices`, `pet_devices` migradas con el índice único parcial (un collar activo por mascota). DynamoDB `positions` (pk `PET#<petId>`, sk epoch ms, TTL `expires_at`) desplegada; env `POSITIONS_TABLE` y `EVENT_BUS` ya llegan a la Lambda API (plan 002).
- SSM `/pet-tracker/dev/wialon-token` existe con valor `PENDING`.
- Contrato OpenAPI: `POST /v1/devices/claim`, `GET/DELETE /v1/pets/{petId}/device`, `GET /v1/pets/{petId}/positions/last`, `GET /v1/pets/{petId}/positions?from&to`.

## Comandos

Los de `plans/002` (verify, test, deploy:dev, start móvil) + `token:dev` (plan 003). Nuevo: `npm -w apps/api run seed:devices` (paso 2).

## Alcance

**Dentro**: `packages/shared/src/telemetry.ts` (tipos `RawPosition`, `ProcessedPosition`), `apps/api/src/integrations/wialon/**` (`wialon-client.interface.ts`, `wialon-http.client.ts`, `fake-wialon.client.ts`, `wialon.factory.ts`), `apps/api/src/pipeline/**` (funciones puras de validación/normalización — sin dependencias de infra, para testear), `apps/api/src/handlers/wialon-poller.ts`, `apps/api/src/handlers/position-processor.ts`, `apps/api/src/modules/devices/**`, `apps/api/src/modules/positions/**` (endpoints last/history), `apps/api/scripts/seed-devices.ts`, `infra/lib/ingestion.ts` (nuevo constructo), pantallas `apps/mobile/app/pets/[petId]/device.tsx` y `(tabs)/map.tsx` + `apps/mobile/app/pets/[petId]/location.tsx`.

**Fuera**: recorridos/paseos/KPIs (plan 006), geocercas y alertas (plan 007 — aquí solo se EMITEN eventos al bus), webhook push desde Wialon (post-MVP; el diseño queda en `docs/wialon-module.md`), lectura de QR con cámara (post-MVP; el alta acepta código manual), tiempo real WebSocket (plan 010; la app usa polling 15 s en primer plano).

## Flujo git

`main`. Commits: `feat(shared): telemetry types`, `feat(api): wialon client with simulator`, `feat(api): position validation pipeline`, `feat(infra): ingestion pipeline (scheduler, poller, sqs, processor)`, `feat(api): devices claim and positions endpoints`, `feat(mobile): device status and live map`.

## Pasos

### Paso 1: Tipos y clientes Wialon

Implementar según `docs/wialon-module.md`:

- `WialonClient` (interfaz): `listUnits(): Promise<{unitId, name}[]>`, `getMessages(unitId, fromTs, toTs): Promise<RawPosition[]>`.
- `WialonHttpClient`: base `https://hst-api.wialon.com/wialon/ajax.html`; login por token en cada ejecución del poller (`svc=token/login`, `params={"token": <SSM>}` → `sid`); `svc=core/search_items` (`itemsType: 'avl_unit'`) para unidades; `svc=messages/load_interval` (`{itemId, timeFrom, timeTo, flags: 1, flagsMask: 65281, loadCount: 500}`) para mensajes; mapear `pos.y→lat, pos.x→lng, pos.s→speed, pos.c→course, pos.sc→sats`, batería desde params si el dispositivo la reporta. Errores de Wialon (`{error: N}`) → excepción tipada con el código.
- `FakeWialonClient`: determinista por semilla; N unidades fake (unitId 900001…) que generan un paseo realista: punto "casa" configurable (`SIM_HOME_LAT/LNG`, default Ciudad de México 19.4326, -99.1332), caminata aleatoria suave 0–8 km/h con pausas, ruido gaussiano ~10 m, cada ~50 puntos un salto absurdo (para probar `suspect_jump`) y un duplicado; batería baja 1 % cada ~30 min; un punto por cada 30 s del intervalo pedido.
- `wialonClientFactory`: `SIM_MODE=true` (env) o token SSM = `PENDING` → fake; si no → real. **Default dev: fake.**

**Verificar**: tests unitarios del fake (mismos ts+semilla ⇒ mismas posiciones; genera saltos y duplicados) y del mapeo de mensaje Wialon real desde un fixture JSON copiado de la doc de Wialon. `npm -w apps/api test` verde.

### Paso 2: Módulo devices + seed

- `seed:devices`: inserta 3 dispositivos simulados (`is_simulated: true`, esn SIM-001…003, activation_code ACT-001…003, wialon_unit_id 900001…900003, status 'available'). Idempotente.
- `POST /v1/devices/claim` `{petId, esn?|imei?|serialNumber?|activationCode?}` (auth + PetAccessGuard owner): busca el device por cualquiera de los identificadores; validaciones del brief §7: existe (404 DEVICE_NOT_FOUND), status 'available' y sin fila activa en `pet_devices` (409 DEVICE_ALREADY_ASSIGNED); transacción: insert `pet_devices`, device.status='assigned', watermark = now − 10 min; audit 'device.claim'.
- `GET /v1/pets/:petId/device` → `{model, batteryPct, connectivity, lastMessageAt, esn}` o `null`; `DELETE` → cierra `released_at`, status 'available', audit.

**Verificar**: curls: claim con ACT-001 → 201; segundo claim del mismo → 409; claim de otro usuario sobre mascota ajena → 404. Evidencia en reporte.

### Paso 3: Pipeline de validación (funciones puras)

`apps/api/src/pipeline/validate-positions.ts`: `normalize(raw: RawPosition[]): {accepted: ProcessedPosition[], discarded: DiscardedStat[]}` aplicando en orden las reglas de `docs/wialon-module.md` (rango, ts, duplicados exactos por device_ts, orden cronológico, velocidad implícita entre consecutivos → flag `suspect_jump`, accuracy/sats → flag `low_accuracy`). Haversine en `pipeline/geo.ts` (la reutiliza el plan 006). Sin I/O.

**Verificar**: tests con fixture `pipeline/__fixtures__/walk.json` (generado con el fake, ~200 puntos): descarta el (0,0) y el duplicado, marca el salto, conserva orden. Casos borde: lista vacía, un solo punto, todos inválidos.

### Paso 4: Infra de ingesta + workers

`infra/lib/ingestion.ts`:

- `NodejsFunction` `wialon-poller` (handler `apps/api/src/handlers/wialon-poller.ts`, 256 MB, timeout 55 s): cada ejecución — lista devices con asignación activa (Postgres), agrupa por unitId, `getMessages(unitId, watermark, now)` vía factory, publica lotes de ≤100 posiciones crudas a SQS `positions-raw` (body: `{deviceId, petId, unitId, positions}`), avanza watermark al ts del último mensaje recibido (solo si hubo mensajes). Regla EventBridge Scheduler `rate(1 minute)` → poller. Env: `SIM_MODE`, `DB_*`, `QUEUE_URL`.
- `NodejsFunction` `position-processor` (event source SQS `positions-raw`, batch 10, `reportBatchItemFailures: true`): por mensaje — `normalize()`, `BatchWriteItem` a DynamoDB (`pk=PET#<petId>`, `sk=device_ts`, `expires_at=device_ts/1000 + 90*86400`; PutItem idéntico ⇒ idempotente en reintentos), actualiza `devices` (battery_pct, connectivity 'online', last_message_at) y `pets.last_position` (jsonb `{lat,lng,ts,accuracy,battery}`) + `last_communication_at`, y emite a EventBridge: `source: 'pet-tracker'`, `detailType: 'position.updated'`, detail `{petId, deviceId, position: <última aceptada>, batteryPct}`; si batería < 20: `detailType: 'battery.low'` (el plan 007 los consumirá; hoy nadie escucha y no pasa nada — el bus tolera eventos sin reglas).
- Permisos mínimos por función (poller: SQS send + Data API + SSM read; processor: SQS consume + DynamoDB write + Data API + PutEvents).

**Verificar**: `npm -w infra run deploy:dev` exit 0; con SIM_MODE activo y ACT-001 reclamado, esperar 2 min y: (a) CloudWatch Logs del poller muestra "published N positions", (b) `aws dynamodb query` sobre `PET#<petId>` devuelve items, (c) DLQ vacía (`ApproximateNumberOfMessages = 0`).

### Paso 5: Endpoints de posiciones

`positions.controller.ts` (auth + PetAccessGuard): `GET /v1/pets/:petId/positions/last` → de `pets.last_position` (rápido, sin DynamoDB) + `staleSeconds` calculado; `GET /v1/pets/:petId/positions?from&to&cursor` → Query DynamoDB (máx 24 h de rango por llamada, `Limit 1000`, cursor = `LastEvaluatedKey` en base64), excluye por defecto puntos con flag `low_accuracy` salvo `?includeSuspect=true`.

**Verificar**: curls con token: last → 200 con lat/lng frescos del simulador; history del último cuarto de hora → lista no vacía; mascota ajena → 404.

### Paso 6: App — asociar collar, estado y mapa

- `pets/[petId]/device.tsx`: sin collar → formulario "Asociar collar" (un campo que acepta ESN/IMEI/serie/código de activación + ayuda "encuéntralo en la caja del collar"); con collar → card de estado (batería con icono y color, conectividad, "última señal hace X", botón desasociar con confirmación).
- `pets/[petId]/location.tsx` + tab Mapa: `react-native-maps` (`PROVIDER_DEFAULT`; en Android con Expo Go se usa el provider por defecto — anotar en README móvil que Google provider requiere development build y la key de `/pet-tracker/dev/google-maps-key`), marcador con foto de la mascota, precisión como círculo, banner de estado ("En casa · hace 30 s"), refresco por polling cada 15 s con la app en primer plano (limpiar interval al desmontar), pull-to-refresh. Tab Mapa: si hay varias mascotas, selector arriba.
- Perfil de mascota (plan 004): rellenar la sección `device` que quedó en `null`.

**Verificar**: `npm -w apps/mobile run typecheck` exit 0; manual: asociar ACT-002 a una mascota → en ~2 min aparece en el mapa y se mueve al refrescar. Si no hay dispositivo, typecheck + pendiente manual reportado.

### Paso 7: Cierre

OpenAPI al día; `STATUS.md`; fila 005 DONE; commits.

**Verificar**: `npm run verify` exit 0; `git status` limpio; DLQs vacías tras 30 min de simulación.

## Plan de pruebas

- Unitarios: fake client (determinismo, anomalías), mapeo Wialon real (fixture), pipeline (fixture walk.json + 3 bordes), devices service (claim feliz, 409, liberar), processor handler (mock de clientes AWS: escribe batch, actualiza caché, emite evento; mensaje malformado → va a batch failures).
- Integración manual (evidencia obligatoria): la cadena completa simulador→poller→SQS→processor→DynamoDB→endpoint last del paso 4/5.

## Criterios de done

- [ ] `npm run verify` exit 0 con los tests nuevos.
- [ ] Evidencia: posiciones simuladas fluyendo end-to-end y visibles en `GET .../positions/last` con ts < 2 min.
- [ ] DLQs en 0 tras ≥30 min de simulación continua.
- [ ] Claim valida existencia/disponibilidad/unicidad (curls 201/409/404 en el reporte).
- [ ] `battery.low` y `position.updated` visibles en CloudWatch (métrica PutEvents o log del processor).
- [ ] Mapa móvil muestra la última posición (o pendiente manual reportado).
- [ ] OpenAPI, `STATUS.md`, fila 005 al día.

## Condiciones de STOP

- Sin token Wialon real este plan NO se bloquea (SIM_MODE es el camino previsto). STOP solo si el fake tampoco puede correr (p. ej. el Scheduler no dispara: revisar una vez permisos del rol del Scheduler y reportar).
- El procesado supera el visibility timeout (mensajes reprocesados en bucle, DLQ creciendo) → STOP con métricas; no subas el timeout a ciegas.
- `pets.last_position` requiere migración de esquema no prevista → STOP: el modelo aprobado en 001 no debe mutar en silencio (propón la migración en el reporte).
- Wialon real devuelve estructuras distintas al fixture documentado → STOP y adjunta una respuesta cruda anonimizada para actualizar `docs/wialon-module.md`.

## Notas de mantenimiento

- El contrato del evento `position.updated` (detail shape) lo consumen los planes 006/007/010: cambiarlo rompe tres planes; versionar con `detail.version: 1`.
- El poller a 1 min con N dispositivos hace N llamadas/min a Wialon: con flota real habrá que batchear por sesión o migrar al webhook (diseño ya en `docs/wialon-module.md`).
- TTL 90 días en DynamoDB: si producto pide más historial, agregar export a S3 (Athena) antes de subir el TTL.
- Revisor: confirmar idempotencia del processor (PutItem por sk) y `reportBatchItemFailures` activo — sin eso, un mensaje venenoso reprocesa el lote entero.
