# Implementación mobile-orbit-rename-copy — R1 a R3

Fecha de reanudación: 2026-10-28. Estado: R1–R3 completados; cadena C1–C4 verificada; R4 pendiente del humano.

## Entorno, autorización y alcance

Handoff leído entero. H0: `2b0f24fd6ee2b091afb274ee6b1ce7b7d444d43c`.
HEAD inicial: `74209d62` (handoff del leader). Primer comando de esta reanudación:

```sh
cd /home/claude/sites/Pet-Tracker-wt-221 && pwd && git branch --show-current
```

Salida exacta:

```text
/home/claude/sites/Pet-Tracker-wt-221
feature/221-mobile-orbit-rename-copy
```

La sesión anterior paró en T0: 172 suites y bienvenida aislada fallaban en el
setup sin ejecutar tests, porque Jest no resolvía `expo-clipboard`. El leader
resolvió la dependencia con `bun install --frozen-lockfile` y autorizó retomar
el 2026-10-28. Esta sesión no instala ni regenera dependencias.

No se ejecuta `./init.sh`; lo corre el leader. Sin fetch, merge, rebase, push,
PR, EAS ni AWS. R4 y las casillas de firma y smoke quedan para el humano (G4).
Los tres ficheros ajenos de preparación R4 se conservan sin añadir ni aplicar.

Skills cargadas en esta tarea: `ponytail:ponytail` y `building-native-ui`
(plugin Expo instalado en `openai-curated/expo/11c74d6b`). Ninguna solicitada
no encontrada. No se buscaron los nombres inexistentes prohibidos por el
handoff. La carta prevalece sobre la guía genérica. Leídas arquitectura,
convenciones (incluidas esperas), carta, verificación, spec y errata E1.
También se leyó https://docs.expo.dev/versions/v57.0.0/ por el AGENTS móvil.

## Anclas T0


Medidas en la sesión anterior, sin repetir por autorización expresa del usuario.
Ejecutadas literalmente desde `mobile-pet-tracker/`, antes del primer test.
`grep -c` cuenta líneas. Todas coinciden.

| Comando | Salida |
|---|---|
| `grep -cF "Pingo" src/i18n/catalog.ts` | `2` |
| `grep -cF "Orbit" src/i18n/catalog.ts` | `0` |
| `grep -cF "'welcome.pingoGreeting'" src/i18n/catalog.ts` | `2` |
| `grep -cF "welcome.pingoGreeting" src/__tests__/ui-copy-table.ts` | `1` |
| `grep -cF "welcome.pingoGreeting" src/screens/welcome/index.tsx` | `1` |
| `grep -rIil "orbit" src app.json app.config.ts package.json assets \| wc -l` | `0` |
| `ls assets/images \| grep -c '^pingo-'` | `9` |
| `grep -cF "Hola, soy Pingo." src/screens/welcome/index.test.tsx` | `5` |
| `grep -cF "Hola, soy Orbit." src/screens/welcome/index.test.tsx` | `0` |
| `grep -cF "Hi, I\\'m Pingo." src/screens/welcome/index.test.tsx` | `4` |
| `grep -cF "Hi, I\\'m Orbit." src/screens/welcome/index.test.tsx` | `0` |
| `ls src/__tests__ \| grep -c '^orbit'` | `0` |
| `grep -rnw "Pingo" src --include='*.ts' --include='*.tsx' --exclude-dir=__tests__ --exclude='*.test.*' \| wc -l` | `2` |
| `test ! -e .expo/types/router.d.ts && echo sin-router-d-ts` | `sin-router-d-ts` |
| `git diff origin/dev --stat -- ../backend-pet-tracker package.json bun.lock \| wc -l` | `0` |

## Base de tests T0

Ambos `pgrep` vacíos antes del arranque. Ejecución completa sin pipe, log
`progress/t0-221-codex.log`:

```text
exit=1
Test Suites: 3 failed, 169 passed, 172 total
Tests:       4 failed, 6342 passed, 6346 total
Snapshots:   1 passed, 1 total
Time:        428.331 s
```

N = **6346** (todos los tests contabilizados; no hubo SIGKILL). Los tres reruns
aislados pasan y permiten continuar por la excepción de flakes del handoff.
Fallos medidos en suites no tocadas:

