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
