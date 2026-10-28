# impl: mobile-orbit-activity-pose (#225)
Fecha: 2026-10-28

Implementer: subagente `implementer` (fallback de CLAUDE.md §Excepciones, declarado en
`progress/current.md` por el leader).

## Primer comando

```
$ cd /home/claude/sites/Pet-Tracker-wt-225 && pwd && git branch --show-current && git log --oneline -2
/home/claude/sites/Pet-Tracker-wt-225
feature/225-mobile-orbit-activity-pose
43a9ed33 docs(progress): #225 implementer handoff
3e9c76ae chore(spec): #225 re-verify after merging #221 into the branch
```

Ruta y branch confirmadas.

## Skills cargadas

- `expo:expo-overview` (al empezar)
- `expo:expo-native-ui` (antes de C9, para R7)

## §Re-verificar al mergear #221

Repetido sobre H0 (`3e9c76ae` + el commit del handoff), desde la raíz del worktree.

- Paso 1: `1` → **caso A**.
- Paso 2, comunes (en orden): `1 1 0 1 1 1 1 9 18 1 1 0` — todas las esperadas.
- Paso 2, solo caso A (en orden): `0 1 1 1 1 53` — todas las esperadas.
- Paso 3 (script copiado literal de requirements.md a
  `/tmp/claude-1002/-home-claude-sites-Pet-Tracker/54341eda-28f1-4262-9348-c2fbc9852939/scratchpad/paso3.py`):

```
caso A: 23 entradas, 0 descuadradas; 0 pins de documento sin entrada; 296 líneas para el reemplazo de C4
exit 0
```

Variante usada en `orbit-rename.test.ts`: caso A (23 entradas).

## Commits

- **C1** `e42d4a72` `test(mobile): R2 red, mascot images named orbit-* (#225)`. Crea
  `src/__tests__/orbit-rename.test.ts` con el `it` de R2. Rojo por aserción:
  `expect(images.filter(name => /pingo/i.test(name))).toEqual([])` recibe los 9
  `pingo-*.webp` (`bunx jest src/__tests__/orbit-rename.test.ts`: 1 failed, 1 total).
- **C2** `c8ee4db4` `feat(mobile): R2 rename mascot images to orbit-* (#225)`. 9 `git mv`
  de `assets/images/pingo-*.webp` a `orbit-*.webp`; reemplazo `pingo-<x>(\.)webp` →
  `orbit-<x>(\.)webp` (61 líneas, script con las reglas de design.md §2: en test se
  saltan títulos, comentarios y líneas de §4 caso A); enmiendas `#221 R3` (borrados el
  bloque `images` y el bucle `for (const path of sourceFiles())`) y `no mete otras poses
  de Pingo` (regex `/^(orbit|mascot)-/`, 9 nombres `orbit-*`), ambas con sufijo
  `(enmendado por #225 R2)`. Verde: jest completo en dos shards (`--shard=1/2`: 89
  suites, 3118 tests; `--shard=2/2`: 88 suites, 3397 tests; 0 rojos), `bun run typecheck`
  exit 0, `bun run lint` exit 0 sin «Killed».
- **C3** `ee6645be` `test(mobile): R3 R4 red, no Pingo in production or test code (#225)`.
  Añade a `orbit-rename.test.ts` los cuatro `it` de R3 y los dos de R4, con la lista de
  excepciones del caso A (23 entradas). `bunx jest src/__tests__/orbit-rename.test.ts`:
  5 failed, 2 passed, 7 total. Causas, todas por aserción:
  - R3 producción: `toEqual([])` recibe 18 ficheros (`components/celebration.tsx`,
    `components/empty-state.tsx`, `components/pingo-float.tsx`, `i18n/catalog.ts`,
    `screens/{add-pet,food,forgot,home,join-pet,login,nutrition-questionnaire,pairing,register,reset-password,welcome}/index.tsx`,
    `screens/home/pingo-phrase.ts`, `theme/motion.ts`, `theme/pingo-stage.ts`);
  - R3 módulos: `expect(existsSync(.../components/orbit-float.tsx)).toBe(true)` recibe `false`;
  - R3 catálogo: las 7 claves nuevas valen `undefined` en `en` y `es`, y las viejas siguen (`old: true`);
  - R3 inventario: `split("key: '<nueva>'")` da 0 para las 7 claves;
  - R4 primer `it`: lista 258 líneas de test (ver «Decisiones» sobre la diferencia con el paso 3);
  - R4 segundo `it`: nace verde (declarado en tasks.md); mutación M3 abajo.
  `bunx eslint src/__tests__/orbit-rename.test.ts` exit 0; `bunx tsc --noEmit` exit 0.
