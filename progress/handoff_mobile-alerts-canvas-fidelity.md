# Handoff a Codex CLI — #174 mobile-alerts-canvas-fidelity

> **Nota del leader (2026-10-15).** Spec firmada vía Notion el 2026-10-13 y
> **Enmienda E1 firmada el 2026-10-15** (commit `4ebe9e4e`). Lo que sigue manda
> sobre `tasks.md` donde discrepen.
>
> 1. **H0 no tiene hash literal**: es el commit de este handoff, de asunto exacto
>    `docs(progress): #174 handoff a Codex (H0)`. Un commit no puede contener su propio hash. B0 comprueba que HEAD
>    tiene ese asunto; K3 y K5 lo resuelven con
>    `git log -1 --format=%H --grep='^docs(progress): #174 handoff a Codex (H0)'`.
> 2. **La Enmienda E1 corrige tres cosas del texto firmado** (R8/L8, R12.2 y L1).
>    Están copiadas literal en «PASO 1», con su ancla de comprobación:
>    - E1.1 (c5, c7): las dos listas de `#173 R2.4` en `profile-canvas-fidelity.test.ts`.
>    - E1.2 (c15): el `it` de `consistency-classnames.test.ts` y su recuento.
>    - E1.3 (c3): la última línea de la expresión de longitud en `language-provider.test.tsx`.
>    - E1.4: no se mueven `bg-accent-soft`, `rounded-xl bg-accent`, `border-b-4`,
>      `border-black/25`, `text-accent-strong`, `CONTINUOUS_CORNER`, ni los guards de
>      design-drift `#87 R19` y `#134 R6/R7`.
> 3. **Precondición P1–P8** pasó el 2026-10-15 en `5fae110b`. `origin/main` es
>    `dea11875`, ancestro de HEAD: no hagas merge ni rebase.
> 4. **Medidas con `specs/mobile-alerts-canvas-fidelity/mcheck.py`** (fichero del leader, no lo edites).
>    Corre P1–P8, S1–S7 y M1–M38 de requirements §1 contra la columna `base` o
>    `cierre`. En H0 sale `exit=0` y 51 líneas.
> 5. **NO hay prettier en móvil** (`node_modules/.bin/prettier` no existe). `tasks.md`
>    dice `bunx prettier --write`: ignóralo. Formatea a mano imitando el fichero. El
>    chequeo de cada verde es `<TSLINT>`.
> 6. **Trazabilidad en UN commit al final** (K4), no tras cada commit. Todos los
>    pasos «(3) Refactor» de `tasks.md` dicen «ninguno».
> 7. **Las sondas S12.1–S12.6 corren DESPUÉS de commitear c23**, sobre un HEAD limpio,
>    y no antes como dice `tasks.md` R12 (2). Así `git checkout HEAD -- <fichero>` deja
>    el árbol exactamente como estaba.
> 8. **c3 y c5 usan un `<TSLINT-ROJO>` ensanchado**: `ui-copy-table.ts` no es fichero de
>    test, y su fila roja con `alerts.dayAgo` es un error TS2322 hasta que el catálogo
>    la tenga (c4). Solo esos dos commits aceptan errores de tsc y de lint en
>    `ui-copy-table.ts` además de en `*.test.ts(x)`.
> 9. **Los patrones `<SOLO>` y `<ALGUNO>` NO se simularon**: salen de leer los tests que
>    cada commit cambia. Si una cadena para en `<SOLO>` con un `●` de un `it` de #174 que no
>    está en la lista, PARA y reporta el `●`; no ajustes el test ni el patrón. Si el `●`
>    es de un `it` sin `#174` en el título, aplica «Flake de un it ajeno».
> 10. **ALL de la base** (leader, H0): 110 suites y 3389 tests; `bun run typecheck` con 0
>     errores y `expo lint --no-cache` vacío. BASE18 = 18 suites y 670 tests en verde.
> 11. **Dobles que copias**: `mockPopIn` de `src/screens/forgot/index.test.tsx` (R4) y
>     `mockHomeEntrance` de `src/screens/login/index.test.tsx` (R10). Las anclas de H0 los
>     localizan por contenido.
> 12. **El leader no toca `docs/` ni `specs/` mientras trabajas**; `<LIMPIO>` lo exige.
> 13. **R13 (prueba de humo en dev build de Android) no la corres**: es del humano.
>     La casilla de la enmienda se escribe SIN marcar en los 6 ficheros (carta + 5
>     specs): `- [ ] Enmienda #174 aprobada por humano`.
> 14. **Skills (catálogo de Codex)**: `building-native-ui`, `appllama-app-design-skill` y
>     `animate-expo`. No existen `expo-overview`, `expo-animation` ni `expo-router`.

```text
Worktree: /home/claude/sites/Pet-Tracker-wt-174   <- PRIMERA LINEA. Trabaja AQUI y en ningun otro sitio
Branch:   feature/174-mobile-alerts-canvas-fidelity   (H0 = el commit de asunto `docs(progress): #174 handoff a Codex (H0)`; anotalo en el impl)
Confirma `pwd` y `git branch --show-current` antes de tocar nada (B0).

== QUE HACES ==
Implementas #174: Alertas fiel al canvas (tokens, copy de dias, titulo en el contenido, contador con PopIn, metricas,
secciones, fila con disco, ack compacto, pildoras, entrada escalonada) y las enmiendas a la carta y a 5 specs.
Son 23 commits c1-c23, test-primero. Cada R tiene su commit ROJO (solo tests/candados) y despues su commit VERDE
(solo implementacion), nunca mezclados en el mismo commit. Excepciones declaradas:
  - c22 (R11 verde) es documentacion (docs/ y specs/).
  - c23 (R12) nace verde; su rojo lo demuestran las sondas S12.1-S12.6, que van DESPUES del commit.
Guion: specs/mobile-alerts-canvas-fidelity/requirements.md + design.md + tasks.md. Leelos ENTEROS antes de empezar.
"Rn (k)" en tasks.md = seccion Rn, paso k. Rige docs/ui-guidelines.md.
Este handoff fija comandos, cifras, orden y anclas; si discrepa de tasks.md, manda este handoff.
Por commit:
  - rojo:  paso 1 a mano, escribe los tests de "Rn (1)"; paso 2, lanza la cadena.
  - verde: paso 1 a mano, implementa "Rn (2)"; paso 2, lanza la cadena.
  - Cada cadena es UNA linea que acaba en `git commit`. Las lineas `# -- ... --` son cabeceras: NO se ejecutan.
EJECUTOR (paso 2 de cada cN y de cada sonda S12.n): NO copies la cadena; extraela del fichero y ejecutala asi,
cambiando solo el numero (c1 ... c23):
  cd /home/claude/sites/Pet-Tracker-wt-174/mobile-pet-tracker && bash -c "$(sed -n '/^# -- c1 (paso 2) cadena --$/{n;p;q}' ../progress/handoff_mobile-alerts-canvas-fidelity.md)"; echo "cadena=$?"
  cd /home/claude/sites/Pet-Tracker-wt-174/mobile-pet-tracker && bash -c "$(sed -n '/^# -- S12.1 sonda sobre el HEAD de c23 (NO se commitea) --$/{n;p;q}' ../progress/handoff_mobile-alerts-canvas-fidelity.md)"
  cadena=0 = commit hecho; cualquier otro valor = un eslabon fallo (ver Reintento / PARA).
  El resto de lineas (CIERRE) copialas a mano tal cual, byte a byte, sin sustituir nada; lo que va tras `->` en la
  linea siguiente es la salida esperada, no parte del comando.

Skills (catalogo de Codex; los nombres de Claude NO existen en tu plugin y pedirlos da silencio):
  - building-native-ui            (plugin expo@openai-curated)
  - appllama-app-design-skill     (.agents/skills/; obligatoria por docs/ui-guidelines.md §Skills)
  - animate-expo                  (.agents/skills/; R10 es una entrada escalonada con HomeEntrance y R4 un PopIn)
  Si design.md o la carta nombran `expo-animation`, `expo-native-ui` o `expo-ui`, son nombres de Claude.
  En el impl, di cuales cargaste de verdad.

Macros (SOLO para leer: todas las lineas de abajo ya las traen expandidas; NO las sustituyas tu):
  CD = cd /home/claude/sites/Pet-Tracker-wt-174/mobile-pet-tracker
  <LIMPIO> = git diff --quiet -- . ../docs ../specs && test -z "$(git ls-files --others --exclude-standard -- . ../docs ../specs)"
  <TSLINT> = test ! -e .expo/types/router.d.ts && bun run typecheck && bunx expo lint --no-cache > /tmp/174-lint.txt 2>&1 && test ! -s /tmp/174-lint.txt
  <TSLINT-ROJO> = test ! -e .expo/types/router.d.ts && { bun run typecheck > /tmp/174-tsc.txt 2>&1; true; } && test "$(grep 'error TS' /tmp/174-tsc.txt | grep -cvE '^src/[^(]+\.test\.tsx?\(')" = 0 && { bunx expo lint --no-cache > /tmp/174-lint.txt 2>&1; true; } && ! grep -qF 'Failed to run' /tmp/174-lint.txt && test "$(grep -E '^/' /tmp/174-lint.txt | grep -cvE '\.test\.tsx?$')" = 0
      (en un rojo, tsc y lint pueden fallar SOLO en ficheros de test: la prop o la clave aun no existe)
      c3 y c5 aceptan ademas errores en src/__tests__/ui-copy-table.ts (nota 8 del leader)
  <ROJO L>        = grep -qE '^Tests: +[0-9]+ failed, ' L
  <SOLO L 're'>   = test "$(grep -E '^  ● ' L | grep -vxF '  ● Console' | grep -cvE '^  ● (re)\b')" = 0
  <ALGUNO L n>    = grep -E '^  ● ' L | grep -qE '#174 Rn\b'
  <SINCRASH L>    = ! grep -qE "Test suite failed to run|ReferenceError:|SyntaxError:|Cannot find module|reading 'canceled'|Exceeded timeout" L
  <VERDE L S>     = grep -qE '^Test Suites: +S passed, S total$' L && grep -qE '^Tests: +([0-9]+) passed, \1 total$' L
  <IT F N>        = test "$(grep -cE '^\s*it(\.each)?[(<]' F)" = N
  <BASE18> = FORCE_COLOR=0 bunx jest --testTimeout=30000 --runTestsByPath src/__tests__/account-screens-polish.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/design-drift.test.ts src/__tests__/hero-header-amendments.test.ts src/__tests__/legibility-classnames.test.ts src/__tests__/profile-canvas-fidelity.test.ts src/__tests__/tab-headers-canvas.test.ts src/__tests__/ui-language.test.ts src/app/__tests__/alert-detail.navigation.test.tsx src/app/__tests__/detail-stack.test.tsx src/app/__tests__/layout.test.tsx src/app/__tests__/reminders-alerts-stack.navigation.test.tsx src/components/__tests__/empty-state.test.tsx src/providers/__tests__/language-provider.test.tsx src/screens/alert-detail/index.test.tsx src/screens/alerts/index.test.tsx src/theme/__tests__/global-css.test.ts src/theme/__tests__/motion.test.ts
  <BASE19> = <BASE18> con src/__tests__/alerts-canvas-fidelity.test.ts añadido al final de la lista (desde c21)
  El primer segmento de la linea `●` es el describe de nivel superior: <SOLO> lo compara con `^  ● (re)\b`.
  `\b` no casa despues de `)`: los patrones llevan el id sin el `)` de cierre.

Error de invocacion: si un comando falla por directorio (ENOENT de package.json, "Cannot find module" de
bun/jest en vez de un test, "No tests found"), repite con el CD literal delante y NO toques codigo.
Jest siempre con FORCE_COLOR=0 y --runTestsByPath. Tras crear un fichero nuevo, ENOENT del fichero tambien es de invocacion.

Reintento (UNA vez por linea; anotalo en Desviaciones del impl como carga):
  - Cuando: una cadena para en <SINCRASH> por `reading 'canceled'` o `Exceeded timeout`, o en <VERDE> y el
    log contiene uno de esos dos textos, o para en <TSLINT>/<TSLINT-ROJO> con `Failed to run` en /tmp/174-lint.txt.
  - Que haces:
    cd /home/claude/sites/Pet-Tracker-wt-174/mobile-pet-tracker && for i in $(seq 1 90); do pgrep -f 'node_modules/(\.bin/jest|jest-worker)|[i]nit\.sh' > /dev/null || break; sleep 60; done; echo fin-espera
    y relanza la linea ENTERA tal cual. Las cadenas son idempotentes: si paro antes del commit, nada quedo commiteado.
  - Si se repite, PARA.
