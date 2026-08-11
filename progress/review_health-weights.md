# review: health-weights (#15)

Fecha: 2026-08-11
Branch revisada: `feature/15-health-weights` (33 commits sobre `main`)
Diff: `git diff main..HEAD` — 31 archivos, +4009 / -24

**Veredicto: APROBADO**

---

## Checklist C2 — Estado coherente

- [x] Solo 1 feature `in_progress` (`#15 health-weights`; 17 `done`, 4 `pending`)
- [x] `progress/current.md` describe la sesión activa
- [x] `STATUS.md` sincronizado con `feature_list.json` (init.sh lo verifica)
- [x] `progress/history.md` tiene la entrada de #21, la sesión anterior cerrada

Nota no bloqueante: la línea `estado:` de `progress/current.md` sigue diciendo
"handoff entregado, esperando a Codex CLI" cuando Codex ya terminó. Es el
archivo de cierre del leader, no del implementer.

## Checklist C3 — Arquitectura

- [x] `domain` sin imports de infrastructure — `weight.entity.ts` no importa
      nada; `weight.repository.ts` solo importa su propia entidad
- [x] Los contratos en domain son interfaces puras — `WeightRepository` es
      `interface` + `Symbol('WeightRepository')`, sin implementación
- [x] `application` depende solo de interfaces — `CreateWeightUseCase` y
      `ListWeightsUseCase` inyectan por token (`WEIGHT_REPOSITORY`,
      `AUDIT_LOGGER`) y tipan con `import type`; `AuditLogger` es el puerto
      transversal de `src/audit/`, no una implementación
- [x] `infrastructure` implementa hacia adentro — `WeightDrizzleRepository
      implements WeightRepository`; el mapeo a HTTP vive en
      `infrastructure/mappers/weight.mapper.ts`
- [x] El cableado está en `health.module.ts` con `{ provide: WEIGHT_REPOSITORY,
      useClass: WeightDrizzleRepository }`, mismo patrón que `VACCINE_REPOSITORY`
- [x] Extiende el módulo `health` de #14; no crea módulo nuevo, como manda la spec

## Checklist C4 — TDD

- [x] Cada R1..R10 tiene al menos un test que lo nombra con el sufijo obligatorio
      `R<n> (health-weights #15): ...` — sin colisión con los R1..R13 de #14
- [x] El historial muestra test-primero por requisito: 10 tríos
      `test(...)` → `feat(...)` → `docs(...)`, más `refactor(...)` de lint al final
- [x] **Verificado ejecutando cada commit rojo en un worktree aparte** (ver
      sección "Verificación commit a commit" abajo): los 10 rojos fallan de
      verdad y ninguno es un rojo falso por archivo inexistente

## Checklist C5 — Trazabilidad

- [x] `specs/health-weights/traceability.md` tiene las 10 filas R1..R10
      completas; **ninguna dice "pendiente"**
- [x] Los tests referenciados existen con el nombre exacto de la tabla (los
      comprobé archivo por archivo)
- [x] Commits en formato `feat(health-weights): <desc> (R<n>)`, conforme a
      `docs/conventions.md` §Commits

## Checklist C6 — Spec aprobada

- [x] `specs/health-weights/requirements.md` con `status: approved`
- [x] Casilla `[X] Aprobado por humano (fecha: 2026-08-11)` marcada
- [x] Ningún R-id modificado tras la aprobación: `requirements.md` entra entero
      en el commit `6b28e66` y solo el frontmatter cambia en `2364aa8`
      (`chore(health-weights): approve spec and hand off to Codex`)

## Checklist C7 — Sin código huérfano

- [x] N/A en lo esencial: #15 **extiende** `src/modules/health/`, no reemplaza
      nada. No hay endpoints, use-cases ni componentes deprecados
