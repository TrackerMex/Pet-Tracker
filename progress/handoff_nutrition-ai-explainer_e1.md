# Handoff a Codex CLI — #18 nutrition-ai-explainer, ronda 2 (enmienda E1)

> Pega el bloque de abajo en Codex CLI. La enmienda E1 esta firmada via
> Notion; el commit de firma es c4b86430 de esta branch. La ronda 1
> (`progress/handoff_nutrition-ai-explainer.md`) ya se cumplio y no se rehace.
> Solo backend y solo tests unitarios: sin e2e, sin init.sh, sin skills de
> expo. La prueba de humo con clave real (R19) es del humano y ninguna IA la
> corre.
>
> El leader midio en el commit de firma (c4b86430), antes de escribir este
> fichero, todo lo que == BASE == declara: las 38 anclas, los tres specs
> (18/25/9), tsc con 0 errores y el comprobador de /tmp/e1-check.js. El
> backend de c4b86430 es identico al de c09ee51c.

---

```
Worktree: /home/claude/sites/Pet-Tracker-wt-18   <- PRIMERA LINEA. Trabaja AQUI y en ningun otro sitio
Antes de tocar nada, ejecuta `pwd`, `git branch --show-current`,
`git rev-parse HEAD` y `git status --short` y pega las cuatro salidas en una
seccion NUEVA al FINAL de progress/impl_nutrition-ai-explainer.md:
`# Ronda 2 — Enmienda E1` > `## Base E1`. No edites nada de la ronda 1 de ese
fichero: solo anades al final. El hash es H0E1: el commit que anade este
fichero (progress/handoff_nutrition-ai-explainer_e1.md). Para si la branch no
es feature/18-nutrition-ai-explainer-claude o si el status no esta vacio.
No toques ningun otro worktree (Pet-Tracker, -wt-157, -wt-backend, -wt-118,
-wt-146, -wt-148, -wt-152, -wt-153, -wt-155, -wt-ui, pet-tracker-43,
pt-skills) ni cambies de branch en ninguno. NO uses la branch vieja
feature/18-nutrition-ai-explainer (OpenAI).

