# Handoff a Codex CLI — #190 mobile-home-pingo-phrase, ronda 2 (hallazgo del reviewer)

> Pega el bloque de abajo en Codex CLI. La ronda 1 (`progress/handoff_mobile-home-pingo-phrase.md`)
> ya se cumplió y se aprobó (`progress/review_mobile-home-pingo-phrase.md`, R1–R14). Esta ronda
> corrige un único hallazgo del reviewer: el test de R14 compara el cuerpo de la enmienda con la
> casilla `- [ ]` literal, así que se pone rojo en cuanto el humano la firma (mismo patrón que
> #167, #171 y #174). Es un cambio solo de test: un commit. No hay producción que tocar.
>
> El leader midió en `0c674267`, antes de escribir este fichero: `home-pingo-phrase.test.ts`
> exit=0, 5 passed; `router.d.ts` ausente; anclas A1–A5 con su valor.

---

```
Worktree: /home/claude/sites/Pet-Tracker-wt-190   <- PRIMERA LINEA. Trabaja AQUI y en ningun otro sitio
Antes de tocar nada, ejecuta `pwd`, `git branch --show-current`,
`git rev-parse --short HEAD` y `git status --short` y pega las cuatro salidas
en una seccion NUEVA al FINAL de progress/impl_mobile-home-pingo-phrase.md:
`# Ronda 2 — casilla de la enmienda` > `## Base`. No edites nada de la ronda 1
de ese fichero: solo anades al final. El hash es H0R2: el commit que anade este
handoff. PARA si la branch no es feature/190-mobile-home-pingo-phrase o si
`git status --short` no sale vacio. No toques /home/claude/sites/Pet-Tracker ni
ningun otro worktree, ni cambies de branch en ninguno.

Feature: mobile-home-pingo-phrase (#190), ronda 2. La spec esta aprobada y
cerrada: no reabras ninguna decision.

== QUE HACES ==

UN solo commit, de test, con el mensaje exacto:
`test(home): tolerate the signed amendment checkbox (R14)`

Fichero que cambia, UNO: mobile-pet-tracker/src/__tests__/home-pingo-phrase.test.ts,
solo el `it('copia el texto completo tras la Enmienda 186 y deja la casilla para el humano', ...)`
dentro de `describe('#190 R14: la carta incorpora la enmienda aprobada', ...)`.

Intencion del cambio (tu escribes el codigo):
1. El cuerpo de la enmienda se sigue comparando con `toBe` contra el texto
   literal de design.md, linea por linea, pero SIN la linea de la casilla.
   Ningun parrafo del cuerpo cambia ni se relaja.
2. La casilla se comprueba aparte, sobre la ultima linea de la seccion, con una
   expresion anclada que acepte `[ ]`, `[x]` y `[X]`:
   `^- \[[ xX]\] Enmienda #190 aprobada por humano$`. Nada puede ir detras de
   ella dentro de la seccion (la seccion sigue acabando donde acaba hoy:
   `split('\n## ')[0].trim()`), y debe existir exactamente una.
3. Ancla el cuerpo y la casilla al texto exacto: una casilla con otro texto
   («aprobada por el humano»), una segunda casilla, o la casilla ausente,
   deben fallar el test.
4. Renombra el `it` solo si el titulo actual deja de ser cierto («deja la casilla
   para el humano» sigue siendo cierto: la casilla es del humano, marcada o no).
   Si lo dejas igual, mejor.

Prohibido: tocar docs/ui-guidelines.md (la casilla sigue SIN marcar: es del
humano), cualquier otro test, produccion, specs/ (la trazabilidad la actualiza
el leader despues), package.json, bun.lock y backend-pet-tracker/.

== ANCLAS (valores medidos por el leader en 0c674267; si alguna no coincide, PARA) ==

Desde /home/claude/sites/Pet-Tracker-wt-190/mobile-pet-tracker:
A1: grep -cF -- '- [ ] Enmienda #190 aprobada por humano' ../docs/ui-guidelines.md   -> 1
A2: grep -cF -- '- [ ] Enmienda #190 aprobada por humano' src/__tests__/home-pingo-phrase.test.ts   -> 1
A3: grep -cF "describe('#190 R14: la carta incorpora la enmienda aprobada'" src/__tests__/home-pingo-phrase.test.ts   -> 1
A4: grep -cF "it('copia el texto completo tras la Enmienda 186 y deja la casilla para el humano'" src/__tests__/home-pingo-phrase.test.ts   -> 1
A5: test ! -e .expo/types/router.d.ts && echo ok   -> ok (nunca borres router.d.ts; si existe, PARA)

== SONDAS (se plantan, se miden y se revierten SIN commit) ==

Cada sonda planta un cambio en ../docs/ui-guidelines.md (cwd: mobile-pet-tracker/),
corre el fichero entero (`FORCE_COLOR=0 bunx jest --runInBand --silent --runTestsByPath src/__tests__/home-pingo-phrase.test.ts > <log fuera del arbol> 2>&1; echo "exit=$?"`)
y se revierte con `git checkout HEAD -- ../docs/ui-guidelines.md`; tras cada
reversion comprueba `git diff --stat` vacio, `git diff --cached --stat` vacio y
el ancla A1 en 1.

S0 (ANTES de tocar el test; es tu rojo): marca la casilla con
  `sed -i 's/^- \[ \] Enmienda #190 aprobada por humano$/- [x] Enmienda #190 aprobada por humano/' ../docs/ui-guidelines.md`
  Esperado con el test actual: 1 fallo (el de R14), 4 verdes, exit=1. Guarda el log.
Edita el test. Luego, con el test nuevo:
S1: casilla sin tocar -> 5/5, exit=0.
S2: casilla `[x]` (el sed de S0) -> 5/5, exit=0.
S3: casilla `[X]` (mismo sed con X mayuscula) -> 5/5, exit=0.
S4: borra la linea de la casilla (`sed -i '/^- \[ \] Enmienda #190 aprobada por humano$/d'`) -> falla el R14, exit=1.
S5: texto de la casilla distinto (`sed -i 's/^- \[ \] Enmienda #190 aprobada por humano$/- [x] Enmienda #190 aprobada por el humano/'`) -> falla el R14, exit=1.
S6: cuerpo mutado CON la casilla firmada: aplica el sed de S0 y ademas
  `sed -i 's/Un solo uso hoy\./Dos usos hoy./' ../docs/ui-guidelines.md` -> falla el R14, exit=1.
S7: dos casillas: tras la linea de la casilla anade otra identica
  (`sed -i 's/^\(- \[ \] Enmienda #190 aprobada por humano\)$/\1\n\1/' ../docs/ui-guidelines.md`) -> falla el R14, exit=1.
Si alguna sonda sale distinta de lo esperado, el candado es ciego en esa zona:
corrigelo antes de commitear y anotalo. Pega en el impl, por sonda, el comando
y el exit.

== VERIFICACION Y CIERRE ==

Desde mobile-pet-tracker/, sin pipe (`> log 2>&1; echo "exit=$?"`), logs fuera del arbol, FORCE_COLOR=0:
- `bunx jest --runInBand --silent --runTestsByPath src/__tests__/home-pingo-phrase.test.ts` -> exit=0, 5 passed.
- `bunx tsc --noEmit` -> exit=0.
- `bun run lint` -> exit=0, y el log sin las palabras `Killed`, `SIGKILL`, `error`, `warning`
  (`grep -ciE 'killed|sigkill|error|warning' <log>` -> 0; el lint se traga el SIGKILL y sale 0).
- `git diff --name-only 0c674267..HEAD` (antes de commitear: `git status --short`) lista UN fichero:
  mobile-pet-tracker/src/__tests__/home-pingo-phrase.test.ts, mas progress/impl_mobile-home-pingo-phrase.md
  si lo commiteas aparte.
Commits: 1) el de test, con el mensaje exacto de arriba; 2) `docs(home): ronda 2 del impl de #190`
solo con tu seccion nueva de progress/impl_mobile-home-pingo-phrase.md. Dos commits, sin mezclar.
Cada comando git de commit lleva su propio `git add <ruta exacta>` (nada de `-a` ni `add .`).

Reglas: `bun` para todo, nunca npx ni npm i -g. NO lances init.sh (lo corre el leader) ni abras PR;
`pgrep -af '[i]nit\.sh'` sin pipe: si sale algo, espera antes de correr jest. No cargues skills:
es un cambio solo de test, sin UI. No marques ninguna casilla humana (la de la carta ni R15).
Esperas: si algun test espera algo asincrono, sigue docs/conventions.md §Esperas; este no deberia.
Al terminar, el impl lleva: base (cuatro salidas), las ocho sondas S0–S7 con su exit, las
verificaciones, los dos hashes y la lista de ficheros tocados. No declares la feature cerrada.
```
