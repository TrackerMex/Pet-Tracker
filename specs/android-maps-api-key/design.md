---
feature: "android-maps-api-key"
status: draft        # draft | approved
tags: [harness, spec, mobile]
---

# Diseño — [[android-maps-api-key]]

> Ver [[requirements]] (R1–R6). Feature de **configuración de build**: el
> cambio de producción son dos archivos nuevos en la raíz de
> `mobile-pet-tracker/` (`app.config.ts` + su test) y una línea en
> `.env.example`. No entra código en `src/`, así que las capas de
> `docs/architecture.md` no aplican. Rige `docs/ui-guidelines.md` (C8):
> skill `expo:expo-overview` cargada antes de escribir esta spec; el
> implementer carga `expo:expo-overview` y sigue su ruta a
> `expo-dev-client` para el dev build.

## Decisiones técnicas

### D1 — El mecanismo es el config plugin de `react-native-maps`, no `android.config.googleMaps.apiKey` (R1)

El candidato obvio (`expo.android.config.googleMaps.apiKey`) **no
funciona en este proyecto**, y esto no es una preferencia de estilo sino
una cadena verificada el 2026-08-28 en `node_modules`:

1. `@expo/prebuild-config/build/plugins/withDefaultPlugins.js:173`
   aplica `withLegacyExpoPlugins`, que incluye el plugin unversionado de
   `react-native-maps`.
2. Ese plugin
   (`build/plugins/unversioned/react-native-maps.js:45`) se construye con
   `createLegacyPlugin({ packageName: 'react-native-maps', fallback: [AndroidConfig.GoogleMapsApiKey.withGoogleMapsApiKey, ...] })`.
   El `fallback` — el único sitio de todo el árbol que lee
   `config.android.config.googleMaps.apiKey` — solo corre **si el paquete
   no trae su propio config plugin**.
3. `react-native-maps@1.27.2` trae `app.plugin.js`, así que
   `withStaticPlugin` resuelve el plugin del paquete y el fallback nunca
   se registra ⇒ el campo `android.config.googleMaps.apiKey` es letra
   muerta aquí.
4. Además, ese plugin auto-aplicado corre con `props === undefined` y su
   rama else hace
   `removeMetaDataItemFromMainApplication(mainApplication, 'com.google.android.geo.API_KEY')`
   (`plugin/build/android.js`) — o sea, borra activamente la meta-data.

