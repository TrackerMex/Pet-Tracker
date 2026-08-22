# Handoff a Codex CLI — feature #37 mobile-health

> El humano copia el bloque de abajo como prompt de Codex CLI en su terminal.
> Claude (leader) no toca `mobile-pet-tracker/` mientras Codex implementa.

```
Feature: mobile-health, branch: feature/37-mobile-health (ya existe, trabaja ahí)
Spec aprobada: specs/mobile-health/requirements.md (status: approved)
Lee también: specs/mobile-health/design.md (D1–D10, firmas y contratos exactos)
y specs/mobile-health/tasks.md

Archivos a crear:
  - mobile-pet-tracker/src/api/health-records.ts
  - mobile-pet-tracker/src/api/__tests__/health-records.test.ts
  - mobile-pet-tracker/src/components/weight-chart.tsx
  - mobile-pet-tracker/src/components/__tests__/weight-chart.test.tsx
  - mobile-pet-tracker/src/app/(tabs)/weight-log.tsx
  - mobile-pet-tracker/src/app/(tabs)/__tests__/weight-log.test.tsx
  - mobile-pet-tracker/src/app/(tabs)/__tests__/profile.test.tsx
Archivos a modificar:
  - mobile-pet-tracker/src/api/http.ts (añadir postJson, ver design §D4)
  - mobile-pet-tracker/src/app/(tabs)/health.tsx (REESCRITA como hub R4–R6)
  - mobile-pet-tracker/src/app/(tabs)/__tests__/health.test.tsx (REESCRITO, excepción C4)
  - mobile-pet-tracker/src/app/(tabs)/profile.tsx (sección App: theme toggle + backend health, R10)
  - mobile-pet-tracker/src/app/(tabs)/_layout.tsx (solo si hace falta ocultar la ruta weight-log de la tab bar)
  - specs/mobile-health/traceability.md

Reglas críticas:
  - Convenciones de docs/conventions.md §Convenciones de la app móvil
    (kebab-case, tests nombran su R-id, conventional commits). Las capas de
    docs/architecture.md son de backend y NO aplican aquí.
  - TDD por requisito: test rojo → verde → refactor (orden en tasks.md).
  - UN COMMIT POR REQUISITO como mínimo, con el test rojo commiteado ANTES
    que su implementación (historial rojo→verde visible). Un único commit
    con todo incumple C4 de CHECKPOINTS.md y el reviewer lo rechaza.
  - CERO dependencias nuevas. La gráfica usa react-native-svg (ya instalado).
    NO usar @gorhom/bottom-sheet: el alta de peso es inline en WeightLog (D1).
  - src/api/ nunca importa React ni expo-secure-store; token/fetchFn por
    parámetro (regla #33). El reviewer lo verifica con grep.
  - Posicionamiento absoluto y offsets numéricos por style inline; el resto
    className + tokens (lección #34).
  - SIN react-query: createWeight invalida su lista vía refetch() local.
  - Excepción C4 (única): health.test.tsx se reescribe para el hub; sus
    casos actuales (health-check por kind, recheck, theme toggle) se
    TRASLADAN a profile.test.tsx con testIDs renombrados
    backend-health-state / backend-health-retry (R10). Los casos de Profile
    en screens.test.tsx (título + profile-sign-out) NO se tocan y siguen verdes.
  - PROHIBIDO tocar backend-pet-tracker/, infra/, init.config.sh,
    .github/workflows/ci.yml (R12). No crear recursos AWS reales.
  - Tipos a mano (D11 de #35): sin codegen ni OpenAPI.

Criterios de aceptación: R1–R12 de specs/mobile-health/requirements.md
(R13 es la prueba de humo del humano, no tuya). Cada R-id nombra su test y
archivo exactos en la propia spec. Al final: bun run typecheck, bun run lint
y bun run test verdes en mobile-pet-tracker/ (R11) y ./init.sh exit 0 (R12).

Al terminar: escribir resultado en progress/impl_mobile-health.md
(comandos ejecutados con exit codes, lista de commits rojo→verde por R-id,
desviaciones de la spec si las hubo) y actualizar
specs/mobile-health/traceability.md.
```
