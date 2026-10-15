# Handoff a Codex CLI — #172 mobile-account-screens-polish

> **Nota del leader (2026-10-13).** Spec firmada en `a1e955bd` (Notion, última
> edición 2026-10-13T18:43Z). H0 es el commit que contiene este fichero
> (`git rev-parse HEAD` al arrancar). El leader ya ejecutó T0 sobre H0:
> B3–B28 y las cuentas de `it` cuadran con requirements.md §Base medida;
> `$J $BASE` da `Test Suites: 12 passed` y `Tests: 409 passed, 409 total`;
> `$J $READERS` da 4 suites y 191 tests; typecheck y lint salen limpios.
> El leader instaló dependencias (`bun install --frozen-lockfile`, sin
> cambios en `package.json` ni `bun.lock`), así que en T0 B2 da **`0`**:
> anótalo y no reinstales.
>
> **Enmienda E1 (2026-10-13), firmada antes de lanzarte.** Los tokens de texto
> de R1 se llaman por su valor: `--text-13`, `--text-15` y `--text-17` (clases
> `text-13`, `text-15`, `text-17`). requirements.md, design.md y tasks.md ya
> lo dicen; si encuentras `text-label`, `text-body` o `text-cta` fuera de
> §Enmienda E1, PARA y reporta.

```text
Worktree: /home/claude/sites/Pet-Tracker-wt-172   <- PRIMERA LINEA. Trabaja AQUI y en ningun otro sitio
Branch:   feature/172-mobile-account-screens-polish   (H0 = git rev-parse HEAD al arrancar; anotalo en el impl)
NO lances ./init.sh en ningun momento, aunque AGENTS.md lo pida: lo corre el leader antes del reviewer.
Ni bunx jest sin rutas, ni push, ni PR, ni amend, ni rebase, ni prettier.

== GUION ==
Lee ENTEROS specs/mobile-account-screens-polish/requirements.md, design.md y tasks.md.
El guion es tasks.md T0-T22, en orden, con sus mensajes de commit literales (c1-c7, c7b, c8-c39) y sus gates.
Si este handoff y tasks.md discrepan, manda este handoff.

== REGLAS CRITICAS ==
1. Test primero, commit a commit: el rojo (test(mobile): ...) solo trae tests y candados y su gate da EXACTAMENTE
   los rojos de su tabla; el verde (feat(mobile): ...) trae la implementacion. NUNCA un commit con tests e
   implementacion juntos. Las excepciones que nacen verdes son solo las del encabezado de tasks.md, cada una con su sonda.
2. Las sondas de mutacion NUNCA se commitean: plantar, correr, `git checkout HEAD -- <fichero>`,
   `git diff --quiet HEAD -- <fichero>; echo "exit=$?"` -> exit=0. Anota su salida literal en el impl.
3. Si un rojo sale de otro tipo (consulta / asercion / modulo) o con otra cuenta que la de su tabla, PARA y reporta
   el commit, el comando y la salida exacta. No ajustes tests ni anclas para que cuadre.
4. Cifras que otras features pueden mover (B7, B8, B9, B10, B11, B16, B20, B21): la cifra futura es H0 + delta,
   nunca la de la tabla si H0 midio otra.
5. `cd mobile-pet-tracker` al empezar cada bloque. Un fallo por directorio (Cannot find module, ENOENT de
   package.json) es error de invocacion: repite con el cd, sin tocar codigo.
6. `test ! -e .expo/types/router.d.ts; echo "exit=$?"` -> exit=0 antes de cada typecheck. Si da 1, PARA (NUNCA rm -f).
7. Si el sandbox deniega algo, PARA y reporta el comando; no busques otro camino.

== ASSET (T7, c14) ==
El leader ya descargo y verifico la fuente fuera del repo: /tmp/inter-172/Inter-ExtraBold.ttf
(sha256 e6756ad5690b77606aa62249a7b420d9902d45cae4b0048a24911fd4324b0a22, 421796 bytes).
SALTA curl y unzip. Ejecuta solo `sha256sum` y `stat -c %s` sobre ese fichero; si cuadran los dos, el `cp` de T7.
Si el fichero no existe o no cuadra, PARA.

== JEST, LINT Y CARGA ==
- J="bunx jest --testTimeout=30000 --runTestsByPath". Rutas con parentesis entre comillas simples.
- `Exceeded timeout`: es carga de otro worktree. Repite ese comando UNA vez; si se repite, PARA.
- Lint muerto por memoria: si /tmp/lint-172.log contiene `Failed to run "eslint" due to signal SIGKILL`, espera con
  cd /home/claude/sites/Pet-Tracker-wt-172/mobile-pet-tracker && for i in $(seq 1 30); do pgrep -f 'node_modules/(\.bin/(jest|eslint)|jest-worker)|[i]nit\.sh' > /dev/null || break; sleep 60; done; echo "fin-espera"
  y relanza solo la linea de lint, UNA vez. Anotalo en desviaciones como carga.
- Antes del Jest de T22 paso 3, la misma espera (hasta 90 iteraciones).

== SKILLS ==
Del plugin expo: building-native-ui. Del repo (.agents/skills/): appllama-app-design-skill (obligatoria por la
carta al cambiar pantallas) y animate-expo para PingoFloat (R4). Las decisiones de movimiento (10 px, 1500 ms por
tramo, ease-in-out, reduce motion) ya estan en la spec: mandan sobre cualquier skill.
Di en el impl cuales cargaste.

== CIERRE (T22) ==
- progress/impl_mobile-account-screens-polish.md: H0; salidas de T0; tabla por commit (hash, mensaje, linea Tests:,
  numero de rojos y su tipo); sondas literales; anclas de T22 paso 5 literales; skills cargadas; desviaciones
  ("ninguna" si no hubo). R21 queda "pendiente (humano)".
- traceability.md: hash y mensaje por R y sus `it`. Commit `docs(mobile-account-screens-polish): #172 trazabilidad`
  con rutas explicitas; despues el impl con
  `git commit --only ../progress/impl_mobile-account-screens-polish.md -m 'docs(mobile-account-screens-polish): #172 informe de implementación'`.
