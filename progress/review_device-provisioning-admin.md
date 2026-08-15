# review: device-provisioning-admin

Fecha: 2026-08-14
Veredicto: **APROBADO**

Branch `feature/24-device-provisioning-admin`, 24 commits `fb66eb7..7575ef8`
sobre `main`. Reporte del implementador: `progress/impl_device-provisioning-admin.md`.
Spec aprobada: `specs/device-provisioning-admin/requirements.md` (`status: approved`,
gate humano cerrado 2026-08-14, **Opción A**).

---

## Decisión del gate — Opción A respetada

`git diff --name-only main..HEAD -- backend-pet-tracker/src/integrations/wialon`
devuelve **vacío**. El puerto `WialonUnit`, `SEARCH_UNITS_PARAMS`,
`WialonHttpClient` y `FakeWialonClient` quedan sin tocar: no se implementó la
opción B ni por accidente. El IMEI entra por `--imei` y se persiste tal cual
(`provision-device.ts:83`).

## Checklist C2 — Estado coherente

- [x] Solo 1 feature `in_progress` — recuento de `feature_list.json`:
      `{done: 20, pending: 5, in_progress: 1}`; la única `in_progress` es
      `24:device-provisioning-admin`
- [x] `progress/current.md` describe la sesión activa (restaurado por el humano
      tras los commits de Codex; refleja "en review", no la plantilla vacía)
- [x] `progress/history.md` tiene entrada de la sesión (ver §Nota de proceso:
      la escribió Codex antes de tiempo, pero existe y es veraz)

## Checklist C3 — Arquitectura

- [x] `domain` sin imports de `infrastructure` — `src/modules/devices/domain/**`
      no aparece en el diff
- [x] Repositorios/contratos en `domain` siguen siendo interfaces puras — sin cambios
- [x] `application` depende de interfaces, no de implementaciones —
      `activation-code.ts` importa **solo** `node:crypto` (stdlib), sin ORM,
      sin framework, sin decoradores. Mismo molde que el precedente
      `src/modules/auth/application/verification-token.ts` (design.md D2)
- [x] `infrastructure` sin lógica de negocio — sin cambios
- [x] `scripts/provision-device.ts` fuera de las capas es la convención vigente
      (`seed-devices.ts`, `seed-vaccines.ts`, `backfill-weights.ts`,
      `provision-local.ts` escriben con Drizzle directo), declarada en design.md D2

## Checklist C4 — TDD

- [x] Cada `R<n>` tiene al menos un test que lo nombra:

  | R | Test que lo nombra |
  |---|---|
  | R1 | `test/provision-device.e2e-spec.ts` — `describe('R1 (device-provisioning-admin #24): ...')` |
  | R2 | idem, `describe('R2 ...')` (2 casos) |
  | R3 | idem, `describe('R3 ...')` (2 casos) |
  | R4 | `src/modules/devices/application/activation-code.spec.ts` — `describe('R4 ...')` |
  | R5 | `test/provision-device.e2e-spec.ts` — `describe('R5 ...')` |
  | R6 | idem, `describe('R6 ...')` |
  | R7 | idem, `describe('R7 ...')` |
  | R8 | documental — verificado leyendo los dos docs (abajo) |

- [x] Historial test-primero real, no reconstruido. Verificado commit a commit
      con `git show --name-only`: **ningún commit `test(...)` contiene
      implementación** y cada `feat(...)` viene después de su rojo.

  | R | Rojo (solo test) | Verde (impl) |
  |---|---|---|
  | R4 | `fd2cc24`, `00a3640` → solo `activation-code.spec.ts` | `776f546` → solo `activation-code.ts` |
  | R5 | `d940644` → solo el e2e-spec | `665ac47` → solo `provision-device.ts` |
  | R1/R6/R7 | `b613ab5`, `922988f`, `244a6eb`, `037d720` → solo el e2e-spec | `94be544` → `provision-device.ts` + `package.json` |
  | R2 | `94dbfa6` → solo el e2e-spec | `2253495` → `provision-device.ts` + e2e-spec |
  | R3 | `d53804d` → solo el e2e-spec | `033cf5d` → solo `provision-device.ts` |

  El toque al e2e-spec dentro de `2253495` es legítimo: sustituye el acceso
  dinámico `(provisionScript as ...).WialonUnitNotFoundError` por el import
  directo, posible solo una vez que la clase existe. No añade ni relaja
  assertions (las 4 se conservan idénticas).

  No se repite el fallo de #19 (impl + tests + docs en un commit).

## Checklist C5 — Trazabilidad

- [x] `specs/device-provisioning-admin/traceability.md` sin ninguna fila
      "pendiente": las 8 filas tienen commit rojo y verde con hash real
