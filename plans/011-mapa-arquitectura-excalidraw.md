# Plan 011: Mapa de arquitectura AWS en Excalidraw (dev actual + objetivo producción)

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat 31a7b2f..HEAD -- infra/lib/pet-tracker-dev-stack.ts backend-pet-tracker/src/aws/constants.ts docs/`
> Si algún archivo in-scope o de referencia cambió desde que se escribió este
> plan, compara los extractos de "Current state" contra el código vivo antes
> de continuar; ante un desajuste, trátalo como condición de STOP.

## Status

- **Priority**: P2
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: docs
- **Planned at**: commit `31a7b2f`, 2026-08-11

## Why this matters

El proyecto decidió una arquitectura serverless AWS (tabla de servicios en
`plans/README.md`) y desplegó un stack dev parcial (`infra/lib/pet-tracker-dev-stack.ts`),
pero nunca produjo un mapa visual. El único diagrama es un mermaid dentro de
`plans/README.md` que mezcla el objetivo de producción con lo que existe hoy.
Este plan crea un archivo Excalidraw editable con dos vistas separadas —
lo desplegado hoy en dev y el objetivo de producción — para que humanos y
agentes razonen sobre la brecha entre ambos sin releer specs.

## Current state

- No existe ningún archivo `.excalidraw` en el repo (verificado 2026-08-11).
- `plans/README.md` líneas 33–52 — mermaid del flujo objetivo de producción
  (API GW → Lambda NestJS → Aurora/DynamoDB/S3; poller → SQS → procesadora →
  EventBridge → geocercas → notifications → Expo Push).
- `infra/lib/pet-tracker-dev-stack.ts` — stack CDK **realmente desplegado** en
  us-east-1 (dev). Declara SOLO: 3 pares de colas SQS con DLQ
  (`positions-raw`, `notifications`, `geofence-events`), tabla DynamoDB
  `positions` (BillingMode PROVISIONED, 25 RCU / 25 WCU, TTL `expires_at`),
  bucket S3 `pet-tracker-media-dev-<accountId>` (BlockPublicAccess ALL), bus
  EventBridge `pet-tracker` con regla `geofence-events`
  (source `pet-tracker`, detail-type `position.updated` | `battery.low`).
  **No hay Lambda, API Gateway, Aurora ni Cognito desplegados.**
- En dev la API es un monolito NestJS corriendo local (Docker/pnpm) con
  Postgres en Docker; el poller de Wialon y los workers son crons/consumers
  dentro del mismo proceso (`backend-pet-tracker/src/workers/`). Por defecto
  el backend habla con LocalStack; con `AWS_MODE=aws` habla con el stack dev
  real (features #19–#21).
- Nombres de recursos: `backend-pet-tracker/src/aws/constants.ts` (p. ej.
  `QUEUE_POSITIONS_RAW = 'positions-raw'`, `EVENT_BUS_NAME = 'pet-tracker'`,
  `TABLE_POSITIONS = 'positions'`).
- Convención de idioma: docs en español, código/identificadores en inglés.

## Commands you will need

| Purpose | Command | Expected on success |
|---|---|---|
| Generar diagrama | `node docs/diagrams/architecture-aws.gen.mjs` | imprime `written ... 35 nodos, 38 flechas`, exit 0 |
| Validar JSON | ver Step 3 | `35 38` |

No hace falta instalar nada: Node ≥ 18 ya está en la máquina (el backend usa pnpm/Node).

## Scope

**In scope** (únicos archivos a crear/modificar):
- `docs/diagrams/architecture-aws.gen.mjs` (crear — generador)
- `docs/diagrams/architecture-aws.excalidraw` (crear — salida generada)
- `docs/architecture.md` (solo añadir una sección corta al final)

**Out of scope** (NO tocar):
- `infra/`, `backend-pet-tracker/` — nada de código de aplicación ni de stack.
- `plans/README.md` salvo la fila de estado de este plan.
- `AGENTS.md`, `CLAUDE.md`.

## Git workflow

- Branch: `docs/architecture-map` (convención del repo: docs van en `docs/<tema>`;
  `main` está protegida, todo va por PR — ver `docs/conventions.md`).
- Conventional commits en inglés, p. ej. `docs(architecture): add AWS architecture map (excalidraw)`.
- NO hagas push ni abras PR salvo que el operador lo pida.

## Steps

### Step 1: Crear el generador `docs/diagrams/architecture-aws.gen.mjs`

Crea el directorio `docs/diagrams/` y dentro el archivo con EXACTAMENTE este
contenido (es la fuente de verdad del diagrama; el `.excalidraw` es artefacto
generado):

```js
// Generates docs/diagrams/architecture-aws.excalidraw
// Source of truth for the AWS architecture map. Re-run after editing:
//   node docs/diagrams/architecture-aws.gen.mjs
// If the .excalidraw is later hand-edited at excalidraw.com, stop re-running
// this script (it overwrites) and delete it.
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, 'architecture-aws.excalidraw');