- No toques feature_list.json, progress/current.md ni el frontmatter de la spec: son del leader.
```

## Reanudación 1 — Enmienda E2 (2026-10-13)

Paraste bien en T4/c8: la spec ponía los dos nombres de Pingo en una posición
que `.sort()` no da. La Enmienda E2 (requirements.md §Enmienda E2, tasks.md T4
«(1b) Corrección del rojo, c7b») lo corrige.

```text
Worktree: /home/claude/sites/Pet-Tracker-wt-172   <- PRIMERA LINEA. Trabaja AQUI y en ningun otro sitio
Branch:   feature/172-mobile-account-screens-polish
Siguen en vigor TODAS las reglas de arriba (init.sh, push, PR, amend, rebase, prettier, JEST/LINT/CARGA, SKILLS).

== ANTES DE TOCAR NADA ==
1. command grep -c -F -- '- [x] Enmienda E2 aprobada por humano' specs/mobile-account-screens-polish/requirements.md
   -> 1. Si da 0, PARA: E2 no esta firmada.
2. git status --short -> sin salida.
3. git log -1 --format=%h -- mobile-pet-tracker -> e31582c3 (tu c7).
4. H0 sigue siendo e0178ab5. Los commits del leader entre H0 y HEAD no son tuyos: 94ddc750 (firma E1) y los
   de E2 (enmienda, handoff y firma). No los toques, no los reviertas y no los cuentes como tuyos.

== GUION DE LA REANUDACION ==
1. c7b segun tasks.md T4 (1b): cd mobile-pet-tracker; mueve SOLO las dos lineas en motion.test.ts; anclas de
   c7b; gate = mismo comando y mismos rojos que c7 (2 suites failed; Tests: 2 failed, 15 passed, 17 total).
   Commit literal: test(mobile): orden de sort en el inventario de motion (R4)
2. c8 segun T4 (2). Puedes reconstruir la candidata desde /tmp/pingo-float-c8-172.tsx y el diff de motion.ts
   de tu informe, pero vuelve a correr TODAS sus anclas y su gate: exit=0, sin rojos.
3. Sondas S4a-S4e, y sigue T5-T22 en orden, sin renumerar (c9-c39).

== CIERRE ==
- Reescribe progress/impl_mobile-account-screens-polish.md (el mismo fichero): Estado al final, tabla con c7b,
  y una seccion "Reanudacion 1" con lo que paso. La seccion de bloqueo queda como historia, no la borres.
- Trazabilidad completa en specs/mobile-account-screens-polish/traceability.md. Commits literales:
  docs(mobile-account-screens-polish): #172 trazabilidad completa
  y luego git commit --only ../progress/impl_mobile-account-screens-polish.md -m 'docs(mobile-account-screens-polish): #172 informe de implementación completo'
