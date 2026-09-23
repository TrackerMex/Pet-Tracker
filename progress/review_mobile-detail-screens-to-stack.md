# review: mobile-detail-screens-to-stack (#95) — ronda 2
Fecha: 2026-09-23 15:43 UTC
Veredicto: APROBADO

Rango revisado en esta ronda: `da348322..7702e7eb` (3 commits de Codex:
`24e881bb` rojo, `5992daf9` verde, `7702e7eb` docs). Worktree
`/home/claude/sites/Pet-Tracker`, branch `feature/95-mobile-detail-screens-to-stack`.
Lo verifiqué con `pwd` y `git branch --show-current` antes de empezar y no
cambié de branch. Handoff de la ronda: `progress/handoff_95_rebote_B1.md`.
Firma de la spec: `a4b3e69f` (sin cambios).

## Ronda 1 (resumen)

Veredicto RECHAZADO sobre `ccb9f7ac..f9a22dd1`. El informe completo está en
el historial: `git show da348322:progress/review_mobile-detail-screens-to-stack.md`.
Tuvo dos bloqueantes:

1. **B1**: los `it` `#95 R5` de `weight-log` y `meal-schedule` renderizaban la
   pantalla solo en **carga** (`pending(...)`), no en el estado cargado que pide
   tasks.md R5 (1). Por eso sobrevivían M20, M21 y M22, tres mutaciones
   plantadas en la rama cargada.
2. **init.sh sin ejecutar**: el clasificador de permisos denegó el lanzamiento.

El resto de la ronda 1 (R1–R4, R6–R8, A11, A12, C7 y C8) salió aprobado y no
se ha tocado. En esta ronda, B1 queda corregido (§C4 y §Mutaciones). init.sh lo
lanzó el leader con permiso del humano sobre el HEAD exacto revisado, y salió
verde (§Output de ./init.sh).

