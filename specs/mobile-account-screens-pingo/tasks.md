---
feature: "mobile-account-screens-pingo"
status: draft   # draft | spec_ready | approved — pendiente de firma humana
tags: [mobile, ui, spec]
---

# Tareas — [[mobile-account-screens-pingo]] (#167)

> Base congelada `d2b8b0ae`. Requisitos en [requirements.md](requirements.md) y
> diseño en [design.md](design.md). Cada R tiene un bloque (1) test rojo,
> (2) implementación mínima, (3) refactor. Las excepciones están declaradas: R1
> es un movimiento verde, y R1.6, R13, R14 y una cláusula de R11 nacen verdes,
> cada una con su sonda de mutación.

---

## Preámbulo (vale para todas las tareas)

- Todos los comandos se lanzan desde `mobile-pet-tracker/`: el primero de cada
  bloque es `cd mobile-pet-tracker`. Si un comando falla por directorio
  (`Cannot find module`, `ENOENT` de `package.json`), es un error de invocación:
  repite con el `cd` y no toques código.
- Solo `bunx` y `bun run`, nunca `npx` ni `npm`.
- Jest siempre con `--runTestsByPath` y las rutas con paréntesis entre comillas
  simples: `bunx jest --runTestsByPath 'src/app/(auth)/login.tsx'`. Sin
  comillas, `(auth)` es una regex y Jest salta el fichero con exit 0.
- Ficheros de producción para los greps:
  `PROD="--include=*.ts --include=*.tsx --exclude=*.test.ts --exclude=*.test.tsx --exclude-dir=__tests__"`.
- **Commits.** Rojo `test(mobile): <qué> (Rn)` y verde `feat(mobile): <qué> (Rn)`,
  en commits separados y en ese orden. El rojo solo contiene tests y candados;
  el verde, la implementación. Un commit nunca mezcla dos R.
- **Gates por commit.** En el rojo, Jest de los ficheros del commit con
  exactamente los rojos de su tabla (ni uno más, ni uno menos). En el verde,
  Jest de los mismos ficheros en verde, `bun run typecheck` con exit 0 y
  `bunx expo lint --no-cache` con exit 0. Si lint reporta `prettier/prettier`,
  `bunx prettier --write <ficheros del commit>` y vuelve a lanzar lint.
- **Tests.**
  - `await render(...)` y `await fireEvent.<x>(...)` siempre: RNTL 14 los hace
    asíncronos.
  - Timers falsos solo en los `describe` de línea de tiempo (R3, R12), con
    `jest.useFakeTimers()` en `beforeEach` y `jest.useRealTimers()` en
    `afterEach`.
  - Los comentarios de trazabilidad son `// #167 Rn`. Un `#167` suelto casa
    `HEX_LITERAL`.
  - Nada de clases arbitrarias (`algo-[...]`) en tests: C8 también escanea tests.
  - `within(x)` busca en los descendientes de `x`, no en `x`.
  - Los estilos se candean con `toEqual` del objeto completo, no con
    `objectContaining`.
- **Rojos por consulta o por aserción.** En cada tabla de rojos esperados,
  «consulta» significa que el `it` cae en un `getBy*` porque el nodo aún no
  existe, y «aserción» que el nodo existe pero el valor es otro. Si un rojo
  sale del tipo contrario al de la tabla, PARA y reporta.
- **Sonda de mutación.** Se planta la mutación, se corre el test (rojo
  esperado), se revierte con `git checkout HEAD -- <fichero>` y se comprueba
  `git diff --quiet HEAD -- <fichero>; echo "exit=$?"` → `exit=0`. Nunca se
  commitea.

---

## Cuentas de `it` (acumuladas)

Se cuentan con `grep -cE '^\s*it(\.each)?[(<]' <fichero>`. Un `it.each` cuenta
como uno. El total de cada commit es el anterior más los `it` añadidos.

| Fichero | Base | Commit | Añade | Total |
|---|---|---|---|---|
| `src/screens/login/index.test.tsx` (desde `src/app/(auth)/__tests__/login.test.tsx`) | 8 | c1 (mv) | 0 | 8 |
| | | c11 (R6) | 9 | 17 |
| `src/screens/register/index.test.tsx` (desde `src/app/(auth)/__tests__/register.test.tsx`) | 11 | c1 (mv) | 0 | 11 |
| | | c13 (R7) | 4 | 15 |
| | | c15 (R8) | 4 | 19 |
| `src/__tests__/design-drift.test.ts` | 46 | c2 (R1.6) | 1 | 47 |
| | | c26 (R14) | 4 | 51 |
| `src/theme/__tests__/motion.test.ts` | 12 | c3 (R2) | 4 | 16 |
| `src/components/__tests__/pop-in.test.tsx` | 0 | c5 (R3) | 4 | 4 |
| `src/screens/home/home-entrance.test.tsx` | 6 | c7 (R4) | 1 | 7 |
| `src/providers/__tests__/language-provider.test.tsx` | 16 | c9 (R5) | 1 | 17 |
| `src/screens/forgot/index.test.tsx` | 24 | c17 (R9) | 4 | 28 |
| `src/screens/reset-password/index.test.tsx` | 13 | c19 (R10) | 10 | 23 |
| `src/screens/welcome/index.test.tsx` | 63 | c21 (R11) | 4 | 67 |
| | | c23 (R12) | 10 | 77 |
| | | c25 (R13) | 2 | 79 |
| `src/__tests__/ui-language.test.ts` | 28 | — | 0 | 28 |
| `src/__tests__/consistency-classnames.test.ts` | 33 | — | 0 | 33 |
| `src/__tests__/legibility-classnames.test.ts` | 12 | — | 0 | 12 |