```


## Reanudación 2 — Enmienda E3 (2026-10-14)

Paraste bien en S10b: el rojo que pedía la spec era imposible, porque
`FieldError` no pinta sus hijos con el campo válido. La Enmienda E3
(requirements.md §Enmienda E3, R10 y la fila S10b de tasks.md T11) define la
sonda de nuevo. c21 y c22 se quedan como están.

```text
Worktree: /home/claude/sites/Pet-Tracker-wt-172   <- PRIMERA LINEA. Trabaja AQUI y en ningun otro sitio
Branch:   feature/172-mobile-account-screens-polish
Siguen en vigor TODAS las reglas de arriba (init.sh, push, PR, amend, rebase, prettier, JEST/LINT/CARGA, SKILLS).

== ANTES DE TOCAR NADA ==
1. command grep -c -F -- '- [x] Enmienda E3 aprobada por humano' specs/mobile-account-screens-polish/requirements.md
   -> 1. Si da 0, PARA: E3 no esta firmada.
2. git status --short -> sin salida.
3. git log -1 --format=%h -- mobile-pet-tracker -> 14c69144 (tu c22).
4. H0 sigue siendo e0178ab5. Los commits del leader entre H0 y HEAD no son tuyos: 94ddc750 (firma E1), los de E2
   y los de E3 (enmienda, handoff y firma). No los toques, no los reviertas y no los cuentes como tuyos.

== GUION DE LA REANUDACION ==
1. Sonda S10b nueva. cd mobile-pet-tracker. En src/screens/register/index.tsx sustituye las tres lineas del
   FieldError de apellidos (desde <FieldError testID="register-last-name-error"> hasta su </FieldError>) por estas dos:
     <FieldError testID="register-last-name-error">{null}</FieldError>
     <FormError testID="register-last-name-message" message={fieldErrors.lastName ?? ''} />
   Ancla: command grep -cF '<FieldError testID="register-last-name-error">{null}</FieldError>' src/screens/register/index.tsx -> 1
   $J src/screens/register/index.test.tsx -> Tests: 3 failed, 26 passed, 29 total
   Los tres bloques ● (sin contar los "● Console") son EXACTAMENTE estos, en cualquier orden:
     #172 R10: cada campo con error lleva icono y texto seleccionable -> Unable to find an element with testID: register-last-name-message-row
     #172 R10: sin errores ningún campo pinta mensaje -> Received length: 2
     #167 R8: el icono del error mide 14 y usa danger -> Found multiple elements with testID: icon-alert-circle
   Restaura: git checkout HEAD -- src/screens/register/index.tsx; git diff --quiet HEAD -- src/screens/register/index.tsx; echo "exit=$?" -> exit=0
   S10a y S10c ya salieron como pedia la spec: no las repitas.
2. Desde aqui, en CADA rojo y en CADA sonda, compara el titulo de cada ● con su tabla ANTES de pasar al paso
   siguiente. Que cuadren el exit y el numero de fallos no basta.
3. Sigue T12-T22 en orden, sin renumerar (c23-c39).

== CIERRE ==
- Reescribe progress/impl_mobile-account-screens-polish.md (el mismo fichero): Estado al final, tabla completa y una
  seccion "Reanudacion 2" con la salida literal de S10b. Las secciones de bloqueo quedan como historia, no las borres.
- Trazabilidad completa en specs/mobile-account-screens-polish/traceability.md. Commits literales:
  docs(mobile-account-screens-polish): #172 trazabilidad completa
  y luego git commit --only ../progress/impl_mobile-account-screens-polish.md -m 'docs(mobile-account-screens-polish): #172 informe de implementación completo'
```

## Reanudación 3 — Enmienda E4 (2026-10-14)

Paraste bien en S14: la tabla de T15 contaba un candado que no ve
`bg-accent-soft`. La Enmienda E4 (requirements.md §Enmienda E4 y tasks.md T15)
pide 6 fallos, que son los que diste. S14 no se repite.

```text
Worktree: /home/claude/sites/Pet-Tracker-wt-172   <- PRIMERA LINEA. Trabaja AQUI y en ningun otro sitio
Branch:   feature/172-mobile-account-screens-polish
Siguen en vigor TODAS las reglas de arriba (init.sh, push, PR, amend, rebase, prettier, JEST/LINT/CARGA, SKILLS),
incluida la de comparar el titulo de cada ● con su tabla antes de avanzar (Reanudacion 2, paso 2).