- [x] El único borrado real es la extracción de `isIsoDate` y del cálculo de
      "hoy UTC" desde `vaccine.dto.ts` (#14) al nuevo
      `application/dto/iso-date.ts`. La función original **sí** se eliminó:
      `grep -rn "function isIsoDate" src/` devuelve una sola definición
- [x] No quedan `.spec` de archivos inexistentes

---

## Verificación independiente: `./init.sh`

Corrida propia, con la infra Docker ya caliente. **Exit code 0.**

Los e2e **sí se ejecutaron** — no apareció el warning
"Puerto 5432 sin respuesta — se saltan los e2e", y `docker port
pet-tracker-postgres` devolvió `0.0.0.0:5432` antes de arrancar.

```
✅ Build exitoso            (nest build + tsc-alias, cdk synth --quiet)

Backend unit
  Test Suites: 127 passed, 127 total
  Tests:       901 passed, 901 total
  Time:        9.513 s

Infra
  Test Suites: 2 passed, 2 total
  Tests:       14 passed, 14 total

E2E
  Test Suites: 2 skipped, 14 passed, 14 of 16 total
  Tests:       6 skipped, 213 passed, 219 total
  Time:        58.496 s

✅ Lint sin errores
✅ Typecheck sin errores

══════════════════════════════════════════
✅ Todo verde. Listo para trabajar.
  Features: 17/22 completadas | 4 pendientes
EXIT_CODE=0
```

### Los e2e de la feature corrieron de verdad

Comprobación por conteo, no por confianza. Baseline de `progress/current.md`:
123 suites / 889 tests unit y 181 e2e. Ahora:

| | Antes | Ahora | Delta | Cuadra con |
|---|---|---|---|---|
| Suites unit | 123 | 127 | +4 | `weights.schema.spec`, `weight.drizzle.repository.spec`, `weight-variation.spec`, `create-weight.use-case.spec` |
| Tests unit | 889 | 901 | +12 | 4 + 2 + 4 + 2 |
| Tests e2e | 181 | 213 | +32 | R2:2, R3:3, R5:3, R6:8, R7:10, R8:3, R9:2, R10:1 = 32 |

Los +32 e2e son exactamente los `it` de `test/health-weights.e2e-spec.ts`, así
que la suite corrió completa y en verde. Sin regresiones: los 181 previos
siguen pasando.

### Sobre las 2 suites saltadas y la carrera de FK

- Las 2 suites `skipped` (6 tests) son `aws-real-ingest.e2e-spec.ts` y
  `aws-real-smoke.e2e-spec.ts`, que se saltan sin `AWS_MODE=aws`. Ya estaban
  saltadas en el baseline: no es un hueco introducido por #15.
- El log e2e muestra un `ERROR ... pet_users_user_id_users_id_fk` en un
  `POST /v1/pets`. Es la carrera de arranque conocida de la infra, no una
  regresión: la suite terminó verde en la misma ejecución y no hizo falta
  repetirla. Una sola corrida, exit 0.

---

## Verificación commit a commit de C4 (rojo → verde)

Método: `git worktree add` sobre un directorio de scratch con junctions al
`node_modules` del repo, `git checkout` de cada commit rojo, y ejecución del
archivo de test que la tabla de trazabilidad nombra para ese R-id. Nada de
esto tocó el working tree del repo; el worktree quedó eliminado al terminar.

| R | Commit rojo | Resultado real en el rojo | ¿Rojo por la razón correcta? |
|---|---|---|---|
| R1 | `281663d` | `1 failed`, 0 tests corridos — `TypeError: Cannot read properties of undefined (reading 'Symbol(drizzle:Columns)')` en `getTableConfig(weights)` | Sí, con matiz: `weights` aún no se exporta de `health.schema.ts`. Es el sujeto del test, no un import roto. Ver hallazgo NB-4 |
| R2 | `0abc655` | `2 failed, 2 total` — `expected 201 "Created", got 404 "Not Found"` | Sí. Suite compila y corre; la ruta no existe todavía |
| R3 | `f5a4fea` | `3 failed, 2 passed` — `Expected: 18.4 / Received: null` en `currentWeightKg` (y 20, y 22.8) | Sí. El POST ya funciona; falta la proyección a `pets`. Los 2 de R2 siguen verdes |
| R4 | `5033761` | `2 failed, 2 total` — `transactionCalls` 0 y el insert aparece en `committedInserts` pese al fallo del update | Sí, el mejor rojo del lote: assertion genuina, insert y update fuera de transacción |
| R5 | `2c27056` | unit `4 failed`: `toWeightHistory is not a function`; e2e `3 failed, 5 passed`: `expected 200 "OK", got 404` | Sí. El e2e es assertion genuina; el unit es símbolo aún inexistente en un archivo que sí existe (NB-4) |
| R6 | `b7fc54b` | `6 failed, 10 passed` — `limit=0/101/abc/(vacío)/other=1` → `200 "OK"` en vez de 400; `limit=1.5` → `500` | Sí. Los 6 casos de validación estricta, uno a uno |
| R7 | `f3c6ec2` | `7 failed, 19 passed` — `expected 400, got 201` (weight 0 y negativo, y `hoy+2`) y `got 500` (overflow, bodyCondition 0/10/4.5) | Sí. **No es rojo de compilación**: `MEASURED_AT_MAX_FUTURE_DAYS` ya existía desde `f3b6c80` (R6 verde), así que el import resuelve y las aserciones se evalúan |
| R8 | `5d8bedf` | `3 failed, 26 passed` — `expected 404, got 201` (no-miembro escribe en mascota ajena) y `got 500` (mascota inexistente, petId no-UUID) | Sí. El 201 del no-miembro es exactamente el agujero de seguridad que R8 cierra |
| R9 | `e216a1b` | `1 failed, 30 passed` — `expected 403 "Forbidden", got 201 "Created"` para rol `family` | Sí. Ver NB-6 sobre el segundo `it` de R9 |
| R10 | `97742cd` | e2e `1 failed, 31 passed` — `Expected length: 1 / Received length: 0` en `audit_log`; unit `1 failed, 1 passed` — `record` nunca llamado con la entrada esperada | Sí |

Verdes confirmados por muestreo en los commits de implementación:
`0e1dae1` (R1) → `4 passed`; `9b65281` (R4) → `2 passed`. En los rojos
posteriores se ve además que los tests de los R-ids anteriores siguen pasando
(2 → 5 → 10 → 19 → 26 → 30 → 31 acumulados), o sea que ningún verde se rompió
por el camino.

---

## Los 9 puntos de lupa del encargo

### 1. Migración nueva `0010_*.sql`, `0009` intacto, sin `ALTER TABLE "pets"` — OK

`0010_low_miracleman.sql` es un archivo nuevo. `git diff main..HEAD --name-only`
**no** lista `0009_shallow_dust.sql` ni `health.schema.spec.ts`, así que la
aserción de `health.schema.spec.ts:63` (`expect(sql).not.toContain('CREATE TABLE
"weights"')` sobre `0009`) sigue en pie sin haberse tocado.

El SQL de `0010` contiene solo `CREATE TABLE "weights"`, las dos FK
(`pet_id` → `pets` `ON DELETE cascade`, `created_by` → `users` `no action`),
el CHECK `weights_body_condition_check` y los dos índices
(`weights_pet_id_measured_at_idx` sobre `(pet_id, measured_at DESC NULLS LAST)`
y `weights_created_by_idx`). Cero `ALTER TABLE "pets"`. `_journal.json` añade la
entrada `idx: 10` sin tocar las 10 anteriores.

`weights.schema.spec.ts` busca la migración por contenido (`.find()` sobre
`readdirSync` en orden alfabético) y asevera `/^0010_.*\.sql$/`: si alguien
metiera el `CREATE TABLE` en `0009`, `.find()` lo encontraría primero y el test
fallaría. Buena guarda.

### 2. `numeric` como string — OK

- La columna es `numeric('weight_kg', { precision: 5, scale: 2 })` **sin**
  `mode: 'number'`.
- `grep` sobre el diff completo de `setTypeParser` y `mode: 'number'`: los
  únicos aciertos están en la prosa de `specs/health-weights/design.md`
  documentando que **no** se usan. Cero en código.
- Conversión manual en los dos sentidos, igual que `pet.drizzle.repository.ts`:
  `String(data.weightKg)` al escribir (`weight.drizzle.repository.ts:27` y `:34`)
  y `Number(row.weightKg)` al leer (`toDomain`, `:97`).
- El e2e lo asevera por los dos lados: `typeof response.body.weightKg === 'number'`
  y `expect(row.weightKg).toBe('21.35')` leyendo la fila cruda.

### 3. `variation` sobre el historial completo, no sobre la página — OK

`ListWeightsUseCase.execute` pide `listByPet(petId, limit + 1)` y
`toWeightHistory(rows, limit)` recorta a `limit` usando `rows[index + 1]` como
anterior. La fila sonda queda fuera de la respuesta pero dentro del cálculo.
Funciona porque el orden `measured_at DESC, id DESC` es el inverso exacto del
orden total `(measured_at, id)` ascendente que pide R5.

El test que importa existe y prueba de verdad el caso difícil —
`test/health-weights.e2e-spec.ts:252`, "con limit=1 calcula variation usando una
fila fuera de la pagina": dos mediciones (69.8 y 70.2), `?limit=1`, y asevera
`toHaveLength(1)` **y** `variation === 0.4`. Con la implementación ingenua
(variación sobre la página) ese valor sería `null`.

### 4. R3, los tres casos — OK

Los tres están, cada uno con su `it` y su mascota nueva:
- primera medición actualiza (`currentWeightKg` 18.4);
- retroactiva no pisa (20 el 2026-02-15, luego 17 el 2026-01-15 → sigue 20);
- empate exacto de `measuredAt` sí pisa (22 y luego 22.8 el mismo día → 22.8).

La implementación lo consigue con `notExists(... gt(weights.measuredAt,
data.measuredAt))` dentro del `UPDATE`. Es correcto y sutil: el `INSERT` ocurre
antes en la misma transacción, así que la fila recién creada es visible al
subquery, pero su `measured_at` no es *estrictamente mayor* que sí mismo, luego
no se auto-bloquea. Y el empate tampoco es `>`, luego el update procede: "la
última escrita gana", como pide R3.

### 5. R7, fecha futura sin literales — OK

`test/health-weights.e2e-spec.ts:380` usa el helper `isoDateOffset(days)`, que
parte de `new Date()`, hace `setUTCDate(getUTCDate() + days)` y corta
`toISOString().slice(0, 10)`: fecha de hoy en UTC, calculada en cada corrida.
Los tres casos son `isoDateOffset(0)` → 201, `isoDateOffset(MEASURED_AT_MAX_FUTURE_DAYS)`
→ 201 y `isoDateOffset(MEASURED_AT_MAX_FUTURE_DAYS + 1)` → 400, importando la
constante desde el DTO en vez de hardcodear el 1. **Ninguna fecha literal**;
el test no se pudre.

Además cierra el círculo verificando el efecto lateral: 2 filas en `weights` y
`currentWeightKg === 21` (el de `hoy+1`, el más reciente).

La constante `MEASURED_AT_MAX_FUTURE_DAYS` se exporta desde
`application/dto/weight.dto.ts:6` junto a `WEIGHTS_DEFAULT_LIMIT` y
`WEIGHTS_MAX_LIMIT`, en la ruta exacta que R7 exige. `maxMeasuredAtIsoDate()`
se evalúa **dentro** del `refine`, en cada petición, no al cargar el módulo.

### 6. R8 antes que R9 — OK

Hay test de precedencia, no solo de cada código por separado:
`test/health-weights.e2e-spec.ts:471`, "un no-miembro recibe 404 antes de validar
body o rol", hace un POST como forastero **con body inválido** (`weightKg: 0`) y
exige 404. Ese actor no es owner y su body es 400: si el orden fuese otro
recibiría 403 o 400. Recibe 404.

Estructuralmente también está garantizado: `PetAccessGuard.canActivate` lanza
`NotFoundException` (petId no-UUID, y luego membresía ausente o no activa)
**antes** de leer `PET_ROLES_KEY` del reflector y evaluar el 403. Un solo guard,
un solo camino, imposible invertir el orden sin editarlo.

### 7. Sufijo de R-id en los tests — OK

Los 10 `describe` usan `R<n> (health-weights #15): ...`. Verificado por lectura
de los 5 archivos de test, no solo por grep. Sin colisión con los R1..R13 que
#14 dejó en el mismo módulo.

### 8. Alcance — OK

- `PetProfileResponse` **intacto**: el diff no toca
  `pet-profile-response.mapper.ts` ni sus tres tests de contrato
  (`pet-profile-response.mapper.spec.ts`, `test/pets.e2e-spec.ts`,
  `test/devices.e2e-spec.ts`). Los tres siguen verdes en mi corrida. Cero
  apariciones de `weightVariation` en código.
- `POST`/`PATCH /v1/pets` sobre `weightKg`: sin tocar. `pets.controller.ts`,
  `pet.drizzle.repository.ts` y los use-cases de pets no aparecen en el diff.
  La feature #22 sigue siendo #22.
- Sin `PATCH`/`DELETE` de mediciones: `weights.controller.ts` declara
  exactamente un `@Post()` y un `@Get()`.
- Único desvío: `vaccine.dto.ts` (#14) sí se tocó. Ver NB-7 — es una extracción
  DRY sin cambio de comportamiento, no scope creep funcional.

### 9. `traceability.md` y `docs/data-model.md` — OK

- `traceability.md`: 10 filas, ninguna "pendiente", cada una con test y con el
  par de hashes rojo/verde. Los hashes coinciden con `git log` uno a uno.
- `docs/data-model.md`, fila `weights`: pasa de "Actualiza `pets.current_weight_kg`
  si es la más reciente" a "Implementada por `health-weights` (#15, migración
  `0010`); actualiza `pets.current_weight_kg` si es la más reciente". Mismo
  formato que las filas de #12 y #14.

---

## Hallazgos

### Bloqueantes

Ninguno.

### No bloqueantes

**NB-1 — `traceability.md` con `status: draft` en el frontmatter.**
`specs/health-weights/traceability.md:3` dice `status: draft`; los equivalentes
de #14 y #21 dicen `status: approved`. Inconsistencia cosmética con la
convención del repo. C5 solo exige que no haya filas "pendiente", y no las hay.
Es un archivo de `specs/`, o sea del leader.

**NB-2 — `progress/current.md` desfasado.**
Sigue diciendo "estado: spec aprobada por humano — handoff entregado, esperando
a Codex CLI". Cierre de sesión del leader.

**NB-3 — `variation` no nula en la respuesta del `POST` no tiene ningún test, y
`findPrevious` no se ejecuta nunca contra Postgres.**
Es el hueco de cobertura real de la feature. R2 dice que el `variation` de la
respuesta del POST sigue la regla de R5, pero:
- el único `variation` aseverado en un POST es el `null` de la primera medición
  (`:137`);
- `create-weight.use-case.spec.ts` mockea `findPrevious` a `null` siempre;
- el doble de `weight.drizzle.repository.spec.ts` deja `select` como
  `() => ({ from: () => ({ where: () => ({}) }) })`, así que nunca entra ahí;
- todas las aserciones de `variation != null` van por el `GET`, que usa el
  camino de la fila sonda (`limit + 1`), **otro código distinto**.

Resultado: el `WHERE` de `WeightDrizzleRepository.findPrevious` —con su desempate
`or(lt(measured_at), and(eq(measured_at), lt(id)))`— no tiene una sola línea de
cobertura ejecutada. Lo revisé a mano y la lógica es correcta (encuentra el
inmediatamente anterior en el orden total `(measured_at, id)`, y excluye la fila
recién insertada porque su `id` uuidv7 es el mayor), pero una regresión ahí
saldría verde. No es incumplimiento de C4 —R2 tiene tests que lo nombran— sino
deuda de test. Un `it` que haga dos POST y asevere el `variation` del segundo lo
cerraría.

**NB-4 — Dos rojos son "símbolo aún no definido", no aserción fallida.**
R1 (`281663d`) falla con `TypeError: Cannot read properties of undefined` porque
`weights` todavía no se exporta de `health.schema.ts`, y 3 de los 4 `it` del
unit de R5 (`2c27056`) fallan con `toWeightHistory is not a function`. En ambos
casos el archivo importado **sí existe** y el símbolo ausente **es el sujeto del
test** (la declaración del schema; la función pura que se está especificando),
así que no es el rojo falso por archivo inexistente que el encargo pide vigilar
—pero tampoco es una aserción evaluada. Los otros 8 R-ids fallan por aserción
genuina. Lo dejo escrito porque el precedente de #21 se fijó justo en este punto.

**NB-5 — El test de atomicidad de R4 asevera contra su propio doble, no contra
Postgres.**
`buildDbDouble` implementa un `transaction` que decide él mismo que, si el
callback rechaza, los inserts "staged" no se confirman. Así que
`expect(captured.committedInserts).toEqual([])` prueba el doble, no el rollback
de Postgres. Lo que **sí** prueba de verdad —y lo verifiqué rojo en `5033761`,
donde `transactionCalls` era 0— es que ambas escrituras ocurren dentro del
callback de `db.transaction`, que es la parte que el implementador puede
romper. La semántica de rollback real queda sin test, como en el resto del repo.

**NB-6 — El `it` de precedencia de R9 ya estaba verde en el commit rojo de R9.**
En `e216a1b` falló 1 de 2: el `family → 403`. El segundo ("un no-miembro recibe
404 antes de validar body o rol") pasó, porque el guard de R8 ya lo cubría desde
`28fe600`. No es un problema —R9 tiene su rojo genuino y la precedencia está
cubierta y además garantizada por la estructura del guard—, pero conviene saber
que el rojo de esa aserción pertenece al commit de R8.

**NB-7 — Se tocó código de #14: `vaccine.dto.ts`.**
`isIsoDate` y la expresión `new Date().toISOString().slice(0, 10)` se extrajeron
al nuevo `application/dto/iso-date.ts` (commit `8da976c`, R2 verde), y
`vaccine.dto.ts` pasó a importar `IsoDateSchema` y `todayIsoDateUtc`. Es
extracción DRY sin cambio de comportamiento: la definición original se eliminó
(no quedó duplicada) y `health-vaccines.e2e-spec.ts` más los unit de #14 siguen
verdes en mi corrida. Estrictamente está fuera del alcance declarado de #15,
pero es la alternativa correcta a duplicar el validador, y no deja huérfanos.

**NB-8 — R7 no cubre `measuredAt` con formato equivocado.**
Los 9 casos del `it.each` incluyen `'2026-02-30'` (fecha de calendario
imposible) pero ninguno con formato no-ISO (`'15/01/2026'`, `'2026-1-5'`). El
regex de `isIsoDate` lo rechaza, pero nada lo asevera.

---

## Output de `./init.sh`

Corrida única, infra caliente, exit code 0. Log completo en
`AppData/Local/Temp/claude/.../tasks/beuwtox6c.output`.

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

→ Instalando dependencias...
✅ Dependencias instaladas

→ Verificando coherencia del harness...
✅ Archivos del harness presentes
⚠️  Feature en progreso: health-weights
✅ STATUS.md sincronizado con feature_list.json

→ Build...
> backend-pet-tracker@0.0.1 build
> nest build && tsc-alias -p tsconfig.build.json
> pet-tracker-infra@0.0.1 synth
> cdk synth --quiet
✅ Build exitoso

→ Ejecutando tests...
Test Suites: 127 passed, 127 total
Tests:       901 passed, 901 total
Snapshots:   0 total
Time:        9.513 s
Ran all test suites.

Test Suites: 2 passed, 2 total
Tests:       14 passed, 14 total
Snapshots:   0 total
Time:        21.393 s
Ran all test suites.
✅ Tests pasados

→ Tests e2e...
> backend-pet-tracker@0.0.1 test:e2e
> jest --config ./test/jest-e2e.json

[Nest] ERROR [ExceptionsHandler] DrizzleQueryError: Failed query:
  insert into "pet_users" ... violates foreign key constraint
  "pet_users_user_id_users_id_fk"
  -> carrera de arranque conocida de la infra; la suite terminó verde en la
     misma ejecución, no se repitió

Test Suites: 2 skipped, 14 passed, 14 of 16 total
Tests:       6 skipped, 213 passed, 219 total
Snapshots:   0 total
Time:        58.496 s
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

  Features: 17/22 completadas | 4 pendientes

  Próxima feature:
  [#16] pet-reminders (P2)

EXIT_CODE=0
```

Comprobación previa del puerto, para dejar constancia de que los e2e no se
saltaron en silencio:

```
$ docker port pet-tracker-postgres
5432/tcp -> 0.0.0.0:5432
5432/tcp -> [::]:5432

$ grep -c "5432 sin respuesta" <log de init.sh>
0
```
