# Handoff a Codex CLI — #137 + #139 mobile-push-registration-r15-named-import-lock

> Pegar el bloque de abajo en Codex CLI. La spec esta firmada (commit de firma
> 0aa09510 de esta branch, aprobacion via Notion el 2026-09-29). Una sola
> casilla: no hay gate de dispositivo. El humano acepto el limite S5 (punto 3
> de §Que firma): no se toca aqui ni se registra como deuda.
> Dos entradas, un ciclo: #137 es R1 y #139 es R2; la spec de verdad es la de
> #137 y la de #139 es un puntero. Solo #137 esta in_progress en
> feature_list.json (init.sh:156 aborta con dos).

---

```
Worktree: /home/claude/sites/Pet-Tracker-wt-backend   <- PRIMERA LINEA. Trabaja AQUI y en ningun otro sitio
Antes de tocar nada, ejecuta `pwd` y `git branch --show-current` y pega las dos
salidas al principio de progress/impl_mobile-push-registration-r15-named-import-lock.md.
Para si la branch no es feature/137-mobile-push-registration-r15-named-import-lock.
No toques /home/claude/sites/Pet-Tracker (es de otra sesion, con #136 y #138),
Pet-Tracker-wt-ui, pet-tracker-43 ni pt-skills, ni cambies de branch en ningun
worktree.

Feature: mobile-push-registration-r15-named-import-lock (#137, y #139 en el mismo ciclo)
Branch: feature/137-mobile-push-registration-r15-named-import-lock
Spec aprobada: specs/mobile-push-registration-r15-named-import-lock/requirements.md (status: approved)
Lee tambien, enteros: specs/mobile-push-registration-r15-named-import-lock/design.md,
tasks.md y traceability.md. tasks.md es tu guion paso a paso: tiene los
reemplazos literales, las mutaciones versionadas, la tabla de sondas con su
edicion exacta y su esperado, y los comandos de cierre.
El puntero specs/mobile-push-registration-r1-restore-identity-lock/requirements.md
no tiene nada que hacer: no lo toques.

== QUE HACES ==

SOLO TESTS. Un unico fichero de codigo en el diff final:
mobile-pet-tracker/src/hooks/use-push-registration.test.tsx. El hook
(src/hooks/use-push-registration.ts) solo cambia en el commit ROJO de R1 (la
mutacion S3 versionada) y el commit VERDE de R1 lo devuelve a la base. En las
sondas se muta temporalmente y no se commitea.
  R1 (#137)  el it 'no accede a expo-notifications al importar el modulo' de
             R15 cambia de fabrica: en vez del Proxy que lanza al leer una
             propiedad, una fabrica que lanza al invocarse (en el propio
             require). Mismo titulo. Asi se pone rojo tambien con un import
             con nombre (S3)
  R2 (#139)  describe nuevo, el ULTIMO del fichero (detras de #133 R1), que
             asevera con toBe que tras R15 jest.requireMock('expo-notifications')
             devuelve el MISMO objeto de la cabecera (headerNotificationsModule,
             constante nueva del test)
  R3         cierre medido: diff de produccion vacio, titulos base + 1,
             diff --stat exacto, suite, tsc, eslint, grep-clean, reporte y
             traceability.md
No uses numeros de linea: localiza todo con los grep -cF y las lineas
literales de tasks.md.

Orden EXACTO de tasks.md:
  Antes    pasos 1-8 de tasks.md §Antes de tocar nada. Ademas comprueba los
           blobs de base desde la raiz:
             git rev-parse --short=8 HEAD:mobile-pet-tracker/src/hooks/use-push-registration.test.tsx  -> 0a6e87fe
             git rev-parse --short=8 HEAD:mobile-pet-tracker/src/hooks/use-push-registration.ts        -> 316a36f2
             git rev-parse --short=8 HEAD:mobile-pet-tracker/src/api/push-tokens.ts                    -> 1f9afe40
           Si alguno no coincide, PARA. Y anota el hash del commit de este
           handoff, que es la base de la lista cerrada de ficheros:
             H=$(git log -1 --format=%h -- progress/handoff_mobile-push-registration-r15-named-import-lock.md); echo "$H"
  R1 rojo  tasks.md §R1 (1): reemplazo literal de la fabrica en el test MAS la
           mutacion S3 en el hook. El UNICO rojo es el it de R15, POR
           ASERCION: `expect(received).not.toThrow()` con `Error message:
           "expo-notifications unavailable in Expo Go"`. #133 R1 sigue verde.
           Si el rojo es otro, por excepcion o mas de uno, PARA. Commit con
           el test y el hook
  R1 verde tasks.md §R1 (2): revierte S3 a mano. `hook=0` en el git diff
           --exit-code contra la base. Commit SOLO con el hook
  R2 rojo  tasks.md §R2 (1): las tres ediciones a, b y c en el test (captura
           headerNotificationsModule encima de `const notificationMocks = [`,
           describe nuevo al final, mutacion O1 en el finally de R15). El
           UNICO rojo es el it de #139 R2, POR ASERCION
           (`expect(received).toBe(expected) // Object.is equality`). R15 y
           #133 R1 siguen verdes. Si no, PARA. Commit SOLO con el test
  R2 verde tasks.md §R2 (2): revierte O1. Fichero verde, base + 1. Commit
           SOLO con el test
  Sondas   todas las de tasks.md §Sondas, UNA cada vez, sobre el arbol del
           verde de R2: comprueba con grep -cF que el texto citado aparece
           una sola vez, aplica, mide, apunta exit, la linea Tests:, cada ● y
           la PRIMERA LINEA de su error, restaura con
             git checkout HEAD -- mobile-pet-tracker/src/hooks/use-push-registration.ts mobile-pet-tracker/src/hooks/use-push-registration.test.tsx mobile-pet-tracker/src/api/push-tokens.ts
           desde la raiz, y comprueba que `git diff --quiet` y
           `git diff --cached --quiet` dan 0 antes de la siguiente. S7, S5,
           H4+S3 y H4+O1 DEBEN dar verde: son el control de tipos (S7), el
           limite aceptado por el humano (S5) y la dependencia conocida del
           reset (H4). No son un fallo tuyo. No se commitean
  R3       pasos 1-7 de tasks.md §R3; reporte y traceability.md en el ultimo
           commit

Mensajes de commit, LITERALES y en este orden (cinco commits):
  test(mobile): expose the R15 named import blind spot with a versioned mutation (R1)
  test(mobile): lock R15 against a named expo-notifications import (R1)
  test(mobile): expose the R15 restore identity gap with a versioned mutation (R2)
  test(mobile): lock the R15 restore to the header module identity (R2)
  docs(mobile): record the R15 named import and restore identity evidence (R1,R2,R3)

Lista cerrada de ficheros, medida desde el commit de este handoff ($H):
  git diff --name-only $H..HEAD
debe dar exactamente, en cualquier orden:
  mobile-pet-tracker/src/hooks/use-push-registration.test.tsx
  progress/impl_mobile-push-registration-r15-named-import-lock.md
  specs/mobile-push-registration-r15-named-import-lock/traceability.md
El hook no sale: su diff neto es cero. La branch ya trae antes de $H los
ficheros del leader (spec, firma, puntero, este handoff, feature_list.json,
current.md); no son tuyos y no cuentan. Contra origin/main solo vale el diff
de produccion: `git diff --name-only 70e1fdcb..HEAD -- mobile-pet-tracker/`
lista solo el test (R3.1).

== CIFRAS ==

origin/main no se ha movido desde la base de la spec (70e1fdcb) y los blobs
de base coinciden (el leader lo comprobo al firmar), asi que las cifras de
tasks.md valen tal cual:
  base      el test 52 passed de 52, exit=0; suite 86 suites / 1609 passed,
            exit=0; 52 titulos
  rojo R1   exit=1: 1 failed, 51 passed, 52 total
  verde R1  el test 52 passed, exit=0
  rojo R2   exit=1: 1 failed, 52 passed, 53 total
  verde R2  el test 53 passed, exit=0
  cierre    suite 86 suites / 1610 passed, exit=0; titulos base + 1 exacto;
            diff --stat del test contra la base:
            1 file changed, 18 insertions(+), 12 deletions(-)
Si tu base es otra con exit=0 (porque otra feature mergeo), anota la tuya y
aplica el mismo delta (+0 suites, +1 test). Si cualquier sonda o paso da otro
veredicto que su «Esperado», PARA y reportalo con el log. No ajustes el test
para que cuadre.

== REGLAS CRITICAS ==

- Arquitectura: docs/architecture.md. Convenciones: docs/conventions.md. UI
  movil: docs/ui-guidelines.md (gate C8 del reviewer; aqui solo aplica el
  grep-clean de R3.6, no hay pantalla).
- Skills: NINGUNA, como dice tasks.md §Antes punto 5. De las 13 de tu plugin
  expo (v1.0.2) ninguna trata mocks de jest, y ninguna de .agents/skills/
  tampoco; appllama-app-design-skill no aplica (no hay pantalla ni flujo).
  Todo lo que necesitas esta en design.md y tasks.md. Di en el reporte que
  no cargaste ninguna.
- TEST PRIMERO (C4 de CHECKPOINTS.md), via b en R1 y en R2: cada candado
  tiene su commit ROJO con la mutacion versionada, y su commit VERDE que la
  revierte, por separado. Cuatro commits de codigo y uno de docs. Meter test,
  mutacion, reversion y docs en menos commits incumple C4 (paso en #19).
- Los literales de tasks.md van TAL CUAL: bloques de codigo, titulos del
  describe y del it, comentarios, sangria con espacios. En el codigo nuevo,
  un `#` solo va seguido de `137 R1` o `139 R2`; nunca un `#137`, `#139` ni
  `#133` suelto, tampoco en comentarios.
- NO toques: use-push-registration.ts fuera del commit rojo de R1 y las
  sondas; use-push-registration.navigation.test.tsx; los describe e it
  existentes, sus titulos, su orden y su posicion (R15 y #133 R1 siguen donde
  estan); el titulo del it de R15; jest.config, test/jest-setup.js,
  package.json, bun.lock; las specs de #79 y #133 aunque la de #133 diga lo
  que ahora cierra R2. Cero dependencias nuevas.
- No factorices headerNotificationsModule con la captura headerNotifications
  de R15 (tasks.md §R2 (3)): la sonda H5 depende de que las dos existan.
- Rellena specs/mobile-push-registration-r15-named-import-lock/traceability.md
  con los hashes, sin ninguna fila «pendiente». R1 cita su rojo y su verde;
  R2 igual; R3 cita el verde de R2. No rebasees despues de escribir hashes.
- No crees recursos AWS ni corras cdk. No corras ./init.sh ni los e2e.
- NO son tuyos, no los toques: progress/history.md, progress/current.md,
  STATUS.md y feature_list.json. Son artefactos del leader. Todo lo que tengas
  que contar va en progress/impl_mobile-push-registration-r15-named-import-lock.md.
- Si el sandbox te deniega un comando, PARA y reportalo. No lo sustituyas por
  otro que haga lo mismo con otra herramienta.
- NO abras la PR ni hagas push: lo hace el leader al cerrar.

== ENTORNO ==

- Jest, tsc y eslint desde mobile-pet-tracker/. Los git add, git checkout y
  git diff desde la raiz del repo, con rutas mobile-pet-tracker/..., como
  indica tasks.md. bun / bunx. Nunca npx, nunca npm i -g.
- Jest del fichero: comprueba que el log imprime `Test Suites: 1` (la ruta no
  tiene parentesis; si saliera 0 o mas de 1, PARA).
- Antes de cada `bunx tsc --noEmit`: `test ! -e .expo/types/router.d.ts; echo "exit=$?"`
  desde mobile-pet-tracker/. exit=0: sigue. exit=1: PARA y reportalo. Nunca
  `rm -f` ni otra forma de borrarlo (el leader midio exit=0 en este worktree
  el 2026-09-29).
- Mide SIN pipe: `cmd > fichero 2>&1; echo "exit=$?"`. `cmd | tail` devuelve el
  codigo de tail. Los logs de $OUT no se versionan: copia sus lineas de
  resumen al reporte.
- Restaura SIEMPRE con `git checkout HEAD -- <ruta>`, nunca con
  `git checkout <commit> -- <ruta>` seguido de otro checkout: deja la mutacion
  en el indice. Ni git stash ni rm -f.
```
