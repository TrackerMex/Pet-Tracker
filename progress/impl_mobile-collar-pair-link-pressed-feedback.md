/home/claude/sites/Pet-Tracker
feature/138-mobile-collar-pair-link-pressed-feedback

## Antes

Aprobación humana marcada (2026-09-29). Guarda router.d.ts: exit=0.

Skills cargadas: `building-native-ui` (plugin Expo; el SKILL.md instalado declara 1.0.1), `appllama-app-design-skill` y `ponytail` (full). Carta y spec prevalecen: opacidad instantánea; simulator loop sustituido por R5 del humano. No se cargó animate-expo.

origin/main: `768493962e5d3f6b55ba53390dddedeba29fa3d7`.

Blobs de base, todos coincidentes:

- `screens/home/index.tsx`: `cb61d0c64deb0c911031a8468a8c397255b53979`
- `screens/home/index.test.tsx`: `04135c8e262f601ad61670f34c4d959192d150c9`
- `__tests__/consistency-classnames.test.ts`: `e62f88ad4d60178a18323551f5eb6d19641dbd72`
- `theme/native-styles.ts`: `4e5939f9bf5ce0c0d1282b1dfb05f134d0997de2`

## Base medida

`bunx jest --runTestsByPath src/screens/home/index.test.tsx`: exit=0.

```text
Test Suites: 1 passed, 1 total
Tests:       167 passed, 167 total
Snapshots:   0 total
```

`bunx jest --runTestsByPath src/__tests__/consistency-classnames.test.ts`: exit=0.

```text
Test Suites: 1 passed, 1 total
Tests:       53 passed, 53 total
Snapshots:   0 total
```

`bunx jest`: exit=0.

```text
Test Suites: 86 passed, 86 total
Tests:       1610 passed, 1610 total
Snapshots:   1 passed, 1 total
```

## R1 rojo natural

Blob de control: `cd94d1d5932eb23e13bc2fd49e39dd6a8b440adc`. `bunx jest --runTestsByPath src/screens/home/index.test.tsx`: exit=1. Por aserción, reposo. Expected: `{ borderCurve: continuous, opacity: 1 }`; Received: `{ borderCurve: continuous }`.

```text
  ● R10 (mobile-device-pairing): la collar card sin collar enlaza a /pairing › #138 R1: el botón baja a opacidad 0.8 mientras se pulsa y vuelve a 1 al soltarlo, con la esquina continua

    expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 0

      Object {
        "borderCurve": "continuous",
    -   "opacity": 1,
      }

      949 |     // #138 R1: the whole style with toEqual, at rest and pressed. toHaveStyle
      950 |     // matches a subset and would let a stray key or a lost corner through.
    > 951 |     expect(link.props.style).toEqual({
          |                              ^
      952 |       borderCurve: 'continuous',
      953 |       opacity: 1,
      954 |     });

      at Object.toEqual (src/screens/home/index.test.tsx:951:30)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 167 passed, 168 total
Snapshots:   0 total
Time:        19.319 s, estimated 21 s
Ran all test suites within paths "src/screens/home/index.test.tsx".
```

## R2 rojo natural

Blob de control: `d919055869711334eeca54c4e725d26789558e6d`. `bunx jest --runTestsByPath src/screens/home/index.test.tsx`: exit=1. R1 por aserción en reposo; R2 por aserción del style (radio verde). Ambos Expected: `{ borderCurve: continuous, opacity: 1 }`; Received: `{ borderCurve: continuous }`.

```text
  ● R10 (mobile-device-pairing): la collar card sin collar enlaza a /pairing › #138 R1: el botón baja a opacidad 0.8 mientras se pulsa y vuelve a 1 al soltarlo, con la esquina continua

    expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 0

      Object {
        "borderCurve": "continuous",
    -   "opacity": 1,
      }

      949 |     // #138 R1: the whole style with toEqual, at rest and pressed. toHaveStyle
      950 |     // matches a subset and would let a stray key or a lost corner through.
    > 951 |     expect(link.props.style).toEqual({
          |                              ^
      952 |       borderCurve: 'continuous',
      953 |       opacity: 1,
      954 |     });

      at Object.toEqual (src/screens/home/index.test.tsx:951:30)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

  ● R10 (mobile-device-pairing): la collar card sin collar enlaza a /pairing › #138 R2: en reposo, el botón lleva rounded-xl como único radio y la esquina continua con opacidad 1

    expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 0

      Object {
        "borderCurve": "continuous",
    -   "opacity": 1,
      }

      1000 |         .filter((token: string) => /^rounded(?:-|$)/.test(token)),
      1001 |     ).toEqual(['rounded-xl']);
    > 1002 |     expect(link.props.style).toEqual({
           |                              ^
      1003 |       borderCurve: 'continuous',
      1004 |       opacity: 1,
      1005 |     });

      at Object.toEqual (src/screens/home/index.test.tsx:1002:30)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

Test Suites: 1 failed, 1 total
Tests:       2 failed, 167 passed, 169 total
Snapshots:   0 total
Time:        18.321 s, estimated 20 s
Ran all test suites within paths "src/screens/home/index.test.tsx".
```

## R3 rojo natural

Blob de control: `b6c352b56d03eaf4b242f46fbc0d3b7460eaf2c7`. `bunx jest --runTestsByPath src/__tests__/consistency-classnames.test.ts`: exit=1. Ambos rojos por aserción toHaveLength (Expected 0, Received 1); «fusiona la esquina una vez...» verde.

```text
  ● #62 R14: toda esquina no-cápsula que dibuja el repo es continua › screens/home/index.tsx importa y aplica sus 0 esquinas

    expect(received).toHaveLength(expected)

    Expected length: 0
    Received length: 1
    Received array:  [["style={CONTINUOUS_CORNER}"]]

      286 |       /import \{[^}]*\bCONTINUOUS_CORNER\b[^}]*\} from ['"].*theme\/native-styles['"];/,
      287 |     );
    > 288 |     expect(uses).toHaveLength(count);
          |                  ^
      289 |
      290 |     for (const use of uses) {
      291 |       const openingTag = source.slice(

      at toHaveLength (src/__tests__/consistency-classnames.test.ts:288:18)

  ● #98 R10: los candados que esta feature no mueve › deja CONTINUOUS_CORNER, bg-accent-soft y el acento donde estaban

    expect(received).toHaveLength(expected)

    Expected length: 0
    Received length: 1
    Received array:  ["style={CONTINUOUS_CORNER}"]

      392 |     // #138 R3: collar-pair-link's corner moved too, so the Home has none left.
      393 |     // With no match, match() returns null: the ?? [] keeps the count readable.
    > 394 |     expect(home.match(/style=\{CONTINUOUS_CORNER\}/g) ?? []).toHaveLength(0);
          |                                                              ^
      395 |     expect(food.match(/style=\{CONTINUOUS_CORNER\}/g)).toHaveLength(2);
      396 |     expect(count(/style=\{CONTINUOUS_CORNER\}/g)).toBe(31);
      397 |     expect(count(/rounded-xl bg-accent(?=[\s'"`])/g)).toBe(13);

      at Object.toHaveLength (src/__tests__/consistency-classnames.test.ts:394:62)

