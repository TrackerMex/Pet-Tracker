# Implementación #188 — requisitos implementados; reviewer RECHAZADO sobre `1ec2046d`

Fecha: 2026-10-19 UTC. H0: `6dc51ca1`; HEAD al reanudar: `3082ff68`; typecheck verde desde la excepción 5 (`c0e2c93a`). R13 y R1–R14 tienen cobertura verde focalizada. La feature no se declara done: el veredicto está en `progress/review_188.md` y los hallazgos C4 esperan decisión humana. Los reportes anteriores se conservan en git.

## Primer comando y alcance

Primer comando ejecutado, antes de cualquier otra operación:

```bash
cd /home/claude/sites/Pet-Tracker-wt-188 && pwd && git branch --show-current
```

Salida confirmada:

```text
/home/claude/sites/Pet-Tracker-wt-188
feature/188-mobile-pairing-pingo-canvas-fidelity
```

Se siguieron Reanudación y Excepción 4 del handoff: no se rehacen R13 ni R1–R7 funcionales. Se aplica exclusivamente la cabecera autorizada, se verifica R7 con las tres suites, y se continúa R8, R9, R10, R11, R12, R14 y Cierre. Spec aprobada en `16d27c18`, carta firmada en H0 y E1 de R3 firmada en `1cc2a08f`; D1–D7 cerradas. Leídos requirements, design, tasks, progress/current y entrada #188 de feature_list, arquitectura, convenciones, carta de UI y verificación.

No se ejecutó init.sh, no se abrió/editó PR, no hubo push ni cambios de dependencias, .env o node_modules. Se preservan sin tocar ni commitear los cambios del leader en progress/current.md y progress/handoff_mobile-pairing-pingo-canvas-fidelity.md. El estado de la feature, STATUS y los ficheros de cierre del leader no se modifican.

## Base y recuento

T0 heredado y medido en H0: 120 suites; `Tests: 3994 passed, 3994 total`, cero skipped. No se interpreta el HEAD ya implementado como T0 ni se repiten las anclas sobre código cambiado. Anclas heredadas: padding:24 = 1, text-2xl = 2, --text-24 = 0, asset collar existente; ascendencia de cbd964da confirmada en la ejecución inicial.

Total esperado para el Cierre: 3994 + 32 casos propios nuevos + 1 caso autorizado de la excepción 2 = **4027**. Desglose de casos propios: R13=2; R1=1; R2=1; R3=1; R4=1; R5=1; R6=2; R7=1; R8=2; R9=10; R10=2; R11=1; R12=2; R14=5. Pairing pasa de 61 a 88 casos, PingRing aporta dos y la suite nueva aporta tres. La excepción 2 desdobla un caso de it.each de design-drift en dos. No se atribuye ese caso al código productivo.

## Commits y líneas Tests

Las cifras son las líneas `Tests:` literales de cada verificación previa al commit, salvo la excepción 4, repetida también después del commit. Los rojos son exclusivamente pruebas TDD esperadas o los bloqueos históricos indicados. No se repiten bloques ya implementados.