---

## T0 — Base y entorno (sin commit)

1. `cd mobile-pet-tracker`
2. `git rev-parse HEAD` debe dar el HEAD del handoff, y `git status --short`
   debe salir vacío.
3. `test ! -e .expo/types/router.d.ts; echo "exit=$?"` → `exit=0`. Si sale
   `exit=1`, PARA: el humano borra ese fichero (tipos de rutas obsoletos).
4. Ejecuta las anclas B1–B31 de requirements.md §Base medida. Cada salida debe
   coincidir. Si alguna no coincide, PARA y reporta la tabla medida.
5. Ejecuta las cuentas de la columna «Base» de §Cuentas.
6. `bunx jest; echo "exit=$?"` → `exit=0`. Anota el número de suites y de tests.
7. `bun run typecheck; echo "exit=$?"` → `exit=0`.
8. `bunx expo lint --no-cache; echo "exit=$?"` → `exit=0`.

---

## T1 — R1: movimiento puro (c1, verde)

Commit único y verde: `refactor(mobile): mueve login y registro a src/screens (R1)`.
No cambia comportamiento.

1. `mkdir -p src/screens/login src/screens/register`
2. `git mv 'src/app/(auth)/login.tsx' src/screens/login/index.tsx`
3. `git mv 'src/app/(auth)/register.tsx' src/screens/register/index.tsx`
4. `git mv 'src/app/(auth)/__tests__/login.test.tsx' src/screens/login/index.test.tsx`
5. `git mv 'src/app/(auth)/__tests__/register.test.tsx' src/screens/register/index.test.tsx`
6. En `src/screens/login/index.tsx`, `export default function Login()` pasa a
   `export function LoginScreen()`. En `src/screens/register/index.tsx`,
   `export default function Register()` pasa a `export function RegisterScreen()`.
   No cambia nada más: los imports `'../../...'` siguen resolviendo.
7. Crea `src/app/(auth)/login.tsx` y `src/app/(auth)/register.tsx` con el
   contenido exacto de R1.1 y R1.2 (5 líneas y salto final).
8. En los dos tests movidos:
   - todo `'../../../` pasa a `'../../` (en `import` y en `jest.mock`);
   - el import del componente pasa a `import LoginRoute from '../../app/(auth)/login';`
     (o `RegisterRoute` desde `'../../app/(auth)/register'`), y el JSX
     `<Login />` / `<Register />` a `<LoginRoute />` / `<RegisterRoute />`.

   Los títulos y el número de `it` no cambian.
9. Candados que nombran las rutas viejas. Sustituye literal por literal:

   | Fichero | Literal viejo | Literal nuevo | Apariciones |
   |---|---|---|---|
   | `src/__tests__/ui-copy-table.ts` | `'src/app/(auth)/login.tsx'` | `'src/screens/login/index.tsx'` | 10 |
   | `src/__tests__/ui-copy-table.ts` | `'src/app/(auth)/register.tsx'` | `'src/screens/register/index.tsx'` | 14 |
   | `src/__tests__/consistency-classnames.test.ts` | `join('app', '(auth)', 'login.tsx')` | `join('screens', 'login', 'index.tsx')` | 2 |
   | `src/__tests__/consistency-classnames.test.ts` | `join('app', '(auth)', 'register.tsx')` | `join('screens', 'register', 'index.tsx')` | 2 |
   | `src/__tests__/legibility-classnames.test.ts` | `[join('app', '(auth)', 'login.tsx'), 2]` | `[join('screens', 'login', 'index.tsx'), 2]` | 1 |
   | `src/__tests__/design-drift.test.ts` | `'app/(auth)/register.tsx': 1,` | `'screens/register/index.tsx': 1,` | 1 |

   En `src/__tests__/ui-language.test.ts`, la línea `+ 1, // #134 R6` pasa a
   `+ 1 // #134 R6` y debajo se añade, con la misma sangría:
   `+ 2 - 2, // #167 R1: salen app/(auth)/login.tsx y app/(auth)/register.tsx, entran screens/login/index.tsx y screens/register/index.tsx`
10. Anclas tras c1:

    ```
    grep -cF 'export function LoginScreen()' src/screens/login/index.tsx      # 1
    grep -cF 'export function RegisterScreen()' src/screens/register/index.tsx # 1
    grep -cF 'export default' src/screens/login/index.tsx src/screens/register/index.tsx  # :0 y :0
    grep -cF "'src/screens/login/index.tsx'" src/__tests__/ui-copy-table.ts     # 10
    grep -cF "'src/screens/register/index.tsx'" src/__tests__/ui-copy-table.ts  # 14
    grep -cF "'src/app/(auth)/" src/__tests__/ui-copy-table.ts                 # 0
    grep -cF '+ 2 - 2, // #167 R1' src/__tests__/ui-language.test.ts           # 1
    grep -rlE "\(auth\)[/'\", ]+(login|register)" src --include=*.ts --include=*.tsx | wc -l  # 0
    test -e 'src/app/(auth)/__tests__/layout.test.tsx'; echo $?                 # 0
    ```

