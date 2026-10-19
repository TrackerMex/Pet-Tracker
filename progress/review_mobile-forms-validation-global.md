# review: mobile-forms-validation-global (#186)
Fecha: 2026-10-19
Rama: feature/186-mobile-forms-validation-global
HEAD revisado: 276a58fa (H0 = 9a94f741; diff `9a94f741..HEAD`)
Veredicto: APROBADO para R1-R9, condicionado a dos pendientes que no son del reviewer:
(a) `./init.sh` lo corre el leader (el clasificador se lo deniega al reviewer); (b) R10 y la casilla
"Enmienda #186 aprobada por humano" son gates humanos y siguen sin marcar a propósito, así que la
feature NO está `done`. Si el leader entiende la fila "pendiente" de R10 como bloqueante por la regla
del reviewer, tómese como RECHAZO ADMINISTRATIVO hasta el cierre humano; no hay defecto de código.

## Checklist C2 — Estado coherente
- [x] Solo 1 feature in_progress en esta rama (`feature_list.json` sin tocar en el diff)
- [x] progress/current.md actualizado (cambio solo de documentación)

## Checklist C3 — Arquitectura
- [x] domain sin imports de infrastructure (n/a móvil; `form-rules.ts` sin imports de zod/react: 0 coincidencias)
- [x] Contratos puros: `form-rules.ts` son funciones puras que espejan los DTO del backend
- [x] application/pantallas dependen de `FieldErrorMessage` y `form-rules`, no de implementaciones del servidor
- [x] Sin lógica de negocio en infraestructura; `FieldError` de HeroUI importado solo en `field-error-message.tsx` y las 8 pantallas (candado R8)
- [x] `git diff 9a94f741..HEAD` no toca `backend-pet-tracker/`, `package.json`, `bun.lock` ni `feature_list.json`

