# Handoff a Codex CLI — #125 `reminder-advance-already-past`

> Pegar el bloque de abajo en la terminal de Codex CLI. El humano lo lanza;
> el leader no lo ejecuta.

---

```
Worktree: /home/claude/sites/Pet-Tracker-wt-backend   <- PRIMERA LINEA: trabaja AQUI y solo aqui
Antes de tocar nada, confirma en el reporte: `pwd` y `git branch --show-current`.
Tienen que dar /home/claude/sites/Pet-Tracker-wt-backend y
feature/125-reminder-advance-already-past. Si no, PARA.
NO toques /home/claude/sites/Pet-Tracker: es el worktree de otra sesion.

Feature: reminder-advance-already-past (#125, P2), branch: feature/125-reminder-advance-already-past
Spec aprobada por humano el 2026-09-24 (commit de firma 699e90cf):
  specs/reminder-advance-already-past/requirements.md  (status: approved, R1-R5; R5 es del humano)
  specs/reminder-advance-already-past/design.md        (D1-D10, arnes D9, Archivos afectados)
  specs/reminder-advance-already-past/tasks.md         (orden, esqueletos de los rojos, sondas y cierre: seguirlo tal cual)
  specs/reminder-advance-already-past/traceability.md  (se rellena UNA vez, en el commit final)
Lee las cuatro enteras antes de tocar nada. No viste la conversacion que las
origino: toda decision abierta ya esta cerrada por escrito ahi.

== QUE ES ==

Backend + movil, decision del humano "C + A".
- Backend (R1, R2): funcion pura nueva reminderPushBody(title, dueAt, timeZone)
  en src/modules/reminders/application/reminder-push-body.ts que devuelve
  `Recordatorio: <titulo> · <dia> de <mes> a las <HH>:<mm>` en la zona del
  owner (fallback 'UTC' con isSupportedTimeZone). El dispatcher inyecta
  PET_REPOSITORY y llama findOwnerTimezone(reminder.petId) DENTRO del try de
  cada recordatorio. Cero cambios de puerto, modulo, repositorio o migracion.
- Movil (R3, R4): en Nuevo recordatorio los chips de aviso cuyo momento
  (fecha+hora elegidas menos el aviso) es <= ahora quedan desactivados
  (Pressable disabled + ` opacity-50`), y la seleccion es el mayor aviso
  activo que no supera el ultimo elegido (derivada, D6). "Ahora" es estado
  que se fija al montar y al elegir fecha u hora; Guardar recalcula con
  Date.now(). Cero claves de catalogo.

== BASE ==

La branch sale de origin/main 40ec1b46. Compruebalo con
`git merge-base --is-ancestor 40ec1b46 HEAD; echo "exit=$?"` (0).
mobile-pet-tracker/.expo/types/router.d.ts no existe ahora (lo borro el
leader). Si reaparece, PARA y avisa: tu sandbox deniega `rm -f`.

== FICHEROS (lista cerrada de design.md §Archivos afectados; un diff fuera de ella es un hallazgo del reviewer) ==

  backend-pet-tracker/src/modules/reminders/application/reminder-push-body.ts             (nuevo)
  backend-pet-tracker/src/modules/reminders/application/reminder-push-body.spec.ts        (nuevo)
  backend-pet-tracker/src/modules/reminders/infrastructure/reminders-dispatch.service.ts
  backend-pet-tracker/src/modules/reminders/infrastructure/reminders-dispatch.service.spec.ts
  mobile-pet-tracker/src/screens/add-reminder/index.tsx
  mobile-pet-tracker/src/screens/add-reminder/index.test.tsx
  specs/reminder-advance-already-past/traceability.md
  progress/impl_reminder-advance-already-past.md                                          (lo creas tu)

NO cambian: reminders.module.ts, pets.module.ts, pet.repository.ts,
reminder.repository.ts, reminder.drizzle.repository.ts, src/db/, test/ (e2e),
src/workers/notifier/, catalog.ts, src/__tests__/*, package.json, lockfiles.

== SKILLS ==

- Para la parte movil carga `building-native-ui`. No cargues ninguna otra
  skill de expo (tu plugin no tiene router ni skill de design system; la
  carta de UI esta en docs/ui-guidelines.md y la spec ya trae el estado
  desactivado decidido, D8).
- La parte backend no usa skills de expo: sigue docs/architecture.md y
  docs/conventions.md (capas hexagonales).
- Di en el reporte que skills cargaste.

== REGLAS CRITICAS ==

- TDD por requisito, en el orden de tasks.md: R1, R2, R3, R4. UN COMMIT POR
  PASO, el test rojo SIEMPRE antes que su verde; mensajes literales de tasks.md:
    1. test(reminders): format the push body with the owner-zone due date (R1)                     rojo
    2. feat(reminders): format the reminder push body in the owner time zone (R1)                  verde
    3. test(reminders): dispatch the due date in the owner zone (R2)                                rojo
    4. feat(reminders): read the owner time zone when dispatching reminders (R2)                    verde
    5. test(add-reminder): disable advance chips whose moment already passed (R3)                   rojo
    6. feat(add-reminder): disable past advance chips and fall back to the largest future one (R3)  verde
    7. test(add-reminder): re-evaluate chips on date or time change and on save (R4)                rojo
    8. feat(add-reminder): refresh the evaluation instant on change and on save (R4)                verde
    9. docs(reminders): fill #125 traceability                                                      final
  Un commit con test + implementacion juntos incumple C4 de CHECKPOINTS.md.
  La UNICA produccion que viaja en un rojo son los esqueletos que nombra
  tasks.md (para que ningun rojo falle por Cannot find module ni
  ReferenceError).
- Los candados movidos (requirements §Candados «Se mueven») van en el rojo
  del requisito cuyo verde los romperia, exactamente como dice tasks.md: el
  literal de `R6` y el cuarto argumento de las cuatro `new RemindersDispatchService(`
  en el rojo de R2; `renders alert choices…`, `posts the exact trimmed input…`
  (solo ese it) y la sexta columna de `#123 R4` en el rojo de R3. NINGUN otro
  test existente puede cambiar: si otro se pone rojo, la implementacion esta
  mal; PARA y escribelo en el reporte.
- Valores esperados LITERALES de las tablas (R1, R2, R3, R4). Prohibido
  calcularlos en el test con Intl, reminderPushBody, effectiveAdvance o
  cualquier simbolo de produccion.
- reminderPushBody se compone desde `formatToParts`, nunca desde `.format(`
  (D4), con `hourCycle: 'h23'`.
- Fechas moviles con componentes locales y relojes falsos (design D9);
  verifica el arnes contra los mocks QUE YA EXISTEN en
  add-reminder/index.test.tsx; no copies mocks de otra suite. Los bloques
  #125 van AL FINAL, despues del describe padre de #123.
- `pnpm -C backend-pet-tracker run lint` lleva --fix: correlo ANTES de cada
  commit de backend y commitea el formato con su paso.
- Sin comentarios nuevos en produccion. Sin anclas por numero de linea:
  localiza cada sitio con grep -n del texto citado en la spec.
- Movil: bun para todo (bunx, bun run); nunca npx ni npm. Backend: pnpm.
  Cero dependencias.
- Jest movil siempre con --runTestsByPath.
- Haz las sondas de tasks.md §Sondas (M1-M7 y el techo, D1-D5, MU1-MU16) y
  deja su rojo en el reporte comparado con las tablas; restaura cada una con
  `git diff` vacio. No se commitean.
- Trazabilidad: rellena los ocho hashes UNA vez, en el commit final 9 (no
  tras cada commit).
- Si el sandbox te deniega un comando, PARA y reportalo; no lo sustituyas por
  otro que haga lo mismo.
- NO rebasees, NO mergees main, NO hagas push.
- NO son tuyos, no los toques: progress/history.md, progress/current.md,
  STATUS.md y el campo `status` de feature_list.json. Tu sitio para contarlo
  todo es progress/impl_reminder-advance-already-past.md.
- NO abras la PR. NO marques la casilla de R5: es del humano.

== ENTORNO ==

- NO corras ./init.sh ni el e2e (Postgres y LocalStack compartidos con otra
  sesion). La linea base la midio el leader con ./init.sh exit=0 en 40ec1b46;
  copiala al reporte:
    backend unit: 170 suites, 1298 tests; infra: 2 suites, 14 tests
    movil: 83 suites, 1491 tests
    e2e: 27 suites passed + 3 skipped (30), 389 tests passed + 8 skipped
- Mide tu al arrancar las bases de tasks.md "Antes de empezar" (reminders 6 /
  48, backend 170 / 1298, add-reminder 25, movil 83 / 1491).
- Aviso conocido: en una corrida completa de la suite movil el test
  "selects the first pet and loads its first position (#72 R2)" de
  src/screens/map/index.test.tsx fallo una vez en la copia del spec_author y
  paso solo. Si te pasa, correlo aislado, anotalo en el reporte y repite la
  suite completa; no toques ese fichero.
- Verificacion: SOLO los comandos de tasks.md §Cierre, sin pipe
  (`cmd; echo "exit=$?"`, nunca `cmd | tail`), incluidos los greps de backend
  y de movil.
- Recuentos esperados al cierre: reminders 7 / 57, backend 171 / 1307,
  add-reminder 37, movil 83 / 1503; tsc/typecheck y lint exit=0 en los dos.

Criterios de aceptacion: R1-R4 de requirements.md (R5 lo firma el humano).

Al terminar: escribir el resultado en progress/impl_reminder-advance-already-past.md
(pwd y branch, skills cargadas, bases medidas, salida de cada rojo y cada
verde con sus fallos esperados, candados movidos, sondas con su rojo,
recuentos finales, greps de cierre, lista de commits con hash) y parar.
```

---

## Ronda 2 — R6 (Enmienda E1), solo tests

> Pegar el bloque de abajo en la terminal de Codex CLI. Sustituye al de la
> ronda 1, que ya está hecho y aprobado.

```
Worktree: /home/claude/sites/Pet-Tracker-wt-backend   <- PRIMERA LINEA: trabaja AQUI y solo aqui
Antes de tocar nada, confirma en el reporte: `pwd` y `git branch --show-current`.
Tienen que dar /home/claude/sites/Pet-Tracker-wt-backend y
feature/125-reminder-advance-already-past. Si no, PARA.
NO toques /home/claude/sites/Pet-Tracker: es el worktree de otra sesion.

Feature: reminder-advance-already-past (#125), RONDA 2.
La ronda 1 (tus commits 459013a8..97054568) fue APROBADA por el reviewer
(progress/review_reminder-advance-already-past.md, commit 5134d165). Su
hallazgo H1 (y H2): ningun test distingue "la eleccion explicita del aviso se
conserva al cambiar fecha u hora" de "cada cambio resetea a 7 dias", ni
"con todo desactivado se marca la eleccion" de "se marca 10080 fijo". Tu
codigo es correcto y NO cambia.
El humano firmo la Enmienda E1 (commit de firma aedb89be):
  specs/reminder-advance-already-past/requirements.md  §Enmienda E1 (al final):
      R6, sus dos it literales, la mutacion versionada X11 y los recuentos.
  specs/reminder-advance-already-past/tasks.md         §Enmienda E1 — ronda 2 (al final).
Lee las dos secciones enteras antes de tocar nada. R1-R5 y sus tests no cambian.

== QUE HAY QUE HACER (tres commits y sondas) ==

  1. test(add-reminder): lock the kept advance choice across date and time changes (R6)   <- ROJO
     - En mobile-pet-tracker/src/screens/add-reminder/index.test.tsx, un describe
       hijo NUEVO al final del describe padre
       '#125: avisos que ya pasaron en Nuevo recordatorio' (despues del de R4):
       '#125 R6: la elección explícita del aviso se conserva al cambiar fecha u hora (Enmienda E1)'
       con los DOS it literales de requirements R6 (pasos a-e de cada tabla),
       reloj fijo new Date(2026, 8, 24, 8, 0), titulo 'Rabies', y los helpers
       de modulo que ya existen (pickDate, pickTime, expectAdvanceChips).
     - MISMO commit, mutacion de produccion versionada X11 en
       mobile-pet-tracker/src/screens/add-reminder/index.tsx:
       `setAdvanceMinutes(10080);` despues de
       `setDate(fromPickerValue(selectedDate));` (picker de fecha) y despues de
       `setTime(selectedTime);` (picker de hora). Nada mas en produccion.
     - Rojo esperado: los dos it de R6 por asercion (el primero en el paso c,
       el segundo en el paso d); los 37 tests previos verdes.
  2. feat(add-reminder): revert the R6 probe mutation, advance choice locked (R6)          <- VERDE
     - Revierte X11:
       git diff b10b7f1e -- mobile-pet-tracker/src/screens/add-reminder/index.tsx; echo "exit=$?"
       -> salida VACIA.
  3. Sondas (sin commit; cada una roja y restaurada con git diff vacio):
     X10 (solo en el picker de fecha), X1 (con todos desactivados marcar
     10080 fijo en vez de la preferencia), y resetear solo en el picker de
     hora. Anota que it y que paso se ponen rojos.
  4. docs(reminders): fill #125 E1 traceability                                             <- FINAL
     - Los dos hashes de R6 en specs/reminder-advance-already-past/traceability.md.

== REGLAS ==

- Un commit por paso, rojo antes que verde, mensajes literales de arriba.
- Valores esperados LITERALES de las tablas de R6; nada calculado con
  simbolos de produccion.
- NO toques ningun test existente ni el backend.
- Movil: bun (bunx, bun run), nunca npx ni npm; jest con --runTestsByPath.
- Si el sandbox te deniega un comando, PARA y reportalo.
- NO corras ./init.sh ni el e2e. NO rebasees, NO mergees main, NO hagas push.
- NO toques progress/history.md, progress/current.md, STATUS.md ni el campo
  status de feature_list.json. NO abras la PR.

== CIERRE (sin pipe, `cmd; echo "exit=$?"`) ==

- `cd mobile-pet-tracker && bunx jest --runTestsByPath src/screens/add-reminder/index.test.tsx` -> 39, exit=0
- `bun run --cwd mobile-pet-tracker test` -> 83 suites / 1505 tests, exit=0
- `bun run --cwd mobile-pet-tracker typecheck` y `bun run --cwd mobile-pet-tracker lint` -> exit=0
- `git diff 97054568 HEAD -- backend-pet-tracker mobile-pet-tracker/src/screens/add-reminder/index.tsx; echo "exit=$?"` -> vacio

Al terminar: anade un apartado "## Ronda 2" a
progress/impl_reminder-advance-already-past.md (pwd y branch, base medida,
salida del rojo y del verde, el git diff vacio, sondas con su rojo, recuentos
finales, commits con hash) y para.
```