- `src/screens/docs/index.test.tsx`: `#158 R10: cualquier miembro abre un documento › abre la URL de descarga para family`, timeout 5000 ms; y `abre la URL de descarga para walker`, mock llamado 2 veces en vez de 1 tras el timeout anterior.
- `src/screens/home/index.test.tsx`: `#195 R11: selector de vidrio y botón de añadir mascota › pinta el selector glass y el punto solo con conexión null`, timeout 5000 ms.
- `src/screens/register/index.test.tsx`: `#167 R7: Pingo en la cabecera del registro › #172 R3: la cabecera lleva la fila Volver-Pingo y después el título (enmendado por #205 R9)`, timeout 5000 ms.

No se modifican esas suites. Antes de cada rerun se verificaron ambos `pgrep`
vacíos. Reruns aislados con `TZ=UTC bunx jest --runTestsByPath <ruta> --testTimeout=30000`:

| Log | Exit | Test Suites: | Tests: |
|---|---|---|---|
| `t0-docs-221.log` | 0 | 1 passed, 1 total | 110 passed, 110 total |
| `t0-home-221.log` | 0 | 1 passed, 1 total | 331 passed, 331 total |
| `t0-register-221.log` | 0 | 1 passed, 1 total | 75 passed, 75 total |

La primera corrida completa no fue verde; la base se acepta solo por los reruns
verdes permitidos expresamente, sin enmendar código ni aserciones. Bienvenida
(base aislada, `t0-welcome-221.log`):

```text
exit=0
Test Suites: 1 passed, 1 total
Tests:       87 passed, 87 total
```

## C1 — test rojo antes de producción

Solo se enmiendan las siete líneas de `expect` previstas, conservando títulos,
`await` y comentarios anteriores; se añade `// #221 R1` a los dos comentarios
`// #205 R5`. Test nuevo con tres `it` (R1 y dos de R2); aún sin R3.

Durante el borrador de C1, el test de valores de R2 omitía las cadenas entre
comillas dobles. El conjunto seguía siendo los siete `it` previstos, pero ese
`it` fallaba por cobertura incompleta del parser. Se corrigió el parser en el
mismo test antes de commitear y se repitió la medición para exigir rojo por
los valores Pingo. Ningún fichero de producción cambió por esa corrección.

Validación definitiva de C1 (`progress/c1-221.log`):

```text
exit=1
Test Suites: 2 failed, 2 total
Tests:       7 failed, 83 passed, 90 total
```

Base aislada anterior 87 + 3 añadidos = 90. Total global previsto:
N 6346 + 3 añadidos = 6349; no se ejecuta full-suite en C1, como pide el handoff.
Los siete rojos medidos coinciden exactamente con la ventana; todos son
aserciones del catálogo o del texto renderizado que aún dice Pingo, sin ENOENT:

| Fichero | `it` rojo |
|---|---|
| `src/__tests__/orbit-rename-copy.test.ts` | `#221 R1: el catálogo dice Orbit` |
| `src/__tests__/orbit-rename-copy.test.ts` | `#221 R2: ninguna cadena visible nombra a Pingo` |
| `src/__tests__/orbit-rename-copy.test.ts` | `#221 R2: ninguna cadena visible nombra a Pingo en los valores del catálogo` |
| `src/screens/welcome/index.test.tsx` | `#153 R1: el saludo de Pingo existe en los dos idiomas › declara el saludo en inglés y en español (enmendado por #205 R5)` |
| `src/screens/welcome/index.test.tsx` | `#153 R1: el saludo de Pingo existe en los dos idiomas › pinta el saludo en el bocadillo en español (enmendado por #205 R5)` |
| `src/screens/welcome/index.test.tsx` | `#153 R1: el saludo de Pingo existe en los dos idiomas › pinta el saludo en el bocadillo en inglés (enmendado por #205 R5)` |
| `src/screens/welcome/index.test.tsx` | `#205 R5: saludo de Main › #205 R5: el saludo dice «Hola, soy Pingo.» y «Hi, I'm Pingo.»` |

`test ! -e .expo/types/router.d.ts` pasa; `bun run typecheck` exit 0,
`progress/typecheck-221-c1.log`. `bunx expo lint --no-cache` exit 0 y `test ! -s ../progress/lint-221.log`
pasa (log de 0 bytes).

Commit C1: `5391be19364cbd26f48e120df3f9404497804e50`
`test(welcome): greeting says Orbit (R1, R2)`.
Acumulado de ficheros de `mobile-pet-tracker/src` desde H0: **2**.

