---
feature: "mobile-jest-mock-hygiene"
status: draft        # draft | approved
tags: [harness, spec, mobile]
---

# Requisitos — [[mobile-jest-mock-hygiene]]

> Notación EARS. Cada requisito tiene id único R<n>, inmutable una vez
> aprobado. Ver [[design]] (D1–D7) para las decisiones y la evidencia que
> las sostiene. Aplican `docs/conventions.md` (§Convenciones de la app
> móvil: tests que nombran su R-id, commit `<tipo>(<scope>): <desc> (R<n>)`)
> y `docs/ui-guidelines.md` (C8) solo como "sin regresión": la feature no
> crea ni modifica pantallas, componentes ni estilos — toca **un único
> archivo de test**. `docs/architecture.md` (C3) no entra en juego.
>
> Todo el §Contexto fijo se verificó el 2026-09-03 leyendo el código real y
> `mobile-pet-tracker/node_modules/` (Expo SDK 57.0.14, jest 29.7.0,
> jest-expo 57.0.4, @testing-library/react-native 14.0.1, jest-mock 29.7.0
> — el que usa el runtime, anidado en
> `node_modules/jest-runtime/node_modules/jest-mock/`; el `jest-mock`
> 30.4.1 hoisted en `node_modules/jest-mock/` NO es el que corre).

## Contexto fijo (verificado 2026-09-03)

- **Dónde vive la config de jest móvil**: bloque `"jest"` de
  `mobile-pet-tracker/package.json` (preset `jest-expo`,
  `transformIgnorePatterns`, `moduleNameMapper`, `setupFilesAfterEnv:
  ["<rootDir>/test/jest-setup.js"]`). **No existe
  `mobile-pet-tracker/jest.config.js`**: `feature_list.json` lo lista en
  `files_affected` por error. Ningún flag `clearMocks` / `resetMocks` /
  `restoreMocks` está declarado.
- **La suite**: `mobile-pet-tracker/src/screens/add-pet/index.test.tsx`,
  7 tests en dos `describe` (`R6: alta de mascota`, `R7: foto opcional tras
  alta`, R-ids de `mobile-pets-profile` #46). El mock del picker se declara
  en las líneas 18-20 (`jest.mock('expo-image-picker', () => ({
  launchImageLibraryAsync: jest.fn() }), { virtual: true })`), su handle es
  `mockLaunchImageLibrary` (línea 56) y el **único** `mockResolvedValue`
  está en la línea 217, dentro del test `'uploads a chosen preview only
  after createPet succeeds'` (línea 215). Los dos `describe` llaman
  `jest.clearAllMocks()` en su `beforeEach` (líneas 78 y 204); en jest-mock
  29.7 `clearAllMocks()` vacía solo `_mockState` (llamadas/resultados) y
  **conserva las implementaciones**, así que el valor de la línea 217
  sobrevive a cualquier test posterior. Ningún test fija un valor por
  defecto al picker.
- **El consumidor**: `mobile-pet-tracker/src/screens/add-pet/index.tsx:99`
  `const picked = await ImagePicker.launchImageLibraryAsync(...)` y línea
  103 `if (picked.canceled || !picked.assets[0]) return;` — con el mock sin
  valor, `picked` es `undefined` y la línea 103 lanza `TypeError: Cannot
  read properties of undefined (reading 'canceled')`.
- **El flake**: una sola observación, de Codex el 2026-08-28 en la primera
  corrida final de `./init.sh` de #52 (`progress/impl_android-maps-api-key.md`
  líneas 59-63: "el mock del image picker devolvió `undefined`"); el stack
  trace no se conservó. El reviewer de #52 (§4 de
  `progress/review_android-maps-api-key.md`) lo declaró preexistente y no
  lo reprodujo (5/5 corridas dirigidas, `init.sh` verde). El 2026-09-03
  tampoco reprodujo: 3 corridas aisladas (4.1-4.2 s cada una), 5 corridas
  concurrentes con la suite móvil completa en la misma máquina de 4 cores,
  y la suite completa en verde (53 suites / 612 tests, 26 s).
- **Inventario de mocks de las 53 suites móviles** (base de la decisión D2
  de [[design]]): 0 implementaciones fijadas a nivel de módulo fuera de
  factories; 21 `jest.fn(<impl>)` **dentro de factories `jest.mock(...)`**
  en 11 suites (las que `resetMocks` dejaría devolviendo `undefined`); 11
  `jest.spyOn` en 6 suites; 58 `jest.clearAllMocks()` en 30 suites; 0
  `jest.resetAllMocks()`; 4 `jest.restoreAllMocks()`.

## Requisitos funcionales

