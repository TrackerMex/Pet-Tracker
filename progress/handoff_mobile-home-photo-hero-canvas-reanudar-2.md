Worktree: /home/claude/sites/Pet-Tracker-wt-195
NO lances ./init.sh aunque AGENTS.md lo pida: lo corre el leader (comparte LocalStack y Postgres con otros worktrees).
Primer comando, antes de nada: `cd /home/claude/sites/Pet-Tracker-wt-195 && pwd && git branch --show-current`. Confirma en el reporte que la salida es esa ruta y la branch `feature/195-mobile-home-photo-hero-canvas`.

Este es el ADENDO Nº 2 de reanudación. Siguen vigentes `progress/handoff_mobile-home-photo-hero-canvas.md` (reglas críticas, sondas, cuentas de cierre, H0 = `ab33dfd1`) y `progress/handoff_mobile-home-photo-hero-canvas-reanudar.md`, salvo lo que este fichero sustituye. Léelos los tres enteros antes de tocar nada.

Estado
- HEAD de este adendo: `058c465a`. R13, R4, R1, R2, R3, R5, R7, R8 y R6 están hechos y validados por el leader (20 suites, 745 tests, verde). Los dos pendientes de ALERTS del adendo 1 ya están resueltos (`bc14d41b` y la mutación del reporte): no los repitas.
- La spec cambió. El humano firmó la **Enmienda A1** (supuesto 1 de design.md falso) el 2026-10-22 desde Notion; la firma es el commit `058c465a`. Han cambiado R14, R16, la sección nueva «Candados de visibilidad y de forma de style» de requirements.md, design.md (§Hechos medidos H1), tasks.md (bloques R14 y R16, notas del handoff, dos filas de «Cuentas a re-medir») y traceability.md. Lee R14, R16, esa sección, H1 y los bloques R14 y R16 de tasks.md **antes** de escribir el rojo de R14. Ahí está todo lo que se afirma; este adendo solo ordena.
- Mecanismo, medido en el código de `react-native-reanimated` 4.5.1: en Jest el valor animado va a la prop `jestAnimatedStyle` (lo lee `getAnimatedStyle`), y el `style` del nodo host, que es lo que lee `toBeVisible`, conserva el del primer render. Un nodo que arranca en `opacity: 0` no llega nunca a `toBeVisible`, espere lo que espere el test. Tus tres sondas lo confirmaron: (a) falla, (b) falla, (c) pasa.

Lo que sustituye al adendo 1
- NO repitas las sondas de visibilidad ni el «paso 1» del adendo 1: ya están medidas y registradas en tu reporte. Tampoco sigues la condición «si (a) o (b) pasan…».
- Regla de visibilidad nueva (requirements.md R14 y R16, tasks.md «Regla de visibilidad»):
  - Sobre `pet-hero-slot`, `pet-hero-caption`, `pet-hero-photo` (si el hero se monta ya con mascota), `home-pingo-bubble` y **todos sus descendientes**, con reduce motion apagado, se afirma `toBeOnTheScreen()`. Nunca `toBeVisible`.
  - La visibilidad real se prueba con (i) movimiento, en el fichero **nuevo** HEROMOT (`mobile-pet-tracker/src/components/__tests__/pet-hero-header-motion.test.tsx`) y en BP, con Reanimated real, temporizadores falsos y `getAnimatedStyle`, y con (ii) reduce motion encendido, donde `toBeVisible()` síncrono sí se afirma.
  - Fuera de esos nodos `toBeVisible` no se relaja nunca. Si falla allí, se arregla el componente.
  - Esto vale también para todo `it` NUEVO que monte el hero en R5 a R12, R15 y R18: nacen con `toBeOnTheScreen()` sobre los nodos animados.
