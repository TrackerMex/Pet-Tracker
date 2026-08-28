---
feature: "android-maps-api-key"
status: approved     # draft | approved
tags: [harness, spec, mobile]
---

# Requisitos — [[android-maps-api-key]]

> Notación EARS. Cada requisito tiene id único R<n>, inmutable una vez
> aprobado. Ver [[design]] (D1–D8) para las decisiones y la evidencia que
> las sostiene. Aplican `docs/conventions.md` (§Convenciones de la app
> móvil, tests que nombran su R-id, commit `feat(<scope>): <desc> (R<n>)`)
> y `docs/ui-guidelines.md` (C8). Feature de **configuración de build**:
> no toca `src/` de la app ni el backend, así que las capas
> domain/application/infrastructure de `docs/architecture.md` no entran en
> juego (C3 no aplica).
>
> Todo el §Contexto fijo se verificó el 2026-08-28 leyendo el código real y
> `mobile-pet-tracker/node_modules/` (Expo SDK 57.0.14,
> `react-native-maps@1.27.2`, `@expo/config-plugins`, `@expo/prebuild-config`,
> `@expo/cli`).

## Contexto fijo (no reabrir)

- **El bug**: el tab Map crashea al montar `MapView` en el dev build de
  Android con
  `java.lang.IllegalStateException: API key not found. Check that
  <meta-data android:name="com.google.android.geo.API_KEY"
  android:value="your API key"/> is in the <application> element of
  AndroidManifest.xml` (envuelto en `addViewAt: failed to insert view` de
  Fabric). `mobile-pet-tracker/app.json` no declara ninguna clave de Google
  Maps y `src/app/(tabs)/map.tsx:3` importa `MapView` sin fijar `provider`;
  en Android el proveedor siempre es Google Maps y exige clave propia. En
  Expo Go no se veía porque Expo Go embebe su clave; al pasar a dev builds
  locales (decisión 2026-08-25) el hueco quedó expuesto. Bloquea el gate R9
  de #45 `pet-lost-mode`, cuyo botón vive en ese tab.

- **`android.config.googleMaps.apiKey` NO sirve en este proyecto**
  (evidencia en [[design]] §D1): el campo solo lo consume
  `AndroidConfig.GoogleMapsApiKey.withGoogleMapsApiKey`, que
  `@expo/prebuild-config` registra únicamente como *fallback* del plugin
  legacy de `react-native-maps`
  (`build/plugins/unversioned/react-native-maps.js:45`). Como
  `react-native-maps@1.27.2` **sí** trae su propio `app.plugin.js`,
  `withStaticPlugin` resuelve ese plugin y el fallback nunca corre. Peor:
  ese plugin auto-aplicado se ejecuta con `props === undefined` y su rama
  else hace `removeMetaDataItemFromMainApplication(..., 'com.google.android.geo.API_KEY')`
  (`plugin/build/android.js`). La única vía que escribe la meta-data es
  declarar el plugin **explícitamente** con
  `androidGoogleMapsApiKey` — que es además lo que documenta
  https://docs.expo.dev/versions/v57.0.0/sdk/map-view/.

- **Orden de mods**: los `plugins` del usuario se registran al resolver la
  config (antes que la cadena legacy de `@expo/prebuild-config`) y
  `withMod` ejecuta el mod más reciente primero delegando en `nextMod`
  (`@expo/config-plugins/build/plugins/withMod.js`), así que el mod del
  usuario corre **el último** y su meta-data sobrevive al borrado del
  plugin legacy. Verificado por lectura del código, no por ejecución: la
  comprobación real es el `grep` del manifest generado (R6, paso 5).

- **`/android` y `/ios` están en `.gitignore`** (`mobile-pet-tracker/.gitignore`,
  "generated native folders"): proyecto managed, los nativos se regeneran
  con `npx expo prebuild`. La configuración vive en la config de Expo, y
  editar `AndroidManifest.xml` a mano no es una opción — se pierde en el
  siguiente prebuild.

- **Hoy existe `app.json` y NO existe `app.config.ts`**. Ningún archivo del
  repo lee `app.json` por su cuenta (`grep` sobre `*.ts|*.tsx|*.js|*.json|
  *.yml` fuera de `node_modules`: solo lo mencionan `docs/`, `specs/` y
  `progress/`); `expo-constants` está instalado pero `Constants.*` no se usa
  en `src/`. `app.json` se **mantiene** como base estática ([[design]] §D2).