## Checklist C2 — Estado coherente
- [x] Solo 1 feature in_progress: `95 mobile-detail-screens-to-stack` (medido con node sobre `feature_list.json`)
- [x] progress/current.md actualizado (describe la sesión activa de #95)
- [x] Codex no tocó ficheros del leader: `git diff da348322..HEAD -- progress/current.md progress/history.md STATUS.md feature_list.json` da 0 líneas

## Checklist C3 — Arquitectura
- [x] domain sin imports de infrastructure: N/A, esta ronda solo toca dos ficheros de test de `mobile-pet-tracker/`
- [x] repositories/contratos en domain son interfaces puras: N/A
- [x] application depende de interfaces, no implementaciones: N/A
- [x] infrastructure sin lógica de negocio: N/A. El diff neto de producción de la ronda es vacío

## Checklist C4 — TDD
- [x] Cada R<n> tiene al menos un test que lo nombra. Los dos `it` corregidos siguen en `describe('#95 R5: la pantalla no dibuja cabecera propia')`
- [x] Test primero por la vía (b) de C4: mutación de producción versionada en el rojo y revertida en el verde. Lo reproduje en un worktree desechable (scratchpad, `node_modules` enlazado y ya retirado):

| Commit | Qué contiene | Resultado reproducido |
|---|---|---|
| `24e881bb` rojo | los dos `it` corregidos, más M20 (`weight-log/index.tsx`, `<Text>{t('weightLog.weightLog')}</Text>` dentro de `weight-chart-card`) y M21 (`meal-schedule/index.tsx`, `<Text>{t('mealSchedule.mealSchedule')}</Text>` dentro de `loadedPlan !== null`) | `exit=1`, 2 suites fallidas, `Tests: 2 failed, 51 passed, 53 total`. Cada uno falla **por su aserción de ausencia**, después de alcanzar el estado cargado: `meal-schedule/index.test.tsx:480` `expect(screen.queryByText(es['mealSchedule.mealSchedule'])).toBeNull()` → `Received: <Text>Horario de comidas</Text>`; `weight-log/index.test.tsx:675` `expect(screen.queryByText(es['weightLog.weightLog'])).toBeNull()` → `Received: <Text>Registro de peso</Text>`. Ningún timeout ni nodo ausente: `findByTestId` resolvió en los dos |
| `5992daf9` verde | revierte M20 y M21 | `exit=0`, `Tests: 53 passed, 53 total` |

- [x] Diff neto de producción vacío: `git diff f9a22dd1 HEAD -- mobile-pet-tracker/src/screens/weight-log/index.tsx mobile-pet-tracker/src/screens/meal-schedule/index.tsx` da 0 bytes. `git diff --stat f9a22dd1 HEAD -- mobile-pet-tracker/` solo lista los dos `index.test.tsx`
- [x] Arreglo conforme al handoff:
  - `weight-log`: `mockListWeights.mockResolvedValue({ kind: 'ok', weights: [makeWeight()] })`, con `makeWeight` definido en el propio fichero (:69).
  - `meal-schedule`: `mockGetNutritionPlan.mockResolvedValue({ kind: 'ok', plan: makePlan() })` y `mockGetNutritionProfile.mockResolvedValue({ kind: 'ok', profile: makeProfile() })`, con `makePlan`/`makeProfile` del propio fichero (:88, :106), igual que el `it` de `#87 R11`.
  - Los dos esperan con `await screen.findByTestId('weight-chart-card' | 'meal-schedule-summary')` antes de las ausencias.
  - No se quitó ninguna aserción: se conservan el `waitFor(... toBeVisible())` y las dos ausencias. Solo cambian las dos líneas de fixture y se añade la espera.
  - Delta de `it`: 0 (weight-log 31, meal-schedule 22, los mismos que en la ronda 1).

## Checklist C5 — Trazabilidad
- [x] traceability.md sin filas "pendiente": la única coincidencia de `grep pendiente` es la línea de la regla (:25)
- [x] Fila R5: `…; ronda 2 rojo 24e881bb → verde 5992daf9`. Los dos son ancestros de HEAD (`git merge-base --is-ancestor`), igual que los de la ronda 1 (`01cb63b9`, `f136e182`, `0d84675c`, `e0b62c05`). No hubo rebase
- [x] Commits con el formato y el texto exactos que prescribe el handoff: `test(detail-stack): R5 mira el estado cargado en weight-log y meal-schedule (R5)`, `fix(detail-stack): revierte las mutaciones de la sonda de R5 (R5)`, `docs(detail-stack): registra evidencia de R5 en estado cargado (R5)`
- [x] `git diff --stat da348322..HEAD` toca exactamente 4 ficheros: los dos `index.test.tsx`, `specs/mobile-detail-screens-to-stack/traceability.md` y `progress/impl_mobile-detail-screens-to-stack.md`

## Checklist C6 — Spec aprobada
- [x] requirements.md con `status: approved` y las casillas de A11, A12 y la spec marcadas (2026-09-23)
- [x] Sin drift de spec: `git diff a4b3e69f HEAD -- specs/mobile-detail-screens-to-stack/` solo toca `traceability.md`

## Checklist C7 — Sin código huérfano
- [x] Componentes reemplazados eliminados: sin cambios desde la ronda 1, que lo aprobó. Esta ronda no añade ni retira producción
- [x] Sus tests también eliminados: sin cambios. El `pending` y los tipos de estado siguen usándose en otros `it` de los dos ficheros, y el lint sale vacío
- [ ] N/A — (no aplica: la feature sí reemplaza código, verificado en ronda 1)

## Checklist C8 — UI móvil
- [x] Sin cambios de UI en esta ronda (diff neto de producción vacío). Sigue valiendo lo aprobado en la ronda 1

## Verificación independiente (sin pipes, exit medido)

- `bunx jest --ci --silent` en HEAD `7702e7eb`, worktree principal, lanzado
  cuando init.sh ya había terminado: **exit=0, 80 suites, 1426 tests**, 1
  snapshot. Mismos recuentos que en la ronda 1 (delta 0).
- `rm -f .expo/types/router.d.ts; bunx tsc --noEmit` → exit=0, salida de 0 bytes.
- `bunx expo lint` → exit=0, salida de 0 bytes.
- `git status` limpio en el worktree principal al acabar. Worktree desechable eliminado (`git worktree list` ya no lo muestra).

## Mutaciones (worktree desechable en HEAD `7702e7eb`, revertidas una a una con `git checkout`)

Jest con `--runTestsByPath` sobre el fichero de test de la pantalla mutada.

| # | Mutación | Resultado |
|---|---|---|
| M20 | `<Text>{t('weightLog.weightLog')}</Text>` dentro de `weight-chart-card` | **rojo**: `#95 R5` weight-log, :675, `Received: <Text>Registro de peso</Text>` (1 failed / 31) |
| M21 | `<Text>{t('mealSchedule.mealSchedule')}</Text>` dentro de `loadedPlan !== null` | **rojo**: `#95 R5` meal-schedule, :480, `Received: <Text>Horario de comidas</Text>` (1 failed / 22) |
| M22 | `<View testID="weight-log-back" />` dentro de `weight-chart-card` | **rojo**: `#95 R5` weight-log, :674, `Received: <View testID="weight-log-back" />` (1 failed / 31) |
| M23 (nueva) | `<View testID="meal-schedule-back" />` dentro de `loadedPlan !== null` | **rojo**: `#95 R5` meal-schedule, :479 (1 failed / 22) |
| M24 (nueva) | `<Text>{t('weightLog.weightLog')}</Text>` solo en la rama `weights.data === undefined` (carga) | verde, 31/31: sobrevive (ver Observación 1) |
| M3 (regresión) | `<View testID="pairing-back" />` en pairing | rojo: `#95 R5` pairing, :923 |
| M18 (regresión) | `<View testID="add-reminder-back" />` en add-reminder | rojo: `#95 R5` add-reminder, :496 |
| M7 (regresión) | `router.push('/map')` en lugar de `dismissTo` | rojo: `#95 R8` (:537) y `#42 R7` (:518) |

Codex declara M22 en el `impl` como probada solo en local, sin commit. La
reproduje yo con el mismo resultado.

## Observaciones

1. (No bloqueante, informativo) Tras el cambio, ningún `it` de weight-log
   asevera la ausencia del título en el estado de **carga** (M24 sobrevive; en
   meal-schedule pasa lo mismo por construcción). Es lo que prescribe la spec:
   tasks.md R5 (1) pide el *"estado cargado habitual del fichero"*, y el handoff
   pedía delta 0 de `it`. La cabecera retirada vivía fuera de las ramas de
   estado. Por eso cualquier reinserción ahí aparece también en el estado
   cargado y los `it` actuales la detectan. El techo es un título que solo
   exista mientras se muestra el Skeleton.
2. (No bloqueante, heredado) Siguen como estaban, tal como ordenaba el handoff:
   el `describe('#95 R8')` anidado en pairing (Obs. 4 de la ronda 1) y la
   sangría sobrante de `src/app/(tabs)/_layout.tsx` (Obs. 7 de la ronda 1).
3. (Cosmético) El `impl` §Ronda 2 atribuye `da348322` al "reviewer". Es el
   commit `docs(harness)` del leader que versionó el informe y el handoff. No
   contiene producción, así que no afecta al veredicto. La frase de la ronda 1
   sobre traceability.md (Obs. 6) sí se corrigió: ahora dice que solo se tocó en
   `f9a22dd1`.

La prueba de humo en dev build de Android sigue siendo del humano y no se
evalúa aquí.

## Output de ./init.sh

No lo lanzó el reviewer. Lo lanzó el leader, con permiso del humano, en
`/home/claude/sites/Pet-Tracker`. Leí los ficheros crudos que escribió el
propio init.sh:

- `/tmp/claude-1002/init95_r2.head` = `7702e7ebfc12cb61405b9c3d47518b60261fad5a` = `git rev-parse HEAD` al revisar (HEAD no se movió)
- `/tmp/claude-1002/init95_r2.exit` = `EXIT=0`
- `/tmp/claude-1002/init95_r2.log`: 17220 líneas. Estas son las decisivas (ANSI quitado):

```
→ Verificando entorno...
✅ node disponible (/usr/bin/node)
✅ pnpm disponible (/home/claude/.npm-global/bin/pnpm)
✅ bun disponible (/home/claude/.npm-global/bin/bun)
→ Verificando variables de entorno...
✅ .env encontrado
⚠️  .env desactualizado: faltan 3 claves de .env.example
⚠️    configuración ausente: RESEND_API_KEY, RESEND_FROM, RESET_LINK_HOST
→ Instalando dependencias...
✅ Dependencias instaladas
→ Verificando coherencia del harness...
✅ Archivos del harness presentes
→ Build...
✅ Build exitoso
→ Ejecutando tests...
[backend unit]  Test Suites: 170 passed, 170 total
                Tests:       1295 passed, 1295 total
[infra]         Test Suites: 2 passed, 2 total
                Tests:       14 passed, 14 total
[node --test]   # tests 28 / # pass 28 / # fail 0
                # tests 5  / # pass 5  / # fail 0
                # tests 15 / # pass 15 / # fail 0
[mobile jest]   Test Suites: 80 passed, 80 total
                Tests:       1426 passed, 1426 total
                Snapshots:   1 passed, 1 total
✅ Tests pasados
→ Tests e2e...
[✓] migrations applied successfully!
[e2e]           Test Suites: 3 skipped, 27 passed, 27 of 30 total
                Tests:       8 skipped, 384 passed, 392 total
✅ Tests e2e pasados
→ Lint...
$ expo lint
✅ Lint sin errores
→ Typecheck...
$ tsc --noEmit
✅ Typecheck sin errores
✅ Todo verde. Listo para trabajar.
  Features: 95/113 completadas | 17 pendientes
EXIT=0
```

`grep -c 'FAIL\b'` sobre el log da 0. Los avisos de `.env` y de la feature
`harness-init-force-color` sin spec son preexistentes y no afectan al exit.