- Lista cerrada de ficheros: la del handoff original **más** `mobile-pet-tracker/src/components/__tests__/pet-hero-header-motion.test.tsx` (HEROMOT) y los de esta enmienda ya listados en la spec. BP (`screens/home/bubble-pop.test.tsx`) ya estaba. Cualquier otro fichero fuera de la lista: PARA y avisa.
- Prohibición nueva: la cadena `StyleSheet` no aparece en `src/screens/home/index.test.tsx` (ni en código, ni en títulos, ni en comentarios). `design-drift` lo escanea. HOME aplana con `[node.props.style].flat(Infinity)` y `toContainEqual`. `StyleSheet.flatten` solo en HERO, HEROMOT y BP.
- Comentarios y títulos nuevos: solo la forma `#195 R<n>`, nunca `#195` desnudo (design-drift).
- Skills: igual que el handoff original, con los nombres del catálogo de Codex (`building-native-ui`, `appllama-app-design-skill` y `animate-expo` de `.agents/skills/`; `expo-overview`, `expo-animation`, `expo-router` y `expo-design-system` NO existen en Codex, no las busques). En el reporte lista cuáles cargaste y cuáles no encontraste. Esperas: `docs/conventions.md` §Esperas (tasks.md dice «leader.md §Esperas»: la sección vive en conventions.md).

Anclas de la base (desde `mobile-pet-tracker/`, en `058c465a`; el leader las midió; si alguna no coincide, anota la deriva y avisa antes de seguir)
- `grep -c "toBeVisible" src/components/__tests__/pet-hero-header.test.tsx` devuelve 9.
- `grep -c "toBeVisible" src/screens/home/index.test.tsx` devuelve 80.
- `grep -c "toBeOnTheScreen" src/components/__tests__/pet-hero-header.test.tsx src/screens/home/index.test.tsx` devuelve 0 y 0.
- `grep -c "enmendado por #195 R14\|enmendado por #195 R16" src/components/__tests__/pet-hero-header.test.tsx src/screens/home/index.test.tsx` devuelve 0 y 0.
- `grep -c "StyleSheet" src/screens/home/index.test.tsx` devuelve 0 (y debe seguir en 0).
- `grep -c "withDelay" src/components/__tests__/pet-hero-header.test.tsx` devuelve 0 (R14 añade `withDelay` al mock).
- `grep -rlE "pet-hero-slot|pet-hero-caption|home-pingo-bubble|home-pingo-text" --include=*.test.ts --include=*.test.tsx src` devuelve solo `src/components/__tests__/pet-hero-header.test.tsx` y `src/screens/home/index.test.tsx`.
- Tras el commit rojo de R14: el sufijo `(enmendado por #195 R14)` cuenta 5 líneas en HERO y 6 en HOME (una por título), y `toBeVisible` de HOME baja a 73. Si un comentario con la misma cadena infla la cuenta, es tuyo: quítalo.

R14 (el primero que falta)
- Sigue el bloque R14 de tasks.md al pie de la letra: un commit rojo `test(mobile): … (R14)` con HERO, HEROMOT y las 11 enmiendas (5 en HERO, 6 en HOME, con el sufijo A continuación del que ya lleve el título); luego el verde `feat(mobile): … (R14)`; luego el refactor si hace falta. Un rojo que se ve en verde por el motivo equivocado no cuenta: antes del verde, anota en el reporte qué `it` salió rojo y con qué mensaje.
- Las enmiendas que solo cambian `toBeVisible` por `toBeOnTheScreen()` **nacen verdes**: anótalo, no es un fallo. Su valor lo demuestra la mutación (e) de tasks.md.
- Primer rojo de HEROMOT: confirma y anota tres cosas, sin cambiar ningún valor final por ello:
  1. La forma exacta de `StyleSheet.flatten(slot.props.style)` en el host (la fila de `#195 R5` en la sección de candados dice `{ top: 52, opacity: 0, transform: [{ translateY: 14 }] }`). Si difiere, anótala y ajusta solo esa aserción.
  2. Que HEROMOT monta con Reanimated real y los mocks copiados de HERO (`heroui-native`, `ping-ring`, `react-native-safe-area-context`). Si falta un mock para montar, copia el de HERO y anótalo.
  3. Que el reloj simulado de Reanimated entrega valores intermedios a los 64 ms. Si no, plan B de R14 (se conserva el par inicial y final y se anota); si la animación arranca un fotograma después, el margen sube de 16 a 32 y se anota. Nunca se vuelve a `toBeVisible` ni se cambia un valor final.
