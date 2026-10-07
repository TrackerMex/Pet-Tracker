# Handoff a Codex CLI — #152 mobile-home-motion-foundations

> Pegar el bloque de abajo en Codex CLI. La spec está firmada (commit de firma
> `faee3b23`, aprobación vía Notion el 2026-10-06). Es la primera feature del
> bloque de deleite visual: `src/theme/motion.ts` con las constantes de
> movimiento, la enmienda A21 de la carta, la entrada escalonada de la Home,
> el fundido de las cifras del resumen y la barra de batería del collar. Son 22
> commits, de R1 a R9 más la trazabilidad. La prueba de humo de R10, en un dev
> build de Android, es del humano y cierra la feature. Las sondas de mutación
> M1-M12 de tasks.md las planta el reviewer, no Codex.
>
> `node_modules` ya está instalado en `Pet-Tracker-wt-152/mobile-pet-tracker`
> (`bun install --frozen-lockfile`, sin cambios en el lockfile). La branch ya
> incluye `origin/main` 66aaf981 (#115), mergeado en 9ecc70bb antes de H0.

---

```
Worktree: /home/claude/sites/Pet-Tracker-wt-152   <- PRIMERA LINEA. Trabaja AQUI y en ningun otro sitio
Antes de tocar nada, ejecuta `pwd`, `git branch --show-current`,
`git rev-parse --short HEAD` y `git status --short` y pega las cuatro
salidas al principio de progress/impl_mobile-home-motion-foundations.md.
El hash es H0 (el commit que anade este handoff). En todos los comandos de
abajo, sustituye `<H0>` por ese hash literal: todos los `git diff` se miden
contra el. PARA si la branch no es feature/152-mobile-home-motion-foundations
o si `git status --short` no sale vacio. No toques /home/claude/sites/Pet-Tracker,
Pet-Tracker-wt-118, Pet-Tracker-wt-146, Pet-Tracker-wt-148,
Pet-Tracker-wt-backend, Pet-Tracker-wt-ui, pet-tracker-43, pt-skills ni
ningun otro worktree, ni cambies de branch en ninguno.

Feature: mobile-home-motion-foundations (#152)
Branch: feature/152-mobile-home-motion-foundations
Spec aprobada: specs/mobile-home-motion-foundations/requirements.md
(status: approved, firma faee3b23). Todas las decisiones estan cerradas
(D1-D6, design.md): no reabras ninguna.
Lee tambien, enteros: specs/mobile-home-motion-foundations/design.md,
tasks.md y traceability.md. tasks.md es tu guion (Arranque, R1-R9, Cierre).
Los titulos de describe e it son LITERALES de requirements.md (cada R dice
su describe y sus it): copialos tal cual, con sus tildes.

== QUE HACES ==

Los 22 commits de tasks.md, en su orden exacto: rojo antes de cada verde,
y R6 (verificacion) escrito antes del verde de R5. Donde tasks.md pide una
mutacion de produccion versionada en el commit rojo (R2, R7 B, R8 B, R9),
el verde la revierte. Nunca mutes un doble de test. Si escribes un verde
antes que su rojo, ese requisito nace verde y pierde su historial (C4 de
CHECKPOINTS.md); en #19 se metio todo en un solo commit y no vale.

== BASE ==

origin/main = 66aaf981 al escribir este handoff, y la branch ya lo
incluye (merge 9ecc70bb, antes de H0): lo esperado es exit=0. Al arrancar:
`git fetch origin` y `git merge-base --is-ancestor origin/main HEAD; echo "exit=$?"`.
Anota el exit en el impl. Si da 1 (otra feature mergeo antes), NO pares:
trabajas sobre H0 igual y el merge de main en la branch lo hace el leader.
Nunca rebasees ni mergees.

Desde mobile-pet-tracker/:
- `test -d node_modules && echo presente` -> presente. Si no sale,
  `bun install --frozen-lockfile`; si el sandbox te lo deniega, PARA.
- `test ! -e .expo/types/router.d.ts; echo "exit=$?"` -> exit=0. Va en
  cada cadena de commit; si un dia da 1, PARA y pide al humano que lo
  borre. Nunca `rm -f` (tu sandbox lo deniega).
- `pgrep -af '[i]nit\.sh'` sin pipe: si sale algo, otra sesion usa la
  maquina; espera a que salga vacio antes de la suite entera del Cierre.

Base medida por el leader el 2026-10-06 en este worktree, tras el merge
de main y con el arbol de H0, con el comando de tasks.md Arranque 5, sin
pipe:
  Test Suites: 3 passed, 3 total
  Tests:       281 passed, 281 total
  exit=0
  Reparto: home/index 169, design-drift 61, global-css 51.
Tu medida manda: repitela con `FORCE_COLOR=0` y anotala en el impl.

== ANCLAS ==

Ejecutalas TODAS desde mobile-pet-tracker/ antes de tocar nada y copia la
salida al impl. Incluyen las premisas P1-P10 de requirements.md. Solo
estos comandos son anclas; los numeros de linea no lo son. Si alguna no
da EXACTAMENTE lo esperado, PARA y avisa (ante una diferencia manda el
fichero, no el handoff). El leader las ha ejecutado todas en H0
sacandolas de este mismo fichero.

 0. grep -cF -- '- [x] Aprobado por humano (fecha: 2026-10-06, vía Notion' ../specs/mobile-home-motion-foundations/requirements.md   -> 1
 1. grep -rlF 'entering=' src | wc -l   -> 0
 2. test -e src/theme/motion.ts; echo $?   -> 1
 3. grep -cF -- '--motion' src/theme/global.css   -> 0
 4. grep -rlF 'home-entrance' src | wc -l   -> 0
 5. grep -cF 'promueven a tokens `--motion-*` en global.css' ../docs/ui-guidelines.md   -> 1
 6. grep -cF 'unmountOnBlur' 'src/app/(tabs)/_layout.tsx'   -> 0
 7. grep -cF "expect(mockWithTiming).not.toHaveBeenCalled()" src/screens/home/index.test.tsx   -> 1
 8. grep -cF '.children.flatMap((child) =>' src/screens/home/index.test.tsx   -> 4
 9. grep -cF 'BAR_ENTRY_STAGGER_MS = 40' src/screens/home/weekly-activity-chart.tsx   -> 1
10. grep -cF "dot: 'bg-success'" src/components/pet-hero-header.tsx   -> 1
11. grep -cF "dot: 'bg-warning-strong'" src/components/pet-hero-header.tsx   -> 1
12. test -e src/screens/home/home-entrance.tsx; echo $?   -> 1
13. test -e src/screens/home/home-entrance.test.tsx; echo $?   -> 1
14. test -e src/screens/home/collar-battery-bar.tsx; echo $?   -> 1
15. test -e src/theme/__tests__/motion.test.ts; echo $?   -> 1
16. grep -cF 'testID="home-content"' src/screens/home/index.tsx   -> 1
17. grep -cF 'className="flex-row"' src/screens/home/index.tsx   -> 1
18. grep -cF 'testID="summary-skeleton"' src/screens/home/index.tsx   -> 1
19. grep -cF 'testID="collar-battery"' src/screens/home/index.tsx   -> 1
20. grep -cF "t('home.noCollar')" src/screens/home/index.tsx   -> 1
21. grep -cF 'const detail = useQuery({' src/screens/home/index.tsx   -> 1
22. grep -cF 'const { selectedPetId, selectPet } = useSelectedPet();' src/screens/home/index.tsx   -> 1
23. grep -cF 'MEALS_BAR_TIMING' src/screens/home/index.tsx   -> 2
24. grep -cF "describe('R10: refetch al foco'" src/screens/home/index.test.tsx   -> 1
25. grep -cF "it('selects a pressed pet and reloads its detail and activity'" src/screens/home/index.test.tsx   -> 1
26. grep -cF "it('queda entre el resumen y la última posición en el árbol'" src/screens/home/index.test.tsx   -> 1
27. grep -cF "it('coloca la tira sobre la tarjeta del collar'" src/screens/home/index.test.tsx   -> 1
28. grep -cF "it('coloca la rejilla entre el collar y la actividad semanal'" src/screens/home/index.test.tsx   -> 1
29. grep -cF "it('coloca la sección entre la actividad semanal y la última posición'" src/screens/home/index.test.tsx   -> 1
30. grep -cF 'const mockWithTiming = jest.fn(' src/screens/home/index.test.tsx   -> 1
31. grep -cF 'const mockUseReducedMotion = jest.fn' src/screens/home/index.test.tsx   -> 1
32. grep -cF 'withDelay: jest.fn(' src/screens/home/index.test.tsx   -> 1
33. grep -cF "describe('#152" src/screens/home/index.test.tsx   -> 0
34. grep -cF "describe('#152" src/__tests__/design-drift.test.ts   -> 0
35. grep -cF 'const MEALS_BAR_STYLE_ESCAPES = new RegExp(' src/__tests__/design-drift.test.ts   -> 1
36. grep -cF "describe('#98 R10: la barra de comidas no mete drift de estilo'" src/__tests__/design-drift.test.ts   -> 2
37. grep -cF '## Enmienda #152' ../docs/ui-guidelines.md   -> 0
38. grep -cF 'Enmienda aprobada por humano' ../docs/ui-guidelines.md   -> 2
39. grep -cF -- '- [ ] Enmienda aprobada por humano' ../docs/ui-guidelines.md   -> 0
40. test ! -e .expo/types/router.d.ts; echo $?   -> 0

36 da 2 porque el it.each de #108 R2 cita ese describe como cadena: es
una sola describe. 26-29 son los cuatro tests de orden que mueve R5.

Valores al cerrar (copialos al impl): 0 sin cambios, 1 -> 2, 2 -> 0,
3 -> 0, 4 no se fija (anota el valor), 5 -> 0, 6 sin cambios, 7 no menos
de 1, 8 no menos de 4, 9-11 sin cambios, 12-15 -> 0, 16-32 sin cambios,
33 -> 4, 34 -> 1, 35-36 sin cambios, 37 -> 1, 38 -> 3, 39 -> 1, 40 sin
cambios. Y en positivo al cerrar:
  grep -cF 'export const MOTION_' src/theme/motion.ts   -> 8
  grep -cF "'worklet'" src/screens/home/home-entrance.tsx   -> 1
  grep -cF '<HomeEntrance' src/screens/home/index.tsx   -> 6
  grep -cF 'testID="summary-reveal"' src/screens/home/index.tsx   -> 1
  grep -cF 'homeEntering(0, 0)' src/screens/home/index.tsx   -> 1
  grep -cF '<CollarBatteryBar' src/screens/home/index.tsx   -> 1
  grep -cF '`src/theme/motion.ts` (enmienda A21 de #152)' ../docs/ui-guidelines.md   -> 1
  grep -cF "describe('#152 R9" src/__tests__/design-drift.test.ts   -> 1

== COMMITS ==

Todo desde mobile-pet-tracker/. Cada commit va ENCADENADO con && a su
verificacion: si cualquier eslabon falla, el commit no se hace. Nunca
commitees fuera de estas cadenas ni con un exit distinto de 0 en la
cadena (en #115 se commiteo un verde con el registrador en exit=1). Si
una cadena no llega al commit, PARA y reporta en el impl el eslabon que
fallo y la salida.

Mide SIN pipe (`cmd | tail` devuelve el exit de tail). FORCE_COLOR=0 deja
la linea de resumen de jest en texto plano. Formato medido por el leader
en H0: `Tests:       165 skipped, 4 passed, 169 total`, y si todos los it
quedan filtrados, `Tests:       169 skipped, 169 total`. Con fallos, el
orden es `X failed, Y skipped, Z passed, T total`.

Rojos: cada uno cae EXACTAMENTE como dice tasks.md: por ASERCION
(Expected/Received) o por CONSULTA (`Unable to find an element with
testID: ...`) donde tasks.md lo dice. Nunca por SyntaxError,
ReferenceError, import roto ni un helper de test sin definir. Las dos
unicas excepciones las declara tasks.md y su cadena las acota: R3 cae por
`TypeError` porque falta la funcion de produccion, y R4 por
`Element type is invalid` porque falta el componente. La cadena
comprueba la cuenta; tu ademas abres el log y copias al impl cada it rojo
con su matcher y su Expected/Received (o la consulta que fallo).

Typecheck en los rojos R1, R3 y R4: el sujeto nuevo es `export {};`, asi
que tsc falla con TS2305 (`Module '"..."' has no exported member 'X'`)
en el fichero de test y SOLO ahi. La cadena lo acota asi: todo
`error TS` del log tiene que ser un TS2305 de ese fichero. En los demas
commits, `bun run typecheck` va normal.

R1 rojo (motion.test.ts con el describe #152 R1; motion.ts con solo `export {};`):
  FORCE_COLOR=0 bunx jest src/theme/__tests__/motion.test.ts > /tmp/152-r1.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       6 failed, 6 total`
  grep -qE '^Tests: +6 failed, 6 total$' /tmp/152-r1.txt \
    && ! grep -qE 'TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/152-r1.txt \
    && test ! -e .expo/types/router.d.ts \
    && { bun run typecheck > /tmp/152-r1-tsc.txt 2>&1 || true; } \
    && test "$(grep -c 'error TS' /tmp/152-r1-tsc.txt)" = "$(grep -cE '^src/theme/__tests__/motion\.test\.ts\([0-9]+,[0-9]+\): error TS2305:' /tmp/152-r1-tsc.txt)" \
    && bun run lint \
    && git add src/theme/__tests__/motion.test.ts src/theme/motion.ts \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/theme/__tests__/motion.test.ts mobile-pet-tracker/src/theme/motion.ts ' \
    && git commit -m 'test(mobile-home): #152 R1 red, motion constants'

R1 verde:
  FORCE_COLOR=0 bunx jest src/theme/__tests__/motion.test.ts > /tmp/152-g1.txt 2>&1; echo "exit=$?"
  grep -qE '^Tests: +6 passed, 6 total$' /tmp/152-g1.txt \
    && test "$(grep -cF 'export const MOTION_' src/theme/motion.ts)" = 8 \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bun run lint \
    && git add src/theme/motion.ts \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/theme/motion.ts' \
    && git commit -m 'feat(mobile-home): #152 R1 motion constants in theme/motion.ts'

R2 rojo (describe #152 R2 en motion.test.ts; `/* --motion */` al final de global.css):
  FORCE_COLOR=0 bunx jest src/theme/__tests__/motion.test.ts > /tmp/152-r2.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       3 failed, 6 passed, 9 total`
  Sin commit, informativo: corre tambien
  `FORCE_COLOR=0 bunx jest src/theme/__tests__/global-css.test.ts src/__tests__/design-drift.test.ts > /tmp/152-r2-info.txt 2>&1; echo "exit=$?"`
  y anota en el impl cualquier it que caiga con la mutacion. No lo arregles.
  grep -qE '^Tests: +3 failed, 6 passed, 9 total$' /tmp/152-r2.txt \
    && ! grep -qE 'TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/152-r2.txt \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bun run lint \
    && git add src/theme/__tests__/motion.test.ts src/theme/global.css \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/theme/__tests__/motion.test.ts mobile-pet-tracker/src/theme/global.css ' \
    && git commit -m 'test(mobile-home): #152 R2 red, charter points to motion.ts'

R2 verde (frase de §Animacion + seccion final con la casilla SIN marcar; quita la mutacion):
  FORCE_COLOR=0 bunx jest src/theme/__tests__/motion.test.ts > /tmp/152-g2.txt 2>&1; echo "exit=$?"
  grep -qE '^Tests: +9 passed, 9 total$' /tmp/152-g2.txt \
    && test "$(grep -cF '`src/theme/motion.ts` (enmienda A21 de #152)' ../docs/ui-guidelines.md)" = 1 \
    && test "$(grep -cF 'promueven a tokens' ../docs/ui-guidelines.md)" = 0 \
    && test "$(grep -cF -- '--motion' src/theme/global.css)" = 0 \
    && test "$(grep -cF -- '- [ ] Enmienda aprobada por humano' ../docs/ui-guidelines.md)" = 1 \
    && test -z "$(git diff --stat <H0> -- src/theme/global.css)" \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bun run lint \
    && git add ../docs/ui-guidelines.md src/theme/global.css \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'docs/ui-guidelines.md mobile-pet-tracker/src/theme/global.css ' \
    && git commit -m 'docs(mobile-home): #152 R2 charter amendment A21 for motion.ts'

R3 rojo (home-entrance.test.tsx con el describe #152 R3 y sus dobles; home-entrance.tsx con solo `export {};`):
  FORCE_COLOR=0 bunx jest src/screens/home/home-entrance.test.tsx > /tmp/152-r3.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       2 failed, 2 total`, los dos con
       `TypeError: (0 , _homeEntrance.homeEntering) is not a function`
  grep -qE '^Tests: +2 failed, 2 total$' /tmp/152-r3.txt \
    && test "$(grep -cE 'TypeError: .*homeEntering\)? is not a function' /tmp/152-r3.txt)" -ge 2 \
    && test "$(grep -c 'TypeError' /tmp/152-r3.txt)" = "$(grep -cE 'TypeError: .*homeEntering\)? is not a function' /tmp/152-r3.txt)" \
    && ! grep -qE 'ReferenceError|SyntaxError|Cannot find module' /tmp/152-r3.txt \
    && test ! -e .expo/types/router.d.ts \
    && { bun run typecheck > /tmp/152-r3-tsc.txt 2>&1 || true; } \
    && test "$(grep -c 'error TS' /tmp/152-r3-tsc.txt)" = "$(grep -cE '^src/screens/home/home-entrance\.test\.tsx\([0-9]+,[0-9]+\): error TS2305:' /tmp/152-r3-tsc.txt)" \
    && bun run lint \
    && git add src/screens/home/home-entrance.test.tsx src/screens/home/home-entrance.tsx \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/screens/home/home-entrance.test.tsx mobile-pet-tracker/src/screens/home/home-entrance.tsx ' \
    && git commit -m 'test(mobile-home): #152 R3 red, home entrance recipe'

R3 verde:
  FORCE_COLOR=0 bunx jest src/screens/home/home-entrance.test.tsx > /tmp/152-g3.txt 2>&1; echo "exit=$?"
  grep -qE '^Tests: +2 passed, 2 total$' /tmp/152-g3.txt \
    && test "$(grep -cF "'worklet'" src/screens/home/home-entrance.tsx)" = 1 \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bun run lint \
    && git add src/screens/home/home-entrance.tsx \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/screens/home/home-entrance.tsx' \
    && git commit -m 'feat(mobile-home): #152 R3 homeEntering worklet'

R4 rojo (describe #152 R4 en home-entrance.test.tsx):
  FORCE_COLOR=0 bunx jest src/screens/home/home-entrance.test.tsx > /tmp/152-r4.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       4 failed, 2 passed, 6 total`
  grep -qE '^Tests: +4 failed, 2 passed, 6 total$' /tmp/152-r4.txt \
    && test "$(grep -cF 'Element type is invalid' /tmp/152-r4.txt)" -ge 4 \
    && ! grep -qE 'TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/152-r4.txt \
    && test ! -e .expo/types/router.d.ts \
    && { bun run typecheck > /tmp/152-r4-tsc.txt 2>&1 || true; } \
    && test "$(grep -c 'error TS' /tmp/152-r4-tsc.txt)" = "$(grep -cE '^src/screens/home/home-entrance\.test\.tsx\([0-9]+,[0-9]+\): error TS2305:' /tmp/152-r4-tsc.txt)" \
    && bun run lint \
    && git add src/screens/home/home-entrance.test.tsx \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/screens/home/home-entrance.test.tsx' \
    && git commit -m 'test(mobile-home): #152 R4 red, staggered HomeEntrance'

R4 verde:
  FORCE_COLOR=0 bunx jest src/screens/home/home-entrance.test.tsx > /tmp/152-g4.txt 2>&1; echo "exit=$?"
  grep -qE '^Tests: +6 passed, 6 total$' /tmp/152-g4.txt \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bun run lint \
    && git add src/screens/home/home-entrance.tsx \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/screens/home/home-entrance.tsx' \
    && git commit -m 'feat(mobile-home): #152 R4 HomeEntrance wrapper'

Filtro de los cuatro tests de orden (R5): va escrito entero en los dos
comandos que lo usan. El leader lo midio en H0:
`Tests:       165 skipped, 4 passed, 169 total`.

R5 rojo (describe #152 R5 con sus 7 it + los 4 tests de orden movidos):
  FORCE_COLOR=0 bunx jest src/screens/home/index.test.tsx -t '#152 R5' > /tmp/152-r5.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       7 failed, 169 skipped, 176 total`
  FORCE_COLOR=0 bunx jest src/screens/home/index.test.tsx -t 'queda entre el resumen y la última posición|coloca la tira sobre la tarjeta del collar|coloca la rejilla entre el collar y la actividad semanal|coloca la sección entre la actividad semanal y la última posición' > /tmp/152-r5-order.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       4 failed, 172 skipped, 176 total`
  grep -qE '^Tests: +7 failed, 169 skipped, 176 total$' /tmp/152-r5.txt \
    && test "$(grep -cF 'Unable to find an element with testID: home-entrance-' /tmp/152-r5.txt)" -ge 6 \
    && grep -qE '^Tests: +4 failed, 172 skipped, 176 total$' /tmp/152-r5-order.txt \
    && ! grep -qE 'TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/152-r5.txt /tmp/152-r5-order.txt \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bun run lint \
    && git add src/screens/home/index.test.tsx \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/screens/home/index.test.tsx' \
    && git commit -m 'test(mobile-home): #152 R5 red, staggered Home blocks'

R6 rojo (describe #152 R6 con sus 2 it, ANTES del verde de R5):
  FORCE_COLOR=0 bunx jest src/screens/home/index.test.tsx -t '#152 R6' > /tmp/152-r6.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       2 failed, 176 skipped, 178 total`
  grep -qE '^Tests: +2 failed, 176 skipped, 178 total$' /tmp/152-r6.txt \
    && test "$(grep -cF 'Unable to find an element with testID: ' /tmp/152-r6.txt)" -ge 2 \
    && ! grep -qE 'TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/152-r6.txt \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bun run lint \
    && git add src/screens/home/index.test.tsx \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/screens/home/index.test.tsx' \
    && git commit -m 'test(mobile-home): #152 R6 red, entrance plays once per mount'

R5 verde (los seis HomeEntrance en index.tsx; R6 SIGUE rojo, ahora por summary-reveal, que crea R7):
  FORCE_COLOR=0 bunx jest src/screens/home/index.test.tsx -t '#152 R5' > /tmp/152-g5.txt 2>&1; echo "exit=$?"
  FORCE_COLOR=0 bunx jest src/screens/home/index.test.tsx -t 'queda entre el resumen y la última posición|coloca la tira sobre la tarjeta del collar|coloca la rejilla entre el collar y la actividad semanal|coloca la sección entre la actividad semanal y la última posición' > /tmp/152-g5-order.txt 2>&1; echo "exit=$?"
  FORCE_COLOR=0 bunx jest src/screens/home/index.test.tsx -t '#152 R6' > /tmp/152-g5-r6.txt 2>&1; echo "exit=$?"
  FORCE_COLOR=0 bunx jest src/screens/home/index.test.tsx > /tmp/152-g5-all.txt 2>&1; echo "exit=$?"
  grep -qE '^Tests: +171 skipped, 7 passed, 178 total$' /tmp/152-g5.txt \
    && grep -qE '^Tests: +174 skipped, 4 passed, 178 total$' /tmp/152-g5-order.txt \
    && grep -qE '^Tests: +2 failed, 176 skipped, 178 total$' /tmp/152-g5-r6.txt \
    && test "$(grep -cF 'Unable to find an element with testID: summary-reveal' /tmp/152-g5-r6.txt)" -ge 2 \
    && grep -qE '^Tests: +2 failed, 176 passed, 178 total$' /tmp/152-g5-all.txt \
    && test "$(grep -cF '<HomeEntrance' src/screens/home/index.tsx)" = 6 \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bun run lint \
    && git add src/screens/home/index.tsx \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/screens/home/index.tsx' \
    && git commit -m 'feat(mobile-home): #152 R5 wrap Home blocks in HomeEntrance'

R7 rojo A (describe #152 R7 con sus dos primeros it):
  FORCE_COLOR=0 bunx jest src/screens/home/index.test.tsx -t '#152 R7' > /tmp/152-r7a.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       2 failed, 178 skipped, 180 total`
  FORCE_COLOR=0 bunx jest src/screens/home/index.test.tsx > /tmp/152-r7a-all.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       4 failed, 176 passed, 180 total` (2 de R6 + 2 de R7)
  grep -qE '^Tests: +2 failed, 178 skipped, 180 total$' /tmp/152-r7a.txt \
    && test "$(grep -cF 'Unable to find an element with testID: summary-reveal' /tmp/152-r7a.txt)" -ge 2 \
    && grep -qE '^Tests: +4 failed, 176 passed, 180 total$' /tmp/152-r7a-all.txt \
    && ! grep -qE 'TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/152-r7a.txt \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bun run lint \
    && git add src/screens/home/index.test.tsx \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/screens/home/index.test.tsx' \
    && git commit -m 'test(mobile-home): #152 R7 red, summary reveal fade'

R7 verde A (R6 queda verde aqui):
  FORCE_COLOR=0 bunx jest src/screens/home/index.test.tsx -t '#152 R(6|7)' > /tmp/152-g7a.txt 2>&1; echo "exit=$?"
  FORCE_COLOR=0 bunx jest src/screens/home/index.test.tsx > /tmp/152-g7a-all.txt 2>&1; echo "exit=$?"
  grep -qE '^Tests: +176 skipped, 4 passed, 180 total$' /tmp/152-g7a.txt \
    && grep -qE '^Tests: +180 passed, 180 total$' /tmp/152-g7a-all.txt \
    && test "$(grep -cF 'testID="summary-reveal"' src/screens/home/index.tsx)" = 1 \
    && test "$(grep -cF 'homeEntering(0, 0)' src/screens/home/index.tsx)" = 1 \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bun run lint \
    && git add src/screens/home/index.tsx \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/screens/home/index.tsx' \
    && git commit -m 'feat(mobile-home): #152 R7 fade in the summary row'

R7 rojo B (tercer it + mutacion: segundo summary-reveal envolviendo el Skeleton de summary-skeleton):
  FORCE_COLOR=0 bunx jest src/screens/home/index.test.tsx -t '#152 R7' > /tmp/152-r7b.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       1 failed, 178 skipped, 2 passed, 181 total`
  Sin commit, informativo: el fichero entero a /tmp/152-r7b-all.txt; anota
  en el impl cualquier otro it que caiga con la mutacion. No lo arregles.
  grep -qE '^Tests: +1 failed, 178 skipped, 2 passed, 181 total$' /tmp/152-r7b.txt \
    && ! grep -qE 'TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/152-r7b.txt \
    && test "$(grep -cF 'testID="summary-reveal"' src/screens/home/index.tsx)" = 2 \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bun run lint \
    && git add src/screens/home/index.test.tsx src/screens/home/index.tsx \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/screens/home/index.test.tsx mobile-pet-tracker/src/screens/home/index.tsx ' \
    && git commit -m 'test(mobile-home): #152 R7 red, no fade over the skeleton'

R7 verde B (revierte la mutacion):
  FORCE_COLOR=0 bunx jest src/screens/home/index.test.tsx -t '#152 R7' > /tmp/152-g7b.txt 2>&1; echo "exit=$?"
  FORCE_COLOR=0 bunx jest src/screens/home/index.test.tsx > /tmp/152-g7b-all.txt 2>&1; echo "exit=$?"
  grep -qE '^Tests: +178 skipped, 3 passed, 181 total$' /tmp/152-g7b.txt \
    && grep -qE '^Tests: +181 passed, 181 total$' /tmp/152-g7b-all.txt \
    && test "$(grep -cF 'testID="summary-reveal"' src/screens/home/index.tsx)" = 1 \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bun run lint \
    && git add src/screens/home/index.tsx \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/screens/home/index.tsx' \
    && git commit -m 'feat(mobile-home): #152 R7 keep the skeleton without fade'

R8 rojo A (describe #152 R8 con los it 1 (it.each de 4 filas), 2, 3, 4, 7 y 8):
  FORCE_COLOR=0 bunx jest src/screens/home/index.test.tsx -t '#152 R8' > /tmp/152-r8a.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       9 failed, 181 skipped, 190 total`
  grep -qE '^Tests: +9 failed, 181 skipped, 190 total$' /tmp/152-r8a.txt \
    && test "$(grep -cE 'Unable to find an element with testID: collar-battery-(track|fill)' /tmp/152-r8a.txt)" -ge 9 \
    && ! grep -qE 'TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/152-r8a.txt \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bun run lint \
    && git add src/screens/home/index.test.tsx \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/screens/home/index.test.tsx' \
    && git commit -m 'test(mobile-home): #152 R8 red, collar battery bar'

R8 verde A (collar-battery-bar.tsx nuevo + la barra condicional en index.tsx):
  FORCE_COLOR=0 bunx jest src/screens/home/index.test.tsx -t '#152 R8' > /tmp/152-g8a.txt 2>&1; echo "exit=$?"
  FORCE_COLOR=0 bunx jest src/screens/home/index.test.tsx -t '#106' > /tmp/152-g8a-106.txt 2>&1; echo "exit=$?"
  FORCE_COLOR=0 bunx jest src/screens/home/index.test.tsx > /tmp/152-g8a-all.txt 2>&1; echo "exit=$?"
  grep -qE '^Tests: +181 skipped, 9 passed, 190 total$' /tmp/152-g8a.txt \
    && grep -qE '^Tests: +188 skipped, 2 passed, 190 total$' /tmp/152-g8a-106.txt \
    && grep -qE '^Tests: +190 passed, 190 total$' /tmp/152-g8a-all.txt \
    && test "$(grep -cF '<CollarBatteryBar' src/screens/home/index.tsx)" = 1 \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bun run lint \
    && git add src/screens/home/collar-battery-bar.tsx src/screens/home/index.tsx \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/screens/home/collar-battery-bar.tsx mobile-pet-tracker/src/screens/home/index.tsx ' \
    && git commit -m 'feat(mobile-home): #152 R8 collar battery bar'

R8 rojo B (it 5 y 6 + mutaciones (a) y (b) de tasks.md en index.tsx):
  FORCE_COLOR=0 bunx jest src/screens/home/index.test.tsx -t '#152 R8' > /tmp/152-r8b.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       2 failed, 181 skipped, 9 passed, 192 total`
  Sin commit, informativo: el fichero entero a /tmp/152-r8b-all.txt; anota
  en el impl cualquier otro it que caiga con las mutaciones. No lo arregles.
  grep -qE '^Tests: +2 failed, 181 skipped, 9 passed, 192 total$' /tmp/152-r8b.txt \
    && ! grep -qE 'TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/152-r8b.txt \
    && test "$(grep -cF '<CollarBatteryBar' src/screens/home/index.tsx)" = 2 \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bun run lint \
    && git add src/screens/home/index.test.tsx src/screens/home/index.tsx \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/screens/home/index.test.tsx mobile-pet-tracker/src/screens/home/index.tsx ' \
    && git commit -m 'test(mobile-home): #152 R8 red, no bar without percentage or collar'

R8 verde B (revierte las dos mutaciones):
  FORCE_COLOR=0 bunx jest src/screens/home/index.test.tsx -t '#152 R8' > /tmp/152-g8b.txt 2>&1; echo "exit=$?"
  FORCE_COLOR=0 bunx jest src/screens/home/index.test.tsx > /tmp/152-g8b-all.txt 2>&1; echo "exit=$?"
  grep -qE '^Tests: +181 skipped, 11 passed, 192 total$' /tmp/152-g8b.txt \
    && grep -qE '^Tests: +192 passed, 192 total$' /tmp/152-g8b-all.txt \
    && test "$(grep -cF '<CollarBatteryBar' src/screens/home/index.tsx)" = 1 \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bun run lint \
    && git add src/screens/home/index.tsx \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/screens/home/index.tsx' \
    && git commit -m 'feat(mobile-home): #152 R8 bar only with a numeric percentage'

R9 rojo (describe #152 R9 al final de design-drift; mutacion: primera linea de collar-battery-bar.tsx `// #152 barra de batería del collar`):
  FORCE_COLOR=0 bunx jest src/__tests__/design-drift.test.ts -t '#152 R9' > /tmp/152-r9.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       1 failed, 61 skipped, 62 total`
  Sin commit, informativo: design-drift entero a /tmp/152-r9-all.txt (algun
  guard global de hex puede caer tambien); anotalo en el impl.
  grep -qE '^Tests: +1 failed, 61 skipped, 62 total$' /tmp/152-r9.txt \
    && grep -qF '"screens/home/collar-battery-bar.tsx"' /tmp/152-r9.txt \
    && ! grep -qE 'TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/152-r9.txt \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bun run lint \
    && git add src/__tests__/design-drift.test.ts src/screens/home/collar-battery-bar.tsx \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/__tests__/design-drift.test.ts mobile-pet-tracker/src/screens/home/collar-battery-bar.tsx ' \
    && git commit -m 'test(mobile-home): #152 R9 red, no style drift in Home motion'

R9 verde (el comentario pasa a `// #152 R8: barra de batería del collar`):
  FORCE_COLOR=0 bunx jest src/__tests__/design-drift.test.ts -t '#152 R9' > /tmp/152-g9.txt 2>&1; echo "exit=$?"
  FORCE_COLOR=0 bunx jest src/__tests__/design-drift.test.ts > /tmp/152-g9-all.txt 2>&1; echo "exit=$?"
  grep -qE '^Tests: +61 skipped, 1 passed, 62 total$' /tmp/152-g9.txt \
    && grep -qE '^Tests: +62 passed, 62 total$' /tmp/152-g9-all.txt \
    && test "$(grep -cF "describe('#152 R9" src/__tests__/design-drift.test.ts)" = 1 \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bun run lint \
    && git add src/screens/home/collar-battery-bar.tsx \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/screens/home/collar-battery-bar.tsx' \
    && git commit -m 'fix(mobile-home): #152 R9 cite the feature with its R-id'

== CIERRE ==

Desde mobile-pet-tracker/, sin pipe, con salida al impl:
- La base mas los dos ficheros nuevos (es la comparacion con la base; el
  jest entero no lo es, porque la base solo mide tres ficheros):
  FORCE_COLOR=0 bunx jest src/screens/home/index.test.tsx src/__tests__/design-drift.test.ts src/theme/__tests__/global-css.test.ts src/theme/__tests__/motion.test.ts src/screens/home/home-entrance.test.tsx > /tmp/152-five.txt 2>&1; echo "exit=$?"
    -> exit=0, `Test Suites: 5 passed, 5 total` y `Tests:       320 passed, 320 total`
       (281 de la base + 39 nuevos. Reparto: home/index 192, design-drift 62,
       global-css 51, motion 9, home-entrance 6)
- `pgrep -af '[i]nit\.sh'` vacio; despues
  `FORCE_COLOR=0 bunx jest > /tmp/152-all.txt 2>&1; echo "exit=$?"` -> exit=0.
  Copia las lineas `Test Suites:` y `Tests:`. Mientras corre, no lances
  otra cosa.
- `bun run typecheck; echo "exit=$?"` -> exit=0 y `bun run lint; echo "exit=$?"` -> exit=0.
- `grep -rlF 'entering=' src --include='*.tsx' | LC_ALL=C sort` -> exactamente
  src/screens/home/home-entrance.tsx y src/screens/home/index.tsx.
- `git diff --stat <H0> -- src/i18n src/theme/global.css src/components src/screens/home/weekly-activity-chart.tsx src/__tests__/ui-copy-table.ts package.json bun.lock`
  -> vacio. Esta spec no anade copy, tokens ni dependencias.
- Las anclas 0-40 y las 8 positivas, con sus valores de cierre.
Desde la raiz del repo:
  git diff --stat <H0> -- backend-pet-tracker/ infra-pet-tracker/   -> vacio
  git diff --name-only <H0> HEAD -- mobile-pet-tracker/   -> exactamente los 8 de mobile-pet-tracker/ de la lista de abajo

Despues rellena specs/mobile-home-motion-foundations/traceability.md
(test, y hash + mensaje de rojo y verde por R1-R9; R6 cita su rojo y el
verde de R7 A; la fila R10 se queda `pendiente (humano)`) y termina el
impl. Commit final, desde la raiz:
  git add specs/mobile-home-motion-foundations/traceability.md progress/impl_mobile-home-motion-foundations.md \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'progress/impl_mobile-home-motion-foundations.md specs/mobile-home-motion-foundations/traceability.md ' \
    && git commit -m 'docs(mobile-home-motion-foundations): #152 traceability'
Y la lista cerrada, con salida al impl:
  git diff --name-only <H0> HEAD -- . ':!feature_list.json' ':!progress/current.md' ':!progress/handoff_mobile-home-motion-foundations.md' ':!specs/mobile-home-motion-foundations/requirements.md' ':!specs/mobile-home-motion-foundations/design.md' ':!specs/mobile-home-motion-foundations/tasks.md'
    -> exactamente los 11 ficheros de abajo
No rebasees despues de escribir hashes.

== REGLAS CRITICAS ==

- UI movil: docs/ui-guidelines.md manda (carta). Cero hex, cero
  `StyleSheet.create`, cero clases arbitrarias, cero `style` salvo el
  animado del relleno de la barra. Las clases de la barra son literales
  completos (`bg-success`, `bg-warning-strong`), nunca compuestas.
- Skills: carga `building-native-ui` (tu plugin expo) y, de .agents/skills/
  del repo, `animate-expo`, `animation-vocabulary`, `review-animations` y
  `emil-design-eng`. Tu plugin expo no trae ninguna de animacion: las
  decisiones de movimiento ya estan cerradas en la spec y mandan sobre
  cualquier skill. Descartado: los presets de Reanimated (`FadeInDown`,
  `FadeIn`...) en vez de `homeEntering`, animar `height`, y hex,
  `StyleSheet.create` o clases arbitrarias. Di en el impl cuales cargaste.
- Convenciones: docs/conventions.md, en particular §Tests y §Esperas sobre
  el arbol renderizado. Se espera a un texto o nodo visible (`findByTestId`,
  `waitFor` sobre `getByTestId(...)`/`getByText`), NUNCA al contador de un
  mock. Ejemplo: en R6 y R8 (7 y 8) se espera a que `collar-battery`
  muestre `81%`, no a que `getPet` se haya llamado. Una ausencia se ancla
  siempre a un nodo positivo presente en el mismo render.
- Valores esperados LITERALES en los tests (`250`, `'bg-success'`,
  `[0.23, 1, 0.32, 1]`), nunca el simbolo importado de produccion. Las
  unicas excepciones son R8.3 y R8.7 (`toBe(MOTION_FILL_TIMING)`), que
  ademas llevan sus literales.
- Imports en los tests nuevos: NOMBRADOS (`import { homeEntering } from './home-entrance'`),
  nunca `import * as` (eslint `import/namespace` es error y tumbaria la
  cadena). Para `require('../motion')` de R1 y para fs/path de R2, declara
  `require` con sobrecargas `declare function require(moduleName: '...'): ...;`
  como en src/__tests__/consistency-classnames.test.ts (tsconfig solo
  carga los tipos de jest). En index.test.tsx esas declaraciones ya
  existen: reutilizalas, no las dupliques.
- index.test.tsx: reutiliza `mockWithTiming`, `mockUseReducedMotion`, el
  `withDelay: jest.fn(...)` del mock de reanimated del fichero, el
  callback de foco de `R10: refetch al foco` y la pulsacion de
  `selects a pressed pet and reloads its detail and activity`. Cero mocks
  nuevos de modulo en ese fichero. Todo test que ponga
  `mockUseReducedMotion` a `true` lo devuelve a `false` al terminar.
- `toHaveAnimatedStyle` SIEMPRE con `{ shouldMatchAllProps: true }`.
- docs/ui-guidelines.md: la cadena `` `src/theme/motion.ts` (enmienda A21 de #152) ``
  va ENTERA en una sola linea (el test usa toContain y el ancla grep -F;
  un salto de linea en medio rompe los dos). La casilla
  `- [ ] Enmienda aprobada por humano` queda SIN marcar: la marca el humano.
- Comentarios: toda cita a la feature en motion.ts, home-entrance.tsx,
  collar-battery-bar.tsx e index.tsx se escribe `#152 R<n>` (R9 la vigila).
  La unica excepcion es la mutacion del rojo de R9, que el verde corrige.
- Ni `bun add`, ni cambios en package.json, bun.lock ni app.json. Todo
  con bun/bunx, nunca npm/npx.
- NO lances ./init.sh ni toques Postgres ni LocalStack: los comparten
  otras sesiones y el gate lo corre el leader.
- No toques ningun fichero fuera de la lista de abajo. En particular, NO:
  src/components/ (card.tsx, pet-hero-header.tsx),
  src/screens/home/weekly-activity-chart.tsx, src/i18n/ (catalog.ts),
  src/__tests__/ui-copy-table.ts, ni las constantes de movimiento
  anteriores (`MEALS_BAR_TIMING` y compania): migrarlas es otra feature.
- NO son tuyos, no los toques: progress/history.md, progress/current.md,
  STATUS.md, feature_list.json, las casillas de §Gate humano y
  §Aprobacion de requirements.md, y la casilla de la enmienda #152 de la
  carta. Los escribe el leader o el humano. Todo lo que tengas que contar
  va en progress/impl_mobile-home-motion-foundations.md.
- Si el sandbox te deniega un comando, PARA y reportalo. No lo sustituyas
  por otro que haga lo mismo con otra herramienta.
- NO hagas push ni abras la PR: lo hace el leader al cerrar.

Ficheros que TU cambias (11, ni uno mas; global.css se toca en R2 y
queda sin diff neto, por eso no esta):
  docs/ui-guidelines.md
  mobile-pet-tracker/src/__tests__/design-drift.test.ts
  mobile-pet-tracker/src/screens/home/collar-battery-bar.tsx
  mobile-pet-tracker/src/screens/home/home-entrance.test.tsx
  mobile-pet-tracker/src/screens/home/home-entrance.tsx
  mobile-pet-tracker/src/screens/home/index.test.tsx
  mobile-pet-tracker/src/screens/home/index.tsx
  mobile-pet-tracker/src/theme/__tests__/motion.test.ts
  mobile-pet-tracker/src/theme/motion.ts
  progress/impl_mobile-home-motion-foundations.md
  specs/mobile-home-motion-foundations/traceability.md
Si el leader commitea en mitad (una correccion), solo tocara ficheros
excluidos por los pathspecs de arriba; cualquier otro fichero ajeno en
`git diff --name-only <H0> HEAD` es motivo de parada.

Criterios de aceptacion: R1-R9 de requirements.md. La prueba de humo de
R10 (dev build de Android) es del humano: no la marques.

Al terminar, progress/impl_mobile-home-motion-foundations.md debe tener:
pwd, branch, H0 y status; el exit de is-ancestor; node_modules (presente
o instalado); skills cargadas; la salida de las 41 anclas en H0 y la de
cierre (mas las 8 positivas); la base con su exit; los commits con hash
y R-id; por cada rojo, el comando, la linea `Tests:`, el exit y cada it
rojo con su matcher y Expected/Received o la consulta que fallo; los
informativos de R2, R7 B, R8 B y R9 (que cayo de mas con cada mutacion);
cada verde con sus lineas `Tests:`, typecheck y lint; el cierre (los 5
ficheros con 320, jest entero con exit, typecheck, lint, entering=, NR,
backend/infra vacios, lista cerrada); y cualquier decision que la spec no
cerrara literalmente.
```

---

## Enmienda E1 (leader, 2026-10-07): doble de Reanimated sin `__esModule`

> Codex paró en el verde de R4 (parada correcta, `progress/impl_mobile-home-motion-foundations.md`
> §PARADA). Para reanudar, el humano pega en Codex: «Lee la §Enmienda E1 de
> progress/handoff_mobile-home-motion-foundations.md y reanuda desde ahí. Todo lo
> demás del handoff sigue vigente.»

```
Worktree: /home/claude/sites/Pet-Tracker-wt-152   <- el mismo; no cambies de branch

CAUSA (verificada por el leader fuera del arbol, sin tocar el worktree):
el jest.mock('react-native-reanimated', ...) de home-entrance.test.tsx
esparce jest.requireActual(...) pero no declara `__esModule: true`. Esa
propiedad no es enumerable y el spread la pierde; sin ella,
`import Animated from 'react-native-reanimated'` en home-entrance.tsx
recibe el modulo entero y `Animated.View` es undefined. index.test.tsx
ya lo declara. Medido con copias en un directorio aparte:
  - doble actual + tu HomeEntrance          -> 4 failed, 2 passed, 6 total
  - doble con __esModule + home-entrance.tsx de 3f42c163 (sin HomeEntrance)
                                            -> 4 failed, 2 passed, 6 total;
                                               4 `Element type is invalid`, 0 TypeError
  - doble con __esModule + tu HomeEntrance  -> 6 passed, 6 total
Tu HomeEntrance no cambia. Solo cambia una linea del doble.

REANUDA ASI, desde mobile-pet-tracker/:

E1.1 Estado. `git status --short` -> exactamente estas dos lineas:
       M mobile-pet-tracker/src/screens/home/home-entrance.tsx
      ?? progress/impl_mobile-home-motion-foundations.md
     `git log -1 --format=%s` -> docs(mobile-home-motion-foundations): #152 handoff amendment E1
     Si algo no coincide, PARA.

E1.2 Aparta tu HomeEntrance (vuelve en E1.5):
  git stash push -- src/screens/home/home-entrance.tsx \
    && git diff --quiet HEAD -- src/screens/home/home-entrance.tsx; echo "exit=$?"   -> exit=0
  Si el sandbox deniega `git stash`, PARA (no lo sustituyas por copias).

E1.3 En home-entrance.test.tsx, dentro del factory de
  jest.mock('react-native-reanimated', ...), anade la linea
  `  __esModule: true,` justo debajo de
  `  ...jest.requireActual('react-native-reanimated'),`. Nada mas.
  grep -cF '__esModule: true,' src/screens/home/home-entrance.test.tsx   -> 1

E1.4 Rojo E1 (HomeEntrance sigue sin existir en HEAD; cae como el rojo de R4):
  FORCE_COLOR=0 bunx jest src/screens/home/home-entrance.test.tsx > /tmp/152-r4e1.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       4 failed, 2 passed, 6 total`
  grep -qE '^Tests: +4 failed, 2 passed, 6 total$' /tmp/152-r4e1.txt \
    && test "$(grep -cF 'Element type is invalid' /tmp/152-r4e1.txt)" -ge 4 \
    && ! grep -qE 'TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/152-r4e1.txt \
    && test "$(git diff --numstat -- src/screens/home/home-entrance.test.tsx | cut -f1,2)" = "$(printf '1\t0')" \
    && test ! -e .expo/types/router.d.ts \
    && { bun run typecheck > /tmp/152-r4e1-tsc.txt 2>&1 || true; } \
    && test "$(grep -c 'error TS' /tmp/152-r4e1-tsc.txt)" = "$(grep -cE '^src/screens/home/home-entrance\.test\.tsx\([0-9]+,[0-9]+\): error TS2305:' /tmp/152-r4e1-tsc.txt)" \
    && bun run lint \
    && git add src/screens/home/home-entrance.test.tsx \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/screens/home/home-entrance.test.tsx' \
    && git commit -m 'test(mobile-home): #152 R4 red, reanimated double declares __esModule'

E1.5 Recupera tu HomeEntrance:
  git stash pop && git status --short
    -> las mismas dos lineas de E1.1 (`M .../home-entrance.tsx` y `?? progress/impl_...`)
  y `git stash list` sin la entrada que creaste en E1.2.

E1.6 R4 verde: la cadena del handoff, TAL CUAL (no cambia nada).
     Despues sigue con R5 y el resto, sin cambios.

CAMBIA EN EL RESTO DEL HANDOFF:
- Son 23 commits, no 22 (el rojo E1 entre el rojo y el verde de R4).
- traceability.md, fila R4: los dos rojos (3f42c163 y el de E1) y el verde.
- Este commit de enmienda toca solo progress/handoff_mobile-home-motion-foundations.md,
  que ya esta excluido de la lista cerrada: la lista y sus cuentas no cambian.
- En el impl, debajo de la PARADA, una seccion `## Reanudacion E1` con la
  salida de E1.1-E1.5 y despues sigue el formato de siempre.
```

## Enmienda E2 (leader, 2026-10-07): espera literal del peso en R6

> Codex paró antes del verde de R7 A (parada correcta, `progress/impl_mobile-home-motion-foundations.md`
> §PARADA — espera literal de R6 antes del verde R7 A). Para reanudar, el humano
> pega en Codex: «Lee la §Enmienda E2 de
> progress/handoff_mobile-home-motion-foundations.md y reanuda desde ahí. Todo lo
> demás del handoff sigue vigente.»

```
Worktree: /home/claude/sites/Pet-Tracker-wt-152   <- el mismo; no cambies de branch

CAUSA (verificada por el leader en un worktree desechable, sin tocar el tuyo):
el segundo it de #152 R6 espera `toHaveTextContent('15')` en summary-weight,
pero fmtKg (src/screens/home/format.ts) devuelve `${kg} kg` y el matcher de
RNTL 14 compara el texto completo por defecto. La spec (R6) dice "espera a
summary-weight" sin dar el literal: el hueco es de la spec, no tuyo. El
literal correcto es '15 kg' (la primera mascota pesa 12 kg, así que la
espera sigue distinguiendo a la segunda). Medido sobre a7cbd7d7:
  - tu index.tsx de R7 A + '15 kg'   -> -t '#152 R(6|7)': 176 skipped, 4 passed, 180 total
                                       fichero entero:  180 passed, 180 total
  - index.tsx de HEAD + '15 kg'      -> -t '#152 R6': 2 failed, 178 skipped, 180 total,
                                       2 `Unable to find ... summary-reveal`, 0 TypeError
                                       fichero entero:  4 failed, 176 passed, 180 total
Tu index.tsx de R7 A no cambia. Solo cambia un literal del test.

REANUDA ASI, desde mobile-pet-tracker/:

E2.1 Estado. `git status --short` -> exactamente estas dos lineas:
       M mobile-pet-tracker/src/screens/home/index.tsx
      ?? progress/impl_mobile-home-motion-foundations.md
     `git log -1 --format=%s` -> docs(mobile-home-motion-foundations): #152 handoff amendment E2
     Si algo no coincide, PARA.

E2.2 Aparta tu R7 A (vuelve en E2.5). El stash es comun a todos los
  worktrees y ya hay una entrada ajena (`codex-preserve-before-feature-52-checkout`):
  no la toques; usa siempre la tuya por nombre.
  git stash push -m 'e2-152' -- src/screens/home/index.tsx \
    && git diff --quiet HEAD -- src/screens/home/index.tsx; echo "exit=$?"   -> exit=0
  Si el sandbox deniega `git stash`, PARA (no lo sustituyas por copias).

E2.3 En index.test.tsx, dentro del it 'al cambiar de mascota solo repiten los
  bloques que se vuelven a montar' de #152 R6, cambia
  `toHaveTextContent('15');` por `toHaveTextContent('15 kg');`. Nada mas.
  grep -cF "toHaveTextContent('15');" src/screens/home/index.test.tsx      -> 0
  grep -cF "toHaveTextContent('15 kg');" src/screens/home/index.test.tsx   -> 1

E2.4 Rojo E2 (summary-reveal sigue sin existir en HEAD; R6 cae como en su rojo):
  FORCE_COLOR=0 bunx jest src/screens/home/index.test.tsx -t '#152 R6' > /tmp/152-r6e2.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       2 failed, 178 skipped, 180 total`
  FORCE_COLOR=0 bunx jest src/screens/home/index.test.tsx > /tmp/152-r6e2-all.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       4 failed, 176 passed, 180 total` (2 de R6 + 2 de R7)
  grep -qE '^Tests: +2 failed, 178 skipped, 180 total$' /tmp/152-r6e2.txt \
    && test "$(grep -cF 'Unable to find an element with testID: summary-reveal' /tmp/152-r6e2.txt)" -ge 2 \
    && grep -qE '^Tests: +4 failed, 176 passed, 180 total$' /tmp/152-r6e2-all.txt \
    && ! grep -qE 'TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/152-r6e2.txt \
    && test "$(git diff --numstat -- src/screens/home/index.test.tsx | cut -f1,2)" = "$(printf '1\t1')" \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bun run lint \
    && git add src/screens/home/index.test.tsx \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/screens/home/index.test.tsx' \
    && git commit -m 'test(mobile-home): #152 R6 red, weight wait matches the full text'

E2.5 Recupera tu R7 A, por nombre:
  git stash pop "$(git stash list | grep -F ': e2-152' | cut -d: -f1)" && git status --short
    -> las mismas dos lineas de E2.1 (`M .../index.tsx` y `?? progress/impl_...`)
  y `git stash list | grep -cF 'e2-152'` -> 0; la entrada ajena sigue ahi.

E2.6 R7 verde A: la cadena del handoff, TAL CUAL (no cambia nada).
     Despues sigue con R7 rojo B y el resto, sin cambios.

CAMBIA EN EL RESTO DEL HANDOFF:
- Son 24 commits, no 23 (el rojo E2 entre el rojo de R7 A y su verde).
- traceability.md, fila R6: sus dos rojos (29eba7b1 y el de E2) y el verde
  de R7 A.
- Este commit de enmienda toca solo progress/handoff_mobile-home-motion-foundations.md,
  que ya esta excluido de la lista cerrada: la lista y sus cuentas no cambian
  (home/index sigue en 192 al cierre; E2 no anade tests).
- En el impl, debajo de la PARADA, una seccion `## Reanudacion E2` con la
  salida de E2.1-E2.5 y despues sigue el formato de siempre.
```

## Enmienda E3 (leader, 2026-10-07): R8 sin `StyleSheet` en index.test.tsx

> Codex paró en el verde de R9 (parada correcta, `progress/impl_mobile-home-motion-foundations.md`
> §PARADA — R9 verde: guards históricos rechazan StyleSheet.flatten). Para
> reanudar, el humano pega en Codex: «Lee la §Enmienda E3 de
> progress/handoff_mobile-home-motion-foundations.md y reanuda desde ahí. Todo lo
> demás del handoff sigue vigente.»

```
Worktree: /home/claude/sites/Pet-Tracker-wt-152   <- el mismo; no cambies de branch

CAUSA (verificada por el leader en un worktree desechable, sin tocar el tuyo):
la spec (R8.3 y R8.4) prescribe `StyleSheet.flatten(fill.props.style).width`
en index.test.tsx, pero cinco guards historicos de design-drift.test.ts
(#68 R18, #69 R13, #70 R17, #71 R13, #85 R12) pasan FEATURE_STYLE_ESCAPES,
que rechaza cualquier `StyleSheet`, por ese fichero. Estan rojos desde el
rojo A de R8 (5606d328); ninguna cadena de R8 medía design-drift. El hueco
es de la spec, no tuyo. Arreglo: medir el ancho del primer render con
`toHaveStyle` de RNTL, que aplana `props.style` igual que StyleSheet.flatten,
y quitar el import. Medido sobre 4daff5ff:
  - test arreglado + collar-battery-bar.tsx de HEAD (comentario mutado):
      design-drift:  1 failed, 61 passed, 62 total (solo el it de #152 R9)
      -t '#152 R9':  1 failed, 61 skipped, 62 total
      index -t '#152 R8': 181 skipped, 11 passed, 192 total
      index entero:  192 passed, 192 total; typecheck y lint exit=0
  - test arreglado + tu comentario corregido:
      design-drift:  62 passed, 62 total; -t '#152 R9': 61 skipped, 1 passed
      index entero:  192 passed, 192 total
  - sondas en collar-battery-bar.tsx, con el assert viejo y con el nuevo,
    mismo resultado (1 failed, 181 skipped, 10 passed, 192 total):
      useSharedValue(pct) siempre -> cae «llena la barra desde vacía…»
                                     en la linea `toHaveStyle({ width: '0%' })`
      useSharedValue(0) siempre   -> cae «bajo reduce motion fija el ancho…»
                                     en la linea `toHaveStyle({ width: '82%' })`
Tu comentario corregido no cambia. Ningun guard cambia.

REANUDA ASI, desde mobile-pet-tracker/:

E3.1 Estado. `git status --short` -> exactamente estas dos lineas:
       M mobile-pet-tracker/src/screens/home/collar-battery-bar.tsx
      ?? progress/impl_mobile-home-motion-foundations.md
     `git log -1 --format=%s` -> docs(mobile-home-motion-foundations): #152 handoff amendment E3
     Si algo no coincide, PARA.

E3.2 Aparta tu verde de R9 (vuelve en E3.5). Igual que en E2: el stash es
  comun y hay una entrada ajena; usa la tuya por nombre.
  git stash push -m 'e3-152' -- src/screens/home/collar-battery-bar.tsx \
    && git diff --quiet HEAD -- src/screens/home/collar-battery-bar.tsx; echo "exit=$?"   -> exit=0
  Si el sandbox deniega `git stash`, PARA (no lo sustituyas por copias).

E3.3 En src/screens/home/index.test.tsx, tres cambios y nada mas:
  - borra la linea `import { StyleSheet } from 'react-native';`
  - `expect(StyleSheet.flatten(fill.props.style).width).toBe('0%');`
      -> `expect(fill).toHaveStyle({ width: '0%' });`
  - `expect(StyleSheet.flatten(fill.props.style).width).toBe('82%');`
      -> `expect(fill).toHaveStyle({ width: '82%' });`
  grep -cF 'StyleSheet' src/screens/home/index.test.tsx                            -> 0
  grep -cF "expect(fill).toHaveStyle({ width: '0%' });" src/screens/home/index.test.tsx    -> 1
  grep -cF "expect(fill).toHaveStyle({ width: '82%' });" src/screens/home/index.test.tsx   -> 1

E3.4 Rojo E3 (R9 sigue rojo por el comentario mutado de HEAD; los cinco
  guards historicos vuelven a verde):
  FORCE_COLOR=0 bunx jest src/__tests__/design-drift.test.ts -t '#152 R9' > /tmp/152-r9e3.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       1 failed, 61 skipped, 62 total`
  FORCE_COLOR=0 bunx jest src/__tests__/design-drift.test.ts > /tmp/152-r9e3-all.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       1 failed, 61 passed, 62 total`
  FORCE_COLOR=0 bunx jest src/screens/home/index.test.tsx -t '#152 R8' > /tmp/152-r9e3-r8.txt 2>&1; echo "exit=$?"
    -> exit=0 y `Tests:       181 skipped, 11 passed, 192 total`
  grep -qE '^Tests: +1 failed, 61 skipped, 62 total$' /tmp/152-r9e3.txt \
    && grep -qF '"screens/home/collar-battery-bar.tsx"' /tmp/152-r9e3.txt \
    && grep -qE '^Tests: +1 failed, 61 passed, 62 total$' /tmp/152-r9e3-all.txt \
    && ! grep -qF '"screens/home/index.test.tsx"' /tmp/152-r9e3-all.txt \
    && grep -qE '^Tests: +181 skipped, 11 passed, 192 total$' /tmp/152-r9e3-r8.txt \
    && ! grep -qE 'TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/152-r9e3.txt /tmp/152-r9e3-all.txt \
    && test "$(git diff --numstat -- src/screens/home/index.test.tsx | cut -f1,2)" = "$(printf '2\t3')" \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bun run lint \
    && git add src/screens/home/index.test.tsx \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/screens/home/index.test.tsx' \
    && git commit -m 'test(mobile-home): #152 R9 red, R8 reads the fill width without StyleSheet'

E3.5 Recupera tu verde de R9, por nombre:
  git stash pop "$(git stash list | grep -F ': e3-152' | cut -d: -f1)" && git status --short
    -> las mismas dos lineas de E3.1 (`M .../collar-battery-bar.tsx` y `?? progress/impl_...`)
  y `git stash list | grep -cF 'e3-152'` -> 0; la entrada ajena sigue ahi.

E3.6 R9 verde: la cadena del handoff, TAL CUAL (repite sus dos mediciones;
     ahora el fichero entero da 62 passed). Despues sigue con el Cierre,
     sin cambios.

CAMBIA EN EL RESTO DEL HANDOFF:
- Son 25 commits, no 24 (el rojo E3 entre el rojo y el verde de R9).
- traceability.md:
  - fila R8: añade el commit E3 y di que R8.3 y R8.4 miden el ancho del
    primer render con `toHaveStyle` en vez de `StyleSheet.flatten` (misma
    lectura de `props.style`; requirements.md no se reescribe).
  - fila R9: sus dos rojos (4daff5ff y el de E3) y el verde.
- Este commit de enmienda toca solo progress/handoff_mobile-home-motion-foundations.md,
  que ya esta excluido de la lista cerrada: la lista y sus cuentas no cambian
  (home/index sigue en 192 y design-drift en 62 al cierre; E3 no anade tests).
- En el impl, debajo de la PARADA, una seccion `## Reanudacion E3` con la
  salida de E3.1-E3.5 y despues sigue el formato de siempre.
```

## Enmienda E4 (leader, 2026-10-07): candados de R5, R7 y R8 en todas sus ramas

> El reviewer rechazó en `c7ac5ceb` (`progress/review_mobile-home-motion-foundations.md`,
> bloqueantes B1-B3), y su pre-verificación de esta enmienda encontró cuatro
> huecos más (H1-H4, §Pre-verificación E4 (ronda 1b)), en una segunda
> otros tres (H5-H7, §Pre-verificación E4 (ronda 1c)) y, en una tercera,
> dos más (H8-H9, §Pre-verificación E4 (ronda 1d)). Tu código cumple la
> spec; lo que faltaba eran candados, y la spec los añade en
> `requirements.md` §Enmienda E4 (firmada por el humano). Para reanudar, el humano pega en Codex: «Lee la §Enmienda E4 de
> progress/handoff_mobile-home-motion-foundations.md y reanuda desde ahí. Todo
> lo demás del handoff sigue vigente.»

```
Worktree: /home/claude/sites/Pet-Tracker-wt-152   <- el mismo; no cambies de branch

CAUSA: requirements.md (R5, R7 y R8) candaba cada clausula en una sola rama. Con
estas mutaciones index.test.tsx seguia en 192/192: envoltorios montados sin
mascota (X2, X2b, X2c, X2d), weekly con `kind !== 'error'` (X21), pet-hero-error
o el boton del mapa dentro de un HomeEntrance (X18, X17), summary-reveal sin
`entering` bajo reduce motion (X1), envoltorios del collar o de la ultima
posicion con el detalle en unauthorized/unreachable/missing-config (X23, X24),
el hero o home-states con entrada (X27, X28), summary-reveal sin `entering` con
actividad no-ok (X25), copy o nombre accesible en la barra de bateria (X30t,
X30a), entrada dentro de pet-hero-error, del boton del mapa o del hero con
alertas (X18i, X18p, X17i, X17p, X27d), style/className/otro hijo en el reveal
con actividad no-ok o reduce motion (X39s2, X39c, X39r2, X39c2, X43s, X43r,
X44r), copy por otros canales en la barra (X30x, X30v, X30n, X37r), las celdas
del resumen envueltas solo bajo reduce motion (X45r) y un ancestro de la barra
con nombre accesible propio (X46c, X46e, X46h, X46s, X37l). El hueco es de la
spec, no tuyo.
Medido por el leader en un worktree desechable sobre f2bc714c (src/ = c7ac5ceb),
con el texto EXACTO de abajo:
  - tests de E4.2 + produccion de c7ac5ceb:  215 passed, 215 total
  - tests de E4.2 + mutacion de E4.3:       23 failed, 192 passed, 215 total
      (exactamente los 23 nuevos, todos por asercion; sin TypeError,
      ReferenceError, SyntaxError ni "Unable to find")
      typecheck y lint exit=0; design-drift + legibility-classnames +
      consistency-classnames + ui-language: 174 passed, 174 total
  - jest movil entero en verde: 96 suites, 2232 tests
  - cada sonda del reviewer y del leader por separado cae

REANUDA ASI, desde mobile-pet-tracker/:

E4.1 Estado. `git status --short` -> vacio.
     `git log -1 --format=%s` -> docs(mobile-home-motion-foundations): #152 approve amendment E4 (firma en chat)
     `git diff --quiet c7ac5ceb HEAD -- src/; echo "exit=$?"` -> exit=0
     Si algo no coincide, PARA.

E4.2 En src/screens/home/index.test.tsx, tres inserciones y nada mas. Copia
  el texto LITERAL (indentacion de dos espacios, como el resto del fichero).

  (a) Dentro de `describe('#152 R5: ...')`, justo despues del cierre `  });`
      del it 'no pinta el envoltorio de la actividad si la actividad falla'
      y antes del `});` que cierra el describe (al que siguen una linea en
      blanco y `const homeMotionNodeIds = [`), inserta una linea en blanco y:

  it('no pinta ningún envoltorio sin mascota seleccionada', async () => {
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [] });
    await renderHome();
    await screen.findByTestId('home-empty');
    for (const id of [
      'home-entrance-summary',
      'home-entrance-collar',
      'home-entrance-quick-actions',
      'home-entrance-weekly',
      'home-entrance-reminders',
      'home-entrance-last-position',
    ]) {
      expect(screen.queryByTestId(id)).toBeNull();
    }
  });

  it.each<DailyActivityState>([
    { kind: 'no-tracking' },
    { kind: 'unauthorized' },
    { kind: 'unreachable', message: 'network down' },
    { kind: 'missing-config' },
  ])('no pinta el envoltorio de la actividad con $kind', async (state) => {
    mockGetDailyActivity.mockResolvedValue(state);
    await renderHome();
    await waitFor(() => {
      expect(screen.getByTestId('summary-card')).toBeVisible();
      expect(screen.queryByTestId('summary-skeleton')).toBeNull();
    });
    expect(screen.getByTestId('home-entrance-reminders')).toBeVisible();
    expect(screen.queryByTestId('home-entrance-weekly')).toBeNull();
  });

  const enteringIds = (node: typeof screen.container): string[] => [
    ...(node.props.entering ? [String(node.props.testID)] : []),
    ...node.children.flatMap((child) => (typeof child === 'string' ? [] : enteringIds(child))),
  ];

  const homeEnteringIds = [
    'pet-avatar-fallback-pet-1',
    'home-entrance-summary',
    'summary-reveal',
    'home-entrance-collar',
    'home-entrance-quick-actions',
    'home-entrance-weekly',
    'home-entrance-reminders',
    'home-entrance-last-position',
  ];

  it.each<PetState>([
    { kind: 'error' },
    { kind: 'unreachable', message: 'network down' },
  ])('deja el error del detalle ($kind) como hijo directo de home-content y sin entrada', async (state) => {
    mockGetPet.mockResolvedValue(state);
    await renderHome();
    const card = await screen.findByTestId('pet-hero-error');
    expect(card.parent).toBe(screen.getByTestId('home-content'));
    expect(enteringIds(card)).toEqual([]);
  });

  it('deja el botón del mapa del día como hijo directo de home-content y sin entrada', async () => {
    await renderMotionHome();
    await fireEvent.press(screen.getByTestId('weekly-activity-day-2026-08-21'));
    const button = screen.getByTestId('weekly-activity-day-map');
    expect(button.parent).toBe(screen.getByTestId('home-content'));
    expect(enteringIds(button)).toEqual([]);
  });

  it.each<PetState>([
    { kind: 'unauthorized' },
    { kind: 'unreachable', message: 'network down' },
    { kind: 'missing-config' },
  ])('no pinta los envoltorios del collar ni de la última posición con el detalle en $kind', async (state) => {
    mockGetPet.mockResolvedValue(state);
    await renderHome();
    await waitFor(() => {
      expect(screen.getByTestId('reminders-section')).toBeVisible();
      expect(screen.queryByTestId('reminders-section-skeleton')).toBeNull();
    });
    expect(screen.queryByTestId('home-entrance-collar')).toBeNull();
    expect(screen.queryByTestId('home-entrance-last-position')).toBeNull();
  });

  it('solo da entrada a los envoltorios, al fundido y al avatar del selector', async () => {
    await renderMotionHome();
    expect(enteringIds(screen.container)).toEqual(homeEnteringIds);
  });

  it('no da entrada al hero con alertas abiertas', async () => {
    mockListAlerts.mockResolvedValue({ kind: 'ok', items: [makeAlert()], nextCursor: null });
    await renderMotionHome();
    await screen.findByTestId('home-alerts-dot');
    expect(enteringIds(screen.container)).toEqual(homeEnteringIds);
  });

  it.each([
    ['home-loading', () => mockListPets.mockReturnValue(pending<PetsState>()), ['home-loading']],
    ['home-error', () => mockListPets.mockResolvedValue({ kind: 'error' }), []],
    ['home-empty', () => mockListPets.mockResolvedValue({ kind: 'ok', pets: [] }), []],
  ])('no da entrada a home-states con %s', async (anchor, arrange, expected) => {
    arrange();
    await renderHome();
    await screen.findByTestId(anchor);
    expect(enteringIds(screen.container)).toEqual(expected);
  });

  (b) Dentro de `describe('#152 R7: ...')`, justo despues del cierre `  });`
      del it 'no monta el fundido mientras el skeleton ocupa su sitio' y
      antes del `});` que cierra el describe (al que siguen una linea en
      blanco y `describe('#152 R8: ...`), inserta una linea en blanco y:

  const expectRowUntouched = (reveal: typeof screen.container) => {
    const row = screen.getByTestId('summary-weight').parent?.parent;
    expect(row?.props.className).toBe('flex-row');
    expect(row?.parent).toBe(reveal);
    expect(reveal.children.filter((child) => typeof child !== 'string')).toEqual([row]);
    expect(reveal.props.style).toBeUndefined();
    expect(reveal.props.className).toBeUndefined();
  };

  it('funde igual bajo reduce motion', async () => {
    mockUseReducedMotion.mockReturnValue(true);
    await renderMotionHome();
    jest.mocked(withDelay).mockClear();
    const reveal = screen.getByTestId('summary-reveal');
    const { entering } = reveal.props;
    expect(entering).toEqual(expect.any(Function));
    expect(entering({})).toEqual({
      initialValues: { opacity: 0, transform: [{ translateY: 0 }] },
      animations: { opacity: 1, transform: [{ translateY: 0 }] },
    });
    expect(jest.mocked(withDelay).mock.calls.map(([ms]) => ms)).toEqual([0, 0]);
    expectRowUntouched(reveal);
    const row = screen.getByTestId('summary-weight').parent?.parent;
    expect(row?.children.filter((child) => typeof child !== 'string')).toEqual(
      ['summary-weight', 'summary-activity', 'summary-sleep', 'summary-distance'].map(
        (id) => screen.getByTestId(id).parent,
      ),
    );
  });

  it.each<DailyActivityState>([
    { kind: 'no-tracking' },
    { kind: 'error' },
    { kind: 'unreachable', message: 'network down' },
    { kind: 'missing-config' },
  ])('funde igual la fila con la actividad en $kind', async (state) => {
    mockGetDailyActivity.mockResolvedValue(state);
    await renderHome();
    const reveal = await screen.findByTestId('summary-reveal');
    jest.mocked(withDelay).mockClear();
    const { entering } = reveal.props;
    expect(entering).toEqual(expect.any(Function));
    expect(entering({})).toEqual({
      initialValues: { opacity: 0, transform: [{ translateY: 0 }] },
      animations: { opacity: 1, transform: [{ translateY: 0 }] },
    });
    expect(jest.mocked(withDelay).mock.calls.map(([ms]) => ms)).toEqual([0, 0]);
    expectRowUntouched(reveal);
  });

  it('monta el skeleton directamente en la tarjeta, sin fundido de salida propio', async () => {
    mockGetDailyActivity.mockReturnValue(pending<DailyActivityState>());
    await renderHome();
    expect((await screen.findByTestId('summary-skeleton')).parent)
      .toBe(screen.getByTestId('summary-card'));
  });

  (c) Dentro de `describe('#152 R8: ...')`, justo despues del cierre `  });`
      del it 'bajo reduce motion salta al nuevo valor al refrescar' y antes
      del `});` que cierra el describe (es la ultima linea del fichero),
      inserta una linea en blanco y:

  it('no añade texto ni nombre accesible a la fila', async () => {
    await renderMotionHome();
    const track = screen.getByTestId('collar-battery-track');
    const fill = screen.getByTestId('collar-battery-fill');
    expect(track.parent?.children.at(-1)).toBe(track);
    expect(fill.children).toEqual([]);
    for (const node of [track, fill]) {
      expect(Object.keys(node.props).filter((key) => typeof node.props[key] === 'string'))
        .toEqual(['testID', 'className']);
    }
    for (const node of [track, fill, track.parent]) {
      expect(Object.keys(node?.props ?? {}).filter((key) => /^(accessib|aria-|role$|importantForAccessibility)/.test(key)))
        .toEqual([]);
    }
    for (
      let node: typeof track | null = screen.getByTestId('collar-battery');
      node;
      node = node.parent
    ) {
      expect(Object.keys(node.props).filter((key) => /^(accessib|aria-|role$|importantForAccessibility)/.test(key)))
        .toEqual([]);
    }
  });

  No anadas imports: DailyActivityState, PetState, PetsState, pending, waitFor,
  fireEvent, withDelay, mockUseReducedMotion, mockListAlerts, makeAlert,
  renderHome y renderMotionHome ya estan.

  T=src/screens/home/index.test.tsx
  test "$(git diff --numstat -- $T | cut -f1,2)" = "$(printf '186\t0')"; echo "exit=$?"           -> exit=0
  grep -cF "it('no pinta ningún envoltorio sin mascota seleccionada'" $T                       -> 1
  grep -cF "])('no pinta el envoltorio de la actividad con \$kind'" $T                          -> 1
  grep -cF "como hijo directo de home-content y sin entrada'" $T                                -> 2
  grep -cF "it('funde igual bajo reduce motion'" $T                                             -> 1
  grep -cF "con el detalle en \$kind'" $T                                                       -> 1
  grep -cF "it('solo da entrada a los envoltorios, al fundido y al avatar del selector'" $T     -> 1
  grep -cF "])('no da entrada a home-states con %s'" $T                                         -> 1
  grep -cF "])('funde igual la fila con la actividad en \$kind'" $T                            -> 1
  grep -cF "it('no añade texto ni nombre accesible a la fila'" $T                               -> 1
  grep -cF "it('no da entrada al hero con alertas abiertas'" $T                                 -> 1
  grep -cF "it('monta el skeleton directamente en la tarjeta, sin fundido de salida propio'" $T -> 1
  grep -cF "enteringIds(screen.container)).toEqual(homeEnteringIds)" $T                         -> 2
  grep -cF "expectRowUntouched(reveal);" $T                                                     -> 2
  grep -cF "['summary-weight', 'summary-activity', 'summary-sleep', 'summary-distance'].map(" $T -> 1
  grep -cF "let node: typeof track | null = screen.getByTestId('collar-battery');" $T -> 1
  grep -cF "describe('#152" $T                                                                  -> 4
  tail -n 1 $T                                                                                  -> });

E4.3 Mutacion de sonda en src/screens/home/index.tsx y
  src/screens/home/collar-battery-bar.tsx (va en el commit rojo y se revierte
  en el verde, regla C4 de esta feature). Las anclas son lineas COMPLETAS
  (grep -cxF), no numeros de linea. En index.tsx, ocho cambios:
  - la linea
        {selectedPetId && (activity.data === undefined || activity.data.kind === 'ok') ? (
    pasa a
        {activity.data === undefined || activity.data.kind !== 'error' ? (
  - la linea
                <Animated.View testID="summary-reveal" entering={homeEntering(0, 0)}>
    pasa a
                <Animated.View testID="summary-reveal" entering={reduceMotion || activity.data.kind !== 'ok' ? undefined : homeEntering(0, 0)}>
  - antes de la linea `          <HeroUICard testID="pet-hero-error" className="items-start gap-3 p-4">`
    inserta `          <HomeEntrance index={0} testID="home-entrance-hero-error">`,
    y despues de la linea `          </HeroUICard>` inserta `          </HomeEntrance>`
  - antes de la linea `          <Button` (exactamente 10 espacios; es la del
    testID="weekly-activity-day-map") inserta
    `          <HomeEntrance index={6} testID="home-entrance-day-map">`, y despues
    de la linea `          </Button>` (exactamente 10 espacios) inserta
    `          </HomeEntrance>`
  - antes de la linea `        {detail.data?.kind === 'ok' && connection ? (` inserta
        {detail.data !== undefined && detail.data.kind !== 'ok' && detail.data.kind !== 'error' ? <HomeEntrance index={1} testID="home-entrance-collar"><View /></HomeEntrance> : null}
  - antes de la linea `          <View testID="home-hero-actions" className="flex-row items-center gap-3">` inserta
          <HomeEntrance index={0} testID="home-entrance-hero"><View /></HomeEntrance>
  - antes de la linea `          {pets.data === undefined ? (` inserta
          <HomeEntrance index={0} testID="home-entrance-states"><View /></HomeEntrance>
  - la linea
                <Skeleton testID="summary-skeleton" className="h-16 w-full rounded-xl" />
    pasa a
                <Animated.View><Skeleton testID="summary-skeleton" className="h-16 w-full rounded-xl" /></Animated.View>
  En collar-battery-bar.tsx, un cambio:
  - despues de la linea `      testID="collar-battery-track"` inserta
      accessibilityLabel="bateria"
    (6 espacios de sangria, como la linea ancla)
  Antes de editar, cada ancla da 1 con grep -cxF. Despues:
  P=src/screens/home/index.tsx; B=src/screens/home/collar-battery-bar.tsx
  test "$(git diff --numstat -- $P | cut -f1,2)" = "$(printf '10\t3')"; echo "exit=$?"  -> exit=0
  test "$(git diff --numstat -- $B | cut -f1,2)" = "$(printf '1\t0')"; echo "exit=$?"   -> exit=0
  grep -cF '<HomeEntrance' $P                                                     -> 11
  grep -cF "activity.data.kind !== 'error' ? (" $P                                -> 1
  grep -cF "entering={reduceMotion || activity.data.kind !== 'ok' ? undefined : homeEntering(0, 0)}" $P -> 1
  grep -cF 'accessibilityLabel="bateria"' $B                                      -> 1
  grep -cF '<Animated.View><Skeleton testID="summary-skeleton"' $P                -> 1

E4.4 Rojo E4:
  FORCE_COLOR=0 bunx jest src/screens/home/index.test.tsx > /tmp/152-r-e4.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       23 failed, 192 passed, 215 total`
  FORCE_COLOR=0 bunx jest src/__tests__/design-drift.test.ts src/__tests__/legibility-classnames.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/ui-language.test.ts > /tmp/152-r-e4-guards.txt 2>&1; echo "exit=$?"
    -> exit=0 y `Tests:       174 passed, 174 total`
  grep -qE '^Tests: +23 failed, 192 passed, 215 total$' /tmp/152-r-e4.txt \
    && test "$(grep -cF '✕ no pinta ningún envoltorio sin mascota seleccionada' /tmp/152-r-e4.txt)" = 1 \
    && test "$(grep -cF '✕ no pinta el envoltorio de la actividad con ' /tmp/152-r-e4.txt)" = 4 \
    && test "$(grep -cF '✕ deja el ' /tmp/152-r-e4.txt)" = 3 \
    && test "$(grep -cF '✕ no pinta los envoltorios del collar ni de la última posición con el detalle en ' /tmp/152-r-e4.txt)" = 3 \
    && test "$(grep -cF '✕ solo da entrada a los envoltorios, al fundido y al avatar del selector' /tmp/152-r-e4.txt)" = 1 \
    && test "$(grep -cF '✕ no da entrada a home-states con ' /tmp/152-r-e4.txt)" = 3 \
    && test "$(grep -cF '✕ funde igual bajo reduce motion' /tmp/152-r-e4.txt)" = 1 \
    && test "$(grep -cF '✕ funde igual la fila con la actividad en ' /tmp/152-r-e4.txt)" = 4 \
    && test "$(grep -cF '✕ no añade texto ni nombre accesible a la fila' /tmp/152-r-e4.txt)" = 1 \
    && test "$(grep -cF '✕ no da entrada al hero con alertas abiertas' /tmp/152-r-e4.txt)" = 1 \
    && test "$(grep -cF '✕ monta el skeleton directamente en la tarjeta, sin fundido de salida propio' /tmp/152-r-e4.txt)" = 1 \
    && test "$(grep -c '✕' /tmp/152-r-e4.txt)" = 23 \
    && ! grep -qE 'TypeError|ReferenceError|SyntaxError|Cannot find module|Unable to find' /tmp/152-r-e4.txt \
    && grep -qE '^Tests: +174 passed, 174 total$' /tmp/152-r-e4-guards.txt \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bun run lint \
    && git add src/screens/home/index.test.tsx src/screens/home/index.tsx src/screens/home/collar-battery-bar.tsx \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/screens/home/collar-battery-bar.tsx mobile-pet-tracker/src/screens/home/index.test.tsx mobile-pet-tracker/src/screens/home/index.tsx ' \
    && git commit -m 'test(mobile-home): #152 R5 R7 R8 red, wrappers, fade and battery copy locked on every branch'

E4.5 Verde E4: devuelve index.tsx y collar-battery-bar.tsx a su contenido de c7ac5ceb.
  git checkout c7ac5ceb -- src/screens/home/index.tsx src/screens/home/collar-battery-bar.tsx \
    && git diff --quiet c7ac5ceb -- src/screens/home/index.tsx src/screens/home/collar-battery-bar.tsx; echo "exit=$?"   -> exit=0
  FORCE_COLOR=0 bunx jest src/screens/home/index.test.tsx > /tmp/152-g-e4.txt 2>&1; echo "exit=$?"
    -> exit=0 y `Tests:       215 passed, 215 total`
  FORCE_COLOR=0 bunx jest src/__tests__/design-drift.test.ts src/__tests__/legibility-classnames.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/ui-language.test.ts > /tmp/152-g-e4-guards.txt 2>&1; echo "exit=$?"
    -> exit=0 y `Tests:       174 passed, 174 total`
  grep -qE '^Tests: +215 passed, 215 total$' /tmp/152-g-e4.txt \
    && grep -qE '^Tests: +174 passed, 174 total$' /tmp/152-g-e4-guards.txt \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bun run lint \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/screens/home/collar-battery-bar.tsx mobile-pet-tracker/src/screens/home/index.tsx ' \
    && test -z "$(git diff --name-only)" \
    && git commit -m 'feat(mobile-home): #152 R5 R7 R8 green, revert the probe mutation' \
    && git diff --quiet c7ac5ceb HEAD -- src/screens/home/index.tsx src/screens/home/collar-battery-bar.tsx; echo "exit=$?"   -> exit=0

E4.6 CIERRE: repitelo entero, tal cual, con estas cifras nuevas:
  - comparacion con la base: `Tests:       343 passed, 343 total`
    (281 de la base + 62 nuevos. Reparto: home/index 215, design-drift 62,
    global-css 51, motion 9, home-entrance 6)
  - jest entero: `Test Suites: 96 passed, 96 total` y `Tests:       2232 passed, 2232 total`
  - anclas 0-40 y las 8 positivas: mismos valores de cierre que antes
    (E4 no las mueve: `<HomeEntrance` vuelve a 6 en el verde)
  - lista cerrada: los mismos 11 ficheros

CAMBIA EN EL RESTO DEL HANDOFF:
- Son 28 commits, no 25: el rojo E4, el verde E4 y el commit documental de E4.
- traceability.md:
  - fila R5: «(23 casos)» en vez de «(7 `it`)», y añade el rojo y el verde de E4.
  - fila R7: «(9 casos)» en vez de «(3 `it`)», y añade el rojo y el verde de E4.
  - fila R8: «(12 casos: `it.each` de 4 filas y 8 `it`; …)» en vez de
    «(11 casos: `it.each` de 4 filas y 7 `it`; …)» (el resto del parentesis
    igual), y añade el rojo y el verde de E4.
- En el impl, una seccion `## Reanudacion E4` con la salida de E4.1-E4.6.
- Commit documental, desde la raiz:
  git add specs/mobile-home-motion-foundations/traceability.md progress/impl_mobile-home-motion-foundations.md \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'progress/impl_mobile-home-motion-foundations.md specs/mobile-home-motion-foundations/traceability.md ' \
    && git commit -m 'docs(mobile-home-motion-foundations): #152 traceability E4'
- No hagas push. Avisa al humano de que terminaste.
```
