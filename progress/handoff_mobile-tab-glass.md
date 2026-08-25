# Handoff a Codex CLI — feature #50 mobile-tab-glass

Feature: mobile-tab-glass, branch: feature/50-mobile-tab-glass
Working tree: /home/claude/sites/Pet-Tracker-wt-ui (git worktree — NO trabajar
en /home/claude/sites/Pet-Tracker, ahí corre otra sesión con #40)
Spec aprobada: specs/mobile-tab-glass/requirements.md (aprobación humana b2e8630)
Lee también: specs/mobile-tab-glass/design.md (decisiones, tokens, mocks
exactos de jest — síguelos tal cual) y tasks.md.

Skills a cargar ANTES de implementar (plugin `expo@openai-curated` ya
instalado en tu CLI): `expo-native-ui` y `expo-animation`.

Archivos a crear/modificar (detalle en design.md §Archivos afectados):
- mobile-pet-tracker/src/components/floating-tab-bar.tsx (backdrop
  GlassView/BlurView por `isLiquidGlassAvailable()`, pill animado con
  translateX + withSpring, export TAB_INDICATOR_SPRING)
- mobile-pet-tracker/src/components/__tests__/floating-tab-bar.test.tsx
  (describes nuevos R1–R5; los existentes quedan intactos)
- mobile-pet-tracker/src/app/(tabs)/_layout.tsx (`animation: 'fade'`)
- mobile-pet-tracker/src/app/__tests__/tabs-layout.test.tsx (NUEVO, R6 —
  nunca dentro de `(tabs)/`)
- mobile-pet-tracker/src/theme/global.css (4 tokens × 2 variants, R2)
- mobile-pet-tracker/src/theme/__tests__/global-css.test.ts (tokens en ambos
  variants)
- specs/mobile-tab-glass/traceability.md
- package.json SIN diff (expo-glass-effect y expo-blur ya declaradas; si
  `node_modules` no las tiene, `npm install` en mobile-pet-tracker/)

Reglas críticas:
- Seguir docs/ui-guidelines.md (carta de UI) — es criterio de review (C8 de
  CHECKPOINTS.md): cero hex fuera de src/theme/, cero clases arbitrarias
  `[...]`, nunca Color/var CSS dentro de estilos de Reanimated (color del
  pill vía useThemeColors como string estático), spring interruptible,
  ReduceMotion.System.
- TDD por requisito: test rojo → verde → refactor (orden en tasks.md).
- UN COMMIT POR REQUISITO como mínimo, test rojo commiteado ANTES que su
  implementación. Un único commit con todo incumple C4 de CHECKPOINTS.md.
- Actualizar specs/mobile-tab-glass/traceability.md tras cada requisito.
- No animar opacidad del contenedor del GlassView (caveat oficial: opacity 0
  desactiva el efecto).
- No tocar backend-pet-tracker/, no crear recursos AWS, no abrir PR.
- Suite completa verde al cierre: `npm test` en mobile-pet-tracker/ (y
  lint/typecheck si el repo los define en package.json).

Criterios de aceptación: R1–R7 de requirements.md (cada R-id nombra su test).
Al terminar: escribir resultado en progress/impl_mobile-tab-glass.md y
commitear todo en el branch. NO abrir PR (lo decide el humano tras review).
