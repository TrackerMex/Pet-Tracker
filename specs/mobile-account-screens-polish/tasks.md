---
feature: "mobile-account-screens-polish"
status: spec_ready   # draft | spec_ready | approved
tags: [mobile, ui, spec]
---

# Tareas — [[mobile-account-screens-polish]] (#172)

> Base congelada `3f9a60e2`, que ya trae #168, #169 y #170 (requirements.md
> §Base medida). Las cifras que otras features pueden mover (requirements.md
> §Choques de integración) van como «H0 + delta». Requisitos en [requirements.md](requirements.md) y
> diseño en [design.md](design.md). Cada R tiene un bloque (1) test rojo,
> (2) implementación mínima y (3) refactor. Lo que asevera cada `it` está en su
> R de requirements.md; aquí van el orden, los ficheros, los rojos esperados y
> los gates.
>
> Excepciones declaradas, cada una con su sonda de mutación:
> - nacen verdes R15 (c31), las filas de uso de R16 (c32) y R17 (c33);
> - en c19 nace verde el cambio del bucle de `#167 R7: campos, errores,
>   términos y envío cuelgan del scroll` (sonda S8a);
> - en c21 nacen verdes `#172 R10: sin errores ningún campo pinta mensaje` y
>   `#172 R10: los siete campos del registro marcan isInvalid`;
> - en c29 nace verde el cambio del helper `lockTile()`;
> - en c38 nace verde la fila `password-input` de `#172 R20` (sonda S20d).

---

## Preámbulo (vale para todas las tareas)

- **Directorio.** Todos los comandos se lanzan desde `mobile-pet-tracker/`, y
  el primero de cada bloque es `cd mobile-pet-tracker`. Las rutas `../docs/` y
  `../specs/` salen de ahí. Si un comando falla por directorio
  (`Cannot find module`, `ENOENT` de `package.json`,
  `ERR_PNPM_RECURSIVE_EXEC_NO_PACKAGE`), es un error de invocación: repite con
  el `cd` y no toques código.
- **Herramientas.** Solo `bunx` y `bun run`, nunca `npx` ni `npm`. Ninguna
  dependencia nueva: `package.json` y `bun.lock` no cambian. El único binario
  nuevo es `assets/fonts/Inter-ExtraBold.ttf`, que trae T7 con su sha256.
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
    y en T22:
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
  sustituye a otro, o que cambia de título, añade 0.
- Si H0 mide otra base, se aplica el mismo delta.

| Fichero | Base | Commit | Añade | Total |
|---|---|---|---|---|
| `src/theme/__tests__/global-css.test.ts` | 30 | c1 (R1) | 1 | 31 |
| `src/providers/__tests__/language-provider.test.tsx` | 19 | c3 (R16) | 1 | 20 |
| `src/components/__tests__/back-button.test.tsx` (nuevo) | 0 | c5 (R2) | 5 | 5 |
| `src/components/__tests__/pingo-float.test.tsx` (nuevo) | 0 | c7 (R4) | 3 | 3 |
| `src/theme/__tests__/motion.test.ts` | 16 | c7 (R4) | 1 | 17 |
| `src/screens/register/index.test.tsx` | 21 | c9 (R5) | 1 | 22 |
| | | c11 (R3) | 1 | 23 |
| | | c13 (R6) | 0 | 23 |
| | | c19 (R8) | 1 (`it.each` de 2 filas) | 24 |
| | | c21 (R10) | 2 | 26 |
| | | c23 (R11) | 1 | 27 |
| | | c25 (R12) | 2 | 29 |
| | | c36 (R19) | 1 | 30 |
| `src/screens/forgot/index.test.tsx` | 28 | c9 (R5) | 1 | 29 |
| | | c11 (R3) | 2 | 31 |
| | | c17 (R9) | 1 | 32 |
| | | c29 (R14) | 1 | 33 |
| | | c36 (R19) | 1 | 34 |
| `src/screens/reset-password/index.test.tsx` | 27 | c9 (R5) | 1 | 28 |
| | | c13 (R6) | 0 | 28 |
| | | c17 (R9) | 1 | 29 |
| | | c19 (R8) | 1 (`it.each` de 2 filas) | 30 |
| | | c27 (R13) | 1 | 31 |
| | | c36 (R19) | 3 | 34 |
| `src/screens/login/index.test.tsx` | 21 | c11 (R3) | 1 | 22 |
| | | c13 (R6), c15 (R7) | 0 | 22 |
| | | c17 (R9) | 1 | 23 |
| | | c19 (R8) | 1 | 24 |
| | | c31 (R15) | 1 | 25 |
| | | c36 (R19) | 1 | 26 |
| `src/theme/__tests__/font-registration.test.ts` | 3 | c13 (R6) | 1 | 4 |
| `src/__tests__/account-screens-polish.test.ts` (nuevo) | 0 | c13 (R6) | 1 (`it.each` de 4 filas) | 1 |
| | | c15 (R7) | 1 | 2 |
| | | c21 (R10) | 1 | 3 |
| | | c34 (R18) | 1 | 4 |
| | | c36 (R19) | 1 | 5 |
| | | c38 (R20) | 1 (`it.each` de 5 filas) | 6 |
| `src/components/__tests__/form-error.test.tsx` (nuevo) | 0 | c17 (R9) | 3 | 3 |
| `src/components/__tests__/password-input.test.tsx` (nuevo) | 0 | c19 (R8) | 4 | 4 |
| `src/__tests__/ui-language.test.ts` | 28 | c32 (R16), c36 (R19) | 0 | 28 |
| `src/__tests__/design-drift.test.ts` | 51 | c11, c33, c36 | 0 | 51 |
| `src/__tests__/consistency-classnames.test.ts` | 33 | c29 (R14) | 0 | 33 |
| `src/__tests__/legibility-classnames.test.ts` | 12 | c36 (R19) | 0 | 12 |

Al cerrar hay 52 bloques `it` más. En Jest son 61 tests más, porque los cuatro
`it.each` dan 2, 2, 4 y 5, y hay 5 suites más.

---

## T0 — Base y entorno (sin commit)

1. `cd mobile-pet-tracker`
2. Comprueba la rama, el HEAD y el árbol:
   - `git branch --show-current` → `feature/172-mobile-account-screens-polish`;
   - `git rev-parse HEAD` → el HEAD del handoff (H0);
   - `git merge-base --is-ancestor 3f9a60e2 HEAD; echo "exit=$?"` → `exit=0`;
   - `git status --short` → vacío.
3. Mide B2 **antes** de instalar.
   - Si da `1`, ejecuta `bun install --frozen-lockfile; echo "exit=$?"` →
     `exit=0`.
   - Si da `0`, alguien ya instaló: anótalo y no reinstales.
   - Después, `git diff --quiet -- package.json bun.lock; echo "exit=$?"` →
     `exit=0`.
4. `test ! -e .expo/types/router.d.ts; echo "exit=$?"` → `exit=0`. Si sale
   `exit=1`, PARA: el humano borra ese fichero (tipos de rutas obsoletos).
5. Ejecuta las anclas B3–B28 de requirements.md §Base medida. Ejecuta también
   `grep -cE '^- \[[ xX]\] Enmienda aprobada por humano' ../docs/ui-guidelines.md`
   → `4`.
   - B7, B8, B9, B10, B11, B16, B20 y B21 pueden diferir por otras features
     (requirements.md §Choques de integración). Si difieren, anota la cifra
     medida: es la base de H0, y cada ancla posterior que las cite vale
     «H0 + delta».
   - Si difiere cualquier otra salida, PARA y reporta la tabla medida.
6. Ejecuta las cuentas de la columna «Base» de §Cuentas, con los ficheros que
   ya existen. Si alguna difiere, anótala y aplica el delta.