== ANTES DE TOCAR NADA ==
1. command grep -c -F -- '- [x] Enmienda E4 aprobada por humano' specs/mobile-account-screens-polish/requirements.md
   -> 1. Si da 0, PARA: E4 no esta firmada.
2. git status --short -> sin salida.
3. git log -1 --format=%h -- mobile-pet-tracker -> 7ddda8f5 (tu c30).
4. H0 sigue siendo e0178ab5. Los commits del leader entre H0 y HEAD no son tuyos: 94ddc750, los de E2, los de E3
   y los de E4 (enmienda, handoff y firma). No los toques, no los reviertas y no los cuentes como tuyos.

== GUION DE LA REANUDACION ==
1. En el informe, marca S14 como conforme a E4 (6 failed, los seis titulos que ya anotaste). No la repitas.
2. Sigue T16-T22 en orden, sin renumerar (c31-c39).

== CIERRE ==
- Reescribe progress/impl_mobile-account-screens-polish.md (el mismo fichero): Estado al final, tabla completa y una
  seccion "Reanudacion 3". Las secciones de bloqueo quedan como historia, no las borres.
- Trazabilidad completa en specs/mobile-account-screens-polish/traceability.md. Commits literales:
  docs(mobile-account-screens-polish): #172 trazabilidad completa
  y luego git commit --only ../progress/impl_mobile-account-screens-polish.md -m 'docs(mobile-account-screens-polish): #172 informe de implementación completo'
```

## Reanudación 4 — Enmienda E5 (2026-10-14)

Paraste bien en S15: la tabla de T16 no contaba la consulta de `login-error`
dentro de `login-body` que R7 heredó de H0. La Enmienda E5 (requirements.md
§Enmienda E5 y tasks.md T16) pide 3 fallos, que son los que diste. S15 no se
repite. La E5 también corrige S17b (T18): ahora da 2 fallos, porque `C8: la UI
no usa clases arbitrarias` recorre todo `src/`. Y el gate de T16 cuenta 28
tests en login, no 25.

```text
Worktree: /home/claude/sites/Pet-Tracker-wt-172   <- PRIMERA LINEA. Trabaja AQUI y en ningun otro sitio
Branch:   feature/172-mobile-account-screens-polish
Siguen en vigor TODAS las reglas de arriba (init.sh, push, PR, amend, rebase, prettier, JEST/LINT/CARGA, SKILLS),
incluida la de comparar el titulo de cada ● con su tabla antes de avanzar (Reanudacion 2, paso 2).

== ANTES DE TOCAR NADA ==
1. command grep -c -F -- '- [x] Enmienda E5 aprobada por humano' specs/mobile-account-screens-polish/requirements.md
   -> 1. Si da 0, PARA: E5 no esta firmada.
2. git status --short -> sin salida.
3. git log -1 --format=%h -- mobile-pet-tracker -> 0e5bb776 (tu c31).
4. H0 sigue siendo e0178ab5. Los commits del leader entre H0 y HEAD no son tuyos: 94ddc750, los de E2, los de E3,
   los de E4 y los de E5 (enmienda, handoff y firma). No los toques, no los reviertas y no los cuentes como tuyos.

== GUION DE LA REANUDACION ==
1. En el informe, marca S15 como conforme a E5 (3 failed, los tres titulos que ya anotaste). No la repitas.
2. Sigue T17-T22 en orden, sin renumerar (c32-c39). S17b espera 2 failed (tabla de T18).

== CIERRE ==
- Reescribe progress/impl_mobile-account-screens-polish.md (el mismo fichero): Estado al final, tabla completa y una
  seccion "Reanudacion 4". Las secciones de bloqueo quedan como historia, no las borres.
- Trazabilidad completa en specs/mobile-account-screens-polish/traceability.md. Commits literales:
  docs(mobile-account-screens-polish): #172 trazabilidad completa
  y luego git commit --only ../progress/impl_mobile-account-screens-polish.md -m 'docs(mobile-account-screens-polish): #172 informe de implementación completo'