| Commit y mensaje | Tests: | Alcance / resultado |
|---|---|---|
| `a479c7f7` test(pairing): specify shared ring delays before extraction (R13) | 0 total | rojo: módulo ausente |
| `d9d98844` refactor(pairing): share welcome ping rings with explicit delays (R13) | 87 passed, 87 total | PingRing + welcome, verde |
| `9dc36944` test(pairing): require collar pose before form content (R1) | 1 failed, 61 passed, 62 total | pairing, rojo |
| `af257a8b` feat(pairing): lead the linking view with collar Pingo (R1) | 62 passed, 62 total | pairing, verde |
| `ef7cd9e3` test(pairing): require two accent rings behind Pingo (R2) | 1 failed, 62 passed, 63 total | pairing, rojo |
| `5f24b361` feat(pairing): place two accent rings behind collar Pingo (R2) | 63 passed, 63 total | pairing, verde |
| `ebf21c95` test(pairing): specify stagger and exact ping loop boundary (R3) | 1 failed, 63 passed, 64 total | rojo original R3 |
| `bb598dbf` feat(pairing): apply ring stagger pending cycle boundary resolution (R3) | 1 failed, 150 passed, 151 total | implementación; aserción vieja bloqueada |
| `9f831ea3` test(pairing): apply approved cycle boundary amendment (R3) | 151 passed, 151 total | verde por E1, tres suites |
| `6e5bb3f9` test(pairing): specify Pingo float cycle (R4) | 1 failed, 64 passed, 65 total | pairing, rojo |
| `3d39f276` feat(pairing): float collar Pingo with shared motion (R4) | 70 passed, 70 total | pairing + PingoFloat, verde |
| `47363b97` test(pairing): require static rings under reduced motion (R5) | 1 failed, 65 passed, 66 total | pairing, rojo |
| `aa4687b9` feat(pairing): keep ping rings static with reduced motion (R5) | 153 passed, 153 total | tres suites, verde |
| `76bc928b` test(pairing): require localized title first in content (R6) | 2 failed, 66 passed, 68 total | pairing, rojo |
| `150dcf8d` test(pairing): query title order with supported RNTL API (R6) | 2 failed, 66 passed, 68 total | rojo con invocación corregida |
| `598af73d` feat(pairing): place localized title before pet selection (R6) | 68 passed, 68 total | pairing, verde |
| `3e0e36cd` test(pairing): require 24 px title token (R7) | 1 failed, 68 passed, 69 total | pairing, rojo |
| `bcebe008` feat(pairing): apply title token pending design guard resolution (R7) | 2 failed, 252 passed, 254 total | título verde, dos falsos positivos de guarda |
| `53e9af61` refactor(pairing): spell R2 ring order selector without bracket syntax (R2) | 1 failed, 253 passed, 254 total | excepción 3; C8 verde |
| `0c717e29` refactor(pairing): cite feature 188 as R1-R14 in describe title (R7) | 254 passed, 254 total | excepción 4; tres suites verdes |
| `252e7e29` test(pairing): specify localized linking content order (R8) | 2 failed, 69 passed, 71 total | pairing, rojo |
| `ee3fbc93` feat(pairing): expose label and hint in linking content order (R8) | 71 passed, 71 total | pairing, verde |
| `e5716f2f` test(pairing): keep unapproved subtitle absent across states (R9) | 81 passed, 81 total | pairing, NV |
| `97f2b146` test(pairing): require artboard padding in both device states (R10) | 2 failed, 81 passed, 83 total | pairing, rojo |
| `e2194c67` feat(pairing): apply artboard padding and approved metric assertions (R10) | 269 passed, 269 total | tres suites verdes, excepciones 1 y 2 |
| `68fb1458` test(pairing): verify catalog copy and registered bilingual keys (R11) | 33 passed, 33 total | suite nueva + ui-language, NV |
| `94cea37c` test(pairing): guard style sources after bracket mutation check (R12) | 243 passed, 243 total | cinco suites verdes tras mutación revertida |
| `c0387881` refactor(pairing): inspect copy table without registering its tests (R11) | 33 passed, 33 total | suite nueva + ui-language, verde |
| `f820d669` test(pairing): preserve paired ready and empty states without hero (R14) | 88 passed, 88 total | pairing, NV |

Los commits documentales de bloqueo anteriores (`22aff2e9`, `847cff9d`, `bf7af15e`, `db4b8841`, `3082ff68`) quedan en la historia. El commit final de esta ejecución contiene exclusivamente este reporte y traceability.md; su hash no se autorreferencia dentro del propio commit.

## Excepción 4 y cierre de R7

Antes de la excepción 4 se reprodujo exactamente el único fallo autorizado:

```text
Test Suites: 1 failed, 2 passed, 3 total
Tests:       1 failed, 253 passed, 254 total
```

Se cambia solo `describe('#188: pairing canvas fidelity', …)` por `describe('#188 R1-R14: pairing canvas fidelity', …)`, según Excepción 4 del leader, 2026-10-19 tras `3082ff68`. No se cambia una aserción, un it ni una guarda. El commit propio es `0c717e29` con el mensaje exacto solicitado.

Se ejecuta antes y después del commit:

```bash
bun run test --runInBand --runTestsByPath src/screens/pairing/index.test.tsx src/__tests__/design-drift.test.ts src/__tests__/consistency-classnames.test.ts
```

Ambas verificaciones posteriores al cambio dan:

```text
Test Suites: 3 passed, 3 total
Tests:       254 passed, 254 total
```

R7 queda completo funcionalmente y con design-drift/consistency-classnames verdes. El rojo original y el token ya estaban en `3e0e36cd` y `bcebe008`.

## R8–R14 y NV

