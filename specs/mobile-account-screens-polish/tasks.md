---
feature: "mobile-account-screens-polish"
status: spec_ready   # draft | spec_ready | approved
tags: [mobile, ui, spec]
---

# Tareas — [[mobile-account-screens-polish]] (#172)

> Base congelada `b7284682`. Requisitos en [requirements.md](requirements.md) y
> diseño en [design.md](design.md). Cada R tiene un bloque (1) test rojo,
> (2) implementación mínima y (3) refactor. Lo que asevera cada `it` está en su
> R de requirements.md; aquí van el orden, los ficheros, los rojos esperados y
> los gates.
>
> Excepciones declaradas, cada una con su sonda de mutación:
> - nacen verdes R15 (c31), las filas de uso de R16 (c32) y R17 (c33);
> - en c21 nacen verdes `#172 R10: sin errores ningún campo pinta mensaje` y
>   `#172 R10: los siete campos del registro marcan isInvalid`;
> - en c29 nace verde el cambio del helper `lockTile()`.

---

## Preámbulo (vale para todas las tareas)

- **Directorio.** Todos los comandos se lanzan desde `mobile-pet-tracker/`, y
  el primero de cada bloque es `cd mobile-pet-tracker`. Las rutas `../docs/` y
  `../specs/` salen de ahí. Si un comando falla por directorio
  (`Cannot find module`, `ENOENT` de `package.json`,
  `ERR_PNPM_RECURSIVE_EXEC_NO_PACKAGE`), es un error de invocación: repite con
  el `cd` y no toques código.
- **Herramientas.** Solo `bunx` y `bun run`, nunca `npx` ni `npm`. Ninguna
  dependencia nueva: `package.json` y `bun.lock` no cambian.
- **Prohibido.** No ejecutes `./init.sh` ni `bunx jest` sin rutas: hay otras
  sesiones con Jest en la misma máquina. La suite entera la corre el leader.
- **Jest.**
  - Se corre siempre con
    `J="bunx jest --testTimeout=30000 --runTestsByPath"`, seguido de las rutas.
  - Las rutas con paréntesis van entre comillas simples, por ejemplo
    `'src/app/(tabs)/__tests__/food.test.tsx'`. Sin comillas, `(tabs)` es una
    regex y Jest salta el fichero con exit 0.
  - Si sale `Exceeded timeout`, repite ese fichero solo una vez: es carga de
    otra sesión. Si se repite, PARA.
- **Variables.**
  - Ficheros de producción para los greps:
    `PROD="--include=*.ts --include=*.tsx --exclude=*.test.ts --exclude=*.test.tsx --exclude-dir=__tests__"`.
  - Guardas globales que corren en todo gate verde:
    `GUARDAS="src/__tests__/ui-language.test.ts src/__tests__/design-drift.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/legibility-classnames.test.ts"`.
  - Lectores de la carta `docs/ui-guidelines.md`, que corren en el gate de c35
    y en T20:
    `READERS="src/theme/__tests__/motion.test.ts 'src/app/(tabs)/__tests__/food.test.tsx' src/__tests__/hero-header-amendments.test.ts src/screens/welcome/index.test.tsx"`.
    `consistency-classnames`, `design-drift` y `ui-language` también la leen,
    y ya van en `GUARDAS`.
- **Commits.**
  - El rojo es `test(mobile): <qué> (Rn)` y el verde `feat(mobile): <qué>
    (Rn)`, en commits separados y en ese orden. El de la carta es
    `docs(ui): … (R18)`.
  - El rojo solo trae tests y candados; el verde, la implementación.
  - Antes de cada commit, `git branch --show-current` debe dar
    `feature/172-mobile-account-screens-polish`.
  - `git add` siempre con rutas explícitas, nunca `-A` ni `.`. Tras cada
    commit, `git status --short` sale vacío.
- **Gate del rojo.** `$J <ficheros del commit>; echo "exit=$?"` debe dar
  `exit=1`, con exactamente los rojos de su tabla: ni uno más ni uno menos, y
  el resto de cada fichero en verde.
- **Gate del verde.** Los tres pasos tienen que pasar:
  1. `$J <ficheros del commit> $GUARDAS; echo "exit=$?"` → `exit=0`.
  2. `bun run typecheck; echo "exit=$?"` → `exit=0`.
  3. `bunx expo lint --no-cache > /tmp/lint-172.log 2>&1; echo "exit=$?"; test ! -s /tmp/lint-172.log; echo "vacio=$?"`
     → `exit=0` y `vacio=0`. Un log con `Failed to run` es un SIGKILL por
     memoria: repite una vez.
- **Prettier no se ejecuta.** Formatea a mano con el estilo del fichero
  vecino: dos espacios, comillas simples en TS y comas finales.
- **Tests.**
  - `await render(...)`, `await fireEvent.<x>(...)` y `await act(...)`
    siempre: RNTL 14 los hace asíncronos.
  - Timers falsos solo en `pingo-float.test.tsx`, con `jest.useFakeTimers()`
    en `beforeEach` y `jest.useRealTimers()` en `afterEach`.
  - Los comentarios de trazabilidad son `// #172 Rn`. Un `#172` suelto casa
    con `HEX_LITERAL`.
  - Nada de clases arbitrarias (`algo-[...]`) en tests: C8 también escanea
    tests.
  - `within(x)` busca en los descendientes de `x`, no en `x`.
  - Los estilos se aseveran con `toEqual` del objeto completo.
  - Las esperas siguen `docs/conventions.md` §Tests: `waitFor` o `findBy*`
    con la aserción dentro. Nunca se espera a un contador de mock para
    consultar el árbol después.
- **Rojos por consulta o por aserción.** En cada tabla de rojos:
  - «consulta» significa que el `it` cae en un `getBy*` o `findBy*` porque el
    nodo aún no existe;
  - «aserción» significa que el nodo existe pero el valor es otro;
  - «módulo» significa que la suite no arranca por `Cannot find module`.

  Si un rojo sale de otro tipo que el de la tabla, PARA y reporta.
- **Sonda de mutación.** Siempre en este orden, y nunca se commitea:
  1. Se planta la mutación en **producción** (o en la carta, solo S18).
  2. Se corre solo el fichero o los ficheros que nombra la sonda. El rojo
     tiene que ser el esperado.
  3. Se revierte con `git checkout HEAD -- <fichero>`.
  4. Se comprueba `git diff --quiet HEAD -- <fichero>; echo "exit=$?"` →
     `exit=0`.

---

## Cuentas de `it` (acumuladas)

- Se cuentan con `grep -cE '^\s*it(\.each)?[(<]' <fichero>`, y un `it.each`
  cuenta como uno.
- El total de cada commit es el anterior más los `it` añadidos. Un `it` que
  sustituye a otro añade 0.
- Si H0 mide otra base, se aplica el mismo delta.

