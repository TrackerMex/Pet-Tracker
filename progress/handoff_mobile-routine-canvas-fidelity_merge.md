# Handoff a Codex CLI — #178, ronda de fusión con main (#183 y #179)

> **Nota del leader (2026-10-16).** #178 está implementada y aprobada por el reviewer en `6950f20a` (R1 a R13). El
> humano firmó la prueba de humo (R14) en `ecb51395`. Después, `main` avanzó hasta
> `91af2d9f9101ca9c99e43852b859255b8db565b2` (#183, la limpieza de registro #185/#186 y #179) y tocó los mismos ficheros
> compartidos de tests, carta y registro de copy. Esta ronda **solo fusiona `origin/main` en la rama** y resuelve
> **nueve conflictos**. **No es una feature nueva**: no hay R-id nuevo, ni commits rojo/verde, ni tests nuevos. Una sola
> salida: **un commit de fusión**, más una nota en el impl.
>
> El leader ya hizo la fusión en un árbol desechable. Las nueve resoluciones están **escritas en un script**
> (`progress/handoff_mobile-routine-canvas-fidelity_merge_resolve.py`) que el leader probó dos veces sobre árboles
> distintos con el mismo resultado byte a byte (mismo hash de árbol). El resultado pasa typecheck, lint y jest completo
> (112 suites, 3717 tests, sin `●`). No tienes que decidir ninguna resolución: ejecutas el script, compruebas las anclas y verificas.
>
> Reglas duras:
> - Nada de `rebase` (los hashes de `traceability.md` apuntan a commits de la rama).
> - **No corras `./init.sh` ni e2e.** Comparte LocalStack y Postgres con otras sesiones. Solo jest, typecheck y lint.
> - **Un solo jest a la vez en esta máquina:** M4a espera a que no haya ninguno.
> - Si un eslabón no cuadra, **PARA y reporta**. No toques un test para que cuadre: si un test de #178, #179 o #183
>   aserta algo que la resolución rompe, es una decisión del leader.
> - No edites a mano ningún fichero en conflicto: lo hace el script. Si el script dice `RESOLVE-FAIL`, PARA.
> - Cabeceras de este fichero con `# --`: no son comandos. Pega solo el contenido de cada bloque.
> - **Aplica Reintento y Flake antes de parar** (reglas en M4).
> - Rama: `feature/178-mobile-routine-canvas-fidelity`, worktree `/home/claude/sites/Pet-Tracker-wt-178`.

## Skills

Ninguna. Esta ronda no toca UI.

## B0 estado (antes de fusionar)

```
# -- B0 estado --
cd /home/claude/sites/Pet-Tracker-wt-178 && test "$(git branch --show-current)" = feature/178-mobile-routine-canvas-fidelity && git fetch -q && test "$(git rev-parse origin/main)" = 91af2d9f9101ca9c99e43852b859255b8db565b2 && git merge-base --is-ancestor ecb5139571c42d3a783eb44361ae375c8f057fc4 HEAD && test "$(git merge-base HEAD origin/main)" = 58bf412c12bd21f224292c89ace9bf083f9d98c9 && git diff --quiet && test -z "$(git ls-files --others --exclude-standard)" && git rev-parse HEAD
```

Anota el `HEAD` (es H0m). Si `origin/main` ya no es `91af2d9f`, PARA: el leader re-mide.

## M1 fusión sin commitear

```
# -- M1 fusion --
cd /home/claude/sites/Pet-Tracker-wt-178 && git merge origin/main --no-commit --no-ff; echo "exit=$?"; git diff --name-only --diff-filter=U | LC_ALL=C sort
```

Esperado: `exit=1` y **exactamente** estos nueve (en este orden):

```
docs/ui-guidelines.md
mobile-pet-tracker/src/__tests__/alerts-canvas-fidelity.test.ts
mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts
mobile-pet-tracker/src/__tests__/design-drift.test.ts
mobile-pet-tracker/src/__tests__/ui-language.test.ts
mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx
mobile-pet-tracker/src/theme/__tests__/global-css.test.ts
mobile-pet-tracker/src/theme/global.css
specs/mobile-ui-language/design.md
```

Si falta uno, sobra uno o hay un conflicto de otra naturaleza (add/add, delete/modify), PARA: `git merge --abort` y reporta.
Los demás ficheros (`catalog.ts`, `ui-copy-table.ts`, `_layout.tsx`, `layout.test.tsx`, `feature_list.json`, `STATUS.md`,
`progress/history.md`…) se fusionan solos: no los toques.

## M2 resolución

```
# -- M2 resolucion --
cd /home/claude/sites/Pet-Tracker-wt-178 && python3 -I progress/handoff_mobile-routine-canvas-fidelity_merge_resolve.py
```

Esperado: `RESOLVE-OK`. Qué hace, fichero a fichero (para que sepas qué verificas; **no lo repitas a mano**):

| Fichero | Resolución |
|---|---|
| `theme/global.css` | Se conservan `--radius-16` y `--radius-22` de #178. `--text-22` (de #179) ya estaba fuera del conflicto y se queda. |
| `theme/__tests__/global-css.test.ts` | Los describes `#178 R1` y `#179 R1` completos, uno tras otro, cada uno tal como está en su padre. |
| `providers/__tests__/language-provider.test.tsx` | Las deltas se suman: `+ 2 // #178 R3`, `+ 5 // #179 R3`, `- 2 // #179 R5`, `+ 9, // #183 R1` (la coma solo en la última). |
| `__tests__/alerts-canvas-fidelity.test.ts` | Inventario de `tracking-title`: `meal-schedule`, `meals-history` y `reminders`, en ese orden alfabético. |
| `__tests__/consistency-classnames.test.ts` | Cuatro recuentos: se suman las deltas de #178 y las de #179. En Recordatorios `bg-accent-soft` queda en `toBeNull()` (gana #178: la pantalla es la suya). |
| `__tests__/ui-language.test.ts` | Título de main (`51`, decorativo) y cálculo de #178 (`... + 1 + 1 + 1`). |
| `__tests__/design-drift.test.ts` | Los cuatro describes (`#178 R2`, `#179 R2`, `#178 R13`, `#179 R13`) completos, cada uno de su padre. |
| `docs/ui-guidelines.md` | Se conservan las dos líneas de cada conflicto: primero la de #178, después la de #179. |
| `specs/mobile-ui-language/design.md` | `§2.32` (#183) y `§2.33` (#179) de main; la sección de #178 pasa de `§2.32` a **`§2.34`**. |

**Una edición de test que el leader prescribe (decisión suya, no tuya).** El candado de radios de `#178 R13`
(`reserva los radios 14, 16 y 22 a Recordatorios con su inventario exacto`, en `design-drift.test.ts`) exigía que
`rounded-14` no apareciera en ningún otro fichero de `src/`. #179 usa `rounded-14` en `meal-schedule` y `meals-history`
(mismo token `--radius-14`, comparten el valor 14 px). El script lo parte en dos: `rounded-16` y `rounded-22` siguen
sin salir de Recordatorios, y `rounded-14` fuera de Recordatorios debe ser **exactamente** esos dos ficheros. La spec
de #178 no se edita: la desviación queda registrada en `traceability.md` y en la PR.

Anclas (cada una imprime su `-ok`; si una no lo imprime, PARA y reporta cuál):

```
# -- A global.css y su test --
cd /home/claude/sites/Pet-Tracker-wt-178/mobile-pet-tracker && C=src/theme && ! grep -qE '^(<<<<<<<|>>>>>>>)' $C/global.css $C/__tests__/global-css.test.ts && test "$(grep -cxF -- '  --radius-16: 16px;' $C/global.css)" = 1 && test "$(grep -cxF -- '  --radius-22: 22px;' $C/global.css)" = 1 && test "$(grep -cxF -- '  --text-22: 22px;' $C/global.css)" = 1 && test "$(grep -cF -e "describe('#178 R1:" -e "describe('#179 R1:" -e "describe('#175 R1:" $C/__tests__/global-css.test.ts)" = 3 && test "$(grep -cxF -- "      'radius-16': '16px'," $C/__tests__/global-css.test.ts)" = 1 && test "$(grep -cxF -- "      'text-22': '22px'," $C/__tests__/global-css.test.ts)" = 1 && echo A-ok
```

```
# -- B language-provider --
cd /home/claude/sites/Pet-Tracker-wt-178/mobile-pet-tracker && F=src/providers/__tests__/language-provider.test.tsx && test "$(grep -A3 -xF -- '        + 2 // #178 R3' $F | tail -n 3)" = "$(printf '%s\n%s\n%s' '        + 5 // #179 R3' '        - 2 // #179 R5' '        + 9, // #183 R1')" && test "$(grep -cxF -- '        + 2 // #178 R3' $F)" = 1 && test "$(grep -cxF -- '        + 2, // #178 R3' $F)" = 0 && echo B-ok
```

```
# -- C alerts-canvas --
cd /home/claude/sites/Pet-Tracker-wt-178/mobile-pet-tracker && F=src/__tests__/alerts-canvas-fidelity.test.ts && test "$(grep -A2 -xF -- "        'screens/meal-schedule/index.tsx', // #179 R4" $F | tail -n 2)" = "$(printf '%s\n%s' "        'screens/meals-history/index.tsx', // #179 R9" "        'screens/reminders/index.tsx', // #178 R4")" && test "$(grep -cF -- "'screens/reminders/index.tsx', // #178 R4" $F)" = 1 && echo C-ok
```

```
# -- D consistency-classnames --
cd /home/claude/sites/Pet-Tracker-wt-178/mobile-pet-tracker && F=src/__tests__/consistency-classnames.test.ts && test "$(grep -cF -- ').toBe(33 + 1 + 1 - 1 - 1 + 1 + 1 - 1 + 4 + 1 - 1 - 7 + 1 + 1 + 2 + 2); // #179 R5, R10, R12; #178 R6, R12;' $F)" = 1 && test "$(grep -cF -- 'expect(count(/style=\{CONTINUOUS_CORNER\}/g)).toBe(31 + 1 + 4 + 1 - 1 - 7 + 1 + 1 + 2 + 2); // #179 R5, R10, R12; #178 R6, R12;' $F)" = 1 && test "$(grep -cF -- 'expect(count(/rounded-xl bg-accent(?=[\s'"'"'"`])/g)).toBe(13 + 1 + 1 + 1 + 1 + 1 + 1 + 1 - 1 - 1 - 1 - 1); // #179 R7;' $F)" = 1 && test "$(grep -cF -- 'expect(count(/bg-accent-soft/g)).toBe(16 + 2 + 1 - 1 - 1 - 1 - 1 - 1 - 1 - 1 - 1 - 1 - 1); // #179 R6, R7, R11; #178 R5, R10, R12;' $F)" = 1 && test "$(grep -cF -- 'expect(accentSoftCount).toBe(16 + 2 + 1 - 1 - 1 - 1 - 1 - 1 - 1 - 1 - 1 - 1 - 1); // #179 R6, R7, R11; #178 R5, R10, R12;' $F)" = 1 && test "$(grep -cF -- 'expect(reminders.match(/bg-accent-soft/g)).toBeNull(); // #178 R5, R10' $F)" = 1 && test "$(grep -cF -- 'expect(reminders.match(/bg-accent-soft/g)).toHaveLength(1);' $F)" = 0 && test "$(grep -cF -- 'expect(count(/\bborder-b-4\b/g)).toBe(19 + 1 + 1 - 1 - 1 - 1 - 1); // #179 R7;' $F)" = 1 && test "$(grep -cF -- 'expect(count(/border-black\/25/g)).toBe(19 + 1 + 1 - 1 - 1 - 1 + 1 + 1 - 1); // #178 R10:' $F)" = 1 && echo D-ok
```

```
# -- E ui-language --
cd /home/claude/sites/Pet-Tracker-wt-178/mobile-pet-tracker && F=src/__tests__/ui-language.test.ts && test "$(grep -B1 -F -- 'expect(R8_REMINDERS).toHaveLength(' $F | head -n 1)" = "  it('resuelve las 51 ocurrencias normativas', () => {" && test "$(grep -cF -- 'expect(R8_REMINDERS).toHaveLength(50 + 1 - 2 + 1 - 1 + 1 + 1 + 1 + 1); // #178 R12' $F)" = 1 && test "$(grep -cF -- 'resuelve las 49 ocurrencias normativas' $F)" = 0 && echo E-ok
```

```
# -- F design-drift --
cd /home/claude/sites/Pet-Tracker-wt-178/mobile-pet-tracker && F=src/__tests__/design-drift.test.ts && test "$(grep -cF -e "describe('#178 R2: " -e "describe('#179 R2: " -e "describe('#178 R13: " -e "describe('#179 R13: " $F)" = 4 && test "$(grep -cxF -- '    const outsideReminders = (pattern: RegExp) => sourceFiles(sourceRoot).filter((file) =>' $F)" = 1 && test "$(grep -cxF -- '    expect(outsideReminders(/\brounded-(?:16|22)\b/)).toEqual([]);' $F)" = 1 && test "$(grep -cF -- "join('screens', 'meal-schedule', 'index.tsx'), // #179 R13 comparte rounded-14" $F)" = 1 && test "$(grep -cF -- "join('screens', 'meals-history', 'index.tsx'), // #179 R13 comparte rounded-14" $F)" = 1 && test "$(grep -cF -- 'rounded-(?:14|16|22)' $F)" = 0 && echo F-ok
```

```
# -- G ui-guidelines --
cd /home/claude/sites/Pet-Tracker-wt-178 && F=docs/ui-guidelines.md && ! grep -qE '^(<<<<<<<|>>>>>>>)' $F && test "$(grep -cF -- 'Fuera de la escala, por fidelidad al canvas (#178):' $F)" = 1 && test "$(grep -cF -- 'Fuera de la escala, por fidelidad al canvas (#179):' $F)" = 1 && test "$(grep -cF -- '- **Chip seleccionado** (fidelidad al canvas, #178):' $F)" = 1 && test "$(grep -cF -- '- **Secundarios de Horario** (fidelidad al canvas, #179):' $F)" = 1 && test "$(grep -nF -- '- **Chip seleccionado** (fidelidad al canvas, #178):' $F | cut -d: -f1)" -lt "$(grep -nF -- '- **Secundarios de Horario** (fidelidad al canvas, #179):' $F | cut -d: -f1)" && test "$(grep -nF -- '- **Secundarios de Horario** (fidelidad al canvas, #179):' $F | cut -d: -f1)" -lt "$(grep -nF -- '- **Sin labio**:' $F | cut -d: -f1)" && echo G-ok
```

```
# -- H design.md del registro --
cd /home/claude/sites/Pet-Tracker-wt-178 && F=specs/mobile-ui-language/design.md && test "$(grep -cF -- '### §2.32 — Añadidos por #183 — Validación en cliente de las pantallas de cuenta' $F)" = 1 && test "$(grep -cF -- '### §2.33 — Añadidos por #179 — Horario e Historial del canvas' $F)" = 1 && test "$(grep -cF -- '### §2.34 — Añadidos por #178 — Recordatorios del canvas' $F)" = 1 && test "$(grep -cF -- '### §2.32 — Añadidos por #178' $F)" = 0 && test "$(grep -cF -- '- [ ] Enmienda aprobada por humano (fecha: ____)' $F)" = "$(git show origin/main:$F | grep -cF -- '- [ ] Enmienda aprobada por humano (fecha: ____)')" && echo H-ok
```

## M3 marcar resuelto y comprobar que no queda nada

```
# -- M3 resuelto --
cd /home/claude/sites/Pet-Tracker-wt-178 && git add docs/ui-guidelines.md mobile-pet-tracker/src/__tests__/alerts-canvas-fidelity.test.ts mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts mobile-pet-tracker/src/__tests__/design-drift.test.ts mobile-pet-tracker/src/__tests__/ui-language.test.ts mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx mobile-pet-tracker/src/theme/__tests__/global-css.test.ts mobile-pet-tracker/src/theme/global.css specs/mobile-ui-language/design.md && test -z "$(git diff --name-only --diff-filter=U)" && test -z "$(git grep -nE '^(<<<<<<<|=======$|>>>>>>>)' -- . ':!progress' | head -1)" && echo M3-ok
```

## M4 verificación (sin init.sh)

Primero espera a que no haya jest ni eslint de otra sesión (la carga da timeouts falsos):

```
# -- M4a espera --
cd /home/claude/sites/Pet-Tracker-wt-178/mobile-pet-tracker && for i in $(seq 1 90); do pgrep -f 'node_modules/(\.bin/(jest|eslint)|jest-worker)|[i]nit\.sh' > /dev/null || break; sleep 60; done; echo fin-espera
```

Si tras la espera sigue habiendo procesos, PARA y reporta (no mates procesos ajenos).

```
# -- M4b tipos y lint --
cd /home/claude/sites/Pet-Tracker-wt-178/mobile-pet-tracker && test ! -e .expo/types/router.d.ts && bun run typecheck && bunx expo lint --no-cache > /tmp/178m-lint.txt 2>&1 && ! grep -qF 'Failed to run' /tmp/178m-lint.txt && test ! -s /tmp/178m-lint.txt && echo M4b-ok
```

**Reintento (una vez por línea):** si `lint` imprime `Failed to run` (OOM), repite M4b una vez.

```
# -- M4c ALL --
cd /home/claude/sites/Pet-Tracker-wt-178/mobile-pet-tracker && FORCE_COLOR=0 bunx jest --testTimeout=30000 > /tmp/178m-all.txt 2>&1; echo "exit=$?"; grep -E '^(Test Suites|Tests):' /tmp/178m-all.txt; grep -E '^  ● ' /tmp/178m-all.txt | grep -vxF '  ● Console' | sort | uniq -c
```

Esperado: `exit=0`, `Test Suites: 112 passed, 112 total`, `Tests: 3717 passed, 3717 total`, y **ningún** `●`.
(El leader midió esas cifras sobre la misma fusión, con `tsc` y lint en verde. En una de las dos corridas cayó `R1: me card` de profile, que pasó 131/131 las dos veces aislado: es el flake conocido, ver abajo.) Si las cifras difieren, anota las tuyas y PARA.

El aviso `A worker process has failed to exit gracefully` al final es preexistente: cuéntalo aparte, no es un fallo.

**Reintento:** si el log trae `reading 'canceled'` o `Exceeded timeout`, relanza M4c una vez.
**Flake:** si cae un `●` de un `it` que no es de #178, #179 ni #183 (p. ej. `#98 R7` de home o `R1: me card` de
profile), corre ese fichero solo, dos veces: `cd /home/claude/sites/Pet-Tracker-wt-178/mobile-pet-tracker && FORCE_COLOR=0 bunx jest --testTimeout=30000 -i <ruta del fichero con los paréntesis escapados>`.
Si el recuento de `●` es 0 las dos veces, espera a que no haya jest ajeno y relanza M4c una vez. Con cualquier otro `●`
(o `Test suite failed to run`, p. ej. `Cannot find module`), **no lo arregles**: es una colisión semántica o de entorno que el
leader debe decidir. Pégalo entero en el impl, **no** hagas `git merge --abort`: deja la fusión sin commitear y PARA.