```

## Reanudación 5 — Enmienda E6 (2026-10-14)

La review ronda 1 rechazó #172 (b6c09d5e). Producción cumple, pero cuatro
mutaciones de producción pasaban en verde porque la spec no prescribía su
candado. El hueco era de la spec, no tuyo. La Enmienda E6 (requirements.md
§Enmienda E6 y tasks.md T24) añade cinco `it` que nacen verdes, cada uno con
su sonda, en tres commits `test(mobile)` (c40–c42). No se toca producción.

```text
Worktree: /home/claude/sites/Pet-Tracker-wt-172   <- PRIMERA LINEA. Trabaja AQUI y en ningun otro sitio
Branch:   feature/172-mobile-account-screens-polish
Siguen en vigor TODAS las reglas de arriba (init.sh, push, PR, amend, rebase, prettier, JEST/LINT/CARGA, SKILLS),
incluida la de comparar el titulo de cada ● con su tabla antes de avanzar (Reanudacion 2, paso 2).

== ANTES DE TOCAR NADA ==
1. command grep -c -F -- '- [x] Enmienda E6 aprobada por humano' specs/mobile-account-screens-polish/requirements.md
   -> 1. Si da 0, PARA: E6 no esta firmada.
2. git status --short -> sin salida.
3. git log -1 --format=%h -- mobile-pet-tracker -> 4ba7e139 (tu c39).
4. H0 sigue siendo e0178ab5. Entre H0 y HEAD hay commits que no son tuyos: 94ddc750, los de E2 a E6
   (enmienda, handoff y firma) y la review b6c09d5e. No los toques, no los reviertas y no los cuentes como tuyos.
   progress/review_mobile-account-screens-polish.md tampoco es tuyo: no lo edites.
5. Base de la reanudacion. Desde mobile-pet-tracker, con J del Preambulo de tasks.md:
   $J src/components/__tests__/pingo-float.test.tsx src/components/__tests__/back-button.test.tsx src/screens/register/index.test.tsx; echo "exit=$?"
   -> exit=0 y Tests: 41 passed (3 + 5 + 33). Si da otra cifra, anotala y aplica el delta de T24 (+2, +1, +3).

== GUION DE LA REANUDACION ==
1. tasks.md T24 en orden: c40, c41 y c42. Cada commit trae solo su fichero de test, con el codigo literal de T24.
   Ningun commit toca produccion.
2. Orden dentro de cada commit: ancla (grep -cF, debe dar 1), anadir el it, gate verde, sondas de su tabla, commit.
   Las sondas mutan produccion y se revierten con git checkout HEAD -- <fichero>; nunca se commitean.
   Si una sonda no da exactamente los rojos y el tipo de su tabla, PARA: no cambies ni el test ni produccion.
3. Despues, T22 entero con las cifras de E6: 67 tests mas que H0, 17 suites, e historial c1-c7, c7b y c8-c42.

== CIERRE ==
- Reescribe progress/impl_mobile-account-screens-polish.md (el mismo fichero): Estado al final, tabla completa y una
  seccion "Reanudacion 5" con la salida literal de cada gate y de cada sonda (S4f, S4g, S4h, S2c, S12b, S12c, S12d).
  Las secciones anteriores quedan como historia, no las borres.
- traceability.md: anade los it nuevos y los hashes de c40-c42 a las filas de R2, R4 y R12, y anota las sondas de E6.
  Commits literales:
  docs(mobile-account-screens-polish): #172 trazabilidad completa
  y luego git commit --only ../progress/impl_mobile-account-screens-polish.md -m 'docs(mobile-account-screens-polish): #172 informe de implementación completo'
```

## Reanudación 6 — Merge de origin/main (2026-10-15)

La review ronda 2 aprobó #172 (e2745566) y el humano firmó la prueba de humo
R21 (631826d9). Mientras tanto, #171 se mergeó en main (a288c7dc) y la branch
ya no mergea limpia: cinco ficheros chocan. La resolución está decidida abajo,
hunk a hunk; no hay nada que diseñar. No se toca código de #172 fuera de los
hunks en conflicto.

```text
Worktree: /home/claude/sites/Pet-Tracker-wt-172   <- PRIMERA LINEA. Trabaja AQUI y en ningun otro sitio
Branch:   feature/172-mobile-account-screens-polish
Siguen en vigor las reglas de arriba (init.sh, push, PR, amend, rebase, prettier, JEST/LINT/CARGA), salvo
"bunx jest sin rutas": en el paso 5 de esta reanudacion se permite UNA vez, tras la espera.