- R8: los literales es/en de R6 y R8 se contrastaron por las cuatro claves contra catálogo y coinciden exactamente con requirements. El orden visual existente ya coincide. Los dos casos rojos exigen IDs para la etiqueta y la pista; la implementación mínima añade `pairing-activation-code-label` y `pairing-code-hint` para comprobar la secuencia completa, manteniendo el input y el botón. La búsqueda obligatoria de selectores `grep -rn 'TestId(/' mobile-pet-tracker/src` no encuentra selectores previos que cambien su resultado.
- R9 **NV**: D5(a), R6 y R8 ya omiten subtítulo. Diez escenarios con ancla positiva del mismo árbol: carga, error de mascotas, sin mascotas, vinculación, cuatro estados del plan, error de claim y ready. No se fuerza un rojo ni se cambia implementación.
- R10: rojo en vinculación y emparejado; paddingHorizontal 20 / paddingVertical 24 en el contenedor compartido, sin ramas para carga. Gap y ambos paddingBottom permanecen intactos. Se aplican las excepciones 1 y 2 en el mismo commit de implementación. El diff de design-drift contiene únicamente el desdoblamiento autorizado del caso padding:24.
- R11 **NV**: R6/R8 ya usan catálogo. El AST rechaza copy literal en texto JSX y props de texto, verifica las claves directas de t() en es/en y sus filas en la tabla. Las cuatro claves obligatorias deben estar presentes. ui-language verifica también la tabla normativa y las claves dinámicas existentes. No se modifica catálogo ni ui-copy-table. El refactor evita que importar la tabla registre dos it ajenos en la suite nueva; las cifras anteriores conservan esos dos tests importados, y el total final los excluye.
- R12: dos casos, uno por fuente, con el mismo patrón HEX_LITERAL de design-drift y el patrón de className con corchetes prescrito. La implementación ya cumple tras R7/R10. Se valida el candado con mutación, descrita abajo; las cuatro guardas pasan.
- R14 **NV**: el gating de R1/R2/R4 ya restringe el hero a vinculación. Cinco casos (tracked/free/unknown, ready, sin mascotas) conservan los testIDs actuales, y comprueban ausencia de Pingo, ambos anillos y flotado después de esperar al nodo positivo correspondiente. No cambia implementación.

R3 conserva E1: la corrección nació verde sobre `bb598dbf`, no es otro rojo TDD. El rojo original es `ebf21c95`; 2400 ms fija 1.5/0 y 2401 ms usa claves exactas e intervalos estrictos leídos mediante getAnimatedStyle. No se toca PingRing para satisfacer la aserción retirada. R4 conserva PingoFloat y su test sin cambios; R5 conserva 0/1500/2400 ms, estilos exactos y reduce motion.

## Prueba de mutación R12

Antes del commit R12 se planta `className="w-[3px]"` en el host de pairing/index.tsx. La suite nueva da exclusivamente el rojo esperado de R12 para ese fichero:

```text
Test Suites: 1 failed, 1 total
Tests:       1 failed, 4 passed, 5 total
```

El matcher que falla es `not /className="[^"]*\[/`. Se revierte la mutación y `git diff --exit-code -- mobile-pet-tracker/src/screens/pairing/index.tsx` confirma identidad con HEAD antes de cualquier commit. Después pasan pairing-canvas-fidelity, design-drift, consistency-classnames, legibility-classnames y heroui-text-size-merge:

```text
Test Suites: 5 passed, 5 total
Tests:       243 passed, 243 total
```

Esta cifra precede al refactor R11 que elimina dos tests importados de la tabla; los tres casos propios de la suite nueva permanecen intactos.

## Cierre: parada obligatoria (registro; resuelta con la excepción 5)

Se lanzaron, después del último verde, bun run test, typecheck con preguarda, lint sin caché y graphify. Al recibir el fallo de typecheck se detiene toda implementación y no se inicia ninguna otra verificación. Solo se recogen las operaciones ya iniciadas y se documenta el resultado.

**Typecheck: FALLA (exit 2) en la parada; corregido con la excepción 5 (`c0e2c93a`)**. `test ! -e .expo/types/router.d.ts` pasó y después arrancó `bun run typecheck` (`tsc --noEmit`). No existe una denegación del sandbox ni un error de invocación: son diagnósticos reales de TypeScript en fuentes de react-native-reanimated, entre ellos:

```text
node_modules/react-native-reanimated/src/PropsRegistryGarbageCollector.ts(55,5): error TS2322: Type 'number' is not assignable to type 'Timeout'.
node_modules/react-native-reanimated/src/ReanimatedModule/NativeReanimated.ts(42,12): error TS7017: Element implicitly has an 'any' type because type 'typeof globalThis' has no index signature.
node_modules/react-native-reanimated/src/common/style/config.ts(21,14): error TS2740: ... missing ... outline, animationDuration, animationTimingFunction, animationDelay ...
node_modules/react-native-reanimated/src/commonTypes.ts(172,18): error TS2320: Interface 'StyleProps' cannot simultaneously extend types 'ViewStyle' and 'TextStyle'.
```

Hay otros TS7017 y TS2345 en esa dependencia. No se corrige código, no se excluyen tests ni se cambia tsconfig/dependencias para eludir el gate. La importación profunda de getAnimatedStyle en pairing/index.test.tsx era la causa: el leader la sustituyó por el import público en la excepción 5 (`c0e2c93a`) y el typecheck pasa sobre `1ec2046d`. router.d.ts no se crea ni se borra.

Resultados recogidos de las operaciones ya iniciadas, sin repetir verificadores después del fallo:

- Suite completa `bun run test`: exit 0; `Test Suites: 122 passed, 122 total`; `Tests: 4027 passed, 4027 total`, cero skipped. Coincide con 3994 + 32 + 1. Son 120 suites base + PingRing + pairing-canvas-fidelity. Todos los tests previos pasan con las únicas excepciones autorizadas. Las cuatro guardas R12 también pasan en esta corrida final.
- Lint: exit 0 con el comando exacto `bunx expo lint --no-cache > ../progress/lint-188.log 2>&1 && test ! -s ../progress/lint-188.log`; log vacío (0 bytes).
- `graphify update .`: exit 0, extracción AST sin LLM. Genera en graphify-out el grafo con 26512 nodos, 34419 aristas y 1768 comunidades. Advertencia de herramienta: 20 ficheros SQL no contribuyen por faltar tree_sitter_sql; no se añaden dependencias. No afecta a la extracción móvil y no se acredita cobertura SQL.

El último verde de código es f820d669. El commit documental final conserva la línea `Tests: 4027 passed, 4027 total` sin una corrida adicional: no cambia código. Ese bloqueo quedó resuelto con la excepción 5; el estado vigente está en la sección siguiente.

## Estado actual (leader, tras `1ec2046d`)

- `init.sh` sobre `1ec2046d`: exit 0 (`progress/init-188.exit`, `progress/init-188.log`). Lint y Typecheck verdes.
- Lint gate `bun run --cwd mobile-pet-tracker lint` (= `expo lint`): exit 0 (`progress/lint-188-gate.log`). `expo lint` sin argumentos lintea solo `src` en este proyecto (`node_modules/@expo/cli/build/src/lint/lintAsync.js`: `DEFAULT_INPUTS` = `src`, `app`, `components`; solo existe `src`). Sale 0 también si eslint muere por SIGKILL, así que la prueba positiva es la de alcance: `bunx eslint --no-cache --format json src` → exit 0, 239 ficheros, 0 errores, 0 avisos (`progress/lint-188-gate-scope.log`).
- Fuera del gate: `bunx eslint --no-cache --format json .` → exit 1, 2 errores `no-undef` en `mobile-pet-tracker/test/blobatar-bridge.js:4` (`__dirname`) y `mobile-pet-tracker/test/jest-setup.js:1` (`jest`). Esos ficheros y `eslint.config.js` son idénticos en `origin/main` y la rama no los toca: deuda previa, no de #188 (`progress/lint-188-eslint.log`).
- Reviewer sobre `1ec2046d`: RECHAZADO (`progress/review_188.md`). Abiertos: C4-1 (R9, R11, R14), C4-2 (R12) y C4-3 (R6), pendientes de decisión humana. M-1 queda cubierto por la prueba de alcance; lo confirma el reviewer en la siguiente pasada.

## Skills y desviaciones

Skills cargadas en esta ejecución:

- ponytail: `/home/claude/.codex/plugins/cache/ponytail/ponytail/5.3.2/skills/ponytail/SKILL.md`.
- building-native-ui: `/home/claude/.codex/plugins/cache/openai-curated/expo/11c74d6b/skills/building-native-ui/SKILL.md`.
- expo-tailwind-setup: `/home/claude/.codex/plugins/cache/openai-curated/expo/11c74d6b/skills/expo-tailwind-setup/SKILL.md`.
- appllama-app-design-skill: `.agents/skills/appllama-app-design-skill/SKILL.md`.
- animate-expo: `.agents/skills/animate-expo/SKILL.md`.

