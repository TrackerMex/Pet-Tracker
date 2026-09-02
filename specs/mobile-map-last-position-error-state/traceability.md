---
feature: "mobile-map-last-position-error-state"
status: approved     # draft | approved
tags: [harness, spec, mobile]
---

# Trazabilidad — [[mobile-map-last-position-error-state]]

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `src/app/(tabs)/__tests__/map.test.tsx::R1 (mobile-map-last-position-error-state): rama de error de last::muestra mensaje y Retry cuando last devuelve error`; `::Retry llama al refetch de last y recupera el mapa`; `::la rama pinta bg-background y screen-map sigue sin fondo` | `83a1602 test(map): red coverage for last position error kinds (R1-R4)` → `dbde188 fix(map): render error branch for last position kinds (R1-R4)` |
| R2 | `src/app/(tabs)/__tests__/map.test.tsx::R2 (mobile-map-last-position-error-state): unauthorized de last::comparte la rama de error y dispara el signOut de sesión expirada` | `83a1602 test(map): red coverage for last position error kinds (R1-R4)` → `dbde188 fix(map): render error branch for last position kinds (R1-R4)` |
| R3 | (a) sin test de runtime: `src/app/(tabs)/map.tsx::isLastError` e `::isPetsError`, switches exhaustivos sin `default`, retorno `: boolean` + `bun run typecheck` verde; (b) `src/app/(tabs)/__tests__/map.test.tsx::R3 (mobile-map-last-position-error-state): cobertura total y exclusión mutua::muestra la rama de error y reintenta con unreachable`; `::muestra la rama de error y reintenta con missing-config`; (c) `::solo la rama de error de pets renderiza cuando pets cae con last resuelto` | `83a1602 test(map): red coverage for last position error kinds (R1-R4)` → `dbde188 fix(map): render error branch for last position kinds (R1-R4)` |
| R4 | `src/app/(tabs)/__tests__/map.test.tsx::R4 (mobile-map-last-position-error-state): unauthorized de pets::renderiza la rama de error de pets y dispara signOut` | `83a1602 test(map): red coverage for last position error kinds (R1-R4)` → `dbde188 fix(map): render error branch for last position kinds (R1-R4)` |
| R5 | sin test propio: `progress/impl_mobile-map-last-position-error-state.md::Verificación R5` registra test dirigido, typecheck, lint, `./init.sh`, grep-clean, allowlist y `git diff --stat main...HEAD` | `83a1602 test(map): red coverage for last position error kinds (R1-R4)` → `dbde188 fix(map): render error branch for last position kinds (R1-R4)`; cierre documental en `docs(map): traceability y verificación (R5)` |

Rutas relativas a `mobile-pet-tracker/` salvo las que empiezan por `specs/`
o `progress/`.

Regla: el reviewer no aprueba si alguna fila queda "pendiente". Los
describes llevan el sufijo `(mobile-map-last-position-error-state)` porque
`map.test.tsx` es archivo COMPARTIDO entre features (regla H5, review #44).
No hay gate de smoke humano en esta feature ([[requirements]]
§Verificación humana): la tabla completa + typecheck/lint/init.sh verdes
cierran la parte técnica.

Convención de commit: `test(map): … (R1-R4)` en rojo →
`fix(map): … (R1-R4)` en verde → `docs(map): … (R5)`.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y
[[../../CHECKPOINTS|CHECKPOINTS]] C5).
