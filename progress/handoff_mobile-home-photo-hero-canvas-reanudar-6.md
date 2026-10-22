Worktree: /home/claude/sites/Pet-Tracker-wt-195
NO lances ./init.sh aunque AGENTS.md lo pida: lo corre el leader (comparte LocalStack y Postgres con otros worktrees).
Primer comando, antes de nada: `cd /home/claude/sites/Pet-Tracker-wt-195 && pwd && git branch --show-current`. Confirma en el reporte que la salida es esa ruta y la branch `feature/195-mobile-home-photo-hero-canvas`.

Este es el ADENDO Nº 6 de reanudación y es **trabajo nuevo, no una parada resuelta**: R1 a R20 están implementados y aprobados por el reviewer (`d5597e96`), y el humano pidió después cambiar tres medidas. Es la **Enmienda A4 (decisión D6)**: el hero pasa de 330 a **430** de alto, su degradado inferior de 160 a **100 px** (con paradas **`24 %` y `44 %`**) y su velo superior de 130 a **90 px**. Siguen vigentes `progress/handoff_mobile-home-photo-hero-canvas.md` y los adendos `-reanudar.md` a `-reanudar-5.md` (reglas críticas, sondas, cuentas de cierre, H0 = `ab33dfd1`), salvo lo que este fichero sustituye. Léelos antes de tocar nada.

Estado
- HEAD de este adendo: `98c7a192` (firma humana de la Enmienda A4, Notion «Estado del gate» = Aprobado, `page_last_edited_at` 2026-10-22T20:57:52Z). Los commits del adendo y de `progress/current.md` van encima y solo tocan `progress/`. Desde `44ea637f` hasta `98c7a192` el único cambio es de `specs/` y `progress/`: el código y los tests son los de `d5597e96`, que el reviewer aprobó.
- La cadena de A4 se aplica **encima** con commits nuevos. **No reescribas ningún commit existente** y no hagas rebase ni merge de `main`.
- Spec que debes leer enteros antes de empezar: [[requirements]] D6, R1, R3, R17, R18, R20, §Candados de medida y de paradas (Enmienda A4) con la fila 14 (14a a 14h) y el párrafo «Enmienda A4»; [[design]] §Hechos medidos H4 y §Texto de la Enmienda A4 de #195; [[tasks]] §Enmienda A4: cadena de commits (la tabla A a E y las mutaciones m1 a m7), los pasos (1-A4) a (3-A4) de los bloques R1, R3, R17, R18 y R20, y las filas «A4» de §Cuentas a re-medir; [[traceability]].
- Medidas **del leader** en `98c7a192`, desde `mobile-pet-tracker/` (la carta, desde la raíz del repo): las dieciocho cuentas «A4» de tasks.md coinciden con su columna base (330 en HERO 8, 430 en HERO 0, `160|130` 4, `35|65%` 2, `24|44%` 0, `height: (90|100)` 0, `toBe(430|100|90)` 0; `330` en dos ficheros; producción 3/0 y 1/0 y 0/3 y 0/1; GUARD `104|160` 2, `10.79|9.77` 2, `7.75|6.74` 0; carta 1 y 0; cuatro ficheros con los `testID`). No hay deriva. Si al empezar alguna no coincide, anota la deriva y avisa antes de seguir.
- Base de tests medida por el leader: HERO + GUARD juntos (`bunx jest src/components/__tests__/pet-hero-header.test.tsx src/__tests__/home-photo-hero-canvas.test.ts --testTimeout=30000`) dan `Tests: 88 passed, 88 total`, `Test Suites: 2 passed`. `init.sh` completo en `d5597e96`: 134 suites, 4379 tests, 1 snapshot.

Qué hacer: la cadena A a E, en este orden
Cada commit lleva su R-id, `git commit --only <rutas>` (nunca `-am`), un `Tests:` medido tras él y las cuentas «A4» de tasks.md que le tocan. **Test primero de verdad**: A, B y D son commits de test con su rojo medido **antes** de que exista la producción o la carta que los pone verdes. En #19 se metió todo en un solo commit y se incumplió C4 de `CHECKPOINTS.md`.

