/home/claude/sites/Pet-Tracker
feature/136-mobile-quick-actions-pressed-feedback

# Implementación mobile-quick-actions-pressed-feedback — R1–R4

Inicio: 2026-09-29. Las dos primeras líneas son las salidas iniciales de
`pwd` y `git branch --show-current`, respectivamente. Rama verificada; árbol
limpio; HEAD inicial `65ff6c352bf01766cba50471a23e41430e0e83fd`;
`origin/main` inicial `073fa6cb43c815a66a797883791bc58a866d6f26`.

## Antes de editar código

- Spec completa leída: requirements, design, tasks y traceability.
- Gate: `status: approved` y `[x] Aprobado por humano`, 2026-09-29.
- `test ! -e .expo/types/router.d.ts; echo "exit=$?"`: `exit=0`.
- Leídos architecture, conventions (incluida la app móvil), ui-guidelines,
  verification (TDD), CHECKPOINTS y el AGENTS móvil.
- Documentación versionada exigida por el AGENTS móvil consultada:
  [Expo SDK 57](https://docs.expo.dev/versions/v57.0.0/).
- Skills cargadas:
  - `building-native-ui`: `/home/claude/.codex/plugins/cache/openai-curated/expo/11c74d6b/skills/building-native-ui/SKILL.md`
    (frontmatter de la skill: 1.0.1).
  - `appllama-app-design-skill`: `.agents/skills/appllama-app-design-skill/SKILL.md`.
  - `ponytail`: `/home/claude/.codex/plugins/cache/ponytail/ponytail/4.10.0/skills/ponytail/SKILL.md` (full).
- Aplicado el patrón nativo con esquina continua y feedback por Pressable.
  La carta y la spec aprobada prevalecen; simulator loop no aplica, R5 es
  del humano. `animate-expo` no cargada.
- Sin decisiones de implementación abiertas: receta, literales, eventos,
  orden de commits y sondas cerrados por la spec. Sin refactor.
- No ejecutados init.sh, E2E, CDK ni comandos de infraestructura. No se
  cambió de rama ni se accedió a los otros worktrees.

Blobs de base medidos con `git hash-object`, los tres coinciden:

| Archivo | Blob base |
|---|---|
| Home | `ff591a1f567e00c0aee57db29ca1706b3a925cad` |
| Test Home | `f91c8971e21198c4a65eebf0e40aaf35f0ac6472` |
| Consistencia | `07cc45b4da0ce1fe0f7397e323188ae2aec1c73b` |

## Base medida

Los comandos se ejecutaron desde `mobile-pet-tracker/`, sin pipe:



`bunx jest --runTestsByPath src/screens/home/index.test.tsx > /tmp/136_home.log 2>&1; echo "exit=$?"`

```text
exit=0
Test Suites: 1 passed, 1 total
Tests:       166 passed, 166 total
Snapshots:   0 total
```

`bunx jest --runTestsByPath src/__tests__/consistency-classnames.test.ts > /tmp/136_cons.log 2>&1; echo "exit=$?"`

```text
exit=0
Test Suites: 1 passed, 1 total
Tests:       53 passed, 53 total
Snapshots:   0 total
```

`bunx jest > /tmp/136_full.log 2>&1; echo "exit=$?"`

```text
exit=0
Test Suites: 86 passed, 86 total
Tests:       1608 passed, 1608 total
Snapshots:   1 passed, 1 total
```



## R1 — rojo natural

Blob del test: `d0126da0704ef7c86aae0045b231b465db8fa08b`. Home intacta: `ff591a1f567e00c0aee57db29ca1706b3a925cad`.

`bunx jest --runTestsByPath src/screens/home/index.test.tsx > /tmp/136_r1.log 2>&1; echo "exit=$?"`

```text
exit=1
Test Suites: 1 failed, 1 total
Tests:       1 failed, 166 passed, 167 total
Snapshots:   0 total
```

Rojo por aserción `toEqual`, en el reposo de `quick-action-weight`; ninguna consulta falló. Expected: `{ borderCurve: 'continuous', opacity: 1 }`; Received: `{ borderCurve: 'continuous' }`.

```text
● #81 R1-R6: la rejilla de accesos rápidos no deja decisiones sin candado › #136 R1: cada tile baja a opacidad 0.8 mientras se pulsa y vuelve a 1 al soltarlo, con la esquina continua

    expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 0

      Object {
        "borderCurve": "continuous",
    -   "opacity": 1,
      }

      2707 |       // #136 R1: the whole style with toEqual, at rest and pressed. toHaveStyle
      2708 |       // matches a subset and would let a stray key or a lost corner through.
    > 2709 |       expect(tile.props.style).toEqual({
           |                                ^
      2710 |         borderCurve: 'continuous',
      2711 |         opacity: 1,
      2712 |       });

      at toEqual (src/screens/home/index.test.tsx:2709:32)
          at _loop.next (<anonymous>)
      at Object._loop (src/screens/home/index.test.tsx:2704:33)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

Commit rojo R1: `f3a912ce4dbc3c563f43f10c11a4ffe69b5e3a60`, solo el test Home.



## R2 — rojo natural

Blob del test: `04135c8e262f601ad61670f34c4d959192d150c9`. Home intacta: `ff591a1f567e00c0aee57db29ca1706b3a925cad`.

`bunx jest --runTestsByPath src/screens/home/index.test.tsx > /tmp/136_r2.log 2>&1; echo "exit=$?"`

```text
exit=1
Test Suites: 1 failed, 1 total
Tests:       2 failed, 165 passed, 167 total
Snapshots:   0 total
```

Los dos rojos son por aserción `toEqual`, #81 R3 y #136 R1; ninguna consulta falló. En ambos Expected: `{ borderCurve: 'continuous', opacity: 1 }`; Received: `{ borderCurve: 'continuous' }`.

```text
● #81 R1-R6: la rejilla de accesos rápidos no deja decisiones sin candado › #81 R3: cada tile lleva rounded-xl como único radio y la esquina continua

    expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 0

      Object {
        "borderCurve": "continuous",
    -   "opacity": 1,
      }

      2691 |       // #136 R2: at rest the corner travels with the opacity of the pressed
      2692 |       // recipe; #136 R1 locks the pressed and released values.
    > 2693 |       expect(tile.props.style).toEqual({
           |                                ^
      2694 |         borderCurve: 'continuous',
      2695 |         opacity: 1,
      2696 |       });

      at Object.toEqual (src/screens/home/index.test.tsx:2693:32)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

● #81 R1-R6: la rejilla de accesos rápidos no deja decisiones sin candado › #136 R1: cada tile baja a opacidad 0.8 mientras se pulsa y vuelve a 1 al soltarlo, con la esquina continua

    expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 0

      Object {
        "borderCurve": "continuous",
    -   "opacity": 1,
      }

      2712 |       // #136 R1: the whole style with toEqual, at rest and pressed. toHaveStyle
      2713 |       // matches a subset and would let a stray key or a lost corner through.
    > 2714 |       expect(tile.props.style).toEqual({
           |                                ^
      2715 |         borderCurve: 'continuous',
      2716 |         opacity: 1,
      2717 |       });

      at toEqual (src/screens/home/index.test.tsx:2714:32)
          at _loop.next (<anonymous>)
      at Object._loop (src/screens/home/index.test.tsx:2709:33)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

Commit rojo R2: `0634eaa83c5d59ece70524e49c0e497392efcd36`, solo el test Home.



## R3 — rojo natural

Blob de consistencia: `e62f88ad4d60178a18323551f5eb6d19641dbd72`. Home intacta: `ff591a1f567e00c0aee57db29ca1706b3a925cad`.

`bunx jest --runTestsByPath src/__tests__/consistency-classnames.test.ts > /tmp/136_r3.log 2>&1; echo "exit=$?"`

```text
exit=1
Test Suites: 1 failed, 1 total
Tests:       2 failed, 51 passed, 53 total
Snapshots:   0 total
```

Los dos rojos son por aserción `toHaveLength`, #62 R14 (Home) y #98 R10. En ambos Expected length: 1; Received length: 2. Ninguna consulta falló. `fusiona la esquina una vez y la entrega a las dos ramas de Card` queda verde: suma la tabla.

```text
● #62 R14: toda esquina no-cápsula que dibuja el repo es continua › screens/home/index.tsx importa y aplica sus 1 esquinas

    expect(received).toHaveLength(expected)

    Expected length: 1
    Received length: 2
    Received array:  [["style={CONTINUOUS_CORNER}"], ["style={CONTINUOUS_CORNER}"]]

      285 |       /import \{[^}]*\bCONTINUOUS_CORNER\b[^}]*\} from ['"].*theme\/native-styles['"];/,
      286 |     );
    > 287 |     expect(uses).toHaveLength(count);
          |                  ^
      288 |
      289 |     for (const use of uses) {
      290 |       const openingTag = source.slice(

      at toHaveLength (src/__tests__/consistency-classnames.test.ts:287:18)

● #98 R10: los candados que esta feature no mueve › deja CONTINUOUS_CORNER, bg-accent-soft y el acento donde estaban

    expect(received).toHaveLength(expected)

    Expected length: 1
    Received length: 2
    Received array:  ["style={CONTINUOUS_CORNER}", "style={CONTINUOUS_CORNER}"]

      388 |     // #136 R3: the tiles' corner moved into their pressed style, one direct
      389 |     // use less in the Home and in the repo.
    > 390 |     expect(home.match(/style=\{CONTINUOUS_CORNER\}/g)).toHaveLength(1);
          |                                                        ^
      391 |     expect(food.match(/style=\{CONTINUOUS_CORNER\}/g)).toHaveLength(2);
      392 |     expect(count(/style=\{CONTINUOUS_CORNER\}/g)).toBe(32);
      393 |     expect(count(/rounded-xl bg-accent(?=[\s'"`])/g)).toBe(13);

      at Object.toHaveLength (src/__tests__/consistency-classnames.test.ts:390:56)