Test Suites: 1 failed, 1 total
Tests:       2 failed, 51 passed, 53 total
Snapshots:   0 total
Time:        1.835 s
Ran all test suites within paths "src/__tests__/consistency-classnames.test.ts".
```

## Commits de tests por requisito

- R1: `6dc6570b767c95ee6479eee606bf700628029c79` (solo test, rojo natural; Home en `cb61d0c64deb0c911031a8468a8c397255b53979`).
- R2: `22309656208fd73e00be3bb7659899826209751b` (solo test, rojo natural; Home en `cb61d0c64deb0c911031a8468a8c397255b53979`).
- R3: `d9878554aec1651babda4094df836a803c16b8b2` (solo test, rojo natural; Home en `cb61d0c64deb0c911031a8468a8c397255b53979`).

## Verde común R1, R2, R3

Home: `0d439ebc386fbed4be6acf76b426383224eb602a` (848 líneas).

`bunx jest --runTestsByPath src/screens/home/index.test.tsx`: exit=0.

```text
Test Suites: 1 passed, 1 total
Tests:       169 passed, 169 total
Snapshots:   0 total
```

`bunx jest --runTestsByPath src/__tests__/consistency-classnames.test.ts`: exit=0.

```text
Test Suites: 1 passed, 1 total
Tests:       53 passed, 53 total
Snapshots:   0 total
```

`bunx jest`: exit=0.

```text
Test Suites: 86 passed, 86 total
Tests:       1612 passed, 1612 total
Snapshots:   1 passed, 1 total
```

Guarda router.d.ts antes de tsc: exit=0. `bunx tsc --noEmit`: exit=0; `bunx eslint src/screens/home/index.tsx src/screens/home/index.test.tsx src/__tests__/consistency-classnames.test.ts`: exit=0. Ambos logs vacíos.

Commit verde común (solo Home): `828aade35f5b921e6efa825f5792fc71d9a9c765`.

Delta: +0 suites, +2 tests, +0 snapshots; Home +2, consistencia +0.

## Tabla de las 15 sondas

Todas se aplicaron una a una; hash-object antes de medir. Tras cada una se restauró la Home con `git checkout HEAD -- mobile-pet-tracker/src/screens/home/index.tsx`; tras constant también native-styles.ts con HEAD. `git status --porcelain -- mobile-pet-tracker` y `git diff --cached --name-only`: salida vacía las 15 veces. Nada versionado. Los ocho grep -cxF de anclaje dieron 1 antes de empezar.

| Sonda | Mutación | Blob | Spec y exigido (222 tests) | medido |
|---|---|---|---|---|
| `norecipe` | la receta vuelve a `                      style={CONTINUOUS_CORNER}` (es la Home de base) | `cb61d0c6` | rojo 4: `#138 R1` (reposo) y `#138 R2` (`style`), por `toEqual`; `#62 R14 › screens/home/index.tsx importa y aplica sus 0 esquinas` y `#98 R10 › deja CONTINUOUS_CORNER, bg-accent-soft y el acento donde estaban`, por `toHaveLength`  blob=cb61d0c64deb0c911031a8468a8c397255b53979; exit=1; Test Suites: 2 failed, 2 total<br>Tests:       4 failed, 218 passed, 222 total<br>Snapshots:   0 total<br>#62 R14: toda esquina no-cápsula que dibuja el repo es continua › screens/home/index.tsx importa y aplica sus 0 esquinas; primera línea: expect(received).toHaveLength(expected); línea &gt;: &gt; 288 &#124;     expect(uses).toHaveLength(count);; por aserción<br>#98 R10: los candados que esta feature no mueve › deja CONTINUOUS_CORNER, bg-accent-soft y el acento donde estaban; primera línea: expect(received).toHaveLength(expected); línea &gt;: &gt; 394 &#124;     expect(home.match(/style=\{CONTINUOUS_CORNER\}/g) ?? []).toHaveLength(0);; por aserción<br>R10 (mobile-device-pairing): la collar card sin collar enlaza a /pairing › #138 R1: el botón baja a opacidad 0.8 mientras se pulsa y vuelve a 1 al soltarlo, con la esquina continua; aserción: style en reposo; primera línea: expect(received).toEqual(expected) // deep equality; línea &gt;: &gt; 951 &#124;     expect(link.props.style).toEqual({; por aserción<br>R10 (mobile-device-pairing): la collar card sin collar enlaza a /pairing › #138 R2: en reposo, el botón lleva rounded-xl como único radio y la esquina continua con opacidad 1; aserción: style en reposo; primera línea: expect(received).toEqual(expected) // deep equality; línea &gt;: &gt; 1002 &#124;     expect(link.props.style).toEqual({; por aserción |
| `pressed07` | la opacidad pasa a `                        opacity: pressed ? 0.7 : 1,` | `3b0d41bd` | rojo 1: `#138 R1`, por `toEqual`, en el pulsado  blob=3b0d41bd78f958eda3b500b711c350aecfb7f831; exit=1; Test Suites: 1 failed, 1 passed, 2 total<br>Tests:       1 failed, 221 passed, 222 total<br>Snapshots:   0 total<br>R10 (mobile-device-pairing): la collar card sin collar enlaza a /pairing › #138 R1: el botón baja a opacidad 0.8 mientras se pulsa y vuelve a 1 al soltarlo, con la esquina continua; aserción: pulsado (paso 2); primera línea: expect(received).toEqual(expected) // deep equality; línea &gt;: &gt; 963 &#124;     expect(link.props.style).toEqual({; por aserción |
| `rest09` | la opacidad pasa a `                        opacity: pressed ? 0.8 : 0.9,` | `2e696c30` | rojo 2: `#138 R1` (reposo) y `#138 R2` (`style`), por `toEqual`  blob=2e696c30b33f5486aa0ba139db61d550cac0718d; exit=1; Test Suites: 1 failed, 1 passed, 2 total<br>Tests:       2 failed, 220 passed, 222 total<br>Snapshots:   0 total<br>R10 (mobile-device-pairing): la collar card sin collar enlaza a /pairing › #138 R1: el botón baja a opacidad 0.8 mientras se pulsa y vuelve a 1 al soltarlo, con la esquina continua; aserción: style en reposo; primera línea: expect(received).toEqual(expected) // deep equality; línea &gt;: &gt; 951 &#124;     expect(link.props.style).toEqual({; por aserción<br>R10 (mobile-device-pairing): la collar card sin collar enlaza a /pairing › #138 R2: en reposo, el botón lleva rounded-xl como único radio y la esquina continua con opacidad 1; aserción: style en reposo; primera línea: expect(received).toEqual(expected) // deep equality; línea &gt;: &gt; 1002 &#124;     expect(link.props.style).toEqual({; por aserción |
| `nocorner` | se borra la esquina | `0fe120e5` | rojo 2: `#138 R1` (reposo) y `#138 R2` (`style`), por `toEqual`  blob=0fe120e58f56954eae4d36acf277b761f28b650f; exit=1; Test Suites: 1 failed, 1 passed, 2 total<br>Tests:       2 failed, 220 passed, 222 total<br>Snapshots:   0 total<br>R10 (mobile-device-pairing): la collar card sin collar enlaza a /pairing › #138 R1: el botón baja a opacidad 0.8 mientras se pulsa y vuelve a 1 al soltarlo, con la esquina continua; aserción: style en reposo; primera línea: expect(received).toEqual(expected) // deep equality; línea &gt;: &gt; 951 &#124;     expect(link.props.style).toEqual({; por aserción<br>R10 (mobile-device-pairing): la collar card sin collar enlaza a /pairing › #138 R2: en reposo, el botón lleva rounded-xl como único radio y la esquina continua con opacidad 1; aserción: style en reposo; primera línea: expect(received).toEqual(expected) // deep equality; línea &gt;: &gt; 1002 &#124;     expect(link.props.style).toEqual({; por aserción |
| `pressnocorner` | la esquina pasa a `                        ...(pressed ? {} : CONTINUOUS_CORNER),` | `3e128e46` | rojo 1: `#138 R1`, por `toEqual`, en el pulsado  blob=3e128e4668a6e385e8935dc446f74356a2c0e496; exit=1; Test Suites: 1 failed, 1 passed, 2 total<br>Tests:       1 failed, 221 passed, 222 total<br>Snapshots:   0 total<br>R10 (mobile-device-pairing): la collar card sin collar enlaza a /pairing › #138 R1: el botón baja a opacidad 0.8 mientras se pulsa y vuelve a 1 al soltarlo, con la esquina continua; aserción: pulsado (paso 2); primera línea: expect(received).toEqual(expected) // deep equality; línea &gt;: &gt; 963 &#124;     expect(link.props.style).toEqual({; por aserción |
| `restnocorner` | la esquina pasa a `                        ...(pressed ? CONTINUOUS_CORNER : {}),` | `95c251ad` | rojo 2: `#138 R1` (reposo) y `#138 R2` (`style`), por `toEqual`  blob=95c251ad839b0935ead1dc7b4c7851d8da0b483f; exit=1; Test Suites: 1 failed, 1 passed, 2 total<br>Tests:       2 failed, 220 passed, 222 total<br>Snapshots:   0 total<br>R10 (mobile-device-pairing): la collar card sin collar enlaza a /pairing › #138 R1: el botón baja a opacidad 0.8 mientras se pulsa y vuelve a 1 al soltarlo, con la esquina continua; aserción: style en reposo; primera línea: expect(received).toEqual(expected) // deep equality; línea &gt;: &gt; 951 &#124;     expect(link.props.style).toEqual({; por aserción<br>R10 (mobile-device-pairing): la collar card sin collar enlaza a /pairing › #138 R2: en reposo, el botón lleva rounded-xl como único radio y la esquina continua con opacidad 1; aserción: style en reposo; primera línea: expect(received).toEqual(expected) // deep equality; línea &gt;: &gt; 1002 &#124;     expect(link.props.style).toEqual({; por aserción |
| `stray` | debajo de la opacidad, `                        overflow: 'hidden',` | `b254ce12` | rojo 2: `#138 R1` (reposo) y `#138 R2` (`style`), por `toEqual`  blob=b254ce1295f345946115e04dc1397656d5de9f5f; exit=1; Test Suites: 1 failed, 1 passed, 2 total<br>Tests:       2 failed, 220 passed, 222 total<br>Snapshots:   0 total<br>R10 (mobile-device-pairing): la collar card sin collar enlaza a /pairing › #138 R1: el botón baja a opacidad 0.8 mientras se pulsa y vuelve a 1 al soltarlo, con la esquina continua; aserción: style en reposo; primera línea: expect(received).toEqual(expected) // deep equality; línea &gt;: &gt; 951 &#124;     expect(link.props.style).toEqual({; por aserción<br>R10 (mobile-device-pairing): la collar card sin collar enlaza a /pairing › #138 R2: en reposo, el botón lleva rounded-xl como único radio y la esquina continua con opacidad 1; aserción: style en reposo; primera línea: expect(received).toEqual(expected) // deep equality; línea &gt;: &gt; 1002 &#124;     expect(link.props.style).toEqual({; por aserción |
| `nostyle` | se borra la receta entera (las cuatro líneas) | `f9751976` | rojo 2: `#138 R1` (reposo) y `#138 R2` (`style`), por `toEqual`  blob=f97519769320e9866e57838992ea5433633d1dfb; exit=1; Test Suites: 1 failed, 1 passed, 2 total<br>Tests:       2 failed, 220 passed, 222 total<br>Snapshots:   0 total<br>R10 (mobile-device-pairing): la collar card sin collar enlaza a /pairing › #138 R1: el botón baja a opacidad 0.8 mientras se pulsa y vuelve a 1 al soltarlo, con la esquina continua; aserción: style en reposo; primera línea: expect(received).toEqual(expected) // deep equality; línea &gt;: &gt; 951 &#124;     expect(link.props.style).toEqual({; por aserción<br>R10 (mobile-device-pairing): la collar card sin collar enlaza a /pairing › #138 R2: en reposo, el botón lleva rounded-xl como único radio y la esquina continua con opacidad 1; aserción: style en reposo; primera línea: expect(received).toEqual(expected) // deep equality; línea &gt;: &gt; 1002 &#124;     expect(link.props.style).toEqual({; por aserción |
| `array` | la receta pasa a `                      style={({ pressed }) => [`, `                        CONTINUOUS_CORNER,`, `                        { opacity: pressed ? 0.8 : 1 },`, `                      ]}` | `5c49aa16` | rojo 2: `#138 R1` (reposo) y `#138 R2` (`style`), por `toEqual`. Candado de forma, a propósito ([[design]] §D2)  blob=5c49aa16f3e08437debc470726db739a0cc1ea3c; exit=1; Test Suites: 1 failed, 1 passed, 2 total<br>Tests:       2 failed, 220 passed, 222 total<br>Snapshots:   0 total<br>R10 (mobile-device-pairing): la collar card sin collar enlaza a /pairing › #138 R1: el botón baja a opacidad 0.8 mientras se pulsa y vuelve a 1 al soltarlo, con la esquina continua; aserción: style en reposo; primera línea: expect(received).toEqual(expected) // deep equality; línea &gt;: &gt; 951 &#124;     expect(link.props.style).toEqual({; por aserción<br>R10 (mobile-device-pairing): la collar card sin collar enlaza a /pairing › #138 R2: en reposo, el botón lleva rounded-xl como único radio y la esquina continua con opacidad 1; aserción: style en reposo; primera línea: expect(received).toEqual(expected) // deep equality; línea &gt;: &gt; 1002 &#124;     expect(link.props.style).toEqual({; por aserción |
| `sticky` | encima de la línea de estado, `  const [collarStuck, setCollarStuck] = useState(false);`. La receta pasa a `                      style={{`, la esquina, `                        opacity: collarStuck ? 0.8 : 1,`, `                      }}` y `                      onPressIn={() => setCollarStuck(true)}` | `4c681b1a` | rojo 1: `#138 R1`, por `toEqual`, dentro del `waitFor` tras `responderTerminate`  blob=4c681b1ab1c960879adfa09116589179df60d500; exit=1; Test Suites: 1 failed, 1 passed, 2 total<br>Tests:       1 failed, 221 passed, 222 total<br>Snapshots:   0 total<br>R10 (mobile-device-pairing): la collar card sin collar enlaza a /pairing › #138 R1: el botón baja a opacidad 0.8 mientras se pulsa y vuelve a 1 al soltarlo, con la esquina continua; aserción: waitFor (paso 3); primera línea: expect(received).toEqual(expected) // deep equality; línea &gt;: &gt; 977 &#124;     await waitFor(() =&gt;; por aserción |
| `hidden` | la condición pasa a `              {detail.data.pet.device !== null ? (` | `e2527453` | rojo 4: `#138 R1`, `#138 R2` y `shows the pair action for a pet without a collar and opens pairing`, **por consulta** (`Unable to find an element with testID: collar-pair-link`); `does not show the pair action when the pet has a collar`, por aserción (`toBeNull`)  blob=e252745368786a3c3629089d2dfd3b00b59a397b; exit=1; Test Suites: 1 failed, 1 passed, 2 total<br>Tests:       4 failed, 218 passed, 222 total<br>Snapshots:   0 total<br>R10 (mobile-device-pairing): la collar card sin collar enlaza a /pairing › shows the pair action for a pet without a collar and opens pairing; aserción: consulta del testID; primera línea: Unable to find an element with testID: collar-pair-link; línea &gt;: &gt; 911 &#124;     const link = await screen.findByTestId(&#x27;collar-pair-link&#x27;);; por consulta<br>R10 (mobile-device-pairing): la collar card sin collar enlaza a /pairing › does not show the pair action when the pet has a collar; aserción: ausencia con collar; primera línea: expect(received).toBeNull(); línea &gt;: &gt; 936 &#124;     expect(screen.queryByTestId(&#x27;collar-pair-link&#x27;)).toBeNull();; por aserción<br>R10 (mobile-device-pairing): la collar card sin collar enlaza a /pairing › #138 R1: el botón baja a opacidad 0.8 mientras se pulsa y vuelve a 1 al soltarlo, con la esquina continua; aserción: consulta del testID; primera línea: Unable to find an element with testID: collar-pair-link; línea &gt;: &gt; 947 &#124;     const link = await screen.findByTestId(&#x27;collar-pair-link&#x27;);; por consulta<br>R10 (mobile-device-pairing): la collar card sin collar enlaza a /pairing › #138 R2: en reposo, el botón lleva rounded-xl como único radio y la esquina continua con opacidad 1; aserción: consulta del testID; primera línea: Unable to find an element with testID: collar-pair-link; línea &gt;: &gt; 993 &#124;     const link = await screen.findByTestId(&#x27;collar-pair-link&#x27;);; por consulta |
| `rounded_full` | el `className` pasa a `                      className="min-h-11 items-center justify-center rounded-xl rounded-full bg-accent-soft px-4"` | `07d4f8a1` | rojo 1: **solo** `#138 R2`, por `toEqual`, en el radio  blob=07d4f8a151fb15237f61ad6001d9c52505ce4ec0; exit=1; Test Suites: 1 failed, 1 passed, 2 total<br>Tests:       1 failed, 221 passed, 222 total<br>Snapshots:   0 total<br>R10 (mobile-device-pairing): la collar card sin collar enlaza a /pairing › #138 R2: en reposo, el botón lleva rounded-xl como único radio y la esquina continua con opacidad 1; aserción: radio; primera línea: expect(received).toEqual(expected) // deep equality; línea &gt;: &gt; 1001 &#124;     ).toEqual([&#x27;rounded-xl&#x27;]);; por aserción |
| `rounded_2xl` | el `className` pasa a `                      className="min-h-11 items-center justify-center rounded-2xl bg-accent-soft px-4"` | `8c5593f8` | rojo 3, por `toEqual`: `#138 R2` (radio), `#62 R4: la app solo usa los radios de la escala declarada › no deja la clase fuera de escala rounded-2xl en producción` y `#98 R10 › deja CONTINUOUS_CORNER, bg-accent-soft y el acento donde estaban`  blob=8c5593f80c8f27fc0540d80eefd959d2b39f0ba9; exit=1; Test Suites: 2 failed, 2 total<br>Tests:       3 failed, 219 passed, 222 total<br>Snapshots:   0 total<br>#62 R4: la app solo usa los radios de la escala declarada › no deja la clase fuera de escala rounded-2xl en producción; aserción: candado existente de radio o style en reposo (línea > registrada); primera línea: expect(received).toEqual(expected) // deep equality; línea &gt;: &gt; 148 &#124;       expect(filesMatching(new RegExp(`\\b${className}\\b`))).toEqual([]);; por aserción<br>#98 R10: los candados que esta feature no mueve › deja CONTINUOUS_CORNER, bg-accent-soft y el acento donde estaban; aserción: candado existente de radio o style en reposo (línea > registrada); primera línea: expect(received).toEqual(expected) // deep equality; línea &gt;: &gt; 401 &#124;     expect(filesMatching(/\brounded-(?:2xl&#124;lg&#124;md&#124;sm)\b/)).toEqual([]);; por aserción<br>R10 (mobile-device-pairing): la collar card sin collar enlaza a /pairing › #138 R2: en reposo, el botón lleva rounded-xl como único radio y la esquina continua con opacidad 1; aserción: radio; primera línea: expect(received).toEqual(expected) // deep equality; línea &gt;: &gt; 1001 &#124;     ).toEqual([&#x27;rounded-xl&#x27;]);; por aserción |
| `constant` | en `src/theme/native-styles.ts`, `{ borderCurve: 'continuous' }` pasa a `{ borderCurve: 'circular' }` (la Home, final) | `e2930ec1` (de `native-styles.ts`) | rojo 5: `#138 R1` (reposo), `#138 R2` (`style`), `#81 R3` y `#136 R1`, por `toEqual`; `#62 R14 › declara las dos constantes nativas compartidas`, por `toContain`. Prueba que los esperados son literales  blob=e2930ec190afcb428713508a6342351cd9524bc0; exit=1; Test Suites: 2 failed, 2 total<br>Tests:       5 failed, 217 passed, 222 total<br>Snapshots:   0 total<br>#62 R14: toda esquina no-cápsula que dibuja el repo es continua › declara las dos constantes nativas compartidas; aserción: declaración literal de CONTINUOUS_CORNER; primera línea: expect(received).toContain(expected) // indexOf; línea &gt;: &gt; 273 &#124;     expect(nativeStyles).toContain(; por aserción<br>R10 (mobile-device-pairing): la collar card sin collar enlaza a /pairing › #138 R1: el botón baja a opacidad 0.8 mientras se pulsa y vuelve a 1 al soltarlo, con la esquina continua; aserción: style en reposo; primera línea: expect(received).toEqual(expected) // deep equality; línea &gt;: &gt; 951 &#124;     expect(link.props.style).toEqual({; por aserción<br>R10 (mobile-device-pairing): la collar card sin collar enlaza a /pairing › #138 R2: en reposo, el botón lleva rounded-xl como único radio y la esquina continua con opacidad 1; aserción: style en reposo; primera línea: expect(received).toEqual(expected) // deep equality; línea &gt;: &gt; 1002 &#124;     expect(link.props.style).toEqual({; por aserción<br>#81 R1-R6: la rejilla de accesos rápidos no deja decisiones sin candado › #81 R3: cada tile lleva rounded-xl como único radio y la esquina continua; aserción: candado existente de radio o style en reposo (línea > registrada); primera línea: expect(received).toEqual(expected) // deep equality; línea &gt;: &gt; 2762 &#124;       expect(tile.props.style).toEqual({; por aserción<br>#81 R1-R6: la rejilla de accesos rápidos no deja decisiones sin candado › #136 R1: cada tile baja a opacidad 0.8 mientras se pulsa y vuelve a 1 al soltarlo, con la esquina continua; aserción: candado existente de radio o style en reposo (línea > registrada); primera línea: expect(received).toEqual(expected) // deep equality; línea &gt;: &gt; 2783 &#124;       expect(tile.props.style).toEqual({; por aserción |
| `ios_only` | el import de RN pasa a `import { Platform, Pressable, ScrollView, Text, View } from 'react-native';` y la opacidad, a `                        opacity: pressed && Platform.OS === 'ios' ? 0.8 : 1,` | `8518c92e` | **verde** 222 de 222. Punto ciego declarado: jest corre como iOS. Lo cubre R5  blob=8518c92ed4f9894d76fb4ad2ca63aa0c0ef61329; exit=0; Test Suites: 2 passed, 2 total<br>Tests:       222 passed, 222 total<br>Snapshots:   0 total<br><br>Sin it rojo. Punto ciego: jest corre como iOS; R5 del humano lo cubre. |


