# Handoff a Codex CLI — #179, ronda de fusión con main (#183)

> **Nota del leader (2026-10-16).** #179 está implementada y aprobada por el reviewer en `1c9a144e` (R1 a R14). El
> humano firmó la prueba de humo (R14) en `dd60f5c1`. Después, #183 mergeó a `main` (`f0b636a4d01fa30ecbc8aa0029e4a45fd1f364da`) y tocó los mismos
> ficheros compartidos del registro de copy. Esta ronda **solo fusiona `origin/main` en la rama** y resuelve **tres
> conflictos**. **No es una feature nueva**: no hay R-id nuevo, ni commits rojo/verde, ni tests nuevos. Una sola
> salida: **un commit de fusión**, más una nota en el impl.
>
> El leader ya hizo la fusión en un árbol desechable: los tres conflictos se resuelven como abajo y el resultado
> pasa typecheck, lint y jest completo (112 suites, 3661 tests, sin `●`). No hay edición de test que prescribir
> (no hay M3b): las resoluciones de abajo bastan.
>
> Reglas duras:
> - Nada de `rebase` (los hashes de `traceability.md` apuntan a commits de la rama).
> - **No corras `./init.sh` ni e2e.** Otra sesión lo usa y comparte LocalStack y Postgres. Solo jest, typecheck y lint.
> - **Un solo jest a la vez en esta máquina:** Codex de #178 corre jest en otra terminal. M4a espera a que no haya ninguno.
> - Si un eslabón no cuadra, **PARA y reporta**. No toques un test para que cuadre: si un test de #179 o de #183
>   aserta algo que la resolución rompe, es una decisión del leader.
> - Cabeceras de este fichero con `# --`: no son comandos. Pega solo el contenido de cada bloque.
> - **Aplica Reintento y Flake antes de parar** (reglas en M4).
> - Rama: `feature/179-mobile-meal-schedule-canvas-fidelity`, worktree `/home/claude/sites/Pet-Tracker-wt-179`.

## Skills

Ninguna. Esta ronda no toca UI.

## B0 estado (antes de fusionar)

```
# -- B0 estado --
cd /home/claude/sites/Pet-Tracker-wt-179 && test "$(git branch --show-current)" = feature/179-mobile-meal-schedule-canvas-fidelity && git fetch -q && test "$(git rev-parse origin/main)" = f0b636a4d01fa30ecbc8aa0029e4a45fd1f364da && git merge-base --is-ancestor dd60f5c10ae13524b30001f4991fb01cb35f55ab HEAD && test "$(git merge-base HEAD origin/main)" = 58bf412c12bd21f224292c89ace9bf083f9d98c9 && git diff --quiet && git diff --cached --quiet && test -z "$(git ls-files --others --exclude-standard)" && git rev-parse HEAD && echo B0-ok
```

Anota el `HEAD` (es H0m). Si `origin/main` ya no es `f0b636a4`, PARA: el leader re-mide.

## M1 fusión sin commitear

```
# -- M1 fusion --
cd /home/claude/sites/Pet-Tracker-wt-179 && git merge origin/main --no-commit --no-ff; echo "exit=$?"; git diff --name-only --diff-filter=U | LC_ALL=C sort
```

Esperado: `exit=1` y **exactamente** estos tres (en este orden):

```
mobile-pet-tracker/src/__tests__/ui-language.test.ts
mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx
specs/mobile-ui-language/design.md
```

Si falta uno, sobra uno o hay un conflicto de otra naturaleza (add/add, delete/modify), PARA: `git merge --abort` y reporta.
Los demás ficheros (`catalog.ts`, `ui-copy-table.ts`, `feature_list.json`, `STATUS.md`, `progress/history.md`…) se fusionan
solos: no los toques.

## M2 resolución, fichero a fichero

Cada fichero tiene marcadores `<<<<<<< HEAD` / `=======` / `>>>>>>> origin/main`. Quita los marcadores y deja
**exactamente** lo que sigue.

