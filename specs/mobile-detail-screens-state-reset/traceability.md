---
feature: "mobile-detail-screens-state-reset"
status: approved     # draft | approved
tags: [harness, spec, mobile]
---

# Trazabilidad — [[mobile-detail-screens-state-reset]]

Commit base: `f50b4203` (`chore(harness): registra baseline verde de #63`).

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `mobile-pet-tracker/src/screens/add-reminder/index.test.tsx::R1: el formulario vuelve a sus valores iniciales al perder el foco` → `restaura los ocho valores visibles tras el blur` | rojo: `a710b05b test(detail-state-reset): cover reminder blur reset (R1)`; verde: `00e82481 feat(detail-state-reset): reset reminder state on blur (R1)` |
| R2 | `mobile-pet-tracker/src/screens/add-pet/index.test.tsx::R2: el formulario vuelve a sus valores iniciales al perder el foco` → `restaura los catorce valores visibles tras el blur` | rojo: `eb931f7e test(detail-state-reset): cover pet form blur reset (R2)`; verde: `86b01d75 feat(detail-state-reset): reset pet form state on blur (R2)` |
| R3 | `mobile-pet-tracker/src/app/(tabs)/__tests__/weight-log.test.tsx::R3: el formulario vuelve a sus valores iniciales al perder el foco` → `restaura los cuatro valores visibles tras el blur` | rojo: `d922f8ba test(detail-state-reset): cover weight form blur reset (R3)`; verde: `5343f374 feat(detail-state-reset): reset weight form state on blur (R3)` |
| R4 | pendiente | pendiente |
| R5 | pendiente | pendiente |
| R6 | pendiente | pendiente |
| R7 | pendiente | pendiente |

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: `feat(<scope>): <desc> (R1,R2)`; el commit rojo previo va
como `test(<scope>): <desc> (R1)`.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).

**R7 es requisito de verificación** ([[tasks]] §R7, vía (b) de C4): su fila
registra el test y el commit que lo introduce, y el reporte del reviewer debe
recoger además la salida de las **dos** mutaciones de producción
(`setSubmitting(false)` en `AddReminderContent`, `setClaiming(false)` en
`resetPairingState`) con su rojo por aserción y su `git diff` vacío tras
revertir.