## C2 — implementación mínima

Se cambian solo dos líneas de `src/i18n/catalog.ts`: los valores español e inglés
pasan a Orbit. La clave no cambia. Suite completa sin pipe en
`progress/full-221-c2.log`:

```text
exit=0
Test Suites: 173 passed, 173 total
Tests:       6349 passed, 6349 total
```

Total anterior 6349 + 0 añadidos = 6349 (N + 3). Los siete rojos de C1 pasan.
`test ! -e .expo/types/router.d.ts` pasa. Typecheck exit 0
(`progress/typecheck-221-c2.log`). `bunx expo lint --no-cache` exit 0 y
`test ! -s ../progress/lint-221.log` pasa (0 bytes).

Commit C2: `c435c01cb7b1654a8fd5a8551cb7f49401c8eea2`
`feat(i18n): rename greeting to Orbit (R1, R2)`.
Acumulado de rutas de `src` desde H0: **3** (inventario completo abajo).
No hay refactor necesario: el cambio mínimo son las dos líneas.

## Anclas de C2: errata resuelta

Las nueve primeras anclas coincidieron:

| Comando | Salida |
|---|---|
| `grep -cF "Pingo" src/i18n/catalog.ts` | `0` |
| `grep -cF "Orbit" src/i18n/catalog.ts` | `2` |
| `grep -cF "'welcome.pingoGreeting'" src/i18n/catalog.ts` | `2` |
| `grep -cF "Hola, soy Orbit." src/i18n/catalog.ts` | `1` |
| `grep -cF "Hola, soy Pingo." src/screens/welcome/index.test.tsx` | `1` |
| `grep -cF "Hola, soy Orbit." src/screens/welcome/index.test.tsx` | `4` |
| `grep -cF "Hi, I\\'m Pingo." src/screens/welcome/index.test.tsx` | `1` |
| `grep -cF "Hi, I\\'m Orbit." src/screens/welcome/index.test.tsx` | `3` |
| `grep -rnw "Pingo" src --include='*.ts' --include='*.tsx' --exclude-dir=__tests__ --exclude='*.test.*' \| wc -l` | `0` |


El grep original incluía también los tests requeridos por C1 y devolvía tres
rutas. Se paró según el handoff. El leader lo corrigió en E1(d), commit
`989143c8`, y autorizó continuar sin rehacer C1 ni C2. No fue un cambio de
código nuestro. El ancla corregida se ejecutó desde mobile:

```sh
grep -rIil orbit src --exclude-dir=__tests__ --exclude='*.test.*' app.json app.config.ts package.json assets
```

Salida exacta: `src/i18n/catalog.ts` (coincide).
El inventario se ejecutó desde la raíz, que corresponde al pathspec
`mobile-pet-tracker/src` escrito en el comando: exactamente tres rutas:

```text
mobile-pet-tracker/src/__tests__/orbit-rename-copy.test.ts
mobile-pet-tracker/src/i18n/catalog.ts
mobile-pet-tracker/src/screens/welcome/index.test.tsx
```

## C3 — requisito de verificación, nace verde

Commit: `8c6ab46049be07796be3377bb0de01f4955b1eab` —
`test(i18n): pingo identifiers stay unchanged (R3)`.
Solo añade el cuarto `it`: `#221 R3: los identificadores pingo-* no cambian aquí`.
Nace verde por diseño declarado en la spec: no hay feat ni refactor adicional.
Comprueba (a) claves, (b) tres anclas de welcome, (c) fila de copy-table,
(d) nueve assets y ningún Orbit, (e) recorrido de fuente con exactamente dos
Orbit solo en el catálogo. Su valor se demuestra con M3a–M3c.

`progress/full-221-c3.log`, completo y sin pipe:

```text
exit=0
Test Suites: 173 passed, 173 total
Tests:       6350 passed, 6350 total
```

Total anterior 6349 + 1 añadido = **6350 = N + 4**.
Typecheck exit 0 tras comprobar que no existe `.expo/types/router.d.ts`;
lint sin caché exit 0 y log vacío. Acumulado src desde H0: **3**.
El diff desde H0 de `ui-copy-table.ts` y `ui-language.test.ts` mide **0** líneas
antes/después de C3 y se vuelve a comprobar en el cierre.

## Ocho sondas de mutación