| Commit | Rutas permitidas (`--only`) | Rojo o verde esperado, medido por ti |
|---|---|---|
| A `test(mobile): enmienda a 430, 100, 90 y paradas 24/44 los ocho it de HERO (R1)` | solo `mobile-pet-tracker/src/components/__tests__/pet-hero-header.test.tsx` | **12 casos rojos** y ningún otro: 14a 1, 14b 1, 14c 4, 14d 1, 14e 1, 14f 1, 14g 2, 14h 1. HERO + GUARD: `Tests: 12 failed, 76 passed, 88 total` |
| B `test(mobile): fadeAlpha de 100 px, referencias del nombre y enlace con producción (R17)` | solo `mobile-pet-tracker/src/__tests__/home-photo-hero-canvas.test.ts` | **un solo rojo nuevo**, el `it` `enlaza el modelo con las paradas y la altura del degradado de producción (Enmienda A4)`. HERO + GUARD: `Tests: 13 failed, 76 passed, 89 total`. Los dos casos de `mantiene referencias y suelos en %s` **nacen verdes** (modelo puro) |
| C `feat(mobile): hero de 430 con degradado de 100 px y velo de 90 px (R1)` | solo `mobile-pet-tracker/src/components/pet-hero-header.tsx` | **todo verde**: HERO + GUARD `Tests: 89 passed, 89 total` |
| D `test(mobile): la carta lleva las medidas de la Enmienda A4 (R20)` | solo `src/__tests__/home-photo-hero-canvas.test.ts` | **un solo rojo**, `la sección de la carta lleva las medidas de la Enmienda A4 y ninguna de las antiguas`, en su primera aserción (`alto 430`). HERO + GUARD: `Tests: 1 failed, 89 passed, 90 total` |
| E `docs(mobile): carta y bloque de design.md con las medidas de la Enmienda A4 (R20)` | **solo** `docs/ui-guidelines.md` y `specs/mobile-home-photo-hero-canvas/design.md` | **todo verde**: HERO + GUARD `Tests: 90 passed, 90 total`; `hero-header-amendments.test.ts` sin tocarse |

Las cuentas encadenadas son: A deja 88 totales (12 rojos), B suma 1 (89, 13 rojos), C pone los 13 en verde (89), D suma 1 (90, 1 rojo) y E lo pone en verde (90). El total de `bun run test` completo pasa de 4379 a **4381** y las suites se quedan en 134. Si una cifra no coincide, **PARA** y avisa con el diff medido.

Decisión del leader sobre quién teclea el commit E: **lo tecleas tú** (Codex), no el leader. Motivo: el working tree es uno y solo escribe uno. Las frases son literales y están cerradas en [[design]] §Texto de la Enmienda A4 de #195 (frase 1 y frase 2): no hay nada que decidir. Las dos ediciones (primer bloque Markdown de [[design]] §Texto de la Enmienda #195 y última `## ` de `docs/ui-guidelines.md`) son **idénticas y van en el mismo commit**, porque el guarda de R20 las compara byte a byte. No toques el segundo bloque, ni la excepción de contraste (4,26:1 y 4,36:1, suelo 4,2:1), ni la línea `Detalle y tests…`, ni la casilla `- [ ] Enmienda #195 aprobada por humano` (la firma el humano en R21), ni nada de `Enmienda #190`, `#67` o `#167`.

