# review: mobile-nutrition-ai-collapse-flicker (#234)
Fecha: 2026-11-03
Veredicto: APROBADO

Base del diff: `244fad9b`. `git diff --name-only 244fad9b..HEAD` lista exactamente 5 ficheros:
`ai-explanation.tsx`, `ai-explanation.test.tsx` (mobile-pet-tracker/src/screens/food/) y
`requirements.md`, `tasks.md`, `traceability.md` (specs/mobile-nutrition-ai-collapse-flicker/).
`requirements.md`/`tasks.md` solo llevan la enmienda del leader `d800bee5` (cardinalidad
`toHaveLength(1)` en R1 it 3 + commit extra). Sin package.json/lockfile en el diff: sin dependencias nuevas.
Rama `feature/234-mobile-nutrition-ai-collapse-flicker`; árbol: solo el reporte impl sin commitear.

## Checklist C2 — Estado coherente
- [x] Solo 1 feature in_progress (bookkeeping reservado al leader; no se toca feature_list.json en el diff)
- [x] progress/current.md: fuera del alcance de este diff (leader)

## Checklist C3 — Arquitectura
- [x] domain sin imports de infrastructure (N/A móvil; `ai-explanation.tsx` no importa api/, heroui-native ni ./index, candado #224 R11 verde)
- [x] contratos puros (N/A)
- [x] application depende de interfaces (N/A)
- [x] sin lógica de negocio en infraestructura (N/A)
- [x] Producción tocada: solo `ai-explanation.tsx` (D9). Sin `StyleSheet`, sin hex (solo `#224 R6` y `#234 R3` en comentarios), sin copy nuevo; una sola clase nueva `absolute inset-x-0 top-0 opacity-0`.

## Checklist C4 — TDD
- [x] Cada R1–R7 tiene tests que lo nombran (`#234 R1`..`R6`; R7 por los `#224 R4/R5/R7/R8/R9/R11` intactos y T1).
- [x] Historial test-primero por par, cada test commit solo toca el test y cada feat solo la producción:
  - `d1917e94` test (solo test) rojo 32 failed/7 passed por aserción (medidor inexistente, estructura R1, estado R5); `f46549e1` feat (solo .tsx) verde 39/39.
  - `d800bee5` enmienda del leader; `020c8ca2` test (1 línea, `toHaveLength(1)`) nace verde, probado por mutaciones R5(c)/R1(d) (re-plantadas por mí, ver abajo).
  - `fdc350c0` test rojo 3 failed (`toHaveLength` por medidor vacío); `440f4f3b` feat verde 42/42.
  - `4f14ef23` test rojo 2 failed (clase ausente y dos copias del texto); `699d4ec1` feat verde 44/44.
- [x] Nota: el feat de R2 deja 2 fallos transitorios en `food/index.test.tsx` (dos copias del texto) hasta R3; es el estado intermedio prescrito y el par 3 lo cierra (`src/screens/food` 241/241 verde hoy).

## Checklist C5 — Trazabilidad
- [x] traceability.md sin filas "pendiente"; R1–R7 con test y commit; los tests citados existen y nombran su R-id.
- [x] Commits siguen `feat|test(mobile): #234 ... (R-ids)` y `docs(spec): #234 ...`.

## Checklist C6 — Spec aprobada
- [x] requirements.md `status: approved`, casilla «Aprobado por humano» marcada (firma delegada 2026-11-03).
- [x] `specs/mobile-nutrition-ai-format/requirements.md:482` «Enmienda de R6 por #234 aprobada por humano» sigue SIN marcar (`- [ ]`), sin diff en esa carpeta.
- [x] G2 smoke (requirements.md:443) sigue sin marcar.

## Checklist C7 — Sin código huérfano
- [x] N/A — no reemplaza ni deprecia módulos; el `onLayout` pasa de `food-ai-content` al medidor sin dejar rastro (grep `onLayout` = 1).

## Anclas (grep -cF desde mobile-pet-tracker/, fuente)
onLayout 1; `testID="food-ai-content"` 1; `testID="food-ai-measure"` 1; `setContentHeight(` 1; AI_CLAMP_HEIGHT/AI_FADE_HEIGHT 1/1; `blocks.map(` 1; `renderBlocks(` 3; receta punto 1; receta texto viñeta 1; `absolute inset-x-0 top-0 opacity-0` 1; `absolute inset-x-0 bottom-0` 1; `pointerEvents="none"` 2; `accessibilityElementsHidden` 1; `importantForAccessibility="no-hide-descendants"` 1; `overflow-hidden` 1; `#224 R6` 2; StyleSheet 0. Test: `(enmendado por #234 R4)` 1; StyleSheet 0. Todas coinciden con la tabla "Tras #234".

## Mutaciones re-plantadas por el reviewer (cada una revertida con `git checkout HEAD --`, diff vacío tras cada una)
| Mutación | Resultado |
|---|---|
| R5(c): `onLayout` anónimo en View que envuelve el contenido, conservando el del medidor | 8 failed/44: R1 it 3 (por `toHaveLength`, el candado del commit extra), R5 filas 1,2,4,5, R6 x3 |
| R1(d): `onLayout` movido a View anónimo dentro del recorte | 23 failed/44: R1 it 1 y it 3, R5, R6 |
| R3(e): quitar `opacity-0` | 1 failed: R3 it 1 |
| R3(a+b): quitar ambas props de accesibilidad | 2 failed: R3 it 1 y it 2 |
| R6(a): `onLayout` devuelto a `food-ai-content` | 8 failed: R1 it 3, R5 x4, R6 x3 |
| R2(a): medidor sin `mt-2` en párrafos | 1 failed: R2 SAMPLE |
| R4(a): `>` por `>=` | 1 failed (fila 122) |

## Verificación independiente
- `bunx jest src/screens/food/ai-explanation`: 44/44 verde (exit 0).
- `bunx jest src/screens/food`: 3 suites, 241/241 verde.
- `bunx jest src/__tests__` (incluye design-drift, legibility-classnames, consistency-classnames, nutrition/profile-canvas-fidelity, ui-language): 42 suites, 1037/1037 verde.
- `./init.sh` NO ejecutado por instrucción del leader (lo corre él; otra sesión lo usa). El impl report documenta T1 45 suites/1278 tests verdes, tras un timeout de carga (#200 R6) que pasó repetido sin caché.

## Observaciones
Ninguna que bloquee. Notas para el leader:
- El veredicto no sustituye a `./init.sh` del leader ni al smoke G2 en dispositivo (jest no mide layout; D4 y la hipótesis del lazo solo las confirma el smoke).
- La casilla «Enmienda de R6 por #234» y G2 son del humano; siguen sin marcar.
- El `.done` y el reporte untracked se dejaron como estaban.

## Output de ./init.sh
No ejecutado por el reviewer (instrucción explícita del leader).
