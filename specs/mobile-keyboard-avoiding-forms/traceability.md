---
feature: "mobile-keyboard-avoiding-forms"
status: approved     # draft | approved
tags: [harness, spec, mobile]
---

# Trazabilidad — [[mobile-keyboard-avoiding-forms]]

Rutas relativas a `mobile-pet-tracker/`. El nombre del test es
`describe` › `it`, literal de [[requirements]].

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `src/app/(auth)/__tests__/login.test.tsx::#148 R1: login se aparta del teclado en Android › el host screen-login añade paddingBottom 200 al abrir el teclado` | `eba73094` — `test(mobile): lock the keyboard padding of login (#148 R1)`<br>`5fc9650e` — `feat(mobile): keep the login form above the keyboard (#148 R1)` |
| R2 | `src/app/(auth)/__tests__/register.test.tsx::#148 R2: register se aparta del teclado en Android › el host screen-register añade paddingBottom 200 al abrir el teclado` | `7e281c59` — `test(mobile): lock the keyboard padding of register (#148 R2)`<br>`203e541a` — `feat(mobile): keep the register form above the keyboard (#148 R2)` |
| R3 | `src/screens/reset-password/index.test.tsx::#148 R3: reset-password se aparta del teclado en Android › el host screen-reset-password añade paddingBottom 200 al abrir el teclado` | `f2f57bfd` — `test(mobile): lock the keyboard padding of reset-password (#148 R3)`<br>`0781cd9d` — `feat(mobile): keep the reset-password form above the keyboard (#148 R3)` |
| R4 | `src/screens/add-pet/index.test.tsx::#148 R4: add-pet se aparta del teclado en Android › el host screen-add-pet añade paddingBottom 291 al abrir el teclado` | `0e1332c5` — `test(mobile): lock the keyboard padding of add-pet (#148 R4, R8)`<br>`2dcf1364` — `feat(mobile): keep the add-pet form above the keyboard (#148 R4, R8)`<br>`1aa949ca` — `refactor(mobile): align the add-pet test provider (#148 R4)` |
| R5 | `src/screens/add-reminder/index.test.tsx::#148 R5: add-reminder se aparta del teclado en Android › el host screen-add-reminder añade paddingBottom 291 al abrir el teclado` | `24069204` — `test(mobile): lock the keyboard padding of add-reminder (#148 R5, R8)`<br>`0cb8c34f` — `feat(mobile): keep the add-reminder form above the keyboard (#148 R5, R8)` |
| R6 | `src/screens/pairing/index.test.tsx::#148 R6: pairing se aparta del teclado en Android › el host screen-pairing añade paddingBottom 291 al abrir el teclado` | `4ee981c7` — `test(mobile): lock the keyboard padding of pairing (#148 R6, R8)`<br>`8d816701` — `feat(mobile): keep the pairing form above the keyboard (#148 R6, R8)` |
| R7 | `src/screens/weight-log/index.test.tsx::#148 R7: weight-log se aparta del teclado en Android › el host screen-weight-log añade paddingBottom 291 al abrir el teclado` | `34621c02` — `test(mobile): lock the keyboard padding of weight-log (#148 R7, R8)`<br>`1739b277` — `feat(mobile): keep the weight-log form above the keyboard (#148 R7, R8)` |
| R8 (add-pet) | `src/screens/add-pet/index.test.tsx::#148 R8: add-pet entrega el primer toque con el teclado abierto › el scroll add-pet-form declara keyboardShouldPersistTaps handled` | `0e1332c5` — `test(mobile): lock the keyboard padding of add-pet (#148 R4, R8)`<br>`2dcf1364` — `feat(mobile): keep the add-pet form above the keyboard (#148 R4, R8)` |
| R8 (add-reminder) | `src/screens/add-reminder/index.test.tsx::#148 R8: add-reminder entrega el primer toque con el teclado abierto › el scroll add-reminder-form declara keyboardShouldPersistTaps handled` | `24069204` — `test(mobile): lock the keyboard padding of add-reminder (#148 R5, R8)`<br>`0cb8c34f` — `feat(mobile): keep the add-reminder form above the keyboard (#148 R5, R8)` |
| R8 (pairing) | `src/screens/pairing/index.test.tsx::#148 R8: pairing entrega el primer toque con el teclado abierto › el scroll pairing-form declara keyboardShouldPersistTaps handled` | `4ee981c7` — `test(mobile): lock the keyboard padding of pairing (#148 R6, R8)`<br>`8d816701` — `feat(mobile): keep the pairing form above the keyboard (#148 R6, R8)` |
| R8 (weight-log) | `src/screens/weight-log/index.test.tsx::#148 R8: weight-log entrega el primer toque con el teclado abierto › el scroll weight-log-form declara keyboardShouldPersistTaps handled` | `34621c02` — `test(mobile): lock the keyboard padding of weight-log (#148 R7, R8)`<br>`1739b277` — `feat(mobile): keep the weight-log form above the keyboard (#148 R7, R8)` |
| R9 | Sin test nuevo. Medición contra H0 `eb595a29` en `progress/impl_mobile-keyboard-avoiding-forms.md`: 16 ficheros permitidos, greps negativos 0 ×7, TextInput producción 6→6, copy/dependencias sin delta, globales 5/190 verdes e intactas. Reviewer repite la medición. | Código medido `8d816701`; cierre documental `HEAD` — `docs(mobile): trace #148 R1-R9 to their tests and commits` (autorreferencia, ver resolución abajo) |
| R10 | gate humano — 7 casillas de [[requirements]] §Prueba de humo; sin marcar por Codex | n/a (firma del humano) |

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: `test(mobile): … (#148 R<n>)` → `feat(mobile): … (#148 R<n>)`.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).

R9 identifica el propio commit de cierre por su mensaje literal. Su SHA se resuelve tras crearlo (y sigue resolviéndose si el leader añade bookkeeping):

```bash
git log -1 --format=%H --fixed-strings --grep="docs(mobile): trace #148 R1-R9 to their tests and commits"
```
