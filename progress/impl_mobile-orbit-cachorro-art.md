# Implementación — mobile-orbit-cachorro-art (#243)

Fecha: 2026-11-06. H0: `647a3056500ef67cd00eeb2a31b810d4e214b01b`.
Estado: implementación y verificación local completadas tras C6 (`5fa2e0b7`). Trece suites del handoff, 512 tests verdes y quince mutaciones detectadas/revertidas. Init y reviewer del leader, y smoke G2 del humano, fuera de esta ejecución.

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

## Incidencia inicial — resuelta por Enmienda 1 y C6

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

En la primera ejecución no se plantó ninguna mutación. M1–M12 no se alcanzan porque design.md §5 prescribe plantarlas sobre el verde final y la cadena no está verde. En particular, M4 (R1, nace verde), M6 (R3 fuentes, nace verde), M2 y M8 (zonas ciegas cubiertas por el pin) quedan por demostrar. M13 tampoco se ejecuta: el handoff prohíbe tocar iconos y la guarda R7 confirma que siguen intactos. No se da por satisfecha la revisión de mutaciones.

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

## Cierre de la primera ejecución (histórico)

```text
caa72d42 docs(progress): handoff a Codex para #243
42e9c47c test(mobile): R1 R2 R3 red, puppy art locked by content (#243)
f7973231 feat(mobile): R2 R4 green, Orbit puppy art replaces the robot (#243)
b1a0746d docs(spec): record R1 R2 R3 R4 R5 R7 evidence after puppy assets (#243)
3b178619 test(mobile): R6 red, charter amendment for the puppy art (#243)
7d181887 docs(ui): R6 charter amendment, Orbit is a puppy (#243)
```

Petición al leader en el cierre inicial: resolver por spec la excepción de #225 R4 y dar un nuevo handoff. Quedó resuelta en `31b7c10a`; la corrección 1, al final de este reporte, registra el verde completo y las mutaciones. C1/C2 y C4/C5 permanecen en commits separados, sin rebase.
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

## Corrección 1 — reanudación

Handoff leído completo: `progress/handoff_mobile-orbit-cachorro-art-fix1.md`. Primer comando: `cd /home/claude/sites/Pet-Tracker-wt-243 && pwd && git branch --show-current`. Salida:

```text
/home/claude/sites/Pet-Tracker-wt-243
feature/243-orbit-cachorro-art
```

`git log --oneline -3` inicial:

```text
00ad0a86 docs(progress): handoff de correccion 1 de #243
31b7c10a docs(spec): #243 Enmienda 1, entrada de exceptions en orbit-rename (firma delegada)
20367c93 docs(spec): report R5 R6 contract conflict and preserve puppy art evidence (#243)
```

Árbol inicial limpio. C6 añade exclusivamente la entrada literal de tasks.md §Enmienda 1 al final de `exceptions`. El rojo previo es el registrado en C5; no se rehacen C1–C5 ni se crea otro commit rojo. No se cargan skills de Expo ni de `.agents/skills/`; sigue aplicando la lectura anterior de Ponytail.

C6: `5fa2e0b7` — `test(mobile): R5 allow the Pingo history literal in the #243 test (#243)`.
El commit contiene solo `src/__tests__/orbit-rename.test.ts`, una inserción literal
al final de `exceptions`, ningún otro cambio. Su fichero entero pasa 7/7 tests,
1 suite, exit 0, incluidos los dos `#225 R4`. El rojo antecedente es C5,
registrado arriba; C6 no necesita repetir el commit rojo.

### Verde retomado tras C6

`bunx jest --runTestsByPath src/__tests__/orbit-rename.test.ts --testTimeout=30000`

```text
PASS src/__tests__/orbit-rename.test.ts
Test Suites: 1 passed, 1 total
Tests:       7 passed, 7 total
Snapshots:   0 total
Time:        3.63 s
Ran all test suites within paths "src/__tests__/orbit-rename.test.ts".
exit=0
```

`bunx jest --runTestsByPath src/__tests__/orbit-activity-pose.test.ts src/__tests__/orbit-rename.test.ts src/__tests__/orbit-rename-copy.test.ts src/__tests__/orbit-charter-voice.test.ts src/__tests__/design-drift.test.ts --testTimeout=30000`

```text
PASS src/__tests__/orbit-activity-pose.test.ts
PASS src/__tests__/orbit-rename.test.ts
PASS src/__tests__/orbit-charter-voice.test.ts
PASS src/__tests__/orbit-rename-copy.test.ts
PASS src/__tests__/design-drift.test.ts
Test Suites: 5 passed, 5 total
Tests:       143 passed, 143 total
Snapshots:   0 total
Time:        3.512 s, estimated 4 s
Ran all test suites within paths "src/__tests__/orbit-activity-pose.test.ts", "src/__tests__/orbit-rename.test.ts", "src/__tests__/orbit-rename-copy.test.ts", "src/__tests__/orbit-charter-voice.test.ts", "src/__tests__/design-drift.test.ts".
exit=0
```

`bunx jest --runTestsByPath src/screens/welcome/index.test.tsx src/components/__tests__/empty-state.test.tsx src/components/__tests__/celebration.test.tsx src/components/__tests__/empty-state-hero.test.tsx --testTimeout=30000`

```text
PASS src/components/__tests__/empty-state.test.tsx (15.787 s)
PASS src/components/__tests__/empty-state-hero.test.tsx
PASS src/screens/welcome/index.test.tsx (19.706 s)
PASS src/components/__tests__/celebration.test.tsx (67.677 s)
Test Suites: 4 passed, 4 total
Tests:       274 passed, 274 total
Snapshots:   0 total
Time:        68.264 s, estimated 74 s
Ran all test suites within paths "src/screens/welcome/index.test.tsx", "src/components/__tests__/empty-state.test.tsx", "src/components/__tests__/celebration.test.tsx", "src/components/__tests__/empty-state-hero.test.tsx".
exit=0
```

`bunx jest --runTestsByPath app.assets.test.ts app.config.test.ts --testTimeout=30000`

```text
PASS ./app.config.test.ts
PASS ./app.assets.test.ts (13.543 s)
Test Suites: 2 passed, 2 total
Tests:       32 passed, 32 total
Snapshots:   0 total
Time:        14.067 s
Ran all test suites within paths "app.assets.test.ts", "app.config.test.ts".
exit=0
```