| Fichero | Base | Commit | Añade | Total |
|---|---|---|---|---|
| `src/theme/__tests__/global-css.test.ts` | 30 | c1 (R1) | 1 | 31 |
| `src/providers/__tests__/language-provider.test.tsx` | 17 | c3 (R16) | 1 | 18 |
| `src/components/__tests__/back-button.test.tsx` (nuevo) | 0 | c5 (R2) | 5 | 5 |
| `src/components/__tests__/pingo-float.test.tsx` (nuevo) | 0 | c7 (R4) | 3 | 3 |
| `src/screens/register/index.test.tsx` | 21 | c9 (R5) | 1 | 22 |
| | | c11 (R3) | 1 | 23 |
| | | c21 (R10) | 2 | 25 |
| | | c23 (R11) | 1 | 26 |
| | | c25 (R12) | 2 | 28 |
| `src/screens/forgot/index.test.tsx` | 28 | c9 (R5) | 1 | 29 |
| | | c11 (R3) | 2 | 31 |
| | | c17 (R9) | 1 | 32 |
| | | c29 (R14) | 1 | 33 |
| `src/screens/reset-password/index.test.tsx` | 27 | c9 (R5) | 1 | 28 |
| | | c27 (R13) | 1 | 29 |
| `src/screens/login/index.test.tsx` | 21 | c11 (R3) | 1 | 22 |
| | | c13 (R6), c15 (R7) | 0 | 22 |
| | | c17 (R9) | 1 | 23 |
| | | c19 (R8) | 3 | 26 |
| | | c31 (R15) | 1 | 27 |
| `src/__tests__/account-screens-polish.test.ts` (nuevo) | 0 | c13 (R6) | 1 (`it.each` de 3 filas) | 1 |
| | | c15 (R7) | 1 | 2 |
| | | c21 (R10) | 1 | 3 |
| | | c34 (R18) | 1 | 4 |
| `src/components/__tests__/form-error.test.tsx` (nuevo) | 0 | c17 (R9) | 3 | 3 |
| `src/__tests__/ui-language.test.ts` | 28 | c32 (R16) | 0 | 28 |
| `src/__tests__/design-drift.test.ts` | 51 | c11, c33 | 0 | 51 |
| `src/__tests__/consistency-classnames.test.ts` | 33 | c29 (R14) | 0 | 33 |
| `src/__tests__/legibility-classnames.test.ts` | 12 | — | 0 | 12 |
| `src/theme/__tests__/motion.test.ts` | 16 | — | 0 | 16 |

Al cerrar hay 37 bloques `it` más. En Jest son 39 tests más, porque el
`it.each` de R6 da 3, y 4 suites más.

---

## T0 — Base y entorno (sin commit)

1. `cd mobile-pet-tracker`
2. Comprueba la rama, el HEAD y el árbol:
   - `git branch --show-current` → `feature/172-mobile-account-screens-polish`;
   - `git rev-parse HEAD` → el HEAD del handoff (H0);
   - `git merge-base --is-ancestor b7284682 HEAD; echo "exit=$?"` → `exit=0`;
   - `git status --short` → vacío.
3. Mide B2 **antes** de instalar.
   - Si da `1`, ejecuta `bun install --frozen-lockfile; echo "exit=$?"` →
     `exit=0`.
   - Si da `0`, alguien ya instaló: anótalo y no reinstales.
   - Después, `git diff --quiet -- package.json bun.lock; echo "exit=$?"` →
     `exit=0`.
4. `test ! -e .expo/types/router.d.ts; echo "exit=$?"` → `exit=0`. Si sale
   `exit=1`, PARA: el humano borra ese fichero (tipos de rutas obsoletos).
5. Ejecuta las anclas B3–B18 de requirements.md §Base medida. Ejecuta también
   `grep -cE '^- \[[ xX]\] Enmienda aprobada por humano' ../docs/ui-guidelines.md`
   → `4`. Si alguna salida no coincide, PARA y reporta la tabla medida.
6. Ejecuta las cuentas de la columna «Base» de §Cuentas, con los ficheros que
   ya existen.
7. Ejecuta Jest de la base:

   ```
   BASE="src/screens/login/index.test.tsx src/screens/register/index.test.tsx src/screens/forgot/index.test.tsx src/screens/reset-password/index.test.tsx src/theme/__tests__/global-css.test.ts src/providers/__tests__/language-provider.test.tsx src/theme/__tests__/motion.test.ts $GUARDAS"
   ```

   `$J $BASE; echo "exit=$?"` → `exit=0`, con `Test Suites: 11 passed`. Anota
   el número de tests, que T20 usa.
8. `$J $READERS; echo "exit=$?"` → `exit=0`.
9. `bun run typecheck; echo "exit=$?"` → `exit=0`.
10. Lint según §Preámbulo → `exit=0` y `vacio=0`.

---

## T1 — R1: tokens de texto (c1, c2)

**(1) Rojo, c1:** `test(mobile): tokens de texto label, body y cta (R1)`.

- Fichero: `src/theme/__tests__/global-css.test.ts`.
- Añade el `it` `#172 R1: define text-label, text-body y text-cta con sus
  valores exactos dentro de @theme` junto al de `R1: tokens rounded-card y
  text-2xs`, con la aserción de R1.

| `it` | Rojo |
|---|---|
| `#172 R1: …` | aserción (`toMatchObject`) |

Gate: 1 failed.

**(2) Verde, c2:** `feat(mobile): tokens de texto label, body y cta (R1)`.

- Fichero: `src/theme/global.css`.
- Añade los tres tokens de R1 dentro de `@theme`, junto a `--text-2xs`.
- Ancla: `grep -cE -- '--text-(label: 13px|body: 15px|cta: 17px);' src/theme/global.css`
  → `3`.
- Gate verde sobre `global-css.test.ts`.

**(3) Refactor:** ninguno.

**Sonda S1:** `--text-label: 12px`. Corre `global-css.test.ts` y espera 1
failed: `#172 R1`.

---

## T2 — R16: las tres claves (c3, c4)

Va pronto porque `BackButton` (c6) y el ojo (c20) llaman a `t()` con estas
claves, y `typecheck` exige que existan.

**(1) Rojo, c3:** `test(mobile): claves de Volver y del ojo de la contraseña (R16)`.

- Fichero: `src/providers/__tests__/language-provider.test.tsx`.
- En el `it` de longitud del catálogo:
  - la línea `+ 1, // #167 R5` pierde su coma final;
  - debajo va la línea nueva `+ 3, // #172 R16`.
- Añade un `describe('#172 R16: las claves de las pantallas de cuenta')` con
  el `it` `#172 R16: declara las tres claves de cuenta en los dos idiomas y su
  registro`.
  - Calca el `it` de `describe('#167 R5: el saludo de Pingo en login')` y
    asevera lo que fija R16.
  - Los valores son literales del test: `Volver`, `Back`, `Mostrar
    contraseña`, `Show password`, `Ocultar contraseña` y `Hide password`.

| `it` | Rojo |
|---|---|
| el de longitud del catálogo | aserción |
| `#172 R16: declara las tres claves…` | aserción |

Gate: 2 failed.

