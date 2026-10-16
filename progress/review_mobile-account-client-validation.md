# review: mobile-account-client-validation (#183), ronda 1
Fecha: 2026-10-15 16:25 UTC
Veredicto: RECHAZADO

Revisado en el worktree `/home/claude/sites/Pet-Tracker-wt-183`, branch
`feature/183-mobile-account-client-validation`, HEAD `d3ac0fdd`, H0 `56a0b84a`.

**Resumen.** El código de producción es correcto. Las reglas coinciden con los
DTO, las cuatro pantallas siguen design.md y el historial rojo→verde está
limpio. El rechazo viene de los candados: siete mutaciones de producción
sobreviven en verde. Cuatro de ellas tocan la misma cláusula EARS de R3–R6,
«borrar `<pantalla>-error`», y las otras tres son reglas de R2. En los siete
casos el hueco está en la lista de candados que prescribe la spec, no en una
desviación de Codex: Codex escribió lo que la spec le pedía.

## Checklist C2 — Estado coherente
- [x] Solo 1 feature in_progress: `feature_list.json` tiene un único `"in_progress"`, el id 183
- [x] `progress/current.md` actualizado: lo tocó el leader en `0a98d7a0` (reanudación 1, B4 = 402)

## Checklist C3 — Arquitectura
- [x] Las capas domain e infrastructure no aplican: el cambio es solo móvil y el backend no se toca (`git diff 56a0b84a d3ac0fdd -- backend-pet-tracker` vacío)
- [x] `src/utils/account-rules.ts` es un módulo puro. Su único import es `import type { TranslationKey } from '../i18n/catalog'`, sin zod, react ni react-native
- [x] Las pantallas dependen del módulo de reglas y de `src/api/*`, que no cambian. Tampoco cambian `form-error.tsx`, `password-input.tsx` ni `account-screens-polish.test.ts`
- [x] No hay lógica de negocio en infraestructura

## Checklist C4 — TDD
- [x] Cada R1–R7 tiene `it` que nombran su R-id (`#183 Rn: …`). R8 es humano
- [x] El historial muestra test primero. Hay 7 pares `test(mobile)` → `feat(mobile)`, en orden. Cada `test` contiene solo tests y candados, y ningún commit mezcla las dos cosas
- [ ] **Cada cláusula EARS tiene un candado que falla sin su implementación: NO.** Ver E1 y E2

## Checklist C5 — Trazabilidad
- [x] `traceability.md` solo tiene `pendiente` en R8, que es «pendiente (humano)», la prueba de humo. Se acepta como en #167 R15
- [x] Los 14 hashes de R1–R7 son ancestros de HEAD (`git merge-base --is-ancestor`, 14/14)
- [x] Los commits siguen el formato `test|feat(mobile): <desc> (#183 Rn)`

## Checklist C6 — Spec aprobada
- [x] `requirements.md` tiene `status: approved` y `- [x] Aprobado por humano (fecha: 2026-10-15)`, firmado en `3c7e20c0`

## Checklist C7 — Sin código huérfano
- [x] Register ya no tiene `EMAIL_PATTERN` local, `RegisterFieldErrors`, `registerFields`, `isRegisterField`, `mapValidationErrors` ni el import de `ApiFieldError`. `grep -rn` en `src/` fuera de account-rules da 0
- [x] Los tests de lo eliminado se reescribieron dentro de R4 y R7, como dice la spec

## Checklist C8 — Carta de UI (`docs/ui-guidelines.md`)
- [x] Cada campo usa `TextField isInvalid` + `FieldError` + el `FormError` compartido. No hay componente nuevo ni estilos sueltos
- [x] Todo el copy pasa por `t(labelKey, params)`. Las 9 claves `validation.*` en `es` y `en` coinciden literalmente con requirements §Copy nuevo y con §2.30 de `specs/mobile-ui-language/design.md` (30 secciones; el catálogo tiene 411/411)
- [x] No hay `#183` suelto en comentarios: todos son `#183 Rn`. design-drift y legibility-classnames están en verde en init.sh
- [x] Pacto de sites-99: el mock de `HomeEntrance` en `src/screens/login/index.test.tsx` y el de reicon (`...actual` + `mockIcon`) en `src/screens/register/index.test.tsx` no cambian respecto a H0
- [x] `.expo/types/router.d.ts` no existe

## Verificaciones independientes

**Lista cerrada de ficheros.** `git diff --name-only 56a0b84a d3ac0fdd`, sin los
dos de `0a98d7a0` (`progress/current.md` y el handoff), da 17 ficheros: 14 de
`mobile-pet-tracker/` más `traceability.md`, `specs/mobile-ui-language/design.md`
y el informe. Coincide con design.md §Ficheros afectados.

**Paridad con los DTO.** Escribí un fuzz fuera del árbol que llama a los
schemas reales de `backend-pet-tracker/src/modules/auth/application/dto/` y a
`account-rules.ts` con las mismas entradas: 80 000 casos, 0 discrepancias de
validez. Las reglas no son ni más estrictas ni más laxas que los DTO.
`EMAIL_PATTERN` es el literal de zod 4.4.3 (`regexes.email`).

**Línea base.** Las 9 suites afectadas están verdes en HEAD: 417 `it`.

**Sondas propias** (todas en producción; después `git checkout HEAD -- <f>`,
y en todas `git diff --quiet HEAD` = 0 y `git diff --cached --quiet` = 0):

| Sonda | Mutación | Suites | Resultado |
|---|---|---|---|
| RV1 | `account-rules.ts`: el `max` del teléfono pasa a `>= 20` | account-rules, register | 2 rojos: cazada |
| RV2 | `forgot/index.tsx`: valida y envía `email` sin `trim()` | forgot | 11 rojos: cazada |
| RV3 | `login/index.tsx`: se quita `setFieldErrors({})` | login | 1 rojo: cazada |
| RV4 | `reset-password/index.tsx`: `t(labelKey)` sin `params` | reset-password | 3 rojos: cazada |
| RV5 | `account-rules.ts`: `values.lastName.trim().length > 120` pasa a `values.lastName.length > 120` | account-rules, register | **130 verdes: sobrevive** |
| RV6 | `account-rules.ts`: el país se recorta antes de medir longitud y letras | account-rules, register | **130 verdes: sobrevive** |
| RV7 | `account-rules.ts`: la confirmación compara `password.trim() !== passwordConfirmation.trim()` | account-rules, register, reset-password | **177 verdes: sobrevive** |
| RV8 | `login/index.tsx:32`: se borra `setError(null)` | login | **39 verdes: sobrevive** |
| RV9 | `register/index.tsx:63`: se borra `setGeneralError(null)` | register | **64 verdes: sobrevive** |
| RV10 | `forgot/index.tsx:34`: se borra el `setError(null)` de `submit()` | forgot | **47 verdes: sobrevive** |
| RV11 | `reset-password/index.tsx:37`: se borra `setError(null)` | reset-password | **47 verdes: sobrevive** |

## Observaciones

**E1 (media, bloqueante). Nada candado la cláusula «borrar `<pantalla>-error`» de R3, R4, R5 y R6.**

Las cuatro EARS dicen lo mismo con distinto testID:

- R3: «WHEN … `validateLogin` devuelve entradas, THE SYSTEM SHALL … borrar `login-error` y no llamar a `login(...)`».
- R4: borrar `register-error`.
- R5: borrar `forgot-error`.
- R6: borrar `reset-error`.

Las sondas RV8–RV11 borran la línea que lo implementa en cada pantalla y las
cuatro suites siguen verdes.