- **R1**: WHEN arranca cualquier test de
  `mobile-pet-tracker/src/screens/add-pet/index.test.tsx` THE SYSTEM SHALL
  haber reinicializado el mock `launchImageLibraryAsync` de
  `expo-image-picker` mediante **un único `beforeEach` de nivel de archivo**
  (declarado antes de `describe('R6: alta de mascota')`) que ejecuta, en
  este orden, `mockLaunchImageLibrary.mockReset()` y
  `mockLaunchImageLibrary.mockResolvedValue({ canceled: true, assets: null })`,
  de modo que al empezar cada test (a) `mockLaunchImageLibrary.mock.calls`
  está vacío y (b) una llamada sin configuración previa resuelve a
  `{ canceled: true, assets: null }` — nunca a `undefined` ni a un valor
  fijado por un test anterior. El test `'uploads a chosen preview only
  after createPet succeeds'` conserva intacta su `mockResolvedValue(...)`
  de la línea 217 como override por test; los 7 tests existentes no cambian.
  **Test**: `src/screens/add-pet/index.test.tsx::R1 (mobile-jest-mock-hygiene):
  el mock del picker se reinicializa por test` — `describe` nuevo declarado
  **al final del archivo**, después de `describe('R7: foto opcional tras
  alta')`, con un único `it` que, sin configurar nada, llama
  `mockLaunchImageLibrary()` y afirma
  `await expect(mockLaunchImageLibrary()).resolves.toEqual({ canceled: true, assets: null })`
  y `expect(mockLaunchImageLibrary).toHaveBeenCalledTimes(1)`. Rojo antes
  del cambio (recibe el asset `file:///new-pet.jpg` que fuga del test de la
  línea 215 y cuenta 2 llamadas); verde después.

- **R2**: WHEN se ejecuta 10 veces seguidas
  `bun run test -- src/screens/add-pet/index.test.tsx` desde
  `mobile-pet-tracker/` (bucle literal en [[design]] D6) THE SYSTEM SHALL
  terminar las 10 corridas con exit 0 y `Tests: 8 passed, 8 total`
  (7 previos + el de R1), sin ningún `failed`. Sin test propio: la
  evidencia son las 10 líneas `Tests:` copiadas en
  `progress/impl_mobile-jest-mock-hygiene.md` §R2. Una sola corrida roja
  invalida el requisito y se reporta con la salida completa de jest (el
  bloque `●` entero), nunca resumida.

- **R3**: WHEN se ejecuta `./init.sh` desde la raíz del repo con R1 en
  verde THE SYSTEM SHALL terminar con exit 0, con la etapa móvil en
  `Test Suites: 53 passed, 53 total` y `Tests: 613 passed, 613 total`
  (612 medidos el 2026-09-03 en esta branch + 1 de R1; si `origin/main`
  movió el conteo antes de implementar, el criterio es: mismo número de
  suites que `origin/main`, +1 test, 0 `failed`), y con
  `git diff origin/main -- mobile-pet-tracker/package.json mobile-pet-tracker/test/`
  **vacío**: la config de jest no cambia (ningún flag `clearMocks` /
  `resetMocks` / `restoreMocks`, ningún `jest.config.js` nuevo, ningún
  cambio en `test/jest-setup.js`). Sin test propio: evidencia (líneas
  `Test Suites:`/`Tests:` de la etapa móvil y el `git diff` vacío) en
  `progress/impl_mobile-jest-mock-hygiene.md` §R3.

## Fuera de alcance

- Activar cualquier flag global de jest (`clearMocks`, `resetMocks`,
  `restoreMocks`): decidido en contra con evidencia en [[design]] D2.
- `src/screens/profile/index.test.tsx` y
  `src/app/(tabs)/__tests__/screens.test.tsx`: mockean el mismo
  `launchImageLibraryAsync` con el mismo patrón (valor fijado por test, sin
  default). No tienen flake registrado; se alinean con R1 cuando una feature
  toque esas suites (`docs/conventions.md`: nada se migra en frío).
- Retirar los 58 `jest.clearAllMocks()` manuales: sin flag global que los
  sustituya, siguen siendo necesarios.
- La opción `{ virtual: true }` del `jest.mock('expo-image-picker', ...)`:
  el paquete está instalado, la opción es inocua y no es la causa; no se
  toca.
- Causa raíz alternativa **no descartada**: el `waitFor` de RNTL usa
  `asyncUtilTimeout: 1000` ms
  (`node_modules/@testing-library/react-native/dist/config.js:15`); bajo
  carga de CPU en `./init.sh`, el `waitFor` de las líneas 237-241
  (`pet-avatar.props.photoUrl`) puede agotar el segundo y fallar con
  `Received: undefined`, síntoma compatible con la nota de Codex. Sin
  reproducción no hay test rojo, así que no se toca aquí. Si el flake
  reaparece con R1 en su sitio, capturar la salida completa de jest en
  `progress/` y abrir feature nueva (candidata: subir `asyncUtilTimeout`
  con `configure()` de RNTL en `test/jest-setup.js`).
- Flake e2e de `health-vaccines` (observación 3 del reviewer de #55):
  backend, sin relación.
- Corregir el hint `files_affected` de `feature_list.json` (`jest.config.js`
  no existe): bookkeeping del leader, no de esta implementación.

## Aprobación

- [X] Aprobado por humano (fecha: 2026-09-03) ← gate obligatorio antes de implementar