- **Cómo llega la variable**: `@expo/cli` llama `loadEnvFiles()` (de
  `@expo/env`) en `prebuild`, `run:android`, `start`, `config`, `export` y
  `lint`, así que `mobile-pet-tracker/.env` se carga en `process.env`
  **completo** antes de resolver la config; el prefijo `EXPO_PUBLIC_` solo
  decide qué se *inlinea* en el bundle JS. Por eso la variable se llama
  `GOOGLE_MAPS_API_KEY_ANDROID` **sin** ese prefijo ([[design]] §D3).

- **Precedencia del entorno**: `docs/ui-guidelines.md` §Animación aún dice
  "todo debe correr en Expo Go SDK 57"; desde 2026-08-25 el smoke corre en
  dev build de Android. Esta feature asume dev build (es su razón de ser) y
  **no** actualiza esa frase (§Fuera de alcance).

## Requisitos funcionales

- **R1**: WHEN Expo resuelve la config de la app (`npx expo config`,
  `prebuild`, `run:android`, `start`) AND `GOOGLE_MAPS_API_KEY_ANDROID`
  está definida con un valor no vacío THE SYSTEM SHALL devolver una
  `ExpoConfig` que (a) conserve todas las claves de
  `mobile-pet-tracker/app.json` (`name`, `slug`, `scheme`,
  `android.package` = `com.trackermex.pettracker`, `ios`, `web`,
  `experiments.typedRoutes`, `experiments.reactCompiler` y las tres
  entradas actuales de `plugins`: `expo-router`, la tupla de
  `expo-splash-screen` y `expo-secure-store`) AND (b) añada al final de
  `plugins` la tupla
  `['react-native-maps', { androidGoogleMapsApiKey: <valor de la variable, con `trim()` aplicado> }]`.
  El nuevo archivo es `mobile-pet-tracker/app.config.ts`, con
  `export default ({ config }: ConfigContext): ExpoConfig => ...`
  ([[design]] §D2).
  *Test: `mobile-pet-tracker/app.config.test.ts` (NUEVO) →
  `describe('R1: la config resuelta inyecta la clave de Android desde el entorno', ...)`
  — importa el default export y `app.json`, lo invoca con
  `{ config: appJson.expo }` y assertea (b) con `toContainEqual`, (a) con
  `toEqual`/`toMatchObject` sobre las claves listadas, y el `trim` con un
  valor rodeado de espacios. ROJO primero.*

- **R2**: IF `GOOGLE_MAPS_API_KEY_ANDROID` falta, está vacía o es solo
  espacios THEN THE SYSTEM SHALL devolver la config **sin** ninguna entrada
  `react-native-maps` en `plugins` (idéntica a la de `app.json`, sin
  placeholder ni clave vacía), SHALL emitir exactamente **un**
  `console.warn` que nombre `GOOGLE_MAPS_API_KEY_ANDROID`, diga que el
  build de Android quedará sin `com.google.android.geo.API_KEY` y que el
  tab Map crasheará al montar `MapView`, y remita a `docs/verification.md`
  §Feature 52, AND SHALL NOT lanzar. **No lanzar es un requisito, no una
  omisión**: el primer `prebuild` tiene que poder correr sin clave para
  generar `android/app/debug.keystore`, de donde sale la SHA-1 que Google
  Cloud pide para crear la clave restringida ([[design]] §D4).
  *Test: mismo archivo →
  `describe('R2: sin la variable no se declara el plugin y se avisa sin lanzar', ...)`
  — casos ausente / `''` / `'   '`; `jest.spyOn(console, 'warn')`;
  `expect(() => ...).not.toThrow()`; `expect(resolved.plugins).toEqual(appJson.expo.plugins)`;
  `toHaveBeenCalledTimes(1)` con `expect.stringContaining('GOOGLE_MAPS_API_KEY_ANDROID')`
  y `expect.stringContaining('docs/verification.md')` (solo esos dos
  substrings: la redacción exacta no se congela en el test). ROJO primero.*

- **R3**: WHILE la feature está en el repo THE SYSTEM SHALL mantener la
  clave fuera del control de versiones y fuera del bundle JS:
  `mobile-pet-tracker/.env.example` SHALL contener la línea
  `GOOGLE_MAPS_API_KEY_ANDROID=` **sin valor**, precedida de un comentario
  que explique para qué es, que se obtiene según `docs/verification.md`
  §Feature 52 y que el `.env` real no se commitea; el nombre SHALL NOT
  llevar prefijo `EXPO_PUBLIC_` (con ese prefijo Expo la inlinearía en el
  bundle JS, legible por cualquiera que abra el APK); AND `.env.example`
  SHALL NOT contener ninguna clave con forma de credencial de Google
  (`/AIza[0-9A-Za-z_-]{10,}/`).
  *Test: mismo archivo →
  `describe('R3: la clave viaja por entorno, nunca por el repo', ...)`
  — lee `.env.example` con `readFileSync(join(__dirname, '.env.example'), 'utf8')`
  y assertea `/^GOOGLE_MAPS_API_KEY_ANDROID=\s*$/m`, ausencia de
  `EXPO_PUBLIC_GOOGLE` y ausencia del patrón `AIza…`. ROJO primero.*
  *(`mobile-pet-tracker/.gitignore` ya ignora `.env` y `.env*.local` — se
  verifica, no se modifica. `env-drift.mjs` solo compara el `.env` de la
  raíz, así que esta línea no genera avisos de deriva en `init.sh`.)*

