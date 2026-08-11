---
feature: "health-weights"
status: approved     # draft | approved
tags: [harness, spec]
---

# Requisitos — [[health-weights]]

> Notación EARS. Cada requisito tiene id único R<n>, inmutable una vez aprobado.
> Ver [[design]] y [[../../docs/architecture|architecture]].
>
> Fuente: `feature_list.json` #15, `plans/008-salud-recordatorios.md` paso 2
> (bloque de peso) y `docs/data-model.md` (fila `weights`).
>
> Depende de `pets-crud-permissions` (#5): reutiliza `PetAccessGuard`,
> `@RequirePetRole()` y el puerto `AuditLogger`. **Extiende** el módulo
> `src/modules/health/` creado por `health-vaccines` (#14); no crea módulo
> nuevo.
>
> **Colisión de R-ids**: el módulo `health` ya contiene R1..R13 de #14. Los
> tests de esta feature nombran su requisito como
> `R<n> (health-weights #15): ...` — mismo patrón que #14 usó al escribir en
> un archivo ajeno (`R13 (health-vaccines #14): ...` en
> `get-pet.use-case.spec.ts`). Sin ese sufijo, C4 no es verificable por grep.

## Requisitos funcionales

- **R1**: WHEN se aplican las migraciones Drizzle sobre una base al día, THE
  SYSTEM SHALL crear la tabla `weights` con `id` uuid PK, `pet_id` uuid NOT
  NULL FK a `pets(id)` ON DELETE CASCADE, `weight_kg` `numeric(5,2)` NOT NULL,
  `body_condition` integer NULL con CHECK `weights_body_condition_check`
  (`between 1 and 9`), `measured_at` `date` NOT NULL y `created_by` uuid NOT
  NULL FK a `users(id)`, más los índices `weights_pet_id_measured_at_idx`
  sobre `(pet_id, measured_at DESC)` y `weights_created_by_idx` sobre
  `(created_by)`; la migración generada SHALL ser un archivo nuevo
  (`0010_*.sql`) que no contenga `ALTER TABLE "pets"` ni modifique ninguna
  otra tabla existente.

- **R2**: WHEN un owner envía `POST /v1/pets/:petId/weights` con
  `{weightKg, measuredAt}` válidos y opcionalmente `bodyCondition`, THE
  SYSTEM SHALL insertar una fila en `weights` con `created_by` = el actor y
  responder `201` con exactamente las claves
  `{id, petId, weightKg, measuredAt, bodyCondition, variation}`, donde
  `weightKg` es un `number` (nunca el string que devuelve el driver `pg`),
  `measuredAt` es `YYYY-MM-DD`, `bodyCondition` es `number | null` y
  `variation` sigue la regla de R5. Varias mediciones de la misma mascota
  pueden compartir `measured_at`: no hay restricción de unicidad.

- **R3**: WHEN se inserta una medición, THE SYSTEM SHALL actualizar
  `pets.current_weight_kg` (y `pets.updated_at`) con ese `weightKg`
  **si y solo si** no existe ninguna otra fila de esa mascota con
  `measured_at` estrictamente mayor que la nueva; IF existe una medición
  posterior (alta retroactiva) THEN THE SYSTEM SHALL dejar
  `pets.current_weight_kg` intacto; WHEN la nueva medición empata exactamente
  en `measured_at` con la más reciente existente, THE SYSTEM SHALL
  actualizar `pets.current_weight_kg` con la nueva (la última escrita gana).
  Observable en `GET /v1/pets/:petId` → `currentWeightKg`.

- **R4**: WHEN se procesa un `POST` de peso, THE SYSTEM SHALL ejecutar el
  `INSERT` en `weights` y el `UPDATE` condicional de `pets` dentro de una
  única transacción Postgres; IF el `UPDATE` de `pets` falla THEN THE SYSTEM
  SHALL revertir también el `INSERT` y no dejar ninguna fila en `weights`.

- **R5**: WHEN un miembro activo solicita `GET /v1/pets/:petId/weights`, THE
  SYSTEM SHALL responder `200` con un array ordenado por `measured_at DESC`
  y `id DESC` como desempate, donde cada elemento lleva el shape de R2 y su
  `variation` es `weightKg` menos el `weightKg` de la **medición
  inmediatamente anterior de esa mascota en el orden total
  `(measured_at, id)` ascendente**, expresada en kg, redondeada a 2
  decimales, positiva si la mascota ganó peso; `variation` SHALL ser `null`
  cuando esa medición no tiene ninguna anterior. En concreto: 0 mediciones →
  `[]`; 1 medición → un elemento con `variation: null`; 2 mediciones → la más
  reciente con `variation = reciente.weightKg - anterior.weightKg` y la más
  antigua con `variation: null`. La medición anterior SHALL buscarse sobre el
  historial completo de la mascota, no sobre la página devuelta: con dos
  mediciones y `?limit=1`, el único elemento devuelto SHALL traer `variation`
  no nula.

- **R6**: WHEN `GET /v1/pets/:petId/weights` se invoca sin `limit`, THE
  SYSTEM SHALL devolver como máximo `WEIGHTS_DEFAULT_LIMIT` = 50 elementos;
  WHEN se invoca con `?limit=<n>` entero entre 1 y `WEIGHTS_MAX_LIMIT` = 100,
  THE SYSTEM SHALL devolver como máximo `n` elementos, los más recientes;
  IF `limit` no es un entero, es `< 1`, es `> 100`, viene vacío
  (`?limit=`) o la query trae cualquier otro parámetro THEN THE SYSTEM SHALL
  responder `400` sin consultar la base.

- **R7**: IF el body del `POST` incluye `weightKg <= 0`, `weightKg > 999.99`,
  un `weightKg` no numérico, un `bodyCondition` no entero o fuera de `1..9`,
  un `measuredAt` que no sea `YYYY-MM-DD` de calendario real, un `measuredAt`
  **posterior a la fecha de hoy en UTC más `MEASURED_AT_MAX_FUTURE_DAYS` = 1
  día**, o cualquier clave desconocida, THEN THE SYSTEM SHALL responder `400`
  con el cuerpo
  `{statusCode, message: 'Validation failed', errors: [{path, message}]}` sin
  insertar ninguna fila y sin tocar `pets.current_weight_kg`. La constante
  `MEASURED_AT_MAX_FUTURE_DAYS` SHALL exportarse desde
  `backend-pet-tracker/src/modules/health/application/dto/weight.dto.ts`, junto
  a `WEIGHTS_DEFAULT_LIMIT` y `WEIGHTS_MAX_LIMIT`. Tomando `hoy` como la fecha
  UTC del momento de la petición, THE SYSTEM SHALL aceptar (`201`) `hoy` y
  `hoy + 1 día`, y rechazar (`400`) `hoy + 2 días`. El día de tolerancia cubre
  el rango de husos horarios del planeta (UTC-12..UTC+14, 26 horas); ver
  [[design]] D5.

- **R8**: IF `:petId` no existe, es sintácticamente inválido o no tiene
  membresía activa para el actor, THEN THE SYSTEM SHALL responder `404`
  genérico mediante el `PetAccessGuard` existente, antes de leer o escribir
  pesos, tanto en `POST /v1/pets/:petId/weights` como en
  `GET /v1/pets/:petId/weights`; un usuario B sobre una mascota de A recibe
  `404` en ambas rutas.

- **R9**: IF un miembro activo con `role != 'owner'` usa el `POST` de pesos,
  THEN THE SYSTEM SHALL responder `403`; el `GET` SHALL estar disponible para
  cualquier rol activo. El `404` de R8 SHALL preceder siempre al `403`.

- **R10**: WHEN un `POST` de peso termina con éxito, THE SYSTEM SHALL
  registrar mediante `AuditLogger` una entrada con `action: 'weight.create'`,
  `entity: 'weight'`, `entityId` = el id de la medición, `userId` = el actor
  y `meta: { petId }`; IF la escritura en base falla THEN THE SYSTEM SHALL no
  auditar nada.

## Fuera de alcance

- **`PATCH` y `DELETE` de mediciones.** El plan 008 y `feature_list.json` #15
  solo piden `POST` y `GET`. Corregir una medición errónea queda para una
  feature futura; el valor del perfil sigue siendo editable con
  `PATCH /v1/pets/:petId {weightKg}` de #5.
- **Añadir cualquier clave al perfil de mascota.** `PetProfileResponse` es un
  contrato congelado de 24 claves aseverado en tres archivos de test (ver
  [[design]] §Riesgo sobre contratos existentes). La integración de #15 con el
  perfil es mantener fresco el `currentWeightKg` que **ya existe** (R3), no
  añadir `weightVariation`. El "variación de peso en el perfil" que menciona
  el plan 008 paso 2 queda diferido a la feature que amplíe ese contrato.
- Cambiar el tipo, la nulabilidad o el nombre de `pets.current_weight_kg`, y
  cambiar el comportamiento de `PATCH /v1/pets` sobre `weightKg`.
- Gráfico, pantallas móviles (`weight.tsx` del plan 008 paso 4), recordatorios
  de tipo `weight` (#16) y consumo del peso por el motor de nutrición (#17).
- Paginación por cursor: `weights` es un historial acotado por mascota y el
  consumidor pide "las últimas N". Se usa `?limit=` plano, sin `nextCursor`.

## Aprobación

- [X] Aprobado por humano (fecha: 2026-08-11) ← gate obligatorio antes de implementar