## Detalle de las mediciones de sondas

### Sonda `norecipe`

Blob: `cb61d0c64deb0c911031a8468a8c397255b53979`. `bunx jest --runTestsByPath src/screens/home/index.test.tsx src/__tests__/consistency-classnames.test.ts`: exit=1.

```text
Test Suites: 2 failed, 2 total
Tests:       4 failed, 218 passed, 222 total
Snapshots:   0 total
#62 R14: toda esquina no-cápsula que dibuja el repo es continua › screens/home/index.tsx importa y aplica sus 0 esquinas; primera línea: expect(received).toHaveLength(expected); marco: > 288 |     expect(uses).toHaveLength(count);; por aserción
#98 R10: los candados que esta feature no mueve › deja CONTINUOUS_CORNER, bg-accent-soft y el acento donde estaban; primera línea: expect(received).toHaveLength(expected); marco: > 394 |     expect(home.match(/style=\{CONTINUOUS_CORNER\}/g) ?? []).toHaveLength(0);; por aserción
R10 (mobile-device-pairing): la collar card sin collar enlaza a /pairing › #138 R1: el botón baja a opacidad 0.8 mientras se pulsa y vuelve a 1 al soltarlo, con la esquina continua; primera línea: expect(received).toEqual(expected) // deep equality; marco: > 951 |     expect(link.props.style).toEqual({; por aserción
R10 (mobile-device-pairing): la collar card sin collar enlaza a /pairing › #138 R2: en reposo, el botón lleva rounded-xl como único radio y la esquina continua con opacidad 1; primera línea: expect(received).toEqual(expected) // deep equality; marco: > 1002 |     expect(link.props.style).toEqual({; por aserción
```

