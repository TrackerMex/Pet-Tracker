---
feature: "mobile-add-pet-photo-test-flake"
status: approved     # draft | approved
tags: [harness, spec, mobile, tests]
---

# Tareas — [[mobile-add-pet-photo-test-flake]] (#72)

> Disciplina TDD, un bloque por requisito de [[requirements]]. **El orden de los
> bloques importa**: cada rojo necesita que su sujeto ya exista (ver la nota de cada
> uno). Todos los caminos son relativos a `/home/claude/sites/Pet-Tracker/`.
>
> **Antes de empezar** (trabajo móvil, `CLAUDE.md` y `docs/ui-guidelines.md`): cargar
> la skill `expo-overview`. Deriva a una skill de UI solo si hiciera falta tocar
> pantalla — aquí **no se toca ninguna**, así que no hay skill de UI que cargar.
>
> Comandos de test, siempre desde `mobile-pet-tracker/`:
> `bunx jest --runTestsByPath <ruta>` (rutas, `(tabs)` **sin** escapar) o
> `bun run --cwd /home/claude/sites/Pet-Tracker/mobile-pet-tracker test` (suite
> completa). Un filtro **posicional** de jest es regex: ahí `(tabs)` va escapado o el
> fichero se salta en silencio con exit 0. **Nunca medir con pipe.**

---

## R1 — La espera del sitio reproducido termina en el árbol, no en la caché

Sujeto: `src/screens/alerts/index.test.tsx`, `it` `pinta y reintenta cada error de la
primera página` (HEAD `d5f2fcb4`: `:190`; `waitFor` de caché `:201-205`; aserción
síncrona `:206`).

- [ ] **(1) Rojo** — meter **solo la viga**, sin tocar ninguna aserción:
  - `import { defaultScheduler, notifyManager } from '@tanstack/react-query';`
  - `afterEach(() => notifyManager.setScheduler(defaultScheduler));` a nivel de fichero
  - `notifyManager.setScheduler((callback) => setTimeout(callback, 200));` como primera
    sentencia del `it`
  - Añadir el sufijo ` (#72 R1)` al título del `it`, conservando el título actual como
    prefijo.
  - Correr `bunx jest --runTestsByPath src/screens/alerts/index.test.tsx` y **guardar
    la salida**: debe fallar en la aserción de `alerts-error` con
    `Unable to find an element with testID: alerts-error`. Si saliera verde, **subir la
    ventana** (400, 800 ms) hasta que el rojo sea estable y anotar el valor usado; no
    tocar la aserción.
  - Commit: `test(add-pet-photo-test-flake): reproduce the alerts cache-vs-render race on demand (R1)`