## M5 el commit de fusión

```
# -- M5 commit --
cd /home/claude/sites/Pet-Tracker-wt-178 && git diff --quiet && test -z "$(git ls-files --others --exclude-standard)" && git commit -m "Merge origin/main (91af2d9f, #183 y #179) en feature/178-mobile-routine-canvas-fidelity" && git rev-parse HEAD HEAD^1 HEAD^2
```

`HEAD^1` debe ser H0m; `HEAD^2` debe ser `91af2d9f9101ca9c99e43852b859255b8db565b2`.

## M6 lista cerrada contra main

El merge no suma ningún fichero a los de #178. Las dos listas deben ser idénticas (**29** ficheros: los que #178 cambió
desde el ancestro común `58bf412c` hasta la firma `ecb51395`; el handoff de fusión y su script, añadidos después, se excluyen de la lista de la izquierda):

```
# -- M6 lista cerrada --
cd /home/claude/sites/Pet-Tracker-wt-178 && git diff --name-only 91af2d9f9101ca9c99e43852b859255b8db565b2 HEAD | grep -vxF -e progress/handoff_mobile-routine-canvas-fidelity_merge.md -e progress/handoff_mobile-routine-canvas-fidelity_merge_resolve.py | LC_ALL=C sort > /tmp/178m-main.txt && git diff --name-only 58bf412c12bd21f224292c89ace9bf083f9d98c9 ecb5139571c42d3a783eb44361ae375c8f057fc4 | LC_ALL=C sort > /tmp/178m-own.txt && wc -l < /tmp/178m-main.txt && diff /tmp/178m-main.txt /tmp/178m-own.txt && echo M6-ok
```

