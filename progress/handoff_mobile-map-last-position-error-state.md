# Handoff a Codex CLI — #56 `mobile-map-last-position-error-state`

> Escrito por el leader el 2026-09-02, tras la aprobación humana de la spec
> (commit `7b0c5e5`). El humano pega el prompt de abajo en Codex CLI.

## Prompt

```
Feature: mobile-map-last-position-error-state (#56), branch: feature/56-mobile-map-last-position-error-state
Antes de nada: git checkout feature/56-mobile-map-last-position-error-state && git pull

Spec aprobada: specs/mobile-map-last-position-error-state/requirements.md (status: approved)
Lee también: design.md (D1-D6, incluye el JSX literal de la rama nueva) y
tasks.md — no hay decisiones abiertas.

Feature de UI MÓVIL:
  - Actualiza el plugin expo si puedes (codex plugin update expo); carga
    expo-overview, y si tu versión no la trae (v1.0.2 no la traía en #55),
    carga building-native-ui y decláralo como desviación en el reporte.
    Carga también appllama-app-design-skill.
  - docs/ui-guidelines.md MANDA sobre cualquier skill: de la skill se toma el
    patrón, JAMÁS su sistema de estilos.
  - Regla §10 (cerró #54): ningún ancestro de PetMap gana fondo opaco; la
    rama nueva pinta su propio bg-background, el contenedor screen-map no.

Isla bun: test/typecheck/lint se corren DESDE mobile-pet-tracker/ con bun.
Suite objetivo: bun run test -- 'src/app/(tabs)/__tests__/map.test.tsx' --runInBand

Archivos a modificar (los ÚNICOS):
  - mobile-pet-tracker/src/app/(tabs)/__tests__/map.test.tsx   (SOLO adiciones)
  - mobile-pet-tracker/src/app/(tabs)/map.tsx
PROHIBIDO tocar: pet-map.tsx, use-api.ts, auth-provider.tsx,
  (tabs)/_layout.tsx, src/api/*, package.json, bun.lock, progress/current.md,
  specs/** salvo traceability.md (si crees que la spec tiene un error, PARA y
  repórtalo en el reporte de impl, no la edites), feature_list.json (el status
  lo cambia el leader tras el veredicto del reviewer, nunca tú)

Reglas críticas:
  - TDD ESTRICTO rojo→verde (C4 de CHECKPOINTS.md). Orden de commits
    obligatorio, según tasks.md:
      1. test(map): red coverage for last position error kinds (R1-R4)
         ← solo tests: 4 describes con sufijo (mobile-map-last-position-error-state),
           ~7 its, suite ROJA (nuevos fallan, 32 previos verdes). Registra la
           salida roja en el reporte ANTES de escribir producción.
      2. fix(map): render error branch for last position kinds (R1-R4)
         ← único diff de producción en map.tsx (D3-D5): isLastError e
           isPetsError con switch exhaustivo sin default, petsReady, rama B5;
           suite ~39/39, typecheck y lint verdes
      3. docs(map): traceability y verificación (R5)
    Meter test + implementación + docs en un solo commit = rechazo directo.
  - Actualizar specs/mobile-map-last-position-error-state/traceability.md
    (archivo::describe::it + hashes por fila) y las casillas de tasks.md
  - Commitea en la branch; NO pushees — el leader pushea tras el veredicto
    del reviewer
  - Cierre R5: registrar en progress/impl_mobile-map-last-position-error-state.md
    la salida completa de: bun run test -- 'src/app/(tabs)/__tests__/map.test.tsx'
    --runInBand, bun run typecheck, bun run lint, ./init.sh desde la raíz, y
    git diff --stat main...HEAD contra la allowlist de R5 (cero líneas fuera
    de los dos archivos permitidos; map.test.tsx solo adiciones)

Criterios de aceptación: R1, R2, R3, R4, R5 de requirements.md. No hay smoke
humano obligatorio (cambio solo-JS); al cerrar R5 avisa y para.
Al terminar: reporte en progress/impl_mobile-map-last-position-error-state.md
```

## Después del handoff (leader)

1. Mientras Codex implementa: no tocar `mobile-pet-tracker/`.
2. Humano confirma fin → leer `progress/impl_mobile-map-last-position-error-state.md`
   → lanzar `reviewer`.
3. Veredicto aprobado → push + `gh pr create`; el humano mergea.
4. Sin gate R de smoke: con el veredicto del reviewer y el chequeo manual
   opcional del humano, #56 puede pasar a `done`.
