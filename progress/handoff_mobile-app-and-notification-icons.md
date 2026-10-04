# Handoff a Codex CLI — #101 `mobile-app-and-notification-icons`

> Pegar el bloque de abajo en la terminal de Codex CLI. El humano lo lanza;
> el leader no lo ejecuta.

---

```
Worktree: /home/claude/sites/Pet-Tracker-wt-icon   <- PRIMERA LINEA: trabaja AQUI y solo aqui
Antes de tocar nada, confirma en el reporte: `pwd` y `git branch --show-current`.
Tienen que dar /home/claude/sites/Pet-Tracker-wt-icon y
feature/101-mobile-app-and-notification-icons. Si no, PARA.
NO toques /home/claude/sites/Pet-Tracker: es el worktree de otra sesion (#105).

Feature: mobile-app-and-notification-icons (#101), branch: feature/101-mobile-app-and-notification-icons
Spec aprobada por humano el 2026-10-03 (commit de firma add2dade):
  specs/mobile-app-and-notification-icons/requirements.md  (status: approved, R1-R10; R10 es del humano)
  specs/mobile-app-and-notification-icons/design.md        (D1-D7, tabla de transformaciones, archivos afectados)
  specs/mobile-app-and-notification-icons/tasks.md         (orden de commits: seguirlo tal cual)
  specs/mobile-app-and-notification-icons/traceability.md  (rellenar en UN commit docs final)
Lee las cuatro enteras antes de tocar nada. No viste la conversacion que las
origino: toda decision abierta ya esta cerrada por escrito ahi.

== QUE ES ==

Solo movil (mobile-pet-tracker/), capa de configuracion: nada en src/.
Sustituir los PNG de plantilla de Expo (icono de app, adaptive icon,
splash, favicon) por el arte del humano y declarar el icono pequeno de
notificacion. Las TRES fuentes del humano ya estan en el arbol y son
intocables (R1):
  assets/images/pet-tracker-app-icon.png                      (1254x1254 RGB)
  assets/images/pet-tracker-notification-monochrome-original.png (1254x1254 RGBA)
  assets/images/pet-tracker-notification-color-96.png         (96x96, queda sin uso, D2)
No hay cuarto asset (D7): el foreground del adaptive icon es el icono
completo encogido a la zona segura del 66 % (676 px en lienzo transparente
de 1024, compuesto en (174, 174)). Todo se deriva con un script one-off
`scripts/make-icons.mjs` que usa `jimp-compact` (ya en node_modules como
transitiva; CERO dependencias nuevas). Lo que se versiona son los PNG
resultantes: la suite no depende del script.

== FICHEROS (lista cerrada; un diff fuera de ella es un hallazgo del reviewer) ==

  mobile-pet-tracker/app.json                                  (exactamente las 4 ediciones de design.md)
  mobile-pet-tracker/app.config.test.ts                        (2 relajaciones en '#79 R2' + 9 describe '#101 R<n>')
  mobile-pet-tracker/app.assets.test.ts                        (NUEVO, helper readIhdr + 7 describe '#101 R<n>', R2-R8)
  mobile-pet-tracker/scripts/make-icons.mjs                    (NUEVO, one-off)
  mobile-pet-tracker/assets/images/icon.png                    (regenerado, R2)
  mobile-pet-tracker/assets/images/favicon.png                 (regenerado, R8)
  mobile-pet-tracker/assets/images/android-icon-foreground.png (regenerado, R3)
  mobile-pet-tracker/assets/images/android-icon-monochrome.png (regenerado, R4)
  mobile-pet-tracker/assets/images/splash-icon.png             (regenerado = copia byte a byte del foreground, R6)
  mobile-pet-tracker/assets/images/pet-tracker-notification-96.png (NUEVO, R7)
  mobile-pet-tracker/assets/images/android-icon-background.png (git rm, R5)
  specs/mobile-app-and-notification-icons/traceability.md
  progress/impl_mobile-app-and-notification-icons.md           (lo creas tu)

Intactos, y lo comprueba el reviewer con `git diff --stat d29d49d5 --`:
las tres fuentes pet-tracker-* (R1), assets/expo.icon (R9), src/**,
package.json, bun.lock. Ningun asset nuevo bajo assets/images/ fuera de
pet-tracker-notification-96.png.

== SKILLS ==

- NO cargues ninguna skill de expo: no hay pantalla, ni ruta, ni animacion,
  ni modulo nativo. La unica remotamente relacionada (expo-dev-client, build
  de Android) tampoco aplica: el build lo hace el humano en R10, tu no
  compilas nada. Dilo en el reporte ("skills cargadas: ninguna").
- La carta de UI (docs/ui-guidelines.md) sigue rigiendo el guard C8 de
  src/__tests__/design-drift.test.ts: en el codigo de test nuevo, nada de la
  forma `<palabra>-[`.

== REGLAS CRITICAS ==

- TDD por requisito, en el orden de tasks.md: R2, R8, R3, R4, R5, R6, R7, R9.
  UN COMMIT ROJO (test) y UN COMMIT VERDE (implementacion) por requisito, el
  rojo SIEMPRE antes. Convencion de mensaje (traceability.md):
    test(mobile-app-and-notification-icons): <desc> (R<n>)   rojo
    feat(mobile-app-and-notification-icons): <desc> (R<n>)   verde
  Un commit con test + implementacion juntos incumple C4 de CHECKPOINTS.md.
  R1 no tiene commit (lo cierra el reviewer con git diff). R9 es un solo
  commit de test (tasks.md: "Nada que implementar").
- Titulos LITERALES: cada describe se llama '#101 R<n>: ...' y cada it lleva
  el nombre exacto de la columna "Test" de traceability.md. El reviewer
  busca esos literales.
- Tests que NACEN VERDES (R2, R8, R9: la plantilla ya cumple IHDR / la ruta
  no cambia): el commit de test va igual, y en el reporte documentas la
  mutacion que lo pone rojo (tasks.md: `height: 1023` en R2 y R8; en R9 la
  mutacion equivalente sobre el valor esperado) y su restauracion con
  `git diff` vacio. Para R2 y R8 anota ademas `sha256sum` del PNG antes y
  despues de correr el script: deben diferir (es la prueba de que el verde
  cambio bytes aunque el IHDR fuese ya correcto).
- Rojos REALES (R3: 512x512 hoy; R4: 432x432; R5: '#E6F4FE' y backgroundImage
  presentes, fichero existe; R6: 228x213; R7: fichero no existe): pega la
  linea decisiva del fallo en el reporte.
- app.assets.test.ts: SIN mock de node:fs (lee ficheros reales). Las rutas
  salen de app.json (appJson.expo.icon, android.adaptiveIcon.*, web.favicon,
  segundo elemento del tuple del plugin), no de literales. Un it candea UN
  fichero con un unico toEqual({ width, height, bitDepth: 8, colorType: 6 });
  nunca un bucle sobre "todos los PNG".
- app.config.test.ts: las dos relajaciones de '#79 R2' van en el MISMO commit
  verde que las necesita (splash -> expect.any(Object) en el verde de R6;
  expo-notifications -> expect.objectContaining({ defaultChannel: 'default' })
  en el verde de R7). Ninguna otra asercion existente cambia; si otra se
  pone roja, la implementacion esta mal: no toques ese test, PARA y
  escribelo en el reporte.
- Script: `bun scripts/make-icons.mjs` desde mobile-pet-tracker/, API de
  jimp 0.16 (Jimp.read, resize(w, h, Jimp.RESIZE_BICUBIC), scan,
  new Jimp(1024, 1024, 0x00000000), composite(img, 174, 174), writeAsync;
  splash = fs.copyFileSync del foreground). Crece fila a fila con cada verde
  (tabla de design.md). Idempotente; sobreescribe sin preguntar. El umbral
  D5 (alfa >= 128 ? 255 : 0, R=G=B=255) se aplica a 1254 ANTES de encoger.
- Tras el verde de R3 y de R4 corre el comando de bbox de design.md
  §Verificaciones del reviewer y pega la salida en el reporte: foreground
  exactamente {x0:174,y0:174,x1:849,y1:849}; monochrome con los cuatro
  valores dentro de [174, 850]. Tras R4 y R7 corre tambien el contador de
  blancura (debe imprimir 0). Tras R6: `cmp` foreground vs splash sin salida.
- Sin anclas por numero de linea: localiza cada sitio con grep -n del texto
  citado en la spec.
- bun para todo en movil (bun, bunx); nunca npx ni npm. CERO dependencias
  nuevas: package.json y bun.lock no cambian.
- docs/conventions.md §Esperas sobre el arbol renderizado: no aplica aqui
  (ningun test renderiza componentes, no hay waitFor que escribir). Si te
  ves escribiendo uno, algo esta fuera de la spec: PARA.
- Trazabilidad: rellena specs/mobile-app-and-notification-icons/traceability.md
  con los hashes en UN unico commit final
  `docs(mobile-app-and-notification-icons): trazabilidad R1-R9` tras el
  ultimo verde. No mezcles ficheros de arnes en los commits TDD. La fila R1
  lleva el hash de tu ultimo commit y "git diff vacio"; R10 queda "pendiente"
  (es del humano).
- NO rebasees, NO mergees main, NO hagas push. Los hashes de traceability.md
  tienen que seguir existiendo cuando el reviewer los busque.
- NO son tuyos, no los toques: progress/history.md, progress/current.md,
  STATUS.md y el campo `status` de feature_list.json. Son artefactos de
  cierre del leader. Tu sitio para contarlo todo es
  progress/impl_mobile-app-and-notification-icons.md.
- NO abras la PR ni la edites. NO marques las casillas "Smoke R10": son del
  humano. No crees recursos AWS ni corras cdk.
- Si el sandbox te deniega un comando, PARA y reportalo. No lo sustituyas
  por otro que haga lo mismo con otra herramienta.
- Antes de cada `bunx tsc --noEmit`: `test ! -e .expo/types/router.d.ts; echo "exit=$?"`
  tiene que dar 0. Si existe, PARA y reportalo (nunca `rm -f`).

== ENTORNO ==

- NO corras ./init.sh. Postgres y LocalStack son compartidos con otra sesion
  y esta feature no los necesita.
- Precondiciones (tasks.md): `cd mobile-pet-tracker && bun install --frozen-lockfile`
  exit 0 (el leader ya lo corrio una vez en este worktree, repitelo igual);
  `ls node_modules/jimp-compact/dist/jimp.js` existe.
- Linea base medida por el leader en add2dade (suite movil entera, sin pipe):
    movil: 90 suites, 1913 tests, exit=0 (jest --ci, 152 s)
  La base que manda es la que TU midas al arrancar: `bun run test` entero
  desde mobile-pet-tracker/, sin pipe (`cmd; echo "exit=$?"`, nunca `cmd | tail`).
- Recuentos esperados al cierre: +1 suite y +16 tests sobre tu base
  (7 en app.assets.test.ts, 9 en app.config.test.ts). `bunx tsc --noEmit`
  exit 0.
- Cierre (tasks.md §Cierre de Codex): suite entera verde, tsc, y los tres
  git diff --stat d29d49d5 de design.md §Verificaciones del reviewer vacios
  (fuentes + expo.icon; package.json/bun.lock/src; --name-status sin A que
  no sea pet-tracker-notification-96.png).

Criterios de aceptacion: R1-R9 de requirements.md (R10 lo firma el humano).

Al terminar: escribir el resultado en progress/impl_mobile-app-and-notification-icons.md
(pwd y branch, skills cargadas = ninguna, base medida, salida de cada rojo
y cada verde, mutaciones de los tests que nacen verdes y su restauracion,
sha256 antes/despues de icon.png y favicon.png, salidas de bbox, blancura y
cmp, recuentos finales, tsc, los git diff vacios del cierre, lista de
commits con hash) y parar.
```