7. Ejecuta Jest de la base:

   ```
   BASE="src/screens/login/index.test.tsx src/screens/register/index.test.tsx src/screens/forgot/index.test.tsx src/screens/reset-password/index.test.tsx src/theme/__tests__/global-css.test.ts src/providers/__tests__/language-provider.test.tsx src/theme/__tests__/motion.test.ts src/theme/__tests__/font-registration.test.ts $GUARDAS"
   ```

   `$J $BASE; echo "exit=$?"` → `exit=0`, con `Test Suites: 12 passed`. Anota
   el número de tests, que T22 usa.
8. `$J $READERS; echo "exit=$?"` → `exit=0`.
9. `bun run typecheck; echo "exit=$?"` → `exit=0`.
10. Lint según §Preámbulo → `exit=0` y `vacio=0`.

---

## T1 — R1: tokens de texto (c1, c2)

**(1) Rojo, c1:** `test(mobile): tokens de texto 13, 15 y 17 (R1)`.

- Fichero: `src/theme/__tests__/global-css.test.ts`.
- Añade el `it` `#172 R1: define text-13, text-15 y text-17 con sus
  valores exactos dentro de @theme` junto al de `R1: tokens rounded-card y
  text-2xs`, con la aserción de R1.

| `it` | Rojo |
|---|---|
| `#172 R1: …` | aserción (`toMatchObject`) |

Gate: 1 failed.

**(2) Verde, c2:** `feat(mobile): tokens de texto 13, 15 y 17 (R1)`.

- Fichero: `src/theme/global.css`.
- Añade los tres tokens de R1 dentro de `@theme`, junto a `--text-2xs`.
- Ancla: `grep -cE -- '--text-(13: 13px|15: 15px|17: 17px);' src/theme/global.css`
  → `3`.
- Gate verde sobre `global-css.test.ts`.

**(3) Refactor:** ninguno.

**Sonda S1:** `--text-13: 12px`. Corre `global-css.test.ts` y espera 1
failed: `#172 R1`.

---

## T2 — R16: las claves y «País» (c3, c4)

Va pronto porque `BackButton` (c6) y `PasswordInput` (c20) llaman a `t()` con
estas claves, y `typecheck` exige que existan.

**(1) Rojo, c3:** `test(mobile): claves de Volver, del ojo y País (R16)`.

- Fichero: `src/providers/__tests__/language-provider.test.tsx`.
- En el `it` de longitud del catálogo, `+ 3, // #172 R16` va como **último**
  sumando. El sumando que cierra la suma en H0 pierde su coma final: en la
  base es `+ 7, // #170 R1`.
- Añade un `describe('#172 R16: el copy de las pantallas de cuenta como el
  canvas')` con el `it` `#172 R16: declara las claves de cuenta en los dos
  idiomas y su registro`.
  - Calca el `it` de `describe('#167 R5: el saludo de Pingo en login')` y
    asevera lo que fija R16: los valores de las cuatro claves, las cuatro
    filas de `languageDesign` y el encabezado §2.N.
  - Los valores son literales del test: `Volver`, `Back`, `Mostrar
    contraseña`, `Show password`, `Ocultar contraseña`, `Hide password`,
    `País` y `Country`.

| `it` | Rojo |
|---|---|
| el de longitud del catálogo | aserción |
| `#172 R16: declara las claves de cuenta…` | aserción |

Gate: 2 failed.

**(2) Verde, c4:** `feat(mobile): claves de Volver, del ojo y País (R16)`.

- `src/i18n/catalog.ts`:
  - las tres claves nuevas van justo después de `'common.somethingWentWrong'`,
    en `en` y en `es`, en este orden: `common.back`, `common.showPassword` y
    `common.hidePassword`. Los literales son los de R16;
  - `register.country` pasa a `'Country'` en `en` y a `'País'` en `es`.
- `../specs/mobile-ui-language/design.md`:
  - el encabezado es `### §2.N — Añadidos por #172 — Las pantallas de cuenta
    como el canvas`, con N igual al último `### §2.N` medido en H0 más uno
    (en la base, 27, tras `### §2.26 — Añadidos por #170 — Alertas agrupadas
    y mini-mapa`);
  - va después de la tabla de esa última §2.N y justo antes de `## 3. La
    infraestructura`;
  - debajo lleva la cabecera de tabla de §2.24 y las cuatro filas de R16;
  - en la fila de hoy `| 244 | \`register.country\` |`, los valores pasan a
    `` `Country` `` y `` `País` ``, y la fila termina en `← literal cambiado
    por #172 (R16); antes \`Country (2-letter code)\` / \`País (código de 2
    letras)\``.
- Anclas:

  | Comando | Esperado |
  |---|---|
  | B11 | B11 de H0 + 6 (en la base, `774`) |
  | `grep -cF "'common.back':" src/i18n/catalog.ts` | `2` |
  | `grep -cF "'register.country': 'País'," src/i18n/catalog.ts` | `1` |
  | `grep -cF '← añadida por #172 (R16)' ../specs/mobile-ui-language/design.md` | `3` |
  | `grep -cF '← cambiada por #172 (R16)' ../specs/mobile-ui-language/design.md` | `1` |
  | `grep -cF '← literal cambiado por #172 (R16)' ../specs/mobile-ui-language/design.md` | `1` |
  | B19 | sin salida |

- Gate verde sobre `language-provider.test.tsx`.
- `git add src/i18n/catalog.ts ../specs/mobile-ui-language/design.md`.

**(3) Refactor:** ninguno.

**Sonda S16c:** deja `register.country` en `'País (código de 2 letras)'` en
`es`. Corre `language-provider.test.tsx` y espera 1 failed: `#172 R16:
declara las claves de cuenta…`, por el valor `es`.

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

## T4 — R4: constantes y `PingoFloat` (c7, c8)

**(1) Rojo, c7:** `test(mobile): Pingo flota 10 px en 3 s en cuenta (R4)`.

- Fichero nuevo: `src/components/__tests__/pingo-float.test.tsx`.
  - Dobla `react-native-reanimated` igual que
    `src/components/__tests__/pop-in.test.tsx`: `...requireActual`,
    `__esModule: true` y `useReducedMotion` mockeado.
  - Usa timers falsos (§Preámbulo).
  - Monta `<PingoFloat testID="float"><Text>Hijo</Text></PingoFloat>`.
  - Los tres `it` de R4:
    - la tabla de tiempos es acumulada (0, 750, 1500, 3000 y 4500 ms);
    - cada avance va con `await act(async () => { jest.advanceTimersByTime(n); })`;
    - los valores (`0`, `-5`, `-10`, `0`, `-10`) son literales del test,
      nunca la constante importada.
- `src/theme/__tests__/motion.test.ts`:
  - en `no exporta nada más`, la lista pasa de 17 a 19 nombres, con
    `'MOTION_PINGO_FLOAT_OFFSET_Y'` y `'MOTION_PINGO_FLOAT_TIMING'` entre
    `'MOTION_FLOAT_TIMING'` y `'MOTION_PING_FROM'`, el orden de `.sort()`
    (Enmienda E2);
  - añade el `describe('#172 R4: la flotación de Pingo en cuenta vive en
    motion.ts')` con el `it` `#172 R4: declara la flotación de Pingo del
    canvas: 10 px y medio ciclo de 1500 ms ease-in-out`, con las aserciones de
    R4. Importa las dos constantes nuevas junto a las de hoy.

| Fichero | `it` | Rojo |
|---|---|---|
| `pingo-float.test.tsx` | fichero entero | módulo (`Cannot find module '../pingo-float'`) |
| `motion.test.ts` | `no exporta nada más` | aserción |
| `motion.test.ts` | `#172 R4: declara la flotación de Pingo…` | aserción (`toBe(10)` recibe `undefined`) |

Gate: `Test Suites: 2 failed`, con 1 suite que no arranca y 2 tests failed en
`motion.test.ts`. En Jest, importar dos nombres que aún no existen da
`undefined`, no un error de módulo; solo `tsc` lo rechaza, y el gate del rojo
no corre `typecheck`.

**(1b) Corrección del rojo, c7b (Enmienda E2):** `test(mobile): orden de sort
en el inventario de motion (R4)`.

