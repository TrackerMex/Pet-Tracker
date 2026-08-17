# review: device-subscriptions

Fecha: 2026-08-17
Feature: #25 `device-subscriptions` (P2)
Branch: `feature/25-device-subscriptions`
Rango revisado: `f1814b1..HEAD` (54 commits). Implementación de Codex:
`ae15c15..9ea58cd`. `f1814b1`, `221fbe9` y `cf83cc7` son del leader.

**Veredicto: APROBADO** (con 5 observaciones no bloqueantes y 2 acciones
obligatorias de cierre para el leader, §Acciones de cierre)

---

## Checklist C2 — Estado coherente

- [x] Solo 1 feature `in_progress` — `feature_list.json`: 25 `done`, 4
      `pending`, 1 `in_progress` (#25). El revert del leader en `cf83cc7`
      dejó el estado correcto.
- [x] `progress/current.md` actualizado — describe la sesión activa, el plan,
      el riesgo de seguridad a vigilar y el cierre prematuro revertido.
- [x] Toda feature `done` tiene test que la cubre — sin regresiones: las suites
      de #7, #9, #10, #11, #13 y #24 pasan con los fixtures de entitlement
      añadidos en `90cb9f1`.
- [ ] `progress/history.md` — ver **O2**: contiene ya una entrada de cierre de
      #25 escrita por Codex antes del gate. No invalida la implementación;
      corresponde corregirla en el cierre real.

## Checklist C3 — Arquitectura

- [x] `domain` sin imports de `infrastructure` — los tres archivos de
      `modules/subscriptions/domain/` verificados uno a uno:
      `subscription.constants.ts` (cero imports),
      `errors/subscription.errors.ts` (cero imports — cumple la exigencia
      literal de R7 de que `DeviceNotSubscribedError` sea clase pura sin
      `@nestjs/common`), `repositories/subscription.repository.ts` (cero
      imports).
- [x] Repositorios/contratos en domain son interfaces puras —
      `SubscriptionRepository` es `interface` + `Symbol` token, sin
      implementación.
- [x] `application` depende de interfaces, no de implementaciones —
      `ClaimDeviceUseCase` inyecta `SUBSCRIPTION_REPOSITORY` y tipa contra
      `SubscriptionRepository`; nunca menciona `SubscriptionDrizzleRepository`.
- [x] `infrastructure` sin lógica de negocio — el predicado SQL es la única
      expresión de la regla; los consumidores (`ingestion.drizzle.store.ts`,
      `alert.drizzle.repository.ts`, `subscription.drizzle.repository.ts`) lo
      importan, no lo reescriben.

## Checklist C4 — TDD

- [x] Cada `R<n>` tiene al menos un test que lo nombra, **o** el mecanismo de
      cierre que la propia spec aprobada le asigna. 15 de 18 tienen
      `describe('R<n> (device-subscriptions #25): ...')`:
      R1, R2, R3, R4, R5, R6, R7, R8, R9, R10, R11, R13, R15, R16, R17.
      R12, R14 y R18 se cierran por grep/inspección — mecanismo previsto
      explícitamente en §"Requisitos verificados por grep / inspección" de
      `traceability.md` y en el texto de los propios requisitos (R12 y R14 son
      restricciones de **ausencia de código**; R18 dice "verificable leyendo el
      documento"). Los tres se re-verificaron a mano, ver §Verificación
      independiente.
- [x] Historial test-primero, no todo junto — **este es el checkpoint que
      falló en #19 y aquí está corregido**. Inspeccioné el `--stat` de los 12
      commits rojos: **todos tocan exclusivamente archivos de test**, ninguno
      cuela implementación:

      | Commit rojo | Archivos tocados |
      |---|---|
      | `ae15c15` R1 | `test/device-subscriptions.e2e-spec.ts` (+ `progress/current.md`) |
      | `f171ffa` R17 | `test/device-subscriptions.e2e-spec.ts` |
      | `7f75218` R2 | `entitlement.predicate.spec.ts` |
      | `fe506d6` R3 | `test/device-subscriptions.e2e-spec.ts` |
      | `07cc06d` R4 | `test/device-subscriptions.e2e-spec.ts` |
      | `6b07d89` R13 | `test/device-subscriptions.e2e-spec.ts` |
      | `0341d62` R6 | `test/device-subscriptions.e2e-spec.ts` |
      | `a6bc9ca` R7 | `claim-device.use-case.spec.ts`, `test/devices.e2e-spec.ts` |
      | `e5bb926` R8 | `pet-tracking.guard.spec.ts` |
      | `c06fd74` R15 | `test/device-subscriptions.e2e-spec.ts` |
      | `8256ac4` R9 | `test/device-subscriptions.e2e-spec.ts` |
      | `fc1dcd7` R10 | `alerts-center-notifier.e2e-spec.ts`, `test/device-subscriptions.e2e-spec.ts` |

### Los 5 requisitos sin commit rojo — juicio uno por uno

El leader pidió juzgar si la ausencia de rojo es legítima o es un rojo saltado.
**Los cinco son legítimos**: en los cinco casos un commit rojo honesto exigiría
escribir primero código que rompa el invariante, es decir, fabricar el rojo.

- **R5** (`1a95002`, "propiedad verde") — **legítimo**. R5 es una prohibición
  ("esta feature SHALL NOT ejecutar ningún `UPDATE` sobre `pet_devices` ni
  sobre `devices.status`"). Su mitad positiva ("reanudar sin re-claim") ya la
  entregaba R4, cuyo verde (`c61c729`) es anterior. Un rojo exigiría añadir un
  `UPDATE` para luego quitarlo.
- **R11** (`e534063`, "propiedad verde") — **legítimo**. Es consecuencia
  estructural de la firma `isPetTracked(petId)` (R3, sin `userId`) más el gate
  de R9, ambos ya verdes cuando se añadió el test (`e534063` es posterior a
  `6a217d4`). El test de los 3 roles vale como prueba de la propiedad, no como
  rojo.
- **R16** (`746c476`, "propiedad verde") — **legítimo**. Es una congelación de
  contrato: verde desde el minuto cero precisamente porque nada tocó los
  mappers. Verificado por diff, no solo por test (§7).
- **R14** (`3a83c14`, "restricción verde") — **legítimo**. "Cero proveedores de
  pago" es ausencia pura; un rojo exigiría importar Stripe para borrarlo.
- **R12** (`cf77e6a`, "restricción verde") — **legítimo y además obligatorio**:
  R12 dice literalmente "THE SYSTEM SHALL NOT crear ningún archivo bajo
  `src/modules/nutrition/`". Un rojo sería crear el código que el requisito
  prohíbe.

R18 usa "rojo documental" (`cec3fc4` → `b16192b`), que sí es un rojo real sobre
un check de documentación.

## Checklist C5 — Trazabilidad

- [x] `traceability.md` sin filas "pendiente" — las 18 filas tienen test y
      commit. La tabla de verificación por grep tiene los 5 comandos con su
      salida registrada, y la tabla de verificación manual marca los 2 ítems
      reservados al humano.
- [x] Cada requisito tiene test y commit registrados.
- [ ] Formato `feat(<scope>): <desc> (R-ids)` — ver **O3**: 2 de 54 commits sin
      R-id, ambos de bookkeeping, ninguno portador de requisito.

## Checklist C6 — Spec aprobada

- [x] `requirements.md` con `status: approved` y casilla humana marcada
      (`[X] Aprobado por humano (fecha: 2026-08-17)`).
- [x] **Ningún requisito modificado después de la aprobación.** Verificado con
      `git diff ae15c15~1 9ea58cd -- specs/device-subscriptions/requirements.md`:
      el único cambio es la línea de frontmatter `status: draft` →
      `status: approved`. El texto de R1–R18 es byte-idéntico al que aprobó el
      humano. Igual en `design.md`.
- [x] La decisión del gate (Opción A) está registrada y su traslado a #18
      ejecutado: `feature_list.json` #18 sigue `pending` con el criterio
      trasladado.

## Checklist C7 — Sin código huérfano

- [x] N/A — esta feature no reemplaza ni deja obsoleto ningún componente.
      R17 **extiende** `scripts/seed-devices.ts` (enmienda declarada de #24),
      no lo sustituye; los 4 controllers gateados solo ganan un guard en su
      `@UseGuards`. Ningún archivo eliminado en todo el rango
      (`git diff --stat`: 47 archivos, 0 borrados).
- [x] Sin `.spec`/`.test` huérfanos: no hay archivo eliminado que dejara test
      atrás.

---

## Los 9 puntos exigidos con lupa

### 1. SEGURIDAD — R8, precedencia 404 sobre 402 · **PASA**

Verificado el orden **real de runtime**, no la afirmación del test. Cinco
comprobaciones independientes:

1. **Registro**: `@UseGuards(PetAccessGuard, PetTrackingGuard)` a nivel de
   **clase** en los 4 controllers (`positions:34`, `trips:32`, `activity:26`,
   `geofences:42`). Nest ejecuta los guards de un mismo `@UseGuards` en orden
   de array, secuencialmente; el primer `throw` corta la cadena.
2. **Sin registro global que invierta la precedencia**: `grep APP_GUARD|
   useGlobalGuards` sobre `src/` solo devuelve el `AuthGuard` de #4.
   `PetTrackingGuard` aparece únicamente en esos 4 `@UseGuards`, en su módulo y
   en su spec. No hay `@UseGuards` a nivel de handler que pueda reordenar.
3. **`PetAccessGuard` lanza antes de poblar**: `pet-access.guard.ts` lanza
   `NotFoundException()` para `:petId` malformado (línea 48) y para
   `!membership || status !== 'active'` (línea 57), **antes** de la línea 76
   que asigna `request.petMembership`.
4. **La garantía es estructural, no solo de orden.** `grep -rn "petMembership
   \s*="` sobre `src/` devuelve **un único escritor**:
   `pet-access.guard.ts:76`. Y `PetTrackingGuard` lanza `NotFoundException()`
   sin consultar nada si `request.petMembership` es `undefined`. Consecuencia:
   **el 402 es inalcanzable para un no-miembro incluso si alguien invirtiera el
   orden de los guards** — fallaría cerrado con 404. La feature es robusta a la
   regresión exacta que el leader temía.
5. **Cobertura e2e con usuario B sobre mascota de A**:
   `test/device-subscriptions.e2e-spec.ts:254` — `r9-sec-attacker` pide
   `GET /v1/pets/{pet de r9-sec-owner}/positions/last` y espera `404`. La
   mascota tiene collar con suscripción activa hasta 2099. Segundo caso:
   `:petId` malformado → `404`. Ambos pasan. El unit test del guard
   (`pet-tracking.guard.spec.ts:55`) cubre además el fail-closed:
   `expect(isPetTracked).not.toHaveBeenCalled()`.

Nota metodológica en **O5**: ese e2e, tal como está construido, no *discrimina*
el orden de guards. No es un defecto que bloquee, porque el punto 4 hace la
fuga imposible por construcción, y porque el test reproduce literalmente el
escenario que R8 fija ("sin membresía activa sobre una mascota **con**
suscripción vigente → 404").

### 2. C4 — historial rojo→verde · **PASA**

Ver §C4. Los 12 rojos son rojos de verdad (solo tests). Los 5 sin rojo son
invariantes de ausencia donde el rojo sería fabricado. El fallo de #19 no se
repite.

### 3. Codex cerró la feature él mismo · **TEXTO MAYORMENTE CIERTO, FECHA FALSA**

Leídos `STATUS.md` y `progress/history.md` tal como los dejó `9ea58cd`.
Contrastadas sus afirmaciones una por una:

| Afirmación | ¿Cierta? |
|---|---|
| "`PetTrackingGuard` se ejecuta después de `PetAccessGuard`; el 402 nunca adelanta el 404" | **Cierta** (§1) |
| "El guard de acceso y los mappers de respuesta permanecen intactos" | **Cierta** — diff vacío en ambos (§7) |
| "`init.sh` exit 0" | **Cierta** — reproducido por mí |
| "136 suites / 1,000 tests backend, 2/14 infra, 28 harness, 18 suites / 292 e2e" | **Cierta** — cifras idénticas en mi corrida |
| "Dos suites / 6 e2e omitidos por sus gates existentes" | **Cierta** (§9) |
| "R5, R11 y R16 son propiedades verdes, R12/R14 restricciones de ausencia, R18 rojo documental" | **Cierta y honesta** — declara lo que hizo, no lo disfraza |
| "un único predicado SQL alimenta repositorio, poller, claim, rutas y alertas" | **Cierta** (§5) |
| **"Estado final: done" / "26/30" / "En progreso: ninguna"** | **FALSAS al escribirse** — no había veredicto |

El contenido técnico se sostiene; lo que no se sostiene es la declaración de
cierre. Con este veredicto aprobado, el texto técnico **se conserva** y solo hay
que rehacer los contadores y la fecha (§Acciones de cierre).

El propio `init.sh` detecta hoy la incoherencia y la reporta:
`⚠️ STATUS.md desactualizado (26/30 declarado vs 25/30 real)`.

### 4. Tocó la base de datos a mano · **PASA — el repo quedó limpio**

Lo que dice el reporte (reconciliar filas 0009–0011 en el Postgres Docker) fue
una intervención **solo en la base local**, no en el repositorio. Verificado:

- **Exactamente UNA migración nueva**: `0012_absent_black_bolt.sql`. R1 exige
  una y solo una; cero o más de una es fallo. Hay 13 ficheros `.sql` (0000–0012)
  y el journal tiene 13 entradas.
- **Ninguna migración editada a posteriori**:
  `git diff --stat ae15c15~1 9ea58cd -- src/db/migrations/` = 3 archivos,
  **1967 inserciones y 0 borrados** — el `.sql` nuevo, su snapshot y la entrada
  añadida al journal. Ningún fichero previo tocado.
- **Sin migraciones huérfanas**: los 13 `.sql` corresponden 1:1 con las 13
  entradas del journal, y la tabla `drizzle.__drizzle_migrations` de la base
  local tiene 13 filas (id 1..13).
- **Un entorno limpio migra de cero sin intervención manual**: no se añadió al
  repo ningún script de reparación ni ninguna sentencia condicional. El
  backfill de 0012 es `INSERT ... SELECT id FROM devices ON CONFLICT DO
  NOTHING`, que sobre una base recién creada (tabla `devices` vacía) es un
  no-op inocuo. Confirmado indirectamente: los e2e crean su propio estado y
  pasan.
- El arreglo local **no está en el repo — y no tiene por qué estarlo**: era
  deriva del Postgres de desarrollo del humano, no del código.

El contenido de la migración cumple R1 al pie de la letra: las 6 columnas
exactas, `device_id uuid PRIMARY KEY`, FK a `devices(id)` `ON DELETE no action`,
los dos CHECK con los nombres literales exigidos
(`device_subscriptions_status_check`, `device_subscriptions_plan_code_check`),
y **ningún índice adicional**.

### 5. R2 — la regla en un solo sitio · **PASA (con desviación literal justificada)**

Corrí el grep exacto de la spec. 11 líneas en 6 ficheros:

| Fichero | ¿Permitido por R2? |
|---|---|
| `src/modules/subscriptions/infrastructure/entitlement.predicate.ts` (3) | Sí |
| `src/modules/subscriptions/infrastructure/entitlement.predicate.spec.ts` (2) | Sí |
| `src/modules/subscriptions/domain/subscription.constants.ts` (1) | Sí |
| `src/db/schema/subscriptions.schema.ts` (1) | Sí |
| `src/db/migrations/0012_absent_black_bolt.sql` (2) | **No literalmente** |
| `src/db/migrations/meta/0012_snapshot.json` (2) | **No literalmente** |

**Juicio: no es rechazo.** Las dos coincidencias extra son el DDL que crea la
columna y el snapshot que `drizzle-kit generate` produce obligatoriamente junto
a él. R1 **exige** esa migración y R17 **exige** que su `INSERT` nombre
`current_period_end`; leer R2 al pie de la letra lo haría contradictorio con R1
y R17 en la misma spec. Y el criterio de fondo que R2 protege —"cualquier otra
coincidencia significa que la regla se recalculó en otro punto"— se cumple: ni
el DDL ni el snapshot contienen la regla (`status='active' AND
current_period_end > now() - gracia`); solo declaran la columna. **Cero
recálculos de la regla fuera del predicado.**

El predicado, además, cumple las dos exigencias finas de R2:

- interpola la constante (`${DEVICE_SUBSCRIPTION_GRACE_DAYS}`), sin `3` literal;
- usa `now()` **desnudo**, sin `now() AT TIME ZONE` — la trampa que R2 nombra
  explícitamente y que ya mordió a este repo antes.

Los tres consumidores previstos lo importan y ninguno más:
`subscription.drizzle.repository.ts` (R3), `ingestion.drizzle.store.ts` (R4),
`alert.drizzle.repository.ts` (R10).

### 6. R17 enmienda una spec aprobada (#24) · **PASA**

- El `onConflictDoNothing({ target: devices.esn })` preexistente **se conserva
  intacto**; el diff solo **añade** un bloque después.
- El bloque nuevo selecciona por `inArray(devices.esn, SIMULATED_DEVICES.map(...))`
  — es decir, toca **solo** los 3 simulados, nunca el collar real.
- Los dos caminos siguen distinguiéndose por `is_simulated`. Confirmado contra
  la base local:

  | esn | wialon_unit_id | is_simulated | sub_status | plan_code |
  |---|---|---|---|---|
  | SIM-001 | 900001 | `t` | active | grandfathered |
  | SIM-002 | 900002 | `t` | active | grandfathered |
  | SIM-003 | 900003 | `t` | active | grandfathered |
  | (real #24) | 401775970 | `f` | active | grandfathered |

  (`ACT-001..003` son los `activation_code` de esos mismos 3 devices, no
  devices aparte — ver `src/db/seed/simulated-devices.ts`.)
- #24 no quedó roto: `test/provision-device.e2e-spec.ts` sigue verde (recibió
  10 líneas de fixture de entitlement en `90cb9f1`, no un cambio de conducta),
  y `scripts/provision-device.ts` **no aparece en el diff**.
- La enmienda está justificada por escrito en R17 y el leader ya la marcó como
  "pendiente de confirmar" en `current.md`. Queda confirmada aquí: el alcance
  del cambio es aditivo y no altera ninguna aserción de la spec de #24.

### 7. R16 — el contrato no cambia · **PASA (comprobado contra el diff, no contra el reporte)**

`git diff --name-only ae15c15~1 9ea58cd | grep mapper` devuelve **un único
fichero**: `devices/infrastructure/mappers/device-error.mapper.ts`, que es
**mapper de errores** y cuyo cambio lo **ordena R7** ("`mapDeviceError()` SHALL
traducirlo a 402"). Concretamente:

- `pets/infrastructure/mappers/pet-profile-response.mapper.ts`: **diff vacío**.
  Las 24 claves congeladas intactas, verificadas además por el e2e de R16.
- Todos los demás mappers de respuesta (positions, trips, activity, geofences,
  alerts): **diff vacío**.
- `pets/infrastructure/guards/pet-access.guard.ts`: **diff vacío**.
- Ninguna clave `subscription`/`tracked`/`entitled`/`planCode`/`currentPeriodEnd`
  añadida a ninguna respuesta.

### 8. Backfill de grandfathering (R17) · **PASA**

Los 4 devices preexistentes tienen entitlement tras la migración (tabla en §6),
**incluido el collar real de #24, unidad Wialon `401775970`**, con
`status='active'`, `plan_code='grandfathered'`,
`current_period_end = 2099-12-31`. El entorno local y el smoke de GPS real no
se apagan al migrar. El centinela `'2099-12-31'` es el que R17 exige, greppable
y sin inventar un estado "perpetuo" que R2 tendría que conocer.

### 9. Suites omitidas · **PASA — ninguna cubre un requisito de #25**

Las 2 suites omitidas de 20 son:

- `test/aws-real-ingest.e2e-spec.ts` — `(runAwsIngest ? describe : describe.skip)`,
  gate `AWS_MODE === 'aws'` (línea 39).
- `test/aws-real-smoke.e2e-spec.ts` — mismo gate `AWS_MODE === 'aws'` (línea 10).

Ambos gates son **preexistentes** de #20/#21, no los tocó esta feature, y
prueban ingesta contra AWS real — nada de R1–R18. **`test/device-subscriptions.e2e-spec.ts`
sí corrió y pasó**, dentro de las 18 suites verdes. Ningún requisito de #25
queda sin verificar por una omisión.

---

## Verificación independiente (la corrí yo, no acepté el reporte)

**Precondición de infraestructura** — comprobada antes de dar por buena ninguna
suite e2e, por el modo de fallo silencioso conocido del repo:

```
$ docker port pet-tracker-postgres
5432/tcp -> 0.0.0.0:5432
5432/tcp -> [::]:5432
```

Postgres publica el 5432 de verdad y lleva ~1h arriba (infra caliente, no
recién levantada). **No** apareció "Puerto 5432 sin respuesta — se saltan los
e2e": los e2e corrieron de verdad, el verde no es falso.

Greps re-ejecutados por mí (no copiados del reporte):

| Requisito | Comando | Resultado |
|---|---|---|
| R2 | `grep -rn "current_period_end\|currentPeriodEnd\|GRACE_DAYS" backend-pet-tracker/src/` | 11 líneas / 6 ficheros — analizadas en §5 |
| R14 | `grep -rni "stripe\|paypal\|mercadopago\|checkout.session\|webhook" backend-pet-tracker/src/` | **exit 1, cero coincidencias** |
| R14 | diff de `package.json` | solo `+ "subscription:set"` (lo exige R13); **cero dependencias nuevas** |
| R14 | diff de `.env.example` y `docs/conventions.md` | **vacío**, cero variables nuevas |
| R12 | `ls src/modules/nutrition` | **No such file or directory** |
| R12 | `grep -rn "aiExplanation" src/` | **exit 1, cero coincidencias** |
| R5 | `grep -rnE "update\(petDevices\)\|releasedAt:"` sobre el código nuevo | **cero** `UPDATE` de `pet_devices`; el único `update(devices)` nuevo es el watermark de R6 |
| R18 | diff de `docs/data-model.md` | ERD `devices \|\|--o\| device_subscriptions` + fila de catálogo con columnas, enums, gracia derivada y los 3 caminos de alta |
| R9 | ficheros `*.controller.ts` creados | **ninguno** — cero rutas HTTP nuevas |
| C6 | diff de `requirements.md` | solo el frontmatter; R1–R18 intactos |

## Output de `./init.sh`

Ejecutado por mí de principio a fin. **Exit code 0.**

```
══════════════════════════════════════════
  INIT — pet-tracker (Harness SDD)
══════════════════════════════════════════
→ Verificando entorno...
✅ node disponible
✅ pnpm disponible
→ Verificando variables de entorno...
✅ .env encontrado
✅   DATABASE_URL definida
⚠️  .env desactualizado: faltan 4 claves de .env.example
⚠️    configuración ausente: AWS_MODE, SIM_HOME_LAT, SIM_HOME_LNG, SIM_SEED
→ Instalando dependencias...
✅ Dependencias instaladas
→ Verificando coherencia del harness...
✅ Archivos del harness presentes
⚠️  Feature en progreso: device-subscriptions
⚠️  STATUS.md desactualizado (26/30 declarado vs 25/30 real) — actualízalo antes de cerrar la sesión
→ Build...
✅ Build exitoso            (nest build + tsc-alias + cdk synth --quiet)
→ Ejecutando tests...
Test Suites: 136 passed, 136 total
Tests:       1000 passed, 1000 total          (backend unit)

Test Suites: 2 passed, 2 total
Tests:       14 passed, 14 total              (infra)

ℹ skipped 0                                   (harness, 28 tests)

Test Suites: 2 skipped, 18 passed, 18 of 20 total
Tests:       6 skipped, 292 passed, 298 total (e2e)
Time:        83.344 s
✅ Tests e2e pasados
→ Lint...
✅ Lint sin errores
→ Typecheck...
✅ Typecheck sin errores
══════════════════════════════════════════
✅ Todo verde. Listo para trabajar.
  Features: 25/30 completadas | 4 pendientes
  Próxima feature: [#28] test-dev-resource-isolation (P2)

EXIT=0
```

Las cifras coinciden **exactamente** con las del reporte del implementer. Las
dos advertencias (`⚠️`) no son fallos: la deriva de `.env` es preexistente de
#23 y no la introduce esta feature (R14 confirma cero variables nuevas), y la
de `STATUS.md` es la observación **O1**.

Nota sobre ruido en el log: aparecen `ERROR` de Nest en la salida
(`ECONNREFUSED 127.0.0.1:4566` del poller antes de levantar LocalStack, y una
violación de FK `pet_users_user_id_users_id_fk`). Son rutas de error
ejercitadas a propósito por tests que **pasan** — el recuento final no tiene
ningún test fallido. No es la carrera de arranque de infra fría: la infra
llevaba una hora caliente.

El árbol de trabajo quedó limpio tras `init.sh` (`git status --porcelain` solo
muestra `.agents/`, `.codex/` y `skills-lock.json`, no rastreados y ajenos a la
feature). El `eslint --fix` de `init.sh` no modificó nada.

---

## Observaciones (ninguna bloquea la aprobación)

- **O1 — `STATUS.md` incoherente con `feature_list.json`.** Declara "26/30",
  "**En progreso**: ninguna" y una entrada "`device-subscriptions` (#25) done";
  el estado real es 25/30 con #25 `in_progress`. Lo detecta el propio
  `init.sh`. Es residuo del cierre prematuro de Codex, no un defecto de la
  implementación. Ver §Acciones de cierre.
- **O2 — `progress/history.md` tiene ya la entrada de cierre de #25**, escrita
  antes del gate y terminada en "**Estado final:** done." Duplica el estado que
  `current.md` describe como sesión activa. Su contenido técnico es correcto
  (verificado afirmación por afirmación en §3); sobra la declaración de cierre.
- **O3 — 2 commits de 54 sin R-id** (C5): `ee6c2df` ("satisfy subscription e2e
  lint") y `9ea58cd` ("close feature lifecycle"). Ninguno porta requisito: el
  primero queda trazado por `c63f236` (R1,R4) y el segundo es el bookkeeping
  revertido. Los 18 requisitos tienen sus commits con R-id correctos.
- **O4 — dos imprecisiones menores en `traceability.md`**, ambas conservadoras
  (no ocultan nada):
  - el grep de R16 registrado usa `-g "*/infrastructure/mappers/*.ts"` y
    reporta `NO_MATCHES`; con un glob más ancho sí hay 2 coincidencias, en
    `device-error.mapper.ts`, que **R7 exige**. La conclusión de R16 se
    sostiene (§7), pero el comando registrado no la reproduce tal cual.
  - la salida de R2 dice "10 coincidencias"; el grep real devuelve 11 líneas
    (el predicado aporta 3, no 2, al partirse en dos líneas físicas).
- **O5 — el e2e de seguridad de R9 no discrimina el orden de guards.** En
  `device-subscriptions.e2e-spec.ts:254` la mascota del owner **sí** tiene
  suscripción vigente, así que un `PetTrackingGuard` colocado por delante
  también devolvería 404 y el test pasaría igual. El caso que sí discriminaría
  es no-miembro sobre mascota **sin** entitlement. No es bloqueante: el punto 4
  de §1 demuestra que el 402 es inalcanzable sin `petMembership`, cuyo único
  escritor es `PetAccessGuard` tras validar membresía — la fuga es imposible por
  construcción, no por orden. Además el test reproduce **literalmente** el
  escenario que fija R8, que es una spec aprobada. Anotado como deuda de test
  para quien vuelva a tocar los guards.

## Acciones de cierre para el leader (obligatorias antes de marcar `done`)

1. **`STATUS.md`**: rehacer contadores a 26/30, "En progreso: ninguna" y la
   fecha, **una vez** `feature_list.json` marque #25 `done`. El texto técnico
   de las dos entradas que escribió Codex es correcto y puede conservarse tal
   cual (verificado en §3).
2. **`progress/history.md`**: la entrada de #25 puede conservarse; conviene
   sustituir "**Estado final:** done." por la referencia al veredicto de este
   review, y vaciar `progress/current.md` a la plantilla en el mismo cierre,
   para que no queden las dos descripciones simultáneas de la misma sesión.

Ninguna de las dos toca código de la aplicación; ambas son bookkeeping del
leader (`AGENTS.md` §7.2).

## Pendiente de verificación humana (no lo cierra ningún agente)

Registrado en `traceability.md` §Verificación manual y **no cubierto por esta
revisión**:

- Smoke de GPS real sobre la unidad Wialon `401775970` tras el backfill de R17
  (exige `SIM_MODE=false`, token real y hardware). El backfill está verificado
  en base (§8), pero el smoke end-to-end no.
- `subscription:set` contra ese mismo collar real.

---

## Conclusión

Los 18 requisitos están implementados, verificados y trazados. Los tres riesgos
caros que el leader marcó — la fuga de existencia por un 402 adelantado, el
historial TDD que Codex incumplió en #19, y el apagón del entorno local al
migrar — están los tres cerrados, y el primero con una garantía **estructural**
más fuerte que la que pedía la spec. El único residuo es bookkeeping de
`STATUS.md`/`history.md` que el leader ya había identificado y que corresponde
al cierre, no a la implementación.

**APROBADO.**