- **R4**: WHEN el implementer cierra la feature THE SYSTEM SHALL tener en
  `docs/verification.md` una sección `### Feature 52 — android-maps-api-key`
  con estos pasos, en este orden y con los comandos literales:
  1. Prebuild inicial sin clave para generar `android/` y
     `android/app/debug.keystore`:
     `cd mobile-pet-tracker && npx expo prebuild --clean --platform android`
     (avisa por consola, no aborta — R2).
  2. SHA-1 del keystore de debug:
     `cd mobile-pet-tracker/android && ./gradlew signingReport`
     (Windows: `gradlew.bat signingReport`), o
     `keytool -J-Duser.language=en -list -v -keystore app/debug.keystore -alias androiddebugkey -storepass android -keypass android`
     — el flag `-J-Duser.language=en` es obligatorio porque en locale
     español `keytool` revienta con `MissingFormatArgumentException`.
  3. Google Cloud (humano): habilitar **Maps SDK for Android**, crear clave
     de API y restringirla por aplicación Android con nombre de paquete
     `com.trackermex.pettracker` + la SHA-1 del paso 2, y por API a solo
     Maps SDK for Android. Requiere billing activo.
  4. Inyectar la clave sin commitearla: `cp .env.example .env` si falta y
     editar `GOOGLE_MAPS_API_KEY_ANDROID=<clave>` en
     `mobile-pet-tracker/.env`.
  5. Regenerar el dev build (obligatorio tras crear o rotar la clave: se
     escribe en `AndroidManifest.xml` en tiempo de prebuild):
     `npx expo prebuild --clean --platform android`, comprobar
     `grep -c "com.google.android.geo.API_KEY" android/app/src/main/AndroidManifest.xml`
     → debe imprimir `1` (sin pegar el valor en ningún reporte), y
     `bunx expo run:android`. Aviso: si tras un `--clean` el
     `signingReport` devuelve otra SHA-1, actualizar la restricción de la
     clave en Google Cloud antes de reintentar.
  6. Los pasos de smoke de R6 y dónde registrar el resultado.
  AND SHALL incluir la nota de que para EAS Build la clave se crea aparte
  con `eas env:create --name GOOGLE_MAPS_API_KEY_ANDROID --visibility secret --environment development`
  y exige añadir `"environment": "development"` al perfil `development` de
  `eas.json` — **documentado, no implementado ni verificado**
  ([[design]] §D6).
  *Sin test propio (documentación). Verificación: el reviewer comprueba que
  la sección existe con los seis pasos y que los comandos coinciden con los
  de esta lista.*

- **R5**: WHEN se ejecutan `bun run typecheck`, `bun run lint` y
  `bun run test` en `mobile-pet-tracker/` y `./init.sh` en la raíz tras los
  cambios THE SYSTEM SHALL salir con exit 0 y con **todas** las suites
  existentes intactas (ningún test previo modificado ni borrado); AND el
  diff SHALL tocar SOLO: `mobile-pet-tracker/app.config.ts` (nuevo),
  `mobile-pet-tracker/app.config.test.ts` (nuevo),
  `mobile-pet-tracker/.env.example`, `docs/verification.md`, más `specs/`,
  `progress/` y `feature_list.json` (harness); AND
  `mobile-pet-tracker/app.json`, `mobile-pet-tracker/eas.json`,
  `mobile-pet-tracker/package.json`, `bun.lock`,
  `mobile-pet-tracker/src/**` (incluido `src/app/(tabs)/map.tsx`) y
  `backend-pet-tracker/**` SHALL quedar sin cambios (cero dependencias
  nuevas); AND el grep-clean C8 SHALL seguir limpio (cero hex fuera de
  `src/theme/`, cero clases arbitrarias `[...]`, cero `StyleSheet.create`)
  — trivial, porque `src/` no se toca.
  *Verificación: el implementer anota los comandos y su salida en
  `progress/impl_android-maps-api-key.md`; el reviewer los re-ejecuta y
  corre `git diff --stat main...HEAD` contra esa allowlist. Sin test propio.*

## Prueba de humo del humano