let seq = 1;
const rnd = () => seq++;

const KIND = {
  client:    { stroke: '#1971c2', bg: '#a5d8ff' },
  compute:   { stroke: '#e8590c', bg: '#ffd8a8' },
  data:      { stroke: '#2f9e44', bg: '#b2f2bb' },
  messaging: { stroke: '#6741d9', bg: '#d0bfff' },
  external:  { stroke: '#495057', bg: '#dee2e6' },
  future:    { stroke: '#868e96', bg: '#f1f3f5' },
};
const W = 260;
const H = 90;

// ---- Vista 1: dev actual (NestJS local + PetTrackerDevStack us-east-1) ----
const NODES = [
  { id: 'a-app', label: 'App móvil (Expo)', x: 40, y: 200, kind: 'client' },
  { id: 'a-wialon', label: 'Wialon API / FakeWialonClient (SIM_MODE)', x: 40, y: 480, kind: 'external' },
  { id: 'a-api', label: 'API NestJS (monolito modular, Docker local)', x: 380, y: 200, kind: 'compute' },
  { id: 'a-poller', label: 'Poller (cron @nestjs/schedule)', x: 380, y: 480, kind: 'compute' },
  { id: 'a-posconsumer', label: 'Worker positions-consumer', x: 380, y: 620, kind: 'compute' },
  { id: 'a-alerts', label: 'Worker alerts-engine', x: 380, y: 760, kind: 'compute' },
  { id: 'a-notifier', label: 'Worker notifier', x: 380, y: 900, kind: 'compute' },
  { id: 'a-pg', label: 'PostgreSQL (Docker) — dominio', x: 720, y: 200, kind: 'data' },
  { id: 'a-s3', label: 'S3 pet-tracker-media (LocalStack / dev)', x: 720, y: 340, kind: 'data' },
  { id: 'a-ddb', label: 'DynamoDB positions (PROVISIONED 25/25, TTL)', x: 720, y: 620, kind: 'data' },
  { id: 'a-sqsraw', label: 'SQS positions-raw (+DLQ)', x: 1060, y: 480, kind: 'messaging' },
  { id: 'a-bus', label: 'EventBridge bus pet-tracker', x: 1060, y: 620, kind: 'messaging' },
  { id: 'a-sqsgeo', label: 'SQS geofence-events (+DLQ)', x: 1060, y: 760, kind: 'messaging' },
  { id: 'a-sqsnotif', label: 'SQS notifications (+DLQ)', x: 1060, y: 900, kind: 'messaging' },
  { id: 'a-push', label: 'Expo Push (local: log)', x: 1400, y: 900, kind: 'external' },
  // ---- Vista 2: objetivo producción (plans/README.md) ----
  { id: 'b-app', label: 'App móvil (Expo)', x: 40, y: 1320, kind: 'client' },
  { id: 'b-wialon', label: 'Wialon API', x: 40, y: 1880, kind: 'external' },
  { id: 'b-cognito', label: 'Amazon Cognito (User Pool)', x: 380, y: 1180, kind: 'compute' },
  { id: 'b-apigw', label: 'API Gateway HTTP API (JWT authorizer)', x: 380, y: 1320, kind: 'compute' },
  { id: 'b-ws', label: 'API GW WebSocket (fase 010)', x: 380, y: 1460, kind: 'future', dashed: true },
  { id: 'b-sched', label: 'EventBridge Scheduler (poll 1 min + recordatorios)', x: 380, y: 1600, kind: 'messaging' },
  { id: 'b-poller', label: 'Lambda poller', x: 380, y: 1880, kind: 'compute' },
  { id: 'b-ssm', label: 'SSM Parameter Store (secretos)', x: 720, y: 1180, kind: 'data' },
  { id: 'b-lambda', label: 'Lambda NestJS (serverless-express)', x: 720, y: 1320, kind: 'compute' },
  { id: 'b-openai', label: 'OpenAI API (solo backend)', x: 720, y: 1460, kind: 'external' },
  { id: 'b-sqsraw', label: 'SQS positions-raw (+DLQ)', x: 720, y: 1880, kind: 'messaging' },
  { id: 'b-proc', label: 'Lambda procesadora', x: 720, y: 2020, kind: 'compute' },
  { id: 'b-aurora', label: 'Aurora Serverless v2 PG16 (Data API)', x: 1060, y: 1180, kind: 'data' },
  { id: 'b-ddb', label: 'DynamoDB positions (on-demand, TTL 90d)', x: 1060, y: 1320, kind: 'data' },
  { id: 'b-s3', label: 'S3 + CloudFront (fotos/docs)', x: 1060, y: 1460, kind: 'data' },
  { id: 'b-geo', label: 'Lambda geocercas + alertas', x: 1400, y: 1740, kind: 'compute' },
  { id: 'b-bus', label: 'EventBridge bus pet-tracker', x: 1400, y: 1880, kind: 'messaging' },
  { id: 'b-sqsnotif', label: 'SQS notifications (+DLQ)', x: 1740, y: 1600, kind: 'messaging' },
  { id: 'b-notif', label: 'Lambda notificadora', x: 1740, y: 1740, kind: 'compute' },
  { id: 'b-push', label: 'Expo Push', x: 1740, y: 1880, kind: 'external' },
];

