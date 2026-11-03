# review: mobile-food-links-without-profile (#233)
Fecha: 2026-11-03
Veredicto: APROBADO

Base del diff: a1654311 (enmienda del handoff). Commits de Codex: b1d0f15f, 43dda06a, 7ea49a5b, cc5d4f0f, a774d6b5, 7280e9d8. HEAD 7280e9d8.

## Checklist C2 — Estado coherente
- [x] Solo 1 feature in_progress (no tocado por Codex: feature_list.json, STATUS y current.md sin cambios en a1654311..HEAD)
- [x] progress/current.md: fuera de alcance de Codex, lo actualiza el leader

## Checklist C3 — Arquitectura
- [x] domain sin imports de infrastructure (N/A: solo `src/screens/food/`)
- [x] contratos puros (N/A)
- [x] application depende de interfaces (N/A)
- [x] infrastructure sin lógica de negocio (N/A)

## Checklist C4 — TDD
- [x] Cada R<n> tiene test que lo nombra: R1 (4 filas), R2 (enmienda A + test B), R3 (3 filas), R4, R5 con `#233 R<n>`; R6/R7 son candados de anclas sin test, como dice la spec.
- [x] Historial test-primero: rojo R1, R2, R3, luego R4/R5 (nacen verdes, declarado), luego un solo feat con producción (2/1). Los 5 ficheros de commit lo confirman: los cuatro primeros solo tocan index.test.tsx, a774d6b5 solo index.tsx, 7280e9d8 solo traceability. Los rojos son creíbles: con M2/M6/M9 replantadas sobre HEAD fallan justo esos tests.

## Checklist C5 — Trazabilidad
- [x] traceability.md sin filas "pendiente" (R1-R7 con hashes reales, todos existen en el log)
- [x] Commits con formato `test(mobile)/feat(mobile): ... (R-ids)`

## Checklist C6 — Spec aprobada
- [x] requirements.md status: approved, casilla de firma delegada marcada. Las casillas de enmienda, G4 y smoke siguen sin marcar (son del humano; el smoke bloquea `done`, no esta review).

## Checklist C7 — Sin código huérfano
- [x] N/A — no reemplaza nada existente

## Mediciones propias
- Lista cerrada a1654311..HEAD: exactamente index.test.tsx, index.tsx y traceability.md. ai-explanation.tsx sin diff. Árbol limpio salvo el reporte de Codex sin commitear (`impl_*.md`, esperado).
- numstat contra merge-base de origin/dev: index.tsx = `2 1` (R6), index.test.tsx = `138 2` (R7: 2 líneas quitadas).
- Diff de producción: solo `const hasProfile = ...` y el render `{hasProfile ? (loadedPlan !== null ? <RiseIn delayMs={200}>...) : null}`, literales de la spec.
- Anclas grep -cF: todas las de R1, R5, R6 y R7 coinciden con la spec (hasProfile 2, profile.data 3, línea vieja 0, RiseIn 1, enabled 1, food-links 1, links 1/1, rounded-16 3, `#233` 0 en producción, signOut( 0, describe nuevo 1, `'#233 R` 6, `(enmendado por #233 R2)` 1, ningún `#233` suelto). Hunks de test: @@ -396, -408 y +1835; empiezan después de `apiUrl` (línea 139), imports y mocks intactos. El describe nuevo queda entre #200 R10 y #222 R7.
- Ningún `it` ajeno editado: solo el título/aserción de R5 «shows a skeleton...» (enmienda R2A). Conserva las otras cuatro aserciones del waitFor.
- Espera por contador de mock: solo en Test B de R2 (`waitFor(() => expect(mockGetNutritionProfile).toHaveBeenCalledTimes(1))`, con comentario de excepción y cierre en transición positiva a `food-plan-empty` + enlaces). R5 usa `not.toHaveBeenCalled()` después de `findByTestId('food-plan-card')`, no como espera. Todas las ausencias nuevas llevan `includeHiddenElements: true` y van ancladas a nodo positivo (food-create-profile, food-plan-empty, food-plan-error).
- Candados no tautológicos: no importan símbolo de producción ni muestrean continuo; R2 Test B tiene la transición positiva que descarta un `it` ciego.
- jest food (`--runTestsByPath`, desde mobile-pet-tracker): 151/151, exit 0.
- Mutaciones replantadas por mí, revertidas con `git checkout HEAD --`, `git diff --cached` y diff de árbol en 0 después de cada una:
  - M2 (hasProfile sin rama del perfil): 5 rojos (R2B, R4, #155 R9, #200 R10 sin plan, R5 graceful empty). Coincide con el reporte.
  - M6 (variante mía: envolver enlaces en View con `display: 'none'` sin perfil): 10 rojos, incluidos R1 x4, R2B, R3 x3 y la enmienda R2A. Confirma que `includeHiddenElements` hace que la ausencia no sea ciega.
  - M9 (quitar `loadedPlan !== null ||`): 12 rojos, igual que el reporte.
  - M10 extra (`enabled: true` en la consulta del perfil): 1 rojo (R5 `not.toHaveBeenCalled`), así que ese candado muerde.
- tsc: guarda `test ! -e .expo/types/router.d.ts` ok; salida 0, log vacío.
- lint: `expo lint --no-cache > log && test ! -s log` → LINT_OK.
- Guardas (`src/__tests__ src/app/__tests__ src/components/__tests__`): 80 suites, 1659 tests, exit 0.
- Sin rojos ajenos ni flakes en mis corridas.
- `./init.sh`: no lo corrí (instrucción del leader; lo corre él). El veredicto asume que init.sh verde queda a cargo del leader antes de la PR.

## Observaciones
- Menor, no bloquea: la línea 40 del reporte dice «a petición del humano se releyó solo "Diff acotado"». El handoff (83236376 y la enmienda a1654311) no recoge ninguna petición del humano; la enmienda fue un commit del leader. Es una atribución errónea de Codex, sin efecto sobre el código. El leader puede corregir esa frase si quiere que el reporte quede exacto.
- Nada más escondido: los números del reporte (T0 141, 151 final, 80 suites/1659, M1-M9) cuadran con lo que medí.

## Output de ./init.sh
No ejecutado por el reviewer (lo corre el leader; ver instrucción del encargo). Mediciones equivalentes arriba: jest food, guardas, tsc, lint.
