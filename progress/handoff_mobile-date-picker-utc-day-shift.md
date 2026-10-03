# Handoff a Codex CLI — #123 `mobile-date-picker-utc-day-shift`

> Pegar el bloque de abajo en la terminal de Codex CLI. El humano lo lanza;
> el leader no lo ejecuta.

---

```
Worktree: /home/claude/sites/Pet-Tracker-wt-backend   <- PRIMERA LINEA: trabaja AQUI y solo aqui
Antes de tocar nada, confirma en el reporte: `pwd` y `git branch --show-current`.
Tienen que dar /home/claude/sites/Pet-Tracker-wt-backend y
feature/123-mobile-date-picker-utc-day-shift. Si no, PARA.
NO toques /home/claude/sites/Pet-Tracker: es el worktree de otra sesion.

Feature: mobile-date-picker-utc-day-shift (#123, bug P1), branch: feature/123-mobile-date-picker-utc-day-shift
Spec aprobada por humano el 2026-09-24 (commit de firma b279cdfb):
  specs/mobile-date-picker-utc-day-shift/requirements.md  (status: approved, R1-R8; R8 es del humano)
  specs/mobile-date-picker-utc-day-shift/design.md        (D1-D9, arnes D6/D7, Archivos afectados)
  specs/mobile-date-picker-utc-day-shift/tasks.md         (orden de commits, sondas y cierre: seguirlo tal cual)
  specs/mobile-date-picker-utc-day-shift/traceability.md  (actualizar tras CADA commit)
Lee las cuatro enteras antes de tocar nada. No viste la conversacion que las
origino: toda decision abierta ya esta cerrada por escrito ahi.

== QUE ES ==

Solo movil (mobile-pet-tracker/). En Android, el dialogo de fecha de
@expo/ui/community/datetime-picker devuelve el dia elegido a MEDIANOCHE UTC y
abre tomando el valor como dia UTC; la app lo lee en local, asi que en
Mexico (UTC-6) Nuevo recordatorio y la fecha de nacimiento de Anadir mascota
guardan el dia ANTERIOR, y de noche el dialogo abre en MANANA.
Arreglo: modulo nuevo src/utils/date-picker-value.ts con
  toPickerValue(day)     -> medianoche UTC del dia LOCAL (lo que recibe el dialogo)
  fromPickerValue(picked)-> medianoche LOCAL del dia UTC (lo que guarda la pantalla)
que SOLO convierten si Platform.OS === 'android' (fuera de Android devuelven
el mismo objeto). Las dos pantallas lo usan en value= y en onValueChange.
minimumDate, maximumDate y el picker de hora NO se tocan.
Cero claves de catalogo, cero dependencias, cero parches a node_modules,
cero cambios nativos.

== BASE ==

La branch sale de origin/main 70f841f3. Compruebalo con
`git merge-base --is-ancestor 70f841f3 HEAD; echo "exit=$?"` (0).
El fichero gitignorado .expo/types/router.d.ts NO existe ahora mismo (lo
borro el leader). Si reaparece, PARA y avisa: tu sandbox deniega `rm -f`.

== FICHEROS (lista cerrada de design.md §Archivos afectados; un diff fuera de ella es un hallazgo del reviewer) ==

  mobile-pet-tracker/src/utils/date-picker-value.ts          (nuevo)
  mobile-pet-tracker/src/utils/date-picker-value.test.ts     (nuevo)
  mobile-pet-tracker/src/screens/add-reminder/index.tsx
  mobile-pet-tracker/src/screens/add-reminder/index.test.tsx (describe padre #123 AL FINAL)
  mobile-pet-tracker/src/screens/add-pet/index.tsx
  mobile-pet-tracker/src/screens/add-pet/index.test.tsx      (describe padre #123 AL FINAL)
  specs/mobile-date-picker-utc-day-shift/traceability.md
  progress/impl_mobile-date-picker-utc-day-shift.md           (lo creas tu)

== SKILLS ==

- Carga `expo-ui-jetpack-compose` (el dialogo de Android es el DatePicker de
  Jetpack Compose de @expo/ui). Si te hace falta contexto de la version iOS
  para entender D2, `expo-ui-swift-ui`. No cargues ninguna otra skill de expo.
- Tu plugin expo no tiene router (no hay "expo-overview"); no lo busques.
- Di en el reporte que skills cargaste.
- La carta de UI es docs/ui-guidelines.md (gate C8 del reviewer): en el codigo
  de test nuevo, nada de la forma `<palabra>-[`.

== REGLAS CRITICAS ==

- TDD por requisito, en el orden de tasks.md: R1, R2, R3, R4, R5, R6, R7. UN
  COMMIT POR PASO, el test rojo SIEMPRE antes que su implementacion; mensajes
  literales de tasks.md:
     1. test(date-picker): convert the dialog UTC day to the local day (R1)                 rojo
     2. fix(date-picker): read the UTC day from the Android dialog (R1)                     verde
     3. test(date-picker): open the dialog on the local day (R2)                            rojo
     4. fix(date-picker): send the local day at UTC midnight to the Android dialog (R2)     verde
     5. test(date-picker): leave non-Android picker values untouched (R3)                   rojo
     6. fix(date-picker): convert only on Android (R3)                                      verde
     7. test(add-reminder): show and save the picked day on Android (R4)                    rojo
     8. fix(add-reminder): store the picked day through fromPickerValue (R4)                verde
     9. test(add-reminder): open the date dialog on the local day on Android (R5)           rojo
    10. fix(add-reminder): open the date dialog through toPickerValue (R5)                  verde
    11. test(add-pet): show and send the picked birth date on Android (R6)                  rojo
    12. fix(add-pet): store the picked birth date through fromPickerValue (R6)              verde
    13. test(add-pet): open the birth date dialog on the local day on Android (R7)          rojo
    14. fix(add-pet): open the birth date dialog through toPickerValue (R7)                 verde
  Un commit con test + implementacion juntos incumple C4 de CHECKPOINTS.md.
- Todos los rojos de #123 son NATURALES (el codigo de hoy es el defecto):
  sin mutaciones versionadas. Ningun rojo puede fallar por `Cannot find
  module` ni `ReferenceError`: R1 crea el modulo con el esqueleto de
  fromPickerValue, R2 anade el de toPickerValue (tasks.md §Orden).
- R2 fila 4 queda VERDE con el esqueleto identidad en un host UTC (el VPS):
  es lo esperado y esta escrito en requirements R2. R1 fila 5 (Kiritimati)
  tambien queda verde con la identidad: es fila de regresion.
- Valores esperados LITERALES de las tablas de requirements (R1, R2, R4, R6):
  prohibido calcularlos con Date.UTC, getUTC* o el propio helper en el test.
- Dobles de zona: el helper de test `wallClock(local, utc)` con la forma
  EXACTA de requirements §Dobles de zona (Date real de reloj de pared + los
  tres getters UTC sobrescritos). Nada de process.env.TZ (no funciona en jest).
- Platform.OS en los tests segun design D6 (Object.defineProperty como
  setPlatform de src/hooks/use-push-registration.test.tsx), restaurado en
  afterEach. El candado `#90 R6` de add-pet corre como 'ios' y NO se toca: si
  se pone rojo, has filtrado Platform.OS desde un describe de #123.
- Arnes de pantalla segun design D7, verificado contra los mocks QUE YA
  EXISTEN en cada fichero de test (jest.mock de
  '@expo/ui/community/datetime-picker' y de '@expo/ui'). No copies mocks de
  otra suite. En add-pet NO pulses add-pet-photo (#72 R4, PICKER_MOCK_UNARMED).
- Titulos de describe/it literales de requirements.md (prefijo "#123 R<n>:",
  y "#123:" el describe padre).
- Sin comentarios nuevos en produccion. Sin anclas por numero de linea:
  localiza cada sitio con grep -n del texto citado en la spec.
- Haz las sondas de tasks.md §Sondas (helper, add-reminder, add-pet) y deja
  su rojo en el reporte; restaura cada una con `git diff` vacio. No se
  commitean.
- Actualiza traceability.md TRAS CADA COMMIT (en #84 se relleno al final dos
  veces: no lo repitas).
- bun para todo en movil (bunx, bun run); nunca npx ni npm. Cero dependencias.
- Rutas de jest siempre con --runTestsByPath. Comprueba que el numero de
  suites impreso es el de ficheros pedidos.
- Si el sandbox te deniega un comando, PARA y reportalo; no lo sustituyas por
  otro que haga lo mismo.
- NO rebasees, NO mergees main, NO hagas push.
- NO son tuyos, no los toques: progress/history.md, progress/current.md,
  STATUS.md y el campo `status` de feature_list.json. Tu sitio para contarlo
  todo es progress/impl_mobile-date-picker-utc-day-shift.md.
- NO abras la PR. NO marques la casilla de R8: es del humano.

== ENTORNO ==

- NO corras ./init.sh (Postgres y LocalStack compartidos con otra sesion; esta
  feature no los necesita). La linea base la midio el leader con ./init.sh
  exit=0 en 70f841f3; copiala al reporte:
    movil: 82 suites, 1471 tests
    backend unit: 170 suites, 1298 tests; infra: 2 suites, 14 tests
    e2e: 27 suites passed + 3 skipped (30), 389 tests passed + 8 skipped
- Mide tu al arrancar las bases de tasks.md "Antes de empezar" (add-reminder
  21, add-pet 20, suite 82 / 1471).
- Verificacion: SOLO los comandos de tasks.md §Cierre, desde
  mobile-pet-tracker/, sin pipe (`cmd; echo "exit=$?"`, nunca `cmd | tail`),
  incluidos los greps del helper y de las pantallas.
- Recuentos esperados al cierre: date-picker-value.test.ts 12, add-reminder
  base + 4, add-pet base + 4; suite movil 83 suites / 1491 tests.

Criterios de aceptacion: R1-R7 de requirements.md (R8 lo firma el humano).

Al terminar: escribir el resultado en progress/impl_mobile-date-picker-utc-day-shift.md
(pwd y branch, skills cargadas, bases medidas, salida de cada rojo y cada
verde con sus fallos esperados, sondas con su rojo, recuentos finales, greps
de cierre, lista de commits con hash) y parar.
```