`bunx jest --runTestsByPath src/__tests__/home-photo-hero-canvas.test.ts --testTimeout=30000`

```text
PASS src/__tests__/home-photo-hero-canvas.test.ts
Test Suites: 1 passed, 1 total
Tests:       28 passed, 28 total
Snapshots:   0 total
Time:        2.014 s
Ran all test suites within paths "src/__tests__/home-photo-hero-canvas.test.ts".
exit=0
```

Todos desde mobile-pet-tracker, con ambos pgrep vacíos antes de cada Jest. Sin timeouts, sin modificar otras suites. Persisten únicamente los avisos Uniwind/HeroUI y el caso RESET_LINK_HOST de app.config descritos en C3.

Tipos y lint tras C6:

```text
test ! -e .expo/types/router.d.ts
exit=0
bun run typecheck > /tmp/typecheck-243.log 2>&1
$ tsc --noEmit
exit=0
bunx expo lint --no-cache > ../progress/lint-243.log 2>&1 && test ! -s ../progress/lint-243.log
(salida vacía; log de 0 bytes)
exit=0
```

Incidencia de invocación de fix1: la primera envoltura JavaScript del lote de
mutaciones tuvo un `SyntaxError` antes de lanzar el shell. No ejecutó ningún
comando ni tocó archivos. Se corrigió el delimitador y se lanzó el mismo lote.

### Mutaciones completadas en fix1

Quince sondas detectadas y revertidas: M1–M13 de design.md §5, más las dos de Enmienda 1. Todos los Jest de mutación dieron exit 1 por aserción; ninguno falló por import roto, ReferenceError ni ENOENT. Después de cada sonda, `git status --short -- mobile-pet-tracker/ specs/ docs/` y `git diff --cached` quedaron vacíos. El reporte en progress/ es el único cambio de trabajo fuera de ese alcance.

| Sonda | Resultado medido |
|---|---|
| M1 | R2 rojo en talk y en ausencia de arte viejo (2 fallos). |
| M2 | R1 verde; R2 talk rojo. Conversor exit 1: alfa mínimo 1, márgenes (0,19,18,15), FALLA. |
| M3 | R1 verde; R2 talk rojo con quality=90 (56024 B). |
| M4 | R1 lista exacta rojo al añadir worried. Demuestra el requisito que nació verde. |
| M5 | R1 lista y existencia de health rojos (2 fallos); orbit-rename R2 rojo (1). |
| M6 | R3 fuentes rojo al cambiar un byte de wave.png. Demuestra el requisito que nació verde. |
| M7 | R3 script rojo con quality=82. |
| M8 | R1 verde; R2 sleep rojo. Conversor exit 0: alfa 16, márgenes (29,222,35,224), 32570 B; el pin detecta la geometría sin reescalar. |
| M9 | R1 lista y R2 ausencia de arte viejo rojos (2 fallos). |
| M10 | R6 rojo al duplicar la enmienda. |
| M11 | R6 rojo al quitar Pingo del cuerpo de la enmienda. |
| M12 | R6 rojo con encabezado posterior Notas. |
| M13 | Guarda R7 roja: once rutas, incluida assets/images/icon.png, en un commit hijo temporal sin refs; HEAD y el icono del worktree intactos. |
| E1-remove | Primer #225 R4 rojo al quitar la entrada C6. |
| E1-lines2 | Segundo #225 R4 rojo al cambiar lines a 2 (declara 2, casa 1). |

M2 y M8 confirman la zona ciega de formato de R1: el pin SHA256 R2 detecta ambos cambios de píxeles. No se modifican hashes esperados ni tablas de la spec.

M13 usa `git commit-tree` sobre un índice temporal, con parent en `5fa2e0b7`, para ejecutar la guarda `H0..mutante` real sobre un árbol de producción alterado. El objeto no tiene refs ni entra en la rama; no se hizo reset, checkout de otra rama, merge ni rebase. Se eliminó el índice temporal. La primera lectura de la sonda usó `assets/icon.png` y dio ENOENT antes de tocar ficheros u objetos: error de invocación corregido a `assets/images/icon.png`, ruta fijada en app.json y app.assets.test.ts.

Comandos y salidas de las sondas (se omiten solo las listas de casos verdes/saltados y tiempos; se conservan aserciones, valores, totales, códigos de salida y todas las comprobaciones de limpieza):

