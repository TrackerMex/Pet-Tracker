---
feature: "mobile-docs-upload"
status: draft        # draft | approved
tags: [harness, spec, mobile]
---

# Trazabilidad — [[mobile-docs-upload]] (#158)

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | pendiente — 1 `it` nuevo en `src/providers/__tests__/language-provider.test.tsx` (24 → 25), más los literales de `docs.emptyBody` en `empty-state.test.tsx` y `docs/index.test.tsx` | pendiente |
| R2 | pendiente — 54 en `src/api/__tests__/media.test.ts` (15 → 69) | pendiente |
| R3 | pendiente — 21 en `src/screens/docs/index.test.tsx` (16 → 37), más el `it` de #155 R7 redirigido a `family` | pendiente |
| R4 | pendiente — 6 en `src/screens/docs/index.test.tsx` (37 → 43) | pendiente |
| R5 | pendiente — 16 en `src/screens/docs/index.test.tsx` (43 → 59) | pendiente |
| R6 | pendiente — 5 en `src/screens/docs/index.test.tsx` (59 → 64) | pendiente |
| R7 | pendiente — 3 en `src/screens/docs/index.test.tsx` (64 → 67) | pendiente |
| R8 | pendiente — 7 en `src/screens/docs/index.test.tsx` (67 → 74) | pendiente |
| R9 | pendiente — 23 en `src/screens/docs/index.test.tsx` (74 → 97) | pendiente |
| R10 | pendiente — 9 en `src/screens/docs/index.test.tsx` (97 → 106) | pendiente |
| R11 | pendiente — 2 en `src/screens/docs/index.test.tsx` (106 → 108) | pendiente |
| R12 | pendiente — 0 nuevos: longitud y título de `R7_PROFILE` en `src/__tests__/ui-language.test.ts` (37 → 53) | pendiente |
| R13 | pendiente (smoke humano; sin test automático) | pendiente (casilla firmada en requirements.md §Prueba de humo) |

Los recuentos entre paréntesis son los totales del fichero tras el commit rojo
de ese requisito ([[tasks]] §Recuentos). En total, 147 `it` nuevos: 1 en
language-provider, 54 en media y 92 en la pantalla.

Regla: el reviewer no aprueba si alguna fila queda "pendiente". La única
excepción es R13, que la cierra el humano después del veredicto.
Convención de commit: `test(mobile-docs-upload): ... (R<n>)` para el rojo y
`feat(mobile-docs-upload): ... (R<n>)` para el verde.
El implementer actualiza esta tabla tras cada commit, con el hash del rojo y
del verde, y el reviewer la valida al aprobar (ver [[../../docs/specs|specs]] y
[[../../CHECKPOINTS|CHECKPOINTS]] C5).
