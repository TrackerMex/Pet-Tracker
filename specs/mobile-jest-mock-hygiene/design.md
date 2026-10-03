---
feature: "mobile-jest-mock-hygiene"
status: approved     # draft | approved
tags: [harness, spec, mobile]
---

# Diseño — [[mobile-jest-mock-hygiene]]

> Ver [[requirements]] para los requisitos que este diseño implementa y
> [[../../docs/architecture|architecture]] para las reglas de capas del
> proyecto (no aplican: la feature toca un solo archivo de test). Toda
> referencia a jest-mock es a la copia **29.7.0** que usa el runtime
> (`mobile-pet-tracker/node_modules/jest-runtime/node_modules/jest-mock/build/index.js`),
> no al 30.4.1 hoisted en `node_modules/jest-mock/`.

## Qué se sabe del flake (y qué no)

- Síntoma reportado (única observación, Codex, 2026-08-28): "el mock del
  image picker devolvió `undefined`" en `src/screens/add-pet/index.test.tsx`
  durante `./init.sh`. Sin stack trace conservado.
- Mecanismo que encaja con ese síntoma: `launchImageLibraryAsync` es un
  `jest.fn()` sin implementación; el único `mockResolvedValue` vive dentro
  de un test (línea 217) y `jest.clearAllMocks()` no toca implementaciones.
  Cualquier test que pulse `add-pet-photo` sin haber fijado valor recibe
  `undefined` y `index.tsx:103` lanza `TypeError`. Hoy ningún test lo hace,
  pero el archivo no lo garantiza: es una fuga latente dependiente del orden.