- **Por qué no las caza ningún test.** Las aserciones `expect(screen.queryByTestId('<x>-error')).toBeNull()` se ejecutan sin un error general previo, así que son tautológicas: el nodo no existe ni con la línea ni sin ella. Están en `login/index.test.tsx:449, 458, 468, 493`, `register/index.test.tsx:663, 696` y `forgot/index.test.tsx:184, 203, …`. En `reset-password/index.test.tsx` no hay ninguna en los `it` de `#183 R6`. La única aserción nula sobre `reset-error` es la heredada `#167 R10: sin error, el cuerpo no lleva el error`, que tampoco parte de un error previo.
- **Fallo real que dejaría pasar.** Un login con credenciales malas pinta `login-error`. Si el usuario vacía el correo y vuelve a pulsar, el aviso viejo sigue debajo junto al mensaje del campo.
- **Origen.** Los candados que prescribe requirements.md para R3 (it 1–3), R4 (it 1), R5 y R6 no montan un error general previo. Codex los escribió tal como estaban.
- **Qué falta.** Por pantalla, un `it` que nombre su R-id, pinte primero el error general por la vía de la API y, tras un envío inválido, asevere que `<x>-error` desaparece y que la API no se llamó de nuevo. Además, una sonda por pantalla en la tabla de sondas de la spec. Como los candados están prescritos literalmente, hace falta una enmienda de spec antes de volver a Codex.

**E2 (baja, bloqueante junto con E1). R2 no tiene candado para tres reglas de §Reglas.**

La EARS de R2 exige «la clave y el parámetro de la primera regla que falla
según §Reglas» para cualquier entrada, pero las tablas G y N no tienen filas
que distingan estas tres reglas:

- **RV5, apellidos.** `max 120` cuenta tras `trim()`. G8 y G9 no llevan espacios. Solo el nombre tiene G4 y la sonda S2.6, así que la tabla no es simétrica entre nombre y apellidos.
- **RV6, país.** `CountrySchema` no recorta (§Reglas, línea 116), pero ninguna fila lleva espacios en el país (por ejemplo `' MX'` o `'MX '`). Un cliente que recorte aceptaría lo que el servidor rechaza con 400.
- **RV7, confirmación.** El DTO compara con `===` sin recortar. G32 y N6 difieren en letras, no en espacios, así que una comparación con `trim()` pasa.

El código actual cumple las tres reglas (lo confirma el fuzz). Falta el
candado. Es una cláusula universal candada solo con algunos casos, y conviene
barrer §Reglas regla a regla al enmendar.

**O1 (informativa).** El frontmatter de `traceability.md` sigue en `status: spec_ready`. Lo actualiza el leader en el cierre.

**O2 (informativa).** R8, la prueba de humo en un dev build de Android, sigue `pendiente (humano)`. Queda fuera de este veredicto.

**O3 (informativa).** No hay ninguna desviación de Codex. La parada en c1 se debió a la cifra B4 del handoff (398 en vez de 402), que la reanudación 1 corrigió.

## Output de ./init.sh

No lo ejecuté yo: el clasificador se lo deniega al subagente, y LocalStack y
Postgres son compartidos. Leí el log del leader,
`/tmp/claude-1002/-home-claude-sites-Pet-Tracker/0ef84434-e469-48e1-be8c-eece27073916/scratchpad/init-183-cierre.log`
(escrito a las 16:13 UTC). HEAD sigue en `d3ac0fdd` (commit de las 16:02 UTC).

```
Test Suites: 187 passed, 187 total          (backend unit)
Tests:       1474 passed, 1474 total
Test Suites: 2 passed, 2 total
Tests:       14 passed, 14 total
Test Suites: 111 passed, 111 total          (móvil)
Tests:       3506 passed, 3506 total
Test Suites: 3 skipped, 30 passed, 30 of 33 total   (backend e2e)
Tests:       8 skipped, 468 passed, 476 total
✅ Lint sin errores
✅ Typecheck sin errores
✅ Todo verde. Listo para trabajar.
exit=0
```

El aviso `A worker process has failed to exit gracefully` del ALL móvil ya
sale en main y no cuenta.

## Barrido exhaustivo previo a E1

Lo pidió el leader antes de redactar la enmienda, para no enmendar a trozos. El
veredicto no cambia: **RECHAZADO**.

**Método.**

- Cada EARS de R1–R7 se parte en cada WHEN/IF, cada «o», «cualquier» o «cada», y cada efecto.
- Cada fila de §Reglas se cruza por campo con las tablas C, L, G, F y N.
- Cada cláusula se cruza con su pantalla y su campo.
- Las sondas mutan solo producción y se corren con `bunx jest --testTimeout=30000 --runTestsByPath <suites>`. Nunca corrí jest sin rutas ni `init.sh`.
- Cada sonda se revierte con `git checkout HEAD -- <f>`. En todas, `git diff --quiet HEAD` y `git diff --cached --quiet` dieron 0, y ninguna tuvo timeouts.
- Las sondas se plantaron sobre `a2e2a37e`. Su `mobile-pet-tracker/` es idéntico al de `d3ac0fdd` (`git diff --quiet` = 0).
- Las filas propuestas para §Reglas se midieron, además, con un spike fuera del árbol: copias mutadas de `account-rules.ts` evaluadas con bun.
- Las filas de correo propuestas se midieron con el escaneo de mutantes del literal y con `z.email()` de zod 4.4.3 en `backend-pet-tracker/`.

**Abreviaturas de ficheros de test** (todos bajo `mobile-pet-tracker/src/`):

| Abreviatura | Fichero |
|---|---|
| AR | `utils/account-rules.test.ts` |
| LG | `screens/login/index.test.tsx` |
| RG | `screens/register/index.test.tsx` |
| FG | `screens/forgot/index.test.tsx` |
| RS | `screens/reset-password/index.test.tsx` |
| LP | `providers/__tests__/language-provider.test.tsx` |
| UL | `__tests__/ui-language.test.ts` |

Las líneas de producción citadas son las de HEAD. Una sonda «S» es de Codex; su salida está en
`progress/impl_mobile-account-client-validation.md`.

### Tabla cláusula × rama × candado × sonda × resultado

#### R1. Catálogo

| Cláusula | Rama | Candado | Sonda | Resultado |
|---|---|---|---|---|
| Nueve claves con valor literal | `en` | LP:647 | C29: `catalog.ts:10` cambia «Check them» por «Check it» | cazada |
| Nueve claves con valor literal | `es` | LP:647 | C30: `catalog.ts:426` cambia «Revísalos» por «Revisa» | cazada |
| Marcadores `{{min}}` y `{{max}}` iguales en los dos idiomas | — | LP:51, LP:647 | C32: `catalog.ts:421`, en `es`, `{{min}}` pasa a `{{max}}` | cazada, 2 rojos |
| Longitud del catálogo `+ 9` | — | LP:51 | S1.2: borra `countryLetters` en los dos idiomas | cazada (Codex) |
| Fila en `specs/mobile-ui-language/design.md` §2.N | — | LP:647 lee design.md | sin sonda: el fichero no es producción | no medido (delimitación) |

#### R2. Validadores

