# Sesión activa

> Este archivo describe el estado de la sesión en curso.
> Al cerrar la sesión, mueve este contenido a progress/history.md y deja solo esta plantilla.

---

- feature: weight-single-source-of-truth (#22)
- inicio: 2026-08-14
- spec aprobada por humano: specs/weight-single-source-of-truth/requirements.md
- plan: Codex CLI elimina `weightKg` de POST/PATCH /v1/pets (R1, R2), consolida
  `WeightDrizzleRepository.create()` como único escritor de
  `pets.current_weight_kg`, añade script idempotente de backfill
  `scripts/backfill-weights.ts` (R3, R4), documenta en docs/data-model.md (R5)
  y deja sin cambios el contrato de lectura de GET /v1/pets/:petId (R6).
- implementador: Codex CLI
- estado: R1/R2 verdes; R3/R4 rojo commiteado en `dbd4fae`
- siguiente paso: implementar `backfillWeights(db)` y verificar idempotencia