- **R6**: WHEN el humano, con la clave ya creada y restringida (R4 pasos
  1–4) y el backend local arriba (`docker compose up -d` +
  `pnpm -C backend-pet-tracker run start:dev`, `mobile-pet-tracker/.env`
  con la IP LAN en `EXPO_PUBLIC_API_URL`), regenera e instala el dev build
  con `npx expo prebuild --clean --platform android` + `bunx expo run:android`:
  1. `grep -c "com.google.android.geo.API_KEY" android/app/src/main/AndroidManifest.xml`
     imprime `1`.
  2. Login → tab **Map**: la pantalla monta **sin crash** y la vista nativa
     del mapa se crea — el watermark "Google" es visible, que es lo que
     dibuja la propia vista de Google Maps.
  3. `adb logcat` no muestra `IllegalStateException: API key not found`,
     ni `addViewAt: failed to insert view`, ni `Authorization failure` /
     `API_KEY_ANDROID_APP_BLOCKED`. Si aparece alguno de estos dos últimos,
     la clave existe pero la restricción package + SHA-1 no coincide:
     repetir R4 pasos 2–3.
  4. Desbloqueo: correr acto seguido el smoke R9 de
     `specs/pet-lost-mode/requirements.md`, cuyo botón vive en la tarjeta
     superpuesta de este mismo tab y no depende de los tiles.

  **Acotación de alcance (2026-08-28)**: R6 verifica la clave, no el render
  del mapa. Que el tab pinte tiles, marker y polyline **no** es criterio de
  esta feature: con la clave ya aceptada por el SDK, el mapa sigue mostrando
  solo el watermark porque el `GoogleMap` nunca llega a `onMapReady`. Ese
  fallo es independiente, precede a esta feature (lo tapaba el crash por
  clave ausente) y se rastrea en **#54 `android-map-never-ready`**. Redactada
  la R6 original con "renderiza tiles de Google", quedaría bloqueada por un
  defecto ajeno a su diff.

  **Este requisito SOLO lo cierra el humano** (crear la clave cuesta dinero
  y exige cuenta Google con billing; el dev build corre en su máquina).
  Registra el resultado en `progress/impl_android-maps-api-key.md` **sin
  pegar el valor de la clave**.

## Fuera de alcance

- **Clave de Google Maps para iOS** (`iosGoogleMapsApiKey`): en iOS el
  proveedor por defecto es Apple Maps y no necesita clave; el plugin solo
  activa Google Maps en iOS si se le pasa esa prop, que no se pasa. iOS
  queda exactamente como hoy.
- **Tocar `src/app/(tabs)/map.tsx`**: no se fija `provider`, no se migra a
  `src/screens/map/` (#39 no migra pantallas en frío) y no se toca su
  suite. En Android el proveedor por defecto ya es Google Maps; fijarlo
  explícito no arregla nada y `PROVIDER_GOOGLE` en iOS obligaría a una
  segunda clave.
- **Plumbing real de EAS Build** (`eas env:create`, `"environment"` en
  `eas.json`): se documenta en `docs/verification.md` (R4) pero no se
  implementa — hoy nadie corre `eas build` (el dev build es local desde
  2026-08-25) y ninguna IA puede verificarlo sin gastar builds
  ([[design]] §D6).
- **Migrar a `expo-maps`**: sustituir `react-native-maps` es una feature
  propia; además también exige clave de Android, así que no evita este
  trabajo.
- **Que el mapa pinte tiles, marker y polyline**: con la clave aceptada por
  el SDK, el `GoogleMap` nunca alcanza `onMapReady`, así que la vista se
  queda en el watermark. Defecto independiente de este diff, rastreado en
  **#54 `android-map-never-ready`** (ver acotación en R6).
- **Crear, restringir, rotar o pagar la clave**, y cualquier configuración
  en la consola de Google Cloud: gate humano (R6).
- **Commitear `android/`** o editar `AndroidManifest.xml` a mano.
- **Actualizar `docs/ui-guidelines.md`** §Animación ("todo debe correr en
  Expo Go SDK 57") a la realidad de dev builds: deriva documental real,
  pero cambiarla afecta a toda decisión de UI futura y merece su propia
  entrada de backlog.
- **CI**: `.github/workflows/ci.yml` no ejecuta ningún comando de Expo que
  resuelva la config (solo `init.sh` → jest/eslint/tsc), así que no
  necesita la variable ni cambia.

## Aprobación

- [X] Aprobado por humano (fecha: 2026-08-27) ← gate obligatorio antes de implementar
- [X] R6 smoke en el dev build de Android ejecutado por humano (fecha: ____) ← gate obligatorio antes de `done`
