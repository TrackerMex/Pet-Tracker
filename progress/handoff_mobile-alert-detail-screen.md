# Handoff a Codex CLI — #100 mobile-alert-detail-screen

> Pegar el bloque de abajo en Codex CLI. La spec esta firmada: commit de firma
> `cf52c00f` de esta branch, aprobacion via Notion el 2026-09-28, con las
> cuatro casillas (A15, A16, A17 y la spec con P1-P7). Base: merge 93925e0e.

---

```
Worktree: /home/claude/sites/Pet-Tracker-wt-backend   <- PRIMERA LINEA. Trabaja AQUI y en ningun otro sitio
Antes de tocar nada, ejecuta `pwd` y `git branch --show-current` y pega las dos
salidas al principio de progress/impl_mobile-alert-detail-screen.md.
Para si la branch no es feature/100-mobile-alert-detail-screen.
No toques /home/claude/sites/Pet-Tracker (la sesion Frontend trabaja ahi #130
ahora mismo), Pet-Tracker-wt-ui, pet-tracker-43, pt-skills ni ningun worktree
bajo /tmp. No cambies de branch en ningun worktree. No hagas fetch, merge ni
rebase de main: si main se mueve, lo integra el leader despues.

Feature: mobile-alert-detail-screen (#100), branch: feature/100-mobile-alert-detail-screen
Spec aprobada: specs/mobile-alert-detail-screen/requirements.md (status: approved)
Lee tambien, enteros: specs/mobile-alert-detail-screen/design.md, tasks.md y
traceability.md. tasks.md es tu guion paso a paso: orden, que falla en cada
rojo, comandos y mensajes de commit. design.md tiene el codigo de referencia
(D1-D7), los dobles y el reparto de tests (D8) y el inventario de aserciones
heredadas que cambian (D9).

== QUE HACES ==

Hoy el toque de una push de alerta lleva siempre al centro de alertas y la
fila del centro no navega: no hay pantalla de detalle. #100 la crea como ruta
`alerts/[alertId]` del Stack.Protected raiz (singular, cabecera nativa), la
alimenta de la cache del listado que ya existe (sin endpoint nuevo), hace que
la columna de texto de cada fila la abra y que el toque de la push abra ESA
alerta. Cero dependencias nuevas, cero cambios de backend.
  R1  tres claves de copy (catalogo 306 -> 309)
  R2  route delgado + noveno Stack.Screen, dangerouslySingular
  R3  la tarjeta desde la cache (useAlertsList, alertTypeMeta)
  R4  carga, error y salida sin la alerta (dismissTo('/alerts') una vez)
  R5  marcar leida desde el detalle
  R6  la columna de texto de la fila es un Pressable que abre el detalle
  R7  notificationHref: con data.alertId string no vacio, al detalle
  R8  ida y vuelta con pantallas reales       (rojo por ruta b, mutacion)
  R9  #114 R3 vacia temporizadores            (rojo por ruta b, mutacion M7)
  R10 tabla de copy R13_ALERT_DETAIL          (rojo por ruta b, mutacion)
  Prueba de humo: la corre el humano. NO es tuya, no marques su casilla.
No uses numeros de linea: localiza todo por contenido, como indican la spec y
tasks.md.

Orden EXACTO de tasks.md. Un commit por paso, test primero, NUNCA test e
implementacion en el mismo commit (en #19 Codex metio todo en uno y eso
incumple C4 de CHECKPOINTS.md). Cada rojo tiene que fallar POR SU ASERCION,
nunca por un modulo inexistente, un ReferenceError o un TypeError. En R8, R9 y
R10 el rojo versiona en PRODUCCION la mutacion declarada y el verde la
revierte; el verde deja el fichero byte a byte como estaba antes del rojo
(compruebalo con `git diff --exit-code <hash del verde anterior> HEAD -- <fichero>`).

Mensajes de commit, LITERALES y en este orden:
  docs(specs): apply amendments A15-A17 of #100
  test(alert-detail): three copy keys for the alert detail (R1)
  feat(alert-detail): add the alert detail copy keys (R1)
  test(alert-detail): the alert detail route lives on the root stack (R2)
  feat(alert-detail): declare alerts/[alertId] as a singular root route (R2)
  test(alert-detail): the detail renders the cached alert (R3)
  feat(alert-detail): render the alert card from the list cache (R3)
  test(alert-detail): loading, error and exit without the alert (R4)
  feat(alert-detail): show loading and error states and leave when the alert is gone (R4)
  test(alert-detail): acknowledge the alert from the detail (R5)
  feat(alert-detail): acknowledge the alert from the detail (R5)
  test(alerts): the row text column opens its detail (R6)
  feat(alerts): link each row to its alert detail (R6)
  test(push): the notification tap opens its alert detail (R7)
  feat(push): open the tapped alert detail (R7)
  test(alert-detail): round trip from a second-page row (R8, plants mutation: found reads pages[0] only)
  feat(alert-detail): search every cached page for the alert (R8)
  test(reminders-alerts-stack): flush timers before asserting the stack (R9, plants mutation M7)
  fix(reminders-alerts-stack): keep alerts singular (R9)
  test(alert-detail): the detail resolves its copy by key (R10, plants mutation: retry key through a constant)
  feat(alert-detail): resolve the retry label by literal key (R10)
  docs(alert-detail): fill #100 traceability
En R8, R9 y R10 el asunto del rojo ya nombra la mutacion plantada.

Enmiendas (paso 0): aplica LITERAL los tres bloques de requirements.md
§Enmiendas con `<fecha>` = 2026-09-28 (fecha del commit de firma cf52c00f)
en los tres. Comprobaciones de tasks.md §Paso 0 antes de commitear.

Si un rojo no falla exactamente como dice tasks.md (otro test, otra asercion,
otro numero de fallos), PARA y reportalo con el log. No ajustes el test para
que cuadre. Excepciones ya declaradas: en R4 el it de `unauthorized` puede salir
verde en el rojo, y en R7 las 8 filas que esperan '/alerts' pueden salir
verdes (candado de que el toque sin id no cambia).

Tras el verde de R7, ademas del comando de tasks.md, corre y reporta:
  bunx jest --runTestsByPath 'src/hooks/use-push-registration.navigation.test.tsx' > /tmp/r7c.log 2>&1; echo "exit=$?"
  -> exit=0, 1 suite. Ese fichero toca con `data: {}` y espera '/alerts'; la
  spec no lo cita, pero D5 lo deja verde (`response.notification?.`). Si sale
  rojo, PARA.

Medicion M-P1 (tras el verde de R2): la regla esta en requirements.md
§Verificacion. Si alguno de los tres ficheros sale rojo PORQUE su routes() no
sabe pintar alerts/[alertId], anade a ese routes() la misma rama de stub que
ya da a las rutas que no ejercita, en el mismo commit verde de R2, y anotalo
en el reporte y en design.md D9. Cualquier otro rojo: PARA.

Ficheros que cambian en el diff acumulado (y ninguno mas):
  mobile-pet-tracker/src/app/alerts/[alertId].tsx                      (nuevo)
  mobile-pet-tracker/src/screens/alert-detail/index.tsx                (nuevo)
  mobile-pet-tracker/src/screens/alert-detail/index.test.tsx           (nuevo)
  mobile-pet-tracker/src/utils/alert-meta.ts                           (nuevo)
  mobile-pet-tracker/src/hooks/use-alerts-list.ts                      (nuevo)
  mobile-pet-tracker/src/app/__tests__/alert-detail.notification.test.tsx (nuevo)
  mobile-pet-tracker/src/app/__tests__/alert-detail.navigation.test.tsx   (nuevo)
  mobile-pet-tracker/src/app/_layout.tsx
  mobile-pet-tracker/src/screens/alerts/index.tsx
  mobile-pet-tracker/src/screens/alerts/index.test.tsx
  mobile-pet-tracker/src/hooks/use-push-registration.ts
  mobile-pet-tracker/src/hooks/use-push-registration.test.tsx
  mobile-pet-tracker/src/app/__tests__/layout.test.tsx
  mobile-pet-tracker/src/app/__tests__/detail-stack.test.tsx
  mobile-pet-tracker/src/app/__tests__/reminders-alerts-stack.notification.test.tsx
  mobile-pet-tracker/src/i18n/catalog.ts
  mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx
  mobile-pet-tracker/src/__tests__/ui-copy-table.ts
  mobile-pet-tracker/src/__tests__/ui-language.test.ts
  mobile-pet-tracker/src/__tests__/design-drift.test.ts
  docs/conventions.md, docs/ui-guidelines.md                          (solo A15)
  specs/mobile-push-registration/requirements.md                      (solo A16)
  specs/mobile-alerts-center/requirements.md                          (solo A17)
  specs/mobile-ui-language/design.md                                  (solo R1, §2.14)
  specs/mobile-alert-detail-screen/traceability.md                    (commit final)
  specs/mobile-alert-detail-screen/design.md                          (solo si M-P1 obliga)
  progress/impl_mobile-alert-detail-screen.md                         (commit final)
Mas los tres routes() de M-P1 solo si esa medicion lo obliga.

== REGLAS CRITICAS ==

- Arquitectura: docs/architecture.md. Convenciones: docs/conventions.md. UI
  movil: docs/ui-guidelines.md (gate C8 del reviewer): className con Uniwind,
  nada de StyleSheet.create, ningun hex fuera de src/theme/, ninguna clase
  arbitraria (`<palabra>-[`), metricas via la excepcion A11 (la amplia A15).
- Skills: carga `building-native-ui` y `native-data-fetching` (plugin expo de
  tu catalogo, v1.0.2) y `appllama-app-design-skill` (de .agents/skills/,
  obligatoria por la carta al crear una pantalla). NO hay skill de router en
  tu catalogo: no pidas `expo-router`, `expo-overview` ni `expo-native-ui`,
  no existen para ti. La guia de rutas, pila y navegacion esta escrita en
  design.md D1, D3, D5 y D6 y §1 (sondas S1-S5). Las decisiones de diseno ya
  estan cerradas en la spec (P1-P7, D1-D10): las skills son contexto, no te
  autorizan a cambiar clases, anatomia, copy ni testID. Di en el reporte
  cuales cargaste.
- Tests de navegacion con renderRouter: UN SOLO `it` por fichero,
  `afterEach(() => jest.useRealTimers())` y
  `jest.mock('standard-navigation', () => ({}))` (design.md §1 y D8).
- Cada asercion que dependa de una consulta con `enabled` condicional va
  DENTRO del waitFor (docs/conventions.md §Tests; la carrera de #129).
- Valores esperados LITERALES en los tests (testID, clases, copy, fechas): no
  los calcules con nada importado de produccion. Las tablas de fechas de R3
  cruzan mes y ano a proposito: no las cambies.
- En los tests NO escribas `#` + numero salvo como `#100 R<n>` (o los
  `#<id> R<n>` que ya existen): una cita suelta pone rojos los guards de
  src/__tests__/design-drift.test.ts.
