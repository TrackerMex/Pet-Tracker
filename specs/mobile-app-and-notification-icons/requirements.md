---
feature: "mobile-app-and-notification-icons"
status: approved     # draft | approved
tags: [harness, spec, mobile]
---

# Requisitos — [[mobile-app-and-notification-icons]] (#101)

> Notación EARS. Cada requisito tiene id único R<n>, inmutable una vez aprobado.
> Ver [[design]] para las decisiones técnicas y [[../../docs/architecture|architecture]]
> para las reglas de arquitectura que la implementación debe respetar.

## Contexto y dependencias

La app móvil sigue con los iconos de la plantilla de Expo: launcher, adaptive
icon, splash (logo de Expo sobre `#208AEF`), favicon, y las notificaciones
salen con el icono de la app porque el plugin `expo-notifications` solo
declara `defaultChannel`. El humano aprobó el diseño (perrito robótico
violeta) y versionó las fuentes en PR #187 (`5d3dfdca`). Esta feature deriva
de esas fuentes todos los PNG que `app.json` referencia, apunta `app.json` a
ellos y los candea con tests que leen la cabecera PNG.

> **Base congelada: `d29d49d5`** (`origin/main`, 2026-10-03). Todo hecho de
> esta spec se midió sobre ese commit o sobre los PNG que ya están en él.
> Anclas por contenido grepeable, nunca por número de línea.
>
> **Fuentes ya en el árbol** (`mobile-pet-tracker/assets/images/`, medidas
> con la cabecera IHDR y el canal alfa decodificado con `zlib` de Python):
>
> | Fichero | IHDR | Alfa |
> |---|---|---|
> | `pet-tracker-app-icon.png` | 1254×1254, 8 bits, tipo 2 (RGB) | sin alfa; fondo degradado violeta |
> | `pet-tracker-notification-monochrome-original.png` | 1254×1254, 8 bits, tipo 6 (RGBA) | bimodal: 999 730 px a 0, 386 543 px en 240–254, solo 4 955 a 255 y ~17 000 px de borde en 16–239; RGB medio 253 (ya es blanco) |
> | `pet-tracker-notification-color-96.png` | 96×96, 8 bits, tipo 6 | variante en color: **no** es icono de notificación (Android usa solo el alfa) |
>
> **Estado previo de `app.json`** (`grep -n` sobre `d29d49d5`): `"icon":
> "./assets/images/icon.png"` (plantilla, 1024×1024 RGBA);
> `android.adaptiveIcon` con `backgroundColor "#E6F4FE"`, `foregroundImage`
> y `backgroundImage` de 512×512 y `monochromeImage` de 432×432 (plantilla);
> `ios.icon "./assets/expo.icon"`; `web.favicon` 48×48; plugin
> `expo-splash-screen` con `backgroundColor "#208AEF"`, `image
> "./assets/images/splash-icon.png"` (228×213, logo de Expo) e `imageWidth
> 76`; plugin `expo-notifications` con `{ "defaultChannel": "default" }`.
>
> **Candados previos que esta feature mueve** (`mobile-pet-tracker/app.config.test.ts`,
> `describe('#79 R2: app.json declara el plugin de notificaciones y
> POST_NOTIFICATIONS')`, `it('conserva los plugins existentes y añade
> expo-notifications')`): asevera el tuple exacto del splash
> (`#208AEF`, `splash-icon.png`, `imageWidth: 76`) y el tuple exacto de
> `expo-notifications` (`{ defaultChannel: 'default' }`). Las dos aserciones
> dejan de ser verdad con R6 y R7; [[design]] §Cambios en app.config.test.ts
> fija cómo se relajan (presencia) y qué `it` nuevo hereda los valores.
>
> **Herramienta de derivación, sin dependencia nueva.** `jimp-compact@0.16.1`
> ya está en `mobile-pet-tracker/node_modules/jimp-compact` (hoisted; llega
> como dependencia de `@expo/image-utils@0.11.5`, que a su vez trae
> `@expo/cli`). Medido en el `node_modules` del worktree principal; el
> worktree de esta feature no tiene `node_modules` hasta `bun install`.
> Un script one-off `mobile-pet-tracker/scripts/make-icons.mjs` la usa; no
> entra en la suite (`jest-expo` solo recoge `*.test.*`) ni en `tsc`
> (`tsconfig.json` incluye solo `**/*.ts(x)`).
>
> **Dependencias de feature:** ninguna abierta. #79 (`mobile-push-registration`,
> `done`) aporta el plugin y la prueba de humo de push que R10 reutiliza.
> #60 (iOS) sigue aparcada: `ios.icon` no se toca (R9).
>
> **`docs/ui-guidelines.md`** no tiene sección de iconos de app, splash ni
> branding (`grep -n -i 'icon\|splash\|brand'` solo devuelve el icono de
> componente de fila): no hay regla de la carta que aplique. Esta feature no
> renderiza pantallas, así que no aplica el grep-clean ni las dimensiones de
> pantalla.
>
> **Base de tests sin medir.** Esta spec no corre jest. Referencia: `STATUS.md`
> cita móvil **90 suites / 1913 tests** tras integrar #146 y #147. Delta
> estimado de esta spec: **+1 suite, +15 tests** (7 en `app.assets.test.ts`,
> 8 en `app.config.test.ts`; errata del 2026-10-03: decía +16/9, pero los literales de R2–R9 son ocho). El leader re-mide al preparar el handoff.
>
> **Regla de prefijo:** todo `describe` nuevo nombra `#101 R<n>`; nunca un
> `#101` suelto en código ni en tests.