c7 se commiteó con las dos líneas nuevas entre `'MOTION_PING_TO_SCALE'` y
`'MOTION_POP_SPRING'`. c7b solo las mueve, en `src/theme/__tests__/motion.test.ts`,
a justo después de `'MOTION_FLOAT_TIMING',` y antes de `'MOTION_PING_FROM',`.
No toca nada más.

- Anclas:

  | Comando | Esperado |
  |---|---|
  | `grep -A3 -F "'MOTION_FLOAT_TIMING'," src/theme/__tests__/motion.test.ts \| tr -d " ,'" \| paste -sd' '` | `MOTION_FLOAT_TIMING MOTION_PINGO_FLOAT_OFFSET_Y MOTION_PINGO_FLOAT_TIMING MOTION_PING_FROM` |
  | `grep -cF "'MOTION_PINGO_FLOAT_" src/theme/__tests__/motion.test.ts` | `2` |
  | `git diff --shortstat HEAD -- src/theme/__tests__/motion.test.ts` (antes de commitear) | ` 1 file changed, 2 insertions(+), 2 deletions(-)` |

- Gate: el mismo comando que c7 y los mismos rojos: `Test Suites: 2 failed,
  2 total` y `Tests: 2 failed, 15 passed, 17 total`, con 1 suite que no
  arranca (`Cannot find module '../pingo-float'`) y 2 aserciones en
  `motion.test.ts`. En `no exporta nada más`, el diff marca con `-` las dos
  líneas nuevas entre `"MOTION_FLOAT_TIMING"` y `"MOTION_PING_FROM"`.

**(2) Verde, c8:** `feat(mobile): Pingo flota 10 px en 3 s en cuenta (R4)`.

- `src/theme/motion.ts`: las dos constantes de R4 van justo después de
  `MOTION_PING_TIMING`, con el comentario `// #172 R4` encima. Las de la
  bienvenida no cambian.
- Fichero nuevo: `src/components/pingo-float.tsx`, según R4:
  - importa `MOTION_PINGO_FLOAT_OFFSET_Y` y `MOTION_PINGO_FLOAT_TIMING` de
    `'../theme/motion'`;
  - el valor compartido se lee y se escribe con `.get()` y `.set()`;
  - el arranque va dentro de `if (!reduceMotion)`;
  - el efecto devuelve una limpieza con `cancelAnimation(translateY)`.
- Anclas:

  | Comando | Esperado |
  |---|---|
  | `grep -cF 'withTiming(-MOTION_PINGO_FLOAT_OFFSET_Y, MOTION_PINGO_FLOAT_TIMING)' src/components/pingo-float.tsx` | `1` |
  | `grep -cF 'cancelAnimation(' src/components/pingo-float.tsx` | `1` |
  | `grep -c 'MOTION_FLOAT_' src/components/pingo-float.tsx` | `0` |
  | B21 | B21 de H0 + 2 (en la base, `19`) |
  | `git diff --quiet <H0> -- src/screens/welcome; echo "exit=$?"` | `exit=0` |

- Gate verde sobre `pingo-float.test.tsx` y `src/theme/__tests__/motion.test.ts`.

**(3) Refactor:** ninguno.

**Sondas:**

| Sonda | Mutación | Corre | Esperado |
|---|---|---|---|
| S4a | quitar el `if (!reduceMotion)` y dejar el arranque | `pingo-float.test.tsx` | 1 failed: `#172 R4: con reduce motion no se mueve` (`-5` a 750 ms) |
| S4b | quitar `withRepeat` y dejar solo `withTiming` | `pingo-float.test.tsx` | 1 failed: `#172 R4: flota…` (a 3000 ms, `-10` en lugar de `0`) |
| S4c | `withTiming(MOTION_PINGO_FLOAT_OFFSET_Y, …)` | `pingo-float.test.tsx` | 1 failed: `#172 R4: flota…` (a 750 ms, `5` en lugar de `-5`) |
| S4d | usar en `pingo-float.tsx` `MOTION_FLOAT_OFFSET_Y` y `MOTION_FLOAT_TIMING` | `pingo-float.test.tsx` | 1 failed: `#172 R4: flota…` (a 750 ms nunca llega a `-5`) |
| S4e | `MOTION_PINGO_FLOAT_OFFSET_Y = 4` en `motion.ts` | `pingo-float.test.tsx` y `motion.test.ts` | 2 failed: `#172 R4: declara la flotación…` y `#172 R4: flota…` |

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

## T7 — R6: tipografía e Inter ExtraBold (c13, c14)

**(1) Rojo, c13:** `test(mobile): recetas de texto e Inter ExtraBold en cuenta (R6)`.

- **Fichero nuevo** `src/__tests__/account-screens-polish.test.ts`:
  - lleva la misma cabecera que `src/__tests__/design-drift.test.ts`: los
    `declare function require` de `fs` y `path`, y
    `const sourceRoot = join(process.cwd(), 'src')`;
  - añade `describe('#172 R6: …')` con el `it.each` `#172 R6: %s pinta
    títulos, etiquetas, cuerpos y CTA con su receta`;
  - las filas son `login`, `register`, `forgot` y `reset-password`, y cada una
    lleva los quince conteos de la tabla de R6, contados con
    `split(literal).length - 1`.
- **Fuente** (`src/theme/__tests__/font-registration.test.ts`): añade
  `describe('#172 R6: el peso 800 del CTA es Inter ExtraBold')` con el `it`
  `#172 R6: carga Inter ExtraBold y la expone como font-extrabold`. Usa las
  `existsSync`, `projectRoot`, `rootLayout` y `globalCss` que el fichero ya
  declara. `interFonts` no cambia.
- **Login:**
  - `#167 R6: el título de la cabecera conserva su clase` se sustituye por
    `#172 R6: el título de la cabecera pesa 30/900 al inicio`;
  - en `#167 R6: la burbuja dice el saludo en español`, el `.toBe` pasa a
    `'text-15 font-semibold text-foreground'`.
- **Registro:** `#167 R7: el título de la cabecera conserva su clase` se
  sustituye por `#172 R6: el título de la cabecera pesa 30/900 al inicio`.
- **Nueva contraseña:** en `#167 R10: el texto de éxito es tinta accent-strong
  y seleccionable`, el `.toBe` pasa a
  `'flex-1 text-15 font-bold text-accent-strong'`.

| Fichero | `it` | Rojo |
|---|---|---|
| polish | `#172 R6: login …` | aserción |
| polish | `#172 R6: register …` | aserción |
| polish | `#172 R6: forgot …` | aserción |
| polish | `#172 R6: reset-password …` | aserción |
| font-registration | `#172 R6: carga Inter ExtraBold…` | aserción (`existsSync` da `false`) |
| login | `#172 R6: el título de la cabecera pesa 30/900 al inicio` | aserción |
| login | `#167 R6: la burbuja dice el saludo en español` | aserción |
| register | `#172 R6: el título de la cabecera pesa 30/900 al inicio` | aserción |
| reset | `#167 R10: el texto de éxito es tinta accent-strong y seleccionable` | aserción |

Gate: 9 failed, repartidos así: polish 4, font-registration 1, login 2,
register 1 y reset 1.

**(2) Verde, c14:** `feat(mobile): recetas de texto e Inter ExtraBold en cuenta (R6)`.

