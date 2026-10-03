---
feature: "mobile-app-and-notification-icons"
status: draft        # draft | approved
tags: [harness, spec, mobile]
---

# Diseño — [[mobile-app-and-notification-icons]] (#101)

> Ver [[requirements]] para los requisitos que este diseño implementa y
> [[../../docs/architecture|architecture]] para las reglas de capas del proyecto.
> Base congelada `d29d49d5`. Esta feature no toca `src/`: todo vive en
> `app.json`, PNG, un script one-off y dos ficheros de test en la raíz de
> `mobile-pet-tracker/`.

## Decisiones técnicas

- **Derivación con `jimp-compact`, sin dependencia nueva (R2–R4, R6–R8).**
  `jimp-compact@0.16.1` (API de jimp 0.16) ya está hoisted en
  `mobile-pet-tracker/node_modules/jimp-compact` como dependencia transitiva
  de `@expo/image-utils@0.11.5`. El script
  `mobile-pet-tracker/scripts/make-icons.mjs` lo importa con
  `import Jimp from 'jimp-compact'` y se ejecuta una vez con
  `bun scripts/make-icons.mjs` desde `mobile-pet-tracker/` (bun para todo en
  móvil; nunca `npx`). No se añade nada a `package.json`. Si una futura
  actualización de Expo quitara `jimp-compact`, el script deja de correr pero
  los PNG ya están versionados: la suite no depende de él.
  *Verificado:* `grep -o "RESIZE_BICUBIC\|writeAsync" node_modules/jimp-compact/dist/jimp.js`
  devuelve ambos.
- **Un script, una tabla de transformaciones.** Prescribe intención, no
  código: Codex escribe el script con la API de jimp 0.16 (`Jimp.read`,
  `image.resize(w, h, Jimp.RESIZE_BICUBIC)`, `image.scan(0, 0, w, h, fn)`
  sobre `image.bitmap.data` RGBA, `image.writeAsync(path)`; jimp escribe PNG
  RGBA de 8 bits = tipo de color 6). Rutas relativas a `assets/images/`:

  | Salida | Fuente | Transformación | IHDR esperado | R |
  |---|---|---|---|---|
  | `icon.png` | `pet-tracker-app-icon.png` | resize 1254→1024 bicúbico | 1024×1024, 6 | R2 |
  | `favicon.png` | `pet-tracker-app-icon.png` | resize 1254→48 bicúbico (directo, no desde `icon.png`) | 48×48, 6 | R8 |
  | `android-icon-foreground.png` | `pet-tracker-app-icon-foreground.png` (humano, R1) | copia byte a byte (`fs.copyFileSync`) | 1024×1024, 6 | R3 |
  | `splash-icon.png` | `android-icon-foreground.png` | copia byte a byte | 1024×1024, 6 | R6 |
  | `android-icon-monochrome.png` | `pet-tracker-app-icon-foreground.png` | `scan`: R=G=B=255, alfa intacto | 1024×1024, 6 | R4 |
  | `pet-tracker-notification-96.png` | `pet-tracker-notification-monochrome-original.png` | `scan`: alfa = (alfa ≥ 128 ? 255 : 0), R=G=B=255; **después** resize 1254→96 bicúbico | 96×96, 6 | R7 |
  | `android-icon-background.png` | — | `git rm` | no existe | R5 |

  Nada se recorta: todas las fuentes son cuadradas y el arte ya trae sus
  márgenes. El script sobreescribe sin preguntar y es idempotente.
- **`app.json` cambia exactamente cuatro cosas** (R5, R6, R7; el resto de
  claves se conserva byte a byte):
  1. `android.adaptiveIcon.backgroundColor`: `"#E6F4FE"` → `"#9460FC"`.
  2. `android.adaptiveIcon.backgroundImage`: la clave desaparece.
  3. Plugin `expo-splash-screen`: `{ "backgroundColor": "#9460FC", "image":
     "./assets/images/splash-icon.png", "imageWidth": 200 }`.
  4. Plugin `expo-notifications`: `{ "icon":
     "./assets/images/pet-tracker-notification-96.png", "color": "#9460FC",
     "defaultChannel": "default" }`.
  Las rutas `icon`, `foregroundImage`, `monochromeImage`, `web.favicon` y
  `ios.icon` no cambian (R2, R3, R4, R8, R9): cambian los bytes de los PNG,
  no las claves.