## Qué firma además el humano al aprobar esta spec

Decisiones cerradas por el humano el 2026-10-03 (no se reabren): tinte de
notificación `#9460FC`; `adaptiveIcon.backgroundColor` plano `#9460FC`;
splash con el perrito sobre `#9460FC` dentro de esta feature; `ios.icon`
intacto; `web.favicon` regenerado; **las tres fuentes de `5d3dfdca` y
`463c1ee9` son todo el arte: no hay cuarto asset** (cerrado el 2026-10-03 al
revisar el borrador; de ahí D7).

Decisiones que toma esta spec y que el humano firma con la aprobación:

- **D1 — `backgroundImage` se elimina**, clave y fichero
  (`android-icon-background.png`). Con `backgroundColor` plano, un PNG de
  fondo es un segundo sitio donde vive el mismo color; `@expo/prebuild-config`
  (`withAndroidIcons.js`) usa `@color/iconBackground` cuando no hay
  `backgroundImage`. *Alternativa:* regenerar un PNG plano 1024×1024; se
  descarta por redundante.
- **D2 — `pet-tracker-notification-color-96.png` se queda en el árbol sin
  referencia.** No es icono de notificación; lo versionó el humano en
  `463c1ee9` y no cuesta nada dejarlo (como `react-logo*.png` o
  `tutorial-web.png`, también huérfanos de la plantilla). No se borra ni se
  referencia. *Alternativa:* `git rm`; se descarta por tocar un asset
  aprobado por el humano sin necesidad.
- **D3 — `imageWidth: 200`** en el splash (hoy 76; el default del plugin en
  SDK 57 es 100, `getAndroidSplashConfig.js`: `root.imageWidth ?? 100`).
  El plugin genera `splashscreen_logo.png` a `imageWidth × densidad` px en
  modo `contain`: con 200 dp, xxxhdpi pide 800 px y la fuente de 1024 no se
  reescala hacia arriba (con 100 dp se tiraría la mitad de la resolución).
  En Android 12+ el sistema pinta `windowSplashScreenAnimatedIcon` dentro de
  un círculo de 240 dp del que solo el 66 % central (160 dp) está
  garantizado: el icono ocupa el 66 % central del PNG de 1024 (R3, D7), es
  decir ~133 dp de los 200, y cabe. Con `imageWidth` mayor que 240 el borde
  del icono saldría del círculo.
- **D4 — `splash-icon.png` es una copia byte a byte del foreground**
  (`android-icon-foreground.png`). Las dos superficies exigen la misma
  geometría (arte en el 66 % central) y así hay una sola fuente de verdad.
  Se conserva la ruta `./assets/images/splash-icon.png` para no cambiar más
  claves de `app.json` que las necesarias.
- **D5 — umbral de alfa 128** para las dos derivadas de la silueta (R4, R7),
  aplicado a 1254×1254 **antes** de reducir (a 676 para R4, a 96 para R7).
  El alfa de la fuente es bimodal (tabla de arriba): el umbral conserva
  395 091 px, recorta los ~17 000 px de borde semitransparente (y los 48 px
  de alfa 1 pegados a x = 0) y la reducción bicúbica vuelve a suavizar el
  contorno. Umbralizar después de reducir dejaría el contorno dentado.
- **D6 — el script de derivación se commitea** en
  `mobile-pet-tracker/scripts/make-icons.mjs` para que la próxima vez que
  cambie el arte baste con volver a correrlo. No añade dependencia y no entra
  en ningún gate (ver §Contexto).