La vía que sí escribe la meta-data es declarar el plugin **explícitamente**
con props, que es justo lo que documenta la guía de SDK 57
(https://docs.expo.dev/versions/v57.0.0/sdk/map-view/):

```json
["react-native-maps", { "androidGoogleMapsApiKey": "<clave>" }]
```

Se registra durante la resolución de la config del usuario, es decir
**antes** que la cadena legacy; y como `withMod`
(`@expo/config-plugins/build/plugins/withMod.js`) ejecuta el mod más
reciente primero y delega en `nextMod`, el mod del usuario corre el
**último** y su `addMetaDataItem…` sobrevive al borrado del legacy. Esa
cadena es lectura de código, no ejecución: la comprobación empírica es el
`grep` del `AndroidManifest.xml` generado, que R4 §5 y R6 §1 hacen
obligatorio.

Solo se pasa `androidGoogleMapsApiKey`. Sin `iosGoogleMapsApiKey`, el lado
iOS del plugin deja el Podfile/AppDelegate sin Google Maps (`useGoogleMaps:
false`), que es exactamente lo que ya ocurre hoy con el plugin legacy:
iOS sigue en Apple Maps y no necesita clave.

### D2 — `app.config.ts` dinámico con `app.json` como base estática (R1)

`app.json` **se mantiene tal cual y no se toca**. Expo resuelve primero el
config estático y se lo pasa al dinámico en `ConfigContext.config`; el
nuevo `mobile-pet-tracker/app.config.ts` hace
`export default ({ config }: ConfigContext): ExpoConfig => ({ ...config, plugins: [...(config.plugins ?? []), <tupla si hay clave>] })`.
Alternativa descartada: mover todo el JSON a TypeScript — churn grande,
diff ilegible y ninguna ganancia (el 100 % de la config es estática salvo
esta clave). Nada más del repo lee `app.json` directamente (verificado por
grep; `Constants.*` no aparece en `src/`), así que la convivencia de los
dos archivos no rompe a nadie.

Dos trampas de tipos que el implementer debe conocer para que
`bun run typecheck` (`tsc --noEmit`, `strict: true`) pase:

- `ConfigContext.config` es `Partial<ExpoConfig>`, así que el retorno
  tipado `ExpoConfig` exige `name` y `slug` presentes: se resuelven con
  `config.name ?? 'mobile-pet-tracker'` / `config.slug ?? 'mobile-pet-tracker'`
  (mismos valores que `app.json`). Nada de `as ExpoConfig`: el cast
  escondería justo la clase de error que R1 verifica, y el test assertea
  que `name`/`slug` resueltos coinciden con los de `app.json`.
- La tupla del plugin puede ensancharse a `string[]` al concatenarla;
  tiparla explícitamente como
  `[string, { androidGoogleMapsApiKey: string }]` evita el error.

`app.config.ts` entra en `tsconfig.json` (`include: ["**/*.ts", ...]`) y lo
lint-ea `expo lint`: ambos ya cubren la raíz del proyecto móvil.

### D3 — `GOOGLE_MAPS_API_KEY_ANDROID`, sin prefijo `EXPO_PUBLIC_` (R1, R3)

`@expo/cli` llama `loadEnvFiles()` de `@expo/env` en `prebuild`,
`run:android`, `start`, `config`, `export` y `lint`
(`@expo/cli/build/src/utils/nodeEnv.js` y sus callers), de modo que
**todas** las variables de `mobile-pet-tracker/.env` están en
`process.env` cuando se evalúa `app.config.ts`. El prefijo `EXPO_PUBLIC_`
no controla la carga sino el *inlining en el bundle JS*: usarlo aquí
metería la clave en el JavaScript del APK, legible por cualquiera. Por eso
el nombre va sin prefijo — la clave solo tiene que llegar al proceso del
CLI, no al runtime de la app.

Se aplica `.trim()` al leerla: el copy-paste desde la consola de Google
arrastra espacios y un valor con espacio se escribiría tal cual en el
manifest, produciendo un fallo de autorización difícil de leer.

### D4 — Avisar, no lanzar, cuando falta la clave (R2)

Tentador hacer que la config aborte si falta la variable (patrón
`MissingMediaBucketNameError` del backend, #51). Aquí sería un
**deadlock**: Google Cloud exige la SHA-1 del keystore para crear la clave
restringida, la SHA-1 sale de `android/app/debug.keystore`, y ese keystore
lo genera `expo prebuild` — que no podría correr sin la clave. Además el
throw rompería `expo start`/`expo lint` para cualquiera que trabaje en
pantallas que no son el mapa, y CI no tiene la variable.

Así que: un `console.warn` explícito (nombra la variable, dice que el APK
saldrá sin `com.google.android.geo.API_KEY` y que el tab Map crasheará al
montar `MapView`, y remite a `docs/verification.md` §Feature 52) y la
config sigue resolviendo, dejando `plugins` idéntico a `app.json`. Sin
clave el comportamiento es exactamente el de hoy (meta-data ausente), no
uno nuevo: la feature no puede empeorar el estado actual, solo arreglarlo
cuando hay clave. El texto del aviso puede redactarse en español, como los
guards del backend; el test solo fija dos substrings
(`GOOGLE_MAPS_API_KEY_ANDROID` y `docs/verification.md`) para que la
redacción no quede congelada.

### D5 — Qué puede probar jest de verdad, y qué no (R1–R3)

Esto es config de build: jest **no** ejecuta `prebuild` ni escribe un
`AndroidManifest.xml`, y montar un test que lo haga (spawnear el CLI,
descargar el template nativo) sería lento, dependiente de red y frágil.
El corte honesto:

- **Sí se testea** (`mobile-pet-tracker/app.config.test.ts`): la función
  exportada por `app.config.ts` es pura respecto de `process.env`, así que
  se invoca con `{ config: appJson.expo }` y se assertea la config
  resuelta. Eso cubre exactamente la regresión que causó el bug — que la
  clave no llegue a la config — y el contrato de contención de R3. Un test
  que falla si alguien borra el `...config`, cambia el nombre de la
  variable, quita el plugin o pega una clave en `.env.example`.
- **No se testea en jest**: que `@expo/config-plugins` escriba realmente
  la meta-data, que Google acepte la restricción, que el mapa pinte tiles.
  Eso es el `grep` del manifest + el smoke humano (R4 §5, R6). Se dice
  aquí para que nadie confunda "suite verde" con "el mapa funciona".

El test vive en la raíz del proyecto móvil, junto a `app.config.ts`
(colocación que ya manda `docs/conventions.md` §Convenciones de la app
móvil). jest lo recoge con el `testMatch` por defecto — `jest-expo` no lo
restringe — y el preset no resuelve la config de Expo por su cuenta, así
que ningún otro test evaluará `app.config.ts` de rebote. `app.json` se
importa desde el test gracias a `resolveJsonModule: true` de
`expo/tsconfig.base` (mismo mecanismo que ya usa `map.tsx` con
`map-style-dark.json`).

### D6 — EAS Build: documentado, no implementado (R4)

El equivalente de `.env` en EAS Build es una variable de entorno del
proyecto marcada como secret
(`eas env:create --name GOOGLE_MAPS_API_KEY_ANDROID --visibility secret --environment development`)
más `"environment": "development"` en el perfil `development` de
`eas.json` para que el build cargue ese entorno. No se implementa en esta
feature: desde 2026-08-25 los dev builds son **locales** (`expo run:android`),
`eas.json` tiene un perfil `development` que hoy nadie ejecuta, y ninguna
IA puede verificar el cambio sin gastar builds de EAS. Escribir la línea
en `eas.json` sin poder probarla sería añadir configuración muerta; queda
como nota en `docs/verification.md` para el día que se use EAS.

### D7 — `map.tsx` no se toca (R5)

Fijar `provider` no arregla nada: en Android el proveedor por defecto ya
es Google Maps (es la razón del crash), y `PROVIDER_GOOGLE` en iOS
obligaría a una segunda clave y a activar Google Maps en el Podfile. El
`customMapStyle` con `src/theme/map-style-dark.json` también es
específico de Google, así que cambiar de proveedor arrastraría el tema
oscuro del mapa. Cero cambios en `src/` ⇒ el grep-clean C8 sigue limpio
por construcción y las suites móviles no se tocan.

### D8 — El diff no toca `app.json` ni `package.json` (R5)

Cero dependencias nuevas: `react-native-maps@1.27.2` ya está instalada y
su config plugin viaja dentro del paquete. No hace falta `bunx expo
install` ni entra nada en `bun.lock`. `app.json` queda intacto — si el
diff lo modifica, el reviewer rechaza: significaría que alguien duplicó la
config o, peor, pegó la clave en el archivo commiteado.

## Archivos afectados

- `mobile-pet-tracker/app.config.ts` — **NUEVO**. Config dinámica de Expo:
  lee `GOOGLE_MAPS_API_KEY_ANDROID`, añade la tupla del plugin
  `react-native-maps` y avisa si falta (D1–D4). Único archivo de
  "producción" (config de build, fuera de las capas de arquitectura).
- `mobile-pet-tracker/app.config.test.ts` — **NUEVO**. Tests R1, R2, R3.
- `mobile-pet-tracker/.env.example` — +1 línea `GOOGLE_MAPS_API_KEY_ANDROID=`
  con su comentario (R3).
- `docs/verification.md` — nueva sección `### Feature 52 — android-maps-api-key`
  (R4), colocada tras `### Feature 51 — media-bucket-aws-mode`.
- `mobile-pet-tracker/app.json` — **sin cambios** (base estática, D2).
- Harness: `specs/android-maps-api-key/`, `progress/`, `feature_list.json`.

## Alternativas descartadas

- **`android.config.googleMaps.apiKey` en `app.json` con la clave
  literal**: commitea el secreto (y el repo es público-adyacente: la clave
  restringida por package+SHA-1 limita el daño, pero una clave filtrada se
  usa igual desde un APK reempaquetado) **y encima no funciona** (D1).
- **`android.config.googleMaps.apiKey` en `app.config.ts` desde
  `process.env`**: no filtra nada, pero sigue sin escribir la meta-data por
  la cadena de D1. Sería un arreglo que parece correcto, pasa el review y
  vuelve a crashear en el dev build.
- **Lanzar un error si falta la variable** (simetría con
  `MissingMediaBucketNameError`, #51): deadlock con la SHA-1 y CI/`expo
  lint` rotos (D4).
- **Convertir `app.json` entero a `app.config.ts` y borrarlo**: churn sin
  ganancia; todo lo demás de la config es estático (D2).
- **`EXPO_PUBLIC_GOOGLE_MAPS_API_KEY_ANDROID`**: el prefijo inlinearía la
  clave en el bundle JS del APK (D3).
- **Commitear `/android` con la meta-data escrita a mano**: contradice
  `.gitignore` y el modelo managed; se pierde en el siguiente prebuild.
- **Migrar a `expo-maps`**: también exige clave de Android y arrastra la
  reescritura del tab Map y del `customMapStyle`.
- **Test de integración que ejecute `expo prebuild` y grepee el manifest**:
  descarga el template nativo, tarda minutos y necesita red — inviable en
  `init.sh`/CI; su papel lo cubre el `grep` manual de R4 §5 y R6 §1 (D5).
- **Añadir `"environment": "development"` a `eas.json` ahora**:
  configuración que nadie puede verificar hoy (D6).