Antes de cada ejecución ambos `pgrep` exigidos estaban vacíos. Se usó
`TZ=UTC bunx jest --runTestsByPath ... --testTimeout=30000`, sin pipes.
M1a y M3a corrieron tanto el fichero nuevo como welcome; el resto solo el nuevo.
Cada rojo fue por aserción; no hubo ENOENT ni timeouts en las sondas.
Tras cada reversión pasaron, con exit 0, `git diff --quiet -- .`,
`git diff --cached --quiet` y el chequeo de nuevos ficheros en mobile.
No quedó ninguna mutación ni asset de sonda.

| Sonda | Mutación | Rojo observado (`it`, título completo) | Resumen medido | Reversión / árbol |
|---|---|---|---|---|
| M1a | Saludo español: punto → ! | `#221 R1: el catálogo dice Orbit`<br>`#153 R1: el saludo de Pingo existe en los dos idiomas › declara el saludo en inglés y en español (enmendado por #205 R5)`<br>`#153 R1: el saludo de Pingo existe en los dos idiomas › no exclama ni lleva emoji en ningún idioma`<br>`#153 R1: el saludo de Pingo existe en los dos idiomas › pinta el saludo en el bocadillo en español (enmendado por #205 R5)`<br>`#205 R5: saludo de Main › #205 R5: el saludo dice «Hola, soy Pingo.» y «Hi, I'm Pingo.»` | `exit=1`<br>`Test Suites: 2 failed, 2 total`<br>`Tests:       5 failed, 85 passed, 90 total` | `git checkout HEAD -- src/i18n/catalog.ts`; limpio (exit 0) |
| M1b | Apóstrofo inglés ASCII → U+2019 | `#221 R1: el catálogo dice Orbit` | `exit=1`<br>`Test Suites: 1 failed, 1 total`<br>`Tests:       1 failed, 2 passed, 3 total` | `git checkout HEAD -- src/i18n/catalog.ts`; limpio (exit 0) |
| M2a | Comentario // Pingo habla en empty-state.tsx | `#221 R2: ninguna cadena visible nombra a Pingo` | `exit=1`<br>`Test Suites: 1 failed, 1 total`<br>`Tests:       1 failed, 2 passed, 3 total` | `git checkout HEAD -- src/components/empty-state.tsx`; limpio (exit 0) |
| M2b | En es, lejos de welcome: zz.probe con valor Pingo te avisa. | `#221 R2: ninguna cadena visible nombra a Pingo`<br>`#221 R2: ninguna cadena visible nombra a Pingo en los valores del catálogo` | `exit=1`<br>`Test Suites: 1 failed, 1 total`<br>`Tests:       2 failed, 1 passed, 3 total` | `git checkout HEAD -- src/i18n/catalog.ts`; limpio (exit 0) |
| M2c | Nuevo src/hooks/zz.ts con // Pingo | `#221 R2: ninguna cadena visible nombra a Pingo` | `exit=1`<br>`Test Suites: 1 failed, 1 total`<br>`Tests:       1 failed, 2 passed, 3 total` | `rm src/hooks/zz.ts`; limpio (exit 0) |
| M3a | Una sola clave: welcome.pingoGreeting → welcome.orbitGreeting (en) | `#221 R1: el catálogo dice Orbit`<br>`#221 R3: los identificadores pingo-* no cambian aquí`<br>`R9 › muestra el copy en inglés`<br>`#153 R1: el saludo de Pingo existe en los dos idiomas › declara el saludo en inglés y en español (enmendado por #205 R5)`<br>`#153 R1: el saludo de Pingo existe en los dos idiomas › no exclama ni lleva emoji en ningún idioma`<br>`#153 R1: el saludo de Pingo existe en los dos idiomas › pinta el saludo en el bocadillo en inglés (enmendado por #205 R5)`<br>`#205 R5: saludo de Main › #205 R5: el saludo dice «Hola, soy Pingo.» y «Hi, I'm Pingo.»` | `exit=1`<br>`Test Suites: 2 failed, 2 total`<br>`Tests:       7 failed, 84 passed, 91 total` | `git checkout HEAD -- src/i18n/catalog.ts`; limpio (exit 0) |
| M3b | testID welcome-pingo-float → welcome-orbit-float | `#221 R3: los identificadores pingo-* no cambian aquí` | `exit=1`<br>`Test Suites: 1 failed, 1 total`<br>`Tests:       1 failed, 3 passed, 4 total` | `git checkout HEAD -- src/screens/welcome/index.tsx`; limpio (exit 0) |
| M3c | cp pingo-wave.webp a assets/images/orbit-wave.webp | `#221 R3: los identificadores pingo-* no cambian aquí` | `exit=1`<br>`Test Suites: 1 failed, 1 total`<br>`Tests:       1 failed, 3 passed, 4 total` | `rm assets/images/orbit-wave.webp`; limpio (exit 0) |

