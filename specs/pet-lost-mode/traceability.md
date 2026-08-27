---
feature: "pet-lost-mode"
status: draft        # draft | approved
tags: [harness, spec, backend, mobile]
---

# Trazabilidad — [[pet-lost-mode]]

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `src/modules/pets/application/use-cases/set-lost-mode.use-case.spec.ts::R1: set lost mode persiste y audita`; `test/pet-lost-mode.e2e-spec.ts::R1: owner activa y desactiva lost mode` | `aeed8dc feat(pet-lost-mode): persist and audit owner toggles (R1)` |
| R2 | `test/pet-lost-mode.e2e-spec.ts::R2: solo el owner puede togglear lost mode` | `b8e0cd7 feat(pet-lost-mode): restrict toggles to owners (R2)` |
| R3 | `src/modules/pets/application/dto/set-lost-mode.dto.spec.ts::R3: SetLostModeSchema valida enabled`; `test/pet-lost-mode.e2e-spec.ts::R3: body invalido es 400 y PATCH no toca lostMode` | `e3c64a7 feat(pet-lost-mode): validate dedicated toggle input (R3)` |
| R4 | `test/pet-lost-mode.e2e-spec.ts::R4: el perfil refleja lost mode en detalle y lista` | `d0299ce test(pet-lost-mode): verify profile visibility (R4)` |
| R5 | `src/api/__tests__/pets.test.ts::R5: setLostMode contra el endpoint real` | `e79f234 feat(pet-lost-mode): add mobile toggle client (R5)` |
| R6 | `src/app/(tabs)/__tests__/map.test.tsx::R6: owner toglea lost mode contra el endpoint` | `322c48d feat(pet-lost-mode): activate owner map toggle (R6)` |
| R7 | `src/app/(tabs)/__tests__/map.test.tsx::R7: no-owner deshabilitado y error visible` | `75835d8 feat(pet-lost-mode): handle non-owner and errors (R7)` |
| R8 | `progress/impl_pet-lost-mode.md::Verificación R8` — typecheck/lint/test móvil; lint/test/e2e backend; `./init.sh`; allowlist y grep C8 | `21445b3 fix(pet-lost-mode): preserve controller compatibility (R8)` |
| R9 | pendiente (smoke humano — registra el humano) | pendiente |

Regla: el reviewer no aprueba si alguna fila queda "pendiente" — para R8
la fila registra los comandos ejecutados y para R9 el smoke lo registra el
humano en `progress/impl_pet-lost-mode.md` antes de que la feature pase a
`done` (ver [[requirements]] §Aprobación, segunda casilla).
Convención de commit: `feat(<scope>): <desc> (R1,R2)`.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).