Flake de un it ajeno:
  - Cuando: una cadena para en <VERDE> (verde) o en <SOLO> (rojo), y TODOS los `●` que sobran (sin `  ● Console`)
    son de its SIN `#174` en el titulo.
  - Que haces: corre el fichero de ese `●` solo, dos veces:
    cd /home/claude/sites/Pet-Tracker-wt-174/mobile-pet-tracker && for i in 1 2; do FORCE_COLOR=0 bunx jest --testTimeout=30000 --runTestsByPath FICHERO > /tmp/174-flake-$i.txt 2>&1; grep -E '^Tests:' /tmp/174-flake-$i.txt; grep -F 'TITULO_DEL_IT' /tmp/174-flake-$i.txt | grep -cF '●'; done
    (FICHERO y TITULO_DEL_IT los escribes tu a mano: ruta entre comillas simples y el texto del it tras `›`).
    La cuenta es de lineas con `●`: la linea `✓ TITULO` de un it que pasa no cuenta.
  - Si el it ajeno no falla en ninguna de las dos (cuenta 0 las dos veces), es flake: corre el bucle de espera de
    arriba y relanza la cadena entera UNA vez con el ejecutor y anotalo en Desviaciones con las dos lineas Tests:.
  - Si el it ajeno falla solo, o la cadena relanzada vuelve a parar, PARA.

NO lances ./init.sh en ningun momento, aunque AGENTS.md lo pida: lo corre el leader.

== BASE (H0) ==
# -- B0 estado --
cd /home/claude/sites/Pet-Tracker-wt-174/mobile-pet-tracker && pwd && git branch --show-current && git rev-parse HEAD && git log -1 --format=%s && git status --short
   -> /home/claude/sites/Pet-Tracker-wt-174/mobile-pet-tracker ; feature/174-mobile-alerts-canvas-fidelity ; <H0> ; docs(progress): #174 handoff a Codex (H0) ; (sin lineas de status)   (pega las salidas al principio del impl)
cd /home/claude/sites/Pet-Tracker-wt-174/mobile-pet-tracker && git merge-base --is-ancestor dea11875 HEAD; echo "exit=$?"
   -> exit=0
cd /home/claude/sites/Pet-Tracker-wt-174/mobile-pet-tracker && test ! -e .expo/types/router.d.ts; echo "exit=$?"
   -> exit=0   (si exit=1, PARA: lo borra el humano; NUNCA rm -f)
# -- B1 BASE18 --
cd /home/claude/sites/Pet-Tracker-wt-174/mobile-pet-tracker && { FORCE_COLOR=0 bunx jest --testTimeout=30000 --runTestsByPath src/__tests__/account-screens-polish.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/design-drift.test.ts src/__tests__/hero-header-amendments.test.ts src/__tests__/legibility-classnames.test.ts src/__tests__/profile-canvas-fidelity.test.ts src/__tests__/tab-headers-canvas.test.ts src/__tests__/ui-language.test.ts src/app/__tests__/alert-detail.navigation.test.tsx src/app/__tests__/detail-stack.test.tsx src/app/__tests__/layout.test.tsx src/app/__tests__/reminders-alerts-stack.navigation.test.tsx src/components/__tests__/empty-state.test.tsx src/providers/__tests__/language-provider.test.tsx src/screens/alert-detail/index.test.tsx src/screens/alerts/index.test.tsx src/theme/__tests__/global-css.test.ts src/theme/__tests__/motion.test.ts > /tmp/174-b1.txt 2>&1; echo "exit=$?"; } && grep -E '^(Test Suites|Tests):' /tmp/174-b1.txt
   -> exit=0 ; Test Suites: 18 passed, 18 total ; Tests:       670 passed, 670 total
cd /home/claude/sites/Pet-Tracker-wt-174/mobile-pet-tracker && test ! -e .expo/types/router.d.ts && bun run typecheck && bunx expo lint --no-cache > /tmp/174-lint.txt 2>&1 && test ! -s /tmp/174-lint.txt; echo "exit=$?"
   -> exit=0
# -- B2 medidas P1-P8, S1-S7 y M1-M36 --
cd /home/claude/sites/Pet-Tracker-wt-174/mobile-pet-tracker && python3 ../specs/mobile-alerts-canvas-fidelity/mcheck.py base > /tmp/174-m-h0.txt; echo "exit=$?"; grep -c . /tmp/174-m-h0.txt; grep DIFF /tmp/174-m-h0.txt
   -> exit=0 ; 51   (sin lineas DIFF. Pega el fichero en el impl)
NO corras el ALL de la base: lo midio el leader (nota 10).

== ANCLAS (H0, desde mobile-pet-tracker/; ejecutalas todas; si una no da su valor, PARA y reporta la tabla) ==
test -e node_modules/.bin/prettier; echo $?   -> 1
test -e ../.agents/skills/appllama-app-design-skill/SKILL.md; echo $?   -> 0
test -e ../.agents/skills/animate-expo/SKILL.md; echo $?   -> 0
test -e src/__tests__/alerts-canvas-fidelity.test.ts; echo $?   -> 1
grep -cF -- '## Enmienda #173 — Perfil fiel al canvas' ../docs/ui-guidelines.md   -> 1
grep -c '^## Enmienda #17[4-9]' ../docs/ui-guidelines.md   -> 0
grep -c '^### §2\.29 ' ../specs/mobile-ui-language/design.md   -> 1
grep -c '^### §2\.30 ' ../specs/mobile-ui-language/design.md   -> 0
grep -cF -- '- 4 + 3, // #173 R13' src/providers/__tests__/language-provider.test.tsx   -> 1
grep -cF 'expect(count(/border-lip-gray/g)).toBe(4 + 1 + 1); // #170 R16; #171 R14' src/__tests__/consistency-classnames.test.ts   -> 1
grep -cF 'const match = tag.match(/testID=(?:"([^"]+)"|\{([^}]+)\})/); // #171 R14: testID dinámico' src/__tests__/consistency-classnames.test.ts   -> 1
grep -cF "'secondary.testID', // #171 R14" src/__tests__/consistency-classnames.test.ts   -> 1
grep -cF "expect(filesMatching(/\btext-26\b/)).toEqual(['screens/profile/index.tsx']);" src/__tests__/profile-canvas-fidelity.test.ts   -> 1
grep -cF "it('limita text-13 a Perfil y a las pantallas de cuenta de #172 (E8)'" src/__tests__/profile-canvas-fidelity.test.ts   -> 1
grep -cF "const mockPopIn = jest.fn<void, [import('react-native').ViewProps]>();" src/screens/forgot/index.test.tsx   -> 1
grep -cF "const mockHomeEntrance = jest.fn<void, [import('react-native').ViewProps & { index: number }]>();" src/screens/login/index.test.tsx   -> 1
git merge-base --is-ancestor dea11875 HEAD; echo "exit=$?"   -> exit=0
# its estaticos en la base (un it.each cuenta 1)
test "$(grep -cE '^\s*it(\.each)?[(<]' src/screens/alerts/index.test.tsx)" = 58 && test "$(grep -cE '^\s*it(\.each)?[(<]' src/theme/__tests__/global-css.test.ts)" = 35 && test "$(grep -cE '^\s*it(\.each)?[(<]' src/providers/__tests__/language-provider.test.tsx)" = 22 && test "$(grep -cE '^\s*it(\.each)?[(<]' src/app/__tests__/layout.test.tsx)" = 21 && test "$(grep -cE '^\s*it(\.each)?[(<]' src/__tests__/consistency-classnames.test.ts)" = 35 && test "$(grep -cE '^\s*it(\.each)?[(<]' src/__tests__/profile-canvas-fidelity.test.ts)" = 15 && test "$(grep -cE '^\s*it(\.each)?[(<]' src/__tests__/ui-language.test.ts)" = 28 && echo its-ok   -> its-ok
== FIN ANCLAS ==

== TITULOS (describe e it fijados por la spec; literales) ==
R1   describe '#174 R1: tokens del canvas de Alertas' con it 'declara los tokens que usa Alertas' y
     'declara cada token una sola vez'   (global-css)
R2   it 'formatea ahora, minutos, horas y días por la clave correspondiente' + sufijo ' (enmendado por #174 R2)' (A, bajo '#78 R6')
     describe '#174 R2: días con palabra completa' (language-provider)
R3   describe '#174 R3: el título vive en el contenido' (A; sustituye al '#114 R5' anidado en '#78 R4')
R4   it 'pinta el contador junto al título con su anatomía (enmendado por #174 R4)' (A; reescribe el de '#170 R4')
R5   it del '#114 R6' con sufijo '(#114 R6, enmendado por #174 R5)'  (A, bajo '#78 R4')
R6   it 'envuelve cada cabecera con la primera fila de su sección en un View gap-3 (enmendado por #174 R6)' (A, '#170 R3')
R7   sufijo ' (enmendado por #174 R7)' en los its de '#78 R6' (it.each), '#100 R6' y '#170 R5'  (A)
R8   sufijo ' (enmendado por #174 R8)' APILADO tras el de R7 en esos its y en 'alterna…'  (A);
     it '#174 R8: el ack de fila es el secundario compacto' (consistency, describe '#166 R3')
R9   its 'alterna el tercer hijo entre ack y la píldora traducida…' de A (ya con el sufijo de R8; sin renombre nuevo)
R10  describe '#174 R10: entrada escalonada de las cinco primeras filas' (A)
R11  describes '#174 R11: enmiendas' y '#174 R11: la carta declara los cambios' (F, fichero nuevo)
R12  describes '#174 R12: inventarios' y '#174 R12: grep-limpio' (F)
Todo describe o it reescrito "(enmendado por #174 Rn)" conserva el id viejo delante: las listas <SOLO> lo cuentan asi.

== CUENTAS ==
BASE18 en H0: 18 suites, 670 tests. Ni las lineas Tests: de los rojos ni las de los verdes estan fijadas, porque no
se simularon. Cada verde exige todo en verde con <VERDE>, y K2 fija el total final K (BASE19, 19 suites).
ALL en H0: 110 suites, 3389 tests. En K3: 111 suites, 3389 + (K - 670) tests.

== PASO 1 (lo que escribes a mano en cada commit; los detalles estan en requirements/design/tasks) ==
c1  G: describe '#174 R1: tokens del canvas de Alertas' (R1 Tests). --text-15 YA existe en H0 (S1=1): el rojo viene de
    --radius-10, --tracking-title y --tracking-caps. Solo G.
c2  src/theme/global.css: los literales de R1.1 (no dupliques --text-15). M1-M4 = 1 y P2, P3 = 1.
c3  A, LP, ui-copy-table. En LP aplica E1.3 a mano: la ultima linea de la expresion de longitud pierde la coma y la
    cierra la linea nueva. Antes -> Despues:
        - 4 + 3, // #173 R13            ->        - 4 + 3 // #173 R13
                                                  + 1, // #174 R2
    Comprueba (desde mobile-pet-tracker/), deben dar 1, 0 y 1:
      grep -cF -- '- 4 + 3 // #173 R13' src/providers/__tests__/language-provider.test.tsx
      grep -cF -- '- 4 + 3, // #173 R13' src/providers/__tests__/language-provider.test.tsx
      grep -cF -- '+ 1, // #174 R2' src/providers/__tests__/language-provider.test.tsx
    ui-copy-table (L3): en R12_ALERTS, { file: 'src/screens/alerts/index.tsx', key: 'alerts.dayAgo' }, // #174 R2
c4  catalogo (alerts.dayAgo y alerts.daysAgo), formateador (rama days === 1), design.md de ui-language (§2.30 y la fila
    daysAgo con ' · valor cambiado por #174 (R2)'). M5-M9 y M27.
c5  A, L, ui-copy-table, PF. En PF aplica E1.1 (text-26) a mano; Antes -> Despues:
        expect(filesMatching(/\btext-26\b/)).toEqual(['screens/profile/index.tsx']);
    ->
        expect(filesMatching(/\btext-26\b/)).toEqual([
          'screens/alerts/index.tsx', // #174 R3
          'screens/profile/index.tsx',
        ]);
    Comprueba (1): grep -cF "'screens/alerts/index.tsx', // #174 R3" src/__tests__/profile-canvas-fidelity.test.ts
    ui-copy-table: la fila de alerts.title pasa de src/app/_layout.tsx a src/screens/alerts/index.tsx (L5).
c6  _layout.tsx (options title ''), ListHeaderComponent en todos los estados, design.md de ui-language (L7). M10-M12.
c7  A (con mockPopIn), PF. En PF aplica E1.1 (text-13): anade 'screens/alerts/index.tsx' ENTRE 'components/form-error.tsx' y
    'screens/forgot/index.tsx', con el comentario `// #174 R4, R6`. R6 NO vuelve a editar esta lista.
    Comprueba (1): grep -cF "'screens/alerts/index.tsx', // #174 R4, R6" src/__tests__/profile-canvas-fidelity.test.ts
c8  contador con PopIn. M13 y M25.
c9  A. El it del '#114 R6' espera { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 48, gap: 12 }.
c10 contentContainerStyle. M14 y M15.
c11 A. c12 secciones (wrapper gap-3, cabecera 13 extrabold con tracking-caps). M16.
c13 A (tres its con sufijo R7; columna disc bg-category-rose / bg-category-amber / bg-default).
c14 alert-meta.ts (disc) y la fila. M17-M21.
c15 A y CC. En CC aplica E1.2 a mano, dentro del it 'inventaría los cinco secundarios neutros de toda la app' (titulo SIN cambios):
      1) la linea del regex pasa a (con la plantilla `...` como segunda alternativa):
         const match = tag.match(/testID=(?:"([^"]+)"|\{`([^`]+)`\}|\{([^}]+)\})/); // #171 R14: testID dinámico; #174 R8: plantilla
      2) el retorno pasa a: return neutral ? [match?.[1] ?? match?.[2] ?? match?.[3]] : [];
      3) la lista esperada gana PRIMERA la linea '${rowId}-ack', // #174 R8 y conserva 'secondary.testID', // #171 R14
      4) expect(count(/border-lip-gray/g)).toBe(4 + 1 + 1 + 1); // #170 R16; #171 R14; #174 R8
         (la linea de border-b-6 NO cambia: el ack usa border-b-5)
      5) it nuevo en el mismo describe '#166 R3': '#174 R8: el ack de fila es el secundario compacto'
    Comprueba (1, 1, 1, 1): grep -cF 'return neutral ? [match?.[1] ?? match?.[2] ?? match?.[3]] : [];' CC
      grep -cF '${rowId}-ack' CC ; grep -cF 'toBe(4 + 1 + 1 + 1); // #170 R16; #171 R14; #174 R8' CC
      grep -cF "it('#174 R8: el ack de fila es el secundario compacto'" CC
