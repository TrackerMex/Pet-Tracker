---
feature: "mobile-account-client-validation"
status: approved
tags: [mobile, ui, spec]
---

# Tareas — [[mobile-account-client-validation]] (#183)

> Disciplina TDD. Cada tarea corresponde a un requisito de [[requirements]] y
> tiene los mismos 3 sub-items, en este orden. El rojo y el verde van en
> commits separados: `test(mobile): … (#183 Rn)` y luego
> `feat(mobile): … (#183 Rn)`. Los comandos se corren desde
> `mobile-pet-tracker/`, con bun/bunx (nunca npx).

**Antes de R1.** `main` (con #172 mergeada) ya está mergeada en esta branch.
Se re-miden B1–B8 y la tabla de anclas de requirements §Base medida en H0. Si
algo no coincide con `60dd9eda`, vale la medida de H0 y los deltas no cambian.

Cada verde cierra con `bun run typecheck` y `bun run lint` en verde.

## R1 — Copy de validación en el catálogo

- [ ] (1) Rojo, en `src/providers/__tests__/language-provider.test.tsx`:
  `+ 9, // #183 R1` en la fórmula de longitud y el `describe`/`it` de
  `#183 R1`. `bunx jest src/providers/__tests__/language-provider.test.tsx`
  da **2** `it` en rojo, los dos por aserción. Commit
  `test(mobile): copy de validación (#183 R1)`.
- [ ] (2) Verde: las 9 claves en `en` y `es` de `src/i18n/catalog.ts`, y la
  §2.N en `../specs/mobile-ui-language/design.md`. La suite queda verde y
  `src/__tests__/ui-language.test.ts` sigue verde. Sondas S1.1 y S1.2,
  revertidas. Ancla `grep -cF "'validation." src/i18n/catalog.ts` → `18`.
  Commit `feat(mobile): copy de validación (#183 R1)`.
- [ ] (3) Refactor: ninguno previsto.

## R2 — Módulo `account-rules` con las reglas de los DTO

- [ ] (1) Rojo: `src/utils/account-rules.test.ts`, con las tablas C, L, G, F y
  N (66 casos), más las 9 filas del módulo en `src/__tests__/ui-copy-table.ts`
  y `+ 9` (`R1_AUTH`, título `<B_AUTH + 9>`) y `+ 1` (`SCREEN_FILES`) en
  `src/__tests__/ui-language.test.ts`.
  `bunx jest src/utils/account-rules.test.ts src/__tests__/ui-language.test.ts`
  da 1 suite que no arranca (`Cannot find module './account-rules'`) y **3**
  `it` en rojo por `ENOENT`. Commit
  `test(mobile): reglas de cuenta iguales a los DTO (#183 R2)`.
- [ ] (2) Verde: se crea `src/utils/account-rules.ts` (design.md §Módulo).
  Sondas S2.1–S2.14, revertidas cada una. Anclas de R2. Commit
  `feat(mobile): reglas de cuenta iguales a los DTO (#183 R2)`.
- [ ] (3) Refactor: ninguno previsto.

## R3 — Login valida y manda el correo recortado

- [ ] (1) Rojo: `describe('#183 R3: …')` en `src/screens/login/index.test.tsx`
  con sus 10 casos. `bunx jest src/screens/login/index.test.tsx` da **9** en
  rojo (8 de consulta y 1 de aserción) y 1 que nace verde (`it` 4). Commit
  `test(mobile): login valida en cliente (#183 R3)`.
- [ ] (2) Verde: design.md §Login. Sondas S3.1–S3.3. Anclas de R3. Commit
  `feat(mobile): login valida en cliente (#183 R3)`.
- [ ] (3) Refactor: ninguno previsto.

## R4 — Registro valida sus siete campos y manda el correo recortado

- [ ] (1) Rojo: `describe('#183 R4: …')` en
  `src/screens/register/index.test.tsx` con sus 28 casos, sin tocar el mock de
  reicon. Además se quita la fila register `forgot.invalidEmail // #172 R16`
  de `ui-copy-table.ts` y se pone `- 1` en `R1_AUTH` (título
  `<B_AUTH + 8>`).
  `bunx jest src/screens/register/index.test.tsx src/__tests__/ui-language.test.ts`
  da **20** en rojo (19 de consulta y 1 de aserción) y 8 que nacen verdes. El
  `it` de `R1_AUTH` sigue verde. Commit
  `test(mobile): registro valida en cliente (#183 R4)`.
- [ ] (2) Verde: design.md §Register, incluida la transición
  `serverFieldErrors`. Sondas S4.1–S4.4. Anclas de R4. Commit
  `feat(mobile): registro valida en cliente (#183 R4)`.
- [ ] (3) Refactor: ninguno previsto. La transición se borra en R7, no aquí.

## R5 — Recuperar valida el correo antes de llamar

- [ ] (1) Rojo: `describe('#183 R5: …')` en
  `src/screens/forgot/index.test.tsx` con sus 6 casos.
  `bunx jest src/screens/forgot/index.test.tsx` da **5** en rojo, todos de
  consulta, y 1 que nace verde. Commit
  `test(mobile): recuperar valida en cliente (#183 R5)`.
- [ ] (2) Verde: design.md §Forgot. Sondas S5.1–S5.3. Anclas de R5. Commit
  `feat(mobile): recuperar valida en cliente (#183 R5)`.
- [ ] (3) Refactor: ninguno previsto.

## R6 — Nueva contraseña valida antes de llamar

- [ ] (1) Rojo: `describe('#183 R6: …')` en
  `src/screens/reset-password/index.test.tsx` con sus 6 casos. El heredado
  `une por salto de linea…` pasa a `submitReset()`.
  `bunx jest src/screens/reset-password/index.test.tsx` da **4** en rojo,
  todos de consulta, y 2 que nacen verdes. Commit
  `test(mobile): nueva contraseña valida en cliente (#183 R6)`.
- [ ] (2) Verde: design.md §Reset password. Sondas S6.1–S6.3. Anclas de R6.
  Commit `feat(mobile): nueva contraseña valida en cliente (#183 R6)`.
- [ ] (3) Refactor: ninguno previsto.

## R7 — Un 400 pinta el aviso genérico

- [ ] (1) Rojo: los candados 1–6 de R7 (los `it` reescritos en las cuatro
  pantallas, `#172 R10: cada campo con error…` con disparo de cliente, y las
  filas y fórmulas de `R1_AUTH` y `R11_RESET`). La corrida de las cinco
  suites de R7 da **9** en rojo, todos de aserción, y 1 que nace verde.
  Commit `test(mobile): un 400 pinta el aviso genérico (#183 R7)`.
- [ ] (2) Verde: design.md §Register (R7), §Forgot, §Reset password y §Login.
  Sondas S7.1–S7.4. Anclas de R7. Commit
  `feat(mobile): un 400 pinta el aviso genérico (#183 R7)`.
- [ ] (3) Refactor: se borra el código muerto que deje R7 en register
  (`RegisterFieldErrors` si queda sin uso). Los tests siguen verdes.

## E1 — Candados de la review ronda 1

Ver requirements §Enmienda E1. Son cinco commits, solo de tests, y nacen
verdes: el rojo lo dan las sondas. Cada uno aplica su parche desde
`mobile-pet-tracker/` con
`git -C .. apply --check <p> && git -C .. apply <p>`, donde `<p>` es
`progress/e1_mobile-account-client-validation/cNN.patch`. Después corre su
suite, sus sondas con `python3 ../progress/e1_mobile-account-client-validation/sondas_e1.py cNN`
(cada una revertida con `git checkout HEAD -- <fichero>`; requirements
§Commits de E1), `bun run typecheck` y `bun run lint`.

- [ ] c16: `src/utils/account-rules.test.ts` da 71. Sondas RV5–RV7, A6, A10,
  A26, los 14 mutantes de `EMAIL_PATTERN`, S2.1 (9) y S2.9 (3). Commit
  `test(mobile): candados de E1 en account-rules (#183 R2)`.
- [ ] c17: `src/screens/login/index.test.tsx` da 40. Sondas RV8 y S3.2 (9).
  Commit `test(mobile): candado de E1 en login (#183 R3)`.
- [ ] c18: `src/screens/register/index.test.tsx` da 65. Sondas RV9 y S4.4 (25
  en este fichero). Commit `test(mobile): candado de E1 en registro (#183 R4)`.
- [ ] c19: `src/screens/forgot/index.test.tsx` da 49. Sondas RV10, C18, C20,
  S5.1 (6), S5.3 (6) y S7.3 (4 en este fichero). Commit
  `test(mobile): candados de E1 en recuperar (#183 R5, R7)`.
- [ ] c20: `src/screens/reset-password/index.test.tsx` da 49. Sondas RV11,
  C26, C27, S6.1 (5) y S7.4 (2 en este fichero). Commit
  `test(mobile): candados de E1 en nueva contraseña (#183 R6, R7)`.

## Cierre

- [ ] `bunx jest` completo, `bun run typecheck` y `bun run lint` en verde.
  Tras E1, la suite móvil da 3517 tests en 111 suites.
- [ ] Anclas del par sites-99 en `0` (requirements §Convenciones).
- [ ] Anclas finales de requirements §Base medida recontadas: login, register,
  forgot y reset.
- [ ] `progress/impl_mobile-account-client-validation.md` y la
  [[traceability]] al día.

## R8 — Prueba de humo humana

- [ ] (1) No aplica: es un gate humano.
- [ ] (2) El humano sigue los pasos de R8 en un dev build de Android y marca
  la casilla de requirements R8.
- [ ] (3) No aplica.