| Cláusula | Rama | Candado | Sonda | Resultado |
|---|---|---|---|---|
| `EMAIL_PATTERN` es el literal de zod | 27 mutantes del literal | AR:26–44 (15 filas C) | escaneo con node; en jest, B4 (dominio sin `-`), B5 (TLD `{2,6}`) y B6 (último carácter local sin `_`) | **15 sobreviven** al escaneo: 14 reales y la bandera `i`, que es equivalente. B4–B6 dan 216 verdes en AR, LG, RG y FG. Ver H11 |
| Una entrada por campo inválido, sin `undefined` | — | `toStrictEqual` en L, G, F y N | A4: `account-rules.ts:23` asigna `undefined` | cazada en L1–L3 y L6 |
| `{}` cuando todo cumple | — | L1, G1, F1, N1 | todas las sondas de frontera de abajo | cazada |
| `labelKey` literal una sola vez | — | UL:491, UL:71 | A35: `:55` usa un literal en línea | cazada |
| Parámetro de `tooShort` | — | G15, G16, G28, G33, N2, N7 | A37: `:17`, `min` pasa a `min + 1` | cazada, 6 rojos |
| Parámetro de `tooLong` | — | F4, G5, G9, G13, G19, G31, N5 | A36: `:18`, `max` pasa a `max + 1` | cazada |
| Register compone forgot y reset | — | G10–G14, G28–G33 | A34: `:40` borra el spread de `validateForgot` | cazada |

#### §Reglas por campo

| Cláusula | Rama | Candado | Sonda | Resultado |
|---|---|---|---|---|
| Correo de login | formato | L3, L5 + tabla C | (ver `EMAIL_PATTERN`) | ver H11 |
| Correo de login | sin `max` | L6 | A5: añade `max 320` | cazada |
| Correo de login | el validador no recorta | — | A1: `:22` recorta | equivalente: la pantalla recorta antes (C39) |
| Contraseña de login | `min 1` | L4, L5 | A2: `< 2` | cazada en L2 |
| Contraseña de login | sin recortar | L2 | A3 | cazada en L2 |
| Nombre | requerido tras recortar | G2, G3 | A7 | cazada en G3 |
| Nombre | frontera `min 1`: una letra pasa | — | A6/B1: `:42`, `< 1` pasa a `< 2` | **130 verdes** (AR + RG): H8 |
| Nombre | `max 120` tras recortar | G4 | A8 | cazada |
| Nombre | frontera 120 | G4, G5 | A9: `>= 120` | cazada |
| Nombre | requerido antes que `max` | — | A38: `:43`, `else if` pasa a `if` | equivalente: las dos reglas no fallan a la vez |
| Apellidos | requerido tras recortar | G6, G7 | A11 | cazada en G7 |
| Apellidos | frontera `min 1` | — | A10/B2: `:44`, `< 1` pasa a `< 2` | **130 verdes**: H9 |
| Apellidos | frontera 120 | G8, G9 | A12: `>= 120` | cazada |
| Apellidos | `max 120` tras recortar | — | RV5 | **130 verdes**: H5 (E2) |
| Correo de registro y recuperar | formato antes que longitud | G14, F5 | A20 | cazada |
| Correo de registro y recuperar | `else` | G14, F5 | A21 | cazada |
| Correo de registro y recuperar | frontera 320 | G12, G13, F3, F4 | A22: `>= 320` | cazada en F3 y G12 |
| Correo de registro y recuperar | el validador no recorta | — | A19 | equivalente: las pantallas recortan (RV2, C40, C41) |
| Teléfono | `min 7` tras recortar | G16 | A13 | cazada |
| Teléfono | frontera 7 | G15, G17, G18 | A14 | cazada en G17 y G18 |
| Teléfono | `max 20` tras recortar | G20 | A15 | cazada |
| Teléfono | frontera 20 | G19, G20 | RV1 | cazada |
| País | sin recortar | — | RV6 | **130 verdes**: H6 (E2) |
| País | longitud 2 | G21–G24 | A16: `!== 2` pasa a `< 2` | cazada en G23 |
| País | solo letras A–Z, sin bandera `i` | G25–G27 | A18 | cazada en G25 |
| País | longitud antes que letras | G21–G24 | A17 | cazada |
| Contraseña de registro y reset | frontera `min 8` | G29, N3 | A23: `< 9` | cazada |
| Contraseña de registro y reset | `min` sin recortar | G29, N3 | A24 | cazada |
| Contraseña de registro y reset | frontera `max 128` | G30, N4 | A25: `>= 128` | cazada |
| Contraseña de registro y reset | `max` sin recortar | — | A26/B3: `:63` mide `trim().length` | **177 verdes** (AR, RG, RS): H10 |
| Confirmación | `===` distingue mayúsculas | G32 | A27 | cazada |
| Confirmación | independiente de la regla de contraseña | G33, N7 | A28 | cazada |
| Confirmación | recorte de un solo lado | G29, N3 | A29, A30 | cazadas |
| Confirmación | recorte de los dos lados | — | RV7 | **177 verdes**: H7 (E2) |

#### R3. Login

| Cláusula | Rama | Candado | Sonda | Resultado |
|---|---|---|---|---|
| WHEN inválido: pinta en el `FieldError` del campo | correo | LG:444 ×4 | C1: `login/index.tsx:109` sin `isInvalid` | cazada, 7 rojos |
| WHEN inválido: pinta en el `FieldError` del campo | contraseña | LG:453 | C2: `:128` | cazada, 4 rojos |
| WHEN inválido: pinta en el `FieldError` del campo | cada mensaje en su campo | LG:444, 453, 462 | C4: `:36` cruza correo y contraseña | cazada, 8 rojos |
| Con icono | — | LG:444–497 | C34: `form-error.tsx:11` borra el icono | cazada, 9 rojos |
| Con texto seleccionable | — | LG:444–497 | C33: `form-error.tsx:12` sin `selectable` | cazada, 9 rojos |
| Borrar `login-error` | — | LG:449, 458, 468 y 493 son tautológicas | RV8: `:32` | **39 verdes**: H1 (E1) |
| No llamar a `login` | — | LG:444, 453, 462 | C35: `:37` borra el `return` | cazada, 8 rojos (= S3.2) |
| Reenviar válido limpia los mensajes | — | LG:497 | RV3: `:31` | cazada |
| WHEN pasa: `email.trim()` | — | LG:479 | C39: `:42` envía `{ email, password }` | cazada (= S3.1) |
| WHEN pasa: `password` sin recortar | — | LG:472 | C3: `:33` | cazada |
| Copy en inglés | — | LG:486 (literales), LP:647 | sin sonda propia: C29 toca `checkDetails`, no el copy de R3 | candado por literal exacto; no sondeado aparte |

#### R4. Registro