11. `bunx jest; echo "exit=$?"` → `exit=0`, con el mismo número de suites y de
    tests que en T0. `bun run typecheck` y `bunx expo lint --no-cache` con exit 0.

---

## T2 — R1.6: las rutas delgadas, candadas (c2, nace verde)

Commit: `test(mobile): rutas delgadas de login y registro (R1)`.

1. **Test.** En `src/__tests__/design-drift.test.ts`, al final:
   `describe('#167 R1: las rutas de login y registro son delgadas')` con un
   `it('#167 R1: cada ruta solo renderiza su pantalla')`. Lee
   `join(sourceRoot, 'app', '(auth)', 'login.tsx')` y `...register.tsx`, y los
   compara con `toBe` contra el contenido exacto de R1.1 y R1.2, como literales
   de plantilla con su salto final.
2. **Nace verde** (declarado). `bunx jest --runTestsByPath src/__tests__/design-drift.test.ts`
   da 47 `it` en verde.
3. **Sondas** (dos, una por fichero):
   - añade `// sonda` como primera línea de `src/app/(auth)/login.tsx`: el `it`
     cae por aserción; revierte;
   - lo mismo en `src/app/(auth)/register.tsx`: cae por aserción; revierte.

---

## T3 — R2: tokens de movimiento

**(1) Rojo, c3:** `test(mobile): tokens de pop y ping (R2)`. En
`src/theme/__tests__/motion.test.ts`:

- la lista ordenada del `it('no exporta nada más')` gana `'MOTION_PING_FROM'`,
  `'MOTION_PING_TIMING'`, `'MOTION_PING_TO_SCALE'` y `'MOTION_POP_SPRING'` en
  su posición alfabética;
- cuatro `it` nuevos, con los literales de R2.2:
  - `#167 R2: MOTION_POP_SPRING es un muelle de 400 ms con dampingRatio 0.6`
  - `#167 R2: MOTION_PING_FROM vale 0.55`
  - `#167 R2: MOTION_PING_TO_SCALE vale 1.5`
  - `#167 R2: MOTION_PING_TIMING dura 2400 ms con la curva de salida`

| `it` | Rojo |
|---|---|
| `no exporta nada más` | aserción |
| los cuatro `#167 R2` | aserción (`undefined`) |

**(2) Verde, c4:** `feat(mobile): tokens de pop y ping (R2)`. Añade los cuatro
exports de R2.1 a `src/theme/motion.ts`, cada uno con `// #167 R2` encima.

```
grep -cF '// #167 R2' src/theme/motion.ts   # 4
```

**(3) Refactor:** ninguno previsto.

---

## T4 — R3: `PopIn`

**(1) Rojo, c5:** `test(mobile): PopIn entra con escala y fundido (R3)`. Crea
`src/components/__tests__/pop-in.test.tsx`.

- Mock de Reanimated como en design.md §Dobles:
  `{ ...actual, __esModule: true, useReducedMotion: () => mockUseReducedMotion() }`.
- `describe` con timers falsos. El estilo animado se lee con `getAnimatedStyle`
  de `react-native-reanimated` sobre `screen.getByTestId(...)`.
- Cuatro `it`:
  1. `#167 R3: entra desde opacidad 0 y escala 0.9 tras 250 ms`: a los 200 ms,
     `{ opacity: 0, transform: [{ scale: 0.9 }] }`; a los 1500 ms,
     `{ opacity: 1, transform: [{ scale: 1 }] }`.
  2. `#167 R3: con reduce motion funde la opacidad y no escala`: a los 0 ms y
     a los 200 ms, `{ opacity: 0, transform: [{ scale: 1 }] }`; a los 1500 ms,
     `{ opacity: 1, transform: [{ scale: 1 }] }`.
  3. `#167 R3: pasa testID, className, style y children`: con
     `style={{ borderCurve: 'continuous' }}` y `className="size-16"`, a los 0 ms
     el estilo es `{ borderCurve: 'continuous', opacity: 0, transform: [{ scale: 0.9 }] }`,
     `props.className` es `'size-16'`, y un hijo `<Text testID="pop-child">` se
     encuentra con `within`.
  4. `#167 R3: sin className ni style no añade nada propio`: `props.className`
     es `undefined` y el estilo a los 0 ms es solo
     `{ opacity: 0, transform: [{ scale: 0.9 }] }`.

| `it` | Rojo |
|---|---|
| el fichero entero | `Cannot find module '../pop-in'`: la suite falla sin ejecutar ningún `it` |

**(2) Verde, c6:** `feat(mobile): PopIn (R3)`. Crea `src/components/pop-in.tsx`
según R3.1–R3.5. Opacidad inicial 0. Escala inicial `MOTION_ENTRANCE_SCALE`, o
1 con reduce motion. En un `useEffect` de montaje:

- `opacity.set(withDelay(MOTION_TRANSITION_MS, withTiming(1, MOTION_FADE_TIMING), ReduceMotion.Never))`;
- si no hay reduce motion,
  `scale.set(withDelay(MOTION_TRANSITION_MS, withSpring(1, MOTION_POP_SPRING)))`.

Usa `.get()` y `.set()`, no `.value`.

**(3) Refactor:** ninguno previsto.

---

## T5 — R4: `HomeEntrance` acepta `className`

