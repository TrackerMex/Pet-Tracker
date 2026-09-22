---
feature: "mobile-reanimated-double-dead-weight"
status: spec_ready        # draft | spec_ready | approved
tags: [harness, spec, mobile, tests]
---

# Trazabilidad — [[mobile-reanimated-double-dead-weight]]

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `src/screens/home/index.test.tsx::R1 (mobile-reanimated-double-dead-weight): home monta el Skeleton real de heroui-native` | `52f553ab test(mobile): use real HeroUI Skeleton (R1)` |
| R2 | `src/screens/home/index.test.tsx::R2 (mobile-reanimated-double-dead-weight): Animated.View no es el View de react-native` | `1db9f6ff test(mobile): keep real Reanimated View (R2)` |
| R3 | `progress/impl_mobile-reanimated-double-dead-weight.md::R3 — bloque #62 R8 intacto y sonda de mutación` | `2b37b65d test(mobile): verify #62 Skeleton guard by mutation (R3)` |
| R4 | `progress/impl_mobile-reanimated-double-dead-weight.md::R4 — inventario de gemelos` (`grep` sobre `docs/conventions.md`) | `4ce889ca docs(mobile): registra los gemelos del doble de Skeleton (R4)` |

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: `feat(<scope>): <desc> (R1,R2)`. En esta feature no hay
código de producción, así que los commits de R1-R3 son `test(mobile): …` y el de
R4 es `docs(mobile): …`.

**R3 y R4 son requisitos de verificación** (ver [[requirements]] §Vías de C4):
su celda de "Test" no es un `it` nuevo sino la evidencia que los cierra —
para R3, la sonda de mutación sobre `src/screens/home/index.tsx:372` más el
`git diff` vacío del rango de #62 R8; para R4, el `grep` sobre
`docs/conventions.md`. Registra en la celda **dónde vive esa evidencia** en
`progress/impl_mobile-reanimated-double-dead-weight.md`.

> **No rebasear después de rellenar esta tabla.** Un rebase invalida los hashes
> y ya paró el cierre de #87. Si hubiera que rebasear, reapuntar cada hash y
> verificar con `git merge-base --is-ancestor`.

El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).
