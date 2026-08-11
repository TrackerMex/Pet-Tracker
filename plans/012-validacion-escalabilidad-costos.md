# Plan 012: Validar escalabilidad y costos de la arquitectura serverless AWS

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat 31a7b2f..HEAD -- infra/lib/pet-tracker-dev-stack.ts plans/presupuesto-produccion.md plans/README.md docs/`
> Si algo cambió, compara "Current state" contra los archivos vivos; ante un
> desajuste, STOP.

## Status

- **Priority**: P2
- **Effort**: M
- **Risk**: LOW (solo produce un documento; cero recursos AWS)
- **Depends on**: none (plan 011 es independiente; pueden ir en paralelo)
- **Category**: direction
- **Planned at**: commit `31a7b2f`, 2026-08-11

## Why this matters

La arquitectura serverless se eligió (tabla en `plans/README.md`) y los costos
se estimaron (`plans/presupuesto-produccion.md`, 2026-07-28), pero nunca se
validó formalmente que la arquitectura ESCALA: a qué número de collares se
rompe cada pieza, qué cuota de AWS lo frena antes, y qué palanca de costo hay
que accionar y cuándo. Hoy hay decisiones tomadas "por free tier" (DynamoDB
PROVISIONED 25/25) sin umbral documentado de cuándo dejan de valer. Este plan
produce `docs/aws-scalability-review.md`: la revisión de escalabilidad y costo
con puntos de quiebre numéricos, para decidir con datos y no descubrirlo con
throttling en producción.

## Current state

- `plans/README.md` §"Decisiones de arquitectura" — servicios elegidos para
  producción (API GW + Lambda NestJS, Cognito, Aurora Serverless v2 con Data
  API, DynamoDB on-demand para telemetría, EventBridge Scheduler + SQS +
  EventBridge bus, Expo Push, S3+CloudFront, SSM).
- `plans/presupuesto-produccion.md` — costos estimados jul 2026: Lanzamiento
  (100 collares) $55–85/mes AWS; Crecimiento (1 000 collares) $250–400/mes.
  Supuestos: collar reporta cada 30 s → 2 880 posiciones/día/collar; 8,6 M
  posiciones/mes (100 collares), 86,4 M (1 000). Incluye §"Palancas de
  optimización" y §"Riesgos". NO recalcules esto: referéncialo.
- `infra/lib/pet-tracker-dev-stack.ts` — dev real desplegado: DynamoDB
  `positions` BillingMode PROVISIONED 25 RCU / 25 WCU (decisión de costo
  consciente de la feature #20: cubre el Always Free tier; "se acepta
  throttling si el ingest supera esa capacidad"). Producción según
  plans/README sería on-demand: la transición no tiene umbral escrito.
- El pipeline local publica **cada posición** como evento `position.updated`
  al bus EventBridge (`backend-pet-tracker/src/workers/positions-consumer.service.ts`);
  la palanca "publicar solo transiciones" está anotada en el presupuesto pero
  la decisión quedó pendiente.
- Idempotencia ya resuelta (fortaleza, no hallazgo): consumer de posiciones
  hace PutItem por sort key (#8) y el motor de alertas tiene índice único
  anti-spam (#12) — colas SQS estándar at-least-once están cubiertas.
- Convención: docs en español; no usar em dashes en nombres/descripciones de
  recursos AWS (CLAUDE.md).

## Commands you will need

| Purpose | Command | Expected on success |
|---|---|---|
| Verificar estructura del doc | `grep -c "^## " docs/aws-scalability-review.md` | ≥ 6 |
| Verificar hallazgos cubiertos | `grep -o "H[1-6]" docs/aws-scalability-review.md \| sort -u` | H1..H6 (6 líneas) |

Este plan NO ejecuta comandos AWS. Nada de `aws`, `cdk` ni creación de recursos.

## Suggested executor toolkit

- WebSearch/WebFetch para verificar cuotas y precios contra docs.aws.amazon.com
  (calculadora: https://calculator.aws). Si una cifra no se puede verificar en
  fuente oficial, se escribe "sin verificar" — nunca se inventa (regla del
  repo: CLAUDE.md §AWS Guidance).
- Si están disponibles, los skills `aws-serverless` y
  `aws-billing-and-cost-management` para cuotas de Lambda/API GW y modelo de
  precios.

## Scope

**In scope**:
- `docs/aws-scalability-review.md` (crear)

**Out of scope** (NO tocar):
- `plans/presupuesto-produccion.md` — si encuentras cifras desactualizadas,
  anótalas en la sección "Discrepancias" del doc nuevo, no lo edites.
- `infra/`, `backend-pet-tracker/` — cero cambios de código o stack.
- Cualquier comando que cree/modifique recursos AWS.

## Git workflow

- Branch: `docs/aws-scalability-review`.
- Conventional commit en inglés, p. ej. `docs(aws): add scalability and cost review`.
- NO push ni PR salvo instrucción del operador.

## Steps

### Step 1: Leer las fuentes

Lee completos: `plans/README.md` (decisiones + mermaid),
`plans/presupuesto-produccion.md` (supuestos y palancas),
`infra/lib/pet-tracker-dev-stack.ts` (dev real). Anota los dos escenarios de
carga que usarás en todo el doc:

- **Lanzamiento**: 100 collares / 150 usuarios → 3,3 escrituras/s promedio de
  posiciones (100 ÷ 30 s), 8,6 M posiciones/mes.
- **Crecimiento**: 1 000 collares / 1 500 usuarios → 33,3 escrituras/s
  promedio, 86,4 M posiciones/mes.

**Verify**: puedes enunciar ambos escenarios sin releer. (Autocomprobación;
sin comando.)

### Step 2: Verificar cuotas y límites en fuentes oficiales

Para cada fila, busca el valor vigente en la documentación oficial de AWS
(us-east-1) y anota valor + URL. Marca "sin verificar" lo que no confirmes:

| Servicio | Qué verificar |
|---|---|
| Lambda | Concurrencia por defecto de la cuenta (las cuentas nuevas suelen arrancar con un soft limit MUY inferior a 1 000 — verificar en Service Quotas, es bloqueo de go-live si es 10) |
| DynamoDB on-demand | Throughput por defecto por tabla y comportamiento ante picos (warm throughput / burst) |
| Aurora Serverless v2 | Latencia de resume desde 0 ACU (~15 s según docs, verificar) y límites de la RDS Data API (req/s, tamaño de respuesta) |
| EventBridge | PutEvents TPS por defecto (soft limit regional) y precio $/M eventos custom |
| API Gateway HTTP API | Límite de rps por cuenta (default 10 000 rps burst 5 000, verificar) |
| SQS estándar | Confirmación de throughput ilimitado (no es cuello) |
| EventBridge Scheduler | Cuota de schedules e invocaciones (recordatorios one-shot) |
| Cognito | Free tier MAU vigente (Essentials) |

**Verify**: la tabla del doc final tiene las 8 filas con valor+fuente o
"sin verificar" explícito.

### Step 3: Redactar `docs/aws-scalability-review.md`

Estructura obligatoria (títulos exactos, en este orden):

```markdown
# Revisión de escalabilidad y costos — arquitectura serverless AWS