Logs de evidencia: `progress/probe-221-M1a.log` hasta `progress/probe-221-M3c.log`.
R2 de código señaló empty-state.tsx en M2a y hooks/zz.ts en M2c. En M2b el
parser de valores señaló zz.probe, además del rojo del barrido de código.
R3 señaló la cuenta 1 en lugar de 2 de la clave en M3a, el ancla 0 en lugar de 1
en M3b y el asset Orbit inesperado en M3c. Todos se revirtieron inmediatamente.
M4a–M4d no se ejecutan aquí: pertenecen a R4, gate G4 del humano.

## C4 — cierre documental y validaciones finales

C4 contiene solo tres ficheros: traceability, casillas de tasks entregadas y
este reporte. Referencia del commit de C4: **`HEAD` (el commit que contiene este
informe; `git rev-parse HEAD`)**. Mensaje exacto:
`docs(mobile): traceability and report for the Orbit rename (R1-R3)`.
Se usa la referencia Git para este commit porque su propio hash no puede
formar parte de su contenido. No se rebasea ni se enmienda la cadena.

Suite final completa sin pipe en `progress/final-test-221.log`:

```sh
cd /home/claude/sites/Pet-Tracker-wt-221/mobile-pet-tracker && bun run test > ../progress/final-test-221.log 2>&1; echo exit=$?
```

```text
exit=0
Test Suites: 173 passed, 173 total
Tests:       6350 passed, 6350 total
```

Total anterior 6350 + 0 añadidos = **6350 = N + 4**. Ningún rojo ni rerun
necesario en C2, C3 o cierre. El `.done` se crea como última acción después
del commit C4 y de comprobar el árbol y el inventario.

Líneas de guardas en el log final:

```text
PASS src/__tests__/orbit-rename-copy.test.ts
PASS src/screens/welcome/index.test.tsx (11.232 s)
PASS src/__tests__/ui-language.test.ts
PASS src/providers/__tests__/language-provider.test.tsx
PASS src/__tests__/design-drift.test.ts
PASS src/__tests__/consistency-classnames.test.ts
PASS src/__tests__/legibility-classnames.test.ts
PASS src/__tests__/heroui-text-size-merge.test.ts
PASS src/__tests__/jest-virtual-mock-lock.test.ts
PASS src/__tests__/account-flow-canvas-fidelity.test.ts
```

