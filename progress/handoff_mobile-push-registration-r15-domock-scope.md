# Handoff a Codex CLI — #133 mobile-push-registration-r15-domock-scope

> Pegar el bloque de abajo en Codex CLI. La spec esta firmada (commit de firma
> 1102934a de esta branch, aprobacion via Notion el 2026-09-29). Una sola
> casilla: no hay gate de dispositivo. El limite S3 queda fuera: el humano lo
> registro como deuda nueva (#137), no se toca aqui.

---

```
Worktree: /home/claude/sites/Pet-Tracker-wt-backend   <- PRIMERA LINEA. Trabaja AQUI y en ningun otro sitio
Antes de tocar nada, ejecuta `pwd` y `git branch --show-current` y pega las dos
salidas al principio de progress/impl_mobile-push-registration-r15-domock-scope.md.
Para si la branch no es feature/133-mobile-push-registration-r15-domock-scope.
No toques /home/claude/sites/Pet-Tracker (es de otra sesion, con #136),
Pet-Tracker-wt-ui, pet-tracker-43 ni pt-skills, ni cambies de branch en ningun
worktree.

Feature: mobile-push-registration-r15-domock-scope (#133), branch: feature/133-mobile-push-registration-r15-domock-scope
Spec aprobada: specs/mobile-push-registration-r15-domock-scope/requirements.md (status: approved)
Lee tambien, enteros: specs/mobile-push-registration-r15-domock-scope/design.md,
tasks.md y traceability.md. tasks.md es tu guion paso a paso: tiene el
describe nuevo literal, el reemplazo literal del it de R15, la tabla de
sondas con su edicion exacta y su esperado, y los comandos de cierre.

== QUE HACES ==

SOLO TESTS. Un unico fichero de codigo:
mobile-pet-tracker/src/hooks/use-push-registration.test.tsx. El hook
(src/hooks/use-push-registration.ts) NO se toca en ningun commit; solo se
muta temporalmente en las sondas de R2, que no se commitean.
  R1  un describe nuevo, el ULTIMO del fichero (detras de R15), que prueba que
      tras R15 el hook recibe el mock de expo-notifications de la cabecera. Su
      rojo es real: falla por el defecto que arregla el verde. El verde vive
      DENTRO del it 'no accede a expo-notifications al importar el modulo' de
      R15: jest.requireMock ANTES de jest.resetModules() y jest.doMock de
      restauracion en un finally
  R2  R15 sigue siendo candado real: se cierra por mutacion (sondas S1, S2,
      S4, S3, H1-H5), sin commit rojo
  R3  cierre medido: diff de produccion vacio, titulos base + 1, R15 intacto
      salvo sangria, suite, tsc, eslint, grep-clean, reporte y traceability.md
No uses numeros de linea: localiza todo con los grep y las lineas literales
de tasks.md.

Orden EXACTO de tasks.md:
  Antes   pasos 1-8 de tasks.md §Antes de tocar nada. Ademas comprueba los
          dos blobs de base desde la raiz:
            git rev-parse --short=8 HEAD:mobile-pet-tracker/src/hooks/use-push-registration.test.tsx  -> 1e4ecca9
            git rev-parse --short=8 HEAD:mobile-pet-tracker/src/hooks/use-push-registration.ts        -> 316a36f2
          Si alguno no coincide, PARA
  R1 rojo  anade el bloque literal de tasks.md §R1 (1). El UNICO rojo del
          fichero es el it de #133 R1, y es POR EXCEPCION: la primera linea
          tras el titulo es `expo-notifications unavailable in Expo Go`, sin
          `expect(received)` delante. Si el rojo es una asercion, otro it o
          mas de uno, PARA. Commit
  R1 verde sustituye el cuerpo del it de R15 por el literal de tasks.md §R1 (2).
          Fichero verde, base + 1. Commit
  R2      todas las sondas de tasks.md §R2, UNA cada vez, con el fichero de
          test: aplicar (comprueba con grep -c que el texto buscado aparece una
          sola vez), medir, apuntar exit, la linea Tests:, cada ● y la PRIMERA
          LINEA de su error, restaurar con `git checkout HEAD --
          mobile-pet-tracker/src/hooks/use-push-registration.ts
          mobile-pet-tracker/src/hooks/use-push-registration.test.tsx` desde
          la raiz y comprobar que `git diff --quiet` y `git diff --cached
          --quiet` dan 0 antes de la siguiente. S3, H4, H4+S1 y H4+S2 DEBEN
          dar verde: son el limite conocido (S3) y la prueba de que el reset
          es de carga (H4), no un fallo tuyo. No se commitean
  R3      pasos 1-7 de tasks.md §R3; reporte y traceability.md en el ultimo
          commit

Mensajes de commit, LITERALES y en este orden:
  test(mobile): expose the R15 expo-notifications mock leak to later describes (R1)
  test(mobile): scope the R15 expo-notifications doMock to its own test (R1)
  docs(mobile): record the R15 doMock scope evidence (R2,R3)

Ficheros que cambian en el diff acumulado contra origin/main:
  mobile-pet-tracker/src/hooks/use-push-registration.test.tsx
  specs/mobile-push-registration-r15-domock-scope/traceability.md
  progress/impl_mobile-push-registration-r15-domock-scope.md
Nada mas.

== CIFRAS ==

origin/main no se ha movido desde la base de la spec (073fa6cb) y los blobs
de base coinciden (el leader lo comprobo al firmar), asi que las cifras de
tasks.md valen tal cual:
  base    el test 51 passed de 51, exit=0; suite 86 suites / 1608 passed,
          exit=0; 51 titulos
  rojo R1 exit=1: 1 failed, 51 passed, 52 total
  verde   el test 52 passed, exit=0
  cierre  suite 86 suites / 1609 passed, exit=0; titulos base + 1 exacto
Si tu base es otra con exit=0 (porque otra feature mergeo), anota la tuya y
aplica el mismo delta (+0 suites, +1 test). Si cualquier sonda o paso da otro
veredicto que su «Esperado», PARA y reportalo con el log. No ajustes el test
para que cuadre.

== REGLAS CRITICAS ==

- Arquitectura: docs/architecture.md. Convenciones: docs/conventions.md. UI
  movil: docs/ui-guidelines.md (gate C8 del reviewer; aqui solo aplica el
  grep-clean de R3.6, no hay pantalla).
- Skills: carga `building-native-ui` de tu plugin expo, como pide tasks.md
  §Antes punto 5 (es el nombre de TU catalogo v1.0.2; no busques
  expo-overview ni expo-native-ui, no existen en el tuyo). Ninguna otra: esto
  es un cambio de mocks de jest en el test de un hook, sin UI, y ninguna skill
  de tu plugin ni de .agents/skills/ cubre mocks de jest. Tampoco
  appllama-app-design-skill: no se disena ni se cambia pantalla ni flujo.
  Todo lo que necesitas esta en design.md y tasks.md. Di en el reporte que
  skills cargaste.
- TEST PRIMERO (C4 de CHECKPOINTS.md): R1 por via a, rojo real en commit
  propio antes del verde. R2 por via b, cerrado por mutacion sin commit rojo
  porque produccion ya es correcta. Dos commits de codigo y uno de docs, no
  uno: test + arreglo + docs en un solo commit incumple C4.
- Los literales de tasks.md van TAL CUAL: titulo del describe, del it, el
  comentario del finally, sangria incluida. En el codigo nuevo, un `#` solo
  va seguido de `133 R1`; nunca un `#133` suelto, tampoco en comentarios.
- NO toques: use-push-registration.ts (fuera de las sondas); los describe e it
  existentes, sus titulos, su orden y su posicion (R15 sigue donde esta);
  los helpers y mocks de la cabecera del test; src/screens/home/ (es de #136,
  otra sesion); jest.config, jest.setup, package.json, bun.lock; las specs de
  #79, #99 y #100 ni el handoff de #100 aunque digan «antes de R15». Cero
  dependencias nuevas.
- Rellena specs/mobile-push-registration-r15-domock-scope/traceability.md con
  los hashes, sin ninguna fila «pendiente». R2 y R3 citan el hash del VERDE de
  R1 (el ultimo commit de codigo). No rebasees despues de escribir hashes.
- No crees recursos AWS ni corras cdk.
- NO son tuyos, no los toques: progress/history.md, progress/current.md,
  STATUS.md y feature_list.json. Son artefactos del leader. Todo lo que tengas
  que contar va en progress/impl_mobile-push-registration-r15-domock-scope.md.
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
- NO lances ./init.sh ni e2e, ni toques Postgres o LocalStack: son compartidos
  con los otros worktrees. Se mide con bunx jest, bunx tsc --noEmit y
  bunx eslint.

Criterios de aceptacion: R1-R3 de requirements.md.

Al terminar, escribe progress/impl_mobile-push-registration-r15-domock-scope.md
con: pwd y branch; skills cargadas; la base medida (commit, blobs, cifras del
fichero y de la suite, numero de titulos); los commits por R-id con hashes; el
rojo de R1 con su linea Tests:, su ● y la primera linea del error, y el verde
con sus cuentas y exit; la tabla de todas las sondas con exit, linea Tests:,
cada ● y la primera linea de su error, y si es rojo por asercion o por
excepcion, en la columna «medido»; las seis medidas de R3 con comandos,
salidas y exit; el delta sobre tu base; y cualquier decision que la spec no
cerrara literalmente.
```