- **D7 — el foreground del adaptive icon es el icono completo encajado en la
  zona segura**, no un perrito recortado sobre transparente. El arte de
  `pet-tracker-app-icon.png` llena el lienzo (la silueta llega al 97 % del
  ancho) y no existe el perrito sin fondo a resolución útil (`color-96` mide
  96 px). Receta: lienzo transparente de 1024×1024, el icono reducido de 1254
  a 676 (66 %) y compuesto en (174, 174); el resto del lienzo es alfa 0 y lo
  pinta `backgroundColor`. Consecuencia visual que el humano firma: el
  launcher muestra el icono completo (perrito sobre su degradado) recortado
  por la forma del launcher, con las orejas enteras; el borde de paralaje y
  las esquinas del squircle los pinta `#9460FC`, a 4–7 niveles del borde del
  degradado (`#9863FC` arriba, `#8E59FC` abajo), por debajo de lo
  perceptible. El splash hereda el mismo PNG (D4): cuadrado del icono de
  ~132 dp sobre `#9460FC` en Android < 12 y disco recortado por el sistema en
  Android 12+. *Alternativas descartadas:* (a) esperar un cuarto asset con el
  perrito sobre transparente: el humano cerró que las tres fuentes son todo
  el arte; (b) enmascarar el icono con el alfa de `monochrome-original`: la
  silueta tiene los ojos huecos y no está alineada píxel a píxel con el icono;
  (c) chroma key sobre el degradado: la cara del perrito es del mismo violeta
  que el fondo.

## Requisitos

Todos los requisitos se verifican desde `mobile-pet-tracker/`. Rutas de PNG
relativas a `mobile-pet-tracker/assets/images/` salvo que se diga otra cosa.
`IHDR(w, h, tipo)` significa: los bytes 0–7 son la firma PNG, `readUInt32BE(16)`
= `w`, `readUInt32BE(20)` = `h`, byte 24 (profundidad) = 8 y byte 25 (tipo
de color) = `tipo`. Tipo 6 = RGBA.

- **R1 — Fuentes del humano intactas.** WHILE la feature esté abierta THE
  SYSTEM SHALL conservar byte a byte las tres fuentes de `d29d49d5`:
  `pet-tracker-app-icon.png` (`IHDR(1254, 1254, 2)`),
  `pet-tracker-notification-monochrome-original.png` (`IHDR(1254, 1254, 6)`)
  y `pet-tracker-notification-color-96.png` (`IHDR(96, 96, 6)`); todo PNG
  derivado sale de ellas por el script (D6, D7) y no entra ningún asset nuevo
  del humano. *Sin test jest:* lo verifica el reviewer con `git diff --stat
  d29d49d5 --` sobre las tres rutas vacío ([[design]] §Verificaciones del
  reviewer).

- **R2 — Icono de la app.** WHEN se corre el script de derivación THE SYSTEM
  SHALL escribir `icon.png` con `IHDR(1024, 1024, 6)`, resultado de reducir
  `pet-tracker-app-icon.png` de 1254 a 1024 (bicúbico, sin recorte), AND
  `app.json` SHALL mantener `"icon": "./assets/images/icon.png"`.
  *Tests:* `app.assets.test.ts`, `describe('#101 R2: icono de la app')`,
  `it('icon.png (expo.icon) mide 1024x1024 RGBA')`; `app.config.test.ts`,
  `describe('#101 R2: icono de la app')`,
  `it('expo.icon es ./assets/images/icon.png')`.

- **R3 — Foreground del adaptive icon.** WHEN se corre el script THE SYSTEM
  SHALL escribir `android-icon-foreground.png` con `IHDR(1024, 1024, 6)`:
  lienzo transparente de 1024×1024 con `pet-tracker-app-icon.png` reducido de
  1254 a 676 (bicúbico, sin recorte) compuesto en (174, 174), de modo que
  todo píxel con alfa > 0 queda en el cuadrado central del 66 % (x e y en
  `[174, 850]`) (D7), AND `app.json` SHALL mantener
  `android.adaptiveIcon.foregroundImage =
  "./assets/images/android-icon-foreground.png"`.
  *Tests:* `app.assets.test.ts`, `describe('#101 R3: foreground del adaptive
  icon')`, `it('android-icon-foreground.png (adaptiveIcon.foregroundImage)
  mide 1024x1024 RGBA')`; `app.config.test.ts`, `describe('#101 R3:
  foreground del adaptive icon')`, `it('android.adaptiveIcon.foregroundImage
  es ./assets/images/android-icon-foreground.png')`. La zona segura la
  verifica el reviewer con [[design]] §Verificaciones del reviewer.

