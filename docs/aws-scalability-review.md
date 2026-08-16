# Revisión de escalabilidad y costos — arquitectura serverless AWS

Fecha: 2026-08-11. Commit base: `31a7b2f` (plan `plans/012-validacion-escalabilidad-costos.md`).
Fuentes: `plans/README.md` §"Decisiones de arquitectura", `plans/presupuesto-produccion.md`,
`infra/lib/pet-tracker-dev-stack.ts`, `backend-pet-tracker/src/workers/*`. Cero llamadas
`aws`/`cdk` ejecutadas para producir este documento.

Escenarios de carga usados a lo largo del documento:

- **Lanzamiento**: 100 collares / 150 usuarios → 3,3 escrituras/s promedio de posiciones
  (100 ÷ 30 s), 8,6 M posiciones/mes.
- **Crecimiento**: 1 000 collares / 1 500 usuarios → 33,3 escrituras/s promedio,
  86,4 M posiciones/mes.

## Cuotas y límites verificados

Región `us-east-1`. Cuotas por defecto de cuenta nueva; ajustables salvo que se indique lo
contrario.

| Servicio | Límite | Fuente | ¿Frena antes que el diseño? |
|---|---|---|---|
| Lambda — concurrencia | 1 000 ejecuciones concurrentes por cuenta/región es el valor de cuenta establecida. Cuentas nuevas arrancan con una cuota reducida que AWS incrementa de forma automática según uso; la cifra exacta de arranque **sin verificar** — la doc oficial dice "reduced" sin publicar el número | [Lambda quotas](https://docs.aws.amazon.com/lambda/latest/dg/gettingstarted-limits.html) | Posiblemente sí — ver H5 |
| DynamoDB on-demand | Por tabla: 40 000 unidades de lectura y 40 000 de escritura (ajustable vía Service Quotas). Tabla nueva sostiene de inmediato 4 000 escrituras/s y 12 000 lecturas/s, y duplica instantáneamente el pico previo (riesgo de throttling si se supera el doble del pico previo en menos de 30 min) | [Quotas en DynamoDB](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/ServiceQuotas.html) · [Modo on-demand](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/on-demand-capacity-mode.html) | No — muy por encima de Crecimiento (33 escrituras/s) |
| Aurora Serverless v2 — resume + RDS Data API | Resume desde 0 ACU: aproximadamente 15 s en el caso típico (si llevaba más de 24 h pausada, 30 s o más). RDS Data API: límite de tamaño de respuesta de 1 MiB por llamada. El límite de solicitudes/s para Data API en Sv2 **sin verificar** en doc oficial (la página de limitaciones no publica una cifra; fuentes de terceros afirman que ya no aplica el tope de 1 000 rps que sí tenía Sv1, pero no se confirmó en fuente oficial esta sesión) | [Auto-pause Aurora Sv2](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2-auto-pause.html) · [Limitaciones RDS Data API](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/data-api.limitations.html) | Latencia sí (H4); rendimiento sin verificar |
| EventBridge | PutEvents: 10 000 TPS en us-east-1 (ajustable). Ingesta de eventos custom: 1,00 USD por millón; entrega al mismo destino de cuenta: 0 USD adicional | [Cuotas EventBridge](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-quota.html) · [Precios EventBridge](https://aws.amazon.com/eventbridge/pricing/) | No en rendimiento — el costo sí es la palanca (H2) |
| API Gateway HTTP API | 10 000 rps por cuenta/región, ráfaga con cubeta (token bucket) de 5 000 solicitudes | [Cuotas API Gateway](https://docs.aws.amazon.com/apigateway/latest/developerguide/limits.html) | No a los volúmenes de Lanzamiento/Crecimiento; relevante para H6 |
| SQS estándar | Rendimiento "nearly unlimited" por acción (SendMessage/ReceiveMessage/DeleteMessage). Único límite práctico: aproximadamente 120 000 mensajes en vuelo por cola | [Tipos de cola SQS](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-queue-types.html) · [Cuotas SQS](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/quotas-queues.html) | No |
| EventBridge Scheduler | 10 000 000 schedules por región. Invocaciones: 1 000 TPS en us-east-1. CreateSchedule: 5 000 TPS en us-east-1 (todas ajustables) | [Cuotas EventBridge Scheduler](https://docs.aws.amazon.com/scheduler/latest/UserGuide/scheduler-quotas.html) | No — recordatorios one-shot muy por debajo de estas cifras |
| Cognito Essentials | 10 000 MAU/mes gratis por cuenta u organización; 0,015 USD por MAU adicional | [Precios Cognito](https://aws.amazon.com/cognito/pricing/) | No a los 150-1 500 usuarios previstos |

## Puntos de quiebre por componente

### DynamoDB `positions` (ingesta de telemetría)

Mecanismo: tabla `PROVISIONED` 25 RCU / 25 WCU en dev (`infra/lib/pet-tracker-dev-stack.ts:70-90`,
decisión consciente de la feature #20 para cubrir el Always Free tier). Sin autoscaling
configurado; sin migración documentada a on-demand.

Punto de quiebre: 25 WCU ÷ 0,033 escrituras/s por collar (reporte cada 30 s) ≈ **750 collares
sostenidos** antes del throttling (ver H1 para el cálculo completo).

Acción y cuándo: fijar una alarma de CloudWatch sobre `ConsumedWriteCapacityUnits` en un umbral
de aviso (por ejemplo 70% ≈ 525 collares) y decidir con antelación si la migración es a on-demand
(alineado con `plans/README.md`, que ya elige on-demand para producción) o a `PROVISIONED` con
autoscaling.

### EventBridge bus (`pet-tracker`)

Mecanismo: cada mensaje SQS procesado por el consumidor emite un evento `position.updated`
(uno por mensaje, no por posición individual — ver H2). El rendimiento (10 000 TPS) nunca es el
límite a esta escala; el costo sí escala de forma lineal con collares × ciclos de sondeo.

Punto de quiebre: no hay un umbral de saturación a los volúmenes previstos; es una decisión de
costo pendiente, no un límite técnico.

Acción y cuándo: decidir la palanca "publicar solo transiciones" (geocerca, batería) antes de
escalar a Crecimiento — ver H2 y la sección de Discrepancias para el costo real recalculado.

### Poller de ingesta Wialon

Mecanismo: `PollerService.runOnce()` recorre las asignaciones activas en un bucle secuencial
(`for (const assignment of assignments) { await this.pollAssignment(...) }`,
`backend-pet-tracker/src/workers/poller.service.ts:57-70`) — sin paralelismo. El ciclo se
dispara cada 60 000 ms (`POLLER_INTERVAL_MS`,
`backend-pet-tracker/src/workers/ingestion-scheduler.service.ts:9`). Un guard en memoria
(`this.running`) descarta el tick completo si el ciclo anterior sigue activo — el efecto de una
saturación no es un error sino datos más viejos (staleness silenciosa).

Punto de quiebre numérico: N collares tales que N × (latencia de `wialon.getMessages()` +
latencia de `SendMessageCommand`) supere 60 s. La latencia real de la API de Wialon **no está
verificada** en este repositorio ni en fuente externa consultada esta sesión — es la variable
crítica sin medir. A modo ilustrativo (no verificado): con 100 ms por collar por ciclo, N ≈ 600
antes de saturar el minuto; con 500 ms por collar, N ≈ 120.

Acción y cuándo: correr una prueba de carga contra la API real de Wialon (o el simulador con
latencia inyectada) antes de aproximarse a cientos de collares, para reemplazar la cifra
ilustrativa por una medida. Mitigaciones ya anotadas en `plans/README.md:20`: shard del poller
por lote de unidades, o migrar a webhook push de Wialon si el partnership lo permite.

### Aurora Serverless v2 (dominio relacional)

Mecanismo: aún no está desplegada — no aparece en `infra/lib/pet-tracker-dev-stack.ts` (dev usa
Postgres local vía LocalStack). Es una decisión de producción en `plans/README.md`, no un
recurso vivo hoy.

Punto de quiebre: no es de escala de tráfico sino de latencia de arranque — cada resume desde 0
ACU cuesta unos 15 s; el primer request tras un período de reposo puede agotar el tiempo de
espera del cliente (ver H4).

Acción y cuándo: fijar una capacidad mínima mayor a cero en el horario de uso activo antes del
lanzamiento a producción real. Con la tarifa de `plans/presupuesto-produccion.md:31`
(0,12 USD/ACU-h), 0,5 ACU 24/7 añade ≈ 0,5 × 0,12 × 730 ≈ 43,8 USD/mes; restringido a 12 h/día
activas, ≈ 21,6 USD/mes — cálculo propio, no una cifra de la fuente.

### Concurrencia Lambda de la cuenta

Mecanismo: en producción, API síncrona, poller, procesador de posiciones, motor de geocercas y
notificador comparten el mismo pool de concurrencia de la cuenta por región (1 000 en cuenta
establecida; menor si la cuenta es nueva, cifra exacta sin verificar — fila Lambda de la tabla
de cuotas).

Punto de quiebre: sin verificar con precisión porque depende del valor real de arranque de la
cuenta; si resultara ser una cifra reducida de dos dígitos, unos pocos usuarios concurrentes ya
saturan el pool compartido entre las cinco funciones.

Acción y cuándo: revisar la cuota real en Service Quotas antes del primer despliegue serio y
solicitar el aumento si hace falta — acción humana, no delegable (ver H5).

### API síncrona (polling MVP) vs WebSocket

Mecanismo: la app consulta el mapa por polling — 160 peticiones/usuario/día
(`plans/presupuesto-produccion.md:23`). El costo de ingesta en API Gateway escala linealmente
con usuarios: usuarios × 4 800 peticiones/mes ÷ 1 000 000 × 1,00 USD.

Punto de quiebre: solo el costo de ingesta de API Gateway (excluyendo Lambda y Aurora, que no
están desglosados por petición en el presupuesto) llegaría a 30 USD/mes — el techo alto del rango
de la fase 010 en `plans/presupuesto-produccion.md:44` — recién en torno a 6 250 usuarios, muy por
encima de Crecimiento (1 500). El cálculo completo de cruce (incluyendo Lambda + Aurora por
petición) queda deferido — el presupuesto no desglosa esos dos componentes por petición
individual (ver H6).

Acción y cuándo: la fase 010 (WebSocket) ya está planificada como post-MVP; no hay urgencia de
costo a los volúmenes de Crecimiento según este cálculo parcial, pero conviene revisar la carga
real de Lambda + Aurora en producción para completar la comparación antes de decidir el momento
exacto de migrar.

## Hallazgos

### H1 — DynamoDB PROVISIONED 25 WCU se agota en torno a 750 collares

Evidencia: `infra/lib/pet-tracker-dev-stack.ts:70-90` fija `BillingMode.PROVISIONED`,
`readCapacity: 25`, `writeCapacity: 25` de forma explícita (comentario en línea 88-89: "R8 lo
exige explícito para que el template documente el límite de costo"). Cada collar escribe cada
30 s ⇒ 0,033 escrituras/s; el ítem de posición (`toPositionItem`,
`backend-pet-tracker/src/workers/positions-consumer.service.ts:369-393`) tiene campos numéricos
pequeños, muy por debajo de 1 KB, por lo que 1 escritura ≈ 1 WCU. 25 WCU ÷ 0,033 ≈ 750 collares
sostenidos antes del throttling.

Recomendación: la migración a on-demand ya está decidida para producción en `plans/README.md`
línea 19; falta fijar el umbral numérico (750 collares, con alarma de aviso antes de llegar) como
disparador explícito de esa migración, en vez de dejarlo implícito.

### H2 — EventBridge cobra por mensaje SQS procesado, no por posición individual (semilla refinada, no descartada)

Evidencia que refina la semilla: `emitEvents()` en
`backend-pet-tracker/src/workers/positions-consumer.service.ts:228-286` emite un evento
`position.updated` por llamada a `handleMessage()`, es decir, uno por mensaje SQS — el comentario
en la línea 228-232 lo deja explícito: "Un evento position.updated por mensaje SQS, no por
posicion (R16)". El poller agrupa hasta 100 posiciones por mensaje
(`POSITIONS_PER_MESSAGE_MAX = 100`, `backend-pet-tracker/src/workers/poller.service.ts:16`) y
corre cada 60 s (`POLLER_INTERVAL_MS = 60_000`,
`backend-pet-tracker/src/workers/ingestion-scheduler.service.ts:9`). Con reporte cada 30 s, cada
ciclo de sondeo agrupa en régimen estable 2 posiciones por collar en un único mensaje ⇒ un único
evento — la mitad del conteo que resultaría de "un evento por posición".

Por qué la semilla no se descarta por completo: el bus sigue publicando en cada ciclo con datos nuevos, sin
filtrar por transición real (geocerca, batería) — el hallazgo central ("no se filtra, cuesta
dinero, la palanca sigue sin decidirse") se mantiene. Solo cambia el multiplicador exacto: la
unidad de costo es "ciclo de sondeo con datos nuevos por collar", no "posición individual".

Recomendación: decidir la palanca "publicar solo transiciones" (`plans/presupuesto-produccion.md`
§Palancas) y, si se implementa, filtrar en el productor — es decir, en el consumidor de
`positions-raw` (`positions-consumer.service.ts`, dentro de `emitEvents()`), comparando la
posición entrante contra el último estado conocido antes de invocar `PutEventsCommand`. Ver
también Discrepancias, más abajo, para el recálculo del costo con la cifra correcta.

### H3 — Poller único serial

Evidencia: `PollerService.runOnce()` recorre `assignments` con un `for...of` y `await` secuencial
dentro del cuerpo (`backend-pet-tracker/src/workers/poller.service.ts:57-70`), sin `Promise.all`
ni sharding. El guard `this.running` (líneas 36-41) evita solapes descartando el tick completo si
el anterior sigue activo — la degradación es datos más viejos, no un error visible.

Recomendación: cuantificar la latencia real de `wialon.getMessages()` con una prueba de carga
antes de acercarse a cientos de collares (la cifra hoy es ilustrativa, no medida — ver la sección
de puntos de quiebre). Mitigación ya anotada en `plans/README.md:20`: shard por lote de unidades o
webhook push de Wialon.

### H4 — Aurora scale-to-zero tiene costo de latencia

Evidencia oficial: "Use this feature with applications that can tolerate an interval of
approximately 15 seconds while establishing a connection" y, si la instancia lleva pausada más de
24 h, "the resume time can be 30 seconds or longer" — [Auto-pause Aurora
Sv2](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2-auto-pause.html).
Aceptable para dev (uso esporádico, tolerante a espera); en producción, un usuario que golpea la
API justo tras un período de reposo puede agotar el tiempo de espera de su cliente HTTP.

Recomendación: capacidad mínima mayor a cero en horario de uso activo (cálculo de costo en la
sección de puntos de quiebre, con la tarifa de `plans/presupuesto-produccion.md:31`).

### H5 — Concurrencia Lambda de la cuenta puede ser reducida en cuentas nuevas

Evidencia oficial parcial: "New AWS accounts have reduced concurrency and memory quotas for
Lambda Functions... AWS raises these quotas automatically based on your usage" — [Lambda
quotas](https://docs.aws.amazon.com/lambda/latest/dg/gettingstarted-limits.html). El valor de
cuenta establecida es 1 000; la doc oficial no publica la cifra exacta de arranque para cuentas
nuevas — **sin verificar** con fuente oficial (fuentes de comunidad citan valores de dos dígitos,
sin confirmación oficial).

Recomendación: revisar la cuota real de la cuenta de producción en el panel de Service Quotas
antes del primer despliegue serio y solicitar el aumento si hiciera falta. Esta verificación y la
solicitud de aumento las corre el humano — no son delegables a ninguna IA por la restricción de
este plan (nada de comandos `aws`).

### H6 — El MVP hace polling; cuantificar cuándo pesa más que WebSocket

Evidencia: `plans/presupuesto-produccion.md:23` fija ~160 peticiones/usuario/día. Solo el
componente de ingesta de API Gateway (1,00 USD/M peticiones,
[cuotas API Gateway](https://docs.aws.amazon.com/apigateway/latest/developerguide/limits.html))
escala como usuarios × 4 800/mes ÷ 1 000 000 USD. Igualar el techo alto de la fase 010
(30 USD/mes, `plans/presupuesto-produccion.md:44`) exige ≈ 6 250 usuarios — muy por encima de
Crecimiento (1 500).

Recomendación: el cálculo de cruce está incompleto porque el presupuesto no desglosa el costo de
Lambda ni de Aurora por petición individual (ambos escalan también con el polling, y son la parte
más cara del backend según `plans/presupuesto-produccion.md` líneas 31 y 35). Completar esa
descomposición es trabajo aparte, explícitamente diferido — no bloquea el veredicto de este
documento porque la fase 010 ya está planificada como siguiente paso post-MVP independientemente
del resultado exacto.

## Palancas de costo y decisiones pendientes

| Palanca | Ahorro estimado | Quién decide | Estado |
|---|---|---|---|
| EventBridge: publicar solo transiciones en vez de cada ciclo con datos nuevos | Línea base recalculada ≈43,2 USD/mes en Crecimiento (ver Discrepancias); el ahorro adicional de filtrar por transición real no está cuantificado esta sesión — depende de la frecuencia de cruces de geocerca/batería, dato de producto no disponible en el repositorio | Humano — decisión de producto sobre qué eventos importan a geocercas/alertas | Pendiente (H2) |
| DynamoDB: migrar de PROVISIONED 25/25 a on-demand (o autoscaling) antes de 750 collares | Evita throttling; costo pasa de fijo (~gratis en free tier) a variable con volumen | Humano — ya elegido on-demand para producción en `plans/README.md`, falta ejecutar y fijar el disparador numérico | Pendiente de umbral (H1) |
| Aurora: capacidad mínima > 0 solo en horario activo en vez de 24/7 o scale-to-zero total | Evita el costo pleno de 24/7 (~88 USD/mes a 1 ACU) sin pagar la latencia de resume en horas de uso | Humano — trade-off latencia/costo | Pendiente (H4) |
| Aurora: Database Savings Plan a 1 año | Hasta 35% de descuento (`plans/presupuesto-produccion.md:79`) | Humano — decisión financiera, requiere gasto estabilizado primero | Diferida (el propio presupuesto lo marca así) |
| DynamoDB: TTL de 90 días ya activo; histórico a S3 si se quiere retener más | Ya aplicado (`TABLE_POSITIONS_TTL_ATTRIBUTE`, `positions-consumer.service.ts:390-391`); mover a S3 es una extensión, no una corrección | Humano — solo si se necesita retención más allá de 90 días | No urgente |
| Lambda: solicitar aumento de concurrencia de cuenta antes de producción | Evita `TooManyRequestsException` en el primer pico real de tráfico | Humano — acción de Service Quotas, no delegable a IA en este plan | Pendiente (H5) |
| AWS Budgets como red de seguridad | Ya anotado en `plans/presupuesto-produccion.md:81` desde plan 002; no es una palanca de reducción, es una alarma | Humano | Confirmar que sigue activa |

## Discrepancias con el presupuesto

- **EventBridge (`plans/presupuesto-produccion.md:33`)**: la fila asume 1,00 USD/M eventos
  aplicado directamente sobre el conteo de posiciones (8,6 M / 86,4 M), es decir, 1 evento por
  posición individual. El código real emite 1 evento por mensaje SQS
  (`positions-consumer.service.ts:228-232`), y el poller agrupa hasta 100 posiciones por mensaje
  con un ciclo de 60 s frente a un reporte cada 30 s
  (`poller.service.ts:16`, `ingestion-scheduler.service.ts:9`). En régimen estable eso da 2
  posiciones por mensaje ⇒ la mitad de eventos de los asumidos: Lanzamiento 8,6 M ÷ 2 ≈ 4,3 M
  eventos/mes ≈ 4,3 USD/mes de ingesta (frente a los ~9 USD citados); Crecimiento 86,4 M ÷ 2 ≈
  43,2 M eventos/mes ≈ 43,2 USD/mes (frente al rango 20-86 USD citado — cae dentro del rango, pero
  el extremo alto de 86 USD asumía el conteo sin agrupar, así que ese extremo ya no aplica sin
  aplicar además la palanca de transiciones). Esta cifra recalculada (≈43,2 USD/mes) es el punto de
  partida real antes de decidir la palanca, no el resultado de aplicarla — el ahorro adicional de
  filtrar por transición sigue sin cuantificar (ver Palancas de costo).
- **Cierre de `geofence-eval-full-batch` (#30)**: `position.updated` v2 transporta hasta 100
  posiciones aceptadas en un solo `Entry`; el alerts-engine pliega el lote en memoria. El conteo
  y costo de EventBridge siguen siendo uno por mensaje SQS, y un test verifica que el `Detail` de
  100 posiciones permanece bajo el límite de 256 KB.
- Ninguna otra cifra revisada en este plan (Aurora, DynamoDB, Lambda, API Gateway, SQS, Cognito,
  EventBridge Scheduler) contradice lo publicado en `plans/presupuesto-produccion.md`; las cuotas
  oficiales verificadas quedan muy por encima de los volúmenes de Lanzamiento y Crecimiento salvo
  donde ya se anota lo contrario (H1, H4, H5).

## Veredicto

**GO con condiciones.** La arquitectura elegida escala sin cambios estructurales hasta
Crecimiento (1 000 collares / 1 500 usuarios): ninguna cuota de rendimiento verificada la frena
antes que el propio diseño. El costo mensual estimado en el presupuesto sigue siendo razonable, y
el hallazgo de EventBridge (H2) lo reduce, no lo aumenta. Antes de acercarse a esos volúmenes en
producción real hay que cerrar cinco decisiones humanas, no delegables a ninguna IA por este
plan: verificar y, si hace falta, aumentar la concurrencia Lambda de la cuenta (H5); fijar el
disparador de migración de DynamoDB a on-demand en 750 collares (H1); decidir la palanca de
EventBridge (H2); fijar la capacidad mínima de Aurora en horario activo (H4); y medir con carga
real la latencia del poller de Wialon para reemplazar la cifra ilustrativa de N por una medida
(H3).