**(1) Rojo, c7:** `test(mobile): HomeEntrance pasa className (R4)`. En
`src/screens/home/home-entrance.test.tsx`, un `it('#167 R4: pasa className tal cual sin añadir style')`:
con `className="gap-4"`, `props.className` es `'gap-4'` y `props.style` es
`undefined`.

| `it` | Rojo |
|---|---|
| `#167 R4: …` | aserción (`undefined` en vez de `'gap-4'`) |

**(2) Verde, c8:** `feat(mobile): HomeEntrance pasa className (R4)`. Prop
opcional `className?: string`, pasada al `Animated.View`. El
`it('no añade estilo propio')` sigue verde sin tocarlo.

**(3) Refactor:** ninguno previsto.

---

## T6 — R5: clave `login.pingoGreeting`

**(1) Rojo, c9:** `test(mobile): clave del saludo de Pingo en login (R5)`. En
`src/providers/__tests__/language-provider.test.tsx`:

- la línea `- 1, // #159 R2` pasa a `- 1 // #159 R2`, y debajo, con la misma
  sangría, va `+ 1, // #167 R5`;
- un `it('#167 R5: declara login.pingoGreeting en los dos idiomas y su registro')`,
  con el patrón del `it('#158 R1: …')`: `en['login.pingoGreeting']` y
  `es['login.pingoGreeting']` con `toBe` contra los literales de R5.1, la fila
  con la regex de R5.3 y `toContain('### §2.24 — Añadidos por #167 — Pingo en las pantallas de cuenta')`
  sobre `../specs/mobile-ui-language/design.md`.

| `it` | Rojo |
|---|---|
| el que contiene `- 1 // #159 R2` | aserción (longitud) |
| `#167 R5: …` | aserción |

**(2) Verde, c10:** `feat(mobile): clave del saludo de Pingo en login (R5)`.
Añade la clave a `src/i18n/catalog.ts` en los dos idiomas, justo después de
`'login.forgotPassword'`, y la §2.24 de R5.2 en
`../specs/mobile-ui-language/design.md`, justo antes de `## 3. La infraestructura`.

```
grep -cF "'login.pingoGreeting':" src/i18n/catalog.ts                          # 2
grep -cF '### §2.24' ../specs/mobile-ui-language/design.md                     # 1
bunx jest --runTestsByPath src/providers/__tests__/language-provider.test.tsx src/__tests__/ui-language.test.ts
```

Si algún `it` de `ui-language.test.ts` cae porque la clave aún no tiene uso,
PARA y reporta: no adelantes R6.

**(3) Refactor:** ninguno previsto.

---

## T7 — R6: Login

**(1) Rojo, c11:** `test(mobile): Pingo saluda en login y la pantalla entra en dos tiempos (R6)`.

En `src/screens/login/index.test.tsx`:

- Doble de `'../home/home-entrance'` (design.md §Dobles): un `mockHomeEntrance`
  registra props y pinta un `View` con `testID`, `className` y `style`. El
  mapa de entradas es el de requirements.md §Convenciones.
- Nueve `it`. Los que dicen «en es» usan el wrapper del fichero
  (`initial="es"`); el de en usa el mismo wrapper con `initial="en"`.
  1. `#167 R6: entra en dos tiempos, cabecera y cuerpo`: mapa de entradas
     exacto de R6.1.
  2. `#167 R6: la cabecera lleva el saludo y después el título`: `login-header`
     tiene 2 hijos; `children[0].props.testID` es `'login-greeting'` y
     `children[1]` es (`toBe`) `within(header).getByText('Iniciar sesión')`.
  3. `#167 R6: el cuerpo lleva el formulario en el orden de siempre`:
     `within(body).getAllByTestId(/^(login-email|login-password|login-submit|link-register|link-forgot)$/)`
     mapeado a `props.testID` da esos cinco en ese orden. Después, con el mismo
     arreglo que el `it` existente que provoca `login-error`,
     `within(body).getByTestId('login-error')` existe.
  4. `#167 R6: la cabecera y el cuerpo no se mezclan`: ninguno de los cinco
     testIDs del cuerpo está `within(header)`, y ni `login-greeting` ni
     `'Iniciar sesión'` están `within(body)`.
  5. `#167 R6: el saludo pone a Pingo junto a su burbuja`: `className` de
     `login-greeting` con `toBe('flex-row items-center gap-3')`, y sus hijos
     mapeados a `props.testID` dan `['login-pingo', 'login-bubble']`.
  6. `#167 R6: Pingo saluda con la pose de la mano`: `props.source` de
     `login-pingo` es
     `[expect.objectContaining({ testUri: expect.stringMatching(/pingo-wave\.webp$/) })]`,
     `props.style` es (`toEqual`) `{ width: 88, height: 88, transform: [{ rotate: '-8deg' }] }`
     y `props.accessibilityLabel` es `undefined`.
  7. `#167 R6: la burbuja es una card secondary que ocupa el resto`:
     `props.className.split(' ')` de `login-bubble` contiene (`arrayContaining`)
     `rounded-card`, `bg-surface-secondary`, `flex-1`, `px-4` y `py-3`.
  8. `#167 R6: la burbuja dice el saludo en español`: `login-bubble-text` es
     el único hijo de `login-bubble`, con `className` `toBe('text-sm font-semibold text-foreground')`
     y `toHaveTextContent('Qué bueno verte de nuevo.')`.
  9. `#167 R6: la burbuja dice el saludo en inglés`: con `initial="en"`,
     `toHaveTextContent('Good to see you again.')`.
