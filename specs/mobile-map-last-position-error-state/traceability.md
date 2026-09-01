---
feature: "mobile-map-last-position-error-state"
status: draft        # draft | approved
tags: [harness, spec, mobile]
---

# Trazabilidad — [[mobile-map-last-position-error-state]]

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | pendiente — `src/app/(tabs)/__tests__/map.test.tsx::R1 (mobile-map-last-position-error-state): rama de error de last` (3 its: mensaje+Retry, refetch recupera el mapa, pin `bg-background`/§10) | pendiente |
| R2 | pendiente — `map.test.tsx::R2 (mobile-map-last-position-error-state): unauthorized de last` | pendiente |
| R3 | pendiente — (a) sin test de runtime: switch exhaustivo sin `default` con retorno `: boolean` en `map.tsx` + `bun run typecheck` verde, lo valida el reviewer leyendo el código; (b) `map.test.tsx::R3 (…): it.each unreachable/missing-config`; (c) `map.test.tsx::R3 (…): exclusión mutua con pets caído` | pendiente |
| R4 | pendiente — `map.test.tsx::R4 (mobile-map-last-position-error-state): unauthorized de pets` | pendiente |
| R5 | pendiente — sin test propio: comandos y `git diff --stat` contra la allowlist registrados en `progress/impl_mobile-map-last-position-error-state.md` | pendiente |

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
