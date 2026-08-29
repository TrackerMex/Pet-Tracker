# Implementación — android-map-never-ready

## Estado

- Feature #54 en implementación sobre `feature/54-android-map-never-ready`.
- R1–R7: implementados y verificados; la feature permanece `in_progress`.
- R8: pendiente de smoke humano en dev build de Android; no lo cierra esta sesión.

## R0 — instalación y contraste de la API real

Fuentes contrastadas antes de escribir tests:

- documentación versionada de Expo SDK 57:
  `https://docs.expo.dev/versions/v57.0.0/sdk/maps/`;
- código instalado en `mobile-pet-tracker/node_modules/expo-maps`.

Comandos:

| Comando | Exit code | Resultado |
|---|---:|---|
| `./init.sh` | 0 | Baseline verde antes de tocar la feature. |
| `bunx expo install expo-maps` | 1 | Instaló `expo-maps@57.0.2`; después falló al no poder añadir automáticamente `expo-maps` a la config dinámica. La sugerencia de plugin se rechaza deliberadamente por D2/R5: la app no usa ubicación. |
| `bun remove react-native-maps` | 0 | Eliminó `react-native-maps@1.27.2` y actualizó `bun.lock`. |
| `bun add expo-maps@~57.0.1` | 0 | Restauró en el manifiesto el rango firmado por R7/D9; Bun resolvió `57.0.2`, compatible con ese rango. |

### Diferencias encontradas antes de los tests

1. La documentación v57 consultada el 2026-08-29 y `expo install` recomiendan
   `~57.0.2`, mientras requirements R7 y design D9 fijan la declaración
   `~57.0.1`. Se conserva el rango contractual `~57.0.1`; el paquete resuelto
   por ese rango es `57.0.2`, cuyo changelog indica como único
   cambio frente a 57.0.1 la adición del tipo `Circle` al namespace
   `GoogleMaps`, sin cambio en la superficie usada por esta feature.
2. Design D7 representa el enum como export top-level
   `GoogleMapsColorScheme`. En `expo-maps@57.0.2`, `src/index.ts` no exporta
   ese símbolo directamente: la API pública real es
   `GoogleMaps.MapColorScheme`, que referencia internamente
   `GoogleMapsColorScheme`. Sus valores sí coinciden con docs/D7:
   `LIGHT = 'LIGHT'`, `DARK = 'DARK'` y
   `FOLLOW_SYSTEM = 'FOLLOW_SYSTEM'`. Los tests y la implementación usan
   la forma pública real del namespace.
3. Las demás formas coinciden con los docs y el diseño:
   `GoogleMaps.View`; `CameraPosition` con `coordinates?` y `zoom?`;
   `GoogleMapsMarker` con `id?` y `coordinates?`; y
   `GoogleMapsPolyline` con `id?`, `coordinates` y `color?`.

## TDD por requisito

| R-id | Commit rojo | Resultado rojo | Commit verde | Resultado verde |
|---|---|---|---|---|
| R1 | `a574f44` | exit 1: `Cannot find module '../pet-map'` | `e99ec43` | test dirigido: 1 suite / 1 test verde; `bun run typecheck`: exit 0 |
| R2 | `1036737` | exit 1: `MAP_ZOOM` esperado 16, recibido `undefined`; R1 seguía verde | `b2080a8` | test dirigido: 1 suite / 2 tests verdes; `bun run typecheck`: exit 0 |
| R3 | `07e8beb` | wrapper exit 1: `markers`/`polylines` recibidos como `undefined`; tab mostró los fallos equivalentes en props (la corrida completa se interrumpió con 130 tras el fallo heredado de `map-marker` en polling, adaptado en el propio commit rojo) | `52518da` | wrapper: 1 suite / 5 tests verdes; tab filtrado: 7 tests verdes (6 R3 + polling); `bun run typecheck`: exit 0 |
| R4 | `1af4623` | wrapper y tab: exit 1; `colorScheme` esperado `DARK`/`LIGHT`, recibido `undefined`; R1–R3 seguían verdes | `dbdfa27` | wrapper: 7/7 tests; tab: 31/31 tests; `bun run typecheck`: exit 0 |
| R5 | `73331f3` | `app.config.test.ts`: exit 1; esperaba `android.config.googleMaps.apiKey` sin plugin y recibió el plugin legado de `react-native-maps`; los 4 tests heredados R2/R3 siguieron verdes | `085d57f` | `app.config.test.ts`: 5/5 tests verdes; `bun run typecheck`: exit 0 |
| R6 | N/A (documentación) | checklist contractual de seis puntos sin aplicar | `02a4f2c` | seis puntos aplicados; grep en `docs/` sin menciones vivas a `customMapStyle`, `map-style-dark.json` ni "todo debe correr en Expo Go" |
| R7 | N/A (verificación) | allowlist/checks sin ejecutar | `a1af164` | selectores legacy retirados; regresión, allowlist, grep-clean y segundo `./init.sh` verdes |

