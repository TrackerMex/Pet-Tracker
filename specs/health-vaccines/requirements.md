---
feature: "health-vaccines"
status: approved     # draft | approved
tags: [harness, spec]
---

# Requisitos — [[health-vaccines]]

> Notación EARS. Cada requisito tiene id único R<n>, inmutable una vez aprobado.
> Ver [[design]] y [[../../docs/architecture|architecture]].
>
> Fuente: `feature_list.json` #14, `plans/008-salud-recordatorios.md`
> pasos 1-2 y `docs/data-model.md`. Depende de `pets-crud-permissions` (#5):
> reutiliza `PetAccessGuard`, `@RequirePetRole()` y `AuditLogger`.

## Requisitos funcionales

- **R1**: WHEN se aplican las migraciones Drizzle sobre una base al día, THE
  SYSTEM SHALL crear `vaccine_catalog` (`id` uuid PK, `species` con CHECK
  `dog|cat`, `name` text, `scheme` jsonb, UNIQUE `(species,name)`) y
  `pet_vaccines` (`id` uuid PK, `pet_id` FK CASCADE, `catalog_id` FK nullable,
  `name`, `applied_at`, `next_dose_at` nullable, `vet_name`, `clinic`, `notes`,
  `document_key` nullable y `created_by` FK), con índices para sus FKs y para
  listar por `(pet_id, applied_at DESC)`, sin modificar otras tablas.

- **R2**: WHEN se ejecuta `pnpm run seed:vaccines` una o varias veces, THE
  SYSTEM SHALL dejar exactamente 4 entradas `dog` —Rabia
  `{firstDoseMonths:3,boosterMonths:12}`, Polivalente (DHPPi)
  `{firstDoseMonths:2,series:[2,3,4],boosterMonths:12}`, Leptospirosis
  `{firstDoseMonths:3,boosterMonths:12}`, Tos de las perreras
  `{firstDoseMonths:3,boosterMonths:12}`— y 3 `cat` —Triple felina (FVRCP)
  `{firstDoseMonths:2,series:[2,3],boosterMonths:12}`, Leucemia felina (FeLV)
  `{firstDoseMonths:2,boosterMonths:12}`, Rabia
  `{firstDoseMonths:3,boosterMonths:12}`— sin duplicados y con exit code 0.

- **R3**: WHEN un usuario autenticado solicita
  `GET /v1/vaccine-catalog?species=dog|cat`, THE SYSTEM SHALL responder `200`
  con las entradas de esa especie, ordenadas por `name`, en el shape
  `{id,species,name,scheme}`; IF `species` falta o no es `dog|cat` THEN SHALL
  responder `400`.

- **R4**: IF `:petId` no existe, es inválido o no tiene membresía activa para
  el actor, THEN THE SYSTEM SHALL responder `404` genérico mediante el
  `PetAccessGuard` existente en `POST/GET /v1/pets/:petId/vaccines` y
  `PATCH/DELETE /v1/pets/:petId/vaccines/:vaccineId`, antes de consultar o
  escribir vacunas; usuario B sobre mascota de A recibe `404` en las cuatro
  rutas.

- **R5**: IF un miembro activo con `role != 'owner'` usa `POST`, `PATCH` o
  `DELETE` de vacunas, THEN THE SYSTEM SHALL responder `403`; GET permite
  cualquier rol activo. El `404` de R4 precede siempre al `403`.

- **R6**: WHEN un owner crea una vacuna con `{catalogId,appliedAt}` válido y
  sin `nextDoseAt`, THE SYSTEM SHALL copiar el nombre del catálogo, calcular
  `nextDoseAt = appliedAt + scheme.boosterMonths` en meses de calendario
  (ajustando al último día válido del mes), persistir `created_by`, responder
  `201` y exponer exactamente `{id,petId,catalogId,name,appliedAt,nextDoseAt,
  vetName,clinic,notes,documentKey}`.

- **R7**: WHEN el POST incluye un `nextDoseAt` válido, THE SYSTEM SHALL
  conservarlo como override sin recalcularlo; WHEN se crea una vacuna libre
  con `{name,appliedAt}` y sin `catalogId`, THE SYSTEM SHALL persistir el nombre
  y dejar `nextDoseAt` en el valor manual recibido o `null` si se omitió.

- **R8**: IF el POST no incluye exactamente uno de `catalogId|name`, usa una
  fecha ISO inválida, una `appliedAt` futura, texto vacío o una clave
  desconocida, THEN THE SYSTEM SHALL responder `400` sin persistir; IF el
  catálogo no existe THEN `404 VACCINE_CATALOG_NOT_FOUND`; IF su especie no
  coincide con la mascota THEN `400 VACCINE_SPECIES_MISMATCH`.

- **R9**: WHEN un miembro activo solicita
  `GET /v1/pets/:petId/vaccines`, THE SYSTEM SHALL responder `200` con todas
  las vacunas en el shape de R6, ordenadas por `appliedAt DESC` (y `id DESC`
  como desempate), o `[]` si no existen.

- **R10**: WHEN un owner envía PATCH con un subconjunto válido de
  `name,appliedAt,nextDoseAt,vetName,clinic,notes`, THE SYSTEM SHALL actualizar
  solo esos campos y responder `200` con el shape de R6; `catalogId` y
  `documentKey` no son editables aquí. Un body vacío es no-op sin auditoría;
  datos inválidos responden `400`; id inválido, inexistente o perteneciente a
  otra mascota responde `404 VACCINE_NOT_FOUND`.

- **R11**: WHEN un owner elimina una vacuna de esa mascota, THE SYSTEM SHALL
  borrar la fila y responder `204`; IF el id es inválido, no existe o pertenece
  a otra mascota THEN SHALL responder `404 VACCINE_NOT_FOUND` sin borrar nada.

- **R12**: WHEN un POST, PATCH con cambios o DELETE termina con éxito, THE
  SYSTEM SHALL registrar mediante `AuditLogger` `vaccine.create`,
  `vaccine.update` o `vaccine.delete`, con `entity='vaccine'`, el id, actor y
  `meta.petId` (PATCH añade solo nombres de campos); IF la escritura falla THEN
  no debe auditar.

- **R13**: WHEN un miembro activo consulta `GET /v1/pets/:petId`, THE SYSTEM
  SHALL sustituir el placeholder `nextVaccine` por la vacuna de esa mascota con
  el menor `next_dose_at` posterior a la fecha actual, como
  `{id,name,nextDoseAt}`, o conservar `null` si no existe, sin cambiar ninguna
  otra clave del perfil.

## Fuera de alcance

- Peso (#15), recordatorios (#16), documentos/cartilla PDF, upload S3, lectura
  IA, pantallas móviles y cambios al catálogo por API.
- Permisos granulares y escritura por rol `vet`; el MVP mantiene mutaciones
  owner-only hasta implementar la autorización delegada.
- Recalcular automáticamente `nextDoseAt` al editar `appliedAt`; PATCH solo
  cambia campos explícitos.

## Aprobación

- [X] Aprobado por humano (fecha: 2026-08-09) ← gate obligatorio antes de implementar