(fecha, commit base, escenarios Lanzamiento/Crecimiento del Step 1)

## Cuotas y límites verificados
(tabla del Step 2: servicio | límite | fuente | ¿frena antes que el diseño?)

## Puntos de quiebre por componente
(por cada componente: mecanismo de escalado, punto de quiebre numérico en
collares/usuarios, acción y cuándo dispararla)

## Hallazgos
(desarrolla H1–H6 de abajo, cada uno con número, evidencia y recomendación)

## Palancas de costo y decisiones pendientes
(las del presupuesto §Palancas + las nuevas que surjan; cada una con ahorro
estimado y quién decide)

## Discrepancias con el presupuesto
(cifras de plans/presupuesto-produccion.md que ya no cuadren; vacío si ninguna)

## Veredicto
(GO / GO con condiciones / NO-GO para la arquitectura elegida, en ≤5 líneas)
```

Hallazgos semilla a desarrollar (evidencia ya recogida en este plan; valida
los cálculos y complétalos con lo verificado en el Step 2):

- **H1 — DynamoDB PROVISIONED 25 WCU se agota a ~750 collares.** 1 collar cada
  30 s = 0,033 escrituras/s; 25 WCU ÷ 0,033 ≈ 750 collares sostenidos. Dev lo
  acepta (free tier, #20); el doc debe fijar el umbral y el mecanismo de
  migración (on-demand o autoscaling) ANTES de acercarse a esa cifra.
- **H2 — EventBridge cobra por posición publicada.** Hoy cada posición va al
  bus; a 1 000 collares son 86,4 M eventos/mes ≈ $86 solo de bus. Palanca
  "publicar solo transiciones" (presupuesto §Palancas) sin decidir. Recomendar
  decisión y dónde filtrar (el productor: positions-consumer).
- **H3 — Poller único serial.** En prod el diseño es 1 Lambda poller/minuto;
  punto de quiebre cuando fetch+encolado de N collares supere 60 s. Estimar N
  (depende de paginación de la API Wialon) y nombrar mitigación (shard por
  unidades o webhook push de Wialon, ya anotado como mejora en plans/README).
- **H4 — Aurora scale-to-zero tiene costo de latencia.** Resume desde 0 ACU
  tarda ~15 s: el primer request tras reposo puede dar timeout. Aceptable en
  dev; para prod proponer min ACU > 0 en horario activo y estimar su costo con
  la cifra $/ACU-h del presupuesto.
- **H5 — Concurrencia Lambda de la cuenta puede ser 10.** Si Service Quotas
  muestra el default reducido de cuentas nuevas, con API + workers + poller
  compartiendo el pool se satura con pocos usuarios. Acción: solicitar aumento
  antes del primer deploy serio (lo pide el humano; el doc solo lo deja
  escrito como prerequisito de go-live).
- **H6 — El MVP hace polling.** ~160 req/usuario/día contra API GW + Lambda +
  Aurora escala lineal con usuarios; es la razón de la fase 010 (WebSocket).
  Cuantificar el punto donde el polling cuesta más que implementar WebSocket.

**Verify**: `grep -c "^## " docs/aws-scalability-review.md` → 6 (más el `# `
título). `grep -o "H[1-6]" docs/aws-scalability-review.md | sort -u` → 6 líneas.