| Cláusula | Rama | Candado | Sonda | Resultado |
|---|---|---|---|---|
| Pinta en el `FieldError` de cada campo | nombre | RG:634, 700, 710 | C14: `register/index.tsx:153` | cazada, 7 rojos |
| Pinta en el `FieldError` de cada campo | apellidos | ídem | C45: `:169` | cazada, 5 rojos |
| Pinta en el `FieldError` de cada campo | correo | ídem | C46: `:187` | cazada, 11 rojos |
| Pinta en el `FieldError` de cada campo | teléfono | ídem | C15: `:207` apunta a `country` | cazada |
| Pinta en el `FieldError` de cada campo | país | ídem | C47: `:224` | cazada, 7 rojos |
| Pinta en el `FieldError` de cada campo | contraseña | ídem | C48: `:244` | cazada, 5 rojos |
| Pinta en el `FieldError` de cada campo | confirmación | ídem | C49: `:260` | cazada, 4 rojos |
| Parámetros por campo | nombre, apellidos, correo, teléfono, contraseña | RG:634, filas 3, 5, 8, 9–10 y 15–16 | C9, C10, C11, C12, C13 | cazadas |
| Borrar `register-error` | — | RG:663, tautológica | RV9: `:63` | **64 verdes**: H2 (E1) |
| No llamar a `register` | — | RG:634, 700 | C36: `:70` borra el `return` | cazada, 24 rojos (= S4.4) |
| Reenviar válido limpia los mensajes | — | RG:456 (#172 R12) | C8: `:62` | cazada |
| WHEN pasa: `email.trim()` | a `register` | RG:722 | C40: `:76` envía `email` sin recortar | cazada |
| WHEN pasa: `email.trim()` | al `login` siguiente | RG:722 | C41: `:84` | cazada |
| Sin el `EMAIL_PATTERN` local de #172 | — | RG:634, filas 6–8 | C31: `:67` reintroduce el patrón de #172 | cazada, 3 rojos. El grep de `EMAIL_PATTERN` fuera de `account-rules.ts` da 0 |

#### R5. Recuperar

| Cláusula | Rama | Candado | Sonda | Resultado |
|---|---|---|---|---|
| Valida `email.trim()` | — | FG:688 | RV2 | cazada, 11 rojos |
| Pinta en `forgot-email-error` | — | FG:688 ×4, FG:717 | C44: `forgot/index.tsx:118` | cazada, 5 rojos |
| Parámetro `max 320` | — | FG:688, fila 4 | C22: `:135` | cazada |
| Borrar `forgot-error` | — | FG:184, 203…, tautológicas | RV10: `:34` | **47 verdes**: H3 (E1) |
| Sigue en el formulario | — | FG:688, FG:717 | C21: `setSent(true)` tras marcar | cazada |
| No llamar a `forgotPassword` | — | FG:688 | C37: `:39` borra el `return` | cazada, 5 rojos (= S5.1) |
| Reenviar válido limpia el mensaje | — | FG:717 es tautológica | C18: `:33` | **47 verdes**: H12 |
| Botón desactivado | vacío o solo espacios | FG:166, FG:296 ×5 | C19: `:150` sin `trim()` | cazada |
| Un correo de 320 pasa | — | FG:708, F3 | A22 | cazada |
| El reenvío no se revalida | — | FG:396 (#117 R6) | — | delimitación de la spec |
| Copy literal vía `t()` | — | UL:495 | C50: `:135` copy fijo en español | cazada |

#### R6. Nueva contraseña

| Cláusula | Rama | Candado | Sonda | Resultado |
|---|---|---|---|---|
| Pinta en el `FieldError` de cada campo | contraseña | RS:616, filas 1–2; RS:633 | C25: `reset-password/index.tsx:200` | cazada |
| Pinta en el `FieldError` de cada campo | confirmación | RS:616, fila 3; RS:633 | C43: `:218` | cazada, 2 rojos (= S6.2) |
| Parámetros | — | RS:616 | RV4 | cazada, 3 rojos |
| Borrar `reset-error` | — | ninguno en `#183 R6` | RV11: `:37` | **47 verdes**: H4 (E1) |
| No llamar a `resetPassword` | — | RS:616 ×3, RS:633 | C38: `:42` borra el `return` | cazada, 4 rojos (= S6.1) |
| Contraseña sin recortar | — | RS:645, fila `' '.repeat(8)` | C42: `:38` | cazada (= S6.3) |
| Reenviar válido limpia los mensajes | — | ninguno | C26: `:36` | **47 verdes**: H13 |
| Copy literal | — | UL:495 | — | mismo guard que C50; no sondeado aparte |

#### R7. Un 400 en las cuatro pantallas

| Pantalla | Rama | Candado | Sonda | Resultado |
|---|---|---|---|---|
| Login | genérico exacto | LG:146 | C6: añade los `path` | cazada |
| Login | sin `message` | LG:147–148 | S7.1 | cazada (Codex) |
| Login | sin `path` | LG:146, exacto | C6 | cazada |
| Login | sin marcar campo | LG:149 | C5: `:56` marca el correo | cazada |
| Registro | genérico exacto | RG:223 | C16: añade los `message` | cazada |
| Registro | sin `message` | RG:224–226 | C16 | cazada |
| Registro | sin `path` | RG:223, exacto | mismo mecanismo que C16 | no sondeado aparte |
| Registro | sin marcar campo | RG:227 | C17: `:100` marca el nombre | cazada (= S7.2) |
| Recuperar | genérico exacto | FG:297/308 | C23: añade los `message` | cazada, 3 rojos |
| Recuperar | sin `message` ni `path` | FG:308, exacto | C23 | cazada |
| Recuperar | sin marcar campo | ninguno | C20: `:55` marca el correo | **47 verdes**: H14 |
| Nueva contraseña | genérico exacto | RS:246–249 (`toBe`) | C28 | cazada |
| Nueva contraseña | sin `message` ni `path` | RS:246–249, exacto | C28 | cazada |
| Nueva contraseña | sin marcar campo | ninguno | C27: `:63` marca la confirmación | **47 verdes**: H15 |
| Copy en inglés | — | LP:647 | C29 | cazada |

**Equivalentes y delimitaciones (no son huecos):**

- **A1 y A19** (el validador recorta el correo): las pantallas ya recortan, y RV2, C39, C40 y C41 lo candan.
- **A38** (`else if` pasa a `if` entre `min` y `max`): las dos reglas no pueden fallar a la vez. Lo mismo vale para teléfono y contraseña.
- **La bandera `i` en `EMAIL_PATTERN`**: todas las clases ya incluyen `A-Za-z`, y sin `u` ningún carácter no ASCII se pliega a ASCII.
- **El reenvío de R5 no se revalida.** Es una delimitación de la spec.
- **El borrado al teclear (P7)** queda fuera de alcance: los mensajes persisten hasta el siguiente envío.
- **El registro en design.md** queda candado por LP:647, pero no lo sondeé porque no es producción.

### Huecos

**Por qué falla el candado en H1–H4.** Toda aserción `queryByTestId('<x>-error')).toBeNull()` de R3–R6 parte de una pantalla sin error general previo.

1. **H1 (E1, R3).**
   - **Mutación:** se borra `setError(null);` en `login/index.tsx:32` (RV8).
   - **Resultado:** 39 verdes.
   - **Candado:** en LG:133 (`#183 R7`), tras la línea 149:
     - `await submit('', 'correct horse')`;
     - `login-error` pasa a null;
     - `login-email-message` dice «Ingresa un correo electrónico válido»;
     - `mockLogin` se llamó 1 vez.

     El título pasa a nombrar también R3. El recuento no cambia.
2. **H2 (E1, R4).**
   - **Mutación:** se borra `setGeneralError(null);` en `register/index.tsx:63` (RV9).
   - **Resultado:** 64 verdes.
   - **Candado:** en RG:209 (`#183 R7`), tras la línea 227:
     - se cambia `register-email` a `alex.example.com` y se envía;
     - `register-error` pasa a null;
     - `register-email-message` está presente;
     - `mockRegister` se llamó 1 vez.

     El título nombra también R4. El recuento no cambia.
3. **H3 (E1, R5).**
   - **Mutación:** se borra el `setError(null);` de `submit()` en `forgot/index.tsx:34` (RV10).
   - **Resultado:** 47 verdes.
   - **Candado:** en el cuerpo del `it.each` FG:296 (`#117 R7`, 5 kinds), tras `expectFormState` y antes del `'   '` final:
     - `await submitForgot('alex.example.com')`;
     - `forgot-error` pasa a null;
     - `forgot-email-message` está presente;
     - `mockForgotPassword` se llamó 1 vez.

     Cubre los cinco kinds. El recuento no cambia, pero el título heredado debe nombrar `#183 R5` o la fila debe citarlo en traceability.
4. **H4 (E1, R6).**
   - **Mutación:** se borra `setError(null);` en `reset-password/index.tsx:37` (RV11).
   - **Resultado:** 47 verdes.
   - **Candado:** en RS:231 (`#183 R7`), tras la línea 250:
     - contraseña y confirmación pasan a `'1234567'` y se envía;
     - `reset-error` pasa a null;
     - `reset-password-message` dice «Usa al menos 8 caracteres»;
     - `mockResetPassword` se llamó 1 vez.

     El título nombra también R6. El recuento no cambia.
5. **H5 (E2).**
   - **Mutación:** en `account-rules.ts:45`, `values.lastName.trim().length > 120` pasa a `values.lastName.length > 120` (RV5).
   - **Resultado:** 130 verdes.
   - **Candado:** G8 pasa a `{ lastName: ' ' + 'a'.repeat(120) + ' ' }` → `{}`. Es el espejo de G4.
   - **Spike:** caza RV5, y A12 sigue cazada por la misma fila. El recuento no cambia.
6. **H6 (E2).**
   - **Mutación:** antes de `account-rules.ts:48` se inserta `values.country = values.country.trim();` (RV6).
   - **Resultado:** 130 verdes.
   - **Candado:** G23 pasa de `'MEX'` a `'MX '` → `countryLength`.
   - **Spike:** caza RV6 y sigue cazando A16 y A17. El recuento no cambia.
   - **Alternativa:** una fila G34 `' MX'` (+1).
7. **H7 (E2).**
   - **Mutación:** en `account-rules.ts:64`, la comparación pasa a `values.password.trim() !== values.passwordConfirmation.trim()` (RV7).
   - **Resultado:** 177 verdes.
   - **Candado:** la confirmación de N6 pasa de `'new-password-124'` a `'new-password-123 '` → `passwordsDontMatch`. G32 conserva la diferencia de letras.
   - **Spike:** caza RV7. El recuento no cambia.
8. **H8.**
   - **Mutación:** en `account-rules.ts:42`, `< 1` pasa a `< 2` (A6/B1).
   - **Resultado:** 130 verdes.
   - **Candado:** `VALID.firstName` pasa de `'Alex'` a `'A'`, y G1 lo caza.
   - **Spike:** caza A6. El recuento no cambia. `VALID` está prescrito literalmente en requirements.md:328, así que la enmienda lo cambia allí.
9. **H9.**
   - **Mutación:** en `account-rules.ts:44`, `< 1` pasa a `< 2` (A10/B2).
   - **Resultado:** 130 verdes.
   - **Candado:** `VALID.lastName` pasa de `'Smith'` a `'S'`.
   - **Spike:** caza A10. El recuento no cambia.
10. **H10.**
    - **Mutación:** en `account-rules.ts:63`, `values.password.length > 128` pasa a `values.password.trim().length > 128` (A26/B3).
    - **Resultado:** 177 verdes.
    - **Candado:** N5 pasa a `'a'.repeat(128) + ' '` en los dos campos → `tooLong(128)`. G31 puede cambiar igual, aunque no hace falta.
    - **Spike:** caza A26, y A25 sigue cazada por G30 y N4. El recuento no cambia.
11. **H11.** El escaneo del literal deja 14 mutantes reales vivos:
    - parte local sin `_`, `-`, `.` o dígitos;
    - último carácter local sin `_`, `+`, `-` o dígitos;
    - primer carácter del dominio sin dígitos;
    - resto del dominio sin `-` o sin dígitos, o admitiendo `_`;
    - TLD `{2,6}`;
    - parte local con `+` en vez de `*`.

    Tres de ellos (B4–B6) se midieron también en jest: 216 verdes.
    - **Candado más barato** (el recuento no cambia): en el cuerpo de AR:42–44 se añaden estas dos líneas, con el literal tecleado a mano desde §Reglas. No compara `EMAIL_PATTERN` consigo mismo, así que no choca con la convención de requirements.md:227:
      ```ts
      expect(EMAIL_PATTERN.source).toBe(String.raw`^(?!\.)(?!.*\.\.)([A-Za-z0-9_'+\-\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$`);
      expect(EMAIL_PATTERN.flags).toBe('');
      ```
    - **Alternativa de comportamiento** (+5 filas C). Matan los 14 en el escaneo, y zod 4.4.3 da los mismos booleanos:
      - `['a_1-b.c_@x2-y.example.technology', true]`
      - `['z9@1x.io', true]`
      - `['+@b.co', true]`
      - `['a-@b.co', true]`
      - `['a@b_c.co', false]`
12. **H12 (R5).**
    - **Mutación:** se borra `setFieldErrors({});` en `forgot/index.tsx:33` (C18).
    - **Resultado:** 47 verdes.
    - **Por qué:** FG:717 reenvía con `kind: 'ok'`, que sustituye el formulario por «Revisa tu correo», así que el null de `forgot-email-message` es tautológico.
    - **Candado:** en el mismo cuerpo que H3, tras el envío inválido:
      - `await submitForgot('  Ana@Example.com ')`, con el mock aún en el kind fallido;
      - `forgot-email-message` pasa a null;
      - `forgot-error` vuelve a decir el copy de la fila;
      - `mockForgotPassword` se llamó 2 veces.

      El recuento no cambia.
13. **H13 (R6).**
    - **Mutación:** se borra `setFieldErrors({});` en `reset-password/index.tsx:36` (C26).
    - **Resultado:** 47 verdes.
    - **Por qué:** ningún `it` reenvía tras un error de campo.
    - **Candado:** en RS:231, tras H4:
      - contraseña y confirmación pasan a `'new-password-123'` y se envía, con el mock aún en `validation`;
      - `reset-password-message` pasa a null;
      - `reset-error` vuelve al genérico;
      - `mockResetPassword` se llamó 2 veces.

      El recuento no cambia.
14. **H14 (R7 en recuperar).**
    - **Mutación:** en el caso `validation` de `forgot/index.tsx:55` se añade `setFieldErrors({ email: { labelKey: "forgot.invalidEmail" } });` (C20).
    - **Resultado:** 47 verdes.
    - **Candado:** en el cuerpo de FG:296, justo tras `findByTestId('forgot-error')`, `expect(screen.queryAllByTestId(/^forgot-.+-message-row$/)).toHaveLength(0)`. Vale para los cinco kinds. El recuento no cambia.
15. **H15 (R7 en nueva contraseña).**
    - **Mutación:** en el caso `validation` de `reset-password/index.tsx:63` se añade `setFieldErrors({ passwordConfirmation: { labelKey: "validation.passwordsDontMatch" } });` (C27).
    - **Resultado:** 47 verdes.
    - **Candado:** en RS:231, tras la línea 250, `expect(screen.queryAllByTestId(/^reset-password(-confirm)?-message-row$/)).toHaveLength(0)`. El recuento no cambia.

**Resumen.**

- Hay 15 huecos:
  - **E1** son H1–H4.
  - **E2** son H5–H7.
  - Ocho son nuevos: H8–H15.
- Todos los candados propuestos caben en `it` o filas existentes. Lo único que suma recuento es la alternativa de comportamiento de H11 (+5) o la alternativa de H6 (+1).
- Los candados de H5–H10 están medidos con el spike.
- Los de H1–H4 y H12–H15 no tienen spike, porque escribir tests en el árbol queda fuera de mi papel. La enmienda debe añadir a su tabla de sondas RV8–RV11, C18, C20, C26 y C27, y exigir `await` en cada `fireEvent` y `waitFor` sobre el mensaje del campo (RNTL 14).
- G8, G23, N5, N6, `VALID` y la tabla C están prescritos literalmente en requirements.md, así que la enmienda los cambia allí antes de volver a Codex.

## Pre-check de la Enmienda E1 (2026-10-15)

Veredicto: **E1 LISTA PARA FIRMA**

Sobre `9f32ba63`. Lo pidió el leader antes de la firma humana de E1; Codex aún no aplicó nada.

Método: copié `mobile-pet-tracker/` al scratchpad con `git init` y un commit base. `node_modules`, `specs/`, `docs/` y `progress/` quedaron como enlaces simbólicos al worktree, porque LP y UL leen `../specs` y `../docs`. Apliqué c16–c20 con el comando literal de `tasks.md` §E1, un commit por parche. `sondas_e1.py` corrió en primer plano, un grupo cada vez, sin timeouts. El resto de mutaciones las planté a mano. Tras cada sonda restauré con `git checkout HEAD --` y comprobé `git diff --quiet HEAD` y `--cached`. El working tree del worktree no lo toqué salvo para este informe.

### 1. Parches contra §Enmienda E1

- Los cinco sha256 coinciden con la tabla de commits (`requirements.md` §Enmienda E1, c16–c20).
- Las rutas relativas `../progress/e1_mobile-account-client-validation/cNN.patch`, ejecutadas desde `mobile-pet-tracker/`, resuelven (`git apply --check` en los dos sentidos). `python3` está en 3.12.3.
- Los parches tocan solo los cinco ficheros de test: 86 inserciones y 5 borrados. Ninguno toca producción, `catalog.ts`, `ui-copy-table.ts` ni las fórmulas de `ui-language.test.ts`.
- **c16** cambia `VALID` a `'A'`/`'S'` y añade las filas C16–C20. G8 pasa a `' ' + 'a'.repeat(120) + ' '`, G23 a `'MX '`, N5 a `'a'.repeat(128) + ' '` en los dos campos, y la confirmación de N6 a `'new-password-123 '`. Todo cuadra con R2 (`requirements.md:329`, `:352–356`, `:381`, `:396`, `:426–427`), con 71 casos en total.
  - Las cinco decisiones de C16–C20 coinciden con `z.email()` de zod 4.4.3.
  - `z.regexes.email` es idéntico al `EMAIL_PATTERN` de producción.
- **c17** añade el `it` de R3 al final del describe `#183 R3`.
- **c18** añade el `it` de R4 al final del describe `#183 R4`.
- **c19** añade dos `it`:
  - el de R7, dentro de `#117 R7…` y antes de `un reintento…`;
  - el de R5, al final de `#183 R5`.
- **c20** añade dos `it`:
  - el de R7, dentro de `R8: el submit…` y antes de `deshabilita el boton…`;
  - el de R6, al final de `#183 R6`.
- Los `it` nuevos usan `await` en cada `fireEvent` y esperan el mensaje del campo con `waitFor`.
- Pacto sites-99: `grep -cF HomeEntrance` sobre c17.patch da 0 y `grep -cF mockIcon` sobre c18.patch da 0. Los diffs de la copia tampoco tocan esos dobles.

### 2. Tabla H1–H15 → candado → sonda → resultado

| Hueco | Candado de E1 | Sonda | Rojos medidos |
|---|---|---|---|
| H1 | login, `#183 R3: un envío inválido tras un aviso general lo retira…` (c17) | RV8 | 1, el `it` nuevo |
| H2 | registro, `#183 R4: un envío inválido tras un aviso general…` (c18) | RV9 | 1, el `it` nuevo |
| H3 | recuperar, `#183 R5: un correo inválido tras un aviso general…` (c19) | RV10 | 1, el `it` nuevo |
| H12 | el mismo `it` de R5 (c19) | C18 | 1 |
| H4 | nueva contraseña, `#183 R6: un envío inválido tras un aviso general…` (c20) | RV11 | 1, el `it` nuevo |
| H13 | el mismo `it` de R6 (c20) | C26 | 1 |
| H14 | recuperar, `#183 R7: un 400 de validación en recuperar…` (c19) | C20 | 1 |
| H15 | nueva contraseña, `#183 R7: un 400 de validación en nueva contraseña no marca ningún campo` (c20) | C27 | 1 |
| H5 | G8 (c16) | RV5 | 1, G8 |
| H6 | G23 (c16) | RV6 | 1, G23 |
| H7 | N6 (c16) | RV7 | 1, N6 |
| H8 | `VALID.firstName = 'A'` (c16) | A6 | 29: G1 y G6–G33 |
| H9 | `VALID.lastName = 'S'` (c16) | A10 | 29: G1–G5 y G10–G33 |
| H10 | N5 (c16) | A26 | 1, N5 |
| H11 | C16–C20 (c16) | los 14 mutantes de la tabla de E1, incluidos B4, B5 y B6 | 1 cada uno, en la fila C que E1 asigna |

`sondas_e1.py` dio 37 OK con exit 0:

| Grupo | OK |
|---|---|
| c16 | 22 de 22 |
| c17 | 2 de 2 |
| c18 | 2 de 2 |
| c19 | 6 de 6 |
| c20 | 5 de 5 |

Las mutaciones del script son las mismas, textualmente, que RV5–RV11, A6, A10, A26, C18, C20, C26, C27 y los mutantes de correo de mi barrido.

Sondas extra que planté a mano para buscar zonas ciegas:

| Sonda | Rojos |
|---|---|
| M1: la validación de reset pone un error en el campo de contraseña | 1, el `it` de R7 de reset de E1 |
| M2: en login, `setError(null)` pasa a después de la validación | 1, el `it` de R3 de E1 |
| Mi: flag `i` en `EMAIL_PATTERN` | 0, equivalente, como declara E1 |
| X3: máximo de lastName >119 | 1, G8 |
| X1: la confirmación solo compara longitudes | 1, G32. N6 ya no lo mata (ver P1) |
| S2.2–S2.8 y S2.10–S2.14 | las mismas filas que declara R2 |
| S3.1, S3.3 | 1 cada una |
| S6.3 | 1 |
| S7.1 | 3 |
| S7.2 | 1 |

### 3. Cifras

Todo coincide con §Enmienda E1 y con `tasks.md` §E1.

| Medida | Declarada | Medida |
|---|---|---|
| 7 suites de la feature | 330 → 341 | 330 → 341 |
| AR | 66 → 71 | 71 |
| login | 39 → 40 | 40 |
| register | 64 → 65 | 65 |
| forgot | 47 → 49 | 49 |
| reset | 47 → 49 | 49 |
| guards + AR | 252 | 252 |

- UL da 30 y LP 37.
- S2.1 = 9, S2.9 = 3, S3.2 = 9, S4.4 = 25, S5.1 = 6, S5.3 = 6, S6.1 = 5.
- S7.3 = 6 (forgot 4 + UL 2). S7.4 = 4 (reset 2 + UL 2).
- Typecheck sale con 0. Lint sale con 0, con `--no-cache` y 0 líneas `Failed to run`.
- Los `it` nuevos tardan entre 41 y 132 ms, muy por debajo de los 5000 ms de init.sh.

### 4. Hallazgos

Ninguno bloquea la firma.

- **P1. N6 pierde el mutante X1** (`requirements.md:427`). Con la confirmación `'new-password-123 '`, el mutante que compara solo longitudes deja de caer en N6. Lo sigue cazando G32, con 1 rojo medido. La cobertura de la cláusula no baja. Lo apunto para que nadie lea N6 como candado de longitud.
- **P2. S7.3 y S7.4 solo se automatizan en la suite de pantalla** (`sondas_e1.py:49`, `:56`; `requirements.md:1197–1198`).
  - La tabla de commits ya lo dice: «solo forgot: 4» y «solo reset: 2».
  - Las cifras completas de `requirements.md:943–944` (6 y 4) suman los 2 `it` de UL, que el script no corre.
  - Medí a mano UL con las dos mutaciones: +2 en cada una, así que S7.3 = 6 y S7.4 = 4.
  - No impide ejecutar la enmienda. El reviewer de la ronda 2 debe medir la parte de UL a mano.
- **P3. «66 casos» en el paso verde de R2** (`requirements.md:466`). Es la historia de c1–c15 y como historia es correcta. `design.md:201` y la tabla de R2 ya dicen 71. Informativo.
- **P4. «Borrar `<x>-error`» se candó con un solo campo inválido por pantalla** (los `it` nuevos de c17–c20). Producción limpia antes de validar, de forma incondicional (`setFieldErrors({}); setError(null);`). Un mutante que borre campo a campo no sale natural de ese código, y las rutas M1 y M2 sí están candadas. Informativo.

## Ronda 2

Fecha: 2026-10-15
Veredicto: **APROBADO** (0 bloqueantes; R8, la prueba de humo humana, sigue pendiente y bloquea el paso a `done`)

Revisado en `/home/claude/sites/Pet-Tracker-wt-183`, branch
`feature/183-mobile-account-client-validation`, HEAD `5043e8e2`. Valida la
Enmienda E1 (c16–c20, `ccf7d49a`..`9eea5bf4`).

### 1. Alcance

- `git diff --name-only 94ebf827 HEAD` da 7 ficheros: los 5 test, `progress/impl_mobile-account-client-validation.md` y `specs/mobile-account-client-validation/traceability.md`.
- `git diff --name-only d3ac0fdd HEAD -- mobile-pet-tracker` da exactamente los 5 test. Backend: 0.
- Cada commit c16–c20 toca un solo fichero, su test. `5bcaf612` toca solo la traceability y `5043e8e2` solo el informe.
- Producción, parches, `sondas_e1.py` y spec no cambian desde `94ebf827`. Los sha256 de c16–c20 coinciden con la tabla de §Commits de E1.

### 2. Parches = commits

Exporté los 5 test de `d3ac0fdd` a `<scratchpad>/rev2-patchcheck`, apliqué c16–c20 (exit 0 en los cinco) y comparé con `cmp`. Cada fichero es byte-idéntico a su blob en el commit y en HEAD:

| Parche | Commit | sha256 (16) |
|---|---|---|
| c16 | `ccf7d49a` | `e1ad412ebed26c36` |
| c17 | `7a0cc473` | `8af0c91e16d2307b` |
| c18 | `19b0ac1b` | `34d949aa32d8ed0a` |
| c19 | `4ca57efe` | `68e6447ed72151c6` |
| c20 | `9eea5bf4` | `37eaab29d68a02ca` |

### 3. Sondas de E1 (`sondas_e1.py`, contra HEAD)

Desde `mobile-pet-tracker/`, en primer plano, sin otro jest en marcha (`pgrep` vacío al empezar). Exit medido sin pipe, salida en `<scratchpad>/rev2-sondas-cNN.log`. Tras cada grupo, `git diff --quiet` y `git diff --cached --quiet` salen 0 fuera de este informe.

| Grupo | OK | Exit | Rojos por sonda |
|---|---|---|---|
| c16 | 22 de 22 | 0 | RV5, RV6, RV7, A26: 1. A6, A10: 29. Los 14 mutantes de correo: 1. S2.1: 9. S2.9: 3 |
| c17 | 2 de 2 | 0 | RV8: 1. S3.2: 9 |
| c18 | 2 de 2 | 0 | RV9: 1. S4.4: 25 |
| c19 | 6 de 6 | 0 | RV10, C18, C20: 1. S5.1, S5.3: 6. S7.3: 4 |
| c20 | 5 de 5 | 0 | RV11, C26, C27: 1. S6.1: 5. S7.4: 2 |

Ningún `timeout en el intento`. El script compara títulos exactos y rechaza cualquier `Exceeded timeout`.

### 4. Mutaciones de la ronda 1 y huecos H1–H15, plantadas a mano contra HEAD

Con mi propio script (`<scratchpad>/rev2-probe.py`), que reutiliza las mutaciones de `sondas_e1.py` y añade las mías. Imprime cada `●` con la primera línea de su error. Restaura con `git checkout HEAD --` y comprueba `git diff --quiet HEAD`. Logs en `<scratchpad>/rev2-probe-*.log`. Ningún timeout y todos los rojos son de aserción.

| Hueco | Sonda | Tests | `●` exacto | Error |
|---|---|---|---|---|
| H1 | RV8 | 1 failed / 40 | `#183 R3: login valida en cliente › #183 R3: un envío inválido tras un aviso general lo retira y no vuelve a llamar a la API` | `expect(received).toBeNull()` |
| H2 | RV9 | 1 failed / 65 | `#183 R4: registro valida en cliente › #183 R4: un envío inválido tras un aviso general lo retira y no vuelve a llamar a la API` | `toBeNull()` |
| H3 | RV10 | 1 failed / 49 | `#183 R5: recuperar valida en cliente › #183 R5: un correo inválido tras un aviso general lo retira, y el corregido quita el mensaje y vuelve a llamar` | `toBeNull()` |
| H12 | C18 | 1 failed / 49 | el mismo `it` de R5 | `toBeNull()` |
| H4 | RV11 | 1 failed / 49 | `#183 R6: nueva contraseña valida en cliente › #183 R6: un envío inválido tras un aviso general lo retira, y el corregido quita el mensaje y vuelve a llamar` | `toBeNull()` |
| H13 | C26 | 1 failed / 49 | el mismo `it` de R6 | `toBeNull()` |
| H14 | C20 | 1 failed / 49 | `#117 R7: cada kind distinto de ok pinta su copy en forgot-error › #183 R7: un 400 de validación en recuperar pinta el aviso genérico y ningún mensaje de campo` | `expect(received).toHaveLength(expected)` |
| H15 | C27 | 1 failed / 49 | `R8: el submit completa el reset y mapea los errores › #183 R7: un 400 de validación en nueva contraseña no marca ningún campo` | `toHaveLength` |
| H5 | RV5 | 1 failed / 71 | `#183 R2: reglas de cuenta iguales a los DTO › #183 R2: validateRegister G8` | `toStrictEqual` |
| H6 | RV6 | 1 failed / 71 | `… › #183 R2: validateRegister G23` | `toStrictEqual` |
| H7 | RV7 | 1 failed / 71 | `… › #183 R2: validateResetPassword N6` | `toStrictEqual` |
| H8 | A6 | 29 failed / 71 | G1 y G6–G33 | 29 × `toStrictEqual` |
| H9 | A10 | 29 failed / 71 | G1–G5 y G10–G33 | 29 × `toStrictEqual` |
| H10 | A26 | 1 failed / 71 | `… › #183 R2: validateResetPassword N5` | `toStrictEqual` |
| H11 | los 14 mutantes, uno a uno | 1 failed / 71 cada uno | la fila C que asigna E1 en los 14: C16 `«a_1-b.c_@x2-y.example.technology» … (true)` para loc-_, loc--, loc-., loc-09, last-_, dom--, dom-09 y tld6; C17 `«z9@1x.io»` para last-09 y dom1-09; C18 `«+@b.co»` para loc-plus y last-+; C19 `«a-@b.co»` para last--; C20 `«a@b_c.co» … (false)` para dom+_ | 14 × `toStrictEqual` |

Mutaciones mías, para buscar zonas ciegas junto a las de E1:

| Sonda | Mutación | Resultado |
|---|---|---|
| X-L1 | login: `setError(null)` pasa a después de la validación | 1, el `it` de R3 de E1 (`toBeNull`) |
| X-R1 | registro: lo mismo con `setGeneralError(null)` | 1, el `it` de R4 de E1 (`toBeNull`) |
| X-P1 | nueva contraseña: lo mismo con `setError(null)` | 1, el `it` de R6 de E1 (`toBeNull`) |
| X-F2 | recuperar: el 400 de validación marca `email` con otra clave | 1, el `it` de R7 de forgot de E1 (`toHaveLength`) |
| X-P2 | nueva contraseña: el 400 de validación marca `password` (no la confirmación) | 1, el `it` de R7 de reset de E1 (`toHaveLength`) |
| X1 | la confirmación compara solo longitudes | 1, G32 |
| X-ph1, X-ph2 | el teléfono mide sin recortar (mínimo, máximo) | 1 cada uno, G16 y G20 |
| X-fn | el máximo del nombre mide sin recortar | 1, G4 |
| X-em | el máximo del correo pasa a 321 | 2, G13 y F4 |
| Mi | bandera `i` en `EMAIL_PATTERN` | 0 (71 passed). Es el equivalente que E1 declara sin candado (§Sondas de E1) |

En recuperar, mover `setFieldErrors({})` a después de la validación es equivalente: `setFieldErrors(issues)` sustituye el mapa entero. No lo cuento.

Nada de E1 queda declarado fuera de alcance ni como deuda, salvo la bandera `i`, que está escrita como equivalente en §Sondas de E1.

### 5. Pre-check P1–P4

- **P1, cerrada.** §Commits de E1 ya lo dice (`requirements.md:1205–1208`): N6 es el candado del trim y G32 caza la comparación por longitudes. X1 da 1 rojo en G32, medido arriba.
- **P2, cerrada.** Medí a mano la parte UL (`src/__tests__/ui-language.test.ts`, 30 tests) con las mutaciones de `sondas_e1.py`:
  - S7.3: 2 failed, `#65 R1: el grupo (auth) resuelve su copy por clave › resuelve las 51 ocurrencias normativas` y `#65 R18: los sitios resuelven por clave y no queda copy suelta › resuelve cada ocurrencia de la tabla contra la clave exacta`. Con los 4 de forgot, S7.3 = **6**.
  - S7.4: 2 failed, `#65 R11: restablecer contraseña resuelve su copy por clave › resuelve las 17 ocurrencias normativas` y el mismo `#65 R18`. Con los 2 de reset, S7.4 = **4**.
  - Las dos cifras coinciden con `requirements.md:943–944`. Todos los rojos son `toEqual`.
- **P3, sigue abierta e informativa.** «66 casos» sigue en `requirements.md:466`, en el paso verde de c1–c15. Como historia es correcta, y `:430` y `:1087` dicen 71. No bloquea.
- **P4, sigue informativa.** Cada pantalla candó «borrar `<x>-error`» con un solo campo inválido. Producción limpia antes de validar y sin condiciones, y X-L1, X-R1 y X-P1 confirman que reordenar la limpieza también muere. No bloquea.

### 6. Cuentas, typecheck y lint

`bunx jest --testTimeout=30000 --runTestsByPath` sobre las cinco suites, a solas: exit 0, `Test Suites: 5 passed, 5 total`, `Tests: 274 passed, 274 total`, 0 `Exceeded timeout`. Por fichero (`--json`):

| Suite | Declarada | Medida |
|---|---|---|
| `src/utils/account-rules.test.ts` | 71 | 71 |
| `src/screens/login/index.test.tsx` | 40 | 40 |
| `src/screens/register/index.test.tsx` | 65 | 65 |
| `src/screens/forgot/index.test.tsx` | 49 | 49 |
| `src/screens/reset-password/index.test.tsx` | 49 | 49 |

Los seis `it` nuevos tardan entre 38 y 190 ms, lejos de los 5000 ms de init.sh.

- TC, como lo define el handoff: `test ! -e .expo/types/router.d.ts` da 0 (no hizo falta borrar nada) y `bun run typecheck` sale con 0.
- LINT: `bunx expo lint --no-cache` sale con 0, el log queda vacío (`vacio=0`) y no hay ninguna línea `Failed to run`.

### 7. Trazabilidad e informe de Codex

- Los cinco hashes de E1 en `traceability.md` son ancestros de HEAD (`git merge-base --is-ancestor`, exit 0) y sus mensajes coinciden con §Commits de E1. R7 recibe c19 y c20. Los 20 hashes del fichero son ancestros de HEAD.
- Los seis `it` nuevos aparecen en su R-id con el título exacto, y cada título lleva `#183 Rn`. R2 pasa a 71 casos y la verificación de cierre pasa a 341, 111 suites y 3517 tests.
- La única fila `pendiente` es R8, el gate humano. Ver §8.
- El informe (§Reanudacion 2) cuadra con lo que medí: la tabla c16–c20 (hash, `Tests:`, 22/2/2/6/5 OK), las guardas con 252, las siete suites con 341, la suite completa con 111/3517, las anclas sites-99 (4, 2, 0, 0) y backend en 0. Las anclas sites-99 las volví a medir y dan lo mismo.
- La única desviación que declara Codex es un error de sintaxis de shell antes del Cierre 3 (exit 2, Jest no llegó a arrancar). Se repitió el comando corregido. No afecta a nada.
- El informe confirma que Codex no corrió init.sh.

### 8. R8 y init.sh

- **R8 (prueba de humo en dev build de Android) sigue sin firmar**: `requirements.md:984` tiene `- [ ]`. No bloquea este veredicto, pero **la feature no puede pasar a `done` hasta que el humano la firme**.
- init.sh lo corrió el leader sobre `5043e8e2`, porque el clasificador se lo deniega al reviewer. Leí el log (`<scratchpad>/init-183-r2.log`) y su `.head` coincide con HEAD.
  - backend unit: `Test Suites: 187 passed, 187 total`, `Tests: 1474 passed, 1474 total`.
  - infra: 2 suites y 14 tests.
  - móvil: `Test Suites: 111 passed, 111 total`, `Tests: 3517 passed, 3517 total`.
  - e2e: `Test Suites: 3 skipped, 30 passed, 30 of 33 total`, `Tests: 8 skipped, 468 passed, 476 total`.
  - Cierra con `✅ Lint sin errores`, `✅ Typecheck sin errores` y `✅ Todo verde. Listo para trabajar.`, y no hay ningún `Exceeded timeout`.
  - El aviso `A worker process has failed to exit gracefully` es el que ya existía en main.

### Checklist ronda 2

- **C2.** [x] Solo #183 está `in_progress` en `feature_list.json`. [x] `progress/current.md` está al día (`94ebf827`).
- **C3.** [x] E1 no toca producción: 0 ficheros fuera de `*.test.ts(x)` desde `d3ac0fdd`. Las capas siguen como en la ronda 1.
- **C4.**
  - [x] Cada `it` nuevo nombra su R-id: R3, R4, R5, R6 y R7 (dos). Las filas C y los ajustes de R2 van dentro de los `it.each` `#183 R2`.
  - [x] Los commits de E1 son solo de tests y nacen verdes, como prescribe §Commits de E1. El rojo de cada candado lo prueban las 37 sondas y mis mutaciones, todas medidas en §3 y §4.
- **C5.** [x] La traceability no tiene filas `pendiente` salvo R8, el gate humano. [x] Los mensajes siguen `test(mobile): … (#183 Rn)`.
- **C6.** [x] `requirements.md` está en `status: approved`, con la casilla de E1 marcada (`:1225`, firma `4046e500`).
- **C7.** [x] N/A: E1 no reemplaza nada.
- **C8.** [x] N/A: E1 no cambia UI ni copy.

### Observaciones ronda 2

Ninguna bloqueante.

- **O1 (informativa).** El frontmatter de `traceability.md` sigue en `status: spec_ready`. Lo actualiza el leader al cerrar.
- **O2 (informativa).** R8 sigue pendiente del humano (§8).
- **O3 (informativa).** P3 sigue abierta: «66 casos» en `requirements.md:466`, como historia de c1–c15.