## Verificación R7

### Comandos y resultados

| Comando | Exit code | Resultado |
|---|---:|---|
| `bun run test -- 'src/app/\(tabs\)/__tests__/map.test.tsx' --runInBand` | 0 | Suite del tab Map: 1/1 suite y 31/31 tests verdes tras retirar las consultas a los testIDs legacy. |
| `bun run typecheck` | 0 | `tsc --noEmit` sin errores. |
| `bun run lint` | 0 | `expo lint` sin errores. |
| `bun run test -- --runInBand --silent` (primera corrida auditable) | 1 | 50/51 suites y 567/568 tests verdes; falló solo `src/screens/add-pet/index.test.tsx` porque el mock de ImagePicker devolvió `undefined`, flake preexistente registrado como #53. |
| `bun run test -- 'src/screens/add-pet/index.test.tsx' --runInBand --silent` | 0 | Reproducción dirigida: 1/1 suite y 7/7 tests verdes sin cambios. |
| `bun run test -- --runInBand --silent` (repetición) | 0 | 51/51 suites, 568/568 tests y 1/1 snapshot verdes. |
| `./init.sh` (primera corrida final) | 1 | Build, backend (152/152 suites) e infra (2/2 suites) verdes; volvió a fallar solo el mismo flake #53 durante la suite móvil. Map pasó. |
| `./init.sh` (repetición final) | 0 | `Todo verde`: backend 152 suites / 1162 tests; infra 2 / 14; móvil 51 / 568; e2e 22 suites y 343 tests pasados, 3 suites y 8 tests saltados por gates existentes; lint y typecheck verdes. |
| `git diff --check origin/feature/54-android-map-never-ready...HEAD` | 0 | Sin errores de whitespace. |
| `grep -rn "react-native-maps" src/ app.config.ts app.config.test.ts package.json` | 1 esperado | Sin coincidencias. |
| `test ! -e src/theme/map-style-dark.json` | 0 | El estilo JSON reemplazado no existe. |
| `rg -n "map-marker\|map-route-" src` | 1 esperado | Los dos selectores retirados ya no aparecen ni en producción ni en tests. |
| grep documental de `customMapStyle`, `map-style-dark.json` y "todo debe correr en Expo Go" | 1 esperado | Sin menciones vivas en `docs/`. |
| greps C8 sobre código de producción, excluyendo `src/theme/` y tests | 1 esperado cada uno | Cero hex, clases arbitrarias, `StyleSheet.create` y shadow/elevation legacy. |
| grep de hex sobre líneas añadidas por el delta de implementación | 1 esperado | Cero hex nuevos; la polyline usa `useThemeColors(['accent'])`. |
| diff de archivos protegidos contra `origin/feature/54-android-map-never-ready` | 0 | Ningún cambio en `app.json`, `eas.json`, `.env.example`, `.gitignore`, backend, infra, `.github`, architecture, conventions, bookkeeping ni history/current. |