- **El asset.** Se descarga fuera del repo, se verifica y solo entonces se
  copia:

  ```
  mkdir -p /tmp/inter-172
  curl -fL -o /tmp/inter-172/Inter-4.1.zip https://github.com/rsms/inter/releases/download/v4.1/Inter-4.1.zip; echo "exit=$?"
  unzip -o -j /tmp/inter-172/Inter-4.1.zip 'extras/ttf/Inter-ExtraBold.ttf' -d /tmp/inter-172; echo "exit=$?"
  sha256sum /tmp/inter-172/Inter-ExtraBold.ttf
  stat -c %s /tmp/inter-172/Inter-ExtraBold.ttf
  ```

  - `sha256sum` → `e6756ad5690b77606aa62249a7b420d9902d45cae4b0048a24911fd4324b0a22`;
  - `stat` → `421796`;
  - si cuadran los dos, `cp /tmp/inter-172/Inter-ExtraBold.ttf assets/fonts/Inter-ExtraBold.ttf`;
  - si no cuadran, PARA y no copies nada;
  - si el sandbox deniega la red, `curl` o `unzip`, es un error de
    invocación: PARA sin tocar código y pide al humano que deje el fichero en
    `mobile-pet-tracker/assets/fonts/`. Al reanudar, comprueba su `sha256sum`
    y sigue.
- `src/app/_layout.tsx`: en `useFonts`, justo después de la entrada
  `'Inter-Bold'`, va
  `'Inter-ExtraBold': require('../../assets/fonts/Inter-ExtraBold.ttf'),`.
- `src/theme/global.css`: justo después de `--font-bold: 'Inter-Bold';` va
  `--font-extrabold: 'Inter-ExtraBold';`.
- Las cuatro pantallas, según la tabla de R6:
  - cada `<Label className="text-xs font-semibold text-foreground">` pasa a
    `<Label><Label.Text className="text-13 font-semibold text-muted">…</Label.Text></Label>`;
  - en Nueva contraseña, los dos títulos con token (formulario y éxito) pasan
    a `className="flex-1 text-3xl font-black text-foreground"`. El título de
    la rama sin token conserva su `text-2xl`;
  - el `Button.Label` de cada CTA pasa a
    `className="text-17 font-extrabold text-accent-foreground"`, y el de
    `forgot-resend` a `className="text-17 font-extrabold text-foreground"`.
- Anclas:

  | Comando | Esperado |
  |---|---|
  | B3 | `0`, `0`, `0` |
  | B27 | `0` |
  | `grep -cF -- "--font-extrabold: 'Inter-ExtraBold';" src/theme/global.css` | `1` |
  | `sha256sum assets/fonts/Inter-ExtraBold.ttf` | el de arriba |

  Y fuera de la tabla, porque llevan tuberías:
  - `ls assets/fonts | wc -l` → `6`;
  - `grep -rlE $PROD 'extrabold|ExtraBold' src | wc -l` → `5`
    (`_layout.tsx` y las cuatro pantallas).

- Gate verde sobre polish, font-registration, login, register, forgot y reset.
- `git add` con rutas explícitas, incluida `assets/fonts/Inter-ExtraBold.ttf`.

**(3) Refactor:** ninguno.

**Sondas:**

| Sonda | Mutación | Corre | Esperado |
|---|---|---|---|
| S6a | devolver una de las siete `Label.Text` de registro a `text-xs font-semibold text-foreground` | polish | 1 failed: fila `register` (6 en lugar de 7) |
| S6b | `text-17 font-bold text-accent-foreground` en el `Button.Label` de `reset-submit` | polish | 1 failed: fila `reset-password` |
| S6c | quitar `--font-extrabold: 'Inter-ExtraBold';` de `global.css` | font-registration | 1 failed: `#172 R6: carga Inter ExtraBold…` (`toContain`) |

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
- **Nueva contraseña:**
  - el doble de `reicon-react-native` pasa de
    `{ ...actual, Check: mockIcon('icon-check') }` a
    `{ ...actual, AlertCircle: mockIcon('icon-alert-circle'), Check: mockIcon('icon-check') }`.
    El de `use-theme-colors` ya existe y no cambia;
  - añade, dentro del `describe('#167 R10: Pingo y tarjeta de estado en nueva
    contraseña')`, el `it` `#172 R9: el error de nueva contraseña va con icono
    en su fila`. Usa el arreglo de `#167 R10: con error, el error va entre la
    confirmación y el envío` (`mockResetPassword.mockResolvedValue({ kind:
    'invalid-token' })`, `renderRoute('reset-token-167')` y `submitReset()`), y
    después `await screen.findByTestId('reset-error-row')`.
- **Registro:** los dos deltas `#167 R8` de §Deltas de candados.

| Fichero | `it` | Rojo |
|---|---|---|
| form-error | fichero entero | módulo (`Cannot find module '../form-error'`) |
| login | `#172 R9: el error de login…` | consulta (`login-error-row`) |
| forgot | `#172 R9: el error de recuperar…` | consulta (`forgot-error-row`) |
| reset | `#172 R9: el error de nueva contraseña…` | consulta (`reset-error-row`) |
| register | `#167 R8: el error general va en una fila con icono` | aserción |
| register | `#167 R8: el texto del error pesa como el icono` | aserción |

Gate: 1 suite que no arranca y 5 failed (login 1, forgot 1, reset 1 y
register 2).

**(2) Verde, c18:** `feat(mobile): FormError en las cuatro pantallas de cuenta (R9)`.

- Fichero nuevo: `src/components/form-error.tsx`, según R9.
- En login, registro, recuperar y nueva contraseña, el `Text` del error
  general (y en registro, su fila con icono) se sustituye en su sitio por
  `<FormError testID="<pantalla>-error" message={…} />`. En nueva contraseña,
  `message` es el texto que pinta hoy el `Text testID="reset-error"`.
  `reset-missing-token` no cambia.
- Registro deja de importar `AlertCircle` y `useThemeColors`.
- Anclas:

  | Comando | Esperado |
  |---|---|
  | `grep -cE 'AlertCircle\|useThemeColors' src/screens/register/index.tsx` | `0` |
  | `grep -c '<FormError' src/screens/login/index.tsx src/screens/register/index.tsx src/screens/forgot/index.tsx src/screens/reset-password/index.tsx` | `1`, `1`, `1`, `1` |
  | B4 | `0`, `0`, `0`, `2` |
  | `grep -c 'selectable' src/components/form-error.tsx` | `1` |

  La primera ancla es `grep -cE 'AlertCircle|useThemeColors'`; la `\|` es el
  escape de la tabla. Y
  `git diff -U0 <H0> -- src/screens/reset-password/index.tsx | grep -c '^[-+].*reset-missing-token'`
  → `0`: ninguna línea cambiada es de la rama sin token.
- Gate verde sobre form-error, login, register, forgot y reset.

**(3) Refactor:** ninguno.

**Sondas:**

| Sonda | Mutación | Ficheros que se corren | Esperado |
|---|---|---|---|
| S9a | quitar `selectable` en `form-error.tsx` | form-error y login | 2 failed: el tercer `it` de form-error y `#172 R9: el error de login…` |
| S9b | devolver login al `<Text testID="login-error" className="text-danger">{…}</Text>` de la base | login | 1 failed: `#172 R9: el error de login…`, por consulta |
| S9c | devolver nueva contraseña al `<Text testID="reset-error" className="text-danger" selectable>{…}</Text>` de la base | reset | 1 failed: `#172 R9: el error de nueva contraseña…`, por consulta |

---

## T10 — R8: el ojo en los cinco campos de contraseña (c19, c20)

**(1) Rojo, c19:** `test(mobile): mostrar y ocultar la contraseña en cuenta (R8)`.

- **Fichero nuevo** `src/components/__tests__/password-input.test.tsx`:
  - dobla `reicon-react-native` (`{ ...actual, Eye, EyeOff }` → `icon-eye` e
    `icon-eye-off`) y `'../../theme/use-theme-colors'`, como el test de
    registro dobla `AlertCircle` y `useThemeColors`;
  - monta lo que fija R8, con `HeroUINativeProvider` por fuera;
  - lleva los cuatro `it` de R8.
- **Dobles de iconos.** En los tests de login, registro y nueva contraseña,
  el doble de `reicon-react-native` añade `Eye: mockIcon('icon-eye')` y
  `EyeOff: mockIcon('icon-eye-off')` (o el patrón equivalente de cada
  fichero), sin quitar lo que ya dobla.
