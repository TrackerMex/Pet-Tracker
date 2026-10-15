# Handoff a Codex CLI — #175, ronda de fusión con main (#174)

> **Nota del leader (2026-10-15).** #175 está implementada y aprobada por el reviewer en `b9aa93d6` (R1 a R10).
> Después, #174 mergeó a `main` (`deaf4e6d99f46e8dcd3f8cd386e4312b9ce5f739`) y tocó los mismos ficheros compartidos.
> Esta ronda **solo fusiona `origin/main` en la rama** y resuelve seis conflictos. **No es una feature nueva**: no hay
> R-id nuevo, ni commits rojo/verde, ni tests nuevos. Una sola salida: **un commit de fusión**, más una nota en el impl.
>
> Reglas duras:
> - Nada de `rebase` (los hashes de `traceability.md` apuntan a commits de la rama).
> - **No corras `./init.sh` ni e2e.** Otra sesión lo usa y comparte LocalStack y Postgres. Solo jest, typecheck y lint.
> - Si un eslabón no cuadra, **PARA y reporta**. No toques un test para que cuadre: si un test de #175 o de #174
>   aserta algo que la resolución rompe, es una decisión del leader.
> - Cabeceras de este fichero con `# --`: no son comandos.
> - Rama: `feature/175-mobile-docs-canvas-fidelity`, worktree `/home/claude/sites/Pet-Tracker-wt-175`.

## Skills

Ninguna nueva. Esta ronda no toca UI.

## B0 estado (antes de fusionar)

```
# -- B0 estado --
cd /home/claude/sites/Pet-Tracker-wt-175 && test "$(git branch --show-current)" = feature/175-mobile-docs-canvas-fidelity && git fetch -q && test "$(git rev-parse origin/main)" = deaf4e6d99f46e8dcd3f8cd386e4312b9ce5f739 && git diff --quiet && git diff --cached --quiet && test -z "$(git ls-files --others --exclude-standard)" && git rev-parse HEAD && echo B0-ok
```

Anota el `HEAD` (es H0m). Si `origin/main` ya no es `deaf4e6d`, PARA: el leader re-mide.

## M1 fusión sin commitear

```
# -- M1 fusion --
cd /home/claude/sites/Pet-Tracker-wt-175 && git merge origin/main --no-commit --no-ff; echo "exit=$?"; git diff --name-only --diff-filter=U | LC_ALL=C sort
```

Esperado: `exit=1` y **exactamente** estos seis (en este orden):

```
docs/ui-guidelines.md
mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts
mobile-pet-tracker/src/__tests__/profile-canvas-fidelity.test.ts
mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx
mobile-pet-tracker/src/theme/global.css
specs/mobile-ui-language/design.md
```

Si falta uno, sobra uno o hay un conflicto de otra naturaleza (add/add, delete/modify), PARA: `git merge --abort` y reporta.

## M2 resolución, fichero a fichero

Cada fichero tiene marcadores `<<<<<<< HEAD` / `=======` / `>>>>>>> origin/main`. Quita los marcadores y deja
**exactamente** lo que sigue. R-a a R-d son de `mobile-pet-tracker/`; R-e (`specs/`) y R-f (`docs/`) también los
haces tú, porque están en el mismo merge.

### R-a `mobile-pet-tracker/src/theme/global.css` (1 conflicto)

Unión de las dos mitades, `--tracking-title` una sola vez, en este orden exacto:

```
  --radius-10: 10px;
  --radius-24: 24px;
  --tracking-title: -0.02em;
  --tracking-caps: 0.06em;
  --tracking-eyebrow: 0.08em;
```

