---
feature: "device-provisioning-admin"
status: draft        # draft | approved
tags: [harness, spec]
---

# Tareas — [[device-provisioning-admin]]

> Disciplina TDD (`docs/verification.md`). Cada tarea corresponde a un
> requisito de [[requirements]] y tiene siempre los mismos 3 sub-items, en
> este orden.
>
> **Cada test nombra su requisito**:
> `describe('R<n> (device-provisioning-admin #24): ...')`.
>
> **Commits test-primero, uno por bloque rojo→verde.** `CHECKPOINTS.md` C4
> exige que el historial muestre el patrón; meter tests + implementación +
> docs en un solo commit es motivo de rechazo del reviewer (pasó en #19).
>
> `test/provision-device.e2e-spec.ts` necesita Docker levantado
> (`docker compose up -d`). **Ningún test toca la red ni el token real**: el
> `WialonClient` se inyecta como stub ([[design]] §Test).
>
> Orden recomendado: R4 primero (el generador es la única dependencia de
> `src/` del script), luego R5, luego R1-R3, y R6-R7 al final sobre el
> script ya funcionando.

## R4 — `generateActivationCode()` aleatorio, base32, aridad cero

- [x] (1) Escribir test que falla para R4 —
      `src/modules/devices/application/activation-code.spec.ts`: formato
      `/^PT-[0-9A-HJKMNP-TV-Z]{10}$/`, `generateActivationCode.length === 0`,
      1000 llamadas → `new Set(...).size === 1000`
- [x] (2) Implementación mínima que lo pasa —
      `src/modules/devices/application/activation-code.ts` ([[design]] D3)
- [x] (3) Refactor con tests verdes — `pnpm -C backend-pet-tracker test`
      completo sigue verde (no se ha tocado nada más)

## R5 — El camino es interno: sin ruta HTTP y con guarda contra el simulador

- [x] (1) Escribir test que falla para R5 —
      `test/provision-device.e2e-spec.ts`: `assertRealWialonClient(new
      FakeWialonClient({ seed: 1, homeLat: 0, homeLng: 0 }))` lanza
      `SimulatedWialonClientError`; `assertRealWialonClient(new
      WialonHttpClient('https://wialon.test', 'token'))` no lanza
- [x] (2) Implementación mínima que lo pasa — `assertRealWialonClient()` y
      `SimulatedWialonClientError` en `scripts/provision-device.ts`
- [x] (3) Refactor con tests verdes — confirmar que no se creó ni modificó
      ningún `*.controller.ts` (la otra mitad de R5 es una ausencia:
      `git diff --stat` no debe listar ningún controller)

## R1 — Alta de un collar real en `devices`

- [x] (1) Escribir test que falla para R1 —
      `test/provision-device.e2e-spec.ts`, caso "alta de un collar nuevo"
      de la tabla de [[design]] §Test
- [x] (2) Implementación mínima que lo pasa — `provisionDevice()` +
      `main()` con `parseArgs` en `scripts/provision-device.ts`, y el script
      `provision:device` en `backend-pet-tracker/package.json` ([[design]] D4)
- [x] (3) Refactor con tests verdes

## R2 — Verificación contra `listUnits()` antes de insertar

- [x] (1) Escribir test que falla para R2 — caso "unidad inexistente":
      rechaza con `WialonUnitNotFoundError` **y** el conteo de filas de
      `devices` no cambia
- [x] (2) Implementación mínima que lo pasa — `listUnits()` +
      `WialonUnitNotFoundError` antes del `INSERT`
- [x] (3) Refactor con tests verdes

## R3 — Idempotente por `wialon_unit_id`; colisión de otro identificador falla

- [x] (1) Escribir tests que fallan para R3 — casos "segunda ejecución"
      (mismo `deviceId`, mismo `activationCode`, mismo `updatedAt`, una sola
      fila) y "colisión de IMEI" (error `23505`, sin fila nueva)
- [x] (2) Implementación mínima que lo pasa — `SELECT` previo por
      `wialon_unit_id` con retorno temprano `{ created: false }`, sin
      `onConflictDoNothing`
- [x] (3) Refactor con tests verdes

## R6 — Coexistencia con `seed-devices.ts`

- [x] (1) Escribir test que falla para R6 — caso "coexistencia con el seed":
      tras `seedSimulatedDevices(db)`, la fila aprovisionada sigue con
      `isSimulated === false` y su `activationCode` intacto; SIM-001..003
      con `isSimulated === true`
- [x] (2) Implementación mínima que lo pasa — **ninguna**: si el test es
      rojo, el bug está en `provisionDevice()`, no en el seed
      (`scripts/seed-devices.ts` y `src/db/seed/simulated-devices.ts` no se
      tocan, por spec)
- [x] (3) Refactor con tests verdes — `git diff` no debe listar ninguno de
      esos dos archivos

## R7 — El collar aprovisionado se reclama con el flujo de #7 sin cambios

- [x] (1) Escribir test que falla para R7 — caso "claim end-to-end":
      `POST /v1/devices/claim` con `{ petId, activationCode }` → `201`,
      fila activa en `pet_devices`, `devices.status === 'assigned'`
- [x] (2) Implementación mínima que lo pasa — **ninguna** en
      `src/modules/devices/`: si el test es rojo, el aprovisionamiento está
      generando filas que el claim no entiende y hay que arreglar
      `provisionDevice()`
- [x] (3) Refactor con tests verdes — `pnpm -C backend-pet-tracker run
      test:e2e` completo (incluido `test/devices.e2e-spec.ts` de #7) sigue
      verde

## R8 — Documentación de los dos caminos

- [x] (1) N/A (requisito documental, sin test automatizado — lo verifica el
      reviewer leyendo)
- [x] (2) `docs/data-model.md` fila `devices`: seed simulado vs
      aprovisionamiento real, distinguidos por `is_simulated`;
      `docs/wialon-module.md`: `listUnits()` tiene un segundo consumidor
      (el script de aprovisionamiento, como verificación de existencia)
- [x] (3) Commit `docs(device-provisioning-admin): ... (R8)` aparte del
      commit de código

## Cierre — no lo hace ninguna IA

- [ ] Ejecución real: el humano corre `pnpm -C backend-pet-tracker run
      provision:device -- --unit-id <unidad real>` con `SIM_MODE=false` y el
      token real, y comprueba el alta contra la cuenta y el claim desde la
      app. Ver [[requirements]] §Fuera de alcance.