- En `src/__tests__/ui-copy-table.ts`, la fila
  `{ file: 'src/screens/login/index.tsx', key: 'login.pingoGreeting' }, // #167 R6`
  va justo después de la fila de `login.forgotPassword`.
- En `src/__tests__/ui-language.test.ts`,
  `expect(R1_AUTH).toHaveLength(29 + 7); // #117 R10` pasa a
  `expect(R1_AUTH).toHaveLength(29 + 7 + 1); // #117 R10, #167 R6`.

| Fichero | `it` | Rojo |
|---|---|---|
| login | 1 | aserción (mapa `{}`) |
| login | 2–9 | consulta (`login-header`, `login-body`, `login-greeting`, `login-pingo`, `login-bubble`, `login-bubble-text`) |
| ui-language | el que llama `checkUses(R1_AUTH)` | aserción (falta `t('login.pingoGreeting')`) |
| ui-language | el que llama `checkUses(ALL_USES)` | aserción (lo mismo) |
| ui-language | el de `toHaveLength(29 + 7 + 1)` | **ninguno**: la fila y la cuenta llegan juntas |

Los 8 `it` de la base del fichero siguen verdes en el rojo, porque el doble aún
no se usa.

**(2) Verde, c12:** `feat(mobile): Pingo saluda en login y la pantalla entra en dos tiempos (R6)`.
`src/screens/login/index.tsx` según R6.1–R6.3. Importa `HomeEntrance` de
`'../home/home-entrance'`, `Card` de `heroui-native` e `Image` de `expo-image`,
y la pose con `require('../../../assets/images/pingo-wave.webp')`. Antes de
escribir el `require`, comprueba la ruta relativa con
`test -e src/screens/login/../../../assets/images/pingo-wave.webp; echo $?` → `0`.

```
bunx jest --runTestsByPath src/screens/login/index.test.tsx src/__tests__/ui-language.test.ts src/__tests__/legibility-classnames.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/design-drift.test.ts
```

**(3) Refactor:** ninguno previsto.

---

## T8 — R7: Registro, cabecera con Pingo

**(1) Rojo, c13:** `test(mobile): Pingo en la cabecera del registro (R7)`. En
`src/screens/register/index.test.tsx`, el mismo doble de `'../home/home-entrance'`
y cuatro `it`:

1. `#167 R7: la cabecera entra con rise`: mapa exacto de R7.1.
2. `#167 R7: la cabecera lleva a Pingo y después el título`: `register-header`
   tiene 2 hijos; `children[0].props.testID` es `'register-pingo'` y
   `children[1]` es (`toBe`) `within(header).getByText('Crear cuenta')`.
3. `#167 R7: Pingo del registro usa la pose de la tablilla`: `source` casa
   `/pingo-clipboard\.webp$/`, `style` es `toEqual({ width: 56, height: 56 })`
   y `accessibilityLabel` es `undefined`.
4. `#167 R7: ningún campo ni el envío quedan dentro de la cabecera`: para cada
   testID de campo, `register-terms` y `register-submit`,
   `within(header).queryByTestId(id)` es `null`.

| `it` | Rojo |
|---|---|
| 1 | aserción (mapa `{}`) |
| 2–4 | consulta (`register-header`, `register-pingo`) |

**(2) Verde, c14:** `feat(mobile): Pingo en la cabecera del registro (R7)`.
`src/screens/register/index.tsx` según R7.1–R7.3, con la pose desde
`'../../../assets/images/pingo-clipboard.webp'`.

**(3) Refactor:** ninguno previsto.

---

## T9 — R8: Registro, icono en el error general

**(1) Rojo, c15:** `test(mobile): el error del registro lleva icono (R8)`. En
`src/screens/register/index.test.tsx`:

- doble de `reicon-react-native`: `{ ...actual, AlertCircle: mockIcon('icon-alert-circle') }`,
  con el patrón de `src/screens/welcome/index.test.tsx`;
- doble de `'../../theme/use-theme-colors'` que devuelve `color:${token}`;
- cuatro `it`, todos con el mismo arreglo que el `it` existente que provoca
  `register-error`:
  1. `#167 R8: el error general va en una fila con icono`: `className` de
     `register-error-row` con `toBe('flex-row items-center gap-1.5')`, y sus
     hijos mapeados a `props.testID` dan `['icon-alert-circle', 'register-error']`.
  2. `#167 R8: el icono del error mide 14 y usa danger`: `props.size` es `14`
     y `props.color` es `'color:danger'`.
  3. `#167 R8: el texto del error pesa como el icono`: `className` de
     `register-error` con `toBe('flex-1 text-sm font-semibold text-danger')`.
  4. `#167 R8: sin error no hay fila; con error, sí`: antes de enviar,
     `queryByTestId('register-error-row')` es `null`; tras el error,
     `getByTestId('register-error-row')` existe.

| `it` | Rojo |
|---|---|
| 1, 2 | consulta (`register-error-row`, `icon-alert-circle`) |
| 3 | aserción (`'text-danger'`) |
| 4 | consulta (en la segunda mitad) |

**(2) Verde, c16:** `feat(mobile): el error del registro lleva icono (R8)`.
`src/screens/register/index.tsx` según R8.1–R8.2.

**(3) Refactor:** ninguno previsto.

---

## T10 — R9: Recuperar

**(1) Rojo, c17:** `test(mobile): Pingo y pop del candado en recuperar (R9)`. En
`src/screens/forgot/index.test.tsx`:

- doble de `'../../components/pop-in'` (design.md §Dobles), con `mockPopIn`
  registrando props. El helper `lockTile()` no se toca.
- cuatro `it`:
  1. `#167 R9: Pingo precede al tile del candado en el formulario`: `source`
     casa `/pingo-talk\.webp$/`; `style` es
     `toEqual({ width: 120, height: 120, transform: [{ rotate: '6deg' }] })`;
     `accessibilityLabel` es `undefined`; `forgot-pingo.parent` es (`toBe`)
     `forgot-title.parent`, y en los hijos de ese padre el índice de
     `forgot-pingo` es el de `lockTile()` menos 1.
  2. `#167 R9: Pingo precede al tile del candado tras enviar`: lo mismo en el
     estado de enviado, al que se llega con el arreglo de los `it` existentes.
  3. `#167 R9: el tile entra con pop en el formulario`: mapa de llamadas de
     `PopIn` exacto (R9.2).
  4. `#167 R9: el tile entra con pop tras enviar`: `mockPopIn.mockClear()`
     justo antes de la acción que cambia de estado y el mismo mapa exacto
     después.

| `it` | Rojo |
|---|---|
| 1, 2 | consulta (`forgot-pingo`) |
| 3, 4 | aserción (mapa `{}`) |

**(2) Verde, c18:** `feat(mobile): Pingo y pop del candado en recuperar (R9)`.
`src/screens/forgot/index.tsx` según R9.1–R9.2, con la pose desde
`'../../../assets/images/pingo-talk.webp'`.

```
grep -cF 'className="size-16 items-center justify-center rounded-xl bg-accent-soft"' src/screens/forgot/index.tsx  # 1
grep -cF 'style={CONTINUOUS_CORNER}' src/screens/forgot/index.tsx   # 1
bunx jest --runTestsByPath src/screens/forgot/index.test.tsx src/__tests__/consistency-classnames.test.ts src/__tests__/design-drift.test.ts
```

**(3) Refactor:** ninguno previsto.

---

## T11 — R10: Nueva contraseña

**(1) Rojo, c19:** `test(mobile): Pingo y tarjeta de estado en nueva contraseña (R10)`.

En `src/screens/reset-password/index.test.tsx`:

- dobles de `'../home/home-entrance'`, `'../../components/pop-in'`,
  `reicon-react-native` (`Check: mockIcon('icon-check')`) y
  `'../../theme/use-theme-colors'` (`color:${token}`);
- diez `it`:
  1. `#167 R10: el formulario entra en dos tiempos`: mapa de entradas exacto
     de R10.1.
  2. `#167 R10: la cabecera lleva a Pingo y después el título`: `reset-header`
     tiene 2 hijos; `children[0].props.testID` es `'reset-pingo'` y
     `children[1]` es (`toBe`) `within(header).getByText('Restablecer contraseña')`.
  3. `#167 R10: el cuerpo lleva campos, error y envío`: `reset-password`,
     `reset-password-confirm` y `reset-submit` están `within(body)` y no
     `within(header)`. Con el arreglo del `it` existente que provoca
     `reset-error`, `reset-error` está `within(body)`.
  4. `#167 R10: Pingo en el formulario usa la tablilla`: `source` casa
     `/pingo-clipboard\.webp$/`, `style` es `toEqual({ width: 72, height: 72 })`
     y `accessibilityLabel` es `undefined`.
  5. `#167 R10: Pingo en el éxito usa la tablilla`: lo mismo en la rama de
     éxito.
  6. `#167 R10: el éxito pinta cabecera, tarjeta y enlace, sin cuerpo`:
     `getAllByTestId(/^(reset-header|reset-success-pop|link-login)$/)` mapeado
     a `props.testID` da ese orden; los tres comparten `parent` (`toBe`), y
     `queryByTestId('reset-body')` es `null`.
  7. `#167 R10: la tarjeta de estado es secondary con check y texto`:
     `reset-success-card` está `within(reset-success-pop)`; su
     `className.split(' ')` contiene (`arrayContaining`) los siete tokens de
     R10.4; sus hijos mapeados a `props.testID` dan
     `['reset-success-check', 'reset-success']`.
  8. `#167 R10: el disco del check es acento con Check de 18`: `className` de
     `reset-success-check` con `toBe('size-8 items-center justify-center rounded-full bg-accent')`,
     y su único hijo `icon-check` tiene `size` `18` y `color`
     `'color:accent-foreground'`.
  9. `#167 R10: el texto de éxito es tinta accent-strong y seleccionable`:
     `className` de `reset-success` con `toBe('flex-1 font-bold text-accent-strong')`,
     `props.selectable` es `true` y `toHaveTextContent('Contraseña actualizada')`.
  10. `#167 R10: la tarjeta de estado entra con pop`: `mockPopIn.mockClear()`
      antes de la acción que lleva al éxito, y después el mapa de llamadas
      exacto de R10.4.
- En `src/__tests__/legibility-classnames.test.ts`:
  - `[join('screens', 'reset-password', 'index.tsx'), 2]` pasa a
    `[join('screens', 'reset-password', 'index.tsx'), 3]`;
  - `+ 2, // #118 R11` pasa a `+ 2 // #118 R11`, y debajo va `+ 1, // #167 R10`.