c16 ack compacto. M22.
c17 A: un caso por rama (acked y closed) con className exacto. El rojo viene de que la pildora acked aun lleva text-2xs.
c18 pildoras. M23.
c19 A: describe '#174 R10' con mockHomeEntrance y 6 alertas e0...e5.
c20 HomeEntrance. M24.
c21 F nace aqui: patron de src/__tests__/tab-headers-canvas.test.ts; describes '#174 R11: enmiendas' y
    '#174 R11: la carta declara los cambios'. Rojo: la carta y las specs aun no tienen la enmienda.
c22 bloques canonicos de design.md §4 en la carta y en las 5 specs, anclas y textos (M26, M28-M36). Casilla SIN marcar.
c23 F: describes '#174 R12: inventarios' y '#174 R12: grep-limpio'. Nace verde: cierre completo de mcheck (M37 y M38 incluidos).
Las anclas de CC de c15 usan CC = src/__tests__/consistency-classnames.test.ts.

== COMMITS ==
# -- c1 R1 rojo (paso 1, a mano): escribe SOLO los tests/candados de "R1 (1)" de tasks.md (ningun fichero de produccion) --
# -- c1 (paso 2) cadena --
cd /home/claude/sites/Pet-Tracker-wt-174/mobile-pet-tracker && { FORCE_COLOR=0 bunx jest --testTimeout=30000 --runTestsByPath src/__tests__/account-screens-polish.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/design-drift.test.ts src/__tests__/hero-header-amendments.test.ts src/__tests__/legibility-classnames.test.ts src/__tests__/profile-canvas-fidelity.test.ts src/__tests__/tab-headers-canvas.test.ts src/__tests__/ui-language.test.ts src/app/__tests__/alert-detail.navigation.test.tsx src/app/__tests__/detail-stack.test.tsx src/app/__tests__/layout.test.tsx src/app/__tests__/reminders-alerts-stack.navigation.test.tsx src/components/__tests__/empty-state.test.tsx src/providers/__tests__/language-provider.test.tsx src/screens/alert-detail/index.test.tsx src/screens/alerts/index.test.tsx src/theme/__tests__/global-css.test.ts src/theme/__tests__/motion.test.ts > /tmp/174-c1.txt 2>&1; echo "exit=$?"; } && grep -qE '^Tests: +[0-9]+ failed, ' /tmp/174-c1.txt && test "$(grep -E '^  ● ' /tmp/174-c1.txt | grep -vxF '  ● Console' | grep -cvE '^  ● (#174 R1)\b')" = 0 && grep -E '^  ● ' /tmp/174-c1.txt | grep -qE '#174 R1\b' && ! grep -qE "Test suite failed to run|ReferenceError:|SyntaxError:|Cannot find module|reading 'canceled'|Exceeded timeout" /tmp/174-c1.txt && test ! -e .expo/types/router.d.ts && { bun run typecheck > /tmp/174-tsc.txt 2>&1; true; } && test "$(grep 'error TS' /tmp/174-tsc.txt | grep -cvE '^src/[^(]+\.test\.tsx?\(')" = 0 && { bunx expo lint --no-cache > /tmp/174-lint.txt 2>&1; true; } && ! grep -qF 'Failed to run' /tmp/174-lint.txt && test "$(grep -E '^/' /tmp/174-lint.txt | grep -cvE '\.test\.tsx?$')" = 0 && git add src/theme/__tests__/global-css.test.ts && test "$(git diff --cached --no-renames --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/theme/__tests__/global-css.test.ts ' && git diff --quiet -- . ../docs ../specs && test -z "$(git ls-files --others --exclude-standard -- . ../docs ../specs)" && git commit -m 'test(mobile): #174 R1 rojo — tokens text-15, radius-10 y tracking'
# -- c2 R1 verde (paso 1, a mano): implementa "R1 (2)" de tasks.md (ningun test nuevo) --
# -- c2 (paso 2) cadena --
cd /home/claude/sites/Pet-Tracker-wt-174/mobile-pet-tracker && python3 ../specs/mobile-alerts-canvas-fidelity/mcheck.py cierre M1 M2 M3 M4 P2 P3 && { FORCE_COLOR=0 bunx jest --testTimeout=30000 --runTestsByPath src/__tests__/account-screens-polish.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/design-drift.test.ts src/__tests__/hero-header-amendments.test.ts src/__tests__/legibility-classnames.test.ts src/__tests__/profile-canvas-fidelity.test.ts src/__tests__/tab-headers-canvas.test.ts src/__tests__/ui-language.test.ts src/app/__tests__/alert-detail.navigation.test.tsx src/app/__tests__/detail-stack.test.tsx src/app/__tests__/layout.test.tsx src/app/__tests__/reminders-alerts-stack.navigation.test.tsx src/components/__tests__/empty-state.test.tsx src/providers/__tests__/language-provider.test.tsx src/screens/alert-detail/index.test.tsx src/screens/alerts/index.test.tsx src/theme/__tests__/global-css.test.ts src/theme/__tests__/motion.test.ts > /tmp/174-c2.txt 2>&1; echo "exit=$?"; } && grep -qE '^Test Suites: +18 passed, 18 total$' /tmp/174-c2.txt && grep -qE '^Tests: +([0-9]+) passed, \1 total$' /tmp/174-c2.txt && test ! -e .expo/types/router.d.ts && bun run typecheck && bunx expo lint --no-cache > /tmp/174-lint.txt 2>&1 && test ! -s /tmp/174-lint.txt && git add src/theme/global.css && test "$(git diff --cached --no-renames --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/theme/global.css ' && git diff --quiet -- . ../docs ../specs && test -z "$(git ls-files --others --exclude-standard -- . ../docs ../specs)" && git commit -m 'feat(mobile): #174 R1 tokens del canvas de Alertas'
# -- c3 R2 rojo (paso 1, a mano): escribe SOLO los tests/candados de "R2 (1)" de tasks.md (ningun fichero de produccion); incluye la correccion E1.3 de LP (ver PASO 1) --
# -- c3 (paso 2) cadena --
cd /home/claude/sites/Pet-Tracker-wt-174/mobile-pet-tracker && { FORCE_COLOR=0 bunx jest --testTimeout=30000 --runTestsByPath src/__tests__/account-screens-polish.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/design-drift.test.ts src/__tests__/hero-header-amendments.test.ts src/__tests__/legibility-classnames.test.ts src/__tests__/profile-canvas-fidelity.test.ts src/__tests__/tab-headers-canvas.test.ts src/__tests__/ui-language.test.ts src/app/__tests__/alert-detail.navigation.test.tsx src/app/__tests__/detail-stack.test.tsx src/app/__tests__/layout.test.tsx src/app/__tests__/reminders-alerts-stack.navigation.test.tsx src/components/__tests__/empty-state.test.tsx src/providers/__tests__/language-provider.test.tsx src/screens/alert-detail/index.test.tsx src/screens/alerts/index.test.tsx src/theme/__tests__/global-css.test.ts src/theme/__tests__/motion.test.ts > /tmp/174-c3.txt 2>&1; echo "exit=$?"; } && grep -qE '^Tests: +[0-9]+ failed, ' /tmp/174-c3.txt && test "$(grep -E '^  ● ' /tmp/174-c3.txt | grep -vxF '  ● Console' | grep -cvE '^  ● (#78 R6|#174 R2|#65 R12|#78 R3|#78 R12|#65 R18)\b')" = 0 && grep -E '^  ● ' /tmp/174-c3.txt | grep -qE '#174 R2\b' && ! grep -qE "Test suite failed to run|ReferenceError:|SyntaxError:|Cannot find module|reading 'canceled'|Exceeded timeout" /tmp/174-c3.txt && test ! -e .expo/types/router.d.ts && { bun run typecheck > /tmp/174-tsc.txt 2>&1; true; } && test "$(grep 'error TS' /tmp/174-tsc.txt | grep -cvE '^src/(__tests__/ui-copy-table\.ts|[^(]+\.test\.tsx?)\(')" = 0 && { bunx expo lint --no-cache > /tmp/174-lint.txt 2>&1; true; } && ! grep -qF 'Failed to run' /tmp/174-lint.txt && test "$(grep -E '^/' /tmp/174-lint.txt | grep -cvE '(\.test\.tsx?|ui-copy-table\.ts)$')" = 0 && git add src/screens/alerts/index.test.tsx src/providers/__tests__/language-provider.test.tsx src/__tests__/ui-copy-table.ts && test "$(git diff --cached --no-renames --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/__tests__/ui-copy-table.ts mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx mobile-pet-tracker/src/screens/alerts/index.test.tsx ' && git diff --quiet -- . ../docs ../specs && test -z "$(git ls-files --others --exclude-standard -- . ../docs ../specs)" && git commit -m 'test(mobile): #174 R2 rojo — Hace 1 día y días con palabra completa'
# -- c4 R2 verde (paso 1, a mano): implementa "R2 (2)" de tasks.md (ningun test nuevo) --
# -- c4 (paso 2) cadena --
cd /home/claude/sites/Pet-Tracker-wt-174/mobile-pet-tracker && python3 ../specs/mobile-alerts-canvas-fidelity/mcheck.py cierre M5 M6 M7 M8 M9 M27 && { FORCE_COLOR=0 bunx jest --testTimeout=30000 --runTestsByPath src/__tests__/account-screens-polish.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/design-drift.test.ts src/__tests__/hero-header-amendments.test.ts src/__tests__/legibility-classnames.test.ts src/__tests__/profile-canvas-fidelity.test.ts src/__tests__/tab-headers-canvas.test.ts src/__tests__/ui-language.test.ts src/app/__tests__/alert-detail.navigation.test.tsx src/app/__tests__/detail-stack.test.tsx src/app/__tests__/layout.test.tsx src/app/__tests__/reminders-alerts-stack.navigation.test.tsx src/components/__tests__/empty-state.test.tsx src/providers/__tests__/language-provider.test.tsx src/screens/alert-detail/index.test.tsx src/screens/alerts/index.test.tsx src/theme/__tests__/global-css.test.ts src/theme/__tests__/motion.test.ts > /tmp/174-c4.txt 2>&1; echo "exit=$?"; } && grep -qE '^Test Suites: +18 passed, 18 total$' /tmp/174-c4.txt && grep -qE '^Tests: +([0-9]+) passed, \1 total$' /tmp/174-c4.txt && test ! -e .expo/types/router.d.ts && bun run typecheck && bunx expo lint --no-cache > /tmp/174-lint.txt 2>&1 && test ! -s /tmp/174-lint.txt && git add src/i18n/catalog.ts src/screens/alerts/index.tsx ../specs/mobile-ui-language/design.md && test "$(git diff --cached --no-renames --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/i18n/catalog.ts mobile-pet-tracker/src/screens/alerts/index.tsx specs/mobile-ui-language/design.md ' && git diff --quiet -- . ../docs ../specs && test -z "$(git ls-files --others --exclude-standard -- . ../docs ../specs)" && git commit -m 'feat(mobile): #174 R2 alerts.dayAgo y alerts.daysAgo con palabra completa'
# -- c5 R3 rojo (paso 1, a mano): escribe SOLO los tests/candados de "R3 (1)" de tasks.md (ningun fichero de produccion); incluye la correccion E1.1 (text-26) de PF --
# -- c5 (paso 2) cadena --
cd /home/claude/sites/Pet-Tracker-wt-174/mobile-pet-tracker && { FORCE_COLOR=0 bunx jest --testTimeout=30000 --runTestsByPath src/__tests__/account-screens-polish.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/design-drift.test.ts src/__tests__/hero-header-amendments.test.ts src/__tests__/legibility-classnames.test.ts src/__tests__/profile-canvas-fidelity.test.ts src/__tests__/tab-headers-canvas.test.ts src/__tests__/ui-language.test.ts src/app/__tests__/alert-detail.navigation.test.tsx src/app/__tests__/detail-stack.test.tsx src/app/__tests__/layout.test.tsx src/app/__tests__/reminders-alerts-stack.navigation.test.tsx src/components/__tests__/empty-state.test.tsx src/providers/__tests__/language-provider.test.tsx src/screens/alert-detail/index.test.tsx src/screens/alerts/index.test.tsx src/theme/__tests__/global-css.test.ts src/theme/__tests__/motion.test.ts > /tmp/174-c5.txt 2>&1; echo "exit=$?"; } && grep -qE '^Tests: +[0-9]+ failed, ' /tmp/174-c5.txt && test "$(grep -E '^  ● ' /tmp/174-c5.txt | grep -vxF '  ● Console' | grep -cvE '^  ● (#78 R4|#78 R8|#114 R4|#173 R2\.4|#78 R12|#65 R18|#174 R3)\b')" = 0 && grep -E '^  ● ' /tmp/174-c5.txt | grep -qE '#174 R3\b' && ! grep -qE "Test suite failed to run|ReferenceError:|SyntaxError:|Cannot find module|reading 'canceled'|Exceeded timeout" /tmp/174-c5.txt && test ! -e .expo/types/router.d.ts && { bun run typecheck > /tmp/174-tsc.txt 2>&1; true; } && test "$(grep 'error TS' /tmp/174-tsc.txt | grep -cvE '^src/(__tests__/ui-copy-table\.ts|[^(]+\.test\.tsx?)\(')" = 0 && { bunx expo lint --no-cache > /tmp/174-lint.txt 2>&1; true; } && ! grep -qF 'Failed to run' /tmp/174-lint.txt && test "$(grep -E '^/' /tmp/174-lint.txt | grep -cvE '(\.test\.tsx?|ui-copy-table\.ts)$')" = 0 && git add src/screens/alerts/index.test.tsx src/app/__tests__/layout.test.tsx src/__tests__/ui-copy-table.ts src/__tests__/profile-canvas-fidelity.test.ts && test "$(git diff --cached --no-renames --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/__tests__/profile-canvas-fidelity.test.ts mobile-pet-tracker/src/__tests__/ui-copy-table.ts mobile-pet-tracker/src/app/__tests__/layout.test.tsx mobile-pet-tracker/src/screens/alerts/index.test.tsx ' && git diff --quiet -- . ../docs ../specs && test -z "$(git ls-files --others --exclude-standard -- . ../docs ../specs)" && git commit -m 'test(mobile): #174 R3 rojo — título Alertas en el contenido'
# -- c6 R3 verde (paso 1, a mano): implementa "R3 (2)" de tasks.md (ningun test nuevo) --
# -- c6 (paso 2) cadena --
cd /home/claude/sites/Pet-Tracker-wt-174/mobile-pet-tracker && python3 ../specs/mobile-alerts-canvas-fidelity/mcheck.py cierre M10 M11 M12 && { FORCE_COLOR=0 bunx jest --testTimeout=30000 --runTestsByPath src/__tests__/account-screens-polish.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/design-drift.test.ts src/__tests__/hero-header-amendments.test.ts src/__tests__/legibility-classnames.test.ts src/__tests__/profile-canvas-fidelity.test.ts src/__tests__/tab-headers-canvas.test.ts src/__tests__/ui-language.test.ts src/app/__tests__/alert-detail.navigation.test.tsx src/app/__tests__/detail-stack.test.tsx src/app/__tests__/layout.test.tsx src/app/__tests__/reminders-alerts-stack.navigation.test.tsx src/components/__tests__/empty-state.test.tsx src/providers/__tests__/language-provider.test.tsx src/screens/alert-detail/index.test.tsx src/screens/alerts/index.test.tsx src/theme/__tests__/global-css.test.ts src/theme/__tests__/motion.test.ts > /tmp/174-c6.txt 2>&1; echo "exit=$?"; } && grep -qE '^Test Suites: +18 passed, 18 total$' /tmp/174-c6.txt && grep -qE '^Tests: +([0-9]+) passed, \1 total$' /tmp/174-c6.txt && test ! -e .expo/types/router.d.ts && bun run typecheck && bunx expo lint --no-cache > /tmp/174-lint.txt 2>&1 && test ! -s /tmp/174-lint.txt && git add src/app/_layout.tsx src/screens/alerts/index.tsx ../specs/mobile-ui-language/design.md && test "$(git diff --cached --no-renames --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/app/_layout.tsx mobile-pet-tracker/src/screens/alerts/index.tsx specs/mobile-ui-language/design.md ' && git diff --quiet -- . ../docs ../specs && test -z "$(git ls-files --others --exclude-standard -- . ../docs ../specs)" && git commit -m 'feat(mobile): #174 R3 título de Alertas en el contenido (D-H)'
# -- c7 R4 rojo (paso 1, a mano): escribe SOLO los tests/candados de "R4 (1)" de tasks.md (ningun fichero de produccion); incluye la correccion E1.1 (text-13) de PF --
# -- c7 (paso 2) cadena --
cd /home/claude/sites/Pet-Tracker-wt-174/mobile-pet-tracker && { FORCE_COLOR=0 bunx jest --testTimeout=30000 --runTestsByPath src/__tests__/account-screens-polish.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/design-drift.test.ts src/__tests__/hero-header-amendments.test.ts src/__tests__/legibility-classnames.test.ts src/__tests__/profile-canvas-fidelity.test.ts src/__tests__/tab-headers-canvas.test.ts src/__tests__/ui-language.test.ts src/app/__tests__/alert-detail.navigation.test.tsx src/app/__tests__/detail-stack.test.tsx src/app/__tests__/layout.test.tsx src/app/__tests__/reminders-alerts-stack.navigation.test.tsx src/components/__tests__/empty-state.test.tsx src/providers/__tests__/language-provider.test.tsx src/screens/alert-detail/index.test.tsx src/screens/alerts/index.test.tsx src/theme/__tests__/global-css.test.ts src/theme/__tests__/motion.test.ts > /tmp/174-c7.txt 2>&1; echo "exit=$?"; } && grep -qE '^Tests: +[0-9]+ failed, ' /tmp/174-c7.txt && test "$(grep -E '^  ● ' /tmp/174-c7.txt | grep -vxF '  ● Console' | grep -cvE '^  ● (#170 R4|#174 R4|#173 R2\.4)\b')" = 0 && grep -E '^  ● ' /tmp/174-c7.txt | grep -qE '#174 R4\b' && ! grep -qE "Test suite failed to run|ReferenceError:|SyntaxError:|Cannot find module|reading 'canceled'|Exceeded timeout" /tmp/174-c7.txt && test ! -e .expo/types/router.d.ts && { bun run typecheck > /tmp/174-tsc.txt 2>&1; true; } && test "$(grep 'error TS' /tmp/174-tsc.txt | grep -cvE '^src/[^(]+\.test\.tsx?\(')" = 0 && { bunx expo lint --no-cache > /tmp/174-lint.txt 2>&1; true; } && ! grep -qF 'Failed to run' /tmp/174-lint.txt && test "$(grep -E '^/' /tmp/174-lint.txt | grep -cvE '\.test\.tsx?$')" = 0 && git add src/screens/alerts/index.test.tsx src/__tests__/profile-canvas-fidelity.test.ts && test "$(git diff --cached --no-renames --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/__tests__/profile-canvas-fidelity.test.ts mobile-pet-tracker/src/screens/alerts/index.test.tsx ' && git diff --quiet -- . ../docs ../specs && test -z "$(git ls-files --others --exclude-standard -- . ../docs ../specs)" && git commit -m 'test(mobile): #174 R4 rojo — contador en la fila del título'
# -- c8 R4 verde (paso 1, a mano): implementa "R4 (2)" de tasks.md (ningun test nuevo) --
# -- c8 (paso 2) cadena --
cd /home/claude/sites/Pet-Tracker-wt-174/mobile-pet-tracker && python3 ../specs/mobile-alerts-canvas-fidelity/mcheck.py cierre M13 M25 && { FORCE_COLOR=0 bunx jest --testTimeout=30000 --runTestsByPath src/__tests__/account-screens-polish.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/design-drift.test.ts src/__tests__/hero-header-amendments.test.ts src/__tests__/legibility-classnames.test.ts src/__tests__/profile-canvas-fidelity.test.ts src/__tests__/tab-headers-canvas.test.ts src/__tests__/ui-language.test.ts src/app/__tests__/alert-detail.navigation.test.tsx src/app/__tests__/detail-stack.test.tsx src/app/__tests__/layout.test.tsx src/app/__tests__/reminders-alerts-stack.navigation.test.tsx src/components/__tests__/empty-state.test.tsx src/providers/__tests__/language-provider.test.tsx src/screens/alert-detail/index.test.tsx src/screens/alerts/index.test.tsx src/theme/__tests__/global-css.test.ts src/theme/__tests__/motion.test.ts > /tmp/174-c8.txt 2>&1; echo "exit=$?"; } && grep -qE '^Test Suites: +18 passed, 18 total$' /tmp/174-c8.txt && grep -qE '^Tests: +([0-9]+) passed, \1 total$' /tmp/174-c8.txt && test ! -e .expo/types/router.d.ts && bun run typecheck && bunx expo lint --no-cache > /tmp/174-lint.txt 2>&1 && test ! -s /tmp/174-lint.txt && git add src/screens/alerts/index.tsx && test "$(git diff --cached --no-renames --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/screens/alerts/index.tsx ' && git diff --quiet -- . ../docs ../specs && test -z "$(git ls-files --others --exclude-standard -- . ../docs ../specs)" && git commit -m 'feat(mobile): #174 R4 contador con PopIn junto al título'
# -- c9 R5 rojo (paso 1, a mano): escribe SOLO los tests/candados de "R5 (1)" de tasks.md (ningun fichero de produccion) --
# -- c9 (paso 2) cadena --
cd /home/claude/sites/Pet-Tracker-wt-174/mobile-pet-tracker && { FORCE_COLOR=0 bunx jest --testTimeout=30000 --runTestsByPath src/__tests__/account-screens-polish.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/design-drift.test.ts src/__tests__/hero-header-amendments.test.ts src/__tests__/legibility-classnames.test.ts src/__tests__/profile-canvas-fidelity.test.ts src/__tests__/tab-headers-canvas.test.ts src/__tests__/ui-language.test.ts src/app/__tests__/alert-detail.navigation.test.tsx src/app/__tests__/detail-stack.test.tsx src/app/__tests__/layout.test.tsx src/app/__tests__/reminders-alerts-stack.navigation.test.tsx src/components/__tests__/empty-state.test.tsx src/providers/__tests__/language-provider.test.tsx src/screens/alert-detail/index.test.tsx src/screens/alerts/index.test.tsx src/theme/__tests__/global-css.test.ts src/theme/__tests__/motion.test.ts > /tmp/174-c9.txt 2>&1; echo "exit=$?"; } && grep -qE '^Tests: +[0-9]+ failed, ' /tmp/174-c9.txt && test "$(grep -E '^  ● ' /tmp/174-c9.txt | grep -vxF '  ● Console' | grep -cvE '^  ● (#78 R4|#174 R5)\b')" = 0 && grep -E '^  ● ' /tmp/174-c9.txt | grep -qE '#174 R5\b' && ! grep -qE "Test suite failed to run|ReferenceError:|SyntaxError:|Cannot find module|reading 'canceled'|Exceeded timeout" /tmp/174-c9.txt && test ! -e .expo/types/router.d.ts && { bun run typecheck > /tmp/174-tsc.txt 2>&1; true; } && test "$(grep 'error TS' /tmp/174-tsc.txt | grep -cvE '^src/[^(]+\.test\.tsx?\(')" = 0 && { bunx expo lint --no-cache > /tmp/174-lint.txt 2>&1; true; } && ! grep -qF 'Failed to run' /tmp/174-lint.txt && test "$(grep -E '^/' /tmp/174-lint.txt | grep -cvE '\.test\.tsx?$')" = 0 && git add src/screens/alerts/index.test.tsx && test "$(git diff --cached --no-renames --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/screens/alerts/index.test.tsx ' && git diff --quiet -- . ../docs ../specs && test -z "$(git ls-files --others --exclude-standard -- . ../docs ../specs)" && git commit -m 'test(mobile): #174 R5 rojo — padding 20 y gap 12'
# -- c10 R5 verde (paso 1, a mano): implementa "R5 (2)" de tasks.md (ningun test nuevo) --
# -- c10 (paso 2) cadena --
cd /home/claude/sites/Pet-Tracker-wt-174/mobile-pet-tracker && python3 ../specs/mobile-alerts-canvas-fidelity/mcheck.py cierre M14 M15 && { FORCE_COLOR=0 bunx jest --testTimeout=30000 --runTestsByPath src/__tests__/account-screens-polish.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/design-drift.test.ts src/__tests__/hero-header-amendments.test.ts src/__tests__/legibility-classnames.test.ts src/__tests__/profile-canvas-fidelity.test.ts src/__tests__/tab-headers-canvas.test.ts src/__tests__/ui-language.test.ts src/app/__tests__/alert-detail.navigation.test.tsx src/app/__tests__/detail-stack.test.tsx src/app/__tests__/layout.test.tsx src/app/__tests__/reminders-alerts-stack.navigation.test.tsx src/components/__tests__/empty-state.test.tsx src/providers/__tests__/language-provider.test.tsx src/screens/alert-detail/index.test.tsx src/screens/alerts/index.test.tsx src/theme/__tests__/global-css.test.ts src/theme/__tests__/motion.test.ts > /tmp/174-c10.txt 2>&1; echo "exit=$?"; } && grep -qE '^Test Suites: +18 passed, 18 total$' /tmp/174-c10.txt && grep -qE '^Tests: +([0-9]+) passed, \1 total$' /tmp/174-c10.txt && test ! -e .expo/types/router.d.ts && bun run typecheck && bunx expo lint --no-cache > /tmp/174-lint.txt 2>&1 && test ! -s /tmp/174-lint.txt && git add src/screens/alerts/index.tsx && test "$(git diff --cached --no-renames --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/screens/alerts/index.tsx ' && git diff --quiet -- . ../docs ../specs && test -z "$(git ls-files --others --exclude-standard -- . ../docs ../specs)" && git commit -m 'feat(mobile): #174 R5 métricas del artboard'
# -- c11 R6 rojo (paso 1, a mano): escribe SOLO los tests/candados de "R6 (1)" de tasks.md (ningun fichero de produccion) --
# -- c11 (paso 2) cadena --
cd /home/claude/sites/Pet-Tracker-wt-174/mobile-pet-tracker && { FORCE_COLOR=0 bunx jest --testTimeout=30000 --runTestsByPath src/__tests__/account-screens-polish.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/design-drift.test.ts src/__tests__/hero-header-amendments.test.ts src/__tests__/legibility-classnames.test.ts src/__tests__/profile-canvas-fidelity.test.ts src/__tests__/tab-headers-canvas.test.ts src/__tests__/ui-language.test.ts src/app/__tests__/alert-detail.navigation.test.tsx src/app/__tests__/detail-stack.test.tsx src/app/__tests__/layout.test.tsx src/app/__tests__/reminders-alerts-stack.navigation.test.tsx src/components/__tests__/empty-state.test.tsx src/providers/__tests__/language-provider.test.tsx src/screens/alert-detail/index.test.tsx src/screens/alerts/index.test.tsx src/theme/__tests__/global-css.test.ts src/theme/__tests__/motion.test.ts > /tmp/174-c11.txt 2>&1; echo "exit=$?"; } && grep -qE '^Tests: +[0-9]+ failed, ' /tmp/174-c11.txt && test "$(grep -E '^  ● ' /tmp/174-c11.txt | grep -vxF '  ● Console' | grep -cvE '^  ● (#170 R3|#174 R6)\b')" = 0 && grep -E '^  ● ' /tmp/174-c11.txt | grep -qE '#174 R6\b' && ! grep -qE "Test suite failed to run|ReferenceError:|SyntaxError:|Cannot find module|reading 'canceled'|Exceeded timeout" /tmp/174-c11.txt && test ! -e .expo/types/router.d.ts && { bun run typecheck > /tmp/174-tsc.txt 2>&1; true; } && test "$(grep 'error TS' /tmp/174-tsc.txt | grep -cvE '^src/[^(]+\.test\.tsx?\(')" = 0 && { bunx expo lint --no-cache > /tmp/174-lint.txt 2>&1; true; } && ! grep -qF 'Failed to run' /tmp/174-lint.txt && test "$(grep -E '^/' /tmp/174-lint.txt | grep -cvE '\.test\.tsx?$')" = 0 && git add src/screens/alerts/index.test.tsx && test "$(git diff --cached --no-renames --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/screens/alerts/index.test.tsx ' && git diff --quiet -- . ../docs ../specs && test -z "$(git ls-files --others --exclude-standard -- . ../docs ../specs)" && git commit -m 'test(mobile): #174 R6 rojo — secciones gap-3 y cabecera 13 extrabold'
# -- c12 R6 verde (paso 1, a mano): implementa "R6 (2)" de tasks.md (ningun test nuevo) --
# -- c12 (paso 2) cadena --
cd /home/claude/sites/Pet-Tracker-wt-174/mobile-pet-tracker && python3 ../specs/mobile-alerts-canvas-fidelity/mcheck.py cierre M16 && { FORCE_COLOR=0 bunx jest --testTimeout=30000 --runTestsByPath src/__tests__/account-screens-polish.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/design-drift.test.ts src/__tests__/hero-header-amendments.test.ts src/__tests__/legibility-classnames.test.ts src/__tests__/profile-canvas-fidelity.test.ts src/__tests__/tab-headers-canvas.test.ts src/__tests__/ui-language.test.ts src/app/__tests__/alert-detail.navigation.test.tsx src/app/__tests__/detail-stack.test.tsx src/app/__tests__/layout.test.tsx src/app/__tests__/reminders-alerts-stack.navigation.test.tsx src/components/__tests__/empty-state.test.tsx src/providers/__tests__/language-provider.test.tsx src/screens/alert-detail/index.test.tsx src/screens/alerts/index.test.tsx src/theme/__tests__/global-css.test.ts src/theme/__tests__/motion.test.ts > /tmp/174-c12.txt 2>&1; echo "exit=$?"; } && grep -qE '^Test Suites: +18 passed, 18 total$' /tmp/174-c12.txt && grep -qE '^Tests: +([0-9]+) passed, \1 total$' /tmp/174-c12.txt && test ! -e .expo/types/router.d.ts && bun run typecheck && bunx expo lint --no-cache > /tmp/174-lint.txt 2>&1 && test ! -s /tmp/174-lint.txt && git add src/screens/alerts/index.tsx && test "$(git diff --cached --no-renames --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/screens/alerts/index.tsx ' && git diff --quiet -- . ../docs ../specs && test -z "$(git ls-files --others --exclude-standard -- . ../docs ../specs)" && git commit -m 'feat(mobile): #174 R6 secciones del artboard'
# -- c13 R7 rojo (paso 1, a mano): escribe SOLO los tests/candados de "R7 (1)" de tasks.md (ningun fichero de produccion) --
# -- c13 (paso 2) cadena --
cd /home/claude/sites/Pet-Tracker-wt-174/mobile-pet-tracker && { FORCE_COLOR=0 bunx jest --testTimeout=30000 --runTestsByPath src/__tests__/account-screens-polish.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/design-drift.test.ts src/__tests__/hero-header-amendments.test.ts src/__tests__/legibility-classnames.test.ts src/__tests__/profile-canvas-fidelity.test.ts src/__tests__/tab-headers-canvas.test.ts src/__tests__/ui-language.test.ts src/app/__tests__/alert-detail.navigation.test.tsx src/app/__tests__/detail-stack.test.tsx src/app/__tests__/layout.test.tsx src/app/__tests__/reminders-alerts-stack.navigation.test.tsx src/components/__tests__/empty-state.test.tsx src/providers/__tests__/language-provider.test.tsx src/screens/alert-detail/index.test.tsx src/screens/alerts/index.test.tsx src/theme/__tests__/global-css.test.ts src/theme/__tests__/motion.test.ts > /tmp/174-c13.txt 2>&1; echo "exit=$?"; } && grep -qE '^Tests: +[0-9]+ failed, ' /tmp/174-c13.txt && test "$(grep -E '^  ● ' /tmp/174-c13.txt | grep -vxF '  ● Console' | grep -cvE '^  ● (#78 R6|#100 R6|#170 R5|#174 R7)\b')" = 0 && grep -E '^  ● ' /tmp/174-c13.txt | grep -qE '#174 R7\b' && ! grep -qE "Test suite failed to run|ReferenceError:|SyntaxError:|Cannot find module|reading 'canceled'|Exceeded timeout" /tmp/174-c13.txt && test ! -e .expo/types/router.d.ts && { bun run typecheck > /tmp/174-tsc.txt 2>&1; true; } && test "$(grep 'error TS' /tmp/174-tsc.txt | grep -cvE '^src/[^(]+\.test\.tsx?\(')" = 0 && { bunx expo lint --no-cache > /tmp/174-lint.txt 2>&1; true; } && ! grep -qF 'Failed to run' /tmp/174-lint.txt && test "$(grep -E '^/' /tmp/174-lint.txt | grep -cvE '\.test\.tsx?$')" = 0 && git add src/screens/alerts/index.test.tsx && test "$(git diff --cached --no-renames --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/screens/alerts/index.test.tsx ' && git diff --quiet -- . ../docs ../specs && test -z "$(git ls-files --others --exclude-standard -- . ../docs ../specs)" && git commit -m 'test(mobile): #174 R7 rojo — anatomía de la fila del artboard'
# -- c14 R7 verde (paso 1, a mano): implementa "R7 (2)" de tasks.md (ningun test nuevo) --
# -- c14 (paso 2) cadena --
cd /home/claude/sites/Pet-Tracker-wt-174/mobile-pet-tracker && python3 ../specs/mobile-alerts-canvas-fidelity/mcheck.py cierre M17 M18 M19 M20 M21 && { FORCE_COLOR=0 bunx jest --testTimeout=30000 --runTestsByPath src/__tests__/account-screens-polish.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/design-drift.test.ts src/__tests__/hero-header-amendments.test.ts src/__tests__/legibility-classnames.test.ts src/__tests__/profile-canvas-fidelity.test.ts src/__tests__/tab-headers-canvas.test.ts src/__tests__/ui-language.test.ts src/app/__tests__/alert-detail.navigation.test.tsx src/app/__tests__/detail-stack.test.tsx src/app/__tests__/layout.test.tsx src/app/__tests__/reminders-alerts-stack.navigation.test.tsx src/components/__tests__/empty-state.test.tsx src/providers/__tests__/language-provider.test.tsx src/screens/alert-detail/index.test.tsx src/screens/alerts/index.test.tsx src/theme/__tests__/global-css.test.ts src/theme/__tests__/motion.test.ts > /tmp/174-c14.txt 2>&1; echo "exit=$?"; } && grep -qE '^Test Suites: +18 passed, 18 total$' /tmp/174-c14.txt && grep -qE '^Tests: +([0-9]+) passed, \1 total$' /tmp/174-c14.txt && test ! -e .expo/types/router.d.ts && bun run typecheck && bunx expo lint --no-cache > /tmp/174-lint.txt 2>&1 && test ! -s /tmp/174-lint.txt && git add src/utils/alert-meta.ts src/screens/alerts/index.tsx && test "$(git diff --cached --no-renames --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/screens/alerts/index.tsx mobile-pet-tracker/src/utils/alert-meta.ts ' && git diff --quiet -- . ../docs ../specs && test -z "$(git ls-files --others --exclude-standard -- . ../docs ../specs)" && git commit -m 'feat(mobile): #174 R7 fila con disco de categoría y subtítulo en una línea'
# -- c15 R8 rojo (paso 1, a mano): escribe SOLO los tests/candados de "R8 (1)" de tasks.md (ningun fichero de produccion); incluye la correccion E1.2 de CC (ver PASO 1) --
# -- c15 (paso 2) cadena --
cd /home/claude/sites/Pet-Tracker-wt-174/mobile-pet-tracker && { FORCE_COLOR=0 bunx jest --testTimeout=30000 --runTestsByPath src/__tests__/account-screens-polish.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/design-drift.test.ts src/__tests__/hero-header-amendments.test.ts src/__tests__/legibility-classnames.test.ts src/__tests__/profile-canvas-fidelity.test.ts src/__tests__/tab-headers-canvas.test.ts src/__tests__/ui-language.test.ts src/app/__tests__/alert-detail.navigation.test.tsx src/app/__tests__/detail-stack.test.tsx src/app/__tests__/layout.test.tsx src/app/__tests__/reminders-alerts-stack.navigation.test.tsx src/components/__tests__/empty-state.test.tsx src/providers/__tests__/language-provider.test.tsx src/screens/alert-detail/index.test.tsx src/screens/alerts/index.test.tsx src/theme/__tests__/global-css.test.ts src/theme/__tests__/motion.test.ts > /tmp/174-c15.txt 2>&1; echo "exit=$?"; } && grep -qE '^Tests: +[0-9]+ failed, ' /tmp/174-c15.txt && test "$(grep -E '^  ● ' /tmp/174-c15.txt | grep -vxF '  ● Console' | grep -cvE '^  ● (#78 R6|#166 R3|#174 R8)\b')" = 0 && grep -E '^  ● ' /tmp/174-c15.txt | grep -qE '#174 R8\b' && ! grep -qE "Test suite failed to run|ReferenceError:|SyntaxError:|Cannot find module|reading 'canceled'|Exceeded timeout" /tmp/174-c15.txt && test ! -e .expo/types/router.d.ts && { bun run typecheck > /tmp/174-tsc.txt 2>&1; true; } && test "$(grep 'error TS' /tmp/174-tsc.txt | grep -cvE '^src/[^(]+\.test\.tsx?\(')" = 0 && { bunx expo lint --no-cache > /tmp/174-lint.txt 2>&1; true; } && ! grep -qF 'Failed to run' /tmp/174-lint.txt && test "$(grep -E '^/' /tmp/174-lint.txt | grep -cvE '\.test\.tsx?$')" = 0 && git add src/screens/alerts/index.test.tsx src/__tests__/consistency-classnames.test.ts && test "$(git diff --cached --no-renames --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts mobile-pet-tracker/src/screens/alerts/index.test.tsx ' && git diff --quiet -- . ../docs ../specs && test -z "$(git ls-files --others --exclude-standard -- . ../docs ../specs)" && git commit -m 'test(mobile): #174 R8 rojo — ack secundario compacto con labio'
# -- c16 R8 verde (paso 1, a mano): implementa "R8 (2)" de tasks.md (ningun test nuevo) --
# -- c16 (paso 2) cadena --
cd /home/claude/sites/Pet-Tracker-wt-174/mobile-pet-tracker && python3 ../specs/mobile-alerts-canvas-fidelity/mcheck.py cierre M22 && { FORCE_COLOR=0 bunx jest --testTimeout=30000 --runTestsByPath src/__tests__/account-screens-polish.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/design-drift.test.ts src/__tests__/hero-header-amendments.test.ts src/__tests__/legibility-classnames.test.ts src/__tests__/profile-canvas-fidelity.test.ts src/__tests__/tab-headers-canvas.test.ts src/__tests__/ui-language.test.ts src/app/__tests__/alert-detail.navigation.test.tsx src/app/__tests__/detail-stack.test.tsx src/app/__tests__/layout.test.tsx src/app/__tests__/reminders-alerts-stack.navigation.test.tsx src/components/__tests__/empty-state.test.tsx src/providers/__tests__/language-provider.test.tsx src/screens/alert-detail/index.test.tsx src/screens/alerts/index.test.tsx src/theme/__tests__/global-css.test.ts src/theme/__tests__/motion.test.ts > /tmp/174-c16.txt 2>&1; echo "exit=$?"; } && grep -qE '^Test Suites: +18 passed, 18 total$' /tmp/174-c16.txt && grep -qE '^Tests: +([0-9]+) passed, \1 total$' /tmp/174-c16.txt && test ! -e .expo/types/router.d.ts && bun run typecheck && bunx expo lint --no-cache > /tmp/174-lint.txt 2>&1 && test ! -s /tmp/174-lint.txt && git add src/screens/alerts/index.tsx && test "$(git diff --cached --no-renames --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/screens/alerts/index.tsx ' && git diff --quiet -- . ../docs ../specs && test -z "$(git ls-files --others --exclude-standard -- . ../docs ../specs)" && git commit -m 'feat(mobile): #174 R8 ack compacto de fila'
# -- c17 R9 rojo (paso 1, a mano): escribe SOLO los tests/candados de "R9 (1)" de tasks.md (ningun fichero de produccion) --
# -- c17 (paso 2) cadena --
cd /home/claude/sites/Pet-Tracker-wt-174/mobile-pet-tracker && { FORCE_COLOR=0 bunx jest --testTimeout=30000 --runTestsByPath src/__tests__/account-screens-polish.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/design-drift.test.ts src/__tests__/hero-header-amendments.test.ts src/__tests__/legibility-classnames.test.ts src/__tests__/profile-canvas-fidelity.test.ts src/__tests__/tab-headers-canvas.test.ts src/__tests__/ui-language.test.ts src/app/__tests__/alert-detail.navigation.test.tsx src/app/__tests__/detail-stack.test.tsx src/app/__tests__/layout.test.tsx src/app/__tests__/reminders-alerts-stack.navigation.test.tsx src/components/__tests__/empty-state.test.tsx src/providers/__tests__/language-provider.test.tsx src/screens/alert-detail/index.test.tsx src/screens/alerts/index.test.tsx src/theme/__tests__/global-css.test.ts src/theme/__tests__/motion.test.ts > /tmp/174-c17.txt 2>&1; echo "exit=$?"; } && grep -qE '^Tests: +[0-9]+ failed, ' /tmp/174-c17.txt && test "$(grep -E '^  ● ' /tmp/174-c17.txt | grep -vxF '  ● Console' | grep -cvE '^  ● (#78 R6|#174 R9)\b')" = 0 && grep -E '^  ● ' /tmp/174-c17.txt | grep -qF 'alterna el tercer hijo' && ! grep -qE "Test suite failed to run|ReferenceError:|SyntaxError:|Cannot find module|reading 'canceled'|Exceeded timeout" /tmp/174-c17.txt && test ! -e .expo/types/router.d.ts && { bun run typecheck > /tmp/174-tsc.txt 2>&1; true; } && test "$(grep 'error TS' /tmp/174-tsc.txt | grep -cvE '^src/[^(]+\.test\.tsx?\(')" = 0 && { bunx expo lint --no-cache > /tmp/174-lint.txt 2>&1; true; } && ! grep -qF 'Failed to run' /tmp/174-lint.txt && test "$(grep -E '^/' /tmp/174-lint.txt | grep -cvE '\.test\.tsx?$')" = 0 && git add src/screens/alerts/index.test.tsx && test "$(git diff --cached --no-renames --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/screens/alerts/index.test.tsx ' && git diff --quiet -- . ../docs ../specs && test -z "$(git ls-files --others --exclude-standard -- . ../docs ../specs)" && git commit -m 'test(mobile): #174 R9 rojo — píldoras de estado'
# -- c18 R9 verde (paso 1, a mano): implementa "R9 (2)" de tasks.md (ningun test nuevo) --
# -- c18 (paso 2) cadena --
cd /home/claude/sites/Pet-Tracker-wt-174/mobile-pet-tracker && python3 ../specs/mobile-alerts-canvas-fidelity/mcheck.py cierre M23 && { FORCE_COLOR=0 bunx jest --testTimeout=30000 --runTestsByPath src/__tests__/account-screens-polish.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/design-drift.test.ts src/__tests__/hero-header-amendments.test.ts src/__tests__/legibility-classnames.test.ts src/__tests__/profile-canvas-fidelity.test.ts src/__tests__/tab-headers-canvas.test.ts src/__tests__/ui-language.test.ts src/app/__tests__/alert-detail.navigation.test.tsx src/app/__tests__/detail-stack.test.tsx src/app/__tests__/layout.test.tsx src/app/__tests__/reminders-alerts-stack.navigation.test.tsx src/components/__tests__/empty-state.test.tsx src/providers/__tests__/language-provider.test.tsx src/screens/alert-detail/index.test.tsx src/screens/alerts/index.test.tsx src/theme/__tests__/global-css.test.ts src/theme/__tests__/motion.test.ts > /tmp/174-c18.txt 2>&1; echo "exit=$?"; } && grep -qE '^Test Suites: +18 passed, 18 total$' /tmp/174-c18.txt && grep -qE '^Tests: +([0-9]+) passed, \1 total$' /tmp/174-c18.txt && test ! -e .expo/types/router.d.ts && bun run typecheck && bunx expo lint --no-cache > /tmp/174-lint.txt 2>&1 && test ! -s /tmp/174-lint.txt && git add src/screens/alerts/index.tsx && test "$(git diff --cached --no-renames --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/screens/alerts/index.tsx ' && git diff --quiet -- . ../docs ../specs && test -z "$(git ls-files --others --exclude-standard -- . ../docs ../specs)" && git commit -m 'feat(mobile): #174 R9 píldoras Leída y Resuelta del artboard'
# -- c19 R10 rojo (paso 1, a mano): escribe SOLO los tests/candados de "R10 (1)" de tasks.md (ningun fichero de produccion) --
# -- c19 (paso 2) cadena --
cd /home/claude/sites/Pet-Tracker-wt-174/mobile-pet-tracker && { FORCE_COLOR=0 bunx jest --testTimeout=30000 --runTestsByPath src/__tests__/account-screens-polish.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/design-drift.test.ts src/__tests__/hero-header-amendments.test.ts src/__tests__/legibility-classnames.test.ts src/__tests__/profile-canvas-fidelity.test.ts src/__tests__/tab-headers-canvas.test.ts src/__tests__/ui-language.test.ts src/app/__tests__/alert-detail.navigation.test.tsx src/app/__tests__/detail-stack.test.tsx src/app/__tests__/layout.test.tsx src/app/__tests__/reminders-alerts-stack.navigation.test.tsx src/components/__tests__/empty-state.test.tsx src/providers/__tests__/language-provider.test.tsx src/screens/alert-detail/index.test.tsx src/screens/alerts/index.test.tsx src/theme/__tests__/global-css.test.ts src/theme/__tests__/motion.test.ts > /tmp/174-c19.txt 2>&1; echo "exit=$?"; } && grep -qE '^Tests: +[0-9]+ failed, ' /tmp/174-c19.txt && test "$(grep -E '^  ● ' /tmp/174-c19.txt | grep -vxF '  ● Console' | grep -cvE '^  ● (#174 R10)\b')" = 0 && grep -E '^  ● ' /tmp/174-c19.txt | grep -qE '#174 R10\b' && ! grep -qE "Test suite failed to run|ReferenceError:|SyntaxError:|Cannot find module|reading 'canceled'|Exceeded timeout" /tmp/174-c19.txt && test ! -e .expo/types/router.d.ts && { bun run typecheck > /tmp/174-tsc.txt 2>&1; true; } && test "$(grep 'error TS' /tmp/174-tsc.txt | grep -cvE '^src/[^(]+\.test\.tsx?\(')" = 0 && { bunx expo lint --no-cache > /tmp/174-lint.txt 2>&1; true; } && ! grep -qF 'Failed to run' /tmp/174-lint.txt && test "$(grep -E '^/' /tmp/174-lint.txt | grep -cvE '\.test\.tsx?$')" = 0 && git add src/screens/alerts/index.test.tsx && test "$(git diff --cached --no-renames --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/screens/alerts/index.test.tsx ' && git diff --quiet -- . ../docs ../specs && test -z "$(git ls-files --others --exclude-standard -- . ../docs ../specs)" && git commit -m 'test(mobile): #174 R10 rojo — entrada de las cinco primeras filas'
# -- c20 R10 verde (paso 1, a mano): implementa "R10 (2)" de tasks.md (ningun test nuevo) --
# -- c20 (paso 2) cadena --
cd /home/claude/sites/Pet-Tracker-wt-174/mobile-pet-tracker && python3 ../specs/mobile-alerts-canvas-fidelity/mcheck.py cierre M24 && { FORCE_COLOR=0 bunx jest --testTimeout=30000 --runTestsByPath src/__tests__/account-screens-polish.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/design-drift.test.ts src/__tests__/hero-header-amendments.test.ts src/__tests__/legibility-classnames.test.ts src/__tests__/profile-canvas-fidelity.test.ts src/__tests__/tab-headers-canvas.test.ts src/__tests__/ui-language.test.ts src/app/__tests__/alert-detail.navigation.test.tsx src/app/__tests__/detail-stack.test.tsx src/app/__tests__/layout.test.tsx src/app/__tests__/reminders-alerts-stack.navigation.test.tsx src/components/__tests__/empty-state.test.tsx src/providers/__tests__/language-provider.test.tsx src/screens/alert-detail/index.test.tsx src/screens/alerts/index.test.tsx src/theme/__tests__/global-css.test.ts src/theme/__tests__/motion.test.ts > /tmp/174-c20.txt 2>&1; echo "exit=$?"; } && grep -qE '^Test Suites: +18 passed, 18 total$' /tmp/174-c20.txt && grep -qE '^Tests: +([0-9]+) passed, \1 total$' /tmp/174-c20.txt && test ! -e .expo/types/router.d.ts && bun run typecheck && bunx expo lint --no-cache > /tmp/174-lint.txt 2>&1 && test ! -s /tmp/174-lint.txt && git add src/screens/alerts/index.tsx && test "$(git diff --cached --no-renames --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/screens/alerts/index.tsx ' && git diff --quiet -- . ../docs ../specs && test -z "$(git ls-files --others --exclude-standard -- . ../docs ../specs)" && git commit -m 'feat(mobile): #174 R10 entrada escalonada de filas'
# -- c21 R11 rojo (paso 1, a mano): escribe SOLO los tests/candados de "R11 (1)" de tasks.md (ningun fichero de produccion); el fichero F NACE aqui --
# -- c21 (paso 2) cadena --
cd /home/claude/sites/Pet-Tracker-wt-174/mobile-pet-tracker && { FORCE_COLOR=0 bunx jest --testTimeout=30000 --runTestsByPath src/__tests__/account-screens-polish.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/design-drift.test.ts src/__tests__/hero-header-amendments.test.ts src/__tests__/legibility-classnames.test.ts src/__tests__/profile-canvas-fidelity.test.ts src/__tests__/tab-headers-canvas.test.ts src/__tests__/ui-language.test.ts src/app/__tests__/alert-detail.navigation.test.tsx src/app/__tests__/detail-stack.test.tsx src/app/__tests__/layout.test.tsx src/app/__tests__/reminders-alerts-stack.navigation.test.tsx src/components/__tests__/empty-state.test.tsx src/providers/__tests__/language-provider.test.tsx src/screens/alert-detail/index.test.tsx src/screens/alerts/index.test.tsx src/theme/__tests__/global-css.test.ts src/theme/__tests__/motion.test.ts src/__tests__/alerts-canvas-fidelity.test.ts > /tmp/174-c21.txt 2>&1; echo "exit=$?"; } && grep -qE '^Tests: +[0-9]+ failed, ' /tmp/174-c21.txt && test "$(grep -E '^  ● ' /tmp/174-c21.txt | grep -vxF '  ● Console' | grep -cvE '^  ● (#174 R11)\b')" = 0 && grep -E '^  ● ' /tmp/174-c21.txt | grep -qE '#174 R11\b' && ! grep -qE "Test suite failed to run|ReferenceError:|SyntaxError:|Cannot find module|reading 'canceled'|Exceeded timeout" /tmp/174-c21.txt && test ! -e .expo/types/router.d.ts && { bun run typecheck > /tmp/174-tsc.txt 2>&1; true; } && test "$(grep 'error TS' /tmp/174-tsc.txt | grep -cvE '^src/[^(]+\.test\.tsx?\(')" = 0 && { bunx expo lint --no-cache > /tmp/174-lint.txt 2>&1; true; } && ! grep -qF 'Failed to run' /tmp/174-lint.txt && test "$(grep -E '^/' /tmp/174-lint.txt | grep -cvE '\.test\.tsx?$')" = 0 && git add src/__tests__/alerts-canvas-fidelity.test.ts && test "$(git diff --cached --no-renames --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/__tests__/alerts-canvas-fidelity.test.ts ' && git diff --quiet -- . ../docs ../specs && test -z "$(git ls-files --others --exclude-standard -- . ../docs ../specs)" && git commit -m 'test(mobile): #174 R11 rojo — enmiendas a carta y specs'
# -- c22 R11 docs (paso 1, a mano): escribe "R11 (2)" de tasks.md: bloques de enmienda en la carta y en las 5 specs, marcadores y textos (solo docs/ y specs/) --
# -- c22 (paso 2) cadena --
cd /home/claude/sites/Pet-Tracker-wt-174/mobile-pet-tracker && python3 ../specs/mobile-alerts-canvas-fidelity/mcheck.py cierre M26 M28 M29 M30 M31 M32 M33 M34 M35 M36 && { FORCE_COLOR=0 bunx jest --testTimeout=30000 --runTestsByPath src/__tests__/account-screens-polish.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/design-drift.test.ts src/__tests__/hero-header-amendments.test.ts src/__tests__/legibility-classnames.test.ts src/__tests__/profile-canvas-fidelity.test.ts src/__tests__/tab-headers-canvas.test.ts src/__tests__/ui-language.test.ts src/app/__tests__/alert-detail.navigation.test.tsx src/app/__tests__/detail-stack.test.tsx src/app/__tests__/layout.test.tsx src/app/__tests__/reminders-alerts-stack.navigation.test.tsx src/components/__tests__/empty-state.test.tsx src/providers/__tests__/language-provider.test.tsx src/screens/alert-detail/index.test.tsx src/screens/alerts/index.test.tsx src/theme/__tests__/global-css.test.ts src/theme/__tests__/motion.test.ts src/__tests__/alerts-canvas-fidelity.test.ts > /tmp/174-c22.txt 2>&1; echo "exit=$?"; } && grep -qE '^Test Suites: +19 passed, 19 total$' /tmp/174-c22.txt && grep -qE '^Tests: +([0-9]+) passed, \1 total$' /tmp/174-c22.txt && test ! -e .expo/types/router.d.ts && bun run typecheck && bunx expo lint --no-cache > /tmp/174-lint.txt 2>&1 && test ! -s /tmp/174-lint.txt && git add ../docs/ui-guidelines.md ../specs/mobile-alerts-center/requirements.md ../specs/mobile-reminders-alerts-to-stack/requirements.md ../specs/mobile-alerts-grouped-and-detail-map/requirements.md ../specs/mobile-alert-detail-screen/requirements.md ../specs/mobile-chunky-cta/requirements.md && test "$(git diff --cached --no-renames --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'docs/ui-guidelines.md specs/mobile-alert-detail-screen/requirements.md specs/mobile-alerts-center/requirements.md specs/mobile-alerts-grouped-and-detail-map/requirements.md specs/mobile-chunky-cta/requirements.md specs/mobile-reminders-alerts-to-stack/requirements.md ' && git diff --quiet -- . ../docs ../specs && test -z "$(git ls-files --others --exclude-standard -- . ../docs ../specs)" && git commit -m 'docs(mobile): #174 R11 enmiendas a la carta y a cinco specs'
# -- c23 R12 nace-verde (paso 1, a mano): escribe los describes de "R12 (1)" de tasks.md en F (nacen verdes; su rojo lo demuestran las sondas S12.1-S12.6 de despues) --
# -- c23 (paso 2) cadena --
cd /home/claude/sites/Pet-Tracker-wt-174/mobile-pet-tracker && python3 ../specs/mobile-alerts-canvas-fidelity/mcheck.py cierre && { FORCE_COLOR=0 bunx jest --testTimeout=30000 --runTestsByPath src/__tests__/account-screens-polish.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/design-drift.test.ts src/__tests__/hero-header-amendments.test.ts src/__tests__/legibility-classnames.test.ts src/__tests__/profile-canvas-fidelity.test.ts src/__tests__/tab-headers-canvas.test.ts src/__tests__/ui-language.test.ts src/app/__tests__/alert-detail.navigation.test.tsx src/app/__tests__/detail-stack.test.tsx src/app/__tests__/layout.test.tsx src/app/__tests__/reminders-alerts-stack.navigation.test.tsx src/components/__tests__/empty-state.test.tsx src/providers/__tests__/language-provider.test.tsx src/screens/alert-detail/index.test.tsx src/screens/alerts/index.test.tsx src/theme/__tests__/global-css.test.ts src/theme/__tests__/motion.test.ts src/__tests__/alerts-canvas-fidelity.test.ts > /tmp/174-c23.txt 2>&1; echo "exit=$?"; } && grep -qE '^Test Suites: +19 passed, 19 total$' /tmp/174-c23.txt && grep -qE '^Tests: +([0-9]+) passed, \1 total$' /tmp/174-c23.txt && test ! -e .expo/types/router.d.ts && bun run typecheck && bunx expo lint --no-cache > /tmp/174-lint.txt 2>&1 && test ! -s /tmp/174-lint.txt && git add src/__tests__/alerts-canvas-fidelity.test.ts && test "$(git diff --cached --no-renames --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/__tests__/alerts-canvas-fidelity.test.ts ' && git diff --quiet -- . ../docs ../specs && test -z "$(git ls-files --others --exclude-standard -- . ../docs ../specs)" && git commit -m 'test(mobile): #174 R12 inventarios y grep-limpio de Alertas'