- [x] Cada requisito tiene test y commit registrados; los hashes citados
      existen en la branch y corresponden a lo que dicen
- [x] Commits siguen `feat(device-provisioning-admin): <desc> (R1,R6,R7)` /
      `test(...)` / `docs(...)`

## Checklist C6 — Spec aprobada

- [x] `requirements.md` con `status: approved` en el frontmatter
- [x] Casilla "Aprobado por humano (fecha: 2026-08-14)" marcada, más las dos
      casillas del gate (decisión abierta → Opción A; riesgo heredado de #7 →
      escalado a #26)
- [x] Ningún requisito modificado después de la aprobación: `requirements.md`
      entra en el primer commit del rango (`fb66eb7`) y no vuelve a tocarse

## Checklist C7 — Sin código huérfano

- [x] N/A — esta feature **no reemplaza nada**: añade un segundo camino de alta
      que convive con el seed de simulados por diseño (R6)
- [x] Verificado que no deja huérfanos propios: `generateActivationCode` tiene
      exactamente un productor (`activation-code.ts`), un consumidor
      (`provision-device.ts:87`) y un test (`activation-code.spec.ts`)

---

## Puntos de atención del encargo — verificación individual

### R4 — invariante de seguridad del `activation_code` · **PASA**

`src/modules/devices/application/activation-code.ts`:

- Aridad cero real: `export function generateActivationCode(): string` sin
  parámetros. El test lo asevera con `expect(generateActivationCode).toHaveLength(0)`.
  Por construcción no puede derivar del IMEI ni de ningún identificador enumerable.
- `randomBytes` de `node:crypto` (import línea 1), 10 bytes → 10 símbolos.
- Alfabeto `'0123456789ABCDEFGHJKMNPQRSTVWXYZ'` = 32 símbolos exactos, sin
  `I`/`L`/`O`/`U`. Como 256 es múltiplo de 32, `byte % 32` es **uniforme**: no
  hay sesgo de módulo que recorte la entropía. ~50 bits.
- El alfabeto casa exactamente con `[0-9A-HJKMNP-TV-Z]` (22 letras + 10 dígitos),
  y el test verifica la regexp `/^PT-[0-9A-HJKMNP-TV-Z]{10}$/` sobre las 1000
  generaciones, más `new Set(codes).size === 1000`.

### R2 — `listUnits()` antes de cualquier INSERT · **PASA**

`provision-device.ts:75-78` llama `listUnits()`; el `INSERT` está en la línea 92.
No hay ninguna otra escritura antes.

- Unidad inexistente → `WialonUnitNotFoundError` con el `unitId` pedido y el
  número de unidades visibles en el mensaje. El test **cuenta filas antes y
  después** (`before.length` vs `after.length`), no solo comprueba que lanza.
- Error de la API: el test usa `WialonTransportError` real y asevera
  `rejects.toBe(failure)` — propagación **por identidad**, no por tipo; y
  vuelve a comparar el conteo de filas.

### R3 — reprovisionar no regenera el secreto · **PASA**

Retorno temprano en `provision-device.ts:67-73`: devuelve `{created: false}` con
el `id` y el `activationCode` leídos de la fila. **No hay ningún `UPDATE` en
todo el archivo**, así que ninguna columna puede cambiar. El test lo confirma
comparando `activationCode`, `status`, `isSimulated`, `updatedAt`, `imei` y
`model` contra el snapshot previo — y lo hace pasando `--imei`/`--model`
distintos en la segunda llamada, que es el caso que de verdad puede pisar datos.
Además asevera `listUnits` llamado **una sola vez** (no se revalida contra
Wialon) y una única fila para ese `wialon_unit_id`. Exit 0: `main()` no toca
`process.exitCode` en este camino.

Colisión `23505` por IMEI ajeno: cubierta, con conteo de filas y comprobación
de que no queda fila con el `wialonUnitId` nuevo.

### R5 — cero rutas HTTP · **PASA**

- `git diff --name-only main..HEAD -- '*.controller.ts'` → **vacío**. Ningún
  controller creado ni modificado; sin cambios en `app.module.ts` ni
  `devices.module.ts`. El conjunto de rutas de `AppModule` es idéntico.
- `assertRealWialonClient()` (`provision-device.ts:50-54`) usa allowlist
  (`!(client instanceof WialonHttpClient)`), más estricto que una denylist del
  fake. En `main()` se invoca en la línea 119, **antes** de crear el `Pool`
  (120) y antes de cualquier llamada a Wialon. El test cubre las dos
  direcciones: el `FakeWialonClient` lanza `SimulatedWialonClientError`, el
  `WialonHttpClient` no lanza.

### R6 — seed de simulados intacto · **PASA**

`git diff --name-only main..HEAD -- backend-pet-tracker/scripts/seed-devices.ts
backend-pet-tracker/src/db/seed/simulated-devices.ts` → **vacío**. El test de R6
importa `seedSimulatedDevices` del script sin modificar y comprueba que tras
sembrar, el collar real conserva `isSimulated=false` y su `activationCode`.

### R7 — flujo de claim (#7) intacto · **PASA**

`git diff --name-only main..HEAD -- backend-pet-tracker/src/modules/devices/`
devuelve exactamente dos rutas, ambas nuevas:

```
backend-pet-tracker/src/modules/devices/application/activation-code.spec.ts
backend-pet-tracker/src/modules/devices/application/activation-code.ts
```

`ClaimDeviceUseCase`, `ClaimDeviceDto`, `DeviceDrizzleRepository`,
`DevicesController` y todo `domain/` e `infrastructure/` sin tocar. El test de
R7 recorre el claim real por HTTP (201, fila activa en `pet_devices`,
`devices.status = 'assigned'`).

### Sin migración · **PASA**

`git diff --name-only main..HEAD -- backend-pet-tracker/src/db` → **vacío**. Ni
schema ni migraciones. La feature es DML puro.

### #8 intacto · **PASA**

`src/integrations/wialon/` sin cambios (ver §Decisión del gate).
`src/workers/poller.service.ts` tampoco aparece en el diff.

### R1 — columnas y nulos · **PASA**

La fila insertada (`provision-device.ts:80-90`) fija `id` (uuidv7),
`wialonUnitId`, los 4 identificadores opcionales con `?? null`,
`activationCode`, `status: 'available'` y `isSimulated: false`, y **omite**
`batteryPct`/`connectivity`/`lastMessageAt`/`ingestWatermark`, que en
`devices.schema.ts` son nullable sin default → quedan `NULL`. El test los
asevera los cuatro explícitamente. El `activation_code` se imprime por stdout
(línea 130-132). Falta de `--unit-id`: `throw new Error('falta --unit-id')`
antes de crear el `Pool`, con exit code ≠ 0 vía `process.exitCode = 1`; el test
lo ejecuta de verdad con `spawnSync` y comprueba `status !== 0` y que stderr
menciona `--unit-id`.

### R8 — documentación · **PASA**

- `docs/data-model.md`, fila `devices`: "dos caminos de alta: `seed:devices`
  crea SIM-001..003 con `is_simulated=true`, mientras `provision:device`
  registra hardware real con `is_simulated=false` tras verificar la unidad en
  Wialon".
- `docs/wialon-module.md`: "`listUnits()` tiene dos consumidores: el pipeline de
  ingesta y `scripts/provision-device.ts`, que comprueba que una unidad existe
  en la cuenta antes de registrar un collar real".

### Desviaciones respecto al código de referencia de `design.md` — todas benignas

Ninguna afecta a un requisito, ninguna motiva rechazo:

1. `ACTIVATION_CODE_ALPHABET` / `_PREFIX` / `_BODY_LENGTH` quedan como constantes
   de módulo en vez de exportadas. R4 solo exige `generateActivationCode`.
2. Los mensajes de `SimulatedWialonClientError` y de "falta `--unit-id`" son más
   cortos que los del borrador. Siguen siendo explícitos y nombran el flag /
   la variable de entorno que hay que cambiar, que es lo que piden R1 y R5.
3. `provisionDevice` hace `select({id, activationCode})` en vez de `select()`
   completo. Mejora: menos columnas por el cable, mismo comportamiento.
4. El `console.log` final se unifica en un template en vez de dos ramas. Sigue
   imprimiendo el `activation_code` en ambos caminos (R1).
5. El caso "dos aprovisionamientos → códigos distintos" de la tabla de
   `design.md` §Test no está en el e2e, pero el test unitario de R4 (1000
   códigos, 1000 valores distintos) lo subsume estrictamente.

---

## Nota de proceso — bookkeeping adelantado por Codex

Codex tocó archivos que son territorio del `leader`. **Verificado que no falsificó
nada**, y el reparto de culpa no es el que parece a simple vista:

**`feature_list.json` — no es de Codex, no hay nada que revertir.** Su diff
(#24 `pending` → `in_progress`, y el alta de #26 `claim-activation-code-only`
en `pending`) entra en `fb66eb7`, el **primer** commit del rango, junto a las
cuatro specs y a `progress/current.md`. Es decir: contenido escrito por el
`leader` en el working tree antes del handoff, que Codex arrastró al commitear
porque el árbol es uno solo. Es exactamente el riesgo que `CLAUDE.md` §Un solo
escritor documenta. Comprobado además que **ninguna otra feature cambió de
estado**: recuento final `20 done / 5 pending / 1 in_progress`, con #26 en
`pending` y #24 todavía `in_progress`. Nada se marcó `done`.

**`STATUS.md` y `progress/history.md` — sí son de Codex** (`7575ef8`), y sí son
territorio del `leader` (`AGENTS.md` §7.2, cierre de sesión). El contenido es
honesto: dice "implementación lista para review" y "#24 sigue `in_progress`
hasta el veredicto independiente del `reviewer`", no reclama `done`, y las
cifras que cita (956 unit / 254 e2e, sin migración) coinciden con la corrida
independiente de este review. No inventó nada.

**`progress/current.md`** lo dejó en la plantilla vacía en ese mismo commit; el
humano ya lo restauró y su estado en el working tree es correcto ("en review").

**Recomendación: no revertir, corregir hacia adelante.** Revertir `STATUS.md` e
`history.md` solo para reescribirlos igual al cerrar la sesión es churn sin
ganancia — el contenido ya es correcto y solo le falta el desenlace. Al cerrar,
el `leader` los actualiza con el veredicto aprobado, el `done` de #24 y el
número de PR. Lo que sí conviene endurecer para el próximo handoff es el prompt
a Codex: **no toca `feature_list.json`, `STATUS.md`, `progress/history.md` ni
`progress/current.md`; su único archivo de `progress/` es
`impl_<feature>.md`**. Si el solape vuelve a doler, `git worktree` (ya
contemplado en `CLAUDE.md`) le da a cada agente su propio HEAD.

## Observaciones

Ninguna que bloquee. Dos avisos para el `leader`, ambos fuera del alcance de
Codex:

1. **`tasks.md` §Cierre sigue sin marcar** y debe seguir así hasta que lo cierre
   el humano: la ejecución real de
   `pnpm -C backend-pet-tracker run provision:device -- --unit-id <unidad real>`
   con `SIM_MODE=false` y token real, más el claim desde la app. La spec lo pone
   explícitamente fuera de alcance de la IA (`requirements.md` §Fuera de
   alcance). Este veredicto aprueba **la implementación**; marcar #24 `done`
   requiere además ese cierre humano, por la regla de `CLAUDE.md` §Reglas duras.
2. **#26 `claim-activation-code-only` es P1 y ya está en la lista.** El hueco que
   describe (un IMEI adivinado reclama el collar) pasa de teórico a explotable
   justo cuando esta feature empiece a meter hardware real con `--imei`. Merece
   ir por delante de #17/#18 en la próxima sesión.

Ruido registrado en el output de e2e, **no es regresión**: el `23503`
(`pet_users_user_id_users_id_fk`) proviene del test preexistente
`test/pets.e2e-spec.ts` — *"si el insert de pet_users falla, la fila de pets no
persiste (rollback)"*, que usa a propósito un JWT válido de un usuario que no
existe en `users`. Es el log del `ExceptionsHandler` de un camino negativo
deliberado, en el módulo `pets`, que esta feature no toca. 0 tests fallidos.
Los `ECONNREFUSED 127.0.0.1:4566` del `PollerService` en los unitarios son el
mismo tipo de ruido esperado. El árbol quedó limpio tras `eslint --fix`
(`git status` solo lista `progress/current.md`, restaurado por el humano).

## Output de ./init.sh

Corrido por el reviewer, no copiado del reporte del implementador. Exit code 0.

```
Test Suites: 133 passed, 133 total
Tests:       956 passed, 956 total
Snapshots:   0 total
Time:        10.219 s
Ran all test suites.

> pet-tracker-infra@0.0.1 test C:\Users\alex\Documents\sites\pet-tracker\infra
> jest "--passWithNoTests"

PASS test/no-duplicated-literals.test.ts (10.658 s)
PASS test/pet-tracker-dev-stack.test.ts (15.637 s)

Test Suites: 2 passed, 2 total
Tests:       14 passed, 14 total
Snapshots:   0 total
Time:        16.343 s
Ran all test suites.
✅ Tests pasados

→ Tests e2e...

> backend-pet-tracker@0.0.1 test:e2e
> jest --config ./test/jest-e2e.json

...[stack trace del test de rollback de pets.e2e-spec.ts omitido — camino
negativo deliberado, ver §Observaciones]...

Test Suites: 2 skipped, 17 passed, 17 of 19 total
Tests:       6 skipped, 254 passed, 260 total
Snapshots:   0 total
Time:        56.799 s
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

  Features: 20/26 completadas | 5 pendientes

  Próxima feature:
  [#17] nutrition-profile-engine (P3)

[exited with code 0]
```

Las 2 suites / 6 tests omitidos son las de AWS real, saltadas por su gate
preexistente (`AWS_MODE`), no por esta feature.
