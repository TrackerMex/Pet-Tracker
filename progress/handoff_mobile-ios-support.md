# Handoff a Codex CLI — #60 mobile-ios-support

> Pegar el bloque de abajo en Codex CLI. La spec está firmada (commit de firma
> f22cc1c4 de esta branch, aprobación vía Notion el 2026-09-30). Tiene tres
> gates humanos posteriores (R11 AASA en Hostinger, R12 smoke en iPhone, R13
> regresión de Android) que Codex no toca. Base re-medida por el leader antes
> del handoff: los 19 blobs de tasks.md §Antes de tocar nada punto 7 coinciden
> en 534d0b11 (merge de origin/main 0af5d921, PR #179), y `init.sh` de Backend
> midió mobile 86 / 1619 sobre esa misma base.

---

```
Worktree: /home/claude/sites/Pet-Tracker   <- PRIMERA LINEA. Trabaja AQUI y en ningun otro sitio
Antes de tocar nada, ejecuta `pwd` y `git branch --show-current` y pega las dos
salidas al principio de progress/impl_mobile-ios-support.md.
Para si la branch no es feature/60-mobile-ios-support.
No toques Pet-Tracker-wt-backend (es de otra sesion, con #140),
Pet-Tracker-wt-ui, pet-tracker-43 ni pt-skills, ni cambies de branch en
ningun worktree.

Feature: mobile-ios-support (#60)
Branch: feature/60-mobile-ios-support
Spec aprobada: specs/mobile-ios-support/requirements.md (status: approved)
Lee tambien, enteros: specs/mobile-ios-support/design.md, tasks.md y
traceability.md. tasks.md es tu guion paso a paso: tiene los bloques de
codigo literales (a columna 0, copialos tal cual), el blob de control de
cada paso, los mensajes de commit literales, las 18 sondas con su
«Exigido» y el cierre R10 con todas las cifras. Si este prompt y tasks.md
discrepan, manda tasks.md; anota la discrepancia en el reporte.

== QUE HACES ==
Soporte de iOS para la app movil, sin Mac: el build lo hara el humano en
EAS. Tu parte es solo codigo, tests y docs:
- R1/R2: PetMap (src/components/pet-map.tsx) pinta AppleMaps.View en iOS
  y GoogleMaps.View en Android; el tab Map lo monta igual.
- R3: las dos llamadas a launchImageLibraryAsync (alta y perfil) piden
  UIImagePickerPreferredAssetRepresentationMode.Compatible (JPEG, no HEIC).
- R4: app.json declara ios.bundleIdentifier, deploymentTarget "17.0" y
  usesNonExemptEncryption false.
- R5: solo el permiso de galeria, en espanol; fuera camara, microfono y
  Face ID. Incluye la enmienda de la linea de #79 R2 en app.config.test.ts
  (el unico it existente que cambia).
- R6/R7: app.config.ts declara ios.associatedDomains desde RESET_LINK_HOST
  y el aviso sin la variable cubre iOS.
- R8: hosting/.well-known/apple-app-site-association y su .htaccess.
- R9: docs/verification.md §Feature 60, hosting/README.md, .env.example,
  AGENTS.md y docs/conventions.md, cada uno con su bloque literal.
- R10: cierre, sondas, reporte y trazabilidad.

Orden exacto (diecisiete commits TDD + uno de evidencia), con los mensajes
literales de tasks.md:
  rojo R1, rojo R2, verde comun R1+R2, y luego rojo y verde de R3 a R9,
  y al final "docs(mobile): record the iOS support evidence (R10)".
Cada rojo toca solo tests; cada verde, solo lo que su paso cita. Nunca
mezcles test e implementacion, ni docs y codigo, en un commit (C4 de
CHECKPOINTS.md: en #19 se perdio el historial rojo->verde por hacerlo).

HEAD del handoff: anota `git rev-parse HEAD` al arrancar (tasks.md
§Antes de tocar nada punto 3). Es el commit que contiene este fichero.
La lista cerrada de R10 punto 8 (18 ficheros, 706 inserciones, 16
borrados) se mide contra el, no contra origin/main.

== CIFRAS ==
La spec se escribio sobre una base de 86 suites / 1613 tests. La base
actual es 86 / 1619 (+6 de la PR #179, weekly-activity-chart.test.tsx,
fichero que esta feature no toca). Por eso:
- seis ficheros de test de la feature: base 148, final 169 (sin cambio);
- tres guardas: 111 y 111 (sin cambio);
- suite entera (R10 punto 3): donde tasks.md dice 1634, espera 1640
  (+21 tests y +0 suites sobre 1619). tasks.md ya lo admite («o la base
  que conste mas 21»).
Tu medida manda: si al arrancar da otra cifra con exit=0, anotala y exige
el delta. Los rojos se cuentan por la linea `Tests:`; los bloques
`● Console` son ruido.

== REGLAS CRITICAS ==
- Skills (tasks.md §Antes de tocar nada punto 5), con los nombres de TU
  catalogo (plugin expo v1.0.2):
    * `building-native-ui`: PetMap y los selectores de fotos son UI nativa.
    * `expo-dev-client` y `expo-deployment`: solo lectura, para entender el
      dev build de EAS y los Universal Links. No ejecutes sus comandos.
    * `appllama-app-design-skill` de .agents/skills/: obligatoria por
      docs/ui-guidelines.md; toma solo el patron, la carta gana y su
      simulator loop no aplica (no hay Mac).
  Tu plugin no tiene skill de expo-router ni de animacion y no hacen falta.
  Di en el reporte cuales cargaste de verdad.
- Sigue docs/architecture.md, docs/conventions.md y docs/ui-guidelines.md.
- Literales en tests: la cita va siempre `#60 R<n>`, nunca `#60` suelto;
  ni `StyleSheet` ni `-[` ni colores hex, tampoco en comentarios. Los
  esperados van escritos a mano; ningun test importa valores de produccion
  para compararlos consigo mismos.
- No refactorices nada fuera de lo que cita la spec. Lista de NO tocar en
  tasks.md §Lo que NO hay que tocar (eas.json, package.json, bun.lock,
  catalog.ts, language-provider.test.tsx, media.ts, map/index.tsx, la
  seccion #59 de la guia, assetlinks.json, reset-password/index.html, los
  guardas de src/__tests__/, ui-guidelines.md).
- SEGURIDAD, sin excepciones:
    * Ningun comando `eas` (ni build, credentials, device:create, env:set,
      login ni otro), ni `bunx expo prebuild`, ni `expo run:ios` o
      `run:android`. Eso es del humano.
    * No tocas la clave .p8, certificados ni perfiles. No abres `.env` ni
      `google-services.json`. Ningun fichero gana el dominio real, el Team
      ID real, UDIDs, correos ni tokens: los placeholders son
      `REPLACE_WITH_APPLE_TEAM_ID` y `reset.example.test`.
    * El JSON de `expo config --type introspect` lleva la clave de Google
      Maps resuelta de `.env`: no lo abras, no lo cites, no lo copies.
      Copia solo la linea de `bun -e` y borralo en el acto (tasks.md
      §Antes de tocar nada punto 9). Si `domains` sale con otro valor que
      `["applinks:reset.example.test"]`, PARA y no copies nada.
    * No crees recursos AWS reales ni corras cdk.
- traceability.md: hashes en UN commit final (el de evidencia R10), tras el
  ultimo verde. No mezcles ficheros de arnes en los commits TDD. No
  rebasees despues: los hashes dejarian de valer.
- NO son tuyos, no los toques: progress/history.md, progress/current.md,
  STATUS.md y feature_list.json. Los escribe el leader tras el veredicto
  del reviewer. Tu sitio es progress/impl_mobile-ios-support.md.
- Las casillas de R11, R12 y R13 en requirements.md son del humano: no las
  marques ni simules esas pruebas.
- Si el sandbox te deniega un comando, PARA y reportalo. No lo sustituyas
  por otro que haga lo mismo con otra herramienta.
- NO abras la PR ni hagas push: lo hace el leader al cerrar.

== ENTORNO ==
- Todos los comandos desde mobile-pet-tracker/, tambien los de git (las
  rutas `../` salen de ella). Ninguna ruta de esta feature lleva parentesis.
- Solo `bun` y `bunx`, nunca npm ni npx. No instales nada.
- Antes de cada `bunx tsc --noEmit`: `test ! -e .expo/types/router.d.ts;
  echo "exit=$?"`. Si da 1, PARA y avisa al humano. Nunca `rm -f` (tu
  sandbox lo deniega, #121). El `expo config` del punto 9 puede generarlo:
  por eso tasks.md lo comprueba justo despues.
- jest siempre con `--runTestsByPath` y SIN pipe detras: redirige a un log
  y mide `exit=$?`. `| tail` o `| grep` detras de jest dan el exit del
  ultimo comando.
- Suite entera (`bunx jest` sin rutas) solo con permiso explicito del
  humano: la sesion de Backend comparte la maquina. Si no lo da, anotalo y
  sigue; el leader corre ./init.sh antes del reviewer.
- NO corras ./init.sh, e2e, Postgres ni LocalStack.
- Flake conocido: si sale rojo un it del test del alta que no es de
  `#60 R3` (el de `#72 R2` bajo carga), repite ese fichero solo tras
  `bunx jest --clearCache` y anotalo.
- Sondas (tasks.md §Sondas): cada una se restaura con
  `git checkout HEAD -- <ruta>` y despues `git diff --exit-code` y
  `git diff --cached --exit-code` en 0. Nunca `git checkout <commit> --`
  (deja el cambio en el indice).

Criterios de aceptacion: R1 a R10 de specs/mobile-ios-support/requirements.md
(R11, R12 y R13 son gates humanos).

Al terminar: progress/impl_mobile-ios-support.md con todo lo que pide
tasks.md §R10 punto 12 (HEAD del handoff, skills cargadas, base medida,
salida de cada rojo y verde, tabla de sondas con «medido», puntos 1 a 11
del cierre, linea de introspeccion y si hubo permiso para la suite
entera). Nada de secretos en el reporte. Commit de evidencia y para.
```