Reglas de A4 que no admiten interpretación
1. Los literales **430, 100, 90, `24%`, `44%`, 56, 76, 7.75 y 6.74 se escriben en el test**. Ninguno se importa de producción. Los `it` de HERO que comparan de forma simbólica contra `PET_HERO_MEDIA_HEIGHT`, `PET_HERO_FADE_HEIGHT` o `PET_HERO_SCRIM_HEIGHT` **no se tocan** (nacen verdes y su valor lo demuestra m1).
2. El `it` nuevo de GUARD R17 lee el **texto** de `pet-hero-header.tsx` (con los comentarios quitados por la expresión de `code` de R19) y no importa ningún símbolo de él. Tres `expect` separados: la altura (`PET_HERO_FADE_HEIGHT = 100`, sin exigir `export const` ni `;`), `59 24%` y `D9 44%`; las dos posiciones **se calculan** de los puntos de quiebre del modelo, no se escriben. Texto exacto en tasks.md R17 (3-A4).
3. En C, producción cambia **solo** tres constantes y dos paradas: `PET_HERO_MEDIA_HEIGHT = 430`, `PET_HERO_FADE_HEIGHT = 100`, `PET_HERO_SCRIM_HEIGHT = 90`, y en la cadena del degradado inferior `59 24%` y `D9 44%`. Ni clases, ni `testID`, ni la cadena del velo, ni comentarios, ni `home/index.tsx`. Si algo más se pone rojo tras C, es un candado que la spec no nombra: PARA y avisa (no lo arregles en el test).
4. En A, la fila 14c conserva el `%s con mascota %s y slot %s` y el título 14b conserva su sufijo `(enmendado por #195 R1)` (sin sufijo nuevo; 330 pasa a 430 en el título). 14f solo cambia la regex del degradado inferior (`59 24%` y `D9 44%`).
5. Ningún `#NNN` en comentarios de `src/screens/home/index.tsx` ni `src/screens/home/pingo-phrase.ts` (`#190 R12`). A4 no abre esos ficheros, pero la regla sigue. En los tests y en `pet-hero-header.tsx`, la forma `#195 R<n>` y nunca `#195` desnudo.
6. Nada de hex nuevos ni de clases de color en `pet-hero-header.tsx`; el guarda de R19 lee ese fichero.

Mutaciones (todas con el verde de C y E hecho, vistas en rojo y revertidas con `git checkout HEAD -- <rutas>` y `git diff --cached` en 0)
- m1 a m7 de tasks.md §Enmienda A4: cadena de commits, con los rojos esperados de la tabla. Dos puntos que **paran** el trabajo si no salen: m2 (ii) debe poner rojo **solo** la rama de la altura del `it` nuevo de GUARD R17 (producción y HERO a 101 a la vez), y m6 debe poner rojo **solo** ese `it` nuevo, en las dos ramas de las paradas. Si en cualquiera de las dos HERO también cambia de color, el enlace de producción no cierra la zona ciega.
- r1 a r6 del ancla negativa de R20 (tasks.md R20): cada defecto se planta **en la carta y en el primer bloque de design.md a la vez**; el único rojo es el `it` nuevo.
- Anota en el reporte, para cada una, el nombre del `it` que se puso rojo y la línea `Tests:`.

Cuentas
- Mide las de «A4» de §Cuentas a re-medir **al terminar cada commit**, no solo al final. Para cada comando, en la terminal se teclea `|` donde la tabla de Markdown escribe `\|`.
- Tras el commit E, las cuentas finales son las de la columna derecha de esas filas. La del `330` repo-wide (`grep -rcE "\b330\b" src --include=*.ts --include=*.tsx | grep -v ":0"`) queda con salida vacía.

Esperas y comandos
- `docs/conventions.md` §Esperas (tasks.md dice «leader.md §Esperas»: la sección vive en conventions.md). Antes de **cada** corrida de jest, espera con un comando propio (no en el mismo que lanza jest): `pgrep -f 'node_modules/(\.bin/jest|jest-worker)|[i]nit\.sh'` vacío, con un bucle de `sleep 20` y tope de 15 minutos. No uses `pgrep -f jest` a secas. Todas las corridas llevan `--testTimeout=30000`.
- Si `#190 R5` (o cualquier `it` que no sea el esperado del commit) se pone rojo: guarda el log entero (`> log 2>&1`, exit code sin pipe), espera a `pgrep` vacío, borra `/tmp/jest_ru/perf-cache-*` y repite la misma corrida una vez. Es PARADA solo si reproduce las dos veces con la máquina libre; si no, anótalo como carga y sigue, sin relajar ese `it`.
- `test ! -e .expo/types/router.d.ts` antes de `tsc`; lint con `--no-cache > log 2>&1 && test ! -s log`; sin prettier en móvil; `bun`/`bunx`; jest posicional con paréntesis escapados; `await` en `fireEvent`, `act` y `render` (RNTL 14).
- Skills con los nombres del catálogo de Codex: `building-native-ui`, `appllama-app-design-skill` y `animate-expo` de `.agents/skills/`; `expo-overview`, `expo-animation`, `expo-router` y `expo-design-system` NO existen en Codex, no las busques. Lista en el reporte cuáles cargaste y cuáles no encontraste.
- Edita los ficheros de test con una sustitución acotada al título o a la aserción del `it` concreto y comprueba con `grep -n` que cae solo ahí antes de lanzar jest. Una búsqueda global puede encontrar dos copias (los literales 330 aparecen 8 veces en HERO, uno por `it`).

