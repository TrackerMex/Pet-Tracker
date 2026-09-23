---
feature: "mobile-detail-screens-state-reset"
status: approved     # draft | approved
tags: [harness, spec, mobile]
---

# Trazabilidad — [[mobile-detail-screens-state-reset]]

Commit base: `f50b4203` (`chore(harness): registra baseline verde de #63`).

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `mobile-pet-tracker/src/screens/add-reminder/index.test.tsx::R1: el formulario vuelve a sus valores iniciales al perder el foco` → `restaura los ocho valores visibles tras el blur` | rojo: `a710b05b test(detail-state-reset): cover reminder blur reset (R1)`; verde: `00e82481 feat(detail-state-reset): reset reminder state on blur (R1)` ← retirado por #95 (R7, C7) |
| R2 | `mobile-pet-tracker/src/screens/add-pet/index.test.tsx::R2: el formulario vuelve a sus valores iniciales al perder el foco` → `restaura los catorce valores visibles tras el blur` | rojo: `eb931f7e test(detail-state-reset): cover pet form blur reset (R2)`; verde: `86b01d75 feat(detail-state-reset): reset pet form state on blur (R2)` ← retirado por #95 (R7, C7) |
| R3 | `mobile-pet-tracker/src/app/(tabs)/__tests__/weight-log.test.tsx::R3: el formulario vuelve a sus valores iniciales al perder el foco` → `restaura los cuatro valores visibles tras el blur (#90 R3)` | rojo: `d922f8ba test(detail-state-reset): cover weight form blur reset (R3)`; verde: `5343f374 feat(detail-state-reset): reset weight form state on blur (R3)` ← retirado por #95 (R7, C7) |
| R4 | `mobile-pet-tracker/src/app/(tabs)/__tests__/meal-schedule.test.tsx::R4: el error de generación desaparece al perder el foco` → `limpia generateError tras el blur` | rojo: `9537666b test(detail-state-reset): cover meal error blur reset (R4)`; verde: `947a9d07 feat(detail-state-reset): clear meal error on blur (R4)` ← retirado por #95 (R7, C7) |
| R5 | `mobile-pet-tracker/src/screens/pairing/index.test.tsx::R5: el estado local de pairing se limpia al perder el foco` → `limpia la vista ready y el código tras el blur`; `limpia actionError tras el blur` | rojo: `e46cfd2e test(detail-state-reset): cover pairing blur reset (R5)`; verde: `7b809932 feat(detail-state-reset): reset pairing state on blur (R5)` ← retirado por #95 (R7, C7) |
| R6 | `mobile-pet-tracker/src/screens/pairing/index.test.tsx::R6: el estado local de pairing se limpia al cambiar de mascota` → `limpia la vista ready y el código al seleccionar otra mascota`; `limpia actionError al seleccionar otra mascota` | rojo: `4c8ec120 test(detail-state-reset): cover pairing pet switch reset (R6)`; verde: `6fd8de2e feat(detail-state-reset): reset pairing state on pet change (R6)`; ajuste lint: `79ed667a fix(detail-state-reset): allow intentional pairing reset effect (R6)` |
| R7 | `mobile-pet-tracker/src/screens/add-reminder/index.test.tsx::R7: el guarda de envío sobrevive al blur` → `mantiene deshabilitado el envío pendiente tras el blur`; `mobile-pet-tracker/src/screens/pairing/index.test.tsx::R7: el guarda de envío sobrevive al blur` → `mantiene deshabilitado el claim pendiente tras el blur` | `5cdf2024 test(detail-state-reset): preserve request guards on blur (R7)`; evidencia de ambas mutaciones en `progress/impl_mobile-detail-screens-state-reset.md` ← retirado por #95 (R7, C7) |

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
