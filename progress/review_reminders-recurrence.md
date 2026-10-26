# review: reminders-recurrence (#210)
Fecha: 2026-10-26 19:47 UTC (provisional) · 2026-10-26 21:40 UTC (final)
Veredicto: APROBADO
Bloqueantes: 0 · No bloqueantes: 6

Reviewer: subagente `reviewer` (Claude Opus 5.5). Implementación: Codex CLI.
Worktree `/home/claude/sites/Pet-Tracker-wt-210`, branch `feature/210-reminders-recurrence`.
- Rango revisado: `705f1ea2..e6a4251f`. `705f1ea2` es H0, la firma delegada. El último commit de Codex es `8c7f2f68` y `49f895e1` es el informe.
- Después del veredicto provisional (HEAD `49f895e1`) entraron dos commits del leader: el merge `c8a77bf1` y la regeneración `e6a4251f`. Se revisan abajo.
- El veredicto final se apoya en el `./init.sh` del leader sobre `e6a4251f`, que sale con `exit=0`. Ver «Output de ./init.sh».

## Alcance verificado

- **Lista cerrada.** `705f1ea2..49f895e1` toca 33 ficheros.
  - Los 29 de `backend-pet-tracker/` coinciden con la lista cerrada del handoff.
  - Los otros 4 son documentales: `progress/handoff_reminders-recurrence.md` y `specs/reminders-recurrence/requirements.md` (commits del leader `1d89093e`, `e6754281` y `42d5143a`), más `traceability.md` (C20) e `impl_reminders-recurrence.md`.
  - No toca nada de `docs/`.
  - `git status --short` está vacío salvo este review.
- **Commits.** Los 20 commits de Codex (C1–C20) tienen el asunto literal de la tabla §Commits de `tasks.md`. Van intercalados con los 3 commits documentales del leader y el del informe.
- **No se borró ningún `it` ni `describe`.** Cuenta antes y después por fichero:
  - `reminders.schema.spec` 3→5, `reminder.dto.spec` 5→10
  - `update-reminder.use-case.spec` 4→5, `list-reminders.use-case.spec` 1→1
  - `reminders-dispatch.service.spec` 6→6, `notifier-consumer.service.spec` 16→21
  - `pet-reminders.e2e-spec` 20→31
  - `owner-local-day.spec` 3→3, `local-day.spec` 13→13
- **Enmiendas E1–E8.** Todas aplicadas como prescriben las erratas:
  - E1: el `it` «envia push, marca sent despues y borra el mensaje» sigue presente, con 1 ocurrencia base y 1 nueva.
  - E2: las aserciones de `reminders-dispatch.service.spec.ts` dan 1 en las cinco guardas tolerantes a Prettier de la Reanudación 2, con base 0.
  - E3 y E5: aplicadas.
  - E4: en C7 (`1484fec6`) da 2/2 en update, 1/1 en list, 5/5 en dispatch y 1/1 en notifier.
  - E6, E7 y E8: aplicadas.
  - E9 es del leader (`e6754281`) y no toca código.
- **Migración de Codex** (`0020_reminders_recurrence.sql` en `49f895e1`, renumerada a 0021 tras el merge):
  - Es solo aditiva: 4 `ADD COLUMN` nullable y 3 `ADD CONSTRAINT`, sin `DROP`.
  - En `49f895e1`, `_journal.json` tenía 21 entradas, el `prevId` del snapshot 0020 era el `id` del 0019, y las demás tablas eran idénticas a las de 0019.
  - El snapshot declara las 4 columnas `recurrence_*` y los CHECKs `reminders_recurrence_{unit,every,shape}_check`.
  - Los CHECKs coinciden con `reminders.schema.ts` y con design.md: rangos por unidad 1–24, 1–365, 1–52, 1–12 y 1–10, y forma «todo null» o «unit, every y anchor no null».

## Commits posteriores al provisional: merge de dev y migración regenerada