- Mutaciones a-e de R14: plántalas cada una, ve el rojo esperado, revierte y anota el nombre del `it` que se puso rojo. La (e) se hace con el verde ya hecho. **Si la (e) no se pone roja, PARA y avisa**: significaría que la premisa de H1 no se cumple en el árbol.

R16
- Igual: bloque R16 de tasks.md. BP es un fichero nuevo con Reanimated real. `#190 R7` se reescribe con `[bubble.props.style].flat(Infinity)` y `toContainEqual`, sin la cadena `StyleSheet`. HOME no tiene hoy ningún `toBeVisible` sobre la burbuja: no se añade ninguno con reduce motion apagado. Mutaciones a-e de R16; la (e) planta `StyleSheet` en un comentario de HOME y `design-drift` (`#68 R18`) debe ponerse rojo.

Orden de lo que queda
R14, R9, R11 (solo `GlassCircle` y su test GC), R10, R11 (resto: botón «+» en Inicio), R12, R15, R16, R17, R18, R19, R20 y el Cierre. R21 es del humano; solo dejas su lista de comprobación en el reporte. Mismas reglas de siempre: rojo con commit propio antes de la producción, un commit por paso con el R-id, `Tests:` tras cada commit, `git commit --only <rutas>` (nunca `-am`), `await` en `fireEvent`, `act` y `render` (RNTL 14), jest posicional con paréntesis escapados, `test ! -e .expo/types/router.d.ts` antes de `tsc`, lint con `--no-cache > log 2>&1 && test ! -s log`, sin prettier en móvil, `bun`/`bunx`.

Cuándo PARAR (deja el diff medido y la lista de `it` afectados en el reporte y no crees `.done`)
- Un `it` ANTERIOR que no figura en la sección de candados de visibilidad se pone rojo por la opacidad inicial.
- La mutación (e) de R14 no se pone roja.
- Para pasar un test de HEROMOT o BP habría que cambiar un valor final, relajar una aserción de fuera de los nodos animados, o volver a `toBeVisible` sobre un nodo animado.
- `pet-hero-media` falla `toBeVisible` en HOME (depende de que el primer montaje del hero sea con `pet = null`): no lo cambies a `toBeOnTheScreen()`; para y avisa.
- Cualquier fichero fuera de la lista cerrada.

Reporte y cierre
- Sigue en `progress/impl_mobile-home-photo-hero-canvas.md`: añade, no reescribas. Al terminar R1 a R20, quita la línea «Estado: PARADO …» y sustituye el bloque «Bloqueo obligatorio» por un resumen de cómo se resolvió (las tres líneas `Tests:` de las sondas y la Enmienda A1 como solución).
- Cierre completo del handoff original: `bun run test` completo, typecheck, lint con log, `graphify update .`, re-medir las cuentas base + delta (con las dos filas nuevas de tasks.md), lista de ficheros desde H0 contra la lista cerrada (más HEROMOT).
- Commit final `docs(home): …` con `traceability.md` y el reporte. En la tabla de trazabilidad, R14 y R16 llevan ahora HEROMOT y BP además de HERO y HOME.
- Crea `progress/impl_mobile-home-photo-hero-canvas.done` (una línea con la ruta del reporte) SOLO cuando R1 a R20 estén en verde y el cierre completo hecho. Si paras a medias, no lo crees.
- Sigue sin ser tuyo: progress/current.md, history.md, STATUS.md, el campo `status` de feature_list.json, la PR y R21.