- **Login:** añade `#172 R8: la contraseña de login lleva su ojo`, con los
  pasos 1 a 3 de R8.
- **Registro:**
  - añade `it.each(['register-password', 'register-password-confirmation'])('#172 R8: %s lleva su propio ojo', …)`,
    con los pasos 1 a 4; el «otro campo» es el de la otra fila;
  - en `#167 R7: campos, errores, términos y envío cuelgan del scroll`, las
    tres líneas del bucle `for (const field of fields)`, de
    `const input = screen.getByTestId(\`register-${field}\`);` a
    `expect(screen.getByTestId(\`register-${field}-error\`).parent).toBe(input.parent);`,
    se sustituyen por las cuatro de R8. Nace verde: hoy el padre del
    `FieldError` es la raíz del `TextField`, que ya contiene al campo.
- **Nueva contraseña:** añade
  `it.each(['reset-password', 'reset-password-confirm'])('#172 R8: %s lleva su propio ojo', …)`,
  con los pasos 1 a 4.

| Fichero | `it` | Rojo |
|---|---|---|
| password-input | fichero entero | módulo (`Cannot find module '../password-input'`) |
| login | `#172 R8: la contraseña de login lleva su ojo` | consulta (`login-password-toggle`) |
| register | `#172 R8: register-password lleva su propio ojo` | consulta (`register-password-toggle`) |
| register | `#172 R8: register-password-confirmation lleva su propio ojo` | consulta (`register-password-confirmation-toggle`) |
| reset | `#172 R8: reset-password lleva su propio ojo` | consulta (`reset-password-toggle`) |
| reset | `#172 R8: reset-password-confirm lleva su propio ojo` | consulta (`reset-password-confirm-toggle`) |

Gate: 1 suite que no arranca y 5 failed (login 1, register 2 y reset 2).
`#167 R7: campos, errores, términos y envío cuelgan del scroll` sale verde.

**(2) Verde, c20:** `feat(mobile): mostrar y ocultar la contraseña en cuenta (R8)`.

- Fichero nuevo: `src/components/password-input.tsx`, según R8:
  - `InputGroup`, `InputGroup.Input` e `InputGroup.Suffix` de `heroui-native`;
  - `Eye` y `EyeOff` de `reicon-react-native`;
  - `useState(false)`, `useThemeColors(['muted'])` y `useTranslate`;
  - las props reenviadas van antes de `testID`, `className` y
    `secureTextEntry`;
  - el ternario de dos llamadas literales de R8.
- Los cinco campos de la tabla de R8 pasan a `<PasswordInput testID="…" …/>`
  dentro de su `TextField`, con sus props de hoy salvo `secureTextEntry` y
  `className`.
- Anclas:

  | Comando | Esperado |
  |---|---|
  | `grep -c '<PasswordInput' src/screens/login/index.tsx src/screens/register/index.tsx src/screens/reset-password/index.tsx` | `1`, `2`, `2` |
  | B28 | `0`, `0`, `0`, `0` |
  | `grep -cF 'secureTextEntry={!visible}' src/components/password-input.tsx` | `1` |
  | `grep -cF "visible ? t('common.hidePassword') : t('common.showPassword')" src/components/password-input.tsx` | `1` |
  | `grep -cF 'className="h-13 rounded-xl bg-default"' src/components/password-input.tsx` | `1` |
  | B22 | `1`, `5`, `1`, `0` |

  Y fuera de la tabla, porque llevan tuberías:
  - `grep -rl $PROD 'InputGroup' src | wc -l` → `1`
    (`src/components/password-input.tsx`);
  - `grep -cwE 'Eye|EyeOff|InputGroup' src/screens/login/index.tsx src/screens/register/index.tsx src/screens/forgot/index.tsx src/screens/reset-password/index.tsx`
    → `0`, `0`, `0`, `0`.
- Gate verde sobre password-input, login, register y reset.

**(3) Refactor:** ninguno.

**Sondas:**

| Sonda | Mutación en `password-input.tsx` salvo S8d | Corre | Esperado |
|---|---|---|---|
| S8a | `useState(true)` | password-input, login, register y reset | 8 failed: password-input 3 (`arranca oculta…`, `el ojo alterna…`, `en inglés…`), login 1, register 2 y reset 2 |
| S8b | intercambiar `Eye` y `EyeOff` | password-input | 2 failed: `arranca oculta…` y `el ojo alterna…` |
| S8c | el estado de módulo con oyentes de R8 | register y reset | 4 failed: las dos filas de cada `it.each` |
| S8d | en `reset-password/index.tsx`, devolver `reset-password-confirm` al `Input` de la base | reset | 1 failed: la fila `reset-password-confirm` (consulta del `-toggle`) |

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
  - Las raíces 5 y 6 son `getByTestId('register-password-group').parent` y
    `getByTestId('register-password-confirmation-group').parent` (R8): el
    campo de contraseña ya no es hijo directo de su `TextField`.
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
| consistency | `deja CONTINUOUS_CORNER, bg-accent-soft y el acento donde estaban` | aserción (18 en lugar de 17) |
| consistency | `conserva los usos de bg-accent-soft que sí son acento` | aserción (18 en lugar de 17) |
| consistency | `no deja la receta del labio fuera de un primario salvo el candado de Recuperar` | aserción (19 en lugar de 20) |

Las cifras entre paréntesis son las de la base. Si H0 mide otra base en
`consistency-classnames.test.ts` (requirements.md §Choques de integración), el
rojo es el mismo con la base de H0: el término de #172 va al final de cada
expresión.

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
  - B7 → B7 de H0 − 1 (en la base, `17`);
  - B8 → B8 de H0 + 1, las dos (en la base, `20` y `20`);
  - B9 → B9 de H0 (en la base, `37`);
  - B17 viejo → `0`, `0`;
  - el literal nuevo en el test de recuperar → `5`, y en consistency → `1`;
  - `grep -c 'LOCK_TILE_CLASS' src/screens/forgot/index.test.tsx` → `0`.
- Gate verde sobre forgot y consistency.

**(3) Refactor:** ninguno.

**Sonda S14:** pon `bg-accent-soft` en lugar de `bg-accent` en el tile. Corre
forgot y consistency y espera 7 failed:

- forgot 4: los cuatro de la tabla del rojo;
- consistency 3: `lleva los tres tiles…` y los dos recuentos de
  `bg-accent-soft` (en la base, 18 en lugar de 17).

---

## T16 — R15: el error de login cuelga del scroll (c31, nace verde)

Commit: `test(mobile): el error de login cuelga del scroll (R15)`.

1. En login, añade `#172 R15: el error cuelga del scroll y no del contenedor
   del teclado`, con el arreglo de `#172 R7: con error…`.
2. **Nace verde** (declarado): hoy el error ya está dentro del scroll. Gate:
   login en verde (25 `it`).
3. **Sonda S15:** mueve el bloque del error (`<FormError testID="login-error"
   …/>` con su condición) justo después de `</ScrollView>`. Corre login y
   espera 2 failed:
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
   | `src/components/password-input.tsx` | `common.showPassword` |
   | `src/components/password-input.tsx` | `common.hidePassword` |
   | `src/screens/register/index.tsx` | `forgot.invalidEmail` |
   | `src/components/back-button.tsx` | `common.back` |

   La fila de hoy `register/index.tsx` × `register.country` no cambia.
2. En `src/__tests__/ui-language.test.ts`:
   - `it('resuelve las 36 ocurrencias normativas'` pasa a `it('resuelve las 41
     ocurrencias normativas'`. Su longitud pasa a
     `toHaveLength(29 + 7 + 1 + 4); // #117 R10, #167 R6, #172 R16`.
   - En el sumatorio de `SCREEN_FILES`, `+ 2 // #172 R16: back-button y
     password-input` va como **último** sumando. El que cierra la suma en H0
     pierde su coma final: en la base es `+ 2 - 2, // #167 R1: …`.
