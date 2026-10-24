# review: mobile-canvas-routine (#204)
Fecha: 2026-10-24
Veredicto: APROBADO
Bloqueantes: 0 | No bloqueantes: 6

## Gate (`init-204.log`)
- Log: `/tmp/claude-1002/-home-claude-sites-Pet-Tracker/ad9357a2-d69d-40e4-8877-cbe2e7790272/scratchpad/init-204.log`
- El log se creó a las 2026-10-24 20:39:07 UTC, después del commit HEAD `2b50c0fe` (20:27:05 UTC). Terminó a las 20:55:28 con `exit=0`.
- Backend unit: 187 suites y 1474 tests en verde. Backend e2e: 30 de 33 suites (3 skipped), con 468 tests en verde y 8 skipped.
- Móvil: 151 suites y 5162 tests en verde, 1 snapshot, 616.7 s. Las 46 marcas `●` son todas `● Console`; no hay ningún fallo.
- Lint y typecheck en verde.
- La corrida roja anterior (`init-204-red1.log`, flake conocido de Salud #168 R2) no cuenta como gate.

### Cuenta final (E4)
- Base N = 5015 tests / 146 suites (`88f1d50c`).
- En `9bb99892`: 5059 / 147, es decir, N + 44 con una suite nueva (`routine-canvas-fidelity`). Cuadra con E4 y con el informe del implementador (49 `it` nuevos menos 5 bajas).
- Lado dev del merge `2b50c0fe` (`4c6d6659`): su árbol es idéntico al de `e4b366cd`, cabeza de la PR #248. La corrida CI de esa PR (`scratchpad/ci248-failed.log`) da 5118 tests / 150 suites, con 1 rojo: el flake conocido de Salud #168 R2.
- 5118 + 44 = 5162 y 150 + 1 = 151: coincide exacto con el gate.

## Checklists

### C1 — Harness
- N/A (no es la primera feature).

### C2 — Estado coherente
- [x] Ninguna feature `in_progress`: #204 sigue `spec_ready` hasta el cierre del leader.
- [x] `progress/current.md` describe la sesión de #204. Está modificado por el leader y no se tocó.

### C3 — Arquitectura
- N/A en capas de dominio: es UI móvil sin backend.
- [x] Las pantallas usan componentes compartidos (`ScreenHeader`, `RiseIn`, `CATEGORY_SLOTS`, `useChunkyLip`) y no meten lógica nueva fuera de su capa.

### C4 — TDD
- [x] Cada R1–R17 tiene al menos un `it` que lo nombra (`#204 Rn:`). R18 es el smoke humano.
- [x] Los `test(#204)` tocan solo tests y los `feat(#204)` solo producción.
  - El historial va rojo y luego verde en cada R, con 35 commits en `88f1d50c..9bb99892`.
  - R13, R15 y R17 nacen verdes. La spec lo declara y se cubren por la vía b, con mutación.
- [x] Cada rojo se verificó extrayendo el árbol de su commit (tabla abajo).
  - Todos fallan por aserción o por `Unable to find`.
  - Ningún log tiene `ReferenceError`, `TypeError`, `Cannot find module` ni `SyntaxError`.
- [x] Sin candados tautológicos: R3 (`toBe(70)`), R6 (0/70/140) y R14 (0/60/120) asertan literales, no constantes importadas. R15 compara literales escritos en el test con el canvas congelado y con las fuentes.
- [x] Sin mocks `virtual` nuevos.
  - `grep -rn 'virtual: true' src` da 0.
  - El rango de la feature no añade ninguna línea con `virtual`.
  - El candado de #207 (`jest-virtual-mock-lock`) está verde en el gate.
- [x] Al menos una mutación por R-id con comportamiento, más varias en zonas ciegas (sección Mutaciones).

### C5 — Trazabilidad
- [x] Todos los hashes de `traceability.md` existen en el rango.
- [x] R1–R17 «cubierto». Solo R18 está «pendiente (humano)», como se esperaba.
- [x] Commits con formato `test(#204): Rn …` / `feat(#204): Rn …` (E1); el cierre es `docs(#204)`.

### C6 — Spec aprobada
- [x] `requirements.md` § Aprobación tiene las casillas firmadas (firma delegada en el leader por mandato del humano del 2026-10-23), y E3 y E4 están firmadas.
- [x] Queda abierta solo la casilla R18 (smoke humano). No es un gate de la revisión.

### C7 — Sin código huérfano
- [x] `HomeEntrance` sale de Recordatorios y Documentos.
  - Sigue en uso en Home, Alertas, Perfil y otras pantallas, así que no se borra.
  - No queda ningún `home-entrance` ni `mockHomeEntrance` en `reminders`, `docs`, `docs-upload-form` ni `add-reminder`.
- [x] Se eliminaron los dobles muertos de `home-entrance`: `fa67fb4e` en `docs-upload-form` y `9441ba24` en `reminders`.
- [x] Las cabeceras nativas sustituidas no dejan opciones muertas.
  - `_layout.tsx` deja `headerShown: false` en `add-reminder`, `pets/[petId]/docs` y `reminders`.
  - `docs-upload` conserva su cabecera, como manda la spec.

### C8 — Carta de UI (`docs/ui-guidelines.md`)
- [x] Fuentes limpias: sin hex, sin `StyleSheet.create`, sin valores arbitrarios, sin emoji y sin sombras. Lo canda R17 y lo confirman m30 y m31.
- [x] Insets por `useSafeAreaInsets` en las tres pantallas, con el marco `insets.top + 12`, gutter 20 e `insets.bottom + 24`.
- [x] Diana táctil: el «Eliminar» de fila mide `h-11` (44 px) y el resto son botones de 56 px.
- [x] `Skeleton` con dimensiones: `h-8 w-36 rounded-xl` (sin candado, ver O2).
- [x] `RiseIn` respeta reduce motion (`useReducedMotion`, sin `entering`).
- [x] La Enmienda #204 aparece una sola vez, con su casilla `- [X]` y su firma delegada (línea 936), y va antes de la Enmienda #206.
- [x] La Enmienda #204 no contradice otra regla.
  - El punto 2 saca solo la hoja de borrado de «Sin labio» (regla 13) y sustituye para esa hoja el «par asimétrico» de la Enmienda #177 (línea 709).
  - Lo dice de forma expresa y deja «Los demás destructivos siguen sin labio».
  - La #206 solo toca la barra de pestañas.

## Tabla de R-ids

| R | `it` | Rojo | Verde | Mutación que lo pone rojo |
|---|---|---|---|---|
| R1 | `layout.test.tsx` › `#204 R1: %s oculta la cabecera nativa` (3) | `da27f678` | `ac1a1bfc` | m01 |
| R2 | `screen-header.test.tsx` › `#204 R2: sin título…` / `con título ignora…` | `7ab3ef45` | `779e59b9` | m03b, m04 |
| R3 | `motion.test.ts` › `#204 R3: declara el paso de 70 ms…` | `c3cddf4f` | `f83964d1` | m05 |
| R4 | `reminders/index.test.tsx` › `#204 R4:` (3) | `c7ad05ad` | `fdaf7403` | m07, m08b |
| R5 | `#204 R5: la cabecera encabeza el estado %s` (4) y `…sin mascotas conserva volver…` | `7108b4d3` | `c276dec6` | m10 (m09b, m09c y m32 en verde: O1) |
| R6 | `#204 R6: escalona las filas 0, 70 y 140 ms con RiseIn` | `9441ba24` | `0bd782ef` | m05; m11 solo por R15 |
| R7 | `#204 R7: la fila próxima y su badge usan el ámbar del canvas` | `ab6f505f` | `e1faf85b` | m33; m12 por R15 |
| R8 | `#204 R8: Eliminar de fila usa la receta rosa del canvas` | `115caabb` | `ef244818` (+`3093916b`) | m14 |
| R9 | `#204 R9: Eliminar de la hoja lleva cuerpo de 56 y labio danger` | `6f91bc20` | `9673974f` | m16, m17 |
| R10 | `add-reminder/index.test.tsx` › `#204 R10:` (4) | `bb320535` | `b8ecc101` | m18, m19 |
| R11 | `#204 R11: Guardar se apoya al pie del formulario` | `8dfe420a` | `76ccaeb6` | m21, m22 |
| R12 | `docs/index.test.tsx` › `#204 R12:` (5) | `79c4855a` | `fc9291bd` (+`efb79a86`) | m24 (m23 en verde: O2) |
| R13 | `#204 R13: la cabecera encabeza el estado %s` (4) | `b6260c80` (nace verde) | — | m25 (las 4 filas) |
| R14 | `#204 R14: escalona las filas 0, 60 y 120 ms con RiseIn` | `a22d6cba` | `a972a5e9` (+`fa67fb4e`) | m34; m26 solo por R15 |
| R15 | `routine-canvas-fidelity` › `#204 R15: %s sigue al canvas` (11) | `42b1f7e0` (nace verde) | — | m06, m11, m12, m16, m21, m26, m27 |
| R16 | `#204 R16: la carta lleva su enmienda una sola vez y con su casilla` | `0361a6e7` | `bea9afd8` (+`bcd3af55`) | m28 |
| R17 | `#204 R17: %s es grep-limpio` (4) | `f79d5eef` (nace verde) | — | m30, m31 |
| R18 | smoke humano en dev build | — | — | pendiente (humano) |

### Verificación independiente de los rojos (C4)
Cada commit rojo se extrajo con `git archive` a `scratchpad/redchk/tree`, sin tocar el worktree y con `node_modules` enlazado, y se corrieron sus ficheros de test. Los logs están en `scratchpad/redchk/red-<hash>.log` y el resumen en `scratchpad/redchk/summary{1,2,3,4}.txt`.

| R | Commit rojo | Resultado | Motivo del rojo |
|---|---|---|---|
| R1 | `da27f678` | 3 failed / 131 | `toEqual` de `options` (las tres filas `#204 R1`) |
| R2 | `7ab3ef45` | 1 failed / 8 | aserción del `it` «sin título pinta el marcador»; «con título ignora» nace verde (documentado) |
| R3 | `c3cddf4f` | 2 failed / 29 | `toBe(70)` y el inventario I12 |
| R4 | `c7ad05ad` | 11 failed / 125 | `toEqual`/`toBe` y `Unable to find … reminders(-back)` |
| R5 | `7108b4d3` | 1 failed / 77 | aserción del `it` sin mascotas |
| R6 | `9441ba24` | 3 failed / 192 | `toHaveBeenCalledWith`, `toContain`, `toEqual` |
| R7 | `ab6f505f` | 3 failed / 105 | aserción de clases |
| R8 | `115caabb` | 3 failed / 272 | aserción (R8, inventario de radios, R6.2) |
| R8 extra | `3093916b` | 80 passed | endurece R8 tras el verde (sonda `size="sm"`); desviación documentada |
| R9 | `6f91bc20` | 6 failed / 299 | aserción |
| R10 | `bb320535` | 9 failed / 96 | `toEqual`, `toBe`, `toHaveStyle`, `Unable to find add-reminder-back` |
| R11 | `8dfe420a` | 2 failed / 148 | aserción |
| R12 | `79c4855a` | 32 failed / 237 | 27 `toEqual` y 5 `Unable to find docs-header*` |
| R13 | `b6260c80` | 109 passed | nace verde, declarado en la spec (vía b, mutación) |
| R14 | `a22d6cba` | 7 failed / 110 | `toBe`, `toEqual` |
| R15 | `42b1f7e0` | 11 passed | nace verde, declarado (vía b) |
| R16 | `0361a6e7` | 1 failed / 12 | `toBe(1)` del recuento del bloque canónico |
| R17 | `f79d5eef` | 16 passed | nace verde, declarado (vía b) |

En los 17 logs no aparece ningún `ReferenceError`, `TypeError`, `Cannot find module`, `SyntaxError`, `is not defined` ni `is not a function`. Ningún rojo muta un doble: el de R6/R14 registra las props de `RiseIn`, y el rojo sale porque producción aún usaba `HomeEntrance` (`Number of calls: 0`).

### Merges de dev (`5be7a85b`, `2b50c0fe`)
- En `5be7a85b` (#202 y #207) los candados agregados son la unión de ambos lados:
  - `alerts-canvas-fidelity` › `limita $token…`: el título lleva `#204 R4/R10/R12` y `#202 R7/R1/R11/R17`.
  - `chunky-cta` R3.1: lleva `#204 R11` y `#202 R15`.
  - `chunky-cta` R7.3: lleva `#204 R9` y `#202 R18`, con recuento 26+1+1+1+2+2+1+1+1+1 = 37.
  - `design-drift`: lleva `#204 R8/R9` y `#202 R18`.
  - `profile` `text-26`: lleva `#204 R4/R12` y `#202 R1/R17`, con una lista de 6 entradas (10 − 2 − 2).
- En `2b50c0fe` (#206), el único fichero que difiere del merge automático (`git merge-tree --write-tree`) es `docs/ui-guidelines.md`. La carta conserva la #204 y, después, la #206.
- R15 está verde en el gate, así que los literales del canvas coinciden con producción. Las mutaciones m06, m11, m12, m16, m21, m26 y m27 prueban que los lee.

## Mutaciones
Logs:
- `/tmp/claude-1002/-home-claude-sites-Pet-Tracker/ad9357a2-d69d-40e4-8877-cbe2e7790272/scratchpad/rev204-mut1.log`
- `/tmp/claude-1002/-home-claude-sites-Pet-Tracker/ad9357a2-d69d-40e4-8877-cbe2e7790272/scratchpad/rev204-mut2.log`
- `/tmp/claude-1002/-home-claude-sites-Pet-Tracker/ad9357a2-d69d-40e4-8877-cbe2e7790272/scratchpad/rev204-mut3.log`

El jest de cada mutación está en `scratchpad/mut/<id>.jest.log`. Todas se revirtieron con `git checkout HEAD -- <ruta>` y el script confirmó «reverted ok» en cada una. Las marcadas como «ciega» se plantaron en una zona que el candado de la R podría no mirar.

| Id | R | Mutación | Resultado (tests rojos) |
|---|---|---|---|
| m01 | R1 | `docs` recupera la cabecera nativa | `#204 R1` |
| m02 (ciega) | R1 | `docs-upload` con `headerShown: false` | `#95/#194 R4` |
| m03b | R2 | marcador antes del eyebrow | `#204 R2` |
| m04 | R2 | marcador pintado también con título | `#204 R2: con título ignora` |
| m05 | R3/R6 | 71 ms | `#204 R3`, `#204 R6`, `#204 R15`, `#178 R7` |
| m06 (ciega) | R3 | `7 * 10` | solo `#204 R15` (literal) |
| m07 | R4 | `size={24}` en Recordatorios | `#204 R4`, `#178 R4` |
| m08b | R4 | «Nuevo» empuja a otra ruta | «opens the add-reminder route» |
| m09 / m09b | R5.2 | eyebrow en la cabecera sin mascotas | **verde** (m09 tuvo 2 rojos ajenos por carga; m09b aislado, verde) |
| m09c | R5.2 | accessory en la cabecera sin mascotas | **verde** |
| m10 | R5.2 | gutter 16 sin mascotas | `#204 R5` |
| m11 (ciega) | R6 | `Math.min(i, 2)` | solo `#204 R15` escalón |
| m12 (ciega) | R7 | badge con clases literales en vez de `CATEGORY_SLOTS` | `#204 R15` badge |
| m13 | R7 | `opacity-60` | `#178 R6` |
| m14 (ciega) | R8 | `variant="ghost"` | `#204 R8` |
| m15 (ciega) | R8 | `isDisabled={false}` | `#97 R3`, `R7: … disables only the row…` |
| m16 | R9 | labio `primary` en el destructivo | `#204 R15` labio, `#177 R7.5`, `#177 R8.1` |
| m17 | R9 | etiqueta `text-16` | `#204 R9`, `#128 R4`, `#177 R6.2`, `#61 R1` |
| m18 | R10 | `size={26}` | `#204 R10`, `#178 R10`, `#204 R15` título de 24 |
| m19 (ciega) | R10 | `backFallback="/profile"` | `#204 R10: volver sin historial…` |
| m20 (ciega) | R10 | título literal en vez de `t(...)` | `#65 R18` (2), `#65 R8` |
| m21 | R11 | Guardar sin labio | `#177 R3.1`, `#177 R7.5`, `#177 R8.1`, `#204 R15` |
| m22 | R11 | Guardar sin `mt-auto` | `#204 R11`, `#177 R3.1` |
| m23 (ciega) | R12 | esqueleto del título `h-6` | **verde** |
| m24 | R12 | `backFallback="/reminders"` | `#204 R12: volver sin historial…` |
| m25 | R13 | cabecera al final del contenido | las 4 filas de `#204 R13`, más 22 listas de hijos (`#155`, `#158`, `#175`) |
| m26 (ciega) | R14 | `Math.min(index, 2)` | solo `#204 R15` escalón de Documentos |
| m27 | R15 | `--color-category-rose` `#FFF0F4` | `#204 R15` «Eliminar» de fila |
| m28 | R16 | «70 ms» a «80 ms» dentro del bloque | `#204 R16` |
| m29 (ciega) | R16 | casilla `[X]` a `[ ]` | verde, por diseño (E1: el test acepta `[ xX]`; la casilla se verificó a mano) |
| m30 | R17 | emoji en `screen-header.tsx` | `#204 R17` screen-header |
| m31 (ciega) | R17 | hex en un comentario de `docs/index.tsx` | `#204 R17` docs |
| m32 (ciega) | R5.2 | `backFallback="/reminders"` sin mascotas | **verde** |
| m33 | R7 | borde próximo `border` en vez de `border-2` | `#204 R7`, `#178 R6`, `#204 R15` |
| m34 | R14 | paso doble (`* 2`) | `#204 R14`, `#175 R6`, `#175 R9` (5), `#204 R15` |

## Bloqueantes
Ninguno.

## Observaciones (no bloqueantes)
1. **O1. R5.2 tiene tres cláusulas sin candado: `backFallback="/profile"`, «sin `eyebrow`» y «sin `accessory`».**
   - m32, m09b y m09c salen en verde en `reminders/index.test.tsx` y `no-pets-states.test.ts`.
   - El código cumple la spec (línea 162 de `reminders/index.tsx`: `<ScreenHeader testID="reminders-no-pets-header" backFallback="/profile" />`).
   - El hueco viene de la spec: la prescripción del test de R5.2 (requirements.md:208) solo pide el orden de los hijos, que exista `-back` y que no exista `-title`. Además, tasks.md fija 5 `it` para R5 dentro de N + 44, así que el implementador no podía añadir otro.
   - Hay una incoherencia en la spec: requirements.md:201 dice «Mismo método en R5.2, R10 y R12» para «volver sin historial», pero solo R10 y R12 prescriben ese `it`.
   - Propuesta para una feature o errata posterior: en el `it` de R5.2, pulsar `reminders-no-pets-header-back` con `canGoBack` falso y esperar `replace('/profile')`, y asertar que no existen `reminders-no-pets-header-eyebrow` ni nodos de accesorio.
2. **O2. Las dimensiones de `docs-header-skeleton` (`h-8 w-36 rounded-xl`, D8) no tienen candado.**
   - m23 (`h-6`) sale en verde.
   - Es un hueco anterior a la feature: en la base, `uses content-sized skeletons…` ya solo miraba que fuera visible, y D8 conserva el esqueleto actual.
3. **O3. Los `it` de R6 y R14 usan tres filas, así que no distinguen un tope en el índice 2.**
   - Con `Math.min(i, 2)` los retrasos son 0/70/140 y 0/60/120 igual.
   - m11 y m26 solo los caza R15, que lee el literal `delayMs={… * MOTION_…}` en la fuente. La zona queda cubierta, pero por literal de fuente y no por comportamiento.
4. **O4. Desviaciones documentadas por el implementador, todas legítimas:**
   - Tres commits de test extra tras el verde:
     - `3093916b`: endurece R8 tras una sonda verde.
     - `efb79a86`: tipa el estado de mascota del `it` de R12 para typecheck.
     - `bcd3af55`: quita el `#204` desnudo de la fuente de R16.
   - Por eso el título del `it` de R16 difiere del literal de la spec: «lleva su enmienda» en vez de «lleva la Enmienda #204».
   - I11 no se hizo; era opcional.
5. **O5. Anterior a la feature:** el título de `#177 R7.3` dice «veintisiete radios», pero el recuento vale 37 tras la unión de #204 R9 y #202 R18. Ya divergía antes de #204.
6. **O6. Tras el merge de #206, la Enmienda #204 ya no es la última sección de la carta.**
   - R16 no depende de la posición: cuenta el bloque canónico una vez y la cabecera una vez.
   - El orden #204 → #206 es el acordado.

## Estado del árbol al terminar
- `git diff --stat` solo muestra `progress/current.md`, que el leader dejó así a propósito.
- `git diff --cached --stat` sale vacío.
- Ninguna mutación quedó plantada.

## HEAD revisado
`2b50c0fe` (branch `feature/204-mobile-canvas-routine`), merge de `origin/dev` (#206) sobre `5be7a85b`. Rango de código revisado: `88f1d50c..9bb99892`, más E4 `c79553b9` y los dos merges.