**(2) Verde, c4:** `feat(mobile): claves de Volver y del ojo de la contraseña (R16)`.

- `src/i18n/catalog.ts`: las tres claves van justo después de
  `'login.pingoGreeting'`, en `en` y en `es`, en este orden:
  `common.back`, `login.showPassword` y `login.hidePassword`. Los literales son
  los de R16.
- `../specs/mobile-ui-language/design.md`:
  - el encabezado es `### §2.N — Añadidos por #172 — Las pantallas de cuenta
    como el canvas`, con N igual al último §2 medido en H0 más uno (hoy, 25);
  - va justo antes de `## 3. La infraestructura`;
  - debajo lleva la cabecera de tabla de §2.24 y una fila por clave, con el
    formato de R16.
- Anclas:
  - B11 → `756`;
  - `grep -cF "'common.back':" src/i18n/catalog.ts` → `2`;
  - `grep -cF '← añadida por #172 (R16)' ../specs/mobile-ui-language/design.md`
    → `3`.
- Gate verde sobre `language-provider.test.tsx`.
- `git add src/i18n/catalog.ts ../specs/mobile-ui-language/design.md`.

**(3) Refactor:** ninguno.

---

## T3 — R2: `BackButton` (c5, c6)

**(1) Rojo, c5:** `test(mobile): BackButton vuelve o reemplaza (R2)`.

- Fichero nuevo: `src/components/__tests__/back-button.test.tsx`.
- Dobles:
  - `expo-router` con `router: { back: jest.fn(), replace: jest.fn(), canGoBack: jest.fn() }`;
  - `reicon-react-native` con `{ ...actual, ChevronLeft: … }` → `icon-chevron-left`,
    con el patrón de `AlertCircle` de `src/screens/register/index.test.tsx`;
  - `'../../theme/use-theme-colors'`, que devuelve `color:${token}`, como en
    ese mismo fichero.
- Monta `<BackButton testID="back" fallback="/welcome" />` dentro de
  `<LanguageProvider initial="es">`, o `"en"` en el segundo `it`.
- Los cinco `it` de R2:
  - los dos primeros buscan con `getByRole('button', { name: … })`;
  - los otros tres buscan con `getByTestId('back')`, para que S2b deje rojos
    solo los dos primeros.

| `it` | Rojo |
|---|---|
| fichero entero | módulo (`Cannot find module '../back-button'`) |

Gate: `Test Suites: 1 failed`, 0 tests.

**(2) Verde, c6:** `feat(mobile): BackButton (R2)`.

- Fichero nuevo: `src/components/back-button.tsx`, según R2:
  - `useTranslate` desde `'../providers/language-provider'`;
  - `router` desde `expo-router`;
  - `useThemeColors(['foreground'])`;
  - `ChevronLeft` de `reicon-react-native`.
- Anclas:
  - `grep -cF "t('common.back')" src/components/back-button.tsx` → `1`;
  - `grep -rl $PROD 'useRouter' src | wc -l` → `0`.
- Gate verde sobre `back-button.test.tsx`.

**(3) Refactor:** ninguno.

**Sondas** (corre `back-button.test.tsx`):

| Sonda | Mutación | Esperado |
|---|---|---|
| S2a | invertir el ternario (`canGoBack() ? replace : back`) | 2 failed: los dos últimos `it` |
| S2b | quitar `accessibilityLabel` | 2 failed: los dos primeros `it` |

---

## T4 — R4: `PingoFloat` (c7, c8)

**(1) Rojo, c7:** `test(mobile): PingoFloat flota en bucle (R4)`.

- Fichero nuevo: `src/components/__tests__/pingo-float.test.tsx`.
- Dobla `react-native-reanimated` igual que
  `src/components/__tests__/pop-in.test.tsx`: `...requireActual`,
  `__esModule: true` y `useReducedMotion` mockeado.
- Usa timers falsos (§Preámbulo).
- Monta `<PingoFloat testID="float"><Text>Hijo</Text></PingoFloat>`.
- Los tres `it` de R4:
  - la tabla de tiempos es acumulada;
  - cada avance va con `await act(async () => { jest.advanceTimersByTime(n); })`;
  - los valores son literales del test, nunca la constante importada.

| `it` | Rojo |
|---|---|
| fichero entero | módulo (`Cannot find module '../pingo-float'`) |

Gate: `Test Suites: 1 failed`, 0 tests.

**(2) Verde, c8:** `feat(mobile): PingoFloat (R4)`.

- Fichero nuevo: `src/components/pingo-float.tsx`, según R4:
  - el valor compartido se lee y se escribe con `.get()` y `.set()`;
  - el arranque va dentro de `if (!reduceMotion)`;
  - el efecto devuelve una limpieza con `cancelAnimation(translateY)`.
- Anclas:
  - `grep -cF 'withTiming(-MOTION_FLOAT_OFFSET_Y, MOTION_FLOAT_TIMING)' src/components/pingo-float.tsx`
    → `1`;
  - `grep -cF 'cancelAnimation(' src/components/pingo-float.tsx` → `1`;
  - `git diff --quiet <H0> -- src/theme/motion.ts; echo "exit=$?"` → `exit=0`.
- Gate verde sobre `pingo-float.test.tsx` y `src/theme/__tests__/motion.test.ts`.

**(3) Refactor:** ninguno.

**Sondas** (corre `pingo-float.test.tsx`; cada una da 1 failed):

| Sonda | Mutación | `it` rojo |
|---|---|---|
| S4a | quitar el `if (!reduceMotion)` y dejar el arranque | `#172 R4: con reduce motion no se mueve` |
| S4b | quitar `withRepeat` y dejar solo `withTiming` | `#172 R4: flota 4 px arriba y vuelve en bucle` (a 2400 ms) |
| S4c | `withTiming(MOTION_FLOAT_OFFSET_Y, …)` | `#172 R4: flota…` (a 600 ms) |

---

## T5 — R5: Pingo flota en las tres pantallas (c9, c10)

**(1) Rojo, c9:** `test(mobile): Pingo flota en registro, recuperar y nueva contraseña (R5)`.

En los tres ficheros de test de abajo, añade un doble de
`'../../components/pingo-float'`. Exporta `PingoFloat`, que pinta un `View`
con el mismo `testID` y sus `children`, con el patrón del doble de `PopIn` de
`src/screens/forgot/index.test.tsx`.

- `src/screens/register/index.test.tsx`:
  - en `#167 R7: la cabecera lleva a Pingo y después el título`,
    `children[0]` pasa de `register-pingo` a `register-pingo-float`;
  - añade `#172 R5: Pingo del registro flota`.
- `src/screens/forgot/index.test.tsx`:
  - el helper `expectPingoBeforeLock` hace sus dos aserciones estructurales
    sobre `const float = screen.getByTestId('forgot-pingo-float')`:
    - `float.parent` es `title.parent`;
    - el índice de `float` es el de `lockTile()` menos uno.

    Las de pose, tamaño y accesibilidad siguen sobre `forgot-pingo`.
  - añade `#172 R5: Pingo de recuperar flota`.