3. **Nace verde** (declarado). Gate: ui-language en verde.
4. Anclas:
   - B10 → B10 de H0 + 4 (en la base, `41`);
   - B20 → B20 de H0 + 2 (en la base, `32`);
   - `grep -cF 'toHaveLength(29 + 7 + 1 + 4); // #117 R10, #167 R6, #172 R16' src/__tests__/ui-language.test.ts`
     → `1`;
   - `grep -cF '+ 2 // #172 R16: back-button y password-input' src/__tests__/ui-language.test.ts`
     → `1`.

   No ancles por el título: `resuelve las 41 ocurrencias normativas` ya existe
   en el `describe` de `#65 R9`, y el grep da 2.
5. **Sondas** (corre ui-language):

   | Sonda | Mutación | Esperado |
   |---|---|---|
   | S16a | en `src/components/back-button.tsx`, `t('common.back')` por `'Volver'` | 3 failed: `resuelve las 41 ocurrencias normativas` y `resuelve cada ocurrencia de la tabla contra la clave exacta` (los dos por `checkUses`: `uses: 0` para `back-button.tsx` × `common.back`) y `no deja ningún valor fijo del catálogo como literal entero en las pantallas` (`es:common.back = Volver`) |
   | S16b | en `src/components/password-input.tsx`, `t(visible ? 'common.hidePassword' : 'common.showPassword')` | 2 failed: `resuelve las 41 ocurrencias normativas` y `resuelve cada ocurrencia…` (`uses: 0` en las dos filas de `password-input.tsx`) |

---

## T18 — R17: guarda de deriva (c33, nace verde)

Commit: `test(mobile): los componentes nuevos entran en la guarda de deriva (R17)`.

1. En `src/__tests__/design-drift.test.ts`, la lista `featureFiles` de los
   cuatro `#167 R14: …` añade, después de `'theme/motion.ts',`:
   - `'components/back-button.tsx',`
   - `'components/form-error.tsx',`
   - `'components/pingo-float.tsx',`
   - `'components/password-input.tsx',`

   La entrada de recuperar de `#149 R4` ya se cambió en c11; la de nueva
   contraseña la cambia c36 (R19).
2. **Nace verde** (declarado). Gate: design-drift en verde (51 `it`).
3. **Sondas** (corre design-drift; cada una da 1 failed):

   | Sonda | Mutación | `it` rojo |
   |---|---|---|
   | S17a | `// sonda '#FFFFFF'` en `src/components/pingo-float.tsx` | `#167 R14: sin hex, clases arbitrarias, StyleSheet ni sombras sueltas` |
   | S17b | `className="h-[52px] rounded-xl bg-default"` en `src/components/password-input.tsx` | `#167 R14: sin hex, clases arbitrarias…` (`ARBITRARY_CLASS`) |
   | S17c | `fallback="/welcome"` en recuperar | `#149 R4: inventaría cada ruta a login en producción` (forgot 1 en lugar de 2) |

   S17d va en T20, porque el enlace que mira lo crea R19.

---

## T19 — R18: enmienda a la carta (c34, c35)

**(1) Rojo, c34:** `test(mobile): la carta declara la enmienda de las pantallas de cuenta (R18)`.

- En polish añade `#172 R18: la carta declara la enmienda #172 y su casilla`,
  según R18: el encabezado, la casilla `[ xX]` y los siete literales
  (`PingoFloat`, `MOTION_PINGO_FLOAT_OFFSET_Y`, `forgot-lock-tile`,
  `font-extrabold`, `h-14`, `h-13` y `PasswordInput`), buscados a partir del
  encabezado.
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

**Sondas** (mutan la carta; corre polish; cada una da 1 failed: `#172 R18`):

| Sonda | Mutación | Por |
|---|---|---|
| S18a | borrar la casilla del bloque `## Enmienda #172` | `toMatch` |
| S18b | `MOTION_FLOAT_OFFSET_Y` en lugar de `MOTION_PINGO_FLOAT_OFFSET_Y` dentro del bloque | `toContain` |

Se revierten con `git checkout HEAD -- ../docs/ui-guidelines.md`.

---

## T20 — R19: la CTA se ancla al pie (c36, c37)

**(1) Rojo, c36:** `test(mobile): la CTA de cuenta se ancla al pie (R19)`.

Ficheros del commit: los cuatro tests de pantalla,
`src/__tests__/account-screens-polish.test.ts`,
`src/__tests__/legibility-classnames.test.ts`,
`src/__tests__/ui-copy-table.ts`, `src/__tests__/ui-language.test.ts` y
`src/__tests__/design-drift.test.ts`. Los cambios son los de R19, en este
orden:

1. **Login.**
   - `centra el contenido dentro de un ScrollView con los insets aplicados`
     pasa a `#172 R19: ancla el contenido al pie dentro de un ScrollView con
     los insets aplicados`, con el `toEqual` sin `justifyContent`.
   - Añade `#172 R19: el espaciador empuja el envío al pie`.
   - En `#167 R6: entra en dos tiempos, cabecera y cuerpo`, `'login-body'` pasa
     a `className: 'flex-1 gap-4'`.
2. **Registro.**
   - `aplica el padding del contentContainerStyle con los safe-area insets`
     añade `flexGrow: 1` a su `toEqual`.
   - Añade `#172 R19: el espaciador empuja el envío al pie`.
   - En `#172 R11: cabecera, rejilla, términos, error y envío cuelgan del
     scroll`, `content.children` pasa a longitud 10, con `register-spacer` en
     la posición 9 y `register-submit` en la 10.
3. **Recuperar.**
   - `conserva el centrado de hoy dentro de un ScrollView con insets` pasa a
     `#172 R19: centra en horizontal pero no en vertical dentro de un
     ScrollView con insets`, con el `toEqual` sin `justifyContent`.
   - Añade `#172 R19: el espaciador empuja la CTA al pie en los dos estados`.
4. **Nueva contraseña.**
   - En el `describe` `#61 R8: las tres ramas de reset tienen contenedor de
     scroll`, la constante `metrics` pierde `justifyContent: 'center'`.
   - `la rama sin token centra también en horizontal` pasa a
     `toEqual({ ...metrics, justifyContent: 'center', alignItems: 'center' })`.
   - `la rama de éxito centra también en horizontal` pasa a `#172 R19: la
     rama de éxito ancla el enlace al pie y no centra`, con `toEqual(metrics)`.
   - `la rama del formulario no centra en horizontal` pasa a `#172 R19: la
     rama del formulario ancla el envío al pie y no centra`, con
     `toEqual(metrics)`.
   - En `#167 R10: el formulario entra en dos tiempos`, `'reset-header'` pasa
     a `className: 'flex-row items-center gap-3'` y `'reset-body'` a
     `className: 'flex-1 gap-4'`.
   - En `#167 R10: el éxito conserva la cabecera del formulario`, el
     `className` esperado pasa a `'flex-row items-center gap-3'`.
   - Añade `#172 R19: el espaciador empuja el envío al pie del formulario`,
     `#172 R19: el espaciador empuja el enlace al pie del éxito` y
     `#172 R19: el formulario lleva el enlace de vuelta al login bajo el
     envío`.
5. **Polish.** Añade `#172 R19: el contenido de cuenta no se centra en
   vertical y el enlace de nueva contraseña lleva su receta`, con la tabla de
   R19 (un `expect` de conteo exacto por celda).
6. **Legibilidad.**
   - En `inkSites`, la entrada de `reset-password` pasa de `3` a
     `4, // #172 R19: link-login del formulario`.
   - La suma de `suma las trece ocurrencias que enumera la spec` añade
     `+ 1, // #172 R19` como último sumando. El que cierra la suma en H0
     pierde su coma final; en la base es `+ 1, // #167 R10`.
7. **Tabla de copy.** `R11_RESET` añade al final
   `{ file: 'src/screens/reset-password/index.tsx', key: 'resetPassword.backToSignIn' }, // #172 R19`.
   En ui-language, `resuelve las 15 ocurrencias normativas` pasa a
   `resuelve las 16 ocurrencias normativas`, con
   `toHaveLength(15 + 1); // #172 R19`.
