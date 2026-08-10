# review: aws-mode-endpoint-guard (#21)

Fecha: 2026-08-10
Branch: `feature/21-aws-mode-endpoint-guard`
Rango revisado: `aec6e7e..HEAD` (28 commits)
Veredicto: **APROBADO**

---

## Resumen

La feature cierra el defecto real. La guarda existe, vive en las dos vías de
resolución, y **lo verifiqué ejecutando el escenario contaminado yo mismo**: la
suite `test/aws-real-ingest.e2e-spec.ts` con `AWS_MODE=aws` y
`AWS_ENDPOINT_URL` definida termina en exit 1, **0 tests en verde**, con el
mensaje de R2, lanzado desde `beforeAll` **antes** de las tres líneas que
construyen los clientes. Con `AWS_MODE` distinto de `aws` la suite conserva el
auto-skip íntegro.

El historial rojo→verde es real y comprobable commit a commit — no es el
"todo junto" de la feature #19. Ningún archivo prohibido aparece en el diff.

---

## Checklist C2 — Estado coherente

- [x] Solo 1 feature `in_progress` (`feature_list.json` L359, id 21). `grep -c` devuelve exactamente 1.
- [x] `progress/current.md` actualizado con feature, branch, gate humano, la enmienda de R4 y los pasos pendientes.
- [x] Codex **no** marcó la feature como `done`. El estado quedó en `in_progress`, como corresponde.

## Checklist C3 — Arquitectura

- [x] `domain` sin imports de `infrastructure`. Verificado: ningún archivo bajo `domain/` o `application/` importa `aws/aws-clients`.
- [x] El cambio queda confinado a `backend-pet-tracker/src/aws/` (infraestructura compartida, análoga a `src/db/`), tal como fija `design.md`.
- [x] `application` sigue dependiendo de interfaces; esta feature no toca casos de uso ni repositorios.
- [x] `infrastructure` sin lógica de negocio: la guarda es validación de configuración de entorno, no regla de dominio.
- [x] Convención de errores respetada: `UnexpectedAwsEndpointError` vive junto a `MissingAwsEndpointError`, no en `domain/errors/` (D1).

## Checklist C4 — TDD (el punto donde falló #19)

- [x] Cada R1-R7 tiene al menos un test que lo nombra en su `describe`/`it`.
- [x] Historial test-primero **verificado empíricamente**, no solo por orden de fechas. Ningún commit mezcla test + implementación:

| R-id | Commit rojo | Commit verde | Rojo demostrado por |
|---|---|---|---|
| R1 | `4d12b0b` (solo el .spec) | `1b0be58` (solo aws-clients.ts) | `UnexpectedAwsEndpointError` **no existía** en `aws-clients.ts` en `4d12b0b` → el import falla |
| R2 | `2db156b` (solo el .spec) | `99de872` (solo aws-clients.ts) | el mensaje era el placeholder `'Unexpected AWS endpoint'` → falla los 4 `toMatch` |
| R3 | `9d6bd3f` (solo el .spec) | `f19cff6` (solo aws-clients.ts) | `assertNoEndpoint` hacía `return endpoint ?? ''` → el caso `'   '` devolvía `'   '`, no `''` |
| R5 | `71d52b6` (solo el .spec) | `4eb9dca` (solo aws-clients.ts) | `resolveAwsConfigFromConfigService` no tenía guarda → la vía ConfigService no lanzaba |
| R4 | `c9027d2` (regresión verde inicial, autorizada por `tasks.md` R4(2)) | `9fb6a3c` (adaptación D10) | n/a — R4 es requisito de no-regresión |
| R6 | `852a403` (canario) | guardas ya en `1b0be58` + `4eb9dca` | n/a — R6 se apoya en la guarda ya construida |
| R7 | `4857274` (solo el .spec) | `4b4142f` (solo verification.md) | la sección `### Feature 21` no existía → `toContain` falla |