```text
Mutaciones de corrección 1: artefactos reales, sin cambios persistentes de producción.

## M1 — restaurar el talk viejo de H0

M1 antes: git status --short -- mobile-pet-tracker/ specs/ docs/ => vacío; git diff --cached => vacío
$ bunx jest --runTestsByPath src/__tests__/orbit-cachorro-art.test.ts --testTimeout=30000 -t '#243 R2'
FAIL src/__tests__/orbit-cachorro-art.test.ts
  ✕ #243 R2: cada pose tiene el sha256 del arte nuevo (talk) (4 ms)
  ✕ #243 R2: ningún fichero de assets/images conserva el arte viejo (8 ms)

  ● #243 R2: cada pose tiene el sha256 del arte nuevo (talk)

    expect(received).toBe(expected) // Object.is equality

    Expected: "b0e292c12012c2d9468146d5ca8a436b3ea5017ab09db908756d50f950136014"
    Received: "af16821827af1d6ff432fd124e22d9c2121ce67c97c3c9d1335d4cda1ad275fb"

      68 | it.each(POSES)('#243 R2: cada pose tiene el sha256 del arte nuevo (%s)', pose => {
      69 |   const bytes = fs.readFileSync(join(imagesRoot, `orbit-${pose}.webp`));
    > 70 |   expect(createHash('sha256').update(bytes).digest('hex')).toBe(NEW_SHA[pose]);
         |                                                            ^
      71 | });
      72 |
      73 | it('#243 R2: ningún fichero de assets/images conserva el arte viejo', () => {

      at toBe (src/__tests__/orbit-cachorro-art.test.ts:70:60)

  ● #243 R2: ningún fichero de assets/images conserva el arte viejo

    expect(received).not.toContain(expected) // indexOf

    Expected value: not "af16821827af1d6ff432fd124e22d9c2121ce67c97c3c9d1335d4cda1ad275fb"
    Received array:     ["66cd45cb7565be2d4364e705763710109b13a1ad1809a3711c23217026f5f306", "a6a44b702e395517f1d7875600cc106455a9972fab14bf871e3c5f4c155b8549", "af16821827af1d6ff432fd124e22d9c2121ce67c97c3c9d1335d4cda1ad275fb", "12c52706e7b5cc7124a0974e04834e5e5c6c96a0549bcaacbbef10766cac9687", "b8e9745f73dedc6d72f89a588046a7440f32df4b2e9685e70fa96a2b70e3a254", "e7fba39ad9c9d24c3520c82c26b2dc3055103f329b13a60715e15f6acba6938b", "298e8a956c853a00b737ab05a0ba3497912cf7bf8f29f86d25bb515031d085b1", "bc02bf6f4b67ba2834847b5c9dac919b66df227e918502238e2e9fe5884f3ccc", "da68c5bbbe82b2bcb448f6a12d7da77774adc261e75d356c747c0a9614fb483f", "363e1f6502912709570d7448abf5a80f7ac42258957309a04f5733bf513eda28"]

      76 |     if (!fs.statSync(path).isFile()) continue;
      77 |     const hash = createHash('sha256').update(fs.readFileSync(path)).digest('hex');
    > 78 |     expect(Object.values(OLD_SHA)).not.toContain(hash);
         |                                        ^
      79 |   }
      80 | });
      81 |

      at Object.toContain (src/__tests__/orbit-cachorro-art.test.ts:78:40)

Test Suites: 1 failed, 1 total
Tests:       2 failed, 24 skipped, 9 passed, 35 total
exit=1

M1 revertida: git status --short -- mobile-pet-tracker/ specs/ docs/ => vacío; git diff --cached => vacío

## M2 — talk sin clean: R1 queda verde, el pin R2 y la lectura de vuelta detectan alfa residual

M2 antes: git status --short -- mobile-pet-tracker/ specs/ docs/ => vacío; git diff --cached => vacío
$ uvx --with pillow==13.0.0 python -I specs/mobile-orbit-cachorro-art/convert-orbit.py (mutante M2, solo talk)
pose bytes sha256 bbox(l,t,r,b margins) minAlpha>0
talk 63546 054ac287b7c53befaa9abb1cb777a0700188527b2a53f0a37521199ecc92b160 (0, 19, 18, 15) 1 FALLA
exit=1

$ bunx jest --runTestsByPath src/__tests__/orbit-cachorro-art.test.ts --testTimeout=30000 -t '#243 R[12]'
FAIL src/__tests__/orbit-cachorro-art.test.ts
  ✕ #243 R2: cada pose tiene el sha256 del arte nuevo (talk) (4 ms)

  ● #243 R2: cada pose tiene el sha256 del arte nuevo (talk)

    expect(received).toBe(expected) // Object.is equality

    Expected: "b0e292c12012c2d9468146d5ca8a436b3ea5017ab09db908756d50f950136014"
    Received: "054ac287b7c53befaa9abb1cb777a0700188527b2a53f0a37521199ecc92b160"

      68 | it.each(POSES)('#243 R2: cada pose tiene el sha256 del arte nuevo (%s)', pose => {
      69 |   const bytes = fs.readFileSync(join(imagesRoot, `orbit-${pose}.webp`));
    > 70 |   expect(createHash('sha256').update(bytes).digest('hex')).toBe(NEW_SHA[pose]);
         |                                                            ^
      71 | });
      72 |
      73 | it('#243 R2: ningún fichero de assets/images conserva el arte viejo', () => {

      at toBe (src/__tests__/orbit-cachorro-art.test.ts:70:60)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 13 skipped, 21 passed, 35 total
exit=1

M2 revertida: git status --short -- mobile-pet-tracker/ specs/ docs/ => vacío; git diff --cached => vacío

## M3 — talk reconvertida con quality=90

M3 antes: git status --short -- mobile-pet-tracker/ specs/ docs/ => vacío; git diff --cached => vacío
$ uvx --with pillow==13.0.0 python -I specs/mobile-orbit-cachorro-art/convert-orbit.py (mutante M3, solo talk)
pose bytes sha256 bbox(l,t,r,b margins) minAlpha>0
talk 56024 4dbf8184e194eeba8dec517938fbfc68fdbaf16b647a3da572f2367158f01455 (112, 116, 164, 82) 16 ok
exit=0

$ bunx jest --runTestsByPath src/__tests__/orbit-cachorro-art.test.ts --testTimeout=30000 -t '#243 R[12]'
FAIL src/__tests__/orbit-cachorro-art.test.ts
  ✕ #243 R2: cada pose tiene el sha256 del arte nuevo (talk) (4 ms)

  ● #243 R2: cada pose tiene el sha256 del arte nuevo (talk)

    expect(received).toBe(expected) // Object.is equality

    Expected: "b0e292c12012c2d9468146d5ca8a436b3ea5017ab09db908756d50f950136014"
    Received: "4dbf8184e194eeba8dec517938fbfc68fdbaf16b647a3da572f2367158f01455"

      68 | it.each(POSES)('#243 R2: cada pose tiene el sha256 del arte nuevo (%s)', pose => {
      69 |   const bytes = fs.readFileSync(join(imagesRoot, `orbit-${pose}.webp`));
    > 70 |   expect(createHash('sha256').update(bytes).digest('hex')).toBe(NEW_SHA[pose]);
         |                                                            ^
      71 | });
      72 |
      73 | it('#243 R2: ningún fichero de assets/images conserva el arte viejo', () => {

      at toBe (src/__tests__/orbit-cachorro-art.test.ts:70:60)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 13 skipped, 21 passed, 35 total
exit=1

M3 revertida: git status --short -- mobile-pet-tracker/ specs/ docs/ => vacío; git diff --cached => vacío

## M4 — añadir orbit-worried.webp válido

M4 antes: git status --short -- mobile-pet-tracker/ specs/ docs/ => vacío; git diff --cached => vacío
$ bunx jest --runTestsByPath src/__tests__/orbit-cachorro-art.test.ts --testTimeout=30000 -t '#243 R1'
FAIL src/__tests__/orbit-cachorro-art.test.ts
  ✕ #243 R1: las diez poses orbit-*.webp son las únicas y son WebP válidos (6 ms)

  ● #243 R1: las diez poses orbit-*.webp son las únicas y son WebP válidos

    expect(received).toEqual(expected) // deep equality

    - Expected  - 0
    + Received  + 1

    @@ -7,6 +7,7 @@
        "orbit-sleep.webp",
        "orbit-talk.webp",
        "orbit-walk.webp",
        "orbit-wave-blink.webp",
        "orbit-wave.webp",
    +   "orbit-worried.webp",
      ]

      47 | it('#243 R1: las diez poses orbit-*.webp son las únicas y son WebP válidos', () => {
      48 |   expect(fs.readdirSync(imagesRoot).filter(name => /^orbit-.*\.webp$/.test(name)).sort())
    > 49 |     .toEqual(POSES.map(pose => `orbit-${pose}.webp`).sort());
         |      ^
      50 | });
      51 |
      52 | it.each(POSES)('#243 R1: las diez poses orbit-*.webp son las únicas y son WebP válidos (%s)', pose => {

      at Object.toEqual (src/__tests__/orbit-cachorro-art.test.ts:49:6)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 24 skipped, 10 passed, 35 total
exit=1

M4 revertida: git status --short -- mobile-pet-tracker/ specs/ docs/ => vacío; git diff --cached => vacío

## M5 — quitar orbit-health.webp

M5 antes: git status --short -- mobile-pet-tracker/ specs/ docs/ => vacío; git diff --cached => vacío
$ bunx jest --runTestsByPath src/__tests__/orbit-cachorro-art.test.ts --testTimeout=30000 -t '#243 R1'
FAIL src/__tests__/orbit-cachorro-art.test.ts
  ✕ #243 R1: las diez poses orbit-*.webp son las únicas y son WebP válidos (5 ms)
  ✕ #243 R1: las diez poses orbit-*.webp son las únicas y son WebP válidos (health) (1 ms)

  ● #243 R1: las diez poses orbit-*.webp son las únicas y son WebP válidos

    expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 0

    @@ -1,11 +1,10 @@
      Array [
        "orbit-celebrate.webp",
        "orbit-clipboard.webp",
        "orbit-collar.webp",
        "orbit-food.webp",
    -   "orbit-health.webp",
        "orbit-sleep.webp",
        "orbit-talk.webp",
        "orbit-walk.webp",
        "orbit-wave-blink.webp",
        "orbit-wave.webp",

      47 | it('#243 R1: las diez poses orbit-*.webp son las únicas y son WebP válidos', () => {
      48 |   expect(fs.readdirSync(imagesRoot).filter(name => /^orbit-.*\.webp$/.test(name)).sort())
    > 49 |     .toEqual(POSES.map(pose => `orbit-${pose}.webp`).sort());
         |      ^
      50 | });
      51 |
      52 | it.each(POSES)('#243 R1: las diez poses orbit-*.webp son las únicas y son WebP válidos (%s)', pose => {

      at Object.toEqual (src/__tests__/orbit-cachorro-art.test.ts:49:6)

  ● #243 R1: las diez poses orbit-*.webp son las únicas y son WebP válidos (health)

    expect(received).toBe(expected) // Object.is equality

    Expected: true
    Received: false

      52 | it.each(POSES)('#243 R1: las diez poses orbit-*.webp son las únicas y son WebP válidos (%s)', pose => {
      53 |   const path = join(imagesRoot, `orbit-${pose}.webp`);
    > 54 |   expect(fs.existsSync(path)).toBe(true);
         |                               ^
      55 |   const bytes = fs.readFileSync(path);
      56 |   expect({
      57 |     riff: bytes.toString('ascii', 0, 4),

      at toBe (src/__tests__/orbit-cachorro-art.test.ts:54:31)

Test Suites: 1 failed, 1 total
Tests:       2 failed, 24 skipped, 9 passed, 35 total
exit=1

$ bunx jest --runTestsByPath src/__tests__/orbit-rename.test.ts --testTimeout=30000 -t '#225 R2'
FAIL src/__tests__/orbit-rename.test.ts
  ✕ #225 R2: las nueve poses se llaman orbit-* y todo require de imagen resuelve (5 ms)

  ● #225 R2: las nueve poses se llaman orbit-* y todo require de imagen resuelve

    expect(received).toEqual(expected) // deep equality

    Expected: ArrayContaining ["orbit-celebrate.webp", "orbit-clipboard.webp", "orbit-collar.webp", "orbit-food.webp", "orbit-health.webp", "orbit-sleep.webp", "orbit-talk.webp", "orbit-wave.webp", "orbit-wave-blink.webp"]
    Received: ["android-icon-foreground.png", "android-icon-monochrome.png", "expo-badge-white.png", "expo-badge.png", "expo-logo.png", "favicon.png", "icon.png", "logo-glow.png", "orbit-celebrate.webp", "orbit-clipboard.webp", …]

      19 |   const images = fs.readdirSync(imagesRoot);
      20 |   expect(images.filter(name => /pingo/i.test(name))).toEqual([]);
    > 21 |   expect(images).toEqual(expect.arrayContaining([
         |                  ^
      22 |     'orbit-celebrate.webp',
      23 |     'orbit-clipboard.webp',
      24 |     'orbit-collar.webp',

      at Object.toEqual (src/__tests__/orbit-rename.test.ts:21:18)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 6 skipped, 7 total
exit=1

M5 revertida: git status --short -- mobile-pet-tracker/ specs/ docs/ => vacío; git diff --cached => vacío

## M6 — cambiar un byte de orbit-wave.png

M6 antes: git status --short -- mobile-pet-tracker/ specs/ docs/ => vacío; git diff --cached => vacío
$ bunx jest --runTestsByPath src/__tests__/orbit-cachorro-art.test.ts --testTimeout=30000 -t '#243 R3: las fuentes PNG'
FAIL src/__tests__/orbit-cachorro-art.test.ts
  ✕ #243 R3: las fuentes PNG están congeladas (wave) (7 ms)

  ● #243 R3: las fuentes PNG están congeladas (wave)

    expect(received).toBe(expected) // Object.is equality

    Expected: "d24100ccea224165cda2632db653551a6f7131379460e60c0306e9b0fcf68ddc"
    Received: "7ce065208a3d0b53e33085381eac9a231e78bf517fbb1911b7c454e55b9ecca6"

      82 | it.each(Object.entries(SOURCE_SHA))('#243 R3: las fuentes PNG están congeladas (%s)', (pose, hash) => {
      83 |   const png = fs.readFileSync(join(specRoot, 'design-src', `orbit-${pose}.png`));
    > 84 |   expect(createHash('sha256').update(png).digest('hex')).toBe(hash);
         |                                                          ^
      85 |   expect([...png.subarray(0, 8)]).toEqual([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
      86 |   expect(png.toString('ascii', 12, 16)).toBe('IHDR');
      87 |   expect([png.readUInt32BE(16), png.readUInt32BE(20)]).toEqual([1024, 1024]);

      at toBe (src/__tests__/orbit-cachorro-art.test.ts:84:58)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 24 skipped, 10 passed, 35 total
exit=1

M6 revertida: git status --short -- mobile-pet-tracker/ specs/ docs/ => vacío; git diff --cached => vacío

## M7 — cambiar quality=80 por quality=82 en el script

M7 antes: git status --short -- mobile-pet-tracker/ specs/ docs/ => vacío; git diff --cached => vacío
$ bunx jest --runTestsByPath src/__tests__/orbit-cachorro-art.test.ts --testTimeout=30000 -t '#243 R3: el script'
FAIL src/__tests__/orbit-cachorro-art.test.ts
  ✕ #243 R3: el script de conversión está en la spec con sus parámetros (3 ms)

  ● #243 R3: el script de conversión está en la spec con sus parámetros

    expect(received).toContain(expected) // indexOf

    Expected substring: "quality=80, method=6"
    Received string:    "# Uso (desde la raíz del repo):
    #   uvx --with pillow==13.0.0 python -I specs/mobile-orbit-cachorro-art/convert-orbit.py
    # Convierte los diez PNG de design-src a mobile-pet-tracker/assets/images/orbit-<pose>.webp.
    import hashlib, sys
    from pathlib import Path
    from PIL import Image·
    POSES = ['wave', 'wave-blink', 'talk', 'celebrate', 'sleep', 'collar', 'health', 'food', 'clipboard', 'walk']
    SRC = Path('specs/mobile-orbit-cachorro-art/design-src')
    DST = Path(sys.argv[1] if len(sys.argv) > 1 else 'mobile-pet-tracker/assets/images')·
    def clean(v):  # alfa < 16 es residuo fuera del contorno; alfa >= 252 es cuerpo opaco
        return 0 if v < 16 else 255 if v >= 252 else v·
    for pose in POSES:
        im = Image.open(SRC / f'orbit-{pose}.png')
        assert im.mode == 'RGBA' and im.size == (1024, 1024), (pose, im.mode, im.size)
        r, g, b, a = im.split()
        Image.merge('RGBA', (r, g, b, a.point(clean))).save(DST / f'orbit-{pose}.webp', 'WEBP', quality=82, method=6)·
    print('pose bytes sha256 bbox(l,t,r,b margins) minAlpha>0')
    bad = 0
    for pose in POSES:
        path = DST / f'orbit-{pose}.webp'
        data = path.read_bytes()
        a = Image.open(path).convert('RGBA').getchannel('A')
        hist = a.histogram()
        box = a.getbbox()
        margins = (box[0], box[1], 1024 - box[2], 1024 - box[3])
        min_alpha = next(i for i in range(1, 256) if hist[i])
        ok = len(data) <= 100000 and data[:4] == b'RIFF' and data[8:16] == b'WEBPVP8X' and min_alpha >= 16 and min(margins) >= 24
        bad += not ok
        print(pose, len(data), hashlib.sha256(data).hexdigest(), margins, min_alpha, 'ok' if ok else 'FALLA')
    sys.exit(1 if bad else 0)
    "

      94 |   const script = fs.readFileSync(path, 'utf8');
      95 |   expect(script).toContain('pillow==13.0.0');
    > 96 |   expect(script).toContain('quality=80, method=6');
         |                  ^
      97 |   expect(script).toContain('def clean(');
      98 | });
      99 |

      at Object.toContain (src/__tests__/orbit-cachorro-art.test.ts:96:18)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 34 skipped, 35 total
exit=1

M7 revertida: git status --short -- mobile-pet-tracker/ specs/ docs/ => vacío; git diff --cached => vacío

## M8 — sleep desde el PNG original sin reescalar: R1 verde, R2 rojo

M8 antes: git status --short -- mobile-pet-tracker/ specs/ docs/ => vacío; git diff --cached => vacío
$ uvx --with pillow==13.0.0 python -I specs/mobile-orbit-cachorro-art/convert-orbit.py (mutante M8, solo sleep)
pose bytes sha256 bbox(l,t,r,b margins) minAlpha>0
sleep 32570 7dc5ee5f8e6a55b63d03bb3a633ff9e541f4c7c3fad46ba8e8d799a7c2170f7c (29, 222, 35, 224) 16 ok
exit=0

$ bunx jest --runTestsByPath src/__tests__/orbit-cachorro-art.test.ts --testTimeout=30000 -t '#243 R[12]'
FAIL src/__tests__/orbit-cachorro-art.test.ts
  ✕ #243 R2: cada pose tiene el sha256 del arte nuevo (sleep) (4 ms)

  ● #243 R2: cada pose tiene el sha256 del arte nuevo (sleep)

    expect(received).toBe(expected) // Object.is equality

    Expected: "29c241fdfaf29f91b0468b6c4332e59ccabec3f9bf6f475d92dac4045669790e"
    Received: "7dc5ee5f8e6a55b63d03bb3a633ff9e541f4c7c3fad46ba8e8d799a7c2170f7c"

      68 | it.each(POSES)('#243 R2: cada pose tiene el sha256 del arte nuevo (%s)', pose => {
      69 |   const bytes = fs.readFileSync(join(imagesRoot, `orbit-${pose}.webp`));
    > 70 |   expect(createHash('sha256').update(bytes).digest('hex')).toBe(NEW_SHA[pose]);
         |                                                            ^
      71 | });
      72 |
      73 | it('#243 R2: ningún fichero de assets/images conserva el arte viejo', () => {

      at toBe (src/__tests__/orbit-cachorro-art.test.ts:70:60)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 13 skipped, 21 passed, 35 total
exit=1

M8 revertida: git status --short -- mobile-pet-tracker/ specs/ docs/ => vacío; git diff --cached => vacío

## M9 — arte viejo bajo otro nombre

M9 antes: git status --short -- mobile-pet-tracker/ specs/ docs/ => vacío; git diff --cached => vacío
$ bunx jest --runTestsByPath src/__tests__/orbit-cachorro-art.test.ts --testTimeout=30000 -t '#243 R[12]'
FAIL src/__tests__/orbit-cachorro-art.test.ts
  ✕ #243 R1: las diez poses orbit-*.webp son las únicas y son WebP válidos (7 ms)
  ✕ #243 R2: ningún fichero de assets/images conserva el arte viejo (6 ms)

  ● #243 R1: las diez poses orbit-*.webp son las únicas y son WebP válidos

    expect(received).toEqual(expected) // deep equality

    - Expected  - 0
    + Received  + 1

    @@ -2,10 +2,11 @@
        "orbit-celebrate.webp",
        "orbit-clipboard.webp",
        "orbit-collar.webp",
        "orbit-food.webp",
        "orbit-health.webp",
    +   "orbit-old.webp",
        "orbit-sleep.webp",
        "orbit-talk.webp",
        "orbit-walk.webp",
        "orbit-wave-blink.webp",
        "orbit-wave.webp",

      47 | it('#243 R1: las diez poses orbit-*.webp son las únicas y son WebP válidos', () => {
      48 |   expect(fs.readdirSync(imagesRoot).filter(name => /^orbit-.*\.webp$/.test(name)).sort())
    > 49 |     .toEqual(POSES.map(pose => `orbit-${pose}.webp`).sort());
         |      ^
      50 | });
      51 |
      52 | it.each(POSES)('#243 R1: las diez poses orbit-*.webp son las únicas y son WebP válidos (%s)', pose => {

      at Object.toEqual (src/__tests__/orbit-cachorro-art.test.ts:49:6)

  ● #243 R2: ningún fichero de assets/images conserva el arte viejo

    expect(received).not.toContain(expected) // indexOf

    Expected value: not "af16821827af1d6ff432fd124e22d9c2121ce67c97c3c9d1335d4cda1ad275fb"
    Received array:     ["66cd45cb7565be2d4364e705763710109b13a1ad1809a3711c23217026f5f306", "a6a44b702e395517f1d7875600cc106455a9972fab14bf871e3c5f4c155b8549", "af16821827af1d6ff432fd124e22d9c2121ce67c97c3c9d1335d4cda1ad275fb", "12c52706e7b5cc7124a0974e04834e5e5c6c96a0549bcaacbbef10766cac9687", "b8e9745f73dedc6d72f89a588046a7440f32df4b2e9685e70fa96a2b70e3a254", "e7fba39ad9c9d24c3520c82c26b2dc3055103f329b13a60715e15f6acba6938b", "298e8a956c853a00b737ab05a0ba3497912cf7bf8f29f86d25bb515031d085b1", "bc02bf6f4b67ba2834847b5c9dac919b66df227e918502238e2e9fe5884f3ccc", "da68c5bbbe82b2bcb448f6a12d7da77774adc261e75d356c747c0a9614fb483f", "363e1f6502912709570d7448abf5a80f7ac42258957309a04f5733bf513eda28"]

      76 |     if (!fs.statSync(path).isFile()) continue;
      77 |     const hash = createHash('sha256').update(fs.readFileSync(path)).digest('hex');
    > 78 |     expect(Object.values(OLD_SHA)).not.toContain(hash);
         |                                        ^
      79 |   }
      80 | });
      81 |

      at Object.toContain (src/__tests__/orbit-cachorro-art.test.ts:78:40)

Test Suites: 1 failed, 1 total
Tests:       2 failed, 13 skipped, 20 passed, 35 total
exit=1

M9 revertida: git status --short -- mobile-pet-tracker/ specs/ docs/ => vacío; git diff --cached => vacío

## M10 — duplicar la sección Enmienda #243

M10 antes: git status --short -- mobile-pet-tracker/ specs/ docs/ => vacío; git diff --cached => vacío
$ bunx jest --runTestsByPath src/__tests__/orbit-cachorro-art.test.ts --testTimeout=30000 -t '#243 R6'
FAIL src/__tests__/orbit-cachorro-art.test.ts
  ✕ #243 R6: la carta lleva la Enmienda #243 una sola vez, con la descripción nueva (7 ms)

  ● #243 R6: la carta lleva la Enmienda #243 una sola vez, con la descripción nueva

    expect(received).toBe(expected) // Object.is equality

    Expected: 1
    Received: 2

      101 |   const charter = fs.readFileSync(charterPath, 'utf8');
      102 |   const heading = '## Enmienda #243 — ';
    > 103 |   expect(charter.split(heading).length - 1).toBe(1);
          |                                             ^
      104 |   const following = charter.split(heading)[1];
      105 |   const body = following.split('\n## ')[0];
      106 |   for (const literal of ['cachorro', 'parche morado', '#178255', 'antena', 'Pingo', 'diez poses']) {

      at Object.toBe (src/__tests__/orbit-cachorro-art.test.ts:103:45)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 34 skipped, 35 total
exit=1

M10 revertida: git status --short -- mobile-pet-tracker/ specs/ docs/ => vacío; git diff --cached => vacío

## M11 — quitar Pingo solo del cuerpo de Enmienda #243

M11 antes: git status --short -- mobile-pet-tracker/ specs/ docs/ => vacío; git diff --cached => vacío
$ bunx jest --runTestsByPath src/__tests__/orbit-cachorro-art.test.ts --testTimeout=30000 -t '#243 R6'
FAIL src/__tests__/orbit-cachorro-art.test.ts
  ✕ #243 R6: la carta lleva la Enmienda #243 una sola vez, con la descripción nueva (4 ms)

  ● #243 R6: la carta lleva la Enmienda #243 una sola vez, con la descripción nueva

    expect(received).toContain(expected) // indexOf

    Expected substring: "Pingo"
    Received string:    "Orbit es un cachorro·
    Fecha: 2026-11-06. Feature #243 `mobile-orbit-cachorro-art`. Sustituye la
    descripción gráfica de la mascota; no cambia su nombre ni su voz (punto 7).·
    1. **Aspecto.** Orbit es un cachorro crema, sentado y visto de frente, en render 3D
       de plastilina suave. Lleva un parche morado sobre un ojo, orejas y cola gris
       oscuro, nariz negra, lengua rosa y un collar morado con una placa GPS cuya luz es
       el verde de marca `#178255`. No lleva antena, manos ni botón en el pecho.
    2. **Las diez poses.** `orbit-wave`, `orbit-wave-blink`, `orbit-talk`, `orbit-walk`,
       `orbit-celebrate`, `orbit-sleep`, `orbit-collar`, `orbit-health`, `orbit-food` y
       `orbit-clipboard` (`.webp`, 1024 × 1024 con alfa, como mucho 100000 bytes)
       conservan nombre, tamaño en pantalla y copy. Una pose nueva entra con su propia
       feature.
    3. **Historia.** Hasta la feature #243 Orbit era un robot-perro bípedo con antena,
       gorro verde y cara morada, y antes de #225 se llamaba «Orbit». Las enmiendas
       fechadas anteriores conservan «Orbit» y ese aspecto como historia; no se
       reescriben.
    4. **Pendiente.** El icono, el splash y las notificaciones siguen con la cabeza
       anterior hasta que el humano entregue el PNG del icono (G6) y exista una feature
       para sustituirlos.·
    Detalle y tests en `specs/mobile-orbit-cachorro-art/requirements.md` (R1 a R7).·
    - [ ] Enmienda #243 aprobada por humano
    "

      105 |   const body = following.split('\n## ')[0];
      106 |   for (const literal of ['cachorro', 'parche morado', '#178255', 'antena', 'Pingo', 'diez poses']) {
    > 107 |     expect(body).toContain(literal);
          |                  ^
      108 |   }
      109 |   expect(body).toMatch(/- \[[ xX]\] Enmienda #243 aprobada por humano/);
      110 |   const followingHeadings = following.match(/^## .+$/gm) ?? [];

      at Object.toContain (src/__tests__/orbit-cachorro-art.test.ts:107:18)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 34 skipped, 35 total
exit=1

M11 revertida: git status --short -- mobile-pet-tracker/ specs/ docs/ => vacío; git diff --cached => vacío

## M12 — añadir encabezado Notas después de la enmienda

M12 antes: git status --short -- mobile-pet-tracker/ specs/ docs/ => vacío; git diff --cached => vacío
$ bunx jest --runTestsByPath src/__tests__/orbit-cachorro-art.test.ts --testTimeout=30000 -t '#243 R6'
FAIL src/__tests__/orbit-cachorro-art.test.ts
  ✕ #243 R6: la carta lleva la Enmienda #243 una sola vez, con la descripción nueva (5 ms)

  ● #243 R6: la carta lleva la Enmienda #243 una sola vez, con la descripción nueva

    expect(received).toMatch(expected)

    Expected pattern: /^## Enmienda #/
    Received string:  "## Notas"

      109 |   expect(body).toMatch(/- \[[ xX]\] Enmienda #243 aprobada por humano/);
      110 |   const followingHeadings = following.match(/^## .+$/gm) ?? [];
    > 111 |   followingHeadings.forEach(followingHeading => expect(followingHeading).toMatch(/^## Enmienda #/));
          |                                                                          ^
      112 | });
      113 |

      at toMatch (src/__tests__/orbit-cachorro-art.test.ts:111:74)
          at Array.forEach (<anonymous>)
      at Object.forEach (src/__tests__/orbit-cachorro-art.test.ts:111:21)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 34 skipped, 35 total
exit=1

M12 revertida: git status --short -- mobile-pet-tracker/ specs/ docs/ => vacío; git diff --cached => vacío

## M13 — icono alterado en un commit hijo temporal, sin commit de mutación en la rama

M13 antes: git status --short -- mobile-pet-tracker/ specs/ docs/ => vacío; git diff --cached => vacío
M13 revertida: git status --short -- mobile-pet-tracker/ specs/ docs/ => vacío; git diff --cached => vacío
M13 primera invocación: ENOENT al leer assets/icon.png, antes de tocar ficheros o crear objetos de git. La ruta real, fijada por app.json y app.assets.test.ts, es assets/images/icon.png. Error de invocación corregido según el handoff.
M13 reintento antes: git status --short -- mobile-pet-tracker/ specs/ docs/ => vacío; git diff --cached => vacío
Commit hijo temporal e33f2ab1de17bddecb7951ecd93a0cfaea985141, parent 5fa2e0b729db59935959a97b9d755376b988add5; índice temporal, sin refs y sin mover HEAD. Icono mutado en ese árbol, sin escribir el icono del worktree.
Guarda: git diff --name-only 647a3056500ef67cd00eeb2a31b810d4e214b01b..e33f2ab1de17bddecb7951ecd93a0cfaea985141 -- mobile-pet-tracker/assets, comparada con las diez rutas literales.
mobile-pet-tracker/assets/images/icon.png
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
Traceback (most recent call last):
  File "<string>", line 4, in <module>
AssertionError: ('R7: rutas extra', ['mobile-pet-tracker/assets/images/icon.png'])
exit=1

M13 revertida: git status --short -- mobile-pet-tracker/ specs/ docs/ => vacío; git diff --cached => vacío

## E1-remove — entrada de exceptions de C6

E1-remove antes: git status --short -- mobile-pet-tracker/ specs/ docs/ => vacío; git diff --cached => vacío
$ bunx jest --runTestsByPath src/__tests__/orbit-rename.test.ts --testTimeout=30000 -t '#225 R4'
FAIL src/__tests__/orbit-rename.test.ts
  ✕ #225 R4: el código de test solo nombra a Pingo en títulos, comentarios y pins de documento (137 ms)

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

Test Suites: 1 failed, 1 total
Tests:       1 failed, 5 skipped, 1 passed, 7 total
exit=1

E1-remove revertida: git status --short -- mobile-pet-tracker/ specs/ docs/ => vacío; git diff --cached => vacío

## E1-lines2 — entrada de exceptions de C6

E1-lines2 antes: git status --short -- mobile-pet-tracker/ specs/ docs/ => vacío; git diff --cached => vacío
$ bunx jest --runTestsByPath src/__tests__/orbit-rename.test.ts --testTimeout=30000 -t '#225 R4'
FAIL src/__tests__/orbit-rename.test.ts
  ✕ #225 R4: cada excepción casa exactamente las líneas declaradas (enmendado por #225 R9) (10 ms)

  ● #225 R4: cada excepción casa exactamente las líneas declaradas (enmendado por #225 R9)

    expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 3

    - Array []
    + Array [
    +   "__tests__/orbit-cachorro-art.test.ts: 'antena', 'Pingo', 'diez poses' declara 2, casa 1",
    + ]

      166 |       : 0;
      167 |     return matched === lines ? [] : [`${file}: ${snippet} declara ${lines}, casa ${matched}`];
    > 168 |   })).toEqual([]);
          |       ^
      169 | });
      170 |

      at Object.toEqual (src/__tests__/orbit-rename.test.ts:168:7)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 5 skipped, 1 passed, 7 total