- **Por qué cada plugin acepta estos valores** (medido en el `node_modules`
  del worktree principal, SDK 57):
  - `expo-notifications/plugin/build/withNotificationsAndroid.js`: `icon` se
    reescala a `BASELINE_PIXEL_SIZE × scale` para mdpi…xxxhdpi (escalas 1,
    1.5, 2, 3, 4 → 24…96 px): la fuente de 96 px es exactamente xxxhdpi y
    nunca se amplía. `color` va a `@color/notification_icon_color` y al
    meta-data `expo.modules.notifications.default_notification_color` del
    manifest. Android dibuja el icono pequeño usando **solo el alfa** y lo
    tinta con `color`: por eso el PNG es blanco sobre transparente.
  - `@expo/prebuild-config/build/plugins/icons/withAndroidIcons.js`:
    `ADAPTIVE_BASELINE_PIXEL_SIZE = 108` dp (432 px a xxxhdpi, la fuente de
    1024 sobra); sin `backgroundImage` la capa de fondo es
    `@color/iconBackground` = `backgroundColor` (D1). `monochromeImage` se
    procesa con el mismo tamaño que el foreground: por eso los dos miden 1024.
  - `expo-splash-screen/plugin/build/getAndroidSplashConfig.js`: `imageWidth
    ?? 100`, `resizeMode ?? 'contain'`; `withAndroidSplashImages.js` genera
    `splashscreen_logo.png` a `imageWidth × multiplier` px, y
    `withAndroidSplashStyles.js` lo fija como `windowSplashScreenAnimatedIcon`
    (Android 12+). Con 200 dp la xxxhdpi pide 800 px de una fuente de 1024
    (D3).
