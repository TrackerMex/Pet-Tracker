# Handoff a Codex CLI — feature #47 mobile-design-drift

Feature: mobile-design-drift, branch: feature/47-mobile-design-drift
Working tree: /home/claude/sites/Pet-Tracker-wt-47 (git worktree — NO trabajar
en /home/claude/sites/Pet-Tracker, ahí corre otra sesión con #39)
Spec aprobada: specs/mobile-design-drift/requirements.md (aprobación humana 60296fa)
Lee también: specs/mobile-design-drift/design.md y tasks.md, y
progress/audit_design-drift_mobile.md (auditoría origen del alcance)

Archivos a crear/modificar:
- mobile-pet-tracker/src/theme/global.css (tokens --radius-card, --text-2xs)
- mobile-pet-tracker/src/components/card.tsx (nuevo, variantes surface|accent|secondary)
- mobile-pet-tracker/src/app/(tabs)/*.tsx (reemplazos según tabla de design.md;
  safe area + Skeleton en health, weight-log, profile, map)
- mobile-pet-tracker/src/components/floating-tab-bar.tsx (text-2xs)
- specs/mobile-design-drift/traceability.md

Reglas críticas:
- Seguir docs/conventions.md (§Dimensiones de pantalla uniformes y §estructura Expo)
- TDD por requisito: test rojo → verde → refactor (orden en tasks.md)
- UN COMMIT POR REQUISITO como mínimo, test rojo commiteado antes que su
  implementación. Un único commit con todo incumple C4 de CHECKPOINTS.md
- Actualizar specs/mobile-design-drift/traceability.md tras cada commit
- NO heredar --radius de heroui/shadcn para el radius de card (bug #46, e370daa):
  usar el token --radius-card explícito
- Sin cambios visuales intencionales salvo safe area y skeletons
- No crear recursos AWS ni tocar backend-pet-tracker/
- Grep-clean final: cero `rounded-[20px]` y cero `text-[10px]` en
  mobile-pet-tracker/src/

Criterios de aceptación: R1–R8 de requirements.md (cada R-id nombra su test)
Al terminar: escribir resultado en progress/impl_mobile-design-drift.md y
commitear todo en el branch. NO abrir PR (lo decide el humano tras review).
