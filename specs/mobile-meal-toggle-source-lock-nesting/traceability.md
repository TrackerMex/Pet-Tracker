---
feature: "mobile-meal-toggle-source-lock-nesting"
status: spec_ready       # draft | spec_ready | approved
tags: [harness, spec, mobile, deuda]
---

# Trazabilidad — [[mobile-meal-toggle-source-lock-nesting]] (#109)

> Las dos últimas columnas las rellena **Codex** al implementar. Rutas
> relativas a `mobile-pet-tracker/` salvo indicación contraria.

| Requisito | Test (archivo::nombre) | Commit rojo | Commit verde |
|---|---|---|---|
| R1 — el bloque se acota al tag de apertura propio | `src/app/(tabs)/__tests__/food.test.tsx` :: `#109 R1: acota el bloque de fuente al tag de apertura propio del meal-toggle` | | |
| R2 — rojo ante las cuatro variantes de acotado (V1–V4) | el mismo test de R1, cerrado por **mutación de producción** (C4 vía **b**); tabla de las cuatro sondas en `progress/impl_mobile-meal-toggle-source-lock-nesting.md` | | |
| R3 — sin falsos rojos (V5, V6) y `0.8` sigue candado (V7) | el mismo test de R1, más el `it` de árbol `#107 R5: el botón por franja conserva su feedback de pulsado`; tabla de las tres sondas en el mismo reporte | | |
| R4 — el límite del patrón, documentado | **sin test**: comentario sobre el `const block` en `src/app/(tabs)/__tests__/food.test.tsx` + subsección nueva en `docs/conventions.md` §Tests. Lo verifica el `reviewer` leyendo los dos sitios | | |
| R5 — cero diff de producción | **sin test**: `git diff 73f14d5e -- 'mobile-pet-tracker/src/app/(tabs)/food.tsx'` sin salida. Lo verifica el `reviewer` | | |

Regla: el reviewer no aprueba si alguna fila queda "pendiente".

Convención de commit: `test(mobile): <desc> (R1,R2)` para el par rojo→verde y
`docs(mobile): <desc> (R4)` para la documentación. R1 y R2 comparten par: el
commit rojo **versiona la mutación V4 en producción** y el verde **la
revierte** (C4, quinto punto), igual que `#107 R5`.

R4 y R5 **no tienen test y la spec lo declara aquí antes del handoff**: R4 es
un entregable de documentación y R5 es una propiedad del diff. Los dos los
cierra el `reviewer` por inspección, no un candado.

No rebasear esta rama después de que Codex rellene los hashes: invalidarían
la tabla (ver `#87`).