- **Test de cabeceras `app.assets.test.ts` (R1–R8).** Nuevo fichero en la
  raíz de `mobile-pet-tracker/`, junto a `app.config.test.ts` (mismo patrón:
  `import appJson from './app.json'`, `node:fs`, `node:path`). **Sin mock de
  `node:fs`** (a diferencia de `app.config.test.ts`, que mockea `existsSync`
  para #79 R14): aquí se leen ficheros reales. Un helper local al fichero,
  `readIhdr(relativePath)`, hace `readFileSync(join(__dirname, relativePath))`,
  asevera la firma PNG (`89 50 4E 47 0D 0A 1A 0A`) y devuelve `{ width:
  buf.readUInt32BE(16), height: buf.readUInt32BE(20), bitDepth: buf[24],
  colorType: buf[25] }`. Cada `it` candea **un** fichero con un único
  `toEqual({ width, height, bitDepth: 8, colorType: 6 })`. Las rutas de
  R2–R4 y R6–R8 se leen de `app.json` (`appJson.expo.icon`,
  `android.adaptiveIcon.foregroundImage`, …, el segundo elemento del tuple
  del plugin): si alguien mueve la ruta, `app.config.test.ts` lo caza y
  este test mide el fichero nuevo. R1 usa la ruta literal de la fuente. R5
  usa `existsSync` real y espera `false`. Ocho `it` en ocho `describe`
  `#101 R<n>` — un candado por fichero, nunca un bucle sobre «todos los PNG»
  (regla de cláusulas universales).
- **Cambios en `app.config.test.ts`.** En `describe('#79 R2: …')`,
  `it('conserva los plugins existentes y añade expo-notifications')`, dos
  aserciones pasan de valor exacto a presencia, porque sus valores ahora los
  posee #101:
  - `toContainEqual(['expo-splash-screen', { backgroundColor: '#208AEF', image: './assets/images/splash-icon.png', imageWidth: 76 }])`
    → `toContainEqual(['expo-splash-screen', expect.any(Object)])`.
  - `toContainEqual(['expo-notifications', { defaultChannel: 'default' }])`
    → `toContainEqual(['expo-notifications', expect.objectContaining({ defaultChannel: 'default' })])`.
  El segundo `it` de ese `describe` y el resto del fichero no cambian. Se
  añaden nueve `describe('#101 R<n>: …')` con un `it` cada uno (literales en
  [[requirements]]): R2, R3, R4, R5, R6, R7, R8, R9 y el tuple exacto de cada
  plugin se asevera con `toContainEqual([nombre, { …tres claves… }])`
  (igualdad profunda: una clave de más o de menos rompe). Para
  `backgroundImage` ausente, castear `adaptiveIcon` como hace #79 R2 con
  `expo` (`as { backgroundImage?: string }`) y `expect(...).toBeUndefined()`.
- **Sin pantalla, sin skill de UI.** No hay componente ni ruta: no aplica
  `expo-native-ui` ni la carta. La única skill relevante para el handoff es
  la de build de Android (dev build), que nombra el leader con el catálogo de
  Codex.

## Archivos afectados

Todo en `mobile-pet-tracker/` (capa infraestructura/config; nada en
`src/`):

- `app.json` — las cuatro ediciones de arriba (R5, R6, R7).
- `app.config.test.ts` — dos relajaciones en `#79 R2` + nueve `describe` `#101`.
- `app.assets.test.ts` — **nuevo**, ocho `describe` `#101` (R1–R8).
- `scripts/make-icons.mjs` — **nuevo**, one-off (D6). No es test ni fuente
  de la app.
- `assets/images/pet-tracker-app-icon-foreground.png` — **nuevo, lo entrega
  el humano** (R1).
- `assets/images/icon.png`, `favicon.png`, `android-icon-foreground.png`,
  `android-icon-monochrome.png`, `splash-icon.png` — regenerados (R2, R8,
  R3, R4, R6).
- `assets/images/pet-tracker-notification-96.png` — **nuevo** (R7).
- `assets/images/android-icon-background.png` — **eliminado** (R5).

Intactos: `assets/expo.icon` (R9), las tres fuentes `pet-tracker-*` ya en el
árbol, `src/**`, `package.json`, `bun.lock`.

## Verificaciones del reviewer (sin test jest)

Desde `mobile-pet-tracker/`, con `bun` y el `jimp-compact` ya instalado:

- **R1, arte en el 66 % central** (x, y ∈ [174, 850]):
  `bun -e "const J=require('jimp-compact');J.read('assets/images/pet-tracker-app-icon-foreground.png').then(i=>{let x0=1e9,y0=1e9,x1=-1,y1=-1;i.scan(0,0,i.bitmap.width,i.bitmap.height,(x,y,k)=>{if(i.bitmap.data[k+3]>0){x0=Math.min(x0,x);y0=Math.min(y0,y);x1=Math.max(x1,x);y1=Math.max(y1,y)}});console.log({x0,y0,x1,y1})})"`
  → los cuatro valores dentro de `[174, 850]`.
- **R4 y R7, blancura:** mismo esquema contando píxeles con alfa > 0 y
  `(r, g, b) !== (255, 255, 255)` → debe imprimir 0 para
  `android-icon-monochrome.png` y para `pet-tracker-notification-96.png`.
- **R3, R6, copias:** `cmp assets/images/pet-tracker-app-icon-foreground.png
  assets/images/android-icon-foreground.png` y `cmp
  assets/images/android-icon-foreground.png assets/images/splash-icon.png`
  sin salida.
- **R9 y fuentes intactas:** `git diff --stat d29d49d5 --
  mobile-pet-tracker/assets/expo.icon mobile-pet-tracker/assets/images/pet-tracker-app-icon.png
  mobile-pet-tracker/assets/images/pet-tracker-notification-monochrome-original.png
  mobile-pet-tracker/assets/images/pet-tracker-notification-color-96.png` vacío.
- **Restricciones:** `git diff --stat d29d49d5 -- mobile-pet-tracker/package.json
  bun.lock mobile-pet-tracker/bun.lock mobile-pet-tracker/src` vacío.
- **Historial test-primero (C4):** cada R con su commit rojo antes del verde
  ([[tasks]]).

## Prueba de humo (gate humano, R10)

Dev build de **Android** en teléfono físico (nunca Expo Go: los PNG entran en
el binario). Humano en Windows; el teléfono aparece dos veces en Wi-Fi (IP y
mDNS), así que todo `adb` lleva `-s <ip:puerto>`.

1. `cd mobile-pet-tracker && bun install --frozen-lockfile`.
2. `adb devices -l | findstr /i "device"` → anota `<ip:puerto>`.
3. Desinstala el build anterior para que el launcher no sirva el icono
   cacheado: `adb -s <ip:puerto> uninstall com.trackermex.pettracker`.
4. Reconstruye (los iconos solo entran por prebuild):
   `bunx expo prebuild --clean --platform android` y
   `grep -c "notification_icon" android/app/src/main/AndroidManifest.xml`
   debe ser ≥ 1; luego `bunx expo run:android`.
5. **(a) Launcher:** vuelve al escritorio: el perrito sobre violeta, no el
   icono de Expo. Opcional en Android 13+ con «Iconos temáticos» activo: la
   silueta blanca tintada por el sistema (R4).
6. **(b) Splash:** `adb -s <ip:puerto> shell am force-stop
   com.trackermex.pettracker` y abre la app desde el launcher: fondo
   `#9460FC` con el perrito, sin logo de Expo ni azul `#208AEF`.
7. **(c) Notificación:** sigue `specs/mobile-push-registration/requirements.md`
   §Prueba de humo (gate humano) — R12 desde su paso 2 (iniciar sesión y
   conceder `POST_NOTIFICATIONS`) hasta que llegue una push con la app en
   segundo plano. El criterio nuevo es solo el icono: en la barra de estado y
   en la bandeja, icono pequeño blanco tintado de violeta, no el icono de
   la app ni un cuadrado gris.
8. Marca las tres casillas «Smoke R10» de [[requirements]] §Aprobación con
   dispositivo y fecha.

## Alternativas descartadas

- **Apuntar `foregroundImage` y `image` del splash directamente a
  `pet-tracker-app-icon-foreground.png`** y no commitear copias: menos
  ficheros, pero cambia dos claves más de `app.json` y mezcla fuente con
  derivado. La copia byte a byte cuesta cero y mantiene la convención
  «`pet-tracker-*` = fuente del humano».
- **Umbralizar después de reducir** (R7): contorno dentado a 96 px (D5).
- **Decodificar el PNG entero en el test** (zlib + desfiltrado) para
  candar blancura y 66 %: ~40 líneas de parser en un test para dos
  propiedades que el reviewer verifica en dos comandos. IHDR basta como
  candado de dimensiones y tipo.
- **Añadir `sharp` o `pngjs`** como devDependency: veto de cero dependencias;
  `jimp-compact` ya está.
- **Regenerar `android-icon-background.png` plano** (D1) y **borrar
  `pet-tracker-notification-color-96.png`** (D2): ver [[requirements]] §Qué
  firma además el humano.
