# Implementación — mobile-theme-transition (feature #43)

- **Fecha**: 2026-08-26
- **Implementador**: Claude Code (sesión aparte, worktree `../pet-tracker-43`), por handoff del leader. Codex CLI no participó en esta feature por decisión del humano.
- **Branch**: `feature/43-mobile-theme-transition`
- **Alcance**: R1–R5. R6 (fade real en dev build Android) queda para el gate humano.

## Resultado

`./init.sh` completo **verde** (2026-08-26): jest móvil 538/538, backend + infra tests, e2e 327 passed / 6 skipped (Postgres + LocalStack arriba), lint y typecheck sin errores.

## Commits (historial rojo→verde por requisito, C4)

| Requisito | Rojo | Verde |
|---|---|---|
| R5 deps nitro + THEME_FADE + whitelist jest | `478766b` | `d08b7b9` |
| R1 useThemeTransition invoca fade | `a92ea6b` | `3b915a2` |
| R3 reduced motion salta animación | `96d53ca` | `95f3e28` |
| R4 degradación + persistencia | `4113e8f` | `eccf899` |
| R2 toggle Profile delega en el hook | `78286d4` | `6f3ec62` (+ `0735838`, ver desviaciones) |

Trazabilidad completa en `specs/mobile-theme-transition/traceability.md` (fila R6 pendiente del humano, como manda la spec).

## Archivos tocados

- `mobile-pet-tracker/package.json` + `bun.lock` — `react-native-nitro-theme-transition@1.0.0` y `react-native-nitro-modules@0.37.0` (pin exacto) + ambos en `transformIgnorePatterns`.
- `mobile-pet-tracker/src/theme/theme-transition.ts` — NUEVO: `THEME_FADE` (`fade`, 400ms, settleFrames 4) + `useThemeTransition` (reduced motion → apply directo; persistencia con `void setStoredTheme(next)` fuera del callback síncrono; nunca consulta `isThemeTransitionAvailable`).
- `mobile-pet-tracker/src/theme/__tests__/theme-transition.test.tsx` — NUEVO: R5/R1/R3/R4 con el mock degradado del design §6.
- `mobile-pet-tracker/src/screens/profile/index.tsx` — toggle delega en `switchTheme`; imports de `Uniwind`/`setStoredTheme` retirados del screen.
- `mobile-pet-tracker/src/screens/profile/index.test.tsx` — mock degradado + aserción nueva R2; las aserciones de #40 quedan intactas (19/19).
- `mobile-pet-tracker/src/app/(tabs)/__tests__/screens.test.tsx` — solo mock degradado (ver desviaciones).
- `specs/mobile-theme-transition/traceability.md` — tabla completada.

## Desviaciones del design (2)

1. **`renderHook` de RNTL 14 es async** — el design no lo menciona; el test rojo de R1 se corrigió a `await renderHook(...)` en el commit verde `3b915a2`. Sin cambio de contrato.
2. **`screens.test.tsx` también monta el ProfileScreen real** — el design (§Estado del repo) afirmaba que solo `index.test.tsx` monta el screen real, pero el smoke de rutas `src/app/(tabs)/__tests__/screens.test.tsx` lo importa vía la route y el import top-level de `react-native-nitro-modules` lanza en jest. Fix: mismo mock degradado, cero aserciones tocadas (`0735838`).

## Fix post-review — crash de import en Expo Go (2026-08-26)

El humano reportó crash al abrir la app en Expo Go: el import top-level de
`react-native-nitro-modules` lanza `Failed to get NitroModules` cuando el
módulo nativo no existe. La garantía de degradación del README ("applyTheme
runs exactly once in every path") empieza en `withThemeTransition`, **no en el
import del paquete** — el design lo asumía cubierto y R4 quedaba violado en
runtime real (jest lo enmascaraba porque las 3 suites mockean el paquete).

Fix `d603f19` rojo → `4962ea8` verde:
- Test nuevo `theme-transition.degraded.test.tsx` SIN mock del paquete nitro —
  reproduce el crash exacto (suite no cargaba) y fija el contrato R4 real.
- `theme-transition.ts`: require perezoso cacheado con try/catch en el press;
  sin módulo nativo cae a cambio instantáneo + persistencia. Sigue sin
  consultar `isThemeTransitionAvailable`; reduced motion ni resuelve el módulo.
- `./init.sh` completo verde otra vez (móvil 539/539, EXIT=0).

## Notas para el reviewer

- Flake preexistente observado 1 vez bajo carga (primer `./init.sh`, suite completa en paralelo): 3 casos de `R7: cambiar foto` en `index.test.tsx` fallaron por timing de `waitFor`; en re-runs (suite sola y completa) pasan. No tocado: es de #40, no de #43.
- **Pendiente que la sesión implementadora no pudo commitear**: el frontmatter de `specs/mobile-theme-transition/requirements.md` sigue `status: draft` pese al gate humano marcado (commit `3cd9947`); el permiso para editar ese archivo fue denegado por el classifier de esta sesión. Lo debe commitear el leader: `docs(mobile-theme-transition): frontmatter status approved tras gate humano`.
- R6: el humano corre la app en Android (decisión registrada en requirements §Decisión del gate humano) y registra mantener/descartar; smoke Expo Go adicional para R4 (toggle instantáneo sin crash).