Feature: nutrition-ai-explainer (#18), RONDA 2
Branch: feature/18-nutrition-ai-explainer-claude
Spec: specs/nutrition-ai-explainer/requirements.md §Enmienda E1 (E1.0-E1.8 y
§Cifras y alcance), firmada en c4b86430. El orden LITERAL de commits es
specs/nutrition-ai-explainer/tasks.md §Enmienda E1 — ronda 2.
Lee enteros, antes de empezar:
  - requirements.md §Enmienda E1 (desde «## Enmienda E1» hasta «## Overrides
    humanos vigentes»)
  - tasks.md §Enmienda E1 — ronda 2 (hasta el final del fichero)
  - specs/nutrition-ai-explainer/traceability.md
  - progress/review_nutrition-ai-explainer.md (el veredicto de la ronda 1: F1-F5)
Los literales (nombres de describe/it, filas, valores con tabulador, espacio
y salto de linea, warn esperado, tipos AnthropicClientOptions y
AnthropicSdkLoader, default del cargador) estan en requirements.md §E1.x:
copialos, no los reescribas. Los dobles se escriben desde la intencion que
describe la spec; no copies dobles de otra suite.

== QUE HACES ==

La ronda 1 se rechazo (c09ee51c) porque los tests que prescribia la spec
dejaban ramas sin candado. E1 anade esos candados y DOS cambios de produccion:
  E1.1 R5    constructorArgs: que valor llega a cada parametro del adaptador.
             D-E1-a (decision del humano): el factory pasa model.trim() y
             key.trim(). UNICO cambio de conducta de E1.
  E1.2 R3/R5 orden entre pares de guardas: it.each de 6 filas.
  E1.3 R11   el SDK se carga DENTRO del try de degradacion, por un cargador
             inyectable (cuarto parametro loadSdk con default). Refactor SIN
             cambio de conducta.
  E1.4 R10   content que no es array (5 filas).
  E1.5 R10   solo bloques type 'text' (2 filas, tipo 'texto-futuro').
  E1.7 R10   stopReason null cuando falta stop_reason (1 fila).
  E1.8 R11   String(error) para rechazos que no son Error (1 fila + rama).
Fuera de E1.1 y E1.3, la produccion YA es correcta: el rojo de cada commit
test(...) sale de una MUTACION de produccion versionada en ese mismo commit,
y el fix(...) siguiente la revierte restaurando el fichero desde un hash.
E1-c3 es la excepcion: su rojo es la produccion actual, sin recortar.
No uses numeros de linea: localiza todo por contenido.

== BASE ==

Comprueba en H0E1, desde la raiz del worktree (cada linea debe dar lo indicado;
si alguna no, PARA):
  git merge-base --is-ancestor c4b86430 HEAD; echo "exit=$?"          -> exit=0
  git merge-base --is-ancestor c09ee51c HEAD; echo "exit=$?"          -> exit=0
  git diff --quiet c09ee51c HEAD -- backend-pet-tracker; echo "exit=$?"   -> exit=0

Crea /tmp/e1-check.js (fuera del repo) con este contenido EXACTO. Resume el
JSON de jest en una linea comparable; todos los gates y sondas lo usan:
  const r = require(process.argv[2]);
  const failed = r.testResults
    .flatMap((t) => t.assertionResults)
    .filter((a) => a.status === 'failed')
    .map((a) => a.title)
    .sort();
  console.log(JSON.stringify({ total: r.numTotalTests, passed: r.numPassedTests, failed: r.numFailedTests, suiteErrors: r.numRuntimeErrorTestSuites, failedTitles: failed }));

Abreviaturas de este handoff (las variables de shell NO persisten entre
comandos: sustituyelas a mano en cada linea):
  AI = backend-pet-tracker/src/modules/nutrition/infrastructure/ai   (git y anclas, desde la raiz)
  FS = src/modules/nutrition/infrastructure/ai/nutrition-explainer.factory.spec.ts      (jest/eslint, relativo a backend-pet-tracker)
  FP = src/modules/nutrition/infrastructure/ai/nutrition-explainer.factory.ts
  AS = src/modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.spec.ts
  AP = src/modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.ts
  SS = src/modules/nutrition/nutrition-scope.spec.ts

Linea base (cada una sin pipe; pega exit y la salida del comprobador):
  FORCE_COLOR=0 pnpm -C backend-pet-tracker exec jest <FS> --json --outputFile=/tmp/e1-base-fs.json > /tmp/e1-base-fs.log 2>&1; echo "exit=$?"; node /tmp/e1-check.js /tmp/e1-base-fs.json
    -> exit=0 y {"total":18,"passed":18,"failed":0,"suiteErrors":0,"failedTitles":[]}
  igual con <AS> (/tmp/e1-base-as.*)
    -> exit=0 y {"total":25,"passed":25,"failed":0,"suiteErrors":0,"failedTitles":[]}
  igual con <SS> (/tmp/e1-base-ss.*)
    -> exit=0 y {"total":9,"passed":9,"failed":0,"suiteErrors":0,"failedTitles":[]}
  pnpm -C backend-pet-tracker exec tsc --noEmit -p tsconfig.json > /tmp/e1-base.tsc 2>&1; echo "exit=$?"; grep -c 'error TS' /tmp/e1-base.tsc
    -> exit=0 y 0 (base de tipos: 0 errores)
  pgrep -af 'init\.sh|test:e2e|jest-e2e' | grep -v pgrep     -> nada (si lista algo, espera o PARA)
  FORCE_COLOR=0 pnpm -C backend-pet-tracker exec jest --json --outputFile=/tmp/e1-base-unit.json > /tmp/e1-base-unit.log 2>&1; echo "exit=$?"; node /tmp/e1-check.js /tmp/e1-base-unit.json
    -> exit=0 y failed 0 (anota el total: es la suite unitaria entera; algunos
       specs leen Postgres, por eso el pgrep)
Si algo de la base falla, PARA.

Anclas E1-A1..E1-A38 (requirements.md §Cifras y alcance), YA SUSTITUIDAS: aqui
no hay ningun `\|`, copialas tal cual. Formato: id, [valor en H0E1 -> valor
al final de la ronda], comando. Ejecutalas desde la raiz con
`AI=backend-pet-tracker/src/modules/nutrition/infrastructure/ai` definido en
la MISMA linea, en H0E1 (columna izquierda) y al final (columna derecha).
Pega cada valor junto al declarado. Si alguna no da lo declarado en H0E1, PARA.
  E1-A1  [1 -> 1]  grep -cF "await import('@anthropic-ai/sdk')" $AI/anthropic-nutrition-explainer.ts
  E1-A2  [0 -> 0]  grep -cF "from '@anthropic-ai/sdk'" $AI/anthropic-nutrition-explainer.ts
  E1-A3  [0 -> 1]  grep -cF 'export type AnthropicSdkLoader' $AI/anthropic-nutrition-explainer.ts
  E1-A4  [0 -> 1]  grep -cF 'export interface AnthropicClientOptions' $AI/anthropic-nutrition-explainer.ts
  E1-A5  [0 -> 1]  grep -cF 'await this.loadSdk()' $AI/anthropic-nutrition-explainer.ts
  E1-A6  [1 -> 1]  grep -cF 'if (this.client === null)' $AI/anthropic-nutrition-explainer.ts
  E1-A7  [1 -> 1]  grep -cF 'Array.isArray(response.content)' $AI/anthropic-nutrition-explainer.ts
  E1-A8  [1 -> 1]  grep -cF "block.type === 'text'" $AI/anthropic-nutrition-explainer.ts
  E1-A9  [1 -> 0]  grep -cF 'return new AnthropicNutritionExplainer(model, key, null);' $AI/nutrition-explainer.factory.ts
  E1-A10 [0 -> 4]  grep -cF 'constructorArgs(' $AI/nutrition-explainer.factory.spec.ts
  E1-A11 [0 -> 1]  grep -cF "'%s y %s fallan: gana %s'" $AI/nutrition-explainer.factory.spec.ts
  E1-A12 [0 -> 1]  grep -cF 'pasa clave y modelo recortados (E1.1)' $AI/nutrition-explainer.factory.spec.ts
  E1-A13 [0 -> 0]  grep -cF '.explain(' $AI/nutrition-explainer.factory.spec.ts
  E1-A14 [0 -> 1]  grep -cF "'content string'" $AI/anthropic-nutrition-explainer.spec.ts
  E1-A15 [0 -> 1]  grep -cF "'content objeto'" $AI/anthropic-nutrition-explainer.spec.ts
  E1-A16 [0 -> 1]  grep -cF "'content numero'" $AI/anthropic-nutrition-explainer.spec.ts
  E1-A17 [0 -> 1]  grep -cF "'content undefined'" $AI/anthropic-nutrition-explainer.spec.ts
  E1-A18 [0 -> 1]  grep -cF "'bloque no-text con text'" $AI/anthropic-nutrition-explainer.spec.ts
  E1-A19 [0 -> 1]  grep -cF "'solo bloque no-text con text'" $AI/anthropic-nutrition-explainer.spec.ts
  E1-A20 [0 -> 1]  grep -cF "'texto-futuro'" $AI/anthropic-nutrition-explainer.spec.ts
  E1-A21 [0 -> 1]  grep -cF 'R11 (nutrition-ai-explainer #18) E1.3:' $AI/anthropic-nutrition-explainer.spec.ts
  E1-A22 [0 -> 2]  grep -cF "'sdk ausente'" $AI/anthropic-nutrition-explainer.spec.ts
  E1-A23 [0 -> 2]  grep -cF "'opciones invalidas'" $AI/anthropic-nutrition-explainer.spec.ts
  E1-A24 [4 -> 7]  grep -cF 'new AnthropicNutritionExplainer(' $AI/anthropic-nutrition-explainer.spec.ts
  E1-A25 [0 -> 2]  git diff -U0 c09ee51c -- $AI/nutrition-explainer.factory.ts | grep -cvE '^(diff |index |--- |\+\+\+ |@@ )'
  E1-A26 [0 -> 0]  git diff c09ee51c -- backend-pet-tracker/src/modules/nutrition/nutrition-scope.spec.ts | wc -l
  E1-A27 [0 -> 0]  grep -rlF "jest.mock('@anthropic-ai/sdk'" backend-pet-tracker/src backend-pet-tracker/test | wc -l
  E1-A28 [0 -> 0]  grep -rlE "from '@anthropic-ai/sdk'|import\('@anthropic-ai/sdk'\)" backend-pet-tracker/src backend-pet-tracker/test --include=*spec.ts | wc -l
  E1-A29 [0 -> 1]  grep -cF 'return new AnthropicNutritionExplainer(model.trim(), key.trim(), null);' $AI/nutrition-explainer.factory.ts
  E1-A30 [0 -> 1]  grep -cF "'content array-like'" $AI/anthropic-nutrition-explainer.spec.ts
  E1-A31 [0 -> 1]  grep -cF "'sin stop_reason'" $AI/anthropic-nutrition-explainer.spec.ts
  E1-A32 [0 -> 1]  grep -cF "'no soy Error'" $AI/anthropic-nutrition-explainer.spec.ts
  E1-A33 [0 -> 1]  grep -cF "'[object Object]'" $AI/anthropic-nutrition-explainer.spec.ts
  E1-A34 [0 -> 3]  grep -cF 'const loadSdk: AnthropicSdkLoader' $AI/anthropic-nutrition-explainer.spec.ts
  E1-A35 [0 -> 3]  tr -d ' \n' < $AI/anthropic-nutrition-explainer.spec.ts | grep -oF "'clave-de-prueba',null" | wc -l
  E1-A36 [0 -> 3]  tr -d ' \n' < $AI/anthropic-nutrition-explainer.spec.ts | grep -oF "'clave-de-prueba',null,loadSdk" | wc -l
  E1-A37 [1 -> 1]  grep -rlF 'new AnthropicNutritionExplainer(' backend-pet-tracker/src backend-pet-tracker/test --include=*spec.ts | wc -l
  E1-A38 [4 -> 4]  tr -d ' \n' < $AI/anthropic-nutrition-explainer.spec.ts | grep -oF "'clave-de-prueba',{" | wc -l

== COMO SE HACE CADA COMMIT ==

Para cada commit, en este orden y desde la raiz del worktree:
  1. Edita SOLO las rutas del commit.
  2. pnpm -C backend-pet-tracker exec eslint --fix <rutas relativas a backend-pet-tracker>
  3. pnpm -C backend-pet-tracker exec tsc --noEmit -p tsconfig.json > /tmp/e1-<id>.tsc 2>&1; echo "exit=$?"
     -> exit=0 SIEMPRE, tambien en los rojos (la base tiene 0 errores; un
        rojo de compilacion no es un rojo legitimo). Si no, PARA.
  4. Medir (una linea, sin pipe):
     FORCE_COLOR=0 pnpm -C backend-pet-tracker exec jest <SPEC> --json --outputFile=/tmp/e1-<id>.json > /tmp/e1-<id>.log 2>&1; echo "exit=$?"; node /tmp/e1-check.js /tmp/e1-<id>.json
  5. Commit ENCADENADO al gate, en UNA linea. Si la salida del comprobador no
     es EXACTAMENTE la esperada, no se commitea: PARA y anota el log.
     ROJO:  [ "$(node /tmp/e1-check.js /tmp/e1-<id>.json)" = '<ESPERADO>' ] && git commit -m "<MENSAJE>" -- <RUTAS desde la raiz>
     VERDE: [ "$(node /tmp/e1-check.js /tmp/e1-<id>.json)" = '<ESPERADO>' ] && pnpm -C backend-pet-tracker exec eslint <rutas relativas a backend-pet-tracker> && git commit -m "<MENSAJE>" -- <RUTAS desde la raiz>
     `git commit -- <rutas>` commitea solo esas rutas: el impl, que vas
     escribiendo sin commitear, queda fuera hasta E1-c18. No uses git add -A
     ni git commit -a.
  6. git show --name-only --format= HEAD   -> exactamente las RUTAS del commit
     git diff --cached --quiet; echo "exit=$?"   -> exit=0
     Pega en el impl: hash, id, mensaje, salida del paso 6, exit de tsc, exit
     de jest, salida del comprobador y, en los rojos, el `Expected`/`Received`
     de cada it rojo copiado de /tmp/e1-<id>.log.

Ejemplo completo, E1-c1 (los demas son iguales cambiando id, spec, rutas,
esperado y mensaje):
  pnpm -C backend-pet-tracker exec eslint --fix src/modules/nutrition/infrastructure/ai/nutrition-explainer.factory.spec.ts src/modules/nutrition/infrastructure/ai/nutrition-explainer.factory.ts
  pnpm -C backend-pet-tracker exec tsc --noEmit -p tsconfig.json > /tmp/e1-c1.tsc 2>&1; echo "exit=$?"
  FORCE_COLOR=0 pnpm -C backend-pet-tracker exec jest src/modules/nutrition/infrastructure/ai/nutrition-explainer.factory.spec.ts --json --outputFile=/tmp/e1-c1.json > /tmp/e1-c1.log 2>&1; echo "exit=$?"; node /tmp/e1-check.js /tmp/e1-c1.json
  [ "$(node /tmp/e1-check.js /tmp/e1-c1.json)" = '{"total":18,"passed":16,"failed":2,"suiteErrors":0,"failedTitles":["anti-vacio: development selecciona Anthropic sin invocarlo","anti-vacio: todas cumplidas seleccionan el adaptador real sin invocarlo"]}' ] && git commit -m "test(nutrition-ai-explainer): lock factory constructor arguments (R5, E1.1)" -- backend-pet-tracker/src/modules/nutrition/infrastructure/ai/nutrition-explainer.factory.spec.ts backend-pet-tracker/src/modules/nutrition/infrastructure/ai/nutrition-explainer.factory.ts

Restauraciones de los fix(...): SIEMPRE `git checkout <hash> -- <ruta>` con el
hash que indica el commit, y despues el gate. Tras commitear,
`git diff <hash> HEAD -- <ruta> | wc -l` -> 0. Anota en el impl, en cuanto
existan, HASH_C4 (`git rev-parse HEAD` justo tras E1-c4) y HASH_C7 (justo tras
E1-c7); los usan E1-c6 y E1-c9/c11/c13/c15/c17.

== COMMITS ==

Orden y mensajes LITERALES (tasks.md §Enmienda E1). 18 commits, ni uno mas.

E1-c1  test(nutrition-ai-explainer): lock factory constructor arguments (R5, E1.1)
  FS: helper `function constructorArgs(adapter: unknown)` (una sola vez) y el
      toEqual en los dos anti-vacios (E1.1 puntos 1 y 2). El it del punto 3 NO.
  FP: mutacion versionada; la ultima linea pasa a ser
        return new AnthropicNutritionExplainer(key, model, null);
  rutas: $AI/nutrition-explainer.factory.spec.ts $AI/nutrition-explainer.factory.ts
  ROJO <FS>: {"total":18,"passed":16,"failed":2,"suiteErrors":0,"failedTitles":["anti-vacio: development selecciona Anthropic sin invocarlo","anti-vacio: todas cumplidas seleccionan el adaptador real sin invocarlo"]}

E1-c2  fix(nutrition-ai-explainer): restore factory constructor argument order (R5, E1.1)
  git checkout c09ee51c -- backend-pet-tracker/src/modules/nutrition/infrastructure/ai/nutrition-explainer.factory.ts
  rutas: $AI/nutrition-explainer.factory.ts
  VERDE <FS>: {"total":18,"passed":18,"failed":0,"suiteErrors":0,"failedTitles":[]}
  tras commit: E1-A25 -> 0

E1-c3  test(nutrition-ai-explainer): expect trimmed key and model from factory (R5, E1.1, D-E1-a)
  FS: it nuevo 'pasa clave y modelo recortados (E1.1)' al final del describe
      R5 (E1.1 punto 3). Produccion SIN tocar: el rojo es la de c09ee51c.
  rutas: $AI/nutrition-explainer.factory.spec.ts
  ROJO <FS>: {"total":19,"passed":18,"failed":1,"suiteErrors":0,"failedTitles":["pasa clave y modelo recortados (E1.1)"]}

E1-c4  feat(nutrition-ai-explainer): pass trimmed key and model to Anthropic explainer (R5, E1.1, D-E1-a)
  FP: la ultima linea pasa a ser
        return new AnthropicNutritionExplainer(model.trim(), key.trim(), null);
      y nada mas.
  rutas: $AI/nutrition-explainer.factory.ts
  VERDE <FS>: {"total":19,"passed":19,"failed":0,"suiteErrors":0,"failedTitles":[]}
  tras commit: E1-A9 -> 0, E1-A29 -> 1, E1-A25 -> 2. Anota HASH_C4.

E1-c5  test(nutrition-ai-explainer): lock pairwise order of explainer guards (R3, R5, E1.2)
  FS: it.each(...)('%s y %s fallan: gana %s') de 6 filas en el describe R5
      (tabla de E1.2; cada fila parte de `valid` y cambia SOLO las dos claves).
  FP: mutacion versionada: el bloque `not-enabled` se mueve detras del bloque
      `model-missing`, justo antes del return new AnthropicNutritionExplainer.
  rutas: $AI/nutrition-explainer.factory.spec.ts $AI/nutrition-explainer.factory.ts
  ROJO <FS>: {"total":25,"passed":23,"failed":2,"suiteErrors":0,"failedTitles":["ANTHROPIC_ENABLED y ANTHROPIC_API_KEY fallan: gana not-enabled","ANTHROPIC_ENABLED y ANTHROPIC_MODEL fallan: gana not-enabled"]}

E1-c6  fix(nutrition-ai-explainer): restore explainer guard order (R3, R5, E1.2)
  git checkout HASH_C4 -- backend-pet-tracker/src/modules/nutrition/infrastructure/ai/nutrition-explainer.factory.ts
  rutas: $AI/nutrition-explainer.factory.ts
  VERDE <FS>: {"total":25,"passed":25,"failed":0,"suiteErrors":0,"failedTitles":[]}
  tras commit: git diff HASH_C4 HEAD -- $AI/nutrition-explainer.factory.ts | wc -l -> 0;
               E1-A25 -> 2, E1-A29 -> 1

E1-c7  refactor(nutrition-ai-explainer): inject SDK loader into Anthropic explainer (R11, E1.3)
  AP: el cambio de E1.3, literal de requirements.md: AnthropicClientOptions,
      AnthropicSdkLoader, cuarto parametro `private readonly loadSdk:
      AnthropicSdkLoader = async () => await import('@anthropic-ai/sdk')`, y
      dentro del try y del `if (this.client === null)` `await
      import('@anthropic-ai/sdk')` pasa a `await this.loadSdk()`. Nada mas.
      Va ANTES que su test para que el test compile (C4: nunca un rojo de
      compilacion).
  rutas: $AI/anthropic-nutrition-explainer.ts
  VERDE, TRES gates encadenados en la misma linea (ids c7as, c7fs, c7ss):
    <AS>: {"total":25,"passed":25,"failed":0,"suiteErrors":0,"failedTitles":[]}
    <FS>: {"total":25,"passed":25,"failed":0,"suiteErrors":0,"failedTitles":[]}
    <SS>: {"total":9,"passed":9,"failed":0,"suiteErrors":0,"failedTitles":[]}
  tsc exit=0. Anota HASH_C7. tras commit: E1-A1 -> 1, E1-A2 -> 0,
  y E1-A3 -> 1, E1-A4 -> 1, E1-A5 -> 1, E1-A6 -> 1.

E1-c8  test(nutrition-ai-explainer): lock lazy SDK load inside degradation (R11, E1.3)
  AS: describe('R11 (nutrition-ai-explainer #18) E1.3: la carga perezosa del
      SDK tambien degrada a null') al final del fichero, con sus 3 it (E1.3
      puntos 1-3). Cada it declara su `const loadSdk: AnthropicSdkLoader = ...`
      y construye el adaptador UNA vez con
      new AnthropicNutritionExplainer('modelo-de-prueba', 'clave-de-prueba', null, loadSdk)
  AP: mutacion versionada: el bloque `if (this.client === null) { ... }` se
      mueve ENTERO encima del try.
  rutas: $AI/anthropic-nutrition-explainer.spec.ts $AI/anthropic-nutrition-explainer.ts
  ROJO <AS>: {"total":28,"passed":26,"failed":2,"suiteErrors":0,"failedTitles":["el constructor del SDK lanza: null y un warn sin relanzar","fallo del import del SDK: null y un warn sin relanzar"]}
  El tercer it ('anti-vacio: el SDK cargado construye el cliente con clave y
  constantes') nace verde: lo acredita la sonda S-E1.3c.

E1-c9  fix(nutrition-ai-explainer): load SDK inside the degradation try (R11, E1.3)
  git checkout HASH_C7 -- backend-pet-tracker/src/modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.ts
  rutas: $AI/anthropic-nutrition-explainer.ts
  VERDE <AS>: {"total":28,"passed":28,"failed":0,"suiteErrors":0,"failedTitles":[]}
  tras commit: diff contra HASH_C7 -> 0; E1-A34 -> 3, E1-A35 -> 3, E1-A36 -> 3

E1-c10 test(nutrition-ai-explainer): lock non-array content as unusable (R10, E1.4)
  AS: las 5 filas de E1.4 al final de `unusable`, en el orden de su tabla.
  AP: mutacion versionada: `Array.isArray(response.content)` -> `response.content != null`
  rutas: $AI/anthropic-nutrition-explainer.spec.ts $AI/anthropic-nutrition-explainer.ts
  ROJO <AS>: {"total":33,"passed":29,"failed":4,"suiteErrors":0,"failedTitles":["degrada content array-like con exactamente un warn completo","degrada content numero con exactamente un warn completo","degrada content objeto con exactamente un warn completo","degrada content string con exactamente un warn completo"]}
  La fila 'content undefined' nace verde: la acredita S-E1.4a.

E1-c11 fix(nutrition-ai-explainer): restore array check on response content (R10, E1.4)
  git checkout HASH_C7 -- <AP desde la raiz>;  rutas: $AI/anthropic-nutrition-explainer.ts
  VERDE <AS>: {"total":33,"passed":33,"failed":0,"suiteErrors":0,"failedTitles":[]}
  tras commit: diff contra HASH_C7 -> 0

E1-c12 test(nutrition-ai-explainer): lock text-only block filter (R10, E1.5)
  AS: fila 'bloque no-text con text' en el it.each anti-vacio y fila
      'solo bloque no-text con text' (type 'texto-futuro') al final de
      `unusable` (E1.5 puntos 1 y 2).
  AP: mutacion versionada: se borra `.filter((block) => block.type === 'text')`
  rutas: $AI/anthropic-nutrition-explainer.spec.ts $AI/anthropic-nutrition-explainer.ts
  ROJO <AS>: {"total":35,"passed":33,"failed":2,"suiteErrors":0,"failedTitles":["anti-vacio: bloque no-text con text devuelve texto sin warn","degrada solo bloque no-text con text con exactamente un warn completo"]}

E1-c13 fix(nutrition-ai-explainer): restore text block filter (R10, E1.5)
  git checkout HASH_C7 -- <AP desde la raiz>;  rutas: $AI/anthropic-nutrition-explainer.ts
  VERDE <AS>: {"total":35,"passed":35,"failed":0,"suiteErrors":0,"failedTitles":[]}
  tras commit: diff contra HASH_C7 -> 0

E1-c14 test(nutrition-ai-explainer): lock null stopReason when stop_reason is missing (R10, E1.7)
  AS: fila ['sin stop_reason', { content: [{ type: 'text', text: 'Tu perro necesita...' }], usage }]
      al final de `unusable`.
  AP: mutacion versionada: `stopReason: response.stop_reason ?? null,` -> `stopReason: response.stop_reason,`
  rutas: $AI/anthropic-nutrition-explainer.spec.ts $AI/anthropic-nutrition-explainer.ts
  ROJO <AS>: {"total":36,"passed":35,"failed":1,"suiteErrors":0,"failedTitles":["degrada sin stop_reason con exactamente un warn completo"]}

E1-c15 fix(nutrition-ai-explainer): restore null default for stopReason (R10, E1.7)
  git checkout HASH_C7 -- <AP desde la raiz>;  rutas: $AI/anthropic-nutrition-explainer.ts
  VERDE <AS>: {"total":36,"passed":36,"failed":0,"suiteErrors":0,"failedTitles":[]}
  tras commit: diff contra HASH_C7 -> 0

E1-c16 test(nutrition-ai-explainer): lock String() message for non-Error rejections (R11, E1.8)
  AS: fila ['objeto', '[object Object]'] al final del it.each de R11 y la rama
      `status === 'objeto'` del cuerpo, que rechaza { message: 'no soy Error' }.
  AP: mutacion versionada:
        message: error instanceof Error ? error.message : String(error),
      ->
        message: (error as { message?: string } | null)?.message ?? String(error),
  rutas: $AI/anthropic-nutrition-explainer.spec.ts $AI/anthropic-nutrition-explainer.ts
  ROJO <AS>: {"total":37,"passed":36,"failed":1,"suiteErrors":0,"failedTitles":["degrada objeto: [object Object]"]}

E1-c17 fix(nutrition-ai-explainer): restore instanceof Error check in failure warn (R11, E1.8)
  git checkout HASH_C7 -- <AP desde la raiz>;  rutas: $AI/anthropic-nutrition-explainer.ts
  VERDE <AS>: {"total":37,"passed":37,"failed":0,"suiteErrors":0,"failedTitles":[]}
  tras commit: diff contra HASH_C7 -> 0

E1-c18 docs(nutrition-ai-explainer): #18 traceability and probes for amendment E1
  Va DESPUES de las sondas. rutas: specs/nutrition-ai-explainer/traceability.md progress/impl_nutrition-ai-explainer.md
  traceability.md: en las filas E1.1, E1.2, E1.3, E1.4, E1.5, E1.7 y E1.8,
  cambia «pendiente — ...» por los hashes (rojo y verde; E1.3 tambien el de
  E1-c7; E1.1 los dos pares c1/c2 y c3/c4) y la sonda citada por su id de
  §Sondas E1, con el formato que ya usan las filas R de la ronda 1. No toques
  ninguna otra fila. No rebasees despues de escribir hashes.

== SONDAS ==

Con el arbol en E1-c17, despues de commitearlo y ANTES de E1-c18. Ninguna se
commitea. Una cada vez. Por sonda:
  1. Aplica la mutacion en FP o AP.
  2. FORCE_COLOR=0 pnpm -C backend-pet-tracker exec jest <SPEC> --json --outputFile=/tmp/e1-<sonda>.json > /tmp/e1-<sonda>.log 2>&1; echo "exit=$?"; node /tmp/e1-check.js /tmp/e1-<sonda>.json
     [ "$(node /tmp/e1-check.js /tmp/e1-<sonda>.json)" = '<ESPERADO>' ] && echo SONDA-OK || echo SONDA-DISTINTA
  3. Pega en el impl §Sondas E1: mutacion, exit, salida del comprobador, el
     veredicto, y el Expected/Received de cada it rojo.
  4. git checkout HEAD -- <ruta de la sonda desde la raiz>
     (nunca `git checkout <otro commit> --`, ni git stash, ni rm)
  5. Limpieza; las tres deben dar lo indicado:
     git diff --quiet -- backend-pet-tracker; echo "exit=$?"                          -> exit=0
     git diff --cached --quiet; echo "exit=$?"                                        -> exit=0
     git ls-files --others --exclude-standard -- backend-pet-tracker | wc -l          -> 0
     (tasks.md pide `git status --porcelain` vacio; como el impl esta
     modificado sin commitear mientras escribes, la limpieza se acota a
     backend-pet-tracker y al indice. Es la misma comprobacion.)
Si una sonda da SONDA-DISTINTA, no ajustes ni la sonda ni el test: PARA y
anotalo en el impl §Bloqueos con el log.

Factory (SPEC <FS>, ruta FP). Mutaciones literales de tasks.md §Sondas:
  S-E1.1a  return new AnthropicNutritionExplainer(model.trim() + 'x', key.trim(), null);
     {"total":25,"passed":22,"failed":3,"suiteErrors":0,"failedTitles":["anti-vacio: development selecciona Anthropic sin invocarlo","anti-vacio: todas cumplidas seleccionan el adaptador real sin invocarlo","pasa clave y modelo recortados (E1.1)"]}
  S-E1.1b  return new AnthropicNutritionExplainer(model.trim(), key, null);
  S-E1.1c  return new AnthropicNutritionExplainer(model, key.trim(), null);
  S-E1.1d  return new AnthropicNutritionExplainer(model.replace(/^ +/, '').replace(/ +$/, ''), key.replace(/^ +/, '').replace(/ +$/, ''), null);
  S-E1.1e  return new AnthropicNutritionExplainer(model.replace(/\n+$/, ''), key.replace(/\n+$/, ''), null);
     b, c, d y e: {"total":25,"passed":24,"failed":1,"suiteErrors":0,"failedTitles":["pasa clave y modelo recortados (E1.1)"]}
  S-E1.2a  bloque `node-env-test` detras del bloque `not-enabled`
     {"total":25,"passed":24,"failed":1,"suiteErrors":0,"failedTitles":["NODE_ENV y ANTHROPIC_ENABLED fallan: gana node-env-test"]}
  S-E1.2b  bloque `key-missing` delante del bloque `not-enabled`
     {"total":25,"passed":24,"failed":1,"suiteErrors":0,"failedTitles":["ANTHROPIC_ENABLED y ANTHROPIC_API_KEY fallan: gana not-enabled"]}
  S-E1.2c  bloque `model-missing` delante del bloque `key-missing`
     {"total":25,"passed":24,"failed":1,"suiteErrors":0,"failedTitles":["ANTHROPIC_API_KEY y ANTHROPIC_MODEL fallan: gana key-missing"]}

Adaptador (SPEC <AS>, ruta AP):
  S-E1.3a  el fallo de `this.loadSdk()` se captura en el sitio y explain()
           devuelve null sin warn
     {"total":37,"passed":36,"failed":1,"suiteErrors":0,"failedTitles":["fallo del import del SDK: null y un warn sin relanzar"]}
  S-E1.3b  `new Anthropic(...)` dentro de su propio try que devuelve null sin warn
     {"total":37,"passed":36,"failed":1,"suiteErrors":0,"failedTitles":["el constructor del SDK lanza: null y un warn sin relanzar"]}
  S-E1.3c  en explain(), `await this.loadSdk()` -> `await import('@anthropic-ai/sdk')`;
           el default de loadSdk NO se toca. Se corre con
           `ANTHROPIC_BASE_URL=http://127.0.0.1:9` delante de FORCE_COLOR=0
           (red de seguridad: ningun test debe salir a la red).
     {"total":37,"passed":33,"failed":4,"suiteErrors":0,"failedTitles":["anti-vacio: el SDK cargado construye el cliente con clave y constantes","construye el cliente perezoso con clave explicita y constantes","el constructor del SDK lanza: null y un warn sin relanzar","fallo del import del SDK: null y un warn sin relanzar"]}
  S-E1.4a  `Array.isArray(response.content)` -> `response.content !== null`
     {"total":37,"passed":32,"failed":5,"suiteErrors":0,"failedTitles":["degrada content array-like con exactamente un warn completo","degrada content numero con exactamente un warn completo","degrada content objeto con exactamente un warn completo","degrada content string con exactamente un warn completo","degrada content undefined con exactamente un warn completo"]}
  S-E1.4b  `Array.isArray(response.content)` -> `typeof response.content === 'object' && response.content !== null`
     {"total":37,"passed":35,"failed":2,"suiteErrors":0,"failedTitles":["degrada content array-like con exactamente un warn completo","degrada content objeto con exactamente un warn completo"]}
  S-E1.4c  toda la expresion de `blocks` -> Array.from((response.content ?? []) as ArrayLike<{ type: string; text?: string }>)
  S-E1.4d  toda la expresion de `blocks` -> Object.values((response.content ?? {}) as Record<string, { type: string; text?: string }>)
     c y d: {"total":37,"passed":36,"failed":1,"suiteErrors":0,"failedTitles":["degrada content array-like con exactamente un warn completo"]}
  S-E1.5a  filtro -> block.type !== 'thinking'
  S-E1.5b  filtro -> block.type.startsWith('text')
  S-E1.5c  filtro -> block.type.includes('text')
     a, b y c: {"total":37,"passed":36,"failed":1,"suiteErrors":0,"failedTitles":["degrada solo bloque no-text con text con exactamente un warn completo"]}

== REGLAS CRITICAS ==

- TEST PRIMERO (C4 de CHECKPOINTS.md): cada rojo y cada verde en su commit.
  Un rojo es de ASERCION: nunca de compilacion (`suiteErrors` 0 y tsc exit=0),
  ni ReferenceError. Nunca se muta un doble de test: las mutaciones van en
  produccion (FP/AP).
- Titulos con sufijo `(nutrition-ai-explainer #18)` en todo describe nuevo.
- NINGUN TEST TOCA LA RED. Ningun test importa @anthropic-ai/sdk ni usa
  jest.mock/jest.doMock sobre el (E1.0: falla con
  ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG). Todo
  `new AnthropicNutritionExplainer(` con cliente null en un spec lleva un
  cargador de test como cuarto argumento: nunca `undefined` ni nada (nota 2;
  E1-A34..E1-A38). Clave 'clave-de-prueba', modelo 'modelo-de-prueba'.
- En los toEqual de E1.3 las opciones van con NUMEROS LITERALES
  ({ apiKey: 'clave-de-prueba', timeout: 15000, maxRetries: 0 }): usar las
  constantes importadas haria el candado tautologico.
- Si necesitas un comodin en un toEqual del backend, NO pongas `expect.any(X)`
  como valor de propiedad (rompe @typescript-eslint/no-unsafe-assignment);
  usa `expect.any(X) as unknown`.
- No escribas `claude-` en ningun fichero de backend-pet-tracker/src/ (R2).
- Imports arriba. El unico import dinamico es el default de loadSdk.
- NO son tuyos, no los toques: .env, progress/history.md,
  progress/current.md, STATUS.md, feature_list.json, design.md, tasks.md, y en
  requirements.md nada (ni frontmatter ni casillas).
- No crees recursos AWS ni corras cdk. No ejecutes R19 ni ninguna llamada real
  a la API de Anthropic.
- Si el sandbox te deniega un comando, PARA y reportalo. No lo sustituyas por
  otro que haga lo mismo con otra herramienta.
- NO hagas push, no rebasees, no abras ni edites la PR.

== FICHEROS ==

Lista cerrada. Al final:
  git diff --name-only H0E1 HEAD
debe listar EXACTAMENTE estos 6, y nada mas:
  backend-pet-tracker/src/modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.spec.ts
  backend-pet-tracker/src/modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.ts
  backend-pet-tracker/src/modules/nutrition/infrastructure/ai/nutrition-explainer.factory.spec.ts
  backend-pet-tracker/src/modules/nutrition/infrastructure/ai/nutrition-explainer.factory.ts
  progress/impl_nutrition-ai-explainer.md
  specs/nutrition-ai-explainer/traceability.md
Ni nutrition-scope.spec.ts, ni los e2e, ni package.json, ni .env*, ni docs/.
Si tsc o eslint te obligan a tocar otro fichero, PARA y reportalo.

== ENTORNO ==

- Todo con pnpm, desde la raiz con `pnpm -C backend-pet-tracker exec ...`.
- Esta ronda es SOLO unitaria. NO lances ./init.sh, ni `pnpm test:e2e`, ni
  ningun e2e: comparten LocalStack y Postgres con otras sesiones. Los corre el
  LEADER al cierre; escribe «delegado al leader» en el impl.
- La suite unitaria entera (base y final) lee Postgres en algunos specs, y la
  sesion de #157 (worktree -wt-157) usa la MISMA base. Antes de cada corrida
  de la suite entera:
    pgrep -af 'init\.sh|test:e2e|jest-e2e' | grep -v pgrep
  no debe listar nada. Si lista algo, espera a que termine o PARA y avisa al
  humano. Los specs sueltos de FS/AS/SS no tocan la base: no necesitan pgrep.
- Mide SIN pipe: `cmd > fichero 2>&1; echo "exit=$?"`. Los logs de /tmp no se
  versionan: copia al impl la salida del comprobador, el exit y los
  Expected/Received.
- El leader no toca este arbol mientras trabajas.

Al terminar (despues de E1-c18), en el impl §Final E1 y sin commitear mas:
  - las 38 anclas en HEAD contra la columna derecha;
  - git diff --name-only H0E1 HEAD contra la lista cerrada;
  - git diff c09ee51c HEAD -- backend-pet-tracker/src/modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.ts
    pegado entero (debe ser solo el cambio de E1.3);
  - E1-A25 y E1-A29 (diff neto del factory: solo la linea de D-E1-a);
  - pgrep y la suite unitaria entera con exit y el comprobador (failed 0);
  - tsc exit=0 y `pnpm -C backend-pet-tracker exec eslint` de FS, FP, AS y AP con exit=0;
  - git status --short (vacio).
Como §Final E1 se escribe despues de E1-c18, ese texto queda sin commitear:
NO lo commitees tu. Dilo en el reporte; el leader lo versiona.

Criterios de aceptacion: E1.1-E1.5, E1.7 y E1.8 de requirements.md con sus
gates, sondas y anclas. Al final, progress/impl_nutrition-ai-explainer.md tiene
§Base E1 (pwd, branch, H0E1, status, comprobaciones de BASE, /tmp/e1-check.js
creado, linea base, pgrep, anclas en H0E1), §Commits E1 (los 18, con lo del
paso 6), HASH_C4 y HASH_C7, §Sondas E1 (las 17, con su limpieza), §Final E1,
§Bloqueos (vacio si no hubo) y cualquier decision que la spec no cerrara
literalmente.
```
