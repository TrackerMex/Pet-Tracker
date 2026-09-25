# review: mobile-source-lock-slice-blind-spots (#122)
Fecha: 2026-09-25T04:21Z
Veredicto: **APROBADO**

- Worktree: `/home/claude/sites/Pet-Tracker`. Branch:
  `feature/122-mobile-source-lock-slice-blind-spots`. HEAD revisado:
  `e078838ba43d21551b4e37ac8bddbe4385535448`, comprobado al empezar y al
  terminar. Es el merge de `origin/main` `40ec1b46` sobre los seis commits de
  Codex (`8ea9fc83..64bb0d50`). `origin/main` coincide con el merge-base
  (`40ec1b46`).
- Todo lo de este informe lo he medido yo. El reporte de Codex solo me ha servido
  de índice. Las re-ejecuciones de los commits rojos y las sondas las he hecho en
  un worktree temporal (`/tmp/rev122-red1`, HEAD separado, con `node_modules`
  enlazado). Ya está eliminado (`git worktree remove`, exit 0), y el worktree
  principal ha quedado limpio (`git status --short` vacío).
- `init.sh`: siguiendo la regla vigente (memoria «init.sh del reviewer
  denegado»), lo corrió el leader con permiso del humano. Yo he leído su log, su
  HEAD y su exit code (ver §Output de ./init.sh).

## Checklist C2 — Estado coherente
- [x] Como mucho una feature `in_progress`: hay **cero**. #122 sigue en
      `spec_ready` (ver Obs. 1). `init.sh` lo confirma: «Sin features en
      progreso (sesión limpia)».
- [x] `progress/current.md` describe la sesión activa de #122: branch, base,
      espejo Notion y pendiente (F).
- [x] `STATUS.md` sincronizado con `feature_list.json`, según `init.sh`.

## Checklist C3 — Arquitectura
- [x] N/A por capas: el cambio es solo de tests y docs. El diff de producción
      acumulado es vacío (ver C4/R5). No se ha añadido ningún import a ninguno de
      los dos ficheros de test.

## Checklist C4 — TDD (vía b: mutación de producción versionada en el rojo)
- [x] Cada R-id con test nombra su R-id:
      - R1: los tres títulos llevan el sufijo `, con ancla única (#122 R1)`.
      - R2: los tres `it` se titulan `#122 R2: el botón|la campana|el enlace baja a opacidad 0.8 mientras se pulsa`.
      - R4 y R5 no tienen test, y `traceability.md` lo declara antes del handoff.
- [x] El historial va test primero. Blobs por commit (index.tsx / food.tsx /
      index.test / food.test), todos iguales a los de tasks.md:
      - base `f72c1fc0`/`527b8df8`: `dbb5b034` / `e310ff45` / `c1260912` / `47128269`
      - R1 rojo `8ea9fc83`: `491986e0` / `2be008ce` / `979cb875` / `6b554fc0` (P4 en los dos ficheros de producción)
      - R1 verde `49049cb9`: producción = base / `979cb875` / `6b554fc0`
      - R2 rojo `c6c11223`: `3b3cc0e6` / `e3d058df` / `8a31a2f3` / `21cb670b` (P1 en los dos ficheros de producción)
      - R2 verde `e404f32e`: producción = base / `8a31a2f3` / `21cb670b`
      - `2c1ed452`, `64bb0d50` y `e078838b`: producción = base / `60c0c013` / `abc6ad15`; conventions `23df873f`
- [x] He re-ejecutado los rojos yo mismo:
      - **R1 rojo** (`8ea9fc83`): exit 1, `Tests: 3 failed, 192 passed, 195 total`.
        Fallan solo los tres `it` renombrados, y cada uno por
        `expect(received).toBe(expected)` en su línea de unicidad (food:821,
        index:240, index:3354). Los números coinciden con el reporte (M 11417/11568,
        B 10044/10169, S 21930/22060). 0 ReferenceError.
      - **R2 rojo** (`c6c11223`): `Tests: 3 failed, 195 passed, 198 total`.
        Fallan solo los tres `#122 R2`, y cada uno por
        `expect(instance).toHaveStyle()` con `- opacity: 0.8` / `+ opacity: 1`
        (food:836, index:256, index:3381). 0 ReferenceError.
      - **R1 verde** (`49049cb9`): `Tests: 195 passed, 195 total`.
- [x] Los mensajes de commit coinciden literalmente con tasks.md.

## Checklist C5 — Trazabilidad
- [x] `traceability.md` no tiene ninguna fila «pendiente». La única aparición de
      la palabra es la regla de la línea 20. El word-diff de `64bb0d50` confirma
      que Codex solo sustituyó las celdas «pendiente» por hashes.