- Lo que NO se ha podido confirmar: que ese mecanismo sea lo que Codex vio.
  Jest ejecuta los tests de un archivo en orden de declaración (sin
  `--randomize`), y el valor de la línea 217 se fija dentro del mismo test
  que lo consume. 0 reproducciones en 13 corridas dirigidas (5 del reviewer
  de #52, 8 del spec_author, 5 de ellas bajo carga concurrente) ni en 3
  suites completas. La hipótesis alternativa (timeout de 1000 ms del
  `waitFor` de RNTL bajo carga) queda registrada en [[requirements]]
  §Fuera de alcance con su disparador de reapertura.
- Consecuencia para el diseño: se cierra la fuga latente (barata, pedida por
  el humano, con test rojo genuino) y se mide "sin flake" con las corridas
  de R2/R3. No se pretende que R2 demuestre causa raíz: es un gate de
  regresión.

## Decisiones técnicas

- **D1 — `beforeEach` local de nivel de archivo, no flag global** (R1):
  un único `beforeEach` fuera de ambos `describe` es el único punto por el
  que pasan los 8 tests del archivo. El patrón ya vive en ese mismo archivo
  (`describe('R6')` fija `mockCreatePet.mockReturnValue(pending())` como
  default en su `beforeEach`, línea 87). No cambia nada compartido por las
  otras 52 suites.

- **D2 — Ningún flag `clearMocks` / `resetMocks` / `restoreMocks`** (R3).
  jest-circus aplica los tres en un `beforeEach` global
  (`node_modules/jest-circus/build/legacy-code-todo-rewrite/jestAdapter.js:48-63`)
  delegando en jest-mock 29.7. Evidencia por flag:

  | Flag | Qué hace en jest-mock 29.7 | ¿Reinicializa el picker (AC1)? | Suites móviles afectadas |
  |---|---|---|---|
  | `clearMocks` | `clearAllMocks()` → `_mockState = new WeakMap()`: borra llamadas/resultados, **conserva** implementaciones y colas `Once` | **No** — el `mockResolvedValue` de la línea 217 sobrevive igual | 0 rotas; redundante con los 58 `jest.clearAllMocks()` manuales de 30 suites |
  | `resetMocks` | `resetAllMocks()` → además `_mockConfigRegistry = new WeakMap()`: borra **toda** implementación, incluidas las de `jest.fn(<impl>)` creadas dentro de factories `jest.mock(...)` (`fn(implementation)` las guarda vía `mockImplementation`, que vive en ese registro) | Sí | **11 suites / 21 sitios** pasarían a devolver `undefined` desde el primer test: `(auth)/__tests__/layout.test.tsx` (`Redirect`, `Stack`), `(tabs)/__tests__/{food,health,home}.test.tsx` (`useIsFocused: jest.fn(() => true)`), `(tabs)/__tests__/layout.test.tsx` (`FloatingTabBar`, `SelectedPetProvider`, `Redirect`, `Tabs`, `Tabs.Screen`), `(tabs)/__tests__/screens.test.tsx` (`useIsFocused`, `withThemeTransition`, `isThemeTransitionAvailable`), `app/__tests__/index.test.tsx` (`Redirect`), `app/__tests__/layout.test.tsx` (`useFonts: jest.fn(() => [true])`), `screens/profile/index.test.tsx` (3), `theme/__tests__/theme-transition.test.tsx` (2), `theme/__tests__/use-theme-colors.test.tsx` (`mockGetCSSVariable`). Re-verificable con `grep -rn "jest\.fn([^)]" mobile-pet-tracker/src --include=*.test.ts --include=*.test.tsx` |
  | `restoreMocks` | `restoreAllMocks()` (línea 958) recorre solo `_spyState`; en 29.7 `_makeComponent` añade ahí únicamente `jest.spyOn`/`replaceProperty` (línea 424-426: `if (typeof restore === 'function')`). Un `jest.fn()` suelto **no** se toca | **No** | Solo las 6 suites con 11 `jest.spyOn`, que ya restauran a mano (4 `jest.restoreAllMocks()`); efecto neto nulo |

  Ningún flag cumple el criterio 1 de aceptación sin romper suites o sin
  ser un no-op; la decisión es local y verificable (R3 exige `git diff`
  vacío sobre `package.json` y `test/`).

- **D3 — Valor por defecto `{ canceled: true, assets: null }`** (R1): es un
  no-op determinista (`index.tsx:103` retorna sin efectos) y el literal ya
  está tipado y compilando en `src/screens/profile/index.test.tsx:449`
  (`ImagePickerCanceledResult`), así que `bun run typecheck` no cambia.

- **D4 — `mockReset()` antes de `mockResolvedValue()`** (R1): `mockReset`
  hace `mockClear()` + `_mockConfigRegistry.delete(f)` (líneas 439-443), lo
  que además vacía cualquier cola `mockResolvedValueOnce` que un test futuro
  deje a medias; el `jest.clearAllMocks()` de los `beforeEach` existentes
  no lo hace. Un método, correcto en el caso borde.

- **D5 — El test de R1 se declara al final del archivo** (R1): Jest corre
  los `describe`/`it` en orden de declaración, así que el nuevo test se
  ejecuta después de `'uploads a chosen preview only after createPet
  succeeds'` (línea 215) y, sin el `beforeEach` de D1, recibe el asset
  fugado: rojo genuino por la fuga, no por un `expect` artificial. Nombre
  del `describe` con la feature entre paréntesis
  (`R1 (mobile-jest-mock-hygiene): ...`) porque el archivo ya usa `R6`/`R7`
  de #46 — precedente en `src/app/(tabs)/__tests__/map.test.tsx:913`.

- **D6 — Cómo se mide "sin flake"** (R2, R3). Desde `mobile-pet-tracker/`:

  ```bash
  for i in $(seq 1 10); do
    bun run test -- src/screens/add-pet/index.test.tsx 2>&1 | grep -E '^Tests:' \
      || { echo "FLAKE en corrida $i"; break; }
  done
  ```

  Equivalente en PowerShell:

  ```powershell
  1..10 | ForEach-Object {
    bun run test -- src/screens/add-pet/index.test.tsx
    if ($LASTEXITCODE -ne 0) { throw "FLAKE en corrida $_" }
  }
  ```

  Las 10 líneas `Tests: 8 passed, 8 total` (o la primera roja, con el
  bloque `●` completo) se pegan en
  `progress/impl_mobile-jest-mock-hygiene.md` §R2. Después, `./init.sh`
  desde la raíz (R3): recoge typecheck, lint y las 53 suites móviles en
  una sola corrida. Línea base medida el 2026-09-03: 53 suites / 612
  tests, 26 s en 4 cores.

- **D7 — La config de jest no se toca y `jest.config.js` no se crea** (R3):
  la config vive en `mobile-pet-tracker/package.json` → `"jest"`. Si
  apareciera un `jest.config.js` junto a ella, Jest aborta con "Multiple
  configurations found". El `files_affected` de `feature_list.json` que
  nombra `jest.config.js` es un hint erróneo, no una instrucción.

## Archivos afectados

- `mobile-pet-tracker/src/screens/add-pet/index.test.tsx` — **único archivo
  de código**: +1 `beforeEach` de nivel de archivo (3 líneas, entre
  `renderAddPet` y `describe('R6: alta de mascota')`) y +1 `describe` R1 al
  final. Capa: tests de la app móvil; la pantalla `index.tsx` no cambia.
- `progress/impl_mobile-jest-mock-hygiene.md` — evidencia de R2 y R3
  (Codex).
- `specs/mobile-jest-mock-hygiene/traceability.md` — Codex la actualiza
  tras cada commit.
- Sin cambios: `mobile-pet-tracker/package.json`,
  `mobile-pet-tracker/test/jest-setup.js`,
  `mobile-pet-tracker/src/screens/add-pet/index.tsx`, cualquier otra suite.

## Alternativas descartadas

- `resetMocks: true`, `restoreMocks: true`, `clearMocks: true`: tabla de D2.
- `beforeEach` global en `test/jest-setup.js`: el mock de
  `expo-image-picker` pertenece al registro de módulos de cada archivo de
  test; desde el setup habría que `jest.mock('expo-image-picker')` para las
  53 suites — cambia el grafo de módulos global para un problema de un
  archivo.
- Helper compartido `test/image-picker-mock.ts` para `add-pet` y `profile`:
  abstracción para dos usuarios de tres líneas. Se reconsidera si una
  tercera suite mockea el picker.
- Default que lanza (`mockImplementation(() => { throw new Error(...) })`)
  para delatar tests que olviden configurar el picker: el rechazo saldría
  del handler `onPress` como unhandled rejection, con peor mensaje que el
  no-op de D3; el test de R1 ya vigila el default.
- Subir `asyncUtilTimeout` de RNTL: sin reproducción no hay rojo; queda
  como candidata en [[requirements]] §Fuera de alcance.
- `--randomize` de Jest para forzar la fuga: altera la ejecución de las 53
  suites para probar una; el test de D5 la prueba de forma determinista.
