# Handoff a Codex CLI — #95 ronda 2 (rebote por B1)

> Pegar el bloque de abajo en Codex CLI. No hace falta firma nueva: la spec no
> cambia. Lo que se corrige es un test que se queda corto frente a lo que la
> spec ya prescribe.

---

```
Worktree: /home/claude/sites/Pet-Tracker   <- PRIMERA LINEA. Trabaja AQUI y en ningun otro sitio
Antes de tocar nada, ejecuta `pwd` y `git branch --show-current` y anade las dos
salidas a progress/impl_mobile-detail-screens-to-stack.md, en una seccion nueva
"Ronda 2". Para si la branch no es feature/95-mobile-detail-screens-to-stack.
No toques /home/claude/sites/Pet-Tracker-wt-backend (otra sesion trabaja alli en
#113) ni cambies de branch en ningun worktree.

Feature: mobile-detail-screens-to-stack (#95), RONDA 2
Branch: feature/95-mobile-detail-screens-to-stack (HEAD de tu ronda 1: f9a22dd1)

El reviewer RECHAZO la ronda 1 con un bloqueante de codigo. El veredicto completo
esta en progress/review_mobile-detail-screens-to-stack.md: leete §Mutaciones y
§Observaciones 1. Tu ronda 1 se conserva entera salvo DOS `it`. No rehagas nada
mas.

== B1 — R5 NO MIRA EL ESTADO CARGADO EN weight-log NI EN meal-schedule ==

R5 exige que el boton de volver y el titulo del cuerpo no aparezcan "WHEN se
renderiza cualquiera de las seis pantallas", y tasks.md R5 (1) pide un `it` que
"renderiza la pantalla en su estado cargado habitual del fichero". Dos de tus
seis `it` renderizan solo la CARGA:

  - mobile-pet-tracker/src/screens/weight-log/index.test.tsx,
    describe `#95 R5: la pantalla no dibuja cabecera propia`: usa
    `mockListWeights.mockReturnValue(pending<WeightsState>())`.
  - mobile-pet-tracker/src/screens/meal-schedule/index.test.tsx, el mismo
    describe: usa `pending(...)` en `mockGetNutritionPlan` y
    `mockGetNutritionProfile`.

Por eso sobreviven, con la suite verde, tres mutaciones del reviewer en la rama
CARGADA:
  M20  `<Text>{t('weightLog.weightLog')}</Text>` dentro de la rama de
       `weight-chart-card` (weight-log)
  M21  `<Text>{t('mealSchedule.mealSchedule')}</Text>` dentro de la rama
       `loadedPlan !== null` (meal-schedule)
  M22  un nodo `testID="weight-log-back"` dentro de la rama cargada (weight-log)

Arreglo (solo tests, la produccion ya es correcta):
  - En esos dos `it`, resuelve los datos con el fixture CARGADO que el propio
    fichero ya usa en otros `it`. En weight-log es `mockListWeights.mockResolvedValue`
    con `kind: 'ok'` y AL MENOS un peso, para que se pinte `weight-chart-card`. En
    meal-schedule es `mockGetNutritionPlan.mockResolvedValue({ kind: 'ok', plan:
    makePlan() })` mas su perfil `ok`, calcado del `it` de ese fichero que ya lo
    hace. Localizalos con grep; no copies mocks de otras suites.
  - Espera con `findByTestId` a un nodo del estado cargado (`weight-chart-card` /
    `meal-schedule-summary`) ANTES de aseverar las dos ausencias (boton de volver
    y titulo del cuerpo). Regla de docs/conventions.md §Esperas sobre el arbol
    renderizado: esperar al nodo, no a una llamada al mock.
  - No quites ninguna asercion que ya exista en esos `it`: si hoy asevera algo en
    carga que siga teniendo sentido, se queda.
  - NO anadas ni quites ningun `it`. Delta de tests: CERO (siguen 80 suites / 1426).

== COMMITS (C4 via b: la produccion ya existe) ==

Un test sobre produccion correcta no puede ponerse rojo por si solo, asi que el
rojo es una MUTACION de produccion, versionada y revertida, que es la via (b) de
C4 en CHECKPOINTS.md:
  1. Commit ROJO `test(detail-stack): R5 mira el estado cargado en weight-log y
     meal-schedule (R5)`: los dos `it` corregidos + las mutaciones M20 y M21
     aplicadas en produccion. Los dos `it` corregidos fallan POR SU ASERCION de
     ausencia (no por timeout ni por un nodo que no aparece). Guarda la linea de
     fallo de cada uno.
  2. Commit VERDE `fix(detail-stack): revierte las mutaciones de la sonda de R5
     (R5)`: revierte M20 y M21. El diff neto de produccion de los dos commits
     juntos es VACIO: compruebalo con
     `git diff f9a22dd1 HEAD -- mobile-pet-tracker/src/screens/weight-log/index.tsx mobile-pet-tracker/src/screens/meal-schedule/index.tsx`
     que debe salir vacio.
  3. Sin commitear: aplica M22 en local, comprueba que pone rojo el `it` de
     weight-log, reviertelo y apunta el resultado en el reporte.
Actualiza specs/mobile-detail-screens-to-stack/traceability.md (fila de R5 con los
dos hashes nuevos) en el mismo commit verde o en uno de docs detras.

== QUE NO TOCAS ==

- Nada de R1-R4, R6-R8, A11 ni del resto de R5 (add-reminder, add-pet, docs y
  pairing ya renderizan su estado real y el reviewer los dio por buenos).
- El `describe('#95 R8: ...')` anidado de pairing (Observacion 4) y la sangria
  de (tabs)/_layout.tsx (Observacion 7): no bloquean, se quedan como estan.
- Ningun fichero de produccion en el diff neto de la ronda.
- progress/history.md, progress/current.md, STATUS.md y el `status` de
  feature_list.json NO son tuyos. No abras PR ni hagas push.

== ENTORNO ==

- Todo desde mobile-pet-tracker/. bun / bunx. Nunca npx.
- `rm -f .expo/types/router.d.ts` antes de cada `bunx tsc --noEmit`.
- Rutas de jest con --runTestsByPath o con los parentesis escapados.
- Mide SIN pipe: `cmd > fichero; echo "exit=$?"`.
- NO lances ./init.sh ni toques Postgres o LocalStack.

== CIERRE ==

  bunx jest --silent -> exit=0, 80 suites, 1426 tests (delta CERO respecto a la ronda 1)
  rm -f .expo/types/router.d.ts; bunx tsc --noEmit -> exit=0, salida vacia
  bunx expo lint -> exit=0, salida vacia
  diff neto de produccion de la ronda vacio (comando de arriba)

En progress/impl_mobile-detail-screens-to-stack.md, seccion "Ronda 2": pwd y
branch, los dos hashes con la linea de fallo de cada `it` en el rojo, M22 rojo
en local, y las salidas del cierre. Corrige tambien la frase de la ronda 1 que
decia que traceability.md "se actualizo despues de cada commit": solo se toco en
f9a22dd1 (Observacion 6 del reviewer).
```