exit=1

E1-lines2 revertida: git status --short -- mobile-pet-tracker/ specs/ docs/ => vacío; git diff --cached => vacío

Resultado: M1–M13 y las dos sondas de Enmienda 1 detectadas y revertidas; ninguna mutación entra en la rama.
```

### Verde después de restaurar las quince sondas

`bunx jest --runTestsByPath src/__tests__/orbit-cachorro-art.test.ts src/__tests__/orbit-rename.test.ts src/__tests__/home-photo-hero-canvas.test.ts --testTimeout=30000`:

```text
PASS src/__tests__/home-photo-hero-canvas.test.ts
PASS src/__tests__/orbit-cachorro-art.test.ts
PASS src/__tests__/orbit-rename.test.ts
Test Suites: 3 passed, 3 total
Tests:       70 passed, 70 total
Snapshots:   0 total
Time:        2.331 s
Ran all test suites within paths "src/__tests__/orbit-cachorro-art.test.ts", "src/__tests__/orbit-rename.test.ts", "src/__tests__/home-photo-hero-canvas.test.ts".
exit=0
```

El nuevo test aporta 35 casos; el resto del verde retomado aporta 143 + 274 + 32 + 28. Total de suites distintas del handoff: 13; tests: 512. C6 y la restauración ejecutan además los casos relevantes otra vez, sin sumarlos al total distinto.

### Guardas finales tras C6 y las mutaciones

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
mobile-pet-tracker/src/__tests__/orbit-rename.test.ts
```

