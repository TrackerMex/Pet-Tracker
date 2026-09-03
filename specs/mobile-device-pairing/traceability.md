---
feature: "mobile-device-pairing"
status: approved   # draft | spec_ready | approved
tags: [harness, spec, mobile]
---

# Trazabilidad — [[mobile-device-pairing]]

Rutas de test relativas a `mobile-pet-tracker/`.

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
| G1 (gate humano) | smoke en dev build de Android según [[design]] §D11 — lo registra el humano en `progress/impl_mobile-device-pairing.md` con fecha | pendiente (humano) |

Regla: el reviewer no aprueba si alguna fila R1–R11 queda "pendiente"; la
fila G1 la cierra el humano y el leader espera a esa confirmación antes de
marcar `done` (`CLAUDE.md` §Reglas duras).
Convención de commit: `feat(<scope>): <desc> (R1,R2)` con scope
`mobile-device-pairing`; el rojo previo va como `test(mobile-device-pairing): … (Rn)`.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).

Los nombres exactos de cada `describe` están fijados en [[requirements]]:
al rellenar una fila se copian literalmente, no se reescriben. El sufijo
`(mobile-device-pairing)` es **obligatorio** en los R-ids que aterrizan en
ficheros de test compartidos con otras features
(`src/screens/profile/index.test.tsx`, `src/app/(tabs)/__tests__/home.test.tsx`,
`src/__tests__/design-drift.test.ts`) — hallazgo H5 de
`progress/review_auth-forgot-password.md`.
