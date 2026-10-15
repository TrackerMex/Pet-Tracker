# impl: ancla R9 en #174 (fallback implementer, cambio trivial)

Commit: 479704d3c8c22b1f2cf52bc4de99cc6bdf5e2385 (solo `mobile-pet-tracker/src/screens/alerts/index.test.tsx`, +1 línea). Sin push.
Nota: git avisó de identidad autoconfigurada (`--reset-author`); el commit salió igual.

## Diff
```diff
@@ -516,2 +516,3 @@
 
+    // #174 R9: una aserción de className exacto por rama, acked y closed
     for (const [status, labelKey, className] of [
```
Línea final: 517 (el bucle estaba en 517, no ~472).

## Comprobaciones (desde mobile-pet-tracker/)
- `FORCE_COLOR=0 bunx jest --runTestsByPath src/screens/alerts/index.test.tsx` -> `Test Suites: 1 passed, 1 total` / `Tests:       75 passed, 75 total`
- `FORCE_COLOR=0 bunx jest --runTestsByPath src/__tests__/design-drift.test.ts` -> `Test Suites: 1 passed, 1 total` / `Tests:       74 passed, 74 total`
- `bunx expo lint --no-cache > /tmp/174-r9-lint.txt 2>&1; echo "exit=$?"` -> `exit=0`; `test ! -s ...` -> `lint-ok`
- `grep -rn "174 R9" src` -> 1 línea: `src/screens/alerts/index.test.tsx:517:    // #174 R9: una aserción de className exacto por rama, acked y closed`

## Árbol tras el commit
`M progress/current.md`, `M specs/mobile-alerts-canvas-fidelity/traceability.md` (del leader, no tocados) y `?? progress/review_mobile-alerts-canvas-fidelity.md`; este informe queda sin commitear.