== ANTES DE TOCAR NADA ==
1. git branch --show-current -> feature/172-mobile-account-screens-polish
2. git status --short -> sin salida.
3. git rev-parse HEAD -> el commit del leader que trae esta seccion (padre: 631826d9). Anotalo como M0.
4. git rev-parse origin/main | cut -c1-8 -> a288c7dc. NO hagas git fetch. Si da otro hash, PARA.

== GUION ==
1. git merge --no-ff --no-commit origin/main; echo "exit=$?"  -> exit=1 y EXACTAMENTE estos 5 en conflicto
   (git diff --name-only --diff-filter=U):
     docs/ui-guidelines.md
     mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts
     mobile-pet-tracker/src/theme/global.css
     mobile-pet-tracker/src/theme/motion.ts
     specs/mobile-ui-language/design.md
   Si hay otro o falta alguno, git merge --abort y PARA.

2. Resuelve cada hunk con Edit, quitando las tres lineas de marcas (<<<<<<< HEAD, =======, >>>>>>> origin/main):

   a) docs/ui-guidelines.md (1 hunk): primero el bloque de origin/main entero ("## Enmienda #171 — confeti..."
      hasta "- [x] Aprobada por humano (fecha: 2026-10-14)"), despues UNA linea en blanco, despues el bloque de
      HEAD entero ("## Enmienda #172 — Las pantallas..." hasta "- [x] Enmienda aprobada por humano").
      Ningun caracter de los dos bloques cambia.

   b) specs/mobile-ui-language/design.md (1 hunk): primero el bloque de origin/main ("### §2.27 — Añadidos por
      #171 — Celebraciones" y sus 6 lineas de tabla), una linea en blanco, y despues el de HEAD con su encabezado
      renumerado a:
        ### §2.28 — Añadidos por #172 — Las pantallas de cuenta como el canvas
      Las filas de la tabla de #172 no cambian.

   c) mobile-pet-tracker/src/theme/global.css (1 hunk): el hunk queda asi, en este orden:
        --text-13: 13px;
        --text-15: 15px;
        --text-17: 17px;
        --color-confetti-amber: #F79009;
        --color-confetti-violet: #7A5AF8;
        --color-confetti-blue: #2E90FA;
        --color-confetti-rose: #F04438;
        --color-confetti-green: #12B76A;
      (dos espacios de sangria, como el resto de @theme).

   d) mobile-pet-tracker/src/theme/motion.ts (1 hunk): se queda SOLO el lado de origin/main. Las 7 lineas de HEAD
      (desde "// #172 R4" hasta su "};") se borran: origin/main ya exporta MOTION_PINGO_FLOAT_OFFSET_Y y
      MOTION_PINGO_FLOAT_TIMING con los mismos valores, y dos exports con el mismo nombre no compilan.

   e) mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts (3 hunks):
      - Hunk 1 (CONTINUOUS_CORNER, rounded-xl bg-accent y bg-accent-soft): las dos primeras lineas, las de
        origin/main. La tercera queda asi (las dos features restan uno):
          expect(count(/bg-accent-soft/g)).toBe(16 + 2 + 1 - 1 - 1 - 1); // #147 R4: meal-time-edit y add-meal-time-button; #105 R11; #168 R5: PetPills pasa a huecos pastel; #172 R14: forgot-lock-tile pasa a bg-accent; #171 R3
      - Hunk 2 (accentSoftCount):
          expect(accentSoftCount).toBe(16 + 2 + 1 - 1 - 1 - 1); // #147 R4, #105 R11; #168 R5: PetPills pasa a huecos pastel; #172 R14: forgot-lock-tile pasa a bg-accent; #171 R3
      - Hunk 3 (labio): #172 suma uno y #171 suma uno y resta uno:
          expect(count(/\bborder-b-4\b/g)).toBe(19 + 1 + 1 - 1); // #172 R14: forgot-lock-tile (Enmienda #172); #171 R3: ready-map // #171 R14
          expect(count(/border-black\/25/g)).toBe(19 + 1 + 1 - 1); // #172 R14: forgot-lock-tile (Enmienda #172); #171 R3: ready-map // #171 R14
      Sangria de 4 espacios, como las lineas vecinas.