Una primera invocación dirigida usó el path del tab sin escapar los
paréntesis y terminó con exit 1 / `No tests found`; la invocación corregida
es la primera fila de la tabla. No se modificó código para hacer pasar el
flake #53: su archivo está fuera de la allowlist y pasó dirigido antes de las
dos repeticiones completas.

### Allowlist comprobada

La referencia local `main` (`e5d98e7`) está 79 commits por detrás de
`origin/main`, por lo que `git diff --stat main...HEAD` termina con exit 0 pero
enumera 48 archivos heredados de #45/#52 y del handoff aprobado de #54; no
permite aislar esta sesión. `origin/main...HEAD` incluye además la spec y el
handoff aprobados, todavía no fusionados. La comparación del delta del
implementer contra el handoff remoto exacto (`cae4559`,
`origin/feature/54-android-map-never-ready...HEAD`) devuelve solo estos 14
paths, todos en la allowlist cerrada:

- `mobile-pet-tracker/package.json`
- `mobile-pet-tracker/bun.lock`
- `mobile-pet-tracker/app.config.ts`
- `mobile-pet-tracker/app.config.test.ts`
- `mobile-pet-tracker/src/components/pet-map.tsx` (nuevo)
- `mobile-pet-tracker/src/components/__tests__/pet-map.test.tsx` (nuevo)
- `mobile-pet-tracker/src/app/(tabs)/map.tsx`
- `mobile-pet-tracker/src/app/(tabs)/__tests__/map.test.tsx`
- `mobile-pet-tracker/src/theme/map-style-dark.json` (borrado)
- `docs/ui-guidelines.md`
- `docs/verification.md`
- `specs/android-maps-api-key/traceability.md`
- `specs/android-map-never-ready/traceability.md`
- `progress/impl_android-map-never-ready.md`

`feature_list.json`, `STATUS.md`, `progress/current.md` y
`progress/history.md` quedaron byte-idénticos al handoff. El working tree no
tiene cambios de la feature sin commitear; siguen visibles únicamente enlaces
no trackeados preexistentes bajo `.claude/skills/`, que esta sesión no tocó.

### Contratos conservados y C8

- Sobreviven los 15 testIDs exigidos: `screen-map`, `map-loading`,
  `map-error`, `map-retry`, `map-no-pets`, `map-no-tracking`, `map-empty`,
  `map-empty-overlay`, `map-stats`, `stat-speed`, `stat-distance`,
  `stat-updated`, `stat-gps`, `lost-mode-button` y `lost-mode-error`.
- Se conservaron literalmente los nombres de los describes heredados R1,
  R4–R9, incluidos los de marker, polylines, tema y Lost Mode. Los describes
  R2/R3 de `app.config.test.ts` siguen verdes y no se editaron.
- Los únicos testIDs eliminados son `map-marker` y `map-route-<i>`; el
  contrato vigente se assertea mediante `markers` y `polylines` de `map-view`.
- `package.json` declara `"expo-maps": "~57.0.1"` y no declara
  `react-native-maps`; `PetMap` usa `GoogleMaps.View` sin rama de plataforma.
- No se usa `FOLLOW_SYSTEM` en producción. La preferencia guardada se traduce
  a `GoogleMaps.MapColorScheme.DARK` / `LIGHT`, y el color de ruta sale de
  `useThemeColors` sin literal hexadecimal.
- El grep C8 crudo sobre todo `src/` encuentra hex heredados en tests y
  snapshots; el criterio histórico del repo se ejecuta sobre producción
  excluyendo tests y `src/theme/`. Ese grep, el guard
  `src/__tests__/design-drift.test.ts` y el grep de líneas añadidas quedan
  verdes, por lo que esta feature no introduce deriva.

## Resultado del smoke R8

Pendiente de ejecución por el humano en un dispositivo Android real. Un
watermark sin tiles no satisface R8. El runbook literal está en
`docs/verification.md` §Feature 54 y exige confirmación separada de tiles,
marker y polyline en temas claro y oscuro, además de stats y Lost Mode.
Ningún resultado de Jest anterior demuestra que la superficie nativa pinte.