`--text-11: 11px;` (de #175) y `--text-15`, `--text-17`, `--text-26` (de main) ya están fuera del conflicto: no los toques.

```
# -- A global.css --
cd /home/claude/sites/Pet-Tracker-wt-175/mobile-pet-tracker && for t in '--radius-10: 10px;' '--radius-24: 24px;' '--tracking-title: -0.02em;' '--tracking-caps: 0.06em;' '--tracking-eyebrow: 0.08em;' '--text-11: 11px;' '--text-15: 15px;'; do test "$(grep -cF -- "  $t" src/theme/global.css)" = 1 || { echo "FALLA $t"; false; }; done && test "$(grep -cE '^(<<<<<<<|=======|>>>>>>>)' src/theme/global.css)" = 0 && echo A-ok
```

### R-b `mobile-pet-tracker/src/__tests__/profile-canvas-fidelity.test.ts` (2 conflictos)

Conserva **las dos** líneas de cada conflicto, en orden `LC_ALL=C` (`alerts` precede a `docs`):

- Lista de `text-26` — queda:
  ```
      'screens/alerts/index.tsx', // #174 R3
      'screens/docs/index.tsx', // #175 R5
  ```
  seguida de `'screens/profile/index.tsx',` y lo que ya hubiera.
- Lista de `text-13` — queda:
  ```
      'screens/alerts/index.tsx', // #174 R4, R6
      'screens/docs/index.tsx', // #175 R8
  ```

```
# -- B profile-canvas-fidelity --
cd /home/claude/sites/Pet-Tracker-wt-175/mobile-pet-tracker && test "$(grep -cF -- "'screens/alerts/index.tsx', // #174 R3" src/__tests__/profile-canvas-fidelity.test.ts)" = 1 && test "$(grep -cF -- "'screens/docs/index.tsx', // #175 R5" src/__tests__/profile-canvas-fidelity.test.ts)" = 1 && test "$(grep -cF -- "'screens/alerts/index.tsx', // #174 R4, R6" src/__tests__/profile-canvas-fidelity.test.ts)" = 1 && test "$(grep -cF -- "'screens/docs/index.tsx', // #175 R8" src/__tests__/profile-canvas-fidelity.test.ts)" = 1 && test "$(grep -cE '^(<<<<<<<|=======|>>>>>>>)' src/__tests__/profile-canvas-fidelity.test.ts)" = 0 && echo B-ok
```

### R-c `mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts` (1 conflicto)

**Las dos líneas del conflicto son textualmente iguales en la suma (`4 + 1 + 1 + 1`) y por eso engañan**: cada
feature sumó 1 a la misma base `4 + 1 + 1`. La fusión suma **los dos**. Queda esta única línea:

```
    expect(count(/border-lip-gray/g)).toBe(4 + 1 + 1 + 1 + 1); // #170 R16; #171 R14; #174 R8; #175 R7: borde de la zona de subida
```

```
# -- C consistency-classnames --
cd /home/claude/sites/Pet-Tracker-wt-175/mobile-pet-tracker && test "$(grep -cF -- 'toBe(4 + 1 + 1 + 1 + 1); // #170 R16; #171 R14; #174 R8; #175 R7: borde de la zona de subida' src/__tests__/consistency-classnames.test.ts)" = 1 && test "$(grep -cF -- 'count(/border-lip-gray/g)' src/__tests__/consistency-classnames.test.ts)" = 1 && test "$(grep -cE '^(<<<<<<<|=======|>>>>>>>)' src/__tests__/consistency-classnames.test.ts)" = 0 && echo C-ok
```

### R-d `mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx` (1 conflicto)

Las dos líneas se suman; la **coma final va solo en la última**. Queda, tras `- 4 + 3 // #173 R13`:

```
        + 7 // #175 R3
        + 1, // #174 R2
```

```
# -- D language-provider --
cd /home/claude/sites/Pet-Tracker-wt-175/mobile-pet-tracker && test "$(grep -cF -- '        + 7 // #175 R3' src/providers/__tests__/language-provider.test.tsx)" = 1 && test "$(grep -cF -- '        + 1, // #174 R2' src/providers/__tests__/language-provider.test.tsx)" = 1 && test "$(grep -cE '^(<<<<<<<|=======|>>>>>>>)' src/providers/__tests__/language-provider.test.tsx)" = 0 && echo D-ok
```

### R-e `specs/mobile-ui-language/design.md` (1 conflicto)

Dos secciones con el mismo número `§2.30`. **Gana #174 (ya está en main): conserva su sección como `§2.30`. La de
#175 pasa a `§2.31`.** Quedan una tras otra, con una línea en blanco entre ellas y el contenido de cada una tal
cual (la tabla de `alerts.dayAgo` de #174; las siete filas `docs.*` de #175). Solo cambia el encabezado de #175:

```
### §2.31 — Añadidos por #175 — Documentos del canvas
```

No toques la casilla de la plantilla de §6.2 de este fichero: debe seguir **sin marcar** (la exige #65 R19).

```
# -- E design.md --
cd /home/claude/sites/Pet-Tracker-wt-175 && test "$(grep -cF -- '### §2.30 — Añadidos por #174 — Alertas fieles al canvas' specs/mobile-ui-language/design.md)" = 1 && test "$(grep -cF -- '### §2.31 — Añadidos por #175 — Documentos del canvas' specs/mobile-ui-language/design.md)" = 1 && test "$(grep -cF -- '### §2.30 — Añadidos por #175' specs/mobile-ui-language/design.md)" = 0 && test "$(grep -cF -- '← añadida por #175 (R3)' specs/mobile-ui-language/design.md)" = 7 && test "$(grep -cF -- '← añadida por #174 (R2)' specs/mobile-ui-language/design.md)" -ge 1 && test "$(grep -cE '^(<<<<<<<|=======|>>>>>>>)' specs/mobile-ui-language/design.md)" = 0 && echo E-ok
```

### R-f `docs/ui-guidelines.md` (3 conflictos)

1. **Líneas de la regla 2** (primer conflicto). Dos líneas, no una:
   - *Tamaños*: el lado **HEAD** tal cual (lleva `--text-11: 11px` además de `--text-13`, `--text-26` y `--text-15`).
   - *Tracking*: el lado **origin/main** (etiqueta `#174`), con `` `--tracking-eyebrow: 0.08em` `` añadido al final
     de su lista. Debe quedar exactamente:
     ```
        Tracking fuera de la escala de Tailwind (fidelidad al canvas, #174): `--tracking-title: -0.02em`, `--tracking-caps: 0.06em`, `--tracking-eyebrow: 0.08em`; la clase `tracking-*` va con una clase `text-*` en el mismo elemento, porque uniwind multiplica el `em` por su tamaño.
     ```
     (Sangría de tres espacios, como las demás líneas de esa regla.)
2. **Frases de §12** (segundo conflicto). Las dos, en este orden: primero la de `#174` (`rounded-10`), después la
   de `#175` (`rounded-24`), cada una en su línea con su sangría de cuatro espacios.
3. **Casilla** (tercer conflicto). Se toma **todo el lado origin/main**: la casilla ya firmada
   `- [X] Enmienda de fidelidad al canvas aprobada por humano (fecha: 2026-10-15)` y el bloque
   `## Enmienda #174 — Alertas fieles al canvas` completo con su casilla `- [X]`. Se descarta la casilla sin marcar
   de #175 (`(fecha: ____)`): la sección es la misma y llega firmada por main.

```
# -- F ui-guidelines --
cd /home/claude/sites/Pet-Tracker-wt-175 && test "$(grep -cF -- '## Enmienda de fidelidad al canvas (2026-10-13)' docs/ui-guidelines.md)" = 1 && test "$(grep -cF -- '- [X] Enmienda de fidelidad al canvas aprobada por humano (fecha: 2026-10-15)' docs/ui-guidelines.md)" = 1 && test "$(grep -cF -- '(fecha: ____)' docs/ui-guidelines.md)" = 0 && test "$(grep -cF -- '## Enmienda #174 — Alertas fieles al canvas' docs/ui-guidelines.md)" = 1 && test "$(grep -cF -- '`--tracking-title: -0.02em`, `--tracking-caps: 0.06em`, `--tracking-eyebrow: 0.08em`;' docs/ui-guidelines.md)" = 1 && test "$(grep -cF -- '`--text-11: 11px`' docs/ui-guidelines.md)" = 1 && test "$(grep -cF -- 'por fidelidad al canvas (#174): `rounded-10` (10 px)' docs/ui-guidelines.md)" = 1 && test "$(grep -cF -- 'por fidelidad al canvas (#175): `rounded-24` (24 px)' docs/ui-guidelines.md)" = 1 && test "$(grep -cE '^(<<<<<<<|=======|>>>>>>>)' docs/ui-guidelines.md)" = 0 && echo F-ok
```

Después de las anclas, comprueba a mano que en la regla 12 la frase de #174 va **antes** que la de #175 y que
ninguna de las dos quedó fuera de la regla (entre `12. **Escala de radios**` y `13. **Botón con cuerpo**`).

## M3 marcar resuelto y comprobar que no queda nada

```
# -- M3 resuelto --
cd /home/claude/sites/Pet-Tracker-wt-175 && git add docs/ui-guidelines.md specs/mobile-ui-language/design.md mobile-pet-tracker/src/theme/global.css mobile-pet-tracker/src/__tests__/profile-canvas-fidelity.test.ts mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx && test -z "$(git diff --name-only --diff-filter=U)" && test -z "$(git grep -nE '^(<<<<<<<|=======$|>>>>>>>)' -- . ':!progress' | head -1)" && echo M3-ok
```

## M4 verificación (sin init.sh)

Primero espera a que no haya jest ni eslint de otra sesión (otra sesión corre `init.sh` y la carga da timeouts falsos):

```
# -- M4a espera --
cd /home/claude/sites/Pet-Tracker-wt-175/mobile-pet-tracker && for i in $(seq 1 90); do pgrep -f 'node_modules/(\.bin/(jest|eslint)|jest-worker)|[i]nit\.sh' > /dev/null || break; sleep 60; done; echo fin-espera
```

Si tras la espera sigue habiendo procesos, PARA y reporta (no mates procesos ajenos).

```
# -- M4b tipos y lint --
cd /home/claude/sites/Pet-Tracker-wt-175/mobile-pet-tracker && test ! -e .expo/types/router.d.ts && bun run typecheck && bunx expo lint --no-cache > /tmp/175-merge-lint.txt 2>&1 && ! grep -qF 'Failed to run' /tmp/175-merge-lint.txt && test ! -s /tmp/175-merge-lint.txt && echo M4b-ok
```

```
# -- M4c ALL --
cd /home/claude/sites/Pet-Tracker-wt-175/mobile-pet-tracker && FORCE_COLOR=0 bunx jest --testTimeout=30000 > /tmp/175-merge-all.txt 2>&1; echo "exit=$?"; grep -E '^(Test Suites|Tests):' /tmp/175-merge-all.txt; grep -E '^  ● ' /tmp/175-merge-all.txt | grep -vxF '  ● Console' | sort | uniq -c
```

Esperado: `exit=0`, `Test Suites: N passed, N total`, `Tests: M passed, M total`, y **ningún** `●`. Anota N y M. (Antes de la
fusión: 110 suites y 3389 + (K − 1252) tests, con K en `progress/impl_mobile-docs-canvas-fidelity.md`. Después van
sumados los suites y tests de #174; el leader cruza tus cifras con las de `origin/main`.)

El aviso `A worker process has failed to exit gracefully` al final es preexistente: cuéntalo aparte, no es un fallo.

Si algún `●` cae, **no lo arregles**: es una colisión semántica que el leader debe decidir. Pégalo entero en el impl,
`git merge --abort` **no**: deja la fusión sin commitear y PARA.

## M5 el commit de fusión

```
# -- M5 commit --
cd /home/claude/sites/Pet-Tracker-wt-175 && git diff --quiet && test -z "$(git ls-files --others --exclude-standard)" && git commit -m "Merge origin/main (deaf4e6d, #174) en feature/175-mobile-docs-canvas-fidelity" && git rev-parse HEAD HEAD^1 HEAD^2
```

`HEAD^1` debe ser H0m; `HEAD^2` debe ser `deaf4e6d99f46e8dcd3f8cd386e4312b9ce5f739`.

## M6 lista cerrada contra main

El merge no cambia **qué ficheros** toca #175 respecto de `main`. Las dos listas deben ser idénticas (23 ficheros; el propio handoff de fusión se excluye de la lista de la derecha, porque se añadió después de `b9aa93d6`):

```
# -- M6 lista cerrada --
cd /home/claude/sites/Pet-Tracker-wt-175 && git diff --name-only deaf4e6d99f46e8dcd3f8cd386e4312b9ce5f739 HEAD | grep -vxF progress/handoff_mobile-docs-canvas-fidelity_merge.md | LC_ALL=C sort > /tmp/175-merge-main.txt && git diff --name-only dea11875 b9aa93d6 | LC_ALL=C sort > /tmp/175-merge-own.txt && wc -l < /tmp/175-merge-main.txt && diff /tmp/175-merge-own.txt /tmp/175-merge-main.txt && echo M6-ok
```

Si `diff` imprime algo, PARA y reporta.

## Nota en el impl

Añade al final de `progress/impl_mobile-docs-canvas-fidelity.md` una sección `## Ronda de fusión con main (#174)` con:
H0m y el hash del merge; la salida de B0, M1 (los seis), cada ancla (`A-ok` … `F-ok`), `M3-ok`, `M4b-ok`, las dos
líneas de M4c, `M6-ok`; desviaciones («ninguna» si no hubo). Commit con `--only`:

```
# -- N nota --
cd /home/claude/sites/Pet-Tracker-wt-175 && git add progress/impl_mobile-docs-canvas-fidelity.md && git commit --only progress/impl_mobile-docs-canvas-fidelity.md -m "docs(progress): ronda de fusion de #175 con main (#174)"
```

## Qué no tocar

- `specs/mobile-docs-canvas-fidelity/*`, `feature_list.json`, `progress/current.md`, `progress/review_*` y este
  handoff son del leader.
- Ningún test: si uno cae, es una decisión del leader (ver M4c).
- No marques la casilla de R11 ni ninguna otra.

## Criterios de terminado

- Un commit de fusión con dos padres (`H0m` y `deaf4e6d`), y después el commit de la nota.
- Las seis anclas y M3, M4b, M4c (verde, sin `●`) y M6 en verde.
- R11 sigue pendiente del humano.
