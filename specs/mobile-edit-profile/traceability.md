---
feature: "mobile-edit-profile"
status: approved      # draft | approved
tags: [mobile, ui, spec]
---

# Trazabilidad — [[mobile-edit-profile]]

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `src/providers/__tests__/language-provider.test.tsx::#194 R1: mantiene la base…` y `#194 R1: declara las claves de edición de perfil en los dos idiomas y su registro` | Rojo: `5f6b09ca309e324ca5f217724d6a0eb79625c930` — `test(mobile): require profile editing translations (#194 R1)`; verde: `f4661e01bbc2709fd1655d66b1cb0a18d4a55777` — `feat(mobile): add profile editing translations (#194 R1)` |
| R2 | `src/utils/account-rules.test.ts::#194 R2: validates %s` (6 casos) y `#194 R2: validateRegister conserva las issues de perfil` (NV) | Rojo: `48a16281dfa43f51437bdebec93cffd2c69619ce` — `test(mobile): specify shared profile validation (#194 R2)`; verde: `baffc76bdf2145f1998ffd5a18293366e8907c70` — `feat(mobile): share profile validation with registration (#194 R2)` |
| R3 | `src/api/__tests__/users.test.ts::#194 R3:*` (7 casos: PATCH, perfil completo, respuesta inválida, 401/400, otros estados, red y configuración) | Rojo: `1073c17fc75490fbcb800046a7ca06c79fa4f23b` — `test(mobile): specify profile update API results (#194 R3)`; verde: `f89e7773d5dd9977a67853d221de9d065b2b0d92` — `feat(mobile): update the current user profile (#194 R3)` |
| R4 | `src/app/__tests__/detail-stack.test.tsx::#194 R4: exposes a thin route importing the profile editor`; `layout.test.tsx::#194 R4:*`; `detail-stack.guard.test.tsx::#194 R4:*`; lista `/edit-profile` de `detail-stack.navigation.test.tsx` | Rojo: `116be34ad36a9e0e12a3d2547462d83797f8ed9c` — `test(mobile): require the protected profile editing route (#194 R4)`; verde: `cd2ec4272697348beb0799c3f1d540f5739b6c3d` — `feat(mobile): add the protected profile editing route (#194 R4)` |
| R5 | `src/screens/edit-profile/index.test.tsx::#194 R5:*` (6 casos); `src/__tests__/edit-profile.test.ts::#194 R5:*` (grep-clean, FieldErrorMessage y D2); inventario y copy de `ui-language.test.ts` | Rojo: `61746581534a804cd025964e6d07b550ab67e186` — `test(mobile): specify the populated profile editor (#194 R5)`; verde: `fd6c3e7b5314e40a9f7fc99d5ca03a2191268f97` — `feat(mobile): populate the profile editing form (#194 R5)` |
| R6 | `src/screens/edit-profile/index.test.tsx::#194 R6:*` (6 casos); CTA_ROWS/radios de `src/__tests__/chunky-cta-canvas-fidelity.test.ts`; inventarios de `consistency-classnames.test.ts` y `design-drift.test.ts` (E1) | Rojo: `0c10084ed69889d5390a54911b79f72f0fe15693` — `test(mobile): require inline profile validation on save (#194 R6)`; verde: `8df447ed2c54b6103891f9d739d0a37abe1c1f8f` — `feat(mobile): validate the profile form on save (#194 R6)` |
| R7 | `src/screens/edit-profile/index.test.tsx::#194 R7:*` (7 casos: cambios parciales, recorte, no-op, caché, submitting y exclusión de campos); keeps de CTA_ROWS | Rojo: `961cfb66dee6f22486f04ffb4946db8f43340971` — `test(mobile): specify partial profile saving and cache updates (#194 R7)`; verde: `ecaf9d28fe58e541d1c4aad77fa347bbfedc900f` — `feat(mobile): save changed profile values and refresh the cache (#194 R7)` |
| R8 | `src/screens/edit-profile/index.test.tsx::#194 R8:*` (7 casos: validación, red, genérico, 401, preservación, limpieza y excepción); copy de `ui-language.test.ts`; screenSignOutCalls de `design-drift.test.ts` | Rojo: `b7ba40595f553710dc4d26252f976209126f84a7` — `test(mobile): specify profile save errors and session expiry (#194 R8)`; verde: `621bfbd3a67f2e99b0eaaaf5f8d42a7377c5e0c7` — `feat(mobile): handle profile save errors without losing input (#194 R8)` |
| R9 | `src/screens/profile/index.test.tsx::#194 R9: opens the editor from the account row`, `hides editing while the account is pending or unavailable`, `shows cache updates without another profile request` y `orders the account children for $name without a section label`; copy de `ui-language.test.ts` | Rojo: `aecec3aadf203e82cc0fda4d7f1e06dc4551ea7e` — `test(mobile): require profile editing access and live account updates (#194 R9)`; verde: `04f8553c6c114210ab418e4d667cc29c321e1d77` — `feat(mobile): open profile editing from the account card (#194 R9)` |
| R10 | `src/__tests__/edit-profile.test.ts::#194 R10: lists edit-profile in the A11 paragraph of %s` (2 casos), `records the editing rule and its human approval checkbox` y `records A22 and its human approval checkbox in conventions` | Rojo: `d5171291482b30bfc88690ef3a0b275d87dd759a` — `test(mobile): require the profile editing charter amendment (#194 R10)`; verde: `cefbdffc8b5559316b1519d6c66a12397b8425cd` — `docs(ui): enmienda #194 (#194 R10)` |
| R11 | Guion literal entregado en `progress/impl_mobile-edit-profile.md`, §R11. Sin test automático; ejecución y firma de Android reservadas al humano | Guion incluido en este cierre documental: `docs(#194): traceability and implementation report`. La prueba humana sigue sin ejecutar ni firmar por el implementer |
| Enmienda E1 (R6) | `consistency-classnames.test.ts::#166 R2` (primarios con labio); `design-drift.test.ts::#178 R13` (rounded16) y `#179 R13` (text-17) | Rojo adicional: `4ff95035c269dce461806e43a5a15cd21273f610` — `test(mobile): inventory the profile editor button in the shared guards (#194 R6)` (21 rojos / 338 verdes); verde: `8df447ed2c54b6103891f9d739d0a37abe1c1f8f` — `feat(mobile): validate the profile form on save (#194 R6)` (359/359) |
| Enmienda E2 (R5) | `src/__tests__/profile-canvas-fidelity.test.ts::#173 R2.4: inventario de tamaños nuevos › limita text-13 a Perfil y a las pantallas de cuenta de #172 (E8)`; sonda S-E2 conforme | `0816a95aec3c97c454642bc52dac29a62504d77a` — `test(mobile): inventory the profile editor labels in profile-canvas-fidelity (#194 R5)` (26/26). Rojo previo medido sobre `cefbdffc8b5559316b1519d6c66a12397b8425cd`: 1 rojo / 25 verdes; S-E2: el mismo it rojo al retirar text-13 |