```

Commit rojo R3: `3bdb4c96bbfa44898ca4f19069847e534d1b6b23`, solo consistencia.



Incidencia de ejecución: la primera sustitución de Home usó un conteo de
subcadena que también veía la línea del collar. Su assert abortó antes de
escribir: Home seguía en el blob de base. Se había iniciado por error el
comando de verde; dio exit=1, 2 failed / 165 passed / 167 total (solo #81 R3 y
#136 R1, por toEqual), como el rojo anterior, y se descartó como medición de
verde. Log: `/tmp/136_edit_aborted_home.log`. Corregido el anclaje al inicio
de línea; no se modificaron tests ni se hizo commit adicional.

## Verde común R1, R2, R3

Home final: `cb61d0c64deb0c911031a8468a8c397255b53979`. Diff de Home `4\t1` (una línea por cuatro), dentro de QUICK_ACTIONS.map.

`bunx jest --runTestsByPath src/screens/home/index.test.tsx > /tmp/136_green_home.log 2>&1; echo "exit=$?"`

```text
exit=0
Test Suites: 1 passed, 1 total
Tests:       167 passed, 167 total
Snapshots:   0 total
```

`bunx jest --runTestsByPath src/__tests__/consistency-classnames.test.ts > /tmp/136_green_cons.log 2>&1; echo "exit=$?"`

```text
exit=0
Test Suites: 1 passed, 1 total
Tests:       53 passed, 53 total
Snapshots:   0 total
```



`bunx jest > /tmp/136_green_full.log 2>&1; echo "exit=$?"`

```text
exit=0
Test Suites: 86 passed, 86 total
Tests:       1609 passed, 1609 total
Snapshots:   1 passed, 1 total
```

Antes de tsc: `test ! -e .expo/types/router.d.ts; echo "exit=$?"` → `exit=0`.
`bunx tsc --noEmit > /tmp/136_tsc.log 2>&1; echo "exit=$?"` → `exit=0`.
`bunx eslint src/screens/home/index.tsx src/screens/home/index.test.tsx src/__tests__/consistency-classnames.test.ts > /tmp/136_lint.log 2>&1; echo "exit=$?"` → `exit=0`. Ambos logs sin salida.

El commit `aa46f162562991e97f76a59e891e4887725f9cbe` de bookkeeping del leader (solo STATUS.md) apareció después del HEAD inicial y antes del primer commit propio. No modificó mobile ni los blobs; no es un cambio del implementer.

Commit verde común R1/R2/R3, último código y referencia de R4: `6146ae0e003f24a79f75f8bc5944c23446b698de`, solo Home.

## Sondas R4 — medición secuencial sobre el verde común

Cada sonda usa `bunx jest --runTestsByPath src/screens/home/index.test.tsx src/__tests__/consistency-classnames.test.ts > /tmp/136_probe.log 2>&1; echo "exit=$?"`, desde `mobile-pet-tracker/`. Logs íntegros copiados a `/tmp/136_probe_<sonda>.log`, sin versionar.

Los it rojos aparecen con su título completo y primera línea de error. Todos los rojos exigidos son por aserción; ninguno por consulta.

| Sonda | Blob medido | Exigido | Medido (exit, cuentas, cada it rojo y primera línea de error) |
|---|---|---|---|
| `t0` | `6d701cc467b585d8e62f949cffe6bf158140251b` | 2 rojos; toEqual | exit=1; Test Suites: 1 failed, 1 passed, 2 total; Tests:       2 failed, 218 passed, 220 total; Snapshots:   0 total; `#81 R1-R6: la rejilla de accesos rápidos no deja decisiones sin candado › #81 R3: cada tile lleva rounded-xl como único radio y la esquina continua` — `expect(received).toEqual(expected) // deep equality` (por aserción)<br>`#81 R1-R6: la rejilla de accesos rápidos no deja decisiones sin candado › #136 R1: cada tile baja a opacidad 0.8 mientras se pulsa y vuelve a 1 al soltarlo, con la esquina continua` — `expect(received).toEqual(expected) // deep equality` (por aserción) |
| `t1` | `9b755110cc1ada9b06e28b2187ec9bd89ced4960` | 2 rojos; toEqual | exit=1; Test Suites: 1 failed, 1 passed, 2 total; Tests:       2 failed, 218 passed, 220 total; Snapshots:   0 total; `#81 R1-R6: la rejilla de accesos rápidos no deja decisiones sin candado › #81 R3: cada tile lleva rounded-xl como único radio y la esquina continua` — `expect(received).toEqual(expected) // deep equality` (por aserción)<br>`#81 R1-R6: la rejilla de accesos rápidos no deja decisiones sin candado › #136 R1: cada tile baja a opacidad 0.8 mientras se pulsa y vuelve a 1 al soltarlo, con la esquina continua` — `expect(received).toEqual(expected) // deep equality` (por aserción) |
| `t2` | `f5254f92c7acd1551f07c740c9cd176605df5f0a` | 2 rojos; toEqual | exit=1; Test Suites: 1 failed, 1 passed, 2 total; Tests:       2 failed, 218 passed, 220 total; Snapshots:   0 total; `#81 R1-R6: la rejilla de accesos rápidos no deja decisiones sin candado › #81 R3: cada tile lleva rounded-xl como único radio y la esquina continua` — `expect(received).toEqual(expected) // deep equality` (por aserción)<br>`#81 R1-R6: la rejilla de accesos rápidos no deja decisiones sin candado › #136 R1: cada tile baja a opacidad 0.8 mientras se pulsa y vuelve a 1 al soltarlo, con la esquina continua` — `expect(received).toEqual(expected) // deep equality` (por aserción) |
| `nopress_t0` | `e17d4e5cb84484290788a1e2c7422f1ccaae272d` | 1 rojos; toEqual | exit=1; Test Suites: 1 failed, 1 passed, 2 total; Tests:       1 failed, 219 passed, 220 total; Snapshots:   0 total; `#81 R1-R6: la rejilla de accesos rápidos no deja decisiones sin candado › #136 R1: cada tile baja a opacidad 0.8 mientras se pulsa y vuelve a 1 al soltarlo, con la esquina continua` — `expect(received).toEqual(expected) // deep equality` (por aserción) |
| `nopress_t1` | `73dc6a81056fba4ff8d2488e485834fb3b0791ce` | 1 rojos; toEqual | exit=1; Test Suites: 1 failed, 1 passed, 2 total; Tests:       1 failed, 219 passed, 220 total; Snapshots:   0 total; `#81 R1-R6: la rejilla de accesos rápidos no deja decisiones sin candado › #136 R1: cada tile baja a opacidad 0.8 mientras se pulsa y vuelve a 1 al soltarlo, con la esquina continua` — `expect(received).toEqual(expected) // deep equality` (por aserción) |
| `nopress_t2` | `69f56555c46a990604b93d833ac415df88a7b643` | 1 rojos; toEqual | exit=1; Test Suites: 1 failed, 1 passed, 2 total; Tests:       1 failed, 219 passed, 220 total; Snapshots:   0 total; `#81 R1-R6: la rejilla de accesos rápidos no deja decisiones sin candado › #136 R1: cada tile baja a opacidad 0.8 mientras se pulsa y vuelve a 1 al soltarlo, con la esquina continua` — `expect(received).toEqual(expected) // deep equality` (por aserción) |
| `pressed07` | `3541059e7d06ca7e8dafc199e512edfbc22ada43` | 1 rojos; toEqual | exit=1; Test Suites: 1 failed, 1 passed, 2 total; Tests:       1 failed, 219 passed, 220 total; Snapshots:   0 total; `#81 R1-R6: la rejilla de accesos rápidos no deja decisiones sin candado › #136 R1: cada tile baja a opacidad 0.8 mientras se pulsa y vuelve a 1 al soltarlo, con la esquina continua` — `expect(received).toEqual(expected) // deep equality` (por aserción) |
| `pressed07_t1` | `6fbb94510a776c54f7c0f734c50c234feb5bb9d6` | 1 rojos; toEqual | exit=1; Test Suites: 1 failed, 1 passed, 2 total; Tests:       1 failed, 219 passed, 220 total; Snapshots:   0 total; `#81 R1-R6: la rejilla de accesos rápidos no deja decisiones sin candado › #136 R1: cada tile baja a opacidad 0.8 mientras se pulsa y vuelve a 1 al soltarlo, con la esquina continua` — `expect(received).toEqual(expected) // deep equality` (por aserción) |
| `rest09` | `8bfc769e09ef37d2eac99ea940d714f96ab9d06b` | 2 rojos; toEqual | exit=1; Test Suites: 1 failed, 1 passed, 2 total; Tests:       2 failed, 218 passed, 220 total; Snapshots:   0 total; `#81 R1-R6: la rejilla de accesos rápidos no deja decisiones sin candado › #81 R3: cada tile lleva rounded-xl como único radio y la esquina continua` — `expect(received).toEqual(expected) // deep equality` (por aserción)<br>`#81 R1-R6: la rejilla de accesos rápidos no deja decisiones sin candado › #136 R1: cada tile baja a opacidad 0.8 mientras se pulsa y vuelve a 1 al soltarlo, con la esquina continua` — `expect(received).toEqual(expected) // deep equality` (por aserción) |
| `stray` | `932c6c130fa1112c8288da3051acc7c8dfb695eb` | 2 rojos; toEqual | exit=1; Test Suites: 1 failed, 1 passed, 2 total; Tests:       2 failed, 218 passed, 220 total; Snapshots:   0 total; `#81 R1-R6: la rejilla de accesos rápidos no deja decisiones sin candado › #81 R3: cada tile lleva rounded-xl como único radio y la esquina continua` — `expect(received).toEqual(expected) // deep equality` (por aserción)<br>`#81 R1-R6: la rejilla de accesos rápidos no deja decisiones sin candado › #136 R1: cada tile baja a opacidad 0.8 mientras se pulsa y vuelve a 1 al soltarlo, con la esquina continua` — `expect(received).toEqual(expected) // deep equality` (por aserción) |
| `nocorner` | `c4d404fe797a7af8026fd1a49a8debfbce470dd3` | 2 rojos; toEqual | exit=1; Test Suites: 1 failed, 1 passed, 2 total; Tests:       2 failed, 218 passed, 220 total; Snapshots:   0 total; `#81 R1-R6: la rejilla de accesos rápidos no deja decisiones sin candado › #81 R3: cada tile lleva rounded-xl como único radio y la esquina continua` — `expect(received).toEqual(expected) // deep equality` (por aserción)<br>`#81 R1-R6: la rejilla de accesos rápidos no deja decisiones sin candado › #136 R1: cada tile baja a opacidad 0.8 mientras se pulsa y vuelve a 1 al soltarlo, con la esquina continua` — `expect(received).toEqual(expected) // deep equality` (por aserción) |
| `nostyle` | `82c9a37139c39c6944487c4c05704dc9b94c28f5` | 2 rojos; toEqual | exit=1; Test Suites: 1 failed, 1 passed, 2 total; Tests:       2 failed, 218 passed, 220 total; Snapshots:   0 total; `#81 R1-R6: la rejilla de accesos rápidos no deja decisiones sin candado › #81 R3: cada tile lleva rounded-xl como único radio y la esquina continua` — `expect(received).toEqual(expected) // deep equality` (por aserción)<br>`#81 R1-R6: la rejilla de accesos rápidos no deja decisiones sin candado › #136 R1: cada tile baja a opacidad 0.8 mientras se pulsa y vuelve a 1 al soltarlo, con la esquina continua` — `expect(received).toEqual(expected) // deep equality` (por aserción) |
| `array` | `28cc7f5e40521c209790d211d5378ae17bc4f78b` | 2 rojos; toEqual | exit=1; Test Suites: 1 failed, 1 passed, 2 total; Tests:       2 failed, 218 passed, 220 total; Snapshots:   0 total; `#81 R1-R6: la rejilla de accesos rápidos no deja decisiones sin candado › #81 R3: cada tile lleva rounded-xl como único radio y la esquina continua` — `expect(received).toEqual(expected) // deep equality` (por aserción)<br>`#81 R1-R6: la rejilla de accesos rápidos no deja decisiones sin candado › #136 R1: cada tile baja a opacidad 0.8 mientras se pulsa y vuelve a 1 al soltarlo, con la esquina continua` — `expect(received).toEqual(expected) // deep equality` (por aserción) |
| `shared` | `fde29fb30474b8c6a6149a1a966d2cfc9112424d` | 1 rojos; toEqual | exit=1; Test Suites: 1 failed, 1 passed, 2 total; Tests:       1 failed, 219 passed, 220 total; Snapshots:   0 total; `#81 R1-R6: la rejilla de accesos rápidos no deja decisiones sin candado › #136 R1: cada tile baja a opacidad 0.8 mientras se pulsa y vuelve a 1 al soltarlo, con la esquina continua` — `expect(received).toEqual(expected) // deep equality` (por aserción) |
| `sticky` | `2c8fe39d5ac8549db5e3ffdd4117c6848d59d50a` | 1 rojos; toEqual | exit=1; Test Suites: 1 failed, 1 passed, 2 total; Tests:       1 failed, 219 passed, 220 total; Snapshots:   0 total; `#81 R1-R6: la rejilla de accesos rápidos no deja decisiones sin candado › #136 R1: cada tile baja a opacidad 0.8 mientras se pulsa y vuelve a 1 al soltarlo, con la esquina continua` — `expect(received).toEqual(expected) // deep equality` (por aserción) |
| `collar` | `0d439ebc386fbed4be6acf76b426383224eb602a` | 2 rojos; toHaveLength | exit=1; Test Suites: 1 failed, 1 passed, 2 total; Tests:       2 failed, 218 passed, 220 total; Snapshots:   0 total; `#62 R14: toda esquina no-cápsula que dibuja el repo es continua › screens/home/index.tsx importa y aplica sus 1 esquinas` — `expect(received).toHaveLength(expected)` (por aserción)<br>`#98 R10: los candados que esta feature no mueve › deja CONTINUOUS_CORNER, bg-accent-soft y el acento donde estaban` — `expect(received).toHaveLength(expected)` (por aserción) |
| `android_only` | `97ceecbb7294f6d2ef3a72a2f00fc2b114c523fc` | 0 rojos; 220 verdes | exit=0; Test Suites: 2 passed, 2 total; Tests:       220 passed, 220 total; Snapshots:   0 total; Sin it rojos; ambas suites verdes (punto ciego de plataforma declarado, R5). |