### Sonda `pressed07`

Blob: `3b0d41bd78f958eda3b500b711c350aecfb7f831`. `bunx jest --runTestsByPath src/screens/home/index.test.tsx src/__tests__/consistency-classnames.test.ts`: exit=1.

```text
Test Suites: 1 failed, 1 passed, 2 total
Tests:       1 failed, 221 passed, 222 total
Snapshots:   0 total
R10 (mobile-device-pairing): la collar card sin collar enlaza a /pairing › #138 R1: el botón baja a opacidad 0.8 mientras se pulsa y vuelve a 1 al soltarlo, con la esquina continua; aserción: pulsado (paso 2); primera línea: expect(received).toEqual(expected) // deep equality; marco: > 963 |     expect(link.props.style).toEqual({; por aserción
```

### Sonda `rest09`

Blob: `2e696c30b33f5486aa0ba139db61d550cac0718d`. `bunx jest --runTestsByPath src/screens/home/index.test.tsx src/__tests__/consistency-classnames.test.ts`: exit=1.

```text
Test Suites: 1 failed, 1 passed, 2 total
Tests:       2 failed, 220 passed, 222 total
Snapshots:   0 total
R10 (mobile-device-pairing): la collar card sin collar enlaza a /pairing › #138 R1: el botón baja a opacidad 0.8 mientras se pulsa y vuelve a 1 al soltarlo, con la esquina continua; aserción: style en reposo; primera línea: expect(received).toEqual(expected) // deep equality; marco: > 951 |     expect(link.props.style).toEqual({; por aserción
R10 (mobile-device-pairing): la collar card sin collar enlaza a /pairing › #138 R2: en reposo, el botón lleva rounded-xl como único radio y la esquina continua con opacidad 1; aserción: style en reposo; primera línea: expect(received).toEqual(expected) // deep equality; marco: > 1002 |     expect(link.props.style).toEqual({; por aserción
```

