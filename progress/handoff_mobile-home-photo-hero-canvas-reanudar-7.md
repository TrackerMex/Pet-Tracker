Worktree: /home/claude/sites/Pet-Tracker-wt-195
NO lances ./init.sh aunque AGENTS.md lo pida: lo corre el leader (comparte LocalStack y Postgres con otros worktrees).
Primer comando, antes de nada: `cd /home/claude/sites/Pet-Tracker-wt-195 && pwd && git branch --show-current`. Confirma en el reporte que la salida es esa ruta y la branch `feature/195-mobile-home-photo-hero-canvas`.

Este es el ADENDO Nº 7 de reanudación y es **corto**: no cambia la spec ni el código, solo resuelve tu parada tras el commit A. Siguen vigentes `progress/handoff_mobile-home-photo-hero-canvas.md` y los adendos `-reanudar.md` a `-reanudar-6.md`, salvo lo que este fichero sustituye. El adendo 6 (la cadena A a E, las mutaciones, la lista cerrada de ficheros, los rojos exactos) sigue entero: relee su tabla antes de seguir.

Estado
- Tu commit A `21e404c3` (`test(mobile): enmienda a 430, 100, 90 y paradas 24/44 los ocho it de HERO (R1)`) es **correcto y se queda**. No lo reescribas. El leader comprobó tu diff contra la fila 14 de [[requirements]]: trece líneas, exactamente las filas 14a a 14h, con el título de 14b y el `describe` de 14c como pide la spec y sin tocar ninguna aserción simbólica. Tu reporte con la sección «Reanudación con Enmienda A4 — 2026-10-22» está en el repo (`0242a473`). **No lo reescribas**: añade.
- Tu parada era correcta y la causa está en el texto de la spec, no en tu test. La cuenta de `tasks.md` §Cuentas a re-medir que dice `grep -cE "toBe\((430|100|90)\)" src/components/__tests__/pet-hero-header.test.tsx` → 0 y **3** («las tres de 14a»), y la misma cifra de [[requirements]] §Cómo se mide (A4), contaron mal: la fila 14h también pasa `media.props.height` de `toBe(330)` a `toBe(430)`, y la regex la recoge.

Dictamen del leader (manda el árbol, como dice [[requirements]] §Cómo se mide: «ante una discrepancia manda el árbol y se avisa al leader»)
1. La cuenta `toBe(430|100|90)` en HERO devuelve **4** tras el commit A (líneas 201, 202, 203 y 815 en `21e404c3`: las tres de 14a y la de 14h), no 3. Esa es la cifra buena. **No cambies 14h, ni la regex de la cuenta, ni el formato de la aserción.**
2. Esa cifra se queda en **4** tras B, C, D y E: ninguno de esos commits toca ese fichero de test, salvo A.
3. Las otras diecisiete cuentas «A4» coinciden con la spec (tu tabla y la del leader, que las midió en `98c7a192`). La spec no se enmienda: es un error de recuento de una ayuda de medición que ninguna R-id afirma, y el propio texto de la spec ya dice que el árbol manda. El leader deja constancia en `progress/current.md`.
4. En el reporte final, en la fila 7 de tu tabla de cuentas, escribe 4 como el valor correcto y cita este adendo.

Lo que cambia respecto al adendo 6
1. **Primero, mide el rojo del commit A** (no se midió, porque paraste antes de lanzar jest). Con la producción aún en 330, 160, 130 y `35 %`/`65 %`, y sin tocar nada:
   - espera con `pgrep` en un comando propio (adendo 6, apartado Esperas y comandos), y luego `bunx jest src/components/__tests__/pet-hero-header.test.tsx src/__tests__/home-photo-hero-canvas.test.ts --testTimeout=30000 > log 2>&1` y el exit code sin pipe;
   - esperado: `Tests: 12 failed, 76 passed, 88 total`, con doce casos de exactamente los ocho `it` 14a a 14h y ninguno más (14a 1, 14b 1, 14c 4, 14d 1, 14e 1, 14f 1, 14g 2, 14h 1). Anota el nombre de cada `it` y su par `Expected`/`Received` (430/330 en 14a, 14b, 14c, 14d, 14g y 14h; en 14e el primer `expect` que falle; en 14f la regex que no casa con `35%`).
   - Si miden más o menos de doce, o un `it` fuera de los ocho se pone rojo, **PARA** y deja la lista en el reporte.
   - Esto va en tu reporte, no en un commit nuevo: A ya está commiteado y el rojo se mide sobre ese commit.
2. Después, sigue el adendo 6 desde el commit B tal cual (B, C, D, E, m1 a m7, r1 a r6, cierre). Las cuentas encadenadas no cambian: HERO + GUARD 88 → 89 → 89 → 90 → 90, y el total de `bun run test` de 4379 a 4381.
3. En la sección de A4 de tu reporte, sustituye la línea «Estado: PARADO tras el commit A…» por una nota de que el leader resolvió la parada con este adendo (cifra correcta 4) y de que el rojo de A se midió después.

Cuándo PARAR: las del adendo 6, sin cambios. Sigue sin ser tuyo: `progress/current.md`, `history.md`, `STATUS.md`, el campo `status` de `feature_list.json`, la PR, el canvas y R21. No crees `progress/impl_mobile-home-photo-hero-canvas.done` hasta que los cinco commits, las trece mutaciones y el cierre completo estén hechos.
