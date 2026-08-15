---
feature: "claim-activation-code-only"
status: draft        # draft | approved
tags: [harness, spec]
---

# Tareas — [[claim-activation-code-only]]

> Disciplina TDD (`docs/verification.md`). Cada tarea corresponde a un
> requisito de [[requirements]] y tiene siempre los mismos 3 sub-items, en
> este orden.
>
> **Cada test nuevo nombra su requisito**:
> `describe('R<n> (claim-activation-code-only #26): ...')`. Los tests de #7
> que se actualizan conservan su numeración de #7 salvo donde [[design]] D5
> indica renombrarlos.
>
> **Commits test-primero, uno por bloque rojo→verde.** `CHECKPOINTS.md` C4
> exige que el historial muestre el patrón; meter tests + implementación +
> docs en un solo commit es motivo de rechazo del reviewer (pasó en #19).
> Los tests marcados 🔴 en [[design]] D5 son cambios de comportamiento
> esperado: van en el commit rojo, igual que un test nuevo. Los ⚪ son
> ediciones de datos de prueba y pueden viajar con el commit verde.
>
> **Infra**: `test/devices.e2e-spec.ts` necesita Postgres arriba
> (`docker compose up -d` desde la raíz del repo). En la sesión que escribió
> esta spec `init.sh` saltó los e2e porque Docker estaba apagado — un run
> que los salta **no es evidencia**; comprobar con `docker port` que el
> puerto de Postgres está publicado antes de dar nada por verde.
>
> Orden recomendado: R1 y R3 primero (schema + DTO, unit, sin Docker), luego
> R5 (dominio, lo destraba el compilador), luego R2/R4/R6 (e2e con Docker
> arriba), R7 y R8 al final.

## R1 — `ClaimDeviceSchema` con `activationCode` obligatorio y sin los otros tres

- [ ] (1) Escribir test que falla para R1 —
      `src/modules/devices/application/dto/claim-device.dto.spec.ts`, filas
      1, 2 y 5 de [[design]] D5 (las 🔴): `acepta petId + activationCode`
      con `Object.keys(result.data).sort() === ['activationCode','petId']`;
      `it.each(['esn','imei','serialNumber'])` sin `activationCode` →
      `success: false` con un issue de `path[0] === 'activationCode'`;
      `ignora imei/esn/serialNumber junto al activationCode` → `success: true`
      con las tres claves ausentes de `result.data`
- [ ] (2) Implementación mínima que lo pasa —
      `claim-device.dto.ts`: `ClaimDeviceSchema` pasa a
      `z.object({ petId: z.uuid(), activationCode: ActivationCodeSchema })`,
      **sin `.optional()`** y sin `superRefine` ([[design]] D3)
- [ ] (3) Refactor con tests verdes — aplicar las filas ⚪ 3, 4 y 6 de D5
      (renombres y cambio de `esn` a `activationCode` en los casos de datos)
      y comprobar que el `describe` queda con la numeración de D5

## R3 — `toDeviceIdentifier` devuelve siempre `activationCode`

- [ ] (1) Escribir test que falla para R3 — el `describe` de
      `claim-device.dto.spec.ts` L66-78 ya asertaba
      `{field:'activationCode', value:'ACT-001'}`: renombrarlo según la fila
      7 de D5. El test rojo real de este requisito es la fila 9 de D5,
      `claim-device.use-case.spec.ts:106-109` →
      `toHaveBeenCalledWith({ field: 'activationCode', value: 'ACT-001' })`
      (con `DTO` actualizado, fila 8)
- [ ] (2) Implementación mínima que lo pasa — `toDeviceIdentifier` de una
      línea, sin bucle y sin el `throw` inalcanzable ([[design]] D3)
- [ ] (3) Refactor con tests verdes — verificar con `git diff --stat` que
      `claim-device.use-case.ts` **no aparece** en el diff (mitad de R3 que
      es una ausencia)

## R5 — `DEVICE_IDENTIFIER_FIELDS` desaparece; el tipo conserva sus 4 miembros

- [ ] (1) Escribir test que falla para R5 — este requisito es una ausencia y
      un tipo; no lleva test unitario propio. La verificación es:
      `grep -rn "DEVICE_IDENTIFIER_FIELDS" backend-pet-tracker/src backend-pet-tracker/test`
      sin resultados y `pnpm -C backend-pet-tracker run build` verde. El
      test rojo que lo empuja es el de R4 (repositorio), abajo
- [ ] (2) Implementación mínima que lo pasa —
      `domain/repositories/device.repository.ts`: borrar el array, declarar
      `DeviceIdentifierField` como unión literal de los 4 valores, reescribir
      los comentarios de L5-9 y L19 ([[design]] D3)
- [ ] (3) Refactor con tests verdes — `pnpm -C backend-pet-tracker test`
      completo verde; confirmar que `device.drizzle.repository.ts` sigue sin
      tocar y que `IDENTIFIER_COLUMNS` conserva sus 4 entradas

## R2 — Ningún claim tiene éxito por `imei`, `esn` ni `serialNumber` (e2e)

- [ ] (1) Escribir test que falla para R2 — `test/devices.e2e-spec.ts`,
      `describe('R2 (claim-activation-code-only #26): imei, esn y serialNumber no reclaman nada')`
      con el `it.each` de los tres campos descrito en [[design]] D5
      §Tests nuevos (400 + cero filas + status `available` + cero auditoría,
      y luego 201 con el `activationCode`). Requiere antes la fila 10 de D5
      (`seedDevice()` puebla los 4 identificadores). Contra el código actual
      las tres iteraciones dan `201` en la primera llamada: rojo claro
- [ ] (2) Implementación mínima que lo pasa — ya la da R1; si R1 está hecho,
      este bloque pasa a verde sin tocar `src/`. Añadir aquí también el
      `describe` de R1c (`imei` ajeno junto al `activationCode` correcto →
      `201` sobre el device del código, no sobre la víctima)
- [ ] (3) Refactor con tests verdes — `pnpm -C backend-pet-tracker test:e2e`
      (o el runner de `init.sh`) con Docker arriba

## R4 — `findByIdentifier` conserva sus 4 campos (e2e)

- [ ] (1) Escribir test que falla para R4 — `test/devices.e2e-spec.ts`,
      `describe('R4 (claim-activation-code-only #26): findByIdentifier sigue buscando por los 4 campos')`
      usando `app.get<DeviceRepository>(DEVICE_REPOSITORY)` ([[design]] D4
      para los imports): los 4 `field` devuelven el mismo `Device`,
      `{field:'imei', value:'no-existe'}` devuelve `null`. Es el test que
      falla en compilación si R5 se implementa mal (tipo reducido a un
      miembro)
- [ ] (2) Implementación mínima que lo pasa — ninguna en `src/`: el
      requisito es que la capacidad **no** se pierda. Si hace falta tocar
      `device.drizzle.repository.ts` para que pase, R5 se implementó mal
- [ ] (3) Refactor con tests verdes — suite completa verde

## R6 — El camino feliz y los códigos de error de #7 no cambian

- [ ] (1) Escribir test que falla para R6 — no hay test nuevo: son los
      `describe` R3 y R5-R15 de `test/devices.e2e-spec.ts` con la credencial
      sustituida (fila 11 de D5) más la fila 12 (renombre y ajuste del
      `describe` R4 de #7). Rojos contra el código actual solo en el sentido
      de que el `activationCode` no era la credencial esperada
- [ ] (2) Implementación mínima que lo pasa — ninguna: R1 ya la cubre
- [ ] (3) Refactor con tests verdes — verificar explícitamente que
      `CLAIM_KEYS` (L250-256), las 3 assertions de respuesta con `esn`
      (L295, L565, L661) y el bloque `R2: seed:devices` (L145-273) siguen
      **byte a byte igual** en el diff

## R7 — Los tests de #7 quedan actualizados, no borrados

- [ ] (1) Escribir test que falla para R7 — no aplica: es un requisito de
      proceso sobre el diff. Verificación: recorrer las 13 filas de
      [[design]] D5 y comprobar que cada `it`/`describe` original sigue en su
      archivo o tiene su reemplazo nombrado
- [ ] (2) Implementación mínima que lo pasa — rellenar [[traceability]] con
      una fila por cada test 🔴 de D5, con la justificación de por qué el
      comportamiento viejo dejó de ser correcto
- [ ] (3) Refactor con tests verdes — `git diff --stat` no muestra ninguna
      caída neta de `it(` en los tres archivos de test salvo las dos
      sustituciones nombradas (filas 1 y 5 de D5), y ambas están
      justificadas en [[traceability]]

## R8 — `docs/data-model.md` documenta la credencial única

- [ ] (1) Escribir test que falla para R8 — no aplica (cambio documental,
      lo valida el reviewer leyendo la fila)
- [ ] (2) Implementación mínima que lo pasa — reescribir la fila `devices`
      de `docs/data-model.md` (L51): la única credencial de
      `POST /v1/devices/claim` es `activation_code`; `esn`, `imei` y
      `serial_number` siguen `UNIQUE` como identificadores de inventario y
      de búsqueda interna (`findByIdentifier`), no de autorización.
      Actualizar en el mismo commit el comentario de
      `src/db/schema/devices.schema.ts:16-18`, que dice lo contrario
- [ ] (3) Refactor con tests verdes — `pnpm -C backend-pet-tracker run lint`
      y la suite completa verdes; escribir `progress/impl_claim-activation-code-only.md`
      con el resumen y los hashes
