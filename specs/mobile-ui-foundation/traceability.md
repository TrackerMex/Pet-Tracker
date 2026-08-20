---
feature: "mobile-ui-foundation"
status: approved     # draft | approved
tags: [harness, spec, mobile]
---

# Trazabilidad — [[mobile-ui-foundation]]

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `mobile-pet-tracker/src/__tests__/heroui-smoke.test.tsx::R1: HeroUI Button con className renderiza en jest` | `a727f7a feat(mobile-ui-foundation): render HeroUI smoke test (R1)`; rojo: `b03fb4c` |
| R2 | estructural — reviewer verifica `metro.config.js` y `src/theme/global.css` contra design §D2/§D4 (excepción C4); render real en gate R10 | `0c91e7b feat(mobile-ui-foundation): configure Uniwind theme (R2)` |
| R3 | `bun run --cwd mobile-pet-tracker typecheck` exit 0 + reviewer: `git ls-files` (uniwind-env.d.ts sí, uniwind-types.d.ts no) | `7a95b94 feat(mobile-ui-foundation): type Uniwind class names (R3)` |
| R4 | estructural — reviewer verifica `src/app/_layout.tsx` (css import + GestureHandlerRootView > HeroUINativeProvider > Stack); el render del provider lo cubre el test de R1 | `56add4f feat(mobile-ui-foundation): mount HeroUI root provider (R4)` |
| R5 | `mobile-pet-tracker/src/app/__tests__/index.test.tsx::R7: health screen states and retry` (suite de #31, verde sin modificar asserts) + reviewer: grep sin `StyleSheet.create` ni hex en `src/app/index.tsx` | pendiente |
| R6 | `mobile-pet-tracker/src/app/__tests__/index.test.tsx::R6: theme toggle` (spy `Uniwind.setTheme`, rojo→verde) | pendiente |
| R7 | estructural — reviewer valida `mobile-pet-tracker/eas.json` (JSON.parse + campos exactos de design §D8) y `expo-dev-client` en package.json | pendiente |
| R8 | estructural — reviewer verifica sección `## Convenciones de la app móvil` en `docs/conventions.md` | pendiente |
| R9 | reviewer ejecuta `./init.sh` (exit 0) y `git diff --stat main...HEAD -- backend-pet-tracker/ infra/ init.config.sh .github/` (vacío) | pendiente |
| R10 | gate humano — smoke en **Expo Go** sobre Android físico (`bunx expo start --go`, checkbox en requirements §R10; sin builds) | pendiente |

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: `feat(mobile-ui-foundation): <desc> (R1,R2)`.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).