### Sonda `nocorner`

Blob: `0fe120e58f56954eae4d36acf277b761f28b650f`. `bunx jest --runTestsByPath src/screens/home/index.test.tsx src/__tests__/consistency-classnames.test.ts`: exit=1.

```text
Test Suites: 1 failed, 1 passed, 2 total
Tests:       2 failed, 220 passed, 222 total
Snapshots:   0 total
R10 (mobile-device-pairing): la collar card sin collar enlaza a /pairing › #138 R1: el botón baja a opacidad 0.8 mientras se pulsa y vuelve a 1 al soltarlo, con la esquina continua; aserción: style en reposo; primera línea: expect(received).toEqual(expected) // deep equality; marco: > 951 |     expect(link.props.style).toEqual({; por aserción
R10 (mobile-device-pairing): la collar card sin collar enlaza a /pairing › #138 R2: en reposo, el botón lleva rounded-xl como único radio y la esquina continua con opacidad 1; aserción: style en reposo; primera línea: expect(received).toEqual(expected) // deep equality; marco: > 1002 |     expect(link.props.style).toEqual({; por aserción
```

### Sonda `pressnocorner`

Blob: `3e128e4668a6e385e8935dc446f74356a2c0e496`. `bunx jest --runTestsByPath src/screens/home/index.test.tsx src/__tests__/consistency-classnames.test.ts`: exit=1.

