# impl: geofences-crud
Fecha: 2026-08-05

## Archivos creados

- `backend-pet-tracker/src/pipeline/geofence-eval.ts` — nucleo puro: `isInside` (circulo haversine + poligono ray-casting), `evaluate` (maquina de estados con histeresis enter/exit). Sin imports de `@nestjs/*`, `@aws-sdk/*`, `drizzle-orm`, `zod` ni `src/modules/**` (solo `./geo`, `./constants`, `./types`).
- `backend-pet-tracker/src/pipeline/geofence-eval.spec.ts` — 19 tests, uno o mas por R16-R25, incluida verificacion estatica de imports/pureza y un test de determinismo (dos invocaciones identicas devuelven el mismo output).
- `backend-pet-tracker/src/db/schema/geofences.schema.ts` — tabla `geofences` (R1): `type` CHECK `('safe_circle')`, `geometry`/`geofence_state` jsonb tipados con `.$type<>()`, unico `(pet_id, name)`, btree `pet_id`.
- `backend-pet-tracker/src/db/migrations/0006_violet_cammi.sql` + `meta/0006_snapshot.json` (generados con `pnpm run db:generate`, aplicados localmente con `drizzle-kit migrate`) — unica migracion nueva, verificada contra Postgres real (columnas, defaults, indices).
- `backend-pet-tracker/src/modules/geofences/**` — modulo nuevo, 3 capas:
  - `domain/entities/geofence.entity.ts`, `domain/errors/geofence.errors.ts` (`MaxGeofencesReachedError`, `GeofenceNameTakenError`, `GeofenceNotFoundError`), `domain/repositories/geofence.repository.ts`.
  - `application/dto/create-geofence.dto.ts` (`CreateGeofenceSchema` + `UpdateGeofenceSchema`, `z.strictObject`-equivalente via `.strict()`), `application/use-cases/{create,list,get,update,delete}-geofence.use-case.ts`.
  - `infrastructure/geofences.controller.ts`, `infrastructure/mappers/{geofence-error,geofence-response}.mapper.ts`, `infrastructure/repositories/geofence.drizzle.repository.ts`.
  - `geofences.constants.ts` (`GEOFENCE_MAX_PER_PET = 5`), `geofences.module.ts`.
- `backend-pet-tracker/test/geofences.e2e-spec.ts` — 20 tests contra Postgres real, uno o mas por R1-R15 (guard, roles, CRUD feliz/invalido, tope de 5, nombre duplicado con carrera concurrente, aislamiento entre mascotas del mismo owner, auditoria).
- `progress/impl_geofences-crud.md` — este reporte.

## Archivos modificados

- `backend-pet-tracker/src/pipeline/constants.ts` — solo se anadieron `GEOFENCE_EXIT_RADIUS_MULTIPLIER` (1.1), `GEOFENCE_ENTER_RADIUS_MULTIPLIER` (0.9), `GEOFENCE_EXIT_MAX_ACCURACY_M` (50); los exports existentes conservan nombre y valor.
- `backend-pet-tracker/src/db/schema/index.ts` — una linea de re-export (`export * from './geofences.schema';`).
- `backend-pet-tracker/src/app.module.ts` — import + registro de `GeofencesModule` (dos lineas, mismo patron que el resto de modulos).
- `docs/data-model.md` — fila `geofences` afinada al shape real (R1/D1/D2): `type` CHECK reducido a `'safe_circle'`, `geometry`/`geofence_state` con su shape y defaults, UNIQUE `(pet_id, name)`.
- `docs/wialon-module.md` — tres filas nuevas en la tabla de constantes del pipeline (`GEOFENCE_EXIT_RADIUS_MULTIPLIER`, `GEOFENCE_ENTER_RADIUS_MULTIPLIER`, `GEOFENCE_EXIT_MAX_ACCURACY_M`) + nota de quien las consume.
- `specs/geofences-crud/traceability.md` — las 26 filas completas (test + commit), actualizada tras cada commit de codigo.

## Requisitos cubiertos

