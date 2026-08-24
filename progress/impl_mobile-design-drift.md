# Implementación — mobile-design-drift (#47)

- Fecha: 2026-08-24
- Branch: `feature/47-mobile-design-drift`
- Alcance de Codex: R1–R8
- Estado: R1–R8 implementados, trazados y verificados; feature conservada en
  `in_progress` hasta el review humano.

## Resultado

- `src/theme/global.css` define `--radius-card: 20px` y `--text-2xs: 10px`
  dentro de `@theme`. No se hereda ni se redefine el `--radius` base de
  HeroUI/Uniwind.
- `src/components/card.tsx` expone las recetas `surface`, `accent` y
  `secondary`, fusiona overrides con `twMerge` y usa `Pressable` accesible
  cuando recibe `onPress`.
- Home, Food, MealSchedule, Health, WeightLog, Profile y Map adoptan el Card
  compartido en las superficies auditadas. Las cards explícitamente fuera de
  alcance conservan HeroUI o su receta previa.
- Las 15 ocurrencias de `text-[10px]` se sustituyeron por `text-2xs`; no quedan
  ocurrencias de `rounded-[20px]` ni `text-[10px]` en código de producción.
- Health y WeightLog aplican `paddingTop: insets.top + 12`; Profile usa un
  `ScrollView` con la convención completa; el overlay vacío del mapa usa el
  mismo offset y expone `map-empty-overlay`.
- Los loadings de Health, WeightLog y Map conservan sus testIDs y ahora usan
  Skeletons dimensionados (`h-12`, `h-40` y `flex-1`).

## Evidencia TDD y commits

Cada test rojo se ejecutó con exit 1 y se committeó antes de su implementación
verde. Tras cada requisito se actualizó la tabla de trazabilidad en un commit
docs separado.

| R-id | Commit rojo | Commit(s) verde(s) |
|---|---|---|
| R1 | `e58b610` | `3e38258` |
| R2 | `cbd0091` | `b64fdf9` |
| R3 | `63f9711`, ajuste type-safe `42d4e25` | `0b442ef`, `84331de`, `7e490a0`, `9b8ae47`, `4da49ca`, `cf8ae44`, `12870d3` |
| R4 | `5117941` | `a3899b2` |
| R5 | `a7b4ce6` | `3af19b8` |
| R6 | `4ffd3dc` | `daadeaf` |
| R7 | `24ff9a5` | `25da57e` |
| R8 | `81bfec8` | `ebc1b15` |

`specs/mobile-design-drift/traceability.md` no contiene filas pendientes. El
frontmatter de `requirements.md` se alineó a `approved`, acorde con la
aprobación humana ya registrada en `60296fa`.

## Verificación

- Suite móvil completa: `bun run test --runInBand --silent`, exit 0; 34 suites
  y 379 tests verdes.
- `bun run typecheck`: exit 0.
- `bun run lint`: exit 0.
- Greps de `rounded-[20px]` y `text-[10px]` bajo `src/`, excluyendo tests:
  sin resultados.
- `git diff --check 26641f6..HEAD`: exit 0.
- Contención desde el handoff: diff vacío en backend, infraestructura,
  workflows, scripts del harness, manifests y locks; no hay dependencias ni
  recursos AWS nuevos.
- `./init.sh` final: exit 0, `Todo verde`.
  - backend: 143 suites, 1111 tests;
  - infraestructura: 2 suites, 14 tests;
  - harness env drift: 11 suites, 28 tests;
  - móvil: 34 suites, 379 tests;
  - e2e: 20 suites y 319 tests verdes; 2 suites/6 tests omitidos;
  - build, lint y typecheck: verdes.

La primera ejecución de bootstrap creó el `.env` local desde el ejemplo con
Postgres en 5432, ocupado por otra instancia. Se corrigió únicamente el `.env`
ignorado para apuntar al contenedor de este worktree en 5433; no produjo diff
versionado. Los avisos conocidos de HeroUI/Uniwind, SVG y Node/AWS SDK no
causaron fallos.

## Verificación visual y pendiente humano

Se intentó el smoke con Expo Web y `terminal-browser`. Metro devolvió 500 antes
de montar la app por la incompatibilidad preexistente de `react-native-maps`
con React Native Web: `codegenNativeComponent is not a function`. Corregir o
mockear Maps sería un cambio fuera de alcance.

El radio queda cubierto automáticamente por el token explícito de 20 px, las
recetas exactas del Card y el guard que prohíbe `rounded-[20px]`; la inspección
visual en Android/iOS debe hacerla el reviewer. No se afirma un smoke visual
que no pudo ejecutarse.

## Estado de entrega

- La feature sigue `in_progress`: el reviewer es quien determina `done`.
- No se abrió PR, conforme al handoff.
- No se hizo push.
