# Implementación — mobile-figma-polish (#46)

- Fecha: 2026-08-23
- Branch: `feature/46-mobile-figma-polish`
- Alcance de Codex: R1–R11 y gate automatizado de R12
- Estado: R1–R11 implementados y verificados; el smoke visual lado a lado de
  R12 queda reservado al humano.

## Resultado

- `global.css` contiene el mapeo light exacto de la spec y una paleta dark
  derivada del diseño, sin copiar los valores `oklch` del Make.
- Se añadieron los cinco `.ttf` estáticos oficiales de Inter y el layout raíz
  los registra mediante `expo-font` sin bloquear el primer render.
- La pill flotante conserva su contenedor, posición, márgenes, radio y sombras;
  R4 solo ajusta tipografía y tokens de los labels.
- WeightChart conserva sus datos, escalado y degradación para menos de dos
  puntos; su área usa el único `LinearGradient` permitido, desde
  `react-native-svg`.
- Home, Map, Health, Weight log, Profile y las tres pantallas auth recibieron
  únicamente jerarquía visual, superficies, bordes, radios, tipografía e iconos
  basados en tokens.
- No se añadieron dependencias, recursos AWS, navegación, llamadas API ni
  cambios de estado. Tampoco se añadió motion ornamental.

## Evidencia TDD y commits

R1–R3 siguieron TDD por lectura: cada test rojo se ejecutó contra el estado
anterior y terminó con exit 1; después de la implementación, el test focalizado
terminó con exit 0. R4–R11 usaron las suites existentes sin modificar asserts.

| R-id | Commit rojo | Commit de implementación |
|---|---|---|
| R1 | `9e27a80` | `04aef32 feat(mobile-figma-polish): map light design tokens (R1)` |
| R2 | `bef097f` | `80ba96b feat(mobile-figma-polish): derive dark design palette (R2)` |
| R3 | `bed689e` | `e7a8890 feat(mobile-figma-polish): load static Inter fonts (R3)` |
| R4 | No aplica | `b9283f4 feat(mobile-figma-polish): retokenize floating tab labels (R4)` |
| R5 | No aplica | `0326dd6 feat(mobile-figma-polish): polish weight chart area (R5)` |
| R6 | No aplica | `2fd27a3 feat(mobile-figma-polish): polish home dashboard (R6)` |
| R7 | No aplica | `7b491d3 feat(mobile-figma-polish): polish map status overlay (R7)` |
| R8 | No aplica | `e912b5e feat(mobile-figma-polish): polish health hub (R8)` |
| R9 | No aplica | `13bcfa0 feat(mobile-figma-polish): polish weight log (R9)` |
| R10 | No aplica | `41f25df feat(mobile-figma-polish): polish profile settings (R10)` |
| R11 | No aplica | `ab5f2e7 feat(mobile-figma-polish): polish authentication forms (R11)` |

Cada fila R1–R11 se actualizó además en
`specs/mobile-figma-polish/traceability.md` mediante un commit docs separado.

## Comandos ejecutados y exit codes

- `./init.sh` antes de implementar: exit 0 (baseline móvil: 25 suites, 270
  tests).
- Tests focalizados de R1–R3: rojo exit 1 y verde exit 0 en cada ciclo.
- Suites focalizadas de R4–R11: exit 0, sin cambios en tests existentes.
- `bun run typecheck` desde `mobile-pet-tracker/`: exit 0.
- `bun run lint` desde `mobile-pet-tracker/`: exit 0.
- `bun run test -- --runInBand` desde `mobile-pet-tracker/`: exit 0; 27 suites,
  275 tests.
- Auditoría automática de `testID` y copy JSX estático contra `7c77f41`:
  exit 0; multisets idénticos en todos los archivos de R4–R11.
- Diff de `__tests__/` contra `7c77f41`: exit 0; solo aparecen los dos archivos
  nuevos de R1–R3.
- Diff de backend, infra, workflows, API, hooks, providers, manifests y locks
  contra `7c77f41`: exit 0; salida vacía.
- Búsqueda de colores literales (`hex`, `rgba`, `oklch`) en componentes y
  pantallas tocados: exit 1 esperado de `rg`; sin coincidencias.
- `git diff --check`: exit 0.
- `./init.sh` final: exit 0 y mensaje `Todo verde`.
  - backend: 143 suites, 1111 tests;
  - infra: 2 suites, 14 tests;
  - harness env drift: 11 suites, 28 tests;
  - móvil: 27 suites, 275 tests;
  - build, lint y typecheck: verdes.

Los e2e se omitieron automáticamente porque LocalStack no respondía en el
puerto 4566. La feature no crea ni requiere recursos AWS. Jest conserva los
avisos conocidos del test renderer de Uniwind/HeroUI y SVG; no son errores de
lint ni causan fallos.

## Desviaciones y decisiones

- R8 describe un contador calculado de días dentro del tile de próxima vacuna.
  No se añadió porque habría introducido cálculo y copy visibles nuevos, en
  conflicto con la invariante explícita de cero conducta y cero textos nuevos.
  El tile usa un glifo de jeringa y conserva exactamente `Next due`, el nombre y
  la fecha actuales.
- No se copiaron heros, fotos, gradientes ni strings del Make. Se respetó la
  decisión humana de conservar la pill flotante.
- No se ejecutó el smoke humano lado a lado; por ello R12 y la feature se
  mantienen en `in_progress` hasta el review visual.

## Estado del worktree

Se preservaron y excluyeron de todos los commits los cambios locales
preexistentes en `.gitignore`, `init.sh`, `init.config.sh`, `.agents/`, skills,
`skills-lock.json` y los informes de review de otras features.