- **R4 — Monochrome del adaptive icon.** WHEN se corre el script THE SYSTEM
  SHALL escribir `android-icon-monochrome.png` con `IHDR(1024, 1024, 6)`
  derivado de `pet-tracker-notification-monochrome-original.png` con la
  receta de D5 (alfa ≥ 128 pasa a 255 y el resto a 0; R, G y B a 255 en
  todos los píxeles) y **después** reducido de 1254 a 676 (bicúbico, sin
  recorte) y compuesto en (174, 174) sobre un lienzo transparente de
  1024×1024 (silueta blanca en la zona segura: medido sobre la fuente, el
  alfa ≥ 128 cae en x `[206, 817]`, y `[251, 773]`), AND `app.json` SHALL
  mantener `android.adaptiveIcon.monochromeImage =
  "./assets/images/android-icon-monochrome.png"`.
  *Tests:* `app.assets.test.ts`, `describe('#101 R4: monochrome del adaptive
  icon')`, `it('android-icon-monochrome.png (adaptiveIcon.monochromeImage)
  mide 1024x1024 RGBA')`; `app.config.test.ts`, `describe('#101 R4:
  monochrome del adaptive icon')`,
  `it('android.adaptiveIcon.monochromeImage es
  ./assets/images/android-icon-monochrome.png')`. La blancura y la zona
  segura las verifica el reviewer con [[design]] §Verificaciones del
  reviewer.

- **R5 — Fondo plano del adaptive icon.** WHEN se lee `app.json` THE SYSTEM
  SHALL declarar `android.adaptiveIcon.backgroundColor = "#9460FC"` y no
  declarar `backgroundImage`, AND `assets/images/android-icon-background.png`
  SHALL no existir en el árbol (D1).
  *Tests:* `app.config.test.ts`, `describe('#101 R5: fondo plano del adaptive
  icon')`, `it('android.adaptiveIcon.backgroundColor es #9460FC y no declara
  backgroundImage')`; `app.assets.test.ts`, `describe('#101 R5: fondo plano
  del adaptive icon')`, `it('android-icon-background.png ya no existe en
  assets/images')` (`existsSync` real, sin mock).

- **R6 — Splash.** WHEN se lee `app.json` THE SYSTEM SHALL declarar el plugin
  `["expo-splash-screen", { "backgroundColor": "#9460FC", "image":
  "./assets/images/splash-icon.png", "imageWidth": 200 }]` con exactamente
  esas tres claves, AND `splash-icon.png` SHALL ser copia byte a byte de
  `android-icon-foreground.png` con `IHDR(1024, 1024, 6)` (D3, D4).
  *Tests:* `app.config.test.ts`, `describe('#101 R6: splash con el perrito
  sobre violeta')`, `it('el plugin expo-splash-screen declara splash-icon.png
  sobre #9460FC con imageWidth 200')`; `app.assets.test.ts`,
  `describe('#101 R6: splash con el perrito sobre violeta')`,
  `it('splash-icon.png (plugin expo-splash-screen) mide 1024x1024 RGBA')`.

- **R7 — Icono de notificación.** WHEN se lee `app.json` THE SYSTEM SHALL
  declarar el plugin `["expo-notifications", { "icon":
  "./assets/images/pet-tracker-notification-96.png", "color": "#9460FC",
  "defaultChannel": "default" }]` con exactamente esas tres claves, AND
  `pet-tracker-notification-96.png` SHALL tener `IHDR(96, 96, 6)` derivado
  de `pet-tracker-notification-monochrome-original.png` así: alfa ≥ 128 pasa
  a 255 y el resto a 0, R, G y B a 255 en todos los píxeles, y después
  reducción bicúbica de 1254 a 96 sin recorte (D5).
  *Tests:* `app.config.test.ts`, `describe('#101 R7: icono de notificación
  blanco tintado')`, `it('el plugin expo-notifications declara icon
  pet-tracker-notification-96.png, color #9460FC y defaultChannel default')`;
  `app.assets.test.ts`, `describe('#101 R7: icono de notificación blanco
  tintado')`, `it('pet-tracker-notification-96.png (plugin expo-notifications)
  mide 96x96 RGBA')`.

- **R8 — Favicon.** WHEN se corre el script THE SYSTEM SHALL escribir
  `favicon.png` con `IHDR(48, 48, 6)`, reducción bicúbica directa de
  `pet-tracker-app-icon.png` (1254 → 48, sin pasar por `icon.png`), AND
  `app.json` SHALL mantener `web.favicon = "./assets/images/favicon.png"`.
  *Tests:* `app.assets.test.ts`, `describe('#101 R8: favicon')`,
  `it('favicon.png (web.favicon) mide 48x48 RGBA')`; `app.config.test.ts`,
  `describe('#101 R8: favicon')`,
  `it('web.favicon es ./assets/images/favicon.png')`.

