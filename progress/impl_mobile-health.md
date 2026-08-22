# Implementación — mobile-health (#37)

- Fecha: 2026-08-22
- Branch: `feature/37-mobile-health`
- Alcance de Codex: R1–R12
- Estado: R1–R12 implementados y verificados; R13 queda reservado al smoke
  humano en Expo Go.

## Resultado

- Se añadió el cliente móvil tipado para listar vacunas, listar pesos y crear
  pesos, con `fetchFn` y token recibidos por parámetro y respuestas discriminadas
  por `kind`.
- `postJson` centraliza los POST JSON sin introducir imports de React ni de
  `expo-secure-store` bajo `src/api/`.
- Health se reescribió como hub de la mascota seleccionada: resuelve los estados
  de pets, destaca la próxima vacuna, identifica vacunas vencidas y enlaza al
  historial de peso.
- WeightLog incorpora historial, estados de error/reintento, gráfica SVG con
  degradación para menos de dos puntos y alta inline. Tras crear un peso usa el
  `refetch()` local de la lista.
- Profile aloja ahora la sección App con theme toggle y backend health-check;
  los testIDs son `backend-health-state` y `backend-health-retry`. Los casos
  heredados de título y `profile-sign-out` permanecen intactos y verdes.
- No se añadieron dependencias ni recursos AWS.

## Evidencia TDD y commits

Cada test rojo se ejecutó contra el estado anterior y terminó con exit 1 por la
conducta ausente; después del commit verde, el test focalizado terminó con exit
0. Los commits aparecen en este mismo orden en la rama.

| R-id | Commit rojo | Commit verde / implementación |
|---|---|---|
| R1 | `32ffc06` | `c43f2b9` |
| R2 | `1103d9f` | `7fa0bcb` |
| R3 | `1a18307` | `3b1ebab` |
| R4 | `01780b2` | `149f6d9` |
| R5 | `0e42a5e` | `6802912` |
| R6 | `79cecb4` | `ca1a15c` |
| R7 | `bfb17d1` | `dbd5141` |
| R8 | `732a5a4` | `c542020` |
| R9 | `1114ae1` | `6cf3874` |
| R10 | `de12228` | `00f075b` |
| R11 | No aplica: gate estático | `8614c15` |
| R12 | No aplica: gate de contención | `1ebd4a3` |

R10 aplica exactamente la excepción C4 aprobada: la cobertura antigua de
health-check y theme toggle se trasladó a `profile.test.tsx` antes de modificar
Profile. `screens.test.tsx` no se tocó y permanece verde.

## Comandos ejecutados y exit codes

- `./init.sh` antes de implementar: exit 0 (móvil: 21 suites, 193 tests).
- Tests focalizados R1–R10 mediante Jest: rojo exit 1 y verde exit 0 en cada
  ciclo; los hashes están en la tabla anterior.
- `bun run typecheck` desde `mobile-pet-tracker/`: exit 0.
- `bun run lint` desde `mobile-pet-tracker/`: exit 0, sin warnings de ESLint.
- `bun run test` desde `mobile-pet-tracker/`: exit 0; 25 suites y 270 tests.
- `git diff --name-only main...HEAD -- backend-pet-tracker infra init.config.sh .github/workflows/ci.yml`:
  exit 0, salida vacía.
- Diff de manifests y locks contra `main...HEAD`: exit 0, salida vacía.
- Búsqueda de `expo-secure-store` e imports de React bajo
  `mobile-pet-tracker/src/api/`: exit 1 esperado de `grep`, sin coincidencias.
- `git diff --check`: exit 0.
- `./init.sh` final: exit 0 y mensaje `Todo verde`.
  - backend: 143 suites, 1111 tests;
  - infra: 2 suites, 14 tests;
  - harness env drift: 11 suites, 28 tests;
  - móvil: 25 suites, 270 tests;
  - build, lint y typecheck: verdes.

Los e2e se omitieron automáticamente porque LocalStack no respondía en el
puerto 4566; la feature móvil no crea ni requiere recursos AWS reales.

## Desviaciones de la spec

No hubo desviaciones funcionales.

- No se modificó `_layout.tsx`: el tab bar existente solo renderiza sus rutas
  declaradas y `weight-log` queda accesible por navegación sin aparecer como tab,
  tal como permite D10.
- Expo tenía su declaración ignorada de typed routes desactualizada; se regeneró
  `.expo/types/router.d.ts` para validar `/weight-log`. El archivo es caché
  ignorada y no forma parte del diff ni de los commits.
- La suite completa conserva avisos de consola ya existentes de HeroUI/Uniwind
  en el entorno Jest; no son warnings de lint y los 270 tests pasan.

## Pendiente humano

- R13 no se ejecutó ni se marcó. El humano debe completar el smoke descrito en
  `specs/mobile-health/requirements.md` usando Expo Go.
- La feature permanece `in_progress`; el siguiente paso es el review y el smoke
  humano antes de marcarla `done`.

## Estado del worktree

Se preservaron y excluyeron de todos los commits los cambios locales
preexistentes en `.gitignore`, `init.sh`, `init.config.sh`, `.agents/`, skills,
`skills-lock.json` y los informes de review de otras features.