== SONDAS S12 (despues de c23; NUNCA se commitean) ==
# -- S12.1 sonda sobre el HEAD de c23 (NO se commitea) --
cd /home/claude/sites/Pet-Tracker-wt-174/mobile-pet-tracker && sed -i '0,/className="/s//className="rounded-10 /' src/screens/reminders/index.tsx && grep -cF 'className="rounded-10 ' src/screens/reminders/index.tsx && { FORCE_COLOR=0 bunx jest --testTimeout=30000 --runTestsByPath src/__tests__/alerts-canvas-fidelity.test.ts > /tmp/174-s12-1.txt 2>&1; true; }; grep -E '^Tests:' /tmp/174-s12-1.txt; grep -E '^  ● ' /tmp/174-s12-1.txt | grep -vxF '  ● Console'; cd /home/claude/sites/Pet-Tracker-wt-174/mobile-pet-tracker && git checkout HEAD -- src/screens/reminders/index.tsx && git diff --cached --quiet && git diff --quiet -- . ../docs ../specs && test -z "$(git ls-files --others --exclude-standard -- . ../docs ../specs)"; echo "limpio=$?"
   -> 1 ; Tests: 1 failed, <n> passed, <n+1> total ; UNA linea `  ● #174 R12: inventarios › ...` (fila rounded-10) ; limpio=0