```text
Test Suites: 1 failed, 1 passed, 2 total
Tests:       1 failed, 221 passed, 222 total
Snapshots:   0 total
R10 (mobile-device-pairing): la collar card sin collar enlaza a /pairing › #138 R1: el botón baja a opacidad 0.8 mientras se pulsa y vuelve a 1 al soltarlo, con la esquina continua; aserción: pulsado (paso 2); primera línea: expect(received).toEqual(expected) // deep equality; marco: > 963 |     expect(link.props.style).toEqual({; por aserción
```

### Sonda `restnocorner`

Blob: `95c251ad839b0935ead1dc7b4c7851d8da0b483f`. `bunx jest --runTestsByPath src/screens/home/index.test.tsx src/__tests__/consistency-classnames.test.ts`: exit=1.

```text
Test Suites: 1 failed, 1 passed, 2 total
Tests:       2 failed, 220 passed, 222 total
Snapshots:   0 total
R10 (mobile-device-pairing): la collar card sin collar enlaza a /pairing › #138 R1: el botón baja a opacidad 0.8 mientras se pulsa y vuelve a 1 al soltarlo, con la esquina continua; aserción: style en reposo; primera línea: expect(received).toEqual(expected) // deep equality; marco: > 951 |     expect(link.props.style).toEqual({; por aserción
R10 (mobile-device-pairing): la collar card sin collar enlaza a /pairing › #138 R2: en reposo, el botón lleva rounded-xl como único radio y la esquina continua con opacidad 1; aserción: style en reposo; primera línea: expect(received).toEqual(expected) // deep equality; marco: > 1002 |     expect(link.props.style).toEqual({; por aserción
```

### Sonda `stray`

Blob: `b254ce1295f345946115e04dc1397656d5de9f5f`. `bunx jest --runTestsByPath src/screens/home/index.test.tsx src/__tests__/consistency-classnames.test.ts`: exit=1.

```text
Test Suites: 1 failed, 1 passed, 2 total
Tests:       2 failed, 220 passed, 222 total
Snapshots:   0 total
R10 (mobile-device-pairing): la collar card sin collar enlaza a /pairing › #138 R1: el botón baja a opacidad 0.8 mientras se pulsa y vuelve a 1 al soltarlo, con la esquina continua; aserción: style en reposo; primera línea: expect(received).toEqual(expected) // deep equality; marco: > 951 |     expect(link.props.style).toEqual({; por aserción
R10 (mobile-device-pairing): la collar card sin collar enlaza a /pairing › #138 R2: en reposo, el botón lleva rounded-xl como único radio y la esquina continua con opacidad 1; aserción: style en reposo; primera línea: expect(received).toEqual(expected) // deep equality; marco: > 1002 |     expect(link.props.style).toEqual({; por aserción
```

### Sonda `nostyle`

Blob: `f97519769320e9866e57838992ea5433633d1dfb`. `bunx jest --runTestsByPath src/screens/home/index.test.tsx src/__tests__/consistency-classnames.test.ts`: exit=1.

```text
Test Suites: 1 failed, 1 passed, 2 total
Tests:       2 failed, 220 passed, 222 total
Snapshots:   0 total
R10 (mobile-device-pairing): la collar card sin collar enlaza a /pairing › #138 R1: el botón baja a opacidad 0.8 mientras se pulsa y vuelve a 1 al soltarlo, con la esquina continua; aserción: style en reposo; primera línea: expect(received).toEqual(expected) // deep equality; marco: > 951 |     expect(link.props.style).toEqual({; por aserción
R10 (mobile-device-pairing): la collar card sin collar enlaza a /pairing › #138 R2: en reposo, el botón lleva rounded-xl como único radio y la esquina continua con opacidad 1; aserción: style en reposo; primera línea: expect(received).toEqual(expected) // deep equality; marco: > 1002 |     expect(link.props.style).toEqual({; por aserción
```

### Sonda `array`

Blob: `5c49aa16f3e08437debc470726db739a0cc1ea3c`. `bunx jest --runTestsByPath src/screens/home/index.test.tsx src/__tests__/consistency-classnames.test.ts`: exit=1.

```text
Test Suites: 1 failed, 1 passed, 2 total
Tests:       2 failed, 220 passed, 222 total
Snapshots:   0 total
R10 (mobile-device-pairing): la collar card sin collar enlaza a /pairing › #138 R1: el botón baja a opacidad 0.8 mientras se pulsa y vuelve a 1 al soltarlo, con la esquina continua; aserción: style en reposo; primera línea: expect(received).toEqual(expected) // deep equality; marco: > 951 |     expect(link.props.style).toEqual({; por aserción
R10 (mobile-device-pairing): la collar card sin collar enlaza a /pairing › #138 R2: en reposo, el botón lleva rounded-xl como único radio y la esquina continua con opacidad 1; aserción: style en reposo; primera línea: expect(received).toEqual(expected) // deep equality; marco: > 1002 |     expect(link.props.style).toEqual({; por aserción
```

### Sonda `sticky`

Blob: `4c681b1ab1c960879adfa09116589179df60d500`. `bunx jest --runTestsByPath src/screens/home/index.test.tsx src/__tests__/consistency-classnames.test.ts`: exit=1.

