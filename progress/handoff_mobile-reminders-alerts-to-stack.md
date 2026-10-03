# Handoff a Codex CLI — #114 mobile-reminders-alerts-to-stack

> Pegar el bloque de abajo en Codex CLI. La spec y las enmiendas A13 y A14 ya
> estan firmadas (commit `f5a491ee`, aprobacion via Notion, P1 = opcion A).

---

```
Worktree: /home/claude/sites/Pet-Tracker   <- PRIMERA LINEA. Trabaja AQUI y en ningun otro sitio
Antes de tocar nada, ejecuta `pwd` y `git branch --show-current` y pega las dos
salidas al principio de progress/impl_mobile-reminders-alerts-to-stack.md. Para si la
branch no es feature/114-mobile-reminders-alerts-to-stack.
No toques /home/claude/sites/Pet-Tracker-wt-backend (otra sesion trabaja alli en
#113) ni cambies de branch en ningun worktree.

Feature: mobile-reminders-alerts-to-stack (#114), branch: feature/114-mobile-reminders-alerts-to-stack
Spec aprobada: specs/mobile-reminders-alerts-to-stack/requirements.md (status: approved)
Lee tambien, enteros: specs/mobile-reminders-alerts-to-stack/design.md, tasks.md y
traceability.md. El molde es #95: specs/mobile-detail-screens-to-stack/ ya esta
mergeada y su RootStack con Stack.Protected vive en src/app/_layout.tsx.

== QUE HACES ==

Subir reminders y alerts de mobile-pet-tracker/src/app/(tabs)/ al Stack.Protected de
RootStack. Decision de producto firmada: P1 = A (mover las dos). Requisitos R1-R7 y
enmiendas A13 y A14, en EXACTAMENTE el orden de tasks.md §Antes de empezar y §Orden
(su tabla dice por que):
  A14 commit de docs: los dos bloques literales de requirements.md §Enmiendas, justo
      antes de `## Aprobacion` en specs/mobile-alerts-center/requirements.md y en
      specs/mobile-reminders/requirements.md, con <fecha> = 2026-09-23. ANTES del
      primer rojo
  R1  rutas en src/app/reminders.tsx y src/app/alerts.tsx (git mv); ocho Stack.Screen
      en la guarda, alerts con dangerouslySingular
  R2  push/pop sobre una sola (tabs); reminders sigue montada bajo add-reminder
  R3  toque de notificacion: alerts encima de lo actual, una sola vez; arranque en
      frio termina en ["(tabs)", "alerts"]. use-push-registration.ts NO cambia
      R1, R2 y R3: tres rojos y UN verde compartido (tasks.md paso 4)
  R4  cabecera nativa con las opciones exactas de #95 R4 y los titulos de R4
  R5  fuera el titulo del cuerpo en las dos pantallas; fila reminders-actions;
      ListHeaderComponent={null} en alerts-list sin error
  A13 commit de docs (texto literal de requirements.md §Enmiendas) en
      docs/conventions.md y docs/ui-guidelines.md, <fecha> = 2026-09-23. Va ANTES
      del rojo de R6
  R6  contentContainerStyle { padding: 24, gap: 16, paddingBottom: insets.bottom + 24 }
  R7  add-reminder sin mascota: router.dismissTo('/reminders') una vez, sin <Redirect>

Ficheros: la lista completa esta en design.md §Archivos afectados, y el plan de
tests y el inventario de aserciones heredadas que cambian, en D8 y D9. NO toques nada que no este ahi. Dos ficheros nuevos:
src/app/__tests__/reminders-alerts-stack.navigation.test.tsx y
reminders-alerts-stack.notification.test.tsx. UN SOLO `it` que use renderRouter
por fichero (sonda S11 de #95).

== REGLAS CRITICAS ==

- Arquitectura: docs/architecture.md. Convenciones: docs/conventions.md. UI movil:
  docs/ui-guidelines.md (es el gate C8 del reviewer).
- Skills de expo de Codex (plugin v1.0.2): carga SOLO `building-native-ui`. En tu
  catalogo NO existe ninguna skill expo-router ni expo-overview: no las busques. La
  guia de routing (Stack.Protected, dangerouslySingular, dismissTo, renderRouter)
  YA esta escrita en design.md D1, D2, D6 y D8, con las sondas de §1. Si necesitas
  detalle de API, doc de Expo SDK 57: https://docs.expo.dev/versions/v57.0.0/
  (lo exige mobile-pet-tracker/AGENTS.md). Di en el reporte que skills cargaste.
- TDD por requisito: rojo -> verde -> refactor, segun tasks.md.
- TEST PRIMERO, UN COMMIT POR PASO. El rojo de cada requisito va en SU PROPIO commit,
  ANTES de su implementacion, y falla por SU ASERCION, nunca por un ReferenceError,
  un modulo inexistente ni un timeout de waitFor (si R3 sale rojo por timeout, el
  montaje esta mal: arreglalo antes de commitear). En #19 todo fue en un solo commit
  e incumplio C4 de CHECKPOINTS.md. Aqui: al menos un rojo y un verde por R-id, salvo
  R1+R2+R3 (tres rojos, un verde) y A13/A14 (commits de docs). Mensajes como tasks.md.
- Leccion de #95 (ronda 1 rechazada, B1): toda asercion de AUSENCIA (titulo del
  cuerpo en R5) se hace en carga Y OTRA VEZ tras esperar con findByTestId un nodo del
  estado CARGADO. Nunca solo en carga.
