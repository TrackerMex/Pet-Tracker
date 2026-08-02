# review: positions-api
Fecha: 2026-08-02
Veredicto: APROBADO

Feature #9, branch `feature/9-positions-api` (12 commits sobre `main`,
`c5ffed7..72d8c94`, árbol limpio). Verificación independiente: el reviewer
ejecutó `./init.sh` y `pnpm run test:e2e` contra Docker real (Postgres 17 +
LocalStack) él mismo — no se aceptó el output del reporte del implementer como
evidencia. Los 16 requisitos se contrastaron contra el código y contra los
tests citados, no solo contra la tabla de trazabilidad.

## Checklist C2 — Estado coherente
- [x] Solo 1 feature `in_progress` — `feature_list.json` línea 147, única
      ocurrencia de `"status": "in_progress"` en todo el archivo; 7 `done`
- [x] `progress/current.md` actualizado — describe la sesión activa de #9
      (feature, inicio, agentes lanzados `spec_author` + `implementer`)
- [x] `progress/history.md` intacto — la sesión aún no está cerrada; el volcado
      es del leader al cierre, no del implementer

## Checklist C3 — Arquitectura
- [x] `domain/` sin imports de infrastructure — los 8 archivos de
      `src/modules/positions/domain/**` solo importan `positions.constants.ts`,
      `./errors/position.errors` y tipos del propio domain. Cero `@nestjs/*`,
      cero `@aws-sdk/*`, cero `drizzle-orm`, cero `@/db/`
- [x] Repositorios/contratos en domain son interfaces puras —
      `LastPositionReader` y `PositionHistoryReader` son `interface` + token
      `Symbol`, sin implementación
- [x] `application/` depende de interfaces, no de implementaciones —
      `GetLastPositionUseCase` inyecta `LAST_POSITION_READER`,
      `ListPositionsUseCase` inyecta `POSITION_HISTORY_READER`; ninguno
      referencia `LastPositionDrizzleReader` ni `PositionHistoryDynamoReader`.
      Verificado por grep: `application/**` no importa `@aws-sdk`, `drizzle-orm`
      ni `@/db/`
- [x] `infrastructure/` implementa las interfaces de domain, no al revés —
      ambos readers llevan `implements <Puerto>`; el filtro de flags (regla de
      negocio) vive en el caso de uso, no en un `FilterExpression` de DynamoDB,
      y hay un test que lo fija (`position-history.dynamo.reader.spec.ts`:
      "no usa FilterExpression")
- [x] Desviación de `design.md` justificada — `positions.constants.ts` se movió
      de `infrastructure/` a la raíz del módulo porque `domain/cursor.ts` y
      `application/list-positions.use-case.ts` lo consumen; dejarlo en
      `infrastructure` habría invertido la regla de dependencia. La razón está
      documentada en la cabecera del archivo. Correcto.

## Checklist C4 — TDD
- [x] Cada `R<n>` tiene al menos un test que lo nombra — R1-R5 y R7-R15
      tienen `describe('R<n>: ...')` en archivos reales (30 describes
      verificados). R6 y R16 **no** llevan test por mandato explícito de la
      propia spec aprobada ("se verifica como evidencia manual documentada" /
      "verificable con `git diff main --stat`"), no por omisión del implementer
- [x] Los tests cubren de verdad lo que el requisito dice, no solo el nombre —
      muestreo profundo: R4 replica los dos casos literales de la spec
      (`ts = now − 90 000` → 90; `ts = now + 5 000` → 0); R9 cubre 25 h → error
      **y** 24 h exactas → aceptado; R10 asserta la `KeyConditionExpression`
      completa, `ScanIndexForward: true`, `Limit = POSITIONS_PAGE_LIMIT` y la
      ausencia de `ScanCommand`; R12 cubre los tres puntos sembrados
      (limpio/`low_accuracy`/`suspect_jump`) **más** el caso de ambos flags;
      R14 cubre los dos tests obligatorios de la spec (cursor `"???"` → 400 y
      cursor de A reenviado en la ruta de B con usuario miembro de ambas → 400
      y cero items de A, incluido `expect(...).not.toContain(pagedBaseTs)`)