```text
Test Suites: 1 failed, 1 passed, 2 total
Tests:       1 failed, 221 passed, 222 total
Snapshots:   0 total
R10 (mobile-device-pairing): la collar card sin collar enlaza a /pairing › #138 R1: el botón baja a opacidad 0.8 mientras se pulsa y vuelve a 1 al soltarlo, con la esquina continua; aserción: waitFor (paso 3); primera línea: expect(received).toEqual(expected) // deep equality; marco: > 977 |     await waitFor(() =>; por aserción
```

### Sonda `hidden`

Blob: `e252745368786a3c3629089d2dfd3b00b59a397b`. `bunx jest --runTestsByPath src/screens/home/index.test.tsx src/__tests__/consistency-classnames.test.ts`: exit=1.

```text
Test Suites: 1 failed, 1 passed, 2 total
Tests:       4 failed, 218 passed, 222 total
Snapshots:   0 total
R10 (mobile-device-pairing): la collar card sin collar enlaza a /pairing › shows the pair action for a pet without a collar and opens pairing; aserción: consulta del testID; primera línea: Unable to find an element with testID: collar-pair-link; marco: > 911 |     const link = await screen.findByTestId('collar-pair-link');; por consulta
R10 (mobile-device-pairing): la collar card sin collar enlaza a /pairing › does not show the pair action when the pet has a collar; aserción: aserción existente; primera línea: expect(received).toBeNull(); marco: > 936 |     expect(screen.queryByTestId('collar-pair-link')).toBeNull();; por aserción
R10 (mobile-device-pairing): la collar card sin collar enlaza a /pairing › #138 R1: el botón baja a opacidad 0.8 mientras se pulsa y vuelve a 1 al soltarlo, con la esquina continua; aserción: consulta del testID; primera línea: Unable to find an element with testID: collar-pair-link; marco: > 947 |     const link = await screen.findByTestId('collar-pair-link');; por consulta
R10 (mobile-device-pairing): la collar card sin collar enlaza a /pairing › #138 R2: en reposo, el botón lleva rounded-xl como único radio y la esquina continua con opacidad 1; aserción: consulta del testID; primera línea: Unable to find an element with testID: collar-pair-link; marco: > 993 |     const link = await screen.findByTestId('collar-pair-link');; por consulta
```

### Sonda `rounded_full`

Blob: `07d4f8a151fb15237f61ad6001d9c52505ce4ec0`. `bunx jest --runTestsByPath src/screens/home/index.test.tsx src/__tests__/consistency-classnames.test.ts`: exit=1.

```text
Test Suites: 1 failed, 1 passed, 2 total
Tests:       1 failed, 221 passed, 222 total
Snapshots:   0 total
R10 (mobile-device-pairing): la collar card sin collar enlaza a /pairing › #138 R2: en reposo, el botón lleva rounded-xl como único radio y la esquina continua con opacidad 1; aserción: radio; primera línea: expect(received).toEqual(expected) // deep equality; marco: > 1001 |     ).toEqual(['rounded-xl']);; por aserción
```

### Sonda `rounded_2xl`

Blob: `8c5593f80c8f27fc0540d80eefd959d2b39f0ba9`. `bunx jest --runTestsByPath src/screens/home/index.test.tsx src/__tests__/consistency-classnames.test.ts`: exit=1.

```text
Test Suites: 2 failed, 2 total
Tests:       3 failed, 219 passed, 222 total
Snapshots:   0 total
#62 R4: la app solo usa los radios de la escala declarada › no deja la clase fuera de escala rounded-2xl en producción; aserción: candado existente de radio o style en reposo (línea > registrada); primera línea: expect(received).toEqual(expected) // deep equality; marco: > 148 |       expect(filesMatching(new RegExp(`\\b${className}\\b`))).toEqual([]);; por aserción
#98 R10: los candados que esta feature no mueve › deja CONTINUOUS_CORNER, bg-accent-soft y el acento donde estaban; aserción: candado existente de radio o style en reposo (línea > registrada); primera línea: expect(received).toEqual(expected) // deep equality; marco: > 401 |     expect(filesMatching(/\brounded-(?:2xl|lg|md|sm)\b/)).toEqual([]);; por aserción
R10 (mobile-device-pairing): la collar card sin collar enlaza a /pairing › #138 R2: en reposo, el botón lleva rounded-xl como único radio y la esquina continua con opacidad 1; aserción: radio; primera línea: expect(received).toEqual(expected) // deep equality; marco: > 1001 |     ).toEqual(['rounded-xl']);; por aserción
```

### Sonda `constant`

Blob: `e2930ec190afcb428713508a6342351cd9524bc0`. `bunx jest --runTestsByPath src/screens/home/index.test.tsx src/__tests__/consistency-classnames.test.ts`: exit=1.

```text
Test Suites: 2 failed, 2 total
Tests:       5 failed, 217 passed, 222 total
Snapshots:   0 total
#62 R14: toda esquina no-cápsula que dibuja el repo es continua › declara las dos constantes nativas compartidas; aserción: declaración literal de CONTINUOUS_CORNER; primera línea: expect(received).toContain(expected) // indexOf; marco: > 273 |     expect(nativeStyles).toContain(; por aserción
R10 (mobile-device-pairing): la collar card sin collar enlaza a /pairing › #138 R1: el botón baja a opacidad 0.8 mientras se pulsa y vuelve a 1 al soltarlo, con la esquina continua; aserción: style en reposo; primera línea: expect(received).toEqual(expected) // deep equality; marco: > 951 |     expect(link.props.style).toEqual({; por aserción
R10 (mobile-device-pairing): la collar card sin collar enlaza a /pairing › #138 R2: en reposo, el botón lleva rounded-xl como único radio y la esquina continua con opacidad 1; aserción: style en reposo; primera línea: expect(received).toEqual(expected) // deep equality; marco: > 1002 |     expect(link.props.style).toEqual({; por aserción
#81 R1-R6: la rejilla de accesos rápidos no deja decisiones sin candado › #81 R3: cada tile lleva rounded-xl como único radio y la esquina continua; aserción: candado existente de radio o style en reposo (línea > registrada); primera línea: expect(received).toEqual(expected) // deep equality; marco: > 2762 |       expect(tile.props.style).toEqual({; por aserción
#81 R1-R6: la rejilla de accesos rápidos no deja decisiones sin candado › #136 R1: cada tile baja a opacidad 0.8 mientras se pulsa y vuelve a 1 al soltarlo, con la esquina continua; aserción: candado existente de radio o style en reposo (línea > registrada); primera línea: expect(received).toEqual(expected) // deep equality; marco: > 2783 |       expect(tile.props.style).toEqual({; por aserción
```

### Sonda `ios_only`

Blob: `8518c92ed4f9894d76fb4ad2ca63aa0c0ef61329`. `bunx jest --runTestsByPath src/screens/home/index.test.tsx src/__tests__/consistency-classnames.test.ts`: exit=0.