8. **Deriva.** En `loginRoutes` de `#149 R4`,
   `'screens/reset-password/index.tsx'` pasa de `2` a
   `3, // #172 R19: link-login del formulario`.

Rojos esperados (20):

| Fichero | `it` | Rojo |
|---|---|---|
| login | `#172 R19: ancla el contenido al pie…` | aserción (`toEqual`) |
| login | `#172 R19: el espaciador empuja el envío al pie` | consulta (`login-spacer`) |
| login | `#167 R6: entra en dos tiempos, cabecera y cuerpo` | aserción (`className` de `login-body`) |
| register | `aplica el padding del contentContainerStyle…` | aserción (`toEqual`) |
| register | `#172 R19: el espaciador empuja el envío al pie` | consulta (`register-spacer`) |
| register | `#172 R11: cabecera, rejilla, términos, error y envío…` | aserción (longitud 9 y no 10) |
| forgot | `#172 R19: centra en horizontal pero no en vertical…` | aserción (`toEqual`) |
| forgot | `#172 R19: el espaciador empuja la CTA al pie en los dos estados` | consulta (`forgot-spacer`) |
| reset | `#172 R19: la rama de éxito ancla el enlace al pie y no centra` | aserción (`toEqual`) |
| reset | `#172 R19: la rama del formulario ancla el envío al pie y no centra` | aserción (`toEqual`) |
| reset | `#167 R10: el formulario entra en dos tiempos` | aserción (`className`) |
| reset | `#167 R10: el éxito conserva la cabecera del formulario` | aserción (`className`) |
| reset | `#172 R19: el espaciador empuja el envío al pie del formulario` | consulta (`reset-spacer`) |
| reset | `#172 R19: el espaciador empuja el enlace al pie del éxito` | consulta (`reset-spacer`) |
| reset | `#172 R19: el formulario lleva el enlace de vuelta al login…` | consulta (`within(reset-body)` sin `link-login`) |
| polish | `#172 R19: el contenido de cuenta no se centra…` | aserción (conteo) |
| legibility | `%s pinta con text-accent-strong (%i)`, fila `reset-password` | aserción (3 y no 4) |
| ui-language | `resuelve las 16 ocurrencias normativas` | aserción (`checkUses(R11_RESET)`: `uses` 2 y no 3 para `resetPassword.backToSignIn`) |
| ui-language | `resuelve cada ocurrencia de la tabla contra la clave exacta` | aserción (la misma fila, por `checkUses(ALL_USES)`) |
| design-drift | `#149 R4: inventaría cada ruta a login en producción` | aserción (reset 2 y no 3) |

Siguen verdes, con su literal cambiado: `la rama sin token centra también en
horizontal` (el objeto esperado es el de hoy) y `suma las trece ocurrencias
que enumera la spec` (suma la tabla, no producción). También siguen verdes los `it` que R19 lista en
«Siguen verdes sin cambios».

Gate:
`$J src/screens/login/index.test.tsx src/screens/register/index.test.tsx src/screens/forgot/index.test.tsx src/screens/reset-password/index.test.tsx src/__tests__/account-screens-polish.test.ts src/__tests__/legibility-classnames.test.ts src/__tests__/ui-language.test.ts src/__tests__/design-drift.test.ts; echo "exit=$?"`
→ `exit=1`, con `Tests: 20 failed`.

**(2) Verde, c37:** `feat(mobile): la CTA de cuenta se ancla al pie (R19)`.

- Los cuatro `contentContainerStyle` según la tabla de R19. La rama sin
  token de Nueva contraseña no cambia.
- Los espaciadores `<View testID="<id>" className="flex-1" />`, cada uno como
  hermano inmediatamente anterior de su CTA. El de Recuperar va sin
  condición, delante de los dos botones condicionales.
- `login-body` y `reset-body` pasan a `className="flex-1 gap-4"`.
- `reset-header` pasa a `className="flex-row items-center gap-3"`, en el
  formulario y en el éxito.
- El `link-login` nuevo del formulario, dentro de `reset-body` y justo
  después de `reset-submit`, con el bloque de R19.
- El `link-login` del éxito pasa a `className="h-13 w-full"`, y su
  `LinkButton.Label` a `className="text-base font-bold text-accent-strong"`.
- Anclas:

  | Comando | Esperado |
  |---|---|
  | B23 | `0`, `0`, `0`, `1` ; `0`, `0`, `1`, `1` |
  | `grep -cF -- '-spacer" className="flex-1" />'` en las cuatro pantallas | `1`, `1`, `1`, `2` |
  | `grep -cF 'self-center'` en las cuatro pantallas | `0`, `0`, `0`, `0` |
  | `grep -cF 'className="flex-1 gap-4"' src/screens/login/index.tsx src/screens/reset-password/index.tsx` | `1`, `1` |
  | B5 | `2`, `0`, `1`, `4` |
  | B6 | `0`, `1`, `1`, `3` |

  Y fuera de la tabla, porque lleva tubería:
  `git diff -U0 <H0> -- src/screens/reset-password/index.tsx | grep -c '^[-+].*reset-missing-token'`
  → `0`.
- Gate verde sobre los cuatro tests de pantalla y polish (las guardas ya van
  en `$GUARDAS`).

**(3) Refactor:** ninguno.

**Sondas:**

| Sonda | Mutación | Corre | Esperado |
|---|---|---|---|
| S19a | `justifyContent: 'center'` de vuelta en el scroll de login | login y polish | 2 failed: `#172 R19: ancla el contenido al pie…` (`toEqual`) y `#172 R19: el contenido de cuenta no se centra…` (fila login) |
| S19b | `login-spacer` detrás de `login-submit` | login | 1 failed: `#172 R19: el espaciador empuja el envío al pie` (paso 2) |
| S19c | `{!sent ? <View testID="forgot-spacer" className="flex-1" /> : null}` en Recuperar | forgot | 1 failed: `#172 R19: el espaciador empuja la CTA al pie en los dos estados` (consulta en «Revisa tu correo») |
| S19d | `reset-body` de vuelta a `className="gap-4"` | reset | 1 failed: `#167 R10: el formulario entra en dos tiempos` |
| S19e | el `link-login` del formulario fuera de `reset-body`, justo después de su `</HomeEntrance>` | reset | 2 failed: `#172 R19: el formulario lleva el enlace…` (consulta) y `#167 R10: la cabecera va antes que el cuerpo en el scroll` (tres hijos y no dos) |
| S19f | `register-form` sin `flexGrow: 1` | register | 1 failed: `aplica el padding del contentContainerStyle…` |
| S17d | quitar el `link-login` del formulario de Nueva contraseña | reset, polish, legibility, ui-language y design-drift | 6 failed: `#172 R19: el formulario lleva el enlace…` (consulta), `#172 R19: el contenido de cuenta no se centra…` (fila reset-password), la fila `reset-password` de `%s pinta con text-accent-strong (%i)`, `resuelve las 16 ocurrencias normativas`, `resuelve cada ocurrencia de la tabla contra la clave exacta` y `#149 R4: inventaría cada ruta a login en producción` |

---

## T21 — R20: CTA de 56 e inputs de 52 (c38, c39)

**(1) Rojo, c38:** `test(mobile): CTA de 56 e inputs de 52 en las pantallas de cuenta (R20)`.

- En polish añade `#172 R20: %s pinta la CTA de 56 y los inputs de 52`, un
  `it.each` sobre los cinco ficheros de la tabla de R20 (las cuatro pantallas
  y `src/components/password-input.tsx`), con un `expect` de conteo exacto
  por fila (`split(literal).length - 1`).
- En los cuatro `it` de `#127 R1` de R20, el `className` esperado inserta
  `h-14 ` justo después de `w-full `. Los títulos no cambian.