- **`c8a77bf1`** mergea `origin/dev` `881317e6` (PR #263, #211 `pet-members-api`). Sus padres son `49f895e1` y `881317e6`.
  - Visto desde #210, el merge toca 32 ficheros de `backend-pet-tracker/`: los 31 que #211 cambió en dev y el borrado de la `0020_reminders_recurrence.sql` propia. Ese borrado es el paso de la receta común.
  - Los 31 ficheros de #211 tienen en `e6a4251f` el mismo blob que en `881317e6`, sin desajustes.
  - Los 27 ficheros de #210 que no son de migración tienen el mismo blob que en `49f895e1`. El merge no cambió código ni tests de #210.
  - El único fichero que tocan las dos ramas es `meta/_journal.json`. Sus 21 primeras entradas son idénticas a las de dev.
- **`e6a4251f`** `chore(reminders): regenerate migration after merging dev` toca exactamente 3 ficheros: `0021_reminders_recurrence.sql`, `meta/0021_snapshot.json` y `meta/_journal.json`.
  - `0021_reminders_recurrence.sql` es byte a byte igual a la `0020_reminders_recurrence.sql` revisada en el provisional: 7 `ALTER TABLE "reminders" ADD …`, sin `DROP` ni `CREATE` y sin mencionar `pet_invites`.
  - `_journal.json` tiene 22 entradas: la 20 es `0020_pet_invites` y la 21 es `0021_reminders_recurrence`.
  - El `prevId` de `0021_snapshot.json` es el `id` de `0020_snapshot.json`, y ese `0020_snapshot.json` es idéntico al de dev.
  - En el snapshot 0021, la tabla `reminders` es idéntica a la del 0020 provisional. Las otras 21 tablas son idénticas a las del 0020 de dev, `pet_invites` incluida.
- **Diff pedido.** `c8a77bf1^1..e6a4251f -- backend-pet-tracker/` da los 31 ficheros de #211 más `0021_reminders_recurrence.sql` y `meta/0021_snapshot.json`, como esperaba el leader.
- **Ningún test de #210 depende del número 0020.**
  - En `reminders.schema.spec.ts`, `test/pet-reminders.e2e-spec.ts`, `src/modules/reminders` y `src/workers/notifier` no aparece `0020`, `0021`, `_journal` ni `migrations/`.
  - El `it` «#210 R1: genera una migracion reminders_recurrence solo aditiva» (`reminders.schema.spec.ts:141-158`) busca el fichero con `/^\d{4}_reminders_recurrence\.sql$/`. `findRemindersMigration` busca por contenido `CREATE TABLE "reminders"`.
  - El número solo aparece en documentación: `design.md:179`, `requirements.md:483`, `tasks.md:323`, el handoff y el informe. `tasks.md:323` ya preveía la renumeración si #211 o #212 mergeaban antes.
- **Trazabilidad.** El merge no reescribe historia: `8c7f2f68` sigue siendo ancestro de `e6a4251f`, así que los 19 hashes de `traceability.md` siguen siendo válidos.

## Checklists C2–C7

### C2 — Estado coherente
- [x] Máximo una feature `in_progress`: hay 0 en el branch. #210 figura `spec_ready` en `feature_list.json` (ver O5).
- [x] `progress/current.md` está en plantilla. El estado vive en el handoff y en el informe, por disco.
- [x] N/A «toda feature done tiene test»: #210 no está `done`.

### C3 — Arquitectura
- [x] `domain/` no importa de `infrastructure/` ni de frameworks. `reminder.entity.ts`, `reminder.errors.ts` (`InvalidRecurrenceError`) y el puerto `reminder.repository.ts` solo tienen tipos y clases planas.
- [x] El repositorio de `domain/` es una interfaz pura. `markEnqueued(id, scheduleName, at)` y `advanceOccurrence(...)` se declaran como contrato, sin implementación.
- [x] `application/` depende de puertos, no de implementaciones.
  - `create-reminder.use-case.ts` consulta la zona del dueño solo si `recurrence` y `recurrenceUntil` son no nulos.
  - `update-reminder.use-case.ts` aplica la tabla de R6 dentro de `if (recurrenceEdited)`.
  - `recurrence.ts` importa `@/pipeline/local-day` y `@/modules/health/application/vaccine-date`. Son funciones puras que ya usa `application/` (patrón de docs/architecture.md, sección de `src/pipeline/`).
- [x] `infrastructure/` no lleva lógica de negocio.
  - El repositorio drizzle mapea `recurrence` a las 4 columnas en `create` y en `reschedule`. En `reschedule` solo lo hace si `'recurrence' in changes`.
  - `markEnqueued` condiciona con `is not distinct from` sobre `schedule_name`.
  - `advanceOccurrence` condiciona con `id`, `status = 'scheduled'` y `schedule_name`, y devuelve `rows.length === 1`.
  - `reminder.mapper.ts` expone `{unit, every}` y `recurrenceUntil`, nunca `anchorAt` (R5).
  - `reminder-error.mapper.ts` traduce `InvalidRecurrenceError` a `400 Invalid recurrence`. El `POST` del controller pasa por `mapReminderError`.
- [x] El notifier respeta el diseño.
  - `notifier-consumer.service.ts` recibe `PET_REPOSITORY` como sexto parámetro e importa `PetsModule` en `notifier.module.ts`.
  - La rama de un solo disparo hace `markSent`.
  - La rama de serie usa `ownerTimeZone` y luego `nextOccurrence`. Con `null` hace `markSent`. Si no, hace `advanceOccurrence` con un `reminder-${uuidv7()}` nuevo, y con `false` registra `stale_schedule` (`notifier-consumer.service.ts:217-218`).
  - El push añade `kind: 'reminder'` a `data` (R12). El contrato SQS de #12 no cambia.
- [x] La simplificación deliberada lleva un comentario `ponytail:` en `recurrence.ts` (1 ocurrencia).

### C4 — TDD
- [x] Cada R1–R14 tiene al menos un test que nombra `#210 R<n>`.
  - Los 31 nombres que cita `traceability.md` existen literalmente en sus ficheros.
  - Los `describe` también llevan el prefijo `#210 R<n>`.
- [x] El historial va de rojo a verde. Cada `test(reminders): #210 …` toca solo tests (y stubs donde `tasks.md` los prescribe). Cada `feat(reminders): #210 …` siguiente toca producción.
- [x] Reproduje los rojos unitarios en un worktree de scratch con `node_modules` enlazado, ya borrado sin `--force`.
  - En todos hay 0 `TypeError`, 0 `ReferenceError` y 0 suites «failed to run».
  - Cada uno coincide con el rojo esperado de la tabla de `tasks.md`.

  | Commit | Rojo | Verde siguiente |
  |---|---|---|
  | C1 `ea3f36b2` | 3 por aserción: E8; R1 columnas (`Expected "varchar(5)" Received undefined`); R1 migración (`Expected length 1 Received 0`) | C2 `a21772ae`: 5/5 |
  | C3 `361c280b` | 31 por aserción: las 3 filas «lanza» de R3 y todas las de R7–R10 | C4 `16229e29`: 47/47 |
  | C5 `74d31b82` | 46 por aserción (ruta raíz `[""]` en zod) | C6 `74a0222c`: 77/77 |
  | C7 `1484fec6` | 1 (R4 serie) | C8 `a56a501e`: 208/208 |
  | C11 `c14caa03` | 7; la fila «solo title» de R6 nace verde (ver O3) | C12 `dabe90a9`: 213/213 |
  | C13 `5cc759e5` | 3 (los `it` de E2) | C14 `19edcd1f`: 213/213 |
  | C15 `a5e419c4` | 2: el `it` de E1 y R12 | C16 `fa2b0d88`: 19/19 |
  | C17 `7414d330` | 5; la fila «serie pasada de until» de R11 nace verde | C18 `28c4a459`: 225/225 |

- [x] Las filas que nacen verdes quedan candadas por mutación. Planté cada mutación en `49f895e1` y la revertí; `git status` quedó en 0 tras cada una.
  - M1, `assertValidRecurrence` que lanza siempre: 3 rojos, las filas «no lanza» de R3 (mismo día local, zona MX y serie sin until).
  - M2, en el caso de uso `create`: 1 rojo, R4 «sin recurrence crea recurrence null y no consulta la zona».
  - M3, PATCH que reancla siempre: 1 rojo, R6 «PATCH solo title».
  - M4, `until` ignorado: 3 rojos, las dos filas de R10 que esperan `null` y R11 «serie pasada de until marca sent y no avanza».
  - M10, extra, `!advanced` invertido: 1 rojo, R13 «advanceOccurrence false registra stale_schedule y borra el mensaje».
  - M11, extra, clave adicional en `data`: 2 rojos, el `it` de E1 «envia push, marca sent despues y borra el mensaje» y R12.
- [x] Guardas del handoff, medidas en `49f895e1`:
  - `ponytail:` = 1.
  - `Promise.resolve(false)` = 0 y `void x;` = 0 (sin stubs residuales).
  - A1, A2, A5 y A10 = 0; A24 = 21; A6 = 2; A26 = 1. Las demás igualan su base (1).
  - A24 vale 22 tras el merge, como se espera: 21 entradas de dev más 1.
- [x] El verde e2e lo confirma el `init.sh` del leader en `e6a4251f`. Los rojos e2e (C1 e2e, C9, C11 e2e, C13 e2e, C17 e2e, C19/M9) y las mutaciones drizzle M5–M8 no los reproduje: el encargo vetaba e2e. Ver O4.

### C5 — Trazabilidad
- [x] `traceability.md` no tiene ninguna fila «pendiente». La única coincidencia es la línea de regla 26, que no es fila.
- [x] Los 19 hashes citados existen, caen en `705f1ea2..8c7f2f68` y su mensaje coincide literalmente con el citado.
- [x] Cada fila cita el commit rojo y el verde. R14 cita solo el rojo `5a8fd10c`: nace verde por diseño y su rojo se prueba con M9 sin commit, como prescribe la regla de la línea 30.
- [x] C20 `8c7f2f68` toca solo `traceability.md` y `49f895e1` solo el informe. Después solo hay un merge y un commit de migración, sin rebase: los hashes siguen siendo ancestros de HEAD.
- [x] Los commits siguen `test(reminders): #210 R<n> <desc>` / `feat(reminders): #210 R<n> <desc>`, con `<desc>` en inglés. El commit del leader `e6a4251f` usa `chore(reminders): …`, fuera de la cadena TDD.

### C6 — Spec aprobada
- [x] `requirements.md` tiene `status: approved` y la casilla de aprobación `[x]` (2026-10-26). La firma es delegada en el leader por el mandato del 2026-10-23, ampliado a #208–#216 el 2026-10-26.

### C7 — Sin código huérfano
- [x] N/A. #210 extiende reminders sin reemplazar ningún módulo. La migración es aditiva y no se eliminan `it` existentes. La `0020_reminders_recurrence.sql` borrada en el merge queda reemplazada por la 0021 idéntica, sin restos.

## Mediciones propias

Todas corridas desde `backend-pet-tracker/` con `pnpm exec`, midiendo el exit code sin pipe.

En `49f895e1`:
- **Unitarios de la feature:** schema, `src/modules/reminders`, `src/workers/notifier`, `owner-local-day.spec.ts` y `local-day.spec.ts`. Dan 17 suites y 241 tests, exit 0.
- **Unitarios completos:** 189 suites y 1573 tests, exit 0. Contra la base T0 del informe (187/1474), #210 añade 2 suites y 99 tests.
- **`tsc --noEmit -p tsconfig.json`:** exit 0 sin salida. Este tsconfig incluye `test/`, así que cubre también el e2e.
- **`eslint`** sobre los 26 `.ts` cambiados: exit 0.
- **`prettier --check`** sobre los ficheros cambiados: exit 0.

En `e6a4251f`:
- **Unitarios:** `jest src/db/schema src/modules/reminders src/workers/notifier owner-local-day.spec.ts local-day.spec.ts` da 29 suites y 317 tests, exit 0. Al incluir `src/db/schema` entero, cubre todos los specs de schema, también los de #211.
- **`tsc --noEmit -p tsconfig.json`:** exit 0 sin salida.
- **`git status --short`:** solo este review sin trackear. El `eslint --fix` de `init.sh` no dejó cambios.

Logs en `/tmp/claude-1002/-home-claude-sites-Pet-Tracker/54341eda-28f1-4262-9348-c2fbc9852939/scratchpad/`:
- `unit_feature.log`, `unit_full.log`, `tsc.log`, `eslint.log`, `prettier.log`
- `run_C2.log` … `run_C18.log`, `reds.out`
- `mut_M1.log` … `mut_M4.log`, `mut_M10.log`, `mut_M11.log`
- `unit_feature_e6a4251f.log`, `tsc_e6a4251f.log`

## Observaciones

Ninguna bloquea. O6 y O7 quedan cerradas.

- **O1. Títulos de `it.each` en R7 y R8 (`recurrence.spec.ts:156` y `:254`).** Los placeholders no casan con los parámetros.
  - R7, `'#210 R7: %s %s desde %s da %s'`, interpola unidad, every, zona y ancla. «desde» muestra la zona y «da» el ancla, no el resultado.
  - Por eso las tres filas de `month 1` comparten el título «month 1 desde UTC da 2026-01-31T15:00:00.000Z». Las dos de `year 1` comparten «year 1 desde UTC da 2028-02-29T15:00:00.000Z».
  - En R8, «da» muestra el `dueAt`, no el resultado esperado.
  - Las aserciones son correctas y cada fila falla por separado. Solo se pierde legibilidad del informe de jest. Corregirlo cambiaría los nombres que cita `traceability.md`; queda como deuda.
- **O2. Describe duplicado.** El `describe` de R8 (`recurrence.spec.ts:179`) repite el texto de R7: «ocurrencias desde el ancla». No es ambiguo porque el prefijo `#210 R8` los distingue.
- **O3. Cobertura de R6 en unitarios.** La tabla de `update-reminder.use-case.spec.ts` cubre el PATCH de «solo title» sin reanclar. No tiene fila de «solo advanceMinutes». El e2e de R6 y M3 cubren la regla general «sin `dueAt` ni `recurrence` no reancla».
- **O4. Lo que no medí.** No reproduje los rojos e2e ni las mutaciones M5–M8 sobre el repositorio drizzle: el encargo vetaba e2e. Para esos rojos me fío de `progress/impl_reminders-recurrence.md`. El verde e2e sí queda confirmado por el `init.sh` del leader.
- **O5. Estado en `feature_list.json`.** #210 sigue en `spec_ready` en el branch. El leader debe pasarla a `done` en su cierre.
- **O6. Cerrada.** Colisión de número de migración con #211: resuelta por el leader con la receta común en `c8a77bf1` y `e6a4251f`. Revisado arriba.
- **O7. Cerrada.** Los totales e2e de `pet-reminders` (69) y `alerts-center-notifier` (20) quedan confirmados por aritmética sobre el log del leader. Ver «Output de ./init.sh».
- **O8. dev siguió avanzando.** `origin/dev` está ahora en `81ca7529`, con #220 `mobile-date-field` (PR #264) mergeada después de `881317e6`. `881317e6..81ca7529` toca 0 ficheros de `backend-pet-tracker/`. Si la PR de #210 pide actualizar la rama, el merge es solo móvil y no afecta a lo revisado.

## Output de ./init.sh

No lo corrí: el encargo lo veta. El leader lo corrió sobre `e6a4251f`. El log completo queda como evidencia en:
`/tmp/claude-1002/-home-claude-sites-Pet-Tracker/54341eda-28f1-4262-9348-c2fbc9852939/scratchpad/init-210-e6a4251f-run1.log`

Validez del log:
- Se escribió por última vez a las 21:29:11 UTC, después del commit `e6a4251f` (21:18:57 UTC).
- Tiene 103 411 líneas y termina en `e6a4251f0235be73980cd257f6c5a3e76f8bc835` y `exit=0`.
- Tras quitar los códigos ANSI, no hay ninguna línea `FAIL`. Hay 47 líneas «●» y todas son «● Console».

Totales, con su línea en el log limpio:
- Backend unitarios (221–222): 195 suites y 1595 tests. Es lo de dev (193/1496) más lo de #210 (2/99), y ese delta coincide con mi medición en `49f895e1` (189/1573 contra la base T0 187/1474).
- Infra (234–235): 2 suites y 14 tests.
- Móvil (102994–102995): 155 suites y 5450 tests.
- E2E (103379–103380): 31 suites pasan y 3 se saltan, de 34; 580 tests pasan y 8 se saltan, de 588. Le sigue «✅ Tests e2e pasados».
- Build (60), «✅ Lint sin errores» (103396), «✅ Typecheck sin errores» (103400) y «✅ Todo verde. Listo para trabajar.» (103403).

Cierre de O7. El log no tiene una línea por suite de los e2e del backend, porque jest corre sin `--verbose`. Las 157 líneas `PASS` son de infra y móvil. La conclusión sale por aritmética:
- Las 3 suites saltadas son `aws-real-smoke`, `aws-real-media` y `aws-real-ingest`, con `(runSmoke ? describe : describe.skip)` y `(runAwsIngest ? describe : describe.skip)`.
- Ni `pet-reminders.e2e-spec.ts` ni `alerts-center-notifier.e2e-spec.ts` tienen `.skip`.
- Con 0 suites fallidas, las dos corrieron y pasaron enteras.
- El delta e2e es 588 − 544 de dev = 36 tests. Coincide con lo que #210 añade a `pet-reminders` según la base T0 y el final del informe: de 33 a 69. `alerts-center-notifier` se queda en 20, sin cambio.