3. Anclas, desde la raiz del worktree. Cada una debe dar la cifra indicada; si no, PARA:
   command grep -cE '^(<<<<<<<|=======|>>>>>>>)' docs/ui-guidelines.md specs/mobile-ui-language/design.md mobile-pet-tracker/src/theme/global.css mobile-pet-tracker/src/theme/motion.ts mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts
     -> las cinco lineas acaban en :0
   command grep -cE '^## Enmienda #17[12] ' docs/ui-guidelines.md -> 2
   command grep -nE '^## Enmienda #17[12] ' docs/ui-guidelines.md -> la de #171 con numero de linea MENOR que la de #172
   command grep -cF '### §2.27 — Añadidos por #171 — Celebraciones' specs/mobile-ui-language/design.md -> 1
   command grep -cF '### §2.28 — Añadidos por #172 — Las pantallas de cuenta como el canvas' specs/mobile-ui-language/design.md -> 1
   command grep -cF '### §2.27 — Añadidos por #172' specs/mobile-ui-language/design.md -> 0
   command grep -cE -- '--text-1[357]: 1[357]px;|--color-confetti-' mobile-pet-tracker/src/theme/global.css -> 8
   command grep -cF 'export const MOTION_PINGO_FLOAT_OFFSET_Y = 10;' mobile-pet-tracker/src/theme/motion.ts -> 1
   command grep -cF 'export const MOTION_PINGO_FLOAT_TIMING = ' mobile-pet-tracker/src/theme/motion.ts -> 1
   command grep -cF '// #172 R4' mobile-pet-tracker/src/theme/motion.ts -> 0
   command grep -cF 'toBe(16 + 2 + 1 - 1 - 1 - 1)' mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts -> 2
   command grep -cF 'toBe(19 + 1 + 1 - 1)' mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts -> 2

4. cd mobile-pet-tracker. test ! -e .expo/types/router.d.ts; echo "exit=$?" -> exit=0 (si da 1, PARA; NUNCA rm -f).
   bun run typecheck; echo "exit=$?" -> exit=0
   bunx expo lint --no-cache > /tmp/lint-172.log 2>&1; echo "exit=$?"; test ! -s /tmp/lint-172.log; echo "vacio=$?"
     -> exit=0 y vacio=0 (log con "Failed to run": la espera de arriba y UNA repeticion).
   $J $GUARDAS $BASE $READERS src/components/__tests__/celebration.test.tsx src/theme/__tests__/global-css.test.ts; echo "exit=$?"
     -> exit=0. Anota la linea Tests:.

5. Suite movil entera, UNA vez. Primero la espera (hasta 90 iteraciones):
     cd /home/claude/sites/Pet-Tracker-wt-172/mobile-pet-tracker && for i in $(seq 1 90); do pgrep -f 'node_modules/(\.bin/(jest|eslint)|jest-worker)|[i]nit\.sh' > /dev/null || break; sleep 60; done; echo "fin-espera"
   Despues:
     bunx jest --testTimeout=30000 > /tmp/jest-all-172.log 2>&1; echo "exit=$?"; command grep -E '^(Test Suites|Tests):' /tmp/jest-all-172.log
   -> exit=0 y "0 failed" en las dos lineas (el aviso "A worker process has failed to exit gracefully" del final es
   preexistente y no cuenta). Si hay rojos, NO toques ningun test ni produccion: anota cada titulo ● (sin los
   "● Console") con su fichero y su primera linea de error, git merge --abort, y PARA.

6. Commit del merge, desde la raiz del worktree, con rutas explicitas:
     git add docs/ui-guidelines.md specs/mobile-ui-language/design.md mobile-pet-tracker/src/theme/global.css mobile-pet-tracker/src/theme/motion.ts mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts
     git diff --name-only --diff-filter=U -> sin salida
     git commit -m 'chore(mobile): merge de origin/main (#171) en #172'
     git status --short -> sin salida
     git log -1 --format='%h %p' -> dos padres: M0 y a288c7dc

== CIERRE ==
- Anade al final de progress/impl_mobile-account-screens-polish.md una seccion "Reanudacion 6" con M0, el hash del
  merge, la salida literal de los pasos 1, 3, 4 y 5 y desviaciones ("ninguna" si no hubo). Lo anterior no se toca.
  git commit --only ../progress/impl_mobile-account-screens-polish.md -m 'docs(mobile-account-screens-polish): #172 informe del merge con main'
  (desde mobile-pet-tracker; si lo lanzas desde la raiz, la ruta es progress/impl_mobile-account-screens-polish.md).
- traceability.md, feature_list.json, progress/current.md y el frontmatter de la spec no se tocan.
```