| Fichero | `it` | Rojo |
|---|---|---|
| polish | `#172 R20: …`, filas login, register, forgot y reset-password | aserción (CTA 0 y no 1) |
| login | `pinta login-submit con la clase exacta…` | aserción |
| register | `pinta register-submit, deshabilitado al montar, con la clase exacta…` | aserción |
| forgot | `pinta forgot-submit, deshabilitado, con la clase exacta…` | aserción |
| reset | `pinta reset-submit con la clase exacta…` | aserción |

La fila `password-input` nace verde: R8 ya puso `h-13` (sonda S20d).

Gate:
`$J src/__tests__/account-screens-polish.test.ts src/screens/login/index.test.tsx src/screens/register/index.test.tsx src/screens/forgot/index.test.tsx src/screens/reset-password/index.test.tsx; echo "exit=$?"`
→ `exit=1`, con `Tests: 8 failed`.

**(2) Verde, c39:** `feat(mobile): CTA de 56 e inputs de 52 en las pantallas de cuenta (R20)`.

- Las cinco CTA de la tabla de R20 añaden `h-14` justo detrás de `w-full`,
  incluida `forgot-resend`. El `size` no cambia.
- Cada `className="rounded-xl bg-default"` de un `Input` de las cuatro
  pantallas pasa a `className="h-13 rounded-xl bg-default"`.
- Anclas:

  | Comando | Esperado |
  |---|---|
  | B22 | `1`, `5`, `1`, `0` |
  | `grep -cF 'className="rounded-xl bg-default"'` en las cuatro pantallas | `0`, `0`, `0`, `0` |
  | B26 | `0`, `0`, `0`, `0` ; `0`, `0`, `0`, `0` |
  | B25 | `5` (las cuatro pantallas y `password-input.tsx`) |

- Gate verde sobre polish, password-input y los cuatro tests de pantalla.
  `consistency-classnames` (en `$GUARDAS`) sigue con 19 primarios.

**(3) Refactor:** ninguno.

**Sondas:**

| Sonda | Mutación | Corre | Esperado |
|---|---|---|---|
| S20a | quitar `h-14` de `forgot-resend` | polish | 1 failed: fila `forgot` de `#172 R20` |
| S20b | el correo de login de vuelta a `className="rounded-xl bg-default"` | polish | 1 failed: fila `login` de `#172 R20` |
| S20c | `size="lg"` en `reset-submit` | reset | 1 failed: `pinta reset-submit con la clase exacta…` (`button__root--size-lg`) |
| S20d | quitar `h-13 ` del `className` de `password-input.tsx` | polish y password-input | 2 failed: fila `password-input` de `#172 R20` y `#172 R8: el grupo envuelve el campo de 52 y el botón de 44` |

---

## T22 — Cierre técnico (sin commit de código)

1. `cd mobile-pet-tracker`
2. **Cuentas.** Cada fichero de §Cuentas da su «Total» final (o H0 + delta).
3. **Jest.**
   - `$J $BASE src/components/__tests__/back-button.test.tsx src/components/__tests__/pingo-float.test.tsx src/components/__tests__/form-error.test.tsx src/components/__tests__/password-input.test.tsx src/__tests__/account-screens-polish.test.ts; echo "exit=$?"`
     → `exit=0`, con `Test Suites: 17 passed`. Los tests son los de T0 paso 7
     más 61.
   - `$J $READERS; echo "exit=$?"` → `exit=0`.
4. **Typecheck y lint**, según §Preámbulo.
5. **Anclas al cerrar:**

   | Ancla | Valor |
   |---|---|
   | B3 | `0`, `0`, `0` |
   | B4 | `0`, `0`, `0`, `2` |
   | B5 | `2`, `0`, `1`, `4` |
   | B6 | `0`, `1`, `1`, `3` (las comillas dobles de `fallback="/login"` no cuentan) |
   | `grep -c 'fallback="/login"' src/screens/forgot/index.tsx` | `1` |
   | B7 | B7 de H0 − 1 (en la base, `17`) |
   | B8 | B8 de H0 + 1, las dos (en la base, `20` y `20`) |
   | B9 | B9 de H0 (en la base, `37`) |
   | B10 | B10 de H0 + 4 (en la base, `41`) |
   | B11 | B11 de H0 + 6 (en la base, `774`) |
   | B12 | `7` |
   | B14 | `1` |
   | B15 | `1` |
   | B16 | `### §2.N — Añadidos por #172 — Las pantallas de cuenta como el canvas`, con N el siguiente libre tras la última §2 de H0 (en la base, 27) |
   | B17 (literal viejo) | `0`, `0` |
   | literal nuevo del tile | `5` en el test de recuperar, `1` en consistency, `1` en `src/screens/forgot/index.tsx` |
   | `grep -c 'LOCK_TILE_CLASS' src/screens/forgot/index.test.tsx` | `0` |
   | `grep -c -- '-message"' src/screens/register/index.tsx` | `7` |
   | B20 | B20 de H0 + 2 (en la base, `32`) |
   | B21 | B21 de H0 + 2 (en la base, `19`) |
   | B22 | `1`, `5`, `1`, `0` |
   | B23 | `0`, `0`, `0`, `1` ; `0`, `0`, `1`, `1` |
   | `grep -cF -- "--font-extrabold: 'Inter-ExtraBold';" src/theme/global.css` | `1` |
   | `sha256sum assets/fonts/Inter-ExtraBold.ttf` | `e6756ad5690b77606aa62249a7b420d9902d45cae4b0048a24911fd4324b0a22` |
   | B26 | `0`, `0`, `0`, `0` ; `0`, `0`, `0`, `0` |
   | B27 | `0` |
   | B28 | `0`, `0`, `0`, `0` |
   | casillas `^- \[[ xX]\] Enmienda aprobada por humano` de la carta | `5` |

   Y fuera de la tabla, porque llevan tuberías:
   - `grep -rl $PROD 'InputGroup' src | wc -l` → `1`;
   - `grep -rl $PROD 'flex-2' src | wc -l` → `1`;
   - B19 → sin salida;
   - `ls assets/fonts | wc -l` → `6`;
   - `grep -rlE $PROD 'extrabold|ExtraBold' src | wc -l` → `5`;
   - B25 → `5`;
   - `git diff -U0 <H0> -- src/screens/reset-password/index.tsx | grep -c '^[-+].*reset-missing-token'`
     → `0`.
6. **Sin cambios contra H0.**
   `git diff --quiet <H0> -- package.json bun.lock src/components/card.tsx src/screens/welcome; echo "exit=$?"`
   → `exit=0`. `src/theme/motion.ts` sí cambia (R4): solo añade las dos
   constantes de Pingo, y `MOTION_FLOAT_OFFSET_Y` y `MOTION_FLOAT_TIMING`
   siguen como en H0.
7. **Historial.** `git log --oneline <H0>..HEAD` muestra c1–c7, c7b y c8–c39 en orden (Enmienda E2),
   más los commits del leader y los dos `docs` de la parada de c8.
   Ningún commit mezcla tests rojos con implementación.
8. **Informe y trazabilidad.**
   - Escribe `progress/impl_mobile-account-screens-polish.md`, con las salidas
     literales de cada gate y de cada sonda.
   - Rellena `specs/mobile-account-screens-polish/traceability.md`: hash y
     mensaje por R, y los `it` de cada R. La fila de R21 queda «pendiente
     (humano)».
   - Commitéalos con rutas explícitas en
     `docs(mobile-account-screens-polish): #172 trazabilidad`.
9. **No ejecutes `./init.sh`.** Lo ejecuta el leader antes del reviewer.

---

## T23 — R21: prueba de humo en dev build de Android (humano)

No la corre ninguna IA.

1. `cd mobile-pet-tracker && bunx expo start --dev-client`, y abre el dev
   build de Android (no Expo Go).
2. Recorre la lista de `traceability.md` §Prueba de humo (R21), en español y
   en inglés, con reducir movimiento apagado y encendido.
3. Firma la casilla de esa sección con fecha y dispositivo.
