# review: geofence-eval-full-batch

Fecha: 2026-08-15
Branch: `feature/30-geofence-eval-full-batch`
Implementador: Codex CLI (terminal aparte)
Veredicto: **APROBADO**

---

## Checklist C2 — Estado coherente

- [x] Solo 1 feature `in_progress` en `feature_list.json` (#30; conteo verificado = 1)
- [x] `progress/current.md` describe la sesión activa, con hashes y commits rojo→verde
- [ ] `progress/history.md` sin entrada de #30 — **esperado**: la sesión sigue abierta,
      el cierre lo escribe el `leader` tras este veredicto. No bloquea.

## Checklist C3 — Arquitectura

- [x] `src/pipeline/geofence-eval.ts` sigue puro: solo importa `./constants`,
      `./geo` y `./types`. Sin NestJS, SDK, ORM ni reloj.
- [x] La lógica nueva de plegado vive en el worker (`alerts-engine-consumer.service.ts`),
      no en `domain`. No se movió lógica de negocio a infraestructura ni al revés.
- [x] `domain` sin imports de `infrastructure` — esta feature no toca ninguna capa
      de módulos (`src/modules/**` sin cambios).
- [x] `infrastructure` sin lógica de negocio nueva.

## Checklist C4 — TDD

- [x] Cada `R1..R11` tiene al menos un test que lo nombra con el formato
      `R<n> (geofence-eval-full-batch #30): ...` fijado en `requirements.md`:

  | R | Test que lo nombra | Verificado |
  |---|---|---|
  | R1 | `src/pipeline/geofence-eval.spec.ts:232` | sí |
  | R2 | `src/pipeline/geofence-eval-untouched.spec.ts:40` | sí |
  | R3 | `src/workers/positions-consumer.service.spec.ts` describe R3 | sí |
  | R4 | `it` R4 dentro del describe de R3 (según manda la spec) | sí |
  | R5 | describe R5, 2 `it` (conteo de `Entry` + tamaño < 256 KB) | sí |
  | R6 | `geofence-event-message.schema.spec.ts:26`, 4 `it` (a)-(d) | sí |
  | R7 | `alerts-engine-consumer.service.spec.ts:1058`, 3 `it` (a)-(c) | sí |
  | R8 | `...spec.ts:1186`, 2 `it` (exit y enter) | sí |
  | R9 | `...spec.ts:1269`, 2 `it` (a)-(b) | sí |
  | R10 | `...spec.ts:1154` | sí |
  | R11 | `...spec.ts:1350` | sí |

- [x] Historial `main..HEAD` con patrón test-primero **verificado commit a commit**
      con `git show --stat`, no aceptado del reporte. Todos los commits "rojos"
      tocan **exclusivamente** archivos `.spec.ts` (+ `traceability.md`, que es doc):

  ```
  033fdcd (R1 rojo)  → solo geofence-eval.spec.ts
  bad02af (R1 verde) → geofence-eval.ts
  7080113 (R2 verde) → geofence-eval-untouched.spec.ts (re-congelado)
  59075e6 (R3 rojo)  → solo positions-consumer.service.spec.ts
  bb52775 (R4 rojo)  → solo positions-consumer.service.spec.ts
  a2919f0 (R5 rojo)  → solo positions-consumer.service.spec.ts
  3219407 (R3,R4,R5 verde) → positions-consumer.service.ts
  6a68633 (R6 rojo)  → solo geofence-event-message.schema.spec.ts
  c8f1b35 (R6 verde) → geofence-event-message.schema.ts
  312804c (R7 rojo)  → solo alerts-engine-consumer.service.spec.ts
  39e7ff8 (R10)      → solo alerts-engine-consumer.service.spec.ts
  13a65dd (R7,R10 verde) → alerts-engine-consumer.service.ts
  a37fe41 (R8 rojo)  → solo alerts-engine-consumer.service.spec.ts
  9dc7f9a (R8 verde) → alerts-engine-consumer.service.ts
  10bc6a6 (R9 rojo)  → solo alerts-engine-consumer.service.spec.ts
  1ba9256 (R9 verde) → alerts-engine-consumer.service.ts
  9e1e2e9 (R11 rojo) → solo alerts-engine-consumer.service.spec.ts
  8f00ce5 (R11 verde)→ alerts-engine-consumer.service.ts
  a15e991 (lint+hash)→ solo formato (verificado: el único cambio en el
                       servicio es reindentar el .sort(), sin cambio semántico)
  ```

  No se repite el fallo de #19 (implementación + tests + docs en un solo commit).

- Observación sobre R2 y R10, ambas aceptables y documentadas por el implementador:
  - **R2**: su "rojo" es `bad02af` (el verde de R1), que rompe los dos sha256 del
    guard. Es el rojo legítimo de un test de congelación: no se puede escribir
    antes del cambio que lo rompe.
  - **R10**: `39e7ff8` es una **regresión verde**, no un rojo — el camino v1 aún
    funcionaba cuando se añadió. Se escribió **antes** de `13a65dd`, que es el
    commit que podía romperlo, así que el orden test→implementación se respeta.

## Checklist C5 — Trazabilidad

- [x] `traceability.md` sin ninguna fila "pendiente" (la única aparición de la
      palabra es la regla del propio reviewer en la línea 65)
- [x] Cada R tiene test y commit rojo/verde registrados
- [x] Tabla §"Tests de features anteriores actualizados" completa: las 2 filas
      (`positions-consumer.service.spec.ts` línea 463 y el guard de hash) están
      con su justificación y su commit
- [x] Todos los commits siguen `feat(geofence-eval-full-batch): <desc> (R-ids)`

## Checklist C6 — Spec aprobada

- [x] `requirements.md` con `status: approved`
- [x] Casilla `[X] Aprobado por humano (fecha: 26-08-15)` marcada
- [x] Ningún requisito modificado después de la aprobación (`git diff main...HEAD`
      sobre `requirements.md` = solo el alta del archivo)

## Checklist C7 — Sin código huérfano

- [x] N/A parcial: #30 no elimina ningún componente. El `detail` v1 se conserva
      **a propósito** (`requirements.md` §Fuera de alcance: "Retirar version: 1
      del schema. Se acepta indefinidamente"), y R6b/R10 lo cubren con tests.
- [x] No quedan `.spec` de archivos inexistentes; no se borró ningún test.

---

## Verificación punto por punto del encargo

### 1. Trazabilidad R1..R11
Verificada arriba (C4/C5). Formato de nombre correcto en los 11.

### 2. C4 — commits test-primero
Verificado con `git show --stat` sobre los 19 commits de código. Ver tabla en C4.

### 3. R1 — prerrequisito duro
- `evaluate()` corta con la guarda única
  `position.flags.includes(FLAG_LOW_ACCURACY) || position.flags.includes(FLAG_SUSPECT_JUMP)`
  (`geofence-eval.ts:107-112`), **antes** de leer distancia, geometría o estado.
- `FLAG_SUSPECT_JUMP` importado de `./constants` (línea 8).
  `grep "suspect_jump"` sobre `geofence-eval.ts` → **sin literal**.
- Devuelve `{ state: previous, event: null }` — identidad verificada en test con
  `toBe`, no `toEqual`.
- Cobertura de los tres `previous.state`: `inside` explícito + `it.each` con
  `unknown` y `outside`. Un `it` extra con **ambos** flags.

### 4. R2 — sha256 recalculados de forma independiente
Recalculé yo mismo desde `backend-pet-tracker/` con el comando exacto de
`requirements.md` §R2 (BOM fuera, CRLF→LF):

```
geofence-eval.ts      d430f100cb41ad2f8ea8c2fc661939404d9a45f072a15e874a8f510c7b924914
geofence-eval.spec.ts eaaa93e58951592ca8cbebbda3a3ecf5d377e6a30d2fb5dd78d96491bba6d8a7
```

Coinciden **exactamente** con `GEOFENCE_EVAL_TS_SHA256` (línea 36) y
`GEOFENCE_EVAL_SPEC_TS_SHA256` (línea 38) del archivo. CI en Linux no romperá.
El guard **no se borró**: sigue con sus 2 `it`, con el `describe` renombrado a
`R2 (geofence-eval-full-batch #30): ...`. El segundo `describe` (R19, valores de
`pipeline/constants.ts`, líneas 52-75) quedó **intacto**.

### 5. R5 — un solo Entry, Detail bajo 256 KB
`emitEvents()` construye un array `entries` con un único objeto
`DETAIL_TYPE_POSITION_UPDATED`; el lote entra como `positions:
accepted.map(toEventPosition)` dentro de ese mismo `Detail`. Los 2 `it` del
describe R5 lo aseveran con 100 posiciones: `toHaveLength(1)` y
`Buffer.byteLength(entry.Detail, 'utf8') < 256 * 1024`. Ambos verdes.

### 6. R8 — ts y payload de la posición que cruzó
`handleExit()` y `handleEnter()` reciben ahora un cuarto parámetro `position` y
construyen `openedAt: new Date(position.ts)`, `payload: { position, geofenceName }`
y `closedAt: new Date(position.ts)`. Ya no leen `detail.position`.
`evaluateBatteryRecovery()` **sin tocar** (confirmado en el diff completo del
servicio: no aparece en ningún hunk).

### 7. R9/R11 — guard monotónico y una sola escritura
- `previousUpdatedAtMs` se calcula **una vez por geocerca, fuera** del bucle de
  posiciones (`alerts-engine-consumer.service.ts:244-247`). Las posiciones con
  `ts <= previousUpdatedAtMs` hacen `continue` sin `evaluate()` ni escritura.
- El lote se ordena una sola vez, sobre una **copia**
  (`[...(detail.positions ?? [detail.position])].sort(...)`), fuera del bucle de
  geocercas.
- El plegado usa `let state` en memoria y un `pendingStateWrite` que se apaga en
  cuanto `handleExit`/`handleEnter` persisten: sin escritura final redundante.
  Con 100 posiciones sin transición → exactamente 1 `updateGeofenceState`
  (test R11 verde).
- Orden a prueba de caídas de #12 D3 conservado: `handleExit()` sigue haciendo
  `openAlert` **antes** de `updateGeofenceState`; el diff no altera ese orden.

### 8. R10 — v1 sin positions[]
`detail.positions ?? [detail.position]` en el consumidor. El test usa el helper
`positionUpdatedDetail()` **original sin modificar** (el hunk `@@ -162,0 +169,14 @@`
es una **inserción** de un helper nuevo `positionUpdatedDetailV2`, no una edición
del viejo) y asevera `openAlert` una vez + `sqs.deleted` con el `ReceiptHandle`.
Nada a la DLQ.

### 9. Tests congelados
`git diff main...HEAD` verificado hunk a hunk:

- `positions-consumer.service.spec.ts`: solo 2 hunks. El de `-498,5` y `-512,4`
  cae dentro del `it` de la línea 463 — **la excepción autorizada** (`version: 2`
  + `positions`), registrada en `traceability.md`. El `it` de la línea 518
  (`serializa con null los campos ausentes`) **no fue tocado**.
- `alerts-engine-consumer.service.spec.ts`: los 4 hunks son **inserciones puras**
  (`-27,0`, `-33,0`, `-162,0`, `-1036,0` — cero líneas eliminadas). Las líneas
  450-642 (R8/R9/R10 de #12) y 877 (R14) quedan **sin modificar**.
- `test/alerts-engine.e2e-spec.ts` y `test/ingestion.e2e-spec.ts`:
  `git diff --stat main...HEAD -- backend-pet-tracker/test/` devuelve **vacío**.
  Intactos.

### 10. Alcance
- Archivos tocados = exactamente los declarados en la spec. Sin desbordes.
- `grep` de `process.env` añadido en el diff → **ninguna** variable nueva.
- `grep` de `console.log|TODO|FIXME|XXX` en los 5 archivos tocados → **ninguno**.
- Nota de cierre en `docs/aws-scalability-review.md` §Discrepancias: **presente**
  (4 líneas, nombra #30, el Entry único y el límite de 256 KB).

---

## Observaciones

Ninguna bloqueante. Dos notas menores, ambas ya documentadas por el implementador:

1. R2 y R10 no tienen un "rojo" clásico (ver C4). El orden test→implementación se
   respeta igualmente en ambos casos.
2. `progress/current.md` reporta un hueco del harness ajeno a #30: `init.sh:250`
   y `:270` filtran por `status === 'pending'`, así que la feature en curso
   desaparece del anuncio de "próxima feature" (efectivamente visible en la
   corrida de abajo: anuncia #27 con #30 en `in_progress`). Candidato a #23,
   fuera del alcance de esta review.

---

## Verificación independiente ejecutada por el reviewer

Infra confirmada **antes** de correr nada, para que los e2e no se salten en
silencio:

```
> docker port pet-tracker-postgres
5432/tcp -> 0.0.0.0:5432
5432/tcp -> [::]:5432

> docker port pet-tracker-localstack
4566/tcp -> 0.0.0.0:4566
4566/tcp -> [::]:4566

pet-tracker-postgres    Up 3 hours (healthy)
pet-tracker-localstack  Up 3 hours (healthy)
```

No se ejecutó `cdk bootstrap`, `cdk deploy` ni ningún comando contra AWS real.

### Output de `./init.sh` (exit code 0)

Cola de la corrida (los e2e **sí** se ejecutaron, no se saltaron):

```
Test Suites: 2 skipped, 17 passed, 17 of 19 total
Tests:       6 skipped, 260 passed, 266 total
Snapshots:   0 total
Time:        58.498 s, estimated 79 s
Ran all test suites.
✅ Tests e2e pasados

→ Lint...
> backend-pet-tracker@0.0.1 lint
> eslint "{src,apps,libs,test}/**/*.ts" --fix
> pet-tracker-infra@0.0.1 lint
> eslint "{bin,lib,test}/**/*.ts"
✅ Lint sin errores

→ Typecheck...
✅ Typecheck sin errores

══════════════════════════════════════════
✅ Todo verde. Listo para trabajar.

  Features: 22/30 completadas | 7 pendientes

  Próxima feature:
  [#27] reject-future-positions (P1)

[exited with code 0]
```

Nota: el log de e2e incluye un `DrizzleQueryError` con FK
`pet_users_user_id_users_id_fk` en stderr. Es ruido de un caso de error
esperado / carrera de arranque ya conocida, no una regresión: las 17 suites e2e
pasan y el exit code es 0.

Corrida independiente de los unitarios por el reviewer (la cola de `init.sh`
había recortado esa sección):

```
> pnpm -C backend-pet-tracker test
Test Suites: 134 passed, 134 total
Tests:       977 passed, 977 total
Snapshots:   0 total
Time:        10.073 s
Ran all test suites.
```

Sin regresiones: 977/977 unitarios y 260/260 e2e ejecutables en verde.

---

**Veredicto: APROBADO.** #30 puede pasar a `done` y cerrarse con
`gh pr create` desde `feature/30-geofence-eval-full-batch`.
