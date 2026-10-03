# Handoff a Codex CLI — #145 geofence-alert-consistency

> Pegar el bloque de abajo en Codex CLI. La spec esta firmada (commit de firma
> 748f160a de esta branch, aprobacion via Notion el 2026-10-01). Solo
> backend: no hay gate de dispositivo ni skills de expo.

---

```
Worktree: /home/claude/sites/Pet-Tracker-wt-backend   <- PRIMERA LINEA. Trabaja AQUI y en ningun otro sitio
Antes de tocar nada, ejecuta `pwd`, `git branch --show-current` y
`git rev-parse HEAD` y pega las tres salidas al principio de
progress/impl_geofence-alert-consistency.md. El hash es H0 (el commit que
anade este handoff). Para si la branch no es
feature/145-geofence-alert-consistency.
No toques /home/claude/sites/Pet-Tracker (es de otra sesion, con #60),
Pet-Tracker-wt-ui, pet-tracker-43 ni pt-skills, ni cambies de branch en
ningun worktree.

Feature: geofence-alert-consistency (#145)
Branch: feature/145-geofence-alert-consistency
Spec aprobada: specs/geofence-alert-consistency/requirements.md (status: approved)
Lee tambien, enteros: specs/geofence-alert-consistency/design.md, tasks.md y
traceability.md. tasks.md es tu guion paso a paso: tiene el orden, los
mensajes de commit, el codigo literal de cada verde, los rojos esperados, la
tabla de §Sondas (M1-M14) y los greps de §Cierre. Los bloques de test (arnes
y los cinco describe) estan literales en requirements.md §Requisitos
funcionales; las tres sustituciones de docs, en requirements.md §Entregable
de documentacion.

== QUE HACES ==

El DELETE de una zona cierra antes sus alertas no cerradas, en una
transaccion (hoy da un 500 por el indice anti-spam si es la segunda zona de
la mascota con alerta no cerrada). Un PATCH que cambia `active` o la
geometria (valor distinto del guardado) devuelve geofence_state a
{state:'unknown', updatedAt:null} y cierra las alertas no cerradas de la
zona, en la misma transaccion. Renombrar no reinicia nada. El contrato HTTP
no cambia.

  R1  DELETE de la segunda zona con alerta no cerrada responde 204
      (reproduce el 500 con un e2e rojo)
  R2  DELETE cierra las alertas no cerradas (open y acked) de la zona y no
      toca ninguna otra
  R3  PATCH que cambia active, en los dos sentidos, reinicia y cierra
  R4  PATCH que cambia centerLat, centerLng o radiusM reinicia y cierra
  R5  PATCH sin cambio de geometria ni de active conserva estado y alertas
      (requisito de verificacion: su rojo lleva la mutacion versionada MV,
      revertida en su verde)
  Refactor  los cuatro comentarios que #145 deja falsos
  Docs      tres sustituciones literales en docs/data-model.md
No uses numeros de linea: localiza todo con grep por contenido y las lineas
literales de tasks.md.

Ficheros que TU cambias, medidos desde H0 (`git diff --name-only H0 HEAD`):
  backend-pet-tracker/test/geofences.e2e-spec.ts
  backend-pet-tracker/src/modules/geofences/domain/repositories/geofence.repository.ts
  backend-pet-tracker/src/modules/geofences/infrastructure/repositories/geofence.drizzle.repository.ts
  backend-pet-tracker/src/modules/geofences/application/use-cases/update-geofence.use-case.ts
  backend-pet-tracker/src/modules/geofences/application/use-cases/delete-geofence.use-case.ts   (solo comentario)
  backend-pet-tracker/src/workers/alerts-engine/alerts-engine-store.ts                         (solo comentario)
  docs/data-model.md
  specs/geofence-alert-consistency/traceability.md
  progress/impl_geofence-alert-consistency.md
Nada mas (nueve ficheros). Lo demas que sale en el diff de la branch contra
origin/main son commits del leader, anteriores a ti.

Orden EXACTO de tasks.md: R1 rojo, R2 rojo, verde comun R1+R2, R3 rojo y
verde, R4 rojo y verde (ANOTA el hash del verde de R4), R5 rojo (con MV) y
verde, refactor, docs, sondas, cierre.

Mensajes de commit, LITERALES y en este orden (doce commits):
  test(geofences): reproduce the 500 on deleting a second zone with an unclosed alert (R1)
  test(geofences): expect deleting a zone to close its unclosed alerts (R2)
  fix(geofences): close a zone's unclosed alerts before deleting it (R1, R2)
  test(geofences): expect toggling active to reset the zone evaluation (R3)
  fix(geofences): reset the evaluation and close alerts when active changes (R3)
  test(geofences): expect a geometry change to reset the zone evaluation (R4)
  fix(geofences): reset the evaluation and close alerts when the geometry changes (R4)
  test(geofences): lock that a rename keeps the zone evaluation (R5)
  fix(geofences): revert the R5 probe mutation, rename keeps the evaluation (R5)
  refactor(geofences): update the comments that said nothing references geofences
  docs(data-model): describe the real anti-spam predicate and the #145 closes
  docs(geofences): fill #145 traceability
El ultimo lleva traceability.md y progress/impl_geofence-alert-consistency.md.

== CIFRAS ==

El arbol de backend-pet-tracker/ y docs/ es identico al de origin/main
3db47fb0 (el leader midio `git diff --quiet origin/main HEAD --
backend-pet-tracker docs` con exit=0 el 2026-10-01). El leader midio <e2e>
de tasks.md sobre 748f160a: 1 suite / 20 tests, exit=0. Backend unit, del
./init.sh del leader sobre 3db47fb0: 171 suites / 1307 tests, exit=0.
Cuentas esperadas de <e2e>:
  base    20/20, exit=0
  rojo R1 1 failed de 21 (el it de R1, toEqual, recibe [204, 500])
  rojo R2 3 failed de 23 (R1 sigue; las 2 filas de R2, toMatchObject)
  verde   23/23
  rojo R3 2 failed de 25 (los 2 it de R3, toMatchObject)
  verde   25/25, y tsc exit=0
  rojo R4 3 failed de 28 (las 3 filas de R4, toMatchObject)
  verde   28/28
  rojo R5 2 failed de 30 (las 2 filas de R5, toMatchObject; MV versionada)
  verde   30/30, y el use case identico al del verde de R4
  final   1 suite / 30 tests (+10); backend unit +0 suites y +0 tests
Tu medida manda: si la base no es 20 con exit=0, anota la tuya y aplica el
mismo delta. Los rojos son SOLO los it nuevos que nombra tasks.md, y todos
POR ASERCION (toEqual, toMatchObject o toBeGreaterThanOrEqual), nunca por
ReferenceError, TypeError, timeout ni error de consulta del propio test. Si
falla cualquier it de la base, PARA. En el rojo de R1 (y en las sondas M1 y
M2) la app registra un DrizzleQueryError con causa 23505 en
alert_events_open_anti_spam_idx: es el defecto, esperado, no un fallo tuyo.

Sondas: las 14 de tasks.md §Sondas, despues del commit de docs, UNA cada
vez, sobre el arbol final. Si alguna no da exactamente sus «Rojos
esperados», PARA y reportalo con el log. No ajustes ninguna asercion para
que cuadre.

== REGLAS CRITICAS ==

- Arquitectura: docs/architecture.md. Convenciones: docs/conventions.md.
- Skills: ninguna. Es solo backend; no cargues skills de expo. Dilo en el
  reporte.
- TEST PRIMERO (C4 de CHECKPOINTS.md): por requisito, un commit ROJO (solo
  el e2e; en R5 ademas MV) y un commit VERDE (solo produccion). Doce
  commits, no uno: tests + implementacion + docs en un solo commit incumple
  C4 (paso en #19).
- Cada helper del arnes entra en el commit rojo que lo usa por primera vez
  (tabla de tasks.md §Orden): el lint marca como error una variable sin
  usar. Al cierre, el orden de los helpers es el de requirements.md §Arnes.
- El verde de R3 cambia la firma del puerto: puerto, repositorio y caso de
  uso van en el MISMO commit, o tsc se rompe (ts-jest no lo ve:
  isolatedModules).
- Verde de R5: devuelve el use case al verde de R4 con
  `git show <hash verde R4>:<ruta> > <ruta>` o a mano. NUNCA
  `git checkout <hash> -- <ruta>`. Comprueba
  `git diff <hash verde R4> -- <ruta>; echo "exit=$?"` sin salida.
- Sin comentarios nuevos en produccion salvo los cuatro del refactor. Sin
  dependencias nuevas, sin migraciones, sin tocar src/db/,
  src/modules/alerts/, el controlador, los DTO, el mapper, la entidad,
  geofences.module.ts, otros ficheros de test/, ningun .spec.ts,
  package.json, pnpm-lock.yaml, infra/ ni mobile-pet-tracker/. Ningun it ni
  describe existente se edita.
- `pnpm -C backend-pet-tracker run lint` lleva --fix: correlo ANTES de cada
  commit y commitea el formato con su paso.
- Rellena specs/geofence-alert-consistency/traceability.md con los hashes,
  sin ninguna fila «pendiente», solo en el ultimo commit. No rebasees
  despues de escribir hashes.
- No crees recursos AWS ni corras cdk.
- NO son tuyos, no los toques: progress/history.md, progress/current.md,
  STATUS.md y feature_list.json. Son artefactos del leader. Todo lo que
  tengas que contar va en progress/impl_geofence-alert-consistency.md.
- Si el sandbox te deniega un comando, PARA y reportalo. No lo sustituyas por
  otro que haga lo mismo con otra herramienta.
- NO abras la PR ni hagas push: lo hace el leader al cerrar.

== ENTORNO ==

- Todo con pnpm, como en tasks.md (`pnpm -C backend-pet-tracker ...` desde la
  raiz del repo). <e2e> es:
    pnpm -C backend-pet-tracker exec jest --config ./test/jest-e2e.json test/geofences.e2e-spec.ts; echo "exit=$?"
  Usa solo Postgres, la base de este worktree (pet_tracker_wt en el 5433,
  via el .env de la raiz). No toques .env, no levantes contenedores ni
  migres: si <e2e> falla sin llegar a correr tests (ECONNREFUSED, relacion
  inexistente), PARA y pide al humano.
- Antes de empezar: `pgrep -af 'init\.sh|test:e2e|jest-e2e'` no debe listar
  nada aparte del propio pgrep. Si lista algo, PARA y avisa al humano.
- NO lances ./init.sh, `pnpm run test:e2e` entero ni ninguna otra suite e2e
  (alerts-engine, alerts-center-notifier, ingestion...): comparten
  LocalStack con la sesion de #60 y las corre el leader al cierre. Se mide
  con <e2e>, `pnpm -C backend-pet-tracker test`, tsc y lint.
- Mide SIN pipe: `cmd > fichero 2>&1; echo "exit=$?"`. `cmd | tail` devuelve
  el codigo de tail. Los logs de /tmp no se versionan: copia sus lineas de
  resumen al reporte.
- En las SONDAS restaura SIEMPRE con `git checkout HEAD -- <ruta>`, nunca con
  `git checkout <commit> -- <ruta>` (deja la mutacion en el indice), ni git
  stash ni rm -f. Tras cada sonda, `git diff --exit-code` y
  `git diff --cached --exit-code` en 0, y `git status --short` vacio.

Criterios de aceptacion: R1-R5 de requirements.md, mas el refactor y el
entregable de documentacion con sus greps.

Al terminar, escribe progress/impl_geofence-alert-consistency.md con: pwd,
branch y H0; skills cargadas (ninguna); el pgrep inicial; las bases medidas
(<e2e> y backend unit) con exit; los doce commits con hash y R-id; cada
rojo con sus cuentas, exit, sus it, su matcher, `Expected` y `Received`, y
cada verde con sus cuentas y exit; el git diff del verde de R5 contra el
verde de R4; la tabla de las 14 sondas con exit, cuentas, cada it rojo, su
matcher y si es por asercion; los greps de §Cierre (repositorio, puerto y
use case, comentarios y docs/data-model.md) con su salida; tsc y lint con
su exit y el git status --short posterior; el
`git diff --stat origin/main...HEAD -- backend-pet-tracker` y el
`git diff --stat H0..HEAD -- docs`; los recuentos finales y el delta sobre
tu base; y cualquier decision que la spec no cerrara literalmente.
```