`git diff --name-only 647a3056500ef67cd00eeb2a31b810d4e214b01b..HEAD -- . ':!mobile-pet-tracker' ':!specs' ':!progress' ':!docs/ui-guidelines.md'`

```text

```

`git diff --name-only 647a3056500ef67cd00eeb2a31b810d4e214b01b..HEAD -- mobile-pet-tracker/package.json mobile-pet-tracker/bun.lock`

```text

```

Diff exacto del único fichero de C6:

```diff
diff --git a/mobile-pet-tracker/src/__tests__/orbit-rename.test.ts b/mobile-pet-tracker/src/__tests__/orbit-rename.test.ts
index d179956b..3cc06161 100644
--- a/mobile-pet-tracker/src/__tests__/orbit-rename.test.ts
+++ b/mobile-pet-tracker/src/__tests__/orbit-rename.test.ts
@@ -137,6 +137,7 @@ const exceptions = [
   { file: '__tests__/orbit-charter-voice.test.ts', snippet: '**Orbit** (antes Pingo).', lines: 1 },
   { file: '__tests__/orbit-charter-voice.test.ts', snippet: 'conservan «Pingo»', lines: 1 },
   { file: '__tests__/orbit-charter-voice.test.ts', snippet: String.raw`/\bPingo\b/`, lines: 1 },
+  { file: '__tests__/orbit-cachorro-art.test.ts', snippet: "'antena', 'Pingo', 'diez poses'", lines: 1 },
 ];

 const scannedTestFiles = () => testFiles()
```

