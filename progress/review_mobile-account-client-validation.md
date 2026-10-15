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