- NO toques: package.json, bun.lock, app.json, backend-pet-tracker/, infra/,
  init.sh, CI, src/app/alerts/_layout.tsx (no se crea). Cero dependencias
  nuevas. No anadas tests colocados a alert-meta.ts ni a use-alerts-list.ts
  (P7). No unifiques el switch de ackAlert del centro y del detalle (deuda).
- Rellena specs/mobile-alert-detail-screen/traceability.md con los hashes
  rojo -> verde de R1-R10 y el de A15-A17, sin ninguna «pendiente», en el
  commit final. No rebasees despues de escribir hashes.
- No crees recursos AWS ni corras cdk.
- NO son tuyos, no los toques: progress/history.md, progress/current.md,
  STATUS.md y feature_list.json. Son artefactos del leader, que los escribe
  despues del veredicto del reviewer. Todo lo que tengas que contar va en
  progress/impl_mobile-alert-detail-screen.md.
- Si el sandbox te deniega un comando, PARA y reportalo. No lo sustituyas por
  otro que haga lo mismo con otra herramienta.
- NO abras la PR ni hagas push: lo hace el leader al cerrar.

== ENTORNO ==

- Jest, tsc y lint desde mobile-pet-tracker/ (los candados abren rutas
  relativas a process.cwd()). Los git y grep con rutas mobile-pet-tracker/...
  desde la raiz del repo. bun / bunx. Nunca npx, nunca npm i -g.
