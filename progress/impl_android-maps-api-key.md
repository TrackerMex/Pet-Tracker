# Implementación — Feature 52 `android-maps-api-key`

Fecha: 2026-08-28  
Branch: `feature/52-android-maps-api-key`  
Estado: R1–R5 implementados y verificados; R6 reservado al humano.

## Resultado de implementación

- `mobile-pet-tracker/app.config.ts` parte de la config estática que Expo le
  entrega y, cuando existe una clave no vacía, añade al final
  `['react-native-maps', { androidGoogleMapsApiKey }]` con `trim()` aplicado.
- Sin `GOOGLE_MAPS_API_KEY_ANDROID`, la config conserva los plugins de
  `app.json`, emite un único aviso explícito y no lanza.
- La variable privada está documentada sin valor en
  `mobile-pet-tracker/.env.example`; el `.env` móvil real está ignorado por
  git y el nombre no usa el prefijo `EXPO_PUBLIC_`.
- `docs/verification.md` contiene el runbook local y deja el plumbing de EAS
  únicamente documentado.
- No se modificaron `app.json`, `eas.json`, `package.json`, `bun.lock`,
  `src/**`, `backend-pet-tracker/**` ni las carpetas nativas generadas.

## Historia TDD

| Requisito | Rojo | Verde |
|---|---|---|
| R1 | `4396b75` — módulo `./app.config` inexistente | `28906d4` — inyección de la tupla del plugin |
| R2 | `8be06f1` — clave ausente/vacía todavía añadía plugin vacío | `7d1778c` — aviso, no-throw y config base |
| R3 | `729dc24` — variable ausente de `.env.example` | `e4512ad` — nombre privado vacío y sin credenciales |
| R4 | `rg -n "Feature 52" docs/verification.md` → exit 1 | `c234285` — runbook con seis pasos |

## Verificación R5

Comandos que deben salir con exit 0 antes del handoff:

- [x] `bun run --cwd mobile-pet-tracker typecheck` — exit 0.
- [x] `bun run --cwd mobile-pet-tracker lint` — exit 0.
- [x] `bun run --cwd mobile-pet-tracker test` — exit 0: 50 suites,
  545 tests y 1 snapshot.
- [x] `./init.sh` — exit 0 a las 04:38 UTC: build verde; backend unitario
  150 suites/1153 tests; infraestructura 2 suites/14 tests; móvil 50
  suites/545 tests; e2e 21 suites y 336 tests pasados (3 suites/8 tests gated
  omitidos); lint y typecheck verdes.
- [x] `git diff --stat main...HEAD` y `git diff --name-only 60aefe0..HEAD`
  quedan limitados a config/test/env móvil, `docs/`, `specs/` y `progress/`.
  El diff de paths prohibidos (`app.json`, `eas.json`, `package.json`,
  `bun.lock`, `src/**`, `backend-pet-tracker/**`) está vacío.
- [x] Grep-clean C8 sin regresión: 0 hex fuera de `src/theme/`, 0 clases
  arbitrarias, 0 `StyleSheet.create`/shadow/elevation legacy; suite
  `design-drift` 14/14.
- [x] Seguridad/config: 0 patrones `AIza…` versionados; `.env.example` no
  contiene `EXPO_PUBLIC_GOOGLE`; el campo muerto
  `android.config.googleMaps.apiKey` no aparece en la app.
- [x] Resolución integrada: `expo config --json` con `test-key` conserva
  package/name/slug y deja la tupla `react-native-maps` al final; sin la
  variable sale 0 y no contiene esa entrada.

Nota de estabilidad: la primera corrida final de `./init.sh` encontró un flake
preexistente en `src/screens/add-pet/index.test.tsx` (el mock del image picker
devolvió `undefined`). La suite había pasado en la corrida móvil inmediatamente
anterior, se reprodujo de forma dirigida en verde (7/7) sin cambios y la segunda
corrida completa de `./init.sh` terminó con exit 0.

## Guion para el smoke R6 — humano

La clave real no se copia en este documento. Consulta también
`docs/verification.md` §Feature 52.

1. Si todavía no existe el keystore, genera los nativos sin clave (el aviso no
   aborta) y obtén la SHA-1:

   ```bash
   cd /home/claude/sites/Pet-Tracker
   cd mobile-pet-tracker && npx expo prebuild --clean --platform android
   cd android && ./gradlew signingReport
   ```

   En Windows usa `gradlew.bat signingReport`. Alternativa desde
   `mobile-pet-tracker/android`:

   ```bash
   keytool -J-Duser.language=en -list -v -keystore app/debug.keystore -alias androiddebugkey -storepass android -keypass android
   ```

2. En Google Cloud habilita Maps SDK for Android, confirma billing y restringe
   la clave a `com.trackermex.pettracker` + esa SHA-1 y únicamente a Maps SDK
   for Android.
3. Desde `mobile-pet-tracker/`, crea `.env` si falta y añade la clave solo ahí:

   ```bash
   cp .env.example .env
   ```

   Edita `GOOGLE_MAPS_API_KEY_ANDROID=<clave>` sin pegarla en este reporte.
4. Regenera, comprueba que existe exactamente una meta-data e instala el dev
   build:

   ```bash
   npx expo prebuild --clean --platform android
   grep -c "com.google.android.geo.API_KEY" android/app/src/main/AndroidManifest.xml
   bunx expo run:android
   ```

   El `grep` debe imprimir `1`. Si `signingReport` arroja una SHA-1 nueva tras
   `--clean`, actualiza antes la restricción de Google Cloud.
5. Con `docker compose up -d`, el backend local ejecutándose y
   `EXPO_PUBLIC_API_URL` apuntando a la IP LAN, inicia sesión y abre **Map**.
   Verifica tiles de Google, marker y polyline cuando haya posiciones; cambia
   a tema oscuro y confirma que sigue renderizando con `customMapStyle`.
6. Revisa el log después de montar el mapa:

   ```bash
   adb logcat -d | grep -E "API key not found|addViewAt: failed to insert view|Authorization failure|API_KEY_ANDROID_APP_BLOCKED"
   ```

   No deben aparecer `API key not found` ni `addViewAt`. Si aparecen
   `Authorization failure` o `API_KEY_ANDROID_APP_BLOCKED` y el mapa queda
   gris, repite la obtención de SHA-1 y la restricción de package del paso 2.
7. Ejecuta acto seguido el smoke R9 de
   `specs/pet-lost-mode/requirements.md`.

### Resultado del smoke R6 (rellena el humano)

- Fecha: pendiente
- `grep` de meta-data: pendiente (esperado: `1`)
- Map monta y renderiza tiles: pendiente
- Marker/polyline y tema oscuro: pendiente
- `adb logcat` limpio de los crashes: pendiente
- Smoke R9 de `pet-lost-mode`: pendiente
- Resultado final: **PENDIENTE — no marcar #52 `done` todavía**