- [x] Ejecución por nombre para probar que no son describes decorativos:
      `jest -t "R4:"` → 50 passed, `-t "R12:"` → 19 passed, `-t "R14:"` → 26 passed
- [x] Historial de commits granular, no todo junto — 10 commits `feat`/`test`
      por requisito; `git show --stat` muestra cada commit con su `.spec.ts`
      junto a la implementación que cubre (mismo patrón aceptado en #7 y #8).
      Los e2e llegan en un commit `test(...)` posterior (`d862b62`), desviación
      declarada en el impl report e idéntica a la aceptada en #8

## Checklist C5 — Trazabilidad
- [x] `traceability.md` sin filas "pendiente" — 16/16 filas con test y commit;
      las dos únicas apariciones de la palabra son el comentario del frontmatter
      y la regla al pie del documento
- [x] Cada test citado **existe** y nombra su R-id — se comprobó archivo por
      archivo; ninguna fila cita un test inexistente ni un nombre de `describe`
      que no coincida con el real
- [x] Los 12 hashes citados existen en el branch y sus mensajes coinciden
      literalmente con lo que la tabla declara
- [x] Commits siguen el formato `feat(<scope>): <desc> (R-ids)` de
      `docs/conventions.md` §Commits — los 12 con scope `positions-api`
      (10 `feat`/`test` por requisito + 2 `docs` de spec y cierre)

## Checklist C6 — Spec aprobada
- [x] `requirements.md` con `status: approved` en el frontmatter
- [x] Casilla "Aprobado por humano" marcada con fecha (2026-08-02), incluida la
      resolución explícita de D1-D6 aprobadas íntegras
- [x] Ningún requisito modificado tras la aprobación —
      `git log --all -- specs/positions-api/requirements.md` devuelve **un solo
      commit** (`c33deb2`): el archivo no se ha tocado desde el gate
- [x] `design.md`, `tasks.md` y `traceability.md` con frontmatter `approved`
      (la NB1 del review de #8 no se repite aquí); `tasks.md` 48/48 marcadas

## Checklist C7 — Sin código huérfano
- [x] N/A — esta feature no reemplaza nada existente. Es un módulo nuevo de
      solo lectura: `git diff main --diff-filter=D --name-only` está vacío
      (cero archivos borrados) y ni la spec ni el impl report mencionan
      reemplazar, deprecar o dejar obsoleto ningún componente
- [x] Sin restos de la corrida de evidencia — `scripts/r6-evidence.tmp.ts`
      **no** quedó commiteado (`git log --all -- <ruta>` vacío), no está en
      disco (`scripts/` solo tiene `provision-local.ts` y `seed-devices.ts`)
      y no está encubierto por `.gitignore` (`git check-ignore` no lo reclama)

---

## Verificación independiente ejecutada

```bash
docker compose ps              # postgres 17 + localstack 4.14 Up (healthy)
./init.sh                      # exit 0
cd backend-pet-tracker
pnpm run provision:local       # idempotente, ok
pnpm run test:e2e              # exit 0
```

- Unit: **482/482 passed** (77 suites) — coincide con el impl report
  (397 previos de #8 + 85 nuevos). Lint y typecheck verdes.
- e2e: **84/84 passed** (7 suites, 37.4 s) — las 58 pruebas previas de
  #2/#5/#7/#8 no se rompen. Cero regresiones.
- El ruido de FK `pet_users_user_id_users_id_fk` en el log de e2e es el test
  **preexistente** `test/pets.e2e-spec.ts` (provoca el fallo a propósito con
  `expect(response.status).toBeGreaterThanOrEqual(500)`), introducido en
  `b626327`, anterior a este branch. No es regresión de #9, como declaraba el
  implementer.

## R6 — evidencia manual: verificada y coherente

La evidencia pegada en `progress/impl_positions-api.md` es aritméticamente
consistente, no un número puesto a mano:

- `ts: 1785702900000` → `2026-08-02T20:35:00.000Z`, que es exactamente el
  `device_ts_iso` declarado.
- `staleSeconds` recomputado con la fórmula de R4 contra el `requested_at`
  declarado (`2026-08-02T20:35:47.689Z`) da **47**, el valor reportado.
- `47 < 120`, `http_status: 200`, `lat: 19.4264…` / `lng: −99.1178…` no nulos
  (zona `SIM_HOME_*` del simulador), y el body trae las 6 claves de R3 y
  ninguna más.
- El log de arranque muestra las dos rutas mapeadas y el scheduler real
  (`poller 60000 ms, consumer 15000 ms`), coherente con una cadena
  simulador → poller → SQS → consumidor → Postgres y con los 150 s de espera.

**R6: OK.**

## R16 — no regresión: verificada por el reviewer

`git diff main --name-only` = 34 archivos (el report decía 33; la diferencia es
`progress/impl_positions-api.md`, añadido por el commit de cierre posterior a
la captura, y el propio report lo advierte). Ámbito real, todo dentro de lo
permitido salvo el hallazgo NB1:

- `src/modules/positions/**` — 26 archivos (módulo nuevo)
- `src/app.module.ts` — **+2 líneas exactas**: el `import` y el registro de
  `PositionsModule` en el array `imports`. Nada más
- `test/positions.e2e-spec.ts` — 1 archivo nuevo
- `specs/positions-api/**` (4), `progress/**` (2)
- `feature_list.json` — ver NB1

Rutas prohibidas comprobadas una a una con `git diff main --name-only --`:
`drizzle*`, `src/db/**`, `src/workers/**`, `src/pipeline/**`,
`src/modules/pets/**`, `src/modules/devices/**`, `src/aws/**`, `package.json`,
`pnpm-lock.yaml`, `.env.example`, `docs/**` → **salida vacía**. Cero migraciones
Drizzle, cero variables de entorno nuevas, cero dependencias nuevas. El contrato
de `GET /v1/pets` y `GET /v1/pets/:petId` está intacto por construcción.

**R16: OK**, con NB1 declarado.

## Contrato de #5 intacto (R1, R2)

- `src/modules/pets/**` no tiene ni una línea de diff contra `main`:
  `PetAccessGuard` se **reutiliza sin modificar**.
- `positions.module.ts` importa `PetsModule`; el controller declara
  `@UseGuards(PetAccessGuard)` a nivel de clase y **ningún** `@RequirePetRole`
  (verificado por reflexión sobre `PET_ROLES_KEY` en clase y en ambos handlers).
- El módulo no declara guard, decorador ni consulta de membresía propios: hay un
  test que lo fija por inspección del fuente (`not.toMatch(/pet_users|petUsers|findMembership/)`).
- El `petId` sale **siempre** de `request.petMembership.petId`, en las dos rutas.
  El controller no usa `@Param()` ni `@Body()` — comprobado por lectura y por un
  test que lo asserta sobre el código fuente.
- e2e real: usuario sin membresía → **404** en las dos rutas; `:petId` =
  `not-a-uuid` → **404** en las dos; sin token → **401** en las dos.

## Seguridad y calidad

- **Cursor opaco sin fuga de datos internos**: el sobre lleva `{v, p, q, k}` y
  nada más; hay un test que asserta que la `pk` **no** se serializa
  (`JSON.stringify(envelope).not.toContain('PET#')`) y que las claves son
  exactamente `k, p, q, v`. La `pk` de la `ExclusiveStartKey` se reconstruye
  siempre desde el `petId` autorizado, tanto en `list-positions.use-case.ts`
  (`petId: input.petId`) como en `position-history.dynamo.reader.ts`
  (`const partitionKey = \`PET#${query.petId}\``) — el cursor solo mueve el
  arranque **dentro** de la partición ya autorizada, exactamente lo que exige
  D3. El cursor se valida **antes** de cualquier `Query` (comprobado con
  `expect(calls).toHaveLength(0)` en los 4 casos de rechazo).
- **Sin secretos en código** y **sin `process.env` directo**: grep sobre todo el
  módulo devuelve cero ocurrencias de `process.env` y cero literales de
  credencial. La configuración llega por DI (`DYNAMODB_CLIENT` de `AwsModule`,
  `DRIZZLE` de `DrizzleModule`).
- **Códigos de error 400 según la spec**: `INVALID_RANGE`, `RANGE_TOO_LARGE` e
  `INVALID_CURSOR` en `position-error.mapper.ts`, con el body
  `{statusCode, code, message}`; los tres verificados en e2e real contra la
  respuesta HTTP, no solo en unit.
- **Sin `Scan`**, sin `FilterExpression`, `Limit` fijo y no configurable por el
  cliente (`?limit=` es 400 por el `strictObject` de zod).
- Sin `console.log`, `TODO`, `FIXME`, `.only()` ni `.skip()` en el código nuevo.

## Observaciones

**Bloqueantes: ninguna.**

**No bloqueantes (3):**

- **NB1 — `feature_list.json` `pending` → `in_progress` (media, aceptable).**
  Diff exacto verificado: una sola línea, feature #9,
  `"status": "pending"` → `"in_progress"`. Nada más en el archivo.
  **Dictamen: bookkeeping aceptable, no es violación de la regla.** La regla
  dura de `CLAUDE.md` prohíbe *marcar features como `done`*, y `AGENTS.md` §6
  **exige** justamente esta transición tras el gate humano ("Cambia su status a
  `in_progress` solo tras el gate humano"). El impl report declara que la hizo
  el leader, no el implementer, y el contenido del diff es consistente con eso
  (un cambio de estado del ciclo SDD, no código ni contrato). Cae fuera de la
  lista literal de R16, y el implementer hizo lo correcto reportándolo en vez de
  esconderlo. `done` sigue sin marcarse, como corresponde.
- **NB2 — la paginación por defecto rompe el cursor si el cliente no repite
  `from`/`to` (baja).** La huella `q` se calcula sobre `fromMs`/`toMs` ya
  resueltos, y con `to` ausente `toMs = now`, que cambia en cada petición: un
  cliente que llame `GET .../positions` sin parámetros y luego siga el
  `nextCursor` sin repetir `from`/`to` recibe `400 INVALID_CURSOR`. **No es
  incumplimiento**: R13 condiciona explícitamente la continuación a que el
  cliente repita "los mismos `from`/`to`/`includeSuspect`", y el e2e de R13
  pagina así. Es una trampa de DX que conviene dejar escrita en el contrato de
  la API antes de que el plan 006 consuma la ruta.
- **NB3 — `graphify-out/graph.json` desactualizado (baja).** El grafo no conoce
  el módulo nuevo (`grep "modules/positions" graphify-out/graph.json` → 0
  resultados), y `CLAUDE.md` pide `graphify update .` tras modificar código.
  `graphify-out/` está en `.gitignore`, así que es higiene local y no afecta al
  diff ni al PR; conviene refrescarlo al cerrar la sesión.

Nota menor sin severidad: en `position-response.mapper.ts`, `numberOr(value, 0)`
degrada un `sk`/`lat`/`lng` ausente o no numérico a `0` en vez de señalar la
corrupción. En la práctica no se alcanza — #8 valida y marca los puntos `(0,0)`
antes de escribir, y hay tests que fijan el comportamiento de los opcionales —
pero es el único punto del módulo donde un dato corrupto pasaría inadvertido.
No amerita cambio en esta feature.

## Output de ./init.sh

```
(exit code 0)

→ Build...
✅ Build exitoso

→ Ejecutando tests...
Test Suites: 77 passed, 77 total
Tests:       482 passed, 482 total
Snapshots:   0 total
Time:        9.268 s
✅ Tests pasados

→ Lint...
✅ Lint sin errores

→ Typecheck...
✅ Typecheck sin errores

══════════════════════════════════════════
✅ Todo verde. Listo para trabajar.

  Features: 7/18 completadas | 10 pendientes
```

## Output de pnpm run test:e2e (reviewer, contra Docker real)

```
Test Suites: 7 passed, 7 total
Tests:       84 passed, 84 total
Snapshots:   0 total
Time:        37.393 s, estimated 40 s
Ran all test suites.
```
