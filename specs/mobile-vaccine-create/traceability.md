---
feature: "mobile-vaccine-create"
status: approved     # draft | approved
tags: [mobile, spec]
---

# Trazabilidad — [[mobile-vaccine-create]] (#208)

Rutas de test relativas a `mobile-pet-tracker/src/`, salvo R22, que está en la raíz.

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `api/__tests__/health-records.test.ts::#208 R1: …` (5 `it`) | `c97735d4 test(mobile): #208 R1 cover vaccine API clients (rojo)`; `eec55299 feat(mobile): #208 R1 add vaccine catalog and creation clients` |
| R2 | `utils/__tests__/vaccine-dates.test.ts::#208 R2: suma %i meses a %s y da %s` y `#208 R2: en America/Mexico_City suma %i meses a %s y da %s` (18 filas) | `bcf8e2ec test(mobile): #208 R2 cover calendar month arithmetic (rojo)`; `2d5ba60e feat(mobile): #208 R2 add timezone independent calendar month helper` |
| R3 | `utils/form-rules.test.ts::#208 R3: …` (3 `it`) | `ffc725aa test(mobile): #208 R3 cover free vaccine name validation (rojo)`; `f1e431e6 feat(mobile): #208 R3 validate free vaccine names` |
| R4 | `app/__tests__/layout.test.tsx::#208 R4: …`, `app/__tests__/detail-stack.guard.test.tsx` (`#149 R3`), `screens/vaccine-create/index.test.tsx::#208 R4: …` | `b099429d test(mobile): #208 R4 cover vaccine route and protected stack order (rojo)`; `25742076 feat(mobile): #208 R4 register protected vaccine creation route` |
| R5 | `screens/health/index.test.tsx::#208 R5: …` (owner y 3 roles) | `cf1fef1e test(mobile): #208 R5 cover owner vaccine creation entry point (rojo)`; `261d52da feat(mobile): #208 R5 show vaccine creation action for owners` |
| R6 | `screens/health/index.test.tsx::#208 R6: …` (tarjeta, CTA y 3 roles) | `75d1b82e test(mobile): #208 R6 cover owner empty vaccine card (rojo)`; `549c07f1 feat(mobile): #208 R6 add owner empty vaccine card with approved M3 inventories` |
| R7 | `screens/vaccine-create/index.test.tsx::#208 R7: …` | `a36818fb test(mobile): #208 R7 cover vaccine form structure and safe areas (rojo)`; `bb24921b feat(mobile): #208 R7 build vaccine form frame and species legend`; arnés RNTL14: `b3a8f461 test(mobile): #208 R7 use supported rendered tree queries (rojo)` |
| R8 | `screens/vaccine-create/index.test.tsx::#208 R8: …` | `31fbb693 test(mobile): #208 R8 cover catalog chips and fallback (rojo)`; `f0d571ed feat(mobile): #208 R8 load species catalog and render selectable vaccine chips` |
| R9 | `screens/vaccine-create/index.test.tsx::#208 R9: …` | `9e9cfb2c test(mobile): #208 R9 cover custom vaccine name and focus state (rojo)`; `afecc4e2 feat(mobile): #208 R9 add custom vaccine name field and counter` |
| R10 | `screens/vaccine-create/index.test.tsx::#208 R10: …` | `ce8b0145 test(mobile): #208 R10 cover dose date proposals and manual choices (rojo)`; `2c546a6c feat(mobile): #208 R10 propose and edit civil dose dates`; conservación al repetir chip: `69325d34 test(mobile): #208 R10 preserve manual dose on unchanged selection (rojo)`; `7e700588 feat(mobile): #208 R10 retain manual dose when chip is already selected` |
| R11 | `screens/vaccine-create/index.test.tsx::#208 R11: …` | `ae08a786 test(mobile): #208 R11 cover catalog and custom schedule guidance (rojo)`; `12bfdac5 feat(mobile): #208 R11 explain proposed and custom vaccine schedules` |
| R12 | `screens/vaccine-create/index.test.tsx::#208 R12: …` | `cb0f250f test(mobile): #208 R12 cover reminder selection and dose hint (rojo)`; `c49f94e7 feat(mobile): #208 R12 enable next dose reminder by default` |
| R13 | `screens/vaccine-create/index.test.tsx::#208 R13: …` | `cdcd1b13 test(mobile): #208 R13 cover optional vaccine fields and limits (rojo)`; `cd5af88a feat(mobile): #208 R13 add vet clinic and notes fields` |
| R14 | `screens/vaccine-create/index.test.tsx::#208 R14: …` | `e952ce3c test(mobile): #208 R14 cover vaccine submission validation and exact bodies (rojo)`; `f2f6d9fd feat(mobile): #208 R14 submit validated vaccine payloads` |
| R15 | `screens/vaccine-create/index.test.tsx::#208 R15: …` | `f55fb799 test(mobile): #208 R15 cover reminder timing and post-save navigation (rojo)`; `b91873e8 feat(mobile): #208 R15 create local nine oclock reminders after saving` |
| R16 | `screens/vaccine-create/index.test.tsx::#208 R16: …` y `screens/health/index.test.tsx::#208 R16: …` | `e725a74e test(mobile): #208 R16 cover persistent reminder failure notice (rojo)`; `84ff896d feat(mobile): #208 R16 persist reminder failure notice across navigation` |
| R17 | `screens/vaccine-create/index.test.tsx::#208 R17: …` | `4681d45e test(mobile): #208 R17 cover save failures and successful retry (rojo)`; `2e15f422 feat(mobile): #208 R17 preserve vaccine form on save failures` |
| R18 | `screens/vaccine-create/index.test.tsx::#208 R18: …` | `3337460c test(mobile): #208 R18 cover translated validation feedback (rojo)`; `280e98b8 feat(mobile): #208 R18 translate server validation without raw messages` |
| R19 | `providers/__tests__/language-provider.test.tsx::#194 R1 … (enmendado por #208 R19)` | `f4b65cf3 test(mobile): #208 R19 extend bilingual catalog inventory (rojo)`; `3031c6b4 feat(mobile): #208 R19 add vaccine flow translations` |
| R20 | `__tests__/ui-language.test.ts::#208 R20: R19_VACCINE_CREATE tiene 29 usos y cuadra con el código` y `#186 R7: … (enmendado por #208 R20)` | `be57c2e9 test(mobile): #208 R20 inventory all vaccine creation copy uses (rojo)`; feat omitido: nació verde, validado con mutaciones revertidas y adelantos en los feats de cada nodo |
| R21 | `__tests__/design-drift.test.ts::#208 R21: …` y los inventarios enmendados de `chunky-cta-canvas-fidelity`, `consistency-classnames`, `profile-canvas-fidelity` y `alerts-canvas-fidelity` (M3) | `9affc533 test(mobile): #208 R21 guard new vaccine files against style drift (rojo)`; feat omitido: nació verde, validado con mutaciones revertidas y adelantos en los feats de cada nodo |
| R22 | `init-e2e-gate.test.mjs::#208 R22: E2E_SETUP_CMD siembra el catálogo de vacunas entre migrar y aprovisionar` | `74329316 test(mobile): #208 R22 guard vaccine seed setup order (rojo)`; `4b4ec798 feat(mobile): #208 R22 seed vaccines before E2E provisioning` |

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: `test(mobile): #208 R<n> … (rojo)` y luego `feat(mobile): #208 R<n> …`.
Tabla consolidada en el commit documental final según el handoff; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).

Verificación automatizada final y sondas por R: [[../../progress/impl_mobile-vaccine-create|informe de implementación]]. T0 corregido: 5548 tests / 157 suites. Smoke en dispositivo reservado al humano; su casilla sigue sin marcar.