Si `diff` imprime algo, PARA y reporta.

## Nota en el impl

Añade al final de `progress/impl_mobile-routine-canvas-fidelity.md` una sección `## Ronda de fusión con main (#183 y #179)` con:
H0m y el hash del merge; la salida de B0, M1 (los nueve), `RESOLVE-OK`, cada ancla (`A-ok` a `H-ok`), `M3-ok`, `M4b-ok`, las
dos líneas de M4c, `M6-ok`; desviaciones («ninguna» si no hubo). Commit con `--only`:

```
# -- N nota --
cd /home/claude/sites/Pet-Tracker-wt-178 && git add progress/impl_mobile-routine-canvas-fidelity.md && git commit --only progress/impl_mobile-routine-canvas-fidelity.md -m "docs(progress): ronda de fusion de #178 con main (#183 y #179)"
```

## Qué no tocar

- `specs/mobile-routine-canvas-fidelity/*`, `feature_list.json`, `progress/current.md`, `progress/review_*`, este
  handoff y su script son del leader.
- Ningún test salvo lo que hace el script: si uno cae, es una decisión del leader (ver M4c).
- No marques la casilla de R14 ni ninguna otra, ni la de la plantilla de §6.2 de `mobile-ui-language/design.md`.
- No toques los worktrees de #184 ni #187 (`/home/claude/sites/Pet-Tracker-wt-184`, `/home/claude/sites/Pet-Tracker-wt-187`).

## Criterios de terminado

- Un commit de fusión con dos padres (`H0m` y `91af2d9f`), y después el commit de la nota.
- Las ocho anclas, M3, M4b, M4c (verde, sin `●`) y M6 en verde.
- Nada pendiente de humano: R14 ya está firmada.