# -- S12.2 sonda sobre el HEAD de c23 (NO se commitea) --
cd /home/claude/sites/Pet-Tracker-wt-174/mobile-pet-tracker && printf '// text-15\n' >> src/screens/reminders/index.tsx && grep -cF -- '// text-15' src/screens/reminders/index.tsx && { FORCE_COLOR=0 bunx jest --testTimeout=30000 --runTestsByPath src/__tests__/alerts-canvas-fidelity.test.ts > /tmp/174-s12-2.txt 2>&1; true; }; grep -E '^Tests:' /tmp/174-s12-2.txt; grep -E '^  ● ' /tmp/174-s12-2.txt | grep -vxF '  ● Console'; cd /home/claude/sites/Pet-Tracker-wt-174/mobile-pet-tracker && git checkout HEAD -- src/screens/reminders/index.tsx && git diff --cached --quiet && git diff --quiet -- . ../docs ../specs && test -z "$(git ls-files --others --exclude-standard -- . ../docs ../specs)"; echo "limpio=$?"
   -> 1 ; Tests: 1 failed, <n> passed, <n+1> total ; UNA linea `  ● #174 R12: inventarios › ...` (fila text-15) ; limpio=0
# -- S12.3 sonda sobre el HEAD de c23 (NO se commitea) --
cd /home/claude/sites/Pet-Tracker-wt-174/mobile-pet-tracker && printf '// border-b-5\n' >> src/screens/alerts/index.tsx && grep -cF -- '// border-b-5' src/screens/alerts/index.tsx && { FORCE_COLOR=0 bunx jest --testTimeout=30000 --runTestsByPath src/__tests__/alerts-canvas-fidelity.test.ts > /tmp/174-s12-3.txt 2>&1; true; }; grep -E '^Tests:' /tmp/174-s12-3.txt; grep -E '^  ● ' /tmp/174-s12-3.txt | grep -vxF '  ● Console'; cd /home/claude/sites/Pet-Tracker-wt-174/mobile-pet-tracker && git checkout HEAD -- src/screens/alerts/index.tsx && git diff --cached --quiet && git diff --quiet -- . ../docs ../specs && test -z "$(git ls-files --others --exclude-standard -- . ../docs ../specs)"; echo "limpio=$?"
   -> 1 ; Tests: 1 failed, <n> passed, <n+1> total ; UNA linea de #174 R12 (el recuento de border-b-5) ; limpio=0