- [x] **`d18cfd2` ("style … apply lint formatting (R4,R7)") no cuela lógica.** Revisé el diff completo: 4 inserciones / 6 borrados, repartidos en dos reajustes de salto de línea de Prettier (`expect(...).toContain(...)` en una línea; `expect(...).toBe(...)` reindentado). Cero cambios semánticos, cero aserciones alteradas.

## Checklist C5 — Trazabilidad

- [x] `traceability.md` **sin ninguna fila "pendiente"**. Ocho filas: R1-R7 más R9.
- [x] Todos los hashes citados existen en la branch. Verifiqué los 16: `4d12b0b`, `1b0be58`, `2db156b`, `99de872`, `9d6bd3f`, `f19cff6`, `c9027d2`, `9fb6a3c`, `d18cfd2`, `71d52b6`, `4eb9dca`, `852a403`, `4857274`, `4b4142f`, `8d56770`, `8708b88`.
- [x] Formato de commits: los 28 cumplen `<tipo>(aws-mode-endpoint-guard): <desc>`. Los de código llevan sus R-ids entre paréntesis.

## Checklist C6 — Spec aprobada

- [x] `requirements.md` con `status: approved` y la casilla `[X] Aprobado por humano (fecha: 2026-08-10)` marcada.
- [x] La enmienda de R4 quedó documentada dentro del propio `requirements.md` y en `design.md` §D10, con commit propio (`ddfa9c8`) previo a la adaptación (`9fb6a3c`). El gate se reabrió antes de tocar el archivo, no después.

## Checklist C7 — Sin código huérfano

- [x] N/A parcial — la feature **añade** una guarda, no reemplaza ningún componente.
- [x] Único borrado de cobertura: los dos fixtures de `aws-mode.spec.ts` que pasaban `AWS_ENDPOINT_URL` en modo `aws`. No queda huérfano: esa combinación pasa a estar prohibida y su prueba es R1 de esta feature. `ENDPOINT` sigue usándose en el resto del archivo, así que no hay constante muerta.

---

## Verificación requisito por requisito

### R1 — Guarda que lanza `UnexpectedAwsEndpointError` — CUMPLE

Clase exportada desde `aws-clients.ts` con `this.name = 'UnexpectedAwsEndpointError'`
como última línea del constructor (D1). Helper privado `assertNoEndpoint`
colocado justo debajo de `assertEndpoint`, con la firma exacta de §D3. Se lanza
**dentro del resolver**, no en los factories ni en `resolveAwsClientOptions`.
Test discriminante: sin la guarda, `.toThrow(UnexpectedAwsEndpointError)` queda
en rojo.

### R2 — Mensaje con las cuatro subcadenas — CUMPLE

Texto copiado literal de §D2. Contiene `AWS_ENDPOINT_URL`, `AWS_MODE`,
`process.env` y `.env`. El test usa `toMatch` sobre subcadenas, nunca el string
completo, como exige la spec. Confirmado en la corrida real del e2e: el mensaje
sale entero por consola.

### R3 — Modo `aws` sin endpoint sin cambios — CUMPLE

`it.each([undefined, '', '   '])` cubre las tres formas de ausencia. Comprueba
`{ mode: 'aws', endpoint: '' }` más `'endpoint' in options === false` y
`'credentials' in options === false`, que es literalmente lo que pide R3.
El caso `'   '` es además discriminante: sin la normalización a `''` queda rojo.

### R4 — Modo `local` intacto — CUMPLE (con la enmienda)

Los cuatro archivos que R4 sigue declarando intocables (`aws-clients.spec.ts`,
`aws-env-config.spec.ts`, `aws.module.spec.ts`, `localstack-provisioning.e2e-spec.ts`)
**están ausentes del diff**, verificado con `git diff --name-only`.

`aws-mode.spec.ts` tiene **exactamente los dos cambios de D10 y nada más** —
diff de 2 inserciones / 2 borrados:

1. L49: `AWS_ENDPOINT_URL: expectedMode === 'local' ? ENDPOINT : undefined`
2. L122: se borra la línea `AWS_ENDPOINT_URL: ENDPOINT,`

Contrastado línea a línea: ningún `describe`/`it` añadido, borrado ni
renombrado; ninguna aserción debilitada (las dos siguen siendo las originales,
`toBe(expectedMode)` y las de `options`); `buildAwsConfig()` **sin tocar**.
No hay ningún test de #19 desactivado ni relajado.

### R5 — Las dos vías cubiertas — CUMPLE

`it.each` parametrizado sobre `resolveAwsConfigFromEnv` y
`resolveAwsConfigFromConfigService`, ambas con el mismo error y el mismo
mensaje. La vía ConfigService recibió su guarda en un commit propio (`4eb9dca`)
posterior a su test rojo (`71d52b6`). Ninguna vía queda sin guarda.

### R6 — El e2e falla explícito — CUMPLE (verificado por mí, no por el reporte)

**Corrida contaminada** (variables efímeras, credenciales estáticas vacías):

```
AWS_MODE=aws AWS_ENDPOINT_URL=http://localhost:4566 \
  pnpm exec jest --config ./test/jest-e2e.json --runInBand test/aws-real-ingest.e2e-spec.ts
```

Resultado obtenido:

```
Test Suites: 1 failed, 1 total
Tests:       4 failed, 4 total
Time:        1.128 s
EXIT=1
```

- **0 tests en verde.** Los 4 fallan.
- Mensaje: el de R2, completo, en los cuatro.
- Traza: `assertNoEndpoint (../src/aws/aws-clients.ts:57)` ←
  `resolveAwsConfigFromEnv (../src/aws/aws-clients.ts:85)` ←
  `aws-real-ingest.e2e-spec.ts:115`. La línea 115 es la del `beforeAll`,
  **anterior** a las líneas 117-119 que construyen SQS, EventBridge y DynamoDB.
  Ningún cliente se construyó.
- 1.1 s de corrida: no hubo ninguna llamada de red.

**Corrida sin `AWS_MODE=aws`** (auto-skip preservado):

```
Test Suites: 1 skipped, 0 of 1 total
Tests:       4 skipped, 4 total
EXIT=0
```

El `it` de R6 es el **primer `it`** del `describe` (L176; lo que le precede son
`beforeAll` y `afterAll`, no tests), con el texto exacto de §D8. El `describe`
sigue siendo `(runAwsIngest ? describe : describe.skip)('R21: …')` con el R-id
de #20 intacto.

### R7 — Documentación — CUMPLE

`docs/verification.md` gana la sección `### Feature 21 — aws-mode-endpoint-guard`,
que nombra `UnexpectedAwsEndpointError` y `AWS_ENDPOINT_URL`, colocada después
del bloque de la feature 20 y antes de `## Notas para el implementer`, como
pide §D6.

El párrafo R21 de la feature 20 se reescribió: desaparece
`**Verde no basta como evidencia.**` como única red y entra "Desde la feature 21
la guarda automática aborta la corrida…"; los dos métodos manuales (mirar el
`QueueUrl`, apagar LocalStack) se conservan degradados a "verificación positiva
opcional". **No se borró** el paso R18: sigue en L102 exigiendo comentar las
tres variables a mano, y la sección nueva lo refuerza explicando que la CLI de
CDK no pasa por `aws-clients.ts`.

### R9 — Evidencia de proceso — CUMPLE

(a) historial rojo→verde por R-id: verificado arriba. (b) `traceability.md` sin
filas pendientes. (c) `progress/impl_aws-mode-endpoint-guard.md` registra la
corrida final con exit code y recuento. (d) `./init.sh` exit 0 — confirmado por
mí.

### No hay R8 — CUMPLE

`docs/conventions.md` **no aparece en el diff**. El hueco de numeración se
respeta: ningún R-id fue renumerado.

---

## Archivos intocables — verificación