- **R9 — iOS intacto.** WHILE #60 siga aparcada THE SYSTEM SHALL mantener
  `ios.icon = "./assets/expo.icon"` y `mobile-pet-tracker/assets/expo.icon`
  sin cambios respecto a `d29d49d5`.
  *Test:* `app.config.test.ts`, `describe('#101 R9: iOS intacto')`,
  `it('ios.icon sigue siendo ./assets/expo.icon')`. Que `assets/expo.icon` no
  cambie lo verifica el reviewer con `git diff --stat d29d49d5 --
  mobile-pet-tracker/assets/expo.icon` vacío.

- **R10 — Prueba en dispositivo (gate humano propio).** WHEN el humano
  reconstruye el **dev build de Android** (prebuild limpio + `run:android`;
  los PNG no viajan por Metro ni por OTA) THE SYSTEM SHALL mostrar (a) en el
  launcher el icono completo (perrito sobre su degradado) recortado por la
  forma del launcher, con las orejas enteras (D7), (b) un splash violeta
  `#9460FC` con el icono y sin logo de Expo ni fondo azul, y (c) en una notificación
  push real recibida con la app en segundo plano, el icono pequeño blanco
  tintado de `#9460FC` y no el icono de la app. Pasos en [[design]] §Prueba
  de humo. Sin test jest: la casilla de §Aprobación «Smoke R10» es el
  candado y la feature no se marca `done` sin ella.

## Restricciones (las verifica el reviewer, sin R-id)

- **Cero dependencias nuevas:** `git diff d29d49d5 --stat --
  mobile-pet-tracker/package.json bun.lock mobile-pet-tracker/bun.lock` vacío
  y `bun install --frozen-lockfile` exit 0.
- **Sin copy nuevo:** `git diff d29d49d5 --stat -- mobile-pet-tracker/src/i18n`
  vacío; `language-provider.test.tsx` no cambia su recuento.
- **Suite móvil completa verde** y `tsc --noEmit` exit 0 (recordar borrar
  `.expo/types/router.d.ts` obsoleto antes del typecheck; en el handoff a
  Codex, `test ! -e`, no `rm -f`).
- **Un solo escritor:** solo se tocan `mobile-pet-tracker/app.json`,
  `app.config.test.ts`, `app.assets.test.ts` (nuevo), `scripts/make-icons.mjs`
  (nuevo) y los PNG listados en [[design]] §Archivos afectados. Ningún
  fichero bajo `src/`. Las tres fuentes `pet-tracker-*` son R1.

## Fuera de alcance

- iOS entero: `ios.icon`, `assets/expo.icon`, splash de iOS, cualquier
  `ios.*` de los plugins. Aparcado en #60.
- Variante en color del icono de notificación (`largeIcon` o `color-96`):
  Android tinta el alfa y descarta el color; `pet-tracker-notification-color-96.png`
  queda sin uso (D2).
- Animación del splash (`expo-splash-screen` con `animated`/`fade`) y variante
  `dark` del splash: el fondo de marca es el mismo en los dos temas.
- Iconos de las tabs y cualquier icono de componente (`assets/images/tabIcons/`,
  `useThemeColors`): regidos por la carta de UI, no por esta feature.
- Limpieza de assets huérfanos de la plantilla (`react-logo*.png`,
  `expo-badge*.png`, `tutorial-web.png`, `logo-glow.png`).
- Publicar en tiendas (EAS Build/Submit) o un OTA: los iconos solo entran
  con un build nativo.

## Aprobación

- [x] Aprobado por humano (fecha: 2026-10-03) ← gate obligatorio antes de implementar
      Firmado desde Notion: página https://app.notion.com/p/3ee6115a9b27811d9920ded211b9c8f8,
      `Estado del gate = Aprobado`, `page_last_edited_at` 2026-10-03T19:02:43Z,
      cuenta alexfdgf32@gmail.com. Espejo del commit `7e315531`.

### Smoke R10 (gate humano propio, antes de `done`)

- [ ] Launcher con el icono completo recortado por la forma del launcher, orejas enteras (dispositivo: ________, fecha: ____)
- [ ] Splash `#9460FC` con el icono, sin logo de Expo
- [ ] Notificación push real con icono blanco tintado `#9460FC` (no el icono de la app)