- `src/screens/reset-password/index.test.tsx`:
  - en `#167 R10: la cabecera lleva a Pingo y después el título` y
    `#167 R10: el éxito conserva la cabecera del formulario`, `children[0]`
    pasa a `reset-pingo-float`;
  - añade `#172 R5: Pingo de nueva contraseña flota en el formulario y en el
    éxito`.

| Fichero | `it` | Rojo |
|---|---|---|
| register | `#167 R7: la cabecera lleva a Pingo y después el título` | aserción |
| register | `#172 R5: Pingo del registro flota` | aserción |
| forgot | `#167 R9: Pingo precede al tile del candado en el formulario` | consulta (`forgot-pingo-float`) |
| forgot | `#167 R9: Pingo precede al tile del candado tras enviar` | consulta (`forgot-pingo-float`) |
| forgot | `#172 R5: Pingo de recuperar flota` | aserción |
| reset | `#167 R10: la cabecera lleva a Pingo y después el título` | aserción |
| reset | `#167 R10: el éxito conserva la cabecera del formulario` | aserción |
| reset | `#172 R5: Pingo de nueva contraseña flota…` | aserción |

Gate: 8 failed, repartidos así: register 2, forgot 3 y reset 3.

**(2) Verde, c10:** `feat(mobile): Pingo flota en registro, recuperar y nueva contraseña (R5)`.

- Envuelve cada `Image` de Pingo en `<PingoFloat testID="…-pingo-float">` en
  `src/screens/register/index.tsx`, `src/screens/forgot/index.tsx` y
  `src/screens/reset-password/index.tsx`.
- La imagen no cambia de props.
- Anclas, contadas con `grep -c 'testID="<x>-pingo-float"'`: register → `1`,
  forgot → `1`, reset-password → `2` (la rama de éxito y la del formulario).
- Gate verde sobre los tres tests de pantalla.

**(3) Refactor:** ninguno.

**Sonda S5:** en reset-password, quita el envoltorio **solo** en la rama del
formulario (la segunda `testID="reset-pingo-float"`). Corre el test de reset y
espera 2 failed: `#172 R5: Pingo de nueva contraseña…` y `#167 R10: la
cabecera lleva a Pingo y después el título`.

---

## T6 — R3: fila «Volver» (c11, c12)

**(1) Rojo, c11:** `test(mobile): fila Volver en login, registro y recuperar (R3)`.

- **Mocks de `expo-router`.** En los tres tests de pantalla, el objeto
  `router` añade `back: jest.fn()` y `canGoBack: jest.fn()`. El de recuperar
  añade también `replace: jest.fn()`.
- **Login** (`src/screens/login/index.test.tsx`):
  - `#167 R6: la cabecera lleva el saludo y después el título` se sustituye
    por `#172 R3: la cabecera lleva Volver, el saludo y el título`. Su primera
    aserción es `expect(header.children).toHaveLength(3)`.
  - Añade `#172 R3: Volver de login vuelve a la bienvenida sin historial`, con
    `mockRouter.canGoBack.mockReturnValue(false)` antes de pulsar.
- **Registro** (`src/screens/register/index.test.tsx`):
  - `#167 R7: la cabecera lleva a Pingo y después el título` se sustituye por
    `#172 R3: la cabecera lleva la fila Volver-Pingo y después el título`. Su
    primera aserción es
    `expect(header.children[0]).toHaveProperty('props.testID', 'register-top')`.
  - Añade `#172 R3: Volver del registro vuelve a la bienvenida sin historial`.
  - En el mapa de `#167 R7: la cabecera entra con rise`, el `className` de
    `'register-header'` pasa a `'gap-2'`.
- **Recuperar** (`src/screens/forgot/index.test.tsx`): añade
  `#172 R3: la fila Volver encabeza el scroll en los dos estados` y
  `#172 R3: Volver de recuperar va al login sin historial`.
- **Deriva** (`src/__tests__/design-drift.test.ts`):
  - en `loginRoutes` de `#149 R4`, `'screens/forgot/index.tsx': 1` pasa a
    `2, // #172 R17: forgot-back`;
  - va en este commit porque el verde de c12 lo rompe.

| Fichero | `it` | Rojo |
|---|---|---|
| login | `#172 R3: la cabecera lleva Volver, el saludo y el título` | aserción (`toHaveLength`) |
| login | `#172 R3: Volver de login…` | consulta (`login-back`) |
| register | `#172 R3: la cabecera lleva la fila Volver-Pingo…` | aserción (`register-pingo-float` ≠ `register-top`) |
| register | `#172 R3: Volver del registro…` | consulta (`register-back`) |
| register | `#167 R7: la cabecera entra con rise` | aserción |
| forgot | `#172 R3: la fila Volver encabeza el scroll…` | consulta (`forgot-top`) |
| forgot | `#172 R3: Volver de recuperar…` | consulta (`forgot-back`) |
| design-drift | `#149 R4: inventaría cada ruta a login en producción` | aserción |

Gate: 8 failed, repartidos así: login 2, register 3, forgot 2 y design-drift 1.

**(2) Verde, c12:** `feat(mobile): fila Volver en login, registro y recuperar (R3)`.

- Login, registro y recuperar según R3:
  - `register-header` pasa a `className="gap-2"`, y su primer hijo es
    `register-top`, que contiene `register-back` y `register-pingo-float`;
  - `forgot-top` es el primer hijo del contenido de `forgot-form`.
- Anclas:
  - `grep -c 'fallback="/welcome"' src/screens/login/index.tsx src/screens/register/index.tsx`
    → `1`, `1`;
  - `grep -c 'fallback="/login"' src/screens/forgot/index.tsx` → `1`.
- Gate verde sobre los tres tests de pantalla.

**(3) Refactor:** ninguno.

**Sondas:**

| Sonda | Mutación | Fichero que se corre | Esperado |
|---|---|---|---|
| S3a | quitar `<BackButton testID="login-back" …/>` | login | 2 failed: los dos `#172 R3` (aserción de longitud y consulta) |
| S3b | `fallback="/welcome"` en recuperar | forgot | 1 failed: `#172 R3: Volver de recuperar…` |
| S3c | sacar `register-back` de `register-top` y ponerlo delante de `register-header` | register | 2 failed: `#172 R3: la cabecera lleva la fila…` y `#167 R7: campos, errores, términos y envío cuelgan del scroll`, porque `content.children[0]` deja de ser `register-header` |

---

## T7 — R6: tipografía (c13, c14)

**(1) Rojo, c13:** `test(mobile): recetas de texto de las pantallas de cuenta (R6)`.

- **Fichero nuevo** `src/__tests__/account-screens-polish.test.ts`:
  - lleva la misma cabecera que `src/__tests__/design-drift.test.ts`: los
    `declare function require` de `fs` y `path`, y
    `const sourceRoot = join(process.cwd(), 'src')`;
  - añade `describe('#172 R6: …')` con el `it.each` `#172 R6: %s pinta
    títulos, etiquetas, cuerpos y CTA con su receta`;
  - las filas son `login`, `register` y `forgot`, y cada una lleva los doce
    conteos de la tabla de R6, contados con `split(literal).length - 1`.
