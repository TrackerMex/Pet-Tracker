---
feature: "mobile-tabs-shell"
status: approved     # draft | approved
tags: [harness, spec, mobile]
---

# Trazabilidad — [[mobile-tabs-shell]]

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `mobile-pet-tracker/src/app/(tabs)/__tests__/layout.test.tsx::R1: (tabs) exige sesión` | `929d6b2` test rojo → `0822ba7` feat verde |
| R2 | `mobile-pet-tracker/src/app/(auth)/__tests__/layout.test.tsx::R2: (auth) expulsa sesiones activas` | `c1dc47d` test rojo → `b3028d1` feat verde |
| R3 | suites existentes `index.test.tsx::R5`, `login.test.tsx::R7`, `register.test.tsx::R8` con asserts `/home` + diff limitado a 3 hrefs | `d3992fb` asserts rojos → `2995514` feat verde |
| R4 | `mobile-pet-tracker/src/app/(tabs)/__tests__/health.test.tsx` (suite heredada, 6 casos; asserts intactos) + diff limitado a imports | `0a55b28` feat verde (renames 95%/96%) |
| R5 | `mobile-pet-tracker/src/app/(tabs)/__tests__/screens.test.tsx::R5: placeholders de tabs` | `f49519b` test rojo → `b45c1a4` feat verde |
| R6 | `mobile-pet-tracker/src/app/(tabs)/__tests__/screens.test.tsx::R6: profile permite cerrar sesión` | `95ecd19` test rojo → `9100e17` feat verde |
| R7 | `mobile-pet-tracker/src/components/__tests__/floating-tab-bar.test.tsx::R7: tab bar renderiza y navega` | `9f7d634` test rojo → `e306135` feat verde |
| R8 | `mobile-pet-tracker/src/components/__tests__/floating-tab-bar.test.tsx::R8: tab bar flota con safe area` | `f30952c` test rojo → `cf99e35` feat verde |
| R9 | `typedRoutes` activo; `.expo/types/router.d.ts` regenerado con los nuevos hrefs; `bun run --cwd mobile-pet-tracker typecheck` y `lint` (exit 0) | `c5a84d3` verificación de tipos verde |
| R10 | `./init.sh` (exit 0), suite móvil completa (13 suites/75 tests) y diff de contención vacío | `9e6af4b` verificación integral verde |
| R11 | pendiente (checkbox humano en requirements.md) | pendiente |

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: `feat(mobile): <desc> (R1,R2)`.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).
