Worktree: /home/claude/sites/Pet-Tracker-wt-195
NO lances ./init.sh aunque AGENTS.md lo pida: lo corre el leader (comparte LocalStack y Postgres con otros worktrees).
Primer comando, antes de nada: `cd /home/claude/sites/Pet-Tracker-wt-195 && pwd && git branch --show-current`. Confirma en el reporte que la salida es esa ruta y la branch `feature/195-mobile-home-photo-hero-canvas`.

Este es el ADENDO Nº 8 de reanudación y es **corto**: no cambia la spec ni el código, solo resuelve tu parada tras el commit D. Siguen vigentes `progress/handoff_mobile-home-photo-hero-canvas.md` y los adendos `-reanudar.md` a `-reanudar-7.md`, salvo lo que este fichero sustituye. El adendo 6 (la cadena A a E, las mutaciones, la lista cerrada de ficheros, los rojos exactos) y el 7 (la cuenta `toBe(430|100|90)` = 4) siguen enteros.

Estado
- Tus commits B `1aa57420`, C `0a630d4b` y D `288ad502` son **correctos y se quedan**. No los reescribas. El leader comprobó cada diff contra la spec: B toca solo GUARD, C cambia cuatro líneas de `pet-hero-header.tsx`, D toca solo GUARD y sus seis `expect` son los literales de [[tasks]] R20 (1-A4). Tus medidas de rojo y verde (A 12 de 88, B 13 de 89, C 89 en verde, D 1 de 90) coinciden con la tabla del adendo 6. Tu reporte (`a2130cf1`) se queda; añade, no lo reescribas.
- Tu parada era correcta y la causa está en el texto de la spec, no en tu test: dos cuentas «A4» de [[tasks]] §Cuentas a re-medir no contaron los literales que el propio `it` de D (R20, 1-A4) manda escribir.

Dictamen del leader (manda el árbol, como dice [[requirements]] §Cómo se mide (A4): «ante una discrepancia manda el árbol y se avisa al leader»). El leader midió en `a2130cf1`:
1. Fila `grep -rcE "\b330\b" src --include=*.ts --include=*.tsx | grep -v ":0"`: la spec dice «salida vacía tras el commit C». Tras C es cierto, y tras D sale **una línea**: `src/__tests__/home-photo-hero-canvas.test.ts:1` (la línea 159, `expect(section).not.toContain('alto 330');`). Esa es la cifra buena para D y E. **No cambies el literal `'alto 330'`**: es el ancla negativa de R20.
2. Fila `grep -cE "\b(104|160)\b" src/__tests__/home-photo-hero-canvas.test.ts`: la spec dice «0 tras el commit B». Tras B es cierto (0), y tras D da **1** (la línea 161, `expect(section).not.toContain('160 px');`). Esa es la cifra buena para D y E. **No cambies el literal `'160 px'` ni la regex de la cuenta.**
3. La fila de `130 px` no estaba entre las dieciocho cuentas y no cambia nada: la línea de `'130 px'` del `it` de D no casa con ninguna de ellas. Las otras quince cuentas «A4» (las dieciocho menos la fila 7 del adendo 7 y estas dos) coinciden con la spec en cada paso (tu tabla y la medida del leader).
4. La spec no se enmienda: son errores de recuento de ayudas de medición que ninguna R-id afirma, y el texto de la spec ya dice que el árbol manda. El leader deja constancia en `progress/current.md`.
5. En la tabla de cuentas de tu reporte, en las filas 8 y 13, escribe 1 línea (fila 8: el fichero de GUARD) y 1 (fila 13) como valores correctos tras D y E, y cita este adendo.

Lo que sigue (adendo 6, sin cambios salvo lo anterior)
1. **Commit E** `docs(mobile): carta y bloque de design.md con las medidas de la Enmienda A4 (R20)`: solo `docs/ui-guidelines.md` y `specs/mobile-home-photo-hero-canvas/design.md`, atómicos, con las frases literales de [[design]] §Texto de la Enmienda A4 de #195 (la sección de la carta sigue siendo la última `## ` y su texto es idéntico al primer bloque Markdown de design.md). Tras E: HERO + GUARD `Tests: 90 passed, 90 total`, `hero-header-amendments.test.ts` sin tocar, las cuentas de carta (`alto 330|130 px|160 px` → 0; `alto 430.*velo oscuro superior de 90 px.*degradado inferior de 100 px` → 1).
2. Mutaciones m1 a m7 (m2 en sus dos pasadas) y r1 a r6, cada una vista en rojo y revertida con `git checkout HEAD -- <rutas>` y `git diff --cached` en 0.
3. Cierre completo: `bun run test` completo (134 suites, 4381 tests, 1 snapshot), typecheck con la precondición de `router.d.ts`, lint con log (`> log 2>&1 && test ! -s log`), `graphify update .`, hashes de la traceability, commit final `docs(home)` y marcador `progress/impl_mobile-home-photo-hero-canvas.done` solo cuando todo esté hecho.
4. Los logs `progress/a4-*.log` están ignorados por `.gitignore` (`*.log`): déjalos sin commitear.

Cuándo PARAR: las del adendo 6, sin cambios. Sigue sin ser tuyo: `progress/current.md`, `history.md`, `STATUS.md`, el campo `status` de `feature_list.json`, la PR, el canvas y R21.