No falta ninguna requerida. Las cuatro equivalencias inexistentes de Codex (expo-overview, expo-animation, expo-router, expo-design-system) no se buscan, según handoff. Sin MCP Appllama; se sigue el patrón de carta/spec, sin cambiar sistema de estilos. Movimiento heredado de primer uso con propósito de deleite, transform/opacity en UI thread y tiempos aprobados; no se agregan animaciones en esta reanudación.

Desviaciones autorizadas del handoff: excepción 1 (#95 R6) y excepción 2 (métricas de design-drift), aplicadas en `e2194c67`; excepción 3 (selector R2) conservada en `53e9af61`; excepción 4 (describe) aplicada en `0c717e29`. Antes/después de excepción 3: `Tests: 2 failed, 252 passed, 254 total` → `Tests: 1 failed, 253 passed, 254 total`. E1 es enmienda humana, no un rojo nuevo. Ninguna otra aserción anterior se cambia.

Logs en progress/test-188.log y progress/lint-188.log, ignorados, según la desviación explícita del handoff sobre tasks («fuera del árbol»). Error de invocación de esta ejecución: actualización del reporte usando ruta de raíz desde mobile-pet-tracker dio ENOENT sin modificar archivos; se corrigió desde la raíz. Errores heredados resueltos: ruta ui-copy.test.ts inexistente y findAllByType no disponible en RNTL 14, corregidos en la ejecución anterior. Sin denegaciones del sandbox.

## Ficheros y límites

`git diff --name-only 6dc51ca1..HEAD -- mobile-pet-tracker/` coincide exactamente con los ocho ficheros móviles autorizados:

```text
mobile-pet-tracker/src/__tests__/design-drift.test.ts
mobile-pet-tracker/src/__tests__/pairing-canvas-fidelity.test.ts
mobile-pet-tracker/src/components/__tests__/ping-ring.test.tsx
mobile-pet-tracker/src/components/ping-ring.tsx
mobile-pet-tracker/src/screens/pairing/index.test.tsx
mobile-pet-tracker/src/screens/pairing/index.tsx
mobile-pet-tracker/src/screens/welcome/index.tsx
mobile-pet-tracker/src/theme/global.css
```

Árbol móvil/specs limpio tras el último commit de código; git diff --check pasa. El commit final incluye solo este reporte y traceability.md con los hashes y el estado de Cierre bloqueado. No se declara la feature done, ni se atribuye revisión humana o aprobación del reviewer.

H1–H3 (Android, reduce motion y comparación con canvas) siguen al humano, igual que fps en release según los límites de la spec. No se verificó fidelidad visual desde tests ni se usó Expo Go. La compilación uniwind de border-3/size-37.5 se conserva acreditada por la ejecución inicial, sin repetirla.

Corrección: esta frase anunciaba la creación de `progress/impl_mobile-pairing-pingo-canvas-fidelity.done`. El fichero no existe en `progress/` y no se crea; la afirmación se retira.

## Excepción 5 (import, typecheck)

Estado: superada por el leader. El paso 4 se reejecutó con el criterio correcto (ver abajo). Commit A: `c0e2c93a`, `refactor(pairing): read animated style from the public reanimated entry (R3)`. Commit B: `traceability.md` y este reporte, con el hash de A. La parada del paso 4 se conserva como registro: el criterio «sin errores» del encargo era erróneo, porque esa línea la imprime `init.sh`; `expo lint` no imprime nada en verde.

Cambio (línea 14 de `mobile-pet-tracker/src/screens/pairing/index.test.tsx`, único cambio del diff):

- antes: `import { getAnimatedStyle } from 'react-native-reanimated/src/jestUtils';`
- después: `import { getAnimatedStyle } from 'react-native-reanimated';`

Verificación, secuencial y sin pipes:

1. `git diff` del fichero: un único cambio, en la línea 14.
2. `bun run --cwd /home/claude/sites/Pet-Tracker-wt-188/mobile-pet-tracker typecheck` (`tsc --noEmit`): código de salida 0.
3. `bun run --cwd /home/claude/sites/Pet-Tracker-wt-188/mobile-pet-tracker test -- src/screens/pairing/index.test.tsx`: código de salida 0. bun descarta el `--` y ejecuta `jest src/screens/pairing/index.test.tsx`, así que solo corre ese fichero. Resultado: `PASS src/screens/pairing/index.test.tsx`, `Test Suites: 1 passed, 1 total`, `Tests:       88 passed, 88 total`, sin skipped ni fallidos.
4. `bun run --cwd /home/claude/sites/Pet-Tracker-wt-188/mobile-pet-tracker lint > /home/claude/sites/Pet-Tracker-wt-188/progress/lint-188-exc5.log 2>&1; echo $?`: código de salida 0. Contenido literal del log:

```text
$ expo lint
```

El log no contiene la línea «sin errores» que exige el encargo. Esa única línea es la cabecera que bun imprime al ejecutar un script; expo lint no imprimió nada más. Según el encargo, un log sin esa línea es fallo, así que el paso 4 falla y no se hace commit.

Datos para decidir: el cierre anterior de este branch aceptó `bunx expo lint --no-cache` con código 0 y log de 0 bytes (sin cabecera de bun). Esta corrida, con código 0 y sin salida de eslint, no separa un lint limpio de un SIGKILL por OOM que sale 0, riesgo conocido de expo lint.

Diagnóstico adicional, no sustituye al gate: `bunx eslint --no-cache src/screens/pairing/index.test.tsx` en `mobile-pet-tracker`: código de salida 0, sin salida.

`graphify update .` tras el cambio: código de salida 0 (solo toca `graphify-out/`, ignorado por git).

Lint del leader sobre el mismo cambio: `bunx expo lint --no-cache > progress/lint-188-exc5.log 2>&1`, código de salida 0, log de 0 bytes, sin `Failed to run` ni `SIGKILL`. La verificación completa del HEAD de cierre queda en `progress/init-188.log` y `progress/init-188.exit`.

## Excepciones C4: evidencia de cada firma

El reviewer rechazó `ec882bae` (veredicto guardado en el commit `9ef8bf47`). Los hallazgos C4 pedían decisión humana: excepción firmada por requisito, o enmienda de la spec que declare la vía (b) de CHECKPOINTS.md C4 (líneas 46–54). El leader no firma nada. La evidencia de rojo por aserción está en `progress/mutacion_mobile-pairing-pingo-canvas-fidelity.md`, producida por la prueba de mutación de Codex en `/home/claude/sites/Pet-Tracker-wt-188-probe` según `progress/handoff_mutacion_mobile-pairing-pingo-canvas-fidelity.md`.

- **R9** (`e5716f2f`, NV): nace verde. D5(a), R6 y R8 ya omiten el subtítulo, sin commit rojo. Evidencia: M1 (línea nueva tras `index.tsx:283`) → rojo esperado en `index.test.tsx:1249`.
- **R11** (`68fb1458`, NV; refactor `c0387881`): nace verde por R6/R8. Evidencia: M2 (texto literal en el botón, `index.tsx:388`) → rojo esperado en `pairing-canvas-fidelity.test.ts:53`.
- **R14** (`f820d669`, NV): nace verde; el gating de R1/R2/R4 ya restringe el hero. Evidencia: M5 (condición del hero sin `device === null`, `index.tsx:269`) → rojo esperado en `index.test.tsx:1292`.
- **R12** (`94cea37c`): la mutación `className="w-[3px]"` se revirtió antes del commit y no quedó versionada; `tasks.md:101` contradice C4 punto 5. Evidencia: M3 (`index.tsx:270`, rojo en `pairing-canvas-fidelity.test.ts:73`) y M4 (hex en `ping-ring.tsx`, rojo en `:72`).
- **R6** (`76bc928b`): rojo inválido, `findAllByType` no existe en RNTL 14. El rojo válido es `150dcf8d`. Propuesta: excepción que acepte `150dcf8d` como rojo de R6. El handoff no incluye mutación de R6.

## Convención de commits (M-2)

`docs/conventions.md` §Commits lista ahora `test`, `docs` y `chore`. `feat`, `fix`, `refactor` y `test` que tocan la feature llevan `(R<n>)`; `docs` y `chore` no. Los commits de la rama sin `(R<n>)` son `docs(...)` y cumplen la convención nueva: `22aff2e9`, `847cff9d`, `bf7af15e`, `db4b8841`, `3082ff68`, `863da0dc`, `4fb7fd9a`, `1cc2a08f`, `d99797e2`, `9ef8bf47` y `db3bd5e3`. Quedan fuera de M-2 (decisión humana, C5): `8166167c` (asunto en inglés, sin tipo) y los merges de `origin/main` (`50e56e44`, `44a16473`). `4fb7fd9a` y `1cc2a08f` usan `docs(#188)` en vez de `docs(pairing)`. No se reescriben: cambiarían los hashes de la trazabilidad.

## Firmas humanas pendientes

Solo el humano marca estas casillas, con su commit de firma. El leader no marca ninguna.

- [X] C4 · R6: aceptar `150dcf8d` como rojo válido de R6. Aprobado por humano (fecha: 2026-10-20)
- [X] C4 · R9: excepción o enmienda vía (b), con la evidencia de M1. Aprobado por humano (fecha: 2026-10-20)
- [X] C4 · R11: excepción o enmienda vía (b), con la evidencia de M2. Aprobado por humano (fecha: 2026-10-20)
- [X] C4 · R12: excepción por la mutación no versionada, con la evidencia de M3 y M4. Aprobado por humano (fecha: 2026-10-20)
- [X] C4 · R14: excepción o enmienda vía (b), con la evidencia de M5. Aprobado por humano (fecha: 2026-10-20)
- [X] M-4 · excepción 1: padding de `#95 R6` en `index.test.tsx` (`e2194c67`). Aprobado por humano (fecha: 2026-10-20)
- [X] M-4 · excepción 2: guarda design-drift `padding: 24` (`e2194c67`). Aprobado por humano (fecha: 2026-10-20)
- [X] M-4 · excepción 3: selector R2 sin corchetes (`53e9af61`). Aprobado por humano (fecha: 2026-10-20)
- [X] M-4 · excepción 4: cabecera del describe `#188 R1-R14` (`0c717e29`). Aprobado por humano (fecha: 2026-10-20)
- [X] M-4 · excepción 5: import público de reanimated (`c0e2c93a`, `index.test.tsx:14`). Aprobado por humano (fecha: 2026-10-20)
- [X] B-5 · Supuestos reformulados en `4fb7fd9a` (`specs/mobile-pairing-pingo-canvas-fidelity/requirements.md:101`). Confirmado por humano (fecha: 2026-10-20)
- [X] M-2 · convención de commits de `docs/conventions.md` §Commits. Confirmado por humano (fecha: 2026-10-20)
- [X] Merge con `origin/main`: unión de las tres enmiendas de `docs/ui-guidelines.md` (#176 y #186 de main, #188 de la rama). Revisado por humano (fecha: 2026-10-20)
- [X] H1 · build de desarrollo Android: anillos de 2400 ms y flotado (`requirements.md:128`). Verificado por humano (fecha: 2026-10-20)
- [X] H2 · dispositivo con «Quitar animaciones» activo (`requirements.md:129`). Verificado por humano (fecha: 2026-10-20)
- [X] H3 · comparación lado a lado con el artboard «Vincular collar (19)» (`requirements.md:130`). Verificado por humano (fecha: 2026-10-20)
- [ ] C4 · M-3 (historia roja): aceptar la excepción de `bb598dbf` (R3, 1 failed, 150 de 151), `bcebe008` (R7, 2 failed, 252 de 254) y `53e9af61` (R2, 1 failed, 253 de 254). Verde en `9f831ea3` (R3) y `0c717e29` (R7). Decisión tomada en el chat del 2026-10-20: aceptar. Firma pendiente, con commit del humano.
- [ ] C4 · R9, R11 y R14: vía excepción, con la evidencia de M1, M2 y M5 (L224–226). Precisa las casillas L239, L240 y L242 («excepción o enmienda vía (b)»). Decisión tomada en el chat del 2026-10-20: excepción. Firma pendiente, con commit del humano.
- [ ] C5 · commits fuera de M-2: aceptar `8166167c` (asunto en inglés, sin tipo) y los merges `50e56e44` y `44a16473` como excepción, sin reescribir. Decisión tomada en el chat del 2026-10-20: aceptar. Firma pendiente, con commit del humano.
- [ ] Merge con `origin/main` (re-firma): cubre cuatro enmiendas de `docs/ui-guidelines.md`: #176, #186, #188 y #190 (L747). La casilla L250 cubre solo tres. Firma pendiente, con commit del humano.
