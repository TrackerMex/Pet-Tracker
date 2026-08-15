---
feature: "claim-activation-code-only"
status: draft        # draft | approved
tags: [harness, spec]
---

# Trazabilidad — [[claim-activation-code-only]]

> Rutas relativas a `backend-pet-tracker/`. Los tests **nuevos** nombran su
> requisito como `R<n> (claim-activation-code-only #26): ...` (ver [[tasks]]).

## Requisitos

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `src/modules/devices/application/dto/claim-device.dto.spec.ts::R1 (claim-activation-code-only #26): acepta petId + activationCode` + `::rechaza petId + %s sin activationCode (R1b)` (`it.each` de esn/imei/serialNumber) + `::ignora imei/esn/serialNumber si vienen junto al activationCode (R1c #26)` | rojo `740a0d4`; verde `cd33883` (`feat(claim-activation-code-only): require activation code in claim schema (R1)`) |
| R2 | `test/devices.e2e-spec.ts::R2 (claim-activation-code-only #26): imei, esn y serialNumber no reclaman nada` (`it.each` de los tres campos) y `::R1c (claim-activation-code-only #26): un imei ajeno junto al activationCode correcto se ignora` | pendiente |
| R3 | `src/modules/devices/application/use-cases/claim-device.use-case.spec.ts::R3 (claim feliz) delega en el repositorio y devuelve el device reclamado` (assertion `findByIdentifier` llamado con `{field:'activationCode', value:'ACT-001'}`) + `claim-device.dto.spec.ts::R3 (claim-activation-code-only #26): toDeviceIdentifier devuelve siempre activationCode`. La otra mitad (`claim-device.use-case.ts` sin tocar) la verifica el reviewer en `git diff --stat` | rojo `5841d71`; verde `a81e01f` (`feat(claim-activation-code-only): always lookup activation code (R3)`) |
| R4 | `test/devices.e2e-spec.ts::R4 (claim-activation-code-only #26): findByIdentifier sigue buscando por los 4 campos` | pendiente |
| R5 | N/A como test unitario (el requisito es una ausencia + un tipo): `grep -rn "DEVICE_IDENTIFIER_FIELDS" src test` sin resultados y `pnpm -C backend-pet-tracker run build` verde; el test de R4 falla en compilación si el tipo se redujo a un miembro. Verificado por el reviewer en el diff | verde este commit (`refactor(claim-activation-code-only): separate repository identifiers from claim policy (R5)`) |
| R6 | `test/devices.e2e-spec.ts` `describe` R3 y R5-R15 de `devices-claim` (#7) verdes con la credencial sustituida, y `CLAIM_KEYS` / las 3 assertions de respuesta con `esn` / el bloque `R2: seed:devices` sin modificar | pendiente |
| R7 | N/A (requisito de proceso sobre el diff): se cierra con la tabla §Tests de #7 actualizados de abajo, completa y sin filas "pendiente" | pendiente |
| R8 | N/A (cambio documental en `docs/data-model.md` fila `devices` y en el comentario de `src/db/schema/devices.schema.ts:16-18`, verificado por revisión manual del reviewer) | pendiente |

## Tests de #7 actualizados, no borrados (R7)

> Una fila por cada test de `devices-claim` (#7) cuyo **comportamiento
> esperado** cambia (las 🔴 de [[design]] D5). Las ediciones de datos de
> prueba (⚪) no necesitan fila. El reviewer rechaza si algún `it` de #7
> desapareció del árbol sin aparecer aquí con su justificación.

| Test de #7 | Qué afirmaba | Por qué dejó de ser correcto | Qué afirma ahora | Commit |
|---|---|---|---|---|
| `claim-device.dto.spec.ts::R4: acepta petId + %s como unico identificador` (`it.each` de los 4 campos) | Los cuatro identificadores son credenciales válidas de claim | Es exactamente el hueco de #26: `imei` es enumerable en un lote de fábrica, así que "válido como credencial" equivale a "reclamable por un tercero". `esn` y `serialNumber` comparten el defecto | Sustituido por dos `it`: `activationCode` es aceptado, y los otros tres sin `activationCode` son rechazados con issue en `path: 'activationCode'` (R1a/R1b) | rojo `740a0d4`; verde `cd33883` (R1) |
| `claim-device.dto.spec.ts::R4: recorta espacios del identificador` | El trim aplicaba sobre `esn` | `esn` ya no es una clave del schema; `result.data.esn` sería `undefined` y el test verde no probaría nada | El mismo trim sobre `activationCode` | rojo `740a0d4`; verde `cd33883` (R1) |
| `claim-device.dto.spec.ts::R4: rechaza dos identificadores presentes` | `{petId, esn, imei}` es `400` por la regla XOR del `superRefine` | El `superRefine` desaparece (R1): con una sola credencial no hay XOR que imponer. Y la regla derivada — que un body con `activationCode` **y** `imei` fuera `400` — sería una regresión: el cliente trae la credencial correcta ([[design]] D1, opción (a) frente a (b)) | Sustituido por `ignora imei/esn/serialNumber si vienen junto al activationCode (R1c #26)`: `success: true` y las tres claves ausentes de `result.data` | rojo `740a0d4`; verde `cd33883` (R1) |
| `claim-device.dto.spec.ts::R4: rechaza identificador vacio, no-string o de mas de 64 caracteres` | Los tres casos límite sobre `esn` | Tras R1 el `400` vendría del `activationCode` ausente, no del `esn` inválido: el test seguiría verde probando otra cosa | Los mismos tres casos límite sobre `activationCode` | verde `cd33883` (R1; dato de prueba D5 ⚪) |
| `claim-device.use-case.spec.ts::R3: delega en el repositorio y devuelve el device reclamado` | `findByIdentifier` llamado con `{field:'esn', value:'SIM-001'}` | El use case ya no puede recibir un DTO con `esn`: `toDeviceIdentifier` devuelve siempre `activationCode` (R3) | `findByIdentifier` llamado con `{field:'activationCode', value:'ACT-001'}` | rojo `5841d71`; verde `a81e01f` (R3) |
| `test/devices.e2e-spec.ts::R4: rechaza petId no-UUID, cero identificadores y dos identificadores` | La tercera llamada, `{petId, esn, imei}`, era `400` por el XOR | Mismo motivo que la fila 3: el XOR ya no existe. El body sigue dando `400`, ahora porque no trae `activationCode` — el resultado observable coincide, la razón no | Renombrado a `rechaza petId no-UUID, activationCode ausente y solo-identificadores-viejos`; el caso se conserva y ahora documenta R1b | pendiente |
| `test/devices.e2e-spec.ts` — las 24 llamadas a `claim(...)` de los `describe` R3 y R5-R15 | Reclamaban el collar de prueba enviando `esn` | `esn` deja de ser credencial (R1). El resto de cada test (transacción, watermark, códigos de error, auditoría, ciclo release/claim) no cambia y es lo que R6 usa como prueba de no-regresión | Las mismas aserciones enviando `activationCode`. Ningún `it` se elimina | pendiente |

Regla: el reviewer no aprueba si alguna fila de cualquiera de las dos tablas
queda "pendiente" en la columna Commit — la columna Test puede decir "N/A"
solo en R5, R7 y R8, nunca la columna Commit.
Convención de commit: `feat(claim-activation-code-only): <desc> (R1,R3)`.
El implementer actualiza estas tablas tras cada commit; el reviewer las valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).