- **Login:**
  - `#167 R6: el título de la cabecera conserva su clase` se sustituye por
    `#172 R6: el título de la cabecera pesa 30/900 al inicio`;
  - en `#167 R6: la burbuja dice el saludo en español`, el `.toBe` pasa a
    `'text-body font-semibold text-foreground'`.
- **Registro:** `#167 R7: el título de la cabecera conserva su clase` se
  sustituye por `#172 R6: el título de la cabecera pesa 30/900 al inicio`.

| Fichero | `it` | Rojo |
|---|---|---|
| polish | `#172 R6: login …` | aserción |
| polish | `#172 R6: register …` | aserción |
| polish | `#172 R6: forgot …` | aserción |
| login | `#172 R6: el título de la cabecera pesa 30/900 al inicio` | aserción |
| login | `#167 R6: la burbuja dice el saludo en español` | aserción |
| register | `#172 R6: el título de la cabecera pesa 30/900 al inicio` | aserción |

Gate: 6 failed.

**(2) Verde, c14:** `feat(mobile): recetas de texto de las pantallas de cuenta (R6)`.

- Las tres pantallas, según la tabla de R6. Cada `<Label className="text-xs
  font-semibold text-foreground">` pasa a
  `<Label><Label.Text className="text-label font-semibold text-muted">…</Label.Text></Label>`.
- Ancla: B3 → `0`, `0`, `0`.
- Gate verde sobre polish, login, register y forgot.

**(3) Refactor:** ninguno.

**Sondas** (corre polish; cada una da 1 failed, una fila del `it.each`):

| Sonda | Mutación | Fila roja |
|---|---|---|
| S6a | devolver una de las siete `Label.Text` de registro a `text-xs font-semibold text-foreground` | `register` |
| S6b | `font-bold text-accent-foreground` en el `Button.Label` de `forgot-submit` | `forgot` |

---

## T8 — R7: enlaces y orden del cuerpo de login (c15, c16)

**(1) Rojo, c15:** `test(mobile): enlaces y orden del cuerpo de login (R7)`.

- En polish añade `#172 R7: los enlaces de login y recuperar llevan su
  receta`. Las tres regex llevan `\s+` entre `testID` y `className`.
- En login, los tres `it` de orden se sustituyen según la tabla de R7. Su
  regex de `getAllByTestId` no cambia.

| Fichero | `it` | Rojo |
|---|---|---|
| polish | `#172 R7: los enlaces…` | aserción |
| login | `#172 R7: el cuerpo lleva correo, contraseña, olvido, envío y registro` | aserción (`toEqual`) |
| login | `#172 R7: con error, el error va entre el olvido y el envío` | aserción (`toEqual`) |
| login | `#172 R7: sin error, el cuerpo no lleva el error` | aserción (`toEqual`) |

Gate: 4 failed.

**(2) Verde, c16:** `feat(mobile): enlaces y orden del cuerpo de login (R7)`.

- Login y recuperar según R7. En la etiqueta de cada `LinkButton`,
  `className` va justo después de `testID`.
- Ancla: `grep -c 'self-center' src/screens/login/index.tsx` → `0`. B5 sin
  cambios: `2`, `0`, `1`, `3`.
- Gate verde sobre polish, login y forgot.

**(3) Refactor:** ninguno.

**Sonda S7:** deja `link-forgot` al final de `login-body`, como hoy. Corre
login y espera 3 failed: los tres `#172 R7` de orden.

---

## T9 — R9: `FormError` (c17, c18)

**(1) Rojo, c17:** `test(mobile): FormError con icono y texto seleccionable (R9)`.

- **Fichero nuevo** `src/components/__tests__/form-error.test.tsx`:
  - dobla `reicon-react-native` (`AlertCircle` → `icon-alert-circle`) y
    `useThemeColors`;
  - monta `<FormError testID="err" message="Algo falló" />`;
  - lleva los tres `it` de R9.
- **Login:**
  - añade los dobles de `reicon-react-native` (`{ ...actual, AlertCircle }`)
    y de `'../../theme/use-theme-colors'`, como en el test de registro;
  - añade `#172 R9: el error de login va con icono en su fila`. Usa el
    arreglo de `#172 R7: con error, el error va entre el olvido y el envío`, y
    después `await screen.findByTestId('login-error-row')`.
- **Recuperar:**
  - añade los mismos dos dobles (de momento solo `AlertCircle`);
  - añade `#172 R9: el error de recuperar va con icono en su fila`. Usa
    `mockForgotPassword.mockResolvedValue({ kind: 'rate-limited' })`,
    `renderRoute()` y `submitForgot()`, y después
    `await screen.findByTestId('forgot-error-row')`.
- **Registro:** los dos deltas `#167 R8` de §Deltas de candados.

| Fichero | `it` | Rojo |
|---|---|---|
| form-error | fichero entero | módulo (`Cannot find module '../form-error'`) |
| login | `#172 R9: el error de login…` | consulta (`login-error-row`) |
| forgot | `#172 R9: el error de recuperar…` | consulta (`forgot-error-row`) |
| register | `#167 R8: el error general va en una fila con icono` | aserción |
| register | `#167 R8: el texto del error pesa como el icono` | aserción |

Gate: 1 suite que no arranca y 4 failed.

**(2) Verde, c18:** `feat(mobile): FormError en login, registro y recuperar (R9)`.

- Fichero nuevo: `src/components/form-error.tsx`, según R9.
- En login, registro y recuperar, el `Text` del error general (y en registro,
  su fila con icono) se sustituye en su sitio por
  `<FormError testID="<pantalla>-error" message={…} />`.
- Registro deja de importar `AlertCircle` y `useThemeColors`.
- Anclas:
  - `grep -cE 'AlertCircle|useThemeColors' src/screens/register/index.tsx` → `0`;
  - `grep -c '<FormError' src/screens/login/index.tsx src/screens/register/index.tsx src/screens/forgot/index.tsx`
    → `1`, `1`, `1`;
  - B4 → `0`, `0`, `0`, `3`;
  - `grep -c 'selectable' src/components/form-error.tsx` → `1`.
- Gate verde sobre form-error, login, register y forgot.

**(3) Refactor:** ninguno.

**Sondas:**

| Sonda | Mutación | Ficheros que se corren | Esperado |
|---|---|---|---|
| S9a | quitar `selectable` en `form-error.tsx` | form-error y login | 2 failed: el tercer `it` de form-error y `#172 R9: el error de login…` |
| S9b | devolver login al `<Text testID="login-error" className="text-danger">{…}</Text>` de la base | login | 1 failed: `#172 R9: el error de login…`, por consulta |

---

## T10 — R8: el ojo de la contraseña (c19, c20)

**(1) Rojo, c19:** `test(mobile): mostrar y ocultar la contraseña en login (R8)`.

