# Implementación — #172 mobile-account-screens-polish

> Worktree: `/home/claude/sites/Pet-Tracker-wt-172`.
> Branch: `feature/172-mobile-account-screens-polish`.
> H0 al arrancar: `e0178ab5c1f67e917cf4116332a0e9196d67b344`.
> Fecha: 2026-10-13. Estado: **detenida en T4/c8; feature incompleta**.

## Bloqueo y punto de reanudación

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

## Estado entregado

- R1 y R2 implementados con sus sondas; parte de R16 implementada y comprobada.
- R4 tiene solo el commit rojo c7 en el árbol; su implementación sigue pendiente.
- R3, R5–R15 y R17–R20 pendientes. R21: pendiente (humano).
- Traspaso al leader: corregir R4/T4 y continuar en c8. El leader ejecuta
  `./init.sh` y organiza reviewer, push y PR cuando termine el guion.
- No se tocaron feature_list.json, progress/current.md, STATUS.md, el
  frontmatter de la spec, package.json ni bun.lock. La firma E1 ajena es
  el único cambio adicional en requirements.md contra H0.
