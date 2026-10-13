# Implementación — #172 mobile-account-screens-polish

> Worktree: `/home/claude/sites/Pet-Tracker-wt-172`.
> Branch: `feature/172-mobile-account-screens-polish`.
> H0 al arrancar: `e0178ab5c1f67e917cf4116332a0e9196d67b344`.
> Fecha: 2026-10-13. Estado final: **detenida en T11/S10b; feature incompleta**.


> Reanudación 1 resolvió el bloqueo inicial con E2 y avanzó hasta c22.
> El bloqueo actual es S10b: falla un `it` distinto del prescrito. R1–R9 están
> implementados y verificados en sus gates; R10 queda pendiente de reconciliar
> la sonda. R16 es parcial; R11–R15 y R17–R20 siguen pendientes; R21 es humano.

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

## Tabla de commits del guion

| Commit | Hash | Mensaje literal | Línea Tests: | Rojos y tipo |
|---|---|---|---|---|
| c1 | 3a87fac0 | `test(mobile): tokens de texto 13, 15 y 17 (R1)` | `Tests:       1 failed, 53 passed, 54 total` | 1 aserción (toMatchObject) |
| c2 | 67ff28c3 | `feat(mobile): tokens de texto 13, 15 y 17 (R1)` | `Tests:       248 passed, 248 total` | 0 |
| c3 | c1bd4a6a | `test(mobile): claves de Volver, del ojo y País (R16)` | `Tests:       2 failed, 27 passed, 29 total` | 2 aserciones (longitud y valor) |
| c4 | 505332c9 | `feat(mobile): claves de Volver, del ojo y País (R16)` | `Tests:       223 passed, 223 total` | 0 |
| c5 | b3fe30be | `test(mobile): BackButton vuelve o reemplaza (R2)` | `Tests:       0 total` | 1 suite módulo; 0 tests |
| c6 | 4cdb12db | `feat(mobile): BackButton (R2)` | `Tests:       199 passed, 199 total` | 0 |
| c7 | e31582c3 | `test(mobile): Pingo flota 10 px en 3 s en cuenta (R4)` | `Tests:       2 failed, 15 passed, 17 total` | 1 suite módulo + 2 tests por aserción |
| c8 | — | `feat(mobile): Pingo flota 10 px en 3 s en cuenta (R4) — NO COMMITTEADO` | `Tests:       1 failed, 213 passed, 214 total` | 1 aserción inesperada (no exporta nada más); esperado 0 |

Los commits rojos solo incluyen tests. c2, c4 y c6 incluyen solo producción
(c4 también registra el copy en la spec de idioma). Todos los commits se
hicieron tras comprobar la rama y con `git add` de rutas explícitas.
`git status --short` quedó vacío tras cada commit.

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

### Bloqueo actual — T11/S10b

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
