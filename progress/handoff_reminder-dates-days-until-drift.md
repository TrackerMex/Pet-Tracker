# Handoff a Codex CLI — #84 `reminder-dates-days-until-drift`

> Pegar el bloque de abajo en la terminal de Codex CLI. El humano lo lanza;
> el leader no lo ejecuta.

---

```
Worktree: /home/claude/sites/Pet-Tracker-wt-backend   <- PRIMERA LINEA: trabaja AQUI y solo aqui
Antes de tocar nada, confirma en el reporte: `pwd` y `git branch --show-current`.
Tienen que dar /home/claude/sites/Pet-Tracker-wt-backend y
feature/84-reminder-dates-days-until-drift. Si no, PARA.
NO toques /home/claude/sites/Pet-Tracker: es el worktree de otra sesion.

Feature: reminder-dates-days-until-drift (#84), branch: feature/84-reminder-dates-days-until-drift
Spec aprobada por humano el 2026-09-23 (commit de firma 2665ffd3):
  specs/reminder-dates-days-until-drift/requirements.md  (status: approved, R1-R4; R4 es del humano)
  specs/reminder-dates-days-until-drift/design.md        (D1-D6, archivos afectados)
  specs/reminder-dates-days-until-drift/tasks.md         (orden de commits: seguirlo tal cual)
  specs/reminder-dates-days-until-drift/traceability.md  (actualizar tras CADA commit)
Lee las cuatro enteras antes de tocar nada. No viste la conversacion que las
origino: toda decision abierta ya esta cerrada por escrito ahi.

== QUE ES ==

Solo movil (mobile-pet-tracker/) y solo logica. `daysUntil(from, to)` de
src/utils/reminder-dates.ts hoy hace Math.ceil sobre una resta de
milisegundos: cuenta bloques de 24 h redondeados hacia arriba (hoy a las
20:00 = "en 1 dias"; ayer a hora posterior = -0, que cuenta como "esta
semana"). Pasa a restar el dia civil LOCAL de cada fecha
(Date.UTC(getFullYear(), getMonth(), getDate())) y dividir por DAY_MS.
Misma firma, mismo modulo. La pantalla de recordatorios NO se toca.
Cero claves de catalogo, cero dependencias, cero clases, cero backend.

== BASE: #114 YA ESTA EN MAIN ==

La branch ya contiene origin/main 993b62fa (merge de la PR #158 de #114).
Compruebalo con `git merge-base --is-ancestor 993b62fa HEAD; echo "exit=$?"`
(tiene que dar 0) y `git log --oneline | grep -c "#158"` (>= 1). Con eso, el
paso de tasks.md "Antes de empezar" que manda parar si #114 no esta en la
branch queda cumplido: NO pares por eso.

La spec cita recuentos medidos en 446f5581 (antes de #114). Con #114 dentro
cambian las bases: MIDE TU las dos bases por fichero y la de la suite movil
al arrancar (tasks.md "Antes de empezar") y aplica los deltas sobre lo
medido: reminder-dates.test.ts +13, reminders/index.test.tsx +2, suite
movil +15 tests y +0 suites.

== FICHEROS (lista cerrada; un diff fuera de ella es un hallazgo del reviewer) ==

  mobile-pet-tracker/src/utils/reminder-dates.ts          (produccion: solo el cuerpo de daysUntil)
  mobile-pet-tracker/src/utils/reminder-dates.test.ts
  mobile-pet-tracker/src/screens/reminders/index.test.tsx (solo un describe nuevo AL FINAL)
  specs/reminder-dates-days-until-drift/traceability.md
  progress/impl_reminder-dates-days-until-drift.md        (lo creas tu)

src/screens/reminders/index.tsx NO se toca (D1). Tampoco
src/screens/home/format.ts ni su test (D2: no se unifica con
calendarDaysUntil).

== SKILLS ==

- Ninguna de tus 13 skills de expo aplica: es logica pura, sin UI nueva ni
  navegacion ni animacion. No cargues ninguna y dilo en el reporte.
- La carta de UI (docs/ui-guidelines.md) sigue rigiendo el gate C8 del
  reviewer: en el codigo de test nuevo, nada de la forma `<palabra>-[` (el
  guard 'C8: la UI no usa clases arbitrarias' de
  src/__tests__/design-drift.test.ts lee tambien los tests colocados).

== REGLAS CRITICAS ==

- TDD por requisito, en el orden de tasks.md: R1, R2, R3. UN COMMIT POR
  PASO, el test rojo SIEMPRE antes que su implementacion; mensajes literales
  de tasks.md:
    1. test(reminder-dates): count local calendar days, not 24 h blocks (R1)          rojo
    2. feat(reminder-dates): subtract local civil days in daysUntil (R1)              verde
    3. test(reminder-dates): lock local civil day against UTC skew (R2)               rojo
    4. feat(reminder-dates): revert the R2 probe mutation, local getters locked (R2)  verde
    5. test(reminders): lock calendar days in week pill, badge and label (R3)         rojo
    6. feat(reminder-dates): revert the R3 probe mutation, screen locked (R3)         verde
  Un commit con test + implementacion juntos incumple C4 de CHECKPOINTS.md.
- R2 y R3 son requisitos de VERIFICACION sobre codigo ya correcto
  (CHECKPOINTS.md C4, quinto punto): su rojo es una MUTACION DE PRODUCCION
  versionada en el commit rojo, y el verde la revierte. Nunca una mutacion
  del doble ni del test.
    R2 rojo: en daysUntil, las seis llamadas getFullYear/getMonth/getDate
             pasan a getUTCFullYear/getUTCMonth/getUTCDate.
    R3 rojo: el cuerpo de daysUntil vuelve a
             return Math.ceil((to.getTime() - from.getTime()) / DAY_MS);
  Tras cada verde de R2 y R3:
    git diff <hash del verde anterior> -- mobile-pet-tracker/src/utils/reminder-dates.ts; echo "exit=$?"
  -> salida VACIA. Escribelo en el reporte.
- El mismo commit rojo de R1 cambia la fila existente
  ['positive', new Date('2026-08-25T09:00:01.000Z'), 2], a esperar 1: fijaba
  el defecto. Es la UNICA asercion existente que cambia. Si otro test
  existente se pone rojo, la implementacion esta mal: no toques ese test,
  PARA y escribelo en el reporte.
- Valores esperados LITERALES, escritos a mano (tablas de requirements.md R1,
  R2, R3). Prohibido calcularlos con Date.UTC, DAY_MS o cualquier simbolo de
  produccion en el test: pasaria aunque el codigo estuviese mal.
- `toBe`, nunca `toEqual`, en las filas de daysUntil: toBe usa Object.is y
  asi -0 no pasa por 0.
- Fechas de R1 y R3 con componentes locales: new Date(2026, 8, dia, hora, min)
  (mes indice 8 = septiembre). Los dobles de R2 con la forma de los `skewed`
  de '#70 R5' en src/screens/home/format.test.ts, mas getTime; el helper
  entra en el mismo commit donde se usa por primera vez (nada de
  ReferenceError como rojo).
- NO toques la config global de jest ni TZ: no se puede forzar la zona desde
  un test (requirements C3) y la spec no lo pide.
- Los titulos de describe llevan el prefijo "#84 R<n>:", literales de
  requirements.md.
- Sin comentarios nuevos en produccion.
- Sin anclas por numero de linea: localiza cada sitio con grep -n del texto
  citado en la spec.
- bun para todo en movil (bunx, bun run); nunca npx ni npm. Cero dependencias.
- NO rebasees, NO mergees main, NO hagas push. Los hashes de traceability.md
  tienen que seguir existiendo cuando el reviewer los busque.
- NO son tuyos, no los toques: progress/history.md, progress/current.md,
  STATUS.md y el campo `status` de feature_list.json. Son artefactos de
  cierre del leader. Tu sitio para contarlo todo es
  progress/impl_reminder-dates-days-until-drift.md.
- NO abras la PR ni la edites. NO marques la casilla de R4: es del humano.

== ENTORNO ==

- NO corras ./init.sh. Postgres y LocalStack son compartidos con otra sesion
  y esta feature no los necesita. La linea base la midio el leader con
  ./init.sh exit=0 en 446f5581 (antes de #114); copiala al reporte como
  referencia, sabiendo que la movil ha subido con #114:
    movil: 80 suites, 1443 tests (en 446f5581)
    backend unit: 170 suites, 1298 tests; infra: 2 suites, 14 tests
    e2e: 27 suites passed + 3 skipped (30), 389 tests passed + 8 skipped
- La base que manda es la que TU midas al arrancar en esta branch: los dos
  ficheros de test y `bun run test` entero.
- Verificacion: SOLO los comandos de tasks.md §Cierre, desde
  mobile-pet-tracker/, sin pipe (`cmd; echo "exit=$?"`, nunca `cmd | tail`).
  Incluye el `rm -f .expo/types/router.d.ts` del principio.
- Recuentos esperados al cierre: mismas suites moviles que tu base y +15
  tests (R1: 10; R2: 3; R3: 2). Backend: sin cambios.

Criterios de aceptacion: R1-R3 de requirements.md (R4 lo firma el humano).

Al terminar: escribir el resultado en progress/impl_reminder-dates-days-until-drift.md
(pwd y branch, skills cargadas, bases medidas, salida de cada rojo y cada
verde con sus fallos esperados, los git diff vacios tras los verdes de R2 y
R3, sondas extra si las haces, recuentos finales, grep-clean de tasks.md
§Cierre, lista de commits con hash) y parar.
```

---

## Ronda 2 — R5 y R6 (Enmienda E1), tras el rechazo de la ronda 1

> Pegar el bloque de abajo en la terminal de Codex CLI. Sustituye al de la
> ronda 1, que ya está hecho.

```
Worktree: /home/claude/sites/Pet-Tracker-wt-backend   <- PRIMERA LINEA: trabaja AQUI y solo aqui
Antes de tocar nada, confirma en el reporte: `pwd` y `git branch --show-current`.
Tienen que dar /home/claude/sites/Pet-Tracker-wt-backend y
feature/84-reminder-dates-days-until-drift. Si no, PARA.
NO toques /home/claude/sites/Pet-Tracker: es el worktree de otra sesion.

Feature: reminder-dates-days-until-drift (#84), RONDA 2.
La ronda 1 (tus commits 72af7d62..5b1cb8e9) fue RECHAZADA por el reviewer:
  progress/review_reminder-dates-days-until-drift.md (commit 158fbf43),
  hallazgos H1-H4.
Tu codigo de produccion es correcto y NO cambia. El hueco estaba en las
tablas que prescribia la spec: todas sus fechas caian entre el 9 y el 20 de
septiembre, asi que `return to.getDate() - from.getDate();` dejaba verde la
suite movil entera.
La spec se enmendo y el humano firmo la enmienda (commit de firma 7024a55b):
  specs/reminder-dates-days-until-drift/requirements.md  §Enmienda E1 (al final):
      R5 y R6 nuevos, sus tests literales, las mutaciones versionadas, el
      candado heredado que se mueve y los recuentos.
  specs/reminder-dates-days-until-drift/tasks.md         §Enmienda E1 — ronda 2 (al final):
      orden de commits de esta ronda, sondas y cierre.
Lee las dos secciones enteras antes de tocar nada. R1-R4 y sus tests NO cambian.

== QUE HAY QUE HACER (cuatro commits, sondas y trazabilidad) ==

  1. test(reminder-dates): lock month and year of the civil day (R5)                <- ROJO
     - src/utils/reminder-dates.test.ts:
       * filas zero/positive/negative de 'returns a %s integer' y su
         `const from` a componentes locales, tabla literal de §Enmienda E1
         "Candado heredado" (mismos esperados 0, 1, -1);
       * describe '#84 R5: el día civil incluye el mes y el año (Enmienda E1)'
         al final, con su helper PROPIO de dobles (anio, mes, dia locales +
         instante ISO; forma del skewed de R2 mas getTime) y UN it.each de 3
         filas, titulos y fechas literales de la tabla de R5.
     - MISMO commit, mutacion de produccion versionada en
       src/utils/reminder-dates.ts: el cuerpo de daysUntil pasa a ser
       `return to.getDate() - from.getDate();`.
     - Rojo esperado: las 3 filas de R5 (recibidos -29, -30, -30); los otros
       17 tests del fichero verdes.
  2. feat(reminder-dates): revert the R5 probe mutation, month and year locked (R5)  <- VERDE
     - Revierte la mutacion:
       git diff 720817f8 -- mobile-pet-tracker/src/utils/reminder-dates.ts; echo "exit=$?"
       -> salida VACIA.
  3. test(reminders): lock the week pill and badge thresholds (R6)                  <- ROJO
     - src/screens/reminders/index.test.tsx, al final: describe
       '#84 R6: los umbrales de la píldora y del badge no se aflojan (Enmienda E1)'
       con el beforeEach/afterEach del describe de R3 y el it literal de
       requirements R6 (plus-eight y plus-eleven, cinco aserciones).
     - MISMO commit, mutacion de produccion versionada en
       src/screens/reminders/index.tsx: en la pildora `days <= 7` ->
       `days <= 8`; en la linea `{!inactive && days >= 0 && days <= 10 ? (`,
       `days <= 10` -> `days <= 11`. Localiza ambas con grep -n.
     - Rojo esperado: el it de R6, por asercion; los 28 tests previos verdes.
  4. feat(reminders): revert the R6 probe mutation, thresholds locked (R6)          <- VERDE
     - Revierte las dos:
       git diff origin/main -- mobile-pet-tracker/src/screens/reminders/index.tsx; echo "exit=$?"
       -> salida VACIA.
  5. Sondas (NO se commitean; cada una roja y restaurada con git diff vacio):
     R5: U9, U10, U11, U12, U15; R6: S8 (solo pildora <= 8) y S9 (solo badge
     <= 11). Lista exacta en tasks.md §Enmienda E1. Deja el rojo de cada una
     en el reporte.

== REGLAS CRITICAS ==

- Un commit por paso, el test rojo SIEMPRE antes que su verde. Mensajes
  literales de arriba (y de tasks.md §Enmienda E1).
- Actualiza specs/reminder-dates-days-until-drift/traceability.md TRAS CADA
  COMMIT, no al final (H5 de la ronda 1): filas R5 y R6 y la fila del
  candado heredado en "Candados ajenos movidos".
- R5 y R6 son requisitos de VERIFICACION (CHECKPOINTS.md C4, quinto punto):
  el rojo es una mutacion de PRODUCCION versionada; nunca del doble ni del
  test. Produccion al final identica a 5b1cb8e9:
    git diff 5b1cb8e9 HEAD -- mobile-pet-tracker/src/utils/reminder-dates.ts mobile-pet-tracker/src/screens/reminders/index.tsx; echo "exit=$?"
  -> vacio.
- Valores esperados LITERALES; `toBe`, no `toEqual`. Fechas con componentes
  locales. NO toques la config global de jest ni TZ.
- NO toques los tests de R1, R2 ni R3, ni el helper skewed de R2.
- Sin comentarios nuevos en produccion. Nada de la forma `<palabra>-[` en
  codigo de test (guard C8 de design-drift.test.ts).
- bun para todo en movil; nunca npx ni npm. Cero dependencias.
- NO rebasees, NO mergees main, NO hagas push.
- NO toques progress/history.md, progress/current.md, STATUS.md ni el campo
  status de feature_list.json. NO marques la casilla de R4.

== ENTORNO ==

- NO corras ./init.sh (Postgres y LocalStack compartidos; esta feature no
  los necesita).
- Base de esta ronda (tasks.md §Enmienda E1 "Antes de empezar"): midela sin
  pipe; esperado reminder-dates.test.ts 17, reminders/index.test.tsx 28,
  suite movil 82 suites / 1467 tests.
- Cierre: comandos de tasks.md §Enmienda E1 "Cierre (ronda 2)", desde
  mobile-pet-tracker/, sin pipe. Esperado: 20, 29 y 13 tests en los tres
  ficheros; suite movil 82 / 1471; tsc y lint exit=0.

Criterios de aceptacion: R1-R3 y R5-R6 de requirements.md (R4 lo firma el humano).

Al terminar: anade un apartado "## Ronda 2" a
progress/impl_reminder-dates-days-until-drift.md (pwd y branch, base medida,
salida de cada rojo y cada verde, los git diff vacios, sondas con su rojo,
recuentos finales, lista de commits con hash) y para.
```
