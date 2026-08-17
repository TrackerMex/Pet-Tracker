# review: test-dev-resource-isolation (#28)

Fecha: 2026-08-17
Branch: `feature/28-test-dev-resource-isolation` (HEAD `921b6e7`)
Reviewer: agente `reviewer` (verificación independiente, no se aceptó el output del implementador)

**Veredicto: APROBADO** (revisado el 2026-08-17 tras `921b6e7`)

> **Historial del veredicto.** La primera pasada, sobre `9ebf93b`, salió
> **RECHAZADO** por un único defecto bloqueante, y **no era del implementador ni
> del código**: `requirements.md` tenía `status: draft` en el frontmatter y C6
> exige `approved`. La casilla humana ya estaba marcada (`[X]`, 2026-08-17), así
> que el gate humano había ocurrido; faltaba el campo machine-readable. El
> `leader` lo corrigió en `921b6e7` y la re-verificación acotada
> (§Re-verificación) confirma que C6 queda completo y que nada de lo ya validado
> se invalidó. Ninguna otra casilla de C2–C7 quedó vacía en ninguna de las dos
> pasadas.

---

## Checklist C2 — Estado coherente

- [x] Solo 1 feature `in_progress` (#28) — verificado con `node -e` sobre `feature_list.json`
- [x] `progress/current.md` describe la sesión activa (feature, branch, plan, riesgo económico)
- [x] `STATUS.md` sincronizado con `feature_list.json` (26/30) — lo confirma `init.sh`
- [x] `progress/history.md` sin entrada pendiente: la sesión #28 aún no está cerrada

## Checklist C3 — Arquitectura

- [x] Ningún archivo bajo `**/domain/` ni `**/application/` importa `resource-names`
      ni `AWS_RESOURCE_NAMES` (grep exhaustivo sobre `src/`: cero resultados)
- [x] Los 8 consumidores del token están todos en `infrastructure/` o en `workers/`:
      `daily-positions.dynamo.reader.ts`, `position-history.dynamo.reader.ts`,
      `photo-storage.s3.adapter.ts`, `reminders-dispatch.service.ts`,
      `poller.service.ts`, `positions-consumer.service.ts`,
      `notifier-consumer.service.ts`, `alerts-engine-consumer.service.ts`
- [x] `application` sigue dependiendo de interfaces: los nombres entran por el
      token inyectable `AWS_RESOURCE_NAMES` en `aws.module.ts`, no por import directo
- [x] `infrastructure` sin lógica de negocio: `resource-names.ts` solo compone strings

## Checklist C4 — TDD

- [x] Cada R1–R13 tiene al menos un test que lo nombra en un `describe('R<n>: …')`:
      R1/R2/R3/R5 en `resource-names.spec.ts`; R4 en `aws.module.spec.ts`;
      R6/R8 en `run-provisioning.spec.ts`; R7 en `localstack-provisioning.e2e-spec.ts`;
      R9/R10 en `resource-isolation.e2e-spec.ts`;
      R11/R12/R13 en `resource-names-guard.spec.ts`. R14 no lleva test (declarado)
- [x] Historial rojo→verde para R1, R2, R3, R4, R6, R9 y R13. Los siete commits
      "rojos" son **test-only** verificados con `git show --stat`: ninguno mezcla
      implementación. Ejemplos: `0b537dd` añade `resource-names.spec.ts` cuando
      `resource-names.ts` todavía no existe; `4621333` añade el test del token
      antes de `c9c8e26`; `e46ef81` añade la guarda de docs antes de `6897d8a`
- [x] R5, R7, R8, R10, R11 y R12 nacen verdes **por excepción declarada** en
      `traceability.md` con gate humano del 2026-08-17. Verificadas una por una
      en §Falsación de las seis guardas: ninguna escondía un rojo honesto

## Checklist C5 — Trazabilidad

- [x] `traceability.md` sin ninguna fila "pendiente" (14/14 con test, archivo y commit)
- [x] Cada hash citado en la tabla existe en la branch y su mensaje coincide
- [x] Formato de commit correcto: `test|feat|refactor|docs(test-dev-resource-isolation): <desc> (R<n>)`

## Checklist C6 — Spec aprobada

- [x] `requirements.md` con `status: approved` en el frontmatter — corregido en
      `921b6e7`. (En `9ebf93b` decía `draft`; era el único bloqueo)
- [x] Casilla "Aprobado por humano" marcada con fecha (L370: `[X]`, 2026-08-17)
- [x] Ningún requisito modificado tras la aprobación sin gate — ver §Re-verificación

> `design.md`, `tasks.md` y `traceability.md` también pasaron a `approved` en
> `921b6e7`. C6 solo exige el de `requirements.md`; los otros tres son
> coherencia con el precedente de #25.

## Checklist C7 — Sin código huérfano

- [x] Esta feature no reemplaza ningún componente: migra consumidores existentes
      a un token inyectable, sin dejar el camino viejo vivo
- [x] Cero literales de nombre de recurso sobrevivientes en `test/`: el grep de
      `'positions-raw'|'notifications'|'geofence-events'|'positions'|'pet-tracker-media-local'|'pet-tracker'`
      sobre `test/*.ts` no devuelve nada
- [x] Cero importadores de los diez símbolos fuera de la lista blanca de D8
      (verificado a mano, no solo por la guarda: los 27 imports de `aws/constants`
      en `src/` + `test/` traen únicamente símbolos permitidos)
- [ ] N/A parcial — `progress/imp.md` es residuo, ver §Observaciones O5

---

## Los ocho puntos exigidos con lupa

### 1. Riesgo económico — R3, R8, R12 (las tres vías, verificadas por separado)

**(a) `resolveResourceSuffix` comprueba `AWS_MODE` antes que `NODE_ENV`.**
`src/aws/resource-names.ts:51-57`:

```ts
export function resolveResourceSuffix(rawMode, rawNodeEnv): string {
  if (resolveAwsMode(rawMode) === 'aws') return '';
  return (rawNodeEnv ?? '').trim() === 'test' ? RESOURCE_SUFFIX_TEST : '';
}
```

El `return` temprano es incondicional y no lanza. `resolveAwsMode`
(`aws-clients.ts`) normaliza con `.trim().toLowerCase()`, así que `'AWS'` y
`' aws '` también cortan. El test lo ejerce con los tres literales y con
`not.toThrow()`, y compara los diez nombres contra la columna "Desarrollo".

**(b) `run-provisioning.ts` sigue rechazando `AWS_MODE=aws`.** El `git diff`
contra `main` de ese archivo son **exactamente dos hunks**: el `import` de
`resource-names` y el `for` sobre `PROVISIONED_SUFFIXES`. Las líneas 40-43
(`if (config.mode === 'aws') { … return 1 }`) están intactas y siguen **antes**
de construir clientes. El test de R8 no se limita al exit code: espía las
cuatro factories con `jest.spyOn` y asevera `not.toHaveBeenCalled()` en las
cuatro. Si alguien relajara la guarda, `createSqsClient` se llamaría y el test
falla.

**(c) El stack CDK no importa nada de `resource-names.ts`.**
`git diff --name-only <merge-base>..HEAD -- infra` devuelve **vacío**: ni un
archivo de `infra/` cambió. Las 2 suites / 14 tests de `infra/` pasan sin tocar
una línea. La guarda de R12 lee el fuente real del stack y asevera que no
contiene `resource-names` ni `RESOURCE_SUFFIX_TEST`, y que sí contiene
`const ENV_SUFFIX = '';`.

**Las dos suites de AWS real resuelven nombres desnudos:**

- `test/aws-real-ingest.e2e-spec.ts:34` — `const names = resolveResourceNamesFromEnv(process.env)`.
  Bajo Jest (`NODE_ENV=test`) + `AWS_MODE=aws` la vía (a) devuelve `''`. Los
  cinco usos (`names.positionsTable`, `names.positionsRaw`, `names.geofenceEvents`,
  `names.eventBus`) salen desnudos. Cubierto además por el caso unitario
  `resolveResourceNamesFromEnv({ AWS_MODE: 'aws', NODE_ENV: 'test' })`.
- `test/aws-real-smoke.e2e-spec.ts` — **no resuelve ningún nombre de recurso**.
  Su única llamada es `ListQueuesCommand({})`. Riesgo cero por construcción, y
  el archivo ni siquiera aparece en el diff de la feature.

**Conclusión: no hay fuga posible del sufijo al modo `aws`.** Las tres vías son
independientes y ninguna depende de las otras dos.

### 2. R10 — la aserción de `ItemCount` NO es decorativa en LocalStack

Medido de forma independiente contra el LocalStack local, antes y después de la
corrida e2e completa:

| Tabla | `DescribeTable.ItemCount` | `scan --select COUNT` |
|---|---|---|
| `positions` (dev) antes | 1115 | 1115 |
| `positions` (dev) después | 1115 | 1115 |
| `positions-test` antes | 5675 | 5675 |
| `positions-test` después | **6810** | **6810** |

`ItemCount` coincide **exactamente** con un scan completo en los cuatro casos, y
se movió +1135 en la tabla de test durante la corrida. En LocalStack ese
contador es inmediato y exacto, no eventual: **no** arrastra el retraso de ~6 h
de DynamoDB real. Como el test solo corre contra LocalStack, la aserción de
L243-245 es significativa: si una regresión mandara las escrituras a la tabla de
desarrollo, `ItemCount` se movería y la aserción fallaría. La deuda anotada en
`traceability.md` L79-84 queda **cerrada, no aceptada**.

**Y el criterio de aceptación 2 lo verifiqué yo mismo, fuera de la suite**, que
es justo lo que R13 reserva al humano (recuentos `ApproximateNumberOfMessages` +
`NotVisible` + `Delayed`, antes y después de `./init.sh` con sus 19 suites e2e):

| Cola de desarrollo | Antes | Después |
|---|---|---|
| `positions-raw` | 0 / 0 / 0 | 0 / 0 / 0 |
| `notifications` | 3 / 0 / 0 | 3 / 0 / 0 |
| `geofence-events` | 1 / 0 / 0 | 1 / 0 / 0 |
| `positions-raw-dlq` | 0 / 0 / 0 | 0 / 0 / 0 |
| `notifications-dlq` | 0 / 0 / 0 | 0 / 0 / 0 |
| `geofence-events-dlq` | 0 / 0 / 0 | 0 / 0 / 0 |

Idénticos. Y **no pasa en vacío**: `notifications` y `geofence-events` tenían 3 y
1 mensajes de una corrida anterior; los cuatro `PurgeQueueCommand` de
`ingestion`, `alerts-engine`, `alerts-center-notifier` y `pet-reminders` se
ejecutaron durante la corrida y **no** los borraron — prueba directa de que las
purgas ya operan sobre las colas de test. El daño de 2026-08-14 (la defensa de
un entorno como agresión al otro) está cerrado.

### 3. R11 — la aserción anti-vacío está en el camino de ejecución

`resource-names-guard.spec.ts:46-57`. `candidateFiles` se construye en L46-49,
se asevera `> 100` en L50, y es **la misma variable** que se filtra en L52-55
para producir `offenders`. No hay variable paralela. Si alguien rompe la
profundidad de `join(__dirname, '..', '..')`, `readdirSync` lanza; si mueve
`src/` a algo más pequeño, L50 falla antes de llegar a `expect(offenders)`.

**La lista blanca no se ha inflado.** `ALLOWED_FILES` son exactamente los tres
archivos de `design.md` §D8 (`resource-names.ts`, `constants.spec.ts`,
`resource-names.spec.ts`), más el propio archivo del test, que §D8 excluye
explícitamente. Ni uno de más.

**El detector funciona** — ejecuté su regex aislada contra 14 formas sintéticas:

```
DETECTA     alias 1 linea / multilinea / import type / comillas dobles
DETECTA     './constants' y '../src/aws/constants'
DETECTA     alias renombrado (QUEUE_POSITIONS_RAW as Q)
no detecta  BUCKET_MEDIA_BASE, TABLE_POSITIONS_SORT_KEY, pipeline/constants  ← correcto
no detecta  '../aws/constants', '../../aws/constants', import * as, require   ← puntos ciegos
```

Cero falsos negativos y cero falsos positivos sobre **todas** las formas que el
repo usa de verdad (los 27 imports reales de `aws/constants` usan solo
`@/aws/constants`, `./constants` o `../src/aws/constants`). Los puntos ciegos
quedan como observación O1, no como bloqueo: el de `../aws/constants` ya lo
cierra la guarda preexistente `src/aws/relative-import-guard.spec.ts` (#20 R18),
que prohíbe `from '../…aws'` en todo `src/**` fuera de `src/aws/`.

### 4. Falsación de las seis guardas verdes

Para cada una: si el defecto que vigila reapareciera, ¿falla?

| R | Qué vigila | ¿Falla si el defecto vuelve? | Prueba |
|---|---|---|---|
| **R5** | `constants.ts` sigue siendo literales `const` | **Sí** | `typeof name` pasa a `'function'` en los diez. Y `constants.ts` está byte a byte igual a `main` (`git diff` vacío), así que `infra/test/no-duplicated-literals.test.ts` sigue encontrando sus agujas — PASS confirmado en mi corrida |
| **R7** | Doble corrida idempotente sobre los dos juegos | **Sí** | `localstack-provisioning.e2e-spec.ts:266` llama a `runProvisioning` **otra vez** (el `beforeAll` ya la llamó) y recorre los 20 recursos uno por uno con `ListQueues`/`DescribeTable`/`ListBuckets`/`ListEventBuses`. No es un `expect(0).toBe(0)` |
| **R8** | La guarda `AWS_MODE=aws` del provisioning | **Sí** | Espía las 4 factories y asevera `not.toHaveBeenCalled()`. Relajar la guarda las llama y el spy de `createSqsClient` lanza |
| **R10** | La ingesta no toca las colas de dev | **Sí** | Purga `positions-raw-test`, corre `poller.runOnce()` y asevera `testCountAfterPoll > testCountBefore` (L225) antes de comparar las de dev. Revertir R9 dejaría la cola de test en 0 y L225 falla |
| **R11** | Nadie importa los diez literales | **Sí** | Regex falsada arriba: detecta las 6 formas reales. Más `candidateFiles.length > 100` contra el escaneo vacío |
| **R12** | El stack CDK intacto | **Sí** | Lee el fuente real de `infra/lib/pet-tracker-dev-stack.ts` y asevera ausencia de `resource-names`/`RESOURCE_SUFFIX_TEST` y presencia de `const ENV_SUFFIX = '';`. Un import nuevo lo rompe |

**Ninguna de las seis es decorativa.** No hay repetición del caso O4 de #25.

### 5. `progress/imp.md` (C7)

Sobra. Es un resumen de 11 líneas del mismo contenido que
`progress/impl_test-dev-resource-isolation.md`, con un nombre que incumple la
convención `impl_<feature>.md` de `progress/history.md`. Está commiteado en
`2beb12a` y citado en la fila R14 de `traceability.md`. Recomendación en
§Acciones de cierre. No bloquea por sí solo.

### 6. Los e2e migrados (R9)

Las 7 suites (`activity`, `alerts-center-notifier`, `alerts-engine`,
`ingestion`, `media`, `pet-reminders`, `positions`) más `aws-real-ingest`
resuelven todas con `const names = resolveResourceNamesFromEnv(process.env)` a
nivel de módulo. `localstack-provisioning` usa a propósito los dos juegos
(`DEVELOPMENT_NAMES` y `TEST_NAMES`) porque su trabajo es verificar ambos.
Cero literales desnudos en `test/`. Los 8 `PurgeQueueCommand` cuelgan todos de
`names.*`. **Ninguna quedó apuntando a desarrollo por descuido** — y lo confirma
la medición de recuentos del punto 2, que es evidencia de ejecución, no de lectura.

`cdk-dev-stack-docs.spec.ts`: el diff es **una sola línea**, la 19
(`expect.stringContaining(BUCKET_MEDIA)` → `expect.stringContaining(names.mediaBucket)`).
La línea 18 (`expect(mediaE2e).not.toContain("'pet-tracker-media-local'")`), que
es la intención de #20 R3, está intacta.

Única salvedad: `device-subscriptions.e2e-spec.ts:681` usa `buildResourceNames('')`
en vez del resuelto — ver O2.

### 7. `constants.ts` intacto (R5, D2)

`git diff <merge-base>..HEAD -- backend-pet-tracker/src/aws/constants.ts` está
**vacío**. Los 17 símbolos siguen siendo literales `const` de tipo `string`;
`resourceName` sigue siendo la única función y no cambió. `test/jest-e2e.json`
tampoco cambió. Consecuencia: `infra/test/no-duplicated-literals.test.ts`
(#20) sigue interpolando valores string y encontrándolos en `infra/lib` — PASS
en mi corrida. El test de #20 **sigue siendo significativo**, no quedó verde en
vacío.

### 8. Suites omitidas

De 21 suites e2e corrieron 19; se omitieron **2 suites / 6 tests**:
`aws-real-smoke.e2e-spec.ts` y `aws-real-ingest.e2e-spec.ts`. Ambas se
autoexcluyen con `(runSmoke ? describe : describe.skip)` cuando `AWS_MODE`
no vale `aws` — y mi `.env` no define `AWS_MODE` (`init.sh` lo avisa como deriva
de #23), así que la corrida fue enteramente local, que es lo correcto para esta
revisión.

**¿Alguna omitida probaba un requisito de #28?** Solo el cambio de R9 sobre
`aws-real-ingest.e2e-spec.ts` (commit `026e744`), que queda verificado por
lectura y no por ejecución. No es un hueco reprochable: correrla exige sesión
contra la cuenta AWS real, que la spec pone fuera de alcance y mis reglas me
prohíben. Y la garantía que ese archivo necesita —que con `AWS_MODE=aws` los
nombres salen desnudos— **sí** está cubierta por ejecución, en los cuatro casos
unitarios de `describe('R3: …')`. `aws-real-smoke` no resuelve nombres, así que
su omisión no deja nada sin verificar.

---

## Observaciones (ninguna bloqueante)

- **O1 — Puntos ciegos del detector de R11.** La regex no ve
  `import * as c from '@/aws/constants'` ni `require(...)` ni
  `'../../src/aws/constants'`. El repo ya usa la forma namespace en otro módulo
  (`src/pipeline/geofence-eval-untouched.spec.ts:4`), así que el patrón no es
  hipotético. Hoy no hay infractor y la forma relativa está cerrada por #20 R18;
  si algún día se amplía la guarda, ese es el hueco.
- **O2 — `device-subscriptions.e2e-spec.ts:681` fija `buildResourceNames('')`.**
  No es una fuga: el `SQSClient` de ese caso es un mock (`{ send } as unknown as SQSClient`),
  nunca se abre una conexión. Pero es el único punto de `test/` que codifica el
  sufijo de desarrollo a mano, e invita a copiarlo. Preferible
  `resolveResourceNamesFromEnv(process.env)` como las otras siete.
- **O3 — El rojo de R9 (`6c8c1b2`) es ambiental, no estructural.** El commit es
  test-only y correcto, pero para entonces R6 ya había creado el juego de test,
  así que su fallo dependía del estado de LocalStack, no del código. La sustancia
  de R9 (las 8 migraciones) sí es rojo→verde honesto, y el requisito queda
  verificado por la medición de recuentos. Se anota por precisión del historial.
- **O4 — R10 no asevera movimiento en `notifications-test` ni `geofence-events-test`.**
  El ancla anti-vacío es solo `positions-raw-test`. La entrega EventBridge → SQS
  es asíncrona, así que una regresión que mandara eventos al bus de desarrollo
  podría llegar a `geofence-events` después de la aserción de L235. Riesgo
  residual pequeño y cubierto de sobra por R9 y por la medición externa.
- **O5 — `progress/imp.md` sobra** (ver punto 5).
- **O6 — fuera de alcance, para tenerlo anotado:** en
  `src/aws/relative-import-guard.spec.ts:32` el filtro
  `file.startsWith(AWS_DIR + '/')` no descarta nada en Windows, donde `join`
  devuelve `\`. Hoy es inocuo (los archivos de `src/aws/` importan con `./`, que
  el patrón no matchea), pero es código de #20 y no lo toca esta feature.

---

## Re-verificación acotada — `921b6e7` (2026-08-17)

Verificada por mí, no aceptada de palabra.

**1. Ni una línea de código ni de test.**
`git diff 9ebf93b..921b6e7 -- backend-pet-tracker/ infra/` → **salida vacía**.
El `--stat` del commit son 4 archivos, todos bajo `specs/test-dev-resource-isolation/`:
`design.md`, `requirements.md` y `tasks.md` con **una línea cada uno**
(`status: draft` → `status: approved`), y `traceability.md` con esa misma línea
más el párrafo de la deuda de `ItemCount` reescrito. Nada más.

**2. C6, los tres puntos.**

- `requirements.md` L3: `status: approved     # draft | approved` ✔
- L370: `- [X] Aprobado por humano (fecha: 2026-08-17)` ✔
- **Ningún requisito modificado tras la aprobación.** `git log` sobre
  `requirements.md` en toda la branch devuelve **exactamente dos commits**:
  `a40917b` (creación de la spec, ya con la casilla `[X]`) y `921b6e7` (el campo
  `status`). El segundo no toca ningún enunciado: es el registro del gate, no un
  cambio de requisito. Confirmado que **las tres enmiendas no tocaron
  `requirements.md`**: `03bb649`, `c74b031` y `bfd572f` modifican solo
  `tasks.md` + `traceability.md`.

**Las tres enmiendas están justificadas donde toca.** Leí sus diffs: en
`tasks.md` sustituyen el checklist "(1) test que falla → (2) implementación →
(3) refactor" por un banner explícito
*"CORRECCIÓN del 2026-08-17, gate humano — este requisito nace verde … **no
fabriques un fallo**"*, y en `traceability.md` amplían la lista de excepciones a
C4 con su razón. Cambian el **procedimiento**, nunca el enunciado de un R-id.
`bfd572f` además **endurece** el requisito (añade la aserción anti-vacío como
condición de cobertura de R11), que es lo contrario de relajar el gate.

**3. Nada de lo ya validado quedó invalidado.** Ningún test del repo lee el
contenido de `specs/`: el grep sobre `backend-pet-tracker/src`,
`backend-pet-tracker/test` e `infra/test` solo devuelve comentarios en prosa que
citan rutas de specs, cero `readFileSync`. E `init.sh` toca `specs/` únicamente
para comprobar **existencia** de archivos (L110-115 y L154), nunca su contenido.
Como además el diff de código es vacío, **la corrida de `./init.sh` de más abajo
sigue siendo válida byte a byte** y no procede repetirla.

**4. La deuda de `ItemCount` quedó bien recogida.** `traceability.md` ahora dice
"CERRADA por el reviewer el 2026-08-17" con la medición correcta (exacto e
inmediato en LocalStack, contrastado con `scan --select COUNT` en cuatro puntos,
+1135 en `positions-test` y 0 en `positions`). Coincide con lo que medí.

---

## Acciones de cierre para el leader

1. ~~Poner `status: approved` en el frontmatter~~ — **hecho** en `921b6e7`.
2. **`progress/imp.md` sobra: bórralo.** Confirmado en la re-verificación: sigue
   siendo un duplicado de 11 líneas de
   `progress/impl_test-dev-resource-isolation.md`, con un nombre fuera de la
   convención `impl_<feature>.md` que fija `progress/history.md`. Quita también
   su mención de la fila R14 de `traceability.md`, que es la única referencia que
   lo sostiene. Es la última acción pendiente del cierre.
3. ~~Registrar el cierre de la deuda de `ItemCount`~~ — **hecho** en `921b6e7`.
4. R13 sigue siendo verificación humana por contrato, pero su resultado ya está
   disponible: ejecuté el procedimiento de `docs/verification.md` §Feature 28 y
   las tres colas de desarrollo quedaron idénticas tras la corrida e2e completa.
   Vale como evidencia para `progress/impl_test-dev-resource-isolation.md`.
5. Las observaciones O1, O2, O4 y O6 no bloquean y no exigen acción en este
   cierre; O2 (`device-subscriptions.e2e-spec.ts:681`) es la única que merece
   una línea de deuda si quieres arrastrarla.

---

## Output de `./init.sh`

Corrida sobre `9ebf93b`. Sigue siendo la corrida válida para `921b6e7`: entre
ambos commits el diff de `backend-pet-tracker/` e `infra/` está vacío y ningún
test lee el contenido de `specs/` (§Re-verificación punto 3).

Corrida propia del reviewer, con la infra levantada y verificada antes
(`docker port` confirma `5432/tcp -> 0.0.0.0:5432` y `4566` publicado) y con
`pnpm -C backend-pet-tracker run provision:local` ejecutado antes — que además
devolvió 0 sobre un LocalStack ya provisionado, lo que es una comprobación
extra de R7. Los 20 recursos comprobados uno a uno con la AWS CLI:
12 colas SQS, 2 tablas DynamoDB, 2 buckets S3, 2 buses EventBridge y 2 reglas
(`geofence-events` en el bus de dev, `geofence-events-test` en el de test).

```
══════════════════════════════════════════
  INIT — pet-tracker (Harness SDD)
══════════════════════════════════════════

→ Verificando entorno...
✅ node disponible (/c/Program Files/nodejs/node)
✅ pnpm disponible (/c/Users/alex/AppData/Local/pnpm/pnpm)

→ Verificando variables de entorno...
✅ .env encontrado
✅   DATABASE_URL definida
⚠️  .env desactualizado: faltan 4 claves de .env.example
⚠️    configuración ausente: AWS_MODE, SIM_HOME_LAT, SIM_HOME_LNG, SIM_SEED
⚠️    init.sh no modifica .env — añade a mano las que necesites desde .env.example

→ Instalando dependencias...
✅ Dependencias instaladas

→ Verificando coherencia del harness...
✅ Archivos del harness presentes
⚠️  Feature en progreso: test-dev-resource-isolation
✅ STATUS.md sincronizado con feature_list.json

→ Build...
✅ Build exitoso

→ Ejecutando tests...
Test Suites: 139 passed, 139 total          (backend unitarios)
Tests:       1026 passed, 1026 total

PASS test/no-duplicated-literals.test.ts (8.747 s)
PASS test/pet-tracker-dev-stack.test.ts (15.273 s)
Test Suites: 2 passed, 2 total              (infra CDK)
Tests:       14 passed, 14 total

ℹ suites 11                                  (harness env-drift #23)
ℹ tests 28
ℹ pass 28
ℹ fail 0
✅ Tests pasados

→ Tests e2e...
Test Suites: 2 skipped, 19 passed, 19 of 21 total
Tests:       6 skipped, 296 passed, 302 total
Time:        66.803 s
✅ Tests e2e pasados

→ Lint...
✅ Lint sin errores

→ Typecheck...
✅ Typecheck sin errores

══════════════════════════════════════════
✅ Todo verde. Listo para trabajar.

  Features: 26/30 completadas | 3 pendientes

  Próxima feature:
  [#29] wialon-session-reuse (P2)
```

**Exit code: 0.** Cero regresiones: los recuentos coinciden con la corrida final
de Codex (139/1026 unitarios, 2/14 infra, 11/28 harness, 19/296 e2e con 2 suites
AWS omitidas).

Nota sobre el ruido en el log: aparecen un `postgres unreachable` en unitarios y
un FK `pet_users_user_id_users_id_fk` (23503) en e2e. Ambos son salidas de
`Logger` de casos de error deliberados dentro de tests que **pasan** — no son
fallos ni la carrera de arranque de infra fría registrada en sesiones previas.