# -- S12.4 sonda sobre el HEAD de c23 (NO se commitea) --
cd /home/claude/sites/Pet-Tracker-wt-174/mobile-pet-tracker && printf '// 🔔\n' >> src/utils/alert-meta.ts && grep -cF -- '// 🔔' src/utils/alert-meta.ts && { FORCE_COLOR=0 bunx jest --testTimeout=30000 --runTestsByPath src/__tests__/alerts-canvas-fidelity.test.ts > /tmp/174-s12-4.txt 2>&1; true; }; grep -E '^Tests:' /tmp/174-s12-4.txt; grep -E '^  ● ' /tmp/174-s12-4.txt | grep -vxF '  ● Console'; cd /home/claude/sites/Pet-Tracker-wt-174/mobile-pet-tracker && git checkout HEAD -- src/utils/alert-meta.ts && git diff --cached --quiet && git diff --quiet -- . ../docs ../specs && test -z "$(git ls-files --others --exclude-standard -- . ../docs ../specs)"; echo "limpio=$?"
   -> 1 ; Tests: 1 failed, <n> passed, <n+1> total ; UNA linea `  ● #174 R12: grep-limpio › ...` (alert-meta) ; limpio=0
# -- S12.5 sonda sobre el HEAD de c23 (NO se commitea) --
cd /home/claude/sites/Pet-Tracker-wt-174/mobile-pet-tracker && printf '// shadow-sm\n' >> src/screens/alerts/index.tsx && grep -cF -- '// shadow-sm' src/screens/alerts/index.tsx && { FORCE_COLOR=0 bunx jest --testTimeout=30000 --runTestsByPath src/__tests__/alerts-canvas-fidelity.test.ts > /tmp/174-s12-5.txt 2>&1; true; }; grep -E '^Tests:' /tmp/174-s12-5.txt; grep -E '^  ● ' /tmp/174-s12-5.txt | grep -vxF '  ● Console'; cd /home/claude/sites/Pet-Tracker-wt-174/mobile-pet-tracker && git checkout HEAD -- src/screens/alerts/index.tsx && git diff --cached --quiet && git diff --quiet -- . ../docs ../specs && test -z "$(git ls-files --others --exclude-standard -- . ../docs ../specs)"; echo "limpio=$?"
   -> 1 ; Tests: 1 failed, <n> passed, <n+1> total ; UNA linea de #174 R12 (clases salientes) ; limpio=0