`git diff --name-only aec6e7e..HEAD` devuelve 13 archivos, todos autorizados por
la tabla §Archivos afectados de `design.md`:

```
backend-pet-tracker/src/aws/aws-clients.ts
backend-pet-tracker/src/aws/aws-endpoint-guard-docs.spec.ts
backend-pet-tracker/src/aws/aws-endpoint-guard.spec.ts
backend-pet-tracker/src/aws/aws-mode.spec.ts
backend-pet-tracker/test/aws-real-ingest.e2e-spec.ts
docs/verification.md
feature_list.json
progress/current.md
progress/impl_aws-mode-endpoint-guard.md
specs/aws-mode-endpoint-guard/{design,requirements,tasks,traceability}.md
```

Ninguno de los prohibidos aparece: `aws-clients.spec.ts`, `aws-env-config.spec.ts`,
`aws.module.spec.ts`, `localstack-provisioning.e2e-spec.ts`, `aws-real-smoke.e2e-spec.ts`,
`no-hardcoded-credentials.spec.ts`, `no-real-aws-endpoint.spec.ts`,
`docs/conventions.md`, `provisioning.ts`, `run-provisioning.ts`, `aws.module.ts`,
`.env.example`, `infra/`.

---

## Escrutinio anti-falso-verde

La pregunta obligatoria para cada test nuevo — *¿podría pasar en verde sin que
la guarda exista?*

| Test | ¿Discrimina? | Nota |
|---|---|---|
| `R1: … aborta` | **Sí** | sin la clase, ni siquiera compila el import |
| `R2: el mensaje …` | **Sí** | `toBeInstanceOf` queda en rojo |
| `R3: … sin AWS_ENDPOINT_URL` | **Parcial** | el caso `'   '` discrimina; `undefined`/`''` no. Correcto: R3 es requisito de no-regresión |
| `R4: modo local intacto` | **No, por diseño** | R4 es literalmente "nada cambia". Un test que discriminara contradiría el requisito |
| `R5: las dos vías` | **Sí** | ambas ramas quedan en rojo sin guarda |
| `R6` (e2e) | **No en aislamiento** | ver observación 1 |
| `R7` (docs) | **Sí** | los tres `toContain` fallan sin la sección |

Conclusión: la guarda está probada de verdad por R1, R2, R5 y parcialmente R3.
No encontré ningún test que finja verificar y no verifique.

---

## Observaciones (ninguna bloqueante)

1. **El `it` de R6 es tautológico en aislamiento** (severidad: baja, sin acción).
   `expect(() => resolveAwsConfigFromEnv(process.env)).not.toThrow()` pasa en
   verde siempre que nada lance — también en un mundo sin guarda. No es él quien
   demuestra que la guarda existe; eso lo hacen R1 y R5. Su función es ser
   canario: ponerse rojo en una corrida contaminada. Es **exactamente** lo que
   §D8 especifica, calcado del patrón de `assertNoStaticAccessKey` en
   `aws-real-smoke.e2e-spec.ts`, y el comportamiento end-to-end que R6 exige lo
   verifiqué a mano (4 fallos, 0 verdes, antes de construir clientes). Cumple la
   spec aprobada; lo dejo anotado por si alguien lo lee fuera de contexto.

2. **`assertNoStaticAccessKey` puede preceder al mensaje de R2** (severidad:
   baja, sin acción). En `beforeAll` la guarda de credenciales corre antes que
   la de endpoint. Lo comprobé: con `AWS_MODE=aws`, `AWS_ENDPOINT_URL` puesta
   **y** `AWS_ACCESS_KEY_ID` presente, la suite falla con
   `AWS_ACCESS_KEY_ID debe estar ausente…`, no con el mensaje de R2. R6 pide
   "fallar con el mensaje de R2". Matices que lo dejan en observación y no en
   rechazo: (a) el objetivo real —que la suite no pase en verde falso— se cumple
   en ambos escenarios (exit 1, 0 verdes, sin construir clientes, sin red);
   (b) el escenario que causó el incidente de #20 fue credenciales comentadas y
   endpoint olvidado, y ahí el mensaje de R2 sale limpio, verificado; (c) el
   orden viene de código de #19 que §D8 prohíbe expresamente reordenar
   ("no hace falta reordenar nada").