| Fichero | `it` | Rojo |
|---|---|---|
| reset | 1 | aserción (mapa `{}`) |
| reset | 2–8 | consulta (`reset-header`, `reset-body`, `reset-pingo`, `reset-success-pop`, `reset-success-card`, `reset-success-check`) |
| reset | 9 | aserción (`'text-center text-foreground'`) |
| reset | 10 | aserción (mapa `{}`) |
| legibility | el caso `screens/reset-password/index.tsx` del `it.each(inkSites)` | aserción (2 en vez de 3) |
| legibility | `suma las trece ocurrencias que enumera la spec` | **ninguno**: fila y suma suben juntas |

**(2) Verde, c20:** `feat(mobile): Pingo y tarjeta de estado en nueva contraseña (R10)`.
`src/screens/reset-password/index.tsx` según R10.1–R10.5. La rama sin token no
se toca.

```
grep -oF 'text-accent-strong' src/screens/reset-password/index.tsx | wc -l   # 3
bunx jest --runTestsByPath src/screens/reset-password/index.test.tsx src/__tests__/legibility-classnames.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/design-drift.test.ts
```

**(3) Refactor:** ninguno previsto.

---

## T12 — R11: enmienda de la carta

**(1) Rojo, c21:** `test(mobile): la carta declara los anillos de ping (R11)`.
En `src/screens/welcome/index.test.tsx`, un
`describe('#167 R11: la carta declara los anillos de ping')` que lee
`../docs/ui-guidelines.md` igual que el `describe` de `#153 R2`. Cuatro `it`,
con los bloques de R11.1 y R11.2 como literales de plantilla:

1. `#167 R11: la viñeta de bucles de reposo nombra los anillos`: el bloque de
   R11.1 aparece exactamente una vez (`split(bloque).length - 1` es `1`).
2. `#167 R11: no queda la redacción vieja de la viñeta`: `not.toContain('Flotar y parpadear son las únicas')`.
3. `#167 R11: la carta trae la enmienda de los anillos`: el título y el cuerpo
   de R11.2 **sin** la línea `- [ ] Enmienda aprobada por humano` (cuerpo
   recortado con `trimEnd()`), unidos por `\n\n`, aparecen exactamente una
   vez; y `charter.slice(charter.indexOf(título))` casa con
   `/- \[[ xX]\] Enmienda aprobada por humano/`. Dos `expect` en el mismo
   `it`: la casilla la marca el humano y el candado no se ata a que siga sin
   marcar (precedente: `consistency-classnames.test.ts`, regex
   `[ xX]`).
4. `#167 R11: el checklist de autocrítica sigue apareciendo una vez`:
   `'## Checklist de autocrítica'` aparece exactamente una vez.

| `it` | Rojo |
|---|---|
| 1, 2, 3 | aserción |
| 4 | **nace verde** (declarado). Sonda: duplica la línea `## Checklist de autocrítica` en la carta, el `it` cae por aserción; revierte |

**(2) Verde, c22:** `docs(ui): enmienda de la carta para los anillos de ping (R11)`.
`../docs/ui-guidelines.md` según R11.1 y R11.2. Los `it` de `#153 R2` siguen
verdes.

```
grep -cF 'Flotar, parpadear y los tres anillos de ping' ../docs/ui-guidelines.md   # 1
grep -cF '## Enmienda #167 — anillos de ping de la bienvenida' ../docs/ui-guidelines.md  # 1
grep -cF 'Flotar y parpadear son las únicas animaciones' ../docs/ui-guidelines.md  # 0
```

**(3) Refactor:** ninguno previsto.

---

## T13 — R12 y R13: anillos de ping

**(1) Rojo de R12, c23:** `test(mobile): anillos de ping alrededor de Pingo (R12)`.
En `src/screens/welcome/index.test.tsx`, sin tocar los dobles existentes:

- la aserción `toEqual(['welcome-bubble', 'welcome-pingo'])` pasa a
  `toEqual(['welcome-bubble', 'welcome-stage'])`;
- un `describe('#167 R12: anillos de ping')` con reduce motion desactivado y
  diez `it`:
  1. `#167 R12: el escenario apila tres anillos bajo Pingo`: hijos de
     `welcome-stage` mapeados a `props.testID` dan
     `['welcome-ring-0', 'welcome-ring-1', 'welcome-ring-2', 'welcome-pingo']`.
  2. `#167 R12: el escenario centra su contenido`: `className` de
     `welcome-stage` con `toBe('items-center justify-center')`.
  3. `it.each([0, 1, 2])('#167 R12: el anillo %i es un círculo de borde acento', …)`:
     `className` con `toBe('absolute size-65 rounded-full border-2 border-accent')`.
  4. `#167 R12: los anillos se repiten sin invertir`: las llamadas a
     `withRepeat` filtradas por
     `args.length === 2 && args[0] === -1 && args[1] === false`, donde `args`
     es lo que va después de la animación, son exactamente 6.
  5–10. Con timers falsos, un `it` por instante de la tabla de R12.4 (0, 700,
     1500, 2500, 3300 y 4100 ms). Lee `getAnimatedStyle` de cada anillo, con
     `toEqual` contra inicial o final y `not.toEqual` donde la tabla dice «≠».
     Títulos: `#167 R12: a los <n> ms …` con lo que dice la fila.

| `it` | Rojo |
|---|---|
| la aserción modificada (`welcome-stage`) | aserción |
| 1, 2, 3 (tres casos), 5–10 | consulta (`welcome-stage`, `welcome-ring-<i>`) |
| 4 | aserción (0 llamadas en vez de 6) |

