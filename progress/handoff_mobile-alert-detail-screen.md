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