### Step 4: Contraste final

Relee el doc completo comprobando: cada afirmación numérica tiene fuente (URL
oficial, cálculo mostrado, o cita al presupuesto) o dice "sin verificar";
ninguna sección quedó en TODO; el veredicto responde explícitamente "¿escala?
¿a qué costo? ¿qué hay que decidir ya?".

**Verify**: `grep -ci "TODO" docs/aws-scalability-review.md` → 0.

## Test plan

No aplica (entregable de documentación). Las verificaciones estructurales de
los Steps 3–4 hacen de gate.

## Done criteria

Machine-checkable. ALL must hold:

- [ ] `docs/aws-scalability-review.md` existe; `grep -c "^## " ...` → 6
- [ ] H1–H6 presentes (grep del Step 3)
- [ ] `grep -ci "TODO" docs/aws-scalability-review.md` → 0
- [ ] `git status`: solo el archivo in-scope (+ fila de `plans/README.md`)
- [ ] Cero llamadas AWS de escritura ejecutadas (este plan no corre `aws`/`cdk`)

## STOP conditions

Stop and report back (do not improvise) if:

- No puedes verificar NINGUNA cuota oficial (sin red o docs caídos): el doc
  perdería su valor; reporta en vez de rellenar de memoria.
- Descubres que la arquitectura desplegada difiere de la descrita en "Current
  state" (p. ej. la tabla ya no es PROVISIONED 25/25).
- Un hallazgo semilla resulta falso con evidencia (p. ej. el bus ya filtra
  transiciones): documenta la evidencia y márcalo como descartado en el doc —
  eso NO es STOP — pero si más de dos semillas caen, para y reporta (el plan
  estaría desactualizado).

## Maintenance notes

- Revisar el doc cuando: cambie el intervalo de reporte del collar (30 s es el
  peor caso; adaptativo cambia TODOS los números), se decida la palanca H2, o
  se migre la API a Lambda real.
- El reviewer humano debe escrutar sobre todo H1 y H5: son los dos que
  producen throttling silencioso en producción.
- Deferred explícitamente: ejecutar la calculadora AWS con escenarios finos
  (el presupuesto ya da rangos; refinarlo es post-decisión de palancas).
