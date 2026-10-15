# Handoff a Codex CLI — #183 mobile-account-client-validation

> **Nota del leader (2026-10-15).** Spec firmada en `3c7e20c0` (gate en Notion). `origin/main` está mergeado en
> `4a4abfed` y trae #172 y #173. H0 es el commit que contiene este fichero
> (`git rev-parse HEAD` al arrancar).
>
> El leader midió sobre H0. `init.sh` sale con exit 1, pero sus 10 rojos son
> todos `Exceeded timeout` y caen en suites que #183 no toca
> (pet-hero-header, meals-history, celebration): la carga era 17 con otro
> jest corriendo. Repetidas a solas, salen 131 passed.
>
> Las 8 suites de la feature dan `Tests: 300 passed`. Por fichero:
> language-provider 36, ui-language 30, login 29, register 36, forgot 41,
> reset-password 41, account-screens-polish 13 y design-drift 74. Typecheck
> sale con exit 0, y lint con exit 0 y el log vacío.
>
> **Dos medidas de H0 no coinciden con `60dd9eda`.** Vale la de H0 y el delta
> no cambia (requirements §Base medida):
>
> - **B4 = 398, no 399.** #173 añadió `- 4 + 3, // #173 R13` al final de la
>   fórmula del catálogo. La fórmula ya no cierra con `+ 3, // #172 R16` como
>   dicen B4 y R1 candado 1: esa línea quedó como `+ 3 // #172 R16`, sin coma,
>   y la última es la de #173. El paso c1 de abajo dice cómo queda.
> - **B5: la última sección es §2.29 (#173), así que #183 toma §2.30.**
>
> B1 (41), B2 (16), B3 (32) y B6–B8 cuadran, y también la tabla
> de anclas por pantalla.

```text
Worktree: /home/claude/sites/Pet-Tracker-wt-183   <- PRIMERA LINEA. Trabaja AQUI y en ningun otro sitio
Branch:   feature/183-mobile-account-client-validation   (H0 = git rev-parse HEAD al arrancar; anotalo en el impl)
Antes de tocar nada, anota en el impl la salida de: pwd ; git branch --show-current ; git status --short (sin salida)
NO lances ./init.sh en ningun momento, aunque AGENTS.md lo pida: lo corre el leader antes del reviewer.
Ni push, ni PR, ni amend, ni rebase, ni merge, ni prettier (el movil no tiene prettier). bunx jest sin rutas: solo UNA vez, en CIERRE.
Nada de npx ni npm: bun y bunx.

== GUION ==
Lee ENTEROS specs/mobile-account-client-validation/requirements.md, design.md y tasks.md, y docs/conventions.md
§Esperas sobre el arbol renderizado. El guion es tasks.md R1-R7 en orden, con sus mensajes de commit literales,
sus candados, sus rojos esperados, sus sondas y sus anclas, que estan en requirements.md bajo cada R.
Si este handoff y la spec discrepan, manda este handoff.

== REGLAS CRITICAS ==
1. Test primero, commit a commit. El rojo (test(mobile): ...) trae solo tests y candados (ui-copy-table.ts y
   ui-language.test.ts cuentan como candados), y su gate da EXACTAMENTE los rojos de su tabla. El verde
   (feat(mobile): ...) trae la implementacion. NUNCA un commit con tests e implementacion juntos.
2. En CADA rojo y en CADA sonda, compara el titulo de cada bloque ● (sin los "● Console") y su tipo (consulta /
   asercion / excepcion / suite que no arranca) con su tabla ANTES de seguir. No basta con que cuadren el exit y
   el numero de fallos. Si algo no cuadra, PARA y reporta el commit, el comando y la salida exacta. No ajustes
   tests, anclas ni produccion para que cuadre.
3. Las sondas mutan SOLO produccion y NUNCA se commitean. Despues de cada una:
   git checkout HEAD -- <fichero>; git diff --quiet HEAD -- <fichero>; echo "exit=$?"; git diff --cached --quiet; echo "cached=$?"
   -> exit=0 y cached=0. Anota en el impl la salida literal de cada sonda.
4. RNTL 14: await en todo render, fireEvent.* y act. Las esperas van sobre el arbol (waitFor / findBy*), nunca
   sobre el contador de un mock. Primero se espera a que aparezca el mensaje y despues se aseveran las ausencias
   y los contadores (requirements §Convenciones).
5. Copy en los tests: literal y copiado de requirements §Copy nuevo. Nunca se importa de catalog.ts.
   Comentarios de codigo: "#183 Rn", nunca "#183" suelto (design-drift lo lee como hex).
6. Cada bloque empieza con cd /home/claude/sites/Pet-Tracker-wt-183/mobile-pet-tracker. Un fallo de directorio
   (Cannot find module de un paquete, ENOENT de package.json, ERR_PNPM...) es un error de invocacion: repite
   con el cd, sin tocar codigo.
7. Antes de cada typecheck: test ! -e .expo/types/router.d.ts; echo "exit=$?" -> exit=0. Si da 1, PARA (NUNCA rm -f).
8. Si el sandbox te deniega algo, PARA y reporta el comando. No busques otro camino.
9. git add solo con rutas explicitas, nunca -A ni "." . Tras cada commit: git status --short -> sin salida.
10. NO toques progress/history.md, progress/current.md, STATUS.md, feature_list.json ni el frontmatter de la
    spec: son del leader. Tu informe va en progress/impl_mobile-account-client-validation.md.
11. Par sites-99 (#178/#179): no renombres, muevas ni borres el mock HomeEntrance de
    src/screens/login/index.test.tsx ni el mock de reicon (...actual + mockIcon(testID)) de
    src/screens/register/index.test.tsx.

== JEST, TYPECHECK, LINT Y CARGA ==
J="bunx jest --testTimeout=30000 --runTestsByPath"
TC: test ! -e .expo/types/router.d.ts; echo "exit=$?"; bun run typecheck; echo "exit=$?"            -> exit=0 y exit=0
LINT: bunx expo lint --no-cache > /tmp/lint-183.log 2>&1; echo "exit=$?"; test ! -s /tmp/lint-183.log; echo "vacio=$?"
      -> exit=0 y vacio=0. expo lint sale con 0 aunque eslint muera: manda vacio.
- Hay otros worktrees corriendo jest a la vez. Si sale `Exceeded timeout`, es carga: repite ese comando UNA vez y,
  si se repite, PARA.
- Si /tmp/lint-183.log contiene `Failed to run "eslint" due to signal SIGKILL`, espera con
    cd /home/claude/sites/Pet-Tracker-wt-183/mobile-pet-tracker && for i in $(seq 1 30); do pgrep -f 'node_modules/(\.bin/(jest|eslint)|jest-worker)|[i]nit\.sh' > /dev/null || break; sleep 60; done; echo "fin-espera"
  y relanza solo LINT, UNA vez. Anotalo en desviaciones como carga.
- Cada verde cierra con TC y LINT antes de su git commit.

== T0 (sin commit) ==
cd /home/claude/sites/Pet-Tracker-wt-183/mobile-pet-tracker
command grep -cF '        - 4 + 3, // #173 R13' src/providers/__tests__/language-provider.test.tsx   -> 1
command grep -cF '        + 3 // #172 R16' src/providers/__tests__/language-provider.test.tsx       -> 1
command grep -cF 'expect(R1_AUTH).toHaveLength(29 + 7 + 1 + 4); // #117 R10, #167 R6, #172 R16' src/__tests__/ui-language.test.ts   -> 1
command grep -cF 'expect(R11_RESET).toHaveLength(15 + 1); // #172 R19' src/__tests__/ui-language.test.ts   -> 1
command grep -cF '        + 2 // #172 R16: back-button y password-input' src/__tests__/ui-language.test.ts   -> 1
command grep -cF '### §2.29 — Añadidos por #173 — Perfil fiel al canvas' ../specs/mobile-ui-language/design.md   -> 1
command grep -cF '### §2.30' ../specs/mobile-ui-language/design.md                                  -> 0
command grep -cF "'validation." src/i18n/catalog.ts                                                 -> 0
test ! -e src/utils/account-rules.ts; echo "exit=$?"                                                -> exit=0
command grep -cF '"zod"' package.json                                                               -> 0
command grep -cF 'HomeEntrance' src/screens/login/index.test.tsx                                    -> 4
command grep -cF 'mockIcon' src/screens/register/index.test.tsx                                     -> 2
$J src/providers/__tests__/language-provider.test.tsx src/__tests__/ui-language.test.ts src/screens/login/index.test.tsx src/screens/register/index.test.tsx src/screens/forgot/index.test.tsx src/screens/reset-password/index.test.tsx src/__tests__/account-screens-polish.test.ts src/__tests__/design-drift.test.ts; echo "exit=$?"
  -> exit=0 y Tests: 300 passed, 300 total
Si algo no cuadra, PARA.

== POR COMMIT: GATE DEL ROJO Y DEL VERDE ==
Las cuentas son acumuladas: cada fila suma los it que anadio la anterior. Los titulos de los rojos estan en la
tabla "Rojo esperado" de cada R en requirements.md.

c1  test(mobile): copy de validación (#183 R1)
    Fórmula del catálogo: la ultima linea pierde la coma y debajo va una nueva:
        - 4 + 3 // #173 R13
        + 9, // #183 R1
    Anclas: command grep -cF '        - 4 + 3 // #173 R13' src/providers/__tests__/language-provider.test.tsx -> 1
            command grep -cF '        + 9, // #183 R1' src/providers/__tests__/language-provider.test.tsx   -> 1
            command grep -cF '        - 4 + 3, // #173 R13' src/providers/__tests__/language-provider.test.tsx -> 0
    $J src/providers/__tests__/language-provider.test.tsx -> Tests: 2 failed, 35 passed, 37 total (2 de asercion)
c2  feat(mobile): copy de validación (#183 R1)
    La seccion nueva va en ../specs/mobile-ui-language/design.md justo despues de la tabla de §2.29 y antes
    de "## 3. La infraestructura", con una linea en blanco a cada lado. Su encabezado es literal:
        ### §2.30 — Añadidos por #183 — Validación en cliente de las pantallas de cuenta
    $J src/providers/__tests__/language-provider.test.tsx src/__tests__/ui-language.test.ts -> Tests: 67 passed, 67 total
    Sondas S1.1 y S1.2. Anclas:
            command grep -cF "'validation." src/i18n/catalog.ts -> 18
            command grep -cF 'por #183 (R1)' ../specs/mobile-ui-language/design.md -> 9
            command grep -cF '### §2.30 — Añadidos por #183 — Validación en cliente de las pantallas de cuenta' ../specs/mobile-ui-language/design.md -> 1
    git add con las rutas de catalog.ts y de ../specs/mobile-ui-language/design.md.
c3  test(mobile): reglas de cuenta iguales a los DTO (#183 R2)
    $J src/utils/account-rules.test.ts src/__tests__/ui-language.test.ts
      -> Test Suites: 2 failed, 2 total; Tests: 3 failed, 27 passed, 30 total
         account-rules no arranca (Cannot find module './account-rules'); los 3 de ui-language son ENOENT
c4  feat(mobile): reglas de cuenta iguales a los DTO (#183 R2)
    mismo comando -> Tests: 96 passed, 96 total (66 + 30). Sondas S2.1-S2.14 y anclas de R2.
c5  test(mobile): login valida en cliente (#183 R3)
    $J src/screens/login/index.test.tsx -> Tests: 9 failed, 30 passed, 39 total (8 de consulta, 1 de asercion)
c6  feat(mobile): login valida en cliente (#183 R3)
    mismo comando -> Tests: 39 passed, 39 total. Sondas S3.1-S3.3 y anclas de R3.
c7  test(mobile): registro valida en cliente (#183 R4)
    $J src/screens/register/index.test.tsx src/__tests__/ui-language.test.ts
      -> Tests: 20 failed, 74 passed, 94 total (19 de consulta, 1 de asercion; register 64 + ui-language 30)
c8  feat(mobile): registro valida en cliente (#183 R4)
    mismo comando -> Tests: 94 passed, 94 total. Sondas S4.1-S4.4 y anclas de R4.
c9  test(mobile): recuperar valida en cliente (#183 R5)
    $J src/screens/forgot/index.test.tsx -> Tests: 5 failed, 42 passed, 47 total (los 5 de consulta)
c10 feat(mobile): recuperar valida en cliente (#183 R5)
    mismo comando -> Tests: 47 passed, 47 total. Sondas S5.1-S5.3 y anclas de R5.
c11 test(mobile): nueva contraseña valida en cliente (#183 R6)
    $J src/screens/reset-password/index.test.tsx -> Tests: 4 failed, 43 passed, 47 total (los 4 de consulta)
c12 feat(mobile): nueva contraseña valida en cliente (#183 R6)
    mismo comando -> Tests: 47 passed, 47 total. Sondas S6.1-S6.3 y anclas de R6.
c13 test(mobile): un 400 pinta el aviso genérico (#183 R7)
    $J src/screens/login/index.test.tsx src/screens/register/index.test.tsx src/screens/forgot/index.test.tsx src/screens/reset-password/index.test.tsx src/__tests__/ui-language.test.ts
      -> Tests: 9 failed, 218 passed, 227 total (los 9 de asercion)
c14 feat(mobile): un 400 pinta el aviso genérico (#183 R7)
    mismo comando -> Tests: 227 passed, 227 total. Sondas S7.1-S7.4 y anclas de R7.
c15 SOLO si tras c14 queda RegisterFieldErrors sin uso en src/screens/register/index.tsx:
    refactor(mobile): borra RegisterFieldErrors sin uso (#183 R7)
    gate: el de c14 en verde, TC y LINT. Si no queda, no hay c15: dilo en el impl.

== SKILLS ==
Del plugin expo de Codex: building-native-ui (Codex NO tiene expo-overview). Del repo (.agents/skills/):
appllama-app-design-skill, que la carta (docs/ui-guidelines.md) exige al cambiar pantallas. La spec manda sobre
cualquier skill: no se anaden clases, estilos, hex ni componentes nuevos. Solo FieldError y FormError, que ya existen.
Di en el impl cuales cargaste.

== CIERRE ==
1. GUARDAS: $J src/__tests__/account-screens-polish.test.ts src/__tests__/design-drift.test.ts src/providers/__tests__/language-provider.test.tsx; echo "exit=$?"
   -> exit=0 y Tests: 124 passed, 124 total (13 + 74 + 37). Despues TC y LINT.
2. Las 7 suites de la feature SIN --testTimeout, porque init.sh usa el timeout por defecto:
   bunx jest --runTestsByPath src/utils/account-rules.test.ts src/screens/login/index.test.tsx src/screens/register/index.test.tsx src/screens/forgot/index.test.tsx src/screens/reset-password/index.test.tsx src/__tests__/ui-language.test.ts src/providers/__tests__/language-provider.test.tsx; echo "exit=$?"
   -> exit=0 y Tests: 330 passed, 330 total (66 + 39 + 64 + 47 + 47 + 30 + 37)
3. Suite movil entera, UNA vez. Primero la espera (hasta 90 iteraciones):
     cd /home/claude/sites/Pet-Tracker-wt-183/mobile-pet-tracker && for i in $(seq 1 90); do pgrep -f 'node_modules/(\.bin/(jest|eslint)|jest-worker)|[i]nit\.sh' > /dev/null || break; sleep 60; done; echo "fin-espera"
     bunx jest --testTimeout=30000 > /tmp/jest-all-183.log 2>&1; echo "exit=$?"; command grep -E '^(Test Suites|Tests):' /tmp/jest-all-183.log
   -> exit=0, Test Suites: 111 passed, 111 total, y Tests: 3506 passed, 3506 total (H0: 110 y 3389; delta +1 suite
   y +117 it). El aviso "A worker process has failed to exit gracefully" del final es preexistente y no cuenta.
   Si los unicos rojos son `Exceeded timeout` en suites que #183 no toca, repite esas suites UNA vez con $J; si salen
   verdes, anotalo como carga y sigue. Cualquier otro rojo: anota cada ● (sin "● Console") con su fichero y su
   primera linea de error, y PARA.
4. Anclas de cierre, desde mobile-pet-tracker (H0 = el hash que anotaste):
   command grep -cF 'HomeEntrance' src/screens/login/index.test.tsx       -> 4
   command grep -cF 'mockIcon' src/screens/register/index.test.tsx        -> 2
   git diff -U0 <H0> -- src/screens/login/index.test.tsx | command grep -E '^[-+]' | command grep -cF 'HomeEntrance'   -> 0
   git diff -U0 <H0> -- src/screens/register/index.test.tsx | command grep -E '^[-+]' | command grep -cF 'mockIcon'   -> 0
   git diff --name-only <H0> -- ../backend-pet-tracker | wc -l             -> 0
   y la tabla de anclas por pantalla de requirements §Base medida recontada con los valores finales de R3-R7.
5. progress/impl_mobile-account-client-validation.md: H0; salidas de T0; tabla por commit (hash, mensaje, linea
   Tests:, rojos con titulo y tipo); salida literal de cada sonda; anclas de c1, c2 y del cierre; skills cargadas;
   desviaciones ("ninguna" si no hubo). R8 queda "pendiente (humano)".
6. traceability.md: hash y mensaje por R, con sus it. Desde la raiz del worktree:
   git add specs/mobile-account-client-validation/traceability.md
   git commit -m 'docs(mobile-account-client-validation): #183 trazabilidad'
   y despues:
   git add progress/impl_mobile-account-client-validation.md
   git commit --only progress/impl_mobile-account-client-validation.md -m 'docs(mobile-account-client-validation): #183 informe de implementación'
   git status --short -> sin salida.
```