const EDGES = [
  // Vista 1
  { from: 'a-app', to: 'a-api', label: 'REST + JWT propio' },
  { from: 'a-api', to: 'a-pg', label: 'dominio (Drizzle)' },
  { from: 'a-api', to: 'a-s3', label: 'URLs prefirmadas' },
  { from: 'a-api', to: 'a-ddb', label: 'historial GPS' },
  { from: 'a-wialon', to: 'a-poller', label: 'poll (SIM_MODE)' },
  { from: 'a-poller', to: 'a-sqsraw', label: 'encola crudo' },
  { from: 'a-sqsraw', to: 'a-posconsumer', label: 'consume' },
  { from: 'a-posconsumer', to: 'a-ddb', label: 'PutItem (idempotente)' },
  { from: 'a-posconsumer', to: 'a-pg', label: 'pets.last_position' },
  { from: 'a-posconsumer', to: 'a-bus', label: 'position.updated / battery.low' },
  { from: 'a-bus', to: 'a-sqsgeo', label: 'regla geofence-events' },
  { from: 'a-sqsgeo', to: 'a-alerts', label: 'consume' },
  { from: 'a-alerts', to: 'a-pg', label: 'alert_events (anti-spam)' },
  { from: 'a-alerts', to: 'a-sqsnotif' },
  { from: 'a-sqsnotif', to: 'a-notifier', label: 'consume' },
  { from: 'a-notifier', to: 'a-push', label: 'PUSH_ENABLED=false → log' },
  // Vista 2
  { from: 'b-app', to: 'b-cognito', label: 'sign-in (Amplify lib)' },
  { from: 'b-app', to: 'b-apigw', label: 'HTTPS + JWT' },
  { from: 'b-app', to: 'b-ws', label: 'tiempo real (fase 010)', dashed: true },
  { from: 'b-cognito', to: 'b-apigw', label: 'JWT authorizer' },
  { from: 'b-apigw', to: 'b-lambda' },
  { from: 'b-ssm', to: 'b-lambda', label: 'secretos', dashed: true },
  { from: 'b-lambda', to: 'b-aurora', label: 'Data API (Drizzle)' },
  { from: 'b-lambda', to: 'b-ddb', label: 'historial GPS' },
  { from: 'b-lambda', to: 'b-s3', label: 'URLs prefirmadas' },
  { from: 'b-lambda', to: 'b-openai', label: 'explicación IA (nutrición)' },
  { from: 'b-sched', to: 'b-poller', label: 'cada 1 min' },
  { from: 'b-sched', to: 'b-sqsnotif', label: 'recordatorios one-shot' },
  { from: 'b-wialon', to: 'b-poller', label: 'API' },
  { from: 'b-poller', to: 'b-sqsraw' },
  { from: 'b-sqsraw', to: 'b-proc', label: 'event source' },
  { from: 'b-proc', to: 'b-ddb', label: 'PutItem' },
  { from: 'b-proc', to: 'b-aurora', label: 'last_position' },
  { from: 'b-proc', to: 'b-bus', label: 'position.updated / battery.low' },
  { from: 'b-bus', to: 'b-geo', label: 'regla eventos' },
  { from: 'b-geo', to: 'b-sqsnotif', label: 'vía bus (geofence.exited)' },
  { from: 'b-sqsnotif', to: 'b-notif', label: 'event source' },
  { from: 'b-notif', to: 'b-push' },
];