- Antes de cada `bunx tsc --noEmit`: `test ! -e .expo/types/router.d.ts; echo "exit=$?"`.
  exit=0: sigue. exit=1: PARA y pide al humano que lo borre. Nunca `rm -f` ni
  otra forma de borrarlo (el leader midio exit=0 en este worktree el
  2026-09-28).
- Jest siempre con --runTestsByPath, salvo la suite completa, y cada ruta
  ENTRE COMILLAS SIMPLES: `[alertId]` y `(tabs)` sin comillas son patrones y
  jest salta el fichero en silencio con exit=0. Comprueba que el numero de
  suites que imprime jest es el de ficheros pedidos.
- Mide SIN pipe: `cmd > fichero 2>&1; echo "exit=$?"`. `cmd | tail` devuelve el
  codigo de tail. Los logs de /tmp no se versionan: copia sus lineas de
  resumen al reporte.
- NO lances ./init.sh ni e2e, ni toques Postgres o LocalStack: son compartidos
  con los otros worktrees. Se mide con bunx jest, bunx tsc --noEmit y
  bunx expo lint.

== BASE Y CIERRE ==

Base: 93925e0e, merge de origin/main 3cf09ca5 (#74, PR #170) sobre la firma
cf52c00f. Frente a a9965ee3, donde midio el spec_author, solo cambian
src/screens/home/weekly-activity-chart.tsx y su test (#74, +5 tests); docs/
igual y ninguno de los ficheros de #100. Medido por el leader el 2026-09-28:
  git rev-parse HEAD:mobile-pet-tracker/src/app/_layout.tsx
    -> 84059b575560b99c400dbc5363cb9aed3b5f262f
  git rev-parse HEAD:mobile-pet-tracker/src/screens/alerts/index.tsx
    -> 7b89deb42bf50527639177b848fdf1178876e2d8
  git rev-parse HEAD:mobile-pet-tracker/src/i18n/catalog.ts
    -> b675534de09d6bd5a19bbd2b17156d925230b5a3
  Si alguno es otro, PARA.
  Suite completa en a9965ee3 (spec_author, sin pipe): 83 suites, 1545 tests,
  1 snapshot, exit=0. Con #74 encima se espera 83 suites, 1550 tests,
  1 snapshot (cierre de #74). tsc y lint: exit=0, salida de 0 bytes.
Vuelve a medirla al empezar (tasks.md §Antes de empezar). Si difiere, vale TU
base: el gate es el delta.
Cierre esperado: +3 suites y +45 tests sobre tu base (sobre 83/1550: 86
suites, 1595 tests), ninguna suite de verde a roja; tsc y lint exit=0 y 0 bytes; las
comprobaciones de requirements.md §Verificacion con el resultado indicado.

Criterios de aceptacion: R1-R10 de requirements.md (la prueba de humo es del
humano).

Al terminar, escribe progress/impl_mobile-alert-detail-screen.md con: pwd y
branch; skills cargadas; la base medida (blobs y recuentos); los commits por
R-id con hashes; cada rojo con sus fallos, `Expected` y `Received`; las tres
mutaciones plantadas y revertidas (R8, R9, R10) con el diff --exit-code de
cada reversion; en R9, la linea del log que prueba que falla la asercion de
pila tras el segundo toque y no el back posterior; M-P1 con su comando,
salida y lo que hiciste; los comandos y salidas exactas del cierre; el delta;
y cualquier decision que la spec no cerrara literalmente.
```

---

## Reanudacion 1 (2026-09-28): parada en el rojo de R5

Diagnostico del leader sobre `/tmp/r5.log` y el reporte de Codex. Los 10
fallos previstos salieron tal cual. El undecimo es un defecto del test de R3
commiteado en `12f07895`, no de la spec ni de R5:
`it('respeta las métricas A11 bajo cabecera nativa')` espera
`findByTestId('screen-alert-detail')`, que ya existe mientras la pantalla
carga, y despues lee `getByTestId('alert-detail-card')` sin esperar a
`listAlerts`. Es la carrera que prohibe docs/conventions.md §Tests. En R3 y R4
salio verde por el orden de las tareas. El log lo muestra: Received una
pantalla con `alert-detail-loading`. Ningun otro test del fichero lee la
tarjeta sin esperarla. Parar ahi fue lo correcto.

Pegar en Codex:

```
Worktree: /home/claude/sites/Pet-Tracker-wt-backend   <- PRIMERA LINEA
Confirma `pwd` y `git branch --show-current` (feature/100-mobile-alert-detail-screen)
y que HEAD es a9cd5edb, o el commit del leader que anade esta seccion al
handoff encima de a9cd5edb. Si no, PARA.
Siguen vigentes todas las reglas del bloque original de
progress/handoff_mobile-alert-detail-screen.md.

1. Aparta los cambios sin commitear de R5 con `git stash push -- mobile-pet-tracker`
   (el reporte progress/impl_mobile-alert-detail-screen.md se queda fuera del
   stash). `git status --short -- mobile-pet-tracker` debe salir vacio.
2. En src/screens/alert-detail/index.test.tsx, SOLO el it
   'respeta las métricas A11 bajo cabecera nativa': espera primero la tarjeta
   (`const card = await screen.findByTestId('alert-detail-card');`) y lee
   despues la raiz con `screen.getByTestId('screen-alert-detail')`. Mismas
   aserciones, mismos literales, mismo nombre del it. Nada mas en el fichero.
   bunx jest --runTestsByPath 'src/screens/alert-detail/index.test.tsx' > /tmp/r3fix.log 2>&1; echo "exit=$?"
   -> exit=0, 1 suite. Commit (test-only, sin cambio de produccion):
   test(alert-detail): wait for the card before reading the A11 metrics (R3)
3. `git stash pop`. Si hay conflicto, PARA. Vuelve a correr el comando del
   rojo de R5 de tasks.md: exit=1, 2 suites y EXACTAMENTE los 10 fallos
   previstos (9 de #100 R5 + 'preserves every mutation sign-out with zero
   delta'). Si sale cualquier otro, PARA. Despues sigue el guion desde el
   commit rojo de R5 hasta el final, sin cambios.
4. En el reporte, en §Desviaciones: el commit extra con su hash y el motivo,
   el log del primer rojo de R5 (11 fallos) y el del segundo (10). En
   traceability.md, anota el commit extra en la fila de R3 como correccion de
   test posterior al verde. Si la linea `A worker process has failed to exit
   gracefully` vuelve a salir en la suite de cierre, copiala al reporte; no la
   persigas.
```

---

## Reanudacion 2 (2026-09-28): parada en el rojo de R7

Diagnostico del leader sobre `/tmp/r7.log`. El `it` nuevo de
`src/app/__tests__/alert-detail.notification.test.tsx` falla como estaba
previsto (Expected `/alerts/alert-1`, Received `/alerts`). Las diez filas de
`#100 R7` en `src/hooks/use-push-registration.test.tsx` fallan antes de llegar
a sus aserciones, por un problema de orden en el fichero y no por la spec:

- El `it('no accede a expo-notifications al importar el modulo')` del
  describe `R15` llama a `jest.resetModules()` y a
  `jest.doMock('expo-notifications', <Proxy que lanza>)`. Ese factory queda
  registrado para el resto del fichero.
- El hook hace `require('expo-notifications')` en tiempo de ejecucion (linea
  del `require` en `use-push-registration.ts`), asi que cualquier describe que
  corra despues de `R15` recibe el Proxy.
- `R15` era el ultimo describe y `#100 R7` quedo detras. design.md D8 no fijaba
  el sitio.

Parar fue lo correcto. El arreglo va dentro del mismo rojo, todavia sin
commitear, asi que no hace falta un commit extra.

Pegar en Codex:

```
Worktree: /home/claude/sites/Pet-Tracker-wt-backend   <- PRIMERA LINEA
Confirma `pwd` y `git branch --show-current` (feature/100-mobile-alert-detail-screen)
y que HEAD es f1149451, o el commit del leader que anade esta seccion encima
de f1149451. Si no, PARA.
Siguen vigentes todas las reglas del bloque original de
progress/handoff_mobile-alert-detail-screen.md.

1. En src/hooks/use-push-registration.test.tsx, mueve el describe
   '#100 R7: el toque abre el detalle de su alerta' ENTERO, sin cambiarle ni
   un caracter, justo detras del describe
   'R10: banner en primer plano y tap que navega a /alerts' (antes de
   '#99 R1: ...'). R15 vuelve a quedar como ultimo describe del fichero. No
   toques R15 ni ningun otro describe.
2. Repite el comando del rojo de R7 de tasks.md: exit=1, 2 suites y
   EXACTAMENTE 3 fallos, las 2 filas con alertId 'alert-9' (hot y cold) por
   su asercion de navegacion, y el it de alert-detail.notification.test.tsx.
   Las otras 8 filas en verde. Si sale cualquier otra cosa, PARA.
   Commit rojo de R7 con su mensaje literal y sigue el guion hasta el final
   (sigue en pie la corrida extra de use-push-registration.navigation.test.tsx
   tras el verde de R7).
3. En el reporte, en §Desviaciones: el primer rojo (11 fallos, Expo Go por el
   doMock de R15) y el segundo (3), con el motivo. Anade una observacion para
   el reviewer: R15 deja registrado su doMock de expo-notifications y obliga a
   que sea el ultimo describe del fichero; no lo arregles, es candidato a
   deuda y lo decide el humano.
```

---

## Reanudacion 3 (2026-09-28): parada en R8

Diagnostico del leader sobre `/tmp/r8*.log` y el reporte de Codex:

- **Rojo versionado `4f848e56`**: correcto (1 fallo, 25 verdes).
- **Verde con temporizadores falsos**: falla porque el harness de pruebas no
  vuelve a pintar, no por la produccion. Tras «Marcar leida», `ackAlert`
  devuelve `ok` y `setAcked` se ejecuta (`r8debug.log`: `r8-debug-ack ok acked`),
  pero el detalle no vuelve a pintarse. Hay avisos de `overlapping act()` y de
  «not configured to support act» justo en `setAcked`. El cambio de estado se
  queda en una cola de `act` que nunca se vacia bajo `renderRouter` con
  temporizadores falsos. R5, en la prueba unitaria, cubre el mismo flujo en
  verde.
- **Por que la spec no lo vio**: la sonda S3 del spec_author marcaba la alerta
  en el servidor y no pulsaba el boton del detalle, porque el detalle aun no
  existia. design.md D8 no fija la sincronizacion, asi que elegirla es tuyo.
- **Variante valida**: la de `/tmp/r8probe15.log` (temporizadores reales y un
  `QueryClient` de vida corta) pasa.
- **Rojo de la segunda comprobacion** (`/tmp/r8red-recheck.log`): falla en
  `findByTestId('alert-detail-ack')`, y el arbol impreso es el centro (cabecera
  «Alertas»). El detalle no encontro la alerta y salio: es lo que describe
  tasks.md R8, que no fija la linea que falla. Con temporizadores reales, la
  ruta `/alerts/alert-2` existe un instante antes del `dismissTo`, asi que
  cualquiera de las dos lineas puede ser la que falle.
- Parar fue lo correcto con la regla que te di. La regla se amplia aqui solo
  para R8.

Pegar en Codex:

```
Worktree: /home/claude/sites/Pet-Tracker-wt-backend   <- PRIMERA LINEA
Confirma `pwd` y `git branch --show-current` (feature/100-mobile-alert-detail-screen)
y que HEAD es 4f848e56, o el commit del leader que anade esta seccion encima
de 4f848e56. Si no, PARA.
Siguen vigentes todas las reglas del bloque original de
progress/handoff_mobile-alert-detail-screen.md.

1. La mutacion de R8 sigue plantada, como en 4f848e56; no la toques todavia.
   En src/app/__tests__/alert-detail.navigation.test.tsx, y solo ahi, vuelve a
   aplicar la sincronizacion de /tmp/r8probe15.log (temporizadores reales y un
   QueryClient de vida corta). Limites:
   - mismo describe, mismo nombre del unico it, mismos literales y las mismas
     aserciones de D8: «Leida» en el detalle, fila «Leida» sin boton al
     volver, y alert-404 que vuelve a '/alerts' con una sola entrada `alerts`;
   - se quedan jest.mock('standard-navigation', () => ({})) y
     afterEach(() => jest.useRealTimers()), y los dobles de D8 no cambian;
   - si el QueryClient de vida corta necesita un doble, que sea solo de
     `createQueryClient` (src/providers/query-provider), construido con el
     `createQueryClient` real y solo `gcTime` cambiado;
   - ningun cambio de produccion ademas de la mutacion plantada.
2. Rojo con la mutacion aun plantada: el comando de tasks.md R8 da exit=1,
   2 suites y EXACTAMENTE 1 fallo, en el it nuevo; los 25 del detalle, verdes.
   Valen las dos lineas que siguen, y ninguna otra:
   (a) waitFor de getPathname() con Expected '/alerts/alert-2', Received '/alerts';
   (b) findByTestId('alert-detail-ack') con "Unable to find", siempre que el
       arbol impreso sea el centro (cabecera "Alertas" y alert-row-alert-1)
       y no el detalle cargando.
   Cualquier otra cosa: PARA. Commit:
   test(alert-detail): drive the round trip with real timers (R8, keeps mutation: found reads pages[0] only)
3. Verde: revierte la mutacion.
   `git diff --exit-code 9664ca9b HEAD -- mobile-pet-tracker/src/screens/alert-detail/index.tsx`
   debe salir vacio tras el commit. Corre el comando de tasks.md R8 TRES veces,
   cada una con su log (/tmp/r8g1.log, /tmp/r8g2.log, /tmp/r8g3.log): exit=0
   las tres. Si alguna sale roja, PARA. Commit literal:
   feat(alert-detail): search every cached page for the alert (R8)
4. Sigue el guion con R9, R10 y el cierre, sin cambios.
5. En el reporte, §Desviaciones R8:
   - por que fallan los temporizadores falsos (con la lista de probes y lo que
     descarto cada uno);
   - el diff exacto de la sincronizacion contra 4f848e56;
   - la linea en que fallo el rojo, (a) o (b), con el arbol si es (b);
   - las tres corridas verdes;
   - cuantos avisos de act quedan en el verde.
   En traceability.md, la fila de R8 con los dos commits rojos y el verde.
```

---

## Reanudacion 4 (2026-09-28): segunda parada en el rojo adicional de R8

Diagnostico del leader sobre `/tmp/r8red3final.log`, el diff sin commitear y
el reporte de Codex:

- **R8** fallo por la linea (b) autorizada, con el centro impreso. Eso es
  correcto.
- **El fallo extra** es un defecto del test de R4 commiteado en `f1981f74`. No
  lo causan la spec ni la variante de R8:
  - `it('no pinta estado ni navega cuando la primera página es unauthorized')`
    espera a que la cache de Query tenga `{ kind: 'unauthorized' }`, y despues
    comprueba sin esperar que `alert-detail-loading` no este.
  - El esqueleto se pinta mientras `alerts.isPending || alerts.isFetching`. La
    cache se escribe antes de que React vuelva a pintar, asi que la comprobacion
    puede llegar antes que el render.
  - Es la carrera que prohibe docs/conventions.md §Esperas sobre el arbol
    renderizado. Es la misma clase de defecto que la Reanudacion 1.
  - En la primera medicion (`/tmp/r8red3.log`) salio verde. Es intermitente.
  - La mutacion plantada no influye: con `pages[0]` unauthorized, `found` es
    `undefined` con mutacion y sin ella.
- **Doble de `QueryProvider`**: se acepta en lugar del de `createQueryClient`.
  La regla 1 de la Reanudacion 3 era imposible tal como estaba escrita:
  `QueryProvider` llama a su `createQueryClient` local, y un doble del export no
  la alcanza. El doble pierde dos cosas:
  - el `signOut` que se pasa al `QueryCache`;
  - el `client.clear()` en `unauthenticated`.
  
  A R8 no le afecta: su `useAuth` siempre esta `authenticated` y ninguna
  respuesta es `unauthorized`. Queda como observacion para el reviewer.
- Parar fue lo correcto.

Pegar en Codex:

```
Worktree: /home/claude/sites/Pet-Tracker-wt-backend   <- PRIMERA LINEA
Confirma `pwd` y `git branch --show-current` (feature/100-mobile-alert-detail-screen)
y que HEAD es b4123e5c, o el commit del leader que anade esta seccion encima
de b4123e5c. Si no, PARA.
Siguen vigentes todas las reglas del bloque original de
progress/handoff_mobile-alert-detail-screen.md y de la Reanudacion 3.

1. Aparta el cambio sin commitear de R8 con `git stash push -- mobile-pet-tracker`
   (el reporte se queda fuera del stash). `git status --short -- mobile-pet-tracker`
   debe salir vacio. La mutacion de R8 sigue plantada, no la toques.
2. En src/screens/alert-detail/index.test.tsx, SOLO el it
   'no pinta estado ni navega cuando la primera página es unauthorized': mueve
   la linea `expect(screen.queryByTestId('alert-detail-loading')).toBeNull();`
   dentro del waitFor que ya existe, como su ultima asercion. Las otras tres
   aserciones se quedan despues del waitFor, en su orden. Mismos literales,
   mismo nombre del it. Nada mas en el fichero.
   Corre TRES veces, cada una con su log:
   bunx jest --runTestsByPath 'src/screens/alert-detail/index.test.tsx' > /tmp/r4fix1.log 2>&1; echo "exit=$?"
   (idem /tmp/r4fix2.log y /tmp/r4fix3.log) -> exit=0 las tres, 1 suite.
   Si alguna sale roja, PARA. Commit (test-only, sin cambio de produccion):
   test(alert-detail): wait for the skeleton to leave before the unauthorized checks (R4)
3. `git stash pop`. Si hay conflicto, PARA. Sigue la Reanudacion 3 desde su
   paso 2, con el mismo criterio: exit=1, 2 suites y EXACTAMENTE 1 fallo, en el
   it de R8, por la linea (a) o (b), y los 25 del detalle en verde. Luego haz
   el commit rojo adicional y sigue con los pasos 3 a 5, sin cambios.
   El doble de QueryProvider que ya tienes se acepta tal cual: construido con
   el createQueryClient real y solo gcTime=0.
4. En el reporte, §Desviaciones:
   - el commit extra, con su hash y su motivo;
   - las tres corridas de r4fix;
   - por que el doble es de QueryProvider y no de createQueryClient.
   Anade una observacion para el reviewer: el doble pierde el signOut del
   QueryCache y el clear() en 'unauthenticated'; en R8 no se ejercitan.
   En traceability.md, anota el commit extra en la fila de R4 como correccion
   de test posterior al verde.
```