```text
Test Suites: 2 passed, 2 total
Tests:       222 passed, 222 total
Snapshots:   0 total

```

## R4 — Greps de candado medidos

Los 25 renglones coinciden con la columna final de tasks.md. Los grep que cuentan cero tienen exit=1 normal.

```bash
grep -cF 'style={CONTINUOUS_CORNER}' src/screens/home/index.tsx
```

```text
0
```

```bash
grep -cF '...CONTINUOUS_CORNER,' src/screens/home/index.tsx
```

```text
2
```

```bash
grep -cF 'opacity: pressed ? 0.8 : 1' src/screens/home/index.tsx
```

```text
4
```

```bash
grep -cF 'CONTINUOUS_CORNER' src/screens/home/index.tsx
```

```text
3
```

```bash
grep -cF 'testID="collar-pair-link"' src/screens/home/index.tsx
```

```text
1
```

```bash
grep -cF "onPress={() => router.push('/pairing')}" src/screens/home/index.tsx
```

```text
1
```

```bash
grep -cxF '                      className="min-h-11 items-center justify-center rounded-xl bg-accent-soft px-4"' src/screens/home/index.tsx
```

```text
1
```

```bash
grep -ci stylesheet src/screens/home/index.tsx src/screens/home/index.test.tsx
```

```text
src/screens/home/index.tsx:0
src/screens/home/index.test.tsx:0
```

```bash
grep -roF 'style={CONTINUOUS_CORNER}' src --include='*.ts' --include='*.tsx' | grep -v '/__tests__/' | grep -v '\.test\.tsx\?:' | wc -l
```

```text
31
```

```bash
grep -c '#138' src/screens/home/index.test.tsx
```

```text
6
```

```bash
grep -c '#138 R[1-3]' src/screens/home/index.test.tsx
```

```text
6
```

```bash
grep -c '#138' src/__tests__/consistency-classnames.test.ts
grep -c '#138 R3' src/__tests__/consistency-classnames.test.ts
```

```text
3
3
```

```bash
grep -c '#136 R3' src/__tests__/consistency-classnames.test.ts
```

```text
3
```

```bash
grep -c '#136' src/screens/home/index.test.tsx
```

```text
8
```

```bash
grep -c '^describe(' src/screens/home/index.test.tsx
```

```text
41
```

```bash
grep -c "'responderGrant'" src/screens/home/index.test.tsx
```

```text
4
```

```bash
grep -c "'responderTerminate'" src/screens/home/index.test.tsx
```

```text
2
```

```bash
grep -c 'collar-pair-link' src/screens/home/index.test.tsx
```

```text
4
```

```bash
grep -cF "toEqual(['rounded-xl'])" src/screens/home/index.test.tsx
```

```text
2
```

```bash
grep -c -- '-\[' src/screens/home/index.test.tsx
```

```text
0
```

```bash
grep -cF "[join('screens', 'home', 'index.tsx'), 0]," src/__tests__/consistency-classnames.test.ts
```

```text
1
```

```bash
grep -cF "[join('screens', 'home', 'index.tsx'), 1]," src/__tests__/consistency-classnames.test.ts
```

```text
0
```

```bash
grep -cF '.toBe(33 + 1 + 1 - 1 - 1);' src/__tests__/consistency-classnames.test.ts
```

```text
1
```

```bash
grep -cF ') ?? []).toHaveLength(0);' src/__tests__/consistency-classnames.test.ts
```

```text
1
```

```bash
grep -cF 'expect(count(/style=\{CONTINUOUS_CORNER\}/g)).toBe(31);' src/__tests__/consistency-classnames.test.ts
```

```text
1
```

## R4 — Cierre y alcance

Guarda router.d.ts repetida antes del tsc de cierre: exit=0. `bunx tsc --noEmit`: exit=0; eslint de los tres ficheros: exit=0 (logs vacíos). Suite completa verde ya medida sobre los mismos blobs finales: 86 suites / 1612 passed / 1 snapshot, exit=0. Delta contra base: +0 suites, +2 tests, +0 snapshots.

```bash
git diff --stat origin/main...HEAD -- mobile-pet-tracker/
```

```text
 .../src/__tests__/consistency-classnames.test.ts   | 16 +++--
 mobile-pet-tracker/src/screens/home/index.test.tsx | 69 ++++++++++++++++++++++
 mobile-pet-tracker/src/screens/home/index.tsx      |  5 +-
 3 files changed, 83 insertions(+), 7 deletions(-)
```

```bash
git diff --numstat origin/main...HEAD -- mobile-pet-tracker/
```

```text
10	6	mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts
69	0	mobile-pet-tracker/src/screens/home/index.test.tsx
4	1	mobile-pet-tracker/src/screens/home/index.tsx
```

`git diff --exit-code origin/main...HEAD --` sobre package.json, bun.lock, catalog.ts, language-provider.test.tsx y ui-copy-table.ts: exit=0, salida vacía.

Blobs finales:

- `screens/home/index.tsx`: `0d439ebc386fbed4be6acf76b426383224eb602a`
- `screens/home/index.test.tsx`: `d919055869711334eeca54c4e725d26789558e6d`
- `__tests__/consistency-classnames.test.ts`: `b6c352b56d03eaf4b242f46fbc0d3b7460eaf2c7`
- `theme/native-styles.ts`: `4e5939f9bf5ce0c0d1282b1dfb05f134d0997de2` (restaurado, sin diff)

Todos los tests previos de Home, imports, helpers y mocks intactos; las únicas enmiendas de consistencia son los tres bloques literales de R3. La suite completa mantiene verdes design-drift, legibility-classnames, ui-language, catálogo, language-provider, food y los demás candados. El className conserva min-h-11, rounded-xl y bg-accent-soft; no hay dependencias, copy, animaciones, escala, háptica ni refactor nuevos.

Decisiones fuera de los literales: ninguna en código. Se reutilizó la skill building-native-ui instalada (su frontmatter declara 1.0.1), con prioridad de la carta y spec; las sondas se aplicaron desde los literales y se comprobó cada blob. Los bloques Console se ignoraron al identificar los it fallidos. La línea > de sticky apunta a await waitFor, como la medición.

R1–R4 implementados y medidos; revisión del reviewer pendiente. R5 sigue pendiente de firma humana en dev build Android, sin simularse ni marcarse. Sin init.sh, e2e, cambios de infraestructura, push ni PR. STATUS.md, feature_list.json, progress/current.md y progress/history.md quedan a cargo del leader.

Verificación de alcance byte a byte: al retirar únicamente los dos it literales nuevos, revertir únicamente los tres bloques de R3 y revertir únicamente la receta de cuatro líneas, cada fichero coincide exactamente con origin/main. `git diff --check`: exit=0.