Las rutas `src/…` de tests se resuelven desde `mobile-pet-tracker/`. El reporte
registra las consultas, NV, recuentos y todas las sondas, incluidas las
precondiciones que explican sus rojos adicionales.

Correcciones de tests autorizadas, conservadas en la historia:

- R2: `5f1defbcef1135d24f8eba9570133fd1f540262a` — `test(mobile): keep the joint profile fixture independent of phone trimming (#194 R2)`; literal definitivo en `1bacbb1ca770a90039a6af02601acf1ffcf26ef8` — `test(mobile): use a six-character phone in the joint profile fixture (#194 R2)`.
- R5: `46eab29e2c2303c39948838ad80b6e46a8ed8feb` — `test(mobile): use supported editor queries in RNTL 14 (#194 R5)`.
- R9: `d1dd8398ef78f4c47c969e6754b7612c4d7d236f` — `test(mobile): inspect the name within the account identity (#194 R9)`.

Cierre 2: **132 suites / 4356 tests verdes** (T0 4297 + 59), typecheck y lint
sin caché correctos, graphify actualizado. La ejecución de `init.sh` corresponde
al leader. Las firmas de las enmiendas #194/A22 y la prueba R11 corresponden al
humano y conservan sus casillas sin marcar.

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: `feat(mobile): <desc> (#194 Rn)`.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).
No rebasear tras escribir hashes: un rebase los invalida (merge de `main`, no rebase).
