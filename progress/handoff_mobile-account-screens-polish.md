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

```text
Worktree: /home/claude/sites/Pet-Tracker-wt-172   <- PRIMERA LINEA. Trabaja AQUI y en ningun otro sitio
Branch:   feature/172-mobile-account-screens-polish   (H0 = git rev-parse HEAD al arrancar; anotalo en el impl)
NO lances ./init.sh en ningun momento, aunque AGENTS.md lo pida: lo corre el leader antes del reviewer.
Ni bunx jest sin rutas, ni push, ni PR, ni amend, ni rebase, ni prettier.

== GUION ==
Lee ENTEROS specs/mobile-account-screens-polish/requirements.md, design.md y tasks.md.
El guion es tasks.md T0-T22, en orden, con sus mensajes de commit literales (c1-c39) y sus gates.
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
