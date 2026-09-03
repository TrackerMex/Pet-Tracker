---
feature: "mobile-device-pairing"
status: approved   # draft | spec_ready | approved
tags: [harness, spec, mobile]
---

# Trazabilidad — [[mobile-device-pairing]]

Rutas de test relativas a `mobile-pet-tracker/`.

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `src/api/__tests__/devices.test.ts::R1: claimDevice publica el claim y mapea la respuesta por kind` | `7218959 test(mobile-device-pairing): cover claim device mapping (R1)` → `28a2b77 feat(mobile-device-pairing): implement claim device mapping (R1)` |
| R2 | `src/api/__tests__/devices.test.ts::R2: releaseDevice libera el collar y mapea por kind` | `21e5171 test(mobile-device-pairing): cover device release mapping (R2)` → `bc31f31 feat(mobile-device-pairing): implement device release mapping (R2)` |
| R3 | `src/api/__tests__/subscriptions.test.ts::R3: getPetTracking deriva tracked/free del gate 402 de positions/last` | `c7314cf test(mobile-device-pairing): cover tracking entitlement probe (R3)` → `aa49edd feat(mobile-device-pairing): derive tracking entitlement (R3)` |
| R4 | `src/screens/pairing/index.test.tsx::R4: /pairing monta dentro de (tabs) con selector de mascota y estados de carga` | `9148d10 test(mobile-device-pairing): cover pairing route loading states (R4)` → `c6fd268 feat(mobile-device-pairing): add pairing route shell (R4)` |
| R5 | `src/screens/pairing/index.test.tsx::R5: sin collar muestra el formulario de vinculación y publica el claim solo al enviar` | `05ece6c test(mobile-device-pairing): cover collar claim form (R5)` → `9aadc39 feat(mobile-device-pairing): add collar claim form (R5)` |
| R6 | `src/screens/pairing/index.test.tsx::R6: el claim mapea cada kind a su mensaje y permite reintentar` | `8a941d6 test(mobile-device-pairing): cover claim error states (R6)` → `bad3d92 feat(mobile-device-pairing): handle claim error states (R6)` |
| R7 | `src/screens/pairing/index.test.tsx::R7: tras el 201 muestra "Tracker is ready" con el collar y sus CTAs` | `a3b6ced test(mobile-device-pairing): cover tracker ready view (R7)` → `eafccdd feat(mobile-device-pairing): add tracker ready view (R7)` |
| R8 | `src/screens/pairing/index.test.tsx::R8: con collar muestra el estado del dispositivo y el plan tracked/free según subscriptions` | `e4cb936 test(mobile-device-pairing): cover device and plan status (R8)` → `b2cbe61 feat(mobile-device-pairing): show device and plan status (R8)`; `6cda534 test(mobile-device-pairing): prevent duplicate plan probe (R8)` → `b5d365a fix(mobile-device-pairing): avoid duplicate plan probes (R8)` |
| R9 | `src/screens/pairing/index.test.tsx::R9: desvincular pide confirmación nativa, libera el collar y vuelve al formulario` | `332c778 test(mobile-device-pairing): cover native unpair flow (R9)` → `767b056 feat(mobile-device-pairing): add native unpair flow (R9)` |
| R10 | `src/screens/profile/index.test.tsx::R10 (mobile-device-pairing): el perfil enlaza a /pairing`; `src/app/(tabs)/__tests__/home.test.tsx::R10 (mobile-device-pairing): la collar card sin collar enlaza a /pairing` | `417f1a3 test(mobile-device-pairing): cover pairing entry points (R10)` → `44deb23 feat(mobile-device-pairing): add pairing entry points (R10)` |
| R11 | `src/__tests__/design-drift.test.ts::R11 (mobile-device-pairing): pairing usa el Card compartido y las dimensiones uniformes` | `cb82c1b test(mobile-device-pairing): guard pairing design conventions (R11)` → `8f1779b feat(mobile-device-pairing): consolidate pairing status rows (R11)` |
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
