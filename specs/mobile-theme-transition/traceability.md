---
feature: "mobile-theme-transition"
status: draft        # draft | approved
tags: [harness, spec]
---

# Trazabilidad — [[mobile-theme-transition]] (feature #43)

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | pendiente (previsto: `src/theme/__tests__/theme-transition.test.tsx`) | pendiente |
| R2 | pendiente (previsto: `src/screens/profile/index.test.tsx`) | pendiente |
| R3 | pendiente (previsto: `src/theme/__tests__/theme-transition.test.tsx`) | pendiente |
| R4 | pendiente (previsto: `src/theme/__tests__/theme-transition.test.tsx` + smoke humano Expo Go) | pendiente |
| R5 | pendiente (previsto: `./init.sh` verde con deps nitro) | pendiente |
| R6 | **verificación humana, sin test** — dev build EAS en Android físico + decisión registrada en [[requirements]] §Decisión del gate humano | pendiente (la cierra el humano) |

Regla: el reviewer no aprueba si alguna fila queda "pendiente". R6 solo puede
cerrarla el humano (fade en dev build + decisión mantener/descartar); si la
decisión es **descartar**, todas las filas se cierran con la referencia al
commit de revert y la nota de descarte.
Convención de commit: `feat(mobile-theme): <desc> (R1,R2)`.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).