- En login, el doble de `reicon-react-native` añade `Eye` → `icon-eye` y
  `EyeOff` → `icon-eye-off`.
- Añade los tres `it` de R8.
  - En el primero, la aserción de `secureTextEntry` va antes que el
    `getByRole`.
  - El de inglés monta
    `<HeroUINativeProvider><LanguageProvider initial="en"><LoginRoute /></LanguageProvider></HeroUINativeProvider>`,
    como `#167 R6: la burbuja dice el saludo en inglés`.

| `it` | Rojo |
|---|---|
| `#172 R8: la contraseña arranca oculta…` | consulta (`getByRole` «Mostrar contraseña») |
| `#172 R8: el ojo alterna mostrar y ocultar` | consulta (`login-password-toggle`) |
| `#172 R8: en inglés el ojo dice…` | consulta (`getByRole` «Show password») |

Gate: 3 failed.

**(2) Verde, c20:** `feat(mobile): mostrar y ocultar la contraseña en login (R8)`.

- Login según R8:
  - `InputGroup`, `InputGroup.Input` e `InputGroup.Suffix` de `heroui-native`;
  - `useState(false)`;
  - `useThemeColors(['muted'])`;
  - el ternario de dos claves literal de R8.
- Anclas:
  - `grep -c "passwordVisible ? t('login.hidePassword') : t('login.showPassword')" src/screens/login/index.tsx`
    → `1`;
  - `grep -rl $PROD 'InputGroup' src | wc -l` → `1`.
- Gate verde sobre login.

**(3) Refactor:** ninguno.

**Sondas** (corre login):

| Sonda | Mutación | Esperado |
|---|---|---|
| S8a | `useState(true)` | 1 failed: `#172 R8: la contraseña arranca oculta…` |
| S8b | intercambiar `Eye` y `EyeOff` | 2 failed: los dos primeros `#172 R8` |

---

## T11 — R10: errores por campo (c21, c22)

**(1) Rojo, c21:** `test(mobile): errores por campo del registro con icono (R10)`.

- **Registro:**
  - añade `#172 R10: cada campo con error lleva icono y texto seleccionable`.
    Copia el montaje y los errores de validación de `#167 R7: campos, errores,
    términos y envío cuelgan del scroll`, que en este commit aún existe.
  - añade `#172 R10: sin errores ningún campo pinta mensaje`.
- **Polish:** añade `#172 R10: los siete campos del registro marcan
  isInvalid`.

| Fichero | `it` | Rojo |
|---|---|---|
| register | `#172 R10: cada campo con error…` | consulta (`register-first-name-message-row`) |
| register | `#172 R10: sin errores…` | nace verde (S10b) |
| polish | `#172 R10: los siete campos…` | nace verde (S10c) |

Gate: 1 failed.

**(2) Verde, c22:** `feat(mobile): errores por campo del registro con icono (R10)`.

- En registro, cada uno de los siete `FieldError` pasa a tener como hijo
  `{fieldErrors.<campo> ? <FormError testID="register-<campo>-message" message={fieldErrors.<campo>} /> : null}`,
  con los `testID` de la tabla de R10.
- Anclas:
  - `grep -c -- '-message"' src/screens/register/index.tsx` → `7`;
  - `grep -c '<FormError' src/screens/register/index.tsx` → `8`;
  - B12 → `7`.
- Gate verde sobre register y polish.

**(3) Refactor:** ninguno.

**Sondas:**

| Sonda | Mutación | Fichero que se corre | Esperado |
|---|---|---|---|
| S10a | dejar en el país `{fieldErrors.country}` como hijo de texto | register | 1 failed: `#172 R10: cada campo…` |
| S10b | pintar en apellidos `<FormError testID="register-last-name-message" message="" />` sin condición | register | 1 failed: `#172 R10: sin errores…` (longitud 2) |
| S10c | quitar `isInvalid={Boolean(fieldErrors.country)}` del `TextField` del país | polish | 1 failed: `#172 R10: los siete campos…` (6 en lugar de 7) |

---

## T12 — R11: rejilla del registro (c23, c24)

**(1) Rojo, c23:** `test(mobile): rejilla del registro (R11)`.

- `#167 R7: campos, errores, términos y envío cuelgan del scroll` se
  sustituye por `#172 R11: cabecera, rejilla, términos, error y envío cuelgan
  del scroll`.
  - Conserva el montaje con errores de validación.
  - Su primera consulta es `screen.getByTestId('register-names-row')`.
- Añade `#172 R11: nombres a 1fr 1fr y teléfono-país a 2fr 1fr`. También
  empieza por `getByTestId('register-names-row')`.

| `it` | Rojo |
|---|---|
| `#172 R11: cabecera, rejilla…` | consulta (`register-names-row`) |
| `#172 R11: nombres a 1fr 1fr…` | consulta (`register-names-row`) |

Gate: 2 failed.

**(2) Verde, c24:** `feat(mobile): rejilla del registro (R11)`.

- Registro según R11. Cada fila se escribe en una línea:
  `<View testID="register-names-row" className="flex-row gap-3">`, y lo mismo
  con `register-contact-row`.
- Anclas:
  - `grep -cF 'testID="register-names-row" className="flex-row gap-3"' src/screens/register/index.tsx`
    → `1`;
  - `grep -cF 'testID="register-contact-row" className="flex-row gap-3"' src/screens/register/index.tsx`
    → `1`;
  - `grep -rl $PROD 'flex-2' src | wc -l` → `1`.
- Gate verde sobre register.

**(3) Refactor:** ninguno.

**Sondas** (corre register; cada una da 1 failed:
`#172 R11: nombres a 1fr 1fr…`):

| Sonda | Mutación |
|---|---|
| S11a | `flex-1` en el `TextField` del teléfono |
| S11b | el país antes que el teléfono en `register-contact-row` |

---

## T13 — R12: validación del correo (c25, c26)

**(1) Rojo, c25:** `test(mobile): validación del correo en el registro (R12)`.

Añade los dos `it` de R12. Cada uno sigue estos pasos:

1. Fija `mockRegister.mockResolvedValue({ kind: 'email-taken' })`. Así el
   rojo es determinista: sin la comprobación, la API responde y pinta un error
   general, no el del campo.
2. Rellena con `fillForm()` y no vuelve a pulsar los términos.
3. `await fireEvent.changeText(screen.getByTestId('register-email'), 'alex.example.com')`.
4. `await submit()`.
5. `await waitFor(() => expect(screen.getByTestId('register-email-message')).toHaveTextContent('Ingresa un correo electrónico válido'))`.
6. Después, `expect(mockRegister).not.toHaveBeenCalled()`.

El de inglés monta
`<HeroUINativeProvider><LanguageProvider initial="en"><RegisterRoute /></LanguageProvider></HeroUINativeProvider>`
y espera `Enter a valid email address`.

| `it` | Rojo |
|---|---|
| `#172 R12: un correo sin arroba…` | consulta (`register-email-message`, al agotar el `waitFor`) |
| `#172 R12: en inglés…` | consulta (ídem) |

Gate: 2 failed.

