---
feature: "weight-single-source-of-truth"
status: approved        # draft | approved
tags: [harness, spec]
---

# Requisitos — [[weight-single-source-of-truth]]

> Notación EARS. Cada requisito tiene id único R<n>, inmutable una vez aprobado.
> Ver [[design]] y [[../../docs/architecture|architecture]].
>
> Fuente: `feature_list.json` #22 (description + acceptance_criteria), deuda
> destapada al escribir `specs/health-weights/design.md` §Riesgo sobre
> contratos existentes ("Riesgo abierto para el gate humano").
>
> Depende de `pets-crud-permissions` (#5, `done`) — cuyo contrato de
> `POST`/`PATCH /v1/pets` cambia aquí — y de `health-weights` (#15, `done`),
> cuyo `WeightDrizzleRepository.create()` **ya es** el único código del
> repositorio que actualiza `pets.current_weight_kg` de forma condicional
> (predicado D4 de `specs/health-weights/design.md`). Esta feature no toca
> ese repositorio: lo consolida como único escritor **eliminando** los otros
> dos.

## Requisitos funcionales

### Eliminar `weightKg` del contrato de creación

- **R1**: `CreatePetSchema`
  (`backend-pet-tracker/src/modules/pets/application/dto/create-pet.dto.ts`,
  vía `PetFieldsSchema`) SHALL dejar de declarar el campo `weightKg`. IF el
  body de `POST /v1/pets` incluye la clave `weightKg` (con cualquier valor,
  válido o inválido) THEN THE SYSTEM SHALL ignorarla silenciosamente — mismo
  tratamiento que cualquier otra clave no reconocida, porque `PetFieldsSchema`
  es `z.object` (no `z.strictObject`) y ya descarta claves desconocidas sin
  error — y THE SYSTEM SHALL crear la mascota con `pets.current_weight_kg`
  en `NULL`, sin excepción. `CreatePetUseCase.execute()` y
  `PetDrizzleRepository.createWithOwner()` SHALL dejar de escribir
  `current_weight_kg` en el `INSERT`: la columna permanece en su default
  (`NULL`, sin `.default()` en el schema). Los tests existentes que hoy
  ejercitan `weightKg` en este camino (`create-pet.dto.spec.ts`,
  `create-pet.use-case.spec.ts`, `pet.drizzle.repository.spec.ts`) SHALL
  quedar **actualizados** (no eliminados) para afirmar el nuevo
  comportamiento — ver [[design]] §Riesgo, tabla de tests, para el mapeo
  exacto archivo → assertion vieja → assertion nueva.

### Eliminar `weightKg` del contrato de actualización

- **R2**: `UpdatePetSchema`
  (`backend-pet-tracker/src/modules/pets/application/dto/update-pet.dto.ts`,
  heredado de `PetFieldsSchema.partial()`) SHALL, por la eliminación del
  campo en R1, dejar también de reconocer `weightKg` en `PATCH
  /v1/pets/:petId`. IF el body de un `PATCH` incluye `weightKg` THEN THE
  SYSTEM SHALL ignorarlo silenciosamente y THE SYSTEM SHALL dejar
  `pets.current_weight_kg` sin modificar. Dos casos observables: (a) si
  `weightKg` es la **única** clave del body, el resultado es el no-op ya
  definido por R15 de `pets-crud-permissions` (#5) — `200` con el perfil sin
  cambios, sin `UPDATE`, sin fila en `audit_log`, porque tras descartar
  `weightKg` el objeto de campos presentes queda vacío; (b) si `weightKg`
  viene junto a otros campos válidos, esos otros campos SHALL persistir con
  normalidad y `meta.fields` de la auditoría (`pet.update`) SHALL listar
  únicamente los nombres de los campos realmente reconocidos — `weightKg`
  nunca aparece en `meta.fields`. `UpdatePetUseCase.toFieldChanges()` y
  `PetDrizzleRepository.update()` SHALL dejar de tener ninguna rama de
  código para `currentWeightKg`. Los tests existentes que hoy ejercitan
  `weightKg` en este camino (`update-pet.dto.spec.ts`,
  `update-pet.use-case.spec.ts`, `test/pets.e2e-spec.ts` bloque `R13`) SHALL
  quedar **actualizados** (no eliminados) — ver [[design]] §Riesgo.

### Backfill de mascotas existentes

- **R3**: WHEN se ejecuta una sola vez el script
  `backend-pet-tracker/scripts/backfill-weights.ts` (función exportada
  `backfillWeights(db)`, invocable también vía `pnpm -C backend-pet-tracker
  run backfill:weights`) contra una base con mascotas que tienen
  `pets.current_weight_kg IS NOT NULL` y **cero** filas en `weights` para su
  `pet_id`, THE SYSTEM SHALL insertar en `weights` una fila por cada una de
  esas mascotas con: `weight_kg` = el valor actual de
  `pets.current_weight_kg`; `body_condition` = `NULL`; `measured_at` = la
  fecha de calendario (sin componente horario, formato `YYYY-MM-DD`) de
  `pets.created_at`; y `created_by` = el `user_id` de la fila de
  `pet_users` de esa mascota con `role = 'owner'` y `status = 'active'`. IF
  una mascota con `current_weight_kg IS NOT NULL` no tiene ninguna
  membresía `owner` activa (dato huérfano, no debería ocurrir bajo la
  atomicidad de R2/R4 de `pets-crud-permissions`) THEN THE SYSTEM SHALL
  omitirla sin fallar el script completo. WHEN el script se ejecuta una
  segunda vez sobre la misma base (idempotencia), THE SYSTEM SHALL NOT
  insertar ninguna fila adicional — verificable comparando el conteo de
  filas de `weights` antes y después de la segunda ejecución.

- **R4**: WHEN el script de R3 inserta una fila de backfill, THE SYSTEM
  SHALL NOT modificar `pets.current_weight_kg` ni `pets.updated_at` de la
  mascota correspondiente — el backfill rellena el historial que faltaba,
  no repite una proyección que ya es correcta (a diferencia del `INSERT`
  normal de `WeightDrizzleRepository.create()`, que sí actualiza esa
  proyección bajo el predicado D4 de `health-weights`).

### Documentación del escritor único

- **R5**: WHEN se cierra esta feature, `docs/data-model.md` fila `pets`
  SHALL documentar explícitamente que `current_weight_kg` tiene un único
  escritor en el código de aplicación —
  `WeightDrizzleRepository.create()` (`health-weights` #15, predicado D4) —
  y que `POST`/`PATCH /v1/pets` ya no lo aceptan como campo de entrada;
  verificable leyendo esa fila y la fila `weights` (que ya menciona el
  predicado D4, y SHALL además referenciar el backfill de R3).

### Contrato de lectura sin cambios

- **R6**: WHEN se sirve `GET /v1/pets/:petId` tras esta feature, THE SYSTEM
  SHALL responder con exactamente las mismas 24 claves de
  `PetProfileResponse` que antes de la feature, y `currentWeightKg` SHALL
  mantener el mismo tipo (`number | null`) y la misma nulabilidad que ya
  tenía. Verificable porque `pet-profile-response.mapper.ts`,
  `pet-profile-response.mapper.spec.ts` y los arrays `PROFILE_KEYS` de
  `test/pets.e2e-spec.ts` y `test/devices.e2e-spec.ts` permanecen **sin
  ninguna modificación** por esta feature (ni una clave añadida, renombrada
  ni quitada) — la única fuente que puede poblar `current_weight_kg` sigue
  siendo la misma de antes (`WeightDrizzleRepository`), solo cambian sus
  competidores.

## Fuera de alcance

- **Cualquier cambio en `health-weights` (#15)**: `WeightDrizzleRepository`,
  `CreateWeightUseCase`, `WeightsController`,
  `POST`/`GET /v1/pets/:petId/weights` no se tocan — ya son el único camino
  correcto y esta feature solo elimina a sus competidores.
- **Cambiar el schema `pets.current_weight_kg`**: sigue siendo
  `numeric(5,2)` nullable sin default; no hay migración de schema en esta
  feature (ver [[design]] D-alcance-schema). El backfill de R3 es una
  operación de datos, no de DDL.
- **Registrar peso en un solo paso desde el alta de mascota.** Tras esta
  feature, dar de alta una mascota con peso conocido requiere dos llamadas
  (`POST /v1/pets` y luego `POST /v1/pets/:petId/weights`); resolver esa UX
  en un solo paso (por ejemplo, que el cliente encadene ambas llamadas, o
  un endpoint compuesto) es una decisión de producto/móvil fuera de esta
  spec de backend.
- **`PATCH`/`DELETE` de mediciones de `weights`**: sigue fuera de alcance,
  heredado de `health-weights` (#15) sin cambios.
- **Ejecutar el backfill (R3) contra el entorno AWS real** (Aurora, si
  existe un stack desplegado): Codex CLI / el implementer solo lo ejecutan
  y verifican contra la base local de Docker. Ejecutarlo contra una cuenta
  AWS real, si aplica, es una operación del humano (`CLAUDE.md`
  §Excepciones), fuera de esta spec.
- **Rechazar `weightKg` con `400`** en vez de ignorarlo en silencio: se
  descartó a propósito porque `PetFieldsSchema` ya no es estricto para
  ningún otro campo desconocido — hacerlo estricto solo para `weightKg`
  introduciría una asimetría sin motivo (ver [[design]] D1).

## Aprobación

- [X] Aprobado por humano (fecha: 2026-08-14) ← gate obligatorio antes de implementar