Lista cerrada de ficheros (contra `98c7a192`)
- `mobile-pet-tracker/src/components/__tests__/pet-hero-header.test.tsx` (A)
- `mobile-pet-tracker/src/__tests__/home-photo-hero-canvas.test.ts` (B y D)
- `mobile-pet-tracker/src/components/pet-hero-header.tsx` (C)
- `docs/ui-guidelines.md` y `specs/mobile-home-photo-hero-canvas/design.md` (E, solo el primer bloque)
- `specs/mobile-home-photo-hero-canvas/traceability.md` (cierre: sustituye cada «Enmienda A4: pendiente» de R1, R2, R3, R17, R18 y R20 por los hashes de los commits A a E; los hashes viejos no se tocan)
- `progress/impl_mobile-home-photo-hero-canvas.md` (reporte: añade)
Cualquier otro fichero: PARA y avisa. No tocas el canvas (lo actualiza el leader aparte), ni `home/index.tsx`, ni `pingo-phrase.ts`, ni `pet-avatar`, `pet-switcher`, `glass-circle`, `bubble-pop`, `motion.ts`, `global.css`, ni `consistency-classnames.test.ts` ni `screens/home/index.test.tsx` (los dos solo nombran los `testID`; A4 no los cambia).

Cuándo PARAR (deja el diff medido y la lista de `it` afectados en el reporte y no crees `.done`)
- Una cuenta de «A4» no coincide con su columna esperada tras un commit, o el rojo medido de A, B o D no es exactamente el de la tabla (más o menos casos, o un `it` distinto).
- Tras C se pone rojo cualquier cosa (ver la regla 3), o tras E se pone rojo cualquiera de los tres `it` de R20 de siempre o `hero-header-amendments.test.ts`.
- Una mutación no se pone roja, o se pone roja otra cosa además de lo esperado (m2 (ii), m6 y r1 a r6 en particular).
- Habría que cambiar un valor final (430, 100, 90, `24 %`, `44 %`), relajar una aserción o tocar un fichero fuera de la lista.
- R17 deja de cumplirse con las paradas `24 %` y `44 %` (el modelo del GUARD se pone rojo en un suelo): no ajustes paradas por tu cuenta, el humano las aprobó medidas.

Reporte y cierre
- Sigue en `progress/impl_mobile-home-photo-hero-canvas.md`: **añade, no reescribas**. Sección nueva «Reanudación con Enmienda A4 — 2026-10-22»: los cinco commits con hash y `Tests:`, las cuentas «A4» medidas tras cada uno, las mutaciones m1 a m7 y r1 a r6 con el nombre del `it` que se puso rojo, y los rojos de A, B y D tal como salieron.
- Cierre completo (una vez, tras E): `bun run test` completo (esperado 134 suites / **4381** tests / 1 snapshot), typecheck, lint con log, `graphify update .`, y la lista de ficheros desde `98c7a192` contra la lista cerrada. Commit final `docs(home): …` con `traceability.md` y el reporte.
- El marcador `progress/impl_mobile-home-photo-hero-canvas.done` **ya no existe** (el leader lo retiró al firmarse A4). Créalo de nuevo (una línea con la ruta del reporte) **solo** cuando los cinco commits, las trece mutaciones y el cierre estén hechos. Si paras a medias, no lo crees.
- Sigue sin ser tuyo: `progress/current.md`, `history.md`, `STATUS.md`, el campo `status` de `feature_list.json`, la PR, el canvas y R21. Tampoco decides sobre O1 (el tramo de retorno de 160 ms de la burbuja) ni sobre `numberOfLines={1}`: están registrados para el humano.
