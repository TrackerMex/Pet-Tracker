---
feature: "mobile-push-registration"
status: approved     # draft | approved
tags: [harness, spec]
---

# Trazabilidad — [[mobile-push-registration]]

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | pendiente | pendiente |
| R2 | pendiente | pendiente |
| R3 | pendiente | pendiente |
| R4 | pendiente | pendiente |
| R5 | pendiente | pendiente |
| R6 | pendiente | pendiente |
| R7 | pendiente | pendiente |
| R8 | pendiente | pendiente |
| R9 | pendiente | pendiente |
| R10 | pendiente | pendiente |
| R11 | pendiente | pendiente |
| R12 | pendiente (gate humano, sin test automático) | pendiente |

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: `feat(mobile-push-registration): <desc> (R1,R2)`.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).

## Notas de esta feature

- **R12 no tiene test automático**: es el gate humano de
  [[requirements]] §Prueba de humo. Su fila se cierra con la referencia a
  `progress/impl_mobile-push-registration.md` §R12 y la fecha de la firma del
  humano, no con un hash de commit de test.
- **Los hashes se anotan cuando el commit ya es definitivo.** Si la branch se
  rebasea después de rellenar esta tabla, los hashes dejan de existir: hay que
  reapuntarlos y verificar con `git merge-base --is-ancestor <hash> HEAD` que
  cada uno sigue en el historial (lección de #87).
- **Ficheros de test que esta feature toca** (para que el reviewer sepa dónde
  mirar): `src/__tests__/design-drift.test.ts` (R1), `app.config.test.ts` (R2),
  `src/api/__tests__/push-tokens.test.ts` (R3, R4),
  `src/providers/__tests__/auth-provider.test.tsx` (R5),
  `src/hooks/use-push-registration.test.tsx` (R6-R10),
  `src/app/__tests__/layout.test.tsx` (R11). Todos bajo `mobile-pet-tracker/`.