Hashes de producción después de las sondas (coinciden otra vez con §Constantes):

```text
wave 42274 329e54a136e9d96a3567e39cc5aa128566723815a5b7cbdc86251d299ee66cec
wave-blink 40048 573277aa19494e1645a6738195518743be97e3eb9b947d219f71e6b588cf6a35
talk 40484 b0e292c12012c2d9468146d5ca8a436b3ea5017ab09db908756d50f950136014
walk 38914 391db95f89c993be39263e8d81ddc8d899c2841aecf3436a4fb75895a7faba41
celebrate 45710 dc04b17c2141975dc7f94f891fceee027d35ea641752b911430e7e2a7899f2f7
sleep 25882 29c241fdfaf29f91b0468b6c4332e59ccabec3f9bf6f475d92dac4045669790e
collar 39430 e398800a813d36d2d2fc401dd298df41f72f856c253126ed98ff47b1fda8edc9
health 43316 77dcf90cbcada5d500692b4fd1e3bd2507fcd52971584c7fa14035de507c84d8
food 42862 c7737dfe65188b16fb42f2e70ce59bfd6aec655d5c7cb3818c675d9ab5d93b13
clipboard 41948 e2c3dec28c20ae6f45ae8fa488ba432f2da1c3d4d4f8a72645e6f9696d7e27f9
```

El conversor vuelve a coincidir byte a byte con design.md §2. No se cambiaron fuentes, arte esperado, tablas, aprobaciones, estado de feature ni otros ficheros de arnés. Sin nuevos fallos de suites existentes, timeouts, denegaciones ni problemas de red.
Cierre de fix1: C6 y este reporte/trazabilidad van en commits separados; sin push, PR, merge ni rebase. El marcador viejo se elimina y se regenera al terminar con la misma ruta absoluta del reporte. Se mantiene G2 para el humano y ./init.sh/reviewer para el leader.