3. **El test de docs de R7 cubre solo la mitad del requisito** (severidad: baja,
   sin acción). `aws-endpoint-guard-docs.spec.ts` verifica las tres cadenas de la
   sección nueva, pero no asegura la reescritura del párrafo R21 de la feature 20
   ni la supervivencia del paso R18. Es lo que fija la tabla §Contrato de tests
   de `design.md`. Verifiqué las dos cosas a mano sobre el diff y sobre
   `verification.md` L102: están correctas.

4. **Dos commits de spec sin R-ids** (severidad: cosmética). `e5fd346` y
   `ddfa9c8` no llevan `(R-id)`. Son commits de harness/spec, no de código; la
   convención de `traceability.md` apunta a los commits de implementación. Sin
   impacto en C5.

---

## Output de `./init.sh`

Ejecutado por mí desde la raíz, con la infraestructura ya caliente. No hizo
falta repetir: no apareció la carrera de arranque de `pet_users`.

```
✅ node disponible (/c/Program Files/nodejs/node)
✅ pnpm disponible (/c/Users/alex/AppData/Local/pnpm/pnpm)
✅ .env encontrado
✅   DATABASE_URL definida
✅ Dependencias instaladas
✅ Archivos del harness presentes
✅ STATUS.md sincronizado con feature_list.json
✅ Build exitoso

→ Tests unitarios (backend)
Test Suites: 123 passed, 123 total
Tests:       889 passed, 889 total

→ Tests unitarios (infra)
Test Suites: 2 passed, 2 total
Tests:       14 passed, 14 total
✅ Tests pasados

→ Tests e2e
Test Suites: 2 skipped, 13 passed, 13 of 15 total
Tests:       6 skipped, 181 passed, 187 total
✅ Tests e2e pasados

→ Lint...
✅ Lint sin errores

→ Typecheck...
✅ Typecheck sin errores

✅ Todo verde. Listo para trabajar.

EXIT_CODE=0
```

**Recuento propio: exit code 0. Backend 123 suites / 889 tests. Infra 2 suites /
14 tests. E2E 13 suites pasadas + 2 omitidas, 181 tests pasados + 6 omitidos.**

Coincide exactamente con lo declarado en `progress/impl_aws-mode-endpoint-guard.md`
§Verificación final. El reporte del implementer no exageró nada.

Sin regresiones: el baseline de #20 era 121 suites / 879 tests. El delta
(+2 suites, +10 tests) corresponde a los dos archivos nuevos
(`aws-endpoint-guard.spec.ts` con 7 tests contando los `it.each`, y
`aws-endpoint-guard-docs.spec.ts` con 1) más el desglose de `it.each`. Los 6
omitidos en e2e (antes 5) son el `it` de R6 sumado a la suite auto-saltada.

---

## Veredicto

**APROBADO.**

La guarda arregla el defecto de raíz, en el único punto por el que la
configuración entra al sistema, y las dos vías están cubiertas. El canario de R6
hace lo que promete: lo ejecuté en el escenario contaminado y la suite se cayó
con el mensaje correcto antes de construir un solo cliente, con cero tests en
verde. Ningún test de #19 fue desactivado ni relajado para forzar el verde:
`aws-mode.spec.ts` tiene los dos cambios que autoriza §D10 y ni uno más. El
historial rojo→verde por R-id es genuino y verificable, que era justo el
checkpoint incumplido en #19.

Pendiente para el leader antes de cerrar: nada de código. Si la feature requiere
cierre humano de algún paso manual (la comprobación contra AWS real de
`docs/verification.md`), eso queda fuera del alcance de esta revisión.