**(2) Verde, c26:** `feat(mobile): validación del correo en el registro (R12)`.

- Registro según R12: la constante de módulo `EMAIL_PATTERN` y la
  comprobación entre la limpieza de errores y la marca de envío en vuelo.
- Anclas:
  - `grep -cF 'const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;' src/screens/register/index.tsx`
    → `1`;
  - `grep -cF "t('forgot.invalidEmail')" src/screens/register/index.tsx` → `1`.
- Gate verde sobre register.

**(3) Refactor:** ninguno.

**Sonda S12:** quita la comprobación. Corre register y espera 2 failed: los
dos `#172 R12`.

---

## T14 — R13: la tarjeta de éxito avisa (c27, c28)

**(1) Rojo, c27:** `test(mobile): la tarjeta de éxito avisa con liveRegion (R13)`.

En reset-password, añade `#172 R13: la tarjeta de estado avisa con liveRegion
polite`. Usa el arreglo de éxito de `#167 R10: el éxito conserva la cabecera
del formulario`.

| `it` | Rojo |
|---|---|
| `#172 R13: …` | aserción (`toBe('polite')`) |

Gate: 1 failed.

**(2) Verde, c28:** `feat(mobile): la tarjeta de éxito avisa con liveRegion (R13)`.

- `accessibilityLiveRegion="polite"` en `reset-success-card`.
- Ancla: B14 → `1`.
- Gate verde sobre reset-password.

**(3) Refactor:** ninguno.

**Sonda S13:** quita la prop. Corre reset-password y espera 1 failed.

---

## T15 — R14: el candado con labio (c29, c30)

**(1) Rojo, c29:** `test(mobile): el candado de recuperar es un tile acento con labio (R14)`.

- **Recuperar** (`src/screens/forgot/index.test.tsx`):
  - El helper `lockTile()` busca el tile entre los hermanos del título por
    `props.testID === 'forgot-lock-tile'`, y se borra `LOCK_TILE_CLASS`. Este
    cambio nace verde.
  - Los otros cuatro literales del tile viejo pasan al nuevo: los dos de `el
    tile Lock sigue en pie en los dos estados` y las dos entradas
    `'forgot-lock-tile'` del mapa del doble de `PopIn`, que leen los dos
    `#167 R9: el tile entra con pop…`.
  - El doble de `reicon-react-native` añade `Lock` → `icon-lock`.
  - Añade `#172 R14: el candado es un tile acento con labio y Lock de 26`.
- **`src/__tests__/consistency-classnames.test.ts`:** los cinco cambios de
  §Deltas de candados (filas R14).

| Fichero | `it` | Rojo |
|---|---|---|
| forgot | `el tile Lock sigue en pie en los dos estados` | aserción (`toBeDefined`) |
| forgot | `#167 R9: el tile entra con pop en el formulario` | aserción (`toEqual`) |
| forgot | `#167 R9: el tile entra con pop tras enviar` | aserción (`toEqual`) |
| forgot | `#172 R14: el candado es un tile acento…` | aserción (`toBe`) |
| consistency | `lleva los tres tiles restantes a rounded-xl` | aserción (`toContain`) |
| consistency | `resuelve el Lock de Forgot con accent-foreground` | aserción (`toContain`) |
| consistency | `deja CONTINUOUS_CORNER, bg-accent-soft y el acento donde estaban` | aserción (19 en lugar de 18) |
| consistency | `conserva los usos de bg-accent-soft que sí son acento` | aserción (19 en lugar de 18) |
| consistency | `no deja la receta del labio fuera de un primario salvo el candado de Recuperar` | aserción (19 en lugar de 20) |

Gate: 9 failed, repartidos así: forgot 4 y consistency 5. Ningún
`expectFormState` ni `expectSentState` cae, porque `lockTile()` ya busca por
`testID`.

**(2) Verde, c30:** `feat(mobile): el candado de recuperar es un tile acento con labio (R14)`.

- Recuperar según R14:
  - el `className` del tile es el de R14;
  - el hijo es `<Lock size={26} color={accentForeground} />`;
  - la constante es `const [accentForeground] = useThemeColors(['accent-foreground']);`.
- Anclas:
  - `grep -cF 'size-13 items-center justify-center rounded-xl border-b-4 border-black/25 bg-accent' src/screens/forgot/index.tsx`
    → `1`;
  - B7 → `18`;
  - B8 → `20` y `20`;
  - B9 → `32`;
  - B17 viejo → `0`, `0`;
  - el literal nuevo en el test de recuperar → `5`, y en consistency → `1`;
  - `grep -c 'LOCK_TILE_CLASS' src/screens/forgot/index.test.tsx` → `0`.
- Gate verde sobre forgot y consistency.

**(3) Refactor:** ninguno.

**Sonda S14:** pon `bg-accent-soft` en lugar de `bg-accent` en el tile. Corre
forgot y consistency y espera 7 failed:

- forgot 4: los cuatro de la tabla del rojo;
- consistency 3: `lleva los tres tiles…` y los dos recuentos de
  `bg-accent-soft` (19 en lugar de 18).

---

## T16 — R15: el error de login cuelga del scroll (c31, nace verde)

Commit: `test(mobile): el error de login cuelga del scroll (R15)`.

1. En login, añade `#172 R15: el error cuelga del scroll y no del contenedor
   del teclado`, con el arreglo de `#172 R7: con error…`.
2. **Nace verde** (declarado): hoy el error ya está dentro del scroll. Gate:
   login en verde (27 `it`).
3. **Sonda S15:** mueve el bloque del error justo después de `</ScrollView>`.
   Corre login y espera 2 failed:
   - `#172 R15`, por consulta: `within(login-form)` no lo ve;
   - `#172 R7: con error, el error va entre el olvido y el envío`, por
     aserción: el error sale de `login-body`.

---

## T17 — R16: filas de uso de las claves (c32, nace verde)

Commit: `test(mobile): filas de uso de las claves de cuenta (R16)`.

1. En `src/__tests__/ui-copy-table.ts`, añade cuatro filas al final de
   `R1_AUTH`. Cada una con el formato de las filas `// #167 R6` y el
   comentario `// #172 R16`:

   | `file` | `key` |
   |---|---|
   | `src/screens/login/index.tsx` | `login.showPassword` |
   | `src/screens/login/index.tsx` | `login.hidePassword` |
   | `src/screens/register/index.tsx` | `forgot.invalidEmail` |
   | `src/components/back-button.tsx` | `common.back` |

2. En `src/__tests__/ui-language.test.ts`:
   - `it('resuelve las 36 ocurrencias normativas'` pasa a `it('resuelve las 41
     ocurrencias normativas'`. Su longitud pasa a
     `toHaveLength(29 + 7 + 1 + 4); // #117 R10, #167 R6, #172 R16`.
   - En el sumatorio de `SCREEN_FILES`, la línea `+ 2 - 2, // #167 R1: …`
     pierde su coma, y debajo va `+ 1, // #172 R16: back-button`.