Las 17 sondas coincidieron con Exigido. Tras cada sonda, `git checkout HEAD -- mobile-pet-tracker/src/screens/home/index.tsx` restauró el blob final; `git status --porcelain -- mobile-pet-tracker` y `git diff --cached --name-only` dieron salida vacía. Ninguna mutación se versionó. `collar`: test Home verde 167/167 y consistencia roja 2/53, a propósito. `android_only`: verde 220/220, a propósito; R5 cubre Android.

### Marco de aserción — `shared`

```text
● #81 R1-R6: la rejilla de accesos rápidos no deja decisiones sin candado › #136 R1: cada tile baja a opacidad 0.8 mientras se pulsa y vuelve a 1 al soltarlo, con la esquina continua

    expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 1

      Object {
        "borderCurve": "continuous",
    -   "opacity": 1,
    +   "opacity": 0.8,
      }

      2731 |       // turns red here.
      2732 |       for (const otherID of testIDs.filter((id) => id !== testID)) {
    > 2733 |         expect(screen.getByTestId(otherID).props.style).toEqual({
           |                                                         ^
      2734 |           borderCurve: 'continuous',
      2735 |           opacity: 1,
      2736 |         });

      at toEqual (src/screens/home/index.test.tsx:2733:57)
          at _loop.next (<anonymous>)
      at Object._loop (src/screens/home/index.test.tsx:2709:33)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

### Marco de aserción — `sticky`

```text
● #81 R1-R6: la rejilla de accesos rápidos no deja decisiones sin candado › #136 R1: cada tile baja a opacidad 0.8 mientras se pulsa y vuelve a 1 al soltarlo, con la esquina continua

    expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 1

      Object {
        "borderCurve": "continuous",
    -   "opacity": 1,
    +   "opacity": 0.8,
      }

      2746 |       });
      2747 |
    > 2748 |       await waitFor(() =>
           |                    ^
      2749 |         expect(tile.props.style).toEqual({
      2750 |           borderCurve: 'continuous',
      2751 |           opacity: 1,

      at _loop (src/screens/home/index.test.tsx:2748:20)
          at _loop.next (<anonymous>)
      at Object._loop (src/screens/home/index.test.tsx:2709:33)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```



## R4.1 — cierre después de restaurar las sondas

`bunx jest > /tmp/136_final_full.log 2>&1; echo "exit=$?"`

```text
exit=0
Test Suites: 86 passed, 86 total
Tests:       1609 passed, 1609 total
Snapshots:   1 passed, 1 total
```



`bunx jest --runTestsByPath src/screens/home/index.test.tsx > /tmp/136_final_home.log 2>&1; echo "exit=$?"`

```text
exit=0
Test Suites: 1 passed, 1 total
Tests:       167 passed, 167 total
Snapshots:   0 total
```

`bunx jest --runTestsByPath src/__tests__/consistency-classnames.test.ts > /tmp/136_final_cons.log 2>&1; echo "exit=$?"`

```text
exit=0
Test Suites: 1 passed, 1 total
Tests:       53 passed, 53 total
Snapshots:   0 total
```

## R4.2 y R4.3 — TypeScript y eslint

Antes del tsc final, desde `mobile-pet-tracker/`:

```bash
test ! -e .expo/types/router.d.ts; echo "exit=$?"
```

Salida: `exit=0`. No se borró ningún fichero.

```bash
bunx tsc --noEmit > /tmp/136_final_tsc.log 2>&1; echo "exit=$?"
bunx eslint src/screens/home/index.tsx src/screens/home/index.test.tsx src/__tests__/consistency-classnames.test.ts > /tmp/136_final_lint.log 2>&1; echo "exit=$?"
```

Ambos: `exit=0`, logs sin salida.

## R4.4 — greps de candado: salidas medidas

Todos desde `mobile-pet-tracker/`. Los conteos de cero producen salida `0`
y exit 1 de grep por ausencia de coincidencias, como exige la tabla.

| Comando literal | Base medida | Final medido |
|---|---|---|
| `grep -cF "style={CONTINUOUS_CORNER}" src/screens/home/index.tsx` | 2 | 1 |
| `grep -cxF '                      style={CONTINUOUS_CORNER}' src/screens/home/index.tsx` | 1 | 1 |
| `grep -cF "...CONTINUOUS_CORNER," src/screens/home/index.tsx` | 0 | 1 |
| `grep -cF "opacity: pressed ? 0.8 : 1" src/screens/home/index.tsx` | 2 | 3 |
| `grep -cF "{QUICK_ACTIONS.map(" src/screens/home/index.tsx` | 1 | 1 |
| `grep -cF "<Icon size={24}" src/screens/home/index.tsx` | 1 | 1 |
| `grep -ci stylesheet src/screens/home/index.tsx src/screens/home/index.test.tsx` | src/screens/home/index.tsx:0<br>src/screens/home/index.test.tsx:0 | src/screens/home/index.tsx:0<br>src/screens/home/index.test.tsx:0 |
| `grep -roF 'style={CONTINUOUS_CORNER}' src --include='*.ts' --include='*.tsx' \| grep -v '/__tests__/' \| grep -v '\.test\.tsx\?:' \| wc -l` | 33 | 32 |
| `grep -c "#136" src/screens/home/index.test.tsx` | 0 | 7 |
| `grep -c "#136 R[1-3]" src/screens/home/index.test.tsx` | 0 | 7 |
| `grep -c "#136 R3" src/__tests__/consistency-classnames.test.ts` | 0 | 3 |
| `grep -c "#136" src/__tests__/consistency-classnames.test.ts` | 0 | 3 |
| `grep -c "^describe(" src/screens/home/index.test.tsx` | 41 | 41 |
| `grep -c "#81 R" src/screens/home/index.test.tsx` | 11 | 11 |
| `grep -c responderGrant src/screens/home/index.test.tsx` | 4 | 6 |
| `grep -c responderTerminate src/screens/home/index.test.tsx` | 0 | 2 |
| `grep -cF "toEqual({ borderCurve: 'continuous' })" src/screens/home/index.test.tsx` | 1 | 0 |
| `grep -c -- "-\[" src/screens/home/index.test.tsx` | 0 | 0 |

Las siete citas del test son todas `#136 R[1-3]`. Se conserva `collar-pair-link`
con su estilo de 22 espacios. No cambian los candados ajenos a R2/R3;
`describe` sigue en 41 y las citas de #81 en 11. Ningún import nuevo.

## R4.5 — diff medido desde la raíz

`git diff --stat origin/main...HEAD -- mobile-pet-tracker/`

```text
 .../src/__tests__/consistency-classnames.test.ts   | 13 +++--
 mobile-pet-tracker/src/screens/home/index.test.tsx | 64 +++++++++++++++++++++-
 mobile-pet-tracker/src/screens/home/index.tsx      |  5 +-
 3 files changed, 76 insertions(+), 6 deletions(-)
exit=0
```

`git diff --numstat origin/main...HEAD -- mobile-pet-tracker/src/screens/home/index.tsx`

```text
4	1	mobile-pet-tracker/src/screens/home/index.tsx
exit=0
```

`git diff --exit-code origin/main...HEAD -- mobile-pet-tracker/package.json mobile-pet-tracker/bun.lock mobile-pet-tracker/src/i18n/catalog.ts mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx`

```text
exit=0
```

El diff móvil contra `origin/main...HEAD` toca exactamente la Home y sus dos
tests. La Home cambia solo el estilo del tile dentro de QUICK_ACTIONS.map,
una línea por cuatro. Sin copy, dependencias, configuración ni cambios
nativos; el resto de la Home, helpers, mocks y tests conserva su base.

## R4.6 — blobs finales medidos con git hash-object

| Ruta | Blob final |
|---|---|
| `mobile-pet-tracker/src/screens/home/index.tsx` | `cb61d0c64deb0c911031a8468a8c397255b53979` |
| `mobile-pet-tracker/src/screens/home/index.test.tsx` | `04135c8e262f601ad61670f34c4d959192d150c9` |
| `mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts` | `e62f88ad4d60178a18323551f5eb6d19641dbd72` |

## Commits por R-id y delta sobre la base

| R-id | Commit rojo (solo test) | Verde común (solo Home) |
|---|---|---|
| R1 | `f3a912ce4dbc3c563f43f10c11a4ffe69b5e3a60` | `6146ae0e003f24a79f75f8bc5944c23446b698de` |
| R2 | `0634eaa83c5d59ece70524e49c0e497392efcd36` | `6146ae0e003f24a79f75f8bc5944c23446b698de` |
| R3 | `3bdb4c96bbfa44898ca4f19069847e534d1b6b23` | `6146ae0e003f24a79f75f8bc5944c23446b698de` |
| R4 | no aplica | `6146ae0e003f24a79f75f8bc5944c23446b698de` (último commit de código) |

Los cuatro hashes son ancestros de HEAD (`git merge-base --is-ancestor <hash> HEAD`, exit=0 en los cuatro). Sin rebase.

```text
f3a912ce4dbc3c563f43f10c11a4ffe69b5e3a60 test(mobile): expect pressed feedback on each quick action tile (R1)
0634eaa83c5d59ece70524e49c0e497392efcd36 test(mobile): expect the resting opacity in the quick action corner lock (R2)
3bdb4c96bbfa44898ca4f19069847e534d1b6b23 test(mobile): move the quick action corner out of the direct corner counts (R3)
6146ae0e003f24a79f75f8bc5944c23446b698de feat(mobile): dim each quick action tile while pressed (R1,R2,R3)
```

El quinto commit es el de esta evidencia, con el mensaje literal:
`docs(mobile): record the quick action pressed feedback evidence (R4)`.
Solo incorpora este reporte y traceability.md. R4 cita el verde común,
no este commit de documentación.

| Medida | Base | Final | Delta |
|---|---|---|---|
| Suites completas | 86 | 86 | +0 |
| Tests completos | 1608 | 1609 | +1 |
| Snapshots completos | 1 | 1 | +0 |
| Test Home | 166 | 167 | +1 |
| Consistencia | 53 | 53 | +0 |

R1–R4 verificados. No quedaron decisiones de diseño abiertas; solo se
corrigió la incidencia de ejecución descrita en el verde, sin alterar la
spec ni sus literales. R5 corresponde al humano y su casilla no se marcó ni
se simuló. Estado de feature y artefactos del leader sin modificaciones del
implementer. Sin push ni PR, reservados al leader.