const TITLES = [
  { text: 'PET TRACKER — Vista 1: DEV ACTUAL (NestJS local + PetTrackerDevStack, us-east-1) — 2026-08-11', x: 40, y: 100 },
  { text: 'AWS real solo con AWS_MODE=aws; por defecto LocalStack emula colas/tabla/bucket/bus.', x: 40, y: 140, size: 14 },
  { text: 'PET TRACKER — Vista 2: OBJETIVO PRODUCCIÓN (serverless, decisiones en plans/README.md)', x: 40, y: 1100 },
  { text: 'Colores: azul=cliente, naranja=cómputo, verde=datos, violeta=mensajería, gris=externo, punteado=futuro.', x: 40, y: 2180, size: 14 },
];

const base = (over) => ({
  angle: 0, boundElements: null, frameId: null, groupIds: [], isDeleted: false,
  link: null, locked: false, opacity: 100, roughness: 1, seed: rnd(),
  updated: 1, version: 1, versionNonce: rnd(), ...over,
});

const elements = [];
const byId = new Map();

for (const n of NODES) {
  byId.set(n.id, n);
  const textId = `${n.id}-label`;
  elements.push(base({
    id: n.id, type: 'rectangle', x: n.x, y: n.y, width: W, height: H,
    strokeColor: KIND[n.kind].stroke, backgroundColor: KIND[n.kind].bg,
    fillStyle: 'solid', strokeWidth: 1,
    strokeStyle: n.dashed ? 'dashed' : 'solid',
    roundness: { type: 3 },
    boundElements: [{ type: 'text', id: textId }],
  }));
  elements.push(base({
    id: textId, type: 'text', x: n.x + 8, y: n.y + 8, width: W - 16, height: H - 16,
    text: n.label, originalText: n.label, fontSize: 14, fontFamily: 1,
    textAlign: 'center', verticalAlign: 'middle', containerId: n.id,
    strokeColor: '#1e1e1e', backgroundColor: 'transparent', fillStyle: 'solid',
    strokeWidth: 1, strokeStyle: 'solid', lineHeight: 1.25,
  }));
}

// Border anchor of `a` facing `b`; straight arrows, no bindings (re-attach by
// hand in excalidraw.com if you want live re-routing while dragging).
const anchor = (a, b) => {
  const ac = { x: a.x + W / 2, y: a.y + H / 2 };
  const bc = { x: b.x + W / 2, y: b.y + H / 2 };
  const dx = bc.x - ac.x;
  const dy = bc.y - ac.y;
  if (Math.abs(dx) >= Math.abs(dy)) {
    return dx >= 0 ? { x: a.x + W, y: ac.y } : { x: a.x, y: ac.y };
  }
  return dy >= 0 ? { x: ac.x, y: a.y + H } : { x: ac.x, y: a.y };
};

for (const e of EDGES) {
  const a = byId.get(e.from);
  const b = byId.get(e.to);
  const p1 = anchor(a, b);
  const p2 = anchor(b, a);
  elements.push(base({
    id: `${e.from}->${e.to}`, type: 'arrow', x: p1.x, y: p1.y,
    width: Math.abs(p2.x - p1.x), height: Math.abs(p2.y - p1.y),
    points: [[0, 0], [p2.x - p1.x, p2.y - p1.y]],
    strokeColor: '#1e1e1e', backgroundColor: 'transparent', fillStyle: 'solid',
    strokeWidth: 1, strokeStyle: e.dashed ? 'dashed' : 'solid',
    startBinding: null, endBinding: null,
    startArrowhead: null, endArrowhead: 'arrow',
    roundness: { type: 2 },
  }));
  if (e.label) {
    elements.push(base({
      id: `${e.from}->${e.to}-label`, type: 'text',
      x: (p1.x + p2.x) / 2 - 60, y: (p1.y + p2.y) / 2 - 20,
      width: 160, height: 18, text: e.label, originalText: e.label,
      fontSize: 11, fontFamily: 1, textAlign: 'center', verticalAlign: 'top',
      containerId: null, strokeColor: '#495057', backgroundColor: 'transparent',
      fillStyle: 'solid', strokeWidth: 1, strokeStyle: 'solid', lineHeight: 1.25,
    }));
  }
}

