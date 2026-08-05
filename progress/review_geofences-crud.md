# review: geofences-crud
Fecha: 2026-08-05
Veredicto: APROBADO (geofences-crud, R1-R26 / C2-C7 / IDOR / núcleo puro) —
cierre a `done` BLOQUEADO por `./init.sh` no verde, causa ajena a esta
feature (ver "Bloqueante de cierre" abajo). No apruebo marcar la feature
`done` en `feature_list.json` hasta que ese bloqueante se resuelva.

## Checklist C2 — Estado coherente
- [x] Solo 1 feature in_progress (`feature_list.json`: únicamente
      `geofences-crud`/#11; confirmado con `node -e` y con el propio check
      de `init.sh`, que reporta "Feature en progreso: geofences-crud" y
      "STATUS.md sincronizado con feature_list.json")
- [x] progress/current.md describe la sesión activa (feature, plan,
      agentes lanzados) — observación menor no bloqueante: la línea
      `estado: implementer en curso` quedó desactualizada (el implementer ya
      cerró y el reviewer ya corrió); actualizar al cerrar la sesión.

## Checklist C3 — Arquitectura
- [x] domain sin imports de infrastructure: `geofence.entity.ts`,
      `geofence.errors.ts`, `geofence.repository.ts` no importan
      `@nestjs/*`, `drizzle-orm`, `zod` ni nada de `infrastructure/` —
      verificado leyendo los tres archivos completos.
- [x] repositorios/contratos en domain son interfaces puras:
      `GeofenceRepository` (domain/repositories/geofence.repository.ts) es
      una interfaz TS sin implementación; el token `GEOFENCE_REPOSITORY` se
      define ahí mismo (DI apunta hacia adentro).
- [x] application depende de interfaces, no implementaciones: los 5
      use-cases inyectan `GEOFENCE_REPOSITORY`/`GeofenceRepository` (tipo)
      y `AUDIT_LOGGER`/`AuditLogger` (tipo) — ninguno importa
      `GeofenceDrizzleRepository` ni `drizzle-orm`.
- [x] infrastructure implementa las interfaces de domain, no al revés:
      `GeofenceDrizzleRepository implements GeofenceRepository`;
      `geofences.controller.ts` y los dos mappers son el único lugar del
      módulo que conoce HTTP/Nest y el único que traduce errores de
      dominio a excepciones HTTP.
- [x] Patrón de traducción de violación única (`translateUniqueViolation`
      + `findPgError`, desenvolviendo `error.cause`) replica casi línea por
      línea `device.drizzle.repository.ts` — sin abstracción nueva
      inventada, reuso real del patrón ya establecido.

## Checklist C4 — TDD
- [x] Cada R<n> (R1-R25) tiene al menos un test que lo nombra
      explícitamente: confirmado leyendo `geofence-eval.spec.ts` completo
      (10 `describe('R16: ...')`..`describe('R25: ...')`, 19 tests) y
      `geofences.e2e-spec.ts` completo (15 `describe('R1: ...')`..
      `describe('R15: ...')`, 20 tests). R26 no lleva test automatizado por
      diseño (regla de no-regresión, mismo criterio que R23 de
      trips-activity) — verificado por mí de forma independiente más abajo.