- [ ] **(2) Verde** — la espera pasa a terminar en el árbol:
  `expect(await screen.findByTestId('alerts-error')).toHaveTextContent(...)`, o la
  aserción dentro del `waitFor`. **Conservar** el `waitFor` de
  `queryClient.getQueryData(alertKeys.list())` (contrato #78 R4) y las aserciones de
  `className` y de `common.retry` que van detrás.
  - Commit: `fix(add-pet-photo-test-flake): end the alerts wait on the rendered tree (R1)`
- [ ] **(3) Refactor** — verificar que la viga sigue puesta y restaurada (el
  `afterEach` no deja el scheduler retrasado para otros tests del fichero), y que el
  fichero entero pasa: `bunx jest --runTestsByPath src/screens/alerts/index.test.tsx`
  × 5.

---

## R2 — Los otros seis sitios

Sujetos: los seis de la tabla de [[requirements]] §R2 (S2..S7), en cuatro ficheros.
Mutaciones: tabla de [[design]] §Mutaciones.

- [ ] **(1) Rojo** — en un solo commit: los **seis tests corregidos** + las **cinco
  mutaciones de producción**.
  - Aplicar cada corrección de la tabla (S2 y S3 en `alerts`, S4 y S5 en `pairing`,
    S6 borrado en `map`, S7 en `weight-log`), con el sufijo ` (#72 R2)` en el título
    de cada `it` editado.
  - Aplicar las cinco mutaciones de `design.md`.
  - Ejecutar y **guardar la salida** de cada fichero por separado; cada test corregido
    debe fallar **por su propia aserción**, no por un error de compilación.
  - **Prueba de zona ciega, obligatoria para S3, S4 y S5**: con la mutación puesta,
    correr también la versión *anterior* del test (basta `git stash` del cambio de
    test o correr el mismo test con la aserción síncrona restaurada a mano) y
    registrar que **pasa**. Ese contraste —mutación puesta, test viejo verde, test
    nuevo rojo— es la evidencia de que la aserción de ausencia pasaba por el motivo
    equivocado. Si en algún sitio el test viejo también saliera rojo, se anota tal
    cual y se sigue: sigue siendo un candado vivo.
  - Commit: `test(add-pet-photo-test-flake): mutate production to prove the six waits are alive (R2)`
- [ ] **(2) Verde** — **revertir las cinco mutaciones** y nada más. Comprobar:
  ```
  git diff origin/main..HEAD -- mobile-pet-tracker/src/screens/alerts/index.tsx \
    mobile-pet-tracker/src/screens/pairing/index.tsx \
    'mobile-pet-tracker/src/app/(tabs)/weight-log.tsx'
  ```
  **debe salir vacío.** Los cuatro ficheros de test deben pasar.
  - Commit: `fix(add-pet-photo-test-flake): revert the mutations, six waits corrected (R2)`
- [ ] **(3) Refactor** — escribir la regla en `docs/conventions.md` §Tests (subsección
  nueva, en la línea de §Filtros de jest con rutas que llevan paréntesis): la
  condición que termina una espera es la misma observación que hacen las aserciones
  que la siguen; ausencia siempre anclada a una espera positiva. Y pasar el grep de
  títulos editados por `specs/` ([[design]] §D6), actualizando las filas de
  traceability ajenas que citen un título cambiado.

---

## R3 — El mock del picker no se hereda entre tests de profile

Sujeto: `src/screens/profile/index.test.tsx`. El sujeto del rojo **ya existe**: la
implementación persistente que deja `:579` (`{ canceled: false, assets: [{ uri:
'file:///luna.webp' … }] }`) dentro del describe `R7: cambiar foto` (`:516-595`).

- [ ] **(1) Rojo** — añadir, **después** de ese describe (lo natural: al final del
  fichero), un `describe('#72 R3: el mock del picker no hereda implementación entre
  tests')` con un `it('#72 R3: …')` que asevere que la llamada resuelve al valor por
  defecto:
  `await expect(mockLaunchImageLibrary()).resolves.toEqual({ canceled: true, assets: null });`
  (misma forma que `add-pet/index.test.tsx:383-390`). Correr
  `bunx jest --runTestsByPath src/screens/profile/index.test.tsx`: debe fallar
  mostrando el objeto heredado de `:579`. **Si se declara antes del describe R7, el
  rojo no ocurre**: el orden de declaración es el orden de ejecución.
  - Commit: `test(add-pet-photo-test-flake): profile inherits the picker mock between tests (R3)`
- [ ] **(2) Verde** — `beforeEach` de nivel de fichero (después de la captura de
  `:135`) con `mockLaunchImageLibrary.mockReset()` y
  `mockLaunchImageLibrary.mockResolvedValue({ canceled: true, assets: null })`.
  El fichero entero debe pasar.
  - Commit: `fix(add-pet-photo-test-flake): reset and rearm the picker mock per test in profile (R3)`
- [ ] **(3) Refactor** — comprobar que ningún `beforeEach` por describe de ese fichero
  queda redundante o en conflicto (los `jest.clearAllMocks()` se quedan), y que los
  tests de `R7: cambiar foto` siguen verdes con sus armados propios.

---

## R4 — El próximo rojo de add-pet nombra el invariante roto

Sujeto: `src/screens/add-pet/index.test.tsx`. Pulsaciones del picker en `:144`, `:150`
(describe `R2:`) y `:355` (describe `R7: foto opcional tras alta` › `uploads a chosen
preview only after createPet succeeds`).

- [ ] **(1) Rojo** — en el **mismo commit**, para que el rojo no sea un
  `ReferenceError` (prohibido por C4):
  - el helper `async function pressPickPhoto(): Promise<void>` **sin** la comprobación
    de invariante: solo
    `await fireEvent.press(screen.getByTestId('add-pet-photo'));`
  - el self-test `describe('#72 R4: el fallo del picker nombra el invariante roto')`
    con un `it('#72 R4: …')` que renderiza el formulario, desarma el mock con
    `mockLaunchImageLibrary.mockReset()` y asevera
    `await expect(pressPickPhoto()).rejects.toThrow(/PICKER_MOCK_UNARMED/)`.
  - Correr `bunx jest --runTestsByPath src/screens/add-pet/index.test.tsx`: el
    self-test falla por su propia aserción (recibe una promesa **resuelta**, o el
    `TypeError` del componente). **Guardar la salida.**
  - Commit: `test(add-pet-photo-test-flake): the picker failure must name the broken invariant (R4)`
- [ ] **(2) Verde** — meter la comprobación en el helper, **antes** del `press`:
  si `mockLaunchImageLibrary.getMockImplementation() === undefined`, lanzar
  `new Error('PICKER_MOCK_UNARMED: …')` con el nombre del símbolo
  (`launchImageLibraryAsync`) y el puntero al rearme que debería estar vigente
  (`beforeEach` raíz de `add-pet/index.test.tsx`). Sustituir las **tres** pulsaciones
  de `:144`, `:150` y `:355` por `await pressPickPhoto();`. El fichero entero debe
  pasar.
  - Commit: `fix(add-pet-photo-test-flake): assert the picker mock is armed before the press (R4)`
- [ ] **(3) Refactor** — quitar `, { virtual: true }` de la línea del
  `jest.mock('expo-image-picker', …)` (HEAD: `:22`). Es **reducción de superficie, no
  el arreglo del flake**: no se menciona como arreglo en ningún commit ni reporte. Si
  la suite dejara de resolver el módulo, revertir esa línea y anotarlo.
  - Commit: `refactor(add-pet-photo-test-flake): drop the virtual flag from the picker mock`

---

## Verificación final (Protocolo V de [[requirements]])

- [ ] **V0** — `bunx jest --listTests | wc -l` → anotar S.
- [ ] **V1** — 5 corridas por fichero de los cinco tocados (`--runTestsByPath`).
- [ ] **V2** — 20 corridas de la suite móvil (10 con `/tmp/jest_ru/perf-cache-*`
      borrada antes de cada una, 10 en caliente), sin pipes, con el exit code y el
      `Test Suites: … N total` de cada una anotados. N debe ser igual a S en las 20.
- [ ] **V3** — `./init.sh` una vez desde la raíz, tras comprobar con `pgrep` que no
      hay otro gate en vuelo. Sin pipes.
- [ ] Rellenar [[traceability]] (ninguna fila "pendiente") y escribir
      `progress/impl_mobile-add-pet-photo-test-flake.md` con: la tabla de mutaciones y
      sus rojos, las dos corridas de la prueba de zona ciega de S3/S4/S5, y las tablas
      de V1/V2/V3. **El contenido va al fichero, no al chat.**
