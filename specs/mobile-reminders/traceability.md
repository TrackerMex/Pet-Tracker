---
feature: "mobile-reminders"
status: draft        # draft | approved
tags: [harness, spec, mobile]
---

# Trazabilidad — [[mobile-reminders]]

> Renumerada el 2026-08-24 tras el gate humano (el antiguo R1 de GET
> backend se movió a #47 `specs/reminders-api/`; borrado por DELETE;
> entrada por Profile; picker nativo). La spec estaba en draft: la
> renumeración es válida (los R-id son inmutables solo tras aprobación).

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `src/api/__tests__/reminders.test.ts::R1: listReminders mapea la respuesta por kind` | `377cdef test(mobile-reminders): define reminder listing in red (R1)`; `8e6ae26 feat(mobile-reminders): list reminders by pet (R1)` |
| R2 | `src/api/__tests__/reminders.test.ts::R2: createReminder publica y mapea por kind` | `9ecd3c5 test(mobile-reminders): define reminder creation in red (R2)`; `e7b8c5c feat(mobile-reminders): create reminders (R2)` |
| R3 | `src/api/__tests__/reminders.test.ts::R3: deleteReminder borra y mapea por kind` | `0cac973 test(mobile-reminders): define reminder deletion in red (R3)`; `1bf95a9 feat(mobile-reminders): delete reminders (R3)` |
| R4 | `src/utils/reminder-dates.test.ts::R4: reminder-dates combina y cuenta días` | `4e39f3d test(mobile-reminders): define reminder dates in red (R4)`; `d0b9d92 feat(mobile-reminders): add reminder date helpers (R4)` |
| R5 | `src/screens/reminders/index.test.tsx::R5: reminders monta con métricas y estados` | `847996a test(mobile-reminders): define reminders screen states in red (R5)`; `bb40613 feat(mobile-reminders): add reminder list states (R5)` |
| R6 | `src/screens/reminders/index.test.tsx::R6: lista con pills, badges y refetch on focus` | `b6621a2 test(mobile-reminders): define reminder rows in red (R6)`; `16940ae feat(mobile-reminders): render reminder summaries and rows (R6)` |
| R7 | `src/screens/reminders/index.test.tsx::R7: borrar recordatorio con confirmación` | `70c645a test(mobile-reminders): define reminder deletion UI in red (R7)`; `c343cb8 feat(mobile-reminders): delete reminders from list (R7)`; rework post-smoke BottomSheet: `a6f3a56 test(mobile-reminders): define BottomSheet delete UX in red (R12)`; `21e769d fix(mobile-reminders): confirm deletion in Expo UI sheet (R12)` |
| R8 | `src/screens/add-reminder/index.test.tsx::R8: formulario de alta con chips y pickers` | `cb2b566 test(mobile-reminders): define add reminder form in red (R8)`; `50ec673 feat(mobile-reminders): add reminder form and native pickers (R8)`; rework post-review: `8042a80 test(mobile-reminders): define Expo UI picker swap in red (R8)`; `02f02ae fix(mobile-reminders): use Expo UI native pickers (R8)` |
| R9 | `src/screens/add-reminder/index.test.tsx::R9: guardar con validación y degradación por kind` | `7ff5114 test(mobile-reminders): define reminder submission in red (R9)`; `7eaed26 feat(mobile-reminders): submit reminder form (R9)` |
| R10 | `src/app/(tabs)/__tests__/profile.test.tsx::R10: profile enlaza a reminders` | `43d3e5f test(mobile-reminders): define profile reminder link in red (R10)`; `716d604 feat(mobile-reminders): expose reminder routes from profile (R10)` |
| R11 | verificación manual (typecheck/lint/tests/init.sh + greps de contención) | `6f0cc05 fix(mobile-reminders): preserve mobile regression suite (R10,R11)`; `4d29fe4 test(mobile-reminders): verify regression and containment (R11)` |
| R12 | Smoke humano en Expo Go: (1) el paso 8 detectó datos de la mascota anterior, cubierto en `src/hooks/__tests__/use-api.test.tsx::R4: useApi ejecuta, refetch y expulsa 401` y `src/app/(tabs)/__tests__/home.test.tsx::R9: summary degrada con gracia`; (2) el humano pidió sustituir la confirmación `Alert.alert` por el BottomSheet de Expo UI, cubierto en `src/screens/reminders/index.test.tsx::R7: borrar recordatorio con confirmación` | Primer hallazgo: `6a2aa9b test(mobile-reminders): reproduce stale pet data on fn swap (R12)`; `19aa304 fix(mobile-reminders): clear stale data when api fn changes (R12)`; excepción C4 en `f11a32c test(home): expect skeletons during pet switch (R9)`. Segundo hallazgo: `a6f3a56 test(mobile-reminders): define BottomSheet delete UX in red (R12)`; `21e769d fix(mobile-reminders): confirm deletion in Expo UI sheet (R12)`; excepción C4 en el cuerpo del rojo por retirar los asserts obsoletos de `Alert.alert`; re-smoke humano pendiente |

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: `feat(mobile-reminders): <desc> (R1,R2)`.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).