3. **Nace verde** (declarado). Gate: ui-language en verde.
4. Anclas:
   - B10 → `41`;
   - `grep -cF 'toHaveLength(29 + 7 + 1 + 4); // #117 R10, #167 R6, #172 R16' src/__tests__/ui-language.test.ts`
     → `1`.

   No ancles por el título: `resuelve las 41 ocurrencias normativas` ya existe
   en el `describe` de `#65 R9`, y el grep da 2.
5. **Sonda S16:** en `src/components/back-button.tsx`, cambia
   `t('common.back')` por `'Volver'`. Corre ui-language y espera 2 failed:
   - `resuelve cada ocurrencia de la tabla contra la clave exacta`;
   - `no deja ningún valor fijo del catálogo como literal entero en las
     pantallas`.

---

## T18 — R17: guarda de deriva (c33, nace verde)

Commit: `test(mobile): los componentes nuevos entran en la guarda de deriva (R17)`.

1. En `src/__tests__/design-drift.test.ts`, la lista `featureFiles` de los
   cuatro `#167 R14: …` añade, después de `'theme/motion.ts',`:
   - `'components/back-button.tsx',`
   - `'components/form-error.tsx',`
   - `'components/pingo-float.tsx',`

   El inventario `#149 R4` ya se cambió en c11.
2. **Nace verde** (declarado). Gate: design-drift en verde (51 `it`).
3. **Sondas** (corre design-drift; cada una da 1 failed):

   | Sonda | Mutación | `it` rojo |
   |---|---|---|
   | S17a | `// sonda '#FFFFFF'` en `src/components/pingo-float.tsx` | `#167 R14: sin hex, clases arbitrarias, StyleSheet ni sombras sueltas` |
   | S17b | `fallback="/welcome"` en recuperar | `#149 R4: inventaría cada ruta a login en producción` |

---

## T19 — R18: enmienda a la carta (c34, c35)

**(1) Rojo, c34:** `test(mobile): la carta declara la enmienda de las pantallas de cuenta (R18)`.

- En polish añade `#172 R18: la carta declara la enmienda #172 y su casilla`,
  según R18.
- La carta se lee con
  `readFileSync(join(process.cwd(), '..', 'docs', 'ui-guidelines.md'), 'utf8')`.

| `it` | Rojo |
|---|---|
| `#172 R18: …` | aserción (`toContain` del encabezado) |

Gate: 1 failed.

**(2) Verde, c35:** `docs(ui): enmienda de la carta para las pantallas de cuenta (R18)`.

- Copia al final de `../docs/ui-guidelines.md` el bloque de requirements.md
  §Enmienda a la carta, palabra por palabra.
- La casilla de dentro del bloque copia el estado de la casilla de firma que
  hay debajo, en ese mismo §. Si el humano la marcó, va `- [x] Enmienda
  aprobada por humano`; si no, `- [ ]`.
- Anclas:
  - B15 → `1`;
  - `grep -cE '^- \[[ xX]\] Enmienda aprobada por humano' ../docs/ui-guidelines.md`
    → `5`.
- Gate: `$J src/__tests__/account-screens-polish.test.ts $READERS $GUARDAS; echo "exit=$?"`
  → `exit=0`. Si un lector de la carta sale rojo, PARA y reporta: la enmienda
  no puede romper otra.
- `git add ../docs/ui-guidelines.md`.

**(3) Refactor:** ninguno.

**Sonda S18:** borra la casilla del bloque `## Enmienda #172` de la carta.
Corre polish y espera 1 failed: `#172 R18`, por `toMatch`. Revierte con
`git checkout HEAD -- ../docs/ui-guidelines.md`.

---

## T20 — Cierre técnico (sin commit de código)

1. **Cuentas.** Cada fichero de §Cuentas da su «Total» final.
2. **Jest.**
   - `$J $BASE src/components/__tests__/back-button.test.tsx src/components/__tests__/pingo-float.test.tsx src/components/__tests__/form-error.test.tsx src/__tests__/account-screens-polish.test.ts; echo "exit=$?"`
     → `exit=0`, con `Test Suites: 15 passed`. Los tests son los de T0
     paso 7 más 39.
   - `$J $READERS; echo "exit=$?"` → `exit=0`.
3. **Typecheck y lint.** `bun run typecheck` y lint, según §Preámbulo.
4. **Anclas al cerrar:**

   | Ancla | Valor |
   |---|---|
   | B3 | `0`, `0`, `0` |
   | B4 | `0`, `0`, `0`, `3` |
   | B5 | `2`, `0`, `1`, `3` |
   | B6 | `0`, `1`, `1`, `2` (las comillas dobles de `fallback="/login"` no cuentan) |
   | `grep -c 'fallback="/login"' src/screens/forgot/index.tsx` | `1` |
   | B7 | `18` |
   | B8 | `20` y `20` |
   | B9 | `32` |
   | B10 | `41` |
   | B11 | `756` |
   | B12 | `7` |
   | `grep -rl $PROD 'InputGroup' src \| wc -l` ; `grep -rl $PROD 'flex-2' src \| wc -l` | `1` ; `1` |
   | B14 | `1` |
   | B15 | `1` |
   | B16 | `### §2.N — Añadidos por #172 — Las pantallas de cuenta como el canvas` |
   | B17 (literal viejo) | `0`, `0` |
   | literal nuevo del tile | `5` en el test de recuperar, `1` en consistency, `1` en `src/screens/forgot/index.tsx` |
   | `grep -c 'LOCK_TILE_CLASS' src/screens/forgot/index.test.tsx` | `0` |
   | `grep -c -- '-message"' src/screens/register/index.tsx` | `7` |
   | casillas `^- \[[ xX]\] Enmienda aprobada por humano` de la carta | `5` |

5. **Sin cambios contra H0.**
   `git diff --quiet <H0> -- src/theme/motion.ts package.json bun.lock src/components/card.tsx src/screens/welcome; echo "exit=$?"`
   → `exit=0`.
6. **Historial.** `git log --oneline <H0>..HEAD` muestra c1–c35 en orden. Ningún
   commit mezcla tests rojos con implementación.
7. **Informe y trazabilidad.**
   - Escribe `progress/impl_mobile-account-screens-polish.md`, con las salidas
     literales de cada gate y de cada sonda.
   - Rellena `specs/mobile-account-screens-polish/traceability.md`: hash y
     mensaje por R, y los `it` de cada R. La fila de R19 queda «pendiente
     (humano)».
   - Commitéalos con rutas explícitas en
     `docs(mobile-account-screens-polish): #172 trazabilidad`.
8. **No ejecutes `./init.sh`.** Lo ejecuta el leader antes del reviewer.

---

## T21 — R19: prueba de humo en dev build de Android (humano)

No la corre ninguna IA.

1. `cd mobile-pet-tracker && bunx expo start --dev-client`, y abre el dev
   build de Android (no Expo Go).
2. Recorre la lista de `traceability.md` §Prueba de humo (R19), en español y
   en inglés.
3. Firma la casilla de esa sección con fecha y dispositivo.
