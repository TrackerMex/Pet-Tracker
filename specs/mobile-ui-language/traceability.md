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
| R3 | Home, 20 | pendiente | pendiente |
| R4 | Map, 19 | pendiente | pendiente |
| R5 | Health + peso, 32 | pendiente | pendiente |
| R6 | Food + horario, 35 | pendiente | pendiente |
| R7 | Profile + docs, 35 | pendiente | pendiente |
| R8 | Recordatorios, 50 | pendiente | pendiente |
| R9 | Alta de mascota, 40 | pendiente | pendiente |
| R10 | Emparejado, 40 | pendiente | pendiente |
| R11 | Reset password, 15 | pendiente | pendiente |
| R12 | catálogo + `t` | `mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx::#65 R12: el catálogo tiene los dos idiomas y t resuelve claves y parámetros` | rojo: `ac158f6`; verde: `20397ad feat(mobile-ui-language): add bilingual catalog and translator (R12)` |
| R13 | persistencia best-effort | `mobile-pet-tracker/src/utils/language-preference.test.ts::#65 R13: la preferencia de idioma persiste y es best-effort` | rojo: `e237589`; verde: `ff15b5b feat(mobile-ui-language): persist language preference (R13)` |
| R14 | interruptor en Profile | `mobile-pet-tracker/src/screens/profile/index.test.tsx::#65 R14: Profile cambia el idioma y repinta sin reiniciar` | rojo: `c77fcab`; verde: `8d97da2 feat(mobile-ui-language): add live Profile language toggle (R14)` |
| R15 | locale de fechas | `mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx::#65 R15: el locale de fechas y números sigue al idioma elegido`; `mobile-pet-tracker/src/screens/reminders/index.test.tsx::#65 R15: la fecha del recordatorio se formatea con el locale del idioma` | rojo: `103353b`; verde: `71015b1 feat(mobile-ui-language): bind date locales to language (R15)` |
| R16 | español por defecto | `mobile-pet-tracker/src/app/__tests__/layout.test.tsx::#65 R16: sin preferencia guardada la app arranca en español` | rojo: `5f4e718`; verde: `81a12fd feat(mobile-ui-language): restore startup language (R16)` |
| R17 | 6 `testID` de localización | pendiente | pendiente |
| R18 | cero copy suelta (320 sitios) | pendiente | pendiente |
| R19 | 9 enmiendas | pendiente | pendiente |
| R20 | carta de UI | pendiente | pendiente |

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