### R-a `mobile-pet-tracker/src/__tests__/ui-language.test.ts` (1 conflicto, en `#65 R6`)

Gana la línea del título de **origin/main** (`51`; el número del título es decorativo, no lo calcules) y el
cálculo de **HEAD** (con el `+ 3` de #179 R8). Quedan **estas dos líneas**, con su sangría de dos y cuatro espacios:

```
  it('resuelve las 51 ocurrencias normativas', () => {
    expect(R6_FOOD).toHaveLength(35 + 3 + 1 - 2 + 1 + 3 + 9 + 11 + 2 + 1 + 3); // #105 R5; +1 #95 R4, -2 #95 R5, +1 #113 R3, +3 #147 R8, +9 #147 R9, +2 #155 R4, +1 #155 R9, +3 #179 R8
```

(La segunda línea es una sola, larga; el comentario termina en `+3 #179 R8`.)

```
# -- A ui-language --
cd /home/claude/sites/Pet-Tracker-wt-179/mobile-pet-tracker && F=src/__tests__/ui-language.test.ts && test "$(grep -B1 -F -- 'expect(R6_FOOD).toHaveLength(' $F | head -n 1)" = "  it('resuelve las 51 ocurrencias normativas', () => {" && test "$(grep -cF -- "expect(R6_FOOD).toHaveLength(35 + 3 + 1 - 2 + 1 + 3 + 9 + 11 + 2 + 1 + 3); // #105 R5; +1 #95 R4, -2 #95 R5, +1 #113 R3, +3 #147 R8, +9 #147 R9, +2 #155 R4, +1 #155 R9, +3 #179 R8" $F)" = 1 && test "$(grep -cF -- 'expect(R6_FOOD).toHaveLength(' $F)" = 1 && test "$(grep -cE '^(<<<<<<<|=======|>>>>>>>)' $F)" = 0 && echo A-ok
```

### R-b `mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx` (1 conflicto)

Las tres líneas se suman; la **coma final va solo en la última**. Queda, tras `+ 1 // #174 R2`:

```
        + 5 // #179 R3
        - 2 // #179 R5
        + 9, // #183 R1
    );
```

(`    );` ya está fuera del conflicto: no lo toques.)

```
# -- B language-provider --
cd /home/claude/sites/Pet-Tracker-wt-179/mobile-pet-tracker && F=src/providers/__tests__/language-provider.test.tsx && test "$(grep -A2 -xF -- '        + 5 // #179 R3' $F | tail -n 2)" = "$(printf '%s\n%s' '        - 2 // #179 R5' '        + 9, // #183 R1')" && test "$(grep -cxF -- '        + 5 // #179 R3' $F)" = 1 && test "$(grep -cxF -- '        - 2, // #179 R5' $F)" = 0 && test "$(grep -cxF -- '        + 9, // #183 R1' $F)" = 1 && test "$(grep -cE '^(<<<<<<<|=======|>>>>>>>)' $F)" = 0 && echo B-ok
```

### R-c `specs/mobile-ui-language/design.md` (1 conflicto)

Dos secciones con el mismo número `§2.32`. **Gana #183 (ya está en main): conserva su sección como `§2.32`. La de
#179 pasa a `§2.33`.** Quedan una tras otra, con **una línea en blanco** entre ellas y el contenido de cada una tal
cual (las nueve filas `validation.*` de #183; las cinco filas `mealSchedule.*` de #179). Solo cambia el encabezado de #179:

```
### §2.33 — Añadidos por #179 — Horario e Historial del canvas
```

No toques la casilla de la plantilla de §6.2 de este fichero (`- [ ] Enmienda aprobada por humano (fecha: ____)`): debe
seguir **sin marcar** (la exige #65 R19).

```
# -- C design.md --
cd /home/claude/sites/Pet-Tracker-wt-179 && F=specs/mobile-ui-language/design.md && test "$(grep -cF -- '### §2.32 — Añadidos por #183 — Validación en cliente de las pantallas de cuenta' $F)" = 1 && test "$(grep -cF -- '### §2.33 — Añadidos por #179 — Horario e Historial del canvas' $F)" = 1 && test "$(grep -cF -- '### §2.32 — Añadidos por #179' $F)" = 0 && test "$(grep -cF -- '← añadida por #179 (R3)' $F)" = 5 && test "$(grep -cF -- '← añadida por #183 (R1)' $F)" = 9 && test "$(grep -nF -- '### §2.32 — ' $F | cut -d: -f1)" -lt "$(grep -nF -- '### §2.33 — ' $F | cut -d: -f1)" && test "$(grep -cF -- '- [ ] Enmienda aprobada por humano (fecha: ____)' $F)" = 1 && test "$(grep -cE '^(<<<<<<<|=======|>>>>>>>)' $F)" = 0 && echo C-ok
```

## M3 marcar resuelto y comprobar que no queda nada

```
# -- M3 resuelto --
cd /home/claude/sites/Pet-Tracker-wt-179 && git add mobile-pet-tracker/src/__tests__/ui-language.test.ts mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx specs/mobile-ui-language/design.md && test -z "$(git diff --name-only --diff-filter=U)" && test -z "$(git grep -nE '^(<<<<<<<|=======$|>>>>>>>)' -- . ':!progress' | head -1)" && echo M3-ok
```

## M4 verificación (sin init.sh)

Primero espera a que no haya jest ni eslint de otra sesión (Codex de #178 y `init.sh` comparten esta máquina; la carga
da timeouts falsos):

```
# -- M4a espera --
cd /home/claude/sites/Pet-Tracker-wt-179/mobile-pet-tracker && for i in $(seq 1 90); do pgrep -f 'node_modules/(\.bin/(jest|eslint)|jest-worker)|[i]nit\.sh' > /dev/null || break; sleep 60; done; echo fin-espera
```

Si tras la espera sigue habiendo procesos, PARA y reporta (no mates procesos ajenos).

```
# -- M4b tipos y lint --
cd /home/claude/sites/Pet-Tracker-wt-179/mobile-pet-tracker && test ! -e .expo/types/router.d.ts && bun run typecheck && bunx expo lint --no-cache > /tmp/179m-lint.txt 2>&1 && ! grep -qF 'Failed to run' /tmp/179m-lint.txt && test ! -s /tmp/179m-lint.txt && echo M4b-ok
```

**Reintento (una vez por línea):** si `lint` imprime `Failed to run` (OOM), repite M4b una vez.

```
# -- M4c ALL --
cd /home/claude/sites/Pet-Tracker-wt-179/mobile-pet-tracker && FORCE_COLOR=0 bunx jest --testTimeout=30000 > /tmp/179m-all.txt 2>&1; echo "exit=$?"; grep -E '^(Test Suites|Tests):' /tmp/179m-all.txt; grep -E '^  ● ' /tmp/179m-all.txt | grep -vxF '  ● Console' | sort | uniq -c
```

Esperado: `exit=0`, `Test Suites: 112 passed, 112 total`, `Tests: 3661 passed, 3661 total`, y **ningún** `●`.
(El leader midió esas cifras sobre la misma fusión. `origin/main` sola da 112 suites y 3611 tests, medido; #179 suma 50 `it` y ninguna suite: 3611 + 50 = 3661.) Si las cifras difieren, anota las tuyas y PARA.

El aviso `A worker process has failed to exit gracefully` al final es preexistente: cuéntalo aparte, no es un fallo.

**Reintento:** si el log trae `reading 'canceled'` o `Exceeded timeout`, relanza M4c una vez.
**Flake:** si cae un `●` de un `it` que no es de #179 ni de #183 (p. ej. `#98 R7` de home o `R1: me card` de
profile), corre ese fichero solo, dos veces: `cd /home/claude/sites/Pet-Tracker-wt-179/mobile-pet-tracker && FORCE_COLOR=0 bunx jest --testTimeout=30000 -i <ruta del fichero con los paréntesis escapados>`.
Si el recuento de `●` es 0 las dos veces, espera a que no haya jest ajeno y relanza M4c una vez. Con cualquier otro `●`
(o `Test suite failed to run`, p. ej. `Cannot find module`), **no lo arregles**: es una colisión semántica o de entorno que el
leader debe decidir. Pégalo entero en el impl, **no** hagas `git merge --abort`: deja la fusión sin commitear y PARA.

## M5 el commit de fusión

```
# -- M5 commit --
cd /home/claude/sites/Pet-Tracker-wt-179 && git diff --quiet && test -z "$(git ls-files --others --exclude-standard)" && git commit -m "Merge origin/main (f0b636a4, #183) en feature/179-mobile-meal-schedule-canvas-fidelity" && git rev-parse HEAD HEAD^1 HEAD^2
```

`HEAD^1` debe ser H0m; `HEAD^2` debe ser `f0b636a4d01fa30ecbc8aa0029e4a45fd1f364da`.

## M6 lista cerrada contra main

El merge no suma ningún fichero a los de #179. Las dos listas deben ser idénticas (**30** ficheros: los que #179 cambió
desde el ancestro común `58bf412c`; el handoff de fusión, añadido después de `dd60f5c1`, se excluye de la lista de la izquierda):

```
# -- M6 lista cerrada --
cd /home/claude/sites/Pet-Tracker-wt-179 && git diff --name-only f0b636a4d01fa30ecbc8aa0029e4a45fd1f364da HEAD | grep -vxF -e progress/handoff_mobile-meal-schedule-canvas-fidelity_merge.md | LC_ALL=C sort > /tmp/179m-main.txt && git diff --name-only 58bf412c12bd21f224292c89ace9bf083f9d98c9 dd60f5c10ae13524b30001f4991fb01cb35f55ab | LC_ALL=C sort > /tmp/179m-own.txt && wc -l < /tmp/179m-main.txt && diff /tmp/179m-own.txt /tmp/179m-main.txt && echo M6-ok
```

Si `diff` imprime algo, PARA y reporta.

## Nota en el impl

Añade al final de `progress/impl_mobile-meal-schedule-canvas-fidelity.md` una sección `## Ronda de fusión con main (#183)` con:
H0m y el hash del merge; la salida de B0, M1 (los tres), cada ancla (`A-ok`, `B-ok`, `C-ok`), `M3-ok`, `M4b-ok`, las
dos líneas de M4c, `M6-ok`; desviaciones («ninguna» si no hubo). Commit con `--only`:

```
# -- N nota --
cd /home/claude/sites/Pet-Tracker-wt-179 && git add progress/impl_mobile-meal-schedule-canvas-fidelity.md && git commit --only progress/impl_mobile-meal-schedule-canvas-fidelity.md -m "docs(progress): ronda de fusion de #179 con main (#183)"
```

## Qué no tocar

- `specs/mobile-meal-schedule-canvas-fidelity/*`, `feature_list.json`, `progress/current.md`, `progress/review_*` y este
  handoff son del leader.
- Ningún test: si uno cae, es una decisión del leader (ver M4c).
- No marques la casilla de R14 ni ninguna otra, ni la de la plantilla de §6.2.
- No toques el worktree de #178 (`/home/claude/sites/Pet-Tracker-wt-178`).

## Criterios de terminado

- Un commit de fusión con dos padres (`H0m` y `f0b636a4`), y después el commit de la nota.
- Las tres anclas y M3, M4b, M4c (verde, sin `●`) y M6 en verde.
- Nada pendiente de humano: R14 ya está firmada.