- [x] Los cinco hashes citados son ancestros de HEAD (`git merge-base
      --is-ancestor`, exit 0 en los cinco).
- [x] Formato de commit: `test(mobile): … (R1|R2)` y `docs(mobile): … (R4|R3,R5)`.
      Es la convención que la propia spec declara en `traceability.md`, en lugar
      de `feat(`, igual que en #109, #112 y #121.

## Checklist C6 — Spec aprobada
- [x] `requirements.md` tiene `status: approved` y la casilla humana marcada el
      2026-09-24. Firmada en `c1db4481` vía Notion. Los cuatro ficheros de la
      spec no han cambiado desde `c1db4481`.

## Checklist C7 — Sin código huérfano
- [x] N/A: esta feature no reemplaza nada existente. Añade una aserción y tres
      `it`, y sustituye un bloque de docs que ahora está verificado literal.

## Checklist C8 — UI móvil
- [x] Se cumple de forma trivial: no hay diff de UI, y
      `src/__tests__/design-drift.test.ts` está verde. En las líneas añadidas a
      `index.test.tsx` solo hay citas `#112 R1`, `#121 R1`, `#122 R1` ×4 y
      `#122 R2` ×5. No hay citas sueltas, hex, `StyleSheet` (0 en el fichero) ni
      clases con corchetes. Codex no cargó skills, tal como exigía el handoff.

## Verificaciones por ítem

1. **Rojos y verdes (C4 vía b):** ver C4.
2. **R5, cero diff de producción:**
   `git diff --exit-code origin/main...HEAD -- mobile-pet-tracker/src/screens/home/index.tsx 'mobile-pet-tracker/src/app/(tabs)/food.tsx'`
   da exit 0, y la forma de dos puntos también da 0. Bajo `mobile-pet-tracker/`
   el diff acumulado solo contiene los dos ficheros de test. El resto del diff
   (`docs/conventions.md`, la spec, el handoff, el reporte, `feature_list.json` y
   `current.md`) está dentro de lo permitido y proviene de commits de Codex o del
   leader.
3. **Literales:** los tests en HEAD coinciden con los `it` y comentarios
   literales de tasks.md:
   - La línea de unicidad está justo antes de `expect(block).toMatch(`, con su
     comentario `// #122 R1: …`.
   - Cada `it` de R2 lleva `fireEvent(el, 'responderGrant', { nativeEvent: {}, persist: () => undefined })`
     y `toHaveStyle({ opacity: 0.8 })` sin volver a consultar el elemento.
   - Los comentarios enmendados en B y S coinciden.
   - No hay imports nuevos.
   - Los recortes, las regex y las demás aserciones siguen intactos.
4. **Guard de design-drift:** ver C8. Los candados en HEAD más drift, en el
   worktree principal: exit 0, `Test Suites: 3 passed`, `Tests: 253 passed`
   (142 + 56 + 55).
5. **Sondas de R3:** las he re-medido sobre HEAD en el worktree temporal,
   revirtiendo cada una antes de la siguiente (limpieza con exit 0):
   - **B/O5h** (ternario con N1 en la otra rama): rojo del candado de fuente por
     `toBe` en la unicidad (index:242). La pulsación de B queda verde. Coincide
     con Exigido.
   - **M/P4** (señuelo `{false && <Pressable …/>}` más N1): rojo por `toBe` en
     la unicidad (food:823) y rojo por `toHaveStyle` (food:840). 0 otros. Coincide
     con Exigido.
   - **S/O2c** (spread condicional a `hasOpenAlerts`): el fichero home entero
     queda verde. Es el límite documentado, tal como exige la spec.
   - **M/W1** (el `Pressable` con la receta como hermano): rojo por `toMatch`
     (food:824) y rojo por `toHaveStyle` (food:840). 0 otros. Coincide con
     Exigido.
   - **B/O2** (spread incondicional): solo falla la campana `#122 R2`, por
     `toHaveStyle` (index:260). `Tests: 1 failed, 141 passed, 142 total`.
     Coincide con Exigido.
   La tabla de Codex tiene 78/78 filas con veredicto, matcher y «otros». Las
   cinco que he comprobado yo coinciden.
6. **Arreglo del runner en M/W1:** el runner de sondas de Codex abortó en su
   propia aserción de unicidad antes de aplicar la mutación. El diff de
   producción era 0, así que no hubo ninguna medición falsa. El selector
   corregido corresponde a la definición de W1 de la spec, y mi M/W1
   independiente da Exigido. El arreglo no afecta a ningún veredicto ni toca
   ningún fichero versionado.