## Checklist C4 — TDD
- [x] Cada R1-R9 tiene it que lo nombra: form-rules.test.ts (89 it, R2), field-error-message.test.tsx (10 it `#186 R3:`), forms-validation-global.test.ts (R8/R9), tests de las cuatro pantallas (R4-R7), language-provider/ui-language (R1)
- [x] Historial test-primero: commit rojo `test(mobile): ... (#186 Rn)` antes del verde `feat(mobile): ... (#186 Rn)` en cada R. Rojos verificados reproduciendo en worktree desacoplado:
  - R7 rojo `71913afe`: 16 failed, 54 passed, 70 total (rojo genuino)
  - R5 rojo adicional `16d5421c` (los dos #125 migrados): 2 failed (`#125 R3 ... a la hora exacta` y `#125 R6 ... todos los chips desactivados`), 12 passed, 51 skipped. Rojo genuino contra la producción previa a R5
- Nota: los verdes de R4/R5/R7 arrastran también los deltas de fórmula de `ui-copy-table.ts` / `ui-language.test.ts` que la spec manda (R5_HEALTH 43, R7_PROFILE 69, R8_REMINDERS 56, R9_ADD_PET 45, SCREEN_FILES +1). No es mezcla indebida: la spec los asigna a esos commits.
- No se verificó por reproducción el rojo de R4 ni de R9 (solo por el reporte y por que los commits rojos tocan únicamente tests).

## Checklist C5 — Trazabilidad
- [x] Filas R1-R9 completas; los 19 hashes existen (`git cat-file -e`) y corresponden a los commits indicados
- [ ] Fila R10 "pendiente": reservada al humano (prueba de humo Android), por diseño de la spec
- [x] Commits con formato `feat|test|docs(<scope>): <desc> (#186 Rn)`

## Checklist C6 — Spec aprobada
- [x] requirements.md status approved (aprobación humana 2026-10-19)
- [x] Casilla de R10 y "Enmienda #186 aprobada por humano" (docs/ui-guidelines.md) sin marcar, verificado en el árbol

## Checklist C7 — Sin código huérfano
- [x] N/A en lo esencial: la feature no elimina componentes; las cuatro pantallas de cuenta migran a `FieldErrorMessage`. `src/components/form-error.tsx` y `src/utils/account-rules.ts` con diff vacío vs H0; tests de login/register/forgot/reset-password sin cambios (diff vacío salvo lo declarado: 0 apariciones de `HomeEntrance` y `mockIcon` en los diffs de login y register)

## Evidencia por requisito
- R1 (catálogo/copy): 26 claves `validation.` en `catalog.ts` en en/es (esperado 26); 4 claves nuevas por idioma (required, invalidDate, weightRange, bodyConditionRange); `language-provider.test.tsx` y `ui-language.test.ts` verdes.
- R2 (validadores): `form-rules.ts` exporta validateAddPet, validateReminder, validateDocument, validateWeight, parseDecimal; regex DECIMAL e isIsoDate conforme a spec; 89 it verdes.
- R3 (FieldErrorMessage): deriva `<base>-error`, `<base>-message`, `<base>-message-row`; 10 it verdes.
- R4 add-pet: 4 FieldErrorMessage, validación antes de `setSubmitting`, `setFieldErrors(issues)` reemplaza en cada pulsación, `add-pet-error` y `checkPetDetails` presentes, maxLength x4 intactos.
- R5 add-reminder: 3 FieldErrorMessage, `dateMustBeFuture` traducido, maxLength intacto; mutación M1 muerta.
- R6 docs-upload-form: 4 FieldErrorMessage, `isInvalid` x3, `invalid-form` x3, maxLength x3 intactos.
- R7 weight-log: 4 FieldErrorMessage; `case 'validation'` envía la fecha futura al mensaje de `measuredAt` y el resto a `validation.checkDetails`; sin `parseFloat` ni `join('\n')` (0); mutación M2 muerta.
- R8: login 3, register 8, forgot 2, reset-password 3 FieldErrorMessage (coinciden con los candados). Ningún texto crudo del servidor llega a pantalla en las cuatro pantallas nuevas (ramas de error solo con claves traducidas).
- R9: enmienda `## Enmienda #186` en docs/ui-guidelines.md presente una vez; mención de `field-error-message.tsx` x2; E2: `specs/mobile-ui-language/design.md` solo con el corolario espejo (4 apariciones de "por #186 (R1)", esperado 4); `heroui-text-size-merge.test.ts` cambia solo el literal 211 a 200.

## Mutaciones plantadas (todas revertidas con `git checkout HEAD -- <ruta>`)
| Id | Mutación | Resultado |
|----|----------|-----------|
| M1 | add-reminder: quitar el reseteo de errores | MUERTA (1 failed) |
| M2 | weight-log: 400 muestra mensajes crudos | MUERTA (3 failed) |
| M3 | add-pet: quitar la guarda del mensaje en modo meses | SOBREVIVE (52/52) |
| M4 | docs-upload-form: TextField `name` sin `isInvalid` | SOBREVIVE (79/79) |
| M5 | weight-log: TextField `weight` sin `isInvalid` | SOBREVIVE (70/70) |

## Observaciones (no bloqueantes)
1. M3, M4 y M5 son huecos de los candados que la spec prescribe, no desviaciones del implementer: M3 solo importa con error obsoleto tras alternar el modo; M4 solo se prueba type vs vet; `isInvalid` del campo weight de weight-log no tiene test. Candidatos a una feature de seguimiento si se quiere cerrar.
2. Ambigüedad en el reporte del implementer sobre el rojo adicional de R5 ("65 passed"): reproducido por el reviewer, es genuinamente rojo (2 failed).
3. No hay `graphify-out/graph.json` utilizable en este worktree; `graphify query` falló, la revisión se hizo con lectura directa y grep.
4. Rojos de R4 y R9 no reproducidos (ver C4).

## Verificación independiente
- Suite acotada ejecutada por el reviewer en HEAD 276a58fa, sin pipe: 14 suites, 695/695 pasados, exit 0 (form-rules, field-error-message, forms-validation-global, ui-language, heroui-text-size-merge, language-provider y las 8 pantallas de formulario/cuenta). Log: /tmp/claude-1002/rev186-final.log
- Suite global medida por el leader (no re-ejecutada por el reviewer): 123 suites, 4136/4136, exit 0. Log: /tmp/claude-1002/pet-186-global-final.log
- `git status --short` limpio tras revertir las mutaciones y retirar el worktree auxiliar.

## Output de ./init.sh
No ejecutado por el reviewer (el clasificador lo deniega). PENDIENTE: lo corre el leader sobre HEAD 276a58fa antes de cerrar. Sin ese verde y sin el cierre humano de R10, la feature no pasa a `done`.