- [x] Historial de commits no es un solo commit gigante: 2 commits `feat`
      con alcance separado (`aba0ff9` = núcleo puro R16-R25 con su propio
      spec; `23fa1fe` = módulo CRUD R1-R15 con su propio e2e spec) + 2
      commits `docs` de trazabilidad/documentación (`080f59d`, `34b2ec9`).
      Mismo patrón de granularidad que el precedente ya aprobado de
      `trips-activity` (#10, PR #17 mergeado): commits `feat` que agrupan
      test+implementación por bloque de requisitos, no fila por fila.

## Checklist C5 — Trazabilidad
- [x] `specs/geofences-crud/traceability.md` existe, las 26 filas están
      completas — **cero** filas "pendiente" (confirmado leyendo el
      archivo íntegro).
- [x] Cada requisito tiene test y commit registrados; verifiqué que los 4
      hashes citados (`aba0ff9`, `23fa1fe`, `080f59d`, `34b2ec9`) existen en
      `git log` y que `git show --stat` de cada uno toca exactamente los
      archivos que su fila/mensaje declara.
- [x] Commits siguen `feat(<scope>): <desc> (R-ids)` / `docs(<scope>): ...`
      — formato consistente con el resto del repo.

## Checklist C6 — Spec aprobada
- [x] `specs/geofences-crud/requirements.md` tiene `status: approved` en
      el frontmatter.
- [x] Casilla "Aprobado por humano" marcada: `(fecha: 2026-08-05, D1-D5
      aceptadas como propone la spec)`.
- [x] Ningún requisito fue tocado después de la aprobación sin re-gate —
      `git log -p` de los commits del implementer no toca
      `requirements.md` (solo `traceability.md`, que no es el documento
      gateado).

## Checklist C7 — Sin código huérfano
- [ ] N/A — esta feature no reemplaza ni vuelve obsoleto ningún
      componente/módulo existente. Es un módulo net-new
      (`src/modules/geofences/**`). Confirmado con
      `git diff main --name-only -- src/modules/pets/ src/modules/devices/
      src/audit/` → sin salida (cero cambios): nada fue tocado, mucho menos
      reemplazado.

## Verificación de requisitos (R1-R26) contra el código real

Leí completos y verifiqué línea por línea contra el texto EARS de cada R-id:
`geofence.entity.ts`, `geofence.errors.ts`, `geofence.repository.ts`,
`create-geofence.dto.ts`, `geofences.constants.ts`, los 5 use-cases,
`geofences.controller.ts`, los 2 mappers, `geofence.drizzle.repository.ts`,
`geofences.schema.ts`, la migración `0006_violet_cammi.sql`,
`geofence-eval.ts` y `constants.ts` (diff completo).

- **R1/D5 (migración)**: el SQL generado (`0006_violet_cammi.sql`) crea
  `geofences` con exactamente las columnas/tipos/defaults de R1, CHECK
  `geofences_type_check` restringido a `('safe_circle')`, FK
  `pet_id → pets.id ON DELETE CASCADE`, índice único
  `geofences_pet_id_name_idx` sobre `(pet_id, name)` e índice btree
  `geofences_pet_id_idx` — coincide con el nombre de constraint que
  `translateUniqueViolation` compara (`NAME_UNIQUE_CONSTRAINT`), así que la
  traducción 23505→409 realmente dispara. No toca ninguna otra tabla.
- **R2-R3 (autorización, D4)**: guard de clase
  `@UseGuards(PetAccessGuard)` + `@RequirePetRole('owner')` solo en
  POST/PATCH/DELETE, GET sin decorador — igual que el patrón de
  `pet-device.controller.ts` de #7. `geofences.e2e-spec.ts::R2` prueba las
  **cinco** rutas contra mascota ajena/inexistente/malformada y compara
  byte a byte contra el 404 baseline del guard; `::R3` prueba 403 en las
  tres mutaciones y 200 en ambos GET para un rol `family`, y confirma que
  ninguno de los 403 escribió fila.
- **R4-R7 (crear)**: `CreateGeofenceUseCase` hace `countByPet` →
  `findByNameAndPet` → `create` → auditoría solo si el insert tuvo éxito
  (R4). Límites de R5 (`radiusM [20,2000]`, lat/lng, `name` 1-120,
  `type` literal `'safe_circle'`, `.strict()`) en `CreateGeofenceSchema`,
  probados uno por uno en `::R5`. Tope de 5 cuenta activas+inactivas
  (`countByPet` sin filtro de `active`) — `::R6` crea 4 activas + 1
  inactiva y confirma que la sexta es `400 MAX_GEOFENCES_REACHED` con 5
  filas persistidas, nunca 6. `::R7` prueba el 409 secuencial y además dos
  `POST` concurrentes reales (`Promise.all`) que dejan exactamente un `201`
  y un `409` (nunca dos `201`, nunca un `500`) — el candado real es el
  índice único, no el `COUNT` (carrera del tope de 5 documentada como
  `ponytail` en el use case, consistente con D5).
- **R8-R9 (leer, IDOR)**: `ListGeofencesUseCase`/`GetGeofenceUseCase` sin
  lógica propia más allá de delegar al repo; `findAllByPet` ordena por
  `created_at asc`. `::R8` prueba `[]` para mascota sin geocercas (nunca
  404) y el orden con 2 filas. `::R9` prueba el shape exacto de 11 claves,
  404 para id inexistente/malformado, **y** el caso IDOR pedido
  explícitamente por el leader: geocerca de la mascota B vista a través de
  la mascota A **del mismo owner** → 404 `GEOFENCE_NOT_FOUND` (aislamiento
  entre mascotas, no solo entre usuarios). El mismo patrón de aislamiento
  se repite en `::R12` (PATCH) y `::R15` (DELETE).
- **R10-R13 (actualizar)**: `UpdateGeofenceUseCase` valida UUID → busca →
  si `Object.keys(dto).length === 0` retorna `existing` sin escribir ni
  auditar (R13, no-op) → si no, delega `update()` y audita solo nombres de
  campo (`fields: [...]`, nunca valores, R10). `GeofenceDrizzleRepository
  .update()` separa `centerLat/centerLng/radiusM` del resto de columnas y
  solo si alguno de los tres viene presente hace un `SELECT` extra para
  mergear el `geometry` parcial contra el existente antes del `UPDATE` —
  lógica correcta y acotada a ese caso; el resto de columnas se actualiza
  directo. `::R10` prueba el merge (cambia `name`+`radiusM`, confirma que
  `centerLat/centerLng` no cambiaron). `::R11` prueba 400 para radio fuera
  de rango, lat fuera de rango y la clave `type` (rechazada por
  `.strict()`), y confirma que `updated_at` no se movió. `::R13` prueba
  `{}` → 200 sin auditoría nueva, y confirma que el 404 de R12 precede al
  no-op cuando el id no existe.
- **R14-R15 (borrar)**: hard delete + auditoría `geofence.delete`;
  `::R14` confirma 204 sin body, fila eliminada, una entrada de auditoría;
  `::R15` confirma los tres casos 404 (inexistente/malformado/ajeno) sin
  dejar auditoría y sin borrar la geocerca de la mascota B.
- **R16-R25 (núcleo puro)**: releí `geofence-eval.ts` completo contra cada
  enunciado EARS. `isInside` círculo usa `haversineMeters(...) <=
  radiusM` (borde inclusive, R16); polígono usa ray-casting par-impar
  estándar (R17). `evaluate`: `unknown` calcula `isInside` sin histéresis y
  nunca emite evento (R18); `inside→outside` exige **ambas** condiciones
  (`distanceM >= radius×1.1` Y accuracy aceptable ≤50m o indefinida) para
  emitir `exit` (R19); falta cualquiera de las dos y se queda `inside` sin
  evento (R20, R21); `low_accuracy` corta-circuita **antes** de calcular
  distancia y devuelve `previous` completo e idéntico, incluido
  `updatedAt` (R22); `outside→outside` no re-emite (R23);
  `outside→inside` solo exige `distanceM <= radius×0.9`, sin condición de
  accuracy — asimetría deliberada de D3 (R24). `nowMs` siempre viene del
  caller, cero `Date.now()`/`new Date()` sin argumento en el archivo (R25).
  `geofence-eval.spec.ts` verifica todo lo anterior con valores concretos
  **y además** verifica la pureza por inspección de imports (regex sobre
  el propio source, sin comentarios) y el determinismo (misma llamada dos
  veces, mismo resultado) — no son aserciones triviales, ejecutan la
  garantía real de R25.
- **R26 (no regresión)**: ver sección de no-regresión más abajo — verificado
  por mí de forma independiente, no solo a partir del reporte.

## Verificación independiente de no-regresión (R26)

`git diff main --name-only` (corrido por mí) devuelve exactamente:
`.gitignore`, `.mcp.json`, `STATUS.md` (ajenos, de sesiones previas),
`backend-pet-tracker/src/app.module.ts` (+1 línea import/registro),
`backend-pet-tracker/src/db/migrations/0006_violet_cammi.sql` + `meta/`,
`backend-pet-tracker/src/db/schema/geofences.schema.ts`,
`backend-pet-tracker/src/db/schema/index.ts` (+1 línea re-export),
`backend-pet-tracker/src/modules/geofences/**` (14 archivos, módulo
nuevo), `backend-pet-tracker/src/pipeline/constants.ts` (+15 líneas, solo
adición — diff confirmado, ninguna línea existente tocada),
`backend-pet-tracker/src/pipeline/geofence-eval.{ts,spec.ts}`,
`backend-pet-tracker/test/geofences.e2e-spec.ts`, `docs/data-model.md`,
`docs/wialon-module.md`, `feature_list.json`, `progress/**`,
`specs/geofences-crud/**`. Exactamente la lista que permite R26, ni un
archivo de más.

- `git diff main --name-only -- backend-pet-tracker/src/modules/activity/`
  → **sin salida**. Cero cambios en `activity/`, confirmado.
- `git diff main -- backend-pet-tracker/src/pipeline/constants.ts` → los 5
  exports preexistentes (`SUSPECT_JUMP_SPEED_KMH`,
  `LOW_ACCURACY_MAX_ACCURACY_M`, `LOW_ACCURACY_MIN_SATS`,
  `BATTERY_LOW_THRESHOLD_PCT`, `FLAG_SUSPECT_JUMP`, `FLAG_LOW_ACCURACY` —
  y los 7 `TRIP_*`) no aparecen en el diff: solo hay líneas `+`, cero `-`.
  Confirma la promesa de R26 ("solo añadiendo").
- `git diff main -- backend-pet-tracker/src/app.module.ts` → 2 líneas
  añadidas (import + registro de `GeofencesModule`), cero líneas borradas.
- `git diff main -- backend-pet-tracker/package.json` → sin salida. Cero
  dependencias nuevas.
- `git diff main --name-only -- backend-pet-tracker/src/modules/pets/
  backend-pet-tracker/src/modules/devices/ backend-pet-tracker/src/audit/`
  → sin salida. `PetAccessGuard`, `RequirePetRole`, `AuditLogger`/
  `AUDIT_LOGGER` se reutilizan tal cual, sin tocarlos.

## Verificación independiente adicional pedida por el leader

Corrí yo mismo (no acepté el reporte del implementer como válido):

1. **`./init.sh` completo** (ver output íntegro abajo). Confirma
   exactamente lo que reporta el implementer: env/tools/harness OK, 1
   feature in_progress, `STATUS.md` sincronizado, **build exitoso**, y en
   el paso de tests, **exactamente 1 test falla de 642**:
   `src/modules/activity/infrastructure/repositories/activity.drizzle.store.spec.ts`
   › `R10: la migracion 0005 crea unicamente activity_daily › la 0005 es
   la unica migracion nueva y solo crea esa tabla`, con el mensaje exacto
   `Expected length: 0, Received length: 1, Received array:
   ["0006_violet_cammi.sql"]`. `init.sh` usa `set -e`: al fallar `jest` en
   el paso de tests, el script termina ahí mismo con **exit code 1**
   (confirmado explícitamente) — **nunca llega a ejecutar los pasos de
   Lint ni Typecheck** en esa corrida. Precisión sobre el reporte del
   implementer: presenta build/lint/typecheck/tests como un bloque
   verificado junto, pero estructuralmente una sola corrida de `init.sh`
   no puede haber producido esa evidencia de lint/typecheck — deben haberse
   corrido aparte. Por eso los verifiqué yo por separado en el punto 2.
2. **Lint y typecheck en aislamiento**, con los comandos exactos de
   `init.config.sh`: `pnpm -C backend-pet-tracker run lint` → exit 0, cero
   output (sin errores ni warnings). `pnpm -C backend-pet-tracker exec tsc
   --noEmit` → exit 0, cero output. Ambos confirmados limpios de forma
   independiente.
3. **`geofence-eval.spec.ts` en aislamiento**
   (`pnpm test -- geofence-eval.spec`): `Test Suites: 1 passed, 1 total`,
   `Tests: 19 passed, 19 total`, 0.966s. Coincide con el reporte.
4. **`geofences.e2e-spec.ts` en aislamiento**
   (`pnpm run test:e2e -- geofences`): `Test Suites: 1 passed, 1 total`,
   `Tests: 20 passed, 20 total`, 6.467s. Coincide con el reporte.
5. **`media.e2e-spec.ts` en aislamiento, sin la suite de geofences en
   juego** (`pnpm run test:e2e -- media`): `1 failed, 10 passed, 11
   total`. El único fallo es
   `R8: el bucket nunca es publico — GET directo sin firma responde 403 ›
   un GET sin parametros de firma sobre el objeto responde 403`, `Expected:
   403, Received: 200`. Confirmé en `STATUS.md` (líneas ~294-301, cierre
   original de `pet-photos-s3` #6) que esto es **exactamente** la
   limitación ya documentada y aceptada humanamente: "LocalStack Community
   4.14 no aplica `PutPublicAccessBlock`/ACLs/bucket-policy en el plano de
   datos de S3 — un `GET` anónimo... responde `200`, no `403`... Decisión
   humana: aceptado como limitación documentada, no bloquea el cierre."
   Mismo fallo, mismo módulo (`src/modules/media/**`, sin diff en esta
   rama), reproducido sin que la suite de geofences corra en absoluto —
   confirmado no relacionado con `geofences-crud`.

## Bloqueante de cierre: `init.sh` no verde (causa raíz y recomendación)

**Causa raíz.** `activity.drizzle.store.spec.ts:130-135` (feature
`trips-activity` #10, ya `done`/mergeada — PR #17, commit `850ba74`)
contiene:

```ts
it('la 0005 es la unica migracion nueva y solo crea esa tabla', () => {
  const files = migrationFiles();
  const added = files.filter((file) => file.startsWith('0005_'));
  expect(added).toHaveLength(1);
  expect(files.filter((file) => file > '0005_zzzz')).toHaveLength(0);
  ...
```

La segunda aserción no verifica nada sobre el contenido de la migración
0005 — verifica una propiedad **global y temporal** del directorio
completo de migraciones ("no existe ningún archivo alfabéticamente
posterior a 0005"). Esa propiedad es verdadera solo hasta que exista una
migración 0006, y deja de serlo con la primera migración que cualquier
feature futura añada — 0006 de `geofences-crud` hoy, o el 0007 que
previsiblemente añadirá `alerts-engine` (#12, que sí crea `alert_events`
según su propia spec) mañana si esto no se corrige. No es una regresión de
`geofences-crud`: la migración 0006 es exactamente lo que pide R1 de esta
feature (legítima, obligatoria, revisada arriba), y `R26`/las reglas del
leader prohíben expresamente al implementer tocar
`src/modules/activity/**`.

**Contraste con el patrón ya establecido en el mismo repo.** Los dos
archivos hermanos en el mismo directorio,
`backend-pet-tracker/src/db/schema/devices.schema.spec.ts` (líneas 8-24,
180-202) y `pets.schema.spec.ts` (mismo patrón), resuelven el mismo
problema — "confirmar que mi migración no toca otras tablas" — sin asumir
ser la última del directorio: buscan por **contenido** ("el `.sql` que
contiene `CREATE TABLE "devices"`") y aseran solo sobre el SQL de esa
migración propia (`expect(sql).not.toContain('CREATE TABLE "pets"')`,
etc.). Ese patrón es inmune a que aparezcan migraciones posteriores,
porque no depende de cuál es la última — verifiqué ambos archivos
completos y confirmo que el patrón que sugiere el implementer en su
reporte es real y ya está en uso, no una invención.

**Recomendación: (a).** Tratarlo como corrección de una línea/pocas líneas
en `src/modules/activity/infrastructure/repositories/activity.drizzle.store.spec.ts`,
fuera del alcance de esta feature — no como código de `geofences-crud`.
Concretamente: reemplazar la aserción
`expect(files.filter((file) => file > '0005_zzzz')).toHaveLength(0)` por
una que sea local a la migración 0005 (mismo criterio que
`devices.schema.spec.ts`): ubicar el archivo por contenido
(`migrationSql(file).includes('CREATE TABLE "activity_daily"')`) y
verificar que ese SQL no crea/altera ninguna otra tabla, en vez de
verificar que ningún archivo posterior existe. Motivos para (a) sobre
cualquier alternativa:
- Es un cambio de una aserción en un archivo de test de una feature ya
  cerrada y mergeada (#10) — no reabre su spec ni su código de aplicación,
  y no requiere que `geofences-crud` toque `src/modules/activity/**`
  (seguiría prohibido para el implementer de esta feature).
- El patrón de reemplazo ya existe en el mismo repo, revisado y aprobado
  dos veces (`devices.schema.spec.ts`, `pets.schema.spec.ts`) — cero
  diseño nuevo, cero riesgo de introducir un patrón no probado.
- Es estructural, no cosmético: sin este cambio, **la primera migración de
  la siguiente feature que toque `src/db/migrations/` vuelve a romper
  `init.sh`** (candidata inmediata: `alerts-engine` #12, que crea
  `alert_events`) — arreglarlo ahora evita repetir este mismo bloqueante
  feature tras feature indefinidamente.
- No es aceptar deuda documentada (a diferencia de la flakiness de
  LocalStack en `media.e2e-spec.ts`, que sí es una limitación de
  infraestructura sin fix de código razonable): esto sí tiene un fix de
  código trivial y ya patentado en el propio repo.

No descarté (b) ni otras por no tener mérito — simplemente (a) es
estrictamente más barato, más seguro (patrón ya probado) y evita
recurrencia, así que no encuentro razón para preferir otra opción.

## Output de `./init.sh`

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
Lockfile is up to date, resolution step is skipped
Already up to date
Done in 2.2s using pnpm v10.33.4
✅ Dependencias instaladas

→ Verificando coherencia del harness...
✅ Archivos del harness presentes
⚠️  Feature en progreso: geofences-crud
✅ STATUS.md sincronizado con feature_list.json

→ Build...
> backend-pet-tracker@0.0.1 build
> nest build && tsc-alias -p tsconfig.build.json
✅ Build exitoso

→ Ejecutando tests...
> backend-pet-tracker@0.0.1 test
> jest "--passWithNoTests"

FAIL src/modules/activity/infrastructure/repositories/activity.drizzle.store.spec.ts
  ● R10: la migracion 0005 crea unicamente activity_daily › la 0005 es la unica migracion nueva y solo crea esa tabla

    expect(received).toHaveLength(expected)

    Expected length: 0
    Received length: 1
    Received array:  ["0006_violet_cammi.sql"]

      at Object.<anonymous> (modules/activity/infrastructure/repositories/activity.drizzle.store.spec.ts:135:56)

Test Suites: 1 failed, 91 passed, 92 total
Tests:       1 failed, 641 passed, 642 total
Snapshots:   0 total
Time:        24.921 s
Ran all test suites.
 ELIFECYCLE  Test failed. See above for more details.

[script termina aqui — set -e, exit code 1, confirmado con "echo $?".
Lint y Typecheck NO se ejecutaron en esta corrida; verificados aparte,
ver "Verificación independiente adicional" punto 2 — ambos limpios.]
```

## Conclusión

`geofences-crud` (R1-R26, C2-C6, IDOR, núcleo puro determinista) está
**aprobado** por mérito propio: código, tests y trazabilidad verificados
de forma independiente, no solo leídos del reporte. `./init.sh` no está
verde, y por regla dura no recomiendo marcar la feature `done` en
`feature_list.json` todavía — pero la causa es un test preexistente y
estructuralmente frágil de una feature distinta ya cerrada (#10), no un
defecto de esta feature. Recomendación: opción (a) — corregir esa
aserción (archivo y reemplazo sugerido arriba) antes de cerrar, luego
volver a correr `init.sh` para confirmar verde y recién ahí marcar
`done`/abrir el PR.
