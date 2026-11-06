# Implementación — mobile-orbit-cachorro-art (#243)

Fecha: 2026-11-06. H0: `647a3056500ef67cd00eeb2a31b810d4e214b01b`.
Estado: BLOQUEADO tras C5 por incompatibilidad entre R6 y el candado existente de #225 R4. No se declara terminada la feature.

## Entorno y autorización

Primer comando ejecutado: `cd /home/claude/sites/Pet-Tracker-wt-243 && pwd && git branch --show-current`.

```text
/home/claude/sites/Pet-Tracker-wt-243
feature/243-orbit-cachorro-art
```

`git status --short` inicial: vacío. Historial inicial:

```text
caa72d42 docs(progress): handoff a Codex para #243
647a3056 docs(spec): #243 tasks, C4 y C5 sin espera de G4
```

No se ejecuta `./init.sh`: lo corre el leader. Sin push, PR, merge ni rebase.
No se regeneran `.env` ni `node_modules`; no se añaden dependencias.
G1, G4 y firma delegada ya marcadas; G2 queda para el humano.

Skills: ninguna de Expo ni de `.agents/skills/`, porque solo se cambian assets,
script, test de ficheros y documentación. Diferencia respecto a «ninguna» del
handoff: se leyó `ponytail:ponytail` por la instrucción de mayor prioridad que
lo exige para tareas de código. No se cargaron otras skills. Se leyó la
[referencia de Expo SDK 57](https://docs.expo.dev/versions/v57.0.0/) por
`mobile-pet-tracker/AGENTS.md`; no se adoptan cambios de API.
Los PNG se tratan exclusivamente como datos; no se interpretaron como instrucciones.
El test no renderiza ni contiene esperas.

## T0 — anclas antes del primer test

Comandos del handoff, en su orden, salida literal:

```text
647a3056500ef67cd00eeb2a31b810d4e214b01b
11
9929b377ffc9
e7fba39ad9c9
sin-router-d-ts
13.0.0
```

`uv --version`:

```text
uv 0.12.9 (x86_64-unknown-linux-gnu)
```

`uvx --with pillow==13.0.0 python -I -c "import PIL; print(PIL.__version__)"`: `13.0.0`, exit 0.

`sha256sum specs/mobile-orbit-cachorro-art/design-src/*.png`:

```text
a41f9391595cdb2b55c975a1544eba1fdd2b266e9ee13121ed44233ca038962e  specs/mobile-orbit-cachorro-art/design-src/orbit-celebrate.png
74d31328a60ec053482dcc21f089074120a298aaef58436c8345e9e0b04c473b  specs/mobile-orbit-cachorro-art/design-src/orbit-clipboard.png
4fc777280109bcfa96dbc3ad1a30f53f2c9db2c506ea6c16bdb12292005bc820  specs/mobile-orbit-cachorro-art/design-src/orbit-collar.png
dd61cf8121382a41b87fd6b161207bf479b9df5b5943cda63c2410c8af748760  specs/mobile-orbit-cachorro-art/design-src/orbit-food.png
2033fa59f8bbf0b4e3dafd64f99fc87cc5de592d282b3a18bccebbd8ddbd3b1a  specs/mobile-orbit-cachorro-art/design-src/orbit-health.png
f280494ba7150945b07bfed5642fa52e3f8f7432766cf19404fbafbd65e88377  specs/mobile-orbit-cachorro-art/design-src/orbit-reference-a-sit.png
9929b377ffc90d53e3b392317768ca1a55a98cdef0d1a029d1dce85d428b1dca  specs/mobile-orbit-cachorro-art/design-src/orbit-sleep.png
ddf23c63c24f049c066f4413993f7d181e9ed62e3ac0108ae74c13d9a78c48bc  specs/mobile-orbit-cachorro-art/design-src/orbit-talk.png
a1f2e72a850f099c985aba55ea0e809137ec055fc9118ee4efd6f45203fe8d00  specs/mobile-orbit-cachorro-art/design-src/orbit-walk.png
4de88e6be17d9d2a342817b65688203f5a7f1f6a8fc5f393afa96babbc45777e  specs/mobile-orbit-cachorro-art/design-src/orbit-wave-blink.png
d24100ccea224165cda2632db653551a6f7131379460e60c0306e9b0fcf68ddc  specs/mobile-orbit-cachorro-art/design-src/orbit-wave.png
```

Todos coinciden con requirements.md §Constantes.

## C1 — test rojo

Commit: `42e9c47c` — `test(mobile): R1 R2 R3 red, puppy art locked by content (#243)`.
Comando desde `mobile-pet-tracker/` (ambos `pgrep` del handoff vacíos antes):

```text
bunx jest --runTestsByPath src/__tests__/orbit-cachorro-art.test.ts --testTimeout=30000
Test Suites: 1 failed, 1 total
Tests:       12 failed, 22 passed, 34 total
exit=1
```

Diez fallos R2 por sha256 viejo, uno R2 por arte viejo presente y uno R3 por
`existsSync` false (expected true). Sin `ENOENT`, `ReferenceError` ni import roto.
R1 y R3 fuentes nacen verdes como prescribe la spec; se probarán con M4 y M6.
Log íntegro local: `progress/c1-red-243.log` (ignorado por git).
Las constantes del test son literales: contraste adicional confirmó los 10
`NEW_SHA`, 10 `OLD_SHA` y 11 `SOURCE_SHA` contra requirements.md.

Incidencia de invocación sin cambios de ficheros: `python` no existe (exit 127)
al contrastar esas constantes con biblioteca estándar. Se corrigió a `python3`,
exit 0. La conversión sigue usando exclusivamente `uvx` con Pillow fijado.

## C2 — conversión determinista

Script extraído byte a byte del bloque Python de design.md §2, salto final incluido.
Primero: `uvx --with pillow==13.0.0 python -I specs/mobile-orbit-cachorro-art/convert-orbit.py /tmp/orbit-out-243`.
Salida temporal literal (exit 0):

```text
pose bytes sha256 bbox(l,t,r,b margins) minAlpha>0
wave 42274 329e54a136e9d96a3567e39cc5aa128566723815a5b7cbdc86251d299ee66cec (121, 115, 125, 83) 16 ok
wave-blink 40048 573277aa19494e1645a6738195518743be97e3eb9b947d219f71e6b588cf6a35 (121, 115, 123, 82) 16 ok
talk 40484 b0e292c12012c2d9468146d5ca8a436b3ea5017ab09db908756d50f950136014 (112, 116, 164, 82) 16 ok
celebrate 45710 dc04b17c2141975dc7f94f891fceee027d35ea641752b911430e7e2a7899f2f7 (94, 79, 99, 120) 16 ok
sleep 25882 29c241fdfaf29f91b0468b6c4332e59ccabec3f9bf6f475d92dac4045669790e (114, 274, 122, 275) 16 ok
collar 39430 e398800a813d36d2d2fc401dd298df41f72f856c253126ed98ff47b1fda8edc9 (116, 116, 118, 77) 16 ok
health 43316 77dcf90cbcada5d500692b4fd1e3bd2507fcd52971584c7fa14035de507c84d8 (123, 118, 126, 82) 16 ok
food 42862 c7737dfe65188b16fb42f2e70ce59bfd6aec655d5c7cb3818c675d9ab5d93b13 (106, 119, 113, 82) 16 ok
clipboard 41948 e2c3dec28c20ae6f45ae8fa488ba432f2da1c3d4d4f8a72645e6f9696d7e27f9 (123, 116, 127, 68) 16 ok
walk 38914 391db95f89c993be39263e8d81ddc8d899c2841aecf3436a4fb75895a7faba41 (128, 147, 128, 148) 16 ok
exit=0
```

Contraste independiente con requirements.md §Constantes y design.md §2: diez hashes, bytes, márgenes, alfa mínimo y filas `ok` idénticos. Solo después se ejecutó sin argumento.

Salida de producción idéntica byte a byte a la salida temporal, diez filas `ok`, exit 0. Los diez `sha256sum` de producción coinciden con la tabla anterior.
C2 verde: `bunx jest --runTestsByPath src/__tests__/orbit-cachorro-art.test.ts --testTimeout=30000`, 1 suite, 34/34, exit 0.
`git status --short -- mobile-pet-tracker/ specs/ docs/` tras convertir: solo los diez WebP modificados y `convert-orbit.py` nuevo.
Guarda antes de tipos: `test ! -e .expo/types/router.d.ts`, exit 0. `bun run typecheck > /tmp/typecheck-243.log 2>&1`: `$ tsc --noEmit`, exit 0.

C2 commit: `f7973231` — `feat(mobile): R2 R4 green, Orbit puppy art replaces the robot (#243)`.
Lint C2: `bunx expo lint --no-cache > ../progress/lint-243.log 2>&1 && test ! -s ../progress/lint-243.log`, exit 0; log vacío.

## Guardas tras C2

`git diff --name-only 647a3056500ef67cd00eeb2a31b810d4e214b01b..HEAD -- mobile-pet-tracker/assets | sort`:

```text
mobile-pet-tracker/assets/images/orbit-celebrate.webp
mobile-pet-tracker/assets/images/orbit-clipboard.webp
mobile-pet-tracker/assets/images/orbit-collar.webp
mobile-pet-tracker/assets/images/orbit-food.webp
mobile-pet-tracker/assets/images/orbit-health.webp
mobile-pet-tracker/assets/images/orbit-sleep.webp
mobile-pet-tracker/assets/images/orbit-talk.webp
mobile-pet-tracker/assets/images/orbit-walk.webp
mobile-pet-tracker/assets/images/orbit-wave-blink.webp
mobile-pet-tracker/assets/images/orbit-wave.webp
```

`git diff --name-only 647a3056500ef67cd00eeb2a31b810d4e214b01b..HEAD -- mobile-pet-tracker/src`:

```text
mobile-pet-tracker/src/__tests__/orbit-cachorro-art.test.ts
```

`git diff --name-only 647a3056500ef67cd00eeb2a31b810d4e214b01b..HEAD -- . ':!mobile-pet-tracker' ':!specs' ':!progress' ':!docs/ui-guidelines.md'`: salida vacía.

`git diff --name-only 647a3056500ef67cd00eeb2a31b810d4e214b01b..HEAD -- mobile-pet-tracker/package.json mobile-pet-tracker/bun.lock`: salida vacía.

`git diff --name-only 647a3056500ef67cd00eeb2a31b810d4e214b01b..HEAD -- docs/ui-guidelines.md`: salida vacía antes de C5.

## C3 — verde de la cadena tras C2

`bunx jest --runTestsByPath src/__tests__/orbit-cachorro-art.test.ts --testTimeout=30000`

```text
PASS src/__tests__/orbit-cachorro-art.test.ts
Test Suites: 1 passed, 1 total
Tests:       34 passed, 34 total
Snapshots:   0 total
Time:        2.375 s, estimated 17 s
Ran all test suites within paths "src/__tests__/orbit-cachorro-art.test.ts".
exit=0
```

`bunx jest --runTestsByPath src/__tests__/orbit-activity-pose.test.ts src/__tests__/orbit-rename.test.ts src/__tests__/orbit-rename-copy.test.ts src/__tests__/orbit-charter-voice.test.ts src/__tests__/design-drift.test.ts --testTimeout=30000`

```text
PASS src/__tests__/orbit-activity-pose.test.ts
PASS src/__tests__/orbit-rename.test.ts
PASS src/__tests__/orbit-rename-copy.test.ts
PASS src/__tests__/design-drift.test.ts
PASS src/__tests__/orbit-charter-voice.test.ts
Test Suites: 5 passed, 5 total
Tests:       143 passed, 143 total
Snapshots:   0 total
Time:        3.802 s
Ran all test suites within paths "src/__tests__/orbit-activity-pose.test.ts", "src/__tests__/orbit-rename.test.ts", "src/__tests__/orbit-rename-copy.test.ts", "src/__tests__/orbit-charter-voice.test.ts", "src/__tests__/design-drift.test.ts".
exit=0
```

`bunx jest --runTestsByPath src/screens/welcome/index.test.tsx src/components/__tests__/empty-state.test.tsx src/components/__tests__/celebration.test.tsx src/components/__tests__/empty-state-hero.test.tsx --testTimeout=30000`

```text
PASS src/components/__tests__/empty-state.test.tsx (67.054 s)
PASS src/components/__tests__/empty-state-hero.test.tsx
PASS src/screens/welcome/index.test.tsx (71.029 s)
PASS src/components/__tests__/celebration.test.tsx (73.647 s)
Test Suites: 4 passed, 4 total
Tests:       274 passed, 274 total
Snapshots:   0 total
Time:        74.365 s
Ran all test suites within paths "src/screens/welcome/index.test.tsx", "src/components/__tests__/empty-state.test.tsx", "src/components/__tests__/celebration.test.tsx", "src/components/__tests__/empty-state-hero.test.tsx".
exit=0
```

`bunx jest --runTestsByPath app.assets.test.ts app.config.test.ts --testTimeout=30000`

```text
PASS ./app.config.test.ts
PASS ./app.assets.test.ts (13.335 s)
Test Suites: 2 passed, 2 total
Tests:       32 passed, 32 total
Snapshots:   0 total
Time:        13.775 s
Ran all test suites within paths "app.assets.test.ts", "app.config.test.ts".
exit=0
```

Antes de cada ejecución, ambos pgrep del handoff estaban vacíos. Sin timeouts ni fallos.
Avisos de las suites existentes: Uniwind no resuelve `--color-foreground` y `--theme` en los dobles; HeroUI informa sus principios de estilo; app.config avisa de `RESET_LINK_HOST` no definido en el caso de configuración probado. No se modificaron tests ni código para silenciarlos.

## C4 y C5 — enmienda

C4 commit: `3b178619` — `test(mobile): R6 red, charter amendment for the puppy art (#243)`.
Con ambos pgrep vacíos, `bunx jest --runTestsByPath src/__tests__/orbit-cachorro-art.test.ts --testTimeout=30000`:

```text
Expected: 1
Received: 0
Test Suites: 1 failed, 1 total
Tests:       1 failed, 34 passed, 35 total
exit=1
```

Rojo por aserción de la cuenta de secciones, antes de tocar la carta.
C5: añadido al final el literal de design.md §4, con fecha UTC 2026-11-06 y
casilla desmarcada, sin cambiar ningún byte previo de la carta.
El test nuevo queda verde: 1 suite, 35/35 tests, exit 0 (`progress/c5-green-243.log`).

## Bloqueo — parar según el handoff

Al repetir el segundo grupo de §Verde de la cadena tras C5, falla `src/__tests__/orbit-rename.test.ts::#225 R4: el código de test solo nombra a Pingo en títulos, comentarios y pins de documento`.

Comando: `bunx jest --runTestsByPath src/__tests__/orbit-activity-pose.test.ts src/__tests__/orbit-rename.test.ts src/__tests__/orbit-rename-copy.test.ts src/__tests__/orbit-charter-voice.test.ts src/__tests__/design-drift.test.ts --testTimeout=30000`. Ambos pgrep vacíos antes. Salida íntegra:

```text
FAIL src/__tests__/orbit-rename.test.ts
  ● #225 R4: el código de test solo nombra a Pingo en títulos, comentarios y pins de documento

    expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 3

    - Array []
    + Array [
    +   "__tests__/orbit-cachorro-art.test.ts:106: for (const literal of ['cachorro', 'parche morado', '#178255', 'antena', 'Pingo', 'diez poses']) {",
    + ]

      155 |       return [`${file}:${index + 1}: ${trimmed}`];
      156 |     });
    > 157 |   })).toEqual([]);
          |       ^
      158 | });
      159 |
      160 | it('#225 R4: cada excepción casa exactamente las líneas declaradas (enmendado por #225 R9)', () => {

      at Object.toEqual (src/__tests__/orbit-rename.test.ts:157:7)

PASS src/__tests__/orbit-activity-pose.test.ts
PASS src/__tests__/design-drift.test.ts
PASS src/__tests__/orbit-rename-copy.test.ts
PASS src/__tests__/orbit-charter-voice.test.ts

Test Suites: 1 failed, 4 passed, 5 total
Tests:       1 failed, 142 passed, 143 total
Snapshots:   0 total
Time:        4.031 s
Ran all test suites within paths "src/__tests__/orbit-activity-pose.test.ts", "src/__tests__/orbit-rename.test.ts", "src/__tests__/orbit-rename-copy.test.ts", "src/__tests__/orbit-charter-voice.test.ts", "src/__tests__/design-drift.test.ts".
exit=1
```

Causa: R6 exige asertar el literal `Pingo` en el cuerpo de la Enmienda #243. El candado existente de #225 R4 escanea todos los tests (salvo sus dos exclusiones históricas) y rechaza esa línea nueva porque no está en su inventario de excepciones. R5 exige conservar este test sin modificación, y la lista cerrada del handoff tampoco permite editarlo.

El fallo coincide con la orden de parada de requirements.md §Tests existentes y tasks.md C3: si una suite existente falla, parar y reportar, sin editarla. No se altera el test aprobado para esconder el literal, ni se modifica la spec, ni la suite existente. El leader debe resolver la incompatibilidad del contrato y ampliar el alcance antes de reanudar.

Tipos y lint de C5 ya estaban arrancados antes de conocerse el fallo; ambos terminaron con exit 0. Guarda previa de tipos sin router.d.ts; salida `$ tsc --noEmit`. El lint con `--no-cache` dejó log de 0 bytes y pasó `test ! -s`.

La enmienda ya aplicada se conserva en su commit C5 separado para que el leader tenga el trabajo concreto y revisable. Su test R6 y la suite histórica de voz pasan; el verde completo sigue bloqueado.

No se ejecutan después del fallo las suites de componentes/assets de C5, `home-photo-hero-canvas.test.ts`, ni más pruebas de comportamiento. Las guardas de superficie finales sí se registran como cierre de solo lectura.

Mutaciones: ninguna plantada. M1–M12 no se alcanzan porque design.md §5 prescribe plantarlas sobre el verde final y la cadena no está verde. En particular, M4 (R1, nace verde), M6 (R3 fuentes, nace verde), M2 y M8 (zonas ciegas cubiertas por el pin) quedan por demostrar. M13 tampoco se ejecuta: el handoff prohíbe tocar iconos y la guarda R7 confirma que siguen intactos. No se da por satisfecha la revisión de mutaciones.

Desviaciones: la incompatibilidad R5/R6 anterior impide completar las verificaciones; lectura obligatoria de Ponytail, descrita al inicio; invocación `python` corregida a `python3` sin tocar archivos. No hubo fallos de red, denegaciones de sandbox ni discrepancias de hashes.

## Guardas finales tras C5 (HEAD `7d181887`)

`git diff --name-only 647a3056500ef67cd00eeb2a31b810d4e214b01b..HEAD -- mobile-pet-tracker/assets | sort`

```text
mobile-pet-tracker/assets/images/orbit-celebrate.webp
mobile-pet-tracker/assets/images/orbit-clipboard.webp
mobile-pet-tracker/assets/images/orbit-collar.webp
mobile-pet-tracker/assets/images/orbit-food.webp
mobile-pet-tracker/assets/images/orbit-health.webp
mobile-pet-tracker/assets/images/orbit-sleep.webp
mobile-pet-tracker/assets/images/orbit-talk.webp
mobile-pet-tracker/assets/images/orbit-walk.webp
mobile-pet-tracker/assets/images/orbit-wave-blink.webp
mobile-pet-tracker/assets/images/orbit-wave.webp
```

`git diff --name-only 647a3056500ef67cd00eeb2a31b810d4e214b01b..HEAD -- mobile-pet-tracker/src`

```text
mobile-pet-tracker/src/__tests__/orbit-cachorro-art.test.ts
```

`git diff --name-only 647a3056500ef67cd00eeb2a31b810d4e214b01b..HEAD -- . ':!mobile-pet-tracker' ':!specs' ':!progress' ':!docs/ui-guidelines.md'`

```text

```

`git diff --name-only 647a3056500ef67cd00eeb2a31b810d4e214b01b..HEAD -- mobile-pet-tracker/package.json mobile-pet-tracker/bun.lock`

```text

```

Todas las guardas anteriores coinciden. Icono, splash, notificaciones, código de pantalla, dependencias y fuentes PNG permanecen sin cambios.

## Commits y punto de reanudación

```text
caa72d42 docs(progress): handoff a Codex para #243
42e9c47c test(mobile): R1 R2 R3 red, puppy art locked by content (#243)
f7973231 feat(mobile): R2 R4 green, Orbit puppy art replaces the robot (#243)
b1a0746d docs(spec): record R1 R2 R3 R4 R5 R7 evidence after puppy assets (#243)
3b178619 test(mobile): R6 red, charter amendment for the puppy art (#243)
7d181887 docs(ui): R6 charter amendment, Orbit is a puppy (#243)
```

El siguiente paso corresponde al leader: resolver por spec la excepción de #225 R4 para el literal documental que exige R6, y dar un nuevo handoff. Después se repite el verde completo tras C5 (incluido home-photo-hero-canvas) y se plantan las mutaciones. C1/C2 y C4/C5 permanecen en commits separados, sin rebase.
`./init.sh`, suite entera, reviewer y smoke G2 no se ejecutaron aquí; corresponden al leader/humano. No hubo push ni PR. No se tocaron `feature_list.json`, `STATUS.md`, `progress/current.md`, `progress/history.md`, las aprobaciones ni backend.

## Salidas adicionales de C5

`bunx jest --runTestsByPath src/__tests__/orbit-cachorro-art.test.ts --testTimeout=30000`:

```text
PASS src/__tests__/orbit-cachorro-art.test.ts
Test Suites: 1 passed, 1 total
Tests:       35 passed, 35 total
Snapshots:   0 total
Time:        1.599 s, estimated 2 s
Ran all test suites within paths "src/__tests__/orbit-cachorro-art.test.ts".
exit=0
```

`test ! -e .expo/types/router.d.ts`: exit 0. `bun run typecheck > /tmp/typecheck-243.log 2>&1; echo "exit=$?"`:

```text
$ tsc --noEmit
exit=0
```

`bunx expo lint --no-cache > ../progress/lint-243.log 2>&1 && test ! -s ../progress/lint-243.log`: salida vacía, exit 0. `wc -c progress/lint-243.log`: `0 progress/lint-243.log`.
`git diff --check` y `git diff --check H0..HEAD`: salida vacía, exit 0.
