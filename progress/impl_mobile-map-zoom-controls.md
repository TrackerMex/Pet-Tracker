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

## Fuentes Expo

- La instalación disponible del plugin Expo es 1.0.2 y no contiene la skill
  solicitada `expo:expo-overview`; se cargó su guía general disponible
  `expo:building-native-ui`. No existe una skill específica de `expo-maps`.
- Se leyó la documentación oficial versionada de SDK 57 en
  `https://docs.expo.dev/versions/v57.0.0/sdk/maps/`.
- La autoridad para el cambio fueron los tipos instalados de
  `expo-maps@57.0.2`: `zoomControlsEnabled?: boolean` en
  `GoogleMaps.types.d.ts:218`, `zoomGesturesEnabled?: boolean` en `:222` y
  `uiSettings?: GoogleMapsUISettings` en `:352`.

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

| Comando | Exit | Resultado |
|---|---:|---|
| `./init.sh` antes de modificar código | 0 | Baseline completo verde. |
| `bun run test --runInBand src/components/__tests__/pet-map.test.tsx` antes del fix | 1 esperado | `uiSettings` era `undefined`; 1 test nuevo falló y los 7 heredados pasaron. |
| El mismo test dirigido después del fix | 0 | 1/1 suite, 8/8 tests. |
| `bun run typecheck` | 0 | `tsc --noEmit` sin errores. |
| `bun run lint` | 0 | `expo lint` sin errores. |
| `bun run test -- --runInBand --silent` (primera corrida completa) | 1 | Falló únicamente el flake preexistente #53 en `src/screens/add-pet/index.test.tsx`: el mock de ImagePicker devolvió `undefined`. |
| `bun run test -- src/screens/add-pet/index.test.tsx --runInBand --silent` | 0 | Reproducción dirigida: 1/1 suite y 7/7 tests, sin cambios. |
| `bun run test -- --runInBand --silent` (repetición) | 0 | 51/51 suites, 570/570 tests y 1/1 snapshot. |
| `./init.sh` (primera corrida final) | 1 | Móvil quedó verde (51/51, 570/570); falló fuera del alcance `health-vaccines.e2e-spec.ts` R12 porque Postgres devolvió las tres acciones de auditoría en otro orden. |
| `pnpm -C backend-pet-tracker run test:e2e -- --runInBand test/health-vaccines.e2e-spec.ts` | 0 | Reproducción dirigida: 1/1 suite y 15/15 tests, sin cambios. |
| `./init.sh` (repetición final) | 0 | `Todo verde`: backend 156 suites/1198 tests; infra 2/14; móvil 51/570 y 1 snapshot; e2e 23 suites/349 tests pasados, 3 suites/8 tests saltados por gates existentes; lint y typecheck verdes. |

No se modificó `add-pet` ni el backend para ocultar los dos flakes. La
repetición final de `init.sh` ejecutó también el `bun run test` móvil sin flags
y salió verde.

### Diff real y contención

La referencia local `main` está atrasada (`e5d98e7`), por lo que la base
correcta de la branch es `origin/main` (`e8c5511`). Para aislar el trabajo del
implementer de los dos commits de aprobación/handoff ya presentes, el diff
real se calcula contra el HEAD inicial `f36b152`.

`git diff --stat f36b152`:

```text
 docs/verification.md                               |  24 ++++
 .../src/components/__tests__/pet-map.test.tsx      |  18 +++
 mobile-pet-tracker/src/components/pet-map.tsx      |   1 +
 progress/impl_mobile-map-zoom-controls.md          | 144 +++++++++++++++++++++
 specs/mobile-map-zoom-controls/traceability.md     |   4 +-
 5 files changed, 189 insertions(+), 2 deletions(-)
```

`git diff --name-status f36b152` contiene exactamente cinco paths, todos
dentro de la allowlist:

```text
M  docs/verification.md
M  mobile-pet-tracker/src/components/__tests__/pet-map.test.tsx
M  mobile-pet-tracker/src/components/pet-map.tsx
A  progress/impl_mobile-map-zoom-controls.md
M  specs/mobile-map-zoom-controls/traceability.md
```

- El chequeo automatizado de allowlist salió 0 y `git diff --check f36b152`
  salió 0.
- `git diff --exit-code f36b152` sobre
  `src/app/(tabs)/map.tsx` y `src/app/(tabs)/__tests__/map.test.tsx` salió 0:
  ambos tienen **cero líneas de diff**.
- También tienen cero líneas de diff `progress/current.md`,
  `feature_list.json`, `requirements.md`, `design.md`, `tasks.md`, `_layout.tsx`,
  `floating-tab-bar.tsx`, `app.config.ts`, `app.json`, `package.json` y
  `bun.lock`.
- El diff de producción de `pet-map.tsx` es exactamente una inserción:
  `uiSettings: { zoomControlsEnabled: false }`. No hay export nuevo.
- `rg` no encuentra `zoomGesturesEnabled` ni `contentPadding` en
  `pet-map.tsx`.
- Sobreviven los cinco testIDs exigidos. Recuento en producción + tests:
  `screen-map` 3, `map-view` 28, `map-stats` 2, `map-empty-overlay` 3 y
  `lost-mode-button` 16.
- El working tree inicial ya contenía 13 enlaces no trackeados bajo
  `.claude/skills/`; se conservaron sin tocarlos ni incluirlos en commits.

### Grep-clean C8

Los cuatro `rg` sobre código de producción (excluyendo tests y, para hex,
`src/theme/`) salieron 1 esperado, sin coincidencias:

- cero hex fuera de `src/theme/`;
- cero clases Tailwind arbitrarias `[...]`;
- cero `StyleSheet.create`;
- cero `shadowColor`, `shadowOffset`, `shadowOpacity`, `shadowRadius` o
  `elevation` legacy.

La suite completa incluyó además
`src/__tests__/design-drift.test.ts`, que quedó verde. Este diff no añade
ningún estilo.

## Resultado del smoke R3

**Pendiente del humano.** Debe confirmar por separado en el dev build de
Android: controles `+` / `−` ausentes, pinch acercando, pinch inverso alejando
y no-regresión de tiles, marker, polyline, `map-stats` y Lost Mode. Ninguna
suite automatizada de este reporte cierra R3.