| R | Test | Commit |
|---|---|---|
| R1 | `test/geofences.e2e-spec.ts::R1` | `23fa1fe` |
| R2 | `test/geofences.e2e-spec.ts::R2` | `23fa1fe` |
| R3 | `test/geofences.e2e-spec.ts::R3` | `23fa1fe` |
| R4 | `test/geofences.e2e-spec.ts::R4` | `23fa1fe` |
| R5 | `test/geofences.e2e-spec.ts::R5` | `23fa1fe` |
| R6 | `test/geofences.e2e-spec.ts::R6` | `23fa1fe` |
| R7 | `test/geofences.e2e-spec.ts::R7` | `23fa1fe` |
| R8 | `test/geofences.e2e-spec.ts::R8` | `23fa1fe` |
| R9 | `test/geofences.e2e-spec.ts::R9` | `23fa1fe` |
| R10 | `test/geofences.e2e-spec.ts::R10` | `23fa1fe` |
| R11 | `test/geofences.e2e-spec.ts::R11` | `23fa1fe` |
| R12 | `test/geofences.e2e-spec.ts::R12` | `23fa1fe` |
| R13 | `test/geofences.e2e-spec.ts::R13` | `23fa1fe` |
| R14 | `test/geofences.e2e-spec.ts::R14` | `23fa1fe` |
| R15 | `test/geofences.e2e-spec.ts::R15` | `23fa1fe` |
| R16-R25 | `src/pipeline/geofence-eval.spec.ts::R16..R25` | `aba0ff9` |
| R26 | ver §"Verificacion de no regresion — R26" abajo | `080f59d` + este cierre |

Detalle completo (nombre exacto de cada `describe`, ruta::nombre) en
`specs/geofences-crud/traceability.md` — sin filas "pendiente".

## Decisiones de diseño no cubiertas explicitamente por la spec

- **`GeofenceFieldChanges` con `centerLat/centerLng/radiusM` planos, merge de
  `geometry` dentro del repositorio Drizzle**: design.md fija el shape de
  `geometry` (jsonb con los tres campos) pero no especifica en que capa se
  mergean los campos parciales de un PATCH contra el geometry existente.
  Decidi hacerlo en `GeofenceDrizzleRepository.update()` (un SELECT extra
  solo cuando el PATCH toca algun campo de posicion/radio) para que
  `GeofenceFieldChanges` describa el dominio ("que cambia"), no el detalle de
  persistencia ("como se guarda"). El use case no necesita saber que esos
  tres campos comparten columna.
