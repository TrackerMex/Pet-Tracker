# review: mobile-account-heroui-text-sizes (#187)
Fecha: 2026-10-18
Veredicto: APROBADO (R1-R5). R6 (smoke Android) queda para el humano; la feature no se marca done hasta que lo firme.

Revisado: branch `feature/187-mobile-account-heroui-text-sizes`, HEAD `2c02b5a218c75ff9fdfec5a2abd1d62d98e6cc83`, H0 `ca57f13b` (ancestro de HEAD, verificado con `merge-base --is-ancestor`).

## Checklist C2 — Estado coherente
- [x] Solo 1 feature `in_progress` (`grep -c '"status": "in_progress"' feature_list.json` = 1, la #187)
- [x] `progress/current.md` describe la #187 en curso (lo gestiona el leader; Codex no lo tocó: el diff H0..HEAD no incluye `feature_list.json`, `progress/current.md` ni `STATUS.md`)

## Checklist C3 — Arquitectura
- [x] domain sin imports de infrastructure (N/A: solo cambia UI móvil, sin tocar domain)
- [x] contratos en domain intactos (no tocados)
- [x] application sin cambios
- [x] infrastructure sin lógica de negocio (no tocada)
- Cambio de producción: 17 sustituciones en 4 pantallas, sin imports nuevos, sin dependencias.

## Checklist C4 — TDD
- [x] Cada R-id tiene tests que lo nombran: R1 (24 `it` `#187 R1…` en `src/__tests__/heroui-text-size-merge.test.ts`), R2 (12 filas `#187 R2: la etiqueta "%s" …` en los 4 `index.test.tsx`), R3 (5 `it` `#187 R3: el botón <testID> …`), R5 (`#187 R5: la carta fija la regla y la receta con Text plano`). R4: guards `profile-canvas-fidelity` y `design-drift` sin editar (no figuran en el diff).
- [x] Historial test-primero, medido con `git show --stat` por commit (orden real en `git log`):
  - c1 `6d209645` test (solo `heroui-text-size-merge.test.ts`, 177 líneas)
  - c2 `33a67404` test (4 `index.test.tsx` + `account-screens-polish.test.ts`)
  - c2b `9c0d0e48` test (piso HeroUI 244 a 227, 1 línea), c2c `e613944d` test (piso className 198 a 181, 1 línea): enmiendas autorizadas por el humano, test-only, ambas antes de c3
  - c3 `4f177bd5` feat (solo 4 `index.tsx`, 24+/24-)
  - c4 `f4d0b783` test (4 `index.test.tsx` + `account-screens-polish.test.ts`)
  - c5 `f637704d` feat (solo 4 `index.tsx`, 10+/10-)
  - c6 `a83a17b7` test (R5), c7 `820f7f1b` docs (carta, 8 líneas), c8 `2c02b5a2` docs (traceability + impl)
  - Ningún commit mezcla test e implementación. Los mensajes siguen `tasks.md` al carácter.
- Los pisos 227 y 181 de c2b/c2c: coherentes (244-17 y 198-17, las 12 `Label.Text` y 5 `Button.Label` que salen del recuento). La enmienda formal de la spec la escribe el leader al cierre (no es hallazgo de Codex).

## Checklist C5 — Trazabilidad
- [x] `traceability.md` sin filas "pendiente" salvo R6, que es el gate humano (la propia fila y `tasks.md` §R6 dicen que lo cierra el humano; el implementer no la marca)
- [x] Los 9 hashes (c1, c2, c2b, c2c, c3, c4, c5, c6, c7) existen: `git cat-file -e` ok en todos, y coinciden con los de `git log`
- [x] Commits con formato `test|feat|docs(#187 R<n>): … (R<n>)`
- Nota: el hash de c8 no está escrito en el reporte (limitación declarada y reproducible con `git log -1 --format=%H -- progress/impl_…md` = `2c02b5a2…`).

## Checklist C6 — Spec aprobada
- [x] `specs/mobile-account-heroui-text-sizes/requirements.md` `status: approved`, casilla `- [x] Aprobado por humano (fecha: 2026-10-18)`, D1 = a
- [ ] N/A hasta el cierre: casilla «Smoke R6» (`- [ ] Smoke R6 …`) sin marcar, correcto (solo el humano)

## Checklist C7 — Sin código huérfano
- [x] Se reemplazan `Label.Text` y `Button.Label` por `Text` en las 4 pantallas: `grep Label.Text` = 0 y `grep Button.Label` (excluyendo `LinkButton.Label`) = 0 en las cuatro `index.tsx`. `Label`, `Button` y `Text` siguen en uso (lint y typecheck verdes en init.sh, sin imports muertos).
- [x] No quedan tests de los literales viejos: `textRecipes` índices 3, 10 y 11 enmendados en su sitio con `// #187 R2` / `// #187 R3`; los vectores de cuentas no cambian; los 13 `it` del fichero siguen.

## Verificación contra git/código (no contra el reporte)
- Diff H0..HEAD = exactamente los 13 ficheros del handoff (`git diff --name-only`). `git diff --quiet ca57f13b -- src/theme/global.css package.json bun.lock` sale 0. `git status --short` limpio.
- Producción: sustituciones línea a línea idénticas a la receta (12 `Text` `text-13 font-semibold text-muted`: login 2, register 7, forgot 1, reset-password 2; 5 `Text` `text-17 font-extrabold text-accent-foreground` en login-submit, register-submit, forgot-submit, reset-submit; 1 `Text` `text-17 font-extrabold text-foreground` en forgot-resend). Anclas tras c5: A6 = login `2 1 0`, register `7 1 0`, forgot `1 1 1`, reset-password `2 1 0`. `Button` conserva testID/variant/isDisabled/className (el diff solo toca apertura y cierre del hijo).
- Comentarios: en el diff solo aparecen `// #187 R2` y `// #187 R3` (account-screens-polish.test.ts). No hay `#187` a secas en comentarios (los demás `#187` son títulos de `it`/`describe`, el encabezado de la carta y el reporte, todos exigidos por la spec).
- `docs/ui-guidelines.md`: +8 líneas al final, sin modificar ninguna previa; texto idéntico al de requirements §R5; las 5 cadenas del `it` de R5 están presentes.
- Escáner de `heroui-text-size-merge.test.ts` (leído completo, `ruta:línea`):
  - Descubrimiento por directorio recursivo (`:20-29`), exclusión de `__tests__`/`__mocks__`/`*.test.ts(x)`; AST con `ScriptKind.TSX` (`:61`).
  - Binding por local (`:72`, alias cuenta `Y`), espacio de nombres (`:74`), `Card` por `endsWith('components/card')` o `./card` (`:69`); etiqueta raíz con `split('.')[0]` (`:82`).
  - Fragmentos: cadena, plantilla (cabeza y spans), ternario, `+ && || ??`, llamadas, array, claves de objeto, paréntesis/`as` (`:31-53`). Token ofensor `/^(?:[a-z0-9-]+:)*!?text-\d+(?:\.\d+)?$/` y split `/\s+/` (`:99-100`), idénticos a la spec.
  - No tautológico: las expectativas de P1-P13/N1-N6 son literales del test, no derivados del escáner; el `it` 5 usa `jest.requireActual('heroui-native/utils')` como oráculo con cadenas escritas a mano (`:139-144`); los pisos del `it` 2 protegen contra un escáner ciego al árbol (el `it` 1 con `[]` no pasa en vacío); cwd distinto haría fallar `readdirSync`, no pasaría en vacío. Medido por Codex: HeroUI 227, ficheros 29, Card 42, className 181 (pisos 28/227/42/181).
  - Mutación en zona ciega: S2 (multilínea), S3 (plantilla+alias), S4 (fichero nuevo) y S5/S6 están registradas con `Expected`/`Received` y revertidas (impl §Sondas), y la sonda S6 prueba que los tests quedan excluidos.
  - 24 `it` en R1 (5 + 13 + 6) y 1 en R5: 25, como la spec.
- Jest, un fichero: `bunx jest src/__tests__/heroui-text-size-merge.test.ts` = 25 passed.

## Desviaciones aceptadas por el humano (solo verificado que están registradas)
- S9 (`it` 2 cae por colateral, Expected >=198 / Received 196), S14 (`it` 2 e `it` 4 colaterales), S15 (9 fallos con detalle de cada P/N colateral): registradas en impl §Sondas y §Paradas y desviaciones (puntos 2, 3, 4). No son rechazo.
- c2b/c2c (pisos 227/181) registrados en impl §Commits y §Paradas 5-6. Pendiente del leader: enmendar requirements/design/tasks con esos dos pisos.

## Observaciones (no bloquean)
1. `heroui-text-size-merge.test.ts:46-51,36-44,51`: las ramas de array, objeto con clave de cadena, `??`/`||` y `as`/paréntesis del escáner no tienen ninguna fila del corpus (P1-P13 no las cubren). Quitar cualquiera deja la suite verde. Es una limitación del corpus que dicta la spec (la cláusula de R1 dice «array u objeto con claves de cadena»), no una desviación de Codex; candidata a una fila P14+ si el leader quiere cerrar la cláusula universal.
2. Estilo: cuerpos de los `it` nuevos de los 4 `index.test.tsx` con sangría de 6 espacios en lugar de 4 (lint verde); doble línea en blanco en `heroui-text-size-merge.test.ts:178-179`.
3. R6 (smoke Android, incluido paso 5: color de la etiqueta en error con `Text` plano, que D1(a) deja en `muted`) pendiente del humano.

## Output de ./init.sh
No lo corre el reviewer (el clasificador lo deniega); lo corrió el leader: exit 0 sin pipe, log completo en `/tmp/claude-1002/init187b.log`. Líneas relevantes verificadas en el log:
```
Test Suites: 187 passed, 187 total
Tests:       1474 passed, 1474 total          (backend unit)
Test Suites: 114 passed, 114 total
Tests:       3790 passed, 3790 total          (móvil = T0 3748 + 42)
Test Suites: 3 skipped, 30 passed, 30 of 33 total
Tests:       8 skipped, 468 passed, 476 total (e2e)
✅ Lint sin errores
✅ Typecheck sin errores
✅ Todo verde. Listo para trabajar.
```
El aviso `A worker process has failed to exit gracefully` aparece una vez (preexistente, según tasks.md).
