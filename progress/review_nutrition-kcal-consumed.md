# review: nutrition-kcal-consumed (#104)
Fecha: 2026-09-23T15:10Z (fase 1 a las 14:55Z)
Veredicto: APROBADO

`./init.sh` lo corrió el **leader**, no el reviewer: al reviewer el sistema de permisos
de Claude Code le denegó el comando (clasificador de auto mode, motivo "Interfere With
Workloads") y el humano decidió que lo lanzara el leader desde su shell. El reviewer no
aceptó el resumen del leader: leyó el log entero y verificó HEAD, fechas y recuentos
(§Output de ./init.sh).

Branch `feature/104-nutrition-kcal-consumed`, worktree `/home/claude/sites/Pet-Tracker-wt-backend`,
HEAD revisado `61e96abf`. Implementado por Codex CLI; revisado sin editar código.

## Checklist C2 — Estado coherente
- [x] Solo 1 feature in_progress (`feature_list.json`: solo #104; #113 `pending`)
- [x] progress/current.md describe la sesión activa de #104

## Checklist C3 — Arquitectura
- [x] domain sin imports de infrastructure: `meal-serving.entity.ts` no tiene ningún `import`; `kcalConsumed` es función pura
- [x] repositories/contratos en domain son interfaces puras (sin cambios en puertos; `git diff 28aa4155 HEAD` no toca `domain/repositories/`)
- [x] application depende de interfaces: el use case solo añade la llamada a `kcalConsumed` (dominio); constructor sin cambios, ninguna consulta nueva, mismo `day`
- [x] infrastructure sin lógica de negocio: el mapper solo copia `kcalConsumedToday`

## Checklist C4 — TDD
- [x] Cada R<n> tiene al menos un test que lo nombra con sufijo `(nutrition-kcal-consumed #104)`: R1 en `meal-serving.entity.spec.ts` (3 `it`), R2 (1), R3 (2), R4 (2) en `test/meals.e2e-spec.ts`; títulos literales de requirements.md
- [x] Historial test-primero: `1edd6f37` test R1 → `a16dc9e1` feat R1 → `12239597` test R2 → `109f0060` test R3 → `bf6217af` test R4 → `e7ae5971` feat (R2,R3,R4) → `61e96abf` docs. Los cuatro commits `test(...)` no tocan ningún fichero de producción (`git show --stat`)
- [x] R3 y R4, requisitos de verificación vía (a) declarados en la spec: sus tests van en rojo antes del verde compartido
- [x] Ningún rojo cae por `ReferenceError` de helper de test. El rojo de R1 cae por `TypeError: kcalConsumed is not a function` (artefacto bajo prueba, precedente #83 R11, previsto en tasks.md). Rojos de R2-R4 por aserción sobre `kcalConsumedToday`
- [x] Ningún rojo muta un doble de test

Rojos reproducidos por el reviewer (sin worktree temporal; restaurando en el árbol los ficheros de producción del commit rojo y revirtiendo después):
- R1: `meal-serving.entity.ts` de `1edd6f37` → `pnpm test -- meal-serving.entity` exit=1, 3 failed / 4 passed, los tres `TypeError: (0 , meal_serving_entity_1.kcalConsumed) is not a function`.
- R2-R4: use case y mapper de `bf6217af` (el backend de `bf6217af` difiere de HEAD solo en esos dos ficheros) → `pnpm test:e2e -- meals.e2e-spec` exit=1, 6 failed / 16 passed (R9 de #83, R2, R3 ×2, R4 ×2), todos con `- "kcalConsumedToday": …` en el diff de la aserción; `pnpm test:e2e -- nutrition.e2e-spec` exit=1, 1 failed / 22 passed (R24 de #17). Coincide con el impl report.

Mutaciones plantadas y revertidas (cada una sola, árbol limpio al final):

| # | Dónde | Mutación | Resultado |
|---|---|---|---|
| D1 | `kcalConsumed` | `Math.floor` en vez de `Math.round` | unit exit=1, 3 R1 rojos |
| D2 | `kcalConsumed` | `Math.ceil` | unit exit=1, 2 R1 rojos |
| D3 | `kcalConsumed` | redondeo por franja `Math.round(merKcal / mealsPerDay) * servedCount` | unit exit=1, 3 R1 rojos |
| D4 | `kcalConsumed` | `Math.round(x - 0.001)` (mitad hacia abajo) | unit exit=1, 3 R1 rojos |
| W1 | use case, 3.er argumento | `servedToday.length` → `plan.mealsPerDay` | meals e2e exit=1, 5 rojos (R2, R3 ×2, R4 ×2) por aserción (`0` esperado, `1059` recibido) |
| W2 | use case, 3.er argumento | `servedToday.length` → `served.length` (sin filtrar por plan vigente) | meals e2e exit=1, 1 rojo: R4 › excluye las franjas fuera del plan vigente (`0` esperado, `333` recibido) |
| W3 | use case, 3.er argumento | segunda consulta con el día UTC (`now.toISOString().slice(0, 10)`) | meals e2e exit=1 a las 14:52Z, 1 rojo: R3 › dos extremos de zona (`530` esperado, `0` recibido; lo caza Kiritimati) |

Ningún candado tautológico: los esperados son literales escritos a mano (`[0, 530, 1059]`, `[0, 333, 667, 1000]`, `[0, 250, 501, 751, 1001]`, `530`, `1059`, `400`, `333`, `667`, `1000`, `0`); ninguno llama a `Math.round`, a `kcalConsumed` ni a constantes de producción.

## Checklist C5 — Trazabilidad
- [x] traceability.md sin filas "pendiente"; R1-R4 con `archivo::describe › it` y hashes
- [x] Los seis hashes citados existen (`git cat-file -e`) y descienden de la firma `5b743931`
- [x] Commits siguen `feat(<scope>): <desc> (R-ids)` / `test(<scope>): <desc> (R<n>)`, mensajes literales de tasks.md

## Checklist C6 — Spec aprobada
- [x] requirements.md con `status: approved` y casilla humana marcada (2026-09-23, vía Notion)
- [x] `git diff 5b743931 HEAD -- specs/nutrition-kcal-consumed/` solo toca `traceability.md` (4+/4-)

## Checklist C7 — Sin código huérfano
- [x] N/A — esta feature no reemplaza nada existente (solo añade una función y una clave)

## Alcance y candados ajenos
- `git diff --stat 28aa4155 HEAD`: exactamente los 8 ficheros de design.md §Archivos afectados; ninguno de la lista "No cambian" (controller, `pets/**`, `db/**`, `docs/**`, `mobile-pet-tracker/**`, `package.json`, `init.sh`, `feature_list.json`, `current.md`, `history.md`, `STATUS.md`) aparece en el diff.
- Líneas borradas en tests en todo el diff: solo dos, el import de `meal-serving.entity.spec.ts` (previsto en tasks.md R1) y el `toEqual` de R24 de #17 (delta 2). El delta 1 (`'kcalConsumedToday',` tras `'servedToday',` en la lista de R9 de #83) es una línea añadida. Ningún otro candado cambia.
- Nota menor, no bloqueante: el commit verde `a16dc9e1` toca `meal-serving.entity.spec.ts` (3+/3-). Es solo el reformateo de Prettier del segundo `it` de R1; el contenido y los literales son idénticos.
- Codex declara haber cargado la skill `ponytail:ponytail` (no es de expo; anotado sin más).

## Verificación independiente ejecutada (fase 1)
Desde `backend-pet-tracker/`, HEAD `61e96abf`, árbol limpio:
- `pnpm test` → exit=0, 170 suites, 1298 tests (línea base 1295: +3, las de R1)
- `pnpm exec tsc --noEmit` → exit=0
- `pnpm exec eslint "{src,apps,libs,test}/**/*.ts"` (sin `--fix`) → exit=0
- `pnpm test:e2e -- meals.e2e-spec` → exit=0, 22/22 (+5); `pnpm test:e2e -- nutrition.e2e-spec` → exit=0, 23/23 (sin cambio). Cada e2e lanzado con el `pgrep` de cabecera vacío.

## Observaciones
Sin hallazgos bloqueantes. Una sola nota menor (reformateo de Prettier en `a16dc9e1`, ver §Alcance).

## Output de ./init.sh

**Quién y por qué.** Primero lo intentó el reviewer, en primer plano y con el `pgrep` de
cabecera vacío. El sistema de permisos lo denegó ("Permission for this action was denied by
the Claude Code auto mode classifier. Reason: [Interfere With Workloads]"), y no se intentó
ningún rodeo. El humano decidió que lo corriera el leader:
`cd /home/claude/sites/Pet-Tracker-wt-backend && ./init.sh > /tmp/init-review-104.log 2>&1; echo "exit=$?"`,
en primer plano de su shell, con el `pgrep` vacío antes y HEAD en `61e96abf`. El leader
reporta `exit=0`, medido sin pipe.

**Qué verificó el reviewer por su cuenta** (sin volver a correr init.sh):
- HEAD sigue en `61e96abf` y la branch es `feature/104-nutrition-kcal-consumed`. `git reflog`
  no registra ningún movimiento de HEAD después del commit `61e96abf` (14:48:14Z).
- El log `/tmp/init-review-104.log` (17188 líneas) se creó a las 15:01:21Z y se escribió por
  última vez a las 15:05:50Z. Es posterior a `61e96abf`.
- Tras la corrida no queda ningún proceso `init.sh`/`test:e2e`/`jest-e2e`, y el árbol solo
  tiene esta review (el `eslint --fix` de init.sh no cambió nada).
- El log no tiene ninguna línea `FAIL`. Los `ERROR` de Nest que aparecen son logs de los
  caminos de error que ejercitan los propios tests; ninguno viene de una suite roja.

| Bloque | Línea base (`9932f314`) | Esta corrida | Delta |
|---|---|---|---|
| Backend unit | 170 suites / 1295 tests | 170 passed / 1298 passed | +3 tests (R1), mismas suites |
| Infra (cdk) | — | 2 suites / 14 tests passed | — |
| Scripts del harness (TAP) | — | 28 + 5 + 15 ok, `# fail 0` | — |
| Móvil | 77 suites / 1412 tests | 77 passed / 1412 passed | sin cambio |
| Backend e2e | 27 passed + 3 skip (30) / 384 + 8 skip | 27 passed + 3 skip (30) / 389 passed + 8 skip | +5 tests (R2: 1, R3: 2, R4: 2), mismas suites |
| Build, lint, typecheck | verdes | verdes | — |

Extracto del log, sin códigos de color:
```
✅ Build exitoso
Test Suites: 170 passed, 170 total
Tests:       1298 passed, 1298 total
Test Suites: 2 passed, 2 total          (infra)
Tests:       14 passed, 14 total
# fail 0   (x3, scripts TAP del harness)
Test Suites: 77 passed, 77 total        (móvil)
Tests:       1412 passed, 1412 total
Snapshots:   1 passed, 1 total
Test Suites: 3 skipped, 27 passed, 27 of 30 total   (e2e)
Tests:       8 skipped, 389 passed, 397 total
✅ Tests e2e pasados
✅ Lint sin errores
✅ Typecheck sin errores
✅ Todo verde. Listo para trabajar.
```
Avisos no bloqueantes del propio init.sh: "Feature en progreso: nutrition-kcal-consumed"
(correcto); STATUS.md desactualizado, 93/111 declarado frente a 95/113 real (artefacto de
cierre del leader); `harness-init-force-color` (done) no tiene requirements.md, que es
anterior a la adopción de specs.