- **Manejo de `23505` tambien en `update()`, no solo en `create()`**: ningun
  R-id pide explicitamente un 409 al renombrar una geocerca a un nombre ya
  usado por otra de la misma mascota via PATCH, pero el indice unico
  `(pet_id, name)` de R1 lo rechazaria igual. `docs/conventions.md` es
  categorico ("nunca dejar que un error de Drizzle/pg llegue crudo al
  cliente"), asi que reutilice `GeofenceNameTakenError`/`translateUniqueViolation`
  en ambos metodos en vez de dejar un 500 sin cubrir en ese borde.
- **Sin `*.use-case.spec.ts` por separado**: la lista de archivos del leader
  llamaba explicitamente `.spec.ts` solo para `geofence-eval.ts`, no para el
  modulo CRUD; para R1-R15 me apoye enteramente en
  `test/geofences.e2e-spec.ts` (contra Postgres real: guard, roles,
  persistencia, indices, auditoria) en vez de sumar unit tests con mocks del
  repositorio que hubieran probado lo mismo con menos senal.
- **`.$type<GeofenceCircleColumn>()` / `.$type<GeofenceStateColumn>()` en las
  columnas jsonb del schema**: sin precedente en el repo (`pets.lastPosition`
  se deja `unknown` a proposito), pero evita casts `as` dispersos en el
  repositorio para dos columnas que si necesitan forma conocida. Los tipos
  vuelven a declararse en `geofence.entity.ts` (`GeofenceState`) en vez de
  importarse desde el schema — domain no depende de infrastructure.
- **`Geofence` (domain) aplana `centerLat/centerLng/radiusM`, no expone
  `CircleGeometry`/`PolygonGeometry` de `pipeline/geofence-eval.ts`**: D1 fija
  que el CRUD MVP solo produce circulos; el modulo `geofences/` nunca importa
  del pipeline (ni falta le hace: la union de geometrias es una preocupacion
  del nucleo puro para #12, no de este CRUD).

## Verificacion de no regresion — R26

`git diff main --name-only` confirma que mis tres commits
(`aba0ff9`, `23fa1fe`, `080f59d`) tocan exactamente la lista cerrada de R26:
`src/pipeline/{constants,geofence-eval,geofence-eval.spec}.ts`,
`src/db/schema/{geofences.schema,index}.ts`,
`src/db/migrations/0006_violet_cammi.sql` + `meta/`, `src/app.module.ts`,
`src/modules/geofences/**`, `test/geofences.e2e-spec.ts`,
`docs/{data-model,wialon-module}.md`, `specs/geofences-crud/traceability.md`.
Cero cambios en `pets/`, `devices/`, `activity/`, `positions/`, `auth/`,
`users/`, `workers/`, `integrations/`; cero dependencias nuevas en
`package.json`; cero variables de entorno nuevas. (`.gitignore`, `.mcp.json`,
`STATUS.md`, `feature_list.json`, `progress/current.md` y
`specs/geofences-crud/{requirements,design,tasks}.md` en el diff son de
`be4a05d`, el commit de arranque del leader/spec_author previo a esta
sesion — no los toque.)

**`./init.sh` NO termina en verde** — build, lint y typecheck si; el paso de
tests unitarios rompe por exactamente un test preexistente **fuera de mi
alcance**:

```
FAIL src/modules/activity/infrastructure/repositories/activity.drizzle.store.spec.ts
  ● R10: la migracion 0005 crea unicamente activity_daily › la 0005 es la unica migracion nueva y solo crea esa tabla
    expect(files.filter((file) => file > '0005_zzzz')).toHaveLength(0)
    Received array:  ["0006_violet_cammi.sql"]
```

Ese test es de `trips-activity` (#10, commit `850ba74`, muy anterior a esta
rama) y afirma literalmente "0005 es la ultima migracion del repo". Cualquier
migracion nueva de **cualquier** feature futura rompe esa asercion por
diseño — no es una regresion de geofences-crud, es una asercion end mordida
por su propio supuesto temporal. `src/modules/activity/**` esta en la lista
de "prohibido tocar" (mia y de R26), asi que no la edite. Necesita una
decision humana/del leader: lo mas simple es que `trips-activity` relaje esa
asercion a "el `type` CHECK y las columnas de `activity_daily` no cambiaron"
(como ya hacen `devices.schema.spec.ts`/`pets.schema.spec.ts`, que verifican
que su migracion no toca otras tablas sin asumir ser la ultima del
directorio) — cambio de una linea, pero en un archivo fuera de mi cierre.

Con esa unica excepcion, todo lo demas esta verde:

- Build: exitoso.
- Lint: sin errores.
- Typecheck (`tsc --noEmit`): sin errores.
- Tests unitarios: 641/642 pasan (el 1 que falla es el de arriba; mis 19
  tests nuevos de `geofence-eval.spec.ts` pasan).
- `pnpm run test:e2e` (suite completa): 141/142 pasan. El unico test que
  falla es `test/media.e2e-spec.ts` (feature `pet-photos-s3`, #6) — confirme
  que falla tambien **en aislamiento** (`pnpm run test:e2e -- media`, sin mi
  suite en juego), con una asercion de ACL de S3/LocalStack (`expect 403,
  received 200`) o con una violacion de FK segun el orden de ejecucion:
  flakiness de estado de LocalStack/Postgres compartido, preexistente, sin
  relacion con geofences-crud. `test/geofences.e2e-spec.ts` en si: 20/20
  pasan, igual que el resto de suites e2e del repo (9/10 suites completas).

## Output de build

```
> backend-pet-tracker@0.0.1 build
> nest build && tsc-alias -p tsconfig.build.json

(sin errores)
```

## Output de tests

```
Unitarios (pnpm test):
Test Suites: 1 failed, 91 passed, 92 total
Tests:       1 failed, 641 passed, 642 total
(el failing es src/modules/activity/.../activity.drizzle.store.spec.ts,
 preexistente y fuera de mi alcance — ver arriba)

geofence-eval.spec.ts en aislamiento:
Test Suites: 1 passed, 1 total
Tests:       19 passed, 19 total

e2e (pnpm run test:e2e):
Test Suites: 1 failed, 9 passed, 10 total
Tests:       1 failed, 141 passed, 142 total
(el failing es test/media.e2e-spec.ts, preexistente y fuera de mi alcance)

geofences.e2e-spec.ts en aislamiento:
Test Suites: 1 passed, 1 total
Tests:       20 passed, 20 total
```

## Notas para el reviewer

- **Bloqueante potencial de cierre**: `init.sh` no cierra en verde por el
  test de `activity` descrito arriba. Es un problema real pero de una linea,
  en un archivo que ni yo ni (segun `docs/conventions.md`/R26) deberia tocar.
  Decidan si lo asumen como debt documentado o si alguien con permiso sobre
  `src/modules/activity/**` lo corrige antes de mergear.
- `test/media.e2e-spec.ts` tiene flakiness propia, tambien preexistente y
  tambien fuera de mi alcance (`src/modules/media/**` no esta en mi lista de
  archivos).
- El `ponytail:` de `create-geofence.use-case.ts` (COUNT + INSERT sin
  transaccion serializable para el tope de 5) es el mismo que design.md pidio
  documentar — la carrera de nombre duplicado (R7) si tiene candado real
  (indice unico), verificada con dos POST concurrentes en el e2e.
- Revisar en particular `GeofenceDrizzleRepository.update()` — es la pieza
  con mas logica propia (merge de `geometry` parcial) que el resto del CRUD,
  que sigue el patron ya establecido por `pets`/`devices` casi 1:1.