- Todo `describe` nuevo lleva el prefijo `#114 R<n>:` (nunca un `#114` suelto).
- Actualiza specs/mobile-reminders-alerts-to-stack/traceability.md con describe y
  hashes rojo -> verde; A13 y A14 con su commit. No rebasees despues de escribir hashes.
- Catalogo: CERO claves nuevas y cero retiradas. NO toques src/i18n/catalog.ts ni
  src/providers/__tests__/language-provider.test.tsx. En src/__tests__/ui-copy-table.ts
  y ui-language.test.ts toca SOLO lo que dice design.md D7 (R8_REMINDERS, R12_ALERTS,
  `#65 R8`, `#78 R12`); R6_FOOD y `#65 R6` son de #113, que trabaja en paralelo.
- Cero dependencias nuevas. NO regeneres el dev build ni toques app.json.
- No crees recursos AWS ni corras cdk.
- NO son tuyos, no los toques: progress/history.md, progress/current.md, STATUS.md
  y el campo `status` de feature_list.json. Son artefactos de cierre del leader.
  Todo lo que tengas que contar va en progress/impl_mobile-reminders-alerts-to-stack.md.
- NO abras la PR ni hagas push: lo hace el leader al cerrar.

== ENTORNO ==

- Todo desde mobile-pet-tracker/. bun / bunx. Nunca npx, nunca npm i -g.
- `rm -f .expo/types/router.d.ts` antes de tocar codigo, y otra vez antes de cada
  `bunx tsc --noEmit` a partir de R1 (las rutas fantasma lo rompen).
- Rutas de jest con --runTestsByPath (acepta parentesis) o con parentesis ESCAPADOS
  ('src/app/\(tabs\)/...'). Sin escapar, `(tabs)` es una regex: se salta ficheros en
  silencio con exit 0. Tras cada comando, comprueba que el numero de suites que
  imprime jest coincide con el de ficheros pedidos.
- Mide SIN pipe: `cmd > fichero; echo "exit=$?"`. `cmd | tail` devuelve el codigo de tail.
- NO lances ./init.sh ni toques Postgres o LocalStack: son compartidos con el
  worktree de Backend. Se mide con bunx jest, bunx tsc --noEmit y bunx expo lint.

== BASE Y CIERRE ==

Base en a833f153 (vuelve a medirla al empezar, sobre el HEAD actual de la branch,
que es f5a491ee o posterior; solo tiene commits de spec y progress encima):
  bunx jest --silent -> 80 suites, 1426 tests, exit=0
  bunx tsc --noEmit y bunx expo lint -> exit=0 y salida VACIA
Cierre esperado: +2 suites y +9 tests sobre la base (82 / 1435), con el reparto por
fichero de design.md D8. tsc y lint con exit=0 y salida vacia (un import huerfano
de Redirect no rompe el exit code pero imprime un warning: cuenta como fallo). Los
greps y git diff vacios de requirements.md §Verificacion. Lista completa en
tasks.md §Cierre.

Criterios de aceptacion: R1-R7 de requirements.md, y A13 y A14 aplicadas literal.

Al terminar, escribe progress/impl_mobile-reminders-alerts-to-stack.md con: pwd y
branch; skills cargadas; commits por R-id (rojo y verde) con hashes y la linea de
fallo de cada rojo; comandos y salidas exactas del cierre; las dos mutaciones de
tasks.md R1-R3 paso 3 (quitar dangerouslySingular; sacar reminders del
Stack.Protected) con su resultado; el delta por fichero contra D8; y cualquier
decision que la spec no cerrara literalmente.
```
