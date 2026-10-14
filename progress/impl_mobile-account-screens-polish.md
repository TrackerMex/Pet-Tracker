# Implementación — #172 mobile-account-screens-polish

> Worktree: `/home/claude/sites/Pet-Tracker-wt-172`.
> Branch: `feature/172-mobile-account-screens-polish`.
> H0 al arrancar: `e0178ab5c1f67e917cf4116332a0e9196d67b344`.
> Fecha de cierre: 2026-10-14. Estado final: **R1–R20 implementados; T22 completo; R21 pendiente (humano)**.



> Reanudación 4 acepta S15 conforme a E5, sin repetirla, y completa
> c32–c39 y T22. Las 17 suites pasan 470 tests; los lectores de la carta
> pasan 192 tests; typecheck y lint están limpios. Todas las sondas están
> restauradas y todas las anclas finales coinciden. La prueba de humo R21
> corresponde al humano; el leader ejecuta init.sh antes del reviewer.

## Bloqueo inicial y punto de reanudación — historia

Se ejecutó el handoff en orden hasta el gate verde de T4/c8. T4 y R4 ordenan
insertar `MOTION_PINGO_FLOAT_OFFSET_Y` y `MOTION_PINGO_FLOAT_TIMING` entre
`MOTION_PING_TO_SCALE` y `MOTION_POP_SPRING` en la lista esperada de
`no exporta nada más`. Esa lista se compara con `Object.keys(...).sort()`.
El orden real de JavaScript coloca `MOTION_PINGO_FLOAT_*` **antes de**
`MOTION_PING_FROM`. La implementación literal de c8 pasa los tres tests del
componente, el nuevo test de constantes y las cuatro guardas; falla solo
el inventario, por aserción. El gate debía dar exit=0 y dio exit=1.

El último commit del guion es `e31582c3` (c7). **c8 no se committeó.**
Se paró conforme al handoff, sin ajustar el test ni las anclas para cuadrar.
La implementación candidata de c8 se retiró del árbol y se conserva debajo.
El árbol queda limpio, con los tests rojos de c7 committeados, tal como exige
la separación rojo/verde. No se debe tratar esta rama como verde ni terminada.

Para reanudar hace falta corregir la posición prescrita en R4/T4: los dos
nombres van delante de `MOTION_PING_FROM` en la lista ordenada. No se aplicó
esa corrección unilateralmente. Después se retoma c8, sus sondas y T5–T22.
R21 sigue **pendiente (humano)**. No se ejecutaron los gates finales de T22,
ni la prueba de humo, ni `./init.sh`, ni push, ni PR.

## Skills cargadas

- Ponytail: `/home/claude/.codex/plugins/cache/ponytail/ponytail/5.1.0/skills/ponytail/SKILL.md`.
- `building-native-ui`: `/home/claude/.codex/plugins/cache/openai-curated/expo/11c74d6b/skills/building-native-ui/SKILL.md`.
- `appllama-app-design-skill`: `.agents/skills/appllama-app-design-skill/SKILL.md`.
- `animate-expo`: `.agents/skills/animate-expo/SKILL.md`.

Las decisiones firmadas de la spec mandaron sobre los defaults de las skills.
Se consultó la documentación exacta de Expo SDK 57 exigida por el AGENTS móvil:
[Expo SDK reference](https://docs.expo.dev/versions/v57.0.0/).
La carta delega el estudio Appllama al leader y la prueba visual al humano.

## T0 — base y entorno

```text
git branch --show-current
feature/172-mobile-account-screens-polish
git rev-parse HEAD
e0178ab5c1f67e917cf4116332a0e9196d67b344
git merge-base --is-ancestor 3f9a60e2 HEAD; echo "exit=$?"
exit=0
git status --short
(sin salida)
test -d node_modules; echo "B2=$?"
B2=0
git diff --quiet -- package.json bun.lock; echo "exit=$?"
exit=0
test ! -e .expo/types/router.d.ts; echo "exit=$?"
exit=0
```

B2 dio 0: no se reinstalaron dependencias. B3–B28 se ejecutaron desde
`mobile-pet-tracker/`; coinciden con la base, sin deltas de otras features.

| Ancla | Salida medida en H0 |
|---|---|
| B3 | 2, 7, 1 |
| B4 | 0, 0, 1, 3 |
| B5 | 2, 0, 1, 3 |
| B6 | 0, 1, 1, 2 |
| B7 | 18 |
| B8 | 19; 19 |
| B9 | 37 |
| B10 | 37 |
| B11 | 768 |
| B12 | 7 |
| B13 | 0; 0 |
| B14 | 0 |
| B15 | 0 |
| B16 | `### §2.26 — Añadidos por #170 — Alertas agrupadas y mini-mapa` |
| B17 | 5, 1 |
| B18 | sin salida; ningún selector de mensajes |
| B19 | sin salida |
| B20 | 30 (sumatorio de SCREEN_FILES observado) |
| B21 | 17 |
| B22 | 2, 7, 1, 2 |
| B23 | 1, 0, 1, 3; 0, 0, 1, 2 |
| B24 | 5; 0 |
| B25 | 0 |
| B26 | 1, 1, 1, 1; 1, 1, 2, 1 |
| B27 | 2 |
| B28 | 1, 2, 0, 2 |
| Casillas de enmienda de la carta | 4 |

Cuentas literales de `it` de T0:

```text
src/screens/login/index.test.tsx:21
src/screens/register/index.test.tsx:21
src/screens/forgot/index.test.tsx:28
src/screens/reset-password/index.test.tsx:27
src/__tests__/ui-language.test.ts:28
src/__tests__/design-drift.test.ts:51
src/__tests__/consistency-classnames.test.ts:33
src/__tests__/legibility-classnames.test.ts:12
src/theme/__tests__/global-css.test.ts:30
src/providers/__tests__/language-provider.test.tsx:19
src/theme/__tests__/motion.test.ts:16
src/theme/__tests__/font-registration.test.ts:3
```

Salidas de Jest de la base y lectores (resúmenes literales):

T0 paso 7 — $J $BASE

```text
Test Suites: 12 passed, 12 total
Tests:       409 passed, 409 total
Time:        22.803 s, estimated 105 s
Ran all test suites within paths "src/screens/login/index.test.tsx", "src/screens/register/index.test.tsx", "src/screens/forgot/index.test.tsx", "src/screens/reset-password/index.test.tsx", "src/theme/__tests__/global-css.test.ts", "src/providers/__tests__/language-provider.test.tsx", "src/theme/__tests__/motion.test.ts", "src/theme/__tests__/font-registration.test.ts", "src/__tests__/ui-language.test.ts", "src/__tests__/design-drift.test.ts", "src/__tests__/consistency-classnames.test.ts", "src/__tests__/legibility-classnames.test.ts".
exit=0
```

T0 paso 8 — $J $READERS

```text
Test Suites: 4 passed, 4 total
Tests:       191 passed, 191 total
Time:        19.928 s
Ran all test suites within paths "src/theme/__tests__/motion.test.ts", "src/app/(tabs)/__tests__/food.test.tsx", "src/__tests__/hero-header-amendments.test.ts", "src/screens/welcome/index.test.tsx".
exit=0
```

T0 typecheck y lint:

```text
test ! -e .expo/types/router.d.ts; echo "exit=$?"
exit=0
bun run typecheck; echo "exit=$?"
$ tsc --noEmit
exit=0
bunx expo lint --no-cache > /tmp/lint-172.log 2>&1; echo "exit=$?"; test ! -s /tmp/lint-172.log; echo "vacio=$?"
exit=0
vacio=0
```

## Tabla completa de commits del guion — estado actual

H0 sigue siendo `e0178ab5`. Los commits del leader (firmas y enmiendas E1,
E2, E3, E4 y E5) no se cuentan como commits propios. La tentativa inicial de c8 y
los bloqueos anteriores quedan documentados en sus secciones históricas.

| Commit | Hash | Mensaje literal | Línea Tests: | Rojos y tipo |
|---|---|---|---|---|
| c1 | 3a87fac0 | `test(mobile): tokens de texto 13, 15 y 17 (R1)` | `Tests:       1 failed, 53 passed, 54 total` | 1 aserción (toMatchObject) |
| c2 | 67ff28c3 | `feat(mobile): tokens de texto 13, 15 y 17 (R1)` | `Tests:       248 passed, 248 total` | 0 |
| c3 | c1bd4a6a | `test(mobile): claves de Volver, del ojo y País (R16)` | `Tests:       2 failed, 27 passed, 29 total` | 2 aserciones (longitud y valor) |
| c4 | 505332c9 | `feat(mobile): claves de Volver, del ojo y País (R16)` | `Tests:       223 passed, 223 total` | 0 |
| c5 | b3fe30be | `test(mobile): BackButton vuelve o reemplaza (R2)` | `Tests:       0 total` | 1 suite módulo; 0 tests |
| c6 | 4cdb12db | `feat(mobile): BackButton (R2)` | `Tests:       199 passed, 199 total` | 0 |
| c7 | e31582c3 | `test(mobile): Pingo flota 10 px en 3 s en cuenta (R4)` | `Tests:       2 failed, 15 passed, 17 total` | 1 suite módulo + 2 tests por aserción |
| c7b | 75f849a6 | `test(mobile): orden de sort en el inventario de motion (R4)` | `Tests:       2 failed, 15 passed, 17 total` | 1 suite módulo + 2 aserciones |
| c7c (correctivo) | edf99020 | `test(mobile): tipa translateY en el candado de Pingo (R4)` | `Tests:       2 failed, 15 passed, 17 total` | 1 suite módulo + 2 aserciones |
| c8 | c12c676f | `feat(mobile): Pingo flota 10 px en 3 s en cuenta (R4)` | `Tests:       214 passed, 214 total` | 0 |
| c9 | 1b4551c7 | `test(mobile): Pingo flota en registro, recuperar y nueva contraseña (R5)` | `Tests:       8 failed, 86 passed, 94 total` | 8: 6 aserciones + 2 consultas |
| c10 | 60d26f5c | `feat(mobile): Pingo flota en registro, recuperar y nueva contraseña (R5)` | `Tests:       288 passed, 288 total` | 0 |
| c11 | 29e2acf6 | `test(mobile): fila Volver en login, registro y recuperar (R3)` | `Tests:       8 failed, 150 passed, 158 total` | 8: 4 aserciones + 4 consultas |
| c12 | 984043e1 | `feat(mobile): fila Volver en login, registro y recuperar (R3)` | `Tests:       282 passed, 282 total` | 0 |
| c13 | b8384616 | `test(mobile): recetas de texto e Inter ExtraBold en cuenta (R6)` | `Tests:       9 failed, 83 passed, 92 total` | 9 aserciones |
| c14 | 4b5675c6 | `feat(mobile): recetas de texto e Inter ExtraBold en cuenta (R6)` | `Tests:       324 passed, 324 total` | 0 |
| c15 | 36f46603 | `test(mobile): enlaces y orden del cuerpo de login (R7)` | `Tests:       4 failed, 26 passed, 30 total` | 4 aserciones |
| c16 | 7d56bacb | `feat(mobile): enlaces y orden del cuerpo de login (R7)` | `Tests:       262 passed, 262 total` | 0 |
| c17 | 28ad44aa | `test(mobile): FormError con icono y texto seleccionable (R9)` | `Tests:       5 failed, 120 passed, 125 total` | 1 suite módulo + 5 tests (3 consultas y 2 aserciones) |
| c18 | e1dcae38 | `feat(mobile): FormError en las cuatro pantallas de cuenta (R9)` | `Tests:       322 passed, 322 total` | 0 |
| c19 | 1ad828d3 | `test(mobile): mostrar y ocultar la contraseña en cuenta (R8)` | `Tests:       5 failed, 86 passed, 91 total` | 1 suite módulo + 5 consultas |
| c20 | 45e4c40e | `feat(mobile): mostrar y ocultar la contraseña en cuenta (R8)` | `Tests:       289 passed, 289 total` | 0 |
| c21 | ca1bac6b | `test(mobile): errores por campo del registro con icono (R10)` | `Tests:       1 failed, 34 passed, 35 total` | 1 consulta; 2 it nacen verdes |
| c22 | 14c69144 | `feat(mobile): errores por campo del registro con icono (R10)` | `Tests:       229 passed, 229 total` | 0 |
| c23 | d7604772 | `test(mobile): rejilla del registro (R11)` | `Tests:       2 failed, 28 passed, 30 total` | 2 consultas (register-names-row) |
| c24 | fbcb4e9e | `feat(mobile): rejilla del registro (R11)` | `Tests:       224 passed, 224 total` | 0 |
| c25 | ded50874 | `test(mobile): validación del correo en el registro (R12)` | `Tests:       2 failed, 30 passed, 32 total` | 2 consultas (register-email-message) |
| c26 | b2607357 | `feat(mobile): validación del correo en el registro (R12)` | `Tests:       226 passed, 226 total` | 0 |
| c27 | 2103b60e | `test(mobile): la tarjeta de éxito avisa con liveRegion (R13)` | `Tests:       1 failed, 37 passed, 38 total` | 1 aserción (toBe polite) |
| c28 | 81a3a4c6 | `feat(mobile): la tarjeta de éxito avisa con liveRegion (R13)` | `Tests:       232 passed, 232 total` | 0 |
| c29 | 7b4c79b3 | `test(mobile): el candado de recuperar es un tile acento con labio (R14)` | `Tests:       9 failed, 98 passed, 107 total` | 9 aserciones: forgot 4, consistency 5 |
| c30 | 7ddda8f5 | `feat(mobile): el candado de recuperar es un tile acento con labio (R14)` | `Tests:       234 passed, 234 total` | 0 |
| c31 | 0e5bb776 | `test(mobile): el error de login cuelga del scroll (R15)` | `Tests:       222 passed, 222 total` | 0; nace verde, S15 conforme a E5 |
| c32 | 9f1b2350 | `test(mobile): filas de uso de las claves de cuenta (R16)` | `Tests:       194 passed, 194 total` | 0; nace verde |
| c33 | 3f10a364 | `test(mobile): los componentes nuevos entran en la guarda de deriva (R17)` | `Tests:       194 passed, 194 total` | 0; nace verde |
| c34 | 10763864 | `test(mobile): la carta declara la enmienda de las pantallas de cuenta (R18)` | `Tests:       1 failed, 6 passed, 7 total` | 1 aserción (toContain del encabezado) |
| c35 | dc6df815 | `docs(ui): enmienda de la carta para las pantallas de cuenta (R18)` | `Tests:       393 passed, 393 total` | 0; lint verde tras espera y único reintento |
| c36 | e040579e | `test(mobile): la CTA de cuenta se ancla al pie (R19)` | `Tests:       20 failed, 259 passed, 279 total` | 20: 14 aserciones y 6 consultas |
| c37 | 398f074b | `feat(mobile): la CTA de cuenta se ancla al pie (R19)` | `Tests:       346 passed, 346 total` | 0 |
| c38 | 9cf701c4 | `test(mobile): CTA de 56 e inputs de 52 en las pantallas de cuenta (R20)` | `Tests:       8 failed, 149 passed, 157 total` | 8 aserciones |
| c39 | 4ba7e139 | `feat(mobile): CTA de 56 e inputs de 52 en las pantallas de cuenta (R20)` | `Tests:       355 passed, 355 total` | 0 |

## Gates ejecutados — comandos y salidas

### c1 — jest

```bash
bunx jest --testTimeout=30000 --runTestsByPath src/theme/__tests__/global-css.test.ts
```

```text
Test Suites: 1 failed, 1 total
Tests:       1 failed, 53 passed, 54 total
Time:        2.575 s
  ● #172 R1: tokens de texto de cuenta › #172 R1: define text-13, text-15 y text-17 con sus valores exactos dentro de @theme

    expect(received).toMatchObject(expected)

    - Expected  - 3
    + Received  + 7

      Object {
    -   "text-13": "13px",
    -   "text-15": "15px",
    -   "text-17": "17px",
    +   "font-black": "'Inter-Black'",
    +   "font-bold": "'Inter-Bold'",
    +   "font-medium": "'Inter-Medium'",
    +   "font-normal": "'Inter-Regular'",
    +   "font-semibold": "'Inter-SemiBold'",
    +   "radius-card": "20px",
    +   "text-2xs": "10px",
      }

      62 | describe('#172 R1: tokens de texto de cuenta', () => {
      63 |   it('#172 R1: define text-13, text-15 y text-17 con sus valores exactos dentro de @theme', () => {
    > 64 |     expect(parseVariables(extractTheme())).toMatchObject({
         |                                            ^
      65 |       'text-13': '13px',
      66 |       'text-15': '15px',
      67 |       'text-17': '17px',

      at Object.toMatchObject (src/theme/__tests__/global-css.test.ts:64:44)
exit=1
```

### c2 — jest

```bash
bunx jest --testTimeout=30000 --runTestsByPath src/theme/__tests__/global-css.test.ts src/__tests__/ui-language.test.ts src/__tests__/design-drift.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/legibility-classnames.test.ts
```

```text
Test Suites: 5 passed, 5 total
Tests:       248 passed, 248 total
Time:        2.782 s, estimated 3 s
exit=0
```

### c2 — router

```bash
test ! -e .expo/types/router.d.ts
```

```text
exit=0
```

### c2 — typecheck

```bash
bun run typecheck
```

```text
$ tsc --noEmit
exit=0
```

### c2 — lint

```bash
bunx expo lint --no-cache > /tmp/lint-172.log 2>&1
```

```text
exit=0
vacio=0
```

### c3 — jest

```bash
bunx jest --testTimeout=30000 --runTestsByPath src/providers/__tests__/language-provider.test.tsx
```

```text
Test Suites: 1 failed, 1 total
Tests:       2 failed, 27 passed, 29 total
Time:        2.029 s
  ● #65 R12: el catálogo tiene los dos idiomas y t resuelve claves y parámetros › mantiene la base más las claves de #68 y los mismos marcadores en ambos idiomas

    expect(received).toHaveLength(expected)

    Expected length: 399
    Received length: 396
    Received array:  ["addPet.addPet", "addPet.age", "addPet.approxMonths", "addPet.avatarPreview", "addPet.basicDetails", "addPet.birthDate", "addPet.breed", "addPet.cat", "addPet.checkPetDetails", "addPet.chooseBirthDate", …]

      53 |     const spanishKeys = Object.keys(es).sort();
      54 |
    > 55 |     expect(englishKeys).toHaveLength(
         |                         ^
      56 |       260 + 16 + 1 + 4 + 7 + 14 + 2 + 1 + 4 - 6 + 1 + 2 + 3 + 11 + 12 + 2 + 9 + 9 // #105 R5
      57 |         + 6 - 1 // #117 R1
      58 |         + 8 // #118 R1

      at Object.toHaveLength (src/providers/__tests__/language-provider.test.tsx:55:25)
  ● #172 R16: el copy de las pantallas de cuenta como el canvas › #172 R16: declara las claves de cuenta en los dos idiomas y su registro

    expect(received).toBe(expected) // Object.is equality

    Expected: "Back"
    Received: undefined

      602 |
      603 |     for (const [key, englishValue, spanishValue] of translations) {
    > 604 |       expect(english[key]).toBe(englishValue);
          |                            ^
      605 |       expect(spanish[key]).toBe(spanishValue);
      606 |       expect(languageDesign).toMatch(
      607 |         new RegExp(

      at Object.toBe (src/providers/__tests__/language-provider.test.tsx:604:28)
exit=1
```

### c4 — jest

```bash
bunx jest --testTimeout=30000 --runTestsByPath src/providers/__tests__/language-provider.test.tsx src/__tests__/ui-language.test.ts src/__tests__/design-drift.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/legibility-classnames.test.ts
```

```text
Test Suites: 5 passed, 5 total
Tests:       223 passed, 223 total
Time:        3.677 s
exit=0
```

### c4 — router

```bash
test ! -e .expo/types/router.d.ts
```

```text
exit=0
```

### c4 — typecheck

```bash
bun run typecheck
```

```text
$ tsc --noEmit
exit=0
```

### c4 — lint

```bash
bunx expo lint --no-cache > /tmp/lint-172.log 2>&1
```

```text
exit=0
vacio=0
```

### c5 — jest

```bash
bunx jest --testTimeout=30000 --runTestsByPath src/components/__tests__/back-button.test.tsx
```

```text
Test Suites: 1 failed, 1 total
Tests:       0 total
Time:        3.393 s
  ● Test suite failed to run

    Cannot find module '../back-button' from 'src/components/__tests__/back-button.test.tsx'

      3 |
      4 | import { LanguageProvider } from '../../providers/language-provider';
    > 5 | import { BackButton } from '../back-button';
        | ^
      6 |
      7 | jest.mock('expo-router', () => ({
      8 |   router: { back: jest.fn(), replace: jest.fn(), canGoBack: jest.fn() },

      at Resolver._throwModNotFoundError (node_modules/jest-resolve/build/resolver.js:427:11)
      at Object.require (src/components/__tests__/back-button.test.tsx:5:1)
exit=1
```

### c6 — jest

```bash
bunx jest --testTimeout=30000 --runTestsByPath src/components/__tests__/back-button.test.tsx src/__tests__/ui-language.test.ts src/__tests__/design-drift.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/legibility-classnames.test.ts
```

```text
Test Suites: 5 passed, 5 total
Tests:       199 passed, 199 total
Time:        10.825 s
exit=0
```

### c6 — router

```bash
test ! -e .expo/types/router.d.ts
```

```text
exit=0
```

### c6 — typecheck

```bash
bun run typecheck
```

```text
$ tsc --noEmit
exit=0
```

### c6 — lint

```bash
bunx expo lint --no-cache > /tmp/lint-172.log 2>&1
```

```text
exit=0
vacio=0
```

### c7 — jest

```bash
bunx jest --testTimeout=30000 --runTestsByPath src/components/__tests__/pingo-float.test.tsx src/theme/__tests__/motion.test.ts
```

```text
Test Suites: 2 failed, 2 total
Tests:       2 failed, 15 passed, 17 total
Time:        2.098 s
  ● Test suite failed to run

    Cannot find module '../pingo-float' from 'src/components/__tests__/pingo-float.test.tsx'

      3 | import { getAnimatedStyle } from 'react-native-reanimated';
      4 |
    > 5 | import { PingoFloat } from '../pingo-float';
        | ^
      6 |
      7 | const mockUseReducedMotion = jest.fn<boolean, []>(() => false);
      8 |

      at Resolver._throwModNotFoundError (node_modules/jest-resolve/build/resolver.js:427:11)
      at Object.require (src/components/__tests__/pingo-float.test.tsx:5:1)

FAIL src/theme/__tests__/motion.test.ts
  ● #152 R1: las duraciones y el preset de movimiento viven en un solo sitio › no exporta nada más

    expect(received).toEqual(expected) // deep equality

    - Expected  - 2
    + Received  + 0

    @@ -9,12 +9,10 @@
        "MOTION_FLOAT_OFFSET_Y",
        "MOTION_FLOAT_TIMING",
        "MOTION_PING_FROM",
        "MOTION_PING_TIMING",
        "MOTION_PING_TO_SCALE",
    -   "MOTION_PINGO_FLOAT_OFFSET_Y",
    -   "MOTION_PINGO_FLOAT_TIMING",
        "MOTION_POP_SPRING",
        "MOTION_SETTLE_SPRING",
        "MOTION_STAGGER_MS",
        "MOTION_SURFACE_MS",
        "MOTION_TRANSITION_MS",

      74 |
      75 |   it('no exporta nada más', () => {
    > 76 |     expect(Object.keys(require('../motion')).sort()).toEqual([
         |                                                      ^
      77 |       'MOTION_BLINK_INTERVAL_MS',
      78 |       'MOTION_BLINK_TIMING',
      79 |       'MOTION_ENTRANCE_OFFSET_Y',

      at Object.toEqual (src/theme/__tests__/motion.test.ts:76:54)
  ● #172 R4: la flotación de Pingo en cuenta vive en motion.ts › #172 R4: declara la flotación de Pingo del canvas: 10 px y medio ciclo de 1500 ms ease-in-out

    expect(received).toBe(expected) // Object.is equality

    Expected: 10
    Received: undefined

      100 | describe('#172 R4: la flotación de Pingo en cuenta vive en motion.ts', () => {
      101 |   it('#172 R4: declara la flotación de Pingo del canvas: 10 px y medio ciclo de 1500 ms ease-in-out', () => {
    > 102 |     expect(MOTION_PINGO_FLOAT_OFFSET_Y).toBe(10);
          |                                         ^
      103 |     expect(MOTION_PINGO_FLOAT_TIMING).toEqual({
      104 |       duration: 1500,
      105 |       easing: { bezier: [0.42, 0, 0.58, 1] },

      at Object.toBe (src/theme/__tests__/motion.test.ts:102:41)
exit=1
```

### c8 — jest

```bash
bunx jest --testTimeout=30000 --runTestsByPath src/components/__tests__/pingo-float.test.tsx src/theme/__tests__/motion.test.ts src/__tests__/ui-language.test.ts src/__tests__/design-drift.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/legibility-classnames.test.ts
```

```text
PASS src/__tests__/design-drift.test.ts
FAIL src/theme/__tests__/motion.test.ts
  ● #152 R1: las duraciones y el preset de movimiento viven en un solo sitio › no exporta nada más

    expect(received).toEqual(expected) // deep equality

    - Expected  - 2
    + Received  + 2

    @@ -6,15 +6,15 @@
        "MOTION_FADE_TIMING",
        "MOTION_FEEDBACK_MS",
        "MOTION_FILL_TIMING",
        "MOTION_FLOAT_OFFSET_Y",
        "MOTION_FLOAT_TIMING",
    +   "MOTION_PINGO_FLOAT_OFFSET_Y",
    +   "MOTION_PINGO_FLOAT_TIMING",
        "MOTION_PING_FROM",
        "MOTION_PING_TIMING",
        "MOTION_PING_TO_SCALE",
    -   "MOTION_PINGO_FLOAT_OFFSET_Y",
    -   "MOTION_PINGO_FLOAT_TIMING",
        "MOTION_POP_SPRING",
        "MOTION_SETTLE_SPRING",
        "MOTION_STAGGER_MS",
        "MOTION_SURFACE_MS",
        "MOTION_TRANSITION_MS",

      74 |
      75 |   it('no exporta nada más', () => {
    > 76 |     expect(Object.keys(require('../motion')).sort()).toEqual([
         |                                                      ^
      77 |       'MOTION_BLINK_INTERVAL_MS',
      78 |       'MOTION_BLINK_TIMING',
      79 |       'MOTION_ENTRANCE_OFFSET_Y',

      at Object.toEqual (src/theme/__tests__/motion.test.ts:76:54)

PASS src/__tests__/legibility-classnames.test.ts
PASS src/__tests__/consistency-classnames.test.ts
PASS src/__tests__/ui-language.test.ts
PASS src/components/__tests__/pingo-float.test.tsx

Test Suites: 1 failed, 5 passed, 6 total
Tests:       1 failed, 213 passed, 214 total
Snapshots:   0 total
Time:        4.041 s
Ran all test suites within paths "src/components/__tests__/pingo-float.test.tsx", "src/theme/__tests__/motion.test.ts", "src/__tests__/ui-language.test.ts", "src/__tests__/design-drift.test.ts", "src/__tests__/consistency-classnames.test.ts", "src/__tests__/legibility-classnames.test.ts".
exit=1
```

## Sondas ejecutadas — salidas literales

### S1 — --text-13: 13px → 12px

```bash
bunx jest --testTimeout=30000 --runTestsByPath src/theme/__tests__/global-css.test.ts
```

```text
FAIL src/theme/__tests__/global-css.test.ts
  R1: tokens rounded-card y text-2xs
    ✓ define sus valores exactos dentro de @theme (2 ms)
  #172 R1: tokens de texto de cuenta
    ✕ #172 R1: define text-13, text-15 y text-17 con sus valores exactos dentro de @theme (3 ms)
  R1: global.css define los tokens light exactos del diseño
    ✓ incluye el código de la app en el escaneo de utilidades de Tailwind (1 ms)
    ✓ mapea la paleta Figma Make a los tokens de heroui-native (1 ms)
    ✓ no sobreescribe --radius (base de la escala rounded-* de heroui-native)
  R2: global.css define la paleta dark derivada del diseño
    ✓ materializa los colores semánticos para el resolver JS en light
    ✓ materializa los colores semánticos para el resolver JS en dark (1 ms)
    ✓ usa neutros oscuros con el accent verde y sin copiar oklch del Make (1 ms)
  R2: tokens glass-surface y tab-pill en light y dark
    ✓ define los pares visual e imperativo exactos en light (1 ms)
    ✓ define los pares visual e imperativo exactos en dark (1 ms)
  #61 R2: el relleno de acento pasa AA con etiqueta blanca
    ✓ reproduce el ancla de contraste verificada a mano
    ✓ oscurece acento y foco sin tocar la etiqueta blanca en light (1 ms)
    ✓ oscurece acento y foco sin tocar la etiqueta blanca en dark
    ✓ arrastra --tab-pill al valor del acento nuevo en light (1 ms)
    ✓ arrastra --tab-pill al valor del acento nuevo en dark
    ✓ deja la etiqueta blanca sobre el relleno por encima de AA (1 ms)
    ✓ conserva el relleno visible sobre el fondo de página en dark
  #61 R4: token accent-strong con AA como tinta en los dos temas
    ✓ registra el espejo --color-accent-strong para las utilidades text-*
    ✓ parte la tinta del relleno en light (1 ms)
    ✓ parte la tinta del relleno en dark
    ✓ pasa AA sobre las cinco superficies de light (1 ms)
    ✓ pasa AA sobre las cinco superficies de dark
    ✓ no degrada el tema oscuro: la tinta sigue siendo el verde de hoy (1 ms)
  #61 R5: token warning-strong con AA sobre surface y warning-soft
    ✓ registra el espejo --color-warning-strong para las utilidades text-*
    ✓ define la variante AA del ámbar en light
    ✓ define la variante AA del ámbar en dark
    ✓ pasa AA sobre bg-surface y bg-warning-soft en light
    ✓ pasa AA sobre bg-surface y bg-warning-soft en dark
    ✓ conserva el ámbar puro de iconos y rellenos en light (1 ms)
    ✓ conserva el ámbar puro de iconos y rellenos en dark
  #61 R6: muted light pasa AA sobre bg-default sin tocar dark
    ✓ sube el gris de texto claro hasta cruzar el umbral
    ✓ pasa AA también sobre surface y surface-secondary (1 ms)
    ✓ no toca el gris del tema oscuro, que ya pasaba
  #64 R1: global.css declara la paleta pastel categórica en tema claro
    ✓ declara los diez tokens exactos y reusa la familia verde existente
  #64 R2: el tema oscuro de la paleta se diseña a la profundidad de surface-secondary
    ✓ declara los diez tokens exactos y alinea la luminancia de las superficies (1 ms)
  #64 R3: cada tinta categórica pasa AA sobre su superficie en los dos temas
    ✓ reproduce el ancla de contraste usada por #61
    ✓ light blue conserva el ratio diseñado
    ✓ light amber conserva el ratio diseñado (1 ms)
    ✓ light green conserva el ratio diseñado
    ✓ light violet conserva el ratio diseñado
    ✓ light rose conserva el ratio diseñado
    ✓ light neutral conserva el ratio diseñado (1 ms)
    ✓ dark blue conserva el ratio diseñado
    ✓ dark amber conserva el ratio diseñado
    ✓ dark green conserva el ratio diseñado (4 ms)
    ✓ dark violet conserva el ratio diseñado (1 ms)
    ✓ dark rose conserva el ratio diseñado
    ✓ dark neutral conserva el ratio diseñado
  #64 R4: ninguna categoría se confunde con otra ni con un token de estado
    ✓ separa las quince parejas de superficies en light (2 ms)
    ✓ separa las quince parejas de superficies en dark (1 ms)
    ✓ separa superficies y tintas de los tokens de estado en light (9 ms)
    ✓ separa superficies y tintas de los tokens de estado en dark (8 ms)
  #166 R1: global.css declara el labio gris en los dos temas
    ✓ declara --color-lip-gray exacto en light (1 ms)
    ✓ declara --color-lip-gray exacto en dark

  ● #172 R1: tokens de texto de cuenta › #172 R1: define text-13, text-15 y text-17 con sus valores exactos dentro de @theme

    expect(received).toMatchObject(expected)

    - Expected  - 1
    + Received  + 1

      Object {
    -   "text-13": "13px",
    +   "text-13": "12px",
        "text-15": "15px",
        "text-17": "17px",
      }

      62 | describe('#172 R1: tokens de texto de cuenta', () => {
      63 |   it('#172 R1: define text-13, text-15 y text-17 con sus valores exactos dentro de @theme', () => {
    > 64 |     expect(parseVariables(extractTheme())).toMatchObject({
         |                                            ^
      65 |       'text-13': '13px',
      66 |       'text-15': '15px',
      67 |       'text-17': '17px',

      at Object.toMatchObject (src/theme/__tests__/global-css.test.ts:64:44)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 53 passed, 54 total
Snapshots:   0 total
Time:        1.345 s, estimated 2 s
Ran all test suites within paths "src/theme/__tests__/global-css.test.ts".
exit=1
```

Restauración ejecutada:

```bash
git checkout HEAD -- src/theme/global.css
git diff --quiet HEAD -- src/theme/global.css; echo "exit=$?"
```

```text
exit=0
```

### S16c — register.country en es: País → País (código de 2 letras)

```bash
bunx jest --testTimeout=30000 --runTestsByPath src/providers/__tests__/language-provider.test.tsx
```

```text
FAIL src/providers/__tests__/language-provider.test.tsx
  #65 R12: el catálogo tiene los dos idiomas y t resuelve claves y parámetros
    ✓ mantiene la base más las claves de #68 y los mismos marcadores en ambos idiomas (37 ms)
    ✓ #95 R5: el catálogo ya no trae las seis claves de volver (6 ms)
    ✓ #73 R5: el catalogo trae home.unknown y deviceConnectivity.offline en los dos idiomas y registrados en la tabla (1 ms)
    ✓ usa español por defecto, traduce e interpola sin ocultar parámetros ausentes (18 ms)
  #98 R3: el catálogo trae las cuatro claves de comidas servidas
    ✓ registra las cuatro claves en los dos idiomas y en la tabla de la spec de idioma (2 ms)
  #41 R1: el catálogo trae las once claves de zonas seguras
    ✓ registra las once claves en los dos idiomas y en la tabla de la spec de idioma (4 ms)
  #146 R1: el catálogo trae las claves del editor de zonas
    ✓ registra las claves del editor en los dos idiomas y en la tabla de la spec de idioma (4 ms)
  #100 R1: el catálogo trae las tres claves del detalle de alerta
    ✓ registra las tres claves en los dos idiomas y en la tabla de la spec de idioma (2 ms)
  #90 R2: el catálogo trae weightLog.dateCannotBeAfterToday en los dos idiomas y registrada en la tabla
    ✓ incluye la traducción y su fila normativa (1 ms)
  #65 R15: el locale de fechas y números sigue al idioma elegido
    ✓ maps es to es-MX (1 ms)
    ✓ maps en to en-US (2 ms)
  #78 R3: el catálogo trae las claves del centro de alertas
    ✓ incluye las catorce traducciones en inglés y español (3 ms)
  #147 R1: el catálogo trae las nueve claves del horario editable
    ✓ registra las nueve claves en los dos idiomas y en la tabla de la spec de idioma (4 ms)
  #105 R5: meals history copy matches the approved bilingual table
    ✓ registers food.mealsHistory in both languages and the design table (1 ms)
    ✓ registers food.mealsHistoryLinkSubtitle in both languages and the design table (1 ms)
    ✓ registers mealsHistory.mealsHistory in both languages and the design table (1 ms)
    ✓ registers mealsHistory.previousMonth in both languages and the design table
    ✓ registers mealsHistory.nextMonth in both languages and the design table (1 ms)
    ✓ registers mealsHistory.emptyMonth in both languages and the design table (1 ms)
    ✓ registers mealsHistory.noMealsOnDay in both languages and the design table (1 ms)
    ✓ registers mealsHistory.servedOne in both languages and the design table (2 ms)
    ✓ registers mealsHistory.servedMany in both languages and the design table (2 ms)
  #117 R1: el catálogo trae las claves de recuperar contraseña
    ✓ registra las seis claves en los dos idiomas, con {{email}} en forgot.sentTo, y en la tabla de la spec de idioma (3 ms)
    ✓ retira forgot.comingSoon de los dos idiomas
  #158 R1: claves y nueva frase de Pingo
    ✓ #158 R1: declara los 13 pares exactos y su registro (5 ms)
  #167 R5: el saludo de Pingo en login
    ✓ #167 R5: declara login.pingoGreeting en los dos idiomas y su registro (1 ms)
  #169 R9: claves de peso nuevas
    ✓ registra las dos claves en los dos idiomas y en la tabla de la spec de idioma (3 ms)
  #170 R1: claves de alertas agrupadas y mini-mapa
    ✓ #170 R1: declara los 7 pares exactos y su registro (3 ms)
  #172 R16: el copy de las pantallas de cuenta como el canvas
    ✕ #172 R16: declara las claves de cuenta en los dos idiomas y su registro (3 ms)

  ● #172 R16: el copy de las pantallas de cuenta como el canvas › #172 R16: declara las claves de cuenta en los dos idiomas y su registro

    expect(received).toBe(expected) // Object.is equality

    Expected: "País"
    Received: "País (código de 2 letras)"

      603 |     for (const [key, englishValue, spanishValue] of translations) {
      604 |       expect(english[key]).toBe(englishValue);
    > 605 |       expect(spanish[key]).toBe(spanishValue);
          |                            ^
      606 |       expect(languageDesign).toMatch(
      607 |         new RegExp(
      608 |           '\\| — \\| `' + escapeRegExp(key) +

      at Object.toBe (src/providers/__tests__/language-provider.test.tsx:605:28)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 28 passed, 29 total
Snapshots:   0 total
Time:        3.346 s
Ran all test suites within paths "src/providers/__tests__/language-provider.test.tsx".
exit=1
```

Restauración ejecutada:

```bash
git checkout HEAD -- src/i18n/catalog.ts
git diff --quiet HEAD -- src/i18n/catalog.ts; echo "exit=$?"
```

```text
exit=0
```

### S2a — invertir canGoBack() ? back() : replace(fallback)

```bash
bunx jest --testTimeout=30000 --runTestsByPath src/components/__tests__/back-button.test.tsx
```

```text
FAIL src/components/__tests__/back-button.test.tsx (6.235 s)
  #172 R2: BackButton
    ✓ #172 R2: es un botón de 44 con nombre accesible «Volver» (33 ms)
    ✓ #172 R2: en inglés se llama «Back» (4 ms)
    ✓ #172 R2: pinta ChevronLeft de 24 en foreground (3 ms)
    ✕ #172 R2: con historial vuelve atrás y no reemplaza (4 ms)
    ✕ #172 R2: sin historial reemplaza por el fallback (3 ms)

  ● #172 R2: BackButton › #172 R2: con historial vuelve atrás y no reemplaza

    expect(jest.fn()).toHaveBeenCalledTimes(expected)

    Expected number of calls: 1
    Received number of calls: 0

      62 |     await renderBack();
      63 |     await fireEvent.press(screen.getByTestId('back'));
    > 64 |     expect(mockRouter.back).toHaveBeenCalledTimes(1);
         |                             ^
      65 |     expect(mockRouter.replace).not.toHaveBeenCalled();
      66 |   });
      67 |

      at Object.toHaveBeenCalledTimes (src/components/__tests__/back-button.test.tsx:64:29)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

  ● #172 R2: BackButton › #172 R2: sin historial reemplaza por el fallback

    expect(jest.fn()).toHaveBeenCalledTimes(expected)

    Expected number of calls: 1
    Received number of calls: 0

      70 |     await renderBack();
      71 |     await fireEvent.press(screen.getByTestId('back'));
    > 72 |     expect(mockRouter.replace).toHaveBeenCalledTimes(1);
         |                                ^
      73 |     expect(mockRouter.replace).toHaveBeenCalledWith('/welcome');
      74 |     expect(mockRouter.back).not.toHaveBeenCalled();
      75 |   });

      at Object.toHaveBeenCalledTimes (src/components/__tests__/back-button.test.tsx:72:32)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

Test Suites: 1 failed, 1 total
Tests:       2 failed, 3 passed, 5 total
Snapshots:   0 total
Time:        6.42 s, estimated 7 s
Ran all test suites within paths "src/components/__tests__/back-button.test.tsx".
exit=1
```

Restauración ejecutada:

```bash
git checkout HEAD -- src/components/back-button.tsx
git diff --quiet HEAD -- src/components/back-button.tsx; echo "exit=$?"
```

```text
exit=0
```

### S2b — quitar accessibilityLabel={t('common.back')}

```bash
bunx jest --testTimeout=30000 --runTestsByPath src/components/__tests__/back-button.test.tsx
```

```text
FAIL src/components/__tests__/back-button.test.tsx
  #172 R2: BackButton
    ✕ #172 R2: es un botón de 44 con nombre accesible «Volver» (27 ms)
    ✕ #172 R2: en inglés se llama «Back» (3 ms)
    ✓ #172 R2: pinta ChevronLeft de 24 en foreground (4 ms)
    ✓ #172 R2: con historial vuelve atrás y no reemplaza (3 ms)
    ✓ #172 R2: sin historial reemplaza por el fallback (3 ms)

  ● #172 R2: BackButton › #172 R2: es un botón de 44 con nombre accesible «Volver»

    Unable to find an element with role: button, name: Volver

    <View
      accessibilityRole="button"
      accessible={true}
      testID="back"
    >
      <View
        testID="icon-chevron-left"
      />
    </View>

      39 |   it('#172 R2: es un botón de 44 con nombre accesible «Volver»', async () => {
      40 |     await renderBack();
    > 41 |     const back = screen.getByRole('button', { name: 'Volver' });
         |                         ^
      42 |     expect(back.props.className).toBe('size-11 items-center justify-center rounded-full');
      43 |     expect(back.children).toHaveLength(1);
      44 |   });

      at Object.getByRole (src/components/__tests__/back-button.test.tsx:41:25)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

  ● #172 R2: BackButton › #172 R2: en inglés se llama «Back»

    Unable to find an element with role: button, name: Back

    <View
      accessibilityRole="button"
      accessible={true}
      testID="back"
    >
      <View
        testID="icon-chevron-left"
      />
    </View>

      46 |   it('#172 R2: en inglés se llama «Back»', async () => {
      47 |     await renderBack('en');
    > 48 |     expect(screen.getByRole('button', { name: 'Back' })).toBeOnTheScreen();
         |                   ^
      49 |   });
      50 |
      51 |   it('#172 R2: pinta ChevronLeft de 24 en foreground', async () => {

      at Object.getByRole (src/components/__tests__/back-button.test.tsx:48:19)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

Test Suites: 1 failed, 1 total
Tests:       2 failed, 3 passed, 5 total
Snapshots:   0 total
Time:        4.614 s, estimated 7 s
Ran all test suites within paths "src/components/__tests__/back-button.test.tsx".
exit=1
```

Restauración ejecutada:

```bash
git checkout HEAD -- src/components/back-button.tsx
git diff --quiet HEAD -- src/components/back-button.tsx; echo "exit=$?"
```

```text
exit=0
```

## Anclas ejecutadas después de cada verde

```text
c2 — tokens de texto exactos: 3
c4 — B11: 774
c4 — common.back: 2
c4 — register.country en es: 1
c4 — filas añadidas: 3
c4 — fila cambiada: 1
c4 — fila histórica del literal cambiado: 1
c4 — B19: sin salida
c6 — t(common.back): 1
c6 — ficheros de producción con useRouter: 0
c8 candidato — withTiming(-MOTION_PINGO_FLOAT_OFFSET_Y, MOTION_PINGO_FLOAT_TIMING): 1
c8 candidato — cancelAnimation(: 1
c8 candidato — MOTION_FLOAT_: 0
c8 candidato — B21: 19
c8 candidato — bienvenida sin cambios contra H0: exit=0
```

**Anclas de T22 paso 5:** no ejecutadas, porque el guion quedó detenido en T4.
No se presentan cifras futuras como si se hubieran medido.

## Implementación candidata de c8 retirada

Esta candidata se probó una vez en el gate c8. No se añadió al índice ni al
historial. Las anclas de c8 correspondían a ella. Se retiró con:

```bash
git checkout HEAD -- src/theme/motion.ts
mv src/components/pingo-float.tsx /tmp/pingo-float-c8-172.tsx
git diff --quiet HEAD -- src/theme/motion.ts; echo "exit=$?"
```

```text
exit=0
git status --short: sin salida
```

Diff conservado para reconstruir la candidata tras corregir el guion:

```diff
diff --git a/mobile-pet-tracker/src/theme/motion.ts b/mobile-pet-tracker/src/theme/motion.ts
index 374d6d33..6ed4d3ad 100644
--- a/mobile-pet-tracker/src/theme/motion.ts
+++ b/mobile-pet-tracker/src/theme/motion.ts
@@ -55,3 +55,11 @@ export const MOTION_PING_TIMING = {
   easing: Easing.bezier(0.23, 1, 0.32, 1),
   reduceMotion: ReduceMotion.System,
 };
+
+// #172 R4
+export const MOTION_PINGO_FLOAT_OFFSET_Y = 10;
+export const MOTION_PINGO_FLOAT_TIMING = {
+  duration: 1500,
+  easing: Easing.bezier(0.42, 0, 0.58, 1),
+  reduceMotion: ReduceMotion.System,
+};
diff --git a/src/components/pingo-float.tsx b/src/components/pingo-float.tsx
new file mode 100644
index 00000000..013bcad9
--- /dev/null
+++ b/src/components/pingo-float.tsx
@@ -0,0 +1,29 @@
+import { useEffect, type ReactNode } from 'react';
+import Animated, {
+  cancelAnimation,
+  useAnimatedStyle,
+  useReducedMotion,
+  useSharedValue,
+  withRepeat,
+  withTiming,
+} from 'react-native-reanimated';
+
+import { MOTION_PINGO_FLOAT_OFFSET_Y, MOTION_PINGO_FLOAT_TIMING } from '../theme/motion';
+
+export function PingoFloat({ testID, children }: { testID: string; children: ReactNode }) {
+  const reduceMotion = useReducedMotion();
+  const translateY = useSharedValue(0);
+
+  useEffect(() => {
+    if (!reduceMotion) {
+      translateY.set(withRepeat(withTiming(-MOTION_PINGO_FLOAT_OFFSET_Y, MOTION_PINGO_FLOAT_TIMING), -1, true));
+    }
+    return () => cancelAnimation(translateY);
+  }, [reduceMotion, translateY]);
+
+  const animatedStyle = useAnimatedStyle(() => ({
+    transform: [{ translateY: translateY.get() }],
+  }));
+
+  return <Animated.View testID={testID} style={animatedStyle}>{children}</Animated.View>;
+}
```

## Desviaciones

1. Parada en T4/c8: el inventario ordenado prescrito contradice `.sort()`.
   No se completaron T5–T22; no se declararon R4 ni R16 completos.
   Se documentó la trazabilidad parcial y este informe antes del cierre T22
   para cumplir el reporte de bloqueo y dejar el árbol limpio.
2. H0 fue `e0178ab5`, pero al revisar el historial aparece `94ddc750`
   (`docs(mobile-account-screens-polish): #172 firma Enmienda E1`) entre H0 y
   c1. Lo escribió otro actor: su único cambio es la firma humana de E1 en
   requirements.md. No se modificó ni revirtió. El handoff ya decía que E1
   estaba firmada antes de lanzar; no se autoaprobó ninguna casilla.
3. Las lecturas iniciales tuvieron dos errores de invocación al asumir la
   estructura de feature_list.json y un par de nombres de fichero de Jest.
   Se corrigieron las lecturas sin tocar código; ningún gate se falseó ni
   se saltó. No hubo timeout, SIGKILL, reinstalación ni cambio de dependencias.
4. El primer `git commit --only` del informe rechazó su pathspec porque el
   fichero nuevo aún no estaba en el índice. Se añadió con `git add` de su
   ruta explícita y se repitió el mismo comando, sin amend ni rebase.

## Estado entregado antes de Reanudación 1 — historia

- R1 y R2 implementados con sus sondas; parte de R16 implementada y comprobada.
- R4 tiene solo el commit rojo c7 en el árbol; su implementación sigue pendiente.
- R3, R5–R15 y R17–R20 pendientes. R21: pendiente (humano).
- Traspaso al leader: corregir R4/T4 y continuar en c8. El leader ejecuta
  `./init.sh` y organiza reviewer, push y PR cuando termine el guion.
- No se tocaron feature_list.json, progress/current.md, STATUS.md, el
  frontmatter de la spec, package.json ni bun.lock. La firma E1 ajena es
  el único cambio adicional en requirements.md contra H0.

## Reanudación 1

Inicio sobre `a03a9d9855333c2941b009e20bbf08eff58cd5f6`; H0 sigue siendo
`e0178ab5c1f67e917cf4116332a0e9196d67b344`. Los commits del leader de E1/E2
se conservaron y no se cuentan como implementación. No se reinstalaron deps.

### Comprobaciones antes de tocar código

```text
command grep -c -F -- '- [x] Enmienda E2 aprobada por humano' specs/mobile-account-screens-polish/requirements.md
1
git status --short
(sin salida)
git log -1 --format=%h -- mobile-pet-tracker
e31582c3
```

### Estado al detenerse

- E2 aplicada en c7b: solo dos líneas movidas, gate rojo igual a c7.
- C8 quedó verde, con S4a–S4e verificadas. Se implementaron c9–c22.
- Último commit de código: `14c69144 feat(mobile): errores por campo del registro con icono (R10)`.
- El gate c22 pasó con 6 suites, 229 tests, typecheck exit=0 y lint vacío.
- S10a dio el rojo previsto; S10b dio un rojo diferente; S10c dio el previsto.
- Las tres mutaciones se restauraron a HEAD con diff exit=0. Árbol limpio.
- No se empezaron T12/c23 ni tareas posteriores. No se ejecutó T22.
- No se declara la feature completa ni se hace push/PR. R21 queda pendiente (humano).

### Bloqueo de T11/S10b — historia (resuelto por E3)

La spec prescribe pintar en apellidos
`<FormError testID="register-last-name-message" message="" />` sin condición.
Espera 1 failed en `#172 R10: sin errores ningún campo pinta mensaje`
(longitud 2). La ejecución dio 1 failed, pero en
`#172 R10: cada campo con error lleva icono y texto seleccionable`, por
mensaje vacío cuando se esperaba `lastName no vale`. El test sin errores
sigue verde: su query recibe 0 nodos, porque `FieldError` no los renderiza.

Causa comprobada en el código instalado de heroui-native:
`mobile-pet-tracker/node_modules/heroui-native/src/components/field-error/field-error.tsx`:

```tsx
const isInvalid =
  localIsInvalid !== undefined
    ? localIsInvalid
    : (formField?.isInvalid ?? false);
// ...
if (!isInvalid) return null;
```

Al montar el registro, `Boolean(fieldErrors.lastName)` es false. Aunque la
sonda pase un FormError incondicional como hijo de FieldError, el padre
devuelve null; ni el hijo ni su fila llegan al árbol. Con los errores de
validación montados, el padre sí pinta y el mensaje vacío dispara la otra
aserción. Esto contradice el rojo esperado de S10b, no el condicional de c22.

No se cambió el test, la producción ni el contrato de la sonda para cuadrar.
El leader debe reconciliar R10/T11 con este comportamiento antes de reanudar.
Se retoma la verificación de S10b y después T12/c23; no hay que rehacer
los commits verdes ya comprobados.

Comando y salida literal de S10b (bloque de fallo, sin mensajes Console):

```bash
bunx jest --testTimeout=30000 --runTestsByPath src/screens/register/index.test.tsx
```

```text
Test Suites: 1 failed, 1 total
Tests:       1 failed, 28 passed, 29 total
Time:        8.349 s, estimated 9 s
  ● #167 R7: Pingo en la cabecera del registro › #172 R10: cada campo con error lleva icono y texto seleccionable

    expect(instance).toHaveTextContent()

    Expected instance to have text content:
      lastName no vale
    Received:

      424 |       const text = within(row).getByTestId(`register-${field}-message`);
      425 |       expect(row.children).toEqual([within(row).getByTestId('icon-alert-circle'), text]);
    > 426 |       expect(text).toHaveTextContent(`${path} no vale`);
          |                    ^
      427 |       expect(text.props.selectable).toBe(true);
      428 |     }
      429 |     expect(screen.getAllByTestId(/^register-.+-message-row$/)).toHaveLength(7);

      at Object.toHaveTextContent (src/screens/register/index.test.tsx:426:20)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
exit=1
```

Restauración literal:

```text
git checkout HEAD -- src/screens/register/index.tsx
git diff --quiet HEAD -- src/screens/register/index.tsx; echo "exit=$?"
exit=0
```

### Tabla de commits de Reanudación 1

| Paso | Hash | Mensaje literal | Tests: | Rojos y tipo |
|---|---|---|---|---|
| c7b | 75f849a6 | `test(mobile): orden de sort en el inventario de motion (R4)` | `Tests:       2 failed, 15 passed, 17 total` | 1 suite módulo + 2 aserciones |
| c7c (correctivo) | edf99020 | `test(mobile): tipa translateY en el candado de Pingo (R4)` | `Tests:       2 failed, 15 passed, 17 total` | 1 suite módulo + 2 aserciones |
| c8 | c12c676f | `feat(mobile): Pingo flota 10 px en 3 s en cuenta (R4)` | `Tests:       214 passed, 214 total` | 0 |
| c9 | 1b4551c7 | `test(mobile): Pingo flota en registro, recuperar y nueva contraseña (R5)` | `Tests:       8 failed, 86 passed, 94 total` | 8: 6 aserciones + 2 consultas |
| c10 | 60d26f5c | `feat(mobile): Pingo flota en registro, recuperar y nueva contraseña (R5)` | `Tests:       288 passed, 288 total` | 0 |
| c11 | 29e2acf6 | `test(mobile): fila Volver en login, registro y recuperar (R3)` | `Tests:       8 failed, 150 passed, 158 total` | 8: 4 aserciones + 4 consultas |
| c12 | 984043e1 | `feat(mobile): fila Volver en login, registro y recuperar (R3)` | `Tests:       282 passed, 282 total` | 0 |
| c13 | b8384616 | `test(mobile): recetas de texto e Inter ExtraBold en cuenta (R6)` | `Tests:       9 failed, 83 passed, 92 total` | 9 aserciones |
| c14 | 4b5675c6 | `feat(mobile): recetas de texto e Inter ExtraBold en cuenta (R6)` | `Tests:       324 passed, 324 total` | 0 |
| c15 | 36f46603 | `test(mobile): enlaces y orden del cuerpo de login (R7)` | `Tests:       4 failed, 26 passed, 30 total` | 4 aserciones |
| c16 | 7d56bacb | `feat(mobile): enlaces y orden del cuerpo de login (R7)` | `Tests:       262 passed, 262 total` | 0 |
| c17 | 28ad44aa | `test(mobile): FormError con icono y texto seleccionable (R9)` | `Tests:       5 failed, 120 passed, 125 total` | 1 suite módulo + 5 tests (3 consultas y 2 aserciones) |
| c18 | e1dcae38 | `feat(mobile): FormError en las cuatro pantallas de cuenta (R9)` | `Tests:       322 passed, 322 total` | 0 |
| c19 | 1ad828d3 | `test(mobile): mostrar y ocultar la contraseña en cuenta (R8)` | `Tests:       5 failed, 86 passed, 91 total` | 1 suite módulo + 5 consultas |
| c20 | 45e4c40e | `feat(mobile): mostrar y ocultar la contraseña en cuenta (R8)` | `Tests:       289 passed, 289 total` | 0 |
| c21 | ca1bac6b | `test(mobile): errores por campo del registro con icono (R10)` | `Tests:       1 failed, 34 passed, 35 total` | 1 consulta; 2 it nacen verdes |
| c22 | 14c69144 | `feat(mobile): errores por campo del registro con icono (R10)` | `Tests:       229 passed, 229 total` | 0 |

C7b no toca nada más. C7c corrige solo tipos de lectura de translateY:
no cambia títulos, valores, tiempos, precisión ni número de tests; el
componente de producción no existía al commitearlo y el rojo fue el de c7.

### Gates de la reanudación — extractos literales

Se conserva el stdout completo en `/tmp/<label>-<phase>-172.log` y
`/tmp/evidence-172.jsonl`. Los siguientes extractos mantienen los resúmenes
y los nombres de los fallos; se omiten únicamente los avisos Console.

#### c7b — jest

```bash
bunx jest --testTimeout=30000 --runTestsByPath src/components/__tests__/pingo-float.test.tsx src/theme/__tests__/motion.test.ts
```

```text
Test Suites: 2 failed, 2 total
Tests:       2 failed, 15 passed, 17 total
Time:        2.791 s, estimated 3 s
  ● Test suite failed to run
  ● #152 R1: las duraciones y el preset de movimiento viven en un solo sitio › no exporta nada más
  ● #172 R4: la flotación de Pingo en cuenta vive en motion.ts › #172 R4: declara la flotación de Pingo del canvas: 10 px y medio ciclo de 1500 ms ease-in-out
exit=1
```

#### c8r1 — jest

```bash
bunx jest --testTimeout=30000 --runTestsByPath src/components/__tests__/pingo-float.test.tsx src/theme/__tests__/motion.test.ts src/__tests__/ui-language.test.ts src/__tests__/design-drift.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/legibility-classnames.test.ts
```

```text
Test Suites: 6 passed, 6 total
Tests:       214 passed, 214 total
Time:        5.126 s
exit=0
```

#### c8r1 — router

```bash
test ! -e .expo/types/router.d.ts
```

```text
exit=0
```

#### c8r1 — typecheck

```bash
bun run typecheck
```

```text
$ tsc --noEmit
src/components/__tests__/pingo-float.test.tsx(24,12): error TS2532: Object is possibly 'undefined'.
src/components/__tests__/pingo-float.test.tsx(24,71): error TS2339: Property 'translateY' does not exist on type 'string | ({ scale: AnimatableNumericValue; } & { perspective?: undefined; rotate?: undefined; rotateX?: undefined; rotateY?: undefined; rotateZ?: undefined; scaleX?: undefined; ... 5 more ...; matrix?: undefined; }) | ... 11 more ... | ({ ...; } & { ...; })'.
  Property 'translateY' does not exist on type 'string'.
src/components/__tests__/pingo-float.test.tsx(27,12): error TS2532: Object is possibly 'undefined'.
src/components/__tests__/pingo-float.test.tsx(27,71): error TS2339: Property 'translateY' does not exist on type 'string | ({ scale: AnimatableNumericValue; } & { perspective?: undefined; rotate?: undefined; rotateX?: undefined; rotateY?: undefined; rotateZ?: undefined; scaleX?: undefined; ... 5 more ...; matrix?: undefined; }) | ... 11 more ... | ({ ...; } & { ...; })'.
  Property 'translateY' does not exist on type 'string'.
src/components/__tests__/pingo-float.test.tsx(30,12): error TS2532: Object is possibly 'undefined'.
src/components/__tests__/pingo-float.test.tsx(30,71): error TS2339: Property 'translateY' does not exist on type 'string | ({ scale: AnimatableNumericValue; } & { perspective?: undefined; rotate?: undefined; rotateX?: undefined; rotateY?: undefined; rotateZ?: undefined; scaleX?: undefined; ... 5 more ...; matrix?: undefined; }) | ... 11 more ... | ({ ...; } & { ...; })'.
  Property 'translateY' does not exist on type 'string'.
src/components/__tests__/pingo-float.test.tsx(33,12): error TS2532: Object is possibly 'undefined'.
src/components/__tests__/pingo-float.test.tsx(33,71): error TS2339: Property 'translateY' does not exist on type 'string | ({ scale: AnimatableNumericValue; } & { perspective?: undefined; rotate?: undefined; rotateX?: undefined; rotateY?: undefined; rotateZ?: undefined; scaleX?: undefined; ... 5 more ...; matrix?: undefined; }) | ... 11 more ... | ({ ...; } & { ...; })'.
  Property 'translateY' does not exist on type 'string'.
src/components/__tests__/pingo-float.test.tsx(36,12): error TS2532: Object is possibly 'undefined'.
src/components/__tests__/pingo-float.test.tsx(36,71): error TS2339: Property 'translateY' does not exist on type 'string | ({ scale: AnimatableNumericValue; } & { perspective?: undefined; rotate?: undefined; rotateX?: undefined; rotateY?: undefined; rotateZ?: undefined; scaleX?: undefined; ... 5 more ...; matrix?: undefined; }) | ... 11 more ... | ({ ...; } & { ...; })'.
  Property 'translateY' does not exist on type 'string'.
src/components/__tests__/pingo-float.test.tsx(43,12): error TS2532: Object is possibly 'undefined'.
src/components/__tests__/pingo-float.test.tsx(43,71): error TS2339: Property 'translateY' does not exist on type 'string | ({ scale: AnimatableNumericValue; } & { perspective?: undefined; rotate?: undefined; rotateX?: undefined; rotateY?: undefined; rotateZ?: undefined; scaleX?: undefined; ... 5 more ...; matrix?: undefined; }) | ... 11 more ... | ({ ...; } & { ...; })'.
  Property 'translateY' does not exist on type 'string'.
src/components/__tests__/pingo-float.test.tsx(45,12): error TS2532: Object is possibly 'undefined'.
src/components/__tests__/pingo-float.test.tsx(45,71): error TS2339: Property 'translateY' does not exist on type 'string | ({ scale: AnimatableNumericValue; } & { perspective?: undefined; rotate?: undefined; rotateX?: undefined; rotateY?: undefined; rotateZ?: undefined; scaleX?: undefined; ... 5 more ...; matrix?: undefined; }) | ... 11 more ... | ({ ...; } & { ...; })'.
  Property 'translateY' does not exist on type 'string'.
src/components/__tests__/pingo-float.test.tsx(47,12): error TS2532: Object is possibly 'undefined'.
src/components/__tests__/pingo-float.test.tsx(47,71): error TS2339: Property 'translateY' does not exist on type 'string | ({ scale: AnimatableNumericValue; } & { perspective?: undefined; rotate?: undefined; rotateX?: undefined; rotateY?: undefined; rotateZ?: undefined; scaleX?: undefined; ... 5 more ...; matrix?: undefined; }) | ... 11 more ... | ({ ...; } & { ...; })'.
  Property 'translateY' does not exist on type 'string'.
exit=2
```

#### c7c — jest

```bash
bunx jest --testTimeout=30000 --runTestsByPath src/components/__tests__/pingo-float.test.tsx src/theme/__tests__/motion.test.ts
```

```text
Test Suites: 2 failed, 2 total
Tests:       2 failed, 15 passed, 17 total
Time:        2.66 s, estimated 3 s
  ● #152 R1: las duraciones y el preset de movimiento viven en un solo sitio › no exporta nada más
  ● #172 R4: la flotación de Pingo en cuenta vive en motion.ts › #172 R4: declara la flotación de Pingo del canvas: 10 px y medio ciclo de 1500 ms ease-in-out
  ● Test suite failed to run
exit=1
```

#### c8r1b — jest

```bash
bunx jest --testTimeout=30000 --runTestsByPath src/components/__tests__/pingo-float.test.tsx src/theme/__tests__/motion.test.ts src/__tests__/ui-language.test.ts src/__tests__/design-drift.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/legibility-classnames.test.ts
```

```text
Test Suites: 6 passed, 6 total
Tests:       214 passed, 214 total
Time:        3.498 s, estimated 5 s
exit=0
```

#### c8r1b — router

```bash
test ! -e .expo/types/router.d.ts
```

```text
exit=0
```

#### c8r1b — typecheck

```bash
bun run typecheck
```

```text
$ tsc --noEmit
exit=0
```

#### c8r1b — lint

```bash
bunx expo lint --no-cache > /tmp/lint-172.log 2>&1
```

```text
exit=0
vacio=0
```

#### c9 — jest

```bash
bunx jest --testTimeout=30000 --runTestsByPath src/screens/register/index.test.tsx src/screens/forgot/index.test.tsx src/screens/reset-password/index.test.tsx
```

```text
Test Suites: 3 failed, 3 total
Tests:       8 failed, 86 passed, 94 total
Time:        16.256 s, estimated 21 s
  ● #167 R10: Pingo y tarjeta de estado en nueva contraseña › #172 R5: Pingo de nueva contraseña flota en el formulario y en el éxito
  ● #167 R10: Pingo y tarjeta de estado en nueva contraseña › #167 R10: la cabecera lleva a Pingo y después el título
  ● #167 R10: Pingo y tarjeta de estado en nueva contraseña › #167 R10: el éxito conserva la cabecera del formulario
  ● #167 R9: Pingo y pop del candado en recuperar › #167 R9: Pingo precede al tile del candado en el formulario
  ● #167 R9: Pingo y pop del candado en recuperar › #167 R9: Pingo precede al tile del candado tras enviar
  ● #172 R5: flotación de recuperar › #172 R5: Pingo de recuperar flota
  ● #167 R7: Pingo en la cabecera del registro › #167 R7: la cabecera lleva a Pingo y después el título
  ● #167 R7: Pingo en la cabecera del registro › #172 R5: Pingo del registro flota
exit=1
```

#### c10 — jest

```bash
bunx jest --testTimeout=30000 --runTestsByPath src/screens/register/index.test.tsx src/screens/forgot/index.test.tsx src/screens/reset-password/index.test.tsx src/__tests__/ui-language.test.ts src/__tests__/design-drift.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/legibility-classnames.test.ts
```

```text
Test Suites: 7 passed, 7 total
Tests:       288 passed, 288 total
Time:        17.028 s
exit=0
```

#### c10 — router

```bash
test ! -e .expo/types/router.d.ts
```

```text
exit=0
```

#### c10 — typecheck

```bash
bun run typecheck
```

```text
$ tsc --noEmit
exit=0
```

#### c10 — lint

```bash
bunx expo lint --no-cache > /tmp/lint-172.log 2>&1
```

```text
exit=0
vacio=0
```

#### c11 — jest

```bash
bunx jest --testTimeout=30000 --runTestsByPath src/screens/login/index.test.tsx src/screens/register/index.test.tsx src/screens/forgot/index.test.tsx src/__tests__/design-drift.test.ts
```

```text
Test Suites: 4 failed, 4 total
Tests:       8 failed, 150 passed, 158 total
Time:        12.044 s, estimated 16 s
  ● #167 R6: Pingo saluda en login y la pantalla entra en dos tiempos › #172 R3: la cabecera lleva Volver, el saludo y el título
  ● #167 R6: Pingo saluda en login y la pantalla entra en dos tiempos › #172 R3: Volver de login vuelve a la bienvenida sin historial
  ● #149 R4: solo cuatro ficheros de producción navegan a login › #149 R4: inventaría cada ruta a login en producción
  ● #172 R3: Volver en recuperar › #172 R3: la fila Volver encabeza el scroll en los dos estados
  ● #172 R3: Volver en recuperar › #172 R3: Volver de recuperar va al login sin historial
  ● #167 R7: Pingo en la cabecera del registro › #167 R7: la cabecera entra con rise
  ● #167 R7: Pingo en la cabecera del registro › #172 R3: la cabecera lleva la fila Volver-Pingo y después el título
  ● #167 R7: Pingo en la cabecera del registro › #172 R3: Volver del registro vuelve a la bienvenida sin historial
exit=1
```

#### c12 — jest

```bash
bunx jest --testTimeout=30000 --runTestsByPath src/screens/login/index.test.tsx src/screens/register/index.test.tsx src/screens/forgot/index.test.tsx src/__tests__/ui-language.test.ts src/__tests__/design-drift.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/legibility-classnames.test.ts
```

```text
Test Suites: 7 passed, 7 total
Tests:       282 passed, 282 total
Time:        12.988 s
exit=0
```

#### c12 — router

```bash
test ! -e .expo/types/router.d.ts
```

```text
exit=0
```

#### c12 — typecheck

```bash
bun run typecheck
```

```text
$ tsc --noEmit
exit=0
```

#### c12 — lint

```bash
bunx expo lint --no-cache > /tmp/lint-172.log 2>&1
```

```text
exit=0
vacio=0
```

#### c13 — jest

```bash
bunx jest --testTimeout=30000 --runTestsByPath src/__tests__/account-screens-polish.test.ts src/theme/__tests__/font-registration.test.ts src/screens/login/index.test.tsx src/screens/register/index.test.tsx src/screens/reset-password/index.test.tsx
```

```text
Test Suites: 5 failed, 5 total
Tests:       9 failed, 83 passed, 92 total
Time:        13.465 s
  ● #167 R10: Pingo y tarjeta de estado en nueva contraseña › #167 R10: el texto de éxito es tinta accent-strong y seleccionable
  ● #167 R6: Pingo saluda en login y la pantalla entra en dos tiempos › #172 R6: el título de la cabecera pesa 30/900 al inicio
  ● #167 R6: Pingo saluda en login y la pantalla entra en dos tiempos › #167 R6: la burbuja dice el saludo en español
  ● #172 R6: recetas de texto de cuenta › #172 R6: login pinta títulos, etiquetas, cuerpos y CTA con su receta
  ● #172 R6: recetas de texto de cuenta › #172 R6: register pinta títulos, etiquetas, cuerpos y CTA con su receta
  ● #172 R6: recetas de texto de cuenta › #172 R6: forgot pinta títulos, etiquetas, cuerpos y CTA con su receta
  ● #172 R6: recetas de texto de cuenta › #172 R6: reset-password pinta títulos, etiquetas, cuerpos y CTA con su receta
  ● #172 R6: el peso 800 del CTA es Inter ExtraBold › #172 R6: carga Inter ExtraBold y la expone como font-extrabold
  ● #167 R7: Pingo en la cabecera del registro › #172 R6: el título de la cabecera pesa 30/900 al inicio
exit=1
```

#### c14 — jest

```bash
bunx jest --testTimeout=30000 --runTestsByPath src/__tests__/account-screens-polish.test.ts src/theme/__tests__/font-registration.test.ts src/screens/login/index.test.tsx src/screens/register/index.test.tsx src/screens/forgot/index.test.tsx src/screens/reset-password/index.test.tsx src/__tests__/ui-language.test.ts src/__tests__/design-drift.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/legibility-classnames.test.ts
```

```text
Test Suites: 10 passed, 10 total
Tests:       324 passed, 324 total
Time:        11.528 s, estimated 15 s
exit=0
```

#### c14 — router

```bash
test ! -e .expo/types/router.d.ts
```

```text
exit=0
```

#### c14 — typecheck

```bash
bun run typecheck
```

```text
$ tsc --noEmit
exit=0
```

#### c14 — lint

```bash
bunx expo lint --no-cache > /tmp/lint-172.log 2>&1
```

```text
exit=0
vacio=0
```

#### c15 — jest

```bash
bunx jest --testTimeout=30000 --runTestsByPath src/__tests__/account-screens-polish.test.ts src/screens/login/index.test.tsx
```

```text
Test Suites: 2 failed, 2 total
Tests:       4 failed, 26 passed, 30 total
Time:        6.463 s, estimated 8 s
  ● #172 R7: enlaces de cuenta › #172 R7: los enlaces de login y recuperar llevan su receta
  ● #167 R6: Pingo saluda en login y la pantalla entra en dos tiempos › #172 R7: el cuerpo lleva correo, contraseña, olvido, envío y registro
  ● #167 R6: Pingo saluda en login y la pantalla entra en dos tiempos › #172 R7: con error, el error va entre el olvido y el envío
  ● #167 R6: Pingo saluda en login y la pantalla entra en dos tiempos › #172 R7: sin error, el cuerpo no lleva el error
exit=1
```

#### c16 — jest

```bash
bunx jest --testTimeout=30000 --runTestsByPath src/__tests__/account-screens-polish.test.ts src/screens/login/index.test.tsx src/screens/forgot/index.test.tsx src/__tests__/ui-language.test.ts src/__tests__/design-drift.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/legibility-classnames.test.ts
```

```text
Test Suites: 7 passed, 7 total
Tests:       262 passed, 262 total
Time:        9.857 s
exit=0
```

#### c16 — router

```bash
test ! -e .expo/types/router.d.ts
```

```text
exit=0
```

#### c16 — typecheck

```bash
bun run typecheck
```

```text
$ tsc --noEmit
exit=0
```

#### c16 — lint

```bash
bunx expo lint --no-cache > /tmp/lint-172.log 2>&1
```

```text
exit=0
vacio=0
```

#### c17 — jest

```bash
bunx jest --testTimeout=30000 --runTestsByPath src/components/__tests__/form-error.test.tsx src/screens/login/index.test.tsx src/screens/register/index.test.tsx src/screens/forgot/index.test.tsx src/screens/reset-password/index.test.tsx
```

```text
Test Suites: 5 failed, 5 total
Tests:       5 failed, 120 passed, 125 total
Time:        12.873 s
  ● Test suite failed to run
  ● #167 R6: Pingo saluda en login y la pantalla entra en dos tiempos › #172 R9: el error de login va con icono en su fila
  ● #167 R8: el error del registro lleva icono › #167 R8: el error general va en una fila con icono
  ● #167 R8: el error del registro lleva icono › #167 R8: el texto del error pesa como el icono
  ● #172 R9: error de recuperar › #172 R9: el error de recuperar va con icono en su fila
  ● #167 R10: Pingo y tarjeta de estado en nueva contraseña › #172 R9: el error de nueva contraseña va con icono en su fila
exit=1
```

#### c18 — jest

```bash
bunx jest --testTimeout=30000 --runTestsByPath src/components/__tests__/form-error.test.tsx src/screens/login/index.test.tsx src/screens/register/index.test.tsx src/screens/forgot/index.test.tsx src/screens/reset-password/index.test.tsx src/__tests__/ui-language.test.ts src/__tests__/design-drift.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/legibility-classnames.test.ts
```

```text
Test Suites: 9 passed, 9 total
Tests:       322 passed, 322 total
Time:        12.982 s
exit=0
```

#### c18 — router

```bash
test ! -e .expo/types/router.d.ts
```

```text
exit=0
```

#### c18 — typecheck

```bash
bun run typecheck
```

```text
$ tsc --noEmit
exit=0
```

#### c18 — lint

```bash
bunx expo lint --no-cache > /tmp/lint-172.log 2>&1
```

```text
exit=0
vacio=0
```

#### c19 — jest

```bash
bunx jest --testTimeout=30000 --runTestsByPath src/components/__tests__/password-input.test.tsx src/screens/login/index.test.tsx src/screens/register/index.test.tsx src/screens/reset-password/index.test.tsx
```

```text
Test Suites: 4 failed, 4 total
Tests:       5 failed, 86 passed, 91 total
Time:        10.875 s, estimated 11 s
  ● Test suite failed to run
  ● #167 R6: Pingo saluda en login y la pantalla entra en dos tiempos › #172 R8: la contraseña de login lleva su ojo
  ● #167 R10: Pingo y tarjeta de estado en nueva contraseña › #172 R8: reset-password lleva su propio ojo
  ● #167 R10: Pingo y tarjeta de estado en nueva contraseña › #172 R8: reset-password-confirm lleva su propio ojo
  ● #167 R7: Pingo en la cabecera del registro › #172 R8: register-password lleva su propio ojo
  ● #167 R7: Pingo en la cabecera del registro › #172 R8: register-password-confirmation lleva su propio ojo
exit=1
```

#### c20 — jest

```bash
bunx jest --testTimeout=30000 --runTestsByPath src/components/__tests__/password-input.test.tsx src/screens/login/index.test.tsx src/screens/register/index.test.tsx src/screens/reset-password/index.test.tsx src/__tests__/ui-language.test.ts src/__tests__/design-drift.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/legibility-classnames.test.ts
```

```text
Test Suites: 8 passed, 8 total
Tests:       289 passed, 289 total
Time:        12.591 s
exit=0
```

#### c20 — router

```bash
test ! -e .expo/types/router.d.ts
```

```text
exit=0
```

#### c20 — typecheck

```bash
bun run typecheck
```

```text
$ tsc --noEmit
exit=0
```

#### c20 — lint

```bash
bunx expo lint --no-cache > /tmp/lint-172.log 2>&1
```

```text
exit=0
vacio=0
```

#### c21 — jest

```bash
bunx jest --testTimeout=30000 --runTestsByPath src/screens/register/index.test.tsx src/__tests__/account-screens-polish.test.ts
```

```text
Test Suites: 1 failed, 1 passed, 2 total
Tests:       1 failed, 34 passed, 35 total
Time:        9.035 s
  ● #167 R7: Pingo en la cabecera del registro › #172 R10: cada campo con error lleva icono y texto seleccionable
exit=1
```

#### c22 — jest

```bash
bunx jest --testTimeout=30000 --runTestsByPath src/screens/register/index.test.tsx src/__tests__/account-screens-polish.test.ts src/__tests__/ui-language.test.ts src/__tests__/design-drift.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/legibility-classnames.test.ts
```

```text
Test Suites: 6 passed, 6 total
Tests:       229 passed, 229 total
Time:        9.289 s
exit=0
```

#### c22 — router

```bash
test ! -e .expo/types/router.d.ts
```

```text
exit=0
```

#### c22 — typecheck

```bash
bun run typecheck
```

```text
$ tsc --noEmit
exit=0
```

#### c22 — lint

```bash
bunx expo lint --no-cache > /tmp/lint-172.log 2>&1
```

```text
exit=0
vacio=0
```

### Sondas de la reanudación — extractos literales

#### S4a — jest

```bash
bunx jest --testTimeout=30000 --runTestsByPath src/components/__tests__/pingo-float.test.tsx
```

```text
Test Suites: 1 failed, 1 total
Tests:       1 failed, 2 passed, 3 total
Time:        2.177 s
  ● #172 R4: PingoFloat › #172 R4: con reduce motion no se mueve

    expect(received).toBe(expected) // Object.is equality

    Expected: 0
    Received: -5

      48 |     expect(floatTranslateY()).toBe(0);
      49 |     await act(async () => { jest.advanceTimersByTime(750); });
    > 50 |     expect(floatTranslateY()).toBe(0);
         |                               ^
      51 |     await act(async () => { jest.advanceTimersByTime(750); });
      52 |     expect(floatTranslateY()).toBe(0);
      53 |   });

      at Object.toBe (src/components/__tests__/pingo-float.test.tsx:50:31)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
exit=1
```

#### S4a — restore

```bash
git checkout HEAD -- src/components/pingo-float.tsx; git diff --quiet HEAD -- src/components/pingo-float.tsx; echo "exit=$?"
```

```text
exit=0
exit=0
```

#### S4b — jest

```bash
bunx jest --testTimeout=30000 --runTestsByPath src/components/__tests__/pingo-float.test.tsx
```

```text
Test Suites: 1 failed, 1 total
Tests:       1 failed, 2 passed, 3 total
Time:        2.281 s
  ● #172 R4: PingoFloat › #172 R4: flota 10 px arriba en 1,5 s y vuelve en bucle

    expect(received).toBeCloseTo(expected, precision)

    Expected: 0
    Received: -10

    Expected precision:    0
    Expected difference: < 0.5
    Received difference:   10

      37 |     await act(async () => { jest.advanceTimersByTime(1500); });
      38 |     expect(floatTranslateY())
    > 39 |       .toBeCloseTo(0, 0);
         |        ^
      40 |     await act(async () => { jest.advanceTimersByTime(1500); });
      41 |     expect(floatTranslateY())
      42 |       .toBeCloseTo(-10, 0);

      at Object.toBeCloseTo (src/components/__tests__/pingo-float.test.tsx:39:8)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
exit=1
```

#### S4b — restore

```bash
git checkout HEAD -- src/components/pingo-float.tsx; git diff --quiet HEAD -- src/components/pingo-float.tsx; echo "exit=$?"
```

```text
exit=0
exit=0
```

#### S4c — jest

```bash
bunx jest --testTimeout=30000 --runTestsByPath src/components/__tests__/pingo-float.test.tsx
```

```text
Test Suites: 1 failed, 1 total
Tests:       1 failed, 2 passed, 3 total
Time:        1.872 s, estimated 3 s
  ● #172 R4: PingoFloat › #172 R4: flota 10 px arriba en 1,5 s y vuelve en bucle

    expect(received).toBeCloseTo(expected, precision)

    Expected: -5
    Received: 5

    Expected precision:    0
    Expected difference: < 0.5
    Received difference:   10

      31 |     await act(async () => { jest.advanceTimersByTime(750); });
      32 |     expect(floatTranslateY())
    > 33 |       .toBeCloseTo(-5, 0);
         |        ^
      34 |     await act(async () => { jest.advanceTimersByTime(750); });
      35 |     expect(floatTranslateY())
      36 |       .toBeCloseTo(-10, 0);

      at Object.toBeCloseTo (src/components/__tests__/pingo-float.test.tsx:33:8)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
exit=1
```

#### S4c — restore

```bash
git checkout HEAD -- src/components/pingo-float.tsx; git diff --quiet HEAD -- src/components/pingo-float.tsx; echo "exit=$?"
```

```text
exit=0
exit=0
```

#### S4d — jest

```bash
bunx jest --testTimeout=30000 --runTestsByPath src/components/__tests__/pingo-float.test.tsx
```

```text
Test Suites: 1 failed, 1 total
Tests:       1 failed, 2 passed, 3 total
Time:        2.285 s
  ● #172 R4: PingoFloat › #172 R4: flota 10 px arriba en 1,5 s y vuelve en bucle

    expect(received).toBeCloseTo(expected, precision)

    Expected: -5
    Received: -2.772164477554017

    Expected precision:    0
    Expected difference: < 0.5
    Received difference:   2.227835522445983

      31 |     await act(async () => { jest.advanceTimersByTime(750); });
      32 |     expect(floatTranslateY())
    > 33 |       .toBeCloseTo(-5, 0);
         |        ^
      34 |     await act(async () => { jest.advanceTimersByTime(750); });
      35 |     expect(floatTranslateY())
      36 |       .toBeCloseTo(-10, 0);

      at Object.toBeCloseTo (src/components/__tests__/pingo-float.test.tsx:33:8)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
exit=1
```

#### S4d — restore

```bash
git checkout HEAD -- src/components/pingo-float.tsx; git diff --quiet HEAD -- src/components/pingo-float.tsx; echo "exit=$?"
```

```text
exit=0
exit=0
```

#### S4e — jest

```bash
bunx jest --testTimeout=30000 --runTestsByPath src/components/__tests__/pingo-float.test.tsx src/theme/__tests__/motion.test.ts
```

```text
Test Suites: 2 failed, 2 total
Tests:       2 failed, 18 passed, 20 total
Time:        3.016 s
  ● #172 R4: la flotación de Pingo en cuenta vive en motion.ts › #172 R4: declara la flotación de Pingo del canvas: 10 px y medio ciclo de 1500 ms ease-in-out

    expect(received).toBe(expected) // Object.is equality

    Expected: 10
    Received: 4

      100 | describe('#172 R4: la flotación de Pingo en cuenta vive en motion.ts', () => {
      101 |   it('#172 R4: declara la flotación de Pingo del canvas: 10 px y medio ciclo de 1500 ms ease-in-out', () => {
    > 102 |     expect(MOTION_PINGO_FLOAT_OFFSET_Y).toBe(10);
          |                                         ^
      103 |     expect(MOTION_PINGO_FLOAT_TIMING).toEqual({
      104 |       duration: 1500,
      105 |       easing: { bezier: [0.42, 0, 0.58, 1] },

      at Object.toBe (src/theme/__tests__/motion.test.ts:102:41)

FAIL src/components/__tests__/pingo-float.test.tsx
  ● #172 R4: PingoFloat › #172 R4: flota 10 px arriba en 1,5 s y vuelve en bucle

    expect(received).toBeCloseTo(expected, precision)

    Expected: -5
    Received: -2

    Expected precision:    0
    Expected difference: < 0.5
    Received difference:   3

      31 |     await act(async () => { jest.advanceTimersByTime(750); });
      32 |     expect(floatTranslateY())
    > 33 |       .toBeCloseTo(-5, 0);
         |        ^
      34 |     await act(async () => { jest.advanceTimersByTime(750); });
      35 |     expect(floatTranslateY())
      36 |       .toBeCloseTo(-10, 0);

      at Object.toBeCloseTo (src/components/__tests__/pingo-float.test.tsx:33:8)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
exit=1
```

#### S4e — restore

```bash
git checkout HEAD -- src/theme/motion.ts; git diff --quiet HEAD -- src/theme/motion.ts; echo "exit=$?"
```

```text
exit=0
exit=0
```

#### S5 — jest

```bash
bunx jest --testTimeout=30000 --runTestsByPath src/screens/reset-password/index.test.tsx
```

```text
Test Suites: 1 failed, 1 total
Tests:       2 failed, 32 passed, 34 total
Time:        10.359 s, estimated 13 s
  ● #167 R10: Pingo y tarjeta de estado en nueva contraseña › #172 R5: Pingo de nueva contraseña flota en el formulario y en el éxito

    expect(received).toHaveProperty(path, value)

    Expected path: "props.testID"

    Expected value: "reset-pingo-float"
    Received value: "reset-header"

      371 |     await renderRoute('reset-token-172');
      372 |     expect(screen.getByTestId('reset-pingo').parent)
    > 373 |       .toHaveProperty('props.testID', 'reset-pingo-float');
          |        ^
      374 |     await submitReset();
      375 |     expect(await screen.findByTestId('reset-success')).toBeOnTheScreen();
      376 |     expect(screen.getByTestId('reset-pingo').parent)

      at Object.toHaveProperty (src/screens/reset-password/index.test.tsx:373:8)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
  ● #167 R10: Pingo y tarjeta de estado en nueva contraseña › #167 R10: la cabecera lleva a Pingo y después el título

    expect(received).toHaveProperty(path, value)

    Expected path: "props.testID"

    Expected value: "reset-pingo-float"
    Received value: "reset-pingo"

      392 |     const header = screen.getByTestId('reset-header');
      393 |     expect(header.children).toHaveLength(2);
    > 394 |     expect(header.children[0]).toHaveProperty('props.testID', 'reset-pingo-float');
          |                                ^
      395 |     expect(header.children[1]).toBe(within(header).getByText('Restablecer contraseña'));
      396 |   });
      397 |

      at Object.toHaveProperty (src/screens/reset-password/index.test.tsx:394:32)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
exit=1
```

#### S5 — restore

```bash
git checkout HEAD -- src/screens/reset-password/index.tsx; git diff --quiet HEAD -- src/screens/reset-password/index.tsx; echo "exit=$?"
```

```text
exit=0
exit=0
```

#### S3a — jest

```bash
bunx jest --testTimeout=30000 --runTestsByPath src/screens/login/index.test.tsx
```

```text
Test Suites: 1 failed, 1 total
Tests:       2 failed, 23 passed, 25 total
Time:        4.906 s, estimated 10 s
  ● #167 R6: Pingo saluda en login y la pantalla entra en dos tiempos › #172 R3: la cabecera lleva Volver, el saludo y el título

    expect(received).toHaveLength(expected)

    Expected length: 3
    Received length: 2
    Received array:  [<View className="flex-row items-center gap-3" testID="login-greeting"><ViewManagerAdapter_ExpoImage containerViewRef={"[React.ref]"} contentFit="cover" contentPosition={{"left": "50%", "top": "50%"}} height={88} nativeViewRef={"[React.ref]"} onError={[Function anonymous]} onLoad={[Function anonymous]} onLoadStart={[Function anonymous]} onProgress={[Function anonymous]} placeholder={[]} sfEffect={null} source={[{"testUri": "../../../assets/images/pingo-wave.webp"}]} style={{"height": 88, "transform": [{"rotate": "-8deg"}], "width": 88}} symbolSize={null} symbolWeight={null} testID="login-pingo" transform={[{"rotate": "-8deg"}]} transition={null} width={88} /><View className="rounded-card border border-border bg-surface-secondary p-4 flex-1 px-4 py-3" style={{"borderCurve": "continuous"}} testID="login-bubble"><Text className="text-sm font-semibold text-foreground" testID="login-bubble-text">Qué bueno verte de nuevo.</Text></View></View>, <Text className="text-center text-2xl font-black text-foreground">Iniciar sesión</Text>]

      240 |     await renderLogin();
      241 |     const header = screen.getByTestId('login-header');
    > 242 |     expect(header.children).toHaveLength(3);
          |                             ^
      243 |     expect(header.children[0]).toHaveProperty('props.testID', 'login-back');
      244 |     expect(header.children[1]).toHaveProperty('props.testID', 'login-greeting');
      245 |     expect(header.children[2]).toBe(within(header).getByText('Iniciar sesión'));

      at Object.toHaveLength (src/screens/login/index.test.tsx:242:29)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
  ● #167 R6: Pingo saluda en login y la pantalla entra en dos tiempos › #172 R3: Volver de login vuelve a la bienvenida sin historial

    Unable to find an element with testID: login-back

    <RNCSafeAreaProvider>
      <View
        testID="screen-login"
      >
        <RCTScrollView
          testID="login-form"
        >
          <View>
            <View
              testID="login-header"
            >
              <View
                testID="login-greeting"
              >
                <ViewManagerAdapter_ExpoImage
                  placeholder={[]}
                  testID="login-pingo"
                />
                <View
                  testID="login-bubble"
                >
                  <Text
                    testID="login-bubble-text"
                  >
                    Qué bueno verte de nuevo.
                  </Text>
                </View>
              </View>
              <Text>
                Iniciar sesión
              </Text>
            </View>
            <View
              testID="login-body"
            >
              <View>
                <View
                  accessible={true}
                >
                  <Text>
                    Correo electrónico
                  </Text>
                </View>
                <TextInput
                  editable={true}
                  testID="login-email"
                  value=""
                />
              </View>
              <View>
                <View
                  accessible={true}
                >
                  <Text>
                    Contraseña
                  </Text>
                </View>
                <TextInput
                  editable={true}
                  testID="login-password"
                  value=""
                />
              </View>
              <View
                accessibilityRole="button"
                accessibilityState={
                  {
                    "disabled": false,
                  }
                }
                accessible={true}
                testID="login-submit"
              >
                <View
                  pointerEvents="none"
                  style={
                    {
                      "opacity": 0,
                    }
                  }
                />
                <Text>
                  Iniciar sesión
                </Text>
              </View>
              <View
                accessibilityRole="button"
                accessibilityState={
                  {
                    "disabled": false,
                  }
                }
                accessible={true}
                testID="link-register"
              >
                <Text>
                  Crear cuenta
                </Text>
              </View>
              <View
                accessibilityRole="button"
                accessibilityState={
                  {
                    "disabled": false,
                  }
                }
                accessible={true}
                testID="link-forgot"
              >
                <Text>
                  ¿Olvidaste tu contraseña?
                </Text>
              </View>
            </View>
          </View>
        </RCTScrollView>
      </View>
    </RNCSafeAreaProvider>

      249 |     mockRouter.canGoBack.mockReturnValue(false);
      250 |     await renderLogin();
    > 251 |     await fireEvent.press(screen.getByTestId('login-back'));
          |                                  ^
      252 |     expect(mockRouter.replace).toHaveBeenCalledWith('/welcome');
      253 |   });
      254 |

      at Object.getByTestId (src/screens/login/index.test.tsx:251:34)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
exit=1
```

#### S3a — restore

```bash
git checkout HEAD -- src/screens/login/index.tsx; git diff --quiet HEAD -- src/screens/login/index.tsx; echo "exit=$?"
```

```text
exit=0
exit=0
```

#### S3b — jest

```bash
bunx jest --testTimeout=30000 --runTestsByPath src/screens/forgot/index.test.tsx
```

```text
Test Suites: 1 failed, 1 total
Tests:       1 failed, 37 passed, 38 total
Time:        7.569 s, estimated 11 s
  ● #172 R3: Volver en recuperar › #172 R3: Volver de recuperar va al login sin historial

    expect(jest.fn()).toHaveBeenCalledWith(...expected)

    Expected: "/login"
    Received: "/welcome"

    Number of calls: 1

      617 |     await renderRoute();
      618 |     await fireEvent.press(screen.getByTestId('forgot-back'));
    > 619 |     expect(mockRouter.replace).toHaveBeenCalledWith('/login');
          |                                ^
      620 |   });
      621 | });
      622 |

      at Object.toHaveBeenCalledWith (src/screens/forgot/index.test.tsx:619:32)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
exit=1
```

#### S3b — restore

```bash
git checkout HEAD -- src/screens/forgot/index.tsx; git diff --quiet HEAD -- src/screens/forgot/index.tsx; echo "exit=$?"
```

```text
exit=0
exit=0
```

#### S3c — jest

```bash
bunx jest --testTimeout=30000 --runTestsByPath src/screens/register/index.test.tsx
```

```text
Test Suites: 1 failed, 1 total
Tests:       2 failed, 23 passed, 25 total
Time:        10.972 s, estimated 12 s
  ● #167 R7: Pingo en la cabecera del registro › #172 R3: la cabecera lleva la fila Volver-Pingo y después el título

    expect(received).toEqual(expected) // deep equality

    - Expected  - 116
    + Received  +   0

    @@ -1,123 +1,7 @@
      Array [
        <View
    -     accessibilityLabel="Volver"
    -     accessibilityRole="button"
    -     accessibilityState={
    -       Object {
    -         "busy": undefined,
    -         "checked": undefined,
    -         "disabled": undefined,
    -         "expanded": undefined,
    -         "selected": undefined,
    -       }
    -     }
    -     accessibilityValue={
    -       Object {
    -         "max": undefined,
    -         "min": undefined,
    -         "now": undefined,
    -         "text": undefined,
    -       }
    -     }
    -     accessible={true}
    -     className="size-11 items-center justify-center rounded-full"
    -     collapsable={false}
    -     focusable={true}
    -     onBlur={[Function onBlur]}
    -     onClick={[Function onClick]}
    -     onFocus={[Function onFocus]}
    -     onResponderGrant={[Function onResponderGrant]}
    -     onResponderMove={[Function onResponderMove]}
    -     onResponderRelease={[Function onResponderRelease]}
    -     onResponderTerminate={[Function onResponderTerminate]}
    -     onResponderTerminationRequest={[Function onResponderTerminationRequest]}
    -     onStartShouldSetResponder={[Function onStartShouldSetResponder]}
    -     style={
    -       Object {
    -         "opacity": 1,
    -       }
    -     }
    -     testID="register-back"
    -   >
    -     <RNSVGSvgView
    -       align="xMidYMid"
    -       bbHeight={24}
    -       bbWidth={24}
    -       fill="none"
    -       focusable={false}
    -       height={24}
    -       meetOrSlice={0}
    -       minX={0}
    -       minY={0}
    -       style={
    -         Array [
    -           Object {
    -             "backgroundColor": "transparent",
    -             "borderWidth": 0,
    -           },
    -           Object {
    -             "flex": 0,
    -             "height": 24,
    -             "width": 24,
    -           },
    -         ]
    -       }
    -       vbHeight={24}
    -       vbWidth={24}
    -       width={24}
    -       xml="<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\"><g transform=\"scale(1.33333)\"><polyline points=\"11.5 15.25 5.25 9 11.5 2.75\" fill=\"none\" stroke=\"color:foreground\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"1.5\"></polyline></g></svg>"
    -       xmlns="http://www.w3.org/2000/svg"
    -     >
    -       <RNSVGGroup
    -         fill={null}
    -         propList={
    -           Array [
    -             "fill",
    -           ]
    -         }
    -       >
    -         <RNSVGGroup
    -           fill={
    -             Object {
    -               "payload": 4278190080,
    -               "type": 0,
    -             }
    -           }
    -           matrix={
    -             Array [
    -               1.33333,
    -               0,
    -               0,
    -               1.33333,
    -               0,
    -               0,
    -             ]
    -           }
    -         >
    -           <RNSVGPath
    -             d="M11.5 15.25 5.25 9 11.5 2.75"
    -             fill={null}
    -             propList={
    -               Array [
    -                 "fill",
    -                 "stroke",
    -                 "strokeWidth",
    -                 "strokeLinecap",
    -                 "strokeLinejoin",
    -               ]
    -             }
    -             stroke={null}
    -             strokeLinecap={1}
    -             strokeLinejoin={1}
    -             strokeWidth={1.5}
    -           />
    -         </RNSVGGroup>
    -       </RNSVGGroup>
    -     </RNSVGSvgView>
    -   </View>,
    -   <View
          testID="register-pingo-float"
        >
          <ViewManagerAdapter_ExpoImage
            containerViewRef={"[React.ref]"}
            contentFit="cover"

      352 |     expect(header.children[1]).toBe(within(header).getByText('Crear cuenta'));
      353 |     const top = screen.getByTestId('register-top');
    > 354 |     expect(top.children).toEqual([
          |                          ^
      355 |       screen.getByTestId('register-back'), screen.getByTestId('register-pingo-float'),
      356 |     ]);
      357 |     expect(top.props.className).toBe('flex-row items-center justify-between');

      at Object.toEqual (src/screens/register/index.test.tsx:354:26)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
  ● #167 R7: Pingo en la cabecera del registro › #167 R7: campos, errores, términos y envío cuelgan del scroll

    expect(received).toBe(expected) // Object.is equality

    - Expected  -  42
    + Received  + 102

      <View
    -   className="gap-2"
    -   index={0}
    -   testID="register-header"
    - >
    -   <View
    -     className="flex-row items-center justify-between"
    -     testID="register-top"
    -   >
    -     <View
    -       testID="register-pingo-float"
    -     >
    -       <ViewManagerAdapter_ExpoImage
    -         containerViewRef={"[React.ref]"}
    -         contentFit="cover"
    -         contentPosition={
    +   accessibilityLabel="Volver"
    +   accessibilityRole="button"
    +   accessibilityState={
          Object {
    -             "left": "50%",
    -             "top": "50%",
    +       "busy": undefined,
    +       "checked": undefined,
    +       "disabled": undefined,
    +       "expanded": undefined,
    +       "selected": undefined,
          }
        }
    -         height={56}
    -         nativeViewRef={"[React.ref]"}
    -         onError={[Function anonymous]}
    -         onLoad={[Function anonymous]}
    -         onLoadStart={[Function anonymous]}
    -         onProgress={[Function anonymous]}
    -         placeholder={Array []}
    -         sfEffect={null}
    -         source={
    +   accessibilityValue={
    +     Object {
    +       "max": undefined,
    +       "min": undefined,
    +       "now": undefined,
    +       "text": undefined,
    +     }
    +   }
    +   accessible={true}
    +   className="size-11 items-center justify-center rounded-full"
    +   collapsable={false}
    +   focusable={true}
    +   onBlur={[Function onBlur]}
    +   onClick={[Function onClick]}
    +   onFocus={[Function onFocus]}
    +   onResponderGrant={[Function onResponderGrant]}
    +   onResponderMove={[Function onResponderMove]}
    +   onResponderRelease={[Function onResponderRelease]}
    +   onResponderTerminate={[Function onResponderTerminate]}
    +   onResponderTerminationRequest={[Function onResponderTerminationRequest]}
    +   onStartShouldSetResponder={[Function onStartShouldSetResponder]}
    +   style={
    +     Object {
    +       "opacity": 1,
    +     }
    +   }
    +   testID="register-back"
    + >
    +   <RNSVGSvgView
    +     align="xMidYMid"
    +     bbHeight={24}
    +     bbWidth={24}
    +     fill="none"
    +     focusable={false}
    +     height={24}
    +     meetOrSlice={0}
    +     minX={0}
    +     minY={0}
    +     style={
            Array [
              Object {
    -               "testUri": "../../../assets/images/pingo-clipboard.webp",
    +           "backgroundColor": "transparent",
    +           "borderWidth": 0,
    +         },
    +         Object {
    +           "flex": 0,
    +           "height": 24,
    +           "width": 24,
              },
            ]
          }
    -         style={
    +     vbHeight={24}
    +     vbWidth={24}
    +     width={24}
    +     xml="<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\"><g transform=\"scale(1.33333)\"><polyline points=\"11.5 15.25 5.25 9 11.5 2.75\" fill=\"none\" stroke=\"color:foreground\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"1.5\"></polyline></g></svg>"
    +     xmlns="http://www.w3.org/2000/svg"
    +   >
    +     <RNSVGGroup
    +       fill={null}
    +       propList={
    +         Array [
    +           "fill",
    +         ]
    +       }
    +     >
    +       <RNSVGGroup
    +         fill={
                Object {
    -             "height": 56,
    -             "width": 56,
    +             "payload": 4278190080,
    +             "type": 0,
    +           }
    +         }
    +         matrix={
    +           Array [
    +             1.33333,
    +             0,
    +             0,
    +             1.33333,
    +             0,
    +             0,
    +           ]
              }
    +       >
    +         <RNSVGPath
    +           d="M11.5 15.25 5.25 9 11.5 2.75"
    +           fill={null}
    +           propList={
    +             Array [
    +               "fill",
    +               "stroke",
    +               "strokeWidth",
    +               "strokeLinecap",
    +               "strokeLinejoin",
    +             ]
                }
    -         symbolSize={null}
    -         symbolWeight={null}
    -         testID="register-pingo"
    -         transition={null}
    -         width={56}
    +           stroke={null}
    +           strokeLinecap={1}
    +           strokeLinejoin={1}
    +           strokeWidth={1.5}
              />
    -     </View>
    -   </View>
    -   <Text
    -     className="text-center text-2xl font-black text-foreground"
    -   >
    -     Crear cuenta
    -   </Text>
    +       </RNSVGGroup>
    +     </RNSVGGroup>
    +   </RNSVGSvgView>
      </View>

      412 |     expect(screen.getByTestId('register-error-row').parent).toBe(content);
      413 |     expect(screen.getByTestId('register-submit').parent).toBe(content);
    > 414 |     expect(content?.children[0]).toBe(screen.getByTestId('register-header'));
          |                                  ^
      415 |   });
      416 |
      417 |   it('#167 R7: ningún campo ni el envío quedan dentro de la cabecera', async () => {

      at Object.toBe (src/screens/register/index.test.tsx:414:34)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
exit=1
```

#### S3c — restore

```bash
git checkout HEAD -- src/screens/register/index.tsx; git diff --quiet HEAD -- src/screens/register/index.tsx; echo "exit=$?"
```

```text
exit=0
exit=0
```

#### S6a — jest

```bash
bunx jest --testTimeout=30000 --runTestsByPath src/__tests__/account-screens-polish.test.ts
```

```text
Test Suites: 1 failed, 1 total
Tests:       1 failed, 3 passed, 4 total
Time:        1.21 s
  ● #172 R6: recetas de texto de cuenta › #172 R6: register pinta títulos, etiquetas, cuerpos y CTA con su receta

    expect(received).toBe(expected) // Object.is equality

    Expected: 7
    Received: 6

      37 |     const source = readFileSync(join(sourceRoot, 'screens', screen, 'index.tsx'), 'utf8');
      38 |     textRecipes.forEach((literal, index) => {
    > 39 |       expect(source.split(literal).length - 1).toBe(counts[index]);
         |                                                ^
      40 |     });
      41 |   });
      42 | });

      at toBe (src/__tests__/account-screens-polish.test.ts:39:48)
          at Array.forEach (<anonymous>)
      at forEach (src/__tests__/account-screens-polish.test.ts:38:17)
exit=1
```

#### S6a — restore

```bash
git checkout HEAD -- src/screens/register/index.tsx; git diff --quiet HEAD -- src/screens/register/index.tsx; echo "exit=$?"
```

```text
exit=0
exit=0
```

#### S6b — jest

```bash
bunx jest --testTimeout=30000 --runTestsByPath src/__tests__/account-screens-polish.test.ts
```

```text
Test Suites: 1 failed, 1 total
Tests:       1 failed, 3 passed, 4 total
Time:        1.287 s, estimated 2 s
  ● #172 R6: recetas de texto de cuenta › #172 R6: reset-password pinta títulos, etiquetas, cuerpos y CTA con su receta

    expect(received).toBe(expected) // Object.is equality

    Expected: 1
    Received: 0

      37 |     const source = readFileSync(join(sourceRoot, 'screens', screen, 'index.tsx'), 'utf8');
      38 |     textRecipes.forEach((literal, index) => {
    > 39 |       expect(source.split(literal).length - 1).toBe(counts[index]);
         |                                                ^
      40 |     });
      41 |   });
      42 | });

      at toBe (src/__tests__/account-screens-polish.test.ts:39:48)
          at Array.forEach (<anonymous>)
      at forEach (src/__tests__/account-screens-polish.test.ts:38:17)
exit=1
```

#### S6b — restore

```bash
git checkout HEAD -- src/screens/reset-password/index.tsx; git diff --quiet HEAD -- src/screens/reset-password/index.tsx; echo "exit=$?"
```

```text
exit=0
exit=0
```

#### S6c — jest

```bash
bunx jest --testTimeout=30000 --runTestsByPath src/theme/__tests__/font-registration.test.ts
```

```text
Test Suites: 1 failed, 1 total
Tests:       1 failed, 3 passed, 4 total
Time:        1.296 s
  ● #172 R6: el peso 800 del CTA es Inter ExtraBold › #172 R6: carga Inter ExtraBold y la expone como font-extrabold

    expect(received).toContain(expected) // indexOf

    Expected substring: "--font-extrabold: 'Inter-ExtraBold';"
    Received string:    "@import 'tailwindcss';
    @import 'uniwind';
    @import 'heroui-native/styles';·
    @source '../../node_modules/heroui-native/lib';
    @source '../';·
    @theme {
      --font-normal: 'Inter-Regular';
      --font-medium: 'Inter-Medium';
      --font-semibold: 'Inter-SemiBold';
      --font-bold: 'Inter-Bold';
      --font-black: 'Inter-Black';
      --radius-card: 20px;
      --text-2xs: 10px;
      --text-13: 13px;
      --text-15: 15px;
      --text-17: 17px;
    }·
    @theme inline {
      --color-accent-strong: var(--accent-strong);
      --color-warning-strong: var(--warning-strong);
    }·
    @layer theme {
      :root {
        @variant light {
          --background: #FFFFFF;
          --foreground: #0D1117;
          --surface: #FFFFFF;
          --surface-foreground: #0D1117;
          --glass-surface: rgba(255,255,255,0.60);
          --tab-pill: rgba(23,130,85,0.14);
          --surface-secondary: #F0FBF6;
          --surface-secondary-foreground: #0D1117;
          --default: #F5F6F8;
          --default-foreground: #0D1117;
          --muted: #667085;
          --border: rgba(13,17,23,0.07);
          --separator: rgba(13,17,23,0.07);
          --accent: #178255;
          --accent-strong: #107148;
          --accent-foreground: #FFFFFF;
          --danger: #EF4444;
          --warning: #F59E0B;
          --warning-strong: #92610A;
          --success: #0F9B5A;
          --color-accent: #178255;
          --color-accent-strong: #107148;
          --color-accent-foreground: #FFFFFF;
          --color-muted: #667085;
          --color-glass-surface: rgba(255,255,255,0.60);
          --color-tab-pill: rgba(23,130,85,0.14);
          --color-lip-gray: #E4E7EC;
          --color-danger: #EF4444;
          --color-warning: #F59E0B;
          --color-success: #0F9B5A;
          --color-category-blue: #EFF6FF;
          --color-category-blue-strong: #0768E0;
          --color-category-amber: #FFF7ED;
          --color-category-amber-strong: #A55E07;
          --color-category-green: #F0FBF6;
          --color-category-green-strong: #107148;
          --color-category-violet: #F5F3FF;
          --color-category-violet-strong: #7549F7;
          --color-category-rose: #FFF0F3;
          --color-category-rose-strong: #D80B34;
          --focus: #178255;
          --field-background: var(--default);
          --field-foreground: var(--foreground);
          --field-placeholder: var(--muted);
          --field-border: transparent;
          --field-radius: 0.75rem;
        }·
        @variant dark {
          --background: #0D1117;
          --foreground: #F7F8FA;
          --surface: #161B22;
          --surface-foreground: #F7F8FA;
          --glass-surface: rgba(22,27,34,0.60);
          --tab-pill: rgba(23,130,85,0.22);
          --surface-secondary: #12231B;
          --surface-secondary-foreground: #F7F8FA;
          --default: #1F242B;
          --default-foreground: #F7F8FA;
          --muted: #9CA3AF;
          --border: rgba(255,255,255,0.08);
          --separator: rgba(255,255,255,0.08);
          --accent: #178255;
          --accent-strong: #2AB87C;
          --accent-foreground: #FFFFFF;
          --danger: #F87171;
          --warning: #FBBF24;
          --warning-strong: #FBBF24;
          --success: #34D399;
          --color-accent: #178255;
          --color-accent-strong: #2AB87C;
          --color-accent-foreground: #FFFFFF;
          --color-muted: #9CA3AF;
          --color-glass-surface: rgba(22,27,34,0.60);
          --color-tab-pill: rgba(23,130,85,0.22);
          --color-lip-gray: #0A0D12;
          --color-danger: #F87171;
          --color-warning: #FBBF24;
          --color-success: #34D399;
          --color-category-blue: #0B203A;
          --color-category-blue-strong: #4A8DDF;
          --color-category-amber: #271E14;
          --color-category-amber-strong: #C17B22;
          --color-category-green: #12231B;
          --color-category-green-strong: #2AB87C;
          --color-category-violet: #221C33;
          --color-category-violet-strong: #9579E7;
          --color-category-rose: #39131A;
          --color-category-rose-strong: #E35E78;
          --focus: #178255;
          --field-background: var(--default);
          --field-foreground: var(--foreground);
          --field-placeholder: var(--muted);
          --field-border: transparent;
          --field-radius: 0.75rem;
        }
      }
    }
    "

      51 |     expect(existsSync(`${projectRoot}/assets/fonts/Inter-ExtraBold.ttf`)).toBe(true);
      52 |     expect(rootLayout).toContain("'Inter-ExtraBold': require('../../assets/fonts/Inter-ExtraBold.ttf')");
    > 53 |     expect(globalCss).toContain("--font-extrabold: 'Inter-ExtraBold';");
         |                       ^
      54 |   });
      55 | });
      56 |

      at Object.toContain (src/theme/__tests__/font-registration.test.ts:53:23)
exit=1
```

#### S6c — restore

```bash
git checkout HEAD -- src/theme/global.css; git diff --quiet HEAD -- src/theme/global.css; echo "exit=$?"
```

```text
exit=0
exit=0
```

#### S7 — jest

```bash
bunx jest --testTimeout=30000 --runTestsByPath src/screens/login/index.test.tsx
```

```text
Test Suites: 1 failed, 1 total
Tests:       3 failed, 22 passed, 25 total
Time:        6.51 s, estimated 9 s
  ● #167 R6: Pingo saluda en login y la pantalla entra en dos tiempos › #172 R7: el cuerpo lleva correo, contraseña, olvido, envío y registro

    expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 1

      Array [
        "login-email",
        "login-password",
    -   "link-forgot",
        "login-submit",
        "link-register",
    +   "link-forgot",
      ]

      258 |     const body = screen.getByTestId('login-body');
      259 |     expect(within(body).getAllByTestId(/^(login-email|login-password|login-submit|link-register|link-forgot)$/)
    > 260 |       .map((node) => node.props.testID)).toEqual([
          |                                          ^
      261 |       'login-email', 'login-password', 'link-forgot', 'login-submit', 'link-register',
      262 |     ]);
      263 |     await submit();

      at Object.toEqual (src/screens/login/index.test.tsx:260:42)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
  ● #167 R6: Pingo saluda en login y la pantalla entra en dos tiempos › #172 R7: con error, el error va entre el olvido y el envío

    expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 1

      Array [
        "login-email",
        "login-password",
    -   "link-forgot",
        "login-error",
        "login-submit",
        "link-register",
    +   "link-forgot",
      ]

      271 |     const body = screen.getByTestId('login-body');
      272 |     expect(within(body).getAllByTestId(/^(login-email|login-password|login-error|login-submit|link-register|link-forgot)$/)
    > 273 |       .map((node) => node.props.testID)).toEqual([
          |                                          ^
      274 |       'login-email', 'login-password', 'link-forgot', 'login-error', 'login-submit', 'link-register',
      275 |     ]);
      276 |   });

      at Object.toEqual (src/screens/login/index.test.tsx:273:42)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
  ● #167 R6: Pingo saluda en login y la pantalla entra en dos tiempos › #172 R7: sin error, el cuerpo no lleva el error

    expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 1

      Array [
        "login-email",
        "login-password",
    -   "link-forgot",
        "login-submit",
        "link-register",
    +   "link-forgot",
      ]

      280 |     const body = screen.getByTestId('login-body');
      281 |     expect(within(body).getAllByTestId(/^(login-email|login-password|login-error|login-submit|link-register|link-forgot)$/)
    > 282 |       .map((node) => node.props.testID)).toEqual([
          |                                          ^
      283 |       'login-email', 'login-password', 'link-forgot', 'login-submit', 'link-register',
      284 |     ]);
      285 |   });

      at Object.toEqual (src/screens/login/index.test.tsx:282:42)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
exit=1
```

#### S7 — restore

```bash
git checkout HEAD -- src/screens/login/index.tsx; git diff --quiet HEAD -- src/screens/login/index.tsx; echo "exit=$?"
```

```text
exit=0
exit=0
```

#### S9a — jest

```bash
bunx jest --testTimeout=30000 --runTestsByPath src/components/__tests__/form-error.test.tsx src/screens/login/index.test.tsx
```

```text
Test Suites: 2 failed, 2 total
Tests:       2 failed, 27 passed, 29 total
Time:        8.254 s, estimated 9 s
  ● #172 R9: FormError › #172 R9: el texto pesa 13/600 en danger, es seleccionable y dice el mensaje

    expect(received).toBe(expected) // Object.is equality

    Expected: true
    Received: undefined

      39 |     const text = screen.getByTestId('err');
      40 |     expect(text.props.className).toBe('flex-1 text-13 font-semibold text-danger');
    > 41 |     expect(text.props.selectable).toBe(true);
         |                                   ^
      42 |     expect(text).toHaveTextContent('Algo falló');
      43 |   });
      44 | });

      at Object.toBe (src/components/__tests__/form-error.test.tsx:41:35)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

FAIL src/screens/login/index.test.tsx (7.35 s)
  ● #167 R6: Pingo saluda en login y la pantalla entra en dos tiempos › #172 R9: el error de login va con icono en su fila

    expect(received).toBe(expected) // Object.is equality

    Expected: true
    Received: undefined

      299 |       screen.getByTestId('icon-alert-circle'), screen.getByTestId('login-error'),
      300 |     ]);
    > 301 |     expect(screen.getByTestId('login-error').props.selectable).toBe(true);
          |                                                                ^
      302 |   });
      303 |
      304 |   it('#172 R7: sin error, el cuerpo no lleva el error', async () => {

      at Object.toBe (src/screens/login/index.test.tsx:301:64)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
exit=1
```

#### S9a — restore

```bash
git checkout HEAD -- src/components/form-error.tsx; git diff --quiet HEAD -- src/components/form-error.tsx; echo "exit=$?"
```

```text
exit=0
exit=0
```

#### S9b — jest

```bash
bunx jest --testTimeout=30000 --runTestsByPath src/screens/login/index.test.tsx
```

```text
Test Suites: 1 failed, 1 total
Tests:       1 failed, 25 passed, 26 total
Time:        8.021 s
  ● #167 R6: Pingo saluda en login y la pantalla entra en dos tiempos › #172 R9: el error de login va con icono en su fila

    Unable to find an element with testID: login-error-row

    <RNCSafeAreaProvider>
      <View
        testID="screen-login"
      >
        <RCTScrollView
          testID="login-form"
        >
          <View>
            <View
              testID="login-header"
            >
              <View
                accessibilityLabel="Volver"
                accessibilityRole="button"
                accessible={true}
                testID="login-back"
              >
                <RNSVGSvgView>
                  <RNSVGGroup>
                    <RNSVGGroup>
                      <RNSVGPath />
                    </RNSVGGroup>
                  </RNSVGGroup>
                </RNSVGSvgView>
              </View>
              <View
                testID="login-greeting"
              >
                <ViewManagerAdapter_ExpoImage
                  placeholder={[]}
                  testID="login-pingo"
                />
                <View
                  testID="login-bubble"
                >
                  <Text
                    testID="login-bubble-text"
                  >
                    Qué bueno verte de nuevo.
                  </Text>
                </View>
              </View>
              <Text>
                Iniciar sesión
              </Text>
            </View>
            <View
              testID="login-body"
            >
              <View>
                <View
                  accessible={true}
                >
                  <Text>
                    Correo electrónico
                  </Text>
                </View>
                <TextInput
                  editable={true}
                  testID="login-email"
                  value="alex@example.com"
                />
              </View>
              <View>
                <View
                  accessible={true}
                >
                  <Text>
                    Contraseña
                  </Text>
                </View>
                <TextInput
                  editable={true}
                  testID="login-password"
                  value="correct horse"
                />
              </View>
              <View
                accessibilityRole="button"
                accessibilityState={
                  {
                    "disabled": false,
                  }
                }
                accessible={true}
                testID="link-forgot"
              >
                <Text>
                  ¿Olvidaste tu contraseña?
                </Text>
              </View>
              <Text
                testID="login-error"
              >
                Credenciales inválidas
              </Text>
              <View
                accessibilityRole="button"
                accessibilityState={
                  {
                    "disabled": false,
                  }
                }
                accessible={true}
                testID="login-submit"
              >
                <View
                  pointerEvents="none"
                  style={
                    {
                      "opacity": 0,
                    }
                  }
                />
                <Text>
                  Iniciar sesión
                </Text>
              </View>
              <View
                accessibilityRole="button"
                accessibilityState={
                  {
                    "disabled": false,
                  }
                }
                accessible={true}
                testID="link-register"
              >
                <Text>
                  Crear cuenta
                </Text>
              </View>
            </View>
          </View>
        </RCTScrollView>
      </View>
    </RNCSafeAreaProvider>

      295 |     await renderLogin();
      296 |     await submit();
    > 297 |     const row = await screen.findByTestId('login-error-row');
          |                              ^
      298 |     expect(row.children).toEqual([
      299 |       screen.getByTestId('icon-alert-circle'), screen.getByTestId('login-error'),
      300 |     ]);

      at Object.findByTestId (src/screens/login/index.test.tsx:297:30)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
exit=1
```

#### S9b — restore

```bash
git checkout HEAD -- src/screens/login/index.tsx; git diff --quiet HEAD -- src/screens/login/index.tsx; echo "exit=$?"
```

```text
exit=0
exit=0
```

#### S9c — jest

```bash
bunx jest --testTimeout=30000 --runTestsByPath src/screens/reset-password/index.test.tsx
```

```text
Test Suites: 1 failed, 1 total
Tests:       1 failed, 34 passed, 35 total
Time:        7.209 s
  ● #167 R10: Pingo y tarjeta de estado en nueva contraseña › #172 R9: el error de nueva contraseña va con icono en su fila

    Unable to find an element with testID: reset-error-row

    <RNCSafeAreaProvider>
      <View
        testID="screen-reset-password"
      >
        <RCTScrollView
          testID="reset-password-form"
        >
          <View>
            <View
              testID="reset-header"
            >
              <View
                testID="reset-pingo-float"
              >
                <ViewManagerAdapter_ExpoImage
                  placeholder={[]}
                  testID="reset-pingo"
                />
              </View>
              <Text>
                Restablecer contraseña
              </Text>
            </View>
            <View
              testID="reset-body"
            >
              <View>
                <View
                  accessible={true}
                >
                  <Text>
                    Nueva contraseña
                  </Text>
                </View>
                <TextInput
                  editable={true}
                  testID="reset-password"
                  value="new-password-123"
                />
              </View>
              <View>
                <View
                  accessible={true}
                >
                  <Text>
                    Confirmar nueva contraseña
                  </Text>
                </View>
                <TextInput
                  editable={true}
                  testID="reset-password-confirm"
                  value="new-password-123"
                />
              </View>
              <Text
                testID="reset-error"
              >
                El enlace no es válido o ya se usó. Solicita uno nuevo.
              </Text>
              <View
                accessibilityRole="button"
                accessibilityState={
                  {
                    "disabled": false,
                  }
                }
                accessible={true}
                testID="reset-submit"
              >
                <View
                  pointerEvents="none"
                  style={
                    {
                      "opacity": 0,
                    }
                  }
                />
                <Text>
                  Actualizar contraseña
                </Text>
              </View>
            </View>
          </View>
        </RCTScrollView>
      </View>
    </RNCSafeAreaProvider>

      470 |     await renderRoute('reset-token-167');
      471 |     await submitReset();
    > 472 |     const row = await screen.findByTestId('reset-error-row');
          |                              ^
      473 |     expect(row.children).toEqual([
      474 |       screen.getByTestId('icon-alert-circle'), screen.getByTestId('reset-error'),
      475 |     ]);

      at Object.findByTestId (src/screens/reset-password/index.test.tsx:472:30)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
exit=1
```

#### S9c — restore

```bash
git checkout HEAD -- src/screens/reset-password/index.tsx; git diff --quiet HEAD -- src/screens/reset-password/index.tsx; echo "exit=$?"
```

```text
exit=0
exit=0
```

#### S8a — jest

```bash
bunx jest --testTimeout=30000 --runTestsByPath src/components/__tests__/password-input.test.tsx src/screens/login/index.test.tsx src/screens/register/index.test.tsx src/screens/reset-password/index.test.tsx
```

```text
Test Suites: 4 failed, 4 total
Tests:       8 failed, 87 passed, 95 total
Time:        9.932 s, estimated 12 s
  ● #167 R6: Pingo saluda en login y la pantalla entra en dos tiempos › #172 R8: la contraseña de login lleva su ojo

    expect(received).toBe(expected) // Object.is equality

    Expected: true
    Received: false

      294 |     await renderLogin();
      295 |     const input = screen.getByTestId('login-password');
    > 296 |     expect(input.props.secureTextEntry).toBe(true);
          |                                         ^
      297 |     const toggle = screen.getByTestId('login-password-toggle');
      298 |     expect(toggle.props.accessibilityLabel).toBe('Mostrar contraseña');
      299 |     const group = screen.getByTestId('login-password-group');

      at Object.toBe (src/screens/login/index.test.tsx:296:41)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

FAIL src/screens/reset-password/index.test.tsx (7.884 s)
  ● #167 R10: Pingo y tarjeta de estado en nueva contraseña › #172 R8: reset-password lleva su propio ojo

    expect(received).toBe(expected) // Object.is equality

    Expected: true
    Received: false

      371 |     await renderRoute('reset-token-172');
      372 |     const input = screen.getByTestId(field);
    > 373 |     expect(input.props.secureTextEntry).toBe(true);
          |                                         ^
      374 |     const toggle = screen.getByTestId(`${field}-toggle`);
      375 |     expect(toggle.props.accessibilityLabel).toBe('Mostrar contraseña');
      376 |     const group = screen.getByTestId(`${field}-group`);

      at toBe (src/screens/reset-password/index.test.tsx:373:41)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
  ● #167 R10: Pingo y tarjeta de estado en nueva contraseña › #172 R8: reset-password-confirm lleva su propio ojo

    expect(received).toBe(expected) // Object.is equality

    Expected: true
    Received: false

      371 |     await renderRoute('reset-token-172');
      372 |     const input = screen.getByTestId(field);
    > 373 |     expect(input.props.secureTextEntry).toBe(true);
          |                                         ^
      374 |     const toggle = screen.getByTestId(`${field}-toggle`);
      375 |     expect(toggle.props.accessibilityLabel).toBe('Mostrar contraseña');
      376 |     const group = screen.getByTestId(`${field}-group`);

      at toBe (src/screens/reset-password/index.test.tsx:373:41)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

FAIL src/components/__tests__/password-input.test.tsx
  ● #172 R8: PasswordInput › #172 R8: arranca oculta con «Mostrar contraseña» y el ojo

    expect(received).toBe(expected) // Object.is equality

    Expected: true
    Received: false

      33 |   it('#172 R8: arranca oculta con «Mostrar contraseña» y el ojo', async () => {
      34 |     await renderPassword();
    > 35 |     expect(screen.getByTestId('pw').props.secureTextEntry).toBe(true);
         |                                                            ^
      36 |     const toggle = screen.getByRole('button', { name: 'Mostrar contraseña' });
      37 |     expect(toggle).toBe(screen.getByTestId('pw-toggle'));
      38 |     expect(toggle.children).toHaveLength(1);

      at Object.toBe (src/components/__tests__/password-input.test.tsx:35:60)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
  ● #172 R8: PasswordInput › #172 R8: el ojo alterna mostrar y ocultar

    expect(received).toBe(expected) // Object.is equality

    Expected: false
    Received: true

      45 |     await renderPassword();
      46 |     await fireEvent.press(screen.getByTestId('pw-toggle'));
    > 47 |     expect(screen.getByTestId('pw').props.secureTextEntry).toBe(false);
         |                                                            ^
      48 |     const toggle = screen.getByRole('button', { name: 'Ocultar contraseña' });
      49 |     expect(toggle.children).toHaveLength(1);
      50 |     expect(toggle.children[0]).toHaveProperty('props.testID', 'icon-eye-off');

      at Object.toBe (src/components/__tests__/password-input.test.tsx:47:60)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
  ● #172 R8: PasswordInput › #172 R8: en inglés dice «Show password» y «Hide password»

    Unable to find an element with role: button, name: Show password

    <RNCSafeAreaProvider>
      <View>
        <View
          testID="pw-group"
        >
          <TextInput
            editable={true}
            testID="pw"
            value=""
          />
          <View>
            <View
              accessibilityLabel="Hide password"
              accessibilityRole="button"
              accessible={true}
              testID="pw-toggle"
            >
              <View
                testID="icon-eye-off"
              />
            </View>
          </View>
        </View>
      </View>
    </RNCSafeAreaProvider>

      59 |   it('#172 R8: en inglés dice «Show password» y «Hide password»', async () => {
      60 |     await renderPassword('en');
    > 61 |     const toggle = screen.getByRole('button', { name: 'Show password' });
         |                           ^
      62 |     await fireEvent.press(toggle);
      63 |     expect(screen.getByRole('button', { name: 'Hide password' })).toBeOnTheScreen();
      64 |   });

      at Object.getByRole (src/components/__tests__/password-input.test.tsx:61:27)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

FAIL src/screens/register/index.test.tsx (9.15 s)
  ● #167 R7: Pingo en la cabecera del registro › #172 R8: register-password lleva su propio ojo

    expect(received).toBe(expected) // Object.is equality

    Expected: true
    Received: false

      369 |     await renderRegister();
      370 |     const input = screen.getByTestId(field);
    > 371 |     expect(input.props.secureTextEntry).toBe(true);
          |                                         ^
      372 |     const toggle = screen.getByTestId(`${field}-toggle`);
      373 |     expect(toggle.props.accessibilityLabel).toBe('Mostrar contraseña');
      374 |     const group = screen.getByTestId(`${field}-group`);

      at toBe (src/screens/register/index.test.tsx:371:41)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
  ● #167 R7: Pingo en la cabecera del registro › #172 R8: register-password-confirmation lleva su propio ojo

    expect(received).toBe(expected) // Object.is equality

    Expected: true
    Received: false

      369 |     await renderRegister();
      370 |     const input = screen.getByTestId(field);
    > 371 |     expect(input.props.secureTextEntry).toBe(true);
          |                                         ^
      372 |     const toggle = screen.getByTestId(`${field}-toggle`);
      373 |     expect(toggle.props.accessibilityLabel).toBe('Mostrar contraseña');
      374 |     const group = screen.getByTestId(`${field}-group`);

      at toBe (src/screens/register/index.test.tsx:371:41)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
exit=1
```

#### S8a — restore

```bash
git checkout HEAD -- src/components/password-input.tsx; git diff --quiet HEAD -- src/components/password-input.tsx; echo "exit=$?"
```

```text
exit=0
exit=0
```

#### S8b — jest

```bash
bunx jest --testTimeout=30000 --runTestsByPath src/components/__tests__/password-input.test.tsx
```

```text
Test Suites: 1 failed, 1 total
Tests:       2 failed, 2 passed, 4 total
Time:        5.213 s
  ● #172 R8: PasswordInput › #172 R8: arranca oculta con «Mostrar contraseña» y el ojo

    expect(received).toHaveProperty(path, value)

    Expected path: "props.testID"

    Expected value: "icon-eye"
    Received value: "icon-eye-off"

      37 |     expect(toggle).toBe(screen.getByTestId('pw-toggle'));
      38 |     expect(toggle.children).toHaveLength(1);
    > 39 |     expect(toggle.children[0]).toHaveProperty('props.testID', 'icon-eye');
         |                                ^
      40 |     expect(toggle.children[0]).toHaveProperty('props.size', 20);
      41 |     expect(toggle.children[0]).toHaveProperty('props.color', 'color:muted');
      42 |   });

      at Object.toHaveProperty (src/components/__tests__/password-input.test.tsx:39:32)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
  ● #172 R8: PasswordInput › #172 R8: el ojo alterna mostrar y ocultar

    expect(received).toHaveProperty(path, value)

    Expected path: "props.testID"

    Expected value: "icon-eye-off"
    Received value: "icon-eye"

      48 |     const toggle = screen.getByRole('button', { name: 'Ocultar contraseña' });
      49 |     expect(toggle.children).toHaveLength(1);
    > 50 |     expect(toggle.children[0]).toHaveProperty('props.testID', 'icon-eye-off');
         |                                ^
      51 |     expect(toggle.children[0]).toHaveProperty('props.size', 20);
      52 |     expect(toggle.children[0]).toHaveProperty('props.color', 'color:muted');
      53 |     await fireEvent.press(toggle);

      at Object.toHaveProperty (src/components/__tests__/password-input.test.tsx:50:32)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
exit=1
```

#### S8b — restore

```bash
git checkout HEAD -- src/components/password-input.tsx; git diff --quiet HEAD -- src/components/password-input.tsx; echo "exit=$?"
```

```text
exit=0
exit=0
```

#### S8c — jest

```bash
bunx jest --testTimeout=30000 --runTestsByPath src/screens/register/index.test.tsx src/screens/reset-password/index.test.tsx
```

```text
Test Suites: 2 failed, 2 total
Tests:       4 failed, 60 passed, 64 total
Time:        9.399 s, estimated 10 s
  ● #167 R10: Pingo y tarjeta de estado en nueva contraseña › #172 R8: reset-password lleva su propio ojo

    expect(received).toBe(expected) // Object.is equality

    Expected: true
    Received: false

      381 |     expect(screen.getByTestId(`${field}-toggle`).props.accessibilityLabel).toBe('Ocultar contraseña');
      382 |     const other = field === 'reset-password' ? 'reset-password-confirm' : 'reset-password';
    > 383 |     expect(screen.getByTestId(other).props.secureTextEntry).toBe(true);
          |                                                             ^
      384 |   });
      385 |
      386 |   it('#172 R5: Pingo de nueva contraseña flota en el formulario y en el éxito', async () => {

      at toBe (src/screens/reset-password/index.test.tsx:383:61)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
  ● #167 R10: Pingo y tarjeta de estado en nueva contraseña › #172 R8: reset-password-confirm lleva su propio ojo

    expect(received).toBe(expected) // Object.is equality

    Expected: true
    Received: false

      371 |     await renderRoute('reset-token-172');
      372 |     const input = screen.getByTestId(field);
    > 373 |     expect(input.props.secureTextEntry).toBe(true);
          |                                         ^
      374 |     const toggle = screen.getByTestId(`${field}-toggle`);
      375 |     expect(toggle.props.accessibilityLabel).toBe('Mostrar contraseña');
      376 |     const group = screen.getByTestId(`${field}-group`);

      at toBe (src/screens/reset-password/index.test.tsx:373:41)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

FAIL src/screens/register/index.test.tsx (8.521 s)
  ● #167 R7: Pingo en la cabecera del registro › #172 R8: register-password lleva su propio ojo

    expect(received).toBe(expected) // Object.is equality

    Expected: true
    Received: false

      379 |     expect(screen.getByTestId(`${field}-toggle`).props.accessibilityLabel).toBe('Ocultar contraseña');
      380 |     const other = field === 'register-password' ? 'register-password-confirmation' : 'register-password';
    > 381 |     expect(screen.getByTestId(other).props.secureTextEntry).toBe(true);
          |                                                             ^
      382 |   });
      383 |
      384 |   it('#172 R5: Pingo del registro flota', async () => {

      at toBe (src/screens/register/index.test.tsx:381:61)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
  ● #167 R7: Pingo en la cabecera del registro › #172 R8: register-password-confirmation lleva su propio ojo

    expect(received).toBe(expected) // Object.is equality

    Expected: true
    Received: false

      369 |     await renderRegister();
      370 |     const input = screen.getByTestId(field);
    > 371 |     expect(input.props.secureTextEntry).toBe(true);
          |                                         ^
      372 |     const toggle = screen.getByTestId(`${field}-toggle`);
      373 |     expect(toggle.props.accessibilityLabel).toBe('Mostrar contraseña');
      374 |     const group = screen.getByTestId(`${field}-group`);

      at toBe (src/screens/register/index.test.tsx:371:41)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
exit=1
```

#### S8c — restore

```bash
git checkout HEAD -- src/components/password-input.tsx; git diff --quiet HEAD -- src/components/password-input.tsx; echo "exit=$?"
```

```text
exit=0
exit=0
```

#### S8d — jest

```bash
bunx jest --testTimeout=30000 --runTestsByPath src/screens/reset-password/index.test.tsx
```

```text
Test Suites: 1 failed, 1 total
Tests:       1 failed, 36 passed, 37 total
Time:        6.376 s, estimated 8 s
  ● #167 R10: Pingo y tarjeta de estado en nueva contraseña › #172 R8: reset-password-confirm lleva su propio ojo

    Unable to find an element with testID: reset-password-confirm-toggle

    <RNCSafeAreaProvider>
      <View
        testID="screen-reset-password"
      >
        <RCTScrollView
          testID="reset-password-form"
        >
          <View>
            <View
              testID="reset-header"
            >
              <View
                testID="reset-pingo-float"
              >
                <ViewManagerAdapter_ExpoImage
                  placeholder={[]}
                  testID="reset-pingo"
                />
              </View>
              <Text>
                Restablecer contraseña
              </Text>
            </View>
            <View
              testID="reset-body"
            >
              <View>
                <View
                  accessible={true}
                >
                  <Text>
                    Nueva contraseña
                  </Text>
                </View>
                <View
                  testID="reset-password-group"
                >
                  <TextInput
                    editable={true}
                    testID="reset-password"
                    value=""
                  />
                  <View>
                    <View
                      accessibilityLabel="Mostrar contraseña"
                      accessibilityRole="button"
                      accessible={true}
                      testID="reset-password-toggle"
                    >
                      <View
                        testID="icon-eye"
                      />
                    </View>
                  </View>
                </View>
              </View>
              <View>
                <View
                  accessible={true}
                >
                  <Text>
                    Confirmar nueva contraseña
                  </Text>
                </View>
                <TextInput
                  editable={true}
                  testID="reset-password-confirm"
                  value=""
                />
              </View>
              <View
                accessibilityRole="button"
                accessibilityState={
                  {
                    "disabled": false,
                  }
                }
                accessible={true}
                testID="reset-submit"
              >
                <View
                  pointerEvents="none"
                  style={
                    {
                      "opacity": 0,
                    }
                  }
                />
                <Text>
                  Actualizar contraseña
                </Text>
              </View>
            </View>
          </View>
        </RCTScrollView>
      </View>
    </RNCSafeAreaProvider>

      372 |     const input = screen.getByTestId(field);
      373 |     expect(input.props.secureTextEntry).toBe(true);
    > 374 |     const toggle = screen.getByTestId(`${field}-toggle`);
          |                           ^
      375 |     expect(toggle.props.accessibilityLabel).toBe('Mostrar contraseña');
      376 |     const group = screen.getByTestId(`${field}-group`);
      377 |     expect(group).toContainElement(input);

      at getByTestId (src/screens/reset-password/index.test.tsx:374:27)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
exit=1
```

#### S8d — restore

```bash
git checkout HEAD -- src/screens/reset-password/index.tsx; git diff --quiet HEAD -- src/screens/reset-password/index.tsx; echo "exit=$?"
```

```text
exit=0
exit=0
```

#### S10a — jest

```bash
bunx jest --testTimeout=30000 --runTestsByPath src/screens/register/index.test.tsx
```

```text
Test Suites: 1 failed, 1 total
Tests:       1 failed, 28 passed, 29 total
Time:        8.609 s, estimated 9 s
  ● #167 R7: Pingo en la cabecera del registro › #172 R10: cada campo con error lleva icono y texto seleccionable

    Unable to find an element with testID: register-country-message-row

    <RNCSafeAreaProvider>
      <View
        testID="screen-register"
      >
        <RCTScrollView
          testID="register-form"
        >
          <View>
            <View
              testID="register-header"
            >
              <View
                testID="register-top"
              >
                <View
                  accessibilityLabel="Volver"
                  accessibilityRole="button"
                  accessible={true}
                  testID="register-back"
                >
                  <RNSVGSvgView>
                    <RNSVGGroup>
                      <RNSVGGroup>
                        <RNSVGPath />
                      </RNSVGGroup>
                    </RNSVGGroup>
                  </RNSVGSvgView>
                </View>
                <View
                  testID="register-pingo-float"
                >
                  <ViewManagerAdapter_ExpoImage
                    placeholder={[]}
                    testID="register-pingo"
                  />
                </View>
              </View>
              <Text>
                Crear cuenta
              </Text>
            </View>
            <View>
              <View
                accessible={true}
              >
                <Text>
                  Nombres
                </Text>
              </View>
              <TextInput
                editable={true}
                testID="register-first-name"
                value="Alex"
              />
              <View
                testID="register-first-name-error"
              >
                <View
                  testID="register-first-name-message-row"
                >
                  <View
                    testID="icon-alert-circle"
                  />
                  <Text
                    testID="register-first-name-message"
                  >
                    firstName no vale
                  </Text>
                </View>
              </View>
            </View>
            <View>
              <View
                accessible={true}
              >
                <Text>
                  Apellidos
                </Text>
              </View>
              <TextInput
                editable={true}
                testID="register-last-name"
                value="Smith"
              />
              <View
                testID="register-last-name-error"
              >
                <View
                  testID="register-last-name-message-row"
                >
                  <View
                    testID="icon-alert-circle"
                  />
                  <Text
                    testID="register-last-name-message"
                  >
                    lastName no vale
                  </Text>
                </View>
              </View>
            </View>
            <View>
              <View
                accessible={true}
              >
                <Text>
                  Correo electrónico
                </Text>
              </View>
              <TextInput
                editable={true}
                testID="register-email"
                value="alex@example.com"
              />
              <View
                testID="register-email-error"
              >
                <View
                  testID="register-email-message-row"
                >
                  <View
                    testID="icon-alert-circle"
                  />
                  <Text
                    testID="register-email-message"
                  >
                    email no vale
                  </Text>
                </View>
              </View>
            </View>
            <View>
              <View
                accessible={true}
              >
                <Text>
                  Teléfono
                </Text>
              </View>
              <TextInput
                editable={true}
                testID="register-phone"
                value="+525555555555"
              />
              <View
                testID="register-phone-error"
              >
                <View
                  testID="register-phone-message-row"
                >
                  <View
                    testID="icon-alert-circle"
                  />
                  <Text
                    testID="register-phone-message"
                  >
                    phone no vale
                  </Text>
                </View>
              </View>
            </View>
            <View>
              <View
                accessible={true}
              >
                <Text>
                  Contraseña
                </Text>
              </View>
              <View
                testID="register-password-group"
              >
                <TextInput
                  editable={true}
                  testID="register-password"
                  value="correct horse"
                />
                <View>
                  <View
                    accessibilityLabel="Mostrar contraseña"
                    accessibilityRole="button"
                    accessible={true}
                    testID="register-password-toggle"
                  >
                    <View
                      testID="icon-eye"
                    />
                  </View>
                </View>
              </View>
              <View
                testID="register-password-error"
              >
                <View
                  testID="register-password-message-row"
                >
                  <View
                    testID="icon-alert-circle"
                  />
                  <Text
                    testID="register-password-message"
                  >
                    password no vale
                  </Text>
                </View>
              </View>
            </View>
            <View>
              <View
                accessible={true}
              >
                <Text>
                  Confirmar contraseña
                </Text>
              </View>
              <View
                testID="register-password-confirmation-group"
              >
                <TextInput
                  editable={true}
                  testID="register-password-confirmation"
                  value="correct horse"
                />
                <View>
                  <View
                    accessibilityLabel="Mostrar contraseña"
                    accessibilityRole="button"
                    accessible={true}
                    testID="register-password-confirmation-toggle"
                  >
                    <View
                      testID="icon-eye"
                    />
                  </View>
                </View>
              </View>
              <View
                testID="register-password-confirmation-error"
              >
                <View
                  testID="register-password-confirmation-message-row"
                >
                  <View
                    testID="icon-alert-circle"
                  />
                  <Text
                    testID="register-password-confirmation-message"
                  >
                    passwordConfirmation no vale
                  </Text>
                </View>
              </View>
            </View>
            <View>
              <View
                accessible={true}
              >
                <Text>
                  País
                </Text>
              </View>
              <TextInput
                editable={true}
                testID="register-country"
                value="MX"
              />
              <View
                testID="register-country-error"
              >
                <Text>
                  country no vale
                </Text>
              </View>
            </View>
            <View>
              <View
                accessibilityState={
                  {
                    "checked": true,
                    "disabled": false,
                  }
                }
                accessible={true}
                role="checkbox"
                testID="register-terms"
              >
                <View
                  aria-disabled={false}
                  aria-hidden={false}
                  role="presentation"
                  style={
                    {
                      "opacity": 0,
                    }
                  }
                >
                  <RNSVGSvgView>
                    <RNSVGGroup>
                      <RNSVGPath />
                    </RNSVGGroup>
                  </RNSVGSvgView>
                </View>
              </View>
              <Text>
                Acepto los términos
              </Text>
            </View>
            <View
              testID="register-error-row"
            >
              <View
                testID="icon-alert-circle"
              />
              <Text
                testID="register-error"
              >
                termsAccepted no vale
              </Text>
            </View>
            <View
              accessibilityRole="button"
              accessibilityState={
                {
                  "disabled": false,
                }
              }
              accessible={true}
              testID="register-submit"
            >
              <View
                pointerEvents="none"
                style={
                  {
                    "opacity": 0,
                  }
                }
              />
              <Text>
                Crear cuenta
              </Text>
            </View>
          </View>
        </RCTScrollView>
      </View>
    </RNCSafeAreaProvider>

      421 |     for (const [field, path] of fields) {
      422 |       const error = screen.getByTestId(`register-${field}-error`);
    > 423 |       const row = within(error).getByTestId(`register-${field}-message-row`);
          |                                 ^
      424 |       const text = within(row).getByTestId(`register-${field}-message`);
      425 |       expect(row.children).toEqual([within(row).getByTestId('icon-alert-circle'), text]);
      426 |       expect(text).toHaveTextContent(`${path} no vale`);

      at Object.getByTestId (src/screens/register/index.test.tsx:423:33)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
exit=1
```

#### S10a — restore

```bash
git checkout HEAD -- src/screens/register/index.tsx; git diff --quiet HEAD -- src/screens/register/index.tsx; echo "exit=$?"
```

```text
exit=0
exit=0
```

#### S10b — jest

```bash
bunx jest --testTimeout=30000 --runTestsByPath src/screens/register/index.test.tsx
```

```text
Test Suites: 1 failed, 1 total
Tests:       1 failed, 28 passed, 29 total
Time:        8.349 s, estimated 9 s
  ● #167 R7: Pingo en la cabecera del registro › #172 R10: cada campo con error lleva icono y texto seleccionable

    expect(instance).toHaveTextContent()

    Expected instance to have text content:
      lastName no vale
    Received:

      424 |       const text = within(row).getByTestId(`register-${field}-message`);
      425 |       expect(row.children).toEqual([within(row).getByTestId('icon-alert-circle'), text]);
    > 426 |       expect(text).toHaveTextContent(`${path} no vale`);
          |                    ^
      427 |       expect(text.props.selectable).toBe(true);
      428 |     }
      429 |     expect(screen.getAllByTestId(/^register-.+-message-row$/)).toHaveLength(7);

      at Object.toHaveTextContent (src/screens/register/index.test.tsx:426:20)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
exit=1
```

#### S10b — restore

```bash
git checkout HEAD -- src/screens/register/index.tsx; git diff --quiet HEAD -- src/screens/register/index.tsx; echo "exit=$?"
```

```text
exit=0
exit=0
```

#### S10c — jest

```bash
bunx jest --testTimeout=30000 --runTestsByPath src/__tests__/account-screens-polish.test.ts
```

```text
Test Suites: 1 failed, 1 total
Tests:       1 failed, 5 passed, 6 total
Time:        1.499 s, estimated 2 s
  ● #172 R10: bordes de error del registro › #172 R10: los siete campos del registro marcan isInvalid

    expect(received).toBe(expected) // Object.is equality

    Expected: 7
    Received: 6

      61 |   it('#172 R10: los siete campos del registro marcan isInvalid', () => {
      62 |     const source = readFileSync(join(sourceRoot, 'screens/register/index.tsx'), 'utf8');
    > 63 |     expect(source.split('isInvalid={Boolean(fieldErrors.').length - 1).toBe(7);
         |                                                                        ^
      64 |   });
      65 | });
      66 |

      at Object.toBe (src/__tests__/account-screens-polish.test.ts:63:72)
exit=1
```

#### S10c — restore

```bash
git checkout HEAD -- src/screens/register/index.tsx; git diff --quiet HEAD -- src/screens/register/index.tsx; echo "exit=$?"
```

```text
exit=0
exit=0
```

### Anclas ejecutadas de c7b a c22

```text
c7b:
MOTION_FLOAT_TIMING MOTION_PINGO_FLOAT_OFFSET_Y MOTION_PINGO_FLOAT_TIMING MOTION_PING_FROM
2
 1 file changed, 2 insertions(+), 2 deletions(-)
c8: 1 (withTiming); 1 (cancelAnimation); 0 (MOTION_FLOAT_); B21=19; bienvenida exit=0
c10: register=1; forgot=1; reset=2 (pingo-float)
c12: fallback welcome=1,1; fallback login=1
c14: B3=0,0,0; B27=0; font-extrabold=1; assets/fonts=6; ficheros con extrabold=5
sha256: e6756ad5690b77606aa62249a7b420d9902d45cae4b0048a24911fd4324b0a22
stat de /tmp/inter-172/Inter-ExtraBold.ttf: 421796
c16: self-center en login=0; B5=2,0,1,3
c18: AlertCircle|useThemeColors en registro=0; FormError=1,1,1,1; B4=0,0,0,2; selectable en FormError=1; diff reset-missing-token=0
c20: PasswordInput=1,2,2; B28=0,0,0,0; secureTextEntry={!visible}=1; ternario de t=1; h-13 en PasswordInput=1; B22=1,5,1,0; ficheros InputGroup=1; Eye|EyeOff|InputGroup en pantallas=0,0,0,0
c22: -message=7; FormError=8; isInvalid=7
```

Las anclas finales de T22 paso 5 no se ejecutaron. No se presentan como
medidas las cifras finales de la feature que sigue incompleta.

### Desviaciones de Reanudación 1

1. Tras aplicar E2, la primera ejecución de c8 pasó Jest pero typecheck
   rechazó las ocho lecturas directas de translateY de mi test (TS2532 y
   TS2339). Se corrigió el tipado en el commit de tests separado c7c
   (`edf99020`) y se repitió todo el gate de c8. No hubo mezcla de tests e
   implementación, ni cambio de la conducta aseverada.
2. S10b no produce el it prescrito por la spec. La secuencia automática
   comprobaba exit y número de fallos, pero no su título; por eso S10c se
   ejecutó antes de inspeccionar la salida de S10b. La inspección descubrió
   el desajuste y se detuvo la feature antes de T12. S10c salió como esperaba
   la spec y también quedó revertida. No se ocultó ni relajó la discrepancia.
3. No se alcanzó T22: se actualizó el informe y la trazabilidad parcial
   como reporte de bloqueo. No se usan los mensajes de cierre completo
   mientras existan requisitos pendientes.
4. No hubo Exceeded timeout, SIGKILL, instalación nueva, alteración de
   dependencias, cambios en los commits del leader ni ejecución de init.sh.

La rama ya no queda en el rojo de c7: todos los commits de producción
llegan a gates verdes, incluido c22. La verificación total y la prueba
visual de Android siguen pendientes. La spec necesita reconciliar S10b.


## Reanudacion 2

### Comprobaciones antes de tocar código

```text
pwd
/home/claude/sites/Pet-Tracker-wt-172
command grep -c -F -- '- [x] Enmienda E3 aprobada por humano' specs/mobile-account-screens-polish/requirements.md
1
git status --short
(sin salida)
git branch --show-current
feature/172-mobile-account-screens-polish
git log -1 --format=%h -- mobile-pet-tracker
14c69144
git rev-parse HEAD
ddd467d9c51c5e96f9b5528859840ee4f285174f
```

H0 no cambió. Se respetaron los commits ajenos, las firmas y todas las
prohibiciones del handoff. S10a y S10c no se repitieron.

### Estado al final

Se ejecutaron T12–T15 (c23–c30), con cada rojo separado de la implementación.
En cada rojo y cada sonda se inspeccionaron los títulos y mensajes de todos
los bloques `●` que no eran `Console` antes de avanzar. Todos coincidieron
con sus tablas hasta S14. Cada verde pasó su Jest con las cuatro guardas,
la guarda del router, typecheck y lint vacío. No hubo timeouts ni SIGKILL.

S10b corregida por E3 dio los tres títulos y mensajes prescritos; R10 queda
verificado. S11a/S11b, S12 y S13 dieron los fallos previstos y quedaron
restauradas con `exit=0`. R11–R13 están implementados y verificados.

R14 está implementado en c30 (`7ddda8f5`), con el gate verde, pero su sonda
S14 tiene un desajuste con la spec. Se paró inmediatamente después de
inspeccionarla y restaurarla. C31–c39, sus sondas y T22 no se ejecutaron.
R21 continúa pendiente (humano). La feature no se declara terminada.

### Bloqueo de T15/S14 — historia (resuelto por E4)

Commit de producción sobre el que se plantó la sonda:
`7ddda8f5 feat(mobile): el candado de recuperar es un tile acento con labio (R14)`.
La mutación cambió únicamente el fondo del tile de `bg-accent` a
`bg-accent-soft`, sin tocar tests. El comando exacto fue:

```bash
cd /home/claude/sites/Pet-Tracker-wt-172/mobile-pet-tracker
bunx jest --testTimeout=30000 --runTestsByPath src/screens/forgot/index.test.tsx src/__tests__/consistency-classnames.test.ts
```

La tabla T15/S14 exige 7 fallos: cuatro de forgot y tres de consistency.
Se obtuvieron 6: los cuatro de forgot y los dos recuentos de bg-accent-soft.
El título ausente es `lleva los tres tiles restantes a rounded-xl`.

Su candado usa `toContain('size-13 items-center justify-center rounded-xl
border-b-4 border-black/25 bg-accent')`. Ese literal es prefijo del literal
mutado, que termina en `bg-accent-soft`; `toContain` sigue pasando.
La causa está en el candado prescrito, no en el número base de otras features.
No se cambió unilateralmente el test, la sonda ni la spec para cuadrarlo.
Hace falta reconciliar la expectativa de S14 y su candado antes de continuar.

```text
git checkout HEAD -- src/screens/forgot/index.tsx
git diff --quiet HEAD -- src/screens/forgot/index.tsx; echo "exit=$?"
exit=0
git status --short
(sin salida antes de actualizar estos documentos)
```

### S10b de E3 — salida literal

Ancla durante la mutación:

```text
command grep -cF '<FieldError testID="register-last-name-error">{null}</FieldError>' src/screens/register/index.tsx
1
```

Se reproducen los bloques de fallo y el resumen literal; solo se omiten los
avisos de `Console` y los códigos ANSI de color.


```bash
bunx jest --testTimeout=30000 --runTestsByPath src/screens/register/index.test.tsx
```

```text
FAIL src/screens/register/index.test.tsx (12.451 s)
Test Suites: 1 failed, 1 total
Tests:       3 failed, 26 passed, 29 total
Time:        12.668 s
  ● #167 R7: Pingo en la cabecera del registro › #172 R10: cada campo con error lleva icono y texto seleccionable

    Unable to find an element with testID: register-last-name-message-row

    <RNCSafeAreaProvider>
      <View
        testID="screen-register"
      >
        <RCTScrollView
          testID="register-form"
        >
          <View>
            <View
              testID="register-header"
            >
              <View
                testID="register-top"
              >
                <View
                  accessibilityLabel="Volver"
                  accessibilityRole="button"
                  accessible={true}
                  testID="register-back"
                >
                  <RNSVGSvgView>
                    <RNSVGGroup>
                      <RNSVGGroup>
                        <RNSVGPath />
                      </RNSVGGroup>
                    </RNSVGGroup>
                  </RNSVGSvgView>
                </View>
                <View
                  testID="register-pingo-float"
                >
                  <ViewManagerAdapter_ExpoImage
                    placeholder={[]}
                    testID="register-pingo"
                  />
                </View>
              </View>
              <Text>
                Crear cuenta
              </Text>
            </View>
            <View>
              <View
                accessible={true}
              >
                <Text>
                  Nombres
                </Text>
              </View>
              <TextInput
                editable={true}
                testID="register-first-name"
                value="Alex"
              />
              <View
                testID="register-first-name-error"
              >
                <View
                  testID="register-first-name-message-row"
                >
                  <View
                    testID="icon-alert-circle"
                  />
                  <Text
                    testID="register-first-name-message"
                  >
                    firstName no vale
                  </Text>
                </View>
              </View>
            </View>
            <View>
              <View
                accessible={true}
              >
                <Text>
                  Apellidos
                </Text>
              </View>
              <TextInput
                editable={true}
                testID="register-last-name"
                value="Smith"
              />
              <View
                testID="register-last-name-error"
              />
              <View
                testID="register-last-name-message-row"
              >
                <View
                  testID="icon-alert-circle"
                />
                <Text
                  testID="register-last-name-message"
                >
                  lastName no vale
                </Text>
              </View>
            </View>
            <View>
              <View
                accessible={true}
              >
                <Text>
                  Correo electrónico
                </Text>
              </View>
              <TextInput
                editable={true}
                testID="register-email"
                value="alex@example.com"
              />
              <View
                testID="register-email-error"
              >
                <View
                  testID="register-email-message-row"
                >
                  <View
                    testID="icon-alert-circle"
                  />
                  <Text
                    testID="register-email-message"
                  >
                    email no vale
                  </Text>
                </View>
              </View>
            </View>
            <View>
              <View
                accessible={true}
              >
                <Text>
                  Teléfono
                </Text>
              </View>
              <TextInput
                editable={true}
                testID="register-phone"
                value="+525555555555"
              />
              <View
                testID="register-phone-error"
              >
                <View
                  testID="register-phone-message-row"
                >
                  <View
                    testID="icon-alert-circle"
                  />
                  <Text
                    testID="register-phone-message"
                  >
                    phone no vale
                  </Text>
                </View>
              </View>
            </View>
            <View>
              <View
                accessible={true}
              >
                <Text>
                  Contraseña
                </Text>
              </View>
              <View
                testID="register-password-group"
              >
                <TextInput
                  editable={true}
                  testID="register-password"
                  value="correct horse"
                />
                <View>
                  <View
                    accessibilityLabel="Mostrar contraseña"
                    accessibilityRole="button"
                    accessible={true}
                    testID="register-password-toggle"
                  >
                    <View
                      testID="icon-eye"
                    />
                  </View>
                </View>
              </View>
              <View
                testID="register-password-error"
              >
                <View
                  testID="register-password-message-row"
                >
                  <View
                    testID="icon-alert-circle"
                  />
                  <Text
                    testID="register-password-message"
                  >
                    password no vale
                  </Text>
                </View>
              </View>
            </View>
            <View>
              <View
                accessible={true}
              >
                <Text>
                  Confirmar contraseña
                </Text>
              </View>
              <View
                testID="register-password-confirmation-group"
              >
                <TextInput
                  editable={true}
                  testID="register-password-confirmation"
                  value="correct horse"
                />
                <View>
                  <View
                    accessibilityLabel="Mostrar contraseña"
                    accessibilityRole="button"
                    accessible={true}
                    testID="register-password-confirmation-toggle"
                  >
                    <View
                      testID="icon-eye"
                    />
                  </View>
                </View>
              </View>
              <View
                testID="register-password-confirmation-error"
              >
                <View
                  testID="register-password-confirmation-message-row"
                >
                  <View
                    testID="icon-alert-circle"
                  />
                  <Text
                    testID="register-password-confirmation-message"
                  >
                    passwordConfirmation no vale
                  </Text>
                </View>
              </View>
            </View>
            <View>
              <View
                accessible={true}
              >
                <Text>
                  País
                </Text>
              </View>
              <TextInput
                editable={true}
                testID="register-country"
                value="MX"
              />
              <View
                testID="register-country-error"
              >
                <View
                  testID="register-country-message-row"
                >
                  <View
                    testID="icon-alert-circle"
                  />
                  <Text
                    testID="register-country-message"
                  >
                    country no vale
                  </Text>
                </View>
              </View>
            </View>
            <View>
              <View
                accessibilityState={
                  {
                    "checked": true,
                    "disabled": false,
                  }
                }
                accessible={true}
                role="checkbox"
                testID="register-terms"
              >
                <View
                  aria-disabled={false}
                  aria-hidden={false}
                  role="presentation"
                  style={
                    {
                      "opacity": 0,
                    }
                  }
                >
                  <RNSVGSvgView>
                    <RNSVGGroup>
                      <RNSVGPath />
                    </RNSVGGroup>
                  </RNSVGSvgView>
                </View>
              </View>
              <Text>
                Acepto los términos
              </Text>
            </View>
            <View
              testID="register-error-row"
            >
              <View
                testID="icon-alert-circle"
              />
              <Text
                testID="register-error"
              >
                termsAccepted no vale
              </Text>
            </View>
            <View
              accessibilityRole="button"
              accessibilityState={
                {
                  "disabled": false,
                }
              }
              accessible={true}
              testID="register-submit"
            >
              <View
                pointerEvents="none"
                style={
                  {
                    "opacity": 0,
                  }
                }
              />
              <Text>
                Crear cuenta
              </Text>
            </View>
          </View>
        </RCTScrollView>
      </View>
    </RNCSafeAreaProvider>

      421 |     for (const [field, path] of fields) {
      422 |       const error = screen.getByTestId(`register-${field}-error`);
    > 423 |       const row = within(error).getByTestId(`register-${field}-message-row`);
          |                                 ^
      424 |       const text = within(row).getByTestId(`register-${field}-message`);
      425 |       expect(row.children).toEqual([within(row).getByTestId('icon-alert-circle'), text]);
      426 |       expect(text).toHaveTextContent(`${path} no vale`);

      at Object.getByTestId (src/screens/register/index.test.tsx:423:33)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
  ● #167 R7: Pingo en la cabecera del registro › #172 R10: sin errores ningún campo pinta mensaje

    expect(received).toHaveLength(expected)

    Expected length: 0
    Received length: 2
    Received array:  [<View className="w-full flex-row items-center gap-1.5" testID="register-last-name-message-row"><View color="color:danger" size={14} testID="icon-alert-circle" /><Text className="flex-1 text-13 font-semibold text-danger" selectable={true} testID="register-last-name-message" /></View>, <Text className="flex-1 text-13 font-semibold text-danger" selectable={true} testID="register-last-name-message" />]

      432 |   it('#172 R10: sin errores ningún campo pinta mensaje', async () => {
      433 |     await renderRegister();
    > 434 |     expect(screen.queryAllByTestId(/^register-.+-message(-row)?$/)).toHaveLength(0);
          |                                                                     ^
      435 |   });
      436 |
      437 |   it('#167 R7: campos, errores, términos y envío cuelgan del scroll', async () => {

      at Object.toHaveLength (src/screens/register/index.test.tsx:434:69)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
  ● #167 R8: el error del registro lleva icono › #167 R8: el icono del error mide 14 y usa danger

    Found multiple elements with testID: icon-alert-circle

      500 |     await fillForm();
      501 |     await submit();
    > 502 |     const icon = screen.getByTestId('icon-alert-circle');
          |                         ^
      503 |     expect(icon.props.size).toBe(14);
      504 |     expect(icon.props.color).toBe('color:danger');
      505 |   });

      at Object.getByTestId (src/screens/register/index.test.tsx:502:25)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
exit=1
```

Restauración literal:

```bash
git checkout HEAD -- src/screens/register/index.tsx; git diff --quiet HEAD -- src/screens/register/index.tsx; echo "exit=$?"
```

```text
exit=0
exit=0
```

### Contraste de cada rojo y sonda con su tabla

| Paso | Bloques comprobados | Resultado |
|---|---|---|
| S10b E3 | R10 cada campo: consulta last-name-message-row; R10 sin errores: longitud 2; #167 R8 icono: múltiples icon-alert-circle | 3/3; restaurada |
| c23 | dos R11: cabecera/rejilla y proporciones; ambos por consulta register-names-row | 2/2 |
| S11a | R11 proporciones: falta flex-2 | 1/1; restaurada |
| S11b | R11 proporciones: orden teléfono-país (toEqual) | 1/1; restaurada |
| c25 / S12 | dos R12: correo español y correo inglés; consulta register-email-message | 2/2 en cada ejecución; sonda restaurada |
| c27 / S13 | R13 liveRegion: toBe('polite'), recibido undefined | 1/1 en cada ejecución; sonda restaurada |
| c29 | forgot: tile en dos estados, pop formulario, pop enviado y R14; consistency: tiles restantes, Lock foreground, dos recuentos bg-accent-soft, excepción labio | 9/9; tipos de aserción prescritos |
| S14 | forgot: los mismos cuatro; consistency: solo dos recuentos bg-accent-soft; falta tiles restantes | **6/7: bloqueo; restaurada; no se avanzó** |

### Gates y sondas de c23–c30 — extractos literales

Los siguientes extractos preservan títulos, mensajes, resúmenes, comandos y
exits. Se omiten Console y códigos ANSI; los bloques extensos de árboles se
cortan después del mensaje y la primera parte de la aserción.


#### c23 — jest

```bash
bunx jest --testTimeout=30000 --runTestsByPath src/screens/register/index.test.tsx
```

```text
FAIL src/screens/register/index.test.tsx (10.066 s)
Test Suites: 1 failed, 1 total
Tests:       2 failed, 28 passed, 30 total
Time:        10.233 s, estimated 13 s
  ● #167 R7: Pingo en la cabecera del registro › #172 R11: cabecera, rejilla, términos, error y envío cuelgan del scroll

    Unable to find an element with testID: register-names-row

    <RNCSafeAreaProvider>
      <View
        testID="screen-register"
      >
        <RCTScrollView
          testID="register-form"
        >
          <View>
            <View
              testID="register-header"
            >
              <View
                testID="register-top"
              >
                <View
                  accessibilityLabel="Volver"
                  accessibilityRole="button"
                  accessible={true}
                  testID="register-back"
                >
                  <RNSVGSvgView>
                    <RNSVGGroup>
                      <RNSVGGroup>
                        <RNSVGPath />
                      </RNSVGGroup>
                    </RNSVGGroup>
                  </RNSVGSvgView>
                </View>
                <View
                  testID="register-pingo-float"
                >
                  <ViewManagerAdapter_ExpoImage
                    placeholder={[]}
                    testID="register-pingo"
  ● #167 R7: Pingo en la cabecera del registro › #172 R11: nombres a 1fr 1fr y teléfono-país a 2fr 1fr

    Unable to find an element with testID: register-names-row

    <RNCSafeAreaProvider>
      <View
        testID="screen-register"
      >
        <RCTScrollView
          testID="register-form"
        >
          <View>
            <View
              testID="register-header"
            >
              <View
                testID="register-top"
              >
                <View
                  accessibilityLabel="Volver"
                  accessibilityRole="button"
                  accessible={true}
                  testID="register-back"
                >
                  <RNSVGSvgView>
                    <RNSVGGroup>
                      <RNSVGGroup>
                        <RNSVGPath />
                      </RNSVGGroup>
                    </RNSVGGroup>
                  </RNSVGSvgView>
                </View>
                <View
                  testID="register-pingo-float"
                >
                  <ViewManagerAdapter_ExpoImage
                    placeholder={[]}
                    testID="register-pingo"
                  />
exit=1
```

#### c24 — jest

```bash
bunx jest --testTimeout=30000 --runTestsByPath src/screens/register/index.test.tsx src/__tests__/ui-language.test.ts src/__tests__/design-drift.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/legibility-classnames.test.ts
```

```text
PASS src/__tests__/design-drift.test.ts
PASS src/__tests__/consistency-classnames.test.ts
PASS src/__tests__/ui-language.test.ts
PASS src/__tests__/legibility-classnames.test.ts
PASS src/screens/register/index.test.tsx (9.55 s)
Test Suites: 5 passed, 5 total
Tests:       224 passed, 224 total
Time:        10.523 s, estimated 11 s
exit=0
```

#### c24 — router

```bash
test ! -e .expo/types/router.d.ts
```

```text

exit=0
```

#### c24 — typecheck

```bash
bun run typecheck
```

```text
$ tsc --noEmit
exit=0
```

#### c24 — lint

```bash
bunx expo lint --no-cache > /tmp/lint-172.log 2>&1
```

```text

vacio=0
exit=0
```

#### S11a — jest

```bash
bunx jest --testTimeout=30000 --runTestsByPath src/screens/register/index.test.tsx
```

```text
FAIL src/screens/register/index.test.tsx (11.127 s)
Test Suites: 1 failed, 1 total
Tests:       1 failed, 29 passed, 30 total
Time:        11.346 s
  ● #167 R7: Pingo en la cabecera del registro › #172 R11: nombres a 1fr 1fr y teléfono-país a 2fr 1fr

    expect(received).toContain(expected) // indexOf

    Expected value: "flex-2"
    Received array: ["text-field__root", "flex-1"]

      476 |       expect(root?.props.className.split(' ')).not.toContain('flex-2');
      477 |     }
    > 478 |     expect(phone?.props.className.split(' ')).toContain('flex-2');
          |                                               ^
      479 |     expect(phone?.props.className.split(' ')).not.toContain('flex-1');
      480 |   });
      481 |

      at Object.toContain (src/screens/register/index.test.tsx:478:47)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
exit=1
```

#### S11a — restore

```bash
git checkout HEAD -- src/screens/register/index.tsx; git diff --quiet HEAD -- src/screens/register/index.tsx; echo "exit=$?"
```

```text
exit=0
exit=0
```

#### S11b — jest

```bash
bunx jest --testTimeout=30000 --runTestsByPath src/screens/register/index.test.tsx
```

```text
FAIL src/screens/register/index.test.tsx (11.773 s)
Test Suites: 1 failed, 1 total
Tests:       1 failed, 29 passed, 30 total
Time:        11.984 s, estimated 12 s
  ● #167 R7: Pingo en la cabecera del registro › #172 R11: nombres a 1fr 1fr y teléfono-país a 2fr 1fr

    expect(received).toEqual(expected) // deep equality

    - Expected  - 11
    + Received  + 11

    @@ -1,8 +1,8 @@
      Array [
        <View
    -     className="text-field__root flex-2"
    +     className="text-field__root flex-1"
        >
          <View
            accessibilityState={
              Object {
                "busy": undefined,
    @@ -41,34 +41,35 @@
                  undefined,
                  undefined,
                ]
              }
            >
    -         Teléfono
    +         País
            </Text>
          </View>
          <TextInput
    +       autoCapitalize="characters"
            className="input__input ios:outline-2 ios:outline-transparent ios:focus:outline-accent android:border-[1.5px] android:border-transparent android:focus:border-accent rtl:text-right input__input--variant-primary ios:shadow-field android:shadow-sm rounded-xl bg-default"
            editable={true}
    -       keyboardType="phone-pad"
    -       onChangeText={[Function bound dispatchSetState]}
    +       maxLength={2}
    +       onChangeText={[Function
exit=1
```

#### S11b — restore

```bash
git checkout HEAD -- src/screens/register/index.tsx; git diff --quiet HEAD -- src/screens/register/index.tsx; echo "exit=$?"
```

```text
exit=0
exit=0
```

#### c25 — jest

```bash
bunx jest --testTimeout=30000 --runTestsByPath src/screens/register/index.test.tsx
```

```text
FAIL src/screens/register/index.test.tsx (13.117 s)
Test Suites: 1 failed, 1 total
Tests:       2 failed, 30 passed, 32 total
Time:        13.308 s
  ● #167 R7: Pingo en la cabecera del registro › #172 R12: un correo sin arroba no llama a la API y marca el campo

    Unable to find an element with testID: register-email-message

    <RNCSafeAreaProvider>
      <View
        testID="screen-register"
      >
        <RCTScrollView
          testID="register-form"
        >
          <View>
            <View
              testID="register-header"
            >
              <View
                testID="register-top"
              >
                <View
                  accessibilityLabel="Volver"
                  accessibilityRole="button"
                  accessible={true}
                  testID="register-back"
                >
                  <RNSVGSvgView>
                    <RNSVGGroup>
                      <RNSVGGroup>
                        <RNSVGPath />
                      </RNSVGGroup>
                    </RNSVGGroup>
                  </RNSVGSvgView>
                </View>
                <View
                  testID="register-pingo-float"
                >
                  <ViewManagerAdapter_ExpoImage
                    placeholder={[]}
                    testID="register-pingo"
  ● #167 R7: Pingo en la cabecera del registro › #172 R12: en inglés el correo inválido dice «Enter a valid email address»

    Unable to find an element with testID: register-email-message

    <RNCSafeAreaProvider>
      <View
        testID="screen-register"
      >
        <RCTScrollView
          testID="register-form"
        >
          <View>
            <View
              testID="register-header"
            >
              <View
                testID="register-top"
              >
                <View
                  accessibilityLabel="Back"
                  accessibilityRole="button"
                  accessible={true}
                  testID="register-back"
                >
                  <RNSVGSvgView>
                    <RNSVGGroup>
                      <RNSVGGroup>
                        <RNSVGPath />
                      </RNSVGGroup>
                    </RNSVGGroup>
                  </RNSVGSvgView>
                </View>
                <View
                  testID="register-pingo-float"
                >
                  <ViewManagerAdapter_ExpoImage
                    placeholder={[]}
                    testID="register-pingo"
exit=1
```

#### c26 — jest

```bash
bunx jest --testTimeout=30000 --runTestsByPath src/screens/register/index.test.tsx src/__tests__/ui-language.test.ts src/__tests__/design-drift.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/legibility-classnames.test.ts
```

```text
PASS src/__tests__/design-drift.test.ts
PASS src/__tests__/consistency-classnames.test.ts
PASS src/__tests__/legibility-classnames.test.ts
PASS src/__tests__/ui-language.test.ts
PASS src/screens/register/index.test.tsx (12.837 s)
Test Suites: 5 passed, 5 total
Tests:       226 passed, 226 total
Time:        14.834 s
exit=0
```

#### c26 — router

```bash
test ! -e .expo/types/router.d.ts
```

```text

exit=0
```

#### c26 — typecheck

```bash
bun run typecheck
```

```text
$ tsc --noEmit
exit=0
```

#### c26 — lint

```bash
bunx expo lint --no-cache > /tmp/lint-172.log 2>&1
```

```text

vacio=0
exit=0
```

#### S12 — jest

```bash
bunx jest --testTimeout=30000 --runTestsByPath src/screens/register/index.test.tsx
```

```text
FAIL src/screens/register/index.test.tsx (20.642 s)
Test Suites: 1 failed, 1 total
Tests:       2 failed, 30 passed, 32 total
Time:        20.857 s
  ● #167 R7: Pingo en la cabecera del registro › #172 R12: un correo sin arroba no llama a la API y marca el campo

    Unable to find an element with testID: register-email-message

    <RNCSafeAreaProvider>
      <View
        testID="screen-register"
      >
        <RCTScrollView
          testID="register-form"
        >
          <View>
            <View
              testID="register-header"
            >
              <View
                testID="register-top"
              >
                <View
                  accessibilityLabel="Volver"
                  accessibilityRole="button"
                  accessible={true}
                  testID="register-back"
                >
                  <RNSVGSvgView>
                    <RNSVGGroup>
                      <RNSVGGroup>
                        <RNSVGPath />
                      </RNSVGGroup>
                    </RNSVGGroup>
                  </RNSVGSvgView>
                </View>
                <View
                  testID="register-pingo-float"
                >
                  <ViewManagerAdapter_ExpoImage
                    placeholder={[]}
                    testID="register-pingo"
  ● #167 R7: Pingo en la cabecera del registro › #172 R12: en inglés el correo inválido dice «Enter a valid email address»

    Unable to find an element with testID: register-email-message

    <RNCSafeAreaProvider>
      <View
        testID="screen-register"
      >
        <RCTScrollView
          testID="register-form"
        >
          <View>
            <View
              testID="register-header"
            >
              <View
                testID="register-top"
              >
                <View
                  accessibilityLabel="Back"
                  accessibilityRole="button"
                  accessible={true}
                  testID="register-back"
                >
                  <RNSVGSvgView>
                    <RNSVGGroup>
                      <RNSVGGroup>
                        <RNSVGPath />
                      </RNSVGGroup>
                    </RNSVGGroup>
                  </RNSVGSvgView>
                </View>
                <View
                  testID="register-pingo-float"
                >
                  <ViewManagerAdapter_ExpoImage
                    placeholder={[]}
                    testID="register-pingo"
exit=1
```

#### S12 — restore

```bash
git checkout HEAD -- src/screens/register/index.tsx; git diff --quiet HEAD -- src/screens/register/index.tsx; echo "exit=$?"
```

```text
exit=0
exit=0
```

#### c27 — jest

```bash
bunx jest --testTimeout=30000 --runTestsByPath src/screens/reset-password/index.test.tsx
```

```text
FAIL src/screens/reset-password/index.test.tsx (46.829 s)
Test Suites: 1 failed, 1 total
Tests:       1 failed, 37 passed, 38 total
Time:        55.87 s
  ● #167 R10: Pingo y tarjeta de estado en nueva contraseña › #172 R13: la tarjeta de estado avisa con liveRegion polite

    expect(received).toBe(expected) // Object.is equality

    Expected: "polite"
    Received: undefined

      462 |     await submitReset();
      463 |     expect(await screen.findByTestId('reset-success')).toBeOnTheScreen();
    > 464 |     expect(screen.getByTestId('reset-success-card').props.accessibilityLiveRegion).toBe('polite');
          |                                                                                    ^
      465 |   });
      466 |
      467 |   it('#167 R10: el éxito conserva la cabecera del formulario', async () => {

      at Object.toBe (src/screens/reset-password/index.test.tsx:464:84)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
exit=1
```

#### c28 — jest

```bash
bunx jest --testTimeout=30000 --runTestsByPath src/screens/reset-password/index.test.tsx src/__tests__/ui-language.test.ts src/__tests__/design-drift.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/legibility-classnames.test.ts
```

```text
PASS src/__tests__/design-drift.test.ts (5.481 s)
PASS src/__tests__/ui-language.test.ts (6.122 s)
PASS src/__tests__/consistency-classnames.test.ts
PASS src/__tests__/legibility-classnames.test.ts
PASS src/screens/reset-password/index.test.tsx (18.922 s)
Test Suites: 5 passed, 5 total
Tests:       232 passed, 232 total
Time:        20.53 s, estimated 47 s
exit=0
```

#### c28 — router

```bash
test ! -e .expo/types/router.d.ts
```

```text

exit=0
```

#### c28 — typecheck

```bash
bun run typecheck
```

```text
$ tsc --noEmit
exit=0
```

#### c28 — lint

```bash
bunx expo lint --no-cache > /tmp/lint-172.log 2>&1
```

```text

vacio=0
exit=0
```

#### S13 — jest

```bash
bunx jest --testTimeout=30000 --runTestsByPath src/screens/reset-password/index.test.tsx
```

```text
FAIL src/screens/reset-password/index.test.tsx (9.215 s)
Test Suites: 1 failed, 1 total
Tests:       1 failed, 37 passed, 38 total
Time:        9.482 s, estimated 19 s
  ● #167 R10: Pingo y tarjeta de estado en nueva contraseña › #172 R13: la tarjeta de estado avisa con liveRegion polite

    expect(received).toBe(expected) // Object.is equality

    Expected: "polite"
    Received: undefined

      462 |     await submitReset();
      463 |     expect(await screen.findByTestId('reset-success')).toBeOnTheScreen();
    > 464 |     expect(screen.getByTestId('reset-success-card').props.accessibilityLiveRegion).toBe('polite');
          |                                                                                    ^
      465 |   });
      466 |
      467 |   it('#167 R10: el éxito conserva la cabecera del formulario', async () => {

      at Object.toBe (src/screens/reset-password/index.test.tsx:464:84)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
exit=1
```

#### S13 — restore

```bash
git checkout HEAD -- src/screens/reset-password/index.tsx; git diff --quiet HEAD -- src/screens/reset-password/index.tsx; echo "exit=$?"
```

```text
exit=0
exit=0
```

#### c29 — jest

```bash
bunx jest --testTimeout=30000 --runTestsByPath src/screens/forgot/index.test.tsx src/__tests__/consistency-classnames.test.ts
```

```text
FAIL src/__tests__/consistency-classnames.test.ts
FAIL src/screens/forgot/index.test.tsx (12.385 s)
Test Suites: 2 failed, 2 total
Tests:       9 failed, 98 passed, 107 total
Time:        13.475 s
  ● #62 R4: la app solo usa los radios de la escala declarada › lleva los tres tiles restantes a rounded-xl

    expect(received).toContain(expected) // indexOf

    Expected substring: "size-13 items-center justify-center rounded-xl border-b-4 border-black/25 bg-accent"
    Received string:    "import { Image } from 'expo-image';
    import { HeaderHeightContext } from 'expo-router/react-navigation';
    import { router } from 'expo-router';
    import { Button, Input, Label, LinkButton, TextField } from 'heroui-native';
    import { useContext, useState } from 'react';
    import { KeyboardAvoidingView, ScrollView, Text, View } from 'react-native';
    import { useSafeAreaInsets } from 'react-native-safe-area-context';
    import { Lock } from 'reicon-react-native';·
    import { forgotPassword } from '../../api/auth';
    import { BackButton } from '../../components/back-button';
    import { PopIn } from '../../components/pop-in';
    import { PingoFloat } from '../../components/pingo-float';
    import { FormError } from '../../components/form-error';
    import { useTranslate } from '../../providers/language-provider';
    import { CONTINUOUS_CORNER } from '../../theme/native
  ● #62 R13: el color imperativo sale siempre de useThemeColors del repo › resuelve el Lock de Forgot con accent-foreground

    expect(received).toContain(expected) // indexOf

    Expected substring: "const [accentForeground] = useThemeColors(['accent-foreground']);"
    Received string:    "import { Image } from 'expo-image';
    import { HeaderHeightContext } from 'expo-router/react-navigation';
    import { router } from 'expo-router';
    import { Button, Input, Label, LinkButton, TextField } from 'heroui-native';
    import { useContext, useState } from 'react';
    import { KeyboardAvoidingView, ScrollView, Text, View } from 'react-native';
    import { useSafeAreaInsets } from 'react-native-safe-area-context';
    import { Lock } from 'reicon-react-native';·
    import { forgotPassword } from '../../api/auth';
    import { BackButton } from '../../components/back-button';
    import { PopIn } from '../../components/pop-in';
    import { PingoFloat } from '../../components/pingo-float';
    import { FormError } from '../../components/form-error';
    import { useTranslate } from '../../providers/language-provider';
    import { CONTINUOUS_CORNER } from '../../theme/native-s
  ● #98 R10: los candados que esta feature no mueve › deja CONTINUOUS_CORNER, bg-accent-soft y el acento donde estaban

    expect(received).toBe(expected) // Object.is equality

    Expected: 17
    Received: 18

      399 |     expect(count(/style=\{CONTINUOUS_CORNER\}/g)).toBe(31 + 1 + 4 + 1); // #41 R9: geofences-link; #168; #170 R8: alert-detail-map
      400 |     expect(count(/rounded-xl bg-accent(?=[\s'"`])/g)).toBe(13 + 1 + 1 + 1 + 1 + 1 + 1); // #146 R8, #146 R9; #118 R7; #155 R3 // #158 R3: docs-upload; // #158 R5: docs-upload-submit
    > 401 |     expect(count(/bg-accent-soft/g)).toBe(16 + 2 + 1 - 1 - 1); // #147 R4: meal-time-edit y add-meal-time-button; #105 R11; #168 R5: PetPills pasa a huecos pastel; #172 R14: forgot-lock-tile pasa a bg-accent
          |                                      ^
      402 |     expect(home.match(/text-accent-strong\b/g)).toHaveLength(2);
      403 |     expect(food.match(/text-accent-strong\b/g)).toHaveLength(1);
      404 |     expect(filesMatching(/\brounded-(?:2xl|lg|md|sm)\b/)).toEqual([]);

      at Object.toBe (src/__tests__/consistency-classnames.test.ts:401:38)
  ● #64 R9: el color categórico solo se nombra en el módulo de paleta › conserva los usos de bg-accent-soft que sí son acento

    expect(received).toBe(expected) // Object.is equality

    Expected: 17
    Received: 18

      465 |     const docs = readSource(join('screens', 'docs', 'index.tsx'));
      466 |
    > 467 |     expect(accentSoftCount).toBe(16 + 2 + 1 - 1 - 1); // #147 R4, #105 R11; #168 R5: PetPills pasa a huecos pastel; #172 R14: forgot-lock-tile pasa a bg-accent
          |                             ^
      468 |     expect(reminders.match(/bg-accent-soft/g)).toHaveLength(1);
      469 |     expect(docs.match(/bg-accent-soft/g)).toBeNull();
      470 |   });

      at Object.toBe (src/__tests__/consistency-classnames.test.ts:467:29)
  ● #166 R2: todo primario sólido lleva el labio detrás de bg-accent › no deja la receta del labio fuera de un primario salvo el candado de Recuperar

    expect(received).toBe(expected) // Object.is equality

    Expected: 20
    Received: 19

      575 |     );
      576 |
    > 577 |     expect(count(/\bborder-b-4\b/g)).toBe(19 + 1); // #172 R14: forgot-lock-tile (Enmienda #172)
          |                                      ^
      578 |     expect(count(/border-black\/25/g)).toBe(19 + 1); // #172 R14: forgot-lock-tile (Enmienda #172)
      579 |   });
      580 | });

      at Object.toBe (src/__tests__/consistency-classnames.test.ts:577:38)

FAIL src/screens/forgot/index.test.tsx (12.385 s)
  ● #117 R5: enviar pasa la pantalla a «Revisa tu correo» › el tile Lock sigue en pie en los dos estados

    expect(received).toBeDefined()

    Received: undefined

      283 |     expect(before.filter((c) => typeof c !== 'string').find(
      284 |       (c) => (c as { props: { className?: string } }).props.className === 'size-13 items-center justify-center rounded-xl border-b-4 border-black/25 bg-accent',
    > 285 |     )).toBeDefined();
          |        ^
      286 |     await submitForgot();
      287 |     expect(await screen.findByText('Revisa tu correo')).toBeVisible();
      288 |     const after = (screen.getByTestId('forgot-title').parent?.children ?? []) as unknown[];

      at Object.toBeDefined (src/screens/forgot/index.test.tsx:285:8)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
  ● #167 R9: Pingo y pop del candado en recuperar › #167 R9: el tile entra con pop en el formulario

    expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 1

      Object {
        "forgot-lock-tile": Object {
    -     "className": "size-13 items-center justify-center rounded-xl border-b-4 border-black/25 bg-accent",
    +     "className": "size-16 items-center justify-center rounded-xl bg-accent-soft",
          "style": Object {
            "borderCurve": "continuous",
          },
        },
      }

      575 |     expect(Object.fromEntries(mockPopIn.mock.calls.map(([p]) => [
      576 |       p.testID, { className: p.className, style: p.style },
    > 577 |     ]))).toEqual({
          |          ^
      578 |       'forgot-lock-tile': {
      579 |         className: 'size-13 items-center justify-center rounded-xl border-b-4 border-black/25 bg-accent',
      580 |         style: { borderCurve: 'continuous' },

      at Object.toEqual (src/screens/forgot/index.test.tsx:577:10)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.j
  ● #167 R9: Pingo y pop del candado en recuperar › #167 R9: el tile entra con pop tras enviar

    expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 1

      Object {
        "forgot-lock-tile": Object {
    -     "className": "size-13 items-center justify-center rounded-xl border-b-4 border-black/25 bg-accent",
    +     "className": "size-16 items-center justify-center rounded-xl bg-accent-soft",
          "style": Object {
            "borderCurve": "continuous",
          },
        },
      }

      590 |     expect(Object.fromEntries(mockPopIn.mock.calls.map(([p]) => [
      591 |       p.testID, { className: p.className, style: p.style },
    > 592 |     ]))).toEqual({
          |          ^
      593 |       'forgot-lock-tile': {
      594 |         className: 'size-13 items-center justify-center rounded-xl border-b-4 border-black/25 bg-accent',
      595 |         style: { borderCurve: 'continuous' },

      at Object.toEqual (src/screens/forgot/index.test.tsx:592:10)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:
  ● #172 R14: el candado es un tile acento con labio y Lock de 26

    expect(received).toBe(expected) // Object.is equality

    Expected: "size-13 items-center justify-center rounded-xl border-b-4 border-black/25 bg-accent"
    Received: "size-16 items-center justify-center rounded-xl bg-accent-soft"

      654 |   function expectTile() {
      655 |     const tile = screen.getByTestId('forgot-lock-tile');
    > 656 |     expect(tile.props.className).toBe('size-13 items-center justify-center rounded-xl border-b-4 border-black/25 bg-accent');
          |                                  ^
      657 |     const icon = screen.getByTestId('icon-lock');
      658 |     expect(tile.children).toEqual([icon]);
      659 |     expect(icon.props.size).toBe(26);

      at toBe (src/screens/forgot/index.test.tsx:656:34)
      at Object.expectTile (src/screens/forgot/index.test.tsx:662:3)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
exit=1
```

#### c30 — jest

```bash
bunx jest --testTimeout=30000 --runTestsByPath src/screens/forgot/index.test.tsx src/__tests__/consistency-classnames.test.ts src/__tests__/ui-language.test.ts src/__tests__/design-drift.test.ts src/__tests__/legibility-classnames.test.ts
```

```text
PASS src/__tests__/consistency-classnames.test.ts
PASS src/__tests__/design-drift.test.ts
PASS src/__tests__/ui-language.test.ts (5.192 s)
PASS src/__tests__/legibility-classnames.test.ts
PASS src/screens/forgot/index.test.tsx (12.475 s)
Test Suites: 5 passed, 5 total
Tests:       234 passed, 234 total
Time:        13.916 s
exit=0
```

#### c30 — router

```bash
test ! -e .expo/types/router.d.ts
```

```text

exit=0
```

#### c30 — typecheck

```bash
bun run typecheck
```

```text
$ tsc --noEmit
exit=0
```

#### c30 — lint

```bash
bunx expo lint --no-cache > /tmp/lint-172.log 2>&1
```

```text

vacio=0
exit=0
```

#### S14 — jest (bloques y resumen íntegros)

```bash
bunx jest --testTimeout=30000 --runTestsByPath src/screens/forgot/index.test.tsx src/__tests__/consistency-classnames.test.ts
```

```text
FAIL src/__tests__/consistency-classnames.test.ts
FAIL src/screens/forgot/index.test.tsx (9.195 s)
Test Suites: 2 failed, 2 total
Tests:       6 failed, 101 passed, 107 total
Time:        10.217 s, estimated 13 s
  ● #98 R10: los candados que esta feature no mueve › deja CONTINUOUS_CORNER, bg-accent-soft y el acento donde estaban

    expect(received).toBe(expected) // Object.is equality

    Expected: 17
    Received: 18

      399 |     expect(count(/style=\{CONTINUOUS_CORNER\}/g)).toBe(31 + 1 + 4 + 1); // #41 R9: geofences-link; #168; #170 R8: alert-detail-map
      400 |     expect(count(/rounded-xl bg-accent(?=[\s'"`])/g)).toBe(13 + 1 + 1 + 1 + 1 + 1 + 1); // #146 R8, #146 R9; #118 R7; #155 R3 // #158 R3: docs-upload; // #158 R5: docs-upload-submit
    > 401 |     expect(count(/bg-accent-soft/g)).toBe(16 + 2 + 1 - 1 - 1); // #147 R4: meal-time-edit y add-meal-time-button; #105 R11; #168 R5: PetPills pasa a huecos pastel; #172 R14: forgot-lock-tile pasa a bg-accent
          |                                      ^
      402 |     expect(home.match(/text-accent-strong\b/g)).toHaveLength(2);
      403 |     expect(food.match(/text-accent-strong\b/g)).toHaveLength(1);
      404 |     expect(filesMatching(/\brounded-(?:2xl|lg|md|sm)\b/)).toEqual([]);

      at Object.toBe (src/__tests__/consistency-classnames.test.ts:401:38)
  ● #64 R9: el color categórico solo se nombra en el módulo de paleta › conserva los usos de bg-accent-soft que sí son acento

    expect(received).toBe(expected) // Object.is equality

    Expected: 17
    Received: 18

      465 |     const docs = readSource(join('screens', 'docs', 'index.tsx'));
      466 |
    > 467 |     expect(accentSoftCount).toBe(16 + 2 + 1 - 1 - 1); // #147 R4, #105 R11; #168 R5: PetPills pasa a huecos pastel; #172 R14: forgot-lock-tile pasa a bg-accent
          |                             ^
      468 |     expect(reminders.match(/bg-accent-soft/g)).toHaveLength(1);
      469 |     expect(docs.match(/bg-accent-soft/g)).toBeNull();
      470 |   });

      at Object.toBe (src/__tests__/consistency-classnames.test.ts:467:29)

FAIL src/screens/forgot/index.test.tsx (9.195 s)
  ● #117 R5: enviar pasa la pantalla a «Revisa tu correo» › el tile Lock sigue en pie en los dos estados

    expect(received).toBeDefined()

    Received: undefined

      283 |     expect(before.filter((c) => typeof c !== 'string').find(
      284 |       (c) => (c as { props: { className?: string } }).props.className === 'size-13 items-center justify-center rounded-xl border-b-4 border-black/25 bg-accent',
    > 285 |     )).toBeDefined();
          |        ^
      286 |     await submitForgot();
      287 |     expect(await screen.findByText('Revisa tu correo')).toBeVisible();
      288 |     const after = (screen.getByTestId('forgot-title').parent?.children ?? []) as unknown[];

      at Object.toBeDefined (src/screens/forgot/index.test.tsx:285:8)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
  ● #167 R9: Pingo y pop del candado en recuperar › #167 R9: el tile entra con pop en el formulario

    expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 1

      Object {
        "forgot-lock-tile": Object {
    -     "className": "size-13 items-center justify-center rounded-xl border-b-4 border-black/25 bg-accent",
    +     "className": "size-13 items-center justify-center rounded-xl border-b-4 border-black/25 bg-accent-soft",
          "style": Object {
            "borderCurve": "continuous",
          },
        },
      }

      575 |     expect(Object.fromEntries(mockPopIn.mock.calls.map(([p]) => [
      576 |       p.testID, { className: p.className, style: p.style },
    > 577 |     ]))).toEqual({
          |          ^
      578 |       'forgot-lock-tile': {
      579 |         className: 'size-13 items-center justify-center rounded-xl border-b-4 border-black/25 bg-accent',
      580 |         style: { borderCurve: 'continuous' },

      at Object.toEqual (src/screens/forgot/index.test.tsx:577:10)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
  ● #167 R9: Pingo y pop del candado en recuperar › #167 R9: el tile entra con pop tras enviar

    expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 1

      Object {
        "forgot-lock-tile": Object {
    -     "className": "size-13 items-center justify-center rounded-xl border-b-4 border-black/25 bg-accent",
    +     "className": "size-13 items-center justify-center rounded-xl border-b-4 border-black/25 bg-accent-soft",
          "style": Object {
            "borderCurve": "continuous",
          },
        },
      }

      590 |     expect(Object.fromEntries(mockPopIn.mock.calls.map(([p]) => [
      591 |       p.testID, { className: p.className, style: p.style },
    > 592 |     ]))).toEqual({
          |          ^
      593 |       'forgot-lock-tile': {
      594 |         className: 'size-13 items-center justify-center rounded-xl border-b-4 border-black/25 bg-accent',
      595 |         style: { borderCurve: 'continuous' },

      at Object.toEqual (src/screens/forgot/index.test.tsx:592:10)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
  ● #172 R14: el candado es un tile acento con labio y Lock de 26

    expect(received).toBe(expected) // Object.is equality

    Expected: "size-13 items-center justify-center rounded-xl border-b-4 border-black/25 bg-accent"
    Received: "size-13 items-center justify-center rounded-xl border-b-4 border-black/25 bg-accent-soft"

      654 |   function expectTile() {
      655 |     const tile = screen.getByTestId('forgot-lock-tile');
    > 656 |     expect(tile.props.className).toBe('size-13 items-center justify-center rounded-xl border-b-4 border-black/25 bg-accent');
          |                                  ^
      657 |     const icon = screen.getByTestId('icon-lock');
      658 |     expect(tile.children).toEqual([icon]);
      659 |     expect(icon.props.size).toBe(26);

      at toBe (src/screens/forgot/index.test.tsx:656:34)
      at Object.expectTile (src/screens/forgot/index.test.tsx:662:3)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
exit=1
```

#### S14 — restore

```bash
git checkout HEAD -- src/screens/forgot/index.tsx; git diff --quiet HEAD -- src/screens/forgot/index.tsx; echo "exit=$?"
```

```text
exit=0
exit=0
```

### Anclas ejecutadas en Reanudacion 2

```text
c24: register-names-row=1; register-contact-row=1; ficheros de producción con flex-2=1
c26: const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; =1
c26: t('forgot.invalidEmail')=1
c28: accessibilityLiveRegion="polite"=1
c30: B7=17; B8=20,20; B9=37
c30: tile nuevo en forgot/index.tsx=1; forgot/index.test.tsx=5; consistency-classnames.test.ts=1
c30: tile viejo en forgot/index.test.tsx=0; consistency-classnames.test.ts=0
c30: LOCK_TILE_CLASS en forgot/index.test.tsx=0
```

No se ejecutaron las anclas de T22 ni su gate final. El último gate completo
alcanzado es c30: 5 suites y 234 tests verdes, typecheck `exit=0`, lint
`exit=0` con `vacio=0`.

### Desviaciones y entrega de Reanudacion 2

1. S14 da 6 fallos en vez de 7 por una búsqueda de subcadena que también
   acepta bg-accent-soft. Se detuvo el guion conforme a la regla crítica 3,
   sin continuar T16 ni modificar los candados para forzar el resultado.
2. La trazabilidad se actualiza hasta c30, conservando los pendientes. Los
   mensajes de cierre completo no se usan mientras la feature esté bloqueada.
3. No hubo nuevas instalaciones, Exceeded timeout, SIGKILL, alteración de
   dependencias ni cambios en firmas o commits del leader. No se ejecutaron
   init.sh, push, PR, amend, rebase ni prettier.
4. Las mutaciones de esta reanudación están restauradas. El árbol queda
   limpio tras los commits de documentación del bloqueo; la prueba de humo
   de Android sigue pendiente (humano).


### Commit de trazabilidad del bloqueo

`ca0049df docs(mobile-account-screens-polish): #172 trazabilidad parcial hasta c30`.
El informe se cierra en un commit separado con `git commit --only` sobre
este mismo fichero. Ambos son documentación del bloqueo, no el cierre
completo de T22.


## Reanudacion 3

Inicio: 2026-10-14, HEAD del leader `8b53e55867a941cc6c8af6278a3734997703deaf`.
H0 sigue siendo `e0178ab5c1f67e917cf4116332a0e9196d67b344`.

```text
command grep -c -F -- '- [x] Enmienda E4 aprobada por humano' specs/mobile-account-screens-polish/requirements.md
1
git status --short
(sin salida)
git log -1 --format=%h -- mobile-pet-tracker
7ddda8f5
git branch --show-current
feature/172-mobile-account-screens-polish
```

**S14 conforme a E4.** La salida ya registrada, `Tests: 6 failed, 101 passed,
107 total`, contiene exactamente los seis títulos de T15 corregida: cuatro
de forgot y los dos recuentos de bg-accent-soft de consistency. Se conserva
su restauración con `exit=0`. No se repite S14 ni se cambia c29/c30.
Se continúa T16–T22 (c31–c39), sin renumerar.


### Estado al final de Reanudacion 3

S14 queda conforme a E4 y no se repitió. C31 se implementó en el commit
`0e5bb776 test(mobile): el error de login cuelga del scroll (R15)` (solo
el nuevo test, 9 líneas). Su gate verde dio 5 suites y 222 tests;
la guarda del router, typecheck y lint dieron exit=0, con lint vacío.
El fichero tiene los 25 bloques de it previstos (28 casos de Jest).

S15 dio un título adicional al compararla con T16. Se detuvo el guion
inmediatamente y se restauró el fichero con exit=0. No se empezó c32,
no se alcanzó T22, y la feature permanece incompleta. No se ajustó el
candado de R7 ni la tabla para forzar dos fallos.

### Bloqueo de T16/S15 — historia (resuelto por E5)

Commit sobre el que se plantó la sonda: `0e5bb776` (c31). Mutación exacta:
se quitó el siguiente bloque de login-body y se colocó inmediatamente
tras `</ScrollView>`, dentro de screen-login:

```tsx
          {error ? (
            <FormError testID="login-error" message={error} />
          ) : null}
```

T16 espera dos fallos: R15 por consulta dentro de login-form y R7 «con
error» por aserción de orden. Salieron esos dos y un tercero: R7 «el cuerpo
lleva correo, contraseña, olvido, envío y registro» también consulta
login-error dentro de login-body después de enviar credenciales malas.

Esa consulta ya está en H0 (`git show e0178ab5:mobile-pet-tracker/src/screens/login/index.test.tsx`),
en el it que entonces se llamaba `#167 R6: el cuerpo lleva el formulario
en el orden de siempre`. T8 cambió su título y el orden, conservando la
comprobación existente. Por eso la sonda también pone rojo ese it.

| Bloque ●, sin Console | Tipo y mensaje | Contraste con T16 |
|---|---|---|
| #172 R7: el cuerpo lleva correo, contraseña, olvido, envío y registro | consulta: Unable to find an element with testID: login-error | adicional, no listado |
| #172 R7: con error, el error va entre el olvido y el envío | aserción toEqual: falta login-error en el orden de login-body | esperado |
| #172 R15: el error cuelga del scroll y no del contenedor del teclado | consulta: Unable to find an element with testID: login-error | esperado |

Hace falta reconciliar la tabla de S15 con esta comprobación existente
antes de continuar. Tests, producción y spec quedan sin ajustes para
cuadrar el resultado.

### Gates y sonda — salida literal

Se preservan los comandos, bloques de fallo íntegros y resúmenes. Solo se
omiten avisos Console y códigos ANSI de color.


#### c31 — jest

```bash
bunx jest --testTimeout=30000 --runTestsByPath src/screens/login/index.test.tsx src/__tests__/ui-language.test.ts src/__tests__/design-drift.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/legibility-classnames.test.ts
```

```text
PASS src/__tests__/consistency-classnames.test.ts
PASS src/__tests__/ui-language.test.ts (5.34 s)
PASS src/__tests__/design-drift.test.ts
PASS src/__tests__/legibility-classnames.test.ts
PASS src/screens/login/index.test.tsx (16.036 s)
Test Suites: 5 passed, 5 total
Tests:       222 passed, 222 total
Time:        17.377 s
exit=0
```

#### c31 — router

```bash
test ! -e .expo/types/router.d.ts
```

```text

exit=0
```

#### c31 — typecheck

```bash
bun run typecheck
```

```text
$ tsc --noEmit
exit=0
```

#### c31 — lint

```bash
bunx expo lint --no-cache > /tmp/lint-172.log 2>&1
```

```text

vacio=0
exit=0
```

#### S15 — jest

```bash
bunx jest --testTimeout=30000 --runTestsByPath src/screens/login/index.test.tsx
```

```text
FAIL src/screens/login/index.test.tsx (11.135 s)
Test Suites: 1 failed, 1 total
Tests:       3 failed, 25 passed, 28 total
Time:        11.324 s, estimated 17 s
  ● #167 R6: Pingo saluda en login y la pantalla entra en dos tiempos › #172 R7: el cuerpo lleva correo, contraseña, olvido, envío y registro

    Unable to find an element with testID: login-error

    <RNCSafeAreaProvider>
      <View
        testID="screen-login"
      >
        <RCTScrollView
          testID="login-form"
        >
          <View>
            <View
              testID="login-header"
            >
              <View
                accessibilityLabel="Volver"
                accessibilityRole="button"
                accessible={true}
                testID="login-back"
              >
                <RNSVGSvgView>
                  <RNSVGGroup>
                    <RNSVGGroup>
                      <RNSVGPath />
                    </RNSVGGroup>
                  </RNSVGGroup>
                </RNSVGSvgView>
              </View>
              <View
                testID="login-greeting"
              >
                <ViewManagerAdapter_ExpoImage
                  placeholder={[]}
                  testID="login-pingo"
                />
                <View
                  testID="login-bubble"
                >
                  <Text
                    testID="login-bubble-text"
                  >
                    Qué bueno verte de nuevo.
                  </Text>
                </View>
              </View>
              <Text>
                Iniciar sesión
              </Text>
            </View>
            <View
              testID="login-body"
            >
              <View>
                <View
                  accessible={true}
                >
                  <Text>
                    Correo electrónico
                  </Text>
                </View>
                <TextInput
                  editable={true}
                  testID="login-email"
                  value="alex@example.com"
                />
              </View>
              <View>
                <View
                  accessible={true}
                >
                  <Text>
                    Contraseña
                  </Text>
                </View>
                <View
                  testID="login-password-group"
                >
                  <TextInput
                    editable={true}
                    testID="login-password"
                    value="correct horse"
                  />
                  <View>
                    <View
                      accessibilityLabel="Mostrar contraseña"
                      accessibilityRole="button"
                      accessible={true}
                      testID="login-password-toggle"
                    >
                      <View
                        testID="icon-eye"
                      />
                    </View>
                  </View>
                </View>
              </View>
              <View
                accessibilityRole="button"
                accessibilityState={
                  {
                    "disabled": false,
                  }
                }
                accessible={true}
                testID="link-forgot"
              >
                <Text>
                  ¿Olvidaste tu contraseña?
                </Text>
              </View>
              <View
                accessibilityRole="button"
                accessibilityState={
                  {
                    "disabled": false,
                  }
                }
                accessible={true}
                testID="login-submit"
              >
                <View
                  pointerEvents="none"
                  style={
                    {
                      "opacity": 0,
                    }
                  }
                />
                <Text>
                  Iniciar sesión
                </Text>
              </View>
              <View
                accessibilityRole="button"
                accessibilityState={
                  {
                    "disabled": false,
                  }
                }
                accessible={true}
                testID="link-register"
              >
                <Text>
                  Crear cuenta
                </Text>
              </View>
            </View>
          </View>
        </RCTScrollView>
        <View
          testID="login-error-row"
        >
          <View
            testID="icon-alert-circle"
          />
          <Text
            testID="login-error"
          >
            Credenciales inválidas
          </Text>
        </View>
      </View>
    </RNCSafeAreaProvider>

      277 |     ]);
      278 |     await submit();
    > 279 |     expect(within(body).getByTestId('login-error')).toBeOnTheScreen();
          |                         ^
      280 |   });
      281 |
      282 |   it('#172 R7: con error, el error va entre el olvido y el envío', async () => {

      at Object.getByTestId (src/screens/login/index.test.tsx:279:25)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
  ● #167 R6: Pingo saluda en login y la pantalla entra en dos tiempos › #172 R7: con error, el error va entre el olvido y el envío

    expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 0

      Array [
        "login-email",
        "login-password",
        "link-forgot",
    -   "login-error",
        "login-submit",
        "link-register",
      ]

      286 |     const body = screen.getByTestId('login-body');
      287 |     expect(within(body).getAllByTestId(/^(login-email|login-password|login-error|login-submit|link-register|link-forgot)$/)
    > 288 |       .map((node) => node.props.testID)).toEqual([
          |                                          ^
      289 |       'login-email', 'login-password', 'link-forgot', 'login-error', 'login-submit', 'link-register',
      290 |     ]);
      291 |   });

      at Object.toEqual (src/screens/login/index.test.tsx:288:42)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
  ● #167 R6: Pingo saluda en login y la pantalla entra en dos tiempos › #172 R15: el error cuelga del scroll y no del contenedor del teclado

    Unable to find an element with testID: login-error

    <RNCSafeAreaProvider>
      <View
        testID="screen-login"
      >
        <RCTScrollView
          testID="login-form"
        >
          <View>
            <View
              testID="login-header"
            >
              <View
                accessibilityLabel="Volver"
                accessibilityRole="button"
                accessible={true}
                testID="login-back"
              >
                <RNSVGSvgView>
                  <RNSVGGroup>
                    <RNSVGGroup>
                      <RNSVGPath />
                    </RNSVGGroup>
                  </RNSVGGroup>
                </RNSVGSvgView>
              </View>
              <View
                testID="login-greeting"
              >
                <ViewManagerAdapter_ExpoImage
                  placeholder={[]}
                  testID="login-pingo"
                />
                <View
                  testID="login-bubble"
                >
                  <Text
                    testID="login-bubble-text"
                  >
                    Qué bueno verte de nuevo.
                  </Text>
                </View>
              </View>
              <Text>
                Iniciar sesión
              </Text>
            </View>
            <View
              testID="login-body"
            >
              <View>
                <View
                  accessible={true}
                >
                  <Text>
                    Correo electrónico
                  </Text>
                </View>
                <TextInput
                  editable={true}
                  testID="login-email"
                  value="alex@example.com"
                />
              </View>
              <View>
                <View
                  accessible={true}
                >
                  <Text>
                    Contraseña
                  </Text>
                </View>
                <View
                  testID="login-password-group"
                >
                  <TextInput
                    editable={true}
                    testID="login-password"
                    value="correct horse"
                  />
                  <View>
                    <View
                      accessibilityLabel="Mostrar contraseña"
                      accessibilityRole="button"
                      accessible={true}
                      testID="login-password-toggle"
                    >
                      <View
                        testID="icon-eye"
                      />
                    </View>
                  </View>
                </View>
              </View>
              <View
                accessibilityRole="button"
                accessibilityState={
                  {
                    "disabled": false,
                  }
                }
                accessible={true}
                testID="link-forgot"
              >
                <Text>
                  ¿Olvidaste tu contraseña?
                </Text>
              </View>
              <View
                accessibilityRole="button"
                accessibilityState={
                  {
                    "disabled": false,
                  }
                }
                accessible={true}
                testID="login-submit"
              >
                <View
                  pointerEvents="none"
                  style={
                    {
                      "opacity": 0,
                    }
                  }
                />
                <Text>
                  Iniciar sesión
                </Text>
              </View>
              <View
                accessibilityRole="button"
                accessibilityState={
                  {
                    "disabled": false,
                  }
                }
                accessible={true}
                testID="link-register"
              >
                <Text>
                  Crear cuenta
                </Text>
              </View>
            </View>
          </View>
        </RCTScrollView>
        <View
          testID="login-error-row"
        >
          <View
            testID="icon-alert-circle"
          />
          <Text
            testID="login-error"
          >
            Credenciales inválidas
          </Text>
        </View>
      </View>
    </RNCSafeAreaProvider>

      296 |     await submit();
      297 |     const form = screen.getByTestId('login-form');
    > 298 |     expect(within(form).getByTestId('login-error')).toBeOnTheScreen();
          |                         ^
      299 |     expect(screen.getByTestId('screen-login').children).toEqual([form]);
      300 |   });
      301 |

      at Object.getByTestId (src/screens/login/index.test.tsx:298:25)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
exit=1
```

#### S15 — restore

```bash
git checkout HEAD -- src/screens/login/index.tsx; git diff --quiet HEAD -- src/screens/login/index.tsx; echo "exit=$?"
```

```text
exit=0
exit=0
```

### Desviaciones y entrega

- S15 dio 3 fallos en vez de 2; se detuvo T16 conforme a la regla crítica
  3 del handoff y se verificó cada título antes de detenerse.
- El informe se marcó conforme a E4 antes de empezar c31, en el commit
  de documentación `5aa8fa5e docs(mobile-account-screens-polish): #172 S14 conforme a E4`.
  No se cuenta como commit numerado del guion, y no mezcla tests con producción.
- La trazabilidad parcial se actualizó en el commit separado
  `944b727a docs(mobile-account-screens-polish): #172 trazabilidad parcial hasta c31`.
  No se usan los mensajes de cierre completo mientras existan pendientes.
- Las skills ya cargadas siguen vigentes; no se repitió S14. H0 y los
  commits del leader siguen intactos. No hubo Exceeded timeout, SIGKILL,
  instalaciones nuevas ni cambios en dependencias.
- No se ejecutaron init.sh, push, PR, amend, rebase ni prettier. T22 y la
  prueba de humo R21 siguen pendientes. La sonda está restaurada y el
  árbol queda limpio tras el commit de este informe.


## Reanudacion 4

Inicio: 2026-10-14, HEAD del leader `8959232cbfb8ac689da789dc070965e5f056a45c`.
H0 sigue siendo `e0178ab5c1f67e917cf4116332a0e9196d67b344`.

```text
command grep -c -F -- '- [x] Enmienda E5 aprobada por humano' specs/mobile-account-screens-polish/requirements.md
1
git status --short
(sin salida)
git log -1 --format=%h -- mobile-pet-tracker
0e5bb776
git branch --show-current
feature/172-mobile-account-screens-polish
```

**S15 conforme a E5.** La salida ya registrada, `Tests: 3 failed, 25 passed,
28 total`, contiene los tres títulos de T16 corregida: R7 «el cuerpo lleva
correo…» (consulta), R7 «con error…» (aserción) y R15 (consulta). La sonda
quedó restaurada con exit=0 y no se repite. C31 se conserva.
Se continúa T17–T22 (c32–c39); S17b espera dos fallos según E5.


### Estado al final de Reanudacion 4

R1–R20 están implementados y verificados. T17–T22 se completaron, con
c32–c39 en su orden y sus mensajes literales. C32 y c33 nacieron verdes;
c34/c35, c36/c37 y c38/c39 mantuvieron rojo e implementación separados.
Cada rojo y cada sonda se contrastó con todos los títulos y tipos de su
fila antes de avanzar. S17b dio los dos fallos prescritos por E5.
S14 y S15 se aceptan con las salidas previas corregidas por E4/E5 y no se
repitieron. Todos los bloqueos anteriores quedan conservados como historia.

T22 quedó completo sobre `4ba7e139` (c39):

- 341 bloques de it, frente a 289 en H0: delta +52; todos los ficheros dan
  su cuenta final prescrita.
- 17 suites, `Tests: 470 passed, 470 total`: 409 de base +61.
- Lectores de la carta: 4 suites, `Tests: 192 passed, 192 total`.
- Guarda del router, typecheck y lint: exit=0; lint vacío.
- Todas las anclas finales coinciden con H0 + delta; fuente ExtraBold con
  el sha256 previsto, seis assets de fuente, un único InputGroup y un
  único fichero de producción con flex-2.
- Package.json, bun.lock, Card y Bienvenida conservados frente a H0;
  motion añade únicamente las dos constantes de Pingo y sus valores.
- Historial de c1–c39, c7b y el correctivo c7c verificado: 41 commits del
  guion, sin mezclar tests rojos con implementación. Firmas y enmiendas del
  leader conservadas y excluidas del conteo propio.

**R21 queda pendiente (humano)**. No se firma la prueba de humo ni se marca
la feature done: feature_list.json, progress/current.md, STATUS y el
frontmatter de la spec pertenecen al leader y no se modifican.
No se ejecutaron init.sh, push, PR, amend, rebase ni prettier.

### Contraste de rojos y sondas de Reanudacion 4

| Paso | Títulos y tipos contrastados | Resultado |
|---|---|---|
| S16a | normativa R1_AUTH, tabla completa y copy literal: uses 0 para common.back y es:common.back = Volver | 3/3 aserciones |
| S16b | normativa R1_AUTH y tabla completa: uses 0 para password-input | 2/2 aserciones |
| S17a | #167 R14 sin escapes: pingo-float en la lista de infracciones | 1/1 aserción |
| S17b | C8 clases entre corchetes y #167 R14 sin escapes: password-input en ambas listas | 2/2 aserciones, conforme a E5 |
| S17c | #149 R4 inventario a login: forgot 1 en vez de 2 | 1/1 aserción |
| c34 | #172 R18 encabezado de la enmienda: toContain | 1/1 aserción |
| S18a | #172 R18 casilla: toMatch | 1/1 aserción |
| S18b | #172 R18 constante de Pingo: toContain | 1/1 aserción |
| c36 | los 20 títulos de T20: login 3, register 3, forgot 2, reset 7, polish 1, legibility 1, ui-language 2, design-drift 1 | 20/20; 14 aserciones y 6 consultas |
| S19a | contenido de login y fuente polish, ambos por centrado vertical | 2/2 aserciones |
| S19b | espaciador de login: índice inmediatamente anterior a la CTA | 1/1 aserción |
| S19c | espaciador de recuperar: consulta forgot-spacer tras Revisa tu correo | 1/1 consulta |
| S19d | #167 R10 formulario entra en dos tiempos: className de reset-body | 1/1 aserción |
| S19e | enlace del formulario fuera del cuerpo; #167 R10 cabecera/cuerpo con tres hermanos | 2/2: consulta y aserción |
| S19f | padding/insets del registro: falta flexGrow | 1/1 aserción |
| S17d | enlace del formulario; polish de reset; legibility de reset; normativa R11_RESET; tabla completa; inventario de login | 6/6: 1 consulta y 5 aserciones |
| c38 | cuatro filas de CTA en polish y cuatro #127 R1 de clase exacta | 8/8 aserciones |
| S20a | fila forgot de R20 por altura de resend | 1/1 aserción |
| S20b | fila login de R20 por altura del correo | 1/1 aserción |
| S20c | #127 R1 reset-submit: size-lg en vez de size-md | 1/1 aserción |
| S20d | fila password-input de R20 y #172 R8 grupo 52/botón 44: falta h-13 | 2/2 aserciones |

Todas las sondas de esta tabla se restauraron con git checkout HEAD y se
comprobó el diff quiet con exit=0, antes de pasar a la siguiente.

### Gates y sondas — salidas literales de Reanudacion 4

Se reproducen los comandos, bloques de fallo completos, resúmenes y exits.
Se omiten únicamente los avisos Console y los códigos ANSI. En las anclas,
el exit=1 de un grep sin coincidencias acompaña el contador 0 esperado;
no representa un fallo del gate de Jest ni del chequeo de valores.


#### c32 — jest

```bash
bunx jest --testTimeout=30000 --runTestsByPath src/__tests__/ui-language.test.ts src/__tests__/design-drift.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/legibility-classnames.test.ts
```

```text
PASS src/__tests__/design-drift.test.ts
PASS src/__tests__/consistency-classnames.test.ts
PASS src/__tests__/legibility-classnames.test.ts
PASS src/__tests__/ui-language.test.ts (7.227 s)
Test Suites: 4 passed, 4 total
Tests:       194 passed, 194 total
Time:        8.341 s
exit=0
```

#### c32 — router

```bash
test ! -e .expo/types/router.d.ts
```

```text

exit=0
```

#### c32 — typecheck

```bash
bun run typecheck
```

```text
$ tsc --noEmit
exit=0
```

#### c32 — lint

```bash
bunx expo lint --no-cache > /tmp/lint-172.log 2>&1
```

```text
vacio=0
exit=0
```

#### S16a — jest

```bash
bunx jest --testTimeout=30000 --runTestsByPath src/__tests__/ui-language.test.ts
```

```text
FAIL src/__tests__/ui-language.test.ts
Test Suites: 1 failed, 1 total
Tests:       3 failed, 27 passed, 30 total
Time:        2.531 s, estimated 8 s
  ● #65 R1: el grupo (auth) resuelve su copy por clave › resuelve las 41 ocurrencias normativas

    expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 1

      Object {
        "file": "src/components/back-button.tsx",
        "key": "common.back",
    -   "uses": 1,
    +   "uses": 0,
      }

      60 |       (directCalls?.length ?? 0) + (keyedConstants?.length ?? 0);
      61 |
    > 62 |     expect({ file, key, uses: resolvedUses }).toEqual({
         |                                               ^
      63 |       file,
      64 |       key,
      65 |       uses: expected,

      at toEqual (src/__tests__/ui-language.test.ts:62:47)
      at Object.checkUses (src/__tests__/ui-language.test.ts:73:5)
  ● #65 R18: los sitios resuelven por clave y no queda copy suelta › resuelve cada ocurrencia de la tabla contra la clave exacta

    expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 1

      Object {
        "file": "src/components/back-button.tsx",
        "key": "common.back",
    -   "uses": 1,
    +   "uses": 0,
      }

      60 |       (directCalls?.length ?? 0) + (keyedConstants?.length ?? 0);
      61 |
    > 62 |     expect({ file, key, uses: resolvedUses }).toEqual({
         |                                               ^
      63 |       file,
      64 |       key,
      65 |       uses: expected,

      at toEqual (src/__tests__/ui-language.test.ts:62:47)
      at Object.checkUses (src/__tests__/ui-language.test.ts:492:5)
  ● #65 R18: los sitios resuelven por clave y no queda copy suelta › no deja ningún valor fijo del catálogo como literal entero en las pantallas

    expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 3

      Object {
        "file": "src/components/back-button.tsx",
    -   "looseCopy": Array [],
    +   "looseCopy": Array [
    +     "es:common.back = Volver",
    +   ],
      }

      509 |       ).map((entry) => `${entry.language}:${entry.key} = ${entry.value}`);
      510 |
    > 511 |       expect({ file, looseCopy }).toEqual({ file, looseCopy: [] });
          |                                   ^
      512 |     }
      513 |   });
      514 | });

      at toEqual (src/__tests__/ui-language.test.ts:511:35)
      at Object._loop (src/__tests__/ui-language.test.ts:505:36)
exit=1
```

#### S16a — restore

```bash
git checkout HEAD -- src/components/back-button.tsx; git diff --quiet HEAD -- src/components/back-button.tsx; echo "exit=$?"
```

```text
exit=0
exit=0
```

#### S16b — jest

```bash
bunx jest --testTimeout=30000 --runTestsByPath src/__tests__/ui-language.test.ts
```

```text
FAIL src/__tests__/ui-language.test.ts
Test Suites: 1 failed, 1 total
Tests:       2 failed, 28 passed, 30 total
Time:        2.014 s, estimated 3 s
  ● #65 R1: el grupo (auth) resuelve su copy por clave › resuelve las 41 ocurrencias normativas

    expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 1

      Object {
        "file": "src/components/password-input.tsx",
        "key": "common.showPassword",
    -   "uses": 1,
    +   "uses": 0,
      }

      60 |       (directCalls?.length ?? 0) + (keyedConstants?.length ?? 0);
      61 |
    > 62 |     expect({ file, key, uses: resolvedUses }).toEqual({
         |                                               ^
      63 |       file,
      64 |       key,
      65 |       uses: expected,

      at toEqual (src/__tests__/ui-language.test.ts:62:47)
      at Object.checkUses (src/__tests__/ui-language.test.ts:73:5)
  ● #65 R18: los sitios resuelven por clave y no queda copy suelta › resuelve cada ocurrencia de la tabla contra la clave exacta

    expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 1

      Object {
        "file": "src/components/password-input.tsx",
        "key": "common.showPassword",
    -   "uses": 1,
    +   "uses": 0,
      }

      60 |       (directCalls?.length ?? 0) + (keyedConstants?.length ?? 0);
      61 |
    > 62 |     expect({ file, key, uses: resolvedUses }).toEqual({
         |                                               ^
      63 |       file,
      64 |       key,
      65 |       uses: expected,

      at toEqual (src/__tests__/ui-language.test.ts:62:47)
      at Object.checkUses (src/__tests__/ui-language.test.ts:492:5)
exit=1
```

#### S16b — restore

```bash
git checkout HEAD -- src/components/password-input.tsx; git diff --quiet HEAD -- src/components/password-input.tsx; echo "exit=$?"
```

```text
exit=0
exit=0
```

#### c33 — jest

```bash
bunx jest --testTimeout=30000 --runTestsByPath src/__tests__/design-drift.test.ts src/__tests__/ui-language.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/legibility-classnames.test.ts
```

```text
PASS src/__tests__/consistency-classnames.test.ts
PASS src/__tests__/legibility-classnames.test.ts
PASS src/__tests__/design-drift.test.ts
PASS src/__tests__/ui-language.test.ts
Test Suites: 4 passed, 4 total
Tests:       194 passed, 194 total
Time:        3.638 s, estimated 5 s
exit=0
```

#### c33 — router

```bash
test ! -e .expo/types/router.d.ts
```

```text

exit=0
```

#### c33 — typecheck

```bash
bun run typecheck
```

```text
$ tsc --noEmit
exit=0
```

#### c33 — lint

```bash
bunx expo lint --no-cache > /tmp/lint-172.log 2>&1
```

```text
vacio=0
exit=0
```

#### S17a — jest

```bash
bunx jest --testTimeout=30000 --runTestsByPath src/__tests__/design-drift.test.ts
```

```text
FAIL src/__tests__/design-drift.test.ts
Test Suites: 1 failed, 1 total
Tests:       1 failed, 69 passed, 70 total
Time:        1.532 s, estimated 3 s
  ● #167 R14: las pantallas de cuenta no traen deriva › #167 R14: sin hex, clases arbitrarias, StyleSheet ni sombras sueltas

    expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 3

    - Array []
    + Array [
    +   "components/pingo-float.tsx",
    + ]

      837 |     expect(featureFiles.filter((file) =>
      838 |       MEALS_BAR_STYLE_ESCAPES.test(readFileSync(join(sourceRoot, file), 'utf8')),
    > 839 |     )).toEqual([]);
          |        ^
      840 |   });
      841 |
      842 |   it('#167 R14: sin radios fuera de la escala', () => {

      at Object.toEqual (src/__tests__/design-drift.test.ts:839:8)
exit=1
```

#### S17a — restore

```bash
git checkout HEAD -- src/components/pingo-float.tsx; git diff --quiet HEAD -- src/components/pingo-float.tsx; echo "exit=$?"
```

```text
exit=0
exit=0
```

#### S17b — jest

```bash
bunx jest --testTimeout=30000 --runTestsByPath src/__tests__/design-drift.test.ts
```

```text
FAIL src/__tests__/design-drift.test.ts
Test Suites: 1 failed, 1 total
Tests:       2 failed, 68 passed, 70 total
Time:        1.376 s, estimated 2 s
  ● C8: la UI no usa clases arbitrarias › no deja ninguna clase Tailwind con valores entre corchetes

    expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 3

    - Array []
    + Array [
    +   "components/password-input.tsx",
    + ]

      77 | describe('C8: la UI no usa clases arbitrarias', () => {
      78 |   it('no deja ninguna clase Tailwind con valores entre corchetes', () => {
    > 79 |     expect(filesMatching(/[A-Za-z0-9_-]+-\[[^\]]+\]/)).toEqual([]);
         |                                                        ^
      80 |   });
      81 | });
      82 |

      at Object.toEqual (src/__tests__/design-drift.test.ts:79:56)
  ● #167 R14: las pantallas de cuenta no traen deriva › #167 R14: sin hex, clases arbitrarias, StyleSheet ni sombras sueltas

    expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 3

    - Array []
    + Array [
    +   "components/password-input.tsx",
    + ]

      837 |     expect(featureFiles.filter((file) =>
      838 |       MEALS_BAR_STYLE_ESCAPES.test(readFileSync(join(sourceRoot, file), 'utf8')),
    > 839 |     )).toEqual([]);
          |        ^
      840 |   });
      841 |
      842 |   it('#167 R14: sin radios fuera de la escala', () => {

      at Object.toEqual (src/__tests__/design-drift.test.ts:839:8)
exit=1
```

#### S17b — restore

```bash
git checkout HEAD -- src/components/password-input.tsx; git diff --quiet HEAD -- src/components/password-input.tsx; echo "exit=$?"
```

```text
exit=0
exit=0
```

#### S17c — jest

```bash
bunx jest --testTimeout=30000 --runTestsByPath src/__tests__/design-drift.test.ts
```

```text
FAIL src/__tests__/design-drift.test.ts
Test Suites: 1 failed, 1 total
Tests:       1 failed, 69 passed, 70 total
Time:        1.426 s, estimated 2 s
  ● #149 R4: solo cuatro ficheros de producción navegan a login › #149 R4: inventaría cada ruta a login en producción

    expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 1

      Object {
    -   "screens/forgot/index.tsx": 2,
    +   "screens/forgot/index.tsx": 1,
        "screens/register/index.tsx": 1,
        "screens/reset-password/index.tsx": 2,
        "screens/welcome/index.tsx": 1,
      }

      735 |     );
      736 |
    > 737 |     expect(actual).toEqual(loginRoutes);
          |                    ^
      738 |   });
      739 | });
      740 |

      at Object.toEqual (src/__tests__/design-drift.test.ts:737:20)
exit=1
```

#### S17c — restore

```bash
git checkout HEAD -- src/screens/forgot/index.tsx; git diff --quiet HEAD -- src/screens/forgot/index.tsx; echo "exit=$?"
```

```text
exit=0
exit=0
```

#### c34 — jest

```bash
bunx jest --testTimeout=30000 --runTestsByPath src/__tests__/account-screens-polish.test.ts
```

```text
FAIL src/__tests__/account-screens-polish.test.ts
Test Suites: 1 failed, 1 total
Tests:       1 failed, 6 passed, 7 total
Time:        1.866 s, estimated 2 s
  ● #172 R18: la carta declara la enmienda #172 y su casilla

    expect(received).toContain(expected) // indexOf

    Expected substring: "## Enmienda #172 — Las pantallas de cuenta como el canvas"
    Received string:    "# Carta de UI — mobile-pet-tracker·
    > Fuente de verdad de UI/UX móvil para TODOS los agentes (Claude, subagentes,
    > Codex CLI). Toda spec, implementación y review de trabajo móvil se valida
    > contra este documento. Complementa `docs/conventions.md` §Convenciones de
    > la app móvil; ante conflicto, gana el más específico.·
    ## Skills: quién carga qué·
    Las guías genéricas viven en las skills oficiales de Expo — instaladas en
    Claude Code (plugin `expo`) y en Codex CLI (`codex plugin add
    expo@openai-curated`, mismo contenido v1.12+). Este doc NO las duplica:
    fija las decisiones ya tomadas en ESTE repo.·
    | Tarea móvil | Skill a cargar antes de trabajar |
    |---|---|
    | Cualquiera (routing/entrada) | `expo-overview` → deriva a la específica |
    | Tokens, tema, componentes reusables | `expo-design-system` |
    | Estilo nativo, safe areas, HIG | `expo-native-ui` |
    | Sheets, pickers, menus, toggles | `expo-ui` |
    | Animaciones, gestos, haptics | `expo-animation` (en Claude: `animate-expo`) |
    | Tailwind/uniwind | `expo-tailwind-setup` |
    | Diseñar/mejorar una pantalla o flujo completo | `appllama-app-design-skill` (obligatoria, ver abajo) |·
    Subagentes y handoffs a Codex deben instruir explícitamente la carga de la
    skill pertinente (regla ya en memoria de sesión; aquí queda oficial).·
    ### `appllama-app-design-skill`: cuándo y con qué límites·
    Instalada en `.agents/skills/` (universal: Claude Code y Codex CLI la ven).
    Se carga en **toda** tarea de UI móvil — pantalla nueva, rediseño, flujo,
    onboarding, estados vacíos, jerarquía visual, semántica de navegación
    (push vs replace, sheet vs modal, puertas de un solo sentido). Aporta el
    listón de \"se siente nativa\" y la disciplina anti-slop.·
    Tres límites, no negociables:·
    1. **La carta gana siempre sobre la skill.** La skill asume colores
       semánticos nativos (`Color.ios.label`) y su propio sistema de estilos;
       este repo usa Tailwind v4 + uniwind + heroui-native con tokens en
       `global.css` (§Decisiones fijas 1-3). De la skill se toma el **patrón**
       (esqueleto, jerarquía, motion, navegación), nunca el sistema de estilos.
       Cualquier sugerencia suya que meta hex, `StyleSheet.create` o clases
       arbitrarias se descarta: rompe el grep-clean.
    2. **Su \"simulator loop\" no aplica tal cual.** Pide iOS Simulator en macOS
       (`xcrun simctl io recordVideo`); aquí la verificación es la prueba de
       humo que corre el humano en Android (dev build o Expo Go según la
       feature). El checklist de la skill sirve como guion de esa prueba, no
       como comando a ejecutar.
    3. **`appllama-usage` sí está disponible, pero solo en Claude Code.** El
       MCP `mcp.appllama.io` se contrató el 2026-10-04 (plan Pro: 1500 créditos
       al mes, cada llamada gasta uno, `get_credits` es gratis) y la skill
       `appllama-usage` está instalada en Claude. La fase «estudiar 20-30
       pantallas reales antes de diseñar» la corre el **leader** antes de
       lanzar al `spec_author` y deja el resultado en
       `progress/explore_<tema>.md` con ids durables de app y pantalla (las URL
       de imagen caducan en una hora, así que nunca se enlazan). Del material se
       toma el patrón, no los píxeles; se ignora la marca de agua y no se barre
       el catálogo. **Codex no tiene el MCP** (mismo hueco que B5): el handoff
       le pasa el fichero de explore y la spec, nunca le pide que investigue.
       El primer explore de este tipo es `progress/explore_ui-appllama.md`
       (#115-#119).·
    ## Decisiones fijas de este repo (no re-litigar)·
    1. **Sistema de estilos**: Tailwind v4 + uniwind + heroui-native. Tokens en
       `mobile-pet-tracker/src/theme/global.css` — ÚNICA entrada. Prohibido
       crear un segundo sistema (theme.ts paralelo, StyleSheet.create,
       styled-components).
    2. **Tokens obligatorios**: todo valor visual repetido es un token en
       `@theme` de global.css. Existentes: colores semánticos light/dark,
       fuentes Inter, `--radius-card: 20px`, `--text-2xs: 10px`. Si un valor
       nuevo se repite 2+, se añade token — no clase arbitraria.
    3. **Grep-clean permanente** (criterio de aceptación de toda feature móvil):
       - cero hex fuera de `src/theme/`
       - cero clases arbitrarias `[...]` (`rounded-[20px]`, `text-[10px]`,
         `p-[13px]`...) — usar el token; si no existe, crearlo primero
       - cero `StyleSheet.create`, cero shadow/elevation legacy (solo `boxShadow`)
    4. **Componentes compartidos** (`src/components/`): `card.tsx`
       (surface|accent|secondary — usa `--radius-card`, NUNCA heredar `--radius`
       de heroui/shadcn, bug #46), `pet-switcher.tsx` (selector de mascota,
       siempre este), `floating-tab-bar.tsx`, `weight-chart.tsx`, `pet-map.tsx`
       (adapta el contrato del tab Map a la API nativa de `expo-maps`). Regla de
       extracción: ≥2 pantallas + rol nombrable + API menor que implementación.
       Promoción: inline → `src/screens/<x>/` → `src/components/`.
    5. **Base de componentes**: heroui-native (Button, Skeleton, TextField,
       Avatar, Chip...). `@expo/ui` para lo que heroui no cubre, PERO con esta
       distinción (aprendida por crash real en el smoke de #39, Android + Expo
       Go): **la capa root/universal de `@expo/ui` (SwiftUI/Jetpack) crashea en
       Expo Go Android**. El default se mantiene en la capa
       **`@expo/ui/community/*`** porque sus wrappers funcionan tanto en Expo Go
       como en dev builds:
       `community/bottom-sheet` (montado sobre @gorhom/bottom-sheet — esa dep es
       peer del wrapper, NO removerla), `community/datetime-picker`,
       `community/menu`, `community/picker`, `community/slider`,
       `community/segmented-control`. Adoptar la capa root de `@expo/ui`, aunque
       el smoke use dev build desde #54, requiere una feature separada; esta
       decisión no se cambia de paso. `List`+`ListItem` solo para filas agrupadas
       cortas estilo Settings — NO es virtualizada; listas de datos de longitud
       desconocida: FlatList/FlashList. Prohibido: importar @gorhom directamente
       (siempre vía el wrapper community), Reanimated para sheets,
       Picker/SafeAreaView/WebView de RN (removidos).
    6. **Dimensiones de pantalla**: conventions.md §Dimensiones — `paddingTop:
       insets.top + 12`, `padding: 24`, `gap: 16`, `paddingBottom: insets.bottom
       + 96` vía `useSafeAreaInsets` en `contentContainerStyle` (nunca en el
       ScrollView mismo). Overlays absolutos usan `insets.top + 12`, jamás
       top fijo. `contentInsetAdjustmentBehavior=\"automatic\"` NO sustituye el
       paddingTop (no-op en Android).
       **Excepción nombrada, enmienda A9 de #67**: si el primer hijo del scroll es
       una **cabecera a sangre**, el `contentContainerStyle` conserva `gap` y
       `paddingBottom`, el padding horizontal de 24 baja a un envoltorio interior,
       y el `paddingTop: insets.top + 12` lo asume la cabecera vía su slot. Las
       ramas de estado sin cabecera llevan su propio envoltorio con ese
       `paddingTop`.·
       **Excepción nombrada (enmienda A11 de #95, 2026-09-23)**: una pantalla empujada
       sobre el Stack raíz con cabecera nativa (`headerShown: true`) —hoy
       `add-reminder`, `pets/add`, `pets/[petId]/docs`, `weight-log`,
       `meal-schedule`, `pairing`, `reminders`, `alerts` (estas dos por la enmienda A13 de #114, 2026-09-23), `alerts/[alertId]` (por la enmienda A15 de #100, 2026-09-28), `pets/[petId]/geofences` (por la enmienda A18 de #41, 2026-10-02) y `pets/[petId]/geofence-editor` (por la enmienda A19 de #146, 2026-10-02) y `meals-history` (por la enmienda A20 de #105, 2026-10-04)— no lleva `paddingTop: insets.top + 12`, porque
       el inset superior lo consume la cabecera, ni `paddingBottom: insets.bottom +
       96`, porque sobre ella no flota el `FloatingTabBar`. Su
       `contentContainerStyle` es `padding: 24`, `gap: 16` y `paddingBottom:
       insets.bottom + 24`, la misma holgura inferior que `(auth)` y
       `reset-password`.
    7. **Estados de carga**: Skeleton de heroui dimensionado como el contenido
       final. Prohibido Spinner suelto que salte el layout.
    8. **Estructura**: route delgado en `src/app/` + pantalla en `src/screens/`
       (conventions.md §estructura Expo oficial, desde #39). Archivos kebab-case.
       Rutas con extensión de plataforma jamás dentro de `src/app/`.
    9. **Tema**: light/dark vía uniwind; colores para código imperativo (mapas,
       iconos) SIEMPRE vía `useThemeColors` de `src/theme/use-theme-colors.ts`
       (reactivo; bug de resolución stale ya visto en #46). El mapa traduce la
       preferencia guardada a `colorScheme` de `expo-maps` mediante
       `src/components/pet-map.tsx`.
    10. **Composición de mapas nativos**: ningún ancestro de una vista nativa de
        mapa puede declarar fondo opaco (`bg-*`). El mapa se compone por detrás de
        la ventana y un fondo encima lo tapa sin producir ningún error. Los estados
        sin mapa declaran su fondo cada uno.
    11. **Desviación declarada del Figma en el acento** (feature #61,
        2026-09-03). `--accent` vale **`#178255`**, no el `#2AB87C` que #46 R1
        tomó del Make. El verde del diseño da 2,55:1 con etiqueta blanca encima y
        no hay forma de pasar AA conservándolo: o se oscurece el relleno o se
        oscurece la letra, y el humano eligió lo primero para que el CTA siga
        siendo verde con letra blanca. Se conserva el hue (154,7°, el mismo del
        Make) y se baja la luminancia hasta **4,82:1** con blanco. Consecuencia
        asumida: los rellenos ya **no** coinciden 1:1 con el Make y el smoke lado
        a lado lo verá; es esperado, no un defecto. El acento como **tinta**
        (texto, enlaces, iconos, trazos) es `--accent-strong`, que en dark
        recupera el `#2AB87C` original porque sobre fondo oscuro un verde oscuro
        es ilegible. Regla mecánica: **fondo ⇒ `--accent`; encima de otra cosa ⇒
        `--accent-strong`.**
    12. **Escala de radios** (feature #62, 2026-09-04). Tres radios, uno por rol,
        y ninguno más:
        - **Superficie de card** → `rounded-card` (token `--radius-card`, 20 px).
          Se obtiene usando `src/components/card.tsx`, no repitiendo la clase.
        - **Control, tile, input, botón y píldora de dato** → `rounded-xl`
          (12 px), que es el mismo valor que `--field-radius: 0.75rem`, de modo
          que botón e input comparten esquina dentro de un formulario.
        - **Cápsula** (chip, avatar, píldora de pestaña, botón circular de
          volver) → `rounded-full`.·
        `rounded-2xl`, `rounded-lg`, `rounded-md` y `rounded-sm` quedan
        **prohibidos en `mobile-pet-tracker/src/`**: no son un cuarto rol, son
        drift. El grep que lo verifica vive en
        `src/__tests__/consistency-classnames.test.ts`.·
        Dos corolarios mecánicos: todo `Skeleton` lleva el radio del contenido
        que sustituye (card ⇒ `rounded-card`, control ⇒ `rounded-xl`), y toda
        esquina no-cápsula **que el repo dibuja por su cuenta** (`View`,
        `Pressable`, `TextInput`, el `Card` compartido) declara
        `style={CONTINUOUS_CORNER}` de `src/theme/native-styles.ts` — los
        componentes de heroui-native ya lo traen de fábrica y no se envuelven
        para añadírselo.·
    13. **Botón con cuerpo** (feature #166, 2026-10-11). Los botones de acción
        llevan un labio inferior: un borde inferior más grueso que los
        laterales, nunca una sombra.
        - **Primario sólido** (todo `Button` con `rounded-xl bg-accent`):
          `rounded-xl bg-accent border-b-4 border-black/25`
          El labio va detrás de `bg-accent`, nunca delante: el recuento de
          primarios de `consistency-classnames` busca `rounded-xl bg-accent`
          seguido de espacio o comilla.
        - **Secundario neutro** (`variant=\"outline\"` o `variant=\"secondary\"`
          sin relleno tonal, y el secundario de Bienvenida):
          `rounded-xl border-2 border-b-6 border-lip-gray bg-surface`
          El gris sale del token `--color-lip-gray` de `src/theme/global.css`,
          nunca de un hex ni de una clase entre corchetes.
        - **Sin labio**: los tonales (`bg-accent-soft`, `bg-default`), los
          destructivos (`bg-danger`, `variant=\"danger-soft\"`) y las primarias
          de heroui sin color en `className` (reintentos, confirmar alerta).
        Los inventarios que lo verifican viven en
        `src/__tests__/consistency-classnames.test.ts`.·
    ## Animación (decisiones por defecto)·
    - Reanimated 4 en UI thread; nada que dependa de JS thread para gestos.
    - Springs sobre timings para elementos que entran/salen o responden a
      gesto; timings solo para opacidad/color. Duraciones: 150ms feedback,
      250ms transición, 400ms superficies grandes — viven en
      `src/theme/motion.ts` (enmienda A21 de #152).
    - Entering/exiting de Reanimated para cambios de estado visibles
      (aparición de cards, resultados de fetch).
    - Nunca pasar valores `Color`/`PlatformColor`/var CSS a estilos de
      Reanimated — color estático resuelto con `useThemeColors`.
    - Interrumpible siempre: un gesto puede cortar cualquier animación en curso.
    - `prefers-reduced-motion` respetado (Reanimated `ReducedMotionConfig` o
      guard equivalente).
    - expo-haptics está instalado desde #106 (2026-09-21), autorizado por el
      humano en el gate de specs/mobile-meals-bar-motion/. Se usa con la tabla de
      la skill expo-animation §8: selectionAsync para un detent, impactAsync para
      un commit de gesto, notificationAsync(Success|Error) para una operación que
      termina bien o mal. Tres reglas absolutas: mismo frame que el visual, uno
      por acción del usuario, y nunca el único feedback.
    - El runtime de smoke del humano es el dev build de Android desde 2026-08-27;
      `expo-maps` no está disponible en Expo Go.
    - Backlog priorizado con valores exactos: `progress/audit_animations_mobile.md`.·
    ## Micro-reglas de pulido (de expo-native-ui, adoptadas)·
    - `borderCurve: 'continuous'` en toda esquina redondeada no-cápsula.
    - `gap` sobre margin; padding sobre margin.
    - `<Text selectable />` en datos copiables y mensajes de error.
    - Contadores/números alineados: `fontVariant: ['tabular-nums']`.
    - Números grandes formateados (1.4M, 38k).
    - Feedback pressed en TODO elemento tappable (Pressable style function o
      componente heroui que ya lo trae); touch target ≥ 44pt.
    - Títulos de pantalla: header del stack cuando exista, no Text suelto.·
    ## Dirección de arte·
    > Añadida el 2026-09-04 tras `progress/explore_design-gap-vs-make.md`. Hasta
    > aquí esta carta era un sistema de estilos —tokens, radios, componentes— y no
    > decía nada sobre qué debe *parecer* ni qué debe *responder* una pantalla. El
    > brief del producto sí lo dice, y las specs no lo estaban leyendo.·
    **1. Paleta pastel categórica.** El brief pide un producto \"amigable, lúdico,
    con colores pastel\". Cuando una pantalla distingue **categorías** —tipos de
    recordatorio, tipos de documento, destinos de acceso rápido— cada categoría
    lleva su propio fondo pastel, no el mismo `accent-soft` para todas. Esos
    fondos son **tokens de `global.css`**, nunca hex sueltos ni clases arbitrarias:
    la regla de §Decisiones fijas 3 no tiene excepción por ser \"un color de
    adorno\". Los valores del Make son de tema claro y no traen equivalente
    oscuro: el dark se diseña, no se copia, y cada par texto/superficie se
    verifica AA con contraste **calculado**, como fijó #61.·
    Los seis huecos, cerrados (feature #64, 2026-09-04). Toda sección categórica
    consume estos tokens; ninguna inventa un hex ni una clase arbitraria:·
    | Hueco | Superficie | Tinta | Tipos que lo ocupan |
    |---|---|---|---|
    | azul | `bg-category-blue` | `text-category-blue-strong` | recordatorio `vaccine`; documento de vacunación |
    | ámbar | `bg-category-amber` | `text-category-amber-strong` | recordatorio `medication`; documento de desparasitación |
    | verde | `bg-category-green` | `text-category-green-strong` | recordatorio `appointment`; documento de consulta |
    | violeta | `bg-category-violet` | `text-category-violet-strong` | recordatorio `deworming`; documento de análisis |
    | rosa | `bg-category-rose` | `text-category-rose-strong` | recordatorio `food` |
    | neutral | `bg-default` | `text-muted` | recordatorio `weight` y `custom`; cualquier tipo de documento desconocido |·
    El reparto vive en `src/utils/category-palette.ts` y es el **único** sitio donde
    se escriben esos nombres de clase. El color nunca es el único portador de la
    categoría: la superficie siempre acompaña a un emoji y a un texto.·
    **2. Fotografía y su respaldo.** Las cabeceras fotográficas asumen que la
    mascota tiene foto. Cuando no la tiene, el respaldo es el **blobatar**
    determinista de la mascota, que es lo que `pet-avatar` pinta de verdad. Ni
    ilustración por especie ni foto obligatoria en el alta. Y sea cual sea la
    imagen, **el texto que va encima pasa AA**.·
    > **Enmendado por #67 (A8) — corrección de un hecho falso.** Hasta el
    > 2026-09-06 este punto decía *\"el respaldo es degradado con la inicial —el
    > patrón que ya usa `pet-avatar`—, decidido por el humano el 2026-09-04\"*.
    > Era falso de origen: `src/components/pet-avatar.tsx` pinta `blobatar(name)`
    > con `SvgXml` y nunca una inicial, y la R5 aprobada de #40 (2026-08-21)
    > sustituyó explícitamente el fallback de inicial por el blobatar. El error
    > venía de `progress/explore_design-gap-vs-make.md` y se propagó también al
    > enunciado de #67 en `feature_list.json`. Y la garantía de AA no la da el
    > degradado: la da la **banda opaca** bajo el texto (#67 R3), porque ningún
    > velo sobre una foto arbitraria llega a 4,5:1.·
    **3. Las siete preguntas de la Home.** El brief fija qué debe responder la
    pantalla principal: ¿está segura?, ¿dónde está?, ¿el collar está conectado?,
    ¿tiene batería?, ¿tiene algún recordatorio pendiente?, ¿cómo fue su actividad
    hoy?, ¿hay alguna alerta? Toda spec que toque la Home **declara cuáles de las
    siete responde y cuáles no**, y por qué. No es decoración: es el criterio de
    aceptación de la pantalla.·
    **4. Nada de jerga del proveedor.** El brief lo prohíbe explícitamente: los
    términos técnicos de Wialon no se muestran al usuario final. Si un dato solo
    se puede explicar con vocabulario de la integración, se traduce o no se
    enseña.·
    **5. Fidelidad no es pérdida de información.** El diseño oculta datos que la
    app ya sirve (la rejilla del mapa, el perfil nutricional, los avisos de plan)
    y no dibuja estados que existen de verdad, como el 402 de \"sin suscripción\".
    Parecerse al diseño **no** autoriza a borrar un dato útil: la spec que se
    encuentre con uno o lo conserva, o escribe por qué se va.·
    **6. Idioma: catálogo de dos idiomas, español por defecto.** Decidido por el
    humano el 2026-09-04 (español) y el 2026-09-05 (catálogo + interruptor), y
    ejecutado por la feature #65. **Ninguna pantalla escribe texto**: todo lo que
    ve el usuario —títulos, etiquetas, placeholders, `accessibilityLabel`,
    mensajes de error, botones de `Alert`— se resuelve con `t('<ámbito>.<clave>')`
    contra `mobile-pet-tracker/src/i18n/catalog.ts`. Toda spec que introduzca copy
    nueva **añade su clave en los dos idiomas** en el mismo gate y la registra en
    la tabla de `specs/mobile-ui-language/design.md` §2; una clave que exista en un
    idioma y no en el otro no compila. Donde el diseño del Make da la palabra en
    español se usa **la del diseño**. **No hay librería de i18n y no se instala
    una**, ni `expo-localization`: el idioma es elección explícita del usuario en
    Profile, no detección del idioma del teléfono. Las fechas y las horas siguen al
    idioma elegido (`es-MX` / `en-US`), no al locale del sistema.·
    Tres corolarios que nadie debe confundir con lo anterior:·
    - **El idioma del código no cambia.** Nombres de variables, funciones, tipos,
      ficheros, `testID`, rutas y **las claves del catálogo** siguen en inglés, y
      los mensajes de commit también (`docs/conventions.md` §Commits).
    - **El backend sigue devolviendo validaciones en inglés, en los dos idiomas.**
      Se ve en `login-error`, `register-*-error`, `weight-form-error` y
      `reset-error`, porque son mensajes de Zod de `backend-pet-tracker/`.
      Traducirlos es una feature de backend. Al revés, las advertencias
      nutricionales del backend ya llegan en español y se muestran tal cual — y en
      inglés también, porque tampoco se traducen.
    - **Los valores de enum que la API devuelve se pintan crudos**: `pet.sex`,
      `document.type`, `foodType`, `activityLevel`. Siguen en inglés en los dos
      idiomas. Mapearlos es cambio de conducta y va a feature propia.
      `device.connectivity` dejó de pintarse crudo en la feature #68 (R16): se
      resuelve por catálogo en `src/utils/device-connectivity.ts`.·
    **7. Voz de Pingo: guardián sereno.** Decidido por el humano el 2026-10-07
    (D1 de la feature #153): la mascota se llama **Pingo** y habla con la voz B,
    «guardián sereno». Rige todo texto que la app pone en boca de Pingo
    (bocadillos, estados vacíos, celebraciones, avisos); el resto del copy sigue el
    punto 6 sin más. Cada frase nueva de Pingo entra con su clave en los dos
    idiomas, como cualquier otra copy.·
    - **Tono:** tranquilo y cálido; da seguridad. En español, tutea.
    - **Persona:** Pingo habla en primera persona («te ayudo», «te recomiendo») y
      llama a la mascota del usuario por su nombre, con el marcador `{{petName}}`.
    - **Sin emoji**, en ningún idioma.
    - **Exclamaciones solo para celebrar.** Un saludo, un aviso o un estado vacío
      terminan en punto.
    - **Sin bromas en las alertas.** Una alerta de Pingo dice qué pasa y qué hacer.
    - **En inglés, registro neutro.**
    - **Bucles de reposo.** Flotar, parpadear y los tres anillos de ping que
      rodean a Pingo en la bienvenida son las únicas animaciones continuas de
      Pingo, y una excepción declarada a §Animación: animan `translateY`,
      `scale` y `opacity` con timing y duraciones fuera de 150/250/400,
      porque no entran, ni salen, ni responden a un gesto. Sus constantes viven en
      `src/theme/motion.ts` y no arrancan con reduce motion.·
    ## Checklist de autocrítica (cierra toda pantalla nueva o modificada)·
    Screenshot mental (o real en smoke) contra: jerarquía (lo importante
    primero), proximidad (relacionado más cerca), repetición (esquinas/sombras/
    acentos iguales = tokens), alineación (bordes comparten ejes). Si una
    pantalla falla el mismo check dos veces, el fix va al theme o a un
    componente — no a la pantalla.·
    ## Enmienda #67 — cabecera fotográfica compartida·
    `mobile-pet-hero-header` (#67) modifica una decisión que esta spec dejó
    aprobada. La spec de origen es `specs/mobile-pet-hero-header/`; el detalle de
    la enmienda está en su `requirements.md` §R10.·
    - Spec enmendada: `docs/ui-guidelines.md`
    - Qué cambia: `enmiendas A8 y A9 de la tabla de #67 §R10`
    - Qué NO cambia: ningún otro requisito de esta spec, ni su estado de
      aprobación, ni los tests que ya la cubren.·
    - [X] Enmienda aprobada por humano·
    ## Enmienda #70 — elementos repetidos: qué hay que candar·
    > Añadida el 2026-09-09. Tres features seguidas —#69, #71, #70— cerraron con el
    > mismo patrón: la revisión destapa una dimensión sin vigilar, se cierra, y la
    > siguiente revisión destapa otra por el mismo mecanismo. Cuatro rondas, cuatro
    > dimensiones. Esta lista existe para que la quinta no haga falta.·
    Cuando una pantalla pinta un **elemento repetido** —una celda de una tira, un
    tile de una rejilla, una fila de una lista— la spec enumera **todas** las
    decisiones que ese elemento toma, y el criterio de aceptación es siempre el
    mismo: **cruzar cualquiera de ellas entre dos elementos pone la suite roja**,
    observado con `within(elemento)`.·
    **Decisiones de conducta, una por elemento:**·
    1. el **dato que muestra** — el más olvidado;
    2. componente de icono;
    3. etiqueta visible / clave de copy;
    4. **nombre accesible** — se cruza igual en un elemento solo-icono, donde
       ninguna aserción de texto lo ve;
    5. color o hueco de fondo;
    6. **tinta del icono**;
    7. **color y receta tipográfica de cada texto** — no solo del principal;
    8. destino de navegación;
    9. **condición de render** — mueve la cardinalidad, así que el recuento se
       verifica en más de un escenario;
    10. **forma del contenedor** (`flex-row items-center gap-*`) — y en **todas** sus
        ramas, no solo la cargada: si el estado vacío promete \"la misma anatomía de
        fila\", eso es una aserción, no una frase del título del test;
    11. **envoltorios de agrupación** (`flex-1` y equivalentes) que reparten el
        espacio;
    12. **orden de los hijos**. `within(row).getByTestId(...)` es **agnóstico al
        orden**: intercambiar dos textos deja la suite entera verde. Se cierra
        fijando la posición, p. ej.
        `expect(row.children[1]).toHaveProperty('props.className', 'flex-1')`.·
    **Estructurales, del contenedor:** identidad, orden y cardinalidad. El recuento
    se cierra con `children.length`, **nunca contando coincidencias de `testID`** —
    un recuento por prefijo deja pasar cualquier hijo sin `testID`.·
    **Invariantes compartidos, a inventariar aparte:** tamaño de icono, objetivo
    táctil y reparto, radio, rol y agrupación accesible, sitio de render, y feedback
    de pulsado.·
    > **Inventariar no es candar.** Añadido el 2026-09-09 tras #85: la spec copió
    > esta lista en prosa —incluido \"tamaño de icono\"— y aun así el `size={20}` del
    > icono de fila quedó sin una sola aserción: ponerlo a `28` dejó la suite móvil
    > completa verde. Cada invariante de esta lista necesita **un `expect`**, no una
    > mención. Y ojo con el caso que lo produjo: un `size` renderizado **por
    > variable** no lo ve ningún recuento de literales en el fuente.·
    **Método**: cada candado se demuestra con una sonda —cruzar el valor en
    producción, ver el rojo, restaurar con `git diff` vacío— y la evidencia se
    escribe. Un candado que nadie vio fallar no es un candado.·
    ## Enmienda #98 — la barra de comidas de la Home·
    `mobile-meals-served-ui` (#98) añade a la sección de recordatorios una barra
    informativa de las comidas servidas hoy. Se pinta solo con detalle cargado y
    `mealsToday !== null`, inmediatamente después de la próxima vacuna y antes del
    estado vacío o de las filas de recordatorio.·
    **Decisiones de conducta de la barra:**·
    1. el dato es `mealsToday.served` de `mealsToday.total`;
    2. el icono es `ForkKnife`, con `size={20}`;
    3. el título usa la clave `food.mealsToday`;
    4. el contador usa como nombre accesible la clave
       `food.mealsServedOfTotal`, con `served` y `total`;
    5. el disco del icono ocupa el hueco **rosa** de la paleta categórica:
       `bg-category-rose`, asignado al tipo `food`;
    6. la tinta del icono es `category-rose-strong` resuelta por
       `useThemeColors`;
    7. el título usa `text-sm font-semibold text-foreground` y el contador
       `text-xs font-normal text-muted` con cifras tabulares;
    8. no navega ni lleva `onPress`;
    9. solo se renderiza cuando el detalle es `ok` y `mealsToday !== null`;
    10. el `Card` compone una fila `flex-row items-center gap-3`;
    11. el contenido se agrupa en una columna `flex-1 gap-1.5`, con cabecera y
        carril;
    12. el orden es disco del icono y columna; dentro de la columna, cabecera y
        carril; dentro de la cabecera, título y contador.·
    **Estructura e invariantes:** la fila tiene dos hijos, igual que la columna y
    la cabecera; el carril tiene un único relleno. El disco es una cápsula de
    36 px, el carril usa `h-1.5 overflow-hidden rounded-full bg-default` y el
    relleno usa `h-full rounded-full bg-accent`. Esto último aplica la regla fija
    **fondo ⇒ `bg-accent`**; `bg-accent-strong` sería tinta, no fondo. El ancho se
    calcula como el porcentaje redondeado de `served / total`, o `0%` si el total
    es cero.·
    - [X] Enmienda aprobada por humano··
    ## Enmienda #152 — el movimiento vive en src/theme/motion.ts·
    Enmienda A21: Reanimated consume números y §Animación prohíbe pasarle
    variables CSS. Las duraciones y configuraciones compartidas de movimiento
    viven en `src/theme/motion.ts`.·
    `motion.ts` no es un segundo sistema de estilos en el sentido de
    §Decisiones fijas 1: no contiene colores, espaciados, radios ni clases,
    solo duraciones y configuraciones de Reanimated. Tiene los precedentes
    `native-styles.ts` y `touch-target.ts` en la misma carpeta.·
    Las constantes anteriores a #152 (`MEALS_BAR_TIMING`, `KCAL_BAR_TIMING`,
    `BAR_ENTRY_*`, `METRIC_TAB_SPRING` y `TAB_INDICATOR_SPRING`) migran a
    `motion.ts` en una feature posterior, fuera del alcance de esta.
    `WELCOME_ENTRANCE_MS` no está en la lista: la retiró #153, cuya bienvenida
    usa `MOTION_FADE_TIMING` y `MOTION_SETTLE_SPRING` (enmienda E1 de #153).·
    - [X] Enmienda aprobada por humano·
    ## Enmienda #167 — anillos de ping de la bienvenida·
    Los tres anillos de ping de la bienvenida amplían los bucles de reposo de
    §Animación punto 7. Cada anillo es un círculo de borde `border-accent` que
    crece de `MOTION_PING_FROM` a `MOTION_PING_TO_SCALE` mientras su opacidad cae
    de `MOTION_PING_FROM` a 0, con `MOTION_PING_TIMING`, en bucle infinito y sin
    invertir. Los anillos arrancan escalonados un tercio de la duración. Con
    reduce motion no se pintan.·
    Ninguna otra pantalla usa anillos de ping sin una enmienda propia.·
    - [X] Enmienda aprobada por humano·
    ## Enmienda #168 — título grande en Salud, Nutrición y Perfil·
    `mobile-tab-headers-canvas` (#168) modifica una decisión que esta spec dejó
    aprobada. La spec de origen es `specs/mobile-tab-headers-canvas/`; el detalle
    de la enmienda está en su `requirements.md` §R11.·
    - Spec enmendada: `docs/ui-guidelines.md`
    - Qué cambia: `regla N1: título grande en Salud, Nutrición y Perfil; hero solo en Inicio`
    - Qué NO cambia: ningún otro requisito de esta spec ni su estado de
      aprobación. Los tests que cubren lo enmendado se reescriben en #168 (lista
      en su `tasks.md`).·
    - [X] Enmienda #168 aprobada por humano·
    **Regla N1 (enmienda B4 de #168)**: Salud, Nutrición y Perfil abren con el título grande; Inicio es la única pestaña con PetHeroHeader. Devolver el hero a una de las tres es una enmienda a #168.
    "

      69 |   const charter = readFileSync(join(process.cwd(), '..', 'docs', 'ui-guidelines.md'), 'utf8');
      70 |   const heading = '## Enmienda #172 — Las pantallas de cuenta como el canvas';
    > 71 |   expect(charter).toContain(heading);
         |                   ^
      72 |   const amendment = charter.slice(charter.indexOf(heading));
      73 |   expect(amendment).toMatch(/- \[[ xX]\] Enmienda aprobada por humano/);
      74 |   for (const literal of [

      at Object.toContain (src/__tests__/account-screens-polish.test.ts:71:19)
exit=1
```

#### c35 — jest

```bash
bunx jest --testTimeout=30000 --runTestsByPath src/__tests__/account-screens-polish.test.ts src/theme/__tests__/motion.test.ts 'src/app/(tabs)/__tests__/food.test.tsx' src/__tests__/hero-header-amendments.test.ts src/screens/welcome/index.test.tsx src/__tests__/ui-language.test.ts src/__tests__/design-drift.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/legibility-classnames.test.ts
```

```text
PASS src/theme/__tests__/motion.test.ts
PASS src/__tests__/account-screens-polish.test.ts
PASS src/__tests__/design-drift.test.ts
PASS src/__tests__/ui-language.test.ts
PASS src/__tests__/consistency-classnames.test.ts
PASS src/__tests__/hero-header-amendments.test.ts
PASS src/__tests__/legibility-classnames.test.ts
PASS src/app/(tabs)/__tests__/food.test.tsx (14.686 s)
PASS src/screens/welcome/index.test.tsx (20.509 s)
Test Suites: 9 passed, 9 total
Tests:       393 passed, 393 total
Time:        24.514 s
exit=0
```

#### c35 — router

```bash
test ! -e .expo/types/router.d.ts
```

```text

exit=0
```

#### c35 — typecheck

```bash
bun run typecheck
```

```text
$ tsc --noEmit
exit=0
```

#### c35 — lint

```bash
bunx expo lint --no-cache > /tmp/lint-172.log 2>&1
```

```text
error: Failed to run "eslint" due to signal SIGKILL
vacio=1
exit=0
```

#### c35 — lint_SIGKILL

```bash
bunx expo lint --no-cache > /tmp/lint-172.log 2>&1; test ! -s /tmp/lint-172.log
```

```text
error: Failed to run "eslint" due to signal SIGKILL
vacio=1
exit=1
```

#### c35 — espera_carga

```bash
cd /home/claude/sites/Pet-Tracker-wt-172/mobile-pet-tracker && for i in $(seq 1 30); do pgrep -f 'node_modules/(\.bin/(jest|eslint)|jest-worker)|[i]nit\.sh' > /dev/null || break; sleep 60; done; echo "fin-espera"
```

```text
fin-espera
exit=0
```

#### c35 — lint_reintento

```bash
bunx expo lint --no-cache > /tmp/lint-172.log 2>&1
```

```text
vacio=0
exit=0
```

#### S18a — jest

```bash
bunx jest --testTimeout=30000 --runTestsByPath src/__tests__/account-screens-polish.test.ts
```

```text
FAIL src/__tests__/account-screens-polish.test.ts
Test Suites: 1 failed, 1 total
Tests:       1 failed, 6 passed, 7 total
Time:        1.769 s, estimated 3 s
  ● #172 R18: la carta declara la enmienda #172 y su casilla

    expect(received).toMatch(expected)

    Expected pattern: /- \[[ xX]\] Enmienda aprobada por humano/
    Received string:  "## Enmienda #172 — Las pantallas de cuenta como el canvas·
    Iniciar sesión, Crear cuenta, Recuperar contraseña y Nueva contraseña siguen
    el canvas de #172 (`specs/mobile-account-screens-polish/canvas/`).·
    **Pingo flota.** Los bucles de reposo de §Animación se amplían a tres
    pantallas de cuenta: en Crear cuenta, Recuperar contraseña y Nueva contraseña,
    Pingo flota con el componente compartido `PingoFloat`
    (`src/components/pingo-float.tsx`). Anima `translateY` hasta
    `-MOTION_PINGO_FLOAT_OFFSET_Y` (10) con `MOTION_PINGO_FLOAT_TIMING` (1500 ms
    por tramo, `ease-in-out`), en bucle infinito e invertido, y lo cancela al
    desmontar. Con reduce motion no arranca. La bienvenida conserva su flotación
    de 4 px. Iniciar sesión no flota: Pingo saluda con su burbuja. Ninguna otra
    pantalla usa `PingoFloat` sin una enmienda propia.·
    **El candado lleva labio.** El tile del candado de Recuperar
    (`forgot-lock-tile`) es un tile acento con labio: `rounded-xl border-b-4
    border-black/25 bg-accent`. Es la única excepción a la regla de que solo los
    botones llevan labio, y el labio va delante de `bg-accent` para no contar como
    primario.·
    **La CTA va al pie.** En las cuatro pantallas, la CTA se ancla al pie con un
    espaciador `flex-1` y el contenido deja de centrarse en vertical. Esto revierte
    el centrado de `#61 R8` en esas pantallas. El `ScrollView`,
    `keyboardShouldPersistTaps` y el comportamiento de teclado no cambian. La rama
    sin token de Nueva contraseña sigue centrada.·
    **Alturas.** La CTA de cuenta mide 56 (`h-14`) y los inputs de cuenta 52
    (`h-13`).·
    **Peso 800.** `font-extrabold` (Inter ExtraBold) se usa solo en la etiqueta de
    la CTA de cuenta y en la de `forgot-resend`, que ocupa su sitio.·
    **Ojo de contraseña.** Todo campo de contraseña de cuenta usa `PasswordInput`
    (`src/components/password-input.tsx`), con un botón de 44 que alterna
    «Mostrar contraseña» y «Ocultar contraseña».·
    "

      71 |   expect(charter).toContain(heading);
      72 |   const amendment = charter.slice(charter.indexOf(heading));
    > 73 |   expect(amendment).toMatch(/- \[[ xX]\] Enmienda aprobada por humano/);
         |                     ^
      74 |   for (const literal of [
      75 |     'PingoFloat', 'MOTION_PINGO_FLOAT_OFFSET_Y', 'forgot-lock-tile',
      76 |     'font-extrabold', 'h-14', 'h-13', 'PasswordInput',

      at Object.toMatch (src/__tests__/account-screens-polish.test.ts:73:21)
exit=1
```

#### S18a — restore

```bash
git checkout HEAD -- ../docs/ui-guidelines.md; git diff --quiet HEAD -- ../docs/ui-guidelines.md; echo "exit=$?"
```

```text
exit=0
exit=0
```

#### S18b — jest

```bash
bunx jest --testTimeout=30000 --runTestsByPath src/__tests__/account-screens-polish.test.ts
```

```text
FAIL src/__tests__/account-screens-polish.test.ts
Test Suites: 1 failed, 1 total
Tests:       1 failed, 6 passed, 7 total
Time:        1.19 s, estimated 2 s
  ● #172 R18: la carta declara la enmienda #172 y su casilla

    expect(received).toContain(expected) // indexOf

    Expected substring: "MOTION_PINGO_FLOAT_OFFSET_Y"
    Received string:    "## Enmienda #172 — Las pantallas de cuenta como el canvas·
    Iniciar sesión, Crear cuenta, Recuperar contraseña y Nueva contraseña siguen
    el canvas de #172 (`specs/mobile-account-screens-polish/canvas/`).·
    **Pingo flota.** Los bucles de reposo de §Animación se amplían a tres
    pantallas de cuenta: en Crear cuenta, Recuperar contraseña y Nueva contraseña,
    Pingo flota con el componente compartido `PingoFloat`
    (`src/components/pingo-float.tsx`). Anima `translateY` hasta
    `-MOTION_FLOAT_OFFSET_Y` (10) con `MOTION_PINGO_FLOAT_TIMING` (1500 ms
    por tramo, `ease-in-out`), en bucle infinito e invertido, y lo cancela al
    desmontar. Con reduce motion no arranca. La bienvenida conserva su flotación
    de 4 px. Iniciar sesión no flota: Pingo saluda con su burbuja. Ninguna otra
    pantalla usa `PingoFloat` sin una enmienda propia.·
    **El candado lleva labio.** El tile del candado de Recuperar
    (`forgot-lock-tile`) es un tile acento con labio: `rounded-xl border-b-4
    border-black/25 bg-accent`. Es la única excepción a la regla de que solo los
    botones llevan labio, y el labio va delante de `bg-accent` para no contar como
    primario.·
    **La CTA va al pie.** En las cuatro pantallas, la CTA se ancla al pie con un
    espaciador `flex-1` y el contenido deja de centrarse en vertical. Esto revierte
    el centrado de `#61 R8` en esas pantallas. El `ScrollView`,
    `keyboardShouldPersistTaps` y el comportamiento de teclado no cambian. La rama
    sin token de Nueva contraseña sigue centrada.·
    **Alturas.** La CTA de cuenta mide 56 (`h-14`) y los inputs de cuenta 52
    (`h-13`).·
    **Peso 800.** `font-extrabold` (Inter ExtraBold) se usa solo en la etiqueta de
    la CTA de cuenta y en la de `forgot-resend`, que ocupa su sitio.·
    **Ojo de contraseña.** Todo campo de contraseña de cuenta usa `PasswordInput`
    (`src/components/password-input.tsx`), con un botón de 44 que alterna
    «Mostrar contraseña» y «Ocultar contraseña».·
    - [x] Enmienda aprobada por humano
    "

      76 |     'font-extrabold', 'h-14', 'h-13', 'PasswordInput',
      77 |   ]) {
    > 78 |     expect(amendment).toContain(literal);
         |                       ^
      79 |   }
      80 | });
      81 |

      at Object.toContain (src/__tests__/account-screens-polish.test.ts:78:23)
exit=1
```

#### S18b — restore

```bash
git checkout HEAD -- ../docs/ui-guidelines.md; git diff --quiet HEAD -- ../docs/ui-guidelines.md; echo "exit=$?"
```

```text
exit=0
exit=0
```

#### c36 — jest

```bash
bunx jest --testTimeout=30000 --runTestsByPath src/screens/login/index.test.tsx src/screens/register/index.test.tsx src/screens/forgot/index.test.tsx src/screens/reset-password/index.test.tsx src/__tests__/account-screens-polish.test.ts src/__tests__/legibility-classnames.test.ts src/__tests__/ui-language.test.ts src/__tests__/design-drift.test.ts
```

```text
FAIL src/screens/login/index.test.tsx (10.396 s)
FAIL src/screens/reset-password/index.test.tsx (10.465 s)
FAIL src/__tests__/account-screens-polish.test.ts
FAIL src/__tests__/design-drift.test.ts
FAIL src/screens/register/index.test.tsx (13.052 s)
FAIL src/__tests__/ui-language.test.ts
FAIL src/__tests__/legibility-classnames.test.ts
FAIL src/screens/forgot/index.test.tsx
Test Suites: 8 failed, 8 total
Tests:       20 failed, 259 passed, 279 total
Time:        14.838 s, estimated 21 s
  ● #61 R8: login tiene contenedor de scroll con safe areas › #172 R19: ancla el contenido al pie dentro de un ScrollView con los insets aplicados

    expect(received).toEqual(expected) // deep equality

    - Expected  - 0
    + Received  + 1

      Object {
        "flexGrow": 1,
        "gap": 16,
    +   "justifyContent": "center",
        "padding": 24,
        "paddingBottom": 48,
        "paddingTop": 52,
      }

      167 |     const screenRoot = screen.getByTestId('login-form');
      168 |
    > 169 |     expect(screenRoot.props.contentContainerStyle).toEqual({
          |                                                    ^
      170 |       flexGrow: 1,
      171 |       padding: 24,
      172 |       gap: 16,

      at Object.toEqual (src/screens/login/index.test.tsx:169:52)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
  ● #167 R6: Pingo saluda en login y la pantalla entra en dos tiempos › #167 R6: entra en dos tiempos, cabecera y cuerpo

    expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 1

    @@ -1,8 +1,8 @@
      Object {
        "login-body": Object {
    -     "className": "flex-1 gap-4",
    +     "className": "gap-4",
          "index": 1,
        },
        "login-header": Object {
          "className": "gap-4",
          "index": 0,

      245 |     expect(Object.fromEntries(mockHomeEntrance.mock.calls.map(([p]) => [
      246 |       p.testID, { index: p.index, className: p.className },
    > 247 |     ]))).toEqual({
          |          ^
      248 |       'login-header': { index: 0, className: 'gap-4' },
      249 |       'login-body': { index: 1, className: 'flex-1 gap-4' },
      250 |     });

      at Object.toEqual (src/screens/login/index.test.tsx:247:10)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
  ● #167 R6: Pingo saluda en login y la pantalla entra en dos tiempos › #172 R19: el espaciador empuja el envío al pie

    Unable to find an element with testID: login-spacer

    <RNCSafeAreaProvider>
      <View
        testID="screen-login"
      >
        <RCTScrollView
          testID="login-form"
        >
          <View>
            <View
              testID="login-header"
            >
              <View
                accessibilityLabel="Volver"
                accessibilityRole="button"
                accessible={true}
                testID="login-back"
              >
                <RNSVGSvgView>
                  <RNSVGGroup>
                    <RNSVGGroup>
                      <RNSVGPath />
                    </RNSVGGroup>
                  </RNSVGGroup>
                </RNSVGSvgView>
              </View>
              <View
                testID="login-greeting"
              >
                <ViewManagerAdapter_ExpoImage
                  placeholder={[]}
                  testID="login-pingo"
                />
                <View
                  testID="login-bubble"
                >
                  <Text
                    testID="login-bubble-text"
                  >
                    Qué bueno verte de nuevo.
                  </Text>
                </View>
              </View>
              <Text>
                Iniciar sesión
              </Text>
            </View>
            <View
              testID="login-body"
            >
              <View>
                <View
                  accessible={true}
                >
                  <Text>
                    Correo electrónico
                  </Text>
                </View>
                <TextInput
                  editable={true}
                  testID="login-email"
                  value=""
                />
              </View>
              <View>
                <View
                  accessible={true}
                >
                  <Text>
                    Contraseña
                  </Text>
                </View>
                <View
                  testID="login-password-group"
                >
                  <TextInput
                    editable={true}
                    testID="login-password"
                    value=""
                  />
                  <View>
                    <View
                      accessibilityLabel="Mostrar contraseña"
                      accessibilityRole="button"
                      accessible={true}
                      testID="login-password-toggle"
                    >
                      <View
                        testID="icon-eye"
                      />
                    </View>
                  </View>
                </View>
              </View>
              <View
                accessibilityRole="button"
                accessibilityState={
                  {
                    "disabled": false,
                  }
                }
                accessible={true}
                testID="link-forgot"
              >
                <Text>
                  ¿Olvidaste tu contraseña?
                </Text>
              </View>
              <View
                accessibilityRole="button"
                accessibilityState={
                  {
                    "disabled": false,
                  }
                }
                accessible={true}
                testID="login-submit"
              >
                <View
                  pointerEvents="none"
                  style={
                    {
                      "opacity": 0,
                    }
                  }
                />
                <Text>
                  Iniciar sesión
                </Text>
              </View>
              <View
                accessibilityRole="button"
                accessibilityState={
                  {
                    "disabled": false,
                  }
                }
                accessible={true}
                testID="link-register"
              >
                <Text>
                  Crear cuenta
                </Text>
              </View>
            </View>
          </View>
        </RCTScrollView>
      </View>
    </RNCSafeAreaProvider>

      294 |     await renderLogin();
      295 |     function expectSpacer(withError = false) {
    > 296 |       const spacer = screen.getByTestId('login-spacer');
          |                             ^
      297 |       const cta = screen.getByTestId('login-submit');
      298 |       expect(spacer.parent).toBe(cta.parent);
      299 |       expect(spacer.parent).toBe(screen.getByTestId('login-body'));

      at getByTestId (src/screens/login/index.test.tsx:296:29)
      at Object.expectSpacer (src/screens/login/index.test.tsx:309:5)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

FAIL src/screens/reset-password/index.test.tsx (10.465 s)
  ● #61 R8: las tres ramas de reset tienen contenedor de scroll › #172 R19: la rama de éxito ancla el enlace al pie y no centra

    expect(received).toEqual(expected) // deep equality

    - Expected  - 0
    + Received  + 2

      Object {
    +   "alignItems": "center",
        "flexGrow": 1,
        "gap": 16,
    +   "justifyContent": "center",
        "padding": 24,
        "paddingBottom": 48,
        "paddingTop": 52,
      }

      307 |     expect(
      308 |       screen.getByTestId('screen-reset-password').props.contentContainerStyle,
    > 309 |     ).toEqual(metrics);
          |       ^
      310 |   });
      311 |
      312 |   it('#172 R19: la rama del formulario ancla el envío al pie y no centra', async () => {

      at Object.toEqual (src/screens/reset-password/index.test.tsx:309:7)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
  ● #61 R8: las tres ramas de reset tienen contenedor de scroll › #172 R19: la rama del formulario ancla el envío al pie y no centra

    expect(received).toEqual(expected) // deep equality

    - Expected  - 0
    + Received  + 1

      Object {
        "flexGrow": 1,
        "gap": 16,
    +   "justifyContent": "center",
        "padding": 24,
        "paddingBottom": 48,
        "paddingTop": 52,
      }

      315 |     const screenRoot = screen.getByTestId('reset-password-form');
      316 |
    > 317 |     expect(screenRoot.props.contentContainerStyle).toEqual(metrics);
          |                                                    ^
      318 |     expect(screenRoot.props.keyboardShouldPersistTaps).toBe('handled');
      319 |   });
      320 | });

      at Object.toEqual (src/screens/reset-password/index.test.tsx:317:52)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
  ● #167 R10: Pingo y tarjeta de estado en nueva contraseña › #167 R10: el formulario entra en dos tiempos

    expect(received).toEqual(expected) // deep equality

    - Expected  - 2
    + Received  + 2

      Object {
        "reset-body": Object {
    -     "className": "flex-1 gap-4",
    +     "className": "gap-4",
          "index": 1,
        },
        "reset-header": Object {
    -     "className": "flex-row items-center gap-3",
    +     "className": "flex-row items-center justify-center gap-3",
          "index": 0,
        },
      }

      398 |     expect(Object.fromEntries(mockHomeEntrance.mock.calls.map(([p]) => [
      399 |       p.testID, { index: p.index, className: p.className },
    > 400 |     ]))).toEqual({
          |          ^
      401 |       'reset-header': { index: 0, className: 'flex-row items-center gap-3' },
      402 |       'reset-body': { index: 1, className: 'flex-1 gap-4' },
      403 |     });

      at Object.toEqual (src/screens/reset-password/index.test.tsx:400:10)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
  ● #167 R10: Pingo y tarjeta de estado en nueva contraseña › #172 R19: el espaciador empuja el envío al pie del formulario

    Unable to find an element with testID: reset-spacer

    <RNCSafeAreaProvider>
      <View
        testID="screen-reset-password"
      >
        <RCTScrollView
          testID="reset-password-form"
        >
          <View>
            <View
              testID="reset-header"
            >
              <View
                testID="reset-pingo-float"
              >
                <ViewManagerAdapter_ExpoImage
                  placeholder={[]}
                  testID="reset-pingo"
                />
              </View>
              <Text>
                Restablecer contraseña
              </Text>
            </View>
            <View
              testID="reset-body"
            >
              <View>
                <View
                  accessible={true}
                >
                  <Text>
                    Nueva contraseña
                  </Text>
                </View>
                <View
                  testID="reset-password-group"
                >
                  <TextInput
                    editable={true}
                    testID="reset-password"
                    value=""
                  />
                  <View>
                    <View
                      accessibilityLabel="Mostrar contraseña"
                      accessibilityRole="button"
                      accessible={true}
                      testID="reset-password-toggle"
                    >
                      <View
                        testID="icon-eye"
                      />
                    </View>
                  </View>
                </View>
              </View>
              <View>
                <View
                  accessible={true}
                >
                  <Text>
                    Confirmar nueva contraseña
                  </Text>
                </View>
                <View
                  testID="reset-password-confirm-group"
                >
                  <TextInput
                    editable={true}
                    testID="reset-password-confirm"
                    value=""
                  />
                  <View>
                    <View
                      accessibilityLabel="Mostrar contraseña"
                      accessibilityRole="button"
                      accessible={true}
                      testID="reset-password-confirm-toggle"
                    >
                      <View
                        testID="icon-eye"
                      />
                    </View>
                  </View>
                </View>
              </View>
              <View
                accessibilityRole="button"
                accessibilityState={
                  {
                    "disabled": false,
                  }
                }
                accessible={true}
                testID="reset-submit"
              >
                <View
                  pointerEvents="none"
                  style={
                    {
                      "opacity": 0,
                    }
                  }
                />
                <Text>
                  Actualizar contraseña
                </Text>
              </View>
            </View>
          </View>
        </RCTScrollView>
      </View>
    </RNCSafeAreaProvider>

      462 |     await renderRoute('reset-token-172');
      463 |     function expectSpacer(withError = false) {
    > 464 |       const spacer = screen.getByTestId('reset-spacer');
          |                             ^
      465 |       const cta = screen.getByTestId('reset-submit');
      466 |       expect(spacer.parent).toBe(cta.parent);
      467 |       expect(spacer.parent).toBe(screen.getByTestId('reset-body'));

      at getByTestId (src/screens/reset-password/index.test.tsx:464:29)
      at Object.expectSpacer (src/screens/reset-password/index.test.tsx:477:5)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
  ● #167 R10: Pingo y tarjeta de estado en nueva contraseña › #172 R19: el espaciador empuja el enlace al pie del éxito

    Unable to find an element with testID: reset-spacer

    <RNCSafeAreaProvider>
      <RCTScrollView
        testID="screen-reset-password"
      >
        <View>
          <View
            testID="reset-header"
          >
            <View
              testID="reset-pingo-float"
            >
              <ViewManagerAdapter_ExpoImage
                placeholder={[]}
                testID="reset-pingo"
              />
            </View>
            <Text>
              Restablecer contraseña
            </Text>
          </View>
          <View
            testID="reset-success-pop"
          >
            <View
              testID="reset-success-card"
            >
              <View
                testID="reset-success-check"
              >
                <View
                  testID="icon-check"
                />
              </View>
              <Text
                testID="reset-success"
              >
                Contraseña actualizada
              </Text>
            </View>
          </View>
          <View
            accessibilityRole="button"
            accessibilityState={
              {
                "disabled": false,
              }
            }
            accessible={true}
            testID="link-login"
          >
            <Text>
              Volver al inicio de sesión
            </Text>
          </View>
        </View>
      </RCTScrollView>
    </RNCSafeAreaProvider>

      484 |     await submitReset();
      485 |     expect(await screen.findByTestId('reset-success')).toBeOnTheScreen();
    > 486 |     const spacer = screen.getByTestId('reset-spacer');
          |                           ^
      487 |     const cta = screen.getByTestId('link-login');
      488 |     expect(spacer.parent).toBe(cta.parent);
      489 |     expect(spacer.parent).toBe(screen.getByTestId('reset-header').parent);

      at Object.getByTestId (src/screens/reset-password/index.test.tsx:486:27)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
  ● #167 R10: Pingo y tarjeta de estado en nueva contraseña › #172 R19: el formulario lleva el enlace de vuelta al login bajo el envío

    Unable to find an element with testID: link-login

    <RNCSafeAreaProvider>
      <View
        testID="screen-reset-password"
      >
        <RCTScrollView
          testID="reset-password-form"
        >
          <View>
            <View
              testID="reset-header"
            >
              <View
                testID="reset-pingo-float"
              >
                <ViewManagerAdapter_ExpoImage
                  placeholder={[]}
                  testID="reset-pingo"
                />
              </View>
              <Text>
                Restablecer contraseña
              </Text>
            </View>
            <View
              testID="reset-body"
            >
              <View>
                <View
                  accessible={true}
                >
                  <Text>
                    Nueva contraseña
                  </Text>
                </View>
                <View
                  testID="reset-password-group"
                >
                  <TextInput
                    editable={true}
                    testID="reset-password"
                    value=""
                  />
                  <View>
                    <View
                      accessibilityLabel="Mostrar contraseña"
                      accessibilityRole="button"
                      accessible={true}
                      testID="reset-password-toggle"
                    >
                      <View
                        testID="icon-eye"
                      />
                    </View>
                  </View>
                </View>
              </View>
              <View>
                <View
                  accessible={true}
                >
                  <Text>
                    Confirmar nueva contraseña
                  </Text>
                </View>
                <View
                  testID="reset-password-confirm-group"
                >
                  <TextInput
                    editable={true}
                    testID="reset-password-confirm"
                    value=""
                  />
                  <View>
                    <View
                      accessibilityLabel="Mostrar contraseña"
                      accessibilityRole="button"
                      accessible={true}
                      testID="reset-password-confirm-toggle"
                    >
                      <View
                        testID="icon-eye"
                      />
                    </View>
                  </View>
                </View>
              </View>
              <View
                accessibilityRole="button"
                accessibilityState={
                  {
                    "disabled": false,
                  }
                }
                accessible={true}
                testID="reset-submit"
              >
                <View
                  pointerEvents="none"
                  style={
                    {
                      "opacity": 0,
                    }
                  }
                />
                <Text>
                  Actualizar contraseña
                </Text>
              </View>
            </View>
          </View>
        </RCTScrollView>
      </View>
    </RNCSafeAreaProvider>

      499 |     await renderRoute('reset-token-172');
      500 |     const body = screen.getByTestId('reset-body');
    > 501 |     const link = within(body).getByTestId('link-login');
          |                               ^
      502 |     expect(link).toHaveTextContent('Volver al inicio de sesión');
      503 |     expect(body.children.indexOf(link)).toBe(body.children.indexOf(screen.getByTestId('reset-submit')) + 1);
      504 |     await fireEvent.press(link);

      at Object.getByTestId (src/screens/reset-password/index.test.tsx:501:31)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
  ● #167 R10: Pingo y tarjeta de estado en nueva contraseña › #167 R10: el éxito conserva la cabecera del formulario

    expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 1

      Object {
    -   "className": "flex-row items-center gap-3",
    +   "className": "flex-row items-center justify-center gap-3",
        "index": 0,
      }

      519 |     expect(await screen.findByTestId('reset-success')).toBeOnTheScreen();
      520 |     const header = screen.getByTestId('reset-header');
    > 521 |     expect({ index: header.props.index, className: header.props.className }).toEqual({
          |                                                                              ^
      522 |       index: 0, className: 'flex-row items-center gap-3',
      523 |     });
      524 |     expect(header.children).toHaveLength(2);

      at Object.toEqual (src/screens/reset-password/index.test.tsx:521:78)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

FAIL src/__tests__/account-screens-polish.test.ts
  ● #172 R19: el contenido de cuenta no se centra en vertical y el enlace de nueva contraseña lleva su receta

    expect(received).toBe(expected) // Object.is equality

    Expected: 0
    Received: 1

      89 |   ] as const) {
      90 |     const source = readFileSync(join(sourceRoot, 'screens', name, 'index.tsx'), 'utf8');
    > 91 |     expect(source.split("justifyContent: 'center'").length - 1).toBe(counts[0]);
         |                                                                 ^
      92 |     expect(source.split("alignItems: 'center'").length - 1).toBe(counts[1]);
      93 |     expect(source.split('-spacer" className="flex-1" />').length - 1).toBe(counts[2]);
      94 |     expect(source.match(/testID="link-login"\s+className="h-13 w-full"/g) ?? []).toHaveLength(counts[3]);

      at Object.toBe (src/__tests__/account-screens-polish.test.ts:91:65)

FAIL src/__tests__/design-drift.test.ts
  ● #149 R4: solo cuatro ficheros de producción navegan a login › #149 R4: inventaría cada ruta a login en producción

    expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 1

      Object {
        "screens/forgot/index.tsx": 2,
        "screens/register/index.tsx": 1,
    -   "screens/reset-password/index.tsx": 3,
    +   "screens/reset-password/index.tsx": 2,
        "screens/welcome/index.tsx": 1,
      }

      735 |     );
      736 |
    > 737 |     expect(actual).toEqual(loginRoutes);
          |                    ^
      738 |   });
      739 | });
      740 |

      at Object.toEqual (src/__tests__/design-drift.test.ts:737:20)

FAIL src/screens/register/index.test.tsx (13.052 s)
  ● #61 R7: register usa las métricas de pantalla uniformes › aplica el padding del contentContainerStyle con los safe-area insets

    expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 0

      Object {
    -   "flexGrow": 1,
        "gap": 16,
        "padding": 24,
        "paddingBottom": 120,
        "paddingTop": 52,
      }

      256 |     expect(
      257 |       screen.getByTestId('register-form').props.contentContainerStyle,
    > 258 |     ).toEqual({
          |       ^
      259 |       flexGrow: 1,
      260 |       padding: 24,
      261 |       gap: 16,

      at Object.toEqual (src/screens/register/index.test.tsx:258:7)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
  ● #167 R7: Pingo en la cabecera del registro › #172 R11: cabecera, rejilla, términos, error y envío cuelgan del scroll

    expect(received).toHaveLength(expected)

    Expected length: 10
    Received length: 9
    Received array:  [<View … />, <View … />, <View … />, <View … />, <View … />, <View … />, <View … />, <View … />, <View … />]

      473 |     const content = screen.getByTestId('register-header').parent;
      474 |     expect(content?.parent).toHaveProperty('props.testID', 'register-form');
    > 475 |     expect(content?.children).toHaveLength(10);
          |                               ^
      476 |     expect(content?.children).toEqual([
      477 |       screen.getByTestId('register-header'), names,
      478 |       screen.getByTestId('register-email').parent,

      at Object.toHaveLength (src/screens/register/index.test.tsx:475:31)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
  ● #167 R7: Pingo en la cabecera del registro › #172 R19: el espaciador empuja el envío al pie

    Unable to find an element with testID: register-spacer

    <RNCSafeAreaProvider>
      <View
        testID="screen-register"
      >
        <RCTScrollView
          testID="register-form"
        >
          <View>
            <View
              testID="register-header"
            >
              <View
                testID="register-top"
              >
                <View
                  accessibilityLabel="Volver"
                  accessibilityRole="button"
                  accessible={true}
                  testID="register-back"
                >
                  <RNSVGSvgView>
                    <RNSVGGroup>
                      <RNSVGGroup>
                        <RNSVGPath />
                      </RNSVGGroup>
                    </RNSVGGroup>
                  </RNSVGSvgView>
                </View>
                <View
                  testID="register-pingo-float"
                >
                  <ViewManagerAdapter_ExpoImage
                    placeholder={[]}
                    testID="register-pingo"
                  />
                </View>
              </View>
              <Text>
                Crear cuenta
              </Text>
            </View>
            <View
              testID="register-names-row"
            >
              <View>
                <View
                  accessible={true}
                >
                  <Text>
                    Nombres
                  </Text>
                </View>
                <TextInput
                  editable={true}
                  testID="register-first-name"
                  value=""
                />
              </View>
              <View>
                <View
                  accessible={true}
                >
                  <Text>
                    Apellidos
                  </Text>
                </View>
                <TextInput
                  editable={true}
                  testID="register-last-name"
                  value=""
                />
              </View>
            </View>
            <View>
              <View
                accessible={true}
              >
                <Text>
                  Correo electrónico
                </Text>
              </View>
              <TextInput
                editable={true}
                testID="register-email"
                value=""
              />
            </View>
            <View
              testID="register-contact-row"
            >
              <View>
                <View
                  accessible={true}
                >
                  <Text>
                    Teléfono
                  </Text>
                </View>
                <TextInput
                  editable={true}
                  testID="register-phone"
                  value=""
                />
              </View>
              <View>
                <View
                  accessible={true}
                >
                  <Text>
                    País
                  </Text>
                </View>
                <TextInput
                  editable={true}
                  testID="register-country"
                  value=""
                />
              </View>
            </View>
            <View>
              <View
                accessible={true}
              >
                <Text>
                  Contraseña
                </Text>
              </View>
              <View
                testID="register-password-group"
              >
                <TextInput
                  editable={true}
                  testID="register-password"
                  value=""
                />
                <View>
                  <View
                    accessibilityLabel="Mostrar contraseña"
                    accessibilityRole="button"
                    accessible={true}
                    testID="register-password-toggle"
                  >
                    <View
                      testID="icon-eye"
                    />
                  </View>
                </View>
              </View>
            </View>
            <View>
              <View
                accessible={true}
              >
                <Text>
                  Confirmar contraseña
                </Text>
              </View>
              <View
                testID="register-password-confirmation-group"
              >
                <TextInput
                  editable={true}
                  testID="register-password-confirmation"
                  value=""
                />
                <View>
                  <View
                    accessibilityLabel="Mostrar contraseña"
                    accessibilityRole="button"
                    accessible={true}
                    testID="register-password-confirmation-toggle"
                  >
                    <View
                      testID="icon-eye"
                    />
                  </View>
                </View>
              </View>
            </View>
            <View>
              <View
                accessibilityState={
                  {
                    "checked": false,
                    "disabled": false,
                  }
                }
                accessible={true}
                role="checkbox"
                testID="register-terms"
              >
                <View
                  aria-disabled={false}
                  aria-hidden={true}
                  role="presentation"
                  style={
                    {
                      "opacity": 0,
                    }
                  }
                >
                  <RNSVGSvgView>
                    <RNSVGGroup>
                      <RNSVGPath />
                    </RNSVGGroup>
                  </RNSVGSvgView>
                </View>
              </View>
              <Text>
                Acepto los términos
              </Text>
            </View>
            <View
              accessibilityRole="button"
              accessibilityState={
                {
                  "disabled": true,
                }
              }
              accessible={true}
              testID="register-submit"
            >
              <View
                pointerEvents="none"
                style={
                  {
                    "opacity": 0,
                  }
                }
              />
              <Text>
                Crear cuenta
              </Text>
            </View>
          </View>
        </RCTScrollView>
      </View>
    </RNCSafeAreaProvider>

      490 |     await renderRegister();
      491 |     function expectSpacer(withError = false) {
    > 492 |       const spacer = screen.getByTestId('register-spacer');
          |                             ^
      493 |       const cta = screen.getByTestId('register-submit');
      494 |       expect(spacer.parent).toBe(cta.parent);
      495 |       expect(spacer.parent).toBe(screen.getByTestId('register-header').parent);

      at getByTestId (src/screens/register/index.test.tsx:492:29)
      at Object.expectSpacer (src/screens/register/index.test.tsx:505:5)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

FAIL src/__tests__/ui-language.test.ts
  ● #65 R11: restablecer contraseña resuelve su copy por clave › resuelve las 16 ocurrencias normativas

    expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 1

      Object {
        "file": "src/screens/reset-password/index.tsx",
        "key": "resetPassword.backToSignIn",
    -   "uses": 3,
    +   "uses": 2,
      }

      60 |       (directCalls?.length ?? 0) + (keyedConstants?.length ?? 0);
      61 |
    > 62 |     expect({ file, key, uses: resolvedUses }).toEqual({
         |                                               ^
      63 |       file,
      64 |       key,
      65 |       uses: expected,

      at toEqual (src/__tests__/ui-language.test.ts:62:47)
      at Object.checkUses (src/__tests__/ui-language.test.ts:199:5)
  ● #65 R18: los sitios resuelven por clave y no queda copy suelta › resuelve cada ocurrencia de la tabla contra la clave exacta

    expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 1

      Object {
        "file": "src/screens/reset-password/index.tsx",
        "key": "resetPassword.backToSignIn",
    -   "uses": 3,
    +   "uses": 2,
      }

      60 |       (directCalls?.length ?? 0) + (keyedConstants?.length ?? 0);
      61 |
    > 62 |     expect({ file, key, uses: resolvedUses }).toEqual({
         |                                               ^
      63 |       file,
      64 |       key,
      65 |       uses: expected,

      at toEqual (src/__tests__/ui-language.test.ts:62:47)
      at Object.checkUses (src/__tests__/ui-language.test.ts:492:5)

FAIL src/__tests__/legibility-classnames.test.ts
  ● #61 R4: el acento como tinta usa accent-strong › screens/reset-password/index.tsx pinta con text-accent-strong (4)

    expect(received).toHaveLength(expected)

    Expected length: 4
    Received length: 3
    Received array:  ["text-accent-strong", "text-accent-strong", "text-accent-strong"]

      159 |
      160 |   it.each(inkSites)('%s pinta con text-accent-strong (%i)', (path, sites) => {
    > 161 |     expect(readSource(path).match(/text-accent-strong\b/g)).toHaveLength(sites);
          |                                                             ^
      162 |   });
      163 |
      164 |   it('suma las trece ocurrencias que enumera la spec', () => {

      at toHaveLength (src/__tests__/legibility-classnames.test.ts:161:61)

FAIL src/screens/forgot/index.test.tsx
  ● #61 R8: forgot tiene contenedor de scroll con safe areas › #172 R19: centra en horizontal pero no en vertical dentro de un ScrollView con insets

    expect(received).toEqual(expected) // deep equality

    - Expected  - 0
    + Received  + 1

      Object {
        "alignItems": "center",
        "flexGrow": 1,
        "gap": 16,
    +   "justifyContent": "center",
        "padding": 24,
        "paddingBottom": 48,
        "paddingTop": 52,
      }

      121 |     const screenRoot = screen.getByTestId('forgot-form');
      122 |
    > 123 |     expect(screenRoot.props.contentContainerStyle).toEqual({
          |                                                    ^
      124 |       flexGrow: 1,
      125 |       alignItems: 'center',
      126 |       padding: 24,

      at Object.toEqual (src/screens/forgot/index.test.tsx:123:52)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
  ● #172 R19: el espaciador empuja la CTA al pie en los dos estados

    Unable to find an element with testID: forgot-spacer

    <RNCSafeAreaProvider>
      <View
        testID="screen-forgot"
      >
        <RCTScrollView
          testID="forgot-form"
        >
          <View>
            <View
              testID="forgot-top"
            >
              <View
                accessibilityLabel="Volver"
                accessibilityRole="button"
                accessible={true}
                testID="forgot-back"
              >
                <RNSVGSvgView>
                  <RNSVGGroup>
                    <RNSVGGroup>
                      <RNSVGPath />
                    </RNSVGGroup>
                  </RNSVGGroup>
                </RNSVGSvgView>
              </View>
            </View>
            <View
              testID="forgot-pingo-float"
            >
              <ViewManagerAdapter_ExpoImage
                placeholder={[]}
                testID="forgot-pingo"
              />
            </View>
            <View
              testID="forgot-lock-tile"
            >
              <View
                testID="icon-lock"
              />
            </View>
            <Text
              testID="forgot-title"
            >
              Recuperar contraseña
            </Text>
            <Text
              testID="forgot-body"
            >
              Ingresa el correo electrónico asociado a tu cuenta y te enviaremos un enlace para restablecer tu contraseña.
            </Text>
            <View>
              <View
                accessible={true}
              >
                <Text>
                  Correo electrónico
                </Text>
              </View>
              <TextInput
                editable={true}
                testID="forgot-email"
                value=""
              />
            </View>
            <View
              accessibilityRole="button"
              accessibilityState={
                {
                  "disabled": true,
                }
              }
              accessible={true}
              testID="forgot-submit"
            >
              <View
                pointerEvents="none"
                style={
                  {
                    "opacity": 0,
                  }
                }
              />
              <Text>
                Enviar enlace de recuperación
              </Text>
            </View>
            <View
              accessibilityRole="button"
              accessibilityState={
                {
                  "disabled": false,
                }
              }
              accessible={true}
              testID="link-login"
            >
              <Text>
                Volver al inicio de sesión
              </Text>
            </View>
          </View>
        </RCTScrollView>
      </View>
    </RNCSafeAreaProvider>

      670 |   await renderRoute();
      671 |   function expectSpacer(ctaId: string) {
    > 672 |     const spacer = screen.getByTestId('forgot-spacer');
          |                           ^
      673 |     const cta = screen.getByTestId(ctaId);
      674 |     expect(spacer.parent).toBe(cta.parent);
      675 |     expect(spacer.parent).toBe(screen.getByTestId('forgot-top').parent);

      at getByTestId (src/screens/forgot/index.test.tsx:672:27)
      at Object.expectSpacer (src/screens/forgot/index.test.tsx:681:3)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
exit=1
```

#### c37 — jest

```bash
bunx jest --testTimeout=30000 --runTestsByPath src/screens/login/index.test.tsx src/screens/register/index.test.tsx src/screens/forgot/index.test.tsx src/screens/reset-password/index.test.tsx src/__tests__/account-screens-polish.test.ts src/__tests__/ui-language.test.ts src/__tests__/design-drift.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/legibility-classnames.test.ts
```

```text
PASS src/screens/login/index.test.tsx (7.537 s)
PASS src/screens/reset-password/index.test.tsx (8.309 s)
PASS src/__tests__/ui-language.test.ts
PASS src/__tests__/design-drift.test.ts
PASS src/__tests__/account-screens-polish.test.ts
PASS src/__tests__/legibility-classnames.test.ts
PASS src/__tests__/consistency-classnames.test.ts
PASS src/screens/register/index.test.tsx (11.47 s)
PASS src/screens/forgot/index.test.tsx
Test Suites: 9 passed, 9 total
Tests:       346 passed, 346 total
Time:        12.693 s, estimated 14 s
exit=0
```

#### c37 — router

```bash
test ! -e .expo/types/router.d.ts
```

```text

exit=0
```

#### c37 — typecheck

```bash
bun run typecheck
```

```text
$ tsc --noEmit
exit=0
```

#### c37 — lint

```bash
bunx expo lint --no-cache > /tmp/lint-172.log 2>&1
```

```text
vacio=0
exit=0
```

#### S19a — jest

```bash
bunx jest --testTimeout=30000 --runTestsByPath src/screens/login/index.test.tsx src/__tests__/account-screens-polish.test.ts
```

```text
FAIL src/__tests__/account-screens-polish.test.ts
FAIL src/screens/login/index.test.tsx (6.557 s)
Test Suites: 2 failed, 2 total
Tests:       2 failed, 35 passed, 37 total
Time:        7.271 s, estimated 8 s
  ● #172 R19: el contenido de cuenta no se centra en vertical y el enlace de nueva contraseña lleva su receta

    expect(received).toBe(expected) // Object.is equality

    Expected: 0
    Received: 1

      89 |   ] as const) {
      90 |     const source = readFileSync(join(sourceRoot, 'screens', name, 'index.tsx'), 'utf8');
    > 91 |     expect(source.split("justifyContent: 'center'").length - 1).toBe(counts[0]);
         |                                                                 ^
      92 |     expect(source.split("alignItems: 'center'").length - 1).toBe(counts[1]);
      93 |     expect(source.split('-spacer" className="flex-1" />').length - 1).toBe(counts[2]);
      94 |     expect(source.match(/testID="link-login"\s+className="h-13 w-full"/g) ?? []).toHaveLength(counts[3]);

      at Object.toBe (src/__tests__/account-screens-polish.test.ts:91:65)

FAIL src/screens/login/index.test.tsx (6.557 s)
  ● #61 R8: login tiene contenedor de scroll con safe areas › #172 R19: ancla el contenido al pie dentro de un ScrollView con los insets aplicados

    expect(received).toEqual(expected) // deep equality

    - Expected  - 0
    + Received  + 1

      Object {
        "flexGrow": 1,
        "gap": 16,
    +   "justifyContent": "center",
        "padding": 24,
        "paddingBottom": 48,
        "paddingTop": 52,
      }

      167 |     const screenRoot = screen.getByTestId('login-form');
      168 |
    > 169 |     expect(screenRoot.props.contentContainerStyle).toEqual({
          |                                                    ^
      170 |       flexGrow: 1,
      171 |       padding: 24,
      172 |       gap: 16,

      at Object.toEqual (src/screens/login/index.test.tsx:169:52)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
exit=1
```

#### S19a — restore

```bash
git checkout HEAD -- src/screens/login/index.tsx; git diff --quiet HEAD -- src/screens/login/index.tsx; echo "exit=$?"
```

```text
exit=0
exit=0
```

#### S19b — jest

```bash
bunx jest --testTimeout=30000 --runTestsByPath src/screens/login/index.test.tsx
```

```text
FAIL src/screens/login/index.test.tsx (7.736 s)
Test Suites: 1 failed, 1 total
Tests:       1 failed, 28 passed, 29 total
Time:        7.899 s
  ● #167 R6: Pingo saluda en login y la pantalla entra en dos tiempos › #172 R19: el espaciador empuja el envío al pie

    expect(received).toBe(expected) // Object.is equality

    Expected: 2
    Received: 4

      300 |       const children = spacer.parent?.children ?? [];
      301 |       const index = children.indexOf(spacer);
    > 302 |       expect(index).toBe(children.indexOf(cta) - 1);
          |                     ^
      303 |       expect(spacer.props.className).toBe('flex-1');
      304 |       expect(spacer.children).toHaveLength(0);
      305 |       if (withError) {

      at toBe (src/screens/login/index.test.tsx:302:21)
      at Object.expectSpacer (src/screens/login/index.test.tsx:309:5)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
exit=1
```

#### S19b — restore

```bash
git checkout HEAD -- src/screens/login/index.tsx; git diff --quiet HEAD -- src/screens/login/index.tsx; echo "exit=$?"
```

```text
exit=0
exit=0
```

#### S19c — jest

```bash
bunx jest --testTimeout=30000 --runTestsByPath src/screens/forgot/index.test.tsx
```

```text
FAIL src/screens/forgot/index.test.tsx (13.22 s)
Test Suites: 1 failed, 1 total
Tests:       1 failed, 40 passed, 41 total
Time:        13.437 s
  ● #172 R19: el espaciador empuja la CTA al pie en los dos estados

    Unable to find an element with testID: forgot-spacer

    <RNCSafeAreaProvider>
      <View
        testID="screen-forgot"
      >
        <RCTScrollView
          testID="forgot-form"
        >
          <View>
            <View
              testID="forgot-top"
            >
              <View
                accessibilityLabel="Volver"
                accessibilityRole="button"
                accessible={true}
                testID="forgot-back"
              >
                <RNSVGSvgView>
                  <RNSVGGroup>
                    <RNSVGGroup>
                      <RNSVGPath />
                    </RNSVGGroup>
                  </RNSVGGroup>
                </RNSVGSvgView>
              </View>
            </View>
            <View
              testID="forgot-pingo-float"
            >
              <ViewManagerAdapter_ExpoImage
                placeholder={[]}
                testID="forgot-pingo"
              />
            </View>
            <View
              testID="forgot-lock-tile"
            >
              <View
                testID="icon-lock"
              />
            </View>
            <Text
              testID="forgot-title"
            >
              Revisa tu correo
            </Text>
            <Text
              testID="forgot-body"
            >
              Si existe una cuenta para ana@example.com, te enviamos un enlace para restablecer tu contraseña. Revisa tu bandeja de entrada y la carpeta de spam.
            </Text>
            <View
              accessibilityRole="button"
              accessibilityState={
                {
                  "disabled": false,
                }
              }
              accessible={true}
              testID="forgot-resend"
            >
              <View
                pointerEvents="none"
                style={
                  {
                    "opacity": 0,
                  }
                }
              />
              <Text>
                Reenviar
              </Text>
            </View>
            <View
              accessibilityRole="button"
              accessibilityState={
                {
                  "disabled": false,
                }
              }
              accessible={true}
              testID="link-login"
            >
              <Text>
                Volver al inicio de sesión
              </Text>
            </View>
          </View>
        </RCTScrollView>
      </View>
    </RNCSafeAreaProvider>

      670 |   await renderRoute();
      671 |   function expectSpacer(ctaId: string) {
    > 672 |     const spacer = screen.getByTestId('forgot-spacer');
          |                           ^
      673 |     const cta = screen.getByTestId(ctaId);
      674 |     expect(spacer.parent).toBe(cta.parent);
      675 |     expect(spacer.parent).toBe(screen.getByTestId('forgot-top').parent);

      at getByTestId (src/screens/forgot/index.test.tsx:672:27)
      at Object.expectSpacer (src/screens/forgot/index.test.tsx:684:3)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
exit=1
```

#### S19c — restore

```bash
git checkout HEAD -- src/screens/forgot/index.tsx; git diff --quiet HEAD -- src/screens/forgot/index.tsx; echo "exit=$?"
```

```text
exit=0
exit=0
```

#### S19d — jest

```bash
bunx jest --testTimeout=30000 --runTestsByPath src/screens/reset-password/index.test.tsx
```

```text
FAIL src/screens/reset-password/index.test.tsx (7.609 s)
Test Suites: 1 failed, 1 total
Tests:       1 failed, 40 passed, 41 total
Time:        7.764 s, estimated 9 s
  ● #167 R10: Pingo y tarjeta de estado en nueva contraseña › #167 R10: el formulario entra en dos tiempos

    expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 1

    @@ -1,8 +1,8 @@
      Object {
        "reset-body": Object {
    -     "className": "flex-1 gap-4",
    +     "className": "gap-4",
          "index": 1,
        },
        "reset-header": Object {
          "className": "flex-row items-center gap-3",
          "index": 0,

      398 |     expect(Object.fromEntries(mockHomeEntrance.mock.calls.map(([p]) => [
      399 |       p.testID, { index: p.index, className: p.className },
    > 400 |     ]))).toEqual({
          |          ^
      401 |       'reset-header': { index: 0, className: 'flex-row items-center gap-3' },
      402 |       'reset-body': { index: 1, className: 'flex-1 gap-4' },
      403 |     });

      at Object.toEqual (src/screens/reset-password/index.test.tsx:400:10)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
exit=1
```

#### S19d — restore

```bash
git checkout HEAD -- src/screens/reset-password/index.tsx; git diff --quiet HEAD -- src/screens/reset-password/index.tsx; echo "exit=$?"
```

```text
exit=0
exit=0
```

#### S19e — jest

```bash
bunx jest --testTimeout=30000 --runTestsByPath src/screens/reset-password/index.test.tsx
```

```text
FAIL src/screens/reset-password/index.test.tsx (7.309 s)
Test Suites: 1 failed, 1 total
Tests:       2 failed, 39 passed, 41 total
Time:        7.456 s, estimated 8 s
  ● #167 R10: Pingo y tarjeta de estado en nueva contraseña › #172 R19: el formulario lleva el enlace de vuelta al login bajo el envío

    Unable to find an element with testID: link-login

    <RNCSafeAreaProvider>
      <View
        testID="screen-reset-password"
      >
        <RCTScrollView
          testID="reset-password-form"
        >
          <View>
            <View
              testID="reset-header"
            >
              <View
                testID="reset-pingo-float"
              >
                <ViewManagerAdapter_ExpoImage
                  placeholder={[]}
                  testID="reset-pingo"
                />
              </View>
              <Text>
                Restablecer contraseña
              </Text>
            </View>
            <View
              testID="reset-body"
            >
              <View>
                <View
                  accessible={true}
                >
                  <Text>
                    Nueva contraseña
                  </Text>
                </View>
                <View
                  testID="reset-password-group"
                >
                  <TextInput
                    editable={true}
                    testID="reset-password"
                    value=""
                  />
                  <View>
                    <View
                      accessibilityLabel="Mostrar contraseña"
                      accessibilityRole="button"
                      accessible={true}
                      testID="reset-password-toggle"
                    >
                      <View
                        testID="icon-eye"
                      />
                    </View>
                  </View>
                </View>
              </View>
              <View>
                <View
                  accessible={true}
                >
                  <Text>
                    Confirmar nueva contraseña
                  </Text>
                </View>
                <View
                  testID="reset-password-confirm-group"
                >
                  <TextInput
                    editable={true}
                    testID="reset-password-confirm"
                    value=""
                  />
                  <View>
                    <View
                      accessibilityLabel="Mostrar contraseña"
                      accessibilityRole="button"
                      accessible={true}
                      testID="reset-password-confirm-toggle"
                    >
                      <View
                        testID="icon-eye"
                      />
                    </View>
                  </View>
                </View>
              </View>
              <View
                testID="reset-spacer"
              />
              <View
                accessibilityRole="button"
                accessibilityState={
                  {
                    "disabled": false,
                  }
                }
                accessible={true}
                testID="reset-submit"
              >
                <View
                  pointerEvents="none"
                  style={
                    {
                      "opacity": 0,
                    }
                  }
                />
                <Text>
                  Actualizar contraseña
                </Text>
              </View>
            </View>
            <View
              accessibilityRole="button"
              accessibilityState={
                {
                  "disabled": false,
                }
              }
              accessible={true}
              testID="link-login"
            >
              <Text>
                Volver al inicio de sesión
              </Text>
            </View>
          </View>
        </RCTScrollView>
      </View>
    </RNCSafeAreaProvider>

      499 |     await renderRoute('reset-token-172');
      500 |     const body = screen.getByTestId('reset-body');
    > 501 |     const link = within(body).getByTestId('link-login');
          |                               ^
      502 |     expect(link).toHaveTextContent('Volver al inicio de sesión');
      503 |     expect(body.children.indexOf(link)).toBe(body.children.indexOf(screen.getByTestId('reset-submit')) + 1);
      504 |     await fireEvent.press(link);

      at Object.getByTestId (src/screens/reset-password/index.test.tsx:501:31)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
  ● #167 R10: Pingo y tarjeta de estado en nueva contraseña › #167 R10: la cabecera va antes que el cuerpo en el scroll

    expect(received).toEqual(expected) // deep equality

    - Expected  -  0
    + Received  + 88

    @@ -458,6 +458,94 @@
            >
              Actualizar contraseña
            </Text>
          </View>
        </View>,
    +   <View
    +     accessibilityRole="button"
    +     accessibilityState={
    +       Object {
    +         "busy": undefined,
    +         "checked": undefined,
    +         "disabled": false,
    +         "expanded": undefined,
    +         "selected": undefined,
    +       }
    +     }
    +     accessibilityValue={
    +       Object {
    +         "max": undefined,
    +         "min": undefined,
    +         "now": undefined,
    +         "text": undefined,
    +       }
    +     }
    +     accessible={true}
    +     className="pressable-feedback__root button__root button__root--variant-ghost button__root--size-md link-button__root h-13 w-full"
    +     collapsable={false}
    +     focusable={true}
    +     jestAnimatedProps={
    +       Object {
    +         "value": Object {},
    +       }
    +     }
    +     jestAnimatedStyle={
    +       Object {
    +         "value": Object {
    +           "transform": Array [
    +             Object {
    +               "scale": 1,
    +             },
    +           ],
    +         },
    +       }
    +     }
    +     jestInlineStyle={
    +       Array [
    +         Object {
    +           "borderCurve": "continuous",
    +         },
    +         Array [
    +           Object {
    +             "borderCurve": "continuous",
    +           },
    +           undefined,
    +         ],
    +       ]
    +     }
    +     onBlur={[Function onBlur]}
    +     onClick={[Function onClick]}
    +     onFocus={[Function onFocus]}
    +     onLayout={[Function anonymous]}
    +     onResponderGrant={[Function onResponderGrant]}
    +     onResponderMove={[Function onResponderMove]}
    +     onResponderRelease={[Function onResponderRelease]}
    +     onResponderTerminate={[Function onResponderTerminate]}
    +     onResponderTerminationRequest={[Function onResponderTerminationRequest]}
    +     onStartShouldSetResponder={[Function onStartShouldSetResponder]}
    +     style={
    +       Array [
    +         Object {
    +           "borderCurve": "continuous",
    +         },
    +         Object {
    +           "transform": Array [
    +             Object {
    +               "scale": 1,
    +             },
    +           ],
    +         },
    +         Object {
    +           "borderCurve": "continuous",
    +         },
    +         undefined,
    +       ]
    +     }
    +     testID="link-login"
    +   >
    +     <Text
    +       className="button__label button__label--variant-ghost button__label--size-md text-base font-bold text-accent-strong"
    +     >
    +       Volver al inicio de sesión
    +     </Text>
    +   </View>,
      ]

      558 |     const header = screen.getByTestId('reset-header');
      559 |     expect(header.parent?.parent).toHaveProperty('props.testID', 'reset-password-form');
    > 560 |     expect(header.parent?.children).toEqual([header, screen.getByTestId('reset-body')]);
          |                                     ^
      561 |   });
      562 |
      563 |   it('#167 R10: la tarjeta de estado es secondary con check y texto', async () => {

      at Object.toEqual (src/screens/reset-password/index.test.tsx:560:37)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
exit=1
```

#### S19e — restore

```bash
git checkout HEAD -- src/screens/reset-password/index.tsx; git diff --quiet HEAD -- src/screens/reset-password/index.tsx; echo "exit=$?"
```

```text
exit=0
exit=0
```

#### S19f — jest

```bash
bunx jest --testTimeout=30000 --runTestsByPath src/screens/register/index.test.tsx
```

```text
FAIL src/screens/register/index.test.tsx (8.782 s)
Test Suites: 1 failed, 1 total
Tests:       1 failed, 32 passed, 33 total
Time:        8.925 s, estimated 12 s
  ● #61 R7: register usa las métricas de pantalla uniformes › aplica el padding del contentContainerStyle con los safe-area insets

    expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 0

      Object {
    -   "flexGrow": 1,
        "gap": 16,
        "padding": 24,
        "paddingBottom": 120,
        "paddingTop": 52,
      }

      256 |     expect(
      257 |       screen.getByTestId('register-form').props.contentContainerStyle,
    > 258 |     ).toEqual({
          |       ^
      259 |       flexGrow: 1,
      260 |       padding: 24,
      261 |       gap: 16,

      at Object.toEqual (src/screens/register/index.test.tsx:258:7)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
exit=1
```

#### S19f — restore

```bash
git checkout HEAD -- src/screens/register/index.tsx; git diff --quiet HEAD -- src/screens/register/index.tsx; echo "exit=$?"
```

```text
exit=0
exit=0
```

#### S17d — jest

```bash
bunx jest --testTimeout=30000 --runTestsByPath src/screens/reset-password/index.test.tsx src/__tests__/account-screens-polish.test.ts src/__tests__/legibility-classnames.test.ts src/__tests__/ui-language.test.ts src/__tests__/design-drift.test.ts
```

```text
FAIL src/__tests__/account-screens-polish.test.ts
FAIL src/__tests__/ui-language.test.ts
FAIL src/__tests__/design-drift.test.ts
FAIL src/__tests__/legibility-classnames.test.ts
FAIL src/screens/reset-password/index.test.tsx (10.736 s)
Test Suites: 5 failed, 5 total
Tests:       6 failed, 170 passed, 176 total
Time:        11.498 s
  ● #172 R19: el contenido de cuenta no se centra en vertical y el enlace de nueva contraseña lleva su receta

    expect(received).toHaveLength(expected)

    Expected length: 2
    Received length: 1
    Received array:  ["testID=\"link-login\"
              className=\"h-13 w-full\""]

      92 |     expect(source.split("alignItems: 'center'").length - 1).toBe(counts[1]);
      93 |     expect(source.split('-spacer" className="flex-1" />').length - 1).toBe(counts[2]);
    > 94 |     expect(source.match(/testID="link-login"\s+className="h-13 w-full"/g) ?? []).toHaveLength(counts[3]);
         |                                                                                  ^
      95 |     expect(source.split('<LinkButton.Label className="text-base font-bold text-accent-strong">').length - 1).toBe(counts[4]);
      96 |     expect(source.split('self-center').length - 1).toBe(counts[5]);
      97 |   }

      at Object.toHaveLength (src/__tests__/account-screens-polish.test.ts:94:82)

FAIL src/__tests__/ui-language.test.ts
  ● #65 R11: restablecer contraseña resuelve su copy por clave › resuelve las 16 ocurrencias normativas

    expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 1

      Object {
        "file": "src/screens/reset-password/index.tsx",
        "key": "resetPassword.backToSignIn",
    -   "uses": 3,
    +   "uses": 2,
      }

      60 |       (directCalls?.length ?? 0) + (keyedConstants?.length ?? 0);
      61 |
    > 62 |     expect({ file, key, uses: resolvedUses }).toEqual({
         |                                               ^
      63 |       file,
      64 |       key,
      65 |       uses: expected,

      at toEqual (src/__tests__/ui-language.test.ts:62:47)
      at Object.checkUses (src/__tests__/ui-language.test.ts:199:5)
  ● #65 R18: los sitios resuelven por clave y no queda copy suelta › resuelve cada ocurrencia de la tabla contra la clave exacta

    expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 1

      Object {
        "file": "src/screens/reset-password/index.tsx",
        "key": "resetPassword.backToSignIn",
    -   "uses": 3,
    +   "uses": 2,
      }

      60 |       (directCalls?.length ?? 0) + (keyedConstants?.length ?? 0);
      61 |
    > 62 |     expect({ file, key, uses: resolvedUses }).toEqual({
         |                                               ^
      63 |       file,
      64 |       key,
      65 |       uses: expected,

      at toEqual (src/__tests__/ui-language.test.ts:62:47)
      at Object.checkUses (src/__tests__/ui-language.test.ts:492:5)

FAIL src/__tests__/design-drift.test.ts
  ● #149 R4: solo cuatro ficheros de producción navegan a login › #149 R4: inventaría cada ruta a login en producción

    expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 1

      Object {
        "screens/forgot/index.tsx": 2,
        "screens/register/index.tsx": 1,
    -   "screens/reset-password/index.tsx": 3,
    +   "screens/reset-password/index.tsx": 2,
        "screens/welcome/index.tsx": 1,
      }

      735 |     );
      736 |
    > 737 |     expect(actual).toEqual(loginRoutes);
          |                    ^
      738 |   });
      739 | });
      740 |

      at Object.toEqual (src/__tests__/design-drift.test.ts:737:20)

FAIL src/__tests__/legibility-classnames.test.ts
  ● #61 R4: el acento como tinta usa accent-strong › screens/reset-password/index.tsx pinta con text-accent-strong (4)

    expect(received).toHaveLength(expected)

    Expected length: 4
    Received length: 3
    Received array:  ["text-accent-strong", "text-accent-strong", "text-accent-strong"]

      159 |
      160 |   it.each(inkSites)('%s pinta con text-accent-strong (%i)', (path, sites) => {
    > 161 |     expect(readSource(path).match(/text-accent-strong\b/g)).toHaveLength(sites);
          |                                                             ^
      162 |   });
      163 |
      164 |   it('suma las trece ocurrencias que enumera la spec', () => {

      at toHaveLength (src/__tests__/legibility-classnames.test.ts:161:61)

FAIL src/screens/reset-password/index.test.tsx (10.736 s)
  ● #167 R10: Pingo y tarjeta de estado en nueva contraseña › #172 R19: el formulario lleva el enlace de vuelta al login bajo el envío

    Unable to find an element with testID: link-login

    <RNCSafeAreaProvider>
      <View
        testID="screen-reset-password"
      >
        <RCTScrollView
          testID="reset-password-form"
        >
          <View>
            <View
              testID="reset-header"
            >
              <View
                testID="reset-pingo-float"
              >
                <ViewManagerAdapter_ExpoImage
                  placeholder={[]}
                  testID="reset-pingo"
                />
              </View>
              <Text>
                Restablecer contraseña
              </Text>
            </View>
            <View
              testID="reset-body"
            >
              <View>
                <View
                  accessible={true}
                >
                  <Text>
                    Nueva contraseña
                  </Text>
                </View>
                <View
                  testID="reset-password-group"
                >
                  <TextInput
                    editable={true}
                    testID="reset-password"
                    value=""
                  />
                  <View>
                    <View
                      accessibilityLabel="Mostrar contraseña"
                      accessibilityRole="button"
                      accessible={true}
                      testID="reset-password-toggle"
                    >
                      <View
                        testID="icon-eye"
                      />
                    </View>
                  </View>
                </View>
              </View>
              <View>
                <View
                  accessible={true}
                >
                  <Text>
                    Confirmar nueva contraseña
                  </Text>
                </View>
                <View
                  testID="reset-password-confirm-group"
                >
                  <TextInput
                    editable={true}
                    testID="reset-password-confirm"
                    value=""
                  />
                  <View>
                    <View
                      accessibilityLabel="Mostrar contraseña"
                      accessibilityRole="button"
                      accessible={true}
                      testID="reset-password-confirm-toggle"
                    >
                      <View
                        testID="icon-eye"
                      />
                    </View>
                  </View>
                </View>
              </View>
              <View
                testID="reset-spacer"
              />
              <View
                accessibilityRole="button"
                accessibilityState={
                  {
                    "disabled": false,
                  }
                }
                accessible={true}
                testID="reset-submit"
              >
                <View
                  pointerEvents="none"
                  style={
                    {
                      "opacity": 0,
                    }
                  }
                />
                <Text>
                  Actualizar contraseña
                </Text>
              </View>
            </View>
          </View>
        </RCTScrollView>
      </View>
    </RNCSafeAreaProvider>

      499 |     await renderRoute('reset-token-172');
      500 |     const body = screen.getByTestId('reset-body');
    > 501 |     const link = within(body).getByTestId('link-login');
          |                               ^
      502 |     expect(link).toHaveTextContent('Volver al inicio de sesión');
      503 |     expect(body.children.indexOf(link)).toBe(body.children.indexOf(screen.getByTestId('reset-submit')) + 1);
      504 |     await fireEvent.press(link);

      at Object.getByTestId (src/screens/reset-password/index.test.tsx:501:31)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
exit=1
```

#### S17d — restore

```bash
git checkout HEAD -- src/screens/reset-password/index.tsx; git diff --quiet HEAD -- src/screens/reset-password/index.tsx; echo "exit=$?"
```

```text
exit=0
exit=0
```

#### c38 — jest

```bash
bunx jest --testTimeout=30000 --runTestsByPath src/__tests__/account-screens-polish.test.ts src/screens/login/index.test.tsx src/screens/register/index.test.tsx src/screens/forgot/index.test.tsx src/screens/reset-password/index.test.tsx
```

```text
FAIL src/screens/reset-password/index.test.tsx (16.814 s)
FAIL src/screens/forgot/index.test.tsx (17.47 s)
FAIL src/__tests__/account-screens-polish.test.ts
FAIL src/screens/login/index.test.tsx
FAIL src/screens/register/index.test.tsx (22.167 s)
Test Suites: 5 failed, 5 total
Tests:       8 failed, 149 passed, 157 total
Time:        24.404 s
  ● #127 R1: el botón de envío de reset-password lleva su receta en el árbol › pinta reset-submit con la clase exacta, rounded-xl y bg-accent incluidos, la vea o no el recorte de fuente

    expect(received).toBe(expected) // Object.is equality

    Expected: "pressable-feedback__root button__root button__root--variant-primary button__root--size-md w-full h-14 rounded-xl bg-accent border-b-4 border-black/25"
    Received: "pressable-feedback__root button__root button__root--variant-primary button__root--size-md w-full rounded-xl bg-accent border-b-4 border-black/25"

      328 |     await renderRoute('reset-token-127');
      329 |
    > 330 |     expect(screen.getByTestId('reset-submit').props.className).toBe(
          |                                                                ^
      331 |       'pressable-feedback__root button__root button__root--variant-primary button__root--size-md w-full h-14 rounded-xl bg-accent border-b-4 border-black/25',
      332 |     );
      333 |   });

      at Object.toBe (src/screens/reset-password/index.test.tsx:330:64)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

FAIL src/screens/forgot/index.test.tsx (17.47 s)
  ● #127 R1: el botón de envío de forgot lleva su receta en el árbol › pinta forgot-submit, deshabilitado, con la clase exacta, rounded-xl y bg-accent incluidos, la vea o no el recorte de fuente

    expect(received).toBe(expected) // Object.is equality

    Expected: "pressable-feedback__root button__root button__root--variant-primary button__root--size-md disabled:element-disabled w-full h-14 rounded-xl bg-accent border-b-4 border-black/25"
    Received: "pressable-feedback__root button__root button__root--variant-primary button__root--size-md disabled:element-disabled w-full rounded-xl bg-accent border-b-4 border-black/25"

      139 |     await renderRoute();
      140 |
    > 141 |     expect(screen.getByTestId('forgot-submit').props.className).toBe(
          |                                                                 ^
      142 |       'pressable-feedback__root button__root button__root--variant-primary button__root--size-md disabled:element-disabled w-full h-14 rounded-xl bg-accent border-b-4 border-black/25',
      143 |     );
      144 |   });

      at Object.toBe (src/screens/forgot/index.test.tsx:141:65)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

FAIL src/__tests__/account-screens-polish.test.ts
  ● #172 R20: login pinta la CTA de 56 y los inputs de 52

    expect(received).toBe(expected) // Object.is equality

    Expected: 1
    Received: 0

      107 | ] as const)('#172 R20: %s pinta la CTA de 56 y los inputs de 52', (_name, path, counts) => {
      108 |   const source = readFileSync(join(sourceRoot, path), 'utf8');
    > 109 |   expect(source.split('w-full h-14 rounded-xl bg-accent border-b-4 border-black/25').length - 1).toBe(counts[2]);
          |                                                                                                  ^
      110 |   expect(source.split('className="h-13 rounded-xl bg-default"').length - 1).toBe(counts[0]);
      111 |   expect(source.split('className="rounded-xl bg-default"').length - 1).toBe(counts[1]);
      112 |   expect(source.split('w-full rounded-xl').length - 1).toBe(counts[3]);

      at toBe (src/__tests__/account-screens-polish.test.ts:109:98)
  ● #172 R20: register pinta la CTA de 56 y los inputs de 52

    expect(received).toBe(expected) // Object.is equality

    Expected: 1
    Received: 0

      107 | ] as const)('#172 R20: %s pinta la CTA de 56 y los inputs de 52', (_name, path, counts) => {
      108 |   const source = readFileSync(join(sourceRoot, path), 'utf8');
    > 109 |   expect(source.split('w-full h-14 rounded-xl bg-accent border-b-4 border-black/25').length - 1).toBe(counts[2]);
          |                                                                                                  ^
      110 |   expect(source.split('className="h-13 rounded-xl bg-default"').length - 1).toBe(counts[0]);
      111 |   expect(source.split('className="rounded-xl bg-default"').length - 1).toBe(counts[1]);
      112 |   expect(source.split('w-full rounded-xl').length - 1).toBe(counts[3]);

      at toBe (src/__tests__/account-screens-polish.test.ts:109:98)
  ● #172 R20: forgot pinta la CTA de 56 y los inputs de 52

    expect(received).toBe(expected) // Object.is equality

    Expected: 1
    Received: 0

      107 | ] as const)('#172 R20: %s pinta la CTA de 56 y los inputs de 52', (_name, path, counts) => {
      108 |   const source = readFileSync(join(sourceRoot, path), 'utf8');
    > 109 |   expect(source.split('w-full h-14 rounded-xl bg-accent border-b-4 border-black/25').length - 1).toBe(counts[2]);
          |                                                                                                  ^
      110 |   expect(source.split('className="h-13 rounded-xl bg-default"').length - 1).toBe(counts[0]);
      111 |   expect(source.split('className="rounded-xl bg-default"').length - 1).toBe(counts[1]);
      112 |   expect(source.split('w-full rounded-xl').length - 1).toBe(counts[3]);

      at toBe (src/__tests__/account-screens-polish.test.ts:109:98)
  ● #172 R20: reset-password pinta la CTA de 56 y los inputs de 52

    expect(received).toBe(expected) // Object.is equality

    Expected: 1
    Received: 0

      107 | ] as const)('#172 R20: %s pinta la CTA de 56 y los inputs de 52', (_name, path, counts) => {
      108 |   const source = readFileSync(join(sourceRoot, path), 'utf8');
    > 109 |   expect(source.split('w-full h-14 rounded-xl bg-accent border-b-4 border-black/25').length - 1).toBe(counts[2]);
          |                                                                                                  ^
      110 |   expect(source.split('className="h-13 rounded-xl bg-default"').length - 1).toBe(counts[0]);
      111 |   expect(source.split('className="rounded-xl bg-default"').length - 1).toBe(counts[1]);
      112 |   expect(source.split('w-full rounded-xl').length - 1).toBe(counts[3]);

      at toBe (src/__tests__/account-screens-polish.test.ts:109:98)

FAIL src/screens/login/index.test.tsx
  ● #127 R1: el botón de envío de login lleva su receta en el árbol › pinta login-submit con la clase exacta, rounded-xl y bg-accent incluidos, la vea o no el recorte de fuente

    expect(received).toBe(expected) // Object.is equality

    Expected: "pressable-feedback__root button__root button__root--variant-primary button__root--size-md w-full h-14 rounded-xl bg-accent border-b-4 border-black/25"
    Received: "pressable-feedback__root button__root button__root--variant-primary button__root--size-md w-full rounded-xl bg-accent border-b-4 border-black/25"

      200 |     await renderLogin();
      201 |
    > 202 |     expect(screen.getByTestId('login-submit').props.className).toBe(
          |                                                                ^
      203 |       'pressable-feedback__root button__root button__root--variant-primary button__root--size-md w-full h-14 rounded-xl bg-accent border-b-4 border-black/25',
      204 |     );
      205 |   });

      at Object.toBe (src/screens/login/index.test.tsx:202:64)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

FAIL src/screens/register/index.test.tsx (22.167 s)
  ● #127 R1: el botón de envío de register lleva su receta en el árbol › pinta register-submit, deshabilitado al montar, con la clase exacta, rounded-xl y bg-accent incluidos, la vea o no el recorte de fuente

    expect(received).toBe(expected) // Object.is equality

    Expected: "pressable-feedback__root button__root button__root--variant-primary button__root--size-md disabled:element-disabled w-full h-14 rounded-xl bg-accent border-b-4 border-black/25"
    Received: "pressable-feedback__root button__root button__root--variant-primary button__root--size-md disabled:element-disabled w-full rounded-xl bg-accent border-b-4 border-black/25"

      296 |     await renderRegister();
      297 |
    > 298 |     expect(screen.getByTestId('register-submit').props.className).toBe(
          |                                                                   ^
      299 |       'pressable-feedback__root button__root button__root--variant-primary button__root--size-md disabled:element-disabled w-full h-14 rounded-xl bg-accent border-b-4 border-black/25',
      300 |     );
      301 |   });

      at Object.toBe (src/screens/register/index.test.tsx:298:67)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
exit=1
```

#### c39 — jest

```bash
bunx jest --testTimeout=30000 --runTestsByPath src/__tests__/account-screens-polish.test.ts src/components/__tests__/password-input.test.tsx src/screens/login/index.test.tsx src/screens/register/index.test.tsx src/screens/forgot/index.test.tsx src/screens/reset-password/index.test.tsx src/__tests__/ui-language.test.ts src/__tests__/design-drift.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/legibility-classnames.test.ts
```

```text
PASS src/screens/forgot/index.test.tsx (9.988 s)
PASS src/screens/reset-password/index.test.tsx (10.373 s)
PASS src/components/__tests__/password-input.test.tsx
PASS src/screens/register/index.test.tsx (13.886 s)
PASS src/__tests__/ui-language.test.ts
PASS src/screens/login/index.test.tsx
PASS src/__tests__/account-screens-polish.test.ts
PASS src/__tests__/legibility-classnames.test.ts
PASS src/__tests__/design-drift.test.ts
PASS src/__tests__/consistency-classnames.test.ts
Test Suites: 10 passed, 10 total
Tests:       355 passed, 355 total
Time:        16.048 s, estimated 25 s
exit=0
```

#### c39 — router

```bash
test ! -e .expo/types/router.d.ts
```

```text

exit=0
```

#### c39 — typecheck

```bash
bun run typecheck
```

```text
$ tsc --noEmit
exit=0
```

#### c39 — lint

```bash
bunx expo lint --no-cache > /tmp/lint-172.log 2>&1
```

```text
vacio=0
exit=0
```

#### S20a — jest

```bash
bunx jest --testTimeout=30000 --runTestsByPath src/__tests__/account-screens-polish.test.ts
```

```text
FAIL src/__tests__/account-screens-polish.test.ts
Test Suites: 1 failed, 1 total
Tests:       1 failed, 12 passed, 13 total
Time:        1.686 s
  ● #172 R20: forgot pinta la CTA de 56 y los inputs de 52

    expect(received).toBe(expected) // Object.is equality

    Expected: 0
    Received: 1

      110 |   expect(source.split('className="h-13 rounded-xl bg-default"').length - 1).toBe(counts[0]);
      111 |   expect(source.split('className="rounded-xl bg-default"').length - 1).toBe(counts[1]);
    > 112 |   expect(source.split('w-full rounded-xl').length - 1).toBe(counts[3]);
          |                                                        ^
      113 |   expect(source.split('w-full h-14 rounded-xl border-2 border-b-6 border-lip-gray bg-surface').length - 1).toBe(counts[4]);
      114 | });
      115 |

      at toBe (src/__tests__/account-screens-polish.test.ts:112:56)
exit=1
```

#### S20a — restore

```bash
git checkout HEAD -- src/screens/forgot/index.tsx; git diff --quiet HEAD -- src/screens/forgot/index.tsx; echo "exit=$?"
```

```text
exit=0
exit=0
```

#### S20b — jest

```bash
bunx jest --testTimeout=30000 --runTestsByPath src/__tests__/account-screens-polish.test.ts
```

```text
FAIL src/__tests__/account-screens-polish.test.ts
Test Suites: 1 failed, 1 total
Tests:       1 failed, 12 passed, 13 total
Time:        1.208 s, estimated 2 s
  ● #172 R20: login pinta la CTA de 56 y los inputs de 52

    expect(received).toBe(expected) // Object.is equality

    Expected: 1
    Received: 0

      108 |   const source = readFileSync(join(sourceRoot, path), 'utf8');
      109 |   expect(source.split('w-full h-14 rounded-xl bg-accent border-b-4 border-black/25').length - 1).toBe(counts[2]);
    > 110 |   expect(source.split('className="h-13 rounded-xl bg-default"').length - 1).toBe(counts[0]);
          |                                                                             ^
      111 |   expect(source.split('className="rounded-xl bg-default"').length - 1).toBe(counts[1]);
      112 |   expect(source.split('w-full rounded-xl').length - 1).toBe(counts[3]);
      113 |   expect(source.split('w-full h-14 rounded-xl border-2 border-b-6 border-lip-gray bg-surface').length - 1).toBe(counts[4]);

      at toBe (src/__tests__/account-screens-polish.test.ts:110:77)
exit=1
```

#### S20b — restore

```bash
git checkout HEAD -- src/screens/login/index.tsx; git diff --quiet HEAD -- src/screens/login/index.tsx; echo "exit=$?"
```

```text
exit=0
exit=0
```

#### S20c — jest

```bash
bunx jest --testTimeout=30000 --runTestsByPath src/screens/reset-password/index.test.tsx
```

```text
FAIL src/screens/reset-password/index.test.tsx (10.96 s)
Test Suites: 1 failed, 1 total
Tests:       1 failed, 40 passed, 41 total
Time:        11.11 s
  ● #127 R1: el botón de envío de reset-password lleva su receta en el árbol › pinta reset-submit con la clase exacta, rounded-xl y bg-accent incluidos, la vea o no el recorte de fuente

    expect(received).toBe(expected) // Object.is equality

    Expected: "pressable-feedback__root button__root button__root--variant-primary button__root--size-md w-full h-14 rounded-xl bg-accent border-b-4 border-black/25"
    Received: "pressable-feedback__root button__root button__root--variant-primary button__root--size-lg w-full h-14 rounded-xl bg-accent border-b-4 border-black/25"

      328 |     await renderRoute('reset-token-127');
      329 |
    > 330 |     expect(screen.getByTestId('reset-submit').props.className).toBe(
          |                                                                ^
      331 |       'pressable-feedback__root button__root button__root--variant-primary button__root--size-md w-full h-14 rounded-xl bg-accent border-b-4 border-black/25',
      332 |     );
      333 |   });

      at Object.toBe (src/screens/reset-password/index.test.tsx:330:64)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
exit=1
```

#### S20c — restore

```bash
git checkout HEAD -- src/screens/reset-password/index.tsx; git diff --quiet HEAD -- src/screens/reset-password/index.tsx; echo "exit=$?"
```

```text
exit=0
exit=0
```

#### S20d — jest

```bash
bunx jest --testTimeout=30000 --runTestsByPath src/__tests__/account-screens-polish.test.ts src/components/__tests__/password-input.test.tsx
```

```text
FAIL src/__tests__/account-screens-polish.test.ts
FAIL src/components/__tests__/password-input.test.tsx (5.141 s)
Test Suites: 2 failed, 2 total
Tests:       2 failed, 15 passed, 17 total
Time:        5.639 s
  ● #172 R20: password-input pinta la CTA de 56 y los inputs de 52

    expect(received).toBe(expected) // Object.is equality

    Expected: 1
    Received: 0

      108 |   const source = readFileSync(join(sourceRoot, path), 'utf8');
      109 |   expect(source.split('w-full h-14 rounded-xl bg-accent border-b-4 border-black/25').length - 1).toBe(counts[2]);
    > 110 |   expect(source.split('className="h-13 rounded-xl bg-default"').length - 1).toBe(counts[0]);
          |                                                                             ^
      111 |   expect(source.split('className="rounded-xl bg-default"').length - 1).toBe(counts[1]);
      112 |   expect(source.split('w-full rounded-xl').length - 1).toBe(counts[3]);
      113 |   expect(source.split('w-full h-14 rounded-xl border-2 border-b-6 border-lip-gray bg-surface').length - 1).toBe(counts[4]);

      at toBe (src/__tests__/account-screens-polish.test.ts:110:77)

FAIL src/components/__tests__/password-input.test.tsx (5.141 s)
  ● #172 R8: PasswordInput › #172 R8: el grupo envuelve el campo de 52 y el botón de 44

    expect(received).toContain(expected) // indexOf

    Expected value: "h-13"
    Received array: ["input__input", "ios:outline-2", "ios:outline-transparent", "ios:focus:outline-accent", "android:border-[1.5px]", "android:border-transparent", "android:focus:border-accent", "rtl:text-right", "input__input--variant-primary", "ios:shadow-field", …]

      72 |     expect(group).toContainElement(toggle);
      73 |     for (const token of ['h-13', 'rounded-xl', 'bg-default']) {
    > 74 |       expect(input.props.className.split(' ')).toContain(token);
         |                                                ^
      75 |     }
      76 |     expect(toggle.props.className).toBe('size-11 items-center justify-center');
      77 |   });

      at Object.toContain (src/components/__tests__/password-input.test.tsx:74:48)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
exit=1
```

#### S20d — restore

```bash
git checkout HEAD -- src/components/password-input.tsx; git diff --quiet HEAD -- src/components/password-input.tsx; echo "exit=$?"
```

```text
exit=0
exit=0
```

#### T22-counts — counts

```bash
command grep -cE '^\s*it(\.each)?[(<]' src/screens/login/index.test.tsx src/screens/register/index.test.tsx src/screens/forgot/index.test.tsx src/screens/reset-password/index.test.tsx src/__tests__/ui-language.test.ts src/__tests__/design-drift.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/legibility-classnames.test.ts src/theme/__tests__/global-css.test.ts src/providers/__tests__/language-provider.test.tsx src/theme/__tests__/motion.test.ts src/theme/__tests__/font-registration.test.ts src/components/__tests__/back-button.test.tsx src/components/__tests__/pingo-float.test.tsx src/components/__tests__/form-error.test.tsx src/components/__tests__/password-input.test.tsx src/__tests__/account-screens-polish.test.ts
```

```text
src/screens/login/index.test.tsx:26
src/screens/register/index.test.tsx:30
src/screens/forgot/index.test.tsx:34
src/screens/reset-password/index.test.tsx:34
src/__tests__/ui-language.test.ts:28
src/__tests__/design-drift.test.ts:51
src/__tests__/consistency-classnames.test.ts:33
src/__tests__/legibility-classnames.test.ts:12
src/theme/__tests__/global-css.test.ts:31
src/providers/__tests__/language-provider.test.tsx:20
src/theme/__tests__/motion.test.ts:17
src/theme/__tests__/font-registration.test.ts:4
src/components/__tests__/back-button.test.tsx:5
src/components/__tests__/pingo-float.test.tsx:3
src/components/__tests__/form-error.test.tsx:3
src/components/__tests__/password-input.test.tsx:4
src/__tests__/account-screens-polish.test.ts:6
Bloques finales=341; H0=289; delta=52
exit=0
```

#### T22-wait — espera_carga

```bash
cd /home/claude/sites/Pet-Tracker-wt-172/mobile-pet-tracker && for i in $(seq 1 90); do pgrep -f 'node_modules/(\.bin/(jest|eslint)|jest-worker)|[i]nit\.sh' > /dev/null || break; sleep 60; done; echo "fin-espera"
```

```text
fin-espera
exit=0
```

#### T22-base — jest

```bash
bunx jest --testTimeout=30000 --runTestsByPath src/screens/login/index.test.tsx src/screens/register/index.test.tsx src/screens/forgot/index.test.tsx src/screens/reset-password/index.test.tsx src/theme/__tests__/global-css.test.ts src/providers/__tests__/language-provider.test.tsx src/theme/__tests__/motion.test.ts src/theme/__tests__/font-registration.test.ts src/__tests__/ui-language.test.ts src/__tests__/design-drift.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/legibility-classnames.test.ts src/components/__tests__/back-button.test.tsx src/components/__tests__/pingo-float.test.tsx src/components/__tests__/form-error.test.tsx src/components/__tests__/password-input.test.tsx src/__tests__/account-screens-polish.test.ts
```

```text
PASS src/components/__tests__/form-error.test.tsx (6.139 s)
PASS src/components/__tests__/back-button.test.tsx
PASS src/components/__tests__/password-input.test.tsx (8.118 s)
PASS src/providers/__tests__/language-provider.test.tsx
PASS src/__tests__/account-screens-polish.test.ts
PASS src/components/__tests__/pingo-float.test.tsx
PASS src/theme/__tests__/global-css.test.ts
PASS src/theme/__tests__/font-registration.test.ts
PASS src/screens/reset-password/index.test.tsx (10.949 s)
PASS src/screens/forgot/index.test.tsx
PASS src/theme/__tests__/motion.test.ts
PASS src/screens/login/index.test.tsx
PASS src/__tests__/design-drift.test.ts
PASS src/__tests__/ui-language.test.ts
PASS src/__tests__/legibility-classnames.test.ts
PASS src/__tests__/consistency-classnames.test.ts
PASS src/screens/register/index.test.tsx (9.637 s)
Test Suites: 17 passed, 17 total
Tests:       470 passed, 470 total
Time:        20.101 s, estimated 23 s
exit=0
```

#### T22-readers — jest

```bash
bunx jest --testTimeout=30000 --runTestsByPath src/theme/__tests__/motion.test.ts 'src/app/(tabs)/__tests__/food.test.tsx' src/__tests__/hero-header-amendments.test.ts src/screens/welcome/index.test.tsx
```

```text
PASS src/__tests__/hero-header-amendments.test.ts
PASS src/theme/__tests__/motion.test.ts
PASS src/screens/welcome/index.test.tsx (8.452 s)
PASS src/app/(tabs)/__tests__/food.test.tsx (9.118 s)
Test Suites: 4 passed, 4 total
Tests:       192 passed, 192 total
Time:        10.206 s, estimated 21 s
exit=0
```

#### T22-final — router

```bash
test ! -e .expo/types/router.d.ts
```

```text

exit=0
```

#### T22-final — typecheck

```bash
bun run typecheck
```

```text
$ tsc --noEmit
exit=0
```

#### T22-final — lint

```bash
bunx expo lint --no-cache > /tmp/lint-172.log 2>&1
```

```text
vacio=0
exit=0
```

#### T22-B3 — anchor

```bash
command grep -cF 'text-xs font-semibold text-foreground' src/screens/login/index.tsx src/screens/register/index.tsx src/screens/forgot/index.tsx
```

```text
src/screens/login/index.tsx:0
src/screens/register/index.tsx:0
src/screens/forgot/index.tsx:0
exit=1
```

#### T22-B4 — anchor

```bash
command grep -c 'selectable' src/screens/login/index.tsx src/screens/register/index.tsx src/screens/forgot/index.tsx src/screens/reset-password/index.tsx
```

```text
src/screens/login/index.tsx:0
src/screens/register/index.tsx:0
src/screens/forgot/index.tsx:0
src/screens/reset-password/index.tsx:2
exit=0
```

#### T22-B5 — anchor

```bash
command grep -c 'text-accent-strong' src/screens/login/index.tsx src/screens/register/index.tsx src/screens/forgot/index.tsx src/screens/reset-password/index.tsx
```

```text
src/screens/login/index.tsx:2
src/screens/register/index.tsx:0
src/screens/forgot/index.tsx:1
src/screens/reset-password/index.tsx:4
exit=0
```

#### T22-B6 — anchor

```bash
command grep -cF "'/login'" src/screens/login/index.tsx src/screens/register/index.tsx src/screens/forgot/index.tsx src/screens/reset-password/index.tsx
```

```text
src/screens/login/index.tsx:0
src/screens/register/index.tsx:1
src/screens/forgot/index.tsx:1
src/screens/reset-password/index.tsx:3
exit=0
```

#### T22-fallback — anchor

```bash
command grep -c 'fallback="/login"' src/screens/forgot/index.tsx
```

```text
1
exit=0
```

#### T22-B10 — anchor

```bash
awk '/export const R1_AUTH/{f=1;next} f&&/^\];/{print n; exit} f&&/\{ file:/{n++}' src/__tests__/ui-copy-table.ts
```

```text
41
exit=0
```

#### T22-B11 — anchor

```bash
command grep -cE "^  '[a-zA-Z]+\.[a-zA-Z.]+':" src/i18n/catalog.ts
```

```text
774
exit=0
```

#### T22-B12 — anchor

```bash
command grep -c 'isInvalid={Boolean(fieldErrors\.' src/screens/register/index.tsx
```

```text
7
exit=0
```

#### T22-B14 — anchor

```bash
command grep -c 'accessibilityLiveRegion' src/screens/reset-password/index.tsx
```

```text
1
exit=0
```

#### T22-B15 — anchor

```bash
command grep -cF '## Enmienda #172' ../docs/ui-guidelines.md
```

```text
1
exit=0
```

#### T22-B16 — anchor

```bash
command grep '^### §2\.' ../specs/mobile-ui-language/design.md | tail -1
```

```text
### §2.27 — Añadidos por #172 — Las pantallas de cuenta como el canvas
exit=0
```

#### T22-B17 — anchor

```bash
command grep -cF 'size-16 items-center justify-center rounded-xl bg-accent-soft' src/screens/forgot/index.test.tsx src/__tests__/consistency-classnames.test.ts
```

```text
src/screens/forgot/index.test.tsx:0
src/__tests__/consistency-classnames.test.ts:0
exit=1
```

#### T22-tile-nuevo — anchor

```bash
command grep -cF 'size-13 items-center justify-center rounded-xl border-b-4 border-black/25 bg-accent' src/screens/forgot/index.test.tsx src/__tests__/consistency-classnames.test.ts src/screens/forgot/index.tsx
```

```text
src/screens/forgot/index.test.tsx:5
src/__tests__/consistency-classnames.test.ts:1
src/screens/forgot/index.tsx:1
exit=0
```

#### T22-lock-helper — anchor

```bash
command grep -c 'LOCK_TILE_CLASS' src/screens/forgot/index.test.tsx
```

```text
0
exit=1
```

#### T22-messages — anchor

```bash
command grep -c -- '-message"' src/screens/register/index.tsx
```

```text
7
exit=0
```

#### T22-B21 — anchor

```bash
command grep -c '^export const' src/theme/motion.ts
```

```text
19
exit=0
```

#### T22-B22 — anchor

```bash
command grep -cF 'rounded-xl bg-default"' src/screens/login/index.tsx src/screens/register/index.tsx src/screens/forgot/index.tsx src/screens/reset-password/index.tsx
```

```text
src/screens/login/index.tsx:1
src/screens/register/index.tsx:5
src/screens/forgot/index.tsx:1
src/screens/reset-password/index.tsx:0
exit=0
```

#### T22-B23-justify — anchor

```bash
command grep -cF "justifyContent: 'center'" src/screens/login/index.tsx src/screens/register/index.tsx src/screens/forgot/index.tsx src/screens/reset-password/index.tsx
```

```text
src/screens/login/index.tsx:0
src/screens/register/index.tsx:0
src/screens/forgot/index.tsx:0
src/screens/reset-password/index.tsx:1
exit=0
```

#### T22-B23-align — anchor

```bash
command grep -cF "alignItems: 'center'" src/screens/login/index.tsx src/screens/register/index.tsx src/screens/forgot/index.tsx src/screens/reset-password/index.tsx
```

```text
src/screens/login/index.tsx:0
src/screens/register/index.tsx:0
src/screens/forgot/index.tsx:1
src/screens/reset-password/index.tsx:1
exit=0
```

#### T22-font-token — anchor

```bash
command grep -cF -- "--font-extrabold: 'Inter-ExtraBold';" src/theme/global.css
```

```text
1
exit=0
```

#### T22-font-sha — anchor

```bash
sha256sum assets/fonts/Inter-ExtraBold.ttf
```

```text
e6756ad5690b77606aa62249a7b420d9902d45cae4b0048a24911fd4324b0a22  assets/fonts/Inter-ExtraBold.ttf
exit=0
```

#### T22-B26-primarios — anchor

```bash
command grep -cF 'w-full rounded-xl bg-accent border-b-4 border-black/25' src/screens/login/index.tsx src/screens/register/index.tsx src/screens/forgot/index.tsx src/screens/reset-password/index.tsx
```

```text
src/screens/login/index.tsx:0
src/screens/register/index.tsx:0
src/screens/forgot/index.tsx:0
src/screens/reset-password/index.tsx:0
exit=1
```

#### T22-B26-botones — anchor

```bash
command grep -cF 'w-full rounded-xl' src/screens/login/index.tsx src/screens/register/index.tsx src/screens/forgot/index.tsx src/screens/reset-password/index.tsx
```

```text
src/screens/login/index.tsx:0
src/screens/register/index.tsx:0
src/screens/forgot/index.tsx:0
src/screens/reset-password/index.tsx:0
exit=1
```

#### T22-B27 — anchor

```bash
command grep -cF 'text-xs font-semibold text-foreground' src/screens/reset-password/index.tsx
```

```text
0
exit=1
```

#### T22-B28 — anchor

```bash
command grep -c 'secureTextEntry' src/screens/login/index.tsx src/screens/register/index.tsx src/screens/forgot/index.tsx src/screens/reset-password/index.tsx
```

```text
src/screens/login/index.tsx:0
src/screens/register/index.tsx:0
src/screens/forgot/index.tsx:0
src/screens/reset-password/index.tsx:0
exit=1
```

#### T22-casillas — anchor

```bash
command grep -cE '^- \[[ xX]\] Enmienda aprobada por humano' ../docs/ui-guidelines.md
```

```text
5
exit=0
```

#### T22-missing-token — anchor

```bash
git diff -U0 e0178ab5 -- src/screens/reset-password/index.tsx | command grep -c '^[-+].*reset-missing-token'
```

```text
0
exit=1
```

#### T22-immutable — anchor

```bash
git diff --quiet e0178ab5 -- package.json bun.lock src/components/card.tsx src/screens/welcome
```

```text

exit=0
```

#### T22-motion-diff — anchor

```bash
git diff e0178ab5 -- src/theme/motion.ts
```

```text
diff --git a/mobile-pet-tracker/src/theme/motion.ts b/mobile-pet-tracker/src/theme/motion.ts
index 374d6d33..6ed4d3ad 100644
--- a/mobile-pet-tracker/src/theme/motion.ts
+++ b/mobile-pet-tracker/src/theme/motion.ts
@@ -55,3 +55,11 @@ export const MOTION_PING_TIMING = {
   easing: Easing.bezier(0.23, 1, 0.32, 1),
   reduceMotion: ReduceMotion.System,
 };
+
+// #172 R4
+export const MOTION_PINGO_FLOAT_OFFSET_Y = 10;
+export const MOTION_PINGO_FLOAT_TIMING = {
+  duration: 1500,
+  easing: Easing.bezier(0.42, 0, 0.58, 1),
+  reduceMotion: ReduceMotion.System,
+};
exit=0
```

#### T22-B7 — anchor

```bash
command grep -rhoE --include=*.ts --include=*.tsx --exclude=*.test.ts --exclude=*.test.tsx --exclude-dir=__tests__ bg-accent-soft src | wc -l
```

```text
17
exit=0
```

#### T22-B8-a — anchor

```bash
command grep -rhoE --include=*.ts --include=*.tsx --exclude=*.test.ts --exclude=*.test.tsx --exclude-dir=__tests__ '\bborder-b-4\b' src | wc -l
```

```text
20
exit=0
```

#### T22-B8-b — anchor

```bash
command grep -rhoE --include=*.ts --include=*.tsx --exclude=*.test.ts --exclude=*.test.tsx --exclude-dir=__tests__ border-black/25 src | wc -l
```

```text
20
exit=0
```

#### T22-B9 — anchor

```bash
command grep -rhoE --include=*.ts --include=*.tsx --exclude=*.test.ts --exclude=*.test.tsx --exclude-dir=__tests__ 'style=\{CONTINUOUS_CORNER\}' src | wc -l
```

```text
37
exit=0
```

#### T22-InputGroup — anchor

```bash
command grep -rlE --include=*.ts --include=*.tsx --exclude=*.test.ts --exclude=*.test.tsx --exclude-dir=__tests__ InputGroup src | wc -l
```

```text
1
exit=0
```

#### T22-flex-2 — anchor

```bash
command grep -rlE --include=*.ts --include=*.tsx --exclude=*.test.ts --exclude=*.test.tsx --exclude-dir=__tests__ flex-2 src | wc -l
```

```text
1
exit=0
```

#### T22-extrabold — anchor

```bash
command grep -rlE --include=*.ts --include=*.tsx --exclude=*.test.ts --exclude=*.test.tsx --exclude-dir=__tests__ 'extrabold|ExtraBold' src | wc -l
```

```text
5
exit=0
```

#### T22-B25 — anchor

```bash
command grep -rlE --include=*.ts --include=*.tsx --exclude=*.test.ts --exclude=*.test.tsx --exclude-dir=__tests__ '\bh-1[34]\b' src | wc -l
```

```text
5
exit=0
```

#### T22-B19 — anchor

```bash
command grep -rlF -e 'Country (2-letter code)' -e 'País (código de 2 letras)' src | command grep -v 'src/i18n/catalog.ts'
```

```text

exit=1
```

#### T22-fonts — anchor

```bash
ls assets/fonts | wc -l
```

```text
6
exit=0
```

#### T22-B20 — anchor

```bash
sumatorio SCREEN_FILES en src/__tests__/ui-language.test.ts
```

```text
19 + 2 + 1 + 1 + 1 + 1 + 1 + 1 + 1
        + 1 - 1
        + 1
        + 1
        + 2 - 2
        + 2
B20=32
exit=0
```

#### T22-history — history

```bash
git log --oneline e0178ab5..HEAD
```

```text
4ba7e139 feat(mobile): CTA de 56 e inputs de 52 en las pantallas de cuenta (R20)
9cf701c4 test(mobile): CTA de 56 e inputs de 52 en las pantallas de cuenta (R20)
398f074b feat(mobile): la CTA de cuenta se ancla al pie (R19)
e040579e test(mobile): la CTA de cuenta se ancla al pie (R19)
dc6df815 docs(ui): enmienda de la carta para las pantallas de cuenta (R18)
10763864 test(mobile): la carta declara la enmienda de las pantallas de cuenta (R18)
3f10a364 test(mobile): los componentes nuevos entran en la guarda de deriva (R17)
9f1b2350 test(mobile): filas de uso de las claves de cuenta (R16)
1bb27800 docs(mobile-account-screens-polish): #172 S15 conforme a E5
8959232c docs(mobile-account-screens-polish): #172 firma Enmienda E5
2ae3d423 docs(mobile-account-screens-polish): #172 Enmienda E5, S15 y S17b con sus rojos en cascada
aa26cdaa docs(mobile-account-screens-polish): #172 bloqueo en S15
944b727a docs(mobile-account-screens-polish): #172 trazabilidad parcial hasta c31
0e5bb776 test(mobile): el error de login cuelga del scroll (R15)
5aa8fa5e docs(mobile-account-screens-polish): #172 S14 conforme a E4
8b53e558 docs(mobile-account-screens-polish): #172 firma Enmienda E4
e2382088 docs(mobile-account-screens-polish): #172 Enmienda E4, la sonda S14 da 6 fallos
bc67060b docs(mobile-account-screens-polish): #172 bloqueo en S14
ca0049df docs(mobile-account-screens-polish): #172 trazabilidad parcial hasta c30
7ddda8f5 feat(mobile): el candado de recuperar es un tile acento con labio (R14)
7b4c79b3 test(mobile): el candado de recuperar es un tile acento con labio (R14)
81a3a4c6 feat(mobile): la tarjeta de éxito avisa con liveRegion (R13)
2103b60e test(mobile): la tarjeta de éxito avisa con liveRegion (R13)
b2607357 feat(mobile): validación del correo en el registro (R12)
ded50874 test(mobile): validación del correo en el registro (R12)
fbcb4e9e feat(mobile): rejilla del registro (R11)
d7604772 test(mobile): rejilla del registro (R11)
ddd467d9 docs(mobile-account-screens-polish): #172 firma Enmienda E3
74fc9a8a docs(mobile-account-screens-polish): #172 Enmienda E3, sonda S10b fuera del gate de FieldError
4ed76d4c docs(mobile-account-screens-polish): #172 bloqueo en S10b
14c69144 feat(mobile): errores por campo del registro con icono (R10)
ca1bac6b test(mobile): errores por campo del registro con icono (R10)
45e4c40e feat(mobile): mostrar y ocultar la contraseña en cuenta (R8)
1ad828d3 test(mobile): mostrar y ocultar la contraseña en cuenta (R8)
e1dcae38 feat(mobile): FormError en las cuatro pantallas de cuenta (R9)
28ad44aa test(mobile): FormError con icono y texto seleccionable (R9)
7d56bacb feat(mobile): enlaces y orden del cuerpo de login (R7)
36f46603 test(mobile): enlaces y orden del cuerpo de login (R7)
4b5675c6 feat(mobile): recetas de texto e Inter ExtraBold en cuenta (R6)
b8384616 test(mobile): recetas de texto e Inter ExtraBold en cuenta (R6)
984043e1 feat(mobile): fila Volver en login, registro y recuperar (R3)
29e2acf6 test(mobile): fila Volver en login, registro y recuperar (R3)
60d26f5c feat(mobile): Pingo flota en registro, recuperar y nueva contraseña (R5)
1b4551c7 test(mobile): Pingo flota en registro, recuperar y nueva contraseña (R5)
c12c676f feat(mobile): Pingo flota 10 px en 3 s en cuenta (R4)
edf99020 test(mobile): tipa translateY en el candado de Pingo (R4)
75f849a6 test(mobile): orden de sort en el inventario de motion (R4)
a03a9d98 docs(mobile-account-screens-polish): #172 firma Enmienda E2
02a31628 docs(mobile-account-screens-polish): #172 Enmienda E2, orden de sort en motion
8ac30127 docs(mobile-account-screens-polish): #172 informe de implementación
09a8e195 docs(mobile-account-screens-polish): #172 trazabilidad
e31582c3 test(mobile): Pingo flota 10 px en 3 s en cuenta (R4)
4cdb12db feat(mobile): BackButton (R2)
b3fe30be test(mobile): BackButton vuelve o reemplaza (R2)
505332c9 feat(mobile): claves de Volver, del ojo y País (R16)
c1bd4a6a test(mobile): claves de Volver, del ojo y País (R16)
67ff28c3 feat(mobile): tokens de texto 13, 15 y 17 (R1)
3a87fac0 test(mobile): tokens de texto 13, 15 y 17 (R1)
94ddc750 docs(mobile-account-screens-polish): #172 firma Enmienda E1
exit=0
```

### Anclas intermedias verificadas

```text
c32: B10=41; B20=32
c32: toHaveLength(29 + 7 + 1 + 4); // #117 R10, #167 R6, #172 R16 =1
c32: + 2 // #172 R16: back-button y password-input =1
c35: ## Enmienda #172 =1; casillas Enmienda aprobada por humano =5
c37: justifyContent=0,0,0,1; alignItems=0,0,1,1
c37: espaciadores flex-1=1,1,1,2; self-center=0,0,0,0
c37: login-body y reset-body flex-1 gap-4=1,1; B5=2,0,1,4; B6=0,1,1,3
c37: líneas de diff que cambian reset-missing-token=0
c39: B22=1,5,1,0; Input viejo=0,0,0,0; B26=0,0,0,0; B25=5
```

Las anclas literales completas de T22 están reproducidas arriba, en sus
entradas T22-B3 hasta T22-B20 y los demás nombres descriptivos.

### Desviaciones y cierre

1. **Carga en c35.** El lint inicial devolvió exit=0 pero dejó en el log
   `error: Failed to run "eslint" due to signal SIGKILL` y vacio=1; el gate
   combinado salió con exit=1. Se ejecutó literalmente la espera de hasta
   30 iteraciones y se obtuvo fin-espera. El filtro primero detectaba Jest
   ajeno y después un shell de espera cuyo comando mencionaba Jest. Se
   mantuvo el comando prescrito hasta terminar el bucle, sin alterar ni
   cancelar procesos ajenos. Se relanzó solo lint una vez: exit=0, vacio=0.
   No se repitieron el Jest ni typecheck de c35. La espera de T22 (hasta 90
   iteraciones) terminó de inmediato con fin-espera.
2. **Mediciones auxiliares.** Un conteo auxiliar de B10 incluyó la
   declaración UseRow y dio 42; se sustituyó por el awk normativo, que dio
   41. El primer cálculo Python del sumatorio B20 falló por conservar los
   saltos de línea; al normalizar el texto dio 32. No se ajustaron tests,
   anclas ni producción: las mediciones normativas y sus gates coincidieron.
3. **Documentación de reanudación.** Se marcó S15 conforme a E5 antes de
   empezar c32 en `1bb27800 docs(mobile-account-screens-polish): #172 S15 conforme a E5`.
   Ese commit de informe no se renumera como parte del guion. S14 y S15
   conservan sus salidas históricas y no se repitieron.
4. En esta reanudación no hubo discrepancias con las tablas firmadas, nuevos
   timeouts, instalaciones nuevas, cambios en dependencias ni cambios en los
   commits del leader. Las skills cargadas y las prohibiciones del handoff
   siguieron vigentes. Los bloqueos y el correctivo de tipado de R4 de las
   reanudaciones previas quedan documentados en sus secciones históricas.
5. Trazabilidad completa R1–R20 en
   `b04f1289 docs(mobile-account-screens-polish): #172 trazabilidad completa`.
   El informe se cierra aparte con el comando literal:

   ```bash
   git commit --only ../progress/impl_mobile-account-screens-polish.md -m 'docs(mobile-account-screens-polish): #172 informe de implementación completo'
   ```

   R21 queda pendiente (humano). El árbol queda limpio al cierre, y el
   leader conserva la revisión, init.sh y el bookkeeping.