7. **R4, bloque de conventions:** he reconstruido el fichero esperado (la base
   `481432d2` con el bloque 209-235 sustituido por el literal de tasks.md §R4
   (3)) y lo he comparado con HEAD con diff: exit 0, blob `23df873f`. Los
   párrafos de debajo («No queda ningún recorte…» y «Tampoco vale aseverar…»)
   no se tocaron. Resultados de tasks.md §R4 (4):
   - `lastIndexOf('<', anchor)` aparece 2 veces en index.test y 1 en food.test.
   - `'responderGrant'` aparece 3 veces (food:835, index:255, index:3385).
   - «con ancla única (#122 R1)» aparece 2 veces en index.test.
   - «a string child placed», «por eso se deja documentado» y
     `lastIndexOf('<[A-Z]` dan exit 1 (ausentes).
   - Los greps de localización siguen resolviendo: `#109 R1` (food:809), «usa la
     ruta real sin cast Href» (index:223) y «muestra feedback visual al pulsar
     el enlace» (index:3341).
8. **Merge `e078838b`:** su diff de primer padre (17 ficheros, de #123 y #125)
   no incluye ningún fichero de #122. El grep de food, screens/home, conventions
   y source-lock-slice da exit 1. La trazabilidad sigue siendo válida (ítem C5).
9. **Opinión sobre (F):** ver Obs. 5.

## Observaciones

Ninguna es bloqueante. Por severidad:

1. **(menor, estado, del leader) #122 sigue en `spec_ready` en
   `feature_list.json` y no pasó a `in_progress` tras la firma.** Es el mismo
   patrón que en #121 (Obs. 5 de su review). No afecta al veredicto, porque lo
   he re-medido todo. Al cerrar, el leader debe pasarla a `done` con este
   veredicto (`AGENTS.md` §7.2).
2. **(informativa) Commits `test(mobile)`/`docs(mobile)` en lugar de `feat(`.**
   Lo declara la propia spec en `traceability.md`, así que no es una desviación.
3. **(informativa) Runner de sondas corregido en M/W1.** Ver ítem 6. Solo
   afectó a la herramienta temporal de Codex, no a tests ni a producción.
4. **(informativa) Ruido en los logs de jest.** Aparecen avisos
   `Uniwind - We couldn't find your variable --color-foreground` y trazas de
   consola (`> 18 |`, `> 31 |`) que no son fallos. Son preexistentes y ajenos a
   #122.
5. **(opinión, sin acción) Sobre (F):**
   - Con R2 puesta, la pata de regex de fuente de S y M se vuelve en gran medida
     redundante para detectar un pulsado perdido: la pata de reposo más la de
     pulsación ya lo cubren. La regex solo añade rojos de forma (V6 en S, E1 en
     ambos).
   - Pero la línea de unicidad (la defensa contra O5h, que R2 no ve, como
     confirma B/O5h con la pulsación en verde) vive dentro de ese mismo `it`. Si
     se retira la regex, la unicidad tiene que sobrevivir como aserción propia.
   - En B no hay pata de reposo, así que la regex sigue siendo el único control
     de la opacidad 1 en reposo.
   - Recomendación: si se retoma (F), mantener la unicidad como aserción aparte y
     añadir antes una pata de reposo a B.

## Output de ./init.sh

Lo ejecutó el leader sobre `e078838ba43d21551b4e37ac8bddbe4385535448` con el
árbol limpio (`init122.status` vacío). Log:
`/tmp/claude-1002/-home-claude-sites-Pet-Tracker-mobile-pet-tracker/c1edfdc1-1af4-41a9-b58e-c094475189fd/scratchpad/init122.log`.
Exit medido sin pipe: `init_exit=0`.

```
✅ Sin features en progreso (sesión limpia)
✅ STATUS.md sincronizado con feature_list.json
✅ Build exitoso
Test Suites: 170 passed, 170 total          (backend unit)
Tests:       1298 passed, 1298 total
Test Suites: 83 passed, 83 total            (mobile)
Tests:       1494 passed, 1494 total
Snapshots:   1 passed, 1 total
✅ Tests pasados
Test Suites: 3 skipped, 27 passed, 27 of 30 total   (e2e)
Tests:       8 skipped, 389 passed, 397 total
✅ Tests e2e pasados
✅ Lint sin errores
✅ Typecheck sin errores
✅ Todo verde. Listo para trabajar.
```

Delta móvil respecto a la base de 83/1491 (82/1471 más lo que mergeó main):
+0 suites y +3 tests, que es el cierre esperado. `food.test.tsx`,
`home/index.test.tsx` y `design-drift.test.ts` salen en PASS.
