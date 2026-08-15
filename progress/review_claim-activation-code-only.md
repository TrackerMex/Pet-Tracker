# review: claim-activation-code-only

Fecha: 2026-08-15
Feature: #26 `claim-activation-code-only`
Branch: `feature/26-claim-activation-code-only`
Rango revisado: `cc89690..3c03a21` (12 commits, `740a0d4`..`3c03a21`)
Veredicto: **APROBADO**

---

## Checklist C2 — Estado coherente

- [x] Solo 1 feature `in_progress` en `feature_list.json` (#26; las otras 8 no-done están en `pending`)
- [x] `progress/current.md` describe la sesión activa (#26, plan con el paso 4 = review pendiente)
- [x] Toda feature `done` conserva su cobertura — la suite completa quedó verde (ver §Output)

## Checklist C3 — Arquitectura

- [x] `domain/repositories/device.repository.ts` importa únicamente `Device` de `../entities/device.entity`; cero imports de ORM/HTTP/IO
- [x] El contrato en domain sigue siendo interfaz pura: `DeviceRepository` sin implementación; `DeviceIdentifierField` pasó de derivarse de un `as const` a unión literal, sin ganar dependencias
- [x] `application/dto/claim-device.dto.ts` depende de `zod` + del tipo `DeviceIdentifier` del domain, nunca de `DeviceDrizzleRepository`
- [x] `infrastructure/` no se tocó: `device.drizzle.repository.ts`, `devices.controller.ts`, `device-error.mapper.ts` y `device-status.mapper.ts` **no aparecen en `git diff --stat cc89690..HEAD`**. `IDENTIFIER_COLUMNS` conserva sus 4 entradas (`device.drizzle.repository.ts:24-29`)

## Checklist C4 — TDD

- [x] Cada R\<n\> tiene al menos un test que lo nombra:
  - R1 → `claim-device.dto.spec.ts::describe('R1 (claim-activation-code-only #26): ...')`
  - R2 → `devices.e2e-spec.ts::describe('R2 (claim-activation-code-only #26): imei, esn y serialNumber no reclaman nada')` + `describe('R1c (claim-activation-code-only #26): ...')`
  - R3 → `claim-device.dto.spec.ts::describe('R3 (claim-activation-code-only #26): ...')` + `claim-device.use-case.spec.ts::R3` (assertion `findByIdentifier` con `{field:'activationCode'}`)
  - R4 → `devices.e2e-spec.ts::describe('R4 (claim-activation-code-only #26): findByIdentifier sigue buscando por los 4 campos')`
  - R5, R7, R8 → N/A como test, autorizado explícitamente por `tasks.md` y `traceability.md`; verificados aquí por diff/grep/lectura
  - R6 → los `describe` R3 y R5-R15 heredados de #7, verdes
- [x] Historial test-primero, no todo junto (12 commits granulares):
  - **R1**: `740a0d4` (test, **solo** `claim-device.dto.spec.ts`) → `cd33883` (impl). Rojo verificado por construcción: contra `cc89690`, `it.each(['esn','imei','serialNumber'])` esperaba `success:false` donde el schema viejo devolvía `true`, y `ignora imei/esn/serialNumber…` esperaba `success:true` donde el `superRefine` devolvía `false`
  - **R3**: `5841d71` (test, **solo** `claim-device.use-case.spec.ts`) → `a81e01f` (impl). Rojo: con `toDeviceIdentifier` aún recorriendo `DEVICE_IDENTIFIER_FIELDS` y `DTO = {petId, esn:'SIM-001'}`, la llamada era `{field:'esn', value:'SIM-001'}` frente al `{field:'activationCode', value:'ACT-001'}` esperado
  - Las ediciones ⚪ de datos de prueba que viajan en los commits verdes (`cd33883`, `a81e01f`) están **expresamente autorizadas** por `tasks.md` línea 23
- [x] `4e54939 style(...)`: **verificado línea a línea, es solo formato**. Reformatea 2 bloques de `claim-device.dto.spec.ts` (saltos de línea de prettier), colapsa la unión `DeviceIdentifierField` a una línea conservando **sus cuatro miembros**, y sustituye el placeholder `este commit` por `a9f62c0` en `traceability.md`. Cero cambio funcional, cero cambio de assertion

## Checklist C5 — Trazabilidad

- [x] `traceability.md` sin ninguna fila "pendiente" en la columna Commit (los 2 hits de `grep pendiente` son prosa de la propia regla, no celdas)
- [x] Las dos tablas están completas: 8 filas de requisitos + 7 filas de tests de #7 actualizados con su justificación
- [x] Formato de commits conforme a `docs/conventions.md` §Commits: `test|feat|refactor|docs(claim-activation-code-only): <desc> (R-ids)`

## Checklist C6 — Spec aprobada

- [x] `specs/claim-activation-code-only/requirements.md` con `status: approved`
- [x] Casilla `[X] Aprobado por humano (fecha: 26-08-15)` marcada
- [x] Ningún requisito modificado tras la aprobación: `git log -- specs/claim-activation-code-only/requirements.md` termina en `7663a3e` (el propio commit de aprobación), anterior a `740a0d4`

## Checklist C7 — Sin código huérfano

- [x] El símbolo reemplazado, `DEVICE_IDENTIFIER_FIELDS`, fue **eliminado**, no reducido ni conservado "por si acaso"
- [x] `grep -rn "DEVICE_IDENTIFIER_FIELDS" backend-pet-tracker/src backend-pet-tracker/test` → **cero resultados**
- [x] No quedan tests de código eliminado: el array no tenía spec propia y su único consumidor (`claim-device.dto.ts`) se reescribió en la misma feature
- [x] El `superRefine` XOR y el `throw new Error('ClaimDeviceDto without device identifier')` inalcanzable desaparecieron con él

---

## Verificación de los puntos críticos de la spec

### R3 / R4 — la mitad que es una ausencia

`git diff --stat cc89690..HEAD` lista 10 archivos. **Ninguno de los cinco prohibidos aparece**:
`claim-device.use-case.ts`, `device.drizzle.repository.ts`, `devices.controller.ts`,
`device-error.mapper.ts`, `device-status.mapper.ts`. Confirmado.

### R5 — el tipo conserva su capacidad

`DeviceIdentifierField` mantiene sus **cuatro** miembros (`'esn' | 'imei' | 'serialNumber' | 'activationCode'`).
No se redujo a uno, así que `IDENTIFIER_COLUMNS` sigue con sus 4 entradas tipadas y
`findByIdentifier({field:'imei'})` sigue compilando. El test e2e de R4 lo ejerce en runtime
contra Postgres real: los 4 `field` devuelven el mismo `Device` y `{field:'imei', value:'no-existe'}` devuelve `null`.

### R6 — regresión de contrato, byte a byte

- `describe('R2: seed:devices …')` (viejo L145-273 → nuevo L152-280): **md5 idéntico**
  (`dba7b0c507389bfd2860e4ef8fb9b559`), byte a byte
- `CLAIM_KEYS` intacto con sus 5 claves incluida `'esn'` (nuevo L257-263); ningún hunk
  del diff `-U0` toca el rango viejo 127-280
- Las 3 assertions de respuesta `esn: device.esn` dentro de `toEqual` sobreviven
  (viejo L295/L565/L661 → nuevo L302/L708/L807); la cuarta ocurrencia superviviente (L344)
  es el caso legado que `design.md` D5 fila 12 manda **conservar** en el `describe` R4 de #7

### R7 — ningún test borrado ni comentado

Recorridas las 13 filas de `design.md` D5 comparando `describe`/`it` de `cc89690` contra HEAD
en los 3 archivos. Ningún bloque desaparece:

- `devices.e2e-spec.ts`: los 15 `describe` de #7 y sus 22 `it` siguen todos, con `R4` renombrado
  según D5 fila 12; se **suman** 3 `describe` nuevos
- `claim-device.dto.spec.ts`: las dos sustituciones nombradas (D5 filas 1 y 5) están hechas con
  su reemplazo, y el archivo pasa de 7 a 8 `it` — **saldo neto positivo**
- `claim-device.use-case.spec.ts`: los 12 `it` intactos, solo cambian `DTO` y una assertion

`traceability.md` §"Tests de #7 actualizados" tiene una fila por cada test 🔴 con la justificación
de por qué el comportamiento viejo dejó de ser correcto. Ninguna fila "pendiente".

### La propiedad de seguridad, probada de verdad (R2)

`test/devices.e2e-spec.ts`, `describe('R2 (claim-activation-code-only #26): …')`,
`it.each(['imei','esn','serialNumber'])`. Sobre un device **sembrado con los cuatro
identificadores poblados, `status: 'available'` y sin fila en `pet_devices`** — es decir,
perfectamente reclamable — el test verifica, por cada campo:

1. `claim(owner, { petId, [field]: device[field] })` → `400`
2. `petDevices` where `deviceId = device.id` → 0 filas
3. `devices.status` sigue `'available'`
4. `auditLog` where `action='device.claim' AND entityId=device.id` → 0 entradas
5. **Acto seguido**, `claim(owner, { petId, activationCode: device.activationCode })` → `201`

El paso 5 es el que cierra el argumento: el `400` es por credencial rechazada, no por un
device en mal estado. Cada iteración usa device y mascota nuevos, así que el `201` de una
no contamina la siguiente. `describe('R1c …')` complementa: un `imei` de víctima junto al
`activationCode` del atacante reclama el device del **código**, y la víctima sigue
`'available'` y sin fila. La pareja de assertions existe y prueba lo que dice.

### R8 — documentación coherente entre sí

Ambos sitios dicen lo mismo y no se contradicen:

- `docs/data-model.md` fila `devices`: *"La única credencial de `POST /v1/devices/claim` es
  `activation_code`; `esn`, `imei` y `serial_number` siguen siendo identificadores UNIQUE de
  inventario y búsqueda interna mediante `findByIdentifier`, no de autorización."*
- `src/db/schema/devices.schema.ts` L16-18: *"el claim solo busca por `activation_code` (#26),
  mientras los demas identifican inventario y permiten busquedas internas."*

Ninguna migración de DDL, como exige la spec.

---

## Observaciones

Ninguna bloqueante. Dos notas para el registro, ambas conformes a la spec aprobada:

1. **Los tests e2e de R2/R4 (`8c5948a`, `ee429be`, `86d918b`) se commitearon después de la
   implementación de R1**, así que nacieron verdes en vez de rojos. No es una desviación del
   implementador: `tasks.md` §R2 paso (2) lo prescribe literalmente (*"ya la da R1; si R1 está
   hecho, este bloque pasa a verde sin tocar `src/`"*) y el orden recomendado de `tasks.md`
   línea 31 pone los e2e después. Siguen siendo tests que fallan contra `cc89690` (allí
   `{petId, esn}` daba `201`, no `400`), o sea regresiones válidas. El patrón rojo→verde
   exigido por C4 está demostrado en R1 y R3 con commits de test puros.
   *Para futuras specs de seguridad: vale la pena que el e2e que prueba el agujero vaya
   primero, aunque la implementación que lo cierra sea la misma que la del requisito unitario.*

2. **`4e54939` colapsa la unión `DeviceIdentifierField` a una sola línea**, mientras que
   `design.md` D3 la mostraba multilínea. Es la salida de prettier, semánticamente idéntica y
   con los cuatro miembros intactos. El diseño no normaba el formato.

---

## Output de `./init.sh`

Corrido por el reviewer, no tomado del reporte del implementador. Infra caliente y verificada
antes de correr: `docker port` muestra `5432/tcp -> 0.0.0.0:5432` (postgres `healthy`, ~1h de
uptime) y `4566` publicado para LocalStack — los e2e **no** se saltaron.

```
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
✅ STATUS.md sincronizado con feature_list.json

→ Build...
✅ Build exitoso

→ Ejecutando tests...
Test Suites: 133 passed, 133 total
Tests:       956 passed, 956 total
Snapshots:   0 total

Test Suites: 2 passed, 2 total
Tests:       14 passed, 14 total
Snapshots:   0 total
✅ Tests pasados

→ Tests e2e...
Test Suites: 2 skipped, 17 passed, 17 of 19 total
Tests:       6 skipped, 260 passed, 266 total
Snapshots:   0 total
Time:        72.698 s
Ran all test suites.
✅ Tests e2e pasados

→ Lint...
✅ Lint sin errores

→ Typecheck...
✅ Typecheck sin errores

══════════════════════════════════════════
✅ Todo verde. Listo para trabajar.

  Features: 21/30 completadas | 8 pendientes
```

`exit code 0`.

**Comparación contra el baseline pre-implementación de la sesión (255 passed, 6 skipped, 0 fallos):**
ahora **260 passed, 6 skipped, 0 fallos**. El delta de `+5` cuadra exactamente con los tests
nuevos de la feature: 3 (el `it.each` de R2 sobre `imei`/`esn`/`serialNumber`) + 1 (R1c) + 1 (R4).
**Cero regresiones.**

Nota sobre el log: aparece un `ERROR [ExceptionsHandler] DrizzleQueryError … pet_users_user_id_users_id_fk`
en la salida de los e2e. Es la carrera de arranque conocida del proyecto, **no una regresión**:
ninguna suite ni test falló (266 = 260 passed + 6 skipped, 0 failed) y el runner terminó en 0.

---

## Cierre

Los 8 requisitos (R1-R8) están implementados, probados y trazados; C2-C7 pasan; `init.sh`
verde corrido de forma independiente con la infra publicada. El hueco de seguridad de #7
—reclamar un collar ajeno con un `imei` enumerable— queda cerrado y con test e2e que lo
demuestra sobre Postgres real.

**APROBADO.** Queda para el `leader`: marcar #26 `done` en `feature_list.json`, actualizar
`STATUS.md` y `progress/history.md`, y abrir el PR (el humano mergea).
