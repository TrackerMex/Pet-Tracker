# Handoff a Codex CLI — #41 mobile-geofences

> Pegar el bloque de abajo en Codex CLI. La spec está firmada (commit de firma
> f044fa79, aprobación vía Notion el 2026-10-01) y enmendada por E1 (3a166fba,
> aprobada por el humano en chat el 2026-10-02): se implementa sobre `main`
> sin #60. Feature móvil. La prueba de humo en dev build de Android es del
> humano.

---

```
Worktree: /home/claude/sites/Pet-Tracker-wt-backend   <- PRIMERA LINEA. Trabaja AQUI y en ningun otro sitio
Antes de tocar nada, ejecuta `pwd`, `git branch --show-current` y
`git rev-parse --short HEAD` y pega las tres salidas al principio de
progress/impl_mobile-geofences.md. El hash es H0 (el commit que anade este
handoff) y es el «HEAD del handoff» de tasks.md: todos los `git diff` de
§Cierre se miden contra el. Para si la branch no es
feature/41-mobile-geofences.
No toques /home/claude/sites/Pet-Tracker (sesion de #60),
Pet-Tracker-wt-146 (spec de #146, en paralelo), Pet-Tracker-wt-ui,
pet-tracker-43 ni pt-skills, ni cambies de branch en ningun worktree.

Feature: mobile-geofences (#41)
Branch: feature/41-mobile-geofences
Spec aprobada: specs/mobile-geofences/requirements.md (status: approved)
Lee tambien, enteros: specs/mobile-geofences/design.md, tasks.md y
traceability.md. tasks.md es tu guion: §Antes de empezar, el orden, los
mensajes de commit literales, los rojos esperados por paso y §Cierre.
design.md D7 es el plan de tests por fichero; D8, el inventario de
aserciones heredadas que cambian (12 filas); D9, el bloque literal de la
fila del Perfil.

== QUE HACES ==

La lista de zonas seguras de la mascota activa, en la ruta delgada
pets/[petId]/geofences del Stack.Protected raiz, con entrada desde una fila
nueva del Perfil. El dueno activa/desactiva (PATCH {active}, no optimista)
y borra tras Alert.alert (DELETE, 204). Los demas roles ven la lista con
pildoras de estado, sin controles.

  A18  enmienda de docs (Paso 0), ANTES del primer rojo
  R1   once claves geofences.* en el catalogo + su tabla en la spec de idioma
  R2   listGeofences, GeofenceListState, geofenceKeys.list
  R3   patchJson, setGeofenceActive, deleteGeofence, GeofenceWriteState
  R4   route delgado + decimo Stack.Screen
  R5   GeofencesScreen y sus ramas de pintado
  R6   Switch del dueno
  R7   borrar con Alert.alert
  R8   pildora de solo lectura
  R9   fila geofences-link del Perfil
  R10  tabla R14_GEOFENCES (rojo por mutacion versionada, ruta b)

== BASE ==

origin/main 4e8d6cc3, SIN #60. La enmienda E1 de requirements.md lo
autoriza: la precondicion de tasks.md §Antes de empezar es
`git merge-base --is-ancestor 4e8d6cc3 HEAD` con exit=0 (NO 03f57706). El
leader comprobo en este arbol, el 2026-10-02, las nueve anclas de la
tabla de §Antes de empezar (todas dan el numero esperado) y los literales
de las filas 5-10 de D8. Repitelas igual: si una no da su numero, PARA.

Base de referencia sin #60: 86 suites / 1634 tests (./init.sh del leader
sobre 6a46f677, mismo mobile-pet-tracker/ que 4e8d6cc3). Tu medida manda.
Delta de cierre: +2 suites, +76 tests, mismo snapshot, con el reparto por
fichero de design.md D7.

Enmienda A18: `<fecha>` = 2026-10-02 (fecha del commit f044fa79, que firma
la casilla; `git log -1 --format=%cs f044fa79`).

== COMMITS ==

Mensajes LITERALES de tasks.md, en este orden (22 commits):
  docs(specs): apply amendment A18 of #41
  test(geofences): eleven copy keys for safe zones (R1)
  feat(geofences): add the safe zones copy keys (R1)
  test(geofences): list a pet's geofences by kind (R2)
  feat(geofences): add the geofences list client and query key (R2)
  test(geofences): toggle and delete a geofence by kind (R3)
  feat(geofences): add the geofence toggle and delete clients (R3)
  test(geofences): the safe zones route lives on the root stack (R4)
  feat(geofences): declare pets/[petId]/geofences on the root stack (R4)
  test(geofences): the screen renders the zones and their states (R5)
  feat(geofences): render the safe zones list (R5)
  test(geofences): the owner toggles a zone (R6)
  feat(geofences): let the owner toggle a zone (R6)
  test(geofences): the owner deletes a zone after confirming (R7)
  feat(geofences): let the owner delete a zone (R7)
  test(geofences): non-owners see the zones read-only (R8)
  feat(geofences): show read-only status pills to non-owners (R8)
  test(profile): profile links to the safe zones (R9)
  feat(profile): link the active pet's safe zones (R9)
  test(geofences): the screen resolves its copy by key (R10, plants mutation: retry key through a constant)
  feat(geofences): resolve the retry label by literal key (R10)
  docs(geofences): fill #41 traceability
El ultimo lleva SOLO specs/mobile-geofences/traceability.md y
progress/impl_mobile-geofences.md.

== REGLAS CRITICAS ==

- Arquitectura: docs/architecture.md. Convenciones: docs/conventions.md
  (prefijo de feature en describe: `#41 R<n>:`, nunca `#41` suelto).