Los candados de fidelidad de bienvenida están en welcome/index.test.tsx
(grupos #205) y account-flow-canvas-fidelity.test.ts; no existe una suite
separada llamada welcome-canvas-fidelity.test.ts.

| Gate | Resultado / evidencia |
|---|---|
| Typecheck C1 | exit 0, router ausente; `progress/typecheck-221-c1.log` |
| Typecheck C2 | exit 0, router ausente; `progress/typecheck-221-c2.log` |
| Typecheck C3 | exit 0, router ausente; `progress/typecheck-221-c3.log` |
| Typecheck cierre | exit 0, router ausente; `progress/typecheck-221-final.log` |
| Lint C1, C2, C3 y cierre | exit 0 cada vez, `bunx expo lint --no-cache`, `test ! -s ../progress/lint-221.log`; log 0 bytes |
| Graphify | `graphify update .`, exit 0, modo AST sin LLM; `progress/graphify-221.log` |

Graphify actualizó `graphify-out` ignorado: 32185 nodos, 41470 aristas,
2078 comunidades. Aviso del entorno: omitió 23 .sql porque falta
`tree_sitter_sql`; no se instaló ninguna dependencia ni se modificó código.

### Trazabilidad R1–R3

| Requisito | Tests | Commit de test | Commit de producción |
|---|---|---|---|
| R1 | `orbit-rename-copy.test.ts::#221 R1: el catálogo dice Orbit`; 4 `it` enmendados de welcome (enumerados arriba) | `5391be19364cbd26f48e120df3f9404497804e50`, `test(welcome): greeting says Orbit (R1, R2)` | `c435c01cb7b1654a8fd5a8551cb7f49401c8eea2`, `feat(i18n): rename greeting to Orbit (R1, R2)` |
| R2 | `orbit-rename-copy.test.ts::#221 R2: ninguna cadena visible nombra a Pingo` y `#221 R2: ninguna cadena visible nombra a Pingo en los valores del catálogo` | `5391be19364cbd26f48e120df3f9404497804e50`, mismo commit de test | `c435c01cb7b1654a8fd5a8551cb7f49401c8eea2`, mismo feat, sin producción adicional |
| R3 | `orbit-rename-copy.test.ts::#221 R3: los identificadores pingo-* no cambian aquí` | `8c6ab46049be07796be3377bb0de01f4955b1eab`, `test(i18n): pingo identifiers stay unchanged (R3)` | Nace verde, sin feat; M3a–M3c verificadas y revertidas |

R4 conserva `pendiente (G4, humano)`. La feature no se marca done aquí.
El marcador `.done` de este handoff solo señalará que la implementación R1–R3
y su cadena C1–C4 están listas, tras commit y chequeos finales.

## Inventario y límites

Inventario final de la cadena: ocho rutas, verificado en el índice antes de C4
y comprobado de nuevo tras el commit:

```text
mobile-pet-tracker/src/__tests__/orbit-rename-copy.test.ts
mobile-pet-tracker/src/i18n/catalog.ts
mobile-pet-tracker/src/screens/welcome/index.test.tsx
progress/handoff_mobile-orbit-rename-copy.md
progress/impl_mobile-orbit-rename-copy.md
specs/mobile-orbit-rename-copy/requirements.md
specs/mobile-orbit-rename-copy/tasks.md
specs/mobile-orbit-rename-copy/traceability.md
```

Seis rutas propias autorizadas. Dos rutas ajenas aceptadas expresamente:
el handoff previo del leader (`74209d62`) y requirements por su E1(d)
(`989143c8`). No se atribuyen a esta implementación. Los tres ficheros sin
trackear de preparación R4 siguen intactos y fuera de todos los commits.
Salida vacía desde mobile:

```sh
git diff origin/dev --stat -- ../backend-pet-tracker package.json bun.lock
```

Producción: exactamente dos líneas del catálogo. Welcome test: exactamente
las siete líneas de expect, títulos y await intactos. Assets, componentes,
theme, app, configuración, carta y backend sin delta de implementación.
Las claves, testIDs y nombres pingo-* no se renombraron; quedan para #225.
Sin push, PR, init.sh, EAS ni recursos AWS. El status de feature_list y las
casillas humanas permanecen fuera de nuestro alcance.

## Incidencias cerradas y pendiente humano

- Bloqueo inicial de T0: el leader instaló expo-clipboard; no se reinstaló aquí.
- T0 con cuatro rojos bajo carga: tres suites pasaron aisladas y se continuó
  por la excepción del handoff, sin modificar esos tests. C2, C3 y suite final completos verdes.
- Borrador del parser de C1: se corrigió antes del commit para cubrir valores
  entre comillas dobles; el rojo definitivo fue por Pingo.
- Ancla tras C2: parada y errata E1(d) del leader; ancla corregida verificada.
- En la primera sesión se leyó el handoff antes del comando de identificación
  y se intentó leer un jest.config.js inexistente; se localizó la configuración
  en package.json. Las reanudaciones empezaron con el comando exacto.

Pendiente del humano: R4 (carta y tests, G4) y smoke Android de bienvenida:
«Hola, soy Orbit.» en español, «Hi, I'm Orbit.» en inglés, sin texto cortado.


### Chequeos de alcance de cierre

Diff por requisito R3 desde H0 de ui-copy-table.ts y ui-language.test.ts:
0 líneas. Diff desde origin/dev de backend, package.json y bun.lock:
salida vacía. Numstat de src desde H0: catálogo 2 inserciones/2 borrados,
welcome test 7/7, test nuevo 77/0. Sin otras rutas de código.
El índice y el árbol acotado quedan limpios después de C4; solo permanecen
los tres ficheros ajenos sin trackear de R4. `.done` está ignorado y no se commitea.

Corrección de generación del reporte: se buscó inicialmente una línea PASS
con el nombre de fichero welcome-canvas-fidelity, pero ese no es un nombre
de suite del árbol. Se localizaron los candados en sus ficheros reales y se
corrigió solo el generador del reporte. No falló ningún test ni se tocó código.
