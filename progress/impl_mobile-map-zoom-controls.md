# Implementación — #55 `mobile-map-zoom-controls`

- Fecha: 2026-09-01
- Branch: `feature/mobile-map-zoom-controls`
- HEAD inicial del implementer: `f36b152`
- Base de la branch: `origin/main` en `e8c5511` (merge del PR #94)

## Resultado automatizable

R1 añade al objeto `mapViewProps` de `PetMap` únicamente
`uiSettings: { zoomControlsEnabled: false }`. No se pasa
`zoomGesturesEnabled` ni `contentPadding`, no se amplía `PetMapProps` y no se
añade ningún export.

El test Jest prueba exclusivamente que la prop viaja al mock de
`GoogleMaps.View`. No verifica la desaparición de los botones nativos ni el
pinch-to-zoom; esas dos comprobaciones pertenecen al smoke humano R3.

## TDD R1

- Rojo: `e052b07 test(map): require hidden zoom controls (R1)` — la suite
  dirigida salió 1 al recibir `uiSettings: undefined` (1 test fallido y 7
  previos verdes).
- Verde: `bf14baf fix(map): hide native zoom controls (R1)` — la misma suite
  dirigida salió 0 (8 tests verdes).
- Refactor: no aplica; la implementación mínima es una sola clave del objeto.

## Verificación R2

### Allowlist

La allowlist aprobada permite cambios únicamente en:

- `mobile-pet-tracker/src/components/pet-map.tsx`
- `mobile-pet-tracker/src/components/__tests__/pet-map.test.tsx`
- `docs/verification.md`
- `specs/mobile-map-zoom-controls/**`
- `progress/impl_mobile-map-zoom-controls.md`
- `feature_list.json` (permitido por R2, pero este handoff prohíbe modificarlo)

Los testIDs que deben conservarse sin cambio son `screen-map`, `map-view`,
`map-stats`, `map-empty-overlay` y `lost-mode-button`.

### Comandos automáticos

Pendiente de registrar tras ejecutar la matriz final.

### Diff real y contención

Pendiente de registrar tras ejecutar la matriz final contra el HEAD inicial
`f36b152`.

### Grep-clean C8

Pendiente de registrar tras ejecutar la matriz final.

## Resultado del smoke R3

**Pendiente del humano.** Debe confirmar por separado en el dev build de
Android: controles `+` / `−` ausentes, pinch acercando, pinch inverso alejando
y no-regresión de tiles, marker, polyline, `map-stats` y Lost Mode. Ninguna
suite automatizada de este reporte cierra R3.