for (const t of TITLES) {
  elements.push(base({
    id: `title-${t.x}-${t.y}`, type: 'text', x: t.x, y: t.y,
    width: 1100, height: 30, text: t.text, originalText: t.text,
    fontSize: t.size ?? 20, fontFamily: 1, textAlign: 'left', verticalAlign: 'top',
    containerId: null, strokeColor: '#1e1e1e', backgroundColor: 'transparent',
    fillStyle: 'solid', strokeWidth: 1, strokeStyle: 'solid', lineHeight: 1.25,
  }));
}

const doc = {
  type: 'excalidraw', version: 2, source: 'pet-tracker architecture generator',
  elements, appState: { viewBackgroundColor: '#ffffff', gridSize: null }, files: {},
};
writeFileSync(OUT, JSON.stringify(doc, null, 2));
console.log(`written ${OUT}: ${NODES.length} nodos, ${EDGES.length} flechas`);
```

**Verify**: `node --check docs/diagrams/architecture-aws.gen.mjs` → exit 0, sin output.

### Step 2: Generar el diagrama

`node docs/diagrams/architecture-aws.gen.mjs`

**Verify**: imprime `written <ruta>: 35 nodos, 38 flechas` y exit 0.

### Step 3: Validar el archivo generado

```
node -e "const d=JSON.parse(require('fs').readFileSync('docs/diagrams/architecture-aws.excalidraw','utf8')); if(d.type!=='excalidraw')process.exit(1); console.log(d.elements.filter(e=>e.type==='rectangle').length, d.elements.filter(e=>e.type==='arrow').length)"
```

**Verify**: imprime `35 38`, exit 0.

Comprobación manual opcional (no bloqueante): abrir excalidraw.com → menú →
Open → seleccionar el archivo. Deben verse dos vistas apiladas; si alguna
flecha recta cruza una caja, se ajusta a mano arrastrando (y en ese caso deja
de re-ejecutarse el generador — ver nota del script).

### Step 4: Enlazar desde docs/architecture.md

Añade AL FINAL de `docs/architecture.md` (sin tocar nada más del archivo):

```markdown

## Mapa de arquitectura AWS

Diagrama editable en `docs/diagrams/architecture-aws.excalidraw` (abrir en
excalidraw.com o con la extensión Excalidraw de VS Code). Dos vistas: dev
actual (NestJS local + stack `PetTrackerDevStack` en us-east-1) y objetivo de
producción (decisiones de servicios en `plans/README.md`). Fuente:
`docs/diagrams/architecture-aws.gen.mjs` — editar ahí y regenerar, o editar el
.excalidraw a mano y borrar el generador.
```

**Verify**: `grep -c "architecture-aws.excalidraw" docs/architecture.md` → `1`.

## Test plan

No aplica código de aplicación. La verificación es la de los Steps 2–4
(generación determinista + validación estructural del JSON).

## Done criteria

Machine-checkable. ALL must hold:

- [ ] `node docs/diagrams/architecture-aws.gen.mjs` exit 0
- [ ] Validación del Step 3 imprime `35 38`
- [ ] `grep -c "architecture-aws.excalidraw" docs/architecture.md` → 1
- [ ] `git status` solo muestra los 3 archivos in-scope (más `plans/README.md` si actualizaste tu fila)
- [ ] Fila 011 de `plans/README.md` actualizada

## STOP conditions

Stop and report back (do not improvise) if:

- `infra/lib/pet-tracker-dev-stack.ts` ya no coincide con lo descrito en
  "Current state" (recursos añadidos/quitados) — el mapa quedaría mentiroso;
  reporta la diferencia en vez de dibujar.
- El Step 3 no imprime `35 38` tras dos intentos de corrección.
- Ya existe `docs/diagrams/` con contenido no descrito en este plan.

## Maintenance notes

- El mapa refleja el estado a 2026-08-11. Cuando una feature cambie la
  topología (p. ej. #16 recordatorios, migración a Lambda/API GW real), quien
  la cierre debe actualizar el generador (o el .excalidraw a mano) — añadirlo
  como criterio en la spec correspondiente.
- Deuda visual aceptada: flechas rectas sin bindings; puede haber cruces
  menores de líneas. Es un sketch editable, no un render final.
- Vista 2 simplifica un rebote: la Lambda de geocercas publica
  `geofence.exited` al bus y una regla lo manda a `notifications`; el mapa lo
  dibuja como flecha directa geocercas → notifications con etiqueta "vía bus".
