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