- **C4** `3bb1bc32` `feat(mobile): R3 R4 rename Pingo identifiers to Orbit (#225)`.
  - `git mv` de `components/pingo-float.tsx`, `theme/pingo-stage.ts`,
    `screens/home/pingo-phrase.ts`, `components/__tests__/pingo-float.test.tsx` y
    `screens/home/pingo-phrase.test.ts` a sus nombres `orbit-*`. Git muestra
    `orbit-stage.ts` como A/D porque sus dos líneas cambian.
  - Reemplazo con caja conservada con el script de design.md §2 (en producción, todo; en
    test, salvo títulos, comentarios y líneas de §4 caso A): 361 líneas en 39 ficheros.
    Incluye las 7 claves del catálogo en `en` y `es` (14 líneas, valores intactos), las 7
    filas de `ui-copy-table.ts` (las 4 de la frase con `file: 'src/screens/home/orbit-phrase.ts'`)
    y el `it.each` de #190 R12, que pasa a `src/screens/home/orbit-phrase.ts`.
  - `specs/mobile-ui-language/design.md`: sección
    `### §2.39 — Añadidos por #225 — Orbit renombrado y su pose de actividad` (la última
    era §2.38, #194) con las 7 filas `← renombrada desde … por #225 (R3)`.
  - Enmiendas: `#221 R1: el catálogo dice Orbit (enmendado por #225 R3)`;
    `#221 R3: … (enmendado por #225 R2, R3)`, con las anclas `orbit` y sin el filtro
    «ninguna clave casa /orbit/i»; `#167 R5: … (enmendado por #225 R3)`, con
    `const key = 'login.orbitGreeting';` y `const designKey = 'login.pingoGreeting';`.
  - Verde: jest completo en dos shards (`--shard=1/2`: 89 suites, 3110 tests;
    `--shard=2/2`: 88 suites, 3411 tests; 0 rojos), `bun run typecheck` exit 0,
    `bun run lint` exit 0 sin «Killed». `git grep -il pingo -- src ':!**/__tests__/**' ':!**/*.test.ts' ':!**/*.test.tsx' | wc -l`
    da `0`. El paso 3 de §Re-verificar sobre C4 da
    `caso A: 23 entradas, 0 descuadradas; 0 pins de documento sin entrada; 0 líneas para el reemplazo de C4`.
  - `graphify update .` no se corrió: es opcional y `graphify-out/` no está en la lista
    cerrada de ficheros.
- **C5** `8825994b` `test(mobile): R5 red, walking pose asset (#225)`. Crea
  `src/__tests__/orbit-activity-pose.test.ts` con los dos `it` de R5.
  `bunx jest src/__tests__/orbit-activity-pose.test.ts`: 1 failed, 1 passed. Rojo por
  aserción: `expect(fs.existsSync(path)).toBe(true)` sobre `assets/images/orbit-walk.webp`
  recibe `false`. El `it` del maestro nace verde (declarado en tasks.md; mutación abajo).
  `bunx eslint` del fichero exit 0.
- **C6** `ff392501` `feat(mobile): R5 add orbit-walk.webp (#225)`.
  - Conversión, desde la raíz del worktree:
    ```
    $ uvx --with pillow python -I -c "from PIL import Image; Image.open('specs/mobile-orbit-activity-pose/design-src/mascot-11-walk.png').save('mobile-pet-tracker/assets/images/orbit-walk.webp','WEBP',quality=80,method=6)"
    (exit 0, sin salida)
    $ node -e "…comprobación de design.md §7…"
    true RIFF WEBPVP8X true true 1024 1024
    $ stat -c %s mobile-pet-tracker/assets/images/orbit-walk.webp
    65182
    ```
    65 182 B, la cifra que da design.md §7.
  - Enmienda `no mete otras poses de Pingo (enmendado por #225 R2, R5)`: lista de 10 en el
    orden de la spec (comprobado con `node` y `.sort()`).
  - Verde: `bunx jest src/__tests__/orbit-activity-pose.test.ts src/screens/welcome/index.test.tsx src/__tests__/orbit-rename.test.ts`
    da 3 suites, 96 tests, 0 rojos; `bunx jest app.assets.test.ts` 11 passed.
- **C7** `ea5c6608` `test(mobile): R6 red, home orbit pose follows the phrase (#225)`. Añade a
  `src/screens/home/orbit-phrase.test.ts` el `describe('#225 R6: homeOrbitPose elige la pose por la frase')`
  con sus tres bloques (4 + 1 + 6 = 11 `it`). Cada uno empieza por
  `expect(typeof phrase.homeOrbitPose).toBe('function')` sobre `jest.requireActual('./orbit-phrase')`.
  En «cualquier otra clave da talk», `home.orbitWalkLabel` va con `as TranslationKey` porque
  aún no está en el catálogo. `bunx jest src/screens/home/orbit-phrase.test.ts`: 11 failed,
  22 passed, 33 total; los 11 por esa aserción (`Expected: "function"`, `Received: "undefined"`).
  `bunx eslint` del fichero exit 0; `bunx tsc --noEmit` exit 0.
- **C8** `0b88a629` `feat(mobile): R6 homeOrbitPose (#225)`. `export function homeOrbitPose` en
  `src/screens/home/orbit-phrase.ts` (design.md §6). Verde:
  `bunx jest src/screens/home/orbit-phrase.test.ts` 33 passed; `bun run typecheck` exit 0;
  `bunx eslint src/screens/home/orbit-phrase.ts` exit 0.
- **C9** `f1066e52` `test(mobile): R1 R7 red, walking pose and label on Home (#225)`. Solo test:
  - `src/__tests__/orbit-activity-pose.test.ts`: `it` de R1. Lee `ui-copy-table.ts` como
    texto: `jest.requireActual('./ui-copy-table')` dentro de un `it` registraría sus
    `describe` dentro del test.
  - `src/__tests__/ui-copy-table.ts`: fila `{ file: 'src/screens/home/index.tsx', key: 'home.orbitWalkLabel' }`
    al final de `R3_HOME`, literal, sin `as TranslationKey` (fe de erratas E2, `bb43a455`).
  - `src/__tests__/ui-language.test.ts`: `#71 R11` con `+ 1`, `// +1 #225 R1` y sufijo.
  - `src/providers/__tests__/language-provider.test.tsx`: `#194 R1` con `+ 1, // #225 R1` y sufijo.
  - `src/screens/home/index.test.tsx`: `describe('#225 R7: …')` con sus 4 `it`, y `#190 R4`
    enmendado con la rama `Calm`. El sufijo se añade aparte, como en los precedentes del repo
    con dos features distintas (`(enmendado por #205 R17) (enmendado por #220 R14)`):
    `(enmendado por #195 R16) (enmendado por #225 R7)`. El fixture `Meals` lleva
    `weekComparison: { distanceM: null, activeMinutes: null, walkCount: null }` (E2,
    design.md §6). El de respaldo de `Walk` no se usó: el fixture por defecto ya da la frase.

  Rojos, con `bunx jest src/screens/home/index.test.tsx src/__tests__/orbit-activity-pose.test.ts src/providers/__tests__/language-provider.test.tsx src/__tests__/ui-language.test.ts`:
  6 failed, 480 passed, 486 total. Todos por aserción; ningún TypeError, ReferenceError ni
  «Cannot find module»:
  - R1: `en['home.orbitWalkLabel']` y `es[…]` `undefined` (aserción `toEqual`);
  - `#194 R1`: `Expected length: 693`, `Received length: 692`;
  - `#71 R11` y `#65 R18 › resuelve cada ocurrencia…`: `checkUses` no encuentra
    `t('home.orbitWalkLabel'` en `index.tsx`;
  - R7 Walk y WalkMeals: `testUri` `../../../assets/images/orbit-talk.webp`.

  Nacen verdes (declarado en tasks.md): R7 Meals, R7 Calm y `#190 R4` enmendado. Sus
  mutaciones (M5, M8) se corren tras C10, abajo.

  `bunx tsc --noEmit` exit 2, con un único error:
  `src/__tests__/ui-copy-table.ts(130,41): error TS2322`, la fila literal de `home.orbitWalkLabel`.
  Es el único error de tipos admitido en C9 (E2); `typecheck` sale 0 desde C10.
  `bunx eslint` de los 5 ficheros exit 0.

- **C10** `3ab17a84` `feat(mobile): R1 R7 Orbit walks on Home when the phrase is about activity (#225)`.
  - `catalog.ts`: `'home.orbitWalkLabel'` tras `home.orbitPhraseCalm`, `Orbit walking` en `en` y
    `Orbit caminando` en `es`.
  - `src/screens/home/index.tsx`: importa `homeOrbitPose`; constante de módulo
    `ORBIT_POSE_SOURCE` con los dos `require` estáticos; `const orbitPose = orbitPhrase !== null ? homeOrbitPose(orbitPhrase.labelKey) : 'talk';`
    junto a `orbitPhrase` (ver «Decisiones»); la `Image` `home-orbit` conserva
    `style={{ width: 56, height: 56 }}`, sin `className`, y gana `source={ORBIT_POSE_SOURCE[orbitPose]}`,
    `accessible={orbitPose === 'walk'}` y
    `accessibilityLabel={orbitPose === 'walk' ? t('home.orbitWalkLabel') : undefined}`.
    `grep -c "t('home.orbitWalkLabel'" src/screens/home/index.tsx` da `1`.
  - `specs/mobile-ui-language/design.md` §2.39: fila
    `| — | \`home.orbitWalkLabel\` | \`Orbit walking\` | \`Orbit caminando\` | ← añadida por #225 (R1) |` al final.
  - Verde: `bunx jest src/screens/home src/__tests__ src/providers` da 52 suites, 1687 tests,
    0 rojos; `bun run typecheck` exit 0; `bun run lint` exit 0 sin «Killed».

- **C11** `3954a658` `test(mobile): R8 red, close #190 H3 (#225)`. Añade el `it`
  «#225 R8: la hipótesis H3 de #190 queda cerrada» a `src/__tests__/orbit-activity-pose.test.ts`
  (`existsSync` y tres aserciones). `bunx jest src/__tests__/orbit-activity-pose.test.ts`:
  1 failed, 3 passed, 4 total; rojo por la primera aserción
  (`Expected substring: not "(H3 pendiente: pose placeholder.)"`). `bunx eslint` del fichero
  exit 0; `bunx tsc --noEmit` exit 0.
- **C12** `957f8d3c` `docs(spec): R8 close #190 H3 with the walking pose (#225)`. En
  `specs/mobile-home-pingo-phrase/requirements.md`: R4 cambia `(H3 pendiente: pose placeholder.)`
  por ``(H3 cerrada por #225 R8: la pose de actividad es `orbit-walk.webp`.)``, y la última
  celda de la fila H3 gana al final ` Cerrada por #225 (R8).`, literal, sin añadir punto
  (queda `… y su test Cerrada por #225 (R8).`). §Aprobación sin tocar (`- [x] H3 …` igual).
  Verde: jest completo en dos shards (`--shard=1/2`: 89 suites, 3125 tests; `--shard=2/2`:
  89 suites, 3415 tests; 0 rojos), `bun run typecheck` exit 0, `bun run lint` exit 0 sin «Killed».

- **C13** `9d1655a5` `docs(ui): R9 charter note names the orbit prefix (#225)`. Un solo commit:
  - `docs/ui-guidelines.md`: el párrafo «Antes» de R9 (punto 7) pasa al párrafo «Después», literal;
  - `src/__tests__/orbit-charter-voice.test.ts`: la constante `note` pasa al párrafo «Después» y el
    `it` se llama `#221 R4: la carta nombra a Orbit en el punto 7 (enmendado por #225 R9)`;
  - `src/__tests__/orbit-rename.test.ts`: borradas las dos filas «R9 la borra» y el segundo `it`
    de R4 se llama `#225 R4: cada excepción casa exactamente las líneas declaradas (enmendado por #225 R9)`;
  - `specs/mobile-orbit-activity-pose/design.md` §4: borradas las mismas dos filas.

  Comprobaciones, desde la raíz:
  - la medición de requirements.md R9 no imprime nada (exit 0);
  - `grep -c '^## Enmienda' docs/ui-guidelines.md` da `31`, igual que antes de C13;
  - el paso 3 de §Re-verificar da
    `caso A: 21 entradas, 0 descuadradas; 0 pins de documento sin entrada; 0 líneas para el reemplazo de C4`,
    la cifra que da requirements.md R9.

  Verde: jest completo en dos shards (`--shard=1/2`: 89 suites, 3125 tests; `--shard=2/2`:
  89 suites, 3415 tests; 0 rojos), `bun run typecheck` exit 0, `bun run lint` exit 0 sin «Killed».

## Decisiones

- **Sufijo de un `it` enmendado dos veces por #225.** `#221 R3` (C2 y C4) y `no mete otras
  poses de Pingo` (C2 y C6) llevan un solo sufijo con los dos R-ids, como el precedente del
  repo `(enmendado por #214 R4, R6)`: `(enmendado por #225 R2, R3)` y
  `(enmendado por #225 R2, R5)`. Así el sufijo va una sola vez al final del nombre.
- **Paso 3 de la regla de escaneo de R4.** design.md §3 dice «se quita el literal de
  título». El `it` quita solo el literal (`replace(titleLiteral, '$1')`) y sigue escaneando
  los argumentos de `it.each([...])`, que no son título. El script del paso 3 de
  §Re-verificar quita la coincidencia entera, argumentos incluidos. La única diferencia en
  el árbol es `__tests__/home-pingo-phrase.test.ts:34`, el `it.each` de #190 R12 con
  `'src/screens/home/pingo-phrase.ts'`, que requirements.md (C8 grep-clean) pide reapuntar
  a `orbit-phrase.ts`. Por eso el rojo de C3 lista 258 líneas y el paso 3 sobre el mismo
  árbol da 257 (296 en H0, menos las 39 líneas que ya renombró C2). La cuenta es
  informativa (design.md §3), y tras C4 las dos lecturas dan 0.
- **Dónde vive `orbitPose`.** design.md §6 dice «dentro del bloque que ya pinta la burbuja:
  `const orbitPose = homeOrbitPose(orbitPhrase.labelKey)`». Ese bloque es un ternario JSX
  (`{orbitPhrase !== null ? (…) : null}`), donde no cabe un `const` sin una IIFE. La constante
  va justo debajo de `orbitPhrase`, con la misma llamada y `'talk'` cuando no hay frase (no
  se pinta nada en ese caso). El comportamiento es el de §6, y M5 y M8 dan sus rojos.

## Mutaciones

- **M3** (C3, segundo `it` de R4). Orden:
  `sed -i "s|^const exceptions = \[|const exceptions = [\n  { file: '__tests__/orbit-charter-voice.test.ts', snippet: 'mutación M3 que no casa nada', lines: 1 },|" src/__tests__/orbit-rename.test.ts`
  y `bunx jest src/__tests__/orbit-rename.test.ts -t 'cada excepción casa'`. Salida:
  `✕ #225 R4: cada excepción casa exactamente las líneas declaradas`, con
  `+   "__tests__/orbit-charter-voice.test.ts: mutación M3 que no casa nada declara 1, casa 0",`
  (`Tests: 1 failed, 6 skipped, 7 total`). Revertida restaurando la copia; `grep -c M3` da 0.
- **Maestro de R5** (C5). Orden, desde la raíz:
  `mv specs/mobile-orbit-activity-pose/design-src/mascot-11-walk.png specs/mobile-orbit-activity-pose/design-src/mascot-11-walk.moved.png`
  y `bunx jest src/__tests__/orbit-activity-pose.test.ts -t 'maestro'`. Salida:
  `✕ #225 R5: el maestro PNG y su prompt están congelados en la spec`, con
  `expect(fs.existsSync(master)).toBe(true)`: `Expected: true`, `Received: false`
  (`Tests: 1 failed, 1 skipped, 2 total`). Revertida con el `mv` inverso; `git status --short specs` vacío.
- **M5** (tras C10; nacen verdes de C9). Orden:
  `sed -i "s#return labelKey === 'home.orbitPhraseWalkMeals' || labelKey === 'home.orbitPhraseWalk' ? 'walk' : 'talk';#return 'walk';#" src/screens/home/orbit-phrase.ts`
  y `bunx jest src/screens/home/orbit-phrase.test.ts src/screens/home/index.test.tsx -t "#225 R6|#225 R7|pinta pingo-talk como único hijo"`.
  Salida: `Tests: 9 failed, 352 skipped, 7 passed, 368 total`. Rojos:
  - R6 `home.orbitPhraseMeals → talk`, `home.orbitPhraseCalm → talk`, `cualquier otra clave da talk`
    y las tres filas de distancia/comidas que dan `talk`;
  - `#190 R4: … pinta pingo-talk como único hijo directo del envoltorio y sin etiqueta (enmendado por #195 R16) (enmendado por #225 R7)`;
  - R7 `vuelve a la pose base sin etiqueta cuando la frase es de comidas` y
    `vuelve a la pose base sin etiqueta con la frase de respaldo`, por
    `"testUri": "../../../assets/images/orbit-walk.webp"` frente a `StringMatching /assets\/images\/orbit-talk\.webp$/`.

  Revertida con `cp` de la copia del scratchpad; `git diff --quiet src/screens/home/orbit-phrase.ts` exit 0.
- **M8** (tras C10). Orden:
  `sed -i "s#accessibilityLabel={orbitPose === 'walk' ? t('home.orbitWalkLabel') : undefined}#accessibilityLabel={t('home.orbitWalkLabel')}#" src/screens/home/index.tsx`
  y `bunx jest src/screens/home/index.test.tsx -t "#225 R7|pinta pingo-talk como único hijo"`.
  Salida: `Tests: 3 failed, 330 skipped, 2 passed, 335 total`. Rojos: `#190 R4` enmendado y los
  dos R7 «vuelve a la pose base sin etiqueta…» (`Received: "Orbit caminando"`). Revertida con
  `cp`; `cmp` contra la copia sin diferencias.
- **M11** (tras C13). Orden, desde la raíz:
  `sed -i 's/^Desde la feature #225, los identificadores/Hasta la feature #225, los identificadores/' docs/ui-guidelines.md`
  y `bunx jest src/__tests__/orbit-charter-voice.test.ts`. Salida:
  `● #221 R4: … › #221 R4: la carta nombra a Orbit en el punto 7 (enmendado por #225 R9)`, en
  `expect(block.split(note).length - 1).toBe(1)`: `Expected: 1`, `Received: 0`
  (`Tests: 1 failed, 1 total`). Revertida con `cp` de la copia; `cmp` sin diferencias.
- **M12** (tras C13). Orden: volver a poner en `exceptions` de `orbit-rename.test.ts`, delante de
  `conservan «Pingo»`, la fila
  `{ file: '__tests__/orbit-charter-voice.test.ts', snippet: 'catálogo y los assets conservan el prefijo pingo (PingoFloat,', lines: 1 },`
  (script `python3 -I` con `str.replace`), y
  `bunx jest src/__tests__/orbit-rename.test.ts -t 'cada excepción casa'`. Salida:
  `✕ #225 R4: cada excepción casa exactamente las líneas declaradas (enmendado por #225 R9)`, con
  `+   "__tests__/orbit-charter-voice.test.ts: catálogo y los assets conservan el prefijo pingo (PingoFloat, declara 1, casa 0",`
  (`Tests: 1 failed, 6 skipped, 7 total`). Revertida con `cp`; `cmp` sin diferencias.

## Nace verde

- C3, `#225 R4: cada excepción casa exactamente las líneas declaradas`: declarado en
  tasks.md; el paso 3 ya comprobó que las 23 entradas casan. Mutación M3.
- C5, `#225 R5: el maestro PNG y su prompt están congelados en la spec`: declarado en
  tasks.md; el autor de la spec ya congeló `design-src/`. Mutación: renombrar el PNG.
- C9, R7 «vuelve a la pose base sin etiqueta cuando la frase es de comidas», R7 «… con la frase
  de respaldo» y `#190 R4` enmendado: declarados en tasks.md (hoy la pose es siempre talk).
  Mutaciones M5 y M8.

## Cifras finales (jest, tsc, lint)

Sobre `9d1655a5` (C13), desde `mobile-pet-tracker/`. Los tres logs están en `progress/`, sin commitear.

```
$ bunx jest --ci > ../progress/jest_225_final.log 2>&1; echo $?
0
Test Suites: 178 passed, 178 total
Tests:       6540 passed, 6540 total
Snapshots:   1 passed, 1 total
(166 s; ningún flake conocido, nada repetido)

$ bunx tsc --noEmit > ../progress/tsc_225.log 2>&1; echo $?
0          (log vacío)

$ bunx expo lint --no-cache > ../progress/lint_225.log 2>&1; echo $?
0          (log vacío; grep -c Killed da 0)

$ git grep -il pingo -- src ':!**/__tests__/**' ':!**/*.test.ts' ':!**/*.test.tsx' | wc -l
0

$ git diff --quiet -- . ../docs ../specs && test -z "$(git ls-files --others --exclude-standard -- . ../docs ../specs)"; echo $?
0
```

Las dos shards de C12 y C13 suman lo mismo que la corrida entera: 3125 + 3415 = 6540.

## Trazabilidad

`specs/mobile-orbit-activity-pose/traceability.md` rellenada, R1–R9, sin filas «pendiente»,
en el commit `docs(spec)` final junto con este reporte.

## Archivos

Diff de la feature, desde `43a9ed33` (handoff): 67 ficheros.
- Creados: `assets/images/orbit-walk.webp`, `src/__tests__/orbit-rename.test.ts`,
  `src/__tests__/orbit-activity-pose.test.ts`.
- Renombrados: las 9 `pingo-*.webp` a `orbit-*.webp`; `components/pingo-float.tsx`,
  `theme/pingo-stage.ts`, `screens/home/pingo-phrase.ts` y sus dos tests a `orbit-*`.
- Modificados en producción: `catalog.ts`, `screens/home/index.tsx`, `orbit-phrase.ts`
  (`homeOrbitPose`) y los ficheros del renombrado de C4.
- Fuera de `mobile-pet-tracker/`: `docs/ui-guidelines.md` (solo el párrafo de R9),
  `specs/mobile-ui-language/design.md` (§2.39), `specs/mobile-home-pingo-phrase/requirements.md`
  (R4 y la fila H3), `specs/mobile-orbit-activity-pose/design.md` §4 (las dos filas de R9) y
  `traceability.md`. `specs/mobile-orbit-activity-pose/tasks.md` y design.md §6 los cambió el
  leader en `bb43a455` (E2), no yo.

## Notas para el reviewer

- **Dónde vive `orbitPose`** (ver «Decisiones»): junto a `orbitPhrase`, con `'talk'` cuando no
  hay frase, porque el bloque de la burbuja es un ternario JSX.
- **`#225` en literales de test.** Cinco líneas `+` de test tienen `#225` sin `R<n>` delante.
  Ninguna es título ni comentario: son literales de documento que el test busca tal cual. Son
  el encabezado `### §2.39 — Añadidos por #225 — …`, las celdas `← añadida por #225 (R1)` y
  `← renombrada desde … por #225 (R3)`, y ` Cerrada por #225 (R8).`.
- **Fila H3 de #190.** Se le añadió ` Cerrada por #225 (R8).` literal, sin punto delante, así que
  queda `… y su test Cerrada por #225 (R8).`. Si se quiere `test. Cerrada`, es un carácter y no
  rompe el candado de R8.
- El `stash` que lista `git stash list` es ajeno a esta feature (el stash es del repo).

## PARA (resuelto)

Parado en C9 antes de commitear, por dos dudas: el fixture `Meals` de design.md §6 sin
`weekComparison` (TS2345 y `TypeError … 'activeMinutes'`, con el `it` en rojo por «Unable to
find … home-orbit-text» en vez de nacer verde), y si la fila de `ui-copy-table.ts` iba literal
pese al TS2322. Las cerró la fe de erratas E2 del leader (`bb43a455`, design.md §6 y tasks.md
C9): `weekComparison: { distanceM: null, activeMinutes: null, walkCount: null }`, y la fila
literal, con el TS2322 como único error admitido en C9. Aplicado en C9.
