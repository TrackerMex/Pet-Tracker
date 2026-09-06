---
feature: "mobile-ui-language"
status: approved     # draft | approved
tags: [harness, spec]
---

# Trazabilidad — [[mobile-ui-language]]

| Requisito | Qué cubre | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|---|
| R1 | `(auth)`, 29 ocurrencias | `mobile-pet-tracker/src/__tests__/ui-language.test.ts::#65 R1: el grupo (auth) resuelve su copy por clave` | rojo: `8c67895`; verde: `0dcf6bf feat(mobile-ui-language): localize auth copy (R1)` |
| R2 | barra de pestañas, 5 | `mobile-pet-tracker/src/__tests__/ui-language.test.ts::#65 R2: la barra de pestañas resuelve su copy por clave` | rojo: `d6cb58a`; verde: `fd04a3e feat(mobile-ui-language): localize tab bar copy (R2)` |
| R3 | Home, 20 | `mobile-pet-tracker/src/__tests__/ui-language.test.ts::#65 R3: Home resuelve su copy por clave` | rojo: `51bc7ed`; verde: `40f9f6e feat(mobile-ui-language): localize Home copy (R3)` |
| R4 | Map, 19 | `mobile-pet-tracker/src/__tests__/ui-language.test.ts::#65 R4: Map resuelve su copy por clave` | rojo: `fc77f22`; verde: `45fd835 feat(mobile-ui-language): localize Map copy (R4)` |
| R5 | Health + peso, 32 | `mobile-pet-tracker/src/__tests__/ui-language.test.ts::#65 R5: Health resuelve su copy por clave` | rojo: `b593f0f`; verde: `8bf82b0 feat(mobile-ui-language): localize Health copy (R5)` |
| R6 | Food + horario, 35 | `mobile-pet-tracker/src/__tests__/ui-language.test.ts::#65 R6: Food resuelve su copy por clave` | rojo: `eff8e4c`; verde: `a1a5bee feat(mobile-ui-language): localize Food copy (R6)` |
| R7 | Profile + docs, 35 | `mobile-pet-tracker/src/__tests__/ui-language.test.ts::#65 R7: Profile resuelve su copy por clave` | rojo: `9b3d904`; verde: `5665e0e feat(mobile-ui-language): localize Profile copy (R7)` |
| R8 | Recordatorios, 50 | `mobile-pet-tracker/src/__tests__/ui-language.test.ts::#65 R8: Recordatorios resuelve su copy por clave` | rojo: `81a171e`; verde: `f86d1cd feat(mobile-ui-language): localize Reminders copy (R8)` |
| R9 | Alta de mascota, 40 | `mobile-pet-tracker/src/__tests__/ui-language.test.ts::#65 R9: el alta de mascota resuelve su copy por clave` | rojo: `d5aa4f3`; verde: `c383345 feat(mobile-ui-language): localize Add pet copy (R9)` |
| R10 | Emparejado, 40 | `mobile-pet-tracker/src/__tests__/ui-language.test.ts::#65 R10: el emparejado del collar resuelve su copy por clave` | rojo: `11b3a5b`; verde: `793390b feat(mobile-ui-language): localize Pairing copy (R10)` |
| R11 | Reset password, 15 | `mobile-pet-tracker/src/__tests__/ui-language.test.ts::#65 R11: restablecer contraseña resuelve su copy por clave` | rojo: `05bbf53`; verde: `663b6e8 feat(mobile-ui-language): localize Reset password copy (R11)` |
| R12 | catálogo + `t` | `mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx::#65 R12: el catálogo tiene los dos idiomas y t resuelve claves y parámetros` | rojo: `ac158f6`; verde: `20397ad feat(mobile-ui-language): add bilingual catalog and translator (R12)` |
| R13 | persistencia best-effort | `mobile-pet-tracker/src/utils/language-preference.test.ts::#65 R13: la preferencia de idioma persiste y es best-effort` | rojo: `e237589`; verde: `ff15b5b feat(mobile-ui-language): persist language preference (R13)` |
| R14 | interruptor en Profile | `mobile-pet-tracker/src/screens/profile/index.test.tsx::#65 R14: Profile cambia el idioma y repinta sin reiniciar` | rojo: `c77fcab`; verde: `8d97da2 feat(mobile-ui-language): add live Profile language toggle (R14)` |
| R15 | locale de fechas | `mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx::#65 R15: el locale de fechas y números sigue al idioma elegido`; `mobile-pet-tracker/src/screens/reminders/index.test.tsx::#65 R15: la fecha del recordatorio se formatea con el locale del idioma` | rojo: `103353b`; verde: `71015b1 feat(mobile-ui-language): bind date locales to language (R15)` |
| R16 | español por defecto | `mobile-pet-tracker/src/app/__tests__/layout.test.tsx::#65 R16: sin preferencia guardada la app arranca en español` | rojo: `5f4e718`; verde: `81a12fd feat(mobile-ui-language): restore startup language (R16)` |
| R17 | 6 `testID` de localización | `mobile-pet-tracker/src/app/(tabs)/__tests__/food.test.tsx::#65 R17: los títulos de card se localizan por testID y su copy sigue asertada` | rojo: `b682f20`; verde: `877e30e feat(mobile-ui-language): locate card titles by testID (R17)` |
| R18 | cero copy suelta (320 sitios) | `mobile-pet-tracker/src/__tests__/ui-language.test.ts::#65 R18: los 320 sitios resuelven por clave y no queda copy suelta` | **bloqueado, sin commitear**: el escaneo destapa copy visible que el catálogo aprobado no contiene (`Microchip` y `No` en `add-pet/index.tsx`). `tasks.md` R18 (2) ordena parar y anotar en vez de inventar clave. Evidencia de mutación en `progress/impl_mobile-ui-language.md` |
| R19 | 9 enmiendas | `mobile-pet-tracker/src/__tests__/ui-language.test.ts::#65 R19: las 9 specs aprobadas llevan su enmienda de idioma` | rojo: `d26b520`; verde: `ff38129 docs(mobile-ui-language): amend the 9 specs that ratified English (R19)` |
| R20 | carta de UI | `mobile-pet-tracker/src/__tests__/ui-language.test.ts::#65 R20: la carta de UI fija el catálogo y el español por defecto` | rojo: `611c351`; verde: `55b4bff docs(ui): fix the two-language catalogue in the UI charter (R20)` |

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: `feat(mobile-ui-language): <desc> (R12)` — **un commit
por requisito**, con el commit del test rojo antes que el de la implementación
([[../../CHECKPOINTS|CHECKPOINTS]] C4). Orden de ejecución en [[tasks]]: **no**
es el orden de los ids.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida al
aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).

