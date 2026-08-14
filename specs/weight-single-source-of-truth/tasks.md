---
feature: "weight-single-source-of-truth"
status: draft        # draft | approved
tags: [harness, spec]
---

# Tareas — [[weight-single-source-of-truth]]

> Disciplina TDD (`docs/verification.md`). Cada tarea corresponde a un
> requisito de [[requirements]] y tiene siempre los mismos 3 sub-items, en
> este orden.
>
> **Cada test nombra su requisito con el sufijo de feature**:
> `describe('R<n> (weight-single-source-of-truth #22): ...')` en los tests
> nuevos. Los tests **editados** (tabla D3 de [[design]]) que ya pertenecen a
> `R13`/`R15`/`R4` de `pets-crud-permissions` (#5) conservan su `describe`
> original — solo cambia la assertion interna — porque siguen verificando el
> mismo requisito de #5 (el PATCH parcial, la auditoría), ahora bajo el
> comportamiento nuevo.
>
> **Commits test-primero, uno por bloque rojo→verde.** `CHECKPOINTS.md` C4
> exige que el historial muestre el patrón; meter tests + implementación en
> un solo commit es motivo de rechazo del reviewer.
>
> `test/pets.e2e-spec.ts` y `test/backfill-weights.e2e-spec.ts` necesitan
> Docker levantado (`docker compose up -d`).

## R1 — POST /v1/pets ignora weightKg y no escribe current_weight_kg

- [ ] (1) Escribir tests que fallan para R1 — editar
      `create-pet.dto.spec.ts` (filas 1-2 de la tabla D3),
      `create-pet.use-case.spec.ts` (filas 5-6),
      `pet.drizzle.repository.spec.ts` (filas 9-10). Cada edición debe
      fallar contra el código actual antes del siguiente paso.
- [ ] (2) Implementación mínima que lo pasa — quitar `weightKg` de
      `PetFieldsSchema` (`create-pet.dto.ts`), simplificar `toNewPet()`
      (`create-pet.use-case.ts`), quitar `currentWeightKg` de `NewPet`
      (`pet.repository.ts`), quitar el seteo de `currentWeightKg` y la
      función `toWeightColumn()` de `createWithOwner()`
      (`pet.drizzle.repository.ts`)
- [ ] (3) Refactor con tests verdes — confirmar que
      `test/pets.e2e-spec.ts` (creación básica, sin weightKg) sigue verde

## R2 — PATCH /v1/pets/:petId ignora weightKg y no toca current_weight_kg

- [ ] (1) Escribir tests que fallan para R2 — editar
      `update-pet.dto.spec.ts` (filas 3-4 de la tabla D3),
      `update-pet.use-case.spec.ts` (filas 7-8), y
      `test/pets.e2e-spec.ts` bloque `R13`/`R13b` (filas 11-12)
- [ ] (2) Implementación mínima que lo pasa — simplificar
      `toFieldChanges()` (`update-pet.use-case.ts`), quitar
      `currentWeightKg` de `PetFieldChanges` (`pet.repository.ts`),
      simplificar `update()` (`pet.drizzle.repository.ts`)
- [ ] (3) Refactor con tests verdes

## R3 — Backfill inserta una fila de weights por mascota huérfana, idempotente

- [ ] (1) Escribir test que falla para R3 —
      `test/backfill-weights.e2e-spec.ts` (casos 1, 2, 3, 4 de
      [[design]] D4 §Test del backfill)
- [ ] (2) Implementación mínima que lo pasa — crear
      `backend-pet-tracker/scripts/backfill-weights.ts` (D4) y el script
      `backfill:weights` en `package.json`; ejecutarlo contra la base
      local de Docker
- [ ] (3) Refactor con tests verdes

## R4 — Backfill no toca current_weight_kg ni updated_at

- [ ] (1) Escribir test que falla para R4 — mismo archivo que R3, caso 1
      (assertions sobre `current_weight_kg`/`updated_at` sin cambios,
      incluidas en el mismo `it` o en uno separado)
- [ ] (2) Implementación mínima que lo pasa — ya cubierta por R3 si
      `backfillWeights()` nunca hace `UPDATE` sobre `pets`; si el test
      revela lo contrario, corregir
- [ ] (3) Refactor con tests verdes

## R5 — docs/data-model.md documenta el escritor único

- [ ] (1) N/A — requisito documental, no de código; no requiere test rojo
- [ ] (2) Editar `docs/data-model.md` filas `pets` y `weights` según
      [[requirements]] R5
- [ ] (3) N/A

## R6 — GET /v1/pets/:petId sin cambios de contrato (regresión)

- [ ] (1) N/A — requisito de no-regresión; se verifica corriendo la
      suite existente sin tocarla
- [ ] (2) N/A — no hay código que escribir para este requisito
- [ ] (3) Confirmar que `pet-profile-response.mapper.spec.ts`,
      `test/pets.e2e-spec.ts::PROFILE_KEYS` y
      `test/devices.e2e-spec.ts::PROFILE_KEYS` siguen verdes sin ninguna
      edición, y que el diff final no toca `pet-profile-response.mapper.ts`
      ni `pet.entity.ts`

## Cierre

- [ ] `./init.sh` verde (incluye e2e con Docker levantado)
- [ ] `specs/weight-single-source-of-truth/traceability.md` sin filas
      "pendiente"
- [ ] `docs/data-model.md` filas `pets` y `weights` actualizadas (R5)
- [ ] Confirmar que ningún archivo de `health-weights` (#15) ni de
      `pets-crud-permissions` fuera de los listados en
      [[design]] §Archivos afectados quedó modificado
- [ ] `progress/impl_weight-single-source-of-truth.md` escrito