- UI movil: docs/ui-guidelines.md rige (gate C8). Skills de Codex a cargar:
  `building-native-ui` y `native-data-fetching`. NO hay skill de router ni
  de animacion en tu catalogo: lo de expo-router esta escrito en design.md
  D1 y D9. No pidas skills por otros nombres. Di en el reporte cuales
  cargaste.
- TEST PRIMERO (C4 de CHECKPOINTS.md): por requisito, un commit ROJO
  (test + esqueleto de tipos si tasks.md lo dice) y un commit VERDE
  (produccion). Un commit con todo incumple C4 (paso en #19). Cada rojo
  falla EXACTAMENTE los `it` que tasks.md declara para ese paso (incluidos
  los heredados declarados en requirements.md R6, R9 y R10), por ASERCION
  o por la consulta que tasks.md diga; nunca por SyntaxError, ReferenceError
  o import roto. Si falla otro `it`, PARA y reportalo. No ajustes ninguna
  asercion para que cuadre.
- Los dobles de la pantalla se escriben por la intencion de design.md D7 y
  se comprueban contra los ficheros que importa la pantalla. No los calques
  de otra suite.
- Jest: siempre `--runTestsByPath` y cada ruta ENTRE COMILLAS SIMPLES (los
  corchetes de [petId] son regex sin escapar: jest salta el fichero con
  exit 0). Tras cada comando, el numero de suites que imprime jest debe ser
  el de ficheros pedidos.
- Typecheck: `test ! -e .expo/types/router.d.ts` antes de CADA
  `bunx tsc --noEmit`. Si existe, PARA y pide al humano que lo borre. Nunca
  `rm -f` (tu sandbox lo deniega).
- Sin dependencias nuevas: ni `bun add`, ni cambios en package.json,
  bun.lock ni app.json. Todo con bun/bunx, nunca npm/npx.
- NO lances ./init.sh ni toques Postgres ni LocalStack: los comparten otras
  sesiones. Se mide con bunx jest, bunx tsc --noEmit y bunx expo lint,
  desde mobile-pet-tracker/.
- Mide SIN pipe: `cmd > fichero 2>&1; echo "exit=$?"`. `cmd | tail`
  devuelve el codigo de tail. Copia las lineas de resumen al reporte.
- Si restauras un fichero, usa `git checkout HEAD -- <ruta>`, nunca
  `git checkout <commit> -- <ruta>` (deja el cambio en el indice), ni
  git stash ni rm -f. El verde de R10 revierte la mutacion A MANO (tasks.md).
- Rellena specs/mobile-geofences/traceability.md con los hashes solo en el
  ultimo commit. No rebasees despues de escribir hashes.
- No crees recursos AWS ni corras cdk.
- NO son tuyos, no los toques: progress/history.md, progress/current.md,
  STATUS.md y feature_list.json. Los escribe el leader tras el veredicto
  del reviewer. Todo lo que tengas que contar va en
  progress/impl_mobile-geofences.md.
- Si el sandbox te deniega un comando, PARA y reportalo. No lo sustituyas
  por otro que haga lo mismo con otra herramienta.
- NO hagas push ni abras la PR: lo hace el leader al cerrar.

Ficheros que TU cambias, medidos desde H0 (`git diff --name-only H0 HEAD`):
los de design.md §Archivos afectados (produccion, tests, docs y
specs/mobile-ui-language/design.md), mas specs/mobile-geofences/traceability.md
y progress/impl_mobile-geofences.md. Nada mas.

Criterios de aceptacion: R1-R10 de requirements.md y la enmienda A18.
La prueba de humo es del humano: no la marques.

Al terminar, escribe progress/impl_mobile-geofences.md con: pwd, branch y
H0; skills cargadas; la salida de las nueve anclas; la base medida (jest,
tsc, lint) con exit y bytes; los 22 commits con hash y R-id; por cada
rojo, el comando, las cuentas, el exit y cada `it` rojo con su matcher,
Expected y Received; por cada verde, sus cuentas y exit; la mutacion de
R10 plantada y revertida (git diff del verde contra el rojo anterior a la
mutacion); el cierre (suite completa, tsc, lint) con exit y bytes; las
comprobaciones de requirements.md §Verificacion (C8, los dos git grep
vacios, el git diff de ficheros intocables) con su salida; el
`git diff --name-only H0 HEAD`; el delta final sobre tu base, por fichero
segun D7; y cualquier decision que la spec no cerrara literalmente.
```