# -- S12.6 sonda sobre el HEAD de c23 (NO se commitea) --
cd /home/claude/sites/Pet-Tracker-wt-174/mobile-pet-tracker && sed -i 's/mt-1.5 text-13 /mt-1.5 /' src/screens/alerts/index.tsx && test "$(grep -cF 'mt-1.5 text-13 ' src/screens/alerts/index.tsx)" = 0 && echo 0 && { FORCE_COLOR=0 bunx jest --testTimeout=30000 --runTestsByPath src/__tests__/alerts-canvas-fidelity.test.ts src/screens/alerts/index.test.tsx > /tmp/174-s12-6.txt 2>&1; true; }; grep -E '^Tests:' /tmp/174-s12-6.txt; grep -E '^  ● ' /tmp/174-s12-6.txt | grep -vxF '  ● Console'; cd /home/claude/sites/Pet-Tracker-wt-174/mobile-pet-tracker && git checkout HEAD -- src/screens/alerts/index.tsx && git diff --cached --quiet && git diff --quiet -- . ../docs ../specs && test -z "$(git ls-files --others --exclude-standard -- . ../docs ../specs)"; echo "limpio=$?"
   -> 0 ; Tests: 2 failed, <n> passed, <n+2> total ; DOS lineas: una `  ● #174 R12: ...` (F, R12.4) y una de A (`#170 R3 ... (enmendado por #174 R6)`) ; limpio=0
   (si el primer numero no es el esperado, la sonda no se planto: PARA. Si limpio no es 0, PARA. Si el recuento de
    fallos no cuadra, PARA y anotalo en el impl: no se ajusta la sonda.)