**(2) Verde, c24:** `feat(mobile): anillos de ping alrededor de Pingo (R12)`.
`src/screens/welcome/index.tsx` según R12.1–R12.3:

- `welcome-stage` envuelve los anillos y `welcome-pingo`;
- los anillos son un componente local del mismo fichero que solo se monta
  cuando `!reduceMotion`, de modo que con reduce motion no se llama a
  `withRepeat` (los dos `it` de la base con
  `expect(mockWithRepeat).not.toHaveBeenCalled()` siguen verdes);
- el escalonado es `i * (MOTION_PING_TIMING.duration / 3)`.

```
bunx jest --runTestsByPath src/screens/welcome/index.test.tsx src/__tests__/consistency-classnames.test.ts src/__tests__/legibility-classnames.test.ts src/__tests__/design-drift.test.ts
```

**(3) R13, c25 (nace verde):** `test(mobile): sin anillos con reduce motion (R13)`.
Un `describe('#167 R13: sin anillos con reduce motion')` con reduce motion
activado y dos `it`:

1. `#167 R13: con reduce motion el escenario solo lleva a Pingo`: hijos de
   `welcome-stage` mapeados a `props.testID` dan `['welcome-pingo']`.
2. `it.each([0, 1, 2])('#167 R13: con reduce motion no hay anillo %i', …)`:
   `queryByTestId('welcome-ring-<i>')` es `null`.

**Nace verde** (declarado). Sonda: quita la condición `!reduceMotion` del
render de los anillos en `src/screens/welcome/index.tsx`. Deben caer los dos
`it` de R13 (aserción) y los dos `it` de la base con
`expect(mockWithRepeat).not.toHaveBeenCalled()` (aserción). Revierte.

**(4) Refactor:** ninguno previsto.

---

## T14 — R14: guarda de deriva (c26, nace verde)

Commit: `test(mobile): las pantallas de cuenta no traen deriva (R14)`.

1. En `src/__tests__/design-drift.test.ts`, un
   `describe('#167 R14: las pantallas de cuenta no traen deriva')` con la
   lista exacta de R14.1 y cuatro `it`, cada uno con `toEqual([])` sobre los
   ficheros que violan:
   1. `#167 R14: sin hex, clases arbitrarias, StyleSheet ni sombras sueltas`
      (`MEALS_BAR_STYLE_ESCAPES`);
   2. `#167 R14: sin radios fuera de la escala`;
   3. `#167 R14: sin text-accent suelto`;
   4. `#167 R14: sin dependencias vetadas, useThemeColor ni emoji`.
2. **Nace verde** (declarado). El fichero da 51 `it` en verde.
3. **Sondas**, una por cláusula, plantadas como comentario en
   `src/components/pop-in.tsx` y revertidas una a una. Para cada una, el `it`
   indicado debe estar entre los rojos (otras guardas globales del fichero
   pueden caer también):
   - `// sonda #ff00ff` → `it` 1;
   - `// sonda rounded-lg` → `it` 2;
   - `// sonda text-accent fin` → `it` 3;
   - `// sonda lottie-react-native` → `it` 4.

---

## T15 — Cierre técnico (sin commit)

1. Cuentas: cada fichero de §Cuentas da su «Total» final.
2. `bunx jest; echo "exit=$?"` → `exit=0`. Suites = las de T0 + 1 (`pop-in.test.tsx`).
   Tests = los de T0 + 66: son 62 bloques `it`, y los dos `it.each` de tres
   casos (R12 y R13) suman 2 tests más cada uno.
3. `bun run typecheck; echo "exit=$?"` → `exit=0`.
4. `bunx expo lint --no-cache; echo "exit=$?"` → `exit=0`.
5. `git log --oneline <HEAD del handoff>..HEAD` muestra c1–c26 en orden, sin
   ningún commit que mezcle tests rojos e implementación.
6. Escribe `progress/impl_mobile-account-screens-pingo.md` y rellena
   traceability.md con hash y mensaje por R. La fila de R15 queda «pendiente
   (humano)».

---

## T16 — R15: prueba de humo en dev build de Android (humano)

No la corre ninguna IA.

1. `cd mobile-pet-tracker && bunx expo start --dev-client` y abre el dev build
   de Android (no Expo Go).
2. Bienvenida: tres anillos de ping escalonados alrededor de Pingo, sin
   tirones, mientras Pingo flota y parpadea.
3. Login: Pingo saluda con la burbuja «Qué bueno verte de nuevo.»; la cabecera
   y después el formulario entran desde abajo.
4. Registro: Pingo con la tablilla junto a «Crear cuenta». Provoca un error
   general (por ejemplo, un email ya registrado) y comprueba el icono rojo
   junto al texto.
5. Recuperar: Pingo hablando sobre el tile del candado, que aparece con «pop».
6. Nueva contraseña (desde el enlace del correo de prueba): Pingo con la
   tablilla. Tras un restablecimiento válido, la tarjeta con check aparece con
   «pop».
7. Ajustes → Accesibilidad → «Quitar animaciones» activado: la Bienvenida no
   muestra anillos, y en Recuperar y Nueva contraseña el tile y la tarjeta
   solo aparecen con fundido, sin escala.
8. Firma en traceability.md §Firma de la prueba de humo (R15).