## Comprobaciones que el reviewer rehace, no hereda

Desde `mobile-pet-tracker/`:

| Qué | Comando o test | Esperado |
|---|---|---|
| Sitios resueltos por clave | `describe('#65 R18')` | 320 presencias de `t('<clave>'` |
| Cero copy suelta | `describe('#65 R18')` | 0 literales enteros del catálogo en los 19 archivos, **sin lista de excepciones** |
| Paridad de los dos idiomas | `describe('#65 R12')` + `tsc` | 255 claves en `es` y en `en`, mismos marcadores `{{…}}` |
| Consultas de texto | `grep -rEoh "(get\|query\|find)(All)?By(Text\|PlaceholderText\|LabelText\|DisplayValue)\(\|toHaveTextContent\(" src --include='*.test.ts*' \| wc -l` | **244** (era 246) |
| Consultas por `testID` | `grep -rEoh "By(TestId\|testId)\(" src --include='*.test.ts*' \| wc -l` | **≥ 800** (era 796) |
| Ningún `testID` borrado | `git diff` de la feature | cero líneas que **quiten** un `testID=` de fuente |
| Sin dependencias nuevas | `git diff mobile-pet-tracker/package.json` | vacío |
| Backend intacto | `git diff --stat` de la feature | ni un fichero de `backend-pet-tracker/` |
| Grep-clean C8 | `design-drift.test.ts`, `consistency-classnames.test.ts` | verdes, sin cambios |
| Enmiendas | los 9 `.md` de [[design]] §6.1 | bloque `## Enmienda #65` presente y casilla firmada por el humano |