== CIERRE ==
# -- K1 its estaticos finales (sin valor esperado; apuntalos en el impl) --
cd /home/claude/sites/Pet-Tracker-wt-174/mobile-pet-tracker && for f in src/screens/alerts/index.test.tsx src/theme/__tests__/global-css.test.ts src/providers/__tests__/language-provider.test.tsx src/app/__tests__/layout.test.tsx src/__tests__/consistency-classnames.test.ts src/__tests__/profile-canvas-fidelity.test.ts src/__tests__/alerts-canvas-fidelity.test.ts src/__tests__/ui-language.test.ts; do echo "$f $(grep -cE '^\s*it(\.each)?[(<]' $f)"; done
# -- K2 BASE19 final --
cd /home/claude/sites/Pet-Tracker-wt-174/mobile-pet-tracker && { FORCE_COLOR=0 bunx jest --testTimeout=30000 --runTestsByPath src/__tests__/account-screens-polish.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/design-drift.test.ts src/__tests__/hero-header-amendments.test.ts src/__tests__/legibility-classnames.test.ts src/__tests__/profile-canvas-fidelity.test.ts src/__tests__/tab-headers-canvas.test.ts src/__tests__/ui-language.test.ts src/app/__tests__/alert-detail.navigation.test.tsx src/app/__tests__/detail-stack.test.tsx src/app/__tests__/layout.test.tsx src/app/__tests__/reminders-alerts-stack.navigation.test.tsx src/components/__tests__/empty-state.test.tsx src/providers/__tests__/language-provider.test.tsx src/screens/alert-detail/index.test.tsx src/screens/alerts/index.test.tsx src/theme/__tests__/global-css.test.ts src/theme/__tests__/motion.test.ts src/__tests__/alerts-canvas-fidelity.test.ts > /tmp/174-k2.txt 2>&1; echo "exit=$?"; } && grep -qE '^Test Suites: +19 passed, 19 total$' /tmp/174-k2.txt && grep -E '^Tests:' /tmp/174-k2.txt
   -> exit=0 ; Tests: K passed, K total   (K es tu numero; apuntalo)
# -- K3 ALL, tras la espera --
cd /home/claude/sites/Pet-Tracker-wt-174/mobile-pet-tracker && for i in $(seq 1 90); do pgrep -f 'node_modules/(\.bin/jest|jest-worker)|[i]nit\.sh' > /dev/null || break; sleep 60; done; echo fin-espera
cd /home/claude/sites/Pet-Tracker-wt-174/mobile-pet-tracker && FORCE_COLOR=0 bunx jest --testTimeout=30000 > /tmp/174-kall.txt 2>&1; echo "exit=$?"
cd /home/claude/sites/Pet-Tracker-wt-174/mobile-pet-tracker && K=$(sed -nE 's/^Tests: +([0-9]+) passed, \1 total$/\1/p' /tmp/174-k2.txt) && test -n "$K" && T=$((3389 + K - 670)) && grep -qE '^Test Suites: +111 passed, 111 total$' /tmp/174-kall.txt && grep -qE "^Tests: +$T passed, $T total$" /tmp/174-kall.txt && echo "all-ok T=$T"
   -> exit=0 ; all-ok T=<3389 + K - 670>
   El aviso de worker force-exit al final del ALL es preexistente y no cuenta.
   Si el ALL sale rojo, aplica «Flake de un it ajeno» a cada `●` ajeno, repite el ALL una vez tras la espera y comprueba
   que la linea Tests: suma el total T. Cualquier otro rojo: PARA.
cd /home/claude/sites/Pet-Tracker-wt-174/mobile-pet-tracker && bun run typecheck; echo "exit=$?"
   -> exit=0
cd /home/claude/sites/Pet-Tracker-wt-174/mobile-pet-tracker && bunx expo lint --no-cache > /tmp/174-lint.txt 2>&1; echo "exit=$?"; ! grep -qF 'Failed to run' /tmp/174-lint.txt && test ! -s /tmp/174-lint.txt && echo lint-ok
   -> exit=0 ; lint-ok
cd /home/claude/sites/Pet-Tracker-wt-174/mobile-pet-tracker && git log --oneline $(git log -1 --format=%H --grep='^docs(progress): #174 handoff a Codex (H0)')..HEAD | wc -l
   -> 23
# -- K4 trazabilidad (commit unico) y despues el impl con --only --
Rellena specs/mobile-alerts-canvas-fidelity/traceability.md:
  - cada fila lleva el test (fichero::describe) y el hash + mensaje de sus commits (rojo y verde);
  - la fila de R13 se queda "pendiente (gate humano: casilla de requirements §6)".
cd /home/claude/sites/Pet-Tracker-wt-174/mobile-pet-tracker && git add ../specs/mobile-alerts-canvas-fidelity/traceability.md && test "$(git diff --cached --no-renames --name-only)" = 'specs/mobile-alerts-canvas-fidelity/traceability.md' && git diff --quiet -- . ../docs ../specs && test -z "$(git ls-files --others --exclude-standard -- . ../docs ../specs)" && git commit -m 'docs(mobile): #174 trazabilidad'
cd /home/claude/sites/Pet-Tracker-wt-174/mobile-pet-tracker && git add ../progress/impl_mobile-alerts-canvas-fidelity.md && git commit --only ../progress/impl_mobile-alerts-canvas-fidelity.md -m 'docs(mobile): informe de implementación de #174'
# -- K5 lista cerrada contra <H0> --
cd /home/claude/sites/Pet-Tracker-wt-174/mobile-pet-tracker && test "$(git diff --no-renames --name-only $(git log -1 --format=%H --grep='^docs(progress): #174 handoff a Codex (H0)')..HEAD -- .. | grep -vxE 'feature_list\.json|progress/current\.md|progress/handoff_mobile-alerts-canvas-fidelity\.md|specs/mobile-alerts-canvas-fidelity/(requirements|design|tasks)\.md|specs/mobile-alerts-canvas-fidelity/mcheck\.py|progress/review_mobile-alerts-canvas-fidelity\.md' | LC_ALL=C sort | tr '\n' ' ')" = 'docs/ui-guidelines.md mobile-pet-tracker/src/__tests__/alerts-canvas-fidelity.test.ts mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts mobile-pet-tracker/src/__tests__/profile-canvas-fidelity.test.ts mobile-pet-tracker/src/__tests__/ui-copy-table.ts mobile-pet-tracker/src/app/__tests__/layout.test.tsx mobile-pet-tracker/src/app/_layout.tsx mobile-pet-tracker/src/i18n/catalog.ts mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx mobile-pet-tracker/src/screens/alerts/index.test.tsx mobile-pet-tracker/src/screens/alerts/index.tsx mobile-pet-tracker/src/theme/__tests__/global-css.test.ts mobile-pet-tracker/src/theme/global.css mobile-pet-tracker/src/utils/alert-meta.ts progress/impl_mobile-alerts-canvas-fidelity.md specs/mobile-alert-detail-screen/requirements.md specs/mobile-alerts-canvas-fidelity/traceability.md specs/mobile-alerts-center/requirements.md specs/mobile-alerts-grouped-and-detail-map/requirements.md specs/mobile-chunky-cta/requirements.md specs/mobile-reminders-alerts-to-stack/requirements.md specs/mobile-ui-language/design.md ' && echo lista-ok
   -> lista-ok   (las 22 rutas de §Lista cerrada, abajo; si sale otra, PARA)

== REGLAS CRITICAS ==
- NO prettier, en ninguna forma (ni bunx prettier ni --fix de prettier). Formatea a mano, imitando el fichero.
- Nunca `rm -f .expo/types/router.d.ts`: `test ! -e`, y si existe PARA.
- Un commit = un R y un tipo (rojo test / verde feat o docs). Nunca --amend, rebase, push, PR ni merge.
- NO lances ./init.sh.
- Si un eslabon falla (y no es el caso de "Reintento" ni de "Flake"), PARA y reporta el eslabon y la salida exacta. No
  ajustes tests ni candados para que cuadre.
- RNTL 14: `await render(...)`, `await fireEvent.press(...)`, `await act(...)` siempre.
  - Nodos ocultos a accesibilidad: `{ includeHiddenElements: true }`.
  - `within(x)` no ve la raiz `x`.
  - Recuentos por hijos (`children.length`, orden de testID), no `getAllByTestId(...).length`.
- Clases en los tests: literales escritos en el test, nunca importados de produccion.
- Candados globales: solo por delta sobre la base, cada termino con `// #174 Rn`. Ninguna cifra se recalcula a mano.
- Catalogo, tabla de copy, design.md de ui-language y termino de longitud viajan en el MISMO commit verde que la llamada
  t(...) que los usa (tasks.md §Reglas comunes).
- Comentarios de trazabilidad `// #174 Rn`; nunca `#174` suelto seguido de letra hex (HEX_LITERAL de design-drift).
  Nada de clases arbitrarias `algo-[...]`, ni en tests. Sin Date.now() en render (react-hooks/purity).
- No pidas skills por un nombre que no este en tu catalogo (ver Skills).
- La casilla de la enmienda se escribe SIN marcar en los 6 ficheros: `- [ ] Enmienda #174 aprobada por humano`.
- R13 (prueba de humo en dev build de Android) NO la corres: queda "pendiente (humano)".
- Alert detail (src/screens/alert-detail/) NO se toca (M37); tampoco backend ni infra (M38).
- No toques:
  - feature_list.json, progress/current.md, progress/history.md, STATUS.md ni este handoff;
  - requirements/design/tasks.md de #174 ni specs/mobile-alerts-canvas-fidelity/mcheck.py;
  - progress/review_mobile-alerts-canvas-fidelity.md;
  - ningun fichero fuera de la lista cerrada.
- No abras ni edites la PR: la abre el leader.
- Las sondas S12 nunca se commitean. Revierte con `git checkout HEAD -- <f>` y exige limpio=0.
```

## Lista cerrada (`git diff --no-renames --name-only <H0>..HEAD`, sin los excluidos, `LC_ALL=C sort`)

```text
docs/ui-guidelines.md
mobile-pet-tracker/src/__tests__/alerts-canvas-fidelity.test.ts
mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts
mobile-pet-tracker/src/__tests__/profile-canvas-fidelity.test.ts
mobile-pet-tracker/src/__tests__/ui-copy-table.ts
mobile-pet-tracker/src/app/__tests__/layout.test.tsx
mobile-pet-tracker/src/app/_layout.tsx
mobile-pet-tracker/src/i18n/catalog.ts
mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx
mobile-pet-tracker/src/screens/alerts/index.test.tsx
mobile-pet-tracker/src/screens/alerts/index.tsx
mobile-pet-tracker/src/theme/__tests__/global-css.test.ts
mobile-pet-tracker/src/theme/global.css
mobile-pet-tracker/src/utils/alert-meta.ts
progress/impl_mobile-alerts-canvas-fidelity.md
specs/mobile-alert-detail-screen/requirements.md
specs/mobile-alerts-canvas-fidelity/traceability.md
specs/mobile-alerts-center/requirements.md
specs/mobile-alerts-grouped-and-detail-map/requirements.md
specs/mobile-chunky-cta/requirements.md
specs/mobile-reminders-alerts-to-stack/requirements.md
specs/mobile-ui-language/design.md
```

Excluidos:
- `feature_list.json`, `progress/current.md` y este handoff;
- `specs/mobile-alerts-canvas-fidelity/{requirements,design,tasks}.md` y `mcheck.py`;
- `progress/review_mobile-alerts-canvas-fidelity.md`.

Son ficheros del leader.

## Criterios de terminado

- Los 23 commits c1–c23 están en orden, con los mensajes de arriba. Después van la trazabilidad y el impl.
- Ningún commit mezcla tests rojos con implementación.
- Todas las cadenas terminaron en `git commit`, sin que fallara ningún eslabón. Si hubo reintentos, están anotados.
- Las seis sondas S12.1–S12.6 dieron el recuento esperado y `limpio=0`.
- El mcheck de cierre de c23 sale con `exit=0`: P1–P8, S1–S7 y M1–M38 = «Al cerrar».
- K2–K5 en verde: BASE19 = K; ALL = 111 suites y `3389 + K − 670` tests; typecheck y lint limpios; 23 commits; lista cerrada exacta.
- R13 queda pendiente del humano. Las 6 casillas de enmienda, sin marcar.

## Contenido de `progress/impl_mobile-alerts-canvas-fidelity.md`

1. H0 (hash) y las salidas de B0–B2, con el fichero `/tmp/174-m-h0.txt` pegado entero.
2. Tabla de anclas H0 con lo medido. Todas deben coincidir.
3. Skills que cargaste de verdad, por nombre, y para qué sirvió cada una.
4. Tabla por commit:
   - hash, mensaje, R, tipo y línea `Tests:` literal;
   - en los rojos, además, la lista de `●` (sin `Console`) y si tsc/lint dieron errores en tests: código TS y fichero.
5. Sondas S12.1–S12.6: línea `Tests:`, los `●` y `limpio=`.
6. Salida entera del mcheck de cierre de c23.
7. Cierre K1–K5 con sus salidas literales. En K1, los `it` finales.
8. Desviaciones: todo lo que no salió como dice este handoff, con la salida exacta. Incluye los reintentos y el flake de K3.
   Si no hubo ninguna, escribe «ninguna».
9. R13: «pendiente (humano)».
